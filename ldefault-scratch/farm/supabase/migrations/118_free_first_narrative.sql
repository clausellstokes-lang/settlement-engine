-- 118_free_first_narrative.sql
--
-- Server-authoritative "first Narrative free" — repair the poisoned activation beat.
--
-- WHY
--   The flagship anon→free→paid funnel opens on a promise: a new free account is
--   shown a "Try the Narrative Layer once — this one: free" card on its first saved
--   dossier. Clicking "Narrate this town" runs generate-narrative → spend_credits
--   ('narrative'), which costs 3 credits. But handle_new_user / grant_welcome_credit
--   (015→017) grants only ONE credit on signup. So the very first narrate ALWAYS
--   throws insufficient_funds at the paywall and permanently burns the card. The most
--   important beat in the whole funnel is dead on arrival.
--
--   Granting 3 credits instead was REJECTED: fungible credits can be hoarded or spent
--   elsewhere (dailyLife/progression), so "first Narrative free" would silently become
--   "3 credits toward anything", and a second narrate would then also read free. The
--   offer must be exactly ONE free base-narrative run, tracked server-side so it is
--   UNFARMABLE and INDEPENDENT of the credit balance.
--
-- WHAT
--   1. A nullable claim timestamp on profiles: free_narrative_claimed_at. NULL = the
--      free narrative is still available; a timestamp = it has been claimed (and is
--      never reset except by release_free_narrative on a failed generation).
--   2. claim_free_narrative(p_user) — SECURITY DEFINER, service-role only. ONE atomic
--      race-safe claim: UPDATE ... WHERE id = p_user AND free_narrative_claimed_at IS
--      NULL, returning true iff THIS call won the row. Called from generate-narrative's
--      admin (service-role) client, IN PLACE of the sufficiency-precheck + spend for a
--      first narrative. Two concurrent first-narrates can't both claim: the UPDATE's
--      row lock serializes them, and only the one that flips NULL→now() returns true.
--   3. release_free_narrative(p_user) — SECURITY DEFINER, service-role only, idempotent.
--      The rollback: if a CLAIMED free narrative fails to generate (and the paid path
--      would have refunded), reset free_narrative_claimed_at back to NULL so the user
--      keeps their free taste. Idempotent (guarded on IS NOT NULL) so a double-release
--      is a no-op.
--   4. free_narrative_available(target_user) — SECURITY DEFINER, OWNER-READ. The client
--      card asks "is my free narrative still available?". Mirrors the 110 IDOR self-only
--      pattern EXACTLY: a genuine end-user (non-NULL auth.uid()) may read only their OWN
--      row (raise 42501 otherwise, unless elevated staff); service_role / pg_cron /
--      migrations reach the body with auth.uid() = NULL and may read any target. Returns
--      (free_narrative_claimed_at IS NULL) for the target.
--
--   handle_new_user / grant_welcome_credit's 1-credit grant is LEFT UNTOUCHED — a
--   harmless leftover. Recreating that trigger is high-blast-radius and out of scope;
--   the free narrative is authoritative regardless of the residual credit.
--
-- GRANTS. claim/release are service-role only (the edge calls them with the admin
--   client, exactly like refund_credits / system_grant_credits). free_narrative_
--   available is client-readable for self (authenticated) plus service_role, matching
--   110's grant set. search_path is pinned `public, pg_temp` on all three (the 094/111
--   hardening posture; pg_temp LAST so temp objects can't shadow public ones).
--
-- @rollback: drop the three functions and the column:
--     drop function if exists public.free_narrative_available(uuid);
--     drop function if exists public.release_free_narrative(uuid);
--     drop function if exists public.claim_free_narrative(uuid);
--     alter table public.profiles drop column if exists free_narrative_claimed_at;
--   NOTE this re-poisons the first-narrate activation (every first narrate fails at the
--   paywall again) — roll back only to unblock a broken deploy, then re-apply.

-- 1. Claim column. Nullable: NULL = free narrative still available.
alter table public.profiles
  add column if not exists free_narrative_claimed_at timestamptz;

