# FABLE VALIDATION — slice W11–W19 (61 items + 8 APPENDIX rows)

Seat: Fable 5.1, 2026-09-12. Read-only. Every `file:line` below was resolved in the dock checkout of `f2da5a3ee` (`scratchpad/dock-f2da5a3ee`), never on the ledger branch. CONFIRMED = I opened the file and read the enclosing function, or executed the check; PLAUSIBLE = reasoning only.

**Protocol step 1 — the measurement.** `evidence/measure-prose.py` re-run against `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` (headings `### DS-DEF-2:`→`### DS-DEF-3:` at f2da5a3ee vs 471ce894a, budget 1900; `### DS-DEF-11`→`### DS-POP-3` at f73bdbf16 vs 5cfc02000, budget 1200). Output reproduces `measurement-output.txt` byte for byte (519/489/24.4/63% vs 168/143/17.4/74%; 124 over 244 vs 125 over 735). **CONFIRMED.** The warrant holds.

**Protocol step 2 — fidelity.** `fidelity-W11-W19.md` returned FAITHFUL WITH NOTED DEFECTS. Only finding 1 of 6 is repaired in the file as it now stands (see the FIDELITY-REPAIR CHECK at the end).

**Verbatim column (question a).** Re-checked W11, W12, W13, W16, W17 against `verbatim/tables-13.as-run.txt` (a single CR-less line; read via `tr`). Matches. The fidelity packet's mechanical 61/61 stands. CONFIRMED on the sample; not re-done for all 61.

**One structural fact that recurs below (CONFIRMED):** the defense desk's faces are POOLED. DS-DEF-11's key is `wallRationalePoolKey(walls, monsterThreat, militaryGate, tier)` (`src/domain/display/stateProse/defenseStateProse.js:1055-1067`) and `walls` is the bucket `['wall','citadel','palisade','earthwork', …]` (`src/domain/institutions/defenseInstitutionBuckets.js:84-87`). A `Palisade` town and a `Town walls` town draw from the SAME `WALLED-*` pool. Any permission that is conditional on the ROW ("call town walls stone", "where the chain runs", "where the description agrees") cannot be exercised by a pooled face until a per-town fill (`{defmaterial}`, O-1) exists. This is F1-126's shape (a pooled face is authored once and drawn by every matching town) and it is what the old W11 meant by "until `{defmaterial}` is minted".

---

## W11 — THE MATERIAL BAR

| id | verdict | (b) ground real? | (c) permission safe? | VALIDATION |
|---|---|---|---|---|
| W11a | SPLIT | CONFIRMED: `institutionVocabulary.js:155` (palisade or earthworks: wooden/earthen, "cannot afford stone"), `:157` (Town walls: stone), `:162` (City walls: masonry), `:278` (Palisade: sharpened stakes). `Citadel` `:165`, `Massive walls` `:166` ("layered wall systems… distributed garrisons"), `Gates (if walled)` `:159` fix no material. Kept half lands as F1-32. | **NO at pool grain.** Worst sentence the struck half licenses: *"the stone ring around {settlement}"* in `WALLED-QUIET`. That pool draws on a `Palisade` town too (key `:1055-1067`; bucket `:84-87`), where `institutionVocabulary.js:155`/`:278` deny stone. Per-town true, per-pool false. | **REVERSE (struck half): the material bar stays KEPT at the pool grain until `{defmaterial}` (O-1) lands — exactly the old law's condition, which the strike removed \| `defenseStateProse.js:1055-1067` + `institutionVocabulary.js:155/:278` \| floor 1.** Kept half OK. |
| W11b | SPLIT | CONFIRMED: `supplyChainData.js:873-884` (`id:'fortification'`, `rawInputs:['Quarried stone','Building materials']`, `resource:'Stone quarry'`, over Palisade/Town walls/City walls/Citadel; note `minTier:'hamlet'` and a quarry resource, so it is a per-town condition). Kept half lands as F1-33. | Conditional and true per town; unexercisable per pool (the key reads no chain). On a `Palisade` row the chain's stone source vs the row's wooden description is the engine contradicting itself (NF-5) — per §R-1 a WIRING row, not a charge on the face. | **CHALLENGE:** (i) the ground still carries the archivist's "the bar's own reason … is false" (fidelity 4a, unrepaired); (ii) on Palisade rows F1-33 should be suspended per R-1 until O-1; (iii) the permission needs the pool-grain caveat. |
| W11c | STRUCK | The ground names no field; it argues licence. | **NO.** Worst sentence: a shipped "stone" clause kept in any `WALLED-*` pool. The clause lives at pool grain; "where the row's description agrees" is undecidable there; on every `Palisade`/`Palisade or earthworks` town the clause is denied by `institutionVocabulary.js:155/:278`. Plus fidelity 6: nothing re-reads shipped text. | **REVERSE: CONTRADICTION at the pool grain — a shipped material clause in a pool whose key spans rows of different material is dropped (or routed through `{defmaterial}`) \| `institutionVocabulary.js:155/:278` + `defenseStateProse.js:1055-1067` \| floor 1.** |
| W11d | STRUCK | Construction/rendering. CONFIRMED `{defwork}` literals via `DEFWORK_WORDS` `defenseStateProse.js:1003`. | Safe: a broken fill is the gate's, not a false claim. | OK |

