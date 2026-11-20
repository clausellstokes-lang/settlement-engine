# TRAD-4 · UNIT 10 — NO TOWN PRINTS THE SAME SENTENCE IN TWO OF ITS RITES (MEASURE FIRST, THEN THE ROTATION)

Written 2026-11-20 17:1x UTC by TRAD-4 on the chair's order of 17:04 UTC (vetoable by the owner). Read
`TRAD-2-COMMON.md` first; it binds you (read "TRAD-2" there as "TRAD-4"). Base: `lane/trad-4-2026-11-20` at the commit
your worktree starts on (units 1–7 and 9 merged).

## The fault (the chair, reading the owner's thirty)
Inside ONE town two rites print the same sentence: Ringthwaite's two rites both end "Market taxes bring Ringthwaite more
than anything else." and both open their second sentence at "the market squares"; Bergbrekka's two rites both say "It is
kept by the blacksmiths, and Bodvar Finsson, the master smith, presides."

## STEP 1 — MEASURE FIRST, AND REPORT BEFORE YOU CURE
Over the 432 pool (`docs/chair/2026-11-20/content/traditions/tools/trad-pool.mjs`; edit `tools/measure2.mjs` to add the
count, no new helper file), owner AND reader: how many towns print an IDENTICAL sentence (the town's name left in) in two
or more of their own rites, BY SLOT (lead+gloss, keeper house, keeper place, keeper power, owner, cause, payer), and the
sentence pairs' counts. Write it to the scratchpad. If the measure shows a slot the rule below cannot reach, or the counts
are 0 where the chair saw a pair, STOP and report (send the figures; do not build).

## STEP 2 — THE CURE THE CHAIR EXPECTS (build it unless step 1 refutes it)
Inside one town a slot's wording is taken BY ROTATION: the rites of the town that fill a slot the same way (the same pool,
the same filled names) are ordered by a stable key (the rite's position in the set the surface shows); the first takes its
pick as today; each later one takes the first wording, going on from its own pick, that no earlier rite of the town has
taken in that slot. Keyed, no new draw, no clock, nothing stored. A town with one rite (or one rite in that slot) reads
EXACTLY as today. Where a slot has fewer wordings than the town has rites for it, the later rite LEAVES THE PAYER SENTENCE
OUT (a rite need not say twice what the town lives on); for any other slot that runs out, report it (do not invent).
- THE READER (CTR11): the reader's rotation is computed over the rites the READER is shown (the drawn set) and the
  reader's own composition, never over a row a DM can hide; the owner's over the owner's set. Every surface that composes a
  description (the tab, the drawn rows at save `shownTraditions.js :: sharedTraditionRowsOf`, the printed export, the
  search index) must pass the same set, so the same town reads the same on each: list every caller (`git grep -n
  describeTradition -- src`) in your report.
- The bar: 0 towns of 432 with a sentence twice, owner and reader. Red first by an arm that births towns and finds the
  pairs (Ringthwaite and Bergbrekka among them if their seeds are in the pool: they are the owner's samples 17/19, 23/25).

## Files you may change
`src/domain/traditions/traditionDescription.js`, `src/domain/traditions/shownTraditions.js`, `src/pdf/sections/Traditions.jsx`,
the reader's and owner's branch of the Traditions tab (find it: `git grep -ln describeTradition -- src/components`), the
search index's caller of `describeTradition` if any, `tests/domain/traditionDescription.test.js`,
`tests/security/traditionDescriptionSharedPage.test.js` (the drawn rows' arms), `tests/lint/traditionDescriptionFrames.walker.test.js`,
and `docs/chair/2026-11-20/content/traditions/tools/measure2.mjs`. If a caller lies outside these, STOP and report it.

## Measures for your report
Step 1's counts, then the same after your cure (0 expected); descriptions moved (owner, reader) on the 432; the
confinement is TRAD-4's at the merge.

## Gates at your commit
Your arms; every test file naming a module you changed (`git grep -l`); `tests/lint` WHOLE (the lighting census may stay
red by count for TRAD-4); `npm run typecheck:ratchet`, `npm run typecheck:domain:strict`, `npm run lint`.
