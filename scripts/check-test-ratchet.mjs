#!/usr/bin/env node
/**
 * check-test-ratchet.mjs — the PER-TEST suite ratchet (gate restoration, step 15).
 *
 * ── WHY THIS FILE EXISTS ────────────────────────────────────────────────────
 * `npm run test` (`vitest run`) was a BOOLEAN gate at zero failures. Its red
 * stopped everything behind it; the current 17-step chain replaces it with
 * `test:ratchet` at step 15, followed by `build` 16 and `verify:dist` 17:
 *
 *     … && lint && test:ratchet && build && verify:dist
 *                  ^^^^^^^^^^^    ^^^^^   ^^^^^^^^^^^
 *
 * So the outage was never "some tests fail". It was that the production BUILD
 * and `verify:dist` — the dist-contract ratchet — had not run as part of the
 * gate for months. That matters more than it sounds: there is a recorded hazard
 * ("DIST WAS UN-BOOTABLE — chunk-cycle TDZ") in which `build` EXITS 0 while the
 * emitted `dist` cannot boot, and `verify:dist` plus `smoke:boot` are the only
 * guards for exactly that. The former red test phase was hiding the guard against shipping
 * an un-bootable bundle.
 *
 * This is the SAME architectural move that repaired step 12
 * (scripts/check-full-typecheck.mjs), applied three steps later, and it carries
 * that gate's hard-won hardenings: an anti-vacuity sentinel, a scope sentinel,
 * env-var testability seams, and a fail-closed meta-test that drives every
 * failure path with an INJECTED FAKE RUNNER instead of merely asserting it.
 *
 * ── THE JUDGMENT THIS ENCODES (stated so it can be vetoed) ──────────────────
 * Baselining failing tests is uncomfortable and strictly weaker than fixing
 * them. But they are ALREADY failing and ALREADY invisible — a boolean gate
 * nobody can pass tolerates INFINITY and hides every step behind it. A frozen,
 * per-test, ATTRIBUTED census that can only shrink makes those failures
 * COUNTED, OWNED and SHRINK-ONLY, forbids the next regression, and un-darkens
 * the two steps that guard against shipping a bundle that cannot boot.
 * If the owner prefers the boolean, revert this and burn the census down first.
 *
 * ── WHAT IT ENFORCES ────────────────────────────────────────────────────────
 *   1. PER-TEST identity, never per-file. The key is `<relative file> :: <full
 *      test name>`. A FILE-level allowlist would hide every OTHER test in that
 *      file — including ones that break tomorrow — which is the whole reason
 *      this is not a skip-list.
 *   2. EVERY TEST HAS ONE AUTHORITATIVE PHASE. The source-debt ratchet runs
 *      everything except `tests/build/**`; the strict post-build mode runs the
 *      exact recursively discovered build-test set after `dist/` exists. No
 *      test is suppressed: a skipped test is a hole, so source skips remain
 *      ceiling-bound and any build-test non-run is an unconditional failure.
 *   3. SHRINK-ONLY, with BELOW-DEMANDS-RATCHET-DOWN: a baselined test that
 *      starts passing prints a RATCHET DOWN notice naming the re-freeze command,
 *      because a silent pass lets the ceiling drift permanently above the truth,
 *      which is how a ratchet stops ratcheting.
 *   4. A NEW REGRESSION IS NEVER BASELINED. `--update` can only REMOVE entries
 *      and refresh scope figures; it REFUSES to add a failing test it has not
 *      seen before. Banking a new failure is therefore a deliberate hand edit
 *      that must carry an attribution.
 *   5. EVERY ENTRY IS ATTRIBUTED. Each row carries `subsystem`, `cause`,
 *      `introducedAt` and `class`. An entry without an attribution is a defect
 *      being laundered into debt, so tests/lint/testRatchet.test.js refuses one.
 *
 * ── USAGE ───────────────────────────────────────────────────────────────────
 *   npm run test:ratchet          # the gate step (wired into `npm run check`)
 *   npm run test:ratchet:update   # re-freeze after a burn-down (REMOVES only)
 *   npm run verify:dist           # strict all-passed tests/build/** phase
 *   npm run test                  # UNFILTERED vitest — what burn lanes read
 *
 * `npm run test` stays a raw command on purpose: a burn lane needs the whole
 * failure list and the real reporter output, not the ratchet's verdict.
 *
 * ⚠ THE REPORT IS ALWAYS WRITTEN OUTSIDE THE REPO, and always with the
 * `--outputFile=<path>` (equals-sign) spelling. Recorded hazard: a BARE `--json`
 * eats the NEXT POSITIONAL as its output path and silently overwrites that file
 * while exiting 0 — the only tell is `git status`. Never reintroduce a bare flag.
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// TESTABILITY SEAMS (mirroring check-full-typecheck.mjs). The fail-closed
// meta-test injects a FAKE RUNNER and a temp baseline so every failure path is
// EXERCISED without running the real ~710s suite or touching the committed
// baseline. A ratchet whose failure paths are never run is a ratchet nobody has
// proven works.
const baselinePath = () => process.env.TEST_RATCHET_BASELINE
  || path.join(ROOT, 'scripts', '.test-ratchet-baseline.json');

/** Scope-collapse tolerance: below this fraction of the frozen test count, fail. */
export const SCOPE_FLOOR_RATIO = 0.9;
/** The closed set of debt classes. A row outside it is not a considered decision. */
export const DEBT_CLASSES = ['owner-gated', 'debt'];
/** The statuses that mean "this test did not actually execute". */
export const NON_RUN_STATUSES = ['pending', 'skipped', 'todo'];
/** The source phase's one and only exclusion. */
export const SOURCE_TEST_EXCLUDE = 'tests/build/**';
/** Vitest's supported test/spec filename family, used for exact dist discovery. */
const BUILD_TEST_FILE = /\.(?:test|spec)\.(?:[cm]?[jt]sx?)$/;

