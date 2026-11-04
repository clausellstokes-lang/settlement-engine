/**
 * tests/data/metropolisBandPosition.test.js — X-46 car 1b, U3 (the readers at scale).
 *
 * Car 4's population tilt reads a settlement's position inside its band. For the metropolis the
 * band is open (the owner, 2026-11-04: "it should not have a cap"), so the linear position over
 * [min, max] would pin every tail city at the top. metropolisBandPosition reads it on a LOG scale
 * over [15,000, 1,000,000]: 15,000 -> 0, 1,000,000 -> 1, clamped both ways. A 130,000-person city
 * sits mid-band: ln(130,000/15,000) / ln(1,000,000/15,000) = 0.514 (the chair's brief said 0.46;
 * the brief's own anchors give 0.514, and the anchors are the law — flagged in the report).
 */
import { describe, test, expect } from 'vitest';

import { metropolisBandPosition, METROPOLIS_ROLL_TUNING } from '../../src/data/constants.js';

describe('metropolisBandPosition — the log position inside the open band', () => {
  test('the anchors: 15,000 -> 0 and 1,000,000 -> 1, read from the one table', () => {
    expect(metropolisBandPosition(METROPOLIS_ROLL_TUNING.bodyMin)).toBe(0);
    expect(metropolisBandPosition(METROPOLIS_ROLL_TUNING.tailMax)).toBeCloseTo(1, 12);
  });

  test('a 130,000-person city sits mid-band (0.514), not pinned at the top', () => {
    expect(metropolisBandPosition(130000)).toBeCloseTo(0.514, 3);
  });

  test('the body edge 60,000 sits a third of the way; monotone; clamped outside the band', () => {
    expect(metropolisBandPosition(60000)).toBeCloseTo(0.330, 3);
    const xs = [15000, 20000, 60000, 130000, 400000, 1000000].map(metropolisBandPosition);
    expect(xs).toEqual([...xs].sort((a, b) => a - b));
    expect(metropolisBandPosition(5000)).toBe(0);
    expect(metropolisBandPosition(1500000)).toBe(1);
    expect(metropolisBandPosition(Number.NaN)).toBe(0);
  });
});
