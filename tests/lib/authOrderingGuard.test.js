import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

let auth;
let onAuthStateChange;

// Build an auth module whose profile read is a deferred promise we resolve by
// hand, so a test can order an OLDER event's resolution AFTER a NEWER event.
async function loadAuth(profileResultFor) {
  vi.resetModules();

  // `single` returns a promise the test controls per invocation, keyed by the
  // authenticating user's id so the older/newer events can resolve out of order.
  const single = vi.fn(() => {
    const deferred = {};
    deferred.promise = new Promise((resolve) => { deferred.resolve = resolve; });
    single.pending.push(deferred);
    return deferred.promise;
  });
  single.pending = [];

  const eq = vi.fn(() => ({ single }));
  const select = vi.fn(() => ({ eq }));
  const from = vi.fn(() => ({ select }));

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
  return { single, profileResultFor };
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

describe('onAuthChange sequence guard against out-of-order application', () => {
  it('drops a stale older-event profile resolution that lands after a newer event', async () => {
    const { single } = await loadAuth();

    const callback = vi.fn();
    auth.onAuthChange(callback);

    // Older event (e.g. TOKEN_REFRESHED): its profile fetch is in flight.
    const older = onAuthStateChange.listener('TOKEN_REFRESHED', SESSION);
    expect(single.pending.length).toBe(1);

    // A newer event begins before the older one's fetch resolves. Give it a
    // signed-out session so it takes the synchronous else branch and applies
    // immediately (bumping the sequence counter).
    await onAuthStateChange.listener('SIGNED_OUT', { user: null });

    // The newer SIGNED_OUT applied once, with null user.
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback.mock.calls[0][1]).toBe(null);

    // Now the OLDER event's profile finally resolves — signed-in profile.
    single.pending[0].resolve({
      error: null,
      data: { tier: 'premium', role: 'admin', is_founder: true },
    });
    await older;

    // The stale resolution must be a no-op: no second (resurrecting) callback.
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback.mock.calls[0][1]).toBe(null);
  });

  it('applies normally when no newer event intervenes (happy path unchanged)', async () => {
    const { single } = await loadAuth();

    const callback = vi.fn();
    auth.onAuthChange(callback);

    const evt = onAuthStateChange.listener('TOKEN_REFRESHED', SESSION);
    single.pending[0].resolve({
      error: null,
      data: { tier: 'premium', role: 'admin', is_founder: true },
    });
    await evt;

    expect(callback).toHaveBeenCalledTimes(1);
    const args = callback.mock.calls[0];
    expect(args[3]).toBe('premium');
    expect(args[4]).toBe('admin');
  });
});
