-- ════════════════════════════════════════════════════════════════════════════
-- 202 — the gallery world-snapshot scanner denies the settlement editor's keys
-- ════════════════════════════════════════════════════════════════════════════
-- Design §12.4 (the settlement editor and the decree registry, ODQ §934.36): the
-- editor persists exactly two new save-time keys — `dmLayer` (which fields are the
-- DM's) and `decrees` (the staged registry) — and BOTH are DM-private. The gallery
-- world-snapshot denylist is hand-mirrored in THREE places: the client PRIVATE_KEY_RE
-- (src/domain/display/publicSafe.js) + COVERT_KEY_RE / WORLD_SNAPSHOT_HARD_DENY
-- (src/domain/display/worldSnapshotPublic.js), and this server-side scanner
-- public._gallery_world_snapshot_is_safe (net-current: 136), documented to mirror
-- their UNION as defense-in-depth.
--
-- THIS IS MIRROR THREE, AND IT LANDS FIRST. tests/security/snapshotDenylistDrift.test.js
-- is ONE-DIRECTIONAL: it asserts every CLIENT token has a covering SQL alternative and
-- never the reverse. So the server may refuse a key before a client token for it exists,
-- but never after — landing the SQL first is the only safe order, and the client token
-- follows in its own change.
--
-- FIX (net-current recreate from 136 — the scanner's body preserved VERBATIM, including
-- the entire covert/private regex and the 135 census, so the drift test's token mirror
-- stays green): exactly TWO additive changes and no other character altered —
--   (1) `hard_deny` gains 'dmLayer','decrees' after the always-present private keys, so
--       both are refused as whole keys at any depth, case-insensitively; and
--   (2) the private-channel alternation gains ONE alternative, `.*decrees.*`, beside
--       128's `.*latentPantheon.*` (the placement migration 128 set). `dmLayer` was
--       already covered there by the `\mdm` word-boundary token; `decrees` matched
--       nothing, which is the hole this closes.
-- Immutable + additive; the denylist only ever GROWS. `create or replace` re-points
-- publish_map (089) and the saved_maps write guard (091), which call this by name, to
-- the hardened body with no signature change and no re-grant.
--
-- WHY THE SIBLING SANITIZER IS LEFT NET-CURRENT. _gallery_sanitize_public_json (the
-- dossier sanitizer) and _gallery_dm_full_json are deliberately NOT re-created here, as
-- 136 likewise left the sanitizer alone: `decrees` is a settlement-ROOT key that the
-- sanitizer's TOP-LEVEL ALLOWLIST already drops, no nested occurrence exists or can
-- exist (the registry is written at the save root, by exactly one writer), and the drift
-- test pins the SCANNER. Re-creating the sanitizer would copy a large body to change
-- nothing observable.
--
-- ⚠️ WRITTEN, NOT APPLIED: this migration is committed for the owner to deploy. The
-- applied-head ledger (supabase/applied-head.json) is deliberately NOT bumped and stays
-- at 200 — deployment is the owner's manual act (`supabase db push` plus the appliedHead
-- bump in that SAME act). Until then the repo head sits two migrations ahead of prod
-- (201 and 202), surfaced by `validate:migration-head` as pending (visible, not fatal),
-- and this scanner's new refusals are inert.
--
-- Depends on: 136 (the net-current scanner body), 089 (publish_map), 091 (the saved_maps
-- write guard). Re-runnable.
-- @rollback: recreate 136's body verbatim — i.e. this same function with the two
--   'dmLayer','decrees' hard_deny members and the one `.*decrees.*` alternative removed.
--   Nothing is destroyed on reversal: the function holds no state and mints no row; the
--   only consequence is that a stored snapshot carrying the editor's keys is accepted
--   server-side again, exactly as it is today.
--
-- Guarded by tests/ops/migrationRehearsal.test.js (the 202 wave arm: this file is the
-- net-current scanner and denies both keys) + tests/security/snapshotDenylistDrift.test.js
-- (the client token mirror, one-directional) + the execution cases in
-- tests/security/galleryWorldSnapshotScanner.pglite.test.js.

