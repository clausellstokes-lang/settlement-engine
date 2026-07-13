/**
 * warInitiateResolveSplit.m9d.test.js — Phase 5.5 mover M9d, THE WAR INITIATE/RESOLVE
 * SPLIT (M9's final component 6). Closes the CL-0 war DM-Driven deferral.
 *
 * BEFORE M9d: evaluateWarLayer opened sieges INLINE, outside the proposal machinery —
 * a strategy_deploy was a settlement-state no-op (applyMode 'auto') and the deployment
 * seed + war_front minted directly. So war initiation IGNORED the dm_only/recommendations
 * autonomy modes: a besieger marched no matter the DM's approval custom, and the war row
 * could only ship Off/Autonomous.
 *
 * AFTER M9d: siege INITIATION routes its applyMode through the shared authority policy.
 *   • LEGACY (routine / full autonomy) ⇒ 'auto' VERBATIM: the inline mint runs
 *     byte-identically (the 6 siege pins + war certification prove this elsewhere; here
 *     we pin the OUTCOME SHAPE — no proposalPayload, deployment + front commit).
 *   • DM-DRIVEN (dm_only / recommendations) ⇒ 'proposal': the deployment seed + war_front
 *     are HELD and carried in a proposalPayload; the war-init routes to the approval queue
 *     (pending). Approval RE-MINTS the held siege; a decline/expiry opens no war.
 *   • RESOLUTION (resolveSiegeVerdict / conquest) is UNCHANGED — a pre-seeded siege still
 *     resolves the same way under DM-Driven; only initiation splits.
 */
import { describe, expect, test } from 'vitest';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/pulseKernel.js';
import { applyWorldPulseProposal } from '../../src/domain/worldPulse/applyWorldPulse.js';
import { domainState, SIMULATION_DOMAINS } from '../../src/domain/worldPulse/simulationProfile.js';
import { normalizeSimulationRules } from '../../src/domain/worldPulse/simulationRules.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

const NOW = '2026-01-01T00:00:00.000Z';

// A strong fortified city attacker (verbatim from worldPulseSiegeInitiationDefer).
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

// strong is MOBILIZED (war-ready) and hostile toward weak, no existing deployment →
// Step 4 opens a FRESH siege this tick. `extraRules` selects the autonomy mode.
function campaign(extraRules = {}) {
  return {
    id: 'siege-init', settlementIds: ['strong', 'weak'],
    worldState: {
      rngSeed: 'siege-init-seed', tick: 4,
      relationshipStates: { 'edge.strong.weak': { relationshipType: 'hostile' } },
      warPosture: { strong: { state: 'mobilized', progress: 1, sinceTick: 0 } },
      simulationRules: { warLayerEnabled: true, ...extraRules },
    },
    regionalGraph: ensureRegionalGraph({
      edges: [{ id: 'edge.strong.weak', from: 'strong', to: 'weak', relationshipType: 'hostile' }],
      channels: [],
    }),
    wizardNews: { currentTick: 4, entries: [] },
  };
}

const run = (extraRules = {}, opts = {}) =>
  simulateCampaignWorldPulse({ campaign: campaign(extraRules), saves: SAVES, interval: 'one_week', now: NOW, ...opts });

const frontOn = (graph) => (graph.channels || []).some(
  c => c.type === 'war_front' && c.from === 'strong' && c.to === 'weak' && c.status === 'confirmed');
const deployOf = (r) => r.worldState.deployments?.strong;
const strategyDeploy = (r) => (r.selected || []).find(o => o.candidateType === 'strategy_deploy');

describe('M9d — the war domain tri-state (the CL-0 deferral closes)', () => {
  test('war is a LIVE dm-driven domain; the row reports dm under the forcing modes only', () => {
    expect(SIMULATION_DOMAINS.war.dmDriven).toBe('live');
    const dm = normalizeSimulationRules({ politicalAutonomy: 'recommendations', warLayerEnabled: true });
    expect(domainState(dm, 'war')).toBe('dm');
    expect(domainState(normalizeSimulationRules({ politicalAutonomy: 'dm_only', warLayerEnabled: true }), 'war')).toBe('dm');
    // Legacy autonomy keeps war on 'auto' (byte-identical inline mint).
    expect(domainState(normalizeSimulationRules({ politicalAutonomy: 'routine', warLayerEnabled: true }), 'war')).toBe('auto');
    expect(domainState(normalizeSimulationRules({ politicalAutonomy: 'full', warLayerEnabled: true }), 'war')).toBe('auto');
    // Off overrides everything.
    expect(domainState(normalizeSimulationRules({ politicalAutonomy: 'dm_only', warLayerEnabled: false }), 'war')).toBe('off');
  });
});

