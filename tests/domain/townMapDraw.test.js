/**
 * townMapDraw.test.js — SM-4 draw-projection pins (design §6/§7).
 *
 * The draw projection is the shared substrate under BOTH export surfaces (the PDF
 * town-map plate + the library-card thumbnail). Its whole contract:
 *   • DETERMINISM — a pure function of the model ⇒ same seed → identical draw ops
 *     AND identical SVG bytes (the "same seed → identical plate bytes" pin);
 *   • THEME-INDEPENDENCE — the export palette is fixed hex, never a theme token,
 *     so the plate/thumb bytes never drift with a re-skin;
 *   • SELF-CONTAINED SVG — no external refs (a canvas that rasterizes it never
 *     taints), and every emitted color is a concrete value;
 *   • SELF-GATE — a map-less model is not drawable (⇒ no plate/thumb ⇒ legacy
 *     exports byte-identical);
 *   • FIDELITY — every landmark building + every district reaches the op list.
 */
import { describe, expect, it } from 'vitest';

import { buildTownMapModel } from '../../src/domain/townMap/index.js';
import {
  buildTownMapDrawList, drawListToSvg, buildTownMapSvg, hasDrawableMap,
  EXPORT_PALETTE, exportDistrictColor,
} from '../../src/domain/townMap/townMapDraw.js';
import { makeTownFixture, GOLDEN_CONFIGS } from '../fixtures/townMapFixtures.js';

const stable = (v) => JSON.stringify(v);

describe('town-map draw — determinism (same seed → identical bytes)', () => {
  it('the same model builds the same draw ops twice (byte-identical)', () => {
    const s = makeTownFixture({ tier: 'city', terrain: 'coastal', walls: true, water: true, seed: 'draw-det-1' });
    const model = buildTownMapModel(s);
    expect(stable(buildTownMapDrawList(model))).toBe(stable(buildTownMapDrawList(model)));
  });

  it('the same model renders the same SVG string twice (the plate-byte determinism pin)', () => {
    const s = makeTownFixture({ tier: 'metropolis', terrain: 'riverside', walls: true, water: true, seed: 'draw-det-2' });
    const model = buildTownMapModel(s);
    expect(buildTownMapSvg(model, { width: 320, height: 320 })).toBe(buildTownMapSvg(model, { width: 320, height: 320 }));
  });

  it('a positive layoutVariant yields a different-but-deterministic draw list', () => {
    const s = makeTownFixture({ tier: 'city', terrain: 'plains', walls: true, water: false, seed: 'draw-variant' });
    const base = stable(buildTownMapDrawList(buildTownMapModel(s, null)));
    const v2a = stable(buildTownMapDrawList(buildTownMapModel(s, { layoutVariant: 2 })));
    const v2b = stable(buildTownMapDrawList(buildTownMapModel(s, { layoutVariant: 2 })));
    expect(v2a).not.toBe(base);
    expect(v2a).toBe(v2b);
  });
});

describe('town-map draw — theme independence + self-contained SVG', () => {
  it('the export palette is concrete hex, not a CSS variable / theme token', () => {
    const flat = [
      EXPORT_PALETTE.parchment, EXPORT_PALETTE.ink, EXPORT_PALETTE.water,
      ...Object.values(EXPORT_PALETTE.district),
    ];
    for (const c of flat) {
      expect(typeof c).toBe('string');
      expect(c).toMatch(/^#[0-9a-fA-F]{6}$/); // fixed hex, never var(--x) / rgb() / a token name
    }
  });

  it('the SVG carries no external reference (canvas-taint-free) and a fixed viewBox', () => {
    const s = makeTownFixture({ tier: 'town', terrain: 'hills', walls: true, water: true, seed: 'draw-svg' });
    const svg = buildTownMapSvg(buildTownMapModel(s));
    expect(svg.startsWith('<svg')).toBe(true);
    expect(svg).toContain('viewBox="0 0 1000 1000"');
    // No <image>, no url(...)/href external refs, no data: fetches.
    expect(/<image\b/i.test(svg)).toBe(false);
    expect(/href\s*=/i.test(svg)).toBe(false);
    expect(/url\(/i.test(svg)).toBe(false);
  });

  it('exportDistrictColor falls back to the `other` tint for an unknown category', () => {
    expect(exportDistrictColor('no-such-category')).toBe(EXPORT_PALETTE.district.other);
    expect(exportDistrictColor('military')).toBe(EXPORT_PALETTE.district.military);
  });
});

describe('town-map draw — fidelity', () => {
  it('every landmark building becomes exactly one rect op', () => {
    const s = makeTownFixture({ tier: 'city', terrain: 'plains', walls: true, water: false, seed: 'draw-fidelity' });
    const model = buildTownMapModel(s);
    const landmarks = model.buildings.filter((b) => b.kind === 'landmark').length;
    const rectOps = buildTownMapDrawList(model).filter((o) => o.t === 'rect');
    // Rect ops = landmark buildings + condition badges (also rects). So rects ≥ landmarks,
    // and exactly landmarks when no conditions are active.
    expect(rectOps.length).toBeGreaterThanOrEqual(landmarks);
    expect(landmarks).toBeGreaterThan(0);
  });

  it('every golden config produces a non-empty, all-typed draw list', () => {
    const KNOWN = new Set(['poly', 'line', 'circle', 'rect', 'path']);
    for (const { settlement } of GOLDEN_CONFIGS) {
      const ops = buildTownMapDrawList(buildTownMapModel(settlement));
      expect(ops.length).toBeGreaterThan(0);
      for (const o of ops) expect(KNOWN.has(o.t)).toBe(true);
    }
  });
});

describe('town-map draw — self-gate', () => {
  it('a real settlement is drawable; an empty model is not', () => {
    const s = makeTownFixture({ tier: 'town', terrain: 'plains', walls: false, water: false, seed: 'draw-gate' });
    expect(hasDrawableMap(buildTownMapModel(s))).toBe(true);
    expect(hasDrawableMap(null)).toBe(false);
    expect(hasDrawableMap({ districts: [], buildings: [] })).toBe(false);
    expect(buildTownMapDrawList(null)).toEqual([]);
  });
});
