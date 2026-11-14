# NOLANE-1 HAND-BACK: the false lines no lane holds (kept current after every item)

> **HANDED BACK at 12:4x on 2026-11-14.** The seat's count read 359,723 at the last waking; the remaining room could not hold a full cure with its reading and gates. The tip on origin is given in the chair message. Done: item 0's table (48d0805a0), LV-CAPITAL cured (b93ac6760), and ruling 3 read (7fdef7667). The next seat starts at WHAT IS LEFT, item 1, R2B-979 by the chair's ruling (1), then BAR-169/170, scoped below.

Seat NOLANE-1, brief `origin/lane/chair-2026-11-08:docs/chair/2026-11-14/briefs/BRIEF-NOLANE-1.md`. Branch `lane/join-nolane-2026-11-14`, cut from the joined branch's tip **1e33be746** as it stood on origin when the seat began (the brief named 85e10f1e5; the merge seat had committed 035159bc7 and 1e33be746 since: registers and tests only).

## The laws worked to

The brief's, as written: a line that names a house, role, practice or force reads the roster; a line that presumes normal times reads the crisis in force; a line written for a town's size is not printed in a thorp; two lines on one page read one fact; two things a page says are set apart; no surface prints a catalogue name's bracket, a stored key or the machinery; a tie has one direction; a note on a chain names the ground the chain works and a tradition the town holds. Where no true line exists, the line is silent. A cure in generator or data code is a declared move; the defence rating is fenced (`src/domain/magicReliance.js` is measured and named, never changed). THE CHAIR'S RULINGS (12:19, 2026-11-14; each vetoable by the owner):

1. **R2B-979.** A WORD IS PRINTED UNDER THE NAME OF WHAT IT MEASURES. The standing word (established, marginal, commanding) leaves the disposition list. It prints as the person's STANDING, under its own label, on every surface that prints the disposition. The pinned test is re-keyed BY IDENTITY: the disposition list holds temperament, loyalty and fear, and the standing is asserted under its own label. Display only. The new label goes on the veto list. Check the holders by content first. It takes its place by its width, after the first three cures.
2. **LV-PALISADEQUARRY** STAYS PARKED by the earlier ruling (those supply-chain rows do not move before the release). It is listed under WHAT IS LEFT with its count.
3. **R2A-LEFT-GOVECON** is not judged by script. Read THIRTY of the 205 prints by eye against each tie's two people, and report the false share. Cure only if it is one condition in a file no lane holds.
4. **BAR-182.** The page prints ONE home: the record's stored label. The Foundations tab reads it.

## Item 0: the table

