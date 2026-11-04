/**
 * X-46 car 3 — THE CURVE (docs/DESIGN_X46_SCALE_TRAIN.md §4): `INSTITUTION_BUDGET_ANCHORS` and
 * `expectedHousesAt`, log-linear between the seven anchors, flat outside them.
 */
import { describe, expect, it } from 'vitest';
import { INSTITUTION_BUDGET_ANCHORS, expectedHousesAt } from '../../src/data/institutionBudget.js';

describe('X-46 car 3 — the institution budget curve', () => {
  it('holds the seven anchors the design names, ascending', () => {
    expect(INSTITUTION_BUDGET_ANCHORS.map((a) => [...a])).toEqual([
      [5, 1.5], [30, 3], [100, 6], [400, 14], [2500, 35], [15000, 75], [60000, 120],
    ]);
    expect(Object.isFrozen(INSTITUTION_BUDGET_ANCHORS)).toBe(true);
  });

  it('reads each anchor exactly', () => {
    for (const [p, h] of INSTITUTION_BUDGET_ANCHORS) expect(expectedHousesAt(p)).toBeCloseTo(h, 12);
  });

  it('is log-linear between anchors: the geometric mean of two anchors reads their arithmetic mean', () => {
    expect(expectedHousesAt(Math.sqrt(100 * 400))).toBeCloseTo(10, 9); // 200 people
    expect(expectedHousesAt(Math.sqrt(2500 * 15000))).toBeCloseTo(55, 9);
  });

  it('meets the budget at every band end (1–3 / 2–6 / 5–14 / 12–35 / 30–75 / 70+)', () => {
    const ends = { thorp: [5, 30, 1, 3], hamlet: [20, 100, 2, 6], village: [75, 400, 5, 14], town: [300, 2500, 12, 35], city: [2000, 15000, 30, 75] };
    for (const [lo, hi, bLo, bHi] of Object.values(ends)) {
      expect(expectedHousesAt(lo)).toBeGreaterThanOrEqual(bLo);
      expect(expectedHousesAt(hi)).toBeLessThanOrEqual(bHi);
    }
    expect(expectedHousesAt(15000)).toBeGreaterThanOrEqual(70);
  });

  it('is monotone and flat outside the table', () => {
    let prev = -Infinity;
    for (let p = 1; p <= 80000; p = Math.ceil(p * 1.07)) { const h = expectedHousesAt(p); expect(h).toBeGreaterThanOrEqual(prev); prev = h; }
    expect(expectedHousesAt(1)).toBe(1.5);
    expect(expectedHousesAt(0)).toBe(1.5);
    expect(expectedHousesAt(Number.NaN)).toBe(1.5);
    expect(expectedHousesAt(1e6)).toBe(120);
  });
});
