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
    expect(stubs.select).toHaveBeenCalledWith('role, display_name, tier, is_founder');
    expect(session.tier).toBe('free');
    expect(session.role).toBe('user');
    expect(session.isFounder).toBe(false);
    expect(session.displayName).toBe('Profile Name');
  });

  it('falls back to safe non-privileged grants when the profile read fails', async () => {
    await loadAuthWithProfile({
      error: { message: 'RLS denied' },
      data: null,
    });

    const session = await auth.getSession();

    expect(session.tier).toBe('free');
    expect(session.role).toBe('user');
    expect(session.isFounder).toBe(false);
    expect(session.displayName).toBe('Metadata Name');
  });
});
