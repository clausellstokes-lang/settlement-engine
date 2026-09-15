-- ════════════════════════════════════════════════════════════════════════════
-- 202 — THE SCRIBE: the free first render, and the one render SKU
-- ════════════════════════════════════════════════════════════════════════════
-- THE SCRIBE (docs/DESIGN_SCRIBE_GENERATION_TIME_PROSE.md §6, §12 items 1 and 2; chair rulings
-- 1, 2 and 19). Two things the `scribe-render` edge function needs before it can charge for a
-- render, and NOTHING ELSE: the once-per-account free claim, and a cost arm for the SKU.
--
-- ⚠️ INERT UNTIL TWO SEPARATE ACTS. Applying this migration changes no existing behaviour: the
-- claim functions have no caller until the Scribe's flag is lit, and the `dossierProse` arm is
-- reachable only from a feature name nothing spends today. `FLAGS.scribe` defaults to FALSE and
-- lighting it is the owner's act; so is `supabase db push`.
--
-- ── 1. THE FREE FIRST RENDER (ruling 2) ────────────────────────────────────────────────────
-- Modelled on migration 118's `claim_free_narrative` EXACTLY, because that shape is already
-- proven atomic, race-safe and unfarmable: the claim is a conditional UPDATE whose `found` is
-- the answer, so two concurrent renders cannot both take it, and the RELEASE is what makes a
-- failed render cost the user nothing. One per ACCOUNT, not per world: the same product logic as
-- the free first narrative.
--
-- ── 2. THE ONE RENDER SKU (ruling 1 as amended by ruling 19) ───────────────────────────────
-- `spend_credits` RAISES on an unknown feature, by design, so a new SKU is a new arm or it is a
-- failed spend. This recreates the function from migration 192 VERBATIM with ONE line added —
-- `when 'dossierProse' then 5` — at the retired narrative's own price. Everything else, including
-- the config-first resolution of 114, the tier multiplier of 192 and the whole allocation loop,
-- is byte-identical to 192; the CASE block is reached only when the config table holds no cost
-- for the feature, which it does not.
--
-- ⭐ ONE RENDER, ONE SPEND, HOWEVER MANY TABS IT DRAWS (the render session of migration 203 makes
-- it so). The daily-life beats are the seventh tab call of the same epoch render (§5c rule 4), so
-- there is no second SKU. There was, however, a per-tab CHARGE until 203: a render is one edge
-- invocation per firing tab and each one ran its own `spend_credits`, so the five credits named
-- here were five credits a TAB and thirty-five to fifty a render, and the free claim below was
-- taken by the first tab rather than by the render.
--
-- ⚠ THIS PARAGRAPH IS A CORRECTION IN PLACE, AND THE CHAIR RULED IT LAWFUL BECAUSE THIS FILE HAS
-- NEVER BEEN APPLIED ANYWHERE. The estate's rule is that a SHIPPED migration is never edited (a
-- correction arrives as a new migration that re-seeds, never as a contradiction of a seed already
-- executed somewhere). 202 is written-not-applied, like 201 and 203: no `supabase db push` has
-- ever been taken for it, so there is no executed statement for this edit to contradict, and the
-- alternative — shipping a header that is FALSE about the price of a render and a second file
-- saying so — is worse for every reader who arrives at this one first. Recorded, vetoable.
--
-- Guarded by: tests/config/pricing.test.js (the client mirror), tests/edgeFunctions/contracts.test.js
-- (the client/server drift pin), and the pglite money suites which execute this function.
--
-- @rollback: recreate `spend_credits` from the 192 body without the `dossierProse` arm and drop
--   the three claim functions. Safe at any time while the Scribe's flag is dark.

-- ── 1. THE FREE FIRST RENDER ────────────────────────────────────────────────────────────────

alter table public.profiles
  add column if not exists free_scribe_claimed_at timestamptz;

create or replace function public.claim_free_scribe(p_user uuid)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $fn$
declare
  claimed boolean;
begin
  -- The conditional UPDATE is the whole race guard: exactly one caller can find the row with a
  -- null marker, and `found` reports whether this caller was that one.
  update public.profiles
    set free_scribe_claimed_at = now()
    where id = p_user
      and free_scribe_claimed_at is null;
  claimed := found;
  return claimed;
end;
$fn$;

revoke all on function public.claim_free_scribe(uuid) from public;
grant execute on function public.claim_free_scribe(uuid) to service_role;

comment on function public.claim_free_scribe(uuid) is
  'Atomically claim the account''s one free Scribe render (202). Returns true only for the caller that took it; released by release_free_scribe when the render does not land.';

