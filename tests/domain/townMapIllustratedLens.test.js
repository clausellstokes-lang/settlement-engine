/**
 * townMapIllustratedLens.test.js — THE ILLUSTRATED TOWN (IT-1): the `illustrated` lens.
 *
 * The illustrated lens is a SIXTH pickable lens that RE-SHAPES buildings into oblique
 * glyphs. It is deliberately NOT a member of TOWN_MAP_STYLE_IDS (the pure-re-skin,
 * golden/entitlement-pinned five) — it lives in TOWN_MAP_LENS_IDS. This pins: it resolves
 * + is wall-safe + persists like a base lens; its output DIFFERS from parchment (glyphs,
 * no 8px rects) yet stays self-contained + deterministic + compiled to the five op kinds;
 * and — the load-bearing invariant — the five re-skin lenses stay BYTE-IDENTICAL (they
 * never name glyphSet, so their building branch is the legacy rect; the golden pins that).
 */
import { describe, expect, it } from 'vitest';

import { buildTownMapModel } from '../../src/domain/townMap/index.js';
import { buildTownMapDrawList, buildTownMapSvg } from '../../src/domain/townMap/townMapDraw.js';
import {
  TOWN_MAP_STYLE_IDS, TOWN_MAP_LENS_IDS, ILLUSTRATED_STYLE_ID, DEFAULT_STYLE_ID,
  resolveTownMapStyle, coerceStyleId,
} from '../../src/design/townMapStyles.js';
import { readStyleLens, withStyleLens } from '../../src/domain/townMap/mapEdits.js';
import { GLYPH_SET_IDS } from '../../src/design/townGlyphs/index.js';
import { GOLDEN_CONFIGS } from '../fixtures/townMapFixtures.js';

const HEX = /^#[0-9a-fA-F]{3,8}$/;
const KNOWN_OPS = new Set(['poly', 'line', 'circle', 'rect', 'path']);
const stable = (v) => JSON.stringify(v);
const richModel = () => buildTownMapModel(GOLDEN_CONFIGS[10].settlement); // city / coastal / walls / water

describe('illustrated lens — registry placement', () => {
  it('is a pickable lens, but NOT a member of the golden/entitlement-pinned five', () => {
    expect(ILLUSTRATED_STYLE_ID).toBe('illustrated');
    expect([...TOWN_MAP_STYLE_IDS]).not.toContain('illustrated');
    expect([...TOWN_MAP_LENS_IDS]).toContain('illustrated');
    expect(TOWN_MAP_LENS_IDS.length).toBe(TOWN_MAP_STYLE_IDS.length + 1);
  });

  it('resolves to a frozen lens carrying glyphSet=medieval (a registered set)', () => {
    const s = resolveTownMapStyle('illustrated');
    expect(s.id).toBe('illustrated');
    expect(Object.isFrozen(s)).toBe(true);
    expect(s.glyphSet).toBe('medieval');
    expect(GLYPH_SET_IDS).toContain(s.glyphSet);
  });

  it('coerces + persists like a base lens (round-trips the mapEdits blob)', () => {
    expect(coerceStyleId('illustrated')).toBe('illustrated');
    const edits = withStyleLens(null, 'illustrated');
    expect(readStyleLens(edits)).toBe('illustrated');
    // a non-default lens is retained (dormancy law: default omitted, this one kept)
    expect(edits.styleLens).toBe('illustrated');
  });
});

describe('illustrated lens — is wall-safe + self-contained + deterministic', () => {
  it('carries only hex palette + numeric weights + a registered glyphSet (THE WALL)', () => {
    const s = resolveTownMapStyle('illustrated');
    for (const v of [...Object.values(s.palette), ...Object.values(s.district), s.background]) {
      expect(v).toMatch(HEX);
    }
    for (const v of [...Object.values(s.stroke), ...Object.values(s.opacity)]) {
      expect(typeof v).toBe('number');
      expect(Number.isFinite(v)).toBe(true);
    }
    expect(GLYPH_SET_IDS).toContain(s.glyphSet);
  });

  it('emits only the five primitive op kinds and is byte-deterministic', () => {
    const model = richModel();
    for (const op of buildTownMapDrawList(model, 'illustrated')) expect(KNOWN_OPS.has(op.t)).toBe(true);
    expect(stable(buildTownMapDrawList(model, 'illustrated'))).toBe(stable(buildTownMapDrawList(model, 'illustrated')));
    expect(buildTownMapSvg(model, { style: 'illustrated' })).toBe(buildTownMapSvg(model, { style: 'illustrated' }));
  });

  it('the illustrated SVG carries no external reference (canvas-taint-free)', () => {
    const svg = buildTownMapSvg(richModel(), { style: 'illustrated' });
    expect(svg).toContain('viewBox="0 0 1000 1000"');
    expect(/<image\b/i.test(svg)).toBe(false);
    expect(/href\s*=/i.test(svg)).toBe(false);
    expect(/url\(/i.test(svg)).toBe(false);
  });
});

describe('illustrated lens — glyphs replace rects, five re-skins byte-identical', () => {
  it('the building z-slot becomes glyphs: NO 8px landmark rect, real glyph strokes present', () => {
    const model = richModel();
    const parch = buildTownMapDrawList(model, 'parchment');
    const illus = buildTownMapDrawList(model, 'illustrated');
    // parchment draws 16×16 (w=16,h=16) landmark rects; the illustrated list has none.
    const rect16 = (ops) => ops.filter((o) => o.t === 'rect' && o.w === 16 && o.h === 16 && o.rx === 3).length;
    expect(rect16(parch)).toBeGreaterThan(0);
    expect(rect16(illus)).toBe(0);
    // and it is materially different + richer (glyph strokes) than parchment
    expect(stable(illus)).not.toBe(stable(parch));
    expect(illus.length).toBeGreaterThan(parch.length);
  });

  it('every re-skin lens (TOWN_MAP_STYLE_IDS) still emits the legacy landmark rects', () => {
    const model = richModel();
    const landmarks = model.buildings.filter((b) => b.kind === 'landmark').length;
    expect(landmarks).toBeGreaterThan(0);
    for (const id of TOWN_MAP_STYLE_IDS) {
      const rects16 = buildTownMapDrawList(model, id).filter((o) => o.t === 'rect' && o.w === 16 && o.h === 16).length;
      expect(rects16, `${id} lost its legacy building rects`).toBe(landmarks);
    }
  });

  it('the default (no-arg) lens is unaffected by the illustrated registration', () => {
    const model = richModel();
    expect(stable(buildTownMapDrawList(model))).toBe(stable(buildTownMapDrawList(model, DEFAULT_STYLE_ID)));
  });
});
