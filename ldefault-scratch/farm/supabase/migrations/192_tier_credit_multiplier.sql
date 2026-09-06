-- ────────────────────────────────────────────────────────────────────────────
-- 192_tier_credit_multiplier.sql — THE TIER MULTIPLIER: fully built, fully INERT.
--
-- WHY THIS EXISTS
--   docs/DESIGN_AI_CAPABILITY_LADDER.md §3 piece 5 (SPEND-WITHIN-CEILING) + §4
--   wave L-5. A surface at journeyman+ may one day request an escalated pass
--   (extended thinking budget, or multi-step composition where the surface's
--   disposition permits), and an escalated pass must cost more than an ordinary
--   one — never silently, always through the same ledger everything else uses.
--   This migration lands the CHARGING half of that: spend_credits learns a third
--   argument, the tier, and learns how to scale a resolved cost by a per-tier
--   multiplier read from config.
--
-- ⚠⚠ INERTNESS IS THE POINT OF THIS MIGRATION. Applying it changes NO price
--   anywhere. There is deliberately NO seed row for the 'ai_tier_multipliers'
--   config key: absence of the row is the inert state, and absence is what this
--   migration leaves behind. Every existing caller passes feature (+ profile)
--   and no tier, so every existing caller takes the p_tier-is-null branch, which
--   is the 174 cost verbatim. §5 of the design doc puts "pricing multiplier
--   values + activation" in the OWNER-GATED column; this migration is the
--   machinery only, and it is built so that the owner's signature (queue item
--   M5, the pricing-sheet sign-off) is the single act that turns it on.
--
-- ACTIVATION CHECKLIST — none of this is in this migration, by design:
--   1. OWNER signs the pricing sheet (queue M5), then seeds the config row, e.g.
--        insert into public.system_config (key, value) values ('ai_tier_multipliers',
--          jsonb_build_object('scout', 1, 'journeyman', 1.5, 'master', 2));
--      Until that row exists, the lookup below misses and the base cost stands.
--   2. A later wave extends public.surveyor_usage_precheck (migration 144) so the
--      warn/cap machinery quotes the SAME tier-scaled number this function will
--      charge. ⚠ THE 159 LESSON APPLIES THERE: precheck must be recreated from its
--      NET-CURRENT body carrying EVERY delta, not forked from 144's source. (See
--      191's header for the accident this rule exists to prevent — 159 recreated
--      surveyor_byok_set from 139 and silently dropped 143's health reset.)
--   3. A later wave threads the tier from the edges into the rpc call. No edge
--      function is touched here; the 11 live callers keep their 2-arg shape.
--   4. The client display half (src/config/pricing.js getSurveyorAiCost(feature,
--      tier) + TIER_MULTIPLIERS) ships WITH this migration and is inert the same
--      way: every multiplier in that frozen map is 1 and no caller passes a tier.
--
-- NET-CURRENCY PROOF (the rule 191's header states, applied here before writing
--   a single line). Recreating spend_credits means adopting the body Postgres
--   will actually end up with, so the whole corpus was grepped for every
--   create-or-replace of public.spend_credits and the chain reconciled:
--
--   ⚠ NOTE FOR FUTURE AUTHORS, learned the hard way in this wave: do NOT spell
--   the literal create-or-replace statement in a migration COMMENT. The house
--   net-current extractors (the tests/security pglite family and
--   tests/security/moneyRpcNetCurrentGuards.test.js) match that phrase with an
--   UNANCHORED regex, so a header quoting it verbatim gets extracted INSTEAD of
--   the real body, prose and all, which then fails to parse as SQL. This is the
--   same shape as the trap 191's suite hit, where an @rollback note spelling an
--   ALTER would have been executed in place of the migration.
--     009 → 018 → 024 (ledger-allocation rewrite) → 057 (account_is_active gate)
--     → 114 (config-first cost resolution; DROPS the 1-arg overload)
--     → 131 (search_path re-pinned to public, pg_temp — pg_temp LAST)
--     → 140 (analysis, brief) → 149 (interpret, parley)
--     → 151 (customContent, styleOverhaul, constructSettlement, constructRealm)
--     → 153 (autonomy) → 161 (the single-session belt: assert_current_session)
--     → 174 (optimal margins: CASE narrative 3→5, progression 5→6)
--   174 IS NET-CURRENT. This migration forks 174's body VERBATIM and adds only
--   the tier block marked below. Forking 153 instead — the file a reader looking
--   for "the surveyor costs" would naturally land on — would have silently
--   dropped BOTH the 161 session belt (a superseded JWT could move credits again)
--   and the 174 reprice (narrative back to 3, progression back to 5: a live
--   revenue regression). That is precisely the 159-shaped accident, and it is
--   caught here by reading the corpus rather than the obvious file.
--
-- ARITY / OVERLOAD — the 114 idiom, repeated deliberately. Adding a third
--   parameter with a default to a function that already exists at 2 arity leaves
--   BOTH signatures resolvable, and PostgREST's named-argument rpc() call
--   (`rpc('spend_credits', { feature })`) then fails as ambiguous. 114 hit this
--   exact wall going 1-arg → 2-arg and solved it by dropping the old overload
--   first; this migration does the same going 2-arg → 3-arg. The DROP forfeits
--   the grants, so they are re-issued below on the new signature (again as 114
--   did). All 11 edge callers pass named arguments and keep working unchanged:
--   { feature } and { feature, p_profile } both resolve to this one function
--   with the remaining parameters defaulted.
--
-- THE BAND — a multiplier is honoured ONLY within 0.5 .. 3 inclusive. Outside
--   that window the value is treated as absent and the base cost stands. This is
--   a blast-radius fence, not a policy: config is operator-writable, and a
--   fat-fingered 30 (or a 0, or a negative) must not become a 12-credit charge
--   on an ordinary generation. The 1..12 clamp on the RESULT is the SAME hard
--   band the config-first path already enforces on cfg_cost and the same ceiling
--   the ai_pricing_knobs capCredits knob carries, so a tier can never push a
--   charge outside the range the rest of the money path already assumes.
--   Rounding is round() on numeric (half away from zero), applied before the
--   clamp, so the charge is always a whole credit.
--
-- Re-runnable: drop-if-exists + create-or-replace, no data writes at all.
-- Depends on: 002 (system_config), 018/024 (credit ledger), 057 (account gate),
--   114 (config-first shape), 131 (search_path pin), 161 (single-session belt),
--   174 (net-current body + the repriced CASE).
--
-- @rollback: drop function if exists public.spend_credits(text, text, text); then re-apply migration 174's spend_credits body verbatim (the 2-arg signature) together with its `revoke all on function public.spend_credits(text, text) from public;` and `grant execute on function public.spend_credits(text, text) to authenticated;`. No config row is seeded by this migration, so there is nothing to unseed; if the owner has since seeded 'ai_tier_multipliers', delete that row in the same change or the reverted 2-arg function will ignore a multiplier the client half is still displaying.
-- ────────────────────────────────────────────────────────────────────────────