**The instrument.** One script: `tools/table.mjs` in the seat's scratchpad, kept with this hand-back's commit as `docs/chair/2026-11-14/probes/NOLANE-1/table.mjs` and `load.mjs`.
- **Towns:** the SECOND-WAVE-CENSUS 720 born at 1e33be746 by its own `census.sh` (births 720, 0 errors; 720 dumps), plus the BAR-0 probe's 90 named towns (rr2s 20, rww 30, rpf 30, bar0 10) rendered at 1e33be746 by that probe's own `render2.sh`.
- **What a row counts:** each row has a printing test on the rendered page (every tab, the owner's view) and a falsity test on the town's record. **prints** is how many towns the sentence prints in; **false** is how many of those the record makes false.
- **Limits:** the dumps are the tabs and the Tonight sheet only, so the PDF, the Foundry journal and the exports are not counted here. A claim of zero below is a claim about the tabs.
- **Holders:** a row's writer is held by a lane when that lane changed it by content: the lane's diff (merge-base with `lane/integration-2026-11-07` .. the lane's tip on origin) touches the writer's own unit (the function, or the data entry, the row names), at each of the nine lanes' tips as fetched on 2026-11-14 (`tools/unitholders.mjs`).

### Still false, no lane's: MINE, widest first

| row | towns false / printing (720) | named towns | writer (unit) |
|---|---|---|---|
| LV-CATHEDRAL | 100 / 100 | 11 / 11 | `src/data/economicData.js` the two cathedral rows of TRADE_DEPENDENCY_NEEDS ("Religious services, pilgrimage … here depend on stone brought in") |
| BAR-169/170 | 65 / 278 (a "… Fair" tradition beside the page's own "No market or fair stands") | 7 | `src/data/traditionCorpus.js` act `fair` (no needs); `src/components/new/tabs/TraditionsTab.jsx :: filterDeclared` |
| BAR-182 | 48 / 112 (Foundations "Public legitimacy Critical" where the Power tab prints "Contested") | 9 | two homes: `src/domain/causalState.js :: derivePublicLegitimacy` vs the record's `publicLegitimacy.label` |
| LV-CAPITAL | 40 / 40 ("Capital" as an import pill) | 5 | `src/data/tradeListDeclarations.js :: NOT_A_GOOD` |
| LV-CANNOTPRODUCE | 33 / 33 (a "Settlement necessity" import that the record's localProduction also lists) | 8 | `src/generators/economy/tradeGoods.js :: deriveNecessityImports` |
| BAR-293 | 28 / 28 (Systems Health "Safety" with no value, all thorps) | 6 | `src/components/new/tabs/OverviewTab.jsx` the Safety StatusTag line |
| LV-MAGICNOTES | the forest note on reed 9 / 29 · "Conjured game produces fish" 6 / 6 · the farmland note on salt 5 / 35 · the quickening note on salt 4 / 16 · a druidic note under a siege 4 / 55 | 1 | `src/generators/chainMagicSubstitution.js :: applyMagicSubstitution` |
| CRP-SLOTLABELS (palisade) | 25 / 25 ("man the palisade or earthworks") | 0 | `src/domain/display/stateProse/defenseStateProse.js :: defworkFill` |
| BAR-274 | 19 / 75 (the Entrepôt income line's "warehouse fees" with no warehouse) | 5 | `src/generators/economy/tradeGoods.js :: generateTradeIncomeStreams` |
| R3C-REVOLTNOTE | 11 / 24 (the slave revolt's "everyone who keeps order" where no force stands) | 0 | `src/data/stressTypes.js` slave_revolt.viabilityNote; twin `src/data/stressTypesMeta.js` |
| LV-ARCANENONE (FENCED) | 9 / 488 beside a magic power of any standing; 0 under the narrower ruling (a governing power or a named mage: already true) | 1 | `src/domain/magicReliance.js :: magicPractitioners`: measured and named only |
| LV-PROCHOUSES | 5 / 10 | 2 | `src/data/resourceChains.js` processingInstitutions with no catalogue row |
| LV-OTHERNEED | 5 / 5 by a lenient reading (a house sharing no word with the chain's own houses); the source counted 67 | 0 | `src/generators/computeActiveChains.js` the dependency join (the display gate `chainNeedShown.js` is w2-c-leaves's) |
| R2A-LEFT-GAME | 4 / 9 ("selling the game in the market", no market) | 1 | `src/data/people/titleSecretsPresentations.js` ROWS "the master of the hunt" |
| UPK-W5 | 2 / 2 (the can-pay row beside the doom line) | 0 | the pools are corpus pools (`defense.generated.js`), and the key `defenseStateProse.js :: economicRowPoolKey` is no lane's |
| R2A-CUSTOMS | 1 + 1 (customs, magistrate) | 0 | `src/data/npcData.js :: STRESS_ECONOMIC_EFFECTS`. PARKED by its source with the words `customs house` and `court`: no new vocabulary word may be written |
| R2A-LEFT-LANISTA | 0 / 13 in the 720; 1 in its own town rr2s-metropolis-plague_onset-port-1 | 1 | `src/data/npcData.js :: STRESS_ECONOMIC_EFFECTS.mil_crim_corruption` |

### Printing, and a ruling rather than a cure

| row | figures | why it is not cured here |
|---|---|---|
| R2B-979 | 461 / 720 print "Disposition …, established/marginal/commanding" | The standing word sits in the disposition list by design: `npcInteriorityRead.js` documents disposition as "temperament, standing, loyalty, fear", and `tests/domain/npcInteriorityRead.test.js:35` pins `['stern', 'commanding', …]`. Re-deciding a pinned design belongs to the chair or the owner. |
| LV-PALISADEQUARRY | 57 / 122 | The fortification, divine_healing and pilgrimage rows in `supplyChainData.js` were ruled to stay unchanged before the release (W2-FIX-DATA-HANDBACK-6 §8, as the extraction read it). |
| R2A-LEFT-GOVECON | 205 print, none judged | Judging these needs each tie's council membership. The script does not read that, so they are left unjudged. |

### Still false: A LANE'S (named, never cured here)

| row | figures (720 / named) | lane: the unit it changed |
|---|---|---|
| CRP-SLOTLABELS (Military/Guard in prose) | 200 / 24 | powers-follow-up: the faction label. `FACTION_LABEL_SIBLINGS['Military/Guard']` was banked at point 49 as `after-base: powers`. |
| CRP-SLOTLABELS (gold/silver ore) | 93 / 14 | w2-c-leaves and r2-code-b: `EconomicsTab.jsx:837` "Needed, and not brought in:" |
| DATA-ROW7 ww-798 | 66 print "handled by …, the network's head (Smuggling network)" | the powers lane (`patronage.js`, WhoRunsThisTownPanel). Not judged ring by ring. |
| LV-DIVINENOTE | 43 / 3 | w2-c-leaves: the Economics card reads its `magicNoteShown`, but `MagicTab.jsx:191` prints `c.magicNote` raw (the 43 are on the Magic tab) |
| BAR-124 | 31 / 6 | w2-c-leaves: `tradeListDisplay.js :: chainOutputsShown` / `chainMakesHere` |
| BAR-198 | 28 / 9 | powers-follow-up: `PowerTab.jsx :: RulingChainBlock` |
| R2A-LEFT-CRISISSECRET | 14 (count) + 12 (sortie) / 7 | r2-code-a: `stressInstitutionEffects.js` plague_onset, under_siege |
| DATA-ROW7 pf-702 | 24 / 2 ("Fence (word of mouth)", a catalogue bracket) | r2-code-b: the house-label display strip |
| PWR-1432 | 24 / 2 | powers-follow-up: `rulingStructure.js :: generatePowerStructure` |
| PWR-SYMB | 16 / 2 | r3-code-c: `factionDynamics.js :: computeFactionRelationships` |
| R3T-F9 | 9 / 3 | r3-tabs: `defenseStateProse.js :: seaRoute` |
| R3T-F10 | 6 / 1 | coherence-upkeep: `foodGenerator.js :: generateFoodSecurity` |
| R2A-LEFT-FLAVOR | 4 + 0 / 3 | r2-code-a: `narrativeText.js :: POLITICAL_FLAVOR` |
| R2A-UNDERWORLD (protection) | 2 / 0 | powers-follow-up: `castPowers.js :: landMemberships`; r2-code-a: `npcGenerator.js :: mergeNPCLists` |
| R2A-LEFT-TORN | 1 / 2 | r2-code-a: `narrativeText.js :: PRESSURE_SENTENCES` |
| R2A-LEFT-RATION | 0 / 1 (its own town) | r2-code-a: `PRESSURE_SENTENCES` |
| BAR-83 | 0 / 1 (its own town bar0-city-under_siege+famine-rand-1: the yield chips print with no label on an impaired, depleted chain in a famine) | w2-c-leaves: the EconomicsTab chain card |
| LV-CHARCOALPILLS | 1 (r2s-under_siege-village-0, doubtful) | w2-c-leaves: `chainWorking.js :: WORKED_BY_HOUSE` |
| R2B-693 | 148 print, not judged | PARKED by its source: the powers lane's ruling |
| R3T-F4 | not counted (the 13 lines are not quoted at any source the seat could read) | the corpus lane (pools); r3-tabs (`properFill`) |
| LV-UNEXPLOITED | the PDF, not counted here | coherence-upkeep and w2-c-leaves: `viewModelBodySlices.js`. Already reads `housesStillNeeded` at the tip. |
| UPK-RANGE-CHAIN | 0 | coherence-upkeep: `viability.js` (and already true on the 810) |
| LV-GAMBLING | 0 false / 183 print "semi-organized" | the leaves lane's seat (`defenseDisplay.js`); already true on the 810 |
| BUNDLE-LV-CENSUS | members on EconomicsTab.jsx (r2-code-b, w2-c-leaves), defenseDisplay.js (the leaves seat), chainNeedShown.js (cured at the join) | the one left that is no lane's: `computeActiveChains.js` b (5 / 5 at the source), not re-counted |
| BUNDLE-R2B-INC | members in `tonightSheet.js`, `npcComponents.jsx`, `PowerStrata.jsx`, `crisisCast.js`, `viability.js`, `traditionCorpus.js`, `faithReading.js`, `settlementQuickGuide.js`, NPCsTab, RelationshipsTab | the bundle's own lanes; not re-counted member by member |

### Already true (struck), with the instrument's count on 810 towns

- **LV-DIVINENOTE (alchemy):** 0 / 21.
- **LV-MAGICSUPPLY:** 0.
- **R2A-UNDERWORLD (informant):** 0 / 31.
- **R2A-LEFT-PLAINS:** 0 / 19.
- **R2A-L02:** 0 / 3, where the one water reading `waterAccessKind` is maritime. Its own town rr3-city-calm-rand-1 is not among the births.
- **R2A-LEFT-COHESION:** 0 / 5.
- **R2A-LEFT-MILWEAVER:** prints in no town.
- **BAR-294:** its own town now shows two rows under Lodging(2): Hospitality and Dwellings.
- **UPK-FISHCOMM:** the text is gone (7802efdb7).
- **DATA-PARISH:** prints in no town.
- **CRP-SLOTLABELS ("bought its capital"):** 0.

### Not found

- **CRP-IMPORTREASON:** `/Required by .+ but not available in/` prints on no tab of the 810.
- **CRP-ONESOURCE:** the one-source lines print in 205 towns. The script's reading (a depleted resource condition beside a single food source) finds 0, but it is weak and does not settle the row.
- **DATA-ROW6:** its source did not read it and quotes no pill, so it is not measured.

## The cures (item 1)

**THE FILE RULE.** Before the first edit of a file, the seat ran `git diff --stat origin/lane/integration-2026-11-07 origin/<lane> -- <file>` against each of the nine lanes, as the brief requires. Seven MINE rows have their true writer in a file another lane has changed. Under the rule they move to FOR THE JOIN (below): named with the one-line change, never cured here.

1. **LV-CAPITAL: CURED.**
   - **Change:** `src/data/tradeListDeclarations.js :: NOT_A_GOOD` takes `'Capital'`. That is money, the caravan masters' "Capital + trade access" need cut to its first part, not a good shipped. It has no revenue home, so it prints nowhere.
   - **Display only:** the record's lists are untouched; no declared move.
   - **Red first:** the arm `tests/domain/display/tradeListDisplay.test.js` › "Capital" is not a good shipped, a collected arm over the census births r2r-city-0/1/3. It was red on r2r-city-0 ("expected [ 'Capital', 'Salt', … ] to not include 'Capital'") and is green after the change (10/10).
   - **Measured:** 41 of the 720 records carry it (35 cities, 6 metropolises); 40 printed it.
   - **Gates:** the presumed-things door's fresh count is 153, as at the base. The twelve-birth grid shows no rise (exit 0). eslint is clean on both files. The walkers' reds are the base's at 1e33be746, the same counts: the lighting census's file count (3448 vs 3251), and the presumed-things walker's 3 of 43.

## Every new or changed line, with the towns it was read in

**LV-CAPITAL: newly silent.** The Imports pill "Capital" leaves the Economics tab. It was read on the rendered tab at the seat's tree in five towns:
- **r2r-city-0, r2s-famine-city-0, r2s-occupied-city-2 (cities):** the pill is gone and every other import stays.
- **r2s-famine-metropolis-3 (metropolis, the largest size it reaches):** the pill is gone and every other import stays.
- **r2s-under_siege-city-3 (siege):** under the siege it printed no Imports pill, before or after.

The smallest size it reaches is the city.

**Found there, not mine:**
- **The raw chip "Needs Capital + trade access"** still prints on that siege city's chain card. The writer is the EconomicsTab chain card (w2-c-leaves).
- **The Faith tab's "Patron deity" block** printed in the census render but not in this re-render of the siege city. Nothing in the change reaches the Faith tab. This is PLAUSIBLE render noise and is not counted.

## Declared moves by family

None: LV-CAPITAL is display only.

## FOR THE JOIN: MINE rows whose writer file another lane has changed (the file rule), each with its one-line change

| row | figures | the file, and the lane that changed it | the one-line change |
|---|---|---|---|
| LV-CATHEDRAL | 100 | `src/data/economicData.js` (w2-fix-data) | the two cathedral rows' `svcs` name what the stone keeps up: e.g. `["building repairs"]`, not religious services, pilgrimage and teaching. A declared move on `dependency.affectedServices` and the Services tab's at-risk marks for those services. |
| BAR-182 | 48 | `src/components/new/tabs/SubstrateTab.jsx` (r3-tabs), `src/domain/causalState.js` (coherence-upkeep) | by the chair's ruling: the Foundations legitimacy row prints the record's stored `powerStructure.publicLegitimacy.label` |
| BAR-293 | 28 thorps | `src/components/new/tabs/OverviewTab.jsx` (coherence-upkeep) | the Safety StatusTag prints the record's band or is left out. Not traced further. |
| defworkFill ("palisade or earthworks") | 25 | `src/domain/display/stateProse/defenseStateProse.js` (r3-tabs) | `defworkFill` returns "palisade" for the catalogue house "Palisade or earthworks" |
| R3C-REVOLTNOTE | 11 | `src/data/stressTypes.js` (w2-fix-data); twin `stressTypesMeta.js` | the viabilityNote names no keepers of order where the town holds no force (both twins) |
| R2A-LEFT-GAME | 4 | `src/data/people/titleSecretsPresentations.js` (powers-follow-up) | the row takes the roster's no-market rule, or a twin "sold on the quiet" |
| R2A-LEFT-LANISTA, R2A-CUSTOMS, R2A-LEFT-GOVECON | 1, 2, (to be read) | `src/data/npcData.js` (r2-code-a) | mil_crim_corruption takes a holder that commands; CUSTOMS is parked with its words |

## What is left (mine, in clean files, widest first)

1. **R2B-979:** 461 towns, by the chair's ruling (1). It comes after the first three cures. `npcInteriorityRead.js` and `npcComponents.jsx`: the holders are to be checked by content; npcComponents is r2-code-b's.
2. **BAR-169/170:** 65 towns, a fair tradition where no market or fair stands. **SCOPED, NOT BEGUN.**
   - **The cure site:** `src/components/new/tabs/TraditionsTab.jsx` (no lane's file). Its filter declares only the motif ELEMENT's needs (`ELEMENT_NEEDS`, from `TRADITION_ELEMENTS`). The act `fair` (`traditionCorpus.js`, r2-code-b's file) declares none.
   - **The one change:** the filter also takes the act's need, a local `ACT_NEEDS` of `fair → ['market']`. `market` is a registered presence atom (`facts/factVocabulary.js:267`), so no new word is needed. Display only, kind A: no draw moves.
   - **Still to do:** the red arm over the births; a guard town (a fair in a town with a market still prints); the reading on World/Traditions in three towns (the smallest is a thorp, as in bar0-thorp-calm-rand-1 "Tyrby"); and the same filter on every other surface that prints the traditions.
3. **LV-CANNOTPRODUCE:** 33 towns, and **BAR-274:** 19. `src/generators/economy/tradeGoods.js` (declared moves).
4. **LV-MAGICNOTES:** ~28 towns. `src/generators/chainMagicSubstitution.js` (a declared move on `magicNote` only; `facts/magicSource.js :: MAGIC_NOTE_TRADITION` must carry any new note).
5. **LV-PROCHOUSES:** 5, and **LV-OTHERNEED:** 5. `resourceChains.js` and `computeActiveChains.js`.
6. **R2A-LEFT-GOVECON: READ (ruling 3).** The first 30 printing towns of the 720 were read in census order, each tie's two people against their `memberships`.
   - **The bloc line** ("share a council bloc and a list of enemies"), 29 read: **15 FALSE**. The two people share no power: one of them holds none, or they sit in different powers.
     - The 15: r2r-village-31, r2r-town-2, -3, -6, -8, -13, -21, -25, -40, -47, r2r-city-0, -3, -5, -6, -7.
     - The 14 TRUE: both sit in one power.
   - **The loan line**, 1 read (r2r-town-51): TRUE. The asker stands outside the governing oligarchy, whose member the other is.
   - **The false share: 15 of 30, half.** It is one condition: the bloc line needs the pair to share a power membership.
   - **The file:** `src/data/npcData.js :: STRESS_ECONOMIC_EFFECTS.wary_alliance` (with the tie's draw in `people/ties.js :: drawTies`). The file is r2-code-a's by the file rule, so the row is NAMED FOR THE JOIN, not cured. The one-line change: the wary_alliance pair prose `needs` a power both people are members of, or the tie is drawn only for such a pair.
7. **LV-PALISADEQUARRY:** 57 of 720. PARKED for the owner (ruling 2).
8. **LV-ARCANENONE:** 9 of 720, FENCED (magicReliance.js feeds the defence rating). It is measured and named. Counting a magic power of any standing as a practitioner would move `deriveMagicReliance`, and with it the score.

**How the instruments are re-made:**
- `census.sh <tree> <out>` from the SECOND-WAVE-CENSUS probe (git archive of origin/lane/second-wave-census-2026-11-12).
- The BAR-0 probe's `render2.sh` for its four seed files.
- Then `node docs/chair/2026-11-14/probes/NOLANE-1/table.mjs <tree> <census-out> <r90-dir> <out.json>`.
