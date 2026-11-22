-- ────────────────────────────────────────────────────────────────────────────
-- 071_gallery_importable_facet.sql — surface the existing gallery_importable
-- opt-in (047) as a filterable gallery facet.
--
-- The "Importable" sidebar facet lets readers narrow the public gallery to
-- dossiers whose owner opted IN to import/clone (gallery_importable = true,
-- migration 047; toggled by ShareToGallery). The flag already exists and gates
-- the import RPC (048); this only EXPOSES it to the list query as a facet — no
-- new privacy surface (the flag is already returned by get_gallery_dossier).
--
-- list_gallery_dossiers enumerates each facet in its WHERE clause, so a new facet
-- requires the column to flow through _gallery_public_tile_rows() and a new
-- `importable` filter branch. The tile-rows helper is a SECURITY DEFINER function
-- whose OUT-parameter row type cannot be altered by CREATE OR REPLACE, and every
-- list RPC depends on it, so this follows migration 063's exact recreate order:
-- drop the dependents, recreate tile-rows with one new trailing column, then
-- recreate list_gallery_dossiers (the only consumer that filters on it). The
-- other consumers (more_by_creator / my_gallery / get_gallery_dossier) select
-- explicit columns from tile-rows and do NOT need the new column, so they are
-- recreated verbatim from 063/047 to restore the chain the drops removed.
--
-- Depends on: 070 (gallery_realm_arc_summary) is unrelated; 047 supplies
-- gallery_importable. Idempotent (drop if exists + create or replace).
--
-- OPERATOR
--   • Apply via `supabase db push` (or the SQL editor) AFTER 047. Recreates the
--     gallery list-RPC chain in place; additive (one new facet column +
--     one WHERE branch), safe to re-run. No data backfill — gallery_importable
--     already carries each owner's opt-in.
--   • Rollback: re-apply migration 063 (restores the chain without the facet),
--     then `alter ... ` is not needed (no new table column was added).
-- ────────────────────────────────────────────────────────────────────────────

-- Drop the dependents first (063's order): all read _gallery_public_tile_rows().
drop function if exists public.list_my_gallery_dossiers();
drop function if exists public.list_gallery_more_by_creator(text, integer);
drop function if exists public.list_gallery_dossiers(integer, integer, text, text, jsonb, boolean);
drop function if exists public.get_gallery_dossier(text);
drop function if exists public._gallery_public_tile_rows();

-- ── Recreate the tile-rows helper — 063 verbatim + a trailing importable col ──
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
  importable boolean
)
language sql
stable
security definer
set search_path = public
as $$
  select
    s.id,
    s.public_slug,
    s.name,
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
    -- NEW: the owner import opt-in (migration 047), surfaced so the gallery list
    -- can offer it as an "Importable" facet. Defaults false for any row whose
    -- owner never opted in.
    coalesce(s.gallery_importable, false) as importable
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
  where s.is_public = true;
$$;

revoke execute on function public._gallery_public_tile_rows() from public;

