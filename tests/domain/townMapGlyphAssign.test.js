/**
 * townMapGlyphAssign.test.js — THE ILLUSTRATED TOWN (IT-1): institution/building → glyph.
 *
 * Pins the glyphKindFor waterfall (fill-mass → exact-name → category-default → seeded
 * house), the PINNED category vocabulary (equal to DISTRICT_CATEGORIES, never imported),
 * determinism + anchor-stability, and library completeness (every kind it can emit is a
 * real glyph in the medieval set).
 */
import { describe, expect, it } from 'vitest';

import { glyphKindFor, CATEGORY_GLYPH_DEFAULT } from '../../src/domain/townMap/glyphAssign.js';
import { DISTRICT_CATEGORIES } from '../../src/domain/districtProfile.js';
import { MEDIEVAL_GLYPHS } from '../../src/design/townGlyphs/medieval.js';

const HOUSE = new Set(['house-a', 'house-b', 'house-c']);

describe('glyphAssign — the PINNED category vocabulary', () => {
  it('CATEGORY_GLYPH_DEFAULT keys equal DISTRICT_CATEGORIES (the vocabulary pin)', () => {
    expect(Object.keys(CATEGORY_GLYPH_DEFAULT).sort()).toEqual([...DISTRICT_CATEGORIES].sort());
  });

  it('every category default resolves to a real glyph in the medieval set', () => {
    for (const [cat, kind] of Object.entries(CATEGORY_GLYPH_DEFAULT)) {
      if (kind === 'house') {
        for (const h of HOUSE) expect(MEDIEVAL_GLYPHS[h], `${cat}→${h} missing`).toBeTruthy();
      } else {
        expect(MEDIEVAL_GLYPHS[kind], `${cat}→${kind} missing`).toBeTruthy();
      }
    }
  });
});

describe('glyphAssign — the waterfall', () => {
  it('fill mass renders as simplified massing rows, regardless of name', () => {
    expect(glyphKindFor({ anchorKey: 'b.1', name: 'Old Mill', kind: 'fill' }, 'craft').kind).toBe('massing');
    expect(glyphKindFor({ anchorKey: 'b.2', name: 'Anything', kind: 'fill' }, 'residential').kind).toBe('massing');
  });

  it('exact institution-name matches win over the category default', () => {
    const cases = [
      ['St. Cuthbert Temple', 'spire'],
      ['Wayside Shrine', 'small-spire'],
      ['The Old Watermill', 'wheelhouse'],
      ["Blacksmith's Forge", 'forge'],
      ['The Prancing Pony Inn', 'signpost-house'],
      ['Garrison Keep', 'towered-keep'],
      ['Grand Bazaar', 'stall-rows'],
      ['Town Granary', 'gambrel-store'],
      ['The West Docks', 'quay-shed'],
    ];
    for (const [name, kind] of cases) {
      // Put each in a MISMATCHED district so the exact rule is what fires.
      expect(glyphKindFor({ anchorKey: `b.${name}`, name, kind: 'landmark' }, 'residential').kind).toBe(kind);
    }
  });

  it('a non-matching landmark falls to its district-category default', () => {
    expect(glyphKindFor({ anchorKey: 'b.a', name: 'Zephyr Hall 3', kind: 'landmark' }, 'religious').kind).toBe('spire');
    expect(glyphKindFor({ anchorKey: 'b.b', name: 'Zephyr Hall 4', kind: 'landmark' }, 'military').kind).toBe('towered-keep');
    expect(glyphKindFor({ anchorKey: 'b.c', name: 'Zephyr Hall 5', kind: 'landmark' }, 'arcane').kind).toBe('mage-tower');
    // residential/other/criminal → a seeded house variant
    expect(HOUSE.has(glyphKindFor({ anchorKey: 'b.d', name: 'Zephyr Hall 6', kind: 'landmark' }, 'residential').kind)).toBe(true);
    expect(HOUSE.has(glyphKindFor({ anchorKey: 'b.e', name: 'Zephyr Hall 7', kind: 'landmark' }, 'other').kind)).toBe(true);
  });
});

describe('glyphAssign — determinism + anchor stability', () => {
  it('is deterministic (same building → same kind + mirror twice)', () => {
    const b = { anchorKey: 'b.stable', name: 'Some Guild 2', kind: 'landmark' };
    expect(glyphKindFor(b, 'residential')).toEqual(glyphKindFor(b, 'residential'));
  });

  it('mirror + house-variant are seeded by anchor (both bits appear across anchors)', () => {
    const mirrors = new Set();
    const variants = new Set();
    for (let i = 0; i < 40; i++) {
      const r = glyphKindFor({ anchorKey: `b.res.${i}`, name: `Home ${i}`, kind: 'landmark' }, 'residential');
      mirrors.add(r.mirror);
      variants.add(r.kind);
    }
    expect(mirrors.size).toBe(2);         // both mirror bits occur
    expect(variants.size).toBeGreaterThan(1); // more than one house variant occurs
  });

  it('every emitted kind is a real glyph in the medieval library (completeness sweep)', () => {
    const cats = [...DISTRICT_CATEGORIES, 'no-such-category', null];
    for (const cat of cats) {
      for (const kind of ['landmark', 'fill']) {
        for (let i = 0; i < 6; i++) {
          const r = glyphKindFor({ anchorKey: `sweep.${cat}.${kind}.${i}`, name: `Thing ${i}`, kind }, cat);
          expect(MEDIEVAL_GLYPHS[r.kind], `${cat}/${kind} → ${r.kind} not in library`).toBeTruthy();
        }
      }
    }
  });

  it('a seedless / shapeless building never throws and yields a library glyph', () => {
    const r = glyphKindFor(null, null);
    expect(MEDIEVAL_GLYPHS[r.kind]).toBeTruthy();
    expect(typeof r.mirror).toBe('boolean');
  });
});
