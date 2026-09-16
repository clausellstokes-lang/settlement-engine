/**
 * townGlyphs.test.js — THE ILLUSTRATED TOWN (IT-1): the glyph library + compiler.
 *
 * Pins the load-bearing contract: glyphs COMPILE DOWN to the existing five primitive op
 * kinds (no new op kind, so every adapter renders them free), the compile is pure +
 * deterministic, the mirror bit flips the silhouette, the NW-light shadow group is
 * emitted, scaling honors the footprint, and the registry fails safe on an unknown set.
 */
import { describe, expect, it } from 'vitest';

import { compileGlyph, getGlyphSet, GLYPH_SET_IDS, FALLBACK_GLYPH_KIND, GLYPH_FOOTPRINT } from '../../src/design/townGlyphs/index.js';
import { MEDIEVAL_GLYPHS } from '../../src/design/townGlyphs/medieval.js';
import { resolveTownMapStyle } from '../../src/design/townMapStyles.js';

const STYLE = resolveTownMapStyle('parchment'); // has palette/stroke; shadow/roofFill default in the compiler
const TINT = '#884422';
const KNOWN_OPS = new Set(['poly', 'line', 'circle', 'rect', 'path']);
const stable = (v) => JSON.stringify(v);

const compile = (kind, extra = {}) => compileGlyph({ glyph: MEDIEVAL_GLYPHS[kind], cx: 500, cy: 500, style: STYLE, tint: TINT, ...extra });

describe('townGlyphs — the registry', () => {
  it('exposes the medieval set and fails safe on an unknown id', () => {
    expect(GLYPH_SET_IDS).toContain('medieval');
    expect(getGlyphSet('medieval')).toBe(MEDIEVAL_GLYPHS);
    expect(getGlyphSet('no-such-set')).toBeNull();
    expect(getGlyphSet(null)).toBeNull();
    expect(MEDIEVAL_GLYPHS[FALLBACK_GLYPH_KIND]).toBeTruthy();
  });

  it('every library glyph is a stroke list with a bounded stroke count', () => {
    for (const [kind, g] of Object.entries(MEDIEVAL_GLYPHS)) {
      expect(Array.isArray(g.strokes), `${kind} has no strokes`).toBe(true);
      expect(g.strokes.length, `${kind} too many strokes`).toBeLessThanOrEqual(12);
      expect(g.strokes.length).toBeGreaterThan(0);
    }
  });
});

describe('townGlyphs — the compiler compiles DOWN to the five op kinds', () => {
  it('every glyph emits ONLY poly | line | circle (a subset of the five; no new op kind)', () => {
    for (const kind of Object.keys(MEDIEVAL_GLYPHS)) {
      const ops = compile(kind);
      expect(ops.length).toBeGreaterThan(0);
      for (const op of ops) expect(KNOWN_OPS.has(op.t), `${kind} emitted ${op.t}`).toBe(true);
    }
  });

  it('is pure + deterministic (same inputs → byte-identical ops twice)', () => {
    for (const kind of Object.keys(MEDIEVAL_GLYPHS)) {
      expect(stable(compile(kind))).toBe(stable(compile(kind)));
    }
  });

  it('emits a 3-stroke NW-light ink shadow group (SE of the footprint)', () => {
    const ops = compile('spire');
    const shadow = ops.filter((o) => o.t === 'line' && o.strokeOpacity != null);
    expect(shadow.length).toBe(3);
    // shadow strokes drop down-right (SE): y2 > y1 and x2 > x1
    for (const s of shadow) {
      expect(s.y2).toBeGreaterThan(s.y1);
      expect(s.x2).toBeGreaterThan(s.x1);
    }
  });

  it('the mirror bit flips the silhouette horizontally (about the placed x)', () => {
    const a = compile('forge', { mirror: false });
    const b = compile('forge', { mirror: true });
    expect(stable(a)).not.toBe(stable(b));
    // the mirrored glyph reflects each x about cx (500): mean x stays centered
    const meanX = (ops) => {
      const xs = ops.flatMap((o) => (o.t === 'poly' ? o.pts.map((p) => p[0]) : o.t === 'line' ? [o.x1, o.x2] : o.t === 'circle' ? [o.cx] : []));
      return xs.reduce((s, x) => s + x, 0) / xs.length;
    };
    expect(Math.abs(meanX(a) - 500)).toBeLessThan(60);
    expect(Math.abs(meanX(b) - 500)).toBeLessThan(60);
  });

  it('scales with the footprint (a larger footprint spans a wider box)', () => {
    const spanX = (ops) => {
      const xs = ops.flatMap((o) => (o.t === 'poly' ? o.pts.map((p) => p[0]) : o.t === 'line' ? [o.x1, o.x2] : o.t === 'circle' ? [o.cx] : []));
      return Math.max(...xs) - Math.min(...xs);
    };
    const small = compile('manor-hall', { footprint: GLYPH_FOOTPRINT });
    const big = compile('manor-hall', { footprint: GLYPH_FOOTPRINT * 2 });
    expect(spanX(big)).toBeGreaterThan(spanX(small));
  });

  it('face polys wear the district tint outline; roofs carry a faint tint wash (colour signal preserved)', () => {
    const ops = compile('spire');
    const faces = ops.filter((o) => o.t === 'poly' && o.stroke === TINT);
    const roofs = ops.filter((o) => o.t === 'poly' && o.fill === TINT && o.fillOpacity != null);
    expect(faces.length).toBeGreaterThan(0);
    expect(roofs.length).toBeGreaterThan(0);
  });

  it('a missing glyph compiles to no ops (fail-safe)', () => {
    expect(compileGlyph({ glyph: null, cx: 1, cy: 1, style: STYLE, tint: TINT })).toEqual([]);
    expect(compileGlyph({ glyph: undefined, cx: 1, cy: 1, style: STYLE, tint: TINT })).toEqual([]);
  });
});
