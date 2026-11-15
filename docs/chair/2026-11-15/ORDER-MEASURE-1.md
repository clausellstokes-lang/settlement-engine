# ORDER-MEASURE-1 · prose written before its facts are final: the class measured on the 720

Seat ORDER-MEASURE-1 (measuring), 2026-11-15. Base: the joined line `lane/join-2026-11-14` at `6b1e0ccf2`. Nothing under `src/` or `tests/` is committed; every probe is under `probes/ORDER-MEASURE-1/` and the one source patch there (`snap-hooks.patch`, fifteen read-only hook lines) applies at the base and is used only in a scratch tree.

## THE ANSWER, FIRST

- **It is a class in the record, and a wide one. It is not a wide class in the read.** The power roster is the one fact family that settles late: the density law's resize (assembly sub-step A5) removes or replaces powers in **665 of 720** towns, after the history (step 20), the people (19), the stress summary (A1), the arrival scene (A2) and the guard line (A3) are written. The houses settle at step 15, the economy at step 16, the people at A7/A13; nothing else moves under prose later than that.
- **Of the 2,523 worklist rows**, 1,214 are stored in the record (located by their text); the other 1,299 (31,925 town-prints) are composed at render from the FINAL record, so the order cannot be their cause. **562 rows (18,027 town-prints) sit at a class pair whose family moved in their own town.**
- **But by the record, row by row, the order is rarely the cause.** 129 rows verified across the seven widest pairs: **6 MOVED-UNDER** (true when written, false at the end: 2 CONFIRMED, 4 PLAUSIBLE), **9 BLIND** (the line asserts a fact built only later and does not read it), **114 FALSE-AT-WRITE** (the fact the line contradicts was already final when it was written). Extrapolated per pair: about **40 rows MOVED-UNDER and about 70 BLIND, of 2,523: some 4% of the worklist.** One cure of the order does what about a hundred row cures do only if it also cures the BLIND shape; it does not do what the other ~2,400 row cures do.
- **The two builders' findings, re-measured.** The crisis seat's numbers reproduce exactly (37 insurgency towns; 31 hold a rival of standing Significant+ when the summary is written; 10 lose it by the end). The powers seat's diagnosis does **not** hold as stated: the economy is built at step 11 and final at step 16, three steps before the title lines are drawn (step 19); `representatives.js :: titleTown` passes `birthFactsOf({ institutions, config, tier })`, which leaves out the `economicState` and `powerStructure` that are in scope at that line. It is a VIEW gap, not an ORDER gap: its cure is to hand the facts that already exist to the draw, and no step need move.

## 1. THE ORDER

The pipeline's own order (`getStepOrder()`, `order.mjs`), with the assembly's sub-steps A0–A14 in file order. WRITES and the prose births are MEASURED on the 720 (`stepsnap.mjs`: a snapshot at every step's end through the runner's `onStep` hook and at every assembly sub-step through `snap-hooks.patch`); READS are the step's declared `reads` mapped to families (an assembly sub-step reads the settlement as it stands: `factsOf(settlement)`, `generateArrivalScene(settlement)` and the rest take the whole record). A prose string is a stored string of four words or more; its birth is the first snapshot at which that exact text exists anywhere in the record. Families: powers (names, category, share, standing label, the governing name), houses (names), chains, trade (exports, imports, necessity imports), income, food (label, deficit, surplus), safety (label, criminal houses), defence (readiness, scores), people (id, role, memberships, seat), ties, history (tensions, event count), stress (types), conditions.

