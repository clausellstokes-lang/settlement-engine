-- ────────────────────────────────────────────────────────────────────────────
-- 162_founder_transfer_due_cron.sql — THE DUE-RUNNER CRON (DESIGN_MONEY_WAVE §6.6,
-- slice M-7c). The hourly pg_cron dispatcher that drives the founder-transfer edge
-- function's 'run_due' action, which sweeps: finalize-due cases (§6.5) · expire
-- stale cases (§6.3) · cancel stale auto-reload attempts (§4.5) · release due
-- payouts (§6.6/M-8) · issue cooling abort tokens + notifications (§6.3) · the
-- stewardship sweeps (dormancy nudge / abandonment, §6.8/M-10).
--
-- ⚠ NUMBERING: 162 is the next contiguous number on the money-wave branch (this wave
--   took 157-161; 156 is minted by two SIBLING lanes not folded into this base). No
--   migration NUMBER is hardcoded in any code — the cron JOB NAME + the RPC NAME are
--   the interface. The manager renumbers ALL lanes contiguously at fold (a pure file
--   rename + this header edit). See 157_money_events.sql's header for the full note.
--
-- THE 115 IDIOM, EXACTLY (reuse — do not reinvent): pg_cron fires hourly UTC, a
--   should-dispatch guard gates on the config, pg_net POSTs to the edge function with
--   a shared-secret header, and the whole thing is INERT until the operator sets
--   url + secret in the 'founder_transfer_cron' system_config row (SEEDED BY 160 —
--   this migration does NOT re-seed it). Unlike the pricing resync (once per local
--   midnight, DST-guarded), the due-runner fires EVERY hour: the sweeps are all
--   claim-once + idempotent, so re-running them hourly is by design (a finalize/payout
--   that isn't due yet is a no-op; a due one is claimed exactly once). No local-hour
--   gate, no per-day dedupe.
--
-- SECURITY: run_founder_transfer_due() is SECURITY DEFINER, service_role-only (pg_cron
--   runs the job as its owner). The edge's 'run_due' action authenticates the POST by a
--   constant-time compare of the x-cron-secret header against FOUNDER_TRANSFER_CRON_SECRET
--   (the operator sets the config 'secret' equal to that env value, exactly like 115).
--   All definer functions pin search_path = public (immutable guard) / public, pg_temp.
--
-- Re-runnable: create-or-replace functions + unschedule-before-schedule (039 idiom).
-- Depends on: 002 (system_config), 160 (the 'founder_transfer_cron' config seed +
--   the case machine the edge run_due sweeps). pg_cron + pg_net are OPTIONAL — the
--   migration applies cleanly where they are absent (local dev / pglite), like 039/115.
--
-- @rollback:
--   do $$ begin perform cron.unschedule(jobid) from cron.job
--          where jobname = 'founder-transfer-due';
--   exception when others then null; end $$;
--   drop function if exists public.run_founder_transfer_due();
--   drop function if exists public._founder_transfer_cron_should_dispatch(jsonb);
-- ────────────────────────────────────────────────────────────────────────────

-- ── 1. The dispatch guard — pure, deterministically testable ────────────────────
-- Given the config row, returns EXACTLY the branch string the dispatcher acts on:
--   'not_configured' (missing/malformed/absent url+secret) · 'disabled' (kill switch)
--   · 'ok' (proceed to POST). No hour/dedupe gate — the due-runner fires every hour.
-- IMMUTABLE is honest: a pure function of the cfg argument, reads no tables.
create or replace function public._founder_transfer_cron_should_dispatch(cfg jsonb)
returns text
language plpgsql
immutable
set search_path = public
as $$
declare cfg_url text; cfg_secret text;
begin
  if cfg is null or jsonb_typeof(cfg) <> 'object' then
    return 'not_configured';
  end if;
  -- enabled must be exactly true (the kill switch; the 'founder_transfer_cron' row
  -- seeds enabled=true so the moment url+secret land the sweep goes live).
  if coalesce((cfg ->> 'enabled')::boolean, false) is not true then
    return 'disabled';
  end if;
  cfg_url    := nullif(cfg ->> 'url', '');
  cfg_secret := nullif(cfg ->> 'secret', '');
  if cfg_url is null or cfg_secret is null then
    return 'not_configured';
  end if;
  return 'ok';
exception
  when others then
    -- Any coercion failure ⇒ not_configured (the operator fixes the config); no dispatch.
    return 'not_configured';
end;
$$;
revoke all on function public._founder_transfer_cron_should_dispatch(jsonb) from public;
revoke all on function public._founder_transfer_cron_should_dispatch(jsonb) from anon;
revoke all on function public._founder_transfer_cron_should_dispatch(jsonb) from authenticated;
grant execute on function public._founder_transfer_cron_should_dispatch(jsonb) to service_role;
comment on function public._founder_transfer_cron_should_dispatch(jsonb) is
  'Pure dispatch guard for the founder-transfer due-runner (162, §6.6). Returns not_configured / disabled / ok for the founder_transfer_cron config. IMMUTABLE + deterministic (no tables read) so it is unit-testable; run_founder_transfer_due() calls it. Unlike the pricing cron there is NO hour/dedupe gate — the sweep fires hourly by design (all sweeps are claim-once idempotent).';

-- ── 2. The hourly dispatcher (SECURITY DEFINER, cron-invoked) ────────────────────
-- Reads the config, asks the guard, then pg_net-POSTs to the edge with the
-- x-cron-secret header + {"action":"run_due"} body. NEVER throws: a missing pg_net
-- (undefined_function) is caught and returned as 'pg_net_unavailable'. Unlike the
-- pricing dispatcher there is no lastDispatchedOn write — the sweeps are idempotent,
-- so an at-most-once-per-hour marker is unnecessary and a double-fire is harmless.
create or replace function public.run_founder_transfer_due()
returns text
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare cfg jsonb; verdict text; cfg_url text; cfg_secret text; req_id bigint;
begin
  select value into cfg from public.system_config where key = 'founder_transfer_cron';
  verdict := public._founder_transfer_cron_should_dispatch(cfg);
  if verdict <> 'ok' then
    return verdict;
  end if;
  cfg_url    := cfg ->> 'url';
  cfg_secret := cfg ->> 'secret';
  begin
    select net.http_post(
      url     := cfg_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'x-cron-secret', cfg_secret
      ),
      body    := jsonb_build_object('action', 'run_due')
    ) into req_id;
  exception
    when undefined_function or undefined_table or invalid_schema_name then
      raise notice 'pg_net unavailable; founder-transfer due-runner not dispatched (install pg_net or POST run_due manually)';
      return 'pg_net_unavailable';
  end;
  return 'dispatched:' || coalesce(req_id::text, 'unknown');
