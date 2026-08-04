import { describe, expect, test } from 'vitest';

import { previewCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { evaluateWarLayer } from '../../src/domain/worldPulse/warDeployment.js';
import { stampWarIntent } from '../../src/domain/worldPulse/warIntent.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { deriveCausalState } from '../../src/domain/causalState.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { createPRNG } from '../../src/kernel/prng.js';

// ─────────────────────────────────────────────────────────────────────────────
// Feature A (war/deployment) — A1 test gates.
//
// Determinism contract under test: the war layer is GATED behind
// simulationRules.warLayerEnabled (default false ⇒ pure no-op ⇒ byte-identical),
// every roll forks on a stable key (siege:<T>:<tick>, deploy is deterministic),
// every output iteration is codepoint-sorted, and war_drain severity is derived
// from the PRE-TICK war_front count (no intra-tick read-after-write).
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
    ...('settlementPatch' in patch ? patch.settlementPatch : {}),
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

// A strong attacker (city, big pop, military seat) hostile toward a weak target
// (village, tiny pop, legitimacy crisis). Asymmetric enough that the deploy gate
// (strength ≥ confidence AND strength > target + margin) clearly fires.
function attacker(id, name) {
  return save(id, name, { tier: 'city', population: 45000 });
}
function victim(id, name) {
  return save(id, name, {
    tier: 'village',
    population: 280,
    legitimacy: 24,
    factions: [
      { faction: 'Village Elders', category: 'civic', power: 30, isGoverning: true },
      { faction: 'Hedge Wardens', category: 'military', power: 22 },
    ],
  });
}

function warCampaign(rulesPatch = {}, { edges, channels = [], extraState = {} } = {}) {
  return {
    id: 'war-fixture',
    name: 'War Fixture',
    settlementIds: edges.settlementIds,
    worldState: {
      rngSeed: 'war-seed',
      tick: 4,
      relationshipStates: edges.relationshipStates || {},
      // simulationRules live on worldState (advanceCampaignWorld reads
      // startingWorldState.simulationRules, not campaign.simulationRules).
      simulationRules: { warLayerEnabled: true, ...rulesPatch },
      ...extraState,
    },
    regionalGraph: ensureRegionalGraph({ edges: edges.edges, channels }),
    wizardNews: { currentTick: 4, entries: [] },
  };
}

function snapshotFor(campaign, saves) {
  return buildWorldSnapshot({ campaign, saves, worldState: campaign.worldState });
}

describe('war layer — OFF byte-identity', () => {
  test('warLayerEnabled:false leaves a representative pulse byte-identical to a baseline', () => {
    const saves = [attacker('strong', 'Ironhold'), victim('weak', 'Thornmere')];
    const edges = {
      settlementIds: ['strong', 'weak'],
      edges: [{ id: 'edge.strong.weak', from: 'strong', to: 'weak', relationshipType: 'hostile' }],
      relationshipStates: { 'edge.strong.weak': { relationshipType: 'hostile' } },
    };
    const offA = warCampaign({ warLayerEnabled: false }, { edges });
    const offB = warCampaign({ warLayerEnabled: false }, { edges });

    const a = previewCampaignWorldPulse({ campaign: offA, saves, interval: 'one_month', now: NOW });
    const b = previewCampaignWorldPulse({ campaign: offB, saves: [...saves].reverse(), interval: 'one_month', now: NOW });

    // No deployments minted, no war_front channels, no war outcomes.
    expect(a.worldState.deployments).toEqual({});
    expect((a.regionalGraph.channels || []).some(c => c.type === 'war_front')).toBe(false);
    expect(a.selected.some(o => o.candidateType === 'war_drain' || o.candidateType === 'conquest')).toBe(false);

    // And the OFF pulse is order-independent (the legacy invariant is untouched).
    const ids = r => r.selected.map(o => o.id).sort();
    expect(ids(b)).toEqual(ids(a));
    const bySave = r => new Map(r.settlementUpdates.map(u => [String(u.saveId), u.settlement]));
    for (const id of ['strong', 'weak']) {
      expect(bySave(b).get(id)).toEqual(bySave(a).get(id));
    }
  });

  test('the war layer is gated: ON vs OFF differ (anti-vacuity — the flag actually does something)', () => {
    const saves = [attacker('strong', 'Ironhold'), victim('weak', 'Thornmere')];
    const edges = {
      settlementIds: ['strong', 'weak'],
      edges: [{ id: 'edge.strong.weak', from: 'strong', to: 'weak', relationshipType: 'hostile' }],
      relationshipStates: { 'edge.strong.weak': { relationshipType: 'hostile' } },
    };
    // B1: a settlement cannot siege from peace — seed `strong` at a war-ready posture.
    const MOBILIZED = { warPosture: { strong: { state: 'mobilized', progress: 1, sinceTick: 0 } } };
    const off = previewCampaignWorldPulse({ campaign: warCampaign({ warLayerEnabled: false }, { edges, extraState: MOBILIZED }), saves, interval: 'one_month', now: NOW });
    const on = previewCampaignWorldPulse({ campaign: warCampaign({ warLayerEnabled: true }, { edges, extraState: MOBILIZED }), saves, interval: 'one_month', now: NOW });

    expect(off.worldState.deployments).toEqual({});
    expect(on.worldState.deployments.strong).toMatchObject({ targetId: 'weak', role: 'siege' });
    expect((on.regionalGraph.channels || []).some(c => c.type === 'war_front' && c.from === 'strong' && c.to === 'weak')).toBe(true);
  });
});

describe('war layer — deployment + drain', () => {
  test('a confident attacker deploys against a weaker hostile target and emits war_drain + army_deployed', () => {
    const saves = [attacker('strong', 'Ironhold'), victim('weak', 'Thornmere')];
    const edges = {
      settlementIds: ['strong', 'weak'],
      edges: [{ id: 'edge.strong.weak', from: 'strong', to: 'weak', relationshipType: 'hostile' }],
      relationshipStates: { 'edge.strong.weak': { relationshipType: 'hostile' } },
    };
    // B1: seed `strong` mobilized so the deploy gate (war-ready posture) admits it.
    const snap = snapshotFor(warCampaign({}, { edges, extraState: { warPosture: { strong: { state: 'mobilized', progress: 1, sinceTick: 0 } } } }), saves);
    const war = evaluateWarLayer({ snapshot: snap, worldState: snap.worldState, rng: createPRNG('r'), tick: 5, now: NOW, rules: { warLayerEnabled: true } });

    // B2 — the deployment record is now STATEFUL (enriched at deploy time): it keeps
    // the light A1 fields AND carries effective strength + supporting facets.
    expect(war.deployments.strong).toMatchObject({ targetId: 'weak', sinceTick: 5, role: 'siege' });
    expect(war.deployments.strong.maxStartStrength).toBeGreaterThan(0);
    expect(war.deployments.strong.currentEffectiveStrength).toBe(war.deployments.strong.maxStartStrength);
    expect(war.graphChannels.map(c => `${c.from}->${c.to}:${c.type}`)).toEqual(['strong->weak:war_front']);
    // Opening a NEW siege now also surfaces a strategy_deploy MAJOR (the deferrable
    // siege-initiation outcome) alongside the home-bleed conditions.
    const kinds = war.outcomes.map(o => o.candidateType).sort();
    expect(kinds).toEqual(['army_deployed', 'strategy_deploy', 'war_drain']);
    const drain = war.outcomes.find(o => o.candidateType === 'war_drain');
    const deployed = war.outcomes.find(o => o.candidateType === 'army_deployed');
    expect(drain.condition.archetype).toBe('war_drain');
    expect(drain.condition.severity).toBeGreaterThan(0);
    // No persisted WAR_LAYER condition exists yet: both are onset beats.
    expect(drain.recordMode).toBeUndefined();
    expect(deployed.recordMode).toBeUndefined();
  });

  test.each([
    ['a current patron', { tier: 'town', population: 4000 }, true],
    ['an equal live host under temporary pressure', {
      tier: 'city', population: 5000,
      activeConditions: [{ archetype: 'war_pressure', severity: 1 }],
    }, false],
  ])('WR-1 opener rejects stale opportunism contradicted by %s', (_counterforce, targetPatch, hasPatron) => {
    const saves = [
      save('strong', 'Ironhold', { tier: 'city', population: 5000 }),
      save('weak', 'Thornmere', targetPatch),
      ...(hasPatron ? [save('guardian', 'Highwatch', { tier: 'city', population: 8000 })] : []),
    ];
    const edges = {
      settlementIds: saves.map(item => item.id),
      edges: [
        { id: 'edge.strong.weak', from: 'strong', to: 'weak', relationshipType: 'hostile' },
        ...(hasPatron ? [{ id: 'edge.guardian.weak', from: 'guardian', to: 'weak', relationshipType: 'patron' }] : []),
      ],
      relationshipStates: {
        'edge.strong.weak': { relationshipType: 'hostile' },
        ...(hasPatron ? { 'edge.guardian.weak': { relationshipType: 'patron', patronSaveId: 'guardian' } } : {}),
      },
    };
    const staleOpportunism = {
      updatedTick: 1,
      reasons: {
        opportunism: {
          type: 'opportunism', score: 1, sinceTick: 1, tick: 1,
          receipt: 'The court remembers an undefended prize.',
        },
      },
    };
    const evaluate = warTerminationEnabled => {
      const rules = { peaceEngineEnabled: true, warTerminationEnabled };
      const campaign = warCampaign(rules, {
        edges,
        extraState: {
          warPosture: { strong: { state: 'mobilized', progress: 1, sinceTick: 0 } },
          spatialCanonVersion: 1,
          spatialLedgers: { warReasons: { 'strong>weak': staleOpportunism } },
        },
      });
      campaign.worldState = stampWarIntent(campaign.worldState, 'strong', 'weak', 4);
      const snap = snapshotFor(campaign, saves);
      return evaluateWarLayer({
        snapshot: snap, worldState: snap.worldState, rng: createPRNG('stale-opportunism'),
        tick: 5, now: NOW, rules: snap.worldState.simulationRules,
      });
    };

    const dark = evaluate(false);
    const lit = evaluate(true);
    expect(dark.deployments.strong?.casusReasons).toEqual([{
      type: 'opportunism', score: 1, receipt: 'The court remembers an undefended prize.',
    }]);
    expect(lit.deployments.strong, 'counterforced opportunism cannot open one stale war').toBeUndefined();
    expect(lit.graphChannels).toEqual([]);
  });

  test('a fresh age-0 deployment keeps its first conscription visible and conserved', () => {
    const saves = [attacker('strong', 'Ironhold'), victim('weak', 'Thornmere')];
    const edges = {
      settlementIds: ['strong', 'weak'],
      edges: [{ id: 'edge.strong.weak', from: 'strong', to: 'weak', relationshipType: 'hostile' }],
      relationshipStates: { 'edge.strong.weak': { relationshipType: 'hostile' } },
    };
    const rules = { warLayerEnabled: true, warEconomyDrainEnabled: true };
    const snap = snapshotFor(warCampaign(rules, {
      edges,
      extraState: { warPosture: { strong: { state: 'mobilized', progress: 1, sinceTick: 0 } } },
    }), saves);
    const war = evaluateWarLayer({
      snapshot: snap,
      worldState: snap.worldState,
      rng: createPRNG('r'),
      tick: 5,
      now: NOW,
      rules,
    });
    const conscription = war.outcomes.find(o => o.candidateType === 'war_conscription');

    expect(war.deployments.strong.deploymentAge).toBe(0);
    expect(conscription.recordMode).toBeUndefined();
    expect(-conscription.populationDeltas[0].delta)
      .toBe(war.deployments.strong.deployedPopulation);
  });

  test('light-record migration preserves pinned causes, sacred anchors, and auxiliary deployment state', () => {
    const saves = [attacker('strong', 'Ironhold'), victim('weak', 'Thornmere')];
    const edges = {
      settlementIds: ['strong', 'weak'],
      edges: [{ id: 'edge.strong.weak', from: 'strong', to: 'weak', relationshipType: 'hostile' }],
      relationshipStates: { 'edge.strong.weak': { relationshipType: 'hostile' } },
    };
    const original = {
      targetId: 'weak', sinceTick: 1, role: 'siege',
      casusReasons: [{ type: 'sacred_claim', score: 0.8, receipt: 'The rival patron remains an offense.', atTick: 1 }],
      attackerPatronRef: 'deity:ash', defenderPatronRef: 'deity:river',
      auxiliary: { campaignKey: 'winter-oath' },
    };
    const snap = snapshotFor(warCampaign({}, { edges, extraState: { deployments: { strong: original } } }), saves);
    const war = evaluateWarLayer({ snapshot: snap, worldState: snap.worldState, rng: createPRNG('migration'), tick: 5, now: NOW, rules: { warLayerEnabled: true } });
    expect(war.deployments.strong.casusReasons).toEqual(original.casusReasons);
    expect(war.deployments.strong).toMatchObject({
      attackerPatronRef: 'deity:ash', defenderPatronRef: 'deity:river',
      auxiliary: { campaignKey: 'winter-oath' }, sinceTick: 1, deploymentAge: 5,
    });
    expect(war.deployments.strong.currentEffectiveStrength).toBeGreaterThan(0);
  });

  // Landed W2b causalState wave — needs causalState economic_capacity system variable
  test('war_drain drains the home economic_capacity (the homeostasis SOURCE is live)', () => {
    const saves = [attacker('strong', 'Ironhold'), victim('weak', 'Thornmere')];
    const edges = {
      settlementIds: ['strong', 'weak'],
      edges: [{ id: 'edge.strong.weak', from: 'strong', to: 'weak', relationshipType: 'hostile' }],
      relationshipStates: { 'edge.strong.weak': { relationshipType: 'hostile' } },
    };
    // B1: seed `strong` mobilized so it actually deploys and accrues war_drain.
    const pulse = previewCampaignWorldPulse({ campaign: warCampaign({}, { edges, extraState: { warPosture: { strong: { state: 'mobilized', progress: 1, sinceTick: 0 } } } }), saves, interval: 'one_month', now: NOW });
    const before = deriveCausalState(saves[0].settlement).scores.economic_capacity;
    const conquered = pulse.settlementUpdates.find(u => String(u.saveId) === 'strong');
    const after = deriveCausalState(conquered.settlement).scores.economic_capacity;
    // The war_drain condition (affectedSystems: economic_capacity) subtracts severity×18.
    expect(after).toBeLessThan(before);
  });
});

describe('war layer — coalition order-independence', () => {
  test('two attackers besieging one target → reversing the saves/edges yields identical outcomes', () => {
    const saves = [
      attacker('alpha', 'Alphaforge'),
      attacker('bravo', 'Bravewatch'),
      victim('target', 'Tinytown'),
    ];
    // Both alpha and bravo already have a war_front into target (a live coalition siege),
    // and both have a deployment. This tick the siege either holds or resolves.
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
      alpha: { targetId: 'target', sinceTick: 1, role: 'siege' },
      bravo: { targetId: 'target', sinceTick: 1, role: 'siege' },
    };

    const run = (orderedSaves) => {
      const campaign = warCampaign({}, { edges, channels, extraState: { deployments } });
      const snap = snapshotFor(campaign, orderedSaves);
      const war = evaluateWarLayer({ snapshot: snap, worldState: snap.worldState, rng: createPRNG('coalition'), tick: 7, now: NOW, rules: { warLayerEnabled: true } });
      return {
        outcomes: war.outcomes.map(o => `${o.candidateType}@${o.targetSaveId}:${o.severity?.toFixed?.(3)}`).sort(),
        conquest: war.outcomes.find(o => o.candidateType === 'conquest')?.powerTransfer?.toPowerName || null,
        resolved: war.resolvedDeployments.map(r => r.attackerId).sort(),
        deployments: war.deployments,
      };
    };

    const forward = run(saves);
    const reversed = run([...saves].reverse());

    expect(reversed.outcomes).toEqual(forward.outcomes);
    expect(reversed.conquest).toEqual(forward.conquest);
    expect(reversed.resolved).toEqual(forward.resolved);
    expect(reversed.deployments).toEqual(forward.deployments);

    // Anti-vacuity: the coalition siege actually does something (holds or conquers).
    expect(forward.outcomes.length + (forward.conquest ? 1 : 0)).toBeGreaterThan(0);
  });
});

