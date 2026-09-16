-- ────────────────────────────────────────────────────────────────────────────
-- 168_gallery_visibility_and_featured.sql — Vision V-13 + V-20, the three gallery
-- rulings folded into ONE coherent gallery migration (owner-commissioned
-- 2026-07-20). WRITTEN-NOT-DEPLOYED (standing law; applies via `supabase db push`).
--
--   A. FEATURED (per-section, admin-set) — the small top-billed hero set, the
--      sibling of migration 011's `curated`. On BOTH settlements AND saved_maps
--      (a shared campaign IS a saved_maps row, share_kind='map_with_campaign', so
--      map-featured covers the campaign section too). Admin/developer-only RLS
--      write, explicit display-order. HIDDEN-UNTIL-OCCUPIED is a UI honesty rule
--      (an empty Featured section never renders) — the DB just returns [].
--
--   B. VISIBILITY {public | unlisted} — party-only sharing. THE CLEAN MODEL: an
--      unlisted row is `is_public = false` + a CRYPTO-RANDOM `unlisted_slug`, so
--      it is ABSENT from every existing public browse/list/featured/curated path
--      BY CONSTRUCTION (they all filter is_public = true) — this migration edits
--      NONE of those security-critical RPCs, nor the shared _gallery_public_tile_
--      rows() helper, nor the sanitizer. Unlisted reads go through thin NEW RPCs
--      that REUSE the authoritative sanitizer _gallery_sanitize_public_json. The
--      owner sees their own unlisted rows via list_my_unlisted_*; a non-owner
--      never can. Revoke = slug rotation (old link dies).
--
-- RLS pair pinned (executed pglite): OWNER-SEES-OWN-UNLISTED and
-- NON-OWNER-LISTING-NEVER-CONTAINS-UNLISTED — tests/security/galleryUnlisted*.
--
-- @rollback: purely additive + reversible. To reverse: drop functions
--   set_featured_map / list_featured_maps / _make_unlisted_slug / {share,rotate,
--   revoke}_settlement_unlisted / get_unlisted_dossier / list_my_unlisted_dossiers
--   / {share,rotate,revoke}_map_unlisted / get_unlisted_map / list_my_unlisted_maps
--   and re-create set_featured/list_featured_dossiers at their migration-167 form;
--   drop indexes idx_{settlements,saved_maps}_featured,
--   {settlements,saved_maps}_unlisted_slug_unique; drop columns is_featured,
--   featured_order, visibility, unlisted_slug from settlements + saved_maps. No
--   data migration is needed (all columns default to prior behavior:
--   is_featured=false, visibility='public'). Reads public.profiles only for the
--   admin gate (no profiles write).
-- ────────────────────────────────────────────────────────────────────────────

-- ════════════════════════════════════════════════════════════════════════════
--  A.  FEATURED  (settlements + saved_maps)
-- ════════════════════════════════════════════════════════════════════════════

-- ── A1. settlements.is_featured ──────────────────────────────────────────────
alter table public.settlements
  add column if not exists is_featured boolean not null default false,
  add column if not exists featured_order integer;

comment on column public.settlements.is_featured is
  'When true, the dossier appears in the FEATURED (top-billed hero) section of the gallery — shown first. Admin/developer only; normal users cannot self-feature. Featuring requires is_public=true, so an unlisted (is_public=false) row can never be featured.';
comment on column public.settlements.featured_order is
  'Sort order within the featured section. Lower renders first. NULL = no explicit order (then published_at desc).';

create index if not exists idx_settlements_featured
  on public.settlements(featured_order nulls last, published_at desc)
  where is_featured = true and is_public = true;

