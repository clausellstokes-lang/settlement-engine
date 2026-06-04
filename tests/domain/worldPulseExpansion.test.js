import { describe, expect, test } from 'vitest';

import {
  applyWorldPulseOutcomes,
  applyNpcPatch,
  evaluateNpcRules,
  evaluatePopulationDynamics,
  evaluateRelationshipRules,
  evaluateTierResourceDynamics,
  normalizeSimulationRules,
  pressureIndex,
} from '../../src/domain/worldPulse/index.js';

function item(id, settlement, extra = {}) {
  return {
    id,
    name: settlement.name || id,
    settlement,
    activeConditions: settlement.activeConditions || [],
    causal: { scores: {} },
    system: { resourcePressure: { value: 50 } },
    ...extra,
  };
}

function settlement(name, patch = {}) {
  return {
    name,
    tier: 'town',
    population: 1500,
    config: { tradeRouteAccess: 'road', nearbyResources: ['iron_vein'], nearbyResourcesState: {} },
    institutions: [],
    activeConditions: [],
    npcs: [],
    ...patch,
  };
}

describe('World Pulse expansion systems', () => {
  test('simulation rules preserve presets and become custom after manual edits', () => {
    const preset = normalizeSimulationRules({ presetId: 'dramatic_campaign', intensity: 'dramatic', majorChangesRequireProposal: false, migrationMode: 'distributed' });
    expect(preset.schemaVersion).toBe(1);
    expect(preset.presetId).toBe('dramatic_campaign');

    const custom = normalizeSimulationRules({ ...preset, intensity: 'normal' });
    expect(custom.presetId).toBe('custom');
  });

  test('population dynamics can transfer mass emigration into a connected destination', () => {
    const source = item('a', settlement('Ashford', {
      population: 2000,
      activeConditions: [{ archetype: 'famine' }, { archetype: 'war_pressure' }],
    }));
    const dest = item('b', settlement('Briarwatch', { population: 800 }));
    const snapshot = {
      worldState: { tick: 3, simulationRules: normalizeSimulationRules({ migrationMode: 'concentrated' }) },
      regionalGraph: { channels: [{ type: 'migration_pressure', from: 'a', to: 'b', status: 'confirmed' }], edges: [] },
      settlements: [source, dest],
      byId: new Map([['a', source], ['b', dest]]),
    };
    const pressures = pressureIndex([
      { settlementId: 'a', kind: 'food', score: 0.95 },
      { settlementId: 'a', kind: 'conflict', score: 0.9 },
      { settlementId: 'a', kind: 'disease', score: 0.65 },
      { settlementId: 'a', kind: 'trade', score: 0.8 },
      { settlementId: 'a', kind: 'legitimacy', score: 0.7 },
      { settlementId: 'b', kind: 'food', score: 0.1 },
      { settlementId: 'b', kind: 'conflict', score: 0.1 },
      { settlementId: 'b', kind: 'trade', score: 0.1 },
      { settlementId: 'b', kind: 'legitimacy', score: 0.1 },
    ]);

    const candidates = evaluatePopulationDynamics(snapshot, pressures, {
      tick: 4,
      interval: 'one_year',
      simulationRules: normalizeSimulationRules({ migrationMode: 'concentrated', majorChangesRequireProposal: false }),
    });
    const migration = candidates.find(candidate => candidate.candidateType === 'population_emigration');

    expect(migration).toBeTruthy();
    expect(migration.populationDeltas.some(delta => delta.saveId === 'a' && delta.delta < 0)).toBe(true);
    expect(migration.populationDeltas.some(delta => delta.saveId === 'b' && delta.delta > 0)).toBe(true);

    const result = applyWorldPulseOutcomes({
      snapshot,
      worldState: snapshot.worldState,
      regionalGraph: snapshot.regionalGraph,
      settlementMap: new Map([
        ['a', { saveId: 'a', settlement: source.settlement }],
        ['b', { saveId: 'b', settlement: dest.settlement }],
      ]),
      outcomes: [migration],
      tick: 4,
      now: '2026-01-01T00:00:00.000Z',
      simulationRules: snapshot.worldState.simulationRules,
    });

    const updated = new Map(result.settlementUpdates.map(update => [update.saveId, update.settlement]));
    expect(updated.get('a').population).toBeLessThan(2000);
    expect(updated.get('b').population).toBeGreaterThan(800);
  });

  test('tier drift requires a streak and applies promotion institutions only after acceptance', () => {
    const ashford = item('a', settlement('Ashford', { tier: 'town', population: 4700 }));
    const worldState = {
      tick: 8,
      settlementTickStates: {
        a: { tierDrift: { direction: 'promotion', toTier: 'city', streak: 4 } },
      },
      simulationRules: normalizeSimulationRules(),
    };
    const snapshot = {
      worldState,
      regionalGraph: { edges: [], channels: [] },
      settlements: [ashford],
      byId: new Map([['a', ashford]]),
    };
    const lowPressure = pressureIndex([
      { settlementId: 'a', kind: 'food', score: 0.1 },
      { settlementId: 'a', kind: 'conflict', score: 0.1 },
      { settlementId: 'a', kind: 'trade', score: 0.1 },
      { settlementId: 'a', kind: 'legitimacy', score: 0.1 },
      { settlementId: 'a', kind: 'disease', score: 0.1 },
    ]);

    const result = evaluateTierResourceDynamics(worldState, snapshot, lowPressure, { tick: 9 });
    const promotion = result.candidates.find(candidate => candidate.candidateType === 'tier_promotion');

    expect(result.worldState.settlementTickStates.a.tierDrift.streak).toBe(5);
    expect(promotion).toMatchObject({
      applyMode: 'proposal',
      proposalPayload: { kind: 'tier_change', fromTier: 'town', toTier: 'city' },
    });

    const applied = applyWorldPulseOutcomes({
      snapshot,
      worldState: result.worldState,
      regionalGraph: snapshot.regionalGraph,
      settlementMap: new Map([['a', { saveId: 'a', settlement: ashford.settlement }]]),
      outcomes: [{ ...promotion, applyMode: 'auto' }],
      tick: 9,
      now: '2026-01-01T00:00:00.000Z',
    });

    const promoted = applied.settlementUpdates[0].settlement;
    expect(promoted.tier).toBe('city');
    expect(promoted.institutions.some(inst => inst._worldPulseTierAdded)).toBe(true);
    expect(promoted.tierHistory.at(-1).institutionFates.length).toBeGreaterThan(0);
    expect(promoted.institutionHistory.some(entry => entry.fate === 'added')).toBe(true);
  });

  test('hostile subjugation is tier-gated, but plausible conquest proposes vassalage', () => {
    const weakSource = item('h', settlement('Hamlet', { tier: 'hamlet', population: 120 }));
    const cityTarget = item('c', settlement('City', { tier: 'city', population: 10000 }));
    const strongSource = item('o', settlement('Overlook', { tier: 'city', population: 12000 }));
    const smallTarget = item('v', settlement('Vale', { tier: 'village', population: 600 }));

    const pressureRows = [
      { settlementId: 'h', kind: 'conflict', score: 0.1 },
      { settlementId: 'h', kind: 'defense', score: 0.1 },
      { settlementId: 'h', kind: 'economy', score: 0.1 },
      { settlementId: 'c', kind: 'conflict', score: 0.9 },
      { settlementId: 'c', kind: 'defense', score: 0.9 },
      { settlementId: 'c', kind: 'economy', score: 0.9 },
      { settlementId: 'o', kind: 'conflict', score: 0.1 },
      { settlementId: 'o', kind: 'defense', score: 0.1 },
      { settlementId: 'o', kind: 'economy', score: 0.1 },
      { settlementId: 'v', kind: 'conflict', score: 0.9 },
      { settlementId: 'v', kind: 'defense', score: 0.9 },
      { settlementId: 'v', kind: 'economy', score: 0.9 },
    ];
    const pressures = pressureIndex(pressureRows);

    const impossible = evaluateRelationshipRules({
      worldState: { tick: 1, relationshipStates: { 'edge.h.c': { relationshipType: 'hostile', resentment: 0.9, fear: 0.8 } } },
      regionalGraph: { edges: [{ id: 'edge.h.c', from: 'h', to: 'c', relationshipType: 'hostile' }] },
      byId: new Map([['h', weakSource], ['c', cityTarget]]),
    }, pressures, { tick: 2 });
    expect(impossible.some(candidate => candidate.ruleId === 'hostile_occupation_pressure')).toBe(false);

    const plausible = evaluateRelationshipRules({
      worldState: { tick: 1, relationshipStates: { 'edge.o.v': { relationshipType: 'hostile', resentment: 0.9, fear: 0.8 } } },
      regionalGraph: { edges: [{ id: 'edge.o.v', from: 'o', to: 'v', relationshipType: 'hostile' }] },
      byId: new Map([['o', strongSource], ['v', smallTarget]]),
    }, pressures, { tick: 2 });
    const vassal = plausible.find(candidate => candidate.ruleId === 'hostile_occupation_pressure');
    expect(vassal?.proposalPayload).toMatchObject({ kind: 'relationship_label_change', toType: 'vassal' });
  });

  test('shared enemies can propose alliances and vassals can birth rebellion pressure', () => {
    const settlements = ['a', 'b', 'c', 'o', 'v'].map(id => [id, item(id, settlement(id))]);
    const byId = new Map(settlements);
    const pressures = pressureIndex(['a', 'b', 'c', 'o', 'v'].flatMap(settlementId => [
      { settlementId, kind: 'conflict', score: settlementId === 'v' ? 0.8 : 0.65 },
      { settlementId, kind: 'legitimacy', score: settlementId === 'v' ? 0.85 : 0.2 },
      { settlementId, kind: 'trade', score: settlementId === 'v' ? 0.8 : 0.2 },
    ]));

    const allianceCandidates = evaluateRelationshipRules({
      worldState: {
        tick: 1,
        relationshipStates: {
          'edge.a.b': { relationshipType: 'neutral', trust: 0.55, resentment: 0.1, pactStrength: 0.1 },
          'edge.a.c': { relationshipType: 'hostile' },
          'edge.b.c': { relationshipType: 'hostile' },
        },
      },
      regionalGraph: {
        edges: [
          { id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'neutral' },
          { id: 'edge.a.c', from: 'a', to: 'c', relationshipType: 'hostile' },
          { id: 'edge.b.c', from: 'b', to: 'c', relationshipType: 'hostile' },
        ],
      },
      byId,
    }, pressures, { tick: 2 });
    expect(allianceCandidates.some(candidate => candidate.ruleId === 'shared_enemy_alliance')).toBe(true);

    const vassalCandidates = evaluateRelationshipRules({
      worldState: {
        tick: 1,
        relationshipStates: {
          'edge.o.v': { relationshipType: 'vassal', trust: 0.2, resentment: 0.82, dependency: 0.85, leverage: 0.85, fear: 0.5 },
        },
        stressors: [],
      },
      regionalGraph: { edges: [{ id: 'edge.o.v', from: 'o', to: 'v', relationshipType: 'vassal' }] },
      byId,
    }, pressures, { tick: 2 });
    expect(vassalCandidates.some(candidate => candidate.candidateType === 'vassal_rebellion')).toBe(true);
  });

  test('vassalage can stabilize when strain is low and trust is high', () => {
    const byId = new Map([
      ['o', item('o', settlement('Overlook'))],
      ['v', item('v', settlement('Vale'))],
    ]);
    const pressures = pressureIndex(['o', 'v'].flatMap(settlementId => [
      { settlementId, kind: 'conflict', score: 0.08 },
      { settlementId, kind: 'legitimacy', score: 0.08 },
      { settlementId, kind: 'trade', score: 0.08 },
      { settlementId, kind: 'crime', score: 0.05 },
    ]));

    const candidates = evaluateRelationshipRules({
      worldState: {
        tick: 4,
        relationshipStates: {
          'edge.o.v': { relationshipType: 'vassal', trust: 0.74, resentment: 0.08, dependency: 0.68, leverage: 0.5, fear: 0.2, pactStrength: 0.82 },
        },
        stressors: [],
      },
      regionalGraph: { edges: [{ id: 'edge.o.v', from: 'o', to: 'v', relationshipType: 'vassal' }] },
      byId,
    }, pressures, { tick: 5 });

    const stable = candidates.find(candidate => candidate.candidateType === 'vassal_stability_compact');
    expect(stable).toBeTruthy();
    expect(stable.relationshipPatch).toMatchObject({ trajectory: 'stable_vassalage' });
    expect(stable.relationshipPatch.resentment).toBeLessThan(0.08);
  });

  test('NPC goals rebranch when settlement context changes without mutating personality anchors', () => {
    const npcState = {
      npcId: 'a:merchant',
      settlementId: 'a',
      name: 'Mara Coinhand',
      roleArchetype: 'merchant',
      factionId: 'guild',
      factionSeat: 'agent_protege',
      dotRank: 1,
      influenceBasis: ['wealth'],
      contextSignature: 'town|local|',
      contextTier: 'town',
      shortGoal: 'earn_gold',
      longGoal: 'open_shop',
      ideal: 'prosperity',
      flaw: 'greed',
      ambition: 0.8,
      loyalty: 0.5,
      momentum: 0,
      corruption: false,
      goalProgress: { short: 0.4, long: 0.2 },
      rivalryTargets: [],
    };
    const snapshot = {
      worldState: { tick: 4, npcStates: { [npcState.npcId]: npcState }, relationshipStates: {} },
      regionalGraph: { edges: [] },
      settlements: [item('a', settlement('Ashford', { tier: 'city' }))],
    };

    const candidates = evaluateNpcRules(snapshot, pressureIndex([]), { tick: 5 });
    const rebranch = candidates.find(candidate => candidate.candidateType === 'npc_goal_rebranch');

    expect(rebranch).toBeTruthy();
    expect(rebranch.npcPatch.shortGoal).toBe('join_guild');
    expect(rebranch.npcPatch.longGoal).toBe('expand_trade_house');
    expect(rebranch.reasons.join(' ')).toContain('ideal prosperity');
    expect(rebranch.reasons.join(' ')).toContain('flaw greed');

    const applied = applyNpcPatch({ tick: 5, npcStates: { [npcState.npcId]: npcState } }, rebranch);
    expect(applied.npcStates[npcState.npcId].goalHistory.at(-1)).toMatchObject({
      fromShortGoal: 'earn_gold',
      toShortGoal: 'join_guild',
      fromLongGoal: 'open_shop',
      toLongGoal: 'expand_trade_house',
    });
  });
});
