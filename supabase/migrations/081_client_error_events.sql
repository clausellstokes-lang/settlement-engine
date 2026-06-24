-- 081_client_error_events.sql
--
-- Production observability sink for client-side crashes.
--
-- src/lib/errorReporter.js is already built and wired at bootstrap (global
-- error/unhandledrejection handlers + the root ErrorBoundary), but its network
-- sink is a no-op unless VITE_ERROR_REPORT_URL is set — and there was no sink to
-- point it at. Render crashes and unhandled rejections were therefore invisible
-- in production until a user complained.
--
-- This adds the missing destination: a bounded, PII-light table written ONLY by
-- the `log-client-error` edge function (service role). Activation is then a
-- two-step operator flip — deploy the function and set
-- VITE_ERROR_REPORT_URL=<project>/functions/v1/log-client-error — with no app
-- code change required.

create table if not exists public.client_error_events (
  id              bigserial primary key,
  kind            text,                       -- 'window.error' | 'unhandledrejection' | feature-boundary kind
  message         text,
  stack           text,
  component_stack text,
  url             text,
  ua              text,
  release         text,                       -- VITE_RELEASE, when set, for triage-by-deploy
  ip_hash         text,                       -- sha256(ip + pepper); raw IP is never stored
  created_at      timestamptz not null default now()
);

comment on table public.client_error_events is
  'Client-side error reports (render crashes / unhandled rejections) posted by the log-client-error edge function. PII-light: IP is hashed, payload fields are length-bounded at the edge. Service-role write only; pruned to 30 days.';

-- Rate-limit lookup (ip_hash within a recent window) + retention prune both scan
-- by these columns.
create index if not exists idx_client_error_events_ip_time
  on public.client_error_events (ip_hash, created_at desc);
create index if not exists idx_client_error_events_created
  on public.client_error_events (created_at);

-- RLS on, NO anon/authenticated policy: the service role (used by the edge
-- function) bypasses RLS; nobody else reads or writes this table directly. An
-- operator reads it via the SQL editor / a future admin RPC, not the client.
alter table public.client_error_events enable row level security;

-- ── Retention prune (defensive pg_cron, mirrors migration 039/080) ────────────
create or replace function public.prune_client_error_events()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  pruned integer;
begin
  delete from public.client_error_events where created_at < now() - interval '30 days';
  get diagnostics pruned = row_count;
  return pruned;
end;
$$;

revoke all on function public.prune_client_error_events() from public, anon, authenticated;

do $$
begin
  perform cron.schedule('client-error-events-prune-daily', '30 4 * * *',
    $job$ select public.prune_client_error_events(); $job$);
exception when others then
  raise notice 'pg_cron unavailable; prune client_error_events manually (retain 30d)';
end $$;
