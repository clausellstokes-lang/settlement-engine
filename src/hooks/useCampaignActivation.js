/**
 * useCampaignActivation.js — the empty-state activation handlers for the Realm
 * surface, lifted out of WorldMap.jsx (keeps it under the component size ratchet).
 *
 * The Realm Inspector / Settlement Palette no-campaign empty states now carry a
 * real first click (P1/P8) instead of pointing at the toolbar:
 *   - onCreateCampaign → mint a campaign (tier-gated) and select it
 *   - onSelectCampaign → activate the first available active campaign
 * Both route through the caller's handleSelectCampaign so the map syncs exactly
 * as a toolbar selection would.
 */

import { useCallback } from 'react';
import { useStore } from '../store/index.js';

/**
 * @param {Object} args
 * @param {Array<{id: string}>} args.activeCampaigns  selectable active campaigns
 * @param {(id: string|null) => void} args.handleSelectCampaign
 * @param {(kind: string, text: string) => void} args.showToast
 * @param {(view: string) => void} [args.onNavigate]  the app's view router
 */
export function useCampaignActivation({ activeCampaigns, handleSelectCampaign, showToast, onNavigate }) {
  const createCampaign = useStore(s => s.createCampaign);

  const onCreateCampaign = useCallback(() => {
    const id = createCampaign('New Campaign');
    if (!id) {
      // The store refused: campaigns are Cartographer's. This used to END here,
      // in a toast that named an upgrade and offered no way to reach one — the
      // dead end the Realm's desktop gate exists to remove. The toast still
      // speaks (it is this surface's live region, and a route change alone is
      // silent about WHY the page moved), but the click now lands somewhere.
      showToast('info', 'Campaigns are part of Cartographer. Opening the pricing page.');
      onNavigate?.('pricing');
      return;
    }
    handleSelectCampaign(id);
    showToast('success', 'Campaign created. Drag settlements onto the map.');
  }, [createCampaign, handleSelectCampaign, showToast, onNavigate]);

  const onSelectCampaign = useCallback(() => {
    const first = activeCampaigns[0];
    if (first) handleSelectCampaign(first.id);
  }, [activeCampaigns, handleSelectCampaign]);

  return {
    onCreateCampaign,
    onSelectCampaign,
    hasCampaigns: activeCampaigns.length > 0,
  };
}
