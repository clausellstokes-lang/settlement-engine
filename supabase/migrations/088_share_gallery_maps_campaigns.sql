-- ────────────────────────────────────────────────────────────────────────────
-- 088_share_gallery_maps_campaigns.sql — enrich the shared-MAP / map+campaign
-- gallery surface: a cover image, an opt-in shared "world" panel (a pre-sanitized
-- STORED snapshot, never a live read of private map_data), the realm-arc summary,
-- the rich (sanitized-HTML) description, member public_slugs for cross-linking,
-- and map-level gallery facets.
--
-- ADDITIVE + BACKFILL-SAFE. Every new saved_maps column is `add column if not
-- exists` with a safe default; existing rows keep working untouched. Every RPC
-- gains only optional params (safe defaults) or extra projected columns, so every
-- existing caller (publish_map's plain `shareMap({kind})`, the gallery feed, the
-- map detail page) is unaffected.
--
-- ── FORK BASES (per the project NET-CURRENT migration-recreate rule: each
--    function is recreated from its HIGHEST-NUMBERED prior body, so no in-between
--    guard is silently dropped) ──────────────────────────────────────────────
--   • publish_map        forked from 073 (net-current; the account-status forward
--                        fix). 073 already carries: 059's auth + account_is_active
--                        gates, 046's map_with_campaign member-ownership IDOR
--                        guard, 072's gallery_importable coalesce, and the owner
--                        check. ALL preserved verbatim here.
--   • get_gallery_map    forked from 046 (net-current; the map_with_campaign read
--                        path). 046 carries the load-bearing IDOR guard on the
--                        member projection (s.user_id = row.user_id AND
--                        s.access_state = 'active') — this is a SECURITY DEFINER
--                        public read, so that filter is what stops an owner from
--                        leaking another user's settlement dossiers. PRESERVED.
--                        (get_gallery_map is a PUBLIC view path, granted to anon —
--                        it intentionally has NO account-status gate; 059 added the
--                        account gate to the WRITE RPCs only, never to this read.)
--   • list_gallery_maps  forked from 083 (net-current; the thumb-fallback list).
--                        083 carries: the author_name LEFT JOIN profiles on
--                        user_id (076), the gated member_count, the galleryThumb
--                        backdrop fallback, every search/kind/backdrop/tags/
--                        hasSettlements/importable filter, the sort + pagination
--                        clamps, and the anon+authenticated grant. ALL preserved.
--
-- ── PRIVACY CONTRACT (unchanged) ─────────────────────────────────────────────
--   046 deliberately NEVER raw-projects worldState / regionalGraph (GM-visibility
--   channels) from map_data. This migration KEEPS that contract: the new shared-
--   world panel projects ONLY the STORED, pre-sanitized gallery_world_snapshot /
--   gallery_world_sections columns (a publish-time artifact the client sanitized),
--   NOT a live read of map_data->campaign->worldState. A map+campaign share emits
--   the world panel ONLY when share_kind='map_with_campaign' AND the owner opted
--   in via gallery_share_world (defaults false). gallery_description is widened to
--   an 8000-char sanitized-HTML budget; the CLIENT sanitizes before publish (same
--   posture as the dossier rich-description path).
--
-- OPERATOR — apply with `supabase db push` (or the SQL editor) AFTER 087, then
--   refresh PostgREST. Additive columns + three function recreates; safe to re-run.
--   Rollback: re-apply 073 / 046 / 083 to restore the prior function bodies, then
--   `alter table public.saved_maps drop column if exists …` for the new columns.
-- ════════════════════════════════════════════════════════════════════════════

-- ── (1) additive saved_maps columns (idempotent, backfill-safe defaults) ──────
alter table public.saved_maps
  add column if not exists gallery_image_url            text,
  add column if not exists gallery_image_alt            text,
  add column if not exists gallery_share_world          boolean default false,
  add column if not exists gallery_world_sections       jsonb   default '[]'::jsonb,
  add column if not exists gallery_world_snapshot        jsonb,
  add column if not exists gallery_realm_arc_summary     text,
  add column if not exists gallery_facet_member_band     text,
  add column if not exists gallery_facet_at_war          boolean,
  add column if not exists gallery_facet_dominant_culture text,
  add column if not exists gallery_facet_tier_spread     text;

