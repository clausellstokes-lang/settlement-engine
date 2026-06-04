/**
 * lookups.js - Pure catalog/tier lookups extracted from engine.js.
 *
 * Why this file exists: store selectors and a few synchronously-loaded
 * components (InstitutionalGrid) need cheap catalog/tier accessors at
 * boot. Before this extraction they imported them from `engine.js`,
 * which transitively pulled the entire generator pipeline (~300 kB gz)
 * into the synchronous first-paint graph - even though the pipeline
 * itself only runs on user click.
 *
 * This module deliberately depends ONLY on `/src/data/`:
 *
 *   - data/constants.js       (TIER_ORDER, POPULATION_RANGES)
 *   - data/institutionalCatalog.js
 *
 * No generator imports, no React, no store. That keeps it tree-shakable
 * and chunkable as a sibling of the data tables it accesses.
 *
 * `engine.js` re-exports these five helpers for backward compat with
 * any caller (today none in the sync graph) that prefers the historic
 * engine.* API. New code should import directly from this file.
 */

import { TIER_ORDER, POPULATION_RANGES } from '../data/constants.js';
import { institutionalCatalog } from '../data/institutionalCatalog.js';

// These need to be FUNCTIONS (not values) because hooks/selectors
// historically called them as getTierOrder() - preserving the signature.
export const getTierOrder        = () => TIER_ORDER;
export const getPopulationRanges = () => POPULATION_RANGES;

/**
 * Return the institutional catalog appropriate for a given tier.
 * Special cases:
 *   - random/custom/no-tier → village catalog (sane default for previews)
 *   - metropolis → city catalog (metropolis inherits city)
 *   - 'all' → merged catalog across all tiers
 */
export const getInstitutionalCatalog = (tier) => {
  if (!tier || tier === 'random' || tier === 'custom') return institutionalCatalog['village'] || {};
  if (tier === 'metropolis') return institutionalCatalog['city'] || {};
  if (tier === 'all') {
    const merged = {};
    const tierOrder = ['thorp','hamlet','village','town','city'];
    for (const t of tierOrder) {
      const tierCat = institutionalCatalog[t] || {};
      for (const [category, insts] of Object.entries(tierCat)) {
        if (!merged[category]) merged[category] = {};
        for (const [name, def] of Object.entries(insts)) {
          merged[category][name] = def;
        }
      }
    }
    return merged;
  }
  return institutionalCatalog[tier] || {};
};

/**
 * Full catalog merged across all tiers, with each institution def
 * tagged with `nativeTier` so the UI can show which tier it originated
 * in. Used by InstitutionalGrid for the "all tiers" view.
 */
export const getFullCatalogWithTierMeta = () => {
  const tierOrder = ['thorp','hamlet','village','town','city'];
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
  const t = tier === 'metropolis' ? 'city' : tier;
  const cat = institutionalCatalog[t] || {};
  const names = new Set();
  Object.values(cat).forEach(insts => Object.keys(insts).forEach(n => names.add(n)));
  return names;
};
