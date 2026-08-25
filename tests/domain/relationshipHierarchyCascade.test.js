import { describe, expect, test } from 'vitest';

import {
  applyWorldPulseOutcomes,
  applyWorldPulseProposal,
  evaluateRelationshipRules,
  pressureIndex,
  previewRelationshipHierarchyCascade,
  resolveRelationshipHierarchy,
} from '../../src/domain/worldPulse/index.js';

// H15 pins (R3 decided): the vassal hierarchy cascade STAYS, but it is fully
// explainable — the hierarchy result carries a per-edge change list for the
// Wizard News wiring, the cascade executes only when the vassalage APPLIES
// (never while the proposal is pending), and the proposal prose names the
// realignments before the DM accepts.

const NOW = '2026-01-01T00:00:00.000Z';

function item(id, name, patch = {}) {
  return {
    id,
    name,
    settlement: {
      name,
      tier: patch.tier || 'town',
      population: patch.population || 2000,
    },
    activeConditions: [],
    causal: { scores: {} },
  };
}

function pressureRows(patch = {}) {
  return Object.entries(patch).flatMap(([settlementId, kinds]) => {
    const base = { food: 0.1, disease: 0.1, conflict: 0.1, hostility: 0, trade: 0.1, legitimacy: 0.1, crime: 0.1, economy: 0.1, defense: 0.1, ...kinds };
    return Object.entries(base).map(([kind, score]) => ({ settlementId, kind, score }));
  });
}

// Conqueror 'c' subjugates 'a'; 'a' is allied with 'b'; 'b' is hostile to 'c'.
// The cascade must drag the a-b alliance into the war.
function cascadeWorld() {
  const regionalGraph = {
    edges: [
      { id: 'edge.c.a', from: 'c', to: 'a', relationshipType: 'hostile' },
      { id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'allied' },
      { id: 'edge.b.c', from: 'b', to: 'c', relationshipType: 'hostile' },
    ],
    channels: [],
  };
  const relationshipStates = {
    'edge.c.a': { relationshipType: 'hostile', resentment: 0.86, fear: 0.74, leverage: 0.78, dependency: 0.62 },
    'edge.a.b': { relationshipType: 'allied', trust: 0.34, pactStrength: 0.2, tradeBalance: 0.6 },
    'edge.b.c': { relationshipType: 'hostile', resentment: 0.8, fear: 0.7 },
  };
  const items = new Map([
    ['c', item('c', 'Crownhold', { tier: 'city', population: 18000 })],
    ['a', item('a', 'Ashford', { tier: 'village', population: 500 })],
    ['b', item('b', 'Briarwatch', { tier: 'village', population: 600 })],
  ]);
  return { regionalGraph, relationshipStates, items };
}

