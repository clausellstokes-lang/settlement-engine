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

import { buildTownMapModel } from '../../src/domain/townMap/index.js';
import { buildTownMapDrawList, buildTownMapSvg } from '../../src/domain/townMap/townMapDraw.js';
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
  it('exposes exactly the four named base lenses', () => {
    expect([...TOWN_MAP_STYLE_IDS]).toEqual(['parchment', 'watercolor', 'darkFantasy', 'vtt']);
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

  it('the emitted draw list only ever uses the five primitive op types (no escape hatch)', () => {
    const KNOWN = new Set(['poly', 'line', 'circle', 'rect', 'path']);
    const model = richModel();
    for (const id of TOWN_MAP_STYLE_IDS) {
      for (const op of buildTownMapDrawList(model, id)) expect(KNOWN.has(op.t)).toBe(true);
    }
  });
});

describe('map styles — geometry untouched (a re-skin never moves a shape)', () => {
  it('the three furniture-free lenses share an identical geometry signature', () => {
    const model = richModel();
    const sig = (id) => geomSigList(buildTownMapDrawList(model, id));
    // parchment/watercolor/darkFantasy carry no furniture ⇒ same op set, same geometry.
    expect(sig('watercolor')).toBe(sig('parchment'));
    expect(sig('darkFantasy')).toBe(sig('parchment'));
  });

  it('VTT keeps the SAME map geometry — it only ADDS furniture (grid + scale bar)', () => {
    const model = richModel();
    const parch = buildTownMapDrawList(model, 'parchment');
    const vtt = buildTownMapDrawList(model, 'vtt');
    // The VTT list is the parchment map geometry with furniture prepended (grid)
    // and appended (scale bar); the shared middle geometry must match parchment.
    const parchSig = geomSigList(parch);
    const vttSigs = vtt.map(geomSig);
    expect(vttSigs.join('|')).toContain(parchSig);
    expect(vtt.length).toBeGreaterThan(parch.length); // furniture added
  });
});

describe('map styles — determinism re-minted (seed, style) → identical bytes', () => {
  it('each lens is byte-deterministic (same model+style → identical ops AND SVG)', () => {
    const model = richModel();
    for (const id of TOWN_MAP_STYLE_IDS) {
      expect(stable(buildTownMapDrawList(model, id))).toBe(stable(buildTownMapDrawList(model, id)));
      expect(buildTownMapSvg(model, { style: id })).toBe(buildTownMapSvg(model, { style: id }));
    }
  });

  it('the four lenses are mutually DISTINCT (a lens actually changes the render)', () => {
    const model = richModel();
    const svgs = TOWN_MAP_STYLE_IDS.map((id) => buildTownMapSvg(model, { style: id }));
    expect(new Set(svgs).size).toBe(4);
  });

  it('the DEFAULT (no style arg) is byte-identical to explicit parchment', () => {
    const model = richModel();
    expect(stable(buildTownMapDrawList(model))).toBe(stable(buildTownMapDrawList(model, 'parchment')));
    expect(stable(buildTownMapDrawList(model))).toBe(stable(buildTownMapDrawList(model, DEFAULT_STYLE_ID)));
    expect(buildTownMapSvg(model)).toBe(buildTownMapSvg(model, { style: 'parchment' }));
  });
});

describe('map styles — the CROSS-LENS EDIT pin (a semantic edit renders under every lens)', () => {
  it('a pin nudge shifts the SAME building geometry under every lens', () => {
    const s = makeTownFixture({ tier: 'city', terrain: 'plains', walls: true, water: false, seed: 'xlens-edit' });
    const base = buildTownMapModel(s, null);
    // Nudge a real building by its anchorKey (a semantic mapEdit).
    const anchor = base.buildings.find((b) => b.kind === 'landmark').anchorKey;
    const edited = buildTownMapModel(s, withPinNudge(null, anchor, 37, -21));

    const sigBase = geomSigList(buildTownMapDrawList(base, 'parchment'));
    const sigEdited = new Set(TOWN_MAP_STYLE_IDS.map((id) => geomSigList(buildTownMapDrawList(edited, id))
      // strip VTT furniture so the comparison is over the shared map geometry
      .split('|').filter((x) => !x.startsWith('line:') || !/,0$|,1000$/.test(x)).join('|')));

    // 1) The edit actually changed the geometry (base ≠ edited).
    expect(geomSigList(buildTownMapDrawList(edited, 'parchment'))).not.toBe(sigBase);
    // 2) The three furniture-free lenses render the edited geometry IDENTICALLY.
    const editedSig = (id) => geomSigList(buildTownMapDrawList(edited, id));
    expect(editedSig('watercolor')).toBe(editedSig('parchment'));
    expect(editedSig('darkFantasy')).toBe(editedSig('parchment'));
    // 3) VTT's map geometry (its op list contains the parchment edited geometry).
    expect(buildTownMapDrawList(edited, 'vtt').map(geomSig).join('|')).toContain(editedSig('parchment'));
  });
});

describe('map styles — self-contained SVG per lens (canvas-taint-free)', () => {
  it('no lens emits an external reference, and every viewBox is fixed', () => {
    const model = richModel();
    for (const id of TOWN_MAP_STYLE_IDS) {
      const svg = buildTownMapSvg(model, { style: id });
      expect(svg.startsWith('<svg')).toBe(true);
      expect(svg).toContain('viewBox="0 0 1000 1000"');
      expect(/<image\b/i.test(svg)).toBe(false);
      expect(/href\s*=/i.test(svg)).toBe(false);
      expect(/url\(/i.test(svg)).toBe(false);
    }
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
