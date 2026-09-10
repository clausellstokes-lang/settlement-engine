-- ────────────────────────────────────────────────────────────────────────────
-- 030_gallery_dm_compass_only.sql — stop leaking AI prose in the shareDm payload.
--
-- When gallery_share_dm is true, get_gallery_dossier (migration 026) returned the
-- base dossier RAW. That correctly reveals the DM-private layer (secrets, plot
-- hooks, NPC goals/relationships, DM notes) — but the base also carries the
-- AI-narrative overlay `aiSettlement`, a FULL refined-settlement clone whose prose
-- is governed by the SEPARATE gallery_share_narrated toggle. So a shareDm-but-not-
-- narrated dossier shipped that prose in the network payload (the client already
-- trims it before rendering; this closes the gap at the source — defense in depth).
--
-- This mirrors the client projection toPublicSafe({full:true}) exactly: drop the AI
-- prose blobs (aiData / aiDailyLife) and trim `aiSettlement` to ONLY the four
-- DM-Compass fields (identityMarkers / frictionPoints / connectionsMap / dmCompass),
-- so the Guidance tab still surfaces while the refined prose stays governed by
-- gallery_share_narrated. No behaviour change for non-shareDm dossiers (they keep
-- the server sanitize), nor for the columns returned.
-- ────────────────────────────────────────────────────────────────────────────

-- Full DM view, but with the AI-narrative layer reduced to the DM Compass.
create or replace function public._gallery_dm_full_json(j jsonb)
returns jsonb
language sql
immutable
as $$
  with compass as (
    select jsonb_strip_nulls(jsonb_build_object(
      'identityMarkers', j #> '{aiSettlement,identityMarkers}',
      'frictionPoints',  j #> '{aiSettlement,frictionPoints}',
      'connectionsMap',  j #> '{aiSettlement,connectionsMap}',
      'dmCompass',       j #> '{aiSettlement,dmCompass}'
    )) as c
  )
  select case
    when j is null or jsonb_typeof(j) <> 'object' then j
    else
      -- drop the prose blobs + the full aiSettlement, then re-add the DM Compass
      -- only when there is at least one compass field to keep.
      (j - 'aiData' - 'aiDailyLife' - 'aiSettlement')
      || case
           when (select c from compass) <> '{}'::jsonb
             then jsonb_build_object('aiSettlement', (select c from compass))
           else '{}'::jsonb
         end
  end;
$$;

comment on function public._gallery_dm_full_json(jsonb) is
  'shareDm projection: reveal the DM-private layer but drop AI prose (aiData/aiDailyLife) and trim aiSettlement to only the DM-Compass fields. Mirrors client toPublicSafe({full:true}).';

-- Re-point get_gallery_dossier at the trimmed full view (signature unchanged from
-- migration 026, so a plain replace is fine — only the `data` expression changes).
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
    -- Then: full DM view (compass-only AI layer) when gallery_share_dm, else
    -- the server-sanitized public projection.
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
  'Public gallery detail read. Returns safe columns plus settlement data: the full DM view with the AI layer trimmed to the DM Compass when gallery_share_dm is set, otherwise server-sanitized; AI-narrated base when gallery_share_narrated is set and present, else the raw simulation.';
