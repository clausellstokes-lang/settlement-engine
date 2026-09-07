/**
 * End-to-end store contract for the BILATERAL user-route vertical.
 *
 * The sibling suite proves the unilateral command. This one proves the two
 * things that only exist because a route has two ends: that ONE call carries
 * BOTH endpoint projections to the server, and that a confirmed answer lands on
 * BOTH cached rows. It also exercises the recovery coordinator against a
 * CREATE_ROUTE command, because "recovery comes free once the type joins the
 * authoritative list" is a claim, and a claim is not a receipt.
 *
 * Only the remote transport and the legacy save service are mocked; the slice,
 * the command executor, the adapter, and the domain writer are all real.
 */

import { beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

const transport = vi.hoisted(() => ({
  mode: 'server',
  commitRoute: vi.fn(),
  commitCut: vi.fn(),
  read: vi.fn(),
}));

vi.mock('../../src/lib/canonEventCommandPersistence.js', () => ({
  CANON_COMMAND_BACKEND: Object.freeze({
    LOCAL_ONLY: 'local-only',
    OFFLINE: 'offline',
    SERVER: 'server',
  }),
  canonEventCommandBackend: () => transport.mode,
  commitCutTradeRouteCommand: (...args) => transport.commitCut(...args),
  commitCreateRouteCommand: (...args) => transport.commitRoute(...args),
  readCanonEventCommandAuthority: (...args) => transport.read(...args),
}));

vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false },
}));

import { canonEventCommand } from '../../src/application/commands/adapters/canonEventApply.js';
import { recoverCanonEventCommand } from '../../src/application/commands/canonEventCommandRecovery.js';
import { clearSessionCommandJournal } from '../../src/application/commands/sessionCommandRuntime.js';
import { deriveSystemState } from '../../src/domain/state/deriveSystemState.js';
import { userRouteEdgeId } from '../../src/domain/roads/userRoutes.js';
import { resetOutbox } from '../../src/store/outbox.js';
import { createNeighbourSlice } from '../../src/store/neighbourSlice.js';
import { createSettlementSlice } from '../../src/store/settlementSlice.js';

const OWNER = '11111111-1111-4111-8111-111111111111';
const SAVE_A = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const SAVE_B = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';
const CAMPAIGN = 'campaign.vale';
const REVISION = '2026-07-31T12:00:00.000Z';
const EDGE = userRouteEdgeId(SAVE_A, SAVE_B, 'land');

function fixture(id, name) {
  return {
    id,
    name,
    tier: 'town',
    population: 2000,
    neighbourNetwork: [],
    config: { monsterThreat: 'safe', tradeRouteAccess: 'road' },
    _config: { monsterThreat: 'safe', tradeRouteAccess: 'road' },
    economicState: {
      prosperity: 'Modest',
      primaryExports: ['grain'],
      primaryImports: [],
      activeChains: [],
    },
    institutions: [{
      id: 'institution.market', name: 'Market', category: 'economy', status: 'active',
    }],
    powerStructure: {
      governingName: 'Council',
      publicLegitimacy: { score: 60, label: 'Approved' },
      factions: [{
        id: 'faction.merchants', name: 'Merchants', faction: 'Merchants',
        power: 30, controlsInstitutionIds: [],
      }],
      conflicts: [],
    },
    npcs: [],
    activeConditions: [],
  };
}

const DIGEST = {
  spatialGeometryVersion: 1,
  settlementIds: [SAVE_A, SAVE_B],
  distanceMatrix: { [SAVE_A]: { [SAVE_B]: 700 }, [SAVE_B]: { [SAVE_A]: 700 } },
};

const stubSlice = (set) => ({
  auth: { user: { id: OWNER }, tier: 'premium', loading: false },
  config: {
    settType: 'town', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road',
  },
  institutionToggles: {},
  categoryToggles: {},
  goodsToggles: {},
  servicesToggles: {},
  customContent: {},
  campaigns: [{
    id: CAMPAIGN,
    settlementIds: [SAVE_A, SAVE_B],
    worldState: { tick: 4, spatialCanonVersion: 1, spatialDigest: DIGEST },
  }],
  campaignsLoaded: true,
  setCampaignRegionalGraph: (campaignId, graph) => set((state) => {
    const campaign = state.campaigns.find(({ id }) => id === campaignId);
    if (campaign) campaign.regionalGraph = graph;
  }),
  isSettlementClockBound: () => false,
  queueSettlementEvent: vi.fn(() => ({ queued: true })),
  isTierAllowed: () => true,
  isElevated: () => false,
  canSave: () => true,
  maxSaves: () => 50,
  setPurchaseModalOpen: () => {},
});

