-- ────────────────────────────────────────────────────────────────────────────
-- 115_pricing_resync_cron.sql — the NIGHTLY, DST-proof AI pricing resync.
--
-- WHY THIS EXISTS
--   Migration 114 shipped the pricing system + the MANUAL admin resync (the
--   admin-actions 'ai_pricing_resync' action + the AiPricingResyncPanel button).
--   That still needs an operator to click it. This migration adds the AUTOMATED
--   nightly path: a pg_cron job dispatches (via pg_net) to a new edge function
--   (pricing-resync-cron) once per local midnight, which runs the SAME pure
--   runPricingResync pipeline the button does.
--
--   THE DST PROBLEM. pg_cron schedules are evaluated in UTC only — there is no
--   per-job timezone. A naive `0 4 * * *` (04:00 UTC ≈ midnight US-Eastern in
--   winter) drifts an hour every daylight-saving switch. THE FIX: schedule the job
--   HOURLY ('0 * * * *') and gate each firing on the LOCAL wall-clock hour inside
--   the function — only the firing where `now() at time zone <tz>` has hour = 0
--   proceeds; the other 23 return 'skipped_hour'. Because the guard reads the
--   configured IANA zone (America/New_York by default), it self-corrects across DST
--   for ANY zone the operator sets, forever, with no schedule edit.
--
-- INERT UNTIL CONFIGURED. The 'pricing_resync_cron' config row seeds with
--   url = null / secret = null, so run_pricing_resync_nightly() returns
--   'not_configured' and dispatches NOTHING until an operator sets both — a
--   one-time, service-role-only SQL edit (system_config is RLS-locked to
--   service_role by migration 058). The operator runs, ONCE, after deploying the
--   pricing-resync-cron edge function and setting its PRICING_RESYNC_CRON_SECRET:
--
--     update public.system_config
--        set value = value
--              || jsonb_build_object(
--                   'url', 'https://<project-ref>.functions.supabase.co/pricing-resync-cron',
--                   'secret', '<the same value as the function''s PRICING_RESYNC_CRON_SECRET>')
--      where key = 'pricing_resync_cron';
--
--   `enabled` seeds TRUE so the moment url+secret land the job goes live; flip it
--   to false (or via the admin 'ai_pricing_cron_set' action) to pause without
--   unscheduling. `applyCreditCosts` (default true) lets an operator keep the price
--   book fresh nightly WITHOUT auto-moving the per-model credit charge.
--
-- SECOND CONFIG ROW. 'pricing_resync_last_run' is written by the edge function
--   after each run (a compact ok/at/summary or an error). It is NOT seeded here —
--   its absence means "never run yet", which the admin status action reports as
--   lastRun: null.
--
-- MIGRATION-NUMBER LEDGER. Numbers 113/114/115 are CONTESTED across in-flight
--   worktrees: 113 is reserved by the founder-grant renumber branch (111→113), 114
--   is the pricing config (this system), and 115 is contiguous with head 114 here.
--   Mirror 114's note: renumber to the first free slot at merge if a lower number
--   frees up — 115 is chosen only because it is the next contiguous prefix on THIS
--   branch. No NEW reserved gap is introduced (115 follows 114 with nothing missing).
--
-- Re-runnable: on-conflict-do-nothing seed + create-or-replace functions +
--   unschedule-before-schedule in the defensive DO block (idempotent like 039).
-- Depends on: 002 (system_config), 058 (the RLS allowlist that already EXCLUDES
--   these service-role-only keys), 114 (get_ai_pricing / the pricing config the
--   edge function re-reads and rewrites). pg_cron + pg_net are OPTIONAL — the
--   migration applies cleanly where they are absent (local dev), exactly like 039.
--
-- @rollback:
--   do $$ begin perform cron.unschedule(jobid) from cron.job
--          where jobname = 'pricing-resync-nightly';
--   exception when others then null; end $$;
--   drop function if exists public.run_pricing_resync_nightly();
--   drop function if exists public._pricing_cron_should_dispatch(jsonb, timestamptz);
--   delete from public.system_config where key in ('pricing_resync_cron', 'pricing_resync_last_run');
-- ────────────────────────────────────────────────────────────────────────────

-- ── 1. Seed the cron config row (inert: url/secret null) ────────────────────
-- on conflict do nothing so a re-apply never clobbers a live operator edit (the
-- url/secret they set, an enabled toggle). Absence of a live run row is "never run".
insert into public.system_config (key, value)
values ('pricing_resync_cron', jsonb_build_object(
  'enabled', true,
  'url', null,
  'secret', null,
  'timezone', 'America/New_York',
  'applyCreditCosts', true,
  'lastDispatchedOn', null,
  'note', 'Nightly AI pricing resync. INERT until an operator sets url + secret via service-role SQL (see migration 115 header). url = the deployed pricing-resync-cron function URL; secret = its PRICING_RESYNC_CRON_SECRET env value. The pg_cron job fires hourly UTC; only the firing at local midnight in timezone dispatches (DST-proof). Set enabled=false to pause without unscheduling. applyCreditCosts=false keeps the price book fresh without auto-moving the per-model credit charge.'
))
on conflict (key) do nothing;

