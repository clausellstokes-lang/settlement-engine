# ROUND-3-CUT — THE INCREMENT: three more cold lists against the cut (2026-11-13)

The reader ROUND-3-CUT, for the chair. I fix nothing and change nothing on any lane. The cut is ROUND-3-CUT-2026-11-13.md beside this file (its holders by own commits at 892904c1d). EXECUTED means run and read; PLAUSIBLE means read from code or inferred. Probes: `probes/ROUND-3-CUT/increment/`.

## The lists (read back from origin)
| list | branch at | HIGH | MED |
|---|---|---|---|
| ww: the corpus lane's read, `REVIEW-W2-WRITE-COLD-LIST.json` (30 towns `rww-*`) | `lane/review-w2-write-2026-11-13` f07529c3e | 86 | 552 |
| pf: the powers read, `probes/REVIEW-POWERS-FU/COLD-LIST.json` (30 towns `rpf-*`) | `lane/review-powers-fu-2026-11-13` 40f7cc893 | 20 | 393 |
| the defence lane's fourth read, section 1 | `lane/review-upkeep-2026-11-13` 1e7ba20a1 | 1 | 5 |

**The defence read adds nothing NEW** (EXECUTED, by reading its section 1). Its one HIGH (C-H1: the magic houses leave the Magical Capability rating, AT TIP ONLY) is the defence lane's own new line, which its reader charges to that lane. Its MEDs are C-M1 (AT TIP ONLY; it is classes A1/F, already in the cut's §7(e)), C-M2, C-M4 and C-M5 (the carried classes, already taken), and C-M3 (ruled).

## How (EXECUTED)
1. **The writer of every HIGH and MED line, at the line's tip aac79b808, by the cut's own instruments** (`inc-writers.mjs`, `inc-rules.mjs`):
   - the 120 traced forms;
   - the tab's raw-name writer;
   - fixed runs with `git grep -F`, the functions found as in the cut. These towns' records are not on hand, so names are folded by shape: capitalised runs, possessives and numbers;
   - the reader's source;
   - for the composed rows these lists flatten differently (e.g. "Breakdown Prosperity -20 Safety -20" on one line), a form rule to the writer the cut traced for the same row. 68 lines take a form rule, a bare role word or a Tonight row among them; each is marked PLAUSIBLE where it is not a traced form.
   - All 1,051 lines have a writer.
2. **The class** (`inc-classify.mjs`):
   - **SAME FAULT:** the same writer, file and function (for the corpus: the pool, combination and variant), AND the same mechanism class as a line of the cut. The cut line given is the packaged one first, then the most similar.
   - **CHARGED:** the list's own reader already charged it to the lane it reviews. For ww, `origin: OWN` (12 MED). For pf, a tip-only line whose reviewer class is O* or L*, the lane's own (6 MED). These are skipped.
   - **NEW:** otherwise. The holder is by a lane's own commits, as at 892904c1d.
3. **Does it still print at the line's tip?** I birthed each list's thirty towns at aac79b808 with the list's own render (`render.rww.jsx`, `render.rw3.jsx`, unchanged) and placed every line with the reader's matcher (`inc-place.mjs`).
   - **The control:** the same births at the lanes' tips reproduce the lists: ww at wr's tip prints 84 of 86 HIGH and 527 of 552 MED; pf at pw's tip prints 20 of 20 and 393 of 393.
   - Outputs: `increment/inc-classified.json` (and `ROUND-3-CUT-INCREMENT.json` beside this file), `increment/dumps-line-and-lane.tar.gz`.

## The count
| list | SAME FAULT H / M | CHARGED H / M | NEW H / M | of the NEW, printing at the line's tip H / M |
|---|---|---|---|---|
| ww | 32 / 309 | 0 / 12 | 54 / 231 | 39 / 203 |
| pf | 11 / 248 | 0 / 6 | 9 / 139 | 8 / 115 |
| **all** | **43 / 557** | 0 / 18 | 63 / 370 | **47 / 318** |

- **NEW and printing at the line's tip: 47 HIGH and 318 MED. They have 182 distinct writers in 75 files.**
- The other 16 HIGH and 52 MED NEW lines print at the lane's tip but not at the line's. They come with the lane's older base (the line has moved past them) or with that lane's own text. They are listed in the JSON (`at.line` empty) and not packaged.
- **SAME FAULT, by the cut's package:**
  - lane rb 163;
  - no lane, the tabs 109;
  - cured on a lane in the cut's towns 64 (a lane's cure there does not prove the cure here: the chair may wish these re-read after the merges);
  - several lanes, wc and up 53;
  - up 44; fd 28; no lane, power generators 25; ra 23; wr 19; no lane, people data 15; pw 15; wc 14; no lane, generators 10; no lane, data 8;
  - the rest 10.

## THE NEW PACKAGES — HIGH (printing at the line's tip; by the holder of the writer's file)

### H1. lane fd — 17 HIGH (the package holds 17 HIGH, 62 MED in all)
- **Holders of the writers' files:** fd
- **Lines:** #ww-25 #ww-30 #ww-31 #ww-55 #ww-249 #ww-323 #ww-473 #ww-494 #ww-544 #ww-545 #ww-549 #ww-569 #ww-944 #ww-1157 #ww-1339 #ww-1522 #pf-573
- **Status at the line's tip:** NEW 17
- **Mechanism:** names a house, a role or a force the town lacks 5; presumes normal times under a crisis in force 3; a ruler, a power, a threat or a history state that is not so 3; a size 2; other: names a trade in persons the generation settings exclude 1; broken text 1; names a resource, a good or a chain state that is not so 1; two homes that disagree 1
- **Writers (12):**
  - `src/data/historyData.js :: HISTORICAL_EVENTS_DATA.plotHooks` — 5: #ww-30 #ww-31 #ww-544 #ww-545 #pf-573
  - `src/data/inlandDescriptions.js :: AUCTION` — 2: #ww-323 #ww-1339
  - `src/generators/historyGenerator.js :: generateRelationshipEvent` — 1: #ww-25
  - `src/data/historyDescVariants.js :: HISTORY_DESC_VARIANTS.guild_conflict` — 1: #ww-55
  - `src/data/historyData.js :: HISTORICAL_EVENTS_DATA.unanchored` — 1: #ww-249
  - `src/data/arrivalProse.js :: ARRIVAL_PEOPLE.latin` — 1: #ww-473
  - `src/data/institutionServices.js :: INSTITUTION_SERVICES.Annual fair` — 1: #ww-494
  - `src/data/cultureProfiles.js :: CULTURE_PROFILES.foodways` — 1: #ww-549
  - `src/data/historyData.js :: (file level)` — 1: #ww-569
  - `src/data/historyData.js :: HISTORICAL_EVENTS_DATA.byMemory` — 1: #ww-944
  - `src/data/arrivalProse.js :: ARRIVAL_SENSES.dominant` — 1: #ww-1157
  - `src/data/cultureProfiles.js :: CULTURE_PROFILES.architecturalDetails` — 1: #ww-1522
- **Examples:**
  - #ww-25, rww-thorp-calm-1, World/History: "Civic buildings or a cathedral raised from local quarry stone." — against: thorp of 15: institutions are Dwellings (1-8) ("Timber or wattle-and-daub houses"), no civic building, no church ("The thorp has no church of its own", World/Faith)
  - #ww-30, rww-hamlet-famine-1, Summary/Plot Hooks: "A journeyman denied mastership has proof the exam was rigged" — against: economicState.compound.inst.hasGuild false; no guild in a hamlet of 51
  - #ww-55, rww-hamlet-famine-1, World/History: "Established and upstart guilds fought over trade and the influence that came with it" — against: economicState.compound.inst.hasGuild false; hamlet of 51, isolated, "No market or fair stands in Ulfset"

### H2. lane ra — 9 HIGH (the package holds 9 HIGH, 28 MED in all)
- **Holders of the writers' files:** ra, wr, fd, bd (with commits of their own: ra)
- **Lines:** #ww-28 #ww-53 #ww-58 #ww-540 #ww-920 #ww-1070 #ww-1219 #ww-1225 #pf-394
- **Status at the line's tip:** NEW 9
- **Mechanism:** names a house, a role or a force the town lacks 3; broken text 2; two homes that disagree 2; a size 1; names a resource, a good or a chain state that is not so 1
- **Writers (7):**
  - `src/generators/narrativeText.js :: PRESSURE_SENTENCES` — 3: #ww-28 #ww-1070 #ww-1225
  - `src/generators/narrativeGenerator.js :: genArrivalDetail` — 1: #ww-53
  - `src/data/narrativeData.js :: STRESS_DESCS.religious_conversion` — 1: #ww-58
  - `src/data/narrativeData.js :: STRESS_DESCS.succession_void` — 1: #ww-540
  - `src/data/narrativeData.js :: STRESS_DESCS.indebted` — 1: #ww-920
  - `src/data/stressInstitutionEffects.js :: STRESS_INSTITUTION_EFFECTS.famine` — 1: #ww-1219
  - `src/data/stressInstitutionEffects.js :: STRESS_INSTITUTION_EFFECTS.needs` — 1: #pf-394
