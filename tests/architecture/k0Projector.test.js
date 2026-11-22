/**
 * k0Projector.test.js -- K-0 SPIKE gate (b): the bezier draw-op + byte-stable hidden surface.
 *
 * Pins the two load-bearing projector properties: (1) the axonometric projection is AFFINE, so
 * projecting a cubic's four control points and reconnecting them reproduces the projected curve
 * EXACTLY -- the "Bezier DrawOp add"; and (2) the hidden-surface sort is permutation-invariant
 * (deterministic tiebreak on depth then id codepoint), so equal-depth faces never reorder across
 * runs / input orderings.
 */
import { describe, it, expect } from 'vitest';
import { makeArchProjector, sortRenderables, subpathToPathD, projectSubpath } from '../../src/domain/townMap/arch/project.js';
import { cubicAt } from '../../src/domain/townMap/arch/geom.js';

describe('the projection is affine: projecting control points reproduces the curve', () => {
  it('project(cubicAt(P)) == cubicAt(project(P)) for all u (the bezier draw-op)', () => {
    const { projectRaw } = makeArchProjector();
    /** @type {[number,number,number]} */ const p0 = [12, 40, 5];
    /** @type {[number,number,number]} */ const c1 = [40, 10, 90];
    /** @type {[number,number,number]} */ const c2 = [130, 70, 40];
    /** @type {[number,number,number]} */ const p3 = [200, 20, 120];
    const q0 = projectRaw(p0), q1 = projectRaw(c1), q2 = projectRaw(c2), q3 = projectRaw(p3);
    for (const u of [0, 0.13, 0.37, 0.5, 0.62, 0.88, 1]) {
      const projectedThenEval = projectRaw(cubicAt(p0, c1, c2, p3, u));
      // evaluate the 2D bezier of the projected control points
      const v = 1 - u;
      const a = v * v * v, b = 3 * v * v * u, c = 3 * v * u * u, d = u * u * u;
      const ex = a * q0[0] + b * q1[0] + c * q2[0] + d * q3[0];
      const ey = a * q0[1] + b * q1[1] + c * q2[1] + d * q3[1];
      expect(Math.abs(projectedThenEval[0] - ex)).toBeLessThan(1e-9);
      expect(Math.abs(projectedThenEval[1] - ey)).toBeLessThan(1e-9);
    }
  });

  it('projectSubpath preserves segment structure and serializes to M/L/C only', () => {
    const { project } = makeArchProjector();
    const d = subpathToPathD(projectSubpath(project, {
      start: [0, 0, 0],
      segs: [{ t: 'C', c1: [10, 0, 0], c2: [20, 0, 10], p: [30, 0, 10] }, { t: 'L', p: [30, 0, 0] }],
      closed: true,
    }));
    expect(d.startsWith('M ')).toBe(true);
    expect(d.includes(' C ')).toBe(true);
    expect(d.includes(' L ')).toBe(true);
    expect(d.endsWith(' Z')).toBe(true);
    expect(/[AaHhVvSsQqTt]/.test(d)).toBe(false); // no arc / other commands
  });
});

describe('hidden-surface sort is byte-stable under ties (depth, then id codepoint)', () => {
  const items = [
    { id: 'face:pier.base.front', depth: 150 },
    { id: 'face:pier.base.west', depth: 150 }, // tie with base.front on depth
    { id: 'bar:flyer', depth: 90 },
    { id: 'face:wall', depth: 0 },
    { id: 'face:pier.top.front', depth: 150 }, // three-way depth tie
  ];

  it('produces the same order regardless of input permutation', () => {
    const canonical = sortRenderables(items).map((i) => i.id);
    const permutations = [
      [...items].reverse(),
      [items[2], items[0], items[4], items[1], items[3]],
      [items[4], items[3], items[2], items[1], items[0]],
    ];
    for (const p of permutations) {
      expect(sortRenderables(p).map((i) => i.id)).toEqual(canonical);
    }
  });

  it('orders far-to-near, ties broken by ascending id codepoint', () => {
    const order = sortRenderables(items).map((i) => i.id);
    expect(order[0]).toBe('face:wall');       // depth 0, nearest-last
    expect(order[1]).toBe('bar:flyer');       // depth 90
    // the three depth-150 ties resolve by id codepoint:
    expect(order.slice(2)).toEqual([
      'face:pier.base.front', 'face:pier.base.west', 'face:pier.top.front',
    ]);
  });

  it('does not mutate the input array', () => {
    const before = items.map((i) => i.id);
    sortRenderables(items);
    expect(items.map((i) => i.id)).toEqual(before);
  });
});
