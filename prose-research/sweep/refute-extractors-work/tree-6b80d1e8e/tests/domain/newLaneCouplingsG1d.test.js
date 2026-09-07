import { describe, expect, test } from 'vitest';

import { applyPartyImpact } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { mapEventToPartyImpact } from '../../src/domain/events/partyEventLinkage.js';
import { PARTY_IMPACT_KINDS } from '../../src/domain/worldPulse/partyImpactKinds.js';
import {
  evaluateDeityStanceLane, pactCooldownPairs, footholdCooldownKeys, footholdCooldownKey, STANCE_LANE_TUNING,
} from '../../src/domain/worldPulse/deityStanceLane.js';
import { advanceReligionStates } from '../../src/domain/worldPulse/religiousContest.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { addRegionalChannels, deriveRegionalImpacts, applyRegionalImpact } from '../../src/domain/region/index.js';
import { normalizeGoodsList } from '../../src/domain/region/goodsCatalog.js';
import { findActiveCondition } from '../../src/domain/activeConditions.js';

// ─────────────────────────────────────────────────────────────────────────────
// G1d — the four "new-lane couplings". Pins prove the intended same-seed shift;
// the golden fixtures stay byte-identical because these paths are dormant in the
// auto-tick golden scenarios (party impacts are discrete DM injections; the
// relief/cooldown/pantheon-tier paths are conditionally materialized).
// ─────────────────────────────────────────────────────────────────────────────

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
  return { id, name, phase: 'canon', settlement: settlement(name, patch), campaignState: { phase: 'canon', eventLog: [], locks: {} } };
}

function campaign(relType, overrides = {}) {
  return {
    id: 'camp-g1d',
    name: 'G1d Campaign',
    settlementIds: ['a', 'b'],
    worldState: {
      rngSeed: 'g1d-seed',
      tick: 5,
      stressors: [],
      relationshipStates: {
        'edge.a.b': { relationshipType: relType, trust: relType === 'hostile' ? 0.05 : 0.45, resentment: relType === 'hostile' ? 0.78 : 0.12, fear: relType === 'hostile' ? 0.72 : 0.08 },
      },
      ...(overrides.worldState || {}),
    },
    regionalGraph: ensureRegionalGraph({ edges: [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: relType }] }),
    wizardNews: { currentTick: 5, entries: [] },
    ...overrides,
  };
}

const SAVES = [save('a', 'Ashford'), save('b', 'Briarwatch')];

