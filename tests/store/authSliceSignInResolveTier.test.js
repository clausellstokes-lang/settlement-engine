/**
 * tests/store/authSliceSignInResolveTier.test.js — auth tier-resolution bug.
 *
 * authSignIn was the ONLY one of five tier-assignment sites (the others:
 * setAuth, initAuth's getSession path, the onAuthChange listener, and
 * authSignUp) that wrote `result.tier` RAW into auth.tier instead of routing
 * it through resolveTier(result.tier, result.role).
 *
 * Elevated roles (admin / developer) carry a perpetual Cartographer (premium)
 * status regardless of the billing tier their profile reports — resolveTier
 * overrides the billing tier to 'premium' for those roles. Because authSignIn
 * skipped resolveTier, an admin/developer signing in by password read
 * auth.tier as their RAW billing tier (e.g. 'free') until a TOKEN_REFRESHED
 * event self-healed it via the listener. Any UI consulting
 * `auth.tier === 'premium'` (e.g. isPremium()) rendered the wrong state in
 * that window.
 *
 * These tests drive the REAL authSignIn action over a mocked auth service and
 * assert the resolved tier is applied IMMEDIATELY on sign-in. They fail if the
 * fix is reverted (raw 'free' would leak through for elevated roles).
 *
 * Built in isolation over a one-slice store, mirroring authSliceOAuth.test.js;
 * lib/auth.js is mocked so no Supabase wiring loads.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

const signIn = vi.fn();

vi.mock('../../src/lib/auth.js', () => ({
  auth: {
    signIn,
    onAuthChange: () => () => {},
    getSession: vi.fn().mockResolvedValue(null),
  },
}));

let createAuthSlice;

const makeStore = () => create(immer((...a) => ({ ...createAuthSlice(...a) })));

beforeEach(async () => {
  vi.clearAllMocks();
  ({ createAuthSlice } = await import('../../src/store/authSlice.js'));
});

describe('authSlice — authSignIn resolves the tier for elevated roles', () => {
  it('an admin signing in (raw billing tier "free") reads auth.tier "premium" immediately', async () => {
    // The profile's billing tier is 'free' — admins never pay, so resolveTier
    // must override it to 'premium' the moment the sign-in resolves, not after
    // a later token refresh.
    signIn.mockResolvedValue({
      user: { id: 'admin1', email: 'admin@b.c' },
      session: { access_token: 't' },
      tier: 'free',
      role: 'admin',
      displayName: 'Admin',
    });
    const store = makeStore();

    await store.getState().authSignIn('admin@b.c', 'pw');

    expect(store.getState().auth.role).toBe('admin');
    // The load-bearing assertion: resolved, not raw.
    expect(store.getState().auth.tier).toBe('premium');
    expect(store.getState().auth.tier).not.toBe('free');
    // And the derived gate agrees right away — no refresh needed.
    expect(store.getState().isPremium()).toBe(true);
  });

  it('a developer signing in (raw billing tier "free") reads auth.tier "premium" immediately', async () => {
    signIn.mockResolvedValue({
      user: { id: 'dev1', email: 'dev@b.c' },
      session: { access_token: 't' },
      tier: 'free',
      role: 'developer',
    });
    const store = makeStore();

    await store.getState().authSignIn('dev@b.c', 'pw');

    expect(store.getState().auth.role).toBe('developer');
    expect(store.getState().auth.tier).toBe('premium');
    expect(store.getState().isPremium()).toBe(true);
  });

  it('a plain user signing in keeps their real billing tier (resolveTier passes it through)', async () => {
    // Regression guard the other direction: resolveTier must NOT mutate a
    // non-elevated user's tier — a free user stays free, a premium user stays
    // premium.
    signIn.mockResolvedValue({
      user: { id: 'u1', email: 'u@b.c' },
      session: { access_token: 't' },
      tier: 'free',
      role: 'user',
    });
    const store = makeStore();

    await store.getState().authSignIn('u@b.c', 'pw');

    expect(store.getState().auth.role).toBe('user');
    expect(store.getState().auth.tier).toBe('free');
    expect(store.getState().isPremium()).toBe(false);
  });

  it('a missing role/tier from the service still resolves to safe defaults', async () => {
    // resolveTier(undefined, undefined) -> 'free'; role defaults to 'user'.
    signIn.mockResolvedValue({
      user: { id: 'u2', email: 'u2@b.c' },
      session: { access_token: 't' },
    });
    const store = makeStore();

    await store.getState().authSignIn('u2@b.c', 'pw');

    expect(store.getState().auth.role).toBe('user');
    expect(store.getState().auth.tier).toBe('free');
  });
});
