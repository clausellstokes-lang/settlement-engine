-- ════════════════════════════════════════════════════════════════════════════
-- 205 — the public dossier projection drops the people car's three retired keys
-- ════════════════════════════════════════════════════════════════════════════
-- THE CAUSE. The people car (ODQ §934.105; the chair's PEOPLE-RULINGS M-1b and M-2,
-- docs/chair/2026-11-07/PEOPLE-RULINGS-2026-11-07.md) retired the NPC grouping
-- `settlement.factions` and the per-NPC faction fields: a generated record carries
-- neither, and the card's standing in the powers is its `memberships`. Three keys of
-- the public sanitizer's two allowlists therefore name data no generator writes — the
-- top-level 'factions' (the grouping) and the NPC fields 'factionAffiliation' and
-- 'secondaryAffiliation'. The owner's word of 2026-11-07 (22:4x UTC): the export
-- allowlist's dead keys go BEFORE the deploy. Measured on the car's tip over the 525
-- golden-master settlements: 0 carry a top-level `factions`, 0 NPCs carry either
-- affiliation field, 0 objects sit at a `members` path under a `factions` ancestor.
--
-- THE CHANGE (net-current recreate of 189's body — a mechanical diff, nothing else):
--   (1) public_toplevel loses 'factions' (37 keys, was 38). `powerStructure` — whose
--       `factions` array IS the powers and stays public — is untouched.
--   (2) npc_allowed loses 'factionAffiliation' and 'secondaryAffiliation' (9 keys,
--       was 11).
--   (3) the is_npc_obj predicate is KEPT byte-identical: with 'factions' gone from the
--       root allowlist the retired grouping's `factions[].members[]` is never reached,
--       so its arm now guards only a roster under a deeper 'factions' ancestor
--       (`powerStructure.factions[].members`, which no generator writes today but a
--       DM edit or a legacy record may carry) — fail-closed, hiding MORE, the
--       sanctioned direction on the anon surface. Its comment is updated to say so.
--   The deeper denylist, the covert drop, the recursion, `immutable`, the pinned
--   search_path and the grant posture are 189's, unchanged.
--
-- WHAT A READER SEES. Every key removed here only HIDES: no public field is added. A
-- dossier published before the car (still carrying the grouping and the two fields in
-- the stored row) now projects without them, exactly as a post-car dossier already
-- does. The gallery import (import_gallery_dossier) of such a pre-car dossier carries a
-- non-revealed member without its two affiliation names, as it already carries every
-- post-car member without `memberships` (not public either).
--
-- NOT CHANGED: the representative's `institution` and `memberships` stay NON-public
-- (they are not in npc_allowed, as before). The chair's ruling admits them only under a
-- per-row test that strips them for a hidden or criminal house; the NPC object this
-- function sees does not carry enough to decide that (the record
-- docs/FIX_EXPORT_KEYS_2026-11-07.md §3 states what the row lacks).
-- _gallery_dm_full_json (the owner's explicit DM share) is untouched, as 189 left it.
--
-- COUPLED CLIENT TWIN: src/domain/display/publicSafe.js PUBLIC_TOPLEVEL_KEYS,
-- NPC_PUBLIC_KEYS and the publicNpc() literal lose the same three keys in the same
-- change; the parity pins are tests/security/gallerySanitizeAllowlist.contract.test.js
-- (re-keyed to the net-current definition), gallerySanitizer.pglite.test.js
-- (npc_allowed ⇄ publicNpc) and factionMemberPublicParity.pglite.test.js (client ==
-- server, field for field).
--
-- ⚠️ WRITTEN, NOT APPLIED: committed for the owner to deploy (`supabase db push` plus the
-- applied-head bump in that SAME act). Until then the change is inert in production.
--
-- Depends on: 189 (the net-current body), 093 (_gallery_apply_member_overrides, which
-- calls this by name). Re-runnable (`create or replace`, no signature change, no
-- re-grant).
-- @rollback: recreate 189's body verbatim — i.e. this same function with 'factions'
--   restored to public_toplevel and 'factionAffiliation','secondaryAffiliation' restored
--   to npc_allowed. Nothing is destroyed on reversal: the function holds no state and
--   mints no row; the only consequence is that the three keys project publicly again.
-- ════════════════════════════════════════════════════════════════════════════

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
  -- tests/security/gallerySanitizeAllowlist.contract.test.js parses the NET-CURRENT
  -- literal and pins it to the JS twin — the drift pin. (123/128/130/142/189's list;
  -- 205 drops 'factions', the people car's retired NPC grouping.)
  public_toplevel constant text[] := array[
    'activeConditions','arrivalScene','availableServices','coherenceNotes','config',
    'conflicts','crossSettlementConflicts','dailyLife','defenseProfile','economicState',
    'economicViability','generatorVersion','history','id',
    'institutions','interSettlementRelationships','name','neighborRelationship','neighbourNetwork',
    'npcs','population','populationHistory','powerStructure','pressureSentence',
    'prominentRelationship','relationships','resourceAnalysis','schemaVersion','settlementReason',
    'simulationVersion','spatialLayout','stress','stressors','structuralSuggestions',
    'structuralViolations','thesis','tier'
  ];
  -- Mirrors src/domain/display/publicSafe.js publicNpc() / NPC_PUBLIC_KEYS (033;
  -- 205 drops 'factionAffiliation','secondaryAffiliation', the people car's retired
  -- per-NPC faction fields).
  npc_allowed constant text[] := array[
    'id','name','role','title','category','personality','physical',
    'presentation','influence'
  ];
begin
  if value is null then
    return null;
  end if;

  if jsonb_typeof(value) = 'object' then
    -- The settlement ROOT is the only object reached with an empty path.
    is_toplevel := array_length(path, 1) is null;
    -- True when this object must take the NPC field allowlist: a direct element
    -- of an `npcs` array (parent key 'npcs') OR — 189 — a roster member (parent
    -- key 'members' with a 'factions' ancestor anywhere above). 205: the retired
    -- grouping `factions[].members[]` is no longer reached (its top-level key left
    -- the allowlist above); the arm is KEPT for a roster under a deeper 'factions'
    -- ancestor (powerStructure.factions[].members — no generator writes one, a DM
    -- edit or a legacy record may), fail-closed: such a member takes the SAME
    -- public reduction as npcs[].
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
      -- NPC objects (npcs[] elements AND — 189 — roster members under a 'factions'
      -- ancestor): keep ONLY the public allowlist (033's list less 205's two keys).
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

-- Preserve the original grant posture (020 revoked from public; unchanged at 205).
revoke execute on function public._gallery_sanitize_public_json(jsonb, text[]) from public;

comment on function public._gallery_sanitize_public_json(jsonb, text[]) is
  'Public dossier JSON projection. TOP-LEVEL keys are gated by an explicit allowlist (fail closed — mirrors publicSafe.js PUBLIC_TOPLEVEL_KEYS); deeper levels keep the recursive DM-private denylist (incl. seed/_config so config._seed cannot leak — 099; latentPantheon so the unrevealed starting pantheon cannot leak — 128; note narrowed to dossierNotes/tabNotes/\ynotes?\y so public economics-attribution notes survive — 130) + NPC allowlist (033) applied to npcs[] elements AND roster members (paths ending ''members'' under a ''factions'' ancestor — 189; since 205 only a deeper roster such as powerStructure.factions[].members, fail-closed) + a VALUE-level covert drop (142): any non-root object flagged covert:true is dropped whole. 205: the people car''s three retired keys (top-level factions, npc factionAffiliation / secondaryAffiliation) are no longer public. search_path pinned public, pg_temp (111/131). _gallery_dm_full_json left net-current at 121 (its _regenSeed strip preserved); _gallery_world_snapshot_is_safe already rejects covert-keyed snapshots (net-current 136).';
