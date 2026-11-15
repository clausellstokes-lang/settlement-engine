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
- "<N> has drawn its edges inward (fields left unworked, a mill kept turning for its buyers) …" (r2s-monster_pressure-village-3, r2s-monster_pressure-metropolis-0: both sell flour). CORRECTION: batch 1's after census was born before this twin took its final words (it printed "the outlying tracks closed" there); the committed tree prints "a mill kept turning for its buyers" in the same two towns (births at b52481302: `pressureSentence` differs in exactly those two), and FA's census reads it.
- "<P> took the loans and is now repaying them, and nobody here has forgotten whose decision the borrowing was." (r2s-indebted-metropolis-0, thorp-1, city-3).
- "Since the <source> failed, whoever holds the food in <N> holds the power, and its strongest powers are fighting over the stores." (r2s-famine-town-1).
- "By <gov>, which can neither turn people away nor find them all work, …" (r2r-city-37, city-3, metropolis-25, r2s-mass_migration-thorp-1).
- "<event> is still discussed here, carefully. The details are not shared with outsiders, …" (r2r-hamlet-1, thorp-59, town-55).
- INHERITED, read: "Three farmsteads have been abandoned …" now in two hamlets (r2r-hamlet-36, r2s-monster_pressure-hamlet-3: the monster_pressure[1] refusals); "The bounty <gov> posted for the creature …" in three thorps (the farmstead refusals); "<event> split the faith here; its house of worship survived …" (r2r-hamlet-4); "<event> left the buildings standing and changed everything else …" (r2s-under_siege-town-2, the Siege 145 years ago). All true where read.

