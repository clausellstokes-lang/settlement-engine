-- 212_share_veil_later_cures.down.sql — reversal for migration 212 (COHERENCE-VEIL-7).
--
-- DATA-SAFE and WHOLE, per supabase/rollback/README.md: 212 wrote no row, column, constraint or
-- policy, so its reversal is entirely schema: the six functions it restated go back to 211's
-- statements (the file at 333b33973, sha256 eface6d0...0be01, copied verbatim), then the
-- helpers it created are dropped by signature.
--
-- ORDER (last in, first out): run this BEFORE 211's own down file. 211's down file drops only the
-- forty helpers 211 creates, so run after 212 without this one it would leave 212's own behind.
-- The functions go back FIRST because they call the helpers; dropping a helper first would leave
-- them raising "function does not exist" for the width of the script. CREATE OR REPLACE keeps each
-- function's grants, which 212 restated unchanged; the three reads' grants are restated here too
-- (get_unlisted_dossier, restated by 212 for VEIL-13's ruling (5), takes back 211's one grant).
--
-- PROVEN BY EXECUTION on local chains (docs/chair/2026-11-13/veil-probe-7/): 001..211 + 212 + this
-- file equals 001..211, and 203 + 211 + 212 + this file equals 203 + 211, by the lane's rehearsal
-- comparison (every function's body, arguments, volatility, definer flag, settings, grants, owner):
-- 0 lines differ. tests/security/galleryVeilCures.pglite.test.js pins it.
--
-- NOT reversed, because there is nothing to: no stored row was written by 212.

-- ── 1. the six functions 212 restated, at the frozen 211's statements, verbatim ───────────────────────

-- [212 down: back to 211 at 333b33973] public._gallery_veil_card
create or replace function public._gallery_veil_card(kind text, c jsonb, cls jsonb, byid jsonb, excj jsonb, legacy jsonb)
returns jsonb language plpgsql immutable as $$
declare
  kd jsonb := public._gallery_veil_kinds() -> kind;
  id text := public._gallery_veil_card_id(kind, c);
  f text;
  own jsonb;
  drops text[] := array[]::text[];
begin
  if jsonb_typeof(cls) is distinct from 'array' then cls := '[]'; end if;
  if jsonb_typeof(byid) is distinct from 'object' then byid := '{}'; end if;
  for f in select jsonb_array_elements_text(cls) loop
    if id is null or not (excj ? ('field:' || kind || ':' || id || ':' || f)) then drops := drops || f; end if;
  end loop;
  if id is null then
    own := legacy;  -- every eye on any legacy event, unioned once per read (the review's F5)
  else
    own := byid -> id;
  end if;
  drops := drops || array(select jsonb_array_elements_text(coalesce(own, '[]')));
  -- SERVER ONLY (COHERENCE-VEIL-4, V4-2; the chair's ruling 331): a person stored by master's client
  -- carries `factionGoal` and `linkedFactionIds`, which master's goals and ties eyes governed
  -- (db832c892:galleryVeil.js:155,159). The people car retired both names, so the client's table no
  -- longer lists them; here they are the same content as the eye that governs them, withheld with it
  -- and sent as before while it is open. Never the client's table: it stays the client's, field for field.
  return c - array(
    select k from unnest(drops) f2,
      lateral (select jsonb_array_elements_text(case when kd -> 'fields' ? f2
        then (kd -> 'fields' -> f2) || coalesce('{"npc": {"goals": ["factionGoal"], "ties": ["linkedFactionIds"]}}'::jsonb -> kind -> f2, '[]')
        else jsonb_build_array(f2) end) k) kk
     where not (kd -> 'floor' ? k));
end $$;

-- [212 down: back to 211 at 333b33973] public._gallery_veil_apply
create or replace function public._gallery_veil_apply(pub jsonb, res jsonb)
returns jsonb language plpgsql immutable as $$
declare
  s jsonb := case when jsonb_typeof(pub) = 'object' then pub else '{}'::jsonb end;
  excj jsonb := coalesce(res -> 'exc', '{}');
  groupings text[] := array(select jsonb_array_elements_text(coalesce(res -> 'groupings', '[]')));
  card_hides jsonb := coalesce(res -> 'cards', '{}');
  classes jsonb := coalesce(res -> 'classes', '{}');
  fields jsonb := coalesce(res -> 'fields', '{}');
  gone_ids jsonb := '{}';
  gone_houses jsonb := '{}';
  services_of jsonb;
  people_of jsonb := '{}';
  kind text;
  g text;
begin
  -- X-21e: a card-hidden house goes whole only when the data puts it in the class.
  -- (set-based, the review's F5: one pass, never a growing object rebuilt per house)
  if card_hides <> '{}' then
    with h as (
      select c.card, i.id, public._gallery_veil_house(c.card) as house
        from public._gallery_veil_cards(s, 'institution') c, lateral (select public._gallery_veil_inst_id(c.card) as id) i
       where card_hides ? i.id
    )
    select coalesce((select jsonb_object_agg(id, true) from h where house), '{}'),
           coalesce((select jsonb_object_agg(card ->> 'name', true) from h where house and public._gallery_veil_str(card -> 'name') <> ''), '{}'),
           fields || jsonb_build_object('institution', coalesce(fields -> 'institution', '{}') || coalesce((
             select jsonb_object_agg(q.id, (select jsonb_agg(distinct f) from (
                 select jsonb_array_elements_text(coalesce(fields #> array['institution', q.id], '[]')) f
                 union select unnest(array['description', 'function', 'services', 'people'])) u))
               from (select distinct id from h where not house) q), '{}'))
      into gone_ids, gone_houses, fields;
    if fields -> 'institution' = '{}' then fields := fields - 'institution'; end if;
  end if;

  -- the virtual institution eyes, read before any card is touched
  if fields -> 'institution' is not null or classes -> 'institution' is not null then
    with v as (
      select c.card ->> 'name' as name,
             coalesce(fields #> array['institution', i.id], '[]') ? 'services'
               or (coalesce(classes -> 'institution', '[]') ? 'services' and not (excj ? ('field:institution:' || i.id || ':services'))) as vs,
             coalesce(fields #> array['institution', i.id], '[]') ? 'people'
               or (coalesce(classes -> 'institution', '[]') ? 'people' and not (excj ? ('field:institution:' || i.id || ':people'))) as vp
        from public._gallery_veil_cards(s, 'institution') c, lateral (select public._gallery_veil_inst_id(c.card) as id) i
       where public._gallery_veil_str(c.card -> 'name') <> ''
    )
    select coalesce((select jsonb_object_agg(name, true) from v where vs), '{}'), coalesce((select jsonb_object_agg(name, true) from v where vp), '{}')
      into services_of, people_of;
  else
    services_of := '{}';
  end if;
  services_of := gone_houses || services_of;

  -- cards: class switches, then per-card eyes
  foreach kind in array public._gallery_veil_kind_order() loop
    if classes -> kind is null and fields -> kind is null then continue; end if;
    s := public._gallery_veil_map(s, kind, 'eyes', jsonb_build_object('cls', classes -> kind, 'byid', fields -> kind, 'exc', excj,
      'legacy', case when kind = 'event' then coalesce((select jsonb_agg(distinct f) from jsonb_each(coalesce(fields -> 'event', '{}')) e(k, v),
                                                          jsonb_array_elements_text(v) f where k like 'event.legacy-%'), '[]') end));
  end loop;

  -- an institution's services: the rows in availableServices it offers
  if jsonb_typeof(s -> 'availableServices') = 'object' and services_of <> '{}' then
    s := jsonb_set(s, '{availableServices}', (select coalesce(jsonb_object_agg(k, case when jsonb_typeof(v) = 'array' then coalesce((
        select jsonb_agg(e order by o) from jsonb_array_elements(v) with ordinality x(e, o)
         where not (jsonb_typeof(e) = 'object' and services_of ? public._gallery_veil_str(e -> 'institution'))), '[]') else v end), '{}')
      from jsonb_each(s -> 'availableServices') y(k, v)));
  end if;

  -- X-21e: a house removed whole leaves the institutions list
  if gone_ids <> '{}' and jsonb_typeof(s -> 'institutions') = 'array' then
    s := jsonb_set(s, '{institutions}', coalesce((select jsonb_agg(e order by o) from jsonb_array_elements(s -> 'institutions') with ordinality x(e, o)
      where not (jsonb_typeof(e) = 'object' and gone_ids ? public._gallery_veil_inst_id(e) and public._gallery_veil_house(e))), '[]'));
  end if;

  -- an institution's people, and every reference to a house removed whole
  if people_of <> '{}' or gone_houses <> '{}' or gone_ids <> '{}' then
    s := public._gallery_veil_map(s, 'npc', 'npc', jsonb_build_object('people', people_of, 'gone_houses', gone_houses, 'gone_ids', gone_ids));
  end if;

  -- groupings last
  foreach g in array groupings loop
    s := public._gallery_veil_grouping(s, g);
  end loop;
  return s;
end $$;

-- [212 down: back to 211 at 333b33973] public._gallery_apply_member_overrides
create or replace function public._gallery_apply_member_overrides(
  base jsonb,
  dm_full jsonb,
  overrides jsonb,
  settlement_share_dm boolean,
  settlement_importable boolean,
  for_import boolean
) returns jsonb language sql immutable as $$
  select case
    when jsonb_typeof(base -> 'npcs') is distinct from 'array' then base
    else jsonb_set(base, '{npcs}', coalesce((
      select jsonb_agg(
        case
          when (
            case when for_import then
              coalesce(case coalesce(overrides -> public._gallery_npc_key(npc) -> 'revealDm', 'null')
                              when 'true' then true when 'null' then null else false end, settlement_share_dm)
              and coalesce(case coalesce(overrides -> public._gallery_npc_key(npc) -> 'allowImport', 'null')
                                  when 'true' then true when 'null' then null else false end, settlement_importable)
            else
              coalesce(case coalesce(overrides -> public._gallery_npc_key(npc) -> 'revealDm', 'null')
                              when 'true' then true when 'null' then null else false end, settlement_share_dm)
            end
          )
          then coalesce(
            (select e from jsonb_array_elements(dm_full -> 'npcs') e
              where public._gallery_npc_key(e) = public._gallery_npc_key(npc) limit 1),
            npc)
          else public._gallery_sanitize_public_json(jsonb_build_object('npcs', jsonb_build_array(npc))) -> 'npcs' -> 0
        end
        order by ord
      )
      from jsonb_array_elements(base -> 'npcs') with ordinality as t(npc, ord)
    ), '[]'::jsonb))
  end;
$$;

-- [212 down: back to 211 at 333b33973] public.get_gallery_dossier
create or replace function public.get_gallery_dossier(dossier_slug text)
returns table (
  id uuid,
  public_slug text,
  name text,
  tier text,
  data jsonb,
  published_at timestamptz,
  updated_at timestamptz,
  view_count integer,
  is_curated boolean,
  gallery_description text,
  gallery_image_url text,
  gallery_image_alt text,
  gallery_tags text[],
  gallery_share_dm boolean,
  gallery_importable boolean,
  gallery_member_overrides jsonb,
  population integer,
  terrain text,
  government_type text,
  magic_level text,
  stability text,
  primary_resource text,
  threat_level text,
  net_votes integer,
  comment_count integer,
  chronicle jsonb,
  author_name text,
  aliveness integer
)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select
    r.id,
    r.public_slug,
    r.name,
    r.tier,
    coalesce(vl.v -> 'body', proj.d) as data,
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
    vl.v -> 'served' as gallery_member_overrides,
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
  -- 211: a share in snapshot mode is served its frozen copy, through the same projection. A copy
  -- past the server's bound is REFUSED (no row), never replaced by the live row (the review's F1).
  cross join lateral (
    select case when cp.copy is not null then cp.copy else base.j end as j,
           cp.copy is not null as copied,
           coalesce(length(cp.copy::text) > public._gallery_veil_copy_bound(), false) as refused
      from (select case when mv.v ->> 'mode' = 'snapshot' and jsonb_typeof(mv.v -> 'snapshot') = 'object' then mv.v -> 'snapshot' end as copy
              from (select s.gallery_member_overrides -> '$veil' as v offset 0) mv) cp
  ) src
  -- 211: the editor's working state (decrees, dmLayer) never travels, Reveal DM or not (the third
  -- review's V3-1; the client's full mode strips both)
  cross join lateral (
    select public._gallery_apply_member_overrides(
      case when s.gallery_share_dm then public._gallery_dm_full_json(src.j) - array['decrees', 'dmLayer'] else public._gallery_sanitize_public_json(src.j) end,
      public._gallery_dm_full_json(src.j),
      s.gallery_member_overrides, s.gallery_share_dm, s.gallery_importable, false
    ) as d
    offset 0
  ) proj
  -- 211: the share's veil, applied here (NULL for an unmarked listing: served as before); the freeze
  -- date travels only with the frozen copy (R5)
  cross join lateral (select public._gallery_veil(proj.d, s.gallery_member_overrides, false, src.copied) as v offset 0) vl
  where s.public_slug = dossier_slug
    and s.is_public = true
    and not src.refused
  limit 1;
$$;

revoke execute on function public.get_gallery_dossier(text) from public;
grant execute on function public.get_gallery_dossier(text) to authenticated, anon;

-- [212 down: back to 211 at 333b33973] public.get_unlisted_dossier
create or replace function public.get_unlisted_dossier(p_slug text)
returns jsonb
language sql stable security definer set search_path = public, pg_temp
as $$
  select jsonb_build_object(
    'id', s.id,
    'name', s.name,
    'tier', s.tier,
    'slug', s.unlisted_slug,
    'unlisted', true,
    'author_name', ap.external_name,
    'is_owner', coalesce(s.user_id = auth.uid(), false),
    'gallery_share_dm', false,
    -- 211: nothing of the share travels but each member's two booleans and the served marker.
    'gallery_member_overrides', vl.v -> 'served',
    'dossier', vl.v -> 'body'
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
  cross join lateral (select public._gallery_sanitize_public_json(base.j) as j offset 0) pub
  cross join lateral (
    select public._gallery_apply_member_overrides(
      pub.j, pub.j,
      s.gallery_member_overrides, false, s.gallery_importable, false
    ) as d
    offset 0
  ) proj
  -- 211: the share's veil; an unmarked share takes the default veil (the link's readers are players)
  cross join lateral (select public._gallery_veil(proj.d, s.gallery_member_overrides, true) as v offset 0) vl
  where s.unlisted_slug = p_slug
  limit 1;
$$;
grant execute on function public.get_unlisted_dossier(text) to authenticated, anon;

-- [212 down: back to 211 at 333b33973] public.import_gallery_dossier
create or replace function public.import_gallery_dossier(dossier_slug text)
returns table (
  id uuid,
  name text,
  tier text,
  data jsonb
)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select
    s.id,
    s.name,
    s.tier,
    coalesce(vl.v -> 'body', proj.d) as data
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
  cross join lateral (
    select case when cp.copy is not null then cp.copy else base.j end as j,
           cp.copy is not null as copied,
           coalesce(length(cp.copy::text) > public._gallery_veil_copy_bound(), false) as refused
      from (select case when mv.v ->> 'mode' = 'snapshot' and jsonb_typeof(mv.v -> 'snapshot') = 'object' then mv.v -> 'snapshot' end as copy
              from (select s.gallery_member_overrides -> '$veil' as v offset 0) mv) cp
  ) src
  -- 211: the editor's working state (decrees, dmLayer) never travels, Reveal DM or not (the third
  -- review's V3-1; the client's full mode strips both)
  cross join lateral (
    select public._gallery_apply_member_overrides(
      case when s.gallery_share_dm then public._gallery_dm_full_json(src.j) - array['decrees', 'dmLayer'] else public._gallery_sanitize_public_json(src.j) end,
      public._gallery_dm_full_json(src.j),
      s.gallery_member_overrides, s.gallery_share_dm, s.gallery_importable, true
    ) as d
    offset 0
  ) proj
  -- 211: the share's veil (NULL for an unmarked listing: served as before)
  cross join lateral (select public._gallery_veil(proj.d, s.gallery_member_overrides, false, src.copied) as v offset 0) vl
  where s.public_slug = dossier_slug
    and s.is_public = true
    and not src.refused
    and s.gallery_importable = true
    and auth.uid() is not null
    -- ── mig 120: IMPORT is premium (server-authoritative). Free/anon → 0 rows. ──
    and public.current_user_has_premium_access()
  limit 1;
$$;

revoke execute on function public.import_gallery_dossier(text) from public;
grant execute on function public.import_gallery_dossier(text) to authenticated;

-- ── 2. the helpers 212 created, by signature (thirty-one: COHERENCE-VEIL-10 replaced the eighth seat's sweep, _folded_name, _names and _sweep, by the name search's fourteen, _name_* and _named; COHERENCE-VEIL-11 added _case_fold; COHERENCE-VEIL-12 added _name_bound and _name_pad, and _clauses, which VEIL-15 replaced by _runs; VEIL-16 added _name_json and _name_tokens, and _name_near takes a range of tokens) ──
drop function if exists public._gallery_veil_runs(jsonb);
drop function if exists public._gallery_veil_embeds(jsonb, text[]);
drop function if exists public._gallery_veil_case_fold(text);
drop function if exists public._gallery_veil_fold(text);
drop function if exists public._gallery_veil_hidden_name(jsonb, jsonb, text[], jsonb);
drop function if exists public._gallery_veil_member_revealed(jsonb, jsonb, boolean, boolean, boolean);
drop function if exists public._gallery_veil_name_bound();
drop function if exists public._gallery_veil_name_case();
drop function if exists public._gallery_veil_name_floor(jsonb, jsonb, text[]);
drop function if exists public._gallery_veil_name_fold(text);
drop function if exists public._gallery_veil_name_hit(text, jsonb, jsonb, jsonb);
drop function if exists public._gallery_veil_name_hits(jsonb, jsonb);
drop function if exists public._gallery_veil_name_json(text);
drop function if exists public._gallery_veil_name_near(integer, integer, integer[]);
drop function if exists public._gallery_veil_name_needle(text, jsonb);
drop function if exists public._gallery_veil_name_pad(text);
drop function if exists public._gallery_veil_name_prep(text);
drop function if exists public._gallery_veil_name_ready(text, jsonb);
drop function if exists public._gallery_veil_name_search(text[], text[]);
drop function if exists public._gallery_veil_name_sep(boolean);
drop function if exists public._gallery_veil_name_sweep(jsonb, jsonb, jsonb, jsonb);
drop function if exists public._gallery_veil_name_taken(jsonb, jsonb, boolean, jsonb, jsonb, jsonb);
drop function if exists public._gallery_veil_name_tokens(jsonb);
drop function if exists public._gallery_veil_named(jsonb, jsonb, jsonb, jsonb);
drop function if exists public._gallery_veil_pieces(jsonb);
drop function if exists public._gallery_veil_roster_members(jsonb, jsonb, boolean, boolean, boolean);
drop function if exists public._gallery_veil_roster_splice(jsonb, jsonb, boolean, boolean, boolean);
drop function if exists public._gallery_veil_second_homes(jsonb, jsonb, jsonb);
drop function if exists public._gallery_veil_sources(jsonb, jsonb, jsonb, jsonb);
drop function if exists public._gallery_veil_tie_pieces(jsonb);
drop function if exists public._gallery_veil_tie_roles(jsonb, jsonb, jsonb, boolean, boolean, boolean);

-- ── VEIL-DOORS (the seventh chair's seat, 2026-11-20): its block, last ────────────────────────────────────────────
-- 212's VEIL-DOORS section restated two functions and created eight helpers (the eighth, _gallery_doors_tiles, is
-- VEIL-DOORS-2's: the one-row tile rule). Back: get_gallery_map at 211's statement
-- (verbatim, its grant as 211 states it) and _gallery_public_tile_rows at 147's (verbatim; get_gallery_dossier, which
-- calls the helpers, is already back at 211's above). The tile rows' revoke from anon and authenticated is NOT reversed:
-- no client calls the helper, every read that does is a definer, and a down file never reopens a door (on a chain whose
-- scaffold grants nothing by default the catalogue is 211's exactly). Then the eight helpers, by signature.

-- [212 down: VEIL-DOORS, back to 211] public.get_gallery_map
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
end $$;

grant execute on function public.get_gallery_map(text) to anon, authenticated;

-- [212 down: VEIL-DOORS, back to 147] public._gallery_public_tile_rows
create or replace function public._gallery_public_tile_rows()
returns table (
  id uuid,
  public_slug text,
  name text,
  tier text,
  published_at timestamptz,
  updated_at timestamptz,
  view_count integer,
  is_curated boolean,
  gallery_description text,
  gallery_image_url text,
  gallery_image_alt text,
  gallery_tags text[],
  population integer,
  terrain text,
  government_type text,
  magic_level text,
  stability text,
  primary_resource text,
  threat_level text,
  culture text,
  prosperity text,
  primary_deity text,
  at_war boolean,
  net_votes integer,
  comment_count integer,
  owner_id uuid,
  importable boolean,
  aliveness integer,
  reactions jsonb
)
language sql
stable
security definer
set search_path = public
as $$
  select
    s.id,
    s.public_slug,
    -- 148: the sharer's display title (147), falling back to the settlement
    -- name — the ONE fallback chokepoint for every gallery surface.
    coalesce(nullif(btrim(s.gallery_title), ''), s.name) as name,
    s.tier,
    s.published_at,
    coalesce(s.gallery_updated_at, s.updated_at, s.published_at) as updated_at,
    s.view_count,
    s.is_curated,
    s.gallery_description,
    s.gallery_image_url,
    s.gallery_image_alt,
    s.gallery_tags,
    case
      when (s.data->>'population') ~ '^[0-9]+$' then (s.data->>'population')::integer
      else null
    end as population,
    coalesce(
      nullif(s.data #>> '{config,terrainType}', ''),
      nullif(s.data #>> '{config,terrainOverride}', ''),
      nullif(s.data #>> '{geography,terrain}', ''),
      nullif(s.data->>'terrain', '')
    ) as terrain,
    coalesce(
      nullif(s.data #>> '{powerStructure,government}', ''),
      nullif(s.data #>> '{powerStructure,governingName}', ''),
      nullif(s.data #>> '{powerStructure,governmentType}', ''),
      nullif(s.data #>> '{government,type}', ''),
      nullif(s.data->>'governmentType', '')
    ) as government_type,
    coalesce(
      nullif(s.data #>> '{config,magicLevel}', ''),
      nullif(s.data->>'magicLevel', '')
    ) as magic_level,
    coalesce(
      nullif(s.data #>> '{powerStructure,stability}', ''),
      nullif(s.data #>> '{viability,stability}', ''),
      nullif(s.data #>> '{systemState,stability}', ''),
      nullif(s.data->>'stability', '')
    ) as stability,
    coalesce(
      nullif(s.data #>> '{config,nearbyResources,0}', ''),
      nullif(s.data #>> '{nearbyResources,0}', '')
    ) as primary_resource,
    coalesce(
      nullif(s.data #>> '{threatProfile,level}', ''),
      nullif(s.data #>> '{defense,threatLevel}', ''),
      nullif(s.data->>'threatLevel', '')
    ) as threat_level,
    coalesce(
      nullif(s.gallery_facet_culture, ''),
      nullif(s.data #>> '{config,culture}', '')
    ) as culture,
    coalesce(
      nullif(s.gallery_facet_prosperity, ''),
      nullif(s.data #>> '{economicState,prosperity}', '')
    ) as prosperity,
    coalesce(
      nullif(s.gallery_facet_deity, ''),
      nullif(s.data #>> '{config,primaryDeitySnapshot,name}', '')
    ) as primary_deity,
    coalesce(s.gallery_facet_at_war, false) as at_war,
    coalesce(v.vote_count, 0)::integer as net_votes,
    coalesce(c.comment_count, 0)::integer as comment_count,
    s.user_id as owner_id,
    coalesce(s.gallery_importable, false) as importable,
    -- 148: the publish-time aliveness snapshot (147). RAW + nullable — null is
    -- "never stamped" (pre-phase-2 share / no owning campaign), which sorts
    -- nulls-last under most_alive instead of masquerading as a zero score.
    s.gallery_facet_aliveness as aliveness,
    -- 148: per-key reaction counts (146), '{}' when none — the card digest
    -- rides the tile row instead of N+1 state RPCs.
    coalesce(rx.reactions, '{}'::jsonb) as reactions
  from public.settlements s
  left join (
    select settlement_id, count(*)::integer as vote_count
    from public.gallery_votes
    group by settlement_id
  ) v on v.settlement_id = s.id
  left join (
    select settlement_id, count(*)::integer as comment_count
    from public.gallery_comments
    where deleted_at is null
    group by settlement_id
  ) c on c.settlement_id = s.id
  left join (
    select settlement_id, jsonb_object_agg(reaction_key, cnt) as reactions
    from (
      select settlement_id, reaction_key, count(*)::integer as cnt
      from public.gallery_reactions
      group by settlement_id, reaction_key
    ) rk
    group by settlement_id
  ) rx on rx.settlement_id = s.id
  where s.is_public = true;
$$;

revoke execute on function public._gallery_public_tile_rows() from public;

drop function if exists public._gallery_doors_chronicle(jsonb, jsonb, jsonb, jsonb, boolean);
drop function if exists public._gallery_doors_chronicle_classes();
drop function if exists public._gallery_doors_closed(jsonb);
drop function if exists public._gallery_doors_tiles(jsonb, jsonb, boolean, jsonb, text, text, text);
drop function if exists public._gallery_doors_tile(text, text[]);
drop function if exists public._gallery_doors_names(jsonb, jsonb);
drop function if exists public._gallery_doors_squeeze(text);
drop function if exists public._gallery_doors_band(text);
