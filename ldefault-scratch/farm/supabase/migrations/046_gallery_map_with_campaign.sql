-- ────────────────────────────────────────────────────────────────────────────
-- 046_gallery_map_with_campaign.sql — Project 2, Phase 2: share a MAP + CAMPAIGN.
--
-- A 'map_with_campaign' share carries the map (backdrop + placements + the
-- sharer's own map annotations they opted into publishing) PLUS each member
-- settlement as a PUBLIC-SAFE DOSSIER — reusing the battle-tested settlement
-- sanitizers (_gallery_sanitize_public_json + _gallery_chronicle_json, migrations
-- 020/032), exactly like the single-settlement gallery.
--
-- DELIBERATELY NOT SHARED (privacy): worldState (npcStates / factionStates /
-- stressor prose) and regionalGraph (GM-visibility channels). Those are siblings
-- of mapState under map_data->campaign and are simply never projected; the
-- importer's campaign starts with a FRESH worldState + regionalGraph. This keeps
-- the privacy surface to the proven per-settlement sanitizer + shrinks the
-- import id-remap to settlementIds + placements.
--
-- Gating: only when the row is share_kind='map_with_campaign' AND the owner
-- opted in via gallery_share_campaign (publish_map sets both together).
-- ════════════════════════════════════════════════════════════════════════════

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
    select jsonb_agg(jsonb_build_object(
      'old_id',     s.id::text,
      'name',       s.name,
      'tier',       s.tier,
      'settlement', public._gallery_sanitize_public_json(s.data),
      'chronicle',  public._gallery_chronicle_json(s.campaign_state -> 'eventLog')
    )) into v_members
    from public.settlements s
    where s.id::text in (
      select jsonb_array_elements_text(coalesce(v_camp->'settlementIds', '[]'::jsonb))
    )
      -- CRITICAL (IDOR guard): the owner may only ever expose their OWN
      -- settlements. settlementIds is owner-controlled free-form jsonb and this
      -- fn is SECURITY DEFINER (bypasses settlements RLS), so without this an
      -- owner could list another user's settlement UUIDs and leak their dossiers.
      and s.user_id = row.user_id
      and s.access_state = 'active';

    return jsonb_build_object(
      'slug', row.public_slug, 'name', row.name, 'kind', row.share_kind,
      'description', row.gallery_description, 'tags', to_jsonb(row.gallery_tags),
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
      'members', coalesce(v_members, '[]'::jsonb)
    );
  end if;

  -- Default / kind='map' = blank-canvas backdrop only (Phase 1).
  return jsonb_build_object(
    'slug', row.public_slug, 'name', row.name, 'kind', row.share_kind,
    'description', row.gallery_description, 'tags', to_jsonb(row.gallery_tags),
    'backdrop', public._gallery_map_backdrop(row.map_data)
  );
end $$;

-- grant unchanged (045 already granted get_gallery_map to anon, authenticated).
grant execute on function public.get_gallery_map(text) to anon, authenticated;

-- ── publish_map: add a defense-in-depth ownership guard for map_with_campaign ──
-- (Re-creates the 045 function, adding a publish-time check that every member
-- settlement is owned by the caller. The 046 read-time owner filter above is the
-- load-bearing fix; this rejects the abusive publish earlier with a clear error.)
create or replace function public.publish_map(
  target_id    uuid,
  p_kind       text default 'map',
  p_description text default null,
  p_tags       text[] default null
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
              gallery_description = left(coalesce(p_description, ''), 500), gallery_tags = p_tags
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
          gallery_description = left(coalesce(p_description, ''), 500), gallery_tags = p_tags
      where id = target_id;
  end if;
  return existing_slug;
end $$;

revoke all on function public.publish_map(uuid, text, text, text[]) from public;
grant execute on function public.publish_map(uuid, text, text, text[]) to authenticated;
