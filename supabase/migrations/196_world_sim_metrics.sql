-- ────────────────────────────────────────────────────────────────────────────
-- 196_world_sim_metrics.sql — storage for the SIMULATION metric class
-- (OWNER_DECISION_QUEUE.md §117a, §120.2; the chair's §149.2 ruling on OQ-1).
--
-- WHAT LANDS HERE
--   One EAV table for engine evidence produced by the diagnostic soak harness, plus
--   a service-role loader and a run-scoped rollup in the 038/133 idiom. Nothing in
--   the running product reads or writes it, and no client bundle knows it exists.
--
-- ⛔ PII-FREE BY SCHEMA, NOT BY POLICY
--   There is no actor column, no session column, no country column and no consent
--   column on this table. The property therefore cannot regress by a policy edit or
--   a forgotten filter: the columns are simply not there. That is the whole reason
--   the simulation class got its OWN table rather than a discriminator on
--   analytics_events — §120.2's "PII-free BY SCHEMA in its own table", executed.
--   tests/lint/engineTelemetryWall.walker.test.js walks this DDL and reds on a
--   forbidden column name; tests/security/worldSimMetrics.pglite.test.js proves a
--   planted one is catchable.
--
-- ⚠ RETENTION IS INDEFINITE — PROPOSED WITH ITS RATIONALE, VETOABLE
--   Deliberately NOT a mirror of 039's 400-day raw-event prune, and the contrast is
--   stated here so a reader does not read the absence as an oversight. Three reasons:
--   (1) there is nothing to delete FOR anyone — no row is attributable to a person,
--   so no deletion obligation can attach to one; (2) the rows ARE the tuning
--   evidence, and a curve baseline re-derived after a prune would be re-derived from
--   a truncated history; (3) volume is bounded by soak cadence, which is an operator
--   decision, not by user growth. No prune job is created. Say "veto" to add one.
--
-- INDEXES — INHERITED, not re-derived. The 036 header's own scale math applies
--   unchanged: BRIN on the append-only timestamp (cheap over a monotonic column) and
--   ONE run-scoped btree, because every real read is "one run, one metric, in epoch
--   order". No third index is added on speculation.
--
-- House security: RLS on with ZERO policies (deny-all), grants revoked from the API
-- roles, all functions SECURITY DEFINER with search_path pinned and execute granted
-- to service_role only. Re-runnable. WRITTEN, NOT DEPLOYED — `supabase db push`
-- stays the owner's step.
-- ────────────────────────────────────────────────────────────────────────────

create table if not exists public.world_sim_metrics (
  run_id             text        not null,
  seed_family        text        not null,
  scale              integer     not null,
  horizon            integer     not null,
  profile            text        not null,
  source_fingerprint text        not null,
  schema_version     integer     not null,
  metric             text        not null,
  epoch_kind         text        not null,
  epoch_index        integer     not null,
  dims               jsonb       not null default '{}'::jsonb,
  value              numeric     not null,
  recorded_at        timestamptz not null default now()
);

-- The epoch vocabulary is the registry's measured two. A third value is a schema
-- act, not a data act — which is what keeps the emitter honest about resampling.
do $$ begin
  if not exists (
    select from pg_constraint where conname = 'world_sim_metrics_epoch_kind_check'
  ) then
    alter table public.world_sim_metrics
      add constraint world_sim_metrics_epoch_kind_check
      check (epoch_kind in ('run', 'year'));
  end if;
end $$;

create index if not exists world_sim_metrics_recorded_at_brin
  on public.world_sim_metrics using brin (recorded_at);

create index if not exists world_sim_metrics_run_metric_epoch_idx
  on public.world_sim_metrics (run_id, metric, epoch_index);

alter table public.world_sim_metrics enable row level security;

-- Deny-all: RLS is ON and NO policy exists, so anon/authenticated see nothing even
-- if a grant is ever added by accident. The revokes below are the second belt.
revoke all on table public.world_sim_metrics from anon;
revoke all on table public.world_sim_metrics from authenticated;
grant select, insert on table public.world_sim_metrics to service_role;

-- ── LOADER (service-role only) ───────────────────────────────────────────────
-- Takes the emitter's JSONL as one jsonb array so a run loads in one statement and
-- a partial load cannot leave a half-run behind. Returns the row count it wrote.
create or replace function public.load_sim_metrics(p_rows jsonb)
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_count integer;
begin
  if jsonb_typeof(p_rows) <> 'array' then
    raise exception 'load_sim_metrics expects a jsonb array of metric rows';
  end if;
  insert into public.world_sim_metrics (
    run_id, seed_family, scale, horizon, profile, source_fingerprint,
    schema_version, metric, epoch_kind, epoch_index, dims, value
  )
  select
    row_data->>'run_id',
    row_data->>'seed_family',
    (row_data->>'scale')::integer,
    (row_data->>'horizon')::integer,
    row_data->>'profile',
    row_data->>'source_fingerprint',
    (row_data->>'schema_version')::integer,
    row_data->>'metric',
    row_data->>'epoch_kind',
    (row_data->>'epoch_index')::integer,
    coalesce(row_data->'dims', '{}'::jsonb),
    (row_data->>'value')::numeric
  from jsonb_array_elements(p_rows) as row_data;
  get diagnostics v_count = row_count;
  return v_count;
end $$;

revoke all on function public.load_sim_metrics(jsonb) from public;
grant execute on function public.load_sim_metrics(jsonb) to service_role;

-- ── RUN-SCOPED ROLLUP (the 038/133 EAV shape, verbatim idiom) ────────────────
-- metric / dims / value, exactly as analytics_daily_rollups spells it, so a reader
-- who knows one rollup surface knows this one. Aggregated across epochs.
create or replace function public.rollup_sim_metrics(p_run_id text)
returns table (metric text, dims jsonb, value numeric)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select m.metric, m.dims, sum(m.value) as value
  from public.world_sim_metrics m
  where m.run_id = p_run_id
  group by m.metric, m.dims
  order by m.metric, m.dims::text
$$;

revoke all on function public.rollup_sim_metrics(text) from public;
grant execute on function public.rollup_sim_metrics(text) to service_role;
