-- ────────────────────────────────────────────────────────────────────────────
-- 020_gallery_public_privacy.sql - Server-side public gallery privacy boundary.
--
-- Migration 008 originally made full public settlement rows readable when
-- `is_public = true`. That worked for an early read-only gallery, but the
-- settlement `data` JSON now contains DM-facing notes, AI overlays, and
-- campaign state that should not be exposed to anonymous clients.
--
-- Public gallery reads now go through SECURITY DEFINER RPCs that return a
-- curated column set plus sanitized dossier JSON. Owners still read and write
-- their own rows through the original owner policies from migration 001.
-- ────────────────────────────────────────────────────────────────────────────

drop policy if exists "Public dossiers are world-readable" on public.settlements;

comment on column public.settlements.is_public is
  'When true, the dossier is eligible for public gallery RPCs. Direct anonymous row reads are intentionally not allowed.';

create or replace function public._gallery_sanitize_public_json(value jsonb, path text[] default '{}')
returns jsonb
language plpgsql
immutable
set search_path = public
as $$
declare
  key text;
  child jsonb;
  sanitized jsonb;
  out jsonb;
begin
  if value is null then
    return null;
  end if;

  if jsonb_typeof(value) = 'object' then
    out := '{}'::jsonb;
    for key, child in select * from jsonb_each(value) loop
      if key ~* '(secret|private|dm|gm|guidance|note|plotHook|plot_hooks|hook|compass|chronicle|pinnedNpc|aiData|aiSettlement|aiDailyLife|narrativeNotes|identityMarkers|frictionPoints|connectionsMap)' then
        continue;
      end if;
      if 'npcs' = any(path)
        and key in ('goal', 'secret', 'plotHooks', 'relationships')
      then
        continue;
      end if;

      sanitized := public._gallery_sanitize_public_json(child, path || key);
      if sanitized is not null then
        out := out || jsonb_build_object(key, sanitized);
      end if;
    end loop;
    return out;
  end if;

  if jsonb_typeof(value) = 'array' then
    out := '[]'::jsonb;
    for child in select jsonb_array_elements(value) loop
      sanitized := public._gallery_sanitize_public_json(child, path);
      if sanitized is not null then
        out := out || jsonb_build_array(sanitized);
      end if;
    end loop;
    return out;
  end if;

  return value;
end;
$$;

revoke execute on function public._gallery_sanitize_public_json(jsonb, text[]) from public;

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
    public._gallery_sanitize_public_json(s.data) as data,
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

create or replace function public.get_gallery_vote_state(target_settlement_id uuid)
returns table (net_votes integer, voted boolean)
language sql
stable
security definer
set search_path = public
as $$
  select
    coalesce(count(gv.*), 0)::integer as net_votes,
    coalesce(bool_or(gv.user_id = auth.uid()), false) as voted
  from public.settlements s
  left join public.gallery_votes gv on gv.settlement_id = s.id
  where s.id = target_settlement_id
    and s.is_public = true;
$$;

revoke execute on function public.get_gallery_vote_state(uuid) from public;
grant execute on function public.get_gallery_vote_state(uuid) to authenticated, anon;

alter table public.settlements
  drop constraint if exists settlements_gallery_image_url_http,
  add constraint settlements_gallery_image_url_http
    check (
      gallery_image_url is null
      or gallery_image_url ~* '^https?://'
    ) not valid;

comment on function public.get_gallery_dossier(text) is
  'Public gallery detail read. Returns only safe columns plus server-sanitized settlement data; direct anonymous row reads remain closed.';
comment on function public._gallery_sanitize_public_json(jsonb, text[]) is
  'Recursive allow-by-omission sanitizer for public dossier JSON. Internal helper used by get_gallery_dossier().';
