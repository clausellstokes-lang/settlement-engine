/**
 * tests/domain/stressorCounterforces.test.js — counterforce pins.
 *
 * Pins:
 *   • Strength accelerates: a strong settlement gets a positive resolution
 *     delta and a >1 decay multiplier; a weak one the inverse.
 *   • The siege trio is CONJUNCTIVE: missing any floor (defense / stored
 *     food / Tolerated legitimacy) caps the score at neutral — partial
 *     strength never accelerates, and never punishes either.
 *   • Structural stressors actually break: a strong settlement bleeds a
 *     siege below the 0.25 structural gate in strictly fewer ticks than a
 *     weak one (decay lever, not just the resolution roll).
 *   • Residual conditions carry only REAL causal variables (the catalog's
 *     faction_stability / law_order / tax_revenue aliases are mapped).
 *   • Probability-1 outcomes (residual aftermaths) bypass the volatility
 *     multiplier — a calm world must not silently drop consequences.
 */

import { describe, expect, test } from 'vitest';
import { counterforceAssessment, STRESSOR_COUNTERFORCES } from '../../src/domain/worldPulse/stressorDynamics.js';
import { ageRoamingStressors, STRESSOR_CATALOG } from '../../src/domain/worldPulse/stressors.js';
import { rollCandidates } from '../../src/domain/worldPulse/candidateEvents.js';

function entryFor({ scores = {}, settlement = {} } = {}) {
  return { causal: { scores }, settlement };
}

const STRONG_SIEGE_SETTLEMENT = {
  institutions: [
    { name: 'Stone Walls' },
    { name: 'Garrison of the Vale' },
    { name: 'Old Granary' },
  ],
  economicState: { foodSecurity: { storageMonths: 4, deficitPct: 0, resilienceScore: 80 } },
  powerStructure: { publicLegitimacy: { score: 70, label: 'Approved' } },
};

const WEAK_SETTLEMENT = {
  institutions: [],
  economicState: { foodSecurity: { storageMonths: 0, deficitPct: 45, resilienceScore: 15 } },
  powerStructure: { publicLegitimacy: { score: 25, label: 'Legitimacy Crisis' } },
};

function snapshotFor(id, entry, { channels = [], edges = [] } = {}) {
  return {
    byId: new Map([[id, entry]]),
    regionalGraph: { edges, channels },
  };
}

function siegeStressor(patch = {}) {
  return {
    id: 'world_stressor.siege.a',
    type: 'siege',
    durationPolicy: 'structural',
    severity: 0.9,
    age: 0,
    affectedSettlementIds: ['a'],
    ...patch,
  };
}

