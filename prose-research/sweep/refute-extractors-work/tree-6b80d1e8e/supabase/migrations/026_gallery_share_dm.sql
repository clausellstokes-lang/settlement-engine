-- ────────────────────────────────────────────────────────────────────────────
-- 026_gallery_share_dm.sql — opt-in publishing of the full DM view.
--
-- The public gallery strips a DM-private layer (NPC secrets, plot hooks, NPC
-- goals + relationships, DM notes/guidance, and the DM Compass) via
-- _gallery_sanitize_public_json. Owners can now opt to publish the FULL DM view
-- instead — their own content, their choice. When gallery_share_dm is true,
-- get_gallery_dossier returns the selected base (raw OR AI-narrated, per
-- gallery_share_narrated) WITHOUT the DM-private strip. The flag defaults to
-- false, so every existing and future dossier keeps the safe public projection
-- unless the owner explicitly opts in. AI-narrative prose stays governed by
-- gallery_share_narrated (which base is published), independent of this flag.
-- ────────────────────────────────────────────────────────────────────────────

alter table public.settlements
  add column if not exists gallery_share_dm boolean not null default false;

comment on column public.settlements.gallery_share_dm is
  'When true, the public gallery shows the full DM view (secrets, plot hooks, NPC goals/relationships, DM notes + compass) UNSTRIPPED. Owner opt-in; defaults false.';

-- The return type changes (adds gallery_share_dm), and Postgres won't let
-- `create or replace` alter an existing function's OUT-parameter row type, so
-- drop the prior definition (migration 025) first. Idempotent + re-runnable.
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
    -- Base = AI-narrated dossier when opted in + present, else the raw sim.
    -- Then: full DM view unstripped when gallery_share_dm, else sanitized.
    case
      when s.gallery_share_dm then base.j
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
  'Public gallery detail read. Returns safe columns plus settlement data: the full DM view (unstripped) when gallery_share_dm is set, otherwise server-sanitized; AI-narrated when gallery_share_narrated is set and present, else the raw simulation.';
