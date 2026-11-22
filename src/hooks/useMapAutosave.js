/**
 * useMapAutosave.js — debounced map autosave into the active campaign.
 *
 * Extracted from WorldMap.jsx. Side-effect hook (returns nothing). Master-merge
 * reconciliation: this lineage's RF fix-wave routes the dirty check through the
 * SHARED fingerprint module (mapDirtyFingerprint, below), while the master lineage
 * added the flush-on-leave data-loss guard. Both belong — the hook keeps the shared
 * fingerprint AND flushes a pending save on unmount / pagehide (see the second
 * effect) so an edit made inside the 3.5s debounce window is never silently dropped
 * when the user navigates away or closes the tab.
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

import { useEffect, useRef } from 'react';
import { useStore } from '../store/index.js';
import { flag } from '../lib/flags.js';
import { mapDirtyFingerprint } from '../components/map/mapDirtyFingerprint.js';

export function useMapAutosave(activeCampaignId, activeCampaign, saveCampaignMap) {
  const mapDirtyKey = useStore(s => mapDirtyFingerprint(s.mapState));
  // The scheduled-but-not-yet-written autosave, or null. A route-change unmount or a
  // tab-close (pagehide) WITHIN the 3.5s debounce window would otherwise just clear the
  // timer and silently drop the user's last map edit — the exact data-loss the dirty
  // fingerprint was written to prevent, reintroduced on the leave path. The pagehide +
  // unmount handler below flushes this ref so the pending edit still lands.
  const pendingRef = useRef(null);

  useEffect(() => {
    if (!flag('mapAutosave') || !activeCampaignId) { pendingRef.current = null; return undefined; }
    const persistedKey = mapDirtyFingerprint(activeCampaign?.mapState);
    if (mapDirtyKey === persistedKey) { pendingRef.current = null; return undefined; }
    // Arm a pending flush for the active campaign (the map state is read live at write
    // time, so the ref only needs to remember WHICH campaign is dirty).
    pendingRef.current = { campaignId: activeCampaignId };
    const t = setTimeout(() => {
      pendingRef.current = null;
      try { saveCampaignMap(activeCampaignId, useStore.getState().mapState); }
      catch { /* autosave is best-effort; the manual Save action remains */ }
    }, 3500);
    // Cleanup clears only the TIMER, not pendingRef: a dep-change (another edit) simply
    // reschedules, and an unmount/pagehide before the timer fires still flushes below.
    return () => clearTimeout(t);
  }, [mapDirtyKey, activeCampaignId, activeCampaign, saveCampaignMap]);

  // Flush a pending autosave on tab-close (pagehide) and on unmount (navigating away
  // from the map), reading the live map state at flush time. Low-value telemetry already
  // flushes on pagehide; the user's actual map work must too.
  useEffect(() => {
    const flush = () => {
      const pending = pendingRef.current;
      if (!pending) return;
      pendingRef.current = null;
      try { saveCampaignMap(pending.campaignId, useStore.getState().mapState); }
      catch { /* best-effort — the manual Save action remains */ }
    };
    window.addEventListener('pagehide', flush);
    return () => {
      window.removeEventListener('pagehide', flush);
      flush();
    };
  }, [saveCampaignMap]);
}