-- ── Recreate list_gallery_dossiers — 063 verbatim + importable col + facet ────
create or replace function public.list_gallery_dossiers(
  page_number integer default 0,
  page_size integer default 24,
  sort_key text default 'relevant',
  search_query text default '',
  filters jsonb default '{}'::jsonb,
  exclude_curated boolean default true
)
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
  importable boolean,
  total_count bigint
)
language sql
stable
security definer
set search_path = public
as $$
  with filtered as (
    select *,
      (
        case when is_curated then 40 else 0 end
        + least(net_votes * 6, 120)
        + least(comment_count * 4, 80)
        + least(floor(sqrt(greatest(view_count, 0)))::integer, 60)
        + case when gallery_image_url is not null and gallery_image_url <> '' then 8 else 0 end
        + greatest(0, 30 - floor(extract(epoch from (now() - coalesce(updated_at, published_at, now()))) / 86400 / 7)::integer)
      ) as relevance_score
    from public._gallery_public_tile_rows()
    where (not exclude_curated or is_curated = false)
      and (
        coalesce(search_query, '') = ''
        or name ilike '%' || search_query || '%'
        or coalesce(gallery_description, '') ilike '%' || search_query || '%'
        or exists (
          select 1 from unnest(coalesce(gallery_tags, '{}')) tag
          where tag ilike '%' || search_query || '%'
        )
      )
      and (
        not (filters ? 'tier')
        or jsonb_array_length(filters->'tier') = 0
        or tier in (select jsonb_array_elements_text(filters->'tier'))
      )
      and (
        not (filters ? 'terrain')
        or jsonb_array_length(filters->'terrain') = 0
        or terrain in (select jsonb_array_elements_text(filters->'terrain'))
      )
      and (
        not (filters ? 'magicLevel')
        or jsonb_array_length(filters->'magicLevel') = 0
        or magic_level in (select jsonb_array_elements_text(filters->'magicLevel'))
      )
      and (
        not (filters ? 'culture')
        or jsonb_array_length(filters->'culture') = 0
        or culture in (select jsonb_array_elements_text(filters->'culture'))
      )
      and (
        not (filters ? 'prosperity')
        or jsonb_array_length(filters->'prosperity') = 0
        or prosperity in (select jsonb_array_elements_text(filters->'prosperity'))
      )
      and (
        coalesce((filters->>'hasDeity')::boolean, false) = false
        or coalesce(primary_deity, '') <> ''
      )
      and (
        coalesce((filters->>'atWar')::boolean, false) = false
        or at_war = true
      )
      and (
        not (filters ? 'populationMin')
        or population is null
        or population >= (filters->>'populationMin')::integer
      )
      and (
        not (filters ? 'populationMax')
        or population is null
        or population <= (filters->>'populationMax')::integer
      )
      -- NEW: owner import opt-in facet (migration 047 flag, surfaced 071).
      and (
        coalesce((filters->>'importable')::boolean, false) = false
        or importable = true
      )
      and (
        coalesce((filters->>'hasImage')::boolean, false) = false
        or coalesce(gallery_image_url, '') <> ''
      )
      and (
        coalesce((filters->>'hasComments')::boolean, false) = false
        or comment_count > 0
      )
      and (
        coalesce((filters->>'curatedOnly')::boolean, false) = false
        or is_curated = true
      )
  ),
  counted as (
    select *, count(*) over () as total_count from filtered
  )
  select
    id, public_slug, name, tier, published_at, updated_at, view_count,
    is_curated, gallery_description, gallery_image_url, gallery_image_alt,
    gallery_tags, population, terrain, government_type, magic_level,
    stability, primary_resource, threat_level, culture, prosperity,
    primary_deity, at_war, net_votes, comment_count, importable,
    total_count
  from counted
  order by
    case when sort_key = 'top_voted' then net_votes end desc nulls last,
    case when sort_key = 'most_viewed' then view_count end desc nulls last,
    case when sort_key = 'most_commented' then comment_count end desc nulls last,
    case when sort_key = 'newest' then published_at end desc nulls last,
    case when sort_key = 'recently_updated' then updated_at end desc nulls last,
    case when sort_key = 'population_desc' then population end desc nulls last,
    case when sort_key = 'population_asc' then population end asc nulls last,
    case when sort_key = 'name_asc' then name end asc nulls last,
    relevance_score desc,
    published_at desc
  limit greatest(1, least(page_size, 60))
  offset greatest(0, page_number) * greatest(1, least(page_size, 60));
$$;

revoke execute on function public.list_gallery_dossiers(integer, integer, text, text, jsonb, boolean) from public;
grant execute on function public.list_gallery_dossiers(integer, integer, text, text, jsonb, boolean) to authenticated, anon;