create or replace function public.set_featured(
  target_id   uuid,
  featured    boolean,
  sort_order  integer default null
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  caller_role text;
  before_state jsonb;
begin
  select role into caller_role from public.profiles where id = auth.uid();
  if caller_role not in ('developer', 'admin') then
    raise exception 'Only admins can change featured status';
  end if;

  select jsonb_build_object('is_featured', is_featured, 'featured_order', featured_order, 'name', name)
    into before_state from public.settlements where id = target_id;
  if before_state is null then raise exception 'Settlement not found'; end if;

  if featured then
    update public.settlements set is_featured = true, featured_order = sort_order
      where id = target_id and is_public = true;
    if not found then raise exception 'Cannot feature a non-public settlement. Publish it first.'; end if;
  else
    update public.settlements set is_featured = false, featured_order = null where id = target_id;
  end if;

  perform public._audit_action(
    auth.uid(), null,
    case when featured then 'gallery_feature' else 'gallery_unfeature' end,
    before_state || jsonb_build_object('settlement_id', target_id),
    jsonb_build_object('settlement_id', target_id, 'is_featured', featured, 'featured_order', sort_order),
    null
  );
end;
$$;
grant execute on function public.set_featured(uuid, boolean, integer) to authenticated;

create or replace function public.list_featured_dossiers()
returns table (id uuid, public_slug text, name text, tier text, published_at timestamptz, view_count integer, featured_order integer)
language sql stable security definer set search_path = public, pg_temp
as $$
  select id, public_slug, name, tier, published_at, view_count, featured_order
    from public.settlements
    where is_public = true and is_featured = true
    order by featured_order nulls last, published_at desc;
$$;
grant execute on function public.list_featured_dossiers() to authenticated, anon;

-- ── A2. saved_maps.is_featured (per-section: map + campaign) ──────────────────
alter table public.saved_maps
  add column if not exists is_featured boolean not null default false,
  add column if not exists featured_order integer;

comment on column public.saved_maps.is_featured is
  'When true, the map (or map_with_campaign) appears in the FEATURED section of its gallery. Admin/developer only. Requires is_public=true.';

create index if not exists idx_saved_maps_featured
  on public.saved_maps(featured_order nulls last, published_at desc)
  where is_featured = true and is_public = true;

create or replace function public.set_featured_map(
  target_id   uuid,
  featured    boolean,
  sort_order  integer default null
)
returns void
language plpgsql security definer set search_path = public, pg_temp
as $$
declare
  caller_role text;
  before_state jsonb;
begin
  select role into caller_role from public.profiles where id = auth.uid();
  if caller_role not in ('developer', 'admin') then
    raise exception 'Only admins can change featured status';
  end if;

  select jsonb_build_object('is_featured', is_featured, 'featured_order', featured_order, 'name', name)
    into before_state from public.saved_maps where id = target_id;
  if before_state is null then raise exception 'Map not found'; end if;

  if featured then
    update public.saved_maps set is_featured = true, featured_order = sort_order
      where id = target_id and is_public = true;
    if not found then raise exception 'Cannot feature a non-public map. Publish it first.'; end if;
  else
    update public.saved_maps set is_featured = false, featured_order = null where id = target_id;
  end if;

  perform public._audit_action(
    auth.uid(), null,
    case when featured then 'gallery_feature_map' else 'gallery_unfeature_map' end,
    before_state || jsonb_build_object('map_id', target_id),
    jsonb_build_object('map_id', target_id, 'is_featured', featured, 'featured_order', sort_order),
    null
  );
end;
$$;
grant execute on function public.set_featured_map(uuid, boolean, integer) to authenticated;

create or replace function public.list_featured_maps()
returns table (id uuid, public_slug text, name text, share_kind text, published_at timestamptz, view_count integer, featured_order integer)
language sql stable security definer set search_path = public, pg_temp
as $$
  select id, public_slug, name, share_kind, published_at, view_count, featured_order
    from public.saved_maps
    where is_public = true and is_featured = true
    order by featured_order nulls last, published_at desc;
$$;
grant execute on function public.list_featured_maps() to authenticated, anon;

-- ════════════════════════════════════════════════════════════════════════════
--  B.  VISIBILITY / UNLISTED SHARING  (settlements + saved_maps)
-- ════════════════════════════════════════════════════════════════════════════

-- ── B0. crypto-random unguessable slug (never sequential) ─────────────────────
-- ~42 hex chars (≈168 bits) from TWO gen_random_uuid()s — far beyond the 48-bit
-- public slug, because an unlisted row's ONLY protection is the secrecy of this
-- slug (it is is_public=false, absent from every listing). Same gen_random_uuid
-- idiom as _make_public_slug (008), widened for the unguessable requirement.
create or replace function public._make_unlisted_slug()
returns text language sql volatile as $$
  select replace(gen_random_uuid()::text, '-', '')
       || substr(replace(gen_random_uuid()::text, '-', ''), 1, 10);
$$;

-- ── B1. visibility + unlisted_slug columns ───────────────────────────────────
alter table public.settlements
  add column if not exists visibility text not null default 'public'
    check (visibility in ('public', 'unlisted')),
  add column if not exists unlisted_slug text;
alter table public.saved_maps
  add column if not exists visibility text not null default 'public'
    check (visibility in ('public', 'unlisted')),
  add column if not exists unlisted_slug text;

comment on column public.settlements.visibility is
  'public = normal (gallery exposure governed by is_public, as before). unlisted = reachable ONLY by exact unlisted_slug link; is_public is forced false so it is absent from every public browse/list/featured path by construction.';

create unique index if not exists settlements_unlisted_slug_unique
  on public.settlements(unlisted_slug) where unlisted_slug is not null;
create unique index if not exists saved_maps_unlisted_slug_unique
  on public.saved_maps(unlisted_slug) where unlisted_slug is not null;

-- ── B2. settlement unlisted RPCs ─────────────────────────────────────────────

-- Share as unlisted: unpublish from public browse (is_public=false), mark
-- visibility='unlisted', mint a fresh unguessable slug. Owner + active only.
-- Returns the unlisted slug (the party-share link tail).
create or replace function public.share_settlement_unlisted(target_id uuid)
returns text
language plpgsql security definer set search_path = public, pg_temp
as $$
declare new_slug text; owns boolean;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  if not public.account_is_active(auth.uid()) then raise exception 'account is not active'; end if;
  select true into owns from public.settlements where id = target_id and user_id = auth.uid();
  if owns is null then raise exception 'Not found or not owned by caller'; end if;

  -- Mint a fresh slug, retrying on the (astronomically unlikely) unique collision.
  loop
    new_slug := public._make_unlisted_slug();
    begin
      update public.settlements
        set visibility = 'unlisted', is_public = false, is_featured = false,
            unlisted_slug = new_slug, published_at = coalesce(published_at, now())
        where id = target_id and user_id = auth.uid();
      exit;
    exception when unique_violation then
      -- retry with a new slug
    end;
  end loop;
  return new_slug;
end;
$$;
grant execute on function public.share_settlement_unlisted(uuid) to authenticated;

-- Rotate the unlisted slug (revoke: old link dies, new link issued).
create or replace function public.rotate_settlement_unlisted_slug(target_id uuid)
returns text
language plpgsql security definer set search_path = public, pg_temp
as $$
declare new_slug text; is_unlisted boolean;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  if not public.account_is_active(auth.uid()) then raise exception 'account is not active'; end if;
  select (visibility = 'unlisted') into is_unlisted
    from public.settlements where id = target_id and user_id = auth.uid();
  if is_unlisted is null then raise exception 'Not found or not owned by caller'; end if;
  if not is_unlisted then raise exception 'Settlement is not shared as unlisted'; end if;

  loop
    new_slug := public._make_unlisted_slug();
    begin
      update public.settlements set unlisted_slug = new_slug
        where id = target_id and user_id = auth.uid();
      exit;
    exception when unique_violation then
    end;
  end loop;
  return new_slug;
end;
$$;
grant execute on function public.rotate_settlement_unlisted_slug(uuid) to authenticated;

-- Stop unlisted sharing entirely (kills the link; row returns to a private,
-- unshared settlement — publishing publicly stays a separate publish action).
create or replace function public.revoke_settlement_unlisted(target_id uuid)
returns void
language plpgsql security definer set search_path = public, pg_temp
as $$
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  update public.settlements set visibility = 'public', unlisted_slug = null
    where id = target_id and user_id = auth.uid();
  if not found then raise exception 'Not found or not owned by caller'; end if;
end;
$$;
grant execute on function public.revoke_settlement_unlisted(uuid) to authenticated;

-- By-slug read for an unlisted dossier. REUSES the authoritative sanitizer
-- _gallery_sanitize_public_json (migration 142) — the SAME strip get_gallery_
-- dossier applies — so an unlisted read can leak no more than a public one.
-- anon + authenticated (the link is the capability). Only visibility='unlisted'.
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
    'dossier', public._gallery_sanitize_public_json(
      case
        when s.gallery_share_narrated
          and s.ai_data is not null
          and jsonb_typeof(s.ai_data -> 'aiSettlement') = 'object'
        then s.ai_data -> 'aiSettlement'
        else s.data
      end
    )
  )
  from public.settlements s
  left join public.profiles ap on ap.id = s.user_id
  where s.unlisted_slug = p_slug and s.visibility = 'unlisted'
  limit 1;
