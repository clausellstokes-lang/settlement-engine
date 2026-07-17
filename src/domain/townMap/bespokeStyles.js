/**
 * domain/townMap/bespokeStyles.js — ADDITIVE saved bespoke map-style artifacts
 * (Surveyor style-overhaul, task #28 phase 2 / DESIGN_CONTENT_PLANE §7 "BESPOKE AI STYLES").
 *
 * A bespoke style is one more definition of the TownMapStyle shape, validated against THE WALL
 * (design/townMapStyleWall.js). This module holds the ADDITIVE-SAVE + RESOLUTION logic the
 * design mandates:
 *   • ADDITIVE — a saved bespoke style is KEPT (credits bought an artifact, not a render),
 *     named, and re-selectable; adding one never removes another.
 *   • THE FOUR BASE LENSES STAY PERMANENTLY AVAILABLE — resolveActiveStyle always resolves a
 *     base lens id; a bespoke id resolves to its saved definition.
 *   • FLIP-BACK is INSTANT / FREE / NON-DESTRUCTIVE — switching the active lens (base or
 *     bespoke) only re-skins the derived view; no geometry, no edit, is ever lost.
 *   • THE CROSS-LENS EDIT PIN EXTENDS to bespoke — a bespoke style resolves to a full
 *     TownMapStyle, so a semantic mapEdit renders identically under it (proven by the pin).
 *
 * A "collection" here is a plain { [id]: TownMapStyle } of ALREADY-WALL-VALIDATED (resolved,
 * __resolved:true) definitions — a VALUE the caller persists. PERSISTENCE SURFACE = the
 * integration seam (owner-gated schema): the natural home is an additive, dormancy-lawful key
 * (settlement.mapEdits.bespokeStyles, or a per-account artifact store for cross-settlement
 * re-selection). This module stays persistence-agnostic + pure so the shape stays the owner's
 * to choose; nothing here writes state.
 *
 * PURE, headless, deterministic (no Date/Math.random). Reached only by the lazy town-map + AI
 * surfaces ⇒ zero first-paint bytes.
 */

import { resolveTownMapStyle, TOWN_MAP_STYLE_IDS } from '../../design/townMapStyles.js';

const _baseIdSet = new Set(TOWN_MAP_STYLE_IDS);

/** True iff `id` names one of the four permanent base lenses. */
export function isBaseLensId(id) {
  return typeof id === 'string' && _baseIdSet.has(id);
}

/**
 * Add (or replace) a wall-validated bespoke style in a collection. Pure — returns a NEW
 * collection; never mutates the input. Additive: other artifacts are untouched. A base-lens id
 * is rejected (the four base lenses are permanent; a bespoke may never shadow one).
 * @param {Record<string, unknown>|null|undefined} collection
 * @param {string} id
 * @param {import('../../design/townMapStyles.js').TownMapStyle} validatedStyle  (must be __resolved)
 * @returns {Record<string, unknown>}  opaque collection (validated on read by readBespokeStyle)
 */
export function addBespokeStyle(collection, id, validatedStyle) {
  const base = (collection && typeof collection === 'object' && !Array.isArray(collection)) ? collection : {};
  if (typeof id !== 'string' || !id || isBaseLensId(id)) return { ...base };
  if (!validatedStyle || typeof validatedStyle !== 'object' || validatedStyle.__resolved !== true) return { ...base };
  return { ...base, [id]: validatedStyle };
}

/** Read a saved bespoke style by id, or null. Pure. */
export function readBespokeStyle(collection, id) {
  if (!collection || typeof collection !== 'object' || typeof id !== 'string') return null;
  const s = /** @type {Record<string, unknown>} */ (collection)[id];
  return (s && typeof s === 'object' && /** @type {{__resolved?: boolean}} */ (s).__resolved === true)
    ? /** @type {import('../../design/townMapStyles.js').TownMapStyle} */ (s) : null;
}

/** Remove a bespoke style (non-destructive to the map — flip-back handles the active lens).
 *  Pure — returns a NEW collection. */
export function removeBespokeStyle(collection, id) {
  const base = (collection && typeof collection === 'object' && !Array.isArray(collection)) ? collection : {};
  if (typeof id !== 'string' || !(id in base)) return { ...base };
  const out = { ...base };
  delete out[id];
  return out;
}

/** List the saved bespoke styles as { id, label } (sorted by id — deterministic). Pure. */
export function listBespokeStyles(collection) {
  if (!collection || typeof collection !== 'object') return [];
  return Object.keys(collection)
    .filter((id) => readBespokeStyle(collection, id))
    .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
    .map((id) => ({ id, label: String(readBespokeStyle(collection, id)?.label || id) }));
}

/**
 * Resolve the ACTIVE style for a chosen lens id against the saved collection. Pure. This is the
 * additive + flip-back law in one function:
 *   • a bespoke id present in the collection ⇒ its saved (wall-validated) definition;
 *   • any other id (base lens id, or an absent/stale bespoke id) ⇒ resolveTownMapStyle, which
 *     fails safe to parchment — so flip-back to a base lens is ALWAYS available and a deleted
 *     bespoke never strands the map.
 * @param {string|null|undefined} lens
 * @param {Record<string, unknown>|null|undefined} collection
 * @returns {import('../../design/townMapStyles.js').TownMapStyle}
 */
export function resolveActiveStyle(lens, collection) {
  const bespoke = (typeof lens === 'string' && !isBaseLensId(lens)) ? readBespokeStyle(collection, lens) : null;
  return bespoke || resolveTownMapStyle(lens);
}
