import { describe, it, expect } from 'vitest';
import {
  coverBaseScale,
  displayedSize,
  clampOffset,
  centeredOffset,
  cropRectFromTransform,
  outputSize,
} from '../../../src/components/gallery/cropGeometry.js';

const VIEWPORT = { w: 640, h: 360 }; // 16:9

describe('coverBaseScale', () => {
  it('scales by the LARGER ratio so the image fully covers the viewport', () => {
    // A tall image: width is the binding constraint (640/800 < 360/1000 is false…)
    // 4000×3000 image into 640×360 → max(640/4000, 360/3000) = max(0.16, 0.12) = 0.16
    expect(coverBaseScale({ w: 4000, h: 3000 }, VIEWPORT)).toBeCloseTo(0.16, 5);
  });

  it('a very wide image is bound by height', () => {
    // 4000×1000 → max(640/4000=0.16, 360/1000=0.36) = 0.36
    expect(coverBaseScale({ w: 4000, h: 1000 }, VIEWPORT)).toBeCloseTo(0.36, 5);
  });

  it('guards against zero / missing dims', () => {
    expect(Number.isFinite(coverBaseScale({}, VIEWPORT))).toBe(true);
    expect(Number.isFinite(coverBaseScale({ w: 100, h: 100 }, {}))).toBe(true);
  });
});

describe('displayedSize', () => {
  it('at zoom=1 the displayed image is ≥ the viewport on both axes (cover)', () => {
    const d = displayedSize({ w: 4000, h: 3000 }, VIEWPORT, 1);
    expect(d.w).toBeGreaterThanOrEqual(VIEWPORT.w - 1e-6);
    expect(d.h).toBeGreaterThanOrEqual(VIEWPORT.h - 1e-6);
  });

  it('zoom multiplies the base scale', () => {
    const a = displayedSize({ w: 4000, h: 3000 }, VIEWPORT, 1);
    const b = displayedSize({ w: 4000, h: 3000 }, VIEWPORT, 2);
    expect(b.w).toBeCloseTo(a.w * 2, 5);
    expect(b.scale).toBeCloseTo(a.scale * 2, 5);
  });
});

describe('clampOffset', () => {
  it('keeps the viewport covered: offset never positive, never past the far edge', () => {
    const natural = { w: 4000, h: 3000 };
    const { w: dw, h: dh } = displayedSize(natural, VIEWPORT, 1);
    // Try to drag way out of bounds in both directions.
    const farPos = clampOffset({ x: 999, y: 999 }, natural, VIEWPORT, 1);
    expect(farPos).toEqual({ x: 0, y: 0 });
    const farNeg = clampOffset({ x: -99999, y: -99999 }, natural, VIEWPORT, 1);
    expect(farNeg.x).toBeCloseTo(VIEWPORT.w - dw, 5);
    expect(farNeg.y).toBeCloseTo(VIEWPORT.h - dh, 5);
  });
});

describe('centeredOffset', () => {
  it('centres the displayed image and stays within clamp bounds', () => {
    const natural = { w: 4000, h: 3000 };
    const c = centeredOffset(natural, VIEWPORT, 1);
    const clamped = clampOffset(c, natural, VIEWPORT, 1);
    expect(clamped.x).toBeCloseTo(c.x, 5);
    expect(clamped.y).toBeCloseTo(c.y, 5);
    expect(c.x).toBeLessThanOrEqual(0);
    expect(c.y).toBeLessThanOrEqual(0);
  });
});

describe('cropRectFromTransform', () => {
  it('a centered zoom=1 cover crop samples a centered landscape slab of the source', () => {
    const natural = { w: 4000, h: 3000 };
    const offset = centeredOffset(natural, VIEWPORT, 1);
    const rect = cropRectFromTransform({ natural, viewport: VIEWPORT, zoom: 1, offset });
    // base scale 0.16 → source width = 640/0.16 = 4000 (full width), height = 360/0.16 = 2250
    expect(rect.sx).toBe(0);
    expect(rect.sWidth).toBe(4000);
    expect(rect.sHeight).toBe(2250);
    expect(rect.sy).toBe(Math.round((3000 - 2250) / 2)); // vertically centered
  });

  it('zooming in samples a smaller source rect (more detail)', () => {
    const natural = { w: 4000, h: 3000 };
    const z1 = cropRectFromTransform({ natural, viewport: VIEWPORT, zoom: 1, offset: centeredOffset(natural, VIEWPORT, 1) });
    const z2 = cropRectFromTransform({ natural, viewport: VIEWPORT, zoom: 2, offset: centeredOffset(natural, VIEWPORT, 2) });
    expect(z2.sWidth).toBeLessThan(z1.sWidth);
    expect(z2.sHeight).toBeLessThan(z1.sHeight);
  });

  it('never samples outside the image bounds, even with extreme offsets', () => {
    const natural = { w: 4000, h: 3000 };
    const rect = cropRectFromTransform({ natural, viewport: VIEWPORT, zoom: 3, offset: { x: 99999, y: 99999 } });
    expect(rect.sx).toBeGreaterThanOrEqual(0);
    expect(rect.sy).toBeGreaterThanOrEqual(0);
    expect(rect.sx + rect.sWidth).toBeLessThanOrEqual(natural.w);
    expect(rect.sy + rect.sHeight).toBeLessThanOrEqual(natural.h);
  });
});

describe('outputSize', () => {
  it('derives a landscape height from the aspect, capped at maxWidth', () => {
    expect(outputSize(16 / 9, 1280)).toEqual({ w: 1280, h: 720 });
    expect(outputSize(3 / 2, 1200)).toEqual({ w: 1200, h: 800 });
  });
});
