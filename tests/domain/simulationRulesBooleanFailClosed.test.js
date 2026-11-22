import { describe, expect, test } from 'vitest';

import {
  DEFAULT_SIMULATION_RULES,
  normalizeSimulationRules,
} from '../../src/domain/worldPulse/simulationRules.js';

// Fail-closed guard for the boolean-rule coercion in normalizeSimulationRules.
// The old code did `input[key] !== false`, so any defined non-false value —
// null, 0, '', the STRING 'false' — coerced a default-OFF war flag to TRUE,
// silently activating opt-in war-economy features from a corrupted or
// loosely-typed saved rules blob. An opt-in flag must require an EXPLICIT
// boolean true; everything else falls back to the key's default. This pins
// the flags-off byte-identity invariant at the normalization chokepoint.

// Reconstruct the boolean key bank from the public default surface (same
// pattern as simulationRulesPreset.stability.test.js) so this test tracks
// real flags as they land instead of a frozen copy.
const BOOLEAN_KEYS = Object.entries(DEFAULT_SIMULATION_RULES)
  .filter(([, value]) => typeof value === 'boolean')
  .map(([key]) => key);
const DEFAULT_OFF_KEYS = BOOLEAN_KEYS.filter(key => DEFAULT_SIMULATION_RULES[key] === false);
const DEFAULT_ON_KEYS = BOOLEAN_KEYS.filter(key => DEFAULT_SIMULATION_RULES[key] === true);

const MALFORMED_VALUES = [null, 0, '', 'false', 'true', 1, [], {}, NaN];

describe('normalizeSimulationRules — boolean flags fail closed', () => {
  // Anti-vacuity: both banks are non-trivial, and the headline war gate is
  // genuinely default-off (the premise the whole guard rests on).
  test('the default surface has both default-off and default-on boolean keys', () => {
    expect(DEFAULT_OFF_KEYS.length).toBeGreaterThan(0);
    expect(DEFAULT_ON_KEYS.length).toBeGreaterThan(0);
    expect(DEFAULT_OFF_KEYS).toContain('warLayerEnabled');
    expect(DEFAULT_OFF_KEYS).toContain('warForageEnabled');
  });

  test('malformed values keep every default-off flag OFF', () => {
    for (const key of DEFAULT_OFF_KEYS) {
      for (const bad of MALFORMED_VALUES) {
        expect(
          normalizeSimulationRules({ [key]: bad })[key],
          `${key}: ${JSON.stringify(String(bad))} must not activate a default-off flag`,
        ).toBe(false);
      }
    }
  });

  test('malformed values leave every default-on flag ON', () => {
    for (const key of DEFAULT_ON_KEYS) {
      for (const bad of MALFORMED_VALUES) {
        expect(
          normalizeSimulationRules({ [key]: bad })[key],
          `${key}: ${JSON.stringify(String(bad))} must fall back to the default (true)`,
        ).toBe(true);
      }
    }
  });

  test('explicit booleans are honored in both directions for every key', () => {
    for (const key of BOOLEAN_KEYS) {
      expect(normalizeSimulationRules({ [key]: true })[key]).toBe(true);
      expect(normalizeSimulationRules({ [key]: false })[key]).toBe(false);
    }
  });

  test('an absent key uses the key default', () => {
    const normalized = normalizeSimulationRules({});
    for (const key of BOOLEAN_KEYS) {
      expect(normalized[key]).toBe(DEFAULT_SIMULATION_RULES[key]);
    }
  });

  // The concrete repro from the finding, pinned verbatim so a regression to
  // truthiness coercion fails with an unmistakable message.
  test('regression: {warForageEnabled: null} stays OFF', () => {
    expect(normalizeSimulationRules({ warForageEnabled: null }).warForageEnabled).toBe(false);
  });
});
