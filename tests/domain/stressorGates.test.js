import { describe, expect, test } from 'vitest';

import {
  STRESSOR_SPAWN_GATES,
  magicDependenceSignals,
} from '../../src/domain/worldPulse/stressorGates.js';
import {
  STRESSOR_CATALOG,
  evaluateStressorRules,
  stressorCandidateForPressure,
  ageRoamingStressors,
  normalizeStressor,
} from '../../src/domain/worldPulse/stressors.js';
import { pressureIndex } from '../../src/domain/worldPulse/index.js';

// Stressor-wave pins: every birth is gated on ORGANIC CONTEXT. Blocks fire
// where the context contradicts the story; everything else is a gradient
// probabilityMult whose reasons land on the candidate.

function pressureRow(settlementId, kind, score) {
  return {
    settlementId,
    settlementName: settlementId,
    kind,
    label: `${kind} pressure`,
    score,
    reasons: [`high ${kind}`],
  };
}

function snapshotWith({ settlement = {}, causal = {}, stressors = [], edges = [], channels = [], otherEntries = [] } = {}) {
  const byId = new Map([
    ['oak', { settlement: { name: 'Oak', tier: 'town', institutions: [], ...settlement }, causal: { scores: causal } }],
    ...otherEntries,
  ]);
  return {
    worldState: { tick: 4, stressors },
    regionalGraph: { edges, channels },
    byId,
  };
}

function activeStressor(type, settlementIds, extra = {}) {
  return {
    id: `world_stressor.${type}.${settlementIds[0]}`,
    type,
    severity: 0.6,
    status: 'active',
    affectedSettlementIds: settlementIds,
    ...extra,
  };
}