- **Examples:**
  - #ww-28, rww-hamlet-famine-1, Summary/Overview: "The bakers of Ulfset have started cutting the bread with things that are not flour; everyone can taste it, and the fact that nobody complains is the most alarm…" — against: institutions[] has no bakery (Subsistence farming, Common grazing land, Access to external mill, Access to parish church, Burial ground, Lord's steward, Dwellings (5-25), Water source); the pool is declared for institution:bakery
  - #ww-53, rww-hamlet-famine-1, World/History: "Founded by:a miller who built a mill and found customers before they found customers" — against: garbled ("found customers before they found customers"); and the hamlet has no mill of its own (institutions "Access to external mill", "Grain milling (a day away)")
  - #ww-58, rww-village-religious_conversion-1, Summary/Overview: "The mason's yard in Hochplatz is its busiest enterprise: one set of holy symbols coming down, another going up, and the same three workmen paid for both." — against: institutions[] has no mason or mason's yard; config.nearbyResourcesDepleted includes "stone_quarry"; the busiest houses are the boatyard/ferry/mill

### H3. lane wr — 8 HIGH (the package holds 8 HIGH, 68 MED in all)
- **Holders of the writers' files:** wr, fd (with commits of their own: wr)
- **Lines:** #ww-468 #ww-500 #ww-645 #ww-1050 #ww-1071 #ww-1206 #ww-1298 #ww-1509
- **Status at the line's tip:** NEW 8
- **Mechanism:** presumes normal times under a crisis in force 3; two homes that disagree 2; broken text 1; a ruler, a power, a threat or a history state that is not so 1; denies a house, force or crossing the town has 1
- **Writers (8):**
  - `src/data/dossierStateProse/power.generated.js ::  › DS-POW-1 · v1` — 1: #ww-468
  - `src/data/dossierStateProse/economy.generated.js :: DS-ECO-10 › POSTURE: vulnerable · v3` — 1: #ww-500
  - `src/data/dossierStateProse/defense.generated.js :: DS-DEF-2 › Beasts & Monsters: plagued, perimeter AND organized force · v2` — 1: #ww-645
  - `src/data/dossierStateProse/power.generated.js :: DS-POW-4 › riskLabel: Contested · v1` — 1: #ww-1050
  - `src/data/dossierStateProse/general.generated.js :: DS-GEN-13 › WAREHOUSES · v3` — 1: #ww-1071
  - `src/data/dossierStateProse/defense.generated.js :: DS-DEF-9 › magicDependency true · v1` — 1: #ww-1206
  - `src/data/dossierStateProse/economy.generated.js :: DS-ECO-11 › EXPLOITATION: unexploited, exportValue: medium or low · v2` — 1: #ww-1298
  - `src/data/dossierStateProse/defense.generated.js :: DS-DEF-2 › Beasts & Monsters: settled, defenses beyond the need · v2` — 1: #ww-1509
- **Examples:**
  - #ww-468, rww-metropolis-wartime-1, World/History: "Legitimacy crisismajorcatastrophic" — against: severity array printed run together
  - #ww-500, rww-town-under_siege-1, Systems/Economics: "Sanctavallis has goods to sell, but the way out is unreliable, and a trader never knows whether a load will get through." — against: stress.type 'under_siege': 'Enemies are camped around Sanctavallis, and nothing comes in by road'; stress.viabilityNote 'Field work and trade have stopped' — the way out is closed, not unreliable
  - #ww-645, rww-city-under_siege-1, Systems/Defense: "Defense at Panteakra is not an emergency arrangement, it is the week's work: the rotations run, the gates close on time, and nobody treats any of it as unusual." — against: stress.type 'under_siege': 'Enemies are camped around Panteakra, and nothing comes in by road'; viabilityNote 'Field work and trade have stopped'; same tab 'Active siege ... nobody sleeps through the night', gates 'shut and barre…

### H4. lane rb — 5 HIGH (the package holds 5 HIGH, 17 MED in all)
- **Holders of the writers' files:** rb
- **Lines:** #ww-252 #pf-84 #pf-717 #pf-718 #pf-720
- **Status at the line's tip:** NEW 5
- **Mechanism:** a ruler, a power, a holder or a claimant that is not so 4; denies a house, force or crossing the town has 1
- **Writers (4):**
  - `src/components/new/npcComponents.jsx :: ConflictCard / the relationship row` — 2: #pf-718 #pf-720
  - `src/domain/crisis/crisisCast.js :: CAST_ABSENCES` — 1: #ww-252
  - `src/domain/summary/tonightSheet.js :: composeTonightSheet` — 1: #pf-84
  - `src/domain/summary/tonightSheet.js :: peopleOf` — 1: #pf-717
- **Examples:**
  - #ww-252, rww-thorp-under_siege-1, Summary/Crisis: "defends: no military, garrison or watch stands" — against: defenseProfile.institutions.militia ["Household levy"]; institutions include "Household levy" [Defense]; same tab: "Defence: Palisade, Household levy."; Defense tab: "Standing forces / Household levy"
  - #pf-84, rpf-village-succession_void+famine-13, Table/Tonight sheet: "Headman · holds the lever" — against: seat vacant (factions[Headman's Authority].modifiers ['vacant']); Power tab and card call him 'Acting Headman' who 'keeps the seat meanwhile'
  - #pf-717, rpf-metropolis-succession_void-13, Table/Tonight sheet: "First Magnate · Secret" — against: Seat is empty: factions[Grand Merchant Oligarchy].modifiers ['vacant']; Power tab 'Stands empty … Acting First Magnate Li Song … keeps the seat meanwhile'. Li Song is Acting, not First Magnate (record npc.role 'First Magnate' pri…

### H5. no lane: domain (other) — 3 HIGH (the package holds 3 HIGH, 13 MED in all)
- **Holders of the writers' files:** none
- **Lines:** #ww-4 #ww-536 #ww-1227
- **Status at the line's tip:** NEW 3
- **Mechanism:** names a house, a role or a force the town lacks 1; a ruler, a power, a threat or a history state that is not so 1; presumes normal times under a crisis in force 1
- **Writers (3):**
  - `src/domain/coherence/hookTruth.js :: settlementHookFacts` — 1: #ww-4
  - `src/domain/dossier/faithReading.js :: factionLine` — 1: #ww-536
  - `src/domain/simulationSpine.js :: firstNonEmpty` — 1: #ww-1227
- **Examples:**
  - #ww-4, rww-thorp-calm-1, Summary/Plot Hooks: "Something was sealed inside the walls during construction, deliberately" — against: economicState.compound.inst hasWalls false (no wall institution); the same page: "Defence: No walls and no standing force." and "Unfortified. No perimeter walls."
  - #ww-536, rww-town-under_siege-1, World/Faith: "Real political weight rests with the Religious Authorities." — against: powerStructure: Corrupt Council isGoverning (power 40); Religious Authorities a contender (35); Power: 'The power Corrupt Council (strong)'
  - #ww-1227, rww-village-under_siege-1, Summary/Overview: "Established along a road route. Trade flows in, goods flow out, people pass through." — against: stress "under_siege" ("nothing comes in by road"); economicState.primaryExports [] and Economics tab "Nothing leaves Qaryatsaray for trade"; Overview's own Coherence Note: "Current effective trade is likely zero".

### H6. no lane: generators (other) — 2 HIGH (the package holds 2 HIGH, 8 MED in all)
- **Holders of the writers' files:** none
- **Lines:** #pf-88 #pf-514
- **Status at the line's tip:** NEW 2
- **Mechanism:** presumes normal times under a crisis in force 2
- **Writers (1):**
  - `src/generators/factionDynamics.js :: computeFactionRelationships` — 2: #pf-88 #pf-514
- **Examples:**
  - #pf-88, rpf-city-occupied-13, Systems/Power: "Royal Authority gives the orders and Occupation Authority carries them out; each needs the other to stay strong." — against: stress 'occupied': 'The forces of another power hold Glenglen, and its own officials take their orders.'; Occupation desc 'External administrative body; all significant decisions require approval or reversal.'; record narrative f…
  - #pf-514, rpf-metropolis-occupied-13, Systems/Power: "Royal Authority gives the orders and Occupation Authority carries them out; each needs the other to stay strong." — against: stress.type "occupied": the occupier rules the crown, not the reverse. Overview: "Royal Authority still meets, but nothing it decides stands until the occupiers agree"; Occupation Authority desc "all significant decisions require…

### H7. no lane: people data (src/data/people) — 1 HIGH (the package holds 1 HIGH, 17 MED in all)
- **Holders of the writers' files:** none
- **Lines:** #ww-449
- **Status at the line's tip:** NEW 1
- **Mechanism:** other: content the town's boundaries exclude (enslaved fighters) 1
- **Writers (1):**
  - `src/data/people/titleSecretsPresentations.js :: ROWS` — 1: #ww-449
- **Examples:**
  - #ww-449, rww-metropolis-wartime-1, World/NPCs: "Secret: Buys fighters who were taken against their will, and keeps them in chains between bouts" — against: config.contentBoundaries.slavery false and human_trafficking false (the owner's boundaries exclude it)

