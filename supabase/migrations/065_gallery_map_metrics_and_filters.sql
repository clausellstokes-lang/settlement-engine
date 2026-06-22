-- ────────────────────────────────────────────────────────────────────────────
-- 065_gallery_map_metrics_and_filters.sql — gallery MAPS: real metrics + server
-- side filter/sort/search (parity with the dossier feed, migration 063).
--
-- Until now the maps tab fetched one anonymized batch and filtered/sorted/searched
-- CLIENT-SIDE, and its "Includes settlements" facet was a KIND proxy — the tile
-- carried neither an import count nor a member count. This migration:
--
--   (1) adds saved_maps.import_count (default 0 IS the backfill — there is no
--       historical import log, so counts are NOT fabricated);
--   (2) adds bump_map_import(slug) — an atomic, SECURITY DEFINER, public-row-only
--       increment fired by the import path (the importer is not the owner, and
--       saved_maps RLS is owner-only UPDATE, so the bump cannot be a client write
--       and cannot live in get_gallery_map, which also fires on View/preview);
--   (3) re-creates list_gallery_maps to accept p_sort_key / p_search_query /
--       p_filters (jsonb) and to return import_count + a REAL member_count
--       (the same member settlements get_gallery_map projects — migration 046),
--       applying WHERE/ORDER server-side while keeping the tile anonymized
--       (user_id is used only INTERNALLY in the member subquery, never projected).
--
-- Additive, idempotent, backfill-safe. RLS unchanged: saved_maps stays owner-only
-- (no public row policy); all public reads go through these SECURITY DEFINER RPCs.
-- NEVER edit 045/046 — this supersedes the 045 list_gallery_maps in place.
-- ════════════════════════════════════════════════════════════════════════════

-- ── (1) import_count column (default 0 = the backfill; no fabrication) ─────────
alter table public.saved_maps
  add column if not exists import_count integer not null default 0;

create index if not exists saved_maps_public_import_count
  on public.saved_maps(import_count desc) where is_public = true;

-- ── (2) atomic, owner-safe import increment ───────────────────────────────────
-- The import path (campaignSlice importGalleryMap / importGalleryMapWithCampaign)
-- has no clone RPC to fold this into — it fetches via get_gallery_map then clones
-- client-side. So the bump is its own minimal SECURITY DEFINER fn: a single
-- UPDATE (row-serialized, atomic) keyed by slug, scoped to public rows only. The
-- importer is authenticated (importing is premium); anon cannot call it.
create or replace function public.bump_map_import(p_slug text)
returns void language sql security definer set search_path = public, pg_temp as $$
  update public.saved_maps
     set import_count = import_count + 1
   where public_slug = p_slug and is_public = true;
$$;
revoke all on function public.bump_map_import(text) from public;
grant execute on function public.bump_map_import(text) to authenticated;

