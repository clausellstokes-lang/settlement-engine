/**
 * staffEntitlements.js — THE ONE SPELLING OF "IS THIS ACCOUNT STAFF, AND DOES
 * STAFF UNLOCK THE PAID SURFACE".
 *
 * ⛔ THE OWNER'S ORDER (ODQ §934.28, verbatim): "enable all paid for features
 * (for right now) to all developers and admin for testing purposes."
 *
 * "FOR RIGHT NOW" IS THE WHOLE REASON THIS FILE EXISTS. The unlock is temporary
 * by the owner's own words, so it is a CONSTANT WITH A NAME rather than a habit
 * spread across thirty call sites: flipping STAFF_UNLOCK_ALL_PAID to false is
 * the entire revoke, and the gates go back to reading the account's real tier.
 * Before this module the ENTITLEMENT question — `role === 'developer' || role
 * === 'admin'`, as the staff half of a paid gate — was hand-copied into NINE
 * sites across eight campaign/gallery-import modules, beside authSlice's own
 * private ELEVATED_ROLES list. That is the drift class the premium-gate census
 * (tests/lint/premiumGateSingleSource.test.js) exists against, and there was no
 * single line anyone could flip to take the unlock back. Those nine now import
 * from here.
 *
 * (Measured at the consist tip, `src/` spelled the two-role membership in 15
 * places. The other six ask DIFFERENT questions and are deliberately left: the
 * two by-construction Surveyor copies below, lib/auth.js `normalizeRole` which
 * PRODUCES the value, authSlice's `isDeveloper` which names one role not two,
 * and lib/foundersHall.js `CHAIR_RING_ROLES`, a display ring on the Founders'
 * Hall roll rather than an entitlement.)
 *
 * ── TWO QUESTIONS, DELIBERATELY SEPARATE ─────────────────────────────────────
 * They read almost the same and they are not the same, so conflating them under
 * one switch would have made the revoke do damage:
 *
 *   isStaffRole(role)            — IDENTITY. Is this account staff? NOT governed
 *                                  by the switch. The admin panel, the account
 *                                  menu's Developer row, the elevated route
 *                                  guard and the audited admin RPCs all ask this
 *                                  one. Revoking a testing convenience must
 *                                  never lock the owner out of the admin panel.
 *
 *   staffUnlocksPaidFeatures(r)  — ENTITLEMENT. Does this account get the PAID
 *                                  surface for free? Governed by the switch.
 *                                  Every tier gate asks this one.
 *
 * ── WHAT THE SWITCH REACHES, MEASURED, NOT PROMISED ──────────────────────────
 * With it false, a staff account resolves to its REAL billing tier (authSlice's
 * resolveTier stops overriding to 'premium') and every permission query in
 * authSlice — canSave, canUseNeighbour, canExport, canUseMapChains,
 * canUseCustomContent, maxAllowedTier, maxSaves, isTierAllowed, canAffordAI —
 * answers from TIER_GATE alone, as it does for any member. The campaign and
 * gallery-import gates that spell their own tier read follow, because they call
 * this module for their role half.
 *
 * ⚠ WHAT IT DOES NOT REACH, AND WHY THAT IS RECORDED RATHER THAN FIXED:
 *   - `viewerCanAuthor` (src/lib/viewerAuthority.js) reads the store's
 *     `isElevated()`, which is IDENTITY and stays true. The premium-gate walker
 *     pins that chokepoint's body byte-for-byte (three assertions over its exact
 *     text), so re-pointing it is a walker edit and an owner-gated behaviour
 *     change on a paid authoring surface, not a lane's call. Flipping the switch
 *     therefore narrows the unlock without closing authoring — a narrower
 *     unlock, never a wider one, which is the safe direction.
 *   - `isSurveyorTier` (components/surveyor/surveyorGate.js) and its
 *     byte-identical twin in components/account/useAccountSurveyorGate.js. Both
 *     are import-free BY CONSTRUCTION — they are inlined into two separate lazy
 *     chunks so they never form a shared chunk that rebalances the first-paint
 *     closure, and tests/components/surveyorGateParity.test.js proves the two
 *     copies agree on every input. An import here would break both properties.
 *     They already admit staff, so the order is satisfied there regardless.
 *
 * ── THE ROLE IS SERVER-ISSUED, AND THAT IS ENFORCED, NOT ASSUMED ─────────────
 * `role` reaches this module from the authenticated `profiles` row, normalized
 * by lib/auth.js. A client cannot write it: migration 018's profiles UPDATE
 * policy carries `role is not distinct from (select role from profiles where id
 * = auth.uid())`, so a self-update that changes role is refused by RLS. Nothing
 * here reads a query string, localStorage or any client-writable field, and an
 * ANONYMOUS visitor has role 'user' and fails every predicate below.
 *
 * ⛔ PURCHASES ARE NOT A FEATURE (owner, 2026-09-16). This module unlocks what an
 * account may USE. It says nothing about buying, and lib/launchGate.js — the one
 * switch that keeps checkout closed until launch — neither imports this nor is
 * imported by it.
 *
 * ⛔ THE SERVER IS THE AUTHORITY. This is the CLIENT half. The server half is
 * `public.current_user_is_privileged()` (migration 018), which every staff
 * bypass in SQL already consults, and which migration 201 taught
 * `has_surveyor_entitlement()` to honour so the AI layer's NINE edge functions
 * stop refusing the staff the client admits.
 *
 * ZERO IMPORTS, on purpose — the same posture as lib/viewerAuthority.js. The
 * store reads it eagerly and lazy chunks read it too; it must cost the
 * first-paint closure only its own bytes.
 *
 * @enforced-by tests/store/staffUnlockEntitlements.test.js
 * @enforced-by tests/security/staffUnlockSurveyorEntitlement.pglite.test.js
 */

