# READ-24: the measure (CLOSE-7 unit (1)). Nothing was built.

The lit tree `/home/user/wt/lit` stood at `d447ee31e5b2836736d22778a91ce66721a6d00e` with an empty `git status --short` at the
start, after every run, and at the end. Every output went outside it. Every heavy run went through `scripts/gate-mutex.sh --run`,
one at a time, to a log (exit 0 each): two renders by the sameness door (16.3 min each) and three record measures
(900 census births 4.8 min, 16 dm24 twins, 900 visitor births 5.1 min).

## A fact the brief assumes is false, and how I handled it
**The close's census of 900 cannot hold A2, B1(i) or C1.** `birthConfig({ settType })` gives every birth the same config:
all 900 are `terrainType: plains` and `tradeRouteAccess: road`, with every priority at 50 (CONFIRMED: the record, 900 of 900).
So no birth is Desert/Arid (B1(i) is 0 by construction). No birth has a criminal top priority, so the record holds no
"Corrupt Council" (C1 is 0). No birth is `Wealthy` (prosperity: Comfortable 486, Moderate 218, Prosperous 131, Struggling 34,
Poor 31), so the rich line prints in 0 of 900 (A2 is 0). FINDINGS.md's sixteen were born as a visitor's places:
`{ ...DEFAULT_CONFIG, settType, _randomizePriorities: true }`, with random route, culture, threat, resources and stresses.
I measured what the brief names (the census). **I also measured a supplementary corpus, the VISITOR 900**: the same seeds
`dp-<size>-<i>`, each born with the config of its size's row of the chair's `plan-lit.json` (`read24/make-visitor-plan.mjs`).
It was rendered by the same door command and measured by the same script. The chair may disregard it; it is the only corpus
of these two in which A2, B1(i) and C1 can occur.

**CONTROL (CONFIRMED, both corpora).** The renderer's birth (`birthOf`: config through `birthConfig`, the store's content
runtime at rest) is the same birth as the direct one (`customContent: {}`). For each seed I compared the first screen's head
line (`<name><size>· <pop> pop.`, `web:Summary/Overview`) with the direct record's `name` and `population`. They differ in
0 of 900 (census) and 0 of 900 (visitor) (`read24/control.txt`, `read24/visitor/control.txt`). The dm24 twins born directly
match FINDINGS.md (Khirbetqala 219, Khirbetpur 98, Bayanbuurt 966; `read24/dm24-twins.jsonl`).

## The table (counts of places; C = the census 900, V = the visitor 900)

| row | thorp | hamlet | village | town | city | metropolis | all 900 |
|---|---|---|---|---|---|---|---|
| A1 line + a resident sick-care service, C | 0 | 0 | 1 | 1 | 1 | 0 | **3** |
| A1 the same, V | 0 | 0 | 1 | 0 | 0 | 1 | **2** |
| A2 rich line + short-food line, C | 0 | 0 | 0 | 0 | 0 | 0 | **0** |
| A2 the same, V | 0 | 0 | 0 | 0 | 1 | 1 | **2** |
| B1(i) Desert/Arid, C | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| B1(i) Desert/Arid, V | 10 | 9 | 6 | 9 | 10 | 8 | 52 |
| B1(i) desert + Fish market, V | 0 | 0 | 1 | 7 | 9 | 8 | **25** |
| B1(i) desert + Sawmill, V | 0 | 0 | 0 | 2 | 8 | 7 | **17** |
| B1(i) desert + Hunter's lodge, V | 0 | 1 | 1 | 2 | 0 | 0 | **4** |
| B1(i) desert + any of the three, V (C: 0) | 0 | 1 | 2 | 7 | 10 | 8 | **28** |
| B1(ii) furrows + grain bought in, C | 0 | 0 | 0 | 0 | 1 | 0 | **1** |
| B1(ii) the same, V | 0 | 0 | 0 | 0 | 0 | 1 | **1** |
| C1 owner page (first screen AND sentence subject), C | 0 | 0 | 0 | 0 | 0 | 0 | **0** |
| C1 the same, V | 0 | 0 | 0 | 18 | 0 | 0 | **18** |
| C1 player projection carries it, V (C: 0) | 0 | 0 | 0 | 18 | 0 | 0 | **18** |
| D2 guild quarrel, C | 0 | 2 | 1 | 54 | 76 | 72 | 205 |
| D2 the same, V | 0 | 1 | 3 | 51 | 72 | 68 | 195 |

