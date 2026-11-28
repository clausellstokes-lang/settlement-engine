# BAR2-PEOPLE-4 · hand-back (groups POWERS and TIES; REVIEW-BAR-2; the third successor of BAR2-PEOPLE)

Seat: BAR2-PEOPLE-4, a builder seat, the third successor on `lane/bar2-people-2026-11-15`. Start tip: **c2b0f2ecd**
(as the prompt named it; the repository's main checkout stood at 923f2b159, behind origin: the scratch worktree was cut
from origin's c2b0f2ecd). The three predecessors' hand-backs beside this file are the state (batches A, B, C, E
committed; D parked; the merge of the joined line at d3831adfc). Nothing committed was redone. The rulings worked to are
the predecessors' (PP1 to PP11, PP3a, PP3b); I made none.

## (1) THE `writerReach` RED: TRACED; THE PREMISE WAS BACKWARDS; A REGISTER'S ROW, NOT A LAW

`tests/lint/writerReach.walker.test.js`, arm "the surfaceReach grammar round-trips", is
`expect(frozen[identity]).toBe(formatReach(live.reach))`: in vitest's report "Received" is the FROZEN row and "Expected"
the LIVE one. The predecessor (and the assignment) read the two sides the wrong way round. Measured directly
(`measure({ root })` of `scripts/check-writer-reach.mjs`, the walker's own measurement, run at dcb069bff and at
c2b0f2ecd; script `tools/wr.mjs`, below):

| tree | verdict of `narrative on factionRelationships` | reach | R readers | N readers |
|---|---|---|---|---|
| dcb069bff (the line; = the frozen row) | LIT-NAME | N on all six (web-display, web-transitive, dossier-pdf, campaign-pdf, world-book, foundry) | none | 4: StaleNarrativeModal.jsx, power/PowerStrata.jsx, dossier/powerStrata.js, worldPulse/stressorsCore.js |
| c2b0f2ecd (the tip; live) | **LIT** | **R** on five, web-display N | `src/domain/dossier/powerStrata.js` (batch A's `relationNamesDecider`: `row.narrative`, its receiver grounded by the resolver to the `factionRelationships` shape) | the same 4 |

How the walker decides (`scripts/lib/writer-reach-scan.mjs :: scanSurfaceReads` and `judgeWriters`): a property read
of a written key credits N to every shape that carries the key; when the resolver grounds the receiver to a known shape
that carries the key it credits R; a surface class takes R if any R reader is in its closure, else N if any N reader is.
Reads only add credit. Nothing is shadowed. Batch A's reader is the first that grounds `narrative` to
`factionRelationships`, so the field went from read-by-name-only to read (LIT count 691 → 692, 12,661 identities
either way). web-display stays N because powerStrata.js sits in the dossier/PDF/world-book/foundry closures, not under
a display dir.

CLASS (F2): no law is red. The walker's law, "a written fact reaches a surface", is served better, not worse. The
frozen `surfaceReach` row is **a register's row moved by a declared cure (batch A, PP2)**, which is a STORED FIGURE. It
is NAMED below and NOT re-taken; the register is untouched and the arm is not weakened. The assignment's cures (a) to
(c) all rested on the premise that a printing reader was shadowed, and none applies: (a) and (b) would hide a true
grounded read from the walker, which would falsify the instrument; (c) would take out a declared, ruled cure to restore
a figure. So no code moved for (1). The chair was told before the sweep, in one line.

## (2) THE 189-FILE SWEEP, ONCE, WHOLE, AT THE TIP

The list was re-made by the command the predecessor named. The sixteen `src` files of `git diff --name-only dcb069bff HEAD
-- src`, `grep -rlF <basename with extension>` over `tests/`, gave 200 files, **189 of them test files** (the
predecessor's figure; without the extension, by word, the grep gives 548, which is not the list). The sweep ran in three
chunks, at c2b0f2ecd (the tip; no src change after it), each through `sh scripts/gate-tail.sh npx vitest run …` with a
JSON report beside the log. All three chunks FINISHED (68 files 16:54–16:58, 59 files 16:58–17:02, 62 files
17:02–17:12 UTC). **1,969 passed, 12 failed, in 11 of the 189 files.** None of the six owner's-door tests is among the
189, and they were not touched.

| test · arm | class | what was done |
|---|---|---|
| `tests/property/generatorGoldenMaster.test.js` · every config byte-identical | STORED FIGURE (the golden corpus): **256 rows** listed moved, the predecessor's count | NAMED |
| `tests/generators/pipelinePinnedChoosers.test.js` · A1 | STORED FIGURE (the golden corpus, a stride: 21 rows) | NAMED |
| `tests/generators/powerEconomyFreshness.test.js` · A4 | STORED FIGURE (the golden corpus, a stride: 21 rows) | NAMED |
| `tests/generators/nameHeldThroughAssembly.test.js` · A1 (EM-R4, inert with no pins) | STORED FIGURE (the golden manifest, a stride: 21 rows). **NEW to the list**: the predecessor's partial run had not reached it | NAMED |
| `tests/domain/worldFactRederive.test.js` · A7 (the goldens byte-identical; a no-layer re-derivation is the committed golden) | STORED FIGURE (the golden manifest, a stride of 75: 2 misses) | NAMED |
| `tests/generators/generationForkCensus.test.js` · A1 (the control row's hash) | STORED FIGURE: 7ae632298ed9… → b0bc3c2cf78b… | NAMED (A6 is green: the predecessor re-addressed it) |
| `tests/lint/generationForkRegistry.contract.test.js` · A3s (the FINAL comparand tally) | STORED FIGURE (golden-derived): same 28 → 26, absent 20 | NAMED |
| `tests/property/espionageDormancyFence.test.js` · FENCE 1 (the driven golden: 360 settlements hash to the pre-coupling corpus) | STORED FIGURE (a corpus digest): d4f94b0446f8… → d798f8b09194…. **NEW to the list.** Green at dcb069bff, red at the tip; the branch's only `src` moves are the declared batches. Its header calls a move a STOP outside a named chartered window | NAMED for the close's doors. The constant is NOT re-recorded |
| `tests/lint/presumedThings.walker.test.js` · ARM 1, declares-or-row and no-stale-row (2 arms) | STORED REGISTER: batch B's watch line (fresh 3, stale 3), as PT3 named | NAMED |
| `tests/lint/writerReach.walker.test.js` · the round trip | STORED REGISTER ROW: (1) above | NAMED |
| `tests/generators/power/standingAgainstFigure.test.js` · (b) The Garrison Bloc does not read its host's "narrow gap" (rw3-metropolis-under_siege-1) | A LAW with a LIVENESS ANCHOR whose anchor TEXT was batch B's old watch line ("keeps order reliably"). The bloc's description is now the declared twin "City watch; it answers for keeping order …". The law (no "is narrow") holds. **NEW to the list** | **RE-KEYED BY ITS TEXT** (the file's own form; the helper's message says "choose an anchor that still travels this path"): the anchor now reads `answers for keeping order`, beside a dated note. Green, and a plant (forbidding "growing more sure", which the line carries) reds |

The predecessor's partial list, CONFIRMED and CORRECTED: every red it named is red and a stored figure, except
`generationForkCensus` A6, which is now green. Three more were found: `nameHeldThroughAssembly` A1 and
`espionageDormancyFence` FENCE 1 (both stored), and `standingAgainstFigure` (b) (an anchor re-keyed). No law that this
branch turned red is left red.

## (3) THE 525 REFERENCE CONFIGURATIONS

**Unchanged: 256.** My cure of (1) moved no `src` line (only a test anchor and this file). The golden master's own arm
at the tip lists exactly 256 moved rows, which agrees with the predecessor's hashed measure (families as in the table
below).

## THE BOOKS MY CURES MOVE (named; NOT re-taken): carried forward, corrected by the sweep

| test · arm | old → new | door |
|---|---|---|
| `tests/property/generatorGoldenMaster.test.js` and the surfaces that read the same corpus (`pipelinePinnedMode` A1 A2 A5, `pipelinePinnedChoosers` A1, `powerEconomyFreshness` A4, `nameHeldThroughAssembly` A1, `worldFactRederive` A7, `generationForkCensus` A1: the control row 7ae632298ed9… → b0bc3c2cf78b…) | **256 of the 525 reference configurations move**; by leaf: `relationships[].description` 239, `powerStructure.factions[].desc` 168, `relationships[].tension` 68, `npcs[].structuralPosition` 9, `npcs[].activeConstraint` 9, `prominentRelationship.tension` 4, `prominentRelationship.phrasing` 4, `relationships[].proseVariant` 1. PP11 moves none | the close's doors (the golden manifest's re-take) |
| `tests/property/espionageDormancyFence.test.js` · FENCE 1, the driven golden (360 settlements) | d4f94b0446f8… → d798f8b09194… | the file's named chartered window (its golden header); for the close's doors |
| `tests/lint/generationForkRegistry.contract.test.js` · A3s, the FINAL comparand tally | same 28 → 26 (absent 20) | the registry's door |
| `tests/lint/presumedThings.widened.register.json` · arm 1, `watch` | the row "Well-funded city watch; …" (ee08d7b2a92c842c) → "City watch; it answers for keeping order…" (6c12f9d5be13b96e), in rulingStructure.js, claimStanding.js, powerSiblings.js | the close's presumed pass (ruling PT3) |
| `scripts/.writer-reach-baseline.json` (`BASELINE_PATH` of `check-writer-reach.mjs`) · `surfaceReach["narrative on factionRelationships"]` (the round-trip arm) | `campaign-pdf=N dossier-pdf=N foundry=N web-display=N web-transitive=N world-book=N` → `campaign-pdf=R dossier-pdf=R foundry=R web-display=N web-transitive=R world-book=R`; verdict LIT-NAME → LIT; LIT 691 → 692 | the writer-reach doors (`check-writer-reach.mjs`: report / write / genesis / rebank) |

## EVERY NEW OR CHANGED LINE (the owner's veto list)

None of mine. The predecessors' lines stand as their hand-backs list them.

## Rows named for other seats

As the predecessors' (the record's seat: PP1's 170 and C25259; the density law's seat: C32434; the seat of
`npcGenerator.js`: the parked hook). Nothing new.

## What is owed

Nothing of this seat's assignment. The named books wait for the close's doors under the owner's word.

## How the instruments are re-made

- THE WRITER-REACH TRACE (`tools/wr.mjs`, scratch): `const { measure } = await import(root +
  '/scripts/check-writer-reach.mjs'); const live = await measure({ root });`, then print
  `live.verdicts.get('narrative on factionRelationships')` (its `verdict`, `reach`, `readers.R`, `readers.N`). Run it
  from each tree with that tree's root (about a minute each) and diff the two.
- THE SWEEP: re-make the list as in (2), `split -n l/3`, and run each chunk as `sh scripts/gate-tail.sh npx vitest run
  --reporter=default --reporter=json --outputFile=<chunk>.json <files>`, writing a progress line per chunk. Read the reds
  from the JSON by script (`tools/reds.py`: the failed assertions per file).
- THE 525 COUNT and the record census: as the predecessors' hand-backs describe them.
