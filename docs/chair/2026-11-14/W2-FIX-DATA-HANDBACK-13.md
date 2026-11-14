# W2-FIX-DATA-13: the data lane goes on curing (kept current after every item)

**State: IN PROGRESS (cure 1 of the table pushed).** Every figure EXECUTED unless marked PLAUSIBLE.

**Seat.** The thirteenth seat on `lane/w2-fix-data-2026-11-13`, from `c4d941895` (read back from origin first: the brief's tip, no stop). Chair: `session_01ACmDYZrFEVXyZEUg1NDxxC`. Brief: `origin/lane/chair-2026-11-08:docs/chair/2026-11-14/briefs/BRIEF-W2-FIX-DATA-13.md`. Nothing at or below c4d941895 is rewritten.

## 0. Instruments (re-made in minutes)

- Scratch worktree `/home/user/wt13` on local branch `w13` at the lane's tip, `npm ci` there (it wrote `core.hooksPath=.husky/_` and the branch's tracking keys into the shared config: nothing else; refs and config snapshotted before and after).
- Pushes: `git push origin w13:refs/heads/lane/w2-fix-data-2026-11-13`, each after `git fetch` and `test -n "$(git rev-list origin/lane/w2-fix-data-2026-11-13..w13)"`.
- Births: the scratchpad's `q/births.mjs` = CENSUS-2's `births.mjs` verbatim (`origin/lane/census-2-2026-11-13:docs/chair/2026-11-13/probes/CENSUS-2/`, by git archive); `q/seedcfg.mjs` = CENSUS-2's plus the bar's `bar0-` branch (`render.bar0.jsx :: cfgFor` verbatim); seeds = CENSUS-2's 720 + `seeds.bar0.txt` = 730 (0 errors). `q/rank13.mjs` (one predicate per row; the record fields the card, the Services tab, the PDF view model and the journal print: `institutions[].desc`, `availableServices.*[].desc`, `arrivalScene`, `history`, `culturalIdentity`/`culturalNotes`; crisis by `domain/facts/crisisKind.js :: activeCrisisTypes`, the market by `domain/facts/market.js :: marketOf`, the food record's `failedSource`/`foodSources`/`band`).

## 1. THE TABLE at the tip c4d941895 (the 730; EXECUTED, `rank13.mjs`)

