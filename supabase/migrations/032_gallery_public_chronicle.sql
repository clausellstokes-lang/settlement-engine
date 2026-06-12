-- ────────────────────────────────────────────────────────────────────────────
-- 032_gallery_public_chronicle.sql — ship the event Chronicle to the public
-- gallery through a dedicated, allowlist-projected output column.
--
-- The Chronicle tab (Notes › Chronicle) reads the saved campaign's eventLog,
-- which the gallery dossier never carried: the RPC's `data` column is only the
-- settlement JSON, and both sanitizers (_gallery_sanitize_public_json here and
-- toPublicSafe client-side) deliberately strip /chronicle/i keys inside it.
-- Rather than weaken those denylists (they only ever GROW), the chronicle
-- ships as a NEW column projected straight from campaign_state with an
-- explicit per-entry ALLOWLIST: the applied/at timestamps, the DM-facing
-- narrative summary, the cause / party attribution, and an id — plus the same
-- attribution fields on the nested event. NOTHING ELSE survives: raw log
-- entries also carry full before/after system-state snapshots, per-system
-- diffs, faction reactions with adventure seeds, type-specific event extras,
-- the DM's free-text context, and exact-rollback snapshots — none of which may
-- ever ship publicly. The array is capped to the newest 50 entries.
--
-- Retroactive by construction: the projection runs at read time, so every
-- already-published dossier gains its chronicle without a re-share.
-- ────────────────────────────────────────────────────────────────────────────

-- One public chronicle entry: explicit allowlist; everything else is dropped.
create or replace function public._gallery_chronicle_entry(e jsonb)
returns jsonb
language sql
immutable
as $$
  select case
    when e is null or jsonb_typeof(e) <> 'object' then null
    else jsonb_strip_nulls(jsonb_build_object(
      'id',               e -> 'id',
      'appliedAt',        e -> 'appliedAt',
      'timestamp',        e -> 'timestamp',
      'narrativeSummary', e -> 'narrativeSummary',
      'cause',            e -> 'cause',
      'partyCaused',      e -> 'partyCaused',
      'event', case
        when jsonb_typeof(e -> 'event') = 'object' then jsonb_strip_nulls(jsonb_build_object(
          'id',          e #> '{event,id}',
          'type',        e #> '{event,type}',
          'cause',       e #> '{event,cause}',
          'partyCaused', e #> '{event,partyCaused}'
        ))
        else null
      end
    ))
  end;
$$;

revoke execute on function public._gallery_chronicle_entry(jsonb) from public;

comment on function public._gallery_chronicle_entry(jsonb) is
  'Public-gallery projection of ONE campaign eventLog entry: explicit allowlist (id/appliedAt/timestamp/narrativeSummary/cause/partyCaused + event id/type/cause/partyCaused). Internal helper used by _gallery_chronicle_json(). Mirrored client-side in gallery.js sanitizeChronicle.';

-- The public chronicle column: the newest 50 eventLog entries, each reduced to
-- the allowlist above (original append order kept; the client feed sorts).
-- Null when the dossier carries no campaign log.
create or replace function public._gallery_chronicle_json(entries jsonb)
returns jsonb
language sql
immutable
as $$
  select case
    when entries is null or jsonb_typeof(entries) <> 'array' then null
    else coalesce(
      (
        select jsonb_agg(public._gallery_chronicle_entry(elem.value) order by elem.ord)
        from jsonb_array_elements(entries) with ordinality as elem(value, ord)
        where elem.ord > jsonb_array_length(entries) - 50
          and jsonb_typeof(elem.value) = 'object'
      ),
      '[]'::jsonb
    )
  end;
$$;

revoke execute on function public._gallery_chronicle_json(jsonb) from public;

comment on function public._gallery_chronicle_json(jsonb) is
  'Public-gallery chronicle column: newest 50 campaign eventLog entries, each allowlist-projected by _gallery_chronicle_entry(). Internal helper used by get_gallery_dossier().';

-- The return type changes (adds the `chronicle` output column), and Postgres
-- won't let `create or replace` alter an existing function's OUT-parameter row
-- type, so drop the prior definition (migration 030) first — the 026 precedent.
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
    -- the server-sanitized public projection. (Unchanged from migration 030.)
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
    r.comment_count,
    -- NEW: the allowlist-projected event chronicle. A separate column so the
    -- `data` sanitizers' /chronicle/i denylists stay intact (they only grow).
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
  'Public gallery detail read. Returns safe columns plus settlement data (full DM view trimmed to the DM Compass when gallery_share_dm, otherwise server-sanitized; AI-narrated base when gallery_share_narrated is set and present, else the raw simulation) plus the allowlist-projected event chronicle (newest 50; see _gallery_chronicle_entry).';
