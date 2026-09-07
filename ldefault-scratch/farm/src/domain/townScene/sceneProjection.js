/**
 * domain/townScene/sceneProjection.js — audience boundary for scene compilation.
 *
 * The compiler never builds a player/public scene from a DM settlement and then
 * hides nodes afterward. It projects first, builds TownMapModel second, and only
 * then compiles the scene. This is defense-in-depth over the server boundary and
 * prevents hidden facts from influencing player-visible semantics/provenance.
 */

import { toPublicSafe } from '../display/publicSafe.js';
import {
  normalizeMapEdits,
  readMapEdits,
  readSceneOverrides,
} from '../townMap/mapEdits.js';

/** @param {unknown} value @returns {Record<string, unknown>} */
function record(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/**
 * Normalize an audience fail-closed: only an explicit `dm` receives the full
 * owner projection; an unknown token becomes `public`.
 * @param {unknown} audience
 * @returns {'dm'|'player'|'public'}
 */
export function normalizeSceneAudience(audience) {
  if (audience === 'dm') return 'dm';
  if (audience === 'player') return 'player';
  return 'public';
}

/**
 * Project map edits for a non-DM scene. Geometry/version/presentation keys are
 * safe because the model drops dangling anchors after the settlement projection.
 * DM annotations and bespoke style definitions are deliberately excluded. Scene
 * overrides contain finite visual tokens only and never position/elevation data.
 * @param {unknown} edits
 * @param {'dm'|'player'|'public'} audience
 */
export function projectMapEditsForScene(edits, audience) {
  const normalized = normalizeMapEdits(
    edits && typeof edits === 'object' && !Array.isArray(edits)
      ? /** @type {Parameters<typeof normalizeMapEdits>[0]} */ (edits)
      : null,
  );
  if (!normalized) return null;
  if (audience === 'dm') return normalized;

  const safe = {
    layoutVariant: normalized.layoutVariant,
    pins: normalized.pins,
    sceneOverrides: readSceneOverrides(normalized),
    legendPrefs: normalized.legendPrefs,
    styleLens: normalized.styleLens,
    layoutLawVersion: normalized.layoutLawVersion,
    seasonOverride: normalized.seasonOverride,
  };
  return normalizeMapEdits(safe);
}

/**
 * Produce the already-authorized settlement + map edits a scene may read.
 * @param {unknown} settlement
 * @param {unknown} explicitMapEdits
 * @param {unknown} requestedAudience
 * @returns {{ audience: 'dm'|'player'|'public', settlement: Record<string, unknown>, mapEdits: object|null }}
 */
export function projectSettlementForScene(settlement, explicitMapEdits, requestedAudience) {
  const audience = normalizeSceneAudience(requestedAudience);
  const source = record(settlement);
  const rawEdits = explicitMapEdits === undefined || explicitMapEdits === null
    ? readMapEdits(source)
    : explicitMapEdits;
  const mapEdits = projectMapEditsForScene(rawEdits, audience);
  const projectedBase = audience === 'dm' ? source : toPublicSafe(source);
  // The projected copy is a compiler-local read model. It is never persisted;
  // attaching the validated subset lets resolveMapDress honor a safe season pin.
  const projected = { ...projectedBase };
  if (mapEdits) projected.mapEdits = mapEdits;
  else delete projected.mapEdits;
  return { audience, settlement: projected, mapEdits };
}
