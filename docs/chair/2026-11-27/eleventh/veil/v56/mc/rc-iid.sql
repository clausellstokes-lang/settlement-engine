-- MC LOCAL TRIAL ONLY (never applied but to a local test database)
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
      when (dd.d->>'population') ~ '^[0-9]+$' then (dd.d->>'population')::integer
      else null
    end as population,
    coalesce(
      nullif(dd.d #>> '{config,terrainType}', ''),
      nullif(dd.d #>> '{config,terrainOverride}', ''),
      nullif(dd.d #>> '{geography,terrain}', ''),
      nullif(dd.d->>'terrain', '')
    ) as terrain,
    coalesce(
      nullif(dd.d #>> '{powerStructure,government}', ''),
      nullif(dd.d #>> '{powerStructure,governingName}', ''),
      nullif(dd.d #>> '{powerStructure,governmentType}', ''),
      nullif(dd.d #>> '{government,type}', ''),
      nullif(dd.d->>'governmentType', '')
    ) as government_type,
    coalesce(
      nullif(dd.d #>> '{config,magicLevel}', ''),
      nullif(dd.d->>'magicLevel', '')
    ) as magic_level,
    coalesce(
      nullif(dd.d #>> '{powerStructure,stability}', ''),
      nullif(dd.d #>> '{viability,stability}', ''),
      nullif(dd.d #>> '{systemState,stability}', ''),
      nullif(dd.d->>'stability', '')
    ) as stability,
    coalesce(
      nullif(dd.d #>> '{config,nearbyResources,0}', ''),
      nullif(dd.d #>> '{nearbyResources,0}', '')
    ) as primary_resource,
    coalesce(
      nullif(dd.d #>> '{threatProfile,level}', ''),
      nullif(dd.d #>> '{defense,threatLevel}', ''),
      nullif(dd.d->>'threatLevel', '')
    ) as threat_level,
    coalesce(
      nullif(s.gallery_facet_culture, ''),
      nullif(dd.d #>> '{config,culture}', '')
    ) as culture,
    coalesce(
      nullif(s.gallery_facet_prosperity, ''),
      nullif(dd.d #>> '{economicState,prosperity}', '')
    ) as prosperity,
    coalesce(
      nullif(s.gallery_facet_deity, ''),
      nullif(dd.d #>> '{config,primaryDeitySnapshot,name}', '')
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
  cross join lateral (select s.data || '{}'::jsonb as d offset 0) dd
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
