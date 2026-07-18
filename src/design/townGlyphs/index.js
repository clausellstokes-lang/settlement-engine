/**
 * design/townGlyphs/index.js — THE GLYPH-SET REGISTRY (THE ILLUSTRATED TOWN, IT-1).
 *
 * The registry of code-shipped glyph libraries a lens may SELECT via its `glyphSet`
 * field (THE WALL: a lens names a set id, never raw path data — worst-case ugly, never
 * unsafe). `'medieval'` ships first and proves the registry; a genre pack (sci-fi /
 * desert / gothic) is a new data module of the same shape plus a palette — zero engine
 * change (design §5.3). AI-authored glyph geometry is a named deferral to the trust
 * ladder (design §5, S4+): a lens selects and tunes; it does not author raw geometry.
 *
 * Consumed ONLY by the lazy town-map draw surfaces (townMapDraw's glyph branch + the
 * pane's illustrated underlay leaf) + tests, so it never reaches the first-paint static
 * closure (the townMapLazy pin).
 */

import { MEDIEVAL_GLYPHS } from './medieval.js';

/** The registered glyph-set ids (THE WALL vocabulary for a lens's `glyphSet` field). */
export const GLYPH_SET_IDS = Object.freeze(['medieval']);

/** The kind a compiler falls back to when a glyphKind is missing from a set. */
export const FALLBACK_GLYPH_KIND = 'house-a';

/** id → the frozen glyph library. */
const SETS = Object.freeze({ medieval: MEDIEVAL_GLYPHS });

/**
 * Resolve a glyph-set id to its library, or null for an unknown/absent id (fail-safe:
 * the draw layer then keeps its legacy rect path — worst case is the old look, never a
 * crash).
 * @param {string|null|undefined} id
 * @returns {Readonly<Record<string, import('./glyphCompiler.js').Glyph>>|null}
 */
export function getGlyphSet(id) {
  return (typeof id === 'string' && SETS[id]) || null;
}

export { compileGlyph, GLYPH_FOOTPRINT } from './glyphCompiler.js';
