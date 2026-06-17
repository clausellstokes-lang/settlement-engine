/**
 * useMapAutosave.js — debounced map autosave into the active campaign.
 *
 * Extracted byte-for-byte from WorldMap.jsx (no logic change). Side-effect
 * hook (returns nothing).
 *
 * P112 / M-5 — Auto-save the working map into the active campaign so it
 * persists per account and across devices without a manual click. The key
 * mirrors AutoSaveChip's "dirty" fingerprint (placement ids + layer counts);
 * the save is debounced and only fires when the live map differs from the
 * campaign's persisted map (so no save loop, no redundant writes).
 * saveCampaignMap bumps the campaign's updatedAt, which rides the existing
 * campaign cloud sync. Gated on the mapAutosave flag + an active campaign.
 */

import { useEffect } from 'react';
import { useStore } from '../store/index.js';
import { flag } from '../lib/flags.js';

export function useMapAutosave(activeCampaignId, activeCampaign, saveCampaignMap) {
  const mapDirtyKey = useStore(s => {
    const m = s.mapState || {};
    return `${Object.keys(m.placements || {}).sort().join(',')}|${(m.labels || []).length}|${(m.markers || []).length}|${(m.forests || []).length}|${m.customBackdrop?.imageUrl || ''}`;
  });
  useEffect(() => {
    if (!flag('mapAutosave') || !activeCampaignId) return undefined;
    const p = activeCampaign?.mapState || {};
    const persistedKey = `${Object.keys(p.placements || {}).sort().join(',')}|${(p.labels || []).length}|${(p.markers || []).length}|${(p.forests || []).length}|${p.customBackdrop?.imageUrl || ''}`;
    if (mapDirtyKey === persistedKey) return undefined;
    const t = setTimeout(() => {
      try { saveCampaignMap(activeCampaignId, useStore.getState().mapState); }
      catch { /* autosave is best-effort; the manual Save action remains */ }
    }, 3500);
    return () => clearTimeout(t);
  }, [mapDirtyKey, activeCampaignId, activeCampaign, saveCampaignMap]);
}
