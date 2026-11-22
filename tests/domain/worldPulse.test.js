import { describe, expect, test } from 'vitest';

import {
  ageRoamingStressors,
  deriveRelationshipCandidates,
  pressureIndex,
  previewCampaignWorldPulse,
} from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

function settlement(name, patch = {}) {
  return {
    name,
    tier: 'town',
    population: 1800,
    config: { tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 30 },
    institutions: [],
    economicState: { primaryExports: [], primaryImports: ['Bulk grain and foodstuffs'] },
    powerStructure: {
      publicLegitimacy: { score: 28, label: 'Legitimacy Crisis' },
      factions: [
        { faction: 'Merchant League', category: 'economy', power: 72 },
        { faction: 'Temple Wardens', category: 'religious', power: 54 },
      ],
      conflicts: [],
    },
    npcs: [{ id: 'reeve', name: 'Reeve Mara', importance: 'key' }],
    activeConditions: [],
    ...patch,
  };
}

function save(id, name, patch = {}) {
  return {
    id,
    name,
    phase: 'canon',
    settlement: settlement(name, patch),
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  };
}

describe('world pulse domain', () => {
  test('preview is deterministic for the same campaign seed and tick', () => {
    const campaign = {
      id: 'camp-world',
      name: 'World',
      settlementIds: ['a', 'b'],
      worldState: { rngSeed: 'fixed-world-seed', tick: 3 },
      regionalGraph: ensureRegionalGraph({
        edges: [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'trade_partner' }],
      }),
      wizardNews: { currentTick: 3, entries: [] },
    };
    const saves = [
      save('a', 'Ashford', { activeConditions: [{ archetype: 'regional_import_shortage', severity: 0.7 }] }),
      save('b', 'Briarwatch'),
    ];

    const first = previewCampaignWorldPulse({ campaign, saves, interval: 'one_month', now: '2026-01-01T00:00:00.000Z' });
    const second = previewCampaignWorldPulse({ campaign, saves, interval: 'one_month', now: '2026-01-01T00:00:00.000Z' });

    expect(first.tick).toBe(4);
    expect(second.tick).toBe(4);
    expect(first.rollExplanations.map(r => [r.candidateId, r.roll, r.passed])).toEqual(
      second.rollExplanations.map(r => [r.candidateId, r.roll, r.passed]),
    );
    expect(first.selected.map(item => item.id)).toEqual(second.selected.map(item => item.id));
  });

  test('episodic disease stressors can resolve and emit residual outcomes', () => {
    const snapshot = {
      byId: new Map([['ashford', { causal: { scores: { healing_capacity: 80 } } }]]),
    };
    const result = ageRoamingStressors([{
      id: 'world_stressor.disease.ashford',
      type: 'disease_outbreak',
      durationPolicy: 'episodic',
      severity: 0.35,
      age: 7,
      affectedSettlementIds: ['ashford'],
      residualEffects: ['healer_exhaustion'],
    }], snapshot, { random: () => 0 }, { tick: 8, now: '2026-01-01T00:00:00.000Z' });

    expect(result.resolved).toHaveLength(1);
    // The crisis is over but not forgotten: resolution leaves a residual
    // ECHO in the stressor list (recent memory), not a hard drop.
    expect(result.stressors).toHaveLength(1);
    expect(result.stressors[0].status).toBe('residual');
    expect(result.stressors[0].memoryStrength).toBeGreaterThan(0);
    expect(result.residualOutcomes[0].condition.archetype).toBe('stressor_residual');
    expect(result.residualOutcomes[0].probability).toBe(1);
  });

  test('allied relationships create burden and conflict mirror candidates', () => {
    const snapshot = {
      worldState: { tick: 4, relationshipStates: {} },
      relationships: [
        { id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'allied' },
        { id: 'edge.b.c', from: 'b', to: 'c', relationshipType: 'hostile' },
      ],
    };
    const pressures = pressureIndex([
      { settlementId: 'b', kind: 'conflict', score: 0.8 },
      { settlementId: 'a', kind: 'conflict', score: 0.25 },
      { settlementId: 'b', kind: 'food', score: 0.2 },
    ]);

    const candidates = deriveRelationshipCandidates(snapshot, pressures, { tick: 5 });

    expect(candidates.some(c => c.candidateType === 'ally_burden')).toBe(true);
    expect(candidates.some(c => c.candidateType === 'ally_conflict_mirror')).toBe(true);
  });
});
