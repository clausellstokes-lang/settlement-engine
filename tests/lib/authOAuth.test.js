/**
 * tests/lib/authOAuth.test.js — OAuth wrapper wiring (Phase A1).
 *
 * Locks the contract for the new named wrappers `signInWithGoogle` /
 * `signInWithDiscord`:
 *   - they call supabase.auth.signInWithOAuth with the correct provider,
 *   - they pass a redirectTo on our OWN origin (so a tampered redirect can't
 *     bounce the user into an attacker-controlled callback),
 *   - they return the Supabase { data, error } shape (no throw),
 *   - the account-linking / provider-conflict error is mapped to a safe,
 *     non-leaky `error.userMessage`, and the back-compat generic entry still
 *     throws with that safe message.
 *
 * The existing password / magic-link / reset wrappers are NOT touched here —
 * authProfileSource.test.js continues to cover the session/profile path.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const ORIGIN = 'https://app.example.test';

let auth;
let signInWithOAuth;

async function loadAuth({ oauthResult } = {}) {
  vi.resetModules();

  signInWithOAuth = vi.fn().mockResolvedValue(
    oauthResult ?? { data: { provider: 'mock', url: `${ORIGIN}/redirect` }, error: null }
  );

  vi.doMock('../../src/lib/supabase.js', () => ({
    isConfigured: true,
    setSessionPersistence: vi.fn(),
    supabase: {
      auth: { signInWithOAuth },
    },
  }));

  ({ auth } = await import('../../src/lib/auth.js'));
}

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  // window.location.origin is read for redirectTo.
  vi.stubGlobal('window', { location: { origin: ORIGIN } });
});

afterEach(() => {
  vi.doUnmock('../../src/lib/supabase.js');
  vi.unstubAllGlobals();
});

describe('OAuth wrappers', () => {
  it('signInWithGoogle calls signInWithOAuth with provider google + our-origin redirect', async () => {
    await loadAuth();
    const result = await auth.signInWithGoogle();

    expect(signInWithOAuth).toHaveBeenCalledTimes(1);
    const arg = signInWithOAuth.mock.calls[0][0];
    expect(arg.provider).toBe('google');
    expect(arg.options.redirectTo).toBe(ORIGIN);
    // { data, error } shape, no throw.
    expect(result.error).toBeNull();
    expect(result.data).toBeTruthy();
  });

  it('signInWithDiscord calls signInWithOAuth with provider discord', async () => {
    await loadAuth();
    const result = await auth.signInWithDiscord();

    expect(signInWithOAuth).toHaveBeenCalledTimes(1);
    expect(signInWithOAuth.mock.calls[0][0].provider).toBe('discord');
    expect(signInWithOAuth.mock.calls[0][0].options.redirectTo).toBe(ORIGIN);
    expect(result.error).toBeNull();
  });

  it('maps an account-linking / already-registered conflict to a safe userMessage', async () => {
    await loadAuth({
      oauthResult: {
        data: null,
        error: { message: 'A user with this email address has already been registered' },
      },
    });
    const result = await auth.signInWithGoogle();

    expect(result.error).toBeTruthy();
    // The safe message nudges the user to their password path WITHOUT leaking
    // which provider owns the account.
    expect(result.error.userMessage).toMatch(/already registered/i);
    expect(result.error.userMessage).toMatch(/password/i);
    expect(result.error.userMessage).not.toMatch(/google|discord/i);
  });

  it('maps an unknown provider error to a generic, non-leaky message', async () => {
    await loadAuth({
      oauthResult: { data: null, error: { message: 'Unsupported provider: provider is not enabled' } },
    });
    const result = await auth.signInWithDiscord();

    expect(result.error.userMessage).toBe('Sign-in failed. Please try again.');
  });

  it('back-compat signInWithOAuth(provider) still throws with the safe message', async () => {
    await loadAuth({
      oauthResult: { data: null, error: { message: 'already registered' } },
    });
    await expect(auth.signInWithOAuth('google')).rejects.toThrow(/already registered/i);
  });
});
