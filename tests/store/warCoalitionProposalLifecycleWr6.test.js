import { beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false },
}));

vi.mock('../../src/lib/campaigns.js', () => {
  const cached = new Map();
  const clone = (value) => JSON.parse(JSON.stringify(value));
  return {
    isCampaignActive: (campaign) => (campaign?.accessState || 'active') === 'active',
    campaigns: {
      loadCached: vi.fn((ownerId = 'anon') => clone(cached.get(ownerId) || [])),
      cache: vi.fn((campaigns = [], ownerId = 'anon') => {
        cached.set(ownerId, clone(campaigns));
      }),
      list: vi.fn(() => Promise.resolve([])),
      upsert: vi.fn((campaign) => Promise.resolve(campaign?.id)),
      delete: vi.fn(() => Promise.resolve()),
      isConfigured: false,
    },
  };
});

vi.mock('../../src/lib/flags.js', () => ({
  flag: vi.fn(() => false),
}));

vi.mock('../../src/lib/analytics.js', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, track: vi.fn() };
});

import { createCampaignSlice } from '../../src/store/campaignSlice.js';
import { createCampaignWorldPulseSlice } from '../../src/store/campaignWorldPulseSlice.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { simulateCampaignWorldInterval } from '../../src/domain/worldPulse/index.js';
import { evaluateWarLayer } from '../../src/domain/worldPulse/warDeployment.js';
import { readCoalitionJoinDecisions } from '../../src/domain/worldPulse/warCoalitionDecision.js';
import { canonicalRelationshipSeed } from '../../src/domain/worldPulse/relationshipEdgeSeed.js';
import { coalitionCallIdFor } from '../../src/domain/worldPulse/warCoalitionLedger.js';
import {
  canonizeWorldState,
  ensureWorldState,
} from '../../src/domain/worldPulse/worldState.js';

const NOW = '2026-08-02T00:00:00.000Z';
const RULES = Object.freeze({
  warLayerEnabled: true,
  warTerminationEnabled: true,
  peaceEngineEnabled: true,
  coalitionLedgerEnabled: true,
  politicalAutonomy: 'dm_only',
});
const HIGH_ROLL = Object.freeze({
  random: () => 0.999999,
  fork() { return this; },
});

const HOSTILE = Object.freeze({
  id: 'edge.attacker.defender',
  from: 'attacker',
  to: 'defender',
  relationshipType: 'hostile',
});
const ALLIANCE = Object.freeze({
  id: 'edge.defender.ally',
  from: 'defender',
  to: 'ally',
  relationshipType: 'allied',
});
const ENEMY_IDENTITY = canonicalRelationshipSeed('ally', 'attacker');

function installLocalStorage() {
  const data = new Map();
  globalThis.localStorage = {
    getItem: (key) => data.get(String(key)) ?? null,
    setItem: (key, value) => { data.set(String(key), String(value)); },
    removeItem: (key) => { data.delete(String(key)); },
    clear: () => { data.clear(); },
  };
}

const stubSlice = () => ({
  savedSettlements: [],
  settlement: null,
  activeSaveId: null,
  phase: 'draft',
  eventLog: [],
  locks: {},
  generatedAt: null,
  editedAt: null,
  canonizedAt: null,
  lastExportAt: null,
});

function makeStore() {
  return create(immer((...args) => ({
    ...stubSlice(...args),
    ...createCampaignSlice(...args),
    ...createCampaignWorldPulseSlice(...args),
  })));
}

