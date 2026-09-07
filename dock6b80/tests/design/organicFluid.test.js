/**
 * tests/design/organicFluid.test.js — the fluid type + space scale CONTRACT
 * (Organic Craft law §4). Pins: every step is a real clamp() that grows toward
 * desktop; the reading tier stays >=16px; and the MOBILE COMPRESSION is real —
 * the display steps carry a larger mobile→desktop spread than the reading steps,
 * so the hierarchy is tight on a phone and opens up on a monitor.
 */
import { describe, expect, it } from 'vitest';

import { TYPE, SPACE, fluid, spread } from '../../src/design/organic/fluidScale.js';

const CLAMP_RE = /^clamp\(([\d.]+)rem,\s*(-?[\d.]+)rem\s*\+\s*([\d.]+)vw,\s*([\d.]+)rem\)$/;

describe('fluid() helper', () => {
  it('emits a well-formed clamp(min, intercept+slope, max) with min<max', () => {
    const m = CLAMP_RE.exec(fluid(16, 24));
    expect(m, 'clamp shape').not.toBeNull();
    const [, minRem, , slopeVw, maxRem] = m.map(Number);
    expect(minRem).toBeLessThan(maxRem);
    expect(slopeVw).toBeGreaterThan(0); // grows with the viewport
  });

  it('is deterministic (same inputs → byte-identical string)', () => {
    expect(fluid(16, 24)).toBe(fluid(16, 24));
  });

  it('a no-growth step collapses to a flat (zero-slope) clamp', () => {
    const m = CLAMP_RE.exec(fluid(13, 13));
    expect(Number(m[3])).toBe(0);
  });
});

describe('TYPE scale', () => {
  it('every step has min<=max and a matching clamp', () => {
    for (const [name, s] of Object.entries(TYPE)) {
      expect(s.max, `${name} grows toward desktop`).toBeGreaterThanOrEqual(s.min);
      expect(s.clamp).toBe(fluid(s.min, s.max));
    }
  });

  it('the reading tier stays >=16px even at the mobile floor', () => {
    expect(TYPE.body.min).toBeGreaterThanOrEqual(16);
    expect(TYPE.bodyLarge.min).toBeGreaterThanOrEqual(16);
  });

  it('the display tier is the period voice at 24px+ (desktop)', () => {
    for (const k of ['displayS', 'displayM', 'displayL', 'displayXL']) {
      expect(TYPE[k].max).toBeGreaterThanOrEqual(24);
    }
  });

  it('MOBILE COMPRESSION: display steps open up more than body does', () => {
    // The mobile→desktop spread is larger for the big type — that is exactly the
    // scale compressing on phones and opening on desktop.
    expect(spread(TYPE.displayXL)).toBeGreaterThan(spread(TYPE.body));
    expect(spread(TYPE.displayL)).toBeGreaterThan(spread(TYPE.bodyLarge));
    // Chrome (ui) barely scales at all.
    expect(spread(TYPE.uiM)).toBeLessThan(spread(TYPE.displayM));
  });

  it('display maxes ascend monotonically (a real modular scale)', () => {
    const maxes = ['displayS', 'displayM', 'displayL', 'displayXL'].map((k) => TYPE[k].max);
    for (let i = 1; i < maxes.length; i++) expect(maxes[i]).toBeGreaterThan(maxes[i - 1]);
  });
});

describe('SPACE scale', () => {
  it('ascends monotonically at both ends and scales with type (clamp per step)', () => {
    const keys = Object.keys(SPACE);
    for (let i = 1; i < keys.length; i++) {
      expect(SPACE[keys[i]].min).toBeGreaterThan(SPACE[keys[i - 1]].min);
      expect(SPACE[keys[i]].max).toBeGreaterThan(SPACE[keys[i - 1]].max);
    }
    for (const s of Object.values(SPACE)) expect(s.clamp).toBe(fluid(s.min, s.max));
  });
});