| # | step (in run order; A0–A14 are the assembly's own sub-steps, in `assembleSettlement.js` order) | WRITES facts (family: towns where it changes there) | WRITES prose (final strings born there: count; top record paths) | READS (fact families) |
|---|---|---|---|---|
| 1 | resolveConfig | — | 5837; `culturalIdentity.scope` 720; `culturalIdentity.builtForm` 720; `culturalIdentity.civicPattern` 720; `culturalIdentity.exchangePattern` 720 | — |
| 2 | buildGenerationContext | — | 0 | — |
| 3 | resolveResources | — | 0 | — |
| 4 | resolveStress | stress 491 | 969; `stress.viabilityNote` 437; `stress.crisisHook` 431; `stress.label` 71; `stress[].crisisHook` 14 | — |
| 5 | resolveNeighbour | — | 0 | — |
| 6 | assembleInstitutions | houses 720 | 26190; `institutions[].desc` 24372; `institutions[].name` 1818 | — |
| 7 | subsumptionPass | houses 189 | 0 | houses |
| 8 | cascadePass | houses 443 | 1368; `institutions[].desc` 1343; `institutions[].name` 25 | houses |
| 9 | isolationPass | houses 32, stress 14 | 30; `institutions[].desc` 12; `stress[].viabilityNote` 10; `stress.viabilityNote` 4; `isolationSupport.paths[].evidence[]` 4 | stress |
| 10 | stressConfirmPass | stress 17 | 0 | houses, stress |
| 11 | generateEconomy | chains 720, trade 720, income 720, food 720, safety 720 | 29868; `economicState.incomeSources[].desc` 4487; `economicState.tradeDependencies[].detail` 4443; `economicState.primaryImports[]` 1890; `economicState.compound.inst.names[]` 1843 | houses |
| 12 | generatePower | powers 720, powerText 720 | 4506; `powerStructure.factions[].desc` 1732; `powerStructure.factionRelationships[].narrative` 1167; `powerStructure.recentConflict` 720; `powerStructure.stability` 503 | chains, food, houses, income, safety, stress, trade |
| 13 | neighbourFactions | — | 0 | — |
| 14 | factionCorrelationPass | houses 84 | 84; `institutions[].desc` 83; `institutions[].name` 1 | houses, powerText, powers |
| 15 | coherenceRepairPass | houses 108 | 87; `institutions[].desc` 87 | houses |
| 16 | economyReconcilePass | trade 448, chains 79, food 78, safety 31, income 26 | 45364; `availableServices.equipment[].desc` 10254; `availableServices.legal[].desc` 7381; `availableServices.healing[].desc` 4052; `availableServices.food[].desc` 3362 | chains, food, income, safety, trade |
| 17 | powerEconomyReconcilePass | powers 8, powerText 6 | 15; `powerStructure.factionRelationships[].narrative` 7; `powerStructure.factions[].desc` 7; `powerStructure.factions[].crisisNote` 1 | chains, food, income, powerText, powers, safety, trade |
| 18 | structuralValidationPass | — | 0 | houses |
| 19 | generatePopulation | people 720, ties 720 | 138234; `npcs[].plotHooks[]` 20650; `npcs[].presentation.impression` 19404; `npcs[].presentation.behaviour` 19384; `npcs[].secret.stakes` 17259 | chains, food, houses, income, powerText, powers, safety, trade |
| 20 | generateNarratives | history 720 | 34739; `history.historicalEvents[].description` 3738; `history.currentTensions[].plotHooks[]` 3344; `history.historicalEvents[].lastingEffects[]` 3052; `resourceAnalysis.gaps[].impact` 2222 | chains, food, houses, income, powerText, powers, safety, trade |
| 21 | A0-literal | — | 1227; `culturalNotes` 720; `structuralSuggestions[].reason` 240; `structuralViolations[].reason` 112; `structuralViolations[].suggestedFixes[]` 87 | the settlement as it stands (all but conditions) |
| 22 | A1-stress-summary | — | 553; `stress.summary` 466; `stress.crisisHook` 35; `stress[].summary` 24; `stress.viabilityNote` 18 | the settlement as it stands (all but conditions) |
| 23 | A2-arrival | — | 720; `arrivalScene` 720 | the settlement as it stands (all but conditions) |
| 24 | A3-defence | defence 720 | 204; `economicState.safetyProfile.guardEffectivenessDesc` 204 | the settlement as it stands (all but conditions) |
| 25 | A4-reconcile | powers 58, powerText 39 | 67; `powerStructure.factions[].desc` 32; `powerStructure.factionRelationships[].narrative` 22; `powerStructure.stability` 6; `powerStructure.factions[].crisisNote` 5 | the settlement as it stands (all but conditions) |
| 26 | A5-resize | powers 660, powerText 660 | 16; `powerStructure.factions[].faction` 16 | the settlement as it stands (all but conditions) |
| 27 | A6-crime-lines | — | 115; `economicState.safetyProfile.crimeTypes[].desc` 115 | the settlement as it stands (all but conditions) |
| 28 | A7-coherence | people 720, ties 610 | 97846; `npcs[].goal.short` 20950; `npcs[].goal.long` 20939; `relationships[].description` 20846; `relationships[].tension` 20846 | the settlement as it stands (all but conditions) |
| 29 | A8-conserve-settle | powers 639, powerText 378, history 99 | 827; `powerStructure.factions[].desc` 782; `powerStructure.factionRelationships[].narrative` 45 | the settlement as it stands (all but conditions) |
| 30 | A9-structural-npcs | — | 0 | the settlement as it stands (all but conditions) |
| 31 | A10-pressure | — | 531; `pressureSentence` 531 | the settlement as it stands (all but conditions) |
| 32 | A11-conflicts | — | 1700; `powerStructure.conflicts[].plotHooks[]` 576; `powerStructure.conflicts[].desc` 565; `powerStructure.conflicts[].issue` 550; `powerStructure.conflicts[].stakes` 9 | the settlement as it stands (all but conditions) |
| 33 | A12-true-hooks | — | 31; `economicViability.summary` 29; `npcs[].plotHooks[]` 2 | the settlement as it stands (all but conditions) |
| 34 | A13-labels-close | powers 9, powerText 9, people 9 | 23; `powerStructure.factionRelationships[].narrative` 9; `npcs[].goal.short` 6; `npcs[].goal.long` 4; `powerStructure.conflicts[].desc` 1 | the settlement as it stands (all but conditions) |
| 35 | A14-receipt | — | 0 | the settlement as it stands (all but conditions) |
| 36 | assembleSettlement | conditions 720 | 1013; `activeConditions[].description` 490; `activeConditions[].causes[].detail` 490; `activeConditions[].label` 33 | powers, powerText, houses, chains, trade, income, food, safety, defence, people, ties, history, stress |
| 37 | resolveCrisisCast | people 57 | 1879; `stress.cast.stakes[].reason` 990; `stress.cast.roles[].reason` 618; `stress.cast.absent[].reason` 190; `stress[].cast.roles[].reason` 38 | powers, powerText, houses, chains, trade, income, food, safety, defence, people, ties, history, stress, conditions |

