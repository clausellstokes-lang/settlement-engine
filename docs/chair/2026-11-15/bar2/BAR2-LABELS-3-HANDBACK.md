# BAR2-LABELS-3 hand-back (2026-11-15)

I am the second successor on `lane/bar2-labels-2026-11-15`. I started from its tip **c1f9889ae**: origin's tip; the repository's main checkout read d1e7b3f9e, and I left it untouched. Both predecessors' hand-backs (`BAR2-LABELS-HANDBACK.md`, `BAR2-LABELS-2-HANDBACK.md`, beside this file) are my state. I redid nothing they committed. All my work was done in a scratch worktree.

## The rulings I worked to
LB0 to LB6 (`docs/chair/2026-11-14/briefs/BAR2-LABELS.md` on `lane/chair-2026-11-08`), the chair's grant LB7 as BAR2-LABELS-2 records it, and the chair's prompt to this seat: (1) the books after the merge word; (2) C23849; (3) the "Economic role: absent" gap.

## Item 3: "Economic role: absent": the 40 was counted against the raw band, not against the page
Measured by script over the base census's 720 records (f8042b61a), using the tree's own `deriveMagicPosture`, `economicRoleBandShown`, `economyShowsMagic` (the base's rule) and `magicRoleHeld` (the tip's rule). The magic posture gives the economic role band "absent" in **150** towns. The record holds the economic role (`magicRoleHeld`) in **40** of those, which is the first seat's figure. But **32** of the 40 were already left out at base by the earlier cure W2-C-LEAVES-SIDE item 7 (`economyShowsMagic`, 408c2e30c: "32 Economic role: absent rows out"). The food rewrite (`economicRoleBandShown`) reaches none of the 150. So the page printed the row in **118** towns at base and prints it in **110** at the tip: **8** towns are new (r2r-village-13, -14, -27, -38, r2r-town-22, -43, r2r-metropolis-16, r2s-slave_revolt-village-3). The first seat's 40 is the count of "absent" bands that `magicRoleHeld` holds, 32 of which the page already did not print. It is not the number of rows that LB1 took off the page. No rows are missing from other folds or surfaces: the 8 are the whole of LB1's reach on this row, and the 110 left print where the record holds nothing of the economic role.

