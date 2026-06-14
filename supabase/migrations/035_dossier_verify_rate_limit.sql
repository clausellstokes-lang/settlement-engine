-- ────────────────────────────────────────────────────────────────────────────
-- 035_dossier_verify_rate_limit.sql — per-IP rate limit for the public
-- single-dossier purchase verification endpoint.
--
-- Why this exists (audit #6): supabase/functions/verify-single-dossier is
-- unauthenticated and, before this, unthrottled — it validated request shape
-- (session-id charset + length, checkout-token length) but then called Stripe's
-- API on every well-formed request. An attacker holding a valid checkout_token
-- can only confirm a purchase they already own, so this is NOT a data-exposure
-- hole, but the unthrottled Stripe call is a cost-amplification / rate-limit-
-- burning vector. This adds a real fixed-window per-IP limit, mirroring the
-- proven email limiter (migration 034). The endpoint calls
-- consume_dossier_verify_rate_limit through its service-role admin client and
-- FAILS OPEN (proceeds) if the limiter is unavailable — a limiter outage must
-- never block a legitimate buyer from confirming their purchase.
--
-- Re-runnable: create-if-not-exists / create-or-replace throughout.
-- ────────────────────────────────────────────────────────────────────────────

-- ── Counter table ──────────────────────────────────────────────────────────
-- One row per (ip, fixed window). Self-bounding per window; the cleanup
-- function below reclaims space once a window has rolled over.
create table if not exists public.dossier_verify_rate_limits (
  ip_key       text        not null,
  window_start timestamptz not null,
  count        integer     not null default 0,
  primary key (ip_key, window_start)
);

alter table public.dossier_verify_rate_limits enable row level security;
-- No policies: the table is reached ONLY via the SECURITY DEFINER RPC below
-- (service-role). RLS-on + no-policy denies all direct anon/authenticated access.

create index if not exists dossier_verify_rate_limits_window_start_idx
  on public.dossier_verify_rate_limits (window_start);

-- ── Atomic consume-and-check ───────────────────────────────────────────────
-- Increments the per-IP counter for the current window and returns whether the
-- caller is still under the limit. Counting happens on EVERY attempt (not just
-- verified purchases), so a caller that blows past the limit stays blocked for
-- the rest of the window. The upsert is a single statement and takes a row
-- lock, so two concurrent callers can't race past the limit (no TOCTOU).
--
-- Defaults: 1-hour window, 30 attempts per IP. A real buyer verifies once (a
-- couple of retries at most); 30/hour leaves generous headroom while making the
-- endpoint useless as a Stripe-call amplifier.
create or replace function public.consume_dossier_verify_rate_limit(
  p_ip             text,
  p_window_seconds integer default 3600,
  p_ip_limit       integer default 30
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_window   timestamptz;
  v_ip_key   text;
  v_ip_count integer;
begin
  -- Guard against nonsense parameters that would disable the limit.
  if p_window_seconds is null or p_window_seconds < 1 then
    p_window_seconds := 3600;
  end if;

  v_window := to_timestamp(
    floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds
  );

  -- Normalize the IP so trivial variants don't dodge the counter. Falls back to
  -- the same sentinel send-email uses when no forwarded IP is present.
  v_ip_key := coalesce(nullif(btrim(p_ip), ''), '0.0.0.0');

  insert into public.dossier_verify_rate_limits as drl (ip_key, window_start, count)
  values (v_ip_key, v_window, 1)
  on conflict (ip_key, window_start)
    do update set count = drl.count + 1
  returning drl.count into v_ip_count;

  return jsonb_build_object(
    'allowed',        (v_ip_count <= p_ip_limit),
    'ip_count',       v_ip_count,
    'ip_limit',       p_ip_limit,
    'window_start',   v_window,
    'window_seconds', p_window_seconds
  );
end;
$$;

-- Service-role only: verify-single-dossier calls this through its admin client.
revoke all on function public.consume_dossier_verify_rate_limit(text, integer, integer) from public;
grant execute on function public.consume_dossier_verify_rate_limit(text, integer, integer) to service_role;

-- ── Stale-row cleanup ──────────────────────────────────────────────────────
create or replace function public.cleanup_dossier_verify_rate_limits(
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
  delete from public.dossier_verify_rate_limits
    where window_start < now() - make_interval(secs => p_retention_seconds);
  get diagnostics v_deleted = row_count;
  return v_deleted;
end;
$$;

revoke all on function public.cleanup_dossier_verify_rate_limits(integer) from public;
grant execute on function public.cleanup_dossier_verify_rate_limits(integer) to service_role;

-- Schedule the purge (defensive pg_cron install, mirroring 034). The table is
-- self-bounding per window even without this; cleanup just reclaims space.
do $$
begin
  execute 'create extension if not exists pg_cron with schema extensions';
exception
  when insufficient_privilege then
    raise notice 'pg_cron extension could not be installed; schedule cleanup_dossier_verify_rate_limits manually';
end;
$$;

do $$
declare existing_job bigint;
begin
  select jobid into existing_job from cron.job where jobname = 'cleanup-dossier-verify-rate-limits';
  if existing_job is not null then perform cron.unschedule(existing_job); end if;
  perform cron.schedule(
    'cleanup-dossier-verify-rate-limits',
    '41 4 * * *',
    $job$select public.cleanup_dossier_verify_rate_limits();$job$
  );
exception
  when undefined_table or invalid_schema_name or insufficient_privilege then
    raise notice 'pg_cron unavailable; schedule cleanup_dossier_verify_rate_limits manually';
end;
$$;
