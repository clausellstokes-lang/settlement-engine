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
   - Outputs: `out/inc-classified.json`, `dumps-line-and-lane.tar.gz`.

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

## THE NEW PACKAGES — MEDIUM

(next push)
