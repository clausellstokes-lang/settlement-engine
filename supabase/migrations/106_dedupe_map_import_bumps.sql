-- ────────────────────────────────────────────────────────────────────────────
-- 106_dedupe_map_import_bumps.sql — make the "most imported" map ranking
-- non-forgeable: dedup + plausibility-gate bump_map_import (065).
--
-- 065's bump_map_import was a bare SECURITY DEFINER `import_count + 1` granted
-- to every authenticated user, keyed only on (public_slug, is_public). Nothing
-- tied it to an actual import: import_gallery_map (072) never bumps
-- server-side, there was no per-user dedup (unlike 029's view ledger), no
-- owner exclusion, and no importability check — so any signed-in user could
-- loop the RPC and push any public map to the top of the most_imported sort.
--
-- Fix (029's dedup pattern, applied to imports):
--   (1) map_imports — a per-(map, importer, UTC day) ledger. RLS on, no
--       policies, grants revoked: only the definer function below touches it.
--   (2) bump_map_import recreated (same signature) to:
--         • require a signed-in caller (auth.uid(); the grant is already
--           authenticated-only — this hardens against future grant drift),
--         • only count maps an import is actually POSSIBLE for: is_public AND
--           gallery_importable (072's clone gate) — if the owner never opted
--           in, import_gallery_map returns NULL and any bump is by definition
--           forged,
--         • never count the owner inflating their own map,
--         • count at most ONE import per importer per map per UTC day
--           (ledger insert ON CONFLICT DO NOTHING; increment only on a new
--           row).
--
-- A determined user can still contribute at most +1/day/map — the same
-- residual 029 accepts for views — instead of unbounded. Truly tying the bump
-- to the clone would fold it into import_gallery_map (072); that is left as a
-- follow-up since the client fires bump_map_import only after a SUCCESSFUL
-- clone (campaignSlice), which the fetch-RPC cannot observe.
--
-- Existing import_count values are kept (they are all-time totals; the ledger
-- dedups from now on). Idempotent: IF NOT EXISTS + CREATE OR REPLACE (same
-- signature, so no drop needed). NEVER edit 065 — this supersedes in place.
-- ────────────────────────────────────────────────────────────────────────────

-- ── (1) dedup ledger — written only by the definer fn ────────────────────────
create table if not exists public.map_imports (
  map_id      uuid not null references public.saved_maps(id) on delete cascade,
  importer_id uuid not null,
  imported_on date not null default (now() at time zone 'utc')::date,
  created_at  timestamptz not null default now(),
  primary key (map_id, importer_id, imported_on)
);

alter table public.map_imports enable row level security;
revoke all on public.map_imports from anon, authenticated;

comment on table public.map_imports is
  'Per-(map, importer, UTC day) dedup ledger for bump_map_import. Written only by that SECURITY DEFINER function; never read by clients. Mirrors gallery_views (029).';

-- ── (2) bump_map_import — deduped, importability-gated, owner-excluded ───────
create or replace function public.bump_map_import(p_slug text)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_id    uuid;
  v_owner uuid;
begin
  -- Fire-and-forget counter: every reject is a quiet no-op, never an error
  -- (the client swallows failures anyway; an exception would only add noise).
  if auth.uid() is null then
    return;
  end if;

  -- An import is only POSSIBLE for a public, owner-opted-in map (072's
  -- import_gallery_map gate). Anything else is not a plausible import.
  select id, user_id into v_id, v_owner
    from public.saved_maps
    where public_slug = p_slug
      and is_public = true
      and coalesce(gallery_importable, false);
  if v_id is null then
    return;
  end if;

  -- The owner importing their own map is not a ranking signal.
  if v_owner = auth.uid() then
    return;
  end if;

  -- New (map, importer, day) → count it; a repeat within the day → no-op.
  insert into public.map_imports (map_id, importer_id)
    values (v_id, auth.uid())
    on conflict (map_id, importer_id, imported_on) do nothing;

  if found then
    update public.saved_maps
      set import_count = import_count + 1
      where id = v_id;
  end if;
end;
$$;

revoke all on function public.bump_map_import(text) from public;
grant execute on function public.bump_map_import(text) to authenticated;

comment on function public.bump_map_import(text) is
  'De-duplicated import counter for a shared map: signed-in non-owner callers, public+gallery_importable rows only, at most one count per importer per map per UTC day (map_imports ledger). 106 supersedes the bare 065 increment, which was trivially forgeable.';
