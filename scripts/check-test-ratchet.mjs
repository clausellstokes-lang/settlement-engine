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
 *   6. EVERY ENTRY DECLARES ITS MAGNITUDE. Banking a row freezes its EXISTENCE;
 *      the magnitude is what freezes its SIZE. Every surviving census row is an
 *      enforcement walker whose verdict is a POPULATION, not a boolean, so
 *      without this the contents behind a permitted red grow invisibly — measured
 *      at +109 em dashes across 29 files with every gate green (ODQ §854). See
 *      THE MAGNITUDE CEILING block further down.
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
 * ── ⛔⛔ THE DEFAULT MODE RUNS THE WHOLE SUITE ───────────────────────────────
 * SAY IT PLAINLY, BECAUSE THE ABSENCE OF `--update` READS AS "READ-ONLY" AND IS NOT:
 * the bare invocation — and `--update`, `--bootstrap` and `--verify-dist` alike —
 * SHELLS OUT TO `npx vitest run` (see `runnerCommandOf` and the `execSync` inside
 * `run`). Not one of the four modes merely reads the census. A receipt telling the
 * next lane this script is "read-only, no --update, therefore hold-safe" is WRONG,
 * and one did: it would have broken a vitest hold (docket §899, finding 2).
 *
 * ⛔ UNDER A VITEST HOLD USE `--dry` OR `--from-log`. Both spawn NOTHING:
 *
 *   node scripts/check-test-ratchet.mjs --dry
 *       Prints the exact runner argv that WOULD be spawned, the report path it would
 *       be written to, the baseline path, and every ceiling the gate would judge
 *       against — then exits 0 having spawned nothing and written nothing. It is a
 *       PURE REPORTER: it combines with --update/--bootstrap/--verify-dist to show
 *       that phase's argv, and it returns BEFORE any baseline write, so even
 *       `--update --dry` re-freezes nothing.
 *
 *   node scripts/check-test-ratchet.mjs --from-log <report.json>
 *       Computes the verdict from an ALREADY-CAPTURED `--reporter=json` report
 *       instead of spawning a runner. Same census, same ceilings, same exit codes —
 *       the report is the only thing that changes hands. Either spelling works:
 *       `--from-log <path>` or `--from-log=<path>`.
 *       ⛔ REFUSED with `--update`/`--bootstrap`. Those FREEZE a census, and the
 *       header law above is "never freeze a census from a broken run"; a census
 *       frozen from a file the CALLER supplies is not one this gate measured at all.
 *
 * ⚠ THE REPORT IS ALWAYS WRITTEN OUTSIDE THE REPO, and always with the
 * `--outputFile=<path>` (equals-sign) spelling. Recorded hazard: a BARE `--json`
 * eats the NEXT POSITIONAL as its output path and silently overwrites that file
 * while exiting 0 — the only tell is `git status`. Never reintroduce a bare flag.
 * The same law binds the stable last-red copy taken on a regression red: it lives
 * in `os.tmpdir()`, never in the tree.
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
/**
 * The closed set of MODE words (the default source gate is the empty argv). EXPORTED so a
 * test claiming to cover "every mode" iterates the producer's own list instead of a hand
 * copy that a fifth mode would silently escape — and so the allowed-modes help line below
 * cannot drift from what the gate actually accepts.
 */
export const MODE_FLAGS = Object.freeze(['--update', '--bootstrap', '--verify-dist']);
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
 * Split the READ-ONLY flags out of argv, leaving the MODE words untouched.
 *
 * ⛔ EVERY EXISTING CALLER IS UNTOUCHED BY CONSTRUCTION, and that is the point of
 * doing this in a separate pass rather than widening `allowedModes`: an argv carrying
 * neither `--dry` nor `--from-log` comes back with `rest` equal to the argv that went
 * in — same members, same order — plus `dry: false` and `fromLog: null`. So the
 * unknown-argument refusal, the mode-exclusivity refusal and the mode selection all
 * see exactly the bytes they saw before these flags existed. Widening `allowedModes`
 * instead would have made `--dry --verify-dist` "two mutually exclusive modes"; these
 * are MODIFIERS of a phase, not phases.
 *
 * `--from-log` takes a path in either spelling. A missing or flag-shaped value is an
 * ERROR, never a silent default: a `--from-log` run that quietly fell back to spawning
 * the suite would be the exact failure the flag exists to prevent.
 *
 * @param {string[]} argv
 * @returns {{ dry: boolean, fromLog: string|null, rest: string[], error: string|null }}
 */
export function parseReadOnlyArgs(argv = []) {
  /** @type {string[]} */
  const rest = [];
  let dry = false;
  /** @type {string|null} */
  let fromLog = null;
  /** @type {string|null} */
  let error = null;
  const setLog = (value, spelling) => {
    if (fromLog !== null) error ??= `--from-log was given twice (second: ${spelling})`;
    else if (!value) error ??= `${spelling} needs a report path`;
    else fromLog = value;
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--dry') { dry = true; continue; }
    if (arg === '--from-log') {
      const next = argv[i + 1];
      // A following flag is NOT a path. Consuming it would swallow the caller's mode
      // word and run a phase they did not ask for.
      if (next === undefined || next.startsWith('--')) {
        error ??= `--from-log needs a report path (got ${next === undefined ? 'nothing' : JSON.stringify(next)})`;
        continue;
      }
      setLog(next, '--from-log <path>');
      i += 1;
      continue;
    }
    if (arg.startsWith('--from-log=')) {
      setLog(arg.slice('--from-log='.length), '--from-log=<path>');
      continue;
    }
    rest.push(arg);
  }
  return { dry, fromLog, rest, error };
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
      rows.push({
        file,
        fullName,
        id: identityOf(file, fullName),
        status: a.status,
        // ⚠ CARRIED VERBATIM, NEVER SYNTHESISED. These two fields are the whole
        // evidence a red used to destroy (see THE EVIDENCE BLOCK below). They are
        // passed through EXACTLY as the runner wrote them — `undefined` when the
        // report omits them — so a report shape that carries neither produces the
        // same row object it always did.
        duration: a.duration,
        failureMessages: a.failureMessages,
      });
    }
  }
  return rows;
}

