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
--       (`institution.<snake>`) and each cause that names it, in any case (now by THE NAME SEARCH, (19)).
--       The same name inside the economy's fixed prose goes too: an income source whose label names it is withheld
--       whole, a description that names it leaves its source, and the safety profile's description that names it.
--   (15) WHAT THE ENGINE DERIVES FROM A HOUSE HIDDEN WHOLE (COHERENCE-VEIL-8; the chair's ruling of 2026-11-13 21:40 UTC):
--       the five criminal-house booleans (hasCriminalInst, hasThievesGuild, hasBlackMarket, hasSmuggling, hasGangInfra,
--       under economicState.compound.inst and economicState.safetyProfile.compound.inst) read as the houses the
--       projection still lists would raise them.
--       And the criminal income row (economicState.incomeSources[] with isCriminal), whose label is made from the
--       criminal houses' list and whose sentence carries the capture figure, is withheld whole where the
--       Criminal-architecture or the Capture-reading grouping is shut (_gallery_veil_apply).
--   (17) A HOUSE BY EVERY NAME (COHERENCE-VEIL-9; the chair's ruling on PART 9's limits): a house's name in any spelling
--       includes the name it was born with, which a stamped house keeps as its catalogue identity (`catalogId`, the fold
--       of that name; the rename's writer moves `name` only). The two derived name lists are sent BY POSITIVE ACCOUNT:
--       an entry stays only where a native house still listed accounts for it, each house for one entry (a stamped house
--       by its identity, an unstamped one by its name); every birth name of a house removed whole is searched with its
--       name (the chains, the trace, the sweep); and the fold is the client's own for every input (_gallery_veil_fold).
--   (16) A HIDDEN NAME, ANYWHERE (COHERENCE-VEIL-8; the chair's ruling (a)): last, every string of the projection that
--       names a house removed whole leaves it: a person's goal, secret, role or title that names it, a tie's role, the
--       criminal houses' list, a summary sentence, the public prose. The town's name stays; an open house or a shown
--       power whose name holds it is not it. REBUILT in (19): the eighth seat's sweep is gone.
--   (19) THE NAME SEARCH, REBUILT (COHERENCE-VEIL-10; REVIEW-VEIL-7's V7-1, V7-4, V7-6, V7-7, V7-9, V7-10; the chair's
--       design, record 420 (ii), (iv), (v)): section 4c states it. In any script (V7-1: the letters of every script
--       kept, case from one table both engines carry); every form (V7-4, V7-9: a key, a join, an id, camel case,
--       squeezed, without the bracketed qualifier, a plural, a label where the house has no name); nothing that is not
--       hidden (V7-7: the floors; an open name that holds a hidden one cut out first); at the cost of the document's
--       length (V7-6: the whole text asked once); and without a call a level (V7-10: an iterative walk bounded at 64
--       levels, the closed answer at the bound).
--   (13) A HIDDEN TEXT IN ANOTHER SPELLING (COHERENCE-VEIL-8): a second home's text is matched in any case, and the
--       legacy annotation (history.legacyAnnotations[].annotation), which embeds its event's first lasting effect
--       with the first letter lower-cased, goes when it embeds a shut string of an event.
--   (14) A TIE'S COPY OF A ROLE THE PERSON'S PUBLIC CARD WITHHOLDS (COHERENCE-VEIL-8): on a Reveal-DM share, a person
--       the share does not reveal is sent as the public card, which carries no role where the face is veiled (206);
--       the ties' copies of that role (relationships[].npc1Role, .npc2Role) now go with it (_gallery_veil_tie_roles,
--       called by _gallery_veil_roster_splice), as 206's root pass does on a public projection.
--   (18) A HOUSE HIDDEN WHOLE IS REMOVED WHOLE, BY ITS ID ALONE (COHERENCE-VEIL-10; REVIEW-VEIL-7's V7-3, the chair's
--       record 418): the set of ids is decided before the eyes trim anything and is not tested again (_gallery_veil_apply).
--       211's statement tested the class a second time on the trimmed card, so a house in the class by a declared facet
--       or as an illegal brokerage alone stayed listed (by name on 211 alone). 211's two files are not touched.
--   (20) A SECOND HOME FOLLOWS ITS SOURCE'S EYE BY IDENTITY, NEVER BY MATCHING TEXT (COHERENCE-VEIL-10; REVIEW-VEIL-7's
--       V7-2; the chair's record 418): (9)'s composed homes and (13)'s annotation asked whether the home's words still
--       held the hidden sentence, so a source amended after the birth left its born wording in the home. Each now goes
--       with the eye of the source its composer built it from, found by what the record says: the legacy annotation by
--       its entry's event, the siege narrative with any shut tension, prominentRelationship's copies by their tie,
--       pressureSentence by the tie whose two ends it names (and by any tie where no stress and no recentConflict
--       accounts for it), a person's impression by its person. Where only the words tie a copy to its source they are
--       matched in both directions, on the current and the stored wording (section 4b states each rule; no helper is
--       added, removed or re-signed: _gallery_veil_card, _embeds, _sources and _second_homes are restated).
--   (21) THE WORDS IN ONE FOLD (COHERENCE-VEIL-11; the seat's read of section 4b): where the words tie a copy to its
--       source, "in any case" was each engine's own case map, and PostgreSQL's lower() and JavaScript's toLowerCase()
--       disagree outside ASCII (a word-final capital sigma; U+0130), so a shut sentence in Greek capitals was sent here
--       and withheld by the twin; neither found a sharp s as 'ss', the dotless i as 'i' or an accented copy. Both now
--       compare by one fold (_gallery_veil_case_fold, gallerySecondHomes.js :: caseFold): the name search's
--       preparation, A-Z lowered, each other letter the first of its case class from the one table.
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
-- NEW: twenty-six helpers (_gallery_veil_pieces, _embeds, _case_fold, _fold, _hidden_name, _sources, _tie_pieces,
-- _second_homes, _member_revealed, _roster_members, _tie_roles, _roster_splice; and the name search's fourteen: _name_sep, _name_case,
-- _name_prep, _name_fold, _name_needle, _name_search, _name_ready, _name_hits, _name_hit, _named, _name_near,
-- _name_floor, _name_taken, _name_sweep). RESTATED, each as 211's statement plus the cure:
-- _gallery_veil_card, _gallery_veil_apply, _gallery_apply_member_overrides, get_gallery_dossier and
-- import_gallery_dossier (their grants restated as 211 states them). No helper of 211 changes its
-- signature, so nothing 211 created is left behind. 211's section 7 is restated last: no _gallery_veil*
-- helper is callable by public, anon or authenticated (66 in all). NOT CHANGED: get_unlisted_dossier,
-- get_gallery_map and every other function. No table, column, constraint, policy or row.
--
-- COUPLED CLIENT TWIN: src/domain/display/gallerySecondHomes.js (the second homes, (9); the name search, (19)), called
-- by src/domain/display/galleryVeil.js :: applyVeil. PINNED BY EXECUTION: tests/security/gallerySecondHomes.pglite.test.js,
-- tests/security/galleryVeilHandRows.pglite.test.js (rows written by hand: (18), (19)) and
-- tests/security/galleryVeilCures.pglite.test.js (V5-3, V5-4, V5-7 and the rollback pins).
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
  -- V5-1 (COHERENCE-VEIL-6, the impression), BY IDENTITY since COHERENCE-VEIL-10 (REVIEW-VEIL-7's V7-2; the chair's
  -- record 418: the impression by its person): the impression on a person's face goes with THAT PERSON's appearance
  -- eye, whole, whatever the appearance now says. Before, it went only where it held a sentence of the appearance as
  -- that now stands, so an appearance amended after the birth left its born wording on the face
  -- (gallerySecondHomes.js :: withholdImpression)
  if kind = 'npc' and 'physical' = any(drops) and jsonb_typeof(c -> 'presentation') = 'object' then
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
-- lists the homes). A copy loses the hidden key; a composed sentence is withheld whole; a list loses the hidden
-- name and nothing else.
-- BY IDENTITY, NEVER BY MATCHING TEXT (COHERENCE-VEIL-10; REVIEW-VEIL-7's V7-2; the chair's record 418). The earlier
-- rules asked whether a home's words still held the hidden sentence, so a source amended after the birth left its born
-- wording in the home. Each home now follows the eye of the source ITS COMPOSER BUILT IT FROM, found by what the
-- record says of it, whatever either says today:
--   history.legacyAnnotations[].annotation   its entry's EVENT (the entry carries the event's name, type and years):
--                                            that event's lasting-effects eye (legacyGenerator.js :: annotationBody)
--   history.siegeNarrative                   ANY current tension whose description eye is shut (the composer tells of
--                                            the first tension; the record keeps no mark of which it was)
--   prominentRelationship.full/.tension/.phrasing   its TIE (the same two ends and type): the description eye, the
--                                            tension eye, and for the phrasing either (the composer writes it from one
--                                            or the other), unless it IS the tension as that stands with its eye open
--   pressureSentence                         the tie WHOSE TWO ENDS IT NAMES, as the phrasing; and, where nothing in
--                                            the record accounts for it otherwise (no stress on the town, whose line the
--                                            composer writes first; not the power structure's recentConflict), any tie
--   <a person>.presentation.impression       ITS PERSON: the appearance eye (_gallery_veil_card)
-- A copy whose source the record does not name (an entry with no such event, a prominentRelationship with no such tie)
-- follows EVERY event's, EVERY tie's eye: closed. WHERE ONLY THE WORDS TIE A COPY TO ITS SOURCE (a pressureSentence
-- that names no tie's two ends in a town under a stress; an annotation against another event's strings or its own
-- event's description and hooks), the words are matched IN BOTH DIRECTIONS (a piece of the source inside the copy, or a
-- piece of the copy inside the source) on the CURRENT wording and on the STORED one (prominentRelationship keeps its
-- tie's description and tension as born). PART 11 section 9 lists those rows with their counts.

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
-- embedsAny: THE WORDS, IN BOTH DIRECTIONS, in any case (COHERENCE-VEIL-8: a composer that lower-cases the first
-- letter of what it embeds, legacyGenerator.js :: annotationBody, still embeds it). The text holds one of the pieces
-- (a piece of the source inside the copy), or (COHERENCE-VEIL-10, V7-2) one of the text's own pieces stands inside one
-- of them (a piece of the copy inside the source: a source amended by appending or by a prefix still holds its born
-- wording). The fallback where the record gives a copy no identity; never the first rule.
-- Compared by ONE FOLD, BOTH ENGINES, EVERY SCRIPT (COHERENCE-VEIL-11: _gallery_veil_case_fold, below); a piece whose
-- fold is empty is no piece.
create or replace function public._gallery_veil_embeds(txt jsonb, pieces text[])
returns boolean language plpgsql immutable as $$
declare
  t text;
  fp text[];
begin
  if jsonb_typeof(txt) is distinct from 'string' or coalesce(cardinality(pieces), 0) = 0 then return false; end if;
  t := public._gallery_veil_case_fold(txt #>> '{}');
  fp := array(select f from unnest(pieces) p, lateral (select public._gallery_veil_case_fold(p) as f) q where f <> '');
  return exists (select 1 from unnest(fp) f where position(f in t) > 0)
      or exists (select 1 from unnest(public._gallery_veil_pieces(txt)) c, lateral (select public._gallery_veil_case_fold(c) as fc) q, unnest(fp) f
                  where fc <> '' and position(fc in f) > 0);
end $$;

-- [212: NEW] public._gallery_veil_case_fold
-- ONE FOLD FOR THE WORDS, BOTH ENGINES, EVERY SCRIPT (COHERENCE-VEIL-11, the seat's read of this section). "In any
-- case" was each engine's own case map (lower(), toLowerCase()), and the two disagree outside ASCII: a word-final
-- capital sigma is a medial sigma here and a final one in JavaScript; U+0130 is 'i' here and 'i' with a combining dot
-- there; and neither makes the sharp s 'ss', the dotless i 'i' or an accent nothing. The fold: ASCII, A-Z lowered by an
-- explicit map; any other text, THE NAME SEARCH's own preparation (_gallery_veil_name_prep: NFKD, the marks U+0300 to
-- U+036F gone), A-Z lowered, each letter outside A-Z written as the first of its case class (the one table,
-- _gallery_veil_name_case, read only here), the sharp s as 'ss'. The same string as gallerySecondHomes.js :: caseFold.
create or replace function public._gallery_veil_case_fold(t text)
returns text language plpgsql immutable as $$
declare
  cv text;   -- every member of a case class but its first
  cc text;   -- and, place for place, that class's first
begin
  if t is null or t !~ '[^\x01-\x7f]' then return translate(t, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'); end if;
  select string_agg(substr(g, 2), '' order by o), string_agg(repeat(left(g, 1), char_length(g) - 1), '' order by o)
    into cv, cc from string_to_table(public._gallery_veil_name_case(), ' ') with ordinality x(g, o);
  return replace(translate(translate(public._gallery_veil_name_prep(t), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), cv, cc), chr(223), 'ss');
end $$;

-- [212: NEW] public._gallery_veil_fold
-- THE CATALOGUE IDENTITY'S FOLD (COHERENCE-VEIL-8, -9): lower case, every run of characters that are not an ASCII
-- letter or digit one '_', none at either end. It is the engine's own fold of a house's birth name into its
-- `catalogId` (institutionalCatalog.js :: catalogIdForName), so it is what the rules BY IDENTITY compare with: the two
-- derived lists by positive account, and the processor match of a stamped house (_gallery_veil_hidden_name). It is NOT
-- the name search's fold (COHERENCE-VEIL-10: _gallery_veil_name_fold, which keeps the letters of every script).
-- THE SAME STRING AS THE CLIENT'S foldName FOR EVERY INPUT, whatever the database's locale: A-Z are lowered by
-- translate, never by lower() (whose fold of U+0130 and of the Kelvin sign U+212A differs from JavaScript's: 'i' and
-- 'k' in C.utf8, against 'i' + U+0307 and 'k'), and those two, the only characters outside A-Z whose lower case in
-- JavaScript holds a letter a-z (every code point measured), are spelled out as JavaScript lowers them.
create or replace function public._gallery_veil_fold(t text)
returns text language sql immutable as $$
  select btrim(regexp_replace(translate(replace(replace(coalesce(t, ''), chr(304), 'i' || chr(775)), chr(8490), 'k'),
                                        'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '[^a-z0-9]+', '_', 'g'), '_')
$$;

-- ── 4c. THE NAME SEARCH (COHERENCE-VEIL-10; REVIEW-VEIL-7's V7-1, V7-4, V7-6, V7-7, V7-9, V7-10) ──────────────
-- The eighth seat's sweep (_gallery_veil_folded_name, _names, _sweep and its prefilter) is REPLACED, not patched. What
-- stands here, and in the client's twin rule for rule (gallerySecondHomes.js, THE NAME SEARCH):
--   THE PREPARATION of a text that holds a character outside ASCII: NFKD, then the combining marks U+0300 to U+036F
--     removed (a full-width or ligature spelling is its letters; an accent is no part of a letter; U+0130 is I, the
--     Kelvin sign is K). No text is ever case-mapped by an engine's own function.
--   A SEPARATOR is a character of ONE explicit set (_gallery_veil_name_sep): every ASCII character that is not a letter
--     or a digit, U+0080 to U+00BF, U+00D7, U+00F7, U+2000 to U+206F, U+2E00 to U+2E7F, U+3000 to U+303F, U+FE30 to
--     U+FE6F, U+FEFF and the full-width punctuation. EVERYTHING ELSE IS KEPT: a name of symbols only, or in a script
--     with no case and no spaces, is searched as it is written.
--   THE FOLD: prepared, A-Z lowered by an explicit map, every run of separators one '_'. A text is folded ONCE.
--   CASE OUTSIDE A-Z LIVES IN THE NEEDLE: each letter of a hidden name that has another case is written in the pattern
--     as the bracket of its case class, from ONE table carried as the same literal by both engines
--     (_gallery_veil_name_case); sharp s and "ss" are one.
--   ONE SEARCH FOR ALL HIDDEN NAMES AT ONCE: one alternation; a name's words joined by '_' or by nothing (the squeezed
--     and the camel-cased spellings are the same needle); an English plural; a word boundary asked at an end of the
--     name only where that end is a letter or digit of an alphabet that separates its words (ASCII, Latin, Greek,
--     Cyrillic, Armenian, Georgian), so a name in Han, Thai or Arabic is found inside its sentence. A name's forms: the
--     name, and the name without its bracketed qualifier. A name that is separators only is searched as written.
--   AN OPEN NAME THAT HOLDS A HIDDEN ONE is cut out of a text before the search, longest first ('Black market bazaar'
--     is not 'Black market'); an open name that IS a hidden one (the same letters) is not cut out: it keeps its floor.
--   KEYS AS WELL AS VALUES; an id and a join are strings like any other. FLOORS, never asked: the town's own `name`;
--     the `id` and `name` of a house still listed (its `label` where it has no name); a shown power's `faction` and
--     `name`. An entry of a list whose own `id` or `name` is taken leaves the list whole (no record without a name).
--   THE WHOLE TEXT IS ASKED FIRST (the document's text, its escapes made spaces, folded once): no hit, no walk. THE
--     WALK IS ITERATIVE (211's _gallery_veil_drop_hooks shape: only the nodes on the way to a hit are rebuilt) and
--     bounded: the root is level 0, and a container at level 64 that holds a hit at any depth is withheld whole.
-- THE COST (V7-6), each figure measured on PostgreSQL 16 (docs/chair/2026-11-13/veil-probe-10/out/): one alternation of
-- 1,200 names takes 0.14 to 0.6 ms to START, so 10,000 strings asked one by one cost 1.4 to 6.2 s, where one 388 KB
-- text asked whole costs 3 to 145 ms. So the alternation is run ONCE over the document's text, and once more, only
-- where that found something, to mark the strings that hold a name; every later test of one string is a look-up of
-- that string among them. And a needle that brackets every ASCII letter's two cases takes 675 ms to compile for 1,200
-- names of three words, where the same names in lower case take 40 ms: so the text's A-Z are lowered (one pass) and
-- only a letter outside A-Z is bracketed.

-- [212: NEW] public._gallery_veil_name_sep
-- THE SEPARATORS, as the body of a bracket expression; `quote` false leaves the quotation mark out (the fold of a
-- document's text: there a quotation mark is where a string ends, so a name never runs from one string into the next).
create or replace function public._gallery_veil_name_sep(quote boolean)
returns text language sql immutable as $$
  select case when quote then '\x01-\x2f' else '\x01-\x21\x23-\x2f' end
      || '\x3a-\x40\x5b-\x60\x7b-\xbf\xd7\xf7\u2000-\u206f\u2e00-\u2e7f\u3000-\u303f\ufe30-\ufe6f\ufeff\uff00-\uff0f\uff1a-\uff20\uff3b-\uff40\uff5b-\uff65'
$$;

-- [212: NEW] public._gallery_veil_name_case
-- THE CASE CLASSES: each a lower-case letter followed by every other code point that is the same letter in another
-- case; classes separated by one space. Generated once (docs/chair/2026-11-13/veil-probe-10/gen-name-tables.mjs, Unicode
-- 17.0) over the code points the preparation leaves alone, by the closure of "lower-cases to" and "upper-cases to"
-- where each is one code point. The same literal, character for character, is gallerySecondHomes.js :: NAME_CASE.
create or replace function public._gallery_veil_name_case()
returns text language sql immutable as $$
  select ('"' ||
    'aA bB cC dD eE fF gG hH iI\u0131 jJ kK lL mM nN oO pP qQ rR sS tT uU vV wW xX yY zZ \u00df\u1e9e \u00e6\u00c6 \u00f0\u00d0 \u00f8\u00d8 \u00fe\u00de '
    '\u0111\u0110 \u0127\u0126 \u0142\u0141 \u014b\u014a \u0153\u0152 \u0167\u0166 \u0180\u0243 \u0183\u0182 \u0185\u0184 \u0188\u0187 \u018c\u018b '
    '\u0192\u0191 \u0195\u01f6 \u0199\u0198 \u019a\u023d \u019b\ua7dc \u019e\u0220 \u01a3\u01a2 \u01a5\u01a4 \u01a8\u01a7 \u01ad\u01ac \u01b4\u01b3 '
    '\u01b6\u01b5 \u01b9\u01b8 \u01bd\u01bc \u01bf\u01f7 \u01dd\u018e \u01e5\u01e4 \u021d\u021c \u0223\u0222 \u0225\u0224 \u023c\u023b \u023f\u2c7e '
    '\u0240\u2c7f \u0242\u0241 \u0247\u0246 \u0249\u0248 \u024b\u024a \u024d\u024c \u024f\u024e \u0250\u2c6f \u0251\u2c6d \u0252\u2c70 \u0253\u0181 '
    '\u0254\u0186 \u0256\u0189 \u0257\u018a \u0259\u018f \u025b\u0190 \u025c\ua7ab \u0260\u0193 \u0261\ua7ac \u0263\u0194 \u0264\ua7cb \u0265\ua78d '
    '\u0266\ua7aa \u0268\u0197 \u0269\u0196 \u026a\ua7ae \u026b\u2c62 \u026c\ua7ad \u026f\u019c \u0271\u2c6e \u0272\u019d \u0275\u019f \u027d\u2c64 '
    '\u0280\u01a6 \u0282\ua7c5 \u0283\u01a9 \u0287\ua7b1 \u0288\u01ae \u0289\u0244 \u028a\u01b1 \u028b\u01b2 \u028c\u0245 \u0292\u01b7 \u029d\ua7b2 '
    '\u029e\ua7b0 \u0371\u0370 \u0373\u0372 \u0377\u0376 \u037b\u03fd \u037c\u03fe \u037d\u03ff \u03b1\u0391 \u03b2\u0392 \u03b3\u0393 \u03b4\u0394 '
    '\u03b5\u0395 \u03b6\u0396 \u03b7\u0397 \u03b8\u0398 \u03b9\u0399 \u03ba\u039a \u03bb\u039b \u03bc\u039c \u03bd\u039d \u03be\u039e \u03bf\u039f '
    '\u03c0\u03a0 \u03c1\u03a1 \u03c3\u03a3\u03c2 \u03c4\u03a4 \u03c5\u03a5 \u03c6\u03a6 \u03c7\u03a7 \u03c8\u03a8 \u03c9\u03a9 \u03d7\u03cf \u03d9\u03d8 '
    '\u03db\u03da \u03dd\u03dc \u03df\u03de \u03e1\u03e0 \u03e3\u03e2 \u03e5\u03e4 \u03e7\u03e6 \u03e9\u03e8 \u03eb\u03ea \u03ed\u03ec \u03ef\u03ee '
    '\u03f3\u037f \u03f8\u03f7 \u03fb\u03fa \u0430\u0410 \u0431\u0411 \u0432\u0412\u1c80 \u0433\u0413 \u0434\u0414\u1c81 \u0435\u0415 \u0436\u0416 '
    '\u0437\u0417 \u0438\u0418 \u043a\u041a \u043b\u041b \u043c\u041c \u043d\u041d \u043e\u041e\u1c82 \u043f\u041f \u0440\u0420 \u0441\u0421\u1c83 '
    '\u0442\u0422\u1c84\u1c85 \u0443\u0423 \u0444\u0424 \u0445\u0425 \u0446\u0426 \u0447\u0427 \u0448\u0428 \u0449\u0429 \u044a\u042a\u1c86 \u044b\u042b '
    '\u044c\u042c \u044d\u042d \u044e\u042e \u044f\u042f \u0452\u0402 \u0454\u0404 \u0455\u0405 \u0456\u0406 \u0458\u0408 \u0459\u0409 \u045a\u040a '
    '\u045b\u040b \u045f\u040f \u0461\u0460 \u0463\u0462\u1c87 \u0465\u0464 \u0467\u0466 \u0469\u0468 \u046b\u046a \u046d\u046c \u046f\u046e \u0471\u0470 '
    '\u0473\u0472 \u0475\u0474 \u0479\u0478 \u047b\u047a \u047d\u047c \u047f\u047e \u0481\u0480 \u048b\u048a \u048d\u048c \u048f\u048e \u0491\u0490 '
    '\u0493\u0492 \u0495\u0494 \u0497\u0496 \u0499\u0498 \u049b\u049a \u049d\u049c \u049f\u049e \u04a1\u04a0 \u04a3\u04a2 \u04a5\u04a4 \u04a7\u04a6 '
    '\u04a9\u04a8 \u04ab\u04aa \u04ad\u04ac \u04af\u04ae \u04b1\u04b0 \u04b3\u04b2 \u04b5\u04b4 \u04b7\u04b6 \u04b9\u04b8 \u04bb\u04ba \u04bd\u04bc '
    '\u04bf\u04be \u04c4\u04c3 \u04c6\u04c5 \u04c8\u04c7 \u04ca\u04c9 \u04cc\u04cb \u04ce\u04cd \u04cf\u04c0 \u04d5\u04d4 \u04d9\u04d8 \u04e1\u04e0 '
    '\u04e9\u04e8 \u04f7\u04f6 \u04fb\u04fa \u04fd\u04fc \u04ff\u04fe \u0501\u0500 \u0503\u0502 \u0505\u0504 \u0507\u0506 \u0509\u0508 \u050b\u050a '
    '\u050d\u050c \u050f\u050e \u0511\u0510 \u0513\u0512 \u0515\u0514 \u0517\u0516 \u0519\u0518 \u051b\u051a \u051d\u051c \u051f\u051e \u0521\u0520 '
    '\u0523\u0522 \u0525\u0524 \u0527\u0526 \u0529\u0528 \u052b\u052a \u052d\u052c \u052f\u052e \u0561\u0531 \u0562\u0532 \u0563\u0533 \u0564\u0534 '
    '\u0565\u0535 \u0566\u0536 \u0567\u0537 \u0568\u0538 \u0569\u0539 \u056a\u053a \u056b\u053b \u056c\u053c \u056d\u053d \u056e\u053e \u056f\u053f '
    '\u0570\u0540 \u0571\u0541 \u0572\u0542 \u0573\u0543 \u0574\u0544 \u0575\u0545 \u0576\u0546 \u0577\u0547 \u0578\u0548 \u0579\u0549 \u057a\u054a '
    '\u057b\u054b \u057c\u054c \u057d\u054d \u057e\u054e \u057f\u054f \u0580\u0550 \u0581\u0551 \u0582\u0552 \u0583\u0553 \u0584\u0554 \u0585\u0555 '
    '\u0586\u0556 \u10d0\u1c90 \u10d1\u1c91 \u10d2\u1c92 \u10d3\u1c93 \u10d4\u1c94 \u10d5\u1c95 \u10d6\u1c96 \u10d7\u1c97 \u10d8\u1c98 \u10d9\u1c99 '
    '\u10da\u1c9a \u10db\u1c9b \u10dc\u1c9c \u10dd\u1c9d \u10de\u1c9e \u10df\u1c9f \u10e0\u1ca0 \u10e1\u1ca1 \u10e2\u1ca2 \u10e3\u1ca3 \u10e4\u1ca4 '
    '\u10e5\u1ca5 \u10e6\u1ca6 \u10e7\u1ca7 \u10e8\u1ca8 \u10e9\u1ca9 \u10ea\u1caa \u10eb\u1cab \u10ec\u1cac \u10ed\u1cad \u10ee\u1cae \u10ef\u1caf '
    '\u10f0\u1cb0 \u10f1\u1cb1 \u10f2\u1cb2 \u10f3\u1cb3 \u10f4\u1cb4 \u10f5\u1cb5 \u10f6\u1cb6 \u10f7\u1cb7 \u10f8\u1cb8 \u10f9\u1cb9 \u10fa\u1cba '
    '\u10fd\u1cbd \u10fe\u1cbe \u10ff\u1cbf \u13f8\u13f0 \u13f9\u13f1 \u13fa\u13f2 \u13fb\u13f3 \u13fc\u13f4 \u13fd\u13f5 \u1c88\ua64a\ua64b \u1c8a\u1c89 '
    '\u1d79\ua77d \u1d7d\u2c63 \u1d8e\ua7c6 \u1efb\u1efa \u1efd\u1efc \u1eff\u1efe \u214e\u2132 \u2184\u2183 \u2c30\u2c00 \u2c31\u2c01 \u2c32\u2c02 '
    '\u2c33\u2c03 \u2c34\u2c04 \u2c35\u2c05 \u2c36\u2c06 \u2c37\u2c07 \u2c38\u2c08 \u2c39\u2c09 \u2c3a\u2c0a \u2c3b\u2c0b \u2c3c\u2c0c \u2c3d\u2c0d '
    '\u2c3e\u2c0e \u2c3f\u2c0f \u2c40\u2c10 \u2c41\u2c11 \u2c42\u2c12 \u2c43\u2c13 \u2c44\u2c14 \u2c45\u2c15 \u2c46\u2c16 \u2c47\u2c17 \u2c48\u2c18 '
    '\u2c49\u2c19 \u2c4a\u2c1a \u2c4b\u2c1b \u2c4c\u2c1c \u2c4d\u2c1d \u2c4e\u2c1e \u2c4f\u2c1f \u2c50\u2c20 \u2c51\u2c21 \u2c52\u2c22 \u2c53\u2c23 '
    '\u2c54\u2c24 \u2c55\u2c25 \u2c56\u2c26 \u2c57\u2c27 \u2c58\u2c28 \u2c59\u2c29 \u2c5a\u2c2a \u2c5b\u2c2b \u2c5c\u2c2c \u2c5d\u2c2d \u2c5e\u2c2e '
    '\u2c5f\u2c2f \u2c61\u2c60 \u2c65\u023a \u2c66\u023e \u2c68\u2c67 \u2c6a\u2c69 \u2c6c\u2c6b \u2c73\u2c72 \u2c76\u2c75 \u2c81\u2c80 \u2c83\u2c82 '
    '\u2c85\u2c84 \u2c87\u2c86 \u2c89\u2c88 \u2c8b\u2c8a \u2c8d\u2c8c \u2c8f\u2c8e \u2c91\u2c90 \u2c93\u2c92 \u2c95\u2c94 \u2c97\u2c96 \u2c99\u2c98 '
    '\u2c9b\u2c9a \u2c9d\u2c9c \u2c9f\u2c9e \u2ca1\u2ca0 \u2ca3\u2ca2 \u2ca5\u2ca4 \u2ca7\u2ca6 \u2ca9\u2ca8 \u2cab\u2caa \u2cad\u2cac \u2caf\u2cae '
    '\u2cb1\u2cb0 \u2cb3\u2cb2 \u2cb5\u2cb4 \u2cb7\u2cb6 \u2cb9\u2cb8 \u2cbb\u2cba \u2cbd\u2cbc \u2cbf\u2cbe \u2cc1\u2cc0 \u2cc3\u2cc2 \u2cc5\u2cc4 '
    '\u2cc7\u2cc6 \u2cc9\u2cc8 \u2ccb\u2cca \u2ccd\u2ccc \u2ccf\u2cce \u2cd1\u2cd0 \u2cd3\u2cd2 \u2cd5\u2cd4 \u2cd7\u2cd6 \u2cd9\u2cd8 \u2cdb\u2cda '
    '\u2cdd\u2cdc \u2cdf\u2cde \u2ce1\u2ce0 \u2ce3\u2ce2 \u2cec\u2ceb \u2cee\u2ced \u2cf3\u2cf2 \u2d00\u10a0 \u2d01\u10a1 \u2d02\u10a2 \u2d03\u10a3 '
    '\u2d04\u10a4 \u2d05\u10a5 \u2d06\u10a6 \u2d07\u10a7 \u2d08\u10a8 \u2d09\u10a9 \u2d0a\u10aa \u2d0b\u10ab \u2d0c\u10ac \u2d0d\u10ad \u2d0e\u10ae '
    '\u2d0f\u10af \u2d10\u10b0 \u2d11\u10b1 \u2d12\u10b2 \u2d13\u10b3 \u2d14\u10b4 \u2d15\u10b5 \u2d16\u10b6 \u2d17\u10b7 \u2d18\u10b8 \u2d19\u10b9 '
    '\u2d1a\u10ba \u2d1b\u10bb \u2d1c\u10bc \u2d1d\u10bd \u2d1e\u10be \u2d1f\u10bf \u2d20\u10c0 \u2d21\u10c1 \u2d22\u10c2 \u2d23\u10c3 \u2d24\u10c4 '
    '\u2d25\u10c5 \u2d27\u10c7 \u2d2d\u10cd \ua641\ua640 \ua643\ua642 \ua645\ua644 \ua647\ua646 \ua649\ua648 \ua64d\ua64c \ua64f\ua64e \ua651\ua650 '
    '\ua653\ua652 \ua655\ua654 \ua657\ua656 \ua659\ua658 \ua65b\ua65a \ua65d\ua65c \ua65f\ua65e \ua661\ua660 \ua663\ua662 \ua665\ua664 \ua667\ua666 '
    '\ua669\ua668 \ua66b\ua66a \ua66d\ua66c \ua681\ua680 \ua683\ua682 \ua685\ua684 \ua687\ua686 \ua689\ua688 \ua68b\ua68a \ua68d\ua68c \ua68f\ua68e '
    '\ua691\ua690 \ua693\ua692 \ua695\ua694 \ua697\ua696 \ua699\ua698 \ua69b\ua69a \ua723\ua722 \ua725\ua724 \ua727\ua726 \ua729\ua728 \ua72b\ua72a '
    '\ua72d\ua72c \ua72f\ua72e \ua733\ua732 \ua735\ua734 \ua737\ua736 \ua739\ua738 \ua73b\ua73a \ua73d\ua73c \ua73f\ua73e \ua741\ua740 \ua743\ua742 '
    '\ua745\ua744 \ua747\ua746 \ua749\ua748 \ua74b\ua74a \ua74d\ua74c \ua74f\ua74e \ua751\ua750 \ua753\ua752 \ua755\ua754 \ua757\ua756 \ua759\ua758 '
    '\ua75b\ua75a \ua75d\ua75c \ua75f\ua75e \ua761\ua760 \ua763\ua762 \ua765\ua764 \ua767\ua766 \ua769\ua768 \ua76b\ua76a \ua76d\ua76c \ua76f\ua76e '
    '\ua77a\ua779 \ua77c\ua77b \ua77f\ua77e \ua781\ua780 \ua783\ua782 \ua785\ua784 \ua787\ua786 \ua78c\ua78b \ua791\ua790 \ua793\ua792 \ua794\ua7c4 '
    '\ua797\ua796 \ua799\ua798 \ua79b\ua79a \ua79d\ua79c \ua79f\ua79e \ua7a1\ua7a0 \ua7a3\ua7a2 \ua7a5\ua7a4 \ua7a7\ua7a6 \ua7a9\ua7a8 \ua7b5\ua7b4 '
    '\ua7b7\ua7b6 \ua7b9\ua7b8 \ua7bb\ua7ba \ua7bd\ua7bc \ua7bf\ua7be \ua7c1\ua7c0 \ua7c3\ua7c2 \ua7c8\ua7c7 \ua7ca\ua7c9 \ua7cd\ua7cc \ua7cf\ua7ce '
    '\ua7d1\ua7d0 \ua7d3\ua7d2 \ua7d5\ua7d4 \ua7d7\ua7d6 \ua7d9\ua7d8 \ua7db\ua7da \ua7f6\ua7f5 \uab53\ua7b3 \uab70\u13a0 \uab71\u13a1 \uab72\u13a2 '
    '\uab73\u13a3 \uab74\u13a4 \uab75\u13a5 \uab76\u13a6 \uab77\u13a7 \uab78\u13a8 \uab79\u13a9 \uab7a\u13aa \uab7b\u13ab \uab7c\u13ac \uab7d\u13ad '
    '\uab7e\u13ae \uab7f\u13af \uab80\u13b0 \uab81\u13b1 \uab82\u13b2 \uab83\u13b3 \uab84\u13b4 \uab85\u13b5 \uab86\u13b6 \uab87\u13b7 \uab88\u13b8 '
    '\uab89\u13b9 \uab8a\u13ba \uab8b\u13bb \uab8c\u13bc \uab8d\u13bd \uab8e\u13be \uab8f\u13bf \uab90\u13c0 \uab91\u13c1 \uab92\u13c2 \uab93\u13c3 '
    '\uab94\u13c4 \uab95\u13c5 \uab96\u13c6 \uab97\u13c7 \uab98\u13c8 \uab99\u13c9 \uab9a\u13ca \uab9b\u13cb \uab9c\u13cc \uab9d\u13cd \uab9e\u13ce '
    '\uab9f\u13cf \uaba0\u13d0 \uaba1\u13d1 \uaba2\u13d2 \uaba3\u13d3 \uaba4\u13d4 \uaba5\u13d5 \uaba6\u13d6 \uaba7\u13d7 \uaba8\u13d8 \uaba9\u13d9 '
    '\uabaa\u13da \uabab\u13db \uabac\u13dc \uabad\u13dd \uabae\u13de \uabaf\u13df \uabb0\u13e0 \uabb1\u13e1 \uabb2\u13e2 \uabb3\u13e3 \uabb4\u13e4 '
    '\uabb5\u13e5 \uabb6\u13e6 \uabb7\u13e7 \uabb8\u13e8 \uabb9\u13e9 \uabba\u13ea \uabbb\u13eb \uabbc\u13ec \uabbd\u13ed \uabbe\u13ee \uabbf\u13ef '
    '\ud801\udc28\ud801\udc00 \ud801\udc29\ud801\udc01 \ud801\udc2a\ud801\udc02 \ud801\udc2b\ud801\udc03 \ud801\udc2c\ud801\udc04 \ud801\udc2d\ud801\udc05 '
    '\ud801\udc2e\ud801\udc06 \ud801\udc2f\ud801\udc07 \ud801\udc30\ud801\udc08 \ud801\udc31\ud801\udc09 \ud801\udc32\ud801\udc0a \ud801\udc33\ud801\udc0b '
    '\ud801\udc34\ud801\udc0c \ud801\udc35\ud801\udc0d \ud801\udc36\ud801\udc0e \ud801\udc37\ud801\udc0f \ud801\udc38\ud801\udc10 \ud801\udc39\ud801\udc11 '
    '\ud801\udc3a\ud801\udc12 \ud801\udc3b\ud801\udc13 \ud801\udc3c\ud801\udc14 \ud801\udc3d\ud801\udc15 \ud801\udc3e\ud801\udc16 \ud801\udc3f\ud801\udc17 '
    '\ud801\udc40\ud801\udc18 \ud801\udc41\ud801\udc19 \ud801\udc42\ud801\udc1a \ud801\udc43\ud801\udc1b \ud801\udc44\ud801\udc1c \ud801\udc45\ud801\udc1d '
    '\ud801\udc46\ud801\udc1e \ud801\udc47\ud801\udc1f \ud801\udc48\ud801\udc20 \ud801\udc49\ud801\udc21 \ud801\udc4a\ud801\udc22 \ud801\udc4b\ud801\udc23 '
    '\ud801\udc4c\ud801\udc24 \ud801\udc4d\ud801\udc25 \ud801\udc4e\ud801\udc26 \ud801\udc4f\ud801\udc27 \ud801\udcd8\ud801\udcb0 \ud801\udcd9\ud801\udcb1 '
    '\ud801\udcda\ud801\udcb2 \ud801\udcdb\ud801\udcb3 \ud801\udcdc\ud801\udcb4 \ud801\udcdd\ud801\udcb5 \ud801\udcde\ud801\udcb6 \ud801\udcdf\ud801\udcb7 '
    '\ud801\udce0\ud801\udcb8 \ud801\udce1\ud801\udcb9 \ud801\udce2\ud801\udcba \ud801\udce3\ud801\udcbb \ud801\udce4\ud801\udcbc \ud801\udce5\ud801\udcbd '
    '\ud801\udce6\ud801\udcbe \ud801\udce7\ud801\udcbf \ud801\udce8\ud801\udcc0 \ud801\udce9\ud801\udcc1 \ud801\udcea\ud801\udcc2 \ud801\udceb\ud801\udcc3 '
    '\ud801\udcec\ud801\udcc4 \ud801\udced\ud801\udcc5 \ud801\udcee\ud801\udcc6 \ud801\udcef\ud801\udcc7 \ud801\udcf0\ud801\udcc8 \ud801\udcf1\ud801\udcc9 '
    '\ud801\udcf2\ud801\udcca \ud801\udcf3\ud801\udccb \ud801\udcf4\ud801\udccc \ud801\udcf5\ud801\udccd \ud801\udcf6\ud801\udcce \ud801\udcf7\ud801\udccf '
    '\ud801\udcf8\ud801\udcd0 \ud801\udcf9\ud801\udcd1 \ud801\udcfa\ud801\udcd2 \ud801\udcfb\ud801\udcd3 \ud801\udd97\ud801\udd70 \ud801\udd98\ud801\udd71 '
    '\ud801\udd99\ud801\udd72 \ud801\udd9a\ud801\udd73 \ud801\udd9b\ud801\udd74 \ud801\udd9c\ud801\udd75 \ud801\udd9d\ud801\udd76 \ud801\udd9e\ud801\udd77 '
    '\ud801\udd9f\ud801\udd78 \ud801\udda0\ud801\udd79 \ud801\udda1\ud801\udd7a \ud801\udda3\ud801\udd7c \ud801\udda4\ud801\udd7d \ud801\udda5\ud801\udd7e '
    '\ud801\udda6\ud801\udd7f \ud801\udda7\ud801\udd80 \ud801\udda8\ud801\udd81 \ud801\udda9\ud801\udd82 \ud801\uddaa\ud801\udd83 \ud801\uddab\ud801\udd84 '
    '\ud801\uddac\ud801\udd85 \ud801\uddad\ud801\udd86 \ud801\uddae\ud801\udd87 \ud801\uddaf\ud801\udd88 \ud801\uddb0\ud801\udd89 \ud801\uddb1\ud801\udd8a '
    '\ud801\uddb3\ud801\udd8c \ud801\uddb4\ud801\udd8d \ud801\uddb5\ud801\udd8e \ud801\uddb6\ud801\udd8f \ud801\uddb7\ud801\udd90 \ud801\uddb8\ud801\udd91 '
    '\ud801\uddb9\ud801\udd92 \ud801\uddbb\ud801\udd94 \ud801\uddbc\ud801\udd95 \ud803\udcc0\ud803\udc80 \ud803\udcc1\ud803\udc81 \ud803\udcc2\ud803\udc82 '
    '\ud803\udcc3\ud803\udc83 \ud803\udcc4\ud803\udc84 \ud803\udcc5\ud803\udc85 \ud803\udcc6\ud803\udc86 \ud803\udcc7\ud803\udc87 \ud803\udcc8\ud803\udc88 '
    '\ud803\udcc9\ud803\udc89 \ud803\udcca\ud803\udc8a \ud803\udccb\ud803\udc8b \ud803\udccc\ud803\udc8c \ud803\udccd\ud803\udc8d \ud803\udcce\ud803\udc8e '
    '\ud803\udccf\ud803\udc8f \ud803\udcd0\ud803\udc90 \ud803\udcd1\ud803\udc91 \ud803\udcd2\ud803\udc92 \ud803\udcd3\ud803\udc93 \ud803\udcd4\ud803\udc94 '
    '\ud803\udcd5\ud803\udc95 \ud803\udcd6\ud803\udc96 \ud803\udcd7\ud803\udc97 \ud803\udcd8\ud803\udc98 \ud803\udcd9\ud803\udc99 \ud803\udcda\ud803\udc9a '
    '\ud803\udcdb\ud803\udc9b \ud803\udcdc\ud803\udc9c \ud803\udcdd\ud803\udc9d \ud803\udcde\ud803\udc9e \ud803\udcdf\ud803\udc9f \ud803\udce0\ud803\udca0 '
    '\ud803\udce1\ud803\udca1 \ud803\udce2\ud803\udca2 \ud803\udce3\ud803\udca3 \ud803\udce4\ud803\udca4 \ud803\udce5\ud803\udca5 \ud803\udce6\ud803\udca6 '
    '\ud803\udce7\ud803\udca7 \ud803\udce8\ud803\udca8 \ud803\udce9\ud803\udca9 \ud803\udcea\ud803\udcaa \ud803\udceb\ud803\udcab \ud803\udcec\ud803\udcac '
    '\ud803\udced\ud803\udcad \ud803\udcee\ud803\udcae \ud803\udcef\ud803\udcaf \ud803\udcf0\ud803\udcb0 \ud803\udcf1\ud803\udcb1 \ud803\udcf2\ud803\udcb2 '
    '\ud803\udd70\ud803\udd50 \ud803\udd71\ud803\udd51 \ud803\udd72\ud803\udd52 \ud803\udd73\ud803\udd53 \ud803\udd74\ud803\udd54 \ud803\udd75\ud803\udd55 '
    '\ud803\udd76\ud803\udd56 \ud803\udd77\ud803\udd57 \ud803\udd78\ud803\udd58 \ud803\udd79\ud803\udd59 \ud803\udd7a\ud803\udd5a \ud803\udd7b\ud803\udd5b '
    '\ud803\udd7c\ud803\udd5c \ud803\udd7d\ud803\udd5d \ud803\udd7e\ud803\udd5e \ud803\udd7f\ud803\udd5f \ud803\udd80\ud803\udd60 \ud803\udd81\ud803\udd61 '
    '\ud803\udd82\ud803\udd62 \ud803\udd83\ud803\udd63 \ud803\udd84\ud803\udd64 \ud803\udd85\ud803\udd65 \ud806\udcc0\ud806\udca0 \ud806\udcc1\ud806\udca1 '
    '\ud806\udcc2\ud806\udca2 \ud806\udcc3\ud806\udca3 \ud806\udcc4\ud806\udca4 \ud806\udcc5\ud806\udca5 \ud806\udcc6\ud806\udca6 \ud806\udcc7\ud806\udca7 '
    '\ud806\udcc8\ud806\udca8 \ud806\udcc9\ud806\udca9 \ud806\udcca\ud806\udcaa \ud806\udccb\ud806\udcab \ud806\udccc\ud806\udcac \ud806\udccd\ud806\udcad '
    '\ud806\udcce\ud806\udcae \ud806\udccf\ud806\udcaf \ud806\udcd0\ud806\udcb0 \ud806\udcd1\ud806\udcb1 \ud806\udcd2\ud806\udcb2 \ud806\udcd3\ud806\udcb3 '
    '\ud806\udcd4\ud806\udcb4 \ud806\udcd5\ud806\udcb5 \ud806\udcd6\ud806\udcb6 \ud806\udcd7\ud806\udcb7 \ud806\udcd8\ud806\udcb8 \ud806\udcd9\ud806\udcb9 '
    '\ud806\udcda\ud806\udcba \ud806\udcdb\ud806\udcbb \ud806\udcdc\ud806\udcbc \ud806\udcdd\ud806\udcbd \ud806\udcde\ud806\udcbe \ud806\udcdf\ud806\udcbf '
    '\ud81b\ude60\ud81b\ude40 \ud81b\ude61\ud81b\ude41 \ud81b\ude62\ud81b\ude42 \ud81b\ude63\ud81b\ude43 \ud81b\ude64\ud81b\ude44 \ud81b\ude65\ud81b\ude45 '
    '\ud81b\ude66\ud81b\ude46 \ud81b\ude67\ud81b\ude47 \ud81b\ude68\ud81b\ude48 \ud81b\ude69\ud81b\ude49 \ud81b\ude6a\ud81b\ude4a \ud81b\ude6b\ud81b\ude4b '
    '\ud81b\ude6c\ud81b\ude4c \ud81b\ude6d\ud81b\ude4d \ud81b\ude6e\ud81b\ude4e \ud81b\ude6f\ud81b\ude4f \ud81b\ude70\ud81b\ude50 \ud81b\ude71\ud81b\ude51 '
    '\ud81b\ude72\ud81b\ude52 \ud81b\ude73\ud81b\ude53 \ud81b\ude74\ud81b\ude54 \ud81b\ude75\ud81b\ude55 \ud81b\ude76\ud81b\ude56 \ud81b\ude77\ud81b\ude57 '
    '\ud81b\ude78\ud81b\ude58 \ud81b\ude79\ud81b\ude59 \ud81b\ude7a\ud81b\ude5a \ud81b\ude7b\ud81b\ude5b \ud81b\ude7c\ud81b\ude5c \ud81b\ude7d\ud81b\ude5d '
    '\ud81b\ude7e\ud81b\ude5e \ud81b\ude7f\ud81b\ude5f \ud81b\udebb\ud81b\udea0 \ud81b\udebc\ud81b\udea1 \ud81b\udebd\ud81b\udea2 \ud81b\udebe\ud81b\udea3 '
    '\ud81b\udebf\ud81b\udea4 \ud81b\udec0\ud81b\udea5 \ud81b\udec1\ud81b\udea6 \ud81b\udec2\ud81b\udea7 \ud81b\udec3\ud81b\udea8 \ud81b\udec4\ud81b\udea9 '
    '\ud81b\udec5\ud81b\udeaa \ud81b\udec6\ud81b\udeab \ud81b\udec7\ud81b\udeac \ud81b\udec8\ud81b\udead \ud81b\udec9\ud81b\udeae \ud81b\udeca\ud81b\udeaf '
    '\ud81b\udecb\ud81b\udeb0 \ud81b\udecc\ud81b\udeb1 \ud81b\udecd\ud81b\udeb2 \ud81b\udece\ud81b\udeb3 \ud81b\udecf\ud81b\udeb4 \ud81b\uded0\ud81b\udeb5 '
    '\ud81b\uded1\ud81b\udeb6 \ud81b\uded2\ud81b\udeb7 \ud81b\uded3\ud81b\udeb8 \ud83a\udd22\ud83a\udd00 \ud83a\udd23\ud83a\udd01 \ud83a\udd24\ud83a\udd02 '
    '\ud83a\udd25\ud83a\udd03 \ud83a\udd26\ud83a\udd04 \ud83a\udd27\ud83a\udd05 \ud83a\udd28\ud83a\udd06 \ud83a\udd29\ud83a\udd07 \ud83a\udd2a\ud83a\udd08 '
    '\ud83a\udd2b\ud83a\udd09 \ud83a\udd2c\ud83a\udd0a \ud83a\udd2d\ud83a\udd0b \ud83a\udd2e\ud83a\udd0c \ud83a\udd2f\ud83a\udd0d \ud83a\udd30\ud83a\udd0e '
    '\ud83a\udd31\ud83a\udd0f \ud83a\udd32\ud83a\udd10 \ud83a\udd33\ud83a\udd11 \ud83a\udd34\ud83a\udd12 \ud83a\udd35\ud83a\udd13 \ud83a\udd36\ud83a\udd14 '
    '\ud83a\udd37\ud83a\udd15 \ud83a\udd38\ud83a\udd16 \ud83a\udd39\ud83a\udd17 \ud83a\udd3a\ud83a\udd18 \ud83a\udd3b\ud83a\udd19 \ud83a\udd3c\ud83a\udd1a '
    '\ud83a\udd3d\ud83a\udd1b \ud83a\udd3e\ud83a\udd1c \ud83a\udd3f\ud83a\udd1d \ud83a\udd40\ud83a\udd1e \ud83a\udd41\ud83a\udd1f \ud83a\udd42\ud83a\udd20 '
    '\ud83a\udd43\ud83a\udd21'
    || '"')::jsonb #>> '{}'
$$;

-- [212: NEW] public._gallery_veil_name_prep
-- THE PREPARATION. ASCII is returned as it is. THE SKEW: code points that Unicode 17.0 decomposes and PostgreSQL 16
-- (Unicode 15.0) does not (57, measured code point by code point) are written as their decomposition by both engines
-- before they normalise, so the answer does not turn on an engine's Unicode version; the three whose decomposition is
-- a quotation mark or a reverse solidus (U+FF02, U+FF3C, U+FE68: separators) are made spaces first, so a document's
-- text keeps its structure when it is prepared whole.
create or replace function public._gallery_veil_name_prep(t text)
returns text language plpgsql immutable as $$
declare
  k text;
  v text;
begin
  if t is null or t !~ '[^\x01-\x7f]' then return t; end if;
  if t ~ '[\ua7f1\U000105c9\U000105e4\U00011383\U00011385\U0001138e\U00011391\U000113c5\U000113c7\U000113c8\U00016121-\U00016128\U00016d68-\U00016d6a\U0001ccd6-\U0001ccf9]' then
    for k, v in select * from jsonb_each_text('{"\ua7f1":"S","\ud801\uddc9":"\ud801\uddd2\u0307","\ud801\udde4":"\ud801\uddda\u0307","\ud804\udf83":"\ud804\udf82\ud804\udfc9","\ud804\udf85":"\ud804\udf84\ud804\udfbb","\ud804\udf8e":"\ud804\udf8b\ud804\udfc2","\ud804\udf91":"\ud804\udf90\ud804\udfc9","\ud804\udfc5":"\ud804\udfc2\ud804\udfc2","\ud804\udfc7":"\ud804\udfc2\ud804\udfb8","\ud804\udfc8":"\ud804\udfc2\ud804\udfc9","\ud818\udd21":"\ud818\udd1e\ud818\udd1e","\ud818\udd22":"\ud818\udd1e\ud818\udd29","\ud818\udd23":"\ud818\udd1e\ud818\udd1f","\ud818\udd24":"\ud818\udd29\ud818\udd1f","\ud818\udd25":"\ud818\udd1e\ud818\udd20","\ud818\udd26":"\ud818\udd1e\ud818\udd1e\ud818\udd1f","\ud818\udd27":"\ud818\udd1e\ud818\udd29\ud818\udd1f","\ud818\udd28":"\ud818\udd1e\ud818\udd1e\ud818\udd20","\ud81b\udd68":"\ud81b\udd67\ud81b\udd67","\ud81b\udd69":"\ud81b\udd63\ud81b\udd67","\ud81b\udd6a":"\ud81b\udd63\ud81b\udd67\ud81b\udd67","\ud833\udcd6":"A","\ud833\udcd7":"B","\ud833\udcd8":"C","\ud833\udcd9":"D","\ud833\udcda":"E","\ud833\udcdb":"F","\ud833\udcdc":"G","\ud833\udcdd":"H","\ud833\udcde":"I","\ud833\udcdf":"J","\ud833\udce0":"K","\ud833\udce1":"L","\ud833\udce2":"M","\ud833\udce3":"N","\ud833\udce4":"O","\ud833\udce5":"P","\ud833\udce6":"Q","\ud833\udce7":"R","\ud833\udce8":"S","\ud833\udce9":"T","\ud833\udcea":"U","\ud833\udceb":"V","\ud833\udcec":"W","\ud833\udced":"X","\ud833\udcee":"Y","\ud833\udcef":"Z","\ud833\udcf0":"0","\ud833\udcf1":"1","\ud833\udcf2":"2","\ud833\udcf3":"3","\ud833\udcf4":"4","\ud833\udcf5":"5","\ud833\udcf6":"6","\ud833\udcf7":"7","\ud833\udcf8":"8","\ud833\udcf9":"9"}'::jsonb) loop
      t := replace(t, k, v);
    end loop;
  end if;
  return regexp_replace(normalize(translate(t, U&'\FF02\FF3C\FE68', '   '), NFKD), '[\u0300-\u036f]+', '', 'g');
end $$;

-- [212: NEW] public._gallery_veil_name_fold
-- THE FOLD OF A NAME: prepared, A-Z lowered by an explicit map, every run of separators one '_', none at either end.
-- The same string as the client's nameFold for every input.
create or replace function public._gallery_veil_name_fold(t text)
returns text language sql immutable as $$
  select btrim(regexp_replace(translate(public._gallery_veil_name_prep(coalesce(t, '')), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'),
                              '[' || public._gallery_veil_name_sep(true) || ']+', '_', 'g'), '_')
$$;

-- [212: NEW] public._gallery_veil_name_needle
-- The needle of a folded name, for a text made ready (_gallery_veil_name_ready: A-Z lowered, a run of separators one
-- '_'): each '_' one '_' or none; each letter that has another case outside A-Z the bracket of its class (`cls`, from
-- _gallery_veil_name_case, read only where the fold holds a character outside ASCII: within ASCII the one such letter
-- is i, whose class holds the dotless i, U+0131); "ss" and the sharp s are one.
create or replace function public._gallery_veil_name_needle(f text, cls jsonb)
returns text language sql immutable as $$
  select case when f ~ '[^\x01-\x7f]'
    then (select string_agg(coalesce(cls ->> c.ch, c.ch), '' order by c.o)
            from string_to_table(replace(replace(replace(f, chr(223), 'ss'), chr(7838), 'ss'), 'ss', '='), null) with ordinality c(ch, o))
    else replace(replace(replace(replace(f, 'ss', '='), 'i', '[i' || chr(305) || ']'), '_', '_?'), '=', '(?:ss|[' || chr(223) || chr(7838) || '])') end
$$;

-- [212: NEW] public._gallery_veil_name_search
-- THE SEARCH, built once a read from every name of the houses removed whole (`names`) and every open name (`opens`):
--   p      the pattern a text made ready matches when it holds a hidden name (the client's twin builds the same string)
--   raw    the names that are separators only: searched as written
--   blank  the open names that hold a hidden name and are not one, as patterns, longest first: cut out before the search
-- NULL when there is nothing to search for. A name's forms: itself, and itself without its bracketed qualifier.
create or replace function public._gallery_veil_name_search(names text[], opens text[])
returns jsonb language plpgsql immutable as $$
declare
  sep text := '[_"]';   -- a word boundary in a text made ready: the one '_' a run of separators became, or a string's end
  -- an end of a name that asks a word boundary: a letter or digit of an alphabet that separates its words
  bnd text := '[a-z0-9\u00c0-\u058f\u10a0-\u10ff\u1c80-\u1cbf\u1e00-\u1fff\u2c00-\u2dff\ua640-\ua7ff]';
  qual text := '(?:[ \t]*[(\[][^()\[\]]*[)\]])+[ \t]*$';
  cls jsonb := '{}';   -- {a character: its needle}
  cv text := '';       -- every member of a case class but its first
  cc text := '';       -- and, place for place, that class's first
  raws jsonb;
  keys text[];
  p text;
  blank jsonb := '[]';
begin
  -- the case classes are read only where a name holds a character outside ASCII (the table is 2,067 letters)
  if exists (select 1 from unnest(names || opens) x where x ~ '[^\x01-\x7f]') then
    select jsonb_object_agg(b.ch, case when length(a.g2) > 1 then '[' || a.g2 || ']' else a.g2 end),
           coalesce(string_agg(b.ch, '' order by a.o1, b.o2) filter (where b.o2 > 1), ''),
           coalesce(string_agg(left(a.g, 1), '' order by a.o1, b.o2) filter (where b.o2 > 1), '')
      into cls, cv, cc
      from (select g, o1, translate(g, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', '') as g2 from string_to_table(public._gallery_veil_name_case(), ' ') with ordinality t(g, o1)) a,
           string_to_table(a.g, null) with ordinality b(ch, o2);
    cls := cls || jsonb_build_object('_', '_?', '=', '(?:ss|[' || chr(223) || chr(7838) || '])');
  end if;
  with n1 as (select distinct x as n, public._gallery_veil_name_prep(x) as pn from unnest(names) x where x is not null and x <> ''),
       n2 as (select n, pn, public._gallery_veil_name_fold(pn) as f from n1),
       fs as (select f from n2 union select public._gallery_veil_name_fold(regexp_replace(pn, qual, '')) from n2 where pn ~ '[)\]]'),
       fm as (select f, left(f, 1) ~ bnd as lb, right(f, 1) ~ bnd as rb,
                     replace(replace(case when f ~ '[^\x01-\x7f]' then translate(f, cv, cc) else f end, chr(223), 'ss'), '_', '') as k,
                     public._gallery_veil_name_needle(f, cls) as needle
                from fs where f <> ''),
       g as (select lb, rb, string_agg(needle, '|' order by f collate "C") as alt from fm group by lb, rb)
  select (select coalesce(jsonb_agg(n order by n collate "C"), '[]') from n2 where f = ''),
         (select coalesce(array_agg(distinct k), '{}') from fm),
         (select string_agg(case when lb and rb then '(?:^|' || sep || ')(?:' || alt || ')(?:e?s)?(?:' || sep || '|$)'
                                 when lb then '(?:^|' || sep || ')(?:' || alt || ')'
                                 when rb then '(?:' || alt || ')(?:e?s)?(?:' || sep || '|$)'
                                 else '(?:' || alt || ')' end, '|' order by lb desc, rb desc) from g)
    into raws, keys, p;
  if p is null and raws = '[]' then return null; end if;
  if p is not null and cardinality(opens) > 0 then
    -- the open names that hold a hidden name (asked together: each made ready, between quotation marks, and `p` run
    -- once over them all, a mark set before each name it finds), less those that ARE a hidden name (the same letters)
    with o1 as (select distinct public._gallery_veil_name_ready(translate(x, '"', ' '), null) as po from unnest(opens) x where x is not null and x <> ''),
         held as (select distinct btrim(replace(m[1], chr(1), ''), '"') as po
                    from regexp_matches(regexp_replace((select coalesce(string_agg('"' || po || '"', ''), '') from o1), p, chr(1) || '\&', 'g'), chr(1) || '?"[^"]*"', 'g') m
                   where position(chr(1) in m[1]) > 0),
         o2 as (select distinct public._gallery_veil_name_fold(po) as f from held),
         o3 as (select f, left(f, 1) ~ bnd as lb, right(f, 1) ~ bnd as rb,
                       replace(replace(case when f ~ '[^\x01-\x7f]' then translate(f, cv, cc) else f end, chr(223), 'ss'), '_', '') as k,
                       public._gallery_veil_name_needle(f, cls) as needle
                  from o2 where f <> '')
    select coalesce(jsonb_agg(case when lb then '((?:^|' || sep || '))' else '()' end || needle || case when rb then '(?:e?s)?(?=' || sep || '|$)' else '' end
                              order by length(k) desc, k collate "C", f collate "C"), '[]')
      into blank from o3 where not (k = any(keys));
  end if;
  return jsonb_build_object('p', p, 'raw', raws, 'blank', blank);
end $$;

-- [212: NEW] public._gallery_veil_name_ready
-- A text made ready for the search (THE FOLD of a text): prepared; A-Z lowered by an explicit map (never an engine's
-- lower(): the other letters keep their case, which is the needle's); every run of separators one '_' (the quotation
-- mark aside: in a document's text it is where a string ends, and a string asked alone holds none by then); then each
-- open name that holds a hidden one cut out, longest first (in its place the Kelvin sign, U+212A, which no prepared
-- text holds and no needle names: the preparation writes it K).
create or replace function public._gallery_veil_name_ready(t text, blank jsonb)
returns text language plpgsql immutable as $$
declare
  b text;
begin
  t := regexp_replace(translate(public._gallery_veil_name_prep(t), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'),
                      '[' || public._gallery_veil_name_sep(false) || ']+', '_', 'g');
  if blank is null or blank = '[]' then return t; end if;
  for b in select jsonb_array_elements_text(blank) loop
    t := regexp_replace(t, b, '\1' || chr(8490), 'g');
  end loop;
  return t;
end $$;

-- [212: NEW] public._gallery_veil_name_hits
-- THE WHOLE TEXT, ASKED FIRST, AND THE STRINGS THAT HOLD A NAME. The value's text, each escape made one space (an
-- escape stands for a quotation mark, a reverse solidus or a control character: separators all), made ready ONCE; no
-- match of `p`, and '{}' is the answer (a superset: it reads the punctuation between two strings as separators). Else
-- what stands between two strings is dropped, so every string and key is one "..." after another; `p` is run over
-- that once more, a mark (U+0001, which a text made ready never holds) set before each name it finds; and the strings
-- that hold a mark are the answer: {the string as made ready: true}. Whether one string or key holds a hidden name is
-- from here on a look-up among these (_gallery_veil_name_hit): the alternation is never run a string at a time.
create or replace function public._gallery_veil_name_hits(v jsonb, srch jsonb)
returns jsonb language plpgsql immutable as $$
declare
  n text := v::text;
  p text := srch ->> 'p';
begin
  if p is null then return '{}'; end if;
  if position('\' in n) > 0 then n := regexp_replace(n, '\\(?:u[0-9a-fA-F]{4}|.)', ' ', 'g'); end if;
  n := public._gallery_veil_name_ready(n, srch -> 'blank');
  if n !~ p then return '{}'; end if;
  n := regexp_replace(regexp_replace(n, '"([^"]*)"[^"]*', '"\1"', 'g'), p, chr(1) || '\&', 'g');
  return coalesce((select jsonb_object_agg(z.h, true)
                     from (select distinct btrim(replace(m[1], chr(1), ''), '"') as h
                             from regexp_matches(n, chr(1) || '?"[^"]*"', 'g') m where position(chr(1) in m[1]) > 0) z), '{}');
end $$;

-- [212: NEW] public._gallery_veil_name_hit
-- One string or key holds a hidden name: made ready as the document's text was (a quotation mark, a reverse solidus
-- and a control character each one space, as their escapes were), it is one of `hits`; or it holds, as written, a name
-- that is separators only. (The client's twin asks the pattern of each string; the answers are the same: the guard.)
create or replace function public._gallery_veil_name_hit(t text, hits jsonb, blank jsonb, raws jsonb)
returns boolean language sql immutable as $$
  select hits ? public._gallery_veil_name_ready(translate(t, E'"\\\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x1a\x1b\x1c\x1d\x1e\x1f',
                                                             repeat(' ', 33)), blank)
      or (raws <> '[]' and exists (select 1 from jsonb_array_elements_text(raws) r where position(r in t) > 0))
$$;

-- [212: NEW] public._gallery_veil_named
-- Some key or string of the value, at any depth, holds a hidden name (exact, and without a call a level: the value's
-- strings are read off its text one token at a time).
create or replace function public._gallery_veil_named(v jsonb, hits jsonb, blank jsonb, raws jsonb)
returns boolean language sql immutable as $$
  select coalesce(jsonb_typeof(v) in ('string', 'object', 'array') and (hits <> '{}' or raws <> '[]')
    and exists (select 1 from regexp_matches(v::text, '"(?:[^"\\]|\\.)*"', 'g') m
                 where public._gallery_veil_name_hit(m[1]::jsonb #>> '{}', hits, blank, raws)), false)
$$;

-- [212: NEW] public._gallery_veil_name_near
-- A container may hold a hit (a superset, for the walk: its text made ready holds one of the hit strings, or its text
-- holds a separators-only name as JSON writes it).
create or replace function public._gallery_veil_name_near(v jsonb, hits jsonb, blank jsonb, raws jsonb)
returns boolean language plpgsql immutable as $$
declare
  txt text := v::text;
  n text;
begin
  if raws <> '[]' and exists (select 1 from jsonb_array_elements(raws) r where position(substr(r::text, 2, length(r::text) - 2) in txt) > 0) then return true; end if;
  if hits = '{}' then return false; end if;
  n := public._gallery_veil_name_ready(case when position('\' in txt) > 0 then regexp_replace(txt, '\\(?:u[0-9a-fA-F]{4}|.)', ' ', 'g') else txt end, blank);
  return exists (select 1 from jsonb_object_keys(hits) h where position(h in n) > 0);
end $$;

-- [212: NEW] public._gallery_veil_name_floor
-- THE FLOORS of a record, by the list it stands in (`list`: that list's path): the `id` and `name` of a house still
-- listed (its `label` where it has no name), a shown power's `faction` and `name`. Never asked, never taken.
create or replace function public._gallery_veil_name_floor(list jsonb, rec jsonb)
returns jsonb language sql immutable as $$
  select case
    when jsonb_typeof(rec) is distinct from 'object' then '[]'::jsonb
    when list = '["institutions"]'::jsonb then case when public._gallery_veil_str(rec -> 'name') <> '' then '["id", "name"]'::jsonb else '["id", "name", "label"]'::jsonb end
    when list = '["powerStructure", "factions"]'::jsonb and not coalesce(rec -> 'hidden' = 'true'::jsonb, false) then '["faction", "name"]'::jsonb
    else '[]'::jsonb end
$$;

-- [212: NEW] public._gallery_veil_name_taken
-- An entry of a list leaves it whole when its own `id` or `name` is taken: the key or its string holds a hidden name
-- (or, `bound`: its value is a container at the bound that holds one). A floor is never taken.
create or replace function public._gallery_veil_name_taken(rec jsonb, fl jsonb, bound boolean, hits jsonb, blank jsonb, raws jsonb)
returns boolean language sql immutable as $$
  select exists (select 1 from unnest(array['id', 'name']) k
                  where rec ? k and not (fl ? k)
                    and (public._gallery_veil_name_hit(k, hits, blank, raws)
                         or case jsonb_typeof(rec -> k) when 'string' then public._gallery_veil_name_hit(rec ->> k, hits, blank, raws)
                                                        when 'object' then bound and public._gallery_veil_named(rec -> k, hits, blank, raws)
                                                        when 'array' then bound and public._gallery_veil_named(rec -> k, hits, blank, raws)
                                                        else false end))
$$;

-- [212: NEW] public._gallery_veil_name_sweep
-- A HIDDEN NAME, ANYWHERE (the chair's ruling (a); the design's free-prose rule): every key and every string of the
-- projection that holds a hidden name leaves it (a record loses the key, a list the entry; an entry whose own `id` or
-- `name` is taken leaves its list whole), the floors aside. WALKED WITHOUT A CALL A LEVEL, as 211's
-- _gallery_veil_drop_hooks walks: a recursive query, iterated by the executor, finds the containers ON THE WAY to a
-- hit (it descends only into a child that may hold one, _gallery_veil_name_near, and never below a floor), and those
-- alone are rebuilt, deepest first. THE BOUND: the root is level 0; a container at level 64 is not walked: it is
-- withheld whole if it holds a hit at any depth (the closed answer), and sent as it is if it holds none.
create or replace function public._gallery_veil_name_sweep(s jsonb, hits jsonb, blank jsonb, raws jsonb)
returns jsonb language plpgsql immutable as $$
declare
  wp jsonb[];   -- the nodes on the way, deepest first: path (an array of keys and indexes)
  wd int[];     -- their level
  wv jsonb[];   -- their value
  wf jsonb[];   -- their floors
  np jsonb[];   -- the nodes rebuilt at one level: path
  nv jsonb[];   -- and new value
  maps jsonb := '{}';  -- the level below, rebuilt: {parent path: {key or index: new value}}
  ix int := 1;
  ex int;
  n int;
begin
  if hits = '{}' and raws = '[]' then return s; end if;
  with recursive w(p, d, v, f) as (
      select '[]'::jsonb, 0, s, '["name"]'::jsonb
    union all
      select w.p || to_jsonb(c.k), w.d + 1, c.v, c.f
        from w, lateral (
          select x.k, x.v, '[]'::jsonb as f
            from jsonb_each(case when jsonb_typeof(w.v) = 'object' then w.v else '{}' end) x(k, v)
           where jsonb_typeof(x.v) in ('object', 'array') and not (w.f ? x.k) and public._gallery_veil_name_near(x.v, hits, blank, raws)
          union all
          select (y.o - 1)::text, y.v, public._gallery_veil_name_floor(w.p, y.v)
            from jsonb_array_elements(case when jsonb_typeof(w.v) = 'array' then w.v else '[]' end) with ordinality y(v, o)
           where jsonb_typeof(y.v) in ('object', 'array') and public._gallery_veil_name_near(y.v, hits, blank, raws)) c
       where w.d < 63
  )
  select array_agg(p order by d desc, p), array_agg(d order by d desc, p), array_agg(v order by d desc, p), array_agg(f order by d desc, p) into wp, wd, wv, wf from w;
  n := array_length(wd, 1);
  while ix <= n loop
    ex := ix;
    while ex < n and wd[ex + 1] = wd[ix] loop ex := ex + 1; end loop;
    select array_agg(q.p), array_agg(q.v) into np, nv from (
      select a.p, case when jsonb_typeof(a.v) = 'object' then
          (select coalesce(jsonb_object_agg(x.k, coalesce(l.mm -> x.k, x.v)), '{}')
             from jsonb_each(a.v) x(k, v)
            where a.f ? x.k
               or not (public._gallery_veil_name_hit(x.k, hits, blank, raws)
                       or case jsonb_typeof(x.v) when 'string' then public._gallery_veil_name_hit(x.v #>> '{}', hits, blank, raws)
                                                 when 'object' then wd[ix] + 1 >= 64 and public._gallery_veil_named(x.v, hits, blank, raws)
                                                 when 'array' then wd[ix] + 1 >= 64 and public._gallery_veil_named(x.v, hits, blank, raws)
                                                 else false end))
        else
          (select coalesce(jsonb_agg(coalesce(l.mm -> ((y.o - 1)::text), y.v) order by y.o), '[]')
             from jsonb_array_elements(a.v) with ordinality y(v, o)
            where not case jsonb_typeof(y.v)
                        when 'string' then public._gallery_veil_name_hit(y.v #>> '{}', hits, blank, raws)
                        when 'array' then wd[ix] + 1 >= 64 and public._gallery_veil_named(y.v, hits, blank, raws)
                        when 'object' then case when wd[ix] + 1 >= 64 then public._gallery_veil_named(y.v, hits, blank, raws)
                                                else public._gallery_veil_name_taken(y.v, public._gallery_veil_name_floor(a.p, y.v), wd[ix] + 2 >= 64, hits, blank, raws) end
                        else false end)
        end as v
        from unnest(wp[ix:ex], wv[ix:ex], wf[ix:ex]) a(p, v, f), lateral (select coalesce(maps -> (a.p::text), '{}') as mm) l) q;
    select coalesce(jsonb_object_agg(g.pp, g.m), '{}') into maps
      from (select (x.p - -1)::text as pp, jsonb_object_agg(x.p ->> -1, x.v) as m from unnest(np, nv) x(p, v) where jsonb_array_length(x.p) > 0 group by 1) g;
    ix := ex + 1;
  end loop;
  return nv[1];
end $$;

-- [212: NEW] public._gallery_veil_hidden_name
-- A processing name that a house removed whole answers to, and no house left open does: that house's name. A
-- house answers to its own name or by the engine's processor match (computeActiveChains.js :: fuzzyProcessorMatch:
-- the lower-cased name holds the pattern's first twelve characters), so 'Black market bazaar' is 'Black market'.
-- COHERENCE-VEIL-9: the engine's match is id-first (computeActiveChains.js :: institutionMatchesProcessor), so a stamped
-- house answers by the name it was born with: by its catalogue identity, the fold of that name, holding the fold of the
-- pattern's first twelve characters (gallerySecondHomes.js :: answersByBirth). `births`: the identities of the houses
-- removed whole; `opens`: each house still listed, {cid} where it is stamped (it answers as the engine reads it), else
-- {name}.
create or replace function public._gallery_veil_hidden_name(x jsonb, gone jsonb, births text[], opens jsonb)
returns boolean language sql immutable as $$
  select (exists (select 1 from jsonb_object_keys(gone) g where g = q.v or position(left(lower(q.v), 12) in lower(g)) > 0)
          or (q.f <> '' and exists (select 1 from unnest(births) b where position(q.f in b) > 0)))
     and not exists (select 1 from jsonb_array_elements(case when jsonb_typeof(opens) = 'array' then opens else '[]' end) o
                      where case when o ? 'cid' then q.f <> '' and position(q.f in (o ->> 'cid')) > 0
                                 else (o ->> 'name') = q.v or position(left(lower(q.v), 12) in lower(o ->> 'name')) > 0 end)
    from (select public._gallery_veil_str(x) as v, public._gallery_veil_fold(left(public._gallery_veil_str(x), 12)) as f) q
$$;

-- [212: NEW] public._gallery_veil_sources
-- What each second home's source IS and said, read BEFORE the eyes run. COHERENCE-VEIL-10 (V7-2), by identity:
-- EVERY tie with its two eyes [{n1, n2, ty, d, t, ds, ts}] (a copy is its tie's whether that tie is shut or open);
-- whether ANY current tension's description eye is shut (tension_shut); every event with its lasting-effects eye
-- [{n, ty, y, le}] (an annotation is its event's). And for the words: each house's shut eyes by name
-- {name: {desc, fn}}, and (COHERENCE-VEIL-8) the pieces of every shut string of an event.
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
                        from ties), '[]'),
    'tension_shut', coalesce((select bool_or(is_shut) from eyes where kind = 'tension'), false),
    'events', coalesce((select jsonb_agg(jsonb_build_object('n', card -> 'name', 'ty', card -> 'type', 'y', card -> 'yearsAgo', 'le', is_shut))
                          from evs where eye = 'lastingEffects'), '[]'),
    'event_pieces', coalesce((select to_jsonb(array_agg(p)) from evs,
                                     unnest(public._gallery_veil_pieces(case eye when 'description' then jsonb_build_array(card -> 'description', card -> 'desc')
                                                                                 when 'lastingEffects' then card -> 'lastingEffects' else card -> 'plotHooks' end)) p
                               where is_shut), '[]'),
    'houses', coalesce((select jsonb_object_agg(name, jsonb_build_object('desc', d, 'fn', f)) from (
        select card ->> 'name' as name, bool_or(is_shut) filter (where eye = 'description') as d, bool_or(is_shut) filter (where eye = 'function') as f
          from eyes where kind = 'institution' and public._gallery_veil_str(card -> 'name') <> '' group by 1) h), '{}'))
$$;

-- [212: NEW] public._gallery_veil_tie_pieces
-- The pieces of the shut eyes of some ties, as those ties now stand (a tie with no shut eye gives none).
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
  ps jsonb;
  pst text;
  stored text[] := '{}';
  ps_named boolean;
  ps_ends boolean;
  any_shut boolean;
  stressed boolean;
  evs jsonb := coalesce(src -> 'events', '[]');
  ev_pieces text[];
  k text;
  v jsonb;
  open_names text[];
  pth text[];
  nm text[];
  srch jsonb;
  hits jsonb := '{}';
  blank jsonb := '[]';
  raws jsonb := '[]';
  hot boolean := false;
  listed text[];
  fk text;
  kw jsonb;
  births text[] := array(select jsonb_array_elements_text(case when jsonb_typeof(src -> 'births') = 'array' then src -> 'births' else '[]' end));
  -- COHERENCE-VEIL-10 (V7-9): the label of each house removed whole that has no name (its label is its name)
  labels text[] := array(select jsonb_array_elements_text(case when jsonb_typeof(src -> 'labels') = 'array' then src -> 'labels' else '[]' end));
  opens jsonb;
  acc_cid text[];
  acc_low text[];
  used boolean[];
  kept jsonb;
  ent jsonb;
  j int;
begin
  -- COHERENCE-VEIL-10 (V7-2): THE COMPOSED HOMES, BY IDENTITY (the section's header states each rule)
  if jsonb_array_length(ties) > 0 then
    -- prominentRelationship is ONE tie's copy (settlementNarrative.js :: genRelNarrative: npc1, npc2 and type are that
    -- tie's two ends and type; full its description; tension its tension; phrasing a line written from one of the two):
    -- its tie is the one with the same two ends and type, or whose text a copy still equals. A copy that names no tie
    -- follows every tie's eyes (closed)
    pr := s -> 'prominentRelationship';
    if jsonb_typeof(pr) = 'object' then
      select coalesce(jsonb_agg(t), '[]') into own from jsonb_array_elements(ties) t
       where (public._gallery_veil_str(t -> 'n1') = public._gallery_veil_str(pr -> 'npc1') and public._gallery_veil_str(t -> 'n2') = public._gallery_veil_str(pr -> 'npc2')
              and public._gallery_veil_str(t -> 'ty') = public._gallery_veil_str(pr -> 'type'))
          or (public._gallery_veil_str(pr -> 'full') <> '' and t -> 'd' = pr -> 'full')
          or (public._gallery_veil_str(pr -> 'tension') <> '' and t -> 't' = pr -> 'tension');
      if jsonb_array_length(own) = 0 then own := ties; end if;
      -- THE STORED WORDING: what the copies that go said (the tie's description and tension as born), read before they go
      stored := public._gallery_veil_pieces(jsonb_build_array(
        case when exists (select 1 from jsonb_array_elements(own) t where coalesce((t ->> 'ds')::boolean, false)) then pr -> 'full' end,
        case when exists (select 1 from jsonb_array_elements(own) t where coalesce((t ->> 'ts')::boolean, false)) then pr -> 'tension' end));
      -- the phrasing goes with either eye, unless it IS the tension as that now stands with its eye open (then it
      -- sends nothing the open eye does not)
      if exists (select 1 from jsonb_array_elements(own) t
                  where coalesce((t ->> 'ts')::boolean, false)
                     or (coalesce((t ->> 'ds')::boolean, false)
                         and not coalesce(jsonb_typeof(pr -> 'phrasing') = 'string' and (t -> 't') = (pr -> 'phrasing'), false))) then
        pr := pr - 'phrasing';
      end if;
      if exists (select 1 from jsonb_array_elements(own) t where coalesce((t ->> 'ds')::boolean, false)) then pr := pr - 'full'; end if;
      if exists (select 1 from jsonb_array_elements(own) t where coalesce((t ->> 'ts')::boolean, false)) then pr := pr - 'tension'; end if;
      s := jsonb_set(s, '{prominentRelationship}', pr);
    end if;
    -- pressureSentence is the first of: the stress's line, the succession line, A TIE'S PHRASING (a draw of its own:
    -- any tie), the power structure's recentConflict, a small place's line (narrativeGenerator.js ::
    -- generatePressureSentence). The record keeps no mark of which. (1) BY ITS ENDS: it names the two ends of a tie
    -- (a tie's phrasing does: 26 of the 27 born from a tie on 240 towns): that tie's eyes, as the phrasing.
    -- (2) NO OTHER ACCOUNT: it names no tie's two ends, the town is under no stress and it is not recentConflict:
    -- it may be any tie's, so any tie's shut eye takes it. (3) THE WORDS, both directions, current and stored
    ps := s -> 'pressureSentence';
    if jsonb_typeof(ps) = 'string' then
      pst := ps #>> '{}';
      select coalesce(bool_or(q.named), false),
             coalesce(bool_or(q.named and (q.ts or (q.ds and q.t is distinct from ps))), false),
             coalesce(bool_or(q.ds or q.ts), false)
        into ps_named, ps_ends, any_shut
        from (select public._gallery_veil_str(t -> 'n1') <> '' and public._gallery_veil_str(t -> 'n2') <> ''
                     and position(public._gallery_veil_str(t -> 'n1') in pst) > 0 and position(public._gallery_veil_str(t -> 'n2') in pst) > 0 as named,
                     coalesce((t ->> 'ds')::boolean, false) as ds, coalesce((t ->> 'ts')::boolean, false) as ts, t -> 't' as t
                from jsonb_array_elements(ties) t) q;
      stressed := (jsonb_typeof(s -> 'stress') = 'object' and public._gallery_veil_str(s #> '{stress,type}') <> '')
                  or exists (select 1 from jsonb_array_elements(case when jsonb_typeof(s -> 'stress') = 'array' then s -> 'stress' else '[]' end) x
                              where jsonb_typeof(x) = 'object' and public._gallery_veil_str(x -> 'type') <> '');
      if ps_ends
         or (any_shut and not ps_named and not stressed
             and not coalesce(jsonb_typeof(s #> '{powerStructure,recentConflict}') = 'string' and (s #> '{powerStructure,recentConflict}') = ps, false))
         or public._gallery_veil_embeds(ps, public._gallery_veil_tie_pieces(ties) || stored) then
        s := s - 'pressureSentence';
      end if;
    end if;
  end if;
  -- history.siegeNarrative tells of a current tension (siegeCapability.js: the first one's description): it goes with
  -- ANY current tension whose description eye is shut, whatever that tension now says (the words can add nothing: they
  -- were the shut tensions' own)
  if coalesce((src ->> 'tension_shut')::boolean, false) and jsonb_typeof(s -> 'history') = 'object' then
    s := s #- '{history,siegeNarrative}';
  end if;
  -- the legacy annotation is built from ITS EVENT's first lasting effect (legacyGenerator.js :: annotationBody; the
  -- entry carries the event's name, type and years): it goes with that event's lasting-effects eye. Its event: the
  -- one of the same name (`eventName`; `event` in an older spelling); none, the one of the same type and years (an
  -- event renamed since); none at all, every event (closed). And by the words (COHERENCE-VEIL-8, T1), both
  -- directions: a shut string of any event inside it. The entry's event name, type and years, the event card's
  -- floor, stay
  if jsonb_typeof(s -> 'history') = 'object' and jsonb_typeof(s #> '{history,legacyAnnotations}') = 'array'
     and (jsonb_array_length(coalesce(src -> 'event_pieces', '[]')) > 0
          or exists (select 1 from jsonb_array_elements(evs) e where coalesce((e ->> 'le')::boolean, false))) then
    ev_pieces := array(select jsonb_array_elements_text(coalesce(src -> 'event_pieces', '[]')));
    s := jsonb_set(s, '{history,legacyAnnotations}', (
      select coalesce(jsonb_agg(case when jsonb_typeof(a) = 'object' and (
                 coalesce((select case when bool_or(m.by_name) then bool_or(m.by_name and m.le)
                                       when bool_or(m.by_type) then bool_or(m.by_type and m.le)
                                       else bool_or(m.le) end
                             from (select nm.v <> '' and public._gallery_veil_str(e -> 'n') = nm.v as by_name,
                                          ty.v <> '' and public._gallery_veil_str(e -> 'ty') = ty.v
                                            and coalesce(jsonb_typeof(a -> 'yearsAgo') = 'number' and jsonb_typeof(e -> 'y') = 'number' and (e -> 'y') = (a -> 'yearsAgo'), false) as by_type,
                                          coalesce((e ->> 'le')::boolean, false) as le
                                     from jsonb_array_elements(evs) e,
                                          (select case when public._gallery_veil_str(a -> 'eventName') <> '' then public._gallery_veil_str(a -> 'eventName')
                                                       else public._gallery_veil_str(a -> 'event') end as v) nm,
                                          (select case when public._gallery_veil_str(a -> 'eventType') <> '' then public._gallery_veil_str(a -> 'eventType')
                                                       else public._gallery_veil_str(a -> 'type') end as v) ty) m), false)
                 or public._gallery_veil_embeds(a -> 'annotation', ev_pieces))
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
  if gone = '{}' and cardinality(births) = 0 and cardinality(labels) = 0 then return s; end if;
  open_names := array(select public._gallery_veil_str(e -> 'name')
                        from jsonb_array_elements(case when jsonb_typeof(s -> 'institutions') = 'array' then s -> 'institutions' else '[]' end) e
                       where jsonb_typeof(e) = 'object');
  -- COHERENCE-VEIL-9: each house still listed as the engine's processor match reads it (stamped: by its identity)
  opens := coalesce((select jsonb_agg(case when jsonb_typeof(e -> 'catalogId') = 'string' and (e ->> 'catalogId') <> ''
                                           then jsonb_build_object('cid', e ->> 'catalogId') else jsonb_build_object('name', public._gallery_veil_str(e -> 'name')) end order by o)
                       from jsonb_array_elements(case when jsonb_typeof(s -> 'institutions') = 'array' then s -> 'institutions' else '[]' end) with ordinality y(e, o)
                      where jsonb_typeof(e) = 'object'), '[]');
  -- every name of a house removed whole: its own, its label where it has no name (COHERENCE-VEIL-10), the one it was
  -- born with (COHERENCE-VEIL-9: its catalogue identity), and each processing name only it answers to
  nm := array(select jsonb_object_keys(gone)) || labels || births || array(select x #>> '{}'
      from jsonb_array_elements(case when jsonb_typeof(s #> '{economicState,activeChains}') = 'array' then s #> '{economicState,activeChains}' else '[]' end) c,
           jsonb_array_elements(case when jsonb_typeof(c -> 'processingInstitutions') = 'array' then c -> 'processingInstitutions' else '[]' end) x
     where jsonb_typeof(c) = 'object' and jsonb_typeof(x) = 'string' and public._gallery_veil_hidden_name(x, gone, births, opens));
  -- COHERENCE-VEIL-10 (V7-1): THE NAME SEARCH, built once. The open names: every house still listed (its name, its
  -- label where it has no name, its catalogue identity) and every power the projection shows (its `faction`, its
  -- `name`): one that holds a hidden name is cut out of a text before the search (an open name is not the hidden one)
  srch := public._gallery_veil_name_search(nm,
      array(select case when public._gallery_veil_str(e -> 'name') <> '' then public._gallery_veil_str(e -> 'name') else public._gallery_veil_str(e -> 'label') end
              from jsonb_array_elements(case when jsonb_typeof(s -> 'institutions') = 'array' then s -> 'institutions' else '[]' end) e
             where jsonb_typeof(e) = 'object')
      || array(select o2 ->> 'cid' from jsonb_array_elements(opens) o2 where o2 ? 'cid')
      || array(select public._gallery_veil_str(f -> nk)
                 from jsonb_array_elements(case when jsonb_typeof(s #> '{powerStructure,factions}') = 'array' then s #> '{powerStructure,factions}' else '[]' end) f,
                      unnest(array['faction', 'name']) nk
                where jsonb_typeof(f) = 'object' and not coalesce(f -> 'hidden' = 'true'::jsonb, false)));

  -- REVIEW-VEIL-6's twelfth, COHERENCE-VEIL-9 (the chair's ruling on PART 9's limits): THE TWO DERIVED NAME LISTS, BY
  -- POSITIVE ACCOUNT. The engine's roster of house names, stamped once at birth and LOWER-CASED (priorityHelpers.js ::
  -- getInstitutionNames, the native houses only), in the economy's and the safety profile's flags, keeps an entry only
  -- where a native house still listed accounts for it, each house for one entry, in the list's order: a stamped house by
  -- its catalogue identity (the fold of the name it was born with), an unstamped one by its name, A-Z lowered. A hidden
  -- house's birth name cannot outlive a rename, and no difference between two engines' case folds can leave a spelling
  -- behind (gallerySecondHomes.js :: withholdSecondHomes, rule for rule)
  select coalesce(array_agg(case when jsonb_typeof(e -> 'catalogId') = 'string' and (e ->> 'catalogId') <> '' then e ->> 'catalogId' end order by o), '{}'),
         coalesce(array_agg(translate(public._gallery_veil_str(e -> 'name'), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz') order by o), '{}')
    into acc_cid, acc_low
    from jsonb_array_elements(case when jsonb_typeof(s -> 'institutions') = 'array' then s -> 'institutions' else '[]' end) with ordinality y(e, o)
   where jsonb_typeof(e) = 'object'
     and not (coalesce(e -> 'isCustom' = 'true'::jsonb, false) or coalesce(e -> 'custom' = 'true'::jsonb, false)
              or coalesce(e -> 'source' = '"custom"'::jsonb, false)
              or jsonb_typeof(e -> 'customDefinitionId') is not distinct from 'string'
              or jsonb_typeof(e -> 'customDefinitionCategory') is not distinct from 'string');
  for pth in select p from (values (array['economicState', 'compound', 'inst', 'names']),
                                   (array['economicState', 'safetyProfile', 'compound', 'inst', 'names'])) v(p) loop
    if jsonb_typeof(s #> pth) = 'array' then
      used := array_fill(false, array[greatest(cardinality(acc_cid), 1)]);
      kept := '[]';
      for ent in select e from jsonb_array_elements(s #> pth) y(e) loop
        if jsonb_typeof(ent) <> 'string' then continue; end if;
        j := (select min(i) from generate_subscripts(acc_cid, 1) g(i)
               where not used[i] and case when acc_cid[i] is not null then acc_cid[i] = public._gallery_veil_fold(ent #>> '{}') else acc_low[i] = (ent #>> '{}') end);
        if j is not null then
          used[j] := true;
          kept := kept || jsonb_build_array(ent);
        end if;
      end loop;
      s := jsonb_set(s, pth, kept);
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
  -- COHERENCE-VEIL-10 (V7-1, V7-6): THE WHOLE TEXT IS ASKED FIRST, once: the strings and keys of the projection that
  -- hold a hidden name (_gallery_veil_name_hits). None, and none of the three rules below nor the walk has anything to
  -- find (they only ever shorten the document), so none runs: a town that names no hidden house costs one search.
  if srch is not null then
    blank := srch -> 'blank';
    raws := srch -> 'raw';
    hits := public._gallery_veil_name_hits(s, srch);
    hot := hits <> '{}' or raws <> '[]';
  end if;
  -- COHERENCE-VEIL-8 (N4): the name of a house removed whole inside the economy's fixed prose, in any spelling. The
  -- words are the generator's, chosen by the KIND of house present ('Smuggling Network Revenue'; '... and black
  -- market trade'), and they are the hidden house's name: the hidden name wins (COHERENCE-VEIL-6's ruling for a
  -- chain's label). An income source whose label names it is withheld whole (its label is its row, as a chain's);
  -- one whose description names it loses the description; the safety profile's description that names it goes.
  if hot and jsonb_typeof(s -> 'economicState') = 'object' and jsonb_typeof(s #> '{economicState,incomeSources}') = 'array' then
    s := jsonb_set(s, '{economicState,incomeSources}', coalesce((
      select jsonb_agg(case when jsonb_typeof(e) = 'object' and public._gallery_veil_named(e -> 'desc', hits, blank, raws) then e - 'desc' else e end order by o)
        from jsonb_array_elements(s #> '{economicState,incomeSources}') with ordinality x(e, o)
       where not (jsonb_typeof(e) = 'object' and public._gallery_veil_named(e -> 'source', hits, blank, raws))), '[]'));
  end if;
  if hot and jsonb_typeof(s #> '{economicState,safetyProfile}') = 'object' and public._gallery_veil_named(s #> '{economicState,safetyProfile,safetyDesc}', hits, blank, raws) then
    s := s #- '{economicState,safetyProfile,safetyDesc}';
  end if;

  if jsonb_typeof(s -> 'economicState') = 'object' and jsonb_typeof(s #> '{economicState,activeChains}') = 'array' then
    s := jsonb_set(s, '{economicState,activeChains}', coalesce((
      select jsonb_agg(c2 order by o) from (
        select o, case when jsonb_typeof(c) <> 'object' then c
          else (case when jsonb_typeof(c -> 'processingInstitutions') = 'array'
                     then jsonb_set(c, '{processingInstitutions}', coalesce((select jsonb_agg(x order by xo) from jsonb_array_elements(c -> 'processingInstitutions') with ordinality y(x, xo)
                                                                             where not public._gallery_veil_hidden_name(x, gone, births, opens)), '[]'))
                     else c end)
               - (case when jsonb_typeof(c -> 'dependency') = 'object' and public._gallery_veil_hidden_name(c #> '{dependency,institution}', gone, births, opens)
                       then array['dependency'] else '{}'::text[] end) end as c2,
          c
          from jsonb_array_elements(s #> '{economicState,activeChains}') with ordinality x(c, o)) q
       where not (jsonb_typeof(c) = 'object'
                  and (gone ? public._gallery_veil_str(c -> 'label')
                       or (jsonb_typeof(c -> 'processingInstitutions') = 'array' and jsonb_array_length(c -> 'processingInstitutions') > 0
                           and jsonb_array_length(c2 -> 'processingInstitutions') = 0)))), '[]'));
  end if;
  if hot and jsonb_typeof(s -> 'simulationTrace') = 'array' then
    s := jsonb_set(s, '{simulationTrace}', coalesce((
      select jsonb_agg(case when jsonb_typeof(e) <> 'object' then e
          else e || (select coalesce(jsonb_object_agg(kk, coalesce((select jsonb_agg(x order by xo) from jsonb_array_elements(e -> kk) with ordinality y(x, xo)
                                                                    where not public._gallery_veil_named(x, hits, blank, raws)), '[]')), '{}')
                       from unnest(array['causes', 'downstreamEffects']) kk where jsonb_typeof(e -> kk) = 'array') end order by o)
        from jsonb_array_elements(s -> 'simulationTrace') with ordinality x(e, o)
       where not (jsonb_typeof(e) = 'object'
                  and exists (select 1 from jsonb_each(e) z(kk, vv) where kk not in ('causes', 'downstreamEffects') and public._gallery_veil_named(vv, hits, blank, raws)))), '[]'));
  end if;
  -- COHERENCE-VEIL-8, the chair's ruling (a), in COHERENCE-VEIL-10's form: the name of a house removed whole leaves
  -- every key and every string that holds it, anywhere (a person's goal or secret that names it, a role, an id, a join,
  -- the criminal houses' list, a summary sentence, the public prose), the floors aside: the walk, last
  if hot then
    s := public._gallery_veil_name_sweep(s, hits, blank, raws);
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
  gone_births jsonb := '[]';
  gone_labels jsonb := '[]';
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
           -- COHERENCE-VEIL-9: the catalogue identity of each house removed whole (the name it was born with)
           coalesce((select jsonb_agg(distinct card ->> 'catalogId') from h
                      where house and jsonb_typeof(card -> 'catalogId') = 'string' and (card ->> 'catalogId') <> ''), '[]'),
           -- COHERENCE-VEIL-10 (V7-9): the label of each house removed whole that has no name
           coalesce((select jsonb_agg(distinct card ->> 'label') from h
                      where house and public._gallery_veil_str(card -> 'name') = '' and public._gallery_veil_str(card -> 'label') <> ''), '[]'),
           fields || jsonb_build_object('institution', coalesce(fields -> 'institution', '{}') || coalesce((
             select jsonb_object_agg(q.id, (select jsonb_agg(distinct f) from (
                 select jsonb_array_elements_text(coalesce(fields #> array['institution', q.id], '[]')) f
                 union select unnest(array['description', 'function', 'services', 'people'])) u))
               from (select distinct id from h where not house) q), '{}'))
      into gone_ids, gone_houses, gone_births, gone_labels, fields;
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

  -- X-21e: a house removed whole leaves the institutions list. COHERENCE-VEIL-10 (REVIEW-VEIL-7's V7-3; the chair's
  -- ruling, record 418): BY ITS ID ALONE. The set was decided above, before any eye trimmed anything, and is not tested
  -- again: 211's statement asked the class a second time here, of a card whose `function` eye (shut by the default veil
  -- with the card) had already taken the tags, facets and service keys that put it in the class, so a house in the
  -- class by a declared facet or as an illegal brokerage alone stayed listed. An id is the card's floor: no eye moves it.
  if gone_ids <> '{}' and jsonb_typeof(s -> 'institutions') = 'array' then
    s := jsonb_set(s, '{institutions}', coalesce((select jsonb_agg(e order by o) from jsonb_array_elements(s -> 'institutions') with ordinality x(e, o)
      where not (jsonb_typeof(e) = 'object' and gone_ids ? public._gallery_veil_inst_id(e))), '[]'));
  end if;

  -- an institution's people, and every reference to a house removed whole
  if people_of <> '{}' or gone_houses <> '{}' or gone_ids <> '{}' then
    s := public._gallery_veil_map(s, 'npc', 'npc', jsonb_build_object('people', people_of, 'gone_houses', gone_houses, 'gone_ids', gone_ids));
  end if;

  -- V5-1: each second home goes with the eye that governs its source
  s := public._gallery_veil_second_homes(s, src || jsonb_build_object('births', gone_births, 'labels', gone_labels), gone_houses);

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
