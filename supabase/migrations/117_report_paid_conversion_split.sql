-- 117_report_paid_conversion_split.sql
--
-- Split the admin Trends panel's single paid-conversion metric into the three
-- purchase types the analytics registry now emits, plus a combined total.
--
-- WHY
--   040 hardcoded `premium_purchased` as the ONLY paid-conversion metric in both
--   report_trend (the 'premium_purchases' branch) and report_summary (the
--   'premium_purchases' row). Two more purchase events exist:
--     • `single_dossier_purchased` (the anon $2.99 one-shot dossier) — ALREADY
--       emitted today (SingleDossierSuccessPage), so that revenue lands in
--       analytics_events but reaches neither report function, and therefore
--       never the dashboard.
--     • `credit_pack_purchased` (the narrative credit packs) — registered and
--       emitted by the IN-FLIGHT registry-rev-6 paid-funnel branch (separate
--       worktree), not by this tree. Counting it now is safe and deliberate:
--       zero rows (a 0 series) until that branch deploys, populated the moment
--       it does — no coordination needed at either merge.
--
-- WHAT
--   CREATE OR REPLACE both report_trend and report_summary from their 040
--   NET-CURRENT bodies (040 is the only definition of either — no later migration
--   recreates or ALTERs them), byte-for-byte, adding three entries immediately after
--   the existing premium branch/row:
--     • single_dossier_purchases → event = 'single_dossier_purchased'
--     • credit_pack_purchases    → event = 'credit_pack_purchased'
--     • paid_purchases           → event in (all three)  [combined total]
--   Posture is UNCHANGED: same signatures, same `language plpgsql security definer
--   set search_path = public, pg_temp`, same anti-injection property — the new event
--   strings are HARDCODED literals selected by the allowlist branch, never echoed
--   from caller input. Grants are re-asserted below (CREATE OR REPLACE preserves the
--   ACL; the re-assert just keeps this file self-documenting).
--
-- MERGE NOTE
--   Reconciled onto fix/holistic-remediation as 117 (originally authored as 113
--   in its own tree; 113-116 were taken first by the credit-set revoke, the
--   dossier-import gate, ai_pricing_config, the pricing-resync cron, and the
--   founder-grant idempotency renumber). 117 is the contiguous next number here;
--   scripts/check-migration-head.mjs fails the gate on a numbering gap. Content is
--   order-independent of those migrations — it touches ONLY the two 040 report
--   functions and nothing they touch. applied-head stays at its prior value until
--   the actual db push.
--
-- @rollback: CREATE OR REPLACE both functions from their 040 definitions verbatim
--   (drops the three added trend branches + three summary rows). Grants/search_path/
--   config are unchanged, so no other reversal is needed. NOTE this just hides the
--   pack + one-shot conversion metrics again; roll back only to unblock a broken
--   deploy, then re-apply.

-- ════════════════════════════════════════════════════════════════════════════
-- report_trend — 040 net-current body, verbatim, + three paid-conversion branches
-- immediately after the premium_purchases branch.
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
    when 'single_dossier_purchases' then $q$ select date_trunc(%1$L, created_at)::date b, count(*)::numeric v from public.analytics_events where event = 'single_dossier_purchased' $q$
    when 'credit_pack_purchases' then $q$ select date_trunc(%1$L, created_at)::date b, count(*)::numeric v from public.analytics_events where event = 'credit_pack_purchased' $q$
    when 'paid_purchases'     then $q$ select date_trunc(%1$L, created_at)::date b, count(*)::numeric v from public.analytics_events where event in ('premium_purchased', 'single_dossier_purchased', 'credit_pack_purchased') $q$
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
-- report_summary — 040 net-current body, verbatim, + three paid-conversion VALUES
-- rows immediately after the premium_purchases row.
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
    ('single_dossier_purchases',(select count(*) from ev where event='single_dossier_purchased' and d between p_from and p_to)::numeric,
                     (select count(*) from ev where event='single_dossier_purchased' and d between prior_from and prior_to)::numeric),
    ('credit_pack_purchases',(select count(*) from ev where event='credit_pack_purchased' and d between p_from and p_to)::numeric,
                     (select count(*) from ev where event='credit_pack_purchased' and d between prior_from and prior_to)::numeric),
    ('paid_purchases',(select count(*) from ev where event in ('premium_purchased','single_dossier_purchased','credit_pack_purchased') and d between p_from and p_to)::numeric,
                     (select count(*) from ev where event in ('premium_purchased','single_dossier_purchased','credit_pack_purchased') and d between prior_from and prior_to)::numeric),
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

-- ── grants: service-role only (re-assert 040 lines 310-320 for these two funcs) ──
-- CREATE OR REPLACE preserves the existing ACL, so this is a self-documenting
-- re-assert, not a change: the API roles stay locked out and only service_role
-- (admin-actions, behind its developer/admin gate) may execute.
revoke all on function public.report_trend(text, text, date, date)    from public;
revoke all on function public.report_summary(date, date)              from public;

grant execute on function public.report_trend(text, text, date, date)    to service_role;
grant execute on function public.report_summary(date, date)              to service_role;
