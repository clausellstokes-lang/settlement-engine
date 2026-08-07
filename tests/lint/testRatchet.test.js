/**
 * testRatchet.test.js — the PER-TEST suite ratchet, pinned and PROVEN.
 *
 * scripts/check-test-ratchet.mjs restores the TAIL of `npm run check`. `npm run
 * test` (`vitest run`) is a BOOLEAN gate at zero failures and step 12 of the
 * 14-step `&&` chain; it is red, so `build` (step 13) and `verify:dist` (step 14)
 * — every step BEHIND it — had not run as part of the gate since 2026-08-02.
 * The ratchet replaces the boolean with a truthful, ATTRIBUTED, per-test census
 * that only shrinks, which lets the dark tail run again while still redding on
 * the next regression.
 *
 * This file pins BOTH halves, and the second half is the point:
 *
 *   1. STATIC PINS — the census is internally consistent, EVERY ENTRY CARRIES A
 *      FULL ATTRIBUTION, the ceiling never rises, the wiring reaches `npm run
 *      check` and CI, and `npm run test` survives as a RAW command.
 *
 *   2. EXECUTED PINS — every FAILURE path of the ratchet is run against an
 *      INJECTED FAKE RUNNER and an injected temp baseline, and asserted to exit
 *      non-zero. A ratchet whose failure paths are never exercised is a ratchet
 *      nobody has proven works: each guard exists because its absence is
 *      indistinguishable from success (a vacuous green), which is exactly the
 *      class of defect that cannot be caught by watching the gate pass.
 *
 * The fake runner writes its report to the path the script hands it in
 * TEST_RATCHET_OUTPUT_FILE — the same seam the real `vitest --outputFile=` uses
 * — so these drive the genuine parse/compare code, never a re-implementation.
 */
import { mkdtempSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';

import {
  DEBT_CLASSES, identityOf, normalizePath, rowsOf, uncollectedOf, SCOPE_FLOOR_RATIO,
} from '../../scripts/check-test-ratchet.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SCRIPT = join(ROOT, 'scripts/check-test-ratchet.mjs');
const BASELINE_PATH = join(ROOT, 'scripts/.test-ratchet-baseline.json');

const baseline = JSON.parse(readFileSync(BASELINE_PATH, 'utf8'));
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));

// The census was measured in an integrity-counted local checkout of committed
// sha c658fb44 (6,182 tracked paths in, 6,182 tracked files out, 0 dirty), NOT
// in the live shared tree — a sibling lane's uncommitted layering work was in
// the worktree at the time and a census taken over it would bank a number that
// belongs to no commit (THE ARCHIVE-CENSUS LAW).
//
// The measurement: 27,292 tests across 2,350 suites; 27,138 passed, 49 FAILED
// across 34 files, 105 skipped, and ONE suite that fails at COLLECTION
// (tests/ops/migrationRehearsal.test.js — owner-gated, allowlisted below).
//
// ⚠ A LITERAL, not a figure derived from the baseline it is supposed to cap. A
// ceiling read out of `baseline.entries` would prove list == list — the
// self-referential pin class — and would rise silently with every added row.
//
// MONOTONE DOWN from here. You may burn it; you may never pad it.
//
// RATCHETED 49 → 40 on 2026-08-07. Nine rows left the census in one commit, in two
// classes that must not be confused:
//   • FOUR ENFORCEMENT-WALKER ROWS (negativeAssertionAnchor.walker ×2,
//     seedLoopTotality.walker ×2). They did not leave because they were repaired —
//     they left because a failing WALKER is a DISABLED GUARD and may not be frozen by
//     the same mechanism that freezes a failing TEST. Their debt moved into the
//     walkers' own shrink-only inventories, where a NEW violation still reds. While
//     they sat here their populations grew unseen, 1,303 → 1,565 un-anchored negatives
//     and 13 → 26 bare seed loops. ⛔ NEVER RE-ADD A WALKER ROW HERE.
//   • FIVE GENUINE RATCHET-DOWN WINS, each re-verified PASSING in an integrity-counted
//     `git archive` of the committed parent before removal (layerBoundaries,
//     domainGeneratorsBoundary ×2 — all three cleared by the layering inversion at
//     67f8a58e — userRouteIdentityLeaf, mapOverlayTransformContract).
const CEILING = 40;

