import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

let auth;
let getSession;
let single;

async function loadAuth({ session, profileResult }) {
  vi.resetModules();

  single = vi.fn().mockResolvedValue(profileResult);
  const eq = vi.fn(() => ({ single }));
  const select = vi.fn(() => ({ eq }));
  const from = vi.fn(() => ({ select }));

  getSession = vi.fn().mockResolvedValue({ data: { session }, error: null });

  vi.doMock('../../src/lib/supabase.js', () => ({
    isConfigured: true,
    supabase: {
      from,
      auth: { getSession },
    },
  }));

  ({ auth } = await import('../../src/lib/auth.js'));
}

const SESSION = {
  access_token: 'token',
  user: { id: 'user-1', email: 'premium@example.com', user_metadata: {} },
};

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

afterEach(() => {
  vi.doUnmock('../../src/lib/supabase.js');
});

describe('getSession on a transient profile failure rejects rather than persisting a wrong tier', () => {
  it('REJECTS on a transient (non-PGRST116) profile read failure — no downgrade, no metadata-forge', async () => {
    // A non-PGRST116 error means the profile read failed transiently. getSession
    // PROPAGATES it rather than resolving with a fallback, because the only tier
    // sources available here are both WRONG: buildProfileResult(user,{}) is a
    // FREE/user DOWNGRADE of a premium/admin session, and the user-WRITABLE
    // user_metadata would let a user self-promote to premium. Rejecting lets
    // initAuth treat it as the retryable transient state it is — no false grant,
    // no silent downgrade persisted. (Logged-out-and-retry is the deliberate safe
    // failure; a later onAuthChange / retry restores the real tier.)
    await loadAuth({
      session: SESSION,
      profileResult: { error: { code: 'PGRST301', message: 'JWT expired' }, data: null },
    });

    await expect(auth.getSession()).rejects.toThrow();
  });

  it('returns null when there is no session at all', async () => {
    await loadAuth({ session: null, profileResult: { error: null, data: null } });
    const result = await auth.getSession();
    expect(result).toBeNull();
  });

  it('returns the real tier/role when the profile read succeeds', async () => {
    await loadAuth({
      session: SESSION,
      profileResult: { error: null, data: { tier: 'premium', role: 'admin', is_founder: true } },
    });

    const result = await auth.getSession();

    expect(result.tier).toBe('premium');
    expect(result.role).toBe('admin');
  });
});
