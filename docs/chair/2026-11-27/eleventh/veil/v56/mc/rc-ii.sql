-- MC LOCAL TRIAL ONLY (never applied but to a local test database)
alter table public.settlements add column if not exists mc_population integer, add column if not exists mc_terrain text, add column if not exists mc_government_type text, add column if not exists mc_magic_level text, add column if not exists mc_stability text, add column if not exists mc_primary_resource text, add column if not exists mc_threat_level text, add column if not exists mc_culture text, add column if not exists mc_prosperity text, add column if not exists mc_primary_deity text;
-- the backfill writes no row's updated_at (a user trigger would move the tile's own updated_at)
alter table public.settlements disable trigger user;
update public.settlements s set mc_population = case
      when (s.data->>'population') ~ '^[0-9]+$' then (s.data->>'population')::integer
      else null
    end,
  mc_terrain = coalesce(
      nullif(s.data #>> '{config,terrainType}', ''),
      nullif(s.data #>> '{config,terrainOverride}', ''),
      nullif(s.data #>> '{geography,terrain}', ''),
      nullif(s.data->>'terrain', '')
    ),
  mc_government_type = coalesce(
      nullif(s.data #>> '{powerStructure,government}', ''),
      nullif(s.data #>> '{powerStructure,governingName}', ''),
      nullif(s.data #>> '{powerStructure,governmentType}', ''),
      nullif(s.data #>> '{government,type}', ''),
      nullif(s.data->>'governmentType', '')
    ),
  mc_magic_level = coalesce(
      nullif(s.data #>> '{config,magicLevel}', ''),
      nullif(s.data->>'magicLevel', '')
    ),
  mc_stability = coalesce(
      nullif(s.data #>> '{powerStructure,stability}', ''),
      nullif(s.data #>> '{viability,stability}', ''),
      nullif(s.data #>> '{systemState,stability}', ''),
      nullif(s.data->>'stability', '')
    ),
  mc_primary_resource = coalesce(
      nullif(s.data #>> '{config,nearbyResources,0}', ''),
      nullif(s.data #>> '{nearbyResources,0}', '')
    ),
  mc_threat_level = coalesce(
      nullif(s.data #>> '{threatProfile,level}', ''),
      nullif(s.data #>> '{defense,threatLevel}', ''),
      nullif(s.data->>'threatLevel', '')
    ),
  mc_culture = coalesce(
      nullif(s.gallery_facet_culture, ''),
      nullif(s.data #>> '{config,culture}', '')
    ),
  mc_prosperity = coalesce(
      nullif(s.gallery_facet_prosperity, ''),
      nullif(s.data #>> '{economicState,prosperity}', '')
    ),
  mc_primary_deity = coalesce(
      nullif(s.gallery_facet_deity, ''),
      nullif(s.data #>> '{config,primaryDeitySnapshot,name}', '')
    )
 where s.is_public = true;
alter table public.settlements enable trigger user;
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
    s.mc_population as population,
    s.mc_terrain as terrain,
    s.mc_government_type as government_type,
    s.mc_magic_level as magic_level,
    s.mc_stability as stability,
    s.mc_primary_resource as primary_resource,
    s.mc_threat_level as threat_level,
    s.mc_culture as culture,
    s.mc_prosperity as prosperity,
    s.mc_primary_deity as primary_deity,
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
