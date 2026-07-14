-- ════════════════════════════════════════════════════════════════════════════
-- 131 — re-pin the 8 post-111 money/gallery SECURITY DEFINER functions to
--        `search_path = public, pg_temp` (pg_temp LAST)
-- ════════════════════════════════════════════════════════════════════════════
-- backend-3 (the MIGRATION-TODO in tests/lint/migrationSearchPathPin.test.js).
--
-- THE INVARIANT (094/111): every public SECURITY DEFINER function pins
-- `set search_path = public, pg_temp` with pg_temp LAST. A bare
-- `set search_path = public` leaves pg_temp implicitly FIRST — the
-- CVE-2018-1058 search-path-hijack class 094/111 exist to close. Eight money/gallery
-- functions authored AFTER 111 regressed to the bare form with no guard, so it would
-- keep recurring on every future recreate. The ratchet test froze them in the
-- baseline as a documented MIGRATION-TODO; this migration lands the re-pin.
--
-- WHY re-CREATE (not ALTER): 094/111 re-pinned via config-only `ALTER FUNCTION … SET
-- search_path` (byte-neutral to the body). But the ratchet walker
-- (migrationSearchPathPin.test.js) reads each function's search_path from its
-- net-current `create or replace` HEADER — it is blind to ALTER (which is exactly why
-- the 103 service_* functions ALTERed by 111 stay in the baseline). To SHRINK the
-- baseline so the guard now ENFORCES the re-pinned state, the walker must SEE the pin,
-- so each function is recreated verbatim from its net-current body with the single
-- header line changed `= public` → `= public, pg_temp`. Appending pg_temp LAST cannot
-- change how a `public` object resolves, so this is byte-neutral to behaviour (the
-- 094/111 posture). Bodies are extracted verbatim (114/115/120/123/125); grants +
-- comments are preserved by `create or replace` (same OID), so no re-grant is needed.
-- The pglite money/security suites + migrationSequenceAll EXECUTE these, and the
-- ratchet's baseline is shrunk in lockstep (its KNOWN_POST_111 list emptied).
-- ⚠️ inert until `supabase db push` + a PostgREST refresh.
--
-- Functions re-pinned (net-current source):
--   114_ai_pricing_config.sql            — get_ai_pricing, aggregate_ai_usage_stats, spend_credits
--   115_pricing_resync_cron.sql          — run_pricing_resync_nightly
--   120_gallery_import_premium_gate.sql  — import_gallery_dossier
--   123_money_and_public_projection…sql  — refund_credits
--   125_action_velocity_guards.sql       — toggle_gallery_vote, add_gallery_comment


-- ══ get_ai_pricing (net-current: 114_ai_pricing_config.sql) — search_path re-pinned public, pg_temp ══
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

-- ══ aggregate_ai_usage_stats (net-current: 114_ai_pricing_config.sql) — search_path re-pinned public, pg_temp ══
create or replace function public.aggregate_ai_usage_stats(p_window_days integer)
returns jsonb
language sql
stable
security definer
set search_path = public, pg_temp
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

-- ══ spend_credits (net-current: 114_ai_pricing_config.sql) — search_path re-pinned public, pg_temp ══
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

-- ══ run_pricing_resync_nightly (net-current: 115_pricing_resync_cron.sql) — search_path re-pinned public, pg_temp ══
create or replace function public.run_pricing_resync_nightly()
returns text
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  cfg        jsonb;
  verdict    text;
  cfg_url    text;
  cfg_secret text;
  tz         text;
  local_today text;
  req_id     bigint;
begin
  select value into cfg from public.system_config where key = 'pricing_resync_cron';

  -- The guard owns the config/enabled/hour/dedupe decision (shared with the tests).
  verdict := public._pricing_cron_should_dispatch(cfg, now());
  if verdict <> 'ok' then
    return verdict;
  end if;

  cfg_url    := cfg ->> 'url';
  cfg_secret := cfg ->> 'secret';
  tz         := coalesce(nullif(cfg ->> 'timezone', ''), 'America/New_York');
  local_today := to_char(now() at time zone tz, 'YYYY-MM-DD');

  -- Mark dispatched FIRST: if pg_net then errors we still won't re-dispatch this
  -- local day (the edge function is the source of truth for the run outcome; a
  -- failed POST is recoverable tomorrow, a double-charge from a double-run is not).
  update public.system_config
     set value = jsonb_set(value, '{lastDispatchedOn}', to_jsonb(local_today))
   where key = 'pricing_resync_cron';

  -- Fire the POST. net.http_post is only present when pg_net is installed; wrap the
  -- call so a missing extension is a soft 'pg_net_unavailable', never a throw.
  begin
    select net.http_post(
      url     := cfg_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'x-cron-secret', cfg_secret
      ),
      body    := '{}'::jsonb
    ) into req_id;
  exception
    when undefined_function or undefined_table or invalid_schema_name then
      raise notice 'pg_net unavailable; pricing-resync-cron not dispatched (install pg_net or schedule the POST manually)';
      return 'pg_net_unavailable';
  end;

  return 'dispatched:' || coalesce(req_id::text, 'unknown');
