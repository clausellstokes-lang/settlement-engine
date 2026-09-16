/**
 * lib/mapSubTabs.js — TC-0, THE MAP TAB SUB-TAB VOCABULARY (design
 * DESIGN_TOWN_CARTOGRAPHY.md §12 / J-TC-8).
 *
 * The dossier's Map tab becomes a CONTAINER with one sub-tab per settlement map
 * presentation. This module is the headless half of that shell: the closed
 * vocabulary, the PRESENCE gate, the stale-link normalizer, and the one spelling
 * of "the portrait is selectable on this machine". No React, no store, no DOM —
 * so the rules can be pinned directly instead of read out of a rendered tree
 * (the `realmInspectorSectionsFor` idiom: a tab list that can vary is a thing a
 * pin has to be able to ask about).
 *
 * BUILD ON, NEVER BESIDE (§2). The three PRESENTATION ids are not re-spelled
 * here: they ARE `TOWN_MAP_VIEW_IDS` from lib/lastMapView.js, the persisted
 * vocabulary the map pane and the living backdrop already speak. This module
 * adds exactly one id the pane's projection switch never carried — `player`,
 * the fog/audience projection, which is a separate surface rather than a
 * projection of the plan.
 *
 * PRESENCE, NEVER A DISABLED TAB (the ai_notes presence lesson). A sub-tab whose
 * content CANNOT exist is ABSENT from the strip, not present and inert:
 *   • the 3D portrait is dark, or the machine has no WebGL2 ⇒ no `portrait3d`;
 *   • a player/public audience, or an unsaved draft ⇒ no `player` (a visitor IS
 *     the player view, and a draft has no saved fog session to project).
 * The two plan projections are unconditional: every settlement derives a town-map
 * model, and each leaf owns its own empty state for a settlement whose model has
 * nothing to draw. Gating them on a model read would drag the town-map model into
 * the shell's chunk, which is the very edge the TC-0 lazy pin forbids.
 *
 * EXTENSION POINT (deliberately NOT taken here): §12 seats `Illustrated` — the
 * TC-5 cartography painter — as a fourth presentation. Its id joins
 * PRESENTATION_SUB_TAB_IDS the day the TC-1 manifest flag exists; declaring it
 * now would ship a vocabulary entry that can never be present, which is exactly
 * the vacuous-pin shape this file is built to avoid.
 */

import { TOWN_MAP_VIEW_IDS, normalizeTownMapView } from './lastMapView.js';

/**
 * The query parameter a deep link addresses a sub-tab through, e.g.
 * `/settlements/<id>?mapview=portrait3d`. Named once here so the reader, the
 * writer, and the pins cannot drift apart (the HowToUse `?tab=` precedent, which
 * reads the search string directly rather than widening the first-paint-eager
 * routes table for a per-surface param).
 */
export const MAP_SUB_TAB_PARAM = 'mapview';

/** The fog / audience projection. The one sub-tab that is not a plan projection. */
export const MAP_SUB_TAB_PLAYER = 'player';

/**
 * The presentation ids — the pane's own persisted projection vocabulary, in its
 * own order. Plan is first and is the permanent default (§1, §12).
 * @type {ReadonlyArray<'plan'|'panorama'|'portrait3d'>}
 */
export const PRESENTATION_SUB_TAB_IDS = /** @type {ReadonlyArray<
 * 'plan'|'panorama'|'portrait3d'
 * >} */ (TOWN_MAP_VIEW_IDS);

/** The whole closed sub-tab vocabulary, in reading order. */
export const MAP_SUB_TAB_IDS = Object.freeze([
  ...PRESENTATION_SUB_TAB_IDS,
  MAP_SUB_TAB_PLAYER,
]);

/** Reader-facing labels. A label is chrome; the id is the contract. */
const LABELS = Object.freeze({
  plan: 'Plan',
  panorama: 'Panorama',
  portrait3d: '3D Portrait',
  player: 'Player View',
});

/**
 * @param {unknown} id
 * @returns {string|null}
 */
export function mapSubTabLabel(id) {
  return Object.prototype.hasOwnProperty.call(LABELS, /** @type {string} */ (id))
    ? LABELS[/** @type {string} */ (id)]
    : null;
}

