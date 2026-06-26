import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

let auth;
let onAuthStateChange;
let single;

async function loadAuth(profileResult) {
  vi.resetModules();

  single = vi.fn().mockResolvedValue(profileResult);
  const eq = vi.fn(() => ({ single }));
  const select = vi.fn(() => ({ eq }));
  const from = vi.fn(() => ({ select }));

  // Capture the listener Supabase registers so the test can drive a
  // TOKEN_REFRESHED event the way an in-flight session would.
  onAuthStateChange = vi.fn((cb) => {
    onAuthStateChange.listener = cb;
    return { data: { subscription: { unsubscribe: vi.fn() } } };
  });

  vi.doMock('../../src/lib/supabase.js', () => ({
    isConfigured: true,
    supabase: {
      from,
      auth: { onAuthStateChange },
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

describe('onAuthChange preserves last-known tier on a transient refresh failure', () => {
  it('does NOT fire the callback when the profile read fails transiently', async () => {
    // A non-PGRST116 error on TOKEN_REFRESHED must not rebuild auth from
    // downgraded defaults. The old code fired the callback with free/user,
    // silently downgrading a premium/admin session on a momentary blip.
    await loadAuth({ error: { code: 'PGRST301', message: 'JWT expired' }, data: null });

    const callback = vi.fn();
    auth.onAuthChange(callback);

    await onAuthStateChange.listener('TOKEN_REFRESHED', SESSION);

    expect(callback).not.toHaveBeenCalled();
  });

  it('fires the callback with safe defaults when the user genuinely has no profile row', async () => {
    await loadAuth({ error: { code: 'PGRST116', message: '0 rows' }, data: null });

    const callback = vi.fn();
    auth.onAuthChange(callback);

    await onAuthStateChange.listener('TOKEN_REFRESHED', SESSION);

    expect(callback).toHaveBeenCalledTimes(1);
    // Signature: (event, user, session, tier, role, ...)
    const args = callback.mock.calls[0];
    expect(args[3]).toBe('free');
    expect(args[4]).toBe('user');
  });

  it('fires the callback with the real tier when the profile read succeeds', async () => {
    await loadAuth({
      error: null,
      data: { tier: 'premium', role: 'admin', is_founder: true },
    });

    const callback = vi.fn();
    auth.onAuthChange(callback);

    await onAuthStateChange.listener('TOKEN_REFRESHED', SESSION);

    expect(callback).toHaveBeenCalledTimes(1);
    const args = callback.mock.calls[0];
    expect(args[3]).toBe('premium');
    expect(args[4]).toBe('admin');
  });
});
