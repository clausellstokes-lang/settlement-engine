CREATE OR REPLACE FUNCTION public.list_open_report_targets()
 RETURNS TABLE(kind text, target_id uuid, label text, is_public boolean, report_count integer, reasons text[], latest_at timestamp with time zone)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
  select 'settlement' as kind, r.settlement_id as target_id, s.name as label,
         s.is_public,
         count(*)::integer as report_count,
         array_agg(distinct r.reason) as reasons,
         max(r.created_at) as latest_at
    from public.gallery_reports r
    join public.settlements s on s.id = r.settlement_id
    where public.current_user_is_privileged() and r.status = 'open'
    group by r.settlement_id, s.name, s.is_public
  union all
  select case when m.share_kind = 'map_with_campaign' then 'campaign' else 'map' end as kind,
         mr.map_id, m.name, m.is_public,
         count(*)::integer, array_agg(distinct mr.reason), max(mr.created_at)
    from public.gallery_map_reports mr
    join public.saved_maps m on m.id = mr.map_id
    where public.current_user_is_privileged() and mr.status = 'open'
    group by mr.map_id, m.share_kind, m.name, m.is_public
  union all
  select 'comment', cr.comment_id, left(c.body, 140),
         (s.is_public and c.hidden_at is null),
         count(*)::integer, array_agg(distinct cr.reason), max(cr.created_at)
    from public.gallery_comment_reports cr
    join public.gallery_comments c on c.id = cr.comment_id
    join public.settlements s on s.id = c.settlement_id
    where public.current_user_is_privileged() and cr.status = 'open'
    group by cr.comment_id, c.body, s.is_public, c.hidden_at
  order by latest_at desc;
$function$