comment on column public.saved_maps.gallery_image_url is
  'Optional cover image for a shared map tile / detail header (public URL). Owner-supplied at publish time. Mirrors settlements.gallery_image_url (019).';
comment on column public.saved_maps.gallery_share_world is
  'Owner opt-in: when true AND share_kind=map_with_campaign, the gallery projects the STORED gallery_world_snapshot / gallery_world_sections (a pre-sanitized publish-time artifact). Defaults false. Never causes a live read of private map_data->campaign->worldState.';
comment on column public.saved_maps.gallery_world_snapshot is
  'Pre-sanitized, publish-time snapshot of the shareable world panel (client-sanitized). Projected by get_gallery_map ONLY when gallery_share_world is true. NOT a live read of worldState/regionalGraph — preserves 046''s privacy contract.';
comment on column public.saved_maps.gallery_world_sections is
  'Pre-sanitized, publish-time array of world-panel sections (client-sanitized). Same gate/posture as gallery_world_snapshot.';

-- ── (2) publish_map — forked from 073 (net-current) ───────────────────────────
-- KEEPS every 073 guard verbatim: 059 auth + account_is_active gates, 046
-- map_with_campaign member-ownership IDOR guard, owner check, 072 gallery_importable
-- coalesce. ADDS 7 optional params (safe defaults — existing callers unaffected),
-- WIDENS gallery_description from left(...,500) to left(...,8000) (sanitized-HTML
-- budget; the client sanitizes), and WRITES the new columns (facets unpacked from
-- p_facets). The signature changes (new params), so drop the 073 5-arg version
-- first, then recreate (the 072/073 precedent for superseding a maps function).
drop function if exists public.publish_map(uuid, text, text, text[], boolean);

create or replace function public.publish_map(
  target_id           uuid,
  p_kind              text    default 'map',
  p_description       text    default null,
  p_tags              text[]  default null,
  p_importable        boolean default null,
  p_image_url         text    default null,
  p_image_alt         text    default null,
  p_share_world       boolean default null,
  p_world_sections    jsonb   default null,
  p_world_snapshot    jsonb   default null,
  p_realm_arc_summary text    default null,
  p_facets            jsonb   default null
) returns text
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  existing_slug text;
  new_slug      text;
  v_kind        text := case when p_kind = 'map_with_campaign' then 'map_with_campaign' else 'map' end;
  v_map         jsonb;
  v_unowned     int;
  -- 088: unpack the gallery facets from p_facets so a re-share that omits a facet
  -- preserves the prior column value (coalesce(..., current) in the UPDATE below).
  v_f_member_band      text    := nullif(p_facets->>'memberBand', '');
  v_f_dominant_culture text    := nullif(p_facets->>'dominantCulture', '');
  v_f_tier_spread      text    := nullif(p_facets->>'tierSpread', '');
  v_f_at_war           boolean := case when p_facets ? 'atWar' then (p_facets->>'atWar')::boolean else null end;