comment on column public.profiles.free_narrative_claimed_at is
  'When this account claimed its one free Narrative (118). NULL = still available. Set atomically by claim_free_narrative, reset only by release_free_narrative on a failed generation. Independent of the credit balance so the free taste is unfarmable.';

-- 2. Atomic, race-safe claim. Returns true iff THIS call claimed the free narrative
--    (NULL → now()); false if it was already claimed. Service-role only — called from
--    generate-narrative's admin client in place of the sufficiency-precheck + spend.
create or replace function public.claim_free_narrative(p_user uuid)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  claimed boolean;
begin
  update public.profiles
    set free_narrative_claimed_at = now()
    where id = p_user
      and free_narrative_claimed_at is null;
  -- FOUND is true iff the UPDATE flipped a row (i.e. THIS call won the claim). A row
  -- that was already claimed matches the id but fails the NULL guard, so FOUND is
  -- false and the caller falls through to the normal precheck + spend path.
  claimed := found;
  return claimed;
end;
$$;

revoke all on function public.claim_free_narrative(uuid) from public;
grant execute on function public.claim_free_narrative(uuid) to service_role;

comment on function public.claim_free_narrative(uuid) is
  'Atomically claim the account''s one free Narrative (118): sets free_narrative_claimed_at NULL→now() and returns true iff THIS call won the claim (false if already used). Service-role only; generate-narrative calls it in place of the credit spend for a first narrative.';

-- 3. Idempotent rollback. Resets the claim to NULL when a claimed free narrative fails
--    to generate (the paid path would have refunded). Service-role only.
create or replace function public.release_free_narrative(p_user uuid)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  -- Guarded on IS NOT NULL so a double-release (or a release for an account that never
  -- claimed) is a harmless no-op — the edge caller latches this too, but the DB is the
  -- last line: it must never resurrect a free claim that was never held.
  update public.profiles
    set free_narrative_claimed_at = null
    where id = p_user
      and free_narrative_claimed_at is not null;
end;
$$;

revoke all on function public.release_free_narrative(uuid) from public;
grant execute on function public.release_free_narrative(uuid) to service_role;

comment on function public.release_free_narrative(uuid) is
  'Idempotently release a claimed free Narrative (118): resets free_narrative_claimed_at back to NULL so the user keeps the free taste when a claimed generation fails. Service-role only; generate-narrative calls it wherever the paid path would refund.';

-- 4. Owner-read availability. Self-only IDOR guard, mirroring 110 EXACTLY: a genuine
--    end-user may read only their own row; service_role / pg_cron / migrations reach
--    here with auth.uid() = NULL and may read any target; elevated staff may read any.
create or replace function public.free_narrative_available(target_user uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  available boolean;
begin
  if target_user is null then
    return false;
  end if;
  -- IDOR guard (mirrors 110's get_credit_balance): a non-NULL auth.uid() may read only
  -- its OWN row unless elevated. service_role / pg_cron / migrations reach here with a
  -- NULL auth.uid() and are trusted to read any target.
  if auth.uid() is not null
     and target_user is distinct from auth.uid()
     and not public.current_user_is_privileged()
  then
    raise exception 'free_narrative_available: not authorized to read another user''s claim'
      using errcode = '42501';  -- insufficient_privilege
  end if;

  select free_narrative_claimed_at is null
    into available
    from public.profiles
    where id = target_user;

  -- No such profile ⇒ nothing to offer.
  return coalesce(available, false);
end;
$$;

-- Lock the API surface to self-read (authenticated) + service_role, dropping the
-- PUBLIC/anon default the CREATE granted — matches 110's grant set.
revoke all on function public.free_narrative_available(uuid) from public, anon;
grant execute on function public.free_narrative_available(uuid) to authenticated, service_role;

comment on function public.free_narrative_available(uuid) is
  'True when target_user''s one free Narrative is still available (free_narrative_claimed_at IS NULL). IDOR-guarded (118, mirrors 110): an authenticated caller may read only their own claim; service_role/pg_cron/migrations (NULL auth.uid()) and elevated staff may read any target. Used by WelcomeCreditCard to decide whether to surface the free-narrative offer.';
