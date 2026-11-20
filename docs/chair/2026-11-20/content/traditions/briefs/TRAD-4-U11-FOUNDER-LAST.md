# TRAD-4 · UNIT 11 — THE FOUNDING RITE'S AGE NO LONGER HANGS ON THE FOUNDER'S LAST VERB

Written 2026-11-20 18:1x UTC by TRAD-4 on the chair's order of 18:16 UTC (vetoable by the owner). Read `TRAD-2-COMMON.md`
first; it binds you (read "TRAD-2" there as "TRAD-4"). Base: `lane/trad-4-2026-11-20` at the commit your worktree starts
on (unit 10 merged).

## The fault (found by the people lane rendering this tree: 547 owner rites quote `foundedBy`)
"…founded by a single extended family who came and never left, 120 years ago" reads as "never left 120 years ago": the
age hangs on the founder phrase's last verb. Today's founder rows do it, and the people lane's 108 new founder wordings
cannot cure it: the cure is the frame's.

## The cure (the chair's lines, verbatim; keyed as they are, by the rite's id, so no other sentence moves)
`src/data/traditionDescriptionTable.js :: CAUSE_FRAMES.founding` becomes, in this order, the founder phrase ENDING the
sentence and the age before it:
1. "It has been kept since {town} was founded, {age} years ago, by {foundedBy}."
2. "{Town} has kept it since its founding {age} years ago by {foundedBy}."
3. "It goes back {age} years, to the founding of {town} by {foundedBy}."
Declared as the lines they replace (`plain`); any rotation pool (unit 10's) for this slot keeps its shape. `foundingBare`
(the reader's form, which never reads `foundedBy`) is UNTOUCHED: prove it (the reader's descriptions byte-identical on the
432). A founder phrase may hold one comma or none (the people lane's pool keeps commas out).

## Files you may change
`src/data/traditionDescriptionTable.js` (those three lines only), `tests/lint/traditionDescriptionFrames.walker.test.js`,
`tests/domain/traditionDescription.test.js`. Anything else: STOP and report.

## Red first
A born or constructed rite whose founder phrase ends on a verb ("a single extended family who came and never left"): at
base its owner sentence holds "<verb>, <age> years ago"; after the cure the founder phrase ends the sentence and no
"years ago" follows `{foundedBy}` in any founding frame (a walker arm over the frames: `{foundedBy}` is the last slot of
every founding line). Measure on the 432: owner descriptions moved (the founding causes only, 387 expected at most),
reader moved 0.

## Gates at your commit
Your arms; every test file naming `traditionDescriptionTable` or `traditionDescription`; `tests/lint` WHOLE (the
lighting census may stay red by count for TRAD-4); `npm run typecheck:ratchet`, `npm run typecheck:domain:strict`,
`npm run lint`.

## ADDENDUM — A SECOND, SEPARATE COMMIT: THE KERNEL'S MIXED PICK (the chair, 17:18 and 17:32 UTC)
`src/kernel/proseHash.js :: pickVariantMixed` is on this lane (cherry-picked `bd42d63c7` as `e32c9b27e`): the same FNV hash,
then a 32-bit finalizer before the modulo; the same contract. In `src/domain/traditions/traditionDescription.js` replace
`pickVariant` by `pickVariantMixed` at the leaf's pick (the one `draw` and the rotation's start in `drawTurn`: the SAME key,
so the rotation's start stays the pick). Its own commit, AFTER unit 11's frames commit (one cause per commit). Files: that
leaf only, plus any test whose pinned text moves because of it (name each, before → after). Measure on the 432: the feast
pool's "A common feast" before refusals (171 of 309 at unit 6; the chair expects toward a quarter), descriptions moved
(owner, reader), and the 0-of-432 repeated-sentence bar still held.
