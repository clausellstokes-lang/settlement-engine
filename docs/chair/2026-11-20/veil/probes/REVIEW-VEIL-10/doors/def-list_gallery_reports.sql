CREATE OR REPLACE FUNCTION public.list_gallery_reports(report_status text DEFAULT 'open'::text, limit_count integer DEFAULT 50)
 RETURNS TABLE(report_id uuid, settlement_id uuid, public_slug text, settlement_name text, tier text, gallery_image_url text, is_public boolean, report_reason text, report_body text, status text, report_created_at timestamp with time zone, report_updated_at timestamp with time zone, resolved_at timestamp with time zone, resolution_note text, reporter_label text, report_count integer)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
  select
    r.id as report_id,
    s.id as settlement_id,
    s.public_slug,
    s.name as settlement_name,
    s.tier,
    s.gallery_image_url,
    s.is_public,
    r.reason as report_reason,
    r.body as report_body,
    r.status,
    r.created_at as report_created_at,
    r.updated_at as report_updated_at,
    r.resolved_at,
    r.resolution_note,
    case
      when r.user_id = s.user_id then 'Creator'
      else 'Gallery reader'
    end as reporter_label,
    count(*) over (partition by r.settlement_id)::integer as report_count
  from public.gallery_reports r
  join public.settlements s on s.id = r.settlement_id
  where public.current_user_is_privileged()
    and (
      coalesce(report_status, 'open') = 'all'
      or r.status = coalesce(report_status, 'open')
    )
  order by
    case when r.status = 'open' then 0 else 1 end,
    r.updated_at desc,
    r.created_at desc
  limit greatest(1, least(limit_count, 100));
$function$