function settlement(name, { tier, population } = {}) {
  return {
    name,
    tier: tier || 'town',
    population: population || 5000,
    config: { priorityEconomy: 25, priorityMilitary: 35, tradeRouteAccess: 'road' },
    institutions: [],
    economicState: {
      prosperity: 'Prosperous',
      primaryExports: [],
      primaryImports: [],
    },
    powerStructure: {
      publicLegitimacy: { score: 60, label: 'Stable' },
      factions: [{
        id: `seat-${name}`,
        faction: `${name} Council`,
        category: 'military',
        power: 70,
        isGoverning: true,
      }],
      conflicts: [],
    },
    npcs: [],
    activeConditions: [],
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

function rootDeployment() {
  return {
    targetId: 'defender',
    sinceTick: 2,
    role: 'siege',
    maxStartStrength: 55,
    currentEffectiveStrength: 55,
    accumulatedAttrition: 0,
    reinforcementFlow: 0,
    deploymentAge: 2,
    manpower: 0.7,
    supplyIntegrity: 0.7,
    morale: 0.7,
    equipmentCondition: 0.7,
    magicSupport: 0.5,
    commandQuality: 0.7,
    foodReserve: 0.7,
    logisticsBurden: 0.1,
    objective: 'conquest',
    returnCondition: 'pending',
    casusReasons: [{
      type: 'grievance',
      score: 0.8,
      receipt: 'The opening wrong still stands.',
      atTick: 2,
    }],
  };
}

function fixture() {
  const saves = [
    save('attacker', 'Ironhold', { tier: 'city', population: 40000 }),
    save('defender', 'Thornmere', { tier: 'village', population: 800 }),
    save('ally', 'Brookhaven', { tier: 'town', population: 7000 }),
  ];
  const worldState = {
    tick: 4,
    rngSeed: 'wr6-proposal-lifecycle',
    simulationRules: { ...RULES },
    deployments: { attacker: rootDeployment() },
    relationshipStates: {
      [HOSTILE.id]: { relationshipType: 'hostile' },
      [ALLIANCE.id]: { relationshipType: 'allied' },
    },
    spatialCanonVersion: 1,
    spatialLedgers: {
      warReasons: {
        'attacker>defender': {
          reasons: {
            grievance: {
              type: 'grievance',
              score: 0.8,
              sinceTick: 2,
              tick: 4,
              receipt: 'The opening wrong still stands.',
            },
          },
          updatedTick: 4,
        },
      },
      // Keep the root army on the road during this lifecycle test. The coalition
      // call remains live while the siege resolver cannot end its origin episode.
      armyTransit: {
        attacker: {
          armyId: 'attacker',
          role: 'march',
          originId: 'attacker',
          destId: 'defender',
          path: ['attacker', 'defender'],
          departTick: 2,
          arrivalTick: 100,
          position01: 0.02,
          strength: 55,
          readiness: 0.7,
          supplyQuality: 0.7,
          funding: 0.7,
          beliefStaleness: 0,
          lastTick: 4,
        },
      },
    },
  };
  const campaign = {
    id: 'camp-wr6-lifecycle',
    name: 'WR-6 proposal lifecycle',
    settlementIds: saves.map((row) => row.id),
    worldState,
    regionalGraph: ensureRegionalGraph({
      edges: [HOSTILE, ALLIANCE],
      channels: [{
        type: 'war_front',
        from: 'attacker',
        to: 'defender',
        status: 'confirmed',
        source: 'war_layer_deploy',
        relationshipKey: 'war_front.attacker.defender',
      }],
    }, { now: NOW }),
    wizardNews: { currentTick: 4, entries: [] },
  };
  return { campaign, saves };
}

function foldOntoSaves(saves, updates) {
  const byId = new Map((updates || []).map((row) => [String(row.saveId), row.settlement]));
  return saves.map((row) => (byId.has(String(row.id))
    ? { ...row, settlement: byId.get(String(row.id)) }
    : row));
}

function cursorFrom(paused, decisions = {}) {
  return {
    interval: paused.interval,
    ticksTotal: paused.ticksTotal,
    resumeTick: paused.resumeTick,
    pendingMajors: paused.pendingMajors,
    preWorldState: paused.preWorldState,
    preRegionalGraph: paused.preRegionalGraph,
    preWizardNews: paused.preWizardNews,
    preSaves: paused.preSaves,
    preIntervalHistoryLen: paused.preIntervalHistoryLen,
    decisions,
  };
}

function pendingCoalitionProposal(worldState) {
  return (worldState.proposals || []).find((row) => (
    row.status === 'pending'
    && row.outcome?.metadata?.incidentType === 'coalition_joined'
  ));
}

function allianceCalls(worldState) {
  return worldState.relationshipStates?.[ALLIANCE.id]?.allianceCalls || [];
}

function coalitionFronts(graph) {
  return (graph.channels || []).filter((row) => (
    row.type === 'war_front'
    && row.from === 'ally'
    && row.to === 'attacker'
    && row.status === 'confirmed'
  ));
}

function expectNoJoinResidue({ worldState, regionalGraph }) {
  expect(worldState.deployments?.ally).toBeUndefined();
  expect(allianceCalls(worldState)).toEqual([]);
  expect(worldState.relationshipStates?.[ENEMY_IDENTITY.relationshipKey]).toBeUndefined();
  expect((regionalGraph.edges || []).filter((row) => (
    row.id === ENEMY_IDENTITY.relationshipKey && row.relationshipType === 'hostile'
  ))).toEqual([]);
  expect(coalitionFronts(regionalGraph)).toEqual([]);
}

async function pauseAndResume() {
  const base = fixture();
  const paused = await simulateCampaignWorldInterval({
    campaign: base.campaign,
    saves: base.saves,
    interval: 'one_week',
    commit: true,
    now: NOW,
    autoResolve: false,
  });
  expect(paused.status).toBe('paused');
  const pendingMajor = paused.pendingMajors.find((row) => (
    row.metadata?.incidentType === 'coalition_joined'
  ));
  expect(pendingMajor).toBeTruthy();

  const resumed = await simulateCampaignWorldInterval({
    campaign: base.campaign,
    saves: base.saves,
    commit: true,
    now: NOW,
    autoResolve: false,
    resume: cursorFrom(paused),
  });
  expect(resumed.status).toBe('complete');
  const proposal = pendingCoalitionProposal(resumed.worldState);
  expect(proposal).toBeTruthy();
  return {
    ...base,
    paused,
    resumed,
    proposal,
    savesAfterResume: foldOntoSaves(base.saves, resumed.settlementUpdates),
  };
}

function seedStore(store, lifecycle) {
  store.setState((state) => {
    state.savedSettlements = JSON.parse(JSON.stringify(lifecycle.savesAfterResume));
    state.campaigns = [JSON.parse(JSON.stringify({
      ...lifecycle.campaign,
      worldState: lifecycle.resumed.worldState,
      regionalGraph: lifecycle.resumed.regionalGraph,
      wizardNews: lifecycle.resumed.wizardNews,
    }))];
  });
}

function currentCampaign(store) {
  return store.getState().campaigns[0];
}

function canonicalStoreState(store) {
  const campaign = currentCampaign(store);
  return JSON.parse(JSON.stringify({
    worldState: campaign.worldState,
    regionalGraph: campaign.regionalGraph,
    wizardNews: campaign.wizardNews,
    saves: store.getState().savedSettlements.map((row) => ({
      id: row.id,
      name: row.name,
      phase: row.phase,
      settlement: row.settlement,
      campaignState: row.campaignState,
    })),
  }));
}

describe('WR-6 coalition proposal lifecycle', () => {
  beforeEach(() => {
    installLocalStorage();
  });

  test('pause and recommended resume retain a pending question without join residue', async () => {
    const lifecycle = await pauseAndResume();

    expectNoJoinResidue({
      worldState: lifecycle.paused.worldState,
      regionalGraph: lifecycle.paused.regionalGraph,
    });
    expect(pendingCoalitionProposal(lifecycle.paused.worldState)).toBeUndefined();
    expectNoJoinResidue({
      worldState: lifecycle.resumed.worldState,
      regionalGraph: lifecycle.resumed.regionalGraph,
    });
    expect(lifecycle.proposal.outcome.proposalPayload.deployment.joinLedger).toHaveLength(1);
  });

  test('dismissal leaves no residue and the same origin call remains reachable later', async () => {
    const lifecycle = await pauseAndResume();
    const store = makeStore();
    seedStore(store, lifecycle);
    const proposalId = lifecycle.proposal.id;
    const originalCallId = lifecycle.proposal.outcome.metadata.allianceCall.callId;

    const dismissed = await store.getState().dismissWorldPulseProposal(
      lifecycle.campaign.id,
      proposalId,
    );
    expect(dismissed).toMatchObject({ id: proposalId, status: 'dismissed' });
    const campaign = currentCampaign(store);
    expectNoJoinResidue(campaign);
    expect(campaign.worldState.proposals.find((row) => row.id === proposalId))
      .toMatchObject({ status: 'dismissed' });

    const laterWorldState = { ...campaign.worldState, tick: campaign.worldState.tick + 1 };
    const laterCampaign = { ...campaign, worldState: laterWorldState };
    const snapshot = buildWorldSnapshot({
      campaign: laterCampaign,
      saves: store.getState().savedSettlements,
      worldState: laterWorldState,
    });
    const decisions = readCoalitionJoinDecisions({
      snapshot,
      worldState: laterWorldState,
      tick: laterWorldState.tick,
      strengthFor: () => 0.5,
    });
    expect(decisions.find((row) => row.partyId === 'ally')).toMatchObject({
      callId: originalCallId,
      accepted: true,
    });

    const reopened = evaluateWarLayer({
      snapshot,
      worldState: laterWorldState,
      rng: HIGH_ROLL,
      tick: laterWorldState.tick,
      now: NOW,
      rules: laterWorldState.simulationRules,
    });
    const heldAgain = reopened.outcomes.find((row) => (
      row.metadata?.incidentType === 'coalition_joined'
      && row.metadata?.allianceCall?.partyId === 'ally'
    ));
    expect(heldAgain).toMatchObject({
      applyMode: 'proposal',
      metadata: { allianceCall: { callId: originalCallId } },
    });
    expect(reopened.deployments.ally).toBeUndefined();
  });

  test('proposal undo restores the exact pre-approval coalition world', async () => {
    const lifecycle = await pauseAndResume();
    const store = makeStore();
    seedStore(store, lifecycle);
    const campaignId = lifecycle.campaign.id;
    const before = canonicalStoreState(store);

    const applied = await store.getState().applyWorldPulseProposal(
      campaignId,
      lifecycle.proposal.id,
    );
    expect(applied).toBeTruthy();
    const approved = currentCampaign(store);
    expect(approved.worldState.deployments.ally?.joinLedger).toHaveLength(1);
    expect(allianceCalls(approved.worldState)).toEqual([
      expect.objectContaining({
        callId: lifecycle.proposal.outcome.metadata.allianceCall.callId,
        decision: 'joined',
      }),
    ]);
    expect(approved.worldState.relationshipStates[ENEMY_IDENTITY.relationshipKey])
      .toMatchObject({ relationshipType: 'hostile' });
    expect(store.getState().proposalUndoStack.filter((row) => row.campaignId === campaignId))
      .toHaveLength(1);

    expect(await store.getState().undoLastProposalApply(campaignId)).toBe(true);
    expect(canonicalStoreState(store)).toEqual(before);
    expectNoJoinResidue(currentCampaign(store));
    expect(pendingCoalitionProposal(currentCampaign(store).worldState)?.id)
      .toBe(lifecycle.proposal.id);
  });

  test('approved join anchors and call archives survive ensure and canon round-trips', async () => {
    const lifecycle = await pauseAndResume();
    const store = makeStore();
    seedStore(store, lifecycle);
    await store.getState().applyWorldPulseProposal(
      lifecycle.campaign.id,
      lifecycle.proposal.id,
    );
    const approved = currentCampaign(store);
    const approvedWorld = approved.worldState;
    const anchor = approvedWorld.deployments.ally.joinLedger[0];
    const calls = allianceCalls(approvedWorld);

    const ensured = ensureWorldState(
      JSON.parse(JSON.stringify(approvedWorld)),
      approved,
    );
    expect(ensured.deployments.ally.joinLedger).toEqual([anchor]);
    expect(allianceCalls(ensured)).toEqual(calls);

    const canonized = canonizeWorldState(ensured, NOW, approved);
    const revived = ensureWorldState(
      JSON.parse(JSON.stringify(canonized)),
      approved,
    );
    expect(revived.deployments.ally.joinLedger).toEqual([anchor]);
    expect(allianceCalls(revived)).toEqual(calls);
    expect(ensureWorldState(revived, approved)).toEqual(revived);
    expect(anchor.callId).toBe(coalitionCallIdFor({
      callerId: anchor.callerId,
      partyId: anchor.partyId,
      enemyId: anchor.enemyId,
      callerDeploymentSinceTick: anchor.callerDeploymentSinceTick,
    }));
  });
});
