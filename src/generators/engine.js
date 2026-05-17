/**
 * engine.js — Settlement Generation Engine entry point.
 *
 * Two responsibilities:
 *   1. Re-export the heavy generator pipeline (generateSettlement,
 *      regenNPCs, regenHistory, getRandomSliders). Anything pulling
 *      these statically also drags in the full generator chunk
 *      (~300 kB gz) — settlementSlice does that via dynamic import.
 *   2. Re-export the lightweight catalog lookups for backward compat.
 *      New code should import these from `./lookups.js` directly to
 *      avoid pulling in the generator pipeline transitively.
 *
 * See lookups.js for the architectural rationale.
 */

export {
  generateSettlement,
  regenNPCs,
  regenHistory,
  getRandomSliders,
} from './generateSettlement.js';

export { institutionalCatalog as getFullCatalog } from '../data/institutionalCatalog.js';

// Re-export catalog lookups for backward compat. Direct imports of
// these helpers should use lookups.js to keep the import graph
// off the generator pipeline.
export {
  getTierOrder,
  getPopulationRanges,
  getInstitutionalCatalog,
  getFullCatalogWithTierMeta,
  getInstitutionsForTier,
} from './lookups.js';
