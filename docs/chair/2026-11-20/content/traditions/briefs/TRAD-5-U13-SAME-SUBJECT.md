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