describe('organic birth gates', () => {
  test('occupation needs a plausible occupier: blocked alone, allowed beside a siege or hostile neighbour', () => {
    const gate = STRESSOR_SPAWN_GATES.occupation;
    const pressure = pressureRow('oak', 'conflict', 0.8);

    // Nobody at the gates, nobody hostile nearby: there is no occupier.
    expect(gate(snapshotWith(), pressure)).toBeNull();

    // An active siege IS the occupier-in-waiting.
    const besieged = gate(snapshotWith({ stressors: [activeStressor('siege', ['oak'])] }), pressure);
    expect(besieged).toBeTruthy();
    expect(besieged.probabilityMult).toBeGreaterThan(1.5);
    expect(besieged.reasons.join(' ')).toMatch(/Sieges end in occupations/);

    // A hostile neighbour stands ready to march in.
    const hostile = gate(snapshotWith({
      edges: [{ id: 'e1', from: 'oak', to: 'thorn', relationshipType: 'hostile' }],
    }), pressure);
    expect(hostile).toBeTruthy();
    expect(hostile.probabilityMult).toBeGreaterThan(1);
  });

  test('the siege line stops migration: mass_migration is blocked under an active siege (owner rule)', () => {
    const gate = STRESSOR_SPAWN_GATES.mass_migration;
    const pressure = pressureRow('oak', 'food', 0.7);
    expect(gate(snapshotWith({ stressors: [activeStressor('siege', ['oak'])] }), pressure)).toBeNull();

    // Crisis next door drives people up this road instead.
    const fleeing = gate(snapshotWith({
      edges: [{ id: 'e1', from: 'oak', to: 'thorn', relationshipType: 'trade_partner' }],
      stressors: [activeStressor('famine', ['thorn'])],
    }), pressure);
    expect(fleeing.probabilityMult).toBeGreaterThan(1);
    expect(fleeing.reasons.join(' ')).toMatch(/Crisis next door/);

    // A quiet region sends nobody.
    const quiet = gate(snapshotWith(), pressure);
    expect(quiet.probabilityMult).toBeLessThan(1);
  });

  test('magical types are magic-gated and mutually exclusive at birth', () => {
    const instability = STRESSOR_SPAWN_GATES.magical_instability;
    const deadzone = STRESSOR_SPAWN_GATES.magic_deadzone;
    const pressure = pressureRow('oak', 'legitimacy', 0.8);
    const arcaneTown = {
      config: { magicExists: true, priorityMagic: 70 },
      institutions: [{ name: 'Arcane College', category: 'Magic' }],
    };

    // No-magic world: neither exists (low magic is not wild magic).
    const mundane = { config: { magicExists: false, priorityMagic: 0 } };
    expect(instability(snapshotWith({ settlement: mundane }), pressure)).toBeNull();
    expect(deadzone(snapshotWith({ settlement: mundane }), pressure)).toBeNull();

    // A settlement where magic is load-bearing admits both...
    expect(instability(snapshotWith({ settlement: arcaneTown }), pressure)).toBeTruthy();
    expect(deadzone(snapshotWith({ settlement: arcaneTown }), pressure)).toBeTruthy();

    // ...but never at the same time: dead ground and wild surges exclude
    // each other in both directions.
    expect(instability(snapshotWith({
      settlement: arcaneTown,
      stressors: [activeStressor('magic_deadzone', ['oak'])],
    }), pressure)).toBeNull();
    expect(deadzone(snapshotWith({
      settlement: arcaneTown,
      stressors: [activeStressor('magical_instability', ['oak'])],
    }), pressure)).toBeNull();

    // The mutation chain: a burned-out surge leaves dead ground behind it —
    // the instability's ECHO boosts the deadzone's odds.
    const afterBurnout = deadzone(snapshotWith({
      settlement: arcaneTown,
      stressors: [{
        id: 'world_stressor.magical_instability.oak',
        type: 'magical_instability',
        status: 'residual',
        memoryStrength: 0.5,
        affectedSettlementIds: ['oak'],
      }],
    }), pressure);
    const calm = deadzone(snapshotWith({ settlement: arcaneTown }), pressure);
    expect(afterBurnout.probabilityMult).toBeGreaterThan(calm.probabilityMult);
    expect(afterBurnout.reasons.join(' ')).toMatch(/burned-out surge/);
  });

  test('magic dependence signals separate magic-reliant settlements from mundane ones', () => {
    expect(magicDependenceSignals({ config: { magicExists: false } })).toEqual([]);
    expect(magicDependenceSignals({ config: { magicExists: true, priorityMagic: 10 }, institutions: [] })).toEqual([]);
    const signals = magicDependenceSignals({
      config: { magicExists: true, priorityMagic: 70 },
      institutions: [{ name: 'Hidden Sanctum' }],
      economicState: { activeChains: [{ status: 'magically_sustained' }] },
    });
    expect(signals.length).toBeGreaterThanOrEqual(3);
  });

  test('uprisings split by context: rebellion is domestic, insurgency is the occupied form', () => {
    const rebellion = STRESSOR_SPAWN_GATES.rebellion;
    const insurgency = STRESSOR_SPAWN_GATES.insurgency;
    const pressure = pressureRow('oak', 'legitimacy', 0.8);
    const crisis = { powerStructure: { publicLegitimacy: { score: 25, label: 'Legitimacy Crisis' } } };
    const beloved = { powerStructure: { publicLegitimacy: { score: 82, label: 'Respected' } } };

    // Nobody rises against a regime they believe in.
    expect(rebellion(snapshotWith({ settlement: beloved }), pressure)).toBeNull();
    expect(insurgency(snapshotWith({ settlement: beloved }), pressure)).toBeNull();

    // Under occupation the uprising IS the insurgency; rebellion stands down.
    const occupied = { settlement: crisis, stressors: [activeStressor('occupation', ['oak'])] };
    expect(rebellion(snapshotWith(occupied), pressure)).toBeNull();
    const resistance = insurgency(snapshotWith(occupied), pressure);
    expect(resistance.probabilityMult).toBeGreaterThan(1.9);
    expect(resistance.reasons.join(' ')).toMatch(/Occupation breeds resistance/);

    // Domestic crisis without an occupier: rebellion's ground.
    expect(rebellion(snapshotWith({ settlement: crisis }), pressure).probabilityMult).toBeGreaterThan(1);
  });

  test('famine reads the granary: full stores suppress, a blockade inflames', () => {
    const gate = STRESSOR_SPAWN_GATES.famine;
    const pressure = pressureRow('oak', 'food', 0.7);
    const stocked = gate(snapshotWith({
      settlement: { economicState: { foodSecurity: { storageMonths: 5, deficitPct: 0, dailyNeed: 100, dailyProduction: 100 } } },
    }), pressure);
    expect(stocked.probabilityMult).toBeLessThan(1);
    const blockaded = gate(snapshotWith({
      stressors: [activeStressor('siege', ['oak'])],
    }), pressure);
    expect(blockaded.probabilityMult).toBeGreaterThan(1);
    expect(blockaded.reasons.join(' ')).toMatch(/blockade/i);
    expect(blockaded.probabilityMult).toBeGreaterThan(stocked.probabilityMult);
  });

  test('disease reads the healers: no healing institutions invite the outbreak strong healing suppresses', () => {
    const gate = STRESSOR_SPAWN_GATES.disease_outbreak;
    const pressure = pressureRow('oak', 'disease', 0.7);
    const helpless = gate(snapshotWith({ causal: { healing_capacity: 20 } }), pressure);
    expect(helpless.probabilityMult).toBeGreaterThan(1.5);
    expect(helpless.reasons.join(' ')).toMatch(/No healing institutions/);
    const strong = gate(snapshotWith({
      settlement: { institutions: [{ name: 'Hospital of the Dawn' }, { name: 'Temple infirmary' }] },
      causal: { healing_capacity: 85 },
    }), pressure);
    expect(strong.probabilityMult).toBeLessThan(helpless.probabilityMult);
  });

  test('gate reasons and gradients land on the birth candidate', () => {
    const snapshot = snapshotWith({ stressors: [activeStressor('siege', ['oak'])] });
    const pressures = [pressureRow('oak', 'food', 0.7)];
    const candidates = evaluateStressorRules(snapshot, pressureIndex(pressures), { tick: 5, pressures });
    const famine = candidates.find(c => c.candidateType === 'stressor_birth_famine');
    expect(famine).toBeTruthy();
    expect(famine.reasons.join(' ')).toMatch(/blockade is starving/);

    const calmPressures = [pressureRow('oak', 'food', 0.7)];
    const calm = evaluateStressorRules(snapshotWith(), pressureIndex(calmPressures), { tick: 5, pressures: calmPressures })
      .find(c => c.candidateType === 'stressor_birth_famine');
    // Gradient RNG: the same pressure births more readily under blockade.
    expect(famine.probability).toBeGreaterThan(calm.probability);
  });

  test('the snapshot-less legacy path skips block-capable gates only', () => {
    const candidate = stressorCandidateForPressure(pressureRow('oak', 'legitimacy', 0.92), 3);
    // occupation/succession_void/insurgency/rebellion/coup/magic types all
    // require a snapshot to tell their story; political_fracture is the first
    // gradient-only legitimacy type and wins this path.
    expect(candidate.candidateType).toBe('stressor_birth_political_fracture');
  });

  test('legacy slave_revolt records still age and resolve (the fold removes only organic births)', () => {
    const legacy = normalizeStressor({
      type: 'slave_revolt',
      originSettlementId: 'oak',
      severity: 0.1,
      affectedSettlementIds: ['oak'],
      updatedAt: '2026-01-01T00:00:00.000Z',
    });
    const rng = { fork: () => ({ random: () => 0 }), random: () => 0 };
    const result = ageRoamingStressors([legacy], snapshotWith(), rng, { tick: 2, now: '2026-02-01T00:00:00.000Z' });
    expect(result.resolved).toHaveLength(1);
    expect(result.resolved[0].type).toBe('slave_revolt');
    expect(STRESSOR_CATALOG.slave_revolt.deprecated).toBe(true);
  });
});
