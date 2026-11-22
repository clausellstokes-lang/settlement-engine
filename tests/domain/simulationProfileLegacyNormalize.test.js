/**
 * simulationProfileLegacyNormalize.test.js — CL-0 gate (a) + (f).
 *
 * THE CONSTITUTIONAL LAW: absent profile = legacy behavior, byte-exact,
 * virtual. tests/fixtures/cl0-legacy-normalize-pin.json was captured from the
 * PRE-CL0 normalizer (HEAD, 2026-07-11) — normalizeSimulationRules({}) plus
 * every boolean flag at true/false and every enum at each value. The post-CL0
 * normalizer must reproduce each of those outputs BYTE-IDENTICALLY (same keys,
 * same values, same key order) for profile-absent inputs: no new persisted
 * fields, no value drift, per flag.
 *
 * Gate (f): presetIdForRules still back-derives every named preset (the legacy
 * trio + the four §11 presets) and custom detection still fires.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, test } from 'vitest';

import {
  CUSTOM_SIMULATION_PRESET_ID,
  PROFILE_KEYS,
  SIMULATION_RULE_PRESETS,
  normalizeSimulationRules,
} from '../../src/domain/worldPulse/simulationRules.js';

const pin = JSON.parse(readFileSync(
  resolve(process.cwd(), 'tests', 'fixtures', 'cl0-legacy-normalize-pin.json'),
  'utf8',
));

describe('CL-0 (a) — absent profile normalizes byte-exact to the pre-CL0 output, per flag', () => {
  test('the pin is non-trivial', () => {
    expect(Object.keys(pin.perFlag).length).toBeGreaterThan(20);
    expect(pin.empty.presetId).toBe('realistic_regional');
  });

  test('normalize({}) is byte-identical to HEAD (keys, values, AND key order)', () => {
    const now = normalizeSimulationRules({});
    expect(now).toEqual(pin.empty);
    expect(JSON.stringify(now)).toBe(JSON.stringify(pin.empty));
  });

  test('no profile key ever materializes from a profile-absent input', () => {
    for (const key of PROFILE_KEYS) {
      expect(pin.empty).not.toHaveProperty(key); // the pin itself predates the profile
      expect(normalizeSimulationRules({})).not.toHaveProperty(key);
      expect(normalizeSimulationRules({ warLayerEnabled: true })).not.toHaveProperty(key);
    }
  });

  for (const [flag, variants] of Object.entries(pin.perFlag)) {
    test(`{ ${flag} } normalizes byte-identical to HEAD for every pinned value`, () => {
      for (const [variant, expected] of Object.entries(variants)) {
        const value = variant === 'true' ? true : variant === 'false' ? false : variant;
        const now = normalizeSimulationRules({ [flag]: value });
        expect(now, `${flag}:${variant}`).toEqual(expected);
        expect(JSON.stringify(now), `${flag}:${variant} key order`).toBe(JSON.stringify(expected));
      }
    });
  }
});

describe('CL-0 (f) — presetIdForRules back-derives all named presets + custom', () => {
  for (const id of Object.keys(SIMULATION_RULE_PRESETS)) {
    test(`${id} round-trips to itself`, () => {
      expect(normalizeSimulationRules(SIMULATION_RULE_PRESETS[id].rules).presetId).toBe(id);
    });
  }

  test('a legacy dramatic_campaign light-shape save now re-infers as custom (accepted preset-lighting drift)', () => {
    // What a pre-CL0 save actually stored: legacy keys only, war/faith/seasons flags off.
    const legacyDramatic = {
      presetId: 'dramatic_campaign',
      propagationMode: 'full',
      intensity: 'dramatic',
      majorChangesRequireProposal: false,
      migrationMode: 'distributed',
    };
    // Owner ruling (golden sign-off — LIGHT EVERYTHING RECOMMENDED) lit dramatic_campaign
    // with the real drama set (war/faith/seasons/disasters). Its structural signature grew,
    // so a legacy LIGHT-shaped save no longer matches it and re-infers as 'custom'. This is
    // the ACCEPTED display-only rulesMatchPreset drift: the stored rules run identically; only
    // the preset LABEL shown changes. The other untouched legacy presets still round-trip
    // (see the '${id} round-trips to itself' loop above, incl. realistic_regional / quiet_local).
    expect(normalizeSimulationRules(legacyDramatic).presetId).toBe('custom');
  });

  test('custom detection still fires across the grown catalog', () => {
    const base = SIMULATION_RULE_PRESETS.living_realm.rules;
    const mutated = normalizeSimulationRules({ ...base, stressorsEnabled: false });
    expect(mutated.presetId).toBe(CUSTOM_SIMULATION_PRESET_ID);
    // Anti-vacuity: the unmutated base still matches its own preset.
    expect(normalizeSimulationRules(base).presetId).toBe('living_realm');
  });

  test('freezing a preset world reads as modified; unfreezing restores its identity', () => {
    const frozen = normalizeSimulationRules({ ...SIMULATION_RULE_PRESETS.living_realm.rules, worldProgression: 'frozen' });
    expect(frozen.presetId).toBe(CUSTOM_SIMULATION_PRESET_ID);
    const thawed = normalizeSimulationRules({ ...frozen, presetId: 'living_realm', worldProgression: 'dm_advanced' });
    expect(thawed.presetId).toBe('living_realm');
  });
});