begin
  -- Account-status gates (059, restored by 073): a banned / disabled / soft-deleted
  -- account may not publish.
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  if not public.account_is_active(auth.uid()) then
    raise exception 'account is not active';
  end if;

  select map_data into v_map from public.saved_maps where id = target_id and user_id = auth.uid();
  if not found then raise exception 'Not found or not owned by caller'; end if;

  -- map_with_campaign member-ownership IDOR guard (046): every member settlement
  -- must be owned by the caller.
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
              -- 088: widened to an 8000-char sanitized-HTML budget (client sanitizes).
              gallery_description = left(coalesce(p_description, ''), 8000), gallery_tags = p_tags,
              gallery_importable = coalesce(p_importable, gallery_importable),
              -- 088 new columns — coalesce(..., current) preserves a prior choice
              -- on a re-share that omits the field.
              gallery_image_url          = coalesce(p_image_url, gallery_image_url),
              gallery_image_alt          = coalesce(p_image_alt, gallery_image_alt),
              gallery_share_world        = coalesce(p_share_world, gallery_share_world, false),
              gallery_world_sections     = coalesce(p_world_sections, gallery_world_sections, '[]'::jsonb),
              gallery_world_snapshot     = coalesce(p_world_snapshot, gallery_world_snapshot),
              gallery_realm_arc_summary  = coalesce(p_realm_arc_summary, gallery_realm_arc_summary),
              gallery_facet_member_band     = coalesce(v_f_member_band, gallery_facet_member_band),
              gallery_facet_at_war          = coalesce(v_f_at_war, gallery_facet_at_war),
              gallery_facet_dominant_culture = coalesce(v_f_dominant_culture, gallery_facet_dominant_culture),
              gallery_facet_tier_spread     = coalesce(v_f_tier_spread, gallery_facet_tier_spread)
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
          gallery_description = left(coalesce(p_description, ''), 8000), gallery_tags = p_tags,
          gallery_importable = coalesce(p_importable, gallery_importable),
          gallery_image_url          = coalesce(p_image_url, gallery_image_url),
          gallery_image_alt          = coalesce(p_image_alt, gallery_image_alt),
          gallery_share_world        = coalesce(p_share_world, gallery_share_world, false),
          gallery_world_sections     = coalesce(p_world_sections, gallery_world_sections, '[]'::jsonb),
          gallery_world_snapshot     = coalesce(p_world_snapshot, gallery_world_snapshot),
          gallery_realm_arc_summary  = coalesce(p_realm_arc_summary, gallery_realm_arc_summary),
          gallery_facet_member_band     = coalesce(v_f_member_band, gallery_facet_member_band),
          gallery_facet_at_war          = coalesce(v_f_at_war, gallery_facet_at_war),
          gallery_facet_dominant_culture = coalesce(v_f_dominant_culture, gallery_facet_dominant_culture),
          gallery_facet_tier_spread     = coalesce(v_f_tier_spread, gallery_facet_tier_spread)
      where id = target_id;
  end if;
  return existing_slug;
end $$;

-- Grants mirror 073 exactly (revoke from public, grant to authenticated) on the
-- new 12-arg signature.
revoke all on function public.publish_map(uuid, text, text, text[], boolean, text, text, boolean, jsonb, jsonb, text, jsonb) from public;
grant execute on function public.publish_map(uuid, text, text, text[], boolean, text, text, boolean, jsonb, jsonb, text, jsonb) to authenticated;

comment on function public.publish_map(uuid, text, text, text[], boolean, text, text, boolean, jsonb, jsonb, text, jsonb) is
  'Owner map publish/re-publish to the gallery. Preserves the 059 account-status gate + 046 member-ownership IDOR guard + 072 importable opt-in (forked from 073). 088: adds cover image, opt-in shared-world snapshot, realm-arc summary, an 8000-char sanitized-HTML description, and map-level facets.';

