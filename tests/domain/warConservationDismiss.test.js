import { describe, expect, test } from 'vitest';

import {
  evaluateWarLayer,
  computeLevySources,
  revertSuppressedDeployExhaustion,
} from '../../src/domain/worldPulse/warDeployment.js';
import { deploymentReturnOutcomes } from '../../src/domain/worldPulse/deploymentReturn.js';
import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/pulseKernel.js';
import { deriveActiveCondition } from '../../src/domain/activeConditions.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { createPRNG } from '../../src/generators/prng.js';

/**
 * The war-economy CONSERVATION seam (all flag-gated, default OFF — byte-identical when
 * off; these pin the flag-ON books). Four coupled invariants:
 *   (1) ONE war_exhaustion condition per home: the accrual path (deployed) and the decay
 *       path (army home) key the condition by the SAME settlement id, so deriveActiveCondition
 *       hashes them to ONE condition id — accrue-then-decay, never a double stamp.
 *   (2) A 'vassal' edge is hierarchical: the OVERLORD levies its vassal (computeLevySources),
 *       never the junior levying its own overlord.
 *   (3) The homecoming credit is tied to the BANKED debit (deployedPopulation), not the live
 *       drain flag — so warLevyEnabled WITHOUT warEconomyDrainEnabled (and mid-war flag
 *       changes) still conserve population: Σ debits === survivors + war dead.
 *   (4) A DM-dismissed strategy_deploy is fully conserving: it strips the deployment seed +
 *       war_front AND the deploy-tick war-exhaustion ratchet (home accrual + levied-vassal
 *       strain) AND withholds the same-tick conscription/levy population debits whose
 *       deployedPopulation bank was stripped with the army.
 */
const NOW = '2026-01-01T00:00:00.000Z';

// ── Shared holding-siege fixture (mirrors warLevy.f2.test.js — a siege that HOLDS
// through step 5 so the deployer's per-tick accrual/levy emissions fire). ──────────
function settlement(name, patch = {}) {
  return {
    name, tier: patch.tier || 'town', population: patch.population || 6000,
    config: { tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 35 },
    institutions: patch.granary ? [{ name: 'State Granary' }] : [],
    economicState: {
      prosperity: 'Prosperous', primaryExports: [], primaryImports: [],
      ...(patch.storageMonths != null ? { foodSecurity: { storageMonths: patch.storageMonths } } : {}),
    },
    powerStructure: {
      publicLegitimacy: { score: patch.legitimacy ?? 60, label: 'Stable' },
      factions: [{ faction: 'Military Council', category: 'military', power: 70, isGoverning: true }],
      conflicts: [],
    },
    npcs: [{ id: `reeve_${name}`, name: `Reeve ${name}`, importance: 'key' }], activeConditions: [],
  };
}
const save = (id, name, patch = {}) => ({ id, name, phase: 'canon', settlement: settlement(name, patch), campaignState: { phase: 'canon', eventLog: [], locks: {} } });
function siegeRecord(targetId, { age, strength }) {
  return {
    targetId, sinceTick: 0, role: 'siege', maxStartStrength: strength, currentEffectiveStrength: strength,
    accumulatedAttrition: 0, reinforcementFlow: 0, deploymentAge: age, manpower: 0.6, supplyIntegrity: 0.6,
    morale: 0.6, equipmentCondition: 0.6, magicSupport: 0.6, commandQuality: 0.6, foodReserve: 0.6,
    logisticsBurden: 0.2, objective: 'conquest', returnCondition: 'pending',
  };
}

const HOSTILE = { id: 'edge.atlas.borin', from: 'atlas', to: 'borin', relationshipType: 'hostile' };
const VASSAL = { id: 'edge.atlas.carth', from: 'atlas', to: 'carth', relationshipType: 'vassal' };

