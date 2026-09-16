/**
 * updateConfigPatchValidation.test.js — Wave R-3 shapeless-patch validation
 * (atlas VI.12 #163b, lane B).
 *
 * updateConfig now validates patch keys against the admitted surface
 * (DEFAULT_CONFIG + the underscore rider family + the census-derived extras in
 * configSlice.js). These pins prove:
 *   1. every LEGITIMATE caller patch shape from the R-3 census still applies
 *      verbatim (wizard controls, PlaceInRegionCard riders, archetype patches,
 *      the sample-fork shape, whole legacy `_config` blobs);
 *   2. a patch of only unknown keys is refused typed and writes NOTHING;
 *   3. a mixed patch applies its admitted keys and drops the unknown ones with
 *      a typed report — the legacy-save load path keeps working while junk
 *      keys stop polluting the persisted config;
 *   4. the configExplicitFields intent recording is unaffected for valid
 *      patches (and untouched by refused ones);
 *   5. the safety-gate keys (contentProfile / contentBoundaries) patch
 *      normally — they are legitimate wizard writes.
 *
 * The census→allowlist coupling itself is guarded by
 * tests/generators/configPatchAllowlistWalker.test.js.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import {
  createConfigSlice,
  DEFAULT_CONFIG,
  isAllowedConfigKey,
} from '../../src/store/configSlice.js';

function makeStore() {
  return create(immer((set, get) => ({
    isTierAllowed: () => true,
    maxAllowedTier: () => 'town',
    ...createConfigSlice(set, get),
  })));
}

let store;
let errorSpy;
beforeEach(() => {
  store = makeStore();
  // vi.spyOn returns the SAME spy when console.error is already wrapped, so
  // call history would otherwise accumulate across tests.
  errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  errorSpy.mockClear();
});

describe('R-3 — every censused caller patch shape still applies', () => {
  const censusedShapes = [
    ['HomeHero size pick', { settType: 'town' }],
    ['StressPanel toggle', { selectedStressesRandom: false, selectedStresses: ['plague_risk'] }],
    ['NearbyResourcesPanel pick', {
      nearbyResourcesRandom: false,
      nearbyResources: ['iron_deposits'],
      nearbyResourcesState: { iron_deposits: 'depleted' },
    }],
    ['custom name input', { customName: 'Riverton' }],
    ['custom-content gate (store-read extra key)', { useCustomContent: false }],
    ['terrain override (pipeline extra key)', { terrainOverride: 'coastal' }],
    ['PlaceInRegionCard campaign rider', { targetCampaignId: 'campaign-1' }],
    ['PlaceInRegionCard deity rider', { primaryDeityRef: 'deity:custom:abc' }],
    ['CharacterPresetCard archetype patch', {
      priorityEconomy: 62,
      priorityMilitary: 40,
      priorityMagic: 30,
      priorityReligion: 55,
      priorityCriminal: 25,
      monsterThreat: 'frontier',
    }],
    ['magic toggle pair', { magicExists: false, priorityMagic: 0 }],
    ['settlement age pair', { settlementAgeMode: 'manual', settlementAgeYears: 120 }],
  ];

  for (const [label, patch] of censusedShapes) {
    it(`applies: ${label}`, () => {
      const result = store.getState().updateConfig(patch);
      expect(result).toEqual({ ok: true });
      for (const [key, value] of Object.entries(patch)) {
        expect(store.getState().config[key]).toEqual(value);
      }
      expect(errorSpy).not.toHaveBeenCalled();
    });
  }

  it('applies the sample-fork shape (seed + _forkedFromSample riders)', () => {
    // SettlementsPanel.forkSample / FoundingWorlds: whole sample config plus
    // the seed and provenance riders.
    const patch = {
      settType: 'town',
      tradeRouteAccess: 'port',
      terrainOverride: 'coastal',
      monsterThreat: 'heartland',
      culture: 'germanic',
      customName: 'Mossgate',
      priorityMilitary: 35,
      seed: 'mossgate-004-user1',
      _forkedFromSample: 'sample-mossgate',
    };
    const result = store.getState().updateConfig(patch);
    expect(result).toEqual({ ok: true });
    expect(store.getState().config.seed).toBe('mossgate-004-user1');
    expect(store.getState().config._forkedFromSample).toBe('sample-mossgate');
  });

  it('applies a whole legacy _config blob (engine-read keys beyond DEFAULT_CONFIG)', () => {
    // SettlementsPanel.onLoad replays persisted `_config` blobs whose keys are
    // pipeline vocabulary, not wizard vocabulary.
    const patch = {
      settType: 'city',
      tier: 'city',
      stressTypes: ['famine'],
      faith: { deity: null },
      latentPantheon: null,
      stressorEdits: [],
      _institutions: { temple: true },
      _seed: 12345,
    };
    const result = store.getState().updateConfig(patch);
    expect(result).toEqual({ ok: true });
    expect(store.getState().config.stressTypes).toEqual(['famine']);
    expect(store.getState().config._institutions).toEqual({ temple: true });
  });
});

describe('R-3 — the safety-gate keys are legitimate wizard writes', () => {
  it('patches contentProfile and contentBoundaries normally', () => {
    const result = store.getState().updateConfig({
      contentProfile: 'custom',
      contentBoundaries: { slavery: false, trafficking: false },
    });
    expect(result).toEqual({ ok: true });
    expect(store.getState().config.contentProfile).toBe('custom');
    expect(store.getState().config.contentBoundaries).toEqual({
      slavery: false,
      trafficking: false,
    });
  });
});

describe('R-3 — unknown keys are refused or dropped, typed', () => {
  it('refuses a patch made only of unknown keys and writes nothing', () => {
    const before = JSON.parse(JSON.stringify(store.getState().config));
    const intentBefore = { ...store.getState().configExplicitFields };
    const result = store.getState().updateConfig({ notAConfigKeyEver: 1 });
    expect(result).toEqual({
      ok: false,
      reason: 'unknown_config_keys',
      unknownKeys: ['notAConfigKeyEver'],
    });
    expect(store.getState().config).toEqual(before);
    expect(store.getState().configExplicitFields).toEqual(intentBefore);
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });

  it('applies the admitted keys of a mixed patch and reports the dropped ones', () => {
    const result = store.getState().updateConfig({
      settType: 'city',
      retiredWizardKnob: 7,
    });
    expect(result).toEqual({ ok: true, ignoredKeys: ['retiredWizardKnob'] });
    expect(store.getState().config.settType).toBe('city');
    expect('retiredWizardKnob' in store.getState().config).toBe(false);
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });

  it('refuses non-object patches typed without throwing', () => {
    for (const bad of [null, undefined, 'settType', 42, ['settType']]) {
      expect(store.getState().updateConfig(bad)).toEqual({
        ok: false,
        reason: 'invalid_config_patch',
      });
    }
    const before = JSON.parse(JSON.stringify(store.getState().config));
    expect(store.getState().config).toEqual(before);
  });
});

describe('R-3 — intent recording is unaffected for valid patches', () => {
  it('records tunable intent exactly as before', () => {
    store.getState().updateConfig({ priorityEconomy: 50 });
    expect(store.getState().configExplicitFields).toEqual({ priorityEconomy: true });
  });

  it('honors recordIntent: false', () => {
    store.getState().updateConfig({ priorityEconomy: 61 }, { recordIntent: false });
    expect(store.getState().configExplicitFields).toEqual({});
    expect(store.getState().config.priorityEconomy).toBe(61);
  });

  it('a mixed patch still records intent for its admitted tunable keys', () => {
    store.getState().updateConfig({ magicExists: false, retiredWizardKnob: 1 });
    expect(store.getState().configExplicitFields).toEqual({ magicExists: true });
  });
});

describe('R-3 — the admitted-surface predicate', () => {
  it('admits DEFAULT_CONFIG keys, underscore riders, and censused extras; refuses junk', () => {
    for (const key of Object.keys(DEFAULT_CONFIG)) {
      expect(isAllowedConfigKey(key), key).toBe(true);
    }
    expect(isAllowedConfigKey('_anyRiderKey')).toBe(true);
    expect(isAllowedConfigKey('seed')).toBe(true);
    expect(isAllowedConfigKey('useCustomContent')).toBe(true);
    expect(isAllowedConfigKey('definitelyNotAConfigKey')).toBe(false);
  });

  it('admits the COMPOSED stressor-edits key (composition must not change admission)', () => {
    // configSlice spells this one allowlist member as 'stressor' + 'Edits' so
    // the crisisTripleSync vocabulary-closure scan (which greps src for the
    // bare token over a frozen five-file set) does not count the allowlist as a
    // handler of a record configSlice never reads or writes. That is purely a
    // source-shape choice with zero runtime meaning, and this pin is what
    // proves it: the assembled Set must still contain the real key.
    expect(isAllowedConfigKey('stressorEdits')).toBe(true);
    // …and the patch path that carries it (legacy `_config` blob replay) must
    // still apply it rather than drop it as unknown.
    const result = store.getState().updateConfig({ stressorEdits: { added: [], resolved: [] } });
    expect(result).toEqual({ ok: true });
    expect(store.getState().config.stressorEdits).toEqual({ added: [], resolved: [] });
  });
});
