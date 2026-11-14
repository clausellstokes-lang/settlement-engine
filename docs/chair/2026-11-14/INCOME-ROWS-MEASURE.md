# INCOME-ROWS-MEASURE — an income row for a trade no house of the town works (INCOME-MEASURE-1, 2026-11-14)

**Seat:** INCOME-MEASURE-1, a measuring seat. **Brief:** `origin/lane/chair-2026-11-08:docs/chair/2026-11-14/briefs/BRIEF-INCOME-MEASURE-1.md`. **Measured at:** `f4e9cd37b` (the defence lane `lane/coherence-upkeep-2026-11-12`, read back from origin at the start: it matched the brief). **Built on no lane.** Every candidate lives only in a scratch tree and as a patch under `probes/INCOME-MEASURE-1/`.

**STATUS: ITEMS 1–4 DONE.** This file is kept current after every item.

**RECOMMENDATION (one sentence): build D — make a no-house resource row only where the town's final export list sells that good from its own ground, titled by the good — which takes the false rows to 0 and keeps the 40 true ones, at 402 towns' tables and, by prosperity's income-count bonus, 5 towns' powers and 1 town's people.**

EXECUTED vs PLAUSIBLE: every count below is EXECUTED (a script over the 972 births rendered at `f4e9cd37b`, named beside it) unless marked PLAUSIBLE.

---

## ITEM 1 — WHAT MAKES THE ROW

### 1a. By the code (`src/generators/economy/economicState.js`, the resource streams, lines 376–519)

