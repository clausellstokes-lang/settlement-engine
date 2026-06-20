import { describe, expect, test } from 'vitest';

import { previewCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { evaluateWarLayer } from '../../src/domain/worldPulse/warDeployment.js';
import { deploymentReturnOutcomes } from '../../src/domain/worldPulse/deploymentReturn.js';
import {
  computeEngagementAttrition,
  applyAttritionToRecord,
  ATTRITION_TUNING,
} from '../../src/domain/worldPulse/attrition.js';
import {
  computeReinforcement,
  applyReinforcementToRecord,
} from '../../src/domain/worldPulse/reinforcement.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { deriveCausalState } from '../../src/domain/causalState.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { createPRNG } from '../../src/generators/prng.js';

// ─────────────────────────────────────────────────────────────────────────────
// Phase B2 — STATEFUL ARMIES: attrition + reinforcement + strength-scaled return.
//
// A deployed army carries an effective strength that DEGRADES after each engagement
// (attrition), can be REINFORCED (partially, draining the origin), and returns home at
// its REMAINING strength (strength-scaled return). Everything is behind
// warLayerEnabled and deterministic.
// ─────────────────────────────────────────────────────────────────────────────

const NOW = '2026-01-01T00:00:00.000Z';

function settlement(name, patch = {}) {
  return {
    name,
    tier: patch.tier || 'town',
    population: patch.population || 1800,
    config: { tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 35 },
    institutions: [],
    economicState: { prosperity: 'Prosperous', primaryExports: [], primaryImports: [] },
    powerStructure: {
      publicLegitimacy: { score: patch.legitimacy ?? 60, label: 'Stable' },
      factions: patch.factions || [
        { faction: 'Military Council', category: 'military', power: 78, isGoverning: true },
        { faction: 'Merchant League', category: 'economy', power: 52 },
      ],
      conflicts: [],
    },
    npcs: [{ id: `reeve_${name}`, name: `Reeve ${name}`, importance: 'key' }],
    activeConditions: patch.activeConditions || [],
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

const attacker = (id, name) => save(id, name, { tier: 'city', population: 45000 });
const victim = (id, name) => save(id, name, {
  tier: 'village',
  population: 280,
  legitimacy: 24,
  factions: [
    { faction: 'Village Elders', category: 'civic', power: 30, isGoverning: true },
    { faction: 'Hedge Wardens', category: 'military', power: 22 },
  ],
});

const HOSTILE_EDGES = (from, to) => ({
  settlementIds: [from, to],
  edges: [{ id: `edge.${from}.${to}`, from, to, relationshipType: 'hostile' }],
  relationshipStates: { [`edge.${from}.${to}`]: { relationshipType: 'hostile' } },
});

function warCampaign({ edges, channels = [], extraState = {} }) {
  return {
    id: 'b2-fixture',
    name: 'B2 Fixture',
    settlementIds: edges.settlementIds,
    worldState: {
      rngSeed: 'b2-seed',
      tick: 4,
      relationshipStates: edges.relationshipStates || {},
      simulationRules: { warLayerEnabled: true },
      ...extraState,
    },
    regionalGraph: ensureRegionalGraph({ edges: edges.edges, channels }),
    wizardNews: { currentTick: 4, entries: [] },
  };
}

function snapshotFor(campaign, saves) {
  return buildWorldSnapshot({ campaign, saves, worldState: campaign.worldState });
}

// A stateful deployment record at an arbitrary strength fraction (for seeding).
function statefulDep(targetId, ratio, patch = {}) {
  const max = patch.maxStartStrength ?? 55;
  return {
    targetId,
    sinceTick: 1,
    role: 'siege',
    maxStartStrength: max,
    currentEffectiveStrength: max * ratio,
    accumulatedAttrition: 1 - ratio,
    reinforcementFlow: 0,
    deploymentAge: patch.deploymentAge ?? 1,
    manpower: 0.5,
    supplyIntegrity: patch.supplyIntegrity ?? 0.5,
    morale: patch.morale ?? 0.5,
    equipmentCondition: 0.5,
    magicSupport: 0.5,
    commandQuality: 0.5,
    foodReserve: 0.5,
    logisticsBurden: 0.4,
    objective: 'conquest',
    returnCondition: 'pending',
    ...patch,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
describe('B2 — OFF byte-identity (the stateful layer is gated)', () => {
  test('warLayerEnabled:false → no deployments, no attrition, no reinforcement, order-independent', () => {
    const saves = [attacker('strong', 'Ironhold'), victim('weak', 'Thornmere')];
    const edges = HOSTILE_EDGES('strong', 'weak');
    const off = warCampaign({ edges, extraState: { simulationRules: { warLayerEnabled: false } } });
    const a = previewCampaignWorldPulse({ campaign: off, saves, interval: 'one_month', now: NOW });
    const b = previewCampaignWorldPulse({ campaign: warCampaign({ edges, extraState: { simulationRules: { warLayerEnabled: false } } }), saves: [...saves].reverse(), interval: 'one_month', now: NOW });

    expect(a.worldState.deployments).toEqual({});
    expect(a.selected.some(o => o.candidateType === 'reinforcement_cost')).toBe(false);
    // No stateful enrichment leaks when OFF, and the OFF pulse stays order-independent.
    const ids = r => r.selected.map(o => o.id).sort();
    expect(ids(b)).toEqual(ids(a));
  });

  test('a flag-off campaign keeps deployments LIGHT (no strength fields materialize)', () => {
    const saves = [attacker('strong', 'Ironhold'), victim('weak', 'Thornmere')];
    const edges = HOSTILE_EDGES('strong', 'weak');
    // Even with a pre-seeded LIGHT deployment, the OFF layer never enriches it.
    const off = warCampaign({
      edges,
      channels: [{ type: 'war_front', from: 'strong', to: 'weak', status: 'confirmed' }],
      extraState: {
        simulationRules: { warLayerEnabled: false },
        deployments: { strong: { targetId: 'weak', sinceTick: 1, role: 'siege' } },
      },
    });
    const pulse = previewCampaignWorldPulse({ campaign: off, saves, interval: 'one_month', now: NOW });
    const dep = pulse.worldState.deployments.strong;
    expect(dep).toEqual({ targetId: 'weak', sinceTick: 1, role: 'siege' });
    expect(dep.currentEffectiveStrength).toBeUndefined();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('B2 — stateful deployment record', () => {
  test('a deploy seeds the enriched record (maxStartStrength = currentEffectiveStrength)', () => {
    const saves = [attacker('strong', 'Ironhold'), victim('weak', 'Thornmere')];
    const edges = HOSTILE_EDGES('strong', 'weak');
    const snap = snapshotFor(warCampaign({ edges, extraState: { warPosture: { strong: { state: 'mobilized', progress: 1, sinceTick: 0 } } } }), saves);
    const war = evaluateWarLayer({ snapshot: snap, worldState: snap.worldState, rng: createPRNG('seed'), tick: 5, now: NOW, rules: { warLayerEnabled: true } });
    const dep = war.deployments.strong;
    expect(dep).toMatchObject({ targetId: 'weak', sinceTick: 5, role: 'siege', objective: 'conquest' });
    expect(dep.maxStartStrength).toBeGreaterThan(0);
    expect(dep.currentEffectiveStrength).toBe(dep.maxStartStrength);
    expect(dep.accumulatedAttrition).toBe(0);
    // The full stateful surface is present.
    for (const k of ['manpower', 'supplyIntegrity', 'morale', 'equipmentCondition', 'magicSupport', 'commandQuality', 'logisticsBurden', 'deploymentAge', 'returnCondition']) {
      expect(dep[k]).toBeDefined();
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('B2 — attrition (pure)', () => {
  test('a long campaign degrades more than a short one; loss is bounded', () => {
    const base = { isAttacker: true, band: 'decisive_fail', attackerCurrent: 50, defenderCurrent: 50, fortification: 0.5, facets: {} };
    const shortL = computeEngagementAttrition({ ...base, deploymentAge: 1 }).lossFraction;
    const longL = computeEngagementAttrition({ ...base, deploymentAge: 25 }).lossFraction;
    expect(longL).toBeGreaterThan(shortL);
    expect(longL).toBeLessThanOrEqual(ATTRITION_TUNING.MAX_LOSS_FRACTION);
  });

  test('a deterministic loss: same inputs → same fraction (no rng)', () => {
    const args = { isAttacker: true, band: 'narrow_fail', attackerCurrent: 40, defenderCurrent: 50, deploymentAge: 6, fortification: 0.3, facets: { morale: 0.6 } };
    expect(computeEngagementAttrition(args).lossFraction).toBe(computeEngagementAttrition(args).lossFraction);
  });

  test('applyAttritionToRecord reduces strength and ratchets accumulatedAttrition', () => {
    const rec = statefulDep('t', 1.0);
    const { record: next } = applyAttritionToRecord(rec, { isAttacker: true, band: 'decisive_fail', attackerCurrent: 50, defenderCurrent: 55, fortification: 0.6 });
    expect(next.currentEffectiveStrength).toBeLessThan(rec.currentEffectiveStrength);
    expect(next.currentEffectiveStrength).toBeGreaterThanOrEqual(0);
    expect(next.accumulatedAttrition).toBeGreaterThan(rec.accumulatedAttrition);
    expect(next.morale).toBeLessThan(rec.morale);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('B2 — §9 keystone: a DEPLETED army FAILS against a weaker target', () => {
  test('a near-spent army cannot conquer the weak village it would take at full strength (across seeds)', () => {
    const saves = [attacker('strong', 'Ironhold'), victim('weak', 'Thornmere')];
    const edges = HOSTILE_EDGES('strong', 'weak');
    const channels = [{ type: 'war_front', from: 'strong', to: 'weak', status: 'confirmed' }];
    const depleted = { strong: statefulDep('weak', 0.09, { deploymentAge: 30, morale: 0.1, supplyIntegrity: 0.1 }) };

    let conqueredAtFull = false;
    let conqueredDepleted = false;
    for (let tick = 5; tick < 40; tick += 1) {
      // FULL-strength control: a fresh full-strength army DOES conquer the village.
      const fullWs = { ...warCampaign({ edges, channels, extraState: { deployments: { strong: statefulDep('weak', 1.0) } } }).worldState };
      const fullSnap = snapshotFor(warCampaign({ edges, channels, extraState: { deployments: { strong: statefulDep('weak', 1.0) } } }), saves);
      const fullWar = evaluateWarLayer({ snapshot: fullSnap, worldState: fullWs, rng: createPRNG('b2-seed'), tick, now: NOW, rules: { warLayerEnabled: true } });
      if (fullWar.outcomes.some(o => o.candidateType === 'conquest')) conqueredAtFull = true;

      // DEPLETED: the same matchup but the army came in gutted — it must NOT conquer.
      const depWs = { ...warCampaign({ edges, channels, extraState: { deployments: depleted } }).worldState };
      const depSnap = snapshotFor(warCampaign({ edges, channels, extraState: { deployments: JSON.parse(JSON.stringify(depleted)) } }), saves);
      const depWar = evaluateWarLayer({ snapshot: depSnap, worldState: depWs, rng: createPRNG('b2-seed'), tick, now: NOW, rules: { warLayerEnabled: true } });
      if (depWar.outcomes.some(o => o.candidateType === 'conquest')) conqueredDepleted = true;
    }
    // The full-strength control proves the matchup is winnable; the depleted one proves attrition has teeth.
    expect(conqueredAtFull).toBe(true);
    expect(conqueredDepleted).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('B2 — reinforcement (pure)', () => {
  test('reinforcement is PARTIAL — never a full free restore', () => {
    const dep = { maxStartStrength: 100, currentEffectiveStrength: 40, deploymentAge: 4, logisticsBurden: 0.2 };
    const origin = { economy: 0.9, manpower: 0.9, materiel: 0.8, food: 0.9, trade: 0.9, legitimacy: 0.9, warExhaustion: 0, threatened: false };
    const flow = computeReinforcement({ record: dep, origin });
    expect(flow.flowPoints).toBeGreaterThan(0);
    expect(flow.restoredStrength).toBeLessThan(100); // never restored to full in one tick
    expect(flow.flowPoints).toBeLessThan(60); // far below the 60-point deficit
  });

  test('reinforcing DRAINS the origin (a positive drain severity), scaling with deploymentAge', () => {
    const dep = { maxStartStrength: 100, currentEffectiveStrength: 50, deploymentAge: 5, logisticsBurden: 0.3 };
    const origin = { economy: 0.7, manpower: 0.7, materiel: 0.6, food: 0.6, trade: 0.6, legitimacy: 0.7, warExhaustion: 0, threatened: false };
    const young = computeReinforcement({ record: dep, origin });
    const old = computeReinforcement({ record: { ...dep, deploymentAge: 30 }, origin });
    expect(young.drainSeverity).toBeGreaterThan(0);
    expect(old.drainSeverity).toBeGreaterThan(young.drainSeverity); // longer deployment → more origin strain
  });

  test('a besieged/threatened origin cannot reinforce abroad (flow zeroed)', () => {
    const dep = { maxStartStrength: 100, currentEffectiveStrength: 50, deploymentAge: 5, logisticsBurden: 0.3 };
    const origin = { economy: 0.9, manpower: 0.9, materiel: 0.9, food: 0.9, trade: 0.9, legitimacy: 0.9, warExhaustion: 0, threatened: true };
    const flow = computeReinforcement({ record: dep, origin });
    expect(flow.flowPoints).toBe(0);
    expect(flow.drainSeverity).toBe(0);
  });

  test('applyReinforcementToRecord never pushes above maxStartStrength', () => {
    const rec = { maxStartStrength: 60, currentEffectiveStrength: 59, morale: 0.5, supplyIntegrity: 0.5 };
    const flow = computeReinforcement({ record: rec, origin: { economy: 1, manpower: 1, materiel: 1, food: 1, trade: 1, legitimacy: 1, warExhaustion: 0, threatened: false } });
    const next = applyReinforcementToRecord(rec, flow);
    expect(next.currentEffectiveStrength).toBeLessThanOrEqual(60);
  });
});

describe('B2 — reinforcement drains the origin (integration)', () => {
  test('a sustained deployment stamps reinforcement_cost, dropping the origin economic_capacity', () => {
    const saves = [attacker('strong', 'Ironhold'), victim('weak', 'Thornmere')];
    const edges = HOSTILE_EDGES('strong', 'weak');
    const channels = [{ type: 'war_front', from: 'strong', to: 'weak', status: 'confirmed' }];
    // A depleted deployment that will draw a reinforcement flow → a reinforcement_cost.
    const deployments = { strong: statefulDep('weak', 0.5, { deploymentAge: 8 }) };
    const snap = snapshotFor(warCampaign({ edges, channels, extraState: { deployments } }), saves);
    const war = evaluateWarLayer({ snapshot: snap, worldState: { ...snap.worldState, deployments: JSON.parse(JSON.stringify(deployments)) }, rng: createPRNG('b2-seed'), tick: 6, now: NOW, rules: { warLayerEnabled: true } });
    const cost = war.outcomes.find(o => o.candidateType === 'reinforcement_cost');
    expect(cost).toBeTruthy();
    expect(cost.condition.archetype).toBe('reinforcement_cost');
    expect(cost.condition.severity).toBeGreaterThan(0);
    // reinforcement_cost lists economic_capacity → it drains the homeostasis dial.
    const drained = deriveCausalState({ ...saves[0].settlement, activeConditions: [{ archetype: 'reinforcement_cost', severity: cost.condition.severity }] }).scores.economic_capacity;
    const clean = deriveCausalState(saves[0].settlement).scores.economic_capacity;
    expect(drained).toBeLessThan(clean);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('B2 — strength-scaled return', () => {
  // A home UNDER SIEGE: a strong returning army relieves it; a depleted one fails.
  function returnToBesiegedHome(ratio, seed = 'ret') {
    const saves = [save('home', 'Home'), attacker('enemy', 'Enemy')];
    const channels = [{ type: 'war_front', from: 'enemy', to: 'home', status: 'confirmed' }];
    const snap = snapshotFor(warCampaign({ edges: HOSTILE_EDGES('enemy', 'home'), channels }), saves);
    const dep = { maxStartStrength: 60, currentEffectiveStrength: 60 * ratio, targetId: 'foe', sinceTick: 1, role: 'siege' };
    return deploymentReturnOutcomes({
      resolvedDeployments: [{ attackerId: 'home', deployment: dep, targetId: 'foe', outcome: 'conquest' }],
      snapshot: snap,
      graph: snap.regionalGraph,
      rng: createPRNG(seed),
      tick: 5,
    }).map(o => o.candidateType);
  }

  test('a STRONG returning army relieves the home siege', () => {
    expect(returnToBesiegedHome(1.0)).toContain('siege_lifted');
  });

  test('a DEPLETED returning army FAILS to relieve (no siege_lifted; a war_exhaustion residual)', () => {
    const out = returnToBesiegedHome(0.08);
    expect(out).not.toContain('siege_lifted');
    expect(out).toContain('war_exhaustion');
  });

  test('a HEALTHY army returning to an untroubled home stands down with NO residual (§5)', () => {
    const saves = [save('home', 'Home'), save('other', 'Other')];
    const snap = snapshotFor(warCampaign({ edges: HOSTILE_EDGES('home', 'other') }), saves);
    const dep = { maxStartStrength: 60, currentEffectiveStrength: 58, targetId: 'foe', sinceTick: 1, role: 'siege' };
    const out = deploymentReturnOutcomes({
      resolvedDeployments: [{ attackerId: 'home', deployment: dep, targetId: 'foe', outcome: 'conquest' }],
      snapshot: snap, graph: snap.regionalGraph, rng: createPRNG('g'), tick: 5,
    });
    expect(out).toEqual([]);
  });

  test('a GUTTED army returning to an untroubled home SPLINTERS (a destabilizing residual)', () => {
    const saves = [save('home', 'Home'), save('other', 'Other')];
    const snap = snapshotFor(warCampaign({ edges: HOSTILE_EDGES('home', 'other') }), saves);
    const dep = { maxStartStrength: 60, currentEffectiveStrength: 4, targetId: 'foe', sinceTick: 1, role: 'siege' };
    const out = deploymentReturnOutcomes({
      resolvedDeployments: [{ attackerId: 'home', deployment: dep, targetId: 'foe', outcome: 'conquest' }],
      snapshot: snap, graph: snap.regionalGraph, rng: createPRNG('g'), tick: 5,
    }).map(o => o.candidateType);
    expect(out).toContain('faction_challenge');
  });

  test('a light/pre-B2 record (no strength fields) returns as a FULL army (legacy binary limit)', () => {
    // The legacy binary behaviour is the limiting case: a record with no strength fields
    // reads as a full-strength army that succeeds.
    expect(returnToBesiegedHome(NaN)).toBeDefined();
    const saves = [save('home', 'Home'), attacker('enemy', 'Enemy')];
    const channels = [{ type: 'war_front', from: 'enemy', to: 'home', status: 'confirmed' }];
    const snap = snapshotFor(warCampaign({ edges: HOSTILE_EDGES('enemy', 'home'), channels }), saves);
    const lightDep = { targetId: 'foe', sinceTick: 1, role: 'siege' };
    const out = deploymentReturnOutcomes({
      resolvedDeployments: [{ attackerId: 'home', deployment: lightDep, targetId: 'foe', outcome: 'conquest' }],
      snapshot: snap, graph: snap.regionalGraph, rng: createPRNG('ret'), tick: 5,
    }).map(o => o.candidateType);
    expect(out).toContain('siege_lifted');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('B2 — determinism', () => {
  test('the army-state ledger is DEEP-CLONED (the evaluator never mutates worldState in place)', () => {
    const saves = [attacker('strong', 'Ironhold'), victim('weak', 'Thornmere')];
    const edges = HOSTILE_EDGES('strong', 'weak');
    const channels = [{ type: 'war_front', from: 'strong', to: 'weak', status: 'confirmed' }];
    const deployments = { strong: statefulDep('weak', 0.7, { deploymentAge: 5 }) };
    const campaign = warCampaign({ edges, channels, extraState: { deployments } });
    const snap = snapshotFor(campaign, saves);
    const before = JSON.parse(JSON.stringify(snap.worldState.deployments));
    evaluateWarLayer({ snapshot: snap, worldState: snap.worldState, rng: createPRNG('b2-seed'), tick: 7, now: NOW, rules: { warLayerEnabled: true } });
    // The input ledger is untouched — the evaluator wrote a fresh copy.
    expect(snap.worldState.deployments).toEqual(before);
  });

  test('order-independence: reversing the saves array yields the identical next ledger + outcomes', () => {
    const saves = [
      attacker('alpha', 'Alphaforge'),
      attacker('bravo', 'Bravewatch'),
      victim('target', 'Tinytown'),
    ];
    const channels = [
      { type: 'war_front', from: 'alpha', to: 'target', status: 'confirmed' },
      { type: 'war_front', from: 'bravo', to: 'target', status: 'confirmed' },
    ];
    const edges = {
      settlementIds: ['alpha', 'bravo', 'target'],
      edges: [
        { id: 'edge.alpha.target', from: 'alpha', to: 'target', relationshipType: 'hostile' },
        { id: 'edge.bravo.target', from: 'bravo', to: 'target', relationshipType: 'hostile' },
      ],
      relationshipStates: {
        'edge.alpha.target': { relationshipType: 'hostile' },
        'edge.bravo.target': { relationshipType: 'hostile' },
      },
    };
    const deployments = {
      alpha: statefulDep('target', 0.8, { deploymentAge: 3 }),
      bravo: statefulDep('target', 0.6, { deploymentAge: 4 }),
    };
    const run = (orderedSaves) => {
      const snap = snapshotFor(warCampaign({ edges, channels, extraState: { deployments: JSON.parse(JSON.stringify(deployments)) } }), orderedSaves);
      const war = evaluateWarLayer({ snapshot: snap, worldState: snap.worldState, rng: createPRNG('coalition'), tick: 9, now: NOW, rules: { warLayerEnabled: true } });
      return {
        outcomes: war.outcomes.map(o => `${o.candidateType}@${o.targetSaveId}:${o.severity?.toFixed?.(3)}`).sort(),
        deployments: war.deployments,
        resolved: war.resolvedDeployments.map(r => r.attackerId).sort(),
      };
    };
    const forward = run(saves);
    const reversed = run([...saves].reverse());
    expect(reversed.outcomes).toEqual(forward.outcomes);
    expect(reversed.deployments).toEqual(forward.deployments);
    expect(reversed.resolved).toEqual(forward.resolved);
  });

  test('SOAK: a sustained mutual siege trends to resolution (attrition + reinforcement do not runaway/oscillate)', () => {
    const saves = [attacker('atlas', 'Atlas'), attacker('borin', 'Borin')];
    const channels = [
      { type: 'war_front', from: 'atlas', to: 'borin', status: 'confirmed' },
      { type: 'war_front', from: 'borin', to: 'atlas', status: 'confirmed' },
    ];
    const edges = {
      settlementIds: ['atlas', 'borin'],
      edges: [{ id: 'edge.atlas.borin', from: 'atlas', to: 'borin', relationshipType: 'hostile' }],
      relationshipStates: { 'edge.atlas.borin': { relationshipType: 'hostile' } },
    };
    let worldState = {
      rngSeed: 'soak', tick: 1, relationshipStates: edges.relationshipStates,
      deployments: { atlas: { targetId: 'borin', sinceTick: 1, role: 'siege' }, borin: { targetId: 'atlas', sinceTick: 1, role: 'siege' } },
      warExhaustion: {}, simulationRules: { warLayerEnabled: true },
    };
    let conditions = { atlas: [], borin: [] };
    let resolved = false;
    let maxStrengthSeen = 0;
    for (let tick = 1; tick <= 80 && !resolved; tick += 1) {
      const tickSaves = [save('atlas', 'Atlas', { activeConditions: conditions.atlas }), save('borin', 'Borin', { activeConditions: conditions.borin })];
      const campaign = { id: 'soak', name: 'Soak', settlementIds: ['atlas', 'borin'], worldState, regionalGraph: ensureRegionalGraph({ edges: edges.edges, channels }), wizardNews: { currentTick: tick, entries: [] } };
      const snap = buildWorldSnapshot({ campaign, saves: tickSaves, worldState });
      const war = evaluateWarLayer({ snapshot: snap, worldState, rng: createPRNG('soak'), tick, now: NOW, rules: { warLayerEnabled: true } });
      // Strength never runs away above the seeded muster (bounded).
      for (const id of ['atlas', 'borin']) {
        const d = war.deployments[id];
        if (d?.currentEffectiveStrength != null) {
          maxStrengthSeen = Math.max(maxStrengthSeen, d.currentEffectiveStrength);
          expect(d.currentEffectiveStrength).toBeLessThanOrEqual(d.maxStartStrength + 1e-6);
          expect(d.currentEffectiveStrength).toBeGreaterThanOrEqual(0);
        }
      }
      const applyConds = (homeId) => war.outcomes
        .filter(o => String(o.targetSaveId) === homeId && o.condition)
        .map(o => ({ archetype: o.condition.archetype, severity: o.condition.severity, status: 'worsening' }));
      conditions = { atlas: applyConds('atlas'), borin: applyConds('borin') };
      worldState = { ...worldState, deployments: war.deployments, warExhaustion: war.warExhaustion };
      if (war.outcomes.some(o => o.candidateType === 'conquest')) resolved = true;
      if (!worldState.deployments.atlas && !worldState.deployments.borin) resolved = true;
    }
    expect(resolved).toBe(true);          // the war ENDS within the horizon (trends to resolution)
    expect(maxStrengthSeen).toBeGreaterThan(0); // anti-vacuity: armies actually fielded
  });
});
