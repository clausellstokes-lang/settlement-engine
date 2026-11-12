-- 211_server_side_share_veil.down.sql — reversal for migration 211 (COHERENCE-VEIL).
--
-- DATA-SAFE and WHOLE, per supabase/rollback/README.md: 211 wrote no row, column, constraint or
-- policy, so its reversal is entirely schema: the four reads it restated go back to their previous
-- bodies, then every helper it created is dropped.
--
-- ORDER (last in, first out): run this BEFORE reversing 210, 207, 206, 205 or 208's set. 211 restates
-- 208's party-link read, so undoing 208 first would leave this script recreating a body that is no
-- longer the one 211 replaced. The reads go back FIRST because they call the helpers; dropping a
-- helper first would leave them raising "function does not exist" for the width of the script.
--
-- THE BODIES are pg_get_functiondef of a chain stopped at 210 (001..210 applied in order): the net-
-- current definitions of migrations 147 (get_gallery_dossier, its bare `set search_path = public`
-- included), 208 as amended (get_unlisted_dossier), 131 (import_gallery_dossier) and 088
-- (get_gallery_map). CREATE OR REPLACE keeps each function's grants, which 211 restated unchanged;
-- they are restated here too, as the migrations that made them state them.
--
-- PROVEN BY EXECUTION: tests/security/galleryVeilCures.pglite.test.js applies 001..211, runs this
-- file, and compares every function in `public` (body, volatility, definer flag, settings, grants,
-- owner) and the four reads' full definitions with a chain stopped at 210: equal, byte for byte.
--
-- NOT reversed, because there is nothing to: no stored row was written by 211. The new client draws a
-- share without the served marker (v 1) as it did before 211, so no client revert goes with this.

-- ── 1. the four reads at their previous bodies ──────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_gallery_dossier(dossier_slug text)
 RETURNS TABLE(id uuid, public_slug text, name text, tier text, data jsonb, published_at timestamp with time zone, updated_at timestamp with time zone, view_count integer, is_curated boolean, gallery_description text, gallery_image_url text, gallery_image_alt text, gallery_tags text[], gallery_share_dm boolean, gallery_importable boolean, gallery_member_overrides jsonb, population integer, terrain text, government_type text, magic_level text, stability text, primary_resource text, threat_level text, net_votes integer, comment_count integer, chronicle jsonb, author_name text, aliveness integer)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select
    r.id,
    r.public_slug,
    r.name,
    r.tier,
    public._gallery_apply_member_overrides(
      case when s.gallery_share_dm then public._gallery_dm_full_json(base.j) else public._gallery_sanitize_public_json(base.j) end,
      public._gallery_dm_full_json(base.j),
      s.gallery_member_overrides, s.gallery_share_dm, s.gallery_importable, false
    ) as data,
    r.published_at,
    r.updated_at,
    r.view_count,
    r.is_curated,
    r.gallery_description,
    r.gallery_image_url,
    r.gallery_image_alt,
    r.gallery_tags,
    s.gallery_share_dm,
    s.gallery_importable,
    s.gallery_member_overrides,
    r.population,
    r.terrain,
    r.government_type,
    r.magic_level,
    r.stability,
    r.primary_resource,
    r.threat_level,
    r.net_votes,
    r.comment_count,
    public._gallery_chronicle_json(s.campaign_state -> 'eventLog') as chronicle,
    ap.external_name as author_name,
    r.aliveness
  from public.settlements s
  join public._gallery_public_tile_rows() r on r.id = s.id
  left join public.profiles ap on ap.id = s.user_id
  cross join lateral (
    select case
      when s.gallery_share_narrated
        and s.ai_data is not null
        and jsonb_typeof(s.ai_data -> 'aiSettlement') = 'object'
      then s.ai_data -> 'aiSettlement'
      else s.data
    end as j
  ) base
  where s.public_slug = dossier_slug
    and s.is_public = true
  limit 1;
$function$

;