end;
$$;
revoke all on function public.run_founder_transfer_due() from public;
revoke all on function public.run_founder_transfer_due() from anon;
revoke all on function public.run_founder_transfer_due() from authenticated;
grant execute on function public.run_founder_transfer_due() to service_role;
comment on function public.run_founder_transfer_due() is
  'Hourly founder-transfer due-runner dispatcher (162, §6.6, cron-invoked). Reads founder_transfer_cron, defers the config/enabled decision to _founder_transfer_cron_should_dispatch, then net.http_post to the configured edge URL with the x-cron-secret header and a {"action":"run_due"} body. Returns not_configured / disabled / dispatched:<id> / pg_net_unavailable. Never throws.';

-- ── 3. pg_net install (defensive, 039/115 idiom) ────────────────────────────────
do $$
begin
  execute 'create extension if not exists pg_net with schema extensions';
exception when insufficient_privilege or undefined_file or others then
  raise notice 'pg_net unavailable; the founder-transfer due-runner POST will report pg_net_unavailable until it is installed';
end;
$$;

-- ── 4. pg_cron install (defensive, 039/115 idiom) ───────────────────────────────
-- Catch `others` (not just insufficient_privilege) so a pglite/local instance that
-- reports "extension not available" with a different sqlstate still applies cleanly —
-- same posture as the pg_net block above; the extension is OPTIONAL by design.
do $$
begin
  execute 'create extension if not exists pg_cron with schema extensions';
exception when insufficient_privilege or undefined_file or others then
  raise notice 'pg_cron unavailable; schedule the founder-transfer due-runner manually (hourly: 0 * * * *)';
end;
$$;

-- ── 5. Schedule HOURLY ──────────────────────────────────────────────────────────
do $$
begin
  perform cron.unschedule(jobid) from cron.job where jobname = 'founder-transfer-due';
  perform cron.schedule('founder-transfer-due', '0 * * * *',
    $job$select public.run_founder_transfer_due();$job$);
exception when undefined_table or invalid_schema_name or insufficient_privilege then
  raise notice 'pg_cron unavailable; schedule founder-transfer-due manually (hourly: 0 * * * *)';
end;
$$;
