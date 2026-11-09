/**
 * surveyorGate.js — THE ONE Surveyor entitlement predicate (owner ruling
 * 2026-07-19, FINAL). A pure, import-free leaf so it can be inlined into each
 * lazy consumer chunk (the door + the account surfaces) without forming a shared
 * chunk that would rebalance the first-paint closure. Every Surveyor AI render
 * decision — the door and the Account AI-keys surface — routes through here.
 *
 * THE SURVEYOR IS PREMIUM ONLY (the owner, 2026-11-09: "Premium only"; lane
 * TIER-PARITY-FIX). True iff the user holds an ACTIVE PREMIUM TIER — Cartographer
 * and above, a Founder as lifetime premium (isFounder folds into the premium check)
 * — OR is an elevated role (dev/admin), OR the server's own answer says yes
 * (has_surveyor_entitlement(), migration 209: premium ∨ staff ∨ a staff grant). The
 * server reads the same three, so the door and the nine AI functions agree by
 * construction (the census's R1 drift resolved). The two consumer chunks each
 * supply tier, is_founder, role and the fetched bit; this predicate combines them
 * identically for both.
 * @param {{ tier?: string|null, hasSurveyorEntitlement?: boolean, isFounder?: boolean, role?: string } | null | undefined} auth
 */
export function isSurveyorTier(auth) {
  if (!auth) return false;
  return auth.tier === 'premium'
    || auth.isFounder === true
    || auth.role === 'admin'
    || auth.role === 'developer'
    || auth.hasSurveyorEntitlement === true;
}
