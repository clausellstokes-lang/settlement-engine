/**
 * X-46 car 3 — THE CURVE (docs/DESIGN_X46_SCALE_TRAIN.md §4): `INSTITUTION_BUDGET_ANCHORS` and
 * `expectedHousesAt`, log-linear between the seven anchors, flat outside them.
 */
import { describe, expect, it } from 'vitest';
import { INSTITUTION_BUDGET_ANCHORS, expectedHousesAt, tierBudgetTerms } from '../../src/data/institutionBudget.js';
import { POPULATION_RANGES, TIER_ORDER } from '../../src/data/constants.js';

describe('X-46 car 3 — the institution budget curve', () => {
  // THE TOP ANCHOR (the chair's ruling, 2026-11-04, rung-1 pins unit 3): 60,000 → 120 was
  // unreachable as authored — the metropolis catalogue saturates at realised(4) = 77.92 optional
  // houses + R 15 ≈ 93 (X46-3 report §9) — so the anchor is the catalogue's measured ceiling, 93.
  it('holds the seven anchors the design names, ascending', () => {
    expect(INSTITUTION_BUDGET_ANCHORS.map((a) => [...a])).toEqual([
      [5, 3], [30, 5], [100, 8], [400, 16], [2500, 36], [15000, 76], [60000, 93],
    ]);
    expect(Object.isFrozen(INSTITUTION_BUDGET_ANCHORS)).toBe(true);
  });

  it('reads each anchor exactly', () => {
    for (const [p, h] of INSTITUTION_BUDGET_ANCHORS) expect(expectedHousesAt(p)).toBeCloseTo(h, 12);
  });

  it('is log-linear between anchors: the geometric mean of two anchors reads their arithmetic mean', () => {
    expect(expectedHousesAt(Math.sqrt(100 * 400))).toBeCloseTo(12, 9); // 200 people
    expect(expectedHousesAt(Math.sqrt(2500 * 15000))).toBeCloseTo(56, 9);
  });

  // THE CHAIR'S RULING (2026-11-04, the fabric STOP, option C): a budget cannot sit below the
  // catalogue's required baseline, so every band's minimum must exceed its tier's required
  // non-fabric count R by at least one house. The chair proposed 3 / 4 / 8 / 16 / 36 / 76 / 120;
  // at the measured R (2 / 3 / 6 / 11 / 15 / 15) the 20-person hamlet read 3.77 against R 3, so
  // the 30-person anchor rose by the least whole house, 4 → 5 (the ruling's own remedy).
  it('puts every band minimum at least one house above the tier\'s required houses', () => {
    for (const tier of TIER_ORDER) {
      expect(expectedHousesAt(POPULATION_RANGES[tier].min) - tierBudgetTerms(tier).R, tier).toBeGreaterThanOrEqual(1);
    }
  });

  it('is monotone and flat outside the table', () => {
    let prev = -Infinity;
    for (let p = 1; p <= 80000; p = Math.ceil(p * 1.07)) { const h = expectedHousesAt(p); expect(h).toBeGreaterThanOrEqual(prev); prev = h; }
    expect(expectedHousesAt(1)).toBe(3);
    expect(expectedHousesAt(0)).toBe(3);
    expect(expectedHousesAt(Number.NaN)).toBe(3);
    // the metropolis roll runs past 100,000 (x46-1b's tail): beyond 60,000 the curve is flat at
    // the catalogue's ceiling by design
    expect(expectedHousesAt(1e6)).toBe(93);
    expect(expectedHousesAt(100000)).toBe(93);
  });
});
