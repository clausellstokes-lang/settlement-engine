-- MC LOCAL TRIAL ONLY (never applied but to a local test database)
create or replace function public._gallery_public_tile_row(p_id uuid)
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
  where s.is_public = true and s.id = p_id;
$;
revoke execute on function public._gallery_public_tile_row(uuid) from public;
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
volatile
security definer
set search_path = public, pg_temp
as $$
  select
    r.id,
    r.public_slug,
    r.name,
    r.tier,
    -- VEIL-19 (item D (4)): an unmarked share is served as before, but for each income row's `weight` (every non-owner read)
    coalesce(vl.v -> 'body', case when jsonb_typeof(proj.d -> 'economicState') = 'object' and jsonb_typeof(proj.d #> '{economicState,incomeSources}') = 'array'
              then jsonb_set(proj.d, '{economicState,incomeSources}', (select coalesce(jsonb_agg(case when jsonb_typeof(e) = 'object' then e - 'weight' else e end order by o), '[]')
                                                                         from jsonb_array_elements(proj.d #> '{economicState,incomeSources}') with ordinality x(e, o)))
              else proj.d end) as data,
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
  cross join lateral public._gallery_public_tile_row(s.id) r
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
  -- review's V3-1; the client's full mode strips both), nor the author's custom-content library (the fifth
  -- review's V5-3, ruled by the chair: customContentRoster, customContentProvenance, which no page shows)
  cross join lateral (
    select public._gallery_apply_member_overrides(
      case when s.gallery_share_dm then public._gallery_dm_full_json(src.j) - array['decrees', 'dmLayer', 'customContentRoster', 'customContentProvenance']
           else public._gallery_sanitize_public_json(src.j) end,
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
