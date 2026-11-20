CREATE OR REPLACE FUNCTION public._gallery_world_snapshot_is_safe(value jsonb)
 RETURNS boolean
 LANGUAGE plpgsql
 IMMUTABLE
 SET search_path TO 'public', 'pg_temp'
AS $function$
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
$function$

