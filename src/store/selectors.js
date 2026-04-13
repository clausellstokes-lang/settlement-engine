/**
 * selectors.js — Derived/computed selectors for the Zustand store.
 *
 * These replace the useMemo computations that lived in useSettlementGeneration.
 * Components use: const catalog = useStore(selectCurrentCatalog);
 */

import {
  getInstitutionalCatalog,
  getFullCatalogWithTierMeta,
  getInstitutionsForTier,
  getTierOrder,
  getPopulationRanges,
} from '../generators/engine.js';
import { filterCatalogForMagic } from '../components/magicFilter.js';

const TIER_ORDER        = getTierOrder();
const POPULATION_RANGES = getPopulationRanges();

// ── Tier resolution ──────────────────────────────────────────────────────────

export function resolveDisplayTier(config) {
  const t = config.settType;
  if (t === 'custom') {
    const pop = config.population || 1500;
    for (const tier of [...TIER_ORDER].reverse()) {
      if (pop >= POPULATION_RANGES[tier].min) return tier;
    }
    return 'thorp';
  }
  if (!t || t === 'random' || t === 'custom') return 'all';
  return t;
}

// ── Selectors ────────────────────────────────────────────────────────────────

/** The effective tier for display in institution/service/goods grids. */
export const selectTierForGrid = (state) => resolveDisplayTier(state.config);

/** Whether the user has manually chosen a specific tier (not random/custom). */
export const selectIsManualTier = (state) => {
  const t = state.config.settType;
  return t && t !== 'random' && t !== 'custom';
};

/** The filtered institution catalog, respecting magic settings and tier. */
export const selectCurrentCatalog = (state) => {
  const tierForGrid = resolveDisplayTier(state.config);
  const isManualTier = selectIsManualTier(state);
  const raw = isManualTier
    ? getFullCatalogWithTierMeta()
    : getInstitutionalCatalog(tierForGrid);
  return filterCatalogForMagic(raw, state.config);
};

/** Set of institution names in the native tier. */
export const selectTierInstitutionNames = (state) => {
  const tierForGrid = resolveDisplayTier(state.config);
  return getInstitutionsForTier(tierForGrid);
};

/** Quick summary of toggle counts for UI display. */
export const selectToggleSummary = (state) => {
  const inst = state.institutionToggles;
  let forced = 0, excluded = 0;
  for (const v of Object.values(inst)) {
    if (v.require) forced++;
    if (v.forceExclude) excluded++;
  }
  return { forced, excluded, total: Object.keys(inst).length };
};

/** Count of saved settlements for the save-limit display. */
export const selectSaveCount = (state) => state.savedSettlements.length;

/** Whether the settlement data has changed since the last AI narrative. */
export const selectIsNarrativeStale = (state) => {
  if (!state.aiSettlement || !state.settlement) return true;
  return state.aiDataVersion < (state.settlement._generatedAt || 0);
};
