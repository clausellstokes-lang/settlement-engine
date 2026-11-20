CREATE OR REPLACE FUNCTION public.get_unlisted_map(p_slug text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
  select jsonb_build_object(
    'id', m.id,
    'name', m.name,
    'slug', m.unlisted_slug,
    'unlisted', true,
    'share_kind', m.share_kind,
    'description', m.gallery_description,
    'tags', m.gallery_tags,
    'image_url', m.gallery_image_url,
    'world_snapshot', case when m.gallery_share_world then m.gallery_world_snapshot else null end,
    'world_sections', case when m.gallery_share_world then m.gallery_world_sections else null end,
    'realm_arc_summary', case when m.gallery_share_world then m.gallery_realm_arc_summary else null end
  )
  from public.saved_maps m
  where m.unlisted_slug = p_slug and m.visibility = 'unlisted'
  limit 1;
$function$

