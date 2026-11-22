-- ════════════════════════════════════════════════════════════════════════════
-- 203 — the gallery scanner mirrors the CLIENT hard-deny list in full
-- ════════════════════════════════════════════════════════════════════════════
-- Design §12.4 (the settlement editor and the decree registry, ODQ §934.36) and the
-- gallery world-snapshot denylist's three hand-mirrored copies: the client
-- PRIVATE_KEY_RE (src/domain/display/publicSafe.js) + COVERT_KEY_RE /
-- WORLD_SNAPSHOT_HARD_DENY (src/domain/display/worldSnapshotPublic.js), and this
-- server-side scanner public._gallery_world_snapshot_is_safe (net-current: 202),
-- documented to mirror their UNION as defense-in-depth.
--
-- THE HOLE THIS CLOSES. 136 froze the hard_deny array with the comment "every
-- CONDITIONAL_LEDGER_KEY but pantheon", and 202 copied that array verbatim. The comment
-- was true when written and went stale THREE times: factionPairStates (2026-07-20),
-- envoyErrands (2026-08-03) and concludedWars (2026-08-31) each landed on the client
-- WORLD_SNAPSHOT_HARD_DENY afterwards, and nothing carried them here.
-- tests/security/worldSnapshotDenyCensus.test.js forces a new conditional ledger onto the
-- CLIENT list; nothing forced the SQL to follow. Until this migration, a stored gallery
-- world snapshot carrying any of those three DM-truth ledgers was accepted SERVER-side.
--
-- FIX (net-current recreate from 202 — the scanner's body preserved VERBATIM outside the
-- hard_deny array literal, contracted as a mechanical diff): exactly ONE additive change
-- and no other character altered —
--   (1) `hard_deny` gains 'factionPairStates','envoyErrands','concludedWars' on the
--       existing conditional-ledger line, so all three are refused as whole keys at any
--       depth, case-insensitively (`lower(key) = any (...)` lowers both sides, so the
--       literals stay in the client's camelCase, which is the array's convention).
-- WHAT DID NOT CHANGE: the private-channel alternation (34 alternatives, same order), the
-- recursion, `immutable`, `set search_path`, the two jsonb_typeof branches and the scalar
-- return are byte-identical to 202. The array's COMMENT is rewritten to name the RULE
-- rather than a snapshot, so it cannot go stale a fourth time.
-- Immutable + additive; the denylist only ever GROWS. NO MEMBER IS EVER REMOVED — a
-- removal weakens the public veil and is the owner's act, never a migration's.
-- `create or replace` re-points publish_map (089), the saved_maps write guard (091) and the
-- campaign-tiles RPC (148), which call this by name, to the widened body with no signature
-- change and no re-grant.
--
-- WHY THE SIBLING SANITIZERS ARE LEFT NET-CURRENT. _gallery_sanitize_public_json (the
-- dossier sanitizer, net-current 189) and _gallery_dm_full_json (129) are deliberately NOT
-- re-created here, as 136 and 202 likewise left them alone: they are PROJECTIONS rather
-- than predicates, and their top-level ALLOWLIST already drops settlement-root keys, so no
-- nested occurrence exists or can exist. Re-creating them would copy a large body to change
-- nothing observable.
--
-- ⚠️ WRITTEN, NOT APPLIED: this migration is committed for the owner to deploy. The
-- applied-head ledger (supabase/applied-head.json) is deliberately NOT bumped and stays at
-- 200 — deployment is the owner's manual act (`supabase db push` plus the appliedHead bump
-- in that SAME act). Until then the repo head sits three migrations ahead of prod (201, 202
-- and 203), surfaced by `validate:migration-head` as pending (visible, not fatal), and this
-- scanner's new refusals are inert: the gap this migration closes is OPEN IN PRODUCTION.
--
-- Depends on: 202 (the net-current body), 089 (publish_map), 091 (the saved_maps guard),
-- 148 (the campaign-tiles RPC). Re-runnable.
-- @rollback: recreate 202's body verbatim — i.e. this same function with the three
--   'factionPairStates','envoyErrands','concludedWars' hard_deny members removed. Nothing
--   is destroyed on reversal: the function holds no state and mints no row; the only
--   consequence is that a stored snapshot carrying those three ledgers is accepted
--   server-side again, exactly as it is today.
--
-- Guarded by tests/security/galleryScannerMirrorTotality.test.js (the client-mirror
-- totality claim: every WORLD_SNAPSHOT_HARD_DENY member is refused by the net-current
-- scanner, plus the mechanical diff against 202) + tests/ops/migrationRehearsal.test.js
-- (the 203 wave arm: this file is the net-current scanner) +
-- tests/security/snapshotDenylistDrift.test.js (the client token mirror, one-directional)
-- + the execution cases in tests/security/galleryWorldSnapshotScanner.pglite.test.js.

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
    -- conditional ledgers — THE RULE, NOT A SNAPSHOT (203): every member of the client
    -- WORLD_SNAPSHOT_HARD_DENY except the public-allowlisted `pantheon`. 136 and 202 both
    -- wrote "every CONDITIONAL_LEDGER_KEY but pantheon", which was true when written and
    -- went stale three times: factionPairStates (2026-07-20), envoyErrands (2026-08-03)
    -- and concludedWars (2026-08-31) landed on the client afterwards and nothing carried
    -- them here. tests/security/galleryScannerMirrorTotality.test.js now holds this array
    -- to the client list on every gate run, so the claim cannot go stale again.
    'religionStates','warPosture','occupations','martialReadiness','conquestFeeds',
    'mercenaryMarket','rulesetLog','spatialDigest','spatialLedgers','narrativeTempo',
    'politicsLedgers','factionPairStates','envoyErrands','concludedWars'
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