Reading it: **the houses** are written at 6 and moved at 7, 8, 9, 14 and 15 (final at 15); **the economy** at 11 and moved only at 16 (final at 16; the guard line at A3 and the crime lines at A6 are prose and change no fact); **the powers** at 12, moved at 13 (no), 17 (8 towns), A4 (58), **A5 (660)**, A8 (639, shares and the settled texts), A13 (9, labels); **the people** at 19, moved at A7 (720), A13 (9) and step 22 (57); **the defence** first exists at A3; **the conditions** at the step's return. The history is written at 20 and moved only at A8 (99 towns, the tension texts settled to the resized roster).

Already in the code, four late re-read passes of exactly the cure-(b) shape: `settleStandingToRoster` / `settleNarrativesToRoster` / `settleTensionsToRoster` (A8, only where the resize moved the roster), `settleCrimeLinesToSignal` (A6), `storeTrueHooksOnly` + `truePersonHooks` (A12), `resolveFactionLabelsAtClose` (A13).

## 2–3. THE CLASS, AS PAIRS, AND HOW OFTEN THE RECORD MOVES UNDER THE PROSE

A pair is (the step a final prose string is born at, a fact family that step reads) where a LATER step writes that family. Its move in a town is refined: powers = a power removed, added or relabelled, or a standing label changed (a share-only change by the conservation is not counted); houses = added or dropped; a family not yet built at the birth counts as moved. Full table: `probes/ORDER-MEASURE-1/pairs.md` (43 pairs). The pairs that hold worklist rows:

