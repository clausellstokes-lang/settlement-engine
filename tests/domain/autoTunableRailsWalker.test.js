/**
 * autoTunableRailsWalker.test.js — the §10 STRUCTURAL RAIL guard. The design demands the
 * lane-A/lane-B boundary be "structurally impossible to cross, not just documented." These
 * tests are that enforcement: they fail the GATE if a golden-/same-seed-shifting constant
 * could ever enter the auto-apply lane.
 *
 * Three layers under test:
 *   1. the ratified registry ships empty + valid (nothing auto-applies on deploy);
 *   2. the entry validator REJECTS any sim/generation surface or seeded-pipeline module
 *      (a golden-shifting constant cannot be represented as a valid entry) and requires
 *      range+step+envelope (§10: "cannot become auto-tunable without range+step+envelope");
 *   3. the classifier forces lane B on anything golden-shifting, unregistered, un-soaked,
 *      or out of range/step — belt-and-suspenders over the registry.
 */
import { describe, it, expect } from 'vitest';
import {
  AUTO_TUNABLE,
  AUTO_TUNABLE_REGISTRY_VERSION,
  SAFE_SURFACES,
  validateRegistryEntry,
  assertValidRegistry,
} from '../../src/domain/tuning/autoTunableRegistry.js';
import {
  classifyTuningProposal, LANE_A, LANE_B,
} from '../../src/domain/tuning/laneClassifier.js';
import {
  ingestRollups, diagnose, runWeeklyTuningJob,
} from '../../src/domain/tuning/weeklyTuningJob.js';

// A well-formed display/rollup-side entry (the ONLY class that may ever be ratified).
const GOOD_ENTRY = {
  id: 'display_salience_threshold',
  module: 'src/domain/display/tradePressure.js',
  surface: 'display',
  range: [0, 1],
  maxStepPerWeek: 0.05,
  requiredGreenEnvelopes: ['distributionEnvelopes'],
};

describe('the ratified registry ships empty + valid', () => {
  it('AUTO_TUNABLE is an empty, frozen list (lane A is empty on deploy)', () => {
    expect(Array.isArray(AUTO_TUNABLE)).toBe(true);
    expect(AUTO_TUNABLE).toHaveLength(0);
    expect(Object.isFrozen(AUTO_TUNABLE)).toBe(true);
    expect(AUTO_TUNABLE_REGISTRY_VERSION).toBe(1);
  });
  it('assertValidRegistry passes on the shipped (empty) registry', () => {
    expect(() => assertValidRegistry(AUTO_TUNABLE)).not.toThrow();
  });
  it('every ratified entry is valid (walker over whatever is ratified)', () => {
    for (const entry of AUTO_TUNABLE) {
      const { ok, reasons } = validateRegistryEntry(entry);
      expect(ok, `${entry.id}: ${reasons.join('; ')}`).toBe(true);
    }
  });
});

describe('the structural boundary — a golden-shifting constant cannot be registered', () => {
  it('rejects a seeded-pipeline module (worldPulse) — the golden-shift guard', () => {
    const { ok, reasons } = validateRegistryEntry({ ...GOOD_ENTRY, module: 'src/domain/worldPulse/seasons.js' });
    expect(ok).toBe(false);
    expect(reasons.join(' ')).toMatch(/seeded pipeline/i);
  });
  it('rejects a spatial-mover module', () => {
    expect(validateRegistryEntry({ ...GOOD_ENTRY, module: 'src/domain/spatial/migration.js' }).ok).toBe(false);
  });
  it('rejects a generator module', () => {
    expect(validateRegistryEntry({ ...GOOD_ENTRY, module: 'src/generators/generateSettlementPipeline.js' }).ok).toBe(false);
  });
  it("rejects a 'sim' / 'generation' surface (only display/rollup/analytics allowed)", () => {
    expect(validateRegistryEntry({ ...GOOD_ENTRY, surface: 'sim' }).ok).toBe(false);
    expect(validateRegistryEntry({ ...GOOD_ENTRY, surface: 'generation' }).ok).toBe(false);
    expect(SAFE_SURFACES).toEqual(['display', 'rollup', 'analytics']);
  });
  it('assertValidRegistry THROWS if a sim entry is ever added (fails the gate)', () => {
    expect(() => assertValidRegistry([{ ...GOOD_ENTRY, module: 'src/domain/worldPulse/seasons.js' }])).toThrow(/seeded pipeline/i);
  });
});