/**
 * ── ⚠⚠ THE EVIDENCE BLOCK — why a red now prints its own cause ───────────────
 *
 * Until 2026-08-22 this gate printed a failing row's IDENTITY and nothing else.
 * The `duration` and `failureMessages` were parsed and dropped, and the vitest
 * JSON landed under a random `mkdtempSync` name that was never printed. The
 * effect, measured over four full-suite runs (HUNT-1, ODQ §355→§358): **a
 * per-test TIMEOUT and a genuine value mismatch were indistinguishable at the
 * only surface anyone reads**, so every stray red had to be re-run, re-isolated
 * and argued about from scratch — while the report that settled it in one line
 * sat orphaned in TMPDIR among hundreds of nameless siblings.
 *
 * ⛔ THIS CHANGES WHAT A RED *SAYS*, NEVER WHEN IT FIRES. No verdict, ceiling,
 * baseline comparison or exit code below is touched by anything in this section.
 *
 * ── THE MEASURED SHAPES (recovered reports, vitest 4.1.8, 2026-08-22) ────────
 * The classification had to be derived from the JSON, because the JSON does not
 * say "timeout" anywhere:
 *
 *   row                                   duration   failureMessages[0] first line
 *   distribution.test.js (timeout kill)   56,955ms   Error: STACK_TRACE_ERROR
 *   lawBandTable.walker (timeout kill)    20,528ms   Error: STACK_TRACE_ERROR
 *   npcAuthoringScope (query budget)       5,470ms   Error: Unable to find role="button" …
 *   the 11 census rows (real debt)        0–182ms    AssertionError: expected 1435 to be …
 *
 * ⚠⚠ THE PROSE `Test timed out in 20000ms` IS **CLI-ONLY** AND NEVER REACHES THE
 * JSON. Read `makeTimeoutError` in @vitest/runner: it builds that message and then
 * OVERWRITES `error.stack` with the stack of a placeholder `new Error('STACK_TRACE_ERROR')`
 * captured at the `it(` call site. The JSON reporter serialises the STACK, so the
 * prose is lost and the marker is what survives. Measured: `'timed out'` appears in
 * ZERO of the four recovered reports' failure messages. A classifier keyed on the
 * prose would therefore fail OPEN on every real timeout in this estate.
 */

/** vitest 4's own non-browser default — used ONLY when no config names a budget. */
export const VITEST_DEFAULT_TEST_TIMEOUT = 5000;

/** The closed set of classes a failing row can be sorted into. */
export const FAILURE_CLASSES = ['TIMEOUT', 'QUERY-BUDGET', 'ASSERTION', 'UNCLASSIFIED'];

/** Config files that could plausibly carry the suite-wide budget, in resolution order. */
const TIMEOUT_CONFIG_FILES = [
  'vitest.config.js', 'vitest.config.mjs', 'vitest.config.ts', 'vite.config.js', 'vite.config.mjs',
];

/**
 * The suite-wide per-test budget, read from the vitest config by TEXT rather than
 * by import: importing the config would pull the whole vite plugin graph into a
 * gate that must stay cheap and must never fail because a plugin threw. A missed
 * read degrades to vitest's own default and SAYS SO in the printed source, so the
 * reader is never shown a budget the run did not use without being told.
 */
export function globalTestTimeoutOf(root = ROOT) {
  for (const name of TIMEOUT_CONFIG_FILES) {
    const file = path.join(root, name);
    if (!fs.existsSync(file)) continue;
    let match = null;
    try {
      match = /\btestTimeout\s*:\s*(\d+)/.exec(fs.readFileSync(file, 'utf8'));
    } catch {
      // An unreadable config names no budget; fall through to the next candidate.
    }
    if (match) return { budget: Number(match[1]), source: `${name} testTimeout` };
  }
  return { budget: VITEST_DEFAULT_TEST_TIMEOUT, source: "vitest's own default (no config testTimeout found)" };
}

/**
 * Every explicit millisecond budget DECLARED IN ONE TEST FILE'S SOURCE — the
 * trailing-argument spelling (a four-digit-or-longer number passed after the test
 * body's closing brace) and the options spelling (a `timeout` key with a
 * three-digit-or-longer value). Both are budgets the file gave itself, and either
 * can put a row's real ceiling far above the suite-wide one.
 *
 * ⚠ STATED AGAINST INTEREST: this is a TEXT scan over the WHOLE file, comments
 * included, so it cannot tell a per-test vitest override from a Testing Library
 * query budget, and it cannot tell WHICH test an override belongs to. Comments are
 * deliberately NOT stripped: a missed literal NARROWS the threshold, and a narrow
 * threshold is the only direction that can INVENT a TIMEOUT label on a genuine
 * assertion failure. A falsely wide one merely costs a label, because the
 * `STACK_TRACE_ERROR` arm convicts every real vitest kill whatever the threshold
 * says. So the scan errs wide on purpose, and the literals are PRINTED rather than
 * silently folded in.
 *
 * ⛔ IT WAS NOT ERRING WIDE. MEASURED 2026-08-31 (TE-BUDGET-1), the digit-only spellings
 * below read ZERO literals out of `tests/joins/ordering.test.js` — THIS GATE'S OWN NAMED
 * HOUSE PRECEDENT for the cure it recommends — because `60_000` carries a NUMERIC
 * SEPARATOR and `\d{4,}` needs four CONSECUTIVE digits. 106 test files spell their budget
 * that way. Every one of them was being classified against the 20,000 ms suite budget it
 * had explicitly overridden, which is exactly the narrow threshold this header calls the
 * only direction able to INVENT a TIMEOUT label on a genuine assertion failure. The
 * separator is house style, not a different budget, so it is now read as one.
 *
 * ⚠ WHAT IS STILL MISSED, STATED RATHER THAN LEFT TO BE RE-FOUND: a budget passed as a
 * NAMED CONSTANT (`}, CORPUS_BUDGET_MS)` — tests/lint/siteCoherenceRatchet.test.js:70,
 * a 120,000 ms budget) is invisible to a text scan and stays invisible. Resolving it needs
 * const-folding, which is a different instrument; it is docketed, not silently accepted.
 *
 * ⛔ NOTHING THIS FUNCTION RETURNS CAN CHANGE A VERDICT. Its output reaches only
 * `evidenceFor`, which appends PRINTED lines to failure arrays that are already non-empty,
 * and feeds `classifyFailure`'s budget. No threshold, exit code or census row moves.
 */
