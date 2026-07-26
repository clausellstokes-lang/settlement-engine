/**
 * Derived campaign view model for the World Map controller.
 *
 * WorldMap owns events and side effects. This hook owns the related read-only
 * projections that describe the selected campaign: normalized identity, pulse
 * undo state, visible member saves, and the copy used by the advance dialog.
 * Keeping those calculations together makes the controller's wiring readable
 * without creating a second source of campaign state.
 */

import { useMemo } from 'react';
import { isCanonSave } from '../../domain/campaign/canon.js';
import { isCampaignActive } from '../../lib/campaigns.js';
import { useStore } from '../../store/index.js';
import {
  campaignMemberSaves,
  findEntityById,
  sameEntityId,
} from './mapEntityIds.js';
import { nameMapFromSaves } from './WorldPulseData.js';

const ADVANCE_INTERVAL_LABELS = {
  one_week: 'one week',
  one_month: 'one month',
  one_season: 'one season',
  one_year: 'one year',
};

function latestAdvanceInterval(stack, activeCampaignId) {
  if (activeCampaignId == null) return null;

  for (let index = stack.length - 1; index >= 0; index -= 1) {
    const entry = stack[index];
    if (sameEntityId(entry.campaignId, activeCampaignId)) {
      return entry.interval || null;
    }
  }

  return null;
}

/**
 * @param {{
 *   authTier: string|undefined,
 *   activeCampaignId: unknown,
 *   worldPulseInterval: string,
 * }} options
 */
export function useWorldMapCampaignModel({
  authTier,
  activeCampaignId,
  worldPulseInterval,
}) {
  const isElevated = useStore(state => state.isElevated());
  const campaigns = useStore(state => state.campaigns);
  const saves = useStore(state => state.savedSettlements);
  const canManageCampaigns = authTier === 'premium' || isElevated;
  const activeCampaigns = useMemo(
    () => canManageCampaigns ? campaigns.filter(isCampaignActive) : [],
    [campaigns, canManageCampaigns],
  );
  const activeCampaign = useMemo(
    () => findEntityById(activeCampaigns, activeCampaignId),
    [activeCampaigns, activeCampaignId],
  );
  const activeCampaignTargetId = activeCampaign?.id ?? activeCampaignId;

  const canUndoPulse = useStore(state => (
    activeCampaignId != null
    && (state.pulseUndoStack || []).some(entry => (
      sameEntityId(entry.campaignId, activeCampaignId)
    ))
  ));
  const lastAdvanceInterval = useStore(state => (
    latestAdvanceInterval(state.pulseUndoStack || [], activeCampaignId)
  ));

  const unreviewedPulseCount = useMemo(
    () => (activeCampaign?.worldState?.proposals || [])
      .filter(proposal => proposal?.status === 'pending').length,
    [activeCampaign],
  );
  const advanceScopeBody = useMemo(() => {
    const settlementCount = activeCampaign?.settlementIds?.length || 0;
    const settlementLabel = settlementCount === 1
      ? '1 settlement'
      : `${settlementCount} settlements`;
    const intervalLabel = ADVANCE_INTERVAL_LABELS[worldPulseInterval] || 'one step';

    return `Advance ${settlementLabel} by ${intervalLabel}? The realm will drift and may surface proposals to review. This undo is available only for the current session.`;
  }, [activeCampaign, worldPulseInterval]);

  const activeSaves = useMemo(
    () => campaignMemberSaves(saves, activeCampaign).filter(isCanonSave),
    [activeCampaign, saves],
  );
  const nameById = useMemo(() => nameMapFromSaves(saves), [saves]);

  return {
    activeCampaign,
    activeCampaigns,
    activeCampaignTargetId,
    activeSaves,
    advanceScopeBody,
    canManageCampaigns,
    canUndoPulse,
    lastAdvanceInterval,
    nameById,
    unreviewedPulseCount,
  };
}
