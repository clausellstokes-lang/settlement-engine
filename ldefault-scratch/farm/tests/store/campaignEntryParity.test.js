import { beforeAll, describe, expect, test, vi } from 'vitest';
import {
  createCampaignSlice as createCampaignBody,
  createCampaignSliceWithHydration,
} from '../../src/store/campaignSlice.js';
import {
  CAMPAIGN_CORE_ACTIONS,
  createCampaignSlice as createCampaignEntry,
} from '../../src/store/campaignSliceEntry.js';
import {
  CAMPAIGN_REGIONAL_ACTIONS,
  createCampaignRegionalSlice as createRegionalEntry,
} from '../../src/store/campaignRegionalSliceEntry.js';
import {
  createCampaignRegionalSlice as createRegionalBody,
} from '../../src/store/campaignRegionalSlice.js';
import {
  CAMPAIGN_PULSE_ACTIONS,
  createCampaignWorldPulseSlice as createPulseEntry,
} from '../../src/store/campaignWorldPulseSliceEntry.js';
import {
  createCampaignWorldPulseSlice as createPulseBody,
} from '../../src/store/campaignWorldPulseSlice.js';
import { campaignLoadDelegate } from '../../src/store/campaignEntryDelegates.js';
import {
  CAMPAIGN_REPORTING_LEASE,
  initCampaignEntryReporting,
} from '../../src/store/campaignEntryReporting.js';
import { loadCampaignRuntimeView } from '../../src/store/campaignRuntimeView.js';
import { runCampaignLoad } from '../../src/store/campaignLoadSession.js';
import {
  CampaignRuntimeNotReadyError,
  preloadCampaignRuntime,
} from '../../src/store/campaignRuntimeBridge.js';
import {
  CAMPAIGN_SESSION_READER,
  cacheCampaignState,
} from '../../src/store/campaignSliceShared.js';

function fakeStore(seed = {}) {
  const state = { ...seed };
  const get = () => state;
  const set = update => {
    if (typeof update === 'function') {
      const result = update(state);
      if (result && result !== state) Object.assign(state, result);
    } else {
      Object.assign(state, update);
    }
  };
  return { get, set, state };
}

const functionKeys = value => Object.entries(value)
  .filter(([, member]) => typeof member === 'function')
  .map(([name]) => name)
  .sort();

beforeAll(() => {
  vi.stubGlobal('localStorage', {
    getItem: () => null,
    removeItem: () => {},
    setItem: () => {},
  });
});