describe('per-test suite ratchet — static pins', () => {
  test('every entry is keyed by its own `<file> :: <test>` identity (no hand-typed drift)', () => {
    for (const [id, row] of Object.entries(baseline.entries)) {
      expect(identityOf(row.file, row.test), `entry key disagrees with its own file/test fields: ${id}`).toBe(id);
    }
  });

  test('every entry path is repo-relative POSIX and the file still exists', () => {
    const rows = Object.entries(baseline.entries);
    expect(rows.length, 'an empty census would make every pin below vacuous').toBeGreaterThan(0);
    for (const [id, row] of rows) {
      expect(row.file.startsWith('/'), `${id} is absolute — paths must be repo-relative`).toBe(false);
      expect(row.file.includes('\\'), `${id} carries a backslash — paths must be POSIX`).toBe(false);
    }
    const missing = rows.filter(([, r]) => !existsSync(join(ROOT, r.file))).map(([id]) => id);
    expect(missing, `deleted/moved file(s) — run \`npm run test:ratchet:update\`: ${missing.join(', ')}`).toEqual([]);
  });

  test('⛔ EVERY ENTRY IS ATTRIBUTED — an unattributed row is a defect laundered into debt', () => {
    // This is the pin that makes the census a LEDGER rather than a skip-list.
    // A row nobody can trace to an owning subsystem and an introducing commit is
    // indistinguishable from a bug someone quietly silenced.
    for (const [id, row] of Object.entries(baseline.entries)) {
      expect(row.subsystem, `${id}: no owning subsystem`).toBeTruthy();
      expect(String(row.subsystem).length, `${id}: subsystem is a stub`).toBeGreaterThan(2);
      expect(row.cause, `${id}: no cause recorded`).toBeTruthy();
      expect(String(row.cause).length, `${id}: cause is a stub, not an explanation`).toBeGreaterThan(20);
      expect(DEBT_CLASSES, `${id}: class must be one of ${DEBT_CLASSES.join('|')}`).toContain(row.class);
      expect(row.introducedAt, `${id}: no introducing commit`).toBeTruthy();
      expect(
        String(row.introducedAt),
        `${id}: introducedAt must be a 40-hex sha or an explicit \`unbisectable:<reason>\` note`,
      ).toMatch(/^([0-9a-f]{40}|unbisectable:.{10,})$/);
    }
  });

  test('the census records the committed sha it was measured at', () => {
    expect(baseline.measuredAtSha, 'a census that cannot name its tree cannot be re-derived').toMatch(/^[0-9a-f]{40}$/);
  });

  test('the committed ceiling never rises (the ratchet is monotone-down)', () => {
    expect(Object.keys(baseline.entries).length).toBeLessThanOrEqual(CEILING);
  });

  test('the scope figures are present and positive (the sentinels are not inert)', () => {
    // A missing totalTests silently disables the count floor; a missing
    // skippedCeiling silently disables the skip guard. Both must be real.
    expect(baseline.totalTests).toBeGreaterThan(1000);
    expect(baseline.totalFiles).toBeGreaterThan(100);
    expect(Number.isInteger(baseline.skippedCeiling)).toBe(true);
  });

  test('the ratchet is wired into `npm run check`', () => {
    expect(pkg.scripts['test:ratchet']).toContain('check-test-ratchet.mjs');
    expect(pkg.scripts['test:ratchet:update']).toContain('--update');
    expect(pkg.scripts.check).toContain('test:ratchet');
  });

  test('the check chain no longer runs the BARE boolean test step (that is what went dark)', () => {
    // The whole repair: the chain must run the ratchet, not the all-or-nothing
    // step whose red blacked out build/verify:dist. Compare STEP NAMES, not
    // substrings — "npm run test:ratchet" contains "npm run test".
    const steps = pkg.scripts.check.split('&&').map((s) => s.trim().replace(/^npm run /, ''));
    expect(steps).toContain('test:ratchet');
    expect(steps.length, 'the check chain parsed to no steps — the scan broke').toBeGreaterThan(4);
    // anchored: the two assertions above prove `steps` is a populated list that really contains the chain
    expect(steps, 'the bare `test` step is back in the chain — the tail goes dark again').not.toContain('test');
  });

  test('the chain still ends with build and verify:dist (the steps this lane exists to un-darken)', () => {
    const steps = pkg.scripts.check.split('&&').map((s) => s.trim().replace(/^npm run /, ''));
    expect(steps).toContain('build');
    expect(steps).toContain('verify:dist');
    expect(steps.indexOf('test:ratchet')).toBeLessThan(steps.indexOf('build'));
    expect(steps.indexOf('build')).toBeLessThan(steps.indexOf('verify:dist'));
  });

  test('`npm run test` survives as a RAW vitest command (burn lanes need the full list)', () => {
    // The ratchet reports a verdict; a burn-down lane needs the unfiltered
    // reporter output. Keeping the raw script is a requirement, not an accident.
    expect(pkg.scripts.test).toBe('vitest run');
  });

  test('CI runs the ratchet too (the local gate and CI must not diverge)', () => {
    // CI steps are sequential and a failed step ends the job, so CI's Build and
    // Verify steps were dark for exactly the same reason.
    const ci = readFileSync(join(ROOT, '.github/workflows/ci.yml'), 'utf8');
    expect(ci, 'ci.yml must run the per-test ratchet').toContain('npm run test:ratchet');
    const runsBareTest = ci.split('\n').some((l) => l.trim() === 'run: npm run test');
    expect(runsBareTest, 'ci.yml still runs the bare `npm run test` — CI would stay dark').toBe(false);
  });

  test('⚠ the three migration reds are marked OWNER-GATED, so nobody "fixes" them', () => {
    // Migrations are an owner-gated class. These three share ONE cause and must
    // not be repaired by a build lane acting on its own authority.
    const gated = Object.values(baseline.entries).filter((r) => r.class === 'owner-gated');
    expect(gated.length, 'the owner-gated migration debt vanished from the census').toBeGreaterThan(0);
    for (const r of gated) {
      expect(r.cause, `${r.file}: an owner-gated row must say WHY it is gated`).toMatch(/owner|gated|migration|deploy/i);
    }
  });

  test('⛔ every ALLOWLISTED UNCOLLECTED suite is attributed too (a collection failure is debt)', () => {
    // A suite that throws during collection reports ZERO tests, so its failures
    // never appear as rows at all. That hole is the most dangerous kind of debt,
    // so it carries the same attribution discipline as a failing test.
    const rows = Object.entries(baseline.uncollectedSuites || {});
    expect(rows.length, 'the uncollected allowlist vanished — the sentinel would now red on it').toBeGreaterThan(0);
    for (const [file, row] of rows) {
      expect(existsSync(join(ROOT, file)), `${file}: allowlisted but not on disk`).toBe(true);
      expect(row.subsystem, `${file}: no owning subsystem`).toBeTruthy();
      expect(String(row.cause).length, `${file}: cause is a stub`).toBeGreaterThan(20);
      expect(DEBT_CLASSES, `${file}: class must be one of ${DEBT_CLASSES.join('|')}`).toContain(row.class);
      expect(String(row.introducedAt)).toMatch(/^([0-9a-f]{40}|unbisectable:.{10,})$/);
    }
  });

  test('the uncollected allowlist never grows past its frozen size', () => {
    // Same monotone-down law as the entry census: a literal, not a self-derived
    // figure. One suite (tests/ops/migrationRehearsal.test.js) fails to collect.
    expect(Object.keys(baseline.uncollectedSuites || {}).length).toBeLessThanOrEqual(1);
  });

  test('⚠ the observedShapeReaders walker is NOT in the census (a timeout is not debt)', () => {
    // It failed the full suite while passing in isolation — a STRUCTURAL TIMEOUT
    // under parallel contention, not a ratchet red. Baselining it would have
    // recorded a defect that does not exist and hidden the real one. It was
    // FIXED instead; this pin refuses the mislabel returning.
    const ids = Object.keys(baseline.entries);
    expect(ids.filter((id) => id.includes('observedShapeReaders'))).toEqual([]);
  });

  test('⛔ NO row is attributed to a TIMEOUT — a phantom entry can never be burned down', () => {
    // THE PHANTOM CLASS, generalised from the pin directly above. That one names
    // ONE file; this one closes the class for every row, present and future.
    //
    // A test frozen here because it TIMED OUT under parallel contention records
    // a defect that DOES NOT EXIST. The burn-down lane goes looking for a broken
    // assertion, finds the test green in isolation, and cannot close the row —
    // so it sits in the census forever making the ratchet look permanently
    // indebted, while the real fault (a test whose per-run cost has grown into
    // the ceiling) stays unfixed and keeps flaking its neighbours. Worst of all,
    // a flaky gate silently invalidates every census taken through it: the
    // measured spread at bd5e49f6 was 0, 2 and 5 out-of-census failures across
    // three full-suite runs at ONE sha.
    //
    // A timeout is a COST problem, never debt. Fix it by cutting the test's
    // per-run work (share an expensive fixture across the file's cases), or by
    // giving that test an explicit per-test timeout carrying the MEASURED figure
    // and the reason — the house precedent is tests/joins/ordering.test.js:289.
    // Never raise the global `testTimeout`: that hides the next one and makes a
    // genuinely hung test take longer to report.
    const offenders = Object.entries(baseline.entries)
      .filter(([, r]) => /\btimed?\s?-?\s?out\b|\btimeouts?\b|STACK_TRACE_ERROR|parallel contention/i
        .test(`${r.cause} ${r.subsystem}`))
      .map(([id]) => id);
    expect(
      offenders,
      'these rows blame a TIMEOUT. Cut the test\'s cost or give it an explicit per-test timeout — do not bank it as debt.',
    ).toEqual([]);
  });
});