/**
 * Is this sub-tab a projection the map pane renders (as opposed to its own
 * surface)? The shell threads a presentation id down to the pane and mounts a
 * different leaf for everything else.
 * @param {unknown} id
 * @returns {boolean}
 */
export function isPresentationSubTab(id) {
  return PRESENTATION_SUB_TAB_IDS.includes(/** @type {any} */ (id));
}

/**
 * THE ONE SPELLING of "the 3D portrait is selectable on this machine": the
 * availability flag AND a probed WebGL2 capability. The shell needs it to decide
 * PRESENCE and the pane's presentation hook needs it to decide selectability;
 * before this they would have been two copies of one predicate, which is how a
 * strip offers a tab the renderer refuses to draw.
 *
 * @param {unknown} sceneEnabled the `settlementScene3d` availability flag
 * @param {{ available?: boolean }|null|undefined} capability detectTownSceneCapability()
 * @returns {boolean}
 */
export function townSceneSelectable(sceneEnabled, capability) {
  return Boolean(sceneEnabled && capability && capability.available);
}

/**
 * The sub-tabs this settlement, viewer, and machine actually have, in reading
 * order. Pure: every input is a resolved fact, so a pin can drive the gate
 * directly.
 *
 * @param {{
 *   audience?: 'dm'|'player'|'public',
 *   sceneAvailable?: boolean,
 *   savedMap?: boolean,
 * }} [input]
 * @returns {ReadonlyArray<{ id: string, label: string }>}
 */
export function resolveMapSubTabs(input = {}) {
  const {
    audience = 'dm',
    sceneAvailable = false,
    savedMap = false,
  } = input;
  const ids = ['plan', 'panorama'];
  if (sceneAvailable) ids.push('portrait3d');
  if (audience === 'dm' && savedMap) ids.push(MAP_SUB_TAB_PLAYER);
  return Object.freeze(ids.map((id) => Object.freeze({ id, label: LABELS[id] })));
}

/**
 * Coerce a requested sub-tab (a deep link, a persisted preference, a session
 * choice) to one that is actually PRESENT. An id that is unknown, retired, or
 * gated off this surface falls back to the first present sub-tab — Plan, by the
 * ordering above — rather than rendering an empty panel.
 *
 * The empty-list arm is a TOTALITY GUARD, not a product state: `resolveMapSubTabs`
 * always seats the two plan projections, so no shipped surface reaches it. It is
 * here so a future gate that could empty the strip cannot make this function
 * return an id that is not there.
 *
 * @param {unknown} value
 * @param {ReadonlyArray<{ id: string }>|null|undefined} present
 * @returns {string|null} a present id, or null when nothing is present
 */
export function normalizeMapSubTab(value, present) {
  const list = Array.isArray(present) ? present : [];
  if (list.length === 0) return null;
  const wanted = typeof value === 'string' ? value : '';
  return list.some((t) => t && t.id === wanted) ? wanted : list[0].id;
}

/**
 * The sub-tab a deep link asks for, or null. Takes the search STRING (never
 * `window`) so the rule is testable headlessly and the shell owns the one DOM
 * read.
 *
 * @param {unknown} search a location search string, with or without the leading '?'
 * @returns {string|null} a declared sub-tab id, or null for absent/unknown
 */
export function readMapSubTabParam(search) {
  if (typeof search !== 'string' || search === '') return null;
  try {
    const requested = new URLSearchParams(
      search.charAt(0) === '?' ? search.slice(1) : search,
    ).get(MAP_SUB_TAB_PARAM);
    return requested && MAP_SUB_TAB_IDS.includes(requested) ? requested : null;
  } catch {
    return null;
  }
}

/**
 * The presentation id to record in the device-local last-viewed sidecar for a
 * chosen sub-tab, or null when the choice is not a presentation.
 *
 * THE LIVING BACKDROP reads `lastMapView.view`, whose vocabulary has no `player`
 * member — `normalizeTownMapView('player')` would silently answer 'plan' and
 * record a view the reader never chose. So the shell asks here first and simply
 * does not write for a non-presentation sub-tab.
 *
 * @param {unknown} id
 * @returns {'plan'|'panorama'|'portrait3d'|null}
 */
export function presentationViewFor(id) {
  return isPresentationSubTab(id) ? normalizeTownMapView(id) : null;
}
