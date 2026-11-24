# B1(i)'S TABLE: houses that live on a thing the land gives, standing where nothing gives it (CLOSE-7 chain two, phase 1; RULING-R24 R24-B1(i)). A measure; nothing was built.

Measured on V and on C, lit tree `d447ee31e` (clean). The record side is `read25/records.census.jsx`: each birth is born once, and its
record hash equals the page battery's for 900/900 births on each corpus. The join is `read25/b1i-table.mjs`. Every hit (seed, size,
terrain, route, house, thing, source, terrain factor, native nearby resources) is in `read25/V/b1i-hits.tsv`, and the C hits are in
the scratchpad (`READ-25/b1i-hits-C.tsv`).

## The rows I name (from `src/data/institutionalCatalog.js`), each with the thing it lives on
fish: Fishing community, Fisher's landing, Fishmonger, Fish market · timber: Woodcutter's camp, Charcoal burner, Sawmill, Sawmill
(commercial) · game: Hunter's lodge, Furrier's district · wildfowl: Wildfowler · ore: Mine, Mine (open cast), Smelter · stone: Stone
quarry · salt: Salt works · peat: Peat cutter · clay: Potter, Brickmaker · a harbour: Docks/port facilities, Harbour master's office,
Shipyard, River boatyard, River ferry, Barge and river transport company · pasture (the weakest class, listed for the chair to strike):
Shepherd, Shepherd collective, Dairy farmer. Left out: houses that process a thing that is commonly bought in, such as Tanners,
Weavers, Glassblower and Butchers, and Beekeeper.

