/**
 * actorMajorApproval.m10a.test.js — Phase 5.5 mover M10a (CL-3, THE APPROVAL-QUEUE
 * EXTENSION). Routine finally keeps the §11 promise ("ordinary auto, MAJORS need
 * approval") for the ACTOR-INITIATED majors — a war declaration and a coup route
 * through the SAME approval queue M9d built, GATED behind the routineMajorApproval
 * opt-in so a routine-DEFAULT profile stays byte-identical (proven by the CL-0 +
 * siege pins + goldens elsewhere).
 *
 * COVERAGE:
 *   • authorityFor — the routine-gate routing (strategy_deploy / coup_succeeded),
 *     verbatim under routine-DEFAULT (no flag) + full, forced under dm_only/recs.
 *   • War declaration under routine+gate: routes to a HELD proposal (deployment
 *     withheld), approve re-mints, and the HOLD dedups (no per-tick re-proposal).
 *   • Coup under routine+gate: the seat-change routes to a held proposal.
 *   • HOLD-THEN-EXPIRE: a held major expires to decline after ACTOR_MAJOR_HOLD_WEEKS
 *     and NEVER deadlocks the advance (the world advances around the queue).
 *   • infoMode 'full' — the unlocked ceiling: stored, beliefs live, news distorts.
 */
import { describe, expect, test } from 'vitest';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/pulseKernel.js';
import { applyWorldPulseProposal } from '../../src/domain/worldPulse/applyWorldPulse.js';
import { authorityFor } from '../../src/domain/worldPulse/changeAuthorityPolicy.js';
import {
  ACTOR_MAJOR_HOLD_WEEKS,
  ACTOR_INITIATED_MAJOR_TYPES,
  isActorInitiatedMajorType,
  routineMajorApprovalEnabled,
  pendingActorMajorFor,
  expireStaleActorMajors,
} from '../../src/domain/worldPulse/actorMajorApproval.js';
import { infoModeOf } from '../../src/domain/worldPulse/simulationRules.js';
import { beliefsActive } from '../../src/domain/worldPulse/beliefMap.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

const NOW = '2026-01-01T00:00:00.000Z';

