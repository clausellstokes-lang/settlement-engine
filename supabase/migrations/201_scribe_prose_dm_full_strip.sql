-- ════════════════════════════════════════════════════════════════════════════
-- 201 — strip the SCRIBE ARTEFACT (`prose`) from the DM-full gallery projection
-- ════════════════════════════════════════════════════════════════════════════
-- THE SCRIBE (docs/DESIGN_SCRIBE_GENERATION_TIME_PROSE.md §5, chair ruling 3).
-- `settlement.prose` is AI-rendered dossier prose, written once per epoch, kept on
-- the settlement blob. The chair's ruling is that it is NOT shown to gallery viewers
-- and NOT copied on gallery import: it is paid, per-account, never human-refuted
-- content, and hiding it is the reversible first state (re-open at W5).
--
-- THE PUBLIC projection already drops it and needs no change: migration 050 flipped
-- `_gallery_sanitize_public_json` to a top-level ALLOWLIST, and `prose` is
-- deliberately absent from it, so every anonymous, pre-publish and ordinary gallery
-- view drops the key by fail-closed omission.
--
-- THE DM-FULL projection is the gap. `_gallery_dm_full_json` (net-current 129) is a
-- DENYLIST: it drops the keys it names and passes everything else through. The
-- gallery_share_dm opt-in publishes the owner's own DM-private content, and its own
-- copy scopes that to secrets, plot hooks, NPC goals and relationships, DM notes and
-- the DM Compass. Rendered prose is not in that bargain, so without this strip a
-- DM-share would publish it. The CLIENT twin is the same one-line drop in
-- `toPublicSafe({full:true})` (src/domain/display/publicSafe.js), landed in the same
-- commit; the two halves are pinned together by tests/security/galleryDmFull.pglite.test.js.
--
-- FIX (net-current recreate from 129 VERBATIM; the denylist only ever GROWS): add
-- ONE more key to the drop chain — `- 'prose'`. Everything else — the aiData /
-- aiDailyLife / aiSettlement drops, the private note space, BOTH seed carriers
-- (_seed / _regenSeed / _config), the DM-Compass re-add, and the `config` re-add with
-- its own `_seed` AND `latentPantheon` removed (129's premium gate) — is 129 verbatim.
-- Immutable + additive: get_gallery_dossier's DM-full RPC calls this by name, so
-- `create or replace` re-points it with no signature change and no re-grant.
-- ⚠️ inert until `supabase db push` + a PostgREST refresh. THE PUSH IS THE OWNER'S ACT.
--
-- Guarded by: tests/security/galleryDmFull.pglite.test.js (the net-current static
-- drift check and the execution arms) and tests/lib/scribeArtefact.test.js (CURE 5,
-- the client twin in both default and full mode).
--
-- @rollback: recreate _gallery_dm_full_json from the 129 body without the `- 'prose'`
--   strip (re-opening the exposure). Roll back only to unblock a broken deploy, then
--   re-apply.

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
      -- space + BOTH generation seed carriers (_seed / _regenSeed / _config) + the
      -- SCRIBE ARTEFACT (201 — rendered dossier prose is not part of the DM-share
      -- bargain), then re-add the DM Compass only when a field survives, and
      -- `config` with its own _seed AND latentPantheon removed (129).
      (j - 'aiData' - 'aiDailyLife' - 'aiSettlement'
         - 'dossierNotes' - 'dmNotes' - 'notes' - 'narrativeNotes'
         - '_seed' - '_regenSeed' - '_config'
         - 'prose')
      || case
           when (select c from compass) <> '{}'::jsonb
             then jsonb_build_object('aiSettlement', (select c from compass))
           else '{}'::jsonb
         end
      || case
           when jsonb_typeof(j -> 'config') = 'object'
             then jsonb_build_object('config', (j -> 'config') - '_seed' - 'latentPantheon')
           else '{}'::jsonb
         end
  end;
$$;

comment on function public._gallery_dm_full_json(jsonb) is
  'DM-share (full) gallery projection (201 — adds the Scribe artefact strip to 129). Drops the prose blobs, aiSettlement, the private note space, BOTH generation seeds (_seed + _regenSeed + _config) and the rendered dossier prose (settlement.prose, THE SCRIBE), re-adds the DM Compass, and keeps config with its own _seed AND latentPantheon removed. A generation seed is confidential in every gallery view; the unrevealed starting pantheon never leaves the account; AI-rendered dossier prose is not shown to gallery viewers and not copied on gallery import (Scribe chair ruling 3).';