## W12 — THE GARRISON BAR

| id | verdict | (b) | (c) | VALIDATION |
|---|---|---|---|---|
| W12a | SPLIT | CONFIRMED `priorityHelpers.js:46`; `safetyProfile.js:288` "The garrison patrols"; `:300` "There is no meaningful guard presence." — but `:300` prints ONLY in the `Unsafe` band (`effectiveSafety >= 0.6`), and the always-printed denial is `:376-382` (fires on `!hasMilitaryInst`; note `hasMilitaryInst` includes `'walls','citadel'` `:45`, so a walls-only town prints "local guard" `:326-372` — W-04). Kept half lands as F1-02. | Safe. | OK (note: cite `:376-382` as the primary denial; `:300` is band-conditional). |
| W12b | STRUCK | CONFIRMED catalog `:1363-1368` "Housing for guards or small garrison."; vocab `:160` "a small garrison"; `hasGarrison` fires `:46`; panel `:288`/`:289`/`:296`/`:306` prints "The garrison …" off the flag. §R-3 in the table. | Worst sentence "the garrison" on a barracks town: the row's own printed description contains the word, the panel prints it. No field denies. The closing argument #2's "imports the city rung" names no field on the town's page. ("Small" bounds size — F2-01 regardless.) | OK |
| W12c | SPLIT | CONFIRMED `:288` / watchLabel `:30-35`; `'professional city watch'` in `:46`. | Safe. | **CHALLENGE (landing):** the table folds W12c into **F1-29**, which is FALSE as written: at city `Garrison` (`institutionalCatalog.js:1925`, `required:true`) and `Professional city watch` (`:1918`, `required:true`) are TWO required rows with different names; `dedupByName` (`defenseDisplay.js:335`) dedupes by NAME and cannot merge them. "The garrison relieves the watch" is two rows at every city. W12c's real kept half (town: Town watch is not the garrison) is carried by F1-02; F1-29 must be re-cut. |
| W12d | STRUCK | CONFIRMED `stressTypes.js:39`. Ground still carries the archivist's "so both readings are on the record" (fidelity 4b, unrepaired). | PLAUSIBLE safe: ambiguity is not falsity; F1-121 (bare "the garrison" for the occupier's force) SURVIVES in the table and the permission cell lists no "garrison". Closing #5 is a craft argument (rung legibility), not a field. | OK (note F1-121 rider; note unrepaired ground). |
| W12e | STRUCK | On the GENERATION record CONFIRMED consistent: `safetyProfile.js:99-107` prints occupation curfew, checkpoints, "informers and occupation officials". | On the WORLD-RUN record the table keeps **F1-90**: `occupierStillPresent` (`occupation.js:882-893`) is a separate falsifiable read a liberated/relieved occupation loses. "The occupier's men in the street" is false there. | **CHALLENGE:** the permission needs the F1-90 rider (world-run occupation ledger). |

## W13 — THE WATCH BAR

