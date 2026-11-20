# U5a-CURE: U5a's packed lines unpacked and its two observedShapeReaders reds answered (no behaviour change). Written 2026-11-20T21:16:59Z by FORTUNE-4.

U5a (the merits of rule) is MERGED on `lane/fortune-4-2026-11-20` (merge 4044990a4; registers re-taken after it). Two
things it owes before the lane may land. NO BEHAVIOUR MOVES: every born byte under law 1 AND law 2 is identical before
and after this unit (FORTUNE-4 re-runs the confinement and a law-2 identity).

READ FIRST: `COMMON.md`; the merged files whole: `src/generators/steps/assembleSettlement.js` (its header: its writes are
cited BY LINE, so new code goes at the END and no earlier line may move), `src/generators/legacyGenerator.js`,
`src/generators/power/rosterText.js`, `src/domain/fortune/fortuneMerits.js`, `tests/generators/fortuneLawMerits.test.js`,
`tests/domain/fortuneMeritsPredicates.test.js`.

BRANCH: `lane/fortune-4-u5acure-2026-11-20` from the commit FORTUNE-4 names, in your own worktree; push as
`lane/fortune-4-2026-11-20-u5acure-wip` (`git ls-remote` first). ONE commit per item below is welcome; never amend.

1. THE CHAIR'S RULE (2026-11-20 20:17 UTC): "no statement packed onto a shared line to save a line". In U5a's added lines:
   (a) `assembleSettlement.js`: the step's `return` packs an inline arrow and a pin gate into one line. Keep ONE line there
   (no earlier or later cited line may move): `return { settlement: settleMeritsTail(pins, <the same inner expression>) };`
   with a named helper `settleMeritsTail(pins, settlement)` written at the END of the file, one statement per line, doing
   exactly what the arrow does (the `chooseOrPin(pins, 'powerStructure', () => UNPINNED) === UNPINNED` gate, then
   `settleMeritsOfRule(settlement, { bandFor: legitimacyBandFor, recapture: withCaptureRelations, restand:
   settleStandingToLegitimacy })`), with its comment. The END import line of U5a (three imports on one line): one import a
   line, still at the END. Check `tests/lint/heldKeyWriterCensus.walker.test.js`'s discovery over the assembly body still
   reads the writer (it may now find it in the helper: say what you did).
   (b) `legacyGenerator.js`: the END line `import ...; export ...; // ...` becomes two lines (import, then export), still at
   the END.
   (c) `rosterText.js :: settleStandingToLegitimacy`: the doc comment's over-long line reflowed to its neighbours' width;
   the nested ternary that computes `base` written as plain `if` branches (one statement a line).
   (d) the two new test files: every line carrying two statements (e.g. `tupleOf`'s body, `walk`'s `if ... else`, any
   `{ a; return b; }` on one line) unpacked. Titles and assertions unchanged.
   GUARD: count, before and after, the lines in these files that carry two statements (a small script of yours, its rule
   stated in the report); the after-count is 0 for U5a's added lines.
2. THE TWO `observedShapeReaders` REDS (U5a's builder: they need an explained-writer row in
   `scripts/check-observed-shape-readers.mjs`): GRANTED to this unit: that script and its baseline only if the failing
   test names them. Run the failing test, read what it asks, add the row it asks for with its explanation (the writer:
   `settleMeritsOfRule`, what it writes, why it is a writer of the shape), never widen a pattern. Name the test titles red
   before and green after.

PROOF IN YOUR REPORT: red/green of item 2 by title; `tests/generators/fortuneLawMerits.test.js`,
`tests/domain/fortuneMeritsPredicates.test.js`, `tests/generators/fortuneLawSafety.test.js`,
`tests/lint/heldKeyWriterCensus.walker.test.js` green; `tests/lint` WHOLE by its count line (the census arms excepted:
FORTUNE-4's door); `typecheck:ratchet`, `typecheck:domain:strict`, `lint`. Every run through
`sh scripts/gate-mutex.sh --run -- sh scripts/gate-tail.sh ...`, default TMPDIR, to a file, never a pipe. No census rows.
Report <=300 words.
