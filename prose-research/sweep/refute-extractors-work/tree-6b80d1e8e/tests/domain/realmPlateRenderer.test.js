/**
 * realmPlateRenderer.test.js — the deterministic realm renderer's invariant pins (W7).
 *
 * The realm renderer (src/domain/realmMap/realmPlateRenderer.js) is the pure, headless
 * projection worldPlan → primitive draw ops → SVG that the landing realm-preview plates are
 * frozen from. These pins guard the capability the way the town map's goldens guard it:
 *   • DETERMINISM — same (seed, style) ⇒ byte-identical SVG (the frozen-plate contract).
 *   • WELL-FORMED — a self-contained SVG cropped to the wide realm band.
 *   • ON-LAND — every worldPlan settlement sits inside the seeded coastline (never stranded
 *     in the sea — the enclosing-radius invariant the coastline generator promises).
 *   • CONNECTED — the road web is a spanning tree (|sites| − 1 edges).
 *   • FINITE — no NaN/undefined leaks into the emitted coordinates.
 */
import { describe, it, expect } from 'vitest';
import { renderRealmPlate, deriveRealmScene, SHEET_W, SHEET_H } from '../../src/domain/realmMap/realmPlateRenderer.js';
import { deriveWorldPlan } from '../../src/domain/instantWorld/worldPlan.js';

/** Standard even-odd point-in-polygon (the coastline is a simple closed ring). */
function pointInPoly(px, py, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (((yi > py) !== (yj > py)) && (px < ((xj - xi) * (py - yi)) / (yj - yi) + xi)) inside = !inside;
  }
  return inside;
}

const SEEDS = ['fallowmere', 'cindermere', 'holloway', 'aldermoor'];
const STYLES = ['parchment', 'watercolor'];

describe('realm plate renderer — determinism', () => {
  for (const seed of SEEDS) {
    for (const styleId of STYLES) {
      it(`same (seed=${seed}, style=${styleId}) ⇒ byte-identical SVG`, () => {
        const a = renderRealmPlate({ seed, styleId }).svg;
        const b = renderRealmPlate({ seed, styleId }).svg;
        expect(a).toBe(b);
        expect(a.length).toBeGreaterThan(0);
      });
    }
  }
});

describe('realm plate renderer — output shape', () => {
  it('emits a well-formed SVG cropped to the wide realm band', () => {
    const { svg } = renderRealmPlate({ seed: 'fallowmere' });
    expect(svg.startsWith('<svg')).toBe(true);
    expect(svg.trimEnd().endsWith('</svg>')).toBe(true);
    expect(svg).toContain(`viewBox="0 0 ${SHEET_W} ${SHEET_H}"`);
    // the fixed square viewBox was rewritten (the crop happened)
    expect(svg).not.toContain(`viewBox="0 0 ${SHEET_W} ${SHEET_W}"`);
    // no NaN / undefined leaked into any attribute
    expect(svg).not.toMatch(/NaN|undefined/);
  });
});

describe('realm plate renderer — geometry invariants', () => {
  for (const seed of SEEDS) {
    it(`every settlement sits on land + roads span the realm (seed=${seed})`, () => {
      const plan = deriveWorldPlan({ seed });
      const scene = deriveRealmScene(plan);
      // on-land: no settlement stranded in the sea
      for (const s of scene.sites) {
        expect(pointInPoly(s.x, s.y, scene.coast), `${s.tier} at (${s.x},${s.y}) is outside the coastline`).toBe(true);
      }
      // spanning tree: |sites| − 1 edges, all endpoints in range
      expect(scene.roads.length).toBe(Math.max(0, scene.sites.length - 1));
      for (const [a, b] of scene.roads) {
        expect(a).toBeGreaterThanOrEqual(0);
        expect(b).toBeGreaterThanOrEqual(0);
        expect(a).toBeLessThan(scene.sites.length);
        expect(b).toBeLessThan(scene.sites.length);
      }
      // finite coordinates everywhere
      for (const [x, y] of scene.coast) {
        expect(Number.isFinite(x) && Number.isFinite(y)).toBe(true);
      }
    });
  }
});
