# INCOME-ROWS-MEASURE — an income row for a trade no house of the town works (INCOME-MEASURE-1, 2026-11-14)

**Seat:** INCOME-MEASURE-1, a measuring seat. **Brief:** `origin/lane/chair-2026-11-08:docs/chair/2026-11-14/briefs/BRIEF-INCOME-MEASURE-1.md`. **Measured at:** `f4e9cd37b` (the defence lane `lane/coherence-upkeep-2026-11-12`, read back from origin at the start: it matched the brief). **Built on no lane.** Every candidate lives only in a scratch tree and as a patch under `probes/INCOME-MEASURE-1/`.

**STATUS: ITEMS 1 AND 2 DONE; ITEM 3 (the candidates) IN PROGRESS.** This file is kept current after every item.

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
