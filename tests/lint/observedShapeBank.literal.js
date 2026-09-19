/**
 * observedShapeBank.literal.js — THE HAND-OWNED BANK LITERAL of the reader-with-no-writer
 * register, and the one file a bank move MUST touch.
 *
 * WHAT THIS IS. The observed-shape register (scripts/.observed-shape-readers-baseline.json)
 * banks explained-writer reads under sparse `rowTags`. This file states, BY HAND, what that
 * bank is: banked reads across tagged addresses, and the same pair per DECLARED identity.
 * It is compared against the register from two sides —
 *   * the walker (tests/lint/observedShapeReaders.walker.test.js) asserts on every gate
 *     that the frozen register derives exactly this;
 *   * the instrument's `--write` (scripts/check-observed-shape-readers.mjs,
 *     `assertBankTwins`) REFUSES to freeze a register whose bank differs from this, before
 *     a byte moves — and, at a governed rung, refuses unless the rung's own declared
 *     post-bank agrees too.
 *
 * ⛔ WHY IT IS A LITERAL AND MUST STAY ONE. A derived `--write` re-freeze may only LOWER or
 * DELETE rows, so the bank can never GROW except by the governed reasoned path. A
 * hand-written figure is therefore the right instrument: a disagreement with the register
 * is a governed event announcing itself. Deriving this from the register would turn both
 * comparisons into self-comparisons and silence the next bank move — the exact silence in
 * which the schema-19 re-freeze `fe021a487` stranded the walker's previous inline literal
 * at 62/41 while the register went to 60/39, red at the tip for three commits
 * (`1637f85d1`). The walker pins this file to be a BARE literal: no import, no call other
 * than `Object.freeze`, integers at every leaf, and a total that is the sum of its map.
 *
 * HOW TO MOVE IT. When a bank move is lawful — a banked read deleted from the estate (a
 * shrink), a `--raise-explained-writer` write, or a rung that admits or retires a
 * declaration — edit the figures here to what the re-frozen register WILL derive, in the
 * SAME commit as the register. The write names the exact figures when it refuses. This
 * file is not a governed detector input, so editing it does not dirty the chain.
 * ⚠ THE WRITE CHECKS THIS FILE ON DISK, NOT IN THE INDEX: stage it WITH the register. A
 * register committed alone is the fe021a487 shape again, and the walker reds at the next
 * gate — the fence narrows the miss from "forgot the figure" to "forgot to stage the file".
 *
 * THE HISTORY OF EVERY MOVE stays in the walker beside its assertion; only the live
 * figures live here.
 */
export const OBSERVED_SHAPE_BANK_LITERAL = Object.freeze({
  reads: 61,
  addresses: 40,
  // Keyed BY THE ROSTER (EXPLAINED_WRITER_EXEMPTIONS). A declaration that banks nothing is
  // written 0/0 rather than omitted — "declared and unexercised" and "retired" are
  // different facts, and the walker refuses a map whose keys are not the roster.
  byIdentity: Object.freeze({
    // Declared ninth, first in the roster since `factions on locks` was retired on
    // 2026-09-17; banks nothing since schema 17's stress-loaded corpus pass made its
    // writer observable.
    'isCriminal on incomeSources': Object.freeze({ reads: 0, addresses: 0 }),
    // 38/25 -> 39/26 at rung 21: DS-REL-1's list assembler is a 26th address.
    'neighbourNetwork on settlement': Object.freeze({ reads: 39, addresses: 26 }),
    'stresses on settlement': Object.freeze({ reads: 4, addresses: 3 }),
    'worldPulse on campaignState': Object.freeze({ reads: 2, addresses: 2 }),
    'appliedAt on eventLog': Object.freeze({ reads: 1, addresses: 1 }),
    'deltas on eventLog': Object.freeze({ reads: 2, addresses: 1 }),
    'event on eventLog': Object.freeze({ reads: 9, addresses: 4 }),
    'narrativeSummary on eventLog': Object.freeze({ reads: 4, addresses: 3 }),
  }),
});
