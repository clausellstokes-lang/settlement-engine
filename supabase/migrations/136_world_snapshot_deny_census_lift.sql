-- ════════════════════════════════════════════════════════════════════════════
-- 135 — lift the server world-snapshot HARD-DENY census to the merged waves
-- ════════════════════════════════════════════════════════════════════════════
-- The gallery world-snapshot denylist is hand-mirrored in THREE places: the client
-- PRIVATE_KEY_RE (src/domain/display/publicSafe.js) + COVERT_KEY_RE + the
-- WORLD_SNAPSHOT_HARD_DENY key list (src/domain/display/worldSnapshotPublic.js), and
-- this server-side scanner public._gallery_world_snapshot_is_safe (net-current: 130),
-- documented to mirror their UNION as defense-in-depth.
--
-- THE DRIFT (security-privacy-r2-1): the server scanner's `hard_deny` array had lagged
-- the engine by ~15 waves. Every worldState CONDITIONAL_LEDGER_KEY except the public-
-- derived pantheon must be hard-denied (they carry the DM-private heart of the sim —
-- per-settlement blocs incl. COVERT ones, war posture, religion states, the raw spatial
-- mover ledgers, the paused-advance pre-snapshot). They were absent from BOTH the client
-- list and this SQL array, so a hand-crafted publish_map / saved_maps write carrying e.g.
-- `spatialLedgers` or `politicsLedgers` would be dropped by the client final-scrub yet
-- ACCEPTED by the server scanner — a defense-in-depth hole if the client is bypassed.
--
-- FIX (net-current recreate from 130 — the scanner's body preserved VERBATIM, including
-- the ENTIRE covert/private regex with 127's _config, 128's latentPantheon, and 130's
-- narrowed dossierNotes/tabNotes/\ynotes?\y note tokens, so snapshotDenylistDrift.test.js's
-- token mirror stays green): extend ONLY the `hard_deny` array with religionStates /
-- warPosture / occupations / martialReadiness / conquestFeeds / mercenaryMarket /
-- rulesetLog / spatialDigest / spatialLedgers / narrativeTempo / politicsLedgers. The
-- census is now the exact CONDITIONAL_LEDGER_KEYS − { pantheon } set the client hard-denies.
-- Immutable + additive; the denylist only ever GROWS. `create or replace` re-points
-- publish_map (089) and the saved_maps guard trigger (091), which call this by name, to
-- the hardened body with no signature change and no re-grant. (The sibling dossier
-- sanitizer _gallery_sanitize_public_json is left net-current at 130 — untouched here; the
-- census is a world-snapshot concern only.) ⚠️ inert until `supabase db push` + a
-- PostgREST refresh.
--
-- ⚠️ WRITTEN, NOT APPLIED: this migration is committed for the owner to deploy. The
-- applied-head ledger (supabase/applied-head.json) is deliberately NOT bumped — the repo
-- head advances to 135 while prod stays at its applied head, surfaced as a pending
-- migration by `validate:migration-head` (visible, not fatal).
--
-- Guarded by tests/security/snapshotDenylistDrift.test.js (client regex token mirror) +
-- tests/security/worldSnapshotDenyCensus.test.js (the client census ⇔ CONDITIONAL_LEDGER_KEYS)
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

-- Internal helper: not a public RPC. Re-assert the 089 revoke of the implicit grant.
revoke execute on function public._gallery_world_snapshot_is_safe(jsonb) from public;

comment on function public._gallery_world_snapshot_is_safe(jsonb) is
  'Defense-in-depth (089; 127 adds _config; 128 adds latentPantheon; 130 narrows note to dossierNotes/tabNotes/\ynotes?\y; 135 lifts the hard-deny census to every CONDITIONAL_LEDGER_KEY but pantheon): true ONLY when a stored gallery world snapshot carries NONE of the HARD-DENY / covert keys at any depth. The hard-deny compare is case-insensitive; the covert regex covers the client COVERT_KEY_RE (src/domain/display/worldSnapshotPublic.js) tokens anchored to WHOLE-key matches plus the PRIVATE_KEY_RE (src/domain/display/publicSafe.js) tokens by contains-semantics. publish_map (089) and the saved_maps write guard (091) both call this to REJECT a client-supplied snapshot server-side.';