### H8. no lane: display leaves (src/domain/display) — 1 HIGH (the package holds 1 HIGH, 1 MED in all)
- **Holders of the writers' files:** none
- **Lines:** #ww-470
- **Status at the line's tip:** NEW 1
- **Mechanism:** broken text 1
- **Writers (1):**
  - `src/domain/display/heraldCausalGrammar.js :: CHAIN_END_BANNED` — 1: #ww-470
- **Examples:**
  - #ww-470, rww-metropolis-wartime-1, World/History: "Jalaliin came through the siege, older than its bearers; its legacy is what the metropolis built in answer to it, and that still stands." — against: '{timeband_age}' filled with 'older than its bearers' (a phrase for a grudge); misreads for a siege 77 years ago

### H9. no lane: the tabs (src/components/new/tabs) — 1 HIGH (the package holds 1 HIGH, 9 MED in all)
- **Holders of the writers' files:** none
- **Lines:** #ww-571
- **Status at the line's tip:** NEW 1
- **Mechanism:** broken text 1
- **Writers (1):**
  - `src/components/new/tabs/HistoryTab.jsx :: HistoryTab (the founding row)` — 1: #ww-571
- **Examples:**
  - #ww-571, rww-hamlet-succession_void-1, World/History: "Founded by:a miller who built a mill and found customers before they found customers" — against: history.founding.foundedBy repeats itself ('found customers before they found customers'); the hamlet has no mill of its own ('Access to external mill ... a day away'); the source flags the phrase as unfillable

## THE NEW PACKAGES — MEDIUM (printing at the line's tip)

### M1. lane wr — 68 MED (the package holds 8 HIGH, 68 MED in all)
- **Holders of the writers' files:** wr, fd (with commits of their own: wr)
- **Lines:** #ww-22 #ww-36 #ww-42 #ww-51 #ww-56 #ww-71 #ww-79 #ww-81 #ww-85 #ww-141 #ww-142 #ww-170 #ww-248 #ww-280 #ww-316 #ww-346 #ww-427 #ww-437 #ww-442 #ww-447 #ww-503 #ww-520 #ww-521 #ww-550 #ww-600 #ww-646 #ww-674 #ww-681 #ww-688 #ww-706 #ww-796 #ww-824 #ww-902 #ww-991 #ww-1044 #ww-1059 #ww-1068 #ww-1131 #ww-1180 #ww-1193 #ww-1199 #ww-1286 #ww-1311 #ww-1360 #ww-1374 #ww-1433 #ww-1436 #ww-1438 #ww-1466 #ww-1470 #ww-1478 #ww-1497 #ww-1511 #ww-1527 #ww-1530 #pf-75 #pf-91 #pf-148 #pf-149 #pf-165 #pf-181 #pf-220 #pf-569 #pf-589 #pf-656 #pf-674 #pf-675 #pf-784
- **Status at the line's tip:** NEW 68
- **Mechanism:** two homes that disagree 41; presumes normal times under a crisis in force 7; a ruler, a power, a threat or a history state that is not so 4; names a house, a role or a force the town lacks 3; a figure against the record's 3; a count 2; names a resource, a good or a chain state that is not so 2; denies a house, force or crossing the town has 2; a ruler, a power, a holder or a claimant that is not so 2; broken text 1; other: denies the rival threat under a contested seat 1
- **Writers (47):**
  - `src/data/dossierStateProse/economy.generated.js :: DS-ECO-9 › SECURE · v3` — 4: #ww-71 #ww-550 #ww-706 #ww-1530
  - `src/data/dossierStateProse/economy.generated.js :: DS-ECO-9 › SECURE · v1` — 4: #ww-141 #ww-681 #ww-1286 #ww-1360
  - `src/data/dossierStateProse/defense.generated.js :: DS-DEF-9 › magicDependency false · v2` — 4: #ww-280 #ww-520 #ww-1438 #ww-1511
  - `src/data/dossierStateProse/power.generated.js :: DS-POW-4 › riskLabel: Contested · v1` — 4: #ww-437 #ww-1193 #pf-148 #pf-674
  - `src/data/dossierStateProse/power.generated.js :: DS-POW-5 › council · v3` — 3: #ww-79 #pf-220 #pf-569
  - `src/data/dossierStateProse/power.generated.js :: DS-POW-5 › council · v1` — 3: #ww-796 #ww-1433 #pf-91
  - `src/data/dossierStateProse/economy.generated.js :: DS-ECO-10 › POSTURE: established · v5` — 3: #ww-902 #ww-1497 #ww-1527
  - `src/data/dossierStateProse/defense.generated.js :: DS-DEF-12 › CAPACITY: enough · v2` — 2: #ww-22 #ww-1478
  - `src/data/dossierStateProse/economy.generated.js :: DS-ECO-6 › TIER: minor shadow activity (≥3) · v0` — 2: #ww-36 #ww-1470
  - `src/data/dossierStateProse/power.generated.js :: DS-POW-5 › council · v2` — 2: #ww-42 #pf-75
  - `src/data/dossierStateProse/defense.generated.js :: DS-DEF-12 › CAPACITY: enough · v3` — 1: #ww-51
  - `src/data/dossierStateProse/general.generated.js :: DS-GEN-16 › LEGACY-UNRESOLVED · v1` — 1: #ww-56
  - `src/data/dossierStateProse/defense.generated.js :: DS-DEF-2 › Beasts & Monsters: settled, nothing organized · v1` — 1: #ww-81
  - `src/data/dossierStateProse/defense.generated.js :: DS-DEF-9 › magicDependency true, with a NAMED dependent chain · v3` — 1: #ww-85
  - `src/data/dossierStateProse/economy.generated.js :: DS-ECO-9 › FOOD SOURCES: one source · v2` — 1: #ww-142
  - `src/data/dossierStateProse/defense.generated.js :: DS-DEF-1 › readiness STRONG · v4` — 1: #ww-170
  - `src/data/dossierStateProse/general.generated.js :: DS-GEN-13 › NO-MARKET · v3` — 1: #ww-248
  - `src/data/dossierStateProse/general.generated.js :: DS-GEN-16 › LEGACY-UNRESOLVED · v2` — 1: #ww-316
  - `src/data/dossierStateProse/economy.generated.js :: DS-ECO-9 › ACTIVE FAMINE: the failed source, most of the harvest · v3` — 1: #ww-346
  - `src/data/dossierStateProse/economy.generated.js :: DS-ECO-6 › FLAG: theocraticEconomy · v1` — 1: #ww-427
  - `src/data/dossierStateProse/defense.generated.js :: DS-DEF-1 › readiness ADEQUATE · v2` — 1: #ww-442
  - `src/data/dossierStateProse/defense.generated.js :: DS-DEF-5 › ARCANE: mages' guild · v2` — 1: #ww-447
  - `src/data/dossierStateProse/economy.generated.js :: DS-ECO-9 › HOW THE NEED IS MET: part of it by magic · v3` — 1: #ww-503
  - `src/data/dossierStateProse/defense.generated.js :: DS-DEF-12 › CAPACITY: enough · v1` — 1: #ww-521
  - `src/data/dossierStateProse/general.generated.js :: DS-GEN-13 › COMMERCE: a bank · v1` — 1: #ww-600
  - `src/data/dossierStateProse/defense.generated.js :: DS-DEF-5 › garrison PRESENT · v3` — 1: #ww-646
  - `src/data/dossierStateProse/general.generated.js :: DS-GEN-13 › COMMERCE: craft guilds, no merchant guild · v1` — 1: #ww-674
  - `src/data/dossierStateProse/economy.generated.js :: DS-ECO-11 › EXPLOITATION: unexploited, exportValue: medium or low · v1` — 1: #ww-688
  - `src/data/dossierStateProse/general.generated.js :: DS-GEN-17 › GARRISONED · v2` — 1: #ww-824
  - `src/data/dossierStateProse/defense.generated.js :: DS-DEF-11 › WALLED-THREATENED · v3` — 1: #ww-991
  - `src/data/dossierStateProse/economy.generated.js :: DS-ECO-11 › STRATEGIC VALUE: the generator's assessment, framed · v3` — 1: #ww-1044
  - `src/data/dossierStateProse/defense.generated.js :: DS-DEF-5 › FIXTURE: charter hall · v1` — 1: #ww-1059
  - `src/data/dossierStateProse/economy.generated.js :: DS-ECO-8 › MODERATE · v4` — 1: #ww-1068
  - `src/data/dossierStateProse/defense.generated.js :: DS-DEF-4 › structure organized · v4` — 1: #ww-1131
  - `src/data/dossierStateProse/economy.generated.js :: DS-ECO-9 › HOW THE NEED IS MET: much of it brought in · v3` — 1: #ww-1180
  - `src/data/dossierStateProse/defense.generated.js :: DS-DEF-2 › Beasts & Monsters: settled, defenses beyond the need · v2` — 1: #ww-1199
  - `src/data/dossierStateProse/defense.generated.js :: DS-DEF-8 › override: INFILTRATION ACTIVE · v4` — 1: #ww-1311
  - `src/data/dossierStateProse/economy.generated.js :: DS-ECO-11 › EXPLOITATION: unexploited, exportValue: medium or low · v3` — 1: #ww-1374
  - `src/data/dossierStateProse/defense.generated.js :: DS-DEF-2 › Economic Survival: WEAK · v3` — 1: #ww-1436
  - `src/data/dossierStateProse/economy.generated.js :: DS-ECO-9 › HOW THE NEED IS MET: part of it by magic · v1` — 1: #ww-1466
  - `src/data/dossierStateProse/power.generated.js :: DS-POW-6 › capture pressure ADVANCING (weak security, poor prosperity) · v2` — 1: #pf-149
  - `src/data/dossierStateProse/power.generated.js :: DS-POW-6 › capture pressure ADVANCING (weak security, poor prosperity) · v3` — 1: #pf-165
  - `src/data/dossierStateProse/power.generated.js :: DS-POW-4 › riskLabel: Holding · v3` — 1: #pf-181
  - `src/data/dossierStateProse/power.generated.js :: DS-POW-5 › theocracy · v3` — 1: #pf-589
  - `src/data/dossierStateProse/power.generated.js :: DS-POW-6 › capture pressure ADVANCING (weak security, poor prosperity) · v1` — 1: #pf-656
  - `src/data/dossierStateProse/power.generated.js :: DS-POW-6 › capture reached an AGENT of a faction · v1` — 1: #pf-675
  - `src/data/dossierStateProse/power.generated.js :: DS-POW-6 › capture pressure RECOVERING (strong security, prosperity) · v1` — 1: #pf-784