describe('thin campaign entry parity', () => {
  test('each entry exposes exactly the function contract of its implementation body', () => {
    const store = fakeStore({ auth: { user: null }, campaigns: [] });
    const bodyCore = createCampaignBody(store.set, store.get);
    const bodyRegional = createRegionalBody(store.set, store.get);
    const bodyPulse = createPulseBody(store.set, store.get);

    expect([
      ...CAMPAIGN_CORE_ACTIONS,
      'clearCampaignSyncError',
      'loadCampaigns',
      'clearCampaigns',
      'invalidateCampaignSession',
    ].sort()).toEqual(functionKeys(bodyCore));
    expect([...CAMPAIGN_REGIONAL_ACTIONS].sort()).toEqual(functionKeys(bodyRegional));
    expect([
      ...CAMPAIGN_PULSE_ACTIONS,
      'isAdvanceInFlight',
      'getPausedAdvance',
      'setAdvanceAutoResolve',
      'dismissLivingCatchUp',
    ].sort()).toEqual(functionKeys(bodyPulse));
  });

  test('entry defaults exactly match the implementation bodies', () => {
    const store = fakeStore({ auth: { user: null }, campaigns: [] });
    const data = value => Object.fromEntries(
      Object.entries(value).filter(([, member]) => typeof member !== 'function'),
    );

    expect(data(createCampaignEntry(store.set, store.get)))
      .toEqual(data(createCampaignBody(store.set, store.get)));
    expect(data(createRegionalEntry(store.set, store.get)))
      .toEqual(data(createRegionalBody(store.set, store.get)));
    expect(data(createPulseEntry(store.set, store.get)))
      .toEqual(data(createPulseBody(store.set, store.get)));
  });

  test('sync delegates keep identity and return synchronously after preload', async () => {
    const store = fakeStore({ auth: { user: null }, campaigns: [] });
    Object.assign(
      store.state,
      createCampaignEntry(store.set, store.get),
      createRegionalEntry(store.set, store.get),
      createPulseEntry(store.set, store.get),
    );
    const delegate = store.state.getCampaignForSettlement;

    expect(() => delegate('missing')).toThrow(CampaignRuntimeNotReadyError);
    await preloadCampaignRuntime(store.set, store.get);

    expect(store.state.getCampaignForSettlement).toBe(delegate);
    const result = delegate('missing');
    expect(result).toBeNull();
    expect(result).not.toBeInstanceOf(Promise);
  });

  test('the cold load delegate fences an owner rotation before invoking the body', async () => {
    let resolveRuntime;
    const bodyLoad = vi.fn();
    const preload = vi.fn(() => new Promise(resolve => { resolveRuntime = resolve; }));
    const store = fakeStore({
      auth: { user: { id: 'owner-a' } },
      campaignSessionGeneration: 4,
      campaigns: [{ id: 'a' }],
    });
    const loadCampaigns = campaignLoadDelegate(store.set, store.get, preload);
    const pending = loadCampaigns();

    store.state.auth = { user: { id: 'owner-b' } };
    store.state.campaignSessionGeneration = 5;
    store.state.campaigns = [{ id: 'b' }];
    resolveRuntime({ loadCampaigns: bodyLoad });

    await expect(pending).resolves.toEqual([{ id: 'b' }]);
    expect(bodyLoad).not.toHaveBeenCalled();
  });

  test('a cold runtime rejection resolves safely and the next load retries', async () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const bodyLoad = vi.fn(async () => [{ id: 'hydrated' }]);
    const preload = vi.fn()
      .mockRejectedValueOnce(new Error('chunk transport failed'))
      .mockResolvedValueOnce({ loadCampaigns: bodyLoad });
    const store = fakeStore({
      auth: { user: { id: 'owner-a' } },
      campaignSessionGeneration: 2,
      campaigns: [{ id: 'cached' }],
      campaignsLoaded: false,
    });
    const loadCampaigns = campaignLoadDelegate(store.set, store.get, preload);

    await expect(loadCampaigns()).resolves.toEqual([{ id: 'cached' }]);
    await expect(loadCampaigns()).resolves.toEqual([{ id: 'hydrated' }]);

    expect(preload).toHaveBeenCalledTimes(2);
    expect(bodyLoad).toHaveBeenCalledTimes(1);
    expect(warning).toHaveBeenCalledTimes(1);
    warning.mockRestore();
  });

  test('strict admission failure stays visible and retries through the real delegate/view path', async () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const hydration = await import('../../src/store/campaignHydration.js');
    const loadHydration = vi.fn()
      .mockRejectedValueOnce(new Error('hydration chunk unavailable'))
      .mockResolvedValueOnce(hydration);
    const store = fakeStore({
      auth: { tier: 'free', user: { id: 'owner-a' } },
      campaignSessionGeneration: 8,
      campaigns: [],
      campaignsLoaded: false,
      campaignLoadError: null,
      customContent: {},
      customContentSyncedAt: null,
    });
    const body = createCampaignSliceWithHydration(store.set, store.get, loadHydration);
    const loadCampaigns = campaignLoadDelegate(
      store.set,
      store.get,
      async () => body,
    );
    store.state.loadCampaigns = loadCampaigns;

    await expect(loadCampaigns()).resolves.toEqual([]);
    expect(store.state.campaignsLoaded).toBe(false);
    expect(store.state.campaignLoadError).toMatchObject({
      code: 'campaign_admission_unavailable',
    });

    const importer = vi.fn(async () => ({ default: 'CampaignView' }));
    await expect(loadCampaignRuntimeView(
      { getState: store.get },
      importer,
      async () => {},
    )).resolves.toEqual({ default: 'CampaignView' });
    expect(loadHydration).toHaveBeenCalledTimes(2);
    expect(store.state.campaignsLoaded).toBe(true);
    expect(store.state.campaignLoadError).toBeNull();
    expect(importer).toHaveBeenCalledTimes(1);
    warning.mockRestore();
  });

  test('strict admission failure wins when the remote list fails at the same time', async () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const store = fakeStore({
      auth: { tier: 'free', user: { id: 'owner-a' } },
      campaignSessionGeneration: 8,
      campaigns: [],
      campaignsLoaded: false,
      campaignLoadError: null,
      customContent: {},
      customContentSyncedAt: null,
    });
    const service = {
      isConfigured: true,
      list: vi.fn(() => { throw new Error('cloud unavailable'); }),
      loadCached: vi.fn(() => [{ id: 'cached' }]),
    };
    const loadHydration = vi.fn(async () => ({
      hydratePersistedCampaignRows: rows => rows,
    }));
    const loadSyncTools = vi.fn(() => { throw new Error('admission unavailable'); });

    await expect(runCampaignLoad({
      set: store.set,
      get: store.get,
      migrateCampaign: value => value,
      loadHydration,
      service,
      loadSyncTools,
    })).rejects.toMatchObject({ code: 'campaign_admission_unavailable' });

    expect(store.state.campaigns).toEqual([{ id: 'cached' }]);
    expect(store.state.campaignsLoaded).toBe(false);
    expect(store.state.campaignLoadError).toMatchObject({
      code: 'campaign_admission_unavailable',
    });
    expect(service.list).toHaveBeenCalledTimes(1);
    expect(loadSyncTools).toHaveBeenCalledTimes(1);
    warning.mockRestore();
  });

  test('a synchronous remote-only outage degrades to the strictly admitted cache', async () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const store = fakeStore({
      auth: { tier: 'free', user: { id: 'owner-a' } },
      campaignSessionGeneration: 9,
      campaigns: [],
      campaignsLoaded: false,
      campaignLoadError: null,
      customContent: {},
      customContentSyncedAt: null,
    });
    const service = {
      isConfigured: true,
      list: vi.fn(() => { throw new Error('cloud unavailable'); }),
      loadCached: vi.fn(() => [{ id: 'cached' }]),
    };
    const tools = {
      mergeCampaignLists: vi.fn(),
      primeCampaignSync: vi.fn(),
      reconcileTombstones: vi.fn(),
    };

    await expect(runCampaignLoad({
      set: store.set,
      get: store.get,
      migrateCampaign: value => value,
      loadHydration: async () => ({ hydratePersistedCampaignRows: rows => rows }),
      service,
      loadSyncTools: () => tools,
    })).resolves.toEqual([{ id: 'cached' }]);

    expect(store.state.campaignsLoaded).toBe(true);
    expect(store.state.campaignLoadError).toBeNull();
    warning.mockRestore();
  });

  test('Retry outbox is eager, stable, and non-rejecting before runtime preload', async () => {
    const retryPersist = vi.fn(async () => [{ ok: true }]);
    const store = fakeStore({ campaignSyncError: 'failed' });
    const entry = createCampaignEntry(
      store.set,
      store.get,
      () => {},
      () => ({ sessionReader: store.get }),
      retryPersist,
    );
    Object.assign(store.state, entry);

    const retry = store.state.retryOutbox;
    await expect(retry()).resolves.toEqual([{ ok: true }]);
    expect(store.state.retryOutbox).toBe(retry);
    expect(store.state.campaignSyncError).toBeNull();
    expect(retryPersist).toHaveBeenCalledTimes(1);
  });

  test('cold auth boundaries reset only owner-scoped transient campaign work', () => {
    const store = fakeStore({ auth: { user: { id: 'owner-a' } } });
    const clearSyncBookkeeping = vi.fn();
    Object.assign(
      store.state,
      createCampaignEntry(store.set, store.get, clearSyncBookkeeping),
      createPulseEntry(store.set, store.get),
      {
        campaigns: [{ id: 'campaign' }],
        campaignsLoaded: true,
        activeCampaignId: 'campaign',
        campaignMutationLocks: [{ token: 'lock' }],
        advanceInFlight: ['campaign'],
        pulseUndoStack: [{}],
        proposalUndoStack: [{}],
        advanceSeqByCampaign: { campaign: 2 },
        advanceAutoResolve: true,
        livingCatchUp: { campaignId: 'campaign' },
      },
    );

    store.state.clearCampaigns();
    expect(store.state).toMatchObject({
      campaigns: [],
      campaignsLoaded: false,
      activeCampaignId: null,
      campaignSessionGeneration: 1,
      campaignMutationLocks: [],
      advanceInFlight: [],
      pulseUndoStack: [],
      proposalUndoStack: [],
      advanceSeqByCampaign: {},
      advanceAutoResolve: true,
      livingCatchUp: { campaignId: 'campaign' },
    });
    expect(clearSyncBookkeeping).toHaveBeenCalledTimes(1);
  });

  test('session, failure, and outbox reporters are live before runtime preload', () => {
    const store = fakeStore({ campaignSyncError: null, outboxStatus: null });
    let reportFailure;
    let reportStatus;
    const initSession = vi.fn();
    const initFailure = vi.fn((_key, callback) => { reportFailure = callback; });
    const initStatus = vi.fn((_key, callback) => { reportStatus = callback; });
    const initReporting = (set, get) => initCampaignEntryReporting(set, get, {
      initCampaignSessionReader: initSession,
      initPersistFailureReporter: initFailure,
      initOutboxStatusReporter: initStatus,
    });

    createCampaignEntry(store.set, store.get, () => {}, initReporting);
    reportFailure();
    reportStatus({ queued: 3, failed: 1, inflight: 0 });

    expect(initSession).toHaveBeenCalledWith(store.get);
    expect(initFailure).toHaveBeenCalledWith(store.get, expect.any(Function));
    expect(initStatus).toHaveBeenCalledWith(store.get, expect.any(Function));
    expect(store.state.campaignSyncError).toContain('could not be saved to the cloud');
    expect(store.state.outboxStatus).toEqual({ queued: 3, failed: 1, inflight: 0 });
  });

  test('store-held reporter leases isolate owners and unsubscribe exactly once', () => {
    const stores = ['owner-a', 'owner-b'].map(ownerId => {
      const store = fakeStore({
        auth: { user: { id: ownerId } },
        campaignSyncError: null,
        outboxStatus: { queued: 0, failed: 0, inflight: 0 },
      });
      let reportStatus;
      const disposeFailure = vi.fn();
      const disposeStatus = vi.fn();
      const initReporting = (set, get) => initCampaignEntryReporting(set, get, {
        initCampaignSessionReader: reader => reader,
        initPersistFailureReporter: () => disposeFailure,
        initOutboxStatusReporter: (_key, callback) => {
          reportStatus = callback;
          return disposeStatus;
        },
      });
      Object.assign(store.state, createCampaignEntry(
        store.set,
        store.get,
        () => {},
        initReporting,
      ));
      return { store, reportStatus, disposeFailure, disposeStatus };
    });

    const status = { queued: 2, failed: 1, inflight: 0 };
    for (const candidate of stores) candidate.reportStatus(status, 'owner-a');

    expect(stores[0].store.state.outboxStatus).toBe(status);
    expect(stores[1].store.state.outboxStatus).toEqual({
      queued: 0,
      failed: 0,
      inflight: 0,
    });
    for (const candidate of stores) {
      const lease = candidate.store.state[CAMPAIGN_REPORTING_LEASE];
      expect(lease.failureReporter).toEqual(expect.any(Function));
      expect(lease.statusReporter).toEqual(expect.any(Function));
      lease.dispose();
      lease.dispose();
      expect(candidate.disposeFailure).toHaveBeenCalledTimes(1);
      expect(candidate.disposeStatus).toHaveBeenCalledTimes(1);
    }
  });

  test('the real Zustand Immer store preserves capability symbols but never persists them', async () => {
    const { useStore } = await import('../../src/store/index.js');
    const { partializeStoreState } = await import('../../src/store/persistProjection.js');
    const before = useStore.getState();
    const reader = before[CAMPAIGN_SESSION_READER];
    const lease = before[CAMPAIGN_REPORTING_LEASE];
    const originalGeneration = before.campaignSessionGeneration;

    expect(reader).toEqual(expect.any(Function));
    expect(lease?.statusReporter).toEqual(expect.any(Function));
    useStore.setState(state => {
      state.campaignSessionGeneration = originalGeneration + 1;
    });

    const after = useStore.getState();
    expect(after[CAMPAIGN_SESSION_READER]).toBe(reader);
    expect(after[CAMPAIGN_REPORTING_LEASE]).toBe(lease);
    expect(reader()).toBe(after);

    const persisted = partializeStoreState(after);
    expect(Object.getOwnPropertySymbols(persisted)).toEqual([]);
    expect(JSON.parse(JSON.stringify({
      [CAMPAIGN_SESSION_READER]: reader,
      [CAMPAIGN_REPORTING_LEASE]: lease,
      campaignsLoaded: after.campaignsLoaded,
    }))).toEqual({ campaignsLoaded: after.campaignsLoaded });

    useStore.setState(state => {
      state.campaignSessionGeneration = originalGeneration;
    });
  });

  test('two actual runtime instances retain independent session capabilities', async () => {
    const makeRuntimeStore = ownerId => {
      const store = fakeStore({
        auth: { tier: 'free', user: { id: ownerId } },
        campaigns: [],
        campaignSessionGeneration: 3,
      });
      Object.assign(
        store.state,
        createCampaignEntry(store.set, store.get),
        createRegionalEntry(store.set, store.get),
        createPulseEntry(store.set, store.get),
      );
      return store;
    };
    const first = makeRuntimeStore('owner-one');
    const second = makeRuntimeStore('owner-two');

    await Promise.all([
      preloadCampaignRuntime(first.set, first.get),
      preloadCampaignRuntime(second.set, second.get),
    ]);
    const firstFence = cacheCampaignState(first.state);
    const secondFence = cacheCampaignState(second.state);

    expect(first.state[CAMPAIGN_SESSION_READER]).toBe(first.get);
    expect(second.state[CAMPAIGN_SESSION_READER]).toBe(second.get);
    expect(firstFence.isSessionCurrent()).toBe(true);
    expect(secondFence.isSessionCurrent()).toBe(true);
    first.state.campaignSessionGeneration += 1;
    expect(firstFence.isSessionCurrent()).toBe(false);
    expect(secondFence.isSessionCurrent()).toBe(true);
  });
});
