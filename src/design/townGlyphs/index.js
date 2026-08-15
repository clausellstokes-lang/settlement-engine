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

/**
 * THE SHIPPED glyph-set ids — THE WALL vocabulary for a lens's `glyphSet` field (validateBespokeStyle
 * bounds a bespoke skin's glyphSet to THIS list). `'medieval'` ships and proves the registry; a
 * GENRE PACK (sci-fi / desert / gothic) is a two-line DATA DROP — register its library (below) and
 * add its id here. Kept an explicit frozen literal (not derived) so the shipped wall vocabulary is
 * a reviewed, byte-stable constant — a set can be render-registered for tests without silently
 * widening what the AI may select.
 */
export const GLYPH_SET_IDS = Object.freeze(['medieval']);

/** The kind a compiler falls back to when a glyphKind is missing from a set. */
export const FALLBACK_GLYPH_KIND = 'house-a';

/**
 * THE GLYPH-SET REGISTER — id → glyph library. A mutable Map (seeded with the shipped sets) is what
 * makes the registry a GENRE DOOR: a new set is `registerGlyphSet(id, lib)` at the pack module's
 * eval, zero engine change. Deterministic: registration is a pure keyed insert (no Date/random), so
 * a given set of registered packs always draws the same. @type {Map<string, Readonly<Record<string, import('./glyphCompiler.js').Glyph>>>} */
const REGISTRY = new Map();

/**
 * Register (or replace) a glyph-set library under an id — the genre-door / test seam. Pure keyed
 * insert; validates only that the id is a non-empty string and the library a plain object (no code
 * path, worst-case-ugly-never-unsafe). Does NOT widen GLYPH_SET_IDS (the wall's SHIPPED vocabulary
 * stays a reviewed constant); a genre pack adds its id there explicitly.
 * @param {string} id @param {Record<string, unknown>} lib @returns {boolean} registered
 */
export function registerGlyphSet(id, lib) {
  if (typeof id !== 'string' || !id) return false;
  if (!lib || typeof lib !== 'object' || Array.isArray(lib)) return false;
  REGISTRY.set(id, /** @type {Readonly<Record<string, import('./glyphCompiler.js').Glyph>>} */ (lib));
  return true;
}

/** Unregister a glyph set (test cleanup / symmetric completeness). @param {string} id @returns {boolean} removed */
export function unregisterGlyphSet(id) {
  return REGISTRY.delete(id);
}

// Seed the shipped set(s) at module eval.
registerGlyphSet('medieval', MEDIEVAL_GLYPHS);

/**
 * Resolve a glyph-set id to its library, or null for an unknown/absent id (fail-safe:
 * the draw layer then keeps its legacy rect path — worst case is the old look, never a
 * crash).
 * @param {string|null|undefined} id
 * @returns {Readonly<Record<string, import('./glyphCompiler.js').Glyph>>|null}
 */
export function getGlyphSet(id) {
  return (typeof id === 'string' && REGISTRY.get(id)) || null;
}

export { compileGlyph, compileGlyphFacade, GLYPH_FOOTPRINT } from './glyphCompiler.js';
