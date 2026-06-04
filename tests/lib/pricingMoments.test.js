/**
 * @vitest-environment jsdom
 *
 * tests/lib/pricingMoments.test.js - Tier 3.8 comprehensive coverage.
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import {
  triggerPricingMoment,
  resetPricingMoment,
  resetAllPricingMoments,
} from '../../src/lib/pricingMoments.js';

beforeEach(() => {
  localStorage.clear();
});

describe('triggerPricingMoment()', () => {
  test('returns false when openModal is not a function', () => {
    expect(triggerPricingMoment('first_canonize', null)).toBe(false);
    expect(triggerPricingMoment('first_canonize', 'not_a_function')).toBe(false);
  });

  test('returns false for premium users', () => {
    const opener = vi.fn();
    expect(triggerPricingMoment('first_canonize', opener, { tier: 'premium' })).toBe(false);
    expect(opener).not.toHaveBeenCalled();
  });

  test('returns false for developer / admin users', () => {
    const opener = vi.fn();
    expect(triggerPricingMoment('first_canonize', opener, { tier: 'developer' })).toBe(false);
    expect(triggerPricingMoment('first_canonize', opener, { tier: 'admin' })).toBe(false);
    expect(opener).not.toHaveBeenCalled();
  });

  test('fires for free users and calls openModal with content + reason', () => {
    const opener = vi.fn();
    const ok = triggerPricingMoment('first_canonize', opener, { tier: 'free' });
    expect(ok).toBe(true);
    expect(opener).toHaveBeenCalledTimes(1);
    const arg = opener.mock.calls[0][0];
    expect(arg).toHaveProperty('reason', 'first_canonize');
    expect(typeof arg.headline === 'string' || arg.headline === undefined).toBe(true);
  });

  test('fires for anonymous users (no tier)', () => {
    const opener = vi.fn();
    expect(triggerPricingMoment('first_canonize', opener)).toBe(true);
    expect(opener).toHaveBeenCalled();
  });

  test('returns false for unknown reasons', () => {
    const opener = vi.fn();
    expect(triggerPricingMoment('pizza_party', opener)).toBe(false);
    expect(opener).not.toHaveBeenCalled();
  });

  test('cooldown: same moment does not fire twice in a row', () => {
    const opener = vi.fn();
    expect(triggerPricingMoment('first_canonize', opener)).toBe(true);
    expect(triggerPricingMoment('first_canonize', opener)).toBe(false);
    expect(opener).toHaveBeenCalledTimes(1);
  });

  test('cooldown is per-moment (different reasons fire independently)', () => {
    const opener = vi.fn();
    expect(triggerPricingMoment('first_canonize', opener)).toBe(true);
    expect(triggerPricingMoment('first_ai_use', opener)).toBe(true);
    expect(opener).toHaveBeenCalledTimes(2);
  });

  test('force: true bypasses the cooldown', () => {
    const opener = vi.fn();
    triggerPricingMoment('first_canonize', opener);
    triggerPricingMoment('first_canonize', opener);
    expect(opener).toHaveBeenCalledTimes(1);
    triggerPricingMoment('first_canonize', opener, { force: true });
    expect(opener).toHaveBeenCalledTimes(2);
  });

  test('catches thrown errors from openModal and returns false', () => {
    const opener = () => { throw new Error('modal boom'); };
    expect(triggerPricingMoment('first_canonize', opener)).toBe(false);
  });
});

describe('resetPricingMoment()', () => {
  test('lets a moment fire again after reset', () => {
    const opener = vi.fn();
    triggerPricingMoment('first_canonize', opener);
    expect(triggerPricingMoment('first_canonize', opener)).toBe(false);
    resetPricingMoment('first_canonize');
    expect(triggerPricingMoment('first_canonize', opener)).toBe(true);
  });

  test('does not throw on unknown reason', () => {
    expect(() => resetPricingMoment('not_a_real_moment')).not.toThrow();
  });
});

describe('resetAllPricingMoments()', () => {
  test('clears every moment cooldown', () => {
    const opener = vi.fn();
    triggerPricingMoment('first_canonize', opener);
    triggerPricingMoment('first_ai_use', opener);
    expect(triggerPricingMoment('first_canonize', opener)).toBe(false);
    expect(triggerPricingMoment('first_ai_use', opener)).toBe(false);
    resetAllPricingMoments();
    expect(triggerPricingMoment('first_canonize', opener)).toBe(true);
    expect(triggerPricingMoment('first_ai_use', opener)).toBe(true);
  });

  test('does not touch unrelated localStorage keys', () => {
    localStorage.setItem('unrelated:key', 'value');
    resetAllPricingMoments();
    expect(localStorage.getItem('unrelated:key')).toBe('value');
  });
});
