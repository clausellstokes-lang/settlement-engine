/**
 * tests/store/persistConfigMerge.test.js — B11-store finding #5.
 *
 * The persist-rehydration merge (mergePersistedState in store/index.js) must
 * deep-merge the persisted `config` OVER DEFAULT_CONFIG, not replace it
 * wholesale. Otherwise a key ADDED to DEFAULT_CONFIG after a user last persisted
 * reads back `undefined` for that returning user (a missing boolean is treated
 * as falsy and silently mis-resolves generation) until they reset config.
 */
import { describe, it, expect } from 'vitest';
import { mergePersistedState } from '../../src/store/index.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const current = () => ({
  config: { ...DEFAULT_CONFIG },
  userPrefs: { detailLevel: 'standard', tableViewOpen: false },
  productPrefs: { pdfStyle: 'classic', playerView: false },
  somethingTransient: 42,
});

describe('mergePersistedState — config migration gap (finding #5)', () => {
  it('fills DEFAULT_CONFIG keys absent from a stale persisted config', () => {
    // A returning user whose localStorage predates `magicExists` /
    // `nearbyResourcesRandom` — those keys are simply missing from their blob.
    const persisted = {
      config: { settType: 'town', population: 4200 }, // legacy partial config
    };

    const merged = mergePersistedState(persisted, current());

    // Persisted values win for keys the user DID set.
    expect(merged.config.settType).toBe('town');
    expect(merged.config.population).toBe(4200);
    // Newly-added DEFAULT_CONFIG keys read back their default, NOT undefined.
    expect(merged.config.magicExists).toBe(DEFAULT_CONFIG.magicExists);
    expect(merged.config.nearbyResourcesRandom).toBe(DEFAULT_CONFIG.nearbyResourcesRandom);
    expect('magicExists' in merged.config).toBe(true);
  });

  it('a persisted false boolean still overrides the default (no clobber by default)', () => {
    const persisted = { config: { magicExists: false } };
    const merged = mergePersistedState(persisted, current());
    expect(merged.config.magicExists).toBe(false);
  });

  it('every DEFAULT_CONFIG key is present after merge even when persisted config is empty', () => {
    const merged = mergePersistedState({ config: {} }, current());
    for (const key of Object.keys(DEFAULT_CONFIG)) {
      expect(merged.config[key]).toEqual(DEFAULT_CONFIG[key]);
    }
  });

  it('no persisted config at all falls back to the full DEFAULT_CONFIG', () => {
    const merged = mergePersistedState({}, current());
    expect(merged.config).toEqual({ ...DEFAULT_CONFIG });
  });

  it('still deep-merges userPrefs and productPrefs (regression guard)', () => {
    const persisted = {
      userPrefs: { detailLevel: 'engine' },     // only detailLevel persisted
      productPrefs: { pdfStyle: 'parchment' },   // only one key persisted
    };
    const merged = mergePersistedState(persisted, current());
    // persisted overlays, transient/default keys survive
    expect(merged.userPrefs.detailLevel).toBe('engine');
    expect(merged.userPrefs.tableViewOpen).toBe(false);
    expect(merged.productPrefs.pdfStyle).toBe('parchment');
    expect(merged.productPrefs.playerView).toBe(false);
  });
});
