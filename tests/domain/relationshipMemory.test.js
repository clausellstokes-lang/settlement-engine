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

  // R4 pin: one world event scores ONCE. The same applied outcome lands in
  // recentIncidents AND pulseHistory.selectedOutcomes (and label changes add a
  // history row) — before the dedupe, a single modest incident saturated
  // memoryScore and read as an escalating rivalry.
  test('a single severity-0.5 incident at the current tick scores ~0.5, not double', () => {
    const graph = { edges: [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'rival' }] };
    const worldState = {
      tick: 5,
      relationshipStates: {
        'edge.a.b': {
          relationshipType: 'rival',
          resentment: 0.3,
          recentIncidents: [{ tick: 5, type: 'raid', severity: 0.5 }],
        },
      },
      pulseHistory: [{
        tick: 5,
        selectedOutcomes: [{
          id: 'world_outcome.raid.edge_a_b.5',
          type: 'relationship',
          candidateType: 'hostile_raid',
          relationshipKey: 'edge.a.b',
          severity: 0.5,
          metadata: { incidentType: 'raid' },
        }],
      }],
    };

    const postures = buildRelationshipPostures({ worldState, regionalGraph: graph, currentTick: 5 });
    expect(postures[0].memoryScore).toBeCloseTo(0.5, 2);
    // One modest incident is a managed rivalry, not an escalating one.
    expect(postures[0].posture).toBe('managed_rivalry');
    // Exactly one memory entry survives the dedupe.
    expect(postures[0].recentMemory.filter(m => m.tick === 5)).toHaveLength(1);
  });

  test('a label change scores once across incident + history + pulse outcome', () => {
    const graph = { edges: [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'cold_war' }] };
    const worldState = {
      tick: 7,
      relationshipStates: {
        'edge.a.b': {
          relationshipType: 'cold_war',
          recentIncidents: [{ tick: 7, type: 'rival_to_cold_war_or_hostile', severity: 0.6 }],
          history: [{ tick: 7, type: 'label_proposal_applied', fromType: 'rival', toType: 'cold_war', reason: 'Escalation.' }],
        },
      },
      pulseHistory: [{
        tick: 7,
        selectedOutcomes: [{
          id: 'world_outcome.label.edge_a_b.7',
          type: 'relationship',
          candidateType: 'rival_to_cold_war_or_hostile',
          relationshipKey: 'edge.a.b',
          severity: 0.6,
          metadata: { fromType: 'rival', toType: 'cold_war' },
          proposalPayload: { kind: 'relationship_label_change', fromType: 'rival', toType: 'cold_war' },
        }],
      }],
    };

    const postures = buildRelationshipPostures({ worldState, regionalGraph: graph, currentTick: 7 });
    expect(postures[0].recentMemory.filter(m => m.tick === 7)).toHaveLength(1);
    expect(postures[0].memoryScore).toBeCloseTo(0.6, 2);
  });

  test('a hierarchy resolution (incident + history + hierarchyResolutions) scores once', () => {
    const graph = { edges: [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'vassal' }] };
    const row = { tick: 3, type: 'hierarchy_resolution', fromType: 'hostile', toType: 'cold_war', reason: 'Overlord ceasefire.' };
    const worldState = {
      tick: 3,
      relationshipStates: {
        'edge.a.b': {
          relationshipType: 'vassal',
          recentIncidents: [{ tick: 3, type: 'hierarchy_resolution', severity: 0.62 }],
          history: [row],
          hierarchyResolutions: [row],
        },
      },
      pulseHistory: [],
    };

    const postures = buildRelationshipPostures({ worldState, regionalGraph: graph, currentTick: 3 });
    expect(postures[0].recentMemory.filter(m => m.tick === 3)).toHaveLength(1);
  });

  // R4 pin: the persisted posture family is READ — the Daily Life context
  // rehydrates the stamp refreshRelationshipMemory wrote instead of
  // recomputing, with live recompute as the legacy-save fallback.
  test('preferPersisted reads the stamped posture; legacy saves without the stamp recompute', () => {
    const graph = {
      edges: [
        { id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'rival' },
        { id: 'edge.a.c', from: 'a', to: 'c', relationshipType: 'trade_partner' },
      ],
    };
    const worldState = {
      tick: 9,
      relationshipStates: {
        // Stamped state: persisted posture deliberately DIFFERS from what a
        // live recompute would derive (quiet rival -> managed_rivalry).
        'edge.a.b': {
          relationshipType: 'rival',
          resentment: 0.1,
          relationshipMemory: {
            posture: 'escalating_rivalry',
            postureLabel: 'escalating rivalry posture',
            score: 0.62,
            dailyLifeWeight: 0.7,
            flowProfile: { trade: -0.2, security: -0.2, authority: -0.12, information: 0.2, tribute: 0 },
            asymmetry: 0.1,
            recentMemory: [{ tick: 8, type: 'raid', label: 'raid', summary: 'A raid stung the border.', severity: 0.7, weight: 0.84 }],
            reasons: ['Recent memory: A raid stung the border.'],
            updatedAtTick: 9,
          },
        },
        // Legacy state: no stamp — must fall back to live recompute.
        'edge.a.c': { relationshipType: 'trade_partner', trust: 0.6, resentment: 0.05, tradeBalance: 0.7 },
      },
      pulseHistory: [],
    };

    const persisted = buildRelationshipPostures({ worldState, regionalGraph: graph, currentTick: 9, preferPersisted: true });
    const rival = persisted.find(p => p.relationshipKey === 'edge.a.b');
    expect(rival.posture).toBe('escalating_rivalry');
    expect(rival.memoryScore).toBeCloseTo(0.62, 2);
    expect(rival.persisted).toBe(true);
    const legacy = persisted.find(p => p.relationshipKey === 'edge.a.c');
    expect(legacy.posture).toBe('open_trade'); // recomputed live
    expect(legacy.persisted).toBeUndefined();

    // The same edges WITHOUT preferPersisted recompute everything (the
    // refresh/write path must never echo its own stamp back).
    const recomputed = buildRelationshipPostures({ worldState, regionalGraph: graph, currentTick: 9 });
    expect(recomputed.find(p => p.relationshipKey === 'edge.a.b').posture).toBe('managed_rivalry');

    // And the Daily Life context surfaces the persisted posture label.
    const context = buildSettlementRelationshipMemoryContext({
      settlementId: 'a',
      worldState,
      regionalGraph: graph,
      preferPersisted: true,
    });
    expect(context.relationships.some(r => /escalating rivalry/.test(r.posture))).toBe(true);
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