- **Examples:**
  - #ww-22, rww-thorp-calm-1, Systems/Outlook: "The thorp's count of its stores at Cnocholme covers an ordinary year and no more, so one bad harvest would leave it short before spring." — against: stress.type "famine" in force (foodSecurity.hasFamine true, deficit 67%, storageMonths 0.1); the same page says "No granary; a few weeks in the larder" and "Not viable"
  - #ww-36, rww-hamlet-famine-1, Systems/Economics: "Some petty theft goes on here, and some trading without a licence. It is a nuisance, nothing more." — against: stress.type "famine" in force: page "Law & orderCollapsed", "Dangerous — famine conditions", "Its hungriest are turning to banditry"
  - #ww-42, rww-hamlet-famine-1, Systems/Power: "At Ulfset the hamlet's business goes to the whole Feudal Stewardship, and everybody has learned how long the answer takes." — against: same tab: "↳1 member · first Bard Andersson"; there is no "whole" body to wait on

### M2. lane fd — 62 MED (the package holds 17 HIGH, 62 MED in all)
- **Holders of the writers' files:** fd
- **Lines:** #ww-10 #ww-26 #ww-90 #ww-97 #ww-98 #ww-99 #ww-103 #ww-104 #ww-124 #ww-254 #ww-324 #ww-325 #ww-331 #ww-336 #ww-345 #ww-395 #ww-402 #ww-493 #ww-496 #ww-541 #ww-543 #ww-572 #ww-611 #ww-618 #ww-619 #ww-724 #ww-752 #ww-754 #ww-755 #ww-756 #ww-759 #ww-760 #ww-764 #ww-771 #ww-779 #ww-780 #ww-896 #ww-922 #ww-924 #ww-945 #ww-998 #ww-1030 #ww-1031 #ww-1230 #ww-1261 #ww-1272 #ww-1340 #ww-1344 #ww-1350 #ww-1351 #ww-1416 #ww-1450 #ww-1457 #ww-1465 #ww-1467 #ww-1487 #ww-1518 #ww-1524 #pf-160 #pf-325 #pf-363 #pf-843
- **Status at the line's tip:** NEW 62
- **Mechanism:** names a resource, a good or a chain state that is not so 14; two homes that disagree 10; internal text 10; names a house, a role or a force the town lacks 8; a ruler, a power, a threat or a history state that is not so 6; a size 5; presumes normal times under a crisis in force 4; other: names a trade in captive people that the content boundaries exclude 1; a count 1; other: pronoun names the carpenter male 1; a ruler, a power, a holder or a claimant that is not so 1; other: presumes an ailing ruler and a pending succession in a calm town 1
- **Writers (23):**
  - `src/data/institutionalCatalog.js :: INSTITUTION_FAMILIES.shared` — 17: #ww-97 #ww-98 #ww-99 #ww-103 #ww-104 #ww-324 #ww-325 #ww-395 #ww-402 #ww-611 #ww-759 #ww-760 #ww-764 #ww-924 #ww-998 #ww-1272 #ww-1340
  - `src/data/historyData.js :: HISTORICAL_EVENTS_DATA.plotHooks` — 10: #ww-254 #ww-543 #ww-754 #ww-755 #ww-756 #ww-896 #ww-945 #ww-1230 #pf-160 #pf-325
  - `src/data/institutionServices.js :: INSTITUTION_SERVICES.Black market` — 4: #ww-496 #ww-619 #ww-780 #ww-1031
  - `src/data/cultureProfiles.js :: CULTURE_PROFILES.exchangePattern` — 4: #ww-618 #ww-779 #ww-1030 #ww-1351
  - `src/data/cultureProfiles.js :: CULTURE_PROFILES.foodways` — 3: #ww-10 #ww-345 #ww-1465
  - `src/generators/historyGenerator.js :: generateRelationshipEvent` — 3: #ww-26 #ww-90 #ww-1518
  - `src/data/historyData.js :: HISTORICAL_EVENTS_DATA.severity` — 2: #ww-572 #ww-1524
  - `src/data/historyData.js :: HISTORICAL_EVENTS_DATA.unanchored` — 2: #ww-724 #ww-752
  - `src/data/institutionDescVariants.js :: PAIRS` — 2: #ww-922 #ww-1457
  - `src/data/arrivalProse.js :: ARRIVAL_SENSES.lines` — 2: #ww-1450 #ww-1487
  - `src/data/institutionServices.js :: INSTITUTION_SERVICES.Fish market` — 1: #ww-124
  - `src/data/institutionalCatalog.js :: INSTITUTION_FAMILIES.metropolis` — 1: #ww-331
  - `src/data/institutionServices.js :: INSTITUTION_SERVICES.Smelter` — 1: #ww-336
  - `src/data/institutionServices.js :: INSTITUTION_SERVICES.Annual fair` — 1: #ww-493
  - `src/data/arrivalProse.js :: ARRIVAL_PEOPLE.east_asian` — 1: #ww-541
  - `src/data/institutionServices.js :: INSTITUTION_SERVICES.Garrison` — 1: #ww-771
  - `src/data/historyDescVariants.js :: HISTORY_DESC_VARIANTS.infiltration_fear` — 1: #ww-1261
  - `src/data/institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS` — 1: #ww-1344
  - `src/data/institutionServices.js :: INSTITUTION_SERVICES.Coaching inn` — 1: #ww-1350
  - `src/data/institutionServices.js :: INSTITUTION_SERVICES.Brewer` — 1: #ww-1416
  - `src/data/institutionServices.js :: INSTITUTION_SERVICES.Craft Guild District` — 1: #ww-1467
  - `src/data/historyData.js :: EVENT_TYPE_NAMES` — 1: #pf-363
  - `src/data/institutionDescVariants.js :: INSTITUTION_DESC_VARIANTS` — 1: #pf-843
- **Examples:**
  - #ww-10, rww-thorp-calm-1, Systems/Economics: "Herding and mixed farming produce a strongly seasonal food calendar." — against: economicState.foodSecurity.chains "Pastoral & livestock": false, "Grain & agriculture": false; foodRecord.foodSources ["game"]; no herding house in the roster
  - #ww-26, rww-thorp-calm-1, World/History: "The quarry workers became a political force." — against: population 15 founded by "a single extended family"; the only power is Elder Council (1 member); no quarry institution
  - #ww-97, rww-metropolis-calm-1, Systems/Institutions: "Formal venue for selling high-value goods: estates, ships, livestock, art, and occasionally persons. Charges buyer's and seller's premiums." — against: config.contentBoundaries {slavery:false, human_trafficking:false}

