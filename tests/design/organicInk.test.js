/**
 * tests/design/organicInk.test.js — the ink tonal ramp + rubric CONTRACT
 * (Organic Craft law §3/§6). Contrast floors live in tests/design/contrast.test.js;
 * this file pins the ramp's SHAPE: it is one monotone tonal ramp (depth = ink,
 * not elevation), frozen, and the light steps map 1:1 to the shipped ink tokens
 * so phase 1 is a zero-visual-regression foundation.
 */
import { describe, expect, it } from 'vitest';

import { INK, FIELD_INK, INK_RAMP_ORDER, INK_TEXT_STEPS, FIELD_TEXT_STEPS } from '../../src/design/organic/ink.js';
import { RUBRIC, FIELD_RUBRIC, RUBRIC_ROLES } from '../../src/design/organic/rubrication.js';
import { color } from '../../src/design/tokens.js';

// WCAG relative luminance (self-contained — no rendered pixels needed).
function channel(c) { const s = c / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); }
function lum(hex) {
  const n = parseInt(/^#([0-9a-f]{6})$/i.exec(hex.trim())[1], 16);
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
}

describe('ink ramp — shape', () => {
  it('is a frozen object with exactly the ramp-order keys', () => {
    expect(Object.isFrozen(INK)).toBe(true);
    expect(Object.keys(INK).sort()).toEqual([...INK_RAMP_ORDER].sort());
  });

  it('darkens monotonically from deepest to hairline (depth = ink, not shadow)', () => {
    // Walking the order most-ink → least-ink, luminance strictly increases.
    for (let i = 1; i < INK_RAMP_ORDER.length; i++) {
      const prev = INK[INK_RAMP_ORDER[i - 1]];
      const cur = INK[INK_RAMP_ORDER[i]];
      expect(lum(cur), `${INK_RAMP_ORDER[i]} must be lighter than ${INK_RAMP_ORDER[i - 1]}`).toBeGreaterThan(lum(prev));
    }
  });

  it('the light text steps map 1:1 to the shipped ink tokens (zero-regression foundation)', () => {
    expect(INK.deepest).toBe(color['ink-900']);
    expect(INK.strong).toBe(color['ink-800']);
    expect(INK.body).toBe(color['ink-600']);
  });

  it('the hairline is NOT one of the text steps', () => {
    expect(INK_TEXT_STEPS).not.toContain('hairline');
    expect(INK_TEXT_STEPS.every((s) => s in INK)).toBe(true);
  });
});

describe('field ink ramp — shape', () => {
  it('is frozen and its text steps lighten monotonically on the dark ground', () => {
    expect(Object.isFrozen(FIELD_INK)).toBe(true);
    // On a dark ground, more ink = LIGHTER; the text steps run brightest → faintest.
    for (let i = 1; i < FIELD_TEXT_STEPS.length; i++) {
      const prev = FIELD_INK[FIELD_TEXT_STEPS[i - 1]];
      const cur = FIELD_INK[FIELD_TEXT_STEPS[i]];
      expect(lum(cur)).toBeLessThan(lum(prev));
    }
  });

  it('ground and panel are darker than every text step (a legible dark surface)', () => {
    for (const step of FIELD_TEXT_STEPS) {
      expect(lum(FIELD_INK[step])).toBeGreaterThan(lum(FIELD_INK.ground));
      expect(lum(FIELD_INK[step])).toBeGreaterThan(lum(FIELD_INK.panel));
    }
  });
});

describe('rubric — one reserved voice', () => {
  it('exposes exactly the two tones, frozen, for both grounds', () => {
    expect(Object.isFrozen(RUBRIC)).toBe(true);
    expect(Object.keys(RUBRIC).sort()).toEqual(['entry', 'rubric']);
    expect(Object.keys(FIELD_RUBRIC).sort()).toEqual(['entry', 'rubric']);
  });

  it('every role resolves to a real rubric tone (applied from spec, never ad hoc)', () => {
    for (const tone of Object.values(RUBRIC_ROLES)) {
      expect(tone in RUBRIC).toBe(true);
    }
  });

  it('the apparatus red is a distinct hue from the destructive error red', () => {
    expect(RUBRIC.rubric).not.toBe(color['red-600']);
  });
});
