-- ════════════════════════════════════════════════════════════════════════════
-- 206 — the public dossier projection reads the card's veil bit: a face's house is
--       public where `institution.veiled` is false, stripped where it is true or absent
-- ════════════════════════════════════════════════════════════════════════════
-- THE CAUSE. FIX-EXPORT-KEYS (docs/FIX_EXPORT_KEYS_2026-11-07.md §3) found that a people
-- car face's `title` and `role` were ALREADY public: the car sets both to the face's
-- title, so a card minted for a HIDDEN power (the stress infiltrator, "Its presence is
-- not known to the settlement") or the face of a criminal house printed that title on
-- a public gallery page, and this function could not tell per row whether a house was
-- hidden. The chair's ruling of 2026-11-07, shape (a), "one source for the fact": every
-- writer of a card's `institution` stamps `institution.veiled: true | false` at birth
-- from ONE predicate (src/domain/people/cardVeil.js — the gallery veil's hideable house:
-- criminal, clandestine or an illegal brokerage; a hidden or criminal power for a
-- minted face), and this function READS the bit and never re-derives it. Measured at
-- the fix's tip over the 525 golden-master settlements: 14,366 faces carry the bit,
-- 1,359 veiled (879 criminal houses, 480 hidden-power mints); the soak 1,000: 29,020
-- faces, 1,616 veiled (docs/FIX_PUBLIC_VEIL_2026-11-07.md).
--
-- THE CHANGE (net-current recreate of 205's body — a mechanical diff, nothing else):
--   (1) a new constant npc_house_keys = ['institution','memberships']: on an NPC object
--       they are kept ONLY where `institution` is an object whose `veiled` is the JSON
--       false — the face row and the card's door return on a public card for an open
--       house (PEOPLE-6 §6), and the honorific prints as on the DM's card. THE SAME LAW
--       PER ENTRY (the chair's second ruling): every writer of `memberships` stamps each
--       entry's `veiled` from the predicate applied to THAT power, and only the entries
--       stamped false are kept — a membership in a hidden power (the infiltrator's
--       embedded assets, 5 on the soak 1,000) or a criminal one is dropped, as is an
--       unstamped entry and a `memberships` that is not an array;
--   (2) a new constant npc_house_named = ['title','role']: on an NPC object whose
--       `institution` is an OBJECT with `veiled` true or ABSENT (a card born before the
--       bit — fail-closed) they are stripped, so the public card shows the bare name and
--       nothing of the house. `role` goes with `title` because the car writes both as the
--       face's title (M-1b);
--   (3) an NPC object with NO `institution` object (a card saved before the people car,
--       a DM's person, `institution: null`) is untouched: npc_allowed, as at 205;
--   (4) npc_allowed itself is 205's 9 keys, byte-identical; public_toplevel, the deeper
--       denylist, the covert drop, the is_npc_obj predicate, the recursion, `immutable`,
--       the pinned search_path and the grant posture are 205's, unchanged.
--
-- WHAT A READER SEES. A post-fix dossier: an open house's face carries its institution
-- (`{kind,key,family,title,veiled}`) and its memberships stamped open
-- (`[{power,rank,share,veiled:false}]`, each naming a power already public under
-- `powerStructure`); a veiled face carries neither, and no title or role. A dossier published by the people car BEFORE the fix
-- (an institution record with no bit) loses its faces' title and role — hiding more,
-- the sanctioned direction. A pre-car dossier projects exactly as at 205.
-- The DM's per-card ties eye (`field:npc:<id>:ties`, gallery_member_overrides.$veil)
-- stays a CLIENT-side projection (galleryVeil.js applyVeil), as it was for every other
-- tie: an open house's `institution` the DM shut with that eye is in this function's
-- output and removed on the client (FIX-EXPORT-KEYS §3.4; recorded, not changed).
-- _gallery_dm_full_json (the owner's explicit DM share) is untouched.
--
-- COUPLED CLIENT TWIN: src/domain/display/publicSafe.js NPC_HOUSE_KEYS and
-- NPC_HOUSE_NAMED_KEYS (character-identical to the two new constants), its per-row
-- isNpcKeyPublic and publicCard (the npcs[] projection and the roster-member gate) in
-- the same change; pinned by tests/security/gallerySanitizer.pglite.test.js (the
-- constants' parity and the executed proofs) and factionMemberPublicParity.pglite
-- (client == server, field for field).
--
-- ⚠️ WRITTEN, NOT APPLIED: committed for the owner to deploy after 205 (`supabase db
-- push` plus the applied-head bump in that SAME act). Until then the change is inert in
-- production.
--
-- Depends on: 205 (the net-current body), 093 (_gallery_apply_member_overrides, which
-- calls this by name). Re-runnable (`create or replace`, no signature change, no
-- re-grant).
-- @rollback: recreate 205's body verbatim — i.e. this same function without the two new
--   constants and the per-row house rule. Nothing is destroyed on reversal: the function
--   holds no state and mints no row; the only consequence is that every face's title and
--   role project publicly again and no face's institution or memberships do, as at 205.
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
  -- 206: the card's veil bit, read once per NPC object
  house_is_object boolean;
  house_is_public boolean;
  -- ══ PUBLIC TOP-LEVEL ALLOWLIST ══
  -- Character-identical (order-independent) to publicSafe.js PUBLIC_TOPLEVEL_KEYS.
  -- tests/security/gallerySanitizeAllowlist.contract.test.js parses the NET-CURRENT
  -- literal and pins it to the JS twin — the drift pin. (123/128/130/142/189's list;
  -- 205 drops 'factions', the people car's retired NPC grouping; 206 leaves it as 205's.)
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
  -- 206: THE VEIL BIT. Character-identical to publicSafe.js NPC_HOUSE_KEYS: public on an
  -- NPC object only where its `institution` is an object with `veiled` = JSON false.
  npc_house_keys constant text[] := array['institution','memberships'];
  -- 206: character-identical to publicSafe.js NPC_HOUSE_NAMED_KEYS: stripped on an NPC
  -- object whose `institution` is an object with `veiled` true or absent (fail-closed).
  npc_house_named constant text[] := array['title','role'];
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
    -- 206: THE VEIL BIT, read (never re-derived) on an NPC object. A card with no
    -- institution OBJECT (pre-car, a DM's person, null) takes npc_allowed as at 205.
    -- coalesce: an ABSENT `veiled` reads NULL, and NULL must never pass for public.
    house_is_object := coalesce(is_npc_obj and jsonb_typeof(value -> 'institution') = 'object', false);
    house_is_public := coalesce(house_is_object and (value -> 'institution' -> 'veiled') = 'false'::jsonb, false);
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
      -- 206: the per-row house rule. NPC_HOUSE_KEYS ride only on a public house; a
      -- veiled (or unstamped) house's face loses its title and role too.
      if is_npc_obj and key = any(npc_house_keys) then
        if not house_is_public then
          continue;
        end if;
      elsif is_npc_obj and house_is_object and not house_is_public and key = any(npc_house_named) then
        continue;
      elsif is_npc_obj and not (key = any(npc_allowed)) then
        continue;
      end if;

      sanitized := public._gallery_sanitize_public_json(child, path || key);
      -- 206: THE SAME LAW PER ENTRY (the chair's ruling). On a public house, a membership rides only
      -- where its OWN `veiled` is the JSON false; an entry stamped true or not stamped is dropped, and
      -- a `memberships` that is not an array is dropped whole (fail-closed). Order is kept.
      if is_npc_obj and key = 'memberships' then
        if jsonb_typeof(sanitized) is distinct from 'array' then
          continue;
        end if;
        select coalesce(jsonb_agg(entry order by ord), '[]'::jsonb) into sanitized
          from jsonb_array_elements(sanitized) with ordinality as entries(entry, ord)
         where coalesce((entry -> 'veiled') = 'false'::jsonb, false);
      end if;
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

-- Preserve the original grant posture (020 revoked from public; unchanged at 206).
revoke execute on function public._gallery_sanitize_public_json(jsonb, text[]) from public;

comment on function public._gallery_sanitize_public_json(jsonb, text[]) is
  'Public dossier JSON projection. TOP-LEVEL keys are gated by an explicit allowlist (fail closed — mirrors publicSafe.js PUBLIC_TOPLEVEL_KEYS); deeper levels keep the recursive DM-private denylist (incl. seed/_config so config._seed cannot leak — 099; latentPantheon so the unrevealed starting pantheon cannot leak — 128; note narrowed to dossierNotes/tabNotes/\ynotes?\y so public economics-attribution notes survive — 130) + NPC allowlist (033) applied to npcs[] elements AND roster members (paths ending ''members'' under a ''factions'' ancestor — 189; since 205 only a deeper roster such as powerStructure.factions[].members, fail-closed) + a VALUE-level covert drop (142): any non-root object flagged covert:true is dropped whole. 205: the people car''s three retired keys (top-level factions, npc factionAffiliation / secondaryAffiliation) are no longer public. 206: the card''s veil bit — an NPC object''s institution and memberships are public only where institution.veiled is false (each membership only where its own veiled is false), and a face whose institution is an object with veiled true or absent loses title and role (fail-closed); a card with no institution object takes the 205 allowlist unchanged. search_path pinned public, pg_temp (111/131). _gallery_dm_full_json left net-current at 121 (its _regenSeed strip preserved); _gallery_world_snapshot_is_safe already rejects covert-keyed snapshots (net-current 136).';
