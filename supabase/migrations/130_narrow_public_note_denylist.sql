-- ════════════════════════════════════════════════════════════════════════════
-- 130 — narrow the public `note` denylist token to the genuinely-private note keys
-- ════════════════════════════════════════════════════════════════════════════
-- domain-readmodels-2 (RESOLVED). The public projection's recursive DM-private
-- denylist carried a bare `note` token that OVER-MATCHED public economics-attribution
-- keys — magicFoodNote, magicNote, upstreamNote, storageNote — stripping the
-- food-deficit / supply-chain explanation from every public / gallery / anon dossier.
-- Those keys are PUBLIC analytical annotations (the dossier's economics tab renders
-- them), not DM-private content.
--
-- THE NARROWING: replace the bare `note` token with the genuinely-private note keys
-- `dossierNotes|tabNotes|\ynotes?\y` (a Postgres \y whole-word boundary for the bare
-- note/notes field). The camelCase analytical keys carry no word boundary before
-- "Note" (magicFood‸Note), so \ynotes?\y leaves them intact while a standalone
-- `notes` / `note` field still strips. The already-private DM note channels stay
-- covered by their OWN tokens: dmNotes via \m(dm|gm), narrativeNotes via its explicit
-- alternation. The denylist still only GROWS in the private direction — this tightens
-- an over-broad token TO the private keys, it never removes a private key from cover.
--
-- COUPLED CLIENT TWIN: src/domain/display/publicSafe.js PRIVATE_KEY_RE landed the
-- IDENTICAL narrowing (`dossierNotes|tabNotes|\bnotes?\b`) in the same wave. This
-- migration MUST land with it — the regex is pinned token-⊆-SQL by
-- snapshotDenylistDrift.test.js and toPublicSafe is pinned field-for-field EQUAL to
-- the server sanitizer by gallerySanitize.pglite.test.js. A client-only change breaks
-- the drift gate or silently diverges the security twin.
--
-- FIX (net-current recreate; the two projections are hand-mirrored twins):
--   § 1. _gallery_sanitize_public_json (net-current 128) — narrow the deeper-level
--        denylist regex. This is the SETTLEMENT-DOSSIER path (get_gallery_dossier)
--        where the economics-attribution notes actually live, nested inside the
--        allowlisted economicState / resourceAnalysis subtrees.
--   § 2. _gallery_world_snapshot_is_safe (net-current 128) — narrow the covert/private
--        contains-group's `.*note.*` alternation identically, so a published world
--        snapshot embedding a settlement config carrying an economics note is no
--        longer false-REJECTED by publish_map / the saved_maps write guard, while a
--        dmNotes-class key is still rejected.
-- Both recreate the ENTIRE net-current body with `create or replace`, so every caller
-- re-points to the narrowed body with no signature change, no re-grant, and grants +
-- comments preserved. ⚠️ inert until `supabase db push` + a PostgREST refresh.
--
-- Guarded by: tests/security/gallerySanitize.pglite.test.js (dossier sanitizer
-- field-for-field parity with toPublicSafe — incl. the new economics-note pin) +
-- tests/security/galleryWorldSnapshotScanner.pglite.test.js (scanner behaviour) +
-- tests/security/snapshotDenylistDrift.test.js (every client PRIVATE_KEY_RE token —
-- now dossiernotes / tabnotes / notes — must appear in the net-current world scanner).

-- ══ § 1. _gallery_sanitize_public_json — narrow `note` (net-current 128) ═════════
create or replace function public._gallery_sanitize_public_json(value jsonb, path text[] default '{}')
returns jsonb
language plpgsql
immutable
set search_path = public, pg_temp
as $$
declare
  key text;
  child jsonb;
  sanitized jsonb;
  out jsonb;
  is_toplevel boolean;
  is_npc_obj boolean;
  -- ══ PUBLIC TOP-LEVEL ALLOWLIST ══
  -- Character-identical (order-independent) to publicSafe.js PUBLIC_TOPLEVEL_KEYS.
  -- tests/security/gallerySanitizeAllowlist.contract.test.js parses THIS literal
  -- and pins it to the merged JS twin — the drift pin. (Unchanged from 123/128; the
  -- note narrowing touches only the deeper denylist regex below.)
  public_toplevel constant text[] := array[
    'activeConditions','arrivalScene','availableServices','coherenceNotes','config',
    'conflicts','crossSettlementConflicts','dailyLife','defenseProfile','economicState',
    'economicViability','factions','generatorVersion','history','id',
    'institutions','interSettlementRelationships','name','neighborRelationship','neighbourNetwork',
    'npcs','population','populationHistory','powerStructure','pressureSentence',
    'prominentRelationship','relationships','resourceAnalysis','schemaVersion','settlementReason',
    'simulationVersion','spatialLayout','stress','stressors','structuralSuggestions',
    'structuralViolations','thesis','tier'
  ];
  -- Mirrors src/domain/display/publicSafe.js toPublicSafe NPC allowlist (033).
  npc_allowed constant text[] := array[
    'id','name','role','title','category','personality','physical',
    'factionAffiliation','secondaryAffiliation','presentation','influence'
  ];
