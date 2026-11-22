# TRAD-4 · UNIT 9 — NO FIRST SENTENCE SAYS "KEPT" TWICE

Written 2026-11-20 16:4x UTC by TRAD-4 (a lane judgment under CTR10's "prose conditions"; vetoable by the owner). Read
`TRAD-2-COMMON.md` first; it binds you (read "TRAD-2" there as "TRAD-4"). Base: `lane/trad-4-2026-11-20` at the commit
your worktree starts on (units 1–7 merged). Unit 8 is built beside you (tests/security only): path-disjoint.

## The defect (found by unit 6's measure, executed)
Where a crisis twin meets a gloss that says "is kept", the first sentence says "kept" twice: "A feast day kept by custom
that is kept for what the fields give." 11 of 1,232 rites on the 432 calm pool (146 of those towns hold a pressure of
their own), 23 under famine. The leads' twins say "kept by custom" / "kept as of old"; the glosses "is kept for the
harvest", "is kept for what the fields give", "is kept under the stars".

## Files you may change
`src/data/traditionDescriptionTable.js` (lines of `ELEMENT_GLOSS` and `ACT_LEADS` only), `tests/lint/traditionDescriptionFrames.walker.test.js`
(its COUNT pin only if a line is added or removed, and the new arm). Anything else: STOP and report.

## The cure, smallest first
1. AN ARM, RED FIRST: over every lead × every gloss the table can join (every act's pool, twins included, against every
   element's pool, twins included), no first sentence holds "kept" (any form: kept, keep, keeps) more than once. Name each
   clashing pair. Planted control: a pair that clashes is named.
2. THE CURE: re-word the FEWEST lines that end every clash, preferring the glosses (a gloss reads "is held for the
   harvest", "is held under the stars" and the like), each re-worded line keeping its declaration, its twin relation and
   its meaning exactly, plain and calm (the level law), no cause word (the cause law). Do not add lines, do not remove one;
   the pools keep their sizes and floors.
3. Measure on the 432 pool (`tools/trad-pool.mjs`, then `tools/measure2.mjs … owner` at base and at your commit): the
   descriptions that move (owner and reader), and the clash count before → after (0 expected).

## Gates at your commit
The walker and `tests/domain/traditionDescription.test.js`; every test file naming `traditionDescriptionTable`; `tests/lint`
WHOLE (the lighting census may stay red by count for TRAD-4); `npm run typecheck:ratchet`, `npm run
typecheck:domain:strict`, `npm run lint`.
