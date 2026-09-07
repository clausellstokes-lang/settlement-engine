/**
 * useLibraryLiveWorld — resolve each saved settlement's owning campaign + the
 * per-save live-world resolvers the Library's living-world filters need (UX
 * overhaul Phase 3, plan §4.2). Extracted from SettlementsPanel so the panel
 * stays focused on layout.
 *
 * Returns:
 *   - campaignBySaveId : Map<saveId, campaign>  (for living-world resolution)
 *   - filterContext    : { liveWorldFor, campaignIdFor }  the context
 *     applyLibraryFilters consumes for the `At war` / campaign filters — reusing
 *     the SAME owning-campaign worldState the cards render from (one source of
 *     truth, no divergent recompute).
 *
 * Pure derivation over the active campaigns; no store, no rng, no side effects.
 */

import { useMemo } from 'react';

/**
 * @param {Array<{ id: string, settlementIds?: Array<string>, worldState?: any, regionalGraph?: any }>} activeCampaigns
 */
export function useLibraryLiveWorld(activeCampaigns) {
  const campaignBySaveId = useMemo(() => {
    const map = new Map();
    for (const c of activeCampaigns) for (const id of (c.settlementIds || [])) map.set(String(id), c);
    return map;
  }, [activeCampaigns]);

  const filterContext = useMemo(() => ({
    liveWorldFor: (/** @type {any} */ sv) => {
      const c = campaignBySaveId.get(String(sv?.id));
      if (!c) return null;
      return {
        worldState: c.worldState || null,
        regionalGraph: c.regionalGraph || c.worldState?.regionalGraph || null,
      };
    },
    campaignIdFor: (/** @type {any} */ sv) => campaignBySaveId.get(String(sv?.id))?.id || null,
  }), [campaignBySaveId]);

  return { campaignBySaveId, filterContext };
}
