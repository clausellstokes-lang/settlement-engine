/**
 * surveyorGate.js — THE ONE Surveyor entitlement predicate (owner ruling
 * 2026-07-19, FINAL). A pure, import-free leaf so it can be inlined into each
 * lazy consumer chunk (the door + the account surfaces) without forming a shared
 * chunk that would rebalance the first-paint closure. Every Surveyor AI render
 * decision — the door and the Account AI-keys surface — routes through here.
 *
 * True iff the user holds a live Surveyor entitlement OR is a Founder OR is an
 * elevated role (dev/admin). Cartographer 'premium' is deliberately NOT
 * sufficient — the client tier field conflates it with Surveyor, so the
 * entitlement bit (fetched separately, off the eager auth closure), not the tier,
 * decides. The two consumer chunks each supply the fetched bit + is_founder/role;
 * this predicate combines them identically for both.
 * @param {{ hasSurveyorEntitlement?: boolean, isFounder?: boolean, role?: string } | null | undefined} auth
 */
export function isSurveyorTier(auth) {
  if (!auth) return false;
  return auth.hasSurveyorEntitlement === true
    || auth.isFounder === true
    || auth.role === 'admin'
    || auth.role === 'developer';
}