describe('war layer — conquest fires + transfers ruling power', () => {
  test('a strong attacker vs a weak besieged target eventually conquers and transfers power', () => {
    const saves = [attacker('strong', 'Ironhold'), victim('weak', 'Thornmere')];
    const channels = [{ type: 'war_front', from: 'strong', to: 'weak', status: 'confirmed' }];
    const edges = {
      settlementIds: ['strong', 'weak'],
      edges: [{ id: 'edge.strong.weak', from: 'strong', to: 'weak', relationshipType: 'hostile' }],
      relationshipStates: { 'edge.strong.weak': { relationshipType: 'hostile' } },
    };
    const deployments = { strong: { targetId: 'weak', sinceTick: 1, role: 'siege' } };

    let conquered = false;
    let toPowerName = null;
    // The siege verdict forks on tick, so it resolves within a bounded number of ticks.
    for (let tick = 5; tick < 60 && !conquered; tick += 1) {
      const campaign = warCampaign({}, { edges, channels, extraState: { deployments } });
      const snap = snapshotFor(campaign, saves);
      const war = evaluateWarLayer({ snapshot: snap, worldState: snap.worldState, rng: createPRNG('war-seed'), tick, now: NOW, rules: { warLayerEnabled: true } });
      const conquest = war.outcomes.find(o => o.candidateType === 'conquest');
      if (conquest) {
        conquered = true;
        toPowerName = conquest.powerTransfer.toPowerName;
        expect(conquest.type).toBe('power_transfer');
        expect(conquest.powerTransfer.cause).toBe('conquest');
        expect(conquest.targetSaveId).toBe('weak');
        // The besieger's army returns home on conquest.
        expect(war.resolvedDeployments.map(r => r.attackerId)).toEqual(['strong']);
        expect(war.deployments.strong).toBeUndefined();
      }
    }
    expect(conquered).toBe(true);
    expect(toPowerName).toBe('Ironhold occupation authority');
  });

  test('the conquest power_transfer actually transfers ruling power through the full pulse', () => {
    const saves = [attacker('strong', 'Ironhold'), victim('weak', 'Thornmere')];
    const channels = [{ type: 'war_front', from: 'strong', to: 'weak', status: 'confirmed' }];
    const edges = {
      settlementIds: ['strong', 'weak'],
      edges: [{ id: 'edge.strong.weak', from: 'strong', to: 'weak', relationshipType: 'hostile' }],
      relationshipStates: { 'edge.strong.weak': { relationshipType: 'hostile' } },
    };
    const deployments = { strong: { targetId: 'weak', sinceTick: 1, role: 'siege' } };
    let worldState = { rngSeed: 'war-seed', tick: 4, relationshipStates: edges.relationshipStates, deployments, simulationRules: { warLayerEnabled: true } };

    let transferred = false;
    for (let i = 0; i < 60 && !transferred; i += 1) {
      const campaign = {
        id: 'war-conquest', name: 'War Conquest', settlementIds: ['strong', 'weak'],
        worldState, regionalGraph: ensureRegionalGraph({ edges: edges.edges, channels }),
        wizardNews: { currentTick: worldState.tick, entries: [] },
      };
      const pulse = previewCampaignWorldPulse({ campaign, saves, interval: 'one_month', now: NOW });
      const weak = pulse.settlementUpdates.find(u => String(u.saveId) === 'weak');
      const ps = weak.settlement.powerStructure;
      // transferRulingPower makes the occupier the power BEHIND the reshaped seat:
      // it gains the 'ascendant' modifier, the governing seat is relabeled to its
      // military government type, and a conquest entry lands in previousGovernments.
      const occupier = (ps.factions || []).find(f => /occupation authority/i.test(f.faction || ''));
      const conquestRecord = (ps.previousGovernments || []).some(g => g.cause === 'conquest');
      if (occupier && (occupier.modifiers || []).includes('ascendant') && conquestRecord) {
        transferred = true;
      }
      worldState = pulse.worldState;
    }
    expect(transferred).toBe(true);
  });
});

