-- ────────────────────────────────────────────────────────────────────────────
-- 025_gallery_share_narrated.sql — opt-in publishing of the AI-narrated dossier.
--
-- The public gallery has always shown the RAW simulation: get_gallery_dossier
-- (migration 020) sanitizes settlements.data and returns it. Owners who ran the
-- Narrative Layer can now opt to publish the AI-narrated version instead.
--
-- When gallery_share_narrated is true AND ai_data.aiSettlement is a populated
-- object, the RPC sanitizes and returns that refined settlement in place of the
-- raw data. The SAME server-side _gallery_sanitize_public_json runs either way,
-- so DM-private content (secrets, hooks, notes, compass, NPC goals/secrets, and
-- the AI meta layers) is stripped from the narrated version too — only the
-- refined public-facing prose is exposed. The flag defaults to false, so every
-- existing and future dossier keeps showing the raw simulation unless the owner
-- explicitly opts in.
-- ────────────────────────────────────────────────────────────────────────────

alter table public.settlements
  add column if not exists gallery_share_narrated boolean not null default false;

comment on column public.settlements.gallery_share_narrated is
  'When true and ai_data.aiSettlement exists, the public gallery shows the AI-narrated dossier (sanitized) instead of the raw simulation.';

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
    r.id,
    r.public_slug,
    r.name,
    r.tier,
    public._gallery_sanitize_public_json(
      case
        when s.gallery_share_narrated
          and s.ai_data is not null
          and jsonb_typeof(s.ai_data -> 'aiSettlement') = 'object'
        then s.ai_data -> 'aiSettlement'
        else s.data
      end
    ) as data,
    r.published_at,
    r.updated_at,
    r.view_count,
    r.is_curated,
    r.gallery_description,
    r.gallery_image_url,
    r.gallery_image_alt,
    r.gallery_tags,
    r.population,
    r.terrain,
    r.government_type,
    r.magic_level,
    r.stability,
    r.primary_resource,
    r.threat_level,
    r.net_votes,
    r.comment_count
  from public.settlements s
  join public._gallery_public_tile_rows() r on r.id = s.id
  where s.public_slug = dossier_slug
    and s.is_public = true
  limit 1;
$$;

revoke execute on function public.get_gallery_dossier(text) from public;
grant execute on function public.get_gallery_dossier(text) to authenticated, anon;

comment on function public.get_gallery_dossier(text) is
  'Public gallery detail read. Returns safe columns plus server-sanitized settlement data — the AI-narrated dossier when gallery_share_narrated is set and present, otherwise the raw simulation.';
