import { describe, it, expect, vi } from 'vitest';
import {
  reconcileCheckout,
  isCreditProduct,
  isPremiumProduct,
  OUTCOME,
} from '../../src/lib/checkoutReconcile.js';

// No real timers: sleep resolves immediately so the poll loop runs synchronously.
const noSleep = () => Promise.resolve();

function baseDeps(overrides = {}) {
  return {
    verifySession: vi.fn().mockResolvedValue({ verified: true }),
    sleep: noSleep,
    attempts: 4,
    ...overrides,
  };
}

describe('product classification', () => {
  it('recognizes credit packs', () => {
    expect(isCreditProduct('credits_25')).toBe(true);
    expect(isCreditProduct('credits_150')).toBe(true);
    expect(isCreditProduct('premium')).toBe(false);
  });
  it('recognizes premium products', () => {
    expect(isPremiumProduct('premium')).toBe(true);
    expect(isPremiumProduct('founder_lifetime')).toBe(true);
    expect(isPremiumProduct('credits_25')).toBe(false);
  });
});

describe('credit reconciliation', () => {
  it('SUCCESS when the balance rises above the baseline; fires onEntitlement', async () => {
    const onEntitlement = vi.fn();
    const onCreditBalance = vi.fn();
    let bal = 3;
    const deps = baseDeps({
      baselineBalance: 3,
      fetchCreditBalance: vi.fn().mockImplementation(() => { bal += 10; return Promise.resolve(bal); }),
      onCreditBalance,
      onEntitlement,
    });
    const out = await reconcileCheckout({ product: 'credits_25', sessionId: 'cs_test_a' }, deps);
    expect(out.outcome).toBe(OUTCOME.SUCCESS);
    expect(onEntitlement).toHaveBeenCalledTimes(1);
    expect(onCreditBalance).toHaveBeenCalled();
  });

  it('SUCCESS on timeout when verified but the balance never exceeds a baseline (fast webhook)', async () => {
    const deps = baseDeps({
      baselineBalance: 25,
      fetchCreditBalance: vi.fn().mockResolvedValue(25), // already applied before baseline
    });
    const out = await reconcileCheckout({ product: 'credits_25', sessionId: 'cs_test_b' }, deps);
    expect(out.outcome).toBe(OUTCOME.SUCCESS);
  });

  it('SUCCESS even when verify is TRANSIENTLY failing, as long as the balance lands', async () => {
    const transient = Object.assign(new Error('rate limited'), { transient: true });
    let bal = 0;
    const deps = baseDeps({
      verifySession: vi.fn().mockRejectedValue(transient),
      baselineBalance: 0,
      fetchCreditBalance: vi.fn().mockImplementation(() => { bal += 25; return Promise.resolve(bal); }),
    });
    const out = await reconcileCheckout({ product: 'credits_25', sessionId: 'cs_test_c' }, deps);
    expect(out.outcome).toBe(OUTCOME.SUCCESS);
  });

  it('PROCESSING when verify is transient AND the balance never lands', async () => {
    const transient = Object.assign(new Error('down'), { transient: true });
    const deps = baseDeps({
      verifySession: vi.fn().mockRejectedValue(transient),
      baselineBalance: 0,
      fetchCreditBalance: vi.fn().mockResolvedValue(0),
    });
    const out = await reconcileCheckout({ product: 'credits_25', sessionId: 'cs_test_d' }, deps);
    expect(out.outcome).toBe(OUTCOME.PROCESSING);
  });
});

describe('premium reconciliation', () => {
  it('SUCCESS once the tier flips to premium', async () => {
    let tier = 'free';
    const onEntitlement = vi.fn();
    const deps = baseDeps({
      fetchTier: vi.fn().mockImplementation(() => { tier = 'premium'; return Promise.resolve(tier); }),
      onEntitlement,
    });
    const out = await reconcileCheckout({ product: 'premium', sessionId: 'cs_test_e' }, deps);
    expect(out.outcome).toBe(OUTCOME.SUCCESS);
    expect(onEntitlement).toHaveBeenCalledTimes(1);
  });

  it('PROCESSING (never a false success) when the tier gate never opens', async () => {
    const deps = baseDeps({
      fetchTier: vi.fn().mockResolvedValue('free'), // webhook lagging
      attempts: 3,
    });
    const out = await reconcileCheckout({ product: 'premium', sessionId: 'cs_test_f' }, deps);
    expect(out.outcome).toBe(OUTCOME.PROCESSING);
  });
});

describe('terminal verification failure', () => {
  it('FAILED when verify definitively rejects (not transient)', async () => {
    const terminal = Object.assign(new Error('belongs to another account'), { transient: false });
    const deps = baseDeps({
      verifySession: vi.fn().mockRejectedValue(terminal),
      fetchTier: vi.fn().mockResolvedValue('free'),
    });
    const out = await reconcileCheckout({ product: 'premium', sessionId: 'cs_test_g' }, deps);
    expect(out.outcome).toBe(OUTCOME.FAILED);
  });

  it('FAILED when verify returns verified:false without a transient flag', async () => {
    const deps = baseDeps({
      verifySession: vi.fn().mockResolvedValue({ verified: false }),
    });
    const out = await reconcileCheckout({ product: 'credits_25', sessionId: 'cs_test_h' }, deps);
    expect(out.outcome).toBe(OUTCOME.FAILED);
  });
});
