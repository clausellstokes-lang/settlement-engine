-- ────────────────────────────────────────────────────────────────────────────
-- 086_ai_spend_reservation.sql — make the hard spend cap RACE-SAFE.
--
-- THE BUG THIS CLOSES
--   check_ai_spend_cap (079) sums COMMITTED COGS from ai_usage_events and
--   compares it to the cap. But the edge function checks the cap BEFORE the
--   model calls, and the COGS row is only written AFTER the stream finishes
--   (persistAiUsageEvents, in the stream's `finally`). So N concurrent
--   generations all read the SAME pre-run total, all see headroom, and
--   collectively blow past the global daily / monthly USD cap — the exact
--   "unbounded provider bill" the cap exists to prevent.
--
-- THE FIX — RESERVATION (two-phase) ACCOUNTING
--   Before the model calls, a generation RESERVES its estimated cost in one
--   atomic statement: the window sum it checks against the cap is
--     committed COGS (ai_usage_events)  +  OUTSTANDING reservations
--   so two concurrent runs can't both pass when the second would cross the cap.
--   The reservation is inserted in the SAME `insert … select … where (sum <
--   cap)` statement that decides admission, so the read and the write can't be
--   split by another transaction.
--
--   After the stream finishes, the edge function RELEASES the reservation (the
--   real COGS row in ai_usage_events is now the source of truth, so the
--   reservation's headroom hold is no longer needed). A crashed / abandoned run
--   does NOT leak headroom forever: reservations carry an `expires_at` and the
--   sum only counts NON-EXPIRED rows, with a pg_cron purge mirroring 079.
--
--   Net effect: at any instant the cap sees committed-spend + in-flight-estimate,
--   never just the stale committed total. Fails CLOSED exactly like 079 — a
--   reservation that would cross the cap returns allowed=false and inserts
--   nothing; an RPC error is blocked by the edge caller.
--
-- Re-runnable: create-if-not-exists / create-or-replace / drop-if-exists.
-- Depends on: 002 (system_config), 078 (ai_usage_events), 079 (ai_spend_cap cfg).
-- ────────────────────────────────────────────────────────────────────────────

-- ── Outstanding-reservation ledger ─────────────────────────────────────────
-- One short-lived row per in-flight generation, holding its ESTIMATED cost
-- against the cap until the real COGS row lands (or the row expires). RLS ON
-- with no policy: reached ONLY via the SECURITY DEFINER RPCs below
-- (service-role), mirroring 078/079 — a user can never forge or release a
-- reservation.
create table if not exists public.ai_spend_reservations (
  id           uuid        primary key default gen_random_uuid(),
  user_id      uuid        not null,
  estimate_usd numeric(12, 6) not null default 0,
  created_at   timestamptz not null default now(),
  -- A reservation only holds headroom until it expires; a crashed run that
  -- never releases its row stops counting against the cap after this instant.
  -- Generous enough (default 10 min) to cover the slowest multi-call stream.
  expires_at   timestamptz not null default now() + interval '10 minutes'
);

-- Window rollups: the reservation sum filters on (expires_at, created_at).
create index if not exists ai_spend_reservations_expires_idx
  on public.ai_spend_reservations (expires_at);
create index if not exists ai_spend_reservations_created_idx
  on public.ai_spend_reservations (created_at);

alter table public.ai_spend_reservations enable row level security;
-- No policies ON PURPOSE: writes + reads are service_role only (the edge
-- function's admin client), exactly like ai_usage_events' write path.

comment on table public.ai_spend_reservations is
  'In-flight AI spend reservations: one short-lived row per generation holding its estimated COGS against the global cap until the real ai_usage_events row lands or the row expires. RLS-on, no policy: service_role only.';

-- ── ATOMIC RESERVE — fail-closed, race-safe admission ───────────────────────
-- In ONE statement, sums committed COGS (current UTC day + month) PLUS
-- outstanding non-expired reservations, and inserts a NEW reservation ONLY if
-- BOTH the prospective daily and monthly totals (existing + this estimate) stay
-- under their caps. Because the admission test lives in the INSERT … SELECT …
-- WHERE, two concurrent calls cannot both read the same headroom and both pass:
-- the second sees the first's just-inserted reservation row (or is serialized
-- behind it) and is rejected when it would cross the cap.
--
-- Returns the same shape as check_ai_spend_cap PLUS `reservation_id` (the id to
-- release later, or null when blocked). When the operator kill-switch is off
-- (enabled:false) it allows WITHOUT inserting a reservation — an uncapped window
-- needs no accounting. SECURITY DEFINER + service-role-only.
create or replace function public.reserve_ai_spend(p_user uuid, p_estimate numeric)
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
  v_estimate     numeric;
  v_res_id       uuid;
  v_daily_spend  numeric;
  v_month_spend  numeric;
  v_allowed      boolean;
begin
  -- Pin the daily/monthly cap windows to UTC regardless of the session timezone.
  -- The admission + reporting sums below all use date_trunc('day'|'month', now());
  -- without this they would truncate in the SESSION tz, silently shifting the cap
  -- window off the documented UTC boundary. SET LOCAL scopes this to the call.
  set local time zone 'UTC';

  -- A negative / null / non-numeric estimate must never CREDIT headroom; clamp
  -- to zero so a bad caller can't widen the cap, only consume against it.
  v_estimate := greatest(coalesce(p_estimate, 0), 0);

  select value into v_cfg from public.system_config where key = 'ai_spend_cap';
  -- Missing config ⇒ conservative defaults (fail toward protection), matching 079.
  v_enabled     := coalesce((v_cfg ->> 'enabled')::boolean, true);
  v_daily_cap   := coalesce((v_cfg ->> 'daily_usd')::numeric, 50);
  v_monthly_cap := coalesce((v_cfg ->> 'monthly_usd')::numeric, 750);

  if not v_enabled then
    -- Operator explicitly disabled the cap: allow, hold no reservation.
    select coalesce(sum(estimated_cost_usd), 0) into v_daily_spend
      from public.ai_usage_events where created_at >= date_trunc('day', now());
    select coalesce(sum(estimated_cost_usd), 0) into v_month_spend
      from public.ai_usage_events where created_at >= date_trunc('month', now());
    return jsonb_build_object(
      'allowed', true, 'enabled', false, 'reservation_id', null,
      'daily_spend', round(v_daily_spend, 6),  'daily_cap', v_daily_cap,
      'monthly_spend', round(v_month_spend, 6), 'monthly_cap', v_monthly_cap
    );
  end if;

  -- SERIALIZE admission against the GLOBAL cap. The INSERT...SELECT...WHERE below
  -- is NOT atomic on its own under READ COMMITTED: two concurrent calls each read a
  -- snapshot that excludes the other's uncommitted reservation row, so both can see
  -- the same headroom and both insert, overshooting the cap (the exact race this
  -- migration exists to close). A transaction-scoped advisory lock on the cap key
  -- forces concurrent reservers to serialize — the second blocks until the first
  -- COMMITs and then sees its reservation in the sums below. Released automatically
  -- at transaction end. Taken AFTER the disabled-cap early-return above, so an
  -- operator who turned the cap OFF never serializes on it.
  perform pg_advisory_xact_lock(hashtext('ai_spend_cap')::bigint);

  -- Admission (serialized by the advisory lock above): the WHERE compares
  -- (committed + outstanding + estimate) against BOTH caps in the same statement
  -- that inserts the reservation. If it would cross either cap, the SELECT yields
  -- no row and nothing is inserted. The lock guarantees the outstanding-reservation
  -- sum a concurrent caller reads already includes any just-committed reservation.
  insert into public.ai_spend_reservations (user_id, estimate_usd)
  select p_user, v_estimate
  where (
    -- prospective DAILY total stays under the daily cap
    coalesce((
      select sum(estimated_cost_usd) from public.ai_usage_events
       where created_at >= date_trunc('day', now())
    ), 0)
    + coalesce((
      select sum(estimate_usd) from public.ai_spend_reservations
       where created_at >= date_trunc('day', now()) and expires_at > now()
    ), 0)
    + v_estimate
  ) < v_daily_cap
  and (
    -- prospective MONTHLY total stays under the monthly cap
    coalesce((
      select sum(estimated_cost_usd) from public.ai_usage_events
       where created_at >= date_trunc('month', now())
    ), 0)
    + coalesce((
      select sum(estimate_usd) from public.ai_spend_reservations
       where created_at >= date_trunc('month', now()) and expires_at > now()
    ), 0)
    + v_estimate
  ) < v_monthly_cap
  returning id into v_res_id;

  v_allowed := v_res_id is not null;

  -- Report the post-reservation totals (committed + outstanding) so callers /
  -- dashboards see the true in-flight picture, not the stale committed sum.
  select coalesce((
      select sum(estimated_cost_usd) from public.ai_usage_events
       where created_at >= date_trunc('day', now())
    ), 0)
    + coalesce((
      select sum(estimate_usd) from public.ai_spend_reservations
       where created_at >= date_trunc('day', now()) and expires_at > now()
    ), 0)
  into v_daily_spend;
  select coalesce((
      select sum(estimated_cost_usd) from public.ai_usage_events
       where created_at >= date_trunc('month', now())
    ), 0)
    + coalesce((
      select sum(estimate_usd) from public.ai_spend_reservations
       where created_at >= date_trunc('month', now()) and expires_at > now()
    ), 0)
  into v_month_spend;

  return jsonb_build_object(
    'allowed',        v_allowed,
    'enabled',        true,
    'reservation_id', v_res_id,
    'daily_spend',    round(v_daily_spend, 6),
    'daily_cap',      v_daily_cap,
    'monthly_spend',  round(v_month_spend, 6),
    'monthly_cap',    v_monthly_cap
  );
end;
$$;

revoke all on function public.reserve_ai_spend(uuid, numeric) from public;
grant execute on function public.reserve_ai_spend(uuid, numeric) to service_role;

-- ── RELEASE — settle a reservation once the real COGS row exists ────────────
-- Called from the edge function's `finally` AFTER persistAiUsageEvents writes
-- the actual ai_usage_events row(s). At that point the committed COGS is the
-- source of truth, so the reservation's headroom hold is redundant and is
-- deleted. Idempotent + null-safe: a missing / already-released / null id is a
-- no-op (returns false), so a double-release or a release after expiry-purge
-- never errors and never fails the user's already-streamed result.
create or replace function public.release_ai_spend_reservation(p_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_deleted integer := 0;
begin
  if p_id is null then return false; end if;
  delete from public.ai_spend_reservations where id = p_id;
  get diagnostics v_deleted = row_count;
  return v_deleted > 0;
end;
$$;

revoke all on function public.release_ai_spend_reservation(uuid) from public;
grant execute on function public.release_ai_spend_reservation(uuid) to service_role;

-- ── Expired-reservation cleanup (mirrors 079's limiter purge) ───────────────
-- A crashed / abandoned run leaks a reservation row; the sum already ignores
-- expired rows, but this purge keeps the table from growing unbounded.
create or replace function public.cleanup_ai_spend_reservations(
  p_retention_seconds integer default 86400
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
    p_retention_seconds := 86400;
  end if;
  -- Delete rows whose hold already lapsed AND are old enough that no in-flight
  -- run could still be holding them.
  delete from public.ai_spend_reservations
    where expires_at < now() - make_interval(secs => p_retention_seconds);
  get diagnostics v_deleted = row_count;
  return v_deleted;
end;
$$;

revoke all on function public.cleanup_ai_spend_reservations(integer) from public;
grant execute on function public.cleanup_ai_spend_reservations(integer) to service_role;

-- Schedule the purge (defensive pg_cron install, mirroring 079).
do $$
begin
  execute 'create extension if not exists pg_cron with schema extensions';
exception
  when insufficient_privilege then
    raise notice 'pg_cron extension could not be installed; schedule cleanup_ai_spend_reservations manually';
end;
$$;

do $$
declare existing_job bigint;
begin
  select jobid into existing_job from cron.job where jobname = 'cleanup-ai-spend-reservations';
  if existing_job is not null then perform cron.unschedule(existing_job); end if;
  perform cron.schedule(
    'cleanup-ai-spend-reservations',
    '53 4 * * *',
    $job$select public.cleanup_ai_spend_reservations();$job$
  );
exception
  when undefined_table or invalid_schema_name or insufficient_privilege then
    raise notice 'pg_cron unavailable; schedule cleanup_ai_spend_reservations manually';
end;
$$;