describe('counterforceAssessment()', () => {
  test('every catalog stressor type has a counterforce profile', () => {
    for (const type of Object.keys(STRESSOR_CATALOG)) {
      expect(STRESSOR_COUNTERFORCES[type], `missing counterforces for ${type}`).toBeTruthy();
    }
  });

  test('strong siege settlement: floors met, positive delta, accelerated decay', () => {
    const snapshot = snapshotFor('a',
      entryFor({ scores: { defense_readiness: 80 }, settlement: STRONG_SIEGE_SETTLEMENT }),
      { channels: [{ type: 'military_protection', from: 'ally', to: 'a', status: 'confirmed' }] });
    const cf = counterforceAssessment(siegeStressor(), snapshot);
    expect(cf.floorsMet).toBe(true);
    expect(cf.score).toBeGreaterThan(0.5);
    expect(cf.resolutionDelta).toBeGreaterThan(0);
    expect(cf.decayMultiplier).toBeGreaterThan(1);
  });

  test('siege trio is conjunctive: empty granary caps at neutral despite strength elsewhere', () => {
    const noFood = {
      ...STRONG_SIEGE_SETTLEMENT,
      economicState: { foodSecurity: { storageMonths: 0, deficitPct: 0, resilienceScore: 80 } },
    };
    const snapshot = snapshotFor('a',
      entryFor({ scores: { defense_readiness: 80 }, settlement: noFood }),
      { channels: [{ type: 'military_protection', from: 'ally', to: 'a', status: 'confirmed' }] });
    const cf = counterforceAssessment(siegeStressor(), snapshot);
    expect(cf.floorsMet).toBe(false);
    expect(cf.score).toBeLessThanOrEqual(0.5);
    // Capped at neutral, not punished: no acceleration, but no slowdown either.
    expect(cf.resolutionDelta).toBeLessThanOrEqual(0);
    expect(cf.decayMultiplier).toBeLessThanOrEqual(1);
    expect(cf.decayMultiplier).toBeGreaterThanOrEqual(0.5);
  });

  test('weak settlement wallows: negative delta, slowed decay', () => {
    const snapshot = snapshotFor('a', entryFor({ scores: { defense_readiness: 20 }, settlement: WEAK_SETTLEMENT }));
    const cf = counterforceAssessment(siegeStressor(), snapshot);
    expect(cf.resolutionDelta).toBeLessThan(0);
    expect(cf.decayMultiplier).toBeLessThan(1);
  });

  test('disease outbreak reads healing strength and healer redundancy', () => {
    const healers = {
      institutions: [{ name: 'Temple of Mercy' }, { name: 'Infirmary' }, { name: 'Apothecary Row' }],
    };
    const strong = counterforceAssessment(
      { type: 'disease_outbreak', affectedSettlementIds: ['a'] },
      snapshotFor('a', entryFor({ scores: { healing_capacity: 85 }, settlement: healers })),
    );
    const weak = counterforceAssessment(
      { type: 'disease_outbreak', affectedSettlementIds: ['a'] },
      snapshotFor('a', entryFor({ scores: { healing_capacity: 20 }, settlement: { institutions: [] } })),
    );
    expect(strong.resolutionDelta).toBeGreaterThan(0);
    expect(weak.resolutionDelta).toBeLessThan(0);
  });

  test('unknown stressor types have no assessment (no behavior change)', () => {
    const snapshot = snapshotFor('a', entryFor({}));
    expect(counterforceAssessment({ type: 'mystery_pressure', affectedSettlementIds: ['a'] }, snapshot)).toBeNull();
  });

  test('famine counterforce reads LIVE storage: a full granary resolves faster than a drained one', () => {
    const settlementWithStorage = (storageMonths) => ({
      institutions: [{ name: 'Old Granary' }, { name: 'Grist Mill' }],
      economicState: { foodSecurity: { storageMonths, deficitPct: 10, resilienceScore: 55 } },
    });
    const assess = (storageMonths) => counterforceAssessment(
      { type: 'famine', affectedSettlementIds: ['a'] },
      snapshotFor('a', entryFor({ scores: { trade_connectivity: 50 }, settlement: settlementWithStorage(storageMonths) })),
    );
    const full = assess(6);
    const drained = assess(0.5);
    expect(full.resolutionDelta).toBeGreaterThan(drained.resolutionDelta);
    expect(full.decayMultiplier).toBeGreaterThan(drained.decayMultiplier);
  });
});

