/**
 * soakRegister.test.js — SOAKCHAIN Car 4's proof surface (DESIGN_HORIZON §1.6, §4.5).
 *
 * ⛔ THE ARM THAT MATTERS IS THE GROWTH DOOR, EXERCISED IN A REAL GIT REPOSITORY. The
 * design's own `SOAK_REGISTER_ALLOW_DEBT` clause was an env var plus a free-text note,
 * listed in a CLI parenthesis and defined nowhere — the weakest of the estate's four growth
 * doors, and enough to let a runaway be banked BY NOTE, which is the exact class this
 * register exists to refuse. Every refusal below is executed against a temporary git repo
 * with real commits, because a dirty-tree refusal that never met a dirty tree is a claim
 * rather than a guard.
 *
 * ⛔ NO SHORT REAL RUN THROUGH THE RUNNER. §4.5 forbids it by name: adding a `--years`
 * override to make a 300-year profile testable would thin the instrument itself. THE FIRST
 * SCHEDULED RUN IS THE INTEGRATION PROOF, and what is proven here is everything that can be
 * proven without one — the plan, the argv, the shapes, the comparisons, and the door.
 */

import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, test } from 'vitest';

import {
  FIGURE_DIRECTIONS,
  REGISTER_FINDING_KINDS,
  REGISTER_VERSION,
  SETTLEMENT_SHAPES,
  cellKeyOf,
  compareRegister,
  deriveRegisterFigures,
  mintRefusals,
  settlementShapeOf,
} from '../../scripts/soak/register.mjs';
import { evaluateReceipt } from '../../scripts/soak/evaluate.mjs';
import { buildRealmScalePlan, soakArgsFor } from '../../scripts/audit/realm-scale-certification.mjs';
// ⭐ THE MOTION FLOOR, IMPORTED (§909 car 3). This fixture's `motion` block is DERIVED from
// its own series at the very bar `behavioral-observation.mjs` counts at, so a shape planted
// here and a shape the observer writes cannot mean two different things.
import { MOTION_FLOOR_01 } from '../../scripts/audit/soakInvariants.mjs';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const CLI = join(ROOT, 'scripts/soak/soak-register.mjs');
const REGISTER = join(ROOT, 'tests/soak-harness/.soak-register.json');
const WORKFLOW = join(ROOT, '.github/workflows/soak-research.yml');

const IDS = ['soak-a', 'soak-b', 'soak-c', 'soak-d'];
const HORIZON = 301;

/**
 * A synthetic 300-year receipt in the watchdog's own shape. `shape` names what each
 * settlement's series should do, so a test can move one figure and nothing else.
 */
