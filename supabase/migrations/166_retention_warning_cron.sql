-- ────────────────────────────────────────────────────────────────────────────
-- 166_retention_warning_cron.sql — the NIGHTLY, DST-proof retention-expiry warning.
--
-- WHY THIS EXISTS
--   Migrations 023/024 gave a downgraded account a RETENTION WINDOW: its saved
--   settlements + campaign maps stay retrievable (access_state 'inactive_plan',
--   retention_expires_at set) until the purge job (024's purge-expired-plan-assets,
--   daily 03:17 UTC) deletes them. The one thing missing is a HEADS-UP: nothing
--   tells a lapsed account "your retained worlds will be cleared on <date>" while
--   there is still time to export or resubscribe. This migration adds the AUTOMATED
--   nightly WARNING path — a pg_cron job dispatches (via pg_net) to a new edge
--   function (retention-warning-cron), which sweeps the two asset tables for rows
--   entering the warning window and emails each owner once.
--
--   Modeled LINE-FOR-LINE on migration 115 (pricing-resync-cron): the same
--   hourly-fire + local-midnight guard (DST-proof for any IANA zone), the same
--   inert-until-configured system_config seed, the same never-throws dispatcher.
--
--   THE MAIL SEAM (fold coordination point). The edge function invokes send-email
--   with template 'retention_warning'. That template is registered by the Wave E
--   mail adapter, which lives on a PARALLEL branch and is NOT folded here — so
--   until Wave E lands, a dispatch is INERT (send-email returns unknown_template;
--   the edge function logs it and moves on). Wave E must additionally admit
--   'retention_warning' to send-email's ANON_OK_TEMPLATES (a cron has no user JWT,
--   so it supplies the recipient explicitly), or provide a service-role send path.
--
-- AT-MOST-ONCE. A dedicated dedup table (retention_warning_dispatch) keyed on
--   (account_id, warn_for_date) is claimed by the edge function BEFORE it sends, so
--   an account is warned at most once per retention-expiry date, even if the sweep
--   re-runs. The edge function releases the claim if the send itself fails, so a
--   transient failure retries the next night.
--
-- INERT UNTIL CONFIGURED. The 'retention_warning_cron' config row seeds with
--   url = null / secret = null, so run_retention_warning_nightly() returns
--   'not_configured' and dispatches NOTHING until an operator sets both — a
--   one-time, service-role-only SQL edit (system_config is RLS-locked to
--   service_role by migration 058). The operator runs, ONCE, after deploying the
--   retention-warning-cron edge function and setting its RETENTION_WARNING_CRON_SECRET:
--
--     update public.system_config
--        set value = value
--              || jsonb_build_object(
--                   'url', 'https://<project-ref>.functions.supabase.co/retention-warning-cron',
--                   'secret', '<the same value as the function''s RETENTION_WARNING_CRON_SECRET>')
--      where key = 'retention_warning_cron';
--
--   `enabled` seeds TRUE so the moment url+secret land the job goes live; flip it
--   to false to pause without unscheduling. `warnWindowDays` (default 14) is how
--   many days ahead of retention_expires_at an account is warned.
--
-- MIGRATION-NUMBER LEDGER. This lane's head is 155; siblings on parallel worktrees
--   (money-wave, roads) hold 156–162, so this migration took a high number to avoid a
--   fold-time collision. That leaves a DELIBERATE gap 156..162 on THIS branch — a
--   fold-owned red the merge closes by renumbering the parallel migrations
--   contiguously. Reference these functions/jobs by NAME, never by number.
--
-- WRITTEN, NOT DEPLOYED. Like 155, this migration is NOT part of any deploy yet —
--   do not `supabase db push` it and do not bump supabase/applied-head.json until
--   the very-end deploy batch. Until pushed, the edge function's config read finds
--   no 'retention_warning_cron' row and no dedup table (both created here).
--
-- Re-runnable: on-conflict-do-nothing seed + create-if-not-exists table +
--   create-or-replace functions + unschedule-before-schedule (idempotent like 039/115).
-- Depends on: 002 (system_config), 058 (the RLS allowlist that already EXCLUDES
--   these service-role-only keys), 023/024 (retention_expires_at on settlements +
--   saved_maps, and the access_state the sweep filters on). pg_cron + pg_net are
--   OPTIONAL — applies cleanly where absent (local dev), exactly like 039/115.
--
-- @rollback:
--   do $$ begin perform cron.unschedule(jobid) from cron.job
--          where jobname = 'retention-warning-nightly';
--   exception when others then null; end $$;
--   drop function if exists public.run_retention_warning_nightly();
--   drop function if exists public._retention_warning_cron_should_dispatch(jsonb, timestamptz);
--   drop table if exists public.retention_warning_dispatch;
--   delete from public.system_config where key in ('retention_warning_cron', 'retention_warning_last_run');
-- ────────────────────────────────────────────────────────────────────────────

