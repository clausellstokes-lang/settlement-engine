-- 093_gallery_member_overrides_fix.sql
--
-- SECURITY FIX for 092. The 092 per-member override path promoted the ENTIRE
-- settlement projection to _gallery_dm_full_json the moment ANY single NPC was
-- revealed (the base CASE keyed on `gallery_share_dm OR _gallery_member_reveals_any`).
-- _gallery_dm_full_json preserves settlement-level DM-private content (the DM Compass
-- and every settlement/section plotHooks array), and _gallery_apply_member_overrides
-- only re-stripped the npcs array, never the top-level keys. Net effect: revealing one
-- NPC leaked the settlement-wide DM Compass + all plot hooks to anonymous gallery
-- readers — the opposite of 092's own invariant ("exposes ONLY that NPC's DM fields").
--
-- CORRECT MODEL (this migration): the settlement-level projection is chosen by the
-- SETTLEMENT flag ONLY (sanitized when gallery_share_dm is false, DM-full when true).
-- _gallery_apply_member_overrides then, per NPC, REVEALS an individually-opted-in
-- member by splicing that member's full record from the DM-full projection, and
-- otherwise reduces the member to the public allowlist. So a hidden settlement with one
-- revealed NPC exposes exactly that NPC's DM fields and nothing settlement-level.
--
-- This recreates _gallery_apply_member_overrides (new signature: base + dm_full
-- source), get_gallery_dossier, and import_gallery_dossier; and drops the now-unused
-- _gallery_member_reveals_any. The column, _gallery_npc_key, and the base sanitizers
-- are unchanged. Inert until `supabase db push`.

-- ── 1. Replace the apply helper (5-arg → 6-arg: add the dm_full source) ───────
drop function if exists public._gallery_apply_member_overrides(jsonb, jsonb, boolean, boolean, boolean);
drop function if exists public._gallery_member_reveals_any(jsonb);

-- For each NPC in `base` (the settlement-level projection): effReveal = override.revealDm
-- ?? settlement_share_dm; effImport = override.allowImport ?? settlement_importable;
-- keepFull = for_import ? (effReveal AND effImport) : effReveal. A kept-full member is
-- taken from dm_full (its full DM record, matched by key); otherwise it is reduced to
-- the public allowlist (reusing the canonical sanitizer on a one-NPC wrapper, idempotent
-- when base is already sanitized). The settlement-level (non-npcs) content of `base` is
-- left exactly as the SETTLEMENT flag produced it — a per-member reveal never widens it.
create or replace function public._gallery_apply_member_overrides(
  base jsonb,
  dm_full jsonb,
  overrides jsonb,
  settlement_share_dm boolean,
  settlement_importable boolean,
  for_import boolean
) returns jsonb language sql immutable as $$
  select case
    when jsonb_typeof(base -> 'npcs') is distinct from 'array' then base
    else jsonb_set(base, '{npcs}', coalesce((
      select jsonb_agg(
        case
          when (
            case when for_import then
              coalesce((overrides -> public._gallery_npc_key(npc) ->> 'revealDm')::boolean, settlement_share_dm)
              and coalesce((overrides -> public._gallery_npc_key(npc) ->> 'allowImport')::boolean, settlement_importable)
            else
              coalesce((overrides -> public._gallery_npc_key(npc) ->> 'revealDm')::boolean, settlement_share_dm)
            end
          )
          then coalesce(
            (select e from jsonb_array_elements(dm_full -> 'npcs') e
              where public._gallery_npc_key(e) = public._gallery_npc_key(npc) limit 1),
            npc)
          else public._gallery_sanitize_public_json(jsonb_build_object('npcs', jsonb_build_array(npc))) -> 'npcs' -> 0
        end
        order by ord
      )
      from jsonb_array_elements(base -> 'npcs') with ordinality as t(npc, ord)
    ), '[]'::jsonb))
  end;
$$;

-- ── 2. get_gallery_dossier — base follows the SETTLEMENT flag only ────────────
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
  gallery_member_overrides jsonb,
  population integer,
  terrain text,
  government_type text,
  magic_level text,
  stability text,
  primary_resource text,
  threat_level text,
  net_votes integer,
  comment_count integer,
  chronicle jsonb,
  author_name text
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
    public._gallery_apply_member_overrides(
      case when s.gallery_share_dm then public._gallery_dm_full_json(base.j) else public._gallery_sanitize_public_json(base.j) end,
      public._gallery_dm_full_json(base.j),
      s.gallery_member_overrides, s.gallery_share_dm, s.gallery_importable, false
    ) as data,
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
    s.gallery_member_overrides,
    r.population,
    r.terrain,
    r.government_type,
    r.magic_level,
    r.stability,
    r.primary_resource,
    r.threat_level,
    r.net_votes,
    r.comment_count,
    public._gallery_chronicle_json(s.campaign_state -> 'eventLog') as chronicle,
    ap.external_name as author_name
  from public.settlements s
  join public._gallery_public_tile_rows() r on r.id = s.id
  left join public.profiles ap on ap.id = s.user_id
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
  'Public gallery detail read (093 — fixes 092 over-exposure). The data projection is chosen by the SETTLEMENT gallery_share_dm only; per-NPC overrides reveal an individually-opted-in member by splicing its full record from the DM-full projection, and reduce every other member to the public allowlist. A per-member reveal never widens settlement-level content (the DM Compass / plot hooks stay sanitized when the settlement flag is off).';

-- ── 3. import_gallery_dossier — same correction, for_import = true ────────────
create or replace function public.import_gallery_dossier(dossier_slug text)
returns table (
  id uuid,
  name text,
  tier text,
  data jsonb
)
language sql
stable
security definer
set search_path = public
as $$
  select
    s.id,
    s.name,
    s.tier,
    public._gallery_apply_member_overrides(
      case when s.gallery_share_dm then public._gallery_dm_full_json(base.j) else public._gallery_sanitize_public_json(base.j) end,
      public._gallery_dm_full_json(base.j),
      s.gallery_member_overrides, s.gallery_share_dm, s.gallery_importable, true
    ) as data
  from public.settlements s
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
    and s.gallery_importable = true
    and auth.uid() is not null
  limit 1;
$$;

revoke execute on function public.import_gallery_dossier(text) from public;
grant execute on function public.import_gallery_dossier(text) to authenticated;

comment on function public.import_gallery_dossier(text) is
  'Authenticated clone-for-import read (093 — fixes 092 over-exposure). Settlement-importable stays the wall; the data is the settlement-level projection (by gallery_share_dm) with per-member overrides applied, where a member keeps DM fields only when both effectively revealed AND import-allowed. A per-member reveal never widens settlement-level content.';
