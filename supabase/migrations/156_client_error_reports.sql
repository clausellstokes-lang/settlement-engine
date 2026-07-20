-- 156_client_error_reports.sql
--
-- Admin read + alerting surface over public.client_error_events (migration 081).
--
-- 081 put client crash reports in an RLS-locked table with NO read policy — the
-- service role writes them (via the log-client-error edge function) and an
-- operator was expected to read them by hand in the SQL editor. This adds the
-- two fixed SECURITY DEFINER report functions the admin panel dispatches to
-- (same posture as the migration-038 analytics report_* functions: the edge
-- function assembles NO SQL, it only calls one of these fixed reads):
--
--   report_client_errors(p_from, p_to)  — recent crashes GROUPED BY a normalized
--       signature (kind + message with volatile digit runs blanked, so
--       "…at line 42" and "…at line 88" collapse into one row), with counts,
--       first/last seen, a sample message + url, and the releases seen.
--   report_client_error_alert()         — the alerting summary: distinct
--       signatures + total events in the last hour, a threshold, and whether it
--       is exceeded. Drives the always-visible banner in the admin errors panel
--       and is the substrate for an optional cron→send-email ops alert.
--
-- No schema change to client_error_events, no new table, no stored signature
-- column (the normalization is computed at read time). Reads only.
--
-- @rollback: drop function public.report_client_errors(date, date);
--            drop function public.report_client_error_alert();
--            (reads only — no data touched; safe to drop and re-create.)

-- The normalized signature expression, shared by both functions. Kept inline
-- (a plain SQL function keeps the read planner-friendly and avoids a helper the
-- planner would have to inline anyway).

create or replace function public.report_client_errors(p_from date, p_to date)
returns table(
  signature       text,
  kind            text,
  event_count     bigint,
  first_seen      timestamptz,
  last_seen       timestamptz,
  sample_message  text,
  sample_url      text,
  releases        text
)
language sql
security definer
set search_path = public, pg_temp
as $$
  select
    coalesce(kind, 'error') || ': ' ||
      left(regexp_replace(coalesce(message, ''), '[0-9]+', '#', 'g'), 200) as signature,
    coalesce(kind, 'error')                                                as kind,
    count(*)                                                               as event_count,
    min(created_at)                                                        as first_seen,
    max(created_at)                                                        as last_seen,
    (array_agg(message order by created_at desc))[1]                       as sample_message,
    (array_agg(url order by created_at desc) filter (where url is not null))[1] as sample_url,
    string_agg(distinct coalesce(release, '—'), ', ')                      as releases
  from public.client_error_events
  where created_at::date between p_from and p_to
  group by 1, 2
  order by event_count desc, last_seen desc
  limit 200
$$;

create or replace function public.report_client_error_alert()
returns table(
  distinct_signatures  bigint,
  total_events         bigint,
  threshold            integer,
  over_threshold       boolean,
  window_minutes       integer
)
language sql
security definer
set search_path = public, pg_temp
as $$
  with recent as (
    select
      coalesce(kind, 'error') || ': ' ||
        left(regexp_replace(coalesce(message, ''), '[0-9]+', '#', 'g'), 200) as signature
    from public.client_error_events
    where created_at >= now() - interval '1 hour'
  )
  select
    count(distinct signature)::bigint as distinct_signatures,
    count(*)::bigint                  as total_events,
    8                                 as threshold,       -- distinct signatures/hour; tune here
    count(distinct signature) > 8     as over_threshold,
    60                                as window_minutes
  from recent
$$;

-- Locked to the service role (the admin-actions edge function's client), exactly
-- like the migration-038 analytics report_* functions. No anon/authenticated
-- execute — the table stays operator-only.
revoke all on function public.report_client_errors(date, date) from public;
revoke all on function public.report_client_error_alert() from public;
grant execute on function public.report_client_errors(date, date) to service_role;
grant execute on function public.report_client_error_alert() to service_role;
