# TAIL-NARRATIVE · hand-back (the group NARRATIVE: the told history, origin prose and the narrative tables)

Seat: TAIL-NARRATIVE, a builder seat of the 2026-11-14 integration program. Branch `lane/tail-narrative-2026-11-14`, cut from the joined line `lane/join-2026-11-14` at **f663a2699** (read back from origin at the start). Worklist: `docs/chair/2026-11-14/read-all/WORKLIST-NARRATIVE.{md,json}` on `lane/chair-2026-11-08` (120 rows, read at e5b421802).

## The rulings worked to (the chair's, 2026-11-14; each vetoable by the owner)

- (N1) The cure of two founders on one page (r2-code-a) is the form: a row admitted only where the record agrees; a twin in the same slot; no draw moved.
- (N2) A political or historical flavour line that names a thing (priests, guilds, a court, a harbour) needs it in the town: declarations; one that states a present state needs the state.
- BRIEF-TAIL's laws: silence is true (over twenty towns told first); a state left mute takes a twin; no draw moved; under a siege nothing comes in or goes out; under a famine no line offers the food that failed; a slot is not the subject of a verb it does not agree with; one home for one fact; no new vocabulary word without the chair; nothing under `src/pdf/` or `src/foundry/`.

## At the base

The before census (CENSUS-3's one command at f663a2699, 720 towns): 29,876 distinct sentences. Five rows GONE AT THE BASE (their fold prints nowhere): 15361 (TERRAIN_NARRATIVE_HOOKS.river, mill rights), 15332 (FOUNDING_REASON_ADMITS, the sheep run), 00649, 00648, 00651 (STRESS_DESCS.religious_conversion, "two burial grounds"). Two rows no longer print in the town they were read in (20989, 21705, the merchant district: R2-CODE-A-14's cure); they still print elsewhere and are read in their batch.

## Batch 1 — `src/generators/narrativeText.js` (PRESSURE_SENTENCES, POLITICAL_FLAVOR, famineFoodIsPower) and the pressure detail's flags (`narrativeGenerator.js :: genPressureDetail`)

43 rows (all four HIGH rows of the group). Verified by script over the before census's records (`factsOf` on each printing town; the page dumps for the page's own other lines). Census before f663a2699, after at the batch's tree: 29,876 -> 29,892 sentences; gone 41, new 57, fewer 12, more 8.

