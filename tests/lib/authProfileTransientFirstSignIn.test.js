import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * tests/lib/authProfileTransientFirstSignIn.test.js — a transient profile
 * failure on a ONE-SHOT OAuth / magic-link SIGNED_IN (no prior session to
 * preserve) must not drop a user who genuinely just authenticated.
 *
 * The earlier transient guard (authProfileTransientRefresh) covered the REFRESH
 * path: on a non-PGRST116 failure the listener skips the event so the store
 * keeps its last-known tier. But the first SIGNED_IN has NO last-known session
 * to keep — skipping there leaves the just-authenticated user appearing logged
 * out with no recovery.
 *
 * The fix retries the profile read a bounded number of times before giving up,
 * so a momentary blip (RLS warm-up, 5xx, network) clears and the callback fires
 * with the REAL, server-authoritative tier — never the writable user_metadata,
 * never a fabricated free downgrade. Only a sustained outage falls through to
 * the deliberate skip.
 *
 * These tests fail on the pre-fix listener (single attempt → permanent skip).
 */

let auth;
let onAuthStateChange;
let single;

async function loadAuth(singleImpl) {
  vi.resetModules();

  single = vi.fn(singleImpl);
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
}

const SESSION = {
  access_token: 'token',
  user: { id: 'user-1', email: 'premium@example.com', user_metadata: {} },
};

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  // Collapse the backoff so the bounded retry runs without real delay.
  vi.spyOn(global, 'setTimeout').mockImplementation((fn) => { fn(); return 0; });
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.doUnmock('../../src/lib/supabase.js');
});

describe('SIGNED_IN with a transient profile failure recovers via bounded retry', () => {
  it('retries and fires the callback with the REAL tier when a later attempt succeeds', async () => {
    // First read fails transiently; the second succeeds with the real profile.
    // The pre-fix listener tried exactly once and skipped → callback never fired,
    // dropping the just-signed-in user.
    let call = 0;
    await loadAuth(async () => {
      call += 1;
      if (call === 1) return { error: { code: 'PGRST301', message: 'JWT expired' }, data: null };
      return { error: null, data: { tier: 'premium', role: 'admin', is_founder: true } };
    });

    const callback = vi.fn();
    auth.onAuthChange(callback);

    await onAuthStateChange.listener('SIGNED_IN', SESSION);

    expect(callback).toHaveBeenCalledTimes(1);
    const args = callback.mock.calls[0];
    // Signature: (event, user, session, tier, role, ...)
    expect(args[0]).toBe('SIGNED_IN');
    expect(args[3]).toBe('premium'); // real tier from profiles, not a downgrade
    expect(args[4]).toBe('admin');
    expect(single.mock.calls.length).toBeGreaterThan(1); // proof it retried
  });

  it('skips (deliberate safe failure) only after every retry attempt is exhausted', async () => {
    // A SUSTAINED outage: every attempt fails. With no secure non-downgrading
    // tier available, the documented safe failure is logged-out-and-retry — the
    // listener must not fabricate a tier from writable metadata or a free
    // downgrade, so it fires nothing.
    await loadAuth(async () => ({ error: { code: 'PGRST301', message: 'JWT expired' }, data: null }));

    const callback = vi.fn();
    auth.onAuthChange(callback);

    await onAuthStateChange.listener('SIGNED_IN', SESSION);

    expect(callback).not.toHaveBeenCalled();
    // It genuinely re-attempted rather than giving up on the first failure.
    expect(single.mock.calls.length).toBeGreaterThan(1);
  });

  it('fires immediately on a first-try success (retry adds no extra reads on the happy path)', async () => {
    await loadAuth(async () => ({ error: null, data: { tier: 'premium', role: 'admin', is_founder: true } }));

    const callback = vi.fn();
    auth.onAuthChange(callback);

    await onAuthStateChange.listener('SIGNED_IN', SESSION);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(single).toHaveBeenCalledTimes(1);
    expect(callback.mock.calls[0][3]).toBe('premium');
  });

  it('a genuine no-profile (PGRST116) still fires once with safe defaults — no needless retry storm', async () => {
    // PGRST116 means "no row yet", which fetchProfileAuth resolves to safe
    // defaults rather than throwing — so it must NOT trigger the transient retry.
    await loadAuth(async () => ({ error: { code: 'PGRST116', message: '0 rows' }, data: null }));

    const callback = vi.fn();
    auth.onAuthChange(callback);

    await onAuthStateChange.listener('SIGNED_IN', SESSION);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback.mock.calls[0][3]).toBe('free');
    expect(callback.mock.calls[0][4]).toBe('user');
    expect(single).toHaveBeenCalledTimes(1); // resolved, not retried
  });
});
