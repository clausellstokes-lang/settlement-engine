/**
 * domain/townMap/index.js — the town-map model barrel.
 *
 * Re-exports the public surface of the deterministic town-map render model. This
 * barrel (and everything under src/domain/townMap/) is imported by NOTHING eager
 * — only test files and the future lazy viewer pane import it — so the entry
 * static closure stays byte-identical (the first-paint budget is unmoved).
 */

export { buildTownMapModel } from './townMapModel.js';
export { anchorForInstitution, anchorForDistrict, slugify } from './anchors.js';
// TOWN LAYOUT v2 (#38) — the semantic urban-planning engine (a sibling generation
// under the same projection). Lazy, consumed only by the model dispatch + tests.
export {
  buildTownLayoutV2,
  TOWN_MAP_GEOMETRY_VERSION_V2,
  LAYOUT_LAW_VERSION_V2,
  MAX_LAYOUT_RETRIES,
} from './townLayoutV2.js';
export { scoreLynch, RUBRIC_WEIGHTS, LYNCH_ACCEPT_FLOOR } from './lynchRubric.js';
// THE PANORAMA PROJECTION (#38, RULING #5) — an oblique 2.5D projection of any model
// that composes with every lens. Lazy, consumed only by the map surfaces + tests.
export { buildTownMapPanoramaDrawList, buildTownMapPanoramaSvg, buildingElevation } from './townPanorama.js';
// THE PROCEDURAL MASSING SUBSTRATE (TRANCHE M, M-0) — per-building volumetric construction
// (footprint × height × kind-keyed roof form) the dimensional views consume, projection-
// injected + trig-free. Lazy (map surfaces + the sample-plate script + tests only).
export {
  ROOF_FORMS,
  SILHOUETTE_BY_KIND,
  silhouetteForKind,
  OBLIQUE_PROJ,
  FLAT_PLAN_PROJ,
  makeCavalierProject,
  buildingMassingOps,
  compareMassingDepth,
} from './massing.js';
export {
  assignInstitutionsToDistricts,
  CATEGORY_AFFINITY,
  HAMLET_CLUSTER_ID,
} from './institutionAssignment.js';
// SM-5 THE CHANGE VIEW — the chronicle's spatial twin (rebuilt blocks / scars /
// recent calamities), composed from fabricRead + the calamity read model. Pure,
// lazy (consumed only by the map surfaces + tests).
export { buildChangeView } from './changeView.js';
// IT-3 THE SEASON/STATE PORTRAIT — the pure resolver that turns a settlement's live
// worldState + reads into the bounded MapDress the ground-dress layer consumes. Never
// stored on the settlement; null ⇒ seasonless base bytes. Lazy (map surfaces + tests only).
export { resolveMapDress } from './mapDress.js';
// SM-3 — the cosmetic mapEdits container (pure read + merge ops). Imported ONLY by
// the lazy viewer pane + tests, so this stays out of the first-paint static closure.
export {
  MAP_EDITS_SCHEMA_KEYS,
  LAYOUT_LAW_VERSIONS,
  DEFAULT_LAYOUT_LAW_VERSION,
  readMapEdits,
  readLegendPrefs,
  readLayoutVariant,
  readStyleLens,
  readLayoutLawVersion,
  readAnnotations,
  readBespokeStyles,
  readSeasonOverride,
  readSceneOverrides,
  sceneOverrideFor,
  SEASON_OVERRIDE_IDS,
  SCENE_OVERRIDE_SKIN_IDS,
  normalizeMapEdits,
  withPinNudge,
  withSceneOverride,
  withoutSceneOverride,
  withLayoutVariant,
  nextLayoutVariant,
  withLegendPref,
  withStyleLens,
  withLayoutLawVersion,
  withAnnotation,
  withoutAnnotationAt,
  withBespokeStyles,
  withSeasonOverride,
  newSettlementMapEdits,
} from './mapEdits.js';
// DEFAULT-3D SETTLEMENT PORTRAIT — the renderer-neutral semantic manifest +
// transfer-ready geometry compiler. TownMapModel remains the plan authority;
// this is only its deterministic dimensional projection.
export {
  compileTownSceneManifest,
  validateTownSceneManifest,
  assertTownSceneManifest,
  stableSceneStringify,
  sceneDigest,
  stableSceneDigest,
  stableSceneDigests,
  compileTownSceneGeometry,
  townSceneGeometryTransferList,
  TOWN_SCENE_SCHEMA_VERSION,
  TOWN_SCENE_COMPILER_VERSION,
  TOWN_SCENE_GEOMETRY_BUNDLE_VERSION,
} from '../townScene/index.js';
// SM-4 — the deterministic DRAW projection (model → primitive ops → SVG string),
// shared by the PDF plate + the library-card thumbnail. Imported ONLY by those
// lazy export surfaces + tests, so it stays out of the first-paint static closure.
export {
  EXPORT_PALETTE,
  exportDistrictColor,
  buildTownMapDrawList,
  landformDrawOps,
  drawListToSvg,
  buildTownMapSvg,
  hasDrawableMap,
  annotationDrawOps,
} from './townMapDraw.js';
// THE TABLE LAYER (DOOR 2) — the fog-of-war session sidecar (pure read + merge ops) +
// the semantic-snap reveal geometry. Imported ONLY by the lazy fog surfaces + the export
// lane + tests, so this stays out of the first-paint static closure (the townMapLazy pin).
export {
  FOG_REVEAL_KINDS,
  FOG_SESSIONS_SCHEMA_KEYS,
  fogSessionId,
  readFogSessions,
  readFogSession,
  readReveal,
  sessionHasReveal,
  listFogSessionIds,
  normalizeFogSession,
  normalizeFogSessions,
  withSession,
  withoutSession,
  withRenamedSession,
  withRevealed,
  withRevealSet,
  withClearedReveal,
} from './fogSessions.js';
export {
  FOG_VIEW,
  fogStreets,
  allRevealIds,
  snapToSemantic,
  revealShapes,
  isFullyFogged,
  fogMaskFragment,
  injectFog,
} from './fogGeometry.js';
// THE SKIN REGISTRY (THE ILLUSTRATED TOWN, IT-4) — the pure additive-save + flip-back
// resolver for saved bespoke skins. resolveActiveStyle is the chokepoint every render surface
// routes through so a saved skin is WORN in lockstep (pane / image export / thumbnail / PDF);
// a base lens is never shadowed. Lazy (consumed only by the town-map surfaces + AI panel + tests).
export {
  isBaseLensId,
  addBespokeStyle,
  readBespokeStyle,
  removeBespokeStyle,
  listBespokeStyles,
  resolveActiveStyle,
} from './bespokeStyles.js';
// MAP STYLES — the bounded style layer (the four named lenses + the wall). A style
// is data; the draw projection resolves it, the viewer reads it. Lazy (src/design,
// consumed only by the town-map surfaces + tests), so first paint is unmoved.
export {
  TOWN_MAP_STYLE_IDS,
  TOWN_MAP_LENS_IDS,
  ILLUSTRATED_STYLE_ID,
  DEFAULT_STYLE_ID,
  FURNITURE_KINDS,
  HAZARD_GLYPHS,
  ANCHOR_GLYPHS,
  CONTRAST_LEVELS,
  resolveTownMapStyle,
  coerceStyleId,
  styleDistrictColor,
  viewerPalette,
} from '../../design/townMapStyles.js';
