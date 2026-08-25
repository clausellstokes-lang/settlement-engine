/**
 * persistMerge.test.js — store-6 pin.
 *
 * zustand's default persist merge is a SHALLOW top-level spread, so a returning
 * user's persisted `config` REPLACES DEFAULT_CONFIG wholesale — any key added to
 * DEFAULT_CONFIG after they last saved reads `undefined` for them while a fresh user
 * gets the default (a silent config-shape fork between cohorts that reaches the
 * generator as input). The custom merge deep-merges config (and the toggle maps) over
 * their defaults so missing keys backfill. Pinned here so a future refactor can't
 * regress the class.
 */
import { describe, it, expect } from 'vitest';
import { mergePersistedState } from '../../src/store/persistMerge.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

describe('store-6 — mergePersistedState deep-merges config over defaults', () => {
  it('backfills EVERY DEFAULT_CONFIG key a returning user\'s persisted config predates', () => {
    // A returning user's blob: only a couple of keys (persisted before newer defaults).
    const persisted = { config: { population: 9999, magicExists: false } };
    const current = {
      config: { ...DEFAULT_CONFIG },
      institutionToggles: {},
      someSliceMethod: () => 'alive',
    };
    const merged = mergePersistedState(persisted, current);

    // The user's own values survive (persisted wins on collision).
    expect(merged.config.population).toBe(9999);
    expect(merged.config.magicExists).toBe(false);
    // The shallow-merge bug dropped these; the deep merge restores every default key.
    for (const key of Object.keys(DEFAULT_CONFIG)) {
      expect(merged.config).toHaveProperty(key);
    }
    // Concrete newer keys a pre-version blob wouldn't carry.
    expect(merged.config.settlementAgeMode).toBe(DEFAULT_CONFIG.settlementAgeMode);
    expect(merged.config.powerDynamicsConfig).toBe(DEFAULT_CONFIG.powerDynamicsConfig);
    // The top-level spread still restores every other slice's state/methods.
    expect(merged.someSliceMethod()).toBe('alive');
  });

  it('merges the four toggle maps over their (empty) defaults', () => {
    const persisted = { goodsToggles: { town_good_ale: { allow: true } } };
    const current = { config: { ...DEFAULT_CONFIG }, goodsToggles: {}, institutionToggles: {}, categoryToggles: {}, servicesToggles: {} };
    const merged = mergePersistedState(persisted, current);
    expect(merged.goodsToggles.town_good_ale).toEqual({ allow: true });
    // Absent-in-persisted maps fall back to the current (empty) default, never undefined.
    expect(merged.institutionToggles).toEqual({});
    expect(merged.servicesToggles).toEqual({});
  });

  it('a null/absent persisted blob yields the fresh config defaults (no throw)', () => {
    const current = { config: { ...DEFAULT_CONFIG }, institutionToggles: {}, categoryToggles: {}, goodsToggles: {}, servicesToggles: {} };
    const merged = mergePersistedState(null, current);
    expect(merged.config).toEqual(DEFAULT_CONFIG);
  });
});
