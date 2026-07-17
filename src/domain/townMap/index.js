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
export {
  assignInstitutionsToDistricts,
  CATEGORY_AFFINITY,
  HAMLET_CLUSTER_ID,
} from './institutionAssignment.js';
// SM-3 — the cosmetic mapEdits container (pure read + merge ops). Imported ONLY by
// the lazy viewer pane + tests, so this stays out of the first-paint static closure.
export {
  MAP_EDITS_SCHEMA_KEYS,
  readMapEdits,
  readLegendPrefs,
  readLayoutVariant,
  normalizeMapEdits,
  withPinNudge,
  withLayoutVariant,
  nextLayoutVariant,
  withLegendPref,
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
} from './townMapDraw.js';
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
