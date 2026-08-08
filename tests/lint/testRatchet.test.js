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
import {
  dirname, join, relative, resolve,
} from 'node:path';
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
//
// RATCHETED 40 → 35 on 2026-08-07 by the WALKER-CENSUS lane, which turned the ⛔ law
// above from a sentence into the machinery in the last describe of this file. Five more
// enforcement-walker rows left, each freed by re-freezing the walker's OWN shrink-only
// inventory (guidanceRegistry title= 482 → 484; ruinFilterRoster's six undispositioned
// readers; mechanismLitCoverage's 23 modules + 1 flag; sovereigntyLightingContract's
// five census figures). NONE of them left because the underlying debt was repaired —
// the debt is RELOCATED to where a NEW violation still reds, and inventoried by name.
//
// RATCHETED 35 → 30 on 2026-08-07 by the same lane's SECOND cut, which closed a MEASURED
// GAP IN THE CLASSIFIER THAT HAD JUST BEEN BUILT TO CLOSE A GAP. The three-arm union
// missed five more rows across three files, and the misses were not random — each was a
// walker whose ENUMERATION the arms structurally could not see:
//   • domainAnyCastBaseline ×2 and transcendentalMathBaseline ×2 DELEGATE the tree walk
//     to an imported counter (scripts/count-{domain-any,transcendental-math}.mjs), so
//     the test file itself contains no `readdirSync` at all;
//   • roadsParticipation ×1 enumerates by SHELLING OUT (`execFileSync('grep', ['-rl', …])`),
//     which no `readdirSync|globSync|fg.sync` regex can match.
// ⛔⛔ AND domainAnyCastBaseline.test.js WAS ON THIS FILE'S OWN ORDINARY-TEST CONTROL LIST,
// so a standing pin ASSERTED the classifier was CORRECT to ignore a walker. A control that
// certifies a miss is worse than no control: it converts an open hole into a proof. Both
// the classifier and the control are repaired below, and the two arms added are STRUCTURAL,
// not declarative — see the arm block for the measured catch/false-positive pairs and for
// the TITLE-arm hypothesis that was tested and REJECTED on its numbers.
// RATCHETED 30 → 28 on 2026-08-08 after the recovery verifier exposed three more
// disabled guards. architectureFreshness was repaired by re-deriving the documented
// module count; generosityReactions now carries an exact per-file runtime-fold inventory.
// migrationRollbackDiscipline remains owner-gated and stays in the census + OWED ledger.
const CEILING = 28;

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

