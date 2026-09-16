-- ────────────────────────────────────────────────────────────────────────────
-- 147_gallery_tile_chain_aliveness_title_reactions.sql — surface the phase-2
-- columns through the gallery tile-rows/list-RPC chain (GALLERY-2 phase 2).
--
-- ONE drop-recreate of the chain, carrying THREE shape deltas (one recreate
-- instead of three — they ship in the same deploy batch, and each recreate of
-- this chain is the project's most error-prone migration shape):
--
--   1. ALIVENESS — the tile rows gain a trailing `aliveness integer`
--      (settlements.gallery_facet_aliveness, 147; the publish-time snapshot).
--      list_gallery_dossiers gains:
--        • a mild relevance term: + least(floor(coalesce(aliveness,0)/10.0), 10)
--          — at most +10, beside curated 40 / votes ≤120 / comments ≤80 /
--          views ≤60 / image 8 / recency ≤30 (a liveness nudge, not a takeover).
--        • the 'most_alive' sort key (desc nulls last — un-stamped rows fall
--          back to relevance order rather than reading as dead).
--   2. GALLERY TITLE — the helper's `name` column becomes
--      coalesce(nullif(btrim(gallery_title), ''), name): the ONE chokepoint,
--      so list/dossier/more-by-creator/my-settlements/OG-prerender/search all
--      inherit the sharer's display title (147) with zero per-surface code.
--      Search (name ilike) now matches the DISPLAYED title — intended.
--   3. REACTIONS — the tile rows gain a trailing `reactions jsonb`
--      ({ reaction_key: count }, '{}' when none) aggregated from
--      gallery_reactions (146), so cards can render the reaction digest
--      without N+1 state RPC calls.
--
-- PRECEDENT: 063 → 071 (the tile-rows helper is a SECURITY DEFINER function
-- whose RETURNS TABLE row type cannot be altered by CREATE OR REPLACE — 42P13
-- — and every list RPC depends on it). Drop order and grant restoration follow
-- 071 exactly. Each body is forked from its NET-CURRENT definition (the
-- migration-recreate rule, 076:13-14):
--   • _gallery_public_tile_rows        ← 071
--   • list_gallery_dossiers            ← 076
--   • list_gallery_more_by_creator     ← 076
--   • list_my_gallery_dossiers         ← 076
--   • get_gallery_dossier              ← 093 (the member-overrides security fix
--     — its projection CASE and _gallery_apply_member_overrides call are
--     preserved byte-for-byte; only `aliveness` is added)
--
-- Depends on: 146 (gallery_reactions), 147 (the columns).
-- OPERATOR: apply via `supabase db push` AFTER 146+147 — rides the end-of-cycle
--   deploy batch. Idempotent (drop if exists + create or replace); no data
--   writes. (The `profiles` references below are read-only author-name JOINs —
--   this migration writes no money/PII table.)
-- @rollback: re-apply migrations 076 + 093 verbatim (they restore the whole
--   tile-rows/list-RPC chain without the phase-2 columns; function-only, no
--   data reversal needed).
-- ────────────────────────────────────────────────────────────────────────────

-- Drop the dependents first (071's order): all read _gallery_public_tile_rows().
drop function if exists public.list_my_gallery_dossiers();
drop function if exists public.list_gallery_more_by_creator(text, integer);
drop function if exists public.list_gallery_dossiers(integer, integer, text, text, jsonb, boolean);
drop function if exists public.get_gallery_dossier(text);
drop function if exists public._gallery_public_tile_rows();

-- ── Recreate the tile-rows helper — 071 verbatim + title coalesce + two
-- trailing columns (aliveness, reactions) ─────────────────────────────────────
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

-- ── Recreate list_gallery_dossiers — 076 verbatim + aliveness/reactions cols,
-- the aliveness relevance term, and the 'most_alive' sort key ─────────────────
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
  author_name text,
  aliveness integer,
  reactions jsonb,
  total_count bigint
)
language sql
stable
security definer
set search_path = public
as $$
  with filtered as (
    select r.*,
      (
        case when r.is_curated then 40 else 0 end
        + least(r.net_votes * 6, 120)
        + least(r.comment_count * 4, 80)
        + least(floor(sqrt(greatest(r.view_count, 0)))::integer, 60)
        + case when r.gallery_image_url is not null and r.gallery_image_url <> '' then 8 else 0 end
        + greatest(0, 30 - floor(extract(epoch from (now() - coalesce(r.updated_at, r.published_at, now()))) / 86400 / 7)::integer)
        -- 148: the aliveness term — a MILD liveness nudge (at most +10 beside
        -- votes' 120): a lived-in world edges out an identical fresh one, and
        -- an un-stamped row (null) simply takes no nudge.
        + least(floor(coalesce(r.aliveness, 0) / 10.0)::integer, 10)
      ) as relevance_score
    from public._gallery_public_tile_rows() r
    where (not exclude_curated or r.is_curated = false)
      and (
        coalesce(search_query, '') = ''
        or r.name ilike '%' || search_query || '%'
        or coalesce(r.gallery_description, '') ilike '%' || search_query || '%'
        or exists (
          select 1 from unnest(coalesce(r.gallery_tags, '{}')) tag
          where tag ilike '%' || search_query || '%'
        )
      )
      and (
        not (filters ? 'tier')
        or jsonb_array_length(filters->'tier') = 0
        or r.tier in (select jsonb_array_elements_text(filters->'tier'))
      )
      and (
        not (filters ? 'terrain')
        or jsonb_array_length(filters->'terrain') = 0
        or r.terrain in (select jsonb_array_elements_text(filters->'terrain'))
      )
      and (
        not (filters ? 'magicLevel')
        or jsonb_array_length(filters->'magicLevel') = 0
        or r.magic_level in (select jsonb_array_elements_text(filters->'magicLevel'))
      )
      and (
        not (filters ? 'culture')
        or jsonb_array_length(filters->'culture') = 0
        or r.culture in (select jsonb_array_elements_text(filters->'culture'))
      )
      and (
        not (filters ? 'prosperity')
        or jsonb_array_length(filters->'prosperity') = 0
        or r.prosperity in (select jsonb_array_elements_text(filters->'prosperity'))
      )
      and (
        coalesce((filters->>'hasDeity')::boolean, false) = false
        or coalesce(r.primary_deity, '') <> ''
      )
      and (
        coalesce((filters->>'atWar')::boolean, false) = false
        or r.at_war = true
      )
      and (
        not (filters ? 'populationMin')
        or r.population is null
        or r.population >= (filters->>'populationMin')::integer
      )
      and (
        not (filters ? 'populationMax')
        or r.population is null
        or r.population <= (filters->>'populationMax')::integer
      )
      and (
        coalesce((filters->>'importable')::boolean, false) = false
        or r.importable = true
      )
      and (
        coalesce((filters->>'hasImage')::boolean, false) = false
        or coalesce(r.gallery_image_url, '') <> ''
      )
      and (
        coalesce((filters->>'hasComments')::boolean, false) = false
        or r.comment_count > 0
      )
      and (
        coalesce((filters->>'curatedOnly')::boolean, false) = false
        or r.is_curated = true
      )
  ),
  counted as (
    select *, count(*) over () as total_count from filtered
  )
  select
    c.id, c.public_slug, c.name, c.tier, c.published_at, c.updated_at, c.view_count,
    c.is_curated, c.gallery_description, c.gallery_image_url, c.gallery_image_alt,
    c.gallery_tags, c.population, c.terrain, c.government_type, c.magic_level,
    c.stability, c.primary_resource, c.threat_level, c.culture, c.prosperity,
    c.primary_deity, c.at_war, c.net_votes, c.comment_count, c.importable,
    ap.external_name as author_name,
    c.aliveness,
    c.reactions,
    c.total_count
  from counted c
  left join public.profiles ap on ap.id = c.owner_id
  order by
    case when sort_key = 'top_voted' then c.net_votes end desc nulls last,
    case when sort_key = 'most_viewed' then c.view_count end desc nulls last,
    case when sort_key = 'most_commented' then c.comment_count end desc nulls last,
    case when sort_key = 'newest' then c.published_at end desc nulls last,
    case when sort_key = 'recently_updated' then c.updated_at end desc nulls last,
    case when sort_key = 'population_desc' then c.population end desc nulls last,
    case when sort_key = 'population_asc' then c.population end asc nulls last,
    case when sort_key = 'name_asc' then c.name end asc nulls last,
    -- 148: 'most alive' — the aliveness snapshot, un-stamped rows last (they
    -- fall through to the relevance tiebreak below, not to a fake zero).
    case when sort_key = 'most_alive' then c.aliveness end desc nulls last,
    c.relevance_score desc,
    c.published_at desc
  limit greatest(1, least(page_size, 60))
  offset greatest(0, page_number) * greatest(1, least(page_size, 60));
$$;

revoke execute on function public.list_gallery_dossiers(integer, integer, text, text, jsonb, boolean) from public;
grant execute on function public.list_gallery_dossiers(integer, integer, text, text, jsonb, boolean) to authenticated, anon;

-- ── Recreate list_gallery_more_by_creator — 076 verbatim + aliveness/reactions ─
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
  comment_count integer,
  author_name text,
  aliveness integer,
  reactions jsonb
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
    r.net_votes, r.comment_count,
    ap.external_name as author_name,
    r.aliveness,
    r.reactions
  -- CROSS JOIN (not a comma-join) so `r` stays in scope for the LEFT JOIN's ON
  -- clause: `FROM r, source LEFT JOIN ...` parses as `FROM r, (source LEFT JOIN
  -- ...)`, putting r out of scope (42P01). Explicit joins bind left-to-right.
  from public._gallery_public_tile_rows() r
  cross join source
  left join public.profiles ap on ap.id = r.owner_id
  where r.owner_id = source.user_id and r.id <> source.id
  order by r.published_at desc
  limit greatest(1, least(limit_count, 12));
$$;

revoke execute on function public.list_gallery_more_by_creator(text, integer) from public;
grant execute on function public.list_gallery_more_by_creator(text, integer) to authenticated, anon;

-- ── Recreate list_my_gallery_dossiers — 076 verbatim + aliveness/reactions ────
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
  comment_count integer,
  author_name text,
  aliveness integer,
  reactions jsonb
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
    r.primary_deity, r.at_war, r.net_votes, r.comment_count,
    ap.external_name as author_name,
    r.aliveness,
    r.reactions
  from public._gallery_public_tile_rows() r
  join public.settlements s on s.id = r.id
  left join public.profiles ap on ap.id = r.owner_id
  where s.user_id = auth.uid()
  order by r.published_at desc nulls last;
$$;

revoke execute on function public.list_my_gallery_dossiers() from public;
grant execute on function public.list_my_gallery_dossiers() to authenticated;

comment on function public.list_my_gallery_dossiers() is
  'Gallery "My Settlements": the caller''s own published dossiers as tiles (same shape as list_gallery_dossiers, plus author_name resolved by id). Auth-only — owner-scoped via auth.uid().';

-- ── Recreate get_gallery_dossier — 093 verbatim (the member-overrides security
-- fix preserved byte-for-byte) + the trailing aliveness column ────────────────
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
set search_path = public
as $$
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
$$;

revoke execute on function public.get_gallery_dossier(text) from public;
grant execute on function public.get_gallery_dossier(text) to authenticated, anon;

comment on function public.get_gallery_dossier(text) is
  'Public gallery detail read (093 member-overrides model preserved; 148 adds the aliveness snapshot). The data projection is chosen by the SETTLEMENT gallery_share_dm only; per-NPC overrides reveal an individually-opted-in member by splicing its full record from the DM-full projection, and reduce every other member to the public allowlist. name is the sharer''s gallery title falling back to the settlement name (147/148).';
