/**
 * tests/store/authSliceOAuth.test.js — Phase A1 store wiring.
 *
 * Pins the auth slice's OAuth + sign-out behaviour against a mocked auth
 * service (lib/auth.js):
 *   • authOAuth('google'|'discord') dispatches to the matching named wrapper
 *     and, in mock mode, returns { mock } + leaves loading false.
 *   • a provider error (with a safe userMessage) surfaces as a thrown Error
 *     carrying the safe string AND lands in auth.error — never the raw,
 *     potentially-leaky provider message.
 *   • authSignOut calls the service signOut and clears the auth state to anon.
 *
 * The slice is built in isolation (createAuthSlice over a one-slice store),
 * mirroring uiSlice.test.js. lib/auth.js is mocked so no Supabase wiring loads.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

const signInWithGoogle = vi.fn();
const signInWithDiscord = vi.fn();
const signInWithOAuth = vi.fn();
const signOut = vi.fn().mockResolvedValue(undefined);

vi.mock('../../src/lib/auth.js', () => ({
  auth: {
    signInWithGoogle,
    signInWithDiscord,
    signInWithOAuth,
    signOut,
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

describe('authSlice — OAuth', () => {
  it('authOAuth("google") calls signInWithGoogle and short-circuits in mock mode', async () => {
    signInWithGoogle.mockResolvedValue({ data: { provider: 'google', mock: true }, error: null });
    const store = makeStore();

    const result = await store.getState().authOAuth('google');

    expect(signInWithGoogle).toHaveBeenCalledTimes(1);
    expect(signInWithDiscord).not.toHaveBeenCalled();
    expect(result.mock).toBe(true);
    // Mock mode leaves the UI usable (not stuck loading).
    expect(store.getState().auth.loading).toBe(false);
  });

  it('authOAuth("discord") routes to signInWithDiscord', async () => {
    signInWithDiscord.mockResolvedValue({ data: { provider: 'discord', mock: true }, error: null });
    const store = makeStore();

    await store.getState().authOAuth('discord');

    expect(signInWithDiscord).toHaveBeenCalledTimes(1);
    expect(signInWithGoogle).not.toHaveBeenCalled();
  });

  it('surfaces the safe userMessage (not the raw provider error) on conflict', async () => {
    signInWithGoogle.mockResolvedValue({
      data: null,
      error: {
        message: 'raw provider detail that must not leak',
        userMessage: 'This email is already registered. Sign in with your password instead.',
      },
    });
    const store = makeStore();

    await expect(store.getState().authOAuth('google')).rejects.toThrow(/already registered/i);
    expect(store.getState().auth.error).toMatch(/already registered/i);
    expect(store.getState().auth.error).not.toMatch(/raw provider detail/);
    expect(store.getState().auth.loading).toBe(false);
  });
});

describe('authSlice — sign out', () => {
  it('authSignOut calls the service and clears auth to anon', async () => {
    const store = makeStore();
    // Seed a signed-in state.
    store.getState().setAuth(
      { id: 'u1', email: 'a@b.c' }, { access_token: 't' }, 'premium', 'user', 'Tester'
    );
    expect(store.getState().auth.user).toBeTruthy();

    await store.getState().authSignOut();

    expect(signOut).toHaveBeenCalledTimes(1);
    expect(store.getState().auth.user).toBeNull();
    expect(store.getState().auth.session).toBeNull();
    expect(store.getState().auth.tier).toBe('anon');
    expect(store.getState().auth.role).toBe('user');
  });
});
