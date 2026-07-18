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
export { buildTownMapPanoramaDrawList, buildTownMapPanoramaSvg } from './townPanorama.js';
export {
  assignInstitutionsToDistricts,
  CATEGORY_AFFINITY,
  HAMLET_CLUSTER_ID,
} from './institutionAssignment.js';
// SM-5 THE CHANGE VIEW — the chronicle's spatial twin (rebuilt blocks / scars /
// recent calamities), composed from fabricRead + the calamity read model. Pure,
// lazy (consumed only by the map surfaces + tests).
export { buildChangeView } from './changeView.js';
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
  normalizeMapEdits,
  withPinNudge,
  withLayoutVariant,
  nextLayoutVariant,
  withLegendPref,
  withStyleLens,
  withLayoutLawVersion,
  withAnnotation,
  withoutAnnotationAt,
  withBespokeStyles,
  newSettlementMapEdits,
} from './mapEdits.js';
// SM-4 — the deterministic DRAW projection (model → primitive ops → SVG string),
// shared by the PDF plate + the library-card thumbnail. Imported ONLY by those
// lazy export surfaces + tests, so it stays out of the first-paint static closure.
export {
  EXPORT_PALETTE,
  exportDistrictColor,
  buildTownMapDrawList,
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
// MAP STYLES — the bounded style layer (the four named lenses + the wall). A style
// is data; the draw projection resolves it, the viewer reads it. Lazy (src/design,
// consumed only by the town-map surfaces + tests), so first paint is unmoved.
export {
  TOWN_MAP_STYLE_IDS,
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