function evaluate({ rules: rulePatch = {}, deployments, warExhaustion = {} } = {}) {
  const saves = [
    save('atlas', 'Atlas', { tier: 'town', population: 6000, storageMonths: 2, granary: true }),
    save('borin', 'Borin', { tier: 'town', population: 4000 }),
    save('carth', 'Carth', { tier: 'village', population: 5000, storageMonths: 4, granary: true }),
  ];
  const rules = { warLayerEnabled: true, ...rulePatch };
  const worldState = {
    rngSeed: 'levy-seed', tick: 100,
    relationshipStates: { [HOSTILE.id]: { relationshipType: 'hostile' }, [VASSAL.id]: { relationshipType: 'vassal' } },
    deployments: deployments ?? { atlas: siegeRecord('borin', { age: 5, strength: 50.9 }) },
    warExhaustion, simulationRules: rules,
  };
  const campaign = {
    id: 'conserve-fixture', name: 'C', settlementIds: ['atlas', 'borin', 'carth'], worldState,
    regionalGraph: ensureRegionalGraph({
      edges: [HOSTILE, VASSAL],
      channels: Object.keys(worldState.deployments).length
        ? [{ type: 'war_front', from: 'atlas', to: 'borin', status: 'confirmed' }]
        : [],
    }),
    wizardNews: { currentTick: 100, entries: [] },
  };
  const snapshot = buildWorldSnapshot({ campaign, saves, worldState });
  return evaluateWarLayer({ snapshot, worldState: snapshot.worldState, rng: createPRNG('levy-seed'), tick: 100, now: NOW, rules });
}

// ── (1) one war_exhaustion condition id across accrual + decay ────────────────────
describe('war_exhaustion accrues and decays as ONE condition (no double stamp)', () => {
  test('the accrual condition and the decay condition hash to the SAME derived condition id', () => {
    // Accrual: atlas deployed, scar ratchets 0.5 → 0.66 (≥ floor ⇒ condition emitted).
    const accruing = evaluate({ warExhaustion: { atlas: 0.5 } });
    const accrual = accruing.outcomes.find(o => o.id === 'world_outcome.war_exhaustion.atlas.100');
    expect(accrual).toBeTruthy();
    // Decay: atlas's army is HOME (no deployment), the scar fades 0.5 → 0.47.
    const decaying = evaluate({ deployments: {}, warExhaustion: { atlas: 0.5 } });
    const decay = decaying.outcomes.find(o => o.id === 'world_outcome.war_exhaustion.atlas.100');
    expect(decay).toBeTruthy();
    // BOTH key the condition by the HOME id, so deriveActiveCondition (which hashes the
    // id from triggeredAt.sourceEventTargetId) mints ONE condition that accrues then
    // decays — not a target-keyed accrual condition lingering beside a home-keyed decay
    // condition, double-stamping the recovery penalty for ticks after the war.
    expect(accrual.condition.triggeredAt.sourceEventTargetId).toBe('atlas');
    expect(decay.condition.triggeredAt.sourceEventTargetId).toBe('atlas');
    expect(deriveActiveCondition(accrual.condition).id).toBe(deriveActiveCondition(decay.condition).id);
  });
});

// ── (2) the levy respects the vassal hierarchy ────────────────────────────────────
describe('computeLevySources is hierarchy-aware on vassal edges', () => {
  const snap = (edges, relationshipStates = {}) => ({
    byId: new Map([['o', {}], ['v', {}], ['x', {}]]),
    regionalGraph: { edges }, worldState: { relationshipStates },
  });

  test('the overlord levies its vassal; the junior NEVER levies its own overlord (edge orientation)', () => {
    const s = snap([{ from: 'o', to: 'v', relationshipType: 'vassal' }]);
    expect(computeLevySources(s, 'o', new Set())).toEqual(['v']); // senior side levies
    expect(computeLevySources(s, 'v', new Set())).toEqual([]);    // inverted direction excluded, like 'patron'
  });

  test('a state-stamped overlordSaveId overrides the edge orientation', () => {
    // The edge is authored v→o, but the relationship STATE stamps o as the overlord.
    const edges = [{ id: 'edge.v.o', from: 'v', to: 'o', relationshipType: 'vassal' }];
    const states = { 'edge.v.o': { relationshipType: 'vassal', overlordSaveId: 'o' } };
    expect(computeLevySources(snap(edges, states), 'o', new Set())).toEqual(['v']);
    expect(computeLevySources(snap(edges, states), 'v', new Set())).toEqual([]);
  });

  test('symmetric support types (allied) still levy both ways', () => {
    const s = snap([{ from: 'o', to: 'x', relationshipType: 'allied' }]);
    expect(computeLevySources(s, 'o', new Set())).toEqual(['x']);
    expect(computeLevySources(s, 'x', new Set())).toEqual(['o']);
  });
});

