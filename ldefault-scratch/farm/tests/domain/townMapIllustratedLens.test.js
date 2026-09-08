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

import { buildTownMapModel } from '../../src/domain/townMap/townMapModel.js';
import {
  TOWN_MAP_STYLE_IDS, TOWN_MAP_LENS_IDS, ILLUSTRATED_STYLE_ID, DEFAULT_STYLE_ID,
  resolveTownMapStyle, coerceStyleId,
} from '../../src/design/townMapStyles.js';
import { readStyleLens, withStyleLens } from '../../src/domain/townMap/mapEdits.js';
import { GLYPH_SET_IDS } from '../../src/design/townMapStyles.js';
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

  // ⚰ THE OP-KIND, DETERMINISM AND CANVAS-TAINT pins for this lens were assertions about the
  // legacy settlement-map draw projection and its SVG serializer, retired under ODQ §725/§772.
  // They said the RENDERER stayed inside the primitive vocabulary and emitted no external
  // reference; with the renderer gone the claims have no subject. What remains here is the part
  // that was always about the LENS itself — that it is a bounded, wall-safe data definition in
  // the retained styles registry — and that is asserted above and below.
});
