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
  reads: 76,
  addresses: 50,
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
    // 4/3 -> 3/2 at the schema-30 rung (the census readers; LANDING-R2's 29, re-numbered at MERGE-R2;
    // ODQ §934.105): the read at src/domain/canonicalAccessors.js (`canonStressors`) stands, and the
    // detector no longer grounds it — the cause is named in the rung's review beside CENSUS_READERS_TARGET_SCHEMA.
    'stresses on settlement': Object.freeze({ reads: 3, addresses: 2 }),
    'worldPulse on campaignState': Object.freeze({ reads: 2, addresses: 2 }),
    'appliedAt on eventLog': Object.freeze({ reads: 1, addresses: 1 }),
    'deltas on eventLog': Object.freeze({ reads: 2, addresses: 1 }),
    'event on eventLog': Object.freeze({ reads: 9, addresses: 4 }),
    'narrativeSummary on eventLog': Object.freeze({ reads: 4, addresses: 3 }),
    // Declared at the schema-23 rung. 0/0 -> 6/3: four reads at the pulse's decree hook, one
    // at the pulse kernel, and the ONE ordinary row the estate already carried at
    // personaSlicer.js, which the declaration tags because the roster is keyed by identity.
    'decrees on settlement': Object.freeze({ reads: 6, addresses: 3 }),
    // Declared at the same rung. 0/0 -> 2/2: the phantom mint's own shelf predicate and the
    // quota count that excludes a hidden phantom.
    'kind on settlement': Object.freeze({ reads: 2, addresses: 2 }),
    // ⭐ THE SCHEMA-27 RUNG'S THREE (the crisis cast's temporary person; LANDING-2b, 2026-11-04).
    'temporary on npcs': Object.freeze({ reads: 3, addresses: 3 }),
    'temporaryKind on npcs': Object.freeze({ reads: 2, addresses: 1 }),
    'crisisIds on npcs': Object.freeze({ reads: 2, addresses: 1 }),
    // ⭐ THE SCHEMA-29 RUNG'S ONE (the migration direction's config projection; WIRING-W0, the
    // chair's ruling of 2026-11-07 03:55 UTC): the one accessor in src/domain/migrationDirection.js.
    'migrationDirection on config': Object.freeze({ reads: 1, addresses: 1 }),
  }),
});
