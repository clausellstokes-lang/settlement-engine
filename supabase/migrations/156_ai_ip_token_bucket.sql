-- ────────────────────────────────────────────────────────────────────────────
-- 156_ai_ip_token_bucket.sql — a CROSS-INSTANCE, smooth-refill token bucket, and
-- the PER-IP burst dimension it powers for the AI-generation edge functions.
--
-- WHY (Wave-D perimeter hardening, item 2). The 11 AI edge functions meter spend
-- with `consume_ai_generate_rate_limit` (079/087): a per-USER daily counter that
-- is deliberately FAIL-OPEN (a limiter outage must never block a paying user —
-- 079 §2). That leaves TWO gaps on the managed-credit cost path:
--   1. NO IP DIMENSION. A single actor rotating/creating accounts, or a small pool
--      of accounts behind one origin, can drive provider COGS with each account
--      still under its own per-user ceiling.
--   2. The per-user limiter's fail-OPEN posture is right for pool-fairness but
--      wrong for COST: an unbounded provider bill is the catastrophic mode. The
--      HARD SPEND CAP (check_ai_spend_cap, 079 §1) already fails CLOSED for exactly
--      this reason. The per-IP burst gate joins it on the fail-CLOSED side.
--
-- This migration adds the SUBSTRATE (a genuine token bucket, cross-instance, so it
-- replaces the per-instance in-memory backstops the anon money paths use). The
-- edge wiring (supabase/functions/_shared/rateLimit.ts → checkAiIpRate, called by
-- the 11 functions) treats a definite over-limit as 429 and a limiter-infra ERROR
-- as a 503 DENY (fail-closed — never silently open). See docs/PERIMETER_RUNBOOK.md.
--
-- WRITTEN, NOT DEPLOYED. Like every migration on this branch it rides the owner's
-- deploy batch. ORDERING NOTE: this migration MUST be applied WITH or BEFORE the
-- edge-function deploy that calls `consume_token_bucket` — the edge helper fails
-- CLOSED on a missing RPC (by design), so deploying the functions ahead of this
-- migration would 503 the AI path until it lands. `supabase db push` before
-- `supabase functions deploy` (the standard order) satisfies this.
--
-- A genuine token bucket (not a fixed window): tokens refill continuously at
-- `refill_per_sec`, capped at `capacity`, so a burst is bounded by the capacity
-- and the sustained rate by the refill — smoother than the fixed-window straddle
-- of `ingest_check_rate` (036). Atomic per key via `SELECT … FOR UPDATE`, so
-- concurrent callers on the same bucket serialize and cannot race past the cap.
--
-- Re-runnable: create-if-not-exists / create-or-replace / on-conflict throughout.
-- Depends on: nothing beyond a stock Postgres (+ pg_cron for the optional purge).
-- ────────────────────────────────────────────────────────────────────────────

-- ── Bucket table ────────────────────────────────────────────────────────────
-- One row per bucket key. `tokens` is the current fill; `updated_at` anchors the
-- continuous refill. RLS-on + no-policy: reached ONLY through the SECURITY DEFINER
-- RPC below (service-role), never by anon/authenticated directly.
create table if not exists public.token_buckets (
  bucket_key text        not null primary key,
  tokens     double precision not null,
  updated_at timestamptz not null default now()
);

alter table public.token_buckets enable row level security;
-- No policies: the raw counters are private to the RPC.

create index if not exists token_buckets_updated_at_idx
  on public.token_buckets (updated_at);

