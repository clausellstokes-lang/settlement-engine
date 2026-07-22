-- ────────────────────────────────────────────────────────────────────────────
-- 174_pricing_optimal_margins.sql — repriced AI schedule for optimal margins at
-- the Opus-default economics, plus the calibration-target knob bump.
--
-- MIGRATION-NUMBER NOTE: authored on the pricing lane in a reserved 180 band to
--   avoid a cross-worktree collision with the parallel admin/moderation lane
--   (which committed 170, 171, 172, 173 = founders roll / content moderation /
--   comment tombstone / map reports). RENUMBERED 180 -> 174 at fold, the next
--   contiguous slot after the admin lane's head 173, once both lanes landed on
--   composite-r4. The tree is now contiguous through 174.
--
-- WHY THIS EXISTS
--   The standard (Opus-default) narrative was priced at 3 credits while its real
--   cost-of-goods on the Opus path (a ~20-call run — 1 thesis + 14 refinement
--   passes + 5 daily-life beats) is thin-to-negative at $0.157/credit. The owner
--   asked for optimal margins with Opus as the default. Under the margin policy
--   (standard >= 2.5x expected post-engineering COGS AND >= 1.2x worst-case), the
--   only action below the floor was `narrative`. It moves 3 -> 5. To preserve the
--   product's `progression > narrative` cost-weighting invariant (pinned by
--   tests/edgeFunctions/aiGroundingContract.test.js), `progression` moves 5 -> 6.
--   `dailyLife` (4) and the whole fast/subsidy schedule (2/3/4) and chronicle (2)
--   already clear their floors and are UNCHANGED. See docs/PRICING_MARGIN_SHEET.md
--   for the measured COGS and the per-cell margins.
--
--   The credit-value / floor / cap / kill-switch knobs are unchanged; ONLY
--   targetMultiplier moves 1.2 -> 2.5 so the nightly pricing-resync calibrator
--   MAINTAINS the 2.5x margin policy against real ai_usage_events COGS. The
--   applyCreditCosts kill switch STAYS OFF — flipping it (live auto-apply) is the
--   owner's call, so this migration is the seed and the calibrator only
--   recommends until the owner acts.
--
-- WHAT THIS DOES (all config-first; the seed rows in 114 are on-conflict-do-nothing
--   so a live/prod row is never re-seeded — this migration UPDATEs the live rows):
--     1. UPDATE ai_credit_costs — standard profiles narrative 3->5, progression 5->6
--        (jsonb_set on the exact paths; dailyLife + every fast profile untouched, so
--        an operator edit to any other field survives).
--     2. UPDATE ai_pricing_knobs — targetMultiplier 1.2 -> 2.5.
--     3. Recreate spend_credits — forks the 161 net-current body verbatim, ONE change:
--        the fallback CASE narrative 3->5, progression 5->6 (config-first path,
--        account gate, single-session belt, FIFO allocation, surveyor entries, and
--        the pg_temp search_path pin are byte-for-byte 161).
--     4. Recreate get_ai_pricing — forks the 131 net-current body verbatim, ONE change:
--        the always-complete fallback `defaults` table, standard profiles narrative
--        3->5, progression 5->6 (so the config-absent fallback the CLIENT reads stays
--        coherent with the spend_credits CASE — no quote/charge mismatch if config
--        ever vanishes).
--
-- SEED-vs-DEPLOY: the historical CASE/seed declarations (024/057/114) are edited in
--   place to the new schedule so the contract + fee-schedule parity tests (which grep
--   / execute those bodies) stay green and internally consistent; they are inert for
--   production (the live function is the superseded net-current body this migration
--   recreates, and the live config is what UPDATE (1) changes).
--
-- Re-runnable: idempotent jsonb UPDATEs + create-or-replace function bodies.
-- Depends on: 002 (system_config), 018/024 (credit ledger), 057 (account gate),
--   114 (ai_pricing config rows + get_ai_pricing/spend_credits config-first shape),
--   131 (search_path re-pin), 161 (net-current spend_credits + single-session belt).
--
-- @rollback: jsonb_set the two config rows back (targetMultiplier 2.5->1.2,
--   ai_credit_costs standard narrative 5->3 / progression 6->5) and re-run the 161
--   spend_credits + 131 get_ai_pricing bodies (narrative 3 / progression 5). This
--   reinstates the thin-margin narrative price; the client + edge copies must be
--   reverted in the same change or the contract test reddens.
-- ────────────────────────────────────────────────────────────────────────────