| row | writer | prints | false | the fact that makes it false |
|---|---|---|---|---|
| DATA-SMELTER (the catalogue's Smelter text "...between mine and smithy") | institutionalCatalog.js | 96 | 57 | the roster lacks a mine or a smith |
| #185 the smelter's variants | institutionDescVariants.js | 21 | 0 | (cured by the eleventh seat; read true) |
| "street kitchens" (the Indic food line) | cultureProfiles.js | 73 | 30 | no market stands (`marketOf`) |
| #158 the compact's grain clause "...the current shortage..." | generators/historyGenerator.js | 20 | 18 | the food band is neither deficit nor famine |
| #233 "Sacks of herbs and spices fill the carts" | arrivalProse.js | 12 | 12 | no spice import |
| #68 "Major livestock sales across all species" (Major annual fairs) | institutionServices.js | 173 | 14 | siege or famine |
| #51 the brewery "for regional sale" / "ships across the region" | institutionDescVariants.js | 115 | 10 | siege or famine |
| #73 "Collect toll from all who cross" | institutionServices.js | 159 | 10 | siege |
| BAR-248 "The weekly service. Attendance expected of all residents." (Access to parish church) | institutionServices.js | 221 | 11 | siege (every one an Access to parish church: the walk out) |
| #67 "The largest trading event of the year. Merchants from distant regions." | institutionServices.js | 179 | 8 | siege |
| #156 "Each family tills a small holding, all of it for the table." | institutionDescVariants.js | 39 | 7 | grain exported |
| #36 "Barrels of salt fish stand stacked for the carts" | arrivalProse.js | 19 | 6 | siege 4, or famine / fish failed |
| #71 "Fish sold daily from the morning catch" | institutionServices.js | 144 | 5 | fish failed or not a source |
| SVC "Fresh produce" (Daily markets) | institutionServices.js | 117 | 5 | famine |
| PAIRS the vintner's "must brought in" | institutionDescVariants.js | 65 | 5 | siege |
| #54 the coaching inn "Built for the road" | institutionDescVariants.js | 57 | 4 | siege |
| BAR-247 "Services mean the walk to the village house of worship" (hamlet) | institutionalCatalog.js | 38 | 4 | siege |
| SVC "Caravan organization" (bar n250) | institutionServices.js | 80 | 4 | siege |
| #157 "His writ is legitimate" (Lord's reeve) | institutionDescVariants.js | 4 | 3 | the reeve is a woman (3 of 4) |
| guild war beside no guild (historyGenerator guild_conflict) | generators/historyGenerator.js | 160 | 3 | no guild on the roster (r2r-village-1, -17, -55) |
| charter hall "...with no garrison to call on it musters the defence" | institutionDescVariants.js | 3 | 3 | RULED (a verdict a band can deny); all three hamlets |
| #60 the ferry "Carts, beasts and walkers wait their turn" | institutionDescVariants.js | 40 | 3 | siege |
| #59 "International merchants. Letters of credit accepted." | institutionalCatalog.js | 57 | 3 | siege |
| #57 the fish market "The morning's catch" | institutionDescVariants.js | 73 | 3 | fish failed |
| SVC "Street food ... roasted meats" | institutionServices.js | 124 | 3 | famine |
| PAIRS the brewery "taverns and ships" | institutionDescVariants.js | 23 | 3 | siege |
| SVC the Annual fair "Livestock auction" | institutionServices.js | 22 | 2 | siege |
| "the guilds negotiated a formal compact" beside no guild | generators/historyGenerator.js | 22 | 2 | no guild (r2s-slave_revolt-hamlet-1, bar0-village-famine-rand-1) |
| the stress opener "gates are open but attended: every person entering" | (the stress opener's pool) | 2 under a siege | 2 | siege |
| the arrival's lanes of stalls under a siege | arrivalProse.js | 8 | 0 | READ TRUE here (no besieged town draws it) |
| the arrival's carts under a siege ("Carts and timber block the lanes": the barricade) | arrivalProse.js | 9 | 0 | READ TRUE (the barricade); the salt-fish carts are #36 |
| (h) the great fire's "lower districts" / "merchant stalls" | generators/historyGenerator.js | 62 / 42 | 0 / 0 | READ TRUE here: town or larger only, every one with a market |
| #64/#191, #9 | institutionServices.js | | | PARKED (the chain-working word), unchanged |
| #180, #2 | crisisCast.js, institutionVocabulary.js | | | FOR THE JOIN (HANDBACK-11 section 9), unchanged |

## 2. The rows as cured

### 1 · DATA-SMELTER, the catalogue's Smelter text (MEDIUM): CURED, `989af877a` (lighting census `3d48883b1`)

- `src/data/institutionalCatalog.js`, the Smelter's shared desc: "... The industrial intermediate between mine and smithy." -> "Converts raw ore to refined metal using charcoal-fueled furnaces." (the chair's 11:31 ruling). Holders by content: the Smelter row is byte-identical on every lane's copy (9 distinct blobs of the file, one Smelter line).
- Counts on the 730: the old text 96 prints, 57 false -> 0; the variants 21, 0 false, unchanged. DECLARED MOVE: 96 births, only `.institutions[].desc`, the Smelter's catalogue text each time.
- Read: r2r-town-26 (town, smallest), r2s-under_siege-city-2 (siege), r2s-occupied-metropolis-1 (occupation, largest): Systems/Institutions, the PDF view model (institutions, services.detailed, overview), the journal "- **Smelter**: ...": true.
- Guard: `tests/data/w2FixData13Rows.test.js` DATA-SMELTER, red 3 of 3 with the old text planted, green after. Doors: presumed-things two stale rows (house: mine, smith) out by `--shrink` (banked 4658 -> 4656), fresh 49 carried; governing 77 files + walker: the same 3 reds as c4d941895 (ARM 1, the golden master, urbanBandInstitutions G5); grid 0; domain-strict, type ratchet, eslint 0.
- CARRIED: the edge-shared bundles are stale at c4d941895 (10 reds in the four freshness/replay files); not rebuilt here (the join's `build:edge-shared`).

## 3. EVERY NEW OR CHANGED LINE, with the towns it was read in (the owner's veto list)

- institutionalCatalog.js, Smelter: "Converts raw ore to refined metal using charcoal-fueled furnaces." (r2r-town-26, r2s-under_siege-city-2, r2s-occupied-metropolis-1).

## 4. FOR THE JOIN

- Carried from HANDBACK-12 section 3 and HANDBACK-11 section 9, unchanged.

## 5. WHAT IS LEFT, line by line

The table's rows, widest first in the brief's order.
