-- ────────────────────────────────────────────────────────────────────────────
-- 045_gallery_maps.sql — Project 2, Phase 1: share + import a MAP via the gallery.
--
-- Lighter-weight than a discriminated gallery_items table: maps publish from the
-- saved_maps table with the SAME flag-based pattern as settlements (migration
-- 008), and all public reads go ONLY through SECURITY DEFINER RPCs (saved_maps
-- stays owner-only RLS — no public row policy, matching the settlements posture
-- after migration 020). Phase 1 supports kind='map' = a REUSABLE BLANK CANVAS:
-- the backdrop (FMG geography OR custom image) WITHOUT placements/settlements, so
-- there is zero NPC/prose privacy surface. kind='map_with_campaign' is added in
-- Phase 2 (it carries member dossiers + needs an allowlist projection).
-- ════════════════════════════════════════════════════════════════════════════

-- ── sharing columns on saved_maps (mirror settlements migration 008/019) ──────
alter table public.saved_maps
  add column if not exists is_public            boolean not null default false,
  add column if not exists public_slug          text,
  add column if not exists published_at          timestamptz,
  add column if not exists view_count           integer not null default 0,
  add column if not exists share_kind           text not null default 'map'
    check (share_kind in ('map', 'map_with_campaign')),
  add column if not exists gallery_share_campaign boolean not null default false,
  add column if not exists gallery_description   text,
  add column if not exists gallery_tags          text[];

create unique index if not exists saved_maps_public_slug_unique
  on public.saved_maps(public_slug) where public_slug is not null;
create index if not exists saved_maps_public_published
  on public.saved_maps(published_at desc) where is_public = true;

-- ── publish / unpublish (SECURITY DEFINER, owner-gated; reuses _make_public_slug) ─
create or replace function public.publish_map(
  target_id    uuid,
  p_kind       text default 'map',
  p_description text default null,
  p_tags       text[] default null
) returns text
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  existing_slug text;
  new_slug      text;
  v_kind        text := case when p_kind = 'map_with_campaign' then 'map_with_campaign' else 'map' end;
begin
  perform 1 from public.saved_maps where id = target_id and user_id = auth.uid();
  if not found then raise exception 'Not found or not owned by caller'; end if;

  select public_slug into existing_slug from public.saved_maps where id = target_id;
  if existing_slug is null then
    loop
      new_slug := public._make_public_slug();
      begin
        update public.saved_maps
          set is_public = true, public_slug = new_slug, published_at = now(),
              share_kind = v_kind,
              gallery_share_campaign = (v_kind = 'map_with_campaign'),
              gallery_description = left(coalesce(p_description, ''), 500),
              gallery_tags = p_tags
          where id = target_id;
        existing_slug := new_slug;
        exit;
      exception when unique_violation then /* retry */
      end;
    end loop;
  else
    update public.saved_maps
      set is_public = true, published_at = now(), share_kind = v_kind,
          gallery_share_campaign = (v_kind = 'map_with_campaign'),
          gallery_description = left(coalesce(p_description, ''), 500),
          gallery_tags = p_tags
      where id = target_id;
  end if;
  return existing_slug;
end $$;

create or replace function public.unpublish_map(target_id uuid)
returns void
language plpgsql security definer set search_path = public, pg_temp as $$
begin
  perform 1 from public.saved_maps where id = target_id and user_id = auth.uid();
  if not found then raise exception 'Not found or not owned by caller'; end if;
  update public.saved_maps set is_public = false where id = target_id;  -- slug preserved for re-share
end $$;

-- ── public-safe BLANK-CANVAS projection ──────────────────────────────────────
-- Extract ONLY the backdrop from a saved map's mapState (FMG geography OR custom
-- image), dropping placements / labels / markers / settlementIds / regionalGraph
-- / worldState. Used by get_gallery_map for kind='map'.
create or replace function public._gallery_map_backdrop(p_map_data jsonb)
returns jsonb language sql immutable set search_path = pg_temp as $$
  select jsonb_strip_nulls(jsonb_build_object(
    'fmgSnapshot',    ms->'fmgSnapshot',
    'seed',           ms->'seed',
    'customBackdrop',  ms->'customBackdrop'
  ))
  from (select coalesce(p_map_data->'campaign'->'mapState', p_map_data->'mapState', '{}'::jsonb) as ms) s;
$$;

-- ── list public maps (anonymized tiles; no owner identity) ────────────────────
create or replace function public.list_gallery_maps(
  p_page int default 0,
  p_page_size int default 24
) returns table(
  slug text, name text, kind text, description text, tags text[],
  backdrop_kind text, thumb_url text, published_at timestamptz, view_count int
) language sql security definer set search_path = public, pg_temp as $$
  select
    m.public_slug,
    m.name,
    m.share_kind,
    m.gallery_description,
    m.gallery_tags,
    case when public._gallery_map_backdrop(m.map_data) ? 'customBackdrop' then 'image' else 'fmg' end,
    public._gallery_map_backdrop(m.map_data)->'customBackdrop'->>'imageUrl',
    m.published_at,
    m.view_count
  from public.saved_maps m
  where m.is_public = true and m.public_slug is not null
  order by m.published_at desc
  limit greatest(1, least(coalesce(p_page_size, 24), 60))
  offset greatest(0, coalesce(p_page, 0)) * greatest(1, least(coalesce(p_page_size, 24), 60));
$$;

-- ── fetch one public map (blank-canvas backdrop only in Phase 1) ──────────────
create or replace function public.get_gallery_map(p_slug text)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare row public.saved_maps; begin
  select * into row from public.saved_maps where public_slug = p_slug and is_public = true;
  if not found then return null; end if;
  update public.saved_maps set view_count = view_count + 1 where id = row.id;
  return jsonb_build_object(
    'slug', row.public_slug,
    'name', row.name,
    'kind', row.share_kind,
    'description', row.gallery_description,
    'tags', to_jsonb(row.gallery_tags),
    -- Phase 1: always the blank-canvas backdrop. (map_with_campaign member
    -- projection arrives in Phase 2 behind the gallery_share_campaign opt-in.)
    'backdrop', public._gallery_map_backdrop(row.map_data)
  );
end $$;

-- ── grants: anon + authenticated may read the gallery RPCs; publish is owner-only ─
revoke all on function public.publish_map(uuid, text, text, text[]) from public;
revoke all on function public.unpublish_map(uuid)                   from public;
grant execute on function public.publish_map(uuid, text, text, text[]) to authenticated;
grant execute on function public.unpublish_map(uuid)                   to authenticated;
grant execute on function public.list_gallery_maps(int, int)           to anon, authenticated;
grant execute on function public.get_gallery_map(text)                 to anon, authenticated;
grant execute on function public._gallery_map_backdrop(jsonb)          to anon, authenticated;
