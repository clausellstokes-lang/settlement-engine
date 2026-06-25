import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

let auth;
let signInWithOtp;

async function loadAuth() {
  vi.resetModules();
  signInWithOtp = vi.fn().mockResolvedValue({ error: null });

  vi.doMock('../../src/lib/supabase.js', () => ({
    isConfigured: true,
    supabase: {
      auth: { signInWithOtp },
    },
  }));

  ({ auth } = await import('../../src/lib/auth.js'));
}

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  // The magic-link redirect reads window.location.origin; provide it under the
  // node test env.
  vi.stubGlobal('window', { location: { origin: 'https://app.test' } });
});

afterEach(() => {
  vi.doUnmock('../../src/lib/supabase.js');
  vi.unstubAllGlobals();
});

describe('magic-link sign-in does not mint passwordless accounts', () => {
  it('passes shouldCreateUser:false on the sign-IN surface', async () => {
    await loadAuth();

    await auth.signInWithMagicLink('user@example.com');

    expect(signInWithOtp).toHaveBeenCalledTimes(1);
    const [arg] = signInWithOtp.mock.calls[0];
    // The sign-IN path must NOT create a user — that would forge a passwordless
    // account that can never use a password. Only the sign-UP flow creates.
    expect(arg.options.shouldCreateUser).toBe(false);
  });
});