### M3. lane ra — 28 MED (the package holds 9 HIGH, 28 MED in all)
- **Holders of the writers' files:** ra, wr, fd, bd (with commits of their own: ra)
- **Lines:** #ww-3 #ww-23 #ww-59 #ww-285 #ww-286 #ww-288 #ww-472 #ww-477 #ww-719 #ww-890 #ww-892 #ww-915 #ww-996 #ww-1064 #ww-1158 #ww-1407 #ww-1444 #ww-1481 #pf-55 #pf-207 #pf-400 #pf-602 #pf-628 #pf-649 #pf-707 #pf-708 #pf-709 #pf-726
- **Status at the line's tip:** NEW 28
- **Mechanism:** two homes that disagree 10; a ruler, a power, a holder or a claimant that is not so 5; names a house, a role or a force the town lacks 4; a ruler, a power, a threat or a history state that is not so 3; names a resource, a good or a chain state that is not so 2; presumes normal times under a crisis in force 1; a figure against the record's 1; denies a house, force or crossing the town has 1; two homes disagree 1
- **Writers (15):**
  - `src/data/stressInstitutionEffects.js :: STRESS_INSTITUTION_EFFECTS.needs` — 4: #ww-23 #ww-719 #ww-1064 #ww-1481
  - `src/data/npcData.js :: STRESS_ECONOMIC_EFFECTS.gov_econ_dependence` — 4: #pf-707 #pf-708 #pf-709 #pf-726
  - `src/generators/narrativeText.js :: PRESSURE_SENTENCES` — 3: #ww-59 #ww-286 #ww-892
  - `src/data/npcData.js :: STRESS_ECONOMIC_EFFECTS.family_complication` — 3: #ww-1444 #pf-55 #pf-400
  - `src/generators/narrativeText.js :: POLITICAL_FLAVOR` — 2: #ww-285 #ww-472
  - `src/data/narrativeData.js :: TERRAIN_NARRATIVE_HOOKS.river` — 2: #ww-890 #ww-915
  - `src/data/npcData.js :: STRESS_ECONOMIC_EFFECTS.old_debt` — 2: #pf-602 #pf-649
  - `src/generators/narrativeGenerator.js :: generateSettlementReason` — 1: #ww-3
  - `src/generators/economy/foodBalance.js :: deriveFoodBalanceAnalysis` — 1: #ww-288
  - `src/data/npcData.js :: NPC_FACTION_LOYALTY.military` — 1: #ww-477
  - `src/data/narrativeData.js :: STRESS_DESCS.insurgency` — 1: #ww-996
  - `src/generators/narrativeText.js :: speakTierLines` — 1: #ww-1158
  - `src/data/narrativeData.js :: STRESS_NOTES.recently_betrayed` — 1: #ww-1407
  - `src/data/npcData.js :: STRESS_ECONOMIC_EFFECTS.mentor_legacy` — 1: #pf-207
  - `src/data/powerSiblings.js :: FACTION_DESC_SIBLINGS` — 1: #pf-628
- **Examples:**
  - #ww-3, rww-thorp-calm-1, Summary/Overview: "Survival here rests on carriage by magic, the caravans that still come, the roads in a good season, or the favour of a patron — every one of them fragile." — against: config._isolationSupport.paths = local_foodshed + seasonal_access only (no magic, caravan or patron path), magicDependent false; the same page says "Reliance on magic: None", "Nothing structural at Cnocholme depends on arcane wor…
  - #ww-23, rww-thorp-calm-1, World/NPCs: "Secret: Has documentation proving the famine was caused by export decisions made by Elder Council, and has been paid to lose it" — against: economicState.primaryExports []; page: "No significant exports." and "There is no trade out." (Systems/Economics); the famine is a failed hunt (foodRecord.failedSource "game")
  - #ww-59, rww-village-religious_conversion-1, Summary/Overview: "Every legal document that required religious sanction is now in a grey zone that the courts are not equipped to resolve quickly." — against: economicState.compound.inst.hasCourtSystem false; Systems/Defense: "Hochplatz keeps no court and no gaol", "Legal Infrastructure None"

### M4. no lane: data tables (src/data) — 28 MED (the package holds 0 HIGH, 28 MED in all)
- **Holders of the writers' files:** none
- **Lines:** #ww-130 #ww-133 #ww-147 #ww-164 #ww-304 #ww-504 #ww-617 #ww-799 #ww-800 #ww-927 #ww-928 #ww-1113 #ww-1252 #ww-1297 #ww-1367 #ww-1468 #pf-250 #pf-267 #pf-268 #pf-288 #pf-314 #pf-315 #pf-316 #pf-355 #pf-481 #pf-630 #pf-682 #pf-702
- **Status at the line's tip:** NEW 28
- **Mechanism:** two homes that disagree 8; internal text 6; names a resource, a good or a chain state that is not so 4; a ruler, a power, a holder or a claimant that is not so 4; names a house, a role or a force the town lacks 2; other: a female title on a male person 2; denies a house, force or crossing the town has 1; other: doubled office words 1
- **Writers (15):**
  - `src/data/economicData.js :: TRADE_DEPENDENCY_NEEDS.svcs` — 6: #ww-130 #ww-133 #ww-147 #ww-617 #ww-1113 #ww-1252
  - `src/data/officeTitles.js :: OFFICE_TITLES` — 4: #pf-314 #pf-315 #pf-316 #pf-355
  - `src/data/faceHonorifics.js :: FACE_HONORIFICS.the guildmaster of thieves` — 3: #ww-164 #ww-800 #pf-267
  - `src/data/supplyChainData.js :: SUPPLY_CHAIN_NEEDS.services` — 2: #ww-304 #ww-1367
  - `src/data/faceHonorifics.js :: FACE_HONORIFICS.the sage` — 2: #ww-799 #pf-630
  - `src/data/supplyChainData.js :: GUILD_MANUFACTURED_GOODS` — 2: #ww-927 #ww-928
  - `src/data/supplyChainData.js :: SUPPLY_CHAIN_NEEDS.upstreamChains` — 1: #ww-504
  - `src/data/resourceChains.js :: RESOURCE_CHAINS.processingInstitutions` — 1: #ww-1297
  - `src/data/supplyChainData.js :: BARRELS_AND_CONTAINERS` — 1: #ww-1468
  - `src/data/faceHonorifics.js :: FACE_HONORIFICS.the alewife` — 1: #pf-250
  - `src/data/faceHonorifics.js :: FACE_HONORIFICS.the healer` — 1: #pf-268
  - `src/data/faceHonorifics.js :: FACE_HONORIFICS.the midwife` — 1: #pf-288
  - `src/data/faceHonorifics.js :: FACE_HONORIFICS.the guildmaster` — 1: #pf-481
  - `src/data/faceHonorifics.js :: FACE_HONORIFICS.the senior guild master` — 1: #pf-682
  - `src/data/informationBrokerageTuning.js :: RUMOR_SOURCE_INSTITUTIONS` — 1: #pf-702
- **Examples:**
  - #ww-130, rww-metropolis-calm-1, Systems/Services: "Currency exchange Vulnerable2-order chain" — against: chain machinery ("2-order chain") printed on the service row
  - #ww-164, rww-metropolis-calm-1, Systems/Power: "The Shadow Compact · led by Rashid Arlat, the guildmaster of thieves" — against: the Thieves' guild (powerful) is Rashid Arlat's house (Systems/Institutions "Connection: Guildmaster Rashid Arlat"), yet the power "Thieves' Guild" is led by Qarabek Kalmyk of the Smuggling network ("↳5 members · first Qarabek Ka…
  - #ww-304, rww-town-famine-1, Systems/Economics: "Stone & ConstructionRaw materials & fuel✓ Running" — against: activeChains stone status "running" but resourceAnalysis.gaps stone missing ["Stone quarry","Stonemasons' guild"] and Brickmaker "lacks access to clay" (severity high); Resources: "Unexploited Stone" and "No one here works the st…

### M5. no lane: power generators — 20 MED (the package holds 0 HIGH, 20 MED in all)
- **Holders of the writers' files:** none
- **Lines:** #ww-162 #ww-377 #ww-440 #ww-639 #ww-980 #ww-1048 #pf-1 #pf-23 #pf-27 #pf-164 #pf-234 #pf-486 #pf-524 #pf-525 #pf-526 #pf-626 #pf-627 #pf-673 #pf-734 #pf-738
- **Status at the line's tip:** NEW 20
- **Mechanism:** a figure against the record's 6; two homes that disagree 6; two homes disagree 3; internal text 2; a ruler, a power, a holder or a claimant that is not so 1; presumes normal times under a crisis in force 1; names a house, a role or a force the town lacks 1
- **Writers (4):**
  - `src/generators/power/rulingStructure.js :: generatePowerStructure` — 10: #ww-377 #ww-440 #ww-639 #ww-980 #pf-1 #pf-23 #pf-27 #pf-524 #pf-526 #pf-734
  - `src/generators/power/stressFactions.js :: applyStressEventFactions` — 6: #pf-164 #pf-234 #pf-486 #pf-626 #pf-673 #pf-738
  - `src/generators/power/factionStanding.js :: annotateFactionStanding` — 3: #ww-162 #pf-525 #pf-627
  - `src/generators/power/governingStressVignettes.js :: buildInsurgencyNarrative` — 1: #ww-1048
- **Examples:**
  - #ww-162, rww-metropolis-calm-1, Systems/Power: "They are roughly even with the military: the garrison can arrest their people, and the guild can make every investigation costly." — against: powerStructure.factions: Thieves' Guild power 7 ("Suppressed") vs Military/Guard 17; same tab "Criminal7", "Military17"
  - #ww-377, rww-metropolis-famine-1, Systems/Power: "Undermanned and underfunded; unable to enforce law consistently and aware of it." — against: defenseProfile.readiness.label "Well-Defended" (score 75); Defense: "The garrison and city watch patrols on a regular round"; "Everyone entering Kilwell is counted at the gate by a soldier"
  - #ww-1048, rww-city-insurgency-1, Systems/Power: "The trouble is inside the government, not in the streets." — against: Defense tab: 'Armed rebels are active. Patrols have changed their routes, some districts are closed off' and 'political violence: Street-level confrontations between insurgent supporters and the watch'

