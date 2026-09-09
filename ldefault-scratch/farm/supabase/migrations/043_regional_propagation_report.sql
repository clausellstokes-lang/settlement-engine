-- ────────────────────────────────────────────────────────────────────────────
-- 043_regional_propagation_report.sql — report for regional_propagation_applied
-- (the cross-settlement ripple MOMENT, captured on both the canon-edit and the
-- world-pulse paths). Essential event → reads analytics_events props. Same
-- posture as 040–042: SECURITY DEFINER, fixed event name, service-role only.
-- ════════════════════════════════════════════════════════════════════════════

create or replace function public.report_regional_propagation(
  p_from date default (current_date - 30),
  p_to   date default current_date
) returns table(
  trigger_genesis text,
  events bigint,
  total_impacts numeric,
  direct_impacts numeric,
  wave_impacts numeric,
  max_wave_depth numeric
)
language sql security definer set search_path = public, pg_temp as $$
  select coalesce(props->>'trigger_genesis', 'unknown') as trigger_genesis,
         count(*)::bigint as events,
         sum((props->>'impact_count')::numeric)        as total_impacts,
         sum((props->>'direct_impact_count')::numeric) as direct_impacts,
         sum((props->>'wave_impact_count')::numeric)   as wave_impacts,
         max((props->>'wave_depth_max')::numeric)      as max_wave_depth
    from public.analytics_events
   where event = 'regional_propagation_applied'
     and created_at >= p_from and created_at < (p_to + 1)
   group by 1
   order by 2 desc;
$$;

revoke all on function public.report_regional_propagation(date, date) from public;
grant execute on function public.report_regional_propagation(date, date) to service_role;