The full tables, with the component rows, are `read24/table.tsv` and `read24/visitor/table.tsv`. The seeds of every row are
`read24/seeds-*.txt` and `read24/visitor/seeds-*.txt`. "The page" means the owner's web dossier: every `web:*` surface of the
door's `--text` render. The scripts are `read24/make-plan.mjs`, `make-visitor-plan.mjs`, `measure.census.jsx` (the record,
birthed once a place, run by vitest with `vitest.read24.config.mjs` only because `publicProseCompose.js` imports .jsx),
`analyze.mjs` (the join of record and page) and `dslots.mjs` (D).

## A1 HEALER
**Counts.** The line ("Anyone who falls ill here is nursed by family, for there is no healer to send for.") prints in 13 (C) and
10 (V) places. Any of the five no-healer lines (H2, H3, H7, H8, H9) prints in 107 (C) and 79 (V). A resident sick-care service
appears in 469 (C) and 465 (V). Both the line and a resident sick-care service: **3 (C)**: dp-village-103 (Healing @ Priest
(resident)), dp-town-144 (Herbal remedies @ Apothecary (established)) and dp-city-3 (Basic wound care, Birth assistance @
Midwife; Herbal remedies, Specialist compounds @ Apothecary district). **2 (V)**: dp-village-83 (Midwife; Healing @ Priest
(resident)) and dp-metropolis-114 (Midwife; Apothecary district). CONFIRMED. Detail: `read24/a1-hits.txt`.

**The pool and the fact it reads (CONFIRMED by read and run).** The line is H7 of `src/data/dailyLife/outsiderImpressions.js ::
OUTSIDER_IMPRESSIONS['services.healing']`, declared `excludes: ['sick house']`. It is drawn by
`src/domain/dailyLife.js :: outsiderParts` when the healing lens is strained or worse. The lens is
`src/domain/capacityModel.js :: deriveHealing`, ratio < 0.95 (all 13 C hits are `strained`, 0.88 to 0.89). Supply counts
`src/domain/healingLedger.js :: healingLedger().healerCount` (`HEALING_INSTITUTION_PATTERN`: temple, chapel, infirmary, healer,
hospice, herbalist, apothecary, shrine, hospital, monaster, almshouse). Where that count is 0, `careServices` adds a +4 rescue.
The line is admitted only where the atom `'sick house'` is false. That atom is `src/domain/facts/factVocabulary.js` `'sick house'`,
which reads `src/domain/facts/defence.js :: defenceOf`, which reads `src/domain/defense/defenseFacts.js :: defenseFactsOf`
`hasHospital || hasHealer`: a live roster name matching hospital, or healer, infirmary, monastery or friary
(`facts/institutions.js :: INSTITUTION_KIND_PATTERNS`).

**Which `availableServices` entries count as healing, and why.** The bucket key `availableServices.healing` is the category
`src/generators/services/serviceClassifier.js :: classifyService` returns, from
`serviceCategoryTables.js :: SERVICE_CATEGORY_MAP`. It files under `healing` every rite, burial, alms, bathing and counsel
service ("Religious services", "Life ceremonies", "Burial", "Bathing", ...) beside the healing ones. This is a domain, not care:
`healingLedger.js` says so and strips only the burial houses (`careServices`). On the bucket alone, every place has a resident
healing entry (900/900; a burial ground stands at every tier), so that reading tells nothing. I count instead the
**sick-care** names: the bucket's entries whose name is one of 30 the map files as `healing` and whose catalogue
`desc` treats the sick or injured (Healing, Herbal remedies, Basic wound care, Birth assistance, Medicines and compounds,
Surgery, ...; the list is in `read24/analyze.mjs :: SICK_CARE`). Choosing names by their `desc` is my reading (PLAUSIBLE); the
category key is the code's (CONFIRMED).

**"Resident" in the record.** The entry's `institution` names a house on the live roster
(`institutions/institutionRoster.js :: liveInstitutions`) and is not an "Access to …" row, which is a neighbour's house
(`ACCESS_ONLY`). For example, "Weekly rite @ Access to parish church" is not resident.

**THE CAUSE READ (CONFIRMED by read, and by run on the hits).** The line reads HOUSES BY NAME: is a hospital, healer, infirmary
or monastery here? The list reads SERVICES BY CATEGORY: `servicesGenerator.js :: generateAvailableServices` calls
`services/serviceRollMaterialization.js :: materializeInstitutionServiceRolls`, which rolls every live house's menu
(`data/institutionServices.js`). "Priest (resident)" offers "Healing" (p 0.7, needs magic), and an apothecary or a midwife offers
herbs, wound care or births. These houses heal, but none is a "sick house", so the line says no healer stands while Services
lists one under Healing. A third reading sits between them: the capacity's `healerCount` counts an apothecary (dp-town-144,
dp-city-3: healerCount 1) but not a priest or a midwife.