### M6. no lane: people data (src/data/people) — 17 MED (the package holds 1 HIGH, 17 MED in all)
- **Holders of the writers' files:** none
- **Lines:** #ww-178 #ww-375 #ww-654 #ww-656 #ww-1137 #ww-1254 #pf-51 #pf-80 #pf-203 #pf-496 #pf-520 #pf-548 #pf-556 #pf-639 #pf-640 #pf-641 #pf-642
- **Status at the line's tip:** NEW 17
- **Mechanism:** internal text 8; presumes normal times under a crisis in force 3; two homes that disagree 2; other: names a trade in captive people that the content boundaries exclude 1; other: content the town's boundaries exclude (enslaved fighters) 1; other: treats a hidden criminal house as a chartered one 1; broken text 1
- **Writers (4):**
  - `src/data/people/goalFamilies.js :: GOAL_FAMILY_LINES` — 12: #ww-654 #ww-1254 #pf-51 #pf-80 #pf-203 #pf-496 #pf-548 #pf-556 #pf-639 #pf-640 #pf-641 #pf-642
  - `src/data/people/titleSecretsPresentations.js :: ROWS` — 3: #ww-178 #ww-656 #ww-1137
  - `src/data/people/dmPowerLines.js :: CAPTURE_LINES` — 1: #ww-375
  - `src/data/people/dmPowerLines.js :: cap` — 1: #pf-520
- **Examples:**
  - #ww-178, rww-metropolis-calm-1, World/NPCs: "Secret: Buys fighters who were taken against their will, and keeps them in chains between bouts" — against: config.contentBoundaries {slavery:false, human_trafficking:false}
  - #ww-375, rww-metropolis-famine-1, Systems/Power: "Free of the criminals. Nobody at the head of Grand Guild Consortium answers to a criminal house, and no criminal power here is strong enough to push it." — against: record criminalCaptureState "none", but the page: Thieves' guild (powerful) "A dominant underworld power", Defense "Deeply embedded in civic life", and the castellan (Military/Guard, member of the Consortium) "answers to Thieves'…
  - #ww-654, rww-city-under_siege-1, World/NPCs: "Wants Lay in a season of grain at the city granaries while it can still be had." — against: stress.type 'under_siege': 'Enemies are camped around Panteakra, and nothing comes in by road'; viabilityNote 'Field work and trade have stopped'; Economics: 'Nothing has come into Panteakra since the siege closed the roads'

### M7. lane rb — 17 MED (the package holds 5 HIGH, 17 MED in all)
- **Holders of the writers' files:** rb
- **Lines:** #ww-281 #ww-539 #ww-1545 #pf-14 #pf-19 #pf-79 #pf-82 #pf-136 #pf-176 #pf-303 #pf-371 #pf-472 #pf-505 #pf-668 #pf-693 #pf-769 #pf-856
- **Status at the line's tip:** NEW 17
- **Mechanism:** two homes that disagree 7; a ruler, a power, a holder or a claimant that is not so 5; other: a woman's title on a man 2; a size 1; names a house, a role or a force the town lacks 1; other: a tradesperson ranked in a noble power 1
- **Writers (9):**
  - `src/components/new/npcComponents.jsx :: NPCInlineCard` — 4: #pf-14 #pf-79 #pf-136 #pf-693
  - `src/domain/summary/tonightSheet.js :: CAST_WANTS` — 3: #pf-176 #pf-303 #pf-856
  - `src/data/traditionCorpus.js :: TRADITION_ELEMENTS` — 2: #ww-281 #ww-1545
  - `src/domain/crisis/crisisCast.js :: CAST_REASONS` — 2: #pf-19 #pf-505
  - `src/domain/summary/tonightSheet.js :: composeTonightSheet` — 2: #pf-472 #pf-668
  - `src/domain/summary/settlementQuickGuide.js :: SCOPE_LINE_FRAMES` — 1: #ww-539
  - `src/components/new/npcComponents.jsx :: ConflictCard / the relationship row` — 1: #pf-82
  - `src/components/new/tabs/RelationshipsTab.jsx :: RelationshipsTab` — 1: #pf-371
  - `src/domain/summary/tonightSheet.js :: foodStoresWords` — 1: #pf-769
- **Examples:**
  - #ww-281, rww-thorp-under_siege-1, World/Traditions: "The Lesser Landfall Fair" — against: Overview: "No market or fair stands in Belovich"; compound.inst.hasMarket false
  - #ww-539, rww-hamlet-succession_void-1, Summary/Overview: "East-Asian-inspired. Ask about the place and you are told it is built in wards and courtyards, ordered by bureau and lineage." — against: population 31, tier 'hamlet'; institutions list no bureau or office beyond 'Lord's steward'; the page itself says 'A handful of houses; you could greet everyone in it before noon.'
  - #pf-14, rpf-village-succession_void-13, World/NPCs: "Mill · second of The Highborn Circle" — against: npc_mill Aziz al-Farabi title "the miller" (card "Master Miller"), influence "low", no house; The Highborn Circle category "noble". A miller ranked second of the highborn circle.

### M8. lane pw — 16 MED (the package holds 0 HIGH, 16 MED in all)
- **Holders of the writers' files:** pw
- **Lines:** #pf-47 #pf-49 #pf-65 #pf-77 #pf-105 #pf-246 #pf-491 #pf-530 #pf-595 #pf-596 #pf-636 #pf-662 #pf-663 #pf-797 #pf-799 #pf-831
- **Status at the line's tip:** NEW 16
- **Mechanism:** names a house, a role or a force the town lacks 7; a size 3; other: a subordinate line on a head's card 2; presumes normal times under a crisis in force 2; presumes a state that is not so 1; other: a tradesperson framed as an old landed family 1
- **Writers (1):**
  - `src/generators/npcStructure.js :: reg` — 16: #pf-47 #pf-49 #pf-65 #pf-77 #pf-105 #pf-246 #pf-491 #pf-530 #pf-595 #pf-596 #pf-636 #pf-662 #pf-663 #pf-797 #pf-799 #pf-831
- **Examples:**
  - #pf-47, rpf-city-calm-13, World/NPCs: "Holds a place in a crew in quiet times, with order well kept around it." — against: Usama al-Hakim is "the network's head" (Smuggling network) and first of Merchant Guilds (memberships rank 1, structuralRank "head"; Power "↳13 members · first Usama al-Hakim").
  - #pf-49, rpf-city-calm-13, World/NPCs: "Serves the faith under its leaders in quiet times." — against: Kamal ibn Ahmed is first of Religious Authorities (memberships rank 1, structuralRank "head"; Power "↳2 members · first Kamal ibn Ahmed"; his long goal "Lead Religious Authorities so long and so well..."). He is the leader, not u…
  - #pf-65, rpf-hamlet-famine-13, World/NPCs: "Heads an old family while the seat fails, and old names count for more when the seat counts for less." — against: Tertullian Brutus: npcs[].title 'the charter master', institution 'Adventurers' charter hall', category 'other' (the noble/other row); no old family or noble house in institutions[] or factions[]

### M9. no lane: domain (other) — 13 MED (the package holds 3 HIGH, 13 MED in all)
- **Holders of the writers' files:** none
- **Lines:** #ww-15 #ww-284 #ww-702 #ww-707 #ww-850 #ww-868 #ww-1258 #ww-1263 #ww-1362 #ww-1449 #ww-1521 #pf-85 #pf-667
- **Status at the line's tip:** NEW 13
- **Mechanism:** names a house, a role or a force the town lacks 5; two homes that disagree 4; a ruler, a power, a threat or a history state that is not so 2; presumes normal times under a crisis in force 1; names a resource, a good or a chain state that is not so 1
- **Writers (9):**
  - `src/domain/crisis/crisisSummaryVantage.js :: CRISIS_SUMMARY_POOLS` — 3: #ww-15 #pf-85 #pf-667
  - `src/domain/dossier/faithReading.js :: faithLinesOf` — 2: #ww-284 #ww-1521
  - `src/domain/crisis/crisisPage.js :: CRISIS_PAGE_COPY` — 2: #ww-702 #ww-1263
  - `src/domain/foodways.js :: FRAMES` — 1: #ww-707
  - `src/domain/dossier/powerStrata.js :: crisisNoteFor` — 1: #ww-850
  - `src/domain/dossier/plotHooks.js :: ECHO_PREFIXES` — 1: #ww-868
  - `src/domain/dossier/faithReading.js :: observanceOf` — 1: #ww-1258
  - `src/domain/chainYield.js :: (file level)` — 1: #ww-1362
  - `src/domain/dossier/faithReading.js :: factionLine` — 1: #ww-1449