| written at (i) | prose | reads | later writer (j) | towns with the prose | towns where it moves (how) | rows located (town-prints) |
|---|---|---|---|---|---|---|
| generateNarratives (20) | history events / tensions / hooks, `settlementReason`, `resourceAnalysis.strategicValue`, `economicViability.plotHooks` | powers | A5 resize (A4, A8, A13) | 665 | 665 (a power removed 419, roster replaced 243, label 3) | **250 (7,325)** |
| generatePower (12) | `factions[].desc`, `factionRelationships[].narrative`, `recentConflict`, `stability` | trade / chains / food / safety / income | economyReconcilePass (16) | 448 | 448 trade, 79 chains, 78 food, 31 safety, 26 income | 84 (1,005) trade; 21 food; 20 chains; 9 safety; 6 income |
| generatePower (12) | the same | houses | factionCorrelationPass (14), coherenceRepairPass (15) | 164 | 164 | 42 (560) |
| A2-arrival | `arrivalScene` | defence / people / powers / ties | A3, A7, A5, A7 | 720 | 720 defence not yet built; 720 people; 665 powers; 610 ties | 69 (800) |
| generatePopulation (19) | `npcs[]` hooks, presentation, secrets | powers | A5 resize (A4, A8, A13) | 665 | 665 | 66 (4,917) |
| generateEconomy (11) | `incomeSources[].desc`, `tradeDependencies[].detail`, chain labels, crime lines | houses | 14, 15 | 164 | 164 | 32 (1,670) |
| A7-coherence | `npcs[].goal`, `relationships[].description/tension`, secrets | people / history | A13, 22 / A8 | 66 / 99 | 66 / 99 | 21 (1,418) / 20 (256) |
| **A1-stress-summary** | `stress[].summary`, `crisisHook`, `viabilityNote` | powers / defence / people | A5 / A3 / A7 | 464 / 478 / 478 | 464 (removed 314, replaced 150) / 478 not yet built / 478 | 9 (268) |
| A3-defence | `safetyProfile.guardEffectivenessDesc` | powers / people | A5 / A7 | 200 / 204 | 200 / 204 | 3 (254) |
| A10-pressure | `pressureSentence` | people | A13, 22 | 62 | 62 | 4 (13) |

Not in the class, measured: **A7-coherence × powers** (after A7 the powers change only in their shares: no name, no label, no house, no economy moves under the 124 rows written there); **economyReconcilePass (16)** services and quarter texts (132 rows, 10,530 town-prints: their step reads the economy, which never moves after it); **A11 conflicts, A12 hooks, A13** (nothing moves after).

**The crisis summary, the seat's own case** (`insurgency.py`): 37 insurgency towns; at A1, 31 hold a non-governing power of standing Significant or above (28 Strong or above); at the end 10 of those 31 hold none (11 of the 28). The resize at A5 is the step that removes it.

## 4. HOW MUCH OF THE READ IS THIS CLASS

The join (`join.py`): each row's text is found in its own town's record as a stored prose string (it is contained in one, or one covering ≥ 60% of it is contained in it). 1,214 rows located (44,954 town-prints); 1,299 not stored (31,925: the dossier state prose, the PDF headlines, the display composers, the quick guide, the crisis-cast and vantage lines, 447 untraced); 10 whose town is not a census town.

**562 rows, 18,027 town-prints, are written by a step that reads a fact family a later step moves, in their own town.** That is the class's upper bound on the read: 22% of the rows, 23% of the town-prints.

