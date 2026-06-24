-- ────────────────────────────────────────────────────────────────────────────
-- 079_ai_spend_safety.sql — the money-path SAFETY layer for AI provider spend.
--
-- Two independent guards, with DELIBERATELY OPPOSITE failure defaults:
--
--   1. HARD SPEND CAP  (check_ai_spend_cap)  — FAILS CLOSED.
--      A global daily + monthly ceiling on provider COGS (summed from
--      ai_usage_events). This is a KILL-SWITCH, not a budget hint: an unbounded
--      provider bill is the catastrophic failure mode, so if the cap is reached
--      — OR if the check itself errors / returns an unexpected shape — the
--      caller must BLOCK the AI call. Checked BEFORE spend_credits, so a capped
--      window never debits the user (nothing to refund). Caps are read from
--      system_config so an operator can retune them WITHOUT a deploy.
--
--   2. PER-USER RATE LIMIT  (consume_ai_generate_rate_limit)  — FAILS OPEN.
--      A fixed-window per-user counter so one abusive account can't drain the
--      shared provider pool. Mirrors migration 035 exactly (RLS-on/no-policy
--      counter table, SECURITY DEFINER atomic upsert, service-role grant,
--      pg_cron cleanup). A limiter OUTAGE must never block a legitimate paying
--      user — same rationale as 035 — so the EDGE caller treats an RPC error as
--      allowed. (The RPC's own happy path still returns allowed=false past N.)
--
-- The contrast is the whole point: the cap protects US from an unbounded bill
-- (block on doubt); the limiter protects the shared pool from one user (but a
-- limiter outage must not punish everyone).
--
-- Re-runnable: create-if-not-exists / create-or-replace / on-conflict-do-nothing.
-- Depends on: 002 (system_config), 078 (ai_usage_events).
-- ────────────────────────────────────────────────────────────────────────────

-- ── Operator-tunable config rows (no deploy needed to change a cap) ─────────
-- These are PRIVATE keys (not in 058's public allowlist), readable only by the
-- service_role / elevated paths. Defaults are conservative; tune in prod.
insert into public.system_config (key, value)
values
  ('ai_spend_cap',             '{"daily_usd": 50, "monthly_usd": 750, "enabled": true}'::jsonb),
  ('ai_model_preference',      '{"global_default": "anthropic_claude_opus_4_8", "forced_override": null}'::jsonb),
  ('ai_user_rate_limit',       '{"window_seconds": 86400, "per_user_limit": 60}'::jsonb)
on conflict (key) do nothing;

-- ── 1. HARD SPEND CAP — fail-closed kill-switch ────────────────────────────
-- Sums estimated_cost_usd from ai_usage_events over the current UTC day and
-- month, compares against the system_config caps, and returns whether a NEW AI
-- call is allowed. SECURITY DEFINER + service-role-only: the edge function
-- calls it through its admin client before the spend.
--
-- The RPC itself never throws on a hit — it returns allowed=false. The
-- fail-CLOSED behaviour lives at BOTH ends: the RPC defaults `enabled` true and
-- treats a missing/garbled config as "cap active with zero headroom is unsafe →
-- fall back to the conservative defaults", and the EDGE caller blocks on any
-- RPC error or non-true `allowed`.
create or replace function public.check_ai_spend_cap()
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_cfg          jsonb;
  v_enabled      boolean;
  v_daily_cap    numeric;
  v_monthly_cap  numeric;
  v_daily_spend  numeric;
  v_month_spend  numeric;
  v_allowed      boolean;
begin
  select value into v_cfg from public.system_config where key = 'ai_spend_cap';

  -- Missing config ⇒ fall back to the conservative defaults rather than
  -- treating "no config" as "no cap". (Fail toward protection.)
  v_enabled     := coalesce((v_cfg ->> 'enabled')::boolean, true);
  v_daily_cap   := coalesce((v_cfg ->> 'daily_usd')::numeric, 50);
  v_monthly_cap := coalesce((v_cfg ->> 'monthly_usd')::numeric, 750);

  -- Sum REAL recorded COGS in the current UTC day / month. We only count
  -- successful + estimated rows alike (a failed call still cost tokens).
  select coalesce(sum(estimated_cost_usd), 0)
    into v_daily_spend
    from public.ai_usage_events
   where created_at >= date_trunc('day', now());

  select coalesce(sum(estimated_cost_usd), 0)
    into v_month_spend
    from public.ai_usage_events
   where created_at >= date_trunc('month', now());

  if not v_enabled then
    v_allowed := true;        -- operator explicitly disabled the cap
  else
    v_allowed := (v_daily_spend < v_daily_cap) and (v_month_spend < v_monthly_cap);
  end if;

  return jsonb_build_object(
    'allowed',        v_allowed,
    'enabled',        v_enabled,
    'daily_spend',    round(v_daily_spend, 6),
    'daily_cap',      v_daily_cap,
    'monthly_spend',  round(v_month_spend, 6),
    'monthly_cap',    v_monthly_cap
  );
end;
$$;

revoke all on function public.check_ai_spend_cap() from public;
grant execute on function public.check_ai_spend_cap() to service_role;

-- ── 2. PER-USER RATE LIMIT — fail-open, mirrors migration 035 ───────────────
create table if not exists public.ai_generate_rate_limits (
  user_key     text        not null,
  window_start timestamptz not null,
  count        integer     not null default 0,
  primary key (user_key, window_start)
);

alter table public.ai_generate_rate_limits enable row level security;
-- No policies: reached ONLY via the SECURITY DEFINER RPC below (service-role).

create index if not exists ai_generate_rate_limits_window_start_idx
  on public.ai_generate_rate_limits (window_start);

-- Atomic consume-and-check. Counts on EVERY attempt; the single-statement
-- upsert takes a row lock so concurrent calls can't race past the limit.
-- Defaults: 1-day window, 60 generations per user. A heavy DM running a week of
-- prep is well under this; it just makes the endpoint useless as a pool drain.
create or replace function public.consume_ai_generate_rate_limit(
  p_user           uuid,
  p_window_seconds integer default 86400,
  p_user_limit     integer default 60
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_window     timestamptz;
  v_user_key   text;
  v_user_count integer;
begin
  if p_window_seconds is null or p_window_seconds < 1 then
    p_window_seconds := 86400;
  end if;
  if p_user_limit is null or p_user_limit < 1 then
    p_user_limit := 60;
  end if;

  v_window := to_timestamp(
    floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds
  );
  v_user_key := coalesce(nullif(btrim(p_user::text), ''), '00000000-0000-0000-0000-000000000000');

  insert into public.ai_generate_rate_limits as arl (user_key, window_start, count)
  values (v_user_key, v_window, 1)
  on conflict (user_key, window_start)
    do update set count = arl.count + 1
  returning arl.count into v_user_count;

  return jsonb_build_object(
    'allowed',        (v_user_count <= p_user_limit),
    'count',          v_user_count,
    'limit',          p_user_limit,
    'window_start',   v_window,
    'window_seconds', p_window_seconds
  );
end;
$$;

revoke all on function public.consume_ai_generate_rate_limit(uuid, integer, integer) from public;
grant execute on function public.consume_ai_generate_rate_limit(uuid, integer, integer) to service_role;

-- ── Stale-row cleanup (mirrors 035) ─────────────────────────────────────────
create or replace function public.cleanup_ai_generate_rate_limits(
  p_retention_seconds integer default 172800
)
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_deleted integer := 0;
begin
  if p_retention_seconds is null or p_retention_seconds < 1 then
    p_retention_seconds := 172800;
  end if;
  delete from public.ai_generate_rate_limits
    where window_start < now() - make_interval(secs => p_retention_seconds);
  get diagnostics v_deleted = row_count;
  return v_deleted;
end;
$$;

revoke all on function public.cleanup_ai_generate_rate_limits(integer) from public;
grant execute on function public.cleanup_ai_generate_rate_limits(integer) to service_role;

-- Schedule the purge (defensive pg_cron install, mirroring 035).
do $$
begin
  execute 'create extension if not exists pg_cron with schema extensions';
exception
  when insufficient_privilege then
    raise notice 'pg_cron extension could not be installed; schedule cleanup_ai_generate_rate_limits manually';
end;
$$;

do $$
declare existing_job bigint;
begin
  select jobid into existing_job from cron.job where jobname = 'cleanup-ai-generate-rate-limits';
  if existing_job is not null then perform cron.unschedule(existing_job); end if;
  perform cron.schedule(
    'cleanup-ai-generate-rate-limits',
    '47 4 * * *',
    $job$select public.cleanup_ai_generate_rate_limits();$job$
  );
exception
  when undefined_table or invalid_schema_name or insufficient_privilege then
    raise notice 'pg_cron unavailable; schedule cleanup_ai_generate_rate_limits manually';
end;
$$;