-- ── 0. The at-most-once dedup ledger (service-role only) ────────────────────
-- One row per (account, retention-expiry-date) the warning has been sent for. The
-- edge function claims a row (insert on conflict do nothing) before sending, so a
-- re-run never double-warns. RLS on with NO policy ⇒ anon/authenticated are denied
-- and only service_role (which bypasses RLS) can read/write it — the system_config
-- posture. warn_for_date is the asset's retention_expires_at::date.
create table if not exists public.retention_warning_dispatch (
  account_id    uuid not null,
  warn_for_date date not null,
  sent_at       timestamptz not null default now(),
  primary key (account_id, warn_for_date)
);
alter table public.retention_warning_dispatch enable row level security;
revoke all on table public.retention_warning_dispatch from public;
revoke all on table public.retention_warning_dispatch from anon;
revoke all on table public.retention_warning_dispatch from authenticated;
grant select, insert, delete on table public.retention_warning_dispatch to service_role;

comment on table public.retention_warning_dispatch is
  'At-most-once ledger for retention-expiry warning emails (migration 166). One row per (account_id, warn_for_date); the retention-warning-cron edge function claims a row before sending. Service-role only (RLS on, no policy).';

-- ── 1. Seed the cron config row (inert: url/secret null) ────────────────────
-- on conflict do nothing so a re-apply never clobbers a live operator edit.
insert into public.system_config (key, value)
values ('retention_warning_cron', jsonb_build_object(
  'enabled', true,
  'url', null,
  'secret', null,
  'timezone', 'America/New_York',
  'warnWindowDays', 14,
  'lastDispatchedOn', null,
  'note', 'Nightly retention-expiry warning. INERT until an operator sets url + secret via service-role SQL (see migration 166 header). url = the deployed retention-warning-cron function URL; secret = its RETENTION_WARNING_CRON_SECRET env value. The pg_cron job fires hourly UTC; only the firing at local midnight in timezone dispatches (DST-proof). warnWindowDays = how many days ahead of retention_expires_at an account is warned. Set enabled=false to pause without unscheduling. The mail template ''retention_warning'' is registered by the Wave E adapter (parallel branch) — dispatches are inert until it lands.'
))
on conflict (key) do nothing;

-- ── 2. The hour/dedupe guard — IMMUTABLE + deterministically testable ───────
-- The pricing-cron guard (migration 115) verbatim, minus the pricing-only branches.
-- Given the config row and a timestamp, returns EXACTLY the branch the nightly
-- function takes: 'not_configured' / 'disabled' / 'skipped_hour' / 'skipped_already'
-- / 'ok'. 'ok' means "proceed to dispatch". Pure function of (cfg, at_ts): reads no
-- tables, and `at time zone` with an immutable zone is immutable.
create or replace function public._retention_warning_cron_should_dispatch(cfg jsonb, at_ts timestamptz)
returns text
language plpgsql
immutable
set search_path = public
as $$
declare
  tz         text;
  local_now  timestamp;
  local_today text;
  cfg_url    text;
  cfg_secret text;
begin
  -- 1. missing / malformed config → not_configured
  if cfg is null or jsonb_typeof(cfg) <> 'object' then
    return 'not_configured';
  end if;
  -- 2. enabled must be exactly true (the kill switch)
  if coalesce((cfg ->> 'enabled')::boolean, false) is not true then
    return 'disabled';
  end if;
  -- 3. url + secret must both be present + non-empty
  cfg_url    := nullif(cfg ->> 'url', '');
  cfg_secret := nullif(cfg ->> 'secret', '');
  if cfg_url is null or cfg_secret is null then
    return 'not_configured';
  end if;
  -- 4. THE DST-PROOF GUARD: only the local-midnight firing proceeds. The job fires
  --    hourly UTC; convert to the configured zone and require wall-clock hour = 0.
  tz := coalesce(nullif(cfg ->> 'timezone', ''), 'America/New_York');
  local_now := at_ts at time zone tz;
  if extract(hour from local_now) <> 0 then
    return 'skipped_hour';
  end if;
  -- 5. at-most-once-per-local-day dedupe
  local_today := to_char(local_now, 'YYYY-MM-DD');
  if (cfg ->> 'lastDispatchedOn') = local_today then
    return 'skipped_already';
  end if;
  return 'ok';
exception
  -- A bad IANA zone string (or any coercion failure) must never throw out of the
  -- cron job — treat it as not_configured so the operator fixes the config, no dispatch.
  when others then
    return 'not_configured';
end;
$$;