| id | verdict | (b) | (c) | VALIDATION |
|---|---|---|---|---|
| W13a | SPLIT | CONFIRMED `:48`; `:300`/`:376-382`; charNote "threats the watch cannot" fires on `hasCharterHall` regardless of `hasWatch` at `:274` (row says `:273` — one-line drift). Lands F1-01. | Safe. | OK |
| W13b | SPLIT | **The kept half's ground is FALSE.** `defenseGenerator.js:177-178`: `hasAnyDefense = … \|\| inst.hasWatch \|\| …`; `:190` gates the military score on it; the ORDER gate `:244-246` ALSO counts `hasWatch`; `fieldSynonyms.js:51`: "The military economic gate IS the town's pay for its watch". The comment at `:182` names "garrison wages, wall maintenance" but the CODE puts the watch under it. The table's own **F4-19** says the false claim is "the pay gate NOT reaching the watch"; W13b has 0 hits in the table — its kept half did not land, and the instrument asserts the reverse. | The kept half charges a TRUE sentence ("the upkeep gate pays the watch"). | **REVERSE: STRUCK entire — the kept half is inverted (the old law's item 5 misdescribed the engine) \| `defenseGenerator.js:177-178, :190, :244-246`; `fieldSynonyms.js:51` \| floor 4.** |
| W13c | CONTRADICTION | CONFIRMED `:45`, `:300`, `governanceNarrative.js:499-506` ('The guard' when no garrison/militia/watch/mercenary at town+). BUT `:760-775` feeds that label into `stressNarratives` → `recentConflict`, printed on the Summary (`SummaryTab.jsx:39-40`). So on exactly the towns where `:300` denies a guard, the Summary can print "The guard …". | Two engine surfaces on one dossier — §R-1 says WIRING (like W-19) with the face standing. The closed roster still denies the BODY, so the finding survives; the row needs the R-1 caveat. | **CHALLENGE:** add the R-1 caveat and a W-row for the fallback label; the CONTRADICTION verdict is right on the roster, wrong if grounded on `:300` alone. |
| W13d | SPLIT | CONFIRMED `:52`. Lands F1-07 (wall half). | Safe on a walled town. | OK |
| W13e | STRUCK | Table §R-8 and F1-03/F1-24 KEEP the citation half: "a roll CITED as a record needs the holder"; `holderTable.js:279-288` — the muster kind's only holder is `Citizen militia`/`Muster training` ("A town with a Garrison and no militia has men under arms and no roll of them"). | The permission ("Mention a roll, a list, a name written down") does not separate mention from citation; a refuter reading STRUCK drops an F1-24 finding. | **CHALLENGE:** the row is stale against the instrument — should read SPLIT (kept: citation → F1-03/F1-24; struck: mention). |
| W13f | STRUCK | A permission, not a bar. | — | OK |

## W14 — THE LABEL BAR