function makeStore() {
  const store = create(immer((...args) => ({
    ...stubSlice(...args),
    ...createSettlementSlice(...args),
    ...createNeighbourSlice(...args),
  })));
  const alpha = fixture('town.ashford', 'Ashford');
  const beta = fixture('town.brookmere', 'Brookmere');
  const systemState = deriveSystemState(alpha);
  const campaignState = {
    phase: 'canon',
    eventLog: [],
    systemState: structuredClone(systemState),
    locks: {},
    generatedAt: '2026-07-01T00:00:00.000Z',
    editedAt: REVISION,
    canonizedAt: '2026-07-01T00:00:00.000Z',
    lastExportAt: null,
  };
  store.setState((state) => {
    state.settlement = structuredClone(alpha);
    state.systemState = structuredClone(systemState);
    state.phase = 'canon';
    state.eventLog = [];
    state.locks = {};
    state.generatedAt = campaignState.generatedAt;
    state.editedAt = REVISION;
    state.canonizedAt = campaignState.canonizedAt;
    state.lastExportAt = null;
    state.activeSaveId = SAVE_A;
    state.savedSettlements = [
      {
        id: SAVE_A, name: 'Ashford', tier: 'town',
        settlement: structuredClone(alpha),
        campaignState: structuredClone(campaignState),
        aiData: {}, timestamp: REVISION,
      },
      {
        id: SAVE_B, name: 'Brookmere', tier: 'town',
        settlement: structuredClone(beta),
        campaignState: structuredClone(campaignState),
        aiData: {}, timestamp: REVISION,
      },
    ];
  });
  return store;
}

function appliedAnswer(request) {
  return {
    status: 'applied',
    reason: null,
    replayed: false,
    fingerprint: 'f'.repeat(64),
    routeId: EDGE,
    revisionKind: 'base-projection-v1',
    settlement: request.settlement,
    campaignState: request.campaignState,
    aiData: null,
    partnerSettlement: request.partnerSettlement,
    updatedAt: '2026-07-31T12:10:00.000Z',
    receipt: { routeId: EDGE, eventType: 'CREATE_ROUTE' },
  };
}

beforeEach(() => {
  resetOutbox();
  clearSessionCommandJournal();
  transport.mode = 'server';
  transport.commitRoute.mockReset();
  transport.commitCut.mockReset();
  transport.read.mockReset();
});

