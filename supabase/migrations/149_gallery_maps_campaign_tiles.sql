-- ────────────────────────────────────────────────────────────────────────────
-- 149_gallery_maps_campaign_tiles.sql — first-class campaign-share tiles
-- (GALLERY-2 phase 2: the Campaigns third tab).
--
-- Campaign shares (share_kind = 'map_with_campaign') get their own gallery tab
-- with a card anatomy the map tile projection cannot feed today: world age,
-- aliveness, and the at-war posture are stamped on saved_maps (088/147) but
-- never projected onto tiles. Two changes:
--
--   (1) publish_map — BODY-ONLY recreate (signature + return type unchanged,
--       so plain CREATE OR REPLACE per the 072/073 precedent), forked VERBATIM
--       from the NET-CURRENT 089 body. Adds the 147 facets to the p_facets
--       unpack + both UPDATE branches' stamps, keeping 088's
--       coalesce(new, current) preserve-on-omit:
--         • aliveness — accepted only as digits, clamped 0–100 (the 147 CHECK
--           is the backstop; the guard keeps a malformed bag from aborting a
--           publish).
--         • worldAge — accepted only from the canonical age-band vocabulary
--           (domain/ageBands.js), anything else reads null.
--
--   (2) list_gallery_maps — the RETURNS TABLE gains three trailing columns
--       (at_war, world_age, aliveness), so it must be DROPPED first (42P13,
--       the 076 leaf-drop precedent: an API leaf with no DB dependents).
--       Forked VERBATIM from the NET-CURRENT 090 body (088 shape + the 090
--       public_slug tiebreaker) — nothing else changes.
--
-- Depends on: 147 (the columns). The client twins: campaignFacets gains
-- aliveness/worldAge (src/components/gallery/galleryMapsUtils.js), and
-- galleryMapMetadataPatch mirrors the same keys for edit-after-publish.
--
-- OPERATOR: apply via `supabase db push` AFTER 147 — rides the end-of-cycle
--   deploy batch. Idempotent; no data writes. Rollback: re-apply 089 (restores
--   publish_map) + 090 (restores the 15-column list projection).
-- ────────────────────────────────────────────────────────────────────────────

-- ── (1) publish_map — 089 verbatim + the two 147 facet stamps ─────────────────
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
  -- 149: the phase-2 facets (147 columns). Digits-only + clamp for aliveness and
  -- the canonical age-band vocabulary for worldAge, so a malformed bag degrades
  -- to null (preserve-on-omit) instead of aborting the publish; the 147 CHECKs
  -- remain the DB backstop.
  v_f_aliveness        integer := case
    when p_facets ? 'aliveness' and p_facets->>'aliveness' ~ '^[0-9]+$'
    then least(greatest((p_facets->>'aliveness')::integer, 0), 100)
    else null
  end;
  v_f_world_age        text    := case
    when p_facets->>'worldAge' in ('this-week', 'this-month', 'this-season', 'this-year', 'years-past')
    then p_facets->>'worldAge'
    else null
  end;
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

  -- 088 DEFENSE-IN-DEPTH: a client-supplied world snapshot is no longer trusted
  -- verbatim. When present it MUST be a versioned (schemaVersion = 1) object that
  -- carries NO HARD-DENY / covert key at any depth — otherwise reject the publish
  -- rather than store a snapshot get_gallery_map would later serve to anon. (Null =
  -- no shared-world panel, which is fine; the opt-in gate handles projection.)
  if p_world_snapshot is not null then
    if jsonb_typeof(p_world_snapshot) <> 'object'
       or (p_world_snapshot->>'schemaVersion') is distinct from '1' then
      raise exception 'World snapshot is malformed or has an unsupported schemaVersion (expected 1)';
    end if;
    if not public._gallery_world_snapshot_is_safe(p_world_snapshot) then
      raise exception 'World snapshot contains a forbidden private key and cannot be shared';
    end if;
  end if;
  -- The world-sections array gets the same depth scan (it is the second stored,
  -- anon-served artifact). schemaVersion is snapshot-only, so sections is scanned
  -- for forbidden keys but not version-gated.
  if p_world_sections is not null and not public._gallery_world_snapshot_is_safe(p_world_sections) then
    raise exception 'World sections contain a forbidden private key and cannot be shared';
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
              gallery_facet_tier_spread     = coalesce(v_f_tier_spread, gallery_facet_tier_spread),
              -- 149: the phase-2 facets (147) — same preserve-on-omit.
              gallery_facet_aliveness       = coalesce(v_f_aliveness, gallery_facet_aliveness),
              gallery_facet_world_age       = coalesce(v_f_world_age, gallery_facet_world_age)
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
          gallery_facet_tier_spread     = coalesce(v_f_tier_spread, gallery_facet_tier_spread),
          -- 149: the phase-2 facets (147) — same preserve-on-omit.
          gallery_facet_aliveness       = coalesce(v_f_aliveness, gallery_facet_aliveness),
          gallery_facet_world_age       = coalesce(v_f_world_age, gallery_facet_world_age)
      where id = target_id;
  end if;
  return existing_slug;
end $$;

-- Grants unchanged from 089 (same 12-arg signature; restated for idempotence).
revoke all on function public.publish_map(uuid, text, text, text[], boolean, text, text, boolean, jsonb, jsonb, text, jsonb) from public;
grant execute on function public.publish_map(uuid, text, text, text[], boolean, text, text, boolean, jsonb, jsonb, text, jsonb) to authenticated;

comment on function public.publish_map(uuid, text, text, text[], boolean, text, text, boolean, jsonb, jsonb, text, jsonb) is
  'Owner map publish/re-publish to the gallery. Preserves the 059 account-status gate + 046 member-ownership IDOR guard + 072 importable opt-in + the 088 snapshot defense-in-depth (forked from 089). 149: also stamps the phase-2 facets (aliveness 0-100, world-age band) from p_facets with preserve-on-omit.';

-- ── (2) list_gallery_maps — 090 verbatim + three trailing campaign-facet cols ─
-- The return table gains at_war/world_age/aliveness, so the existing function
-- must be DROPPED first: CREATE OR REPLACE cannot change a function's return
-- type (42P13). API leaf (no DB dependents) — the 076 leaf-drop precedent.
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
  author_name text, image_url text, image_alt text,
  at_war boolean, world_age text, aliveness int
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
$$;

-- grant mirrors 090/088 exactly.
grant execute on function public.list_gallery_maps(int, int, text, text, jsonb) to anon, authenticated;
