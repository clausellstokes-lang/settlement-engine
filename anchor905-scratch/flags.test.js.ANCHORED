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
import { flag, setFlagOverride, getAllFlags, FLAGS } from '../../src/lib/flags.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

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
    // discordOauth defaults to true (OAuth buttons shipped flag-on; a
    // not-yet-enabled provider degrades to a calm message via describeOAuthError).
    expect(flag('discordOauth')).toBe(true);
  });

  it('localStorage override beats default', () => {
    // An explicit true override is honored…
    setFlagOverride('discordOauth', true);
    expect(flag('discordOauth')).toBe(true);

    // …and an explicit false override is honored, not treated as "unset"
    // (guards the nullish-coalescing precedence in flag()) — this also proves
    // an override wins even against the true registry default.
    setFlagOverride('discordOauth', false);
    expect(flag('discordOauth')).toBe(false);
  });

  it('removing the override falls back to default', () => {
    // Override opposite the registry default, then clear it and confirm the
    // value reverts to the default (discordOauth defaults to true).
    setFlagOverride('discordOauth', false);
    expect(flag('discordOauth')).toBe(false);

    setFlagOverride('discordOauth', null);
    expect(flag('discordOauth')).toBe(true);
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
  // Both retirements are anchored on a LIVE SIBLING rather than asserted bare: the
  // registry is `Object.fromEntries(Object.keys(FLAG_DEFAULTS)…)`, so `Object.keys(FLAGS)`
  // IS the exposure surface, and a registry that drifted empty or re-keyed reds on the
  // anchor instead of passing these exclusions vacuously forever.
  it('does not expose the retired journey media-set comparison toggle', () => {
    expectAbsentWithAnchor(Object.keys(FLAGS), 'loadingJourneySetBg', 'loadingJourneyFilm',
      'FLAGS registry — the surviving journey-film flag anchors its retired media-set companion');
  });

  it('does not expose the retired single-chrome mobile nav toggle', () => {
    // Retired at 89ff7b03b (§904) after its src/App.jsx readers were deleted at 8bf493d05.
    expectAbsentWithAnchor(Object.keys(FLAGS), 'mobileSingleChrome', 'workshopNav',
      'FLAGS registry — the surviving top-level nav flag anchors the retired mobile-chrome one');
  });

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
