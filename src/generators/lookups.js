/**
 * lookups.js — Pure catalog and tier lookups.
 *
 * Why this file exists: store selectors and a few synchronously-loaded
 * components (InstitutionalGrid) need cheap catalog/tier accessors at
 * boot without pulling the generator pipeline into the synchronous
 * first-paint graph. The pipeline itself only runs on user click.
 *
 * This module deliberately depends ONLY on `/src/data/`:
 *
 *   - data/constants.js           (TIER_ORDER, POPULATION_RANGES)
 *   - data/institutionLookups.js  (the institutional catalogue's tier readers)
 *
 * No generator imports, no React, no store. That keeps it tree-shakable
 * and chunkable as a sibling of the data tables it accesses.
 *
 * ⭐ EM-P4 moved the institutional readers DOWN a layer, into
 * `src/data/institutionLookups.js`, and this file KEEPS EVERY EXPORT NAME IT HAD:
 * the four below are BARE re-exports of that home, the same function objects, so
 * no caller changed. The move lets a `src/domain` reader reach the tier gate
 * without an edge across the generator boundary; `src/domain/institutionLookups.js`
 * is that reader's address, and ⛔ no generator module may take it — it would seed
 * the eager first-paint chunk through `computeEngineSharedDomain()`.
 *
 * Callers should import these helpers directly from this file.
 */

import { TIER_ORDER, POPULATION_RANGES } from '../data/constants.js';

// These need to be FUNCTIONS (not values) because hooks/selectors
// historically called them as getTierOrder() — preserving the signature.
export const getTierOrder        = () => TIER_ORDER;
export const getPopulationRanges = () => POPULATION_RANGES;

export {
  institutionAvailableAtTier,
  getInstitutionalCatalog,
  getFullCatalogWithTierMeta,
  getInstitutionsForTier,
} from '../data/institutionLookups.js';
