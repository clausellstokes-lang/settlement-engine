/**
 * useMapAutosave.js — debounced map autosave into the active campaign.
 *
 * Extracted byte-for-byte from WorldMap.jsx (no logic change). Side-effect
 * hook (returns nothing).
 *
 * Auto-save the working map into the active campaign so it
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

/**
 * Content-aware fingerprint of the user-editable parts of a map.
 *
 * The old key folded in only placement *ids* and layer *counts*, so a
 * drag-move (updatePlacement / updateLabel / updateMarker / updateForest —
 * which change x/y and annotation content without touching the id set or the
 * counts) left the fingerprint unchanged. Autosave then never fired and the
 * change was silently lost. We fold coordinates + annotation content into the
 * fingerprint so any editable mutation is observed.
 */
export function mapFingerprint(m) {
  const s = m || {};
  const placements = Object.entries(s.placements || {})
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([k, p]) => `${k}:${p?.x},${p?.y},${p?.cellId ?? ''},${p?.settlementId ?? ''}`)
    .join(',');
  const labels = (s.labels || [])
    .map(l => `${l?.id}:${l?.x},${l?.y},${l?.rotation ?? 0},${l?.fontSize ?? ''},${l?.color ?? ''},${l?.fontFamily ?? ''},${l?.text ?? ''}`)
    .join(';');
  const markers = (s.markers || [])
    .map(mk => `${mk?.id}:${mk?.x},${mk?.y},${mk?.icon ?? ''},${mk?.color ?? ''},${mk?.title ?? ''},${mk?.note ?? ''}`)
    .join(';');
  const forests = (s.forests || [])
    .map(f => `${f?.id}:${f?.x},${f?.y},${f?.radius ?? ''},${f?.density ?? ''},${f?.treeStyle ?? ''}`)
    .join(';');
  return `${placements}|${labels}|${markers}|${forests}|${s.customBackdrop?.imageUrl || ''}`;
}

export function useMapAutosave(activeCampaignId, activeCampaign, saveCampaignMap) {
  const mapDirtyKey = useStore(s => mapFingerprint(s.mapState));
  useEffect(() => {
    if (!flag('mapAutosave') || !activeCampaignId) return undefined;
    const persistedKey = mapFingerprint(activeCampaign?.mapState);
    if (mapDirtyKey === persistedKey) return undefined;
    const t = setTimeout(() => {
      try { saveCampaignMap(activeCampaignId, useStore.getState().mapState); }
      catch { /* autosave is best-effort; the manual Save action remains */ }
    }, 3500);
    return () => clearTimeout(t);
  }, [mapDirtyKey, activeCampaignId, activeCampaign, saveCampaignMap]);
}