CREATE OR REPLACE FUNCTION public.get_unlisted_dossier(p_slug text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
  select jsonb_build_object(
    'id', s.id,
    'name', s.name,
    'tier', s.tier,
    'slug', s.unlisted_slug,
    'unlisted', true,
    'author_name', ap.external_name,
    'is_owner', coalesce(s.user_id = auth.uid(), false),
    'gallery_share_dm', false,
    -- R8 (the re-review of 2026-11-10): nothing but what HIDES travels. A gallery export in
    -- snapshot mode stores its frozen public copy at $veil.snapshot, and with Reveal DM (or a
    -- revealDm member) that copy is the DM projection; it never leaves on the link.
    'gallery_member_overrides', s.gallery_member_overrides #- '{$veil,snapshot}',
    'dossier', public._gallery_apply_member_overrides(
      pub.j, pub.j,
      s.gallery_member_overrides, false, s.gallery_importable, false
    )
  )
  from public.settlements s
  left join public.profiles ap on ap.id = s.user_id
  cross join lateral (
    select case
      when s.gallery_share_narrated
        and s.ai_data is not null
        and jsonb_typeof(s.ai_data -> 'aiSettlement') = 'object'
      then s.ai_data -> 'aiSettlement'
      else s.data
    end as j
  ) base
  -- R12 (the re-review of 2026-11-10): the sanitizer runs ONCE per read on the whole document;
  -- its result is both the splice's base and its only source.
  cross join lateral (select public._gallery_sanitize_public_json(base.j) as j) pub
  where s.unlisted_slug = p_slug
  limit 1;
$function$

;

CREATE OR REPLACE FUNCTION public.import_gallery_dossier(dossier_slug text)
 RETURNS TABLE(id uuid, name text, tier text, data jsonb)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
  select
    s.id,
    s.name,
    s.tier,
    public._gallery_apply_member_overrides(
      case when s.gallery_share_dm then public._gallery_dm_full_json(base.j) else public._gallery_sanitize_public_json(base.j) end,
      public._gallery_dm_full_json(base.j),
      s.gallery_member_overrides, s.gallery_share_dm, s.gallery_importable, true
    ) as data
  from public.settlements s
  cross join lateral (
    select case
      when s.gallery_share_narrated
        and s.ai_data is not null
        and jsonb_typeof(s.ai_data -> 'aiSettlement') = 'object'
      then s.ai_data -> 'aiSettlement'
      else s.data
    end as j
  ) base
  where s.public_slug = dossier_slug
    and s.is_public = true
    and s.gallery_importable = true
    and auth.uid() is not null
    -- ── mig 120: IMPORT is premium (server-authoritative). Free/anon → 0 rows. ──
    and public.current_user_has_premium_access()
  limit 1;
$function$

;

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
end $function$

;

revoke execute on function public.get_gallery_dossier(text) from public;
grant execute on function public.get_gallery_dossier(text) to authenticated, anon;
grant execute on function public.get_unlisted_dossier(text) to authenticated, anon;
revoke execute on function public.import_gallery_dossier(text) from public;
grant execute on function public.import_gallery_dossier(text) to authenticated;
grant execute on function public.get_gallery_map(text) to anon, authenticated;

-- ── 2. the helpers 211 created, every one, by signature ─────────────────────────────────────────
drop function if exists public._gallery_veil(jsonb, jsonb, boolean, boolean);
drop function if exists public._gallery_veil_apply(jsonb, jsonb);
drop function if exists public._gallery_veil_card(text, jsonb, jsonb, jsonb, jsonb, jsonb);
drop function if exists public._gallery_veil_card_id(text, jsonb);
drop function if exists public._gallery_veil_cards(jsonb, text);
drop function if exists public._gallery_veil_clandestine(jsonb);
drop function if exists public._gallery_veil_copy_bound();
drop function if exists public._gallery_veil_criminal(jsonb);
drop function if exists public._gallery_veil_drop_hooks(jsonb);
drop function if exists public._gallery_veil_facet(jsonb, text);
drop function if exists public._gallery_veil_grouping(jsonb, text);
drop function if exists public._gallery_veil_groupings();
drop function if exists public._gallery_veil_hideable(text);
drop function if exists public._gallery_veil_hideable_p(jsonb, text);
drop function if exists public._gallery_veil_house(jsonb);
drop function if exists public._gallery_veil_illegal_brokerage(jsonb);
drop function if exists public._gallery_veil_inst_id(jsonb);
drop function if exists public._gallery_veil_join(jsonb, text);
drop function if exists public._gallery_veil_jslen(text);
drop function if exists public._gallery_veil_jsstr(jsonb);
drop function if exists public._gallery_veil_kind_order();
drop function if exists public._gallery_veil_kinds();
drop function if exists public._gallery_veil_lower(text);
drop function if exists public._gallery_veil_map(jsonb, text, text, jsonb);
drop function if exists public._gallery_veil_map_list(jsonb, text, text, jsonb);
drop function if exists public._gallery_veil_npc_house(jsonb);
drop function if exists public._gallery_veil_npc_id(jsonb);
drop function if exists public._gallery_veil_npc_pass(jsonb, jsonb);
drop function if exists public._gallery_veil_num_inf(numeric);
drop function if exists public._gallery_veil_num_zero(numeric);
drop function if exists public._gallery_veil_numstr(text);
drop function if exists public._gallery_veil_or(jsonb, jsonb, jsonb);
drop function if exists public._gallery_veil_own_id(jsonb, text, jsonb);
drop function if exists public._gallery_veil_parse(text);
drop function if exists public._gallery_veil_resolve(jsonb, jsonb, boolean, text[]);
drop function if exists public._gallery_veil_served(jsonb, jsonb, jsonb, boolean);
drop function if exists public._gallery_veil_slug(text);
drop function if exists public._gallery_veil_snake(text);
drop function if exists public._gallery_veil_str(jsonb);
drop function if exists public._gallery_veil_truthy(jsonb);