export function timeoutLiteralsOf(src) {
  const found = new Set();
  /** `60_000` and `60000` are ONE budget written two ways; the separator is house style. */
  const NUMERAL = String.raw`\d[\d_]*\d|\d`;
  const digitsOf = (raw) => raw.replace(/_/g, '');
  // The length floors are unchanged and are applied to the SEPARATOR-FREE digits, so
  // `}, 999)` is still an argument list and `{ timeout: 50 }` is still not a budget.
  for (const m of String(src).matchAll(new RegExp(String.raw`\}\s*,\s*(${NUMERAL})\s*\)`, 'g'))) {
    const digits = digitsOf(m[1]);
    if (digits.length >= 4) found.add(Number(digits));
  }
  for (const m of String(src).matchAll(new RegExp(String.raw`\btimeout\s*:\s*(${NUMERAL})\b`, 'g'))) {
    const digits = digitsOf(m[1]);
    if (digits.length >= 3) found.add(Number(digits));
  }
  return [...found].sort((a, b) => a - b);
}

/**
 * Sort ONE failing row into the closed class set above.
 *
 * ORDER IS THE DESIGN. The arms run strongest-evidence first, and each is
 * measured rather than assumed:
 *   1. the runner NAMED the timeout (never seen in vitest 4's JSON; kept because a
 *      reporter that starts emitting `error.message` must not silently reclassify);
 *   2. the `STACK_TRACE_ERROR` marker on the FIRST LINE — the surviving fingerprint
 *      of a timeout kill, and first-line-only so a marker buried in a stack cannot
 *      relabel an assertion;
 *   3. duration at or past the budget — the arm that needs no message at all, and
 *      the one that still works when the runner writes nothing but a number;
 *   4. a library query budget (Testing Library's `Unable to find …`), which is a
 *      COST failure too but of a different budget, so it is named separately;
 *   5. an assertion signal — a real verdict, i.e. the only class that is DEBT.
 */
export function classifyFailure({ duration, message, budget }) {
  const text = String(message || '');
  const firstLine = text.split('\n', 1)[0];
  const ms = Number.isFinite(duration) ? duration : null;
  if (/\b(?:Test|Hook) timed out in \d+\s*ms/i.test(text)) {
    return { class: 'TIMEOUT', why: 'the runner named the timeout in its own message' };
  }
  if (/^\s*Error:\s*STACK_TRACE_ERROR\b/.test(firstLine)) {
    return {
      class: 'TIMEOUT',
      why: 'vitest serialises a timeout kill as `Error: STACK_TRACE_ERROR`'
        + " with the stack captured at the test's own registration site",
    };
  }
  if (ms !== null && Number.isFinite(budget) && ms >= budget) {
    return { class: 'TIMEOUT', why: 'the row ran at or past its whole budget' };
  }
  if (/Unable to find\b|Timed out in waitFor|exceeded timeout of \d+/i.test(firstLine)) {
    return { class: 'QUERY-BUDGET', why: 'a library query budget expired (Testing Library), not the suite-wide one' };
  }
  if (/AssertionError\b|\bexpected\b/i.test(firstLine)) {
    return { class: 'ASSERTION', why: 'a real verdict — read the message' };
  }
  return { class: 'UNCLASSIFIED', why: 'no timeout signal and no assertion signal — open the full report' };
}

/**
 * The two evidence lines printed UNDER a failing row's identity. Exported so the
 * meta-test drives the exact bytes the gate emits rather than a re-implementation.
 */
