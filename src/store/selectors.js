/**
 * selectors.js — Derived/computed selectors for the Zustand store.
 *
 * Components use: const catalog = useStore(selectCurrentCatalog);
 *
 * Bundle note: direct catalog lookups keep the synchronous first-paint graph
 * independent of the generator pipeline. The pipeline is dynamic-imported
 * from settlementSlice's loadEngine().
 */

import {
  getInstitutionalCatalog,
  getFullCatalogWithTierMeta,
  getInstitutionsForTier,
  getTierOrder,
  getPopulationRanges,
} from '../generators/lookups.js';
import { filterCatalogForMagic } from '../domain/magicFilter.js';
import { settlementFingerprint } from '../lib/settlementFingerprint.js';
import { activeSaveCount } from '../lib/saveAccess.js';

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

/**
 * The filtered institution catalog, respecting magic settings and tier.
 *
 * Memoised: React 19's useSyncExternalStore requires getSnapshot to return
 * a stable reference on consecutive calls with the same inputs. Without
 * caching, every call creates a new object which triggers infinite re-renders.
 *
 * Module-global cache safety (why this single-entry cache is NOT a cross-store
 * hazard, despite living at module scope): the result is a pure function of the
 * cache key PLUS process-global inputs only. The key captures every per-store
 * input (state.config's tier/manual/magic fields). The remaining inputs —
 * getInstitutionalCatalog / getFullCatalogWithTierMeta and the custom-content
 * source — are process-global (the custom-content getter reads the singleton
 * store via setCustomContentSource, not a per-instance store). So two store
 * instances that compute the same key necessarily resolve to the same catalog;
 * a stale cross-store hit is not realizable. Same reasoning holds for
 * selectTierInstitutionNames (keyed on tier, a pure function of it) and
 * selectToggleSummary (keyed on the institutionToggles REFERENCE, which is
 * inherently per-store). Do not "fix" these into per-store maps — the coarse key
 * is deliberate for render stability and is already collision-safe.
 */
let _catalogCache = { key: null, result: null };

export const selectCurrentCatalog = (state) => {
  const tierForGrid = resolveDisplayTier(state.config);
  const isManualTier = selectIsManualTier(state);
  const magicExists = state.config.magicExists;
  const priorityMagic = state.config.priorityMagic;

  const key = `${tierForGrid}|${isManualTier}|${magicExists}|${priorityMagic}`;
  if (key === _catalogCache.key) return _catalogCache.result;

  const raw = isManualTier
    ? getFullCatalogWithTierMeta()
    : getInstitutionalCatalog(tierForGrid);
  const result = filterCatalogForMagic(raw, state.config);

  _catalogCache = { key, result };
  return result;
};

/**
 * Set of institution names in the native tier.
 * Memoised for React 19 useSyncExternalStore stability.
 */
let _tierNamesCache = { key: null, result: null };

export const selectTierInstitutionNames = (state) => {
  const tierForGrid = resolveDisplayTier(state.config);
  if (tierForGrid === _tierNamesCache.key) return _tierNamesCache.result;

  const result = getInstitutionsForTier(tierForGrid);
  _tierNamesCache = { key: tierForGrid, result };
  return result;
};

/**
 * Quick summary of toggle counts for UI display.
 * Memoised for React 19 useSyncExternalStore stability.
 */
let _toggleSummaryCache = { ref: null, result: null };

export const selectToggleSummary = (state) => {
  const inst = state.institutionToggles;
  if (inst === _toggleSummaryCache.ref) return _toggleSummaryCache.result;

  let forced = 0, excluded = 0;
  for (const v of Object.values(inst)) {
    if (v.require) forced++;
    if (v.forceExclude) excluded++;
  }
  const result = { forced, excluded, total: Object.keys(inst).length };
  _toggleSummaryCache = { ref: inst, result };
  return result;
};

/** Count of active saved settlements for save-limit display. */
export const selectSaveCount = (state) => activeSaveCount(state.savedSettlements);

/** Whether the settlement data has changed since the last AI narrative. */
export const selectIsNarrativeStale = (state) => {
  if (!state.aiSettlement || !state.settlement) return true;
  if (!state.aiDataVersion || !state.aiSourceFingerprint) return true;
  return state.aiSourceFingerprint !== settlementFingerprint(state.settlement);
};