-- ── Recreate list_gallery_more_by_creator (063 verbatim — selects explicit r.* )
create or replace function public.list_gallery_more_by_creator(source_slug text, limit_count integer default 6)
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
  comment_count integer
)
language sql
stable
security definer
set search_path = public
as $$
  with source as (
    select user_id, id from public.settlements
    where public_slug = source_slug and is_public = true
    limit 1
  )
  select
    r.id, r.public_slug, r.name, r.tier, r.published_at, r.updated_at,
    r.view_count, r.is_curated, r.gallery_description, r.gallery_image_url,
    r.gallery_image_alt, r.gallery_tags, r.population, r.terrain,
    r.government_type, r.magic_level, r.stability, r.primary_resource,
    r.threat_level, r.culture, r.prosperity, r.primary_deity, r.at_war,
    r.net_votes, r.comment_count
  from public._gallery_public_tile_rows() r, source
  where r.owner_id = source.user_id and r.id <> source.id
  order by r.published_at desc
  limit greatest(1, least(limit_count, 12));
$$;

revoke execute on function public.list_gallery_more_by_creator(text, integer) from public;
grant execute on function public.list_gallery_more_by_creator(text, integer) to authenticated, anon;

-- ── Recreate list_my_gallery_dossiers (063 verbatim — selects explicit r.* ) ──
create or replace function public.list_my_gallery_dossiers()
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
  comment_count integer
)
language sql
stable
security definer
set search_path = public
as $$
  select
    r.id, r.public_slug, r.name, r.tier, r.published_at, r.updated_at, r.view_count,
    r.is_curated, r.gallery_description, r.gallery_image_url, r.gallery_image_alt,
    r.gallery_tags, r.population, r.terrain, r.government_type, r.magic_level,
    r.stability, r.primary_resource, r.threat_level, r.culture, r.prosperity,
    r.primary_deity, r.at_war, r.net_votes, r.comment_count
  from public._gallery_public_tile_rows() r
  join public.settlements s on s.id = r.id
  where s.user_id = auth.uid()
  order by r.published_at desc nulls last;
$$;

revoke execute on function public.list_my_gallery_dossiers() from public;
grant execute on function public.list_my_gallery_dossiers() to authenticated;

comment on function public.list_my_gallery_dossiers() is
  'Gallery "My Settlements" (§5): the caller''s own published dossiers as tiles (same shape as list_gallery_dossiers). Auth-only — owner-scoped via auth.uid().';

-- ── Recreate get_gallery_dossier (047 verbatim — selects explicit columns) ────
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
  population integer,
  terrain text,
  government_type text,
  magic_level text,
  stability text,
  primary_resource text,
  threat_level text,
  net_votes integer,
  comment_count integer,
  chronicle jsonb
)
language sql
stable
security definer
set search_path = public
as $$
  select
    r.id,
    r.public_slug,
    r.name,
    r.tier,
    case
      when s.gallery_share_dm then public._gallery_dm_full_json(base.j)
      else public._gallery_sanitize_public_json(base.j)
    end as data,
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
    r.population,
    r.terrain,
    r.government_type,
    r.magic_level,
    r.stability,
    r.primary_resource,
    r.threat_level,
    r.net_votes,
    r.comment_count,
    public._gallery_chronicle_json(s.campaign_state -> 'eventLog') as chronicle
  from public.settlements s
  join public._gallery_public_tile_rows() r on r.id = s.id
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
$$;

revoke execute on function public.get_gallery_dossier(text) from public;
grant execute on function public.get_gallery_dossier(text) to authenticated, anon;

comment on function public.get_gallery_dossier(text) is
  'Public gallery detail read. Returns safe columns plus settlement data (full DM view trimmed to the DM Compass when gallery_share_dm, otherwise server-sanitized; AI-narrated base when gallery_share_narrated is set and present, else the raw simulation), the gallery_importable opt-in flag, and the allowlist-projected event chronicle (newest 50; see _gallery_chronicle_entry).';
