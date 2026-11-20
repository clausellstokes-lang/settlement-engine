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
--       history.siegeNarrative; a house's description and function in the defence profile's lists (by name, and since
--       VEIL-18 by identity, (28)), and the whole
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
--   (22) THE BOUNDARY INVERTED (COHERENCE-VEIL-12; REVIEW-VEIL-8's V8-1, the chair's ruling of 2026-11-14 04:42 UTC): the
--       name search asked a word boundary as a LISTED separator, so any other neighbour blocked the match and a hidden
--       name was sent beside a Hangul particle, kana, Han, Thai, an arrow, a star, an emoji, U+02BC or Armenian
--       punctuation. Now a neighbour blocks only where it is in ONE table, the letters and digits of the scripts that
--       separate their words by spaces (_gallery_veil_name_bound, gallerySecondHomes.js :: NAME_BOUND); every other
--       neighbour is a boundary, judged as written: a character whose compatibility form would block (the trade-mark
--       sign is TM) is written between spaces before the search's preparation (_gallery_veil_name_pad; section 4c).
--   (23) THE IMPRESSION BY ITS WORDS, CLAUSE BY CLAUSE (COHERENCE-VEIL-12; ruling (2), the chair's ruling on PART 12's
--       section 6): the composer never builds an impression from the appearance (npcGenerator.js: the presentation is
--       drawn whole from the title's or the category's table, the appearance from four others), so no identity ties
--       them, and (20)'s "by its person" withheld every impression of a person whose appearance eye was shut. An
--       impression now goes with a shut appearance only where one's words hold the other's. RE-RULED (VEIL-15; the
--       chair's re-ruling of 2026-11-14 07:42 UTC): the clause cut is WITHDRAWN (an amendment that moved a clause's edge
--       sent the hidden wording through the impression); the impression goes with its person's shut appearance where the
--       two share ANY RUN OF TWELVE CODE POINTS OR MORE, in the one fold, wherever it begins and ends: no cut at any mark,
--       one test in both engines, the windows of twelve of each set against the other's (_gallery_veil_runs,
--       gallerySecondHomes.js :: runWindows; _gallery_veil_clauses and clausePieces are gone). The record keeps one
--       wording of each, so the current is the stored. Every other words-rule keeps its sentence pieces
--       (_gallery_veil_pieces, _embeds unchanged).
--   (24) THE COVERT TIE'S FOUR STRINGS (VEIL-13; the chair's ruling (5) and its 04:55 addition; the seat's call V13-1):
--       the public sanitiser drops a tie flagged `covert: true` from relationships[], and every public read (each
--       share's party link too) still told it in prominentRelationship's full, tension and phrasing and in a
--       pressureSentence. _gallery_apply_member_overrides, which holds the full town, now judges IN ONE SPELLING (the
--       full town's own copy and sentence against its own ties; the projection masks a hidden power's name, the full
--       town does not) and, on a public read, where the sanitiser drops a tie by its own condition (covert JSON true),
--       withholds the copy whole where it is that tie's, and the pressure sentence where it names both ends of such a
--       tie or holds its words (current, or the copy's stored wording); where the full town, its ties or a dropped tie's
--       ends cannot be read, both go. get_unlisted_dossier is restated to hand the apply the live town's relationships[],
--       prominentRelationship and pressureSentence (it handed the projection twice, so the link could not know the tie);
--       its people still come from the projection alone. Reveal DM keeps the tie and its strings.
--   (25) THE PROCESSOR MATCH LOWERED AS THE ENGINE LOWERS (VEIL-15, R2; PART 12 sections 3 and 7): (9)'s processing name
--       only houses hidden whole answer to was matched by lower(), whose answer is the database's locale's, where the
--       engine and the twin lower by toLowerCase(): with U+0130 in an OPEN house's name ('İron smelter yard') the server
--       read that house as answering 'Iron smelter', which the engine never gave it, and sent the name only the hidden
--       house answers to (in the chain, its dependency and every string the name search would have taken); a word-final
--       capital sigma the same. _gallery_veil_hidden_name now lowers both sides by translate, U+0130 and U+212A spelled out
--       as JavaScript lowers them: for an ASCII needle the engine's match, every code point of every plane measured. A
--       needle outside ASCII, which no server engine lowers as JavaScript does, WHERE UNSURE, WITHHOLD: a house hidden
--       whole answers it where it is the name or is named outside ASCII, an open house only where it is the name.
--   (26) THE WALK IN ONE PASS (VEIL-16; REVIEW-VEIL-8's V8-3, the cost law): the walk asked every child container of a
--       node on the way whether it might hold a hit by making the child's whole text ready again and scanning it for
--       every hit string (children x hits, and the preparation once a level). Now the strings that hold a name are
--       marked ONCE: the k-th quoted run of the document's text made ready is its k-th string or key (no step of the
--       preparation makes or eats a quotation mark: section 4c), so the one marking pass names the hit tokens, kept by
--       their JSON spelling (_gallery_veil_name_json); the walk carries each container's range of tokens and asks a
--       sorted array of the hit places by width_bucket (_gallery_veil_name_near, _gallery_veil_name_tokens). The
--       separators-only names are asked as written once a string, in the same set. No answer moves: the same keys and
--       strings leave, the floors, the bound and every rebuild unchanged; the twin is unchanged.
--   (27) NO UNBOUNDED PATTERN (VEIL-17; REVIEW-VEIL-8's V8-9; the law: the closed answer at any bound, never an error):
--       the one alternation was compiled with no bound on its size, so past a size the sharer controls the read RAISED
--       where 211 serves (600 houses of 145 characters: an allocation of 1.9 GB refused; 1,500: too complex). The
--       search's patterns, the alternation and every open name cut out, now carry ONE BOUND, the same in both engines
--       (_gallery_veil_name_search, gallerySecondHomes.js :: NAME_SEARCH_BOUND): 16,384 code points together, a weight of
--       4,194,304 (each pattern's code points times its distinct code points: the match's memory grows as its states
--       times its colours) and 16 cut-outs. Past it nothing is compiled and the search is CLOSED (its patterns are kept,
--       never run): every key and string
--       of the projection may hold a hidden name and leaves as a hit would, the floors aside (_gallery_veil_name_hits
--       answers every token, as where the marks' count differs), so the read sends the town's name alone; a run of the
--       search that raises answers the same. Below it no answer moves. Section 4c states the measures.
--   (28) THE DEFENCE ROW BY IDENTITY (VEIL-18; REVIEW-VEIL-8's V8-2): a defence row (defenseProfile.institutions.<slot>[])
--       found its house by NAME alone, so a house whose description eye was shut kept the hidden description in a row
--       that still carried another name (the name it was born with: a record renamed by any writer but the editor's,
--       whose rename cascades the rows). A row is now its house's by the house's name OR by its identity: any house
--       whose catalogue identity (`catalogId`) is the fold of the row's name (_gallery_veil_fold, the engine's fold of a
--       birth name into its identity) owns it, and the row follows that house's description and function eyes; where two
--       houses could own one row, the eye that withholds (_gallery_veil_sources 'house_ids'; gallerySecondHomes.js ::
--       secondHomeSources, withholdSecondHomes). No signature changes.
--   (29) THE TOP-LEVEL POWER'S FLOOR (VEIL-18; REVIEW-VEIL-8's V8-4; the chair's ruling (1): a string that names a shown power
--       by the power's own name is the power's, and stays): the floors were powerStructure.factions[] only, so a shown
--       power whose name is a hidden house's name without its qualifier kept its name there and lost it in master's
--       top-level factions[]. An entry of that list that IS a shown power now takes the same floor, key by key: its
--       `faction` or `name` where the string, in the one fold, is a shown power's `faction` or `name`; a key that names no
--       shown power, and an entry flagged hidden, take none and stay swept (_gallery_veil_name_floor, now given the shown
--       powers' folds by _gallery_veil_name_sweep: its signature gains `shown text[]`, the rollback drops the new one;
--       gallerySecondHomes.js :: sweepHiddenNames).
--   (30) A TIE WHOSE END IS GONE LEAVES WITH IT (VEIL-18; REVIEW-VEIL-8's V8-5): a person whose own name holds a hidden
--       house's name is removed whole by the sweep ((16), (19)), and the tie that named them was left pointing at nobody
--       (its end's id still spelled who: a reader inferred a removed person). Keeping the person named would send the
--       hidden name inside the person's name, so the cure is the tie's: before the walk, each person the walk removes
--       (its own id or name taken) is known by its id, its name and its key (npc.<slug>); a tie any of whose ends (from,
--       to; master's npc1Id, npc2Id; npc1Name, npc2Name) is one of them leaves whole, in both stored shapes, and its copies
--       follow as a dropped tie's do (ruling (5)'s rule): prominentRelationship whole where it is that tie's copy,
--       pressureSentence where it names that tie's two ends or holds its words, both where such a tie's ends carry no
--       names (_gallery_veil_second_homes; gallerySecondHomes.js :: withholdTiesOfTheSwept). No signature changes.
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
-- NEW: thirty-one helpers (_gallery_veil_pieces, _runs, _embeds, _case_fold, _fold, _hidden_name, _sources, _tie_pieces,
-- _second_homes, _member_revealed, _roster_members, _tie_roles, _roster_splice; and the name search's eighteen: _name_sep, _name_bound,
-- _name_pad, _name_case, _name_prep, _name_fold, _name_needle, _name_search, _name_ready, _name_json, _name_hits, _name_hit, _named,
-- _name_tokens, _name_near, _name_floor, _name_taken, _name_sweep). RESTATED, each as 211's statement plus the cure:
-- _gallery_veil_card, _gallery_veil_apply, _gallery_apply_member_overrides, get_gallery_dossier, get_unlisted_dossier
-- (VEIL-13, ruling (5): its apply's full town) and import_gallery_dossier (their grants restated as 211 states them).
-- No helper of 211 changes its signature, so nothing 211 created is left behind. 211's section 7 is restated last: no _gallery_veil*
-- helper is callable by public, anon or authenticated (71 in all). NOT CHANGED: get_gallery_map and every
-- other function. No table, column, constraint, policy or row.
--
-- COUPLED CLIENT TWIN: src/domain/display/gallerySecondHomes.js (the second homes, (9); the name search, (19)), called
-- by src/domain/display/galleryVeil.js :: applyVeil; and (24)'s, gallerySecondHomes.js :: withholdCovertCopies, called by
-- galleryVeil.js :: galleryPayloadFor. PINNED BY EXECUTION: tests/security/gallerySecondHomes.pglite.test.js,
-- tests/security/galleryVeilHandRows.pglite.test.js (rows written by hand: (18), (19), (24)) and
-- tests/security/galleryVeilCures.pglite.test.js (V5-3, V5-4, V5-7 and the rollback pins).
--
-- @rollback: supabase/rollback/212_share_veil_later_cures.down.sql, run FIRST, before 211's own: it recreates the
--   six functions at 211's statements (the file at 333b33973, verbatim) and drops 212's helpers by signature.
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
  -- V5-1 (COHERENCE-VEIL-6, the impression), BY A SHARED RUN OF TWELVE since VEIL-15 (the chair's re-ruling of 2026-11-14
  -- 07:42 UTC, which withdrew COHERENCE-VEIL-12's clause by clause): the composer never builds an impression from the
  -- appearance, so no identity ties them (COHERENCE-VEIL-10's "by its person", V7-2, withheld every impression whose
  -- person's appearance eye was shut). The impression on a person's face goes with THAT PERSON's shut appearance, whole,
  -- where the two share any run of twelve code points or more in the one fold, wherever it begins and ends: no cut at any
  -- mark, so no edge an amendment can move (_gallery_veil_runs: the windows of twelve of each string of either; they share
  -- a run exactly where the two sets meet, a set operation, never a pair-by-pair search). Run only here, only for a person
  -- whose appearance eye is shut. The record keeps one wording of each (gallerySecondHomes.js :: withholdImpression)
  if kind = 'npc' and 'physical' = any(drops) and jsonb_typeof(c -> 'presentation') = 'object' then
    if exists (select w from public._gallery_veil_runs(c -> 'physical') w
               intersect select w from public._gallery_veil_runs(c #> '{presentation,impression}') w) then
      c := jsonb_set(c, '{presentation}', (c -> 'presentation') - 'impression');
    end if;
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
--   <a person>.presentation.impression       NOT BY IDENTITY (COHERENCE-VEIL-12, ruling (2): its composer never builds it
--                                            from the appearance): its person's appearance eye, where the two share a RUN
--                                            OF TWELVE code points or more in the one fold, wherever it begins and ends
--                                            (VEIL-15, the chair's re-ruling; _gallery_veil_card, _gallery_veil_runs)
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

-- [212: NEW] public._gallery_veil_runs
-- runWindows (VEIL-15; the chair's re-ruling of 2026-11-14 07:42 UTC, which withdrew COHERENCE-VEIL-12's clause by clause:
-- the impression goes with its person's shut appearance where the two share a run of twelve code points or more, in the
-- one fold, wherever it begins and ends): every run of exactly TWELVE CODE POINTS of each string leaf of a value, the leaf
-- folded WHOLE by the one fold (_gallery_veil_case_fold) and then read as code points; no cut at any mark, nothing
-- trimmed; a leaf of fewer than twelve has none. Two values share a run of twelve or more exactly where these sets meet
-- (a longer shared run holds a shared window of twelve; a shared window is a shared run of twelve): the set meet is the
-- ruling's "a window of twelve at every code point of the shorter string, sought in the other", for every pair of
-- strings. The windows are built from the code points ONCE (string_to_table with ordinality, eleven lead()s over one
-- window; a window that would run off the end is NULL and none), so the cost is the length's, never its square (substr at
-- a far offset of a multibyte text walks from the start); each leaf is folded once (`offset 0`: the planner would
-- otherwise copy the fold into each place that reads it). The impression's call ALONE (_gallery_veil_card): every other
-- words-rule keeps the sentence pieces of _gallery_veil_pieces. The same set as gallerySecondHomes.js :: runWindows.
create or replace function public._gallery_veil_runs(v jsonb)
returns setof text language sql immutable as $$
  select w.r
    from jsonb_path_query(coalesce(v, 'null'), 'lax $.**') x(j)
    cross join lateral (select case when jsonb_typeof(x.j) = 'string' then public._gallery_veil_case_fold(x.j #>> '{}') end as f offset 0) y
    cross join lateral (
      select c || lead(c, 1) over o || lead(c, 2) over o || lead(c, 3) over o || lead(c, 4) over o || lead(c, 5) over o
               || lead(c, 6) over o || lead(c, 7) over o || lead(c, 8) over o || lead(c, 9) over o || lead(c, 10) over o
               || lead(c, 11) over o as r
        from string_to_table(y.f, null) with ordinality t(c, n)
      window o as (order by n)) w
   where y.f is not null and w.r is not null
$$;

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

-- ── 4c. THE NAME SEARCH (COHERENCE-VEIL-10, -12; REVIEW-VEIL-7's V7-1, V7-4, V7-6, V7-7, V7-9, V7-10; V8-1) ────
-- The eighth seat's sweep (_gallery_veil_folded_name, _names, _sweep and its prefilter) is REPLACED, not patched. What
-- stands here, and in the client's twin rule for rule (gallerySecondHomes.js, THE NAME SEARCH):
--   THE PREPARATION of a text that holds a character outside ASCII: NFKD, then the combining marks U+0300 to U+036F
--     removed (a full-width or ligature spelling is its letters; an accent is no part of a letter; U+0130 is I, the
--     Kelvin sign is K). No text is ever case-mapped by the database's own locale (A-Z alone are lowered; below).
--   A SEPARATOR is a character of ONE explicit set (_gallery_veil_name_sep): every ASCII character that is not a letter
--     or a digit, U+0080 to U+00BF, U+00D7, U+00F7, U+2000 to U+206F, U+2E00 to U+2E7F, U+3000 to U+303F, U+FE30 to
--     U+FE6F, U+FEFF and the full-width punctuation. EVERYTHING ELSE IS KEPT: a name of symbols only, or in a script
--     with no case and no spaces, is searched as it is written.
--   THE FOLD: prepared, A-Z lowered and nothing else (a name by an explicit map, translate; a text made ready by lower()
--     in the C collation, which lowers A-Z alone in every database, whatever its locale: the same map, the guard asks
--     every code point of every plane), every run of separators one '_'. A text is folded ONCE.
--   CASE OUTSIDE A-Z LIVES IN THE NEEDLE: each letter of a hidden name that has another case is written in the pattern
--     as the bracket of its case class, from ONE table carried as the same literal by both engines
--     (_gallery_veil_name_case); sharp s and "ss" are one.
--   ONE SEARCH FOR ALL HIDDEN NAMES AT ONCE: one alternation; a name's words joined by '_' or by nothing (the squeezed
--     and the camel-cased spellings are the same needle); an English plural. A name's forms: the name, and the name
--     without its bracketed qualifier. A name that is separators only is searched as written.
--   A BOUNDARY IS ANY NEIGHBOUR NOT IN THE BLOCKING TABLE (COHERENCE-VEIL-12; V8-1, the chair's ruling of 2026-11-14
--     04:42 UTC: the boundary inverted). The table (_gallery_veil_name_bound, the same literal in both engines) is the
--     letters and digits of the scripts that separate their words by spaces (Latin, Greek, Cyrillic, Armenian,
--     Georgian) and the ASCII digits. Where an end of a name is in the table, the neighbour on that side must not be:
--     the start or the end of a text, a separator, a symbol, a mark, punctuation of any script, a letter of a script
--     that writes no spaces, Hangul (whose particles join their noun) and the cut-out mark are each a boundary; a
--     letter or digit in the table blocks ('a Black marketeer' is not the name). Asked without consuming the neighbour
--     (a lookbehind and a lookahead), so two hits that share one neighbour are each found. Where an end is not in the
--     table (a Han, Hangul or symbol end) no boundary is asked: a name in Han or Thai is found inside its sentence.
--   THE NEIGHBOUR AS WRITTEN (the seat's call 2): a character that is not itself a letter or digit of the five
--     alphabets but whose compatibility form begins or ends with one (the trade-mark sign is TM, a superscript two is
--     2, a circled one is 1, a mathematical bold A is A) is a boundary: the search writes it between spaces before its
--     preparation (_gallery_veil_name_pad, in the fold of a name and in a text made ready). The words' fold
--     (_gallery_veil_case_fold) does not pad.
--   AN OPEN NAME THAT HOLDS A HIDDEN ONE is cut out of a text before the search, longest first ('Black market bazaar'
--     is not 'Black market'); an open name that IS a hidden one (the same letters) is not cut out: it keeps its floor.
--   KEYS AS WELL AS VALUES; an id and a join are strings like any other. FLOORS, never asked: the town's own `name`;
--     the `id` and `name` of a house still listed (its `label` where it has no name); a shown power's `faction` and
--     `name`, and (VEIL-18, V8-4) the same power's `faction` or `name` in master's top-level factions[] (the one fold). An
--     entry of a list whose own `id` or `name` is taken leaves the list whole (no record without a name).
--   THE WHOLE TEXT IS ASKED FIRST (the document's text, its escapes made spaces, folded once): no hit, no walk. THE
--     WALK IS ITERATIVE (211's _gallery_veil_drop_hooks shape: only the nodes on the way to a hit are rebuilt) and
--     bounded: the root is level 0, and a container at level 64 that holds a hit at any depth is withheld whole.
--   THE MARKS ARE THE TOKENS (VEIL-16, V8-3): in a document's JSON text each quotation mark not escaped starts or ends a
--     string or key, so its k-th quoted run is its k-th token. No step of the preparation makes or eats one: the escapes
--     are made spaces first; the padding writes spaces; the preparation makes spaces of the only three code points whose
--     compatibility form holds a quotation mark or a reverse solidus (U+FF02, U+FF3C, U+FE68: every code point of every
--     plane measured, both engines), and its skew writes letters; the separators' fold leaves the quotation mark out;
--     no needle or cut-out holds one (a name's fold makes it a separator). So the k-th quoted run of the text made
--     ready is the k-th token as made ready, and the one marking pass names every token that holds a hidden name, by
--     its place. A token is kept by its JSON spelling (_gallery_veil_name_json: the text as JSON writes it, each escaped
--     reverse solidus and quotation mark two control characters, which no JSON text holds as written, so that every
--     quotation mark left is a token's end), which is the same for every copy of the same string: a token of any later
--     shortening of the document is asked by that spelling (a look-up; _gallery_veil_name_hit, _named), and the walk
--     reads the places of the tokens that hold a hit off the document it is handed, once, and carries each container's
--     range of tokens (_gallery_veil_name_tokens counts a child's; _gallery_veil_name_near asks the sorted places by
--     width_bucket). Never a scan per hit, never a text made ready twice.
-- THE COST (V7-6), each figure measured on PostgreSQL 16 (docs/chair/2026-11-13/veil-probe-10/out/): one alternation of
-- 1,200 names takes 0.14 to 0.6 ms to START, so 10,000 strings asked one by one cost 1.4 to 6.2 s, where one 388 KB
-- text asked whole costs 3 to 145 ms. So the alternation is run ONCE over the document's text, and once more, only
-- where that found something, to mark the strings that hold a name; every later test of one string is a look-up of
-- that string among them. And a needle that brackets every ASCII letter's two cases takes 675 ms to compile for 1,200
-- names of three words, where the same names in lower case take 40 ms: so the text's A-Z are lowered (one pass) and
-- only a letter outside A-Z is bracketed. THE WALK (V8-3; docs/chair/2026-11-14/veil-probe-16/out/V83-cost.txt):
-- asking each child container by its made-ready text whether it held one of the hit strings cost children x hits, and
-- the preparation once a level (at d0afa93dd, Langengrund's link 2.06 to 2.35 times the frozen 211, 10,000 rows that
-- each name a hidden house 3.14 times); now each child's tokens are counted once at its level (a count of its
-- quotation marks: no regular expression, no preparation) and asked of the sorted places in logarithmic time (1.64 to
-- 1.80 and 1.14 times, medians on the native cluster).
-- THE PATTERN'S BOUND (VEIL-17, V8-9; docs/chair/2026-11-19/veil/out/V89-cost.txt): PostgreSQL's match of one pattern
-- asks its memory at once, about 32 bytes times its states times its colours, and a quarter byte times its states
-- squared, and refuses one request past a gigabyte; it refuses a pattern of too many states as too complex. Measured on
-- the base (the pattern's code points L, its distinct code points D): 450 Latin names of 145 characters (L 84,076, D 207)
-- refused, 440 served (82,216: 1.3 GB of address space taken); one Latin name of 47,608 characters (L 59,297) too
-- complex, of 42,508 (53,000) served; 150 Han names of 40 distinct characters (L x D 36.9 million) refused, 135 served
-- (29.9 million: 1.65 GB of address space). The 240 born towns of the born probe, EVERY house hidden whole: L at most
-- 3,413 (Albaorum; Langengrund 3,402), L x D at most 740,621, at most two cut-outs (1,000 code points, weight 193,000).
-- So the bound: L 16,384 together (3.7 times the largest birth with its cut-outs, a third of the least refusal), the
-- weight 4,194,304 (4.5 times the births, a seventh of the least refusal) and 16 cut-outs (8 times the births). At the
-- bound (Latin, Greek, Han, symbols, one long name) a pattern compiles and matches in 26 ms or less, the backend's peak
-- resident size 78 MB or less and its address space 523 MB or less.

-- [212: NEW] public._gallery_veil_name_sep
-- THE SEPARATORS, as the body of a bracket expression; `quote` false leaves the quotation mark out (the fold of a
-- document's text: there a quotation mark is where a string ends, so a name never runs from one string into the next).
create or replace function public._gallery_veil_name_sep(quote boolean)
returns text language sql immutable as $$
  select case when quote then '\x01-\x2f' else '\x01-\x21\x23-\x2f' end
      || '\x3a-\x40\x5b-\x60\x7b-\xbf\xd7\xf7\u2000-\u206f\u2e00-\u2e7f\u3000-\u303f\ufe30-\ufe6f\ufeff\uff00-\uff0f\uff1a-\uff20\uff3b-\uff40\uff5b-\uff65'
$$;

-- [212: NEW] public._gallery_veil_name_bound
-- THE BLOCKING TABLE (COHERENCE-VEIL-12; REVIEW-VEIL-8's V8-1), as the body of a bracket expression: the letters and the
-- digits (General Category L*, N*) of the scripts that separate their words by spaces, Latin, Greek, Cyrillic, Armenian
-- and Georgian (by the Script property: no Common or Inherited character), and the ASCII digits, over the code points
-- the preparation leaves alone (so not U+212A, the cut-out mark). No punctuation, symbol, mark, separator, control,
-- format character or modifier letter of the Common script (U+02BC) is in it. A neighbour in this table blocks a name;
-- every other neighbour is a boundary. Generated once (docs/chair/2026-11-14/veil-probe-12/gen-name-bound.mjs, Unicode
-- 17.0, Node 22.23): 1,434 code points in 101 ranges. The same literal, character for character, is
-- gallerySecondHomes.js :: NAME_BOUND; the guard holds the two engines' membership equal for every code point.
create or replace function public._gallery_veil_name_bound()
returns text language sql immutable as $$
  select ('"' ||
    '0-9A-Za-z\u00c6\u00d0\u00d8\u00de\u00df\u00e6\u00f0\u00f8\u00fe\u0110\u0111\u0126\u0127\u0131\u0138\u0141\u0142'
    '\u014a\u014b\u0152\u0153\u0166\u0167\u0180-\u019f\u01a2-\u01ae\u01b1-\u01c3\u01dd\u01e4\u01e5\u01f6\u01f7\u021c\u021d'
    '\u0220-\u0225\u0234-\u02af\u0370-\u0373\u0376\u0377\u037b-\u037d\u037f\u0391-\u03a1\u03a3-\u03a9\u03b1-\u03c9\u03cf'
    '\u03d7-\u03e1\u03f3\u03f7\u03f8\u03fa-\u03ff\u0402\u0404-\u0406\u0408-\u040b\u040f-\u0418\u041a-\u0438\u043a-\u044f'
    '\u0452\u0454-\u0456\u0458-\u045b\u045f-\u0475\u0478-\u0481\u048a-\u04c0\u04c3-\u04cf\u04d4\u04d5\u04d8\u04d9\u04e0\u04e1'
    '\u04e8\u04e9\u04f6\u04f7\u04fa-\u052f\u0531-\u0556\u0559\u0560-\u0586\u0588\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa'
    '\u10fd-\u10ff\u1c80-\u1c8a\u1c90-\u1cba\u1cbd-\u1cbf\u1d00-\u1d2b\u1d2f\u1d3b\u1d4e\u1d6b-\u1d77\u1d79-\u1d9a'
    '\u1e9c-\u1e9f\u1efa-\u1eff\u2132\u214e\u2180-\u2188\u2c60-\u2c7b\u2c7e\u2c7f\u2d00-\u2d25\u2d27\u2d2d\ua640-\ua66e'
    '\ua67f-\ua69b\ua722-\ua76f\ua771-\ua787\ua78b-\ua7dc\ua7f5-\ua7f7\ua7fa-\ua7ff\uab30-\uab5a\uab60-\uab68'
    '\ud800\udd40-\ud800\udd78\ud800\udd8a\ud800\udd8b\ud801\udf80\ud837\udf00-\ud837\udf1e\ud837\udf25-\ud837\udf2a'
    || '"')::jsonb #>> '{}'
$$;

-- [212: NEW] public._gallery_veil_name_pad
-- THE NEIGHBOUR AS WRITTEN (COHERENCE-VEIL-12; the seat's call 2 on V8-1): a character that is not itself in the blocking
-- table as written (judged by its own General Category and Script), but whose compatibility form begins or ends with a
-- member (the trade-mark sign is TM, a superscript two is 2, a circled one is 1, a mathematical bold A is A), is written
-- between two spaces, so that the preparation leaves a boundary where it stood. Called by THE NAME SEARCH alone, before
-- its preparation (the fold of a name, a text made ready); never by the words' fold (_gallery_veil_case_fold). A
-- full-width or ligature Latin letter is a Latin letter: not padded, it blocks. A text of ASCII alone is returned as it
-- is (no padded character is ASCII). The set, 1,486 code points in 70 ranges, is generated once with the table
-- (docs/chair/2026-11-14/veil-probe-12/gen-name-bound.mjs); the same literal, character for character, is
-- gallerySecondHomes.js :: NAME_PAD.
create or replace function public._gallery_veil_name_pad(t text)
returns text language sql immutable as $$
  select case when t is null or t !~ '[^\x01-\x7f]' then t
    else regexp_replace(t, '[' || (('"' ||
      '\u00b2\u00b3\u00b5\u00b9\u00bc-\u00be\u2070\u2074-\u2079\u2080-\u2089\u20a8\u2100-\u2103\u2105-\u2107\u2109-\u2113'
      '\u2115\u2116\u2119-\u211d\u2120-\u2122\u2124\u2128\u212c\u212d\u212f-\u2131\u2133\u2134\u2139\u213b-\u213f\u2145-\u2149'
      '\u2150-\u215f\u2189\u2460-\u2473\u2488-\u249b\u24b6-\u24ea\u3250-\u325f\u32b1-\u32cf\u3358-\u337a\u3380-\u33ff'
      '\uff10-\uff19\ud833\udcd6-\ud833\udcf9\ud835\udc00-\ud835\udc54\ud835\udc56-\ud835\udc9c\ud835\udc9e\ud835\udc9f'
      '\ud835\udca2\ud835\udca5\ud835\udca6\ud835\udca9-\ud835\udcac\ud835\udcae-\ud835\udcb9\ud835\udcbb'
      '\ud835\udcbd-\ud835\udcc3\ud835\udcc5-\ud835\udd05\ud835\udd07-\ud835\udd0a\ud835\udd0d-\ud835\udd14'
      '\ud835\udd16-\ud835\udd1c\ud835\udd1e-\ud835\udd39\ud835\udd3b-\ud835\udd3e\ud835\udd40-\ud835\udd44\ud835\udd46'
      '\ud835\udd4a-\ud835\udd50\ud835\udd52-\ud835\udea5\ud835\udea8-\ud835\udec0\ud835\udec2-\ud835\udeda'
      '\ud835\udedc-\ud835\udefa\ud835\udefc-\ud835\udf14\ud835\udf16-\ud835\udf34\ud835\udf36-\ud835\udf4e'
      '\ud835\udf50-\ud835\udf6e\ud835\udf70-\ud835\udf88\ud835\udf8a-\ud835\udfa8\ud835\udfaa-\ud835\udfc2'
      '\ud835\udfc4-\ud835\udfcb\ud835\udfce-\ud835\udfff\ud83c\udd00-\ud83c\udd0a\ud83c\udd2b-\ud83c\udd2e'
      '\ud83c\udd30-\ud83c\udd4f\ud83c\udd6a-\ud83c\udd6c\ud83c\udd90\ud83e\udff0-\ud83e\udff9'
      || '"')::jsonb #>> '{}') || ']', ' \& ', 'g') end
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
-- THE FOLD OF A NAME: padded (_gallery_veil_name_pad), prepared, A-Z lowered by an explicit map, every run of separators
-- one '_', none at either end.
-- The same string as the client's nameFold for every input.
create or replace function public._gallery_veil_name_fold(t text)
returns text language sql immutable as $$
  select btrim(regexp_replace(translate(public._gallery_veil_name_prep(public._gallery_veil_name_pad(coalesce(t, ''))), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'),
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
-- THE BOUNDARY (COHERENCE-VEIL-12; V8-1): where an end of a name is in the blocking table (_gallery_veil_name_bound), the
-- neighbour on that side must not be; asked by a lookbehind and a lookahead, which consume nothing, so two hits that
-- share one neighbour are both found and a cut-out puts back nothing but its mark.
-- THE PATTERN'S BOUND (VEIL-17, V8-9; section 4c): the search is CLOSED ("closed": true beside what was built, which is
-- then never compiled) where its patterns, `p` and every cut-out, pass 16,384 code points together, or their weight
-- (each one's code points times its distinct code points, summed) passes 4,194,304, or there are more than 16 cut-outs;
-- and where seeking the cut-outs raises. `p` alone is asked first, as the cut-outs are sought by running it.
create or replace function public._gallery_veil_name_search(names text[], opens text[])
returns jsonb language plpgsql immutable as $$
declare
  wp bigint;           -- `p`'s weight: its code points times its distinct code points (V8-9)
  -- one character of the blocking table: an end of a name in it asks a boundary, and a neighbour in it blocks the name
  bnd text := '[' || public._gallery_veil_name_bound() || ']';
  lbd text := '(?<!' || bnd || ')';   -- a left boundary: the text's start, or a neighbour before that is not in the table
  rbd text := '(?!' || bnd || ')';    -- a right boundary: the text's end, or a neighbour after that is not in the table
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
  with n1 as (select distinct x as n, public._gallery_veil_name_prep(public._gallery_veil_name_pad(x)) as pn from unnest(names) x where x is not null and x <> ''),
       n2 as (select n, pn, public._gallery_veil_name_fold(pn) as f from n1),
       fs as (select f from n2 union select public._gallery_veil_name_fold(regexp_replace(pn, qual, '')) from n2 where pn ~ '[)\]]'),
       fm as (select f, left(f, 1) ~ bnd as lb, right(f, 1) ~ bnd as rb,
                     replace(replace(case when f ~ '[^\x01-\x7f]' then translate(f, cv, cc) else f end, chr(223), 'ss'), '_', '') as k,
                     public._gallery_veil_name_needle(f, cls) as needle
                from fs where f <> ''),
       g as (select lb, rb, string_agg(needle, '|' order by f collate "C") as alt from fm group by lb, rb)
  select (select coalesce(jsonb_agg(n order by n collate "C"), '[]') from n2 where f = ''),
         (select coalesce(array_agg(distinct k), '{}') from fm),
         (select string_agg(case when lb and rb then lbd || '(?:' || alt || ')(?:e?s)?' || rbd
                                 when lb then lbd || '(?:' || alt || ')'
                                 when rb then '(?:' || alt || ')(?:e?s)?' || rbd
                                 else '(?:' || alt || ')' end, '|' order by lb desc, rb desc) from g)
    into raws, keys, p;
  if p is null and raws = '[]' then return null; end if;
  -- V8-9, THE BOUND, on `p` alone: past it nothing is compiled, and the search is closed
  if p is not null then
    if length(p) > 16384 then return jsonb_build_object('p', p, 'raw', raws, 'blank', blank, 'closed', true); end if;
    wp := length(p)::bigint * (select count(distinct c collate "C") from string_to_table(p, null) c);
    if wp > 4194304 then return jsonb_build_object('p', p, 'raw', raws, 'blank', blank, 'closed', true); end if;
  end if;
  if p is not null and cardinality(opens) > 0 then
    -- the open names that hold a hidden name (asked together: each made ready, between quotation marks, and `p` run
    -- once over them all, a mark set before each name it finds, inside its string: `p` consumes no neighbour), less
    -- those that ARE a hidden name (the same letters); where that raises, the search is closed (V8-9)
    begin
    with o1 as (select distinct public._gallery_veil_name_ready(translate(x, '"', ' '), null) as po from unnest(opens) x where x is not null and x <> ''),
         held as (select distinct btrim(replace(m[1], chr(1), ''), '"') as po
                    from regexp_matches(regexp_replace((select coalesce(string_agg('"' || po || '"', ''), '') from o1), p, chr(1) || '\&', 'g'), '"[^"]*"', 'g') m
                   where position(chr(1) in m[1]) > 0),
         o2 as (select distinct public._gallery_veil_name_fold(po) as f from held),
         o3 as (select f, left(f, 1) ~ bnd as lb, right(f, 1) ~ bnd as rb,
                       replace(replace(case when f ~ '[^\x01-\x7f]' then translate(f, cv, cc) else f end, chr(223), 'ss'), '_', '') as k,
                       public._gallery_veil_name_needle(f, cls) as needle
                  from o2 where f <> '')
    select coalesce(jsonb_agg(case when lb then lbd else '' end || needle || case when rb then '(?:e?s)?' || rbd else '' end
                              order by length(k) desc, k collate "C", f collate "C"), '[]')
      into blank from o3 where not (k = any(keys));
    exception when others then return jsonb_build_object('p', p, 'raw', raws, 'blank', '[]'::jsonb, 'closed', true);
    end;
    -- V8-9, THE BOUND, on `p` and the cut-outs together
    if jsonb_array_length(blank) > 16
       or length(p) + (select coalesce(sum(length(b)), 0) from jsonb_array_elements_text(blank) b) > 16384
       or wp + (select coalesce(sum(length(b)::bigint * (select count(distinct c collate "C") from string_to_table(b, null) c)), 0)
                  from jsonb_array_elements_text(blank) b) > 4194304 then
      return jsonb_build_object('p', p, 'raw', raws, 'blank', blank, 'closed', true);
    end if;
  end if;
  return jsonb_build_object('p', p, 'raw', raws, 'blank', blank);
end $$;

-- [212: NEW] public._gallery_veil_name_ready
-- A text made ready for the search (THE FOLD of a text): padded (_gallery_veil_name_pad) and prepared; A-Z lowered and
-- nothing else (never the database's locale: the other letters keep their case, which is the needle's); every run of
-- separators one '_' (the quotation mark aside: in a document's text it is where a string ends, and a string asked
-- alone holds none by then); then each open name that holds a hidden one cut out, longest first (in its place the
-- Kelvin sign, U+212A, which no prepared text holds and no needle names: the preparation writes it K; nor is it in the
-- blocking table, so a hidden name beside a cut-out is beside a boundary). A cut-out's pattern consumes no neighbour
-- (COHERENCE-VEIL-12): the mark alone is put.
-- VEIL-16 (V8-3): A-Z are lowered by lower() IN THE C COLLATION, which lowers A-Z alone in every database whatever its
-- locale (PostgreSQL's str_tolower: a C collation takes asc_tolower), the very map translate wrote; translate walks the
-- 26 letters at every character of a text that holds one outside ASCII (29 ms on Langengrund's 320 KB, against 0.2).
-- The guard holds the two equal over every code point of every plane; the separators are then asked in the database's
-- own collation, as before.
create or replace function public._gallery_veil_name_ready(t text, blank jsonb)
returns text language plpgsql immutable as $$
declare
  b text;
begin
  t := regexp_replace(lower(public._gallery_veil_name_prep(public._gallery_veil_name_pad(t)) collate "C") collate "default",
                      '[' || public._gallery_veil_name_sep(false) || ']+', '_', 'g');
  if blank is null or blank = '[]' then return t; end if;
  for b in select jsonb_array_elements_text(blank) loop
    t := regexp_replace(t, b, chr(8490), 'g');
  end loop;
  return t;
end $$;

-- [212: NEW] public._gallery_veil_name_json
-- A JSON text WITH ITS TOKENS' ENDS BARE (VEIL-16, V8-3): each escaped reverse solidus written as two U+0001 and then each
-- escaped quotation mark as two U+0002 (left to right, every reverse solidus of a JSON text starts its escape, so each
-- replacement stands where an escape stands), so that every quotation mark left starts or ends a string or a key; no
-- JSON text holds a control character as written, so the spelling is one to one. A string's JSON spelling: the text
-- to_jsonb writes, its two quotation marks off, through this; two strings are one exactly where these are one. A
-- name that is separators only stands in a string exactly where its JSON spelling stands in the string's: the
-- escapes are whole characters, and a spelling cannot start inside one but at the second of two U+0001 (or U+0002),
-- where the same name also stands one character earlier.
create or replace function public._gallery_veil_name_json(t text)
returns text language sql immutable as $$
  select replace(replace(t, chr(92) || chr(92), chr(1) || chr(1)), chr(92) || '"', chr(2) || chr(2))
$$;

-- [212: NEW] public._gallery_veil_name_hits
-- THE WHOLE TEXT, ASKED FIRST, AND THE STRINGS THAT HOLD A NAME, MARKED ONCE (VEIL-16, V8-3: section 4c, THE MARKS ARE
-- THE TOKENS). The value's text, each escape made one space (an escape stands for a quotation mark, a reverse solidus or
-- a control character: separators all), made ready ONCE; no match of `p`, and no string holds a name. Else `p` is run
-- over it once more, a mark (U+0001, which a text made ready never holds) set before each name it finds (inside its
-- string: `p` consumes no neighbour and holds no quotation mark, so two names that share one are each found, and a
-- match between two strings marks none); the k-th quoted run of that is the k-th token of the value's text, so the
-- tokens whose run holds a mark are the answer, each by its JSON spelling (_gallery_veil_name_json): {spelling: true}.
-- With them, each token that holds, as written, a name that is separators only (its JSON spelling in the token's).
-- Were the two texts ever to hold a different number of quoted runs (the proof says never), every token is the
-- answer: the walk then withholds every string and key but the floors. Whether one string or key holds a hidden name
-- is from here on a look-up among these (_gallery_veil_name_hit, _named, _sweep): the alternation is never run a
-- string at a time, and no text is made ready again.
-- THE CLOSED ANSWER (VEIL-17, V8-9): a closed search (past THE PATTERN'S BOUND, _gallery_veil_name_search), and a run of
-- the search that raises, answer every token, as above: where the veil cannot ask, every string and key may hold a
-- hidden name.
create or replace function public._gallery_veil_name_hits(v jsonb, srch jsonb)
returns jsonb language plpgsql immutable as $$
declare
  r text := v::text;
  q text;              -- the value's text with its tokens' ends bare: its quoted runs are its tokens' JSON spellings
  n text;
  p text := srch ->> 'p';
  raws jsonb := coalesce(srch -> 'raw', '[]');
  rq text[];
  aq text[];
  an text[];
  h jsonb := '{}';
begin
  if coalesce(srch -> 'closed' = 'true'::jsonb, false) then
    return coalesce((select jsonb_object_agg(u.t, true) from unnest(string_to_array(public._gallery_veil_name_json(r), '"')) with ordinality u(t, o) where u.o % 2 = 0), '{}');
  end if;
  if p is null and raws = '[]' then return '{}'; end if;
  if p is not null then
    begin
    n := r;
    if position(chr(92) in n) > 0 then n := regexp_replace(n, '\\(?:u[0-9a-fA-F]{4}|.)', ' ', 'g'); end if;
    n := public._gallery_veil_name_ready(n, srch -> 'blank');
    if n ~ p then
      q := public._gallery_veil_name_json(r);
      aq := string_to_array(q, '"');
      an := string_to_array(regexp_replace(n, p, chr(1) || '\&', 'g'), '"');
      if cardinality(an) is distinct from cardinality(aq) then
        return coalesce((select jsonb_object_agg(u.t, true) from unnest(aq) with ordinality u(t, o) where u.o % 2 = 0), '{}');
      end if;
      select coalesce(jsonb_object_agg(u.b, true), '{}') into h
        from unnest(an, aq) with ordinality u(a, b, o) where u.o % 2 = 0 and position(chr(1) in u.a) > 0;
    end if;
    exception when others then
      return coalesce((select jsonb_object_agg(u.t, true) from unnest(string_to_array(public._gallery_veil_name_json(r), '"')) with ordinality u(t, o) where u.o % 2 = 0), '{}');
    end;
  end if;
  if raws <> '[]' then
    if q is null then q := public._gallery_veil_name_json(r); aq := string_to_array(q, '"'); end if;
    -- the separators-only names, each by its JSON spelling, those the text holds at all; then each token that holds one
    rq := array(select z.x from (select public._gallery_veil_name_json(substr(j, 2, length(j) - 2)) as x
                                   from (select to_jsonb(e)::text as j from jsonb_array_elements_text(raws) e) y) z
                 where position(z.x in q) > 0);
    if cardinality(rq) > 0 then
      h := h || coalesce((select jsonb_object_agg(u.t, true) from unnest(aq) with ordinality u(t, o)
                           where u.o % 2 = 0 and exists (select 1 from unnest(rq) x where position(x in u.t) > 0)), '{}');
    end if;
  end if;
  return h;
end $$;

-- [212: NEW] public._gallery_veil_name_hit
-- One string or key holds a hidden name: its JSON spelling is one of `hits` (VEIL-16: `hits` holds the tokens that hold
-- a name by the search and those that hold a separators-only name as written; `blank` and `raws` are in it, and stay
-- in the signature). Asked of a string of the document `hits` was read from, or of a shortening of it (each of its
-- strings is one of the document's): the same answer as the search asked of that string alone (the guard).
create or replace function public._gallery_veil_name_hit(t text, hits jsonb, blank jsonb, raws jsonb)
returns boolean language sql immutable as $$
  select hits ? public._gallery_veil_name_json(left(right(to_jsonb(t)::text, -1), -1))
$$;

-- [212: NEW] public._gallery_veil_named
-- Some key or string of the value, at any depth, holds a hidden name (exact, and without a call a level: the value's
-- tokens are read off its text, each by its JSON spelling, in one split).
create or replace function public._gallery_veil_named(v jsonb, hits jsonb, blank jsonb, raws jsonb)
returns boolean language sql immutable as $$
  select coalesce(jsonb_typeof(v) in ('string', 'object', 'array') and hits <> '{}'
    and exists (select 1 from unnest(string_to_array(public._gallery_veil_name_json(v::text), '"')) with ordinality u(t, o)
                 where u.o % 2 = 0 and hits ? u.t), false)
$$;

-- [212: NEW] public._gallery_veil_name_tokens
-- How many tokens (strings and keys, at any depth) a value's JSON text holds (VEIL-16, V8-3): a string one; a container
-- half the quotation marks its text holds with its tokens' ends bare; any other value none.
create or replace function public._gallery_veil_name_tokens(v jsonb)
returns int language sql immutable as $$
  select case jsonb_typeof(v) when 'string' then 1
                              when 'object' then (octet_length(x.j) - octet_length(replace(x.j, '"', ''))) / 2
                              when 'array' then (octet_length(x.j) - octet_length(replace(x.j, '"', ''))) / 2
                              else 0 end
    from (select case when jsonb_typeof(v) in ('object', 'array') then public._gallery_veil_name_json(v::text) end as j offset 0) x
$$;

-- [212: NEW] public._gallery_veil_name_near
-- A container may hold a hit (VEIL-16, V8-3; exact on the tokens: a hit's place stands among its own): the container
-- has `b` tokens of the document before it and `n` of its own; `hk` is the places of the tokens that hold a hit,
-- ascending. Two binary searches (width_bucket counts the places at or below a token).
create or replace function public._gallery_veil_name_near(b int, n int, hk int[])
returns boolean language sql immutable as $$
  select n > 0 and width_bucket(b + n, hk) > width_bucket(b, hk)
$$;

-- [212: NEW] public._gallery_veil_name_floor
-- THE FLOORS of a record, by the list it stands in (`list`: that list's path): the `id` and `name` of a house still
-- listed (its `label` where it has no name), a shown power's `faction` and `name`. Never asked, never taken.
-- VEIL-18 (REVIEW-VEIL-8's V8-4; the chair's ruling (1): a string that names a shown power by the power's own name is the
-- power's): an entry of master's top-level factions[] that IS a shown power takes the same floor, key by key: its
-- `faction` or `name` where that string, in the one fold (_gallery_veil_case_fold), is a shown power's `faction` or
-- `name` (`shown`: those folds, read once by the sweep off powerStructure.factions[], a power not flagged hidden); a key
-- that names no shown power, and an entry flagged hidden, take none (they stay swept), so nothing is floored beyond
-- what the power structure's floor already keeps.
create or replace function public._gallery_veil_name_floor(list jsonb, rec jsonb, shown text[])
returns jsonb language sql immutable as $$
  select case
    when jsonb_typeof(rec) is distinct from 'object' then '[]'::jsonb
    when list = '["institutions"]'::jsonb then case when public._gallery_veil_str(rec -> 'name') <> '' then '["id", "name"]'::jsonb else '["id", "name", "label"]'::jsonb end
    when list = '["powerStructure", "factions"]'::jsonb and not coalesce(rec -> 'hidden' = 'true'::jsonb, false) then '["faction", "name"]'::jsonb
    when list = '["factions"]'::jsonb and coalesce(cardinality(shown), 0) > 0 and not coalesce(rec -> 'hidden' = 'true'::jsonb, false) then
      coalesce((select jsonb_agg(k) from unnest(array['faction', 'name']) k
                 where jsonb_typeof(rec -> k) = 'string' and public._gallery_veil_case_fold(rec ->> k) = any(shown)), '[]'::jsonb)
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
-- hit (it descends only into a child that holds one, _gallery_veil_name_near, and never below a floor), and those
-- alone are rebuilt, deepest first. THE BOUND: the root is level 0; a container at level 64 is not walked: it is
-- withheld whole if it holds a hit at any depth (the closed answer), and sent as it is if it holds none.
-- IN ONE PASS (VEIL-16, V8-3): the places of the tokens that hold a hit are read off this document's text once (its
-- quoted runs, each looked up by its JSON spelling in `hits`), ascending; each node carries how many tokens of the
-- text stand before it, each child's own are counted once at its level (_gallery_veil_name_tokens: an object's entry
-- is its key and its value, in the order jsonb keeps and writes them), and a child is walked where a place falls in
-- its range (two binary searches). No child's text is made ready, and no step asks every hit.
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
  hk int[];     -- the places of the tokens that hold a hit, ascending (the k-th token of the document's text is k)
  shown text[]; -- VEIL-18 (V8-4): the shown powers' `faction` and `name`, in the one fold (_gallery_veil_name_floor)
begin
  -- `hits` holds the separators-only names' tokens too (VEIL-16): none, and nothing holds a name
  if hits = '{}' then return s; end if;
  hk := array(select (u.o / 2)::int from unnest(string_to_array(public._gallery_veil_name_json(s::text), '"')) with ordinality u(t, o)
               where u.o % 2 = 0 and hits ? u.t order by u.o);
  if cardinality(hk) = 0 then return s; end if;
  shown := array(select x from (select distinct public._gallery_veil_case_fold(f ->> nk) as x
                   from jsonb_array_elements(case when jsonb_typeof(s #> '{powerStructure,factions}') = 'array' then s #> '{powerStructure,factions}' else '[]' end) f,
                        unnest(array['faction', 'name']) nk
                  where jsonb_typeof(f) = 'object' and not coalesce(f -> 'hidden' = 'true'::jsonb, false) and jsonb_typeof(f -> nk) = 'string') q where x <> '');
  with recursive w(p, d, v, f, b) as (
      select '[]'::jsonb, 0, s, '["name"]'::jsonb, 0
    union all
      select w.p || to_jsonb(c.k), w.d + 1, c.v, c.f, c.b
        from w, lateral (
          -- an entry of a record: its key is a token, then its value's own; of a list: its value's own
          select e.k, e.v, e.f, e.b
            from (select x.k, x.v, '[]'::jsonb as f, m.m, (w.b + sum(1 + m.m) over (order by x.o) - m.m)::int as b
                    from jsonb_each(case when jsonb_typeof(w.v) = 'object' then w.v else '{}' end) with ordinality x(k, v, o),
                         lateral (select public._gallery_veil_name_tokens(x.v) as m offset 0) m) e
           where jsonb_typeof(e.v) in ('object', 'array') and not (w.f ? e.k) and public._gallery_veil_name_near(e.b, e.m, hk)
          union all
          select e.k, e.v, e.f, e.b
            from (select (y.o - 1)::text as k, y.v, public._gallery_veil_name_floor(w.p, y.v, shown) as f, m.m, (w.b + sum(m.m) over (order by y.o) - m.m)::int as b
                    from jsonb_array_elements(case when jsonb_typeof(w.v) = 'array' then w.v else '[]' end) with ordinality y(v, o),
                         lateral (select public._gallery_veil_name_tokens(y.v) as m offset 0) m) e
           where jsonb_typeof(e.v) in ('object', 'array') and public._gallery_veil_name_near(e.b, e.m, hk)) c
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
                                                else public._gallery_veil_name_taken(y.v, public._gallery_veil_name_floor(a.p, y.v, shown), wd[ix] + 2 >= 64, hits, blank, raws) end
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
-- R2 (VEIL-15; PART 12 sections 3 and 7): LOWERED AS THE ENGINE LOWERS, never by lower(), whose answer is the database's
-- locale's (U+0130 is 'i' in C.UTF-8 and itself in C; U+212A 'k' in C.UTF-8 and itself in C). The engine and the twin
-- lower by toLowerCase(), whose image of a code point outside ASCII holds an ASCII code point for U+0130 ('i' + U+0307)
-- and U+212A ('k') alone. So both sides are lowered by translate with those two spelled out (_gallery_veil_fold's two),
-- and for an ASCII NEEDLE (the lowered name's first twelve) the match is the engine's: every code point of every plane
-- measured, the lowered text holds the same ASCII runs in the same order as toLowerCase() gives
-- (docs/chair/2026-11-14/veil-probe-15/out/R2P-red-at-1d8ffe08e.txt). A needle holding a code point outside ASCII,
-- which no server engine lowers as JavaScript does: WHERE UNSURE, WITHHOLD. A house removed whole answers it where it
-- is the name or is named outside ASCII (an ASCII name lowers to ASCII and cannot hold it); a house still listed only
-- where it is the name (a stamped one never: its identity is read for an ASCII needle). gallerySecondHomes.js ::
-- withholdSecondHomes (hiddenName), rule for rule.
create or replace function public._gallery_veil_hidden_name(x jsonb, gone jsonb, births text[], opens jsonb)
returns boolean language sql immutable as $$
  select (exists (select 1 from jsonb_object_keys(gone) g
                   where g = q.v
                      or case when q.sure
                              then position(q.n in translate(replace(replace(g, chr(304), 'i' || chr(775)), chr(8490), 'k'),
                                                             'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')) > 0
                              else g ~ '[^\x01-\x7f]' end)
          or (q.f <> '' and exists (select 1 from unnest(births) b where position(q.f in b) > 0)))
     and not exists (select 1 from jsonb_array_elements(case when jsonb_typeof(opens) = 'array' then opens else '[]' end) o
                      where case when o ? 'cid' then q.sure and q.f <> '' and position(q.f in (o ->> 'cid')) > 0
                                 else (o ->> 'name') = q.v
                                      or (q.sure and position(q.n in translate(replace(replace(o ->> 'name', chr(304), 'i' || chr(775)), chr(8490), 'k'),
                                                                               'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')) > 0) end)
    from (select p.v, p.f, p.n, p.n !~ '[^\x01-\x7f]' as sure
            from (select r.v, public._gallery_veil_fold(left(r.v, 12)) as f,
                         left(translate(replace(replace(r.v, chr(304), 'i' || chr(775)), chr(8490), 'k'),
                                        'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 12) as n
                    from (select public._gallery_veil_str(x) as v) r) p) q
$$;

-- [212: NEW] public._gallery_veil_sources
-- What each second home's source IS and said, read BEFORE the eyes run. COHERENCE-VEIL-10 (V7-2), by identity:
-- EVERY tie with its two eyes [{n1, n2, ty, d, t, ds, ts}] (a copy is its tie's whether that tie is shut or open);
-- whether ANY current tension's description eye is shut (tension_shut); every event with its lasting-effects eye
-- [{n, ty, y, le}] (an annotation is its event's). And for the words: each house's shut eyes by name
-- {name: {desc, fn}} and (VEIL-18, V8-2) by catalogue identity {catalogId: {desc, fn}}, and (COHERENCE-VEIL-8) the pieces
-- of every shut string of an event.
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
          from eyes where kind = 'institution' and public._gallery_veil_str(card -> 'name') <> '' group by 1) h), '{}'),
    -- VEIL-18 (V8-2): each house's shut eyes BY ITS CATALOGUE IDENTITY {catalogId: {desc, fn}}, every house of one identity
    -- unioned (the eye that withholds)
    'house_ids', coalesce((select jsonb_object_agg(cid, jsonb_build_object('desc', d, 'fn', f)) from (
        select card ->> 'catalogId' as cid, bool_or(is_shut) filter (where eye = 'description') as d, bool_or(is_shut) filter (where eye = 'function') as f
          from eyes where kind = 'institution' and jsonb_typeof(card -> 'catalogId') = 'string' and (card ->> 'catalogId') <> '' group by 1) h), '{}'))
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
  hids jsonb := coalesce(src -> 'house_ids', '{}');   -- VEIL-18 (V8-2): the houses' shut eyes by catalogue identity
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
  swept text[];        -- VEIL-18 (V8-5): every identity of each person the sweep removes (id, name, the person's key)
  cut jsonb;           -- and the ties that name one of them, which leave with them
  cut_unsure boolean;
  pr_cut boolean;
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

  -- the defence profile's copy of a house: its description and function go with that house's eyes; the whole entry with a
  -- house hidden whole. VEIL-18 (REVIEW-VEIL-8's V8-2): A ROW IS ITS HOUSE'S BY NAME OR BY IDENTITY: the house of the same
  -- name, or any house whose catalogue identity is the fold of the row's name (_gallery_veil_fold: the name it was born
  -- with; the rename's writer moves `name` only, so a row a record keeps under the birth name is still that house's).
  -- Where two houses could own one row, it follows the eye that withholds (gallerySecondHomes.js :: withholdSecondHomes)
  if jsonb_typeof(s -> 'defenseProfile') = 'object' and jsonb_typeof(s #> '{defenseProfile,institutions}') = 'object' then
    for k, v in select * from jsonb_each(s #> '{defenseProfile,institutions}') loop
      if jsonb_typeof(v) <> 'array' then continue; end if;
      s := jsonb_set(s, array['defenseProfile', 'institutions', k], coalesce((
        select jsonb_agg(case when jsonb_typeof(r) <> 'object' then r
            else r - (case when coalesce((houses -> public._gallery_veil_str(r -> 'name') ->> 'desc')::boolean, false)
                             or coalesce((hids -> public._gallery_veil_fold(public._gallery_veil_str(r -> 'name')) ->> 'desc')::boolean, false)
                           then array['desc', 'description'] else '{}'::text[] end)
                   - (case when coalesce((houses -> public._gallery_veil_str(r -> 'name') ->> 'fn')::boolean, false)
                             or coalesce((hids -> public._gallery_veil_fold(public._gallery_veil_str(r -> 'name')) ->> 'fn')::boolean, false)
                           then array['tags', 'facets', 'serviceKeys'] else '{}'::text[] end) end
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
  -- VEIL-18 (REVIEW-VEIL-8's V8-5): A TIE WHOSE END THE SWEEP REMOVES LEAVES WITH IT. The walk below removes a person
  -- whose own `id` or `name` holds a hidden house's name (an entry of npcs[] whose id or name is taken, or every person
  -- where the key npcs is), and kept the tie that names them, pointing at nobody (its end's id still spelled who). Asked
  -- here, before the walk, by the walk's own answer (_gallery_veil_name_taken, no floor): each such person's identities
  -- (its id, its name, and the person's key npc.<the name's slug>, _gallery_npc_key's form) are swept; a tie of
  -- relationships[] any of whose ends (`from`, `to`; master's `npc1Id`, `npc2Id`; `npc1Name`, `npc2Name`) is one of them
  -- leaves whole, in both stored shapes. Its copies follow as a dropped tie's (ruling (5)'s rule,
  -- _gallery_apply_member_overrides): prominentRelationship WHOLE where it is that tie's copy (the same two ends and type,
  -- or a copy equal to its text); pressureSentence where it names that tie's two ends, or holds its words or (with the
  -- copy) the copy's (_gallery_veil_embeds, the one fold, both directions); both, WHERE UNSURE, where such a tie's two
  -- ends do not both carry a name. gallerySecondHomes.js :: withholdTiesOfTheSwept, rule for rule
  if hot and jsonb_typeof(s -> 'npcs') = 'array' and jsonb_typeof(s -> 'relationships') = 'array' then
    swept := array(select distinct x
                     from jsonb_array_elements(s -> 'npcs') n,
                          lateral (select translate(btrim(regexp_replace(public._gallery_veil_str(n -> 'name'), '[^a-zA-Z0-9]+', '_', 'g'), '_'),
                                                    'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz') as slug) g,
                          unnest(array[public._gallery_veil_str(n -> 'id'), public._gallery_veil_str(n -> 'name'),
                                       case when g.slug <> '' then 'npc.' || g.slug else '' end]) x
                    where jsonb_typeof(n) = 'object' and x <> ''
                      and (public._gallery_veil_name_hit('npcs', hits, blank, raws)
                           or public._gallery_veil_name_taken(n, '[]', false, hits, blank, raws)));
    if cardinality(swept) > 0 then
      select coalesce(jsonb_agg(q.t order by q.o) filter (where not q.g), '[]'), coalesce(jsonb_agg(q.t order by q.o) filter (where q.g), '[]')
        into kept, cut
        from (select x.t, x.o, jsonb_typeof(x.t) = 'object'
                       and exists (select 1 from unnest(array['from', 'to', 'npc1Id', 'npc2Id', 'npc1Name', 'npc2Name']) ek
                                    where public._gallery_veil_str(x.t -> ek) <> '' and public._gallery_veil_str(x.t -> ek) = any(swept)) as g
                from jsonb_array_elements(s -> 'relationships') with ordinality x(t, o)) q;
      if jsonb_array_length(cut) > 0 then
        s := jsonb_set(s, '{relationships}', kept);
        cut_unsure := exists (select 1 from jsonb_array_elements(cut) t
                               where public._gallery_veil_str(t -> 'npc1Name') = '' or public._gallery_veil_str(t -> 'npc2Name') = '');
        pr := s -> 'prominentRelationship';
        pr_cut := coalesce(jsonb_typeof(pr) = 'object'
          and exists (select 1 from jsonb_array_elements(cut) t
                       where (public._gallery_veil_str(t -> 'npc1Name') = public._gallery_veil_str(pr -> 'npc1') and public._gallery_veil_str(t -> 'npc2Name') = public._gallery_veil_str(pr -> 'npc2')
                              and public._gallery_veil_str(t -> 'typeName') = public._gallery_veil_str(pr -> 'type'))
                          or (public._gallery_veil_str(pr -> 'full') <> '' and t -> 'description' = pr -> 'full')
                          or (public._gallery_veil_str(pr -> 'tension') <> '' and t -> 'tension' = pr -> 'tension')), false);
        ps := s -> 'pressureSentence';
        if cut_unsure or pr_cut then s := s - 'prominentRelationship'; end if;
        if cut_unsure or coalesce(jsonb_typeof(ps) = 'string'
             and (exists (select 1 from jsonb_array_elements(cut) t
                           where public._gallery_veil_str(t -> 'npc1Name') <> '' and public._gallery_veil_str(t -> 'npc2Name') <> ''
                             and position(public._gallery_veil_str(t -> 'npc1Name') in (ps #>> '{}')) > 0
                             and position(public._gallery_veil_str(t -> 'npc2Name') in (ps #>> '{}')) > 0)
                  or public._gallery_veil_embeds(ps, public._gallery_veil_pieces(jsonb_build_array(
                       (select jsonb_agg(jsonb_build_array(t -> 'description', t -> 'tension')) from jsonb_array_elements(cut) t),
                       case when pr_cut then jsonb_build_array(pr -> 'full', pr -> 'tension') end)))), false) then
          s := s - 'pressureSentence';
        end if;
      end if;
    end if;
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
-- VEIL-13, RULING (5) (the chair's ruling (5) and its 04:55 addition; the seat's call V13-1): THE COVERT TIE'S FOUR
-- STRINGS. The public sanitiser drops a tie flagged `covert: true` from relationships[]; the veil's apply sees only that
-- projection, where a dropped tie cannot be told from a copy whose people were renamed. This function holds the full
-- town (`dm_full`: the gallery read's and the import's _gallery_dm_full_json; on the party link the projection with the
-- live town's relationships[], prominentRelationship and pressureSentence), so ONE CASE around the splice judges the
-- identity IN ONE SPELLING, the full town's own copy and sentence against the full town's own ties (the projection
-- writes a hidden power's name as 'an unseen interest' in every string leaf, the full town as written: compared across
-- the two, a copy whose end or text holds that name was its tie's in neither), and withholds the projection's:
--   prominentRelationship, WHOLE, where the full town's copy is the copy of a DROPPED tie (the same two ends and type, or
--     a copy equal to its text: _gallery_veil_second_homes' own rule); dropped, by the sanitiser's own condition (210 ::
--     _gallery_sanitize_public_json: a non-root object whose `covert` is JSON true is removed): on a public read every
--     tie of the full town flagged so, on a Reveal-DM read none;
--   pressureSentence, which the record ties to no tie, where the full town's sentence names both ends of a dropped tie,
--     each end found by position as rule (1) of _gallery_veil_second_homes finds it, or holds the words
--     (_gallery_veil_embeds, the one fold, both directions) of that tie's description or tension or, where the copy goes
--     with it, the copy's stored wording (prominentRelationship.full, .tension);
--   both, on a public read, WHERE UNSURE: the full town is not an object, its relationships[] is there and not an array,
--     or a dropped tie's two ends do not both carry a name; and a projection that is not an object, holding either key
--     at any depth, is the closed answer {} (the veil's own answer for it; the twin's public projection of it is {}).
-- Reveal DM keeps the tie in the projection, so it keeps the four strings. Ruling (3) stands for every other pressure
-- sentence. dm_full is read here for its npcs[] by the splice (a revealed person's own record) and for its
-- relationships[], prominentRelationship and pressureSentence by this CASE; nothing else of it. Twin, rule for rule:
-- gallerySecondHomes.js :: withholdCovertCopies, called by galleryVeil.js :: galleryPayloadFor.
create or replace function public._gallery_apply_member_overrides(
  base jsonb,
  dm_full jsonb,
  overrides jsonb,
  settlement_share_dm boolean,
  settlement_importable boolean,
  for_import boolean
) returns jsonb language sql immutable as $$
  -- VEIL-13, ruling (5): the four strings of a covert tie the projection drops (the CASE; the splice is as before)
  select case
    when jsonb_typeof(sp.d) is distinct from 'object' then
      case when not coalesce(settlement_share_dm, false)
                and (jsonb_path_exists(sp.d, 'lax $.**.prominentRelationship') or jsonb_path_exists(sp.d, 'lax $.**.pressureSentence'))
           then '{}'::jsonb else sp.d end
    when cv.closed or cv.pr_dropped or ws.ps_told
      then sp.d - array_remove(array[case when cv.closed or cv.pr_dropped then 'prominentRelationship' end,
                                     case when cv.closed or ws.ps_told then 'pressureSentence' end], null)
    else sp.d
  end
  from (
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
  end, overrides, settlement_share_dm, settlement_importable, for_import) as d
  offset 0) sp
  -- THE FULL TOWN IN ONE SPELLING: its own copy, its own sentence, its own ties. `pub`: a read the sanitiser projected
  -- (Reveal DM off; the party link always); `dropped`: on such a read, every tie of the full town the sanitiser removes by
  -- its own condition (an object of relationships[] whose `covert` is JSON true); `unread`: the full town or its ties
  -- cannot be read
  cross join lateral (
    select not coalesce(settlement_share_dm, false) as pub,
           jsonb_typeof(dm_full) is distinct from 'object'
             or (dm_full ? 'relationships' and jsonb_typeof(dm_full -> 'relationships') is distinct from 'array') as unread,
           coalesce((select jsonb_agg(t) from jsonb_array_elements(case when jsonb_typeof(dm_full -> 'relationships') = 'array' then dm_full -> 'relationships' else '[]' end) t
                      where jsonb_typeof(t) = 'object' and (t -> 'covert') = 'true'::jsonb), '[]') as dropped,
           dm_full -> 'prominentRelationship' as pr,
           dm_full -> 'pressureSentence' as ps
    offset 0
  ) cw
  -- `closed`: unsure, so both go; `pr_dropped`: the full town's copy is a dropped tie's (raw against raw)
  cross join lateral (
    select cw.pub and (cw.unread or exists (select 1 from jsonb_array_elements(cw.dropped) t
                                             where public._gallery_veil_str(t -> 'npc1Name') = '' or public._gallery_veil_str(t -> 'npc2Name') = '')) as closed,
           cw.pub and coalesce(jsonb_typeof(cw.pr) = 'object'
             and exists (select 1 from jsonb_array_elements(cw.dropped) t
                          where (public._gallery_veil_str(t -> 'npc1Name') = public._gallery_veil_str(cw.pr -> 'npc1') and public._gallery_veil_str(t -> 'npc2Name') = public._gallery_veil_str(cw.pr -> 'npc2')
                                 and public._gallery_veil_str(t -> 'typeName') = public._gallery_veil_str(cw.pr -> 'type'))
                             or (public._gallery_veil_str(cw.pr -> 'full') <> '' and t -> 'description' = cw.pr -> 'full')
                             or (public._gallery_veil_str(cw.pr -> 'tension') <> '' and t -> 'tension' = cw.pr -> 'tension')), false) as pr_dropped
    offset 0
  ) cv
  -- `ps_told`: the full town's pressure sentence names both ends of a dropped tie, or holds its words, current or (with the
  -- copy) stored
  cross join lateral (
    select cw.pub and coalesce(jsonb_typeof(cw.ps) = 'string'
      and (exists (select 1 from jsonb_array_elements(cw.dropped) t
                    where public._gallery_veil_str(t -> 'npc1Name') <> '' and public._gallery_veil_str(t -> 'npc2Name') <> ''
                      and position(public._gallery_veil_str(t -> 'npc1Name') in (cw.ps #>> '{}')) > 0
                      and position(public._gallery_veil_str(t -> 'npc2Name') in (cw.ps #>> '{}')) > 0)
           or public._gallery_veil_embeds(cw.ps, public._gallery_veil_pieces(jsonb_build_array(
                (select jsonb_agg(jsonb_build_array(t -> 'description', t -> 'tension')) from jsonb_array_elements(cw.dropped) t),
                case when cv.pr_dropped then jsonb_build_array(cw.pr -> 'full', cw.pr -> 'tension') end)))), false) as ps_told
    offset 0
  ) ws;
$$;

-- ════════════════════════════════════════════════════════════════════════════
-- VEIL-DOORS (the seventh chair's seat, 2026-11-20): THE DOORS BESIDE `data`
-- ════════════════════════════════════════════════════════════════════════════
-- REVIEW-VEIL-10 read everything else a non-owner read returns and found three doors the veil never passed (each read
-- as anon on a chain 001..212 at bedd5a392; tests/security/galleryDoors.pglite.test.js holds each, red at that commit):
--   V10-1 THE CHRONICLE: get_gallery_dossier's `chronicle` and every map member's (032's allowlist of the eventLog) named a
--     house the share hides ("A new Black market was established."; IMPOSE_CORRUPTION "... turned by the Smuggling network").
--   V10-3 THE TILES: _gallery_public_tile_rows (147) read stability, prosperity and the rest RAW from the row, for every
--     list, filter, sort and count and for the dossier's top-level columns; a closed answer was sent beside them.
--   V10-4 THE MAP MEMBER: get_gallery_map served a member with no veil of its own through the sanitiser alone.
-- THE RULINGS (the seventh chair's VR19 to VR23; each vetoable by the owner), as built here:
--   (1) THE TILES (VR19, VR22): one rule, in the tile rows every list, filter, sort and count and the dossier read: a row
--       with no veil marker is served as before (VR23: R4's sparing of an unmarked listed page, tiles included); a marked
--       row's tiles are read from the document the read itself serves (the narration where narrated, the frozen copy in
--       snapshot mode), never from a stored copy of it (the facet columns): stability is its BAND WORD ALONE
--       (_gallery_doors_band: labelBands.js :: STABILITY_BANDS, the longest that opens the label and is not followed by a
--       letter), the cause never; prosperity its stored band (VR28 tier 2: a coarse band of a closed vocabulary, sent as
--       stored, its inversion count the recorded residual); every tile drawn from the town is withheld where a
--       name a share could hide lies inside it (_gallery_doors_names, _gallery_doors_tile). The dossier read sends no tile
--       beside the closed answer. _gallery_public_tile_rows is callable by no visitor (Supabase's default privileges
--       granted it to anon and authenticated: `revoke ... from public` never reached them).
--   (2) THE CHRONICLE (VR20 (B), VR21): _gallery_doors_chronicle, each entry by its own veil (section below).
--   (3) THE MAP MEMBER (VR23): a member is read through its own veil, and a member with none takes the default veil, as
--       the party link's unmarked share does (R4: "the readers are players"); its chronicle by (2).
-- COUPLED CLIENT TWIN: src/domain/display/galleryDoors.js (tilesUnderVeil, veilChronicle), rule for rule.
-- NOT CHANGED: every _gallery_veil* helper (called, never edited), _gallery_chronicle_entry and _gallery_chronicle_json
-- (032), every list's body (each reads the tile rows).

-- [212: NEW, VEIL-DOORS] public._gallery_doors_band
-- THE STABILITY TILE'S BAND WORD (VR19): the longest band of labelBands.js :: STABILITY_BANDS that opens the label (its
-- spaces and tabs at either end trimmed) and is not followed by an ASCII letter; NULL where none does. The same table as
-- the client's (tests/security/galleryDoors.walker.test.js compares them); the twin is galleryDoors.js :: tileBand.
create or replace function public._gallery_doors_band(label text)
returns text language sql immutable as $$
  select b.w
    from (select btrim(coalesce(label, ''), E' \t\n\r') as t) x,
         unnest(array['Enforced Order', 'Unstable', 'Rigid', 'Fragile', 'Tense', 'Stable', 'Vulnerable', 'Ordered', 'Critical',
                      'Suppressed', 'Fractured', 'Shaken', 'Desperate', 'Anxious', 'Volatile', 'Strained']) b(w)
   where left(x.t, char_length(b.w)) = b.w and substr(x.t, char_length(b.w) + 1, 1) !~ '[A-Za-z]'
   order by char_length(b.w) desc
   limit 1
$$;

-- [212: NEW, VEIL-DOORS] public._gallery_doors_squeeze
-- The name search's fold (_gallery_veil_name_fold) with its separators squeezed out. A text of ASCII alone (the tiles'
-- words, nearly always) takes the same answer by one lowering and one replace: in ASCII every character that is not a
-- letter or a digit is a separator (_gallery_veil_name_sep) and nothing is padded or prepared; any other text takes the
-- fold itself. galleryDoors.js :: squeezedFold is the twin.
create or replace function public._gallery_doors_squeeze(t text)
returns text language sql immutable as $$
  select case when t is null then null
              when t !~ '[^\x01-\x7f]' then regexp_replace(translate(t, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '[^a-z0-9]+', '', 'g')
              else replace(public._gallery_veil_name_fold(t), '_', '') end
$$;

-- [212: NEW, VEIL-DOORS] public._gallery_doors_names
-- EVERY NAME A SHARE COULD HIDE, read off the served source WITHOUT the veil (a list asks it of every row, and the veil
-- is the read's cost): each house in the hideable class (_gallery_veil_house: the only houses any veil removes whole,
-- X-21e) by its name, its name without the bracketed qualifier, its label and its catalogue identity; and each power
-- flagged hidden by its `faction` and `name` (the sanitiser removes it from every public projection). Each in the name
-- search's fold (_gallery_veil_name_fold: every script, A-Z lowered) with its separators squeezed out, so a tile is
-- asked by containment (no boundary, no form): a superset of what the name search asks.
create or replace function public._gallery_doors_names(ins jsonb, powers jsonb)
returns text[] language sql immutable as $$
  select coalesce(array_agg(distinct q.f) filter (where q.f <> ''), '{}')
    from (
      select public._gallery_doors_squeeze(n.v) as f
        from (select i from jsonb_array_elements(case when jsonb_typeof(ins) = 'array' then ins else '[]' end) i
               where jsonb_typeof(i) = 'object'
                 -- a necessary condition of the house predicate, asked first (the predicate is the list's cost): a criminal
                 -- category or priority category, declared facets, the tag 'criminal' or a facet tag
                 and (position('criminal' in lower(coalesce(i ->> 'category', '') || ' ' || coalesce(i ->> 'priorityCategory', ''))) > 0
                      or jsonb_typeof(i -> 'facets') = 'object' or coalesce(i -> 'tags' @> '["criminal"]', false)
                      or coalesce(position('facet:' in (i -> 'tags')::text) > 0, false))
                 and public._gallery_veil_house(i)
              offset 0) h,
             lateral (values (public._gallery_veil_str(h.i -> 'name')),
                             (regexp_replace(public._gallery_veil_str(h.i -> 'name'), '(?:[ \t]*[(\[][^()\[\]]*[)\]])+[ \t]*$', '')),
                             (public._gallery_veil_str(h.i -> 'label')),
                             (public._gallery_veil_str(h.i -> 'catalogId'))) n(v)
      union all
      select public._gallery_doors_squeeze(public._gallery_veil_str(f -> k))
        from (select f from jsonb_array_elements(case when jsonb_typeof(powers) = 'array' then powers else '[]' end) f
               where jsonb_typeof(f) = 'object' and coalesce(f -> 'hidden' = 'true'::jsonb, false) offset 0) p,
             unnest(array['faction', 'name']) k
    ) q
$$;

-- [212: NEW, VEIL-DOORS] public._gallery_doors_tile
-- A tile drawn from the town, on a marked row: withheld (NULL) where any name a share could hide lies inside it, in the
-- one fold, separators squeezed out; else the value as the row has it.
create or replace function public._gallery_doors_tile(v text, names text[])
returns text language sql immutable as $$
  select case when v is null then null
              when cardinality(names) > 0
                   and exists (select 1 from unnest(names) n where position(n in public._gallery_doors_squeeze(v)) > 0)
                then null
              else v end
$$;

-- [212: NEW, VEIL-DOORS] public._gallery_doors_tiles
-- THE TILE RULE FOR ONE ROW ((1) above), the one statement both the tile rows (every public row) and get_gallery_dossier
-- (its ONE row) read: given the row's own columns, its ten tile columns. A row with no veil marker: 147's columns exactly
-- (the facet copies first, then the document). A marked row: the document is the read's own source (the frozen copy in
-- snapshot mode, then the narration where narrated: the bytes the gallery read veils), each tile drawn from the town is
-- read from it by 147's paths, stability is its band word, prosperity its stored band (VR28), and every tile is withheld
-- where a name a share could hide lies inside it; the facet copies are not read. A plain SQL function of one SELECT, no
-- definer and no SET, so the planner inlines it into each caller, and NO `offset 0` fence on the source document (a fence
-- there cost an unmarked row 1.4 times its 147 cost in the list, measured): an unmarked row costs what 147's cost.
create or replace function public._gallery_doors_tiles(p_data jsonb, p_overrides jsonb, p_narrated boolean, p_ai jsonb,
                                                       p_culture text, p_prosperity text, p_deity text)
returns table (
  population integer,
  terrain text,
  government_type text,
  magic_level text,
  stability text,
  primary_resource text,
  threat_level text,
  culture text,
  prosperity text,
  primary_deity text
)
language sql
stable
as $$
  select
    case when (t.d ->> 'population') ~ '^[0-9]+$' then (t.d ->> 'population')::integer else null end,
    case when t.marked then public._gallery_doors_tile(t.terrain, t.names) else t.terrain end,
    case when t.marked then public._gallery_doors_tile(t.government_type, t.names) else t.government_type end,
    case when t.marked then public._gallery_doors_tile(t.magic_level, t.names) else t.magic_level end,
    case when t.marked then public._gallery_doors_tile(public._gallery_doors_band(t.stability), t.names) else t.stability end,
    case when t.marked then public._gallery_doors_tile(t.primary_resource, t.names) else t.primary_resource end,
    case when t.marked then public._gallery_doors_tile(t.threat_level, t.names) else t.threat_level end,
    case when t.marked then public._gallery_doors_tile(nullif(t.d #>> '{config,culture}', ''), t.names)
         else coalesce(nullif(p_culture, ''), nullif(t.d #>> '{config,culture}', '')) end,
    case when t.marked then public._gallery_doors_tile(nullif(t.d #>> '{economicState,prosperity}', ''), t.names)
         else coalesce(nullif(p_prosperity, ''), nullif(t.d #>> '{economicState,prosperity}', '')) end,
    case when t.marked then public._gallery_doors_tile(nullif(t.d #>> '{config,primaryDeitySnapshot,name}', ''), t.names)
         else coalesce(nullif(p_deity, ''), nullif(t.d #>> '{config,primaryDeitySnapshot,name}', '')) end
  from (
    select mk.marked, d.d, x.names,
      coalesce(nullif(d.d #>> '{config,terrainType}', ''), nullif(d.d #>> '{config,terrainOverride}', ''),
               nullif(d.d #>> '{geography,terrain}', ''), nullif(d.d ->> 'terrain', '')) as terrain,
      coalesce(nullif(d.d #>> '{powerStructure,government}', ''), nullif(d.d #>> '{powerStructure,governingName}', ''),
               nullif(d.d #>> '{powerStructure,governmentType}', ''), nullif(d.d #>> '{government,type}', ''),
               nullif(d.d ->> 'governmentType', '')) as government_type,
      coalesce(nullif(d.d #>> '{config,magicLevel}', ''), nullif(d.d ->> 'magicLevel', '')) as magic_level,
      coalesce(nullif(d.d #>> '{powerStructure,stability}', ''), nullif(d.d #>> '{viability,stability}', ''),
               nullif(d.d #>> '{systemState,stability}', ''), nullif(d.d ->> 'stability', '')) as stability,
      coalesce(nullif(d.d #>> '{config,nearbyResources,0}', ''), nullif(d.d #>> '{nearbyResources,0}', '')) as primary_resource,
      coalesce(nullif(d.d #>> '{threatProfile,level}', ''), nullif(d.d #>> '{defense,threatLevel}', ''),
               nullif(d.d ->> 'threatLevel', '')) as threat_level
      -- the marker, read once; for a marked row the read's own source (the gallery read's `base` and `src` laterals)
      from (select coalesce(jsonb_typeof(p_overrides -> '$veil') = 'object', false) as marked offset 0) mk
      cross join lateral (select case
              when not mk.marked then p_data
              when p_overrides #>> '{$veil,mode}' = 'snapshot' and jsonb_typeof(p_overrides #> '{$veil,snapshot}') = 'object'
                then p_overrides #> '{$veil,snapshot}'
              when p_narrated and p_ai is not null and jsonb_typeof(p_ai -> 'aiSettlement') = 'object'
                then p_ai -> 'aiSettlement'
              else p_data end as d) d
      cross join lateral (select case when mk.marked then public._gallery_doors_names(d.d -> 'institutions', d.d #> '{powerStructure,factions}') end as names offset 0) x
  ) t
$$;

-- [212: RESTATED, VEIL-DOORS] public._gallery_public_tile_rows
-- 147's statement (every column, in its order), its ten tile columns by THE TILE RULE (_gallery_doors_tiles, (1) above).
-- Every list, filter, sort and count reads these rows; get_gallery_dossier reads the same rule for its one row. The pg_temp
-- pin a recreated definer takes. Called only by the reads (the grant below).
create or replace function public._gallery_public_tile_rows()
returns table (
  id uuid,
  public_slug text,
  name text,
  tier text,
  published_at timestamptz,
  updated_at timestamptz,
  view_count integer,
  is_curated boolean,
  gallery_description text,
  gallery_image_url text,
  gallery_image_alt text,
  gallery_tags text[],
  population integer,
  terrain text,
  government_type text,
  magic_level text,
  stability text,
  primary_resource text,
  threat_level text,
  culture text,
  prosperity text,
  primary_deity text,
  at_war boolean,
  net_votes integer,
  comment_count integer,
  owner_id uuid,
  importable boolean,
  aliveness integer,
  reactions jsonb
)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select
    s.id,
    s.public_slug,
    coalesce(nullif(btrim(s.gallery_title), ''), s.name) as name,
    s.tier,
    s.published_at,
    coalesce(s.gallery_updated_at, s.updated_at, s.published_at) as updated_at,
    s.view_count,
    s.is_curated,
    s.gallery_description,
    s.gallery_image_url,
    s.gallery_image_alt,
    s.gallery_tags,
    t.population,
    t.terrain,
    t.government_type,
    t.magic_level,
    t.stability,
    t.primary_resource,
    t.threat_level,
    t.culture,
    t.prosperity,
    t.primary_deity,
    coalesce(s.gallery_facet_at_war, false) as at_war,
    coalesce(v.vote_count, 0)::integer as net_votes,
    coalesce(c.comment_count, 0)::integer as comment_count,
    s.user_id as owner_id,
    coalesce(s.gallery_importable, false) as importable,
    s.gallery_facet_aliveness as aliveness,
    coalesce(rx.reactions, '{}'::jsonb) as reactions
  from public.settlements s
  cross join lateral public._gallery_doors_tiles(s.data, s.gallery_member_overrides, s.gallery_share_narrated, s.ai_data,
                                                 s.gallery_facet_culture, s.gallery_facet_prosperity, s.gallery_facet_deity) t
  left join (
    select settlement_id, count(*)::integer as vote_count
    from public.gallery_votes
    group by settlement_id
  ) v on v.settlement_id = s.id
  left join (
    select settlement_id, count(*)::integer as comment_count
    from public.gallery_comments
    where deleted_at is null
    group by settlement_id
  ) c on c.settlement_id = s.id
  left join (
    select settlement_id, jsonb_object_agg(reaction_key, cnt) as reactions
    from (
      select settlement_id, reaction_key, count(*)::integer as cnt
      from public.gallery_reactions
      group by settlement_id, reaction_key
    ) rk
    group by settlement_id
  ) rx on rx.settlement_id = s.id
  where s.is_public = true;
$$;

revoke execute on function public._gallery_public_tile_rows() from public, anon, authenticated;

-- [212: NEW, VEIL-DOORS] public._gallery_doors_chronicle_classes
-- THE CHRONICLE'S CLASSES (VEIL-DOORS-2, item 5: every type the app writes to campaign_state.eventLog classed ON PURPOSE
-- against the default veil's classes; VEIL-DOORS-2-HANDBACK.md holds the table with each type's rule, why and example):
--   'house' / 'person' / 'power': the entry acts on a house, a person or a power of the town (its target, and a house it
--     places a person at); what it names the served body does not show is withheld like a removed house (below);
--   'target': the entry acts on what is no house, person or power of the town (a road, a neighbour, a resource, a good,
--     a god, the tier, a plague); the name search alone;
--   'covert': the act is the underworld's or exists only because of crime (IMPOSE_CORRUPTION: a house turned in the
--     shadows; EXPOSE_CORRUPTION: it tells that a house was corrupt): withheld wherever a criminal grouping is shut;
--   'stressor': a crisis; withheld wherever a criminal grouping is shut when its key is a crime's (criminal_corridor,
--     infiltration, infiltrated: "Criminal corridor grips the settlement.");
--   'withheld': the DM's free text at the table (TABLE_INCIDENT: the session ledger's flavor, which no rule can read):
--     never on a marked share.
-- A type no class knows is withheld (tests/security/galleryDoors.walker.test.js reds on a type the app writes and this
-- omits, and on a class outside these).
create or replace function public._gallery_doors_chronicle_classes()
returns jsonb language sql immutable as $$
  select '{
    "ADD_INSTITUTION": "house", "REMOVE_INSTITUTION": "house", "DAMAGE_INSTITUTION": "house", "IMPAIR_INSTITUTION": "house",
    "RESTORE_INSTITUTION": "house",
    "ADD_NPC": "person", "KILL_NPC": "person", "ASSIGN_NPC_TO_ROLE": "person", "KILL_LEADER": "person", "PROMOTE_NPC": "person",
    "DEMOTE_NPC": "person",
    "IMPAIR_FACTION": "power", "RESTORE_FACTION": "power", "ADD_FACTION": "power", "CHANGE_RULING_POWER": "power",
    "IMPOSE_CORRUPTION": "covert", "EXPOSE_CORRUPTION": "covert",
    "APPLY_STRESSOR": "stressor", "RESOLVE_STRESSOR": "stressor",
    "TABLE_INCIDENT": "withheld",
    "DEPLETE_RESOURCE": "target", "CUT_TRADE_ROUTE": "target", "CREATE_ROUTE": "target", "SETTLEMENT_DISPUTE": "target",
    "DESTROY_SETTLEMENT": "target", "REFUGEE_WAVE": "target", "PLAGUE": "target", "RAID_OR_MONSTER_ATTACK": "target",
    "REMOVED_THREAT": "target", "BROKERED_ALLIANCE": "target", "STARTED_RIOT": "target", "OPENED_TRADE_ROUTE": "target",
    "RECOVERED_RESOURCE": "target", "ADD_TRADE_GOOD": "target", "REMOVE_TRADE_GOOD": "target", "ADD_RESOURCE": "target",
    "SET_PRIMARY_DEITY": "target", "IMPOSE_CULT": "target", "SHIFT_TIER": "target", "REMOVE_RESOURCE": "target",
    "FORCE_RELIEF": "target", "OFFER_CREDIT": "target", "RENAME_SETTLEMENT": "target"
  }'::jsonb
$$;

-- [212: NEW, VEIL-DOORS] public._gallery_doors_chronicle
-- THE CHRONICLE BY ITS OWN VEIL (VR20 (B), VR21). `log`: the raw campaign_state.eventLog; `proj`: the projection the read
-- veiled; `v`: _gallery_veil's answer for it; `src`: the read's source (the hidden powers' names, which the projection
-- masks); `share_dm`: Reveal DM.
--   An UNMARKED listed share (no body: the read serves `data` as before): 032's chronicle exactly (VR23, R4).
--   THE CLOSED ANSWER (the body is the town's name alone): no chronicle.
--   Else each entry (an object of the log) is WITHHELD WHOLE where
--     its type (the event's, else the row's own) has no class (_gallery_doors_chronicle_classes);
--     its class is 'covert' (or 'stressor' with a crime's key) and the share shuts a criminal grouping or removes a house
--       whole; its class is 'withheld';
--     the name search (_gallery_veil_name_search and _name_hits, VEIL-19's, called) finds in its summary, its target
--       (the event's and the row's) or its payload a name the read withheld: every house the veil removed whole (in
--       the projection and not in the body, by id: its name, its label, its catalogue identity), every person it
--       removed (by id: the name), and on a read the sanitiser projects every power flagged hidden (`faction`, `name`),
--       AND (VEIL-DOORS-2) every house, person or power THE LOG ITSELF acts on that the served body does not show: the
--       target of each 'house', 'person' or 'power' entry (as the registry narrates it, src/domain/events/registry.js ::
--       labelOf) and each house it places a person at (payload.institution, payload.criminalInstitution), unless, in the
--       squeezed fold, it is an open house's name, label or catalogue identity, a shown power's, or a shown person's name
--       or id (a house removed since, or added after a freeze, is no longer in the projection: the search asked of it alone
--       let its name through, executed at ebe9387a2);
--       the open houses and the shown powers are its cut-outs, as the veil's own search has them.
--   Then THE NEWEST FIFTY OF WHAT IS SERVED (VR21: the window is taken after the removal, never before), in the log's
--   order, each entry as a shared page draws it and no more: its summary, its time (the row's timestamp where truthy,
--   else appliedAt: the page's order), partyCaused (true where the entry or its event is party-caused or caused
--   'party_action': the page's stamp), and its event's type (the page's title). No id: a flavor row's id holds the log's
--   length when it was written (a counter taken before the removal), and the page needs none (it numbers what it gets).
create or replace function public._gallery_doors_chronicle(log jsonb, proj jsonb, v jsonb, src jsonb, share_dm boolean)
returns jsonb language plpgsql immutable as $$
declare
  body jsonb := v -> 'body';
  shut boolean;
  nm text[];
  opens text[];
  srch jsonb;
  hits jsonb := '{}';
  doc jsonb;
begin
  if body is null then return public._gallery_chronicle_json(log); end if;
  if jsonb_typeof(log) is distinct from 'array' then return null; end if;
  if jsonb_typeof(body) is distinct from 'object' or (body - 'name') = '{}'::jsonb then return null; end if;
  if jsonb_typeof(proj) is distinct from 'object' then proj := '{}'; end if;
  -- what the read withheld, by identity
  with gone as (
    select c.card from public._gallery_veil_cards(proj, 'institution') c
     where public._gallery_veil_inst_id(c.card) is not null
       and public._gallery_veil_inst_id(c.card) not in (select public._gallery_veil_inst_id(b.card) from public._gallery_veil_cards(body, 'institution') b
                                                          where public._gallery_veil_inst_id(b.card) is not null)
  ), gone_people as (
    select c.card from public._gallery_veil_cards(proj, 'npc') c
     where public._gallery_veil_npc_id(c.card) is not null
       and public._gallery_veil_npc_id(c.card) not in (select public._gallery_veil_npc_id(b.card) from public._gallery_veil_cards(body, 'npc') b
                                                         where public._gallery_veil_npc_id(b.card) is not null)
  )
  select array(select x from (
           select public._gallery_veil_str(card -> k) as x from gone, unnest(array['name', 'label', 'catalogId']) k
           union select public._gallery_veil_str(card -> 'name') from gone_people
           union select public._gallery_veil_str(f -> k)
                   from jsonb_array_elements(case when not coalesce(share_dm, false) and jsonb_typeof(src #> '{powerStructure,factions}') = 'array'
                                                  then src #> '{powerStructure,factions}' else '[]' end) f, unnest(array['faction', 'name']) k
                  where jsonb_typeof(f) = 'object' and coalesce(f -> 'hidden' = 'true'::jsonb, false)) q where x <> ''),
         exists (select 1 from gone)
    into nm, shut;
  shut := shut or coalesce(v -> 'groupings' ?| array['block:services.criminal', 'block:defense.criminalStructure', 'block:power.criminalUnderside'], false);
  opens := array(select x from (
             select case when public._gallery_veil_str(e -> 'name') <> '' then public._gallery_veil_str(e -> 'name') else public._gallery_veil_str(e -> 'label') end as x
               from jsonb_array_elements(case when jsonb_typeof(body -> 'institutions') = 'array' then body -> 'institutions' else '[]' end) e where jsonb_typeof(e) = 'object'
             union select public._gallery_veil_str(e -> 'catalogId')
               from jsonb_array_elements(case when jsonb_typeof(body -> 'institutions') = 'array' then body -> 'institutions' else '[]' end) e where jsonb_typeof(e) = 'object'
             union select public._gallery_veil_str(f -> k)
               from jsonb_array_elements(case when jsonb_typeof(body #> '{powerStructure,factions}') = 'array' then body #> '{powerStructure,factions}' else '[]' end) f,
                    unnest(array['faction', 'name']) k
              where jsonb_typeof(f) = 'object' and not coalesce(f -> 'hidden' = 'true'::jsonb, false)) q where x <> '');
  -- (VEIL-DOORS-2) the log's own names the served body does not show
  nm := nm || array(
    select distinct c.x from (
      select case when ty.c in ('house', 'person', 'power')
                  then replace(regexp_replace(coalesce(nullif(public._gallery_veil_str(e #> '{event,targetId}'), ''), public._gallery_veil_str(e -> 'targetId')), '^.*[.]', ''), '_', ' ') end as x
        from jsonb_array_elements(log) e
        cross join lateral (select public._gallery_doors_chronicle_classes() ->> coalesce(nullif(case when jsonb_typeof(e -> 'event') = 'object' then public._gallery_veil_str(e #> '{event,type}') end, ''),
                                                                                       public._gallery_veil_str(e -> 'type')) as c) ty
       where jsonb_typeof(e) = 'object'
      union all
      select public._gallery_veil_str(e #> array[w, k])
        from jsonb_array_elements(log) e, unnest(array['event', 'payload']) w, unnest(array['institution', 'criminalInstitution']) k
       where jsonb_typeof(e) = 'object'
      union all
      select public._gallery_veil_str(e #> array['event', 'payload', k])
        from jsonb_array_elements(log) e, unnest(array['institution', 'criminalInstitution']) k
       where jsonb_typeof(e) = 'object'
    ) c
    where c.x is not null and public._gallery_doors_squeeze(c.x) <> ''
      and public._gallery_doors_squeeze(c.x) not in (
        select public._gallery_doors_squeeze(o) from unnest(opens) o
        union select public._gallery_doors_squeeze(public._gallery_veil_str(p -> k))
                from jsonb_array_elements(case when jsonb_typeof(body -> 'npcs') = 'array' then body -> 'npcs' else '[]' end) p, unnest(array['name', 'id']) k
               where jsonb_typeof(p) = 'object'));
  -- each entry's strings the rule asks (its summary, its targets, its payload), once, in one document
  doc := coalesce((select jsonb_agg(jsonb_build_array(e -> 'narrativeSummary', e -> 'targetId', e #> '{event,targetId}', e #> '{event,payload}', e -> 'payload') order by o)
                     from jsonb_array_elements(log) with ordinality x(e, o) where jsonb_typeof(e) = 'object'), '[]');
  if cardinality(nm) > 0 then
    srch := public._gallery_veil_name_search(nm, opens);
    if srch is not null then hits := public._gallery_veil_name_hits(doc, srch); end if;
  end if;
  return (
    select coalesce(jsonb_agg(w.m order by w.o), '[]')
      from (select k.o, k.m from (
              select x.o, jsonb_strip_nulls(jsonb_build_object(
                  'appliedAt', case when public._gallery_veil_truthy(x.e -> 'timestamp') then x.e -> 'timestamp' else x.e -> 'appliedAt' end,
                  'narrativeSummary', x.e -> 'narrativeSummary',
                  'partyCaused', case when public._gallery_veil_truthy(x.e -> 'partyCaused') or public._gallery_veil_truthy(x.e #> '{event,partyCaused}')
                                           or x.e -> 'cause' = '"party_action"'::jsonb or x.e #> '{event,cause}' = '"party_action"'::jsonb
                                      then true end,
                  'event', case when jsonb_typeof(x.e -> 'event') = 'object' and coalesce(jsonb_typeof(x.e #> '{event,type}'), 'null') <> 'null'
                                then jsonb_build_object('type', x.e #> '{event,type}') end)) as m
                from (select e, o, row_number() over (order by o) as n
                        from jsonb_array_elements(log) with ordinality y(e, o) where jsonb_typeof(e) = 'object') x
                cross join lateral (select coalesce(nullif(case when jsonb_typeof(x.e -> 'event') = 'object' then public._gallery_veil_str(x.e #> '{event,type}') end, ''),
                                                    nullif(public._gallery_veil_str(x.e -> 'type'), '')) as t offset 0) ty
               where public._gallery_doors_chronicle_classes() ? ty.t
                 and not (public._gallery_doors_chronicle_classes() ->> ty.t = 'covert' and shut)
                 and public._gallery_doors_chronicle_classes() ->> ty.t <> 'withheld'
                 and not (public._gallery_doors_chronicle_classes() ->> ty.t = 'stressor' and shut
                          and public._gallery_doors_squeeze(coalesce(nullif(public._gallery_veil_str(x.e #> '{event,payload,stressorType}'), ''),
                                                                     nullif(public._gallery_veil_str(x.e #> '{event,targetId}'), ''),
                                                                     public._gallery_veil_str(x.e -> 'targetId')))
                              in ('criminalcorridor', 'infiltration', 'infiltrated'))
                 and not (hits <> '{}' and public._gallery_veil_named(doc -> (x.n::int - 1), hits, srch -> 'blank', srch -> 'raw'))
            ) k order by k.o desc limit 50) w);
end $$;

-- [212: NEW, VEIL-DOORS] public._gallery_doors_closed
-- THE CLOSED ANSWER (VEIL-17, V8-9): the veil served the town's name alone. Beside it the dossier read sends no tile (VR22)
-- and no chronicle.
create or replace function public._gallery_doors_closed(v jsonb)
returns boolean language sql immutable as $$
  select coalesce(jsonb_typeof(v -> 'body') = 'object' and ((v -> 'body') - 'name') = '{}'::jsonb, false)
$$;

-- [212: RESTATED, VEIL-DOORS] public.get_gallery_map
-- 211's statement (088's body plus the veil), and ONE change, the member's two expressions (V10-4, VR23; V10-1): each
-- member is read through _gallery_veil with the link's `true`, so a member whose share carries no veil marker takes the
-- default veil, as the party link's unmarked share does (R4, "the readers are players": a map's member was never
-- published as a page of its own); a marked member is read through its own veil exactly as before. Its chronicle is
-- _gallery_doors_chronicle under that same veil. Nothing else of the map changes; its grant restated as 211 states it.
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
      -- VEIL-DOORS (VR23): the member through its own veil, and a member with none takes the default veil (the link's
      -- `true`: a map's member was never published as a page of its own); its chronicle by its own veil (VR20 (B))
      'settlement',  vm.v -> 'body',
      'chronicle',   public._gallery_doors_chronicle(s.campaign_state -> 'eventLog', pub.j, vm.v, src.j, false)
    )) into v_members
    from public.settlements s
    -- 211: the member's own listing source (the review's F7): its narration when narrated, its frozen
    -- copy in snapshot mode (a copy past the bound is refused: the member is left out, never served
    -- live), then the sanitizer and its own listing's veil
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
             coalesce(length(cp.copy::text) > public._gallery_veil_copy_bound(), false) as refused
        from (select case when mv.v ->> 'mode' = 'snapshot' and jsonb_typeof(mv.v -> 'snapshot') = 'object' then mv.v -> 'snapshot' end as copy
                from (select s.gallery_member_overrides -> '$veil' as v offset 0) mv) cp
    ) src
    cross join lateral (select public._gallery_sanitize_public_json(src.j) as j offset 0) pub
    cross join lateral (select public._gallery_veil(pub.j, s.gallery_member_overrides, true) as v offset 0) vm
    where not src.refused
      and s.id::text in (
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
    case when public._gallery_doors_closed(vl.v) then null else r.population end as population,
    case when public._gallery_doors_closed(vl.v) then null else r.terrain end as terrain,
    case when public._gallery_doors_closed(vl.v) then null else r.government_type end as government_type,
    case when public._gallery_doors_closed(vl.v) then null else r.magic_level end as magic_level,
    case when public._gallery_doors_closed(vl.v) then null else r.stability end as stability,
    case when public._gallery_doors_closed(vl.v) then null else r.primary_resource end as primary_resource,
    case when public._gallery_doors_closed(vl.v) then null else r.threat_level end as threat_level,
    r.net_votes,
    r.comment_count,
    public._gallery_doors_chronicle(s.campaign_state -> 'eventLog', proj.d, vl.v, src.j, s.gallery_share_dm) as chronicle,
    ap.external_name as author_name,
    r.aliveness
  from public.settlements s
  -- VEIL-DOORS (the chair's condition (a)): the ONE row's columns, never every public row's: the tile rule
  -- (_gallery_doors_tiles) for this row, and the row's own columns as the tile rows state them (galleryDoors.pglite pins
  -- every one equal to the list's row)
  cross join lateral (
    select s.id, s.public_slug, coalesce(nullif(btrim(s.gallery_title), ''), s.name) as name, s.tier, s.published_at,
           coalesce(s.gallery_updated_at, s.updated_at, s.published_at) as updated_at, s.view_count, s.is_curated,
           s.gallery_description, s.gallery_image_url, s.gallery_image_alt, s.gallery_tags,
           t.population, t.terrain, t.government_type, t.magic_level, t.stability, t.primary_resource, t.threat_level,
           (select count(*)::integer from public.gallery_votes gv where gv.settlement_id = s.id) as net_votes,
           (select count(*)::integer from public.gallery_comments gc where gc.settlement_id = s.id and gc.deleted_at is null) as comment_count,
           s.gallery_facet_aliveness as aliveness
      from public._gallery_doors_tiles(s.data, s.gallery_member_overrides, s.gallery_share_narrated, s.ai_data,
                                       s.gallery_facet_culture, s.gallery_facet_prosperity, s.gallery_facet_deity) t
  ) r
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

-- [212: RESTATED (211's statement, with the cure)] public.get_unlisted_dossier
-- get_unlisted_dossier: 208's body (as amended) plus the veil (211's statement), and ONE change (VEIL-13, ruling (5);
-- the seat's call V13-1): the apply's `dm_full` is the projection with the live town's own relationships[],
-- prominentRelationship and pressureSentence in place of its own (each where the live town has it), nothing else of the
-- live town, so _gallery_apply_member_overrides judges a covert tie the sanitiser dropped by identity, in the live town's
-- one spelling, here as on the gallery read and the import. The splice still takes every person from the projection
-- alone (it reads dm_full only for npcs[], and those are the projection's): the link widens nothing. A live town that is
-- not an object hands the projection itself, as 211 did.
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
    'gallery_member_overrides', vl.v -> 'served',
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
  -- 212 (ruling (5)): the covert check alone reads the live town's relationships[], prominentRelationship, pressureSentence
  cross join lateral (
    select public._gallery_apply_member_overrides(
      pub.j,
      case when jsonb_typeof(base.j) = 'object'
           then pub.j || (select coalesce(jsonb_object_agg(k, base.j -> k), '{}'::jsonb)
                            from unnest(array['relationships', 'prominentRelationship', 'pressureSentence']) k where base.j ? k)
           else pub.j end,
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

-- VEIL-DOORS: its helpers are called only inside the reads, likewise (by name, never from PUBLIC alone: VR27)
do $do$
declare f record;
begin
  for f in select p.oid::regprocedure as sig from pg_proc p join pg_namespace n on n.oid = p.pronamespace
            where n.nspname = 'public' and p.proname like '\_gallery\_doors\_%' loop
    execute format('revoke execute on function %s from public, anon, authenticated', f.sig);
  end loop;
end $do$;

-- ── 7. THE HELPERS ARE CALLED ONLY INSIDE THE READS ─────────────────────────────────────────
do $do$
declare f record;
begin
  for f in select p.oid::regprocedure as sig from pg_proc p join pg_namespace n on n.oid = p.pronamespace
            where n.nspname = 'public' and p.proname like '\_gallery\_veil%' loop
    execute format('revoke execute on function %s from public, anon, authenticated', f.sig);
  end loop;
end $do$;
