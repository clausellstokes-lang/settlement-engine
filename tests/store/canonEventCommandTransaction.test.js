/**
 * End-to-end store contract for the first durable canon-event vertical.
 *
 * A real Zustand+Immer settlement slice is driven through the real command
 * executor and adapter. Only the remote transport and legacy save service are
 * mocked, so these tests cover the lazy store boundary, pure preparation,
 * authoritative projection, session replay, and the absence of a hidden
 * legacy outbox tail.
 */

import { beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

const transport = vi.hoisted(() => ({
  mode: 'server',
  commit: vi.fn(),
  read: vi.fn(),
}));

vi.mock('../../src/lib/canonEventCommandPersistence.js', () => ({
  CANON_COMMAND_BACKEND: Object.freeze({
    LOCAL_ONLY: 'local-only',
    OFFLINE: 'offline',
    SERVER: 'server',
  }),
  canonEventCommandBackend: () => transport.mode,
  commitCutTradeRouteCommand: (...args) => transport.commit(...args),
  readCanonEventCommandAuthority: (...args) => transport.read(...args),
}));

vi.mock('../../src/lib/saves.js', () => ({
  saves: {
    update: vi.fn(() => Promise.resolve()),
    isConfigured: false,
  },
}));

import { canonEventCommand } from '../../src/application/commands/adapters/canonEventApply.js';
import { commandJournalKey } from '../../src/application/commands/commandEnvelope.js';
import { recoverCanonEventCommand } from '../../src/application/commands/canonEventCommandRecovery.js';
import { createCommandExecutor } from '../../src/application/commands/executeCommand.js';
import { clearSessionCommandJournal } from '../../src/application/commands/sessionCommandRuntime.js';
import { standardCommandRegistry } from '../../src/application/commands/standardCommandRegistry.js';
import { deriveSystemState } from '../../src/domain/state/deriveSystemState.js';
import { saves } from '../../src/lib/saves.js';
import { runInterpretApply } from '../../src/lib/intent/interpretApply.js';
import {
  activateOutboxOwner,
  enqueue,
  resetOutbox,
} from '../../src/store/outbox.js';
import { createSettlementSlice } from '../../src/store/settlementSlice.js';

const OWNER = '11111111-1111-4111-8111-111111111111';
const OTHER_OWNER = '22222222-2222-4222-8222-222222222222';
const SAVE = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const REVISION = '2026-07-24T12:00:00.000Z';
const APPLIED_AT = '2026-07-24T12:05:00.000Z';

function fixture() {
  return {
    id: 'town.ashford',
    name: 'Ashford',
    tier: 'town',
    population: 2000,
    config: { monsterThreat: 'safe', tradeRouteAccess: 'road' },
    _config: { monsterThreat: 'safe', tradeRouteAccess: 'road' },
    economicState: {
      prosperity: 'Modest',
      primaryExports: ['grain'],
      primaryImports: [],
      activeChains: [],
    },
    institutions: [{
      id: 'institution.market',
      name: 'Market',
      category: 'economy',
      status: 'active',
    }],
    powerStructure: {
      governingName: 'Council',
      publicLegitimacy: { score: 60, label: 'Approved' },
      factions: [{
        id: 'faction.merchants',
        name: 'Merchants',
        faction: 'Merchants',
        power: 30,
        controlsInstitutionIds: [],
      }],
      conflicts: [],
    },
    npcs: [],
    activeConditions: [],
  };
}

function routeEvent() {
  return {
    id: 'event.cut-route.1',
    type: 'CUT_TRADE_ROUTE',
    targetId: 'Old North Road',
    payload: {},
    cause: 'player_action',
  };
}

const stubSlice = (set) => ({
  auth: { user: { id: OWNER }, tier: 'premium', loading: false },
  config: {
    settType: 'town',
    culture: 'germanic',
    terrain: 'grassland',
    tradeRouteAccess: 'road',
  },
  institutionToggles: {},
  categoryToggles: {},
  goodsToggles: {},
  servicesToggles: {},
  customContent: {},
  importedNeighbour: null,
  campaigns: [],
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
  })));
  const baseSettlement = fixture();
  const baseSystemState = deriveSystemState(baseSettlement);
  const campaignState = {
    phase: 'canon',
    eventLog: [],
    systemState: structuredClone(baseSystemState),
    locks: {},
    generatedAt: '2026-07-01T00:00:00.000Z',
    editedAt: REVISION,
    canonizedAt: '2026-07-01T00:00:00.000Z',
    lastExportAt: null,
  };
  store.setState((state) => {
    state.settlement = structuredClone(baseSettlement);
    state.systemState = structuredClone(baseSystemState);
    state.phase = 'canon';
    state.eventLog = [];
    state.locks = {};
    state.generatedAt = campaignState.generatedAt;
    state.editedAt = REVISION;
    state.canonizedAt = campaignState.canonizedAt;
    state.lastExportAt = null;
    state.activeSaveId = SAVE;
    state.savedSettlements = [{
      id: SAVE,
      name: 'Ashford',
      tier: 'town',
      settlement: structuredClone(baseSettlement),
      campaignState: structuredClone(campaignState),
      aiData: {},
      timestamp: REVISION,
    }];
  });
  return store;
}

