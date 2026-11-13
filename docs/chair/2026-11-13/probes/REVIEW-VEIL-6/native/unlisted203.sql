CREATE OR REPLACE FUNCTION public.get_unlisted_dossier(p_slug text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
  select jsonb_build_object(
    'id', s.id,
    'name', s.name,
    'tier', s.tier,
    'slug', s.unlisted_slug,
    'unlisted', true,
    'author_name', ap.external_name,
    'dossier', public._gallery_sanitize_public_json(
      case
        when s.gallery_share_narrated
          and s.ai_data is not null
          and jsonb_typeof(s.ai_data -> 'aiSettlement') = 'object'
        then s.ai_data -> 'aiSettlement'
        else s.data
      end
    )
  )
  from public.settlements s
  left join public.profiles ap on ap.id = s.user_id
  where s.unlisted_slug = p_slug and s.visibility = 'unlisted'
  limit 1;
$function$

;