| id | verdict | (b) | (c) | VALIDATION |
|---|---|---|---|---|
| W14-gen | CONTRADICTION | Floor 1 restated. | — | OK |
| W14-plagued | MODEL | CONFIRMED `SummaryTab.jsx:28`, `:37`; `monsterThreat.js:28`; `stressTypes.js:84-85`; and `safetyProfile.js:276` prints "keeps the guard exceptionally well-drilled" on plagued+Very Safe (F4-05). | Safe. | OK |
| W14-settled | SPLIT | CONFIRMED `stressGenerator.js:121` (×0.3), `:168` (×0.4), `:231` (×0.4); `monsterThreat.js:24` "the calm baseline". Lands F1-34. | Safe. | OK |
| W14-granary | SPLIT | CONFIRMED `:63`; catalog `:925-931` (required at town), `:1590-1596`; village has `Communal root cellar` (vocab `:279`, a grain store, not a granary). Lands F1-09. | Safe. | OK |
| W14-church | CONTRADICTION | CONFIRMED catalog `:49-55` (thorp), `:300-307` (hamlet, required), `:763-770` Parish church. Lands F1-11. | Safe. | OK |
| W14-court | SPLIT | CONFIRMED `:55`; vocab `:283-284`; `:333` (prints only inside the `hasMilitaryInst` branch). Lands F1-12, §R-4. | Safe. | OK |
| W14-port | CONTRADICTION | CONFIRMED `generationContext.js:195-205`. Lands F1-18. | Safe. | OK |
| W14-gates | SPLIT | CONFIRMED `:53` (`'palisade'`); `:464` — BUT the "no gates to bribe" sentence prints only inside `if (inst.hasSmuggling)` (`:460`). The closed roster still denies a gate; the ground overstates the printed surface. | Safe. | **CHALLENGE (minor):** the "reverse" ground's rendered denial is conditional on `hasSmuggling`; this also undercuts closing #4's premise that `:464` is "a sentence the reader sees" unconditionally. |
| W14-gateduty | STRUCK | CONFIRMED `institutionServices.js:1324` `{on:true, p:0.8}`; instantiation is a roll `def.p * tierChance` (`generators/services/institutionServices.js:176-177`), so Gate duty renders on a fraction of Town-watch towns; the denial `:464` is itself `hasSmuggling`-gated. The ground still carries the archivist's "so no surface denies the face" (fidelity 4c, unrepaired). | The permission cell is correctly conditioned ("where the services panel prints Gate duty"). | **CHALLENGE:** restore the fold's narrower LENITY wording; both surfaces are conditional; NF-4/W-08 carry the wiring. Verdict stands for a writer. |
| W14-magical | SPLIT | CONFIRMED `defenseGenerator.js:295-306`; note the small-tier zero gate is `['thorp','hamlet','village']` (`:297`) — the ground says thorp/hamlet (understates the zero set; permission direction safe). | Safe. | OK (note) |
| W14-readiness | SPLIT | CONFIRMED `:510`, `:516-521`. The kept ground says "(walls never decay)" — the exact wording §R-13/F4-01 RE-CUT as false: `calamityKernel.js:102` demotes `Town walls`→`Palisade or earthworks`, `:259-276` stamps `worldPulseFate:'demoted_by_disaster'`, `:250-251` ruins. Substance holds (the band is a frozen snapshot, §1.4). | Permission "Never explain it by crumbling stone" is right on the SNAPSHOT band. | **CHALLENGE:** re-word per F4-01 ("no decay clock; and no face asserts permanence"); NF-7 repeats the retracted wording. |

## W15 — THE ALIAS BAR

| id | verdict | (b) | (c) | VALIDATION |
|---|---|---|---|---|
| W15-gen | SPLIT | Vocabulary; kept half is F1-01/02/11. | Closing #1 is a policy argument (enforcement mechanism), not a field. Under the owner's re-cut a spelling list is not a truth test. | OK |
| W15-force | STRUCK | Vocabulary. | "Say soldiers … whatever the roster supports": NF-2/F1-27 denies "soldiers" for a `Town watch` (`institutionalCatalog.js:1352` "Part-time guards"); the appendix's narrowing list omits W15-force. | **CHALLENGE (minor):** add the F1-27 rider; NF-2's "narrows" list should include W15-force. |
| W15-works | STRUCK | F1-07/F1-32 carry the truth. | Safe. | OK |
| W15-stores | STRUCK | F1-09. | Safe. | OK |
| W15-water | STRUCK | F1-18. | Safe (a wharf/quay is bounded by the closed roster / `hasPort` `:61` — note). | OK |
| W15-approach | STRUCK | **The ground is FALSE:** "no field records the ground outside the settlement" — `config.terrainType` is printed as the terrain badge (`OverviewTab.jsx:261`, `ra.terrain`) and `config.tradeRouteAccess` beside the name (`:250`); `terrainHelpers.js:23-28` maps route→terrain. The table already carries **F1-102** (a cliff on Plains, fields on a desert, a harbour inland, a pass on a `road` town). | Worst sentence: *"the tree line comes down to the last mile before {settlement}"* on a `desert`/`plains` town — denied by the printed terrain. Permission is unconditioned. A refuter reading this ground would DROP an F1-102 finding. | **REVERSE: SPLIT — kept: the approach against `config.terrainType`/`tradeRouteAccess` (= F1-102); struck: the spelling \| `OverviewTab.jsx:250, :261`; `terrainHelpers.js:23-28` \| floor 1.** |
| W15-land | STRUCK | Ground narrower than the source (fidelity 4d, unrepaired). | Conditioned on terrain — safe. | OK (note) |
| W15-faith | SPLIT | F1-11. | Safe. | OK |
| W15-sick | SPLIT | `hasHospital` is `:64` (row says `:62`); it fires on `'healer'` — a PERSON (F1-14). | "Where the row resolves, name IT" — name the row, not an infirmary off a Healer. | OK (note) |
| W15-seat | SPLIT | Governance panel. | Safe. | OK |
| W15-reckoning | STRUCK | The table KEEPS **F1-24** (a record cited to a keeper the card prints SOURCE-UNRESOLVED) — which is this bar's citation half ("never the rolls/the clerks AS A CITATION"). | Permission ("ledgers, a man who keeps the book") carries no F1-24 rider. | **CHALLENGE:** should read SPLIT (kept: citation → F1-24; struck: the word). Same shape as W13e. |
| W15-instrument | SPLIT | F1-87. | Safe. | OK |
| W15-plurality | CONTRADICTION | Row's ground is vague (`ENTAILMENT-TABLE:531`); the table's F1-51 fixes it: `settlementPolitics.js:149` `RULING_CONSOLIDATION_FLOOR: 0.4` CONFIRMED. | Safe. | OK |
| W15-mill | CONTRADICTION | F1-15. | Safe. | OK |