/**
 * ⛔ THE KILL SWITCH (ODQ §934.28 — "for right now").
 *
 * true  — a developer/admin account receives every paid feature, for testing.
 * false — staff accounts fall back to their real billing tier everywhere.
 *
 * Set this to false and the unlock is gone. Nothing else needs editing.
 */
export const STAFF_UNLOCK_ALL_PAID = true;

/**
 * The profile roles that are staff. Mirrors the CHECK constraint on
 * public.profiles.role (migration 002: 'user' | 'developer' | 'admin') and the
 * SQL-side membership test in public.current_user_is_privileged() (018).
 */
export const STAFF_ROLES = Object.freeze(['developer', 'admin']);

/**
 * IDENTITY — is this account staff? NOT governed by the kill switch.
 *
 * Fail-closed: anything that is not one of the two exact role strings reads
 * false, so a null/undefined/object/truthy-non-string can never widen it.
 *
 * @param {unknown} role the `role` from the authenticated profile
 * @returns {boolean}
 */
export function isStaffRole(role) {
  return typeof role === 'string'
    && /** @type {readonly string[]} */ (STAFF_ROLES).includes(role);
}

/**
 * ENTITLEMENT — does this account get the paid surface for free? Governed by
 * the kill switch, which is the one line that takes the unlock back.
 *
 * @param {unknown} role the `role` from the authenticated profile
 * @returns {boolean}
 */
export function staffUnlocksPaidFeatures(role) {
  return STAFF_UNLOCK_ALL_PAID === true && isStaffRole(role);
}

/**
 * THE RESOLVER — an account's effective entitlement facts, in one call.
 *
 * Takes the store's `auth` object (or any `{ role, tier }` shape) and answers
 * the three questions every gate in the tree actually asks. Consumers that need
 * only one of them may call the predicates above directly; this exists so the
 * whole answer can be asserted as a TABLE in one place, and so a surface that
 * needs more than one fact reads them from a single resolution rather than
 * re-deriving each.
 *
 * @param {{ role?: unknown, tier?: unknown }|null|undefined} auth
 * @returns {{ isStaff: boolean, unlocksPaid: boolean, effectiveTier: string }}
 *   `effectiveTier` is what the gates should see: 'premium' for an unlocked
 *   staff account, otherwise the account's own tier ('free' when it has none).
 */
export function resolveStaffEntitlements(auth) {
  const role = auth?.role;
  const isStaff = isStaffRole(role);
  const unlocksPaid = staffUnlocksPaidFeatures(role);
  const own = typeof auth?.tier === 'string' && auth.tier ? auth.tier : 'free';
  return {
    isStaff,
    unlocksPaid,
    effectiveTier: unlocksPaid ? 'premium' : own,
  };
}

export default staffUnlocksPaidFeatures;
