| town | HIGH | MED | LOW |
|---|---|---|---|
| bar0-metropolis-calm-rand-1 | 0 | 9 | 25 |
| bar0-city-under_siege+famine-rand-1 | 2 | 23 | 53 |
| bar0-city-wartime-rand-1 | 2 | 12 | 27 |
| bar0-thorp-calm-rand-1 | 0 | 15 | 10 |
| bar0-town-occupied-rand-1 | 0 | 17 | 20 |
| bar0-hamlet-calm-rand-1 | 2 | 3 | 12 |
| bar0-town-calm-rand-1 | 0 | 5 | 8 |
| bar0-hamlet-under_siege-rand-1 | 1 | 8 | 17 |
| bar0-village-famine-rand-1 | 1 | 9 | 9 |
| bar0-village-calm-rand-1 | 1 | 7 | 7 |
| **all ten** | **9** | **108** | **188** |
| average a town | 0.9 | 10.8 | 18.8 |

| kind (a row of several kinds counts under each) | HIGH | MED | LOW |
|---|---|---|---|
| a | 4 | 17 | 36 |
| b | 1 | 1 | 2 |
| c | 3 | 48 | 61 |
| d | 1 | 4 | 10 |
| e | 0 | 5 | 8 |
| f | 1 | 13 | 11 |
| g | 5 | 75 | 83 |
| h | 1 | 6 | 16 |

| first-named kind | HIGH | MED | LOW |
|---|---|---|---|
| a | 4 | 17 | 32 |
| b | 1 | 1 | 2 |
| c | 2 | 40 | 58 |
| d | 1 | 2 | 8 |
| e | 0 | 4 | 8 |
| f | 0 | 3 | 11 |
| g | 1 | 37 | 55 |
| h | 0 | 4 | 14 |

HIGH rows, writer and its holders current tips (true = the run still stands there):

- #35 city-under_siege+famine-rand-1 · Summary/Overview · "Agiospolis's gates are open but attended: every person entering is noted, every cart searched." (c|g) → `src/data/narrativeData.js:165` (under_siege); r2-code-a-2026-11-13 stands, coherence-upkeep-2026-11-12 stands
- #75 city-under_siege+famine-rand-1 · Systems/Economics · "Agiospolis was poor even while its trade moved freely, and the siege has stopped it moving at all." (g|c) → `src/data/dossierStateProse/economy.generated.js:181` (pools); w2-fix-data-2026-11-13 **cured**, w2-write-2026-11-13 stands, w2-write-side-eco-2026-11-13 stands, w2-write-side-rest-2026-11-13 stands
- #115 city-wartime-rand-1 · Systems/Economics · "Arcane Industry Enchanting contracts, magical research commissions, and the licensing of spellcastin" (a) → `src/generators/economy/economicState.js:311`; coherence-upkeep-2026-11-12 stands
- #116 city-wartime-rand-1 · Systems/Resources · "timber leaves Naranjotzin half-finished, and nobody in the city is troubled by it." (b|g|h) → `src/data/dossierStateProse/economy.generated.js:5544` (pools); w2-fix-data-2026-11-13 stands, w2-write-2026-11-13 stands, w2-write-side-eco-2026-11-13 stands, w2-write-side-rest-2026-11-13 stands
- #216 hamlet-calm-rand-1 · Systems/Outlook · "Nothing reliable reaches Saltosinum from outside, and its own land does not grow enough; the rest co" (c|f) → `src/domain/display/dossierViewModel.js:267`; w2-fix-data-2026-11-13 stands, w2-c-leaves-2026-11-13 stands, coherence-upkeep-2026-11-12 stands, w2-write-2026-11-13 stands, w2-write-side-eco-2026-11-13 stands, w2-write-side-rest-2026-11-13 stands
- #217 hamlet-calm-rand-1 · Systems/Defense · "Visitors to Saltosinum are told which few streets to avoid, and the advice turns out to be right." (d) → `src/data/dossierStateProse/defense.generated.js:2596` (pools); r3-tabs-2026-11-13 stands, w2-fix-data-2026-11-13 stands, coherence-upkeep-2026-11-12 stands, w2-write-2026-11-13 stands, w2-write-side-eco-2026-11-13 stands, w2-write-side-rest-2026-11-13 stands
- #246 hamlet-under_siege-rand-1 · Systems/Economics · "Faith carries real weight in Torriplenum's money. What the religious houses take in and spend is a l" (a|g) → `src/data/dossierStateProse/economy.generated.js:6419` (pools); w2-fix-data-2026-11-13 stands, w2-write-2026-11-13 stands, w2-write-side-eco-2026-11-13 stands, w2-write-side-rest-2026-11-13 stands
- #272 village-famine-rand-1 · Systems/Power · "The powerElder Council (significant)mage-advised" (a) → `src/generators/power/rulingStructure.js:317` (generatePowerStructure (informalModifier: magic → "mage-advised")); powers-follow-up-2026-11-13 stands
- #291 village-calm-rand-1 · Systems/Power · "Elder Council has been debating market levies for three months." (a,g) → `src/generators/power/governanceNarrative.js:481`; powers-follow-up-2026-11-13 stands, coherence-upkeep-2026-11-12 stands

Not traced (MED): #124 "Medical treatmentSurgeryQuarantine"; #136 "Pressured"; #169 "The Charter Fair"; #170 "The Greening Fair"; #182 "Public legitimacyCritical"; #195 "Fish & Maritime Produce"; #198 "The powerMerchant oligarchy (strong)corruption-rid"; #213 "Pressured"; #219 "Pressured"; #235 "Stone Quarrying"; #249 "Faith & WorshipReligion & civic✓ Running"; #276 "✓ Fully exploitedGrainmedium value"; #293 "Safety"; #294 "Lodging(2)▲"
