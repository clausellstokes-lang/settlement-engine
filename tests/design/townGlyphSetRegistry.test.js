/**
 * townGlyphSetRegistry.test.js — THE GENRE DOOR (THE ILLUSTRATED TOWN, IT-4).
 *
 * The glyph-set registry is what makes a genre a DATA DROP: a new glyph library is registered under
 * an id, and a lens/skin naming that id via `glyphSet` draws it — zero engine change (design §5.3).
 * `'medieval'` ships; this proves the MECHANISM with a tiny test-only second set: registering it and
 * pointing a style's glyphSet at it swaps the rendered glyphs; the fallback stays parchment-safe;
 * unregistering restores the prior state (global registry hygiene — no cross-test leakage).
 */
import { describe, expect, it, afterEach } from 'vitest';

import {
  getGlyphSet, registerGlyphSet, unregisterGlyphSet, GLYPH_SET_IDS, FALLBACK_GLYPH_KIND,
} from '../../src/design/townGlyphs/index.js';
import { buildTownMapModel } from '../../src/domain/townMap/index.js';
import { buildTownMapDrawList } from '../../src/domain/townMap/townMapDraw.js';
import { resolveTownMapStyle } from '../../src/design/townMapStyles.js';
import { GOLDEN_CONFIGS } from '../fixtures/townMapFixtures.js';

const TEST_SET_ID = '__test_glyphset__';
const stable = (v) => JSON.stringify(v);
const richModel = () => buildTownMapModel(GOLDEN_CONFIGS[10].settlement);

// A tiny second glyph set — one distinctive glyph reused for every kind (incl. the fallback). Its
// strokes are DELIBERATELY unlike the medieval library, so a swap is visible in the emitted ops.
// A glyph = a named list of primitive strokes in a local 0..1 box (the compiler's contract).
const TEST_GLYPH = {
  body: [{ kind: 'poly', pts: [[0.1, 0.9], [0.1, 0.2], [0.9, 0.2], [0.9, 0.9]], closed: true }],
  roof: [{ kind: 'poly', pts: [[0.05, 0.2], [0.5, 0.02], [0.95, 0.2]], closed: false }],
};
const TEST_SET = { 'house-a': TEST_GLYPH, church: TEST_GLYPH, [FALLBACK_GLYPH_KIND]: TEST_GLYPH };

/** Resolve the illustrated lens but swap its glyphSet to an arbitrary id (a resolved OBJECT, so the
 *  draw layer honors it directly — the render mechanism, independent of THE WALL). */
const illustratedWith = (glyphSetId) => resolveTownMapStyle({ ...resolveTownMapStyle('illustrated'), glyphSet: glyphSetId, __resolved: true });

afterEach(() => { unregisterGlyphSet(TEST_SET_ID); });

describe('glyph-set registry — the genre door (register → select → swap)', () => {
  it('the shipped vocabulary is medieval; an unregistered id resolves null (fail-safe)', () => {
    expect(GLYPH_SET_IDS).toEqual(['medieval']);
    expect(getGlyphSet('medieval')).toBeTruthy();
    expect(getGlyphSet(TEST_SET_ID)).toBeNull();   // not registered yet
  });

  it('registerGlyphSet makes a set resolvable; unregisterGlyphSet removes it (registry hygiene)', () => {
    expect(registerGlyphSet(TEST_SET_ID, TEST_SET)).toBe(true);
    expect(getGlyphSet(TEST_SET_ID)).toBe(TEST_SET);
    expect(unregisterGlyphSet(TEST_SET_ID)).toBe(true);
    expect(getGlyphSet(TEST_SET_ID)).toBeNull();
    // never registers junk (worst-case-ugly-never-unsafe: a code path can't sneak in).
    expect(registerGlyphSet('', TEST_SET)).toBe(false);
    expect(registerGlyphSet('x', null)).toBe(false);
    expect(registerGlyphSet('x', [1, 2])).toBe(false);
  });

  it('a style whose glyphSet names the registered set renders THAT set — the swap is visible', () => {
    const model = richModel();
    registerGlyphSet(TEST_SET_ID, TEST_SET);
    const medievalOps = buildTownMapDrawList(model, resolveTownMapStyle('illustrated'));
    const testOps = buildTownMapDrawList(model, illustratedWith(TEST_SET_ID));
    // both are glyph lists (no legacy 16×16 landmark rects) but MATERIALLY different (a real swap).
    const rect16 = (ops) => ops.filter((o) => o.t === 'rect' && o.w === 16 && o.h === 16).length;
    expect(rect16(testOps)).toBe(0);
    expect(stable(testOps)).not.toBe(stable(medievalOps));
    // and byte-deterministic under the swapped set (same purity as the shipped path).
    expect(stable(testOps)).toBe(stable(buildTownMapDrawList(model, illustratedWith(TEST_SET_ID))));
  });

  it('an UNREGISTERED glyphSet id falls back parchment-safe (legacy rects, never a crash)', () => {
    const model = richModel();
    const ops = buildTownMapDrawList(model, illustratedWith('no-such-set'));
    // getGlyphSet returns null ⇒ the legacy building-rect branch ⇒ 16×16 landmark rects reappear.
    const landmarks = model.buildings.filter((b) => b.kind === 'landmark').length;
    expect(landmarks).toBeGreaterThan(0);
    expect(ops.filter((o) => o.t === 'rect' && o.w === 16 && o.h === 16).length).toBe(landmarks);
  });
});