**Confirmed on the census.** dm24-village-0 has no twin in the census (its seeds are `dp-*`). On the lowest census hit,
**dp-village-103**, the page prints the line in Daily Life, and Services prints "Healing / Divine healing magic for the sick
and injured. / Priest (resident)". Its record: sickHouse false, healerCount 0, careCount 3, healing strained 0.89. This is
FINDINGS.md's case exactly. The direct twin of dm24-village-0 (Khirbetqala 219) reads the same: Healing @ Priest (resident),
sickHouse false, healerCount 0, strained 0.89.

## A2 RICH AND HUNGRY
**Counts.** 0 (C), because no census birth is `Wealthy`. **2 (V)**: dp-city-83 and dp-metropolis-57. In V the rich line prints
in 38 places and a short-food line in 56. CONFIRMED.

**Is each fact really in the record?** In both V hits and in FINDINGS.md's dm24-hamlet-1, the wealth fact is high:
`economicState.prosperity = "Wealthy"`. The food fact the short lines read is short:
`capacityModel :: deriveFoodProduction` band `strained` (ratio 0.91 and 0.92; dm24-hamlet-1 0.76). But the food ledger the
page itself prints as "Food Security" reads **Secure**: `economicState.foodSecurity.label "Secure"`, deficitPct 0 and 1
(dm24-hamlet-1: 5). So the record holds both facts, each on its own lens, and the joining is missing. The short-food line
also disagrees with the page's own ledger, which never calls this hunger. Of the 75 Wealthy births in V, 21 have a strained
food band. Detail: `read24/visitor/a2-hits.tsv`.

**Where each line is read (CONFIRMED by read).** The rich line is DS-ECO-8's WEALTHY variant 3 (`angle: street`, no marks,
so it is admitted under hunger too) in `src/data/dossierStateProse/economy.generated.js`. It is selected by
`src/domain/display/stateProse/economyStateProse.js` (`prosperityRung`, from `economicState.prosperity`) and mounted at
`daily_life.standingOfLiving`. "Portions are small, …" is `data/dailyLife/foodCulture.js` `strained` T3, chosen by
`dailyLife.js :: deriveFoodCulture`. "… less food to go round …" is `data/dailyLife/commonerResentments.js` `food` F1, chosen by
`dailyLife.js :: deriveCommonerResentments`. Both short lines read the `food_production` capacity band. DS-ECO-8 has a joined
pool ("FOOD AND PROSPERITY: hunger holds the town down", `foodOnProsperity`), but it keys on `foodSecurity.prosperityMod`, not
on the capacity band.

## B1 THE LAND
**(i) Counts.** 0 (C: no desert). **V**: Desert/Arid places (`config.terrainType = "desert"`; the page's terrain line prints
"Desert/Arid" in all 28 hits): Fish market **25**, Sawmill **17** (the town-and-up row is "Sawmill (commercial)"),
Hunter's lodge **4**, any **28**. CONFIRMED. Detail: `read24/visitor/b1i-hits.tsv`.

**The step that places each.** 44 of the 46 desert houses carry `source: "generated"`: the catalogue draw,
`src/generators/steps/assembleInstitutions.js :: rowRoll` (chance = `baseChance` × `getResourceMultiplier`). One Fish market
and one Hunter's lodge carry `source: "cascade"`: `src/generators/cascadeGenerator.js :: applyCascadeInstitutions`.
CONFIRMED (record field).

**What each reads of the land (PLAUSIBLE, by read).** The three catalogue rows (`data/institutionalCatalog.js`: Fish market,
village 0.30 to metropolis 0.60; Sawmill 0.35 / commercial 0.28 to 0.30; Hunter's lodge, hamlet 0.25 to town 0.15) carry no
`terrainRequired`, no `terrainAccess` and no `tradeRouteRequired`. So `rowRoll`'s gates and the cascade's identical gates never
refuse them. Terrain enters only through `getResourceMultiplier`, as `TERRAIN_DATA[terrain].institutionModifiers` matched by tag
or name. The desert's modifiers (`data/geographyData.js` desert: agriculture 0.2, food 0.4, textile 0.5, luxury 1.5, and named
boosts for glassblower, salt works, caravanserai and others) touch none of their tags (market/trade, trade/timber,
trade/military). Nearby resources only RAISE them (fishing_grounds, river_fish, hunting_grounds, and
`RESOURCE_DATA.instBoosts`). Water is not read for these rows. So in a desert each stands at its plain catalogue chance: no
water, no timber and no game are asked for.