**Verified by the record** (`verify.py`: twenty rows a pair, evenly spaced by row id; each sheet shows the reader's why, the text, and the record's move between the line's birth and the end; the verdicts are `sheets/verdicts.tsv`):

| pair | rows located | MOVED-UNDER (true at the write, false at the end) | BLIND (needs a fact built later; does not read it) | FALSE-AT-WRITE (the fact it contradicts was already final) |
|---|---|---|---|---|
| history × powers (`V1`) | 288 | 3 (PLAUSIBLE: a "war party" line or a "standing security office" line written while a Military/Guard power stood; the resize removed it) | 0 | 17 (court, temple district, fire, plague, flood: the PAST and the HOUSES, final at 15) |
| house descriptions, step 6 (`V5`) | 184 | 0 | 6 (a "he/his" for a holder minted at 19 as a woman, 3; a power claim "merchant houses monopolise power", "the crown" written before any power exists, 3) | 14 (the resources at step 3; the crisis at step 4) |
| power prose × economy / houses (`V4`) | 115 | 0 (six standing claims checked against the shares at the write: false then too) | 0 | 20 |
| economy prose, step 11 (`V6`) | 113 | 0 | 3 (a criminal power claim before the powers exist) | 17 |
| arrival scene × defence / powers / people (`V3`) | 69 | 0 | 0 | 20 (houses, trade, crisis: all final at the write) |
| people × powers (`V2`) | 66 | 0 | 0 | 20 (the potter's clay, the vintner's grapes, the siege's imports: the ECONOMY, final at 16, three steps before the write) |
| crisis summary (`V7`, all 9) | 9 | 3 (2 CONFIRMED: the insurgency summary and its second sentence in r2s-insurgency-hamlet-0, Grain Holders Strong at A1, removed at A5; 1 PLAUSIBLE: "defences built for quieter times" while a Strong Military/Guard stood, removed, and the defence not yet built) | 0 | 6 |
| **all** | | **6 of 129** | **9 of 129** | **114 of 129** |

Extrapolated pair by pair (rows located × the sheet's rate): MOVED-UNDER ≈ 288 × 3/20 + 9 × 3/9 ≈ **46 rows**; BLIND ≈ 184 × 6/20 + 113 × 3/20 ≈ **72 rows**. Together ≈ 118 rows of 2,523 (**≈ 4.7%**). The rest of the class's 562 rows are false for a reason the order does not touch: the line was drawn without reading a fact that was already settled (the defect the worklists already cure at the writers).

**What the measure says about the brief's premise.** "The line was true when written and the record moved under it" is real and its habitat is ONE fact family, the power roster, moved by ONE step, the density resize (A5; A4's reconcile and A13's labels in a handful). It explains the crisis seat's rows and a few history rows. The commoner shape under the same pairs is not order but VIEW: a writer that runs after its fact is final and still does not read it (the title lines, the hooks, the arrival scene, the house descriptions' crisis lines).

## 5. CANDIDATE CURES

In progress (this part follows items 1 to 4 on the same branch).

## HOW THE INSTRUMENTS ARE RE-MADE

1. A scratch worktree of the base (`git worktree add --detach <dir> 6b1e0ccf2`, its own `npm ci`), and `git apply docs/chair/2026-11-15/probes/ORDER-MEASURE-1/snap-hooks.patch` in it: fifteen lines `globalThis.__OM_SNAP?.('<sub-step>', settlement)` in `assembleSettlement.js`, inert when the global is unset.
2. The census instruments `git archive`d out of every tree: `origin/lane/census-3-2026-11-14 docs/chair/2026-11-14/probes/CENSUS-3` (its `seeds.txt`, 720 seeds, and `seedcfg.mjs`), `origin/lane/record-measure-2026-11-14 docs/chair/2026-11-14/probes/RECORD-MEASURE-1` (`births-only.sh`), `origin/lane/chair-2026-11-08 docs/chair/2026-11-14/read-all docs/chair/2026-11-14/read-all-3` (the worklists).
3. `node order.mjs <tree> > order.tsv` (the step order and declared contracts). `TREE=<tree> SEEDS=<CENSUS-3>/seeds.txt CFG=<CENSUS-3>/seedcfg.mjs OUT=snap.ndjson.gz node stepsnap.mjs` (720 towns, about 90 s). `CENSUS3_PROBES=<CENSUS-3> sh births-only.sh <tree> base` and `node identity.mjs snap.ndjson.gz base/corpus.ndjson.gz` (the instrument is draw-free: **identical 720, differ 0**).
4. `python3 order_table.py snap.ndjson.gz order.tsv order.json`; `python3 step_table.py order.json > steps.md`; `python3 join.py snap.ndjson.gz <chair>/docs/chair/2026-11-14 order.json join.json`; `python3 pairs.py snap.ndjson.gz order.json join.json > pairs.md`; `python3 insurgency.py snap.ndjson.gz`; `python3 verify.py snap.ndjson.gz join.json '<step>:<path prefix,...>' 20` (the seven sheets under `sheets/`, the spec for each in the table above: `generateNarratives:history.,settlementReason,resourceAnalysis,economicViability`, `assembleInstitutions:institutions`, `generatePower:powerStructure`, `generateEconomy:economicState`, `A2-arrival:arrivalScene`, `generatePopulation:npcs`, `A1-stress-summary:stress`).
