-- ════════════════════════════════════════════════════════════════════════════
-- 129 — strip the LATENT PANTHEON from the DM-full gallery projection
-- ════════════════════════════════════════════════════════════════════════════
-- Phase 4 W-F7, THE PREMIUM GATE (architect ruling in the W-F6 commit). Migration
-- 128 stripped `config.latentPantheon` — the UNREVEALED starting pantheon the
-- generation pipeline bakes into every seed (seedStartingPantheon step) — from the
-- two PUBLIC projections (_gallery_sanitize_public_json + _gallery_world_snapshot_is_safe).
-- But the DM-SHARE (full) projection `_gallery_dm_full_json` was left net-current at
-- 121, so it still carried the latent pantheon through.
--
-- THE LEAK: the DM-full opt-in (gallery_share_dm) publishes the owner's own
-- DM-private content — secrets, plot hooks, NPC goals/relationships, DM Compass.
-- The owner chose to reveal THAT. The latent pantheon is different in kind: it is
-- content the dossier has NOT YET NAMED — the gods still latent in the seed,
-- unrevealed by definition (only a premium activation copies the latent patron into
-- the LIVE embeds). The architect ruling: unrevealed content NEVER leaves the
-- account, not even on a DM-full share. 121 re-adds `config` to the DM-full body
-- with only its own `_seed` removed — so `config.latentPantheon` rode straight
-- through. This closes it, mirroring the client twin toPublicSafe({full:true})
-- (src/domain/display/publicSafe.js — the same W-F7 strip).
--
-- FIX (net-current recreate from 121 VERBATIM; the denylist only ever GROWS): add
-- ONE more strip to the `config` re-add — `(j -> 'config') - '_seed' - 'latentPantheon'`.
-- Everything else — the prose/notes/aiSettlement drops, BOTH seed carriers
-- (_seed / _regenSeed / _config), the DM-Compass re-add — is 121 verbatim. Immutable
-- + additive: get_gallery_dossier's DM-full RPC calls this by name, so `create or
-- replace` re-points it to the hardened body with no signature change and no
-- re-grant. The ACTIVATED live embeds (primaryDeitySnapshot / cultDeitySnapshots /
-- primaryDeityRef / faithProfile) carry no `latentPantheon` key and stay — a shared
-- premium pantheon displays read-only to all viewers, the latent seed never does.
-- ⚠️ inert until `supabase db push` + a PostgREST refresh.
--
-- Guarded by: tests/security/galleryDmFull.pglite.test.js (execution: strip the
-- latent, keep the activated embeds + DM content; static net-current drift check)
-- and the client twin cases in tests/domain/display/publicSafe.test.js.
--
-- @rollback: recreate _gallery_dm_full_json from the 121 body without the
--   `- 'latentPantheon'` strip (re-opening the leak). Roll back only to unblock a
--   broken deploy, then re-apply.

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
      -- a field survives, and `config` with its own _seed AND latentPantheon removed
      -- (129 — the unrevealed starting pantheon never leaves the account, not even
      -- on a DM-full share).
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
             then jsonb_build_object('config', (j -> 'config') - '_seed' - 'latentPantheon')
           else '{}'::jsonb
         end
  end;
$$;

comment on function public._gallery_dm_full_json(jsonb) is
  'DM-share (full) gallery projection (129 — adds the latentPantheon strip to 121). Drops prose blobs, aiSettlement, the private note space, and BOTH generation seeds (_seed + _regenSeed + _config), re-adds the DM Compass, and keeps config with its own _seed AND latentPantheon removed. A generation seed is confidential in every gallery view; the unrevealed starting pantheon never leaves the account, not even on a DM-full share (Phase 4 W-F7 premium gate). The ACTIVATED live embeds carry no latentPantheon key and stay.';
