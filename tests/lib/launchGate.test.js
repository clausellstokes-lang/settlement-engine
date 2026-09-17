/**
 * launchGate.test.js - purchases stay closed until the build opens them (the owner,
 * 2026-09-16: every purchase control shows "Available at launch" until launch).
 *
 * CLOSED UNLESS EXPLICITLY OPENED: only VITE_PURCHASES_OPEN === 'true' opens sales, so
 * a missing or misspelled environment variable can never take money early; and
 * startCheckout refuses FIRST while closed, before it touches Supabase or Stripe.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PURCHASES_CLOSED_CODE, purchasesClosedError, purchasesOpen } from '../../src/lib/launchGate.js';

describe('purchasesOpen: closed unless explicitly opened', () => {
  it('is open only for the exact string "true"', () => {
    expect(purchasesOpen({ VITE_PURCHASES_OPEN: 'true' })).toBe(true);
  });

  it('stays closed for a missing, empty, misspelled or truthy-looking value', () => {
    for (const value of [undefined, '', 'false', 'TRUE', 'True', '1', 'yes', ' true']) {
      expect(purchasesOpen({ VITE_PURCHASES_OPEN: value }), String(value)).toBe(false);
    }
    expect(purchasesOpen({})).toBe(false);
    expect(purchasesOpen(undefined)).toBe(false);
  });

  it('this test build (no VITE_PURCHASES_OPEN) is closed', () => {
    expect(purchasesOpen()).toBe(false);
  });

  it('the refusal carries its code and plain words', () => {
    const error = purchasesClosedError();
    expect(error.code).toBe(PURCHASES_CLOSED_CODE);
    expect(error.message).toBe('Purchases open at launch.');
  });
});

const invoke = vi.fn();
const getSession = vi.fn();
vi.mock('../../src/lib/supabase.js', () => ({
  isConfigured: true,
  supabase: { functions: { invoke: (...a) => invoke(...a) }, auth: { getSession: (...a) => getSession(...a) } },
}));

describe('startCheckout refuses while purchases are closed', () => {
  beforeEach(() => {
    invoke.mockReset();
    getSession.mockReset();
    getSession.mockResolvedValue({ data: { session: { access_token: 'x' } } });
  });

  it('throws the launch refusal before any session lookup or edge call', async () => {
    const { startCheckout } = await import('../../src/lib/stripe.js');
    await expect(startCheckout('premium')).rejects.toMatchObject({ code: PURCHASES_CLOSED_CODE });
    expect(getSession).toHaveBeenCalledTimes(0);
    expect(invoke).toHaveBeenCalledTimes(0);
  });

  it('CONTROL: with purchases opened by the build, the same call reaches the edge function', async () => {
    vi.resetModules();
    vi.doMock('../../src/lib/launchGate.js', async (orig) => ({ ...(await orig()), purchasesOpen: () => true }));
    invoke.mockResolvedValue({ data: { url: 'https://checkout.stripe.test/s' }, error: null });
    const originalLocation = globalThis.window;
    globalThis.window = { location: { href: '' } };
    try {
      const { startCheckout } = await import('../../src/lib/stripe.js');
      await startCheckout('premium');
      expect(invoke).toHaveBeenCalledWith('create-checkout', expect.objectContaining({ body: expect.objectContaining({ product: 'premium' }) }));
    } finally {
      globalThis.window = originalLocation;
      vi.doUnmock('../../src/lib/launchGate.js');
      vi.resetModules();
    }
  });
});
