/**
 * tests/data/metropolisBandPosition.test.js — X-46 car 1b, U3 (the readers at scale).
 *
 * Car 4's population tilt reads a settlement's position inside its band. The metropolis roll runs
 * to 1,000,000 (the owner, 2026-11-04), so the position is read on a LOG scale over the whole
 * roll [15,000, 1,000,000], clamped: a linear read would pin every city past the body at the top.
 */
import { describe, test, expect } from 'vitest';

import { metropolisBandPosition, METROPOLIS_ROLL_TUNING } from '../../src/data/constants.js';

describe('metropolisBandPosition — the log position inside the metropolis band', () => {
  test('the anchors read from the one table: 15,000 -> 0, 1,000,000 -> 1', () => {
    expect(metropolisBandPosition(METROPOLIS_ROLL_TUNING.bodyMin)).toBe(0);
    expect(metropolisBandPosition(METROPOLIS_ROLL_TUNING.tailMax)).toBeCloseTo(1, 12);
  });

  test('the body edge 50,000 at 0.287, 130,000 at 0.514 (mid-band), monotone', () => {
    expect(metropolisBandPosition(50000)).toBeCloseTo(0.287, 3);
    expect(metropolisBandPosition(130000)).toBeCloseTo(0.514, 3);
    const xs = [15000, 20000, 50000, 130000, 400000, 1000000].map(metropolisBandPosition);
    expect(xs).toEqual([...xs].sort((a, b) => a - b));
  });

  test('clamped outside the band; NaN at 0', () => {
    expect(metropolisBandPosition(1500000)).toBe(1);
    expect(metropolisBandPosition(5000)).toBe(0);
    expect(metropolisBandPosition(Number.NaN)).toBe(0);
  });
});