// ── (3) levy WITHOUT drain still conserves across the homecoming ──────────────────
describe('population conserved across levy + homecoming under warLevyEnabled without warEconomyDrainEnabled', () => {
  test('the levied headcount banked on the record is credited back as survivors + war dead (never stranded)', () => {
    // warLevyEnabled ON, warEconomyDrainEnabled OFF: the levy debits the vassal and
    // banks the headcount on the record.
    const war = evaluate({ rules: { warLevyEnabled: true } });
    const levy = war.outcomes.find(o => o.candidateType === 'war_levy');
    const levied = -levy.populationDeltas.find(d => d.saveId === 'carth').delta;
    expect(levied).toBeGreaterThan(0);
    const record = war.deployments.atlas;
    expect(record.deployedPopulation).toBe(levied);

    // The army comes home. The credit is gated on the BANK (the debit that actually
    // happened), NOT the live drain flag — no flag is even threaded to the return.
    const saves = [save('atlas', 'Atlas', { population: 6000 })];
    const worldState = { rngSeed: 'r', tick: 101, relationshipStates: {}, deployments: {}, simulationRules: { warLayerEnabled: true } };
    const campaign = { id: 'r', name: 'R', settlementIds: ['atlas'], worldState, regionalGraph: ensureRegionalGraph({ edges: [], channels: [] }), wizardNews: { currentTick: 101, entries: [] } };
    const snapshot = buildWorldSnapshot({ campaign, saves, worldState });
    const returns = deploymentReturnOutcomes({
      resolvedDeployments: [{ attackerId: 'atlas', targetId: 'borin', outcome: 'withdrawal', deployment: record }],
      snapshot, graph: snapshot.regionalGraph, rng: createPRNG('r'), tick: 101,
    });
    const hc = returns.find(o => o.candidateType === 'army_homecoming');
    expect(hc).toBeTruthy();
    const survivors = hc.populationDeltas.find(d => d.saveId === 'atlas').delta;
    // CONSERVATION: everything debited is accounted — survivors come home, the rest
    // are the war dead (the only sink). Nothing is stranded in a stripped bank.
    expect(survivors).toBeGreaterThan(0);
    expect(survivors + hc.metadata.fell).toBe(levied);
    expect(survivors).toBeLessThanOrEqual(levied);
  });
});

