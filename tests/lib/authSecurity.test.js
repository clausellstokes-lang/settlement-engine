/**
 * tests/lib/authSecurity.test.js — Phase A2 Login & Security service wiring.
 *
 * Locks the contract for the new auth-service security methods, all against a
 * mocked Supabase client (no real network):
 *   • changePassword re-authenticates with the CURRENT password first, then
 *     calls updateUser({ password }). A wrong current password throws a single,
 *     generic message and never reaches updateUser.
 *   • getIdentities returns the identities array (and degrades to [] on error).
 *   • linkIdentity / unlinkIdentity dispatch to the matching Supabase calls.
 *   • signOutEverywhere calls signOut({ scope: 'global' }).
 *
 * isConfigured:true selects the Supabase-backed code paths (not the mocks).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const ORIGIN = 'https://app.example.test';

let auth;
let getUser, signInWithPassword, updateUser, getUserIdentities, linkIdentity, unlinkIdentity, signOut;

async function loadAuth() {
  vi.resetModules();

  getUser = vi.fn().mockResolvedValue({ data: { user: { id: 'u1', email: 'me@example.test' } } });
  signInWithPassword = vi.fn().mockResolvedValue({ data: {}, error: null });
  updateUser = vi.fn().mockResolvedValue({ data: {}, error: null });
  getUserIdentities = vi.fn().mockResolvedValue({ data: { identities: [{ id: 'g', provider: 'google' }] }, error: null });
  linkIdentity = vi.fn().mockResolvedValue({ data: { url: `${ORIGIN}/link` }, error: null });
  unlinkIdentity = vi.fn().mockResolvedValue({ error: null });
  signOut = vi.fn().mockResolvedValue({ error: null });

  vi.doMock('../../src/lib/supabase.js', () => ({
    isConfigured: true,
    setSessionPersistence: vi.fn(),
    supabase: {
      auth: { getUser, signInWithPassword, updateUser, getUserIdentities, linkIdentity, unlinkIdentity, signOut },
    },
  }));

  ({ auth } = await import('../../src/lib/auth.js'));
}

beforeEach(async () => {
  vi.resetModules();
  vi.clearAllMocks();
  vi.stubGlobal('window', { location: { origin: ORIGIN } });
  await loadAuth();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('auth.changePassword — re-auth gated', () => {
  it('re-authenticates with the current password, then updates', async () => {
    await auth.changePassword({ currentPassword: 'old-pass', newPassword: 'new-pass-123' });

    expect(signInWithPassword).toHaveBeenCalledTimes(1);
    expect(signInWithPassword).toHaveBeenCalledWith({ email: 'me@example.test', password: 'old-pass' });
    expect(updateUser).toHaveBeenCalledTimes(1);
    expect(updateUser).toHaveBeenCalledWith({ password: 'new-pass-123' });
    // re-auth happened before the update.
    expect(signInWithPassword.mock.invocationCallOrder[0]).toBeLessThan(updateUser.mock.invocationCallOrder[0]);
  });

  it('a wrong current password throws a generic error and never updates', async () => {
    signInWithPassword.mockResolvedValue({ data: {}, error: { message: 'Invalid login credentials' } });

    await expect(auth.changePassword({ currentPassword: 'wrong', newPassword: 'whatever-123' }))
      .rejects.toThrow(/re-authentication failed/i);

    // Generic — must NOT leak the raw provider detail.
    await auth.changePassword({ currentPassword: 'wrong', newPassword: 'whatever-123' }).catch((e) => {
      expect(e.message).not.toMatch(/invalid login credentials/i);
    });
    expect(updateUser).not.toHaveBeenCalled();
  });
});

describe('auth.getIdentities', () => {
  it('returns the identities array', async () => {
    const list = await auth.getIdentities();
    expect(list).toEqual([{ id: 'g', provider: 'google' }]);
  });

  it('degrades to [] on error', async () => {
    getUserIdentities.mockResolvedValue({ data: null, error: { message: 'boom' } });
    expect(await auth.getIdentities()).toEqual([]);
  });
});

describe('auth.linkIdentity / unlinkIdentity', () => {
  it('linkIdentity dispatches to supabase.auth.linkIdentity with our origin redirect', async () => {
    await auth.linkIdentity('discord');
    expect(linkIdentity).toHaveBeenCalledTimes(1);
    const arg = linkIdentity.mock.calls[0][0];
    expect(arg.provider).toBe('discord');
    expect(arg.options.redirectTo).toBe(ORIGIN);
  });

  it('unlinkIdentity dispatches to supabase.auth.unlinkIdentity', async () => {
    const identity = { provider: 'google', identity_id: 'g' };
    await auth.unlinkIdentity(identity);
    expect(unlinkIdentity).toHaveBeenCalledWith(identity);
  });

  it('unlink failure surfaces a safe "keep one method" message', async () => {
    unlinkIdentity.mockResolvedValue({ error: { message: 'last identity' } });
    await expect(auth.unlinkIdentity({ provider: 'google' })).rejects.toThrow(/at least one sign-in method/i);
  });
});

describe('auth.signOutEverywhere', () => {
  it('calls signOut with global scope', async () => {
    await auth.signOutEverywhere();
    expect(signOut).toHaveBeenCalledTimes(1);
    expect(signOut).toHaveBeenCalledWith({ scope: 'global' });
  });
});
