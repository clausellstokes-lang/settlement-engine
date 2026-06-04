-- ────────────────────────────────────────────────────────────────────────────
-- 019_gallery_community.sql - Community gallery metadata, votes, comments.
--
-- Builds on migrations 008/011/018:
--   - only canonized, owner-published settlements can enter the gallery;
--   - public readers can browse dossiers without account identity leakage;
--   - comments/votes require auth, but public reads expose only safe handles.
-- ────────────────────────────────────────────────────────────────────────────

alter table public.settlements
  add column if not exists gallery_description text,
  add column if not exists gallery_image_url text,
  add column if not exists gallery_image_alt text,
  add column if not exists gallery_tags text[] not null default '{}',
  add column if not exists gallery_updated_at timestamptz;

create index if not exists idx_settlements_gallery_tags
  on public.settlements using gin(gallery_tags)
  where is_public = true;

create table if not exists public.gallery_votes (
  settlement_id uuid not null references public.settlements(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (settlement_id, user_id)
);

alter table public.gallery_votes enable row level security;

drop policy if exists "Users can read their own gallery votes" on public.gallery_votes;
create policy "Users can read their own gallery votes"
  on public.gallery_votes
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can upvote public settlements" on public.gallery_votes;
create policy "Users can upvote public settlements"
  on public.gallery_votes
  for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.settlements s
      where s.id = settlement_id and s.is_public = true
    )
  );

drop policy if exists "Users can remove their own gallery votes" on public.gallery_votes;
create policy "Users can remove their own gallery votes"
  on public.gallery_votes
  for delete
  using (auth.uid() = user_id);

