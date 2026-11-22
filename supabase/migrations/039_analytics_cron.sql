-- ────────────────────────────────────────────────────────────────────────────
-- 039_analytics_cron.sql — scheduled analytics maintenance (doc §4d).
--
-- Three jobs, in migration-034's exception-safe DO $$ … cron.schedule … $$ style
-- (install pg_cron if we have the privilege, otherwise leave a notice and rely
-- on manual scheduling). Guarded so the migration applies cleanly even where
-- pg_cron / pg_net are unavailable (local dev).
--
--   analytics-rollup-daily     — rollup yesterday + refresh MVs concurrently
--   analytics-prune-monthly    — delete analytics_events > 400 days, stale rate
--                                buckets > 2 days. edit_events / settlement_
--                                snapshots are NEVER auto-pruned — they ARE the
--                                research dataset.
--   research-export-monthly    — pg_net POST → analytics-export edge fn (the user
--                                wires the URL + EXPORT_SHARED_SECRET; left as a
--                                documented placeholder so the migration is inert
--                                until configured).
-- ────────────────────────────────────────────────────────────────────────────

-- Maintenance function: prune + refresh. Callable directly or by cron.
create or replace function public.analytics_nightly_maintenance()
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  perform public.rollup_analytics_daily();
  begin
    refresh materialized view concurrently public.mv_retention_cohorts;
  exception when others then null; end;
  begin
    refresh materialized view concurrently research.mv_archetype_clusters;
    refresh materialized view concurrently research.mv_edit_frequency;
  exception when others then null; end;
end;
$$;
revoke all on function public.analytics_nightly_maintenance() from public;
grant execute on function public.analytics_nightly_maintenance() to service_role;

create or replace function public.analytics_monthly_prune()
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare v_deleted integer := 0;
begin
  delete from public.analytics_events where created_at < now() - interval '400 days';
  get diagnostics v_deleted = row_count;
  delete from public.ingest_rate_buckets where window_start < now() - interval '2 days';
  -- edit_events + settlement_snapshots are deliberately NOT pruned.
  return v_deleted;
end;
$$;
revoke all on function public.analytics_monthly_prune() from public;
grant execute on function public.analytics_monthly_prune() to service_role;

-- ── pg_cron install (defensive) ─────────────────────────────────────────────
do $$
begin
  execute 'create extension if not exists pg_cron with schema extensions';
exception when insufficient_privilege then
  raise notice 'pg_cron unavailable; schedule analytics maintenance manually';
end;
$$;

do $$
begin
  perform cron.unschedule(jobid) from cron.job where jobname in
    ('analytics-rollup-daily', 'analytics-prune-monthly');
  perform cron.schedule('analytics-rollup-daily', '25 3 * * *',
    $job$select public.analytics_nightly_maintenance();$job$);
  perform cron.schedule('analytics-prune-monthly', '45 4 1 * *',
    $job$select public.analytics_monthly_prune();$job$);
exception when undefined_table or invalid_schema_name or insufficient_privilege then
  raise notice 'pg_cron unavailable; schedule analytics jobs manually';
end;
$$;

-- The monthly research export (analytics-prune-monthly's sibling) is wired by
-- the operator: schedule a pg_net POST to the analytics-export edge function with
-- the EXPORT_SHARED_SECRET header once that function is deployed. Left out of the
-- automatic schedule so this migration has no hard dependency on pg_net or a
-- deployed function URL.