Every one of these rows is pushed into `incomeBuild` by a gate that reads the GROUND or a COMMODITY LIST, never a house (only Iron's second arm reads one):

| title | gate (verbatim sense) | what can fire it with no house of the trade |
|---|---|---|
| Iron & Metalwork (:442) | `hasNearbyResource('iron_deposit','coal_deposit','precious_metal')` **OR** (iron/ore in local production or exports **AND** a `smith` on the roster) | the first arm alone: iron deposits, coal deposits or precious metals in the country, nothing more |
| Stone Quarrying (:502) | local production holds `stone/granite/marble/limestone`, or an export holds `stone/quarry` | `stone_quarry` ground alone; **and a clay bank**: `river_clay` yields the commodity `pottery`, which `COMMODITY_CATEGORY_MAP` maps to the category `stone` (`src/data/goods/chains.js`), so clay makes a quarrying row |
| Timber Trade (:470) | `hasNearbyResource('managed_forest','timber')` | any timber ground alone (managed, mountain, shipbuilding) |
| Fish & Preserved / Maritime Produce (:483) | local production holds `fish/herring/cod/salt`, or an export `fish/herring`; and water (`portKind !== 'none'` or a fishing house on water) | fish ground; **salt**: salt flats, desert salt, or the commodity `salt` that `deriveLocalCommodities` (`tradeGoods.js:35`) adds for ANY roster name containing `dock`, `port` or `fishmonger` — "Airship docking (high magic)" included |

Local production (`tradeGoods.js :: deriveLocalCommodities`) is the resources' commodity list (`src/data/goods/identity.js` `RESOURCE_DATA`) plus a few house-keyed goods; it reads availability (depleted ground is out), not a house. The share is `max(floor, economyOutput / k)` before normalisation (`:543–559`), so a row's share is independent of whether anyone works the trade.

The LINE under the row is then rewritten by `trueIncomeDesc` (`incomeLineSiblings.js:138`, the builder's cure of the lines): it reads the roster and prints a twin or **nothing**. So at the tip a no-house row most often prints its TITLE AND SHARE ALONE (133 of the 198 Iron rows; 131 of 131 Stone; 37 of 37 Fish & Preserved; 20 of 20 Maritime) — the title is the claim left standing.

### 1b. By count (EXECUTED: `census.mjs` over the 972 births of `render5.mjs` at `f4e9cd37b`; table in `probes/INCOME-MEASURE-1/census.tip.txt`)

"House" = a roster name of the trade: Iron `mine|mining|smith|smelt|forge|foundr|metal|armour|weapon` (the line file's own `FORGE_HOUSE_WORDS` plus mine); Stone `quarr|mason|stonecut`; Timber `woodcut|lumber|sawmill|logging|forester`; Fish `fish` (Fishing community, Fish market, Fisher's landing, Fishmonger). Raw = the ground in the country and NOT depleted. Export = a final export naming the good.

| title | rows | with a house | NO HOUSE: raw + export | raw only | export only | neither (other ground) | no-house trigger |
|---|---|---|---|---|---|---|---|
| Iron & Metalwork | 654 | 456 | 72 | 126 | 0 | 0 | coal 77 · iron 76 · precious metals 40 · two grounds 5 |
| Stone Quarrying | 182 | 51 | 1 | 121 | 0 | **9** | stone quarry 122 · **clay bank 9** |
| Timber Trade | 220 | 90 | 68 | 62 | 0 | 0 | managed 57 · shipbuilding 53 · mountain 19 · both 1 |
| Fish & Preserved Produce | 151 | 114 | 10 | 11 | 0 | **16** | fish ground 21 · **salt from a dock/port name 13** · same, fishery depleted 3 |
| Fish & Maritime Produce | 145 | 125 | 8 | 6 | 0 | **6** | fish ground 14 · **salt flats, fishery depleted 4** · salt flats 1 · dock salt, depleted 1 |

**516 no-house rows in 434 of the 972 towns** (Iron 198, Stone 131, Timber 130, Fish 37 + 20). The prior seat's counts are reproduced exactly for Iron (198/654), Stone (131/182) and Fish & Preserved (37/151); its Timber 98 and Maritime 6 used a wider house word (carpenters; docks): here 44 of the 130 Timber rows have a carpenter, cooper or woodcarver (who buy wood, not fell it) and 0 of the 20 Maritime rows a fish house.

Every no-house row prints on **the Economics tab 516, the PDF 516, both world exports 516, the Foundry journal 261** (`census.mjs --text`).

**The Resources tab is no witness** (EXECUTED, `census.mjs` "chain partial/full" column and a supporter check): for Iron, Stone and Timber, 0 no-house rows have their chain shown worked (the tab shows the chain **Unexploited** or no chain card at all). For Fish, 35 no-house rows show "✓ Fully exploited Fish" — and in all 35 the chain's processors are FOOD houses only (City granaries, Butchers, Bakers, a Vintner; `processingTags: ['food']`), never a fisher or a landing. A cure that trusts the tab's "worked" keeps 35 false Fish rows.

### 1c. FIFTEEN TOWNS READ (EXECUTED: `read15.mjs`, three quoted lines a town, `probes/INCOME-MEASURE-1/read15.tip.txt`; the towns chosen by `read15.json` across tiers, crises and triggers)

| # | town | the row as it prints | what the page says beside it | verdict |
|---|---|---|---|---|
| 1 | r2r-hamlet-14 (hamlet, calm) | "12% Iron & Metalwork" | Nearby Resources: Iron Deposits; Produced locally: "iron metalwork"; no mine, no smith | **FALSE** — no house digs or works iron (the "Produced locally" list repeats the same unsupported claim) |
| 2 | r2r-thorp-16 (thorp, wartime) | "11% Iron & Metalwork Coal is dug here and sold on to other towns…" | Coal Deposits; Exports: "…Live sheep Coal" | **TITLE FALSE, GOOD TRUE** — coal is exported (the page bears out a raw good sold), but there is no iron and no metalwork; the true row is the coal |
| 3 | rv5-wartime-village-4 (village, wartime) | "7% Iron & Metalwork" | Precious Metals on the tab; no export, no production line | **FALSE** |
| 4 | r2r-city-10 (city) | "3% Stone Quarrying" | Stone Quarry nearby; Produced locally: "stone"; no quarry, no mason | **FALSE** |
| 5 | r2r-metropolis-7 (metropolis, indebted) | "3% Stone Quarrying" | Stone Quarry nearby; Produced locally: "coal stone" | **FALSE** |
| 6 | rv5-wartime-village-3 (village, wartime) | "6% Stone Quarrying" | "Unexploited Clay medium value"; no stone ground at all | **FALSE twice** — a clay bank, read as stone |
| 7 | r2r-hamlet-42 (hamlet, calm) | "9% Timber Trade Local forest provides sustainable timber revenue; managed felling keeps production consistent." | "Unexploited Mountain timber"; no woodcutter | **FALSE** — the tab calls the wood unexploited (the line is #234's) |
| 8 | r2r-town-25 (town, infiltrated) | "8% Timber Trade Local forest provides…managed felling…" | Exports: "Shipbuilding timber"; Shipyard and Cooper on the roster; Resources: "Unexploited Timber" | **TRUE IN THE EXPORTS' SENSE** — timber is sold; the Resources tab contradicts the exports (a page fault beside the row, not the row's) |
| 9 | rv5-wartime-thorp-2 (thorp, wartime) | "9% Timber Trade Timber sourced from more distant forests and resold…" | "Unexploited Mountain timber"; no timber export ("Sacred wood" only) | **FALSE** |
| 10 | r2r-city-42 (city, calm) | "5% Fish & Preserved Produce" | Exports: "River fish Freshwater catch … Salted fish"; Docks/port facilities | **TRUE** — fish are sold, a dock lands them |
| 11 | r2s-famine-metropolis-2 (metropolis, famine) | "4% Fish & Preserved Produce" | River Fish listed, but DEPLETED in the record; no fish export; the row fired on the "salt" of "Airship docking (high magic)" | **FALSE** — a dead fishery (the #77 class) and a trigger that is an airship dock |
| 12 | rv5-under_siege-town-2 (town, besieged) | "6% Fish & Preserved Produce" | no fish ground; the Resources tab names none; fired on dock/port salt | **FALSE** |
| 13 | r2r-city-19 (city, plague onset) | "4% Fish & Maritime Produce" | Exports: "Salted fish Smoked seafood Fish oil"; Docks, Salt works | **TRUE** |
| 14 | r2r-thorp-24 (thorp, occupied) | "11% Fish & Maritime Produce" | "✓ Fully exploited Fish" with no fisher and no water house; Exports: "Sea salt" only | **FALSE** (and the tab's "Fully exploited" is itself false) |
| 15 | r2s-succession_void-town-0 (town) | "8% Fish & Maritime Produce" | Salt Flats; Exports: "Sea salt … Preserved foods"; no fish ground | **FALSE** — it is a salt row titled fish |

**Of fifteen: 11 false, 1 title-false-good-true (coal), 3 true in the sense the page supports (a raw good sold: shipbuilding timber; fish through a dock, twice).** The true ones are exactly the rows where the EXPORT LIST names the raw good and a house on the roster (a dock, a shipyard) handles it.

---

## ITEM 2 — WHO READS A SHARE (OR A ROW) AFTERWARDS (`git grep incomeSources|incomeNormalized` at `f4e9cd37b`, read)

**Generator steps, inside the same birth (a cure moves these):**
- `economy/prosperity.js :: computeBaseProsperity` (:338) — the income-diversity bonus: **row COUNT** ≥7 → +0.5, ≥5 → +0.25 to the prosperity index; called twice (the printed label and `standingBaseProsperity`, R3). A removed row can drop a band; the band feeds the stores (`keepOf(prosperityStanding)`, :842), the situation line, and everything downstream that reads `prosperity`.
- `prosperity.js :: deriveEconomicComplexity` (:401) — the economic-complexity label reads the **row count**.
- `economicState.js :: houseOfWorkLine` (:542) — fires only where Agricultural Rents is the ONLY row: removing a small place's resource row can ADD a "Local Trades" row.
- `economicState.js :: hasIncomeSource` — later gates skip if a row's title holds `iron/metal/stone/quarry/timber/lumber/fish/maritime`; a retitle must not reopen them.
- `generators/narrativeGenerator.js:598` — any title holding `trade` (Timber Trade does).
- `generators/historyGenerator.js:160`, `history/historyEventStrands.js:112`, `historyTemplate.js:76` — titles holding `guild`/`port`/`dock` (none of the four).
- `generators/narrative/arrivalScene.js:322` — the titles as nouns in the arrival scene's pool.
- `generators/resourceGenerator.js :: townSupports` (:98) — rows by exact title (only Agricultural Rents is keyed).
- `generationCoherence.js:468/540` (findings), `generationReceiptJudgments.js:283` (shares sum to 100), `domain/edit/recordInvariants.js` V-INCOME-100.
- `computeActiveChains.js :: _INCOME_TO_CHAINS` (:154) — keyed on the titles but read by nothing (dead).

**Runtime (world pulse, after birth):** `domain/worldPulse/treasury.js :: taxFormShares` — every share, by title through `INCOME_SOURCE_FORMS` (the four map to `misc_trade`; an unmapped title falls to `misc_trade`; a totality test scans the generator's literals, so a NEW title must be added there); `worldPulse/urbanFabricKernel.js:389` — titles classified ind/craft/merch.

**Surfaces:** the Economics tab (`EconomicsTab.jsx:410`, and `EconomicFlowsSection` :107 by title), `economyStateProse.js :: incomeMixPoolKey` (the LEADER's share picks the prose pool) and `criminalIncomePoolKey`, `tradeListDisplay.js:117`, `institutionTable.js:373`, `faithReading.js:236` (tithes only), `dailyLifeLogic.js:111` and `aiLayer.js:146` (the count), the PDF (`viewModelBodySlices.js:74`, `EconomicsTrade.jsx:93`), the Foundry journal (`journalPages.js:330`), the world exports (the record).

---

## ITEM 3 — THE CANDIDATE CURES (each built ONLY in a scratch tree at `f4e9cd37b`; patches `probes/INCOME-MEASURE-1/candidate-{A,B,C,D}.patch`; 972 births regenerated by `gen.sh`, field diff by `fielddiff.mjs`, tables by `compare.mjs`, false rows by `falseLeft.mjs`; all EXECUTED)

**Noise floor:** the tip regenerated by `gen.sh` against the tip's own rendered records: **0 families moved on 972** (`fd.noise.json`). Every move below is the candidate's.

**The false-row rule, one for all candidates (`falseLeft.mjs`):** a row is FALSE where its title names a trade no house of the town works, and the good it names is not on the final export list from ground the town holds (not depleted). "Iron & Metalwork" and "Stone Quarrying" with no house of the trade are false outright (their titles name the trade); "Timber Trade" and the two Fish titles name a good, and are true where that good is exported from the ground; "<Good> Sales" is true only where that good is exported from the ground. **At the tip: 476 false rows in 402 towns** (Iron 198, Stone 131, Timber 108, Fish & Preserved 27, Maritime 12); the other 40 no-house rows are true in the exports' sense (Timber 22, Fish 10 + 8: a shipyard's timber, a dock's catch).

### 3a. The four candidates

- **A — not made where no house stands; its share goes to the rows that remain.** Each of the four gates also asks the roster for a house of its trade (`hasInstMatching`, the census's words). Pre-normalisation, so the house-of-work row is re-asked.
- **B — kept, retitled by the raw good, the line silent.** After the final exports: a no-house row takes the good's name ("Iron Ore Sales", "Coal Sales", "Precious Metal Sales", "Building Stone Sales", "Clay Sales", "Salt Sales"; Timber and a fish-ground Fish row keep their good-titles) and prints title and share alone.
- **C — made only where the page elsewhere bears it out: a house, or a final export of the raw good from the town's ground.** After the final exports, the rows failing it are dropped and the shares re-normalised from the stored weights. **The brief's "export … that the Resources tab shows worked" is NOT added: the tab is no witness** (1b: 0 no-house Iron/Stone/Timber rows show their chain worked, and the 35 Fish rows that show "✓ Fully exploited" are worked only by granaries, butchers and bakers). On the census that literal C equals A for Iron, Stone and Timber and keeps 35 tag-made Fish rows.
- **D (mine) — C, and a row C keeps with no house of its trade is TITLED BY THE GOOD IT SELLS** ("Coal Sales" for coal sold under "Iron & Metalwork"; "Salt Sales" for salt under a Fish title; "Clay Sales" for pottery under "Stone Quarrying"), its line silent where it retitles.

### 3b. What each moves (972 births; the census's 720 in brackets)

| | A | B | C | D |
|---|---|---|---|---|
| **re-draws powers or people?** | **YES: powers 8 (6), people 2 (1)** | no | **YES: powers 5 (4), people 1 (1)** | **YES: powers 5 (4), people 1 (1)** |
| towns whose income table changes | 434 (319) | 417 (307) | 346 (254) | 402 (297) |
| rows taken off · retitled · added | 516 · 0 · **47 "Local Trades" added** | 0 · 351 retitled, 516 lines silenced | 399 · 0 · 0 | 399 · 77 · 0 |
| shares moved on the rows kept | 1230 rows, mean 3.06 pts, largest 20 (r2r-village-12 Agricultural Rents 80→100) | 0 | 948 rows, mean 3.32, largest 20 (rv5-under_siege-hamlet-5 Agricultural Rents 80→100) | 936 rows, mean 3.35, largest 20 (same) |
| towns where anything beyond the table moves | 48 (29) | **0** | 38 (23) | 38 (23) — the same towns and families as C |
| prosperity label | 8 (6): Prosperous→Comfortable 3, Comfortable→Moderate 3, Poor→Struggling 1, Wealthy→Prosperous 1 | 0 | 5 (4): Prosperous→Comfortable 2, Poor→Struggling, Wealthy→Prosperous, Comfortable→Moderate 1 each | as C |
| standing prosperity (R3) | 9 (6) | 0 | 6 (4) | 6 (4) |
| economic complexity label | 16 (10) | 0 | 13 (9) | 13 (9) |
| defence profile (pay reads prosperity) · food security (stores at the standing share) · history · relationships | 8 · 6 · 5 · 2 | 0 | 5 · 3 · 4 · 1 | as C |
| arrival scene · coherence notes | 15 · 12 | 0 | 14 · 8 | as C |
| **false rows left** | **0** | **398** in 346 towns (every raw-only row is still a sale nobody makes: Building Stone 121, Iron Ore 80, Precious Metal 40, Timber 108, Salt 14, Coal 13, Fish 17, Clay 5) | **77** in 76 towns (Iron & Metalwork 68 where only coal is sold, Maritime 6 salt, Stone 3 clay) | **0** |
| true rows lost (of the 40) | **40** | 0 | 0 | 0 |

**The channel (EXECUTED, `fd.*.json` per town):** every town whose powers or people move also moves its prosperity label; the channel is `prosperity.js :: computeBaseProsperity`'s income-diversity bonus (row COUNT ≥5 / ≥7), and the economic-complexity label reads the same count. The towns: A r2r-town-21, r2r-town-33, r2r-town-54, r2r-village-44, r2r-village-45, r2r-village-49, rv5-calm-town-4, rv5-monster_pressure-town-0; C and D r2r-town-54, r2r-village-44, r2r-village-45, r2r-village-49, rv5-calm-town-4. The other moves (A 23 towns, C/D 19) are the arrival scene (it takes the income titles as nouns, `arrivalScene.js:322`) and the coherence notes. B's retitles move nothing at all, so a TITLE moves no other family; only a removed row does.

### 3c. What the table then says in the fifteen towns (`compare.*.txt`, "read" lines)

| # | town · row at the tip | A | B | C | D |
|---|---|---|---|---|---|
| 1 | r2r-hamlet-14 · 12% Iron & Metalwork | gone | 12% Iron Ore Sales (false: no ore dug or sold) | gone | gone |
| 2 | r2r-thorp-16 · 11% Iron & Metalwork, "Coal is dug here…" | gone (true coal sale lost) | 11% Coal Sales | 11% Iron & Metalwork, the coal line (title false) | **11% Coal Sales** |
| 3 | rv5-wartime-village-4 · 7% Iron & Metalwork | gone | 7% Precious Metal Sales (false) | gone | gone |
| 4 | r2r-city-10 · 3% Stone Quarrying | gone | 3% Building Stone Sales (false) | gone | gone |
| 5 | r2r-metropolis-7 · 3% Stone Quarrying | gone | 3% Building Stone Sales (false) | gone | gone |
| 6 | rv5-wartime-village-3 · 6% Stone Quarrying (clay) | gone | 6% Clay Sales (false: no clay sold) | gone | gone |
| 7 | r2r-hamlet-42 · 9% Timber Trade | gone | 9% Timber Trade, silent (false) | gone | gone |
| 8 | r2r-town-25 · 8% Timber Trade (shipbuilding timber exported) | **gone (true row lost)** | 8%, silent | 8%, its line | 8%, its line |
| 9 | rv5-wartime-thorp-2 · 9% Timber Trade | gone | 9%, silent (false) | gone | gone |
| 10 | r2r-city-42 · 5% Fish & Preserved (fish exported, a dock) | **gone (true row lost)** | 5% | 5% | 5% |
| 11 | r2s-famine-metropolis-2 · 4% Fish & Preserved (fishery depleted; airship-dock salt) | gone | 4% Salt Sales (false) | gone | gone |
| 12 | rv5-under_siege-town-2 · 6% Fish & Preserved (dock salt) | gone | 6% Salt Sales (false) | gone | gone |
| 13 | r2r-city-19 · 4% Fish & Maritime (fish exported, docks) | **gone (true row lost)** | 4% | 4% | 4% |
| 14 | r2r-thorp-24 · 11% Fish & Maritime (sea salt exported, no fisher) | gone | 11%, silent (false) | 11% Fish & Maritime (false) | **11% Salt Sales** |
| 15 | r2s-succession_void-town-0 · 8% Fish & Maritime (salt flats, sea salt exported) | gone | 8% Salt Sales | 8% Fish & Maritime (false) | **8% Salt Sales** |

### 3d. What a builder would carry beyond the patch (READ, not run unless marked)

- **D's and B's new titles** ("Coal Sales", "Salt Sales", "Clay Sales", "Building Stone Sales"; B also "Iron Ore Sales", "Precious Metal Sales"): `treasury.js :: INCOME_SOURCE_FORMS` maps by title; an unmapped title falls to `misc_trade`, the form the old titles already map to, so there is no treasury move. EXECUTED: `tests/domain/treasury.test.js` passes on D as patched, because its totality scan reads `source:` literals and D's titles sit in a table. A builder should still add the four to the map, so that the map stays the census of titles. If the program's vocabulary register keys income titles, each new title is a NEW WORD and the row PARKS with its word (the brief's law); the titles are plain English goods names.
- **D as built is applied after the final exports** (the exports are derived after the rows are built, `:699–812`), so it re-normalises from the stored weights and does not re-ask `houseOfWorkLine` (A, which gates before normalisation, re-asks it and adds 47 "Local Trades" rows). A builder may re-ask it post-hoc: that adds rows in small places and moves more prosperity; not measured.
- **The lines under kept rows stay the builder's** (#234 "managed felling" prints in r2r-town-25 under every candidate but B).
- **FOR THE JOIN:** `economicState.js` differs from the integration line's on the defence lane (+43/−21), the five `join-*` lanes (+32/−20) and thirteen others (+4/−4 to +31/−19; another 41 lanes only lag the integration line); `treasury.js` differs on none. A cure of these rows is one cause in `economicState.js` (+ `treasury.js`'s map), and it lands where the defence lane's copy lands.

### 3e. D on every surface (EXECUTED: D rendered whole by `rend.sh`; `surfaceZero.mjs`; `pairdiff5.py`)

- **The claim of zero:** `surfaceZero.mjs` reads every rendered section (the 20 tabs, the Tonight sheet, the PDF text, the Foundry journal, the AI prompt and grounding, both registers, both world exports) for any resource-row title that the falseLeft rule makes false in that town. **On the tip it finds 402 towns** (the same 402 as the record count: the Economics tab, including the chain cards' "Contributes to Stone Quarrying - 3% of income", the PDF, the Foundry journal and both exports). **On D it finds 0 towns.** D's rendered records equal its generated ones (0 families).
- **What moves on the page (tip → D, births by surface):** the Economics tab 402, the PDF 402, the Foundry journal 402, the world exports 402 each, the AI layer prompt 346 (it prints the row count). Beyond those: the Overview 27, the Substrate 14, the AI grounding 9, Power 5, Daily life 5, both registers 5, History 4, Defence 3, Tonight 2, and NPCs, Relationships, Services and Institutions 1 each. All of these are the 38 towns of 3b (`pairdiff.tip-D.txt.gz`).

### 3f. D against the suite rows that key on these rows (EXECUTED: five files run in D's scratch tree through `scripts/gate-tail.sh`; refs and config compared before and after: unchanged)

`tests/domain/treasury.test.js`, `tests/joins/goods.test.js`, `tests/generators/terrainPoolsSeaWords.test.js` and `tests/generators/projectionAgreement.test.js` pass. In `tests/generators/coherenceAgreeCures.test.js`, **2 of 174 tests fail. Both are pins of the very rows D cures:**
- "the coal line" (`:412`) pins r2r-thorp-2, r2r-village-6 and r2r-thorp-16 to an "Iron & Metalwork" row carrying `LOCAL_COAL_SOLD_LINE`. D titles it "Coal Sales" and silences the line.
- "the felling line" (`:518`) pins six mountain-timber towns with no wood house to a "Timber Trade" row reading "Timber sourced from more distant forests…". D takes the row off, because no timber is exported.

A builder re-keys both pins by identity (the same towns, the cured row), never by loosening them. A builder may also keep `LOCAL_COAL_SOLD_LINE` under "Coal Sales" where `trueIncomeDesc` admits it, which is #273's line, the line builder's. The whole suite was NOT run on any candidate.

## ITEM 4 — RECOMMENDATION

**Build D. It re-draws powers in 5 towns and people in 1 (of 972; 4 and 1 of the census's 720), through prosperity's income-count bonus.** Cost: 402 towns' income tables (399 rows off, 77 retitled, kept shares up by a mean of 3.35 points, at most 20), and beyond the table 38 towns: prosperity 5, standing prosperity 6, complexity 13, defence profile 5, food stores 3, history 4, arrival scene 14, coherence notes 8. It takes the false rows from 476 to **0** by the one rule, and to 0 on every rendered surface. It keeps all 40 rows the page bears out, and it re-keys two pins.

**THE CRUX the chair rules:** D treats "a raw good on the export list from the town's own ground" as true with no house to dig or fell it (the coal, the salt, the shipbuilding timber). If the chair holds that an export with no house is ALSO false (the #273 ruling made "is dug here" need a house that digs), then **A** is the cure: 0 false rows, 40 true-by-export rows lost, 434 tables, powers 8 and people 2, and it adds 47 "Local Trades" rows. The export lists themselves are the generator's other unhoused claim, and A leaves them standing.

**What I would NOT do:**
- **B alone:** it moves nothing beyond the table, but it leaves 398 false rows (a sale nobody makes is still a sale named), adds six titles, and silences 516 lines.
- **C as the brief wrote it (the Resources tab's "worked"):** the tab's exploitation stage counts a granary, a butcher or a baker as a fisher (`processingTags: ['food']`), so it keeps 35 false Fish rows. C without the tab still leaves 77 false titles (coal under "Iron & Metalwork").
- **Freezing prosperity at the pre-cure row count to spare the 5 powers:** prosperity would then rest on a row the page no longer prints.
- **Curing the triggers alone** (clay read as stone; any "dock"/"port" name, an airship dock included, read as fish salt; `tradeGoods.js:35`, `chains.js` COMMODITY_CATEGORY_MAP `pottery → stone`): those 9 Stone and 17 Fish rows fall under every candidate but B anyway. They are the generator's to fix in their own commit, and the same mapping also feeds "Produced locally".

**PARKED FOR THE CHAIR (seen, not chased):** (i) the Economics tab's "Produced locally" list claims "iron metalwork" and "stone" in the towns where the rows were false (r2r-hamlet-14, r2r-city-10, r2r-metropolis-7): it is made from resource commodities with no house, the same class one list over; (ii) the Resources tab's "✓ Fully exploited Fish" with no fisher (35 towns); (iii) r2r-town-25's exports sell shipbuilding timber while its Resources tab calls the timber "Unexploited".

---

## HOW THE INSTRUMENTS ARE RE-MADE

All of them are under `probes/INCOME-MEASURE-1/`. A detached worktree at `f4e9cd37b` outside every repository tree, then `npm ci`, then `git config --local --unset core.hookspath` (npm ci writes it into the shared config). Each candidate gets its own detached worktree with `node_modules` symlinked to the tip's, and its patch applied (`git apply candidate-X.patch`; `patchBC.py <tree> B|C` wrote B and C).

- `rend.sh <tree> <out>`: four shards of `render5.mjs` (REVIEW-UPKEEP-CAPACITY's, copied verbatim) over `all.seeds` (the 972 = the census's 720 + 252 app-shaped), split by `split -n l/4 -d all.seeds shard.`. It takes about 20 minutes on four cores.
- `gen.sh <tree> <out>`: the same births, the record only (about 1 minute).
- `census.mjs <dir> <out.ndjson> [--text]`, `read15.mjs <renderDir> read15.json`, `fielddiff.mjs <tipDir> <candDir> <out.json>` (REVIEW-UPKEEP-CAPACITY's), `compare.mjs <tipDir> <candDir> <fd.json> read15.json`, `falseLeft.mjs <dir>`, `surfaceZero.mjs <renderDir>`, `pairdiff5.py <tipRender> <candRender> <out>`.

The results sit beside them: `census.*.txt`, `compare.*.txt`, `fd.*.json.gz`, `falseLeft.txt`, `surfaceZero.txt`, `pairdiff.tip-D.txt.gz` and `tests.D.tail.txt`.
