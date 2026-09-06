import { describe, expect, test } from 'vitest';

import {
  ageRoamingStressors,
  normalizeStressor,
  resolveStressorById,
} from '../../src/domain/worldPulse/stressors.js';
import {
  counterforceAssessment,
  synergyAssessment,
  interpretStressorOrigin,
} from '../../src/domain/worldPulse/stressorDynamics.js';

// Resolution shoring pins: WHY a crisis ended is now as explainable as why
// it began — the receipt names the counterforce strengths that led recovery
// and the companions it ended despite.

const resolveAllRng = { fork: () => ({ random: () => 0 }), random: () => 0 };

function healthyTown() {
  return {
    name: 'Wellhaven',
    tier: 'town',
    institutions: [{ name: 'Hospital of the Dawn' }, { name: 'Temple infirmary' }],
  };
}

function snapshotFor(settlement, causalScores) {
  return {
    worldState: { tick: 3, stressors: [] },
    regionalGraph: { channels: [], edges: [] },
    byId: new Map([['x', { settlement, causal: { scores: causalScores } }]]),
  };
}

describe('resolution receipts', () => {
  test('a rolled resolution carries the receipt: counterforce score, named strengths, narrative', () => {
    const outbreak = normalizeStressor({
      type: 'disease_outbreak',
      originSettlementId: 'x',
      severity: 0.3,
      affectedSettlementIds: ['x'],
      updatedAt: '2026-01-01T00:00:00.000Z',
    });
    const snapshot = snapshotFor(healthyTown(), { healing_capacity: 90 });
    const result = ageRoamingStressors([outbreak], snapshot, resolveAllRng, {
      tick: 4, now: '2026-02-01T00:00:00.000Z',
    });
    expect(result.resolved).toHaveLength(1);
    const receipt = result.resolved[0].resolutionContext;
    expect(receipt).toBeTruthy();
    expect(receipt.counterforceScore).toBeGreaterThan(0.5);
    expect(receipt.leadingSources.map(s => s.source)).toContain('healing capacity');
    expect(receipt.narrative).toMatch(/Recovery led by healing capacity/);

    // The residual outcome prints the same receipt — the dossier's "why it
    // ended" reads from here.
    const residual = result.residualOutcomes[0];
    expect(residual.reasons.join(' ')).toMatch(/Recovery led by/);
  });

  test('a directed resolution (party / DM) carries the stated reason as its narrative', () => {
    const siege = normalizeStressor({
      type: 'siege',
      originSettlementId: 'x',
      severity: 0.7,
      affectedSettlementIds: ['x'],
      synergy: { companions: ['famine'], decayMult: 0.8, resolutionDelta: -0.04, blocksResolution: false },
      counterforce: { score: 0.41, resolutionDelta: -0.02, decayMultiplier: 0.9, floorsMet: false },
      updatedAt: '2026-01-01T00:00:00.000Z',
    });
    const { resolved } = resolveStressorById([siege], siege.id, {
      tick: 5, now: '2026-02-01T00:00:00.000Z', reason: 'The party broke the siege at the river gate.',
    });
    const receipt = resolved[0].resolutionContext;
    expect(receipt.narrative).toBe('The party broke the siege at the river gate.');
    expect(receipt.synergyCompanions).toEqual(['famine']);
    expect(receipt.counterforceScore).toBe(0.41);
  });

  test('counterforce assessments expose a labelled per-source breakdown', () => {
    const famine = normalizeStressor({
      type: 'famine', originSettlementId: 'x', severity: 0.5, affectedSettlementIds: ['x'],
    });
    const assessment = counterforceAssessment(famine, snapshotFor({
      name: 'Granary Town', institutions: [{ name: 'Town granary' }],
      economicState: { foodSecurity: { storageMonths: 4, deficitPct: 0, resilienceScore: 80, dailyNeed: 100, dailyProduction: 120 } },
    }, { trade_connectivity: 70 }));
    expect(assessment.sourceBreakdown).toHaveLength(4);
    const labels = assessment.sourceBreakdown.map(s => s.label);
    expect(labels).toContain('stored food');
    expect(labels).toContain('food institutions');
    for (const source of assessment.sourceBreakdown) {
      expect(source.value).toBeGreaterThanOrEqual(0);
      expect(source.value).toBeLessThanOrEqual(1);
    }
  });

  test('the first accelerating synergy: a live insurgency BLEEDS the occupation toward its end', () => {
    const occupation = normalizeStressor({
      type: 'occupation', originSettlementId: 'x', severity: 0.6, affectedSettlementIds: ['x'],
    });
    const resistance = normalizeStressor({
      type: 'insurgency', originSettlementId: 'x', severity: 0.6, affectedSettlementIds: ['x'],
    });
    const synergy = synergyAssessment(occupation, [occupation, resistance]);
    expect(synergy.companions).toContain('insurgency');
    expect(synergy.decayMult).toBeGreaterThan(1);
    expect(synergy.resolutionDelta).toBeGreaterThan(0);
    expect(synergy.resolutionDelta).toBeLessThanOrEqual(0.12); // clamped both ways now
  });

  test('resolutionRules is gone: the dormant host field no longer serializes on every stressor', () => {
    const normalized = normalizeStressor({ type: 'famine', originSettlementId: 'x' });
    expect('resolutionRules' in normalized).toBe(false);
    // resolutionContext IS preserved (the receipt survives persistence).
    const withReceipt = normalizeStressor({
      type: 'famine', originSettlementId: 'x',
      resolutionContext: { narrative: 'kept', leadingSources: [], synergyCompanions: [], counterforceScore: 0.5 },
    });
    expect(withReceipt.resolutionContext.narrative).toBe('kept');
  });

  test('aging without a threaded now keeps the prior stamp instead of reading the wall clock', () => {
    const famine = normalizeStressor({
      type: 'famine', originSettlementId: 'x', severity: 0.9,
      affectedSettlementIds: ['x'], updatedAt: '2026-01-01T00:00:00.000Z',
    });
    const neverResolve = { fork: () => ({ random: () => 0.999 }), random: () => 0.999 };
    const result = ageRoamingStressors([famine], snapshotFor({ name: 'X', institutions: [] }, {}), neverResolve, { tick: 2 });
    expect(result.stressors[0].updatedAt).toBe('2026-01-01T00:00:00.000Z');
  });

  test('rebellion origin variants: servile, tax revolt, and the default popular revolt', () => {
    const base = id => ({
      worldState: { stressors: [] },
      byId: new Map([[id, { settlement: { name: id }, causal: { scores: { labor_capacity: 20, public_legitimacy: 30 } } }]]),
    });
    expect(interpretStressorOrigin('rebellion', 'x', base('x'), 7).variant).toBe('servile_uprising');

    const taxed = {
      worldState: {
        stressors: [{
          id: 'world_stressor.indebtedness.x', type: 'indebtedness', status: 'active',
          affectedSettlementIds: ['x'],
        }],
      },
      byId: new Map([['x', { settlement: { name: 'x' }, causal: { scores: { labor_capacity: 60, public_legitimacy: 50 } } }]]),
    };
    expect(interpretStressorOrigin('rebellion', 'x', taxed, 7).variant).toBe('tax_revolt');

    const plain = {
      worldState: { stressors: [] },
      byId: new Map([['x', { settlement: { name: 'x' }, causal: { scores: { labor_capacity: 60, public_legitimacy: 50 } } }]]),
    };
    const popular = interpretStressorOrigin('rebellion', 'x', plain, 7);
    expect(popular.variant).toBe('popular_revolt');
    expect(popular.hooks.length).toBeGreaterThan(0);
  });
});