-- ── 2. The hour/dedupe guard — IMMUTABLE + deterministically testable ───────
-- Extracted from run_pricing_resync_nightly() so the DST-sensitive decision can be
-- unit-tested with FIXED timestamps (pglite can't easily fake now()). Given the
-- config row and a timestamp, it returns EXACTLY the string the nightly function
-- returns for the config/hour/dedupe branches — 'not_configured' / 'disabled' /
-- 'skipped_hour' / 'skipped_already' / 'ok'. 'ok' means "proceed to dispatch"; the
-- nightly function does the lastDispatchedOn write + the net.http_post itself.
--
-- IMMUTABLE is honest here: the result is a pure function of (cfg, at_ts). It reads
-- no tables and `at time zone` with a literal/immutable zone is immutable.
create or replace function public._pricing_cron_should_dispatch(cfg jsonb, at_ts timestamptz)
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

revoke all on function public._pricing_cron_should_dispatch(jsonb, timestamptz) from public;
revoke all on function public._pricing_cron_should_dispatch(jsonb, timestamptz) from anon;
revoke all on function public._pricing_cron_should_dispatch(jsonb, timestamptz) from authenticated;
grant execute on function public._pricing_cron_should_dispatch(jsonb, timestamptz) to service_role;

comment on function public._pricing_cron_should_dispatch(jsonb, timestamptz) is
  'Pure hour/dedupe guard for the nightly pricing resync. Returns not_configured / disabled / skipped_hour / skipped_already / ok for (config, timestamp). IMMUTABLE + deterministic so the DST-sensitive local-midnight decision is unit-testable with fixed timestamps; run_pricing_resync_nightly() calls it with now().';

-- ── 3. The nightly dispatcher (SECURITY DEFINER, cron-invoked) ──────────────
-- Reads the config, asks the guard whether to proceed, writes lastDispatchedOn
-- FIRST (dispatch-at-most-once even if pg_net then errors), then POSTs to the edge
-- function via pg_net. NEVER throws: a missing pg_net (undefined_function) is caught
-- and returned as 'pg_net_unavailable' with a notice, so a cron run can't error-spam.
create or replace function public.run_pricing_resync_nightly()
returns text
language plpgsql
security definer
set search_path = public
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

-- Grants: mirror the 039 maintenance functions — revoke from the public roles,
-- grant execute to service_role only. pg_cron runs the job as its OWNER, and the
-- function is SECURITY DEFINER, so service_role execute is the posture that lets an
-- operator also invoke it by hand while keeping anon/authenticated out.
revoke all on function public.run_pricing_resync_nightly() from public;
revoke all on function public.run_pricing_resync_nightly() from anon;
revoke all on function public.run_pricing_resync_nightly() from authenticated;
grant execute on function public.run_pricing_resync_nightly() to service_role;

comment on function public.run_pricing_resync_nightly() is
  'Nightly AI-pricing-resync dispatcher (cron-invoked). Reads pricing_resync_cron, defers the config/enabled/hour/dedupe decision to _pricing_cron_should_dispatch(now()), writes lastDispatchedOn FIRST (at-most-once), then net.http_post to the configured edge function URL with the x-cron-secret header. Returns not_configured / disabled / skipped_hour / skipped_already / dispatched:<id> / pg_net_unavailable. Never throws.';

-- ── 4. pg_net install (defensive, 039 idiom) ────────────────────────────────
do $$
begin
  execute 'create extension if not exists pg_net with schema extensions';
exception when insufficient_privilege or undefined_file or others then
  raise notice 'pg_net unavailable; the nightly resync POST will report pg_net_unavailable until it is installed';
end;
$$;

-- ── 5. pg_cron install (defensive, 039 idiom) ───────────────────────────────
do $$
begin
  execute 'create extension if not exists pg_cron with schema extensions';
exception when insufficient_privilege then
  raise notice 'pg_cron unavailable; schedule the pricing resync manually';
end;
$$;

-- ── 6. Schedule HOURLY (DST-proof local-midnight guard lives in the fn) ──────
-- WHY HOURLY, not '0 4 * * *': pg_cron evaluates schedules in UTC only, with no
-- per-job timezone. A fixed UTC hour drifts by one every DST switch. Firing every
-- hour and letting run_pricing_resync_nightly()'s local-hour guard pick the single
-- local-midnight firing makes the job correct for ANY configured IANA zone,
-- year-round, without ever editing this schedule.
do $$
begin
  perform cron.unschedule(jobid) from cron.job where jobname = 'pricing-resync-nightly';
  perform cron.schedule('pricing-resync-nightly', '0 * * * *',
    $job$select public.run_pricing_resync_nightly();$job$);
exception when undefined_table or invalid_schema_name or insufficient_privilege then
  raise notice 'pg_cron unavailable; schedule pricing-resync-nightly manually (hourly: 0 * * * *)';
end;
$$;
