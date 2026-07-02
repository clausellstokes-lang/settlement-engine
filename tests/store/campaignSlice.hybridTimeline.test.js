/**
 * tests/store/campaignSlice.hybridTimeline.test.js
 *
 * The hybrid-timeline reload regression net. A world-pulse advance commits
 * locally BEFORE the atomic persist_world_pulse_advance RPC (069); when that
 * RPC fails, the cloud keeps the coherent PRE-advance write-set (campaign row
 * + member settlement rows together) while the local cache keeps the ADVANCED
 * campaign with a newer updatedAt. On reload, loadCampaigns must NOT let that
 * local copy win the merge and then bare-backfill it to the cloud — that would
 * advance the cloud campaign tick WITHOUT its member-settlement writes, a
 * permanent campaign-tick vs settlement-state split. campaignService is mocked
 * as a configured cloud-backed service (mirroring the deletionSync harness) so
 * loadCampaigns runs its real merge/backfill path against a controllable
 * backend.
 */

import { beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

const UUID_C = '33333333-3333-4333-8333-333333333333';

const h = vi.hoisted(() => {
  // vi.hoisted runs before imports, so the centralized deepClone seam is not
  // available here; structuredClone is the lint-sanctioned stand-in.
  const clone = value => (value == null ? null : structuredClone(value));
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

/** A minimal canonized campaign row at a given world tick. */
function campaignAtTick(tick, { name = 'Realm', updatedAt } = {}) {
  return {
    id: UUID_C,
    name,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: updatedAt || '2026-01-02T00:00:00Z',
    settlementIds: ['save_1'],
    mapState: null,
    accessState: 'active',
    worldState: { canonizedAt: '2026-01-01T12:00:00Z', tick },
  };
}

describe('campaignSlice hybrid-timeline reconciliation', () => {
  beforeEach(() => {
    installLocalStorage();
    h.reset();
  });

  test('a failed atomic advance persist does not backfill the advanced campaign on reload', async () => {
    // Cloud holds the coherent PRE-advance write-set (069 rolled the whole
    // advance back): campaign tick 4 alongside its (pre-advance) settlement rows.
    h.cloud.set(UUID_C, campaignAtTick(4, { updatedAt: '2026-01-02T00:00:00Z' }));
    // The local cache holds the Phase-2 residue: the ADVANCED campaign (tick 5)
    // with a newer updatedAt — cached by cacheCampaignState BEFORE the RPC failed.
    h.caches.set('user_a', [{
      ...campaignAtTick(5, { updatedAt: '2026-01-02T01:00:00Z' }),
      pendingSync: false,
    }]);

    const store = makeStore();
    await store.getState().loadCampaigns();
    await flush();

    // No hybrid: the campaign tick matches the cloud (= member-settlement) state…
    const loaded = store.getState().campaigns.find(c => c.id === UUID_C);
    expect(loaded?.worldState?.tick).toBe(4);
    // …the advanced snapshot was NOT bare-upserted to the cloud (which would
    // advance the campaign row without its member-settlement writes)…
    expect(h.cloud.get(UUID_C)?.worldState?.tick).toBe(4);
    // …and the stale local cache was rolled back to the coherent cloud copy.
    expect(h.caches.get('user_a')?.find(c => c.id === UUID_C)?.worldState?.tick).toBe(4);
  });

  test('a failed backward (undo) persist also reconciles to the cloud write-set', async () => {
    // Undo restores a LOWER tick locally; if its atomic persist failed, the
    // cloud still holds the higher post-advance write-set. Bare-backfilling the
    // undone campaign row would split it from the (post-advance) settlements.
    h.cloud.set(UUID_C, campaignAtTick(4, { updatedAt: '2026-01-02T00:00:00Z' }));
    h.caches.set('user_a', [{
      ...campaignAtTick(3, { updatedAt: '2026-01-02T01:00:00Z' }),
      pendingSync: false,
    }]);

    const store = makeStore();
    await store.getState().loadCampaigns();
    await flush();

    expect(store.getState().campaigns.find(c => c.id === UUID_C)?.worldState?.tick).toBe(4);
    expect(h.cloud.get(UUID_C)?.worldState?.tick).toBe(4);
  });

  test('a same-tick locally-newer campaign (rename) still wins and backfills', async () => {
    // Campaign-row-only writes (rename, map save, queued intentions) do not move
    // the tick; the bare backfill is their correct persist path and must survive.
    h.cloud.set(UUID_C, campaignAtTick(4, { name: 'Old Name', updatedAt: '2026-01-02T00:00:00Z' }));
    h.caches.set('user_a', [{
      ...campaignAtTick(4, { name: 'New Name', updatedAt: '2026-01-02T01:00:00Z' }),
      pendingSync: false,
    }]);

    const store = makeStore();
    await store.getState().loadCampaigns();
    await flush();

    expect(store.getState().campaigns.find(c => c.id === UUID_C)?.name).toBe('New Name');
    expect(h.cloud.get(UUID_C)?.name).toBe('New Name'); // backfilled
    expect(h.cloud.get(UUID_C)?.worldState?.tick).toBe(4);
  });

  test('a campaign created while list() is in flight survives the resolve overwrite', async () => {
    // Hold list() open so a mid-flight createCampaign races the resolve. The
    // remote snapshot is captured at INVOCATION time (before the create), like a
    // real server read that predates the create's upsert reaching the cloud.
    let releaseList;
    const gate = new Promise(r => { releaseList = r; });
    const originalList = h.service.list;
    h.service.list = () => {
      const snapshot = Array.from(h.cloud.values()).map(c => structuredClone(c));
      return gate.then(() => snapshot);
    };

    const store = makeStore();
    const loading = store.getState().loadCampaigns();
    const newId = store.getState().createCampaign('Mid-flight Realm');
    expect(newId).toBeTruthy();
    releaseList();
    await loading;
    await flush();
    h.service.list = originalList;

    // The list()-resolve overwrite must merge against the LIVE list, not the
    // load-start snapshot — the new campaign stays in state and in the cache.
    expect(store.getState().campaigns.some(c => c.id === newId)).toBe(true);
    expect(h.caches.get('user_a')?.some(c => c.id === newId)).toBe(true);
  });
});
