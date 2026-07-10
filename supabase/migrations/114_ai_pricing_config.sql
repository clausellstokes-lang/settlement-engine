-- ────────────────────────────────────────────────────────────────────────────
-- 114_ai_pricing_config.sql — the config-backed AI pricing + credit-cost system.
--
-- WHY THIS EXISTS
--   Until now the per-feature CREDIT cost (narrative 3, dailyLife 4, progression 5,
--   the _fast tiers 2/3/4, chronicle 2) and the per-model USD PRICE estimates lived
--   as HARD-CODED literals in three places at once: the spend_credits CASE block
--   (revenue), the generate-narrative edge map (the charge), and the client
--   estimator buckets (the display). They could only be changed by a code deploy,
--   and provider price moves (Anthropic / OpenAI) silently eroded margin because
--   nothing re-derived the credit cost from the real cost-of-goods.
--
--   This migration seeds three system_config rows that become the single source of
--   truth for the resync system (the admin-actions 'ai_pricing_resync' action reads
--   provider prices, folds in ai_usage_events COGS, and recalibrates credit costs):
--     - ai_price_book    — per-profile provider USD prices + est-run token shape.
--     - ai_credit_costs  — per-profile per-feature credit costs (the charge).
--     - ai_pricing_knobs — the calibration constants (credit value, multiplier…).
--   and three RPCs the client + resync stand on:
--     - get_ai_pricing()            — the ONLY client read path (system_config is
--                                     RLS-locked by 058); resolves costs with a
--                                     validate+fallback and hides USD unless elevated.
--     - aggregate_ai_usage_stats()  — service-role COGS rollup for the calibrator.
--     - spend_credits(feature, p_profile)  — recreated so the CHARGE can read the
--                                     config cost (model-aware), falling back to the
--                                     EXACT 057 CASE when config is absent/malformed.
--
-- SEED = TODAY'S BEHAVIOUR. The seeds reproduce the current estimator/charge exactly
--   so nothing changes until the first resync: credit costs are the 057 CASE values
--   (standard 3/4/5, fast 2/3/4) and the seeded USD prices are the client's existing
--   ESTIMATED_AI_PRICES_PER_MTOK substring buckets (including the deliberately "wrong"
--   gpt_5_nano 2/8 that falls to the default bucket — unchanged until recalibrated).
--   Chronicle is EXCLUDED from calibration entirely: it stays flat 2 everywhere.
--
-- IDEMPOTENT / OPERATOR-SAFE. The three config rows are `on conflict (key) do nothing`
--   so a re-apply NEVER clobbers a live operator edit (a manual override, a resync
--   write). The RPCs are create-or-replace; spend_credits is a DROP+CREATE because it
--   gains a second (defaulted) parameter and we must not leave the 1-arg overload
--   around — a 2-overload set makes supabase's named-arg rpc('spend_credits') ambiguous.
--
-- MIGRATION-NUMBER LEDGER: number 113 is reserved by an in-flight branch (the
--   founder-grant renumber, 111→113); this file deliberately takes 114 to avoid the
--   collision at merge.
--
-- Re-runnable: on-conflict-do-nothing seeds + create-or-replace RPCs + drop-if-exists
--   before the spend_credits recreate.
-- Depends on: 002 (system_config), 018 (current_user_is_privileged), 057 (the
--   net-current spend_credits body — this file forks the highest-numbered body),
--   078 (ai_usage_events, the COGS ledger the aggregate reads).
--
-- @rollback: drop the three RPCs added/changed here and recreate spend_credits(text)
--   from 057; delete the three seeded system_config rows if they were never edited.
--   NOTE the rollback reinstates hard-coded, code-deploy-only credit costs.
-- ────────────────────────────────────────────────────────────────────────────