## W16 — THE GATE'S WORD

| id | verdict | (b) | (c) | VALIDATION |
|---|---|---|---|---|
| W16a | STRUCK | Vocabulary. | Safe. | OK |
| W16b | MODEL | CONFIRMED `:182`, `:186-187`, `:189-192`. Lands F4-02. | Safe. | OK |
| W16c | SPLIT | F2-01/F2-02 (no folded ids on F2 rows — landing PLAUSIBLE by substance). | Safe. | OK |
| W16d | SPLIT | CONFIRMED floor 0.6, `communityMilBase` exempt `:187-192`; "unpaid soldiers desert slowly" `:187`. §R-9 flags it as a live amendment to ratified R-viii′ (vetoable). | Safe. | OK (note R-9) |
| W16e | STRUCK | The ground says "not a falsehood". But X-1's own case IS a falsehood available to the writer: the STRAINED key fires on a militia-only town (`hasMilitia` is in `hasAnyDefense` `:177`; `militaryGate < 1` keys `WALLED-STRAINED` `:1057`), and the `Citizen militia` row's PRINTED description is "Part-time soldiers with their own tools and **no pay**" (`institutionVocabulary.js:153`; catalog `:1344` "Part-time service"). Not in the table (W16e only in the struck list). | Worst sentence: *"the militia's wages are late"* — denied by the row printed beside the prose. | **REVERSE: SPLIT — kept: no wage, pay or arrears predicated of a `Citizen militia` / `Household levy` (rows whose description says no pay); struck: the class-word requirement \| `institutionVocabulary.js:153-154`; `defenseGenerator.js:177` \| floor 1.** |

## W17 — THE CRISIS BAR

