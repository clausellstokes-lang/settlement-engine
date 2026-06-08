/** @vitest-environment jsdom */
import { describe, it, expect, beforeEach } from 'vitest';
import { getDeviceToken, __TOKEN_STORAGE_KEY, __resetMemoryToken } from '../../src/lib/deviceToken.js';

describe('getDeviceToken', () => {
  beforeEach(() => {
    window.localStorage.clear();
    __resetMemoryToken();
  });

  it('mints a token and persists it', () => {
    const t = getDeviceToken();
    expect(typeof t).toBe('string');
    expect(t.length).toBeGreaterThanOrEqual(8);
    expect(window.localStorage.getItem(__TOKEN_STORAGE_KEY)).toBe(t);
  });

  it('returns the SAME token on subsequent calls (stable per device)', () => {
    const a = getDeviceToken();
    const b = getDeviceToken();
    expect(b).toBe(a);
  });

  it('reuses an existing stored token rather than overwriting it', () => {
    window.localStorage.setItem(__TOKEN_STORAGE_KEY, 'preexisting-token-123');
    expect(getDeviceToken()).toBe('preexisting-token-123');
  });

  it('regenerates when the stored value is too short to be valid', () => {
    window.localStorage.setItem(__TOKEN_STORAGE_KEY, 'abc');
    const t = getDeviceToken();
    expect(t).not.toBe('abc');
    expect(t.length).toBeGreaterThanOrEqual(8);
  });
});
