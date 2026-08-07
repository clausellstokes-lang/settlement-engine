#!/usr/bin/env node
/**
 * check-test-ratchet.mjs — the PER-TEST suite ratchet (gate restoration, step 12).
 *
 * ── WHY THIS FILE EXISTS ────────────────────────────────────────────────────
 * `npm run test` (`vitest run`) is a BOOLEAN gate at zero failures, and it is
 * step 12 of the 14-step `&&` chain in `npm run check`. It is red. Because the
 * chain is `&&`, everything BEHIND it stopped running with it:
 *
 *     … && lint && test && build && verify:dist
 *                  ^^^^ red   ^^^^^   ^^^^^^^^^^^  <-- BOTH DARK since 2026-08-02
 *
 * So the outage was never "some tests fail". It was that the production BUILD
 * and `verify:dist` — the dist-contract ratchet — had not run as part of the
 * gate for months. That matters more than it sounds: there is a recorded hazard
 * ("DIST WAS UN-BOOTABLE — chunk-cycle TDZ") in which `build` EXITS 0 while the
 * emitted `dist` cannot boot, and `verify:dist` plus `smoke:boot` are the only
 * guards for exactly that. A red step 12 was hiding the guard against shipping
 * an un-bootable bundle.
 *
 * This is the SAME architectural move that repaired step 9
 * (scripts/check-full-typecheck.mjs), applied one step later, and it carries
 * step 9's hard-won hardenings: an anti-vacuity sentinel, a scope sentinel,
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
 *   2. THE TESTS ARE RUN. This ratchet reads RESULTS; it never suppresses
 *      execution, never passes `--exclude`, and never marks anything `.skip`.
 *      A skipped test is not debt, it is a hole — so a baselined test that
 *      turns up SKIPPED reds the gate, and the suite-wide skip count has its
 *      own frozen ceiling.
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

/** Identity spelling — exported so the meta-test pins the SAME function the gate uses. */
export const identityOf = (file, fullName) => `${file} :: ${fullName}`;

/** Normalize a runner-emitted path to a repo-relative POSIX path. */
export function normalizePath(raw, root = ROOT) {
  const prefix = `${root.split('\\').join('/').replace(/\/+$/, '')}/`;
  let p = String(raw).split('\\').join('/');
  if (p.startsWith(prefix)) p = p.slice(prefix.length);
  return p.replace(/^\.\//, '');
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

/** Suites that produced ZERO tests — an import error, a top-level throw, a collection timeout. */
export function uncollectedOf(report, root = ROOT) {
  const suites = Array.isArray(report?.testResults) ? report.testResults : [];
  return suites
    .filter((s) => (s.assertionResults || []).length === 0)
    .map((s) => normalizePath(s.name || s.file || '(unnamed suite)', root));
}

const BOOTSTRAP_DOC = 'PER-TEST failure census for `vitest run`. SHRINK-ONLY. A failing test ABSENT'
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
  const UPDATE = argv.includes('--update');
  const BOOTSTRAP = argv.includes('--bootstrap');
  const fail = (lines) => { console.error(lines.join('\n')); return 1; };

  // ── Run the suite ─────────────────────────────────────────────────────────
  // vitest exits non-zero when tests fail; that is the NORMAL path here, so do
  // not let execSync throw us off it. The report goes to a temp dir OUTSIDE the
  // repo (see the header hazard note).
  const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'test-ratchet-'));
  const OUT = path.join(TMP, 'results.json');
  let runnerExitedNonZero = false;
  let runnerOutput;
  try {
    runnerOutput = execSync(
      process.env.TEST_RATCHET_RUN_CMD
        || `npx vitest run --reporter=json --outputFile=${JSON.stringify(OUT)}`,
      {
        cwd: ROOT,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
        maxBuffer: 256 * 1024 * 1024,
        // The seam hands a fake runner the very path the real one writes.
        env: { ...process.env, TEST_RATCHET_OUTPUT_FILE: OUT },
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

  const rows = rowsOf(report);
  const uncollected = uncollectedOf(report);
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
      `  ${newUncollected.length} suite(s) produced ZERO tests — they failed to COLLECT, so every test`,
      '    they own vanished from the census instead of being measured:',
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

  // (3) SKIP CEILING: ⛔ THE TESTS MUST RUN. The cheapest way to green a
  // per-test ratchet is to `.skip` the failing tests, converting measured debt
  // into an invisible hole while the ratchet reports a win. The suite-wide skip
  // count is therefore frozen and may only shrink.
  if (baseline.skippedCeiling !== undefined && skipped.length > baseline.skippedCeiling) {
    scopeFailures.push(
      `  skipped tests grew: ${skipped.length} > ceiling ${baseline.skippedCeiling}`,
      '    A skipped test is not debt, it is a HOLE. Run it, or burn it down — do not skip it.',
    );
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