export function failureEvidenceOf(row, { budget, budgetSource, literals = [] } = {}) {
  const raw = Number.isFinite(row?.duration) ? row.duration : null;
  // A sub-millisecond row rounds to `0ms`, which reads as "no measurement" — the
  // one thing this line exists to stop being ambiguous about.
  const ms = raw === null ? null : (raw > 0 && Math.round(raw) === 0 ? '<1ms' : `${Math.round(raw)}ms`);
  const message = (row?.failureMessages || [])[0] || '';
  const firstLine = message.split('\n', 1)[0].trim();
  const verdict = classifyFailure({ duration: row?.duration, message, budget });
  const declared = literals.length ? `; the file also declares ${literals.join('ms, ')}ms` : '';
  return [
    `      ${verdict.class} · ran ${ms === null ? 'an unrecorded duration' : ms}`
    + ` against a ${budget}ms budget (${budgetSource}${declared}) — ${verdict.why}`,
    `      msg: ${firstLine || '(the report carried no failure message)'}`,
  ];
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

/**
 * ── ⚠⚠ THE MAGNITUDE CEILING — why a BANKED row now has to say how big it is ──
 *
 * THE DEFECT THIS CLOSES (ODQ §854, TE-VOICE-1's report; chartered as TE-RATCHET-MAG).
 * The permit is one line — the regression filter below drops any id present in
 * `entries` and asks NOTHING further. That is correct for an ordinary failing test,
 * whose verdict is a boolean: it fails, it is banked, there is nothing more to
 * measure. It is WRONG for the only kind of row this census still holds.
 *
 * EVERY surviving census row is a LEDGERED ENFORCEMENT WALKER (tests/lint/testRatchet.test.js
 * asserts that partition), and a walker's verdict is not a boolean — it is a POPULATION.
 * `expected 1037 to be less than or equal to 670` fails identically at 1037, at 1400 and at
 * ten thousand. So banking the row froze its EXISTENCE and left its CONTENTS unbounded:
 *
 *   MEASURED, §854: banking the per-TEST rows collapsed ~150 per-FILE guards into 4
 *   permitted reds, and the population then grew +109 em dashes across 29 further files
 *   WITH EVERY GATE GREEN.
 *
 * That is the house's own A-RED-RATCHET'S-CONTENTS-GROW-INVISIBLY hazard, which had been
 * measured for the lighting walker and never for this one.
 *
 * ── THE CURE: A CEILING BESIDE THE ROW COUNT ────────────────────────────────
 * A banked row now declares one or more MEASURES over the failure message the runner
 * ALREADY carried (see `rowsOf` — `failureMessages` is passed through verbatim, so this
 * costs no extra runner work and invents no new source of truth). Each measure names a
 * pattern, an extractor kind, and a frozen ceiling. The row stays banked; its SIZE does not.
 *
 *   kind      what it reads                                    the growth it catches
 *   capture   one capture group of the FIRST match             a total that rises
 *   count     how many times the pattern matches               a roster that gains members
 *   sum       one capture group summed over EVERY match        a per-item inventory that
 *                                                              deepens anywhere in it
 *
 * `sum` is the one that answers the measured defect above: a per-file arm listing
 * `current em:66` per drifted file rises when a NEW file joins AND when an EXISTING file
 * deepens, which a member count alone cannot see.
 *
 * ⛔ FAIL CLOSED, AND THE DIRECTION MATTERS. A banked row that is FAILING and whose
 * pattern matches NOTHING is REFUSED, never passed. A message that no longer carries its
 * declared measure has not been measured, and an unmeasured magnitude is not a small one —
 * it is an unknown one, which is the exact state this instrument exists to end. Note the
 * asymmetry that makes zero matches unambiguous: if the debt had genuinely gone to zero the
 * row would be PASSING, and a passing row is handled by the ratchet-down path and never
 * reaches here at all.
 *
 * ⛔ AND `--update` MAY ONLY LOWER A CEILING. It re-freezes each magnitude at
 * `min(frozen, measured)`, exactly as it already does for `skippedCeiling`. A re-freeze that
 * could RAISE one would let the next growth bank itself silently — which is the STRIP-never-raise
 * ruling (ODQ line 266) applied to the figure rather than to the row.
 */
export const MAGNITUDE_KINDS = ['capture', 'count', 'sum'];

/**
 * Measure ONE declared magnitude against ONE failure message.
 * Returns `{ ok: true, measured }` or `{ ok: false, why }` — never throws, because a
 * malformed spec must RED the gate with an explanation, not crash it into a vacuous exit.
 * Exported so the meta-test drives the SAME function the gate uses.
 */
export function measureMagnitude(spec, message) {
  const text = String(message ?? '');
  if (!spec || typeof spec !== 'object' || Array.isArray(spec)) {
    return { ok: false, why: 'the measure is not an object' };
  }
  const {
    name, kind, pattern, ceiling,
  } = spec;
  const group = Number.isInteger(spec.group) ? spec.group : 1;
  if (typeof name !== 'string' || !name.trim()) {
    return { ok: false, why: 'the measure has no `name` — a nameless figure cannot be argued with' };
  }
  if (!MAGNITUDE_KINDS.includes(kind)) {
    return { ok: false, why: `\`kind\` must be one of ${MAGNITUDE_KINDS.join('|')} (got ${JSON.stringify(kind)})` };
  }
  if (typeof pattern !== 'string' || !pattern) {
    return { ok: false, why: 'the measure declares no `pattern`' };
  }
  if (!Number.isInteger(ceiling) || ceiling < 0) {
    return { ok: false, why: `\`ceiling\` must be a non-negative integer (got ${JSON.stringify(ceiling)})` };
  }
  let re;
  try {
    // `capture` reads the first match only; the aggregating kinds need the global flag.
    re = new RegExp(pattern, kind === 'capture' ? 'm' : 'gm');
  } catch (error) {
    return { ok: false, why: `the pattern does not compile: ${error.message}` };
  }
  // ⚠ DIGITS ONLY, and the strictness is load-bearing rather than fussy. `Number('')` is
  // ZERO, so a pattern whose capture group can match EMPTINESS — `(\d*)`, or an optional
  // group that did not participate — would report a magnitude of 0 against any message at
  // all, including one that carries no figure. That is a measure which cannot fail, i.e.
  // the same disarmed guard one layer down. An empty or non-numeric capture is UNMEASURED.
  const digitsOf = (raw, where) => {
    if (raw === undefined) return { ok: false, why: `capture group ${group} does not exist ${where}` };
    if (!/^\d+$/.test(String(raw))) {
      return { ok: false, why: `capture group ${group} is not a bare integer ${where} (${JSON.stringify(raw)})` };
    }
    return { ok: true, value: Number(raw) };
  };
  if (kind === 'capture') {
    const match = re.exec(text);
    if (!match) return { ok: false, why: 'the pattern matched NOTHING in the live failure message' };
    const digits = digitsOf(match[group], 'in the match');
    return digits.ok ? { ok: true, measured: digits.value } : digits;
  }
  const matches = [...text.matchAll(re)];
  if (matches.length === 0) return { ok: false, why: 'the pattern matched NOTHING in the live failure message' };
  if (kind === 'count') return { ok: true, measured: matches.length };
  let measured = 0;
  for (const match of matches) {
    const digits = digitsOf(match[group], 'in every match');
    if (!digits.ok) return digits;
    measured += digits.value;
  }
  return { ok: true, measured };
}

/**
 * Every declared magnitude of ONE banked row, sorted into the three verdicts the gate acts on.
 * A row that declares no magnitude at all lands wholly in `unmeasured` — see the fail-closed
 * note above. Exported so the meta-test can assert the partition rather than re-deriving it.
 */
export function magnitudeReportOf(entry, message) {
  const specs = entry?.magnitude;
  if (!Array.isArray(specs) || specs.length === 0) {
    return {
      unmeasured: [{
        name: '(none declared)',
        why: 'this banked row declares NO magnitude, so its population is unbounded — the exact'
          + ' state TE-RATCHET-MAG closes. Add a `magnitude` array with the measured figure.',
      }],
      breaches: [],
      slack: [],
    };
  }
  const unmeasured = [];
  const breaches = [];
  const slack = [];
  for (const spec of specs) {
    const verdict = measureMagnitude(spec, message);
    const name = (spec && typeof spec.name === 'string' && spec.name) || '(unnamed)';
    if (!verdict.ok) {
      unmeasured.push({ name, why: verdict.why });
    } else if (verdict.measured > spec.ceiling) {
      breaches.push({ name, measured: verdict.measured, ceiling: spec.ceiling, unit: spec.unit });
    } else if (verdict.measured < spec.ceiling) {
      slack.push({ name, measured: verdict.measured, ceiling: spec.ceiling, unit: spec.unit });
    }
  }
  return { unmeasured, breaches, slack };
}

const BOOTSTRAP_DOC = 'PER-TEST failure census for the source phase (all tests except tests/build/**).'
  + ' SHRINK-ONLY. A failing test ABSENT'
  + ' from `entries` is a REGRESSION and reds the gate. Every entry MUST carry a full attribution'
  + ' — subsystem, cause, introducedAt, class — or tests/lint/testRatchet.test.js refuses it.'
  + ' Every entry MUST also carry a `magnitude` array: a banked row freezes its EXISTENCE, and the'
  + ' magnitude is what freezes its SIZE, so the population behind a permitted red cannot grow'
  + ' invisibly (ODQ 854, TE-RATCHET-MAG). `--update` can only REMOVE entries and LOWER magnitude'
  + ' ceilings; adding one is a deliberate, attributed hand edit.'
  + ' See scripts/check-test-ratchet.mjs.';

/**
 * The gate. Returns a process exit code; never calls process.exit itself, so the
 * meta-test can drive it in-process as well as by spawn.
 */
export async function run(argv = []) {
  const BASELINE = baselinePath();
  const fail = (lines) => { console.error(lines.join('\n')); return 1; };
  // The read-only flags are lifted out FIRST and are not modes; see parseReadOnlyArgs
  // for why `rest` is byte-for-byte the old argv whenever neither flag is present.
  const readOnly = parseReadOnlyArgs(argv);
  if (readOnly.error) {
    return fail([
      `[test-ratchet] ${readOnly.error}`,
      '  --from-log reads an ALREADY-CAPTURED `--reporter=json` report instead of spawning one:',
      '    node scripts/check-test-ratchet.mjs --from-log /path/to/results.json',
    ]);
  }
  const DRY = readOnly.dry;
  const FROM_LOG = readOnly.fromLog;
  const allowedModes = new Set(MODE_FLAGS);
  const unknown = readOnly.rest.filter((arg) => !allowedModes.has(arg));
  const selectedModes = readOnly.rest.filter((arg) => allowedModes.has(arg));
  if (unknown.length) {
    return fail([
      `[test-ratchet] unknown argument(s): ${unknown.join(', ')}`,
      `  Allowed modes: default source gate, ${MODE_FLAGS.slice(0, -1).join(', ')}, or ${MODE_FLAGS.at(-1)}.`,
      '  Read-only flags: --dry (print what WOULD run, spawn nothing), --from-log <report.json>.',
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

  // ⛔ --from-log NEVER FEEDS A FREEZE. `--update` and `--bootstrap` WRITE the census.
  // The header's law is that a census is never frozen from a broken run; a census frozen
  // from a report the CALLER hands in is weaker still — this gate did not observe it, and
  // cannot tell a stale report from a hand-edited one. The read-only flag therefore stops
  // at the read-only surfaces, and the re-freeze keeps costing a real run.
  if (FROM_LOG && (UPDATE || BOOTSTRAP)) {
    return fail([
      `[test-ratchet] --from-log is REFUSED with ${UPDATE ? '--update' : '--bootstrap'}: those FREEZE the census,`,
      '  and a freeze is only ever taken from a run this gate observed itself.',
      '  Use --from-log for the VERDICT; take a real run for the re-freeze.',
    ]);
  }

  // ── --dry: say what WOULD run; spawn nothing, write nothing, ALWAYS exit 0 ──
  // A PURE REPORTER by deliberate choice. It could have re-used the refusals below
  // (a symlinked build-test root, a missing census) and exited non-zero on them, but a
  // "what would this do" printer that can itself red is a printer people stop trusting
  // and stop reaching for — and reaching for it under a hold is the whole point. Every
  // such condition is REPORTED on its line instead, and the exit stays 0.
  if (DRY) {
    const outPlaceholder = path.join(os.tmpdir(), 'test-ratchet-<mkdtemp>', 'results.json');
    const injected = process.env.TEST_RATCHET_RUN_CMD;
    const mode = VERIFY_DIST ? '--verify-dist' : (UPDATE ? '--update' : (BOOTSTRAP ? '--bootstrap' : 'default source gate'));
    const lines = [
      '[test-ratchet] --dry — NOTHING WAS RUN, NOTHING WAS WRITTEN. This is what the selected mode WOULD do.',
      `  mode:            ${mode}`,
    ];
    if (FROM_LOG) {
      const resolved = path.resolve(FROM_LOG);
      lines.push(
        `  runner:          NONE — --from-log would read ${resolved}`,
        `  that report:     ${fs.existsSync(resolved) ? 'present' : '⚠ ABSENT (the run would fail closed)'}`,
      );
    } else {
      lines.push(
        `  runner:          ${injected || runnerCommandOf({ verifyDist: VERIFY_DIST, outputFile: outPlaceholder })}`,
        `  runner source:   ${injected ? 'TEST_RATCHET_RUN_CMD (the injected testability seam)' : 'runnerCommandOf() — ⛔ THE WHOLE VITEST SUITE'}`,
        `  report path:     a fresh mkdtemp under ${os.tmpdir()}, as <dir>/results.json`,
      );
    }
    if (VERIFY_DIST) {
      let discovered;
      try {
        discovered = `${discoverBuildTestFiles().length} file(s) under tests/build/`;
      } catch (error) {
        discovered = `⚠ discovery WOULD REFUSE: ${error.message}`;
      }
      lines.push(`  strict corpus:   ${discovered}`);
    }
    lines.push(`  baseline:        ${BASELINE}`);
    if (!fs.existsSync(BASELINE)) {
      lines.push('  ceilings:        ⚠ NO BASELINE FILE — the run would refuse and name --bootstrap.');
    } else {
      let frozen = null;
      try {
        frozen = JSON.parse(fs.readFileSync(BASELINE, 'utf8'));
      } catch (error) {
        lines.push(`  ceilings:        ⚠ THE CENSUS IS UNPARSEABLE (${error.message}) — the run would throw.`);
      }
      if (frozen) {
        const rows = Object.entries(frozen.entries || {});
        const measures = rows.reduce((n, [, row]) => n + (Array.isArray(row.magnitude) ? row.magnitude.length : 0), 0);
        const rowsWithMeasures = rows.filter(([, row]) => Array.isArray(row.magnitude) && row.magnitude.length).length;
        lines.push(
          `  frozen census:   ${rows.length} failing test(s), measured at ${frozen.measuredAtSha || 'unknown'}`,
          `  totalTests:      ${frozen.totalTests ?? '(absent)'}`
          + (frozen.totalTests ? ` — scope floor ${Math.floor(frozen.totalTests * SCOPE_FLOOR_RATIO)}; fewer reds` : ''),
          `  totalFiles:      ${frozen.totalFiles ?? '(absent)'}`
          + (frozen.totalFiles ? ` — scope floor ${Math.floor(frozen.totalFiles * SCOPE_FLOOR_RATIO)}; fewer reds` : ''),
          `  skippedCeiling:  ${frozen.skippedCeiling ?? '(absent)'}`,
          `  magnitude:       ${measures} measure(s) across ${rowsWithMeasures} banked row(s)`,
          `  uncollected allowlist: ${Object.keys(frozen.uncollectedSuites || {}).length} suite(s)`,
        );
      }
    }
    lines.push(
      '',
      '  ⛔ WITHOUT --dry THIS SCRIPT SPAWNS THE RUNNER NAMED ABOVE. In every mode except',
      '    --from-log that is the whole vitest suite, so the bare invocation is NOT hold-safe.',
    );
    console.log(lines.join('\n'));
    return 0;
  }

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
  //
  // ⛔ THIS IS THE SPAWN. Everything below it is arithmetic over a report; everything
  // above it is argv. Under `--from-log` the spawn is SKIPPED ENTIRELY — no child, no
  // mkdtemp — and the caller's report takes the place of the one a run would have
  // written. Nothing downstream can tell the difference, which is the whole design:
  // one verdict implementation, two ways of obtaining the report it judges.
  let runnerExitedNonZero = false;
  let runnerOutput;
  let OUT;
  if (FROM_LOG) {
    // Resolved against the CALLER's cwd, not ROOT: the path is something a human typed.
    OUT = path.resolve(FROM_LOG);
    if (!fs.existsSync(OUT)) {
      return fail([
        `[test-ratchet] --from-log names a report that does not exist — failing closed: ${OUT}`,
        '  Capture one with `npx vitest run --reporter=json --outputFile=<path>` (equals-sign',
        '  spelling — a BARE --json eats the next positional; see the header hazard note).',
      ]);
    }
    runnerOutput = `(no runner was spawned; --from-log read ${OUT})`;
  } else {
    const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'test-ratchet-'));
    OUT = path.join(TMP, 'results.json');
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
  // A captured report does not carry the runner's exit code, and STRICT DIST asks for it.
  // Derive it from the report's own `success`, FAIL-CLOSED: anything that is not an
  // explicit `true` counts as a non-zero exit, so a report missing the field can never
  // buy a strict-dist pass it did not earn.
  if (FROM_LOG) runnerExitedNonZero = report?.success !== true;

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

  // ── SHARED EVIDENCE RESOLUTION (Cure 1b) ──────────────────────────────────
  // Cure 1 taught the REGRESSION block to say whether the clock ran out or the
  // value was wrong. That question is asked at every red, not just that one, so
  // the resolution is hoisted here and the STRICT DIST and SCOPE SENTINEL blocks
  // now answer it too. ONE spelling, reused three times — a second copy would be
  // free to drift from the census's idea of a budget.
  //
  // ⛔ WHAT REDS IS UNTOUCHED. These lines are appended to failure arrays that are
  // already non-empty by the time they are reached; no verdict, threshold, or exit
  // code moves. Only what a red SAYS changes.
  //
  // LAZY AND MEMOISED: `globalTestTimeoutOf` reads the vitest config off disk and
  // `timeoutLiteralsOf` reads a test file, so both are deferred behind first use
  // and cached. A GREEN run does neither — the OK paths pay nothing for this.
  let globalBudgetMemo = null;
  const globalBudgetLazy = () => (globalBudgetMemo ??= globalTestTimeoutOf());
  const literalsCache = new Map();
  const literalsFor = (file) => {
    if (!literalsCache.has(file)) {
      let literals = [];
      try {
        literals = timeoutLiteralsOf(fs.readFileSync(path.join(ROOT, file), 'utf8'));
      } catch {
        // A row whose file is gone declares nothing; the suite-wide budget stands.
      }
      literalsCache.set(file, literals);
    }
    return literalsCache.get(file);
  };
  // Returns { lines, class } so a caller can both PRINT the evidence and reason
  // about the class (the regression block's cost-failure inference needs the latter).
  const evidenceFor = (row, file) => {
    const literals = literalsFor(file);
    const { budget: globalBudget, source: budgetSource } = globalBudgetLazy();
    const budget = Math.max(globalBudget, ...literals);
    return {
      lines: failureEvidenceOf(row, { budget, budgetSource, literals }),
      class: classifyFailure({
        duration: row?.duration,
        message: (row?.failureMessages || [])[0] || '',
        budget,
      }).class,
    };
  };
  // A suite-level failure carries no per-test row, so the evidence is taken from
  // the SUITE: its own elapsed clock and its own message. This is the arm that
  // answers "did the `beforeAll` hook TIME OUT, or did it throw?" — a question the
  // uncollected block could not previously answer, and one that matters precisely
  // because the recorded beforeAll case serialises an EMPTY suite message.
  const suiteAsRow = (suite) => ({
    duration: (Number.isFinite(suite?.endTime) && Number.isFinite(suite?.startTime))
      ? suite.endTime - suite.startTime
      : undefined,
    failureMessages: suite?.message ? [String(suite.message)] : [],
  });

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
    const strictClasses = [];
    for (const status of ['failed', ...NON_RUN_STATUSES]) {
      const matches = incomplete.filter((row) => row.status === status);
      if (matches.length) {
        failures.push(`  ${status.toUpperCase()} build-test row(s):`);
        for (const row of matches) {
          failures.push(`    ${row.id}`);
          // Cure 1b — evidence for FAILED rows only. A non-run row has neither a
          // duration nor a message, so a class line under it would be manufactured
          // rather than measured; those rows keep their bare identity.
          if (status !== 'failed') continue;
          const evidence = evidenceFor(row, row.file);
          strictClasses.push(evidence.class);
          failures.push(...evidence.lines);
        }
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

    // Cure 1b — the same inference Cure 1 drew for the census, restated for the
    // surface that HAS no census: strict dist banks nothing, so a budget expiry
    // here is not debt to record but work to cut. Named so a reader does not go
    // looking for a dist defect that the clock, not the artifact, produced.
    if (strictClasses.some((c) => c === 'TIMEOUT' || c === 'QUERY-BUDGET')) {
      failures.push(
        '',
        '  ⚠ A BUDGET EXPIRY IS A COST FAILURE. Strict dist has no census to bank it in and no debt',
        '    concept to absorb it: cut the row\'s per-run work or give it an explicit per-test budget',
        '    carrying the measured figure. Raising the suite-wide testTimeout only hides the next one.',
      );
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
        file: r.file,
        test: r.fullName,
        subsystem: null,
        cause: null,
        introducedAt: null,
        class: null,
        // NULL, never a figure this mode measured for itself. A bootstrap that froze a
        // magnitude it had just read would bank whatever the tree happened to hold, which
        // is the same laundering the null attributions above exist to refuse.
        magnitude: null,
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
    // Cure 1b — resolve each named suite back to its report entry so the evidence
    // comes from the SUITE's own clock and message. `uncollectedOf` returns
    // normalised paths, so the index is keyed the same way; its return shape is
    // deliberately NOT changed, because the meta-test pins it.
    const suiteByPath = new Map(
      (Array.isArray(report?.testResults) ? report.testResults : [])
        .map((s) => [normalizePath(s.name || s.file || '(unnamed suite)'), s]),
    );
    scopeFailures.push(
      `  ${newUncollected.length} suite(s) FAILED WITHOUT A MEASURABLE TEST — they either produced ZERO`,
      '    tests (a collection error) or failed as a whole while every test they enumerated was a',
      '    SKIP (a `beforeAll`/`afterAll` that threw). Either way every test they own left the',
      '    census instead of being measured, and a skip ceiling cannot see the difference:',
    );
    for (const f of newUncollected) {
      scopeFailures.push(`      ${f}`);
      const suite = suiteByPath.get(f);
      if (!suite) continue;
      // Indented one level past the file name it belongs to; `failureEvidenceOf`
      // owns its own base indent and is NOT reshaped, so Cure 1's landed bytes on
      // the regression block stay exactly as they were.
      scopeFailures.push(...evidenceFor(suiteAsRow(suite), f).lines.map((l) => `  ${l}`));
    }
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

  // (2b) FILE FLOOR — ⚠⚠ THE SENTINEL THAT WAS COMPUTED, WRITTEN, AND COMPARED NOWHERE.
  // `totalFiles` has been measured at line ~590, persisted by BOTH --bootstrap and
  // --update, and read by a static pin that only asserts it is a positive number
  // ("the scope figures are present and positive (the sentinels are not inert)") — while
  // no arm anywhere ever compared it to a live run. It was INERT: a sentinel that looks
  // armed in the census, in the writer and in its own pin, and could not refuse anything.
  // Found by the §854.1 skeptic pass and filed as a guards-family row; armed here.
  //
  // IT IS NOT A DUPLICATE OF THE COUNT FLOOR ABOVE. The two collapse independently: a
  // whole DIRECTORY dropping out of `include` takes many files and may take few tests,
  // while a single enormous suite failing to collect takes many tests and one file. The
  // test floor sees the second and can sit green through the first.
  const fileFloor = Math.floor((baseline.totalFiles || 0) * SCOPE_FLOOR_RATIO);
  if (baseline.totalFiles && totalFiles < fileFloor) {
    scopeFailures.push(
      `  total test FILE count collapsed: ${totalFiles} < ${fileFloor} `
      + `(${Math.round(SCOPE_FLOOR_RATIO * 100)}% of the frozen ${baseline.totalFiles}) — whole suites left the run`,
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
    const loweredMagnitudes = [];
    const heldMagnitudes = [];
    for (const [id, row] of Object.entries(entries)) {
      if (!liveFailingIds.has(id)) { dropped.push(id); continue; }
      // ⛔ MONOTONE DOWN, exactly like `skippedCeiling` below: a re-freeze may LOWER a
      // magnitude and may never RAISE one. If it could raise, every growth would bank
      // itself the moment anyone ran the documented re-freeze — which is precisely the
      // laundering VOICE-1b measured on the voice fixture and the STRIP-never-raise
      // ruling (ODQ line 266) forbids. A breach therefore SURVIVES the re-freeze and the
      // gate stays red until the debt is actually cut.
      if (!Array.isArray(row.magnitude) || row.magnitude.length === 0) { kept[id] = row; continue; }
      const message = (liveById.get(id)?.failureMessages || [])[0] || '';
      kept[id] = {
        ...row,
        magnitude: row.magnitude.map((spec) => {
          const verdict = measureMagnitude(spec, message);
          if (!verdict.ok) {
            heldMagnitudes.push(`${id} [${spec?.name ?? '(unnamed)'}]: ${verdict.why}`);
            return spec;
          }
          if (verdict.measured >= spec.ceiling) {
            if (verdict.measured > spec.ceiling) {
              heldMagnitudes.push(
                `${id} [${spec.name}]: measured ${verdict.measured} EXCEEDS the frozen ${spec.ceiling}`
                + ' — held, never raised',
              );
            }
            return spec;
          }
          loweredMagnitudes.push(`${id} [${spec.name}]: ${spec.ceiling} → ${verdict.measured}`);
          return { ...spec, ceiling: verdict.measured };
        }),
      };
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
    if (loweredMagnitudes.length) {
      console.log(`[test-ratchet] ${loweredMagnitudes.length} magnitude ceiling(s) RATCHETED DOWN:`);
      console.log(loweredMagnitudes.map((line) => `  ↓ ${line}`).join('\n'));
    }
    if (heldMagnitudes.length) {
      console.log(`[test-ratchet] ⚠ ${heldMagnitudes.length} magnitude ceiling(s) HELD — a re-freeze never raises one:`);
      console.log(heldMagnitudes.map((line) => `  = ${line}`).join('\n'));
      console.log('  The gate stays RED on these until the population is actually cut.');
    }
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
    const classes = [];
    if (regressions.length) {
      // ── THE EVIDENCE BLOCK (see the section above rowsOf) ─────────────────
      // A non-census red is the ONE surface where the timeout-vs-assertion
      // question gets asked, so it is the one surface that must answer it. The
      // budget is resolved PER FILE, and the file's own declared literals are
      // read at most once each.
      //
      // ⚠ Cure 1b: the per-file budget resolution that used to live inline here is
      // now `evidenceFor`, hoisted so STRICT DIST and SCOPE SENTINEL answer the same
      // question with the SAME arithmetic. The bytes this block prints are unchanged
      // — same budget (`max(global, ...literals)`), same source, same literals.
      lines.push(`  ${regressions.length} failing test(s) NOT in the frozen census:`);
      for (const id of regressions) {
        lines.push(`    ${id}`);
        const row = liveById.get(id);
        if (!row) continue;
        const evidence = evidenceFor(row, row.file);
        classes.push(evidence.class);
        lines.push(...evidence.lines);
      }
    }
    if (hidden.length) {
      lines.push(`  ${hidden.length} baselined test(s) are now SKIPPED — a skipped test is a HOLE, not a fix:`);
      lines.push(...hidden.map((id) => `    ${id}`));
    }
    // ⛔ THE ONE INFERENCE THIS BLOCK IS ALLOWED TO MAKE, and it points AWAY from
    // the census: a cost failure is never debt, so the census must never absorb it
    // (the frozen ⛔ NO row is attributed to a TIMEOUT pin refuses it anyway).
    if (classes.some((c) => c === 'TIMEOUT' || c === 'QUERY-BUDGET')) {
      lines.push('');
      lines.push('  ⚠ A BUDGET EXPIRY IS A COST FAILURE, NEVER DEBT. Cut the row\'s per-run work or give it an');
      lines.push('    explicit per-test budget carrying the measured figure — never bank one in the census, and');
      lines.push('    never raise the suite-wide testTimeout (that hides the next one).');
    }
    // The machine is half the classification: a budget expiry under heavy
    // oversubscription is the recorded MACHINE-LOAD ARTIFACT shape, and the load
    // at the moment of the red is not recoverable afterwards from anything else.
    const cores = os.cpus().length;
    lines.push('');
    // Under --from-log this machine did not run the suite, so it must not be labelled as
    // though it had. The default spelling is untouched.
    lines.push(FROM_LOG
      ? `  machine READING this report: load ${os.loadavg().map((n) => n.toFixed(2)).join('/')} over ${cores} core(s)`
      + ' — NOT the machine that ran the suite'
      : `  machine at this run: load ${os.loadavg().map((n) => n.toFixed(2)).join('/')} over ${cores} core(s)`);
    // ⚠ THE REPORT SURVIVES; IT WAS ONLY EVER NAMELESS. Printing its own path ends
    // the mtime forensics, and the stable copy ends the "which of the hundreds of
    // test-ratchet-* dirs was mine" question for the LAST red specifically.
    // ⛔ BOTH PATHS ARE OUTSIDE THE REPO — the header's law, not a preference.
    lines.push(`  full runner report: ${OUT}`);
    // ⛔ NO COPY UNDER --from-log. The stable copy exists to rescue a report from a
    // NAMELESS mkdtemp; a --from-log report is already at a path the caller chose and
    // will find again. Worse, copying would be actively destructive in the obvious case:
    // pass the stable path itself as the report and `copyFileSync(src, src)` truncates it.
    if (FROM_LOG) {
      lines.push('  (supplied by --from-log; no temp copy taken — the path above IS the stable one)');
    } else {
      const stable = path.join(os.tmpdir(), 'test-ratchet-last-red.json');
      try {
        fs.copyFileSync(OUT, stable);
        lines.push(`  stable copy of it:  ${stable}`);
      } catch (e) {
        lines.push(`  (the stable copy at ${stable} could not be written: ${e.message})`);
      }
    }
    lines.push('');
    lines.push(`Frozen census is ${Object.keys(entries).length} failing test(s), measured at ${baseline.measuredAtSha || 'unknown'}.`);
    lines.push('Run `npm run test` for the unfiltered reporter output.');
    return fail(lines);
  }

  // ── ⚠⚠ THE MAGNITUDE GATE — the banked rows' CONTENTS, not just their existence ──
  // See the MAGNITUDE CEILING block above `BOOTSTRAP_DOC` for the defect and the design.
  // This runs AFTER the regression block on purpose, and the separation is deliberate:
  // a regression red is about a failure that is NEW, this red is about a failure that is
  // PERMITTED and GROWING, and they take different repairs. Keeping them apart also
  // leaves the regression block's evidence bytes — pinned by the meta-test — untouched.
  //
  // Only rows that are BANKED and CURRENTLY FAILING are measured. A banked row that now
  // passes is a win and belongs to the ratchet-down path below; a row that is banked and
  // SKIPPED was already refused as `hidden` above.
  const magnitudeBreaches = [];
  const magnitudeUnmeasured = [];
  const magnitudeSlack = [];
  for (const [id, entry] of Object.entries(entries)) {
    if (!liveFailingIds.has(id)) continue;
    const message = (liveById.get(id)?.failureMessages || [])[0] || '';
    const verdicts = magnitudeReportOf(entry, message);
    for (const row of verdicts.unmeasured) magnitudeUnmeasured.push({ id, ...row });
    for (const row of verdicts.breaches) magnitudeBreaches.push({ id, ...row });
    for (const row of verdicts.slack) magnitudeSlack.push({ id, ...row });
  }

  if (magnitudeBreaches.length || magnitudeUnmeasured.length) {
    const lines = ['[test-ratchet] BANKED-ROW MAGNITUDE REFUSED — a permitted red may not GROW:'];
    if (magnitudeBreaches.length) {
      lines.push(`  ${magnitudeBreaches.length} banked row measure(s) EXCEED their frozen ceiling:`);
      for (const row of magnitudeBreaches) {
        lines.push(`    ${row.id}`);
        lines.push(
          `      [${row.name}] measured ${row.measured} > ceiling ${row.ceiling}`
          + ` (+${row.measured - row.ceiling})${row.unit ? ` — ${row.unit}` : ''}`,
        );
      }
      lines.push('');
      lines.push('  ⛔ THE CURE IS TO CUT THE POPULATION, NEVER TO RAISE THE CEILING. This row is already');
      lines.push('    a permitted failure; the ceiling is the only thing still bounding what sits behind it.');
      lines.push('    `--update` will NOT raise it (it re-freezes at the minimum), which is deliberate.');
    }
    if (magnitudeUnmeasured.length) {
      lines.push(`  ${magnitudeUnmeasured.length} banked row measure(s) could NOT BE MEASURED — failing closed:`);
      for (const row of magnitudeUnmeasured) {
        lines.push(`    ${row.id}`);
        lines.push(`      [${row.name}] ${row.why}`);
      }
      lines.push('');
      lines.push('  An unmeasured magnitude is an UNKNOWN one, not a small one. If the assertion legitimately');
      lines.push('    changed shape, re-derive the pattern against the live message and re-freeze the figure');
      lines.push('    in the SAME act — never delete the measure to clear this.');
    }
    lines.push('');
    lines.push(`Frozen census is ${Object.keys(entries).length} failing test(s), measured at ${baseline.measuredAtSha || 'unknown'}.`);
    return fail(lines);
  }

  if (magnitudeSlack.length) {
    // Same doctrine as the row-level RATCHET DOWN below: a silent pass lets a ceiling
    // drift permanently above the truth, which is how a ratchet stops ratcheting.
    console.log(`[test-ratchet] RATCHET DOWN: ${magnitudeSlack.length} magnitude ceiling(s) now sit ABOVE the`
      + ' measured truth — run `npm run test:ratchet:update` to bank the win:');
    for (const row of magnitudeSlack) {
      console.log(`  ↓ ${row.id}`);
      console.log(`      [${row.name}] measured ${row.measured} < ceiling ${row.ceiling}`);
    }
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
