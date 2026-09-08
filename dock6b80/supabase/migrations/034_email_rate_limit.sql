-- 034_email_rate_limit.sql
--
-- Real rate limit for the unauthenticated cap_warning mailer.
--
-- Context (comprehensive code review finding): supabase/functions/send-email
-- accepts an explicit `recipient` for the `cap_warning` template because
-- anonymous visitors who hit the daily generation cap have no auth.uid().
-- Until now the ONLY defense on that path was the per-request botGuard, which
-- blocks obvious bots but does NOT throttle — so a non-bot caller could relay
-- the fixed "you hit your cap" template to an arbitrary address without limit.
--
-- Option (b) from the review (a short-lived signed token minted by the
-- generation endpoint that actually hit the cap) is NOT feasible here: settlement
-- generation is entirely client-side (a localStorage counter in
-- src/lib/anonGenCounter.js), so there is no trusted server-side cap event to
-- mint a token from. A client-minted token would give an attacker the same key.
--
-- This migration implements option (a): a fixed-window per-IP AND per-recipient
-- counter, consumed atomically by send-email via the service-role client before
-- it dispatches cap_warning. The botGuard stays in place as defense-in-depth.

-- ── Counter store ──────────────────────────────────────────────────────────
-- One row per (scope, key, window). The window_start is the floor of the
-- current epoch to p_window_seconds, so a row's lifetime is bounded and rolls
-- over cleanly without us tracking a moving timestamp per key.
--
-- Rows are touched ONLY by the SECURITY DEFINER function below (and the
-- service_role, which bypasses RLS). RLS is enabled with no policies so anon /
-- authenticated callers can never read or write the table directly — there is
-- nothing user-relevant in it.
create table if not exists public.email_rate_limits (
  scope_type   text        not null check (scope_type in ('ip', 'recipient')),
  scope_key    text        not null,
  window_start timestamptz not null,
  count        integer     not null default 0,
  primary key (scope_type, scope_key, window_start)
);

alter table public.email_rate_limits enable row level security;

-- Cleanup index: stale-row purge scans by window_start.
create index if not exists email_rate_limits_window_start_idx
  on public.email_rate_limits (window_start);

-- ── Atomic consume-and-check ───────────────────────────────────────────────
-- Increments the per-IP and per-recipient counters for the current window and
-- returns whether the caller is still under BOTH limits. Counting happens on
-- every attempt (not just successful sends), so a caller that blows past the
-- limit stays blocked for the rest of the window instead of being able to probe
-- for free. The insert/upsert is a single statement per scope and takes a row
-- lock, so two concurrent callers can't race past the limit (no count-then-write
-- TOCTOU).
--
-- Defaults: 1-hour window, 5 sends per IP, 3 sends per recipient. A legitimate
-- "remind me when the cap resets" form submits once; these leave generous
-- headroom for retries while making the path useless as a spam relay.
create or replace function public.consume_email_rate_limit(
  p_ip              text,
  p_recipient       text,
  p_window_seconds  integer default 3600,
  p_ip_limit        integer default 5,
  p_recipient_limit integer default 3
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_window    timestamptz;
  v_ip_key    text;
  v_rcpt_key  text;
  v_ip_count  integer;
  v_rcpt_count integer;
begin
  -- Guard against nonsense parameters that would disable the limit.
  if p_window_seconds is null or p_window_seconds < 1 then
    p_window_seconds := 3600;
  end if;

  v_window := to_timestamp(
    floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds
  );

  -- Normalize keys so trivial variants don't dodge the counter. IP falls back
  -- to the same sentinel send-email uses when no forwarded IP is present.
  v_ip_key   := coalesce(nullif(btrim(p_ip), ''), '0.0.0.0');
  v_rcpt_key := lower(btrim(coalesce(p_recipient, '')));

  insert into public.email_rate_limits as erl (scope_type, scope_key, window_start, count)
  values ('ip', v_ip_key, v_window, 1)
  on conflict (scope_type, scope_key, window_start)
    do update set count = erl.count + 1
  returning erl.count into v_ip_count;

  insert into public.email_rate_limits as erl (scope_type, scope_key, window_start, count)
  values ('recipient', v_rcpt_key, v_window, 1)
  on conflict (scope_type, scope_key, window_start)
    do update set count = erl.count + 1
  returning erl.count into v_rcpt_count;

  return jsonb_build_object(
    'allowed',         (v_ip_count <= p_ip_limit and v_rcpt_count <= p_recipient_limit),
    'ip_count',        v_ip_count,
    'recipient_count', v_rcpt_count,
    'ip_limit',        p_ip_limit,
    'recipient_limit', p_recipient_limit,
    'window_start',    v_window,
    'window_seconds',  p_window_seconds
  );
end;
$$;

-- Service-role only: send-email calls this through its admin client. No anon /
-- authenticated / public access.
revoke all on function public.consume_email_rate_limit(text, text, integer, integer, integer) from public;
grant execute on function public.consume_email_rate_limit(text, text, integer, integer, integer) to service_role;

-- ── Stale-row cleanup ──────────────────────────────────────────────────────
-- Counter rows are only meaningful inside their window; once the window has
-- rolled over they're dead weight. Purge anything older than the retention
-- horizon (default 1 day, comfortably past the 1-hour window) so the table
-- stays small.
create or replace function public.cleanup_email_rate_limits(
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
  delete from public.email_rate_limits
    where window_start < now() - make_interval(secs => p_retention_seconds);
  get diagnostics v_deleted = row_count;
  return v_deleted;
end;
$$;

revoke all on function public.cleanup_email_rate_limits(integer) from public;
grant execute on function public.cleanup_email_rate_limits(integer) to service_role;

-- Schedule the purge. Mirrors 024's defensive pattern: install pg_cron if we
-- have the privilege, otherwise leave a notice and rely on manual scheduling
-- (the table is self-bounding per window even without cleanup — purge just
-- reclaims space).
do $$
begin
  execute 'create extension if not exists pg_cron with schema extensions';
exception
  when insufficient_privilege then
    raise notice 'pg_cron extension could not be installed; schedule cleanup_email_rate_limits manually';
end;
$$;

do $$
declare existing_job bigint;
begin
  select jobid into existing_job from cron.job where jobname = 'cleanup-email-rate-limits';
  if existing_job is not null then perform cron.unschedule(existing_job); end if;
  perform cron.schedule(
    'cleanup-email-rate-limits',
    '23 4 * * *',
    $job$select public.cleanup_email_rate_limits();$job$
  );
exception
  when undefined_table or invalid_schema_name or insufficient_privilege then
    raise notice 'pg_cron unavailable; schedule cleanup_email_rate_limits manually';
end;
$$;