DECLARED MOVE: none (no record field moved; `pressureSentence` and `history.historicalCharacter` are the page's prose, the draws unmoved: every cure is a declaration resolved draw-free, a branch inside the drawn row, or a reword).
GUARD: `tests/generators/tailNarrativeRows.test.js` B1: 22 cured pairs red at the base (22 of 22), 9 KEEP pairs green before and after; a plant (hasForce always false) reds the KEEP side. Pins re-keyed by identity: `famineFrameStore.test.js` (the famine row reworded); `census2dTables.test.js` declaring 21 -> 23; `census2eTables.test.js` religious_heavy[2] writes `church`. Ledgers: `docs/census/declarations/PRESSURE_SENTENCES.json` (monster_pressure[1], [2], [3]'s text, wartime(winning)[2]) and `POLITICAL_FLAVOR.json` (catastrophic[7], stable[5]).
GATES: eslint 0; typecheck:domain:strict 1113/1113; typecheck:ratchet 167/167; page-census --grid identical to the base (2 falls, none rising); presumed-things walker fresh 147 = the base's 147 (one count line gone; one mill quasi re-keyed on a row that declares its mill), stale rows 0 -> 2 (clergy cc79cf804fe5ed09, practitioner fa104bd22874f27f: a register left stale, NAMED, not shrunk). The test files that name the touched files: 6 red, the same 6 (8 tests) red at the base, CARRIED: worldFactRederive, economicHistoryRecent, rosterFinalUnderHeldRoster, proseWiringCensus.walker (3), espionageDormancyFence, generatorGoldenMaster.

NAMED FOR OTHER LANES: the trade writer (exports of the good a famine failed: 18099 livestock, 18092 fish, in the same towns); `historyCoherence.js` / the events' writer (B00015); `governingStressVignettes.js` (20302).

## Batch FA — `src/generators/narrative/foundingRowAdmits.js` (the chair's ruling (N3), placed first; RECORD-MEASURE-1 class a)

(N3), copied: A FOUNDER AND AN ORIGIN ROW THAT CANNOT BOTH BE: 154 of 720 towns at the joined line; the Origin row names a GROUP that began the place (herders, fishers, a military post, a religious settlement, a fair's traders) and the founder is not of that kind. FA: the agent rows join `oneFounderRow` with a kind table; a row whose agent the founder cannot be resolves draw-free onward to a row that agrees. THE MEASURE: `history.founding.reason` ONLY moves, in 154 towns; the class 154 to 0; 48 towns land on no Origin row (silence accepted; listed for new rows later); any other field moving is a STOP. (N4): FA's pin re-keyed by identity; the golden NAMED, not re-taken.

The patch (`docs/chair/2026-11-14/probes/RECORD-MEASURE-1/fa.patch` on `lane/record-measure-2026-11-14`) applied clean at b52481302; its names given the file's form (`ORIGIN_AGENT_KINDS`, `agentAgrees`, the import beside the file's others); the logic unchanged.

THE MEASURE MET: field diff by family (births at b52481302 -> births at FA, 720): `history.founding.reason` in 154 towns, nothing else. RECORD-MEASURE-1's classes.mjs: a_founder_vs_origin 154 -> 0; every other class unchanged (b1 16, b2 12, c1 522, c2 302, c3 94, d 153, e 17, f 24, g 60, h 167, i 106, j 367, k 268). Towns with no Origin row 51 -> 99: the 48 new SILENT towns (for new rows later): r2r-city-22 r2r-city-25 r2r-city-36 r2r-city-40 r2r-city-44 r2r-hamlet-15 r2r-hamlet-26 r2r-hamlet-30 r2r-hamlet-37 r2r-metropolis-1 r2r-metropolis-20 r2r-metropolis-41 r2r-thorp-14 r2r-thorp-22 r2r-thorp-34 r2r-thorp-40 r2r-thorp-42 r2r-thorp-49 r2r-thorp-59 r2r-thorp-9 r2r-town-17 r2r-town-43 r2r-town-48 r2r-town-5 r2r-village-10 r2r-village-21 r2r-village-3 r2r-village-51 r2s-indebted-city-0 r2s-indebted-town-3 r2s-infiltrated-thorp-0 r2s-insurgency-city-0 r2s-insurgency-city-3 r2s-insurgency-thorp-0 r2s-monster_pressure-hamlet-1 r2s-monster_pressure-town-0 r2s-occupied-metropolis-0 r2s-politically_fractured-thorp-2 r2s-politically_fractured-town-3 r2s-recently_betrayed-hamlet-0 r2s-religious_conversion-city-3 r2s-slave_revolt-town-2 r2s-slave_revolt-village-1 r2s-succession_void-metropolis-0 r2s-succession_void-town-3 r2s-under_siege-city-1 r2s-wartime-town-1 r2s-wartime-village-0.

THE PAGE (inventory diff, batch 1's census -> FA's census; the two mill lines in it are batch 1's correction above): 29,892 -> 29,890. Gone: "was built where two rival mining operations agreed …" (11, as measured), "a frontier outpost that outlasted …" (2). Fewer: herders 31 -> 13, defensible position on the road 18 -> 6, defensive stronghold 11 -> 2, naval base 12 -> 4, river fishery camp 14 -> 7, customs post 9 -> 4, logging camp 19 -> 14, fishing village into a maritime hub 6 -> 1, seasonal fair 6 -> 3. THE INHERITORS, read: each a row of its town's own pool whose own test holds: the pass guides +18 (every one a mountain town), the soil +15, the overland route +11, the mining camp +7, the river ford +6, the toll point +6, the harbour fish prefer +6, the agricultural market +6, the caravans' rest stop +5. Matches the chair's measured effect (N4).

GUARD: `tests/generators/tailNarrativeRows.test.js` B2: 8 cured towns (a healer beside a customs post; merchants beside a frontier outpost; religious authorities beside a toll point under a famine; refugees beside two mining operations under a siege; a household beside a stronghold under an occupation; the slow accretion beside a stronghold in a metropolis; a discharged soldier beside the herders, now silent; a merchant coalition beside a sacred grove, now silent), red at the base 8 of 8; 4 KEEP towns (siblings beside the herders, a noble beside a naval base, a family beside a sacred grove, escaped serfs beside a mining camp), green before and after. PIN RE-KEYED BY IDENTITY (N4): `foundingWalkLandsTested.test.js` W3's herders guard rr3x-metropolis-plague_onset-crossroads-0 (its founder, the slow accretion of three settlements, cannot be herders) -> r2r-thorp-37 (the herders beside a pair of siblings); the guard not loosened.
GATES: eslint 0; domain-strict 1113/1113; ratchet 167/167; grid identical; walker identical to batch 1 (fresh 147, stale 2). Tests naming the founding files (45 files): `generatorGoldenMaster` red, CARRIED (red at the base; the golden NAMED, not re-taken); `timelineVariety` timed out once under the census's load and passes alone (5/5).
DECLARED MOVE: the founding-prose family, `history.founding.reason` in 154 towns (above); nothing else.

## The exports' rows (CHAIR NOTE X9; `read-all-3/WORKLIST3-NARRATIVE`, 38 rows, 2 HIGH)

Measured with `SURFACES=PDF,Journal inventory.py`, the base census -> batch 1's (35,779 -> 35,791 sentences). Batch 1's writer cures reach both HIGH rows: 20759 "Nothing has ever forced this place to change much" 7 -> 0; 08875 "nobody expects it … the Siege" 12 -> 10 (the one false town gone; the other a plague city's true line, as on the tabs). Also: 15690 "Little has happened here" 4 -> 0; 29068 "made its name in trade … Iron Dispute" 4 -> 3; 22423 "Records here are kept carefully" 26 -> 22 (silenced true, as on the tabs). LEFT, NAMED (not verified by this seat; the read's header lacked seats and `history.currentTensions`): every other row, one line each, towns before -> after batch 1:

```
08875 HIGH POLITICAL_FLAVOR 12->10 Every plan made here now allows for the Siege happening again; nobody 
20759 HIGH POLITICAL_FLAVOR 7->0 Nothing has ever forced this place to change much.
22398 MED ORIGIN_POOLS 104->104 Reason settled: Sited on a route already worn deep before anyone built
22383 MED ORIGIN_POOLS 67->67 Reason settled: Founded roadside, where the day is measured in traffic
22400 MED ORIGIN_POOLS 56->56 Reason settled: The road was here first.
01687 MED POLITICAL_FLAVOR 38->39 The Siege is why this place looks as it does: it stood here before, bu
22373 MED ORIGIN_POOLS 35->35 Reason settled: Built along the river: water access shapes every econo
22397 MED ORIGIN_POOLS 34->34 Reason settled: Sited at the water's edge because the river was the on
22379 MED ORIGIN_POOLS 27->27 Reason settled: Founded at a junction on the oldest logic there is: wh
22374 MED ORIGIN_POOLS 26->26 Reason settled: Built at a major crossroads, and trade comes in on eve
22423 MED POLITICAL_FLAVOR 26->22 Records here are kept carefully and disputes settled by precedent; peo
22370 MED ORIGIN_POOLS 18->18 Reason settled: A road settlement: it makes its living from other peop
21093 MED POLITICAL_FLAVOR 18->18 Outsiders see a busy market; the people who live here know the stories
22388 MED ORIGIN_POOLS 16->16 Reason settled: It exists because travellers had to stop somewhere, an
00748 MED STRESS_DESCS.slave_revolt 15->15 The Great Fire (18 years ago): Beginning in the lower districts, the b
22387 MED ORIGIN_POOLS 14->14 Reason settled: Isolated, and running a shortfall it cannot farm its w
22375 MED ORIGIN_POOLS 12->12 Reason settled: Built on the shore, by people who meant to trade by wa
31876 MED genArrivalDetail 9->9 by securing an exclusive charter before competitors could react
13045 MED genArrivalDetail 9->9 How it was overcome: by securing an exclusive charter before competito
29065 MED POLITICAL_FLAVOR 8->8 This place made its name in trade, not war, and the Economic Divide sh
22366 MED ORIGIN_POOLS 8->8 Reason settled: A coastal seaport whose existence is inseparable from 
27503 MED STRESS_INSTITUTION_EFFECTS.needs 5->5 The original contract that created the debt was based on projections t
29068 MED POLITICAL_FLAVOR 4->3 This place made its name in trade, not war, and the Iron Dispute showe
15690 MED POLITICAL_FLAVOR 4->0 Little has happened here worth writing down, and the people here are p
11946 MED STRESS_INSTITUTION_EFFECTS.excludes 4->4 Has been making personal side payments to the creditor's representativ
23822 MED POLITICAL_FLAVOR 3->3 Several important events, none of them decisive.
14686 MED POLITICAL_FLAVOR 3->3 Its character built up slowly, with no single break, and that makes it
15278 MED STRESS_INSTITUTION_EFFECTS.excludes 3->3 Knows the debt contains a clause that transfers significant civic asse
28582 MED STRESS_INSTITUTION_EFFECTS.excludes 2->2 Their family left last week: Huilan Chen saw them loading the cart.
11964 MED STRESS_INSTITUTION_EFFECTS.succession_void 2->2 Has been quietly removing records from the archive that would complica
11999 MED STRESS_INSTITUTION_EFFECTS.needs 1->1 Has documentation proving the famine was caused by export decisions ma
22396 MED ORIGIN_POOLS 1->1 Reason settled: Set apart from the trade roads.
12002 MED STRESS_INSTITUTION_EFFECTS.needs 1->1 Has documentation proving the famine was caused by export decisions ma
23385 MED STRESS_INSTITUTION_EFFECTS.needs 1->1 Secret): Has documentation proving the famine was caused by export dec
12004 MED STRESS_INSTITUTION_EFFECTS.needs 1->1 Has documentation proving the famine was caused by export decisions ma
22393 MED ORIGIN_POOLS 1->1 Reason settled: Off the trade routes entirely.
22394 MED ORIGIN_POOLS 1->1 Reason settled: Set apart from the trade roads, on ground that does no
27424 MED POLITICAL_FLAVOR 1->1 The offices here are filled and the seals are real, but people still a
```

## What is left of the worklist (verified notes for the next seat)

- ORIGIN_POOLS (`settlementOriginProse.js`, 20 rows, 350 towns; the exports add 15): verified by the record in this seat's scratch, not cured. STRUCK on the record: 09400 "Founded roadside" (place, not cause: a farmland grant can lie on a road; a siege is already refused), B20740 "The road was here first" (place), 23205 road[0] "Trade flows in" (index 0, the pre-widening sentence; the occupation's and the plague's records close no road; a siege is already refused), 02975 road[3] "stabling and meals" (an alehouse, the vocabulary's `tavern`, stands in all 18). TO CURE: B20939 road[1] "most of what it owns arrived on somebody else's cart" (claims too much: proposed "and most of its news arrives on somebody else's cart"); 09370 crossroads[3] and 11941 crossroads[4] claim a CAUSE of founding against the History tab's reason (settlementReason is drawn BEFORE the founding reason in `steps/generateNarratives.js`, so the row cannot read it: reword to place, and keep one crossroads row siege-safe or the pool is mute under a siege: crossroads[0..2] already refuse it); 09398/B20803 port.coastal[2] (cause; and "the sea gives its living" under a siege: noSiege); B13256 port.coastal[3] "most of what it eats … arrives the same way" (false in all 9: import cover < half of need in every one; and a siege); 15081, 15101, 22030, 14593, 11943 "it gets by on {holds}" in isolated.unsupplied / isolated.besieged / holdingsOf under a deficit of 40-72% (proposed "it must make do with"); 17926 "ground that does not quite feed it" at a 40% gap ("does not fully feed it", three arms; never isolated.deficit[0], law 2); 22014 deficit[4] "The shortfall is met" at 5% import cover; 22015, 18781 "the caravans that still come" beside "no caravans reach" (seasonal path: say "the tracks in a good season"); B20992, B27626 "carriage by magic" where the food record gives magic 0% (name it only where `foodBalance.magicFoodOffset` is at least 1% of need; the receipt's magical_transit path alone is not food carried).
- founder.js FOUNDER_KIND (3 rows: 09374 "a dynastic decision that this crossroads" beside a ferry crossing, 09381 a military command beside foresters, B08943 a trade house beside a hunting lodge): FA did not reach them (still 28, 27, 24): the founder row names a PLACE or a cause; the next cure turns FA's table the other way for those founder rows (RECORD-MEASURE-1's FB), or reads the founder's place word.
- `stressInstitutionEffects.js` (18 rows, 190 towns: secrets and crisis lines naming patrols, a crackdown, an archive, a slave market, grain reserves, exports, a festival under a plague) and `narrativeData.js` (33 rows, 209: STRESS_NOTES and STRESS_DESCS naming founders, burial grounds, temples, a merchant district, watchtowers, a waterfront): not begun. `narrativeGenerator.js :: SMALL_PLACE_TIER_LINES` B27632 "not much left to sell" beside five exports: not begun.