-- ── 1. Seed system_config: ai_price_book ───────────────────────────────────
-- Per-profile provider prices keyed by the 8 MODEL_PROFILES keys. The seed USD
-- prices are the client's existing estimator buckets (so avgCogs math is unchanged
-- until the first resync). estRun is null until a resync observes real token shape.
insert into public.system_config (key, value)
values ('ai_price_book', jsonb_build_object(
  'updatedAt', to_char(now() at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
  'sources', jsonb_build_object(
    'anthropic', jsonb_build_object('fetchedAt', null, 'ok', false, 'url', 'https://platform.claude.com/docs/en/pricing.md'),
    'openai',    jsonb_build_object('fetchedAt', null, 'ok', false, 'url', 'https://platform.openai.com/docs/pricing')
  ),
  'models', jsonb_build_object(
    -- opus: 5/25   sonnet: 3/15   haiku: 1/5 (the client's substring buckets)
    'anthropic_claude_opus_4_8',   jsonb_build_object('provider', 'anthropic', 'modelId', 'claude-opus-4-8',   'inputPerMtok', 5,   'outputPerMtok', 25, 'stale', false, 'manualOverride', false, 'lastFetchedAt', null, 'estRun', null),
    'anthropic_claude_sonnet_4_6', jsonb_build_object('provider', 'anthropic', 'modelId', 'claude-sonnet-4-6', 'inputPerMtok', 3,   'outputPerMtok', 15, 'stale', false, 'manualOverride', false, 'lastFetchedAt', null, 'estRun', null),
    'anthropic_claude_haiku_4_5',  jsonb_build_object('provider', 'anthropic', 'modelId', 'claude-haiku-4-5',  'inputPerMtok', 1,   'outputPerMtok', 5,  'stale', false, 'manualOverride', false, 'lastFetchedAt', null, 'estRun', null),
    -- gpt_5_2: 2/8   gpt_5_mini: 0.4/1.6   gpt_5_nano: 2/8 (nano MISSES the 'mini'
    -- substring → default 2/8 bucket; seeded deliberately "wrong" so behaviour is
    -- unchanged until the first resync corrects it).
    'openai_gpt_5_2',              jsonb_build_object('provider', 'openai',    'modelId', 'gpt-5.2',           'inputPerMtok', 2,   'outputPerMtok', 8,  'stale', false, 'manualOverride', false, 'lastFetchedAt', null, 'estRun', null),
    'openai_gpt_5_mini',           jsonb_build_object('provider', 'openai',    'modelId', 'gpt-5-mini',        'inputPerMtok', 0.4, 'outputPerMtok', 1.6,'stale', false, 'manualOverride', false, 'lastFetchedAt', null, 'estRun', null),
    'openai_gpt_5_nano',           jsonb_build_object('provider', 'openai',    'modelId', 'gpt-5-nano',        'inputPerMtok', 2,   'outputPerMtok', 8,  'stale', false, 'manualOverride', false, 'lastFetchedAt', null, 'estRun', null),
    'openai_gpt_4_1',              jsonb_build_object('provider', 'openai',    'modelId', 'gpt-4.1',           'inputPerMtok', 2,   'outputPerMtok', 8,  'stale', false, 'manualOverride', false, 'lastFetchedAt', null, 'estRun', null),
    'openai_gpt_4_1_mini',         jsonb_build_object('provider', 'openai',    'modelId', 'gpt-4.1-mini',      'inputPerMtok', 0.4, 'outputPerMtok', 1.6,'stale', false, 'manualOverride', false, 'lastFetchedAt', null, 'estRun', null)
  ),
  'candidates', '[]'::jsonb,
  'missingFromProvider', '[]'::jsonb
))
on conflict (key) do nothing;

-- ── 2. Seed system_config: ai_credit_costs ─────────────────────────────────
-- Per-profile per-feature credit costs. SEED = 057 CASE values so the charge is
-- unchanged until the first resync: standard profiles 3/4/5, fast profiles 2/3/4.
insert into public.system_config (key, value)
values ('ai_credit_costs', jsonb_build_object(
  'updatedAt', to_char(now() at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
  'updatedBy', 'seed',
  'profiles', jsonb_build_object(
    -- standard (opus / sonnet / gpt-5.2 / gpt-4.1): 3 / 4 / 5
    'anthropic_claude_opus_4_8',   jsonb_build_object('narrative', 3, 'dailyLife', 4, 'progression', 5),
    'anthropic_claude_sonnet_4_6', jsonb_build_object('narrative', 3, 'dailyLife', 4, 'progression', 5),
    'openai_gpt_5_2',              jsonb_build_object('narrative', 3, 'dailyLife', 4, 'progression', 5),
    'openai_gpt_4_1',              jsonb_build_object('narrative', 3, 'dailyLife', 4, 'progression', 5),
    -- fast (haiku / gpt-5-mini / gpt-5-nano / gpt-4.1-mini): 2 / 3 / 4
    'anthropic_claude_haiku_4_5',  jsonb_build_object('narrative', 2, 'dailyLife', 3, 'progression', 4),
    'openai_gpt_5_mini',           jsonb_build_object('narrative', 2, 'dailyLife', 3, 'progression', 4),
    'openai_gpt_5_nano',           jsonb_build_object('narrative', 2, 'dailyLife', 3, 'progression', 4),
    'openai_gpt_4_1_mini',         jsonb_build_object('narrative', 2, 'dailyLife', 3, 'progression', 4)
  )
))
on conflict (key) do nothing;

-- ── 3. Seed system_config: ai_pricing_knobs ────────────────────────────────
-- The calibration constants (see the resync formula in admin-actions).
insert into public.system_config (key, value)
values ('ai_pricing_knobs', jsonb_build_object(
  'creditValueUsd', 0.157,
  'targetMultiplier', 1.2,
  'maxStepPerResync', 1,
  'floorCredits', 1,
  'capCredits', 12,
  'minRunsForCalibration', 20,
  'usageWindowDays', 60
))
on conflict (key) do nothing;

-- ── 4. get_ai_pricing() — the client's ONLY pricing read path ───────────────
-- system_config is RLS-read-locked by 058, so the client cannot read the rows
-- directly. This SECURITY DEFINER RPC returns the resolved credit-cost schedule
-- (validated, falling back to the tier defaults), the est-run token shape per
-- model, and — ONLY for an elevated caller — the USD price block.
--
-- The fallback schedule is ALWAYS complete: even with the config rows missing or
-- malformed, every one of the 8 profiles resolves to its tier-default costs so the
-- client always has model-aware numbers.
create or replace function public.get_ai_pricing()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  costs_cfg   jsonb;
  price_cfg   jsonb;
  is_elevated boolean;
  caller_role text;
  profile_key text;
  fallback    jsonb;
  credit_out  jsonb := '{}'::jsonb;
  models_out  jsonb := '{}'::jsonb;
  usd_out     jsonb := '{}'::jsonb;
  cost_val    integer;
  tokens      integer;
  est_run     jsonb;
  in_price    numeric;
  out_price   numeric;
  updated_at  text;
  -- The 8 profile keys paired with their tier defaults (standard 3/4/5, fast 2/3/4).
  -- This literal table IS the always-complete fallback schedule.
  defaults    jsonb := jsonb_build_object(
    'anthropic_claude_opus_4_8',   jsonb_build_object('narrative', 3, 'dailyLife', 4, 'progression', 5),
    'anthropic_claude_sonnet_4_6', jsonb_build_object('narrative', 3, 'dailyLife', 4, 'progression', 5),
    'anthropic_claude_haiku_4_5',  jsonb_build_object('narrative', 2, 'dailyLife', 3, 'progression', 4),
    'openai_gpt_5_2',              jsonb_build_object('narrative', 3, 'dailyLife', 4, 'progression', 5),
    'openai_gpt_5_mini',           jsonb_build_object('narrative', 2, 'dailyLife', 3, 'progression', 4),
    'openai_gpt_5_nano',           jsonb_build_object('narrative', 2, 'dailyLife', 3, 'progression', 4),
    'openai_gpt_4_1',              jsonb_build_object('narrative', 3, 'dailyLife', 4, 'progression', 5),
    'openai_gpt_4_1_mini',         jsonb_build_object('narrative', 2, 'dailyLife', 3, 'progression', 4)
  );
  feat        text;
begin
  select value into costs_cfg from public.system_config where key = 'ai_credit_costs';
  select value into price_cfg from public.system_config where key = 'ai_price_book';

  -- Elevated = the privileged-email/role helper OR an explicit developer/admin role
  -- (mirrors how 057/024 detect elevation). Only elevation reveals the USD block.
  select role into caller_role from public.profiles where id = auth.uid();
  is_elevated := public.current_user_is_privileged()
                 or coalesce(caller_role, '') in ('developer', 'admin');

  -- Resolve credit costs profile-by-profile. Each feature is validated (integer 1..12);
  -- any miss/malformation falls back to that profile's tier default.
  for profile_key in select jsonb_object_keys(defaults)
  loop
    fallback := defaults -> profile_key;
    declare
      resolved jsonb := fallback;
    begin
      foreach feat in array array['narrative', 'dailyLife', 'progression']
      loop
        cost_val := null;
        begin
          cost_val := (costs_cfg -> 'profiles' -> profile_key ->> feat)::integer;
        exception when others then
          cost_val := null;
        end;
        if cost_val is null or cost_val < 1 or cost_val > 12 then
          resolved := jsonb_set(resolved, array[feat], fallback -> feat);
        else
          resolved := jsonb_set(resolved, array[feat], to_jsonb(cost_val));
        end if;
      end loop;
      credit_out := jsonb_set(credit_out, array[profile_key], resolved);
    end;

    -- Per-model est-run token shape (input+output rounded), null when absent.
    est_run := price_cfg -> 'models' -> profile_key -> 'estRun';
    tokens := null;
    if est_run is not null and jsonb_typeof(est_run) = 'object' then
      begin
        tokens := round(
          coalesce((est_run ->> 'inputTokens')::numeric, 0)
          + coalesce((est_run ->> 'outputTokens')::numeric, 0)
        )::integer;
      exception when others then
        tokens := null;
      end;
    end if;
    models_out := jsonb_set(models_out, array[profile_key],
      jsonb_build_object('estRunTokens', case when tokens is null then null else to_jsonb(tokens) end));

    -- USD block (elevated only): per-model input/output price + est run cost.
    if is_elevated then
      begin
        in_price  := (price_cfg -> 'models' -> profile_key ->> 'inputPerMtok')::numeric;
        out_price := (price_cfg -> 'models' -> profile_key ->> 'outputPerMtok')::numeric;
      exception when others then
        in_price := null; out_price := null;
      end;
      usd_out := jsonb_set(usd_out, array[profile_key], jsonb_build_object(
        'inputPerMtok', case when in_price is null then null else to_jsonb(in_price) end,
        'outputPerMtok', case when out_price is null then null else to_jsonb(out_price) end,
        'estRunUsd', case
          when tokens is null or in_price is null or out_price is null then null
          else to_jsonb(round(
            coalesce((est_run ->> 'inputTokens')::numeric, 0) / 1000000.0 * in_price
            + coalesce((est_run ->> 'outputTokens')::numeric, 0) / 1000000.0 * out_price, 6))
        end
      ));
    end if;
  end loop;

  updated_at := coalesce(costs_cfg ->> 'updatedAt', price_cfg ->> 'updatedAt');

  return jsonb_build_object(
    'updatedAt', case when updated_at is null then null else to_jsonb(updated_at) end,
    'creditCosts', credit_out,
    'chronicle', 2,
    'models', models_out
  ) || case when is_elevated then jsonb_build_object('usd', usd_out) else '{}'::jsonb end;
end;
$$;

revoke all on function public.get_ai_pricing() from public;
grant execute on function public.get_ai_pricing() to authenticated;

comment on function public.get_ai_pricing() is
  'Client read path for AI pricing (system_config is RLS-locked by 058). Returns the model-aware credit-cost schedule (validated int 1..12, fallback to tier defaults), chronicle=2, per-model estRunTokens, and — only for an elevated caller (current_user_is_privileged or role developer/admin) — the USD price block. Always returns the COMPLETE fallback schedule even when the config rows are missing/malformed.';

-- ── 5. aggregate_ai_usage_stats(p_window_days) — COGS rollup for the resync ─
-- Groups ai_usage_events by model_preference × feature over the window and computes
-- PER-RUN aggregates. Rows are per-CALL (a narrative run writes ~20 rows sharing one
-- spend_id), so runs = count(DISTINCT spend_id) and the per-run averages divide token
-- and cost SUMS by that distinct-run count, NOT by row count. service_role only — the
-- resync's admin client is the sole caller.
create or replace function public.aggregate_ai_usage_stats(p_window_days integer)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'windowDays', p_window_days,
    'groups', coalesce(jsonb_agg(g), '[]'::jsonb)
  )
  from (
    select jsonb_build_object(
      'profile', model_preference,
      'feature', feature,
      'runs', count(distinct spend_id),
      'avgInputTokens',  round(sum(input_tokens)::numeric  / count(distinct spend_id), 2),
      'avgOutputTokens', round(sum(output_tokens)::numeric / count(distinct spend_id), 2),
      'avgCostUsd',      round(sum(estimated_cost_usd)::numeric / count(distinct spend_id), 6)
    ) as g
    from public.ai_usage_events
    where feature in ('narrative', 'dailyLife', 'progression')
      and model_preference is not null
      and spend_id is not null
      and created_at > now() - (p_window_days || ' days')::interval
    group by model_preference, feature
    having count(distinct spend_id) > 0
  ) grouped;
$$;

revoke all on function public.aggregate_ai_usage_stats(integer) from public;
grant execute on function public.aggregate_ai_usage_stats(integer) to service_role;

comment on function public.aggregate_ai_usage_stats(integer) is
  'Service-role COGS rollup for the AI pricing resync. Groups ai_usage_events (feature in narrative/dailyLife/progression, model_preference + spend_id not null, within p_window_days) by model_preference × feature; per group runs = count(distinct spend_id) and the token/cost averages divide the SUMS by that distinct-run count (rows are per-CALL, ~20 sharing one spend_id).';

-- ── 6. spend_credits(feature, p_profile) — the CHARGE, now config-aware ─────
-- Recreated from the 057 NET-CURRENT body (the highest-numbered spend_credits def —
-- the house migration-recreate rule requires forking the newest body, not 024's).
-- ONE change: cost resolution first tries config (strip a trailing '_fast' to the base
-- feature; when p_profile is not null read ai_credit_costs → profiles → p_profile →
-- base_feature, accept only integer 1..12), and on ANY miss/malformation falls back to
-- the EXACT 057 CASE block (kept verbatim, chronicle included). Everything else — the
-- account-status gate, advisory FIFO allocation, elevated bypass — is byte-for-byte 057.
--
-- DROP the old 1-arg overload first: leaving both a 1-arg and a 2-arg spend_credits
-- makes supabase's named-arg rpc('spend_credits', {feature}) ambiguous.
drop function if exists public.spend_credits(text);

create or replace function public.spend_credits(feature text, p_profile text default null)
returns jsonb
language plpgsql
security definer
set search_path = public
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
    -- 057 CASE block, verbatim (the always-available fallback).
    cost := case feature
      when 'chronicle' then 2
      when 'narrative' then 3
      when 'dailyLife' then 4
      when 'progression' then 5
      when 'narrative_fast' then 2
      when 'dailyLife_fast' then 3
      when 'progression_fast' then 4
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

revoke all on function public.spend_credits(text, text) from public;
grant execute on function public.spend_credits(text, text) to authenticated;

comment on function public.spend_credits(text, text) is
  'Atomic ledger-allocation credit spend. Net-current body (057) plus the 114 config-first cost resolution: when p_profile is supplied it reads the per-profile ai_credit_costs config (validated int 1..12) and otherwise (or on any malformation) falls back to the EXACT 057 CASE. Keeps the account-status gate, the per-user FOR UPDATE serialization, and the elevated bypass. p_profile defaults null = the mode-blind 057 behaviour.';
