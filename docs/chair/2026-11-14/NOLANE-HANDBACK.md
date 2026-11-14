# NOLANE-1 HAND-BACK: the false lines no lane holds (kept current after every item)

Seat NOLANE-1, brief `origin/lane/chair-2026-11-08:docs/chair/2026-11-14/briefs/BRIEF-NOLANE-1.md`. Branch `lane/join-nolane-2026-11-14`, cut from the joined branch's tip **1e33be746** as it stood on origin when the seat began (the brief named 85e10f1e5; the merge seat had committed 035159bc7 and 1e33be746 since: registers and tests only).

## The laws worked to

The brief's, as written: a line that names a house, role, practice or force reads the roster; a line that presumes normal times reads the crisis in force; a line written for a town's size is not printed in a thorp; two lines on one page read one fact; two things a page says are set apart; no surface prints a catalogue name's bracket, a stored key or the machinery; a tie has one direction; a note on a chain names the ground the chain works and a tradition the town holds. Where no true line exists, the line is silent. A cure in generator or data code is a declared move; the defence rating is fenced (`src/domain/magicReliance.js` is measured and named, never changed). No chair ruling has arrived since the brief.

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

(none yet)

## Every new or changed line, with the towns it was read in

(none yet)

## Declared moves by family

(none yet)

## What is left

Every MINE row above, in the order given.
