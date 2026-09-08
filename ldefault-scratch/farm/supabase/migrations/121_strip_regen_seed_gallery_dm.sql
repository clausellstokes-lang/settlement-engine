-- 121_strip_regen_seed_gallery_dm.sql
--
-- Strip the SECOND generation seed (_regenSeed) from the DM-share gallery projection.
--
-- THE LEAK. A settlement persists TWO generation seeds: `_seed` (the original) and
-- `_regenSeed` (regenNPCsPipeline stamps it at the settlement top level). 099's
-- _gallery_dm_full_json strips `_seed` and `_config` from the DM-share (full) gallery
-- view — but NOT `_regenSeed`, so an owner who opts into DM-share leaks a seed that
-- regenerates content beyond anything they chose to reveal (a seed is confidential in
-- EVERY gallery view, exactly like dmNotes). The client mirror toPublicSafe had the
-- same gap in full mode (default mode caught it via the recursive denylist); both are
-- fixed together. The public (non-DM) view already drops it via
-- _gallery_sanitize_public_json's denylist, so ONLY the DM-full projection needs this.
--
-- THE FIX. Recreate _gallery_dm_full_json from its NET-CURRENT 099 body VERBATIM and
-- add ONE more top-level strip: `- '_regenSeed'`. Everything else — the DM-Compass
-- re-add, the config._seed removal, the prose/notes drops — is 099 verbatim.
--
-- @rollback: recreate _gallery_dm_full_json from the 099 body without the
--   `- '_regenSeed'` strip (re-opening the leak). Roll back only to unblock a broken
--   deploy, then re-apply.

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
      -- space + BOTH generation seed carriers (_seed / _regenSeed / _config — like
      -- dmNotes, a seed regenerates content the owner never chose to reveal, so it is
      -- stripped from EVERY gallery view), then re-add the DM Compass only when
      -- a field survives, and `config` with its own _seed removed.
      (j - 'aiData' - 'aiDailyLife' - 'aiSettlement'
         - 'dossierNotes' - 'dmNotes' - 'notes' - 'narrativeNotes'
         - '_seed' - '_regenSeed' - '_config')
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
  'DM-share (full) gallery projection (121 — adds the _regenSeed strip to 099). Drops prose blobs, aiSettlement, the private note space, and BOTH generation seeds (_seed + _regenSeed + _config), re-adds the DM Compass, and keeps config with its own _seed removed. A generation seed is confidential in every gallery view.';
