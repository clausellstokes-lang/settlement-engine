# CLOSE-MEASURE-1 — the whole check on the joined line, measured (2026-11-15)

> A measuring seat: nothing built, nothing re-taken, nothing committed under `src/`, `tests/`, `scripts/` or `supabase/`. Pushed part by part. Part 1: the tip and the raw reds. **Part 2: the reds by class, the build reds, the first-paint bisect.** The rehearsal, the owner's list and `close.sh` follow.

## 1. The tip

`lane/join-2026-11-14` at **`d817736d8999114919e8af331f990f8dc16a4aff`** (JOIN-7 · 14, the tail-exports-journal merge), read 2026-11-15 02:07 UTC. Scratch worktree `/home/user/cmwt` (detached at the tip, its own `npm ci`). The line forks from master `db832c892` (PR #73). The test census `scripts/.test-ratchet-baseline.json` banks **zero** failures, so every failing test at this tip is a regression to the ratchet.

## 2. The whole check, step by step (run 1)

Each of `check`'s 17 steps run separately (`/home/user/cmout/steps.sh`), exit and wall time:

| step | exit | seconds |
|---|---|---|
| validate:hazard-registry … validate:mcp-server (11 steps) | 0 | ≤ 1 each |
| typecheck:ratchet | 0 | 37 |
| typecheck:domain:strict | 0 | 30 |
| lint | 0 | 140 |
| **test:ratchet** | **1** | **4682** (78 min) |
| build | 0 | 47 |
| **verify:dist** | **1** | 203 |

**test:ratchet:** 40,215 tests; **198 failed** in **124 files**; 69 skipped (ceiling 1); 9 suites failed with no measurable test, so the ratchet stops at its SCOPE SENTINEL before it prints a regression list. Every red file, with its first message: [`probes/CLOSE-MEASURE-1/r1-red-files.md`](probes/CLOSE-MEASURE-1/r1-red-files.md).

The 9 suites the sentinel names: `ledgerCitationIntegrity`, `provenanceMap` (the checkout lacked the local ref `refs/heads/review-fixes-2026-07-08`: env, created for the re-run); `newsHeadlineContract.walker`, `newsVoiceContract.walker` (8 skips each, no message); `writerReach.walker` (52 skips: a dark-register row is now LIT, bank the win); `crisisCast`, `crisisCastDefenceHome`, `crisisCastEdit`, `people/dualHatReaders` (collection: `Cannot read properties of undefined (reading 'face')`).

The shared `.git/config` (`core.bare=false`) and the local refs did not move during run 1: compared before and after the test step.

## 3. The reds by class (part 2, from each file's first message; PLAUSIBLE where no single file was re-run)

Test step, 124 files at d817736d8:

| class | files | meaning |
|---|---|---|
| (a) register / census its own door re-derives | 11 | mechanical, rehearsed in part 3 |
| (b) golden or pin moved by a declared move | 31 | THE OWNER'S DOOR: never re-taken here |
| (c) stale edge bundle | 4 | `npm run build:edge-shared` |
| (d) real break (or no declared move names it) | 75 | the close's real work |
| (e) flake / environment | 3 | green when re-run alone |

**The re-run of all 124 files alone** (`/home/user/cmout/r2-rerun.json`): 198 failed again, the same count; only the three (e) files went green. No other flake.

**verify:dist (the build tests), 9 files red**, not counted above: (c) the bundle went stale: `engineBundleReplay` (525 of 525 rows; the 360-town fence), `engineServiceCore`, `engineServiceStoreParity`. (a) `landingFixtureFreshness` (its script's `--check` arm names the regeneration). (d) **`bootSmoke`: THE SHIPPED BUNDLE DOES NOT BOOT (plain and FLAGGED)**; `vendorPdfLazy`: first paint 3,027,506 B against 1,121,260 B (gzip 881,821 against 357,225); `engineChunkLazy` and `cultureProfilesLazy`: a FIX-B2 chunk (`narrative-mutations`) and the culture corpus are on the static entry path; `generationWorkerLazy`: the worker is 2,284,778 B against a ceiling of 2,008,268 B (a rise is the chair's or the owner's, never a lane's).

**THE FIRST-PAINT BREAK, BISECTED** (`git bisect --first-parent`, a fresh build plus `tests/build/vendorPdfLazy.test.js` at each point): the first bad point is **`e7de70116` = JOIN-6 · 6, the merge of `lane/tail-ties-2026-11-14` at b8991a936**. The lane's own tip fails alone, so the cause is in its own change, not in the merge. CONFIRMED: `ea52c0805` (just before it) is green. Its src change: `src/domain/facts/factsOf.js` now imports the new `src/domain/facts/rulingBody.js`, which imports `src/domain/facts/rulerKind.js`. The cure belongs to the files of the tail-ties seat. That this import chain is what carries the lazy chunk into the entry closure is PLAUSIBLE: the file is named, the chain is not traced. `engineCoreLazyEdge` and very likely `bootSmoke`, `engineChunkLazy` and `cultureProfilesLazy` are the same break.

Every file, with its class and evidence; for (d), the `src/` module the test imports first (blank: it reads a register or the whole tree):

| class | file | failed | evidence / door / first message | src/ it tests (d) |
|---|---|---|---|---|
| a | tests/components/pageCensus.walker.test.jsx | 2 | node scripts/census/page-census.mjs (register) |  |
| a | tests/components/phoneChromeFloor.census.test.js | 1 | re-measured by its door (JOIN-3 1.3) |  |
| a | tests/lint/observedShapeReaders.walker.test.js | 6 | the observed-shape register re-mint (OSR door) |  |
| a | tests/lint/poolDominance.walker.test.js | 2 | node scripts/census/pool-dominance.mjs --bank-new |  |
| a | tests/lint/presumedThings.walker.test.js | 4 | node scripts/presumed-things-door.mjs (--bank-strip / --check) |  |
| a | tests/lint/proseCorpusBytes.test.js | 1 | prose-byte baseline door (its failure text) |  |
| a | tests/lint/proseNumerics.test.js | 1 | its regenerate door (debt fell) |  |
| a | tests/lint/sovereigntyLightingContract.walker.test.js | 2 | LIGHTING_CENSUS_REFREEZE door (last; clean tree) |  |
| a | tests/lint/tuningRegister.walker.test.js | 4 | node scripts/count-tuning-inventory.mjs --update |  |
| a | tests/lint/wiringCensusDeclared.walker.test.js | 1 | node scripts/census/census4-extract-pools.mjs (declarations) |  |
| a | tests/lint/writerReach.walker.test.js | 0 | node scripts/check-writer-reach.mjs --write (bank the win: row LIT) |  |
| b | tests/generators/generationForkCensus.test.js | 4 | control hash |  |
| b | tests/generators/hookThemeDraws.test.js | 1 | NPC-hook total 2107 -> 2147 (ties 97685dc01) |  |
| b | tests/generators/institutionBudgetPromise.test.js | 1 | 60 rows re-keyed (JOIN-3 1.2) |  |
| b | tests/generators/nameHeldThroughAssembly.test.js | 1 | 41 rows |  |
| b | tests/generators/pipelinePinnedChoosers.test.js | 2 | 41 rows |  |
| b | tests/generators/pipelinePinnedMode.test.js | 3 | 41 of 41 golden rows |  |
| b | tests/generators/powerEconomyFreshness.test.js | 3 | 31 -> 32 fixtures |  |
| b | tests/generators/rosterDuplicateDraws.test.js | 2 | 853 -> 889 |  |
| b | tests/generators/rosterFinalUnderHeldRoster.test.js | 1 | 41 rows |  |
| b | tests/generators/upkeepVocation.test.jsx | 1 | 41 rows |  |
| b | tests/generators/urbanBandInstitutions.test.js | 1 | carried G3/G5 (JOIN-6 J6) |  |
| b | tests/generators/x46NpcBand.test.js | 1 | 60 worlds |  |
| b | tests/lint/proseComposed.walker.test.js | 1 | pin 2951->2953 variants: corpus lanes (eco 11 / def 12) |  |
| b | tests/lint/proseEntryContradiction.walker.test.js | 1 | pin 375->373 |  |
| b | tests/lint/proseFamilyContract.walker.test.js | 5 | pin scalarRows 37067->38161 |  |
| b | tests/lint/proseWiringCensus.walker.test.js | 4 | pins 2951->2953: corpus lanes |  |
| b | tests/pdf/goldenViewModel.test.js | 1 | pdf.6 snapshot |  |
| b | tests/property/dmLayerGoldenIsolation.test.js | 1 | 525 rows: same moves |  |
| b | tests/property/dossierProseManifest.test.js | 3 | drift corpus by seed |  |
| b | tests/property/editCorpusRatchet.test.js | 4 | 327 vs 332 |  |
| b | tests/property/espionageDormancyFence.test.js | 1 | driven corpus: ties, powers |  |
| b | tests/property/generatorGoldenMaster.test.js | 1 | 525 rows: JOIN-6 declared moves (crisis, houses, ties, narrative, powers, defecon) + JOIN-7's |  |
| b | tests/property/heraldKnowledgeDeskGolden.test.js | 1 | desk hash |  |
| b | tests/simulation/presetLightingWitness.test.js | 1 | witnessed world moved |  |
| b | tests/domain/corpusCureGuards.test.js | 12 | 12 rows: re-key row to a town (moved towns) |  |
| b | tests/domain/intentAtlasSoakDistiller.test.js | 1 | atlas JSON |  |
| b | tests/domain/mergeLadderHeldKeys.test.js | 3 | figures measured at landing |  |
| b | tests/domain/recordMerge.test.js | 1 | 61 -> 50 rows |  |
| b | tests/domain/townCartographyCalibration.test.js | 2 | 25 rows |  |
| b | tests/domain/worldFactRederive.test.js | 1 | carried A7 (JOIN-6 J6: red at defecon's base) |  |
| b | tests/lib/instantWorld/mundaneRealmAcceptance.test.js | 1 | twin-census drifted |  |
| c | tests/edgeFunctions/aiCharterBundle.freshness.test.js | 1 | npm run build:edge-shared |  |
| c | tests/edgeFunctions/aiGroundingBundle.freshness.test.js | 1 | npm run build:edge-shared |  |
| c | tests/edgeFunctions/aiOutputSchemaBundle.freshness.test.js | 1 | npm run build:edge-shared |  |
| c | tests/edgeFunctions/edgeSharedBundleReproducibility.test.js | 4 | npm run build:edge-shared, then commit bundle with inputs |  |
| d | tests/architecture/engineCoreLazyEdge.test.js | 2 | FLAGGED graph: engine-core eagerly imports a lazily pinned module (first-paint break, tail-ties e7de70116) |  |
| d | tests/architecture/layerBoundaries.test.js | 1 | new import cycle |  |
| d | tests/data/canonicalRowsDeclared.test.js | 1 | DS-ECO-6 TIER: minor shadow activity (≥3): expected [ 'no organised crime', …(2) ] to deeply equal [ 'colour'  | src/data/dossierStateProse/economy.generated.js |
| d | tests/data/dossierStateProseProjection.contract.test.js | 2 | expected [ …(5) ] to deeply equal [] | src/domain/prose/wiringCensus.js, src/domain/prose/composedWalker.js |
| d | tests/data/foundingWorldBones.test.js | 1 | expected [ Array(1) ] to deeply equal [] | src/generators/generateSettlementPipeline.js, src/data/sampleSettlements.js |
| d | tests/data/tailHouses1Gaps.test.js | 1 | a house without its input is not described at work on it — 1 of 31 case(s) failed. This is the TRUE count: eve | src/generators/generateSettlementPipeline.js, src/domain/density/densityCreateBoundary.js |
| d | tests/data/w2FixData6Rows.test.js | 3 | no tavern, inn or alehouse: no barrels go to one — 1 of 1 case(s) failed. This is the TRUE count: every case r | src/generators/generateSettlementPipeline.js, src/domain/density/densityCreateBoundary.js |
| d | tests/components/crisisStoppedRows.test.jsx | 1 | an income title with no declaration: expected [ 'Harvest' ] to deeply equal [] | src/generators/generateSettlementPipeline.js, src/domain/density/densityCreateBoundary.js |
| d | tests/components/displayEconRelianceFoodWords.test.jsx | 1 | expected 'StrugglingWealthy before the famine; …' to contain 'Contributes to Entrepôt Trade - 13% o…' | src/components/new/tabs/EconomicsTab.jsx, src/components/new/tabs/MagicTab.jsx |
| d | tests/components/dossierPhoneFloorAllViews.test.jsx | 2 |  | src/design/proseScale.js, src/components/OutputContainer.jsx |
| d | tests/components/houseLabelEverySurface.test.jsx | 1 | expected [ …(3) ] to deeply equal [] | src/components/OutputContainer.jsx, src/generators/generateSettlementPipeline.js |
| d | tests/foundry/journalMarksCrisisRows.test.js | 2 | expected [ …(38) ] to include '- Grain Sales (scarce): 4%' | src/store/configSlice.js, src/domain/density/densityCreateBoundary.js |
| d | tests/joins/fieldManifest.test.js | 2 | magicNote no longer read by MagicTab.jsx | src/domain/fieldManifest.js, src/domain/region/deriveRegionalState.js |
| d | tests/joins/labelJoins.test.js | 1 | 1 label join |  |
| d | tests/generators/captureBirthScale.test.js | 1 | statistical floor 372 > 326 (red twice) | src/generators/generateSettlementPipeline.js, src/generators/factionDynamics.js |
| d | tests/generators/clerkHookSmallPlace.test.js | 1 | 2 of 7 | src/data/npcData.js, src/generators/generateSettlementPipeline.js |
| d | tests/generators/coherenceAgreeCures.test.js | 2 | CARRIED by ruling (k), red x2 since 06f36ad36 | src/generators/resourceGenerator.js, src/generators/safetyProfile.js |
| d | tests/generators/conflictTouched.test.js | 1 | label The Guard vs Military/Guard | src/generators/powerGenerator.js, src/kernel/prng.js |
| d | tests/generators/economicHistoryRecent.test.js | 1 | undefined value | src/generators/narrativeText.js, src/domain/facts/textOf.js |
| d | tests/generators/hookTruthAtBirth.test.js | 2 | undefined value | src/domain/coherence/hookTruthRecord.js, src/domain/edit/recordInvariants.js |
| d | tests/generators/servicesStructure.test.js | 1 | 402 > 400 |  |
| d | tests/generators/tailTiesBatch1.test.js | 1 | r2r-village-50 | src/generators/generateSettlementPipeline.js, src/domain/density/densityCreateBoundary.js |
| d | tests/lint/defenceFactReaders.walker.test.js | 1 | readers 12 -> 15 | src/domain/facts/factVocabulary.js |
| d | tests/lint/domainAnyCastBaseline.test.js | 5 | any-cast debt grew |  |
| d | tests/lint/factLayers.walker.test.js | 3 | factsOf getter 'keep' undefined | src/domain/facts/factLayers.js, src/domain/facts/factVocabulary.js |
| d | tests/lint/mutationCoverageManifest.test.js | 1 | (no message) | src/generators/x.js |
| d | tests/lint/negativeAssertionAnchor.walker.test.js | 2 | 68 new un-anchored negatives |  |
| d | tests/lint/newsHeadlineContract.walker.test.js | 0 | 8 skips, beforeAll failed, no message | src/domain/worldPulse/factionCompetition.js, src/domain/worldPulse/worldPulseFeedCuration.js |
| d | tests/lint/newsVoiceContract.walker.test.js | 0 | 8 skips, beforeAll failed, no message | src/domain/worldPulse/worldPulseFeedCuration.js |
| d | tests/lint/noLegacyFactionReaders.walker.test.js | 1 | 3 legacy faction readers |  |
| d | tests/lint/proseDrawnAnchors.walker.test.js | 1 | literal state-prose sentence as anchor |  |
| d | tests/lint/rawColorLiteral.test.js | 1 | raw colours 1206 -> 1209 |  |
| d | tests/lint/recordRegisterTotality.walker.test.js | 2 | a rejected cross-entry candidate became a total | src/generators/generateSettlementPipeline.js, src/domain/edit/recordRegister.js |
| d | tests/lint/seedLoopTotality.walker.test.js | 2 | 17 new bare seed loops |  |
| d | tests/lint/siteCoherenceRatchet.test.js | 1 | contradiction inventory moved (added) | src/generators/generateSettlementPipeline.js, src/domain/townMap/townLayoutV2.js |
| d | tests/lint/styleLaw.walker.test.js | 1 | struck phrase rose ("power") |  |
| d | tests/simulation/tierInertiaEnvelope.test.js | 1 | statistical ceiling 43 (red twice) | src/generators/generateSettlementPipeline.js, src/domain/worldPulse/worldSnapshot.js |
| d | tests/domain/crimeLineDisqualifiers.test.js | 3 | DS-POW-6::capture pressure ADVANCING (weak security, poor prosperity) #1: expected false to be true // Object. | src/data/dossierStateProse/power.generated.js, src/data/dossierStateProse/defense.generated.js |
| d | tests/domain/crisisBlindDossierProse.test.js | 2 | expected 21 to be greater than or equal to 29 | src/domain/coherence/crisisBlindFindings.js, src/domain/crisis/crisisFacts.js |
| d | tests/domain/crisisBlindWidened.test.js | 1 | different goods: expected [] to have a length of 1 but got +0 | src/domain/coherence/crisisBlindFindings.js, src/data/dossierStateProse/economy.generated.js |
| d | tests/domain/crisisCast.test.js | 0 | collection: undefined.face | src/domain/crisis/crisisCast.js, src/domain/institutions/institutionRoster.js |
| d | tests/domain/crisisCastDefenceHome.test.js | 0 | collection: undefined.face | src/domain/crisis/crisisCast.js, src/domain/defense/defenseFacts.js |
| d | tests/domain/crisisCastEdit.test.js | 0 | collection: undefined.face | src/domain/userEdits.js, src/domain/crisis/crisisCast.js |
| d | tests/domain/defenseInvasionWithinACriticalBand.test.js | 3 | expected [ 'WEAK', 'ADEQUATE' ] to deeply equal [ 'CRITICAL', 'CRITICAL' ] | src/generators/generateSettlementPipeline.js, src/domain/density/densityCreateBoundary.js |
| d | tests/domain/defensePerimeterCalm.test.js | 1 | occupied: the pool went mute: expected 0 to be greater than 0 | src/domain/display/stateProse/stateProseKernel.js, src/domain/crisis/crisisFacts.js |
| d | tests/domain/defensePostureAgainstItsFacts.test.js | 4 | the premise — 4 of 6 case(s) failed. This is the TRUE count: every case ran. A bare seed loop would have repor | src/generators/generateSettlementPipeline.js, src/domain/density/densityCreateBoundary.js |
| d | tests/domain/defensePostureReadsBadge.test.js | 1 | no open road or peace presumed under a siege — 1 of 2 case(s) failed. This is the TRUE count: every case ran.  | src/data/bandLadders.js, src/generators/generateSettlementPipeline.js |
| d | tests/domain/defenseSupplyUnderACrisis.test.js | 1 | expected 'People at Ögedeitash believe the town…' to match /well stocked/kept supplied/will not g…/ | src/generators/generateSettlementPipeline.js, src/domain/density/densityCreateBoundary.js |
| d | tests/domain/defenseWatchIsNotTheLevy.test.js | 1 | expected null to be 'Invasion & War: walls with citizen mi…' // Object.is equality | src/generators/generateSettlementPipeline.js, src/domain/density/densityCreateBoundary.js |
| d | tests/domain/defenseWithinTheBar.test.js | 2 | a Strong bar — 3 of 5 case(s) failed. This is the TRUE count: every case ran. A bare seed loop would have repo | src/generators/generateSettlementPipeline.js, src/domain/density/densityCreateBoundary.js |
| d | tests/domain/defenseWordsFindings.test.js | 1 | no stored-food sentence beside the one Food endurance line — 7 of 64 case(s) failed. This is the TRUE count: e | src/store/configSlice.js, src/domain/density/densityCreateBoundary.js |
| d | tests/domain/editWorldFactResources.test.js | 2 | a config carrying NO world-fact roster resolves exactly as it did before this change: the mark is absent, the  | src/domain/edit/dmLayer.js, src/domain/edit/fieldDeclarations.js |
| d | tests/domain/famineStoresOneRounding.test.js | 1 | every six-month famine granary reads as held — 1 of 3 case(s) failed. This is the TRUE count: every case ran.  | src/domain/coherence/crisisFactFindings.js, src/generators/economy/foodBalance.js |
| d | tests/domain/heraldCausalVoice.test.js | 1 | expected [ …(6) ] to deeply equal [] | src/domain/display/stateProse/generalStateProse.js, src/domain/display/causeWalk.js |
| d | tests/domain/powerStateProseDesk.test.js | 2 | TypeError: .toMatch() expects to receive a string, but got object | src/domain/display/stateProse/powerStateProse.js, src/domain/simulationSpine.js |
| d | tests/domain/r3c10FoodLinesTrue.test.js | 2 | expected [ [ false, false ], …(6) ] to deeply equal [ [ true, false ], …(6) ] | src/generators/generateSettlementPipeline.js, src/domain/density/densityCreateBoundary.js |
| d | tests/domain/r3c8ReaderLinesTrue.test.js | 2 | expected [ { town: 'Dionpyrgos', …(3) } ] to deeply equal [] | src/generators/generateSettlementPipeline.js, src/domain/density/densityCreateBoundary.js |
| d | tests/domain/r3c9ReaderLinesTrue.test.js | 1 | expected [ { town: 'Ainkarez', …(4) } ] to deeply equal [] | src/generators/generateSettlementPipeline.js, src/domain/density/densityCreateBoundary.js |
| d | tests/domain/storesSpanFigure.test.js | 1 | the readers' thorps read "about a month and a half" — 1 of 3 case(s) failed. This is the TRUE count: every cas | src/generators/generateSettlementPipeline.js, src/domain/density/densityCreateBoundary.js |
| d | tests/domain/threatRowsTrueUnderBand.test.js | 1 | expected 'A palisade and armed townsfolk: enoug…' to be 'A palisade and armed townsfolk who kn…' // Object.is  | src/store/configSlice.js, src/domain/density/densityCreateBoundary.js |
| d | tests/domain/tonightOwnGoal.test.js | 1 | TypeError: .toMatch() expects to receive a string, but got undefined | src/generators/generateSettlementPipeline.js, src/domain/density/densityCreateBoundary.js |
| d | tests/ui/defenseTabFlow.test.js | 1 | fixture premise: the roster files an alchemist as arcane defense: expected 0 to be greater than 0 | src/components/new/tabs/DefenseTab.jsx, src/components/new/tabs/ViabilityTab.jsx |
| d | tests/domain/coherence/pageCensusFindings.test.js | 2 | expected 'undefined' to be 'string' // Object.is equality | src/domain/coherence/pageCensusFindings.js, src/domain/coherence/coherenceBattery.js |
| d | tests/domain/coherence/vocabularyPageFindings.test.js | 1 | expected [ 'openTrade', 'streets' ] to deeply equal [ 'house: alchemist', …(2) ] | src/domain/coherence/vocabularyPageFindings.js, src/domain/facts/registeredWords.js |
| d | tests/domain/dossier/entityIndex.test.js | 1 | expected null to be truthy | src/domain/dossier/entityLinks.js, src/domain/display/institutionDisplayName.js |
| d | tests/domain/facts/composeBareCrisis.test.js | 1 | expected undefined to be truthy | src/domain/display/stateProse/stateProseKernel.js, src/data/dossierStateProse/warFaith.generated.js |
| d | tests/domain/facts/defenceTraditionReaders.test.js | 1 | anchored: expected false to be true // Object.is equality | src/generators/generateSettlementPipeline.js, src/domain/density/densityCreateBoundary.js |
| d | tests/domain/npc/paradigmAxisCatalog.test.js | 1 | expected [ …(5) ] to deeply equal [ …(4) ] | src/domain/npc/paradigmAxisCatalog.js, src/domain/npc/characterDrift.js |
| d | tests/domain/people/dualHatReaders.test.js | 0 | collection: undefined.face | src/domain/people/cardPowers.js, src/domain/dossier/seatHolder.js |
| d | tests/domain/people/hallDecidesUnderOccupation.test.js | 1 | anchored: the syndicate line that names the three: expected 'Nobody at the head of High Theocratic…' to match  | src/store/configSlice.js, src/domain/density/densityCreateBoundary.js |
| d | tests/domain/people/hallLineReadsCrime.test.js | 1 | every town of the read prints the none rung's line its crime structure admits — 1 of 8 case(s) failed. This is | src/generators/generateSettlementPipeline.js, src/domain/density/densityCreateBoundary.js |
| d | tests/domain/display/criminalSwayReadsHall.test.js | 1 | Nobody at the head of City-State Council answers to a criminal house, and no criminal power here is strong eno | src/store/configSlice.js, src/domain/density/densityCreateBoundary.js |
| d | tests/domain/display/gapLineHousesByKind.test.js | 1 | a half-way line names a house the roster holds by kind — 7 of 7 case(s) failed. This is the TRUE count: every  | src/generators/generateSettlementPipeline.js, src/domain/density/densityCreateBoundary.js |
| d | docs/chair/2026-11-14/probes/POWERS-16/sumpdf.test.jsx | 1 | a probe under docs/ collected by vitest |  |
| d | docs/chair/2026-11-14/probes/POWERS-16/surf.test.jsx | 1 | a probe under docs/ collected by vitest |  |
| e | tests/lint/ledgerCitationIntegrity.test.js | 0 | env: local ref refs/heads/review-fixes-2026-07-08 absent; green on re-run once created |  |
| e | tests/scripts/provenanceMap.test.js | 0 | env: same ref; green on re-run |  |
| e | tests/security/customContentLockOrder.postgres.test.js | 0 | flake: 1 skip in the whole run, green alone |  |

The (d) rows above in two groups. **Named breaks**: the first-paint break (tail-ties); the crisis-cast collection crash `Cannot read properties of undefined (reading 'face')` (4 files, one cause); probe tests committed under `docs/chair/2026-11-14/probes/POWERS-16/` that vitest collects (2 files: the POWERS-16 seat); walker inventories that GREW: un-anchored negatives +68, bare seed loops +17, defence-fact readers 12 → 15, legacy faction readers +3, raw colours +3, the any-cast debt. A grown walker is a new violation: it is not re-frozen mechanically. **Behaviour reds** (the domain/display/defense/data rows): each is a sentence test that no declared move names. Some may be keyed rows a declared move re-drew; that split is part 4's work, file by file.

Environment note: to let the two (e) env files run, the local ref `refs/heads/review-fixes-2026-07-08` was created in the shared repository by fetch. Left in place in the main checkout `/home/user/settlement-engine`, by the chair's ruling: an untracked symlink `node_modules -> /home/user/cmwt/node_modules`, made so the git hooks could run there for the part 1 commit. It is not committed.

## 4. The rehearsal of the mechanical doors (part 3)

Run at the line's later tip **`a7209f9037a38ef4c6feb1eb0e26c9255c0f47e3`** (JOIN-8 · 5's hand-back), in a plain clone with its own `.git` and its own `npm ci` (`/home/user/cmclose`, per the chair's ruling). Nothing committed. The doors, in order: [`probes/CLOSE-MEASURE-1/close.sh`](probes/CLOSE-MEASURE-1/close.sh) (`close.sh` runs 1-6; `close.sh --refreeze` runs 7-8 on a clean tree after 1-6 are committed; `--rehearse` runs 7-8 first, for a seat that commits nothing).

| # | door | command | result | seconds |
|---|---|---|---|---|
| 1 | edge bundles (c) | `npm run build:edge-shared` | **exit 0**: 10 bundle files re-written (aiCharter, aiGrounding, aiOutputSchema, analyticsEvents meta, engineBundle, intentAtlas meta) | 1 |
| 2 | wiring census (a) | `node scripts/wiring-census.mjs` | **CRASHES**: `ReferenceError: Cannot access 'CAST_REASONS' before initialization` at `src/domain/crisis/crisisHooks.js:102` (a REAL BREAK, below) | 1 |
| 3 | writer reach (a) | `node scripts/check-writer-reach.mjs --write` | not reached (close.sh stops at the first failure) | |
| 4 | presumed things (a) | `node scripts/presumed-things-door.mjs --shrink` | not reached | |
| 5 | page census (a) | `node scripts/census/page-census.mjs --shrink` | not reached | |
| 6 | pool dominance (a) | `node scripts/census/pool-dominance.mjs --bank-new` (a door by the chair's ruling of 2026-11-12) | not reached | |
| 7 | tuning inventory (a) | `TUNING_INVENTORY_REFREEZE=<seat> TUNING_INVENTORY_NOTE=<why>`, then vitest on `tests/lint/tuningRegister.walker.test.js` | **REFUSED [POPULATION_GREW]**: unregistered tuning values in `src/domain/display/shadowEconomyShown.js` (0 → 1; JOIN-7 · 13, tail-exports-pdf) and `src/generators/economy/prosperity.js` (0 → 1; JOIN-7 · 25, tail-defecon). Moved to (d) | 12 |
| 8 | lighting census (a), last | `LIGHTING_CENSUS_REFREEZE=<seat> LIGHTING_CENSUS_NOTE=<why>`, then vitest on `tests/lint/sovereigntyLightingContract.walker.test.js` | the census **re-took** (9 lines of the register). Its verification run is **still red**: the `each`/`for` park debt, a shrink-only ceiling, ROSE (files named include `displayEcon*.test.jsx` of tail-display-econ, `resourcesCatalogueLabel`, `cultureProfiles`, `customContentAdmission`). Moved to (d) | 17 |

**So the mechanical refreeze is NOT mechanical today.** Three of its doors stand behind real breaks: 2 (the crash), 7 (tuning growth) and 8 (the park ceiling). A CLOSE seat cannot run `close.sh` to the end until those three are cured in `src/` and `tests/`. **The whole check after the rehearsal was not completed inside this seat's count.** A run of the 17 steps on the tree with doors 1 and 8 applied was started at 05:11 UTC into `/home/user/cmout/r3/` in this container; its first three heavy steps are green (`typecheck:ratchet` 38 s, `typecheck:domain:strict` 30 s, `lint` 147 s).

### The real breaks found by the rehearsal (add them to part 2's (d))

- **The crisis-cast cycle.** `src/domain/crisis/crisisHooks.js` reads `CAST_REASONS.face` at module top level (line 101 at d817736d8, 102 at a7209f9), from `src/domain/crisis/crisisCast.js:148`. When `crisisCast.js` is reached through an import cycle, the read hits TDZ (a7209f9) or `undefined` (d817736d8). The same cause gives part 2's four `undefined.face` collection crashes (`crisisCast`, `crisisCastDefenceHome`, `crisisCastEdit`, `people/dualHatReaders`), the wiring-census door's crash and, PLAUSIBLY, `layerBoundaries`' new cycle. The line came in with r2-code-b (JOIN-4 · 1, `9618e0319`; JOIN-5 · P2, `e6233009b`); JOIN-7 · 19 (tail-crisis, `420e8fd09`) moved it last. The cure: hoist the set into a function, or break the cycle, in the files of r2-code-b / tail-crisis.
- **Tuning growth**: the two files above (tail-exports-pdf, tail-defecon): register the values through the tuning door's DECLARED_GROWTH row, or route them through existing tuning.
- **The `each`/`for` park ceiling**: the new test files that park on `each` (tail-display-econ's first). The cure is a plain parameterless loop in each test (the walker's own text).

## 5. THE OWNER'S LIST (class b: never re-taken by a seat)

Every golden and pin moved, with the declared move that moved it. Commits are from JOIN-6's §4 [J6] (the merges are on the joined line); "rows" is from the failure message at d817736d8:

| golden / pin | rows moved | declared moves |
|---|---|---|
| `tests/property/generatorGoldenMaster.test.js` | 525 of 525 | 1409e3cbb (crisis: stressors summary, 66 records), a2550c0ef (houses: institutions[].desc), e0d38e6c4 (ties: relationships[].tension, 358 towns), 97685dc01 (ties: npcs[].plotHooks[], 194 towns), 9bd853fd0 (narrative: founding.reason, 154 towns), 12d8fd0a9 / 21dc7fa4b / d68805134 (powers: presentation; factions[].desc, 284 towns; headman's name, 38 towns), 6b8a9b993 / 10e1cf0ea / 358d6afea (defecon: safetyProfile 223 towns; localProduction 302 / 375 towns), plus JOIN-7's moves: their hand-backs name them, this seat did not read them |
| `tests/property/dmLayerGoldenIsolation.test.js` | 525 | the same moves (its re-derivation IS the golden) |
| `tests/property/espionageDormancyFence.test.js` (driven corpus, 360) | 360 | ties (e0d38e6c4, 97685dc01), powers (12d8fd0a9, 21dc7fa4b, d68805134) |
| `tests/pdf/goldenViewModel.test.js` (pdf.6 snapshot), `tests/property/heraldKnowledgeDeskGolden.test.js` (desk hash) | 1 each | the same generator moves; JOIN-7's exports lanes (pdf 13, journal 14) |
| generator pins: `pipelinePinnedMode`, `pipelinePinnedChoosers`, `nameHeldThroughAssembly`, `rosterFinalUnderHeldRoster`, `upkeepVocation` | 41 rows each | the same generator moves |
| `x46NpcBand` (60 worlds), `institutionBudgetPromise` (60), `townCartographyCalibration` (25), `recordMerge` (61 → 50), `hookThemeDraws` (2107 → 2147 hooks: ties 97685dc01), `rosterDuplicateDraws` (853 → 889), `editCorpusRatchet` (332 → 327), `generationForkCensus`, `powerEconomyFreshness` (31 → 32), `dossierProseManifest`, `presetLightingWitness`, `intentAtlasSoakDistiller`, `mundaneRealmAcceptance`, `mergeLadderHeldKeys`, `corpusCureGuards` (12 rows to re-key) | as given | the same generator moves. These are PLAUSIBLE: each move is named from the message, not traced one by one |
| prose pins: `proseComposed` and `proseWiringCensus` (2951 → 2953 variants), `proseEntryContradiction` (375 → 373), `proseFamilyContract` (scalarRows 37067 → 38161) | as given | the corpus lanes (corpus-eco 11, corpus-def 12) |
| carried reds, not this line's moves: `worldFactRederive` A7, `urbanBandInstitutions` G3/G5, `coherenceAgreeCures` (ruling k) | | carried by JOIN-6 |

## 6. The times

At d817736d8, run 1: the 11 validators ≤ 1 s each; `typecheck:ratchet` 37 s; `typecheck:domain:strict` 30 s; `lint` 140 s; **`test:ratchet` 4,682 s (78 min)**; `build` 47 s; `verify:dist` 203 s. **The whole check: about 85 minutes.** The re-run of the 124 red files alone: about 45 min, behind the mutex. A first-parent bisect step (fresh build plus one build test): about 2 min. Doors: 1 s (bundles); 12 s and 17 s (the two refreezes, each with its verification run).

## 7. WHAT A CLOSE SEAT MUST BE TOLD

1. **The line is not one mechanical refreeze from green.** Cure first, in this order: (i) the crisis-cast cycle (it blocks a door and four suites); (ii) the first-paint break of tail-ties (`factsOf.js` → `rulingBody.js`; the shipped bundle does not boot); (iii) the tuning growth and the `each` park ceiling (they block doors 7 and 8); (iv) the grown walkers (negatives, seed loops, readers, raw colours, any-cast); (v) the POWERS-16 probe tests under `docs/` that vitest collects; (vi) the behaviour reds of part 2, file by file.
2. Then `close.sh` (1-6), commit, `close.sh --refreeze` (7-8), commit the census bill. Then the whole check, and the owner's list (§5) to the owner's door. Never re-take a golden or a pin.
3. Run the whole check in a plain clone with its own `.git`. Ensure the local ref `refs/heads/review-fixes-2026-07-08` exists (`git fetch origin review-fixes-2026-07-08:refs/heads/review-fixes-2026-07-08`), or two suites red for the environment. The ratchet's SCOPE SENTINEL stops it before its regression list. Read the failures from its JSON report (`/tmp/test-ratchet-*/results.json`), never through a pipe.
4. The classification of part 2 is from first messages. Where a (d) row is a keyed row a declared move re-drew, it moves to (b): that split is the CLOSE seat's first measurement.

Hand-back: at 221,000 of 250,000 of this seat's count. The pushes from `/home/user/cmclone` ran no hooks: a fresh clone has no `core.hookspath`. Docs only.