function researchReceipt({
  caseId = 'research-lit-4s-300y-4s-seed1',
  shapes = ['plateau', 'plateau', 'plateau', 'plateau'],
  lit = true,
  // ⛔ THE REALM READING, AS A LIT RUN ACTUALLY SHIPS IT (§909 car 2). `observeRealmDemography`
  // returns non-null on exactly the worlds whose demographic term is running, so a LIT
  // receipt from `whole-world-soak.mjs` always carries this key on every yearly row —
  // measured on the real 300-year `research-lit-4s` receipt and on a fresh lit 30-year run.
  // This fixture claimed `lit` and carried no reading, which is a shape the writer cannot
  // produce; `capacity_realm_load` therefore read a silent clean off it. Defaulting it TRUE
  // makes the fixture the writer's shape again, and `realmReading: false` reconstructs the
  // pre-P4 shape so the door's refusal can be proved rather than assumed.
  realmReading = true,
  // ⛔ THE MOTION BLOCK, AS EVERY RECEIPT SINCE `37459391a` (2026-07-28) SHIPS IT (§909 car
  // 3). `capacity_envelope_30y` stands on it, so a fixture without it makes that row
  // NOT-EXECUTABLE and the mint door refuse. `motionReading: false` reconstructs the
  // pre-`37459391a` shape so the door's refusal is proved rather than assumed.
  motionReading = true,
} = {}) {
  const seriesFor = (shape, base) => {
    const out = [];
    for (let year = 0; year < HORIZON; year += 1) {
      if (shape === 'runaway') out.push(Math.round(base * (1.07 ** year)));
      else if (shape === 'floored') out.push(year < 100 ? base : Math.round(base * 0.1));
      else out.push(base + ((year % 3) - 1));
    }
    return out;
  };
  const series = shapes.map((shape, index) => seriesFor(shape, 400 + (index * 100)));
  const yearly = [];
  for (let year = 0; year < HORIZON; year += 1) {
    const stateVectors = {};
    IDS.forEach((id, index) => { stateVectors[id] = { population: series[index][year] }; });
    const eventTypeCounts = {};
    for (let n = 0; n < 12; n += 1) eventTypeCounts[`type_${(year * 12) + n}`] = 3;
    // ⛔ DERIVED, NEVER TYPED — AND DERIVED THE WAY THE OBSERVER DERIVES IT (corrected at
    // §909 car 5; the claim this comment used to make was false against every real receipt).
    // `behavioral-observation.mjs` counts ONE transition per settlement present in both the
    // BEFORE-state and the AFTER-state OF THAT YEAR: it walks the after-map and skips only a
    // settlement with no `previous` entry — a world founded mid-year, not a first year. So
    // year 1 is NOT exempt. Measured on all three receipts this lane wrote,
    // `behavioral.yearly[0].year === 1` carries `populationTransitions: 4`, and ZERO rows
    // carry zero transitions in 30 years or in 300. The old note here said year 1 "carries
    // zero transitions — exactly what the observer produces", which was the fixture
    // inventing a shape the writer does not produce: M1-F1's own lesson, inverted.
    //
    // This fixture holds no head count earlier than its own year 1, so year 1's before-state
    // IS its year-1 value: four transitions, none of them moved. That is the only derivation
    // its own numbers support, and it is the conservative one — it can lower the moved share
    // and never raise it.
    const motion = { populationTransitions: 0, populationMoved: 0 };
    for (const row of series) {
      const before = row[Math.max(0, year - 1)];
      const after = row[year];
      motion.populationTransitions += 1;
      if (Math.abs(after - before) / Math.max(1, before) >= MOTION_FLOOR_01) motion.populationMoved += 1;
    }
    yearly.push({
      year: year + 1,
      majorEventCount: 4,
      eventTypeCounts,
      stateVectors,
      ...(motionReading ? { motion } : {}),
      // Inside the row's own band on both clauses (load in [0.6, 1.05]; the binding census
      // accounts for all four settlements), so the fixture stays CLEAN and this key adds an
      // instrument rather than a finding.
      ...(realmReading && lit
        ? { realmDemography: { loadRatio01: 0.82, binding: { granary: 2, walls: 2 } } }
        : {}),
    });
  }
  return {
    schemaVersion: 5,
    kind: 'whole_world_soak',
    caseId,
    seed: 'realm-scale-research-lit-4s-300y-4s-seed1',
    years: HORIZON,
    settlements: IDS.length,
    passed: true,
    properties: ['no_crash', 'rerun_identical', 'seed_divergent', 'population_bounded'],
    failures: [],
    notExecutable: [],
    yearlyHashes: Array.from({ length: HORIZON }, (_, year) => `hash-${year}`),
    startPopulations: series.map((row) => row[0]),
    finalPopulations: series.map((row) => row[HORIZON - 1]),
    finalDiedFlags: series.map(() => false),
    stressorCounts: [1, 0, 1],
    yearlyBytes: [100_000, 110_000, 120_000],
    yearlyRealmBytes: Array.from({ length: HORIZON }, (_, year) => 200_000 + (year * 10)),
    yearlyMs: [100, 110, 120, 130],
    peakHeapUsedBytes: 400 * 1024 * 1024,
    runDurationsMs: { primary: 8_400_000, replay: null, divergent: null },
    subsystems: { rules: { demographicsEnabled: lit } },
    behavioral: { settlementIds: IDS, yearly },
    liveness: {
      executable: true,
      reason: '',
      rows: [],
      failures: [],
      reported: {
        minDistinctTypesPerDecade: 120,
        minEventsPerSettlementDecade: 90,
        minHashMovesPerDecade: 10,
        minMajorsPerDecade: 4,
        majorSilentDecades: 0,
        majorSilentDecadeNumbers: [],
      },
    },
  };
}

/**
 * THE SAME RECEIPT AS THE WRITER SHIPS IT — the two capacity fields derived from the
 * fixture's OWN state vectors, so nothing is invented.
 *
 * ⛔⛔ THE SERIES LANDED AT §909 CAR 1, AND THIS HELPER STAYS ANYWAY — the old note here
 * said it would "become the identity function and should be deleted" once
 * `whole-world-soak.mjs` shipped `yearlyPopulations` / `yearlyDiedFlags`, and that reading
 * was half right. The writer ships them now (proved on a fresh 30-year receipt), but
 * `researchReceipt()` is SYNTHETIC and still does not, deliberately: the arm directly below
 * needs a receipt in the PRE-§909 shape to prove the mint door refuses a blind instrument,
 * and a helper that had become the identity function would leave that arm with no subject.
 * M1-F1's whole lesson is that a fixture which is the only writer of a shape makes a blind
 * row look green, so the blindness is asserted FIRST, against the bare `researchReceipt()`,
 * and this forward shape is used only where a DOOR is the subject: a door cannot be
 * exercised by a receipt the previous door already refused.
 */
