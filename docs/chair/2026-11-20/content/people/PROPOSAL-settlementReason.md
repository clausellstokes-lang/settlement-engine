# PROPOSAL — `settlementReason[]` (PEOPLE-1, measuring seat M3, 2026-11-20)

Base `01351d72d`, a docs-only child of the working line `43ab0f5eb` (`git diff 43ab0f5eb 01351d72d -- src tests scripts package.json` is empty). Measured on 100 places a size, the six sizes. The places are born exactly as the chair's instrument births them (`hxd-<size>-<i>`, the same name mask; goods and houses are not masked).

Scripts and their count lines:
- `measures/m3-births.mjs` (+ `.out.txt`) caches the births.
- `measures/m3-origins.mjs` (+ `.out.txt`) gives today's figures and the projection.
- `measures/m3-pools.mjs` holds the proposed pools, as data.

Nothing under `src/`, `tests/` or `scripts/` was changed.

**Validation.** Before projecting anything, the measure reproduces today's stored lines from the writer's own pools and keys:
- line 0's arm: 600 of 600;
- line 0's sentence: 600 of 600;
- line 1: 400 of 400.

So the projection starts from the real code path.

**Where it prints** (the chair, 16:30 UTC: SAME-1's render saw it on the Overview and in the PDF; it comes first):
- every line: the web Overview "Settlement Origin", the Summary tab, the PDF Overview, the campaign PDF and the Foundry journal;
- line 0 alone: also the spine, the quick guide and the AI grounding payload.

**The answer first.** Today the size line is one fixed sentence in 100 of 100 cities and 96 of 100 metropolises. The cure is the pattern the chair ruled:
- index 0 is today's exact line;
- variants are chosen by a keyed hash, with no draw;
- every variant needs facts the record already holds.

It projects **7–14% at every size** and needs **no new atom**.

The build is:
- one new data file;
- **one call line in `src/generators/narrativeGenerator.js :: generateSettlementReason`**: its closing `return lines;` becomes `return variedReasonLines(lines, { tier, route, config: _config, foodBalance, roster, siege: siegeInForce, hasFoodDeficit });`;
- one handed argument in `steps/generateNarratives.js`: the place's facts at the step (§6.1).

## 1. The function

`src/generators/narrativeGenerator.js :: generateSettlementReason(tier, route, neighbor, _config, foodBalance, roster)` writes the field. It is called once, from `src/generators/steps/generateNarratives.js` (step 14, after `generatePopulation` and `economyReconcilePass`). It draws nothing: `generationForkRegistry.js` classes it `pure`. It returns one or two lines.

**Line 0: where the place stands.** It comes from `src/generators/narrative/settlementOriginProse.js :: selectOriginBody`. `originArmKey` picks the ARM:
- `crossroads`: the route is a crossroads;
- `river`: the route is a river;
- `port.riverside`, `port.coastal`, `port.generic`: a port route whose roster holds docks, split by terrain;
- `ground`: a port route with no docks on a named terrain; `{ground}` is the terrain phrase;
- `isolated.besieged`, `isolated.unsupplied`, `isolated.deficit`, `isolated.sustained`: an isolated route, split by food gap, siege and supply;
- `road`: every other route.

Each arm is a pool of five. The row is `pickVariant(pool, originVariantKey(...))`, keyed on the seed, the arm, the terrain, the deficit and the resources. A row that `ORIGIN_ROW_ADMITS` refuses walks onward to the next admitted row:
- under a siege, the present-traffic rows of road, crossroads and river are refused;
- road row 3 needs an inn, and a city or metropolis never takes it.

**Line 1: the size line.** It is written in `generateSettlementReason` itself:
- **metropolis**: "Everything in the region is bought, sold or decided here." Under a siege, its twin "In ordinary times everything …".
- **city with a food gap** (gap ≥ 5% of daily need, before or after imports): "Large enough that its appetites outrun its fields. What the city consumes, it cannot fully produce."
- **city without a food gap**: "Large enough to feed itself; …", with a siege twin.
- **thorp and hamlet**: `pickVariant(SMALL_PLACE_TIER_LINES, '<seed>::settlement-tier-line::<tier>')`, five vantages.
- **village and town**: no line 1.

## 2. Today's branches and top share (100 places a size; entries = lines)

| branch | thorp | hamlet | village | town | city | metropolis |
|---|---|---|---|---|---|---|
| line 0 · road | 40 | 32 | 34 | 57 | 34 | 52 |
| line 0 · river | 21 | 20 | 24 | 16 | 30 | 26 |
| line 0 · crossroads | 13 | 19 | 16 | 16 | 20 | 8 |
| line 0 · ground | 12 | 12 | 11 | – | – | – |
| line 0 · port.coastal | – | – | – | 11 | 16 | 14 |
| line 0 · isolated (all four) | 14 | 17 | 15 | – | – | – |
| line 1 · small-place pool | 100 | 100 | – | – | – | – |
| line 1 · city with a gap | – | – | – | – | **100** | – |
| line 1 · metropolis / siege twin | – | – | – | – | – | **96 / 4** |
| places · lines | 100·200 | 100·200 | 100·100 | 100·100 | 100·200 | 100·200 |

**Top sentence today** (places printing it / places holding the field):

| size | top | sentence |
|---|---|---|
| thorp | 28/100 (28%) | Everyone here knows every household by name, and none has much put by. |
| hamlet | 25/100 (25%) | A handful of houses; you could greet everyone in it before noon. |
| village | 17/100 (17%) | Sited on a route already worn deep before anyone built here; a road that old is not soon abandoned. |
| town | 15/100 (15%) | (the same road row) |
| city | **100/100 (100%)** | Large enough that its appetites outrun its fields. What the city consumes, it cannot fully produce. |
| metropolis | **96/100 (96%)** | Everything in the region is bought, sold or decided here. |

The road row 4 ("Sited on a route already worn deep …") is the top of line 0 at every size: 24 of 100 metropolises. The onward walk lifts it. Row 3 is refused without an inn and in every city and metropolis, and the walk lands it on row 4.

## 3. The readers

| path :: symbol | kind | what breaks if the words change |
|---|---|---|
| `src/components/new/tabs/OverviewTab.jsx` ("Settlement Origin", every line), `src/components/new/SummaryTab.jsx` | PRINTS (web) | nothing; new words print |
| `src/pdf/lib/viewModel.js` → `src/pdf/sections/Overview.jsx`; `src/utils/generateCampaignPDF.js` | PRINTS (PDF) | nothing |
| `src/foundry/journalPages.js` ("## Settlement Origin") | PRINTS (export) | nothing |
| `src/domain/simulationSpine.js :: deriveExistsBecause`; `src/domain/summary/settlementQuickGuide.js :: composeFoundationTruth`; `supabase/functions/_shared/aiGroundingBundle.js` | COMPOSES (line 0 only, `firstText`) | nothing: they print line 0 whole as a sentence. Line 0 changes only on road, river and crossroads. The grounding bundle is the deploy's built copy, so it is the owner's hand. |
| `src/generators/generationCoherence.js` (every generated string → `allowsMaritimeClaim`, `allowsMagicClaim`) | MATCHES (world-law audit) | a maritime word without coastal capability drops the dossier to needs_review. The measure ran `textAssertsMaritimeCapability` over every new wording: 0 hits. |
| `src/domain/userEdits.js`, `store/settlementPendingEdits.js`, `components/dossier/WorkbenchProseEditor.jsx`, `components/settlement/VersionDiffView.jsx`, `domain/display/publicSafe.js`, `domain/display/stateProse/dmFieldProjection.js` | DM-edit / allowlist by field name | nothing; a saved town keeps its stored sentence |
| `tests/generators/settlementReason.test.js` ("reaches every one of the five": `seen` must EQUAL the five) | MATCHES | holds if an unanswered atom refuses: a bare `{}` caller has no facts, so no variant is eligible and the five stay the whole list. The builder proves this first. |
| `tests/generators/originSiegeHolds.test.js` (exact metropolis line, seedless and born `rww-metropolis-under_siege-1`) | MATCHES | holds: under a siege the twin stands alone (§4) |
| `tests/generators/originRowsRefused.test.js` (born road towns: `ORIGIN_POOLS.road` must contain line 0) | MATCHES (pool membership, seeded) | red where a road town's pick is a new variant: widen to "the road pool or its variants" |
| `tests/generators/bar5WorldLines.test.js` ("a calm road town with an inn keeps its line"; road rows never open "Founded") | MATCHES (seeded KEEP) | the KEEP goes red if its pick moves: re-key by identity. No new row opens "Founded" (guarded). |
| `tests/generators/tailNarrativeRows.test.js` (`origin(seed)`) | MATCHES (seeded) | re-key any row whose pick moves |
| `tests/data/tailHouses3DefenceDeposit.test.js` (no mine, ore or deposit words in `settlementReason`) | MATCHES (word guard) | none: 0 hits (guarded) |
| `tests/generators/settlementOriginProse.test.js` (index 0, seedless, no power-of-two pool, all over `ORIGIN_POOLS`) | MATCHES | none: `ORIGIN_POOLS` is untouched. The new pools need their own pins in the same shape (§6.3). |
| `tests/lint/presumptionClasses.shared.mjs` (file → pool map) and `presumptionClasses.register.json` (the "A handful of houses …" `size` row) | MATCHES (presumption walker) | the new data file needs its row in the map and its own register rows |
| `scripts/census/pool-dominance.register.json` | MATCHES (dominance ceiling) | a new pool id needs rows: a re-base, the chair's ruling |
| `tests/property/generatorGoldenMaster.test.js` | hashes every text leaf | moves on every town whose pick leaves index 0: the signed door, the owner's hand |
| `docs/census/declarations/DS-GEN-6.json` (annex block DS-GEN-6, "{settlement} is large enough that its appetites outrun its fields …", glance rung at `overview.origin`) | a sibling sentence of the same fact, not a reader | nothing breaks. It no longer repeats line 1 word for word. |

## 4. The candidate wordings, by branch

The rules for every pool below:
- The selection is `pickVariant([today's admitted rows …, ...the wordings whose needs hold and whose excludes do not], <today's key>)`. The keys are unchanged: `originVariantKey` for line 0 and `'<seed>::settlement-tier-line::<tier>'` for line 1. It is a keyed hash with no draw, so the stream is untouched.
- Index 0 is today's exact line.
- A seedless caller, or one with no facts, prints today's sentence.
- A wording whose words name present traffic carries `excludes: crisis: under_siege`, the house's siege law.
- Line 0 keeps its rung's laws. It says WHERE the place stands, never WHY it was founded, never how old it is, and never "Founded …".
- Every line is plain, and slotted where it can be:
  - `{ground}` is the terrain as a place phrase (`GROUND_PHRASE`, plus "on the riverbank").
  - `{export}` is the first of the vocabulary's own export goods the place holds: `exported: flour|hides|ale|arms` → grain, hides, ale, weapons. `cloth` is not used, because its words take in "Raw wool".
  - `{routeWay}` is "along the roads", "by the river" or "by water".
- The new pools go in the proposed data file `src/data/settlementReasonVariants.js`: `ORIGIN_VARIANTS`, `SMALL_PLACE_VARIANTS`, `CITY_DEFICIT_VARIANTS`, `METROPOLIS_VARIANTS`.

The facts' homes:
- terrain → `terrain.js`;
- route → the route home (`factsOf.route`);
- river, coast, navigable → `water.js`;
- market → `market.js`;
- mill, docks, granary, tavern, bank, school, temple → `institutions.js`;
- gate, walls, palisade, court, hospital → `defence.js`;
- legal house → `legalHouse.js`;
- guild → `guild.js`;
- ruler → `rulerKind.js`;
- ruling body → `rulingBody.js`;
- prosperity → `factsOf.prosperity`;
- population → `populationBand.js`;
- fish, grain, livestock, game → `factsOf.foodSources`;
- fish bought in → `fishBoughtIn.js`;
- food surplus → `growsMoreThanEats.js`;
- famine → `famine.js`;
- exported, exports, imports → `goodExported.js` and `factsOf.exports` / `factsOf.imports`;
- church access → the faith home;
- **FOOD_IMPORT** is the writer's own input: `economicViability.metrics.foodBalance.importCoverage > 0`, its `hasFoodImport`.

**The guards every wording passed** (run by the measure; 206 wordings across both proposals, 0 misses):
- a known atom;
- none of the struck tics;
- at most 30 words;
- no maritime claim without `coast`;
- no founding cause on line 0;
- no deposit words;
- every city line keeps the gap.

**Line 0 · road** (8 new, after today's five)

| wording | needs · excludes | why here |
|---|---|---|
| It stands on the road {ground}, and the road is how people and goods reach it. | terrain · siege | its own terrain on its own route (the traveller) |
| Built beside the road {ground}; what the place sells goes out along it, and what it buys comes in. | terrain, exports, imports · siege | it both sells and buys (the trade) |
| A road settlement with a market of its own, where goods that come along the road are bought and sold. | market · siege | a market stands |
| It stands where the road meets the river, and goods come in by both. | river, navigable · siege | its water is a navigable river |
| The road climbs to it through the hills, and every load comes up that road. | terrain: hills · siege, navigable | hills, no water way |
| The road winds up to it through the mountains, and every load comes up that road. | terrain: mountain · siege, navigable | mountain, no water way |
| It stands on the road, and its {export} goes out along it to be sold. | exported · siege | its own export good |
| Built on the road across the open plain, among the grain fields that feed it. | terrain: plains, grain · famine | plains, grain is a food source |

**Line 0 · river** (5 new)

| wording | needs · excludes | why here |
|---|---|---|
| It stands on the river {ground}, and the river is its way in and out. | terrain · siege, terrain: riverside | its terrain (riverside is named already) |
| Built on the river, with landing stages where boats tie up to load and unload. | docks · siege | a docks house stands |
| Built on the river; its people fish it, and draw their water from it. | fish, river | fish is a food source, its water is the river |
| A river settlement whose market takes in what comes by water and what comes by land. | market · siege | a market stands |
| A river settlement; its {export} goes out by the river to be sold. | exported · siege | its own export good |

**Line 0 · crossroads** (4 new)

| wording | needs · excludes | why here |
|---|---|---|
| Built where the roads cross; its market draws buyers from every direction. | market · siege | a market stands |
| It stands where roads cross {ground}. | terrain | its terrain |
| Built at a crossroads; its {export} goes out along its roads. | exported · siege | its own export good |
| Built where the roads cross; travellers from every road find an inn here. | institution: tavern, tier: ≤ town · siege | an inn stands; never a city (road row 3's own refusal) |

The port, ground and isolated arms are untouched. Each is at most 17 places of a size, split three or four ways.

**Line 1 · thorp and hamlet** (15 new, after today's five)

| wording | needs · excludes | why here |
|---|---|---|
| A few households {ground}, each with its own work and little to spare. | terrain | its terrain (the local) |
| A handful of homes {ground}, where any newcomer is noticed at once. | terrain | its terrain (the traveller) |
| Fishing is part of how the households here feed themselves. | fish | a food source |
| Grain from their own fields feeds the households here. | grain | a food source |
| Herds are part of how the households here feed themselves. | livestock | a food source |
| Hunting is part of how the households here feed themselves. | game | a food source |
| There is no market here; what a household cannot make, it must get elsewhere or do without. | · market | no market stands |
| In most years there is just enough here, and little put by. | prosperity: ≤ poor · famine | poor or below, not starving |
| The place is small, but its households want for little. | prosperity: ≥ comfortable | comfortable or better |
| There is no temple here; for the rites, people go to the nearest place that has one. | church access · temple | the faith is reached elsewhere |
| The place sends out its {export} to be sold. | exported | its own export good |
| What little needs deciding here is decided by the elders together. | ruling body, ruler: elder | a body of elders rules |
| A palisade rings the few houses here. | palisade | a palisade stands |
| The fields here grow more than the households eat. | food surplus | it grows more than it eats |
| What the place has to sell is taken elsewhere to market. | exports · market | it sells, and keeps no market |

**Line 1 · city with a gap** (15 new; every wording keeps the gap, guarded)

| wording | needs · excludes | why here |
|---|---|---|
| The city eats more than its own fields can grow; the rest comes in {routeWay}. | route, FOOD_IMPORT · siege | food is brought in, by its own route |
| Its own fields cannot fill the city's grain stores. | institution: granary | a granary stands |
| Part of what the city eats is bought at its market, not grown by its own people. | market, FOOD_IMPORT · siege | a market, food brought in |
| The city lands fish of its own, but still eats more than its fields and its catch provide. | fish · fish bought in | it lands its own fish |
| Even its fish is bought in now; the city grows and catches less than it eats. | fish bought in | its fish grounds are spent |
| Barges bring food in by the river to a city its own fields cannot feed. | river, docks, FOOD_IMPORT · siege | river, docks, food brought in |
| Boats bring in food by water; its own fields cannot feed a city this size. | coast, docks, FOOD_IMPORT · siege | coast, docks, food brought in |
| Its herds and its fields cannot feed the whole city; the rest must come from outside. | livestock, grain, FOOD_IMPORT | its own food sources, named |
| The city can afford to buy what its own fields cannot grow, and it has to. | prosperity: ≥ comfortable, FOOD_IMPORT · siege | comfortable or better |
| A city this size {ground} eats more than its own fields can grow. | terrain | its terrain |
| Grain from outside is ground here alongside its own; the city's fields cannot feed it. | institution: mill, FOOD_IMPORT · siege | a mill stands |
| Carts of food come in at its gates; its own fields cannot feed it. | gate, FOOD_IMPORT · siege | a gate stands |
| A city of this many people eats more than its own fields can grow. | population: large | a large population |
| Some of what is eaten here comes in {routeWay}; the city's own fields cannot grow enough. | route, FOOD_IMPORT · siege | its route (the local) |
| The fields around the city {ground} cannot feed it; the rest is bought in. | terrain, FOOD_IMPORT · siege | its terrain (the traveller) |

The city without a gap is untouched: 0 of 100 cities here.

**Line 1 · metropolis** (15 new). Under a siege the twin stands alone and no variant is drawn, so `originSiegeHolds` keeps its exact line.

| wording | needs · excludes | why here |
|---|---|---|
| Buyers and sellers from across the region come here to trade. | market · siege | the trade's vantage |
| Disputes from across the region are brought to court here. | court · siege | the official's vantage |
| Its council decides matters for the whole region, not only for the city. | ruler: council | a council rules |
| Its lord's decisions reach well beyond the walls. | ruler: lord, walls | a lord rules, walls stand |
| Coin for the region's trade is lent, changed and kept here. | institution: bank | a bank stands |
| Barges from up and down the river unload here. | river, docks · siege | river and docks |
| Ships from along the coast unload here. | coast, docks · siege | coast and docks |
| Its {export} is sold across the region. | exported · siege | its own export good |
| The region's roads meet here, and its trade with them. | route: crossroads · siege | a crossroads |
| The region's trade and its business come to this city {ground}. | terrain · siege | its terrain |
| Students from across the region come here to study. | institution: school · siege | a school stands |
| Prices across the region follow what is paid here. | market · siege | the local's vantage |
| The rules the region's trades work by are set here. | guild | a guild stands |
| Contracts for the region's trade are drawn up and sealed here. | legal house | a legal house stands |
| People from across the region come here to be treated. | hospital · siege | a hospital stands |

## 5. Projected top share (100 places a size; `measures/m3-origins.out.txt`, SUMMARY)

| | thorp | hamlet | village | town | city | metropolis |
|---|---|---|---|---|---|---|
| **today** | 28/100 28% | 25/100 25% | 17/100 17% | 15/100 15% | 100/100 100% | 96/100 96% |
| **projected** | 13/100 13% | 11/100 11% | 7/100 7% | 9/100 9% | 12/100 12% | 14/100 14% |
| distinct sentences, today → projected | 33 → 69 | 33 → 68 | 28 → 46 | 20 → 42 | 20 → 60 | 21 → 55 |

**The commonest projected sentence:**
- thorp 13%: What little the place grows or makes is mostly used at home; there is not much left to sell. (today's index 3)
- hamlet 11%: Every household here has its work, and there is little to spare. (today's index 0)
- village 7%: It stands on the bank, and the current does the hauling; … (today's river row 1)
- town 9%: It stands roadside, where the day is measured in traffic: … (today's road row 2)
- city 12%: A city of this many people eats more than its own fields can grow.
- metropolis 14%: Contracts for the region's trade are drawn up and sealed here. The next ones are at 10%.

**Where the projection approximates the code path** (also printed at the foot of the `.out.txt`):
1. **The atoms are read on the FINAL record.** At step 14 the economy, the roster, the government and the cast are already in hand. Any later pass that changes one of them would differ.
2. **The selection filters first, then hashes.** Today the selection hashes, then walks onward from a refused row. Filtering removes the row-4 lift.
3. **100 places is a small sample.** About 3 places is noise.
4. **Power-of-two lengths are kind to this seed family.** Some eligible lists land on a power-of-two length (38 of 200 lists in a city, 39 in a metropolis). On this seed family, fnv1a32 splits mod 2, 4 and 8 evenly (measured), so the figures at those lengths are, if anything, kind.

## 6. What I could not settle, and what must be ruled

1. **THE BUILD'S SHAPE (the chair's 16:30: a new data file plus ONE call line in `narrativeGenerator.js`).**
   - **The call line:** in `src/generators/narrativeGenerator.js :: generateSettlementReason`, the closing `return lines;` becomes `return variedReasonLines(lines, { tier, route, config: _config, foodBalance, roster, siege: siegeInForce, hasFoodDeficit });`.
   - **What `variedReasonLines` does** (the new file):
     - It re-derives the arm with `originArmKey` and re-picks line 0 only for road, river and crossroads. It hashes over `[today's admitted rows, ...eligible]` with `originVariantKey`.
     - It replaces line 1 for thorp, hamlet, the city with a gap, and the metropolis outside a siege.
     - Everything else is returned as it came.
   - **The one thing this line cannot do alone:** `generateSettlementReason` holds no facts. The caller must hand them as `roster.facts`. That means one argument in `src/generators/steps/generateNarratives.js`: `factsOf` over the step's institutions, config, tier, stress, economicState, powerStructure and npcs. `steps/generateNarratives.js` is not the goals lane's file.
   - **Without that line,** every variant is refused and today's lines stand. **Ruling needed:** accept the second touched line, or name another path for the facts.
2. **What a change by the holding lane could move.** The goals lane holds `narrativeGenerator.js`. From what I read, it touches the people tail: `generateCoherence`, `enrichNpcCoherence`, `withHallCapture` and their `dealGoals`, `drawTies` and `dealRareSecrets` calls. That tail runs in the assembly step's own coherence substream, after `generateNarratives`, and it does not move this field (the writer draws nothing). Only these could move my findings:
   - an edit to `generateSettlementReason`, or to the lines around its `return`, which the call line needs as written;
   - a change to a fact the variants read (the roster, the economy, the government) before step 14.

   The build waits for the commit the chair names.
3. **Pins for the new pools.** `settlementOriginProse.js` law 3 forbids a power-of-two pool length. It was written for static pools. These lists are computed per place. Should the law extend to computed lists, by dropping the last eligible wording when a list lands on a power of two? The measure finds no aliasing on this family. This is the chair's ruling.
4. **The dominance register** (`scripts/census/pool-dominance.register.json`): the new pool ids need rows. That is a re-base, the chair's ruling. The presumption walker's file map needs the new file's row.
5. **The golden master moves** on every born town whose pick leaves index 0. That is the owner's signed door. These seeded text tests are re-keyed by identity, or widened to the variant pool, in the same change:
   - `originRowsRefused` (road pool membership);
   - `bar5WorldLines` (KEEP);
   - `tailNarrativeRows` (`origin(seed)`).
6. **No ATOM is asked.** Every wording reads the vocabulary or the writer's own input (FOOD_IMPORT).