describe('the bilateral route command', () => {
  test('carries BOTH endpoint projections in ONE call and lands on both rows', async () => {
    const store = makeStore();
    transport.commitRoute.mockImplementation(
      (request) => Promise.resolve(appliedAnswer(request)),
    );

    const result = await store.getState().charterUserRoute(SAVE_B);
    expect(result.status).toBe('applied');

    expect(transport.commitRoute).toHaveBeenCalledTimes(1);
    expect(transport.commitCut).not.toHaveBeenCalled(); // anchored: the route call above is asserted to have fired exactly once
    const [request] = transport.commitRoute.mock.calls[0];
    expect(request).toMatchObject({
      ownerId: OWNER,
      saveId: SAVE_A,
      partnerSaveId: SAVE_B,
      expectedRevision: REVISION,
    });
    // Both halves of the edge, prepared before the call, sharing one identity.
    expect(request.settlement.config._userRoutes[0].routeId).toBe(EDGE);
    expect(request.partnerSettlement.config._userRoutes[0].routeId).toBe(EDGE);
    expect(request.settlement.neighbourNetwork[0].id).toBe(SAVE_B);
    expect(request.partnerSettlement.neighbourNetwork[0].id).toBe(SAVE_A);
    // The partner's raw twin is mirrored too, or the route dies on its next regen.
    expect(request.partnerSettlement._config._userRoutes[0].routeId).toBe(EDGE);
    // The partner keeps its own timeline: no event-log entry is prepared for it.
    expect(request.campaignState.eventLog).toHaveLength(1);

    const after = store.getState();
    const cachedA = after.savedSettlements.find(s => s.id === SAVE_A);
    const cachedB = after.savedSettlements.find(s => s.id === SAVE_B);
    expect(cachedA.settlement.neighbourNetwork[0].linkId).toBe(EDGE);
    expect(cachedB.settlement.neighbourNetwork[0].linkId).toBe(EDGE);
    expect(after.settlement.neighbourNetwork[0].linkId).toBe(EDGE);
  });

  test('a missing partner refuses locally without entering the journal', async () => {
    const store = makeStore();
    const result = await store.getState().charterUserRoute('save-that-does-not-exist');
    expect(result).toMatchObject({ ok: false, reason: 'endpoint_missing' });
    expect(transport.commitRoute).not.toHaveBeenCalled(); // anchored: the happy path above proves this mock does fire when a route is legal
  });

  test('a second charter over the same pair is refused as already chartered', async () => {
    const store = makeStore();
    transport.commitRoute.mockImplementation(
      (request) => Promise.resolve(appliedAnswer(request)),
    );
    await store.getState().charterUserRoute(SAVE_B);
    const second = await store.getState().charterUserRoute(SAVE_B);
    expect(second).toMatchObject({ ok: false, reason: 'route_already_chartered' });
    expect(transport.commitRoute).toHaveBeenCalledTimes(1);
  });

  test('a stale partner answer leaves both cached rows untouched', async () => {
    const store = makeStore();
    transport.commitRoute.mockResolvedValue({
      status: 'stale',
      reason: 'partner_base_projection_changed',
      replayed: false,
      fingerprint: 'f'.repeat(64),
      revisionKind: 'base-projection-v1',
      receipt: { reason: 'partner_base_projection_changed' },
    });
    const result = await store.getState().charterUserRoute(SAVE_B);
    // The adapter translates the store ActionResult into a command receipt, so
    // the stale outcome surfaces as the receipt's own status vocabulary.
    expect(result).toMatchObject({
      ok: false,
      status: 'stale',
      reason: 'partner_base_projection_changed',
    });
    const after = store.getState();
    for (const save of after.savedSettlements) {
      expect(save.settlement.neighbourNetwork).toEqual([]);
      expect(save.settlement.config._userRoutes).toBeUndefined();
    }
    expect(after.settlement.neighbourNetwork).toEqual([]);
  });
});

describe('recovery is inherited, not reimplemented', () => {
  test('an applied journal row replays the identical CREATE_ROUTE command', async () => {
    const store = makeStore();
    const event = {
      id: 'event.create-route.recovery',
      type: 'CREATE_ROUTE',
      targetId: 'Brookmere',
      payload: {
        routeId: EDGE, mode: 'land', band: 'steady', a: SAVE_A, b: SAVE_B,
        createdTick: 4,
        selfSaveId: SAVE_A, selfName: 'Ashford', selfTier: 'town',
        partnerSaveId: SAVE_B, partnerName: 'Brookmere', partnerTier: 'town',
      },
    };
    const command = canonEventCommand(
      { saveId: SAVE_A, proposalIndex: 0, event },
      { ownerId: OWNER, revision: REVISION, now: REVISION, provenance: 'manual' },
    );
    // The durable journal says this identity already committed.
    transport.read.mockResolvedValue({
      ownerId: OWNER,
      commandId: command.commandId,
      kind: 'settlement.canon-event.apply',
      targetId: SAVE_A,
      phase: 'finalized',
      status: 'applied',
      receipt: { routeId: EDGE, eventType: 'CREATE_ROUTE' },
      failureCode: null,
      claimedAt: REVISION,
      finalizedAt: REVISION,
      updatedAt: REVISION,
    });
    transport.commitRoute.mockImplementation(
      (request) => Promise.resolve({ ...appliedAnswer(request), replayed: true }),
    );

    const outcome = await recoverCanonEventCommand(command, {
      context: {
        ownerId: OWNER,
        saveId: SAVE_A,
        revision: REVISION,
        journalScope: store.getState,
        actions: { applyEvent: store.getState().applyEvent },
      },
    });

    expect(outcome).toMatchObject({
      status: 'applied',
      authorityState: 'applied',
      replayAttempted: true,
    });
    // The replay went through the BILATERAL transport, proving the recovery
    // coordinator inherited the new type without learning anything about it.
    expect(transport.commitRoute).toHaveBeenCalledTimes(1);
    expect(transport.commitRoute.mock.calls[0][0].partnerSaveId).toBe(SAVE_B);
  });
});
