# ENTAILMENT SURVEY — THE ECONOMY DESK (DS-ECO-* + DS-SUP-*)

Read-only dock: `scratchpad/laneRW-DEFW` @ `f2da5a3ee`. Every `file:line` below is that tree.
Nothing was modified, staged, committed; no vitest/npm/build was run. Node was used only to
print (`scripts/prose-licence-card.mjs`, plus pure `import` + `console.log` probes of frozen
tables and one pure key function).

**The question this packet feeds.** The owner (2026-09-09 23:5x) wants a bounded flexibility:
a recorded fact should license what its NOUN MEANS BY DEFINITION, and not what the noun
merely typically has. The chair's law stands over it — the prose may be more elegant than the
data but never more knowledgeable than the simulation, so an entailment is licensed only
where the ENGINE'S OWN MODEL is consistent with it. This packet is the economy desk's raw
material: every slot noun, every recorded name class with its members, what each word means
by definition, what it does not carry, and where the engine's own rules contradict the
real-world entailment. **The law is not decided here.**

---

## §0 DESK SCOPE — how the block set was derived, not guessed

`scripts/prose-wave-gate.mjs:293-300` refuses a hand-written prefix list and derives a desk
section from the projected leaf itself: `SECTION_LEAVES.economy = DOSSIER_STATE_PROSE_ECONOMY`
(`scripts/prose-wave-gate.mjs:293-299`). The projector's own DESKS table gives that leaf its
prefixes.

| Desk | leaf constant | prefixes | source |
|---|---|---|---|
| economy | `DOSSIER_STATE_PROSE_ECONOMY` | `DS-ECO-` · `DS-SUP-` | `scripts/generate-dossier-state-prose.mjs:107` |

So the economy desk is **fifteen blocks**: `DS-ECO-1..12` and `DS-SUP-1..3`. Confirmed by
printing the leaf's own block keys (`src/data/dossierStateProse/economy.generated.js`).

### §0a The fifteen blocks, their state key, their slots, their census standing

Census: `docs/content/wiring-census.json` — 105 of the 708 pool rows belong to this desk.

| Block | Annex line | STATE-KEY (closed vocabulary) | SLOTS | census rows | RESOLVED / WIRING-UNRESOLVED |
|---|---|---|---|---|---|
| DS-ECO-1 Prosperity header | `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:792` | prosperity rung × `tradeAccess` enum × banded `compound.economyOutput` × `economicComplexity` | `{settlement}` `{access}` `{complexity}` | 5 | 5 / 0 |
| DS-ECO-2 At-a-glance tiles | `:836` | food ternary `Deficit N%`/`Surplus`/`Balanced`; granary band `well stocked`/`stocked`/`thin`/`nearly empty` | `{settlement}` `{season}` | 7 | 7 / 0 |
| DS-ECO-3 Live Trade Flow drift | `:894` | `FLOW_BANDS` × dependency `strained`/`met`/`abundant` × magnitude `quiet`/`trickle`/`steady`/`busy` × `isTradeDependent` | `{settlement}` | 5 | 1 / 4 |
| DS-ECO-4 Market Prices | `:944` | per-good tag `dear`/`steady`/`cheap` + `highlight` or null | `{settlement}` `{good}` | 4 | 0 / 4 |
| DS-ECO-5 Economic Flows chain cards | `:986` | legacy `FLOW_STATUS` chips: `impaired`·`vulnerable`·`running`·`entrepot`·`magically_sustained`·`operational` | `{settlement}` `{chain}` `{institution}` `{resource}` `{good}` | 7 | 0 / 7 |
| DS-SUP-1 SupplyChainsPanel node graph | `:1041` | node-arrow graph, `(missing)` literal, no sentence at all | `{settlement}` `{chain}` `{institution}` `{resource}` `{good}` `{timeband_since}` | 6 | 0 / 6 |
| DS-ECO-6 Shadow economy | `:1090` | three unnamed capture tiers ≥30 / ≥15 / ≥3; whole block `dm-only` | `{settlement}` `{faction}` `{institution}` `{good}` | 3 | 3 / 0 |
| DS-ECO-7 Economy freshness note | `:1128` | one boolean × variant `tallies`/`catalog`; frozen copy unit | `{settlement}` | 2 | 0 / 2 |
| DS-ECO-8 LADDER prosperity tier | `:1159` | closed 7-rung ladder; **`Affluent` is not a rung** | `{settlement}` | 7 | 0 / 7 |
| DS-ECO-9 LADDER food security | `:1217` | closed 6-rung ladder + two provenance-bearing siege flags | `{settlement}` `{season}` | 8 | 2 / 6 |
| DS-SUP-2 canonical chain status + cause library | `:1283` | closed 7 statuses + legacy remap + 11 need families + 7 regional archetypes | `{settlement}` `{chain}` `{institution}` `{resource}` `{good}` `{faction}` `{timeband_since}` | 7 | 0 / 7 |
| DS-ECO-10 export posture + scarcity | `:1398` | 6 closed posture statuses; 3 closed scarcity bands | `{settlement}` `{good}` `{access}` | 10 | 6 / 4 |
| DS-ECO-11 Terrain, strengths, exploitation | `:1477` (RECEIPT `:1481`) | 9 authored terrain words × 3 buckets × `exportValue` 3 words × strengths presence × strategicValue | `{settlement}` `{resource}` `{good}` `{chain}` `{institution}` | 17 | 14 / 3 |
| DS-ECO-12 Income sources + trade profile | `:1604` (RECEIPT `:1608`) | income-mix SHAPE × three trade lists × `isEntrepot` | `{settlement}` `{good}` `{faction}` | 10 | 10 / 0 |
| DS-SUP-3 tier-expected catalog | `:1685` (RECEIPT `:1689`) | 6 closed tiers × expected-category list × absences × impairment counts | `{settlement}` `{institution}` | 7 | 7 / 0 |

