-- ────────────────────────────────────────────────────────────────────────────
-- 099_sanitize_gallery_seed_and_config.sql — stop the generation seed leaking
-- through every public gallery read.
--
-- THE LEAK: settlements persist the deterministic generation seed as `_seed`
-- (top-level, attached before normalize so idFromSeed stays stable) and again
-- inside the resolved config (`config._seed`), plus the RAW authoring config as
-- `_config`. The public sanitizer's denylist (net-current: migration 033) has
-- NO seed token at all, and the DM-full projection (net-current: migration 031)
-- never drops it either — so get_gallery_dossier (anon-granted) and
-- import_gallery_dossier (whose 048 comment PROMISES "never the generation
-- seed") both served it. With the seed, any anonymous reader can regenerate the
-- full UNSANITIZED settlement — every secret, plot hook and DM note the
-- sanitizer exists to strip — through the deterministic engine.
--
-- FIX (both helpers recreated from their net-current bodies; every existing
-- strip preserved, the denylist only ever grows):
--   1. _gallery_sanitize_public_json (from 033): add `seed` + `_config` to the
--      recursive key denylist. Bare `seed` is a deliberate conservative
--      substring (the file's over-strip-not-under-strip posture): it catches
--      `_seed`, `config._seed`, `_regenSeed` and any future seed variant.
--      `config` itself is NOT stripped — public renderers legitimately read
--      config.terrainType / config.primaryDeitySnapshot / config.tradeRouteAccess
--      (tiles + the War & Faith tab); only its seed key dies. `_config` (the raw
--      DM authoring input, sentinels intact) has no public consumer and goes
--      entirely.
--   2. _gallery_dm_full_json (from 031): the seed is TRULY confidential like
--      dmNotes — never shared even when the owner reveals their DM layer,
--      because it reconstructs content beyond what any toggle shows (and the
--      settlement's entire deterministic future). Drop top-level `_seed` +
--      `_config`, and rebuild `config` without its `_seed`.
--
-- Both are plain (non-DEFINER) internal helpers invoked from the SECURITY
-- DEFINER gallery RPCs; grant posture preserved (020 revoked the sanitizer
-- from public). Client mirrors updated in the same change:
-- src/domain/display/publicSafe.js (toPublicSafe) + src/lib/gallery.js
-- (stripImportConfidential).
-- ────────────────────────────────────────────────────────────────────────────

-- ── 1. Public sanitizer: strip seed keys + the raw authoring config ─────────
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
  is_npc_obj boolean;
  -- Mirrors src/domain/display/publicSafe.js toPublicSafe NPC allowlist.
  npc_allowed constant text[] := array[
    'id','name','role','title','category','personality','physical',
    'factionAffiliation','secondaryAffiliation','presentation','influence'
  ];
begin
  if value is null then
    return null;
  end if;

  if jsonb_typeof(value) = 'object' then
    -- True when this object is a direct element of an `npcs` array (its parent
    -- key is 'npcs'); only then do we apply the NPC field allowlist.
    is_npc_obj := array_length(path, 1) is not null
              and path[array_length(path, 1)] = 'npcs';
    out := '{}'::jsonb;
    for key, child in select * from jsonb_each(value) loop
      -- DM-private key denylist. dm/gm use word boundaries (\m = start-of-word)
      -- so they match dmNotes/dmCompass/gm* but NOT landmarks/admin/judgment.
      -- `seed` is a deliberate bare substring: it kills _seed / config._seed —
      -- the deterministic generation seed that would let an anon reader
      -- regenerate the full unsanitized settlement. `_config` is the raw DM
      -- authoring config (also seed-bearing); `config` itself stays public.
      if key ~* '(secret|private|\m(dm|gm)|guidance|note|plotHook|plot_hooks|hook|compass|chronicle|pinnedNpc|aiData|aiSettlement|aiDailyLife|narrativeNotes|identityMarkers|frictionPoints|connectionsMap|seed|_config)' then
        continue;
      end if;
      -- NPC objects: keep ONLY the public allowlist (the denylist alone let
      -- power / *Contribution / potentialSuccessors / linked* etc. leak).
      if is_npc_obj and not (key = any(npc_allowed)) then
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

-- Preserve the original grant posture (020 revoked from public).
revoke execute on function public._gallery_sanitize_public_json(jsonb, text[]) from public;

comment on function public._gallery_sanitize_public_json(jsonb, text[]) is
  'Recursive allow-by-omission sanitizer for public dossier JSON. Internal helper used by get_gallery_dossier(). Strips seed keys (_seed / config._seed) + the raw _config so the deterministic generation seed can never leave a public read.';

-- ── 2. DM-full projection: the seed is confidential even when shared ────────
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
      -- drop the prose blobs + the full aiSettlement + the DM's private note
      -- space + the generation seed carriers (_seed / _config — like dmNotes,
      -- the seed regenerates content the owner never chose to reveal, so it is
      -- stripped from EVERY gallery view), then re-add the DM Compass only when
      -- a field survives, and `config` with its own _seed removed.
      (j - 'aiData' - 'aiDailyLife' - 'aiSettlement'
         - 'dossierNotes' - 'dmNotes' - 'notes' - 'narrativeNotes'
         - '_seed' - '_config')
      || case
           when (select c from compass) <> '{}'::jsonb
             then jsonb_build_object('aiSettlement', (select c from compass))
           else '{}'::jsonb
         end
      || case
           when jsonb_typeof(j -> 'config') = 'object'
             then jsonb_build_object('config', (j -> 'config') - '_seed')
           else '{}'::jsonb
         end
  end;
$$;

comment on function public._gallery_dm_full_json(jsonb) is
  'shareDm projection: reveal the DM-private layer but drop AI prose (aiData/aiDailyLife), trim aiSettlement to the DM-Compass fields, strip the DM private note space (dossierNotes/dmNotes/notes/narrativeNotes), and strip the generation seed (_seed / config._seed / _config) — confidential even in full mode. Mirrors client toPublicSafe({full:true}).';
