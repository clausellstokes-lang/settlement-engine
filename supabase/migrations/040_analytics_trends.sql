-- ────────────────────────────────────────────────────────────────────────────
-- 040_analytics_trends.sql — period-bucketed report functions for the admin
-- Trends panel (docs/simulation-intelligence-layer.md §9, "interpret, don't
-- manipulate"). Companion to the 038 report_* family.
--
-- Four SECURITY DEFINER functions, service-role only, that turn the raw
-- analytics planes into the four shapes a trends dashboard needs:
--
--   report_trend(metric, granularity, from, to)        → a gap-filled time series
--   report_distribution(field, from, to, granularity?) → a category breakdown,
--                                                         optionally over time
--   report_summary(from, to)                           → headline KPIs with the
--                                                         prior-period comparison
--   report_crosstab(row, col, from, to)                → a two-dimension heatmap
--
-- Data sources, by design:
--   • analytics_events  — activity counts, active users, and (crucially) the
--     reduced fingerprint folded into `generation_completed` props. That fold
--     is ESSENTIAL-class and captured for EVERY user, so config-dimension
--     distributions (culture / terrain / magic / route / threat) come from
--     props->>'…' here, NOT from settlement_snapshots.structural (which is only
--     populated for research-consent rows). See structuralFingerprint.js +
--     settlementSlice generate path.
--   • edit_events       — what users edit (kind breakdown).
--   • settlement_snapshots — lifecycle capture_point distribution.
--
-- Anti-injection: every caller-supplied metric / field / granularity is matched
-- against a HARDCODED allowlist; the SQL fragment that reaches EXECUTE is chosen
-- from that allowlist, never echoed from input. An unknown value RAISES. The
-- edge function (admin-actions) assembles no SQL of its own — it only passes the
-- four scalar args through to these functions.
--
-- Privilege: RLS-on tables + SECURITY DEFINER here means the only legitimate
-- caller is the service role (admin-actions, behind its developer/admin gate).
-- We revoke from public and grant execute to service_role, mirroring 038.
-- ────────────────────────────────────────────────────────────────────────────

-- ── helper: validated config/output dimension → props expression ─────────────
-- Pure (no table access). Returns the SAFE sql fragment for a generation_completed
-- dimension, or NULL when the field is not one of these. Used by report_trend
-- (avg_* metrics), report_distribution, and report_crosstab so the allowlist
-- lives in exactly one place.
create or replace function public._gc_dim_sql(p_field text)
returns text language sql immutable set search_path = pg_temp as $$
  select case p_field
    when 'tier'            then $expr$ props->>'tier' $expr$
    when 'population_band' then $expr$ props->>'population_band' $expr$
    when 'culture'         then $expr$ props->>'culture' $expr$
    when 'terrain'         then $expr$ props->>'terrainType' $expr$
    when 'trade_route'     then $expr$ props->>'tradeRouteAccess' $expr$
    when 'magic_level'     then $expr$ props->>'magicLevel' $expr$
    when 'monster_threat'  then $expr$ props->>'monsterThreat' $expr$
    when 'prosperity'      then $expr$ props->>'prosperity' $expr$
    else null
  end;
$$;

-- ── helper: validated granularity → date_trunc unit ──────────────────────────
create or replace function public._trunc_unit(p_granularity text)
returns text language sql immutable set search_path = pg_temp as $$
  select case lower(coalesce(p_granularity, 'day'))
    when 'day' then 'day' when 'week' then 'week' when 'month' then 'month'
    when 'quarter' then 'quarter' when 'year' then 'year' else null
  end;
$$;

-- ════════════════════════════════════════════════════════════════════════════
-- report_trend — one metric, bucketed by granularity, gap-filled to a continuous
-- series so the chart never has to infer missing periods.
-- Returns (bucket date, value numeric). bucket = first day of the period.
-- ════════════════════════════════════════════════════════════════════════════
create or replace function public.report_trend(
  p_metric      text,
  p_granularity text default 'day',
  p_from        date default (current_date - 30),
  p_to          date default current_date
) returns table(bucket date, value numeric)
language plpgsql security definer set search_path = public, pg_temp as $body$
declare
  g    text := public._trunc_unit(p_granularity);
  step text;
  agg  text;   -- a sub-select yielding (b date, v numeric)
begin
  if g is null then raise exception 'invalid granularity: %', p_granularity; end if;
  if p_from is null or p_to is null or p_to < p_from then
    raise exception 'invalid date range';
  end if;
  step := case g when 'day' then '1 day' when 'week' then '1 week'
                 when 'month' then '1 month' when 'quarter' then '3 months'
                 else '1 year' end;

  -- metric allowlist → aggregate over the right source. Each branch produces a
  -- relation (b, v); the outer query gap-fills it against a generated series.
  agg := case p_metric
    -- ── activity counts (analytics_events) ──────────────────────────────────
    when 'generations'        then $q$ select date_trunc(%1$L, created_at)::date b, count(*)::numeric v from public.analytics_events where event = 'generation_completed' $q$
    when 'generations_started' then $q$ select date_trunc(%1$L, created_at)::date b, count(*)::numeric v from public.analytics_events where event = 'generation_started' $q$
    when 'anon_generations'   then $q$ select date_trunc(%1$L, created_at)::date b, count(*)::numeric v from public.analytics_events where event = 'anonymous_generation_completed' $q$
    when 'regenerations'      then $q$ select date_trunc(%1$L, created_at)::date b, count(*)::numeric v from public.analytics_events where event = 'regeneration_triggered' $q$
    when 'saves'              then $q$ select date_trunc(%1$L, created_at)::date b, count(*)::numeric v from public.analytics_events where event = 'settlement_saved' $q$
    when 'pdf_exports'        then $q$ select date_trunc(%1$L, created_at)::date b, count(*)::numeric v from public.analytics_events where event = 'pdf_export_completed' $q$
    when 'ai_generations'     then $q$ select date_trunc(%1$L, created_at)::date b, count(*)::numeric v from public.analytics_events where event = 'ai_generation_completed' $q$
    when 'ai_failures'        then $q$ select date_trunc(%1$L, created_at)::date b, count(*)::numeric v from public.analytics_events where event = 'ai_generation_failed' $q$
    when 'canonizations'      then $q$ select date_trunc(%1$L, created_at)::date b, count(*)::numeric v from public.analytics_events where event = 'world_canonized' $q$
    when 'pulse_advances'     then $q$ select date_trunc(%1$L, created_at)::date b, count(*)::numeric v from public.analytics_events where event = 'world_pulse_advanced' $q$
    when 'gallery_publishes'  then $q$ select date_trunc(%1$L, created_at)::date b, count(*)::numeric v from public.analytics_events where event = 'gallery_published' $q$
    when 'neighbours'         then $q$ select date_trunc(%1$L, created_at)::date b, count(*)::numeric v from public.analytics_events where event = 'neighbour_generated' $q$
    when 'signups'            then $q$ select date_trunc(%1$L, created_at)::date b, count(*)::numeric v from public.analytics_events where event = 'signup_completed' $q$
    when 'premium_purchases'  then $q$ select date_trunc(%1$L, created_at)::date b, count(*)::numeric v from public.analytics_events where event = 'premium_purchased' $q$
    when 'sessions'           then $q$ select date_trunc(%1$L, created_at)::date b, count(distinct session_id)::numeric v from public.analytics_events where session_id is not null $q$
    when 'active_users'       then $q$ select date_trunc(%1$L, created_at)::date b, count(distinct actor_id)::numeric v from public.analytics_events where actor_id is not null $q$
    -- ── edits (edit_events) ─────────────────────────────────────────────────
    when 'edits'              then $q$ select date_trunc(%1$L, created_at)::date b, count(*)::numeric v from public.edit_events where true $q$
    when 'edit_reverts'       then $q$ select date_trunc(%1$L, created_at)::date b, count(*)::numeric v from public.edit_events where reverted = true $q$
    -- ── output-shape averages (generation_completed reduced fingerprint) ─────
    when 'avg_institution_count' then $q$ select date_trunc(%1$L, created_at)::date b, round(avg((props->>'institution_count')::numeric), 2) v from public.analytics_events where event = 'generation_completed' $q$
    when 'avg_npc_count'         then $q$ select date_trunc(%1$L, created_at)::date b, round(avg((props->>'npc_count')::numeric), 2) v from public.analytics_events where event = 'generation_completed' $q$
    when 'avg_faction_count'     then $q$ select date_trunc(%1$L, created_at)::date b, round(avg((props->>'faction_count')::numeric), 2) v from public.analytics_events where event = 'generation_completed' $q$
    when 'avg_condition_count'   then $q$ select date_trunc(%1$L, created_at)::date b, round(avg((props->>'condition_count')::numeric), 2) v from public.analytics_events where event = 'generation_completed' $q$
    when 'avg_stressor_count'    then $q$ select date_trunc(%1$L, created_at)::date b, round(avg((props->>'stressor_count')::numeric), 2) v from public.analytics_events where event = 'generation_completed' $q$
    else null
  end;
  if agg is null then raise exception 'invalid metric: %', p_metric; end if;

  -- Gap-fill: a generated series of buckets LEFT JOINed to the aggregate so the
  -- frontend gets a value (0 where nothing happened) for every period.
  return query execute format($tpl$
    with series as (
      select generate_series(
               date_trunc(%1$L, %2$L::timestamptz),
               date_trunc(%1$L, %3$L::timestamptz),
               %4$L::interval
             )::date as bucket
    ),
    data as (
      %5$s and created_at >= %2$L and created_at < (%3$L::date + 1) group by 1
    )
    select s.bucket, coalesce(d.v, 0)::numeric as value
      from series s left join data d on d.b = s.bucket
     order by s.bucket
  $tpl$, g, p_from, p_to, step, format(agg, g));
end $body$;

-- ════════════════════════════════════════════════════════════════════════════
-- report_distribution — category breakdown for one field. With p_granularity
-- NULL/'all' you get the overall distribution (bucket NULL); with a granularity
-- you get the distribution per period (for stacked-bar-over-time).
-- Returns (bucket date, dim text, value numeric).
-- ════════════════════════════════════════════════════════════════════════════
create or replace function public.report_distribution(
  p_field       text,
  p_from        date default (current_date - 30),
  p_to          date default current_date,
  p_granularity text default null,
  p_limit       int  default 100
) returns table(bucket date, dim text, value numeric)
language plpgsql security definer set search_path = public, pg_temp as $body$
declare
  g        text;
  src      text;
  dim_sql  text := public._gc_dim_sql(p_field);
  where_s  text;
  lim      int  := least(greatest(coalesce(p_limit, 100), 1), 1000);
begin
  if p_from is null or p_to is null or p_to < p_from then
    raise exception 'invalid date range';
  end if;

  -- Field allowlist. generation_completed config/output dims resolve via the
  -- shared helper; everything else is an explicit (source, dim, filter) triple.
  if dim_sql is not null then
    src := 'public.analytics_events';  where_s := $w$ event = 'generation_completed' $w$;
  else
    case p_field
      when 'mode'                  then src := 'public.analytics_events';     dim_sql := $d$ props->>'mode' $d$;              where_s := $w$ event = 'generation_started' $w$;
      when 'regen_mode'            then src := 'public.analytics_events';     dim_sql := $d$ props->>'regen_mode' $d$;        where_s := $w$ event = 'regeneration_triggered' $w$;
      when 'ai_type'               then src := 'public.analytics_events';     dim_sql := $d$ props->>'type' $d$;              where_s := $w$ event = 'ai_generation_started' $w$;
      when 'neighbour_relationship' then src := 'public.analytics_events';    dim_sql := $d$ props->>'relationship_type' $d$; where_s := $w$ event = 'neighbour_generated' $w$;
      when 'capture_point'         then src := 'public.settlement_snapshots'; dim_sql := 'capture_point';                     where_s := 'true';
      when 'edit_kind'             then src := 'public.edit_events';          dim_sql := 'kind';                             where_s := 'true';
      when 'edit_target'           then src := 'public.edit_events';          dim_sql := 'target_kind';                      where_s := 'true';
      else raise exception 'invalid field: %', p_field;
    end case;
  end if;

  if p_granularity is null or lower(p_granularity) in ('', 'all', 'overall') then
    -- overall distribution (single bucket NULL), top-N by frequency
    return query execute format($tpl$
      select null::date as bucket, coalesce(%1$s, 'unknown') as dim, count(*)::numeric as value
        from %2$s
       where %3$s and created_at >= %4$L and created_at < (%5$L::date + 1)
       group by 2 order by value desc limit %6$s
    $tpl$, dim_sql, src, where_s, p_from, p_to, lim);
  else
    g := public._trunc_unit(p_granularity);
    if g is null then raise exception 'invalid granularity: %', p_granularity; end if;
    return query execute format($tpl$
      select date_trunc(%1$L, created_at)::date as bucket, coalesce(%2$s, 'unknown') as dim, count(*)::numeric as value
        from %3$s
       where %4$s and created_at >= %5$L and created_at < (%6$L::date + 1)
       group by 1, 2 order by 1, 3 desc
    $tpl$, g, dim_sql, src, where_s, p_from, p_to);
  end if;
end $body$;

-- ════════════════════════════════════════════════════════════════════════════
-- report_summary — headline KPIs for [from,to] alongside the immediately
-- preceding equal-length window, so the panel can render period-over-period
-- deltas. Returns one row per metric: (metric, current_value, prior_value).
-- ════════════════════════════════════════════════════════════════════════════
create or replace function public.report_summary(
  p_from date default (current_date - 30),
  p_to   date default current_date
) returns table(metric text, current_value numeric, prior_value numeric)
language plpgsql security definer set search_path = public, pg_temp as $body$
declare
  span       int  := (p_to - p_from) + 1;
  prior_to   date := p_from - 1;
  prior_from date := p_from - span;
begin
  if p_from is null or p_to is null or p_to < p_from then
    raise exception 'invalid date range';
  end if;

  return query
  with ev as (
    select event, actor_id, (created_at)::date as d
      from public.analytics_events
     where created_at >= prior_from and created_at < (p_to + 1)
  ),
  ed as (
    select (created_at)::date as d
      from public.edit_events
     where created_at >= prior_from and created_at < (p_to + 1)
  ),
  gc as (
    select (props->>'institution_count')::numeric as ic,
           (props->>'npc_count')::numeric         as nc,
           (props->>'faction_count')::numeric     as fc,
           (created_at)::date as d
      from public.analytics_events
     where event = 'generation_completed' and created_at >= prior_from and created_at < (p_to + 1)
  )
  select * from ( values
    ('generations',  (select count(*) from ev where event='generation_completed' and d between p_from and p_to)::numeric,
                     (select count(*) from ev where event='generation_completed' and d between prior_from and prior_to)::numeric),
    ('active_users', (select count(distinct actor_id) from ev where actor_id is not null and d between p_from and p_to)::numeric,
                     (select count(distinct actor_id) from ev where actor_id is not null and d between prior_from and prior_to)::numeric),
    ('regenerations',(select count(*) from ev where event='regeneration_triggered' and d between p_from and p_to)::numeric,
                     (select count(*) from ev where event='regeneration_triggered' and d between prior_from and prior_to)::numeric),
    ('saves',        (select count(*) from ev where event='settlement_saved' and d between p_from and p_to)::numeric,
                     (select count(*) from ev where event='settlement_saved' and d between prior_from and prior_to)::numeric),
    ('ai_generations',(select count(*) from ev where event='ai_generation_completed' and d between p_from and p_to)::numeric,
                     (select count(*) from ev where event='ai_generation_completed' and d between prior_from and prior_to)::numeric),
    ('pdf_exports',  (select count(*) from ev where event='pdf_export_completed' and d between p_from and p_to)::numeric,
                     (select count(*) from ev where event='pdf_export_completed' and d between prior_from and prior_to)::numeric),
    ('canonizations',(select count(*) from ev where event='world_canonized' and d between p_from and p_to)::numeric,
                     (select count(*) from ev where event='world_canonized' and d between prior_from and prior_to)::numeric),
    ('signups',      (select count(*) from ev where event='signup_completed' and d between p_from and p_to)::numeric,
                     (select count(*) from ev where event='signup_completed' and d between prior_from and prior_to)::numeric),
    ('premium_purchases',(select count(*) from ev where event='premium_purchased' and d between p_from and p_to)::numeric,
                     (select count(*) from ev where event='premium_purchased' and d between prior_from and prior_to)::numeric),
    ('edits',        (select count(*) from ed where d between p_from and p_to)::numeric,
                     (select count(*) from ed where d between prior_from and prior_to)::numeric),
    ('avg_institutions',(select round(avg(ic),2) from gc where d between p_from and p_to),
                     (select round(avg(ic),2) from gc where d between prior_from and prior_to)),
    ('avg_npcs',     (select round(avg(nc),2) from gc where d between p_from and p_to),
                     (select round(avg(nc),2) from gc where d between prior_from and prior_to)),
    ('avg_factions', (select round(avg(fc),2) from gc where d between p_from and p_to),
                     (select round(avg(fc),2) from gc where d between prior_from and prior_to))
  ) as t(metric, current_value, prior_value);
end $body$;

-- ════════════════════════════════════════════════════════════════════════════
-- report_crosstab — two generation_completed dimensions cross-tabulated, for a
-- "which culture/terrain combinations do users actually pick" heatmap.
-- Returns (row_dim text, col_dim text, value numeric). Both fields are limited
-- to the config/output allowlist (via _gc_dim_sql).
-- ════════════════════════════════════════════════════════════════════════════
create or replace function public.report_crosstab(
  p_row  text,
  p_col  text,
  p_from date default (current_date - 30),
  p_to   date default current_date,
  p_limit int default 400
) returns table(row_dim text, col_dim text, value numeric)
language plpgsql security definer set search_path = public, pg_temp as $body$
declare
  rexpr text := public._gc_dim_sql(p_row);
  cexpr text := public._gc_dim_sql(p_col);
  lim   int  := least(greatest(coalesce(p_limit, 400), 1), 2000);
begin
  if rexpr is null then raise exception 'invalid row field: %', p_row; end if;
  if cexpr is null then raise exception 'invalid col field: %', p_col; end if;
  if p_from is null or p_to is null or p_to < p_from then
    raise exception 'invalid date range';
  end if;

  return query execute format($tpl$
    select coalesce(%1$s, 'unknown') as row_dim,
           coalesce(%2$s, 'unknown') as col_dim,
           count(*)::numeric as value
      from public.analytics_events
     where event = 'generation_completed' and created_at >= %3$L and created_at < (%4$L::date + 1)
     group by 1, 2 order by 3 desc limit %5$s
  $tpl$, rexpr, cexpr, p_from, p_to, lim);
end $body$;

-- ── grants: service-role only (mirrors 038) ──────────────────────────────────
revoke all on function public._gc_dim_sql(text)                       from public;
revoke all on function public._trunc_unit(text)                       from public;
revoke all on function public.report_trend(text, text, date, date)    from public;
revoke all on function public.report_distribution(text, date, date, text, int) from public;
revoke all on function public.report_summary(date, date)              from public;
revoke all on function public.report_crosstab(text, text, date, date, int)     from public;

grant execute on function public.report_trend(text, text, date, date)    to service_role;
grant execute on function public.report_distribution(text, date, date, text, int) to service_role;
grant execute on function public.report_summary(date, date)              to service_role;
grant execute on function public.report_crosstab(text, text, date, date, int)     to service_role;
-- _gc_dim_sql / _trunc_unit are called only from the definer functions above
-- (which run as owner), so they need no direct grant.