begin
  if value is null then
    return null;
  end if;

  if jsonb_typeof(value) = 'object' then
    -- The settlement ROOT is the only object reached with an empty path.
    is_toplevel := array_length(path, 1) is null;
    -- True when this object is a direct element of an `npcs` array (its parent
    -- key is 'npcs'); only then do we apply the NPC field allowlist.
    is_npc_obj := array_length(path, 1) is not null
              and path[array_length(path, 1)] = 'npcs';
    out := '{}'::jsonb;
    for key, child in select * from jsonb_each(value) loop
      -- TOP LEVEL: allowlist (fail closed). An unknown/future top-level key is
      -- dropped even if it misses the denylist — the whole point of the flip.
      if is_toplevel and not (key = any(public_toplevel)) then
        continue;
      end if;
      -- DEEPER LEVELS: keep the recursive DM-private denylist (defense-in-depth
      -- for private keys nested inside an allowed subtree). dm/gm use word
      -- boundaries (\m) so they match dmNotes/gm* but NOT landmarks/admin. `seed`
      -- (bare, conservative) + `_config` kill the generation seed / raw config at
      -- ANY depth — critical because `config` is allowlisted at top level, so
      -- config._seed would otherwise ride through (matches 099's denylist). 128:
      -- `latentPantheon` kills the UNREVEALED starting-pantheon channel (Phase 4
      -- premium gate) — config.latentPantheon would otherwise ride through the same
      -- allowlisted `config`. The ACTIVATED embeds carry no such key and stay.
      -- 130: the note token is NARROWED to the genuinely-private note keys
      -- (dossierNotes|tabNotes|\ynotes?\y) so public economics-attribution notes
      -- (magicFoodNote / upstreamNote / storageNote — no \y before "Note") survive,
      -- while dmNotes (\m(dm|gm)) / narrativeNotes (explicit) / a bare notes field
      -- still strip.
      if not is_toplevel and key ~* '(secret|private|\m(dm|gm)|guidance|dossierNotes|tabNotes|\ynotes?\y|plotHook|plot_hooks|hook|compass|chronicle|pinnedNpc|aiData|aiSettlement|aiDailyLife|narrativeNotes|identityMarkers|frictionPoints|connectionsMap|latentPantheon|seed|_config)' then
        continue;
      end if;
      -- NPC objects: keep ONLY the public allowlist (unchanged from 033).
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
  'Public dossier JSON projection. TOP-LEVEL keys are gated by an explicit allowlist (fail closed — mirrors publicSafe.js PUBLIC_TOPLEVEL_KEYS); deeper levels keep the recursive DM-private denylist (incl. seed/_config so config._seed cannot leak — 099; latentPantheon so the unrevealed starting pantheon cannot leak — 128; note narrowed to dossierNotes/tabNotes/\ynotes?\y so public economics-attribution notes survive — 130) + NPC allowlist (033). search_path pinned public, pg_temp (111). _gallery_dm_full_json is left net-current at 121 (its _regenSeed strip preserved).';

-- ══ § 2. _gallery_world_snapshot_is_safe — narrow `.*note.*` (net-current 128) ═══
create or replace function public._gallery_world_snapshot_is_safe(value jsonb)
returns boolean
language plpgsql
immutable
set search_path = public, pg_temp
as $$
declare
  key   text;
  child jsonb;
  -- The exact HARD-DENY top-level-or-nested keys (no leak under any opt-in).
  hard_deny constant text[] := array[
    'npcStates','factionStates','relationshipStates','pendingEvents','proposals',
    'stressors','pausedAdvance','settlementTickStates','rngSeed','deferredImpacts',
    'deferredWarFronts','deferredPartyImpacts'
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
      -- note keys `.*dossierNotes.*|.*tabNotes.*|.*\ynotes?\y.*` — a public
      -- economics-attribution note (upstreamNote / magicFoodNote) no longer
      -- false-rejects a published world snapshot, while a dmNotes-class key (via
      -- .*\mdm.*) / narrativeNotes / a bare notes key still does.
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
  'Defense-in-depth (089; 127 adds _config; 128 adds latentPantheon; 130 narrows note to dossierNotes/tabNotes/\ynotes?\y): true ONLY when a stored gallery world snapshot carries NONE of the HARD-DENY / covert keys at any depth. The hard-deny compare is case-insensitive; the covert regex covers the client COVERT_KEY_RE (src/domain/display/worldSnapshotPublic.js) tokens anchored to WHOLE-key matches plus the PRIVATE_KEY_RE (src/domain/display/publicSafe.js) tokens by contains-semantics. publish_map (089) and the saved_maps write guard (091) both call this to REJECT a client-supplied snapshot server-side.';