// ── authorityFor: the routine-gate routing ──────────────────────────────────
describe('M10a — authorityFor: the routine major-approval gate', () => {
  const ROUTINE = { politicalAutonomy: 'routine' };
  const ROUTINE_GATED = { politicalAutonomy: 'routine', routineMajorApproval: true };

  test('routine-DEFAULT (no opt-in) passes actor-majors through VERBATIM (byte-identical)', () => {
    for (const changeType of ['strategy_deploy', 'coup_succeeded', 'intervention_ordered']) {
      expect(authorityFor(ROUTINE, changeType, 'auto')).toBe('auto');
      expect(authorityFor(ROUTINE, changeType, 'proposal')).toBe('proposal');
      // Absent rules / legacy flag reads route nowhere new either.
      expect(authorityFor(undefined, changeType, 'auto')).toBe('auto');
      expect(authorityFor({ majorChangesRequireProposal: true }, changeType, 'auto')).toBe('auto');
    }
  });

  test('routine + opt-in routes the ACTOR-INITIATED majors to proposal', () => {
    expect(authorityFor(ROUTINE_GATED, 'strategy_deploy', 'auto')).toBe('proposal');
    expect(authorityFor(ROUTINE_GATED, 'coup_succeeded', 'auto')).toBe('proposal');
    expect(authorityFor(ROUTINE_GATED, 'intervention_ordered', 'auto')).toBe('proposal');
  });

  test('routine + opt-in leaves NON-major changeTypes verbatim (the choke-point families)', () => {
    // Every ruleFamily the evaluateWorldPulseRules choke point passes falls through.
    for (const changeType of ['pressure_event', 'stressor', 'organic_drift', 'faction', 'conquest', 'occupation_vassalized', 'anything']) {
      expect(authorityFor(ROUTINE_GATED, changeType, 'auto')).toBe('auto');
      expect(authorityFor(ROUTINE_GATED, changeType, 'proposal')).toBe('proposal');
    }
  });

  test('full autonomy is byte-identical (verbatim) even with the opt-in present', () => {
    const full = { politicalAutonomy: 'full', routineMajorApproval: true };
    expect(authorityFor(full, 'strategy_deploy', 'auto')).toBe('auto');
    expect(authorityFor(full, 'coup_succeeded', 'auto')).toBe('auto');
  });

  test('the forcing modes still force everything (M9d behavior preserved)', () => {
    for (const mode of ['dm_only', 'recommendations']) {
      expect(authorityFor({ politicalAutonomy: mode }, 'strategy_deploy', 'auto')).toBe('proposal');
      expect(authorityFor({ politicalAutonomy: mode }, 'coup_succeeded', 'auto')).toBe('proposal');
      expect(authorityFor({ politicalAutonomy: mode }, 'pressure_event', 'auto')).toBe('proposal');
    }
  });

  test('the helpers agree with the routing', () => {
    expect([...ACTOR_INITIATED_MAJOR_TYPES].sort()).toEqual(['blockade_declared', 'coup_succeeded', 'intervention_ordered', 'strategy_deploy', 'treaty_breached']);
    expect(isActorInitiatedMajorType('strategy_deploy')).toBe(true);
    expect(isActorInitiatedMajorType('treaty_breached')).toBe(true);
    expect(isActorInitiatedMajorType('conquest')).toBe(false);
    expect(routineMajorApprovalEnabled({ routineMajorApproval: true })).toBe(true);
    expect(routineMajorApprovalEnabled({ routineMajorApproval: 'yes' })).toBe(false); // tolerant: only explicit true
    expect(routineMajorApprovalEnabled({})).toBe(false);
    expect(routineMajorApprovalEnabled(null)).toBe(false);
  });
});

// ── HOLD-THEN-EXPIRE (pure) ─────────────────────────────────────────────────
describe('M10a — expireStaleActorMajors: hold-then-expire, never deadlocks', () => {
  const heldProposal = (id, candidateType, tick) => ({
    id, status: 'pending', tick, updatedAt: NOW,
    outcome: { candidateType, targetSaveId: 'strong' },
  });

  test('a held major EXPIRES TO DECLINE at ACTOR_MAJOR_HOLD_WEEKS', () => {
    const ws = { tick: 0, proposals: [heldProposal('p1', 'strategy_deploy', 0)] };
    // One week short of the horizon: still holding.
    const held = expireStaleActorMajors(ws, ACTOR_MAJOR_HOLD_WEEKS - 1, NOW);
    expect(held.proposals[0].status).toBe('pending');
    // At the horizon: the actor stands down.
    const expired = expireStaleActorMajors(ws, ACTOR_MAJOR_HOLD_WEEKS, NOW);
    expect(expired.proposals[0].status).toBe('expired');
    expect(expired.proposals[0].expiredAt).toBe(NOW);
  });

  test('coup holds expire on the same horizon', () => {
    const ws = { tick: 0, proposals: [heldProposal('c1', 'coup_succeeded', 2)] };
    const expired = expireStaleActorMajors(ws, 2 + ACTOR_MAJOR_HOLD_WEEKS, NOW);
    expect(expired.proposals[0].status).toBe('expired');
  });

  test('NON-actor-major proposals and already-resolved ones are never touched', () => {
    const ws = {
      tick: 0,
      proposals: [
        heldProposal('keep1', 'flow_migration', 0),          // not an actor-major
        { ...heldProposal('keep2', 'strategy_deploy', 0), status: 'applied' }, // already resolved
      ],
    };
    const out = expireStaleActorMajors(ws, 999, NOW);
    expect(out).toBe(ws); // SAME reference — nothing matched ⇒ byte-identical
  });

  test('legacy/default worlds (no proposals) return the SAME worldState reference', () => {
    const ws = { tick: 5 };
    expect(expireStaleActorMajors(ws, 5, NOW)).toBe(ws);
    const empty = { tick: 5, proposals: [] };
    expect(expireStaleActorMajors(empty, 5, NOW)).toBe(empty);
  });
});

