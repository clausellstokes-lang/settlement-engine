-- Settlement Generator — Migration 201
-- ODQ §934.28 (the owner, verbatim): "enable all paid for features (for right
-- now) to all developers and admin for testing purposes."
--
-- ⚠⚠ NOT DEPLOYED BY THE LANE THAT WROTE IT. Migrations are owner-gated at deploy
-- (`supabase db push` plus a bump of supabase/applied-head.json in the same act).
-- Until the owner applies it, staff remain refused on the AI layer exactly as
-- they are today — this migration is the ONLY thing standing between the order
-- and the server, so it is the one hand-run item in the §934.28 consist.
--
-- ── THE DEFECT THIS CURES: THE CLIENT SHOWS WHAT THE SERVER REFUSES ──────────
-- The §934.28 recon measured the staff bypass end to end. On the SERVER it was
-- already near-total: 36 SQL sites spell `role in ('developer','admin')` and 54
-- more call public.current_user_is_privileged() (018) — spend_credits (192) short-circuits
-- the whole credit ledger for staff, enforce_save_limit (014) returns NEW before
-- it counts, and the admin RPCs gate on it. ONE paid gate did not:
--
--   public.has_surveyor_entitlement()  (139)
--     returns exists(select 1 from surveyor_entitlements
--                    where user_id = auth.uid() and status = 'active')
--
-- …and that function IS the AI layer's gate. NINE edge functions call it as their
-- entitlement check — ai-analyst, construct-realm, construct-settlement,
-- custom-content, interpret-session, interview, parley, surveyor-autonomy and
-- surveyor-byok — as does surveyor_byok_set (159), the provider-key door on the
-- SQL side. (Counted by path, not by hand: the first pass said eight because it
-- had credited surveyor-byok to its SQL half alone.)
--
-- Meanwhile the CLIENT's Surveyor predicate (src/components/surveyor/
-- surveyorGate.js `isSurveyorTier`, and its byte-identical twin in
-- src/components/account/useAccountSurveyorGate.js) has always admitted
-- `role === 'admin' || role === 'developer'`. So a developer account SEES the
-- Surveyor door, opens it, and the server answers 403 with a sales line:
--   "Custom content authoring is part of the Surveyor plan."
-- The client showing what the server refuses is the inversion of the fail-closed
-- law, and for staff it made the whole AI layer untestable through the product.
--
-- ── WHY ONE SQL FUNCTION AND NOT NINE EDGE CHECKS ───────────────────────────
-- The obvious alternative was a role check in a shared edge module the nine
-- functions import. That is NINE new call sites for one question — the
-- hand-copy class the premium-gate census (tests/lint/premiumGateSingleSource.
-- test.js) exists against, and the class this very order kept tripping over on
-- the client. The RPC is already the single point all nine route through, it is
-- SECURITY DEFINER so it can read profiles a caller cannot, and it is the SAME
-- function the client's two lazy gates fetch — so curing it here makes client
-- and server agree by construction instead of by vigilance. The edge functions
-- are not touched by this migration at all.
--
-- ── THE ROLE IS NOT CLIENT-WRITABLE, AND THAT IS ENFORCED ───────────────────
-- current_user_is_privileged() reads public.profiles.role for auth.uid(). 018's
-- profiles UPDATE policy carries `role is not distinct from (select role from
-- profiles where id = auth.uid())`, so a user cannot grant themselves the role
-- this migration honours; 061 locks the moderation columns alongside. An
-- anonymous caller has no auth.uid() and is refused at the first line, unchanged.
--
-- ── WHAT THIS DOES NOT DO ───────────────────────────────────────────────────
--   • It does not mint entitlement ROWS. surveyor_entitlements is untouched, so
--     nothing here can be mistaken for a purchase, a grant or a seat, and
--     revoking is a one-line revert rather than a data cleanup.
--   • It does not open the KILL SWITCH. surveyor_stage_enabled() is an
--     operational switch, not a paid gate: when the owner disables a stage it
--     stays disabled for staff too, which is the whole point of having one.
--   • It does not touch has_dossier_entitlement(108) — a purchased DURABLE right
--     per dossier, not a feature gate. Staff already export freely through
--     canExport(); granting them a purchase right they never bought would put a
--     fiction in the entitlement ledger.
--   • It does not open purchases. Checkout stays closed until launch by the
--     owner's 2026-09-16 order (src/lib/launchGate.js, VITE_PURCHASES_OPEN).
--
-- ⛔ REVOKING IS THIS FILE'S @rollback LINE, and the client's companion switch is
-- STAFF_UNLOCK_ALL_PAID in src/lib/staffEntitlements.js. Both are one line.
--
-- Depends on: 018 (current_user_is_privileged), 139 (has_surveyor_entitlement,
--   surveyor_entitlements). Re-runnable.
-- @rollback: recreate 139's body verbatim — i.e. this same function with the
--   `or public.current_user_is_privileged()` disjunct removed.
-- ────────────────────────────────────────────────────────────────────────────

-- 139's body, VERBATIM, plus one disjunct. The caller check, the null-caller
-- refusal, the stable/definer markers and the pg_temp-LAST search_path pin (116
-- discipline) are unchanged.
create or replace function public.has_surveyor_entitlement()
returns boolean
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare v_caller uuid;
begin
  v_caller := auth.uid();
  if v_caller is null then return false; end if;
  -- ODQ §934.28 — staff (developer/admin) hold every paid feature while the
  -- owner's testing unlock stands. Checked FIRST so a staff account never
  -- depends on an entitlement row existing.
  if public.current_user_is_privileged() then return true; end if;
  return exists (
    select 1 from public.surveyor_entitlements
    where user_id = v_caller and status = 'active'
  );
end;
$$;

revoke all on function public.has_surveyor_entitlement() from public;
grant execute on function public.has_surveyor_entitlement() to authenticated;

comment on function public.has_surveyor_entitlement is
  'True iff the CALLER holds an active Surveyor entitlement, OR is staff (developer/admin) under the ODQ §934.28 testing unlock. The interface gate for the AI control surface; the sim never calls it. Revoke the unlock by dropping the current_user_is_privileged() disjunct (migration 201 @rollback).';
