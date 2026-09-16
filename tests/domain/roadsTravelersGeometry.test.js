/**
 * roadsTravelersGeometry.test.js — pure geometry for the Travelers overlay (R-6; §13).
 */
import { describe, it, expect } from 'vitest';
import { progress01, pointAlongPath, chevronPoints, clamp01 } from '../../src/domain/roads/travelersGeometry.js';

describe('roads travelers geometry (§13)', () => {
  it('progress01 clamps and handles bad spans', () => {
    expect(progress01(5, 0, 10)).toBe(0.5);
    expect(progress01(0, 0, 10)).toBe(0);
    expect(progress01(20, 0, 10)).toBe(1); // clamped
    expect(progress01(5, 10, 10)).toBe(0); // zero span
    expect(progress01(5, 10, 0)).toBe(0); // negative span
  });

  it('clamp01 is total (non-finite -> 0)', () => {
    expect(clamp01(0.4)).toBe(0.4);
    expect(clamp01(-1)).toBe(0);
    expect(clamp01(2)).toBe(1);
    expect(clamp01(undefined)).toBe(0);
    expect(clamp01(NaN)).toBe(0);
  });

  it('pointAlongPath interpolates by DISTANCE along a two-hop path', () => {
    // A---(10)---B---(30)---C : total 40. t=0.5 -> distance 20 -> 10 into the B->C segment.
    const pts = [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 40, y: 0 }];
    const mid = pointAlongPath(pts, 0.5);
    expect(mid.x).toBeCloseTo(20, 5);
    expect(mid.y).toBeCloseTo(0, 5);
    expect(mid.angleDeg).toBeCloseTo(0, 5); // heading east
    expect(pointAlongPath(pts, 0).x).toBeCloseTo(0, 5);
    expect(pointAlongPath(pts, 1).x).toBeCloseTo(40, 5);
  });

  it('pointAlongPath reports the heading (south = +90 in SVG y-down)', () => {
    const down = pointAlongPath([{ x: 0, y: 0 }, { x: 0, y: 10 }], 0.5);
    expect(down.angleDeg).toBeCloseTo(90, 5);
  });

  it('pointAlongPath returns null for fewer than two valid points', () => {
    expect(pointAlongPath([{ x: 0, y: 0 }], 0.5)).toBeNull();
    expect(pointAlongPath([{ x: 0, y: 0 }, { x: NaN, y: 1 }], 0.5)).toBeNull();
    expect(pointAlongPath(null, 0.5)).toBeNull();
  });

  it('chevronPoints is deterministic and centred', () => {
    const pts = chevronPoints(100, 100, 0, 5);
    expect(pts.split(' ')).toHaveLength(3);
    expect(pts).toBe('105.00,100.00 95.00,103.50 95.00,96.50');
  });
});
