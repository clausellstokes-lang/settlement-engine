# DEBT-2 hand-back: three registers follow the supply rule's landing (point 33)

DEBT-2, 2026-11-17. Base: `lane/point33-candidate-2026-11-17` at e0242a12a (tree 4a9735d2f9). Branch: `lane/debt-2-2026-11-17`,
the registers at d4a567fd9. Brief: `docs/chair/2026-11-17/sixth/briefs/BRIEF-DEBT-2.md`. No behaviour changes. Every run went
through `sh scripts/gate-tail.sh`, never through a pipe.

## The table: one row for each register

| register | the row added, word for word | the measure that earns it | the test: base → tip |
|---|---|---|---|
| D1 · `src/domain/generation/generationForkRegistry.js` (GENERATION_TIER1, 74 → 76) | `  { step: 'generateNarratives', key: 'economicState', via: 'mutates', stepDraws: 63, keyMoves: 0, rows: 63, class: 'pure', onRecord: { absent: 0, same: 49, transformed: 14 }, onRecordClass: 'varies', producedOnRecord: { absent: 0, same: 49, transformed: 14 }, producedOnRecordClass: 'varies', recordPath: 'record.economicState' },` (after `generateNarratives\|history`) | Pasted from `generationForkCensus`'s printed fresh literal at e0242a12a (A4's output; the literal is in the census run's log). The class follows from the register's own rule: keyMoves 0 of 63, so `pure`. Source: the birth writes the words for what a house buys in onto `economicState.primaryImports` in place (`resourceGenerator.js :: importsBroughtAtBirth`). It draws nothing for the key. | contract A2: red (74 ≠ 76 live) → **red, on its next pin** (the pinned denominator `toBe(74)`; patch below). Census A3e: red (76 ≠ 74) → **green**. Census A4: 4 differences → 2 (below) |
| D1 (the same register) | `  { step: 'assembleSettlement', key: 'npcs', via: 'mutates', stepDraws: 63, keyMoves: 0, rows: 63, class: 'pure', onRecord: { absent: 0, same: 0, transformed: 63 }, onRecordClass: 'transformed', producedOnRecord: { absent: 0, same: 0, transformed: 63 }, producedOnRecordClass: 'transformed', recordPath: 'record.npcs' },` (after `assembleSettlement\|relationships`) | The same literal: keyMoves 0 of 63, so `pure`. Transformed on both comparands (63/63). Source: the coherence seam's `rankPowers` changes a card's temperament to match its secret, in place (`data/npcData.js :: temperamentYieldsToSecret`). It does not draw. | contract A3s: green → **RED** (the tallies pin the old register; patch below) |
| D2 · `tests/lint/heldKeyWriterCensus.walker.test.js` STEP_ROSTER (13 → 14) | `'assembleSettlement\|npcs\|mutates',` with a dated note (above the roster and beside the row) | **(a)** At ed1d43529 (a scratch worktree), the pipeline's strict probe (`runPipeline(..., { strict: true, onStrictViolation })`) collects `assembleSettlement[npcs]` undeclared. Over the contract's 12 configs it fires on contract-metropolis-plains-crossroads. Over the golden 525 plus that row it fires on 2 of 526: that row and `town\|germanic\|plains\|road\|civilized\|gm-seed-a`. (The same probe collects `generateNarratives[economicState]` on 6 of the 12.) At e0242a12a the probe collects nothing on the 12. **(b)** Under a HELD roster (the pin bag `{ npcs, relationships }` taken from the run's own context, the form `rosterFinalUnderHeldRoster.test.js` builds), walked over the same 526 (the corpus that test's A1 walks, whole, not at its stride of 41, because at the stride the write fires on 0 rows and the measure would be vacuous): the write fires on **0 of 526**. The held roster is **byte-identical** in `ctx.npcs` and in `settlement.npcs` on **526 of 526**, at ed1d43529 and at e0242a12a. No held roster is rewritten, so the row goes in. A2's two pinned counts are unmoved: 11 writer steps (the assembly step already wrote held keys) and 22 steps. | A2: red (14 live, 13 rostered) → **green** (7/7) |
| D3 · `src/domain/goods.schema.js` (the migration roster) | ` * R \| l \| none            \| member  \| src/domain/display/crisisStoppedRow.js` (before `institutionProfile.js`) | The row WEAVE ST-2 derives and prints. The file reaches only `resourceSemantics.js` (a member with no door: `resourceShortageImport`). The derivation puts it outside the eager graph, so the row pins nothing lazy that the eager graph reads (EG1: no stop). | `vendorPdfLazy` ST-2: red → **green** |