-- ── consume_token_bucket — atomic refill-then-consume ───────────────────────
-- Refills the bucket by the time elapsed since `updated_at` (capped at capacity),
-- then consumes `p_cost` if enough tokens remain. Returns { allowed, tokens,
-- capacity }. FAIL-toward-protection on garbage input: params clamp to safe
-- defaults; a null/blank key coalesces to a single shared 'anon' bucket rather
-- than minting an unlimited fresh bucket per blank key.
--
-- The RPC NEVER throws on a normal over-limit — it returns allowed=false. The
-- fail-CLOSED behaviour on INFRASTRUCTURE error lives at the EDGE caller (a
-- thrown/errored RPC → 503 deny), mirroring the spend-cap's posture.
create or replace function public.consume_token_bucket(
  p_key            text,
  p_capacity       double precision,
  p_refill_per_sec double precision,
  p_cost           double precision default 1
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_now       timestamptz := now();
  v_key       text;
  v_capacity  double precision;
  v_refill    double precision;
  v_cost      double precision;
  v_tokens    double precision;
  v_updated   timestamptz;
  v_allowed   boolean;
begin
  -- Clamp params to safe defaults (fail toward protection, never toward "no cap").
  v_capacity := greatest(coalesce(p_capacity, 60), 1);
  v_refill   := greatest(coalesce(p_refill_per_sec, v_capacity / 3600.0), 0);
  v_cost     := least(greatest(coalesce(p_cost, 1), 0), v_capacity);
  v_key      := coalesce(nullif(btrim(p_key), ''), 'anon');

  -- Ensure the bucket exists as a FULL bucket, idempotently. A concurrent first
  -- hit either inserts or no-ops — either way the row exists afterward, and the
  -- FOR UPDATE below serializes the actual refill+consume so neither races past
  -- the cap. Seeding a full bucket means the very first request refills by ~0s
  -- and simply consumes its cost (a fresh caller starts with a full allowance).
  insert into public.token_buckets (bucket_key, tokens, updated_at)
    values (v_key, v_capacity, v_now)
  on conflict (bucket_key) do nothing;

  -- Lock the (now-guaranteed) row so concurrent callers on the same key serialize.
  select tokens, updated_at into v_tokens, v_updated
    from public.token_buckets
   where bucket_key = v_key
   for update;

  -- Refill by elapsed time (capped at capacity), then consume if affordable.
  v_tokens := least(v_capacity, v_tokens + extract(epoch from (v_now - v_updated)) * v_refill);
  if v_tokens >= v_cost then
    v_allowed := true;
    v_tokens  := v_tokens - v_cost;
  else
    v_allowed := false;
  end if;

  update public.token_buckets
     set tokens = v_tokens, updated_at = v_now
   where bucket_key = v_key;

  return jsonb_build_object('allowed', v_allowed, 'tokens', round(v_tokens::numeric, 4), 'capacity', v_capacity);
end;
$$;

revoke all on function public.consume_token_bucket(text, double precision, double precision, double precision) from public;
grant execute on function public.consume_token_bucket(text, double precision, double precision, double precision) to service_role;

comment on function public.consume_token_bucket(text, double precision, double precision, double precision) is
  'Cross-instance smooth-refill token bucket (Wave-D). Atomic refill-then-consume per key; returns { allowed, tokens, capacity }. Never throws on over-limit (allowed=false); the edge caller fails CLOSED on an INFRA error. Backs the AI per-IP burst gate (checkAiIpRate).';

-- ── Operator-tunable per-IP AI burst config (no deploy to retune) ────────────
-- Mirrors 079's `ai_user_rate_limit` config idiom: a PRIVATE key readable only by
-- service_role paths. Capacity = burst allowance; refill_per_sec = sustained rate.
-- Default: 40 burst, refilling 40/hour (~0.0111/s) — generous for a human running
-- AI prep, tight as a bulk-generation vector from one origin. The edge helper
-- reads these when present and falls back to the same numbers if the row is absent.
insert into public.system_config (key, value)
values
  ('ai_ip_rate_limit', '{"capacity": 40, "refill_per_sec": 0.0111}'::jsonb)
on conflict (key) do nothing;

-- ── Stale-bucket cleanup (mirrors 035/079/125) ──────────────────────────────
-- A bucket that has been idle long enough to have fully refilled carries no state,
-- so it is safe to delete (the next hit re-mints a full bucket). Reclaims space.
create or replace function public.cleanup_token_buckets(
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
  delete from public.token_buckets
    where updated_at < now() - make_interval(secs => p_retention_seconds);
  get diagnostics v_deleted = row_count;
  return v_deleted;
end;
$$;

revoke all on function public.cleanup_token_buckets(integer) from public;
grant execute on function public.cleanup_token_buckets(integer) to service_role;

-- Schedule the purge (defensive pg_cron install, mirroring 035/079/125).
do $$
begin
  execute 'create extension if not exists pg_cron with schema extensions';
exception
  when insufficient_privilege then
    raise notice 'pg_cron extension could not be installed; schedule cleanup_token_buckets manually';
end;
$$;

do $$
declare existing_job bigint;
begin
  select jobid into existing_job from cron.job where jobname = 'cleanup-token-buckets';
  if existing_job is not null then perform cron.unschedule(existing_job); end if;
  perform cron.schedule(
    'cleanup-token-buckets',
    '43 4 * * *',
    $job$select public.cleanup_token_buckets();$job$
  );
exception
  when undefined_table or invalid_schema_name or insufficient_privilege then
    raise notice 'pg_cron unavailable; schedule cleanup_token_buckets manually';
end;
$$;
