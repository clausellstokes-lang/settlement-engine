# Whole check at 7cf3cb9f0fd5: the 68 non-lint red files, classified

Read-only. Sources: the six shard reports (failing assertions, ANSI stripped) and the test sources at the commit (`git show`).
Nothing was run, so every claim about the product state is read from a message or a source, not measured.
Three known-real files (pipelineContract, isolatedTrade, publicProseEquality) are skipped. The 27 tests/lint files are not redone.

## 1. Summary

| class | files | tests | meaning |
|---|---|---|---|
| REAL | 8 | 11 | an invariant the tree now violates (a guard, a ceiling, a pointer) |
| UNCLEAR | 4 | 7 | cannot tell from the message; one run named per row |
| ANCHOR | 16 | 17 | a named example town or fixture whose state a landed change altered |
| STORED | 40 | 70 | a stored artefact the close refreshes (golden, count, ledger, bundle, register) or a test double that must answer a new atom |
| total | 68 | 105 | |

Lint cross-check: every tests/lint failure in the shard reports is in WALKERS-CLASSIFIED by file and test name except one,
`tests/lint/tuningRegister.walker.test.js` ("the measured tree matches the committed inventory exactly", 1 test, 6 rows differ,
the message does not name them). It is a frozen-inventory test, so it reads as STORED (the refreeze is the close's), but the
document does not list it and I did not classify it beyond that. The document was made at an older tree (a44495b592), so its
figures are not this run's.

Sub-count inside STORED: about 9 files are "double" cases (a test fixture that must answer an atom a landed branch added),
not data refreshes. They are flagged "DOUBLE" below; the close does them as a test edit, not as a regenerate.

## 2. REAL (8 files, 11 tests), first

None of these needs a data refresh. Rows 1 and 2 can print a wrong or ungrammatical sentence on a page.

### R1. tests/domain/corpusSlotAgreement.test.js (3 tests)
- Tests: "DS-GEN-16 ... LEGACY-RECOVERED v1", "v4", "v5: no number-marked verb after the slot, no singular pronoun back to it".
- Invariant: the slot `{calamity}` (filled with plural names such as "plague years", "heresy trials") is never the subject of a
  singular verb and is never referred back to as "it". Ruling of 2026-11-14.
- Evidence: v4 `The {calamity} is behind {settlement} now ...` (singular verb after the slot); v1 and v5 `{settlement} came through
  the {calamity}, and what it built ...` (a bare "it" in a line that names the slot).
- Cause: the pool `LEGACY-RECOVERED` of DS-GEN-16 in `src/data/dossierStateProse/general.generated.js`. The v4 line was added by
  commit d9857d7ceb (BAR6-CULTURE batch 1, item 10g-legacy, 2026-11-16: the new `legacy ruin` twins). Its annex source is the
  RECEIPT_POOLS_DOSSIER_STATE annex that the generator reads.
- False sentence on a page: ungrammatical, yes ("The plague years is behind Kaliburg now"), on the Overview history line, for every
  town whose top legacy event has a plural name. Not a false fact. (v1 and v5 may be a false positive of the "it" regex, since
  "it" there can mean the settlement; v4 is a true violation.)

### R2. tests/domain/corpusClipGuard.test.js (1 test)
- Test: "a crisis twin on a clipped rung names its crisis before the clip: DS-GEN-13::ENTREPOT v5 (hunger)".
- Invariant: a line marked `crisis: <kind>` must still name its crisis after `siteClause` clips it at the first semicolon.
- Evidence: `no crisis words for hunger: add them: expected undefined to be defined`. The test's CRISIS_WORDS table has no `hunger`
  row (it has `famine`). The mark `crisis: hunger` arrived in commit 1d72767c88 (SEAM-CULTURE, 2026-11-17).
- The line is `{settlement}'s market was built to handle far more than its people could ever use; with food short, it cannot now
  feed them.` The clip keeps only the text before the semicolon, so the clipped line names no hunger and prints as a calm line.
  Two repairs are needed: a `hunger` row in the guard table AND a line that says its crisis before the semicolon.
- Cause: `src/data/dossierStateProse/general.generated.js`, pool ENTREPOT v5; the clip is in `src/components/new/generalDeskRead.js`.
- False sentence: on a town in hunger the Overview prints a clipped calm market line, which is incomplete, not false.

### R3. tests/domain/foodEnduranceLine.test.js (1 test)
- Test: "one fact, one home: no months figure on the Defense tab speaks of food except the Food endurance line".
- Invariant: no sentence on the Defense tab other than the Food endurance line carries a months or weeks figure beside a food word.
- Evidence: `no second months figure about food: 3 of 66 case(s) failed` and `expected [ Array(1) ] to deeply equal []` for
  food-endurance-metropolis-5, -23, -53. Each has one offending sentence; the report does not print it.
- Likely cause: a defense-desk line landed by BAR6-DEFDESK (commits be35850406, 6cf334afc2) or BAR5-MAGIC reliance wording
  (394c7edb59) in `src/domain/display/stateProse/defenseStateProse.js` or its leaf. Only metropolises fail, so a tier-gated line.
- False sentence: a second stores figure on the Defense tab, which can contradict the Economy tab's row. To name the sentence one
  needs the `offenders` array of one of the three seeds (one run of the test).

### R4. tests/generators/economicStructure.test.js (1 test) - ceiling
- "every economy/ module stays under the cohesion ceiling": `[ [ 'foodBalance.js', 909 ] ]` against MODULE_LINE_CEILING 900 (raised
  once, 2026-07-09, by review). Cause: `src/generators/economy/foodBalance.js`, grown by 0458d954ab (BAR7-LINES, "work in
  progress") and ffcc13af83 (SEAM-ECON item 5). Invariant, not a count to re-take. Owner: the BAR7-LINES / SEAM-ECON seats.
  No page effect.

### R5. tests/generators/servicesStructure.test.js (1 test) - ceiling
- "entry stays a thin orchestrator (<= 400 lines)": 402 against ENTRY_CEILING 400. Cause: `src/generators/servicesGenerator.js`
  (last touched by BAR6-CRIME 275ce166f9 and 45e5cb7fe0, then BAR3-SERVICES). Two lines over. No page effect.

### R6. tests/joins/labelJoins.test.js (1 test) - shrink-only inventory
- "no file gains a label-join site (new joins must use catalog ids)": `expected [ Array(1) ] to deeply equal []`. One file gained an
  identity-by-label join (prefix-includes, instNames-scan, ...). The report does not name the file. The cure per the file header is
  to join by catalog id. Likely among the files born or grown since the last freeze (the display and facts leaves of BAR6/BAR7).
  Needs one run to print the site. Page effect: possible silent mis-match after a catalog respelling, none shown today.

### R7. tests/docs/enforcement-claims.test.js (2 tests) - docs hygiene
- "every completeness claim carries an @enforced-by tag" and "the banked naked-claim debt is frozen PER CLAIM": two new naked claims
  `0 problems` at lines 139 and 216 of `docs/chair/2026-11-17/bar7/BAR7-ECON-HANDBACK.md` (frozen 0, now 2). The invariant is "no new
  naked claim". Owner: the BAR7-ECON seat; tag the two claims or reword. No page effect.

### R8. tests/docs/enforcedByExists.test.js (1 test) - docs hygiene
- "every @enforced-by path target resolves": `tests/domain/birthKindsLaw.test.js` line 23 names `resourceGenerator.js` bare. The file
  exists as `src/generators/resourceGenerator.js`, so the pointer needs its path. The header came with BIRTH-1 3dc006c088 (2026-11-17).
  One-line fix by the BIRTH-1 seat. No page effect.

## 3. UNCLEAR (4 files, 7 tests)

- tests/domain/defenseStateProseDesk.test.js (3 tests): (a) "ALIVENESS: all TWENTY-FOUR pools speak" reached 23 (the reached list in
  the message omits one pool); (b) "all TWENTY-SIX pools speak, swept over the full combination space" the unreached list has 10
  entries where 9 are declared (4 CHAIN clauses and 5 Disasters pools); (c) "each clause prints as the second sentence beside its
  own row": `expected 153 to be greater than 153`, i.e. the food clause no longer adds to the economic row for the `fort()` fixture.
  Reading: pools are fail-closed under declarations and BAR6-DEFDESK (be35850406, 6cf334afc2) declared new reads, so either the
  test's `fort`/`town` fixtures lack an answer (ANCHOR/STORED-DOUBLE) or a pool is now unreachable in generated towns (REAL, dead
  prose). To decide: run the file and print `DEF2_POOLS` keys minus `reached` for (a) and (b); then check that any such pool
  speaks on one generated town. Note the sibling bar3CorpusGuards (STORED below) sees the same pool, 'CHAIN: food trades failing'.
- tests/domain/stressorsStateProseDesk.test.js (1 test): "ALIVENESS: all TWENTY-TWO lit pools speak over played worlds": `reached
  21` (expected 22), so one lifecycle or origin pool no longer speaks for the fixture `town`. Same two readings. Run: print the
  `reached` set against `STR2_POOLS` keys and see which lit pool dropped; check its declaration for an atom the fixture lacks.
- tests/generators/tailDefeconBatch3Lines.test.js (2 tests): "#20893 r2r-hamlet-30 ... The iron carts are three weeks late" and
  "#20893 r2r-city-36 ... A new toll on the iron road" must be SILENT (the iron hooks print only where the import list holds iron).
  Both now print, in the Harvest and Market Taxes rows. Either the two towns now import iron (then ANCHOR) or the hook gate broke
  (then REAL, a false sentence: an iron hook in a town with no iron import). The liveness anchor `Imports metals` passed, so the town
  imports some metal. Suspect the BAR7-LINES change to the hooks' channel (0458d954ab, `foodBalance.js`, `npcData.js`).
  Run: the import lists of those two seeds.
- tests/components/economicsChainYieldLabel.test.jsx (1 test): "one 'Normally yields' per refused chain, one 'Outputs' per chain
  that yields": 4 of the 24 sample towns (`yield-label-N`) have a count mismatch; the message prints the array but the report
  truncates it. Either a landed card prints the word "Outputs" elsewhere (a test over-count) or a chain card prints "Outputs"
  for a refused chain (a false label). Run: print the four offender strings (they carry the counts).

## 4. ANCHOR (16 files, 17 tests)

Each asserts a behaviour on a named seed or fixture whose generated state a landed change legitimately moved. The claim may still be true elsewhere; the close re-keys the pair by identity (the files' own practice).

- tests/components/bar3LabelWords3.test.jsx (1): L3b KEEP `r2s-under_siege-city-0` fish: `expected 'impaired' to be null`. The Full fish card now
  takes the impaired word there. Same seed moves in displayEconCrisisMarks and displayEconRelianceFoodWords (and
  `r2s-under_siege-metropolis-3`), so one landed economy change altered the siege towns (suspects: BAR7-ECON economicsCrisisMarks.js,
  impairedListShown.js). Worth one look that the sea chain really is impaired there.
- tests/components/displayEconCrisisMarks.test.jsx (1): KEEP row, `r2s-under_siege-city-0` no longer prints "Iron & Metalwork Metal is smelted or worked here."; the card now reads "Struggling / Prosperous before the siege".
- tests/components/displayEconRelianceFoodWords.test.jsx (1): KEEP row, `r2s-under_siege-metropolis-3` no longer prints "Contributes to Iron & Metalwork - 2% of income".
- tests/data/tailHouses1Gaps.test.js (1): 16 of 31 RED pairs fail on the premise `resourceAnalysis.gaps` kind `missing` for the named house (the Potter of r2r-village-4, the Brickmakers, Sawmills, Tanneries, Fishmongers, Smelters ...). Those towns no longer have the gap (the premise, not the rewording, fails). One cause moved 16 towns, so it is a gap-writer change; the file's own header documents the re-key-by-identity practice.
- tests/generators/arrivalIndebtedDistrictTwin.test.js (1): `r2r-village-47` prints "A doorway here and there sells remedies" where the twin "Sacks of herbs and spices" was expected (1 of 5).
- tests/generators/bar2People2Trade.test.js (1): liveness anchor missing for `r2r-hamlet-20`; the twin of the shared-trade rivalry claim no longer prints.
- tests/data/w2FixData4Round.test.js (1): `Plaviets` no longer prints "A smith tests a new blade ..." (sense line needs the house it names).
- tests/generators/foodwaysCultureLineHolds.test.js (1): twin guard `rv2-calm-town-11` (mesoamerican) no longer prints "support dense populations"; consistent with BAR6-CULTURE item 6d-fields (the line now needs grain feeding the place).
- tests/generators/foundryExportsFishTrade.test.js (1): `soak1k-1652` premise "the record holds no fish" is now false (`recordHoldsFish` true), so the cart-trade sentence is not drawn.
- tests/domain/tailCorpusDefGuards.test.js (2): batch 6 rows at `r2s-infiltrated-village-2` and `r2r-thorp-28` "admits no v4: re-key the row to a town of the case" (the test names the cure).
- tests/domain/display/economyDeskReadsTheCards.test.js (1): FULL_KEPT `r2r-village-52`, lead bucket now undefined, not `fullyExploited` (1 of 14).
- tests/generators/tailDefeconSafetyLines.test.js (1): `r2s-wartime-village-3` no longer keeps "Suppliers adulterating grain and leather ...".
- tests/domain/bar3Defecon2Lines.test.js (1): liveness anchor missing in all 3 cases (`r2r-town-34`, `r2r-metropolis-2`, `r2s-insurgency-city-3`): the timber twin no longer prints beside the excluded line. Three of three, so look at whether the timber twin changed (BAR3-DEFECON-2's lines were touched later by BAR4-HOUSES `timber at hand`).
- tests/data/w2FixData5Rows.test.js (1): `rww-city-famine-1` arrival anchor missing ("... there is no iron left to ..." expected).
- tests/data/w2FixDataArrival.test.js (1): synthetic town (Blacksmiths, no stress) no longer admits "Racks of new ironwork": SEAM-SCENES item 3 (2026-11-17) added `trade at work: ironwork` to the line and a twin; the fixture lacks the atom.
- tests/generators/arrivalSceneRoster.test.js (1): positional pin `ARRIVAL_SCENES.ordinary[4].needs` is now `['tier: ≤ hamlet']`, expected `['market']`; the table was reordered or extended by SEAM-SCENES. The sibling test (the refused line does not print) passed.

## 5. STORED (40 files, 70 tests), one line per file

Goldens and projections (the generator output moved, as expected from about twenty landed branches):
- tests/property/generatorGoldenMaster.test.js: the golden master, 485 rows differ. Re-record.
- tests/property/dmLayerGoldenIsolation.test.js: the same golden, 485 rows (the dormant layer's re-derivation equals the golden).
- tests/generators/pipelinePinnedMode.test.js (3), pipelinePinnedChoosers (1), powerEconomyFreshness (1), rosterFinalUnderHeldRoster (1), nameHeldThroughAssembly (1): "golden rows moved with no pin bag"; the same 37 golden rows (pipelinePinnedMode: 41 of 41) vs the golden master. Follow the golden.
- tests/property/dossierProseManifest.test.js (2): the drift corpus, 652 composed-prose rows moved vs `tests/fixtures/dossier-prose-manifest-golden.json`; the file's own comments sign each re-record at a close (chair's doors).
- tests/domain/worldFactRederive.test.js (1): the same manifest golden; 5 stride rows differ from the committed manifest.
- tests/property/heraldKnowledgeDeskGolden.test.js (1): Herald golden hash moved (a4294c066e... vs e2b064266e...).
- tests/property/espionageDormancyFence.test.js (1): PRE_COUPLING_CORPUS_SHA (360 settlements) moved. OWNER-GATED: the file says "a STOP, not a re-record" outside a named window; the mover is the generator movement shared with the golden master. Needs the chair's attribution to zero residue before the constant is touched; listed here because the corpus reaches only two of the coupling's files.
- tests/generators/institutionBudgetPromise.test.js (1): sixty record hashes with the density factor forced to 1, "RE-KEYED BY IDENTITY" at every landing per the file; moved.
- tests/generators/x46NpcBand.test.js (1): 55 dark digests captured 2026-11-04; moved.
- tests/domain/editWorldFactResources.test.js (2): the PRE_CHANGE digest table; census index 21 (and its fresh generation) moved.
- tests/generators/generationForkCensus.test.js (3): GENERATION_TIER1 in `src/domain/generation/generationForkRegistry.js` (economyReconcilePass producedOnRecord same 49 to 35, transformed 14 to 28; the test prints the literal to paste), the control row hash, and the observed-site pointer "npcData.js line 1678 no longer carries ?.name" (line key moved).
- tests/property/editCorpusRatchet.test.js (1): honesty figure `[695, 275, 2176]` vs stored `2173` (re-measured by design).
- tests/domain/mergeLadderHeldKeys.test.js (1): A3 count of rebuilt conflict citations 62 vs stored 61 over the golden corpus.
- tests/domain/intentAtlasSoakDistiller.test.js (1): the committed distillate is not reproduced byte for byte; regenerate.
Edge bundles (regenerate with `npm run build:edge-shared` once the inputs are committed):
- tests/edgeFunctions/aiGroundingBundle.freshness.test.js, aiOutputSchemaBundle.freshness.test.js, aiCharterBundle.freshness.test.js (1 each): bundle stale against many src inputs.
- tests/edgeFunctions/edgeSharedBundleReproducibility.test.js (4): the four bundle meta sourceHash values differ from the hash over the index content (the dirty-build class: the check ran on a dirty tree).
Census, pool and projection counts (pinned integers):
- tests/data/dossierStateProseProjection.contract.test.js (9): the wiring census stamp is stale against general, economy and defense StateProse (the generator refuses to run); pool count 861 vs 859, absent 369 vs 367, variants 3025 vs 2977, norms 591 vs 589. Same figures as the walkers; re-take the census first, then regenerate.
- tests/domain/composeStateProse.test.js (4): pools 861 vs 859; 10332 vs 10308 draws; the seedless corpus 861 vs 859; the cell arm (vid vs index) pinned both directions.
- tests/domain/bar3CorpusGuards.test.js (1): the REWORDED row pins `DS-DEF-2::CHAIN: food trades failing` v3 to "would miss if it were cut off"; that text is now v4 (v3 is "struggling to keep up"). Vids renumbered by commit 94c1d5dc5f's pool; re-key the row to v4.
- tests/generators/houseDescLateReRead.test.js (1): `toHaveLength(11)` on `DESC_LATE_SIBLINGS` keys, now 30 (the file's own comments re-pin it at each growth: 8 to 11). The per-key structure arm after it did not run.
- tests/domain/facts/declarationRegisters.test.js (1): the undeclared-lines register, `fell` has 4 rows; "a count that fell is re-pinned in the same commit".
Ledgers (docs/census/declarations and the CENSUS-4 ledgers, frozen Phase A; the live tables moved under later cures):
- tests/domain/facts/census2dTables.test.js (3), census2eTables (4), census2gDailyLifePriest (3): STRESS_DESCS, CULTURE_PROFILES_DAILY, PRESSURE_SENTENCES and POLITICAL_FLAVOR rows declare what a later cure declared (BAR5 to BAR7), not what the ledger says.
- tests/generators/institutionProseDeclared.test.js (1): service text "Collects the dues owed and the tithe" vs ledger "Collects the lord's dues and the tithe" (the sovereign-atom reword).
- tests/generators/tieProseDeclared.test.js (2): 48 declaring rows vs the ledger's 45; "{B} has brought a claim against {A}" vs the ledger's "hired an advocate" (BAR5-THINGS LAW 4 reword).
- tests/generators/npcLoyaltyGuardRows.test.js (1): 44 declared rows vs 41.
- tests/data/colourMarks4h.test.js (2): colour column 488 vs 492 ledger texts, and one tie colour row differs.
Fixtures and doubles (DOUBLE: a test helper that must answer atoms added since):
- tests/domain/stateProseKernel.test.js (1), tieDrawDeclared (1), tieDrawUnprinted (1): `tests/helpers/calmFactsDouble.js` (CALM_FACTS_ADMIT_ALL) does not answer the presence atoms added since its last extension (`court sits`, `legal house`, `seat members`, `legacy ruin`, ...; the last extension was 3367360f34). It fails closed, so lines are refused: 134 pool differences in the kernel sweep, and tie draws come out `[0,0,1,2,4,5,6,7]` where a permutation of 0..7 is the contract. Extend the double.
- tests/domain/crisisBlindDossierProse.test.js (1): `PRESENCE_SETTER[atom.dimension] is not a function`; the test's setter table has no entry for a presence atom a pool now declares (the file's history shows the same repair, 80e09a8e37, for the BAR4 atoms). Add the setters.
Baselines:
- tests/components/phoneChromeFloor.census.test.js (1): ROUTE_BASELINE floored counts /create 618 to 620, /settlements 861 to 863, /gallery 663 to 665 (floored, not bare; only two lines more on three routes).
- tests/components/dossierPhoneFloorAllViews.test.jsx (2): MOBILE_BASELINE and DESKTOP_BASELINE mismatch. The separate "every line clears its floor" test passed in the same file, so the zero-violation counts held; only line counts moved.

## 6. Reading notes
- A shared cause across ANCHOR rows: the `r2s-under_siege-*` towns (bar3LabelWords3, displayEcon x2) and the SEAM-SCENES arrival lines (w2FixDataArrival, arrivalSceneRoster, arrivalIndebtedDistrictTwin).
- R3, R6, and the UNCLEAR rows share one fix: one run each prints the missing detail (offender sentence, join site, unreached pool, import list).
- I never wrote or ran anything in the worktrees; /tmp/w held only scratch extracts of the reports.
