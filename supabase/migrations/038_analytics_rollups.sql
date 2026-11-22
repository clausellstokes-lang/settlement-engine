-- ────────────────────────────────────────────────────────────────────────────
-- 038_analytics_rollups.sql — dashboards, rollups, and research aggregates.
--
-- Companion to docs/simulation-intelligence-layer.md §4c/§9. Persisted daily
-- rollups (so funnel history survives raw-event pruning) + dashboard views +
-- research MVs + report_* SECURITY DEFINER functions (so the admin edge function
-- assembles no SQL) + an export cursor.
--
-- All report_* functions are service-role-execute-only; views/MVs are reached
-- only through them or via service-role. Re-runnable.
-- ────────────────────────────────────────────────────────────────────────────

-- ── Persisted daily rollups (survive raw-event pruning) ─────────────────────
create table if not exists public.analytics_daily_rollups (
  day    date not null,
  metric text not null,
  dims   jsonb not null default '{}'::jsonb,
  value  bigint not null default 0,
  primary key (day, metric, dims)
);

-- One-row export bookmark for incremental JSONL export.
create table if not exists public.export_cursors (
  name        text primary key,
  last_id     bigint not null default 0,
  updated_at  timestamptz not null default now()
);

-- ── Dashboard views (Plane 1) ───────────────────────────────────────────────
create or replace view public.v_funnel_first_gen as
  select created_at::date as day,
    count(*) filter (where event = 'homepage_view')                  as homepage,
    count(*) filter (where event = 'anonymous_generation_started')   as gen_started,
    count(*) filter (where event = 'anonymous_generation_completed') as gen_completed,
    count(*) filter (where event = 'signup_gate_seen')               as gate_seen,
    count(*) filter (where event = 'signup_after_anon')              as signup_after_anon,
    count(*) filter (where event = 'paid_after_anon')                as paid_after_anon,
    count(distinct actor_id) filter (where event = 'anonymous_generation_completed') as gen_actors
  from public.analytics_events
  group by 1;

create or replace view public.v_settlement_preferences as
  select created_at::date as day, capture_point, tier, population_band, prosperity,
         count(*) as n,
         avg(legitimacy) as avg_legitimacy,
         avg(food_resilience) as avg_food_resilience
  from public.settlement_snapshots
  group by 1, 2, 3, 4, 5;

create or replace view public.v_edit_heatmap as
  select created_at::date as day, kind, target_kind,
         count(*) as edits,
         count(*) filter (where reverted) as reverts
  from public.edit_events
  group by 1, 2, 3;

create or replace view public.v_ai_usage as
  select created_at::date as day,
    count(*) filter (where event = 'ai_generation_started')   as ai_started,
    count(*) filter (where event = 'ai_generation_completed') as ai_completed,
    count(*) filter (where event = 'ai_generation_failed')    as ai_failed,
    count(*) filter (where event = 'credits_spent')           as credit_spends
  from public.analytics_events
  group by 1;

-- Retention cohorts as an MV (heavier; refreshed nightly).
drop materialized view if exists public.mv_retention_cohorts;
create materialized view public.mv_retention_cohorts as
  with first_seen as (
    select actor_id, min(created_at::date) as cohort_day
    from public.analytics_events where actor_id is not null group by actor_id
  ),
  activity as (
    select distinct actor_id, created_at::date as active_day
    from public.analytics_events where actor_id is not null
  )
  select f.cohort_day,
         (a.active_day - f.cohort_day) as day_offset,
         count(distinct a.actor_id) as actors
  from first_seen f join activity a using (actor_id)
  group by 1, 2;
create unique index if not exists mv_retention_cohorts_uidx on public.mv_retention_cohorts (cohort_day, day_offset);

-- ── Research aggregates (Plane 2) ───────────────────────────────────────────
drop materialized view if exists research.mv_archetype_clusters;
create materialized view research.mv_archetype_clusters as
  select tier, a.archetype, count(*) as n
  from public.settlement_snapshots s, unnest(s.condition_archetypes) as a(archetype)
  where s.consent_tier = 'research'
  group by 1, 2;
create unique index if not exists mv_archetype_clusters_uidx on research.mv_archetype_clusters (tier, archetype);

drop materialized view if exists research.mv_edit_frequency;
create materialized view research.mv_edit_frequency as
  select kind, target_kind,
         count(*) as n,
         count(*) filter (where reverted)::numeric / nullif(count(*), 0) as revert_rate,
         percentile_cont(0.5) within group (order by edit_seq) as median_seq
  from public.edit_events
  group by 1, 2;
create unique index if not exists mv_edit_frequency_uidx on research.mv_edit_frequency (kind, target_kind);

-- ── Nightly rollup function ─────────────────────────────────────────────────
create or replace function public.rollup_analytics_daily(p_day date default (now()::date - 1))
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare v_rows integer := 0;
begin
  insert into public.analytics_daily_rollups (day, metric, dims, value)
  select p_day, 'event_count', jsonb_build_object('event', event), count(*)
  from public.analytics_events
  where created_at::date = p_day
  group by event
  on conflict (day, metric, dims) do update set value = excluded.value;
  get diagnostics v_rows = row_count;
  return v_rows;
end;
$$;
revoke all on function public.rollup_analytics_daily(date) from public;
grant execute on function public.rollup_analytics_daily(date) to service_role;

-- ── report_* functions — the admin edge fn calls these, never raw SQL ────────
create or replace function public.report_funnel(p_from date, p_to date)
returns setof public.v_funnel_first_gen language sql security definer set search_path = public, pg_temp
as $$ select * from public.v_funnel_first_gen where day between p_from and p_to order by day $$;

create or replace function public.report_preferences(p_from date, p_to date)
returns setof public.v_settlement_preferences language sql security definer set search_path = public, pg_temp
as $$ select * from public.v_settlement_preferences where day between p_from and p_to $$;

create or replace function public.report_edit_heatmap(p_from date, p_to date)
returns setof public.v_edit_heatmap language sql security definer set search_path = public, pg_temp
as $$ select * from public.v_edit_heatmap where day between p_from and p_to $$;

create or replace function public.report_ai_usage(p_from date, p_to date)
returns setof public.v_ai_usage language sql security definer set search_path = public, pg_temp
as $$ select * from public.v_ai_usage where day between p_from and p_to order by day $$;

create or replace function public.report_retention()
returns setof public.mv_retention_cohorts language sql security definer set search_path = public, pg_temp
as $$ select * from public.mv_retention_cohorts order by cohort_day, day_offset $$;

revoke all on function public.report_funnel(date, date) from public;
revoke all on function public.report_preferences(date, date) from public;
revoke all on function public.report_edit_heatmap(date, date) from public;
revoke all on function public.report_ai_usage(date, date) from public;
revoke all on function public.report_retention() from public;
grant execute on function public.report_funnel(date, date) to service_role;
grant execute on function public.report_preferences(date, date) to service_role;
grant execute on function public.report_edit_heatmap(date, date) to service_role;
grant execute on function public.report_ai_usage(date, date) to service_role;
grant execute on function public.report_retention() to service_role;
