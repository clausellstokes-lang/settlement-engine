-- ────────────────────────────────────────────────────────────────────────────
-- 145_surveyor_usage_governors.sql — BYOK MANAGEMENT SURFACE: the USAGE METER's
-- USER GOVERNORS (caps + warn-threshold + pause) and per-task MODEL PREFERENCES,
-- plus the maintained price-ESTIMATE table the meter reads.
--
-- WHY THIS EXISTS
--   The owner commission (#29): the receipts culture applied to the user's own
--   wallet. ai_usage_events (078) already meters per-request token counts; this
--   adds the USER'S OWN LEVERS on top of that meter:
--     • surveyor_user_settings — a per-user row: model preference per task class,
--       daily/weekly caps (tokens OR estimated-$), an optional per-task-class cap
--       map, a warn-at-threshold percent, and a PAUSE switch.
--     • surveyor_usage_precheck() — the SINGLE edge door: before the analyst spends
--       anything, sum the user's windowed token + estimated-$ usage and compare it
--       to their caps → {allowed, paused, warn, reason_class}. Over-cap / paused ⇒
--       the edge refuses gracefully and spends NOTHING (§3d).
--     • surveyor_price_estimates config — the maintained per-model $/Mtok table,
--       labelled ESTIMATES (providers expose NO balance API — this is a trend, the
--       provider console is the truth). Both the precheck ($-caps) and the client
--       dashboard read this ONE table, so their estimates can never drift.
--
-- SECURITY POSTURE
--   surveyor_user_settings: RLS owner-READ own row (the settings surface); NO
--     insert/update/delete policy → writes go ONLY through the definer
--     surveyor_settings_set() (validated/clamped). A user governs their OWN wallet,
--     so self-service is intended — but the enforcement read (precheck) is
--     service-role + definer so the edge trusts the STORED row, never a client value.
--   These caps are the user's own protection; they never widen the GLOBAL operator
--   cap (086) — reserve_ai_spend still bounds total provider spend independently.
--
-- Depends on: 078 (ai_usage_events), 002 (system_config), 057 (account_is_active),
--   auth.users. Re-runnable (create-if-not-exists + create-or-replace + on-conflict).
-- @rollback: drop function public.surveyor_usage_precheck(uuid, text, text); drop function public.surveyor_price_estimates(); drop function public.surveyor_settings_set(jsonb); drop function public.surveyor_settings_get(); drop table public.surveyor_user_settings; delete from public.system_config where key = 'surveyor_price_estimates';
-- ────────────────────────────────────────────────────────────────────────────

-- ── 1. the per-user settings row (model prefs + governors) ──────────────────────
create table if not exists public.surveyor_user_settings (
  user_id          uuid primary key references auth.users(id) on delete cascade,
  provider         text not null default 'anthropic',
  model_prefs      jsonb not null default '{}'::jsonb,   -- { "<task-class>": "<model id>" } user override per task
  daily_token_cap  bigint,                               -- null = uncapped (tokens/UTC-day)
  weekly_token_cap bigint,                               -- null = uncapped (tokens/rolling-week)
  daily_usd_cap    numeric(12,4),                        -- null = uncapped (est-$/UTC-day)
  weekly_usd_cap   numeric(12,4),                        -- null = uncapped (est-$/rolling-week)
  per_task_caps    jsonb not null default '{}'::jsonb,   -- { "<task-class>": { daily_tokens, weekly_tokens } }
  warn_pct         integer not null default 80 check (warn_pct between 1 and 100),
  paused           boolean not null default false,       -- the hard stop (§3d graceful refusal at the edge)
  updated_at       timestamptz not null default now()
);

alter table public.surveyor_user_settings enable row level security;

comment on table public.surveyor_user_settings is
  'Per-user Surveyor governors (#29): model preference per task class, daily/weekly token & est-$ caps, per-task caps, warn threshold, pause. Owner-read; writes via surveyor_settings_set(); enforced at the edge by surveyor_usage_precheck(). The user''s own wallet protection — never widens the global operator cap.';

drop policy if exists "Owner reads own surveyor settings" on public.surveyor_user_settings;
create policy "Owner reads own surveyor settings" on public.surveyor_user_settings
  for select using (auth.uid() = user_id);

-- ── 2. the maintained price-ESTIMATE table (single source for all $ estimates) ──
-- USD per MILLION tokens, per provider/model. ESTIMATES ONLY (no provider exposes a
-- balance API). 'default' is the fallback bucket for an unlisted model. The operator
-- maintains this like ai_spend_cap / ai_credit_costs; the nightly pricing resync may
-- later keep it fresh. Seeded idempotently (only when absent — never clobber operator edits).
insert into public.system_config (key, value)
values (
  'surveyor_price_estimates',
  '{
     "_note": "USD per 1e6 tokens. ESTIMATE ONLY — providers expose no balance API. The provider console is the source of truth.",
     "anthropic": {
       "default":            {"in": 5,  "out": 25},
       "claude-opus-4-8":    {"in": 5,  "out": 25},
       "claude-sonnet-4-5":  {"in": 3,  "out": 15},
       "claude-haiku-4-5":   {"in": 1,  "out": 5}
     },
     "openai": {
       "default":            {"in": 5,  "out": 15}
     }
   }'::jsonb
)
on conflict (key) do nothing;

