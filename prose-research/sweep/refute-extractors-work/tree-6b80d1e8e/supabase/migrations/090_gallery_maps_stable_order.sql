-- ────────────────────────────────────────────────────────────────────────────
-- 090_gallery_maps_stable_order.sql — make the maps-gallery feed ORDER total.
--
-- PROBLEM
--   list_gallery_maps (net-current body in 088) ends its ORDER BY with
--   `published_at desc` and NO final tiebreaker. Every sort mode falls through to
--   that clause (the most_viewed / most_imported CASE arms are NULL for the other
--   modes, so newest is the de-facto secondary key in all three). When two public
--   rows share the same published_at — common when several are published in one
--   transaction (published_at defaults to now(), which is the TRANSACTION start
--   time, so a multi-row insert stamps them identically) and reproducible in tests
--   that seed rows in quick succession — their relative order is non-deterministic.
--   Postgres is free to return tied rows in any order, and that order can differ
--   between two calls in the same session, so paging and list/detail parity are
--   not stable across ties.
--
--   This surfaced as a rare flake in
--   tests/security/galleryMapMemberCount.pglite.test.js: under the full pglite
--   suite it intermittently failed with "Cannot read properties of null (reading
--   'world')" and a member_count parity mismatch, because the assertions rely on
--   repeated list_gallery_maps calls returning tied rows in a stable order.
--
-- FIX (order-only)
--   Recreate list_gallery_maps (forked VERBATIM from the NET-CURRENT 088 body —
--   the project's migration-recreate net-current rule) and add a single final
--   tiebreaker `public_slug desc` to the ORDER BY. public_slug is a TOTAL,
--   deterministic key over the result set: the WHERE clause already filters
--   `public_slug is not null`, and saved_maps carries a partial UNIQUE index
--   `saved_maps_public_slug_unique on (public_slug) where public_slug is not null`
--   (045), so within this projection no two rows can share a slug. It is also
--   already projected by the base CTE, so the body is otherwise byte-for-byte the
--   088 definition — nothing but the ORDER BY changes.
--
--   DOCUMENTED ORDER: for any group of rows tied on the active sort key (and on
--   published_at), rows are returned in DESCENDING public_slug order. This is the
--   contract the new pglite execution test pins.
--
-- PRESERVED EXACTLY from 088: the returns table (incl. 088's image_url/image_alt
--   cover columns), the gated member_count, author_name resolution (LEFT JOIN
--   profiles on user_id, 076), the galleryThumb backdrop fallback (083), every
--   search/kind/backdrop/tags/hasSettlements/importable filter, the pagination
--   clamps, the public-visibility predicate, and the grant to anon, authenticated.
--
-- UNCHANGED: every other RPC (publish_map, get_gallery_map, _gallery_*), every
--   table/column. Function-only.
--
-- OPERATOR NOTE — apply with `supabase db push` (or apply manually) and refresh
--   PostgREST. No table/column change; function-only. Idempotent (create or
--   replace). Safe to apply before or after the 084-089 batch — it only supersedes
--   the 088 list_gallery_maps body (089 recreates publish_map, not this RPC).
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
  author_name text, image_url text, image_alt text
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
    member_count, importable, author_name, image_url, image_alt
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
$$;

-- grant mirrors 088 exactly.
grant execute on function public.list_gallery_maps(int, int, text, text, jsonb) to anon, authenticated;
