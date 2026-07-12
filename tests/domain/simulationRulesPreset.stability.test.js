import { describe, expect, test } from 'vitest';

import {
  DEFAULT_SIMULATION_RULES,
  DEFAULT_SIMULATION_PRESET_ID,
  CUSTOM_SIMULATION_PRESET_ID,
  SIMULATION_RULE_PRESETS,
  normalizeSimulationRules,
} from '../../src/domain/worldPulse/simulationRules.js';

// F0 structural tripwire (guards the RULE_COMPARISON_KEYS churn trap): preset
// identity must survive the addition of future default-false simulation flags
// (warLayerEnabled / settlementStrategyEnabled / religionDynamicsEnabled, all
// landing later defaulting false). Those flags ride through normalization via
// `...input` but are INVISIBLE to preset matching because they are not in
// RULE_COMPARISON_KEYS. The danger this file pins: if a future dev adds a key
// to RULE_COMPARISON_KEYS without defining it in EVERY preset, that preset
// suddenly compares `undefined` against the new default, mismatches, and
// silently collapses its presetId to 'custom'. Test #2 is the live wire that
// trips when that happens. Tests #1/#4 pin the round-trip baseline, #3 pins the
// safe forward-compat pattern, and #5 proves matching is not trivially
// always-true (custom detection still fires).
//
// RULE_COMPARISON_KEYS is module-private in the source. We reconstruct the
// canonical set from the PUBLIC surface so this oracle tracks the real defaults
// rather than a frozen copy: the three enum keys plus every boolean rule key
// derived from DEFAULT_SIMULATION_RULES (presetId/schemaVersion excluded).
const ENUM_COMPARISON_KEYS = ['propagationMode', 'intensity', 'migrationMode'];
const BOOLEAN_KEYS = Object.entries(DEFAULT_SIMULATION_RULES)
  .filter(([, value]) => typeof value === 'boolean')
  .map(([key]) => key);
const RULE_COMPARISON_KEYS = [...ENUM_COMPARISON_KEYS, ...BOOLEAN_KEYS];

const PRESET_IDS = Object.keys(SIMULATION_RULE_PRESETS);
// The legacy trio must stay resolvable forever (old saves carry these ids; the
// realm toolbar chips apply them) AND must stay FIRST in the catalog: the
// keyless inference in presetIdForRules returns the FIRST structural match, so
// a legacy default-rules save keeps inferring realistic_regional, never the
// structurally-identical living_realm.
const LEGACY_PRESET_IDS = ['quiet_local', 'realistic_regional', 'dramatic_campaign'];
const CL0_PRESET_IDS = ['static_campaign', 'narrative_campaign', 'living_realm', 'full_simulation'];

