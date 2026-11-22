-- ────────────────────────────────────────────────────────────────────────────
-- 170_founders_roll.sql — the promised "name in the credits" for Founder
-- Lifetime buyers (owner-ordered 2026-07-21). FounderTile has advertised "plus
-- your name in the credits (seat N)" since the founder tier shipped, but nothing
-- ever rendered a founder's name. This migration builds the OPT-IN, privacy-first
-- surface behind it:
--   • profiles.founder_credit_listed — a per-founder consent flag, DEFAULT FALSE.
--     A purchase must never auto-publish a name; listing is a deliberate opt-in.
--   • set_founder_credit_listed(boolean) — the ONLY user-facing writer of that
--     flag, gated on the caller actually being a founder (mirrors update_display_
--     name's own-row SECURITY DEFINER shape, 009).
--   • founders_roll() — the anon-readable public roll: consenting founders' PUBLIC
--     names ONLY, ordered by when they became a founder. No ids, no emails.
--
-- NAME BINDING (JUDGMENT, vetoable — recorded 2026-07-21): the roll shows
-- profiles.external_name, the repo's canonical PUBLIC gallery author name (075),
-- the same field every gallery surface already resolves as the author label. The
-- original brief said display_name (from mig 002/009, which predates 075's
-- public-identity split); external_name is the correct public binding because it
-- is (a) the deliberately-public, uniquely-validated pseudonym the person chose
-- for public display, (b) always present (backfilled + NOT NULL-in-practice via
-- gen_external_name), and (c) already how every public credit-adjacent surface
-- names an author. To bind display_name instead, change the one SELECT below.
--
-- SEAT ORDINAL (verdict, recorded): NOT reliably recoverable. There is no per-
-- founder seat-number column; founder_seats_taken() (010) only counts. The
-- closest signal is credit_grant_idempotency's founder_grant row created_at (per
-- user since 116), used here ONLY for ordering — but it does not cover admin-set
-- is_founder or transferred/bought-back seats (160-165), so a precise "Seat N"
-- would misnumber. The roll is therefore NAME-ONLY, ordered earliest-founder
-- first, name as the deterministic tiebreak.
--
-- WRITTEN-NOT-DEPLOYED (standing law): supabase/applied-head.json stays behind
-- this file; it applies on the owner's next `supabase db push`. INERT until then.
--
-- @rollback: forward-fix only. To reverse: drop functions founders_roll and
--   set_founder_credit_listed, then drop column profiles.founder_credit_listed.
--   Purely additive + reversible; the column defaults false so no data migration
--   is needed. Reads public.profiles + credit_grant_idempotency (ordering only,
--   no PII returned) — hence this explicit note per the money/PII discipline.
-- ────────────────────────────────────────────────────────────────────────────

-- 1. The per-founder consent flag. DEFAULT FALSE: opt-in, never auto-on. Written
--    ONLY by the SECURITY DEFINER RPC below (no user UPDATE policy grants it), so
--    a user can only ever flip their OWN flag through the founder-gated path.
alter table public.profiles
  add column if not exists founder_credit_listed boolean not null default false;

comment on column public.profiles.founder_credit_listed is
  'Opt-in consent (DEFAULT FALSE) to list this founder''s public name (external_name) in the public founders_roll(). Written only by set_founder_credit_listed (founder-gated). A purchase never auto-sets it.';

-- 2. set_founder_credit_listed — the caller toggles THEIR OWN listing consent.
--    Founder-gated inside (a non-founder can never list), account-active-gated
--    (mirrors the 168 share RPCs), own-row only (auth.uid()). Returns the new
--    value so the client reflects it without a re-read.
create or replace function public.set_founder_credit_listed(p_listed boolean)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  is_a_founder boolean;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  if not public.account_is_active(auth.uid()) then
    raise exception 'account is not active';
  end if;

  select is_founder into is_a_founder from public.profiles where id = auth.uid();
  if not coalesce(is_a_founder, false) then
    raise exception 'only founders can list their name in the credits';
  end if;

  update public.profiles
    set founder_credit_listed = coalesce(p_listed, false),
        updated_at = now()
    where id = auth.uid();

  return coalesce(p_listed, false);
end;
$$;

revoke execute on function public.set_founder_credit_listed(boolean) from public;
grant execute on function public.set_founder_credit_listed(boolean) to authenticated;

comment on function public.set_founder_credit_listed(boolean) is
  'Founder-gated own-row toggle for public credits listing. SECURITY DEFINER; the only writer of profiles.founder_credit_listed. Non-founders and inactive accounts are rejected.';

-- 3. founders_roll — the PUBLIC roll. Returns ONLY the public name of consenting,
--    active founders with a non-empty external_name. NO ids, NO emails, NO join
--    leakage (credit_grant_idempotency is touched ONLY inside the ORDER BY
--    subquery for the grant-time sort — nothing from it is returned). anon +
--    authenticated: the credits are public. Empty until a founder opts in.
create or replace function public.founders_roll()
returns table (name text)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select p.external_name as name
  from public.profiles p
  where p.founder_credit_listed = true
    and p.is_founder = true
    and coalesce(btrim(p.external_name), '') <> ''
    and public.account_is_active(p.id)
  order by (
    select min(cgi.created_at)
    from public.credit_grant_idempotency cgi
    where cgi.source = 'founder_grant' and cgi.user_id = p.id
  ) asc nulls last, p.external_name asc;
$$;

revoke execute on function public.founders_roll() from public;
grant execute on function public.founders_roll() to anon, authenticated;

comment on function public.founders_roll() is
  'Public founders credits roll: the external_name of consenting, active founders only, earliest-founder first. No ids/emails; credit_grant_idempotency is read for ordering only. anon-executable.';
