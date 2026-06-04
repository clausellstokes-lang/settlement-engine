/** @vitest-environment jsdom */
/**
 * tests/lib/flags.test.js - Feature flag resolution contract.
 *
 * The resolution order is the whole point of the flag system, so we
 * pin it down explicitly: URL > localStorage > env > default.
 *
 * Uses the jsdom environment because the resolver reads window.location
 * and window.localStorage. The flag() function itself is safe to call
 * from non-DOM contexts (it guards on typeof window).
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { flag, setFlagOverride, getAllFlags, FLAGS } from '../../src/lib/flags.js';

// jsdom provides window + localStorage in vitest by default.
beforeEach(() => {
  window.localStorage.clear();
  // Reset URL to a known state.
  window.history.replaceState({}, '', '/');
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('flag() resolution', () => {
  it('returns the declared default when no overrides are set', () => {
    // With no override, flag() echoes each registry default exactly.
    // (Looping the registry keeps this robust as flags come and go.)
    for (const [name, decl] of Object.entries(FLAGS)) {
      expect(flag(name)).toBe(decl.default);
    }
    // discordOauth defaults to false (off until OAuth review).
    expect(flag('discordOauth')).toBe(false);
  });

  it('localStorage override beats default', () => {
    // An explicit true override wins over the false default...
    setFlagOverride('discordOauth', true);
    expect(flag('discordOauth')).toBe(true);

    // ...and an explicit false override is honored, not treated as "unset"
    // (guards the nullish-coalescing precedence in flag()).
    setFlagOverride('discordOauth', false);
    expect(flag('discordOauth')).toBe(false);
  });

  it('removing the override falls back to default', () => {
    setFlagOverride('discordOauth', true);
    expect(flag('discordOauth')).toBe(true);

    setFlagOverride('discordOauth', null);
    expect(flag('discordOauth')).toBe(false);
  });

  it('URL parameter beats localStorage', () => {
    setFlagOverride('discordOauth', false);
    window.history.replaceState({}, '', '/?flag.discordOauth=true');
    expect(flag('discordOauth')).toBe(true);
  });

  it('URL parameter persists to localStorage as a side effect', () => {
    window.history.replaceState({}, '', '/?flag.discordOauth=true');
    flag('discordOauth'); // trigger resolution
    expect(window.localStorage.getItem('flag.discordOauth')).toBe('true');
  });

  it('warns and returns false for unknown flags', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(flag('totallyMadeUp')).toBe(false);
    expect(warn).toHaveBeenCalled();
  });

  it('parses both "true/false" and "1/0" override values', () => {
    setFlagOverride('discordOauth', 1);
    expect(flag('discordOauth')).toBe(true);
    setFlagOverride('discordOauth', 0);
    expect(flag('discordOauth')).toBe(false);
  });
});

describe('getAllFlags()', () => {
  it('returns an entry for every declared flag', () => {
    const all = getAllFlags();
    for (const name of Object.keys(FLAGS)) {
      expect(all).toHaveProperty(name);
      expect(typeof all[name]).toBe('boolean');
    }
  });
});

describe('FLAGS registry', () => {
  it('every flag has a default + description', () => {
    for (const [name, decl] of Object.entries(FLAGS)) {
      expect(typeof decl.default).toBe('boolean');
      expect(typeof decl.description).toBe('string');
      expect(decl.description.length).toBeGreaterThan(10);
      // Sanity: flag name uses camelCase, not snake_case.
      expect(name).toMatch(/^[a-z][a-zA-Z0-9]*$/);
    }
  });
});
