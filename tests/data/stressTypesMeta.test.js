/**
 * Drift detection: STRESS_TYPE_META (pure data, used by customRegistry
 * at app boot) must list the same stressor keys as STRESS_TYPE_MAP
 * (full data + runtime closures, used by the engine pipeline).
 *
 * If someone adds a stressor to one and forgets the other, the
 * Compendium UI silently drops the new stressor — this catches that.
 */

import { describe, test, expect } from 'vitest';
import { STRESS_TYPE_META } from '../../src/data/stressTypesMeta.js';
import { STRESS_TYPE_MAP } from '../../src/data/stressTypes.js';

describe('stressTypesMeta drift', () => {
  test('meta and full map have identical keys', () => {
    const metaKeys = Object.keys(STRESS_TYPE_META).sort();
    const fullKeys = Object.keys(STRESS_TYPE_MAP).sort();
    expect(metaKeys).toEqual(fullKeys);
  });

  test('every meta entry has the three required fields, all non-empty strings', () => {
    for (const [key, meta] of Object.entries(STRESS_TYPE_META)) {
      expect(typeof meta.label, `${key}.label`).toBe('string');
      expect(meta.label.length, `${key}.label`).toBeGreaterThan(0);
      expect(typeof meta.historyColour, `${key}.historyColour`).toBe('string');
      expect(meta.historyColour.length, `${key}.historyColour`).toBeGreaterThan(0);
      expect(typeof meta.viabilityNote, `${key}.viabilityNote`).toBe('string');
      expect(meta.viabilityNote.length, `${key}.viabilityNote`).toBeGreaterThan(0);
    }
  });

  test('meta label/historyColour/viabilityNote match the full map values', () => {
    for (const [key, meta] of Object.entries(STRESS_TYPE_META)) {
      const full = STRESS_TYPE_MAP[key];
      expect(full).toBeDefined();
      expect(meta.label, `${key}.label`).toBe(full.label);
      expect(meta.historyColour, `${key}.historyColour`).toBe(full.historyColour);
      // viabilityNote in STRESS_TYPE_MAP can be a string OR a function; we
      // only mirror the string-typed ones (which is all of them today).
      // If a future entry uses a function, the meta needs an explicit
      // copy of the equivalent string.
      expect(typeof full.viabilityNote, `${key}.viabilityNote`).toBe('string');
      expect(meta.viabilityNote, `${key}.viabilityNote`).toBe(full.viabilityNote);
    }
  });
});
