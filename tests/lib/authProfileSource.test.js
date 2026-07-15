import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

let auth;
let stubs;

async function loadAuthWithProfile(profileResult) {
  vi.resetModules();

  const single = vi.fn().mockResolvedValue(profileResult);
  const eq = vi.fn(() => ({ single }));
  const select = vi.fn(() => ({ eq }));
  const from = vi.fn(() => ({ select }));

  stubs = {
    from,
    select,
    eq,
    single,
    getSession: vi.fn().mockResolvedValue({
      error: null,
      data: {
        session: {
          access_token: 'token',
          user: {
            id: 'user-1',
            email: 'user@example.com',
            user_metadata: {
              tier: 'premium',
              role: 'developer',
              is_founder: true,
              display_name: 'Metadata Name',
            },
          },
        },
      },
    }),
  };

  vi.doMock('../../src/lib/supabase.js', () => ({
    isConfigured: true,
    supabase: {
      from,
      auth: {
        getSession: stubs.getSession,
      },
    },
  }));

  ({ auth } = await import('../../src/lib/auth.js'));
}

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

afterEach(() => {
  vi.doUnmock('../../src/lib/supabase.js');
});

describe('auth profile source of truth', () => {
  it('uses profiles tier/role/founder over spoofable user_metadata', async () => {
    await loadAuthWithProfile({
      error: null,
      data: {
        tier: 'free',
        role: 'user',
        display_name: 'Profile Name',
        is_founder: false,
      },
    });

    const session = await auth.getSession();

    expect(stubs.from).toHaveBeenCalledWith('profiles');
    expect(stubs.select).toHaveBeenCalledWith('role, display_name, tier, is_founder, avatar_url, email_notifications, model_preference, email, account_number, external_name, first_name, last_name, preferred_name');
    expect(session.tier).toBe('free');
    expect(session.role).toBe('user');
    expect(session.isFounder).toBe(false);
    expect(session.displayName).toBe('Profile Name');
  });

  it('falls back to safe non-privileged grants when the user has no profile row (PGRST116)', async () => {
    // PostgREST .single() with no match → genuinely no profile yet; safe
    // defaults are correct here (never trust user_metadata for tier/role).
    await loadAuthWithProfile({
      error: { code: 'PGRST116', message: 'Results contain 0 rows' },
      data: null,
    });

    const session = await auth.getSession();

    expect(session.tier).toBe('free');
    expect(session.role).toBe('user');
    expect(session.isFounder).toBe(false);
    expect(session.displayName).toBe('Metadata Name');
  });

  it('does NOT downgrade a premium/admin session on a transient profile read failure', async () => {
    // A non-PGRST116 error (RLS blip, 5xx, network) is transient. The old code
    // failed the `!error && data` guard and rebuilt the session at free/user —
    // silently downgrading a premium/admin user mid-flight (and on every token
    // refresh). The fix surfaces the failure so the caller preserves the
    // last-known session instead of overwriting it with a downgrade.
    await loadAuthWithProfile({
      error: { code: 'PGRST301', message: 'JWT expired' },
      data: null,
    });

    await expect(auth.getSession()).rejects.toThrow();
  });
});