create or replace function public.release_free_scribe(p_user uuid)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $fn$
begin
  update public.profiles
    set free_scribe_claimed_at = null
    where id = p_user
      and free_scribe_claimed_at is not null;
end;
$fn$;

revoke all on function public.release_free_scribe(uuid) from public;
grant execute on function public.release_free_scribe(uuid) to service_role;

comment on function public.release_free_scribe(uuid) is
  'Return the account''s free Scribe render (202) when the render did not land. Idempotent.';

create or replace function public.free_scribe_available(target_user uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $fn$
declare
  claimed_at timestamptz;
begin
  -- IDOR guard, migration 118's verbatim: a caller may ask about itself, and a privileged
  -- operator may ask about anyone. Anything else raises rather than answering.
  if target_user is distinct from auth.uid() and not public.current_user_is_privileged() then
    raise exception 'not authorized' using errcode = '42501';
  end if;
  select p.free_scribe_claimed_at into claimed_at from public.profiles p where p.id = target_user;
  return claimed_at is null;
end;
$fn$;

revoke all on function public.free_scribe_available(uuid) from public, anon;
grant execute on function public.free_scribe_available(uuid) to authenticated, service_role;

comment on function public.free_scribe_available(uuid) is
  'Is this account''s free Scribe render still unclaimed (202). Self or privileged only.';

-- ── 2. THE ONE RENDER SKU — 192's body VERBATIM plus one CASE arm ───────────────────────────

create or replace function public.spend_credits(
  feature   text,
  p_profile text default null,
  p_tier    text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  cost integer;
  remaining integer;
  current_balance integer;
  user_role text;
  new_spend_id uuid;
  needed integer;
  grant_row record;
  allocation integer;
  base_feature text;
  cfg_cost integer;
  v_tier text;
  v_mult numeric;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  -- SINGLE-SESSION BELT (161, §7.2): a superseded JWT can never move credits.
  perform public.assert_current_session();
  -- Trust-boundary gate (057): a banned/disabled/soft-deleted account may not
  -- spend, even with a still-valid JWT.
  if not public.account_is_active(auth.uid()) then
    raise exception 'account is not active';
  end if;

  -- CONFIG-FIRST cost resolution (114): strip a trailing '_fast' to the base feature,
  -- then — when a profile is supplied — read the per-profile config cost. Only an
  -- integer 1..12 is honoured; ANY miss/malformation falls through to the 057 CASE.
  base_feature := case when feature like '%\_fast' then left(feature, length(feature) - 5) else feature end;
  cfg_cost := null;
  if p_profile is not null then
    begin
      select nullif(v.value -> 'profiles' -> p_profile ->> base_feature, '')::integer
        into cfg_cost
        from public.system_config v
       where v.key = 'ai_credit_costs';
    exception when others then
      cfg_cost := null;
    end;
    if cfg_cost is not null and (cfg_cost < 1 or cfg_cost > 12) then
      cfg_cost := null;
    end if;
  end if;

  if cfg_cost is not null then
    cost := cfg_cost;
  else
    -- 057 CASE block + the Surveyor S1 (analysis, brief) + S3 (interpret, parley) +
    -- S4–S6 (customContent, styleOverhaul, constructSettlement, constructRealm) +
    -- S7 (autonomy) features. 180: narrative 3->5, progression 5->6 (optimal margins).
    cost := case feature
      when 'chronicle' then 2
      when 'narrative' then 5
      when 'dailyLife' then 4
      -- THE SCRIBE'S ONE RENDER SKU (202; chair ruling 1 as amended by ruling 19): one price
      -- for the whole render of a settlement's dossier prose, dossier and daily life together.
      -- Placed at the retired narrative's own number, 5, and INERT until FLAGS.scribe is lit.
      -- THE RENDER SESSION OF MIGRATION 203 IS WHAT MAKES THIS ONE CHARGE: it is reached by
      -- exactly one of a render's tab invocations, and the rest never call this function.
      when 'dossierProse' then 5
      when 'progression' then 6
      when 'narrative_fast' then 2
      when 'dailyLife_fast' then 3
      when 'progression_fast' then 4
      when 'analysis' then 3
      when 'brief' then 4
      when 'interpret' then 5
      when 'parley' then 3
      when 'customContent' then 6
      when 'styleOverhaul' then 3
      when 'constructSettlement' then 6
      when 'constructRealm' then 8
      when 'autonomy' then 4
      else null
    end;
    if cost is null then raise exception 'unknown feature: %', feature; end if;
  end if;

  -- ── THE TIER MULTIPLIER (192) — machinery live, effect INERT ────────────────
  -- Reached only when a caller supplies a tier. No caller does yet, and even
  -- when one does, the config row this reads is deliberately unseeded, so the
  -- base cost stands. Four independent ways to be inert, all of them normal:
  -- p_tier null · tier outside the vocabulary · no 'ai_tier_multipliers' row ·
  -- multiplier of exactly 1. The base cost resolved above is never recomputed.
  --
  -- FORWARD-COMPATIBLE BY CONTRACT: an unrecognized tier string is treated as
  -- null and does NOT raise. The tier names are the design's WORKING names and
  -- the owner has not made the taste pick (§5), so a renamed or newly-added rung
  -- arriving from an edge that deployed ahead of the database must degrade to
  -- the ordinary price, never fail a paid call. Rejecting it here would turn a
  -- naming decision into an outage.
  v_tier := case when p_tier in ('scout', 'journeyman', 'master') then p_tier else null end;
  if v_tier is not null then
    v_mult := null;
    begin
      select nullif(v.value ->> v_tier, '')::numeric
        into v_mult
        from public.system_config v
       where v.key = 'ai_tier_multipliers';
    exception when others then
      v_mult := null;
    end;
    -- The sane band (header): operator-writable config may not move a charge
    -- more than half down or triple up. Anything outside is treated as absent.
    if v_mult is not null and (v_mult < 0.5 or v_mult > 3) then
      v_mult := null;
    end if;
    -- A multiplier of exactly 1 is the identity and skips the arithmetic, so an
    -- all-ones config is byte-identical to no config at all.
    if v_mult is not null and v_mult <> 1 then
      cost := greatest(1, least(12, round(cost * v_mult)))::integer;
    end if;
  end if;

  select role into user_role from public.profiles where id = auth.uid() for update;
  if user_role in ('developer', 'admin') or public.current_user_is_privileged() then
    insert into public.credit_ledger (user_id, kind, amount, source, metadata)
      values (auth.uid(), 'spend', cost, feature, jsonb_build_object('elevated', true))
      returning id into new_spend_id;
    return jsonb_build_object('ok', true, 'balance', -2, 'spend_id', new_spend_id, 'elevated', true);
  end if;

  current_balance := public.get_credit_balance(auth.uid());
  if current_balance < cost then
    return jsonb_build_object('ok', false, 'reason', 'insufficient_funds', 'balance', coalesce(current_balance, 0));
  end if;

  insert into public.credit_ledger (user_id, kind, amount, source, metadata)
    values (auth.uid(), 'spend', cost, feature, '{}'::jsonb)
    returning id into new_spend_id;
  needed := cost;

  for grant_row in
    select g.id, greatest(g.amount - coalesce(a.amount, 0), 0)::integer as available
    from public.credit_ledger g
    left join (
      select grant_id, sum(amount)::integer as amount
      from public.credit_spend_allocations group by grant_id
    ) a on a.grant_id = g.id
    where g.user_id = auth.uid()
      and g.kind = 'grant'
      and (g.expires_at is null or g.expires_at > now())
      and greatest(g.amount - coalesce(a.amount, 0), 0) > 0
    order by case when g.source = 'monthly_allowance' then 0 else 1 end,
      g.expires_at nulls last, g.created_at
    for update of g
  loop
    allocation := least(needed, grant_row.available);
    if allocation > 0 then
      insert into public.credit_spend_allocations (spend_id, grant_id, amount)
        values (new_spend_id, grant_row.id, allocation);
      needed := needed - allocation;
    end if;
    exit when needed <= 0;
  end loop;
  if needed > 0 then raise exception 'credit allocation failed'; end if;

  insert into public.credit_transactions (user_id, amount, reason)
    values (auth.uid(), -cost, feature);
  remaining := public.get_credit_balance(auth.uid());
  update public.profiles set credits = remaining, updated_at = now() where id = auth.uid();
  return jsonb_build_object('ok', true, 'balance', remaining, 'spend_id', new_spend_id, 'elevated', false);
end;
$$;

-- The signature is unchanged from 192, so `create or replace` keeps the existing grants; they are
-- re-stated here for the same reason 192 stated them, so a reader of this file alone can see the
-- function's exposure without walking the train.
revoke all on function public.spend_credits(text, text, text) from public;
grant execute on function public.spend_credits(text, text, text) to authenticated;

comment on function public.spend_credits(text, text, text) is
  'Atomic credit spend (202 — adds the dossierProse arm at 5 to the 192 body). Config-first cost resolution (114), the 057 CASE block as the fallback, and the tier multiplier (192, still inert). THE SCRIBE''S SKU IS ONE PRICE PER RENDER: one render, one spend, however many tabs it draws (migration 203''s render session is what makes it so); dossier and daily life together, per epoch, and inert until FLAGS.scribe is lit.';