describe('§10 "cannot become auto-tunable without range+step+envelope"', () => {
  it('rejects a missing range', () => {
    const { range, ...noRange } = GOOD_ENTRY; void range;
    expect(validateRegistryEntry(noRange).ok).toBe(false);
  });
  it('rejects a missing max-step-per-week', () => {
    const { maxStepPerWeek, ...noStep } = GOOD_ENTRY; void maxStepPerWeek;
    expect(validateRegistryEntry(noStep).ok).toBe(false);
  });
  it('rejects a step larger than the whole range', () => {
    expect(validateRegistryEntry({ ...GOOD_ENTRY, maxStepPerWeek: 5 }).ok).toBe(false);
  });
  it('rejects empty required-green envelopes', () => {
    expect(validateRegistryEntry({ ...GOOD_ENTRY, requiredGreenEnvelopes: [] }).ok).toBe(false);
  });
  it('ACCEPTS a well-formed display/rollup-side entry (the positive control)', () => {
    expect(validateRegistryEntry(GOOD_ENTRY).ok).toBe(true);
  });
});

describe('lane classifier', () => {
  const registry = [GOOD_ENTRY];
  const greenSoak = { green: true, shiftsGolden: false };

  it('a golden-shifting proposal is ALWAYS lane B (the GOLDEN LAW)', () => {
    const r = classifyTuningProposal({ id: GOOD_ENTRY.id, currentValue: 0.5, proposedValue: 0.52, soak: { green: true, shiftsGolden: true } }, registry);
    expect(r.lane).toBe(LANE_B);
    expect(r.reasons.join(' ')).toMatch(/GOLDEN LAW/);
  });
  it('an unregistered constant is lane B', () => {
    expect(classifyTuningProposal({ id: 'FAMINE_PRESSURE_K', currentValue: 0.42, proposedValue: 0.40, soak: greenSoak }, registry).lane).toBe(LANE_B);
  });
  it('a registered + green + in-range + in-step proposal is lane A', () => {
    expect(classifyTuningProposal({ id: GOOD_ENTRY.id, currentValue: 0.50, proposedValue: 0.52, soak: greenSoak }, registry).lane).toBe(LANE_A);
  });
  it('a registered proposal whose soak is not green is lane B', () => {
    expect(classifyTuningProposal({ id: GOOD_ENTRY.id, currentValue: 0.50, proposedValue: 0.52, soak: { green: false } }, registry).lane).toBe(LANE_B);
  });
  it('an un-soaked proposal is lane B (cannot auto-apply without a green soak)', () => {
    expect(classifyTuningProposal({ id: GOOD_ENTRY.id, currentValue: 0.50, proposedValue: 0.52 }, registry).lane).toBe(LANE_B);
  });
  it('an out-of-range proposal is lane B', () => {
    expect(classifyTuningProposal({ id: GOOD_ENTRY.id, currentValue: 0.50, proposedValue: 1.5, soak: greenSoak }, registry).lane).toBe(LANE_B);
  });
  it('a step larger than max-step-per-week is lane B', () => {
    expect(classifyTuningProposal({ id: GOOD_ENTRY.id, currentValue: 0.10, proposedValue: 0.90, soak: greenSoak }, registry).lane).toBe(LANE_B);
  });
  it('a monotone up-only entry rejects a decrease', () => {
    const upOnly = [{ ...GOOD_ENTRY, monotoneDir: 'up' }];
    expect(classifyTuningProposal({ id: GOOD_ENTRY.id, currentValue: 0.50, proposedValue: 0.48, soak: greenSoak }, upOnly).lane).toBe(LANE_B);
    expect(classifyTuningProposal({ id: GOOD_ENTRY.id, currentValue: 0.50, proposedValue: 0.52, soak: greenSoak }, upOnly).lane).toBe(LANE_A);
  });

  // ── M16 (cycle-3): the GOLDEN-LAW gate fails CLOSED ──────────────────────────
  // An otherwise-perfect proposal (registered, in-range, in-step) whose soak did NOT
  // affirmatively prove golden-safety must NOT auto-apply. The old `=== true` guard
  // let a truthy-but-non-boolean shiftsGolden — or an omitted field — slip through.
  it('a TRUTHY-but-non-boolean shiftsGolden is lane B (fail-closed, was fail-open)', () => {
    for (const bad of ['yes', 1, {}, 'true']) {
      const r = classifyTuningProposal(
        { id: GOOD_ENTRY.id, currentValue: 0.50, proposedValue: 0.52, soak: { green: true, shiftsGolden: bad } }, registry);
      expect(r.lane, `shiftsGolden=${JSON.stringify(bad)} must be lane B`).toBe(LANE_B);
      expect(r.reasons.join(' ')).toMatch(/GOLDEN LAW/);
    }
  });
  it('a green + in-range soak that OMITS shiftsGolden is lane B (not proven golden-safe)', () => {
    const r = classifyTuningProposal(
      { id: GOOD_ENTRY.id, currentValue: 0.50, proposedValue: 0.52, soak: { green: true } }, registry);
    expect(r.lane).toBe(LANE_B);
    expect(r.reasons.join(' ')).toMatch(/GOLDEN LAW/);
  });
  it('ONLY an explicit shiftsGolden === false is trusted as golden-safe (negative control)', () => {
    expect(classifyTuningProposal(
      { id: GOOD_ENTRY.id, currentValue: 0.50, proposedValue: 0.52, soak: { green: true, shiftsGolden: false } }, registry).lane)
      .toBe(LANE_A);
  });
});

