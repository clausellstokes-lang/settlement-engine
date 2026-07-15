/**
 * tests/store/authSliceTokenRefreshIdentity.test.js — token-refresh blanks
 * account identity.
 *
 * The onAuthChange listener rebuilds auth.* from scratch on every SIGNED_IN /
 * TOKEN_REFRESHED event. Its callback signature stopped at modelPreference, so
 * the five account-identity fields (accountNumber / externalName / firstName /
 * lastName / preferredName) were never threaded through — and the rebuilt auth
 * dropped them. The lib/auth.js change-handler builds those fields off the
 * fresh profile but had no slot to deliver them. Net effect: a routine token
 * auto-refresh blanked the user's account number and author name until a full
 * profile reload re-populated them.
 *
 * The fix threads identity as an APPEND-ONLY trailing object through the
 * callback (matching setAuth's identity convention) and spreads it into the
 * rebuilt auth via identityFrom.
 *
 * These tests capture the REAL onAuthChange callback the slice registers, then
 * fire a synthetic TOKEN_REFRESHED carrying the trailing identity object and
 * assert the fields survive. They fail on the pre-fix slice (identity dropped).
 *
 * Built in isolation over a one-slice store, mirroring
 * authSliceSignInResolveTier.test.js; lib/auth.js is mocked.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// Capture the callback the slice hands to onAuthChange so the test can drive
// real auth-change events through the real reducer.
let changeCb = null;
const onAuthChange = vi.fn((cb) => { changeCb = cb; return () => {}; });
const getSession = vi.fn().mockResolvedValue(null);

vi.mock('../../src/lib/auth.js', () => ({
  auth: {
    onAuthChange,
    getSession,
  },
}));

let createAuthSlice;

const makeStore = () => create(immer((...a) => ({ ...createAuthSlice(...a) })));

beforeEach(async () => {
  vi.clearAllMocks();
  changeCb = null;
  getSession.mockResolvedValue(null);
  ({ createAuthSlice } = await import('../../src/store/authSlice.js'));
});

describe('authSlice — token refresh preserves account identity', () => {
  it('a TOKEN_REFRESHED event keeps accountNumber/externalName/name parts', async () => {
    const store = makeStore();
    await store.getState().initAuth();
    expect(typeof changeCb).toBe('function');

    // Simulate Supabase auto-refreshing the access token. The change handler
    // re-fetches the profile and forwards identity as the trailing object.
    changeCb(
      'TOKEN_REFRESHED',
      { id: 'u1', email: 'u@b.c' },
      { access_token: 't2' },
      'free', 'user', 'Display', false, null, true, 'claude',
      {
        accountNumber: 'SF-000123',
        externalName: 'cartographer',
        firstName: 'Ada',
        lastName: 'Lovelace',
        preferredName: 'Ada',
      },
    );

    const { auth } = store.getState();
    // The load-bearing assertions: identity survives the rebuild.
    expect(auth.accountNumber).toBe('SF-000123');
    expect(auth.externalName).toBe('cartographer');
    expect(auth.firstName).toBe('Ada');
    expect(auth.lastName).toBe('Lovelace');
    expect(auth.preferredName).toBe('Ada');
    // And the rest of the session rebuilt correctly.
    expect(auth.user.id).toBe('u1');
    expect(auth.session.access_token).toBe('t2');
  });

  it('a genuine user SWITCH adopts the new account identity, not the stale one', async () => {
    const store = makeStore();
    await store.getState().initAuth();

    // First user signs in with their identity.
    changeCb(
      'SIGNED_IN',
      { id: 'userA', email: 'a@b.c' },
      { access_token: 'tA' },
      'free', 'user', null, false, null, true, 'claude',
      { accountNumber: 'SF-000001', externalName: 'alpha', firstName: 'A', lastName: null, preferredName: null },
    );
    expect(store.getState().auth.accountNumber).toBe('SF-000001');

    // A different user signs in on the same browser — identity must follow the
    // NEW profile, never bleed through from userA.
    changeCb(
      'SIGNED_IN',
      { id: 'userB', email: 'b@b.c' },
      { access_token: 'tB' },
      'free', 'user', null, false, null, true, 'claude',
      { accountNumber: 'SF-000002', externalName: 'beta', firstName: 'B', lastName: null, preferredName: null },
    );

    const { auth } = store.getState();
    expect(auth.accountNumber).toBe('SF-000002');
    expect(auth.externalName).toBe('beta');
    expect(auth.accountNumber).not.toBe('SF-000001');
  });

  it('an event with no identity object (mock mode) falls back to all-null, not a crash', async () => {
    const store = makeStore();
    await store.getState().initAuth();

    // identityFrom must be null-safe when the trailing object is omitted.
    expect(() => changeCb(
      'TOKEN_REFRESHED',
      { id: 'u3', email: 'u3@b.c' },
      { access_token: 't' },
      'free', 'user', null, false, null, true, 'claude',
    )).not.toThrow();

    const { auth } = store.getState();
    expect(auth.accountNumber).toBeNull();
    expect(auth.externalName).toBeNull();
  });

  it('an event with a literal NULL identity (lib/auth.js no-session branch) does not crash', async () => {
    const store = makeStore();
    await store.getState().initAuth();

    // lib/auth.js passes `null` (not undefined) as the trailing identity on its
    // no-session branch; a default param only covers undefined, so identityFrom
    // must coalesce null too or this throws a null-deref.
    expect(() => changeCb(
      'TOKEN_REFRESHED',
      { id: 'u4', email: 'u4@b.c' },
      { access_token: 't' },
      'free', 'user', null, false, null, true, 'claude',
      null,
    )).not.toThrow();

    const { auth } = store.getState();
    expect(auth.accountNumber).toBeNull();
    expect(auth.preferredName).toBeNull();
  });
});
