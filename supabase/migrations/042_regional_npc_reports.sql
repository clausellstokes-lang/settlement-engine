-- ────────────────────────────────────────────────────────────────────────────
-- 042_regional_npc_reports.sql — Wave 2 report functions for the regional /
-- intersettlement + NPC-evolution capture. No new tables: the Wave 2 capture
-- rides existing planes —
--   • regional impacts/channels/arcs are essential analytics_events (props);
--   • NPC goal/role/seat distributions live in settlement_snapshots.structural
--     ->'npc' (research jsonb, written by the extended extractSettlementFingerprint).
--
-- Same posture as 040/041: SECURITY DEFINER, hardcoded allowlists (anti-injection),
-- service-role only.
-- ════════════════════════════════════════════════════════════════════════════

-- report_regional_impacts — cross-settlement impact lifecycle: accept vs ignore
-- vs resolve, by kind/channel, split DM-action vs tick-driven.
create or replace function public.report_regional_impacts(
  p_from date default (current_date - 30),
  p_to   date default current_date
) returns table(resolution text, impact_kind text, channel_type text, was_dm_action boolean, n bigint)
language sql security definer set search_path = public, pg_temp as $$
  select coalesce(props->>'resolution', 'unknown'),
         coalesce(props->>'impact_kind', 'unknown'),
         coalesce(props->>'channel_type', 'unknown'),
         (props->>'was_dm_action') = 'true',
         count(*)::bigint
    from public.analytics_events
   where event = 'regional_impact_status_changed'
     and created_at >= p_from and created_at < (p_to + 1)
   group by 1, 2, 3, 4
   order by 5 desc;
$$;

-- report_channel_funnel — the suggested→confirmed channel funnel + provenance
-- (relationship-bundle vs discovered vs inferred) + DM curation vs auto.
create or replace function public.report_channel_funnel(
  p_from date default (current_date - 30),
  p_to   date default current_date
) returns table(to_status text, provenance text, channel_type text, was_dm_action boolean, n bigint)
language sql security definer set search_path = public, pg_temp as $$
  select coalesce(props->>'to_status', 'unknown'),
         coalesce(props->>'provenance', 'unknown'),
         coalesce(props->>'channel_type', 'unknown'),
         (props->>'was_dm_action') = 'true',
         count(*)::bigint
    from public.analytics_events
   where event = 'regional_channel_status_changed'
     and created_at >= p_from and created_at < (p_to + 1)
   group by 1, 2, 3, 4
   order by 5 desc;
$$;

-- report_regional_arcs — realm/compound arc emergence (the cross-settlement
-- crisis combinations that actually form). props.arcs is a jsonb array.
create or replace function public.report_regional_arcs(
  p_from date default (current_date - 30),
  p_to   date default current_date
) returns table(arc_kind text, signature_key text, scope text, n bigint)
language sql security definer set search_path = public, pg_temp as $$
  select coalesce(a->>'arc_kind', 'unknown'),
         coalesce(a->>'signature_key', 'unknown'),
         coalesce(a->>'scope', 'unknown'),
         count(*)::bigint
    from public.analytics_events e
    cross join lateral jsonb_array_elements(
      case when jsonb_typeof(e.props->'arcs') = 'array' then e.props->'arcs' else '[]'::jsonb end
    ) as a
   where e.event = 'regional_arc_emerged'
     and e.created_at >= p_from and e.created_at < (p_to + 1)
   group by 1, 2, 3
   order by 4 desc;
$$;

-- report_npc_distribution — NPC goal/role/seat/category distributions summed over
-- research snapshots. The dist maps live at structural->'npc'->'<field>_dist'.
-- p_field is matched against a HARDCODED allowlist → safe to interpolate as a
-- jsonb key (never raw caller input reaches SQL).
create or replace function public.report_npc_distribution(
  p_field text,
  p_from  date default (current_date - 90),
  p_to    date default current_date
) returns table(dim text, n bigint)
language plpgsql security definer set search_path = public, pg_temp as $body$
declare
  dist_key text := case p_field
    when 'category'        then 'category_dist'
    when 'influence'       then 'influence_dist'
    when 'structural_rank' then 'structural_rank_dist'
    when 'goal'            then 'goal_dist'
    when 'role_archetype'  then 'role_archetype_dist'
    when 'dotrank'         then 'dotrank_dist'
    when 'seat'            then 'seat_dist'
    else null
  end;
begin
  if dist_key is null then raise exception 'invalid npc field: %', p_field; end if;
  return query execute format($q$
    select g.key as dim, sum(g.value::numeric)::bigint as n
      from public.settlement_snapshots s
      cross join lateral jsonb_each_text(s.structural->'npc'->%1$L) as g(key, value)
     where s.consent_tier = 'research'
       and jsonb_typeof(s.structural->'npc'->%1$L) = 'object'
       and s.created_at >= %2$L and s.created_at < (%3$L::date + 1)
       and (g.value ~ '^[0-9]+$')
     group by 1
     order by 2 desc
  $q$, dist_key, p_from, p_to);
end $body$;

-- ── grants: service-role only ────────────────────────────────────────────────
revoke all on function public.report_regional_impacts(date, date)   from public;
revoke all on function public.report_channel_funnel(date, date)      from public;
revoke all on function public.report_regional_arcs(date, date)       from public;
revoke all on function public.report_npc_distribution(text, date, date) from public;
grant execute on function public.report_regional_impacts(date, date) to service_role;
grant execute on function public.report_channel_funnel(date, date)   to service_role;
grant execute on function public.report_regional_arcs(date, date)    to service_role;
grant execute on function public.report_npc_distribution(text, date, date) to service_role;