describe('the weekly tuning job (pure; applies nothing)', () => {
  it('ships INERT — empty rollups/envelopes yield an all-within-envelope report, empty lanes', () => {
    const { healthReport, laneAEligible, laneBProposals, driftNotes } = runWeeklyTuningJob({});
    expect(healthReport.status).toBe('all_within_envelope');
    expect(laneAEligible).toHaveLength(0);
    expect(laneBProposals).toHaveLength(0);
    expect(driftNotes).toHaveLength(0);
  });

  it('ingestRollups sums totals + groups distributions by metric', () => {
    const { totals, distributions } = ingestRollups([
      { metric: 'realm_preset_adoption', dims: { preset_id: 'siege' }, value: 3 },
      { metric: 'realm_preset_adoption', dims: { preset_id: 'none' }, value: 1 },
      { metric: 'tuning_mover_adoption', dims: { mover: 'caravans' }, value: 2 },
    ]);
    expect(totals.realm_preset_adoption).toBe(4);
    expect(totals.tuning_mover_adoption).toBe(2);
    expect(distributions.realm_preset_adoption).toHaveLength(2);
  });

  it('diagnose flags an over-envelope metric and ranks by divergence', () => {
    const ingested = ingestRollups([{ metric: 'famine_incidence', value: 12 }, { metric: 'war_freq', value: 6 }]);
    const cands = diagnose(
      [{ metric: 'famine_incidence', min: 3, max: 8 }, { metric: 'war_freq', min: 4, max: 10 }],
      ingested,
    );
    expect(cands).toHaveLength(1);
    expect(cands[0].metric).toBe('famine_incidence');
    expect(cands[0].direction).toBe('over');
  });

  it('routes a green, in-range, registered divergence to lane-A-eligible', () => {
    const result = runWeeklyTuningJob({
      rollups: [{ metric: 'display_salience_metric', value: 0.9 }],
      envelopes: [{ metric: 'display_salience_metric', min: 0, max: 0.5, constantId: GOOD_ENTRY.id, proposedValue: 0.52 }],
      registry: [GOOD_ENTRY],
      currentValueFor: () => 0.50,
      soakFor: () => ({ green: true, shiftsGolden: false }),
    });
    expect(result.laneAEligible).toHaveLength(1);
    expect(result.laneAEligible[0].id).toBe(GOOD_ENTRY.id);
    expect(result.laneBProposals).toHaveLength(0);
  });

  it('routes a golden-shifting divergence to lane B even if registered', () => {
    const result = runWeeklyTuningJob({
      rollups: [{ metric: 'display_salience_metric', value: 0.9 }],
      envelopes: [{ metric: 'display_salience_metric', min: 0, max: 0.5, constantId: GOOD_ENTRY.id, proposedValue: 0.52 }],
      registry: [GOOD_ENTRY],
      currentValueFor: () => 0.50,
      soakFor: () => ({ green: true, shiftsGolden: true }),
    });
    expect(result.laneAEligible).toHaveLength(0);
    expect(result.laneBProposals).toHaveLength(1);
  });

  it('a divergence with no mapped constant is a report-only drift note', () => {
    const result = runWeeklyTuningJob({
      rollups: [{ metric: 'famine_incidence', value: 12 }],
      envelopes: [{ metric: 'famine_incidence', min: 3, max: 8 }],
    });
    expect(result.driftNotes).toHaveLength(1);
    expect(result.laneAEligible).toHaveLength(0);
    expect(result.laneBProposals).toHaveLength(0);
  });
});