describe('[domain-events-region-1] DM relationship events reach the live conflict layer', () => {
  test('partyEventLinkage maps BROKERED_ALLIANCE → broker_relationship carrying the pair', () => {
    const action = mapEventToPartyImpact({ type: 'BROKERED_ALLIANCE', targetId: 'b', partyCaused: true, description: 'A truce was brokered' }, 'a');
    expect(action).toMatchObject({
      kind: 'broker_relationship',
      settlementId: 'a',
      relationshipTargetId: 'b',
      magnitude: PARTY_IMPACT_KINDS.broker_relationship.defaultMagnitude,
      note: 'A truce was brokered',
    });
    // No pre-baked relationshipKey — it is resolved from the live edge downstream.
    expect(action.relationshipKey).toBeUndefined();
  });

  test('partyEventLinkage maps SETTLEMENT_DISPUTE → inflame_relationship carrying the pair', () => {
    const action = mapEventToPartyImpact({ type: 'SETTLEMENT_DISPUTE', targetId: 'b', partyCaused: true }, 'a');
    expect(action).toMatchObject({ kind: 'inflame_relationship', settlementId: 'a', relationshipTargetId: 'b' });
  });

  test('a party-brokered alliance measurably de-escalates the pulse relationshipState (edge resolved by id)', () => {
    const action = mapEventToPartyImpact({ type: 'BROKERED_ALLIANCE', targetId: 'b', partyCaused: true, description: 'The party brokered peace' }, 'a');
    const result = applyPartyImpact({ campaign: campaign('hostile'), saves: SAVES, action, now: NOW });
    expect(result).not.toBeNull();
    const rel = result.worldState.relationshipStates['edge.a.b'];
    // hostile (idx 0) + round(0.6*2)=1 step → cold_war. Peace-making is no longer cosmetic.
    expect(rel.relationshipType).toBe('cold_war');
    expect(rel.resentment).toBeLessThan(0.78);
    expect(rel.trust).toBeGreaterThan(0.05);
    // The graph edge the war layer reads tracks the brokered shift.
    const edge = result.regionalGraph.edges.find(e => e.id === 'edge.a.b');
    expect(edge.relationshipType).toBe('cold_war');
  });

  test('a party dispute measurably sours the pulse relationshipState', () => {
    const action = mapEventToPartyImpact({ type: 'SETTLEMENT_DISPUTE', targetId: 'b', partyCaused: true }, 'a');
    const result = applyPartyImpact({ campaign: campaign('neutral'), saves: SAVES, action, now: NOW });
    const rel = result.worldState.relationshipStates['edge.a.b'];
    expect(rel.resentment).toBeGreaterThan(0.12);
    expect(['cold_war', 'rival']).toContain(rel.relationshipType);
    const edge = result.regionalGraph.edges.find(e => e.id === 'edge.a.b');
    expect(['cold_war', 'rival']).toContain(edge.relationshipType);
  });

  test('the edge is resolved by settlement NAME as well as id (event targetId may be a name)', () => {
    const action = mapEventToPartyImpact({ type: 'BROKERED_ALLIANCE', targetId: 'Briarwatch', partyCaused: true }, 'a');
    const result = applyPartyImpact({ campaign: campaign('hostile'), saves: SAVES, action, now: NOW });
    const rel = result.worldState.relationshipStates['edge.a.b'];
    expect(rel.relationshipType).toBe('cold_war');
  });

  test('an explicit relationshipKey still wins (the DM-picker path is unchanged)', () => {
    const result = applyPartyImpact({
      campaign: campaign('hostile'),
      saves: SAVES,
      action: { kind: 'broker_relationship', relationshipKey: 'edge.a.b', magnitude: 0.8, label: 'Truce' },
      now: NOW,
    });
    const rel = result.worldState.relationshipStates['edge.a.b'];
    expect(rel.relationshipType).toBe('rival'); // round(0.8*2)=2 steps
  });
});

// ─────────────────────────────────────────────────────────────────────────────

const LG = { name: 'Aurum', alignmentAxis: 'good', lawAxis: 'lawful', _deityRef: 'Aurum' };
const CG = { name: 'Sylra', alignmentAxis: 'good', lawAxis: 'chaotic', _deityRef: 'Sylra' };
const ALWAYS_LOW_RNG = { fork: () => ({ random: () => 0 }) };