create table if not exists public.gallery_comments (
  id uuid primary key default gen_random_uuid(),
  settlement_id uuid not null references public.settlements(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

alter table public.gallery_comments enable row level security;

create index if not exists idx_gallery_comments_settlement_created
  on public.gallery_comments(settlement_id, created_at desc)
  where deleted_at is null;

drop policy if exists "Public can read visible gallery comments" on public.gallery_comments;
drop policy if exists "Comment authors can read their own gallery comments" on public.gallery_comments;
create policy "Comment authors can read their own gallery comments"
  on public.gallery_comments
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can comment on public settlements" on public.gallery_comments;
create policy "Users can comment on public settlements"
  on public.gallery_comments
  for insert
  with check (
    auth.uid() = user_id
    and char_length(trim(body)) between 1 and 2000
    and exists (
      select 1 from public.settlements s
      where s.id = settlement_id and s.is_public = true
    )
  );

drop policy if exists "Users can soft delete their own gallery comments" on public.gallery_comments;
create policy "Users can soft delete their own gallery comments"
  on public.gallery_comments
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

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
  net_votes integer,
  comment_count integer,
  owner_id uuid
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
      nullif(s.data #>> '{config,terrain}', ''),
      nullif(s.data #>> '{geography,terrain}', ''),
      nullif(s.data #>> '{environment,terrain}', ''),
      nullif(s.data->>'terrain', '')
    ) as terrain,
    coalesce(
      nullif(s.data #>> '{powerStructure,governmentType}', ''),
      nullif(s.data #>> '{government,type}', ''),
      nullif(s.data->>'governmentType', '')
    ) as government_type,
    coalesce(
      nullif(s.data #>> '{config,magicLevel}', ''),
      nullif(s.data->>'magicLevel', '')
    ) as magic_level,
    coalesce(
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
    coalesce(v.vote_count, 0)::integer as net_votes,
    coalesce(c.comment_count, 0)::integer as comment_count,
    s.user_id as owner_id
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
  net_votes integer,
  comment_count integer,
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
        not (filters ? 'governmentType')
        or jsonb_array_length(filters->'governmentType') = 0
        or government_type in (select jsonb_array_elements_text(filters->'governmentType'))
      )
      and (
        not (filters ? 'magicLevel')
        or jsonb_array_length(filters->'magicLevel') = 0
        or magic_level in (select jsonb_array_elements_text(filters->'magicLevel'))
      )
      and (
        not (filters ? 'stability')
        or jsonb_array_length(filters->'stability') = 0
        or stability in (select jsonb_array_elements_text(filters->'stability'))
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
    stability, primary_resource, threat_level, net_votes, comment_count,
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
    r.threat_level, r.net_votes, r.comment_count
  from public._gallery_public_tile_rows() r, source
  where r.owner_id = source.user_id and r.id <> source.id
  order by r.published_at desc
  limit greatest(1, least(limit_count, 12));
$$;

revoke execute on function public.list_gallery_more_by_creator(text, integer) from public;
grant execute on function public.list_gallery_more_by_creator(text, integer) to authenticated, anon;

create or replace function public.toggle_gallery_vote(target_settlement_id uuid)
returns table (net_votes integer, voted boolean)
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Sign in to vote';
  end if;

  perform 1 from public.settlements
    where id = target_settlement_id and is_public = true;
  if not found then
    raise exception 'Settlement is not public';
  end if;

  if exists (
    select 1 from public.gallery_votes
    where settlement_id = target_settlement_id and user_id = auth.uid()
  ) then
    delete from public.gallery_votes
      where settlement_id = target_settlement_id and user_id = auth.uid();
    return query
      select count(*)::integer, false
      from public.gallery_votes
      where settlement_id = target_settlement_id;
  else
    insert into public.gallery_votes(settlement_id, user_id)
      values (target_settlement_id, auth.uid())
      on conflict do nothing;
    return query
      select count(*)::integer, true
      from public.gallery_votes
      where settlement_id = target_settlement_id;
  end if;
end;
$$;

revoke execute on function public.toggle_gallery_vote(uuid) from public;
grant execute on function public.toggle_gallery_vote(uuid) to authenticated;

create or replace function public.get_gallery_vote_state(target_settlement_id uuid)
returns table (net_votes integer, voted boolean)
language sql
stable
security definer
set search_path = public
as $$
  select
    count(*)::integer as net_votes,
    coalesce(bool_or(user_id = auth.uid()), false) as voted
  from public.gallery_votes
  where settlement_id = target_settlement_id;
$$;

revoke execute on function public.get_gallery_vote_state(uuid) from public;
grant execute on function public.get_gallery_vote_state(uuid) to authenticated, anon;

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
    case
      when c.user_id = s.user_id then 'Creator'
      else 'A DM'
    end as author_label
  from public.gallery_comments c
  join public.settlements s on s.id = c.settlement_id
  where c.settlement_id = target_settlement_id
    and c.deleted_at is null
    and s.is_public = true
  order by c.created_at desc
  limit 100;
$$;

revoke execute on function public.list_gallery_comments(uuid) from public;
grant execute on function public.list_gallery_comments(uuid) to authenticated, anon;

create or replace function public.add_gallery_comment(target_settlement_id uuid, comment_body text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  comment_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Sign in to comment';
  end if;
  if char_length(trim(coalesce(comment_body, ''))) < 1 then
    raise exception 'Comment cannot be empty';
  end if;
  if char_length(trim(comment_body)) > 2000 then
    raise exception 'Comment is too long';
  end if;

  perform 1 from public.settlements
    where id = target_settlement_id and is_public = true;
  if not found then
    raise exception 'Settlement is not public';
  end if;

  insert into public.gallery_comments(settlement_id, user_id, body)
    values (target_settlement_id, auth.uid(), trim(comment_body))
    returning id into comment_id;
  return comment_id;
end;
$$;

revoke execute on function public.add_gallery_comment(uuid, text) from public;
grant execute on function public.add_gallery_comment(uuid, text) to authenticated;

create or replace function public.delete_gallery_comment(target_comment_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.gallery_comments
    set deleted_at = now(), updated_at = now()
    where id = target_comment_id and user_id = auth.uid() and deleted_at is null;
  if not found then
    raise exception 'Comment not found or not owned by caller';
  end if;
end;
$$;

revoke execute on function public.delete_gallery_comment(uuid) from public;
grant execute on function public.delete_gallery_comment(uuid) to authenticated;

comment on column public.settlements.gallery_description is
  'Public owner-written description shown above the read-only public dossier.';
comment on column public.settlements.gallery_image_url is
  'Optional public image URL used as the gallery thumbnail / detail image.';
comment on table public.gallery_votes is
  'One upvote per authenticated user per public settlement. Public UI shows net upvotes starting at zero.';
comment on table public.gallery_comments is
  'Authenticated comments on public settlements. Public display goes through safe-label RPCs, not direct table reads.';
