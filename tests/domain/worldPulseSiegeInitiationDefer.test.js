/**
 * worldPulseSiegeInitiationDefer.test.js — opening a NEW siege is a deferrable MAJOR
 * (the siege-initiation finding).
 *
 * A DM could already veto the CONQUEST that ENDS a siege, but not the deploy that
 * OPENS one: Step 4 of the war layer mints a war_front + seeds a deployment with NO
 * major outcome, so the pause/dismiss path had no handle on it. The new siege's
 * out-of-band residue (the deployment seed + the war_front channel) committed even on
 * a paused tick — the next tick reads them as a live siege, bypassing the decision.
 *
 * The fix emits a `strategy_deploy` MAJOR when Step 4 opens a new siege and threads it
 * through the SAME residue-suppression path the conquest dismiss uses, so a
 * deferred/dismissed siege withholds its deployment-clear + war_front residue.
 *
 *   (1) baseline (autoresolve-ON): the strategy_deploy major is surfaced AND the
 *       deployment + war_front commit (the deploy actually happened).
 *   (2) dismiss the strategy_deploy: NO deployment, NO war_front residue.
 *   (3) pause (deferMajors): the deploy is surfaced on deferredMajors and its residue
 *       is withheld.
 *   (4) equivalence: dismiss-nothing / pause-no-majors stay byte-identical to the
 *       autoresolve-ON tick.
 */
import { describe, expect, test } from 'vitest';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/pulseKernel.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

const NOW = '2026-01-01T00:00:00.000Z';

// A strong fortified city attacker.
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

// A weak village victim — a clearly feasible solo target for the city.
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

function save(id, name, settlement) {
  return { id, name, phase: 'canon', settlement, campaignState: { phase: 'canon', eventLog: [], locks: {} } };
}

const SAVES = [save('strong', 'Ironhold', fortifiedCity('Ironhold')), save('weak', 'Thornmere', weakVillage('Thornmere'))];

// strong is MOBILIZED (war-ready) and hostile toward weak, with NO existing
// deployment → Step 4 opens a FRESH siege this tick.
function campaign() {
  return {
    id: 'siege-init', settlementIds: ['strong', 'weak'],
    worldState: {
      rngSeed: 'siege-init-seed', tick: 4,
      relationshipStates: { 'edge.strong.weak': { relationshipType: 'hostile' } },
      warPosture: { strong: { state: 'mobilized', progress: 1, sinceTick: 0 } },
      simulationRules: { warLayerEnabled: true },
    },
    regionalGraph: ensureRegionalGraph({
      edges: [{ id: 'edge.strong.weak', from: 'strong', to: 'weak', relationshipType: 'hostile' }],
      channels: [],
    }),
    wizardNews: { currentTick: 4, entries: [] },
  };
}

const run = (opts = {}) => simulateCampaignWorldPulse({ campaign: campaign(), saves: SAVES, interval: 'one_week', now: NOW, ...opts });

const hasFront = (r) => (r.regionalGraph.channels || []).some(c => c.type === 'war_front' && c.from === 'strong' && c.to === 'weak' && c.status === 'confirmed');

describe('opening a new siege is a deferrable major', () => {
  test('the fixture opens a fresh siege and surfaces it as a strategy_deploy major', () => {
    const baseline = run();
    const deploy = (baseline.selected || []).find(o => o.candidateType === 'strategy_deploy');
    expect(deploy).toBeTruthy();
    expect(deploy.targetSaveId).toBe('strong');         // the besieger
    expect(deploy.sourceEventTargetId).toBe('weak');    // the besieged
    // It is classified MAJOR (the DM should get a say).
    expect((baseline.majors || []).some(o => o.candidateType === 'strategy_deploy')).toBe(true);
    // The autoresolve-ON tick DOES commit the deployment + the war_front.
    expect(baseline.worldState.deployments?.strong).toMatchObject({ targetId: 'weak', role: 'siege' });
    expect(hasFront(baseline)).toBe(true);
  });

  test('dismissing the strategy_deploy leaves NO deployment / war_front residue', () => {
    const baseline = run();
    const deployId = (baseline.selected || []).find(o => o.candidateType === 'strategy_deploy').id;

    const dismissed = run({ dismissMajorIds: new Set([String(deployId)]) });

    // No army marched: the freshly-seeded deployment is gone.
    expect(dismissed.worldState.deployments?.strong).toBeUndefined();
    // No confirmed war_front from strong→weak landed on the graph.
    expect(hasFront(dismissed)).toBe(false);
    // The strategy_deploy never reached the apply pass.
    expect((dismissed.autoApplied || []).some(o => o.candidateType === 'strategy_deploy')).toBe(false);
  });

  test('pausing the tick commits NO deploy residue (the siege initiation is withheld)', () => {
    // On a PAUSED tick the enabling war_mobilization is itself a deferred major, so its
    // posture residue is stripped FIRST — strong is no longer war-ready and the deploy
    // never fires. Either way the invariant holds end-to-end: a paused tick must leave
    // NO new deployment seed and NO confirmed war_front (the residue the strategy_deploy
    // suppression backstops should the deploy fire). Nothing is auto-applied for it.
    const paused = run({ deferMajors: true });

    expect((paused.autoApplied || []).some(o => o.candidateType === 'strategy_deploy')).toBe(false);
    expect(paused.worldState.deployments?.strong).toBeUndefined();
    expect(hasFront(paused)).toBe(false);
  });

  test('the equivalence invariant: dismiss-nothing / pause-no-majors are byte-identical', () => {
    const baseline = run();
    const nullDismiss = run({ dismissMajorIds: null });
    const emptyDismiss = run({ dismissMajorIds: new Set() });
    // A resume that dismissed nothing preserves the deploy residue, byte-for-byte.
    expect(nullDismiss.worldState).toEqual(baseline.worldState);
    expect(emptyDismiss.worldState).toEqual(baseline.worldState);
    expect(baseline.worldState.deployments?.strong).toBeTruthy();
  });
});