## Item 2: C23849, the port-traffic line (fold 0)
**NAMED for BAR2-CORPUS. Verified true as a fault on the read town; false in 1 town of the 720 across its class.**
- THE WRITER: DS-ECO-1 › COMBINATION C1 v2 ("{settlement} lives on a {complexity} and ends each year with money to spare, and the traffic on its {access} keeps it that way."). The text is in `src/data/dossierStateProse/economy.generated.js` (BAR2-CORPUS's file, generated from `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`). The pool is chosen by `src/domain/display/stateProse/economyStateProse.js :: prosperityHeaderPoolKey(rank, access)`, which reads the prosperity rung and the approach's width only.
- THE READ TOWN, born alone at f8042b61a (bar0-thorp-calm-rand-4): Prosperous; Subsistence complexity; trade access port; `primaryExports` [], `primaryImports` []; income Harvest 100%. "Money to spare" is true, but "the traffic on its port keeps it that way" is false. The pool's other lines are false there too: C1 v1 "Traffic … is steady", v3 "the port keeps it that way", and v4 "Trade … is steady".
- THE CLASS ON THE 720 (base census, by script): the C1 line prints in 50 towns. All 113 C1 towns have exports and imports, so it is **false in 0**. The same claim of passing trade, on a working approach with no exports and no imports, is false in **1** town: r2r-thorp-43 (C4 v6, "There is no market at Burjpatan to hold the trade that passes by…"; Poor, port). The other three such towns (C3: r2r-village-0, r2s-infiltrated-thorp-1, r2s-monster_pressure-thorp-0) print C3 v1/v2 lines, which make no claim of trade and are true. Under a siege, no town reaches C1 (all 24 siege towns are C4 or C5).
- WHY NAMED, NOT CURED: no line of DS-ECO-1 is true for a town on a working approach that carries no trade: C2 and C5 say the approach is hard to reach, which is false for a port. A selector-only cure would leave the header with no line (the brief's law: a state the cure leaves with no line takes a twin true in that state), and the twin belongs in the corpus pool. THE LEAF FOR THE CURE: the selector takes a third input, "the approach carries trade" (`primaryExports` or `primaryImports` non-empty). Where it is false, the header draws from twin pools, one for each rung band, authored in the corpus: high, "ends each year with money to spare, and earns it at home"; low, "poor, and little trade passes to change that". The middle pool's v3 ("the {access} is busy enough") needs the same twin. Measure: 1 read town + 1 of 720.

## THE MERGE
On the chair's word (16:21 UTC), I merged the joined line at **dcb069bff**. The line had not moved past it. This is ONE merge commit, **446a93b12** (parents c1f9889ae and dcb069bff), with no conflict, and I pushed it alone. My branch's own change under src/ against the line is the 13 files of batches 1 to 4 (`git diff --name-only dcb069bff..446a93b12 -- src`).

## THE BOOKS (F2): RUN (a) TAKEN, NOT CLASSED (I am handing back by budget, at 210,000 of my count)
- **(a)**: every test file that names a basename of those 13 files (`grep -rlw` over tests/, `*.test.*` only). That is **1098 files**, run as ONE vitest run at 446a93b12 through `sh scripts/gate-tail.sh`, to a file. THE RED FILES are in the table below.
- The owner's door is among them, and I left it exactly as it is: `townCartographyCalibration` (2) and `dossierProseManifest` (3). `presetLightingWitness` does not name a file of mine.
- **NOT CLASSED.** Several red files are ones the first seat found red at f8042b61a too: `pipelinePinnedMode`, `pipelinePinnedChoosers`, `rosterFinalUnderHeldRoster`, `x46NpcBand`, `powerEconomyFreshness`, `nameHeldThroughAssembly`, `institutionBudgetPromise`. The doors' seat's receipt says the line is green at dcb069bff. So run each red file ALONE, at 446a93b12 and at dcb069bff (a detached worktree of the line). A red in both is the line's: from load (one run of 1098 files on 4 cores may time out what is green alone) or carried. A red at mine only is classed by F2: a LAW is a regression; a STORED FIGURE moved by a declared cure is NAMED.
- **(b)** the 17 law suites, each alone: **NOT RUN** (owed). Five of them are red inside (a): `proseWiringCensus`, `writerReach`, `ruinFilterRoster`, `pipelinePinnedMode`, `presumedThings`.
- **THE 525**: the instrument is re-made, and I re-measured it at f8042b61a against c1f9889ae. **41 of 525** move (town 13, city 16, metropolis 12): `economicState.incomeSources` 29 and `powerStructure.factions` 12. That is the predecessor's figure exactly. At the merged tip against dcb069bff: **NOT MEASURED** (owed; run the same probe on both trees).

When I handed back (16:55 UTC), the run had been going for 28 minutes and had not yet finished. The table is the red files it had reported up to then. It is NOT the whole of (a): the next seat runs (a) again whole.

| red file in (a), at 446a93b12 (as of 16:55) | failed / tests |
|---|---|
| tests/lint/proseWiringCensus.walker.test.js | 1 / 79 |
| tests/property/espionageDormancyFence.test.js | 1 / 21 |
| tests/lint/tuningRegister.walker.test.js | 2 / 76 |
| tests/domain/townCartographyCalibration.test.js (the owner's door) | 2 / 32 |
| tests/property/generatorGoldenMaster.test.js | 1 / 3 |
| tests/lint/writerReach.walker.test.js | 4 / 52 |
| tests/property/dossierProseManifest.test.js (the owner's door) | 3 / 17 |
| tests/lint/ruinFilterRoster.walker.test.js | 2 / 12 |
| tests/generators/pipelinePinnedMode.test.js | 3 / 15 |
| tests/lint/presumedThings.walker.test.js | 1 / 43 |
| tests/generators/powerEconomyFreshness.test.js | 1 / 10 |
| tests/property/dmLayerGoldenIsolation.test.js | 1 / 15 |
| tests/generators/pipelinePinnedChoosers.test.js | 1 / 7 |
| tests/generators/rosterFinalUnderHeldRoster.test.js | 1 / 7 |
| tests/lint/generationForkRegistry.contract.test.js | 1 / 3 |
| tests/generators/x46NpcBand.test.js | 1 / 24 |
| tests/generators/nameHeldThroughAssembly.test.js | 1 / 7 |
| tests/generators/institutionBudgetPromise.test.js | 1 / 1 |
| tests/build/engineBundleReplay.test.js | 2 / 7 |

## Instruments, re-made (in this seat's scratchpad; each is a few lines, and easy to re-make)
- THE 525: `g/run.sh <tree> <label>` writes `g/<label>.json`. It is a vitest probe over `tests/helpers/goldenMasterCorpus.js` with the golden master's own call, and writes one sha256 for each record and for each second-level field family. `node g/cmp.mjs a.json b.json` gives the count moved and the families. Each run takes about 3 minutes.
- THE CENSUS: `census3.sh <tree> <out> 4 --count-only`, from a `git archive` of CENSUS-3. The before run at f8042b61a took 642 s for births and render. To bear a read town alone: `births.mjs` with TREE, OUT and SEEDS.
- Item 3: `pr/econrole.mjs`, over `load.mjs` and the tree's `deriveMagicPosture`, `economicRoleBandShown`, `economyShowsMagic` and `magicRoleHeld`. Item 2: `pr/c1class.mjs`, over `prosperityHeaderPoolKey`.

## What is left
- THE BOOKS: class every red of (a), as above; run (b); measure the 525 at 446a93b12 against dcb069bff; fill in the table "the books my cures move".
- C23849: the twin pools (NAMED for BAR2-CORPUS, above).
