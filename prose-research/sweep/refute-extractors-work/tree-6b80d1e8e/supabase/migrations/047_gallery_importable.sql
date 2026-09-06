-- ────────────────────────────────────────────────────────────────────────────
-- 047_gallery_importable.sql — owner opt-in: allow others to import this dossier.
--
-- A published dossier is, by default, VIEW-ONLY: other DMs can read the public
-- gallery page but cannot clone it into their own library. This flag lets the
-- owner opt IN to that — the third instance of the established "owner opt-in
-- boolean on settlements, written by an RLS-gated .update(), surfaced by the
-- SECURITY DEFINER read RPC" idiom (gallery_share_narrated 025, gallery_share_dm
-- 026). Defaults FALSE so every existing and future dossier stays non-importable
-- until the owner explicitly opts in — privacy-safe by construction.
--
-- This migration ships only the FLAG (column + read surface). The import action
-- it gates lands separately; that import RPC MUST clone from the SANITIZED
-- projection (_gallery_sanitize_public_json / _gallery_dm_full_json), never raw
-- s.data, and MUST check gallery_importable = true server-side — so the flag is
-- the privacy boundary, not a client-only toggle. Until the importer ships the
-- flag is inert (nothing reads it to clone), which is why shipping it first is
-- safe.
--
-- RLS: setting the flag is authorized by the existing "Users update own
-- settlements" policy (001) + the absence of any settlements column-lock, so no
-- new policy is needed — an owner already controls every gallery_* column on
-- their own row.
-- ────────────────────────────────────────────────────────────────────────────

alter table public.settlements
  add column if not exists gallery_importable boolean not null default false;

comment on column public.settlements.gallery_importable is
  'When true, other users may import (clone) this public dossier into their own library via the import RPC, which clones the server-sanitized projection only. Owner opt-in; defaults false. Orthogonal to gallery_share_dm.';

-- The return type changes (adds gallery_importable), and Postgres won't let
-- `create or replace` alter an existing function's OUT-parameter row type, so
-- drop the prior definition (migration 032) first — the 026/032 precedent.
-- Idempotent + re-runnable. Body is migration 032's verbatim, plus the one new
-- output column (positionally matched in the RETURNS TABLE and the SELECT). The
-- data projection is UNCHANGED — importable gates the import button, not what
-- JSON the viewer sees.
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
  chronicle jsonb
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
    -- Then: full DM view (compass-only AI layer) when gallery_share_dm, else
    -- the server-sanitized public projection. (Unchanged from migration 030/032.)
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
    public._gallery_chronicle_json(s.campaign_state -> 'eventLog') as chronicle
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
  'Public gallery detail read. Returns safe columns plus settlement data (full DM view trimmed to the DM Compass when gallery_share_dm, otherwise server-sanitized; AI-narrated base when gallery_share_narrated is set and present, else the raw simulation), the gallery_importable opt-in flag, and the allowlist-projected event chronicle (newest 50; see _gallery_chronicle_entry).';
