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
