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
