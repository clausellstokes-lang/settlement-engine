# BAR2-PLACES · hand-back (2026-11-15)

Seat BAR2-PLACES (groups HOUSES, HISTORY, NARRATIVE, CRISIS of REVIEW-BAR-2). Base: the joined line `lane/join-2026-11-14` at **f8042b61a** (read back from origin at the start; not yet closed: its test bookkeeping lands on other branches). Branch: `lane/bar2-places-2026-11-15`, cut from f8042b61a. Work in a scratch worktree (detached, pushed by explicit refspec: the branch name is checked out in the repository's main checkout, which was not touched).

## The rulings worked to (the chair's, 2026-11-15; each vetoable by the owner)

- **(PL1)** a line that presumes a house, a size or a good the town lacks takes a declaration, or is reworded to claim no more than every printing town bears.
- **(PL2)** the origin lines: no age in years for the road; no "generations"; the mill admitted by the houses; the road and not the living.
- **(PL3)** the mayor's title: by M-1b a hall's head named by the hall's title is not a fault: strike; the form by the holder's sex is BAR2-SERVICES's (the Connection line).
- **(PL4)** the size word through the tier's own leaf; the craft count by one home; the syndicate admitted by the power's standing; the merchant power by the powers; no gate presumed.
- **(PL5)** verify, and expect to strike: the charcoal kilns, the maltster, the covert grain secret.
- **(PL6)** ONE FACT for how the war goes for the town; the conscription line admitted by the labour fact; the famine's order and patrol admitted by the forces.

## Batch 1 (one commit): the four groups' data and prose rows

Measured on the census's 720 at the base (record fields and `before.json`): towns that print the old line / towns where the record makes it false.

### Cured (by id)

| id | writer | prints / false at base | cure |
|---|---|---|---|
| C29731, C30771 | settlementOriginProse.js :: ORIGIN_POOLS.road[4] | 104 / 67 (town 150+ years old under "a road a century old") | reworded: "…; a road that old is not soon abandoned." (no age in years) |
| C24150 | ORIGIN_POOLS.road[1] | 56 / 4 (age under 60: 31, 37, 44, 51) | reworded: "…and its news has always come on somebody else's cart." |
| C25604 | ORIGIN_POOLS.road[3] | 18 / 18 (no income from travellers in any) | reworded to claim the road and the meal: "A road settlement: other people's journeys pass its doors, and some of them stop for a meal on the way." (its admits kept: a tavern, no siege, not a city) |
| C14951 | ORIGIN_POOLS.river[4] | 31 / 9 (no grain mill) | reworded, no mill and no cause: "Built on the river: it gives the place its water, and carries what the fields produce, as it always has." + its class: river rows 1 and 4 (the water carrying trade now) refused under a siege (`ORIGIN_ROW_ADMITS.river`), as the road's and crossroads' are; rows 0, 2, 3 admitted, so no state is mute |
| C26954 | cultureProfiles.js :: slavic foodways | 64 / 64 (no oven house: the vocabulary names none) | "Fermentation, pickling, and drying stretch the harvest through winter." + class: arrivalProse slavic "Smoke rises from a household oven, and a neighbour stops in to share its warmth." (21). The slavic socialTexture "Shared ovens, bathhouses, wells…" (27) is LEFT: its reword is a fresh literal the presumed-things walker cannot bank (the door banks only base literals); for the chair |
| C25910 | cultureProfiles.js :: latin foodways | 32 / 32 | "Market vendors and shared dining customs make food distribution visibly civic." (needs market, kept) |
| C14917 | arrivalProse.js :: ARRIVAL_PEOPLE.greek | 20 | "…loudly enough for the neighbours to stop and listen." (no crowd) |
| C23710 | ARRIVAL_TENSIONS.prosperous | 14 | "Well-fed children run errands from door to door." (no busy street) |
| C10029 | ARRIVAL_SENSES stone.dominant | 5 | "Laden carts from the workings grind along the road in a line that never seems to end." (no ore; the siege exclusion kept) |
| C34242 | ARRIVAL_SENSES timber.lines | 2 | "Curls of shavings and chips of bark blow across the lane." (no carpenter) |
| C15795 | institutionDescVariants.js / institutionDescColour.js / institutionalCatalog.js :: Thieves' guild (powerful) | 45 (6 + 21 + 18) / nearly all (the guild Minor, Suppressed or not a power; Dominant in none) | all three texts claim no ruling or dominant standing: "The criminal syndicate the city has never rooted out, for fear that open gang war would be worse." / "An underworld power the city has never rooted out, the alternative being the bloodshed of rival gangs." / canonical "A criminal syndicate the city has never rooted out, for fear of the gang war that would follow." |
| C0434 | the same three files :: Merchant guilds (15-40) | 107 (33 + 32 + 42) | no "power": "Between them they handle much of the city's trade." / "Much of the city's trade is in their hands." / canonical "They handle much of the city's trade." **A reword over 20 towns (107): told to the chair; it silences no town's slot (each prints the weaker claim).** |
| C34394 | institutionalCatalog.js :: Smuggling waypoint | 6 / 6 (villages) | the village takes its own desc (the tier's own entry): "…The village benefits from fees paid in kind." |
| C27929 | institutionalCatalog.js :: Parish burial grounds (town) | 41 | "Each congregation keeps its own burial ground, and one that has filled its ground buries beyond the town's edge instead." (no gate; the walker's religious-houses row for this literal leaves by its shrink) |
| C5821, C10035 | stressNarrative.js :: WARTIME_VARIANTS; narrativeText.js :: PRESSURE_SENTENCES.wartime | 33 wartime towns / 4 disagreed | ONE FACT: `stressNarrative.js :: wartimeGoesWell(stress)` reads the crisis summary's side (its coin and refusals); the Overview's pressure line takes the right-side or the loss pool by it (the compound scores only where no summary stands). No draw moves (the pressure keeps its one pick; the summary keeps its coin). |
| C5767 | narrativeText.js :: wartime loss[0] | 7 | "Conscription has taken some of its skilled hands." (no hollowed-out workforce beside Labor Adequate) |

### Struck (by id, with why)

- **C13357** (charcoal kilns "whenever wood can be had"): PL5: the line states its own condition; true as written; the missing shortage mark is BAR2-SERVICES's.
- **C13894** (maltster "It needs grain to spare before it can work at all."): PL5: states its own condition; true as written.
- **C5063** (secret: grain through a covert route under a siege): PL5: a secret's own fiction (the route is covert).
- **C26642, C6173, C25669** (Connection: Captain-Mayor / Lord Mayor / Mayor): PL3 and M-1b: a hall's head named by the hall's title is not a fault.

### Named for other seats

- **C2149** ("Lord Mayor" for a woman): the Connection line and the office title (`officeTitles.js`) are BAR2-SERVICES's: the form by the holder's sex.
- **C2828** ("Population of 2,338 with only 1 craft institution."): the writer is `src/generators/economy/viability.js` (the tracer placed it on geographyData.js): the count should read the roster's craft houses by one home (`domain/capacityModel.js`'s craft reading); for the seat holding viability.js.
- **C28756** ("War has taken the iron…" with no war): the declaration already refuses `war: peace` (`outlookHookSiblings.js`); it prints where the record's war state is not peace (an occupation): the fault is the war-state fact or the site (`foodBalance.js`), not this seat's file.
- **C3297**: parked at batch 1 (no atom); cured in batch 2.

### Parked (at batch 1; cured in batch 2)

- C3297, C34238, C34241: the atoms they lacked were granted by the chair (VW2); see batch 2.

## Batch 2 (one commit): the chair's grant VW2, two atoms, and the three parked rows

THE CHAIR'S GRANT VW2 (2026-11-15, vetoable by the owner; NEW VOCABULARY, on the veto list): declare the two atoms the parked rows lack, in the vocabulary's own form, homed with their getters.

- **`patrol`** (factVocabulary.js, homed on the defence record: `defence.watch || defence.garrison`). THE RULING'S PREMISE MEASURED AND NOT FOLLOWED IN ONE PART: the chair wrote "a watch, a garrison or a militia"; the reader's town (bar0-village-famine-rand-5) holds a militia alone, and its own guard reading says "The citizen militia musters when needed but cannot maintain consistent patrol": with the militia in it the atom would admit the false line. So a militia is not a patrol. Reuse first: `guardPresence` (watch ∨ garrison ∨ militia ∨ hired company) is the wider composite, and is the reason the row printed. Homed on `defence` (no getter of its own: the layer register is shrink-only and the defence object is its bundled leaf); the defence walker is taught it by the words of its two parts (`tests/lint/defenceFactReaders.shared.mjs`: `watch`, `garrison`, so it reads nothing new).
- **`iron at hand`** (factVocabulary.js; getter `factsOf.ironAtHand`; home `src/domain/facts/ironAtHand.js`, new; layer 2 in factLayers.js). True where a chain works `iron_deposits` here (its input held and its state working, the states of `chainWorking.js`, spelled in the leaf because that leaf rides a lazy chunk); else where iron is imported, unless a siege is in force (`crisisOf`, the same reading `tradeStoppedHere` uses); else false. Reuse first: `institution: smith` says a smith stands, not that iron reaches it; the crisis leaf says a siege stops trade, not whether the iron is local. Measured on the 720 at f8042b61a: all seven towns that print the blades line have iron at hand (local or imported, none under a siege).

| id | writer | cure | read in |
|---|---|---|---|
| C3297 | arrivalProse.js :: ARRIVAL_SENSES arms.dominant | "…the sound of blades being made." needs `iron at hand`; its TWIN where the iron is not at hand: "The forges of {n} stand cold: there is no iron left to make blades from." (the slot keeps its draw) | bar0-city-under_siege+famine-rand-5 prints the twin; r2r-town-59 (local iron) and r2r-metropolis-41 (imported, no siege) keep the original |
| C34238, C34241 | narrativeData.js :: STRESS_DESCS.famine[3] | needs `patrol` (was `guardPresence`); its TWIN where no force keeps patrol, placed at the pool's end so no ledger index moves: "{n} is quiet in the way a hungry settlement is quiet. The rationing markers are painted on the doors, and people keep to their own thresholds." | bar0-village-famine-rand-5 prints the twin, and its other arrival beats are unchanged (measured at base and tip: without the twin a redraw had moved its sense beat); r2r-city-44 and r2s-famine-town-2 (a garrison) keep the original |

Veto list (new lines): the two twins above, and the two atoms.

Re-keyed by identity: `tests/domain/facts/textOf.test.js` (the arrival's object rows 133 → 134: the blades twin), `tests/domain/facts/census2dTables.test.js` (PARKED: famine[3] declares `patrol`).

## Every new or changed line (the veto list), with three towns it is read in (smallest; largest; a crisis)

| line | smallest | largest | crisis |
|---|---|---|---|
| road[1] "…its news has always come on somebody else's cart." | r2r-thorp-10 | r2s-mass_migration-metropolis-1 | r2s-famine-thorp-2 |
| road[4] "…a road that old is not soon abandoned." | r2r-thorp-5 | r2s-religious_conversion-metropolis-3 | r2r-thorp-58 (siege) |
| road[3] "…journeys pass its doors, and some of them stop for a meal on the way." | r2r-hamlet-32 | r2s-religious_conversion-town-2 | r2s-famine-village-2 |
| river[4] "Built on the river: it gives the place its water, and carries what the fields produce, as it always has." | r2r-thorp-1 | r2s-succession_void-metropolis-0 | r2r-thorp-1 (occupied) |
| latin foodways "Market vendors and shared dining customs…" | r2r-hamlet-11 | r2s-mass_migration-metropolis-2 | r2s-occupied-town-0 |
| slavic foodways "Fermentation, pickling, and drying…" | r2r-thorp-10 | r2s-wartime-metropolis-1 | r2r-thorp-40 (occupied) |
| arrival slavic "Smoke rises from a household oven, and a neighbour stops in to share its warmth." | r2r-thorp-10 | r2s-recently_betrayed-metropolis-3 | r2s-under_siege-hamlet-1 |
| arrival greek "…for the neighbours to stop and listen." | r2s-under_siege-thorp-2 | r2s-succession_void-metropolis-1 | r2s-under_siege-thorp-2 |
| arrival prosperous "Well-fed children run errands from door to door." | r2r-thorp-49 | r2r-metropolis-55 | (none prints it under a crisis at the base) |
| arrival stone "Laden carts from the workings…" | r2r-hamlet-6 | r2r-city-30 | r2r-hamlet-32 (indebted) |
| arrival timber "Curls of shavings and chips of bark blow across the lane." | r2r-thorp-41 | r2s-recently_betrayed-village-0 | r2r-thorp-41 (plague) |
| thieves' guild ×3 (above) | r2r-metropolis-30 / -5 / -4 | r2s-slave_revolt-metropolis-3 | r2s-occupied-metropolis-0; r2s-famine-metropolis-1 |
| merchant guilds ×3 (above) | r2r-city-1 / -2 / -0 | r2s-mass_migration-city-3 | r2s-under_siege-city-1; r2s-under_siege-city-0 |
| smuggling (village) "…The village benefits from fees paid in kind." | r2r-village-4 | r2s-mass_migration-village-2 | r2r-village-53 (fractured) |
| parish burial "Each congregation keeps its own burial ground, … beyond the town's edge instead." | r2r-town-9 | r2s-mass_migration-town-3 | r2s-under_siege-town-3 |
| wartime loss "Conscription has taken some of its skilled hands." | r2r-thorp-55 | r2s-wartime-town-3 | r2r-thorp-55 (wartime) |

## The guard

`tests/generators/bar2PlacesRows.test.js`: 20 CURED pairs (each red at f8042b61a), 1 KEEP pair (green at both), and the war's agreement over five wartime towns (4 of 5 red at the base). Green at the tip.

Re-keyed by identity beside a dated note (the same files' own form): `tailNarrativeRows.test.js` (two origin rows' replacement text), `arrivalIndebtedDistrictTwin.test.js` (the oven line's slot), `wartimeForgesSmith.test.js` (the arm's live towns: presume-town-25 now tells the loss; presume-town-655, -743, -975 measured to reach the twin), the census declaration ledgers `docs/census/declarations/{ARRIVAL_PEOPLE,ARRIVAL_SENSES,ARRIVAL_TENSIONS,CULTURE_PROFILES_DAILY,institutionDescVariants.INSTITUTION_DESC_VARIANTS}.json` (texts), `tests/lint/presumedThings.widened.register.json` (2 rows shrunk by its door: the carpenter's bench and the burial literal).

Gates at the tip: strict-domain 0, type ratchet 0, eslint on the touched files 0, presumed-things `--check` fresh 0 stale 0, the twelve-birth grid 0 falls. The test files naming the touched files (191 run): 14 files red at the tip are red at the base too (carried from the line's close, classed at F2 after the merge word); the 5 tip-only reds were mine and are cured (ledger drift ×2, the walker, the forges anchor) or load (moneyChangersTownFloor timed out under the census; green alone).

## The after-run (batches 1 and 2 together, at 166bb4160; the census's 720 against f8042b61a)

ONE after-run measured both batches: the first after-run of batch 1 alone died at 427 of 720 dumps when its shell ended (unattended `nohup`), so it was re-run once over the final tree. `inventory_diff.py before.json after.json <the four worklists' 30 rows>`, read whole: 29,967 sentences → 29,965; gone 25, new 23, in fewer towns 2, in more towns 6.

- THE ROWS: 17 GONE (C27929 41→0, C15795 6→0, C34394 6→0, C0434 33→0, C26954 64→0, C25910 32→0, C14917 20→0, C23710 14→0, C10029 5→0, C34242 2→0, C29731/C30771 104→0, C24150 56→0, C14951 31→0, C25604 18→0, C5767 7→0; C25669 0→0, read in no census town); 1 FEWER (C10035 2→1: the town left prints the right side beside a profit summary: true by the one fact); 12 UNCHANGED, each by design: struck (C13357, C13894, C5063, C26642, C6173, C25669's kin), named for another seat (C2149, C2828, C28756), true where it prints (C5821 4: every one beside a right-side Overview now; C3297 7: all seven have iron at hand; C34238/C34241 2: both towns hold a garrison).
- THE WAR, ONE FACT: of the 33 wartime towns, the Overview and the crisis summary now agree in 33 (29 loss, 4 profit); at the base 4 disagreed. The late re-read risk did not occur in the 720.
- EVERY OTHER LINE IN FEWER TOWNS, explained: "Founded on the bank, where the current does the hauling; …" 28→27 (the river row refused under a siege, r2s-under_siege-village-3: false there; it takes "A river settlement. The channel sets the calendar …", 21→22); "<N> is at war and, for now, on the right side of it …" 2→1 (above). The wartime loss lines 7→8 and 3→4 are the two towns whose Overview now tells the loss their crisis summary tells (r2s-wartime-metropolis-1, -3).
- THE INHERITORS (30, widest read where they print): the rewordings themselves (each in exactly the towns its old line left: 104, 64, 56, 42, 41, 33, 32, 32, 31, 21, 21, 20, 18, 18, 14, 8, 6, 6, 5, 2), the river twin (1) and the wartime loss lines (1 each). None new beyond the veto list.

## The books my cures move

THE REFERENCE CONFIGURATIONS (measured before the merge, so the count is my cures' alone: every record of `tests/helpers/goldenMasterCorpus.js :: goldenCorpus` hashed whole and by top-level field at f8042b61a and at 5cf49f6bd): **334 of the 525 move** (thorp 29, hamlet 29, village 29, town 100, city 84, metropolis 63). By field family: `institutions` 237 (the house descriptions), `settlementReason` 153 (the origin rows), `culturalIdentity` 84 and `economicState` 84 (the foodways line), `arrivalScene` 10. No other field moves in any of the 525: no draw moved. `pressureSentence` and `stress` move in none (the corpus holds no wartime).

THE MERGE: the joined line at **dcb069bff** (the chair's word, 16:21 UTC; confirmed as origin's tip) merged into this branch, one merge commit **cac624100**, no conflict (git auto-merged `tests/lint/presumedThings.widened.register.json`; the walker is green over it).

THE REFERENCE CONFIGURATIONS AT THE MERGED TIP (each record hashed at dcb069bff and at cac624100): **334 of the 525 move**, the same rows and families as before the merge: `institutions` 237, `settlementReason` 153, `culturalIdentity` 84, `economicState` 84, `arrivalScene` 10. No other field moves in any of them, so no draw moved.

F2 AT THE MERGED TIP. Ran alone through `sh scripts/gate-tail.sh`, one run of 287 files: every test file naming a file I touched (counted against dcb069bff) plus the brief's seventeen law suites. 280 pass. **7 files with 10 red arms, ALL GREEN AT dcb069bff (the same 7 files run there alone: 139 of 139), so all are mine. EVERY ONE IS A STORED FIGURE moved by the declared cures (an output-identity golden or a committed register); NO LAW IS RED.** The three owner's-door files the chair named are not among them and were not touched.

| test :: arm | old → new | the door its header names |
|---|---|---|
| `tests/property/generatorGoldenMaster.test.js` :: every config produces byte-identical output | 0 → 334 of 525 rows drift (the families above) | `UPDATE_GOLDEN=1` through `tests/helpers/goldenRecordDoor.js` (a shift-record row in its header) |
| `tests/generators/pipelinePinnedMode.test.js` :: EM-P0 A1, EM-B2a2 A2, EM-R1b A5 (three arms) | 0 → 25 of its 41 golden rows each | none of its own: it reads the golden manifest; green again when the golden is re-taken |
| `tests/generators/rosterFinalUnderHeldRoster.test.js` :: EM-R2 A1 | 0 → 25 golden rows | the same: it reads the golden manifest |
| `tests/generators/generationForkCensus.test.js` :: EM-P2 A1 (the control row) | the row `7ae632298ed9…` → `310a10e77a01…` | the same: its control row is a golden manifest row |
| `tests/domain/worldFactRederive.test.js` :: EM-B2b A7 (the goldens' byte-identity stride) | 0 → 3 | the same: it reads both golden fixtures |
| `tests/property/espionageDormancyFence.test.js` :: FENCE 1, THE DRIVEN GOLDEN (360 settlements) | `PRE_COUPLING_CORPUS_SHA` `d4f94b04…` → `031d625b…` | its header: re-recorded ONLY inside a named chartered window (the LIGHTING WAVE, §881.4), through `goldenRecordDoor`. **Its own text calls a move a STOP, not a re-record: for the chair and the owner.** |
| `tests/lint/proseWiringCensus.walker.test.js` :: car 0 (the committed census is byte-identical) and SEAM car 5b (the dry read) | the committed JSON is "stale-bytes" | `scripts/wiring-census.mjs` (the census's own writer, run by the close's doors' seat) |

None of these is re-taken here. A plant was not needed: each arm is red at the tip and green at dcb069bff.
## The hand-back's state (2026-11-15, after F2)

Handed back by count: my meter read 407,328 tokens at 16:24 UTC, past the 250,000 line; F2 was finished first because the hand-back needs it.
- **Left, not started: C3396** ("exploits it: <a person>" printed with no rank; the labels seat named it to me; writer `src/domain/crisis/crisisCast.js`, the `exploiter` role, mine by the CRISIS worklist). Its first act for the next seat: verify on the 720 (`runs/after` corpus at 166bb4160, or a fresh census at this tip), then cure at the writer or strike with the measure.
- "The table rests on salted fish." (`foodways.js`): false in 0 of the 720 per the labels seat; parked as the food record's. Nothing for this seat.
- The slavic socialTexture "Shared ovens, bathhouses, wells…" (27 towns): left (above); its reword is a fresh literal the presumed-things door cannot bank. For the chair.

## Residual risks

- The wartime summary is re-read late in assembly (`assembleSettlement.js` line ~456, after the pressure sentence at ~404): a summary that flips side at the late re-read would again disagree with the pressure line. Not this seat's file; the after-run measures it.

## Instruments

`git archive origin/lane/chair-2026-11-08 docs/chair/2026-11-14/probes/READ-ALL` and `origin/lane/census-3-2026-11-14 docs/chair/2026-11-14/probes/CENSUS-3` into the scratchpad; `census3.sh <wt> <out> 4`; `inventory.py <out> before.json`.
