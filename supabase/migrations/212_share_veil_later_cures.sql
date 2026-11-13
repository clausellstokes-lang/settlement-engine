-- ════════════════════════════════════════════════════════════════════════════
-- 212 — the share veil's later cures: the second homes, the custom-content library on a
--       Reveal-DM share, and a person hidden by the per-person switch in a roster copy
-- ════════════════════════════════════════════════════════════════════════════
-- WRITTEN-NOT-DEPLOYED (standing law; applies via `supabase db push` at the deploy step, never
-- from a lane; the applied-head bump is the owner's, in that same act). Its owner's step ahead of
-- the release, if the owner takes one, is docs/chair/2026-11-13/veil-212/ (not to be run by anyone
-- but the owner, and only after a security reader clears it).
--
-- RUNS AFTER 211 AS FROZEN. 211 (supabase/migrations/211_server_side_share_veil.sql, sha256
-- eface6d093933170b9541fe630068c26e5bd41477e95e913ae7168e373be0b01, the file at 333b33973) is the
-- file the security review cleared to be applied alone (REVIEW-VEIL-211-333b33973, section 7), and
-- the owner decided on 2026-11-13 to apply it so. A migration that may already be applied never
-- changes, so the cures the sixth seat (COHERENCE-VEIL-6) wrote into 211's file afterwards were moved
-- here, unchanged (COHERENCE-VEIL-7): every function below is the lane's 211 at 28f52b1e4, statement
-- for statement, and 001..211 + 212 leaves the database exactly as the lane's 211 at 28f52b1e4 did
-- (every function's body, arguments, volatility, settings and grants; rehearsed on local chains).
-- Nothing here depends on anything outside 001..211 and this file.
--
-- THE CHANGE (the numbering is the lane's 211 header's, where these were (9), (10) and (7)'s addendum).
--   (9) THE SECOND HOMES GO WITH THEIR SOURCE (COHERENCE-VEIL-6; the fifth review's V5-1): a fact the town keeps
--       a second time, at a path no card list walks, is withheld by the eye that governs its source (section 4b,
--       _gallery_veil_second_homes and the impression arm of _gallery_veil_card): a tie's description and tension
--       under prominentRelationship and inside pressureSentence; a current tension's description inside
--       history.siegeNarrative; a house's description and function in the defence profile's lists, and the whole
--       entry for a house hidden whole; the name of a house hidden whole in the economy's chains (its own, or the
--       name the engine's processor match gives it; and the chain that is its own) and in the simulation trace; a
--       sentence of a person's appearance inside the card's impression.
--       A composed sentence that embeds a hidden string is withheld whole; a list loses the hidden name only.
--   (12) A HIDDEN NAME IN ANOTHER SPELLING (COHERENCE-VEIL-8; REVIEW-VEIL-6's twelfth): the name of a house hidden whole
--       is not sent lower-cased, slugged or as an id either. The engine's two rosters of house names
--       (economicState.compound.inst.names[], economicState.safetyProfile.compound.inst.names[]) lose each entry that
--       is such a name; on a Reveal-DM read the trace loses each entry that targets such a house
--       (`institution.<snake>`) and each cause that names it, in any case (_gallery_veil_fold, _folded_name, _names).
--       The same name inside the economy's fixed prose goes too: an income source whose label names it is withheld
--       whole, a description that names it leaves its source, and the safety profile's description that names it.
--   (15) WHAT THE ENGINE DERIVES FROM A HOUSE HIDDEN WHOLE (COHERENCE-VEIL-8; the chair's ruling of 2026-11-13 21:40 UTC):
--       the five criminal-house booleans (hasCriminalInst, hasThievesGuild, hasBlackMarket, hasSmuggling, hasGangInfra,
--       under economicState.compound.inst and economicState.safetyProfile.compound.inst) read as the houses the
--       projection still lists would raise them.
--       And the criminal income row (economicState.incomeSources[] with isCriminal), whose label is made from the
--       criminal houses' list and whose sentence carries the capture figure, is withheld whole where the
--       Criminal-architecture or the Capture-reading grouping is shut (_gallery_veil_apply).
--   (13) A HIDDEN TEXT IN ANOTHER SPELLING (COHERENCE-VEIL-8): a second home's text is matched in any case, and the
--       legacy annotation (history.legacyAnnotations[].annotation), which embeds its event's first lasting effect
--       with the first letter lower-cased, goes when it embeds a shut string of an event.
--   (14) A TIE'S COPY OF A ROLE THE PERSON'S PUBLIC CARD WITHHOLDS (COHERENCE-VEIL-8): on a Reveal-DM share, a person
--       the share does not reveal is sent as the public card, which carries no role where the face is veiled (206);
--       the ties' copies of that role (relationships[].npc1Role, .npc2Role) now go with it (_gallery_veil_tie_roles,
--       called by _gallery_veil_roster_splice), as 206's root pass does on a public projection.
--   (10) A PERSON HIDDEN BY THE PER-PERSON SWITCH IS NOT SENT IN A ROSTER COPY EITHER (COHERENCE-VEIL-6; the fifth
--       review's V5-4, ruled by the chair): _gallery_apply_member_overrides now reduces each roster copy
--       (factions[].members[], powerStructure.factions[].members[]) of a person the share does not reveal to the
--       person's own public card, on every share, marked or not (_gallery_veil_roster_splice). Nothing else an old
--       share serves changes.
--   (7, the custom-content library) THE AUTHOR'S CUSTOM-CONTENT LIBRARY NEVER TRAVELS (COHERENCE-VEIL-6; the fifth
--       review's V5-3, ruled by the chair on 2026-11-13: what no page shows is not sent): customContentRoster and
--       customContentProvenance, which the client's full mode drops (publicSafe.js :: toPublicSafe), leave the
--       Reveal-DM projection of the gallery read and the import, beside 211's decrees and dmLayer; before, every
--       reader and every importer of such a share received both.
--
-- NEW: thirteen helpers (_gallery_veil_pieces, _embeds, _fold, _folded_name, _names, _hidden_name, _sources,
-- _tie_pieces, _second_homes, _member_revealed, _roster_members, _tie_roles, _roster_splice). RESTATED, each as 211's statement plus the cure:
-- _gallery_veil_card, _gallery_veil_apply, _gallery_apply_member_overrides, get_gallery_dossier and
-- import_gallery_dossier (their grants restated as 211 states them). No helper of 211 changes its
-- signature, so nothing 211 created is left behind. 211's section 7 is restated last: no _gallery_veil*
-- helper is callable by public, anon or authenticated (53 in all). NOT CHANGED: get_unlisted_dossier,
-- get_gallery_map and every other function. No table, column, constraint, policy or row.
--
-- COUPLED CLIENT TWIN: src/domain/display/gallerySecondHomes.js (the second homes, (9)), called by
-- src/domain/display/galleryVeil.js :: applyVeil. PINNED BY EXECUTION: tests/security/gallerySecondHomes.pglite.test.js
-- and tests/security/galleryVeilCures.pglite.test.js (V5-3, V5-4, V5-7 and the rollback pins).
--
-- @rollback: supabase/rollback/212_share_veil_later_cures.down.sql, run FIRST, before 211's own: it recreates the
--   five functions at 211's statements (the file at 333b33973, verbatim) and drops 212's helpers by signature.
--   No row is written or lost either way. Rehearsed on local chains: 001..211 + 212 + this down file equals
--   001..211; 203 + 211 + 212 + this down file equals 203 + 211.

-- [212: RESTATED (211's statement, with the cure)] public._gallery_veil_card
-- ── 4. THE APPLIER (applyVeil, removal only) ────────────────────────────────────────────────
-- One card through its class switches and its own eyes. `id` NULL is an anonymous legacy event:
-- every eye addressed to any legacy event applies, and no exception does (fail-closed).
create or replace function public._gallery_veil_card(kind text, c jsonb, cls jsonb, byid jsonb, excj jsonb, legacy jsonb)
returns jsonb language plpgsql immutable as $$
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
    own := legacy;  -- every eye on any legacy event, unioned once per read (the review's F5)
  else
    own := byid -> id;
  end if;
  drops := drops || array(select jsonb_array_elements_text(coalesce(own, '[]')));
  -- V5-1 (COHERENCE-VEIL-6, the impression): a sentence of the appearance the eye shuts goes with it from the
  -- card's face, whole (gallerySecondHomes.js :: withholdImpression)
  if kind = 'npc' and 'physical' = any(drops) and jsonb_typeof(c -> 'presentation') = 'object'
     and public._gallery_veil_embeds(c #> '{presentation,impression}', public._gallery_veil_pieces(c -> 'physical')) then
    c := jsonb_set(c, '{presentation}', (c -> 'presentation') - 'impression');
  end if;
  -- SERVER ONLY (COHERENCE-VEIL-4, V4-2; the chair's ruling 331): a person stored by master's client
  -- carries `factionGoal` and `linkedFactionIds`, which master's goals and ties eyes governed
  -- (db832c892:galleryVeil.js:155,159). The people car retired both names, so the client's table no
  -- longer lists them; here they are the same content as the eye that governs them, withheld with it
  -- and sent as before while it is open. Never the client's table: it stays the client's, field for field.
  return c - array(
    select k from unnest(drops) f2,
      lateral (select jsonb_array_elements_text(case when kd -> 'fields' ? f2
        then (kd -> 'fields' -> f2) || coalesce('{"npc": {"goals": ["factionGoal"], "ties": ["linkedFactionIds"]}}'::jsonb -> kind -> f2, '[]')
        else jsonb_build_array(f2) end) k) kk
     where not (kd -> 'floor' ? k));
end $$;

-- ── 4b. THE SECOND HOMES (COHERENCE-VEIL-6; the fifth review's V5-1) ───────────────────────────
-- The stored town keeps some facts a second time, at a path no card list walks; each goes WITH THE EYE
-- THAT GOVERNS ITS SOURCE, and nothing else goes (gallerySecondHomes.js :: withholdSecondHomes, whose header
-- lists the homes). A copy loses the hidden key; a composed sentence that embeds a hidden string is
-- withheld whole; a list loses the hidden name and nothing else.

-- [212: NEW] public._gallery_veil_pieces
-- secondHomePieces: each string leaf of a hidden value, trimmed, and each run of it between sentence
-- stops and dashes (U+2014), of 12 code points or more.
create or replace function public._gallery_veil_pieces(v jsonb)
returns text[] language sql immutable as $$
  select coalesce(array_agg(t), '{}') from (
    select btrim(p, E' \t\n\r') as t
      from jsonb_path_query(coalesce(v, 'null'), 'lax $.**') x(j)
      cross join lateral (select x.j #>> '{}' as str) y
      cross join lateral (select y.str union all select regexp_split_to_table(y.str, '[.!?' || chr(8212) || ']+')) z(p)
     where jsonb_typeof(x.j) = 'string') q
   where char_length(t) >= 12
$$;

-- [212: NEW] public._gallery_veil_embeds
-- embedsAny: the text holds one of the pieces, in any case (COHERENCE-VEIL-8: a composer that lower-cases the
-- first letter of what it embeds, legacyGenerator.js :: annotationBody, still embeds it).
create or replace function public._gallery_veil_embeds(txt jsonb, pieces text[])
returns boolean language sql immutable as $$
  select jsonb_typeof(txt) = 'string' and exists (select 1 from unnest(pieces) p where position(lower(p) in lower(txt #>> '{}')) > 0)
$$;

-- [212: NEW] public._gallery_veil_fold
-- COHERENCE-VEIL-8 (REVIEW-VEIL-6's twelfth): a name in ANOTHER SPELLING. The fold: lower case, every run of
-- characters that are not a letter or a digit one '_', none at either end. 'Thieves'' guild (powerful)',
-- 'thieves'' guild (powerful)' and 'institution.thieves_guild_powerful' all hold 'thieves_guild_powerful'.
create or replace function public._gallery_veil_fold(t text)
returns text language sql immutable as $$
  select btrim(regexp_replace(lower(coalesce(t, '')), '[^a-z0-9]+', '_', 'g'), '_')
$$;

-- [212: NEW] public._gallery_veil_folded_name
-- The text, folded, holds the name, folded, between '_' boundaries, outside every open house's folded name that
-- holds it (`opens`: a list of folded names; 'Black market' hidden, 'Black market bazaar' open: the open name is
-- not the hidden one).
create or replace function public._gallery_veil_folded_name(t text, nm text, opens jsonb)
returns boolean language plpgsql immutable as $$
declare
  hay text := '_' || public._gallery_veil_fold(t) || '_';
  needle text := public._gallery_veil_fold(nm);
  o text;
begin
  if needle = '' then return false; end if;
  for o in select jsonb_array_elements_text(case when jsonb_typeof(opens) = 'array' then opens else '[]' end) loop
    hay := replace(hay, '_' || o || '_', '_#_');
  end loop;
  return position('_' || needle || '_' in hay) > 0;
end $$;

-- [212: NEW] public._gallery_veil_names
-- names: some string anywhere in the value holds the name of a house removed whole, in its own spelling or folded
-- (a case fold, a slug, an id such as `institution.<snake>`: COHERENCE-VEIL-8). `gone` maps each name to the folded
-- names of the open houses that hold it (or to anything else: none).
create or replace function public._gallery_veil_names(v jsonb, gone jsonb)
returns boolean language sql immutable as $$
  select exists (select 1 from jsonb_path_query(coalesce(v, 'null'), 'lax $.**') x(j), jsonb_each(gone) g(nm, opens)
                  where jsonb_typeof(x.j) = 'string'
                    and (position(g.nm in (x.j #>> '{}')) > 0 or public._gallery_veil_folded_name(x.j #>> '{}', g.nm, g.opens)))
$$;

-- [212: NEW] public._gallery_veil_hidden_name
-- A processing name that a house removed whole answers to, and no house left open does: that house's name. A
-- house answers to its own name or by the engine's processor match (computeActiveChains.js :: fuzzyProcessorMatch:
-- the lower-cased name holds the pattern's first twelve characters), so 'Black market bazaar' is 'Black market'.
create or replace function public._gallery_veil_hidden_name(x jsonb, gone jsonb, open_names text[])
returns boolean language sql immutable as $$
  select exists (select 1 from jsonb_object_keys(gone) g where g = q.v or position(left(lower(q.v), 12) in lower(g)) > 0)
     and not exists (select 1 from unnest(open_names) o where o = q.v or position(left(lower(q.v), 12) in lower(o)) > 0)
    from (select public._gallery_veil_str(x) as v) q
$$;

-- [212: NEW] public._gallery_veil_sources
-- What each second home's source said, read BEFORE the eyes run: the ties with a shut eye
-- [{n1, n2, ty, d, t, ds, ts}], the pieces of every shut tension description, each house's shut
-- eyes by name {name: {desc, fn}}, and (COHERENCE-VEIL-8) the pieces of every shut string of an event.
create or replace function public._gallery_veil_sources(s jsonb, fields jsonb, classes jsonb, excj jsonb)
returns jsonb language sql immutable as $$
  with shut(kind, id, eye, card) as (
    select k.kind, i.id, e.eye, c.card
      from unnest(array['relationship', 'tension', 'institution']) k(kind),
           lateral public._gallery_veil_cards(s, k.kind) c,
           lateral (select public._gallery_veil_card_id(k.kind, c.card) as id) i,
           lateral (select unnest(case k.kind when 'relationship' then array['description', 'tension']
                                              when 'tension' then array['description'] else array['description', 'function'] end) as eye) e
  ),
  eyes as (
    select kind, id, eye, card,
           coalesce(fields #> array[kind, id], '[]') ? eye
             or (coalesce(classes -> kind, '[]') ? eye and not (excj ? ('field:' || kind || ':' || id || ':' || eye))) as is_shut
      from shut
  ),
  ties as (
    select card, bool_or(is_shut) filter (where eye = 'description') as ds, bool_or(is_shut) filter (where eye = 'tension') as ts, min(ord) as ord
      from (select e.*, row_number() over () as ord from eyes e where kind = 'relationship') q
     group by card, id
  ),
  -- an event's eyes, as the card applier reads them: an anonymous legacy event (no id) takes every eye addressed to
  -- any legacy event (fail-closed, _gallery_veil_card)
  evs as (
    select c.card, e.eye,
           coalesce(case when i.id is null
                         then (select jsonb_agg(distinct f) from jsonb_each(case when jsonb_typeof(fields -> 'event') = 'object' then fields -> 'event' else '{}' end) l(k, v),
                                      jsonb_array_elements_text(case when jsonb_typeof(l.v) = 'array' then l.v else '[]' end) f where l.k like 'event.legacy-%')
                         else fields #> array['event', i.id] end, '[]') ? e.eye
             or (coalesce(classes -> 'event', '[]') ? e.eye and (i.id is null or not (excj ? ('field:event:' || i.id || ':' || e.eye)))) as is_shut
      from public._gallery_veil_cards(s, 'event') c,
           lateral (select public._gallery_veil_card_id('event', c.card) as id) i,
           unnest(array['description', 'lastingEffects', 'hooks']) e(eye)
  )
  select jsonb_build_object(
    'ties', coalesce((select jsonb_agg(jsonb_build_object('n1', card -> 'npc1Name', 'n2', card -> 'npc2Name', 'ty', card -> 'typeName',
                                                          'd', card -> 'description', 't', card -> 'tension', 'ds', ds, 'ts', ts) order by ord)
                        from ties where ds or ts), '[]'),
    'tension_pieces', coalesce((select to_jsonb(array_agg(p)) from eyes, unnest(public._gallery_veil_pieces(jsonb_build_array(card -> 'description', card -> 'desc'))) p
                                 where kind = 'tension' and is_shut), '[]'),
    'event_pieces', coalesce((select to_jsonb(array_agg(p)) from evs,
                                     unnest(public._gallery_veil_pieces(case eye when 'description' then jsonb_build_array(card -> 'description', card -> 'desc')
                                                                                 when 'lastingEffects' then card -> 'lastingEffects' else card -> 'plotHooks' end)) p
                               where is_shut), '[]'),
    'houses', coalesce((select jsonb_object_agg(name, jsonb_build_object('desc', d, 'fn', f)) from (
        select card ->> 'name' as name, bool_or(is_shut) filter (where eye = 'description') as d, bool_or(is_shut) filter (where eye = 'function') as f
          from eyes where kind = 'institution' and public._gallery_veil_str(card -> 'name') <> '' group by 1) h), '{}'))
$$;

-- [212: NEW] public._gallery_veil_tie_pieces
-- The pieces of the shut eyes of some ties.
create or replace function public._gallery_veil_tie_pieces(ties jsonb)
returns text[] language sql immutable as $$
  select coalesce(array_agg(p), '{}') from jsonb_array_elements(coalesce(ties, '[]')) t,
    lateral unnest(public._gallery_veil_pieces(jsonb_build_array(
      case when (t ->> 'ds')::boolean then t -> 'd' end, case when (t ->> 'ts')::boolean then t -> 't' end))) p
$$;

-- [212: NEW] public._gallery_veil_second_homes
-- withholdSecondHomes: every second home whose source an eye shut.
create or replace function public._gallery_veil_second_homes(s jsonb, src jsonb, gone jsonb)
returns jsonb language plpgsql immutable as $$
declare
  ties jsonb := coalesce(src -> 'ties', '[]');
  houses jsonb := coalesce(src -> 'houses', '{}');
  pr jsonb;
  own jsonb;
  k text;
  v jsonb;
  open_names text[];
  open_folds text[];
  named_folds text[];
  pth text[];
  named jsonb;
  listed text[];
  fk text;
  kw jsonb;
begin
  if jsonb_array_length(ties) > 0 then
    pr := s -> 'prominentRelationship';
    if jsonb_typeof(pr) = 'object' then
      select coalesce(jsonb_agg(t), '[]') into own from jsonb_array_elements(ties) t
       where (public._gallery_veil_str(t -> 'n1') = public._gallery_veil_str(pr -> 'npc1') and public._gallery_veil_str(t -> 'n2') = public._gallery_veil_str(pr -> 'npc2')
              and public._gallery_veil_str(t -> 'ty') = public._gallery_veil_str(pr -> 'type'))
          or (public._gallery_veil_str(pr -> 'full') <> '' and t -> 'd' = pr -> 'full')
          or (public._gallery_veil_str(pr -> 'tension') <> '' and t -> 't' = pr -> 'tension');
      if jsonb_array_length(own) > 0 then
        if exists (select 1 from jsonb_array_elements(own) t where (t ->> 'ds')::boolean) then pr := pr - 'full'; end if;
        if exists (select 1 from jsonb_array_elements(own) t where (t ->> 'ts')::boolean) then pr := pr - 'tension'; end if;
        if public._gallery_veil_embeds(pr -> 'phrasing', public._gallery_veil_tie_pieces(own)) then pr := pr - 'phrasing'; end if;
        s := jsonb_set(s, '{prominentRelationship}', pr);
      end if;
    end if;
    if public._gallery_veil_embeds(s -> 'pressureSentence', public._gallery_veil_tie_pieces(ties)) then s := s - 'pressureSentence'; end if;
  end if;
  if jsonb_typeof(s -> 'history') = 'object'
     and public._gallery_veil_embeds(s #> '{history,siegeNarrative}', array(select jsonb_array_elements_text(coalesce(src -> 'tension_pieces', '[]')))) then
    s := s #- '{history,siegeNarrative}';
  end if;
  -- COHERENCE-VEIL-8 (T1): the legacy annotation embeds its event's first lasting effect, its first letter
  -- lower-cased (legacyGenerator.js :: annotationBody); a shut string of an event inside it takes the annotation
  -- with it (the entry's event name, type and years, which are the event card's floor, stay)
  if jsonb_typeof(s -> 'history') = 'object' and jsonb_typeof(s #> '{history,legacyAnnotations}') = 'array'
     and jsonb_array_length(coalesce(src -> 'event_pieces', '[]')) > 0 then
    s := jsonb_set(s, '{history,legacyAnnotations}', (
      select coalesce(jsonb_agg(case when jsonb_typeof(a) = 'object'
                                       and public._gallery_veil_embeds(a -> 'annotation', array(select jsonb_array_elements_text(src -> 'event_pieces')))
                                     then a - 'annotation' else a end order by o), '[]')
        from jsonb_array_elements(s #> '{history,legacyAnnotations}') with ordinality x(a, o)));
  end if;

  if jsonb_typeof(s -> 'defenseProfile') = 'object' and jsonb_typeof(s #> '{defenseProfile,institutions}') = 'object' then
    for k, v in select * from jsonb_each(s #> '{defenseProfile,institutions}') loop
      if jsonb_typeof(v) <> 'array' then continue; end if;
      s := jsonb_set(s, array['defenseProfile', 'institutions', k], coalesce((
        select jsonb_agg(case when jsonb_typeof(r) <> 'object' then r
            else r - (case when coalesce((houses -> public._gallery_veil_str(r -> 'name') ->> 'desc')::boolean, false) then array['desc', 'description'] else '{}'::text[] end)
                   - (case when coalesce((houses -> public._gallery_veil_str(r -> 'name') ->> 'fn')::boolean, false) then array['tags', 'facets', 'serviceKeys'] else '{}'::text[] end) end
          order by o)
          from jsonb_array_elements(v) with ordinality x(r, o)
         where not (jsonb_typeof(r) = 'object' and gone ? public._gallery_veil_str(r -> 'name'))), '[]'));
    end loop;
  end if;
  if gone = '{}' then return s; end if;
  open_names := array(select public._gallery_veil_str(e -> 'name')
                        from jsonb_array_elements(case when jsonb_typeof(s -> 'institutions') = 'array' then s -> 'institutions' else '[]' end) e
                       where jsonb_typeof(e) = 'object');
  -- every name of a house removed whole: its own, and each processing name only it answers to
  named := gone || coalesce((select jsonb_object_agg(x #>> '{}', true)
      from jsonb_array_elements(case when jsonb_typeof(s #> '{economicState,activeChains}') = 'array' then s #> '{economicState,activeChains}' else '[]' end) c,
           jsonb_array_elements(case when jsonb_typeof(c -> 'processingInstitutions') = 'array' then c -> 'processingInstitutions' else '[]' end) x
     where jsonb_typeof(c) = 'object' and jsonb_typeof(x) = 'string' and public._gallery_veil_hidden_name(x, gone, open_names)), '{}');
  -- COHERENCE-VEIL-8: each name, with the folded names of the open houses that hold it (blanked before a folded
  -- search: an open name is not the hidden one)
  open_folds := array(select f from (select public._gallery_veil_fold(o) as f from unnest(open_names) o) q where f <> '');
  named := (select coalesce(jsonb_object_agg(nk, coalesce((select jsonb_agg(distinct o) from unnest(open_folds) o
                                                           where o <> public._gallery_veil_fold(nk)
                                                             and position('_' || public._gallery_veil_fold(nk) || '_' in '_' || o || '_') > 0), '[]')), '{}')
              from jsonb_object_keys(named) q(nk));
  named_folds := array(select public._gallery_veil_fold(nk) from jsonb_object_keys(named) q(nk));

  -- COHERENCE-VEIL-8 (REVIEW-VEIL-6's twelfth): the engine's roster of house names, stamped once at birth and
  -- LOWER-CASED (priorityHelpers.js :: getInstitutionNames), in the economy's and the safety profile's flags: each
  -- list loses every entry that is the name of a house removed whole, in any spelling, and nothing else (an entry
  -- an open house answers to stays)
  for pth in select p from (values (array['economicState', 'compound', 'inst', 'names']),
                                   (array['economicState', 'safetyProfile', 'compound', 'inst', 'names'])) v(p) loop
    if jsonb_typeof(s #> pth) = 'array' then
      s := jsonb_set(s, pth, coalesce((select jsonb_agg(x order by xo) from jsonb_array_elements(s #> pth) with ordinality y(x, xo)
        where not (jsonb_typeof(x) = 'string' and public._gallery_veil_fold(x #>> '{}') = any(named_folds)
                   and not public._gallery_veil_fold(x #>> '{}') = any(open_folds))), '[]'));
    end if;
  end loop;
  -- COHERENCE-VEIL-8, the chair's ruling (b): the engine's five criminal-house booleans, raised at birth by a
  -- substring of a house's lower-cased name (priorityHelpers.js :: getInstitutionNames, these very lists), read as
  -- the houses this projection still lists would raise them: a flag only a house removed whole raised reads false
  -- (never true where it was false)
  listed := array(select lower(o) from unnest(open_names) o);
  for pth in select p from (values (array['economicState', 'compound', 'inst']), (array['economicState', 'safetyProfile', 'compound', 'inst'])) v(p) loop
    if jsonb_typeof(s #> pth) = 'object' then
      for fk, kw in select * from jsonb_each('{
          "hasCriminalInst": ["thieves'' guild", "black market", "smuggling", "assassins", "street gang", "front business", "gambling den", "underground city", "multiple criminal"],
          "hasThievesGuild": ["thieves'' guild chapter", "thieves'' guild (powerful)"],
          "hasBlackMarket": ["black market", "black market bazaar"],
          "hasSmuggling": ["smuggling network", "smuggling operation"],
          "hasGangInfra": ["street gang", "multiple criminal factions", "front business"]}'::jsonb) loop
        if (s #> pth) -> fk = 'true'::jsonb
           and not exists (select 1 from unnest(listed) l, jsonb_array_elements_text(kw) w where position(w in l) > 0) then
          s := jsonb_set(s, pth || fk, 'false'::jsonb);
        end if;
      end loop;
    end if;
  end loop;
  -- COHERENCE-VEIL-8 (N4): the name of a house removed whole inside the economy's fixed prose, in any spelling. The
  -- words are the generator's, chosen by the KIND of house present ('Smuggling Network Revenue'; '... and black
  -- market trade'), and they are the hidden house's name: the hidden name wins (COHERENCE-VEIL-6's ruling for a
  -- chain's label). An income source whose label names it is withheld whole (its label is its row, as a chain's);
  -- one whose description names it loses the description; the safety profile's description that names it goes.
  if jsonb_typeof(s -> 'economicState') = 'object' and jsonb_typeof(s #> '{economicState,incomeSources}') = 'array' then
    s := jsonb_set(s, '{economicState,incomeSources}', coalesce((
      select jsonb_agg(case when jsonb_typeof(e) = 'object' and public._gallery_veil_names(e -> 'desc', named) then e - 'desc' else e end order by o)
        from jsonb_array_elements(s #> '{economicState,incomeSources}') with ordinality x(e, o)
       where not (jsonb_typeof(e) = 'object' and public._gallery_veil_names(e -> 'source', named))), '[]'));
  end if;
  if jsonb_typeof(s #> '{economicState,safetyProfile}') = 'object' and public._gallery_veil_names(s #> '{economicState,safetyProfile,safetyDesc}', named) then
    s := s #- '{economicState,safetyProfile,safetyDesc}';
  end if;

  if jsonb_typeof(s -> 'economicState') = 'object' and jsonb_typeof(s #> '{economicState,activeChains}') = 'array' then
    s := jsonb_set(s, '{economicState,activeChains}', coalesce((
      select jsonb_agg(c2 order by o) from (
        select o, case when jsonb_typeof(c) <> 'object' then c
          else (case when jsonb_typeof(c -> 'processingInstitutions') = 'array'
                     then jsonb_set(c, '{processingInstitutions}', coalesce((select jsonb_agg(x order by xo) from jsonb_array_elements(c -> 'processingInstitutions') with ordinality y(x, xo)
                                                                             where not public._gallery_veil_hidden_name(x, gone, open_names)), '[]'))
                     else c end)
               - (case when jsonb_typeof(c -> 'dependency') = 'object' and public._gallery_veil_hidden_name(c #> '{dependency,institution}', gone, open_names)
                       then array['dependency'] else '{}'::text[] end) end as c2,
          c
          from jsonb_array_elements(s #> '{economicState,activeChains}') with ordinality x(c, o)) q
       where not (jsonb_typeof(c) = 'object'
                  and (gone ? public._gallery_veil_str(c -> 'label')
                       or (jsonb_typeof(c -> 'processingInstitutions') = 'array' and jsonb_array_length(c -> 'processingInstitutions') > 0
                           and jsonb_array_length(c2 -> 'processingInstitutions') = 0)))), '[]'));
  end if;
  if jsonb_typeof(s -> 'simulationTrace') = 'array' then
    s := jsonb_set(s, '{simulationTrace}', coalesce((
      select jsonb_agg(case when jsonb_typeof(e) <> 'object' then e
          else e || (select coalesce(jsonb_object_agg(kk, coalesce((select jsonb_agg(x order by xo) from jsonb_array_elements(e -> kk) with ordinality y(x, xo)
                                                                    where not public._gallery_veil_names(x, named)), '[]')), '{}')
                       from unnest(array['causes', 'downstreamEffects']) kk where jsonb_typeof(e -> kk) = 'array') end order by o)
        from jsonb_array_elements(s -> 'simulationTrace') with ordinality x(e, o)
       where not (jsonb_typeof(e) = 'object'
                  and exists (select 1 from jsonb_each(e) z(kk, vv) where kk not in ('causes', 'downstreamEffects') and public._gallery_veil_names(vv, named)))), '[]'));
  end if;
  return s;
end $$;

-- [212: RESTATED (211's statement, with the cure)] public._gallery_veil_apply
create or replace function public._gallery_veil_apply(pub jsonb, res jsonb)
returns jsonb language plpgsql immutable as $$
declare
  s jsonb := case when jsonb_typeof(pub) = 'object' then pub else '{}'::jsonb end;
  excj jsonb := coalesce(res -> 'exc', '{}');
  groupings text[] := array(select jsonb_array_elements_text(coalesce(res -> 'groupings', '[]')));
  card_hides jsonb := coalesce(res -> 'cards', '{}');
  classes jsonb := coalesce(res -> 'classes', '{}');
  fields jsonb := coalesce(res -> 'fields', '{}');
  gone_ids jsonb := '{}';
  gone_houses jsonb := '{}';
  services_of jsonb;
  people_of jsonb := '{}';
  kind text;
  g text;
  src jsonb;
begin
  -- X-21e: a card-hidden house goes whole only when the data puts it in the class.
  -- (set-based, the review's F5: one pass, never a growing object rebuilt per house)
  if card_hides <> '{}' then
    with h as (
      select c.card, i.id, public._gallery_veil_house(c.card) as house
        from public._gallery_veil_cards(s, 'institution') c, lateral (select public._gallery_veil_inst_id(c.card) as id) i
       where card_hides ? i.id
    )
    select coalesce((select jsonb_object_agg(id, true) from h where house), '{}'),
           coalesce((select jsonb_object_agg(card ->> 'name', true) from h where house and public._gallery_veil_str(card -> 'name') <> ''), '{}'),
           fields || jsonb_build_object('institution', coalesce(fields -> 'institution', '{}') || coalesce((
             select jsonb_object_agg(q.id, (select jsonb_agg(distinct f) from (
                 select jsonb_array_elements_text(coalesce(fields #> array['institution', q.id], '[]')) f
                 union select unnest(array['description', 'function', 'services', 'people'])) u))
               from (select distinct id from h where not house) q), '{}'))
      into gone_ids, gone_houses, fields;
    if fields -> 'institution' = '{}' then fields := fields - 'institution'; end if;
  end if;

  -- the virtual institution eyes, read before any card is touched
  if fields -> 'institution' is not null or classes -> 'institution' is not null then
    with v as (
      select c.card ->> 'name' as name,
             coalesce(fields #> array['institution', i.id], '[]') ? 'services'
               or (coalesce(classes -> 'institution', '[]') ? 'services' and not (excj ? ('field:institution:' || i.id || ':services'))) as vs,
             coalesce(fields #> array['institution', i.id], '[]') ? 'people'
               or (coalesce(classes -> 'institution', '[]') ? 'people' and not (excj ? ('field:institution:' || i.id || ':people'))) as vp
        from public._gallery_veil_cards(s, 'institution') c, lateral (select public._gallery_veil_inst_id(c.card) as id) i
       where public._gallery_veil_str(c.card -> 'name') <> ''
    )
    select coalesce((select jsonb_object_agg(name, true) from v where vs), '{}'), coalesce((select jsonb_object_agg(name, true) from v where vp), '{}')
      into services_of, people_of;
  else
    services_of := '{}';
  end if;
  services_of := gone_houses || services_of;

  -- V5-1 (COHERENCE-VEIL-6): the second homes' sources, read before any card is touched
  src := case when fields ?| array['relationship', 'tension', 'institution', 'event'] or classes ?| array['relationship', 'tension', 'institution', 'event']
              then public._gallery_veil_sources(s, fields, classes, excj) else '{}'::jsonb end;

  -- cards: class switches, then per-card eyes
  foreach kind in array public._gallery_veil_kind_order() loop
    if classes -> kind is null and fields -> kind is null then continue; end if;
    s := public._gallery_veil_map(s, kind, 'eyes', jsonb_build_object('cls', classes -> kind, 'byid', fields -> kind, 'exc', excj,
      'legacy', case when kind = 'event' then coalesce((select jsonb_agg(distinct f) from jsonb_each(coalesce(fields -> 'event', '{}')) e(k, v),
                                                          jsonb_array_elements_text(v) f where k like 'event.legacy-%'), '[]') end));
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
      where not (jsonb_typeof(e) = 'object' and gone_ids ? public._gallery_veil_inst_id(e) and public._gallery_veil_house(e))), '[]'));
  end if;

  -- an institution's people, and every reference to a house removed whole
  if people_of <> '{}' or gone_houses <> '{}' or gone_ids <> '{}' then
    s := public._gallery_veil_map(s, 'npc', 'npc', jsonb_build_object('people', people_of, 'gone_houses', gone_houses, 'gone_ids', gone_ids));
  end if;

  -- V5-1: each second home goes with the eye that governs its source
  s := public._gallery_veil_second_homes(s, src, gone_houses);

  -- groupings last
  foreach g in array groupings loop
    s := public._gallery_veil_grouping(s, g);
  end loop;
  -- COHERENCE-VEIL-8, the chair's ruling (c): the criminal income row is built from what those groupings hide (its
  -- label from the criminal houses' list, safetyProfile.criminalInstitutions; its sentence carries the capture
  -- figure, safetyProfile.blackMarketCapture): where either grouping is shut it is withheld whole
  -- (gallerySecondHomes.js :: withholdCriminalIncome)
  if groupings && array['block:defense.criminalStructure', 'block:power.criminalUnderside']
     and jsonb_typeof(s -> 'economicState') = 'object' and jsonb_typeof(s #> '{economicState,incomeSources}') = 'array' then
    s := jsonb_set(s, '{economicState,incomeSources}', coalesce((select jsonb_agg(e order by o)
      from jsonb_array_elements(s #> '{economicState,incomeSources}') with ordinality x(e, o)
     where not (jsonb_typeof(e) = 'object' and coalesce(e -> 'isCriminal' = 'true'::jsonb, false))), '[]'));
  end if;
  return s;
end $$;

-- [212: NEW] public._gallery_veil_member_revealed
-- ── V5-4 (COHERENCE-VEIL-6; the fifth review §1.5, ruled by the chair on 2026-11-13): a person hidden by the per-person
-- switch is never sent, on any share, exported before the veil or after. Master's generator embeds each person's whole
-- card in the power's roster (factions[].members[], powerStructure.factions[].members[]); on a DM-full projection the 093
-- splice reduced the person in npcs[] only, so an UNMARKED share (served as before, no veil) sent the roster copy whole.
-- Now each roster copy of a person the share does not reveal is the same public card as the person's own entry.
-- Nothing else changes: a revealed person's copy stays; a projection that is not DM-full is the sanitiser's already.
-- SERVER ONLY, as V4-2: every page draws a share from what a read serves, which this splice has already reduced; a
-- client twin would read `members` on factions, a key the current generator no longer writes (the observed-shape
-- register refuses it, and the retired-field register does not grow).
create or replace function public._gallery_veil_member_revealed(m jsonb, overrides jsonb, share_dm boolean, importable boolean, for_import boolean)
returns boolean language sql immutable as $$
  select case when for_import then
      coalesce(case coalesce(overrides -> public._gallery_npc_key(m) -> 'revealDm', 'null') when 'true' then true when 'null' then null else false end, share_dm)
      and coalesce(case coalesce(overrides -> public._gallery_npc_key(m) -> 'allowImport', 'null') when 'true' then true when 'null' then null else false end, importable)
    else coalesce(case coalesce(overrides -> public._gallery_npc_key(m) -> 'revealDm', 'null') when 'true' then true when 'null' then null else false end, share_dm) end
$$;

-- [212: NEW] public._gallery_veil_roster_members
create or replace function public._gallery_veil_roster_members(factions jsonb, overrides jsonb, share_dm boolean, importable boolean, for_import boolean)
returns jsonb language sql immutable as $$
  select coalesce(jsonb_agg(case when jsonb_typeof(f) = 'object' and jsonb_typeof(f -> 'members') = 'array'
      then jsonb_set(f, '{members}', coalesce((
        select jsonb_agg(case when jsonb_typeof(m) = 'object' and not coalesce(public._gallery_veil_member_revealed(m, overrides, share_dm, importable, for_import), false)
                              then coalesce(public._gallery_sanitize_public_json(jsonb_build_object('npcs', jsonb_build_array(m))) -> 'npcs' -> 0, '{}'::jsonb)
                              else m end order by mo)
          from jsonb_array_elements(f -> 'members') with ordinality y(m, mo)), '[]'))
      else f end order by o), '[]')
    from jsonb_array_elements(factions) with ordinality x(f, o)
$$;

-- [212: NEW] public._gallery_veil_tie_roles
-- COHERENCE-VEIL-8 (N3): a tie carries a copy of each end's role (`npc1Role` for the `from` end, `npc2Role` for the
-- `to` end; master's ties name the ends `npc1Id`, `npc2Id`). On a DM-full projection a person the share does not
-- reveal is the person's public card, which carries no role where the face is veiled (206); the tie's copy follows
-- the person's own entry, as the 206 root pass does on a public projection. A revealed person's copy stays.
create or replace function public._gallery_veil_tie_roles(rels jsonb, npcs jsonb, overrides jsonb, share_dm boolean, importable boolean, for_import boolean)
returns jsonb language sql immutable as $$
  with hidden as (
    select n ->> 'id' as id from jsonb_array_elements(npcs) n
     where jsonb_typeof(n) = 'object' and (n ->> 'id') is not null and not (n ? 'role')
       and not coalesce(public._gallery_veil_member_revealed(n, overrides, share_dm, importable, for_import), false))
  select coalesce(jsonb_agg(case when jsonb_typeof(r) = 'object' then
      (case when coalesce(r ->> 'from', r ->> 'npc1Id') in (select id from hidden) then r - 'npc1Role' else r end)
      - (case when coalesce(r ->> 'to', r ->> 'npc2Id') in (select id from hidden) then 'npc2Role' else '' end)
    else r end order by o), '[]')
    from jsonb_array_elements(rels) with ordinality x(r, o)
$$;

-- [212: NEW] public._gallery_veil_roster_splice
create or replace function public._gallery_veil_roster_splice(doc jsonb, overrides jsonb, share_dm boolean, importable boolean, for_import boolean)
returns jsonb language plpgsql immutable as $$
begin
  if not coalesce(share_dm, false) or jsonb_typeof(doc) is distinct from 'object' then return doc; end if;
  -- COHERENCE-VEIL-8 (N3): the ties' copies of a role the person's own entry no longer carries
  if jsonb_typeof(doc -> 'relationships') = 'array' and jsonb_typeof(doc -> 'npcs') = 'array' then
    doc := jsonb_set(doc, '{relationships}', public._gallery_veil_tie_roles(doc -> 'relationships', doc -> 'npcs', overrides, share_dm, importable, for_import));
  end if;
  if jsonb_typeof(doc -> 'factions') = 'array' then
    doc := jsonb_set(doc, '{factions}', public._gallery_veil_roster_members(doc -> 'factions', overrides, share_dm, importable, for_import));
  end if;
  if jsonb_typeof(doc -> 'powerStructure') = 'object' and jsonb_typeof(doc #> '{powerStructure,factions}') = 'array' then
    doc := jsonb_set(doc, '{powerStructure,factions}',
      public._gallery_veil_roster_members(doc #> '{powerStructure,factions}', overrides, share_dm, importable, for_import));
  end if;
  return doc;
end $$;

-- [212: RESTATED (211's statement, with the cure)] public._gallery_apply_member_overrides
-- _gallery_apply_member_overrides (093), the FIFTH restatement: 093's body plus one change, a TYPED
-- read of the two stored member flags (the second review's R9 and R11, ruled into 211). 093 cast
-- the stored text to boolean: a stored word that is not one ("maybe", an object) made the gallery,
-- the link and the import raise, and "yes", "t", "1" or "on" revealed a person the 210 page hid.
-- Now only the JSON value true reveals (revealDm) or permits (allowImport); JSON false refuses;
-- absent or null falls back to the settlement's flag, as before; any other stored value is NOT a
-- reveal and NOT a permit; nothing raises. Each flag is looked up ONCE per person, as 093 did (a
-- simple CASE evaluates its subject once): the overrides can hold the whole frozen copy, and every
-- lookup reads them again. The client only ever writes booleans
-- (src/lib/gallery.js :: the member clamp), so no generated town changes.
create or replace function public._gallery_apply_member_overrides(
  base jsonb,
  dm_full jsonb,
  overrides jsonb,
  settlement_share_dm boolean,
  settlement_importable boolean,
  for_import boolean
) returns jsonb language sql immutable as $$
  -- V5-4: the roster copies follow the person's own entry (_gallery_veil_roster_splice, below)
  select public._gallery_veil_roster_splice(case
    when jsonb_typeof(base -> 'npcs') is distinct from 'array' then base
    else jsonb_set(base, '{npcs}', coalesce((
      select jsonb_agg(
        case
          when (
            case when for_import then
              coalesce(case coalesce(overrides -> public._gallery_npc_key(npc) -> 'revealDm', 'null')
                              when 'true' then true when 'null' then null else false end, settlement_share_dm)
              and coalesce(case coalesce(overrides -> public._gallery_npc_key(npc) -> 'allowImport', 'null')
                                  when 'true' then true when 'null' then null else false end, settlement_importable)
            else
              coalesce(case coalesce(overrides -> public._gallery_npc_key(npc) -> 'revealDm', 'null')
                              when 'true' then true when 'null' then null else false end, settlement_share_dm)
            end
          )
          then coalesce(
            (select e from jsonb_array_elements(dm_full -> 'npcs') e
              where public._gallery_npc_key(e) = public._gallery_npc_key(npc) limit 1),
            npc)
          else public._gallery_sanitize_public_json(jsonb_build_object('npcs', jsonb_build_array(npc))) -> 'npcs' -> 0
        end
        order by ord
      )
      from jsonb_array_elements(base -> 'npcs') with ordinality as t(npc, ord)
    ), '[]'::jsonb))
  end, overrides, settlement_share_dm, settlement_importable, for_import);
$$;

-- [212: RESTATED (211's statement, with the cure)] public.get_gallery_dossier
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
    vl.v -> 'served' as gallery_member_overrides,
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
  -- 211: a share in snapshot mode is served its frozen copy, through the same projection. A copy
  -- past the server's bound is REFUSED (no row), never replaced by the live row (the review's F1).
  cross join lateral (
    select case when cp.copy is not null then cp.copy else base.j end as j,
           cp.copy is not null as copied,
           coalesce(length(cp.copy::text) > public._gallery_veil_copy_bound(), false) as refused
      from (select case when mv.v ->> 'mode' = 'snapshot' and jsonb_typeof(mv.v -> 'snapshot') = 'object' then mv.v -> 'snapshot' end as copy
              from (select s.gallery_member_overrides -> '$veil' as v offset 0) mv) cp
  ) src
  -- 211: the editor's working state (decrees, dmLayer) never travels, Reveal DM or not (the third
  -- review's V3-1; the client's full mode strips both), nor the author's custom-content library (the fifth
  -- review's V5-3, ruled by the chair: customContentRoster, customContentProvenance, which no page shows)
  cross join lateral (
    select public._gallery_apply_member_overrides(
      case when s.gallery_share_dm then public._gallery_dm_full_json(src.j) - array['decrees', 'dmLayer', 'customContentRoster', 'customContentProvenance']
           else public._gallery_sanitize_public_json(src.j) end,
      public._gallery_dm_full_json(src.j),
      s.gallery_member_overrides, s.gallery_share_dm, s.gallery_importable, false
    ) as d
    offset 0
  ) proj
  -- 211: the share's veil, applied here (NULL for an unmarked listing: served as before); the freeze
  -- date travels only with the frozen copy (R5)
  cross join lateral (select public._gallery_veil(proj.d, s.gallery_member_overrides, false, src.copied) as v offset 0) vl
  where s.public_slug = dossier_slug
    and s.is_public = true
    and not src.refused
  limit 1;
$$;

revoke execute on function public.get_gallery_dossier(text) from public;
grant execute on function public.get_gallery_dossier(text) to authenticated, anon;

-- [212: RESTATED (211's statement, with the cure)] public.import_gallery_dossier
-- import_gallery_dossier: 131's body plus the veil, and the frozen copy read exactly as the gallery
-- read reads it (the second review's R1: in snapshot mode the import handed over the LIVE town, so
-- everything written after the freeze reached the importer): the same lateral, the same bound (a
-- refused copy is refused: no row), no copy served as the gallery serves it
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
    select case when cp.copy is not null then cp.copy else base.j end as j,
           cp.copy is not null as copied,
           coalesce(length(cp.copy::text) > public._gallery_veil_copy_bound(), false) as refused
      from (select case when mv.v ->> 'mode' = 'snapshot' and jsonb_typeof(mv.v -> 'snapshot') = 'object' then mv.v -> 'snapshot' end as copy
              from (select s.gallery_member_overrides -> '$veil' as v offset 0) mv) cp
  ) src
  -- 211: the editor's working state (decrees, dmLayer) never travels, Reveal DM or not (the third
  -- review's V3-1; the client's full mode strips both), nor the author's custom-content library (the fifth
  -- review's V5-3, ruled by the chair: customContentRoster, customContentProvenance, which no page shows)
  cross join lateral (
    select public._gallery_apply_member_overrides(
      case when s.gallery_share_dm then public._gallery_dm_full_json(src.j) - array['decrees', 'dmLayer', 'customContentRoster', 'customContentProvenance']
           else public._gallery_sanitize_public_json(src.j) end,
      public._gallery_dm_full_json(src.j),
      s.gallery_member_overrides, s.gallery_share_dm, s.gallery_importable, true
    ) as d
    offset 0
  ) proj
  -- 211: the share's veil (NULL for an unmarked listing: served as before)
  cross join lateral (select public._gallery_veil(proj.d, s.gallery_member_overrides, false, src.copied) as v offset 0) vl
  where s.public_slug = dossier_slug
    and s.is_public = true
    and not src.refused
    and s.gallery_importable = true
    and auth.uid() is not null
    -- ── mig 120: IMPORT is premium (server-authoritative). Free/anon → 0 rows. ──
    and public.current_user_has_premium_access()
  limit 1;
$$;

revoke execute on function public.import_gallery_dossier(text) from public;
grant execute on function public.import_gallery_dossier(text) to authenticated;

-- ── 7. THE HELPERS ARE CALLED ONLY INSIDE THE READS ─────────────────────────────────────────
do $do$
declare f record;
begin
  for f in select p.oid::regprocedure as sig from pg_proc p join pg_namespace n on n.oid = p.pronamespace
            where n.nspname = 'public' and p.proname like '\_gallery\_veil%' loop
    execute format('revoke execute on function %s from public, anon, authenticated', f.sig);
  end loop;
end $do$;