DS-ECO-1..10 and DS-SUP-1..2 carry no `RECEIPT:` line in the annex (writer-1's own twelve);
the receipts for those live in the census rows' `reads`/`sites` and in the desk file
`src/domain/display/stateProse/economyStateProse.js`. Blocks with a RECEIPT line are
DS-ECO-11 `:1481`, DS-ECO-12 `:1608`, DS-SUP-3 `:1689` (all authored by VERIFIER-1 at the merge).

### §0b Licence cards printed (11 pools, 8 blocks) — the may-claim / may-NOT grammar as it prints

`node scripts/prose-licence-card.mjs <block> '<pool>'`, run against:

| Block :: pool | reads | may claim | may NOT | source holder / standing |
|---|---|---|---|---|
| DS-ECO-1 :: `COMBINATION C2…` | `rank` (measured) | that `rank` holds, as a STANDING fact | a count, a cause, a season, a future, a standpoint, a second fact, **another civic object of the class `road`** | (none) · SOURCE-UNRESOLVED — no citation licensed |
| DS-ECO-2 :: `GRANARY: thin` | `granary`, `granary.available`, `granary.band` | that `band` (=== thin) holds | …+ **another civic object of the class `store`** | (none) · SOURCE-UNRESOLVED |
| DS-ECO-3 :: `ADEQUATE` | `readings.flowDrift.band` | that `band` (=== adequate) holds | count/cause/season/future/standpoint/second fact | (none) · SOURCE-UNRESOLVED |
| DS-ECO-6 :: `TIER: a large share off the books (≥30)` | `eco.safetyProfile.blackMarketCapture` (>= 30) | that `blackMarketCapture` (>= 30) holds | as above | **watch** · LICENSED · a STATE ORGAN (interested where the town is captured) |
| DS-ECO-9 :: `BLOCKADED` | `eco.foodSecurity.stockpile{,.blockaded,.blockadeBypass}` | that `blockaded` (truthy) holds | as above | **toll-bar** · LICENSED |
| DS-ECO-10 :: `POSTURE: vulnerable` | `readings.exportPosture.status` | that `status` (=== vulnerable) holds | as above | **market** · LICENSED |
| DS-ECO-11 :: `TERRAIN: Coastal` | `text(terrainKey)` via `TERRAIN_POOL_BY_KEY` | that the reader selects the row `coastal` of `TERRAIN_POOL_BY_KEY` | as above | (none) · SOURCE-UNRESOLVED |
| DS-ECO-11 :: `EXPLOITATION: partiallyExploited` | `leading.bucket`, `leading.row` | that `bucket` (=== partiallyExploited) holds | as above | (none) · SOURCE-UNRESOLVED |
| DS-ECO-12 :: `TRADE PROFILE: isEntrepot…` | `eco`, `eco.isEntrepot`, `eco.localProduction`, `eco.primaryExports`, `eco.primaryImports` | that `isEntrepot` (truthy) holds | …+ **another civic object of the class `market`** | **market** · LICENSED |
| DS-ECO-12 :: `INCOME MIX: the criminal line leads` | `eco.incomeSources`, `.filter` | that `incomeSources` holds | as above | **treasury** · LICENSED · a STATE ORGAN |
| DS-SUP-3 :: `THE HEALING GAP` | `readings.notableAbsences`, `.map` | that `notableAbsences` holds | as above | (none) · SOURCE-UNRESOLVED |

Every card also prints the standing REFUSED COLUMNS: a totality over persons; an exemption
from a duty; a named character and that character's fate; a theological claim about a deity.

The `may NOT` line's last clause is generated from `CIVIC_OBJECT_CLASSES`
(`src/domain/prose/wiringCensus.js:1301-1323`) via `objectClassesOf` (`:1358-1374`). The economy
desk's keys land in classes `road`, `store`, `storehouse`, `market`, `craft`.

---

## §1 THE SLOT NOUNS OF THIS DESK — every one, filled or named

Declared shapes: `src/domain/display/stateProse/economyStateProse.js:236-244` (a checked mirror
of annex §0c, `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:170-183`).
Fill site: `economyStateProse.js:898-921` (shared bag), `:987-993` (the exploitation lens's own
bag), `:998-1000` (the impaired-service bag).

| Slot | Shape | Who fills it (file:line) | Members / vocabulary | Shape screen |
|---|---|---|---|---|
| `{settlement}` | proper | `economyStateProse.js:899` ← `settlement.name` | the town's generated name | none |
| `{access}` | bare-common | `economyStateProse.js:901` ← `ACCESS_NOUN[access]`, table at `:173-179` | `road` · `river` · `port` · `crossroads` · `pass` (from `mountain_pass`). **`isolated` has NO fill, deliberately** (`:167-170`) | `bareCommonFill` `:274-282` |
| `{complexity}` | bare-common | `economyStateProse.js:907` ← `COMPLEXITY_NOUN[display]`, table `:212-224` | eleven authored phrases: *spread of trades · broad base of trades · handful of trades · market trade · specialist trade · narrow trade · mix of field and market · surplus farm trade · small farm surplus · farm surplus · subsistence living* | `bareCommonFill` |
| `{season}` | bare-common | `economyStateProse.js:908` ← `granary.season` (the raw token, not `seasonTitle`) | `spring` · `summer` · `autumn` · `winter` (`src/domain/display/dossierViewModel.js:304`; `SEASON_TITLE` at `:296`) | `bareCommonFill` |
| `{good}` (shared bag) | bare-common | `economyStateProse.js:909` ← `leadingGoodNoun(eco.primaryExports)` `:848-853` | chain OUTPUT labels, `(transit)`-marked ones skipped | `bareCommonFill`. **Measured 0 fills of 48 generated settlements — all 99 distinct export labels are capitalised** (`:26-27`) |
| `{good}` (exploitation lens only) | bare-common | `economyStateProse.js:990` ← `leading.row.finalProducts[0]` | `clothing · bread · aged wine · leather goods · tools · cookware · jewelry · furniture · buildings · pottery · boots · preserved fish · windows · healing potions · highland wool · building timber · table salt · blown glass · camel leather · dried dates · medicines` (`src/data/resourceChains.js`) | `bareCommonFill`. Role note at `:981-986`: this `{good}` means the **finished article of one resource line**, never the export column |
| `{resource}` | bare-common **singular** | `economyStateProse.js:989` ← `leading.row.rawResource` | see §2.11 | `singularBareCommonFill` `:312-316` — refuses any trailing `s`, because `rawResource` writes plurals beside its mass nouns (`:287-304`) |
| `{institution}` | proper | `economyStateProse.js:991` ← `leading.row.processingInstitutions[0]`; `:999` ← `readings.impairedInstitution` | see §2.12 | `properFill` `:333-340`; refuses digits — measured, exactly one of 25 refused: `Bakers (5-15)` (`:326-329`) |
| `{chain}` | bare-common | **NEVER FILLED on this desk.** Measured 0 of 318 conformant (`:20-27`) | `SUPPLY_CHAIN_NEEDS[*].chains[].label` — all Title-Cased with `&` | anchored liveness drops all 38 variants naming it |
| `{faction}` | proper | **DELIBERATELY UNFILLED** (`economyStateProse.js:910-921`): the raw roster carries no `archetype`, and filling it from the income LABEL would name a revenue LINE where the sentence names a HOUSE — "the label trap, one layer up" | — | pool keeps 2 of 3, measured |
| `{timeband_since}` | phrase | named only by `DS-SUP-1` and `DS-SUP-2`, both WIRING-UNRESOLVED | closed six-band table, `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:433-440` | no digits ever (`:430`) |

---

## §2 EVERY RECORDED NAME CLASS THIS DESK CAN RENDER — members and file:line

### §2.1 Trade-access words — the `{access}` class
`config.tradeRouteAccess`, written at `src/generators/steps/resolveConfig.js:195`; holder kind
`toll-bar` (`src/domain/prose/holderTable.js:183`).

| Token | `{access}` fill | Where it can come from |
|---|---|---|
| `road` | road | every terrain pool (`resolveConfig.js:29-37`) |
| `river` | river | plains, forest, riverside, coastal pools |
| `port` | port | coastal pool only (`:34`) |
| `crossroads` | crossroads | plains, hills, riverside, desert pools |
| `isolated` | **no fill** | hills, forest, mountain, desert pools; filtered OUT of a town-or-larger random roll unless magic can carry it (`:125-127`) |
| `mountain_pass` | pass | **no terrain route pool produces it** (`:29-37`) — reachable only by explicit config |

### §2.2 Terrain — the DS-ECO-11 accent class
`TERRAIN_DATA`, `src/data/geographyData.js:50`, seven keys only.

| key | `name` (display) | `impliedTradeAccess` | `agricultureCapacity` | corpus pool routed |
|---|---|---|---|---|
| `coastal` | Coastal | port | 0.8 | `TERRAIN: Coastal` |
| `riverside` | **Riverside** | river | 1.3 | `TERRAIN: River` |
| `mountain` | **Mountain** | road | 0.4 | `TERRAIN: Mountains` |
| `forest` | Forest | road | 0.6 | `TERRAIN: Forest` |
| `plains` | Plains | crossroads | 1.5 | `TERRAIN: Plains` |
| `hills` | Hills | road | 0.9 | `TERRAIN: Hills` |
| `desert` | **Desert/Arid** | crossroads | 0.3 | `TERRAIN: Desert` |
| — | — | — | — | `TERRAIN: Swamp`, `TERRAIN: Tundra`, `TERRAIN: anything else` have **NO producer** |

Route table: `economyStateProse.js:647-655` (`TERRAIN_POOL_BY_KEY`, keyed on the TOKEN).
Terrain weights (7, no swamp/tundra): `resolveConfig.js:24-27`.

### §2.3 Prosperity rungs — DS-ECO-1 / DS-ECO-8
`PROSPERITY_TIERS`, `src/data/constants.js:92-94`; rank `:97-100`; authored readings
`src/domain/compendium/bandLadders.js:52-60`.
`Subsistence · Struggling · Poor · Moderate · Comfortable · Prosperous · Wealthy` (0..6).
Band cut used by the header pool: low ≤2, high ≥5 (`economyStateProse.js:356-357`, a declared
vetoable judgment).

### §2.4 Food-security labels — DS-ECO-9
`src/generators/foodGenerator.js:341-359`, in producer order:
`'Deficit — Active Famine'` (stress famine) · `'Deficit'` (deficitPct > 40) ·
`'Import-Dependent'` (>15) · `'Pressured'` (>5) · `'Surplus'` (surplusPct > 40) · `'Secure'` (else).
Reaches `economicState.foodSecurity` via `computeBaseProsperity`
(`src/generators/economy/prosperity.js:223`, `:289`; `economicState.js:845`, `:877`).

### §2.5 Granary bands and the season — DS-ECO-2
`src/domain/display/dossierViewModel.js:336`: `frac >= 0.75` well stocked · `>= 0.4` stocked ·
`>= 0.15` thin · else nearly empty, where `frac = storageMonths / capacityMonths`.
Capacity table: `src/domain/worldPulse/foodStockpile.js:185-195`.
Seasons: `SEASON_ORDER` `dossierViewModel.js:304`; `SEASON_TITLE` `:296`;
year events `SEASONAL_EVENT_NOTE` `:298-302` (`hard_winter`, `drought`, `bountiful`).

### §2.6 Export posture — DS-ECO-10
`src/domain/display/exportPosture.js:20-27` (labels) and `:56-62` (the ladder).

| status | authored label | the ONLY rule that sets it |
|---|---|---|
| `none` | 'No exports: economic isolation' | `count === 0` |
| `entrepot` | 'Entrepôt: re-exports transit goods' | `isEntrepot` truthy |
| `vulnerable` | 'Exports exist but trade routes are vulnerable' | `access === 'isolated'` |
| `limited` | 'Limited export access' | `count === 1` |
| `established` | 'Active exports' | else (count ≥ 2) |
| `import_dependent` | 'Import-dependent' | **NO PRODUCER** — a key of the label table only (`economyStateProse.js:622-630`) |

### §2.7 Market scarcity, tags and movements — DS-ECO-4 / DS-ECO-10
`src/domain/display/marketPrices.js`:
bands `commodityBandForGood` `:143-151` (`shortage` < 0.35×8 units of stock · `surplus` > 1.25×8 · else `adequate`);
tags `:182-184` (`shortage`→dear, `surplus`→cheap, else steady);
movements `MOVEMENTS` `:70-76` (`nearly double its usual price` · `a shade above…` · `its usual price` ·
`a shade under…` · `a third under…`), ordered `:81`;
crier frames `CRIER_FRAMES` `:228-239`;
services never move — `resolveGood` returns null for anything not `kind === 'good'` `:129-133`.

### §2.8 Live flow bands, magnitude and dependency — DS-ECO-3
`src/domain/spatial/tradeFlow.js:75` `FLOW_BANDS = {shortage, adequate, surplus}`;
`:76` `FLOW_MAGNITUDE = {quiet, trickle, steady, busy}`; `flowMagnitudeBand` `:226-233`;
`throughputBand` `:244-253`.
`src/domain/display/tradeFlowEconomics.js:65-81` `BAND_COPY` — label (`Trade choked`/`Trade steady`/
`Trade brisk`), dependency word (`strained`/`met`/`abundant`, **1:1 with the band**) and headline.
`isTradeDependent` `:58-62`.

### §2.9 Canonical supply-chain statuses and their legacy chips — DS-ECO-5 / DS-SUP-2
`src/domain/supplyChainState.js:22` canonical seven: `stable` · `strained` · `scarce` ·
`blocked` · `captured` · `substituted` · `collapsing`; `:185-187` the set.
Legacy remap `:174-181`: `operational`→stable · `running`→stable · `entrepot`→stable ·
`vulnerable`→strained · `impaired`→scarce · `magically_sustained`→substituted · `unexploited`→blocked.
**An unknown status silently becomes `stable`** (`:199-202`) — the R-DST-F hazard the annex names at
`docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:1291-1295`.
Compounding ladder `:436-456`; regional archetypes `:343-351` (seven).

### §2.10 The eleven need families — DS-SUP-2's cause library
`SUPPLY_CHAIN_NEEDS` group keys, `src/data/supplyChainData.js:10ff`; consequences and parties
`NEED_HEURISTICS` `src/domain/supplyChainState.js:247-303`:
`food_security` (Food Security) · `raw_extraction` (Raw Materials & Fuel) · `manufacturing`
(Manufacturing & Crafts) · `trade_entrepot` (Trade & Entrepôt) · `defense_security`
(Defense & Security) · `healing_medicine` · `knowledge_information` · `arcane_magical` ·
`religion_civic` · `entertainment_culture` · `criminal_economy` (Criminal Economy).

### §2.11 Resource chains — the `{resource}`, `{good}`, `{institution}` class of DS-ECO-11
`src/data/resourceChains.js`, 23 chains. `rawResource` (the `{resource}` fill), `exportValue`,
`finalProducts[0]` (the lens `{good}`), `processingInstitutions[0]` (the lens `{institution}`).

| chain key | rawResource | exportValue | finalProducts[0] | processingInstitutions[0] | passes the singular bare-common screen? |
|---|---|---|---|---|---|
| wool | wool | high | clothing | Weavers' guild | yes |
| flax | flax | medium | clothing | Weavers' guild | yes |
| grain | grain | medium | bread | Mill | yes |
| grapes | grapes | high | aged wine | Vintner | **no** (trailing s) |
| livestock | livestock | medium | leather goods | Butcher | yes |
| ironOre | iron ore | very high | tools | Mine | yes |
| copperOre | copper ore | high | cookware | Mine | yes |
| preciousMetals | gold/silver ore | very high | jewelry | Mine | yes |
| timber | timber | medium | furniture | Sawmill | yes |
| stone | stone | medium | buildings | Stone quarry | yes |
| clay | clay | medium | pottery | Potter | yes |
| hides | animal hides | high | boots | Tannery | **no** (plural) |
| fish | fish | medium | preserved fish | Fishmonger | yes |
| gemstones | gemstones | very high | jewelry | Mine | **no** (plural) |
| sand | glass sand | high | windows | Glassblower | yes |
| herbs | medicinal herbs | very high | healing potions | Apothecary | **no** (plural) |
| alpineWool | `alpine_pasture` | high | highland wool | Weavers' guild | **no** (snake_case) |
| mountainTimber | `mountain_timber` | medium | building timber | Sawmill | **no** (snake_case) |
| desertSalt | `desert_salt` | high | table salt | Salt works | **no** (snake_case) |
| desertGlass | `glass_sand` | high | blown glass | Glassblower | **no** (snake_case) |
| camelCaravan | `camel_herds` | very high | camel leather | Caravanserai | **no** (snake_case) |
| oasisDate | `oasis_water` | high | dried dates | Market | **no** (snake_case) |
| mineralHot | `hot_springs_mineral` | high | medicines | Alchemist shop | **no** (snake_case) |

`exportValue` word class (four, not three): `very high` · `high` · `medium` · `low`
(`resourceChains.js` values; the corpus's split at `economyStateProse.js:733-735` puts
`high`/`very high` in the "high" pool and everything else in "medium or low").
Exploitation buckets (three): `unexploited` · `partiallyExploited` · `fullyExploited`
(`src/generators/resourceGenerator.js:432`, `:455`, `:465`; selection order and comparator
`economyStateProse.js:746-767`).

### §2.12 Institution names this desk can put in `{institution}`
Two producers only:
1. `processingInstitutions[0]` of the leading exploitation row (§2.11 column) —
   `economyStateProse.js:991`.
2. `readings.impairedInstitution`, one name out of the impairment sets `computeChainSets`
   builds — `economyStateProse.js:997-1000`, `src/components/new/tabHelpers.js:4-57`.

Adjacent name classes a face must NOT reach for, because no slot on this desk fills from them:
the terrain institution-modifier names (`src/data/geographyData.js:170,175,180,244,249,254,263,271,340,345,354,359,364,369,374,379,455,460,465,470,475,480,554,562,567,572,579,651,656,661,666,671` — including the typo row `name: "granar"` at `:460`), and the whole shipped catalog
(`src/data/institutionServices.js`, 285 institutions).

### §2.13 Native resources, with the engine's OWN typed condition semantics
`RESOURCE_DATA` labels `src/data/resourceData.js`; `RESOURCE_SEMANTICS`
`src/domain/resourceSemantics.js:43ff`; condition records `:374-394` (conditions
`available` · `depleted` · `absent`, typedef `:31`).

| type (`resourceSemantics.js:29`) | members | `randomDepletionEligible` | `recoveryMode` |
|---|---|---|---|
| `renewable` | fishing_grounds, shipbuilding_timber, fertile_floodplain, river_fish, hunting_grounds, managed_forest, foraging_areas, ancient_grove, grain_fields, grazing_land, marshlands, date_palms, camel_herds, alpine_pasture, mountain_timber | true | `natural` |
| `exhaustible` | salt_flats, river_clay, iron_deposits, stone_quarry, precious_metals, gemstone_deposits, coal_deposits, ancient_ruins, glass_sand, desert_salt | true | **`manual`** |
| `positional` | deep_harbour, crossroads_position, hot_springs, defended_pass, oasis_water, hot_springs_mineral | **false** | `not_applicable` |
| `infrastructure` | river_mills | **false** | `not_applicable` |
| `magical` | magical_node | true | `requires_high_magic` |

### §2.14 Tier words — DS-SUP-3
`TIER_ORDER` `src/data/constants.js:3`: `thorp · hamlet · village · town · city · metropolis`.
Population ranges `:7-14` (thorp 8–60 · hamlet 61–400 · village 401–900 · town 901–5000 ·
city 5001–25000 · metropolis 25001–100000).

### §2.15 Service categories and the tier expectation — DS-SUP-3
`src/domain/display/servicesDisplay.js:15-22` `EXPECTED_SERVICES_BY_TIER`:
thorp `[food]` · hamlet `+healing` · village `+equipment` · town `+information, lodging` ·
city `+legal, transport` · metropolis `+entertainment`.
`SERVICE_LABELS` `:25-30`, eleven category words: lodging · food (Food & Drink) · equipment ·
magic (Magical Services) · information · healing · transport (Transportation) ·
legal (Legal & Financial) · entertainment · employment · criminal (Criminal Services).
`deriveNotableAbsences` `:48-53`.
Impairment words `src/components/new/tabHelpers.js:40-46`: `impaired` · `degraded` ·
`vulnerable`, plus a fourth set `magicalInfra` `:38-39` that removes a service from all three `:55`.

### §2.16 Income-source labels — DS-ECO-12
`src/generators/economy/economicState.js`: `'Market Taxes'` / `'Magical Trade Revenue'`
`:78,84,92`; `'Toll Revenue'` `:176`; `'Agricultural Rents'` `:56-67`; five criminal spellings
`:334-341` — `Criminal Syndicate Revenue` · `Thieves' Guild Revenue` · `Smuggling Network
Revenue` · `Shadow Economy (untaxed)` · `Black Market Revenue`, all carrying `isCriminal: true`
`:349`. Sorted by percentage then codepoint `:844`.

### §2.17 Criminal institution labels and crime types — DS-ECO-6
`CRIMINAL_INST_LABELS` `src/generators/safetyProfile.js:593-609`, fifteen: Thieves' Guild
Chapter · Thieves' Guild (Powerful) · Assassins' Guild · Multiple Criminal Factions · Black
Market · Black Market Bazaar · Smuggling Operation · Smuggling Network · Street Gang · Front
Businesses · Underground City · Gambling Den · Gambling Halls · Gambling District · Red Light
District.
Crime types `:391,399,413,422,429,439,448,456,471,482,503,511`: State predation · Criminal
governance · Arcane black market · Religious fraud · Commercial crime · Organized guild crime ·
Survival crime · Magical crime · Smuggling · Street gang activity · Lawlessness · Background crime.

### §2.18 Economic complexity labels — DS-ECO-1
`COMPLEXITY_LABEL` `src/domain/display/labelBands.js:130-142`, eleven; band collapse
`COMPLEXITY_BAND_BY_LABEL` `:149-161` — **`Subsistence` names THREE labels and `Diversified` TWO**
(`:112-115`).

### §2.19 Holder kinds — who keeps which economy record
`src/domain/prose/holderTable.js:78-83` (twelve kinds), `:164-239` (field → kind),
`:271-365` (kind → record-keeping service names), `:115` STATE_ORGAN_KINDS.
Economy-desk mappings: `incomeSources`/`viable`/`criticalIssueCount`/`economicViability` →
**treasury** (`:166-169`); `primaryExports`/`primaryImports`/`localProduction`/`isEntrepot`/
`activeChains`/`exportPosture`/`economicStrengths`/`strategicValue`/`exploitation` → **market**
(`:172-180`); `tradeRouteAccess`/`blockaded`/`blockadeBypass` → **toll-bar** (`:183-185`);
`blackMarketCapture`/`criminalCaptureState`/`safetyProfile` → **watch** (`:210-212`);
`terrainType`/`monsterThreat` → **road** (`:233-234`).

### §2.20 Civic object classes the desk's keys land in
`src/domain/prose/wiringCensus.js:1301-1323`: `store` (stores · reserve · reserves · stock ·
larder · harvest) `:1309`; `market` (market · trade · export · import · commerce · merchant ·
caravan) `:1310`; `road` (road · route · approach · port · harbour · bridge · pass · ford) `:1313`;
`craft` (forge · smith · workshop · guild · craft · mill · yard) `:1316`; `storehouse` (granary ·
silo · storehouse · warehouse) `:1322`, which alone folds back into `store` `:1372`.

---

## §3 ENTAILMENT CANDIDATE ROWS

Format: **noun** · name class + members with file:line · **ENTAILS** (what the word means by
definition, per member) · **NOT ENTAILED** (typical association the word does not carry) ·
**ENGINE CONTRADICTS** (a real-world entailment the engine's own rules refuse, quoted).

### 3.1 `{access}` — the approach word

| | |
|---|---|
| **Name class** | `road` · `river` · `port` · `crossroads` · `pass` — `ACCESS_NOUN`, `economyStateProse.js:173-179`, from `config.tradeRouteAccess` (`resolveConfig.js:195`) |
| **ENTAILS** | *road*: an overland way. *river*: **water**, and a way along it (terrain `riverside.impliedTradeAccess: 'river'`, `geographyData.js:143`; `naturalFeatures` include ford, bridge site, ferry crossing `:196-200`). *port*: **water**, and a harbour edge (`coastal.impliedTradeAccess: 'port'` `:67`; `naturalFeatures: harbor` `:114`). *crossroads*: **more than one way**, meeting (`RESOURCE_DATA.crossroads_position.label = 'Strategic Crossroads'`, `resourceData.js`). *pass*: **high ground on both sides**, one way through (`defended_pass.label = 'Mountain Pass'`) |
| **NOT ENTAILED** | width · surfacing · upkeep · who patrols it · whether traffic is presently on it (that is DS-ECO-3's separate `tradeFlow` ledger reading) · safety · a toll · a bridge or a ferry (a `river` town has neither field) · age · who built it |
| **ENGINE CONTRADICTS** | (a) `mountain_pass` **cannot arise on a generated town**: no entry of `TERRAIN_ROUTE_POOLS` contains it (`resolveConfig.js:29-37`), so "the pass this town grew on" over a random world is a fact the record cannot carry. (b) `isolated` is not a road at all and **contributes no `{access}` fill by design** (`economyStateProse.js:167-170`), so a variant that needs the noun is dropped rather than filled with "no road". (c) The access word is standing **configuration**, so DS-ECO-1's entailment note binds: *"`tradeAccess` is a structural field ⇒ a structural clause about the town's approaches IS licensed"* — and nothing historical (`RECEIPT_POOLS_DOSSIER_STATE.md:801-802`) |

### 3.2 `{complexity}` — the shape of the town's earning

| | |
|---|---|
| **Name class** | eleven authored phrases, `COMPLEXITY_NOUN` `economyStateProse.js:212-224`, keyed on `COMPLEXITY_LABEL` `labelBands.js:130-142` |
| **ENTAILS** | *spread of trades / broad base of trades*: **more than one** earning line. *handful of trades / narrow trade*: **few**. *market trade*: a market-mediated economy. *specialist trade*: **one** speciality. *mix of field and market*: both farming and market. *surplus farm trade / small farm surplus / farm surplus*: **farming, with something left over**. *subsistence living*: **nothing left over** |
| **NOT ENTAILED** | prosperity (a `spread of trades` town can sit at any rung: `deriveEconomicComplexity` reads tier, income-source count, export count and a market-institution flag — `economicState.js:878-883` — none of which is the rung) · guilds · a market square · headcount · how long the trades have existed |
| **ENGINE CONTRADICTS** | The band collapse is **not injective**: `Subsistence` names three producer labels and `Diversified` two (`labelBands.js:112-115`, `:149-161`). A face treating the band word as an identity claims a distinction the record does not make. The producer's own display string is a **key and never a fill**: an unrecognised spelling contributes NOTHING rather than falling into a neighbouring phrase (`economyStateProse.js:902-907`) |

### 3.3 `{season}` — the stockpile record's own season word

| | |
|---|---|
| **Name class** | `spring` · `summer` · `autumn` · `winter` — `SEASON_ORDER` `dossierViewModel.js:304`; the fill takes the raw token, not `SEASON_TITLE` (`economyStateProse.js:908`) |
| **ENTAILS** | a **position in the year**, one of four, thirteen weeks each (`WEEKS_PER_SEASON = 13`, `dossierViewModel.js:303`); an order (spring → summer → autumn → winter) |
| **NOT ENTAILED** | weather · temperature · a harvest · a sowing · hunger · a festival · a campaigning season. The only weather-adjacent field is `seasonalEvent`, a **separate** three-value enum: `hard_winter` · `drought` · `bountiful` (`dossierViewModel.js:298-302`), and its absence is the common case |
| **ENGINE CONTRADICTS** | "winter is hard here" is a `seasonalEvent` claim, not a `season` claim: `hard_winter` is its own recorded value and a town in `winter` without it has no hardship on the record. Likewise a bad harvest is `drought`, not `autumn` |

### 3.4 `{good}` — the export column word (shared bag)

| | |
|---|---|
| **Name class** | chain OUTPUT labels reaching `economicState.primaryExports` (`economicState.js:791-795, :863`), with `' (transit)'`-marked entries skipped (`economyStateProse.js:848-853`) |
| **ENTAILS** | a **made or handled thing that leaves the town**; a transit-marked one entails only that it **passed through** (`computeActiveChains.js:751` writes `${o} (transit)` from an entrepôt chain's first output) |
| **NOT ENTAILED** | volume · price · a buyer · a route · who makes it · that it is the town's largest export (the list is not ranked by value; it is a set built from chain outputs and reordered by subsumption, `economicState.js:835`) |
| **ENGINE CONTRADICTS** | The slot is **dark in practice**: `leadingGoodNoun` fills 0 of 48 generated settlements, because all 99 distinct export labels the generator writes are capitalised (`economyStateProse.js:26-27`). A rewrite that assumes the noun renders is writing for a seam that does not fire |

### 3.5 `{good}` — the exploitation lens word (the lens's OWN bag)

| | |
|---|---|
| **Name class** | `finalProducts[0]` of the leading exploitation row — §2.11 |
| **ENTAILS** | the **finished article at the far end of ONE resource line**, and only that line |
| **NOT ENTAILED** | that the town exports it · that it is sold at all · a quantity |
| **ENGINE CONTRADICTS** | Using the shared-bag `{good}` here would put a chain's output into a sentence about the export column — declared as finding R-DST-ROLE, `economyStateProse.js:981-986`: *"a proper-name slot filled from the wrong ROLE, which reads fluent and is false"* |

### 3.6 `{resource}` — the raw input word

| | |
|---|---|
| **Name class** | `rawResource` of `RESOURCE_CHAINS` (§2.11); the underlying native roster is `RESOURCE_DATA` (33, `resourceData.js`) with typed semantics `RESOURCE_SEMANTICS` (`resourceSemantics.js:43ff`) |
| **ENTAILS** | *timber*: **wood**, from standing trees. *iron ore / copper ore / gold-silver ore*: **metal-bearing rock**, needing a smelter (chain `processingInstitutions` include Smelter, `resourceChains.js`). *stone*: **rock**, quarried. *clay*: **earth**, fired. *fish*: **water**. *grain*: **a field crop**, milled. *wool*: **from a living animal**, shorn and not killed. *animal hides*: **from a dead animal**. *glass sand*: **sand**, melted. *medicinal herbs*: **plants**, gathered. *gemstones*: **stone**, cut. *grapes*: **fruit**, pressed. *livestock*: **living animals**. *flax*: **a plant fibre**, retted and spun |
| **NOT ENTAILED** | quantity · quality · depth of the deposit · how long it has been worked · who owns it · a price · that anyone works it (that is the exploitation bucket, a separate reading) |
| **ENGINE CONTRADICTS** | (a) A **positional** resource cannot deplete at all: `randomDepletionEligible: false`, `recoveryMode: 'not_applicable'` for deep_harbour, crossroads_position, hot_springs, defended_pass, oasis_water, hot_springs_mineral (`resourceSemantics.js`). So "the harbour has silted", "the oasis is drying", "the springs are failing" are more knowledgeable than the model. (b) An **exhaustible** resource has `recoveryMode: 'manual'` — it does **not** come back on its own; "the seams will refill given a generation" is contradicted. (c) A **renewable** resource has `recoveryMode: 'natural'`; "worked out for good" is contradicted for the fifteen renewable rows. (d) DS-ECO-11's own fence: *"An unexploited chain means the town has never worked it, NOT that it stopped — there is no depletion field on this surface"* (`RECEIPT_POOLS_DOSSIER_STATE.md:1491-1495`); the one licence for a *gave out* clause is `resourceCondition: depleted`, which belongs to DS-SUP-1/DS-SUP-2 |

### 3.7 `{institution}` — the processing house / the impaired house

| | |
|---|---|
| **Name class** | §2.12 — `processingInstitutions[0]` (Weavers' guild · Mill · Vintner · Butcher · Mine · Sawmill · Stone quarry · Potter · Tannery · Fishmonger · Glassblower · Apothecary · Salt works · Caravanserai · Market · Alchemist shop) or one impaired-set name |
| **ENTAILS** | *mill*: **grinds** (or fulls; see the alias trap in §5.2). *sawmill*: **cuts timber**. *mine*: **takes ore out of the ground**. *quarry*: **cuts stone**. *smelter*: **melts ore**. *tannery*: **makes leather from hides**. *weavers' guild*: **makes cloth from fibre**. *potter*: **fires clay**. *glassblower*: **melts sand**. *apothecary*: **compounds remedies**. *fishmonger*: **sells fish**. *vintner*: **makes wine**. *butcher*: **kills and cuts**. *salt works*: **wins salt**. *caravanserai*: **lodges a caravan**. *market*: **a place where goods change hands** |
| **NOT ENTAILED** | size · staffing · condition · age · whether it is busy · who owns it · profit · a guild membership · a building (an entry may be a phrase, not a house: `'Access to external mill'` is a `processingInstitutions` member of the grain chain, `resourceChains.js`) |
| **ENGINE CONTRADICTS** | (a) An institution row carries **no condition, no age and no wear** anywhere the economy desk reads; nothing in the model lets a mill break, silt or fall down. "The mill has stood since the founding" and "the mill is falling in" are both outside the record — the economy analogue of *built walls keep standing*. (b) `properFill` refuses a member carrying a count: measured, exactly one of 25 is refused, `Bakers (5-15)` (`economyStateProse.js:326-329`) — the count in the name is not a headcount the prose may band. (c) A `{resource}` seam must take a **singular** verb: `singularBareCommonFill` refuses any trailing `s`, because the first render over real settlements printed *"The animal hides sits at the edge…"* and *"point at the medicinal herbs, and nobody in this town is working it"* (`economyStateProse.js:287-304`) |

### 3.8 The granary (DS-ECO-2's noun)

| | |
|---|---|
| **Name class** | the four band words `well stocked` · `stocked` · `thin` · `nearly empty` (`dossierViewModel.js:336`), read off `storageMonths / capacityMonths`; the building-side flag is `hasGranary: hasAny(names, ['granar'])` (`priorityHelpers.js:63`) |
| **ENTAILS** | a **store of food held against a later need**; the band entails a **fraction of what this town can hold**, never an absolute quantity |
| **NOT ENTAILED** | a building · a door · a keeper · a queue · a count of sacks · how long the stores will last in months (that is `lastsUntil`, a separate derived projection, `dossierViewModel.js:341-347`) · why the level is where it is (DS-ECO-2's own fence: *"the reason the granary is where it is has no field behind it here and is never supplied"*, `RECEIPT_POOLS_DOSSIER_STATE.md:847-848`) |
| **ENGINE CONTRADICTS** | **A town with no granary building still has a granary reading.** `storageCapacityMonths` falls through to 1.5 months (thorp/hamlet) or 2.0 (all other tiers) when no institution name contains `granar` (`foodStockpile.js:190-193`). So "the granary doors", "the granary is watched now", "a granary standing deep in winter" assert a building the roster may not carry. The `store`/`storehouse` civic-object split exists for exactly this: `GRANARY: thin` is **about the stock**, `Disasters & Famine: granary AND hospital` is about **which buildings exist** (`wiringCensus.js:1304-1308`) |

### 3.9 The prosperity rung

| | |
|---|---|
| **Name class** | seven rungs, `constants.js:92-94`; readings `bandLadders.js:52-60` |
| **ENTAILS** | an **ordered position** on a closed ladder, and the authored reading of that rung (which the variants may paraphrase and never contradict — R-DST-C) |
| **NOT ENTAILED** | a cause · a direction (rising or falling) · a history · a comparison to a neighbour · coin · reserves as a countable thing |
| **ENGINE CONTRADICTS** | DS-ECO-8 calls this *"the file's hardest fence"*: the rung is a **derived output** read from export volume, income sources, supply chains, trade route and safety; it is **not a dial and carries no provenance trail**, so every variant is *"plain description with no causal clause of any kind"* (`RECEIPT_POOLS_DOSSIER_STATE.md:1166-1174`). Also: **`Affluent` is not a rung** — the old Compendium prose drifted from the typed truth (`:1162-1164`). An unrecognised spelling must render **nothing** rather than fall into a band (`economyStateProse.js:364-372`) |

### 3.10 The food-security rung

| | |
|---|---|
| **Name class** | six labels, `foodGenerator.js:341-359` |
| **ENTAILS** | *Surplus*: raises more than it eats. *Secure*: covers itself. *Pressured*: a small standing gap. *Import-Dependent*: **a substantial part of what it eats is bought** — dependence, and nothing more. *Deficit*: a large standing gap. *Active Famine*: not enough, and no arrangement bringing enough |
| **NOT ENTAILED** | a named cause. The annex is sharpest here: *"`Import-Dependent` entails dependence, not a named cause — a route clause is licensed ONLY where a route or chain field actually carries the break"* (`RECEIPT_POOLS_DOSSIER_STATE.md:1223-1226`). Also not entailed: deaths (the block bans named deaths, `:1235`), a season, a blockade |
| **ENGINE CONTRADICTS** | (i) The label is **derived from a deficit percentage against daily need** (`foodGenerator.js:330-359`), so it is a *ratio* reading and not a stock reading; the stores are DS-ECO-2's separate fact. (ii) `blockaded`/`blockadeBypass` ARE event-provenance and are the **only** two pools in the block where a causal clause is licensed (`:1228-1229`); the blockade states **override the ladder** entirely (`economyStateProse.js:387-396`) |

### 3.11 The export posture word

| | |
|---|---|
| **Name class** | six statuses, `exportPosture.js:20-27`, `:56-62` |
| **ENTAILS** | *none*: **zero** exports. *limited*: **exactly one**. *established*: **two or more**. *entrepot*: goods go out that came in. *vulnerable*: **the town's access token is `isolated`** |
| **NOT ENTAILED** | value · buyers · reliability of the goods · that a route was ever cut. DS-ECO-10's fence: *"Posture is derived from a count and a configuration ⇒ structural clauses only: the town is arranged so that, never the town lost… The `vulnerable` pool in particular describes an approach that is unreliable BY ITS NATURE and never an approach that was cut"* (`RECEIPT_POOLS_DOSSIER_STATE.md:1409-1414`) |
| **ENGINE CONTRADICTS** | `import_dependent` has **no producer**: the if-chain has five arms and no sixth (`exportPosture.js:56-62`; the finding is written up at `economyStateProse.js:622-630`). A face composed for that pool renders on no shipped town |

### 3.12 The live trade-flow band

| | |
|---|---|
| **Name class** | `shortage` · `adequate` · `surplus` (`tradeFlow.js:75`), magnitude `quiet` · `trickle` · `steady` · `busy` (`:76`), dependency `strained` · `met` · `abundant` (`tradeFlowEconomics.js:65-81`) |
| **ENTAILS** | a **measured throughput on the spatial ledger this tick** — inflow plus outflow against two tuning thresholds (`throughputBand`, `tradeFlow.js:244-253`) |
| **NOT ENTAILED** | a reason. The annex: *"A clause about the roads' present state is licensed; a clause naming WHY the roads are quiet is NOT — drawing it here would let the dossier invent a war out of a throughput number"* (`RECEIPT_POOLS_DOSSIER_STATE.md:902-906`). Also not entailed: goods being scarce in the market (that is `commodityBandForGood`, a different ledger), a caravan, a season |
| **ENGINE CONTRADICTS** | (a) `SHORTAGE × not trade-dependent` **can never key**: the non-dependent branch is `throughput > ABUNDANT_CEIL ? SURPLUS : ADEQUATE` with no shortage arm at all — measured by exhaustion over 361 (inflow, outflow) points, 63 reach a shortage band with dependency and **0** without (`economyStateProse.js:583-597`). (b) An unrecognised band is **null, not adequate** (`:605-611`) — a town whose roads were never measured has not been measured as busy |

### 3.13 The canonical supply-chain status

| | |
|---|---|
| **Name class** | seven, `supplyChainState.js:22`, `:185-187` |
| **ENTAILS** | *stable*: all inputs present. *strained*: running with no slack. *scarce*: producing below normal. *blocked*: offline after a hard upstream failure. *captured*: a faction takes rents. *substituted*: running on a prop, not on its own supply. *collapsing*: failing under multiple compounding pressures |
| **NOT ENTAILED** | a named cause without its field. The annex: *"the cause-clause library is where the provenance lives, and each clause REQUIRES its own field — a clause without its field is invention"* (`RECEIPT_POOLS_DOSSIER_STATE.md:1297-1300`) |
| **ENGINE CONTRADICTS** | An **unknown status silently canonicalises to `stable`** (`supplyChainState.js:199-202`), so a `stable` face drawn from a bare status word may be printing over a propped or depleted chain. The corpus's own rule: *"draw the health pool only when the note fields are empty"*, and the pool is authored so that printing it over a propped chain reads as an obvious lie rather than a plausible one (`:1291-1295`). `captured` and `collapsing` have **NO PRODUCER** (R-DST-H, `:1335`, `:1345`) |

### 3.14 The entrepôt

| | |
|---|---|
| **Name class** | `isEntrepot` boolean and the `' (transit)'` export suffix |
| **ENTAILS** | **goods that leave were not made here** — the transit marker is the generator's own suffix on an entrepôt chain's first output (`computeActiveChains.js:751`), and the corpus reads it as such |
| **NOT ENTAILED** | warehouses · a yard · a clerk · a merchant class · measured transit volume · a toll |
| **ENGINE CONTRADICTS** | `deriveIsEntrepot` is **`route === 'crossroads'`**, or a port carrying an institution whose name contains `international trade` or `warehouse district` (`src/generators/economy/tradeGoods.js:90-97`). So on the overwhelming majority of entrepôt towns the fact means **"sits on a crossroads"** and nothing else. `transit` itself is `imports.filter(not a necessity).slice(0, 4)` (`tradeGoods.js:162`) — a slice, not a measured re-export. The corpus's ENTREPÔT variants that assert warehouses, a yard and a clerk (`RECEIPT_POOLS_DOSSIER_STATE.md:1019-1022`, `:1078-1081`) are richer than the record |

### 3.15 The shadow-economy capture tier

| | |
|---|---|
| **Name class** | three unnamed tiers at ≥30 / ≥15 / ≥3 (`economyStateProse.js:558-564`), on `blackMarketCapture` |
| **ENTAILS** | that a **share of trade is not on the rolls**, banded (the digit stays on the tile, R-DST-D) |
| **NOT ENTAILED** | organisation · a guild · a named faction (`{faction}` is deliberately unfilled on this desk, `economyStateProse.js:910-921`) · deaths · violence · who profits |
| **ENGINE CONTRADICTS** | `blackMarketCapture` is an **estimate built from the criminal priority slider plus per-stress bonuses, tier-scaled, capped at 80** (`safetyProfile.js:619-638`), not a measurement of trade. **Below three is not a tier, it is no surface**: `EconomicsTab` renders no Shadow Economy section under 3 %, so the desk returns null there (`economyStateProse.js:545-547`). A **missing** `blackMarketCapture` is also null: *"a settlement with no safety profile has not been measured as having no shadow economy; it has not been measured"* (`:549-554`) |

### 3.16 The service catalog and its absences

| | |
|---|---|
| **Name class** | eleven category words (`servicesDisplay.js:25-30`) against six tier expectation lists (`:15-22`) |
| **ENTAILS** | an absence entails only that **the roster does not fill that category at a tier that expects it** |
| **NOT ENTAILED** | that anything was lost. The annex: *"nothing on this surface records that anything was ever lost. No historical clause is licensed anywhere in this block — 'the healer left' is exactly the sentence this record cannot support"* (`RECEIPT_POOLS_DOSSIER_STATE.md:1696-1700`). Also not entailed: the reason a category is impaired (that belongs to DS-SUP-2's cause library, `:1701-1702`) |
| **ENGINE CONTRADICTS** | The expectation list is **tier-indexed only** (`servicesDisplay.js:15-22`), so "a town this size normally keeps one" is licensed and "this town used to keep one" is not. `magic`, `employment` and `criminal` are labelled categories that **no tier expects** — an absence there is not an absence the derivation records at all (`:15-22` versus `:25-30`) |

### 3.17 The tier word

| | |
|---|---|
| **Name class** | six, `constants.js:3`, ranges `:7-14` |
| **ENTAILS** | a **population band** and, through `EXPECTED_SERVICES_BY_TIER`, a list of categories a place that size is expected to keep |
| **NOT ENTAILED** | walls · a market · a wall class · a garrison · a charter · a mayor. Nothing in the tier gates an institution on this desk |
| **ENGINE CONTRADICTS** | A `metropolis` catalog pool exists specifically because completeness at that rung is *"itself a fact about the place"* (`RECEIPT_POOLS_DOSSIER_STATE.md:1743-1746`); it does not license "a metropolis has everything" for any other tier |

### 3.18 The terrain word

| | |
|---|---|
| **Name class** | seven producible terrains (§2.2) |
| **ENTAILS** | *Coastal*: **the sea**, a harbour edge, salt and fish in the allowed roster (`geographyData.js:54-66`). *Riverside*: **fresh water**, a crossing (`:131-142`, `:196-200`). *Mountain*: **rock and height**, a short growing year (`agricultureCapacity: 0.4`, `:210-213`). *Forest*: **trees** (`:315-326`). *Plains*: **open, arable ground** (`agricultureCapacity: 1.5`, `:423`). *Hills*: **slope**. *Desert/Arid*: **little water** (`agricultureCapacity: 0.3`) |
| **NOT ENTAILED** | climate as such · a named river or sea · distances · a view · the town's shape. The `strategicValue` string is the **generator's own assessment, framed and never restated** (`RECEIPT_POOLS_DOSSIER_STATE.md:1569`) |
| **ENGINE CONTRADICTS** | `TERRAIN: Swamp`, `TERRAIN: Tundra` and `TERRAIN: anything else` have **no producer**: `TERRAIN_DATA` has seven keys, none of them swamp or tundra, and a config naming one yields `resourceAnalysis.error: 'Invalid terrain type'` with no terrain at all, so the surface shows `Unknown` and the desk stays silent (`economyStateProse.js:670-674`) |

### 3.19 The market (as an object the desk can speak about)

| | |
|---|---|
| **Name class** | the holder kind `market` resolves through record-keeping services `['Weekly market', 'Public auctions']` (`holderTable.js:310-317`) |
| **ENTAILS** | **a place where goods change hands**, and — as a holder — that it **keeps the record of the town's trade** |
| **NOT ENTAILED** | a square · a building · a day of the week · stalls · a crier · a charter |
| **ENGINE CONTRADICTS** | Exactly **ONE institution in the whole shipped catalog** carries both those services: `Market square` (measured over `src/data/institutionServices.js`, 285 institutions). A town with a `Weekly market` institution and no `Market square` has, on this table, no market holder — and `Weekly market` is a **treasury** institution by its `Tax collection` row (`holderTable.js:272-279`). See the alias trap in §5.1 |

### 3.20 The dear / cheap good

| | |
|---|---|
| **Name class** | `dear` · `steady` · `cheap` (`marketPrices.js:182-184`) over the five closed MOVEMENTS (`:70-76`) |
| **ENTAILS** | a **movement against this settlement's OWN usual price** — never an absolute figure, never a coin (`:65-68`) |
| **NOT ENTAILED** | a reason · a season · a shortage of the raw input · demand · a merchant · a currency. The annex: *"The scarcity band is a live stock reading ⇒ a clause about the stores is licensed"* and no more (`RECEIPT_POOLS_DOSSIER_STATE.md:951-956`, `:1412-1414`) |
| **ENGINE CONTRADICTS** | The band is a **stock count on the `commodityStocks` ledger against a fixed target of 8** — `< 0.35×8` shortage, `> 1.25×8` surplus (`marketPrices.js:143-151`). There is no demand term and no price state anywhere. Services **never move**: `resolveGood` returns null for anything whose `kind` is not `'good'` (`:129-133`) |

---

## §4 LABEL TRAPS — an engine value or label whose English meaning is not its engine meaning

Every row: the label as printed or keyed, the field it belongs to, what the engine actually
means by it, quoted at file:line.

| Label | Field | The ENGINE meaning | Source |
|---|---|---|---|
| `shortage` (flow band) | `flowDrift.band` | **Low measured road throughput** this tick: `inflow + outflow < STRAIN_FLOOR`, and only on a trade-dependent town. Not a shortage of goods. | `src/domain/spatial/tradeFlow.js:244-250` |
| `surplus` (flow band) | `flowDrift.band` | Throughput **above** a ceiling. Not goods piling up. | `tradeFlow.js:249, :252` |
| `strained` / `met` / `abundant` | `flowDrift.dependency` | **A re-labelling of the band, 1:1** — not a second measurement. | `src/domain/display/tradeFlowEconomics.js:65-81`; annex `RECEIPT_POOLS_DOSSIER_STATE.md:896-898` |
| `trade-dependent` | `isTradeDependent(eco)` | The town has **any** import, export, `tradeDependency` or `tradeLink` recorded. A one-export self-feeding town is "trade-dependent". | `tradeFlowEconomics.js:58-62` |
| `vulnerable` (export posture) | `exportPosture.status` | **`access === 'isolated'`.** Not raiders, not war, not a cut route. | `src/domain/display/exportPosture.js:60` |
| `entrepot` / `isEntrepot` | `economicState.isEntrepot` | **`route === 'crossroads'`**, or a port with an institution named `international trade` / `warehouse district`. Not measured transit. | `src/generators/economy/tradeGoods.js:90-97` |
| `import_dependent` | `EXPORT_STATUS_LABEL` key | A **label with no producer** — the status ladder has five arms and never sets it. | `exportPosture.js:56-62`; finding written at `economyStateProse.js:622-630` |
| `dear` / `cheap` | `marketQuote.tag` | A **stock count against a fixed target of 8 units**, with no demand term and no coin anywhere. | `src/domain/display/marketPrices.js:143-151`, `:182-184` |
| `impaired` (service) | `computeChainSets` | `severity === 'critical'` **OR the town is under siege OR the route is `isolated`** — so on an isolated town every trade-dependent service reads impaired regardless of its own condition. | `src/components/new/tabHelpers.js:40-41` |
| `degraded` / `vulnerable` (service) | `computeChainSets` | `severity === 'high'` / everything else. Not a description of the house. | `tabHelpers.js:42-46` |
| `magicalInfra` | `computeChainSets` | A dependency whose `impact` string matches `/magical trade infrastructure/i` — **detected by a regex over prose**, and it removes the service from all three impairment sets. | `tabHelpers.js:30`, `:38-39`, `:55` |
| `stable` (chain status) | `supplyChainState` | Also **what an UNKNOWN status becomes**. A `stable` reading may be an unrecognised token. | `src/domain/supplyChainState.js:199-202` |
| `blocked` (chain status) | legacy `unexploited` | The legacy chip `unexploited` remaps to `blocked` — "never worked" and "shut off" share one canonical word. | `supplyChainState.js:181` |
| `entrepot` (chain chip) | legacy | Remaps to **`stable`**: "pass-through trade is its own stable state". | `supplyChainState.js:177` |
| `Deficit — Active Famine` | `foodSecurity.label` | The producer's famine label carries an **em dash and the word Deficit**; the corpus pool is `ACTIVE FAMINE`. Probed at this tip: `foodSecurityPoolKey('Deficit — Active Famine') → null`, while `'Active Famine' → 'ACTIVE FAMINE'`. **The famine pool is unreachable from the shipped label.** | producer `src/generators/foodGenerator.js:342`; key function `economyStateProse.js:394-401`; pool `src/data/dossierStateProse/economy.generated.js` (`DS-ECO-9 :: ACTIVE FAMINE`) |
| `Import-Dependent` | `foodSecurity.label` | A **deficit between 15 % and 40 % of daily need** — dependence on bought food, with no route, no break and no cause attached. | `foodGenerator.js:347-349` |
| `well stocked` / `thin` | `granaryOutlook.band` | A **fraction of this town's own derived capacity**, not an absolute quantity — and the capacity itself is 1.5–2.0 months on a town with **no granary at all**. | `src/domain/display/dossierViewModel.js:336`; `src/domain/worldPulse/foodStockpile.js:190-193` |
| `season` | `granaryOutlook.season` | A **position in a 13-week quarter**. Weather is a separate three-value `seasonalEvent`. | `dossierViewModel.js:303-304`, `:298-302` |
| `economyOutput` / PDF `OUTPUT` | `compound.economyOutput` | The **economy priority slider**, multiplied by crime, magic, a market-institution flag, stress and neighbour multipliers. Not production, not coin. Never printed as a figure in prose (R-DST-D). | `src/generators/priorityHelpers.js:403-410`; PDF row `src/pdf/sections/EconomicsTrade.jsx:68` |
| `blackMarketCapture` | `safetyProfile` | `(criminalEffective − 25) / 3` plus per-stress bonuses, tier-scaled, capped at 80 — an **estimate off a slider**, not a measurement of trade. | `src/generators/safetyProfile.js:619-638` |
| `Subsistence` (complexity band) | `COMPLEXITY_BAND_BY_LABEL` | Names **three different producer labels**; `Diversified` names two. The band is a CLASS, not an identifier. | `src/domain/display/labelBands.js:112-115`, `:149-161` |
| `Affluent` | — | **Not a prosperity rung.** The old Compendium prose drifted from the typed truth. | `RECEIPT_POOLS_DOSSIER_STATE.md:1162-1164`; ladder `src/data/constants.js:92-94` |
| `Riverside` / `Mountain` / `Desert/Arid` | `resourceAnalysis.terrain` | The **display name**, which differs from the corpus pool word for three terrains of seven. A route on the display name would darken three terrains without an error anywhere — *"THE LABEL TRAP, MEASURED, AND IT IS LIVE IN THE TREE ALREADY"*; `ResourcesTab.jsx`'s own `terrainColor` map already loses those three to its default accent. | `economyStateProse.js:660-668`; names `src/data/geographyData.js:129, :211, :624` |
| `unexploited` | `exploitation` bucket | **Never worked**, not "stopped being worked" — there is no depletion field on that surface. | `RECEIPT_POOLS_DOSSIER_STATE.md:1491-1495` |
| `exportValue: very high` | chain field | A **four**-word class (`very high` · `high` · `medium` · `low`); the corpus authored a two-way split. | values in `src/data/resourceChains.js`; split `economyStateProse.js:733-735` |
| `granar` | institution name | A **truncated name in the shipped terrain data** (`name: "granar"`), which the `hasGranary` substring flag matches. | `src/data/geographyData.js:460`; flag `src/generators/priorityHelpers.js:63` |
| `situationDesc` / `strategicValue` / `economicDragDesc` / `dependency.impact` / `entrepotNote` / `magicNote` | engine-authored strings | **Printed by the surface already**; the prose FRAMES them and never restates them. | `RECEIPT_POOLS_DOSSIER_STATE.md:797-798` (situationDesc), `:1569` (strategicValue), `:1099-1101` (economicDragDesc), `:994-997` (impact / entrepotNote / magicNote) |
| `ECONOMY_FRESHNESS_SENTENCES` | DS-ECO-7 | A **vetoable frozen copy unit** with a voice contract of its own: no em dash, no exclamation, "may" not "will" — the detector proves an event landed, never that a figure is wrong. | `RECEIPT_POOLS_DOSSIER_STATE.md:1135-1141` |

---

## §5 ALIAS TRAPS — a generic English word naming a class the engine splits into rows

Rule shape, following the chair's defense-desk example: **the word a fact is allowed to use must
follow the holder-table row this town resolves; the generic class word is the always-safe
spelling.**

### 5.1 "the market"

| | |
|---|---|
| **Engine rows it can name** | (i) the HOLDER kind `market`, whose record-keeping services are `['Weekly market','Public auctions']` and which exactly **one** shipped institution carries: **Market square** (`holderTable.js:310-317`; measured over `src/data/institutionServices.js`). (ii) the INSTITUTION `Weekly market`, which is a **treasury** holder by its `Tax collection` row (`holderTable.js:272-279`). (iii) the flag `hasMarket`, a naive substring match on `['market','bazaar','fair','trade center','exchange']` (`src/generators/priorityHelpers.js:56`, matcher `:25-26`) — which therefore also matches **Black market**, **Black market bazaar**, **Slave market**, **Horse market**, **Magical item market**. (iv) the `market` CIVIC OBJECT CLASS, whose tokens are market · trade · export · import · commerce · merchant · caravan (`wiringCensus.js:1310`). (v) the chain institution `Market` on the oasis-date chain and `Market square` on the desert-salt chain (`src/data/resourceChains.js`). |
| **Consequence** | `hasMarket` feeds `marketInstMult` in `economyOutput` (`priorityHelpers.js:394`, `:403-410`) and the food import model (`src/generators/foodGenerator.js:130`, `:153`, `:190`). A town whose only "market" is a **Black Market** reads as having market infrastructure in both. A face that says "the market keeps this" must resolve to Market square; a face that says "the town has a market" may be standing on a criminal row. |
| **Safe generic** | *the market* only where `Market square` resolves; otherwise *what the town trades*, *the trade*, or the ledger word the block already uses. On DS-ECO-12 the `market` civic class is already refused as a second object beside the spine (licence card, §0b). |

### 5.2 "the mill"

| | |
|---|---|
| **Engine rows it can name** | `Mill` (grain chain, `resourceChains.js`), `Mills (2-5)` and `Access to external mill` and `Maltster` (grain chain, `src/data/supplyChainData.js:22`), `Fulling mill` (wool and alpine-wool chains — a **cloth** mill), `Sawmill` (timber and mountain-timber chains — a **timber** mill), the terrain institution `Mill` (`src/data/geographyData.js:170`), the resource `river_mills` labelled `Mill Sites` and typed **`infrastructure`** (`src/data/resourceData.js`, `src/domain/resourceSemantics.js`), the chain `river_milling` labelled `River Mill Industry`, and the `craft` civic-object class, which contains the token `mill` (`wiringCensus.js:1316`). |
| **Consequence** | `storageCapacityMonths` does `has('mill')` as a **substring** over institution names and multiplies granary capacity by 1.25 (`src/domain/worldPulse/foodStockpile.js:194`). A **Fulling mill** or a **Sawmill** therefore raises the town's food storage. So "the mill grinds, and that is why the stores are deep" can be true of the number and false of the mill. |
| **Safe generic** | *the mill* only where the resolved row is a grain mill (`Mill`, `Mills (2-5)`); otherwise name the trade — *the sawmill*, *the fulling mill* — or use the class word *the workings*. |

### 5.3 "the watch"

| | |
|---|---|
| **Engine rows it can name** | The holder kind `watch` resolves through `['Crime reporting','Crime response','Missing persons']` to exactly two institutions: **Professional city watch** and **Town watch** (`holderTable.js:317-324`; measured). The flag `hasWatch` matches `['town watch','city watch','professional city watch']` (`priorityHelpers.js:48`), while `hasMilitaryInst` matches the bare token `watch` among garrison, barracks, guard, citadel, walls, militia, mercenary, navy, charter hall (`:45`) — so the same word feeds the military class. The `force` civic-object class contains garrison · militia · muster · **watch** · guard · soldier · patrol · armed (`wiringCensus.js:1303`). |
| **Why it is an economy-desk row** | **DS-ECO-6's licensed source holder IS the watch**, and it is a STATE ORGAN (interested where the town is captured) — printed on the licence card for `TIER: a large share off the books (≥30)`; the mapping is `blackMarketCapture` → `watch` at `holderTable.js:210`, and `STATE_ORGAN_KINDS` at `:115`. The chair's defense-desk finding therefore reaches this desk directly. |
| **Safe generic** | the class word — *the guard*, *whoever keeps the peace here* — unless the town resolves `Professional city watch` or `Town watch`. |

### 5.4 "the treasury"

| | |
|---|---|
| **Engine rows it can name** | Seven institutions carry a treasury record-keeping service: **Village headman** (Tithe and dues), **City administration** (Taxation and tolls), **Weekly market** (Tax collection), **City-state government** (Tax collection), **Lord's appointee** (Tax collection), **Village reeve** (Tax collection), **Town hall** (Tax payment) — `holderTable.js:272-279`, measured over the shipped catalog. |
| **Why it matters here** | `incomeSources` (DS-ECO-12's whole record, including the criminal line) and `economicViability`/`viable`/`criticalIssueCount` map to **treasury** (`holderTable.js:166-169`), and treasury is a STATE ORGAN (`:115`). |
| **Safe generic** | *the town's own reckoning*, *whoever collects the dues here*. Never a building: five of the seven rows are a **person or an office**, not a treasury. |

### 5.5 "the toll bar" / "the gate" / "the customs house"

| | |
|---|---|
| **Engine rows it can name** | The holder kind `toll-bar` resolves through `['Toll collection','Customs brokerage','Market charter and tolls']` to three unlike institutions: **Gates (if walled)**, **Major Port**, **Town council** (`holderTable.js:303-310`; measured). |
| **Why it matters here** | `tradeRouteAccess`, `blockaded` and `blockadeBypass` all map to **toll-bar** (`holderTable.js:183-185`) — so DS-ECO-9's two provenance-bearing siege pools cite it (licence card for `BLOCKADED`, §0b). |
| **Safe generic** | *the town's own record of what comes in*. "The gate" is wrong on a `Town council` or `Major Port` town; "the customs house" is wrong on a `Gates (if walled)` town. |

### 5.6 "the granary"

| | |
|---|---|
| **Engine rows it can name** | (i) the STOCK: `foodSecurity.storageMonths` against `stockpile.capacityMonths`, read as a band (`dossierViewModel.js:336`). (ii) the BUILDING flag `hasGranary: hasAny(names,['granar'])` — a substring match that also catches `granaries` and the shipped truncation `granar` (`priorityHelpers.js:63`; `geographyData.js:460`). (iii) three capacity rows keyed on the name: `state granary`, `city granari`, `granary`, each with its own tier table, plus a **no-granary fallback of 1.5–2.0 months** (`foodStockpile.js:190-193`). (iv) the chain institution `Town granary` (grain chain, `resourceChains.js`) and `Granary` (oasis-date chain). (v) the `storehouse` civic-object class, which folds into `store` when it stands alone (`wiringCensus.js:1322`, `:1372`). |
| **Consequence** | The band sentence is about the STOCK and the roster sentence is about the BUILDING, and the two were one civic class until REWRITE car 8a-8 split them precisely because *"the word named two different civic objects and the class could not tell them apart"* (`wiringCensus.js:1304-1308`). |
| **Safe generic** | *the stores*, *what the town holds back* — the `store` words — unless the roster carries a granary row. |

### 5.7 "the guild"

| | |
|---|---|
| **Engine rows it can name** | `hasGuild` matches the bare token `guild` (`priorityHelpers.js:57`), which also fires on `Thieves' guild`, `Thieves' guild (powerful)`, `Assassins' Guild` and `Mages' guild` (`:69`, `:72-73`); `hasMerchantGuild` is a separate flag on `['merchant guild','merchant oligarchy']` (`:58`); the `craft` civic-object class carries the token `guild` (`wiringCensus.js:1316`); and the chain rosters carry Weavers' guild, Dyers' guild, Blacksmiths' guild, Coppersmiths' guild, Goldsmiths' guild, Carpenters' guild, Stonemasons' guild, Leatherworkers' guild, Salters' guild, Jewelers' guild, Vintners' guild, Linen workshop (`src/data/resourceChains.js`). |
| **Consequence** | `deriveEconomicComplexity` reads `hasInst('market','trading','merchant','guild')` (`economicState.js:882`), so a **Thieves' guild** raises the complexity reading. DS-ECO-6's variant *"the guilds are losing their grip a little further each season"* (`RECEIPT_POOLS_DOSSIER_STATE.md:1112`) names a class the record splits into craft, merchant, arcane and criminal rows. |
| **Safe generic** | *the trades*, *the craft houses*. |

### 5.8 "the caravan" / "the road" / "the port"

| | |
|---|---|
| **Engine rows it can name** | `caravan` is a token of the `market` civic-object class (`wiringCensus.js:1310`) and also a chain (`Caravan & Overland Trade`, `Camel Caravan Trade`) and an institution (`Caravanserai`). `road` and `port` are BOTH tokens of the `road` civic-object class (`:1313`) **and** `{access}` fills **and** — for `road` — a HOLDER KIND whose records are `terrainType` and `monsterThreat` (`holderTable.js:233-234`), resolving through `['Road register','Way-bill registration']` to `Listening post` and `Waystation` (`holderTable.js:349-356`). `hasPort` is word-bounded on purpose so a barge company or a teleportation circle never reads as a harbour (`priorityHelpers.js:28-31, :61`). |
| **Consequence** | A DS-ECO-1 face naming the approach already spends the `road` civic class (licence card: `may NOT … another civic object of the class 'road'`), so a second road-class object in the same unit is refused. And "the road says so" as a CITATION means the `Listening post` / `Waystation` row, not the highway. |
| **Safe generic** | *the approach* for the way in; *the way-book* or *whoever keeps the roads' record* for the holder. |

### 5.9 "the fence" / "the black market"

| | |
|---|---|
| **Engine rows it can name** | `Local fence`, `Fence (word of mouth)`, `Front businesses`, `Black market`, `Thieves' guild (powerful)`, `Smuggling waypoint`, `Smuggling network`, `Smuggling operation`, `Street gang`, `Slave market`, `Workhouse` — the criminal chains' processing institutions (`src/data/supplyChainData.js`, `criminal_economy` group); and fifteen canonical display labels in `CRIMINAL_INST_LABELS` (`src/generators/safetyProfile.js:593-609`). |
| **Consequence** | The income line is spelled **five different ways** (`Criminal Syndicate Revenue`, `Thieves' Guild Revenue`, `Smuggling Network Revenue`, `Shadow Economy (untaxed)`, `Black Market Revenue`, `economicState.js:334-341`), which is why `criminalIncomePoolKey` is keyed on the `isCriminal` **flag** and never on the label — *"a label route would drop four of five and do it without an error anywhere — the label trap, one layer up from the value"* (`economyStateProse.js:462-469`). |
| **Safe generic** | *the part of it nobody writes down* — which is what the corpus already uses. `{faction}` is unfilled on this desk (`economyStateProse.js:910-921`), so no criminal house may be **named** here at all. |

### 5.10 "the mine" / "the quarry" / "the workings"

| | |
|---|---|
| **Engine rows it can name** | `Mine` is `processingInstitutions[0]` for **four** different chains — ironOre, copperOre, preciousMetals, gemstones (`src/data/resourceChains.js`) — so the same word names four unlike lines. `Quarry` and `Stone quarry` are separate strings (terrain institution `Quarry`, `geographyData.js:249`, `:554`; chain institution `Stone quarry`). `Mining & Quarrying` and `Mining & Coinage` are chain labels (`supplyChainData.js`, `raw_extraction`). `stone_quarry` is also a native RESOURCE key labelled `Stone quarry` (`src/data/resourceData.js`) — the same string is a resource **and** an institution. |
| **Consequence** | A face that says "the mine" without the resource is under-determined; a face that says "the quarry gave out" may be naming the resource row (typed `exhaustible`, `recoveryMode: 'manual'`) or the institution row (which carries no condition at all). |
| **Safe generic** | *the workings* — which the corpus already uses at DS-SUP-1 and DS-ECO-11 (`RECEIPT_POOLS_DOSSIER_STATE.md:1074-1076`, `:1084-1086`). |

---

## §6 THREE CROSS-CUTTING FINDINGS THE CHAIR MAY WANT

1. **A dead pool caused by a label, not by wiring.** `DS-ECO-9 :: ACTIVE FAMINE` is authored and
   is unreachable from the shipped producer label (`'Deficit — Active Famine'` uppercased is not
   `'ACTIVE FAMINE'`). Probed at this tip; the other five rungs key correctly. This is not on the
   file's declared no-producer list (which names `POSTURE: import_dependent`,
   `SHORTAGE × not trade-dependent`, `TERRAIN: Swamp/Tundra/default`), so it looks unrecorded.
   Producer `src/generators/foodGenerator.js:342`; key function
   `src/domain/display/stateProse/economyStateProse.js:394-401`.

2. **The economy desk's "typical association" list has a typed home already.** `RESOURCE_SEMANTICS`
   (`src/domain/resourceSemantics.js`) carries `type` and `recoveryMode` per resource, which is
   exactly the definitional/typical split the owner is asking for, expressed in the engine's own
   vocabulary. If the chair wants one worked example of a licence that the engine's model
   supports, *positional resources cannot deplete* is it: `randomDepletionEligible: false` +
   `recoveryMode: 'not_applicable'` on six rows.

3. **Two words on this desk are already governed by the same rule in two different places**, which
   suggests the general law will need to say which one wins: the `granary` split between
   `store` and `storehouse` in `CIVIC_OBJECT_CLASSES` (`src/domain/prose/wiringCensus.js:1304-1308`,
   `:1317-1322`, `:1372`) does at the KEY level what the holder table does at the FACT level
   (`src/domain/prose/holderTable.js`). A face can satisfy one and breach the other.
