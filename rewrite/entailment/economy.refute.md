# ENTAILMENT REFUTATION — THE ECONOMY DESK (DS-ECO-* + DS-SUP-*)

Refuter seat: Fable 5.1. Read-only dock `scratchpad/laneRW-DEFW` @ `f2da5a3ee` (HEAD confirmed by
`git rev-parse`). Every `file:line` below is that tree. Nothing modified, staged or committed; no
vitest, npm or build. Node was used once, print-only, to call `foodSecurityPoolKey` and list the
corpus pool keys (`$SC/probe-eco.mjs`, output quoted in §A.10).

Surveyed packet: `rewrite/entailment/economy.survey.md`. Every ENTAILS item in its §3 rows is
tried below against the engine. Default under uncertainty is REFUTED or CONDITIONAL, as the chair
asked. Where the surveyor's own citation is wrong I say so in §F.

Verdict vocabulary:
- HOLDS: true for every member of the name class and consistent with the engine's own model.
- CONDITIONAL: true only for named members, or only where a named field resolves; the condition is
  stated exactly.
- REFUTED: false for some member, or contradicted by the engine; the code is quoted.

---

## §A THE NINE CROSS-CUTTING REFUTATIONS (read these first; the row verdicts lean on them)

### A.1 `{institution}` on the exploitation lens is the CATALOG'S word, never this town's roster
`evaluateEconomicActivity` pushes `{ ...chain, chainKey }` — the static `RESOURCE_CHAINS` row
itself — into `active` (`src/generators/resourceGenerator.js:140`). `evaluateInstitutions` then
COUNTS supporters and files the same object into a bucket without rewriting
`processingInstitutions` (`:166-181`). So `leading.row.processingInstitutions[0]`
(`src/domain/display/stateProse/economyStateProse.js:991`) is `RESOURCE_CHAINS.grain
.processingInstitutions[0] === "Mill"` (`src/data/resourceChains.js:58`) on every town whose grain
chain is active, whether or not a Mill exists. Consequences by bucket:
- `unexploited` (supporters === 0, `:175`): the named house is ABSENT by construction. The pool's
  own variants say so ("the {institution} that would begin the work", corpus `:3483`; "will not
  find one", `:3321`). Those HOLD, but only as "the catalog's processor is not here".
- `partiallyExploited` (exactly one supporter, `:177`): the one supporter MAY BE the named
  processor (a town with `Mill` and nothing else on the chain). Variant `:3541` "one {institution}
  the town does not have" is then false. REFUTED for that member.
- `fullyExploited` (>= 2 supporters, `:176`): supporters are TAG matches
  (`institutionSupportsChain`, `:155-161`, tag-first via `institutionHasAnyTag`,
  `src/lib/entities.js:228-232`). The grain chain's tags are `[TAG.FOOD, TAG.AGRICULTURE]`
  (`resourceChains.js:56`) and `institutionHasAnyTag` needs ANY one. The shipped catalog declares
  the `food` tag on `Taverns (5-20)`, `Ale house`, `Toll bridge`, `Water source`,
  `Caravaneer's post`, `Bakers (5-15)`, `Butchers (3-8)`, `Dairy farmer`, `Fishing community`,
  `Shepherd collective`, `Communal root cellar`, the three granaries
  (`src/data/institutionalCatalog.js`, measured by scanning `tags: [...'food'...]`). A town with a
  Tavern and an Ale house therefore has its grain chain FULLY EXPLOITED and `{institution}` fills
  `Mill`. Variants `:3560` ("the ground gives it, {institution} finishes it, and it leaves as
  {good}"), `:1279`, `:1289` then print a Mill the town does not have. REFUTED.
- The keyword backfill widens it: `/mill|granary|bakery|brewery|farm|grain|field|fishery|fishing|
  orchard|pastoral|graz|livestock|dairy|butcher|slaughter/i` implies `[TAG.FOOD, TAG.AGRICULTURE]`
  (`src/lib/entities.js:171`), so `Sawmill`, `Fulling mill`, `Paper mill`, `Windmill` and any
  name containing `field` process GRAIN.

So on this desk "a mill grinds" is not a licence at all: the noun is the chain catalog's vocabulary
for a step, not a recorded house. The safe generic the corpus already uses is *the workings* /
*the step that would make {resource} into {good}* (`:3329`).

### A.2 `Import-Dependent` measures what is NOT covered, after imports and magic are subtracted
`deficit = max(0, rawDeficit - importCoverage - magicOffset)` (`src/generators/foodGenerator.js:329`),
`deficitPct = deficit / dailyNeed` (`:330`), and the label ladder reads `deficitPct` (`:344-352`).
`Import-Dependent` is therefore "15-40 % of daily need is met by NOTHING". It can print on an
isolated thorp with zero imports: `importCoverageRate` for a disconnected route is
`max(_magicTradeRate * _maintainerMult, _minorRouteRate)` (`:308-309`), `_minorRouteRate` is 0 for
thorp/hamlet (`:293-296`), `_magicTradeRate` is 0 without a circle (`:290-292`). The word
"import" in the label names the ROUTE'S coverage the town lacks, not food the town buys. The
surveyor's "a substantial part of what it eats is bought" is the label read as English.

The same subtraction refutes `Secure: covers itself` — a town whose raw deficit is 30 % and whose
port covers it to 4 % residual reads `Secure` (`:310`, `:318`, `:357`). It is covered; not by itself.

### A.3 A route token does not fix the terrain, and a terrain does not fix the route
`getTerrainType(tradeRoute, terrainOverride)` returns the OVERRIDE whenever one is set
(`src/generators/terrainHelpers.js:24`) and derives from the route only when it is not
(`:25-34`). `resolveConfig` passes an explicit override through (`src/generators/steps/resolveConfig.js:180,204`)
and passes an explicit route through verbatim (`:137-144`, "authored premises, not values to
rewrite"). So `port` on `mountain` or `desert` terrain, and `mountain_pass` on `plains`, are
constructible and preserved. The world law then says what `port` means: `maritimeSupported =
terrainType === 'coastal' || (tradeRoute === 'port' && terrainType !== 'riverside')`
(`src/generators/generationContext.js:195-197`); a port on riverside terrain is a RIVER port
(`portKind`, `:201-205`). Hence: `port` entails water, and entails THE SEA only where terrain is not
`riverside`; `pass` entails mountains only where terrain is `mountain`.

### A.4 `river` access weighs like a seaport in the throughput model
`hasSeaPort` returns true for `access === 'port' || 'sea' || 'river' || 'coastal'`
(`src/domain/spatial/tradeFlow.js:112-115`) and adds `MODALITY.SEA` to the arrival weight
(`:142`). A label trap in the other direction from the surveyor's list: the engine's own reader
treats a river town as a sea-modality town. `sea` and `coastal` are accepted there and in
`ROUTE_TIER` (`src/domain/tradeRouteSemantics.js:89`, which calls `coastal` a "real generated
value") yet no pool ever rolls them (`resolveConfig.js:29-37`, `:132-133`).

### A.5 The shipped crier line INVENTS a cause
`causalReceipt(tag, driftBand)` returns `'for it comes scarce this season'` / `'for the season has
been generous'` whenever the road drift does not explain the band
(`src/domain/display/marketPrices.js:213-218`), and `strongestDeviation` prints it in every crier
frame (`:228-241`, `:272-277`). No seasonal field is read. The surface already breaks the chair's
law; a rewrite that copies the crier's receipt inherits an invented cause. Also: an absent ledger
entry reads `adequate` (`:318`, `:137`), so `steady` is "unmeasured OR in band"; and a steady
good's PHRASE can read "a shade above its usual price" from the ROAD band (`:165-166`) while its
tag stays `steady`.

### A.6 Two terrain-fertility tables disagree
`foodGenerator.js:37-41` declares `TERRAIN_AGRI` "(matches TERRAIN_DATA)" — plains 1.0, coastal
0.7, riverside 0.9, forest 0.5, hills 0.6, desert 0.3, mountain 0.4. `TERRAIN_DATA.agricultureCapacity`
is plains 1.5, coastal 0.8, riverside 1.3, forest 0.6, hills 0.9, desert 0.3, mountain 0.4
(`src/data/geographyData.js:68,144,227,329,437,542,638`). The canonical food model reads the first
(`foodGenerator.js:205`); the viability model reads the second (`src/generators/economy/foodBalance.js:46`)
though its production numbers are overwritten by the canonical model when threaded
(`:281-286`, `viability.js:488`). Orderings differ on hills vs coastal (0.9 > 0.8 vs 0.6 < 0.7). A
comparative fertility clause between two terrains is licensed only where BOTH tables agree.

### A.7 `collapsing` HAS a producer; `unexploited` names two different things
`applyRegionalPressureToStatus` returns `'collapsing'` on `severeCount >= 2` for blocked/captured
chains and on `severeCount >= 2 || maxSeverity >= 0.8` for scarce ones
(`src/domain/supplyChainState.js:443-447`). The surveyor's "captured and collapsing have NO
PRODUCER" is half wrong; only `captured` is unproduced (grep: it occurs in the canonical set
`:185-188` and the ladder `:443` and nowhere as a write). And "failing under MULTIPLE compounding
pressures" is false on the `scarce + one pressure >= 0.8` arm.
Separately, the chain STATUS `unexploited` is written only by `applySubsistenceTradeBoundary`
(`src/generators/economy/customTradeEndpointIntegration.js:113-118`) on an isolated thorp/hamlet
with no magic trade, for entrepot chains only — "no route to exploit it" — and remaps to `blocked`
(`supplyChainState.js:181`). The exploitation BUCKET `unexploited` (`resourceGenerator.js:175`)
means "no processor". Same token, two records; the annex's "never worked" gloss belongs to the
bucket only.

### A.8 `isolated` is three different amounts of nothing
The desk says an isolated town is one "nothing reaches" (`economyStateProse.js:167-170`).
`tradeGoods.js:53-56` agrees ("cannot import anything") and returns no necessity imports; `:412-414`
returns no upgrade goods. The food model disagrees: an isolated town+ receives a minor-route
trickle (`FOOD_IMPORT_RATES.minorRoutes`) and a village a smaller one (`foodGenerator.js:168-176,
293-296`), and a circle or airship lifts it further (`:284-292`). So "no cart ever comes" is more
knowledgeable than the food model, while "carts come" is more knowledgeable than the trade model.
The only safe spelling is the desk's: no APPROACH to name.

### A.9 The DS-ECO-2 deficit tile's "road" and "carts" and "fields"
The tile reads `economicViability.metrics.foodBalance` (`src/domain/display/dossierViewModel.js:113-114`),
which is the canonical model's RESIDUAL deficit when threaded (`foodBalance.js:281-289`,
`viability.js:488`). A deficit on the tile is what remains AFTER the road's coverage. The FOOD:
deficit variant "the shortfall is made good off the road, week on week"
(`docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:855`) asserts the opposite of the record, and
"everyone knows which day the carts come" (`:856`) names a road on a town that may be isolated.
"The fields do not cover the town" (`:856`) names fields: `dailyProduction` is population ×
workforce × terrain multiplier (`foodGenerator.js:270-271`), and a mountain mine or a desert
caravan town has no field on any roster. These are missed nouns (§E).

### A.10 The famine pool is unreachable (CONFIRMED by probe)
`node $SC/probe-eco.mjs` at the dock:
```
"Deficit — Active Famine" -> null
"Deficit" -> DEFICIT
"Import-Dependent" -> IMPORT-DEPENDENT
"Pressured" -> PRESSURED
"Surplus" -> SURPLUS
"Secure" -> SECURE
"Active Famine" -> ACTIVE FAMINE
DS-ECO-9 [ 'SURPLUS','SECURE','PRESSURED','IMPORT-DEPENDENT','DEFICIT','ACTIVE FAMINE','BLOCKADED','BLOCKADE BYPASSED' ]
```
Producer `foodGenerator.js:342`; key `economyStateProse.js:394-401`. The surveyor's §6.1 stands.

---

## §B VERDICTS, ROW BY ROW (every ENTAILS item of survey §3)

### 3.1 `{access}`
| item | verdict | evidence | condition |
|---|---|---|---|
| road: an overland way | HOLDS | `tradeRouteSemantics.js:88` "single main road"; `terrainHelpers.js:29` road → plains default; nothing in the engine puts a `road` on water | none |
| river: water, and a way along it | HOLDS | `tradeRouteSemantics.js:87` "water route"; `generationContext.js:198-200` riverTradeSupported on route river regardless of terrain; `tradeFlow.js:114` river is a water modality | a crossing / ford / bridge is NOT entailed (see 3.18 riverside) |
| port: water, and a harbour edge | CONDITIONAL | `generationContext.js:195-197`: the SEA only where terrain !== riverside; `:201-205` portKind may be `river`. "harbour edge": `deep_harbour` is a resource that may be absent or depleted (`resourceSemantics.js:57-62`, condition `depleted` = "obstructed or unsafe"); `hasPort` is an institution flag (`priorityHelpers.js:32,61`). Neither is implied by the token | water HOLDS; the sea only where `terrainType !== 'riverside'`; a harbour only where `deep_harbour` is available or `hasPort` |
| crossroads: more than one way, meeting | HOLDS | `tradeRouteSemantics.js:85` "multi-route hub"; `tradeGoods.js:94` crossroads ⇒ isEntrepot; `economicState.js:174-179` Toll Revenue "on all roads and bridges" | the desc's "bridges" is engine prose, not a record |
| pass: high ground on both sides, one way through | CONDITIONAL | `terrainHelpers.js:24,31`: mountain only when no override; `resolveConfig.js:180,204` an explicit `plains` override survives. What the engine DOES hold for a pass is SEASONAL closure, annualized: `tradeRouteSemantics.js:34-47,76,90` ("snowed shut in winter", 0.4 of a road), `foodGenerator.js:304-317` | mountains only where `config.terrainType === 'mountain'`; "closed part of the year" is the engine's own word but is an annual RATE, never a live winter state (`foodStockpile.js` has no route-season term; grep shows only the production swing `:336-360`) |
| ENGINE CONTRADICTS (a)(b)(c) | HOLDS | `resolveConfig.js:29-37`; `economyStateProse.js:167-179`; annex `:801-802` | plus §A.8: `isolated` is not "nothing reaches it" in the food model |

### 3.2 `{complexity}`
| item | verdict | evidence | condition |
|---|---|---|---|
| spread of trades / broad base: more than one earning line | HOLDS | `prosperity.js:296-303`: HIGHLY_DIVERSIFIED needs `incomeSourceCount >= 9`, DIVERSIFIED `>= 6`, MARKET_ECONOMY `>= 6` | none |
| handful of trades / narrow trade: few | CONDITIONAL | CONCENTRATED = city/metropolis with `< 6` lines (five is not "few"); LIMITED = town `< 4`; the label's own word is "than scale suggests" (`labelBands.js:133-134`) | "fewer than its rung expects", never an absolute count |
| market trade: a market-mediated economy | CONDITIONAL | MARKET_ECONOMY = town && hasMarketInst && `>= 6`; hasMarketInst = `hasInst('market','trading','merchant','guild')` (`economicState.js:882`), satisfied by `Black market`, `Thieves' guild`, `Assassins' Guild` | only where the matching institution is a lawful market (the surveyor's §5.1/§5.7 alias traps bite here) |
| specialist trade: one speciality | REFUTED | SPECIALIZED = town && `incomeSourceCount >= 4` && not (market && >= 6) (`prosperity.js:304-306`). Four or five income lines; nothing selects a speciality | — |
| mix of field and market: both farming and market | REFUTED | MIXED = village && hasMarketInst (`:307-309`); farming is never tested. Every thorp/hamlet/village carries `Agricultural Rents` by tier default with no farm required (`economicState.js:55-60`) | "market" per the alias trap; "field" is a tier default, not a roster fact |
| surplus farm trade / small farm surplus / farm surplus: farming with something left over | REFUTED | AGRICULTURAL = village && !market && `exportCount >= 4`; MINOR_SURPLUS = village && !market otherwise; SURPLUS = thorp/hamlet && `exportCount >= 3` (`:308-314`). None reads `foodSecurity`; a village labelled `Deficit` with four exports prints "surplus farm trade" | — |
| subsistence living: nothing left over | REFUTED | SUBSISTENCE = thorp/hamlet && `exportCount < 3` (`:315`). A hamlet labelled `Surplus` with two exports prints "subsistence living" | — |
| ENGINE CONTRADICTS (non-injective band; key never fill) | HOLDS | `labelBands.js:149-161`; `economyStateProse.js:902-907` | — |

### 3.3 `{season}`
| item | verdict | evidence | condition |
|---|---|---|---|
| a position in the year, one of four, thirteen weeks each, ordered | HOLDS | `dossierViewModel.js:303-304`; `foodStockpile.js:69` `one_season: 13`; `:428-429` stamps `season`/`seasonWeek` | present only where the pulse runs with seasons on (`:330-332`); the desk drops variants naming it otherwise |
| NOT ENTAILED weather; `seasonalEvent` separate | HOLDS | `dossierViewModel.js:298-302`, `:348` | — |

### 3.4 `{good}` shared bag (the export column)
| item | verdict | evidence | condition |
|---|---|---|---|
| a made or handled THING that leaves the town | REFUTED | `economicState.js:793-795` pushes `deriveServiceExports` labels into primaryExports (`computeActiveChains.js:1021-1025`, e.g. `'Maritime services (cargo, pilotage)'`, `:1006-1007`); `:624-636` pushes `'Mercenary services — trained companies available for hire'`; `:654-663` pushes the slave-trade sentences | a THING only for chain outputs; services and people are members of the class |
| a transit-marked one passed through | HOLDS | `computeActiveChains.js:748-751` writes `${o} (transit)` for `entrepot` chains | note the marker fires on crossroads/port/RIVER routes (`:318-319`) while `isEntrepot` is crossroads or port+institution (`tradeGoods.js:90-97`); DS-ECO-12 requires both (`economyStateProse.js:528`) |
| ENGINE CONTRADICTS: the slot is dark (0 of 48) | HOLDS | `economyStateProse.js:26-27`, `:848-853` | — |

### 3.5 `{good}` exploitation lens
| item | verdict | evidence | condition |
|---|---|---|---|
| the finished article at the far end of ONE resource line | HOLDS | `resourceChains.js` `finalProducts[0]`; `economyStateProse.js:990` | a CATALOG fact about the line, not a fact that the article is made here (see 3.7) |
| (implied by variants `:3560`, `:1289`) it leaves the town / goes out of the gates | REFUTED | exploitation exports live in `resourceAnalysis.exports` (`resourceGenerator.js:295-317`), a separate list from `economicState.primaryExports`, which is rebuilt from `computeActiveChains` (`economicState.js:741-751`, `:791-795`); "gates" is a wall fact (`priorityHelpers.js:53`) | — |

### 3.6 `{resource}`
| item | verdict | evidence | condition |
|---|---|---|---|
| the material nature of each word (timber = wood; ore = metal-bearing rock; stone; clay = earth; fish; grain = a field crop; wool = from a living animal, shorn; hides = from a dead animal; sand; herbs = plants; gemstones = stone; grapes = fruit; livestock = living animals; flax = a plant fibre) | HOLDS | definitional; the engine's own commodity tokens agree (`resourceGenerator.js:22-34`, `:78-86`) | none |
| the PROCESSING verbs bundled into the row (milled, pressed, fired, cut, melted, retted and spun, "needing a smelter") | CONDITIONAL | the verb names a step, and the step's presence is the exploitation bucket read through tags (§A.1); an ore "needing a smelter" holds by definition, "smelted here" needs a `Smelter` on the roster, which `fullyExploited` never guarantees (two METALWORK tag-carriers suffice) | licensed only as what the material would need, never as what this town does |
| the resource is present and available | HOLDS | `resourceGenerator.js:47,55` (depleted keys excluded), `:136-139` (resourcePresent) | — |
| ENGINE CONTRADICTS (a) positional cannot deplete; (b) exhaustible manual; (c) renewable natural; (d) unexploited ≠ stopped | HOLDS | `resourceSemantics.js:57-62,141-147,190-196,204-210,218-224,267-273`; `:50-56` etc; annex `:1491-1495` | (a) is "cannot deplete by the RANDOM roll"; the DEPLETE_RESOURCE event path still writes `depleted` for any key (`resourceSemantics.js:342-356` reads the sidecar for all keys) and the depletedDescription for a positional row is "obstructed or unsafe" — so "the harbour is obstructed" IS licensable where `condition: depleted`, "the harbour silted" is not |

### 3.7 `{institution}`
| item | verdict | evidence | condition |
|---|---|---|---|
| the definitional verbs (mill grinds; sawmill cuts; mine takes ore out; quarry cuts stone; smelter melts; tannery makes leather; weavers make cloth; potter fires; glassblower melts sand; apothecary compounds; fishmonger sells fish; vintner makes wine; butcher kills and cuts; salt works wins salt; caravanserai lodges a caravan; market is where goods change hands) | CONDITIONAL | as English, yes; as a licence on this desk, only where the name is a ROSTER institution. On the exploitation lens it is not (§A.1). On the impaired-service lens it is (`economicState.js:692-720` writes `institution: instName` from the roster; `tabHelpers.js:33-41`), but `Access to external mill` is a `TRADE_DEPENDENCY_NEEDS` key (`src/data/economicData.js:9-20`) and passes `properFill` (`economyStateProse.js:333-340`) — a phrase, not a house | licensed on the impaired lens except for `Access to external mill`; on the exploitation lens only the ABSENCE reading of the unexploited pool |
| "mill grinds" specifically | REFUTED on the exploitation lens | §A.1: `Mill` fills over a town with Taverns + Ale house; and `hasMill` elsewhere is a substring over `mill` (`foodGenerator.js:122`, `foodStockpile.js:194`, `tradeGoods.js:29` → commodity `flour`), so a Sawmill town "has a mill", stores 1.25×, and produces flour | — |
| ENGINE CONTRADICTS (a) no condition/age/wear | HOLDS | no field on any read this desk makes | the calamity ruin-filter (`liveInstitutions`, `tradeFlow.js:134`) is the one place a house can be "gone", and it is not on this desk |
| (b) `Bakers (5-15)` refused | HOLDS | `economyStateProse.js:326-329,337` | — |
| (c) singular verb screen | HOLDS | `:287-316` | — |

### 3.8 The granary
| item | verdict | evidence | condition |
|---|---|---|---|
| a store of food held against a later need | HOLDS | `foodGenerator.js:159-165` storage months; `foodStockpile.js:185-195` capacity | — |
| the band is a fraction of what THIS town can hold, never an absolute | HOLDS | `dossierViewModel.js:333-336` | — |
| ENGINE CONTRADICTS: a town with no granary building still has a reading | HOLDS | `foodStockpile.js:190-193` fallback 1.5 / 2.0 | — |

### 3.9 The prosperity rung
| item | verdict | evidence | condition |
|---|---|---|---|
| an ordered position on a closed ladder + the authored reading | HOLDS | `constants.js:92-100`; `bandLadders.js:52-60` | `Wealthy` only through `deriveProsperityLabel` (`prosperity.js:244-246` caps base at 4); `Subsistence` only on an isolated thorp/hamlet (`:280-286`) |
| ENGINE CONTRADICTS (no provenance; Affluent; unknown → nothing) | HOLDS | annex `:1166-1174`; `economyStateProse.js:364-372` | — |

### 3.10 The food-security rung
| item | verdict | evidence | condition |
|---|---|---|---|
| Surplus: raises more than it eats | HOLDS | `surplusPct` from `rawSurplus = dailyProduction - dailyNeed` (`foodGenerator.js:272,331`), local production only; `> 40` (`:353`) | — |
| Secure: covers itself | REFUTED | §A.2: `deficitPct` is residual after `importCoverage` and `magicOffset` (`:318-330`); `Secure` = residual <= 5 and surplus <= 40 (`:356-358`) | licensed: "is covered" |
| Pressured: a small standing gap | HOLDS | residual 5-15 % (`:350`) | "standing" only as far as the generation-time record; the pulse advances the stockpile, not the label |
| Import-Dependent: a substantial part of what it eats is bought | REFUTED | §A.2: residual 15-40 % UNCOVERED (`:347`); reachable on an isolated thorp with `importCoverageRate` 0 (`:293-296`, `:308-309`) | licensed: "a real share of its need is met by nothing on the record" |
| Deficit: a large standing gap | HOLDS | residual > 40 (`:344`) | — |
| Active Famine: not enough, and no arrangement bringing enough | REFUTED | the label is the famine STRESS alone (`:341-342`), production × 0.35 (`:243`); imports still cover (`:318` is not zeroed by famine; only siege forces the route isolated, `:244`). And the pool is unreachable from the shipped label (§A.10) | licensed: "a famine is recorded" |
| ENGINE CONTRADICTS (i) ratio not stock; (ii) blockade overrides | HOLDS | `:330`; `economyStateProse.js:394-396`; `foodStockpile.js:307-313,417-418` | — |

### 3.11 The export posture word
| item | verdict | evidence | condition |
|---|---|---|---|
| none: zero exports | HOLDS | `exportPosture.js:58` | — |
| limited: exactly one | CONDITIONAL | `:61` counts STRINGS after `toArray` (`:33-36`); the one may be a service label or a `(transit)` good on a river town with `isEntrepot` false | "one export line", never "one good it makes" |
| established: two or more | HOLDS | `:62` | same caveat on what a line is |
| entrepot: goods go out that came in | CONDITIONAL | `:59` needs `isEntrepot` (route crossroads, or port + `international trade`/`warehouse district`, `tradeGoods.js:90-97`) and count > 0; a `(transit)` export is written by `computeActiveChains.js:748-751` independently and may be absent | only where a `(transit)`-suffixed export is present |
| vulnerable: the access token is isolated | HOLDS | `:60` | — |
| ENGINE CONTRADICTS: import_dependent has no producer | HOLDS | `:56-62` | — |

### 3.12 The live trade-flow band
| item | verdict | evidence | condition |
|---|---|---|---|
| a measured throughput on the spatial ledger THIS TICK | CONDITIONAL | `tradeFlowEconomics.js:100-113` reads `rec.in`/`rec.out` raw and never `lastTick`; decay is applied only when `advanceTradeFlowTally` runs (`tradeFlow.js:186-192`) | "as of the last tick the tally was advanced" |
| ENGINE CONTRADICTS (a) SHORTAGE × not dependent unreachable; (b) unknown band null | HOLDS | `tradeFlow.js:252`; `economyStateProse.js:605-612` | — |

### 3.13 The canonical supply-chain status
| item | verdict | evidence | condition |
|---|---|---|---|
| stable: all inputs present | REFUTED | unknown → stable (`supplyChainState.js:199-202`); `entrepot` → stable with no local input at all (`:177`) | — |
| strained: running with no slack | CONDITIONAL | `vulnerable` → strained (`:178`); regional pressure 0.25-0.65 → strained (`:456`) | "running, under a recorded pressure or a route dependency" |
| scarce: producing below normal | HOLDS | `impaired` → scarce (`:179`); pressure >= 0.65 (`:455`) | — |
| blocked: offline after a hard upstream failure | REFUTED | the only writer of the legacy token is the isolated-subsistence shutdown of entrepot chains (`customTradeEndpointIntegration.js:113-118`): no route, not a failure upstream | licensed: "shut off for want of a route" |
| captured: a faction takes rents | HOLDS (vacuous) | no producer anywhere; `:443` only propagates it | unlicensable on any shipped town |
| substituted: running on a prop | HOLDS | `magically_sustained` → substituted (`:180`) | — |
| collapsing: failing under MULTIPLE compounding pressures | CONDITIONAL | `:444` needs `severeCount >= 2`; `:447` fires on `scarce && maxSeverity >= 0.8` — ONE pressure | "multiple" only on the `severeCount >= 2` arm |
| ENGINE CONTRADICTS: unknown → stable; captured and collapsing have no producer | HALF-REFUTED | §A.7: `collapsing` is produced at `:444,:447` | — |

### 3.14 The entrepôt
| item | verdict | evidence | condition |
|---|---|---|---|
| goods that leave were not made here | CONDITIONAL | only the `(transit)`-marked members; `isEntrepot` alone is `route === 'crossroads'` (`tradeGoods.js:94`) | per §3.11 entrepot |
| ENGINE CONTRADICTS: entrepôt = crossroads; transit is a slice | HOLDS | `tradeGoods.js:90-97`, `:162` | add: the `Entrepôt Trade` income desc asserts "warehouse fees" on every crossroads town+ (`:139-144`) — engine prose richer than the record |

### 3.15 The shadow-economy tier
| item | verdict | evidence | condition |
|---|---|---|---|
| a share of trade not on the rolls, banded | CONDITIONAL | `safetyProfile.js:619-638` is an estimate off the criminal slider; the OFF-BOOK INCOME LINE exists only when `blackMarketCapture > 10` (`economicState.js:319`) | at the minor tier (3-10) there is a shadow reading and NO criminal income line; a face must not point at the income mix there |
| ENGINE CONTRADICTS: estimate; below 3 no surface; missing is null | HOLDS | `economyStateProse.js:545-565` | — |

### 3.16 The service catalog
| item | verdict | evidence | condition |
|---|---|---|---|
| an absence entails only that the roster does not fill that category at a tier that expects it | HOLDS | `servicesDisplay.js:48-53` | `availableServices` is the pipeline's own category map; `magic`/`employment`/`criminal` never expected (`:15-22`) |
| ENGINE CONTRADICTS: tier-indexed only | HOLDS | `:15-22` | — |

### 3.17 The tier word
| item | verdict | evidence | condition |
|---|---|---|---|
| a population band | HOLDS | `resolveConfig.js:89-97`; `constants.js:7-14`, `:26-35` (boundaries agree) | — |
| a list of expected categories | HOLDS | `servicesDisplay.js:15-22` | — |

### 3.18 The terrain word
| item | verdict | evidence | condition |
|---|---|---|---|
| Coastal: the sea | HOLDS | `geographyData.js:53` "ocean coast"; `generationContext.js:195` coastal ⇒ maritime | — |
| Coastal: a harbour edge | REFUTED | `deep_harbour` may be absent/depleted; `hasPort` separate (`priorityHelpers.js:32,61`); an explicit `isolated` route on coastal terrain is constructible (§A.3) | — |
| Coastal: salt and fish IN THE ALLOWED ROSTER | CONDITIONAL | `allowedResources` (`:54-66`) is terrain POTENTIAL; the town's roll is `nearbyResources`, and the terrain fallback fires only when the roster is unresolvable (`resourceGenerator.js:59-68`) | present only where `nearbyResources` carries them and they are not depleted |
| Riverside: fresh water | HOLDS | `:130` | — |
| Riverside: a crossing | REFUTED | `:130` is a disjunction ("along a navigable river OR at a river crossing"); `naturalFeatures` (`:195-201`) is consumed only as the undercity anchor pool (`src/domain/undercity/staticComponents.js:289`), never recorded per town | — |
| Mountain: rock and height | HOLDS | `:212` | — |
| Mountain: a short growing year | REFUTED | no season-length field; `agricultureCapacity 0.4` is a yield multiplier, and the canonical food model uses its own table anyway (§A.6) | licensed: "the ground yields little" |
| Forest: trees | HOLDS | `:314` | — |
| Plains: open, arable ground | HOLDS | `:422`, capacity 1.5 / 1.0 in both tables | — |
| Hills: slope | HOLDS | `:527` | — |
| Desert/Arid: little water | HOLDS | `:625` | — |
| (implied) comparative fertility between terrains | CONDITIONAL | §A.6 | only where both tables order the pair the same way (hills vs coastal disagree) |
| ENGINE CONTRADICTS: Swamp/Tundra/default no producer | HOLDS | `economyStateProse.js:670-681` | — |

### 3.19 The market
| item | verdict | evidence | condition |
|---|---|---|---|
| a place where goods change hands; as a holder, keeps the trade record | HOLDS | `holderTable.js:310-316`; `institutionServices.js:1064-1066` (`Weekly market` p 1.0 on Market square) | the holder needs an INSTANTIATED row (`holderTable.js:243-247`); `Public auctions` is `on:false p:0.5`, `Weekly market` is `on:true p:1.0`, so Market square always resolves |
| ENGINE CONTRADICTS: one institution carries both | HOLDS | measured by grep: `:1064-1066` | — |

### 3.20 The dear / cheap good
| item | verdict | evidence | condition |
|---|---|---|---|
| a movement against this settlement's OWN usual price, never a coin | HOLDS | `marketPrices.js:65-76`, `:161-168` | — |
| (implied) `steady` is a measurement | REFUTED | absent ledger entry ⇒ `adequate` (`:318`, `:137`) | `steady` = unmeasured OR in band |
| (implied) the crier's reason | REFUTED | §A.5 `:213-218` invents a seasonal cause | never copy the receipt clause |
| ENGINE CONTRADICTS: stock count vs 8; services never move | HOLDS | `:143-151`, `:129-133` | — |

---

## §C LABEL TRAPS THE SURVEYOR MISSED

| Label | Field | The ENGINE meaning | Source |
|---|---|---|---|
| `river` (access) | `hasSeaPort` | Counts as a SEA modality in the arrivals tally | `src/domain/spatial/tradeFlow.js:112-115,142` |
| `sea` / `coastal` (access) | `ROUTE_TIER`, `hasSeaPort` | Accepted readers' tokens with NO producer; `tradeRouteSemantics.js:89` calls `coastal` a "real generated value" | `resolveConfig.js:29-37,132-133`; `tradeRouteSemantics.js:83-97` |
| `port` on riverside terrain | `portKind` | A RIVER port, not the sea | `generationContext.js:195-205` |
| `mountain_pass` | route tier `seasonal` | An ANNUALIZED 0.4 share of a road; never a live closure | `tradeRouteSemantics.js:34-47,76,90`; `foodGenerator.js:304-317` |
| `isolated` | three models | "cannot import anything" (`tradeGoods.js:53-56`) vs a minor-route food trickle for town+/village (`foodGenerator.js:168-176,293-296`) vs "nothing reaches it" (`economyStateProse.js:167`) | §A.8 |
| `Import-Dependent` (corrected) | `foodSecurity.label` | 15-40 % of need met by NOTHING, imports already subtracted; printable with zero imports | `foodGenerator.js:318-330,347` |
| `Secure` | `foodSecurity.label` | residual <= 5 % — covered by fields, road OR magic | `:356-358` |
| `Deficit — Active Famine` | `foodSecurity.label` | the famine STRESS, whatever the arithmetic; imports still flow | `:341-342`, `:318` |
| `Agricultural Rents` | `incomeSources[].source` | a TIER default at thorp/hamlet/village; no farm, field or resource required | `economicState.js:55-60` |
| `Property Rents` desc "within the walls" | `incomeSources[].desc` | gated on tier only (`getTradeRouteFeatures = TOWN_PLUS`), walls never checked | `economicState.js:156-163`; `helpers.js:41` |
| `Toll Revenue` desc "roads and bridges" | `incomeSources[].desc` | route === crossroads; no bridge, no toll institution | `economicState.js:174-179` |
| `Entrepôt Trade` desc "warehouse fees" | `incomeBonuses[].desc` | crossroads route at town+; no warehouse checked | `tradeGoods.js:139-144` |
| `Thieves' Guild Revenue` | criminal income label | `crimInsts` containing `guild` OR `thieves` — an `Assassins' Guild` alone yields it | `economicState.js:323-336`; `safetyProfile.js:596` |
| `Criminal Syndicate Revenue` | criminal income label | `hasMarket` matches `underground` (Underground City) | `economicState.js:326-328,333-334` |
| `Guild Fees` (lawful income) | `incomeSources[].source` | `hasInst('guild')` — a Thieves' guild pays "guild fees" to the town | `economicState.js:107-113` |
| `Market Taxes` | `incomeSources[].source` | also from an `annual fair` alone | `economicState.js:90-97` |
| `flour` (local commodity) | `localProduction` | any institution name containing `mill` or `baker` — a Sawmill town mills flour | `tradeGoods.js:29` |
| `salt` (local commodity) | `localProduction` | any name containing `dock`, `port` or `fishmonger` | `tradeGoods.js:35-36` |
| `Fishing & water` (food chain) | `foodSecurity.chains` | `hasInst('fish')` — a Fishmonger is a fishery | `foodGenerator.js:126,151` |
| `food` (institution TAG) | processing-tag matcher | declared on Taverns, Ale house, Toll bridge, Water source, Caravaneer's post; backfilled on any name matching `/mill|…|field|…/` — all process the GRAIN chain | `institutionalCatalog.js` (tags scan); `entities.js:171`; `resourceChains.js:56`; `resourceGenerator.js:155-161` |
| `Mill` (terrain modifier row) | `institutionModifiers` | matched by `includes()`, so Sawmill / Fulling mill / Windmill take the riverside water-milling boost | `geographyData.js:170`, comment `:258-261` |
| `steady` (market tag) | `marketQuote.tag` | no ledger entry OR within band | `marketPrices.js:318,137` |
| crier `receipt` | `highlight.crierLine` | an INVENTED seasonal cause when the road drift does not explain the band | `marketPrices.js:213-218,272` |
| `agricultureCapacity` / `TERRAIN_AGRI` | two tables | disagree on five of seven terrains; comment "(matches TERRAIN_DATA)" is false | `foodGenerator.js:37-41`; `geographyData.js:68,144,227,329,437,542,638`; `foodBalance.js:46` |
| `collapsing` | chain status | HAS a producer (regional pressure); one arm fires on a single pressure | `supplyChainState.js:443-447` |
| `unexploited` (chain STATUS) | `activeChains[].status` | the isolated thorp/hamlet entrepot shutdown, remapped to `blocked`; NOT the exploitation bucket's "no processor" | `customTradeEndpointIntegration.js:113-118`; `supplyChainState.js:181`; `resourceGenerator.js:175` |
| `exportValue` on a partial row | exploitation row | the chain's static value rides the row while `evaluateInstitutionDeps` reports the partial export at `'medium'` | `resourceGenerator.js:307-314` |
| `resourceAnalysis.exports` vs `primaryExports` | two lists | exploitation exports and the trade column come from two pipelines; "leaves as {good}" reads one and the export column is the other | `resourceGenerator.js:295-317`; `economicState.js:741-751,791-795` |
| `{institution}` (exploitation lens) | `processingInstitutions[0]` | the CATALOG'S canonical processor, carried unchanged on the static chain object | §A.1; `resourceGenerator.js:140,166-181` |

## §D ALIAS TRAPS THE SURVEYOR MISSED (or only half-caught)

### D.1 "the port" / "the harbour"
Rows: route token `port` (`resolveConfig.js:34`) · terrain `coastal` (`geographyData.js:51`) ·
resource `deep_harbour` (positional; `depleted` = "obstructed or unsafe", `resourceSemantics.js:57-62`)
· institution flag `hasPort` (word-bounded regex, `priorityHelpers.js:32,61`) · income `Port Duties`
needs `docks/port` / `harbour master` / `shipyard` AND `supportsMaritime()` (`economicState.js:120-128`)
· `portKind` maritime / river / none (`generationContext.js:201-205`) · `hasSeaPort` in the tally
which admits `river` (`tradeFlow.js:114`). Safe generic: *the way in by water*; "the harbour" only
where `deep_harbour` is available or `hasPort` resolves; "the sea" only where `maritimeSupported`.

### D.2 "the pass"
Rows: route `mountain_pass` (seasonal tier) · resource `defended_pass` (positional, label `Mountain
Pass`, `resourceData.js:262`) · static feature `mountain pass` (`geographyData.js:300`). DS-ECO-1
folds `isolated` and `mountain_pass` into one "narrow approach" pool (`economyStateProse.js:343`)
while the engine's tiers are `isolated` and `seasonal` — a C2/C5 face must not say "nothing
reaches" on a pass town nor "closed in winter" on an isolated one. Safe generic: *a narrow approach*.

### D.3 "the crossroads"
Rows: route `crossroads` (⇒ `isEntrepot`, `Toll Revenue`) · resource `crossroads_position`
(`Strategic Crossroads`, positional) · plains feature `market crossroads` (static). A
crossroads-route town carries the resource only by default roll (`terrainHelpers.js:52-56`) and an
explicit roster may lack it; a plains town with the resource may have a `road` route.

### D.4 "the river"
Rows: route `river` · terrain `riverside` · resources `river_mills` / `river_fish` / `river_clay` /
`fertile_floodplain` · SEA modality (`tradeFlow.js:114`). A `river`-route town on plains or forest
terrain (`resolveConfig.js:30,32`) has none of the riverside rows.

### D.5 "the farm" / "the fields"
Rows: income `Agricultural Rents` (tier default) · `hasFarmland` / `hasSubsistence`
(`foodGenerator.js:120-121`) · resources `grain_fields` / `fertile_floodplain` · the AGRICULTURE tag
backfill on any name containing `field` (`entities.js:171`) · `dailyProduction` which needs no
field at all (`foodGenerator.js:270-271`). Safe generic: *the land*, *what the town raises*.

### D.6 "the mill" (extended)
Add to the surveyor's §5.2: the FOOD/AGRICULTURE tag backfill on `mill` makes every mill a GRAIN
processor (`entities.js:171`); `tradeGoods.js:29` makes it a flour producer; the terrain `Mill` row
boosts it (`geographyData.js:170`). Four readers, one substring.

### D.7 "the tavern" / "somewhere that sells a meal" (DS-SUP-3 `food`)
The gap is `availableServices.food` empty (`servicesDisplay.js:48-53`); the same houses carry
`TAG.FOOD` and count as grain processors (§A.1). A FOOD GAP town can still have its grain chain
fully exploited through granaries, and a town with two taverns and no farm has a "complete" grain
line. Safe generic: the category word the annex uses, *a meal*.

### D.8 "the healer" (DS-SUP-3 `healing`)
Two answers to "does the town have a healer": `availableServices.healing` (the desk's read) and
`hasHospital = hasAny(['hospital','monastery','healer','friary'])` (`priorityHelpers.js:64`). A
monastery satisfies the second and may not fill the first.

### D.9 "the stores" (two ledgers, one civic class)
`GRANARY: thin` reads `foodSecurity.storageMonths / capacityMonths` (food); the SCARCITY pools
("The stores are short of it", corpus `:2878`) read `commodityStocks[sid][good]` against a target
of 8 units (`marketPrices.js:143-151`). Both spend the `store` civic class (`wiringCensus.js:1309`),
so T-F12 refuses one beside the other, though they are different ledgers. The chair's §6.3
finding, seen from the other side.

## §E MISSED NOUNS (slot nouns or name classes of the desk the surveyor did not row)

1. **the road / the carts** in DS-ECO-2 FOOD: deficit (annex `:855-856`): §A.9 — the tile's
   deficit is the residual AFTER the road; "made good off the road" contradicts the record and
   "the carts" names a route an isolated town lacks.
2. **the fields** (annex `:856`, DS-ECO-2): no field is recorded; production is workforce × terrain.
3. **the gates** (corpus `:1289` "comes out of the gates as {good}"): a wall fact (`hasGates`,
   `priorityHelpers.js:53`; `Gate Tolls` needs gate/wall names, `economicState.js:180-185`) on an
   economy sentence gated by nothing.
4. **boats** (TERRAIN: Coastal `:1503` "comes off boats more often than out of fields"): no boat
   record; `hasPort` / `Fishing community` are the nearest rows; an isolated coastal town has neither.
5. **the crier** (SCARCITY pools, corpus `:761-786`, `:2878-2948`): not an institution; it is
   `CRIER_FRAMES` (`marketPrices.js:228-241`), a display device whose receipt clause is invented (§A.5).
6. **bread / the price of bread** (DS-ECO-1 C1 `:41`; DS-ECO-2 `:856`): `bread` is the grain
   chain's `finalProducts[0]` and a catalog good; as idiom it is harmless, as a record it needs the
   grain chain. The chair may want a ruling on idiom versus record.
7. **the yard, a clerk, the workshop** (DS-SUP-1 `:1407`, `:2525`): the surveyor noted the
   entrepôt yard in 3.14; `warehouse` is a civic-object token (`wiringCensus.js:1322`) and
   `hasWarehouse` a flag (`priorityHelpers.js:60`); `clerk` has no row anywhere.
8. **the books / the accounts / the rolls** (ledger angle throughout): the treasury holder's seven
   institutions (`holderTable.js:272-278`); on a thorp with only a `Household elder` there is no
   treasury row, and "the books close with a margin" (`:31`) cites a record no one keeps.
9. **the smelter / the smith** (3.6's "needing a smelter"): `Smelter` is a chain processor and a
   mountain modifier row (`geographyData.js:254`); the METALWORK tag is declared-only (the backfill
   maps `forge|smith` to CRAFT, `entities.js:172`), so `fullyExploited` iron needs two declared
   METALWORK carriers, which a Smelter need not be among.
10. **the granary doors** (annex `:857`): rowed by the surveyor in 3.8; listed here because the
    variant is live in the corpus and the building may be absent.
11. **`{season}` on DS-ECO-9**: the block names `{season}` but its fill is the STOCKPILE'S season
    (`economyStateProse.js:908`), present only under seasons-on; a food-security variant naming it
    is dropped on every seasons-off world — a liveness fact worth a row.
12. **the horizon / the weather at sea / the tideline** (TERRAIN variants): scene words with no
    record; harmless only while they assert nothing the terrain word does not.

## §F CORRECTIONS TO THE SURVEYOR'S CITATIONS

- `computeActiveChains.js` lives at `src/generators/computeActiveChains.js`, not
  `src/generators/economy/` (survey 3.4, 3.14); `:751` is the right line.
- "`captured` and `collapsing` have NO PRODUCER" (survey 3.13, §2.9): `collapsing` is produced at
  `supplyChainState.js:444,447`. Only `captured` is unproduced.
- "`unexploited` remaps to `blocked` — never worked and shut off share one word" (survey §4 row
  `blocked`): the remapped token is the chain STATUS written at
  `customTradeEndpointIntegration.js:116` (no route), not the exploitation bucket; the two
  `unexploited`s are different records.
- "`Import-Dependent` = a deficit between 15 % and 40 % of daily need" (survey §4): it is the
  RESIDUAL deficit after imports and magic (`foodGenerator.js:318-330`); the survey's own 3.10
  gloss "a substantial part of what it eats is bought" is the label read as English.
- `TERRAIN_DATA.agricultureCapacity` quoted in 3.18 as the engine's fertility (`0.4`, `1.5`,
  `0.3`): the canonical food model reads `TERRAIN_AGRI` in `foodGenerator.js:38-41` instead (§A.6).
- 3.1's `naturalFeatures` "include ford, bridge site, ferry crossing" and 3.18's "a crossing": the
  list is static per terrain and is consumed only by the undercity anchor
  (`staticComponents.js:289`); no town records a crossing.

## §G WHAT SURVIVES CLEAN (for the chair's licence table)

HOLDS with no condition: `road` = an overland way; `river` = a way by water; `crossroads` = more
than one way; the `{season}` word and its order under seasons-on; the material nature of every
`{resource}` word; the resource is present and available; the granary band as a fraction of this
town's capacity; the prosperity rung as an ordered position; `Surplus` = raises more than it eats;
`Pressured` and `Deficit` as residual gaps; posture `none` / `established` / `vulnerable`; chain
`scarce` and `substituted`; the service absence as a tier-expectation fact; the tier as a
population band; Coastal = the sea, Riverside = fresh water, Mountain = rock and height, Forest =
trees, Plains = open arable ground, Hills = slope, Desert = little water; the market as a place
where goods change hands and as the holder `Market square`; dear/cheap as a movement against the
town's own usual price.

Everything else in the survey's ENTAILS columns is CONDITIONAL or REFUTED above, and the sharpest
three for the wave are §A.1 (the exploitation lens's `{institution}` is not a house of this town),
§A.2 (`Import-Dependent` and `Secure` measure the residual, not the buying) and §A.5 (the shipped
crier already invents a cause the prose must not inherit).
