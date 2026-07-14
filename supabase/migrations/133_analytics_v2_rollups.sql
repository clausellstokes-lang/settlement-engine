-- ────────────────────────────────────────────────────────────────────────────
-- 133_analytics_v2_rollups.sql — the Analytics v2 aggregation/rollup layer
-- (DESIGN_ANALYTICS_V2.md §2 rollup tier, §1.2-1.5 groupings, §4 sellable pack).
--
-- Rollups are the ONLY surface any consumer reads (raw events are an implementation
-- detail, §2). Two tiers land here, both READ-ONLY over analytics_events — nothing
-- feeds back into a running world (the §7 data-endogeneity law: telemetry never tunes
-- a live world, only the next release's constants):
--
--   TIER 1 — INTERNAL v2 grouping rollups (planes 1 & 2: TUNING + CONSTRUCTION
--     INSIGHT). rollup_analytics_v2_daily(day) folds the §1.2-1.5 groupings into the
--     existing analytics_daily_rollups EAV table (additive metric names; a migration
--     adds rows, never mutates semantics). These are the owner's tuning + roadmap
--     reads — service-role only, not sold.
--
--   TIER 2 — the SELLABLE MARKET AGGREGATE (plane 3, §4). k-anonymous report_market_*
--     functions with the HARD LINES: AGGREGATE-ONLY with k-anonymity floors (k=50
--     users / 200 campaigns, owner-tunable UPWARD only via the two floor functions
--     below); filtered on the market-insights consent plane stamp (market_opt_in) AND
--     restricted to the production corpus (corpus = 'production' → dogfood + synthetic
--     + legacy-unknown are structurally excluded); id-free by construction (built from
--     enums/bands/counts in props, never content).
--
-- ⚠️ CAMPAIGN-FLOOR PREREQUISITE: the k=200-CAMPAIGNS floor counts distinct subject_id
--    (the settlement/map/campaign uuid). The current v2 campaign events (world_pulse_
--    advanced / world_canonized / generation_completed) do NOT yet stamp subject_id, so
--    those market cells suppress (fail-closed) until capture stamps it — a documented
--    capture-side follow-up. The floor logic is correct and tested regardless (the
--    pglite test inserts subject-bearing rows to prove suppress-below / emit-at-floor).
--
-- House security: all functions SECURITY DEFINER, search_path pinned, service-role
-- execute only (mirrors 038). Re-runnable (CREATE OR REPLACE). WRITTEN, NOT DEPLOYED —
-- `supabase db push` stays the owner's step; wiring into the nightly cron is automatic
-- via the analytics_nightly_maintenance amendment at the foot of this file.
-- ────────────────────────────────────────────────────────────────────────────

-- ── k-anonymity floors (§4 — owner-tunable UPWARD only; the single source) ───
-- Immutable so they inline into the HAVING clauses. To tighten a floor, raise the
-- returned constant (never lower it — the design forbids lowering).
create or replace function public.market_k_min_users()
returns integer language sql immutable set search_path = public, pg_temp
as $$ select 50 $$;

create or replace function public.market_k_min_campaigns()
returns integer language sql immutable set search_path = public, pg_temp
as $$ select 200 $$;

revoke all on function public.market_k_min_users() from public;
revoke all on function public.market_k_min_campaigns() from public;
grant execute on function public.market_k_min_users() to service_role;
grant execute on function public.market_k_min_campaigns() to service_role;

-- ── TIER 1: internal v2 grouping rollups → analytics_daily_rollups ────────────
-- Every insert is idempotent (on conflict (day, metric, dims) do update) so a re-run
-- for the same day is a no-op-equivalent overwrite — the ratchet-safe rollup idiom
-- (matches rollup_analytics_daily, migration 038).
create or replace function public.rollup_analytics_v2_daily(p_day date default (now()::date - 1))
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare v_rows integer := 0; v_n integer;
begin
  -- §1.2 CONSTRUCTION: config-archetype popularity × tier (the demand signal for what
  -- players build). Reads generation_completed props (config_archetype ∈ the small
  -- named taxonomy; tier enum). id-free — enums only.
  insert into public.analytics_daily_rollups (day, metric, dims, value)
  select p_day, 'construction_archetype',
         jsonb_build_object('archetype', coalesce(props->>'config_archetype', 'unknown'),
                            'tier', coalesce(props->>'tier', 'unknown')),
         count(*)
  from public.analytics_events
  where event = 'generation_completed' and created_at::date = p_day
  group by props->>'config_archetype', props->>'tier'
  on conflict (day, metric, dims) do update set value = excluded.value;
  get diagnostics v_n = row_count; v_rows := v_rows + v_n;

  -- §1.2 CONSTRUCTION: generation mode (fresh vs regeneration) — the re-roll signal.
  insert into public.analytics_daily_rollups (day, metric, dims, value)
  select p_day, 'construction_mode',
         jsonb_build_object('is_regeneration', coalesce(props->>'is_regeneration', 'false')),
         count(*)
  from public.analytics_events
  where event = 'generation_completed' and created_at::date = p_day
  group by props->>'is_regeneration'
  on conflict (day, metric, dims) do update set value = excluded.value;
  get diagnostics v_n = row_count; v_rows := v_rows + v_n;

  -- §1.3 REALM: preset adoption (the single most tuning-and-market-relevant signal —
  -- which drama dials the market actually turns on). Reads world_pulse_advanced's
  -- sim_config.preset_id.
  insert into public.analytics_daily_rollups (day, metric, dims, value)
  select p_day, 'realm_preset_adoption',
         jsonb_build_object('preset_id', coalesce(props#>>'{sim_config,preset_id}', 'none')),
         count(*)
  from public.analytics_events
  where event = 'world_pulse_advanced' and created_at::date = p_day
  group by props#>>'{sim_config,preset_id}'
  on conflict (day, metric, dims) do update set value = excluded.value;
  get diagnostics v_n = row_count; v_rows := v_rows + v_n;

  -- §1.3 REALM: feature-flag adoption — unnest the enabled 5.5 flags (flags_on list).
  insert into public.analytics_daily_rollups (day, metric, dims, value)
  select p_day, 'realm_flag_adoption',
         jsonb_build_object('flag', flag.value),
         count(*)
  from public.analytics_events e
       cross join lateral jsonb_array_elements_text(
         case when jsonb_typeof(e.props#>'{sim_config,flags_on}') = 'array'
              then e.props#>'{sim_config,flags_on}' else '[]'::jsonb end) as flag(value)
  where e.event = 'world_pulse_advanced' and e.created_at::date = p_day
  group by flag.value
  on conflict (day, metric, dims) do update set value = excluded.value;
  get diagnostics v_n = row_count; v_rows := v_rows + v_n;

  -- §1.3 REALM: topology class × settlement-count band (the "what DMs build" shape).
  insert into public.analytics_daily_rollups (day, metric, dims, value)
  select p_day, 'realm_topology',
         jsonb_build_object('topology_class', coalesce(props->>'topology_class', 'unknown'),
                            'settlement_count_band', coalesce(props->>'settlement_count_band', 'unknown')),
         count(*)
  from public.analytics_events
  where event = 'world_canonized' and created_at::date = p_day
  group by props->>'topology_class', props->>'settlement_count_band'
  on conflict (day, metric, dims) do update set value = excluded.value;
  get diagnostics v_n = row_count; v_rows := v_rows + v_n;

  -- §1.4 APPROVAL RATES: proposal apply vs dismiss by outcome type (approval friction
  -- IS the autonomy-tuning signal). Both events carry props.proposal_type.
  insert into public.analytics_daily_rollups (day, metric, dims, value)
  select p_day, 'approval_decision',
         jsonb_build_object('proposal_type', coalesce(props->>'proposal_type', 'unknown'),
                            'decision', case when event = 'world_pulse_proposal_applied' then 'applied' else 'dismissed' end),
         count(*)
  from public.analytics_events
  where event in ('world_pulse_proposal_applied', 'world_pulse_proposal_dismissed')
    and created_at::date = p_day
  group by props->>'proposal_type', event
  on conflict (day, metric, dims) do update set value = excluded.value;
  get diagnostics v_n = row_count; v_rows := v_rows + v_n;

  -- §1.5 TUNING: mover-layer adoption — which movers actually fire in real play
  -- (unnest movers_active). A coarse distributed-soak distribution.
  insert into public.analytics_daily_rollups (day, metric, dims, value)
  select p_day, 'tuning_mover_adoption',
         jsonb_build_object('mover', mover.value),
         count(*)
  from public.analytics_events e
       cross join lateral jsonb_array_elements_text(
         case when jsonb_typeof(e.props->'movers_active') = 'array'
              then e.props->'movers_active' else '[]'::jsonb end) as mover(value)
  where e.event = 'world_pulse_advanced' and e.created_at::date = p_day
  group by mover.value
  on conflict (day, metric, dims) do update set value = excluded.value;
  get diagnostics v_n = row_count; v_rows := v_rows + v_n;

  return v_rows;
end;
$$;
revoke all on function public.rollup_analytics_v2_daily(date) from public;
grant execute on function public.rollup_analytics_v2_daily(date) to service_role;

-- ── TIER 2: the SELLABLE MARKET AGGREGATE (§4, plane 3) ──────────────────────
-- Common filter for EVERY market read (encapsulated so no report can forget a line):
--   market_opt_in = true      → the actor opted into the sellable plane (§5)
--   corpus = 'production'      → real users only (dogfood/synthetic/legacy excluded)
-- The k-anonymity floors are applied per report in HAVING (users AND campaigns).

-- §4: archetype popularity curves (the "what DMs build" atlas — archetype × tier).
create or replace function public.report_market_archetype_popularity(p_from date, p_to date)
returns table (archetype text, tier text, generations bigint, distinct_users bigint, distinct_campaigns bigint)
language sql
security definer
set search_path = public, pg_temp
as $$
  select coalesce(props->>'config_archetype', 'unknown') as archetype,
         coalesce(props->>'tier', 'unknown') as tier,
         count(*) as generations,
         count(distinct actor_id) as distinct_users,
         count(distinct subject_id) as distinct_campaigns
  from public.analytics_events
  where event = 'generation_completed'
    and market_opt_in = true and corpus = 'production'
    and created_at::date between p_from and p_to
  group by props->>'config_archetype', props->>'tier'
  -- k-anonymity HARD LINE: suppress any cell under the user OR campaign floor.
  having count(distinct actor_id) >= public.market_k_min_users()
     and count(distinct subject_id) >= public.market_k_min_campaigns()
  order by generations desc
$$;

-- §4: drama tolerance — preset adoption (which drama dials the market turns on).
create or replace function public.report_market_preset_adoption(p_from date, p_to date)
returns table (preset_id text, advances bigint, distinct_users bigint, distinct_campaigns bigint)
language sql
security definer
set search_path = public, pg_temp
as $$
  select coalesce(props#>>'{sim_config,preset_id}', 'none') as preset_id,
         count(*) as advances,
         count(distinct actor_id) as distinct_users,
         count(distinct subject_id) as distinct_campaigns
  from public.analytics_events
  where event = 'world_pulse_advanced'
    and market_opt_in = true and corpus = 'production'
    and created_at::date between p_from and p_to
  group by props#>>'{sim_config,preset_id}'
  having count(distinct actor_id) >= public.market_k_min_users()
     and count(distinct subject_id) >= public.market_k_min_campaigns()
  order by advances desc
$$;

revoke all on function public.report_market_archetype_popularity(date, date) from public;
revoke all on function public.report_market_preset_adoption(date, date) from public;
grant execute on function public.report_market_archetype_popularity(date, date) to service_role;
grant execute on function public.report_market_preset_adoption(date, date) to service_role;

-- ── Wire the v2 rollups into the existing nightly maintenance (039) ──────────
-- Re-defining analytics_nightly_maintenance (latest-wins across the chain) means the
-- already-scheduled 'analytics-rollup-daily' cron runs the v2 grouping rollups too, on
-- deploy — no new schedule, no cron privilege needed. The market reports are pull-only
-- (a quarterly cut, §8), so they are NOT in the nightly job.
create or replace function public.analytics_nightly_maintenance()
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  perform public.rollup_analytics_daily();
  perform public.rollup_analytics_v2_daily();
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