const instrumentComplete = (receipt) => ({
  ...receipt,
  yearlyPopulations: receipt.behavioral.yearly.map((year) => IDS.map((id) => year.stateVectors[id].population)),
  yearlyDiedFlags: receipt.behavioral.yearly.map(() => IDS.map(() => false)),
});

const annotate = (receipt) => evaluateReceipt(receipt, { profile: 'research-lit-4s' }).annotated;
const measure = (receipt) => deriveRegisterFigures(annotate(receipt));

/** A temporary git repository carrying its own register, so the door meets a real tree. */
function gitFixture(register) {
  const dir = mkdtempSync(join(tmpdir(), 'soak-register-'));
  const run = (...args) => execFileSync('git', args, { cwd: dir, encoding: 'utf8' });
  run('init', '-q');
  run('config', 'user.email', 'fixture@example.invalid');
  run('config', 'user.name', 'Fixture');
  writeFileSync(join(dir, '.soak-register.json'), `${JSON.stringify(register, null, 2)}\n`);
  run('add', '.soak-register.json');
  run('commit', '-q', '-m', 'genesis register');
  return { dir, registerPath: join(dir, '.soak-register.json'), run };
}

/**
 * Run the register CLI and hand back its EXACT status. `spawnSync`, not `execFileSync`,
 * because this CLI exits non-zero by design on a write and on every refusal — a throw would
 * be the normal path here, and the status is the contract every caller reads.
 */
function runCliTolerant(args, env = {}) {
  const result = spawnSync(process.execPath, [CLI, ...args], {
    encoding: 'utf8',
    cwd: ROOT,
    env: { ...process.env, ...env },
  });
  return {
    status: result.status,
    stdout: String(result.stdout || ''),
    stderr: String(result.stderr || ''),
  };
}

/** A genesis register carrying ONE unfrozen cell, keyed as the estate's own file keys it. */
function genesisRegister(key = 'research-lit-4s/research-lit-4s-300y-4s-seed1') {
  return {
    registerVersion: REGISTER_VERSION,
    figureDirections: [...FIGURE_DIRECTIONS],
    cells: {
      [key]: {
        frozenAtSha: '',
        measuredBy: '',
        date: '',
        note: 'UNFROZEN GENESIS in a test fixture.',
        identity: { seed: '', years: 300, settlements: 4, lighting: { demographicsEnabled: true }, receiptSchemaVersion: 0, settlementIds: [] },
        figures: {},
      },
    },
  };
}