describe('vassal hierarchy cascade explainability', () => {
  test('the hierarchy result carries cascadeChanges with accurate from/to', () => {
    const { regionalGraph, relationshipStates } = cascadeWorld();
    const worldState = {
      tick: 4,
      relationshipStates: {
        ...relationshipStates,
        'edge.c.a': { ...relationshipStates['edge.c.a'], relationshipType: 'vassal' },
      },
    };

    const result = resolveRelationshipHierarchy({
      worldState,
      regionalGraph,
      vassalEdge: regionalGraph.edges[0],
      now: NOW,
      tick: 4,
    });

    expect(result.changes).toHaveLength(1);
    expect(result.cascadeChanges).toEqual([{
      edgeKey: 'edge.a.b',
      fromType: 'allied',
      toType: 'hostile',
      reason: expect.stringMatching(/overlord war/i),
    }]);
    // The coordination shape mirrors the executed changes one-to-one.
    expect(result.cascadeChanges.map(change => change.edgeKey))
      .toEqual(result.changes.map(change => change.relationshipKey));
  });

  test('the cascade executes on APPLY, not while the proposal is pending', () => {
    const { regionalGraph, relationshipStates, items } = cascadeWorld();
    const worldState = { tick: 4, relationshipStates };
    const snapshot = {
      worldState,
      regionalGraph,
      settlements: [...items.values()],
      byId: items,
    };
    const settlementMap = new Map([...items.entries()].map(([id, entry]) => [
      id,
      { saveId: id, save: { id, name: entry.name }, settlement: entry.settlement },
    ]));
    const outcome = {
      id: 'candidate.relationship.hostile_occupation_pressure.edge.c.a.4',
      type: 'relationship',
      candidateType: 'hostile_occupation_pressure',
      relationshipKey: 'edge.c.a',
      severity: 0.86,
      applyMode: 'proposal',
      headline: 'hostile may become vassal',
      summary: 'Crownhold presses Ashford into vassalage.',
      relationshipPatch: { proposedRelationshipType: 'vassal', overlordSaveId: 'c', vassalSaveId: 'a' },
      proposalPayload: { kind: 'relationship_label_change', relationshipKey: 'edge.c.a', fromType: 'hostile', toType: 'vassal', reason: 'Crownhold conquers Ashford.' },
    };

    const pending = applyWorldPulseOutcomes({
      snapshot,
      worldState,
      regionalGraph,
      settlementMap,
      outcomes: [outcome],
      tick: 4,
      now: NOW,
    });

    // Pending: nothing flipped, nowhere.
    expect(pending.proposals).toHaveLength(1);
    expect(pending.worldState.relationshipStates['edge.c.a'].relationshipType).not.toBe('vassal');
    expect(pending.worldState.relationshipStates['edge.a.b'].relationshipType).toBe('allied');
    expect(pending.regionalGraph.edges.find(edge => edge.id === 'edge.a.b').relationshipType).toBe('allied');

    // Accepting the proposal applies the vassalage AND the cascade together.
    const applied = applyWorldPulseProposal({
      campaign: {
        worldState: pending.worldState,
        regionalGraph: pending.regionalGraph,
        wizardNews: pending.wizardNews,
      },
      saves: [...items.values()].map(entry => ({ id: entry.id, name: entry.name, settlement: entry.settlement })),
      proposalId: pending.proposals[0].id,
      now: NOW,
    });

    expect(applied.worldState.relationshipStates['edge.c.a'].relationshipType).toBe('vassal');
    expect(applied.worldState.relationshipStates['edge.a.b'].relationshipType).toBe('hostile');
    expect(applied.regionalGraph.edges.find(edge => edge.id === 'edge.a.b').relationshipType).toBe('hostile');
  });

  test('the subjugation proposal names the realignments before the DM accepts', () => {
    const { regionalGraph, relationshipStates, items } = cascadeWorld();
    const snapshot = {
      worldState: { tick: 4, relationshipStates },
      regionalGraph,
      byId: items,
    };
    const pressures = pressureIndex(pressureRows({
      c: { economy: 0.08, defense: 0.08, conflict: 0.12 },
      a: { economy: 0.9, defense: 0.9, conflict: 0.88 },
      b: {},
    }));

    const candidates = evaluateRelationshipRules(snapshot, pressures, { tick: 4 });
    const subjugation = candidates.find(c => c.ruleId === 'hostile_occupation_pressure');

    expect(subjugation).toBeTruthy();
    expect(subjugation.applyMode).toBe('proposal');
    // The summary the proposal carries names the third party and the flip.
    expect(subjugation.summary).toMatch(/realigns 1 third-party relationship/);
    expect(subjugation.summary).toMatch(/Briarwatch allied becomes hostile/);
    expect(subjugation.reasons.some(reason => /Realignment on acceptance: Briarwatch/.test(reason))).toBe(true);

    // No third parties -> no realignment prose (identity no-op).
    const quiet = evaluateRelationshipRules({
      worldState: { tick: 4, relationshipStates: { 'edge.c.a': relationshipStates['edge.c.a'] } },
      regionalGraph: { edges: [regionalGraph.edges[0]], channels: [] },
      byId: items,
    }, pressures, { tick: 4 });
    const quietSubjugation = quiet.find(c => c.ruleId === 'hostile_occupation_pressure');
    expect(quietSubjugation.summary).not.toMatch(/realigns/);
  });

  test('the preview reports the same realignments the cascade executes', () => {
    const { regionalGraph, relationshipStates } = cascadeWorld();
    const preview = previewRelationshipHierarchyCascade({
      worldState: { tick: 4, relationshipStates },
      regionalGraph,
      vassalEdge: regionalGraph.edges[0],
      overlordId: 'c',
      vassalId: 'a',
      vassalState: { ...relationshipStates['edge.c.a'], relationshipType: 'vassal' },
    });

    expect(preview).toEqual([{
      edgeKey: 'edge.a.b',
      fromType: 'allied',
      toType: 'hostile',
      reason: expect.any(String),
      thirdPartyId: 'b',
    }]);

    const executed = resolveRelationshipHierarchy({
      worldState: {
        tick: 4,
        relationshipStates: {
          ...relationshipStates,
          'edge.c.a': { ...relationshipStates['edge.c.a'], relationshipType: 'vassal' },
        },
      },
      regionalGraph,
      vassalEdge: regionalGraph.edges[0],
      now: NOW,
      tick: 4,
    });
    expect(executed.cascadeChanges.map(({ edgeKey, fromType, toType }) => ({ edgeKey, fromType, toType })))
      .toEqual(preview.map(({ edgeKey, fromType, toType }) => ({ edgeKey, fromType, toType })));
  });

  test('a state-stamped reversed vassal edge cascades from the true overlord', () => {
    // The vassal edge is AUTHORED a -> c, but the state stamps overlord = c
    // (the stronger side subjugated from 'to'). The cascade must still drag
    // a's alliance into c's war.
    const { relationshipStates } = cascadeWorld();
    const regionalGraph = {
      edges: [
        { id: 'edge.a.c', from: 'a', to: 'c', relationshipType: 'vassal' },
        { id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'allied' },
        { id: 'edge.b.c', from: 'b', to: 'c', relationshipType: 'hostile' },
      ],
      channels: [],
    };
    const worldState = {
      tick: 4,
      relationshipStates: {
        'edge.a.c': { ...relationshipStates['edge.c.a'], relationshipType: 'vassal', overlordSaveId: 'c', vassalSaveId: 'a' },
        'edge.a.b': relationshipStates['edge.a.b'],
        'edge.b.c': relationshipStates['edge.b.c'],
      },
    };

    const result = resolveRelationshipHierarchy({
      worldState,
      regionalGraph,
      vassalEdge: regionalGraph.edges[0],
      now: NOW,
      tick: 4,
    });

    expect(result.changes).toHaveLength(1);
    expect(result.changes[0]).toMatchObject({
      relationshipKey: 'edge.a.b',
      fromType: 'allied',
      toType: 'hostile',
      overlordId: 'c',
      vassalId: 'a',
      thirdPartyId: 'b',
    });
  });
});