// ── WAR DECLARATION under routine + the opt-in ──────────────────────────────
// A strong mobilized city, hostile toward a weak feasible village → Step 4 opens
// a fresh siege this tick (the M9d fixture shape).
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
const save = (id, name, settlement) => ({ id, name, phase: 'canon', settlement, campaignState: { phase: 'canon', eventLog: [], locks: {} } });
const SAVES = [save('strong', 'Ironhold', fortifiedCity('Ironhold')), save('weak', 'Thornmere', weakVillage('Thornmere'))];

function warCampaign(extraRules = {}, extraState = {}) {
  return {
    id: 'siege-init', settlementIds: ['strong', 'weak'],
    worldState: {
      rngSeed: 'siege-init-seed', tick: 4,
      relationshipStates: { 'edge.strong.weak': { relationshipType: 'hostile' } },
      warPosture: { strong: { state: 'mobilized', progress: 1, sinceTick: 0 } },
      simulationRules: { warLayerEnabled: true, ...extraRules },
      ...extraState,
    },
    regionalGraph: ensureRegionalGraph({
      edges: [{ id: 'edge.strong.weak', from: 'strong', to: 'weak', relationshipType: 'hostile' }],
      channels: [],
    }),
    wizardNews: { currentTick: 4, entries: [] },
  };
}
const runWar = (extraRules = {}, extraState = {}) =>
  simulateCampaignWorldPulse({ campaign: warCampaign(extraRules, extraState), saves: SAVES, interval: 'one_week', now: NOW });
const strategyDeploy = (r) => (r.selected || []).find(o => o.candidateType === 'strategy_deploy');
const frontOn = (graph) => (graph.channels || []).some(c => c.type === 'war_front' && c.from === 'strong' && c.to === 'weak' && c.status === 'confirmed');