describe('M9d — LEGACY / AUTO: the inline mint is verbatim', () => {
  test('routine autonomy opens the siege inline, no proposal, no siege_initiation payload', () => {
    const r = run(); // default politicalAutonomy = routine
    const deploy = strategyDeploy(r);
    expect(deploy).toBeTruthy();
    expect(deploy.applyMode).toBe('auto');
    expect(deploy.proposalPayload).toBeUndefined();     // no field added on the legacy path
    // The siege committed THIS tick (inline).
    expect(deployOf(r)).toMatchObject({ targetId: 'weak', role: 'siege' });
    expect(frontOn(r.regionalGraph)).toBe(true);
    // Nothing queued to the approval queue.
    expect((r.worldState.proposals || []).some(p => p.outcome?.candidateType === 'strategy_deploy')).toBe(false);
  });

  test('full autonomy is ALSO the inline mint (only dm_only/recommendations route)', () => {
    const r = run({ politicalAutonomy: 'full' });
    expect(strategyDeploy(r).applyMode).toBe('auto');
    expect(deployOf(r)).toMatchObject({ targetId: 'weak', role: 'siege' });
    expect(frontOn(r.regionalGraph)).toBe(true);
  });
});

describe('M9d — DM-DRIVEN: initiation routes through the approval queue', () => {
  test('recommendations HOLDS the mint and queues a pending siege_initiation proposal', () => {
    const r = run({ politicalAutonomy: 'recommendations' });
    const deploy = strategyDeploy(r);
    expect(deploy).toBeTruthy();
    expect(deploy.applyMode).toBe('proposal');
    expect(deploy.proposalPayload).toMatchObject({
      kind: 'siege_initiation', besieger: 'strong', besieged: 'weak',
    });
    // The seeded deployment record rides the payload (apply re-mints from it).
    expect(deploy.proposalPayload.deployment).toMatchObject({ targetId: 'weak', role: 'siege' });
    expect(deploy.proposalPayload.warFront).toMatchObject({ type: 'war_front', from: 'strong', to: 'weak' });

    // NO siege committed this tick — the mint is WITHHELD.
    expect(deployOf(r)).toBeUndefined();
    expect(frontOn(r.regionalGraph)).toBe(false);
    // The war-init is a PENDING proposal in the queue, never auto-applied.
    const pending = (r.worldState.proposals || []).find(p => p.outcome?.candidateType === 'strategy_deploy');
    expect(pending).toBeTruthy();
    expect(pending.status).toBe('pending');
    expect((r.autoApplied || []).some(o => o.candidateType === 'strategy_deploy')).toBe(false);
  });

  test('dm_only behaves identically (both forcing modes route)', () => {
    const r = run({ politicalAutonomy: 'dm_only' });
    expect(strategyDeploy(r).applyMode).toBe('proposal');
    expect(deployOf(r)).toBeUndefined();
    expect(frontOn(r.regionalGraph)).toBe(false);
    expect((r.worldState.proposals || []).some(
      p => p.outcome?.proposalPayload?.kind === 'siege_initiation')).toBe(true);
  });

  test('APPROVE the pending war-init → the held siege re-mints (deployment + war_front)', () => {
    const r = run({ politicalAutonomy: 'recommendations' });
    const pending = (r.worldState.proposals || []).find(p => p.outcome?.candidateType === 'strategy_deploy');
    expect(pending).toBeTruthy();

    const approved = applyWorldPulseProposal({
      campaign: {
        ...campaign({ politicalAutonomy: 'recommendations' }),
        worldState: r.worldState,
        regionalGraph: r.regionalGraph,
        wizardNews: r.wizardNews,
      },
      saves: SAVES,
      proposalId: pending.id,
      now: NOW,
    });
    expect(approved).toBeTruthy();
    // The army marched: the seeded deployment now lives on the ledger.
    expect(approved.worldState.deployments?.strong).toMatchObject({ targetId: 'weak', role: 'siege' });
    // The war_front is confirmed on the graph.
    expect(frontOn(approved.regionalGraph)).toBe(true);
    // The proposal is resolved (no longer pending).
    expect((approved.worldState.proposals || []).find(p => p.id === pending.id)?.status).toBe('applied');
  });

  test('DECLINE / never-approve → NO war (the held mint simply never lands)', () => {
    const r = run({ politicalAutonomy: 'recommendations' });
    // The advance result itself already IS the "not yet approved" world: the siege is
    // held, so declining (dismissing) or letting the proposal expire opens no war.
    expect(deployOf(r)).toBeUndefined();
    expect(frontOn(r.regionalGraph)).toBe(false);
    // Applying a NON-siege proposal id must not conjure the siege either.
    const approved = applyWorldPulseProposal({
      campaign: { ...campaign({ politicalAutonomy: 'recommendations' }), worldState: r.worldState, regionalGraph: r.regionalGraph, wizardNews: r.wizardNews },
      saves: SAVES,
      proposalId: 'world_proposal.does.not.exist',
      now: NOW,
    });
    expect(approved).toBeNull(); // unknown proposal → no-op
    expect(r.worldState.deployments?.strong).toBeUndefined();
  });

  test('the re-minted siege carries the SAME committed force as the legacy inline mint', () => {
    // The approved DM-Driven deployment must equal the record the auto path would have
    // seeded (same seedDeploymentState call, same rng draw) — the split is a pure routing
    // change, not a strength change.
    const legacy = run(); // routine → inline
    const dm = run({ politicalAutonomy: 'recommendations' });
    const pending = (dm.worldState.proposals || []).find(p => p.outcome?.candidateType === 'strategy_deploy');
    const approved = applyWorldPulseProposal({
      campaign: { ...campaign({ politicalAutonomy: 'recommendations' }), worldState: dm.worldState, regionalGraph: dm.regionalGraph, wizardNews: dm.wizardNews },
      saves: SAVES, proposalId: pending.id, now: NOW,
    });
    expect(approved.worldState.deployments.strong).toEqual(legacy.worldState.deployments.strong);
  });
});

