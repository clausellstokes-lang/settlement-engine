-- ════════════════════════════════════════════════════════════════════════════
-- 189 — scrub faction-member NPC records from the public dossier projection
-- ════════════════════════════════════════════════════════════════════════════
-- CYCLE-3 Wave 8 respec H21 (owner order 2026-07-26). DM-private NPC fields
-- leaked through the public projection whenever NPCs ride inside faction
-- rosters instead of (only) the top-level npcs array.
--
-- THE LEAK: factions[].members[] embed the SAME full NPC records as npcs[] —
-- factionGrouping.generateFactions pushes roster object REFERENCES into each
-- faction's members, and relinkFactionMembers (narrativeGenerator.js) re-points
-- them at the enriched roster records, so the serialized settlement carries the
-- complete NPC record (goal / secret / plotHooks / gender / power / …) under
-- every faction. The NPC field allowlist (npc_allowed, 033) only fires when an
-- object's path ends in 'npcs' (142:105) — a member's path ends in 'members'
-- under 'factions', so it NEVER matched. The deeper denylist still caught
-- `secret` and `plotHooks` at depth (tokens secret|plotHook|hook), but `goal`
-- (the NPC's DM motivation, short + long prose), `gender`, `power`, and any
-- future non-allowlisted NPC field rode through to the anon gallery dossier
-- (get_gallery_dossier). VERIFIED 2026-07-26 against a freshly generated
-- settlement: the public projection's factions[].members[0] carried
-- goal/gender/power while npcs[0] was correctly reduced.
--
-- THE FIX (net-current recreate of the 142 body + one predicate): is_npc_obj
-- now ALSO matches an object whose path ends in 'members' under a 'factions'
-- ancestor ('factions' = any(path)), so faction-member records get the SAME
-- npc_allowed reduction as npcs[] — fail-closed, closing goal/gender/power and
-- every future private NPC field in one rule instead of chasing key tokens.
-- The ancestor rule deliberately also covers deeper rosters (e.g. a future
-- powerStructure.factions[].members): hiding MORE is the sanctioned direction
-- on the anon surface.
--
-- SCOPE — DOSSIER PATH ONLY, exactly like 142. _gallery_dm_full_json is
-- intentionally UNTOUCHED: gallery_share_dm is the owner's explicit DM-content
-- share (secrets, hooks, NPC goals), and faction members there are that same
-- opted-in DM content. _gallery_world_snapshot_is_safe is a key-presence
-- scanner and unchanged.
--
-- COUPLED CLIENT TWIN: src/domain/display/publicSafe.js sanitizePublicValue
-- lands the IDENTICAL member reduction (NPC_PUBLIC_KEYS) in the same change.
-- No PRIVATE_KEY_RE token is added, so the token-⊆-SQL drift pin
-- (snapshotDenylistDrift.test.js) and the top-level allowlist pin
-- (gallerySanitizeAllowlist.contract.test.js, which parses 123) are UNAFFECTED;
-- the npc_allowed literal below is byte-identical to 142's, so the
-- npc_allowed ⇄ publicNpc sync pin (gallerySanitizer.pglite.test.js) holds.
--
-- `create or replace` recreates the whole net-current body: every caller
-- re-points with no signature change, no re-grant, grants + comment preserved.
-- ⚠️ inert until `supabase db push` + a PostgREST refresh (repo head 189 >
-- applied head — the normal pending/undeployed state the migration-head gate
-- surfaces). The applied-head ledger (supabase/applied-head.json) is
-- deliberately NOT bumped; this migration is committed for the owner's
-- very-end deploy batch.
--
-- Guarded by: tests/security/factionMemberPublicParity.pglite.test.js (executes
-- THIS net-current sanitizer against a faction-member fixture, asserts the
-- member reduction on BOTH roster depths, and pins it field-for-field to the
-- client twin toPublicSafe) + tests/domain/display/publicSafe.test.js (client
-- default-drop / full-keep) + tests/security/gallerySanitizer.pglite.test.js
-- (npc_allowed ⇄ publicNpc sync, unchanged).

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
  -- tests/security/gallerySanitizeAllowlist.contract.test.js parses the 123 literal
  -- and pins it to the merged JS twin — the drift pin. (Unchanged from 123/128/130/142.)
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
    -- True when this object must take the NPC field allowlist: a direct element
    -- of an `npcs` array (parent key 'npcs') OR — 189 — a faction-roster member
    -- (parent key 'members' with a 'factions' ancestor anywhere above).
    -- factions[].members[] embed the SAME full NPC records as npcs[], so they
    -- get the SAME public reduction; without this, goal/gender/power rode
    -- through (secret/plotHooks were already caught by the deeper denylist).
    is_npc_obj := array_length(path, 1) is not null
              and (path[array_length(path, 1)] = 'npcs'
                   or (path[array_length(path, 1)] = 'members'
                       and 'factions' = any(path)));
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
      -- NPC objects (npcs[] elements AND — 189 — faction-roster members): keep
      -- ONLY the public allowlist (unchanged list from 033).
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
  'Public dossier JSON projection. TOP-LEVEL keys are gated by an explicit allowlist (fail closed — mirrors publicSafe.js PUBLIC_TOPLEVEL_KEYS); deeper levels keep the recursive DM-private denylist (incl. seed/_config so config._seed cannot leak — 099; latentPantheon so the unrevealed starting pantheon cannot leak — 128; note narrowed to dossierNotes/tabNotes/\ynotes?\y so public economics-attribution notes survive — 130) + NPC allowlist (033) applied to npcs[] elements AND faction-roster members (paths ending ''members'' under a ''factions'' ancestor — 189: factions[].members[] embed the same full NPC records as npcs[], so goal/gender/power must not ride through) + a VALUE-level covert drop (142): any non-root object flagged covert:true is dropped whole. search_path pinned public, pg_temp (111/131). _gallery_dm_full_json left net-current at 121 (its _regenSeed strip preserved); _gallery_world_snapshot_is_safe already rejects covert-keyed snapshots (net-current 136).';
