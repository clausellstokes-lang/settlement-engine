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
import { parkedIntervalUndoSnapshot } from '../../store/campaignSliceShared.js';
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

  // R-5b reload-into-paused arming: after a reload the session pulseUndoStack is
  // empty, but a campaign parked mid-interval still carries its pre-INTERVAL undo
  // snapshot on the pausedAdvance cursor. undoLastPulse restores from it, so the
  // toolbar must offer the chip — gating on the stack alone would hide a working
  // undo. Read off the already-derived activeCampaign (no extra subscription);
  // null on every other shape, including an old-shape cursor.
  const parkedUndo = parkedIntervalUndoSnapshot(activeCampaign);
  const hasStackUndo = useStore(state => (
    activeCampaignId != null
    && (state.pulseUndoStack || []).some(entry => (
      sameEntityId(entry.campaignId, activeCampaignId)
    ))
  ));
  const canUndoPulse = hasStackUndo || Boolean(parkedUndo);
  const stackAdvanceInterval = useStore(state => (
    latestAdvanceInterval(state.pulseUndoStack || [], activeCampaignId)
  ));
  // The stack wins when it has an entry (undoLastPulse pops it first); the parked
  // snapshot names the interval the reloaded advance began with.
  const lastAdvanceInterval = stackAdvanceInterval
    || (parkedUndo ? parkedUndo.interval || null : null);

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

    // R-5b note (deliberate, documented — not a bug to re-find): "only for the
    // current session" is now a slight UNDER-promise for a multi-tick advance that
    // PAUSES, whose return point survives a reload on the campaign record. It is
    // left as written: this string is read BEFORE the advance runs, when nobody
    // knows whether it will pause, and an under-promise about recovery is the safe
    // direction. Revisit only with the owner if the pause case becomes the norm.
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
