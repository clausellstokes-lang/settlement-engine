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
  const service = {
    isConfigured: true,
    list: () => Promise.resolve(Array.from(cloud.values()).map(clone)),
    upsert: (campaign) => { cloud.set(String(campaign.id), clone(campaign)); return Promise.resolve(campaign.id); },
    delete: (id) => { cloud.delete(String(id)); return Promise.resolve(); },
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
    service, cloud, caches, tombs,
    reset() { cloud.clear(); caches.clear(); tombs.clear(); },
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

  test('create → delete → reload does not resurrect on the deleting device', async () => {
    const store = makeStore();
    const id = store.getState().createCampaign('Doomed');
    await flush();                                   // let the create backfill reach the cloud
    expect(h.cloud.has(id)).toBe(true);

    store.getState().deleteCampaign(id);
    await flush();                                   // cloud delete + tombstone
    expect(h.cloud.has(id)).toBe(false);

    await store.getState().loadCampaigns();          // a fresh load must not bring it back
    await flush();
    expect(store.getState().campaigns.find(c => c.id === id)).toBeUndefined();
    expect(h.cloud.has(id)).toBe(false);
  });
});
