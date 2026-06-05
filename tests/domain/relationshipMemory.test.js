import { describe, expect, test } from 'vitest';

import {
  buildRelationshipPostures,
  buildSettlementRelationshipMemoryContext,
  ensureRelationshipStatesForGraph,
  pressureIndex,
  relationshipMemoryWeight,
  deriveSettlementPressures,
} from '../../src/domain/worldPulse/index.js';

function item(id, patch = {}) {
  return {
    id,
    name: patch.name || id,
    settlement: {
      name: patch.name || id,
      tier: patch.tier || 'town',
      population: patch.population || 2000,
      activeConditions: patch.activeConditions || [],
    },
    activeConditions: patch.activeConditions || [],
    causal: {
      scores: {
        food_security: 60,
        labor_capacity: 60,
        public_legitimacy: 60,
        trade_connectivity: 60,
        defense_readiness: 60,
        infrastructure_condition: 60,
        criminal_opportunity: 35,
        ...(patch.scores || {}),
      },
    },
  };
}

describe('relationship memory and posture', () => {
  test('recency weighting favors recent memories but drops stale history after the lookback cap', () => {
    expect(relationshipMemoryWeight(9, 10)).toBeGreaterThan(relationshipMemoryWeight(2, 10));
    expect(relationshipMemoryWeight(10, 10)).toBe(1);
    expect(relationshipMemoryWeight(-20, 10)).toBe(0);
  });

  test('client relationship edges normalize to patron direction for simulation memory', () => {
    const graph = { edges: [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'client' }] };
    const states = ensureRelationshipStatesForGraph(graph, {});

    expect(states['edge.a.b'].relationshipType).toBe('patron');

    const worldState = { tick: 4, relationshipStates: states, pulseHistory: [] };
    const postures = buildRelationshipPostures({
      worldState,
      regionalGraph: graph,
      snapshot: {
        byId: new Map([
          ['a', item('a', { name: 'Ashford' })],
          ['b', item('b', { name: 'Briarwatch' })],
        ]),
      },
    });

    expect(postures[0]).toMatchObject({
      relationshipKey: 'edge.a.b',
      from: 'b',
      to: 'a',
      relationshipType: 'patron',
      legacyRelationshipType: 'client',
    });
  });

  test('settlement Daily Life context is sorted by influence and hides scores', () => {
    const graph = {
      edges: [
        { id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'trade_partner' },
        { id: 'edge.c.a', from: 'c', to: 'a', relationshipType: 'hostile' },
      ],
    };
    const worldState = {
      tick: 12,
      relationshipStates: {
        'edge.a.b': {
          relationshipType: 'trade_partner',
          trust: 0.66,
          resentment: 0.1,
          tradeBalance: 0.7,
          recentIncidents: [{ tick: 3, type: 'old_trade_delay', severity: 0.8 }],
        },
        'edge.c.a': {
          relationshipType: 'hostile',
          trust: 0.04,
          resentment: 0.82,
          fear: 0.74,
          recentIncidents: [{ tick: 11, type: 'raid', severity: 0.8 }],
        },
      },
      pulseHistory: [],
    };

    const context = buildSettlementRelationshipMemoryContext({
      settlementId: 'a',
      worldState,
      regionalGraph: graph,
      snapshot: {
        byId: new Map([
          ['a', item('a', { name: 'Ashford' })],
          ['b', item('b', { name: 'Briarwatch' })],
          ['c', item('c', { name: 'Crownhold' })],
        ]),
      },
    });

    expect(context.relationships[0].otherSettlementName).toBe('Crownhold');
    expect(context.relationships[0].summary).toMatch(/hostility|war-exhaustion|Crownhold/i);
    expect(JSON.stringify(context)).not.toMatch(/dailyLifeWeight|memoryScore|weight/);
  });

  test('pressure model emits economy, defense, and hostility for relationship dynamics', () => {
    const snapshot = {
      worldState: {
        relationshipStates: {
          'edge.a.b': { relationshipType: 'cold_war', resentment: 0.8, fear: 0.7 },
        },
        calendar: {},
      },
      regionalGraph: { edges: [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'cold_war' }], channels: [] },
      settlements: [
        item('a', { scores: { trade_connectivity: 25, defense_readiness: 35, infrastructure_condition: 35 } }),
        item('b'),
      ],
      byId: new Map(),
    };

    const pressures = deriveSettlementPressures(snapshot);
    const idx = pressureIndex(pressures);

    expect(idx.get('a', 'economy')).toBeTruthy();
    expect(idx.get('a', 'defense')).toBeTruthy();
    expect(idx.get('a', 'hostility').score).toBeGreaterThan(0.4);
  });
});
