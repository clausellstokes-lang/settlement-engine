-- ────────────────────────────────────────────────────────────────────────────
-- 083_gallery_map_thumb_fallback.sql — show a tile image for generated-terrain
-- map shares.
--
-- PROBLEM
--   The maps-gallery tile renders thumb_url gated on backdrop_kind = 'image'.
--   Both are derived solely from customBackdrop.imageUrl. FMG (generated-terrain)
--   maps have customBackdrop = null, so their thumb_url is null and the tile
--   shows the "Generated terrain" placeholder. The share path now captures a
--   small, RENDER-INERT snapshot of the terrain into mapState.galleryThumb
--   ({ imageUrl, w, h }) — a sibling of customBackdrop that NOTHING reads for
--   display (so it never flips the owner's editor into image-mode).
--
-- FIX (list-only, deliberately NOT the shared helper)
--   Recreate list_gallery_maps (forked VERBATIM from the NET-CURRENT 076 body —
--   the migration-recreate rule) and change ONLY the two backdrop-projection
--   expressions so a map with EITHER customBackdrop OR galleryThumb reports
--   backdrop_kind = 'image' and a thumb_url. galleryThumb shares the
--   { imageUrl, w, h } shape, so the ->>'imageUrl' projection is unchanged.
--
--   We deliberately do NOT touch _gallery_map_backdrop. That helper also feeds
--   get_gallery_map (the IMPORT path), where coalescing galleryThumb into
--   customBackdrop would carry the flat snapshot JPEG into the imported campaign
--   and flip a generated-terrain import into image-mode. Keeping the fallback in
--   the LIST projection only confines it to the gallery TILE — exactly the goal.
--
-- PRESERVED EXACTLY from 076: the returns table, author_name resolution
--   (LEFT JOIN profiles on user_id), member_count, the search/kind/backdrop/tags/
--   hasSettlements/importable filters, the sort + pagination clamps, the public
--   visibility predicate, and the grant to anon, authenticated.
--
-- UNCHANGED: _gallery_map_backdrop, get_gallery_map, publish_map, every other
--   RPC, and the settlement-gallery tierBackdrop path.
--
-- OPERATOR NOTE — apply with `supabase db push` (or apply manually) and refresh
--   PostgREST. No table/column change; function-only.
-- ────────────────────────────────────────────────────────────────────────────

drop function if exists public.list_gallery_maps(int, int, text, text, jsonb);
create or replace function public.list_gallery_maps(
  p_page         int   default 0,
  p_page_size    int   default 24,
  p_sort_key     text  default 'newest',
  p_search_query text  default '',
  p_filters      jsonb default '{}'::jsonb
) returns table(
  slug text, name text, kind text, description text, tags text[],
  backdrop_kind text, thumb_url text, published_at timestamptz,
  view_count int, import_count int, member_count int, importable boolean,
  author_name text
) language sql security definer set search_path = public, pg_temp as $$
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
      --
      -- Classification keys off imageUrl PRESENCE, NOT key existence. The shared
      -- helper runs mapState through jsonb_strip_nulls, so a present-but-null
      -- customBackdrop classifies as 'fmg'. saveCampaignMap (campaignSlice.js)
      -- ALWAYS writes customBackdrop/galleryThumb (null when empty), so a bare
      -- `ms ? 'customBackdrop'` would flip EVERY saved FMG map to 'image' with a
      -- null thumb_url — mis-bucketing the gallery backdrop facet. Matching the
      -- helper's strip-nulls intent keeps existing FMG maps in the 'fmg' bucket.
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
    member_count, importable, author_name
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
    published_at desc
  limit greatest(1, least(coalesce(p_page_size, 24), 60))
  offset greatest(0, coalesce(p_page, 0)) * greatest(1, least(coalesce(p_page_size, 24), 60));
$$;

grant execute on function public.list_gallery_maps(int, int, text, text, jsonb) to anon, authenticated;
