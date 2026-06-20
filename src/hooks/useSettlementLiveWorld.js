/**
 * useSettlementLiveWorld — resolve the LIVE campaign world for one saved
 * settlement (UX overhaul Phase 2). Centralises the owning-campaign lookup that
 * SummaryTab's Faith & War block, the Substrate sub-tab, and the deepened
 * Economics/Defense/Power readouts all need, so they read ONE source of truth.
 *
 * Given a saveId, find the campaign that owns it (the same lookup FaithWarBlock
 * used) and return its live `worldState` + `regionalGraph` plus a `nameFor(id)`
 * resolver over the saved-settlements roster. Returns nulls when there is no
 * owning campaign (a non-campaign / dormant settlement) so every consumer
 * self-gates to nothing — the byte-identical off-state.
 *
 * Pure store binding; no writes, no rng, no wall clock.
 *
 *   const { worldState, regionalGraph, nameFor, inCampaign } = useSettlementLiveWorld(saveId);
 */

import { useMemo } from 'react';
import { useStore } from '../store/index.js';

/**
 * @param {string|null|undefined} saveId
 * @returns {{
 *   campaign: any,
 *   worldState: any,
 *   regionalGraph: any,
 *   inCampaign: boolean,
 *   settlements: Array<{ id: string, settlement: any }>,
 *   nameFor: (id: any) => string,
 * }}
 */
export function useSettlementLiveWorld(saveId) {
  const campaign = useStore(s => {
    if (!saveId) return null;
    return (s.campaigns || []).find(
      c => (c.settlementIds || []).map(String).includes(String(saveId)),
    ) || null;
  });
  const savedSettlements = useStore(s => s.savedSettlements);

  return useMemo(() => {
    const worldState = campaign?.worldState || null;
    const regionalGraph = campaign?.regionalGraph || campaign?.worldState?.regionalGraph || null;
    /** @type {Map<string, string>} */
    const nameById = new Map();
    for (const sv of savedSettlements || []) {
      const id = sv?.id || sv?.settlement?.id;
      const nm = sv?.name || sv?.settlement?.name;
      if (id && nm) nameById.set(String(id), nm);
    }
    // The campaign's member settlement items — for read-models that need the
    // regional roster (trade pressure / occupation usefulness). Empty off-campaign.
    const memberIds = new Set((campaign?.settlementIds || []).map(String));
    const settlements = (savedSettlements || [])
      .filter((/** @type {any} */ sv) => memberIds.has(String(sv?.id || sv?.settlement?.id)))
      .map((/** @type {any} */ sv) => ({ id: String(sv?.id || sv?.settlement?.id), settlement: sv?.settlement || sv }));
    return {
      campaign,
      worldState,
      regionalGraph,
      inCampaign: !!campaign,
      settlements,
      nameFor: (/** @type {any} */ id) => nameById.get(String(id)) || String(id),
    };
  }, [campaign, savedSettlements]);
}
