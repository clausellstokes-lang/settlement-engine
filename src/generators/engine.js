/**
 * engine.js — Settlement Generation Engine
 * Re-exports from proper source generator files.
 */

export {
  generateSettlement,
  regenNPCs,
  regenHistory,
  getRandomSliders,
} from '../generators/generateSettlement.js';

export { institutionalCatalog as getFullCatalog } from '../data/institutionalCatalog.js';

// These need to be FUNCTIONS (not values) because the hook calls them as getTierOrder()
import { TIER_ORDER, POPULATION_RANGES } from '../data/constants.js';
import { institutionalCatalog } from '../data/institutionalCatalog.js';

export const getTierOrder           = () => TIER_ORDER;
export const getPopulationRanges    = () => POPULATION_RANGES;

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

// ── New functions for cross-tier catalog access ───────────────────────────────

// Returns full catalog merged across all tiers, with nativeTier tagged on each institution def
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

// Returns a Set of institution names that exist in the native tier catalog
export const getInstitutionsForTier = (tier) => {
  const t = tier === 'metropolis' ? 'city' : tier;
  const cat = institutionalCatalog[t] || {};
  const names = new Set();
  Object.values(cat).forEach(insts => Object.keys(insts).forEach(n => names.add(n)));
  return names;
};