/** Identity spelling — exported so the meta-test pins the SAME function the gate uses. */
export const identityOf = (file, fullName) => `${file} :: ${fullName}`;

/** Normalize a runner-emitted path to a repo-relative POSIX path. */
export function normalizePath(raw, root = ROOT) {
  const prefix = `${root.split('\\').join('/').replace(/\/+$/, '')}/`;
  let p = String(raw).split('\\').join('/');
  if (p.startsWith(prefix)) p = p.slice(prefix.length);
  return path.posix.normalize(p.replace(/^\.\//, ''));
}

/** Whether a normalized report path belongs to the post-build authority. */
export function isBuildTestPath(raw, root = ROOT) {
  const file = normalizePath(raw, root);
  return file.startsWith('tests/build/');
}

/**
 * Recursively discover the exact post-build test corpus from disk. The result
 * is repo-relative, POSIX, sorted, and independent of `dist/` contents.
 */
export function discoverBuildTestFiles(root = ROOT) {
  const buildRoot = path.join(root, 'tests', 'build');
  const files = [];
  if (fs.existsSync(buildRoot) && fs.lstatSync(buildRoot).isSymbolicLink()) {
    throw new Error(`symbolic link is the strict build-test root: ${normalizePath(buildRoot, root)}`);
  }
  const walk = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const absolute = path.join(dir, entry.name);
      // Vitest follows symlinks. Reject them explicitly instead of silently
      // discovering a smaller authority set than the runner can report.
      if (entry.isSymbolicLink()) {
        throw new Error(`symbolic link in strict build-test corpus: ${normalizePath(absolute, root)}`);
      }
      if (entry.isDirectory()) walk(absolute);
      else if (entry.isFile() && BUILD_TEST_FILE.test(entry.name)) {
        files.push(normalizePath(absolute, root));
      }
    }
  };
  walk(buildRoot);
  return files.sort();
}

/** Normalized suite files named by the runner report, including zero-row suites. */
export function reportFilesOf(report, root = ROOT) {
  const suites = Array.isArray(report?.testResults) ? report.testResults : [];
  return suites.map((suite) => normalizePath(suite.name || suite.file || '', root));
}

/** The exact command used by each phase; exported so the meta-gate pins live bytes. */
export function runnerCommandOf({ verifyDist = false, outputFile }) {
  const output = JSON.stringify(outputFile);
  if (verifyDist) return `npx vitest run tests/build/ --reporter=json --outputFile=${output}`;
  return `npx vitest run --exclude=${JSON.stringify(SOURCE_TEST_EXCLUDE)} --reporter=json --outputFile=${output}`;
}

/**
 * Flatten a vitest/jest JSON report into per-test rows.
 * Exported so the meta-test can prove the identity spelling on real report shapes.
 */
export function rowsOf(report, root = ROOT) {
  const suites = Array.isArray(report?.testResults) ? report.testResults : [];
  const rows = [];
  for (const suite of suites) {
    const file = normalizePath(suite.name || suite.file || '', root);
    for (const a of suite.assertionResults || []) {
      const fullName = a.fullName
        || [...(a.ancestorTitles || []), a.title].filter(Boolean).join(' > ');
      rows.push({ file, fullName, id: identityOf(file, fullName), status: a.status });
    }
  }
  return rows;
}

/**
 * Suites whose FAILURE IS INVISIBLE TO THE PER-TEST CENSUS — the class this
 * ratchet cannot measure and must therefore refuse.
 *
 * ⚠⚠ CR-TRFZ-4. The first spelling caught only suites with ZERO
 * `assertionResults`, and that is not the whole class. MEASURED against the real
 * vitest JSON reporter on 2026-08-10 (isolated four-case probe, one run):
 *
 *   case                      suite.status  suite.message  assertionResults
 *   module-load throw         "failed"      NON-EMPTY      0                  ← caught by length===0
 *   ⚠ beforeAll hook throw    "failed"      **EMPTY**      2, BOTH "skipped"  ← THE GAP
 *   afterAll hook throw       "failed"      non-empty      1 passed           ← also invisible
 *   describe.skip (2 tests)   "passed"      empty          2 "skipped"        ← legitimate
 *   test.todo + test.skip     "passed"      empty          2                  ← legitimate
 *   one genuinely failing test "failed"     empty          1 failed + 1 skip  ← ordinary failure
 *
 * The beforeAll row is the one that bit: the suite FAILED, yet it enumerated its
 * tests as SKIPS, so the census counted N skips, `numFailedTests` read 0, and the
 * whole suite's coverage evaporated into the skip ceiling. The observed-shape
 * readers walker did exactly this — 24 tests, all "skipped", after its corpus
 * hook threw.
 *
 * ⚠⚠ THE DISCRIMINATOR CANNOT BE THE SUITE MESSAGE: it is EMPTY on precisely the
 * beforeAll case that motivates this, so a message-keyed guard fails open on its
 * own motivating instance. The discriminator is `status === 'failed'` with NO
 * failing assertion row — the exact condition under which a suite-level failure
 * leaves no per-test trace. The three legitimate rows above report
 * `status: 'passed'` or carry a failing row, so none of them is caught.
 */
