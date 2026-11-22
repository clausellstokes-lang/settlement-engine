import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('../../src/lib/auth.js', () => ({
  auth: {
    getSession: vi.fn(),
    onAuthChange: vi.fn(() => () => {}),
  },
}));
vi.mock('../../src/lib/sessionClient.js', () => ({
  startValidation: vi.fn(() => () => {}),
}));

import { createStore } from 'zustand/vanilla';
import { immer } from 'zustand/middleware/immer';
import { auth as authService } from '../../src/lib/auth.js';
import { createAuthSlice } from '../../src/store/authSlice.js';
import { createCampaignSlice } from '../../src/store/campaignSliceEntry.js';
import { CAMPAIGN_REPORTING_LEASE } from '../../src/store/campaignEntryReporting.js';
import {
  activateOutboxOwner,
  enqueue,
  resetOutbox,
} from '../../src/store/outbox.js';

function installLocalStorage() {
  const data = new Map();
  globalThis.localStorage = {
    getItem: key => data.get(String(key)) ?? null,
    setItem: (key, value) => { data.set(String(key), String(value)); },
    removeItem: key => { data.delete(String(key)); },
  };
}

function realStore() {
  return createStore(immer((set, get) => ({
    ...createAuthSlice(set, get),
    // Inject a no-op signature clearer so this real-store test exercises the
    // actual owner-boundary campaign reset without starting a lazy import.
    ...createCampaignSlice(set, get, () => {}),
  })));
}

function queueOne(saveId) {
  enqueue({
    saveId,
    kind: 'data',
    payload: { settlement: { name: saveId } },
    fingerprint: saveId,
  });
}

describe('campaign reporter owner isolation', () => {
  const stores = [];

  beforeEach(() => {
    vi.clearAllMocks();
    installLocalStorage();
    resetOutbox();
  });

  afterEach(() => {
    for (const store of stores.splice(0)) {
      store.getState()[CAMPAIGN_REPORTING_LEASE]?.dispose();
    }
    resetOutbox();
    delete globalThis.localStorage;
  });

  test('sign-out and A-to-B transitions cannot retain the prior owner status', () => {
    const store = realStore();
    stores.push(store);

    store.getState().setAuth(
      { id: 'owner-a' },
      { access_token: 'session-a' },
      'free',
      'user',
    );
    queueOne('owner-a-save');
    store.setState(state => { state.campaignSyncError = 'owner A failed'; });
    expect(store.getState().outboxStatus).toEqual({ queued: 1, failed: 0, inflight: 0 });

    store.getState().clearAuth();
    expect(store.getState().auth.tier).toBe('anon');
    expect(store.getState().outboxStatus).toEqual({ queued: 0, failed: 0, inflight: 0 });
    expect(store.getState().campaignSyncError).toBeNull();

    store.getState().setAuth(
      { id: 'owner-a' },
      { access_token: 'session-a-2' },
      'free',
      'user',
    );
    expect(store.getState().outboxStatus).toEqual({ queued: 1, failed: 0, inflight: 0 });
    store.setState(state => { state.campaignSyncError = 'owner A failed again'; });

    store.getState().setAuth(
      { id: 'owner-b' },
      { access_token: 'session-b' },
      'free',
      'user',
    );
    expect(store.getState().auth.user.id).toBe('owner-b');
    expect(store.getState().outboxStatus).toEqual({ queued: 0, failed: 0, inflight: 0 });
    expect(store.getState().campaignSyncError).toBeNull();
  });

  test('a different-owner store never receives the active owner queue', () => {
    const ownerA = realStore();
    const ownerB = realStore();
    stores.push(ownerA, ownerB);

    ownerB.setState(state => {
      state.auth = {
        ...state.auth,
        user: { id: 'owner-b' },
        tier: 'free',
        loading: false,
      };
    });
    ownerA.getState().setAuth(
      { id: 'owner-a' },
      { access_token: 'session-a' },
      'free',
      'user',
    );
    queueOne('owner-a-only');

    expect(ownerA.getState().outboxStatus).toEqual({ queued: 1, failed: 0, inflight: 0 });
    expect(ownerB.getState().outboxStatus).toEqual({ queued: 0, failed: 0, inflight: 0 });

    // Same-owner refreshes are deliberate status publications, not no-ops.
    activateOutboxOwner('owner-a');
    expect(ownerA.getState().outboxStatus).toEqual({ queued: 1, failed: 0, inflight: 0 });
    expect(ownerB.getState().outboxStatus).toEqual({ queued: 0, failed: 0, inflight: 0 });
  });

  test('an initAuth rerun with no session commits a full A-to-anon boundary', async () => {
    const store = realStore();
    stores.push(store);
    store.getState().setAuth(
      { id: 'owner-a' },
      { access_token: 'session-a' },
      'free',
      'user',
    );
    queueOne('owner-a-before-null-session');
    store.setState(state => { state.campaignSyncError = 'owner A failed'; });
    authService.getSession.mockResolvedValueOnce(null);

    const teardown = await store.getState().initAuth();

    expect(store.getState().auth).toMatchObject({
      user: null,
      session: null,
      tier: 'anon',
      loading: false,
    });
    expect(store.getState().campaignSyncError).toBeNull();
    expect(store.getState().outboxStatus).toEqual({ queued: 0, failed: 0, inflight: 0 });
    teardown();
  });
});
