-- ────────────────────────────────────────────────────────────────────────────
-- 153_surveyor_s7_credit_costs.sql — Surveyor S7 commercial: task-priced managed
-- credits for the AUTONOMY COMPOSER (DESIGN_AI_CONTROL_SURFACE §2 stage 7 + §4
-- commercial mapping; the MACHINERY-NOW / VOCABULARY-GROWS compromise).
--
-- WHY THIS EXISTS
--   S7 adds one new task class — 'autonomy' (natural language → a typed StopCondition
--   + acceleration nudges, composed against the signal registry). TASK-PRICED managed
--   credits (users buy OUTCOMES, not tokens). This extends the spend_credits CASE with
--   that feature so the surveyor-autonomy edge function's spend_credits({feature:
--   'autonomy'}) resolves a cost instead of raising 'unknown feature'. The bounded
--   autonomous ADVANCE itself runs in the deterministic client engine and costs
--   nothing — only the AI COMPOSE step is priced.
--
--   PRICING IS PROVISIONAL (vetoable — final Surveyor pricing is an OWNER-QUEUED
--   decision, design §6). Anchored to the S1/S3/S4–S6 precedent (analysis=3,
--   interpret=5): autonomy=4 — a bounded structured compose richer than one analyst
--   answer, lighter than a full session compile. Kept in lockstep with
--   src/config/pricing.js SURVEYOR_AI_COSTS by the pricing contract test
--   (tests/config/pricing.test.js) — this block + that map change together.
--
-- WHAT
--   Re-defines spend_credits verbatim from 151 (the current definition) with ONE new
--   CASE arm. All other behaviour — config-first per-profile cost, the elevated
--   bypass, grant allocation, the 057 active-account gate — is unchanged. CREATE OR
--   REPLACE preserves the existing grants (authenticated).
--
-- Depends on: 151 (current spend_credits), 114 (ai_credit_costs config), 057
--   (account_is_active), 007 (credit_ledger, get_credit_balance). Re-runnable.
-- @rollback: re-apply 151's spend_credits definition (drop the 'autonomy' CASE arm).
-- ────────────────────────────────────────────────────────────────────────────

create or replace function public.spend_credits(feature text, p_profile text default null)
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
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
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
    -- S7 (autonomy) features.
    cost := case feature
      when 'chronicle' then 2
      when 'narrative' then 3
      when 'dailyLife' then 4
      when 'progression' then 5
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