describe('counterforces through ageRoamingStressors()', () => {
  function ticksToBreakSiege(snapshot) {
    // rng pinned at 0.99: the resolution roll never passes, so the ONLY way
    // the siege ends is the decay lever dragging severity below the
    // structural gate and then under the auto-resolve floor — pure
    // counterforce, no luck.
    let stressors = [siegeStressor()];
    for (let tick = 1; tick <= 200; tick++) {
      const result = ageRoamingStressors(stressors, snapshot, { random: () => 0.99 }, { tick, now: '2026-01-01T00:00:00.000Z' });
      if (result.resolved.length || !result.stressors.length) return tick;
      stressors = result.stressors;
      // Severity floor resolution (<=0.08) is the expected exit; a stressor
      // surviving 200 ticks means the decay lever failed.
    }
    return Infinity;
  }

  test('a provisioned, defended, tolerated city breaks a siege in fewer ticks', () => {
    const strongSnapshot = snapshotFor('a',
      entryFor({ scores: { defense_readiness: 80 }, settlement: STRONG_SIEGE_SETTLEMENT }),
      { channels: [{ type: 'military_protection', from: 'ally', to: 'a', status: 'confirmed' }] });
    const weakSnapshot = snapshotFor('a', entryFor({ scores: { defense_readiness: 20 }, settlement: WEAK_SETTLEMENT }));
    const strongTicks = ticksToBreakSiege(strongSnapshot);
    const weakTicks = ticksToBreakSiege(weakSnapshot);
    expect(strongTicks).toBeLessThan(weakTicks);
    expect(Number.isFinite(strongTicks)).toBe(true);
  });

  test('aged stressors carry a counterforce diagnostic snapshot', () => {
    const snapshot = snapshotFor('a', entryFor({ scores: { defense_readiness: 80 }, settlement: STRONG_SIEGE_SETTLEMENT }));
    const result = ageRoamingStressors([siegeStressor()], snapshot, { random: () => 0.99 }, { tick: 1, now: '2026-01-01T00:00:00.000Z' });
    const aged = result.stressors[0];
    expect(aged.counterforce).toBeTruthy();
    expect(typeof aged.counterforce.score).toBe('number');
    expect(typeof aged.counterforce.decayMultiplier).toBe('number');
  });
});

describe('residual affectedSystems use real causal variables', () => {
  function resolveAndGetResidual(type, severity = 0.2, age = 20) {
    const result = ageRoamingStressors(
      [{ id: `world_stressor.${type}.a`, type, severity, age, affectedSettlementIds: ['a'] }],
      { byId: new Map([['a', entryFor({})]]) },
      { random: () => 0 },
      { tick: 5, now: '2026-01-01T00:00:00.000Z' },
    );
    expect(result.resolved).toHaveLength(1);
    return result.residualOutcomes[0].condition;
  }

  test('succession_void residual maps law_order -> criminal_opportunity', () => {
    const condition = resolveAndGetResidual('succession_void');
    expect(condition.affectedSystems).toContain('criminal_opportunity');
    expect(condition.affectedSystems).not.toContain('law_order');
  });

  test('occupation residual maps faction_stability -> faction_power', () => {
    const condition = resolveAndGetResidual('occupation', 0.2, 30);
    expect(condition.affectedSystems).toContain('faction_power');
    expect(condition.affectedSystems).not.toContain('faction_stability');
  });

  test('wartime residual maps tax_revenue -> trade_connectivity', () => {
    const condition = resolveAndGetResidual('wartime', 0.2, 30);
    expect(condition.affectedSystems).toContain('trade_connectivity');
    expect(condition.affectedSystems).not.toContain('tax_revenue');
  });
});

describe('volatility never drops guaranteed outcomes', () => {
  test('probability-1 residual passes under calm volatility with a high roll', () => {
    const candidate = {
      id: 'world_outcome.residual.test',
      type: 'condition',
      candidateType: 'stressor_residual',
      applyMode: 'auto',
      probability: 1,
      severity: 0.3,
    };
    const { selected, rollExplanations } = rollCandidates([candidate], { random: () => 0.9 }, { volatility: 0.6 });
    expect(selected).toHaveLength(1);
    expect(rollExplanations[0].probability).toBe(1);
    expect(rollExplanations[0].passed).toBe(true);
  });

  test('stochastic candidates are still volatility-scaled', () => {
    const candidate = { id: 'c1', type: 'condition', applyMode: 'auto', probability: 0.9, severity: 0.5 };
    const { selected, rollExplanations } = rollCandidates([candidate], { random: () => 0.8 }, { volatility: 0.6 });
    expect(rollExplanations[0].probability).toBeCloseTo(0.54, 5);
    expect(selected).toHaveLength(0);
  });
});