-- ── (3) list_gallery_maps — server-side filter/sort/search + real metrics ─────
-- Re-creates the 045 definition (which took only p_page/p_page_size). Mirrors
-- list_gallery_dossiers (063): IN-list facets + ilike search + ORDER BY, all in
-- SQL, pagination preserved. member_count is the REAL count of the member
-- settlements get_gallery_map projects (046:32-52): it is gated to exactly the
-- rows 046 emits members for — share_kind='map_with_campaign' AND the owner's
-- gallery_share_campaign opt-in — then counts the settlements referenced by
-- map_data->'campaign'->'settlementIds', scoped to the owner (IDOR guard) AND
-- access_state='active'. A blank kind='map' share, or a campaign share with the
-- opt-in OFF, yields 0 — never the owner's un-shared campaign membership. The
-- owner id (m.user_id) is used ONLY inside that subquery and is NEVER projected
-- — anonymization preserved.
create or replace function public.list_gallery_maps(
  p_page         int   default 0,
  p_page_size    int   default 24,
  p_sort_key     text  default 'newest',
  p_search_query text  default '',
  p_filters      jsonb default '{}'::jsonb
) returns table(
  slug text, name text, kind text, description text, tags text[],
  backdrop_kind text, thumb_url text, published_at timestamptz,
  view_count int, import_count int, member_count int
) language sql security definer set search_path = public, pg_temp as $$
  with base as (
    select
      m.public_slug,
      m.name,
      m.share_kind,
      m.gallery_description,
      m.gallery_tags,
      case when public._gallery_map_backdrop(m.map_data) ? 'customBackdrop' then 'image' else 'fmg' end as backdrop_kind,
      public._gallery_map_backdrop(m.map_data)->'customBackdrop'->>'imageUrl' as thumb_url,
      m.published_at,
      m.view_count,
      m.import_count,
      -- REAL member count = EXACTLY the members get_gallery_map projects (046).
      -- 046 only emits member dossiers when the row is share_kind='map_with_campaign'
      -- AND the owner opted in (gallery_share_campaign). A kind='map' blank-canvas
      -- share — or a map_with_campaign with the opt-in OFF — projects ZERO members,
      -- even though campaigns.js persists the full campaign envelope (settlementIds
      -- included) for every cloud row. Without this gate the count would surface
      -- campaign membership the owner did NOT choose to share (an opt-out bypass /
      -- misattributed metric). It also reads ONLY map_data->'campaign'->'settlementIds'
      -- (the v_camp path 046's member projection uses) — no bare top-level fallback,
      -- which is a non-parity path 046 never walks.
      case
        when m.share_kind = 'map_with_campaign' and m.gallery_share_campaign then
          (select count(*)::int
             from public.settlements s
            where s.id::text in (
                  select jsonb_array_elements_text(
                    coalesce(m.map_data->'campaign'->'settlementIds', '[]'::jsonb)))
              and s.user_id = m.user_id          -- IDOR/ownership guard (mirrors 046)
              and s.access_state = 'active')
        else 0
      end as member_count
    from public.saved_maps m
    where m.is_public = true and m.public_slug is not null
  )
  select
    public_slug, name, share_kind, gallery_description, gallery_tags,
    backdrop_kind, thumb_url, published_at, view_count, import_count, member_count
  from base
  where
    -- free-text search over name / description / tags
    (coalesce(p_search_query, '') = ''
       or name ilike '%' || p_search_query || '%'
       or coalesce(gallery_description, '') ilike '%' || p_search_query || '%'
       or exists (select 1 from unnest(coalesce(gallery_tags, '{}')) t where t ilike '%' || p_search_query || '%'))
    -- kind facet (IN-list)
    and (p_filters->'kind' is null or jsonb_array_length(p_filters->'kind') = 0
         or share_kind in (select jsonb_array_elements_text(p_filters->'kind')))
    -- backdrop facet (IN-list)
    and (p_filters->'backdrop' is null or jsonb_array_length(p_filters->'backdrop') = 0
         or backdrop_kind in (select jsonb_array_elements_text(p_filters->'backdrop')))
    -- tags facet (any-of, case-insensitive)
    and (p_filters->'tags' is null or jsonb_array_length(p_filters->'tags') = 0
         or exists (select 1 from unnest(coalesce(gallery_tags, '{}')) t
                    where lower(t) in (select lower(jsonb_array_elements_text(p_filters->'tags')))))
    -- REAL has-settlements facet (replaces the 045 kind proxy)
    and (coalesce((p_filters->>'hasSettlements')::boolean, false) = false or member_count > 0)
  order by
    case when p_sort_key = 'most_viewed'   then view_count   end desc nulls last,
    case when p_sort_key = 'most_imported' then import_count end desc nulls last,
    published_at desc
  limit greatest(1, least(coalesce(p_page_size, 24), 60))
  offset greatest(0, coalesce(p_page, 0)) * greatest(1, least(coalesce(p_page_size, 24), 60));
$$;

-- Drop the superseded 045 two-arg signature so only the extended one remains.
drop function if exists public.list_gallery_maps(int, int);

grant execute on function public.list_gallery_maps(int, int, text, text, jsonb) to anon, authenticated;
