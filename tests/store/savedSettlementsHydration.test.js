/**
 * Production surface: authSlice/settlementSlice saved-settlement hydration tokens.
 *
 * Late owner-A, anonymous, and prior same-owner-session responses must not fill
 * the current cache. Current owner and anonymous hydrations are positive controls;
 * account/session boundaries leave the new owner's loaded flag false.
 */
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

vi.mock('../../src/lib/auth.js', () => ({
  auth: {
    getSession: vi.fn(),
    onAuthChange: vi.fn(() => () => {}),
    signUp: vi.fn(),
    signIn: vi.fn(),
  },
}));

import { auth as authService } from '../../src/lib/auth.js';
import { createAuthSlice } from '../../src/store/authSlice.js';
import { createSettlementSlice } from '../../src/store/settlementSlice.js';
import { captureSavedSettlementsHydration } from '../../src/store/savedSettlementsHydration.js';

function makeStore() {
  return create(immer((...args) => ({
    ...createSettlementSlice(...args),
    ...createAuthSlice(...args),
  })));
}

describe('saved-settlement hydration ownership', () => {
  let store;

  beforeEach(() => {
    store = makeStore();
  });

  test('a late response from the previous owner cannot populate the next owner cache', () => {
    store.getState().setAuth({ id: 'owner-A' }, {}, 'free', 'user');
    const staleA = captureSavedSettlementsHydration(store.getState(), 'owner-A');

    store.getState().setAuth({ id: 'owner-B' }, {}, 'free', 'user');
    expect(store.getState().savedSettlementsOwnerId).toBe('owner-B');
    expect(store.getState().savedSettlementsLoaded).toBe(false);

    expect(store.getState().setSavedSettlements([{ id: 'save-A' }], staleA)).toBe(false);
    expect(store.getState().savedSettlements).toEqual([]);
    expect(store.getState().savedSettlementsLoaded).toBe(false);

    const currentB = captureSavedSettlementsHydration(store.getState(), 'owner-B');
    expect(store.getState().setSavedSettlements([{ id: 'save-B' }], currentB)).toBe(true);
    expect(store.getState().savedSettlements).toEqual([{ id: 'save-B' }]);
    expect(store.getState().savedSettlementsLoaded).toBe(true);
  });

  test('the anonymous-to-account boundary invalidates an in-flight local load', () => {
    const anonymousLoad = captureSavedSettlementsHydration(store.getState(), null);

    store.getState().setAuth({ id: 'owner-A' }, {}, 'free', 'user');
    expect(store.getState().setSavedSettlements([{ id: 'anon-save' }], anonymousLoad)).toBe(false);
    expect(store.getState().savedSettlementsOwnerId).toBe('owner-A');
    expect(store.getState().savedSettlementsLoaded).toBe(false);
  });

  test('the direct sign-in success path establishes the owner before auth events arrive', async () => {
    const anonymousLoad = captureSavedSettlementsHydration(store.getState(), null);
    authService.signIn.mockResolvedValueOnce({
      user: { id: 'owner-A' },
      session: { access_token: 'token' },
      tier: 'free',
      role: 'user',
    });

    await store.getState().authSignIn('owner@example.test', 'password');

    expect(store.getState().savedSettlementsOwnerId).toBe('owner-A');
    expect(store.getState().setSavedSettlements([{ id: 'anon-save' }], anonymousLoad)).toBe(false);
  });

  test('the auto-confirmed sign-up path establishes the owner before auth events arrive', async () => {
    const anonymousLoad = captureSavedSettlementsHydration(store.getState(), null);
    authService.signUp.mockResolvedValueOnce({
      user: { id: 'owner-A' },
      session: { access_token: 'token' },
      tier: 'free',
      role: 'user',
      needsVerification: false,
    });

    await store.getState().authSignUp('owner@example.test', 'password');

    expect(store.getState().savedSettlementsOwnerId).toBe('owner-A');
    expect(store.getState().setSavedSettlements([{ id: 'anon-save' }], anonymousLoad)).toBe(false);
  });

  test('sign-out invalidates even a later response for the same account session', () => {
    store.getState().setAuth({ id: 'owner-A' }, {}, 'free', 'user');
    const priorSession = captureSavedSettlementsHydration(store.getState(), 'owner-A');

    store.getState().clearAuth();
    store.getState().setAuth({ id: 'owner-A' }, {}, 'free', 'user');

    expect(store.getState().setSavedSettlements([{ id: 'stale' }], priorSession)).toBe(false);
    expect(store.getState().savedSettlementsLoaded).toBe(false);
  });

  test('anonymous hydration still works and an ordinary clear preserves its owner', () => {
    const anonymousLoad = captureSavedSettlementsHydration(store.getState(), null);
    expect(store.getState().setSavedSettlements([{ id: 'local-save' }], anonymousLoad)).toBe(true);
    expect(store.getState().savedSettlementsLoaded).toBe(true);

    store.getState().clearSavedSettlements();
    expect(store.getState().savedSettlementsOwnerId).toBe(null);
    expect(store.getState().savedSettlementsLoaded).toBe(false);
    expect(store.getState().savedSettlements).toEqual([]);
  });
});