**The build (one `npm run build`, exit 0) and its two tests:**
- At the default (no `VERIFY_DIST`): `vendorPdfLazy` 41 passed, 14 skipped; `bootSmoke` 8 passed, 3 skipped.
- With `VERIFY_DIST=1`: `bootSmoke` 9 passed, 2 skipped (the flagged dist, `VERIFY_ENGINE_REMOTE_DIST`, was not built). `vendorPdfLazy` 51 passed, **4 failed**, all size ceilings:
  - the engine chunk is 901,940 B, not under 881,331;
  - the first-paint closure is 1,163,501 B raw against a budget of 1,139,072;
  - gzip is 370,376 B against 362,621;
  - Brotli is 310,605 B against 304,224.

  These four are not in the line's list. My change adds no byte to any chunk: it is one line inside a doc comment, which the minifier strips. I did not build the base, so I cannot say whether they are red there. They are stored ceilings, which belong to the close.

## The net (each run alone; base e0242a12a in a scratch worktree, tip d4a567fd9)

- `npm run typecheck:ratchet`: exit 0 (167, ceiling 167). `npm run typecheck:domain:strict`: exit 0 (1,113, ceiling 1,113).
  `npx eslint` on my three files: exit 0.
- `npx vitest run tests/architecture`: 21 files, 347 tests, all passed.
- **All of `tests/lint` by name (N2)**: 71 failing names at the base and 71 at the tip (218 files, 3,226 tests; the comparison masks only the worktree's path).
  - **Left:** `heldKeyWriterCensus.walker` A2 (D2).
  - **Appeared:** `generationForkRegistry.contract` A3s. It is the only red my tip adds.
  - **Red at both:** contract A2, with a new message (base: "one row per live pair: 74 to be 76"; tip: "the measured denominator at this base: 76 to be 74").
  - Every other name is the same at both. `ledgerCitationIntegrity` cannot run in this checkout because the local branch `review-fixes-2026-07-08` is missing; it is the same at both.
- **N3**, read the same at base and tip:
  - `pipelineContract`: 22/22 at both.
  - `isolatedTrade`: 15/15 at both.
  - `pipelinePinnedMode`: A1, A2 and A5 red at both, with the same messages (the golden corpus moved, 37 of 41 rows: the golden's stored figures).
  - `generationForkCensus`:
    - A1 and A6 red at both, with the same messages (control row hash; fnv1a32 external callers 54 against 23): stored figures, the close's.
    - A3e red at the base, green at the tip.
    - A4 at the base had 4 differences, the two missing rows plus two cells of `economyReconcilePass\|economicState.producedOnRecord` (same 49 → measured 35, transformed 14 → 28). At the tip only those two cells remain. They are a STORED landing count (the narratives step now writes `economicState` after the reconcile pass), and the brief names A4 as the close's, so I did not re-take them.
- `tests/generators/generationForkCensus.test.js` is **not touched**: arm A3e holds no literal that follows the register. It compares the measured pairs with `GENERATION_TIER1.length`, and its `drawingSteps` figure, 13, is unmoved.

## What I left, by name

1. **`tests/lint/generationForkRegistry.contract.test.js` A2 and A3s: five pinned literals that follow the register, in a file outside my manifest.**
   - The precedent for adding a row moved these literals in the same commit (`git log -S` on the register: bbe4a02ab, PEOPLE-1).
   - The brief's manifest grants the census test, not the contract, so I stopped there.
   - The literals, measured off the register at my tip:
     - the denominator 74 → 76;
     - mutates-only 18 → 20;
     - the entropy tally pure 46 → 48;
     - the FINAL comparand transformed 15 → 16 and varies 13 → 14;
     - the POST-STEP comparand transformed 15 → 16 and varies 19 → 20.
   - Unmoved: provides 56; the disagreement count 13 (both new rows agree with themselves); the label row.
   - **The patch below, applied in a scratch worktree at d4a567fd9, turns the contract green (3/3).** It needs the chair's grant of these five lines.
2. `generationForkCensus` A4: `economyReconcilePass\|economicState.producedOnRecord` (two cells), a stored landing count, the close's.
3. The four `vendorPdfLazy` size ceilings under `VERIFY_DIST=1` (above), stored ceilings, the close's.

## AMENDMENT 1 (the chair's grant, received 19:06 UTC)

1. **The grant:** `tests/lint/generationForkRegistry.contract.test.js` is mine for EXACTLY the patch's five pinned figures, each with its dated note, and nothing else in that file.
2. **The patch, applied** at 526379d36: 5 lines in, 5 out (`git diff --stat`), nothing else. `npx eslint` on the file: exit 0. Both type gates: exit 0 (167 against a ceiling of 167; 1,113 against 1,113).
3. **The contract: 3/3 green.** The census at the tip reads A3e, A5, A7 and A8e green. A1 and A6 are red with the same messages as at the base. A4's only remaining differences are the 2 `economyReconcilePass|economicState` cells (the close's).
4. **All of `tests/lint` by name against my base: 69 at the tip against 71 at the base.** LEFT: `generationForkRegistry.contract` A2 and `heldKeyWriterCensus.walker` A2, both mine. APPEARED: **none** (A3s is green again).

```diff
--- a/tests/lint/generationForkRegistry.contract.test.js	2026-11-17 18:49:00.315171209 +0000
+++ b/tests/lint/generationForkRegistry.contract.test.js	2026-11-17 18:49:00.336266685 +0000
@@ -101,7 +101,7 @@
     expect(GENERATION_TIER1.length, 'the register declares one row per live pair').toBe(pairs.length);
     // GS-2 one faction set (2026-10-31, ODQ §934.101): 75 -> 72; generatePopulation|factions, generatePopulation|conflicts
     // and corruptionPass|factions left with the keys (the groups and conflicts are derived at assembly).
-    expect(GENERATION_TIER1.length, 'the measured denominator at this base').toBe(74); // ALLEGIANCE-CAR1 (2026-11-08): 75 -> 74, `corruptionPass|npcs|mutates` retired with the step (J-2), measured; 2026-11-07 PEOPLE-1 CAST: 74 -> 75, `assembleSettlement|relationships|mutates` (the seam's ties) // lane CRISIS (2026-11-03): resolveCrisisCast joins: two rows (72 -> 74)
+    expect(GENERATION_TIER1.length, 'the measured denominator at this base').toBe(76); // DEBT-2 · D1 (2026-11-17, point 33): 74 -> 76, generateNarratives|economicState|mutates and assembleSettlement|npcs|mutates (BIRTH-3 declared two writes the line already made), measured; // ALLEGIANCE-CAR1 (2026-11-08): 75 -> 74, `corruptionPass|npcs|mutates` retired with the step (J-2), measured; 2026-11-07 PEOPLE-1 CAST: 74 -> 75, `assembleSettlement|relationships|mutates` (the seam's ties) // lane CRISIS (2026-11-03): resolveCrisisCast joins: two rows (72 -> 74)
 
     const declared = GENERATION_TIER1.map((row) => `${row.step}|${row.key}`);
     const live = pairs.map((pair) => `${pair.step}|${pair.key}`);
@@ -118,7 +118,7 @@
     // The crisis cast (lane CRISIS, 2026-11-03): provides 55 -> 56 (resolveCrisisCast|crisisCast), mutates 17 -> 18
     // (resolveCrisisCast|settlement).
     expect(GENERATION_TIER1.filter((row) => row.via === 'provides').length, 'provides entries').toBe(56);
-    expect(GENERATION_TIER1.filter((row) => row.via === 'mutates').length, 'mutates-only entries').toBe(18) /* ALLEGIANCE-CAR1 (2026-11-08): 19 -> 18, corruptionPass|npcs|mutates retired (J-2), measured; 18 -> 19, PEOPLE-1 CAST: assembleSettlement|relationships|mutates */;
+    expect(GENERATION_TIER1.filter((row) => row.via === 'mutates').length, 'mutates-only entries').toBe(20) /* DEBT-2 · D1 (2026-11-17): 18 -> 20, the same two rows */ /* ALLEGIANCE-CAR1 (2026-11-08): 19 -> 18, corruptionPass|npcs|mutates retired (J-2), measured; 18 -> 19, PEOPLE-1 CAST: assembleSettlement|relationships|mutates */;
 
     // The accessors: a miss is `null` and `[]`, never `undefined` and never `null`.
     expect(tier1For('resolveConfig', 'tier'), 'tier1For hit').toBe(GENERATION_TIER1[0]);
@@ -172,7 +172,7 @@
     // provides `[]`; the ties are drawn at the coherence seam on their own family), the register's own re-measure.
     // R2-CODE-B-4 (ROUND THREE item 4, 2026-11-14): drawn 25 -> 27, pure 48 -> 46 — the register's own re-measure (32438f8d1):
     // resolveCrisisCast's two rows measure drawn (the cast's one temporary person, named on the step's own fork, 2 of 63 rows).
-    expect(tallyOf(GENERATION_TIER1, 'class'), 'the entropy tally').toEqual({ drawn: 27, label: 1, pure: 46 /* ALLEGIANCE-CAR1 (2026-11-08): drawn 26 -> 25, the retired corruptionPass|npcs row was drawn (measured); */ /* MERGE-234 (one tie writer): 47 -> 48, assembleSettlement|relationships measures pure (the seam mint's `::tie` fork retired) */ }); // LANDING-1 (2026-11-04): factionCorrelationPass measures drawn at the landed tip (6 of 63 rows draw); before that, lane CRISIS (2026-11-03): resolveCrisisCast joins: both its rows are pure (45 -> 47)
+    expect(tallyOf(GENERATION_TIER1, 'class'), 'the entropy tally').toEqual({ drawn: 27, label: 1, pure: 48 /* DEBT-2 · D1 (2026-11-17): 46 -> 48, both new rows measure pure (keyMoves 0 of 63); */ /* ALLEGIANCE-CAR1 (2026-11-08): drawn 26 -> 25, the retired corruptionPass|npcs row was drawn (measured); */ /* MERGE-234 (one tie writer): 47 -> 48, assembleSettlement|relationships measures pure (the seam mint's `::tie` fork retired) */ }); // LANDING-1 (2026-11-04): factionCorrelationPass measures drawn at the landed tip (6 of 63 rows draw); before that, lane CRISIS (2026-11-03): resolveCrisisCast joins: both its rows are pure (45 -> 47)
     expect(GENERATION_TIER1.filter((row) => row.class === 'label').map((row) => `${row.step}|${row.key}`),
       'the single label row: a key that moves under a zero-draw step').toEqual(['generatePower|powerIntent']);
     // GS-2 (2026-10-31, ODQ §934.101): same 35 -> 34 and transformed 15 -> 13 in BOTH comparands below, the three
@@ -180,12 +180,12 @@
     // PEOPLE-4 TIES (2026-11-07, R-P7): same 30 -> 29, transformed 13 -> 14 in BOTH comparands — generatePopulation|relationships
     // is rewritten on the record by the coherence seam's tie draw (the step provides `[]`); the disagreement count is unmoved.
     expect(tallyOf(GENERATION_TIER1, 'onRecordClass'), 'the FINAL comparand tally')
-      .toEqual({ absent: 20, same: 26, transformed: 15, varies: 13 }); // 2026-11-15, THE CLOSE OF THE TAIL ROUND (TAIL-CLOSE-SWEEP-E; the register re-measured through its door by 1c088056b under the owner's word of 2026-11-15 06:00 UTC): same 28 -> 26, varies 11 -> 13: generateEconomy|economicState and economyReconcilePass|economicState (the economy reads off the town's own record) // STYLE-2-MERGE point 27 (2026-11-10), URBAN-FIX C-1 935c961fd: same 29 -> 28, transformed 14 -> 15, resolveConfig|culturalIdentity (the stored foodways takes the food record's line at assembly; measured by generationForkCensus A4) // ALLEGIANCE-CAR1 (2026-11-08): transformed 15 -> 14, the retired corruptionPass|npcs row (measured) // MERGE-234 (one tie writer): transformed 14 -> 15, assembleSettlement|relationships same -> transformed (the seam mint's `::tie` fork retired) // LANDING-8 (2026-11-06): same 34 -> 30, varies 7 -> 11, the four stress rows under the copy-on-write crisis cast (lane D, 8befe5a0d). LANDING-1 (2026-11-04): one row same -> varies, re-measured by the census at the landed tip. lane CRISIS (2026-11-03): resolveCrisisCast joins: crisisCast absent, settlement same
+      .toEqual({ absent: 20, same: 26, transformed: 16, varies: 14 }); // DEBT-2 · D1 (2026-11-17): transformed 15 -> 16 (assembleSettlement|npcs), varies 13 -> 14 (generateNarratives|economicState); // 2026-11-15, THE CLOSE OF THE TAIL ROUND (TAIL-CLOSE-SWEEP-E; the register re-measured through its door by 1c088056b under the owner's word of 2026-11-15 06:00 UTC): same 28 -> 26, varies 11 -> 13: generateEconomy|economicState and economyReconcilePass|economicState (the economy reads off the town's own record) // STYLE-2-MERGE point 27 (2026-11-10), URBAN-FIX C-1 935c961fd: same 29 -> 28, transformed 14 -> 15, resolveConfig|culturalIdentity (the stored foodways takes the food record's line at assembly; measured by generationForkCensus A4) // ALLEGIANCE-CAR1 (2026-11-08): transformed 15 -> 14, the retired corruptionPass|npcs row (measured) // MERGE-234 (one tie writer): transformed 14 -> 15, assembleSettlement|relationships same -> transformed (the seam mint's `::tie` fork retired) // LANDING-8 (2026-11-06): same 34 -> 30, varies 7 -> 11, the four stress rows under the copy-on-write crisis cast (lane D, 8befe5a0d). LANDING-1 (2026-11-04): one row same -> varies, re-measured by the census at the landed tip. lane CRISIS (2026-11-03): resolveCrisisCast joins: crisisCast absent, settlement same
     // 2026-10-01, the urban band (ODQ §934.86): absent 27 -> 26, same 18 -> 19. The same re-measure moved two rows'
     // post-step comparand (generationRepairs absent -> varies; isolationSupport varies -> same), and both now agree
     // with their final comparand, so the disagreeing rows below go 18 -> 16 (generationForkCensus records the same).
     expect(tallyOf(GENERATION_TIER1, 'producedOnRecordClass'), 'the POST-STEP comparand tally')
-      .toEqual({ absent: 27, same: 13, transformed: 15, varies: 19 }); // 2026-11-15, THE CLOSE OF THE TAIL ROUND (TAIL-CLOSE-SWEEP-E; the same re-measure, 1c088056b): same 15 -> 13, varies 17 -> 19: coherenceRepairPass|institutions and economyReconcilePass|economicState (the disagreement count below measures 13, unmoved: generateEconomy|economicState stops disagreeing, coherenceRepairPass|institutions starts) // STYLE-2-MERGE point 27 (2026-11-10), URBAN-FIX C-1 935c961fd: same 16 -> 15, transformed 14 -> 15, the same row // ALLEGIANCE-CAR1 (2026-11-08): transformed 15 -> 14, the same retired row (measured) // MERGE-234 (one tie writer): transformed 14 -> 15, the same row // LANDING-1 (2026-11-04): one row same -> varies, re-measured at the landed tip. lane CRISIS (2026-11-03): resolveCrisisCast joins; assembleSettlement|stress produced same -> varies
+      .toEqual({ absent: 27, same: 13, transformed: 16, varies: 20 }); // DEBT-2 · D1 (2026-11-17): the same two rows, both comparands agree (the disagreement count unmoved at 13); // 2026-11-15, THE CLOSE OF THE TAIL ROUND (TAIL-CLOSE-SWEEP-E; the same re-measure, 1c088056b): same 15 -> 13, varies 17 -> 19: coherenceRepairPass|institutions and economyReconcilePass|economicState (the disagreement count below measures 13, unmoved: generateEconomy|economicState stops disagreeing, coherenceRepairPass|institutions starts) // STYLE-2-MERGE point 27 (2026-11-10), URBAN-FIX C-1 935c961fd: same 16 -> 15, transformed 14 -> 15, the same row // ALLEGIANCE-CAR1 (2026-11-08): transformed 15 -> 14, the same retired row (measured) // MERGE-234 (one tie writer): transformed 14 -> 15, the same row // LANDING-1 (2026-11-04): one row same -> varies, re-measured at the landed tip. lane CRISIS (2026-11-03): resolveCrisisCast joins; assembleSettlement|stress produced same -> varies
 
     // §6.2b: the register carries both comparands BECAUSE sixteen rows disagree, and every
     // one of them is a key a LATER step rewrites. The set is derived from the register itself.
```