-- surveyor_price_estimates() — the client dashboard + $-cap UI read the SAME table
-- the precheck enforces against, so displayed estimates never drift from enforced ones.
create or replace function public.surveyor_price_estimates()
returns jsonb
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare v jsonb;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  select value into v from public.system_config where key = 'surveyor_price_estimates';
  return coalesce(v, '{}'::jsonb);
end;
$$;
revoke all on function public.surveyor_price_estimates() from public;
grant execute on function public.surveyor_price_estimates() to authenticated;

comment on function public.surveyor_price_estimates is
  'The maintained per-model $/Mtok ESTIMATE table (labelled estimate — providers expose no balance API). Read by the usage dashboard + the $-cap governor so display and enforcement share one source.';

-- ── 3. surveyor_settings_get() — the settings surface reads the user's own row ──
create or replace function public.surveyor_settings_get()
returns public.surveyor_user_settings
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare v_uid uuid; v_row public.surveyor_user_settings;
begin
  v_uid := auth.uid();
  if v_uid is null then raise exception 'not authenticated'; end if;
  select * into v_row from public.surveyor_user_settings where user_id = v_uid;
  if not found then
    -- Defaults (no row yet): uncapped, unpaused, warn at 80%.
    v_row.user_id := v_uid;
    v_row.provider := 'anthropic';
    v_row.model_prefs := '{}'::jsonb;
    v_row.per_task_caps := '{}'::jsonb;
    v_row.warn_pct := 80;
    v_row.paused := false;
    v_row.updated_at := now();
  end if;
  return v_row;
end;
$$;
revoke all on function public.surveyor_settings_get() from public;
grant execute on function public.surveyor_settings_get() to authenticated;

-- ── 4. surveyor_settings_set() — validated/clamped upsert of the user's own row ─
-- Takes a jsonb patch (only the supplied keys change). Non-positive caps → null
-- (uncapped); the PAUSE switch is the explicit hard-stop, never a 0 cap. warn_pct
-- clamped 1..100. model_prefs / per_task_caps must be objects (else ignored).
create or replace function public.surveyor_settings_set(p_patch jsonb)
returns public.surveyor_user_settings
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid;
  v_row public.surveyor_user_settings;
  v_has boolean;
begin
  v_uid := auth.uid();
  if v_uid is null then raise exception 'not authenticated'; end if;
  if not public.account_is_active(v_uid) then raise exception 'account is not active'; end if;
  if p_patch is null or jsonb_typeof(p_patch) <> 'object' then
    raise exception 'settings patch must be a json object';
  end if;

  -- Seed from the existing row (or defaults) then apply the patch key-by-key.
  select * into v_row from public.surveyor_user_settings where user_id = v_uid;
  v_has := found;
  if not v_has then
    v_row.user_id := v_uid; v_row.provider := 'anthropic';
    v_row.model_prefs := '{}'::jsonb; v_row.per_task_caps := '{}'::jsonb;
    v_row.warn_pct := 80; v_row.paused := false;
  end if;

  if p_patch ? 'provider' then
    v_row.provider := coalesce(nullif(btrim(p_patch ->> 'provider'), ''), 'anthropic');
  end if;
  if p_patch ? 'model_prefs' and jsonb_typeof(p_patch -> 'model_prefs') = 'object' then
    v_row.model_prefs := p_patch -> 'model_prefs';
  end if;
  if p_patch ? 'per_task_caps' and jsonb_typeof(p_patch -> 'per_task_caps') = 'object' then
    v_row.per_task_caps := p_patch -> 'per_task_caps';
  end if;
  if p_patch ? 'daily_token_cap' then
    v_row.daily_token_cap := nullif(greatest((p_patch ->> 'daily_token_cap')::bigint, 0), 0);
  end if;
  if p_patch ? 'weekly_token_cap' then
    v_row.weekly_token_cap := nullif(greatest((p_patch ->> 'weekly_token_cap')::bigint, 0), 0);
  end if;
  if p_patch ? 'daily_usd_cap' then
    v_row.daily_usd_cap := nullif(greatest((p_patch ->> 'daily_usd_cap')::numeric, 0), 0);
  end if;
  if p_patch ? 'weekly_usd_cap' then
    v_row.weekly_usd_cap := nullif(greatest((p_patch ->> 'weekly_usd_cap')::numeric, 0), 0);
  end if;
  if p_patch ? 'warn_pct' then
    v_row.warn_pct := least(greatest((p_patch ->> 'warn_pct')::integer, 1), 100);
  end if;
  if p_patch ? 'paused' then
    v_row.paused := (p_patch ->> 'paused')::boolean;
  end if;
  v_row.updated_at := now();

  insert into public.surveyor_user_settings as s
    (user_id, provider, model_prefs, daily_token_cap, weekly_token_cap, daily_usd_cap, weekly_usd_cap, per_task_caps, warn_pct, paused, updated_at)
  values
    (v_uid, v_row.provider, v_row.model_prefs, v_row.daily_token_cap, v_row.weekly_token_cap, v_row.daily_usd_cap, v_row.weekly_usd_cap, v_row.per_task_caps, v_row.warn_pct, v_row.paused, v_row.updated_at)
  on conflict (user_id) do update set
    provider = excluded.provider, model_prefs = excluded.model_prefs,
    daily_token_cap = excluded.daily_token_cap, weekly_token_cap = excluded.weekly_token_cap,
    daily_usd_cap = excluded.daily_usd_cap, weekly_usd_cap = excluded.weekly_usd_cap,
    per_task_caps = excluded.per_task_caps, warn_pct = excluded.warn_pct,
    paused = excluded.paused, updated_at = excluded.updated_at
  returning * into v_row;
  return v_row;