$$;
grant execute on function public.get_unlisted_dossier(text) to authenticated, anon;

-- The owner's own unlisted dossiers (the gallery's PRIVATE/UNLISTED filter). Owner
-- alone (auth.uid() scoping); a different caller gets an empty set, an anon caller
-- gets an empty set. The RLS pair's owner half.
create or replace function public.list_my_unlisted_dossiers()
returns table (id uuid, unlisted_slug text, name text, tier text, published_at timestamptz)
language sql stable security definer set search_path = public, pg_temp
as $$
  select id, unlisted_slug, name, tier, published_at
    from public.settlements
    where user_id = auth.uid() and visibility = 'unlisted'
    order by published_at desc nulls last;
$$;
grant execute on function public.list_my_unlisted_dossiers() to authenticated;

-- ── B3. map unlisted RPCs (a shared campaign IS a map_with_campaign row) ──────

create or replace function public.share_map_unlisted(target_id uuid)
returns text
language plpgsql security definer set search_path = public, pg_temp
as $$
declare new_slug text; owns boolean;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  if not public.account_is_active(auth.uid()) then raise exception 'account is not active'; end if;
  select true into owns from public.saved_maps where id = target_id and user_id = auth.uid();
  if owns is null then raise exception 'Not found or not owned by caller'; end if;

  loop
    new_slug := public._make_unlisted_slug();
    begin
      update public.saved_maps
        set visibility = 'unlisted', is_public = false, is_featured = false,
            unlisted_slug = new_slug, published_at = coalesce(published_at, now())
        where id = target_id and user_id = auth.uid();
      exit;
    exception when unique_violation then
    end;
  end loop;
  return new_slug;