describe('[worldpulse-religion-trade-2] per-tick re-emitters gain cooldown/metronome discipline', () => {
  test('pactCooldownPairs reads a recent faith-pact from pulseHistory, and expires it past the window', () => {
    const hist = (atTick) => ({ pulseHistory: [{ tick: atTick, selectedOutcomes: [{ ruleId: 'religious_pact_formation', tick: atTick, metadata: { pairKey: 'high::river' } }] }] });
    // within PACT_COOLDOWN_TICKS (6) of the announcement ⇒ on cooldown
    expect(pactCooldownPairs(hist(5), 5 + STANCE_LANE_TUNING.PACT_COOLDOWN_TICKS - 1).has('high::river')).toBe(true);
    // at/after the window ⇒ free to re-announce
    expect(pactCooldownPairs(hist(5), 5 + STANCE_LANE_TUNING.PACT_COOLDOWN_TICKS).has('high::river')).toBe(false);
    // a betrayal outcome is NOT a pact ⇒ never populates the pact cooldown
    expect(pactCooldownPairs({ pulseHistory: [{ tick: 5, selectedOutcomes: [{ ruleId: 'religious_pact_betrayal', tick: 5, metadata: { pairKey: 'high::river' } }] }] }, 6).size).toBe(0);
  });

  test('a pact re-announces at most once per cooldown window (metronome), not every tick', () => {
    const args = { pairs: [{ a: 'high', b: 'river', positive: false }], deityOf: (id) => (id === 'high' ? LG : CG), pietyMultOf: () => 1, nameFor: (id) => id, tick: 3, rng: ALWAYS_LOW_RNG };
    // Fresh pair (empty cooldown) ⇒ the pact announces.
    const fresh = evaluateDeityStanceLane({ ...args, pactCooldown: new Set() });
    expect(fresh.pacts.length).toBe(1);
    // Same pair on cooldown ⇒ suppressed (no re-print).
    const cooled = evaluateDeityStanceLane({ ...args, pactCooldown: new Set(['high::river']) });
    expect(cooled.pacts.length).toBe(0);
    expect(cooled.outcomes.length).toBe(0);
  });

  test('footholdCooldownKeys reads a recent targeted foothold from pulseHistory (keyed cid×rival×minister)', () => {
    const key = footholdCooldownKey('cid1', 'rivalRef', 'npc7');
    expect(key).toBe('cid1::rivalRef::npc7');
    const hist = (atTick) => ({ pulseHistory: [{ tick: atTick, selectedOutcomes: [{ ruleId: 'religious_targeted_foothold', tick: atTick, metadata: { settlementId: 'cid1', rivalRef: 'rivalRef', npcId: 'npc7' } }] }] });
    expect(footholdCooldownKeys(hist(10), 10 + STANCE_LANE_TUNING.FOOTHOLD_COOLDOWN_TICKS - 1).has(key)).toBe(true);
    expect(footholdCooldownKeys(hist(10), 10 + STANCE_LANE_TUNING.FOOTHOLD_COOLDOWN_TICKS).has(key)).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────

const rdeity = (name, align, law, rank) => ({ _deityRef: `custom:g4_${name.toLowerCase()}`, name, alignmentAxis: align, lawAxis: law, rankAxis: rank });
function rsave(id, name, d, tier) {
  return { id, name, phase: 'canon', settlement: {
    name, tier, population: tier === 'city' ? 20000 : 3000,
    config: { tradeRouteAccess: 'road', priorityEconomy: 30, primaryDeityRef: d._deityRef, primaryDeitySnapshot: d },
    institutions: [], economicState: { primaryExports: [], primaryImports: [] },
    powerStructure: { publicLegitimacy: { score: 50, label: 'Stable' }, factions: [{ faction: 'Council', category: 'civic', power: 60, isGoverning: true }], conflicts: [] },
    npcs: [], activeConditions: [],
  }, campaignState: { phase: 'canon', eventLog: [], locks: {} } };
}
// A cult-RANK deity in the CITY projecting authority to the town along an allied edge.
const RISING = rdeity('Rising', 'good', 'lawful', 'cult');
const FADED = rdeity('Faded', 'neutral', 'neutral', 'cult');
function religionRun(pantheon) {
  const saves = [rsave('a', 'Acity', RISING, 'city'), rsave('b', 'Btown', FADED, 'town')];
  const worldState = { rngSeed: 'g4', tick: 3, simulationRules: { religionDynamicsEnabled: true, faithSpreadEnabled: true }, ...(pantheon ? { pantheon } : {}) };
  const campaign = { id: 'g4', name: 'g4', settlementIds: ['a', 'b'], worldState,
    regionalGraph: ensureRegionalGraph({ edges: [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'allied' }] }),
    wizardNews: { currentTick: 3, entries: [] } };
  const snapshot = buildWorldSnapshot({ campaign, saves, worldState });
  const rng = createPRNG('g4::tick:3');
  const r = advanceReligionStates({ snapshot, worldState, tick: 3, now: NOW, rules: { religionDynamicsEnabled: true, faithSpreadEnabled: true }, rng });
  const ch = (r.graphChannels || []).find(c => c.type === 'religious_authority' && String(c.from) === 'a');
  return ch ? ch.strength : null;
}

describe('[worldpulse-religion-trade-4] earned pantheon tier feeds conversion strength', () => {
  test('a cult-RANK deity promoted to a MAJOR pantheon tier projects religious authority harder', () => {
    const base = religionRun(null);                                   // no pantheon ⇒ base cult rank
    const promoted = religionRun({ [RISING._deityRef]: { wins: 6, losses: 0, seats: 6, tier: 'major', tierHeld: 0 } });
    // The mint fired at all (carrier reached the town).
    expect(base).toBeGreaterThan(0);
    // The seat-won 'major' tier lifts the projected authority strength above the
    // static cult-rank baseline — the success-breeds-success loop now closes.
    expect(promoted).toBeGreaterThan(base);
  });

  test('byte-identity gate: a pantheon entry at the deity\'s own tier does NOT change strength', () => {
    const base = religionRun(null);
    // A cult-tier pantheon entry equals the deity\'s cult rankAxis ⇒ max() is a no-op.
    const sameTier = religionRun({ [RISING._deityRef]: { wins: 0, losses: 0, seats: 0, tier: 'cult', tierHeld: 0 } });
    expect(sameTier).toBe(base);
  });
});

// ─────────────────────────────────────────────────────────────────────────────

const reliefDelta = (kind) => ({ id: 'delta.supplier.relief', sourceSettlementId: 'supplier', sourceSettlementName: 'Granary Ford', changes: [{ kind, magnitude: 0.45, source: 'route' }] });

describe('[domain-events-region-7] recovery/relief propagation', () => {
  test('a route_restored at the source mints a bounded RELIEF impact to its trade dependents', () => {
    const graph = addRegionalChannels(null, [
      { type: 'trade_dependency', from: 'supplier', to: 'buyer', goods: normalizeGoodsList(['Grain']), status: 'confirmed', strength: 1, confidence: 1 },
    ]);
    const impacts = deriveRegionalImpacts(reliefDelta('route_restored'), graph);
    const relief = impacts.find(i => i.kind === 'relief');
    expect(relief).toBeTruthy();
    expect(String(relief.targetSettlementId)).toBe('buyer');
    // It carries the negative archetype it will early-expire at the target.
    expect(relief.relievesArchetype).toBe('regional_import_shortage');
  });

  test('applying the relief EARLY-EXPIRES the matching negative regional condition at the target', () => {
    const graph = addRegionalChannels(null, [
      { type: 'trade_dependency', from: 'supplier', to: 'buyer', goods: normalizeGoodsList(['Grain']), status: 'confirmed', strength: 1, confidence: 1 },
    ]);
    const relief = deriveRegionalImpacts(reliefDelta('route_restored'), graph).find(i => i.kind === 'relief');
    const buyer = { name: 'Buyer', activeConditions: [
      { id: 'condition.regional_import_shortage.live', archetype: 'regional_import_shortage', severity: 0.6, label: 'Regional import shortage' },
      { id: 'condition.unrelated.live', archetype: 'plague', severity: 0.5, label: 'Plague' },
    ] };
    const after = applyRegionalImpact(buyer, relief);
    // The import shortage lifts NOW (grain flows again)…
    expect(findActiveCondition(after, 'regional_import_shortage')).toBeNull();
    // …but the relief is bounded to its ONE archetype: unrelated conditions survive.
    expect(findActiveCondition(after, 'plague')).toBeTruthy();
  });

  test('relief is BOUNDED to a single hop — it never wave-propagates into a downstream SHOCK', () => {
    const graph = addRegionalChannels(null, [
      { type: 'trade_dependency', from: 'supplier', to: 'buyer', goods: normalizeGoodsList(['Grain']), status: 'confirmed', strength: 1, confidence: 1 },
      { type: 'trade_route', from: 'buyer', to: 'market', goods: normalizeGoodsList(['Grain']), status: 'confirmed', strength: 0.8, confidence: 1 },
    ]);
    const impacts = deriveRegionalImpacts(reliefDelta('route_restored'), graph, { maxDepth: 2, waveDecay: 0.5 });
    // Exactly one relief (supplier→buyer); no waved impact reaches 'market', and
    // crucially none is a phantom shock (import_shortage / route_disruption).
    expect(impacts.filter(i => i.kind === 'relief')).toHaveLength(1);
    expect(impacts.some(i => String(i.targetSettlementId) === 'market')).toBe(false);
    expect(impacts.every(i => i.kind === 'relief')).toBe(true);
  });

  test('a relief change through a non-trade channel carries no relief (bounded to trade/service)', () => {
    const graph = addRegionalChannels(null, [
      { type: 'political_authority', from: 'supplier', to: 'buyer', status: 'confirmed', strength: 1, confidence: 1 },
    ]);
    const impacts = deriveRegionalImpacts(reliefDelta('route_restored'), graph);
    expect(impacts.filter(i => i.kind === 'relief')).toHaveLength(0);
  });
});
