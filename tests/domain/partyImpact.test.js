import { describe, expect, test } from 'vitest';

import { applyPartyImpact, PARTY_IMPACT_KINDS } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

const NOW = '2026-02-01T00:00:00.000Z';

function settlement(name, patch = {}) {
  return {
    name,
    tier: 'town',
    population: 1600,
    config: { tradeRouteAccess: 'road' },
    institutions: [],
    economicState: { primaryExports: [], primaryImports: [] },
    powerStructure: { publicLegitimacy: { score: 40 }, factions: [], conflicts: [] },
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

function campaign(overrides = {}) {
  return {
    id: 'camp-party',
    name: 'Party Campaign',
    settlementIds: ['a', 'b'],
    worldState: {
      rngSeed: 'party-seed',
      tick: 5,
      stressors: [
        { id: 'world_stressor.siege.a', type: 'siege', severity: 0.82, affectedSettlementIds: ['a'], residualEffects: ['damaged_walls'] },
      ],
      relationshipStates: {
        'edge.a.b': { relationshipType: 'hostile', trust: 0.05, resentment: 0.78, fear: 0.72 },
      },
      ...(overrides.worldState || {}),
    },
    regionalGraph: ensureRegionalGraph({
      edges: [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'hostile' }],
    }),
    wizardNews: { currentTick: 5, entries: [] },
    ...overrides,
  };
}

const SAVES = [
  save('a', 'Ashford', { activeConditions: [{ archetype: 'plague', severity: 0.6 }] }),
  save('b', 'Briarwatch'),
];

describe('party impact — the table changes the world', () => {
  test('resolve_stressor ends the crisis and leaves a residual condition', () => {
    const result = applyPartyImpact({
      campaign: campaign(),
      saves: SAVES,
      action: { kind: 'resolve_stressor', stressorId: 'world_stressor.siege.a', label: 'The party broke the siege of Ashford' },
      now: NOW,
    });

    expect(result).not.toBeNull();
    // The siege is gone from world state.
    expect((result.worldState.stressors || []).some(s => s.id === 'world_stressor.siege.a')).toBe(false);
    // Ashford now carries the residual aftereffects as an active condition.
    const ashford = result.settlementUpdates.find(u => String(u.saveId) === 'a');
    expect(ashford.settlement.activeConditions.some(c => c.archetype === 'stressor_residual')).toBe(true);
    // Wizard News records it as party-sourced.
    expect(result.wizardNews.entries.some(e => (e.tags || []).includes('party_stressor_residual') || (e.impactKind || '').startsWith('party'))).toBe(true);
  });

  test('broker_relationship de-escalates the type and softens the vector', () => {
    const result = applyPartyImpact({
      campaign: campaign(),
      saves: SAVES,
      action: { kind: 'broker_relationship', relationshipKey: 'edge.a.b', magnitude: 0.8, label: 'The party brokered a truce' },
      now: NOW,
    });

    expect(result).not.toBeNull();
    const rel = result.worldState.relationshipStates['edge.a.b'];
    // hostile (idx 0) + round(0.8*2)=2 steps → rival.
    expect(rel.relationshipType).toBe('rival');
    expect(rel.resentment).toBeLessThan(0.78);
    expect(rel.trust).toBeGreaterThan(0.05);
    // The graph edge label tracks the brokered shift.
    const edge = result.regionalGraph.edges.find(e => e.id === 'edge.a.b');
    expect(edge.relationshipType).toBe('rival');
  });

  test('inflame_relationship escalates toward hostility', () => {
    const result = applyPartyImpact({
      campaign: campaign({ worldState: {
        rngSeed: 'party-seed', tick: 5, stressors: [],
        relationshipStates: { 'edge.a.b': { relationshipType: 'neutral', trust: 0.45, resentment: 0.12, fear: 0.08 } },
      } }),
      saves: SAVES,
      action: { kind: 'inflame_relationship', relationshipKey: 'edge.a.b', magnitude: 0.6, label: 'The party started a feud' },
      now: NOW,
    });
    const rel = result.worldState.relationshipStates['edge.a.b'];
    expect(rel.resentment).toBeGreaterThan(0.12);
    expect(['cold_war', 'rival']).toContain(rel.relationshipType);
  });

  test('remove_npc imposes a leadership void on the settlement', () => {
    const result = applyPartyImpact({
      campaign: campaign(),
      saves: SAVES,
      action: { kind: 'remove_npc', settlementId: 'a', npcId: 'reeve', label: 'The party assassinated the Reeve' },
      now: NOW,
    });
    const ashford = result.settlementUpdates.find(u => String(u.saveId) === 'a');
    expect(ashford.settlement.activeConditions.some(c => c.archetype === 'dominant_npc_removed')).toBe(true);
  });

  test('clear_condition removes an active condition (the party cured the plague)', () => {
    const result = applyPartyImpact({
      campaign: campaign(),
      saves: SAVES,
      action: { kind: 'clear_condition', settlementId: 'a', condition: 'plague', label: 'The party cured the plague' },
      now: NOW,
    });
    const ashford = result.settlementUpdates.find(u => String(u.saveId) === 'a');
    expect(ashford.settlement.activeConditions.some(c => c.archetype === 'plague')).toBe(false);
  });

  test('impose_condition adds a new condition', () => {
    const result = applyPartyImpact({
      campaign: campaign(),
      saves: SAVES,
      action: { kind: 'impose_condition', settlementId: 'b', archetype: 'corruption_exposed', magnitude: 0.6, label: 'The party exposed the magistrate' },
      now: NOW,
    });
    const briar = result.settlementUpdates.find(u => String(u.saveId) === 'b');
    expect(briar.settlement.activeConditions.some(c => c.archetype === 'corruption_exposed')).toBe(true);
  });

  test('invalid actions are a safe no-op (null)', () => {
    expect(applyPartyImpact({ campaign: campaign(), saves: SAVES, action: { kind: 'not_a_kind' }, now: NOW })).toBeNull();
    expect(applyPartyImpact({ campaign: campaign(), saves: SAVES, action: { kind: 'resolve_stressor', stressorId: 'does.not.exist' }, now: NOW })).toBeNull();
    expect(applyPartyImpact({ campaign: campaign(), saves: SAVES, action: null, now: NOW })).toBeNull();
  });

  test('every catalog kind documents its required targets', () => {
    for (const [kind, spec] of Object.entries(PARTY_IMPACT_KINDS)) {
      expect(Array.isArray(spec.targets), `${kind} has targets`).toBe(true);
      expect(typeof spec.defaultMagnitude).toBe('number');
    }
  });
});
