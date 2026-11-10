-- ════════════════════════════════════════════════════════════════════════════
-- 210 — the public dossier carries the owner's composed blocks as text (publicProse)
-- ════════════════════════════════════════════════════════════════════════════
-- AMENDED BEFORE FIRST APPLY by the pre-deploy review of 2026-11-10 (finding 4; the chair's
--   rulings R5 and R10): THE NAME MASK WALKS THE DOCUMENT. The mask was `replace` over the whole
--   JSON TEXT, so a hidden power named `true`, `null`, `1`, a single space or `{` raised
--   (`invalid input syntax for type json`: every public read of that town, and get_gallery_map
--   for its campaign, failed), a name equal to a key (`name`, `id`, `text`) rewrote the key,
--   and a substring hit the settlement's own name. The body masks inside string VALUES only,
--   by walking the document: never a key, never the settlement's own top-level `name`; an
--   empty or whitespace-only name is skipped; and the removal of a row stamped hidden sits
--   OUTSIDE the name check, so a hidden row whose `faction` is missing or empty leaves too.
--   206 and 207 carry the SAME corrected body (R10), so this file is again 207's body plus one
--   token, as THE SHAPE below says. Client twin: publicSafe.js :: publicVeilPass, field for
--   field. Pinned by execution on all three bodies: tests/security/gallerySanitizer.pglite.test.js.
-- THE CAUSE. STYLE-RULINGS-2 B10(a), lane SW-B7b PROJECTION; the chair's ruling of 2026-11-09 12:5x on the
-- owner's word ("I leave all judgement to you for any decision you deferred to me since my last prompt"):
-- the paid-surface gate (§885.3, publicDossier ⇒ no state prose) is LIFTED for the gallery page and the
-- players' link, as a TEXT PROJECTION. The composed blocks are drawn owner-side (the player audience, the
-- record's own seed) at every save and carried as strings in `settlements.data.publicProse`; the public and
-- party pages render the carried text instead of re-composing. The seed posture (099/121) stands: the seed
-- never travels; only the drawn sentences do.
--
-- THE SHAPE. A mechanical re-statement of 207's `_gallery_sanitize_public_json` body (latest wins) with ONE
-- token added to the top-level allowlist: 'publicProse'. Deeper levels keep the recursive denylist, so a
-- key under publicProse that matches a private token is stripped, fail-closed. Pinned character-identical
-- to the client's publicSafe.js :: PUBLIC_TOPLEVEL_KEYS by tests/security/gallerySanitizeAllowlist.contract.test.js.
-- `_gallery_dm_full_json` passes publicProse already (it strips named keys only); `_gallery_apply_member_overrides`
-- (093, 208's twin) calls this function by name and is unchanged.
-- APPLYING THIS FILE IS THE OWNER'S HAND, at the deploy (operating standard rule 17): `supabase db push`.
-- Depends on: 207 (the net-current body). Composes with 208 (which does not redefine this function).
-- Re-runnable (`create or replace`, no signature change, no re-grant).
-- @rollback: re-apply 207's body verbatim — this same function without 'publicProse' in public_toplevel.
--   Nothing is destroyed on reversal: the function holds no state; the public page then falls silent
--   where the composed blocks stood, as at 207.
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
  -- 206 (second seat): the root pass's two sets, read from the ORIGINAL record
  hidden_names text[];
  veiled_ids text[];
  txt text;
  -- R5 (2026-11-10): the mask's walk — one string leaf at a time
  leaf_path text[];
  leaf_text text;
  masked text;
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
    'structuralViolations','thesis','tier','publicProse'
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
    -- institution RECORD — an object of kind 'house' | 'power' naming its house by `key`
    -- (or `name`), as the client's people/cardPowers.js :: cardInstitutionOf reads it — is
    -- a pre-car card, a DM's person or a malformed value, and takes npc_allowed as at 205.
    -- coalesce: an ABSENT `veiled` (or key) reads NULL, and NULL must never pass for public.
    house_is_object := coalesce(
      is_npc_obj
      and jsonb_typeof(value -> 'institution') = 'object'
      and (value -> 'institution' ->> 'kind') in ('house', 'power')
      and coalesce(nullif(value -> 'institution' ->> 'key', ''), nullif(value -> 'institution' ->> 'name', '')) is not null,
      false);
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
    -- 206 (second seat): THE ROOT PASS. The hidden powers' names (each row's own stamped
    -- `hidden`) and the veiled faces' ids (each card's own bit, by the house-record test
    -- above, stamped true or absent), from the ORIGINAL record.
    if is_toplevel then
      select coalesce(array_agg(distinct nm), '{}') into hidden_names
        from jsonb_array_elements(case when jsonb_typeof(value -> 'powerStructure' -> 'factions') = 'array'
                                       then value -> 'powerStructure' -> 'factions' else '[]'::jsonb end) as f(row)
             cross join lateral (values (row ->> 'faction')) as n(nm)
       where jsonb_typeof(row) = 'object' and (row -> 'hidden') = 'true'::jsonb
         and nm is not null and nm ~ '[^[:space:]]';
      select coalesce(array_agg(n ->> 'id'), '{}') into veiled_ids
        from jsonb_array_elements(case when jsonb_typeof(value -> 'npcs') = 'array'
                                       then value -> 'npcs' else '[]'::jsonb end) as t(n)
       where jsonb_typeof(n) = 'object'
         and (n ->> 'id') is not null
         and jsonb_typeof(n -> 'institution') = 'object'
         and (n -> 'institution' ->> 'kind') in ('house', 'power')
         and coalesce(nullif(n -> 'institution' ->> 'key', ''), nullif(n -> 'institution' ->> 'name', '')) is not null
         and not coalesce((n -> 'institution' -> 'veiled') = 'false'::jsonb, false);
      -- a veiled face's title by its ties: the `from` end's npc1Role, the `to` end's npc2Role
      if coalesce(array_length(veiled_ids, 1), 0) > 0 and jsonb_typeof(out -> 'relationships') = 'array' then
        out := jsonb_set(out, '{relationships}', (
          select coalesce(jsonb_agg(
                   case when jsonb_typeof(r) = 'object' then
                     (case when coalesce((r ->> 'from') = any(veiled_ids), false) then r - 'npc1Role' else r end)
                     - (case when coalesce((r ->> 'to') = any(veiled_ids), false) then 'npc2Role' else '' end)
                   else r end
                   order by ord), '[]'::jsonb)
            from jsonb_array_elements(out -> 'relationships') with ordinality as t(r, ord)));
      end if;
      -- 207 (ALLEGIANCE-CAR2, J-20): THE HALL'S HOLD IS DM-ONLY. The capture state is derived from the ruling three's
      -- HIDDEN allegiances, so the public page carries none of it: `criminalCaptureState` leaves the power structure,
      -- the governing row's `captureState` seed leaves every power row, and every relation row that carries a
      -- `captureState` or is typed 'corrupted' is DROPPED whole (never re-typed). Character for character the client's
      -- publicSafe.js :: publicVeilPass.
      if jsonb_typeof(out -> 'powerStructure') = 'object' then
        out := jsonb_set(out, '{powerStructure}', (out -> 'powerStructure') - 'criminalCaptureState');
        if jsonb_typeof(out -> 'powerStructure' -> 'factions') = 'array' then
          out := jsonb_set(out, '{powerStructure,factions}', (
            select coalesce(jsonb_agg(case when jsonb_typeof(f) = 'object' then f - 'captureState' else f end order by ord), '[]'::jsonb)
              from jsonb_array_elements(out -> 'powerStructure' -> 'factions') with ordinality as t(f, ord)));
        end if;
        if jsonb_typeof(out -> 'powerStructure' -> 'factionRelationships') = 'array' then
          out := jsonb_set(out, '{powerStructure,factionRelationships}', (
            select coalesce(jsonb_agg(r order by ord), '[]'::jsonb)
              from jsonb_array_elements(out -> 'powerStructure' -> 'factionRelationships') with ordinality as t(r, ord)
             where not coalesce(jsonb_typeof(r) = 'object'
                        and ((r ? 'captureState') or (r ->> 'type') = 'corrupted'), false)));
        end if;
      end if;
      -- the hidden power's own row leaves the powers (another row naming it — a niche contest, a
      -- description — keeps its key and has the name masked below). R5 (2026-11-10): OUTSIDE the
      -- name check, so a row stamped hidden whose `faction` is missing or empty leaves too.
      if jsonb_typeof(out -> 'powerStructure' -> 'factions') = 'array' then
        out := jsonb_set(out, '{powerStructure,factions}', (
          select coalesce(jsonb_agg(f order by ord), '[]'::jsonb)
            from jsonb_array_elements(out -> 'powerStructure' -> 'factions') with ordinality as t(f, ord)
           where not coalesce(jsonb_typeof(f) = 'object'
                      and (coalesce((f -> 'hidden') = 'true'::jsonb, false)
                           or coalesce((f ->> 'faction') = any(hidden_names), false)), false)));
      end if;
      if coalesce(array_length(hidden_names, 1), 0) > 0 then
        -- every conflict whose parties name a hidden power, at both homes
        foreach key in array array['conflicts', 'powerStructure.conflicts'] loop
          if jsonb_typeof(out #> string_to_array(key, '.')) = 'array' then
            out := jsonb_set(out, string_to_array(key, '.'), (
              select coalesce(jsonb_agg(c order by ord), '[]'::jsonb)
                from jsonb_array_elements(out #> string_to_array(key, '.')) with ordinality as t(c, ord)
               where not coalesce(jsonb_typeof(c) = 'object'
                          and jsonb_typeof(c -> 'parties') = 'array'
                          and exists (select 1 from jsonb_array_elements_text(c -> 'parties') as p(party)
                                       where p.party = any(hidden_names)), false)));
          end if;
        end loop;
        -- the crisis cast's stakes naming a hidden power, at both stress homes (one entry, or an array)
        foreach key in array array['stress', 'stressors'] loop
          if jsonb_typeof(out -> key) = 'object' and jsonb_typeof(out -> key -> 'cast' -> 'stakes') = 'array' then
            out := jsonb_set(out, array[key, 'cast', 'stakes'], (
              select coalesce(jsonb_agg(st order by ord), '[]'::jsonb)
                from jsonb_array_elements(out -> key -> 'cast' -> 'stakes') with ordinality as t(st, ord)
               where not coalesce(jsonb_typeof(st) = 'object' and (st ->> 'factionId') = any(hidden_names), false)));
          elsif jsonb_typeof(out -> key) = 'array' then
            out := jsonb_set(out, array[key], (
              select coalesce(jsonb_agg(
                       case when jsonb_typeof(e) = 'object' and jsonb_typeof(e -> 'cast' -> 'stakes') = 'array' then
                         jsonb_set(e, '{cast,stakes}', (
                           select coalesce(jsonb_agg(st order by so), '[]'::jsonb)
                             from jsonb_array_elements(e -> 'cast' -> 'stakes') with ordinality as s2(st, so)
                            where not coalesce(jsonb_typeof(st) = 'object' and (st ->> 'factionId') = any(hidden_names), false)))
                       else e end
                       order by eo), '[]'::jsonb)
                from jsonb_array_elements(out -> key) with ordinality as t(e, eo)));
          end if;
        end loop;
        -- last: the name anywhere else a public string VALUE carries it, masked. R5 (2026-11-10): the
        -- document is WALKED — every string leaf, at any depth, by its path — and each leaf is masked
        -- as text and set back as a JSON string; a key is never touched, nor the settlement's own
        -- top-level `name`. (206/207 replaced over the JSON text, which raised on a name matching
        -- text outside a string and rewrote a key equal to a name.)
        for leaf_path, leaf_text in
          with recursive walk(p, v) as (
            select array[]::text[], out
            union all
            select w.p || e.k, e.v
              from walk w
              cross join lateral (
                select o.key as k, o.value as v
                  from jsonb_each(case when jsonb_typeof(w.v) = 'object' then w.v else '{}'::jsonb end) as o
                union all
                select (a.ord - 1)::text, a.el
                  from jsonb_array_elements(case when jsonb_typeof(w.v) = 'array' then w.v else '[]'::jsonb end)
                       with ordinality as a(el, ord)
              ) as e
          )
          select p, v #>> '{}' from walk
           where jsonb_typeof(v) = 'string' and p is distinct from array['name']
        loop
          masked := leaf_text;
          foreach txt in array hidden_names loop
            masked := replace(masked, txt, 'an unseen interest');
          end loop;
          if masked is distinct from leaf_text then
            out := jsonb_set(out, leaf_path, to_jsonb(masked));
          end if;
        end loop;
      end if;
    end if;
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

-- Preserve the original grant posture (020 revoked from public; unchanged at 206, 207 and 210).
revoke execute on function public._gallery_sanitize_public_json(jsonb, text[]) from public;

comment on function public._gallery_sanitize_public_json(jsonb, text[]) is
  'Public dossier JSON projection. TOP-LEVEL keys are gated by an explicit allowlist (fail closed — mirrors publicSafe.js PUBLIC_TOPLEVEL_KEYS); deeper levels keep the recursive DM-private denylist (incl. seed/_config so config._seed cannot leak — 099; latentPantheon so the unrevealed starting pantheon cannot leak — 128; note narrowed to dossierNotes/tabNotes/\ynotes?\y so public economics-attribution notes survive — 130) + NPC allowlist (033) applied to npcs[] elements AND roster members (paths ending ''members'' under a ''factions'' ancestor — 189; since 205 only a deeper roster such as powerStructure.factions[].members, fail-closed) + a VALUE-level covert drop (142): any non-root object flagged covert:true is dropped whole. 205: the people car''s three retired keys (top-level factions, npc factionAffiliation / secondaryAffiliation) are no longer public. 206: the card''s veil bit — an NPC object''s institution and memberships are public only where institution.veiled is false (each membership only where its own veiled is false), and a face whose institution is an object with veiled true or absent loses title and role (fail-closed); a card with no institution object takes the 205 allowlist unchanged. search_path pinned public, pg_temp (111/131). _gallery_dm_full_json left net-current at 121 (its _regenSeed strip preserved); _gallery_world_snapshot_is_safe already rejects covert-keyed snapshots (net-current 136). 207: THE HALL''S HOLD IS DM-ONLY — powerStructure.criminalCaptureState and every factions[].captureState are stripped, and every factionRelationships[] row carrying a captureState or typed corrupted is dropped whole (client twin publicSafe.js :: publicVeilPass); _gallery_world_snapshot_is_safe untouched (the simulation''s factionStates ladder stays acceptable). 210: publicProse joins the top-level allowlist — the owner''s composed blocks drawn owner-side (player audience, the record''s seed) and carried as text; the seed never travels (STYLE-RULINGS-2 B10(a)).';
