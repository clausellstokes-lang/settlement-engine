CREATE OR REPLACE FUNCTION public.get_gallery_map(p_slug text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
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
      'settlement',  coalesce(public._gallery_veil(pub.j, s.gallery_member_overrides, false) -> 'body', pub.j),
      'chronicle',   public._gallery_chronicle_json(s.campaign_state -> 'eventLog')
    )) into v_members
    from public.settlements s
    -- 211: the member's own listing source (the review's F7): its narration when narrated, its frozen
    -- copy in snapshot mode (a copy past the bound is refused: the member is left out, never served
    -- live), then the sanitizer and its own listing's veil
    cross join lateral (
      select case
        when s.gallery_share_narrated
          and s.ai_data is not null
          and jsonb_typeof(s.ai_data -> 'aiSettlement') = 'object'
        then s.ai_data -> 'aiSettlement'
        else s.data
      end as j
    ) base
    cross join lateral (
      select case when cp.copy is not null then cp.copy else base.j end as j,
             coalesce(length(cp.copy::text) > public._gallery_veil_copy_bound(), false) as refused
        from (select case when mv.v ->> 'mode' = 'snapshot' and jsonb_typeof(mv.v -> 'snapshot') = 'object' then mv.v -> 'snapshot' end as copy
                from (select s.gallery_member_overrides -> '$veil' as v offset 0) mv) cp
    ) src
    cross join lateral (select public._gallery_sanitize_public_json(src.j) as j offset 0) pub
    where not src.refused
      and s.id::text in (
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
end $function$

