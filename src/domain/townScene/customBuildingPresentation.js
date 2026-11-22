/**
 * Bounded custom-content presentation contract for settlement buildings.
 *
 * Custom institutions may choose one registered scene profile and a deliberately
 * small set of flat, presentation-only overrides. The contract exposes semantic
 * choices, never renderer internals: authors cannot provide dimensions, meshes,
 * shaders, transforms, condition wear, or arbitrary material identifiers.
 *
 * Roof form and recognition details such as a hanging sign are owned by the
 * registered glyph's TownScene geometry. District placement remains owned by
 * TownMapModel, and deterioration remains owned by the living-state compiler.
 * Consequently this contract can enrich the portrait without becoming a second
 * settlement plan or a second source of simulation truth.
 */

import {
  CUSTOM_SETTLEMENT_GLYPH_IDS,
} from '../townMap/glyphAssign.js';
import {
  projectCustomDefinitionIdentity,
} from '../content/customDefinitionIdentityProjection.js';

/** @typedef {'standard'|'landmark'} CustomSceneLandmarkLevel */
/** @typedef {'brick'|'marble'|'ruined-stone'|'steel'|'stone'|'timber'} CustomSceneMaterial */
/**
 * @typedef {{
 *   id: string,
 *   glyph: string,
 *   materialFamily: CustomSceneMaterial,
 *   landmarkLevel: CustomSceneLandmarkLevel,
 * }} CustomSceneProfile
 */

export const CUSTOM_TOWN_SCENE_PRESENTATION_VERSION = 1;

/**
 * The author-facing material vocabulary. Each token resolves to an implemented
 * TownScene skin; raw skin/material/shader identifiers never cross this wall.
 */
export const CUSTOM_TOWN_SCENE_MATERIALS = Object.freeze({
  brick: 'brickGuild',
  marble: 'marbleTemple',
  'ruined-stone': 'ruinedGothic',
  steel: 'steelModern',
  stone: 'stoneAshlar',
  timber: 'timberVillage',
});
export const CUSTOM_TOWN_SCENE_LANDMARK_LEVELS = Object.freeze([
  'standard',
  'landmark',
]);

/**
 * Registered semantic profiles. A profile selects an existing, tested building
 * grammar; exact footprint, height, roof parts, materials, and LOD remain derived
 * by TownScene.
 *
 * @type {ReadonlyArray<Readonly<CustomSceneProfile>>}
 */
export const CUSTOM_TOWN_SCENE_PROFILES = Object.freeze([
  Object.freeze({
    id: 'agrarian-farmstead',
    glyph: 'farmstead',
    materialFamily: 'timber',
    landmarkLevel: 'landmark',
  }),
  Object.freeze({
    id: 'agrarian-mill',
    glyph: 'wheelhouse',
    materialFamily: 'timber',
    landmarkLevel: 'landmark',
  }),
  Object.freeze({
    id: 'civic-archive',
    glyph: 'archive-hall',
    materialFamily: 'stone',
    landmarkLevel: 'landmark',
  }),
  Object.freeze({
    id: 'civic-hall',
    glyph: 'moot-hall',
    materialFamily: 'stone',
    landmarkLevel: 'landmark',
  }),
  Object.freeze({
    id: 'domestic-house',
    glyph: 'house-a',
    materialFamily: 'timber',
    landmarkLevel: 'standard',
  }),
  Object.freeze({
    id: 'exotic-tower',
    glyph: 'mage-tower',
    materialFamily: 'marble',
    landmarkLevel: 'landmark',
  }),
  Object.freeze({
    id: 'industrial-forge',
    glyph: 'forge',
    materialFamily: 'brick',
    landmarkLevel: 'landmark',
  }),
  Object.freeze({
    id: 'industrial-workshop',
    glyph: 'workshop',
    materialFamily: 'brick',
    landmarkLevel: 'landmark',
  }),
  Object.freeze({
    id: 'martial-barracks',
    glyph: 'barracks',
    materialFamily: 'stone',
    landmarkLevel: 'landmark',
  }),
  Object.freeze({
    id: 'martial-keep',
    glyph: 'towered-keep',
    materialFamily: 'stone',
    landmarkLevel: 'landmark',
  }),
  Object.freeze({
    id: 'martial-watchtower',
    glyph: 'watchtower',
    materialFamily: 'stone',
    landmarkLevel: 'landmark',
  }),
  Object.freeze({
    id: 'mercantile-guildhall',
    glyph: 'guildhall',
    materialFamily: 'brick',
    landmarkLevel: 'landmark',
  }),
  Object.freeze({
    id: 'mercantile-inn',
    glyph: 'signpost-house',
    materialFamily: 'timber',
    landmarkLevel: 'landmark',
  }),
  Object.freeze({
    id: 'mercantile-market',
    glyph: 'stall-rows',
    materialFamily: 'timber',
    landmarkLevel: 'landmark',
  }),
  Object.freeze({
    id: 'ruined-landmark',
    glyph: 'ruin-shell',
    materialFamily: 'ruined-stone',
    landmarkLevel: 'landmark',
  }),
  Object.freeze({
    id: 'sacred-sanctuary',
    glyph: 'spire',
    materialFamily: 'marble',
    landmarkLevel: 'landmark',
  }),
  Object.freeze({
    id: 'sacred-shrine',
    glyph: 'small-spire',
    materialFamily: 'stone',
    landmarkLevel: 'landmark',
  }),
]);

export const CUSTOM_TOWN_SCENE_PROFILE_IDS = Object.freeze(
  CUSTOM_TOWN_SCENE_PROFILES.map((profile) => profile.id),
);

