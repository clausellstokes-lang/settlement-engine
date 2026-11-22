/**
 * saveMoments pin (F34 revival).
 *
 * The dead settlementSlice.saveSettlement action hosted the first_save/third_save
 * pricing moments + 'saved' research capture, but no real save path called it —
 * so the funnel never fired. Those side effects were revived in
 * src/store/saveMoments.js and wired into the real chokepoints (SaveToLibraryButton
 * + the SAVE_SETTLEMENT auth intent). These tests pin the revived behaviour:
 * fires on the 1st and 3rd save, not the 2nd, and is idempotent per save id.
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';

// Mock the two side-effect libraries so the pin is deterministic (no localStorage
// cooldowns, no consent gate, no network). The dynamic imports inside saveMoments
// resolve to these same modules.
vi.mock('../../src/lib/pricingMoments.js', () => ({
  triggerPricingMoment: vi.fn((reason, openModal) => { openModal({ reason }); return true; }),
}));
vi.mock('../../src/lib/researchCapture.js', () => ({
  captureFingerprint: vi.fn(),
}));

import { triggerPricingMoment } from '../../src/lib/pricingMoments.js';
import { captureFingerprint } from '../../src/lib/researchCapture.js';
import {
  saveMomentReason,
  recordSaveMoment,
  _resetSaveMomentsForTest,
} from '../../src/store/saveMoments.js';

// Flush the fire-and-forget dynamic-import microtasks recordSaveMoment kicks off.
const flush = () => new Promise(r => setTimeout(r, 0));

beforeEach(() => {
  _resetSaveMomentsForTest();
  vi.clearAllMocks();
});

describe('saveMomentReason (pure decision)', () => {
  test('1st save (post-save count 1) earns first_save', () => {
    expect(saveMomentReason(1, 3)).toBe('first_save');
  });
  test('2nd save earns nothing', () => {
    expect(saveMomentReason(2, 3)).toBeNull();
  });
  test('3rd save at a 3-save cap earns third_save', () => {
    expect(saveMomentReason(3, 3)).toBe('third_save');
  });
  test('3rd save at a higher cap (premium) earns nothing', () => {
    expect(saveMomentReason(3, 50)).toBeNull();
  });
});

describe('recordSaveMoment (side effects + idempotency)', () => {
  test('1st save fires the first_save pricing moment + research capture', async () => {
    const openPricingMoment = vi.fn();
    const res = await recordSaveMoment({
      saveId: 'save-1', settlement: { name: 'Testford' },
      postSaveActiveCount: 1, maxSaves: 3, tier: 'free', openPricingMoment,
    });
    expect(res).toEqual({ fired: true, reason: 'first_save' });
    await flush();
    expect(triggerPricingMoment).toHaveBeenCalledWith('first_save', expect.any(Function), { tier: 'free' });
    expect(openPricingMoment).toHaveBeenCalledTimes(1);
    expect(captureFingerprint).toHaveBeenCalledWith(
      'saved', { name: 'Testford' }, expect.objectContaining({ settlementUuid: 'save-1' }),
    );
  });

  test('2nd save fires NO pricing moment but still captures research', async () => {
    const openPricingMoment = vi.fn();
    const res = await recordSaveMoment({
      saveId: 'save-2', settlement: {},
      postSaveActiveCount: 2, maxSaves: 3, tier: 'free', openPricingMoment,
    });
    expect(res).toEqual({ fired: true, reason: null });
    await flush();
    expect(triggerPricingMoment).not.toHaveBeenCalled();
    expect(openPricingMoment).not.toHaveBeenCalled();
    expect(captureFingerprint).toHaveBeenCalledTimes(1);
  });

  test('3rd save at a 3-save cap fires third_save', async () => {
    const res = await recordSaveMoment({
      saveId: 'save-3', settlement: {},
      postSaveActiveCount: 3, maxSaves: 3, tier: 'free', openPricingMoment: vi.fn(),
    });
    expect(res.reason).toBe('third_save');
    await flush();
    expect(triggerPricingMoment).toHaveBeenCalledWith('third_save', expect.any(Function), { tier: 'free' });
  });

  test('idempotent per save id — a re-invoke for the same save does nothing', async () => {
    const first = await recordSaveMoment({
      saveId: 'dup', settlement: {},
      postSaveActiveCount: 1, maxSaves: 3, tier: 'free', openPricingMoment: vi.fn(),
    });
    expect(first.fired).toBe(true);
    await flush();
    vi.clearAllMocks();

    const second = await recordSaveMoment({
      saveId: 'dup', settlement: {},
      postSaveActiveCount: 1, maxSaves: 3, tier: 'free', openPricingMoment: vi.fn(),
    });
    expect(second).toEqual({ fired: false, reason: null, deduped: true });
    await flush();
    expect(triggerPricingMoment).not.toHaveBeenCalled();
    expect(captureFingerprint).not.toHaveBeenCalled();
  });

  test('a missing save id is a no-op (never throws)', async () => {
    const res = await recordSaveMoment({
      saveId: undefined, settlement: {},
      postSaveActiveCount: 1, maxSaves: 3, tier: 'free', openPricingMoment: vi.fn(),
    });
    expect(res).toEqual({ fired: false, reason: null });
    await flush();
    expect(triggerPricingMoment).not.toHaveBeenCalled();
    expect(captureFingerprint).not.toHaveBeenCalled();
  });
});
