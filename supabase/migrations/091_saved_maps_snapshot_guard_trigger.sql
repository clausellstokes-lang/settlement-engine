-- ════════════════════════════════════════════════════════════════════════════
-- 091 — saved_maps world-snapshot guard trigger (close the edit-path bypass)
-- ════════════════════════════════════════════════════════════════════════════
-- 089 added the server-side world-snapshot scanner (_gallery_world_snapshot_is_safe)
-- and wired it into publish_map, so a forbidden snapshot can never reach storage
-- THROUGH THE PUBLISH RPC. But publish_map is not the only write path.
--
-- THE BYPASS: updateMapGalleryMetadata (src/lib/gallery.js) writes both
-- gallery_world_snapshot AND gallery_world_sections via a DIRECT owner-RLS
-- `supabase.from('saved_maps').update(...)`, never touching publish_map. The 089
-- scanner is therefore skipped entirely on the edit-after-publish path, so an
-- owner-shaped request can store raw DM content (HARD-DENY / covert keys) that
-- get_gallery_map then serves to anon. The privacy contract again rests on the
-- unprivileged client serializer alone for that path.
--
-- THE FIX (defense in depth): a BEFORE INSERT OR UPDATE trigger on
-- public.saved_maps enforces the SAME contract publish_map enforces, on EVERY
-- write path (publish_map's SECURITY DEFINER update, the direct owner-RLS update,
-- and any future writer). When NEW.gallery_world_snapshot IS NOT NULL it must be a
-- versioned (schemaVersion = '1') jsonb object that carries NO HARD-DENY / covert
-- key at any depth; NEW.gallery_world_sections gets the same forbidden-key scan
-- (no version gate — schemaVersion is snapshot-only, mirroring publish_map). A row
-- that violates the contract RAISES, so the forbidden write is rejected before it
-- lands rather than served to anon later.
--
-- 091 runs AFTER 089, so it REUSES public._gallery_world_snapshot_is_safe verbatim
-- (no redefinition). Additive + idempotent: `create or replace function` +
-- `drop trigger if exists` then `create trigger`.
-- ⚠️ inert until `supabase db push`.

-- ── (1) the guard trigger function ───────────────────────────────────────────
-- Runs BEFORE every INSERT/UPDATE on saved_maps. It only inspects the two
-- anon-served artifacts (gallery_world_snapshot + gallery_world_sections); a NULL
-- in either is allowed (no shared-world panel is projected for a null snapshot, so
-- there is nothing to leak). Cheap: at most two calls into the existing immutable
-- scanner, and only when the column is non-null.
create or replace function public._saved_maps_world_snapshot_guard()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  -- The stored snapshot the gallery serves to anon: it MUST be a versioned object
  -- carrying no private key at any depth. Mirrors the publish_map (089) check so
  -- the DIRECT owner-RLS edit path can never store what publish_map rejects.
  if new.gallery_world_snapshot is not null then
    if jsonb_typeof(new.gallery_world_snapshot) <> 'object'
       or (new.gallery_world_snapshot->>'schemaVersion') is distinct from '1' then
      raise exception 'World snapshot is malformed or has an unsupported schemaVersion (expected 1)';
    end if;
    if not public._gallery_world_snapshot_is_safe(new.gallery_world_snapshot) then
      raise exception 'World snapshot contains a forbidden private key and cannot be stored';
    end if;
  end if;

  -- The world-sections array is the second anon-served artifact, so it gets the
  -- same depth scan. schemaVersion is snapshot-only, so sections is scanned for
  -- forbidden keys but never version-gated (matching publish_map).
  if new.gallery_world_sections is not null
     and not public._gallery_world_snapshot_is_safe(new.gallery_world_sections) then
    raise exception 'World sections contain a forbidden private key and cannot be stored';
  end if;

  return new;
end;
$$;

-- Internal helper invoked only by the trigger; not a callable RPC. Revoke the
-- implicit public grant (mirrors the 089 _gallery_world_snapshot_is_safe revoke).
revoke execute on function public._saved_maps_world_snapshot_guard() from public;

comment on function public._saved_maps_world_snapshot_guard() is
  'Defense-in-depth (091): a BEFORE INSERT OR UPDATE guard on saved_maps that enforces the SAME world-snapshot contract publish_map (089) enforces, on EVERY write path. Closes the updateMapGalleryMetadata direct-update bypass: a stored gallery_world_snapshot must be a versioned (schemaVersion=1) object with no HARD-DENY / covert key at any depth, and gallery_world_sections gets the same forbidden-key scan. Reuses public._gallery_world_snapshot_is_safe.';

-- ── (2) the trigger ──────────────────────────────────────────────────────────
-- BEFORE so a violation aborts the write before the row lands. Idempotent: drop
-- any prior definition first, then create (a recreate must not double-fire).
drop trigger if exists trg_saved_maps_world_snapshot_guard on public.saved_maps;

create trigger trg_saved_maps_world_snapshot_guard
  before insert or update on public.saved_maps
  for each row
  execute function public._saved_maps_world_snapshot_guard();
