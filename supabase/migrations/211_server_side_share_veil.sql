-- ════════════════════════════════════════════════════════════════════════════
-- 211 — the server-side share veil: every public read of a town's dossier is served
--       already veiled, and sends nothing of the veil but what the page draws itself
-- ════════════════════════════════════════════════════════════════════════════
-- WRITTEN-NOT-DEPLOYED (standing law; applies via `supabase db push` at the deploy step, never
-- from a lane; the applied-head bump is the owner's, in that same act). COHERENCE-VEIL phase 2,
-- the chair's rulings of 2026-11-12 on docs/chair/2026-11-11/COHERENCE-VEIL-PHASE1-PROPOSAL.md.
--
-- THE CAUSE (measured by execution at 210, the proposal's section (a)): the veil a DM sets by hand
-- (gallery_member_overrides.$veil, written by the share panel) was applied only in the reader's
-- browser (src/domain/display/galleryVeil.js). The gallery read and the party link sent everything
-- it hides (14,749 strings on 24 towns with every eye shut, 417 with the default veil); the gallery
-- read also sent the frozen copy verbatim (never sanitised) beside the live row; and the map page
-- (get_gallery_map) and import (import_gallery_dossier) applied no veil at all, on either side.
--
-- THE CHANGE.
--   (1) _gallery_veil(pub, overrides, link): the SQL twin of galleryVeil.js's resolver and applier
--       (defaultVeilFor, readShareVeil, resolveVeil, applyVeil with VEILED_PUBLIC_PROSE), over the
--       projection the client veiled (the sanitised or DM-full JSON after the member splice). It
--       returns {body, groupings}, or NULL for an UNMARKED share read as a listing (served exactly
--       as before: the owner's open question on pre-veil pages stays where it is). On the party link
--       an unmarked share takes the default veil (the client's R4). Helpers named _gallery_veil_*.
--       The house predicate is declarative (cardVeil.js isHideableHouse: the inference tables hold no
--       row for the clandestine kinds). An anonymous legacy event (no id, name, title or label; the
--       client hashes it) is read FAIL-CLOSED: every eye addressed to any legacy event applies to it.
--   (2) get_gallery_dossier (147): the share's veil applied to `data`; in snapshot mode `data` is the
--       FROZEN COPY run through the same sanitiser or DM-full strip, member splice and veil, and the
--       live row is not sent (the chair's ruling 5): a copy frozen by an older client is cleaned at
--       read, with no re-export.
--   (3) get_unlisted_dossier (208 as amended): the veil applied to `dossier`; the lateral holds
--       `offset 0`, so the sanitiser runs once (the VEIL-FIX review's low finding 1).
--   (4) get_gallery_map (088): each member's dossier through its own listing's veil (ruling 1).
--   (5) import_gallery_dossier (131): the importer's copy through the listing's veil (ruling 2).
--   (6) On both dossier reads gallery_member_overrides is rebuilt from an ALLOWLIST
--       (_gallery_veil_served; low finding 2, the fail-closed form): each member's boolean revealDm /
--       allowImport, and when a veil was applied the served marker {v: 2, mode, at, groupings}. No
--       delta (a hand-hidden house's id), no frozen copy, no unknown key; a `$veil` that is not an
--       object never raises. The client reads v 2 as "applied": it re-applies only the groupings
--       (removal, idempotent) and marks them for DefenseTab; it never re-applies the default rules.
--       No client path writes v 2 back: the only writer, updateGalleryMetadata, clamps to v 1.
--
-- NOT CHANGED: _gallery_sanitize_public_json, _gallery_dm_full_json, _gallery_apply_member_overrides,
-- the other four party-link functions, every grant (restated as they stood). No table, column,
-- constraint, policy or row. Every invisible character is spelled as an escape (low finding 4).
--
-- COUPLED CLIENT TWIN: src/domain/display/galleryVeil.js (projectServedVeil, VEIL_LIMITS.servedVersion)
-- and src/lib/gallery.js (sanitizeDossier). PINNED BY EXECUTION: tests/security/galleryServerVeil.pglite.test.js
-- (the real SQL against the real client page: nothing carried, no page changed, 210 as the red control).
--
-- @rollback: undo 211 FIRST, before 210, 207, 206, 205 and 208's set: recreate get_gallery_dossier at
--   147's body, get_unlisted_dossier at 208's (as amended), get_gallery_map at 088's and
--   import_gallery_dossier at 131's, then drop the _gallery_veil* functions. No row is written or lost
--   either way; the new client draws a v 1 share as before, so no client rollback goes with it.

-- ── 1. THE VEIL'S CONSTANTS (galleryVeil.js CARD_KINDS, GROUPING_REMOVERS, VEILED_PUBLIC_PROSE) ──
-- Character-identical to the client's tables; tests/security/galleryServerVeil.pglite.test.js
-- reads this function and the client's exports and compares them field for field.
create or replace function public._gallery_veil_kinds()
returns jsonb language sql immutable set search_path = public, pg_temp as $$
  select '{
    "npc": {
      "lists": [["npcs"], ["powerStructure", "factions", "*", "members"], ["factions", "*", "members"]],
      "floor": ["id", "name", "role", "title", "category", "gender", "presentation", "memberships", "influence"],
      "fields": {
        "personality": ["personality"], "physical": ["physical"], "goals": ["goal", "goals"],
        "constraint": ["activeConstraint"], "whereabouts": ["whereabouts", "location", "currentLocation"],
        "secret": ["secret"], "ties": ["relationships", "institution", "linkedInstitutionIds"],
        "hooks": ["plotHooks"], "corruption": ["allegiance", "corrupt", "corruptionVector", "corruptTies"]
      }
    },
    "institution": {
      "lists": [["institutions"]],
      "floor": ["id", "name", "category", "priorityCategory", "catalogId", "tier"],
      "fields": {
        "description": ["desc", "description"], "function": ["tags", "facets", "serviceKeys"],
        "services": [], "people": []
      }
    },
    "faction": {
      "lists": [["powerStructure", "factions"], ["factions"]],
      "floor": ["id", "faction", "name", "category", "power", "rawPower", "powerLabel", "isGoverning"],
      "fields": {
        "description": ["desc", "description", "crisisNote"], "goals": ["goals", "goal", "agenda"],
        "conflicts": ["conflicts"], "members": ["members"], "capture": ["captureState"]
      }
    },
    "event": {
      "lists": [["history", "historicalEvents"], ["history", "eventsTimeline"]],
      "floor": ["id", "name", "title", "type", "templateType", "yearsAgo", "year", "era", "severity"],
      "fields": { "description": ["description", "desc"], "lastingEffects": ["lastingEffects"], "hooks": ["plotHooks"] }
    },
    "tension": {
      "lists": [["history", "currentTensions"]],
      "floor": ["id", "name", "title", "type", "factions", "severity"],
      "fields": { "description": ["description", "desc"], "lastingEffects": ["lastingEffects"], "hooks": ["plotHooks"] }
    },
    "conflict": {
      "lists": [["conflicts"], ["powerStructure", "conflicts"]],
      "floor": ["id", "parties", "issue", "intensity"],
      "fields": { "stakes": ["stakes"], "description": ["desc", "description"], "hooks": ["plotHooks"] }
    },
    "relationship": {
      "lists": [["relationships"]],
      "floor": ["id", "type", "typeName", "strength", "from", "to", "npc1Name", "npc2Name", "npc1Role", "npc2Role"],
      "fields": { "tension": ["tension"], "description": ["description"], "hooks": ["plotHooks"] }
    }
  }'::jsonb
$$;

-- The card kinds in the client's iteration order (Object.keys(CARD_KINDS)).
create or replace function public._gallery_veil_kind_order()
returns text[] language sql immutable set search_path = public, pg_temp as $$
  select array['npc', 'institution', 'faction', 'event', 'tension', 'conflict', 'relationship']
$$;

-- The hideable groupings (GROUPING_REMOVERS' keys), the twelve static defaults in the client's order.
create or replace function public._gallery_veil_groupings()
returns text[] language sql immutable set search_path = public, pg_temp as $$
  select array['tab:plot_hooks', 'block:services.criminal', 'block:defense.criminalStructure',
    'block:power.criminalUnderside', 'block:defense.vulnerabilities', 'block:rumors.dmTruth',
    'block:war.truthVsBelief', 'block:housekeeping.structuralIssues', 'block:housekeeping.coherenceNotes',
    'block:housekeeping.firstSurvey', 'block:housekeeping.receipt', 'block:housekeeping.decrees']
$$;

-- ── 2. THE CLIENT'S SMALL READERS, one SQL function each ─────────────────────────────────────
-- str(v): the string, else ''.
create or replace function public._gallery_veil_str(j jsonb)
returns text language sql immutable set search_path = public, pg_temp as $$
  select case when jsonb_typeof(j) = 'string' then j #>> '{}' else '' end
$$;

-- JS truthiness of a JSON value (absent, null, false, '' and 0 are falsy).
create or replace function public._gallery_veil_truthy(j jsonb)
returns boolean language sql immutable set search_path = public, pg_temp as $$
  select case jsonb_typeof(j)
    when 'string' then (j #>> '{}') <> ''
    when 'number' then (j #>> '{}')::numeric <> 0
    when 'boolean' then (j #>> '{}')::boolean
    when 'object' then true
    when 'array' then true
    else false end
$$;

-- String(v) of a JSON value (Array.prototype.join for arrays: null elements read '').
create or replace function public._gallery_veil_jsstr(j jsonb)
returns text language sql immutable set search_path = public, pg_temp as $$
  select case jsonb_typeof(j)
    when 'string' then j #>> '{}'
    when 'number' then case
      when (j #>> '{}')::numeric = trunc((j #>> '{}')::numeric) and abs((j #>> '{}')::numeric) < 1e21
        then trunc((j #>> '{}')::numeric)::text
      else ((j #>> '{}')::float8)::text end
    when 'boolean' then j #>> '{}'
    when 'object' then '[object Object]'
    when 'array' then coalesce((select string_agg(case when jsonb_typeof(e) = 'null' then '' else public._gallery_veil_jsstr(e) end, ',' order by o)
                                  from jsonb_array_elements(j) with ordinality x(e, o)), '')
    when 'null' then 'null'
    else '' end
$$;

-- The first truthy of up to three values (a || b || c), as JSON.
create or replace function public._gallery_veil_or(a jsonb, b jsonb, c jsonb default null)
returns jsonb language sql immutable set search_path = public, pg_temp as $$
  select case when public._gallery_veil_truthy(a) then a when public._gallery_veil_truthy(b) then b else c end
$$;

-- ASCII-only lower case. Every other character the slug keeps is ASCII, and the two characters whose
-- JS lower case IS ASCII (U+0130 and U+212A) are spelled out before it (computed over all code points).
create or replace function public._gallery_veil_lower(v text)
returns text language sql immutable set search_path = public, pg_temp as $$
  select translate(replace(replace(v, U&'\0130', U&'i\0307'), U&'\212A', 'k'),
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')
$$;

-- slugifyEntity (kernel/slugify.js with sep '-', max 80, fallback and empty 'unknown').
create or replace function public._gallery_veil_slug(v text)
returns text language sql immutable set search_path = public, pg_temp as $$
  select coalesce(nullif(left(regexp_replace(regexp_replace(
    public._gallery_veil_lower(coalesce(nullif(v, ''), 'unknown')), '[^a-z0-9]+', '-', 'g'), '^-+|-+$', '', 'g'), 80), ''), 'unknown')
$$;

-- factionIdFromName's snakeCase (non-alphanumeric runs to '_', trimmed, lower-cased).
create or replace function public._gallery_veil_snake(v text)
returns text language sql immutable set search_path = public, pg_temp as $$
  select lower(regexp_replace(regexp_replace(coalesce(v, ''), '[^a-zA-Z0-9]+', '_', 'g'), '^_+|_+$', '', 'g'))
$$;

-- ownIdOr(card, prefix, ...parts): the card's own string id, else prefix.slug(parts joined by '-').
create or replace function public._gallery_veil_own_id(c jsonb, prefix text, parts jsonb)
returns text language sql immutable set search_path = public, pg_temp as $$
  select coalesce(nullif(public._gallery_veil_str(c -> 'id'), ''),
    prefix || '.' || public._gallery_veil_slug(coalesce((
      select string_agg(t, '-' order by o) from (
        select o, case when jsonb_typeof(p) = 'array'
          then (select coalesce(string_agg(case when jsonb_typeof(e) = 'null' then '' else public._gallery_veil_jsstr(e) end, '-' order by eo), '')
                  from jsonb_array_elements(p) with ordinality y(e, eo))
          else public._gallery_veil_str(p) end as t
        from jsonb_array_elements(parts) with ordinality x(p, o)) q
      where t <> ''), '')))
$$;

-- The id the veil addresses a card by (CARD_KINDS[kind].idOf). NULL only for an anonymous legacy
-- event (no string id, no name, title or label): the client hashes it, and the server reads it
-- FAIL-CLOSED (every eye addressed to any legacy event applies to it; see _gallery_veil_card).
create or replace function public._gallery_veil_card_id(kind text, c jsonb)
returns text language plpgsql immutable set search_path = public, pg_temp as $$
declare
  f text;
  n jsonb;
begin
  if kind = 'npc' then return public._gallery_npc_key(c); end if;
  if kind = 'institution' then
    if public._gallery_veil_truthy(c -> 'id') then return public._gallery_veil_jsstr(c -> 'id'); end if;
    if public._gallery_veil_truthy(c -> 'refId') then return public._gallery_veil_jsstr(c -> 'refId'); end if;
    n := public._gallery_veil_or(c -> 'name', c -> 'label');
    return public._gallery_veil_slug(case when n is null then 'institution' else public._gallery_veil_jsstr(n) end);
  end if;
  if kind = 'faction' then
    f := coalesce(nullif(public._gallery_veil_str(c -> 'faction'), ''), public._gallery_veil_str(c -> 'name'));
    if f <> '' then return 'faction.' || public._gallery_veil_snake(f); end if;
    return public._gallery_veil_own_id(c, 'faction', jsonb_build_array(c -> 'name'));
  end if;
  if kind = 'event' then
    if public._gallery_veil_str(c -> 'id') <> '' then return c ->> 'id'; end if;
    n := public._gallery_veil_or(c -> 'name', c -> 'title', c -> 'label');
    if n is not null then return 'event.' || public._gallery_veil_slug(public._gallery_veil_jsstr(n)); end if;
    return null;
  end if;
  if kind = 'tension' then
    return public._gallery_veil_own_id(c, 'tension', jsonb_build_array(public._gallery_veil_or(c -> 'name', c -> 'title', c -> 'type')));
  end if;
  if kind = 'conflict' then
    return public._gallery_veil_own_id(c, 'conflict', jsonb_build_array(c -> 'parties', c -> 'issue'));
  end if;
  if kind = 'relationship' then
    return public._gallery_veil_own_id(c, 'relationship', jsonb_build_array(
      public._gallery_veil_or(c -> 'from', c -> 'npc1Name'), public._gallery_veil_or(c -> 'to', c -> 'npc2Name'), c -> 'type'));
  end if;
  return null;
end $$;

-- declaredFacet (cohesionWeave.js): a facets{} string value, else the first `facet:<kind>:<value>` tag.
create or replace function public._gallery_veil_facet(e jsonb, k text)
returns text language sql immutable set search_path = public, pg_temp as $$
  select coalesce(
    case when jsonb_typeof(e -> 'facets') = 'object' and jsonb_typeof(e -> 'facets' -> k) = 'string'
         and (e -> 'facets' ->> k) <> '' then e -> 'facets' ->> k end,
    (select substr(t #>> '{}', length('facet:' || k || ':') + 1)
       from jsonb_array_elements(case when jsonb_typeof(e -> 'tags') = 'array' then e -> 'tags' else '[]' end) with ordinality x(t, o)
      where jsonb_typeof(t) = 'string' and left(t #>> '{}', length('facet:' || k || ':')) = 'facet:' || k || ':'
        and length(t #>> '{}') > length('facet:' || k || ':')
      order by o limit 1))
$$;

-- isHideableHouse (people/cardVeil.js): criminal, clandestine (declared facets; the inference tables
-- hold no row for these three kinds), or an illegal information brokerage.
create or replace function public._gallery_veil_house(i jsonb)
returns boolean language sql immutable set search_path = public, pg_temp as $$
  select coalesce(public._gallery_veil_lower(public._gallery_veil_str(i -> 'category')) = 'criminal'
      or public._gallery_veil_lower(public._gallery_veil_str(i -> 'priorityCategory')) = 'criminal'
      or public._gallery_veil_facet(i, 'clandestine') = 'clandestine'
      or public._gallery_veil_facet(i, 'institutionFunction') = 'clandestine'
      or public._gallery_veil_facet(i, 'subterranean') = 'subterranean'
      or (jsonb_typeof(i -> 'serviceKeys') = 'array' and jsonb_typeof(i -> 'tags') = 'array'
          and exists (select 1 from jsonb_array_elements(i -> 'serviceKeys') k
                       where k in ('"info_calibration"', '"info_query"', '"info_feed"', '"info_plant"'))
          and i -> 'tags' @> '["brokerage"]' and i -> 'tags' @> '["criminal"]'), false)
$$;

-- The card's house (cardHouseOf || str(npc.institution)).
create or replace function public._gallery_veil_npc_house(n jsonb)
returns text language sql immutable set search_path = public, pg_temp as $$
  select case
    when jsonb_typeof(n -> 'institution') = 'object' and n -> 'institution' -> 'kind' = '"house"'
         and public._gallery_veil_or(n -> 'institution' -> 'key', n -> 'institution' -> 'name') is not null
      then public._gallery_veil_jsstr(public._gallery_veil_or(n -> 'institution' -> 'key', n -> 'institution' -> 'name'))
    else public._gallery_veil_str(n -> 'institution') end
$$;

-- JS string length (UTF-16 code units).
create or replace function public._gallery_veil_jslen(v text)
returns integer language sql immutable set search_path = public, pg_temp as $$
  select char_length(v) + (select count(*)::int from regexp_matches(v, U&'[\+010000-\+10FFFF]', 'g'))
$$;

-- parseVeilAddress: {type, kind, id, field} or NULL.
create or replace function public._gallery_veil_parse(a text)
returns jsonb language plpgsql immutable set search_path = public, pg_temp as $$
declare
  i int; j int; k int; head text; rest text; tail text;
begin
  if a is null or a = '' or public._gallery_veil_jslen(a) > 300 then return null; end if;
  i := position(':' in a);
  if i <= 1 then return null; end if;
  head := left(a, i - 1);
  rest := substr(a, i + 1);
  if rest = '' then return null; end if;
  if head in ('tab', 'block') then return jsonb_build_object('type', head, 'id', rest); end if;
  if head = 'class' then
    j := position(':' in rest);
    if j <= 1 or j = length(rest) then return null; end if;
    return jsonb_build_object('type', 'class', 'kind', left(rest, j - 1), 'field', substr(rest, j + 1));
  end if;
  if head in ('card', 'field') then
    j := position(':' in rest);
    if j <= 1 then return null; end if;
    tail := substr(rest, j + 1);
    if tail = '' then return null; end if;
    if head = 'card' then return jsonb_build_object('type', 'card', 'kind', left(rest, j - 1), 'id', tail); end if;
    k := position(':' in reverse(tail));
    if k = 0 then return null; end if;
    k := length(tail) - k + 1;
    if k <= 1 or k = length(tail) then return null; end if;
    return jsonb_build_object('type', 'field', 'kind', left(rest, j - 1), 'id', left(tail, k - 1), 'field', substr(tail, k + 1));
  end if;
  return null;
end $$;

-- isHideable(address) with no settlement (the resolver's form).
create or replace function public._gallery_veil_hideable(a text)
returns boolean language plpgsql immutable set search_path = public, pg_temp as $$
declare
  p jsonb := public._gallery_veil_parse(a);
  kd jsonb;
begin
  if p is null then return false; end if;
  if p ->> 'type' in ('field', 'class') then
    kd := public._gallery_veil_kinds() -> (p ->> 'kind');
    if kd is null then return false; end if;
    if kd -> 'floor' ? (p ->> 'field') then return false; end if;
    if kd -> 'fields' ? (p ->> 'field')
       and exists (select 1 from jsonb_array_elements_text(kd -> 'fields' -> (p ->> 'field')) k where kd -> 'floor' ? k) then
      return false;
    end if;
    return true;
  end if;
  if p ->> 'type' = 'card' then return p ->> 'kind' = 'institution'; end if;
  return a = any(public._gallery_veil_groupings());
end $$;

-- cardsOf(s, kind): every record of the kind, with the path of its list and its index there.
create or replace function public._gallery_veil_cards(s jsonb, kind text)
returns table (list text[], owner_idx int, idx int, card jsonb)
language sql immutable set search_path = public, pg_temp as $$
  with paths as (
    select array(select jsonb_array_elements_text(p)) as path
      from jsonb_array_elements(public._gallery_veil_kinds() -> kind -> 'lists') p
  )
  select path, null::int, (o - 1)::int, e
    from paths, jsonb_array_elements(case when jsonb_typeof(s #> path) = 'array' and not ('*' = any(path)) then s #> path else '[]' end) with ordinality x(e, o)
   where jsonb_typeof(e) = 'object'
  union all
  select path, (oo - 1)::int, (o - 1)::int, e
    from paths,
         jsonb_array_elements(case when '*' = any(path) and jsonb_typeof(s #> path[1:array_position(path, '*') - 1]) = 'array'
                                   then s #> path[1:array_position(path, '*') - 1] else '[]' end) with ordinality w(own, oo),
         jsonb_array_elements(case when jsonb_typeof(own) = 'object' and jsonb_typeof(own #> path[array_position(path, '*') + 1:]) = 'array'
                                   then own #> path[array_position(path, '*') + 1:] else '[]' end) with ordinality x(e, o)
   where '*' = any(path) and jsonb_typeof(e) = 'object'
$$;

-- dropHookKeys: every key matching /hook/i, at any depth.
create or replace function public._gallery_veil_drop_hooks(j jsonb)
returns jsonb language sql immutable set search_path = public, pg_temp as $$
  select case jsonb_typeof(j)
    when 'array' then (select coalesce(jsonb_agg(public._gallery_veil_drop_hooks(e) order by o), '[]') from jsonb_array_elements(j) with ordinality x(e, o))
    when 'object' then (select coalesce(jsonb_object_agg(k, public._gallery_veil_drop_hooks(v)), '{}') from jsonb_each(j) x(k, v) where k !~* 'hook')
    else j end
$$;

-- The three house classes, apart (the defaults read them one by one).
create or replace function public._gallery_veil_criminal(i jsonb)
returns boolean language sql immutable set search_path = public, pg_temp as $$
  select public._gallery_veil_lower(public._gallery_veil_str(i -> 'category')) = 'criminal'
      or public._gallery_veil_lower(public._gallery_veil_str(i -> 'priorityCategory')) = 'criminal'
$$;
create or replace function public._gallery_veil_clandestine(i jsonb)
returns boolean language sql immutable set search_path = public, pg_temp as $$
  select coalesce(public._gallery_veil_facet(i, 'clandestine') = 'clandestine'
      or public._gallery_veil_facet(i, 'institutionFunction') = 'clandestine'
      or public._gallery_veil_facet(i, 'subterranean') = 'subterranean', false)
$$;
create or replace function public._gallery_veil_illegal_brokerage(i jsonb)
returns boolean language sql immutable set search_path = public, pg_temp as $$
  select coalesce(jsonb_typeof(i -> 'serviceKeys') = 'array' and jsonb_typeof(i -> 'tags') = 'array'
     and exists (select 1 from jsonb_array_elements(i -> 'serviceKeys') k
                  where k in ('"info_calibration"', '"info_query"', '"info_feed"', '"info_plant"'))
     and i -> 'tags' @> '["brokerage"]' and i -> 'tags' @> '["criminal"]', false)
$$;

-- ── 3. THE RESOLVER (defaultVeilFor + readShareVeil + resolveVeil) ─────────────────────────
-- {hidden: [...], except: [...]}, or NULL for an unmarked share read as a listing (the page is
-- unchanged). `link`: the party link's R4 — an unmarked share takes the default veil.
create or replace function public._gallery_veil_resolve(pub jsonb, overrides jsonb, link boolean)
returns jsonb language plpgsql immutable set search_path = public, pg_temp as $$
declare
  ov jsonb := case when jsonb_typeof(overrides) = 'object' then overrides else '{}'::jsonb end;
  marked boolean := coalesce(jsonb_typeof(ov -> '$veil') = 'object', false);
  s jsonb := case when jsonb_typeof(pub) = 'object' then pub else '{}'::jsonb end;
  out jsonb;
begin
  if not marked and not link then return null; end if;
  with
  insts as (
    select card as i, public._gallery_veil_card_id('institution', card) as id
      from public._gallery_veil_cards(s, 'institution')
  ),
  defaults as (
    select unnest(public._gallery_veil_groupings()) as a
    union
    select x.a from insts, lateral (
      select unnest(array['card:institution:' || id, 'field:institution:' || id || ':description',
        'field:institution:' || id || ':function', 'field:institution:' || id || ':services']) as a
       where public._gallery_veil_illegal_brokerage(i) or public._gallery_veil_clandestine(i) or public._gallery_veil_criminal(i)
      union all
      select 'field:institution:' || id || ':people' where public._gallery_veil_criminal(i)
    ) x
    union
    select 'field:faction:' || public._gallery_veil_card_id('faction', card) || ':' || f
      from public._gallery_veil_cards(s, 'faction'), unnest(array['members', 'goals', 'conflicts', 'description']) f
     where public._gallery_veil_lower(public._gallery_veil_str(card -> 'category')) = 'criminal'
    union
    select 'class:npc:secret'
     where exists (select 1 from jsonb_array_elements(case when jsonb_typeof(s -> 'npcs') = 'array' then s -> 'npcs' else '[]' end) n
                    where jsonb_typeof(n) = 'object' and coalesce(n -> 'secret', 'null') <> 'null')
    union
    select 'class:npc:corruption'
     where exists (select 1 from jsonb_array_elements(case when jsonb_typeof(s -> 'npcs') = 'array' then s -> 'npcs' else '[]' end) n
                    where jsonb_typeof(n) = 'object'
                      and (coalesce(n -> 'allegiance', 'null') <> 'null' or coalesce(n -> 'corrupt', 'null') <> 'null'
                        or coalesce(n -> 'corruptionVector', 'null') <> 'null' or coalesce(n -> 'corruptTies', 'null') <> 'null'))
    union
    select 'class:' || k || ':hooks'
      from unnest(array['npc', 'event', 'tension', 'conflict', 'relationship']) k
     where exists (select 1 from public._gallery_veil_cards(s, k) c where coalesce(c.card -> 'plotHooks', 'null') <> 'null')
  ),
  card_deltas as (
    select 'card:npc:' || k as address, true as hidden, o::bigint as ord
      from jsonb_each(ov) with ordinality x(k, v, o)
     where k <> '$veil' and jsonb_typeof(v) = 'object' and v -> 'revealDm' = 'false'::jsonb
  ),
  stored_raw as (
    select e ->> 'address' as address, (e ->> 'hidden')::boolean as hidden, o::bigint as ord
      from jsonb_array_elements(case when marked and jsonb_typeof(ov -> '$veil' -> 'deltas') = 'array'
                                     then ov -> '$veil' -> 'deltas' else '[]' end) with ordinality x(e, o)
     where jsonb_typeof(e) = 'object' and jsonb_typeof(e -> 'hidden') = 'boolean'
       and jsonb_typeof(e -> 'address') = 'string' and public._gallery_veil_parse(e ->> 'address') is not null
  ),
  stored_last as (
    select distinct on (address) address, hidden, ord from stored_raw order by address, ord desc
  ),
  stored as (
    select address, hidden, 1000000000 + ord as ord from (
      select *, row_number() over (order by ord desc) as rn from stored_last) q
     where rn <= 2000
  ),
  deltas as (select * from card_deltas union all select * from stored),
  targets as (
    select t, d.hidden, d.ord
      from deltas d, lateral (select public._gallery_veil_parse(d.address) as p) pp,
      lateral (
        select 'field:' || (p ->> 'kind') || ':' || (p ->> 'id') || ':' || f as t
          from jsonb_object_keys(coalesce(public._gallery_veil_kinds() -> (p ->> 'kind') -> 'fields', '{}')) f
         where p ->> 'type' = 'card' and p ->> 'kind' <> 'institution'
        union all
        select d.address where not (p ->> 'type' = 'card' and p ->> 'kind' <> 'institution')
      ) tt
     where public._gallery_veil_hideable(t)
  ),
  last as (select distinct on (t) t, hidden from targets order by t, ord desc)
  select jsonb_build_object(
    'hidden', coalesce((select jsonb_agg(a) from (
        select a from defaults where public._gallery_veil_hideable(a) and a not in (select t from last where not hidden)
        union
        select t from last where hidden) h), '[]'),
    'except', coalesce((select jsonb_agg(t) from last where not hidden and t like 'field:%'), '[]'))
    into out;
  return out;
end $$;

-- ── 4. THE APPLIER (applyVeil, removal only) ────────────────────────────────────────────────
-- One card through its class switches and its own eyes. `id` NULL is an anonymous legacy event:
-- every eye addressed to any legacy event applies, and no exception does (fail-closed).
create or replace function public._gallery_veil_card(kind text, c jsonb, cls jsonb, byid jsonb, excj jsonb)
returns jsonb language plpgsql immutable set search_path = public, pg_temp as $$
declare
  kd jsonb := public._gallery_veil_kinds() -> kind;
  id text := public._gallery_veil_card_id(kind, c);
  f text;
  own jsonb;
  drops text[] := array[]::text[];
begin
  if jsonb_typeof(cls) is distinct from 'array' then cls := '[]'; end if;
  if jsonb_typeof(byid) is distinct from 'object' then byid := '{}'; end if;
  for f in select jsonb_array_elements_text(cls) loop
    if id is null or not (excj ? ('field:' || kind || ':' || id || ':' || f)) then drops := drops || f; end if;
  end loop;
  if id is null then
    own := (select jsonb_agg(x) from jsonb_each(byid) e(k, v), jsonb_array_elements(v) x where k like 'event.legacy-%');
  else
    own := byid -> id;
  end if;
  drops := drops || array(select jsonb_array_elements_text(coalesce(own, '[]')));
  return c - array(
    select k from unnest(drops) f2,
      lateral (select jsonb_array_elements_text(case when kd -> 'fields' ? f2 then kd -> 'fields' -> f2 else jsonb_build_array(f2) end) k) kk
     where not (kd -> 'floor' ? k));
end $$;

-- Rebuild every list of one kind through a per-card function chosen by `mode`
-- ('eyes': _gallery_veil_card; 'npc': the people / gone-house pass).
create or replace function public._gallery_veil_map(s jsonb, kind text, mode text, a jsonb)
returns jsonb language plpgsql immutable set search_path = public, pg_temp as $$
declare
  path text[];
  star int;
  pre text[];
  suf text[];
  arr jsonb;
begin
  for path in select array(select jsonb_array_elements_text(p)) from jsonb_array_elements(public._gallery_veil_kinds() -> kind -> 'lists') p loop
    star := array_position(path, '*');
    if star is null then
      arr := s #> path;
      if jsonb_typeof(arr) = 'array' and jsonb_array_length(arr) > 0 then
        s := jsonb_set(s, path, public._gallery_veil_map_list(arr, kind, mode, a));
      end if;
    else
      pre := path[1:star - 1];
      suf := path[star + 1:];
      arr := s #> pre;
      if jsonb_typeof(arr) = 'array' and jsonb_array_length(arr) > 0 then
        s := jsonb_set(s, pre, (
          select jsonb_agg(case when jsonb_typeof(own) = 'object' and jsonb_typeof(own #> suf) = 'array' and jsonb_array_length(own #> suf) > 0
                                then jsonb_set(own, suf, public._gallery_veil_map_list(own #> suf, kind, mode, a)) else own end order by o)
            from jsonb_array_elements(arr) with ordinality x(own, o)));
      end if;
    end if;
  end loop;
  return s;
end $$;

-- An NPC card after the house passes: its link to a house whose people are veiled, then (X-21e)
-- every reference to a house removed whole.
create or replace function public._gallery_veil_npc_pass(n jsonb, a jsonb)
returns jsonb language plpgsql immutable set search_path = public, pg_temp as $$
declare
  houses jsonb := coalesce(a -> 'gone_houses', '{}');
  ids jsonb := coalesce(a -> 'gone_ids', '{}');
  k text;
  v jsonb;
begin
  if coalesce(a -> 'people', '{}') ? public._gallery_veil_npc_house(n) then n := n - 'institution'; end if;
  if houses <> '{}' or ids <> '{}' then
    if houses ? public._gallery_veil_npc_house(n) then n := n - 'institution'; end if;
    for k, v in select * from jsonb_each(n) loop
      if k not in ('id', 'name') and jsonb_typeof(v) = 'string' and houses ? (v #>> '{}') then n := n - k; end if;
    end loop;
    if jsonb_typeof(n -> 'linkedInstitutionIds') = 'array' then
      n := jsonb_set(n, '{linkedInstitutionIds}', coalesce((
        select jsonb_agg(e order by o) from jsonb_array_elements(n -> 'linkedInstitutionIds') with ordinality x(e, o)
         where not (ids ? public._gallery_veil_str(e) or houses ? public._gallery_veil_str(e))), '[]'));
    end if;
  end if;
  return n;
end $$;

create or replace function public._gallery_veil_map_list(arr jsonb, kind text, mode text, a jsonb)
returns jsonb language sql immutable set search_path = public, pg_temp as $$
  select jsonb_agg(case when jsonb_typeof(e) <> 'object' then e
    when mode = 'eyes' then public._gallery_veil_card(kind, e, a -> 'cls', a -> 'byid', a -> 'exc')
    else public._gallery_veil_npc_pass(e, a) end order by o)
  from jsonb_array_elements(arr) with ordinality x(e, o)
$$;

-- One grouping's removal (GROUPING_REMOVERS), and the prose rungs it covers (VEILED_PUBLIC_PROSE).
create or replace function public._gallery_veil_grouping(s jsonb, g text)
returns jsonb language plpgsql immutable set search_path = public, pg_temp as $$
begin
  if g = 'tab:plot_hooks' then
    -- the walk runs only where a key matches /hook/i at all (the sanitiser already strips most):
    -- the question is asked once over the whole document, in C
    if not jsonb_path_exists(s, 'lax $.** ? (@.type() == "object").keyvalue() ? (@.key like_regex "hook" flag "i")') then return s; end if;
    return (select coalesce(jsonb_object_agg(k, case when k in ('id', 'name', 'tier', 'population', 'config') then v
                                                     else public._gallery_veil_drop_hooks(v) end), '{}')
              from jsonb_each(s) x(k, v)
             where k in ('id', 'name', 'tier', 'population', 'config') or k !~* 'hook');
  elsif g = 'block:services.criminal' then
    if jsonb_typeof(s -> 'availableServices') = 'object' then
      s := jsonb_set(s, '{availableServices}', (s -> 'availableServices') - 'criminal');
    end if;
  elsif g = 'block:defense.criminalStructure' then
    if jsonb_typeof(s -> 'economicState') = 'object' and jsonb_typeof(s #> '{economicState,safetyProfile}') = 'object' then
      s := jsonb_set(s, '{economicState,safetyProfile}', (s #> '{economicState,safetyProfile}') - array['criminalInstitutions', 'crimeTypes']);
    end if;
  elsif g = 'block:power.criminalUnderside' then
    if jsonb_typeof(s -> 'powerStructure') = 'object' then
      s := jsonb_set(s, '{powerStructure}', (s -> 'powerStructure') - 'criminalCaptureState');
      if jsonb_typeof(s #> '{powerStructure,factions}') = 'array' then
        s := jsonb_set(s, '{powerStructure,factions}', (select coalesce(jsonb_agg(case when jsonb_typeof(e) = 'object' then e - 'captureState' else e end order by o), '[]')
                                                         from jsonb_array_elements(s #> '{powerStructure,factions}') with ordinality x(e, o)));
      end if;
      if jsonb_typeof(s #> '{powerStructure,factionRelationships}') = 'array' then
        s := jsonb_set(s, '{powerStructure,factionRelationships}', (select coalesce(jsonb_agg(case when jsonb_typeof(e) = 'object' then e - 'captureState' else e end order by o), '[]')
                                                                     from jsonb_array_elements(s #> '{powerStructure,factionRelationships}') with ordinality x(e, o)));
      end if;
    end if;
    if jsonb_typeof(s -> 'economicState') = 'object' and jsonb_typeof(s #> '{economicState,safetyProfile}') = 'object' then
      s := jsonb_set(s, '{economicState,safetyProfile}', (s #> '{economicState,safetyProfile}') - 'blackMarketCapture');
    end if;
  elsif g = 'block:defense.vulnerabilities' then
    if jsonb_typeof(s -> 'structuralViolations') = 'array' then
      s := jsonb_set(s, '{structuralViolations}', (select coalesce(jsonb_agg(e order by o), '[]')
        from jsonb_array_elements(s -> 'structuralViolations') with ordinality x(e, o)
       where not (jsonb_typeof(e) = 'object' and jsonb_typeof(e -> 'reason') = 'string'
                  and (e ->> 'reason') ~* 'fort|milit|wall|garrison|defense|guard|structural|survival')));
    end if;
  elsif g = 'block:housekeeping.structuralIssues' then
    s := s - array['structuralViolations', 'structuralSuggestions'];
  elsif g = 'block:housekeeping.coherenceNotes' then
    s := s - 'coherenceNotes';
  elsif g = 'block:housekeeping.receipt' then
    s := s - 'generationCoherenceReceipt';
  elsif g = 'block:housekeeping.decrees' then
    s := s - array['decrees', 'dmLayer'];
  end if;
  -- the prose rungs (dropVeiledPublicProse)
  if jsonb_typeof(s -> 'publicProse') = 'object' and jsonb_typeof(s #> '{publicProse,blocks}') = 'object' then
    if g = 'block:defense.criminalStructure' and (s #> '{publicProse,blocks}') ? 'defense:criminal' then
      s := s #- '{publicProse,blocks,defense:criminal}';
    elsif g = 'block:power.criminalUnderside' and jsonb_typeof(s #> '{publicProse,blocks,power:desk}') = 'object' then
      s := jsonb_set(s, '{publicProse,blocks,power:desk}',
        (s #> '{publicProse,blocks,power:desk}') - array['legitimacyReading', 'captureReading', 'operationReading', 'gmAdvisory']);
    end if;
  end if;
  return s;
end $$;

create or replace function public._gallery_veil_apply(pub jsonb, hidden jsonb, exc jsonb)
returns jsonb language plpgsql immutable set search_path = public, pg_temp as $$
declare
  s jsonb := case when jsonb_typeof(pub) = 'object' then pub else '{}'::jsonb end;
  excj jsonb := coalesce((select jsonb_object_agg(e, true) from jsonb_array_elements_text(exc) e), '{}');
  parsed jsonb;
  groupings text[];
  card_hides jsonb;
  classes jsonb;
  fields jsonb;
  gone_ids jsonb := '{}';
  gone_houses jsonb := '{}';
  services_of jsonb;
  people_of jsonb := '{}';
  r record;
  kind text;
  g text;
  veiled_services boolean;
  veiled_people boolean;
begin
  select jsonb_agg(jsonb_build_object('a', a) || public._gallery_veil_parse(a) order by o) into parsed
    from jsonb_array_elements_text(hidden) with ordinality x(a, o)
   where public._gallery_veil_hideable(a);
  parsed := coalesce(parsed, '[]');
  groupings := array(select p ->> 'a' from jsonb_array_elements(parsed) with ordinality x(p, o) where p ->> 'type' in ('tab', 'block') order by o);
  card_hides := coalesce((select jsonb_object_agg(p ->> 'id', true) from jsonb_array_elements(parsed) p where p ->> 'type' = 'card'), '{}');
  classes := coalesce((select jsonb_object_agg(k, fs) from (
      select p ->> 'kind' as k, jsonb_agg(distinct p ->> 'field') as fs from jsonb_array_elements(parsed) p
       where p ->> 'type' = 'class' group by 1) q), '{}');
  fields := coalesce((select jsonb_object_agg(k, ids) from (
      select k, jsonb_object_agg(i, fs) as ids from (
        select p ->> 'kind' as k, p ->> 'id' as i, jsonb_agg(distinct p ->> 'field') as fs from jsonb_array_elements(parsed) p
         where p ->> 'type' = 'field' group by 1, 2) q1 group by 1) q2), '{}');

  -- X-21e: a card-hidden house goes whole only when the data puts it in the class.
  if card_hides <> '{}' then
    for r in select c.card, public._gallery_veil_card_id('institution', c.card) as id from public._gallery_veil_cards(s, 'institution') c loop
      if not (card_hides ? r.id) then continue; end if;
      if public._gallery_veil_house(r.card) then
        gone_ids := gone_ids || jsonb_build_object(r.id, true);
        if public._gallery_veil_str(r.card -> 'name') <> '' then
          gone_houses := gone_houses || jsonb_build_object(r.card ->> 'name', true);
        end if;
      else
        fields := jsonb_set(fields, '{institution}', coalesce(fields -> 'institution', '{}'));
        fields := jsonb_set(fields, array['institution', r.id], (select jsonb_agg(distinct f) from (
          select jsonb_array_elements_text(coalesce(fields #> array['institution', r.id], '[]')) f
          union select unnest(array['description', 'function', 'services', 'people'])) u));
      end if;
    end loop;
  end if;

  -- the virtual institution eyes, read before any card is touched
  services_of := gone_houses;
  for r in select c.card, public._gallery_veil_card_id('institution', c.card) as id from public._gallery_veil_cards(s, 'institution') c loop
    if public._gallery_veil_str(r.card -> 'name') = '' then continue; end if;
    veiled_services := coalesce(fields #> array['institution', r.id], '[]') ? 'services'
      or (coalesce(classes -> 'institution', '[]') ? 'services' and not (excj ? ('field:institution:' || r.id || ':services')));
    veiled_people := coalesce(fields #> array['institution', r.id], '[]') ? 'people'
      or (coalesce(classes -> 'institution', '[]') ? 'people' and not (excj ? ('field:institution:' || r.id || ':people')));
    if veiled_services then services_of := services_of || jsonb_build_object(r.card ->> 'name', true); end if;
    if veiled_people then people_of := people_of || jsonb_build_object(r.card ->> 'name', true); end if;
  end loop;

  -- cards: class switches, then per-card eyes
  foreach kind in array public._gallery_veil_kind_order() loop
    if classes -> kind is null and fields -> kind is null then continue; end if;
    s := public._gallery_veil_map(s, kind, 'eyes', jsonb_build_object('cls', classes -> kind, 'byid', fields -> kind, 'exc', excj));
  end loop;

  -- an institution's services: the rows in availableServices it offers
  if jsonb_typeof(s -> 'availableServices') = 'object' and services_of <> '{}' then
    s := jsonb_set(s, '{availableServices}', (select coalesce(jsonb_object_agg(k, case when jsonb_typeof(v) = 'array' then coalesce((
        select jsonb_agg(e order by o) from jsonb_array_elements(v) with ordinality x(e, o)
         where not (jsonb_typeof(e) = 'object' and services_of ? public._gallery_veil_str(e -> 'institution'))), '[]') else v end), '{}')
      from jsonb_each(s -> 'availableServices') y(k, v)));
  end if;

  -- X-21e: a house removed whole leaves the institutions list
  if gone_ids <> '{}' and jsonb_typeof(s -> 'institutions') = 'array' then
    s := jsonb_set(s, '{institutions}', coalesce((select jsonb_agg(e order by o) from jsonb_array_elements(s -> 'institutions') with ordinality x(e, o)
      where not (jsonb_typeof(e) = 'object' and gone_ids ? public._gallery_veil_card_id('institution', e) and public._gallery_veil_house(e))), '[]'));
  end if;

  -- an institution's people, and every reference to a house removed whole
  if people_of <> '{}' or gone_houses <> '{}' or gone_ids <> '{}' then
    s := public._gallery_veil_map(s, 'npc', 'npc', jsonb_build_object('people', people_of, 'gone_houses', gone_houses, 'gone_ids', gone_ids));
  end if;

  -- groupings last
  foreach g in array groupings loop
    s := public._gallery_veil_grouping(s, g);
  end loop;
  return s;
end $$;

-- ── 5. THE VEIL, AS THE READS CALL IT ───────────────────────────────────────────────────────
-- {body, groupings} for a marked share (or any share on the party link); NULL for an unmarked
-- listing, which the reads serve as before.
create or replace function public._gallery_veil(pub jsonb, overrides jsonb, link boolean)
returns jsonb language plpgsql immutable set search_path = public, pg_temp as $$
declare
  res jsonb := public._gallery_veil_resolve(pub, overrides, link);
begin
  if res is null then return null; end if;
  return jsonb_build_object(
    'body', public._gallery_veil_apply(pub, res -> 'hidden', res -> 'except'),
    'groupings', coalesce((select jsonb_agg(a order by a collate "C") from jsonb_array_elements_text(res -> 'hidden') a
                            where a like 'tab:%' or a like 'block:%'), '[]'));
end $$;

-- What of the share travels to a reader (low finding 2, the fail-closed form: an ALLOWLIST, never
-- a strip). Each member's two booleans, and — when the server applied a veil — the served marker
-- { v: 2, mode, at, groupings }. No delta, no frozen copy, no other key.
create or replace function public._gallery_veil_served(overrides jsonb, groupings jsonb)
returns jsonb language sql immutable set search_path = public, pg_temp as $$
  select coalesce((
      select jsonb_object_agg(k, m) from (
        select k, jsonb_strip_nulls(jsonb_build_object(
            'revealDm', case when jsonb_typeof(v -> 'revealDm') = 'boolean' then v -> 'revealDm' end,
            'allowImport', case when jsonb_typeof(v -> 'allowImport') = 'boolean' then v -> 'allowImport' end)) as m
          from jsonb_each(case when jsonb_typeof(overrides) = 'object' then overrides else '{}' end) x(k, v)
         where k <> '$veil' and jsonb_typeof(v) = 'object') q
       where m <> '{}'), '{}')
    || case when groupings is null then '{}'::jsonb else jsonb_build_object('$veil', jsonb_strip_nulls(jsonb_build_object(
         'v', 2,
         'mode', case when overrides #>> '{$veil,mode}' in ('snapshot', 'live') and jsonb_typeof(overrides #> '{$veil,mode}') = 'string'
                      then overrides #> '{$veil,mode}' end,
         'at', case when jsonb_typeof(overrides #> '{$veil,at}') = 'string' and public._gallery_veil_jslen(overrides #>> '{$veil,at}') <= 40
                    then overrides #> '{$veil,at}' end,
         'groupings', groupings))) end
$$;

-- ── 6. THE READS (each its previous body plus the veil; grants as they stood) ────────────────

-- get_gallery_dossier: 147's body plus the veil, and the pg_temp pin a recreated definer takes
-- (tests/lint/migrationSearchPathPin.test.js; its ledger row comes off)
create or replace function public.get_gallery_dossier(dossier_slug text)
returns table (
  id uuid,
  public_slug text,
  name text,
  tier text,
  data jsonb,
  published_at timestamptz,
  updated_at timestamptz,
  view_count integer,
  is_curated boolean,
  gallery_description text,
  gallery_image_url text,
  gallery_image_alt text,
  gallery_tags text[],
  gallery_share_dm boolean,
  gallery_importable boolean,
  gallery_member_overrides jsonb,
  population integer,
  terrain text,
  government_type text,
  magic_level text,
  stability text,
  primary_resource text,
  threat_level text,
  net_votes integer,
  comment_count integer,
  chronicle jsonb,
  author_name text,
  aliveness integer
)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select
    r.id,
    r.public_slug,
    r.name,
    r.tier,
    coalesce(vl.v -> 'body', proj.d) as data,
    r.published_at,
    r.updated_at,
    r.view_count,
    r.is_curated,
    r.gallery_description,
    r.gallery_image_url,
    r.gallery_image_alt,
    r.gallery_tags,
    s.gallery_share_dm,
    s.gallery_importable,
    public._gallery_veil_served(s.gallery_member_overrides, vl.v -> 'groupings') as gallery_member_overrides,
    r.population,
    r.terrain,
    r.government_type,
    r.magic_level,
    r.stability,
    r.primary_resource,
    r.threat_level,
    r.net_votes,
    r.comment_count,
    public._gallery_chronicle_json(s.campaign_state -> 'eventLog') as chronicle,
    ap.external_name as author_name,
    r.aliveness
  from public.settlements s
  join public._gallery_public_tile_rows() r on r.id = s.id
  left join public.profiles ap on ap.id = s.user_id
  cross join lateral (
    select case
      when s.gallery_share_narrated
        and s.ai_data is not null
        and jsonb_typeof(s.ai_data -> 'aiSettlement') = 'object'
      then s.ai_data -> 'aiSettlement'
      else s.data
    end as j
  ) base
  -- 211: a share in snapshot mode is served its frozen copy, through the same projection
  cross join lateral (
    select case
      when s.gallery_member_overrides #>> '{$veil,mode}' = 'snapshot'
        and jsonb_typeof(s.gallery_member_overrides #> '{$veil,snapshot}') = 'object'
        and length((s.gallery_member_overrides #> '{$veil,snapshot}')::text) <= 1000000
      then s.gallery_member_overrides #> '{$veil,snapshot}'
      else base.j
    end as j
  ) src
  cross join lateral (
    select public._gallery_apply_member_overrides(
      case when s.gallery_share_dm then public._gallery_dm_full_json(src.j) else public._gallery_sanitize_public_json(src.j) end,
      public._gallery_dm_full_json(src.j),
      s.gallery_member_overrides, s.gallery_share_dm, s.gallery_importable, false
    ) as d
    offset 0
  ) proj
  -- 211: the share's veil, applied here (NULL for an unmarked listing: served as before)
  cross join lateral (select public._gallery_veil(proj.d, s.gallery_member_overrides, false) as v offset 0) vl
  where s.public_slug = dossier_slug
    and s.is_public = true
  limit 1;
$$;

revoke execute on function public.get_gallery_dossier(text) from public;
grant execute on function public.get_gallery_dossier(text) to authenticated, anon;

-- get_unlisted_dossier: 208's body (as amended) plus the veil
create or replace function public.get_unlisted_dossier(p_slug text)
returns jsonb
language sql stable security definer set search_path = public, pg_temp
as $$
  select jsonb_build_object(
    'id', s.id,
    'name', s.name,
    'tier', s.tier,
    'slug', s.unlisted_slug,
    'unlisted', true,
    'author_name', ap.external_name,
    'is_owner', coalesce(s.user_id = auth.uid(), false),
    'gallery_share_dm', false,
    -- 211: nothing of the share travels but each member's two booleans and the served marker.
    'gallery_member_overrides', public._gallery_veil_served(s.gallery_member_overrides, vl.v -> 'groupings'),
    'dossier', vl.v -> 'body'
  )
  from public.settlements s
  left join public.profiles ap on ap.id = s.user_id
  cross join lateral (
    select case
      when s.gallery_share_narrated
        and s.ai_data is not null
        and jsonb_typeof(s.ai_data -> 'aiSettlement') = 'object'
      then s.ai_data -> 'aiSettlement'
      else s.data
    end as j
  ) base
  -- R12 (the re-review of 2026-11-10): the sanitizer runs ONCE per read on the whole document;
  -- its result is both the splice's base and its only source.
  cross join lateral (select public._gallery_sanitize_public_json(base.j) as j offset 0) pub
  cross join lateral (
    select public._gallery_apply_member_overrides(
      pub.j, pub.j,
      s.gallery_member_overrides, false, s.gallery_importable, false
    ) as d
    offset 0
  ) proj
  -- 211: the share's veil; an unmarked share takes the default veil (the link's readers are players)
  cross join lateral (select public._gallery_veil(proj.d, s.gallery_member_overrides, true) as v offset 0) vl
  where s.unlisted_slug = p_slug
  limit 1;
$$;
grant execute on function public.get_unlisted_dossier(text) to authenticated, anon;

-- import_gallery_dossier: 131's body plus the veil
create or replace function public.import_gallery_dossier(dossier_slug text)
returns table (
  id uuid,
  name text,
  tier text,
  data jsonb
)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select
    s.id,
    s.name,
    s.tier,
    coalesce(vl.v -> 'body', proj.d) as data
  from public.settlements s
  cross join lateral (
    select case
      when s.gallery_share_narrated
        and s.ai_data is not null
        and jsonb_typeof(s.ai_data -> 'aiSettlement') = 'object'
      then s.ai_data -> 'aiSettlement'
      else s.data
    end as j
  ) base
  cross join lateral (
    select public._gallery_apply_member_overrides(
      case when s.gallery_share_dm then public._gallery_dm_full_json(base.j) else public._gallery_sanitize_public_json(base.j) end,
      public._gallery_dm_full_json(base.j),
      s.gallery_member_overrides, s.gallery_share_dm, s.gallery_importable, true
    ) as d
    offset 0
  ) proj
  -- 211: the share's veil (NULL for an unmarked listing: served as before)
  cross join lateral (select public._gallery_veil(proj.d, s.gallery_member_overrides, false) as v offset 0) vl
  where s.public_slug = dossier_slug
    and s.is_public = true
    and s.gallery_importable = true
    and auth.uid() is not null
    -- ── mig 120: IMPORT is premium (server-authoritative). Free/anon → 0 rows. ──
    and public.current_user_has_premium_access()
  limit 1;
$$;

revoke execute on function public.import_gallery_dossier(text) from public;
grant execute on function public.import_gallery_dossier(text) to authenticated;

-- get_gallery_map: 088's body plus the veil
create or replace function public.get_gallery_map(p_slug text)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare
  row      public.saved_maps;
  v_camp   jsonb;
  v_members jsonb;
begin
  select * into row from public.saved_maps where public_slug = p_slug and is_public = true;
  if not found then return null; end if;
  update public.saved_maps set view_count = view_count + 1 where id = row.id;

  if row.share_kind = 'map_with_campaign' and row.gallery_share_campaign then
    v_camp := coalesce(row.map_data->'campaign', row.map_data);
    -- Member dossiers — public-safe via the SAME sanitizers as the settlement
    -- gallery. settlementIds that aren't cloud rows (local-only) simply drop out.
    -- 088: also project each member's public_slug so the client can cross-link a
    -- member to its public gallery dossier (null when that member isn't published).
    select jsonb_agg(jsonb_build_object(
      'old_id',      s.id::text,
      'name',        s.name,
      'tier',        s.tier,
      'public_slug', case when s.is_public then s.public_slug else null end,
      'settlement',  coalesce(public._gallery_veil(pub.j, s.gallery_member_overrides, false) -> 'body', pub.j),
      'chronicle',   public._gallery_chronicle_json(s.campaign_state -> 'eventLog')
    )) into v_members
    from public.settlements s
    -- 211: the member's own listing veil over its sanitized dossier
    cross join lateral (select public._gallery_sanitize_public_json(s.data) as j offset 0) pub
    where s.id::text in (
      select jsonb_array_elements_text(coalesce(v_camp->'settlementIds', '[]'::jsonb))
    )
      -- CRITICAL (IDOR guard, 046): the owner may only ever expose their OWN
      -- settlements. settlementIds is owner-controlled free-form jsonb and this
      -- fn is SECURITY DEFINER (bypasses settlements RLS), so without this an
      -- owner could list another user's settlement UUIDs and leak their dossiers.
      and s.user_id = row.user_id
      and s.access_state = 'active';

    return jsonb_build_object(
      'slug', row.public_slug, 'name', row.name, 'kind', row.share_kind,
      'description', row.gallery_description, 'tags', to_jsonb(row.gallery_tags),
      -- 088: cover image + realm-arc summary projected for the detail header.
      'imageUrl', row.gallery_image_url, 'imageAlt', row.gallery_image_alt,
      'realmArcSummary', row.gallery_realm_arc_summary,
      -- ALLOWLIST the mapState fields the importer actually consumes (backdrop +
      -- placements + the sharer's published annotations). layers/viewport (which
      -- include GM display filters) are deliberately dropped; worldState /
      -- regionalGraph are siblings under v_camp and NEVER included.
      'mapState', (
        select jsonb_strip_nulls(jsonb_build_object(
          'fmgSnapshot',    ms->'fmgSnapshot',
          'seed',           ms->'seed',
          'customBackdrop', ms->'customBackdrop',
          'placements',     ms->'placements',
          'labels',         ms->'labels',
          'markers',        ms->'markers',
          'forests',        ms->'forests'
        )) from (select v_camp->'mapState' as ms) x
      ),
      -- 088: the shared-world panel is the STORED, pre-sanitized publish-time
      -- artifact (gallery_world_snapshot / _sections) — projected ONLY on the
      -- owner's gallery_share_world opt-in, and NEVER a live read of
      -- v_camp->'worldState' / 'regionalGraph' (those stay un-projected, per 046).
      'world', case when row.gallery_share_world then jsonb_strip_nulls(jsonb_build_object(
        'snapshot', row.gallery_world_snapshot,
        'sections', coalesce(row.gallery_world_sections, '[]'::jsonb)
      )) else null end,
      'members', coalesce(v_members, '[]'::jsonb)
    );
  end if;

  -- Default / kind='map' = blank-canvas backdrop only (Phase 1). 088: still carry
  -- the cover image + rich description so a plain map share has a header too.
  return jsonb_build_object(
    'slug', row.public_slug, 'name', row.name, 'kind', row.share_kind,
    'description', row.gallery_description, 'tags', to_jsonb(row.gallery_tags),
    'imageUrl', row.gallery_image_url, 'imageAlt', row.gallery_image_alt,
    'realmArcSummary', row.gallery_realm_arc_summary,
    'backdrop', public._gallery_map_backdrop(row.map_data)
  );
end $$;

grant execute on function public.get_gallery_map(text) to anon, authenticated;

-- ── 7. THE HELPERS ARE CALLED ONLY INSIDE THE READS ─────────────────────────────────────────
do $do$
declare f record;
begin
  for f in select p.oid::regprocedure as sig from pg_proc p join pg_namespace n on n.oid = p.pronamespace
            where n.nspname = 'public' and p.proname like '\_gallery\_veil%' loop
    execute format('revoke execute on function %s from public, anon, authenticated', f.sig);
  end loop;
end $do$;