describe('M10a — a war declaration routes through the approval queue under routine+opt-in', () => {
  test('routine-DEFAULT (no opt-in) still mints INLINE — byte-identical to M9d', () => {
    const r = runWar(); // virtual routine, no opt-in
    expect(strategyDeploy(r).applyMode).toBe('auto');
    expect(r.worldState.deployments?.strong).toMatchObject({ targetId: 'weak', role: 'siege' });
    expect(frontOn(r.regionalGraph)).toBe(true);
  });

  test('routine + opt-in HOLDS the mint and queues a pending declaration', () => {
    const r = runWar({ routineMajorApproval: true });
    const deploy = strategyDeploy(r);
    expect(deploy.applyMode).toBe('proposal');
    expect(deploy.proposalPayload).toMatchObject({ kind: 'siege_initiation', besieger: 'strong', besieged: 'weak' });
    // NO siege committed — the mint is WITHHELD.
    expect(r.worldState.deployments?.strong).toBeUndefined();
    expect(frontOn(r.regionalGraph)).toBe(false);
    const pending = (r.worldState.proposals || []).find(p => p.outcome?.candidateType === 'strategy_deploy');
    expect(pending?.status).toBe('pending');
  });

  test('APPROVE the held declaration → the withheld siege re-mints', () => {
    const r = runWar({ routineMajorApproval: true });
    const pending = (r.worldState.proposals || []).find(p => p.outcome?.candidateType === 'strategy_deploy');
    const approved = applyWorldPulseProposal({
      campaign: { ...warCampaign({ routineMajorApproval: true }), worldState: r.worldState, regionalGraph: r.regionalGraph, wizardNews: r.wizardNews },
      saves: SAVES, proposalId: pending.id, now: NOW,
    });
    expect(approved.worldState.deployments?.strong).toMatchObject({ targetId: 'weak', role: 'siege' });
    expect(frontOn(approved.regionalGraph)).toBe(true);
    // The re-minted force equals the legacy inline mint (pure routing, no strength change).
    expect(approved.worldState.deployments.strong).toEqual(runWar().worldState.deployments.strong);
  });

  test('the HOLD dedups: a besieger with a pending declaration does not re-propose', () => {
    const r = runWar({ routineMajorApproval: true });
    const pending = (r.worldState.proposals || []).find(p => p.outcome?.candidateType === 'strategy_deploy');
    expect(pending).toBeTruthy();
    // Feed the tick forward WITH the pending proposal still unresolved (deployment still withheld).
    const next = simulateCampaignWorldPulse({
      campaign: { ...warCampaign({ routineMajorApproval: true }), worldState: { ...r.worldState, tick: r.worldState.tick + 1 }, regionalGraph: r.regionalGraph, wizardNews: r.wizardNews },
      saves: SAVES, interval: 'one_week', now: NOW,
    });
    // Still mobilized, still no deployment — but the actor HOLDS: no SECOND proposal minted.
    const deploysThisTick = (next.selected || []).filter(o => o.candidateType === 'strategy_deploy');
    expect(deploysThisTick).toHaveLength(0);
    const pendingCount = (next.worldState.proposals || []).filter(p => p.outcome?.candidateType === 'strategy_deploy' && p.status === 'pending').length;
    expect(pendingCount).toBe(1); // exactly the one held declaration
  });

  test('HOLD-THEN-EXPIRE end to end: the held declaration expires and the advance proceeds (no deadlock)', () => {
    const r = runWar({ routineMajorApproval: true });
    const pending = (r.worldState.proposals || []).find(p => p.outcome?.candidateType === 'strategy_deploy');
    // Advance the clock to the expiry horizon in ONE feed-forward (the expiry pass reads tick − proposal.tick).
    const expiredTick = pending.tick + ACTOR_MAJOR_HOLD_WEEKS;
    const next = simulateCampaignWorldPulse({
      campaign: { ...warCampaign({ routineMajorApproval: true }), worldState: { ...r.worldState, tick: expiredTick }, regionalGraph: r.regionalGraph, wizardNews: r.wizardNews },
      saves: SAVES, interval: 'one_week', now: NOW,
    });
    // The advance returned a normal result — the pending proposal never blocked it.
    expect(next.worldState).toBeTruthy();
    // The stale declaration expired to decline (the actor stood down).
    const original = (next.worldState.proposals || []).find(p => p.id === pending.id);
    expect(original?.status).toBe('expired');
  });
});

// ── COUP under routine + the opt-in ─────────────────────────────────────────
// A Crisis seat beside strong challengers with a live coup_detat about to resolve.
function coupSave(id, factions, legit) {
  return {
    id, name: id.toUpperCase(), phase: 'canon',
    settlement: {
      name: id, tier: 'town', population: 2600,
      config: { tradeRouteAccess: 'road' }, institutions: [],
      powerStructure: {
        governingName: 'City Council',
        publicLegitimacy: { score: legit, label: 'Crisis', govMultiplier: 0.7, crimMultiplier: 1.2 },
        factions, conflicts: [], factionRelationships: [],
      },
      npcs: [{ id: `n_${id}`, name: 'Reeve', importance: 'key' }],
      activeConditions: [],
      economicState: { prosperity: 'Struggling', primaryExports: [], primaryImports: [] },
    },
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  };
}
const coupFactions = [
  { faction: 'City Council', category: 'government', power: 22, isGoverning: true },
  { faction: 'The Garrison', category: 'military', power: 46 },
  { faction: 'Merchant League', category: 'merchant', power: 40 },
];
function coupCampaign(seed, extraRules = {}) {
  return {
    id: 'coup', name: 'coup', settlementIds: ['a', 'b'],
    worldState: {
      rngSeed: seed, tick: 6,
      relationshipStates: { 'edge.a.b': { relationshipType: 'hostile' } },
      simulationRules: { propagationMode: 'first_order', stressorsEnabled: true, ...extraRules },
      stressors: [{
        id: 'st_coup_a', type: 'coup_detat', status: 'active',
        severity: 0.72, peakSeverity: 0.82, age: 6,
        originSettlementId: 'a', affectedSettlementIds: ['a'], originTick: 0,
        originContext: { variant: 'military' },
      }],
    },
    regionalGraph: ensureRegionalGraph({ edges: [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'hostile' }], channels: [] }),
    wizardNews: { currentTick: 6, entries: [] },
  };
}
const coupSaves = () => [coupSave('a', coupFactions, 10), coupSave('b', [{ faction: 'Elders', category: 'government', isGoverning: true }], 40)];
const coupFall = (r) => (r.selected || []).find(o => o.candidateType === 'coup_succeeded');

