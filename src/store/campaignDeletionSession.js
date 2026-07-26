/**
 * campaignDeletionSession.js — cold completion body for a confirmed campaign delete.
 *
 * campaignSlice synchronously captures the owner/generation/campaign and installs
 * the mutation reservation before importing this module. This body performs only
 * the remote commit and generation-fenced local finalization, so lazy loading
 * cannot open a validation-to-lock or owner-capture race.
 */

import {
  campaignSessionChangedError,
  deletePersistedCampaignState,
  isCurrentCampaignSession,
} from './campaignSliceShared.js';

/**
 * Complete a privacy-sensitive campaign delete after campaignSlice has
 * synchronously reserved the id and installed its mutation lock.
 *
 * @param {{
 *   campaign: { id: unknown },
 *   campaignService: {
 *     delete: Function,
 *     recordTombstone?: Function,
 *   },
 *   get: Function,
 *   markRemoteDeleted: Function,
 *   session: { ownerId: string, generation: number },
 *   set: Function,
 * }} args
 */
export async function finishConfirmedCampaignDelete({
  campaign,
  campaignService,
  get,
  markRemoteDeleted,
  session,
  set,
}) {
  await campaignService.delete(
    campaign.id,
    session.ownerId,
    () => isCurrentCampaignSession(get(), session),
  );
  markRemoteDeleted();
  if (!isCurrentCampaignSession(get(), session)) {
    // The delete committed; tombstone it without touching the new session.
    campaignService.recordTombstone?.(campaign.id, session.ownerId);
    throw campaignSessionChangedError(campaign.id);
  }
  set(state => {
    if (!isCurrentCampaignSession(state, session)) return;

    state.campaigns = state.campaigns.filter(
      candidate => String(candidate.id) !== String(campaign.id),
    );
    if (String(state.activeCampaignId) === String(campaign.id)) {
      state.activeCampaignId = null;
    }
    state.pulseUndoStack = (state.pulseUndoStack || [])
      .filter(snapshot => String(snapshot.campaignId) !== String(campaign.id));

    // The service delete already succeeded. Finalize cache/tombstone/signature
    // bookkeeping without issuing a duplicate remote delete.
    deletePersistedCampaignState(state, campaign.id, {
      skipRemote: true,
      sessionGeneration: session.generation,
    });
  });

  return { ok: true, campaignId: campaign.id };
}