-- ── 1. drop the 2-arg overload (the 114 idiom) ─────────────────────────────────
-- Must precede the create: leaving spend_credits(text, text) standing beside
-- spend_credits(text, text, text default null) makes every named-argument rpc()
-- call ambiguous, which would break all 11 edge callers at once.
drop function if exists public.spend_credits(text, text);

-- ── 2. spend_credits — 174's net-current body + the tier block ─────────────────
-- Everything except the block marked "THE TIER MULTIPLIER (192)" is byte-for-byte
-- 174: the single-session belt, the account-status gate, config-first cost
-- resolution, the repriced fallback CASE, the elevated bypass, FIFO allocation
-- over grants, and the pg_temp-LAST search_path pin.
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

-- The DROP above forfeited the old signature's grants; re-issue them on the new
-- one (114 did exactly this after dropping the 1-arg overload).
revoke all on function public.spend_credits(text, text, text) from public;
grant execute on function public.spend_credits(text, text, text) to authenticated;

comment on function public.spend_credits(text, text, text) is
  'Atomic ledger-allocation credit spend. Net-current body forked from 174 (161 single-session belt + 057 account gate + 114 config-first cost resolution + the 180/174 repriced fallback CASE) plus the 192 TIER MULTIPLIER. Config (ai_credit_costs) wins when p_profile is supplied and the value is int 1..12; otherwise the CASE. p_tier (scout|journeyman|master, anything else treated as null without raising) then scales that cost by system_config ai_tier_multipliers -> tier, honoured only within 0.5..3 and clamped to the hard 1..12 band. INERT AS SHIPPED: no ai_tier_multipliers row is seeded and no caller passes a tier, so every charge equals the 174 charge. Activation is owner-signed (pricing sheet, queue M5).';