| id | verdict | (b) | (c) | VALIDATION |
|---|---|---|---|---|
| W17a | SPLIT | CONFIRMED `:52-53`; `stressTypes.js:17` "The settlement is surrounded." (row says `:16-17`). **The eleven words "so an army at the walls is the record's own claim" are STILL in the row** (`items-W11-W19.md:95`). | "Army" is a magnitude word (F2-01); "at the walls" collides with the kept half on unwalled towns; "the record's own claim" invites the inverse charge. Permission cell itself is fine. | **CHALLENGE:** fidelity finding 2 is unrepaired; delete the clause. |
| W17b | SPLIT (inv.) | CONFIRMED `occupationStatus.js:39-45`; `stressTypes.js:39`. Lands F1-78. Note the law's "never a garrison present" clause has no half in this row (it is W12e's subject; F1-121/F1-90). | Safe. | OK |
| W17c | CONTRADICTION | CONFIRMED `stressTypes.js:156`. Lands F1-66 (which adds the 45 % profit coin `stressNarrative.js:42` and the "garrison is reinforced" assertion `:147`, W-18). | Safe. | OK |
| W17d | STRUCK | F1-02 governs. | Safe. | OK |
| W17e | SPLIT | CONFIRMED `stressTypes.js:28`. The table keeps **F1-76** ("a harvest blamed for a blockade famine"; `stressorDynamics.js` — string not re-verified, PLAUSIBLE). | "Thin fields" IS a harvest cause; on a world-run blockade famine it is denied. The struck half needs the rider. | **CHALLENGE:** add the F1-76 rider to the permission (generation famine free; blockade famine not). |
| W17f | SPLIT (inv.) | CONFIRMED `safetyProfile.js:135`, `:139`; `urbanFabricKernel.js:307`, `:320`. Lands F1-36. Note F1-63: the engine's own `stressNarrative.js:99` prints "It is not yet a plague" beside the `'Plague Conditions'` label — §R-1 makes the LABEL the record. | Safe, with the R-1 tension named. | OK (note) |
| W17g | SPLIT | CONFIRMED `stressTypes.js:123`. Lands F1-77 — which ALSO keeps `stressNarrative.js:115` "not street fighting but the systematic withdrawal of cooperation" (CONFIRMED) as a floor-1 bound the row's permission omits (it names only floor 2). | "A knife, a hidden cache" fine; a skirmish is F1-77. "A man who does not come home" — unnamed (floor 3 OK, contra fidelity's weaker note) but an EVENT/elapsed course (F2-04/F2-05); write it as a standing condition. | **CHALLENGE:** state the F1-77 bound; recast the example as a standing condition. |

## W18 — THE STRESS-RECORD BAR

| id | verdict | (b) | (c) | VALIDATION |
|---|---|---|---|---|
| W18a | STRUCK | A grant. | Safe. | OK |
| W18b | SPLIT | F1-74. | Safe. | OK |
| W18c | CONTRADICTION | Row cites a file, no line; table F1-72 cites `stressors.js:770-776` — CONFIRMED (severity origin-driven; spread ×0.72 per target). | Safe. | OK |
| W18d | STRUCK | The ground calls it "a tense rule — construction". But the instrument keeps **F2-05** (a birth-time STATE bears no temporal register; the perfect/durative refused) and **F1-71** (a birth `resistance` stamp read as a present occupation; `stressorDynamics.js:807-812` "Born under occupation: this is a resistance"; `:888-890` "Birth-time field snapshot — NARRATIVE only… recomputes from live state"). The tense rule was floors 1+2 in construction dress. | Worst sentence: *"the resistance has been bleeding the occupier since the first winter"* — F2-05, F2-02, F1-71. "Write the tense the sentence wants" flatly contradicts F2-05. | **REVERSE: SPLIT — kept: F2-05's register bar + F1-71 (a birth stamp is never re-read as live); struck: "past tense ONLY" as a prescription \| `stressorDynamics.js:807-812, :888-890` \| floors 1 + 2.** |
| W18e | SPLIT | CONFIRMED `WorldPulseData.js:239` (Attacker "unnamed" for `declared_war`/`unattributed`); `stressors.js:95`. BUT F1-71 keeps "`palace_coup` read as a fact rather than the fallback" — `stressorDynamics.js:877` `\|\| 'palace_coup'` IS the no-contender fallback — while `stressors.js:95` prints "A rival court has gathered enough allies" as engine prose. | The struck half ("Write the rival court, the counted allies") collides with F1-71; two engine surfaces need an R-1 ruling (token or line). | **CHALLENGE:** rule which side is the record for `palace_coup`; until then the struck half is unsafe against F1-71. |

## W19 — THE FAITH BAR