-- ── (3) get_gallery_map — forked from 046 (net-current) ───────────────────────
-- PRESERVES the 046 IDOR/ownership guard on the member projection (s.user_id =
-- row.user_id AND s.access_state='active') and the view-count increment. ADDS:
-- each member's public_slug alongside old_id/name/tier; gallery_realm_arc_summary;
-- gallery_image_url / gallery_image_alt; and the (now rich, up to 8000-char)
-- gallery_description. When share_kind='map_with_campaign' AND gallery_share_world
-- is true, projects the STORED gallery_world_snapshot + gallery_world_sections —
-- a pre-sanitized stored artifact, NOT a live read of map_data, so worldState /
-- regionalGraph are still NEVER raw-projected (046's privacy contract is intact).
-- Signature is unchanged (text), so a plain create-or-replace; grant unchanged.
create or replace function public.get_gallery_map(p_slug text)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare
  row      public.saved_maps;
  v_camp   jsonb;
  v_members jsonb;
begin
  select * into row from public.saved_maps where public_slug = p_slug and is_public = true;
  if not found then return null; end if;
  update public.saved_maps set view_count = view_count + 1 where id = row.id;

  if row.share_kind = 'map_with_campaign' and row.gallery_share_campaign then
    v_camp := coalesce(row.map_data->'campaign', row.map_data);
    -- Member dossiers — public-safe via the SAME sanitizers as the settlement
    -- gallery. settlementIds that aren't cloud rows (local-only) simply drop out.
    -- 088: also project each member's public_slug so the client can cross-link a
    -- member to its public gallery dossier (null when that member isn't published).
    select jsonb_agg(jsonb_build_object(
      'old_id',      s.id::text,
      'name',        s.name,
      'tier',        s.tier,
      'public_slug', case when s.is_public then s.public_slug else null end,
      'settlement',  public._gallery_sanitize_public_json(s.data),
      'chronicle',   public._gallery_chronicle_json(s.campaign_state -> 'eventLog')
    )) into v_members
    from public.settlements s
    where s.id::text in (
      select jsonb_array_elements_text(coalesce(v_camp->'settlementIds', '[]'::jsonb))
    )
      -- CRITICAL (IDOR guard, 046): the owner may only ever expose their OWN
      -- settlements. settlementIds is owner-controlled free-form jsonb and this
      -- fn is SECURITY DEFINER (bypasses settlements RLS), so without this an
      -- owner could list another user's settlement UUIDs and leak their dossiers.
      and s.user_id = row.user_id
      and s.access_state = 'active';

    return jsonb_build_object(
      'slug', row.public_slug, 'name', row.name, 'kind', row.share_kind,
      'description', row.gallery_description, 'tags', to_jsonb(row.gallery_tags),
      -- 088: cover image + realm-arc summary projected for the detail header.
      'imageUrl', row.gallery_image_url, 'imageAlt', row.gallery_image_alt,
      'realmArcSummary', row.gallery_realm_arc_summary,
      -- ALLOWLIST the mapState fields the importer actually consumes (backdrop +
      -- placements + the sharer's published annotations). layers/viewport (which
      -- include GM display filters) are deliberately dropped; worldState /
      -- regionalGraph are siblings under v_camp and NEVER included.
      'mapState', (
        select jsonb_strip_nulls(jsonb_build_object(
          'fmgSnapshot',    ms->'fmgSnapshot',
          'seed',           ms->'seed',
          'customBackdrop', ms->'customBackdrop',
          'placements',     ms->'placements',
          'labels',         ms->'labels',
          'markers',        ms->'markers',
          'forests',        ms->'forests'
        )) from (select v_camp->'mapState' as ms) x
      ),
      -- 088: the shared-world panel is the STORED, pre-sanitized publish-time
      -- artifact (gallery_world_snapshot / _sections) — projected ONLY on the
      -- owner's gallery_share_world opt-in, and NEVER a live read of
      -- v_camp->'worldState' / 'regionalGraph' (those stay un-projected, per 046).
      'world', case when row.gallery_share_world then jsonb_strip_nulls(jsonb_build_object(
        'snapshot', row.gallery_world_snapshot,
        'sections', coalesce(row.gallery_world_sections, '[]'::jsonb)
      )) else null end,
      'members', coalesce(v_members, '[]'::jsonb)
    );
  end if;

  -- Default / kind='map' = blank-canvas backdrop only (Phase 1). 088: still carry
  -- the cover image + rich description so a plain map share has a header too.
  return jsonb_build_object(
    'slug', row.public_slug, 'name', row.name, 'kind', row.share_kind,
    'description', row.gallery_description, 'tags', to_jsonb(row.gallery_tags),
    'imageUrl', row.gallery_image_url, 'imageAlt', row.gallery_image_alt,
    'realmArcSummary', row.gallery_realm_arc_summary,
    'backdrop', public._gallery_map_backdrop(row.map_data)
  );
end $$;

-- grant unchanged (045/046 already granted get_gallery_map to anon, authenticated).
grant execute on function public.get_gallery_map(text) to anon, authenticated;

-- ── (4) list_gallery_maps — forked from 083 (net-current) ─────────────────────
-- PRESERVES the 083 body verbatim: author_name LEFT JOIN profiles on user_id
-- (076), the gated member_count, the galleryThumb backdrop fallback, every
-- search/kind/backdrop/tags/hasSettlements/importable filter, the sort + the
-- pagination clamps. ADDS gallery_image_url + gallery_image_alt to the returns
-- table + projection so a tile can show the owner's cover. Changing the returns
-- table requires dropping the prior signature first (Postgres cannot replace OUT
-- columns in place — the 072/083 precedent).
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
    published_at desc
  limit greatest(1, least(coalesce(p_page_size, 24), 60))
  offset greatest(0, coalesce(p_page, 0)) * greatest(1, least(coalesce(p_page_size, 24), 60));
$$;

-- grant mirrors 083 exactly.
grant execute on function public.list_gallery_maps(int, int, text, text, jsonb) to anon, authenticated;
