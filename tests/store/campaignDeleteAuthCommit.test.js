/**
 * Production surface: campaigns.delete plus campaignSlice's local finalization.
 *
 * A suspended owner-A delete must never remove, tombstone, or clear undo state
 * for owner B's same-id campaign. Zero-row-but-visible is the retryable negative
 * control; a returned A row may tombstone only A and still cannot finalize B.
 */
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

const CAMPAIGN_ID = '33333333-3333-4333-8333-333333333333';

const h = vi.hoisted(() => {
  const state = {
    userId: 'owner-a',
    deleteStarted: false,
    resolveDelete: null,
    remainingRow: null,
  };
  return {
    state,
    reset() {
      state.userId = 'owner-a';
      state.deleteStarted = false;
      state.resolveDelete = null;
      state.remainingRow = null;
    },
  };
});

vi.mock('../../src/lib/supabase.js', () => ({
  isConfigured: true,
  supabase: {
    auth: {
      getUser: vi.fn(async () => ({
        data: { user: h.state.userId ? { id: h.state.userId } : null },
      })),
    },
    from: vi.fn(() => ({
      delete: () => {
        const query = {
          eq: () => query,
          select: () => {
            h.state.deleteStarted = true;
            return new Promise(resolve => {
              h.state.resolveDelete = resolve;
            });
          },
        };
        return query;
      },
      select: () => {
        const query = {
          eq: () => query,
          maybeSingle: () => Promise.resolve({
            data: h.state.remainingRow,
            error: null,
          }),
        };
        return query;
      },
    })),
  },
}));

vi.mock('../../src/lib/saves.js', () => ({
  saves: {
    update: vi.fn(() => Promise.resolve()),
    isConfigured: true,
  },
}));

const [{ createCampaignSlice }, { campaigns }] = await Promise.all([
  import('../../src/store/campaignSlice.js'),
  import('../../src/lib/campaigns.js'),
]);

function installLocalStorage() {
  const data = new Map();
  globalThis.localStorage = {
    getItem: key => data.get(String(key)) ?? null,
    setItem: (key, value) => { data.set(String(key), String(value)); },
    removeItem: key => { data.delete(String(key)); },
    clear: () => { data.clear(); },
  };
}

function campaign(name) {
  return {
    id: CAMPAIGN_ID,
    name,
    updatedAt: '2026-07-24T00:00:00.000Z',
    settlementIds: [],
    accessState: 'active',
  };
}

function makeStore(ownerId, value) {
  const store = create(immer((set, get, api) => ({
    auth: { user: { id: ownerId }, tier: 'premium', role: 'developer' },
    savedSettlements: [],
    settlement: null,
    activeSaveId: null,
    ...createCampaignSlice(set, get, api),
  })));
  store.setState({
    campaigns: [value],
    campaignsLoaded: true,
    campaignSessionGeneration: 11,
    pulseUndoStack: [{ campaignId: CAMPAIGN_ID, owner: ownerId }],
  });
  campaigns.cache([value], ownerId);
  return store;
}

async function waitForDeleteRequest() {
  await vi.waitFor(() => {
    expect(h.state.deleteStarted).toBe(true);
    expect(h.state.resolveDelete).toBeTypeOf('function');
  });
}

function rotateStoreToB(store, campaignB) {
  store.getState().clearCampaigns();
  h.state.userId = 'owner-b';
  campaigns.cache([campaignB], 'owner-b');
  store.setState({
    auth: { user: { id: 'owner-b' }, tier: 'premium', role: 'developer' },
    campaigns: [campaignB],
    campaignsLoaded: true,
    pulseUndoStack: [{ campaignId: CAMPAIGN_ID, owner: 'owner-b' }],
  });
}

describe('confirmed campaign delete commit proof across auth rotation', () => {
  beforeEach(() => {
    installLocalStorage();
    h.reset();
  });

  test('zero-row A delete after rotation rejects and remains retryable without tombstone', async () => {
    const campaignA = campaign('A realm');
    const campaignB = campaign('B realm');
    const store = makeStore('owner-a', campaignA);
    const deleting = store.getState().deleteCampaign(CAMPAIGN_ID, { awaitPersistence: true });
    await waitForDeleteRequest();

    rotateStoreToB(store, campaignB);
    h.state.resolveDelete({ data: [], error: null });

    await expect(deleting).rejects.toMatchObject({ code: 'auth_session_changed' });
    expect(campaigns.loadCached('owner-a')).toEqual([campaignA]);
    expect(campaigns.loadTombstones('owner-a')).toEqual([]);
    expect(campaigns.isDeleteReserved(CAMPAIGN_ID, 'owner-a')).toBe(false);
    expect(store.getState().campaigns).toEqual([campaignB]);
    expect(store.getState().pulseUndoStack).toEqual([
      { campaignId: CAMPAIGN_ID, owner: 'owner-b' },
    ]);
    expect(campaigns.loadTombstones('owner-b')).toEqual([]);
  });

  test('returned A row proves commit, tombstones A, and never finalizes against B', async () => {
    const campaignA = campaign('A realm');
    const campaignB = campaign('B realm');
    const store = makeStore('owner-a', campaignA);
    const deleting = store.getState().deleteCampaign(CAMPAIGN_ID, { awaitPersistence: true });
    await waitForDeleteRequest();

    rotateStoreToB(store, campaignB);
    h.state.resolveDelete({ data: [{ id: CAMPAIGN_ID }], error: null });

    await expect(deleting).rejects.toMatchObject({ code: 'auth_session_changed' });
    expect(campaigns.loadTombstones('owner-a').map(entry => entry.id)).toContain(CAMPAIGN_ID);
    expect(store.getState().campaigns).toEqual([campaignB]);
    expect(store.getState().pulseUndoStack).toEqual([
      { campaignId: CAMPAIGN_ID, owner: 'owner-b' },
    ]);
    expect(campaigns.loadCached('owner-b')).toEqual([campaignB]);
    expect(campaigns.loadTombstones('owner-b')).toEqual([]);
  });

  test('same-owner zero-row delete rejects while the campaign remains visible', async () => {
    h.state.remainingRow = { id: CAMPAIGN_ID };
    const deleting = campaigns.delete(CAMPAIGN_ID, 'owner-a', () => true);
    await waitForDeleteRequest();
    h.state.resolveDelete({ data: [], error: null });

    await expect(deleting).rejects.toMatchObject({
      code: 'campaign_delete_unconfirmed',
    });
    expect(campaigns.isDeleteReserved(CAMPAIGN_ID, 'owner-a')).toBe(false);
  });

  test('same-owner zero-row delete is idempotent after absence is proven', async () => {
    const deleting = campaigns.delete(CAMPAIGN_ID, 'owner-a', () => true);
    await waitForDeleteRequest();
    h.state.resolveDelete({ data: [], error: null });

    await expect(deleting).resolves.toBeNull();
  });
});