export function uncollectedOf(report, root = ROOT) {
  const suites = Array.isArray(report?.testResults) ? report.testResults : [];
  return suites
    .filter((s) => {
      const results = s.assertionResults || [];
      if (results.length === 0) return true;
      return s.status === 'failed' && !results.some((a) => a.status === 'failed');
    })
    .map((s) => normalizePath(s.name || s.file || '(unnamed suite)', root));
}

/**
 * ⚠⚠ THE SCOPE-COLLAPSE DISGUISE — a run that DIES wears the skip ceiling's clothes.
 *
 * MEASURED 2026-08-10: when four suites' workers died mid-run, vitest's json reporter
 * serialised every one of their result-less tests as `"pending"`. `NON_RUN_STATUSES`
 * counts `pending` as a non-run row, so 71 tests that NEVER RAN surfaced as
 * `skipped tests grew: 182 > ceiling 105`. That message is not merely unhelpful, it is
 * MISDIRECTING: it points the reader at deferred skips (here, the VERIFY_DIST
 * deferrals) while the actual event was the collapse of the run itself. And it is not
 * caught by `uncollectedOf`, because those suites were never marked `status: "failed"` —
 * nothing failed; the worker simply stopped existing.
 *
 * TWO DISCRIMINATORS, both already present in the SAME report and both free:
 *
 *   1. THE COUNT DISAGREEMENT. vitest's own `numPendingTests`/`numTodoTests` count the
 *      tests it DELIBERATELY pended; the per-row census counts every row carrying a
 *      non-run status. On a healthy run the two AGREE (measured: 111 = 111). A
 *      result-less row inflates the row count without moving vitest's counters, so a
 *      POSITIVE GAP is direct evidence of rows serialised as pending rather than pended.
 *   2. THE DEGENERATE CLOCK. A suite that never ran never gets its own start stamp: it
 *      reports `startTime === endTime === report.startTime`. MEASURED on a healthy run,
 *      a suite's clock sits hundreds of ms after the report's (549 ms in the probe that
 *      settled this), so the three-way equality is not something a fast suite reproduces.
 *
 * ⚠⚠ ARM 1 DETECTS AND ARM 2 ONLY NAMES — THE CLOCK MAY NEVER REFUSE ON ITS OWN.
 * An earlier spelling let either arm refuse, on the reasoning that a collapse only one
 * arm can see is still a collapse. THE REAL CORPUS REFUTED IT ON THE FIRST FULL RUN:
 * `tests/security/customContentLockOrder.postgres.test.js` is `ROOT_DATABASE_URL ?
 * describe : describe.skip`, so with no local PostgreSQL the whole suite is a
 * DELIBERATE `describe.skip` — it never starts, and therefore carries the degenerate
 * clock BY CONSTRUCTION while being a perfectly honest skip. vitest counted its row in
 * `numPendingTests`, so arm 1 correctly stayed silent and arm 1 alone was right.
 * A skipped suite and a dead suite are indistinguishable BY CLOCK; only the count
 * disagreement separates them. So the gap is the gate, and the clock list is the
 * naming aid — including for the ceiling subtraction below, which must never fire on
 * a legitimate skip or it would quietly weaken the skip ceiling by that suite's rows.
 *
 * ⚠ Compared against `numPendingTests + numTodoTests`, never `numPendingTests` alone:
 * vitest counts todos in their own field while `NON_RUN_STATUSES` includes `todo`, so
 * the narrower comparison would forge a gap out of ordinary `test.todo` rows.
 */
export function collapsedSuitesOf(report, root = ROOT) {
  const runStart = report?.startTime;
  if (typeof runStart !== 'number') return [];
  const suites = Array.isArray(report?.testResults) ? report.testResults : [];
  return suites
    .filter((s) => {
      const results = s.assertionResults || [];
      // The zero-row case belongs to `uncollectedOf`; this arm is for suites that
      // ENUMERATED their tests and then ran none of them.
      if (results.length === 0) return false;
      if (!results.every((a) => NON_RUN_STATUSES.includes(a.status))) return false;
      return s.startTime === runStart && s.endTime === runStart;
    })
    .map((s) => ({
      file: normalizePath(s.name || s.file || '(unnamed suite)', root),
      rows: (s.assertionResults || []).length,
    }));
}

/** The count disagreement described above. Returns null when the report cannot be asked. */
export function pendingGapOf(report, countedNonRun) {
  const pending = report?.numPendingTests;
  const todo = report?.numTodoTests;
  if (typeof pending !== 'number') return null;
  const declared = pending + (typeof todo === 'number' ? todo : 0);
  const gap = countedNonRun - declared;
  return gap > 0 ? { declared, counted: countedNonRun, gap } : null;
}

