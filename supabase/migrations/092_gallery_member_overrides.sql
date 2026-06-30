-- 092_gallery_member_overrides.sql
--
-- Per-member (per-NPC) gallery visibility, layered on the existing settlement-level
-- gallery_share_dm (reveal DM content) and gallery_importable (allow import) flags.
--
-- WHY: today reveal/import are settlement-wide booleans applied wholesale by
-- get_gallery_dossier (076, net-current) and import_gallery_dossier (048, net-current).
-- An owner who wants to share a dossier but protect ONE NPC's secret, or import-share
-- everyone but one informant, had no recourse. This adds a per-NPC override map that
-- DEFAULTS to the settlement flags and can only ever STRIP a member tighter than the
-- settlement default — never expose more than the chosen base projection already does.
--
-- SHAPE: settlements.gallery_member_overrides jsonb, keyed by the NPC's stable key
-- (npc.id when present, else `npc.<snakeCase(name)>` — see _gallery_npc_key, matched
-- byte-for-byte by the client's galleryMemberKey), value { revealDm?: bool, allowImport?: bool }.
-- The owner-update RLS from migration 001 already authorizes the write (same posture
-- 047 documented for gallery_importable) — NO new policy.
--
-- PRIVACY (the load-bearing invariant): _gallery_apply_member_overrides runs AFTER the
-- existing settlement projection and can only REPLACE a member with the public-allowlist
-- projection (reusing the canonical _gallery_sanitize_public_json on a single-NPC wrapper,
-- so the per-member strip can never drift from the wholesale one). The base is computed
-- DM-full whenever the settlement reveals OR ANY member individually reveals, and the
-- helper then re-strips every member that is not (effectively) revealed — so a
-- settlement-hidden dossier with one revealed NPC exposes ONLY that NPC's DM fields.
--
-- NET-CURRENT RULE: this migration recreates get_gallery_dossier and import_gallery_dossier.
-- get_gallery_dossier is forked from 076 (author_name join + chronicle + importable facet);
-- import_gallery_dossier from 048 (its only definition). Forking an older body would
-- silently drop the in-between guards.
--
-- ROLLBACK: alter table public.settlements drop column if exists gallery_member_overrides;
--   (and re-run 076 / 048 to restore the pre-override RPC bodies.)
--
-- DEPLOY: migrations are NOT auto-applied — inert until `supabase db push`. The client
-- write of gallery_member_overrides degrades gracefully against a pre-092 DB (the patch
-- omits the column when absent). No edge-function files touched (deno gate N/A).

-- ── 1. Column ───────────────────────────────────────────────────────────────
alter table public.settlements
  add column if not exists gallery_member_overrides jsonb not null default '{}'::jsonb;

alter table public.settlements
  drop constraint if exists settlements_gallery_member_overrides_is_object;
alter table public.settlements
  add constraint settlements_gallery_member_overrides_is_object
  check (jsonb_typeof(gallery_member_overrides) = 'object');

comment on column public.settlements.gallery_member_overrides is
  'Per-NPC gallery visibility overrides, keyed by _gallery_npc_key (npc.id or npc.<snakeCase(name)>), value {revealDm?:bool, allowImport?:bool}. Each member DEFAULTS to the settlement-level gallery_share_dm / gallery_importable; an override can only ever RESTRICT a member tighter than that default. Owner opt-in; defaults {} (every member follows the settlement flags).';

-- ── 2. NPC key (must match the client galleryMemberKey byte-for-byte) ─────────
-- npc.id when present (created NPCs carry `npc.<slug>_<hash>`), else a name slug:
-- snakeCase = collapse non-alphanumeric runs to '_', trim leading/trailing '_', lowercase.
create or replace function public._gallery_npc_key(npc jsonb)
returns text language sql immutable as $$
  select coalesce(
    nullif(npc ->> 'id', ''),
    'npc.' || lower(trim(both '_' from regexp_replace(coalesce(npc ->> 'name', ''), '[^a-zA-Z0-9]+', '_', 'g')))
  );
$$;

-- ── 3. Does any member individually reveal DM content? ────────────────────────
-- Drives the base-projection choice: if a member reveals, the base must be DM-full so
-- the apply step can surface that one member while re-stripping the rest.
create or replace function public._gallery_member_reveals_any(overrides jsonb)
returns boolean language sql immutable as $$
  select coalesce((
    select bool_or((e.value ->> 'revealDm')::boolean)
    from jsonb_each(coalesce(overrides, '{}'::jsonb)) e
    where (e.value ->> 'revealDm') is not null
  ), false);
$$;

-- ── 4. Apply per-member overrides to a projected dossier ──────────────────────
-- For each NPC: effReveal = override.revealDm ?? settlement_share_dm;
--               effImport = override.allowImport ?? settlement_importable.
-- keepFull = for_import ? (effReveal AND effImport) : effReveal.
-- A member that is not kept-full is REPLACED with the canonical public-allowlist
-- projection (reuse _gallery_sanitize_public_json on a one-NPC wrapper). Idempotent
-- when the base is already sanitized. Returns data untouched when it has no npcs array.
create or replace function public._gallery_apply_member_overrides(
  data jsonb,
  overrides jsonb,
  settlement_share_dm boolean,
  settlement_importable boolean,
  for_import boolean
) returns jsonb language sql immutable as $$
  select case
    when jsonb_typeof(data -> 'npcs') is distinct from 'array' then data
    else jsonb_set(data, '{npcs}', coalesce((
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
          then npc
          else public._gallery_sanitize_public_json(jsonb_build_object('npcs', jsonb_build_array(npc))) -> 'npcs' -> 0
        end
        order by ord
      )
      from jsonb_array_elements(data -> 'npcs') with ordinality as t(npc, ord)
    ), '[]'::jsonb))
  end;
$$;

-- ── 5. get_gallery_dossier — fork 076, thread the column + per-member overrides ─
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
      case
        when s.gallery_share_dm or public._gallery_member_reveals_any(s.gallery_member_overrides)
          then public._gallery_dm_full_json(base.j)
        else public._gallery_sanitize_public_json(base.j)
      end,
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
  'Public gallery detail read (092 — adds per-member overrides). Safe columns plus settlement data projected through the settlement reveal/sanitize choice AND per-NPC overrides (a member reveals only if its override or the settlement says so; the base goes DM-full when any member reveals, then non-revealed members are re-stripped), the gallery_importable + gallery_member_overrides flags, the chronicle, and live-resolved author_name.';

-- ── 6. import_gallery_dossier — fork 048, apply per-member (reveal AND import) ──
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
      case
        when s.gallery_share_dm or public._gallery_member_reveals_any(s.gallery_member_overrides)
          then public._gallery_dm_full_json(base.j)
        else public._gallery_sanitize_public_json(base.j)
      end,
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
  'Authenticated clone-for-import read (092 — per-member). The settlement-level gallery_importable stays the wall (gate unchanged from 048); a member is imported with DM fields ONLY if it is both effectively revealed AND effectively import-allowed (per-NPC override falling back to the settlement flags), else it is reduced to the public allowlist in the imported copy. Never the raw row, never the seed.';
