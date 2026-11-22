/**
 * campaignMapSharePersist.js — the persistence barrier before map publication.
 *
 * The caller first commits its in-memory map through saveCampaignMap. This lazy
 * helper then reads that updated campaign and awaits cloud persistence. Its
 * session validator spans both the service import and the service's auth lookup,
 * so an old same-owner login cannot publish stale state after auth rotates.
 */

/**
 * Persist the current campaign map before gallery publication.
 *
 * @param {{
 *   campaignId: unknown,
 *   readState: Function,
 *   saveCampaignMap: Function,
 * }} args
 */
export async function persistCampaignMapForShare({
  campaignId,
  readState,
  saveCampaignMap,
}) {
  saveCampaignMap(campaignId, readState().mapState);
  const stateAfterMapSave = readState();
  const campaign = (stateAfterMapSave.campaigns || []).find(
    item => item?.id != null && String(item.id) === String(campaignId),
  );
  if (!campaign) {
    return;
  }

  const ownerId = String(stateAfterMapSave.auth?.user?.id || 'anon');
  const generation = Number(stateAfterMapSave.campaignSessionGeneration) || 0;
  const isSessionCurrent = () => {
    const currentState = readState();
    return (
      String(currentState.auth?.user?.id || 'anon') === ownerId
      && (Number(currentState.campaignSessionGeneration) || 0) === generation
    );
  };

  const { campaigns: campaignService } = await import('../lib/campaigns.js');
  await campaignService.upsert(campaign, ownerId, isSessionCurrent);
}