revoke all on function public._retention_warning_cron_should_dispatch(jsonb, timestamptz) from public;
revoke all on function public._retention_warning_cron_should_dispatch(jsonb, timestamptz) from anon;
revoke all on function public._retention_warning_cron_should_dispatch(jsonb, timestamptz) from authenticated;
grant execute on function public._retention_warning_cron_should_dispatch(jsonb, timestamptz) to service_role;

comment on function public._retention_warning_cron_should_dispatch(jsonb, timestamptz) is
  'Pure hour/dedupe guard for the nightly retention-warning sweep. Returns not_configured / disabled / skipped_hour / skipped_already / ok for (config, timestamp). IMMUTABLE + deterministic so the DST-sensitive local-midnight decision is unit-testable with fixed timestamps; run_retention_warning_nightly() calls it with now().';

-- ── 3. The nightly dispatcher (SECURITY DEFINER, cron-invoked) ──────────────
-- Reads the config, asks the guard whether to proceed, writes lastDispatchedOn
-- FIRST (dispatch-at-most-once even if pg_net then errors), then POSTs to the edge
-- function via pg_net. NEVER throws: a missing pg_net (undefined_function) is caught
-- and returned as 'pg_net_unavailable' with a notice, so a cron run can't error-spam.
create or replace function public.run_retention_warning_nightly()
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
  select value into cfg from public.system_config where key = 'retention_warning_cron';

  -- The guard owns the config/enabled/hour/dedupe decision (shared with the tests).
  verdict := public._retention_warning_cron_should_dispatch(cfg, now());
  if verdict <> 'ok' then
    return verdict;
  end if;

  cfg_url    := cfg ->> 'url';
  cfg_secret := cfg ->> 'secret';
  tz         := coalesce(nullif(cfg ->> 'timezone', ''), 'America/New_York');
  local_today := to_char(now() at time zone tz, 'YYYY-MM-DD');

  -- Mark dispatched FIRST: if pg_net then errors we still won't re-dispatch this
  -- local day (the edge function is the source of truth for which accounts were
  -- warned, via its own dedup ledger; a failed POST is recoverable tomorrow).
  update public.system_config
     set value = jsonb_set(value, '{lastDispatchedOn}', to_jsonb(local_today))
   where key = 'retention_warning_cron';

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
      raise notice 'pg_net unavailable; retention-warning-cron not dispatched (install pg_net or schedule the POST manually)';
      return 'pg_net_unavailable';
  end;

  return 'dispatched:' || coalesce(req_id::text, 'unknown');
end;
$$;

-- Grants: mirror the 039/115 maintenance functions — revoke from the public roles,
-- grant execute to service_role only. pg_cron runs the job as its OWNER, and the
-- function is SECURITY DEFINER, so service_role execute lets an operator also invoke
-- it by hand while keeping anon/authenticated out.
revoke all on function public.run_retention_warning_nightly() from public;
revoke all on function public.run_retention_warning_nightly() from anon;
revoke all on function public.run_retention_warning_nightly() from authenticated;
grant execute on function public.run_retention_warning_nightly() to service_role;

comment on function public.run_retention_warning_nightly() is
  'Nightly retention-warning dispatcher (cron-invoked). Reads retention_warning_cron, defers the config/enabled/hour/dedupe decision to _retention_warning_cron_should_dispatch(now()), writes lastDispatchedOn FIRST (at-most-once), then net.http_post to the configured edge function URL with the x-cron-secret header. Returns not_configured / disabled / skipped_hour / skipped_already / dispatched:<id> / pg_net_unavailable. Never throws.';

-- ── 4. pg_net install (defensive, 039/115 idiom) ────────────────────────────
do $$
begin
  execute 'create extension if not exists pg_net with schema extensions';
exception when insufficient_privilege or undefined_file or others then
  raise notice 'pg_net unavailable; the nightly retention-warning POST will report pg_net_unavailable until it is installed';
end;
$$;

-- ── 5. pg_cron install (defensive, 039/115 idiom) ───────────────────────────
do $$
begin
  execute 'create extension if not exists pg_cron with schema extensions';
exception when insufficient_privilege then
  raise notice 'pg_cron unavailable; schedule the retention warning manually';
end;
$$;

-- ── 6. Schedule HOURLY (DST-proof local-midnight guard lives in the fn) ──────
-- Firing every hour and letting run_retention_warning_nightly()'s local-hour guard
-- pick the single local-midnight firing makes the job correct for ANY configured
-- IANA zone, year-round, without ever editing this schedule (the 115 rationale).
do $$
begin
  perform cron.unschedule(jobid) from cron.job where jobname = 'retention-warning-nightly';
  perform cron.schedule('retention-warning-nightly', '0 * * * *',
    $job$select public.run_retention_warning_nightly();$job$);
exception when undefined_table or invalid_schema_name or insufficient_privilege then
  raise notice 'pg_cron unavailable; schedule retention-warning-nightly manually (hourly: 0 * * * *)';
end;
$$;
