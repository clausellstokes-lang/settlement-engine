import { describe, expect, test } from 'vitest';

import {
  applyRelationshipPatch,
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

  // R3 pin (R4 handoff, lag case): a label proposal SELECTED at tick T but
  // ACCEPTED at tick T' lands its incident/history rows at T' while the pulse
  // record sits at T — the tick+type join cannot pair them. The apply stamps
  // the outcome id onto every row it writes and the dedupe joins on it first.
  test('a label proposal selected at tick T and accepted at tick T-prime scores once', () => {
    const graph = { edges: [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'hostile' }] };
    const outcome = {
      id: 'candidate.relationship.hostile_occupation_pressure.edge.a.b.5',
      type: 'relationship',
      candidateType: 'hostile_occupation_pressure',
      relationshipKey: 'edge.a.b',
      severity: 0.8,
      relationshipPatch: { proposedRelationshipType: 'vassal' },
      proposalPayload: { kind: 'relationship_label_change', fromType: 'hostile', toType: 'vassal', reason: 'Conquest becomes formal vassalage.' },
    };
    // Selected at tick 5: the pulse records the outcome while it waits.
    let worldState = {
      tick: 7,
      relationshipStates: { 'edge.a.b': { relationshipType: 'hostile' } },
      pulseHistory: [{ tick: 5, selectedOutcomes: [outcome] }],
    };
    // Accepted at tick 7: the apply writes incident + history rows at T'.
    worldState = applyRelationshipPatch(worldState, outcome, '2026-01-01T00:00:00.000Z');

    const postures = buildRelationshipPostures({ worldState, regionalGraph: graph, currentTick: 7 });
    const eventEntries = postures[0].recentMemory.filter(m => m.tick === 5 || m.tick === 7);
    expect(eventEntries).toHaveLength(1);
    // One event, decayed two ticks: 0.8 * 0.5^(2/4), not triple-counted.
    expect(postures[0].memoryScore).toBeCloseTo(0.57, 2);
  });

  // Triage pin (S3 deferred): a 'proposal'-mode outcome in pulseHistory is a
  // QUESTION the pulse asked, not an event — pending and dismissed proposals
  // must score nothing.
  test('a selected-but-rejected label proposal contributes zero memoryScore', () => {
    const graph = { edges: [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'rival' }] };
    const outcome = {
      id: 'candidate.relationship.rival_to_cold_war_or_hostile.edge.a.b.6',
      type: 'relationship',
      candidateType: 'rival_to_cold_war_or_hostile',
      relationshipKey: 'edge.a.b',
      severity: 0.8,
      applyMode: 'proposal',
      proposalPayload: { kind: 'relationship_label_change', fromType: 'rival', toType: 'cold_war' },
    };
    const worldState = {
      tick: 6,
      relationshipStates: { 'edge.a.b': { relationshipType: 'rival', resentment: 0.3 } },
      pulseHistory: [{ tick: 6, selectedOutcomes: [outcome] }],
      // The DM dismissed it — no apply ever ran, no incident row exists.
      proposals: [{ id: 'world_proposal.6.relationship.edge.a.b', status: 'dismissed', outcome }],
    };

    const postures = buildRelationshipPostures({ worldState, regionalGraph: graph, currentTick: 6 });
    expect(postures[0].memoryScore).toBe(0);
    expect(postures[0].recentMemory).toHaveLength(0);
    expect(postures[0].posture).toBe('managed_rivalry'); // quiet, not escalating

    // Still pending (no proposals row resolution at all): same — zero.
    const pending = buildRelationshipPostures({
      worldState: { ...worldState, proposals: [{ id: 'world_proposal.6.relationship.edge.a.b', status: 'pending', outcome }] },
      regionalGraph: graph,
      currentTick: 6,
    });
    expect(pending[0].memoryScore).toBe(0);
  });

  test('an accepted proposal scores once via either applied marker', () => {
    const graph = { edges: [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'rival' }] };
    const outcome = {
      id: 'candidate.relationship.rival_to_cold_war_or_hostile.edge.a.b.6',
      type: 'relationship',
      candidateType: 'rival_to_cold_war_or_hostile',
      relationshipKey: 'edge.a.b',
      severity: 0.8,
      applyMode: 'proposal',
      proposalPayload: { kind: 'relationship_label_change', fromType: 'rival', toType: 'cold_war' },
    };
    const base = {
      tick: 7,
      pulseHistory: [{ tick: 6, selectedOutcomes: [outcome] }],
    };

    // Marker 1 (the common case): acceptance wrote the outcomeId-stamped
    // incident row (R3) — the pulse row scores, the incident dedupes.
    const viaIncident = buildRelationshipPostures({
      worldState: {
        ...base,
        relationshipStates: {
          'edge.a.b': {
            relationshipType: 'rival',
            recentIncidents: [{ tick: 7, type: 'rival_to_cold_war_or_hostile', severity: 0.8, outcomeId: outcome.id }],
          },
        },
      },
      regionalGraph: graph,
      currentTick: 7,
    });
    expect(viaIncident[0].recentMemory).toHaveLength(1);
    // One event, decayed one tick from selection: 0.8 * 0.5^(1/4).
    expect(viaIncident[0].memoryScore).toBeCloseTo(0.67, 2);

    // Marker 2 (incident buffer evicted): the proposal row itself records
    // status 'applied' and admits the pulse outcome.
    const viaProposal = buildRelationshipPostures({
      worldState: {
        ...base,
        relationshipStates: { 'edge.a.b': { relationshipType: 'rival' } },
        proposals: [{ id: 'world_proposal.6.relationship.edge.a.b', status: 'applied', outcome }],
      },
      regionalGraph: graph,
      currentTick: 7,
    });
    expect(viaProposal[0].recentMemory).toHaveLength(1);
    expect(viaProposal[0].memoryScore).toBeCloseTo(0.67, 2);
  });

  // H16 pin: a subjugation that crowned the edge's authored 'to' side stamps
  // the roles onto the state — postures present the overlord at 'from', so
  // direction summaries stay truthful. Without the stamp the edge keeps its
  // strict authored direction.
  test('a state-stamped reversed vassalage presents the overlord first', () => {
    const graph = { edges: [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'vassal' }] };
    const worldState = {
      tick: 2,
      relationshipStates: {
        'edge.a.b': { relationshipType: 'vassal', overlordSaveId: 'b', vassalSaveId: 'a' },
      },
      pulseHistory: [],
    };

    const postures = buildRelationshipPostures({ worldState, regionalGraph: graph, currentTick: 2 });
    expect(postures[0]).toMatchObject({ relationshipKey: 'edge.a.b', from: 'b', to: 'a', relationshipType: 'vassal' });

    const context = buildSettlementRelationshipMemoryContext({
      settlementId: 'a',
      worldState,
      regionalGraph: graph,
    });
    expect(context.relationships[0].direction).toBe('vassal_to_overlord');

    // No stamp -> strict authored direction.
    const unstamped = buildRelationshipPostures({
      worldState: { tick: 2, relationshipStates: { 'edge.a.b': { relationshipType: 'vassal' } }, pulseHistory: [] },
      regionalGraph: graph,
      currentTick: 2,
    });
    expect(unstamped[0]).toMatchObject({ from: 'a', to: 'b' });
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
