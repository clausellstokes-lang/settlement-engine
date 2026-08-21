/**
 * store/roadsRescueInflame.js — the rescue-op's relationship inflame (DESIGN_THE_ROADS §11).
 *
 * A LAZY helper, dynamic-imported by applyNpcOp ONLY when a rescue-npc op actually lands — so
 * this cold-path code (campaign resolution + the recordPartyImpact call) stays OFF the eager
 * first-paint store closure (§16 budget). A jailbreak worsens the captor↔home edge through the
 * EXISTING inflame_relationship party impact — no new relationship writer; fire-and-forget,
 * campaign-scoped, exactly like every other manual party impact.
 *
 * @param {Function} get  the slice's get()
 * @param {string} rescueCaptorId  the captor the hostage was freed from (whereabouts.placeId)
 */
export function fireRescueInflame(get, rescueCaptorId) {
  const homeId = get().activeSaveId;
  const campaign = homeId != null ? get().getCampaignForSettlement?.(homeId) : null;
  if (campaign?.id != null && String(homeId) !== rescueCaptorId && typeof get().recordPartyImpact === 'function') {
    Promise.resolve(get().recordPartyImpact(campaign.id, {
      kind: 'inflame_relationship', settlementId: String(homeId), relationshipTargetId: rescueCaptorId,
    })).catch(() => {});
  }
}
