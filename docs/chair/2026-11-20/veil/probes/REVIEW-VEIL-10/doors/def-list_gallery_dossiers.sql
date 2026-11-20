CREATE OR REPLACE FUNCTION public.list_gallery_dossiers(page_number integer DEFAULT 0, page_size integer DEFAULT 24, sort_key text DEFAULT 'relevant'::text, search_query text DEFAULT ''::text, filters jsonb DEFAULT '{}'::jsonb, exclude_curated boolean DEFAULT true)
 RETURNS TABLE(id uuid, public_slug text, name text, tier text, published_at timestamp with time zone, updated_at timestamp with time zone, view_count integer, is_curated boolean, gallery_description text, gallery_image_url text, gallery_image_alt text, gallery_tags text[], population integer, terrain text, government_type text, magic_level text, stability text, primary_resource text, threat_level text, culture text, prosperity text, primary_deity text, at_war boolean, net_votes integer, comment_count integer, importable boolean, author_name text, aliveness integer, reactions jsonb, total_count bigint)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$