## How the instruments are re-made

- Census: `git fetch origin lane/census-3-2026-11-14`; `git archive` its `docs/chair/2026-11-14/probes/CENSUS-3` OUT of every tree; `sh <probes>/census3.sh <scratch worktree with node_modules> <out-dir> 4` (about 22 minutes; NEVER edit the tree while it renders: this seat lost one run that way). `inventory.py <out> x.json` (tabs) and `SURFACES=PDF,Journal inventory.py <out> x.json` (exports), from `lane/chair-2026-11-08` `docs/chair/2026-11-14/probes/READ-ALL/`; `inventory_diff.py before.json after.json rows.json`.
- The record in a minute: RECORD-MEASURE-1's `births-only.sh` (CENSUS3_PROBES set), `fielddiff.mjs <before corpus> <after corpus> 3`, `classes.mjs <tree> <corpus> <out.json>`.
- Verification by script: a predicate a row over each printing town's record (`factsOf`, `declarationAdmits(declarationOf(...))`), the page dumps for the page's own other lines.
- Red at the base: a second scratch worktree at the base commit, `node_modules` linked, the new test copied in and removed after.

## Registers named stale

- `tests/lint/presumedThings.widened.register.json`: 2 stale rows (narrativeText.js clergy cc79cf804fe5ed09, practitioner fa104bd22874f27f), left for the close's re-derivation (shrink-only).
- The goldens (`generatorGoldenMaster`, `espionageDormancyFence`, `worldFactRederive`, `rosterFinalUnderHeldRoster`) and `proseWiringCensus.walker`: red at the base, red here; not re-taken.
