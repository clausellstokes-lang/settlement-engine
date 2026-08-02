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
  TOWN_SCENE_OPTIONAL_TOP_LEVEL_KEYS,
  validateTownSceneManifest,
  assertTownSceneManifest,
} from './manifestContract.js';

export {
  TOWN_CARTOGRAPHY_SCHEMA_VERSION,
  TOWN_CARTOGRAPHY_RULE_KEY,
  TOWN_CARTOGRAPHY_MANIFEST_KEY,
  TOWN_CARTOGRAPHY_BLOCK_KEYS,
  TOWN_CARTOGRAPHY_STREET_KEYS,
  TOWN_CARTOGRAPHY_WARD_KINDS,
  TOWN_CARTOGRAPHY_STREET_CLASSES,
  TOWN_CARTOGRAPHY_BUILDING_ROLES,
  TOWN_CARTOGRAPHY_CONDITIONS,
  TOWN_CARTOGRAPHY_PROVENANCE_KINDS,
  TOWN_CARTOGRAPHY_PLACEMENT_MODES,
  TOWN_CARTOGRAPHY_DECIDING_LAYERS,
  TOWN_CARTOGRAPHY_LYNCH_ELEMENTS,
  TOWN_CARTOGRAPHY_BUDGET_KEYS,
  TOWN_CARTOGRAPHY_VOCABULARIES,
  attachTownCartographyLayers,
  townCartographyActive,
  validateTownCartography,
} from './cartographyContract.js';

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
