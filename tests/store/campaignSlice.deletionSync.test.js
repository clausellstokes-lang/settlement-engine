/**
 * tests/store/campaignSlice.deletionSync.test.js
 *
 * The deletion-resurrection regression net. campaignService is mocked as a
 * configured cloud-backed service (shared in-memory cloud + per-owner cache and
 * tombstone stores) so loadCampaigns runs its real merge/backfill path against
 * a controllable backend.
 */

import { beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

const UUID_X = '11111111-1111-4111-8111-111111111111';
const UUID_Y = '22222222-2222-4222-8222-222222222222';

const h = vi.hoisted(() => {
  const clone = value => JSON.parse(JSON.stringify(value ?? null));
  const cloud = new Map();   // id -> campaign (the shared cloud)
  const caches = new Map();  // ownerId -> campaign[] (this device's local cache)
  const tombs = new Map();   // ownerId -> { id, deletedAt }[]
  const deleteFailures = new Map();
  const deleteHolds = new Map();
  const upserts = [];
  let upsertFailure = null;
  const service = {
    isConfigured: true,
    list: () => Promise.resolve(Array.from(cloud.values()).map(clone)),
    upsert: async (campaign) => {
      upserts.push(clone(campaign));
      if (upsertFailure) throw upsertFailure;
      cloud.set(String(campaign.id), clone(campaign));
      return campaign.id;
    },
    delete: async (id) => {
      const hold = deleteHolds.get(String(id));
      if (hold) await hold.promise;
      const failure = deleteFailures.get(String(id));
      if (failure) throw failure;
      cloud.delete(String(id));
    },
    cache: (arr, owner = 'anon') => { caches.set(owner, clone(arr) || []); },
    loadCached: (owner = 'anon') => clone(caches.get(owner)) || [],
    clearCache: (owner = 'anon') => { caches.delete(owner); },
    loadTombstones: (owner = 'anon') => clone(tombs.get(owner)) || [],
    writeTombstones: (list, owner = 'anon') => { tombs.set(owner, clone(list) || []); },
    recordTombstone: (id, owner = 'anon') => {
      const key = String(id);
      const next = (tombs.get(owner) || []).filter(e => String(e.id) !== key);
      next.push({ id: key, deletedAt: new Date().toISOString() });
      tombs.set(owner, next);
    },
  };
  return {
    service,
    cloud,
    caches,
    tombs,
    deleteFailures,
    deleteHolds,
    upserts,
    failNextUpsert(error) {
      upsertFailure = error;
    },
    holdDelete(id) {
      let release;
      const promise = new Promise(resolve => {
        release = resolve;
      });
      deleteHolds.set(String(id), { promise, release });
      return () => {
        deleteHolds.delete(String(id));
        release();
      };
    },
    reset() {
      cloud.clear();
      caches.clear();
      tombs.clear();
      deleteFailures.clear();
      deleteHolds.clear();
      upserts.length = 0;
      upsertFailure = null;
    },
  };
});

vi.mock('../../src/lib/campaigns.js', () => ({
  campaigns: h.service,
  isCampaignActive: campaign => (campaign?.accessState || 'active') === 'active',
  ACTIVE_CAMPAIGN_STATE: 'active',
}));

const { createCampaignSlice } = await import('../../src/store/campaignSlice.js');

function installLocalStorage() {
  const data = new Map();
  globalThis.localStorage = {
    getItem: key => data.get(String(key)) ?? null,
    setItem: (key, value) => { data.set(String(key), String(value)); },
    removeItem: key => { data.delete(String(key)); },
    clear: () => { data.clear(); },
  };
}

const flush = async () => { await new Promise(r => setTimeout(r, 0)); await new Promise(r => setTimeout(r, 0)); };

function makeStore(userId = 'user_a') {
  return create(immer((...a) => ({
    auth: { user: { id: userId }, tier: 'premium', role: 'developer' },
    savedSettlements: [],
    settlement: null,
    activeSaveId: null,
    ...createCampaignSlice(...a),
  })));
}

describe('campaignSlice deletion reconciliation', () => {
  beforeEach(() => {
    installLocalStorage();
    h.reset();
  });

  test('a previously-synced campaign absent from remote is dropped, not resurrected', async () => {
    // Device B's stale cache still holds a campaign that device A deleted in the
    // cloud. pendingSync:false marks it as once-synced, so its absence from the
    // remote list is a deletion — it must not reappear or get re-uploaded.
    h.caches.set('user_a', [{ id: UUID_X, name: 'Ghost', updatedAt: '2020-01-01T00:00:00Z', settlementIds: [], pendingSync: false }]);

    const store = makeStore();
    await store.getState().loadCampaigns();
    await flush();

    expect(store.getState().campaigns.find(c => c.id === UUID_X)).toBeUndefined();
    expect(h.cloud.has(UUID_X)).toBe(false);                // not re-uploaded
    expect(h.caches.get('user_a').find(c => c.id === UUID_X)).toBeUndefined(); // cache cleaned
  });

  test('a never-synced local campaign absent from remote is kept and uploaded', async () => {
    h.caches.set('user_a', [{ id: UUID_Y, name: 'Offline Draft', updatedAt: '2020-01-01T00:00:00Z', settlementIds: [], pendingSync: true }]);

    const store = makeStore();
    await store.getState().loadCampaigns();
    await flush();

    expect(store.getState().campaigns.map(c => c.id)).toContain(UUID_Y);
    expect(h.cloud.has(UUID_Y)).toBe(true);                 // backfilled to cloud
  });

  test('a tombstone suppresses a campaign an in-flight remote load still returns', async () => {
    // The cloud list() raced the delete and still returned the row; the local
    // tombstone (recorded by the delete) must still win.
    h.cloud.set(UUID_X, { id: UUID_X, name: 'Cloud Echo', updatedAt: '2020-01-01T00:00:00Z', settlementIds: [], accessState: 'active' });
    h.caches.set('user_a', [{ id: UUID_X, name: 'Cloud Echo', updatedAt: '2020-01-01T00:00:00Z', settlementIds: [], pendingSync: false }]);
    h.service.recordTombstone(UUID_X, 'user_a');

    const store = makeStore();
    await store.getState().loadCampaigns();
    await flush();

    expect(store.getState().campaigns.find(c => c.id === UUID_X)).toBeUndefined();
    expect(h.caches.get('user_a').find(c => c.id === UUID_X)).toBeUndefined();
    // Delete not yet propagated (still in cloud) — keep guarding with the tombstone.
    expect(h.service.loadTombstones('user_a').map(t => t.id)).toContain(UUID_X);
  });

  test('createCampaign stamps the never-synced marker', () => {
    const store = makeStore();
    const id = store.getState().createCampaign('My Realm');
    expect(id).toBeTruthy();
    expect(store.getState().campaigns.find(c => c.id === id)?.pendingSync).toBe(true);
  });

  test('imports one final campaign envelope before exposing confirmed state', async () => {
    const store = makeStore();
    const binding = { bindingHash: 'binding-imported' };
    const receipt = await store.getState().createImportedCampaign(
      'Imported Realm',
      {
        settlementIds: ['save-a', 'save-b'],
        contentBinding: binding,
        contentBindingHistory: [{ bindingHash: 'binding-earlier' }],
      },
    );

    expect(receipt).toMatchObject({
      ok: true,
      status: 'applied',
      persistence: { state: 'confirmed' },
    });
    expect(h.upserts).toHaveLength(1);
    expect(h.upserts[0]).toMatchObject({
      name: 'Imported Realm',
      settlementIds: ['save-a', 'save-b'],
      contentBinding: binding,
      contentBindingHistory: [{ bindingHash: 'binding-earlier' }],
    });
    expect(store.getState().campaigns[0]).toMatchObject({
      settlementIds: ['save-a', 'save-b'],
      contentBinding: binding,
      pendingSync: false,
    });
  });

  test('does not expose an imported campaign whose first insert is unconfirmed', async () => {
    h.failNextUpsert(new TypeError('Failed to fetch'));
    const store = makeStore();
    const receipt = await store.getState().createImportedCampaign(
      'Ambiguous Realm',
      { settlementIds: ['save-a'] },
    );

    expect(receipt).toMatchObject({
      ok: false,
      status: 'reconcile-required',
      persistence: { state: 'unconfirmed' },
    });
    expect(store.getState().campaigns).toEqual([]);
  });

  test('create → delete → reload does not resurrect on the deleting device', async () => {
    const store = makeStore();
    const id = store.getState().createCampaign('Doomed');
    await flush();                                   // let the create backfill reach the cloud
    expect(h.cloud.has(id)).toBe(true);
    store.setState({ pulseUndoStack: [
      { campaignId: id, worldState: { tick: 1 } },
      { campaignId: 'other-campaign', worldState: { tick: 2 } },
    ] });

    store.getState().deleteCampaign(id);
    await flush();                                   // cloud delete + tombstone
    expect(h.cloud.has(id)).toBe(false);
    expect(store.getState().pulseUndoStack).toEqual([
      { campaignId: 'other-campaign', worldState: { tick: 2 } },
    ]);

    await store.getState().loadCampaigns();          // a fresh load must not bring it back
    await flush();
    expect(store.getState().campaigns.find(c => c.id === id)).toBeUndefined();
    expect(h.cloud.has(id)).toBe(false);
  });

  test('awaitPersistence keeps a failed cloud delete visible and makes a retry awaitable', async () => {
    h.cloud.set(UUID_X, {
      id: UUID_X, name: 'Retry Me', updatedAt: '2026-01-01T00:00:00Z',
      settlementIds: [], accessState: 'active',
    });
    const store = makeStore();
    await store.getState().loadCampaigns();
    store.setState({ pulseUndoStack: [{ campaignId: UUID_X, worldState: { tick: 1 } }] });
    h.deleteFailures.set(UUID_X, new Error('cloud unavailable'));

    await expect(
      store.getState().deleteCampaign(UUID_X, { awaitPersistence: true }),
    ).rejects.toThrow('cloud unavailable');
    expect(store.getState().campaigns.some(c => c.id === UUID_X)).toBe(true);
    expect(h.cloud.has(UUID_X)).toBe(true);
    expect(store.getState().pulseUndoStack).toHaveLength(1);

    h.deleteFailures.delete(UUID_X);
    await expect(
      store.getState().deleteCampaign(UUID_X, { awaitPersistence: true }),
    ).resolves.toMatchObject({ ok: true, campaignId: UUID_X });
    expect(store.getState().campaigns.some(c => c.id === UUID_X)).toBe(false);
    expect(h.cloud.has(UUID_X)).toBe(false);
    expect(store.getState().pulseUndoStack).toEqual([]);
  });

  test('awaitPersistence deletes retention-frozen campaigns instead of treating them as absent', async () => {
    h.cloud.set(UUID_X, {
      id: UUID_X, name: 'Frozen Realm', updatedAt: '2026-01-01T00:00:00Z',
      settlementIds: [], accessState: 'retention_frozen',
    });
    const store = makeStore();
    await store.getState().loadCampaigns();
    expect(store.getState().campaigns).toHaveLength(1);

    await expect(
      store.getState().deleteCampaign(UUID_X, { awaitPersistence: true }),
    ).resolves.toMatchObject({ ok: true, campaignId: UUID_X });

    expect(store.getState().campaigns).toEqual([]);
    expect(h.cloud.has(UUID_X)).toBe(false);
    expect(h.service.loadTombstones('user_a').map(entry => entry.id)).toContain(UUID_X);
  });

  test('awaitPersistence finalizes by id even if access state changes while the remote delete waits', async () => {
    h.cloud.set(UUID_X, {
      id: UUID_X, name: 'Changing Realm', updatedAt: '2026-01-01T00:00:00Z',
      settlementIds: [], accessState: 'active',
    });
    const store = makeStore();
    await store.getState().loadCampaigns();
    const releaseDelete = h.holdDelete(UUID_X);
    const deleting = store.getState().deleteCampaign(UUID_X, { awaitPersistence: true });

    store.setState(state => {
      state.campaigns[0].accessState = 'retention_frozen';
    });
    const rename = store.getState().renameCampaign(UUID_X, 'Must Not Recreate');
    expect(rename).toMatchObject({ ok: false, reason: 'campaign_deletion_in_flight' });
    releaseDelete();

    await expect(deleting).resolves.toMatchObject({ ok: true, campaignId: UUID_X });
    expect(store.getState().campaigns).toEqual([]);
    expect(h.cloud.has(UUID_X)).toBe(false);
  });

  test('a late A delete cannot finalize against B with the same campaign id', async () => {
    const campaignA = {
      id: UUID_X, name: 'A realm', updatedAt: '2026-01-01T00:00:00Z',
      settlementIds: [], accessState: 'active',
    };
    const campaignB = {
      id: UUID_X, name: 'B realm', updatedAt: '2026-01-02T00:00:00Z',
      settlementIds: [], accessState: 'active',
    };
    h.cloud.set(UUID_X, campaignA);
    const store = makeStore('user_a');
    store.setState({
      campaigns: [campaignA],
      campaignsLoaded: true,
      pulseUndoStack: [{ campaignId: UUID_X, owner: 'A' }],
    });
    const releaseDelete = h.holdDelete(UUID_X);
    const deleting = store.getState().deleteCampaign(UUID_X, { awaitPersistence: true });

    store.getState().clearCampaigns();
    h.caches.set('user_b', [campaignB]);
    store.setState({
      auth: { user: { id: 'user_b' }, tier: 'premium', role: 'developer' },
      campaigns: [campaignB],
      campaignsLoaded: true,
      pulseUndoStack: [{ campaignId: UUID_X, owner: 'B' }],
    });
    releaseDelete();

    await expect(deleting).rejects.toMatchObject({ code: 'auth_session_changed' });
    expect(store.getState().campaigns).toEqual([campaignB]);
    expect(store.getState().pulseUndoStack).toEqual([{ campaignId: UUID_X, owner: 'B' }]);
    expect(h.caches.get('user_b')).toEqual([campaignB]);
    expect(h.service.loadTombstones('user_b')).toEqual([]);
    expect(h.service.loadTombstones('user_a').map(entry => entry.id)).toContain(UUID_X);
  });

  test('strictly hydrates raw cache and cloud worlds before either can be published', async () => {
    const forgedWorld = { envoyErrands: [{ id: 'forged-row' }] };
    h.caches.set('user_a', [{
      id: UUID_X,
      name: 'Cached raw realm',
      updatedAt: '2026-01-01T00:00:00Z',
      settlementIds: [],
      pendingSync: true,
      worldState: forgedWorld,
    }]);
    h.cloud.set(UUID_Y, {
      id: UUID_Y,
      name: 'Cloud raw realm',
      updatedAt: '2026-01-02T00:00:00Z',
      settlementIds: [],
      worldState: forgedWorld,
    });

    const store = makeStore();
    const loading = store.getState().loadCampaigns();
    await loading;
    await flush();

    expect(store.getState().campaigns.map(campaign => campaign.id)).toEqual([UUID_Y, UUID_X]);
    for (const campaign of store.getState().campaigns) {
      expect(campaign.worldState).not.toHaveProperty('envoyErrands');
    }
  });

  test('an immediate list rejection is handled while the cold hydration chunk loads', async () => {
    const originalList = h.service.list;
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    h.caches.set('user_a', [{
      id: UUID_X,
      name: 'Offline fallback',
      updatedAt: '2026-01-01T00:00:00Z',
      settlementIds: [],
      worldState: { envoyErrands: [{ id: 'forged-row' }] },
    }]);
    h.service.list = () => Promise.reject(new Error('immediate network failure'));

    try {
      const store = makeStore();
      await expect(store.getState().loadCampaigns()).resolves.toEqual([
        expect.objectContaining({ id: UUID_X, name: 'Offline fallback' }),
      ]);
      expect(store.getState().campaignsLoaded).toBe(true);
      expect(store.getState().campaigns[0].worldState).not.toHaveProperty('envoyErrands');
      expect(warn).toHaveBeenCalledWith(
        '[campaignSlice] campaign cloud load failed',
        expect.objectContaining({ message: 'immediate network failure' }),
      );
    } finally {
      h.service.list = originalList;
      warn.mockRestore();
    }
  });

  test('a rejected A list cannot mark B campaigns loaded', async () => {
    const originalList = h.service.list;
    let rejectList;
    h.service.list = () => new Promise((_, reject) => {
      rejectList = reject;
    });
    const store = makeStore('user_a');
    const loadingA = store.getState().loadCampaigns();
    expect(rejectList, 'list() must start synchronously before cold hydration').toBeTypeOf('function');

    store.getState().clearCampaigns();
    store.setState({
      auth: { user: { id: 'user_b' }, tier: 'premium', role: 'developer' },
      campaigns: [{ id: UUID_Y, name: 'B loading' }],
      campaignsLoaded: false,
    });
    rejectList(new Error('late A list failure'));

    await expect(loadingA).resolves.toEqual([{ id: UUID_Y, name: 'B loading' }]);
    expect(store.getState().campaigns).toEqual([{ id: UUID_Y, name: 'B loading' }]);
    expect(store.getState().campaignsLoaded).toBe(false);
    h.service.list = originalList;
  });
});