// ── (4) dismissing a strategy_deploy is fully conserving ──────────────────────────
// Full-kernel fixture (mirrors worldPulseSiegeInitiationDefer.test.js) with the
// war-economy flags ON: a mobilized city opens a fresh siege, conscripting its home and
// levying its vassal on the SAME tick. Dismissing the strategy_deploy must strip the
// army + front (already covered) AND revert the exhaustion ratchet AND withhold the
// conscription/levy debits — else the debit commits while the deployedPopulation bank
// is stripped with the army: a permanent population sink with no war and no war dead.
function fortifiedCity(name) {
  return {
    name, tier: 'city', population: 60000,
    config: { tradeRouteAccess: 'road', priorityMilitary: 40 },
    institutions: [{ name: 'Great Citadel' }, { name: 'City Garrison' }, { name: 'Royal Armory' }, { name: 'War College' }],
    economicState: { prosperity: 'Prosperous', primaryExports: [{ name: 'Forged Weapons' }], primaryImports: [], foodSecurity: { storageMonths: 9, resilienceScore: 85 } },
    powerStructure: {
      publicLegitimacy: { score: 88, label: 'Stable' },
      factions: [{ faction: 'High Command', category: 'military', power: 96, isGoverning: true }],
      conflicts: [],
    },
    npcs: [], activeConditions: [],
  };
}
function weakVillage(name) {
  return {
    name, tier: 'village', population: 280,
    config: { tradeRouteAccess: 'road' },
    institutions: [],
    economicState: { prosperity: 'Struggling', primaryExports: [], primaryImports: [] },
    powerStructure: {
      publicLegitimacy: { score: 24, label: 'Fragile' },
      factions: [
        { faction: 'Village Elders', category: 'civic', power: 30, isGoverning: true },
        { faction: 'Hedge Wardens', category: 'military', power: 18 },
      ],
      conflicts: [],
    },
    npcs: [], activeConditions: [],
  };
}
const kernelSave = (id, name, s) => ({ id, name, phase: 'canon', settlement: s, campaignState: { phase: 'canon', eventLog: [], locks: {} } });
const KERNEL_SAVES = [
  kernelSave('strong', 'Ironhold', fortifiedCity('Ironhold')),
  kernelSave('weak', 'Thornmere', weakVillage('Thornmere')),
  kernelSave('vasshold', 'Vasshold', settlement('Vasshold', { tier: 'village', population: 5000, storageMonths: 4, granary: true })),
];
function kernelCampaign() {
  return {
    id: 'siege-init-conserve', settlementIds: ['strong', 'weak', 'vasshold'],
    worldState: {
      rngSeed: 'siege-init-seed', tick: 4,
      relationshipStates: {
        'edge.strong.weak': { relationshipType: 'hostile' },
        'edge.strong.vasshold': { relationshipType: 'vassal' },
      },
      warPosture: { strong: { state: 'mobilized', progress: 1, sinceTick: 0 } },
      simulationRules: { warLayerEnabled: true, warEconomyDrainEnabled: true, warLevyEnabled: true },
    },
    regionalGraph: ensureRegionalGraph({
      edges: [
        { id: 'edge.strong.weak', from: 'strong', to: 'weak', relationshipType: 'hostile' },
        { id: 'edge.strong.vasshold', from: 'strong', to: 'vasshold', relationshipType: 'vassal' },
      ],
      channels: [],
    }),
    wizardNews: { currentTick: 4, entries: [] },
  };
}
const runKernel = (opts = {}) => simulateCampaignWorldPulse({ campaign: kernelCampaign(), saves: KERNEL_SAVES, interval: 'one_week', now: NOW, ...opts });
const popDeltasFor = (result, saveId) => (result.autoApplied || [])
  .flatMap(o => o?.populationDeltas || [])
  .filter(d => String(d.saveId) === saveId);

