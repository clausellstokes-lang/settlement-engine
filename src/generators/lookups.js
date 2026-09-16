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
 *   - data/constants.js       (TIER_ORDER, POPULATION_RANGES)
 *   - data/institutionalCatalog.js
 *
 * No generator imports, no React, no store. That keeps it tree-shakable
 * and chunkable as a sibling of the data tables it accesses.
 *
 * Callers should import these helpers directly from this file.
 */

import { TIER_ORDER, POPULATION_RANGES } from '../data/constants.js';
import { institutionalCatalog } from '../data/institutionalCatalog.js';

// These need to be FUNCTIONS (not values) because hooks/selectors
// historically called them as getTierOrder() — preserving the signature.
export const getTierOrder        = () => TIER_ORDER;
export const getPopulationRanges = () => POPULATION_RANGES;

// pipeline-5: merge a list of tier catalogs (later tiers override on name clash),
// mirroring assembleInstitutions.mergeCatalogs so the UI lookup and the generator
// agree about what a metropolis catalog contains.
const mergeTierCatalogs = (tiers) => {
  const merged = {};
  for (const t of tiers) {
    const tierCat = institutionalCatalog[t] || {};
    for (const [category, insts] of Object.entries(tierCat)) {
      if (!merged[category]) merged[category] = {};
      for (const [name, def] of Object.entries(insts)) {
        merged[category][name] = def;
      }
    }
  }
  return merged;
};

/**
 * Return the institutional catalog appropriate for a given tier.
 * Special cases:
 *   - random/custom/no-tier → village catalog (sane default for previews)
 *   - metropolis → city + metropolis merge (the 24 metropolis-only entries — e.g.
 *     Academy of magic, Assassins' guild, Underground city — are reachable so the
 *     UI catalog/force path can author them; pipeline-5)
 *   - 'all' → merged catalog across all tiers (metropolis included)
 */
export const getInstitutionalCatalog = (tier) => {
  if (!tier || tier === 'random' || tier === 'custom') return institutionalCatalog['village'] || {};
  if (tier === 'metropolis') return mergeTierCatalogs(['city', 'metropolis']);
  if (tier === 'all') return mergeTierCatalogs(['thorp','hamlet','village','town','city','metropolis']);
  return institutionalCatalog[tier] || {};
};

/**
 * Full catalog merged across all tiers, with each institution def
 * tagged with `nativeTier` so the UI can show which tier it originated
 * in. Used by InstitutionalGrid for the "all tiers" view.
 */
export const getFullCatalogWithTierMeta = () => {
  const tierOrder = ['thorp','hamlet','village','town','city','metropolis'];
  const merged = {};
  for (const t of tierOrder) {
    const tierCat = institutionalCatalog[t] || {};
    for (const [category, insts] of Object.entries(tierCat)) {
      if (!merged[category]) merged[category] = {};
      for (const [name, def] of Object.entries(insts)) {
        merged[category][name] = { ...def, nativeTier: t };
      }
    }
  }
  return merged;
};

/** Set of institution names that exist in the native tier catalog. */
export const getInstitutionsForTier = (tier) => {
  // metropolis inherits city AND its own top-tier entries (pipeline-5).
  const tiers = tier === 'metropolis' ? ['city', 'metropolis'] : [tier];
  const names = new Set();
  for (const t of tiers) {
    const cat = institutionalCatalog[t] || {};
    Object.values(cat).forEach(insts => Object.keys(insts).forEach(n => names.add(n)));
  }
  return names;
};
