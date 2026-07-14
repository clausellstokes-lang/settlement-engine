import { describe, expect, test } from 'vitest';

import { evaluateSettlementStrategyRules } from '../../src/domain/worldPulse/settlementStrategy.js';
import { evaluateWarLayer } from '../../src/domain/worldPulse/warDeployment.js';
import { evaluateMobilizationReactions } from '../../src/domain/worldPulse/mobilizationReactions.js';
import { deploymentReturnOutcomes } from '../../src/domain/worldPulse/deploymentReturn.js';
import { applyWorldPulseOutcomes } from '../../src/domain/worldPulse/index.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { deriveSettlementPressures, pressureIndex } from '../../src/domain/worldPulse/pressureModel.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { relationshipKeyFromEdge } from '../../src/domain/worldPulse/relationshipEvolution.js';
import { governingFactionOf } from '../../src/domain/rulingPower.js';
import { createPRNG } from '../../src/kernel/prng.js';

// ─────────────────────────────────────────────────────────────────────────────
// G1a — "THE WAR MACHINE OBEYS ITS POLITICS." Pins for the five war fixes:
//   war-2  approved faction proposals apply for real (government / institution / power)
//   war-3  sue-for-peace grips the physical war (the siege deployment withdraws)
//   war-4  the return_home emergency recall EXECUTES (and de-duplicates)
//   war-5  the M9a non-war levers gain bounded apply effects (relationship nudges)
//   war-6  the pacific mobilization reactions gain bounded relationship payloads
// ─────────────────────────────────────────────────────────────────────────────

const NOW = '2026-01-01T00:00:00.000Z';

function settlement(name, patch = {}) {
  return {
    name,
    tier: patch.tier || 'town',
    population: patch.population || 1800,
    config: { tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 35 },
    institutions: patch.institutions || [],
    economicState: { prosperity: patch.prosperity || 'Prosperous', primaryExports: [], primaryImports: [] },
    powerStructure: {
      publicLegitimacy: { score: patch.legitimacy ?? 60, label: 'Stable' },
      factions: patch.factions || [
        { faction: 'Military Council', category: 'military', power: 78, isGoverning: true },
        { faction: 'Merchant League', category: 'merchant', power: 52 },
      ],
      conflicts: [],
    },
    npcs: patch.npcs || [{ id: `reeve_${name}`, name: `Reeve ${name}`, importance: 'key' }],
    activeConditions: patch.activeConditions || [],
  };
}

function save(id, name, patch = {}) {
  return { id, name, phase: 'canon', settlement: settlement(name, patch), campaignState: { phase: 'canon', eventLog: [], locks: {} } };
}

const strongSave = (id, name, patch = {}) => save(id, name, { tier: 'city', population: 45000, ...patch });
const weakSave = (id, name, patch = {}) => save(id, name, {
  tier: 'village', population: 280, legitimacy: 24,
  factions: [
    { faction: 'Village Elders', category: 'civic', power: 30, isGoverning: true },
    { faction: 'Hedge Wardens', category: 'military', power: 22 },
  ],
  ...patch,
});

function applyOutcomes({ settlements = [], worldState, graph, outcomes, tick = 6 }) {
  const settlementMap = new Map(settlements.map(s => [String(s.id), { saveId: String(s.id), save: { name: s.name }, settlement: s.settlement }]));
  const snapshot = {
    regionalGraph: graph || ensureRegionalGraph({ edges: [], channels: [] }),
    settlements: settlements.map(s => ({ id: s.id, settlement: s.settlement, name: s.name })),
    campaign: {},
  };
  return applyWorldPulseOutcomes({
    snapshot,
    worldState,
    regionalGraph: snapshot.regionalGraph,
    wizardNews: { currentTick: tick, entries: [] },
    settlementMap,
    outcomes,
    tick,
    now: NOW,
    advanceNewsTick: false,
    advanceRegionalImpacts: false,
    simulationRules: worldState.simulationRules || {},
  });
}

const factionByName = (settlement, name) =>
  (settlement.powerStructure.factions || []).find(f => String(f.faction || f.name).toLowerCase() === String(name).toLowerCase());

