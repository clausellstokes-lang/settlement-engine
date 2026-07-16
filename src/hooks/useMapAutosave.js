/**
 * useMapAutosave.js — debounced map autosave into the active campaign.
 *
 * Extracted byte-for-byte from WorldMap.jsx (no logic change). Side-effect
 * hook (returns nothing).
 *
 * P112 / M-5 — Auto-save the working map into the active campaign so it
 * persists per account and across devices without a manual click. The dirty
 * check uses the SHARED content-aware fingerprint (mapDirtyFingerprint) — the
 * SAME source AutoSaveChip reads, so the chip and the writer can never disagree
 * (components-map-1: the hook's old count-only key ignored drag-moves + renames,
 * so the chip read "Unsaved changes" while the autosave never fired). The save is
 * debounced and only fires when the live map differs from the campaign's persisted
 * map (so no save loop, no redundant writes). saveCampaignMap bumps the campaign's
 * updatedAt, which rides the existing campaign cloud sync. Gated on the mapAutosave
 * flag + an active campaign.
 */

import { useEffect } from 'react';
import { useStore } from '../store/index.js';
import { flag } from '../lib/flags.js';
import { mapDirtyFingerprint } from '../components/map/mapDirtyFingerprint.js';

export function useMapAutosave(activeCampaignId, activeCampaign, saveCampaignMap) {
  const mapDirtyKey = useStore(s => mapDirtyFingerprint(s.mapState));
  useEffect(() => {
    if (!flag('mapAutosave') || !activeCampaignId) return undefined;
    const persistedKey = mapDirtyFingerprint(activeCampaign?.mapState);
    if (mapDirtyKey === persistedKey) return undefined;
    const t = setTimeout(() => {
      try { saveCampaignMap(activeCampaignId, useStore.getState().mapState); }
      catch { /* autosave is best-effort; the manual Save action remains */ }
    }, 3500);
    return () => clearTimeout(t);
  }, [mapDirtyKey, activeCampaignId, activeCampaign, saveCampaignMap]);
}
