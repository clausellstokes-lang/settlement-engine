/**
 * domain/townScene/index.js — public, renderer-neutral settlement-scene API.
 *
 * Consumers compile a JSON-safe TownSceneManifest first, then lower it to a
 * transferable geometry bundle. No UI or WebGL dependency crosses this barrel.
 */

export {
  TOWN_SCENE_SCHEMA_VERSION,
  TOWN_SCENE_COMPILER_VERSION,
  TOWN_SCENE_PLAN_EXTENT,
  TOWN_SCENE_TERRAIN_GRID_SIZE,
  TOWN_SCENE_HEADING_STEPS,
  TOWN_SCENE_ELEVATION_STEPS,
  TOWN_SCENE_AUDIENCES,
  TOWN_SCENE_SHAPE_FAMILIES,
  TOWN_SCENE_LOD_FAMILIES,
  validateTownSceneManifest,
  assertTownSceneManifest,
} from './manifestContract.js';

export {
  stableSceneStringify,
  sceneDigest,
  stableSceneDigest,
  stableSceneDigests,
} from './stableScene.js';

export {
  normalizeSceneAudience,
  projectMapEditsForScene,
  projectSettlementForScene,
} from './sceneProjection.js';

export {
  TOWN_SCENE_COMPILE_INPUT_KIND,
  TOWN_SCENE_COMPILE_INPUT_VERSION,
  TOWN_SCENE_COMPILE_INPUT_MAX_BYTES,
  prepareTownSceneCompileInput,
  validateTownSceneCompileInput,
  assertTownSceneCompileInput,
} from './sceneCompileInput.js';

export {
  TOWN_SCENE_LIGHT_POLICY,
  TOWN_SCENE_LIVING_MARKER_KINDS,
  townSceneConditionTint,
  townSceneLivingMarkerKind,
  townSceneLivingMaterialId,
} from './sceneLivingPresentation.js';

export {
  CUSTOM_TOWN_SCENE_PRESENTATION_VERSION,
  CUSTOM_TOWN_SCENE_LANDMARK_LEVELS,
  CUSTOM_TOWN_SCENE_MATERIALS,
  CUSTOM_TOWN_SCENE_PROFILES,
  CUSTOM_TOWN_SCENE_PROFILE_IDS,
  CUSTOM_TOWN_SCENE_GLYPH_IDS,
  projectCustomInstitutionSceneFields,
  resolveCustomBuildingPresentation,
} from './customBuildingPresentation.js';

export {
  compileTownSceneManifest,
  compileTownSceneManifestFromAuthorizedInput,
} from './compileTownSceneManifest.js';

export {
  TOWN_SCENE_GEOMETRY_BUNDLE_VERSION,
  compileTownSceneGeometry,
  townSceneGeometryTransferList,
} from './compileTownSceneGeometry.js';

export { flattenTownSceneGeometry } from './sceneExportMesh.js';
export {
  encodeTownSceneGlb,
  townSceneGlbJsonString,
} from './sceneGlbExport.js';
export {
  encodeTownScenePortraitPng,
  renderTownScenePortrait,
} from './scenePortraitExport.js';
