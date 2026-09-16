/**
 * temperamentPresets.test.js — R-6 TEMPERAMENT PRESETS.
 *
 * Pins: application is DETERMINISTIC; a temperament bundles ONLY EXISTING dials
 * (no new tuning constants / no new physics); every base preset is a real
 * SIMULATION_RULE_PRESETS entry; and the module never mutates the preset catalog.
 */
import { describe, it, expect } from 'vitest';
import {
  TEMPERAMENTS, temperamentById, applyTemperament, overridesAreExistingKeysOnly,
} from '../../src/domain/worldPulse/temperamentPresets.js';
import {
  SIMULATION_RULE_PRESETS, DEFAULT_SIMULATION_RULES, normalizeSimulationRules,
} from '../../src/domain/worldPulse/simulationRules.js';

const KEYS = new Set(Object.keys(DEFAULT_SIMULATION_RULES));

describe('R-6 temperament presets', () => {
  it('every temperament names a REAL base preset', () => {
    for (const t of TEMPERAMENTS) {
      expect(SIMULATION_RULE_PRESETS[t.basePreset], `unknown base preset ${t.basePreset}`).toBeTruthy();
    }
  });

  it('NO NEW TUNING CONSTANTS: overrides use only EXISTING rule keys', () => {
    expect(overridesAreExistingKeysOnly()).toBe(true);
    for (const t of TEMPERAMENTS) {
      for (const k of Object.keys(t.overrides)) expect(KEYS.has(k)).toBe(true);
    }
  });

  it('DETERMINISTIC: applyTemperament(id) is a pure function of the id', () => {
    for (const t of TEMPERAMENTS) {
      expect(applyTemperament(t.id)).toEqual(applyTemperament(t.id));
    }
  });

  it('a temperament resolves to exactly its base preset composed with its overrides', () => {
    for (const t of TEMPERAMENTS) {
      const base = SIMULATION_RULE_PRESETS[t.basePreset].rules;
      expect(applyTemperament(t.id)).toEqual(normalizeSimulationRules({ ...base, ...t.overrides }));
    }
  });

  it('a real bundle: the long winter is a steady realm WITH seasons lit (an existing flag)', () => {
    const winter = applyTemperament('the_long_winter');
    expect(winter.seasonsEnabled).toBe(true);
    // …and it is otherwise the realistic_regional base (differs only by the toggle).
    const steady = applyTemperament('steady_realm');
    expect(steady.seasonsEnabled).toBe(false);
  });

  it('produces a VALID normalized ruleset (the normalizer accepted every value)', () => {
    for (const t of TEMPERAMENTS) {
      const rules = applyTemperament(t.id);
      expect(rules.schemaVersion).toBe(DEFAULT_SIMULATION_RULES.schemaVersion);
      // Booleans stay booleans (fail-closed normalizer never coerced a bundle value to garbage).
      expect(typeof rules.stressorsEnabled).toBe('boolean');
    }
  });

  it('does NOT mutate the shared preset catalog', () => {
    const before = JSON.stringify(SIMULATION_RULE_PRESETS);
    TEMPERAMENTS.forEach((t) => applyTemperament(t.id));
    expect(JSON.stringify(SIMULATION_RULE_PRESETS)).toBe(before);
  });

  it('unknown temperament ids resolve to null', () => {
    expect(temperamentById('nonesuch')).toBeNull();
    expect(applyTemperament('nonesuch')).toBeNull();
  });
});