create or replace function public._gallery_world_snapshot_is_safe(value jsonb)
returns boolean
language plpgsql
immutable
set search_path = public, pg_temp
as $$
declare
  key   text;
  child jsonb;
  -- The exact HARD-DENY top-level-or-nested keys (no leak under any opt-in). This is
  -- the client WORLD_SNAPSHOT_HARD_DENY = always-present private keys + every worldState
  -- CONDITIONAL_LEDGER_KEY except the public-allowlisted `pantheon` (135 census lift).
  hard_deny constant text[] := array[
    -- always-present private worldState keys
    'npcStates','factionStates','relationshipStates','pendingEvents','proposals',
    'stressors','pausedAdvance','settlementTickStates','rngSeed','deferredImpacts',
    'deferredWarFronts','deferredPartyImpacts',
    'dmLayer','decrees',
    -- conditional ledgers (135): every CONDITIONAL_LEDGER_KEY but pantheon
    'religionStates','warPosture','occupations','martialReadiness','conquestFeeds',
    'mercenaryMarket','rulesetLog','spatialDigest','spatialLedgers','narrativeTempo',
    'politicsLedgers'
  ];
begin
  if value is null then
    return true;
  end if;

  if jsonb_typeof(value) = 'object' then
    for key, child in select * from jsonb_each(value) loop
      -- Reject an exact HARD-DENY key, CASE-INSENSITIVELY (lower on both sides) so a
      -- mixed/upper-cased forbidden key like NpcStates cannot slip past the literal
      -- camelCase list.
      if lower(key) = any (select lower(x) from unnest(hard_deny) as t(x)) then
        return false;
      end if;
      -- … and the covert / seed / prose channels the client final-scrub drops. This
      -- mirrors the UNION of the client COVERT_KEY_RE (worldSnapshotPublic.js) and
      -- PRIVATE_KEY_RE (publicSafe.js). It is ANCHORED to whole-key matches (^...$) so
      -- a benign key that merely CONTAINS a token is not false-rejected: the seed /
      -- covert / pre-prefix tokens match only as whole keys (so "Seedhaven" and
      -- "seedTick" pass), while the private substring tokens keep their .* contains
      -- semantics. The dm / gm tokens honour a Postgres ERE start-of-word boundary
      -- (\m) so they match dmNotes / gmGuidance without over-matching admin / isAdmin.
      -- 127: `.*_config.*` closes the PRIVATE_KEY_RE `_config` drift (the raw
      -- authoring config channel the seed-posture 099/121 work made SECRET).
      -- 128: `.*latentPantheon.*` closes the PRIVATE_KEY_RE latentPantheon drift (the
      -- unrevealed starting-pantheon channel the Phase 4 premium gate made SECRET).
      -- 130: the note channel is NARROWED (mirroring PRIVATE_KEY_RE) to the private
      -- note keys `.*dossierNotes.*|.*tabNotes.*|.*\ynotes?\y.*`.
      -- (Regex preserved verbatim from 130; 135 touches only the hard_deny array above.)
      if key ~* ('^('
        -- covert / seed / dice / pre-prefix channels (COVERT_KEY_RE) — whole-key only.
        || 'covert|rngSeed|seed|rollExplanations?|diceDetail|explanation'
        || '|preSnapshot|preWorldState|preRegionalGraph|preSaves'
        -- DM-private channels (PRIVATE_KEY_RE) — contains-semantics via .* around the
        -- token, with \m word boundaries for the dm / gm prefixes.
        || '|.*secret.*|.*private.*|.*\mdm.*|.*\mgm.*|.*guidance.*'
        || '|.*dossierNotes.*|.*tabNotes.*|.*\ynotes?\y.*'
        || '|.*plotHook.*|.*plot_hooks.*|.*hook.*|.*compass.*|.*chronicle.*'
        || '|.*pinnedNpc.*|.*aiData.*|.*aiSettlement.*|.*aiDailyLife.*'
        || '|.*narrativeNotes.*|.*identityMarkers.*|.*frictionPoints.*|.*connectionsMap.*'
        || '|.*latentPantheon.*'
        || '|.*decrees.*'
        || '|.*_config.*'
        || ')$') then
        return false;
      end if;
      if not public._gallery_world_snapshot_is_safe(child) then
        return false;
      end if;
    end loop;
    return true;
  end if;

  if jsonb_typeof(value) = 'array' then
    for child in select jsonb_array_elements(value) loop
      if not public._gallery_world_snapshot_is_safe(child) then
        return false;
      end if;
    end loop;
    return true;
  end if;

  -- A scalar leaf carries no key, so it is always safe.
  return true;
end;
$$;