function command(revision = REVISION) {
  return canonEventCommand({
    proposalIndex: 0,
    saveId: SAVE,
    event: routeEvent(),
  }, {
    reviewRef: 'review-1',
    ownerId: OWNER,
    revision,
    now: APPLIED_AT,
  });
}

function context(store, revision = REVISION) {
  return {
    ownerId: OWNER,
    saveId: SAVE,
    revision,
    journalScope: store,
    actions: {
      applyEvent: (...args) => store.getState().applyEvent(...args),
    },
  };
}

function serverResult(request, overrides = {}) {
  return {
    status: 'applied',
    reason: null,
    replayed: false,
    fingerprint: 'a'.repeat(64),
    revisionKind: 'base-projection-v1',
    settlement: request.settlement,
    campaignState: request.campaignState,
    aiData: request.aiData ?? request.expectedAiData ?? {},
    updatedAt: '2026-07-24T12:05:01.000Z',
    receipt: { eventType: 'CUT_TRADE_ROUTE' },
    ...overrides,
  };
}

beforeEach(() => {
  resetOutbox();
  clearSessionCommandJournal();
  transport.mode = 'server';
  transport.commit.mockReset();
  transport.commit.mockImplementation(async (request) => serverResult(request));
  transport.read.mockReset();
  saves.update.mockClear();
});