end;
$$;
revoke all on function public.surveyor_settings_set(jsonb) from public;
grant execute on function public.surveyor_settings_set(jsonb) to authenticated;

comment on function public.surveyor_settings_set is
  'Validated upsert of the caller''s OWN Surveyor governors (patch-merge). Non-positive caps ⇒ uncapped; pause is the hard stop; warn_pct clamped 1..100.';

-- ── 5. surveyor_usage_precheck() — the SINGLE edge enforcement door ─────────────
-- SERVICE-ROLE ONLY. Before the analyst spends, the edge calls this with the caller
-- + task feature. It sums the user's windowed token counts (from ai_usage_events)
-- and estimated $ (from the price table) for the UTC day + rolling 7-day window,
-- globally and for this task class, compares against the stored caps, and returns:
--   allowed (not paused AND no configured cap already met),
--   paused, warn (any window ≥ warn_pct% of its cap), reason_class + breached window.
-- Enforcement reads the STORED row (never a client value). Fails OPEN on a missing
-- settings row (uncapped by default); the GLOBAL cap (086) still bounds total spend.
create or replace function public.surveyor_usage_precheck(
  p_user uuid, p_provider text default 'anthropic', p_feature text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_s            public.surveyor_user_settings;
  v_prices       jsonb;
  v_pp           jsonb;   -- provider price map
  v_day_start    timestamptz;
  v_week_start   timestamptz;
  v_dtok bigint; v_wtok bigint; v_dusd numeric; v_wusd numeric;
  v_task_dtok bigint; v_task_wtok bigint;
  v_task_caps    jsonb;
  v_allowed boolean := true;
  v_reason text := 'none';
  v_breached text := null;
  v_warn boolean := false;
  v_paused boolean := false;
begin
  if p_user is null then
    return jsonb_build_object('allowed', true, 'paused', false, 'warn', false, 'reason_class', 'none');
  end if;
  set local time zone 'UTC';
  v_day_start  := date_trunc('day', now());
  v_week_start := now() - interval '7 days';

  select * into v_s from public.surveyor_user_settings where user_id = p_user;
  if not found then
    -- No governors configured ⇒ allow (the global operator cap still applies).
    return jsonb_build_object('allowed', true, 'paused', false, 'warn', false, 'reason_class', 'none',
      'daily_tokens', 0, 'weekly_tokens', 0, 'daily_usd', 0, 'weekly_usd', 0);
  end if;
  v_paused := v_s.paused;

  -- Price map for the provider ($/Mtok), with a 'default' fallback bucket.
  select value into v_prices from public.system_config where key = 'surveyor_price_estimates';
  v_pp := coalesce(v_prices -> coalesce(nullif(btrim(p_provider), ''), 'anthropic'), '{}'::jsonb);

  -- Windowed token sums (global).
  select coalesce(sum(input_tokens + output_tokens), 0) into v_dtok
    from public.ai_usage_events where user_id = p_user and created_at >= v_day_start;
  select coalesce(sum(input_tokens + output_tokens), 0) into v_wtok
    from public.ai_usage_events where user_id = p_user and created_at >= v_week_start;

  -- Windowed estimated-$ sums (tokens × the maintained price table).
  select coalesce(sum(
      (input_tokens::numeric  / 1000000) * coalesce((v_pp -> model ->> 'in')::numeric,  (v_pp -> 'default' ->> 'in')::numeric,  0)
    + (output_tokens::numeric / 1000000) * coalesce((v_pp -> model ->> 'out')::numeric, (v_pp -> 'default' ->> 'out')::numeric, 0)
    ), 0) into v_dusd
    from public.ai_usage_events where user_id = p_user and created_at >= v_day_start;
  select coalesce(sum(
      (input_tokens::numeric  / 1000000) * coalesce((v_pp -> model ->> 'in')::numeric,  (v_pp -> 'default' ->> 'in')::numeric,  0)
    + (output_tokens::numeric / 1000000) * coalesce((v_pp -> model ->> 'out')::numeric, (v_pp -> 'default' ->> 'out')::numeric, 0)
    ), 0) into v_wusd
    from public.ai_usage_events where user_id = p_user and created_at >= v_week_start;

  -- Per-task token sums (only needed when a per-task cap exists for this feature).
  v_task_caps := v_s.per_task_caps -> coalesce(p_feature, '');
  if v_task_caps is not null and jsonb_typeof(v_task_caps) = 'object' then
    select coalesce(sum(input_tokens + output_tokens), 0) into v_task_dtok
      from public.ai_usage_events where user_id = p_user and feature = p_feature and created_at >= v_day_start;
    select coalesce(sum(input_tokens + output_tokens), 0) into v_task_wtok
      from public.ai_usage_events where user_id = p_user and feature = p_feature and created_at >= v_week_start;
  end if;

  -- Evaluate breaches (paused wins; else the first breached window sets reason).
  if v_paused then
    v_allowed := false; v_reason := 'paused'; v_breached := 'paused';
  else
    if v_s.daily_token_cap is not null and v_dtok >= v_s.daily_token_cap then
      v_allowed := false; v_breached := 'daily_tokens';
    elsif v_s.weekly_token_cap is not null and v_wtok >= v_s.weekly_token_cap then
      v_allowed := false; v_breached := 'weekly_tokens';
    elsif v_s.daily_usd_cap is not null and v_dusd >= v_s.daily_usd_cap then
      v_allowed := false; v_breached := 'daily_usd';
    elsif v_s.weekly_usd_cap is not null and v_wusd >= v_s.weekly_usd_cap then
      v_allowed := false; v_breached := 'weekly_usd';
    elsif v_task_caps is not null and (v_task_caps ->> 'daily_tokens') is not null
          and v_task_dtok >= (v_task_caps ->> 'daily_tokens')::bigint then
      v_allowed := false; v_breached := 'task_daily_tokens';
    elsif v_task_caps is not null and (v_task_caps ->> 'weekly_tokens') is not null
          and v_task_wtok >= (v_task_caps ->> 'weekly_tokens')::bigint then
      v_allowed := false; v_breached := 'task_weekly_tokens';
    end if;
    if not v_allowed then v_reason := 'cap'; end if;
  end if;

  -- Warn: any capped window at/above warn_pct% of its cap (only meaningful when allowed).
  if v_allowed then
    v_warn :=
      (v_s.daily_token_cap  is not null and v_dtok * 100 >= v_s.daily_token_cap  * v_s.warn_pct) or
      (v_s.weekly_token_cap is not null and v_wtok * 100 >= v_s.weekly_token_cap * v_s.warn_pct) or
      (v_s.daily_usd_cap    is not null and v_dusd * 100 >= v_s.daily_usd_cap    * v_s.warn_pct) or
      (v_s.weekly_usd_cap   is not null and v_wusd * 100 >= v_s.weekly_usd_cap   * v_s.warn_pct);
  end if;

  return jsonb_build_object(
    'allowed', v_allowed, 'paused', v_paused, 'warn', v_warn,
    'reason_class', v_reason, 'breached', v_breached,
    'daily_tokens', v_dtok, 'weekly_tokens', v_wtok,
    'daily_usd', round(v_dusd, 4), 'weekly_usd', round(v_wusd, 4),
    'caps', jsonb_build_object(
      'daily_token_cap', v_s.daily_token_cap, 'weekly_token_cap', v_s.weekly_token_cap,
      'daily_usd_cap', v_s.daily_usd_cap, 'weekly_usd_cap', v_s.weekly_usd_cap,
      'warn_pct', v_s.warn_pct)
  );
end;
$$;
revoke all on function public.surveyor_usage_precheck(uuid, text, text) from public;
grant execute on function public.surveyor_usage_precheck(uuid, text, text) to service_role;

comment on function public.surveyor_usage_precheck is
  'SERVICE-ROLE ONLY: the single edge door for the user''s usage governors. Sums windowed tokens + est-$ from ai_usage_events, compares to the stored caps, and returns {allowed, paused, warn, reason_class}. Over-cap/paused ⇒ the edge refuses gracefully and spends nothing.';