describe('Z1 — pulse-conquered occupation parity (matches a generation-occupied town)', () => {
  test('a conquered town is DISARMED (local military ×0.3) and carries the vassal_extraction occupation condition', () => {
    const saves = [attacker('strong', 'Ironhold'), victim('weak', 'Thornmere')];
    const channels = [{ type: 'war_front', from: 'strong', to: 'weak', status: 'confirmed' }];
    const edges = {
      settlementIds: ['strong', 'weak'],
      edges: [{ id: 'edge.strong.weak', from: 'strong', to: 'weak', relationshipType: 'hostile' }],
      relationshipStates: { 'edge.strong.weak': { relationshipType: 'hostile' } },
    };
    const deployments = { strong: { targetId: 'weak', sinceTick: 1, role: 'siege' } };
    let worldState = { rngSeed: 'war-seed', tick: 4, relationshipStates: edges.relationshipStates, deployments, simulationRules: { warLayerEnabled: true } };

    // The victim's pre-conquest military faction (Hedge Wardens, power 22).
    const PRE_MILITARY_POWER = 22;
    let parity = false;
    for (let i = 0; i < 60 && !parity; i += 1) {
      const campaign = {
        id: 'war-occ', name: 'War Occupation', settlementIds: ['strong', 'weak'],
        worldState, regionalGraph: ensureRegionalGraph({ edges: edges.edges, channels }),
        wizardNews: { currentTick: worldState.tick, entries: [] },
      };
      const pulse = previewCampaignWorldPulse({ campaign, saves, interval: 'one_month', now: NOW });
      const weak = pulse.settlementUpdates.find(u => String(u.saveId) === 'weak');
      const ps = weak.settlement.powerStructure;
      const conquered = (ps.previousGovernments || []).some(g => g.cause === 'conquest');
      if (conquered) {
        // The local military faction was disarmed (×0.3) and flagged.
        const military = (ps.factions || []).find(f => /hedge wardens/i.test(f.faction || f.name || ''));
        expect(military).toBeTruthy();
        expect(military.power).toBeLessThanOrEqual(Math.round(PRE_MILITARY_POWER * 0.3) + 1);
        expect((military.modifiers || []).includes('disarmed')).toBe(true);
        // The occupation condition is stamped — the SAME archetype a generation-
        // occupied town carries (conditionPromotion maps 'occupied' → vassal_extraction).
        const occCond = (weak.settlement.activeConditions || []).find(c => c.archetype === 'vassal_extraction');
        expect(occCond).toBeTruthy();
        expect(occCond.affectedSystems).toContain('defense_readiness');
        expect(occCond.affectedSystems).toContain('trade_connectivity');
        parity = true;
      }
      worldState = pulse.worldState;
    }
    expect(parity).toBe(true);
  });
});