describe('simulation rules preset — stability under future-flag churn', () => {
  // Anti-vacuity: the catalog and the comparison-key set are non-trivial. If
  // either collapsed to empty/one, the per-preset loops below would be vacuous.
  test('the catalog is the legacy trio FIRST plus the four §11 presets', () => {
    expect(PRESET_IDS).toEqual([...LEGACY_PRESET_IDS, ...CL0_PRESET_IDS]);
    // 3 enum keys + the boolean toggle bank — proves we actually reconstructed
    // a meaningful key set, not an empty array that makes #2 always pass.
    expect(BOOLEAN_KEYS.length).toBeGreaterThan(5);
    expect(RULE_COMPARISON_KEYS.length).toBe(ENUM_COMPARISON_KEYS.length + BOOLEAN_KEYS.length);
  });

  // CL-0 byte-stability: keyless default rules still infer the LEGACY default
  // preset (realistic_regional), not living_realm — the two were structurally
  // the same world until SEASONS-A lit seasonsEnabled on living_realm (catalog
  // order remains the guard either way, and keeps old saves byte-identical).
  test('keyless default rules keep inferring realistic_regional', () => {
    const keyless = { ...SIMULATION_RULE_PRESETS.realistic_regional.rules };
    delete keyless.presetId;
    expect(normalizeSimulationRules(keyless).presetId).toBe('realistic_regional');
    expect(normalizeSimulationRules({}).presetId).toBe('realistic_regional');
  });

  // #1 — each named preset round-trips to ITSELF (no collapse to 'custom').
  test('every named preset normalizes back to its own id', () => {
    for (const id of PRESET_IDS) {
      const preset = SIMULATION_RULE_PRESETS[id];
      // Sanity: the catalog id and the embedded rules.presetId agree.
      expect(preset.id).toBe(id);
      const normalized = normalizeSimulationRules(preset.rules);
      expect(normalized.presetId).toBe(id);
      expect(normalized.presetId).not.toBe(CUSTOM_SIMULATION_PRESET_ID);
    }
  });

  // #2 — THE churn guard: every comparison key is DEFINED in every preset.
  // If a dev grows RULE_COMPARISON_KEYS but forgets a preset, that preset's
  // value for the new key is undefined here and this assertion fails first.
  test('every comparison key is defined (not undefined) in every preset', () => {
    for (const id of PRESET_IDS) {
      const { rules } = SIMULATION_RULE_PRESETS[id];
      for (const key of RULE_COMPARISON_KEYS) {
        expect(
          rules[key],
          `${id}.rules.${key} must be defined for stable preset matching`,
        ).not.toBeUndefined();
      }
    }
  });

  // #3 — forward-compat: a hypothetical NEW default-false flag rides through. Uses
  // SYNTHETIC flag names (not a real gate like warLayerEnabled, which graduated into
  // RULE_COMPARISON_KEYS) so the property stays testable as real flags land.
  test('a new default-false flag is invisible to matching yet survives normalization', () => {
    const base = SIMULATION_RULE_PRESETS.realistic_regional.rules;
    // Guard the premise: the synthetic flag is NOT a key the source compares on.
    expect(RULE_COMPARISON_KEYS).not.toContain('__hypotheticalFutureFlag');

    const withFutureFlag = { ...base, __hypotheticalFutureFlag: false };
    const normalized = normalizeSimulationRules(withFutureFlag);

    // (a) preset identity is untouched by the unknown flag.
    expect(normalized.presetId).toBe('realistic_regional');
    // (b) the new flag value passes through via `...input`.
    expect(normalized.__hypotheticalFutureFlag).toBe(false);

    // It also rides through when set true — value preserved, identity stable.
    const truthy = normalizeSimulationRules({ ...base, __anotherFutureFlag: true });
    expect(truthy.presetId).toBe('realistic_regional');
    expect(truthy.__anotherFutureFlag).toBe(true);
  });

  // #4 — default integrity: the frozen default and the no-arg call agree.
  test('default rules and no-arg normalize resolve to the default preset', () => {
    expect(DEFAULT_SIMULATION_RULES.presetId).toBe(DEFAULT_SIMULATION_PRESET_ID);

    const fromDefault = normalizeSimulationRules();
    expect(fromDefault.presetId).toBe(DEFAULT_SIMULATION_PRESET_ID);
    // The no-arg result equals the named default preset on every comparison key.
    const defaultPreset = SIMULATION_RULE_PRESETS[DEFAULT_SIMULATION_PRESET_ID];
    for (const key of RULE_COMPARISON_KEYS) {
      expect(fromDefault[key]).toBe(defaultPreset.rules[key]);
    }
  });

  // W0-A3 — the Full Simulation preset runs the war stack AT DEPTH: the eight
  // war sub-flags ship lit in full_simulation ONLY. living_realm and the legacy
  // trio inherit the default-false bank, and full_simulation still round-trips
  // to its own id (the flags are comparison keys, defined in every preset via
  // the DEFAULT spread — churn-guard #2 covers the definedness half).
  const WAR_DEPTH_FLAGS = [
    'defenderAttritionEnabled',
    'warEconomyDrainEnabled',
    'warSupplyQualityEnabled',
    'defenderResolveEnabled',
    'allyDefenseEnabled',
    'warForageEnabled',
    'warLevyEnabled',
    'warDispositionEnabled',
  ];
  test('full_simulation lights ALL EIGHT war sub-flags; every other preset keeps them dark', () => {
    // The eight are real boolean rule keys (anti-drift: renaming one in the
    // source must fail here, not silently test a ghost key).
    for (const flag of WAR_DEPTH_FLAGS) {
      expect(BOOLEAN_KEYS, `${flag} is a real boolean rule key`).toContain(flag);
    }
    for (const flag of WAR_DEPTH_FLAGS) {
      expect(SIMULATION_RULE_PRESETS.full_simulation.rules[flag], `full_simulation.${flag}`).toBe(true);
      expect(DEFAULT_SIMULATION_RULES[flag], `default ${flag} stays false`).toBe(false);
    }
    for (const id of PRESET_IDS.filter(p => p !== 'full_simulation')) {
      for (const flag of WAR_DEPTH_FLAGS) {
        expect(SIMULATION_RULE_PRESETS[id].rules[flag], `${id}.${flag} stays dark`).toBe(false);
      }
    }
    // Round-trip: the lit preset still infers ITSELF, and a keyless copy of its
    // rules (an old save that lost its presetId) re-infers full_simulation.
    const keyless = { ...SIMULATION_RULE_PRESETS.full_simulation.rules };
    delete keyless.presetId;
    expect(normalizeSimulationRules(keyless).presetId).toBe('full_simulation');
  });

  // #5 — custom detection still fires (proves matching is not always-true).
  test('flipping one comparison key away from every preset yields custom', () => {
    const base = SIMULATION_RULE_PRESETS.dramatic_campaign.rules;
    // Pick a boolean toggle and flip it; no preset has dramatic_campaign's
    // exact remaining shape with this single bit inverted, so it must be custom.
    const key = BOOLEAN_KEYS.find(k => base[k] === true);
    expect(key, 'fixture is hot: dramatic_campaign has at least one true toggle').toBeDefined();

    const mutated = normalizeSimulationRules({ ...base, [key]: false });
    expect(mutated.presetId).toBe(CUSTOM_SIMULATION_PRESET_ID);
    // Anti-vacuity contrast: the UNmutated base still matches its own preset,
    // so the 'custom' verdict above is caused by the flip, not by the fixture.
    expect(normalizeSimulationRules(base).presetId).toBe('dramatic_campaign');
  });
});