| id | verdict | (b) | (c) | VALIDATION |
|---|---|---|---|---|
| W19a | SCOPE | Constitutional; ADDENDUM 15 changed the SUBJECT (followers act), not the doctrine (F3-02). | Safe. | OK |
| W19b | CONTRADICTION | CONFIRMED `faithPanelModel.js:39-44`; `religionState.js:51`, `:56`, `:150-154`, `:276`; `occupationStatus.js:40`. Lands F1-91. | Safe. | OK |
| W19c | SPLIT | CONFIRMED `historyGenerator.js:812`, `:582`, `:596`; `SummaryTab.jsx:38` prints "Founded approximately N years ago." — but that is the TOWN's age. The kept half's floor-1 ground is a category slip: a newly founded CREED in an old town contradicts no age field. The surviving ground is floor 2 (**F2-03**, a founding narrated) and F1-98's engine sense (`faithPanelModel.js:194`: `live` = a projected `faithProfile`). F1-98 repeats the same slip. | Permission "Never a founding" is right (F2-03). | **CHALLENGE:** re-ground the kept half on F2-03 + F1-98, drop the town-age argument. Verdict stands. |
| W19d | STRUCK | Law text is a reconstruction (fidelity noted). `live:false` = no projected profile (`:194`). | "Colour it freely" is bounded by §D rows D-13/D-14/D-17 (post-date the fold) — a rider the cell should carry. | OK (note) |

## APPENDIX — NEW BARS

| id | verdict | (b) | (c) | VALIDATION |
|---|---|---|---|---|
| NF-1 | CONTRADICTION | CONFIRMED `institutionalCatalog.js:1340-1354` (`exclusiveGroup:'civilianDefense'` on both; Town watch `required:true`). `cascadeGenerator.js:167`/`:208` enforces the group at generation — so at birth a militia never seats beside a Town watch. | Stated as an absolute; custom rosters (F1-30) and the demote lattice (`calamityKernel.js:100-101` militia→watch) mean the test is the ROSTER on this town (§R-6). | OK (rider: "where the roster prints one"). |
| NF-2 | CONTRADICTION | CONFIRMED `:1352` "Part-time guards."; vocab `:158` "Keepers of order rather than a fighting force." | Safe; also narrows W15-force. | OK |
| NF-3 | CONTRADICTION | CONFIRMED `:1925` `required:true`. But phrased as a TIER law; §R-6: the test is the row on THIS town. `calamityKernel.js:103` pairs `Barracks`↔`Garrison` (a Garrison demotes to Barracks), `:250-251` ruins rows; custom rosters exist. | "MAY NO LONGER write a city with no soldiers" is false on a city whose Garrison row is ruined/demoted in the world-run. | **CHALLENGE:** restate as F1-25's negation direction against the LIVE roster row, not the tier. |
| NF-4 | WIRING | Both surfaces conditional (see W14-gateduty). | — | OK |
| NF-5 | WIRING | §R-7. Pool-grain caveat as W11b. | — | OK |
| NF-6 | CONTRADICTION | `stressTypes.js:39`. | Safe. | OK |
| NF-7 | MODEL | CONFIRMED `:510`, `:186-187`. Carries "walls never decay" — retracted by §R-13/F4-01. | — | **CHALLENGE:** re-word per F4-01. |
| NF-8 | MODEL | CONFIRMED `:187-192`. | Safe. | OK |

---

## FIDELITY-REPAIR CHECK

| # | finding | repaired in `items-W11-W19.md` as it stands? | evidence |
|---|---|---|---|
| 1 | NEW FINDINGS section absent | **YES** | APPENDIX rows NF-1…NF-8 with VALIDATION cells; preamble names F1-26…F1-33 / W-08. |
| 2 | W17a ground "an army at the walls is the record's own claim" | **NO** | `items-W11-W19.md:95` still carries the clause verbatim. |
| 3 | framing names W14 as a vocabulary bar | **NO** | `items-W11-W19.md:12` still reads "Three of those — W14, W15, W16 — did the fencing by prescribing vocabulary". W14's law text (`tables-13.as-run.txt`) has no spelling list; its rows are 3 C / 1 M / 6 SPLIT / 1 STRUCK. The framing claim is false. |
| 4 | W11b / W12d / W14-gateduty / W15-land added grounds | **NO** | all four clauses present verbatim (`:21`, `:32`, `:58`, `:72`), none prefixed `[archivist's reading]`. |
| 5 | W13's third clause ("a breach the rewrite cures") has no row | **NO** | `grep "rewrite cures"` = 0 hits in items; 1 hit in the law text. |
| 6 | W11c absent from THE STRIKES MOST LIKELY TO BE WRONG | **NO** | closing section still names five (W15-gen, W12b, W13e, W14-gateduty, W12d). This seat's finding is that W11c is a REVERSE, so the omission mattered. |
