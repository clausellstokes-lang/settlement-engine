/**
 * townMap/audienceProjection.js — the audience wall shared by the plan,
 * handout, fog view, and the 3D scene compiler.
 *
 * A player-safe map is derived from an authorized settlement projection. It is
 * never the owner's full map with a few DOM nodes hidden afterward. The server
 * remains the authority for remotely shared data; this client wall is the
 * defense-in-depth path used by local player views and exports.
 *
 * The public projection deliberately removes the generation seed. Town-map
 * geometry can still derive deterministically from the public settlement id.
 * Exact DM/player coordinates are less important than keeping private entropy
 * and content outside the player projection.
 */

import { toPublicSafe } from '../display/publicSafe.js';
import {
  normalizeMapEdits,
  readAnnotations,
} from './mapEdits.js';

/** @typedef {'dm'|'player'|'public'} TownMapAudience */

/**
 * The visibility vocabulary is older than the map and contains both `open`
 * (threat profiles) and `public` (realm records). Admit only explicit
 * player-facing values; unknown values fail closed.
 *
 * @param {unknown} visibility
 * @returns {boolean}
 */
export function isPlayerVisibleMapFact(visibility) {
  return visibility === 'open' || visibility === 'public' || visibility === 'player';
}

/**
 * Project cosmetic map edits for an audience. Position pins, finite styles, and
 * other wall-validated presentation choices are safe to preserve. Annotations
 * are the exception: only an explicit `audience:'player'` record may cross the
 * wall. Normalization keeps the dormancy law—an empty result collapses to null.
 *
 * @param {import('./mapEdits.js').MapEdits|null|undefined} edits
 * @param {TownMapAudience} audience
 * @returns {import('./mapEdits.js').MapEdits|null}
 */
export function projectMapEditsForAudience(edits, audience) {
  const normalized = normalizeMapEdits(edits);
  if (!normalized || audience === 'dm') return normalized;

  const annotations = readAnnotations(normalized).filter((entry) => entry.audience === 'player');
  const next = { ...normalized };
  if (annotations.length > 0) next.annotations = annotations;
  else delete next.annotations;
  return normalizeMapEdits(next);
}

/**
 * Build the settlement object that an audience-specific map derivation is
 * allowed to read. Player/public paths begin at `toPublicSafe`; only the
 * separately validated cosmetic map container is reintroduced.
 *
 * @param {unknown} settlement
 * @param {TownMapAudience} audience
 * @returns {Record<string, unknown>}
 */
export function projectSettlementForTownMapAudience(settlement, audience = 'dm') {
  if (audience === 'dm') {
    return settlement && typeof settlement === 'object'
      ? /** @type {Record<string, unknown>} */ (settlement)
      : {};
  }

  const source = settlement && typeof settlement === 'object'
    ? /** @type {Record<string, unknown>} */ (settlement)
    : {};
  const projected = toPublicSafe(source);
  const safeEdits = projectMapEditsForAudience(
    /** @type {import('./mapEdits.js').MapEdits|null|undefined} */ (source.mapEdits),
    audience,
  );
  return safeEdits ? { ...projected, mapEdits: safeEdits } : projected;
}

/**
 * Apply the final model-level audience wall. This is intentionally redundant
 * with source projection: derived threat templates can assign `hidden` or
 * `rumored` visibility even when their source fields themselves are public.
 *
 * @param {import('./townMapModel.js').TownMapModel} model
 * @param {TownMapAudience} audience
 * @returns {import('./townMapModel.js').TownMapModel}
 */
export function projectTownMapModelForAudience(model, audience = 'dm') {
  if (audience === 'dm') return model;

  const hazards = model.overlays.hazards.filter((hazard) => isPlayerVisibleMapFact(hazard.visibility));
  const conditions = model.overlays.conditions.filter((condition) => {
    if (!Object.prototype.hasOwnProperty.call(condition, 'visibility')) return true;
    return isPlayerVisibleMapFact(/** @type {{ visibility?: unknown }} */ (condition).visibility);
  });

  // Provenance and declined alternatives are explanation-layer records, not
  // drawing requirements. They remain out of the player model unless a future
  // explicit public provenance vocabulary admits them.
  const {
    provenance: _privateProvenance,
    latentAdvantages: _privateAlternatives,
    ...safeModel
  } = model;
  return {
    ...safeModel,
    overlays: { hazards, conditions },
  };
}

/**
 * Keep only non-historical, non-causal seasonal dress for a player render.
 * Scars, rebuilding provenance, siege sources, and festival records require
 * their own audience projection before they may be shown.
 *
 * @param {import('./groundDress.js').MapDress|null|undefined} dress
 * @param {TownMapAudience} audience
 * @returns {import('./groundDress.js').MapDress|null}
 */
export function projectTownMapDressForAudience(dress, audience = 'dm') {
  if (!dress) return null;
  if (audience === 'dm') return dress;
  if (!dress.season) return null;
  return {
    season: dress.season,
    severity: dress.severity ?? null,
    state: null,
    festival: null,
  };
}
