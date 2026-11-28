-- Settlement Generator — Migration 209
-- THE SURVEYOR IS PREMIUM ONLY (lane TIER-PARITY-FIX, 2026-11-09).
--
-- The owner's tier law, 2026-11-09, verbatim: "the only thing that is premium abd up is up is
-- the ability to edit post generation, access to the simulator, custom content, unlimited
-- export, import from gallery, access to the world map, and access to the surveyor.
-- Everything else is at parity to the free account." Asked whether the Surveyor is premium
-- or its own entitlement, the owner answered: "Premium only."
--
-- ⚠⚠ NOT DEPLOYED BY THE LANE THAT WROTE IT. Migrations are owner-gated at deploy
-- (`supabase db push` plus a bump of supabase/applied-head.json in the same act). This file
-- is UNAPPLIED; until the owner applies it, the live function is 201's.
--
-- ── WHAT IT CHANGES ─────────────────────────────────────────────────────────
-- public.has_surveyor_entitlement() (139, re-created by 201) is the AI layer's ONE gate: the
-- nine AI-control edge functions call it (ai-analyst, construct-realm, construct-settlement,
-- custom-content, interpret-session, interview, parley, surveyor-autonomy, surveyor-byok),
-- and so do the BYOK RPCs (159, 191). It admitted staff OR an active surveyor_entitlements
-- row; a bare Cartographer did NOT hold the Surveyor on either side, and a Founder was
-- admitted by the client and refused here (the census's R1 drift). It now admits:
--   1. privileged staff (developer/admin; 201's disjunct, checked first, unchanged);
--   2. an ACTIVE PREMIUM TIER — Cartographer and above, Founders as lifetime premium — by
--      the estate's own premium resolver's reading of the caller's profile
--      (024 current_user_has_premium_access: tier = 'premium' or is_founder);
--   3. a surveyor_entitlements row granted BY STAFF ONLY: status 'active' AND source
--      'grant' — the admin concierge path (admin-actions `grant_surveyor`, highest role,
--      audited, two-key). A row whose source is 'subscription' (the dark Surveyor Stripe
--      plan, stripe-webhook) no longer admits by itself: access is premium's.
-- The client predicate (src/components/surveyor/surveyorGate.js isSurveyorTier and its
-- byte twin in useAccountSurveyorGate.js) reads the same three, so client and server agree
-- by construction (R1 resolved).
--
-- ── WHO HOLDS A ROW TODAY (measured from the tree; the live table is the owner's) ────
-- No migration and no seed inserts a surveyor_entitlements row. Rows are minted only by
-- grant_surveyor_entitlement (159; re-stated in 178), which is service-role only and called
-- from exactly two places: the stripe-webhook (source 'subscription', the Surveyor product —
-- purchases are closed until launch, src/lib/launchGate.js) and admin-actions
-- `grant_surveyor` (source 'grant'). So from the tree no account provably holds a row; any
-- live 'subscription' row would be a pre-launch test purchase, and any 'grant' row is a
-- staff grant, which this function keeps honouring.
--
-- ── WHAT THIS DOES NOT DO ───────────────────────────────────────────────────
--   • It mints and deletes no rows; surveyor_entitlements is untouched, so revoking is a
--     one-line revert, never a data cleanup.
--   • It does not touch the per-task METERING (credits; the AI is credit-priced for every
--     tier), the kill switch surveyor_stage_enabled(), or the dark SURVEYOR_PLAN.
--   • It does not open purchases.
--
-- Depends on: 018 (current_user_is_privileged), 024 (current_user_has_premium_access),
--   139 / 159 (surveyor_entitlements, its `source` column), 201. Re-runnable.
-- @rollback: re-run 201's body verbatim (staff OR any active row).
-- ────────────────────────────────────────────────────────────────────────────

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
  -- 1. Staff (developer/admin), checked first (201, unchanged).
  if public.current_user_is_privileged() then return true; end if;
  -- 2. An active premium tier: Cartographer and above, Founders as lifetime premium.
  if public.current_user_has_premium_access() then return true; end if;
  -- 3. A staff grant (the admin concierge path), honoured; a purchased row is not access.
  return exists (
    select 1 from public.surveyor_entitlements
    where user_id = v_caller and status = 'active' and source = 'grant'
  );
end;
$$;

revoke all on function public.has_surveyor_entitlement() from public;
grant execute on function public.has_surveyor_entitlement() to authenticated;

comment on function public.has_surveyor_entitlement is
  'True iff the CALLER may reach the Surveyor (the AI control surface): privileged staff, OR an active premium tier (Cartographer and above, Founders as lifetime premium; 024 current_user_has_premium_access), OR an active surveyor_entitlements row granted by staff (source ''grant''). The owner, 2026-11-09: the Surveyor is premium only (migration 209). The sim never calls it.';
