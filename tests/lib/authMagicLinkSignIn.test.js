import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

let auth;
let signInWithOtp;

async function loadAuth(otpResult = { error: null }) {
  vi.resetModules();
  signInWithOtp = vi.fn().mockResolvedValue(otpResult);

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

describe('magic-link sign-in does not leak account existence', () => {
  // With shouldCreateUser:false, a no-account/OTP-disabled email returns an
  // error that — if thrown — distinguishes a real account (success) from a
  // missing one (error). That difference is an enumeration oracle. Each
  // no-account error class must resolve with the SAME success shape as a real
  // send so the caller can't tell the two apart.
  const SUCCESS = { sentTo: 'probe@example.com' };

  it('resolves success-shaped on the otp_disabled code (no account)', async () => {
    await loadAuth({ error: { code: 'otp_disabled', status: 422, message: 'Signups not allowed for otp' } });
    await expect(auth.signInWithMagicLink('probe@example.com')).resolves.toEqual(SUCCESS);
  });

  it('resolves success-shaped on a "user not found" message', async () => {
    await loadAuth({ error: { code: 'user_not_found', status: 400, message: 'User not found' } });
    await expect(auth.signInWithMagicLink('probe@example.com')).resolves.toEqual(SUCCESS);
  });

  it('resolves success-shaped for a genuinely existing account (same shape)', async () => {
    await loadAuth({ error: null });
    await expect(auth.signInWithMagicLink('probe@example.com')).resolves.toEqual(SUCCESS);
  });

  it('still throws on a non-existence failure (rate limit) — not an oracle', async () => {
    await loadAuth({ error: { code: 'over_email_send_rate_limit', status: 429, message: 'rate limited' } });
    await expect(auth.signInWithMagicLink('probe@example.com')).rejects.toBeTruthy();
  });
});