CURED (29 rows; towns printing before -> after; the measure is the false towns before):
- HIGH 00053 catastrophic[7] "nobody expects it" under the siege it names: 12 -> 10 (measure 1). The row declares `excludes: crisis: under_siege, crisis: plague_onset` (a refused row moves to the pool's admitted argmax, draw-free). Silenced TRUE in 1 town (r2s-plague_onset-city-1, a Siege 48 years ago).
- HIGH B00096 stable[8] "Little has happened here" beside a major event: 4 -> 0 (4). Branch inside the closure: "Apart from the <event>, little has happened here …".
- HIGH 20438, 20439 monster_pressure[1] "defences … the last muster" with no force: 3 -> 2, 1 -> 0 (2). `needs: guardPresence`; the slot resolves to the next admitted row.
- 00338 politically_fractured[1] "Three powers": 11 -> 2 (9); 01722, 01760, 01720, B01841 [2] "all three powers": all gone (7). "Three" only where the record holds three; elsewhere "The powers of <N> are each waiting for …" / "every power here".
- 00172 monster_pressure[2] "Three farmsteads … the authorities" in a thorp: 8 -> 7 (3 thorps out; 2 hamlets in by inheritance). `needs: tier: ≥ hamlet`.
- 00014 religious_heavy[2] "the local clergy" over a wayside shrine: 7 -> 5 (2). `needs: church` (was `sacredHouse`).
- B00101 stable[7] "Nothing has ever forced this place to change" beside major events: 7 -> 0 (7). Branch: "It came through the <a> and the <b> without losing …".
- 01333 indebted[4] "paints its civic buildings" with no hall: 5 -> 2 (2; and village-1, whose only hall is an adventurers' charter hall). Twin "still keeps up its appearances …" (genPressureDetail's hasCivicHall, by catalog id: town_hall, city_hall, courthouse, multiple_courthouses, multiple_court_buildings).
- 00138 stable[5] "made its name in trade" with no exports: 4 -> 3, and its sister folds (Great Harvest Compact 2 -> 1, Shortage 4 -> 3; false there too). `needs: exports`. Silenced TRUE in 4 towns: the row's other branch "Records here are kept carefully …" 26 -> 22.
- 11487, B10954 insurgency(street)[2] "the men <gov> sends to enforce" with no force: 4 -> 1, 1 -> 0, and "Headman's Authority" 2 -> 1 (4). Twin: "the dues go unpaid … has no one to send who would be obeyed" (hasForce = factsOf's guardPresence).
- 20366 indebted[3] "a warehouse here" with none: 4 -> 1 (3). Twin "(a field here, a right of way there)" (hasWarehouse by catalog id: warehouse_district, merchant_warehouses).
- 07115, 10848, 07638 insurgency(street)[0] "the first power leader": gone (reworded, all towns): "whoever first offers something better".
- 00010 magical_heavy[2] "the practitioners who work here" beside "No arcane practitioners on the rolls" (3 of 3): gone; reworded "… is still discussed here, carefully."
- 20149 insurgency(institutional)[0] "its own officials: taxes held back" in a thorp: gone (1). Thorp/hamlet branch "comes from inside: dues held back, decisions left unmade, a few households drawing together".
- 11478 slave_revolt[3] "the timber that made it worth holding" (no timber on the record): gone; reworded "what made it worth holding".
- 00708 monster_pressure[3] "a mill standing idle" where the trade record sells the mill's flour: gone (1). In-slot "a mill kept turning for its buyers" (millExports).
- 01079 wartime(winning)[2] "is prospering" at Moderate: gone (1). `needs: garrison, prosperity: ≥ comfortable`.
- 03831 indebted[1] one power in both slots "a distinction": gone (1). Branch "<P> took the loans and is now repaying them, and nobody here has forgotten whose decision the borrowing was."
- B17142 famine "at least three powers are fighting" with one quarrel: gone; reworded "its strongest powers are fighting".
- B04491, B04486 mass_migration(weak)[2] "nor keep them fed" at Secure: gone; reworded "nor find them all work".

STRUCK (10, true by the record):
- 15395 stable[6] "Outsiders see a busy market" (18): a market stands in every town (`needs: market`); none under a siege; the famine's own line says the market still opens.
- B19424 "defences built for quieter years" at a fortress: the line says the threat outgrew the defences; the record's crisis is the monster pressure; walls and garrison stand.
- B06988 succession_void[2] "the seat is empty": the page's own governance line reads "The seat stands empty … Acting <X> keeps the seat meanwhile".
- 22166 succession_void[5] the merchants: a market stands in all three (`needs: market`, R2-CODE-A-6's form).
- 21222, 21223, 21220 insurgency(institutional)[2] "means to inherit … rather than take it by force": each town's crisis record reads "Its people stall, its taxes go unpaid, and it waits."
- 18099, 18092 famine "Since the herds/fishing failed": the line reads the food record's own failed source; the exports that contradict it are the trade writer's (NAMED below).
- B19088 "<X>, the Household Elder": the record's role for that person is "Household Elder" (the readers' PEOPLE line gave the first title only).
- 00980 "the crown is paying" under a Democratic assembly: the same page's war vignette says "the crown pays its bills" (the town is not a city-state).

PARKED (3, measure kept):
- B00015 catastrophic[5] "it stood here before" (38 print; false in 1, r2s-recently_betrayed-hamlet-2: the Siege in the founding year). The closure sees the events, not the town's age (`historyCoherence.js :: flavorOf` hands it the subset only): NAMED for the file that holds that draw site, or for the events' writer (11 of 3,738 events fall in the founding year).
- 20302 religious_conversion[2] "accepted within the week … nobody asking": false in 4 of 7, where the same page's conversion vignette (`governingStressVignettes.js :: buildReligiousConversionNarrative`, chosen by the governing name's length) says the split is open or the new faith has no building. NAMED for that file's group: the vignette's variant as a leaf both lines read.
- B00042 political_heavy[3] "Authority here has a provisional quality" in a Stable, Approved metropolis (1): the vocabulary has no legitimacy or stability word. Told to the chair.

THE LINES NEW OR REWORDED (the veto list; read where they print in the after census):
- "Apart from the <event>, little has happened here worth writing down, and the people here are proud of it …" (r2r-thorp-9, the Uprising).
- "It came through the <a> and the <b> without losing its options, its neighbours or its temper, and the people here count all three as achievements" (r2r-hamlet-8, r2r-hamlet-2: one event).
- "The powers of <N> are each waiting for one of the others to slip / for the other to slip, …" (r2r-city-7; r2s-politically_fractured-hamlet-3; r2s-politically_fractured-metropolis-2, six powers).
- "<X> is the only person every power here will still speak to, …" (r2s-politically_fractured-thorp-2, village-0, metropolis-2).
- "<N> still keeps up its appearances and still held its festival, all on borrowed money; …" (r2r-hamlet-33, village-52, village-1).
- "The creditor has begun taking payment from <N> in things other than coin (a field here, a right of way there), …" (r2r-hamlet-38, r2s-indebted-thorp-3, village-1).
- "In <N> the dues go unpaid and the summons go unanswered, and <gov> has no one to send who would be obeyed. …" (r2r-thorp-22, thorp-29, village-26, r2s-insurgency-hamlet-1).
- "… but its orders go unanswered, and whoever first offers something better will find people ready to follow." (r2r-thorp-25, r2r-village-29, r2s-insurgency-town-2).
- "The challenge to <gov> in <N> comes from inside: dues held back, decisions left unmade, a few households drawing together. …" (r2s-insurgency-thorp-3).
- "… cannot retake it without destroying what made it worth holding." (r2s-slave_revolt-thorp-1).
- "<N> has drawn its edges inward (fields left unworked, a mill kept turning for its buyers) …" (r2s-monster_pressure-village-3).
- "<P> took the loans and is now repaying them, and nobody here has forgotten whose decision the borrowing was." (r2s-indebted-metropolis-0, thorp-1, city-3).
- "Since the <source> failed, whoever holds the food in <N> holds the power, and its strongest powers are fighting over the stores." (r2s-famine-town-1).
- "By <gov>, which can neither turn people away nor find them all work, …" (r2r-city-37, city-3, metropolis-25, r2s-mass_migration-thorp-1).
- "<event> is still discussed here, carefully. The details are not shared with outsiders, …" (r2r-hamlet-1, thorp-59, town-55).
- INHERITED, read: "Three farmsteads have been abandoned …" now in two hamlets (r2r-hamlet-36, r2s-monster_pressure-hamlet-3: the monster_pressure[1] refusals); "The bounty <gov> posted for the creature …" in three thorps (the farmstead refusals); "<event> split the faith here; its house of worship survived …" (r2r-hamlet-4); "<event> left the buildings standing and changed everything else …" (r2s-under_siege-town-2, the Siege 145 years ago). All true where read.

DECLARED MOVE: none (no record field moved; `pressureSentence` and `history.historicalCharacter` are the page's prose, the draws unmoved: every cure is a declaration resolved draw-free, a branch inside the drawn row, or a reword).
GUARD: `tests/generators/tailNarrativeRows.test.js` B1: 22 cured pairs red at the base (22 of 22), 9 KEEP pairs green before and after; a plant (hasForce always false) reds the KEEP side. Pins re-keyed by identity: `famineFrameStore.test.js` (the famine row reworded); `census2dTables.test.js` declaring 21 -> 23; `census2eTables.test.js` religious_heavy[2] writes `church`. Ledgers: `docs/census/declarations/PRESSURE_SENTENCES.json` (monster_pressure[1], [2], [3]'s text, wartime(winning)[2]) and `POLITICAL_FLAVOR.json` (catastrophic[7], stable[5]).
GATES: eslint 0; typecheck:domain:strict 1113/1113; typecheck:ratchet 167/167; page-census --grid identical to the base (2 falls, none rising); presumed-things walker fresh 147 = the base's 147 (one count line gone; one mill quasi re-keyed on a row that declares its mill), stale rows 0 -> 2 (clergy cc79cf804fe5ed09, practitioner fa104bd22874f27f: a register left stale, NAMED, not shrunk). The test files that name the touched files: 6 red, the same 6 (8 tests) red at the base, CARRIED: worldFactRederive, economicHistoryRecent, rosterFinalUnderHeldRoster, proseWiringCensus.walker (3), espionageDormancyFence, generatorGoldenMaster.

NAMED FOR OTHER LANES: the trade writer (exports of the good a famine failed: 18099 livestock, 18092 fish, in the same towns); `historyCoherence.js` / the events' writer (B00015); `governingStressVignettes.js` (20302).

