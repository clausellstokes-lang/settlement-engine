/**
 * testRatchet.test.js — the PER-TEST suite ratchet, pinned and PROVEN.
 *
 * scripts/check-test-ratchet.mjs restores the TAIL of `npm run check`. The old
 * bare `npm run test` boolean gate was red and stopped everything behind it.
 * The current 17-step chain puts `test:ratchet` at 15, `build` at 16, and
 * `verify:dist` at 17, with one authoritative phase for every test.
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
import {
  existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, symlinkSync, writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  dirname, join, relative, resolve,
} from 'node:path';
import { describe, expect, test } from 'vitest';

import {
  DEBT_CLASSES, discoverBuildTestFiles, identityOf, normalizePath, rowsOf,
  runnerCommandOf, SOURCE_TEST_EXCLUDE, uncollectedOf, SCOPE_FLOOR_RATIO,
  classifyFailure, failureEvidenceOf, globalTestTimeoutOf, timeoutLiteralsOf,
  FAILURE_CLASSES, VITEST_DEFAULT_TEST_TIMEOUT,
  MAGNITUDE_KINDS, measureMagnitude, magnitudeReportOf, parseReadOnlyArgs, MODE_FLAGS,
} from '../../scripts/check-test-ratchet.mjs';
// DERIVED, never restated: the discharge below asserts that the rehearsal train still
// reaches the migration whose cure retired the owner-gated rows. A literal here would go
// stale silently the moment the train moved.
import { MIGRATION_TRAIN_REPO_HEAD } from '../../scripts/ops/migrationRehearsalCore.mjs';

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
// RATCHETED 30 → 27 on 2026-08-08 after the recovery verifier exposed three more
// disabled guards. architectureFreshness was repaired by re-deriving the documented
// module count; generosityReactions now carries an exact per-file runtime-fold inventory.
// spatialLedgerCoverage now classifies both missed writers and emits the tracked one.
// migrationRollbackDiscipline remains owner-gated and stays in the census + OWED ledger.
//
// RATCHETED 27 → 25 on 2026-08-10, and the UNCOLLECTED allowlist 1 → 0 with it. This is the
// migration-debt retirement, and it is the one cut in this file's history that required a
// PIN to change, so read why before repeating the shape:
//   • The cure landed first, at 1ac94af8 and in the train extension beside it — 195 ships a
//     .down.sql and an inline `-- @rollback:` note, DEPLOY.md names 195 as the head, and
//     MIGRATION_TRAIN_REPO_HEAD reaches 195, so tests/ops/migrationRehearsal.test.js
//     COLLECTS again and all three rows PASS. Nothing was frozen, relabelled, or forgiven.
//   • The gate the rows sat behind was NOT the cure — it was authority. A lane attempted
//     this retirement on 2026-08-09 with the cure already in hand; the pin '⚠ the three
//     migration reds are marked OWNER-GATED' REFUSED it and the change was reverted, which
//     is the pin working exactly as designed. The owner's 2026-08-10 full delegation grant
//     is what discharged it, and the discharge is RECORDED (OWNER_GATED_DISCHARGE below),
//     never deleted — "the class emptied" and "a grant emptied the class" must stay
//     distinguishable long after everyone in the room has forgotten which happened.
//
// RATCHETED 25 → 23 on 2026-08-10 by the F-SURVEY-1 micro-lane, which RE-POINTED the two
// crisisTripleSync source-scan rows rather than re-freezing them. Both were the first-match/
// line-address rot class recorded in their own `introducedAt`: the trio's FORWARD directive
// consumer left settlementSlice.js for settlementLifecycleHelpers.js at 947799f0 (the
// decomposition wave moved applyEvent's world half out of the slice literal verbatim), and
// the cold-slice split at 6e7acc4d added campaignRegionalSliceEntry.js as a second name-site.
// So the scan was reading a file that no longer carried the call, against an allowlist short
// by two live seams.
// ⛔ THE DISTINCTION THAT MATTERS HERE: re-baselining those rows would have banked a WRONG
// ADDRESS. A pin that reads where the code used to be is not a weak guard, it is no guard,
// and freezing it makes the vacuity permanent and invisible. Both re-pointed pins were
// proven live by MUTANT at their NEW addresses — a hand-rolled twin bridge planted outside
// the lifecycle reds the allowlist arm, and severing the twinDirective read inside
// rippleEventThroughWorld reds the wiring arm AND two behavioural matrix tests, which is
// what makes it a synchronization guard rather than a text probe.
// RATCHETED 23 → 17 on 2026-08-10 by the F-SURVEY-1 E7 micro-lane. Six built-artifact rows
// left — three edge-bundle FRESHNESS rows and the three edgeSharedBundleReproducibility
// INDEX-hash rows — and they left because THE DEBT WAS PAID, not because the guards moved.
//
// ⛔ READ THIS BEFORE REPEATING THE SHAPE — THE ORDERED CURE WAS PROVEN A NO-OP.
// F-S1-E7 ordered these six relocated to a POST-BUILD gate step, on the premise that they
// "assert dist state and step 12 runs before the build step". Measured, the premise does not
// hold, in three independent ways:
//   (1) the four suites contain ZERO references to `dist` or VERIFY_DIST — they read
//       supabase/functions/_shared/*, src/*, and the git INDEX, and nothing else;
//   (2) `npm run build` is `vite build`, which emits to dist/ and never regenerates an edge
//       bundle, so NO post-build phase can change these six verdicts;
//   (3) at that time the census ran the WHOLE `vitest run`, so tests/build/ was already
//       inside it — moving a file by DIRECTORY removed nothing. GTR-1 later split only the
//       genuinely artifact-dependent `tests/build/**` corpus into an exact, all-passed
//       post-build authority; these source/index readers are not in that corpus, so the
//       historical conclusion remains unchanged.
// The control that settles it: analyticsEventsBundle and intentAtlasBundle are the same
// shape, in the same suite, in the same pre-build phase — and they were GREEN throughout.
// The three reds were never build-phase ordering. They were three STALE artifacts.
// So the cure was the one the repo had already written down in scripts/hazard-registry.json
// (HZ-DIRTYBUILD upgradePath, verbatim): "one rebuild from a clean committed tree".
// `npm run build:edge-shared` at a clean tree regenerated all five bundles in one window,
// byte-identical across two consecutive runs, and all six assertions went green EXECUTING.
//
// ⚠ THE ONE PIN THAT HAD TO CHANGE, AND WHY — the ORDINARY_TEST_CONTROL floor, 5 → 3.
// That control names the census's ordinary (non-walker) debt files, and its anti-padding arm
// requires every member to carry a LIVE census row. Of the 23 rows, 13 were ledgered walkers
// and exactly 10 were ordinary debt, held by the control's 7 files. This cut retires 4 of
// those 7. The list CANNOT be refilled: every remaining census file is a ledgered walker, and
// naming one here would re-commit the 2026-08-07 error of certifying a walker as ordinary.
// The floor is therefore BOUNDED ABOVE by the ordinary-debt population it controls, so a
// floor held at 5 would forbid burning the census below 5 ordinary-debt files — a control's
// sample size vetoing the burn-down it exists to observe. It steps down WITH the population.
const CEILING = 17;

// ── ⭐ THE OWNER-GATED DISCHARGE (2026-08-10) ─────────────────────────────────
//
// `owner-gated` is the census class for debt a build lane may not repair on its own
// authority — migrations, schema shape, deploys. The pin below used to defend that with
// `gated.length > 0`: the class could never empty, because emptying it is precisely what
// an unauthorised "fix" looks like from the outside.
//
// That defence was correct and it was HONORED (see the RATCHETED 27 → 25 note above). It
// is discharged now, and the discharge is a RECORD rather than a deletion, because the
// assertion has to survive the retirement it permits. So the pin no longer asks whether
// the class is populated. It asks three narrower questions that stay meaningful forever:
// does every surviving owner-gated row say why it is gated; is every row that LEFT the
// class named here against a grant and a landed commit; and is the cure those rows were
// waiting on STILL IN THE TREE.
//
// ⛔ THAT LAST ARM IS THE POINT. Without it a discharge is a comment: revert the rollback
// story and the owner-gated class stays empty because a constant in a test file says a
// grant happened once. Delete supabase/rollback/195_*.down.sql, strip 195's inline
// `-- @rollback:` note, un-name 195 in docs/DEPLOY.md, or walk the rehearsal train back
// behind 195, and this file reds — which is the difference between a discharge and an
// amnesty.
const MIGRATION_REHEARSAL_SUITE = 'tests/ops/migrationRehearsal.test.js';
const OWNER_GATED_DISCHARGE = Object.freeze({
  grant: 'the 2026-08-10 full delegation grant — owner, in chat, verbatim: "i give you all'
    + ' my permissions and leave all remaining judgement to you. keep going until this is'
    + ' all done!" Recorded on the ledger branch in docs/OWNER_DECISION_QUEUE.md under'
    + ' "FULL DELEGATION GRANT (owner, 2026-08-10)", which names migration-195 rollback'
    + ' authoring and the DEPLOY.md head fix as released repair work. The DEPLOY itself is'
    + ' NOT released and is not claimed here: these three rows were debt about the'
    + ' REPOSITORY\'s rollback story, never about applying 195 to a database.',
  landedAt: '1ac94af85de9874a6758086f16dd346091ebf5fa',
  migration: 195,
  retired: Object.freeze([
    'tests/docs/migrationRollbackDiscipline.test.js',
    'tests/docs/deployRunbookFreshness.test.js',
    MIGRATION_REHEARSAL_SUITE,
  ]),
});

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
    expect(
      rows.filter(([, row]) => row.file.startsWith('tests/build/')).map(([id]) => id),
      'build-test debt belongs to strict post-build verification, never the source census',
    ).toEqual([]);
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

  test('⛔ `totalFiles` is COMPARED, not merely present — the pin above used to certify an inert figure', () => {
    // ⚠⚠ THE TITLE OF THE PIN ABOVE WAS FALSE FOR `totalFiles`, and it said so in
    // its own words: "the sentinels are not inert". `totalFiles` was computed by the
    // gate, written by BOTH --bootstrap and --update, and asserted positive right
    // there — while NO arm anywhere compared it to a live run. Three surfaces made
    // it look armed and none of them was. Found by the §854.1 skeptic pass, filed as
    // a guards-family row, and armed by TE-RATCHET-MAG.
    //
    // This is a SOURCE pin rather than a behavioural one on purpose: the behaviour is
    // convicted by execution in 'a collapse in the total test FILE count reds' below.
    // What this adds is the thing the executed pin cannot say — that the figure is read
    // by the gate at all, so deleting the comparison reds here even if someone also
    // deletes the executed test.
    const gate = readFileSync(SCRIPT, 'utf8');
    expect(
      /baseline\.totalFiles/.test(gate),
      'the gate no longer READS baseline.totalFiles — the sentinel is inert again',
    ).toBe(true);
    expect(
      /total test FILE count collapsed/.test(gate),
      'the file-floor refusal message is gone — the comparison was removed',
    ).toBe(true);
  });

  // ── ⭐ TE-RATCHET-MAG — the banked rows' MAGNITUDE (ODQ §854) ────────────────
  // Banking a row freezes its EXISTENCE. Every surviving census row is a ledgered
  // enforcement walker whose verdict is a POPULATION, so without a magnitude the
  // contents behind a permitted red are unbounded — measured at +109 em dashes across
  // 29 further files with every gate green. These pins make the declaration mandatory
  // and well-formed; the executed block convicts the gate that acts on it.
  test('⛔ EVERY BANKED ROW DECLARES A MAGNITUDE — a permitted red may not be unbounded', () => {
    for (const [id, row] of Object.entries(baseline.entries)) {
      expect(
        Array.isArray(row.magnitude) && row.magnitude.length > 0,
        `${id}: no \`magnitude\`. Banking this row froze that it fails; nothing freezes HOW BIG it is,`
        + ' so its population can grow to any size with the gate green. Measure it and freeze the figure.',
      ).toBe(true);
    }
  });

  test('⛔ every declared measure is WELL FORMED (a malformed one cannot refuse anything)', () => {
    for (const [id, row] of Object.entries(baseline.entries)) {
      for (const spec of row.magnitude || []) {
        const where = `${id} [${spec?.name ?? '(unnamed)'}]`;
        expect(typeof spec.name === 'string' && spec.name.trim().length > 0, `${where}: no name`).toBe(true);
        expect(MAGNITUDE_KINDS, `${where}: kind must be one of ${MAGNITUDE_KINDS.join('|')}`).toContain(spec.kind);
        expect(typeof spec.pattern === 'string' && spec.pattern.length > 0, `${where}: no pattern`).toBe(true);
        expect(() => new RegExp(spec.pattern), `${where}: the pattern does not compile`).not.toThrow();
        expect(Number.isInteger(spec.ceiling) && spec.ceiling >= 0, `${where}: ceiling must be a non-negative integer`).toBe(true);
        expect(
          String(spec.unit || '').length,
          `${where}: no \`unit\` — a bare number nobody can read is not a measurement`,
        ).toBeGreaterThan(10);
      }
    }
  });

  test('⛔⛔ NO measure can be satisfied by an EMPTY message (the vacuity that would disarm it silently)', () => {
    // THE ANTI-VACUITY ARM, and it is the one that matters most here. A pattern whose
    // capture group can match emptiness — `(\d*)`, an optional group that did not
    // participate — reads as the number ZERO against ANY text, including a message that
    // carries no figure at all. That measure would then sit under every ceiling forever
    // and report a green: a magnitude guard that cannot fail, wearing the clothes of one
    // that can. Every declared measure must be UNMEASURABLE against nothing.
    for (const [id, row] of Object.entries(baseline.entries)) {
      for (const spec of row.magnitude || []) {
        const verdict = measureMagnitude(spec, '');
        expect(
          verdict.ok,
          `${id} [${spec.name}]: this measure MEASURES ${verdict.measured} against an EMPTY message, so it`
          + ' can never refuse anything. Require a digit and anchor the pattern on real message text.',
        ).toBe(false);
      }
    }
  });

  test('the census _doc states the magnitude discipline (the file explains its own shape)', () => {
    expect(baseline._doc).toMatch(/magnitude/i);
  });

  test('the ratchet is wired into `npm run check`', () => {
    expect(pkg.scripts['test:ratchet']).toContain('check-test-ratchet.mjs');
    expect(pkg.scripts['test:ratchet:update']).toContain('--update');
    expect(pkg.scripts.check).toContain('test:ratchet');
    expect(pkg.scripts['verify:dist']).toBe(
      'sh scripts/gate-mutex.sh --run -- node scripts/check-test-ratchet.mjs --verify-dist',
    );
    expect(pkg.scripts['verify:dist'].match(/gate-mutex\.sh/g)).toHaveLength(1);
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

    const source = runnerCommandOf({ outputFile: '/tmp/source-results.json' });
    const dist = runnerCommandOf({ verifyDist: true, outputFile: '/tmp/dist-results.json' });
    expect(source).toBe(
      'npx vitest run --exclude="tests/build/**" --reporter=json --outputFile="/tmp/source-results.json"',
    );
    expect(source.match(/--exclude=/g)).toHaveLength(1);
    expect(source).toContain(`--exclude="${SOURCE_TEST_EXCLUDE}"`);
    expect(dist).toBe(
      'npx vitest run tests/build/ --reporter=json --outputFile="/tmp/dist-results.json"',
    );
    // The exact nonempty dist command is asserted immediately above.
    // anchored: this denies a phase-grammar leak, not a command that vanished or was never constructed
    expect(dist).not.toContain('--exclude');
  });

  test('`npm run test` keeps the raw unfiltered reporter inside the held lock', () => {
    // The ratchet reports a verdict; a burn-down lane needs the unfiltered
    // reporter output. Atomic ownership changes concurrency, not the denominator.
    expect(pkg.scripts.test).toBe('sh scripts/gate-mutex.sh --run -- npx vitest run');
    // The subject cannot have drifted away or gone undefined by the time this runs.
    // anchored: the line above pins this script to one EXACT string
    expect(pkg.scripts.test).not.toMatch(/--exclude|--changed|--related|--passWithNoTests/);
  });

  test('CI runs the ratchet too (the local gate and CI must not diverge)', () => {
    // CI keeps source tests in its test group and build -> strict dist in the
    // independent build group; ciCheckParity pins the exact ownership/order.
    const ci = readFileSync(join(ROOT, '.github/workflows/ci.yml'), 'utf8');
    expect(ci, 'ci.yml must run the per-test ratchet').toContain('npm run test:ratchet');
    const runsBareTest = ci.split('\n').some((l) => l.trim() === 'run: npm run test');
    expect(runsBareTest, 'ci.yml still runs the bare `npm run test` — CI would stay dark').toBe(false);
  });

  test('⚠ an OWNER-GATED row leaves the census only against a NAMED GRANT', () => {
    // Migrations are an owner-gated class: a build lane may not repair one on its own
    // authority. Until 2026-08-10 that was enforced by requiring the class to be
    // NON-EMPTY — the three migration rows could not leave, because leaving is what an
    // unauthorised repair looks like. The three arms below replace that count with the
    // question it was a proxy for. See OWNER_GATED_DISCHARGE above for why.

    // ARM 1 — every surviving owner-gated row still says WHY it is gated. Unchanged, and
    // it now covers the uncollected allowlist too: a collection failure that is gated is
    // gated on the same terms as a failing test.
    const gatedRows = [
      ...Object.entries(baseline.entries).map(([id, r]) => [id, r, r.file]),
      ...Object.entries(baseline.uncollectedSuites || {}).map(([file, r]) => [file, r, file]),
    ].filter(([, r]) => r.class === 'owner-gated');
    for (const [id, r] of gatedRows) {
      expect(r.cause, `${id}: an owner-gated row must say WHY it is gated`).toMatch(/owner|gated|migration|deploy/i);
    }

    // ARM 2 — the discharge is a real record, and every row it retired is really gone
    // from the gated class while its FILE is still on disk. Deleting the test is not a
    // repair, and a retirement nobody wrote down is indistinguishable from an erasure.
    expect(
      OWNER_GATED_DISCHARGE.grant.length,
      'the discharge names no grant — an owner-gated row cannot leave on a lane\'s word',
    ).toBeGreaterThan(120);
    expect(
      OWNER_GATED_DISCHARGE.landedAt,
      'the discharge must cite the 40-hex commit that landed the cure',
    ).toMatch(/^[0-9a-f]{40}$/);
    expect(
      OWNER_GATED_DISCHARGE.retired.length,
      'a discharge that retires nothing explains nothing',
    ).toBeGreaterThan(0);
    const gatedFiles = new Set(gatedRows.map(([, , file]) => file));
    for (const file of OWNER_GATED_DISCHARGE.retired) {
      expect(
        existsSync(join(ROOT, file)),
        `${file}: discharged by DELETING the test, which is an erasure, not a repair`,
      ).toBe(true);
      expect(
        gatedFiles.has(file),
        `${file}: named as retired but still carries an owner-gated row`,
      ).toBe(false);
    }

    // ARM 3 — ⛔ THE ANTI-AMNESTY ARM. The three retired rows each asserted one fact about
    // migration 195's rollback story. Those facts are re-checked here, from the
    // filesystem, so reverting the cure reds the discharge as well as the walker that
    // owns it. A citation nobody can falsify is not evidence.
    const { migration } = OWNER_GATED_DISCHARGE;
    const migrationFile = readdirSync(join(ROOT, 'supabase/migrations'))
      .find((name) => name.startsWith(`${migration}_`) && name.endsWith('.sql'));
    expect(migrationFile, `migration ${migration} is not on disk`).toBeTruthy();
    expect(
      readFileSync(join(ROOT, 'supabase/migrations', migrationFile), 'utf8'),
      `${migration} lost its inline \`-- @rollback:\` note`,
    ).toMatch(/--\s*@rollback:/i);
    expect(
      readdirSync(join(ROOT, 'supabase/rollback'))
        .filter((name) => name.startsWith(`${migration}_`) && name.endsWith('.down.sql')),
      `${migration} lost its .down.sql — the rollback story the discharge cites is gone`,
    ).not.toEqual([]);
    // ⚠⚠ THIS ARM USED TO PIN `docs/DEPLOY.md` TO migration 195's FILENAME, and that was
    // an address that had to rot. The runbook's head line is REQUIRED to move whenever a
    // migration lands — `tests/docs/deployRunbookFreshness.test.js` derives it from
    // supabase/migrations/ and reds if it does not — so freezing 195 there turned a
    // moving figure into a static pin, and the very next lawful migration (196) reddened
    // an anti-amnesty arm that had nothing to do with 196. Worse, the frozen form was
    // never a fact about 195's ROLLBACK STORY at all, which is what this arm exists to
    // re-check; the three assertions above carry that story in full, from the filesystem.
    // So the runbook check is kept and DE-ROTTED: it asserts the runbook names the head
    // that is actually on disk, which is the property that cannot go stale.
    const runbookHead = readdirSync(join(ROOT, 'supabase/migrations'))
      .filter((name) => /^\d+_.*\.sql$/.test(name))
      .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
      .at(-1);
    expect(
      readFileSync(join(ROOT, 'docs/DEPLOY.md'), 'utf8'),
      `docs/DEPLOY.md no longer names the CURRENT migration head (${runbookHead})`,
    ).toContain(runbookHead);
    expect(
      MIGRATION_TRAIN_REPO_HEAD,
      `the rehearsal wave train walked back behind ${migration}: ${MIGRATION_REHEARSAL_SUITE}`
      + ' throws at collection again and its allowlist row was retired',
    ).toBeGreaterThanOrEqual(migration);
  });

  test('⛔ every ALLOWLISTED UNCOLLECTED suite is attributed too (a collection failure is debt)', () => {
    // A suite that throws during collection reports ZERO tests, so its failures
    // never appear as rows at all. That hole is the most dangerous kind of debt,
    // so it carries the same attribution discipline as a failing test.
    const rows = Object.entries(baseline.uncollectedSuites || {});
    // ⭐ 2026-08-10: this floor used to be `> 0`, and the single row it stood over was
    // tests/ops/migrationRehearsal.test.js — the suite that threw at import because the
    // wave train ended at 194 while 195 was on disk. The train reaches 195, the suite
    // COLLECTS, and its allowlist row is retired, so an EMPTY allowlist is now the
    // strongest state this pin can report (zero tolerated collection holes), not a
    // vacuous one. The floor is therefore the DISCHARGE rather than a count: the list may
    // be empty only because a named grant retired the last row. What refuses the NEXT
    // hole is not this pin at all — it is the scope sentinel, executed below in 'a suite
    // that FAILED TO COLLECT reds', which reds on any uncollected suite absent from here.
    expect(
      rows.length > 0 || OWNER_GATED_DISCHARGE.retired.includes(MIGRATION_REHEARSAL_SUITE),
      'the uncollected allowlist emptied with no discharge naming the suite that left it',
    ).toBe(true);
    for (const [file, row] of rows) {
      expect(existsSync(join(ROOT, file)), `${file}: allowlisted but not on disk`).toBe(true);
      expect(row.subsystem, `${file}: no owning subsystem`).toBeTruthy();
      expect(String(row.cause).length, `${file}: cause is a stub`).toBeGreaterThan(20);
      expect(DEBT_CLASSES, `${file}: class must be one of ${DEBT_CLASSES.join('|')}`).toContain(row.class);
      expect(String(row.introducedAt)).toMatch(/^([0-9a-f]{40}|unbisectable:.{10,})$/);
    }
  });

  test('the uncollected allowlist never grows past its frozen size', () => {
    // Same monotone-down law as the entry census: a literal, not a self-derived figure.
    // RATCHETED 1 → 0 on 2026-08-10. NO suite in the estate is allowed to fail collection
    // any more; the last one (tests/ops/migrationRehearsal.test.js) collects again now the
    // wave train reaches 195. At zero the pin is at its floor: the next collection hole
    // cannot be allowlisted without raising this ceiling in the same commit that admits it.
    expect(Object.keys(baseline.uncollectedSuites || {}).length).toBeLessThanOrEqual(0);
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
  // ⭐⭐ 2026-09-04 (§893) — ALL FOUR ADMITTED ROWS ARE DISCHARGED, 4 → 0.
  //
  // Every one of the four gave the SAME reason for being admitted: the corpus had DEEPENED past
  // the fixed-five assumption (1e8bf8a8) and the row stayed red under D-W3 Class B, which
  // "needs a ruling (cap raised vs corpus trimmed), not a parser."
  //
  // ⭐ THAT RULING WAS MADE AND EXECUTED. CR-FP-7 countersigned the CAP-RAISE arm, and
  // CENSUSWIRE (ea0d67102) wired all thirteen authored annex families byte-verbatim into
  // WAR_RECEIPTS — five kinds landing exactly on their frequency floors. The four walker
  // identities now PASS on their own merits, so their census rows retired at 4dea2dc20 and
  // these ledger rows retire with them. Nothing was widened, excluded or trimmed.
  //
  // ⛔ THE DISCHARGE IS A RECORD, NOT A DELETION — the same discipline this file applies to the
  // 2026-08-10 owner-gated retirement above. The object is empty because the debt is GONE, and
  // ADMITTED_CEILING falls 4 → 0 so the emptiness is RATCHETED rather than merely current: a
  // future row cannot slip back in under a ceiling nobody lowered.
  //
  // ⚠ ONE HONEST CONSEQUENCE, NAMED RATHER THAN HIDDEN: with the object empty, the
  // "every ledger entry carries a REAL reason" arm below iterates nothing and is VACUOUSLY
  // true for this ledger. That is inherent to an empty allowlist, not a defect introduced
  // here — WALKER_ROWS_OWED still populates the same arm — but it is written down because an
  // assertion that cannot fail is exactly the class §893 swept the corpus for.
  const WALKER_ROWS_ADMITTED = Object.freeze({

  });

  // OWED — CONFIRMED disabled guards this lane did not free. Each is ONE assertion over
  // an OPEN, tree-derived population, so its failing verdict is byte-identical however
  // many more violations land. They are named here so the debt is VISIBLE and CANNOT
  // GROW: a NEW walker row in neither ledger reds. ⛔ This list is not permission — it is
  // an outstanding bill, and the honest reading of it is "eleven guards are switched off".
  //
  // ⭐ 2026-08-10 — THE TWO OWNER-GATED ROWS ARE RETIRED, 13 → 11. Both walkers PASS (195
  // ships supabase/rollback/195_civility_guard_and_public_identity.down.sql and an inline
  // `-- @rollback:` note; docs/DEPLOY.md names 195 as the head), so they were never
  // disabled guards any more — they were CURED guards held in place by an authority gate.
  // The owner's full delegation grant discharged that gate, and the retirement landed as
  // one change: both census rows, both entries here, this ceiling, and the census CEILING.
  // The discharge itself is recorded in OWNER_GATED_DISCHARGE at the top of this file,
  // where the pin that used to refuse it now checks the cure is still in the tree.
  const WALKER_ROWS_OWED = Object.freeze({
    // ⭐⭐ 2026-09-15, LT28 CAR 6 — THE VOICE ROW AND THE ENFORCEMENT-CLAIMS ROW ARE FREED, NOT FORGIVEN.
    // The voice row's own named cure (§901) is built: a DECLARED authored-vocabulary exemption in the
    // scanner, keyed on the EXACT LITERAL rather than a widened budget — bare `—` delimiters anywhere,
    // plus per-file verbatim producer labels carrying their reason — with four controls, including a
    // planted-and-executed proof that an undeclared em dash in an EXEMPTED file still reds. It also
    // freed five more bare delimiters in three already-baselined files, banked through the shrink-only
    // door: 311 → 306 em over 55 → 52 files. The enforcement-claims row went two ways because its six
    // naked claims were two different things: THREE were never claims at all (`0 problems` was matching
    // the tail of "30 problems" on three lines REPORTING a lint run — the detector now carries `\b`,
    // pinned in both directions), and THREE were real claims that already named their enforcer in prose
    // and simply carried no tag. FROZEN_NAKED is empty. A remove-only --update retired both census rows
    // (`baseline updated: 1 failing test(s) remain, 2 removed`); these two ledger entries leave with them
    // and OWED_CEILING drops by exactly two. The owner-gated golden master is the only row left.
    // ⭐⭐ 2026-09-06, THE OSR RUNG-18 LANDING (§902) — THE TWO WRITER-REACH ROWS ARE FREED, NOT FORGIVEN. They entered at §900 as
    // declared debt: the writer-reach register measured corpusMeta.simulationFlagsLit = 81 while the observed-shape register
    // carried 80, because its schema-17 migration receipt's subjectSha lay outside the product lineage after a cherry-pick replay
    // and the OSR CLI refused every --write. OSR-SCHEMA18 (cars f20d5dd48 + a05a4646e) re-executed the governed migration with a
    // SUBJECT COMMIT INSIDE THE LINEAGE; the genesis froze 81 on the OSR side, both arms went green by title in the whole-suite
    // proof at a05a4646e, and a remove-only --update retired both census rows; these two ledger entries leave with them and
    // OWED_CEILING drops by exactly two. The voice per-file row, enforcement-claims and the owner-gated golden-master stay.
    // ⭐ 2026-09-05, THE DESK LANDING (§900) — the Tier-2 voice per-file arm RE-ENTERS as OWED, declared: two src/domain
    // files spell a producer's authored dashed vocabulary (a total map's keys and two parsed delimiters); the shrink-only door
    // refuses the 311 → 319 rise and the generator import is forbidden in writing. Structural cure: an authored-vocabulary
    // exemption class in the voice scanner (§901). Banking keeps the guard visible; OWED_CEILING moves 2 → 3 with it.
    // ⭐⭐ 2026-09-15, LONG TAIL #41 — THE TIER-2 VOICE PER-FILE ROW IS FREED, NOT FORGIVEN, BY THE CURE ITS OWN CAUSE LINE
    // NAMED. §901's "declared authored-vocabulary exemption class in the voice scanner" now exists: car 1 built a NAMED
    // allowlist keyed file -> whole literal -> {count, why} and a FIFTH TIER that scans `src/generators`, the directory the
    // eight banked dashes are TRANSCRIBED FROM and which no tier had ever read; car 2 declared those eight (five
    // COMPLEXITY_LABEL values mirroring prosperity.js:296-314, the FOOD_POOL_OF key mirroring foodGenerator.js:342, and the
    // bare `'—'` split delimiter matched to the separator safetyProfile.js:235 composes), each verified byte-identical with
    // `grep -F`. The arm is GREEN by execution: `Tests 28 passed (28)`, and the previously-throwing documented refreeze
    // `UPDATE_VOICE_BASELINE=1` now runs clean and rewrites all three baselines BYTE-IDENTICALLY. The exemption cannot rot:
    // every entry is count-pinned and a seeded third `'—'` in generalStateProse.js reds it ("declared 2, measured 3"). The
    // census row is removed in the SAME ACT as this entry, and OWED_CEILING drops by exactly the one row burned.
    // ⭐⭐ 2026-08-31, VOICE-1b (ODQ §854) — THE FOUR VOICE BLOCKERS WERE STALE IN BOTH
    // FIGURES AND PRESCRIPTION, AND THE PRESCRIPTION WAS THE FORBIDDEN CURE. Each of the
    // four lines below used to say the cure was "a re-freeze of the voice ratchet fixture
    // at a measured sha". The standing STRIP-never-raise ruling (ODQ line 266, where a
    // 23-em-dash breach in aiCharter.js was STRIPPED 681 → 658 rather than banked) forbids
    // exactly that, and a blocker line naming the forbidden cure is how the forbidden cure
    // gets run — measured: re-freezing would NOT have gone green, because both budget arms
    // compare against HARDCODED constants, so four reds would have become TWO, green ON the
    // banked growth, with a RATCHET-DOWN notice inviting these very rows' deletion. The
    // figures were stale too (1369/18 recorded; 1478/21 measured at 6770f878f). The cure is
    // now enforced rather than merely prescribed: tests/helpers/shrinkOnlyBaseline.js makes
    // the documented `UPDATE_VOICE_BASELINE=1` refreeze THROW on any total that would rise.
    // ⭐⭐ 2026-09-05, THE PROSE LANDING (§898) — THE TWO TIER-2 VOICE ROWS ARE FREED, NOT FORGIVEN. The src/ prose
    // car cured 1,001 reader sentences; the Tier-2 TOTAL fell 770 → 311 under a budget of 670 and the per-file
    // arm's baseline was re-frozen through the documented shrink-only door (55 rows / em 311 / bang 8 — a FALL,
    // which is the only refreeze that door accepts). A remove-only --update retired both census rows; these two
    // ledger entries leave with them and OWED_CEILING drops by exactly two. The two Tier-3 JSX rows stay: the
    // 34 mainline JSX dashes are VOICE-JSX's, and their refreeze would be a RISE the door refuses.
    // ⭐⭐ 2026-09-05, THE COMPOSED LANDING (§899) — THREE ROWS FREED, NOT FORGIVEN. VOICE-JSX cured all 34 mainline
    // JSX em dashes (Tier-3 GREEN with no refreeze: 0 against a budget of 6, 0 against a per-file baseline of zero), and
    // CLAMP-W3 lifted the clamp census ceiling 62 → 69 to match the tree after CLAMP-W2 migrated three writers (the
    // absorbed copies are documented in the ceiling car; the census row's cause string had said 78, the tree measured
    // 72 at DOCKET and 69 at the composed tip). A remove-only --update retired all three census rows; these three ledger
    // entries leave with them and OWED_CEILING drops by exactly three. enforcement-claims and the golden-master
    // (owner-gated, waiting for the freeze act) stay.
    // ⭐⭐ 2026-08-30, TE-RESIDUE-1 — THE metronome ROW LEFT, AND IT LEFT THE RIGHT WAY.
    // Its blocker read "the right cure is to give it a mechanism, which is a worldPulse
    // change outside this lane". HK-4 is that change: `razingExecution.js` now carries
    // `razingReemitCooldownActive`, a once-per-state-change latch at the metronome's OWN
    // `DRIFT_REEMIT_COOLDOWN_TICKS` window, with no new tuning band and no persisted field.
    // The walker is GREEN at its own tip, the file measures COMPLIANT rather than merely
    // word-matching (six mutants convict all eight new behavioural arms), and a remove-only
    // `--update` banked it: "10 failing test(s) remain, 1 removed". The entry is deleted
    // because its census row is GONE, and the ceiling drops by exactly the one row burned —
    // a ledger corpse silently lowers the effective ceiling and lets the next real walker row
    // slip in under a cap a dead entry was holding up. It was NOT removed to make anything
    // green: the guard it names is now enforcing, not forgiven.
    // ⭐⭐ 2026-09-05, THE PROSE LANDING (§898, Fable chair) — A DECLARED SAME-SEED TEXT SHIFT MEETS THE CLOSED DOOR.
    // The src/ prose car (1,001 cured reader sentences; emitted text moves on 133 engine-side paths;
    // no rules value, preset or flag moved) changes every settlement's output text, so the committed
    // generator-golden-master manifest moves on 525 of 525 rows (chair probe chair-tools/golden-count.mjs;
    // CONTROL 0/525 at the base 272dbd2da). The guard is DISABLED until the freeze act BY CONSTRUCTION:
    // tests/helpers/goldenRecordDoor.js refuses an env var ([NO_SIGNATURE]), and a signed record writes
    // register-row values that tests/lint/goldenFreeze.walker.test.js:358 forbids while frozenAt is null.
    // The chair signed NO record with the owner's standing words and amended NO door (RULING-GOLDEN-PRE-FREEZE.md
    // in refs/preserve/chair-tools-2026-09-05); the shift is declared in docs/GOLDEN_SHIFT_LEDGER.md and the
    // §898 row; every golden control until the freeze is tree-vs-tree. FREED by the owner-signed genesis
    // (ODQ §881.4: the freeze records the LIT world), or sooner by the owner's own sentence in a shift record.
    'tests/property/generatorGoldenMaster.test.js :: generator golden master (cross-build output stability) every config produces byte-identical output to the golden master':
      'NOT FREED — the committed manifest moves on 525 of 525 rows under the DECLARED prose text shift, MEASURED at `73a6f0c22` (the PROSE landing tip) by the Fable chair with chair-tools/golden-count.mjs (control 0/525 at 272dbd2da); the fixture CANNOT be re-recorded before the freeze act (goldenRecordDoor [NO_SIGNATURE]; goldenFreeze.walker:358 forbids recorded register values while frozenAt is null). Blocker: the owner-signed GENESIS (§881.4) — or the owner\'s sentence in docs/shift-records/ ("one word charters it sooner"). Class owner-gated; magnitude ceiling 525; the arm is not switched off by a lane, it is waiting for the owner.',
    // ⭐⭐ 2026-08-15, da-c — THE proseNumerics ROW LEFT, AND IT LEFT THE RIGHT WAY.
    // It was OWED ("a regeneration must review every removed row, which is a wave, not a
    // step"), and da-a's DA-A1 I2 plus da-c's I1 between them did exactly that wave: two
    // regenerations, each with a full executed accounting of rows gained, rows lost,
    // category ceilings and pure address moves before the write. The arm went green, the
    // full run reported RATCHET DOWN (11 < 12), and a remove-only re-freeze banked it.
    // The entry is deleted because its census row is GONE — a ledger corpse silently
    // lowers the effective ceiling and lets the next real walker row slip in under a cap
    // that a dead entry was holding up. It was NOT removed to make anything green.
  });

  const admittedIds = Object.keys(WALKER_ROWS_ADMITTED);
  const owedIds = Object.keys(WALKER_ROWS_OWED);

  // LITERALS, not figures read out of the objects they are supposed to cap — a ceiling
  // derived from its own list proves list == list and rises silently with every entry.
  // MONOTONE DOWN from here. You may burn them; you may never pad them.
  const ADMITTED_CEILING = 0; // 4 → 0 at §893: the four admitted rows are discharged, not re-homed.
  // 11 → 9 on 2026-08-10: the two crisisTripleSync rows were FREED, not forgiven. Both were
  // mis-pointed source-address pins; re-pointing them at the live consumer
  // (settlementLifecycleHelpers.js / campaignRegionalSliceEntry.js) turned the walker green
  // with its invariant intact, proven by mutant at the new addresses. See the RATCHETED
  // 25 → 23 note at the top of this file.
  // 9 → 8 on 2026-08-15: the proseNumerics exact-match row was FREED, not forgiven — the
  // owed regeneration wave was actually run, twice, each time with its accounting executed
  // before the write. The ceiling drops by exactly the one row burned, which is the same
  // arithmetic the 11 → 9 retirement above used. Burning a census row is never a one-path
  // act: the census entry, this ledger entry and this ceiling all move together, and the
  // gate is what says so — this ceiling's own arm is `<=`, so the ledger deletion alone
  // would have stayed green while leaving a silently roomier cap.
  // 8 → 7 on 2026-08-30: the metronome-cooldown row was FREED, not forgiven — see the note
  // in WALKER_ROWS_OWED above. Same arithmetic as the 9 → 8 and 11 → 9 retirements: the
  // census entry, this ledger entry and this ceiling move together, in one act.
  // 7 → 5 on 2026-09-05 (§898): the two Tier-2 voice rows FREED by the prose landing's refreeze — the golden-master
  // row had entered at 7 the same day (owner-gated, waiting for the freeze act), so the two burned leave five.
  // 5 → 2 on 2026-09-05 (§899): the two Tier-3 JSX voice rows and the clamp-primitive row FREED by the composed
  // landing (VOICE-JSX + the CLAMP-W3 ceiling car); enforcement-claims and the owner-gated golden-master remain.
  // 2 → 3 on 2026-09-05 (§900): the Tier-2 voice per-file row re-enters OWED (declared, attributed) — see WALKER_ROWS_OWED.
  // 5 → 3 on 2026-09-06 (§902): the two writer-reach rows FREED by the rung-18 re-anchoring (OSR-SCHEMA18); the voice
  // per-file row, enforcement-claims and the owner-gated golden-master stay.
  // 3 → 1 on 2026-09-15, IN TWO LANES COMPOSED AT §931: LONG TAIL #41 freed the Tier-2 voice per-file row by the named
  // count-pinned authored-vocabulary allowlist (§901's cure; see WALKER_ROWS_OWED above) and LONG TAIL #28 car 6 freed
  // enforcement-claims (the detector gains `\b`; three of the six 'naked claims' were the tail of '30 problems'). Both
  // lanes burned the voice row independently (LT28 by a literal exemption the chair did NOT carry — LT41's design stands);
  // the census entry, this ledger entry and this ceiling move in ONE act and the ceiling drops by exactly the rows burned.
  // The owner-gated golden master is the only row left.
  const OWED_CEILING = 1; // 3 → 1 on 2026-09-15 (LT28 car 6): the voice per-file row and enforcement-claims are FREED (see WALKER_ROWS_OWED); only the owner-gated golden master remains, and it retires at the owner-signed GENESIS.

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
      // owner-held spatial classification landed, then passed from its committed archive
      'tests/lib/spatialLedgerCoverage.walker.test.js',
      // the 2026-08-10 migration-debt retirement: both were CURED (not merely relocated)
      // before their rows left, and both must still classify — otherwise a future census
      // could take an owner-gated guard back in with nothing to refuse it. Note the arms
      // differ: migrationRollbackDiscipline carries the A5 @enforcement-walker marker,
      // deployRunbookFreshness is caught by A2 because its header title line says "walker".
      'tests/docs/migrationRollbackDiscipline.test.js',
      'tests/docs/deployRunbookFreshness.test.js',
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
  //
  // ⚠ 2026-08-10 — THE FOUR edgeFunctions NAMES LEFT, and they left the RIGHT way: their
  // debt was burned down (one clean rebuild of all five edge-shared bundles), so they no
  // longer carry census rows and the self-cleaning arm below evicts them. They were NOT
  // removed to make anything green. See the RATCHETED 23 → 17 note at the top of this file
  // for why the ordered relocation was refused and the rebuild done instead.
  // ⚠ 2026-08-15 — mapSnapshotImport LEFT, and it left the RIGHT way, for the second time
  // this list has self-cleaned. est-1's member EST-A anchored the F6 source contract to the
  // impl's own closing brace; the guard that had been reading a 6,000-char window of a
  // 7,717-char body went green, and its census row was banked away by a remove-only
  // re-freeze. The debt was PAID, so the self-cleaning arm below evicts the name. It was NOT
  // removed to make anything green — removing it is what the arm DEMANDS once the row is
  // gone ("a file whose debt is burned down leaves the list rather than lingering as a stale
  // certificate").
  // ⭐⭐ 2026-08-15, est-1c / EST-C — THE ZERO-ASSERTION CONVERSION (chair ruling
  // CR-EST-CONTROLZERO). The last two names left together, and they left the RIGHT way:
  // EST-C cured the icon-admission asymmetry that had been refusing EVERY auto-discovered
  // supply chain, and their three census rows were banked away by a remove-only re-freeze.
  // ⭐ ORDINARY TEST DEBT IS NOW ZERO. Every surviving census row is a LEDGERED ENFORCEMENT
  // WALKER, which is a measured partition rather than a hope — the arm below asserts it.
  //
  // ⛔ THE ROSTER IS EMPTY BECAUSE ITS POPULATION IS, AND IT MAY NOT BE REFILLED. Naming any
  // survivor here would certify a walker as ordinary — the exact 2026-08-07 error this whole
  // block exists to prevent — and the floor it used to carry is gone rather than lowered,
  // because a floor of zero under a message saying the control emptied is a tautology wearing
  // a guard's clothes.
  //
  // ⭐ SO THE CONTROL CONVERTS INSTEAD OF EMPTYING. It used to SAMPLE the ordinary population
  // to show the classifier had no false positives. It now asserts that the population IS
  // EXACTLY ZERO — strictly stronger, because "the classifier swept in a real debt row" and "a
  // lane banked an ordinary failure" are both instances of AN UNLEDGERED ROW EXISTS, and the
  // conversion reds on either. This is the LOCK-THE-WIN door of the census-ceiling family, and
  // the win may never be spent: a future ordinary failure REDS THE GATE ON ARRIVAL instead of
  // joining a census. That is the FAILING-TEST-IS-DEBT doctrine with the debt door shut.
  const ORDINARY_TEST_CONTROL = Object.freeze([]);

  test('⭐ ORDINARY TEST DEBT IS ERADICATED — the census holds enforcement walkers ONLY', () => {
    // THE VICTORY ASSERTION, and it is a guard rather than a trophy: it is the converse of
    // the enforcing pin above. That one says every WALKER row must be ledgered; this one says
    // every row, full stop — so a row appearing in neither ledger reds here whether it got
    // there by a classifier false positive or by a lane banking an ordinary failure.
    const ledgered = new Set([...admittedIds, ...owedIds]);
    const ordinary = Object.keys(baseline.entries).filter((id) => !ledgered.has(id)).sort();
    expect(
      ordinary,
      'ordinary test debt was ERADICATED at est-1c; any new ordinary red is TRIAGED\n'
      + 'IMMEDIATELY, NEVER BANKED. A row here means exactly one of two things: a lane banked an\n'
      + 'ordinary failure instead of fixing it (fix it — do NOT widen the census), or an\n'
      + 'enforcement walker lost its ledger row (put the row back). The eradication is a WON\n'
      + 'POSITION, not a ceiling, and it may not be spent.',
    ).toEqual([]);
    expect(
      ORDINARY_TEST_CONTROL,
      'the sampling roster is the corpse of a paid debt, never a place to park a walker:\n'
      + 'refilling it would certify a walker as ordinary, which is the 2026-08-07 error.',
    ).toEqual([]);
  });

  test('⛔ the eradication is a REAL partition, not an empty census', () => {
    // THE ANTI-VACUITY ARM, and it is the direct descendant of the anti-padding one it grew
    // out of. Zero ordinary rows is only a WIN if the census is populated and wholly
    // accounted for: without this, the arm above passes the day the baseline is deleted, the
    // reader breaks, or the scope sentinel stops collecting. A victory assertion invites
    // exactly that failure, so the victory is pinned to a real population here.
    const rows = Object.keys(baseline.entries);
    expect(
      rows.length,
      'the census is EMPTY — the eradication arm above would then pass for the wrong reason',
    ).toBeGreaterThan(0);
    expect(
      admittedIds.length + owedIds.length,
      'both ledgers emptied — nothing is being classified, so "wholly ledgered" says nothing',
    ).toBeGreaterThan(0);
    const ledgered = new Set([...admittedIds, ...owedIds]);
    expect(
      rows.filter((id) => ledgered.has(id)).length,
      'every surviving census row must be a LEDGERED enforcement walker — that identity is what\n'
      + 'makes "zero ordinary debt" a partition claim about a real population rather than a\n'
      + 'statement about an empty set',
    ).toBe(rows.length);
    // ⭐ AND THE CLASSIFIER IS STILL EXERCISED IN BOTH DIRECTIONS, which is what the retired
    // sampling roster used to buy. The enforcing pin proves every walker row is ledgered; the
    // `NO SINGLE ARM CLASSIFIES THEM ALL` pin proves each arm still has a live counterexample
    // it must classify correctly; and this arm proves there is nothing left for a false
    // positive to land on. A false positive today would have to invent an unledgered row —
    // and that reds in the arm above.
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
    + 'if (process.env.TEST_RATCHET_CAPTURE_FILE) fs.writeFileSync('
    + 'process.env.TEST_RATCHET_CAPTURE_FILE, JSON.stringify({ '
    + 'verifyDist: process.env.VERIFY_DIST || null }));\n'
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
  // `extra` carries the per-row fields a real vitest report writes beside the
  // verdict — `duration` and `failureMessages`. Omitting it reproduces the exact
  // row shape every arm below this one was written against.
  const T = (name, status = 'failed', extra = null) => ({ name, status, extra });

  // ── TE-RATCHET-MAG's fixture pair ────────────────────────────────────────
  // The default measure every injected census row carries, and the default failure
  // message every injected BANKED row is given when the test does not write one itself.
  // Chosen so the two agree at exactly 1: the fixtures below are about the ratchet's
  // OTHER guards, and a magnitude that reds would make every one of them prove the wrong
  // thing. The magnitude guard's own conviction proofs live in their own describe block
  // and set these deliberately.
  const DEFAULT_META_MAGNITUDE = Object.freeze([Object.freeze({
    name: 'meta', kind: 'capture', pattern: 'population (\\d+)', ceiling: 1, unit: 'the meta fixture population',
  })]);
  const DEFAULT_META_MESSAGE = 'AssertionError: meta fixture population 1';

  /** Build a jest/vitest-shaped report. Absolute suite paths also pin normalization.
   *  `suiteStatus` carries the SUITE-level verdict vitest emits beside the rows —
   *  the only signal that separates a `beforeAll` explosion from a deliberate skip. */
  function reportOf(suites) {
    return {
      testResults: suites.map((s) => ({
        name: s.absolute === false ? s.file : join(ROOT, s.file),
        ...(s.suiteStatus ? { status: s.suiteStatus } : {}),
        assertionResults: (s.tests || []).map((t) => ({
          fullName: t.name, title: t.name, ancestorTitles: [], status: t.status,
          ...(t.extra || {}),
        })),
      })),
    };
  }

  const BUILD_FILES = discoverBuildTestFiles(ROOT);
  /** A strict-mode report with one passed row per recursively discovered build-test file. */
  function strictReport(edit) {
    const runStart = 1_700_000_000_000;
    const report = {
      startTime: runStart,
      numPendingTests: 0,
      numTodoTests: 0,
      numTotalTests: BUILD_FILES.length,
      numPassedTests: BUILD_FILES.length,
      numFailedTests: 0,
      success: true,
      testResults: BUILD_FILES.map((file, index) => ({
        name: join(ROOT, file),
        status: 'passed',
        startTime: runStart + 100 + index,
        endTime: runStart + 101 + index,
        assertionResults: [{
          fullName: `${file} > exercised`,
          title: 'exercised',
          ancestorTitles: [file],
          status: 'passed',
        }],
      })),
    };
    if (edit) edit(report);
    return report;
  }

  /**
   * Run the ratchet against an injected baseline + injected fake runner.
   * `report: null` = the runner wrote nothing; `rawReport` = arbitrary bytes.
   */
  function run({
    entries = {}, totalTests, totalFiles, skippedCeiling = 0, uncollectedSuites,
    suites = [], report, rawReport, exitCode = 1, args = [], noBaseline = false,
    captureRunner = false, inheritedVerifyDist = false,
  }) {
    const built = report === undefined ? reportOf(suites) : report;
    // Give every BANKED, FAILING, message-less row the default message that pairs with
    // DEFAULT_META_MAGNITUDE. Deliberately narrow: it never touches a row the test wrote a
    // message for, never touches a row absent from the census (regressions keep their
    // "the report carried no failure message" evidence line, which other pins assert), and
    // never touches a non-failing row.
    if (built && Array.isArray(built.testResults)) {
      for (const suite of built.testResults) {
        for (const a of suite.assertionResults || []) {
          const id = `${normalizePath(suite.name || suite.file || '', ROOT)} :: ${a.fullName}`;
          if (a.status !== 'failed' || !entries[id] || a.failureMessages) continue;
          a.failureMessages = [DEFAULT_META_MESSAGE];
        }
      }
    }
    let src = '-';
    if (rawReport !== undefined) src = tmpFile('json', rawReport);
    else if (built !== null) src = tmpFile('json', JSON.stringify(built));

    const env = { ...process.env, TEST_RATCHET_RUN_CMD: `node ${FAKE} ${src} ${exitCode}` };
    if (inheritedVerifyDist) env.VERIFY_DIST = 'hostile-parent-value';
    const captureFile = captureRunner ? join(TMP, `capture-${seq += 1}.json`) : null;
    if (captureFile) env.TEST_RATCHET_CAPTURE_FILE = captureFile;
    // ── TE-RATCHET-MAG: every banked row must declare a MAGNITUDE, so the harness
    // supplies a default one and the matching failure message together. They are a PAIR:
    // the gate fails closed on a banked row whose declared measure finds nothing, so a
    // default magnitude without a default message would red every fixture below.
    // A test that cares overrides either half (`magnitude:` on the entry, `extra:` on the row).
    if (!noBaseline) {
      const rows = Object.entries(entries).map(([id, r]) => [id, {
        file: r.file ?? id.split(' :: ')[0],
        test: r.test ?? id.split(' :: ')[1],
        subsystem: 'meta', cause: 'injected fixture for the meta-test', introducedAt: 'a'.repeat(40), class: 'debt',
        magnitude: r.magnitude === undefined ? DEFAULT_META_MAGNITUDE : r.magnitude,
      }]);
      env.TEST_RATCHET_BASELINE = tmpFile('json', JSON.stringify({
        measuredAtSha: 'f'.repeat(40),
        totalTests: totalTests ?? Math.max(1, built ? rowsOf(built, ROOT).length : 1),
        // DERIVED from the injected report, exactly as `totalTests` above is. It used to be
        // the constant 10, which was harmless only while `totalFiles` was inert: arming its
        // floor (TE-RATCHET-MAG) turned that constant into a 10-file expectation every
        // one-suite fixture failed. A test that means to convict the file floor passes its
        // own figure.
        totalFiles: totalFiles ?? Math.max(1, built ? new Set(rowsOf(built, ROOT).map((r) => r.file)).size : 1),
        skippedCeiling,
        ...(uncollectedSuites ? { uncollectedSuites } : {}),
        entries: Object.fromEntries(rows),
      }, null, 2));
    } else {
      env.TEST_RATCHET_BASELINE = join(TMP, `absent-${seq += 1}.json`);
    }
    const r = spawnSync('node', [SCRIPT, ...args], { cwd: ROOT, encoding: 'utf8', env });
    return {
      ...r,
      out: `${r.stdout}${r.stderr}`,
      baselineFile: env.TEST_RATCHET_BASELINE,
      // The report the fake runner was told to deliver. Exposed so the --from-log pin can
      // hand the SAME BYTES to both paths; without it the two runs would judge two files
      // that merely happen to serialise alike, which proves less than it looks.
      reportFile: src === '-' ? null : src,
      capture: captureFile && existsSync(captureFile)
        ? JSON.parse(readFileSync(captureFile, 'utf8'))
        : null,
    };
  }

  // ── ⛔ THE READ-ONLY MODES — the gate's own hold-safety, EXECUTED ───────────
  // WHY THIS EXISTS: every one of the four modes above shells out to `npx vitest run`,
  // and the absence of a write flag reads as "read-only" to anyone who meets this script
  // for the first time. A receipt told the next lane exactly that. `--dry` and
  // `--from-log` are the two invocations that genuinely spawn nothing, and a mode nobody
  // executes is a mode that quietly regains a spawn.
  //
  // The spawn tripwire is the harness's OWN `captureRunner` seam: the fake runner writes
  // the capture file, so `capture !== null` means a child really ran. Every arm below
  // carries the positive control beside the negative, because "nothing spawned" and
  // "the test drove nothing" look identical from here.
  const SUITES = [{ file: REAL, tests: [T('a'), T('b', 'passed')] }];
  const ENTRIES = { [identityOf(REAL, 'a')]: {} };
  // Provenance lines name WHERE the report came from and WHICH machine read it, which is
  // the one thing the two paths may legitimately disagree about. Everything else — every
  // verdict, ceiling, identity and evidence line — must match byte for byte.
  const verdictOnly = (out) => out.split('\n').filter((l) => !l.startsWith('  full runner report:')
    && !l.startsWith('  stable copy of it:')
    && !l.startsWith('  (supplied by --from-log')
    && !l.startsWith('  machine at this run:')
    && !l.startsWith('  machine READING this report:')).join('\n');

  test('--dry exits 0 having spawned nothing — and the same call without it DOES spawn', () => {
    const dry = run({
      entries: ENTRIES, suites: SUITES, args: ['--dry'], captureRunner: true,
    });
    expect(dry.status, dry.out).toBe(0);
    expect(dry.capture, '--dry spawned a runner').toBe(null);
    expect(dry.out).toContain('NOTHING WAS RUN, NOTHING WAS WRITTEN');
    // ⚠ IT REPORTS THE COMMAND IT WOULD ACTUALLY SPAWN, not a hard-coded sentence. This
    // harness injects TEST_RATCHET_RUN_CMD, so under it the honest answer is the SEAM —
    // and an early draft of this pin asserted the real vitest argv here and reddened,
    // which is the script being right and the test being wrong.
    expect(dry.out).toContain('TEST_RATCHET_RUN_CMD (the injected testability seam)');
    expect(dry.out).toContain('fake-runner.mjs');

    // So the un-injected spelling is driven SEPARATELY, against the committed census —
    // read-only, and the only place the whole-suite argv can honestly be asserted.
    const bare = { ...process.env };
    delete bare.TEST_RATCHET_RUN_CMD;
    delete bare.TEST_RATCHET_BASELINE;
    const unseamed = spawnSync('node', [SCRIPT, '--dry'], { cwd: ROOT, encoding: 'utf8', env: bare });
    expect(unseamed.status, `${unseamed.stdout}${unseamed.stderr}`).toBe(0);
    expect(unseamed.stdout).toContain('npx vitest run --exclude="tests/build/**" --reporter=json');
    expect(unseamed.stdout).toContain('THE WHOLE VITEST SUITE');
    expect(unseamed.stdout).toContain(`frozen census:   ${Object.keys(baseline.entries).length} failing test(s)`);

    // ⛔ THE POSITIVE CONTROL. Without it, a harness that silently stopped driving the
    // script at all would pass the assertion above forever.
    const wet = run({ entries: ENTRIES, suites: SUITES, captureRunner: true });
    expect(wet.capture, 'the control did NOT spawn — the tripwire proves nothing').not.toBe(null);
  });

  test('--dry is a PURE REPORTER: every mode, always exit 0, and --update writes nothing', () => {
    // ⛔ THE MODE LIST IS THE PRODUCER'S, NOT A HAND COPY. A title that says "every mode"
    // and iterates a literal written here is exhaustive only until someone adds a fifth
    // mode, at which point the claim silently narrows and nothing reds. MODE_FLAGS is the
    // same array `allowedModes` is built from, so a new mode joins this loop the day it
    // lands. (contractTestAntiVacuity Rule 2 is exactly this shape; it does not fire here
    // only because the file is gated out for deriving from source — which is a reprieve,
    // not a reason.)
    expect(MODE_FLAGS.length, 'the mode roster emptied — this loop would prove nothing').toBeGreaterThan(0);
    for (const args of [[], ...MODE_FLAGS.map((flag) => [flag])]) {
      const dry = run({
        entries: ENTRIES, suites: SUITES, args: [...args, '--dry'], captureRunner: true,
      });
      expect(dry.status, `${args.join(' ') || 'default'} --dry: ${dry.out}`).toBe(0);
      expect(dry.capture, `${args.join(' ') || 'default'} --dry spawned a runner`).toBe(null);
    }
    // The census a `--update --dry` was pointed at must come back BYTE-IDENTICAL: --dry
    // returns before the write, so the re-freeze never happens.
    const before = run({ entries: ENTRIES, suites: SUITES, args: ['--dry'] });
    const frozen = readFileSync(before.baselineFile, 'utf8');
    const upd = run({ entries: ENTRIES, suites: SUITES, args: ['--update', '--dry'] });
    expect(readFileSync(upd.baselineFile, 'utf8')).toBe(frozen);

    // The roster is only the producer's list if the gate ACCEPTS every member of it: an
    // entry the argv parser rejects would make the loop above drive a refusal path and
    // still pass, since a refusal also exits non-zero... and --dry exits 0, so it would
    // have reddened. Assert it directly rather than relying on that coincidence.
    for (const flag of MODE_FLAGS) {
      const accepted = run({ entries: ENTRIES, suites: SUITES, args: [flag, '--dry'] });
      expect(accepted.status, `${flag} is in MODE_FLAGS but the gate refuses it: ${accepted.out}`).toBe(0);
      expect(accepted.out).toContain(`mode:            ${flag}`);
    }
  });

  test('--from-log reproduces the spawned-runner verdict EXACTLY, without spawning', () => {
    // Both directions of the verdict, so this cannot pass by always-green or always-red.
    for (const [label, spec] of [
      ['a regression outside the census', { entries: {}, suites: SUITES }],
      ['the failure is banked and within ceiling', { entries: ENTRIES, suites: SUITES }],
      ['everything passes', { entries: {}, suites: [{ file: REAL, tests: [T('a', 'passed')] }] }],
    ]) {
      const live = run({ ...spec, captureRunner: true });
      expect(live.capture, `${label}: the control did not spawn`).not.toBe(null);

      const log = run({
        ...spec, captureRunner: true, args: ['--from-log', live.reportFile],
      });
      expect(log.capture, `${label}: --from-log SPAWNED a runner`).toBe(null);
      expect(log.status, `${label}: exit differs — ${log.out}`).toBe(live.status);
      expect(verdictOnly(log.out), `${label}: the verdict text differs`).toBe(verdictOnly(live.out));
    }
  });

  test('--from-log fails closed on a missing report and NEVER feeds a freeze', () => {
    const absent = run({
      entries: ENTRIES, suites: SUITES, args: ['--from-log', join(TMP, 'no-such-report.json')],
    });
    expect(absent.status, absent.out).not.toBe(0);
    expect(absent.out).toContain('does not exist — failing closed');

    // ⛔ A census frozen from a report the CALLER supplies is not one this gate observed.
    for (const mode of ['--update', '--bootstrap']) {
      const live = run({ entries: ENTRIES, suites: SUITES });
      const refused = run({
        entries: ENTRIES, suites: SUITES, args: [mode, '--from-log', live.reportFile], noBaseline: mode === '--bootstrap',
      });
      expect(refused.status, `${mode}: ${refused.out}`).not.toBe(0);
      expect(refused.out).toContain('--from-log is REFUSED');
    }

    // A value-less flag is an ERROR, never a silent fall-back to spawning the suite.
    const bare = run({ entries: ENTRIES, suites: SUITES, args: ['--from-log'], captureRunner: true });
    expect(bare.status, bare.out).not.toBe(0);
    expect(bare.out).toContain('needs a report path');
    expect(bare.capture, 'a malformed --from-log fell back to SPAWNING the suite').toBe(null);
  });

  // ── anti-vacuity: "the suite actually ran" ────────────────────────────────
  describe('anti-vacuity sentinel — a runner that did not run is not "0 failures"', () => {
    test('fails closed when the runner writes NO report at all', () => {
      const r = run({ report: null });
      expect(r.status, r.out).not.toBe(0);
      expect(r.out).toMatch(/NO REPORT|failing closed/i);

      const strict = run({ report: null, args: ['--verify-dist'], noBaseline: true });
      expect(strict.status, strict.out).not.toBe(0);
      expect(strict.out).toMatch(/NO REPORT|failing closed/i);
    });

    test('fails closed when the report is unparseable bytes', () => {
      const r = run({ rawReport: '{ this is not json' });
      expect(r.status, r.out).not.toBe(0);
      expect(r.out).toMatch(/UNPARSEABLE|failing closed/i);

      const strict = run({
        rawReport: '{ this is not json', args: ['--verify-dist'], noBaseline: true,
      });
      expect(strict.status, strict.out).not.toBe(0);
      expect(strict.out).toMatch(/UNPARSEABLE|failing closed/i);
    });

    test('fails closed when the report parses but contains ZERO tests', () => {
      // The nastiest shape: a well-formed report of an empty run. Zero failures
      // out of zero tests would otherwise read as a clean suite.
      const r = run({ report: { testResults: [] } });
      expect(r.status, r.out).not.toBe(0);
      expect(r.out).toMatch(/ZERO TESTS/i);

      const strict = run({ report: { testResults: [] }, args: ['--verify-dist'], noBaseline: true });
      expect(strict.status, strict.out).not.toBe(0);
      expect(strict.out).toMatch(/ZERO TESTS/i);

      const missing = run({
        report: strictReport((report) => { report.testResults.shift(); }),
        exitCode: 0,
        args: ['--verify-dist'],
        noBaseline: true,
      });
      expect(missing.status, missing.out).not.toBe(0);
      expect(missing.out).toMatch(/MISSING discovered build-test file/);

      const extra = run({
        report: strictReport((report) => {
          report.testResults.push({
            name: join(ROOT, 'tests/build/ghost.test.js'),
            status: 'passed',
            assertionResults: [{ fullName: 'ghost', status: 'passed' }],
          });
        }),
        exitCode: 0,
        args: ['--verify-dist'],
        noBaseline: true,
      });
      expect(extra.status, extra.out).not.toBe(0);
      expect(extra.out).toMatch(/EXTRA reported file/);

      const outside = run({
        report: strictReport((report) => {
          report.testResults.push({
            name: join(ROOT, REAL2),
            status: 'passed',
            assertionResults: [{ fullName: 'escaped', status: 'passed' }],
          });
        }),
        exitCode: 0,
        args: ['--verify-dist'],
        noBaseline: true,
      });
      expect(outside.status, outside.out).not.toBe(0);
      expect(outside.out).toMatch(/OUT-OF-SCOPE/);

      const duplicate = run({
        report: strictReport((report) => { report.testResults.push(report.testResults[0]); }),
        exitCode: 0,
        args: ['--verify-dist'],
        noBaseline: true,
      });
      expect(duplicate.status, duplicate.out).not.toBe(0);
      expect(duplicate.out).toMatch(/DUPLICATE reported build-test file/);

      const duplicateRow = run({
        report: strictReport((report) => {
          report.testResults[0].assertionResults.push(
            report.testResults[0].assertionResults[0],
          );
        }),
        exitCode: 0,
        args: ['--verify-dist'],
        noBaseline: true,
      });
      expect(duplicateRow.status, duplicateRow.out).not.toBe(0);
      expect(duplicateRow.out).toMatch(/DUPLICATE build-test row/);
    });

    test('fails closed even when the runner exits ZERO with an empty report', () => {
      // A crash that still exits 0 (a wrapper swallowing the code) must not pass.
      const r = run({ report: { testResults: [] }, exitCode: 0 });
      expect(r.status, r.out).not.toBe(0);

      const strict = run({
        report: strictReport(), exitCode: 1, args: ['--verify-dist'], noBaseline: true,
      });
      expect(strict.status, strict.out).not.toBe(0);
      expect(strict.out).toMatch(/runner exited NON-ZERO/);

      const falseSuccess = run({
        report: strictReport((report) => { report.success = false; }),
        exitCode: 0,
        args: ['--verify-dist'],
        noBaseline: true,
      });
      expect(falseSuccess.status, falseSuccess.out).not.toBe(0);
      expect(falseSuccess.out).toMatch(/report\.success is not TRUE/);

      const badSuiteStatus = run({
        report: strictReport((report) => { report.testResults[0].status = 'failed'; }),
        exitCode: 0,
        args: ['--verify-dist'],
        noBaseline: true,
      });
      expect(badSuiteStatus.status, badSuiteStatus.out).not.toBe(0);
      expect(badSuiteStatus.out).toMatch(/suite status was not PASSED/);

      for (const field of [
        'numTotalTests', 'numPassedTests', 'numFailedTests', 'numPendingTests', 'numTodoTests',
      ]) {
        const counter = run({
          report: strictReport((report) => { report[field] += 1; }),
          exitCode: 0,
          args: ['--verify-dist'],
          noBaseline: true,
        });
        expect(counter.status, `${field}: ${counter.out}`).not.toBe(0);
        expect(counter.out).toContain(`report counter ${field}=`);
      }

      for (const mutate of [
        (report) => { report.testResults[0].assertionResults[0].status = 'cancelled'; },
        (report) => {
          report.testResults[0].assertionResults[0].fullName = '';
          report.testResults[0].assertionResults[0].title = '';
          report.testResults[0].assertionResults[0].ancestorTitles = [];
        },
      ]) {
        const incomplete = run({
          report: strictReport(mutate),
          exitCode: 0,
          args: ['--verify-dist'],
          noBaseline: true,
        });
        expect(incomplete.status, incomplete.out).not.toBe(0);
        expect(incomplete.out).toMatch(/UNKNOWN\/INCOMPLETE build-test result row/);
      }
    });

    // ── ⚠⚠ CURE 1b: THE EVIDENCE BLOCK REACHES STRICT DIST ───────────────────
    // Strict dist is the surface with NO census and NO debt concept, which makes
    // the timeout-vs-assertion question sharper here, not softer: there is nothing
    // to bank a cost failure into, so a reader who cannot tell the two apart is
    // left deciding whether the DIST ARTIFACT is broken or the clock merely ran
    // out. It named the row and stopped. Now it classifies it.
    //
    // ⛔ WHAT REDS IS UNTOUCHED — every strict-dist arm above was written before
    // this existed and passes verbatim; these arms pin only what the red SAYS.
    test('⭐ CURE 1b: a FAILED build-test row is CLASSIFIED, not merely named', () => {
      const TIMEOUT_KILL = 'Error: STACK_TRACE_ERROR\n    at task (file:///…/@vitest/runner)';
      const failed = run({
        // A realistic failed build test: the row fails, its suite fails with it, and
        // the report's own counters follow — so this red is about the FAILED row and
        // not a counter disagreement standing in for one.
        report: strictReport((report) => {
          const suite = report.testResults[0];
          suite.status = 'failed';
          suite.assertionResults[0].status = 'failed';
          suite.assertionResults[0].duration = 20528.109540999998;
          suite.assertionResults[0].failureMessages = [TIMEOUT_KILL];
          report.numPassedTests -= 1;
          report.numFailedTests += 1;
          report.success = false;
        }),
        exitCode: 1,
        args: ['--verify-dist'],
        noBaseline: true,
      });
      expect(failed.status, failed.out).not.toBe(0);
      expect(failed.out).toMatch(/STRICT DIST REFUSED/);
      expect(failed.out).toMatch(/FAILED build-test row\(s\):/);

      // (a) THE DURATION AND THE BUDGET, on the row's own line — the same shape the
      // regression block prints, from the same resolver.
      expect(failed.out, 'a failed build row must print its duration against a budget')
        .toMatch(/TIMEOUT · ran 20528ms against a \d+ms budget/);
      // (b) THE REASON.
      expect(failed.out).toContain('vitest serialises a timeout kill as `Error: STACK_TRACE_ERROR`');
      // (c) THE FIRST LINE ONLY.
      expect(failed.out).toContain('msg: Error: STACK_TRACE_ERROR');
      expect(
        failed.out.split('\n').filter((l) => l.includes('@vitest/runner')),
        'the block prints the FIRST line only',
      ).toEqual([]);
      // (d) ⭐ THE INFERENCE STRICT DIST IS ENTITLED TO, and it is NOT the census
      // one: this surface banks nothing, so the advisory must not tell a reader to
      // keep a cost failure out of a census that does not exist here.
      expect(failed.out).toMatch(/A BUDGET EXPIRY IS A COST FAILURE/);
      expect(failed.out).toContain('Strict dist has no census to bank it in');
      // anchored: the advisory's own strict-dist sentence is asserted PRESENT on the line directly above, so the block is proven live and fully printed here; this denial can therefore only mean the wording emitted was the strict-dist one and not the census-flavoured variant
      expect(failed.out, 'the census-flavoured wording belongs to the regression block').not.toMatch(/NEVER DEBT/);
    });

    test('⭐ CURE 1b NEGATIVE CONTROL: a NON-RUN build row gets no manufactured class', () => {
      // A pending/skipped row carries neither a duration nor a message. Printing a
      // class under it would be inventing evidence rather than reporting it — the
      // exact failure mode an evidence block is most tempting to fall into, since
      // `classifyFailure` will always return SOMETHING if you ask it.
      const nonRun = run({
        report: strictReport((report) => {
          const suite = report.testResults[0];
          suite.assertionResults[0].status = 'pending';
          report.numPassedTests -= 1;
          report.numPendingTests += 1;
        }),
        exitCode: 0,
        args: ['--verify-dist'],
        noBaseline: true,
      });
      expect(nonRun.status, nonRun.out).not.toBe(0);
      // LIVENESS ANCHOR: pin the live, fully-printed refusal that names the row
      // before denying anything about it, so the denials below cannot pass by the
      // output having drifted away entirely.
      expect(nonRun.out).toMatch(/STRICT DIST REFUSED/);
      expect(nonRun.out).toMatch(/PENDING build-test row\(s\):/);
      // anchored: the REFUSED verdict and the PENDING row header pinned on the two lines above prove this is a live refusal that reached and named the non-run row, so this denial states that no duration line was manufactured under a row that carries no duration
      expect(nonRun.out, 'a non-run row has no duration to classify').not.toMatch(/ · ran .* against a \d+ms budget/);
      // anchored: same two pinned assertions above — the refusal is live and names the row, so this denial states that no message line was manufactured under a row that carries no message
      expect(nonRun.out, 'a non-run row has no message to quote').not.toMatch(/^\s+msg: /m);
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

      expect(BUILD_FILES.length, 'strict discovery must find a real build-test corpus').toBeGreaterThan(0);
      const strict = run({
        report: strictReport(),
        exitCode: 0,
        args: ['--verify-dist'],
        noBaseline: true,
        captureRunner: true,
      });
      expect(strict.status, strict.out).toBe(0);
      expect(strict.out).toMatch(new RegExp(`STRICT DIST OK .+ ${BUILD_FILES.length} discovered/reported file`));
      expect(strict.capture).toEqual({ verifyDist: '1' });

      const sourceEnv = run({
        entries: { [identityOf(REAL, 'a')]: {} },
        suites: [{ file: REAL, tests: [T('a')] }],
        inheritedVerifyDist: true,
        captureRunner: true,
      });
      expect(sourceEnv.status, sourceEnv.out).toBe(0);
      expect(sourceEnv.capture).toEqual({ verifyDist: null });
    });
  });

  // ── the ratchet law ───────────────────────────────────────────────────────
  describe('the census is PER TEST and shrink-only', () => {
    test('a baselined failing test passes (debt is banked, not forgiven-then-refused)', () => {
      const r = run({
        entries: { [identityOf(REAL, 'a')]: {} },
        suites: [{
          file: REAL,
          // The banked row carries a REAL failure message, so the evidence block
          // has everything it would need to print — and must still stay silent.
          // ⚠ It carries the `population 1` token because this row writes its OWN message
          // and therefore opts out of the harness's default one; the default magnitude
          // still has to find its figure, or the row reds as UNMEASURED (which is the
          // fail-closed behaviour TE-RATCHET-MAG added, convicted in its own block below).
          tests: [T('a', 'failed', { duration: 12.5, failureMessages: ['AssertionError: banked population 1'] })],
        }],
      });
      expect(r.status, r.out).toBe(0);
      // ── THE EVIDENCE BLOCK IS BOUND TO THE RED, and this is the control that
      // says so. A green gate that also copied an 11.5MB report and stamped the
      // machine would be paying the cure's whole cost on every passing run.
      // LIVENESS ANCHOR first: exit 0 alone is satisfied by a gate that printed
      // nothing at all, so pin the success verdict before denying anything.
      expect(r.out).toMatch(/OK — no test regressions/);
      // anchored: the success verdict pinned on the line above proves this output is the live, fully-printed OK report, so the denial states that the evidence block WITHHELD itself on a green — it cannot pass by the output having drifted away
      expect(r.out).not.toMatch(/full runner report:|machine at this run:|ASSERTION ·/);
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

      // ── ⚠⚠ THE EVIDENCE BLOCK, DRIVEN (the §358.3 cure) ────────────────────
      // Naming the row was all this red ever did, and HUNT-1 measured what that
      // cost: across four full-suite runs a per-test TIMEOUT and a genuine value
      // mismatch were INDISTINGUISHABLE here, while the report that settled each
      // one in a line sat orphaned under a random mkdtemp name nobody printed.
      // So the three rows below are the three MEASURED shapes, verbatim from the
      // recovered reports, and each must come back CLASSIFIED:
      //   • a timeout kill  — 20,528ms, `Error: STACK_TRACE_ERROR`
      //     (tests/lint/lawBandTable.walker.test.js, run C)
      //   • a query budget  —  5,470ms, `Unable to find role=…`
      //     (tests/components/npcAuthoringScope.test.jsx, runs C and D)
      //   • an assertion    —  0.462ms, `AssertionError: expected 19 …`
      //     (tests/copy/voiceMechanics.test.js, all four runs)
      // ⛔ These are OUTPUT pins only. The verdict, the census comparison and the
      // exit code are untouched by any of it — proven by the arms above and below,
      // which were written before this block existed and still pass unchanged.
      const TIMEOUT_KILL = 'Error: STACK_TRACE_ERROR\n    at task (file:///…/@vitest/runner)';
      const QUERY_EXPIRY = 'Error: Unable to find role="button" and name `/Mara/i`'
        + '\n\nIgnored nodes: comments, script, style';
      const VALUE_MISMATCH = 'AssertionError: expected 19 to be less than or equal to 6'
        + '\n    at tests/copy/voiceMechanics.test.js:139:7';
      const classified = run({
        entries: { [identityOf(REAL, 'banked')]: {} },
        suites: [{
          file: REAL,
          tests: [
            T('banked'),
            T('killed at its budget', 'failed', {
              duration: 20528.109540999998, failureMessages: [TIMEOUT_KILL],
            }),
            T('query budget expired', 'failed', {
              duration: 5470.076292000001, failureMessages: [QUERY_EXPIRY],
            }),
            T('a real verdict', 'failed', {
              duration: 0.46191700000008495, failureMessages: [VALUE_MISMATCH],
            }),
          ],
        }],
      });
      expect(classified.status, classified.out).not.toBe(0);

      // (a) THE DURATION AND THE BUDGET, on the row's own line. The budget figure
      // is matched as a number rather than pinned: it is read from the live vitest
      // config, and freezing it here would put a second address on a tunable the
      // estate already governs elsewhere.
      expect(classified.out, 'the timeout kill must print its duration against a budget')
        .toMatch(/TIMEOUT · ran 20528ms against a \d+ms budget/);
      expect(classified.out, 'a sub-millisecond row must not read as an unmeasured one')
        .toMatch(/ASSERTION · ran <1ms against a \d+ms budget/);
      expect(classified.out).toMatch(/QUERY-BUDGET · ran 5470ms against a \d+ms budget/);

      // (b) THE CLASSIFICATION SAYS WHY, and the three reasons are three different
      // mechanisms — the marker, the library budget, the verdict. A block that
      // printed one reason for everything would be a label, not a discriminator.
      expect(classified.out).toContain('vitest serialises a timeout kill as `Error: STACK_TRACE_ERROR`');
      expect(classified.out).toContain('a library query budget expired (Testing Library)');
      expect(classified.out).toContain('a real verdict — read the message');
      expect(classified.out, 'a cost failure must never be read as bankable debt')
        .toMatch(/A BUDGET EXPIRY IS A COST FAILURE, NEVER DEBT/);

      // (c) THE FIRST LINE OF THE MESSAGE — the half HUNT-1 had to recover from
      // TMPDIR by mtime. One line each, never the whole 8,915-character stack.
      expect(classified.out).toContain('msg: Error: STACK_TRACE_ERROR');
      expect(classified.out).toContain('msg: Error: Unable to find role="button" and name `/Mara/i`');
      expect(classified.out).toContain('msg: AssertionError: expected 19 to be less than or equal to 6');
      expect(
        classified.out.split('\n').filter((l) => l.includes('Ignored nodes')),
        'the block prints the FIRST line only — a full stack would bury the next row',
      ).toEqual([]);

      // (d) THE MACHINE, because a budget expiry under heavy oversubscription is
      // the recorded MACHINE-LOAD ARTIFACT shape and the load is not recoverable
      // from anything else after the fact.
      expect(classified.out).toMatch(/machine at this run: load [\d.]+\/[\d.]+\/[\d.]+ over \d+ core\(s\)/);

      // (e) ⭐ THE REPORT IS NAMED AND IT IS REALLY THERE. A printed path that did
      // not resolve would be worse than no path at all, so both are OPENED here,
      // and the stable copy is proven BYTE-IDENTICAL to the report it copies —
      // not merely present.
      const named = /full runner report: (\S+)/.exec(classified.out);
      expect(named, 'the red must name the report it was decided from').toBeTruthy();
      expect(existsSync(named[1]), `${named[1]}: named but not on disk`).toBe(true);
      const stable = /stable copy of it:\s+(\S+)/.exec(classified.out);
      expect(stable, 'the last red must be one open away, not an mtime hunt').toBeTruthy();
      expect(
        readFileSync(stable[1], 'utf8'),
        'the stable copy is a COPY — a truncated or stale one proves nothing',
      ).toBe(readFileSync(named[1], 'utf8'));
      // ⛔ BOTH PATHS LIVE OUTSIDE THE REPO. The header's law: a report written
      // into the tree is the recorded bare-`--json` hazard wearing a new coat.
      for (const p of [named[1], stable[1]]) {
        expect(relative(ROOT, p).startsWith('..'), `${p} is inside the repo`).toBe(true);
      }
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
      // THE REPORT IS NAMED ON THIS RED TOO, and that is deliberate: this arm has
      // ZERO non-census failing rows, so a path printed only beside a classified
      // row would leave the hidden-debt red exactly as unreadable as before.
      expect(r.out).toMatch(/full runner report: \S+/);
      expect(r.out).toMatch(/machine at this run: load/);
      // …and nothing is CLASSIFIED here, because a skip has no duration and no
      // message to classify. The two assertions above prove the block printed, so
      // this denial reads as "the per-row half correctly stayed empty".
      // anchored: the `full runner report:` and `machine at this run:` matches two lines up prove the evidence block is present and fully printed, so this denies a per-row classification specifically — not an absent report
      expect(r.out).not.toMatch(new RegExp(`(?:${FAILURE_CLASSES.join('|')}) · ran`));
    });

    test('growth in the suite-wide skip count reds the gate', () => {
      const r = run({
        entries: {},
        suites: [{ file: REAL, tests: [T('a', 'pending'), T('b', 'pending'), T('c', 'passed')] }],
        skippedCeiling: 1,
      });
      expect(r.status, r.out).not.toBe(0);
      expect(r.out).toMatch(/skipped tests grew/i);

      for (const status of ['failed', 'skipped', 'pending', 'todo']) {
        const strict = run({
          report: strictReport((report) => {
            report.testResults[0].assertionResults[0].status = status;
            if (status === 'failed') report.testResults[0].status = 'failed';
          }),
          exitCode: status === 'failed' ? 1 : 0,
          args: ['--verify-dist'],
          noBaseline: true,
        });
        expect(strict.status, `${status}: ${strict.out}`).not.toBe(0);
        expect(strict.out).toMatch(new RegExp(`${status.toUpperCase()} build-test row`));
      }
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
      expect(r.out).toMatch(/FAILED WITHOUT A MEASURABLE TEST/);

      const strict = run({
        report: strictReport((report) => {
          report.testResults[0].status = 'failed';
          report.testResults[0].assertionResults = [];
        }),
        exitCode: 1,
        args: ['--verify-dist'],
        noBaseline: true,
      });
      expect(strict.status, strict.out).not.toBe(0);
      expect(strict.out).toMatch(/UNCOLLECTED build-test suite/);
    });

    test('⚠⚠ CR-TRFZ-4: a suite that FAILED while enumerating only SKIPS reds too', () => {
      // THE GAP THE FIRST SPELLING LEFT OPEN. `uncollectedOf` used to catch only
      // suites with ZERO assertionResults. A `beforeAll` that throws does NOT
      // produce zero rows — MEASURED against the real vitest JSON reporter on
      // 2026-08-10: the suite reports `status: "failed"` while enumerating every
      // test it owns as `"skipped"`, and `numFailedTests` reads 0. The whole
      // suite's coverage then drains into the SKIP CEILING, where a big enough
      // ceiling swallows it in silence. The observed-shape readers walker did
      // exactly this with 24 tests.
      const r = run({
        entries: {},
        suites: [
          { file: REAL, tests: [T('a', 'passed')] },
          { file: REAL2, suiteStatus: 'failed', tests: [T('x', 'skipped'), T('y', 'skipped')] },
        ],
        skippedCeiling: 50, // deliberately generous: the skip ceiling must NOT be what catches this
      });
      expect(r.status, r.out).not.toBe(0);
      expect(r.out).toMatch(/SCOPE SENTINEL/);
      expect(r.out).toMatch(/FAILED WITHOUT A MEASURABLE TEST/);
      // The two assertions above pin `r.out` as a live SCOPE SENTINEL report that names
      // the uncollected suite, so what follows is arm ATTRIBUTION, not a test against an
      // empty string: the ceiling was set to 50 precisely so it cannot be what reddens,
      // and a hit here would mean the skip arm fired while the discriminator stayed quiet.
      // anchored: the /SCOPE SENTINEL/ and /FAILED WITHOUT A MEASURABLE TEST/ assertions two lines up prove the subject is a live, fully-printed failure report, so this denial can only be read as "the OTHER arm did not fire"
      expect(r.out, 'the skip ceiling must not be the thing that reds — it was set to 50').not.toMatch(/skipped tests grew/);
    });

    // ── ⚠⚠ CURE 1b: THE EVIDENCE BLOCK REACHES THE SCOPE SENTINEL ────────────
    // Cure 1 taught the REGRESSION red to say whether the clock ran out or the
    // value was wrong. This red could not answer it at all: it named the suite and
    // stopped, so the reader of a `beforeAll` explosion still had to go find the
    // report to learn whether the hook TIMED OUT or THREW — the same hunt §358.3
    // measured and closed for the other block.
    //
    // ⛔ WHAT REDS IS UNTOUCHED. The two arms above this one were written before
    // the evidence existed and still pass verbatim; these arms pin only what the
    // red SAYS. The suite carries no per-test row by construction, so the evidence
    // is taken from the SUITE's own clock and message.
    test('⭐ CURE 1b: an uncollected suite is CLASSIFIED, not merely named', () => {
      const TIMEOUT_KILL = 'Error: STACK_TRACE_ERROR\n    at task (file:///…/@vitest/runner)';
      const runStart = 1_700_000_000_000;
      const classified = run({
        entries: {},
        // Built raw rather than through `reportOf`: this arm needs the SUITE-level
        // clock and message, which the shared helper does not emit and which the
        // arms above must keep not emitting.
        report: {
          startTime: runStart,
          // Declared == counted, so the SCOPE COLLAPSE arm stays silent and this
          // red is attributable to the uncollected discriminator alone.
          numPendingTests: 2,
          numTodoTests: 0,
          testResults: [
            {
              name: join(ROOT, REAL),
              status: 'passed',
              startTime: runStart + 500,
              endTime: runStart + 600,
              assertionResults: [{ fullName: 'a', title: 'a', ancestorTitles: [], status: 'passed' }],
            },
            {
              name: join(ROOT, REAL2),
              status: 'failed',
              startTime: runStart + 100,
              endTime: runStart + 100 + 20528,
              message: TIMEOUT_KILL,
              assertionResults: [
                { fullName: 'x', title: 'x', ancestorTitles: [], status: 'skipped' },
                { fullName: 'y', title: 'y', ancestorTitles: [], status: 'skipped' },
              ],
            },
          ],
        },
        skippedCeiling: 50,
      });
      expect(classified.status, classified.out).not.toBe(0);
      expect(classified.out).toMatch(/SCOPE SENTINEL/);
      expect(classified.out).toMatch(/FAILED WITHOUT A MEASURABLE TEST/);

      // (a) THE CLASS AND THE CLOCK, taken from the suite. The budget is matched as
      // a number rather than frozen — it is read from the live vitest config, which
      // the estate governs elsewhere (same rule as the regression block's pins).
      expect(classified.out, 'the uncollected suite must print its elapsed clock against a budget')
        .toMatch(/TIMEOUT · ran 20528ms against a \d+ms budget/);
      // (b) THE REASON, and it is the MARKER — not the clock. This message names
      // `STACK_TRACE_ERROR`, so the class must be decided by the marker branch,
      // which is what makes the verdict independent of whatever the budget is.
      expect(classified.out).toContain('vitest serialises a timeout kill as `Error: STACK_TRACE_ERROR`');
      // (c) THE FIRST LINE OF THE SUITE MESSAGE, one line only.
      expect(classified.out).toContain('msg: Error: STACK_TRACE_ERROR');
      expect(
        classified.out.split('\n').filter((l) => l.includes('@vitest/runner')),
        'the block prints the FIRST line only — a full stack would bury the next suite',
      ).toEqual([]);
      // (d) THE EVIDENCE IS NESTED UNDER THE FILE IT BELONGS TO. Two suites are in
      // this report and only one is uncollected; evidence printed at the file's own
      // indent would read as a sibling entry rather than as that file's evidence.
      const lines = classified.out.split('\n');
      const fileLine = lines.findIndex((l) => l.trim() === REAL2);
      expect(fileLine, `${REAL2} must be named in the red`).toBeGreaterThan(-1);
      expect(lines[fileLine + 1], 'the class line must sit directly under its file, indented past it')
        .toMatch(/^ {8}TIMEOUT · /);
    });

    test('⭐ CURE 1b: the EMPTY-message `beforeAll` case is still classified, by the clock', () => {
      // ⚠⚠ THE ONE THAT MOTIVATES THIS. The recorded CR-TRFZ-4 measurement is
      // explicit that the `beforeAll` throw serialises with an EMPTY suite message
      // — that is precisely why the discriminator could not be message-keyed. A
      // message-keyed EVIDENCE block would fail on the same case, printing nothing
      // useful exactly where the reader is most lost. The clock still answers.
      //
      // The elapsed figure is deliberately far past any plausible suite budget
      // rather than a measured one: the probe recorded status/message/rows, never a
      // duration, and a figure that merely grazed the budget would silently change
      // class the day someone declares a longer timeout in the named file.
      const runStart = 1_700_000_000_000;
      const mute = run({
        entries: {},
        report: {
          startTime: runStart,
          numPendingTests: 2,
          numTodoTests: 0,
          testResults: [
            {
              name: join(ROOT, REAL),
              status: 'passed',
              startTime: runStart + 500,
              endTime: runStart + 600,
              assertionResults: [{ fullName: 'a', title: 'a', ancestorTitles: [], status: 'passed' }],
            },
            {
              name: join(ROOT, REAL2),
              status: 'failed',
              startTime: runStart + 100,
              endTime: runStart + 100 + 999_999,
              // NO `message` key at all — the measured shape.
              assertionResults: [
                { fullName: 'x', title: 'x', ancestorTitles: [], status: 'skipped' },
                { fullName: 'y', title: 'y', ancestorTitles: [], status: 'skipped' },
              ],
            },
          ],
        },
        skippedCeiling: 50,
      });
      expect(mute.status, mute.out).not.toBe(0);
      expect(mute.out).toMatch(/FAILED WITHOUT A MEASURABLE TEST/);
      // The clock alone carries the verdict here.
      expect(mute.out, 'an empty suite message must still yield a class')
        .toMatch(/TIMEOUT · ran 999999ms against a \d+ms budget/);
      expect(mute.out).toContain('the row ran at or past its whole budget');
      // And it says so honestly rather than printing an empty `msg:` line.
      expect(mute.out).toContain('msg: (the report carried no failure message)');
    });

    test('⚠⚠ CR-TRFZ-4 NEGATIVE CONTROL: a DELIBERATELY skipped suite is still just skips', () => {
      // The discriminator must not swallow legitimate skips. MEASURED: a
      // `describe.skip` suite reports `status: "passed"` with skipped rows, and a
      // suite holding a genuinely FAILING test reports `status: "failed"` WITH a
      // failed row. Neither may be reclassified as uncollected, or every ordinary
      // red in the estate would be relabelled and the allowlist would become the
      // only way to hold known debt.
      const skipOnly = run({
        entries: {},
        suites: [
          { file: REAL, tests: [T('a', 'passed')] },
          { file: REAL2, suiteStatus: 'passed', tests: [T('x', 'skipped'), T('y', 'skipped')] },
        ],
        skippedCeiling: 50,
      });
      expect(skipOnly.status, skipOnly.out).toBe(0);
      // LIVENESS ANCHOR: exit 0 on its own would still be satisfied by a gate that
      // printed NOTHING, so pin the success verdict itself before denying anything.
      expect(skipOnly.out).toMatch(/OK — no test regressions/);
      // anchored: the success verdict pinned on the line above proves this is a live, fully-printed report, so the denial states that the discriminator declined to reclassify a deliberate describe.skip — it cannot pass by the output having drifted away
      expect(skipOnly.out).not.toMatch(/FAILED WITHOUT A MEASURABLE TEST/);

      // A suite that failed BECAUSE a test failed is an ordinary failure: the
      // census can see it, so it must stay in `entries`-land, not become a hole.
      const realFailure = run({
        entries: {},
        suites: [
          { file: REAL, tests: [T('a', 'passed')] },
          { file: REAL2, suiteStatus: 'failed', tests: [T('x', 'failed'), T('y', 'skipped')] },
        ],
        skippedCeiling: 50,
      });
      // LIVENESS ANCHOR: this run carried NO verdict assertion at all, so the denial
      // below was satisfied by any output whatsoever — including none. `entries` is
      // empty, so the failing test IS an ordinary regression; pin that verdict first.
      expect(realFailure.status, realFailure.out).not.toBe(0);
      expect(realFailure.out).toMatch(/TEST REGRESSIONS/);
      // anchored: the regression verdict pinned directly above proves this output is the ordinary per-test failure report, so the denial asserts a CLASSIFICATION — measurable failure, not a hole — rather than an absent string
      expect(realFailure.out).not.toMatch(/FAILED WITHOUT A MEASURABLE TEST/);
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
      // LIVENESS ANCHOR: without this, a gate that exited 0 having printed nothing
      // would satisfy the denial below just as well as the tolerance being real.
      expect(r.out).toMatch(/OK — no test regressions/);
      // anchored: the success verdict pinned on the line above proves the report is live and complete, so the denial states that an ALLOWLISTED uncollected suite was tolerated SILENTLY — the banner was withheld, not merely absent from an empty string
      expect(r.out).not.toMatch(/FAILED WITHOUT A MEASURABLE TEST/);
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

    // ── ⚠⚠ THE SCOPE-COLLAPSE DISGUISE ───────────────────────────────────────
    // A dead worker's tests are serialised as `pending`, which `NON_RUN_STATUSES`
    // counts as non-run rows — so a COLLAPSE used to surface as `skipped tests grew`,
    // sending the reader to the deferral list instead of to the tests that never ran.
    // These pins drive the two discriminators the report already carries.
    /** A report where REAL2 never started: its clock never left the run's own stamp. */
    const collapsedReport = ({ runStart = 1_700_000_000_000, deadRows = 3, declaredPending = 0 } = {}) => ({
      startTime: runStart,
      numPendingTests: declaredPending,
      numTodoTests: 0,
      testResults: [
        {
          name: join(ROOT, REAL),
          status: 'passed',
          startTime: runStart + 500,
          endTime: runStart + 700,
          assertionResults: [{ fullName: 'a', title: 'a', ancestorTitles: [], status: 'passed' }],
        },
        {
          name: join(ROOT, REAL2),
          status: 'passed',
          startTime: runStart,
          endTime: runStart,
          assertionResults: Array.from({ length: deadRows }, (_, i) => ({
            fullName: `dead${i}`, title: `dead${i}`, ancestorTitles: [], status: 'pending',
          })),
        },
      ],
    });

    test('⚠⚠ a COLLAPSED suite reds AS a collapse, and is NAMED', () => {
      // Both discriminators fire here: vitest declared 0 pending while the census
      // counted 3 non-run rows, and REAL2's clock never left the run's start stamp.
      const r = run({ entries: {}, skippedCeiling: 0, report: collapsedReport() });
      expect(r.status, r.out).not.toBe(0);
      expect(r.out).toMatch(/SCOPE COLLAPSE/);
      expect(r.out).toMatch(/NEVER STARTED/);
      expect(r.out, 'the offending suite must be named, not merely counted').toMatch(/check-test-ratchet\.mjs/);
      expect(r.out, 'the count disagreement is the detecting arm').toMatch(/gap of 3 row\(s\)/);

      // THE GAP ARM ALONE: same collapse, but the clock is honest, so no suite can be
      // named. The disagreement between vitest's own counter and the census still refuses.
      const gapOnly = run({
        entries: {},
        skippedCeiling: 50, // generous: the ceiling must NOT be what reds here
        report: (() => {
          const base = collapsedReport();
          base.testResults[1].startTime = base.startTime + 900;
          base.testResults[1].endTime = base.startTime + 950;
          return base;
        })(),
      });
      expect(gapOnly.status, gapOnly.out).not.toBe(0);
      expect(gapOnly.out).toMatch(/SCOPE COLLAPSE/);
      expect(gapOnly.out).toMatch(/no suite could be NAMED/);

      const strict = run({
        report: strictReport((report) => {
          report.testResults[0].startTime = report.startTime;
          report.testResults[0].endTime = report.startTime;
          report.testResults[0].assertionResults[0].status = 'pending';
        }),
        exitCode: 0,
        args: ['--verify-dist'],
        noBaseline: true,
      });
      expect(strict.status, strict.out).not.toBe(0);
      expect(strict.out).toMatch(/COLLAPSED build-test suite/);
    });

    test('⚠⚠ a collapse is NEVER reported as skip-ceiling growth', () => {
      // THE MISDIRECTION THIS EXISTS TO END. With a ceiling of 0 and 3 non-run rows the
      // OLD spelling said `skipped tests grew: 3 > ceiling 0` and named no suite at all.
      const r = run({ entries: {}, skippedCeiling: 0, report: collapsedReport() });
      expect(r.status, r.out).not.toBe(0);
      expect(r.out).toMatch(/SCOPE COLLAPSE/);
      // anchored: the collapse verdict pinned on the line above proves this output is a live, fully-printed refusal, so the denial states that the collapsed rows were SUBTRACTED before the ceiling was judged — it cannot pass by the report having drifted away
      expect(r.out).not.toMatch(/skipped tests grew/);

      // …and a ceiling genuinely breached ON TOP of a collapse still reds, on the
      // ADJUSTED figure: 5 non-run rows, 3 of them collapsed, ceiling 1 → 2 > 1.
      const alsoSkips = run({
        entries: {},
        skippedCeiling: 1,
        report: (() => {
          const base = collapsedReport({ declaredPending: 2 });
          base.testResults[0].assertionResults.push(
            { fullName: 's1', title: 's1', ancestorTitles: [], status: 'pending' },
            { fullName: 's2', title: 's2', ancestorTitles: [], status: 'pending' },
          );
          return base;
        })(),
      });
      expect(alsoSkips.status, alsoSkips.out).not.toBe(0);
      expect(alsoSkips.out).toMatch(/SCOPE COLLAPSE/);
      expect(alsoSkips.out).toMatch(/skipped tests grew: 2 > ceiling 1/);
      expect(alsoSkips.out).toMatch(/subtracting 3 collapsed non-run row\(s\)/);
    });

    test('NEGATIVE CONTROL: an honest run with real skips and todos still passes', () => {
      // The arms must not tax legitimate deferral. vitest counts todos in their OWN
      // field, so a census that compared against `numPendingTests` alone would forge a
      // gap out of ordinary `test.todo` rows and red every healthy run that has one.
      const runStart = 1_700_000_000_000;
      const r = run({
        entries: {},
        skippedCeiling: 3,
        report: {
          startTime: runStart,
          numPendingTests: 2,
          numTodoTests: 1,
          testResults: [{
            name: join(ROOT, REAL),
            status: 'passed',
            startTime: runStart + 400,
            endTime: runStart + 900,
            assertionResults: [
              { fullName: 'a', title: 'a', ancestorTitles: [], status: 'passed' },
              { fullName: 'b', title: 'b', ancestorTitles: [], status: 'pending' },
              { fullName: 'c', title: 'c', ancestorTitles: [], status: 'pending' },
              { fullName: 'd', title: 'd', ancestorTitles: [], status: 'todo' },
            ],
          }],
        },
      });
      expect(r.status, r.out).toBe(0);
      expect(r.out).toMatch(/OK — no test regressions/);
      // anchored: the success verdict pinned on the line above proves the report is live and complete, so this denial asserts that three legitimately deferred rows did NOT trip the collapse arms
      expect(r.out).not.toMatch(/SCOPE COLLAPSE/);

      // ⚠⚠ THE CASE THE REAL CORPUS TAUGHT, and the reason the clock may never refuse
      // alone. `tests/security/customContentLockOrder.postgres.test.js` is
      // `ROOT_DATABASE_URL ? describe : describe.skip`, so with no local PostgreSQL the
      // whole suite is a DELIBERATE skip: it never starts, so its clock is degenerate BY
      // CONSTRUCTION — identical to a dead worker's — while vitest counts its row in
      // `numPendingTests`, so the counts AGREE. An earlier spelling let the clock refuse
      // on its own and this suite reddened the real re-freeze.
      const runStart2 = 1_700_000_000_000;
      /** A `describe.skip` suite: never started (degenerate clock) but honestly counted. */
      const deliberateSkipReport = () => ({
        startTime: runStart2,
        numPendingTests: 1,
        numTodoTests: 0,
        testResults: [
          {
            name: join(ROOT, REAL),
            status: 'passed',
            startTime: runStart2 + 400,
            endTime: runStart2 + 900,
            assertionResults: [{ fullName: 'a', title: 'a', ancestorTitles: [], status: 'passed' }],
          },
          {
            // Never started, so startTime === endTime === report.startTime — and yet HONEST.
            name: join(ROOT, REAL2),
            status: 'passed',
            startTime: runStart2,
            endTime: runStart2,
            assertionResults: [{ fullName: 'pg', title: 'pg', ancestorTitles: [], status: 'pending' }],
          },
        ],
      });
      const deliberateSkip = run({ entries: {}, skippedCeiling: 1, report: deliberateSkipReport() });
      expect(deliberateSkip.status, deliberateSkip.out).toBe(0);
      expect(deliberateSkip.out).toMatch(/OK — no test regressions/);
      // anchored: the success verdict pinned on the line above proves the report is live and complete, so this denial asserts that a degenerate CLOCK with AGREEING counts is read as the honest describe.skip it is
      expect(deliberateSkip.out).not.toMatch(/SCOPE COLLAPSE/);
      // …and its row must still be CHARGED to the skip ceiling, never subtracted away:
      // ceiling 1 with 1 skip passes here, but ceiling 0 must red on that same row.
      const chargedToCeiling = run({ entries: {}, skippedCeiling: 0, report: deliberateSkipReport() });
      expect(chargedToCeiling.status, chargedToCeiling.out).not.toBe(0);
      expect(chargedToCeiling.out).toMatch(/skipped tests grew: 1 > ceiling 0/);
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

      for (const args of [[], ['--update'], ['--bootstrap']]) {
        const leaked = run({
          suites: [{ file: BUILD_FILES[0], tests: [T('escaped', 'passed')] }],
          args,
        });
        expect(leaked.status, `${args.join(' ')}: ${leaked.out}`).not.toBe(0);
        expect(leaked.out).toMatch(/SOURCE PHASE included tests\/build/);
        expect(leaked.out).toContain(BUILD_FILES[0]);
      }
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
      expect(written._doc).toMatch(
        /^PER-TEST failure census for the source phase \(all tests except tests\/build\/\*\*\)\./,
      );
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

      for (const mode of ['--update', '--bootstrap']) {
        const strict = run({
          report: strictReport(),
          exitCode: 0,
          args: ['--verify-dist', mode],
          noBaseline: true,
        });
        expect(strict.status, `${mode}: ${strict.out}`).not.toBe(0);
        expect(strict.out).toMatch(/--verify-dist is incompatible/);
      }
      for (const args of [['--update', '--bootstrap'], ['--update', '--update'], ['--unknown']]) {
        const invalid = run({ report: strictReport(), exitCode: 0, args, noBaseline: true });
        expect(invalid.status, `${args.join(' ')}: ${invalid.out}`).not.toBe(0);
        expect(invalid.out).toMatch(/mutually exclusive|unknown argument/);
      }

      const buildDebt = run({
        entries: { [identityOf(BUILD_FILES[0], 'known failure')]: {} },
        suites: [{ file: REAL, tests: [T('a', 'passed')] }],
      });
      expect(buildDebt.status, buildDebt.out).not.toBe(0);
      expect(buildDebt.out).toMatch(/SOURCE BASELINE contains tests\/build/);
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

  // ── ⭐⭐ TE-RATCHET-MAG: the BANKED row's magnitude, EXECUTED (ODQ §854) ──────
  //
  // Every pin in this block drives the REAL gate through the fake runner. The defect
  // being closed is not hypothetical: banking the four voice rows collapsed ~150 per-FILE
  // guards into 4 permitted reds, and the population then grew +109 em dashes across 29
  // further files WITH EVERY GATE GREEN. The row's verdict never changed, because a
  // walker's verdict is a POPULATION and `expected 1037 to be less than or equal to 670`
  // reads identically at 1037 and at ten thousand.
  //
  // ⚠ EVERY ARM BELOW IS A MUTATION PROOF, not an assertion about intent: each one plants
  // a magnitude the gate must refuse (or must not), and the PAIRED negative control sits
  // beside it. A conviction with no control cannot tell a working guard from an always-red one.
  describe('⭐ the banked-row MAGNITUDE ceiling — a permitted red may not GROW', () => {
    const ID = identityOf(REAL, 'banked walker');
    /** One banked row whose live message carries `population <n>`, with a declared ceiling. */
    const atPopulation = (population, ceiling, extraSpec = {}) => run({
      entries: {
        [ID]: {
          magnitude: [{
            name: 'population', kind: 'capture', pattern: 'population (\\d+)', ceiling, unit: 'members', ...extraSpec,
          }],
        },
      },
      suites: [{
        file: REAL,
        tests: [T('banked walker', 'failed', { duration: 3, failureMessages: [`AssertionError: population ${population}`] })],
      }],
    });

    test('⛔ THE CONVICTION — a banked row whose population EXCEEDS its ceiling REDS', () => {
      const r = atPopulation(74, 62);
      expect(r.status, r.out).not.toBe(0);
      expect(r.out).toMatch(/BANKED-ROW MAGNITUDE REFUSED/);
      expect(r.out).toMatch(/testRatchet\.test\.js :: banked walker/);
      // The three figures a reader needs to act, and the delta computed rather than left
      // to arithmetic in someone's head.
      expect(r.out).toMatch(/\[population\] measured 74 > ceiling 62 \(\+12\)/);
      expect(r.out).toMatch(/members/);
      // ⛔ AND IT POINTS AT THE CURE, AWAY FROM THE CEILING. This row is already a
      // permitted failure; the ceiling is the only thing still bounding it, so the one
      // inference the block may print is "cut the population".
      expect(r.out).toMatch(/CUT THE POPULATION, NEVER TO RAISE THE CEILING/);
    });

    test('NEGATIVE CONTROL: exactly AT the ceiling passes (it is not an always-red gate)', () => {
      const r = atPopulation(62, 62);
      expect(r.status, r.out).toBe(0);
      expect(r.out).toMatch(/OK — no test regressions/);
      // anchored: the OK verdict above proves the gate ran and printed its full report
      expect(r.out).not.toMatch(/MAGNITUDE REFUSED|RATCHET DOWN/);
    });

    test('BELOW the ceiling passes and prints RATCHET DOWN (a ceiling above the truth stops ratcheting)', () => {
      const r = atPopulation(40, 62);
      expect(r.status, r.out).toBe(0);
      expect(r.out).toMatch(/RATCHET DOWN: 1 magnitude ceiling\(s\)/);
      expect(r.out).toMatch(/\[population\] measured 40 < ceiling 62/);
    });

    test('⛔ FAIL CLOSED: a banked row that declares NO magnitude REDS', () => {
      // The door the whole car exists to shut. Before TE-RATCHET-MAG this was the
      // ONLY state, and it was green.
      const r = run({
        entries: { [ID]: { magnitude: null } },
        suites: [{ file: REAL, tests: [T('banked walker', 'failed', { failureMessages: ['AssertionError: population 9'] })] }],
      });
      expect(r.status, r.out).not.toBe(0);
      expect(r.out).toMatch(/declares NO magnitude/);
      expect(r.out).toMatch(/could NOT BE MEASURED — failing closed/);
    });

    test('⛔ FAIL CLOSED: a declared pattern that matches NOTHING REDS (unmeasured is not small)', () => {
      // The subtle one. If this passed, deleting a row's measurable text — or letting the
      // assertion drift into a new shape — would silently disarm the ceiling while the
      // census still displayed a reassuring number.
      const r = run({
        entries: {
          [ID]: {
            magnitude: [{
              name: 'population', kind: 'capture', pattern: 'population (\\d+)', ceiling: 62, unit: 'members',
            }],
          },
        },
        suites: [{
          file: REAL,
          tests: [T('banked walker', 'failed', { failureMessages: ['AssertionError: the shape of this message changed'] })],
        }],
      });
      expect(r.status, r.out).not.toBe(0);
      expect(r.out).toMatch(/matched NOTHING in the live failure message/);
      // ⛔ and it must NOT invite the escape hatch of deleting the measure
      expect(r.out).toMatch(/never delete the measure to clear this/);
    });

    test('a malformed measure REDS rather than being skipped (kind and ceiling are validated)', () => {
      const badKind = atPopulation(9, 62, { kind: 'vibes' });
      expect(badKind.status, badKind.out).not.toBe(0);
      expect(badKind.out).toMatch(/`kind` must be one of capture\|count\|sum/);

      const badCeiling = atPopulation(9, 62, { ceiling: 'lots' });
      expect(badCeiling.status, badCeiling.out).not.toBe(0);
      expect(badCeiling.out).toMatch(/`ceiling` must be a non-negative integer/);

      const badPattern = atPopulation(9, 62, { pattern: 'population (\\d+' });
      expect(badPattern.status, badPattern.out).not.toBe(0);
      expect(badPattern.out).toMatch(/the pattern does not compile/);
    });

    test('⭐ `sum` catches a population that DEEPENS without gaining a member — the measured defect', () => {
      // THE SHAPE §854 ACTUALLY MEASURED. A member count alone cannot see this: the same
      // 29 files, each carrying more. The per-file voice arms are frozen on `sum` for
      // exactly this reason.
      const message = 'AssertionError: \na.js: current em:10\nb.js: current em:20\n';
      const grown = 'AssertionError: \na.js: current em:10\nb.js: current em:33\n';
      const spec = {
        name: 'em', kind: 'sum', pattern: 'current em:(\\d+)', ceiling: 30, unit: 'em dashes',
      };
      // the member COUNT is identical across both messages — the control that proves the
      // sum is doing work a roster count could not
      const countSpec = {
        name: 'files', kind: 'count', pattern: 'current em:', ceiling: 2, unit: 'files',
      };
      expect(measureMagnitude(countSpec, message).measured).toBe(2);
      expect(measureMagnitude(countSpec, grown).measured).toBe(2);

      const flat = run({
        entries: { [ID]: { magnitude: [spec, countSpec] } },
        suites: [{ file: REAL, tests: [T('banked walker', 'failed', { failureMessages: [message] })] }],
      });
      expect(flat.status, flat.out).toBe(0);

      const deeper = run({
        entries: { [ID]: { magnitude: [spec, countSpec] } },
        suites: [{ file: REAL, tests: [T('banked walker', 'failed', { failureMessages: [grown] })] }],
      });
      expect(deeper.status, deeper.out).not.toBe(0);
      expect(deeper.out).toMatch(/\[em\] measured 43 > ceiling 30 \(\+13\)/);
      // and the count arm stayed silent, which is what makes this a discriminating proof
      // anchored: the `[em]` breach line pinned on the assertion above proves this output IS the populated magnitude report, so the denial says the COUNT arm withheld itself rather than that the report drifted away or came back empty
      expect(deeper.out).not.toMatch(/\[files\]/);
    });

    test('a BANKED row that now PASSES is not magnitude-checked (the win is not punished)', () => {
      // NEGATIVE CONTROL on the gate's scope. A repaired row belongs to the ratchet-down
      // path; measuring a magnitude out of a message it no longer has would red every win.
      const r = run({
        entries: { [ID]: { magnitude: [{ name: 'population', kind: 'capture', pattern: 'population (\\d+)', ceiling: 0, unit: 'members' }] } },
        suites: [{ file: REAL, tests: [T('banked walker', 'passed')] }],
      });
      expect(r.status, r.out).toBe(0);
      expect(r.out).toMatch(/RATCHET DOWN: run `npm run test:ratchet:update`/);
      // anchored: the RATCHET DOWN notice pinned on the assertion above proves the gate ran to its reporting tail with this row in hand, so the denial states the magnitude block DECLINED to measure a passing row rather than that the gate fell over before reaching either
      expect(r.out).not.toMatch(/MAGNITUDE REFUSED/);
    });

    test('⛔ --update LOWERS a slack ceiling and HOLDS a breached one — a re-freeze never raises', () => {
      // THE LAUNDERING DOOR, shut. If a re-freeze could raise a magnitude, every growth
      // would bank itself the moment anyone ran the documented command — which is exactly
      // what VOICE-1b measured on the voice fixture, and what the STRIP-never-raise ruling
      // (ODQ line 266) forbids. Both directions are driven in ONE run.
      const SLACK = identityOf(REAL, 'slack row');
      const BREACH = identityOf(REAL, 'breached row');
      const r = run({
        entries: {
          [SLACK]: { magnitude: [{ name: 'population', kind: 'capture', pattern: 'population (\\d+)', ceiling: 62, unit: 'members' }] },
          [BREACH]: { magnitude: [{ name: 'population', kind: 'capture', pattern: 'population (\\d+)', ceiling: 5, unit: 'members' }] },
        },
        suites: [{
          file: REAL,
          tests: [
            T('slack row', 'failed', { failureMessages: ['AssertionError: population 40'] }),
            T('breached row', 'failed', { failureMessages: ['AssertionError: population 99'] }),
          ],
        }],
        args: ['--update'],
      });
      expect(r.status, r.out).toBe(0);
      expect(r.out).toMatch(/1 magnitude ceiling\(s\) RATCHETED DOWN/);
      expect(r.out).toMatch(/magnitude ceiling\(s\) HELD — a re-freeze never raises one/);

      const written = JSON.parse(readFileSync(r.baselineFile, 'utf8'));
      expect(written.entries[SLACK].magnitude[0].ceiling, 'the slack ceiling must fall to the truth').toBe(40);
      expect(
        written.entries[BREACH].magnitude[0].ceiling,
        'the breached ceiling must be HELD at 5 — raising it to 99 would bank the growth',
      ).toBe(5);

      // ⛔ AND THE HELD ROW STILL REDS THE GATE AFTERWARDS. A re-freeze that leaves the
      // ceiling intact but quiets the gate would be the same laundering by another route,
      // so the proof runs the ordinary gate against the RE-FROZEN census.
      const after = run({
        entries: {
          [BREACH]: { magnitude: written.entries[BREACH].magnitude },
        },
        suites: [{ file: REAL, tests: [T('breached row', 'failed', { failureMessages: ['AssertionError: population 99'] })] }],
      });
      expect(after.status, after.out).not.toBe(0);
      expect(after.out).toMatch(/\[population\] measured 99 > ceiling 5/);
    });

    test('⚠⚠ the ARMED file floor: a collapse in the total test FILE count reds', () => {
      // The `totalFiles` sentinel that was computed, written, asserted-positive and
      // COMPARED NOWHERE (§854.1). Frozen at 10 files, the run reports 1.
      const r = run({
        totalFiles: 10,
        entries: {},
        suites: [{ file: REAL, tests: [T('a', 'passed'), T('b', 'passed')] }],
      });
      expect(r.status, r.out).not.toBe(0);
      expect(r.out).toMatch(/total test FILE count collapsed: 1 < 9/);
      expect(r.out).toMatch(/whole suites left the run/);
    });

    test('NEGATIVE CONTROL: the file floor PASSES when the file scope is intact', () => {
      const r = run({
        totalFiles: 2,
        entries: {},
        suites: [
          { file: REAL, tests: [T('a', 'passed')] },
          { file: REAL2, tests: [T('b', 'passed')] },
        ],
      });
      expect(r.status, r.out).toBe(0);
      expect(r.out).toMatch(/OK — no test regressions/);
      // anchored: the OK verdict pinned on the assertion above proves the gate ran the whole scope comparison and printed its report, so the denial says the FILE floor stayed silent on an intact scope rather than that the output drifted away
      expect(r.out).not.toMatch(/FILE count collapsed/);
    });

    test('⛔ the file floor is INDEPENDENT of the test floor (one can collapse while the other holds)', () => {
      // THE PIN THAT SAYS THE NEW ARM IS NOT A DUPLICATE. The test count is intact (10 of a
      // frozen 10) while the FILE count collapses (1 of a frozen 10) — the shape of a whole
      // directory dropping out of `include` while one big suite survives. The old floor
      // sits green through it; only the file floor refuses.
      const tests = Array.from({ length: 10 }, (_, n) => T(`t${n}`, 'passed'));
      const r = run({
        totalTests: 10,
        totalFiles: 10,
        entries: {},
        suites: [{ file: REAL, tests }],
      });
      expect(r.status, r.out).not.toBe(0);
      expect(r.out).toMatch(/total test FILE count collapsed/);
      // anchored: the FILE refusal above proves the scope sentinel ran and printed its list
      expect(r.out, 'the TEST count floor must be silent — otherwise this proves nothing new').not.toMatch(/total test count collapsed/);
    });
  });

  // ── the magnitude extractor, unit-pinned ────────────────────────────────────
  describe('measureMagnitude — the three kinds, and the vacuity it refuses', () => {
    const spec = (over) => ({
      name: 'm', kind: 'capture', pattern: 'n=(\\d+)', ceiling: 1, unit: 'things', ...over,
    });

    test('capture reads the FIRST match; count counts matches; sum adds them', () => {
      const text = 'n=7 n=11 n=2';
      expect(measureMagnitude(spec(), text)).toEqual({ ok: true, measured: 7 });
      expect(measureMagnitude(spec({ kind: 'count' }), text)).toEqual({ ok: true, measured: 3 });
      expect(measureMagnitude(spec({ kind: 'sum' }), text)).toEqual({ ok: true, measured: 20 });
    });

    test('⛔⛔ a capture that can match EMPTINESS is UNMEASURED, never zero', () => {
      // `Number('')` is 0, so a `(\d*)` spelling would report a magnitude of zero against
      // any text at all — a measure that can never fail. This is the disarmed-guard shape
      // one layer down from the defect the whole car exists to close.
      const empty = measureMagnitude(spec({ pattern: '(\\d*)' }), 'no digits here');
      expect(empty.ok).toBe(false);
      expect(empty.why).toMatch(/not a bare integer/);
      expect(empty.measured, 'an unmeasured verdict must carry NO figure').toBeUndefined();
    });

    test('a missing pattern, a bad kind, a bad ceiling and a nameless measure are all refused', () => {
      expect(measureMagnitude(spec({ pattern: '' }), 'n=1').ok).toBe(false);
      expect(measureMagnitude(spec({ kind: 'guess' }), 'n=1').ok).toBe(false);
      expect(measureMagnitude(spec({ ceiling: -1 }), 'n=1').ok).toBe(false);
      expect(measureMagnitude(spec({ ceiling: 1.5 }), 'n=1').ok).toBe(false);
      expect(measureMagnitude(spec({ name: '  ' }), 'n=1').ok).toBe(false);
      expect(measureMagnitude(null, 'n=1').ok).toBe(false);
      expect(measureMagnitude([], 'n=1').ok).toBe(false);
    });

    test('magnitudeReportOf sorts the three verdicts, and an absent block lands wholly in `unmeasured`', () => {
      const entry = {
        magnitude: [
          spec({ name: 'over', ceiling: 1 }), // measures 7 → breach
          spec({ name: 'under', ceiling: 99 }), // measures 7 → slack
          spec({ name: 'gone', pattern: 'absent=(\\d+)' }), // no match → unmeasured
        ],
      };
      const report = magnitudeReportOf(entry, 'n=7');
      expect(report.breaches.map((b) => b.name)).toEqual(['over']);
      expect(report.slack.map((s) => s.name)).toEqual(['under']);
      expect(report.unmeasured.map((u) => u.name)).toEqual(['gone']);

      for (const absent of [undefined, null, []]) {
        const none = magnitudeReportOf({ magnitude: absent }, 'n=7');
        expect(none.unmeasured).toHaveLength(1);
        expect(none.breaches).toEqual([]);
        expect(none.slack).toEqual([]);
      }
    });

    test('the kind roster is closed and the gate uses THIS list (not a private copy)', () => {
      expect(MAGNITUDE_KINDS).toEqual(['capture', 'count', 'sum']);
      const gate = readFileSync(SCRIPT, 'utf8');
      expect(gate).toContain('export const MAGNITUDE_KINDS');
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
      expect(normalizePath('tests/build/../lint/x.test.js')).toBe('tests/lint/x.test.js');

      const discoveryRoot = join(TMP, `discovery-${seq += 1}`);
      const buildRoot = join(discoveryRoot, 'tests/build');
      const nested = join(buildRoot, '.hidden/nested');
      mkdirSync(nested, { recursive: true });
      const suffixes = [
        'js', 'jsx', 'ts', 'tsx', 'cjs', 'cjsx', 'cts', 'ctsx',
        'mjs', 'mjsx', 'mts', 'mtsx',
      ];
      for (const suffix of suffixes) writeFileSync(join(nested, `case.test.${suffix}`), '');
      writeFileSync(join(nested, 'case.spec.tsx'), '');
      writeFileSync(join(nested, 'case.test.js.snap'), '');
      writeFileSync(join(nested, 'case.bench.js'), '');
      writeFileSync(join(nested, 'case.TEST.js'), '');
      const discovered = discoverBuildTestFiles(discoveryRoot);
      expect(discovered).toHaveLength(13);
      expect(discovered).toEqual([...discovered].sort());
      expect(discovered.every((file) => file.startsWith('tests/build/.hidden/nested/'))).toBe(true);
      for (const suffix of suffixes) {
        expect(discovered).toContain(`tests/build/.hidden/nested/case.test.${suffix}`);
      }
      expect(discovered).toContain('tests/build/.hidden/nested/case.spec.tsx');
      expect(discovered.some((file) => /snap|bench|\.TEST\./.test(file))).toBe(false);

      symlinkSync('case.test.js', join(nested, 'linked.test.js'));
      expect(() => discoverBuildTestFiles(discoveryRoot)).toThrow(/symbolic link/);
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
      // ⚠ THE ASSERTION ABOVE IS LOAD-BEARING FOR THE TWO FIELDS ADDED BELOW, and
      // it is `toEqual` on purpose: a report that carries neither `duration` nor
      // `failureMessages` must still produce the row this file has always pinned.
      // The keys ARE on the row — they simply hold `undefined`, which `toEqual`
      // ignores — so the row shape grew without any consumer's expectation moving.
      expect(Object.keys(rows[0]).sort()).toEqual(
        ['duration', 'failureMessages', 'file', 'fullName', 'id', 'status'],
      );

      // ── THE EVIDENCE FIELDS ARE CARRIED, NOT SYNTHESISED ────────────────────
      // The gate's whole cure rests on these two reaching the printer intact, so
      // pin the passthrough against a REAL recovered row rather than a sketch.
      const carried = rowsOf({
        testResults: [{
          name: 'tests/lint/lawBandTable.walker.test.js',
          assertionResults: [{
            fullName: 'reds on a SECOND exporting module',
            status: 'failed',
            duration: 20528.109540999998,
            failureMessages: ['Error: STACK_TRACE_ERROR\n    at task (…)'],
          }],
        }],
      }, ROOT);
      expect(carried[0].duration).toBe(20528.109540999998);
      expect(carried[0].failureMessages).toEqual(['Error: STACK_TRACE_ERROR\n    at task (…)']);

      // ── ⚠⚠ THE CLASSIFIER, ARM BY ARM ──────────────────────────────────────
      // ORDER IS THE DESIGN, so each arm is driven where it is the ONLY one that
      // could fire, and the closed class set is pinned so a sixth label cannot
      // appear without this file admitting it.
      const budget = 20000;
      expect(FAILURE_CLASSES).toEqual(['TIMEOUT', 'QUERY-BUDGET', 'ASSERTION', 'UNCLASSIFIED']);

      // ARM 2 — the marker, on a duration WELL INSIDE the budget, so nothing but
      // the marker can be doing the work. This is the arm that catches a timeout
      // whose row is charged a budget wider than the suite-wide one.
      expect(classifyFailure({
        duration: 12, message: 'Error: STACK_TRACE_ERROR\n    at task (…)', budget,
      }).class).toBe('TIMEOUT');

      // ⛔ AND FIRST-LINE ONLY. A stack that merely MENTIONS the marker below a
      // real verdict must stay an ASSERTION — otherwise every failure whose stack
      // runs through the runner's own frames gets relabelled a timeout, which is
      // the exact misclassification this cure exists to end, pointing the other way.
      expect(classifyFailure({
        duration: 12,
        message: 'AssertionError: expected 19 to be 6\n    at x\nError: STACK_TRACE_ERROR',
        budget,
      }).class).toBe('ASSERTION');

      // ARM 3 — duration alone, with NO message at all. The arm that still works
      // when the runner writes nothing but a number.
      expect(classifyFailure({ duration: 20528, message: '', budget }).class).toBe('TIMEOUT');
      expect(classifyFailure({ duration: 19999, message: '', budget }).class).toBe('UNCLASSIFIED');

      // ARM 1 — the prose. ⚠ MEASURED ABSENT from vitest 4's JSON (the reporter
      // serialises the rewritten STACK, not the message), so this arm is dead
      // weight against today's runner and is kept for the day a reporter starts
      // emitting `error.message` — at which point it must not silently reclassify.
      expect(classifyFailure({
        duration: 12, message: 'Error: Test timed out in 20000ms.', budget,
      }).class).toBe('TIMEOUT');

      // ARM 4 — a LIBRARY budget, which is a cost failure of a different clock and
      // is therefore named separately rather than folded into TIMEOUT.
      expect(classifyFailure({
        duration: 5470, message: 'Error: Unable to find role="button" and name `/Mara/i`', budget,
      }).class).toBe('QUERY-BUDGET');

      // ARM 5 — the only class that is DEBT.
      expect(classifyFailure({
        duration: 0.55, message: 'AssertionError: expected 1435 to be less than or equal to 670', budget,
      }).class).toBe('ASSERTION');

      // ── THE BUDGET READER ──────────────────────────────────────────────────
      // Driven against synthetic roots, never by re-running the gate's own regex
      // over the same file it reads: a fixture that mirrors the deriver proves the
      // regex equals itself and nothing else.
      const configured = join(TMP, `budget-${seq += 1}`);
      mkdirSync(configured, { recursive: true });
      const declared = 34567;
      writeFileSync(join(configured, 'vite.config.js'), `export default { test: { testTimeout: ${declared} } };\n`);
      expect(globalTestTimeoutOf(configured)).toEqual({
        budget: declared, source: 'vite.config.js testTimeout',
      });
      const bare = join(TMP, `budget-${seq += 1}`);
      mkdirSync(bare, { recursive: true });
      expect(globalTestTimeoutOf(bare)).toEqual({
        budget: VITEST_DEFAULT_TEST_TIMEOUT,
        source: "vitest's own default (no config testTimeout found)",
      });
      // …and the LIVE repo really is read, which is what makes the printed budget
      // a fact about this run rather than a constant. The figure itself is not
      // frozen here: it is a tunable the estate governs in one place already.
      const live = globalTestTimeoutOf(ROOT);
      expect(live.source).toBe('vite.config.js testTimeout');
      expect(live.budget).toBeGreaterThanOrEqual(1000);

      // ── THE PER-FILE LITERAL SCAN ──────────────────────────────────────────
      // Both spellings a file uses to give itself a wider clock. TWO hazards are
      // designed out of these fixtures, and both have bitten this estate before:
      //   • the numbers are INTERPOLATED, so this file's own source carries neither
      //     pattern — a fixture written as a bare literal would be found by the very
      //     scan it tests, and would widen this file's own printed budget;
      //   • the callee is a NEUTRAL name, never a test-registration token, so the
      //     estate's title census cannot read a forged title out of a string here.
      // The scan keys on the trailing argument, not on who is being called, so a
      // neutral callee exercises exactly the same branch.
      const perTest = 60000;
      const queryBudget = 5000;
      expect(timeoutLiteralsOf(`register('slow', async () => { await x(); }, ${perTest});`))
        .toEqual([perTest]);
      expect(timeoutLiteralsOf(`await findByRole('button', { timeout: ${queryBudget} });`)).toEqual([queryBudget]);
      expect(timeoutLiteralsOf(`register('a', () => {}, ${queryBudget});\nregister('b', () => {}, ${perTest});`))
        .toEqual([queryBudget, perTest]);
      // Short numbers are not budgets: `}, 999)` is an argument list, and a
      // three-digit trailing literal would sweep up ordinary call sites.
      expect(timeoutLiteralsOf('fn(() => { g(); }, 999);')).toEqual([]);
      expect(timeoutLiteralsOf('const rows = list.map((r) => r.id);')).toEqual([]);

      // ── THE NUMERIC SEPARATOR, WHICH IS THE HOUSE SPELLING ────────────────
      // ⛔ THE SCAN WAS NOT ERRING WIDE (TE-BUDGET-1, measured 2026-08-31). `\d{4,}` needs
      // four CONSECUTIVE digits, so `60_000` — the spelling of the gate's OWN named house
      // precedent at tests/joins/ordering.test.js:289, and of 106 test files — read as NO
      // budget at all, and every one of those files was classified against the 20,000 ms
      // suite budget it had explicitly overridden. That is the NARROW direction the
      // function's header calls the only one able to INVENT a TIMEOUT label on a genuine
      // assertion failure. `60_000` and `60000` are one budget written two ways.
      //
      // The separator is BUILT, never written: a bare `60_000` in this file's own source
      // would be found by the very scan under test and would widen this file's printed
      // budget — the same hazard the interpolation above is designed out of.
      // The house grouping (`60_000`), and a mid-number separator for the short cases the
      // grouping rule leaves alone. Both are ASSERTED to have actually inserted a
      // separator before they are used, so none of the arms below can pass vacuously on a
      // helper that quietly returned plain digits.
      const sep = (n) => String(n).replace(/\B(?=(\d{3})+$)/g, '_');
      const mid = (n) => String(n).replace(/^(\d)/, '$1_');
      expect(sep(perTest)).toMatch(/^\d+_\d{3}$/);
      expect(mid(999)).toMatch(/^\d_\d+$/);
      expect(timeoutLiteralsOf(`register('slow', async () => { await x(); }, ${sep(perTest)});`))
        .toEqual([perTest]);
      expect(timeoutLiteralsOf(`await findByRole('button', { timeout: ${sep(queryBudget)} });`))
        .toEqual([queryBudget]);
      // Both spellings of the SAME budget collapse to one entry — a separator is not a
      // second, different clock.
      expect(timeoutLiteralsOf(`register('a', () => {}, ${perTest});\nregister('b', () => {}, ${sep(perTest)});`))
        .toEqual([perTest]);
      // ...and the length floors are applied to the SEPARATOR-FREE digits, so a separator
      // cannot smuggle a short number past them.
      expect(timeoutLiteralsOf(`fn(() => { g(); }, ${mid(999)});`)).toEqual([]);
      expect(timeoutLiteralsOf(`bridge.call('x', {}, { timeout: ${mid(50)} });`)).toEqual([]);

      // ── THE PRINTED LINES ──────────────────────────────────────────────────
      // The gate prints exactly what this returns, so pin the bytes here and the
      // arms above are what makes the end-to-end assertions non-circular.
      expect(failureEvidenceOf(carried[0], {
        budget: 20000, budgetSource: 'vite.config.js testTimeout', literals: [],
      })).toEqual([
        '      TIMEOUT · ran 20528ms against a 20000ms budget (vite.config.js testTimeout)'
        + ' — vitest serialises a timeout kill as `Error: STACK_TRACE_ERROR`'
        + " with the stack captured at the test's own registration site",
        '      msg: Error: STACK_TRACE_ERROR',
      ]);
      // A row the report gave no duration and no message is still printed — as an
      // admission that it could not be classified, never as a silent omission.
      expect(failureEvidenceOf({ file: 'tests/x.test.js', fullName: 'y' }, {
        budget: 20000, budgetSource: 'vite.config.js testTimeout', literals: [queryBudget],
      })).toEqual([
        '      UNCLASSIFIED · ran an unrecorded duration against a 20000ms budget'
        + ' (vite.config.js testTimeout; the file also declares 5000ms)'
        + ' — no timeout signal and no assertion signal — open the full report',
        '      msg: (the report carried no failure message)',
      ]);

      // ── ⛔ THE ATTRIBUTION, AND THE ARM A FILE'S OWN LITERAL DISABLES (LT29 car 2) ──
      // §885 QUOTED THE BUG: the gate printed `300000ms budget (vite.config.js testTimeout)`
      // against a config that sets 20,000 — "a real expiry presented as though it had
      // FOURTEEN TIMES the headroom it had". The parenthesis must name the source OF THE
      // NUMBER PRINTED, so the source is carried through the `Math.max`. The two cases above
      // pass NO `globalBudget` and are therefore also the proof of the documented fallback:
      // a caller that resolved no literals gets byte-identical output to before the cure.
      const fileBudget = 300000;
      const rowBudgets = { budgetSource: 'vite.config.js testTimeout', globalBudget: 20000, literals: [perTest, fileBudget] };
      expect(failureEvidenceOf({ file: 'tests/lint/w.test.js', fullName: 'z', duration: 21758 }, {
        budget: fileBudget, ...rowBudgets,
      })).toEqual([
        '      UNCLASSIFIED · ran 21758ms against a 300000ms budget'
        + " (the file's own declared budget — it declares 60000ms, 300000ms;"
        + ' vite.config.js testTimeout sets 20000ms)'
        + ' — no timeout signal and no assertion signal — open the full report',
        '      ⚠ it also ran PAST the suite-wide 20000ms clock; the class above is taken'
        + " against the FILE's 300000ms budget, which this row may not own"
        + ' — if it does not, this row is a TIMEOUT.',
        '      msg: (the report carried no failure message)',
      ]);

      // ⚠ THE RULING THE THIRD LINE EXISTS FOR, STATED AS A NEGATIVE CONTROL. The scan is
      // FILE-scoped and cannot tie a literal to one test — `timeoutLiteralsOf`'s own header
      // says it cannot tell a per-test override from a `beforeAll` argument or a Testing
      // Library query budget — so the same 21,758 ms row classifies two ways depending on
      // which budget it is measured against. THE WIDE DIRECTION IS THE RULING: erring narrow
      // is the only direction able to INVENT a TIMEOUT on a genuine assertion failure
      // (TE-BUDGET-1, measured 2026-08-31), and an under-classification degrades to "open the
      // full report", which is true. The cure is that the wide budget stops governing
      // SILENTLY, which is what the line above is.
      expect(classifyFailure({ duration: 21758, message: '', budget: fileBudget }).class).toBe('UNCLASSIFIED');
      expect(classifyFailure({ duration: 21758, message: '', budget: 20000 }).class).toBe('TIMEOUT');

      // …AND THE THIRD LINE IS NOT NOISE. It appears ONLY where arm 3 was actually disabled:
      // never when the row is already a cost class by another arm, never past the file's own
      // budget (arm 3 fired), and never inside the suite-wide clock (nothing was disabled).
      const linesFor = (row, budget) => failureEvidenceOf(row, { budget, ...rowBudgets });
      const past = linesFor({ duration: 300001 }, fileBudget);
      expect(past).toHaveLength(2);
      expect(past[0]).toContain('TIMEOUT · ran 300001ms against a 300000ms budget');
      expect(past[0]).toContain("(the file's own declared budget");
      const marked = linesFor({ duration: 21758, failureMessages: ['Error: STACK_TRACE_ERROR\n    at task (…)'] }, fileBudget);
      expect(marked).toHaveLength(2);
      expect(marked[0]).toContain('TIMEOUT ·');
      const inside = linesFor({ duration: 19999, failureMessages: ['AssertionError: expected 1 to be 2'] }, fileBudget);
      expect(inside).toHaveLength(2);
      expect(inside[0]).toContain('ASSERTION · ran 19999ms against a 300000ms budget');
      expect(inside[0]).toContain("(the file's own declared budget");

      // …and where the file's literals are all SMALLER than the suite-wide clock the file
      // does NOT govern, so the config keeps the attribution it has always had.
      expect(failureEvidenceOf({ duration: 21758 }, {
        budget: 20000, budgetSource: 'vite.config.js testTimeout', globalBudget: 20000, literals: [queryBudget],
      })[0]).toBe(
        '      TIMEOUT · ran 21758ms against a 20000ms budget'
        + ' (vite.config.js testTimeout; the file also declares 5000ms)'
        + ' — the row ran at or past its whole budget',
      );
    });

    test('uncollectedOf names every suite whose failure the PER-TEST census cannot see', () => {
      // The six rows below are the MEASURED vitest report shapes (2026-08-10,
      // isolated probe): the classification is derived from that measurement, not
      // from a reading of the reporter's docs.
      expect(uncollectedOf({
        testResults: [
          // ordinary passing suite — visible, not a hole
          { name: 'tests/a.test.js', status: 'passed', assertionResults: [{ fullName: 'x', status: 'passed' }] },
          // module-load throw — zero rows (the case the first spelling caught)
          { name: 'tests/b.test.js', status: 'failed', message: 'boom', assertionResults: [] },
          // ⚠ beforeAll throw — FAILED, but every row is a skip and `message` is EMPTY
          {
            name: 'tests/c.test.js',
            status: 'failed',
            message: '',
            assertionResults: [{ fullName: 'x', status: 'skipped' }, { fullName: 'y', status: 'skipped' }],
          },
          // deliberate describe.skip — suite PASSED, so the skips are honest debt
          {
            name: 'tests/d.test.js',
            status: 'passed',
            assertionResults: [{ fullName: 'x', status: 'skipped' }],
          },
          // an ordinary failing test — the census sees it, so it is not a hole
          {
            name: 'tests/e.test.js',
            status: 'failed',
            assertionResults: [{ fullName: 'x', status: 'failed' }, { fullName: 'y', status: 'skipped' }],
          },
          // afterAll throw — a passing test beside a suite-level failure nothing else reports
          {
            name: 'tests/f.test.js',
            status: 'failed',
            message: 'teardown blew up',
            assertionResults: [{ fullName: 'x', status: 'passed' }],
          },
        ],
      }, ROOT)).toEqual(['tests/b.test.js', 'tests/c.test.js', 'tests/f.test.js']);
    });

    test('⚠⚠ the suite MESSAGE is not the discriminator — it is empty on the motivating case', () => {
      // MEASURED: a `beforeAll` explosion carries `message: ""`. A guard keyed on
      // "the suite reported a message" would therefore fail OPEN on precisely the
      // case CR-TRFZ-4 exists for, while still looking correct against the
      // module-load throw. This pin drives that exact mutant: a suite that failed
      // with NO message and only skips must STILL be named.
      expect(uncollectedOf({
        testResults: [{
          name: 'tests/only.test.js',
          status: 'failed',
          message: '',
          assertionResults: [{ fullName: 'x', status: 'skipped' }],
        }],
      }, ROOT)).toEqual(['tests/only.test.js']);
    });

    test('the scope floor ratio is a real fraction below 1 (a ratio of 0 disables the guard)', () => {
      expect(SCOPE_FLOOR_RATIO).toBeGreaterThan(0.5);
      expect(SCOPE_FLOOR_RATIO).toBeLessThan(1);
    });
  });
});
