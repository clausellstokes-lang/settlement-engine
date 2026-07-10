-- ────────────────────────────────────────────────────────────────────────────
-- 072_saved_maps_importable.sql — owner opt-in: allow others to import this MAP.
--
-- The dossier side already has this: gallery_importable on settlements (047) is
-- the owner opt-in that gates the import RPC (import_gallery_dossier, 048) and is
-- surfaced as the gallery "Importable" facet (071). The MAP side had no parity —
-- a public map was importable-by-default, gated ONLY on is_public (045). This
-- introduces the matching opt-in so the maps feed can offer the same facet.
--
-- BEHAVIOR CHANGE (intentional, product-confirmed): the column defaults FALSE, so
-- every existing public map becomes NON-importable until its owner opts in. This
-- mirrors gallery_importable (047) — a published share is, by default, VIEW-ONLY;
-- importing is a separate opt-in. (View — get_gallery_map / the preview — is
-- unchanged and stays open; only the clone action is gated.)
--
-- This migration:
--   (1) adds saved_maps.gallery_importable (additive, idempotent, default FALSE);
--   (2) extends publish_map to carry the opt-in (the owner's existing flag writer,
--       same as for is_public / gallery_description / gallery_tags — maps route
--       all gallery-flag writes through this SECURITY DEFINER RPC, not a client
--       .update());
--   (3) adds import_gallery_map — the server-authoritative clone gate, mirroring
--       import_gallery_dossier (048): returns the clone payload ONLY for a public,
--       gallery_importable map, ONLY to a signed-in caller; NULL otherwise. Unlike
--       dossiers (which split get_gallery_dossier vs import_gallery_dossier), maps
--       have a single get_gallery_map serving both view and import, so the gate
--       cannot live on it (that would break free viewing). It delegates to
--       get_gallery_map after the gate, so the import payload stays byte-identical
--       to the preview the viewer already saw — importable is a permission, not a
--       new data surface (same posture as 048);
--   (4) re-creates list_gallery_maps (065's recreate pattern) to project the flag
--       and add the `importable` facet branch, mirroring 071's dossier facet.
--
-- Additive, idempotent. RLS unchanged: saved_maps stays owner-only (no public row
-- policy); all public reads go through these SECURITY DEFINER RPCs. NEVER edit
-- 045/046/065 — this supersedes publish_map (046) + list_gallery_maps (065) in
-- place.
--
-- OPERATOR
--   • Apply via `supabase db push` (or the SQL editor) AFTER 065. Additive (one
--     new column + one publish param + one new RPC + one list facet), safe to
--     re-run.
--   • NOTE the default-FALSE behavior change: existing public maps stop being
--     importable until their owner re-shares with the opt-in on. No data backfill
--     — re-sharing carries the choice.
--   • Rollback: re-apply 065 (restores list_gallery_maps without the facet) +
--     re-apply 046 (restores the 4-arg publish_map), then
--     `drop function if exists public.import_gallery_map(text);` and
--     `alter table public.saved_maps drop column if exists gallery_importable;`
-- ════════════════════════════════════════════════════════════════════════════

-- ── (1) the opt-in column (idempotent; default FALSE = privacy gate) ──────────
alter table public.saved_maps
  add column if not exists gallery_importable boolean not null default false;

comment on column public.saved_maps.gallery_importable is
  'When true, other users may import (clone) this public map into their own library via import_gallery_map, which returns the same public-safe projection get_gallery_map shows. Owner opt-in; defaults false (a public map is view-only until the owner opts in). Mirrors settlements.gallery_importable (047).';

-- ── (2) publish_map: carry the import opt-in ──────────────────────────────────
-- 046's body verbatim + a p_importable param. `coalesce(p_importable, current)`
-- so a re-share that omits the flag preserves the prior choice, and the WorldMap
-- toolbar's plain `shareMap({kind})` (no opt-in form) leaves a fresh share at the
-- column default (false). Adding the 5th arg changes the signature, so drop the
-- 4-arg version first (the 065 precedent for superseding a maps function).
drop function if exists public.publish_map(uuid, text, text, text[]);

create or replace function public.publish_map(
  target_id    uuid,
  p_kind       text default 'map',
  p_description text default null,
  p_tags       text[] default null,
  p_importable boolean default null
) returns text
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  existing_slug text;
  new_slug      text;
  v_kind        text := case when p_kind = 'map_with_campaign' then 'map_with_campaign' else 'map' end;
  v_map         jsonb;
  v_unowned     int;
begin
  select map_data into v_map from public.saved_maps where id = target_id and user_id = auth.uid();
  if not found then raise exception 'Not found or not owned by caller'; end if;

  -- A map_with_campaign share exposes member dossiers — every member settlement
  -- MUST be owned by the caller (you can't publish someone else's settlements).
  if v_kind = 'map_with_campaign' then
    select count(*) into v_unowned
      from jsonb_array_elements_text(coalesce(v_map->'campaign'->'settlementIds', v_map->'settlementIds', '[]'::jsonb)) as sid
      where not exists (select 1 from public.settlements s where s.id::text = sid and s.user_id = auth.uid());
    if v_unowned > 0 then
      raise exception 'Cannot share a campaign containing settlements you do not own';
    end if;
  end if;

  select public_slug into existing_slug from public.saved_maps where id = target_id;
  if existing_slug is null then
    loop
      new_slug := public._make_public_slug();
      begin
        update public.saved_maps
          set is_public = true, public_slug = new_slug, published_at = now(),
              share_kind = v_kind, gallery_share_campaign = (v_kind = 'map_with_campaign'),
              gallery_description = left(coalesce(p_description, ''), 500), gallery_tags = p_tags,
              gallery_importable = coalesce(p_importable, gallery_importable)
          where id = target_id;
        existing_slug := new_slug;
        exit;
      exception when unique_violation then /* retry */
      end;
    end loop;
  else
    update public.saved_maps
      set is_public = true, published_at = now(), share_kind = v_kind,
          gallery_share_campaign = (v_kind = 'map_with_campaign'),
          gallery_description = left(coalesce(p_description, ''), 500), gallery_tags = p_tags,
          gallery_importable = coalesce(p_importable, gallery_importable)
      where id = target_id;
  end if;
  return existing_slug;
end $$;

revoke all on function public.publish_map(uuid, text, text, text[], boolean) from public;
grant execute on function public.publish_map(uuid, text, text, text[], boolean) to authenticated;

-- ── (3) import_gallery_map — server-gated clone fetch (mirrors 048) ───────────
-- Returns the clone payload ONLY for a public, gallery_importable map, ONLY to a
-- signed-in caller; NULL otherwise (the client surfaces a friendly "not available
-- to import"). The gate is server-side regardless of the client — gallery_importable
-- is the privacy boundary, not a client-only toggle. Delegates to get_gallery_map
-- after the gate, so the payload is identical to the preview the viewer already
-- saw (no new data surface; same posture as import_gallery_dossier). Importing is
-- premium, but that cap is enforced on the client clone path (createCampaign) and
-- the per-tier save trigger; this RPC only requires authentication, like 048.
create or replace function public.import_gallery_map(p_slug text)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare v_ok boolean;
begin
  select (is_public and coalesce(gallery_importable, false))
    into v_ok
    from public.saved_maps
   where public_slug = p_slug;
  if not coalesce(v_ok, false) or auth.uid() is null then
    return null;
  end if;
  return public.get_gallery_map(p_slug);
end $$;

revoke all on function public.import_gallery_map(text) from public;
grant execute on function public.import_gallery_map(text) to authenticated;

comment on function public.import_gallery_map(text) is
  'Authenticated clone-for-import read for a shared MAP: returns the get_gallery_map payload ONLY for a public, gallery_importable map, and ONLY to a signed-in caller; NULL otherwise. Mirrors import_gallery_dossier (048). The payload is the same public-safe projection the gallery preview shows (never raw map_data / private worldState).';

-- ── (4) list_gallery_maps — project the flag + the "importable" facet ─────────
-- 065's body verbatim + `importable` (the gallery_importable column) projected on
-- the tile and a new facet branch, mirroring the dossier facet (071). Recreate per
-- 065's pattern (drop the prior signature, recreate).
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
  view_count int, import_count int, member_count int, importable boolean
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
      -- Owner import opt-in (this migration), surfaced so the feed can offer an
      -- "Importable" facet. Defaults false for any map whose owner never opted in.
      coalesce(m.gallery_importable, false) as importable,
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
    backdrop_kind, thumb_url, published_at, view_count, import_count, member_count, importable
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
    -- owner import opt-in facet (this migration's gallery_importable; mirrors 071)
    and (coalesce((p_filters->>'importable')::boolean, false) = false or importable = true)
  order by
    case when p_sort_key = 'most_viewed'   then view_count   end desc nulls last,
    case when p_sort_key = 'most_imported' then import_count end desc nulls last,
    published_at desc
  limit greatest(1, least(coalesce(p_page_size, 24), 60))
  offset greatest(0, coalesce(p_page, 0)) * greatest(1, least(coalesce(p_page_size, 24), 60));
$$;

grant execute on function public.list_gallery_maps(int, int, text, text, jsonb) to anon, authenticated;