end;
$$;

-- ══ import_gallery_dossier (net-current: 120_gallery_import_premium_gate.sql) — search_path re-pinned public, pg_temp ══
create or replace function public.import_gallery_dossier(dossier_slug text)
returns table (
  id uuid,
  name text,
  tier text,
  data jsonb
)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select
    s.id,
    s.name,
    s.tier,
    public._gallery_apply_member_overrides(
      case when s.gallery_share_dm then public._gallery_dm_full_json(base.j) else public._gallery_sanitize_public_json(base.j) end,
      public._gallery_dm_full_json(base.j),
      s.gallery_member_overrides, s.gallery_share_dm, s.gallery_importable, true
    ) as data
  from public.settlements s
  cross join lateral (
    select case
      when s.gallery_share_narrated
        and s.ai_data is not null
        and jsonb_typeof(s.ai_data -> 'aiSettlement') = 'object'
      then s.ai_data -> 'aiSettlement'
      else s.data
    end as j
  ) base
  where s.public_slug = dossier_slug
    and s.is_public = true
    and s.gallery_importable = true
    and auth.uid() is not null
    -- ── mig 120: IMPORT is premium (server-authoritative). Free/anon → 0 rows. ──
    and public.current_user_has_premium_access()
  limit 1;
$$;

-- ══ refund_credits (net-current: 123_money_and_public_projection_hardening.sql) — search_path re-pinned public, pg_temp ══
create or replace function public.refund_credits(spend_ledger_row uuid, refund_reason text default null)
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  spend_row record;
  is_admin boolean;
  is_service boolean;
  new_balance integer;
begin
  -- Service-role is a FIRST-CLASS caller (085/047): the edge functions refund via
  -- the service-role client (auth.uid() NULL) after a server-verified failure.
  is_service := coalesce(current_setting('request.jwt.claim.role', true), auth.role()) = 'service_role';

  if not is_service and auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  -- FOR UPDATE (087): serialize concurrent refunds of the SAME spend so the
  -- idempotency below is atomic. A redelivered refund blocks until the first
  -- COMMITs, then trips the unique index — caught as a no-op (below).
  select * into spend_row
    from public.credit_ledger
    where id = spend_ledger_row
    for update;

  if not found or spend_row.kind <> 'spend' then
    raise exception 'spend row not found';
  end if;

  is_admin := public.current_user_is_privileged();

  -- Ownership gate — human callers only. The service role is trusted (reaches this
  -- path only after a server-verified generation failure; refunds by spend_id).
  if not is_service and spend_row.user_id <> auth.uid() and not is_admin then
    raise exception 'not authorized to refund this spend';
  end if;

  -- Elevated-spend skip (087). An ELEVATED (dev/admin) spend never debited credits
  -- or wrote allocations (spend_credits skips both for metadata.elevated=true), so
  -- refunding it would MINT phantom credits. No-op + return the live balance.
  -- Placed AFTER the ownership gate so a caller can't probe another user's balance
  -- via a non-owned elevated spend id.
  if coalesce(spend_row.metadata->>'elevated', 'false') = 'true' then
    return (select credits from public.profiles where id = spend_row.user_id);
  end if;

  -- Idempotency is STRUCTURAL (ux_credit_ledger_one_refund_per_spend), not a
  -- check-then-act guard. Attempt the refund grant; a duplicate — including one
  -- racing a concurrent retry — trips the unique index, which we treat as a NO-OP
  -- returning the current balance (OUR 050 semantics). Refund is safe to retry
  -- (the edge functions deliver at-least-once), so a second call MUST NOT be an
  -- error: their 085/087 raise-on-duplicate would fire false
  -- {refund:'failed', supportNote:'contact support'} alarms on the refund path
  -- (see generate-narrative). DO NOT restore this to a raise.
  begin
    insert into public.credit_ledger (user_id, kind, amount, source, metadata)
      values (
        spend_row.user_id,
        'grant',
        spend_row.amount,
        'refund',
        jsonb_build_object('refund_of', spend_ledger_row, 'reason', refund_reason)
      );
  exception when unique_violation then
    -- Duplicate refund (this call or a concurrent one). Return the recomputed
    -- balance so the caller sees the settled state, and DO NOT write the legacy
    -- mirror row again — exactly one refund per spend, everywhere.
    return public.get_credit_balance(spend_row.user_id);
  end;

  -- Mirror into legacy table for dual-write parity (winning insert only).
  insert into public.credit_transactions (user_id, amount, reason)
    values (spend_row.user_id, spend_row.amount, 'refund');

  -- RECOMPUTE profiles.credits from the ledger — the SAME canonical expression as
  -- spend_credits / system_grant_credits (018). Incremental `credits + amount`
  -- arithmetic (085/087) carries any pre-existing drift forward and can diverge
  -- from get_credit_balance(); recompute keeps the counter and the balance reader
  -- in lockstep (OUR 050 semantics). SAFE under the 110 IDOR guard: this SECURITY
  -- DEFINER reaches get_credit_balance with auth.uid()=NULL (service_role/system)
  -- or as owner/admin — all exempt from 110's cross-user raise (system_grant_
  -- credits, 116, is a live post-110 precedent for a definer reading a target's
  -- balance).
  new_balance := public.get_credit_balance(spend_row.user_id);
  update public.profiles
    set credits = new_balance,
        updated_at = now()
    where id = spend_row.user_id;

  -- Audit if a privileged HUMAN initiated it (service-role refunds are system
  -- actions, audited via the edge-function logs). is_admin implies a non-null
  -- auth.uid() (current_user_is_privileged matches a profile row for auth.uid()).
  if is_admin and auth.uid() <> spend_row.user_id then
    perform public._audit_action(
      auth.uid(),
      spend_row.user_id,
      'refund_credits',
      jsonb_build_object('spend_row', spend_ledger_row, 'amount', spend_row.amount),
      jsonb_build_object('new_balance', new_balance),
      refund_reason
    );
  end if;

  return new_balance;