const BOOTSTRAP_DOC = 'PER-TEST failure census for the source phase (all tests except tests/build/**).'
  + ' SHRINK-ONLY. A failing test ABSENT'
  + ' from `entries` is a REGRESSION and reds the gate. Every entry MUST carry a full attribution'
  + ' — subsystem, cause, introducedAt, class — or tests/lint/testRatchet.test.js refuses it.'
  + ' `--update` can only REMOVE entries; adding one is a deliberate, attributed hand edit.'
  + ' See scripts/check-test-ratchet.mjs.';

/**
 * The gate. Returns a process exit code; never calls process.exit itself, so the
 * meta-test can drive it in-process as well as by spawn.
 */
export async function run(argv = []) {
  const BASELINE = baselinePath();
  const fail = (lines) => { console.error(lines.join('\n')); return 1; };
  const allowedModes = new Set(['--update', '--bootstrap', '--verify-dist']);
  const unknown = argv.filter((arg) => !allowedModes.has(arg));
  const selectedModes = argv.filter((arg) => allowedModes.has(arg));
  if (unknown.length) {
    return fail([
      `[test-ratchet] unknown argument(s): ${unknown.join(', ')}`,
      '  Allowed modes: default source gate, --update, --bootstrap, or --verify-dist.',
    ]);
  }
  if (selectedModes.length > 1) {
    return fail([
      '[test-ratchet] mode flags are mutually exclusive; --verify-dist is incompatible with',
      '  --update/--bootstrap, and source update/bootstrap cannot be combined with each other.',
    ]);
  }
  const UPDATE = selectedModes[0] === '--update';
  const BOOTSTRAP = selectedModes[0] === '--bootstrap';
  const VERIFY_DIST = selectedModes[0] === '--verify-dist';

  let discoveredBuildFiles = [];
  if (VERIFY_DIST) {
    try {
      discoveredBuildFiles = discoverBuildTestFiles();
    } catch (error) {
      return fail([
        `[test-ratchet] STRICT DIST discovery refused: ${error.message}`,
        '  The runner corpus and the on-disk authority must be unambiguous.',
      ]);
    }
  }
  if (VERIFY_DIST && discoveredBuildFiles.length === 0) {
    return fail([
      '[test-ratchet] STRICT DIST discovered ZERO build test files — failing closed.',
      '  Expected a nonempty recursively discovered tests/build/**/*.{test,spec} corpus.',
    ]);
  }

  // ── Run the suite ─────────────────────────────────────────────────────────
  // vitest exits non-zero when tests fail; that is the NORMAL path here, so do
  // not let execSync throw us off it. The report goes to a temp dir OUTSIDE the
  // repo (see the header hazard note).
  const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'test-ratchet-'));
  const OUT = path.join(TMP, 'results.json');
  let runnerExitedNonZero = false;
  let runnerOutput;
  const runnerEnv = { ...process.env, TEST_RATCHET_OUTPUT_FILE: OUT };
  if (VERIFY_DIST) runnerEnv.VERIFY_DIST = '1';
  else delete runnerEnv.VERIFY_DIST;
  try {
    runnerOutput = execSync(
      process.env.TEST_RATCHET_RUN_CMD
        || runnerCommandOf({ verifyDist: VERIFY_DIST, outputFile: OUT }),
      {
        cwd: ROOT,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
        maxBuffer: 256 * 1024 * 1024,
        // The seam hands a fake runner the very path the real one writes.
        env: runnerEnv,
      },
    );
  } catch (e) {
    runnerExitedNonZero = true;
    runnerOutput = `${e.stdout || ''}${e.stderr || ''}`;
  }

  // ── Anti-vacuity sentinel — "the suite actually ran" ──────────────────────
  // A runner that FAILED TO RUN (bad config, missing binary, OOM kill, a crash
  // during collection) exits non-zero having written no report, or an empty one.
  // Every parse below then yields ZERO failing tests, which reads as "nothing
  // failed" and exits 0: the exact green-on-nothing this ratchet exists to
  // prevent. The exit code is NOT a discriminator, because a suite with real
  // failures also exits non-zero. The discriminator is A PARSEABLE REPORT
  // CONTAINING TESTS. Anything less FAILS CLOSED — and that guards `--update`
  // and `--bootstrap` too: never freeze a census from a broken run.
  if (!fs.existsSync(OUT)) {
    return fail([
      '[test-ratchet] the runner produced NO REPORT — failing closed. This ratchet verified',
      '  NOTHING; it did not measure "0 failures".',
      `  runner exit: ${runnerExitedNonZero ? 'non-zero' : 'zero'}`,
      `  output: ${(runnerOutput || '').trim().slice(0, 2000) || '(no output at all — is vitest installed?)'}`,
      '',
      'A broken-runner vacuous pass is not a green suite. Fix the runner; do not ignore.',
    ]);
  }
  let report;
  try {
    report = JSON.parse(fs.readFileSync(OUT, 'utf8'));
  } catch (e) {
    return fail([
      `[test-ratchet] the runner's JSON report is UNPARSEABLE (${e.message}) — failing closed.`,
      '  An unreadable report proves nothing ran; it is not evidence of zero failures.',
    ]);
  }

  const reportedFiles = reportFilesOf(report);
  const rows = rowsOf(report);
  const uncollected = uncollectedOf(report);

  if (!VERIFY_DIST) {
    const leakedBuildFiles = [...new Set(reportedFiles.filter((file) => isBuildTestPath(file)))].sort();
    if (leakedBuildFiles.length) {
      return fail([
        '[test-ratchet] SOURCE PHASE included tests/build/** even though that corpus belongs',
        '  exclusively to strict post-build verification. The runner ignored the one exclusion:',
        ...leakedBuildFiles.map((file) => `    ${file}`),
      ]);
    }
  }

  if (rows.length === 0) {
    return fail([
      '[test-ratchet] the report contains ZERO TESTS — failing closed.',
      `  suites in report: ${(report.testResults || []).length}`,
      '  A run that collected nothing cannot prove the suite is clean. Zero failures out of',
      '  zero tests is not a pass.',
    ]);
  }

  const failing = rows.filter((r) => r.status === 'failed');
  const skipped = rows.filter((r) => NON_RUN_STATUSES.includes(r.status));
  const liveFailingIds = new Set(failing.map((r) => r.id));
  const liveById = new Map(rows.map((r) => [r.id, r]));
  const totalFiles = new Set(rows.map((r) => r.file)).size;
  const shaOf = () => process.env.TEST_RATCHET_SHA || (() => {
    try { return execSync('git rev-parse HEAD', { cwd: ROOT, encoding: 'utf8' }).trim(); } catch { return 'unknown'; }
  })();

  // ── Strict post-build authority ──────────────────────────────────────
  // There is no baseline and no debt concept here. Once the artifact exists,
  // every on-disk build contract must appear exactly once and pass whole.
  if (VERIFY_DIST) {
    const failures = [];
    const suites = Array.isArray(report?.testResults) ? report.testResults : [];
    const discovered = new Set(discoveredBuildFiles);
    const reported = new Set(reportedFiles);
    const fileCounts = new Map();
    for (const file of reportedFiles) fileCounts.set(file, (fileCounts.get(file) || 0) + 1);
    const duplicateFiles = [...fileCounts].filter(([, count]) => count > 1).map(([file]) => file).sort();
    const outside = [...reported].filter((file) => !isBuildTestPath(file)).sort();
    const missing = discoveredBuildFiles.filter((file) => !reported.has(file));
    const extra = [...reported].filter((file) => !discovered.has(file)).sort();

    if (runnerExitedNonZero) failures.push('  runner exited NON-ZERO; strict dist never banks a runner failure.');
    if (report?.success !== true) {
      failures.push('  report.success is not TRUE; strict dist requires an explicit successful report.');
    }
    const nonPassedSuites = suites
      .filter((suite) => suite.status !== 'passed')
      .map((suite) => `${normalizePath(suite.name || suite.file || '(unnamed suite)')} [${String(suite.status)}]`)
      .sort();
    if (nonPassedSuites.length) {
      failures.push(
        '  suite status was not PASSED:',
        ...nonPassedSuites.map((suite) => `    ${suite}`),
      );
    }
    if (duplicateFiles.length) {
      failures.push(
        '  DUPLICATE reported build-test file(s):',
        ...duplicateFiles.map((file) => `    ${file}`),
      );
    }
    if (outside.length) {
      failures.push(
        '  OUT-OF-SCOPE file(s) escaped tests/build/**:',
        ...outside.map((file) => `    ${file}`),
      );
    }
    if (missing.length) {
      failures.push(
        '  MISSING discovered build-test file(s) from the report:',
        ...missing.map((file) => `    ${file}`),
      );
    }
    if (extra.length) {
      failures.push(
        '  EXTRA reported file(s) absent from recursive on-disk discovery:',
        ...extra.map((file) => `    ${file}`),
      );
    }
    if (uncollected.length) {
      failures.push(
        '  UNCOLLECTED build-test suite(s) produced no measurable failing row:',
        ...uncollected.map((file) => `    ${file}`),
      );
    }

    const duplicateRows = [];
    const rowCounts = new Map();
    for (const row of rows) rowCounts.set(row.id, (rowCounts.get(row.id) || 0) + 1);
    for (const [id, count] of rowCounts) if (count > 1) duplicateRows.push(id);
    if (duplicateRows.length) {
      failures.push(
        '  DUPLICATE build-test row identity/identities:',
        ...duplicateRows.sort().map((id) => `    ${id}`),
      );
    }

    const collapsed = collapsedSuitesOf(report);
    if (collapsed.length) {
      failures.push(
        '  COLLAPSED build-test suite(s) never started:',
        ...collapsed.map((suite) => `    ${suite.file} (${suite.rows} non-run row(s))`),
      );
    }
    const incomplete = rows.filter((row) => !row.file || !row.fullName || row.status !== 'passed');
    for (const status of ['failed', ...NON_RUN_STATUSES]) {
      const matches = incomplete.filter((row) => row.status === status);
      if (matches.length) {
        failures.push(
          `  ${status.toUpperCase()} build-test row(s):`,
          ...matches.map((row) => `    ${row.id}`),
        );
      }
    }
    const unknown = incomplete.filter((row) => !['failed', ...NON_RUN_STATUSES].includes(row.status));
    if (unknown.length) {
      failures.push(
        '  UNKNOWN/INCOMPLETE build-test result row(s):',
        ...unknown.map((row) => `    ${row.id} [${String(row.status)}]`),
      );
    }

    const passedRows = rows.filter((row) => row.status === 'passed').length;
    const failedRows = rows.filter((row) => row.status === 'failed').length;
    const pendingRows = rows.filter((row) => row.status === 'pending' || row.status === 'skipped').length;
    const todoRows = rows.filter((row) => row.status === 'todo').length;
    const counters = [
      ['numTotalTests', rows.length],
      ['numPassedTests', passedRows],
      ['numFailedTests', failedRows],
      ['numPendingTests', pendingRows],
      ['numTodoTests', todoRows],
    ];
    for (const [field, measured] of counters) {
      if (!Number.isInteger(report?.[field]) || report[field] !== measured) {
        failures.push(`  report counter ${field}=${String(report?.[field])} disagrees with ${measured} row(s).`);
      }
    }

    if (failures.length) {
      return fail([
        '[test-ratchet] STRICT DIST REFUSED: every discovered build test must run exactly once and pass.',
        ...failures,
      ]);
    }
    console.log(`[test-ratchet] STRICT DIST OK — ${discoveredBuildFiles.length} discovered/reported file(s), `
      + `${rows.length} test(s), zero failed/non-run/uncollected/missing/extra/duplicate rows.`);
    return 0;
  }

  // ── --bootstrap: mint a census a human must then ATTRIBUTE ────────────────
  if (BOOTSTRAP) {
    if (fs.existsSync(BASELINE)) {
      return fail([
        '[test-ratchet] --bootstrap refused: a baseline already exists.',
        `  ${BASELINE}`,
        '  Bootstrapping over a committed census would silently absorb new regressions as debt.',
        '  Use --update (which can only REMOVE), or hand-add the row with its attribution.',
      ]);
    }
    const entries = {};
    for (const r of [...failing].sort((a, b) => a.id.localeCompare(b.id))) {
      entries[r.id] = {
        file: r.file, test: r.fullName, subsystem: null, cause: null, introducedAt: null, class: null,
      };
    }
    fs.writeFileSync(BASELINE, `${JSON.stringify({
      _doc: BOOTSTRAP_DOC,
      measuredAtSha: shaOf(),
      totalTests: rows.length,
      totalFiles,
      skippedCeiling: skipped.length,
      uncollectedSuites: Object.fromEntries(uncollected.sort().map((f) => [f, {
        subsystem: null, cause: null, introducedAt: null, class: null,
      }])),
      entries,
    }, null, 2)}\n`);
    console.log(`[test-ratchet] BOOTSTRAPPED: ${Object.keys(entries).length} failing test(s) across `
      + `${new Set(failing.map((r) => r.file)).size} file(s); ${rows.length} tests total.`);
    console.log('[test-ratchet] ⚠ EVERY ENTRY HAS A NULL ATTRIBUTION. Fill in subsystem/cause/introducedAt/class');
    console.log('[test-ratchet]   before committing — an unattributed entry is a defect laundered into debt.');
    return 0;
  }

  if (!fs.existsSync(BASELINE)) {
    return fail(['[test-ratchet] no baseline file — run: node scripts/check-test-ratchet.mjs --bootstrap']);
  }
  const baseline = JSON.parse(fs.readFileSync(BASELINE, 'utf8'));
  const entries = baseline.entries || {};
  const frozenBuildPaths = [
    ...Object.entries(entries)
      .filter(([, row]) => isBuildTestPath(row.file))
      .map(([id]) => id),
    ...Object.keys(baseline.uncollectedSuites || {}).filter((file) => isBuildTestPath(file)),
  ].sort();
  if (frozenBuildPaths.length) {
    return fail([
      '[test-ratchet] SOURCE BASELINE contains tests/build/** debt owned by strict dist:',
      ...frozenBuildPaths.map((id) => `    ${id}`),
      '  Build-test failures are never debt-bankable; remove them through the remove-only re-freeze.',
    ]);
  }

  // ── Scope sentinel — "the SUITE that ran is the suite we froze" ───────────
  // The guard above proves a suite RAN; it cannot prove the SAME suite ran.
  // Narrow vitest's `include`, or let a collection error swallow a directory,
  // and the surviving tests still populate the report, the dropped ones report
  // nothing, every banked failure looks fixed, and the gate greens over a suite
  // nobody executed.
  const scopeFailures = [];

  // A suite that throws during COLLECTION reports zero tests, so every test it
  // owns vanishes rather than failing — banked debt inside it would read as
  // repaid. That is silent erasure, so an uncollected suite reds UNLESS it is in
  // the census's own attributed allowlist. `uncollectedSuites` carries the same
  // subsystem/cause/introducedAt/class discipline as `entries`: a collection
  // failure is debt too, and debt is only ever ATTRIBUTED debt.
  const allowedUncollected = baseline.uncollectedSuites || {};
  const newUncollected = uncollected.filter((f) => !allowedUncollected[f]);
  if (newUncollected.length) {
    scopeFailures.push(
      `  ${newUncollected.length} suite(s) FAILED WITHOUT A MEASURABLE TEST — they either produced ZERO`,
      '    tests (a collection error) or failed as a whole while every test they enumerated was a',
      '    SKIP (a `beforeAll`/`afterAll` that threw). Either way every test they own left the',
      '    census instead of being measured, and a skip ceiling cannot see the difference:',
      ...newUncollected.map((f) => `      ${f}`),
    );
  }

  // (1) EXACT MEMBERSHIP: every baselined test whose FILE still exists on disk
  // must still be in the run. A file DELETED from disk is a legitimate
  // ratchet-down (handled below, not fatal); a test that vanished while its file
  // remains is the erasure this sentinel exists for — a rename, a deletion, or a
  // de-registration that makes banked debt read as repaid without a repair.
  //
  // ⚠ NOT UNDER `--update`. This check reds and its own message says "re-freeze
  // explicitly with `npm run test:ratchet:update`" — so if it also fired during
  // the re-freeze, the instruction would name a command that cannot succeed and
  // a legitimately RENAMED test would wedge the ratchet permanently, escapable
  // only by hand-editing the census (exactly the hand edit this design reserves
  // for attributed additions). Under `--update` a vanished row is reported and
  // DROPPED, which is the same treatment a deleted file already gets. The gross
  // case this check exists for — a whole tree falling out of collection — is
  // still caught during `--update` by the count floor and the uncollected guard.
  const vanished = [];
  for (const [id, row] of Object.entries(entries)) {
    const file = row.file || id.split(' :: ')[0];
    if (!fs.existsSync(path.join(ROOT, file))) continue;
    if (!liveById.has(id)) vanished.push(id);
  }
  if (vanished.length && !UPDATE) {
    scopeFailures.push(...vanished.map(
      (id) => `  ${id}: baselined, its file is on disk, but it did NOT RUN — renamed, deleted or de-registered`,
    ));
  }

  // (2) COUNT FLOOR: a collapse in the total test count is a scope event, not
  // routine churn. Deliberate large deletions re-baseline explicitly.
  const floor = Math.floor((baseline.totalTests || 0) * SCOPE_FLOOR_RATIO);
  if (baseline.totalTests && rows.length < floor) {
    scopeFailures.push(
      `  total test count collapsed: ${rows.length} < ${floor} `
      + `(${Math.round(SCOPE_FLOOR_RATIO * 100)}% of the frozen ${baseline.totalTests}) — the gate ran a much smaller suite than it was frozen against`,
    );
  }

  // (3) SCOPE COLLAPSE — judged BEFORE the skip ceiling, because a collapse that
  // reaches the ceiling arm is reported as the wrong event entirely (header note).
  // THE GAP IS THE GATE. The clock is consulted only once the gap has established that
  // a collapse exists — see the header: a `describe.skip` suite has the degenerate clock
  // by construction, so naming on the clock alone refuses honest skips.
  const pendingGap = pendingGapOf(report, skipped.length);
  const collapsed = pendingGap ? collapsedSuitesOf(report) : [];
  const collapsedRows = collapsed.reduce((n, s) => n + s.rows, 0);
  if (pendingGap) {
    scopeFailures.push(
      '  SCOPE COLLAPSE: tests did NOT RUN and were serialised as non-run rows. This is NOT a',
      '    skip — nothing was deferred, a run died. Naming it here rather than letting it reach',
      '    the skip ceiling, which would report the wrong cause:',
      ...(pendingGap ? [
        `      vitest declared ${pendingGap.declared} pending/todo test(s), but the per-test census`
        + ` counted ${pendingGap.counted} non-run row(s) — a gap of ${pendingGap.gap} row(s) that were`,
        '        never pended by anyone: they simply carry no result.',
      ] : []),
      ...(collapsed.length ? [
        `      ${collapsed.length} suite(s) NEVER STARTED (clock never left the run's own start stamp):`,
        ...collapsed.map((s) => `        ${s.file} (${s.rows} row(s) that never ran)`),
      ] : [
        '      no suite could be NAMED by the clock discriminator — investigate the gap above;',
        '        the rows are real whether or not their suite admits to never starting.',
      ]),
    );
  }

  // (4) SKIP CEILING: ⛔ THE TESTS MUST RUN. The cheapest way to green a
  // per-test ratchet is to `.skip` the failing tests, converting measured debt
  // into an invisible hole while the ratchet reports a win. The suite-wide skip
  // count is therefore frozen and may only shrink.
  //
  // ⚠ Collapsed rows are SUBTRACTED first: they are not skips, and charging them to
  // this ceiling is exactly the misdirection arm (3) exists to end. A skip ceiling
  // genuinely breached on top of a collapse still reds, on the ADJUSTED figure.
  if (baseline.skippedCeiling !== undefined) {
    const realSkips = skipped.length - collapsedRows;
    if (realSkips > baseline.skippedCeiling) {
      scopeFailures.push(
        `  skipped tests grew: ${realSkips} > ceiling ${baseline.skippedCeiling}`
        + (collapsedRows ? ` (after subtracting ${collapsedRows} collapsed non-run row(s))` : ''),
        '    A skipped test is not debt, it is a HOLE. Run it, or burn it down — do not skip it.',
      );
    }
  }

  if (scopeFailures.length) {
    return fail([
      '[test-ratchet] SCOPE SENTINEL: the gate is no longer running what it was frozen to run — a pass here would be VACUOUS:',
      ...scopeFailures,
      '',
      'Check the vitest include/exclude and any collection errors above. If the change is',
      'deliberate, re-freeze explicitly with `npm run test:ratchet:update`.',
    ]);
  }

  // ── --update: re-freeze, REMOVE-ONLY ──────────────────────────────────────
  // THE ARCHIVE-CENSUS LAW: a shared tree is LIVE — a concurrent lane's
  // UNCOMMITTED edits are in it, and a census measured over them banks a number
  // that belongs to no commit. So the freeze is taken in an integrity-counted
  // checkout of a COMMITTED sha, and TEST_RATCHET_SHA carries the sha actually
  // measured. Never hand-edit it in after.
  if (UPDATE) {
    const unknown = [...liveFailingIds].filter((id) => !entries[id]).sort();
    if (unknown.length) {
      return fail([
        '[test-ratchet] --update REFUSED: these failing tests are not in the census, and',
        '  `--update` NEVER BANKS A NEW REGRESSION:',
        ...unknown.map((id) => `    ${id}`),
        '',
        'Fix them. If one is genuinely deferred debt, add it BY HAND with its full attribution',
        '(subsystem, cause, introducedAt, class) — that hand edit is the point: an unattributed',
        'entry is a defect being laundered into debt.',
      ]);
    }
    const kept = {};
    const dropped = [];
    for (const [id, row] of Object.entries(entries)) {
      if (liveFailingIds.has(id)) kept[id] = row; else dropped.push(id);
    }
    fs.writeFileSync(BASELINE, `${JSON.stringify({
      ...baseline,
      _doc: BOOTSTRAP_DOC,
      measuredAtSha: shaOf(),
      totalTests: rows.length,
      totalFiles,
      skippedCeiling: Math.min(baseline.skippedCeiling ?? skipped.length, skipped.length),
      entries: Object.fromEntries(Object.entries(kept).sort(([a], [b]) => a.localeCompare(b))),
    }, null, 2)}\n`);
    console.log(`[test-ratchet] baseline updated: ${Object.keys(kept).length} failing test(s) remain, `
      + `${dropped.length} removed.`);
    if (dropped.length) console.log(dropped.map((id) => `  - ${id}`).join('\n'));
    if (vanished.length) {
      console.log(`[test-ratchet] ⚠ ${vanished.length} of those did not RUN AT ALL (their file is still on disk).`);
      console.log('  They were renamed, deleted or de-registered rather than fixed. Confirm each was');
      console.log('  intentional — this re-freeze bank a win for every one of them:');
      console.log(vanished.map((id) => `    ? ${id}`).join('\n'));
    }
    return 0;
  }

  // ── The ratchet ───────────────────────────────────────────────────────────
  // PER-TEST comparison, never `failCount <= baseline.failCount`: slack banked
  // on one test must never fund a regression in another.
  const regressions = [...liveFailingIds].filter((id) => !entries[id]).sort();

  // A baselined test that turns up SKIPPED is not repaid debt — it is the debt
  // hidden. Per-entry verdict, so it lives here rather than in the scope block.
  const hidden = Object.keys(entries)
    .filter((id) => NON_RUN_STATUSES.includes(liveById.get(id)?.status))
    .sort();

  if (regressions.length || hidden.length) {
    const lines = ['[test-ratchet] TEST REGRESSIONS (fix them; do not widen the census):'];
    if (regressions.length) {
      lines.push(`  ${regressions.length} failing test(s) NOT in the frozen census:`);
      lines.push(...regressions.map((id) => `    ${id}`));
    }
    if (hidden.length) {
      lines.push(`  ${hidden.length} baselined test(s) are now SKIPPED — a skipped test is a HOLE, not a fix:`);
      lines.push(...hidden.map((id) => `    ${id}`));
    }
    lines.push('');
    lines.push(`Frozen census is ${Object.keys(entries).length} failing test(s), measured at ${baseline.measuredAtSha || 'unknown'}.`);
    lines.push('Run `npm run test` for the unfiltered reporter output.');
    return fail(lines);
  }

  // An allowlisted collection failure that now COLLECTS is a real win, and the
  // allowlist must not keep granting it a hole it no longer needs.
  const nowCollecting = Object.keys(allowedUncollected).filter((f) => !uncollected.includes(f));

  const repaired = Object.keys(entries).filter((id) => !liveFailingIds.has(id));
  if (nowCollecting.length) {
    console.log(`[test-ratchet] RATCHET DOWN: ${nowCollecting.length} allowlisted suite(s) now COLLECT — `
      + 'remove them from `uncollectedSuites` and re-freeze:');
    console.log(nowCollecting.map((f) => `  ✔ ${f}`).join('\n'));
  }
  if (repaired.length) {
    console.log(
      `[test-ratchet] OK — no regressions, and ${repaired.length} baselined test(s) no longer fail `
      + `(${liveFailingIds.size} < ${Object.keys(entries).length}). RATCHET DOWN: run `
      + '`npm run test:ratchet:update` to bank the win.',
    );
    console.log(repaired.map((id) => `  ✔ ${id}`).join('\n'));
  } else {
    console.log(`[test-ratchet] OK — no test regressions (${liveFailingIds.size} known failure(s) `
      + `of ${rows.length} tests, ceiling ${Object.keys(entries).length}).`);
  }
  return 0;
}

const invokedDirectly = process.argv[1]
  && path.relative(process.argv[1], fileURLToPath(import.meta.url)) === '';
if (invokedDirectly) process.exit(await run(process.argv.slice(2)));
