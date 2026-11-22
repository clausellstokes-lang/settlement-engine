-- ────────────────────────────────────────────────────────────────────────────
-- 027_gallery_my_settlements.sql — "My Settlements" gallery filter (§5).
--
-- The public feed (list_gallery_dossiers) anonymizes authorship and paginates,
-- so a signed-in user can't reliably find their OWN published dossiers in it.
-- This dedicated read returns the caller's own published dossiers as gallery
-- tiles — same shape as list_gallery_dossiers (so the client maps them with the
-- same sanitizeTile) — filtered by ownership server-side via auth.uid(). Reuses
-- the existing _gallery_public_tile_rows() helper (public, vote/comment-joined)
-- rather than rewriting the big paginated feed RPC. Auth-only; anon gets nothing.
-- ────────────────────────────────────────────────────────────────────────────

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
    r.stability, r.primary_resource, r.threat_level, r.net_votes, r.comment_count
  from public._gallery_public_tile_rows() r
  join public.settlements s on s.id = r.id
  where s.user_id = auth.uid()
  order by r.published_at desc nulls last;
$$;

revoke execute on function public.list_my_gallery_dossiers() from public;
grant execute on function public.list_my_gallery_dossiers() to authenticated;

comment on function public.list_my_gallery_dossiers() is
  'Gallery "My Settlements" (§5): the caller''s own published dossiers as tiles (same shape as list_gallery_dossiers). Auth-only — owner-scoped via auth.uid().';
