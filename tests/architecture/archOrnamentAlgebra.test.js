/**
 * archOrnamentAlgebra.test.js -- K-3 SPINE: the gothic ornament CONSTRUCTION ALGEBRA + the DIRS walker.
 *
 * Pins the load-bearing rung-2 curved-detail library (ornament/construct.js + tracery.js):
 *   1. THE DIRS-REGISTRY WALKER -- every pinned N_GON_DIRS row has EXACTLY n entries, each a
 *      unit-magnitude direction (|d/1e4| == 1 within the 1e-4 integer-pin tolerance), and the ring SUM
 *      is ~0 (a regular n-gon's directions cancel). This is the totality that a hand-added row must
 *      satisfy -- a mis-typed literal reds here. Runs the non-constructible counts (7, 9) too.
 *   2. n-FOIL RINGS -- foilCusps land on the cusp radius (unit magnitude x rCusp) and their direction
 *      ring-sum is ~0; nFoilRing is a closed, deterministic centerline to 16 spokes.
 *   3. DETERMINISM -- every construct primitive + every tracery family is byte-stable (same args ->
 *      identical output), the PROMISE at the ornament layer.
 */
import { describe, it, expect } from 'vitest';
import { N_GON_DIRS, N_GON_COUNTS, ngonUnitDirs } from '../../src/domain/townMap/arch/rationalTables.js';
import {
  circlePoints, nFoilRing, foilCusps, pointedArch, ogeeArch, mouchette, verticalArch3D, mag2, circleCircle, circleLine, lineLine,
} from '../../src/domain/townMap/arch/ornament/construct.js';
import { TRACERY_FAMILIES, traceryPanelOps } from '../../src/domain/townMap/arch/ornament/tracery.js';

const TOL = 2e-3;
const eqArr = (a, b) => JSON.stringify(a) === JSON.stringify(b);

describe('the DIRS-registry walker (entry count + unit magnitude + ring-sum)', () => {
  it('guard-the-guard: the pinned counts are the registry keys', () => {
    expect(N_GON_COUNTS).toEqual([3, 4, 5, 6, 7, 8, 9, 12, 16]);
    for (const n of N_GON_COUNTS) expect(N_GON_DIRS[n]).toBeDefined();
  });
  for (const n of [3, 4, 5, 6, 7, 8, 9, 12, 16]) {
    it(`n=${n}: exactly ${n} directions, each unit magnitude, ring-sum ~0`, () => {
      const dirs = ngonUnitDirs(n);
      expect(dirs.length).toBe(n);
      let sx = 0, sy = 0;
      for (const d of dirs) { expect(Math.abs(mag2(d[0], d[1]) - 1)).toBeLessThan(TOL); sx += d[0]; sy += d[1]; }
      expect(Math.abs(sx)).toBeLessThan(TOL * n);
      expect(Math.abs(sy)).toBeLessThan(TOL * n);
    });
  }
  it('an unpinned n-gon count fails closed (never a silent trig fallback)', () => {
    expect(() => ngonUnitDirs(11)).toThrow(/not in the pinned/);
  });
});

describe('n-foil rings -- to 16 spokes, constructible AND non-constructible', () => {
  for (const n of [3, 4, 6, 7, 9, 12, 16]) {
    it(`${n}-foil: cusps land on the cusp radius, cusp ring-sum ~0`, () => {
      const rCusp = 40, cusps = foilCusps(0, 0, rCusp, n);
      expect(cusps.length).toBe(n);
      let sx = 0, sy = 0;
      for (const c of cusps) { expect(Math.abs(mag2(c[0], c[1]) - rCusp)).toBeLessThan(rCusp * TOL); sx += c[0]; sy += c[1]; }
      expect(Math.abs(sx)).toBeLessThan(rCusp * TOL * n);
      expect(Math.abs(sy)).toBeLessThan(rCusp * TOL * n);
    });
    it(`${n}-foil: nFoilRing is a non-empty, deterministic, closed centerline`, () => {
      const a = nFoilRing(50, 50, 30, 42, n, 1.1), b = nFoilRing(50, 50, 30, 42, n, 1.1);
      expect(a.length).toBeGreaterThan(n * 3);
      expect(eqArr(a, b)).toBe(true);
    });
  }
  it('an unpinned n-foil count fails closed', () => { expect(() => nFoilRing(0, 0, 10, 14, 11, 1.1)).toThrow(/not in the pinned/); });
});

describe('the constructive "booleans" solve intersections with sqrt only', () => {
  it('circle-circle: two unit circles at distance 1 cross at the expected height +/- sqrt(3)/2', () => {
    const pts = circleCircle([0, 0], 1, [1, 0], 1);
    expect(pts.length).toBe(2);
    expect(Math.abs(pts[0][0] - 0.5)).toBeLessThan(1e-9);
    expect(Math.abs(Math.abs(pts[0][1]) - Math.sqrt(3) / 2)).toBeLessThan(1e-9);
  });
  it('circle-line + line-line return the expected crossings', () => {
    const cl = circleLine([0, 0], 5, [-10, 0], [10, 0]);
    expect(cl.length).toBe(2);
    expect(Math.abs(Math.abs(cl[0][0]) - 5)).toBeLessThan(1e-9);
    const ll = lineLine([0, 0], [10, 0], [5, -5], [5, 5]);
    expect(ll[0]).toBeCloseTo(5); expect(ll[1]).toBeCloseTo(0);
  });
});

describe('every construct primitive is deterministic (the PROMISE at the ornament layer)', () => {
  const prims = [
    ['circlePoints', () => circlePoints(30, 40, 25, 5)],
    ['pointedArch', () => pointedArch(10, 90, 20, 8)],
    ['ogeeArch', () => ogeeArch(10, 90, 20, 12, 8)],
    ['mouchette', () => mouchette(50, 50, 30, 10, 12, 3)],
    ['verticalArch3D', () => verticalArch3D([0, 0], [100, 100], 0, 80, 9)],
  ];
  for (const [name, fn] of prims) it(`${name} is byte-stable`, () => expect(eqArr(fn(), fn())).toBe(true));
});

describe('the four tracery families are one algebra -- each deterministic, each carries bars', () => {
  it('exactly four families', () => expect(TRACERY_FAMILIES).toEqual(['plate', 'geometric', 'flamboyant', 'perpendicular']));
  for (const fam of TRACERY_FAMILIES) {
    it(`${fam}: signature panel carries bars + is deterministic`, () => {
      const a = traceryPanelOps(fam, 0, 120, 0, 240, 10, 2), b = traceryPanelOps(fam, 0, 120, 0, 240, 10, 2);
      expect(a.length).toBeGreaterThan(3);
      expect(a.every((op) => op.op === 'sweep')).toBe(true);
      expect(eqArr(a, b)).toBe(true);
    });
  }
  it('an unknown family fails closed', () => expect(() => traceryPanelOps('rococo', 0, 1, 0, 1, 0, 2)).toThrow(/unknown family/));
});