-- ── 1. UPDATE ai_credit_costs — standard profiles narrative 3->5, progression 5->6 ──
-- Targeted jsonb_set on each standard profile's narrative + progression path. The
-- four fast profiles (haiku / gpt-5-mini / gpt-5-nano / gpt-4.1-mini) and every
-- dailyLife value are left untouched, so this is the minimal policy write.
-- One targeted UPDATE per concern (each with a balanced 2x jsonb_set), so the
-- four fast profiles and every dailyLife value stay untouched.
update public.system_config set value = jsonb_set(
      jsonb_set(value, '{updatedAt}', to_jsonb(to_char(now() at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'))),
      '{updatedBy}', to_jsonb('migration_180'::text))
where key = 'ai_credit_costs';

update public.system_config set value = jsonb_set(
      jsonb_set(value, '{profiles,anthropic_claude_opus_4_8,narrative}',   '5'::jsonb),
      '{profiles,anthropic_claude_opus_4_8,progression}', '6'::jsonb)
where key = 'ai_credit_costs';

update public.system_config set value = jsonb_set(
      jsonb_set(value, '{profiles,anthropic_claude_sonnet_4_6,narrative}',   '5'::jsonb),
      '{profiles,anthropic_claude_sonnet_4_6,progression}', '6'::jsonb)
where key = 'ai_credit_costs';

update public.system_config set value = jsonb_set(
      jsonb_set(value, '{profiles,openai_gpt_5_2,narrative}',   '5'::jsonb),
      '{profiles,openai_gpt_5_2,progression}', '6'::jsonb)
where key = 'ai_credit_costs';

update public.system_config set value = jsonb_set(
      jsonb_set(value, '{profiles,openai_gpt_4_1,narrative}',   '5'::jsonb),
      '{profiles,openai_gpt_4_1,progression}', '6'::jsonb)
where key = 'ai_credit_costs';

-- ── 2. UPDATE ai_pricing_knobs — targetMultiplier 1.2 -> 2.5 (the margin policy) ─────
-- Everything else (creditValueUsd 0.157, maxStepPerResync 1, floorCredits 1,
-- capCredits 12, minRunsForCalibration 20, usageWindowDays 60) is unchanged.
update public.system_config
set value = jsonb_set(value, '{targetMultiplier}', '2.5'::jsonb)
where key = 'ai_pricing_knobs';

-- ── 3. spend_credits — net-current (161) body, CASE narrative 3->5, progression 5->6 ─
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
  'Atomic ledger-allocation credit spend. Net-current body (161: single-session belt + 057 account gate + config-first cost resolution) with the 180 repriced fallback CASE (narrative 5, progression 6 — optimal margins). Config (ai_credit_costs) wins when p_profile is supplied and the value is int 1..12; otherwise the CASE.';

-- ── 4. get_ai_pricing — net-current (131) body, fallback defaults narrative 3->5, progression 5->6 ──
-- The always-complete `defaults` table is the config-absent fallback the CLIENT
-- reads. 180 moves the standard profiles' narrative 3->5, progression 5->6 so the
-- fallback stays coherent with the spend_credits CASE (no quote/charge mismatch if
-- the config row is ever deleted). Fast profiles (2/3/4) unchanged.
create or replace function public.get_ai_pricing()
returns jsonb
language plpgsql
stable
security definer
set search_path = public, pg_temp
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
  -- The 8 profile keys paired with their tier defaults (180: standard 5/4/6, fast 2/3/4).
  -- This literal table IS the always-complete fallback schedule.
  defaults    jsonb := jsonb_build_object(
    'anthropic_claude_opus_4_8',   jsonb_build_object('narrative', 5, 'dailyLife', 4, 'progression', 6),
    'anthropic_claude_sonnet_4_6', jsonb_build_object('narrative', 5, 'dailyLife', 4, 'progression', 6),
    'anthropic_claude_haiku_4_5',  jsonb_build_object('narrative', 2, 'dailyLife', 3, 'progression', 4),
    'openai_gpt_5_2',              jsonb_build_object('narrative', 5, 'dailyLife', 4, 'progression', 6),
    'openai_gpt_5_mini',           jsonb_build_object('narrative', 2, 'dailyLife', 3, 'progression', 4),
    'openai_gpt_5_nano',           jsonb_build_object('narrative', 2, 'dailyLife', 3, 'progression', 4),
    'openai_gpt_4_1',              jsonb_build_object('narrative', 5, 'dailyLife', 4, 'progression', 6),
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
  'Client read path for AI pricing (system_config is RLS-locked by 058). Net-current 131 body with the 180 repriced fallback defaults (standard narrative 5, progression 6; fast 2/3/4). Returns the model-aware credit-cost schedule (validated int 1..12, fallback to tier defaults), chronicle=2, per-model estRunTokens, and — only for an elevated caller — the USD price block.';