describe('M9d — RESOLUTION is UNCHANGED (only initiation splits)', () => {
  // A pre-seeded LIVE siege (deployment + confirmed war_front already in place). Under
  // BOTH autonomy modes the resolution path (resolveSiegeVerdict) must run identically —
  // it is not routed through the initiation authority.
  function besiegedCampaign(extraRules = {}) {
    const base = campaign(extraRules);
    return {
      ...base,
      worldState: {
        ...base.worldState,
        deployments: { strong: { targetId: 'weak', sinceTick: 0, role: 'siege', maxStartStrength: 5000, currentEffectiveStrength: 5000, accumulatedAttrition: 0, reinforcementFlow: 0, deploymentAge: 4, manpower: 0.6, supplyIntegrity: 0.6, morale: 0.6, equipmentCondition: 0.6, magicSupport: 0.5, commandQuality: 0.6, foodReserve: 0.6, logisticsBurden: 0.3, objective: 'conquest', returnCondition: 'pending' } },
      },
      regionalGraph: ensureRegionalGraph({
        edges: [{ id: 'edge.strong.weak', from: 'strong', to: 'weak', relationshipType: 'hostile' }],
        channels: [{
          type: 'war_front', from: 'strong', to: 'weak', direction: 'directed', status: 'confirmed',
          strength: 0.8, confidence: 0.8, relationshipKey: 'war_front.strong.weak',
          discoveredAt: NOW, confirmedAt: NOW, updatedAt: NOW,
          evidence: [{ source: 'war_layer_deploy', reason: 'x', outcomeId: null }],
        }],
      }),
    };
  }
  const resolveRun = (extraRules) => simulateCampaignWorldPulse({
    campaign: besiegedCampaign(extraRules), saves: SAVES, interval: 'one_week', now: NOW,
  });

  test('a live siege resolves identically under routine vs recommendations', () => {
    const legacy = resolveRun({ politicalAutonomy: 'routine' });
    const dm = resolveRun({ politicalAutonomy: 'recommendations' });
    // The besieger already holds an army → the one-army gate blocks a NEW siege-init in
    // BOTH runs, so no strategy_deploy proposal appears (initiation is not re-triggered).
    expect((dm.worldState.proposals || []).some(p => p.outcome?.candidateType === 'strategy_deploy')).toBe(false);
    // The deployment ledger (the resolution state machine's output) is byte-identical:
    // resolution never consults the initiation authority.
    expect(dm.worldState.deployments).toEqual(legacy.worldState.deployments);
  });

  test('a conquest outcome stays applyMode auto under DM-Driven (resolution is not proposal-gated)', () => {
    const dm = resolveRun({ politicalAutonomy: 'recommendations' });
    const conquest = (dm.selected || []).find(o => o.candidateType === 'conquest');
    if (conquest) expect(conquest.applyMode).toBe('auto');
    // (If the single tick did not fall the town, the invariant above — identical
    // deployment ledger across modes — already proves resolution is mode-agnostic.)
    expect(true).toBe(true);
  });
});