// ── ⛔ THE WALKER-CENSUS LAW, MADE EXECUTABLE ────────────────────────────────
//
// THE LAW (CONTRIBUTING.md, "The gate"; restated in this file's header): a failing TEST
// is debt; a failing WALKER is a DISABLED GUARD; an enforcement walker may never be put
// in the test census. Until 2026-08-07 that law existed in TWO PLACES AND BOTH OF THEM
// WERE COMMENTS THAT CHECKED NOTHING — and the commit that wrote it left TEN rows in
// scripts/.test-ratchet-baseline.json that violate it. Prose is not enforcement; this
// block is.
//
// ── HOW AN ENFORCEMENT WALKER IS IDENTIFIED, AND WHY NOT BY FILENAME ─────────────────
// The obvious check is `.walker.` in the filename, and it is WRONG. Measured against the
// ten rows: it misses BOTH rows of tests/property/mechanismLitCoverage.test.js, which is
// an enforcement walker carrying no `.walker.` in its name. A guard that catches 8 of 10
// and reports success is worse than no guard, because it converts an open problem into a
// solved-looking one.
//
// So the identification is DERIVED, from FIVE INDEPENDENT arms, and a file is an
// enforcement walker if ANY of them fires:
//
//   A1 NAME     — the filename declares it (`*.walker.test.js`).
//   A2 TITLE    — the module header's own title line declares it. A walker that is
//                 RENAMED loses A1 and keeps this.
//   A3 STRUCTURE— the file ENUMERATES A SOURCE TREE *and* compares the result against a
//                 FROZEN INVENTORY token (BASELINE, CEILING, CENSUS, ALLOWLIST, EXEMPT,
//                 ROSTER, …). This arm needs no declaration of any kind and is the one
//                 that catches mechanismLitCoverage.
//   A4 DELEGATED— the same structural predicate, holding inside a NON-TEST local module
//     STRUCTURE   the file IMPORTS. A ratchet whose counter lives in `scripts/` contains
//                 no enumeration of its own; the walk is one import away.
//   A5 MARKER   — `@enforcement-walker`, the explicit source-local declaration used when
//                 a freeze lives in a bare literal, exception Set, or external document
//                 and therefore cannot be recovered reliably from syntax alone.
//
// ⚠ WHAT "ENUMERATES A SOURCE TREE" MEANS, AND WHY IT WAS WIDENED. The first cut spelled
// it `readdirSync|globSync|fg.sync` and that MISSED roadsParticipation.test.js, which
// enumerates by SHELLING OUT — `execFileSync('grep', ['-rl', '\\.npcs', …])`. A shell-out
// walk is a walk. The predicate now also matches an `execFileSync|execSync|spawnSync` of
// `grep`/`git`/`find`/`rg`, which is what a source scan actually looks like when the
// author wanted a recursive matcher rather than a directory reader.
//
// NO SINGLE ARM IS SUFFICIENT, and the pins below prove it BY EXECUTION rather than by
// assertion in a comment: A1 misses mechanismLitCoverage (no `.walker.` in the name); A3
// misses warCostKindPools and warRulingKindPools (they read a registry through imports and
// never walk anything) AND both baseline ratchets (their walk is delegated); A4 misses
// everything whose walk is in the test file itself. Each arm covers another's blind spot,
// which is why the union is used and why deleting any one of them reds a pin here.
//
// ⚠ RESIDUAL, STATED AGAINST INTEREST: A1 and A2 are DECLARATIONS, so they fail OPEN — a
// walker that is renamed AND whose header stops calling it a walker escapes both, and is
// then caught only if A3 or A4 sees it. Those two are structural and cannot be talked out
// of, but they only see walkers whose ENUMERATION is visible from the test file or one
// import away. A registry-reading walker that is renamed and re-titled still escapes all
// five, and so does one whose walk is two imports deep. A5 exists because the classifier
// has now missed all three of the non-token spellings above in live census rows. The
// declaration can still be deleted, so the structural residual remains; the source-local
// marker makes that deletion explicit and reviewable instead of relying on a central list.
//
// ── THE FALSE-POSITIVE FIGURES, MEASURED, AND THE ARM THAT WAS REJECTED ───────────────
// All figures below come from an integrity-counted `git archive` of committed abc5a78b
// (6,196 tracked paths in, 6,196 files out, `git status` clean), never from the live
// shared tree (THE ARCHIVE-CENSUS LAW). They are recorded for SCALE and are NOT asserted
// anywhere — they would rot on the next test file. What IS asserted is the ORDINARY-TEST
// CONTROL below.
//
//   THE THREE-ARM UNION      135 of 2,352 estate test files   5.74%   (69 A1 / 85 A2 / 73 A3)
//   + A3's widened walk      +2 files                                 → roadsParticipation,
//                                                                      committedSecretsScan
//   + A4 delegated structure +3 files                                 → domainAnyCastBaseline,
//                                                                      transcendentalMathBaseline,
//                                                                      aiFallbackTotality
//   THE FOUR-ARM UNION       140 of 2,352                     5.95%
//   + A5 explicit marker     +3 files                                 → architectureFreshness,
//                                                                      migrationRollbackDiscipline,
//                                                                      generosityReactions
//   THE FIVE-ARM UNION       143 of 2,352                     6.08%
//
// PRECISION OF THE WIDENING, AUDITED ONE FILE AT A TIME: all five newly-swept files are
// enforcement walkers. roadsParticipation was CONFIRMED BY EXECUTION (its census row was
// failing, and the failure is an inventory that had grown from 31 dispositioned readers
// to 38 while the row was banked); committedSecretsScan matches every git-TRACKED file
// against key shapes; aiFallbackTotality asserts "the fallback drivers cover the full
// discovered AI-surface roster (a new surface reds)" over the shared aiSurfaceCensus.
// FIVE catches, ZERO false positives, for 5 files of extra reach.
//
// ⛔ THE TITLE-ARM HYPOTHESIS WAS TESTED AND REJECTED — ON ITS NUMBERS, NOT ON TASTE.
// The census key is `<file> :: <full test title>`, and both baseline ratchets announce
// themselves in the TITLE ("ratchet", "frozen baseline governance") while saying nothing
// in the module header — so an arm reading the census ROW, with no file read at all, was
// the obvious cheap fix. Measured over every collected test title in the estate
// (`vitest list`, 27,287 titles across 2,343 files):
//
//   narrow (`ratchet`|`shrink-only`)   362 titles  1.33%   83 files, 40 outside the union
//   broad  (+ frozen/census/roster/…)  1,159       4.25%  344 files, 253 outside the union
//
// It does catch all five, and on TODAY'S census its precision is perfect (12 of 35 rows,
// all twelve genuine walkers). It was still refused, for three measured reasons.
//   (1) THE TOKENS ARE DOMAIN NOUNS IN A WORLD SIM. "ratchet" is a house term for a
//       one-way STAT as well as for a guard: tests/domain/pantheon.test.js "ratchet
//       wins/losses (commutative fold)", tests/domain/martialMoralWF8.test.js "martial
//       readiness ratchet", tests/domain/warConservationDismiss.test.js "strips the
//       exhaustion ratchet", tests/components/welcomeJourney.test.jsx "lazy-ratchet
//       finger" — four confirmed non-guards in the first sample. "census", "roster" and
//       "frozen" are far worse (a settlement census, a faction roster), which is what
//       takes the broad variant to 253 files.
//   (2) IT BUYS NOTHING THE STRUCTURAL ARMS DO NOT. Every one of its twelve census hits
//       is covered by A1–A4, so its entire contribution here would be false positives.
//   (3) IT IS A THIRD DECLARATION. The recorded residual above is precisely that
//       declarations fail open; adding another does not narrow the structural hole.
// The finding that came OUT of testing it is kept: it is what surfaced roadsParticipation,
// which A3 then had to be widened to see structurally.
describe('⛔ the walker-census law — an enforcement walker may not be frozen as debt', () => {
  /** The header's TITLE LINE: the first non-empty line of the leading docblock. */
  function headerTitleLine(src) {
    const block = src.match(/^\s*\/\*\*?([\s\S]*?)\*\//);
    if (!block) return '';
    for (const raw of block[1].split('\n')) {
      const line = raw.replace(/^\s*\*?\s?/, '').trim();
      if (line) return line;
    }
    return '';
  }

  // A DIRECTORY READ, a glob, or a recursive matcher SHELLED OUT TO. The last clause is
  // not decoration: roadsParticipation.test.js enumerates worldPulse+spatial entirely
  // through `execFileSync('grep', ['-rl', …])` and was invisible to the first three.
  const DIR_SCAN = /readdirSync\s*\(|globSync\s*\(|\bfg\.sync\b/;
  const SHELL_SCAN = /(?:execFileSync|execSync|spawnSync)\s*\(\s*['"`](?:grep|git|find|rg)['"`]/;
  const TREE_SCAN = new RegExp(`${DIR_SCAN.source}|${SHELL_SCAN.source}`);
  const FROZEN_INVENTORY = /\bBASELINE\b|\bCEILING\b|\bCENSUS\b|\bEXPECTED\b|\bFROZEN\b|\bALLOWLIST\b|\bEXEMPT\b|\bROSTER\b|\bINVENTORY\b|\bMANIFEST\b|-baseline\.json|shrink-only/;
  const ENFORCEMENT_WALKER_MARKER = /@enforcement-walker\b/;

  /** The structural predicate, applied to ONE source text. */
  const isGuardSource = (src) => TREE_SCAN.test(src) && FROZEN_INVENTORY.test(src);

  const srcCache = new Map();
  const readSrc = (file) => {
    if (!srcCache.has(file)) srcCache.set(file, readFileSync(join(ROOT, file), 'utf8'));
    return srcCache.get(file);
  };

  /**
   * The RELATIVE, NON-TEST modules a file imports, resolved to repo-relative paths.
   *
   * ⚠ TEST FILES ARE DELIBERATELY EXCLUDED, and the exclusion was measured rather than
   * assumed. Three ordinary domain tests (brokerageIntercept, strategicPosture,
   * secrecyTradeDormancyFence) import a helper EXPORTED FROM a walker test file
   * (tests/lint/engineGatedRuleKeys.walker.test.js), and without this clause A4 claimed
   * all three. A walker file's walker-ness belongs to ITS OWN census rows, never to its
   * importers'. With the clause, A4's five hits are five genuine walkers.
   */
  function localModulesOf(file, src) {
    const out = new Set();
    const re = /(?:from|import|require)\s*\(?\s*['"](\.[^'"]+)['"]/g;
    let m;
    while ((m = re.exec(src))) {
      const rel = relative(ROOT, resolve(join(ROOT, dirname(file)), m[1]));
      for (const cand of [rel, `${rel}.js`, `${rel}.mjs`, `${rel}.cjs`]) {
        if (existsSync(join(ROOT, cand))) {
          if (!/\.test\.[cm]?jsx?$/.test(cand)) out.add(cand);
          break;
        }
      }
    }
    return [...out];
  }

  /** @returns {{ name: boolean, title: boolean, structure: boolean, delegated: boolean, marker: boolean }} */
  function walkerArmsOf(file) {
    const src = readSrc(file);
    return {
      name: /\.walker\.test\.[cm]?jsx?$/.test(file),
      title: /\bwalkers?\b/i.test(headerTitleLine(src)),
      structure: isGuardSource(src),
      delegated: localModulesOf(file, src).some((dep) => {
        try { return isGuardSource(readSrc(dep)); } catch { return false; }
      }),
      marker: ENFORCEMENT_WALKER_MARKER.test(src),
    };
  }

  const isEnforcementWalker = (file) => Object.values(walkerArmsOf(file)).some(Boolean);

  const walkerRows = Object.entries(baseline.entries)
    .filter(([, row]) => isEnforcementWalker(row.file))
    .map(([id]) => id);

  // ── THE TWO LEDGERS. Both are SHRINK-ONLY and audited by EXACT IDENTITY, and they
  // mean DIFFERENT things. Confusing them is how a quarantine becomes a second census.
  //
  // ADMITTED — the row lives in a walker file but is NOT a disabled guard, because its
  // assertion ranges over a CLOSED, per-member identity rather than an open tree-derived
  // population. `test.each(REGISTRY)('$kind retains …')` mints ONE TEST PER KIND, so
  // freezing three kinds leaves the guard fully live for every other kind and for every
  // kind added later (a new kind mints a new identity, which is absent from the census
  // and reds as a regression — the law pinned in "A FAILING TEST ABSENT FROM THE CENSUS
  // IS A REGRESSION"). Measured at af8815e9: 6 of the 9 war-cost kinds PASS while these
  // 3 fail. That is ordinary banked debt and it is allowed to stay.
  const WALKER_ROWS_ADMITTED = Object.freeze({
    "tests/lint/warCostKindPools.walker.test.js :: SP-6 phrased-kind registry — WR-4 war costs 'war_trajectory_winning' retains the five receipt-annex families verbatim":
      'PER-KIND IDENTITY, not an open population: test.each mints one test per kind, 6 of 9 war-cost kinds pass, and a NEW kind mints a NEW identity that reds. The corpus itself is chair-gated — tests/helpers/receiptAnnex.js records that the kinds DEEPENED past the fixed-five assumption (1e8bf8a8) stay red under D-W3 Class B, which needs a ruling (cap raised vs corpus trimmed), not a parser.',
    "tests/lint/warCostKindPools.walker.test.js :: SP-6 phrased-kind registry — WR-4 war costs 'war_trajectory_losing' retains the five receipt-annex families verbatim":
      'PER-KIND IDENTITY (see war_trajectory_winning). Annex deepened to 6 families against a wired 5; D-W3 Class B, chair-gated.',
    "tests/lint/warCostKindPools.walker.test.js :: SP-6 phrased-kind registry — WR-4 war costs 'trajectory_misread' retains the five receipt-annex families verbatim":
      'PER-KIND IDENTITY (see war_trajectory_winning). Annex deepened to 10 families against a wired 5; D-W3 Class B, chair-gated.',
    "tests/lint/warRulingKindPools.walker.test.js :: SP-6 phrased-kind registry — WR-5 war rulings 'succession_demand_inherited' retains the five annex families without editorial cross-references":
      'PER-KIND IDENTITY (see war_trajectory_winning). Annex deepened to 6 families against a wired 5; D-W3 Class B, chair-gated.',
  });

  // OWED — CONFIRMED disabled guards this lane did not free. Each is ONE assertion over
  // an OPEN, tree-derived population, so its failing verdict is byte-identical however
  // many more violations land. They are named here so the debt is VISIBLE and CANNOT
  // GROW: a NEW walker row in neither ledger reds. ⛔ This list is not permission — it is
  // an outstanding bill, and the honest reading of it is "fourteen guards are switched
  // off; two of those wait on owner-gated work".
  const WALKER_ROWS_OWED = Object.freeze({
    'tests/docs/migrationRollbackDiscipline.test.js :: migration rollback discipline new money/PII migrations ship a reversal or an explicit @rollback note':
      'OWNER-GATED DEPLOY-SAFETY GUARD. Migration 195 has neither a reviewed rollback script nor an inline @rollback note. A build lane may expose this debt but may not choose the live reversal posture.',
    'tests/lib/spatialLedgerCoverage.walker.test.js :: spatialUsage ledger-coverage walker (lib-infra-copy-1) every written spatialLedgers key is TRACKED or EXEMPT (and no phantom classifications)':
      'OWNER-HELD. The cure is two entries in src/lib/spatialUsage.js, a file an owner session holds UNCOMMITTED together with both writers; with those edits applied the walker PASSES in the live tree. Drop this row and the census row together when the owner commits.',
    'tests/copy/voiceMechanics.test.js :: E2 voiceMechanics — src/data + src/domain string-literal ratchet (shrink-only) total debt never grows past its committed budget':
      'NOT FREED — needs a re-freeze of the voice ratchet fixture at a measured sha (string-literal debt 1369 against a budget of 670, from Lane P-3 generated corpora). Own wave: the re-freeze is large and the corpora are machine-generated.',
    'tests/copy/voiceMechanics.test.js :: E2 voiceMechanics — src/data + src/domain string-literal ratchet (shrink-only) per-file debt exactly matches the baseline (grew ⇒ rewrite; fell ⇒ bank the win)':
      'NOT FREED — the per-file arm of the same string-literal ratchet; same re-freeze, same wave.',
    'tests/copy/voiceMechanics.test.js :: E-E voiceMechanics JSX extension — src/**/*.jsx component ratchet (shrink-only) total JSX debt never grows past its committed budget':
      'NOT FREED — the JSX arm of the same ratchet (18 against a budget of 6); same re-freeze, same wave.',
    'tests/copy/voiceMechanics.test.js :: E-E voiceMechanics JSX extension — src/**/*.jsx component ratchet (shrink-only) per-file JSX debt exactly matches the baseline (grew ⇒ rewrite; fell ⇒ bank the win)':
      'NOT FREED — the per-file JSX arm of the same ratchet; same re-freeze, same wave.',
    'tests/design/deepCraftKillList.test.js :: THE DEEP CRAFT kill-list ratchets (shrink-only; zero closes the wave) tintedCallouts: count <= 163 (grew = new SaaS structure; shrank = lower this ceiling)':
      'NOT FREED — a one-line ceiling re-freeze (164 against 163), but the kill-list is a design wave whose ceilings are meant to be driven to zero; raising one is a design call, not a ratchet-repair call.',
    'tests/docs/deployRunbookFreshness.test.js :: DEPLOY.md freshness — the runbook derives from the filesystem names the current migration head file':
      'NOT FREED and OWNER-GATED: the cure is to name migration 195 as the head in docs/DEPLOY.md, and migrations/deploys are an owner-gated class a build lane may not touch.',
    'tests/docs/enforcement-claims.test.js :: enforcement-claims meta-pin (A+ P1.1) every completeness claim carries an @enforced-by tag with ≥1 target':
      'NOT FREED — the cure is to give the R-BLD-10 chair-ruling row in docs/FABLE_VALIDATION_QUEUE.md a resolvable @enforced-by target, which is a chair ruling about that row, not a ratchet edit.',
    'tests/domain/metronomeCooldownLint.test.js :: metronome-cooldown lint — condition-bearing outcome sources self-limit the non-cooldown emitter set may only SHRINK (no NEW condition-bearing source bypasses the metronome)':
      'NOT FREED — razingExecution.js stamps a metronome-EXEMPT outcome source naming no cooldown mechanism. Re-freezing would bank a flood-class bypass; the right cure is to give it a mechanism, which is a worldPulse change outside this lane.',
    'tests/joins/crisisTripleSync.test.js :: source scan — the trio is written only through the lifecycle the twin actions are referenced only by their definitions and the directive consumer':
      'NOT FREED — the pin reads a source region its consumer has moved out of (the first-match/line-address rot class). The cure is to RE-POINT the pin at the live consumer, and a mis-pointed pin must not be re-frozen at its wrong address.',
    'tests/joins/crisisTripleSync.test.js :: source scan — the trio is written only through the lifecycle the wiring is live, not vacuously empty':
      'NOT FREED — the anti-vacuity arm of the same mis-pointed scan; it must be re-pointed with its sibling, never frozen.',
    'tests/lint/clampPrimitiveBaseline.test.js :: clamp primitive baseline ratchet (code-quality-4) baseline exactly matches the files that still define a local clamp/clamp01':
      'NOT FREED — 73 local clamp definitions against a baseline of 62. Re-freezing banks 11 forks of a shared primitive; the cure is to route them, which is its own sweep.',
    'tests/lint/proseNumerics.test.js :: prose numerics live-tree ratchet (exact legacy identity, shrink-only) path + line + category + snippet debt exactly matches the committed baseline':
      'NOT FREED — a 413-row LINE-ADDRESSED inventory that rots whenever any governed file shifts lines. A regeneration must review every removed row, which is a wave, not a step.',
  });

  const admittedIds = Object.keys(WALKER_ROWS_ADMITTED);
  const owedIds = Object.keys(WALKER_ROWS_OWED);

  // LITERALS, not figures read out of the objects they are supposed to cap — a ceiling
  // derived from its own list proves list == list and rises silently with every entry.
  // MONOTONE DOWN from here. You may burn them; you may never pad them.
  const ADMITTED_CEILING = 4;
  const OWED_CEILING = 14;

  test('⛔ NO ENFORCEMENT-WALKER ROW SITS IN THE CENSUS UNLESS IT IS LEDGERED', () => {
    // THE PIN THIS WHOLE BLOCK EXISTS FOR. Add a walker row to the census — any walker,
    // by any of the five arms — and this reds until someone writes down which of the
    // two ledgers it belongs in and why. That is the difference between a law and a
    // sentence: the cost of violating it is paid at the gate, not at the next audit.
    const ledgered = new Set([...admittedIds, ...owedIds]);
    const offenders = walkerRows.filter((id) => !ledgered.has(id));
    expect(
      offenders,
      'these census rows are ENFORCEMENT WALKERS. A failing walker is a DISABLED GUARD:\n'
      + 'freeze its OWN shrink-only inventory instead, then delete the row. If the row is\n'
      + 'genuinely ordinary debt (a per-member identity, so new members still red), add it\n'
      + 'to WALKER_ROWS_ADMITTED with the reason. If it is a disabled guard you cannot fix\n'
      + 'today, add it to WALKER_ROWS_OWED with the blocker — and raise no ceiling to do it.',
    ).toEqual([]);
  });

  test('the classifier is not vacuous — it really does flag rows in this census', () => {
    // Without this, the pin above passes trivially the moment the classifier breaks.
    expect(
      walkerRows.length,
      'the walker classifier flagged NOTHING. Either every walker row is gone (delete this'
      + ' block with the ledgers) or the classifier stopped working (far likelier).',
    ).toBeGreaterThan(0);
  });

  test('⛔ NO SINGLE ARM CLASSIFIES THEM ALL — each arm has a named counterexample', () => {
    // The chair's warning, executable. Every file here is a counterexample that FORCES one
    // arm into the union, and if any of them changes shape this reds and the next author
    // has to re-derive the identification instead of trusting a comment.
    //
    // A1 NAME cannot see it:
    const litCoverage = walkerArmsOf('tests/property/mechanismLitCoverage.test.js');
    expect(litCoverage.name, 'mechanismLitCoverage is a walker with NO `.walker.` in its name').toBe(false);
    expect(litCoverage.structure, 'the STRUCTURE arm is what catches it — if this is false the arm is broken').toBe(true);

    // A3 STRUCTURE cannot see it (it walks nothing — it reads a registry through imports):
    const warCosts = walkerArmsOf('tests/lint/warCostKindPools.walker.test.js');
    expect(warCosts.name, 'warCostKindPools is caught by NAME').toBe(true);
    expect(warCosts.structure, 'warCostKindPools walks no tree — the STRUCTURE arm cannot see it').toBe(false);
    expect(warCosts.delegated, 'warCostKindPools delegates no walk either — only NAME/TITLE reach it').toBe(false);

    // A1, A2 AND A3 ALL MISS IT — the walk is DELEGATED to an imported counter. This is the
    // gap the 2026-08-07 second cut closed, and it is pinned per-file so that inlining the
    // counter, or moving it, is a visible event rather than a silent loss of coverage.
    for (const file of ['tests/lint/domainAnyCastBaseline.test.js', 'tests/lint/transcendentalMathBaseline.test.js']) {
      const arms = walkerArmsOf(file);
      expect(arms.name, `${file} carries no \`.walker.\` in its name`).toBe(false);
      expect(arms.title, `${file}'s header title line never says "walker"`).toBe(false);
      expect(arms.structure, `${file} contains no enumeration of its own — the walk is in scripts/`).toBe(false);
      expect(arms.delegated, `${file}: the DELEGATED arm is the only one that reaches it — if this is false, A4 is broken`).toBe(true);
    }

    // AND THE WALK CAN BE A SHELL-OUT. roadsParticipation enumerates with `grep -rl`, which
    // the original `readdirSync|globSync|fg.sync` spelling could not match at all. Pin BOTH
    // halves: the narrow directory-scan regex must still miss it, and the widened predicate
    // must still catch it — otherwise a future tidy-up of the regex silently reopens the gap.
    const roads = readSrc('tests/domain/roadsParticipation.test.js');
    expect(DIR_SCAN.test(roads), 'roadsParticipation reads no directory — this is why the walk regex had to widen').toBe(false);
    expect(SHELL_SCAN.test(roads), 'roadsParticipation enumerates by shelling out to grep -rl').toBe(true);
    expect(walkerArmsOf('tests/domain/roadsParticipation.test.js').structure, 'the widened STRUCTURE arm must catch it').toBe(true);

    // A3 also misses freezes written as bare numeric literals, exception Sets, or a
    // number in an external document. Those spellings caused the third live miss in two
    // days, so each file declares the source-local A5 marker instead of being certified
    // as ordinary debt by a central control list.
    for (const file of [
      'tests/docs/architectureFreshness.test.js',
      'tests/docs/migrationRollbackDiscipline.test.js',
      'tests/domain/generosityReactions.test.js',
    ]) {
      const arms = walkerArmsOf(file);
      expect(arms.marker, `${file}: the explicit MARKER arm must classify this open-population guard`).toBe(true);
    }
  });

  test('every walker FREED by this lane still classifies (re-adding one would red)', () => {
    // The rows removed on 2026-08-07 are gone from the census, so the enforcing pin above
    // says nothing about them. This is the standing proof that the law would REFUSE them on
    // the way back in — the acceptance plant, kept rather than run once.
    for (const file of [
      // first cut (35 → 30 predecessors)
      'tests/domain/guidanceRegistry.walker.test.js',
      'tests/lint/ruinFilterRoster.walker.test.js',
      'tests/lint/sovereigntyLightingContract.walker.test.js',
      'tests/property/mechanismLitCoverage.test.js',
      // second cut — the three the classifier had been MISSING
      'tests/lint/domainAnyCastBaseline.test.js',
      'tests/lint/transcendentalMathBaseline.test.js',
      'tests/domain/roadsParticipation.test.js',
      // verifier-reject burn-down: these retain A5 after their rows leave
      'tests/docs/architectureFreshness.test.js',
      'tests/domain/generosityReactions.test.js',
    ]) {
      expect(isEnforcementWalker(file), `${file}: freed by this lane and no longer classified as a walker`).toBe(true);
    }
  });

  // ⛔⛔ A CONTROL THAT CERTIFIES A MISS IS WORSE THAN NO CONTROL — READ THIS BEFORE
  // ADDING A NAME BELOW. On 2026-08-07 this list contained
  // `tests/lint/domainAnyCastBaseline.test.js` and `tests/domain/roadsParticipation.test.js`.
  // BOTH ARE ENFORCEMENT WALKERS, and both were carrying live, failing, frozen census rows
  // at the time. The pin therefore ASSERTED — with a green tick, every run — that the
  // classifier was CORRECT to ignore two disabled guards. That is the worst possible
  // failure mode for a control: it converts an open hole into a proof, and it does it in
  // the one place a reader goes to check whether the hole exists.
  //
  // THE CAUSE WAS THE OBVIOUS ONE, WHICH IS WHY THE FIX IS STRUCTURAL AND NOT A RE-READ.
  // The list was populated by asking "which census files feel like ordinary debt?" and
  // trusting the answer. Both misses look ordinary: one is named after a lint baseline and
  // one lives in tests/domain. So the membership test below is no longer a judgement — the
  // two arms after it require every named file to carry a REAL census row and to be
  // structurally unable to qualify, and the freed-walker pin above independently requires
  // the two ex-members to classify as walkers. A future author who re-adds a walker here
  // reds three pins, not zero.
  const ORDINARY_TEST_CONTROL = Object.freeze([
    'tests/edgeFunctions/aiCharterBundle.freshness.test.js',
    'tests/edgeFunctions/aiGroundingBundle.freshness.test.js',
    'tests/edgeFunctions/aiOutputSchemaBundle.freshness.test.js',
    'tests/edgeFunctions/edgeSharedBundleReproducibility.test.js',
    'tests/lib/accountContentPortability.test.js',
    'tests/security/mapSnapshotImport.contract.test.js',
    'tests/store/customContentSlice.race.test.js',
  ]);

  test('⚠ THE ORDINARY-TEST CONTROL — the classifier leaves real non-walker debt alone', () => {
    // The mirror of the enforcing pin, and the reason the identification is five narrow
    // arms rather than "it reads the filesystem". Every file named here carries REAL debt
    // in this census — a thrown TypeError, a field-projection break, a stale built
    // artifact, a durable-command race, a docs-freshness drift — and none of them is a
    // guard. A classifier that swept them in would refuse legitimate debt and be deleted
    // within a week.
    for (const file of ORDINARY_TEST_CONTROL) {
      const arms = walkerArmsOf(file);
      expect(
        Object.entries(arms).filter(([, hit]) => hit).map(([arm]) => arm),
        `${file} is named here as ordinary debt and the classifier CLAIMS IT. One of the two is\n`
        + 'wrong, and it is almost certainly this list: read the file, and if it enumerates a\n'
        + 'population and compares the result against a frozen one, it is a WALKER — free its\n'
        + 'census row into its own shrink-only inventory and take it off this list. Do NOT narrow\n'
        + 'the classifier to make this green; that is exactly how the 2026-08-07 misses happened.',
      ).toEqual([]);
    }
  });

  test('⛔ the control list is REAL — every named file carries a census row of its own', () => {
    // THE ANTI-PADDING ARM. Without it the control is trivially satisfiable: name ten
    // arbitrary green tests and the classifier "proves" it has no false positives while
    // saying nothing about the rows that actually matter. Requiring each name to own a
    // live census row ties the control to the population it is a control FOR, and it also
    // makes the list self-cleaning — a file whose debt is burned down leaves the list
    // rather than lingering as a stale certificate.
    const censusFiles = new Set(Object.values(baseline.entries).map((r) => r.file));
    const notInCensus = ORDINARY_TEST_CONTROL.filter((f) => !censusFiles.has(f));
    expect(
      notInCensus,
      'these control files carry no census row — a control over green tests proves nothing about'
      + ' the census. Drop them, or name a file whose debt is real.',
    ).toEqual([]);
    // anchored: the membership check above proves the list was compared against a populated
    // census, so the floor below is a floor on a real list rather than on an empty one.
    expect(
      ORDINARY_TEST_CONTROL.length,
      'the control emptied — the false-positive half of this block is no longer being tested',
    ).toBeGreaterThanOrEqual(5);
  });


  test('both ledgers are EXACT — no stale entry survives its census row', () => {
    // A ledger row whose census row is gone is worse than noise: it silently lowers the
    // effective ceiling below, so the next real walker row slips in under a cap that was
    // being held up by a corpse.
    const present = new Set(Object.keys(baseline.entries));
    const stale = [...admittedIds, ...owedIds].filter((id) => !present.has(id));
    expect(stale, 'ledgered ids that are no longer in the census — delete their rows here').toEqual([]);
  });

  test('the two ledgers are disjoint (a row is admitted OR owed, never both)', () => {
    const both = admittedIds.filter((id) => id in WALKER_ROWS_OWED);
    expect(both, 'a row cannot be legitimate debt AND a disabled guard at once').toEqual([]);
  });

  test('the ledger ceilings never rise (both are monotone-down)', () => {
    expect(admittedIds.length).toBeLessThanOrEqual(ADMITTED_CEILING);
    expect(owedIds.length).toBeLessThanOrEqual(OWED_CEILING);
  });

  test('⛔ every ledger entry carries a REAL reason (a stub launders the same defect)', () => {
    // The attribution discipline the census itself enforces, applied to its escape
    // hatches — otherwise the hatches become the cheapest way to bank a disabled guard.
    for (const [id, reason] of Object.entries(WALKER_ROWS_ADMITTED)) {
      expect(String(reason).length, `${id}: admitted with a stub, not an argument`).toBeGreaterThan(60);
    }
    for (const [id, blocker] of Object.entries(WALKER_ROWS_OWED)) {
      expect(String(blocker).length, `${id}: owed with a stub — name the blocker`).toBeGreaterThan(60);
    }
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
