CREATE OR REPLACE FUNCTION public.list_gallery_more_by_creator(source_slug text, limit_count integer DEFAULT 6)
 RETURNS TABLE(id uuid, public_slug text, name text, tier text, published_at timestamp with time zone, updated_at timestamp with time zone, view_count integer, is_curated boolean, gallery_description text, gallery_image_url text, gallery_image_alt text, gallery_tags text[], population integer, terrain text, government_type text, magic_level text, stability text, primary_resource text, threat_level text, culture text, prosperity text, primary_deity text, at_war boolean, net_votes integer, comment_count integer, author_name text, aliveness integer, reactions jsonb)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  with source as (
    select user_id, id from public.settlements
    where public_slug = source_slug and is_public = true
    limit 1
  )
  select
    r.id, r.public_slug, r.name, r.tier, r.published_at, r.updated_at,
    r.view_count, r.is_curated, r.gallery_description, r.gallery_image_url,
    r.gallery_image_alt, r.gallery_tags, r.population, r.terrain,
    r.government_type, r.magic_level, r.stability, r.primary_resource,
    r.threat_level, r.culture, r.prosperity, r.primary_deity, r.at_war,
    r.net_votes, r.comment_count,
    ap.external_name as author_name,
    r.aliveness,
    r.reactions
  -- CROSS JOIN (not a comma-join) so `r` stays in scope for the LEFT JOIN's ON
  -- clause: `FROM r, source LEFT JOIN ...` parses as `FROM r, (source LEFT JOIN
  -- ...)`, putting r out of scope (42P01). Explicit joins bind left-to-right.
  from public._gallery_public_tile_rows() r
  cross join source
  left join public.profiles ap on ap.id = r.owner_id
  where r.owner_id = source.user_id and r.id <> source.id
  order by r.published_at desc
  limit greatest(1, least(limit_count, 12));
$function$

