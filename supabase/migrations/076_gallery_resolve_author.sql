-- ────────────────────────────────────────────────────────────────────────────
-- 076_gallery_resolve_author.sql — resolve the gallery AUTHOR by user id.
--
-- OPERATOR NOTE
--   Recreates the NET-CURRENT gallery list/detail RPCs to add `author_name`,
--   resolved LIVE by a LEFT JOIN onto profiles.external_name (075) keyed on the
--   owner's user_id. JOIN, NEVER DENORMALIZE — the same rename-safety principle
--   as the dossier-hyperlink feature: because the name is resolved at read time,
--   a rename via update_external_name (075) reflects in every gallery surface
--   with ZERO backfill. Nothing is denormalized today, so there is no column to
--   migrate — author_name is a purely additive joined column.
--
--   Each RPC is forked from its NET-CURRENT body (the migration-recreate rule —
--   fork the highest-numbered def so in-between guards are not dropped):
--     • list_gallery_dossiers      ← 071
--     • list_gallery_more_by_creator ← 071
--     • list_my_gallery_dossiers   ← 071 (own name; still resolved by id)
--     • get_gallery_dossier        ← 071
--     • list_gallery_maps          ← 072
--     • list_gallery_comments      ← 019 (upgrade the generic label to the name)
--
--   _gallery_public_tile_rows() (063) already exposes owner_id; the dossier
--   list/more RPCs JOIN profiles onto that. The maps RPC JOINs onto
--   saved_maps.user_id. All grants (anon, authenticated) + the
--   `revoke … from public` lines are preserved EXACTLY as net-current.
--
-- ADDITIVE/IDEMPOTENT: create-or-replace only; no data writes.
-- Depends on: 075 (external_name), 071, 072, 063, 019.
-- ────────────────────────────────────────────────────────────────────────────

-- ── list_gallery_dossiers — fork 071, add author_name (joined by owner_id) ───
-- The return table gains author_name, so the existing function must be DROPPED
-- first: CREATE OR REPLACE cannot change a function's return type (42P13). The
-- function is an API leaf (no DB dependents), so a plain DROP IF EXISTS is safe;
-- the grants below are re-established after the recreate.
drop function if exists public.list_gallery_dossiers(integer, integer, text, text, jsonb, boolean);
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
    -- 076: resolve the CURRENT external_name live by owner id (JOIN, not denorm).
    ap.external_name as author_name,
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
    c.relevance_score desc,
    c.published_at desc
  limit greatest(1, least(page_size, 60))
  offset greatest(0, page_number) * greatest(1, least(page_size, 60));
$$;

revoke execute on function public.list_gallery_dossiers(integer, integer, text, text, jsonb, boolean) from public;
grant execute on function public.list_gallery_dossiers(integer, integer, text, text, jsonb, boolean) to authenticated, anon;

-- ── list_gallery_more_by_creator — fork 071, add author_name ─────────────────
drop function if exists public.list_gallery_more_by_creator(text, integer);
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
  author_name text
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
    ap.external_name as author_name
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

-- ── list_my_gallery_dossiers — fork 071, add author_name (own, still by id) ──
drop function if exists public.list_my_gallery_dossiers();
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
  author_name text
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
    ap.external_name as author_name
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

-- ── get_gallery_dossier — fork 071, add author_name ──────────────────────────
drop function if exists public.get_gallery_dossier(text);
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
  chronicle jsonb,
  author_name text
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
    public._gallery_chronicle_json(s.campaign_state -> 'eventLog') as chronicle,
    ap.external_name as author_name
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
  'Public gallery detail read. Returns safe columns plus settlement data (DM/sanitized/narrated variants), the gallery_importable flag, the allowlist-projected chronicle, and author_name resolved LIVE by owner id (076 — a rename reflects here automatically).';

-- ── list_gallery_maps — fork 072, add author_name (joined by saved_maps.user_id)
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
  author_name text
) language sql security definer set search_path = public, pg_temp as $$
  with base as (
    select
      m.public_slug,
      m.name,
      m.share_kind,
      m.gallery_description,
      m.gallery_tags,
      case when public._gallery_map_backdrop(m.map_data) ? 'customBackdrop' then 'image' else 'fmg' end as backdrop_kind,
      public._gallery_map_backdrop(m.map_data)->'customBackdrop'->>'imageUrl' as thumb_url,
      m.published_at,
      m.view_count,
      m.import_count,
      coalesce(m.gallery_importable, false) as importable,
      -- author resolved live by owner id (076).
      ap.external_name as author_name,
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
    where m.is_public = true and m.public_slug is not null
  )
  select
    public_slug, name, share_kind, gallery_description, gallery_tags,
    backdrop_kind, thumb_url, published_at, view_count, import_count,
    member_count, importable, author_name
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
    published_at desc
  limit greatest(1, least(coalesce(p_page_size, 24), 60))
  offset greatest(0, coalesce(p_page, 0)) * greatest(1, least(coalesce(p_page_size, 24), 60));
$$;

grant execute on function public.list_gallery_maps(int, int, text, text, jsonb) to anon, authenticated;

-- ── list_gallery_comments — fork 019, upgrade the generic author label ───────
-- 019 emitted a CASE label ('Creator' for the dossier owner, 'A DM' otherwise).
-- Resolve the REAL external_name by id instead, falling back to those generic
-- labels when a commenter has no name yet (defence-in-depth; 075 backfills all).
drop function if exists public.list_gallery_comments(uuid);
create or replace function public.list_gallery_comments(target_settlement_id uuid)
returns table (
  id uuid,
  body text,
  created_at timestamptz,
  updated_at timestamptz,
  can_delete boolean,
  author_label text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    c.id,
    c.body,
    c.created_at,
    c.updated_at,
    auth.uid() = c.user_id as can_delete,
    -- 076: resolve the REAL author name by id, falling back to the 019 generic
    -- labels only when a commenter somehow has no external_name (075 backfills
    -- all rows, so the fallback is defence-in-depth).
    coalesce(
      ap.external_name,
      case when c.user_id = s.user_id then 'Creator' else 'A DM' end
    ) as author_label
  from public.gallery_comments c
  join public.settlements s on s.id = c.settlement_id
  left join public.profiles ap on ap.id = c.user_id
  where c.settlement_id = target_settlement_id
    and c.deleted_at is null
    and s.is_public = true
  order by c.created_at desc
  limit 100;
$$;

revoke execute on function public.list_gallery_comments(uuid) from public;
grant execute on function public.list_gallery_comments(uuid) to authenticated, anon;
