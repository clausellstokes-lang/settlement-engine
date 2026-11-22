-- ════════════════════════════════════════════════════════════════════════════
-- 142 — scrub COVERT-flagged objects from the public dossier projection
-- ════════════════════════════════════════════════════════════════════════════
-- W-DOCTRINE-3 §6 (owner-ratified DESIGN_CORRUPTION_WEB.md); the GALLERY-2
-- native-marketer commission's recorded PRECONDITION (the covert-corruption
-- anon-gallery scrub lands BEFORE any amplification feature). Pre-existing leak,
-- NOT created by the corruption-web design — verified against base c765a032 first
-- per the pre-existing-red protocol (a covert impairment carrying a naming
-- description survives the net-current 130 _gallery_sanitize_public_json unchanged).
--
-- THE LEAK: imposeCorruption (scope:'individual_institution', mutateEntities.js)
-- stamps a COVERT 'corruption' impairment onto the corrupted NPC's home
-- institution — { type:'corruption', severity, covert:true, causeEventId,
-- appliedAt, description:"<NPC>'s capture quietly compromised <inst>." } — on
-- institutions[].impairments. `institutions` is an allowlisted public top-level
-- key; NONE of the impairment's keys (covert / description / type / severity /
-- causeEventId / appliedAt) match the deeper-level DM-private denylist, so the
-- WHOLE covert impairment — including the NPC-naming description, hidden DM plot
-- state — rode through to the anon gallery dossier (get_gallery_dossier).
--
-- WHY A KEY-STRIP IS INSUFFICIENT: adding a `covert` token to the denylist would
-- drop only the `covert` KEY and LEAVE the naming `description` exposed. The fix
-- must drop the WHOLE covert-flagged object — a VALUE-level rule, not a key token.
--
-- THE FIX (net-current recreate of _gallery_sanitize_public_json, 130 body + one
-- guard): in the object branch, BEFORE walking entries, drop any non-root object
-- whose `covert` field is JSON true. Returning null drops it from BOTH its parent
-- object (the `if sanitized is not null` guard) AND a parent array (same guard in
-- the array branch), so a covert element vanishes from institutions[].impairments.
-- Guarded to non-root (a settlement root is never covert; the client covert-checks
-- nested objects only, never the settlement root — exact parity).
--
-- SCOPE — DOSSIER PATH ONLY. The world-snapshot path is ALREADY covered: the
-- _gallery_world_snapshot_is_safe scanner (net-current 136) rejects any snapshot
-- carrying a `covert` KEY at any depth (its regex includes `covert` — preserved
-- verbatim through the 136 census lift), so a covert impairment fail-closes a map
-- publish there. _gallery_dm_full_json is intentionally UNTOUCHED: the owner's
-- gallery_share_dm opt-in is an explicit DM-content share (secrets, hooks, NPC
-- goals) — a covert corruption fact is DM narrative consistent with that opt-in,
-- and the design's §6 concern is the ANON surface only. This keeps client↔SQL
-- parity: only the default dossier sanitizer changes on both sides.
--
-- COUPLED CLIENT TWIN: src/domain/display/publicSafe.js sanitizePublicValue lands
-- the IDENTICAL value-level covert-object drop in the same wave. Because it is a
-- VALUE rule and NOT a new PRIVATE_KEY_RE token, the token-⊆-SQL drift pin
-- (snapshotDenylistDrift.test.js) and the top-level allowlist pin
-- (gallerySanitizeAllowlist.contract.test.js) are UNAFFECTED. The field-for-field
-- parity pin (gallerySanitize.pglite.test.js) gains a covert round-trip case.
--
-- `create or replace` recreates the whole net-current body: every caller re-points
-- with no signature change, no re-grant, grants + comment preserved.
-- ⚠️ inert until `supabase db push` + a PostgREST refresh (repo head 142 > applied
-- head 117 — the normal pending/undeployed state the migration-head gate surfaces).
-- The applied-head ledger (supabase/applied-head.json) is deliberately NOT bumped;
-- this migration is committed for the owner's very-end deploy batch.
--
-- Guarded by: tests/security/gallerySanitize.pglite.test.js (field-for-field parity
-- with toPublicSafe, incl. the new covert round-trip pin) + the runVisibilityAudit
-- covert-impairment fixture (tests/domain/display/visibilityAudit*.test.js) +
-- tests/domain/display/publicSafe.test.js (client default-drop / full-keep).

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
  -- and pins it to the merged JS twin — the drift pin. (Unchanged from 123/128/130.)
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
    -- COVERT DROP (142, W-DOCTRINE-3 §6): an object explicitly flagged covert:true is
    -- hidden DM state (e.g. a covert corruption impairment on institutions[].impairments
    -- whose description NAMES the corrupted NPC). Drop the WHOLE object — returning null
    -- removes it from both a parent object and a parent array. Stripping only the
    -- `covert` key would leave the naming description exposed. Non-root only (a settlement
    -- root is never covert; the client covert-checks nested objects only). Mirrors
    -- publicSafe.js sanitizePublicValue.
    if not is_toplevel and (value -> 'covert') = 'true'::jsonb then
      return null;
    end if;
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
  'Public dossier JSON projection. TOP-LEVEL keys are gated by an explicit allowlist (fail closed — mirrors publicSafe.js PUBLIC_TOPLEVEL_KEYS); deeper levels keep the recursive DM-private denylist (incl. seed/_config so config._seed cannot leak — 099; latentPantheon so the unrevealed starting pantheon cannot leak — 128; note narrowed to dossierNotes/tabNotes/\ynotes?\y so public economics-attribution notes survive — 130) + NPC allowlist (033) + a VALUE-level covert drop (142): any non-root object flagged covert:true is dropped whole (a covert corruption impairment''s NPC-naming description must never reach an anon dossier). search_path pinned public, pg_temp (111/131). _gallery_dm_full_json left net-current at 121 (its _regenSeed strip preserved); _gallery_world_snapshot_is_safe already rejects covert-keyed snapshots (net-current 136).';