// ─────────────────────────────────────────────────────────────────────────────
// war-2 — approved faction proposals apply for real
// ─────────────────────────────────────────────────────────────────────────────
describe('war-2 — approved faction proposals apply for real', () => {
  function townWith(factions, institutions = []) {
    return save('town', 'Millhaven', { factions, institutions });
  }

  test('government_change transfers the ruling seat (the challenger ascends, the government relabels)', () => {
    const factions = [
      { faction: 'Old Guard', category: 'military', power: 60, isGoverning: true },
      { faction: 'Merchant League', category: 'merchant', power: 45 },
    ];
    const town = townWith(factions);
    const before = governingFactionOf(town.settlement).faction;
    const outcome = {
      id: 'candidate.faction.government.town.6', type: 'faction', candidateType: 'faction_government_challenge',
      ruleFamily: 'faction', targetSaveId: 'town', factionId: 'town:merchant_league', severity: 0.7, probability: 1, applyMode: 'auto',
      headline: 'Merchant League may government challenge', summary: '', reasons: [],
      factionPatch: { momentum: 0.5 },
      metadata: { factionName: 'Merchant League', archetype: 'merchant' },
      proposalPayload: { kind: 'government_change', factionId: 'town:merchant_league', settlementId: 'town', governmentPreference: 'merchant_charter', legitimacyBand: 'crisis', preserveInstitutions: true },
    };
    const result = applyOutcomes({ settlements: [town], worldState: { tick: 6, simulationRules: {} }, outcomes: [outcome] });
    const after = result.settlementUpdates.find(e => e.saveId === 'town').settlement;
    // The seat actually changed — no longer 'Old Guard'.
    expect(governingFactionOf(after).faction).not.toBe(before);
    // The challenging faction ascended (+6 power, 'ascendant').
    const merchant = factionByName(after, 'Merchant League');
    expect(merchant.modifiers).toContain('ascendant');
    expect(merchant.power).toBe(45 + 6);
  });

  test('institution_suppression impairs the named institution (status bites, not just a text list)', () => {
    const town = townWith(
      [{ faction: 'Reformers', category: 'civic', power: 50, isGoverning: true }],
      [{ id: 'temple', name: 'Grand Temple', status: 'active' }],
    );
    const outcome = {
      id: 'candidate.faction.suppress.town.6', type: 'faction', candidateType: 'faction_institution_suppression',
      ruleFamily: 'faction', targetSaveId: 'town', factionId: 'town:reformers', severity: 0.7, probability: 1, applyMode: 'auto',
      headline: '', summary: '', reasons: [], factionPatch: { suppressedInstitutions: ['temple'] },
      metadata: { factionName: 'Reformers' },
      proposalPayload: { kind: 'institution_suppression', factionId: 'town:reformers', settlementId: 'town', institutionId: 'temple', institutionName: 'Grand Temple' },
    };
    const result = applyOutcomes({ settlements: [town], worldState: { tick: 6, simulationRules: {} }, outcomes: [outcome] });
    const after = result.settlementUpdates.find(e => e.saveId === 'town').settlement;
    const inst = after.institutions.find(i => i.name === 'Grand Temple');
    expect((inst.impairments || []).some(i => i.type === 'legitimacy')).toBe(true);
    expect(inst.status).toBe('impaired');
  });

  test('faction_power_shift moves bounded power from the rival to the contesting faction', () => {
    const factions = [
      { faction: 'A House', category: 'merchant', power: 50, isGoverning: true },
      { faction: 'B House', category: 'merchant', power: 40 },
    ];
    const town = townWith(factions);
    const worldState = { tick: 6, simulationRules: {}, factionStates: { 'town:a_house': { name: 'A House' }, 'town:b_house': { name: 'B House' } } };
    const outcome = {
      id: 'candidate.faction.shift.town.6', type: 'faction', candidateType: 'faction_rival_power_contest',
      ruleFamily: 'faction', targetSaveId: 'town', factionId: 'town:a_house', severity: 0.7, probability: 1, applyMode: 'auto',
      headline: '', summary: '', reasons: [], factionPatch: { momentum: 0.4 },
      metadata: { factionName: 'A House', rivalFactionId: 'town:b_house' },
      proposalPayload: { kind: 'faction_power_shift', factionId: 'town:a_house', rivalFactionId: 'town:b_house', settlementId: 'town', cause: 'rival_power_contest' },
    };
    const result = applyOutcomes({ settlements: [town], worldState, outcomes: [outcome] });
    const after = result.settlementUpdates.find(e => e.saveId === 'town').settlement;
    // Bounded transfer of 8 (FACTION_POWER_SHIFT_AMOUNT): A +8, B −8; conserved.
    expect(factionByName(after, 'A House').power).toBe(58);
    expect(factionByName(after, 'B House').power).toBe(32);
  });

  test('institution_capture bumps the capturing faction bounded power (two-way: reversible by a later shift)', () => {
    const factions = [
      { faction: 'Guild', category: 'merchant', power: 40, isGoverning: true },
      { faction: 'Watch', category: 'military', power: 35 },
    ];
    const town = townWith(factions, [{ id: 'market', name: 'Grand Market' }]);
    const outcome = {
      id: 'candidate.faction.capture.town.6', type: 'faction', candidateType: 'faction_institution_capture',
      ruleFamily: 'faction', targetSaveId: 'town', factionId: 'town:guild', severity: 0.7, probability: 1, applyMode: 'auto',
      headline: '', summary: '', reasons: [], factionPatch: { controlledInstitutions: ['market'] },
      metadata: { factionName: 'Guild' },
      proposalPayload: { kind: 'institution_capture', factionId: 'town:guild', settlementId: 'town', institutionId: 'market', institutionName: 'Grand Market' },
    };
    const result = applyOutcomes({ settlements: [town], worldState: { tick: 6, simulationRules: {} }, outcomes: [outcome] });
    const after = result.settlementUpdates.find(e => e.saveId === 'town').settlement;
    expect(factionByName(after, 'Guild').power).toBe(45); // +5 FACTION_CAPTURE_POWER_GAIN
  });

  test('byte-safe: a faction outcome WITHOUT a payload leaves the roster untouched (the cosmetic path)', () => {
    const factions = [
      { faction: 'Guild', category: 'merchant', power: 40, isGoverning: true },
      { faction: 'Watch', category: 'military', power: 35 },
    ];
    const town = townWith(factions);
    const outcome = {
      id: 'candidate.faction.exh.town.6', type: 'faction', candidateType: 'faction_exhaustion',
      ruleFamily: 'faction', targetSaveId: 'town', factionId: 'town:guild', severity: 0.4, probability: 1, applyMode: 'auto',
      headline: '', summary: '', reasons: [], factionPatch: { momentum: 0.1 }, proposalPayload: null,
    };
    const result = applyOutcomes({ settlements: [town], worldState: { tick: 6, simulationRules: {} }, outcomes: [outcome] });
    const after = result.settlementUpdates.find(e => e.saveId === 'town').settlement;
    // No payload ⇒ the roster is byte-identical (only the factionState ledger moved).
    expect(factionByName(after, 'Guild').power).toBe(40);
    expect(factionByName(after, 'Watch').power).toBe(35);
    expect(after.powerStructure.factions).toEqual(town.settlement.powerStructure.factions);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// war-3 — sue-for-peace grips the physical war
// ─────────────────────────────────────────────────────────────────────────────
describe('war-3 — sue-for-peace winds down the physical siege', () => {
  const EDGE = { id: 'edge.strong.weak', from: 'strong', to: 'weak', relationshipType: 'hostile' };
  const KEY = relationshipKeyFromEdge(EDGE);

  test('an approved hostile→cold_war label change stamps the recall order on the besieger deployment', () => {
    const graph = ensureRegionalGraph({ edges: [EDGE], channels: [{ type: 'war_front', from: 'strong', to: 'weak', status: 'confirmed' }] });
    const worldState = {
      tick: 6, simulationRules: { warLayerEnabled: true },
      relationshipStates: { [KEY]: { relationshipType: 'hostile' } },
      deployments: { strong: { targetId: 'weak', sinceTick: 1, role: 'siege' } },
    };
    const outcome = {
      id: 'candidate.strategy.sue_for_peace.strong.6', type: 'relationship', candidateType: 'strategy_sue_for_peace',
      ruleFamily: 'strategy', targetSaveId: 'strong', severity: 0.72, probability: 1, applyMode: 'auto',
      headline: 'Strong sues for peace', summary: '', reasons: [],
      relationshipKey: KEY, relationshipPatch: { proposedRelationshipType: 'cold_war', trajectory: 'transitioning' },
      proposalPayload: { kind: 'relationship_label_change', relationshipKey: KEY, fromType: 'hostile', toType: 'cold_war', reason: 'peace' },
    };
    const result = applyOutcomes({ settlements: [strongSave('strong', 'Ironhold'), weakSave('weak', 'Thornmere')], worldState, graph, outcomes: [outcome] });
    expect(result.worldState.deployments.strong.recalled).toBeTruthy();
    expect(result.worldState.deployments.strong.recalled.cause).toBe('sue_for_peace');
  });

  test('the war layer EXECUTES a recalled siege as a withdrawal, retires its front, and cannot re-conquer', () => {
    const saves = [strongSave('strong', 'Ironhold'), weakSave('weak', 'Thornmere')];
    const graph = ensureRegionalGraph({ edges: [EDGE], channels: [{ type: 'war_front', from: 'strong', to: 'weak', status: 'confirmed' }] });
    const frontId = (graph.channels || []).find(c => c.type === 'war_front').id;
    const worldState = {
      rngSeed: 'war', tick: 7, simulationRules: { warLayerEnabled: true },
      relationshipStates: { [KEY]: { relationshipType: 'hostile' } },
      deployments: { strong: { targetId: 'weak', sinceTick: 1, role: 'siege', recalled: { cause: 'sue_for_peace', tick: 6 } } },
    };
    const snap = buildWorldSnapshot({ campaign: { id: 'w', settlementIds: ['strong', 'weak'], worldState, regionalGraph: graph, wizardNews: { currentTick: 7, entries: [] } }, saves, worldState });
    const war = evaluateWarLayer({ snapshot: snap, worldState: snap.worldState, rng: createPRNG('war'), tick: 7, now: NOW, rules: { warLayerEnabled: true } });
    // Resolved as a withdrawal → the army goes home through deploymentReturn.
    expect(war.resolvedDeployments).toContainEqual(expect.objectContaining({ attackerId: 'strong', targetId: 'weak', outcome: 'withdrawal' }));
    expect(war.deployments.strong).toBeUndefined();          // the deployment is cleared
    expect(war.retiredChannels).toContain(frontId);          // the front retires
    expect(war.outcomes.some(o => o.candidateType === 'conquest')).toBe(false); // NO phantom conquest
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// war-4 — the emergency recall EXECUTES + de-duplicates
// ─────────────────────────────────────────────────────────────────────────────
describe('war-4 — return_home executes and de-duplicates', () => {
  function besiegedFixture(deploymentPatch = {}) {
    const saves = [strongSave('strong', 'Ironhold'), weakSave('weak', 'Thornmere'), strongSave('enemy', 'Grimwall')];
    const graph = ensureRegionalGraph({
      edges: [
        { id: 'edge.strong.weak', from: 'strong', to: 'weak', relationshipType: 'hostile' },
        { id: 'edge.enemy.strong', from: 'enemy', to: 'strong', relationshipType: 'hostile' },
      ],
      channels: [{ type: 'war_front', from: 'enemy', to: 'strong', status: 'confirmed' }],
    });
    const worldState = {
      rngSeed: 'war', tick: 6, simulationRules: { warLayerEnabled: true, settlementStrategyEnabled: true },
      relationshipStates: { 'edge.strong.weak': { relationshipType: 'hostile' }, 'edge.enemy.strong': { relationshipType: 'hostile' } },
      deployments: { strong: { targetId: 'weak', sinceTick: 1, role: 'siege', ...deploymentPatch } },
    };
    return { saves, graph, worldState };
  }

  test('applying a return_home outcome stamps the recall order onto the committed army', () => {
    const { saves, graph, worldState } = besiegedFixture();
    const outcome = {
      id: 'candidate.strategy.return_home.strong.6', type: 'condition', candidateType: 'strategy_return_home',
      ruleFamily: 'strategy', targetSaveId: 'strong', severity: 0.95, probability: 1, applyMode: 'auto',
      headline: 'Strong recalls its army', summary: '', reasons: [], metadata: { settlementId: 'strong', strategyMove: 'return_home', recallTargetId: 'weak' },
    };
    const result = applyOutcomes({
      settlements: saves.map(s => ({ id: s.id, name: s.name, settlement: s.settlement })),
      worldState, graph, outcomes: [outcome],
    });
    expect(result.worldState.deployments.strong.recalled).toBeTruthy();
    expect(result.worldState.deployments.strong.recalled.cause).toBe('return_home');
  });

  test('the chooser does NOT re-fire return_home once the recall is already pending (dedup)', () => {
    const clean = besiegedFixture();
    const pending = besiegedFixture({ recalled: { cause: 'return_home', tick: 5 } });
    const snapOf = (fx) => {
      const snap = buildWorldSnapshot({ campaign: { id: 'w', settlementIds: ['strong', 'weak', 'enemy'], worldState: fx.worldState, regionalGraph: fx.graph, wizardNews: { currentTick: 6, entries: [] } }, saves: fx.saves, worldState: fx.worldState });
      return { snap, pIdx: pressureIndex(deriveSettlementPressures(snap)) };
    };
    const a = snapOf(clean);
    const b = snapOf(pending);
    const outClean = evaluateSettlementStrategyRules(a.snap, a.pIdx, { tick: 6, simulationRules: { settlementStrategyEnabled: true }, rng: createPRNG('r') });
    const outPending = evaluateSettlementStrategyRules(b.snap, b.pIdx, { tick: 6, simulationRules: { settlementStrategyEnabled: true }, rng: createPRNG('r') });
    // Clean: the recall fires. Pending: strong emits NOTHING (the order is in flight).
    expect(outClean.some(c => c.metadata.settlementId === 'strong' && c.candidateType === 'strategy_return_home')).toBe(true);
    expect(outPending.some(c => c.metadata.settlementId === 'strong')).toBe(false);
  });

  test('the executed recall relieves the besieged home via deploymentReturn (siege relief / failed relief)', () => {
    const { saves, graph, worldState } = besiegedFixture({ recalled: { cause: 'return_home', tick: 5 }, maxStartStrength: 100, currentEffectiveStrength: 95, deployedPopulation: 400 });
    const snap = buildWorldSnapshot({ campaign: { id: 'w', settlementIds: ['strong', 'weak', 'enemy'], worldState, regionalGraph: graph, wizardNews: { currentTick: 6, entries: [] } }, saves, worldState });
    const war = evaluateWarLayer({ snapshot: snap, worldState: snap.worldState, rng: createPRNG('war'), tick: 6, now: NOW, rules: { warLayerEnabled: true } });
    expect(war.resolvedDeployments).toContainEqual(expect.objectContaining({ attackerId: 'strong', outcome: 'withdrawal' }));
    // The home ('strong') is besieged by 'enemy' → deploymentReturn resolves the homecoming.
    const returns = deploymentReturnOutcomes({ resolvedDeployments: war.resolvedDeployments, snapshot: snap, graph: snap.regionalGraph, rng: createPRNG('ret'), tick: 6 });
    const relief = returns.find(o => ['siege_lifted', 'deployment_return_relief'].includes(o.candidateType) || o.ruleId === 'deployment_return_relief' || o.candidateType === 'siege_lifted');
    const homecoming = returns.find(o => o.candidateType === 'army_homecoming');
    // Either a siege relief fired, or the homecoming did (both prove the army actually came home).
    expect(relief || homecoming).toBeTruthy();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// war-5 — the M9a non-war levers gain bounded apply effects
// ─────────────────────────────────────────────────────────────────────────────
describe('war-5 — the merchant/church/warlord levers apply bounded relationship nudges', () => {
  // Beliefs live (spatialCanonVersion + non-omniscient) + a MERCHANT governing seat ⇒
  // the merchant objective's levers (reroute/embargo/credit) enumerate + can be chosen.
  function merchantWorld() {
    const merchant = save('merch', 'Coinhaven', {
      tier: 'city', population: 40000,
      factions: [
        { faction: 'Coin Guild', category: 'merchant', power: 70, isGoverning: true },
        { faction: 'Dock Watch', category: 'military', power: 30 },
      ],
    });
    const rival = weakSave('rival', 'Thornmere');
    const partner = strongSave('ally', 'Greenrest');
    const edges = [
      { id: 'edge.merch.rival', from: 'merch', to: 'rival', relationshipType: 'hostile' },
      { id: 'edge.merch.ally', from: 'merch', to: 'ally', relationshipType: 'trade_partner' },
    ];
    const worldState = {
      rngSeed: 's', tick: 6, spatialCanonVersion: 1,
      simulationRules: { settlementStrategyEnabled: true, infoMode: 'unreliable' },
      relationshipStates: {
        'edge.merch.rival': { relationshipType: 'hostile', resentment: 0.3, dependency: 0.3, trust: 0.2, fear: 0.2, tradeBalance: 0.4 },
        'edge.merch.ally': { relationshipType: 'trade_partner', resentment: 0.1, dependency: 0.3, trust: 0.5, fear: 0.1, tradeBalance: 0.5 },
      },
    };
    const campaign = { id: 'm', settlementIds: ['merch', 'rival', 'ally'], worldState, regionalGraph: ensureRegionalGraph({ edges }), wizardNews: { currentTick: 6, entries: [] } };
    const saves = [merchant, rival, partner];
    const snap = buildWorldSnapshot({ campaign, saves, worldState });
    return { snap, pIdx: pressureIndex(deriveSettlementPressures(snap)) };
  }

  test('a chosen lever carries a BOUNDED relationship nudge + a typed incident (not an inert marker)', () => {
    const { snap, pIdx } = merchantWorld();
    const LEVERS = new Set(['reroute', 'embargo', 'credit', 'missionize', 'legitimacy', 'prestige', 'opportunity']);
    let sawLeverWithNudge = false;
    for (const seed of ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l']) {
      const out = evaluateSettlementStrategyRules(snap, pIdx, { tick: 6, simulationRules: { settlementStrategyEnabled: true }, rng: createPRNG(seed) });
      const lever = out.find(c => c.metadata.settlementId === 'merch' && LEVERS.has(c.metadata.strategyMove));
      if (!lever) continue;
      sawLeverWithNudge = true;
      // It is a real relationship outcome now — key + patch + typed incident.
      expect(lever.type).toBe('relationship');
      expect(lever.relationshipKey).toBeTruthy();
      expect(lever.relationshipPatch && typeof lever.relationshipPatch).toBe('object');
      expect(lever.metadata.incidentType).toBeTruthy();
      // Every nudged scalar is clamped [0,1] and moved by AT MOST the bounded magnitude.
      for (const [scalar, value] of Object.entries(lever.relationshipPatch)) {
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(1);
        const key = lever.relationshipKey;
        const before = Number(snap.worldState.relationshipStates[key]?.[scalar]) || 0;
        expect(Math.abs(Number(value) - before)).toBeLessThanOrEqual(0.05 + 1e-9);
      }
    }
    expect(sawLeverWithNudge).toBe(true);
  });

  test('byte-safe: a DEFAULT (belief-off) chooser emits NO lever candidates at all', () => {
    const merchant = save('merch', 'Coinhaven', {
      tier: 'city', population: 40000,
      factions: [{ faction: 'Coin Guild', category: 'merchant', power: 70, isGoverning: true }, { faction: 'Dock Watch', category: 'military', power: 30 }],
    });
    const edges = [{ id: 'edge.merch.rival', from: 'merch', to: 'rival', relationshipType: 'hostile' }];
    const worldState = { rngSeed: 's', tick: 6, simulationRules: { settlementStrategyEnabled: true }, relationshipStates: { 'edge.merch.rival': { relationshipType: 'hostile' } } };
    const campaign = { id: 'm', settlementIds: ['merch', 'rival'], worldState, regionalGraph: ensureRegionalGraph({ edges }), wizardNews: { currentTick: 6, entries: [] } };
    const saves = [merchant, weakSave('rival', 'Thornmere')];
    const snap = buildWorldSnapshot({ campaign, saves, worldState });
    const pIdx = pressureIndex(deriveSettlementPressures(snap));
    const LEVERS = new Set(['reroute', 'embargo', 'credit', 'missionize', 'legitimacy', 'prestige', 'opportunity']);
    for (const seed of ['a', 'b', 'c', 'd', 'e']) {
      const out = evaluateSettlementStrategyRules(snap, pIdx, { tick: 6, simulationRules: { settlementStrategyEnabled: true }, rng: createPRNG(seed) });
      expect(out.some(c => LEVERS.has(c.metadata.strategyMove))).toBe(false);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// war-6 — the pacific mobilization reactions gain bounded relationship payloads
// ─────────────────────────────────────────────────────────────────────────────
describe('war-6 — negotiate / seek_allies carry bounded relationship payloads', () => {
  // A merchant-governed reactor ⇒ negative aggression baseline ⇒ aggr < FORTIFY_AGGR ⇒
  // the pacific branch (negotiate when dependent, seek_allies when a rival).
  const pacific = (id, name, patch = {}) => save(id, name, {
    factions: [{ faction: 'Coin Guild', category: 'merchant', power: 60, isGoverning: true }],
    ...patch,
  });

  function reactionWorld() {
    const saves = [
      strongSave('mob', 'Warforge'),
      pacific('dep', 'Tradetown'),        // trade_partner of mob → negotiate
      pacific('riv', 'Coldmarch'),        // rival of mob → seek_allies
      strongSave('ally', 'Greenrest'),    // riv's protector
    ];
    const edges = [
      { id: 'edge.mob.dep', from: 'mob', to: 'dep', relationshipType: 'trade_partner' },
      { id: 'edge.mob.riv', from: 'mob', to: 'riv', relationshipType: 'rival' },
      { id: 'edge.riv.ally', from: 'riv', to: 'ally', relationshipType: 'trade_partner' },
    ];
    const worldState = {
      tick: 6, simulationRules: { warLayerEnabled: true },
      warPosture: { mob: { state: 'war_preparation', progress: 0.6, sinceTick: 1, covert: false } },
      // A saturated loss history pulls the merchant reactors below FORTIFY_AGGR (0.95),
      // so they choose the PACIFIC branch (negotiate / seek_allies) — the fix under test.
      dispositionStats: { dep: { score: -8 }, riv: { score: -8 } },
      relationshipStates: {
        'edge.mob.dep': { relationshipType: 'trade_partner', resentment: 0.4, fear: 0.4, trust: 0.3 },
        'edge.mob.riv': { relationshipType: 'rival', resentment: 0.5, fear: 0.4, trust: 0.2 },
        'edge.riv.ally': { relationshipType: 'trade_partner', trust: 0.4, dependency: 0.3 },
      },
    };
    const campaign = { id: 'r', settlementIds: ['mob', 'dep', 'riv', 'ally'], worldState, regionalGraph: ensureRegionalGraph({ edges }), wizardNews: { currentTick: 6, entries: [] } };
    const snap = buildWorldSnapshot({ campaign, saves, worldState });
    return { snap, pIdx: pressureIndex(deriveSettlementPressures(snap)) };
  }

  test('negotiate carries a de-escalation nudge toward the mobilizer (resentment/fear DOWN) + a talks incident', () => {
    const { snap, pIdx } = reactionWorld();
    const out = evaluateMobilizationReactions(snap, pIdx, { tick: 6, simulationRules: { warLayerEnabled: true } });
    const negotiate = out.find(c => c.metadata.reactionMove === 'negotiate');
    expect(negotiate).toBeTruthy();
    expect(negotiate.type).toBe('relationship');
    expect(negotiate.relationshipKey).toBe('edge.mob.dep');
    expect(negotiate.metadata.incidentType).toBe('negotiation');
    // A bounded de-escalation: resentment + fear cooled below their prior values.
    expect(negotiate.relationshipPatch.resentment).toBeLessThan(0.4);
    expect(negotiate.relationshipPatch.fear).toBeLessThan(0.4);
    expect(negotiate.relationshipPatch.resentment).toBeGreaterThanOrEqual(0.4 - 0.05 - 1e-9);
  });

  test('seek_allies carries an overture toward the strongest non-hostile protector (trust UP) + an overture incident', () => {
    const { snap, pIdx } = reactionWorld();
    const out = evaluateMobilizationReactions(snap, pIdx, { tick: 6, simulationRules: { warLayerEnabled: true } });
    const seek = out.find(c => c.metadata.reactionMove === 'seek_allies');
    expect(seek).toBeTruthy();
    expect(seek.type).toBe('relationship');
    expect(seek.relationshipKey).toBe('edge.riv.ally'); // reaches its protector, not the mobilizer
    expect(seek.metadata.incidentType).toBe('alliance_overture');
    expect(seek.relationshipPatch.trust).toBeGreaterThan(0.4);      // warmed toward the ally
    expect(seek.relationshipPatch.trust).toBeLessThanOrEqual(0.4 + 0.05 + 1e-9);
  });

  test('the martial reactions are unchanged (fortify/pre_empt carry a condition, NOT a relationship patch)', () => {
    const { snap, pIdx } = reactionWorld();
    const out = evaluateMobilizationReactions(snap, pIdx, { tick: 6, simulationRules: { warLayerEnabled: true } });
    for (const c of out) {
      if (c.metadata.reactionMove === 'fortify' || c.metadata.reactionMove === 'pre_empt') {
        expect(c.type).toBe('condition');
        expect(c.relationshipPatch).toBeUndefined();
      }
    }
  });

  test('byte-safe: OFF ⇒ no reaction candidates at all', () => {
    const { snap, pIdx } = reactionWorld();
    expect(evaluateMobilizationReactions(snap, pIdx, { tick: 6, simulationRules: { warLayerEnabled: false } })).toEqual([]);
  });
});
