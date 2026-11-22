/**
 * townMapStyles.test.js — MAP STYLES: the bounded style layer + the four lenses.
 *
 * The style layer is the theming architecture on top of the frozen semantic-draw
 * split. Its whole contract:
 *   • THE WALL — a style selects ONLY from fixed renderer capabilities (hex,
 *     numbers, furniture kinds, glyph names). Never arbitrary SVG/code: ugly-never-
 *     unsafe. Bespoke AI styles (a later wave) land as data of this same shape.
 *   • GEOMETRY UNTOUCHED — a style changes color / line-weight / opacity /
 *     decoration ONLY; every position, polygon, and element size is identical under
 *     every lens (proven by a geometry signature that ignores visual attributes).
 *   • DETERMINISM RE-MINTED — (model, style) → byte-identical ops + SVG; the four
 *     lenses are mutually distinct.
 *   • DEFAULT = PARCHMENT — the default lens is byte-identical to the pre-style-layer
 *     export (the no-arg draw list === the 'parchment' draw list).
 *   • CROSS-LENS EDIT — a semantic mapEdit (a pin nudge) renders correctly under
 *     every lens (the same shifted geometry, whatever the skin).
 *   • SELF-CONTAINED — every lens' SVG stays canvas-taint-free (no <image>/href/url()).
 */
import { describe, expect, it } from 'vitest';

import { buildTownMapModel } from '../../src/domain/townMap/townMapModel.js';
import { withPinNudge } from '../../src/domain/townMap/mapEdits.js';
import {
  TOWN_MAP_STYLE_IDS, DEFAULT_STYLE_ID, FURNITURE_KINDS, HAZARD_GLYPHS, ANCHOR_GLYPHS,
  CONTRAST_LEVELS, resolveTownMapStyle, coerceStyleId, styleDistrictColor, viewerPalette,
} from '../../src/design/townMapStyles.js';
import { makeTownFixture, GOLDEN_CONFIGS } from '../fixtures/townMapFixtures.js';

const stable = (v) => JSON.stringify(v);
const HEX = /^#[0-9a-fA-F]{3,8}$/;

/** A style-INDEPENDENT geometry signature of an op: its type + positional fields
 *  only (never fill/stroke/opacity/strokeWidth), so two lenses with identical
 *  geometry but different skins produce identical signatures. */
function geomSig(op) {
  switch (op.t) {
    case 'poly': return `poly:${op.closed}:${op.pts.map((p) => p.join(',')).join(' ')}`;
    case 'line': return `line:${op.x1},${op.y1},${op.x2},${op.y2}`;
    case 'circle': return `circle:${op.cx},${op.cy},${op.r}`;
    case 'rect': return `rect:${op.x},${op.y},${op.w},${op.h},${op.rx || 0}`;
    case 'path': return `path:${op.d}`;
    default: return `?:${op.t}`;
  }
}
const geomSigList = (ops) => ops.map(geomSig).join('|');

const richModel = () => buildTownMapModel(GOLDEN_CONFIGS[10].settlement); // city / coastal / walls / water


describe('map styles — registry + resolver', () => {
  it('exposes exactly the five named base lenses (parchment…vtt + the SM-5 accessible lens)', () => {
    expect([...TOWN_MAP_STYLE_IDS]).toEqual(['parchment', 'watercolor', 'darkFantasy', 'vtt', 'accessible']);
    expect(DEFAULT_STYLE_ID).toBe('parchment');
  });

  it('resolves every lens to a full, frozen definition with every required field', () => {
    for (const id of TOWN_MAP_STYLE_IDS) {
      const s = resolveTownMapStyle(id);
      expect(s.id).toBe(id);
      expect(Object.isFrozen(s)).toBe(true);
      expect(typeof s.label).toBe('string');
      for (const k of ['palette', 'district', 'stroke', 'opacity', 'functional']) {
        expect(s[k] && typeof s[k]).toBe('object');
      }
      expect(HEX.test(s.background)).toBe(true);
    }
  });

  it('an unknown id fails SAFE to parchment; coerceStyleId coerces', () => {
    expect(resolveTownMapStyle('no-such-lens').id).toBe('parchment');
    expect(resolveTownMapStyle(null).id).toBe('parchment');
    expect(resolveTownMapStyle(undefined).id).toBe('parchment');
    expect(coerceStyleId('vtt')).toBe('vtt');
    expect(coerceStyleId('bogus')).toBe('parchment');
    expect(coerceStyleId(42)).toBe('parchment');
  });

  it('resolution is identity-stable (cached) and idempotent on a resolved object', () => {
    const a = resolveTownMapStyle('watercolor');
    expect(resolveTownMapStyle('watercolor')).toBe(a);       // cached identity
    expect(resolveTownMapStyle(a)).toBe(a);                   // pass-through
  });
});