describe('the soak register — shapes, comparisons and the governed growth door', () => {
  test('settlementShapeOf classifies four synthetic century series, with an other control', () => {
    const compounding = Array.from({ length: HORIZON }, (_, year) => Math.round(100 * (1.07 ** year)));
    expect(settlementShapeOf(compounding)).toBe('runaway');
    // Flat at 301 after a fall from 723 — low against its start AND flat over fifty years.
    const fell = Array.from({ length: HORIZON }, (_, year) => (year < 150 ? 1723 : 301));
    expect(settlementShapeOf(fell)).toBe('floored');
    // Settling near a bound: the last century moves less than 5 % of the final value.
    const settling = Array.from({ length: HORIZON }, (_, year) => (year < 100 ? 200 + year : 300 + (year % 4)));
    expect(settlementShapeOf(settling)).toBe('plateau');
    expect(settlementShapeOf([0, 0, 0], { died: true })).toBe('died');
    // THE CONTROL: a series that is none of the four. Without it every arm above could be
    // passing on a classifier that answers the same word to everything.
    const wandering = Array.from({ length: HORIZON }, (_, year) => (year < 100 ? 100 : 100 + (year * 3)));
    expect(settlementShapeOf(wandering)).toBe('other');
    expect(SETTLEMENT_SHAPES).toEqual(['plateau', 'runaway', 'floored', 'died', 'other']);
    // A series shorter than a century cannot answer the question and says so.
    expect(settlementShapeOf([1, 2, 3])).toBe('other');
  }, 60_000);

  test('the derived figures name the world, the lighting and the shapes', () => {
    const measured = measure(researchReceipt());
    expect(measured.identity.lighting).toEqual({ demographicsEnabled: true });
    expect(measured.identity.settlementIds).toEqual(IDS);
    expect(measured.identity.years).toBe(HORIZON);
    expect(measured.figures['realm.runawayCount'].value).toBe(0);
    expect(measured.figures['realm.bifurcated'].value).toBe(0);
    expect(measured.figures['population.soak-a.shape'].value).toBe('plateau');
    expect(measured.figures['cost.peakHeapUsedBytes'].direction).toBe('ceiling');
    expect(measured.figures['cost.primaryMs'].direction).toBe('report');
    expect(measured.figures['bytes.realmBytesAtYear.300'].direction).toBe('band');
    // ⚠ THE LIGHTING IS MANDATORY (§4.7 R10): a shipped-preset run records the flag DARK, so
    // a lit figure can never masquerade as a shipped one.
    expect(measure(researchReceipt({ lit: false })).identity.lighting)
      .toEqual({ demographicsEnabled: false });
    // "It bifurcates" — the one sentence the tuning desk needs.
    const both = measure(researchReceipt({ shapes: ['runaway', 'floored', 'plateau', 'plateau'] }));
    expect(both.figures['realm.runawayCount'].value).toBe(1);
    expect(both.figures['realm.flooredCount'].value).toBe(1);
    expect(both.figures['realm.bifurcated'].value).toBe(1);
  }, 60_000);

  test('compareRegister convicts each direction in its own direction and nowhere else', () => {
    const cell = (direction, value, extra = {}) => ({ figures: { f: { direction, value, ...extra } } });
    const measured = (value) => ({ figures: { f: { value } } });
    expect(compareRegister(cell('shrink', 3), measured(4), { solo: true })[0].kind).toBe('grew');
    expect(compareRegister(cell('shrink', 3), measured(2), { solo: true })).toEqual([]);
    expect(compareRegister(cell('floor', 10), measured(9), { solo: true })[0].kind).toBe('fell_below_floor');
    expect(compareRegister(cell('floor', 10), measured(11), { solo: true })).toEqual([]);
    expect(compareRegister(cell('band', 100, { band: 0.10 }), measured(111), { solo: true })[0].kind).toBe('outside_band');
    expect(compareRegister(cell('band', 100, { band: 0.10 }), measured(110), { solo: true })).toEqual([]);
    expect(compareRegister(cell('band', 100, { band: 0.10 }), measured(89), { solo: true })[0].kind).toBe('outside_band');
    expect(compareRegister(cell('exact', 'plateau'), measured('runaway'), { solo: true })[0].kind).toBe('shape_changed');
    expect(compareRegister(cell('exact', 'plateau'), measured('plateau'), { solo: true })).toEqual([]);
    expect(compareRegister(cell('ceiling', 1, { ceiling: 100 }), measured(101), { solo: true })[0].kind).toBe('over_ceiling');
    expect(compareRegister(cell('ceiling', 1, { ceiling: 100 }), measured(99), { solo: true })).toEqual([]);
    // `report` never fails, however far it moves.
    expect(compareRegister(cell('report', 1), measured(999_999), { solo: true })).toEqual([]);
    // A figure that stopped being measured is not a figure that improved.
    expect(compareRegister(cell('shrink', 3), { figures: {} }, { solo: true })[0].kind).toBe('missing');
    // ⛔ SK-2A: a CEILING is evaluated ONLY on a solo run. Eight pooled workers sharing
    // memory bandwidth would convict a cell for the company it kept.
    expect(compareRegister(cell('ceiling', 1, { ceiling: 100 }), measured(101))).toEqual([]);
    expect(REGISTER_FINDING_KINDS).toEqual([
      'grew', 'fell_below_floor', 'outside_band', 'shape_changed', 'over_ceiling', 'missing',
    ]);
  }, 60_000);

  test('a receipt that is not clean can never mint a cell', () => {
    // §13 C7: a cell designed to fail `population_bounded` — the DARK twin — cannot mint.
    expect(mintRefusals(annotate(instrumentComplete(researchReceipt())))).toEqual([]);

    // ⛔⛔ AND A BLIND INSTRUMENT CANNOT MINT EITHER (M1-F1). The receipt in the WRITER'S
    // OWN SHAPE — no `yearlyPopulations`, no `yearlyDiedFlags`, exactly what
    // `whole-world-soak.mjs` has always written — leaves two DETERMINISTIC capacity rows
    // unable to run. Before the third channel existed they answered `[]`, the run graded
    // `fullInstrument: true`, and the door would have banked a 300-year curve certified by
    // detectors that never executed. The door now refuses, and names which rows went dark.
    const blind = mintRefusals(annotate(researchReceipt()));
    expect(blind).toContain('not the FULL instrument at build-complete-dark');
    expect(blind.some((line) => line.includes('capacity_plateau') && line.includes('capacity_floor_thaw')))
      .toBe(true);
    expect(blind.some((line) => line.includes('receipt.yearlyPopulations'))).toBe(true);
    // …and it is the ABSENCE that refuses, not the capacity rows themselves: plant the two
    // fields the writer does not yet ship and the very same receipt mints.
    expect(mintRefusals(annotate(instrumentComplete(researchReceipt())))).toEqual([]);

    // ⛔⛔ AND THE NESTED BLINDNESS REFUSES THE SAME DOOR (§909 car 2). A LIT receipt whose
    // last observed year carries no `realmDemography` left `capacity_realm_load` unable to
    // run — and, until the path was declared, silently clean. The door must refuse that
    // receipt for the same reason it refuses the two series rows, and must NAME the path.
    const nestedBlind = mintRefusals(annotate(instrumentComplete(researchReceipt({ realmReading: false }))));
    expect(nestedBlind).toContain('not the FULL instrument at build-complete-dark');
    expect(nestedBlind.some((line) => line.includes('capacity_realm_load')
      && line.includes('receipt.behavioral.yearly[last].realmDemography'))).toBe(true);
    // ⚠ AND THE DARK TWIN IS NOT REFUSED FOR IT — the gate is read before the requirement,
    // so a legitimately dark cell is NOT APPLICABLE and this door never sees the row.
    expect(mintRefusals(annotate(instrumentComplete(researchReceipt({ lit: false }))))
      .some((line) => line.includes('capacity_realm_load'))).toBe(false);

    // ⛔⛔ AND THE FOURTH ROW REFUSES THE SAME DOOR (§909 car 3). A receipt with no `motion`
    // block at all — the shape every receipt written before `37459391a` carries — leaves
    // `capacity_envelope_30y` unable to run, and the door must name the path rather than
    // bank a 300-year curve certified by a detector that never executed.
    const motionBlind = mintRefusals(annotate(instrumentComplete(researchReceipt({ motionReading: false }))));
    expect(motionBlind).toContain('not the FULL instrument at build-complete-dark');
    expect(motionBlind.some((line) => line.includes('capacity_envelope_30y')
      && line.includes('receipt.behavioral.yearly[last].motion'))).toBe(true);

    expect(mintRefusals({ ...annotate(researchReceipt()), passed: false }))
      .toContain('the run did not pass — a register cell is minted from a clean run or not at all');
    expect(mintRefusals({ ...annotate(researchReceipt()), deterministicFirings: 2 }))
      .toContain('a deterministic-class tripwire fired — the run is not clean');
    expect(mintRefusals({ ...annotate(researchReceipt()), rolling: true }))
      .toContain('a rolling run is additive and never freezes');
    expect(mintRefusals({ ...annotate(researchReceipt()), restored: true }))
      .toContain('a restored run computes no official figure');
    expect(mintRefusals({ ...annotate(researchReceipt()), fullInstrument: false }))
      .toContain('not the FULL instrument at build-complete-dark');
  }, 60_000);

  test('the committed register is UNFROZEN genesis, and --compare reports that positively', () => {
    const register = JSON.parse(readFileSync(REGISTER, 'utf8'));
    expect(register.registerVersion).toBe(REGISTER_VERSION);
    expect(register.figureDirections).toEqual([...FIGURE_DIRECTIONS]);
    expect(Object.keys(register.cells).sort()).toEqual([
      'research-lit-4s/research-lit-4s-300y-4s-seed1',
      'research-lit/research-lit-300y-12s-seed1',
    ]);
    // NO LEDGER FIGURE IS EVER TYPED IN: both cells are empty and await their first clean run.
    for (const key of Object.keys(register.cells)) {
      expect(register.cells[key].figures, `${key} carries pre-typed figures`).toEqual({});
      expect(register.cells[key].frozenAtSha).toBe('');
      expect(register.cells[key].identity.lighting).toEqual({ demographicsEnabled: true });
      expect(cellKeyOf({ profile: key.split('/')[0], caseId: key.split('/')[1] })).toBe(key);
    }
    const dir = mkdtempSync(join(tmpdir(), 'soak-compare-'));
    const receiptPath = join(dir, 'receipt.json');
    writeFileSync(receiptPath, `${JSON.stringify(instrumentComplete(researchReceipt()))}\n`);
    const proposal = join(dir, 'proposal.json');
    const run = runCliTolerant([
      '--compare', '--register', REGISTER, '--receipt', receiptPath,
      '--profile', 'research-lit-4s', '--propose', proposal,
    ]);
    expect(run.status).toBe(0);
    expect(run.stdout).toContain('NOT-EXECUTABLE  research-lit-4s/research-lit-4s-300y-4s-seed1 — the cell is UNFROZEN genesis');
    expect(run.stdout).toContain('the FIRST clean run is the freeze act');
    const written = JSON.parse(readFileSync(proposal, 'utf8'));
    expect(written.kind).toBe('soak_register_proposal');
    expect(written.mintRefusals).toEqual([]);
    expect(Object.keys(written.figures).length).toBeGreaterThan(10);
  }, 60_000);

  test('the growth door refuses a dirty tree, an undeclared move, and an ungoverned debt', () => {
    const key = 'research-lit-4s/research-lit-4s-300y-4s-seed1';
    const { dir, registerPath, run: git } = gitFixture(genesisRegister(key));
    const receiptPath = join(dir, 'clean-receipt.json');
    writeFileSync(receiptPath, `${JSON.stringify(instrumentComplete(researchReceipt()))}\n`);
    const base = ['--register', registerPath, '--repo', dir, '--profile', 'research-lit-4s'];
    const seat = { SOAK_REGISTER_REFREEZE: 'Opus 5 (lane INSTR-SOAK)' };
    const note = { SOAK_REGISTER_NOTE: 'the first clean research run freezes this cell' };

    // ⛔ A DIRTY TREE, MET RATHER THAN DESCRIBED. `frozenAtSha` would name a state that
    // never existed, so the write is refused with the offending line quoted.
    const dirtyRun = runCliTolerant(['--write', ...base, '--receipt', receiptPath], { ...seat, ...note });
    expect(dirtyRun.status).toBe(2);
    expect(dirtyRun.stderr).toContain('the tree is DIRTY');
    expect(dirtyRun.stderr).toContain('clean-receipt.json');

    // A signed refreeze needs a seat AND a note; neither is optional.
    git('add', '-A'); git('commit', '-q', '-m', 'the receipt');
    expect(runCliTolerant(['--write', ...base, '--receipt', receiptPath], note).status).toBe(2);
    expect(runCliTolerant(['--write', ...base, '--receipt', receiptPath], seat).status).toBe(2);

    // THE FIRST CLEAN RUN IS THE FREEZE ACT — and it exits NON-ZERO BY DESIGN.
    const minted = runCliTolerant(['--write', ...base, '--receipt', receiptPath], { ...seat, ...note });
    expect(minted.status).toBe(1);
    expect(minted.stdout).toContain('EXIT 1 BY DESIGN: the register moved.');
    const frozen = JSON.parse(readFileSync(registerPath, 'utf8'));
    expect(frozen.cells[key].frozenAtSha).toMatch(/^[0-9a-f]{40}$/);
    expect(frozen.cells[key].measuredBy).toBe('Opus 5 (lane INSTR-SOAK)');
    expect(frozen.cells[key].figures['realm.runawayCount'].value).toBe(0);

    // The plain --compare is the evidence, and it is green against the same run.
    git('add', '-A'); git('commit', '-q', '-m', 'freeze');
    const after = runCliTolerant(['--compare', ...base, '--receipt', receiptPath, '--solo']);
    expect(after.status).toBe(0);
    expect(after.stdout).toContain('OK — every committed figure holds');

    // ── THE RUNAWAY ARRIVES, AND IS NOW REFUSED BY THE FIRST DOOR ──────────────
    const worsePath = join(dir, 'worse-receipt.json');
    writeFileSync(worsePath, `${JSON.stringify(instrumentComplete(researchReceipt({ shapes: ['runaway', 'plateau', 'plateau', 'plateau'] })))}\n`);
    git('add', '-A'); git('commit', '-q', '-m', 'the worse receipt');
    const convicted = runCliTolerant(['--compare', ...base, '--receipt', worsePath, '--solo']);
    expect(convicted.status).toBe(1);
    expect(convicted.stdout).toContain('grew · realm.runawayCount 0 → 1 (shrink-only)');
    expect(convicted.stdout).toContain('shape_changed · population.soak-a.shape');

    // ⛔⛔ AND THE TWO DOORS ARE ORDERED, WHICH M1-F1's CURE MADE VISIBLE. `capacity_plateau`
    // now SEES this series and convicts it, so the write is refused at the TRIPWIRE door and
    // never reaches the declaration door at all. Before the cure the runaway was invisible
    // to every tripwire and walked straight through to the charter question — which is to
    // say the growth door's debt path was reachable only because the instrument was blind.
    // A runaway can no longer be banked by note under any charter, and that is the right
    // answer; the arms below therefore price a figure that moves without the world breaking.
    const runawayWrite = runCliTolerant(['--write', ...base, '--receipt', worsePath], { ...seat, ...note });
    expect(runawayWrite.status).toBe(2);
    // The ORDERING, read off one stderr: the tripwire door's refusal is present (the anchor,
    // proving the run reached and failed that door) and the declaration door's prompt never
    // appears. A stderr that drifted empty now reds on the anchor rather than passing here.
    expectAbsentWithAnchor(runawayWrite.stderr, 'SOAK_REGISTER_DECLARED',
      'a deterministic-class tripwire fired — the run is not clean',
      'the tripwire door refuses before the declaration door is reached');

    // ── A FIGURE MOVES WITHOUT THE WORLD BREAKING ─────────────────────────────
    // The liveness FLOOR the run reported, lowered. No tripwire grades `liveness.reported`
    // (the `liveness_floor` row folds live from the behavioural counts and cross-checks only
    // `liveness.failures`), so this receipt is tripwire-clean AND carries a debt figure.
    const debtPath = join(dir, 'debt-receipt.json');
    const debtReceipt = instrumentComplete(researchReceipt());
    debtReceipt.liveness = {
      ...debtReceipt.liveness,
      reported: { ...debtReceipt.liveness.reported, minDistinctTypesPerDecade: 60 },
    };
    writeFileSync(debtPath, `${JSON.stringify(debtReceipt)}\n`);
    git('add', '-A'); git('commit', '-q', '-m', 'the debt receipt');
    const fell = runCliTolerant(['--compare', ...base, '--receipt', debtPath, '--solo']);
    expect(fell.status).toBe(1);
    expect(fell.stdout).toContain('fell_below_floor · liveness.minDistinctTypesPerDecade 120 → 60 (floor)');

    // An UNDECLARED move is refused and NAMED — silence never banks a figure.
    const undeclared = runCliTolerant(['--write', ...base, '--receipt', debtPath], { ...seat, ...note });
    expect(undeclared.status).toBe(2);
    expect(undeclared.stderr).toContain('were not declared in SOAK_REGISTER_DECLARED');
    expect(undeclared.stderr).toContain('liveness.minDistinctTypesPerDecade');

    // ⛔ DECLARED IS NOT ENOUGH. An env var plus free text is how a regression gets banked by
    // note; a floor figure moving DOWN costs a charter.
    const declaredFigures = [...fell.stdout.matchAll(/· (?:grew|fell_below_floor|shape_changed|outside_band) · ([\w.-]+)/g)]
      .map((match) => match[1]);
    expect(declaredFigures).toEqual(['liveness.minDistinctTypesPerDecade']);
    const declared = { SOAK_REGISTER_DECLARED: declaredFigures.join(',') };
    const noCharter = runCliTolerant(['--write', ...base, '--receipt', debtPath], { ...seat, ...note, ...declared });
    expect(noCharter.status).toBe(2);
    expect(noCharter.stderr).toContain('no --charter=§NNN was given');
    expect(noCharter.stderr).toContain('banked by note');

    // …and a charter with a thin note is refused too: the note IS the audit trail.
    const thin = runCliTolerant(
      ['--write', ...base, '--receipt', debtPath, '--charter=§882'],
      { ...seat, ...declared, SOAK_REGISTER_NOTE: 'too short' },
    );
    expect(thin.status).toBe(2);
    expect(thin.stderr).toContain('at least 60 characters');

    // With both, the debt is banked AND recorded forever.
    const longNote = 'SOAK-4 accept the honest red: the lit run reported a thinner liveness floor and the tuning sitting will price it';
    const banked = runCliTolerant(
      ['--write', ...base, '--receipt', debtPath, '--charter=§882'],
      { ...seat, ...declared, SOAK_REGISTER_NOTE: longNote },
    );
    expect(banked.status).toBe(1);
    expect(banked.stdout).toContain('banked in the WRONG direction under §882');
    const withDebt = JSON.parse(readFileSync(registerPath, 'utf8'));
    expect(withDebt.cells[key].debtHistory).toHaveLength(1);
    expect(withDebt.cells[key].debtHistory[0]).toMatchObject({
      figure: 'liveness.minDistinctTypesPerDecade', from: 120, to: 60, charter: '§882', seat: 'Opus 5 (lane INSTR-SOAK)',
    });

    // ⭐ AND EVERY LATER COMPARE PRINTS IT. The debt population is a shrink-only record: a
    // reader sees which numbers were allowed to get worse without any archaeology.
    git('add', '-A'); git('commit', '-q', '-m', 'banked');
    const later = runCliTolerant(['--compare', ...base, '--receipt', debtPath, '--solo']);
    expect(later.status).toBe(0);
    expect(later.stdout).toContain('HOLD: 1 figure(s) have been banked in the wrong direction');
    expect(later.stdout).toContain('liveness.minDistinctTypesPerDecade 120 → 60 (§882, Opus 5 (lane INSTR-SOAK)');
  }, 120_000);

  test('the two lit profiles plan a 300-year case that carries its lighting into the child argv', () => {
    const interim = buildRealmScalePlan('research-lit-4s');
    expect(interim.cases).toHaveLength(1);
    expect(interim.cases[0].id).toBe('research-lit-4s-300y-4s-seed1');
    expect(interim.cases[0]).toMatchObject({ years: 300, settlements: 4, lighting: { demographicsEnabled: true } });
    const full = buildRealmScalePlan('research-lit');
    expect(full.cases).toHaveLength(1);
    expect(full.cases[0].id).toBe('research-lit-300y-12s-seed1');
    expect(full.cases[0]).toMatchObject({ years: 300, settlements: 12, lighting: { demographicsEnabled: true } });
    // §141: what shrinks to fit a hosted job is the SETTLEMENT COUNT, labelled. The horizon
    // is 300 on both, and shortened horizons are refused by name.
    expect([interim.cases[0].years, full.cases[0].years]).toEqual([300, 300]);
    // ⭐ THE ARGV, PINNED WITHOUT EXECUTING A SOAK (§145.2 forbids the alternative).
    const args = soakArgsFor(interim.cases[0], '/tmp/case.json');
    expect(args).toContain('--lighting');
    expect(args[args.indexOf('--lighting') + 1]).toBe('demographicsEnabled=true');
    expect(args).toEqual(expect.arrayContaining(['--years', '300', '--settlements', '4']));
    // The unlit profiles are untouched and carry NO lighting flag at all.
    const weekly = buildRealmScalePlan('weekly');
    expect(Object.prototype.hasOwnProperty.call(weekly.cases[0], 'lighting')).toBe(false);
    expect(soakArgsFor(weekly.cases[0], '/tmp/case.json').includes('--lighting')).toBe(false);
    // The release probes keep their behavioural controls through the same pure function.
    const release = buildRealmScalePlan('release');
    const withDark = release.cases.find((entry) => entry.behavioralControls?.dark);
    expect(soakArgsFor(withDark, '/tmp/case.json')).toEqual(expect.arrayContaining(['--dark-control', '--neighbor-control-years', '30']));
  }, 60_000);

  test('the research workflow carries every pin the ci.yml-only conventions would have given it', () => {
    const workflow = readFileSync(WORKFLOW, 'utf8');
    // The one ci.yml-only pin this file escapes by living outside `ciCheckParity`, re-asserted.
    expect(workflow).toContain("node-version-file: '.nvmrc'");
    expect(workflow).toContain('# deploy-gate: optional');
    expect(workflow).toContain('timeout-minutes: 360');
    expect(workflow).toContain('retention-days: 90');
    expect(workflow).toContain("cron: '0 2 * * 6'");
    expect(workflow).toContain('workflow_dispatch:');
    expect(workflow).toContain("runs-on: ${{ vars.SOAK_RESEARCH_RUNNER || 'ubuntu-latest' }}");
    expect(workflow).toContain('--max-old-space-size=6144');
    expect(workflow).toContain('soak-research-${{ github.sha }}');
    expect(workflow).toContain('node scripts/soak/soak-register.mjs --compare --aggregate');
    expect(workflow).toContain('node scripts/soak/evaluate-receipt.mjs --aggregate artifacts/soak/research.json');
    // A PLANTED MUTATION PER PIN, on an in-memory copy — without it these are ten assertions
    // that a long string contains ten short ones, which any similar file would satisfy.
    const mutations = [
      ["node-version-file: '.nvmrc'", "node-version: '20'"],
      ['timeout-minutes: 360', 'timeout-minutes: 60'],
      ['retention-days: 90', 'retention-days: 7'],
      ["cron: '0 2 * * 6'", "cron: '0 2 * * 1'"],
      ['--max-old-space-size=6144', '--max-old-space-size=2048'],
    ];
    const survivors = mutations.filter(([from, to]) => workflow.replace(from, to).includes(from));
    expect(survivors).toEqual([]);
    // ⛔ THE REGISTER IS NEVER WRITTEN BY CI. It proposes; the chair mints on a clean tree.
    expect(workflow.includes('soak-register.mjs --write')).toBe(false);
    // Both readers run on a FAILED soak — the run whose findings matter most.
    expect(workflow.split('if: always()').length - 1).toBeGreaterThanOrEqual(3);
  }, 60_000);
});