describe('M10a — a coup routes through the approval queue under routine+opt-in', () => {
  // Scan seeds for one that produces a coup_succeeded (fall), then assert routing;
  // BOTH runs use the SAME seed so the verdict is identical — only applyMode routes.
  function findFallSeed() {
    for (let i = 0; i < 40; i++) {
      const seed = `coup-fall-${i}`;
      const r = simulateCampaignWorldPulse({ campaign: coupCampaign(seed), saves: coupSaves(), interval: 'one_week', now: NOW });
      if (coupFall(r)) return seed;
    }
    return null;
  }

  test('a succeeding coup is AUTO under routine-DEFAULT but a HELD proposal under routine+opt-in', () => {
    const seed = findFallSeed();
    expect(seed, 'expected at least one seed to yield a coup_succeeded').toBeTruthy();
    // routine-DEFAULT (no opt-in): the seat-change auto-applies (byte-identical).
    const legacy = simulateCampaignWorldPulse({ campaign: coupCampaign(seed), saves: coupSaves(), interval: 'one_week', now: NOW });
    expect(coupFall(legacy).applyMode).toBe('auto');
    // routine + opt-in: the SAME verdict routes to the approval queue.
    const gated = simulateCampaignWorldPulse({ campaign: coupCampaign(seed, { routineMajorApproval: true }), saves: coupSaves(), interval: 'one_week', now: NOW });
    const fall = coupFall(gated);
    expect(fall.applyMode).toBe('proposal');
    // The verdict itself (winner/losers) is unchanged — pure routing, no fresh roll.
    expect(fall.powerTransfer).toEqual(coupFall(legacy).powerTransfer);
    // It lands in the queue as a pending actor-major (dedup-visible).
    expect(pendingActorMajorFor(gated.worldState, 'coup_succeeded', fall.targetSaveId)).toBe(true);
  });

  test('dm_only also routes the coup (the forcing-mode path)', () => {
    const seed = findFallSeed();
    const dm = simulateCampaignWorldPulse({ campaign: coupCampaign(seed, { politicalAutonomy: 'dm_only' }), saves: coupSaves(), interval: 'one_week', now: NOW });
    expect(coupFall(dm).applyMode).toBe('proposal');
  });
});

// ── infoMode 'full' — the unlocked ceiling ──────────────────────────────────
describe('M10a — infoMode "full" completes the ladder', () => {
  test('the accessor returns full; beliefs are live under it', () => {
    expect(infoModeOf({ infoMode: 'full' })).toBe('full');
    // beliefsActive gates on infoMode !== omniscient (needs the spatial marker too).
    expect(beliefsActive({ simulationRules: { infoMode: 'full' }, spatialCanonVersion: 1, spatialDigest: {} })).toBe(true);
    expect(beliefsActive({ simulationRules: { infoMode: 'omniscient' }, spatialCanonVersion: 1, spatialDigest: {} })).toBe(false);
  });
});