end;
$$;

-- ══ toggle_gallery_vote (net-current: 125_action_velocity_guards.sql) — search_path re-pinned public, pg_temp ══
create or replace function public.toggle_gallery_vote(target_settlement_id uuid)
returns table (net_votes integer, voted boolean)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if auth.uid() is null then
    raise exception 'Sign in to vote';
  end if;
  if not public.account_is_active(auth.uid()) then
    raise exception 'account is not active';
  end if;

  -- Velocity guard (125): at most 60 accepted toggles/hour/user. Wire-speed
  -- toggling is bot behaviour; a human votes a handful of times.
  if public._consume_action_rate_limit(auth.uid(), 'gallery_vote', 3600) > 60 then
    raise exception 'You are voting too quickly — please slow down and try again shortly.';
  end if;

  perform 1 from public.settlements
    where id = target_settlement_id and is_public = true;
  if not found then
    raise exception 'Settlement is not public';
  end if;

  if exists (
    select 1 from public.gallery_votes
    where settlement_id = target_settlement_id and user_id = auth.uid()
  ) then
    delete from public.gallery_votes
      where settlement_id = target_settlement_id and user_id = auth.uid();
    return query
      select count(*)::integer, false
      from public.gallery_votes
      where settlement_id = target_settlement_id;
  else
    insert into public.gallery_votes(settlement_id, user_id)
      values (target_settlement_id, auth.uid())
      on conflict do nothing;
    return query
      select count(*)::integer, true
      from public.gallery_votes
      where settlement_id = target_settlement_id;
  end if;
end;
$$;

-- ══ add_gallery_comment (net-current: 125_action_velocity_guards.sql) — search_path re-pinned public, pg_temp ══
create or replace function public.add_gallery_comment(target_settlement_id uuid, comment_body text)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  comment_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Sign in to comment';
  end if;
  if not public.account_is_active(auth.uid()) then
    raise exception 'account is not active';
  end if;

  -- Velocity guard (125): at most 20 accepted comments/hour/user. Comment storage
  -- is otherwise unbounded (the display list caps at 100 but the rows persist);
  -- 20/hour is generous for a human and useless as a flood vector.
  if public._consume_action_rate_limit(auth.uid(), 'gallery_comment', 3600) > 20 then
    raise exception 'You are commenting too quickly — please slow down and try again shortly.';
  end if;

  if char_length(trim(coalesce(comment_body, ''))) < 1 then
    raise exception 'Comment cannot be empty';
  end if;
  if char_length(trim(comment_body)) > 2000 then
    raise exception 'Comment is too long';
  end if;

  perform 1 from public.settlements
    where id = target_settlement_id and is_public = true;
  if not found then
    raise exception 'Settlement is not public';
  end if;

  insert into public.gallery_comments(settlement_id, user_id, body)
    values (target_settlement_id, auth.uid(), trim(comment_body))
    returning id into comment_id;
  return comment_id;
end;
$$;