**(ii) Counts.** Both lines: **1 (C)** dp-city-0 (plains; grain imported; no farmland) and **1 (V)** dp-metropolis-77 (forest;
grain imported; no farmland). "Blesses the furrows" alone: 87 (C) and 38 (V). The grain line alone: 14 (C) and 16 (V).
CONFIRMED. Detail: `read24/b1ii-hits.tsv`, `read24/visitor/b1ii-hits.tsv`.

**The steps (PLAUSIBLE, by read).** The tradition's element is chosen in `src/domain/traditions/genesis.js ::
deriveFoundingTraditions` (`elementWeight` and `foundingElementWeight`), which reads the terrain (`resolveTerrain(config)`)
and the trade route only. The `field` element (`data/traditionCorpus.js`) weighs 4 on plains and 1 elsewhere, never 0. Its
wording comes from `data/traditionDescriptionTable.js` `field: [plain('blesses the fields'), plain('honours the fields'),
plain('blesses the furrows')]`, drawn by `domain/traditions/traditionDescription.js`. All three are `plain`, so they declare no
need. The grain line is `data/dailyLife/foodCulture.js` A12, which needs `'grain imported'` (factVocabulary: an import string
naming grain, from the stored imports list that `generators/economy/primaryTradeLists.js :: buildPrimaryTradeLists` writes). It
is drawn by `dailyLife.js :: deriveFoodCulture`.

**THE CAUSE READ, B1.** (i) The house draw has no terrain gate for these three rows, and the terrain modifier table names
none of them. (ii) The tradition reads terrain and route, never the place's grain. Its furrows wording declares nothing,
while the grain line reads the imports. Neither reads the other's fact.

## C1 THE LABEL
**Counts.** 0 (C). **V: 18**, all towns (dp-town-7, -11, -19, -36, -41, -44, -47, -57, -75, -80, -92, -96, -101, -104, -106, -115,
-132, -147). Each prints "Governed by Corrupt Council" on the first screen AND has it as a sentence's subject ("The Corrupt
Council is itself run as …", "The Corrupt Council holds the seat and …", "Corrupt Council vs …"). The 18 are exactly the 18 births whose governing form is
"Corrupt Council". CONFIRMED. Its siblings are not counted: "Corrupt City Council" governs 14 cities and "Shadow Senate"
governs 7 metropolises.

**Where the label is written (CONFIRMED by read and record).** `src/generators/power/rulingStructure.js ::
generatePowerStructure`: at a town, a criminal top category with top priority > 65, or > 55, takes "Corrupt Council". Its
description there reads "The governing body is systematically compromised; offices are sold and justice is purchasable." It
is stored as `powerStructure.factions[isGoverning].faction`, `powerStructure.government` and `governingName`. Under the lit
seat law, `domain/seat/seatTable.js` also lists it as the criminal row's form for transfers.

**The player's page.** The renderer stamps `withPublicProse(town, composePublicProse(town))` and renders the OWNER's
`OutputContainer`. It renders no player page. I checked the shared read by the save's own path, on the same births:
`toPublicSafe(withPublicProse(record, composePublicProse(record)))`. This is the projection `lib/gallery.js` serves, before any
owner veil the share adds. In all **18 of 18** the label survives: as the governing power's name and `government`, and inside
the composed `publicProse` text blocks. So a player's page receives it. That it PRINTS it is PLAUSIBLE: the projection
carries the label, but I rendered no player page. (In the dm24 twins, town-1 and town-3 read the same.)

## D REPEATS ON A JOURNEY
**The stored reading.** `scripts/census/sameness-census.register.json` in the lit tree was last written by **ca5ad2a08**
(2026-11-20 19:58 UTC, "the register re-taken at 7e93c087b"). Its `taken` reads `{ commit: 7e93c087b, srcClean: true }`.
The door's last report, `docs/chair/2026-11-20/content/same/census/SAME-CENSUS.md`, was last written by **0f5b20071**
(2026-11-20 16:25 UTC) and says "Commit measured: 669e2d72e", 50 places a size. **Both were written on a DARK tree**: the seat
law's dial was lit on 2026-11-23 (`domain/seat/seatLaw.js` header), and the flip `d447ee31e` came after. The local clone is
shallow (its boundary is 1bf1427dd), so I read the commits through the GitHub API. Corpus: hxd, 150 a size, the door's default
birth.

The slots, as the register keys them (stored reading; `meet` is TOP shareAll where a slot prints ≤ 1.5 sentences a place,
SEEN otherwise):

| finding | slot | hamlet | village | town | the door | the 15% bar (COMMON-RULES 3) |
|---|---|---|---|---|---|---|
| D1 arrival ("The place") | `web:Summary/Overview \| OverviewTab.1.0.2.1` | TOP 0.107, SEEN 0.037 (ceil 0.04) | TOP 0.100, SEEN 0.031 (0.04) | TOP 0.220, SEEN 0.041 (0.05) | passes (read by SEEN, ~4.4 a place) | passes: SEEN under 30% |
| D2 tensions' first line | `web:Summary/Overview \| OverviewTab.1.0 > Section.6.0.1.0.*.1.0` (also `web:World/History \| … TensionRow.*.0.1`, same reading) | TOP 0.140 (ceil 0.14) | TOP 0.100, SEEN 0.041 (0.05) | **TOP 0.313**, SEEN 0.119 (ceil 0.12) | passes | hamlet passes. Town passes only on SEEN: the slot prints 1.5 to 1.6 tensions a town, so it is read by SEEN, while one sentence stands in 31% of towns, twice the bar |
| D3 origin line | `web:Summary/Overview \| OverviewTab.1.0 > Section.8.0.1.0.*` | TOP 0.247, SEEN 0.116 (ceil 0.12) | TOP 0.167 (ceil 0.17) | TOP 0.133 (ceil 0.14) | passes | village 0.167 is within the 20% sampling allowance. Hamlet passes on SEEN |
| D4 Daily Life visitor lines | `web:World/Daily Life \| DailyLifeTab.0.0.3.*` | **NO ROW** | NO ROW | NO ROW | unregistered: the register predates this page's position | (no stored reading) |
| D4 resentment line | `web:World/Daily Life \| DailyLifeTab.0.0.3.*.1` | NO ROW | NO ROW | NO ROW | unregistered | (no stored reading) |
| D4 standing of living (the rich line, "Money keeps going …") | `web:World/Daily Life \| DailyLifeTab.0.0 > DeskLines.1.0 > ProseBlock.0.0` | TOP 0.120 (ceil 0.14) | TOP 0.160 (ceil 0.16) | TOP 0.167, SEEN 0.083 (ceil 0.09) | passes | village 0.16 is within the 20% sampling allowance |

**The same slots on the lit 900 (the door's own `measureSlots`, read only; NOT the door's corpus).** In V:
- D2 town: TOP 0.300 ("Guild and non-guild traders …"), 1.53 a place, SEEN 0.102, so the door still passes it on SEEN.
- D3: hamlet SEEN 0.121, village TOP 0.127, town TOP 0.100.
- D4 visitor-lines slot: its commonest sentence stands in 22, 17 and 15 of 150 (hamlet, village, town).
- The resentment slot: 11, 6 and 17.
- Read by law 1 (15 of 150 reds an unregistered slot), the visitor-lines slot would red at all three sizes and the resentment
  slot at town (PLAUSIBLE: the door's own corpus is hxd, not mine). The commonest sentence in the visitor-lines slot is a
  power line, not a D4 line.

In C (all-road births), D3 reads TOP 0.35, 0.28 and 0.25, inflated by the all-road corpus. `read24/d-slots.tsv` and
`read24/visitor/d-slots.tsv` hold both readings for every slot.

**THE ONE COUNT, the guild quarrel (D2), on the census 900 (CONFIRMED).** **Towns 54/150 = 36.0%; cities 76/150 = 50.7%**
(V: towns 51/150 = 34.0%, cities 72/150 = 48.0%).

**D's verdict.** The stored register passes every registered D slot. It does so only because a tensions slot printing more than
1.5 a place is judged by SEEN: the guild quarrel stands in about a third of towns and half of cities, above the 15% bar. The
Daily Life visitor-lines slot has no row at all, because the register was taken dark, before that page.

## Not done
No file under `src/`, `tests/` or `scripts/` was changed, and nothing was committed or pushed. No permission was refused. The
texts, rows, records and logs are under the scratchpad `READ-24/` (render, render-visitor, records*.jsonl).