end;
$$;
grant execute on function public.share_map_unlisted(uuid) to authenticated;

create or replace function public.rotate_map_unlisted_slug(target_id uuid)
returns text
language plpgsql security definer set search_path = public, pg_temp
as $$
declare new_slug text; is_unlisted boolean;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  if not public.account_is_active(auth.uid()) then raise exception 'account is not active'; end if;
  select (visibility = 'unlisted') into is_unlisted
    from public.saved_maps where id = target_id and user_id = auth.uid();
  if is_unlisted is null then raise exception 'Not found or not owned by caller'; end if;
  if not is_unlisted then raise exception 'Map is not shared as unlisted'; end if;

  loop
    new_slug := public._make_unlisted_slug();
    begin
      update public.saved_maps set unlisted_slug = new_slug where id = target_id and user_id = auth.uid();
      exit;
    exception when unique_violation then
    end;
  end loop;
  return new_slug;
end;
$$;
grant execute on function public.rotate_map_unlisted_slug(uuid) to authenticated;

create or replace function public.revoke_map_unlisted(target_id uuid)
returns void
language plpgsql security definer set search_path = public, pg_temp
as $$
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  update public.saved_maps set visibility = 'public', unlisted_slug = null
    where id = target_id and user_id = auth.uid();
  if not found then raise exception 'Not found or not owned by caller'; end if;
end;
$$;
grant execute on function public.revoke_map_unlisted(uuid) to authenticated;

-- By-slug read for an unlisted map/campaign. Returns ONLY the pre-sanitized,
-- publish-time gallery artifacts (gallery_world_snapshot/sections are already
-- client-sanitized — migration 088's privacy contract) — never a live read of
-- private map_data.
create or replace function public.get_unlisted_map(p_slug text)
returns jsonb
language sql stable security definer set search_path = public, pg_temp
as $$
  select jsonb_build_object(
    'id', m.id,
    'name', m.name,
    'slug', m.unlisted_slug,
    'unlisted', true,
    'share_kind', m.share_kind,
    'description', m.gallery_description,
    'tags', m.gallery_tags,
    'image_url', m.gallery_image_url,
    'world_snapshot', case when m.gallery_share_world then m.gallery_world_snapshot else null end,
    'world_sections', case when m.gallery_share_world then m.gallery_world_sections else null end,
    'realm_arc_summary', case when m.gallery_share_world then m.gallery_realm_arc_summary else null end
  )
  from public.saved_maps m
  where m.unlisted_slug = p_slug and m.visibility = 'unlisted'
  limit 1;
$$;
grant execute on function public.get_unlisted_map(text) to authenticated, anon;

create or replace function public.list_my_unlisted_maps()
returns table (id uuid, unlisted_slug text, name text, share_kind text, published_at timestamptz)
language sql stable security definer set search_path = public, pg_temp
as $$
  select id, unlisted_slug, name, share_kind, published_at
    from public.saved_maps
    where user_id = auth.uid() and visibility = 'unlisted'
    order by published_at desc nulls last;
$$;
grant execute on function public.list_my_unlisted_maps() to authenticated;
