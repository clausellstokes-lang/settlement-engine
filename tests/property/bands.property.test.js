/**
 * Property-based tests for src/domain/state/bands.js
 *
 *   1. bandFor is total over [0,100] — every integer maps to a valid band
 *   2. bandFor is monotonic — higher value never produces a worse band
 *   3. clamp01 is idempotent + handles non-finite via 50 fallback
 *   4. severityFor (the bands.js one, not status.js) partitions all
 *      reals into 'major'|'moderate'|'minor'
 *
 * These functions live on the boundary between numeric derivation and
 * the UI's coarse labels — every chip, badge, and PDF stripe reads them.
 * If a regression makes bandFor return undefined for one value, three
 * tabs go blank simultaneously.
 */

import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import { bandFor, clamp01, severityFor } from '../../src/domain/state/bands.js';

const BAND_RANK = { Critical: 0, Vulnerable: 1, Strained: 2, Stable: 3 };
const VALID_BANDS = new Set(['Critical', 'Vulnerable', 'Strained', 'Stable']);

describe('bands (property-based)', () => {
  test('bandFor is total over [0,100]', () => {
    fc.assert(fc.property(
      fc.integer({ min: 0, max: 100 }),
      (v) => { expect(VALID_BANDS.has(bandFor(v))).toBe(true); },
    ), { numRuns: 60 });
    // Non-finite fallback — bands.js treats Infinity/NaN identically
    // (returns the "Strained" middle band rather than picking a side).
    expect(bandFor(NaN)).toBe('Strained');
    expect(bandFor(Infinity)).toBe('Strained');
    expect(bandFor(-Infinity)).toBe('Strained');
  });

  test('bandFor is monotonic — higher value never produces a worse band', () => {
    fc.assert(fc.property(
      fc.integer({ min: 0, max: 100 }),
      fc.integer({ min: 0, max: 100 }),
      (a, b) => {
        const [lo, hi] = a <= b ? [a, b] : [b, a];
        expect(BAND_RANK[bandFor(hi)]).toBeGreaterThanOrEqual(BAND_RANK[bandFor(lo)]);
      },
    ), { numRuns: 60 });
  });

  test('clamp01 is idempotent + falls back to 50 on non-finite', () => {
    fc.assert(fc.property(
      fc.double({ noNaN: true }),
      (v) => {
        const once  = clamp01(v);
        const twice = clamp01(once);
        expect(twice).toBe(once);
        expect(once).toBeGreaterThanOrEqual(0);
        expect(once).toBeLessThanOrEqual(100);
      },
    ), { numRuns: 60 });
    // Non-finite anchors — clamp01 falls back to 50 for ANY non-finite
    // value (NaN, undefined, ±Infinity), not just NaN. The defensive
    // intent: a non-finite score should not silently become 0 or 100,
    // because either would push the band-mapping into a degenerate cell.
    expect(clamp01(NaN)).toBe(50);
    expect(clamp01(undefined)).toBe(50);
    expect(clamp01(Infinity)).toBe(50);
    expect(clamp01(-Infinity)).toBe(50);
  });

  test('severityFor partitions all reals into major/moderate/minor', () => {
    fc.assert(fc.property(
      fc.double({ noNaN: true, min: -1000, max: 1000 }),
      (delta) => {
        const result = severityFor(delta);
        expect(['major', 'moderate', 'minor']).toContain(result);
        const m = Math.abs(delta);
        // Cutoffs from bands.js: |Δ| ≥ 15 major, ≥ 7 moderate, else minor
        if (m >= 15) expect(result).toBe('major');
        else if (m >= 7) expect(result).toBe('moderate');
        else expect(result).toBe('minor');
      },
    ), { numRuns: 60 });
  });
});
