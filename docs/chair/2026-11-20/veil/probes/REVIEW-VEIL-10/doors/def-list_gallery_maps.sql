CREATE OR REPLACE FUNCTION public.list_gallery_maps(p_page integer DEFAULT 0, p_page_size integer DEFAULT 24, p_sort_key text DEFAULT 'newest'::text, p_search_query text DEFAULT ''::text, p_filters jsonb DEFAULT '{}'::jsonb)
 RETURNS TABLE(slug text, name text, kind text, description text, tags text[], backdrop_kind text, thumb_url text, published_at timestamp with time zone, view_count integer, import_count integer, member_count integer, importable boolean, author_name text, image_url text, image_alt text, at_war boolean, world_age text, aliveness integer)
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
  with base as (
    select
      m.public_slug,
      m.name,
      m.share_kind,
      m.gallery_description,
      m.gallery_tags,
      -- 083: an FMG map with no customBackdrop still gets a tile image when it
      -- carries a galleryThumb (the render-inert share snapshot). Both share the
      -- { imageUrl, w, h } shape, so the projection is identical. We resolve the
      -- mapState envelope inline (campaign-wrapped OR bare) — the same coalesce
      -- _gallery_map_backdrop uses — to keep the thumb fallback confined to the
      -- LIST/tile projection and OUT of get_gallery_map's import path.
      case when (ms->'customBackdrop'->>'imageUrl') is not null
             or (ms->'galleryThumb'->>'imageUrl') is not null
           then 'image' else 'fmg' end as backdrop_kind,
      coalesce(
        ms->'customBackdrop'->>'imageUrl',
        ms->'galleryThumb'->>'imageUrl'
      ) as thumb_url,
      m.published_at,
      m.view_count,
      m.import_count,
      coalesce(m.gallery_importable, false) as importable,
      -- author resolved live by owner id (076).
      ap.external_name as author_name,
      -- 088: the owner's cover image (separate from the auto thumb_url) so a tile
      -- can show a curated cover.
      m.gallery_image_url as image_url,
      m.gallery_image_alt as image_alt,
      -- 149: the campaign-card facets (088/147 columns). at_war coalesces false
      -- (a boolean posture); world_age/aliveness stay NULL when never stamped
      -- (unknown, not "fresh"/"dead").
      coalesce(m.gallery_facet_at_war, false) as at_war,
      m.gallery_facet_world_age as world_age,
      m.gallery_facet_aliveness as aliveness,
      case
        when m.share_kind = 'map_with_campaign' and m.gallery_share_campaign then
          (select count(*)::int
             from public.settlements s
            where s.id::text in (
                  select jsonb_array_elements_text(
                    coalesce(m.map_data->'campaign'->'settlementIds', '[]'::jsonb)))
              and s.user_id = m.user_id
              and s.access_state = 'active')
        else 0
      end as member_count
    from public.saved_maps m
    left join public.profiles ap on ap.id = m.user_id
    -- 083: resolve the mapState envelope ONCE per row for the backdrop fallback.
    cross join lateral (
      select coalesce(m.map_data->'campaign'->'mapState', m.map_data->'mapState', '{}'::jsonb) as ms
    ) mss
    where m.is_public = true and m.public_slug is not null
  )
  select
    public_slug, name, share_kind, gallery_description, gallery_tags,
    backdrop_kind, thumb_url, published_at, view_count, import_count,
    member_count, importable, author_name, image_url, image_alt,
    at_war, world_age, aliveness
  from base
  where
    (coalesce(p_search_query, '') = ''
       or name ilike '%' || p_search_query || '%'
       or coalesce(gallery_description, '') ilike '%' || p_search_query || '%'
       or exists (select 1 from unnest(coalesce(gallery_tags, '{}')) t where t ilike '%' || p_search_query || '%'))
    and (p_filters->'kind' is null or jsonb_array_length(p_filters->'kind') = 0
         or share_kind in (select jsonb_array_elements_text(p_filters->'kind')))
    and (p_filters->'backdrop' is null or jsonb_array_length(p_filters->'backdrop') = 0
         or backdrop_kind in (select jsonb_array_elements_text(p_filters->'backdrop')))
    and (p_filters->'tags' is null or jsonb_array_length(p_filters->'tags') = 0
         or exists (select 1 from unnest(coalesce(gallery_tags, '{}')) t
                    where lower(t) in (select lower(jsonb_array_elements_text(p_filters->'tags')))))
    and (coalesce((p_filters->>'hasSettlements')::boolean, false) = false or member_count > 0)
    and (coalesce((p_filters->>'importable')::boolean, false) = false or importable = true)
  order by
    case when p_sort_key = 'most_viewed'   then view_count   end desc nulls last,
    case when p_sort_key = 'most_imported' then import_count end desc nulls last,
    published_at desc,
    -- 090: TOTAL, deterministic tiebreaker. public_slug is unique (045 partial
    -- unique index) and non-null (the WHERE above), so tied rows page stably.
    public_slug desc
  limit greatest(1, least(coalesce(p_page_size, 24), 60))
  offset greatest(0, coalesce(p_page, 0)) * greatest(1, least(coalesce(p_page_size, 24), 60));
$function$

