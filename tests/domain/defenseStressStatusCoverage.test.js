/**
 * defenseStressStatusCoverage.test.js — cycle-3 Wave 2, H3 pin.
 *
 * THE BUG (H3). DEFENSE_STRESS_STATUS (src/domain/display/defenseDisplay.js) — the
 * ACTIVE-MILITARY-STATUS table the web DefenseTab and the PDF defenseSlice both
 * read — was a hand-maintained literal covering only 6 of the 15 stress types the
 * generator emits. A settlement whose active stress was wartime, insurgency,
 * slave_revolt, monster_pressure, mass_migration, religious_conversion, indebted,
 * succession_void, or infiltrated raised NO military-status callout at all.
 *
 * THE FIX. DEFENSE_STRESS_STATUS is DERIVED from the producer table
 * (STRESS_TYPE_MAP) — posture from each entry's `militaryPosture`, colour from its
 * own `colour` — so it covers EVERY registered stress type and cannot silently
 * fall behind again. This pin asserts total coverage, the exact 9 that were dark,
 * and that the original 6 kept BYTE-IDENTICAL posture+colour (the golden-neutral
 * guarantee for already-covered settlements).
 */
import { describe, it, expect } from 'vitest';
import { DEFENSE_STRESS_STATUS } from '../../src/domain/display/defenseDisplay.js';
import { STRESS_TYPE_MAP } from '../../src/data/stressTypes.js';

const PREVIOUSLY_MISSING = [
  'wartime', 'insurgency', 'slave_revolt', 'monster_pressure', 'mass_migration',
  'religious_conversion', 'indebted', 'succession_void', 'infiltrated',
];

// The 6 that were covered BEFORE the fix, with their exact prior posture+colour.
const ORIGINAL_SIX = {
  under_siege:           { posture: 'ACTIVE SIEGE',         colour: '#8b1a1a' },
  famine:                { posture: 'INTERNAL PRESSURE',    colour: '#8b5a1a' },
  occupied:              { posture: 'UNDER OCCUPATION',     colour: '#4a3a6b' },
  politically_fractured: { posture: 'COMMAND SPLIT',        colour: '#5a4a1a' },
  recently_betrayed:     { posture: 'SECURITY COMPROMISED', colour: '#6b1a2a' },
  plague_onset:          { posture: 'QUARANTINE ACTIVE',    colour: '#2a5a2a' },
};

describe('H3 — DEFENSE_STRESS_STATUS covers the full producer stress vocabulary', () => {
  it('every registered stress type raises a military status (exact set, both ways)', () => {
    const producer = Object.keys(STRESS_TYPE_MAP).sort();
    const consumer = Object.keys(DEFENSE_STRESS_STATUS).sort();
    expect(consumer).toEqual(producer);
    expect(producer).toHaveLength(15);
  });

  it('every entry carries a non-empty posture and colour (no silent blank)', () => {
    for (const [type, status] of Object.entries(DEFENSE_STRESS_STATUS)) {
      expect(typeof status.posture, `${type} posture`).toBe('string');
      expect(status.posture.length, `${type} posture is non-empty`).toBeGreaterThan(0);
      expect(status.colour, `${type} colour`).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it('the 9 previously-dark stress types now raise a callout (the H3 symptom)', () => {
    for (const type of PREVIOUSLY_MISSING) {
      expect(DEFENSE_STRESS_STATUS[type], `${type} must now have a status`).toBeTruthy();
      expect(DEFENSE_STRESS_STATUS[type].posture).toBeTruthy();
    }
  });

  it('the original 6 keep byte-identical posture + colour (golden-neutral for covered settlements)', () => {
    for (const [type, expected] of Object.entries(ORIGINAL_SIX)) {
      expect(DEFENSE_STRESS_STATUS[type]).toEqual(expected);
    }
  });
});