## How I decide "gives" (my reading, PLAUSIBLE; `b1i-table.mjs :: GIVES`)
A thing is given when ANY ONE of these holds:
- (a) **The terrain** (`config.terrainType`, which in all 900 V births equals `getTerrainType(route, override)`) gives it. I read this
  from `TERRAIN_DATA[terrain]`: its `allowedResources` name the thing, or its `architectureModifiers` rate stone or timber at
  "medium" or higher, or its own modifier table boosts the house for that thing (the desert's "Salt works ×2, Salt deposits").
  fish: coastal, riverside · wildfowl: riverside · timber: coastal, riverside, mountain, forest, hills · game: coastal, forest, hills
  · ore: mountain, hills · stone: coastal, mountain, hills, desert · salt: coastal, desert · peat: riverside · clay: plains, riverside
  · a harbour: coastal, riverside · pasture: plains, riverside, hills.
- (b) **The route** gives it. port gives fish, salt and a harbour; river gives fish, wildfowl, clay and a harbour.
- (c) **The place's native nearby resources** (`nativeSemanticResourceKeys(config)`, the list the draw reads) give it. fish:
  fishing_grounds, river_fish · wildfowl and peat: marshlands (peat also coal_deposits, "Coal or Peat Deposits") · timber:
  managed_forest, shipbuilding_timber, mountain_timber · game: hunting_grounds · ore: iron_deposits, precious_metals,
  gemstone_deposits · stone: stone_quarry · salt: salt_flats, desert_salt · clay: river_clay · a harbour: deep_harbour · pasture:
  grazing_land, alpine_pasture, camel_herds.
"Stands" means the house is on the live roster (`liveInstitutions`).

## THE TABLE, V (900 places)
| row | lives on | coastal | riverside | mountain | forest | plains | hills | desert | bare, all |
|---|---|---|---|---|---|---|---|---|---|
| Fishing community | fish | 0/22 | 0/21 | · | 0/2 | 0/4 | · | · | **0**/49 |
| Fisher's landing | fish | 0/50 | 0/30 | · | 0/1 | 0/10 | · | · | **0**/91 |
| Fishmonger | fish | 0/3 | 0/3 | **1**/1 ×0.70 | · | **1**/2 ×1.30 | **1**/1 ×0.90 | · | **3**/10 |
| Fish market | fish | 0/69 | 0/61 | **20**/20 ×0.70 | **23**/29 ×1.00 | **72**/83 ×1.30 | **55**/55 ×0.90 | **25**/25 ×1.80 | **195**/342 |
| Woodcutter's camp | timber | · | · | · | 0/26 | · | · | · | **0**/26 |
| Charcoal burner | timber | 0/24 | 0/37 | 0/17 | 0/26 | **36**/51 ×1.30 | 0/42 | **12**/13 ×1.80 | **48**/210 |
| Sawmill | timber | 0/5 | 0/7 | 0/3 | 0/4 | **7**/10 ×2.34 | 0/8 | · | **7**/37 |
| Sawmill (commercial) | timber | 0/44 | 0/58 | 0/19 | 0/36 | **49**/63 ×2.34 | 0/38 | **15**/17 ×1.80 | **64**/275 |
| Hunter's lodge | game | 0/5 | **2**/8 ×1.30 | · | 0/6 | **7**/16 ×1.30 | 0/9 | **3**/4 ×1.80 | **12**/48 |
| Furrier's district | game | 0/33 | **19**/41 ×1.30 | **12**/15 ×0.70 | 0/30 | **20**/49 ×1.30 | 0/39 | **13**/15 ×1.80 | **64**/222 |
| Wildfowler | wildfowl | · | 0/1 | · | 0/1 | **1**/1 ×1.30 | **4**/4 ×0.90 | · | **5**/7 |
| Mine | ore | **6**/9 ×1.50 | **5**/26 ×1.30 | 0/13 | **1**/14 ×1.00 | **2**/30 ×1.30 | 0/28 | **1**/6 ×1.80 | **15**/126 |
| Mine (open cast) | ore | **1**/1 ×1.50 | **1**/2 ×1.30 | 0/1 | · | 0/11 | 0/5 | 0/1 | **2**/21 |
| Smelter | ore | **36**/41 ×1.50 | **19**/56 ×1.30 | 0/25 | **4**/29 ×1.00 | **4**/71 ×1.30 | 0/49 | **5**/18 ×1.80 | **68**/289 |
| Stone quarry | stone | 0/28 | **14**/37 ×1.30 | 0/20 | **4**/21 ×1.00 | **17**/48 ×1.30 | 0/48 | 0/10 | **35**/212 |
| Salt works | salt | 0/72 | **27**/27 ×1.30 | · | **6**/6 ×1.00 | **14**/14 ×1.30 | **1**/1 ×0.90 | 0/3 | **48**/123 |
| Peat cutter | peat | **2**/2 ×1.50 | 0/3 | **1**/2 ×0.70 | · | **5**/6 ×1.30 | **2**/6 ×0.90 | **1**/1 ×1.80 | **11**/20 |
| Potter | clay | **39**/48 ×1.50 | 0/59 | **26**/26 ×0.70 | **26**/36 ×1.00 | 0/73 | **58**/58 ×0.90 | **21**/21 ×1.80 | **170**/321 |
| Brickmaker | clay | **38**/47 ×1.50 | 0/50 | **27**/27 ×0.70 | **22**/30 ×1.00 | 0/74 | **52**/52 ×0.90 | **20**/20 ×1.80 | **159**/300 |
| Docks/port facilities | harbour | 0/74 | 0/43 | **5**/5 ×0.70 | **3**/12 ×1.00 | **4**/20 ×1.30 | **8**/8 ×0.90 | · | **20**/162 |
| Harbour master's office | harbour | 0/61 | 0/28 | **1**/1 ×1.00 | **2**/10 ×1.00 | **1**/13 ×1.00 | **8**/8 ×1.00 | · | **12**/121 |
| Shipyard | harbour | 0/54 | · | · | · | · | · | · | **0**/54 |
| River boatyard | harbour | 0/24 | 0/59 | · | 0/12 | 0/14 | · | · | **0**/109 |
| River ferry | harbour | 0/65 | 0/69 | · | 0/8 | 0/18 | · | · | **0**/160 |
| Barge and river transport company | harbour | 0/11 | 0/23 | · | 0/8 | 0/7 | · | · | **0**/49 |
| Shepherd | pasture | **6**/6 ×1.50 | 0/5 | · | · | 0/12 | 0/13 | **1**/1 ×0.90 | **7**/37 |
| Shepherd collective | pasture | · | · | · | · | 0/18 | 0/15 | · | **0**/33 |
| Dairy farmer | pasture | **9**/10 ×1.95 | 0/9 | 0/2 | · | 0/27 | 0/13 | **2**/3 ×0.72 | **11**/64 |

Places holding at least one bare house, by terrain: coastal 64, riverside 63, mountain 38, forest 40, plains 113, hills 85, desert 30; all 433.

Each cell reads **bare**/stands: the places where the house stands and nothing gives its thing, over the places where it stands. ×f is
the terrain half of `getResourceMultiplier` for that row on that terrain (replicated in `b1i-table.mjs`). Of the 956 bare houses, 827
came from the catalogue draw (`source: generated`), 127 from the cascade and 2 from `faction_boost`.

**TOTALS BY ROW, V (bare / stands):** Fish market 195/342 · Potter 170/321 · Brickmaker 159/300 · Smelter 68/289 · Sawmill
(commercial) 64/275 · Furrier's district 64/222 · Charcoal burner 48/210 · Salt works 48/123 · Stone quarry 35/212 · Docks/port 20/162 ·
Mine 15/126 · Hunter's lodge 12/48 · Harbour master's office 12/121 · Peat cutter 11/20 · Dairy farmer 11/64 · Sawmill 7/37 ·
Shepherd 7/37 · Wildfowler 5/7 · Fishmonger 3/10 · Mine (open cast) 2/21 · Fishing community, Fisher's landing, Woodcutter's camp,
Shipyard, River boatyard, River ferry, Barge company, Shepherd collective 0 (the catalogue's route or terrain gates already hold them).

**THE DESERT (52 places), the ruling's case.** Fish market 25/25 bare, Sawmill (commercial) 15/17, Hunter's lodge 3/4. **27 places**
hold one of the three bare (READ-24 counted 28: dp-village-129's Hunter's lodge stands beside `hunting_grounds`, so it keeps its
house under the ruling's rule). The 27: dp-city-17, -20, -54, -55, -65, -77, -80, -113, -127, -149; dp-metropolis-19, -30, -70,
-90, -93, -98, -117, -143; dp-town-39, -45, -117, -118, -128, -129, -147; dp-hamlet-136; dp-village-67 (cascade). The desert also
holds bare Potters 21/21, Brickmakers 20/20, Furrier's districts 13/15, Charcoal burners 12/13 and Smelters 5/18. Thirty of the 52
desert places hold at least one bare house of the table.

## C (900 places, all plains and road), the same rows
| row | plains: bare/stands |
|---|---|
| Fish market | **362/362** |
| Sawmill (commercial) | 152/320 |
| Furrier's district | 120/252 |
| Charcoal burner | 117/275 |
| Stone quarry | 86/233 |
| Sawmill | 31/48 |
| Hunter's lodge | 31/62 |
| Smelter | 25/304 |
| Peat cutter | 23/34 |
| Fishmonger | 13/13 |
| Salt works | 13/13 |
| Wildfowler | 7/9 |
| Mine | 6/168 |
| Mine (open cast) | 3/35 |
| Potter, Brickmaker, the pasture rows, the harbour rows | 0 |

507 of the 900 C places hold at least one bare house.

## WHAT THE TABLE SAYS TO THE CURE'S FORM (for the chair's ruling)
1. **THE FAULT IS NOT THE DESERT'S ALONE.** A fish market with no water stands in **every one of the 362 C places that hold one**. On V
   it stands bare in 72 of 83 plains places, 55/55 hills, 20/20 mountain and 23/29 forest, besides 25/25 desert. The plains (C) cannot be
   cured on the terrain's table without moving C, and the ruling requires C byte-identical. So a cure held to C byte-identical cures the
   named non-plains terrains only. Plains fish markets, sawmills and hunter's lodges with no water, wood or game stay. **This is the
   ruling's premise read wider, not refuted: the desert count it names is true (27, see above). The chair rules which terrains are
   named.**
2. **The "gives" reading decides the clay and harbour rows.** The Potter and Brickmaker counts (170 and 159 bare on V) come only from
   my reading that clay is given on plains and riverside alone. The harbour rows' bare counts (Docks 20, Harbour master 12, outside the
   coast and the river) stand where the route is neither port nor river and no deep_harbour is near. The chair may strike those
   classes.

## HOW `getResourceMultiplier` COMBINES (read whole; `src/generators/steps/assembleInstitutions.js :: getResourceMultiplier`, CONFIRMED)
`multiplier = 1`; then **× every terrain modifier** in `TERRAIN_DATA[terrain].institutionModifiers` that matches the house by a shared
tag or by its `name` as a substring of the house's name; then **× every resource boost**: for each native nearby resource, ×
`1 + (boost − 1) × tierScale` for each `RESOURCE_DATA[res].instBoosts` key that is a substring of the house's name, and the same for
the step's own `EXTRACTION_BOOSTS` table (fishing_grounds → fish market 1.8, river_fish → fish market 1.6, hunting_grounds →
hunter's lodge 2.5, …); then `Math.min(multiplier, 5)`. **It is one product. A terrain row of 0 makes the product 0, whatever the
resources give, so a 0 row would also kill the resource's boost. That is the outcome the ruling calls wrong (CONFIRMED by read).**
To keep "a place whose resources or route give it keeps its plain chance", the zero must be conditional: the row must not apply where
a named resource or route is present. The function does not take the route today (`rowEnvironment` holds `tradeRoute`, but
`rowRoll` passes only tags, name, resources, modifiers and tier). The cure must also say which chance a resource-given house keeps:
the plain catalogue chance, as the ruling says, or the product with the terrain's other rows (the desert's trade ×1.8 still applies
today).

**Does a zero chance shift another house's draw?** (CONFIRMED by read)
- A plain row (no exclusive group) draws with `drawRng.chance(baseChance * resourceMult)`. `kernel/prng.js`: `chance: (p) =>
  _rng() < p` draws even at p = 0. **The draw is still made.**
- An EXCLUSIVE-GROUP member is dropped from the candidates when `roll.drawn` is false, and `drawn` is `baseChance * resourceMult > 0`.
  A zero there changes the group's fill chance, and with no candidates left the group's `rng.random()` is not taken. **None of the
  three named rows carries an exclusive group** (read from the catalogue), so this path is not touched for them. It would be for any
  row added later that has one.
- `exemptHouseExpectation` (the density budget) sums p over density-exempt rows only. Fish market, Sawmill, Sawmill (commercial) and
  Hunter's lodge are not exempt at any tier (`isDensityExempt`: false), so their p never enters the budget. Salt works at village is
  exempt.
- What follows a lost house (phase 2 must measure it, not assume): the cascade boosts its chain neighbours from the houses present,
  the services roll each live house's menu, and every later step reading the roster (economy chains, NPCs, prose) runs after.

## THE CASCADE'S PATH (`src/generators/cascadeGenerator.js :: applyCascadeInstitutions`, read whole, CONFIRMED)
**It does not read `getResourceMultiplier`, the terrain modifier table or the nearby resources at all.** Its chance is
`min(baseChance(× density) × chainBoost, 0.45)`, where `chainBoost` (1.15 to 1.55) comes from a present house's supply-chain
neighbours. Its terrain reads are the gates `terrainRequired`, `tradeRouteRequired`/`terrainAccess` and `forbiddenTradeRoutes`, none
of which these rows carry. It draws `_rng() < cascadeChance` for every candidate that passes the gates, so a chance of 0 still takes
the draw. The cascade placed 127 of the 956 bare houses on V, among them the desert Fish market of dp-village-67 and the Hunter's lodge
of dp-town-118. For the cascade to obey the same rule, it must read the same conditional terrain row (and the place's resources and
route), which it reads nothing of today.

## Two side findings (not B1(i)'s question, CONFIRMED by read and by the factors in the table)
- The desert's own table boosts every `trade`-tagged house ×1.8, the three named rows among them. READ-24's statement that the
  desert's modifiers touch none of their tags is false (see READ-25.md).
- The name match is a substring match. So the plains' grain row `{ name: 'Mill', modifier: 1.8, reason: 'Grain processing' }` and
  the riverside's `{ name: 'Mill', modifier: 2 }` also match "Sawmill" and "Sawmill (commercial)". The plains therefore stand a sawmill
  at ×2.34 (trade 1.3 × Mill 1.8), the highest factor in the table, on land the ruling's own reading says gives no timber (C: 152 of
  320 commercial sawmills bare). The ratchet `tests/data/terrainInstitutionModifiersReachable.test.js` forbids two NAMED rows matching
  one house in a terrain. It does not catch this case, because the plains hold no "Sawmill" row.
