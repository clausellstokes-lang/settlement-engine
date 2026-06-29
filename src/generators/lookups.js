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
  // Include 'metropolis' so metropolis-native institutions appear in the grid's
  // all-tiers view and resolve their nativeTier correctly — matching the
  // generator's own cross-tier catalog (assembleInstitutions), which already
  // spans metropolis. Last-wins, so a name shared with a higher tier reports the
  // higher (truer) nativeTier.
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
  const t = tier === 'metropolis' ? 'city' : tier;
  const cat = institutionalCatalog[t] || {};
  const names = new Set();
  Object.values(cat).forEach(insts => Object.keys(insts).forEach(n => names.add(n)));
  return names;
};