describe('map styles — THE WALL (select from fixed capabilities, never arbitrary code)', () => {
  it('every furniture kind, glyph, and contrast level is in the fixed vocabulary', () => {
    for (const id of TOWN_MAP_STYLE_IDS) {
      const s = resolveTownMapStyle(id);
      for (const f of s.furniture) expect(FURNITURE_KINDS).toContain(f);
      expect(HAZARD_GLYPHS).toContain(s.hazardGlyph);
      expect(ANCHOR_GLYPHS).toContain(s.anchorGlyph);
      expect(CONTRAST_LEVELS).toContain(s.contrast);
    }
  });

  it('every palette + district value is a concrete hex literal (no var()/token/code)', () => {
    for (const id of TOWN_MAP_STYLE_IDS) {
      const s = resolveTownMapStyle(id);
      for (const v of [...Object.values(s.palette), ...Object.values(s.district), s.background]) {
        expect(typeof v).toBe('string');
        expect(v, `${id}: ${v} is not a concrete hex`).toMatch(HEX);
      }
    }
  });

  it('every stroke / opacity value is a finite number (a measurement, not a program)', () => {
    for (const id of TOWN_MAP_STYLE_IDS) {
      const s = resolveTownMapStyle(id);
      for (const v of [...Object.values(s.stroke), ...Object.values(s.opacity)]) {
        expect(typeof v).toBe('number');
        expect(Number.isFinite(v)).toBe(true);
      }
    }
  });

  // ⚰ THE OP-KIND ESCAPE-HATCH pin measured the RENDERER, not the style data, and the renderer
  // was retired under ODQ §725/§772. The wall's own claims — that a style carries only hex,
  // numbers and vocabulary members — are asserted above from the style definitions themselves,
  // which is where they always belonged.
});

// ⚰ FOUR RENDERER-EXPRESSED BLOCKS LEFT WITH THE RENDERER (ODQ §725/§772): geometry-untouched,
// determinism-re-minted, the cross-lens edit pin and the self-contained-SVG pin. Every one of
// them was a claim of the form "the DRAW of a model under lens X has property P" — and there is
// no draw. ⚠ Naming what actually went, because a re-skin family losing its geometry-identity
// proof is worth a reader's attention rather than a silent deletion: the surviving guarantee is
// that the five lenses remain bounded DATA of one shape (asserted above), and that a settlement's
// MODEL is byte-stable (the committed model goldens, which this wave re-proved unmoved). The
// geometry-identity property is not re-provable without a renderer, and inventing one to test
// with would be a test proving a thing this product no longer does.

describe('map styles — the ACCESSIBILITY LENS (SM-5, deliverable 6)', () => {
  it('is a colorblind-safe lens: every district category carries a DISTINCT tint', () => {
    const s = resolveTownMapStyle('accessible');
    const tints = Object.values(s.district);
    // 12 categories, 12 distinct hex tints — no two categories collapse to one
    // colour (the colour-vision-deficiency distinguishability the lens exists for).
    expect(tints.length).toBe(12);
    expect(new Set(tints.map((t) => t.toLowerCase())).size).toBe(12);
  });

  it('is high-contrast (contrast level `high`, near-opaque district strokes)', () => {
    const s = resolveTownMapStyle('accessible');
    expect(s.contrast).toBe('high');
    expect(s.opacity.districtStroke).toBeGreaterThanOrEqual(0.85);
    expect(s.opacity.wallStroke).toBeGreaterThanOrEqual(0.9);
  });

});

describe('map styles — accessors', () => {
  it('styleDistrictColor resolves per lens with an `other` fallback', () => {
    expect(styleDistrictColor('military', 'vtt')).toBe(resolveTownMapStyle('vtt').district.military);
    expect(styleDistrictColor('no-such', 'vtt')).toBe(resolveTownMapStyle('vtt').district.other);
    // Different lenses tint the same category differently.
    expect(styleDistrictColor('military', 'parchment')).not.toBe(styleDistrictColor('military', 'darkFantasy'));
  });

  it('viewerPalette exposes a concrete role map + a district() accessor for a lens', () => {
    const vp = viewerPalette('vtt');
    for (const role of ['bg', 'water', 'road', 'street', 'anchor', 'wall', 'gate', 'buildingFill', 'ink']) {
      expect(vp[role]).toMatch(HEX);
    }
    expect(vp.district('military')).toMatch(HEX);
    expect(vp.grid).toBe(50); // VTT grid step surfaced to the viewer
    expect(viewerPalette('parchment').grid).toBe(0);
  });
});