describe('authoritative CUT_TRADE_ROUTE transaction', () => {
  test('commits once, projects the server row, and never calls the legacy save writer', async () => {
    const store = makeStore();
    const executor = createCommandExecutor({ registry: standardCommandRegistry });

    const first = await executor.execute(command(), context(store));
    const replay = await executor.execute(command(), context(store));

    expect(first).toMatchObject({
      status: 'applied',
      persistence: { state: 'confirmed' },
      replayed: false,
    });
    expect(replay).toMatchObject({ status: 'applied', replayed: true });
    expect(transport.commit).toHaveBeenCalledTimes(1);
    expect(saves.update).not.toHaveBeenCalled();
    expect(transport.commit.mock.calls[0][0]).toMatchObject({
      ownerId: OWNER,
      saveId: SAVE,
      expectedRevision: REVISION,
      expectedSettlement: fixture(),
      expectedCampaignState: {
        phase: 'canon',
        eventLog: [],
      },
    });

    const state = store.getState();
    expect(state.settlement.config._cutRoutes).toEqual([
      expect.objectContaining({
        name: 'Old North Road',
        atEventId: 'event.cut-route.1',
      }),
    ]);
    expect(state.settlement.activeConditions).toEqual(expect.arrayContaining([
      expect.objectContaining({ archetype: 'trade_route_cut' }),
    ]));
    expect(state.eventLog).toHaveLength(1);
    expect(state.eventLog[0].event.id).toBe('event.cut-route.1');
    expect(state.savedSettlements[0].timestamp)
      .toBe('2026-07-24T12:05:01.000Z');
    expect(state.canonEventCommandFence).toBeNull();
  });

  test('two accepted route proposals chain server revisions and replay as the same commands', async () => {
    let commitNumber = 0;
    transport.commit.mockImplementation(async (request) => {
      commitNumber += 1;
      return serverResult(request, {
        updatedAt: `2026-07-24T12:05:0${commitNumber}.000Z`,
      });
    });
    const store = makeStore();
    const currentContext = () => ({
      ownerId: OWNER,
      saveId: SAVE,
      saveRevision: store.getState().savedSettlements[0].timestamp,
    });
    const request = {
      accepted: [
        {
          index: 2,
          op: {
            family: 'canon_event',
            opType: 'CUT_TRADE_ROUTE',
            params: {
              id: 'event.cut-route.1',
              targetId: 'Old North Road',
              payload: {},
              cause: 'player_action',
            },
          },
        },
        {
          index: 7,
          op: {
            family: 'canon_event',
            opType: 'CUT_TRADE_ROUTE',
            params: {
              id: 'event.cut-route.2',
              targetId: 'South Causeway',
              payload: {},
              cause: 'player_action',
            },
          },
        },
      ],
      targetContext: {
        ownerId: OWNER,
        saveId: SAVE,
        saveRevision: REVISION,
      },
      currentContext: currentContext(),
      readCurrentContext: currentContext,
      reviewRef: 'review-two-routes',
      now: APPLIED_AT,
      actions: {
        applyEvent: (...args) => store.getState().applyEvent(...args),
      },
    };

    const first = await runInterpretApply(request);
    expect(first.commandResults.map(({ status }) => status))
      .toEqual(['applied', 'applied']);
    expect(transport.commit.mock.calls.map(([input]) => input.expectedRevision))
      .toEqual([
        REVISION,
        '2026-07-24T12:05:01.000Z',
      ]);
    expect(store.getState().settlement.config._cutRoutes.map(({ name }) => name))
      .toEqual(['Old North Road', 'South Causeway']);
    expect(saves.update).not.toHaveBeenCalled();

    const replay = await runInterpretApply(request);
    expect(replay.commandResults.map(({ commandId }) => commandId))
      .toEqual(first.commandResults.map(({ commandId }) => commandId));
    expect(replay.commandResults.map(({ replayed }) => replayed))
      .toEqual([true, true]);
    expect(transport.commit).toHaveBeenCalledTimes(2);
    expect(store.getState().settlement.config._cutRoutes).toHaveLength(2);
  });

  test('a stale server CAS leaves live and cached state untouched', async () => {
    transport.commit.mockResolvedValue({
      status: 'stale',
      reason: 'base_projection_changed',
      replayed: false,
      fingerprint: 'b'.repeat(64),
      revisionKind: 'base-projection-v1',
    });
    const store = makeStore();
    const before = structuredClone({
      settlement: store.getState().settlement,
      savedSettlements: store.getState().savedSettlements,
      eventLog: store.getState().eventLog,
    });

    const receipt = await createCommandExecutor({
      registry: standardCommandRegistry,
    }).execute(command(), context(store));

    expect(receipt).toMatchObject({
      status: 'stale',
      reason: 'base_projection_changed',
    });
    expect({
      settlement: store.getState().settlement,
      savedSettlements: store.getState().savedSettlements,
      eventLog: store.getState().eventLog,
    }).toEqual(before);
    expect(store.getState().canonEventCommandFence).toBeNull();
    expect(saves.update).not.toHaveBeenCalled();
  });

  test('a lost RPC answer becomes reconcile-required without speculative mutation', async () => {
    transport.commit.mockRejectedValue(new Error('network answer lost'));
    const store = makeStore();
    const before = structuredClone(store.getState().settlement);
    const receipt = await createCommandExecutor({
      registry: standardCommandRegistry,
    }).execute(command(), context(store));

    expect(receipt).toMatchObject({
      status: 'reconcile-required',
      reason: 'network answer lost',
      needsReconciliation: true,
      persistence: { state: 'unconfirmed' },
    });
    expect(store.getState().settlement).toEqual(before);
    expect(store.getState().canonEventCommandFence).toBeNull();
    expect(saves.update).not.toHaveBeenCalled();
  });

  test('an explicit journal replay recovers a committed lost response and projects its receipt', async () => {
    transport.commit.mockRejectedValueOnce(new Error('network answer lost'));
    const store = makeStore();
    const executor = createCommandExecutor({
      registry: standardCommandRegistry,
    });
    const originalCommand = command();
    const first = await executor.execute(originalCommand, context(store));
    expect(first.status).toBe('reconcile-required');

    transport.read.mockResolvedValue({
      ownerId: OWNER,
      commandId: originalCommand.commandId,
      kind: originalCommand.kind,
      targetId: SAVE,
      phase: 'finalized',
      status: 'applied',
      receipt: {
        eventType: 'CUT_TRADE_ROUTE',
        updatedAt: '2026-07-24T12:05:01.000Z',
      },
      failureCode: null,
      finalizedAt: '2026-07-24T12:05:01.000Z',
      updatedAt: '2026-07-24T12:05:01.000Z',
    });
    transport.commit.mockImplementationOnce(async request => serverResult(
      request,
      { replayed: true },
    ));

    const recovery = await recoverCanonEventCommand(originalCommand, {
      context: context(store),
      readCurrentContext: () => context(store),
      executeCommand: executor.execute,
      forgetReceipt: (candidate, scope) => {
        executor.journal.release(commandJournalKey(candidate), scope);
      },
    });

    expect(recovery).toMatchObject({
      status: 'applied',
      recovered: true,
      authorityState: 'applied',
      replayAttempted: true,
      retryAttempted: false,
      authorityReceipt: { eventType: 'CUT_TRADE_ROUTE' },
      receipt: {
        persistence: { state: 'confirmed' },
        result: {
          commandPersistence: {
            replayed: true,
            authorityReceipt: { eventType: 'CUT_TRADE_ROUTE' },
          },
        },
      },
    });
    expect(transport.read).toHaveBeenCalledWith({
      ownerId: OWNER,
      commandId: originalCommand.commandId,
    });
    expect(transport.commit).toHaveBeenCalledTimes(2);
    const [lostRequest] = transport.commit.mock.calls[0];
    const [replayRequest] = transport.commit.mock.calls[1];
    expect(replayRequest).toEqual(lostRequest);
    expect(replayRequest.campaignState.eventLog[0].appliedAt)
      .toBe(APPLIED_AT);
    expect(store.getState().eventLog).toHaveLength(1);
    expect(store.getState().settlement.config._cutRoutes).toHaveLength(1);
    expect(store.getState().canonEventCommandFence).toBeNull();
    expect(saves.update).not.toHaveBeenCalled();
  });

  test('a journal-confirmed absent command permits one exact idempotent retry', async () => {
    transport.commit.mockRejectedValueOnce(new Error('connection closed'));
    const store = makeStore();
    const executor = createCommandExecutor({
      registry: standardCommandRegistry,
    });
    const originalCommand = command();
    await executor.execute(originalCommand, context(store));

    transport.read.mockResolvedValue(null);
    transport.commit.mockImplementationOnce(async request => serverResult(request));
    const recovery = await recoverCanonEventCommand(originalCommand, {
      context: context(store),
      readCurrentContext: () => context(store),
      executeCommand: executor.execute,
      forgetReceipt: (candidate, scope) => {
        executor.journal.release(commandJournalKey(candidate), scope);
      },
    });

    expect(recovery).toMatchObject({
      status: 'applied',
      recovered: true,
      authorityState: 'proved-absent',
      replayAttempted: false,
      retryAttempted: true,
    });
    expect(transport.commit).toHaveBeenCalledTimes(2);
    expect(store.getState().eventLog).toHaveLength(1);
  });

  test('an unresolved durable row stays visible and is never retried', async () => {
    transport.commit.mockRejectedValueOnce(new Error('network answer lost'));
    const store = makeStore();
    const executor = createCommandExecutor({
      registry: standardCommandRegistry,
    });
    const originalCommand = command();
    await executor.execute(originalCommand, context(store));
    transport.read.mockResolvedValue({
      ownerId: OWNER,
      commandId: originalCommand.commandId,
      kind: originalCommand.kind,
      targetId: SAVE,
      phase: 'reconcile',
      status: 'reconcile-required',
      receipt: null,
      failureCode: 'abandoned_claim',
      finalizedAt: null,
      updatedAt: '2026-07-24T12:06:00.000Z',
    });

    const recovery = await recoverCanonEventCommand(originalCommand, {
      context: context(store),
      readCurrentContext: () => context(store),
      executeCommand: executor.execute,
      forgetReceipt: (candidate, scope) => {
        executor.journal.release(commandJournalKey(candidate), scope);
      },
    });

    expect(recovery).toMatchObject({
      status: 'reconcile-required',
      recovered: false,
      reason: 'abandoned_claim',
      authorityState: 'unresolved',
      replayAttempted: false,
      retryAttempted: false,
    });
    expect(transport.commit).toHaveBeenCalledTimes(1);
    expect(store.getState().eventLog).toHaveLength(0);
    expect(store.getState().settlement.config._cutRoutes).toBeUndefined();
  });

  test('a terminal failed journal receipt closes recovery without reapplying', async () => {
    transport.commit.mockRejectedValueOnce(new Error('network answer lost'));
    const store = makeStore();
    const executor = createCommandExecutor({
      registry: standardCommandRegistry,
    });
    const originalCommand = command();
    await executor.execute(originalCommand, context(store));
    transport.read.mockResolvedValue({
      ownerId: OWNER,
      commandId: originalCommand.commandId,
      kind: originalCommand.kind,
      targetId: SAVE,
      phase: 'finalized',
      status: 'failed',
      receipt: {
        eventType: 'CUT_TRADE_ROUTE',
        reason: 'prepared_projection_rejected',
      },
      failureCode: 'prepared_projection_rejected',
      finalizedAt: '2026-07-24T12:06:00.000Z',
      updatedAt: '2026-07-24T12:06:00.000Z',
    });

    const recovery = await recoverCanonEventCommand(originalCommand, {
      context: context(store),
      readCurrentContext: () => context(store),
      executeCommand: executor.execute,
      forgetReceipt: (candidate, scope) => {
        executor.journal.release(commandJournalKey(candidate), scope);
      },
    });

    expect(recovery).toMatchObject({
      status: 'failed',
      recovered: false,
      reason: 'prepared_projection_rejected',
      authorityState: 'terminal-no-commit',
      authorityReceipt: {
        eventType: 'CUT_TRADE_ROUTE',
      },
      replayAttempted: false,
      retryAttempted: false,
    });
    expect(transport.commit).toHaveBeenCalledTimes(1);
    expect(store.getState().eventLog).toHaveLength(0);
  });

  test('owner rotation during the durable read discards the result without projection', async () => {
    transport.commit.mockRejectedValueOnce(new Error('network answer lost'));
    const store = makeStore();
    const executor = createCommandExecutor({
      registry: standardCommandRegistry,
    });
    const originalCommand = command();
    await executor.execute(originalCommand, context(store));
    let finishRead;
    transport.read.mockImplementation(() => new Promise((resolve) => {
      finishRead = resolve;
    }));

    const recovering = recoverCanonEventCommand(originalCommand, {
      context: context(store),
      readCurrentContext: () => ({
        ...context(store),
        ownerId: store.getState().auth?.user?.id || null,
      }),
      executeCommand: executor.execute,
      forgetReceipt: (candidate, scope) => {
        executor.journal.release(commandJournalKey(candidate), scope);
      },
    });
    await vi.waitFor(() => expect(transport.read).toHaveBeenCalledTimes(1));
    store.setState((state) => {
      state.auth = { ...state.auth, user: { id: OTHER_OWNER } };
    });
    finishRead({
      ownerId: OWNER,
      commandId: originalCommand.commandId,
      kind: originalCommand.kind,
      targetId: SAVE,
      phase: 'finalized',
      status: 'applied',
      receipt: { eventType: 'CUT_TRADE_ROUTE' },
      failureCode: null,
      finalizedAt: '2026-07-24T12:05:01.000Z',
      updatedAt: '2026-07-24T12:05:01.000Z',
    });

    await expect(recovering).resolves.toMatchObject({
      status: 'stale',
      reason: 'owner_changed',
      authorityState: 'discarded-after-context-change',
      recovered: false,
    });
    expect(transport.commit).toHaveBeenCalledTimes(1);
    expect(store.getState().eventLog).toHaveLength(0);
  });

  test('recovery rejects a command whose original attempt timestamp was not retained', async () => {
    const unsafeCommand = canonEventCommand({
      proposalIndex: 0,
      saveId: SAVE,
      event: routeEvent(),
    }, {
      reviewRef: 'review-without-attempt-clock',
      ownerId: OWNER,
      revision: REVISION,
      now: null,
    });

    await expect(recoverCanonEventCommand(unsafeCommand, {
      context: {
        ownerId: OWNER,
        saveId: SAVE,
        revision: REVISION,
        actions: {},
      },
      readAuthority: transport.read,
    })).resolves.toMatchObject({
      status: 'failed',
      reason: 'invalid_canon_recovery_command',
      authorityState: 'not-read',
    });
    expect(transport.read).not.toHaveBeenCalled();
  });

  test('configured offline mode refuses explicitly and remains retryable', async () => {
    transport.mode = 'offline';
    const store = makeStore();
    const receipt = await createCommandExecutor({
      registry: standardCommandRegistry,
    }).execute(command(), context(store));

    expect(receipt).toMatchObject({
      status: 'failed',
      reason: 'offline_authoritative_commit_required',
    });
    expect(transport.commit).not.toHaveBeenCalled();
    expect(store.getState().settlement.config._cutRoutes).toBeUndefined();
    expect(store.getState().canonEventCommandFence).toBeNull();
  });

  test('local-only mode intentionally preserves the complete legacy writer', async () => {
    transport.mode = 'local-only';
    const store = makeStore();
    const receipt = await createCommandExecutor({
      registry: standardCommandRegistry,
    }).execute(command(), context(store));

    expect(receipt).toMatchObject({
      status: 'applied',
      persistence: { state: 'confirmed' },
      result: {
        commandPersistence: {
          mode: 'local-only',
          state: 'confirmed',
        },
      },
    });
    expect(transport.commit).not.toHaveBeenCalled();
    expect(store.getState().settlement.config._cutRoutes).toHaveLength(1);
    expect(saves.update).toHaveBeenCalledTimes(1);
    expect(store.getState().canonEventCommandFence).toBeNull();
  });

  test('an older legacy outbox write blocks entry into the durable journal', async () => {
    activateOutboxOwner(OWNER);
    enqueue({
      saveId: SAVE,
      kind: 'campaign_state+data',
      payload: { settlement: fixture() },
      fingerprint: null,
    });
    const store = makeStore();
    const receipt = await createCommandExecutor({
      registry: standardCommandRegistry,
    }).execute(command(), context(store));

    expect(receipt).toMatchObject({
      status: 'failed',
      reason: 'legacy_persistence_pending',
    });
    expect(transport.commit).not.toHaveBeenCalled();
    expect(store.getState().settlement.config._cutRoutes).toBeUndefined();
    expect(store.getState().canonEventCommandFence).toBeNull();
  });

  test('an unsynchronized live projection cannot be bundled into the command write', async () => {
    const store = makeStore();
    store.setState((state) => {
      state.settlement.mapEdits = {
        pins: [{ anchor: 'market', dx: 4, dy: 2 }],
      };
    });
    const receipt = await createCommandExecutor({
      registry: standardCommandRegistry,
    }).execute(command(), context(store));

    expect(receipt).toMatchObject({
      status: 'failed',
      reason: 'local_projection_uncommitted',
    });
    expect(transport.commit).not.toHaveBeenCalled();
    expect(store.getState().settlement.mapEdits).toBeDefined();
    expect(store.getState().settlement.config._cutRoutes).toBeUndefined();
  });

  test('the synchronous fence refuses a second canon mutation while the RPC is in flight', async () => {
    let release;
    transport.commit.mockImplementation((request) => new Promise((resolve) => {
      release = () => resolve(serverResult(request));
    }));
    const store = makeStore();
    const executor = createCommandExecutor({ registry: standardCommandRegistry });
    const committing = executor.execute(command(), context(store));
    await vi.waitFor(() => expect(transport.commit).toHaveBeenCalledTimes(1));

    const refused = store.getState().applyEvent({
      id: 'event.concurrent',
      type: 'DAMAGE_INSTITUTION',
      targetId: 'institution.market',
      payload: { severity: 1 },
      cause: 'player_action',
    });
    expect(refused).toMatchObject({
      ok: false,
      reason: 'canon_command_in_flight',
    });
    expect(store.getState().eventLog).toHaveLength(0);

    release();
    await expect(committing).resolves.toMatchObject({ status: 'applied' });
    expect(store.getState().eventLog).toHaveLength(1);
  });

  test('a local projection change after server commit is surfaced for reconciliation', async () => {
    let release;
    transport.commit.mockImplementation((request) => new Promise((resolve) => {
      release = () => resolve(serverResult(request));
    }));
    const store = makeStore();
    const committing = createCommandExecutor({
      registry: standardCommandRegistry,
    }).execute(command(), context(store));
    await vi.waitFor(() => expect(transport.commit).toHaveBeenCalledTimes(1));

    store.setState((state) => {
      state.settlement = {
        ...state.settlement,
        mapEdits: { pins: [{ anchor: 'market', dx: 4, dy: 2 }] },
      };
      state.savedSettlements[0].timestamp = '2026-07-24T12:05:00.500Z';
    });
    release();
    const receipt = await committing;

    expect(receipt).toMatchObject({
      status: 'reconcile-required',
      reason: 'local_projection_changed_after_commit',
      persistence: { state: 'confirmed' },
      needsReconciliation: true,
    });
    expect(store.getState().settlement.mapEdits).toBeDefined();
    expect(store.getState().settlement.config._cutRoutes).toBeUndefined();
    expect(store.getState().canonEventCommandFence).toBeNull();
    expect(saves.update).not.toHaveBeenCalled();
  });
});