- **Examples:**
  - #ww-15, rww-thorp-calm-1, Systems/Defense: "Those who keep order in Cnocholme spend their days guarding the stores and breaking up fights in the queues." — against: same tab: "Nobody here is paid to keep order" and "With nobody at Cnocholme paid to keep order, the hunger is policed by neighbours"; no watch institution; foodRecord.storesHeld false; queues in a thorp of 15
  - #ww-284, rww-thorp-under_siege-1, World/Faith: "The thorp has no church of its own; its people walk to the next village’s parish church for the rites. Most folk attend the rites through the year." — against: stress under_siege: surrounded, nobody passes the besiegers' lines (Defense tab); the walk to the next village is shut
  - #ww-702, rww-thorp-monster_pressure-1, Summary/Crisis: "Nobody here controls what this crisis turns on." — against: Same tab, 'Who it touches': 'holds the lever: Laelia Cato · nobody here could, so this one stepped in for the crisis' (npcs[] Laelia Cato, role Warden, temporaryKind warden, crisisIds [monster_pressure])

### M10. several lanes: wc, up — 11 MED (the package holds 0 HIGH, 11 MED in all)
- **Holders of the writers' files:** wc, up (with commits of their own: wc, up)
- **Lines:** #ww-8 #ww-34 #ww-305 #ww-340 #ww-342 #ww-551 #ww-841 #ww-876 #ww-1110 #ww-1187 #ww-1463
- **Status at the line's tip:** NEW 11
- **Mechanism:** two homes that disagree 4; names a house, a role or a force the town lacks 3; names a resource, a good or a chain state that is not so 2; a figure against the record's 2
- **Writers (5):**
  - `src/components/new/tabs/EconomicsTab.jsx :: EconomicsTab (the goods pills)` — 7: #ww-8 #ww-34 #ww-340 #ww-841 #ww-876 #ww-1187 #ww-1463
  - `src/components/new/tabs/EconomicsTab.jsx :: EconomicFlowsSection (a house name)` — 1: #ww-305
  - `src/components/new/tabs/EconomicsTab.jsx :: EconomicsTab (the food balance row)` — 1: #ww-342
  - `src/components/new/tabs/EconomicsTab.jsx :: (file level)` — 1: #ww-551
  - `src/components/new/tabs/EconomicsTab.jsx :: shortWords` — 1: #ww-1110
- **Examples:**
  - #ww-8, rww-thorp-calm-1, Systems/Economics: "game meatanimal hidesfursmedicinal herbsstone" — against: lists "medicinal herbs" as produced locally, while Systems/Resources says "Unexploited Medicinal herbs" and "No one here works the medicinal herbs near Cnocholme."
  - #ww-305, rww-town-famine-1, Systems/Economics: "Cartographer's guild" — against: institutions has "Cartographer's workshop", no Cartographer's guild (activeChains cartography processingInstitutions ["Cartographer's guild"] is a template name)
  - #ww-342, rww-metropolis-famine-1, Systems/Economics: "Production: 11,814 lbs/day+ 39,452 imported+ 11,910 by druidic provisionNeed: 69,424 lbs/dayShort: 6,248 lbs/day" — against: economicState.foodSecurity.importCoverage 39339 (page 39,452), magicOffset 11876 (page 11,910), deficit 6395 (page 6,248)

### M11. no lane: the tabs (src/components/new/tabs) — 9 MED (the package holds 1 HIGH, 9 MED in all)
- **Holders of the writers' files:** none
- **Lines:** #ww-867 #ww-1296 #pf-235 #pf-319 #pf-335 #pf-480 #pf-484 #pf-631 #pf-783
- **Status at the line's tip:** NEW 9
- **Mechanism:** two homes that disagree 3; a ruler, a power, a holder or a claimant that is not so 2; denies a house, force or crossing the town has 1; broken text 1; names a house, a role or a force the town lacks 1; a size 1
- **Writers (7):**
  - `src/components/new/tabs/power/PowerStrata.jsx :: (file level)` — 3: #pf-235 #pf-335 #pf-783
  - `src/components/new/tabs/SubstrateTab.jsx :: VAR_LABEL` — 1: #ww-867
  - `src/components/new/tabs/ResourcesTab.jsx :: ResourceChainCard` — 1: #ww-1296
  - `src/components/new/tabs/NPCsTab.jsx :: NPCsTab` — 1: #pf-319
  - `src/components/new/tabs/power/PowerStrata.jsx :: ThePowers` — 1: #pf-480
  - `src/components/new/tabs/WhoRunsThisTownPanel.jsx :: WhoRunsThisTownPanel` — 1: #pf-484
  - `src/components/new/tabs/WhoRunsThisTownPanel.jsx :: (file level)` — 1: #pf-631
- **Examples:**
  - #ww-867, rww-thorp-plague_onset-1, Summary/Foundations: "FoodCritical" — against: economicState.foodSecurity.label "Secure" (isSecure true, storageMonths 1.8); Summary/Overview prints "Food SecuritySecure" and Summary/Crisis "Food: Secure."; Daily Life prints "Tightening"
  - #ww-1296, rww-metropolis-infiltrated-1, Systems/Resources: "UnexploitedTimbermedium value" — against: institutions: 'Sawmill (commercial)', 'Carpenters (5-15)'; activeChains timber 'running'; exports 'Milled timber'; Economics 'Timber & Lumber ✓ Running'. (record resourceAnalysis.exploitation.unexploited lists timber: record disa…
  - #pf-235, rpf-village-occupied-13, Systems/Power: "ContenderOccupation AuthorityMilitarySignificant▼" — against: the occupying power is filed as a Contender that 'Contests the seat' (and Headman's Authority '↑ Holds power' 55 vs 45) while stress occupied says the occupier holds Glenham and the local officials take its orders

### M12. no lane: generators (other) — 8 MED (the package holds 2 HIGH, 8 MED in all)
- **Holders of the writers' files:** none
- **Lines:** #ww-29 #ww-371 #ww-1432 #pf-89 #pf-90 #pf-590 #pf-591 #pf-813
- **Status at the line's tip:** NEW 8
- **Mechanism:** two homes that disagree 7; names a house, a role or a force the town lacks 1
- **Writers (2):**
  - `src/generators/factionDynamics.js :: computeFactionRelationships` — 7: #ww-371 #ww-1432 #pf-89 #pf-90 #pf-590 #pf-591 #pf-813
  - `src/generators/narrative/settlementOriginProse.js :: ORIGIN_POOLS` — 1: #ww-29
- **Examples:**
  - #ww-29, rww-hamlet-famine-1, Summary/Overview: "The shortfall is met through carriage by magic, the caravans that still come, the roads in a good season, or the favour of a patron, and every season the terms…" — against: config._isolationSupport.magicDependent false (paths: local_foodshed, seasonal_access, patronage only); page: "Reliance on magic: None", "No food comes into Ulfset by trade."
  - #ww-371, rww-metropolis-famine-1, Systems/Power: "Grand Guild Consortium gives the orders and Military/Guard carries them out; each needs the other to stay strong." — against: Active Conflicts: "High tension Grand Guild Consortium vs Military/Guard"; Crisis stakes "Military/Guard gains · the military gains in a vacuum of governance"; Military/Guard "Suppressed", "Contests the seat"
  - #ww-1432, rww-village-calm-1, Systems/Power: "Merchant Guilds works under the rules Headman's Authority sets, and pays for a hearing in the hall when it wants something." — against: compound.inst.hasGuild false, hasMerchantGuild false; Overview: 'no guild between seller and buyer'

### M13. lane wc — 6 MED (the package holds 0 HIGH, 6 MED in all)
- **Holders of the writers' files:** wa, wc, wr, fd (with commits of their own: wc)
- **Lines:** #ww-82 #ww-851 #ww-1115 #ww-1375 #ww-1387 #ww-1437
- **Status at the line's tip:** NEW 6
- **Mechanism:** two homes that disagree 3; a figure against the record's 2; presumes normal times under a crisis in force 1
- **Writers (5):**
  - `src/domain/display/defenseDisplay.js :: monthsInWords` — 2: #ww-82 #ww-1437
  - `src/domain/display/defenseDisplay.js :: ORGANIZED_RING_NOTES` — 1: #ww-851
  - `src/generators/computeActiveChains.js :: computeActiveChains` — 1: #ww-1115
  - `src/domain/display/validationOnPage.js :: chainFor` — 1: #ww-1375
  - `src/domain/display/defenseDisplay.js :: CRIM_STRUCTURE_DATA` — 1: #ww-1387
- **Examples:**
  - #ww-82, rww-village-religious_conversion-1, Systems/Defense: "Food endurance: No granary: under siege the outlying fields would be lost; with what is still harvested, household stores would carry the village for about fou…" — against: economicState.foodSecurity.storageMonths 2.4; Summary/Crisis and Economics: "No granary; two months in household stores." Neither "about four months" nor "more than a year on half" follows
  - #ww-851, rww-town-slave_revolt-1, Systems/Defense: "Crime here answers to one ring. It keeps the streets quiet because trouble brings the law, lives on protection money and the officials it pays, and anyone who …" — against: slave revolt in force; the lines just above: "Rebels and guards are fighting in the contested districts. People keep off certain streets, and the regular patrols have stopped."; Foundations "Law & orderCollapsed"; and two crimina…
  - #ww-1115, rww-metropolis-under_siege-1, Systems/Economics: "Needs imported hunting: no local source" — against: Same row names 'Hunting grounds' as the source; config.nearbyResources includes hunting_grounds; Resources tab: Hunting Grounds 'Abundant'.