// ── EXECUTED PINS: every failure path, actually run ──────────────────────────
describe('per-test suite ratchet — the guards, EXECUTED', () => {
  const TMP = mkdtempSync(join(tmpdir(), 'test-ratchet-meta-'));

  // A fake runner: copies a prepared report to the path the script hands it in
  // TEST_RATCHET_OUTPUT_FILE, then exits with the given code. `-` writes NOTHING,
  // which is the "runner failed to run" shape.
  const FAKE = join(TMP, 'fake-runner.mjs');
  writeFileSync(
    FAKE,
    'import fs from "node:fs";\n'
    + 'const [, , src, code] = process.argv;\n'
    + 'const out = process.env.TEST_RATCHET_OUTPUT_FILE;\n'
    + 'if (src !== "-") fs.writeFileSync(out, fs.readFileSync(src, "utf8"));\n'
    + 'process.exit(Number(code));\n',
  );

  let seq = 0;
  const tmpFile = (ext, contents) => {
    seq += 1;
    const f = join(TMP, `f${seq}.${ext}`);
    writeFileSync(f, contents);
    return f;
  };

  // Two REAL files on disk, used wherever a guard needs a path that exists.
  // Named, never edited — this file is the only one this lane owns here.
  const REAL = 'tests/lint/testRatchet.test.js';
  const REAL2 = 'scripts/check-test-ratchet.mjs';
  const T = (name, status = 'failed') => ({ name, status });

  /** Build a jest/vitest-shaped report. Absolute suite paths also pin normalization. */
  function reportOf(suites) {
    return {
      testResults: suites.map((s) => ({
        name: s.absolute === false ? s.file : join(ROOT, s.file),
        assertionResults: (s.tests || []).map((t) => ({
          fullName: t.name, title: t.name, ancestorTitles: [], status: t.status,
        })),
      })),
    };
  }

  /**
   * Run the ratchet against an injected baseline + injected fake runner.
   * `report: null` = the runner wrote nothing; `rawReport` = arbitrary bytes.
   */
  function run({
    entries = {}, totalTests, totalFiles = 10, skippedCeiling = 0, uncollectedSuites,
    suites = [], report, rawReport, exitCode = 1, args = [], noBaseline = false,
  }) {
    const built = report === undefined ? reportOf(suites) : report;
    let src = '-';
    if (rawReport !== undefined) src = tmpFile('json', rawReport);
    else if (built !== null) src = tmpFile('json', JSON.stringify(built));

    const env = { ...process.env, TEST_RATCHET_RUN_CMD: `node ${FAKE} ${src} ${exitCode}` };
    if (!noBaseline) {
      const rows = Object.entries(entries).map(([id, r]) => [id, {
        file: r.file ?? id.split(' :: ')[0],
        test: r.test ?? id.split(' :: ')[1],
        subsystem: 'meta', cause: 'injected fixture for the meta-test', introducedAt: 'a'.repeat(40), class: 'debt',
      }]);
      env.TEST_RATCHET_BASELINE = tmpFile('json', JSON.stringify({
        measuredAtSha: 'f'.repeat(40),
        totalTests: totalTests ?? Math.max(1, built ? rowsOf(built, ROOT).length : 1),
        totalFiles,
        skippedCeiling,
        ...(uncollectedSuites ? { uncollectedSuites } : {}),
        entries: Object.fromEntries(rows),
      }, null, 2));
    } else {
      env.TEST_RATCHET_BASELINE = join(TMP, `absent-${seq += 1}.json`);
    }
    const r = spawnSync('node', [SCRIPT, ...args], { cwd: ROOT, encoding: 'utf8', env });
    return { ...r, out: `${r.stdout}${r.stderr}`, baselineFile: env.TEST_RATCHET_BASELINE };
  }

  // ── anti-vacuity: "the suite actually ran" ────────────────────────────────
  describe('anti-vacuity sentinel — a runner that did not run is not "0 failures"', () => {
    test('fails closed when the runner writes NO report at all', () => {
      const r = run({ report: null });
      expect(r.status, r.out).not.toBe(0);
      expect(r.out).toMatch(/NO REPORT|failing closed/i);
    });

    test('fails closed when the report is unparseable bytes', () => {
      const r = run({ rawReport: '{ this is not json' });
      expect(r.status, r.out).not.toBe(0);
      expect(r.out).toMatch(/UNPARSEABLE|failing closed/i);
    });

    test('fails closed when the report parses but contains ZERO tests', () => {
      // The nastiest shape: a well-formed report of an empty run. Zero failures
      // out of zero tests would otherwise read as a clean suite.
      const r = run({ report: { testResults: [] } });
      expect(r.status, r.out).not.toBe(0);
      expect(r.out).toMatch(/ZERO TESTS/i);
    });

    test('fails closed even when the runner exits ZERO with an empty report', () => {
      // A crash that still exits 0 (a wrapper swallowing the code) must not pass.
      const r = run({ report: { testResults: [] }, exitCode: 0 });
      expect(r.status, r.out).not.toBe(0);
    });

    test('does NOT fail closed when the suite really ran and really failed', () => {
      // The discriminator must distinguish "ran with failures" from "did not
      // run", or the guard is an always-red gate that would simply be deleted.
      const r = run({
        entries: { [identityOf(REAL, 'a')]: {} },
        suites: [{ file: REAL, tests: [T('a'), T('b', 'passed')] }],
      });
      expect(r.status, r.out).toBe(0);
      expect(r.out).toMatch(/OK — no test regressions/);
      // anchored: the verdict assertion above proves the run reached the normal path
      expect(r.out).not.toMatch(/failing closed/i);
    });
  });

  // ── the ratchet law ───────────────────────────────────────────────────────
  describe('the census is PER TEST and shrink-only', () => {
    test('a baselined failing test passes (debt is banked, not forgiven-then-refused)', () => {
      const r = run({
        entries: { [identityOf(REAL, 'a')]: {} },
        suites: [{ file: REAL, tests: [T('a')] }],
      });
      expect(r.status, r.out).toBe(0);
    });

    test('⛔ A FAILING TEST ABSENT FROM THE CENSUS IS A REGRESSION, even in a baselined FILE', () => {
      // THE REASON THIS IS PER-TEST AND NOT PER-FILE. A file-level allowlist
      // would green `b` here purely because `a` is known debt in the same file,
      // hiding every future break in that file forever.
      const r = run({
        entries: { [identityOf(REAL, 'a')]: {} },
        suites: [{ file: REAL, tests: [T('a'), T('b')] }],
      });
      expect(r.status, r.out).not.toBe(0);
      expect(r.out).toMatch(/testRatchet\.test\.js :: b/);
      expect(r.out).not.toMatch(/:: a\b/);
    });

    test('a new failure gets NO credit from slack elsewhere in the census', () => {
      // 1 new failure against a 40-entry census is still a regression. If the
      // comparison ever collapsed to `failCount <= entryCount`, this greens.
      const known = Array.from({ length: 40 }, (_, i) => `known${i}`);
      const entries = Object.fromEntries(known.map((n) => [identityOf(REAL, n), {}]));
      // The 40 banked failures are all present and still failing, so the scope
      // sentinel is satisfied and the verdict below is the RATCHET's, not the
      // membership check's — otherwise this would pass for the wrong reason.
      const r = run({
        entries,
        suites: [
          { file: REAL, tests: [...known.map((n) => T(n)), T('brandNew')] },
          { file: REAL2, tests: [T('x', 'passed')] },
        ],
      });
      expect(r.status, r.out).not.toBe(0);
      expect(r.out).toMatch(/brandNew/);
    });

    test('a baselined test that PASSES greens AND names the ratchet-down command', () => {
      // BELOW-DEMANDS-RATCHET-DOWN: a silent pass lets the ceiling drift
      // permanently above the truth, which is how a ratchet stops ratcheting.
      const r = run({
        entries: { [identityOf(REAL, 'a')]: {}, [identityOf(REAL, 'b')]: {} },
        suites: [{ file: REAL, tests: [T('a'), T('b', 'passed')] }],
      });
      expect(r.status, r.out).toBe(0);
      expect(r.out).toMatch(/RATCHET DOWN/);
      expect(r.out).toMatch(/test:ratchet:update/);
      expect(r.out).toMatch(/:: b/);
    });

    test('a report path is normalized, so a spelling never zeroes the census', () => {
      // Discriminator: a baselined failure keyed on the REPO-RELATIVE path. If
      // normalization failed, the row keys under an absolute path, is absent
      // from the census, and reds as a regression — so only a PASS proves it.
      const r = run({
        entries: { [identityOf(REAL, 'a')]: {} },
        suites: [{ file: REAL, tests: [T('a')] }],
      });
      expect(r.status, r.out).toBe(0);
    });
  });

  // ── ⛔ the tests must RUN ──────────────────────────────────────────────────
  describe('a SKIPPED test is a HOLE, not a fix', () => {
    test('a baselined test that turns up SKIPPED reds the gate', () => {
      // The cheapest way to green a per-test ratchet is to `.skip` the failing
      // test. That converts measured debt into an invisible hole while the
      // ratchet reports a win, so it must be refused explicitly.
      const r = run({
        entries: { [identityOf(REAL, 'a')]: {} },
        suites: [{ file: REAL, tests: [T('a', 'pending')] }],
        skippedCeiling: 5,
      });
      expect(r.status, r.out).not.toBe(0);
      expect(r.out).toMatch(/SKIPPED|HOLE/i);
    });

    test('growth in the suite-wide skip count reds the gate', () => {
      const r = run({
        entries: {},
        suites: [{ file: REAL, tests: [T('a', 'pending'), T('b', 'pending'), T('c', 'passed')] }],
        skippedCeiling: 1,
      });
      expect(r.status, r.out).not.toBe(0);
      expect(r.out).toMatch(/skipped tests grew/i);
    });

    test('the skip ceiling PASSES when skips shrink (it is not an always-red gate)', () => {
      const r = run({
        entries: {},
        suites: [{ file: REAL, tests: [T('a', 'pending'), T('b', 'passed')] }],
        skippedCeiling: 4,
      });
      expect(r.status, r.out).toBe(0);
    });
  });

  // ── scope sentinel ────────────────────────────────────────────────────────
  describe('scope sentinel — "a suite ran" is not "the frozen suite ran"', () => {
    test('a suite that FAILED TO COLLECT reds (its tests vanish rather than fail)', () => {
      // An import error or collection timeout yields a suite with zero
      // assertionResults: every test it owned disappears from the census and any
      // banked debt inside it reads as repaid. Silent erasure.
      const r = run({
        entries: {},
        suites: [{ file: REAL, tests: [T('a', 'passed')] }, { file: REAL2, tests: [] }],
      });
      expect(r.status, r.out).not.toBe(0);
      expect(r.out).toMatch(/SCOPE SENTINEL/);
      expect(r.out).toMatch(/failed to COLLECT/i);
    });

    test('an ALLOWLISTED uncollected suite is tolerated (attributed collection debt)', () => {
      // Positive control for the allowlist: the guard above must not make a
      // known, attributed collection failure un-gateable forever.
      const r = run({
        entries: {},
        uncollectedSuites: { [REAL2]: { subsystem: 'meta', cause: 'injected', introducedAt: 'a'.repeat(40), class: 'debt' } },
        suites: [{ file: REAL, tests: [T('a', 'passed')] }, { file: REAL2, tests: [] }],
      });
      expect(r.status, r.out).toBe(0);
      expect(r.out).not.toMatch(/failed to COLLECT/i);
    });

    test('an allowlisted suite that COLLECTS again prints RATCHET DOWN', () => {
      // The allowlist must stop granting a hole the suite no longer needs.
      const r = run({
        entries: {},
        uncollectedSuites: { [REAL2]: { subsystem: 'meta', cause: 'injected', introducedAt: 'a'.repeat(40), class: 'debt' } },
        suites: [{ file: REAL, tests: [T('a', 'passed')] }, { file: REAL2, tests: [T('c', 'passed')] }],
      });
      expect(r.status, r.out).toBe(0);
      expect(r.out).toMatch(/RATCHET DOWN/);
      expect(r.out).toMatch(/now COLLECT/);
    });

    test('a baselined test whose file is on disk but did NOT run reds', () => {
      const r = run({
        entries: { [identityOf(REAL, 'vanished')]: {} },
        suites: [{ file: REAL, tests: [T('other', 'passed')] }],
      });
      expect(r.status, r.out).not.toBe(0);
      expect(r.out).toMatch(/SCOPE SENTINEL/);
      expect(r.out).toMatch(/did NOT RUN/);
    });

    test('a baselined test whose file was DELETED is a legitimate ratchet-down, not a scope red', () => {
      // Deleting the file is a real (if blunt) repair; the sentinel must not
      // confuse it with an erasure, or every legitimate deletion reds forever.
      const r = run({
        entries: { 'tests/lint/goneForever.test.js :: x': { file: 'tests/lint/goneForever.test.js', test: 'x' } },
        suites: [{ file: REAL, tests: [T('a', 'passed')] }],
      });
      expect(r.status, r.out).toBe(0);
      expect(r.out).toMatch(/RATCHET DOWN/);
    });

    test('a collapse in the total test count reds (>10% shrink is a scope event)', () => {
      const r = run({
        entries: {},
        totalTests: 1000,
        suites: [{ file: REAL, tests: [T('a', 'passed'), T('b', 'passed')] }],
      });
      expect(r.status, r.out).not.toBe(0);
      expect(r.out).toMatch(/collapsed/);
    });

    test('the sentinel PASSES when scope is intact (it is not an always-red gate)', () => {
      // A guard that can only ever fail would be deleted, taking the real
      // protection with it. Positive control: same shape, consistent scope.
      const r = run({
        entries: { [identityOf(REAL, 'a')]: {} },
        totalTests: 3,
        suites: [{ file: REAL, tests: [T('a'), T('b', 'passed')] }, { file: REAL2, tests: [T('c', 'passed')] }],
      });
      expect(r.status, r.out).toBe(0);
      expect(r.out).toMatch(/OK — no test regressions/);
      // anchored: the verdict assertion above proves the sentinel ran through to the normal path
      expect(r.out).not.toMatch(/SCOPE SENTINEL/);
    });
  });

  // ── --update cannot bank a lie ────────────────────────────────────────────
  describe('--update is REMOVE-ONLY and guarded by the same sentinels', () => {
    test('⛔ --update REFUSES to bank a failing test it has not seen before', () => {
      // THE ANTI-LAUNDERING LAW. If `--update` could absorb new failures, the
      // whole census degrades into "whatever is broken today", and a regression
      // is one command away from becoming permanent debt.
      const r = run({
        entries: { [identityOf(REAL, 'a')]: {} },
        suites: [{ file: REAL, tests: [T('a'), T('brandNew')] }],
        args: ['--update'],
      });
      expect(r.status, r.out).not.toBe(0);
      expect(r.out).toMatch(/REFUSED/);
      expect(r.out).toMatch(/brandNew/);
      expect(r.out).toMatch(/attribution/i);
    });

    test('--update REMOVES a repaired entry and keeps the surviving one attributed', () => {
      const r = run({
        entries: { [identityOf(REAL, 'a')]: {}, [identityOf(REAL, 'b')]: {} },
        suites: [{ file: REAL, tests: [T('a'), T('b', 'passed')] }],
        args: ['--update'],
      });
      expect(r.status, r.out).toBe(0);
      const written = JSON.parse(readFileSync(r.baselineFile, 'utf8'));
      expect(Object.keys(written.entries)).toEqual([identityOf(REAL, 'a')]);
      // The attribution must SURVIVE a re-freeze — a re-freeze that dropped it
      // would launder every remaining row on the next update.
      expect(written.entries[identityOf(REAL, 'a')].subsystem).toBe('meta');
      expect(written.entries[identityOf(REAL, 'a')].introducedAt).toMatch(/^[0-9a-f]{40}$/);
    });

    test('⚠ a VANISHED baselined test reds the gate but does NOT wedge --update', () => {
      // The membership check's own message says "re-freeze explicitly with
      // `npm run test:ratchet:update`". If that check also fired during the
      // re-freeze, the instruction would name a command that cannot succeed and
      // a legitimately RENAMED test would wedge the ratchet permanently.
      const suites = [{ file: REAL, tests: [T('renamed', 'passed')] }];
      const entries = { [identityOf(REAL, 'oldName')]: {} };
      // (a) the GATE reds — the erasure is still caught
      const gate = run({ entries, suites });
      expect(gate.status, gate.out).not.toBe(0);
      expect(gate.out).toMatch(/did NOT RUN/);
      // (b) the RE-FREEZE succeeds, drops the row, and says so loudly
      const upd = run({ entries, suites, args: ['--update'] });
      expect(upd.status, upd.out).toBe(0);
      expect(upd.out).toMatch(/did not RUN AT ALL/);
      expect(Object.keys(JSON.parse(readFileSync(upd.baselineFile, 'utf8')).entries)).toEqual([]);
    });

    test('--update still refuses a re-freeze when the whole suite collapsed', () => {
      // The escape above must not become a hole: the gross case the membership
      // check guarded against during --update is still caught by the count floor.
      const r = run({
        entries: { [identityOf(REAL, 'a')]: {} },
        totalTests: 5000,
        suites: [{ file: REAL, tests: [T('a')] }],
        args: ['--update'],
      });
      expect(r.status, r.out).not.toBe(0);
      expect(r.out).toMatch(/collapsed/);
    });

    test('a broken runner cannot re-freeze the census', () => {
      const r = run({
        entries: { [identityOf(REAL, 'a')]: {} },
        report: null,
        args: ['--update'],
      });
      expect(r.status, r.out).not.toBe(0);
      // The census on disk must be untouched — a broken run that emptied it
      // would turn every real failure into a regression forever.
      expect(Object.keys(JSON.parse(readFileSync(r.baselineFile, 'utf8')).entries)).toHaveLength(1);
    });

    test('--bootstrap is refused when a census already exists', () => {
      const r = run({
        entries: { [identityOf(REAL, 'a')]: {} },
        suites: [{ file: REAL, tests: [T('a'), T('brandNew')] }],
        args: ['--bootstrap'],
      });
      expect(r.status, r.out).not.toBe(0);
      expect(r.out).toMatch(/--bootstrap refused/);
    });

    test('a missing census reds rather than passing vacuously', () => {
      const r = run({
        noBaseline: true,
        suites: [{ file: REAL, tests: [T('a', 'passed')] }],
      });
      expect(r.status, r.out).not.toBe(0);
      expect(r.out).toMatch(/no baseline file/);
    });
  });

  // ── the pure helpers, unit-pinned ─────────────────────────────────────────
  describe('the identity and parse helpers', () => {
    test('identityOf is file + full test name, and never a line number', () => {
      expect(identityOf('a/b.test.js', 'suite > case')).toBe('a/b.test.js :: suite > case');
    });

    test('normalizePath accepts absolute, backslash and ./-prefixed spellings', () => {
      expect(normalizePath(join(ROOT, 'tests/x.test.js'))).toBe('tests/x.test.js');
      expect(normalizePath('./tests/x.test.js')).toBe('tests/x.test.js');
      expect(normalizePath('tests\\x.test.js')).toBe('tests/x.test.js');
    });

    test('rowsOf reconstructs fullName from ancestorTitles when the runner omits it', () => {
      const rows = rowsOf({
        testResults: [{
          name: 'tests/x.test.js',
          assertionResults: [{ ancestorTitles: ['outer', 'inner'], title: 'case', status: 'failed' }],
        }],
      }, ROOT);
      expect(rows).toEqual([{
        file: 'tests/x.test.js', fullName: 'outer > inner > case',
        id: 'tests/x.test.js :: outer > inner > case', status: 'failed',
      }]);
    });

    test('uncollectedOf names exactly the suites that produced no tests', () => {
      expect(uncollectedOf({
        testResults: [
          { name: 'tests/a.test.js', assertionResults: [{ fullName: 'x', status: 'passed' }] },
          { name: 'tests/b.test.js', assertionResults: [] },
        ],
      }, ROOT)).toEqual(['tests/b.test.js']);
    });

    test('the scope floor ratio is a real fraction below 1 (a ratio of 0 disables the guard)', () => {
      expect(SCOPE_FLOOR_RATIO).toBeGreaterThan(0.5);
      expect(SCOPE_FLOOR_RATIO).toBeLessThan(1);
    });
  });
});