describe('war layer — mutual-siege numeric convergence', () => {
  test('A besieges B and B besieges A → the system converges (someone wins) within bounded ticks', () => {
    // Two near-symmetric powers, mutually hostile, each besieging the other. The
    // siege verdict forks on tick (the avalanche hash moves), so the standoff
    // cannot oscillate forever — one side falls within a bounded horizon.
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
    const deployments = {
      atlas: { targetId: 'borin', sinceTick: 1, role: 'siege' },
      borin: { targetId: 'atlas', sinceTick: 1, role: 'siege' },
    };

    let resolved = false;
    let winner = null;
    for (let tick = 2; tick < 200 && !resolved; tick += 1) {
      const campaign = warCampaign({}, { edges, channels, extraState: { deployments } });
      const snap = snapshotFor(campaign, saves);
      const war = evaluateWarLayer({ snapshot: snap, worldState: snap.worldState, rng: createPRNG('mutual'), tick, now: NOW, rules: { warLayerEnabled: true } });
      const conquest = war.outcomes.find(o => o.candidateType === 'conquest');
      if (conquest) {
        resolved = true;
        winner = conquest.powerTransfer.toPowerName;
      }
    }
    expect(resolved).toBe(true);
    expect(winner).toMatch(/occupation authority/);
  });

  test('mutual siege is order-independent: swapping the saves array yields the identical first resolution', () => {
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
    const deployments = {
      atlas: { targetId: 'borin', sinceTick: 1, role: 'siege' },
      borin: { targetId: 'atlas', sinceTick: 1, role: 'siege' },
    };
    const firstResolution = (orderedSaves) => {
      for (let tick = 2; tick < 200; tick += 1) {
        const campaign = warCampaign({}, { edges, channels, extraState: { deployments } });
        const snap = snapshotFor(campaign, orderedSaves);
        const war = evaluateWarLayer({ snapshot: snap, worldState: snap.worldState, rng: createPRNG('mutual'), tick, now: NOW, rules: { warLayerEnabled: true } });
        const conquest = war.outcomes.find(o => o.candidateType === 'conquest');
        if (conquest) return { tick, winner: conquest.powerTransfer.toPowerName, target: conquest.targetSaveId };
      }
      return null;
    };
    expect(firstResolution([...saves].reverse())).toEqual(firstResolution(saves));
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// WR-8 AMENDMENT R — THE THIRD INTENT, AT ITS ONE MOUTH (lane WZ-2).
//
// Two slices of WR-8 shipped DARK because `warDeployment.js` had no room for the
// fork. It has room now, and this is the fork executed: the SAME fixture that
// conquers above burns instead, and the razing REPLACES the power transfer
// rather than riding beside it. Every assertion here is driven through the real
// `evaluateWarLayer`, because the whole claim is about what the war layer emits.
// ─────────────────────────────────────────────────────────────────────────────
describe('WR-8 R — the razing fork at the conquest power-transfer site', () => {
  /** Every prerequisite flag WR-8 lights behind, spelled where the fixture reads it. */
  const DOCTRINE_LIT = Object.freeze({
    warLayerEnabled: true,
    warTerminationEnabled: true,
    peaceEngineEnabled: true,
    dispositionChannelsEnabled: true,
    coalitionLedgerEnabled: true,
    envoyDiplomacyEnabled: true,
    demographicsEnabled: true,
    conquestDoctrineEnabled: true,
  });

  /**
   * The conquering fixture, plus everything the razing law requires and nothing
   * it does not: an openly hostile border with the resentment above hostility's
   * own floor, ONE maxed live grievance (CR-WR8-B-CLARIFIED), and a besieger
   * whose derived alignment is malicious (an evil patron and a war-scarred
   * ledger — the razer's nature is READ, never handed in).
   */
  function razingFixture() {
    const strong = attacker('strong', 'Ironhold');
    strong.settlement.config.primaryDeitySnapshot = { name: 'The Iron Maw', alignmentAxis: 'evil' };
    strong.settlement.institutions = [];
    const weak = victim('weak', 'Thornmere');
    weak.settlement.institutions = [
      { id: 'temple', name: 'Temple of the Quiet Road' },
      { id: 'granary', name: 'The Granary', protectedFromSack: true },
    ];
    const edges = {
      settlementIds: ['strong', 'weak'],
      edges: [{ id: 'edge.strong.weak', from: 'strong', to: 'weak', relationshipType: 'hostile' }],
      relationshipStates: {
        'edge.strong.weak': { relationshipType: 'hostile', resentment: 0.95, trust: 0.02, fear: 0.5 },
      },
    };
    return {
      saves: [strong, weak],
      edges,
      channels: [{ type: 'war_front', from: 'strong', to: 'weak', status: 'confirmed' }],
      extraState: {
        deployments: { strong: { targetId: 'weak', sinceTick: 1, role: 'siege' } },
        // The scar that makes the court malicious through the real alignment read.
        warExhaustion: { strong: 1 },
        spatialLedgers: {
          warReasons: {
            'strong>weak': {
              reasons: {
                grievance: {
                  type: 'grievance', score: 1, tick: 4,
                  receipt: 'Thornmere burned Ironhold’s daughter-village and never answered for it',
                },
              },
            },
          },
        },
      },
    };
  }

  /** Drive the real war layer until the siege resolves; return that outcome. */
  function firstSiegeResolution(rulesPatch) {
    const { saves, edges, channels, extraState } = razingFixture();
    for (let tick = 5; tick < 60; tick += 1) {
      const campaign = warCampaign(rulesPatch, { edges, channels, extraState });
      const snap = snapshotFor(campaign, saves);
      const war = evaluateWarLayer({
        snapshot: snap, worldState: snap.worldState, rng: createPRNG('war-seed'),
        tick, now: NOW, rules: { warLayerEnabled: true },
      });
      const resolution = war.outcomes.find(
        (o) => o.candidateType === 'conquest' || o.candidateType === 'razing',
      );
      if (resolution) return { resolution, war, tick };
    }
    return null;
  }

  test('THE FORK — a wicked victor at the extreme BURNS, and mints no power transfer', () => {
    const found = firstSiegeResolution(DOCTRINE_LIT);
    expect(found).not.toBeNull();
    const { resolution, war } = /** @type {{ resolution: any, war: any }} */ (found);
    expect(resolution.candidateType).toBe('razing');
    // LAW 6 — the signature. No occupation, and therefore no power transfer.
    expect(resolution.type).toBe('condition');
    expect(resolution.powerTransfer).toBeUndefined();
    expect(resolution.razing.departure.occupation).toBeNull();
    expect(resolution.razing.departure.garrison).toBeNull();
    expect(resolution.razing.departure.terms).toBeNull();
    expect(resolution.summary).toContain('rode home');
    // The road is the WICKED one: no license was minted or spent.
    expect(resolution.razing.road).toBe('initiation');
    expect(resolution.razing.licenseId).toBeNull();
    // The conserved sack rides the outcome, and takes people from the victim ONLY —
    // a razing carries no captives home.
    expect(resolution.populationDeltas).toHaveLength(1);
    expect(resolution.populationDeltas[0].saveId).toBe('weak');
    expect(resolution.populationDeltas[0].delta).toBeLessThan(0);
    // The institution stamps ride it too, and the protected one is reported unstamped.
    const byId = Object.fromEntries(resolution.razing.institutions.map((i) => [i.id, i]));
    expect(byId.temple.impairment.type).toBe('capacity');
    expect(byId.granary.impairment).toBeNull();
    expect(byId.granary.protected).toBe(true);
    // The siege still RESOLVED: the army came home and the front retired.
    expect(war.deployments.strong).toBeUndefined();
    expect(war.resolvedDeployments.map((r) => r.outcome)).toEqual(['razing']);
    expect(war.retiredChannels.length).toBeGreaterThan(0);
  });

  test('NEGATIVE CONTROL — the SAME fixture with the doctrine DARK conquers exactly as it always did', () => {
    // The dormancy proof that matters: not "nothing happened", but "the OLD
    // thing happened, unchanged". Every campaign that has ever run is this one.
    const found = firstSiegeResolution({});
    expect(found).not.toBeNull();
    const { resolution, war } = /** @type {{ resolution: any, war: any }} */ (found);
    expect(resolution.candidateType).toBe('conquest');
    expect(resolution.type).toBe('power_transfer');
    expect(resolution.powerTransfer.toPowerName).toBe('Ironhold occupation authority');
    expect(resolution.razing).toBeUndefined();
    expect(war.resolvedDeployments.map((r) => r.outcome)).toEqual(['conquest']);
  });

  test('NEGATIVE CONTROL — lit, but the quarrel is merely bad: the victor holds the walls', () => {
    // The gate the amendment says must pin hardest. Same lit world, same wicked
    // court, one conjunct removed (the border is a rivalry rather than open
    // hostility) — and the acquisition ladder is back.
    const { saves, edges, channels, extraState } = razingFixture();
    edges.edges[0].relationshipType = 'rival';
    edges.relationshipStates['edge.strong.weak'].relationshipType = 'rival';
    let resolution = null;
    for (let tick = 5; tick < 60 && !resolution; tick += 1) {
      const campaign = warCampaign(DOCTRINE_LIT, { edges, channels, extraState });
      const snap = snapshotFor(campaign, saves);
      const war = evaluateWarLayer({
        snapshot: snap, worldState: snap.worldState, rng: createPRNG('war-seed'),
        tick, now: NOW, rules: { warLayerEnabled: true },
      });
      resolution = war.outcomes.find(
        (o) => o.candidateType === 'conquest' || o.candidateType === 'razing',
      ) || null;
    }
    expect(resolution).not.toBeNull();
    expect(/** @type {any} */ (resolution).candidateType).toBe('conquest');
  });
});