const PROFILE_BY_ID = new Map(
  CUSTOM_TOWN_SCENE_PROFILES.map((profile) => [profile.id, profile]),
);
const MATERIAL_IDS = new Set(Object.keys(CUSTOM_TOWN_SCENE_MATERIALS));
const LANDMARK_LEVELS = new Set(CUSTOM_TOWN_SCENE_LANDMARK_LEVELS);

/**
 * Compatibility export for TownScene and authoring consumers. This is the
 * canonical illustrated-map registry itself, not a second scene-only copy.
 */
export const CUSTOM_TOWN_SCENE_GLYPH_IDS = CUSTOM_SETTLEMENT_GLYPH_IDS;
const GLYPH_IDS = new Set(CUSTOM_TOWN_SCENE_GLYPH_IDS);

/** @param {unknown} value @returns {Record<string, unknown>} */
function record(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @param {number} maximum */
function boundedString(value, maximum) {
  if (typeof value !== 'string') return null;
  const normalized = value.trim();
  return normalized && normalized.length <= maximum ? normalized : null;
}

/**
 * Preserve a valid custom-definition version without coercing its type.
 *
 * @param {unknown} value
 * @returns {number|string|null}
 */
function definitionVersion(value) {
  if (Number.isSafeInteger(value) && Number(value) >= 0) return Number(value);
  return boundedString(value, 64);
}

/**
 * True when a definition version can cross the TownScene identity boundary.
 *
 * @param {unknown} value
 * @returns {boolean}
 */
export function isCustomDefinitionVersion(value) {
  return definitionVersion(value) !== null;
}

/**
 * Convert the semantic scale token to the existing renderer boolean. Returning
 * null means “use the TownMap classification” rather than quietly making the
 * building ordinary.
 *
 * @param {unknown} requested
 * @param {unknown} profileDefault
 * @returns {boolean|null}
 */
function resolveLandmark(requested, profileDefault) {
  if (requested === 'landmark') return true;
  if (requested === 'standard') return false;
  if (profileDefault === 'landmark') return true;
  if (profileDefault === 'standard') return false;
  return null;
}

/**
 * Project only the custom-definition and scene fields that are safe to retain
 * on a generated institution. Invalid presentation values disappear, making
 * them byte-equivalent to no visual request at the TownMap/TownScene boundary.
 *
 * Immutable definition identity uses explicit id, revision, and content-hash
 * fields. The older version/fingerprint pair remains a read/write compatibility
 * alias for already-saved settlements. `_schemaVersion` is only the final
 * legacy fallback for `customDefinitionVersion`; a real `revisionNumber` must
 * always outrank the storage schema version.
 *
 * @param {unknown} value
 * @returns {Record<string, unknown>}
 */
export function projectCustomInstitutionSceneFields(value) {
  const source = record(value);
  /** @type {Record<string, unknown>} */
  const projected = {
    ...projectCustomDefinitionIdentity(source),
  };

  const profileId = boundedString(source.sceneProfileId, 80);
  if (profileId && PROFILE_BY_ID.has(profileId)) {
    projected.sceneProfileId = profileId;
  }

  // The manifest contract is flat. The nested names are a read-only migration
  // alias for definitions authored before the canonical manifest landed; output
  // is always normalized to the flat field names.
  const legacyPresentation = record(source.scenePresentation);
  const requestedLandmarkLevel = source.landmarkLevel
    ?? (typeof legacyPresentation.landmark === 'boolean'
      ? legacyPresentation.landmark ? 'landmark' : 'standard'
      : null);
  const landmarkLevel = boundedString(requestedLandmarkLevel, 24);
  if (landmarkLevel && LANDMARK_LEVELS.has(landmarkLevel)) {
    projected.landmarkLevel = landmarkLevel;
  }

  const materialFamily = boundedString(
    source.materialFamily ?? legacyPresentation.material,
    40,
  );
  if (materialFamily && MATERIAL_IDS.has(materialFamily)) {
    projected.materialFamily = materialFamily;
  }

  const glyph = boundedString(source.glyph ?? legacyPresentation.glyph, 64);
  if (glyph && GLYPH_IDS.has(glyph)) projected.glyph = glyph;

  return projected;
}

/**
 * Resolve the already-bounded source fields into concrete TownScene defaults.
 * A per-settlement mapEdits override is applied later and therefore remains the
 * owner's final cosmetic choice for that one settlement.
 *
 * @param {unknown} value
 * @returns {{
 *   profileId: string|null,
 *   glyphKind: string|null,
 *   skinId: string|null,
 *   landmark: boolean|null,
 * }}
 */
export function resolveCustomBuildingPresentation(value) {
  const projected = projectCustomInstitutionSceneFields(value);
  const profileId = typeof projected.sceneProfileId === 'string'
    ? projected.sceneProfileId
    : null;
  const profile = profileId ? PROFILE_BY_ID.get(profileId) || null : null;
  const material = typeof projected.materialFamily === 'string'
    ? projected.materialFamily
    : profile?.materialFamily || null;
  return {
    profileId,
    glyphKind: typeof projected.glyph === 'string'
      ? projected.glyph
      : profile?.glyph || null,
    skinId: material
      ? CUSTOM_TOWN_SCENE_MATERIALS[
        /** @type {keyof typeof CUSTOM_TOWN_SCENE_MATERIALS} */ (material)
      ] || null
      : null,
    landmark: resolveLandmark(
      projected.landmarkLevel,
      profile?.landmarkLevel,
    ),
  };
}
