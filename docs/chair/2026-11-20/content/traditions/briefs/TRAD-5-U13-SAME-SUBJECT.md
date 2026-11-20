# TRAD-5 · UNIT 13 — TWO TRADITIONS OF ONE PLACE THAT HONOUR THE SAME THING (A MEASURE FIRST)

Written 2026-11-20 20:45 UTC by TRAD-5 on the chair's word of 20:44 UTC (vetoable by the owner). MEASURE ONLY: no file under `src/` or
`tests/`, no register. Base: `lane/trad-5-2026-11-20` at `cf5b24079`.

THE FINDING (the chair, on a joined tree): one metropolis showed "The Landfall Procession: A procession on foot that
honours the first boats to come ashore…" and "The Long Landfall Contest: A friendly contest that honours the first boats to
come ashore." No sentence repeats (unit 10's bar holds), but the reader sees one honoured thing twice.

## MEASURE (write `docs/chair/2026-11-20/content/traditions/out-trad5/SAME-SUBJECT.txt`)
1. HOW A SUBJECT IS DRAWN: read `src/domain/traditions/genesis.js :: deriveFoundingTraditions` (READ ONLY: not this lane's
   file) and `src/data/traditionCorpus.js` (read only): how each rite's `coreMotif` element is chosen, and whether the
   same element can be drawn twice in one place BY DESIGN (a deliberate allowance, a weighting, a comment that says so) or
   only by chance. Quote the deciding lines by symbol (`path :: symbol`), never by line number. Also: what in the leaf
   (`src/domain/traditions/traditionDescription.js`, `src/data/traditionDescriptionTable.js :: ELEMENT_GLOSS`) prints the
   subject (the gloss).
2. COUNT on the 432 calm pool (already born: `/tmp/claude-0/-home-user-settlement-engine/03d0c1a0-944d-526a-81b5-d8a1952a5351/scratchpad/u12-data/calm/pool.ndjson`;
   re-make with `tools/trad-pool.mjs` only if absent), over the set each audience is SHOWN (`shownTraditions.js ::
   descriptionSetOf`, owner and reader, as `tools/measure2.mjs :: shownFor` reads it): the places where two or more shown
   rites share an ELEMENT, by size (thorp … metropolis: places with a repeat / places of that size), and of those how many
   also print the SAME gloss sentence-part ("honours the first boats to come ashore") in both. Also the same counts where two
   rites share element AND act. One more pool if cheap: a visitor's births (the reader's set is the visitor's; say so).
3. If MORE THAN ABOUT 3 PLACES IN 100 of any size repeat a subject: PROPOSE (do not build) the smallest cure that keeps
   CTR3 (genesis unchanged: the traditions themselves never change), e.g. the second rite of a held element takes a second
   gloss wording inside the place (as unit 10's rotation does for sentences), with what it would move (descriptions moved,
   owner and reader). If rare, say so in one line.

Edit `tools/measure2.mjs` to add the count if that is the shortest way (no new tool file unless it is shorter). Commit
by explicit paths, one commit, receipts in the message, the session trailers. Never push.