describe('dismissing a strategy_deploy conserves population and strips the exhaustion ratchet', () => {
  test('baseline: the fresh deploy conscripts + levies + ratchets exhaustion (the residue exists to strip)', () => {
    const baseline = runKernel();
    expect((baseline.majors || []).some(o => o.candidateType === 'strategy_deploy')).toBe(true);
    // The deploy-tick debits really fired (this is what a dismiss must withhold)…
    expect((baseline.autoApplied || []).some(o => o.candidateType === 'war_conscription')).toBe(true);
    expect((baseline.autoApplied || []).some(o => o.candidateType === 'war_levy')).toBe(true);
    expect(popDeltasFor(baseline, 'strong').reduce((s, d) => s + d.delta, 0)).toBeLessThan(0);
    expect(popDeltasFor(baseline, 'vasshold').reduce((s, d) => s + d.delta, 0)).toBeLessThan(0);
    // …the headcount is banked on the army, and the ratchet + vassal strain accrued.
    expect(baseline.worldState.deployments?.strong?.deployedPopulation).toBeGreaterThan(0);
    expect(baseline.worldState.warExhaustion?.strong).toBeGreaterThan(0);
    expect(baseline.worldState.warExhaustion?.vasshold).toBeGreaterThan(0);
  });

  test('dismiss: NO population debit, NO exhaustion ratchet, NO strain — byte-equivalent to the deploy never firing', () => {
    const baseline = runKernel();
    const deployId = (baseline.selected || []).find(o => o.candidateType === 'strategy_deploy').id;
    const dismissed = runKernel({ dismissMajorIds: new Set([String(deployId)]) });

    // The already-covered seed + front strip still holds.
    expect(dismissed.worldState.deployments?.strong).toBeUndefined();
    // CONSERVATION: the conscription/levy debits were withheld with the bank — no
    // populationDelta touches the home or the vassal for a war that never opened.
    expect((dismissed.autoApplied || []).some(o => o.candidateType === 'war_conscription')).toBe(false);
    expect((dismissed.autoApplied || []).some(o => o.candidateType === 'war_levy')).toBe(false);
    expect(popDeltasFor(dismissed, 'strong')).toEqual([]);
    expect(popDeltasFor(dismissed, 'vasshold')).toEqual([]);
    // The exhaustion ratchet + the levied vassal's loyalty strain are stripped.
    expect(dismissed.worldState.warExhaustion?.strong).toBeUndefined();
    expect(dismissed.worldState.warExhaustion?.vasshold).toBeUndefined();
    // And the deploy-tick home conditions (war_drain / army_deployed) never applied.
    for (const type of ['war_drain', 'army_deployed']) {
      expect((dismissed.autoApplied || []).some(o => o.candidateType === type && String(o.targetSaveId) === 'strong')).toBe(false);
    }
  });

  test('the equivalence invariant is untouched: dismiss-nothing stays byte-identical to the baseline', () => {
    const baseline = runKernel();
    const nullDismiss = runKernel({ dismissMajorIds: new Set() });
    expect(nullDismiss.worldState).toEqual(baseline.worldState);
  });
});

// ── revertSuppressedDeployExhaustion unit coverage (the arithmetic the strip leans on) ──
describe('revertSuppressedDeployExhaustion replays the no-deploy counterfactual', () => {
  test('a fresh home (no prior scar) is dropped from the ledger entirely', () => {
    const next = revertSuppressedDeployExhaustion({
      warExhaustion: { home: 0.16 }, preTickWarExhaustion: {}, homeId: 'home',
    });
    expect(next.home).toBeUndefined();
  });

  test('a recovering home is set to the decayed pre-tick value (what step 5b would have written)', () => {
    const next = revertSuppressedDeployExhaustion({
      warExhaustion: { home: 0.66 }, preTickWarExhaustion: { home: 0.5 }, homeId: 'home',
    });
    expect(next.home).toBeCloseTo(0.47, 5); // 0.5 − 0.03 decay, not 0.5 + 0.16 accrual
  });

  test('each levied vassal sheds exactly the gross levy strain; a fresh vassal is dropped', () => {
    const next = revertSuppressedDeployExhaustion({
      // vassA pre 0.4: gross-strained to 0.48 (0.05 net + 0.03 same-tick-decay
      // compensation), then step-5b decayed to 0.45; vassB fresh: 0.08 − 0.03 = 0.05.
      warExhaustion: { home: 0.16, vassA: 0.45, vassB: 0.05 },
      preTickWarExhaustion: { vassA: 0.4 },
      homeId: 'home',
      leviedSourceIds: ['vassA', 'vassB'],
    });
    expect(next.home).toBeUndefined();
    expect(next.vassA).toBeCloseTo(0.37, 5); // the no-levy counterfactual: 0.4 − 0.03 decay
    expect(next.vassB).toBeUndefined();
  });
});
