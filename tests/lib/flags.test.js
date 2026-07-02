/** @vitest-environment jsdom */
/**
 * tests/lib/flags.test.js — Feature flag resolution contract.
 *
 * The resolution order is the whole point of the flag system, so we
 * pin it down explicitly: URL > localStorage > env > default.
 *
 * Uses the jsdom environment because the resolver reads window.location
 * and window.localStorage. The flag() function itself is safe to call
 * from non-DOM contexts (it guards on typeof window).
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { flag, setFlagOverride, getAllFlags, persistUrlFlags, FLAGS } from '../../src/lib/flags.js';

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
    // discordOauth/googleOauth default to TRUE: the providers are now
    // configured in the Supabase dashboard, so the OAuth buttons are live.
    expect(flag('discordOauth')).toBe(true);
    expect(flag('googleOauth')).toBe(true);
    // founderRecognition is also default-false, used below to exercise the
    // override-over-false-default resolution mechanics.
    expect(flag('founderRecognition')).toBe(false);
  });

  it('localStorage override beats default', () => {
    // An explicit true override wins over the false default…
    setFlagOverride('founderRecognition', true);
    expect(flag('founderRecognition')).toBe(true);

    // …and an explicit false override is honored, not treated as "unset"
    // (guards the nullish-coalescing precedence in flag()).
    setFlagOverride('founderRecognition', false);
    expect(flag('founderRecognition')).toBe(false);
  });

  it('removing the override falls back to default', () => {
    setFlagOverride('founderRecognition', true);
    expect(flag('founderRecognition')).toBe(true);

    setFlagOverride('founderRecognition', null);
    expect(flag('founderRecognition')).toBe(false);
  });

  it('URL parameter beats localStorage', () => {
    setFlagOverride('founderRecognition', false);
    window.history.replaceState({}, '', '/?flag.founderRecognition=true');
    expect(flag('founderRecognition')).toBe(true);
  });

  it('flag() reading a URL override is PURE — no localStorage write during resolution (#5)', () => {
    // flag() runs inside useSyncExternalStore's getSnapshot; it must NOT write to
    // localStorage as a side effect. The URL value still wins precedence, but
    // persistence is deferred to persistUrlFlags() (called once at boot).
    window.history.replaceState({}, '', '/?flag.founderRecognition=true');
    expect(flag('founderRecognition')).toBe(true);          // URL still resolves
    expect(window.localStorage.getItem('flag.founderRecognition')).toBeNull(); // but no write
  });

  it('persistUrlFlags() persists URL overrides to localStorage at boot (#5)', () => {
    window.history.replaceState({}, '', '/?flag.founderRecognition=true&flag.heroV2=false');
    persistUrlFlags();
    expect(window.localStorage.getItem('flag.founderRecognition')).toBe('true');
    expect(window.localStorage.getItem('flag.heroV2')).toBe('false');
  });

  it('warns and returns false for unknown flags', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(flag('totallyMadeUp')).toBe(false);
    expect(warn).toHaveBeenCalled();
  });

  it('parses both "true/false" and "1/0" override values', () => {
    setFlagOverride('founderRecognition', 1);
    expect(flag('founderRecognition')).toBe(true);
    setFlagOverride('founderRecognition', 0);
    expect(flag('founderRecognition')).toBe(false);
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