### M14. no lane: people generators — 5 MED (the package holds 0 HIGH, 5 MED in all)
- **Holders of the writers' files:** none
- **Lines:** #pf-285 #pf-286 #pf-421 #pf-474 #pf-488
- **Status at the line's tip:** NEW 5
- **Mechanism:** two homes that disagree 2; a ruler, a power, a holder or a claimant that is not so 1; other: the caretaker form put on the keeper's own honorific, not on an office of the seat 1; other: the caretaker form put on the keeper's own honorific 1
- **Writers (4):**
  - `src/domain/people/allegiance.js :: leaveAllegianceReceipts` — 2: #pf-285 #pf-286
  - `src/generators/people/goals.js :: PERSON_HOUSE_PLACE` — 1: #pf-421
  - `src/domain/people/seatKeeper.js :: keeperFormOf` — 1: #pf-474
  - `src/domain/people/cardPowers.js :: caretakerFormOf` — 1: #pf-488
- **Examples:**
  - #pf-285, rpf-city-succession_void+politically_fractured-13, World/NPCs: "Hidden allegianceanswers to Front businesses, through Vibia Strabo" — against: Front businesses' face is Nerva Serranus (npcs institution.key "Front businesses"); Vibia Strabo is 'Thieves' guild chapter' (her card, 'In no power')
  - #pf-421, rpf-metropolis-calm-13, World/NPCs: "Wants Win the governor's office first call on any help those who govern can give this season." — against: Predrag Lazarev IS the governor and holds the seat (structuralRank 'head', Ducal Governorship:1); asking 'those who govern' for help is a subordinate line on the seat-holder's card.
  - #pf-474, rpf-town-succession_void-13, Systems/Power: "The seatStands empty; the succession is unsettled. Acting Fixer Vipsanius Caesar keeps the seat meanwhile." — against: npcs[npc_town_hall].title "the council's fixer"; caretakerFormOf("Fixer") prints "Acting Fixer": he is the fixer, not acting as one, and "fixer" is not the seat's office. Record has no keeper field; Corrupt Council modifiers ["va…

### M15. no lane: economy generators — 3 MED (the package holds 0 HIGH, 3 MED in all)
- **Holders of the writers' files:** none
- **Lines:** #ww-339 #ww-522 #ww-1357
- **Status at the line's tip:** NEW 3
- **Mechanism:** two homes that disagree 2; presumes normal times under a crisis in force 1
- **Writers (2):**
  - `src/generators/economy/incomeLineSiblings.js :: GRAIN_OWN_FIELDS_LINE` — 2: #ww-339 #ww-1357
  - `src/generators/economy/viability.js :: generatePowerDynamics` — 1: #ww-522
- **Examples:**
  - #ww-339, rww-metropolis-famine-1, Systems/Economics: "Grain Sales Grain from local fields sold within the settlement: it eats more than it grows, so none is left to sell to other settlements." — against: foodRecord.failedSource "grain"; stress famine "lost its harvest for a second season"; Economics "With the grain harvest gone"
  - #ww-522, rww-town-under_siege-1, Systems/Outlook: "Town remains viable through local foodshed, reserves, seasonal access, patronage (57/52 capacity)." — against: same tab: '✗ Not viable' and 'Sanctavallis cannot last as things stand.'; '(57/52 capacity)' is capacity-sum machinery; 'seasonal access' under a siege that has cut every road
  - #ww-1357, rww-city-recently_betrayed-1, Systems/Economics: "Grain Sales Grain from local fields sold within the settlement: it eats more than it grows, so none is left to sell to other settlements." — against: economicState.primaryExports includes 'Milled flour'; Resources Export Potential 'bread, beer, animal feed'.

### M16. lane up — 2 MED (the package holds 0 HIGH, 2 MED in all)
- **Holders of the writers' files:** up
- **Lines:** #ww-414 #ww-516
- **Status at the line's tip:** NEW 2
- **Mechanism:** a figure against the record's 1; a count 1
- **Writers (2):**
  - `src/generators/economy/economicState.js :: generateEconomicState` — 1: #ww-414
  - `src/generators/safetyProfile.js :: generateSafetyProfile` — 1: #ww-516
- **Examples:**
  - #ww-414, rww-metropolis-wartime-1, Systems/Economics: "Church Tithes & Rents Mandatory tithes plus rent income from church-owned land dominating the local economy." — against: economicState.incomeSources: Market Taxes 21, Guild Licensing 13, Church Tithes & Rents 12, Financial Services 11, Property Rents 9 ... Pilgrim Trade 5: the line shows 12%, the third source
  - #ww-516, rww-town-under_siege-1, Systems/Defense: "Territorial gangs control specific districts, extorting local businesses and residents." — against: one 'Street gang' in institutions[]; population 682

### M17. no lane: the institution catalogue and its descriptions — 2 MED (the package holds 0 HIGH, 2 MED in all)
- **Holders of the writers' files:** none
- **Lines:** #ww-798 #ww-966
- **Status at the line's tip:** NEW 2
- **Mechanism:** two homes that disagree 1; internal text 1
- **Writers (1):**
  - `src/data/institutionBacking.js :: ROWS.at` — 2: #ww-798 #ww-966
- **Examples:**
  - #ww-798, rww-city-calm-1, Systems/Power: "Thieves' guild chapter" — against: printed with "handled by Lesya Komarov, the network's head (Smuggling network)"; NPCs: Lesya Komarov heads the Smuggling network and Emil Bogdanov is the guildmaster of thieves — each ring is said to be handled by the other ring'…
  - #ww-966, rww-town-occupied-1, Systems/Defense: "Gates (if walled)" — against: catalogue qualifier printed in the house name ('(multiple)', '(if walled)'); the Institutions tab itself calls the gates 'Town gates'

### M18. no lane: display leaves (src/domain/display) — 1 MED (the package holds 1 HIGH, 1 MED in all)
- **Holders of the writers' files:** none
- **Lines:** #pf-260
- **Status at the line's tip:** NEW 1
- **Mechanism:** two homes that disagree 1
- **Writers (1):**
  - `src/domain/display/governanceAccount.js :: governanceAccountOf` — 1: #pf-260
- **Examples:**
  - #pf-260, rpf-city-succession_void+politically_fractured-13, Systems/Power: "No one holds the seat at Portacastra. The Noble Governorship governs without a head. Prosperity and strong defences have earned the Noble Governorship the appr…" — against: 'governs without a head' vs same tab 'Acting Governor Iulia Laenas keeps the seat meanwhile', 'Acting Governor · Iulia Laenas' at the head of the ruling three, and 'The head of Noble Governorship answers to Front businesses.' (np…

### M19. lane bd — 1 MED (the package holds 0 HIGH, 1 MED in all)
- **Holders of the writers' files:** bd
- **Lines:** #ww-916
- **Status at the line's tip:** NEW 1
- **Mechanism:** broken text 1
- **Writers (1):**
  - `src/domain/display/stateProse/generalStateProse.js :: generalStateProse` — 1: #ww-916
- **Examples:**
  - #ww-916, rww-hamlet-mass_migration-1, World/History: "Founded by:a miller who built a mill and found customers before they found customers" — against: "found customers before they found customers" is self-contradictory nonsense; and the hamlet has no mill (Access to external mill)

### M20. several lanes, shared commits only: wr, fd — 1 MED (the package holds 0 HIGH, 1 MED in all)
- **Holders of the writers' files:** wr, fd (with commits of their own: none)
- **Lines:** #pf-504
- **Status at the line's tip:** NEW 1
- **Mechanism:** presumes a state that is not so 1
- **Writers (1):**
  - `src/data/dossierStateProse/warFaith.generated.js :: DS-WAR-5 › a stream: true treaty term (the installment shape) · v3` — 1: #pf-504
- **Examples:**
  - #pf-504, rpf-town-succession_void-13, Table/Tonight sheet: "Wants to be the one people turn to when the seat fails." — against: The seat already stands empty (Power tab: "The seatStands empty; the succession is unsettled"; Corrupt Council modifiers ["vacant"]); "when the seat fails" presumes it has not. Also differs from Felix Aurelius's card want ("Find …

## What I did not measure
- **No cold read of my own.** A line's falseness is the list reader's; I placed and attributed. What prints in place of a line that a lane removes was not read for these lists (the cut's step 2 was not repeated).
- **The name folding is by shape**, not by the towns' records. A writer found through a short common run may be wrong. Each line's `writer.run` and `evidence` is in the JSON. The form rule's 68 assignments are PLAUSIBLE where marked.
- **SAME FAULT is strict:** the same function and the same mechanism class. A different variant of the same corpus combination is NEW here, though it may share a selector fault with a cut line.
- **A cut line cured on a lane** in the cut's twenty towns is not proved cured in these towns (64 SAME FAULT lines).
- **The data lane's second read** was not taken, as the chair said.