## ADDENDUM 1 — THE CHAIR'S RULING (20:56 UTC): CURE (B). STEP ONE ONLY: THE SIXTEEN "ALSO" GLOSSES, IN A FILE FOR THE CHAIR'S EYE
Written 2026-11-20 20:56 UTC by TRAD-5. RULED: a held element's LATER rite (a rite whose element an earlier rite of the place's shown set
already holds) takes an "also" gloss, the keeper frames' pattern (`src/data/traditionDescriptionTable.js ::
KEEPER_FRAMES_TOO`: never a pick, only for the later rite). (A) not taken; (C) is the owner's and not proposed.
THIS STEP WRITES NO CODE: one file, `docs/chair/2026-11-20/content/traditions/TRAD-5-U13-ALSO-GLOSSES.md`, for the chair to read
before any builder. In it, for EACH of the sixteen elements of `ELEMENT_GLOSS` (founding, first-landing, charter, hearth,
harvest, river, stone, the-dead, field, forge, market, hunt, long-sun, tide, greening, stars):
- the element's present gloss lines, verbatim, with their declarations (`needs`/`excludes`/`crisis`/`colour`), quoted from
  the table;
- ONE proposed "also" line beside them: the same honoured thing said with "also" (e.g. "that also honours the first boats to
  come ashore"), shaped to follow the act leads exactly as the present glosses do (read `ACT_LEADS` and how `compose`
  joins lead and gloss), and its proposed declaration: it presumes NOTHING its element's lines do not already presume (take the
  NARROWEST declaration among the element's present lines' common ground; where they differ, say so and propose; a crisis-scoped
  element (`CRISIS_SCOPED_ELEMENTS`: harvest) keeps its crisis twin rule: propose the "also" line's twin if one is needed).
LAWS on every line: NO NEW FEELING, no drama (the owner: "Don't invent drama… We are not creating the campaign."; the frames
walker's DRAMA_WORDS), no cause word (`tests/lint/traditionDescriptionFrames.walker.test.js :: CAUSE_WORDS`, now holding "goes
back"), no "kept" or "keeps" (unit 9: no first sentence says "kept" twice), never "the town"/"a town", no name of a house or
person, nothing the record does not hold. Check each against those lists by grep and say so in the file. Close the file with
the counts the cure will move (unit 13's 137 of 1,232 calm, 82 of 1,256 visitor; owner and reader alike) and ONE paragraph of
what a builder then does (the files: the table, the leaf's `compose`, the walker and domain tests, the census rows by their
doors). Commit the file and this addendum by explicit paths, one commit. Never push.

## ADDENDUM 2 — BUILD (the chair, 21:03 UTC: all sixteen lines APPROVED AS WRITTEN in `TRAD-5-U13-ALSO-GLOSSES.md`)
Written 2026-11-20 21:04 UTC by TRAD-5. Read `TRAD-2-COMMON.md` first; it binds you (read "TRAD-2" as "TRAD-5").
THE CURE: a rite whose ELEMENT an earlier rite of the AUDIENCE'S OWN SHOWN SET already holds takes its element's "also" gloss
(the sixteen lines verbatim, one an element, each with the declaration the file gives; harvest's ONE line, `crisis: ['any']`,
no twin). The first rite of an element, and a rite alone, read EXACTLY as today. A third rite of an element reads the same
"also" line (S1 as a whole never repeats: the act differs). The "also" lines are NEVER a pick: a separate table
(`ELEMENT_GLOSS_ALSO`, the `KEEPER_FRAMES_TOO` pattern), declared lines drawn through the one draw, so the walkers hold them.
THE SECURITY CONDITION (the chair): the held elements a later rite reads are those of THE AUDIENCE'S OWN SHOWN SET
(`shownTraditions.js :: descriptionSetOf` / `shownTraditionsOf` as each surface already passes it; unit 10's set), NEVER the
owner's set carried to a reader. A reader whose shown set lacks the earlier rite reads the PLAIN gloss.
`compose`'s `taken` holds sentences: carry the held elements beside it, in the same set-walk unit 10 built.
RED FIRST: (1) a domain arm, a place whose two shown rites share an element: at base the later prints its plain gloss (the
same honoured thing twice); after, "also". (2) THE PIN (the chair's): a set whose FIRST rite of an element is withheld from
the reader: the reader's later rite prints the PRESENT gloss, the owner's prints "also". (3) the frames walker: the sixteen
lines present, one an element, declared, none in the pick's domain, none holds a DRAMA, CAUSE, "kept"/"keeps" or "the town"
word; the walker's COUNT pin moves by sixteen (named, before -> after).
FILES: `src/data/traditionDescriptionTable.js`, `src/domain/traditions/traditionDescription.js`,
`tests/domain/traditionDescription.test.js`, `tests/security/traditionDescriptionSharedPage.test.js` (the pin may live here
if it reads the drawn rows), `tests/lint/traditionDescriptionFrames.walker.test.js`, `docs/DESIGN_POOL_CENSUS.md` and the
census/line-register rows the house keeps for the table's pools (find them as unit 5 did: `git log -p 22be32bea --stat`);
`docs/chair/2026-11-20/content/traditions/tools/measure2.mjs` for the after-count. Anything else: STOP and report.
MEASURE on the 432 (the pool under scratchpad/u12-data): unit 13's same-subject count before -> after (places printing the
same gloss twice: 0 expected; places with a repeated subject UNACKNOWLEDGED: 0 expected), descriptions moved (137 calm
expected, owner and reader; say where they differ), 0 of 432 still print a sentence twice.
GATES at your commit: your arms; every test file naming `traditionDescriptionTable` or `traditionDescription`;
`npx eslint` on the touched files; `npm run typecheck:ratchet`; `npm run typecheck:domain:strict`. Through
`sh /home/user/settlement-engine/scripts/gate-mutex.sh --run --` (one heavy gate at a time), each to a file, read by its
count lines. NOT `tests/lint` whole (the integrator's). One commit per cause (the table+leaf+arms; the census rows), by
explicit paths, receipts in each message. Never push.
FOR THE VEIL'S READER (one line, in the commit body): what an "also" can and cannot tell a reader (it tells that an earlier
SHOWN rite honours the same thing; it can tell nothing of a rite the reader is not shown).
