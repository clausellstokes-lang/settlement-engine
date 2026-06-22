import { useEffect, useRef } from 'react';
import { useStore } from '../store/index.js';
import { resumeCampaignTarget } from '../store/campaignSliceShared.js';

/**
 * useCampaignAutoResume — premium / elevated auto-resume for the Realm.
 *
 * On a COLD Realm entry (no campaign selected yet — the state after a reload,
 * since activeCampaignId is deliberately not persisted) this reopens the
 * campaign the user last used, so the map they were working on loads first
 * instead of a blank world. It only SETS the active campaign id; WorldMap's
 * existing mount-sync effect observes the change and paints the campaign's
 * saved map.
 *
 * Fires once per mount and never overrides an in-session selection: the
 * Settlements "Advance Time" button and the gallery map-import both set the
 * active id BEFORE navigating to the Realm, so activeCampaignId is already
 * non-null in those cases and this no-ops. Scoped to users who can manage
 * campaigns (premium / elevated) — `activeCampaigns` is empty for everyone else,
 * so there is nothing to resume regardless.
 *
 * @param {Object} args
 * @param {boolean} args.canManageCampaigns  premium || elevated
 * @param {any[]}   args.activeCampaigns      the user's selectable campaigns (updated_at-desc)
 * @param {string|null} args.activeCampaignId currently-selected campaign id
 */
export function useCampaignAutoResume({ canManageCampaigns, activeCampaigns, activeCampaignId }) {
  const campaignsLoaded = useStore(s => s.campaignsLoaded);
  const lastActiveCampaignId = useStore(s => s.lastActiveCampaignId);
  const setActiveCampaign = useStore(s => s.setActiveCampaign);
  const resumedRef = useRef(false);

  useEffect(() => {
    if (resumedRef.current) return;
    if (!canManageCampaigns || !campaignsLoaded) return;
    if (activeCampaignId) return; // already have a selection — never override it
    const target = resumeCampaignTarget(activeCampaigns, lastActiveCampaignId);
    if (!target) return;
    resumedRef.current = true;
    setActiveCampaign(target);
  }, [canManageCampaigns, campaignsLoaded, activeCampaignId, activeCampaigns, lastActiveCampaignId, setActiveCampaign]);
}
