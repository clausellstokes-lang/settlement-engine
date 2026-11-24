# PROPOSAL: `spatialLayout.quarters[].desc` (PEOPLE-1 seat M2, 2026-11-20)

Base `b53a665e7` (the briefs commit; its parent is the working line `43ab0f5eb`, and the briefs commit touches only `docs/`). Measured on 100 places a size, six sizes, born exactly as the chair's stored-census instrument births them (`hxd-<size>-<i>`, `generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType }), null, { seed, customContent: {} })` after `loadGenerationLawPayloads()`; own names masked to `#`, digits to `0`).

Instruments (each run's count lines beside it):
- `measures/m2-quarters-births.mjs` → `m2-quarters-births.out.txt` (births a JSON of each place's facts into the scratchpad; not committed: it is the births).
- `measures/m2-quarters-pools.mjs`: the proposed wordings, the script-side mirror of the proposed data file `src/data/quarterDescPools.js` (not written).
- `measures/m2-quarters-measure.mjs` → `m2-quarters-measure.out.txt`: today's shares, branches, false presumptions and crisis reads; the projection; a sample.

Re-run: `node m2-quarters-births.mjs <worktree> 100 <births.json>`, then `node m2-quarters-measure.mjs <worktree> <births.json>`.

## 1. The function

`src/generators/spatialGenerator.js :: generateSpatialLayout(tier, institutions, tradeRoute, terrainType)`, called once, from `src/generators/steps/economyReconcilePass.js` (step 3, "Spatial layout + services from the FINAL roster"). It builds `quarters[]` by keyword gates over the roster's raw names (`has(keyword)`: a case-sensitive substring test over `instNames`). Each quarter carries one fixed `desc`. Only three are declared through `textOf`, and `textOf` only carries a declaration. It does not enforce one.

| Quarter (branch) | Condition, in a sentence | `desc` today |
|---|---|---|
| Market Quarter | a roster name contains `Market` (capital M; in practice "Market square", so towns only) | "Bustling center with merchant stalls, hawkers, and crowds" (declares `excludes: crisis: threat, plague_onset`, `crisis: any`) |
| Religious Quarter | a name contains `church`, `Cathedral` or `monastery`. **"Access to parish church" contains `church`**, so every thorp and hamlet that only has access to a church gets this quarter | "Houses of worship, cloisters, quiet streets with priests and pilgrims" (declares `excludes: crisis: unrest`) |
| Roadside Shrine | else-branch: a `shrine`/`Shrine` and none of the above | "A simple marker or cairn where travellers leave offerings" |
| Noxious Trades Quarter | a name contains `Tanner` (so "Tannery" too), `Butcher` or `Slaughter` | "Smelly, dirty area with tanneries, butchers, and dyers" |
| Waterfront District (maritime / river) | a dock name (`/docks\/port\|major port\|harbou?r\|shipyard\|wharf/i`) and route `port`/`river`. The branch is `worldLaw.supportsMaritime()` | maritime "Warehouses, docks, sailors, longshoremen, salt, and fish"; river "Warehouses, wharves, barges, dockworkers, and river traffic" |
| Alehouse & Common | tier `hamlet` and `Alehouse`/`alehouse`/**`Wayside inn`** | "The alehouse and a scrap of common ground: the social heart of the settlement" |
| Fishing Landing | `Fishing community`/`fishing` | "Nets, drying racks, upturned boats, and the perpetual smell of salt and fish" (declares `needs: coast`) |
| Woodcutters' Ground | `Woodcutter` | "Stacked timber, sawdust paths, and sheds for tools and sleds" |
| Artisan Quarter | `craft`, or `guild` with no `Merchant` anywhere on the roster | "Workshops, guild halls, apprentices learning trades" |
| Government Quarter | `Palace`, `City hall` or `Courthouse` | "Official buildings, courts, administrative offices" |
| Mages' Quarter | `Wizard`, `Mage` or `Magic` | "Towers, arcane shops, strange lights and sounds at night" (declares `needs: magic`) |
| Shadows District | `Thieves`, `criminal` or `Black market` | "Narrow alleys, hidden markets, criminal activity" |
| Wealthy Residential / Common Residential | tier `city` or `metropolis`, always | "Stone townhouses, private gardens, clean streets" / "Dense timber tenements, narrow streets, crowded" |

So the place's quarters come from its **institutions by raw name**, plus its **tier** (the two residential quarters, and the hamlet-only Alehouse gate). The **route** gates the waterfront, and the world law picks its branch. Terrain does not reach a quarter. The quarter set re-derived from the final record's roster agreed with the stored set in **600 of 600** births (`m2-quarters-births.out.txt`), so the facts read off the final record are the facts the step saw.

## 2. Today's shares (100 places a size)

Top sentence by size, over the places holding the field:

| size | places holding quarters | top share | the sentence |
|---|---|---|---|
| thorp | 90 | **79/90 = 88%** | "Houses of worship, cloisters, quiet streets with priests and pilgrims" |
| hamlet | 100 | **100%** | same |
| village | 100 | **100%** | same |
| town | 100 | **100%** | "Bustling center with merchant stalls, hawkers, and crowds" (and the Religious line, also 100%) |
| city | 100 | **100%** | Religious line. The Noxious, Government, Wealthy and Common lines are also at 100% |
| metropolis | 100 | **100%** | same |

By quarter type: every type prints one sentence to 100% of the places holding it, except the Waterfront (two branches: 52–60%). Branch sizes (places), from `BRANCH` lines:

| type | thorp | hamlet | village | town | city | metro |
|---|---|---|---|---|---|---|
| Religious (access only / church) | 79 / 0 | 100 / 0 | 0 / 100 | 0 / 100 | 0 / 100 | 0 / 100 |
| Market | – | – | – | 100 | – | – |
| Noxious Trades | – | – | 11 | 76 | 100 | 100 |
| Waterfront (maritime / river) | – | – | – | 14 / 12 | 21 / 23 | 15 / 25 |
| Government | – | – | – | 49 | 100 | 100 |
| Artisan | – | – | – | 24 | 5 | 1 |
| Mages' | – | – | – | 4 | 77 | 96 |
| Shadows | – | – | – | – | 91 | 100 |
| Wealthy / Common Residential | – | – | – | – | 100 / 100 | 100 / 100 |
| Fishing Landing (coast / inland) | 14 / 24 | – | – | – | – | – |
| Woodcutters' Ground | 8 | 7 | 19 | – | – | – |
| Alehouse & Common (alehouse / inn only) | – | 27 / 7 | – | – | – | – |
| Roadside Shrine | 3 | – | – | – | – | – |

Each place holds a quarter once, so entries = places.

**The false presumptions today** (`FALSE` lines; places holding the quarter whose record lacks the word's fact, read off the fact home):

- **Religious Quarter, thorp 79/79 and hamlet 100/100.** No church stands (the faith home: `hasChurch` false, `accessOnly` true; the roster holds "Access to parish church"). Yet the line prints "Houses of worship", "cloisters", "priests" and "streets" (a size word in a thorp or a hamlet). Villages: "cloisters" false in 100/100 (a parish church, no monastery). Towns: 84/100. Cities: 49/100. Metropolises: 6/100. "Pilgrims" has no fact home anywhere.
- **Noxious Trades:** "dyers" false in village 11/11, town 59/76, city 34/100, metro 4/100. "butchers" false in village 11/11, town 30/76, city 17/100, metro 8/100. "tanneries" false in town 15/76 and city 3/100.
- **Waterfront:** "Warehouses" false in town 13/26. "salt" (maritime) where no salt works stands: town 2, city 4, metro 2.
- **Mages':** "Towers" false in city 44/77 and metro 95/96 (no wizard's tower). "arcane shops" false where no enchanter's shop stands: town 4/4, city 40/77, metro 7/96.
- **Shadows:** "hidden markets" false where no black market stands: city 7/91, metro 47/100.
- **Fishing Landing:** the coast line (it declares `needs: coast`) prints in 24 of 38 thorps that are not on the coast (riverside 17, plains 4, forest 3, all on a river by the water home).
- **Alehouse & Common:** "The alehouse" prints in 7 of 34 hamlets whose only house is a Wayside inn.
- **None** for Market (market 0), Government (court sits 0) and Artisan (guild 0).

**Does a guard already catch them? No, it banks them.** `tests/lint/presumedThings.widened.register.json` holds the Religious line under `religiousHouses` and `clergy` (reason `word`). It also holds Noxious, Waterfront, Alehouse, Wealthy and Common rows. `tests/lint/presumptionClasses.register.json` holds the Religious line twice: `outside/one-kind`, and `size/other` (streets below a village). It also holds Shrine, Common Residential and Shadows rows. Both registers only shrink, so they tolerate these lines; they do not refuse them. The census declaration (`docs/census/declarations/SPATIAL_TEXT.json`) records the Religious key guarantee as "roster holds church / Cathedral / monastery". The raw `has('church')` test satisfies that guarantee through an *access* row. So the ledger believes a temple stands where none does.

**The crisis-scoped texts today** (`CRISIS` lines, declared and not enforced): the Market line prints under threat or plague_onset in 6 of 100 towns. The Religious line prints under unrest in thorp 4, hamlet 6, village 6, town 6, city 4 and metro 3. This proposal keeps both lines' law exactly. Index 0 keeps its declaration, unenforced as today. The new "quiet" lines take the same `excludes: crisis: unrest`, and the projection applies it to them only (projected: 0 quiet new lines under unrest; one metropolis still prints today's index-0 line under unrest, as today). The new Market lines carry the same `excludes` as M0, unenforced like M0 (projected: the same 6 towns).

## 3. The readers

| path :: symbol | kind | what breaks if the words change |
|---|---|---|
| the stored record `spatialLayout.quarters[].desc` (spread onto the hashed settlement in `steps/assembleSettlement.js`) | STORED | nothing at render: a saved town keeps its sentence. A new birth prints the new one |
| `src/domain/display/publicSafe.js :: PUBLIC_TOPLEVEL_KEYS` (`spatialLayout`) | PRINTS (the public share payload carries the record's quarters) | none (the text travels as is) |
| `src/pdf/lib/viewModel.js` (overview and identity `quarters[].description`) | COMPOSES (kept for the plat; `Overview.jsx` and `IdentityDailyLife.jsx` print no quarter, X-47) | none; `tests/pdf/quartersNotPrinted.test.jsx` checks quarter NAMES only |
| `src/domain/districtProfile.js :: inferSensoryIdentity` | COMPOSES ("<desc> — landmarks: …") into `sensoryIdentity`, which `src/domain/explanation.js :: explainDistrict` (`profile.sensoryIdentity`) and `src/domain/causalViews.js :: viewDistrict` carry. No component renders it | none (the text is carried through) |
| `src/domain/districtProfile.js :: inferCategory` | MATCHES (regex over name, desc and landmarks) only for names NOT in `QUARTER_CATEGORY`. Every generator quarter is in it | none for generator quarters. The comment at `CATEGORY_PATTERNS` quotes "Dense timber tenements" (history only) |
| `src/components/new/SummaryTab.jsx` | prints name, location and landmarks, not `desc` | none |
| `src/generators/aiLayer.js` | quarter NAMES only | none |
| `tests/generators/spatialGenerator.test.js` (waterfront gate, `toMatchObject desc: 'Warehouses, wharves, barges, dockworkers, and river traffic'`) | MATCHES ITS WORDS (a seedless call) | none if a seedless caller keeps index 0 (canonical-at-zero, §6 R1) |
| `tests/domain/districtProfile.test.js` (fixtures carrying the Noxious, Shadows, Wealthy and Common texts) | fixtures, not births | none |
| `docs/census/declarations/SPATIAL_TEXT.json` + `tests/domain/facts/census2dTables.test.js :: inlineArm('SPATIAL_TEXT', 'src/generators/spatialGenerator.js', …)` | MATCHES ITS WORDS: every declaring ledger line must be found declared IN `spatialGenerator.js`, exactly | **breaks** if the declared index-0 lines move to the new data file: the ledger's `source` and the arm's file must move with them, and every new wording needs a ledger row |
| `tests/domain/facts/census2eTables.test.js` (`SPATIAL_QUARTER_CRISIS_SCOPED` = the ledger's scoped pools) | MATCHES the crisis flags | breaks only if a new pool is flagged crisis-scoped without a calm line |
| `tests/lint/presumedThings.walker.test.js` + `presumedThings.register.json` / `.widened.register.json` (rows on the Religious, Noxious, Waterfront, Artisan, Shadows, Alehouse, Wealthy and Common lines) | MATCHES ITS WORDS (arm 1: source literals. Arm 2: a corpus of 360 births) | a cured line leaves a **stale row** (red until the round's close shrinks it through `scripts/presumed-things-door.mjs --shrink`). Every new literal naming a thing must declare its atom through a **door** (`drawDeclared`, not `textOf`), or it reds as new |
| `tests/lint/presumptionClasses.walker.test.js` + `presumptionClasses.register.json` (Religious ×2, Shrine, Common, Shadows rows) | MATCHES ITS WORDS (class words: size `streets/lanes/alleys/tenements`, ease `quiet/clean/busy`) | stale rows to shrink. Each new line's class word needs its answering atom (`tier: ≥ village` for streets and lanes, the unrest exclude for quiet). The ceiling only falls |
| `tests/joins/labelJoins.test.js` (`spatialGenerator.js: 8`) | counts label-join sites | **breaks** if the new reads add `instNames.some/filter(` sites. Read houses by fact home or catalogue id (the file's own comment above `holds`) |
| `tests/property/generatorGoldenMaster.test.js` | hashes the whole record | **moves** (a declared golden move, signed in the integrating commit; precedent `docs/shift-records/2026-09-19-religious-quarter-text.json`) |
| `src/domain/generation/generationForkRegistry.js` (`economyReconcilePass → spatialLayout`, class `pure`, keyMoves 0) | the fork census | a keyed-hash choice is a hash channel (no rng draw). The census's hash-channel count moves and is re-recorded |
| `scripts/audit/soak-review/*` (repetition registers) | MEASURES repetition | the referee (§7 of the wiring rulings): the quarter frames' repeat rate should fall |

Who PRINTS the desc on a page today: **no visible surface.** The PDF, the Foundry journal and the Overview dropped quarters before the plat (X-47). The text lives in the record, the public share payload, the view model and the district profile's `sensoryIdentity`. It is still the record's sentence, and it reaches the plat when the plat lands.

## 4. The candidate wordings, by branch

Rules for every wording below:
- **Selection:** the branch's wordings whose declared facts hold, chosen by `pickVariant(eligible, \`${seed}|quarters.${name}.desc\`)`.
- **Slots:** a `{houses}` slot names houses that STAND, k of them, chosen by keyed hash on `${key}|<tag>` and printed in the table's order. No rng draw anywhere.
- **Index 0:** today's exact string, declared with what its words truly need, so a seeded birth prints it only where it is true. A seedless caller prints index 0 unconditionally (§6 R1).

The house words come from the place's own roster rows, through its fact home where one exists. Every line is a description-position line: plain, a list of what stands, with no flavour beyond today's. Full text of every wording: `measures/m2-quarters-pools.mjs` (`POOLS`).

**Religious Quarter, church branch (village and larger).** The facts are the faith home's `churchWords` ("a parish church", "parish churches and a monastery", "a great cathedral, parish churches and monasteries"), the monastery and hospital kinds, and the roster's burial row (Graveyard / Parish burial grounds / Burial grounds and charnel house / Cemetery network).
- R0 (today's line): needs `church`, `institution: monastery`.
- R1 "{Churches}, and quiet streets around them" (church; excludes unrest)
- R2 "{Churches}, and the houses of their clergy" / "A parish church, and the priest's house beside it" (church, clergy)
- R3 "{Churches}, with the {burial} beside them" (burial)
- R4 "Quiet streets about {churches}, where the {town} comes to worship"
- R5 "{Churches}, the {burial}, and the quiet lanes between"
- R6 "{Churches}, and the cloister(s) behind the monastery walls" (monastery)
- R7 "…, with the hospital close by" (hospital)
- R8 "Where the {town} worships: {churches}, and the streets around them"
- R9 "{Churches}, and the {burial} where the {town} buries its dead"
- R10 "{Churches}, the priest's house / the clergy's houses, and the lanes around"
- R11 "{Churches}, their yards the quietest ground in the {town}"
- R12 "Houses of worship: {churches}, and the quiet streets between" (more than one house)
- R13 "{Churches}, the monastery set a little apart" (monastery)
- R14 "…, and the priest going about the parish" / "…, and the clergy going between them"
- R15 "The {town}'s worship centres here: {churches}"
- R16 "{Churches}, and the {burial} behind a low wall"

Why of THIS place: the line names exactly the houses the faith home reads. A village with one parish church gets one parish church and its priest. A metropolis gets "a great cathedral, parish churches and monasteries". Cloisters appear only where a monastery stands.

**Religious Quarter, access branch (thorp, hamlet: no church stands; the people use a neighbour's).** Today's line cannot be eligible here (§6 R2). The facts are the faith home's `accessOnly` and `shrine`, its road reading (`roadBarred` under siege, `quarantined` under plague: no line about walking to the church then), and the burial row ("Burial ground", on every thorp and hamlet).
- A1 "No church of its own; the people walk to a neighbour's parish church"
- A2 "A wayside shrine, and the path to a neighbour's parish church"
- A3 "A wayside shrine; the nearest church is a neighbour's"
- A4 "The burial ground; for a church, the people go to a neighbour's parish"
- A5 "No church and no priest here; a neighbour's parish church serves the {hamlet}"
- A6 "The {hamlet} keeps no church; its people go to the next parish to worship"
- A7 "A neighbour's parish church serves the {hamlet}; the burial ground is its own"
- A8 "Worship means a walk to a neighbour's parish church"
- A9 "The {hamlet}'s dead lie in its own burial ground; the living walk to a neighbour's church"
- A10 "Holy days mean the walk to a neighbour's parish church"
- A11 "No house of worship stands here; the parish church is a neighbour's"
- A12 "The shrine at the {hamlet}'s edge is its only holy place; the parish church is a neighbour's"
- A13 "The {hamlet} has no church; its parish church stands in a neighbouring place"
- A14 "Only the burial ground; the {hamlet}'s church is a neighbour's"
- A15 "No priest lives in the {hamlet}; its people go to a neighbour's parish church"

These carry no streets, no priests and no cloisters, and the calm place stays calm. The access-branch lines overlap in meaning with the faith panel's own access sentence. The integrator should read them side by side (§6 R7).

**Market Quarter (towns).** Today M0. Every town has a weekly market and a market square; the "also" houses that stand are the fish market (45), merchants' warehouses (46), merchant guilds (65), annual fair (38) and money changers (4).
- M1 "The market square and its stalls, busiest on market day"
- M2 "The market square, where the weekly market sets up its stalls"
- M3 "Stalls and carts on the market square, {also}"
- M4 "The market square, {also1} and {also2}"
- M5 "Stalls, carts and buyers on the square, and {also}"
- M6 "Merchant stalls round the square, and {also}"
- M7 "The market square, the guild halls, and the traders' stalls between" (guild)
- M8 "Where the {town} buys and sells: the square, its stalls, and {also}"
- M9 "Carts unloading at the market square, and {also}"
- M10 "Traders' stalls, {also1} and {also2}"

{also} is one of: the fish market at one end · the merchants' warehouses close by · the merchant guilds' halls · the ground where the annual fair is held · the money changers' tables. Every Market line keeps M0's `excludes`.

**Noxious Trades.** Today N0, needs tannery, butcher and dyer. {trades} names up to three that stand: a tannery / tanneries · butchers' yards · the slaughterhouse · the dyers' vats · the fullers' troughs.
- N1 "{Trades}, kept downwind of the houses"
- N2 "The stink of {trades}, downwind of everything else"
- N3 "{Trades}, and the smell that comes with them"
- N4 "{Trades}, downstream of the drinking water" (river)
- N5 "Smelly, dirty work: {trades}"
- N6 "{Trades}, at the edge where no one else wants to live"
- N7 "Tanning pits and hides drying on frames, downwind of the {village}" (a lone tannery)

**Waterfront, maritime.** Today W0, needs warehouse and salt works. {houses}: warehouses · the customs house · the harbour master's office · the fish market · a chandler's · the ropewalk · the shipyard · the boatyard · the salt works · the ferry landing.
- Wm1 "The docks, {h1} and {h2}, and sailors ashore between voyages"
- Wm2 "Quays and docks, with {houses}"
- Wm3 "{Houses} along the harbour, and ships at the docks"
- Wm4 "The harbour front: docks, {houses}"
- Wm5 "Docks, with {houses}, busy when the ships are in"

**Waterfront, river.** Today W0, needs warehouse.
- Wr1 "Wharves along the river, with {houses}"
- Wr2 "The river wharves, {houses}, and barges tied up along the bank"
- Wr3 "Barges at the wharves, and {houses} along the bank"
- Wr4 "The riverside: wharves, {houses}"
- Wr5 "Wharves along the bank, with {houses}, busy when the barges come in"

**Government.** Today G0, needs court sits. {houses}: the palace · the town/city hall · the courthouse / the court buildings · the customs house · the mint.
- G1 "{H1} and {h2}, and the offices around them"
- G2 "Where the {town} is governed: {houses}"
- G3 "Official buildings: {houses}"
- G4 "The seat of the {town}'s government: {houses}"
- G5 "{Houses}, with clerks and petitioners coming and going"
- G6 "{The courthouse} and the offices that keep the {town}'s business"
- G7 "Halls and offices: {houses}"
- G8 "{Houses}, and the clerks' offices between"
- G9 "The {town}'s business is done here: {houses}"
- G10 "{The courthouse}, busy on court days, and the offices beside it"
- G11 "{Houses}, with petitioners waiting at the doors"

**Mages'.** Today X0, needs a wizard's tower and an enchanter's shop. {houses}: a wizard's tower · the mages' guild · the academy of magic · the great library · the alchemists' workshops · the enchanter's shop · the sages' houses · the scroll scribes.
- X1 "{Houses}, kept apart from the rest of the {city}"
- X2 "Arcane work set apart: {houses}"
- X3 "{Houses}, at a careful distance from the houses"
- X4 "Spellwork and study: {houses}"
- X5 "{Houses}, and the shops that supply them"

"Strange lights and sounds at night" stays in index 0 only.

**Shadows.** Today S0, needs a black market and organised crime. {houses}: the black market · gambling halls · brothels · the smugglers' stores · the thieves' guild's haunts · the stairs down to the underground city · shops that serve as fronts · the rival gangs' haunts.
- S1 "Narrow alleys around {houses}"
- S2 "Narrow alleys and crooked lanes: {houses}"
- S3 "{Houses}, and the narrow alleys between them"
- S4 "Where the {city}'s crime does its business: {houses}"
- S5 "{Houses}, out of sight of the better streets"

**Artisan.** Today Z0, needs guild. {crafts}: smiths' forges · carpenters' shops · a cooper's yard · a potter's kiln · weavers' looms · glassblowers · bowyers and fletchers · cobblers · tailors.
- Z1 "Workshops: {crafts}"
- Z2 "{Crafts}, and the guild halls" (guild)
- Z3 "{Crafts}, with apprentices at the benches"
- Z4 "Workshops and guild halls: {crafts}" (guild)
- Z6 "The sound of work from {crafts}"
- Z7 "{Crafts}, their shops open to the street"
- Z8 "Workshops run by guild masters: {crafts}" (guild)

**Woodcutters' Ground.** Today D0.
- D1 "Stacked timber and the woodcutters' sheds"
- D2 "Timber stacked to season, and the woodcutters' tools under cover"
- D3 "The sawmill, and timber stacked beside it" (sawmill)
- D4 "Stacked logs and the charcoal burner's clamps" (charcoal burner)
- D5 "Log piles, chip-strewn paths and the woodcutters' sheds"
- D6 "Timber stacks at the forest edge, and the sheds where the axes are kept"
- D7 "Felled timber, and the carpenter's workshop beside it" (carpenter)
- D8 "Felled trunks waiting to be cut, and a shed for the saws and sleds"
- D9 "Logs dragged down to the sawmill, and planks stacked to dry" (sawmill)
- D10 "Cut timber in stacks, and the sheds where the tools and sleds are kept"

**Fishing Landing, coast branch.** Today F0, needs coast.
- F1 "Boats drawn up on the shore, nets hung to dry"
- F2 "Nets drying on racks above the tideline, and the boats beside them"
- F3 "Upturned boats and drying racks, and the smell of fish and salt"
- F4 "The landing where the boats come in, and fish drying on racks in the wind"
- F5 "A landing on the shore, boats hauled up, nets spread to mend"
- F6 "Boats on the beach, nets hung on poles, and fish laid out to dry"

**Fishing Landing, inland branch.** Today's line is not eligible here (needs coast).
- Fi1 "Boats pulled up on the riverbank, nets hung to dry"
- Fi2 "Drying racks and upturned boats along the riverbank"
- Fi3 "The landing where the river boats come in, nets spread to dry"
- Fi4 "Nets, drying racks and the smell of fish by the river"
- Fi5 "Fish traps and nets at the river's edge, the boats drawn up beside them"
- Fi7 "A muddy landing on the river, boats tied up and nets on poles"
- Fi8 "Boats and nets on the riverbank, and fish split and drying on racks"
- Fi9 "Small boats on the bank, and nets drying beside them"
- Fi6 (no coast, no river) "Nets, drying racks and boats drawn up at the water's edge"

All Fi1–Fi5 and Fi7–Fi9 need `river`.

**Alehouse & Common, alehouse branch.** Today H0.
- H1 "The alehouse and the common beside it, where the hamlet meets"
- H2 "The alehouse, the common, and the grazing beyond" (common grazing)
- H3 "A patch of common ground, and the alehouse where the hamlet gathers of an evening"
- H4 "The alehouse at the centre, and the common where the animals graze" (common grazing)
- H5 "Where the hamlet meets: the alehouse and the common"
- H6 "The alehouse, and the trodden common in front of it"
- H7 "The common grazing and the alehouse beside it, the hamlet's one meeting place"

**Alehouse & Common, inn-only branch.** Today's line is not eligible here.
- I1 "The wayside inn and a scrap of common ground, where the hamlet meets travellers"
- I2 "The wayside inn on the road, and the common beside it"
- I3 "The common, and the wayside inn where the hamlet hears the news from the road"
- I4 "The wayside inn, and the common grazing behind it"

**Roadside Shrine.** Today P0.
- P1 "A wayside shrine at the edge of the thorp, where passers-by stop"
- P2 "A simple shrine by the path, small offerings left at its foot"
- P3 "A cairn and a shrine, kept clean by the households nearby"

**Wealthy Residential.** Today L0, needs nothing. {also}: the theatre · the public baths · the banking houses · the merchant guilds' halls.
- L1 "Stone townhouses and walled gardens near {also}"
- L2 "The merchant families' townhouses, with {also} close by" (merchant guild)
- L3 "Stone houses behind garden walls, and {also}"
- L4 "Townhouses of stone, {also1} and {also2} a short walk away"
- L5 "Stone townhouses on the high ground, with {also} close by"
- L6 "The {city}'s finest houses, and {also}"
- L7 "Large stone houses with gardens behind them, close to {also1} and {also2}"
- L8 "Clean streets of stone townhouses, and {also}"
- L9 "Walled gardens and stone townhouses, a short way from {also}"
- L10 "The {city}'s larger houses, in stone, near {also1} and {also2}"

**Common Residential.** Today C0. {also}: bakers' ovens at the corners · public fountains on the water system · the public baths · a market most days · the fish market.
- C1 "Crowded timber tenements and narrow streets, with {also}"
- C2 "Tenements packed close along narrow streets; {also1} and {also2}"
- C3 "Where most of the {city} lives: timber tenements, narrow streets, {also}"
- C4 "Timber tenements, crowded yards, narrow streets, and {also}"
- C5 "Narrow streets of crowded tenements, and {also}"
- C6 "Crowded timber tenements, with {also1} and {also2}"
- C7 "Narrow streets, timber houses packed close, and {also}"
- C8 "Tenements of timber, crowded and close; {also1} and {also2}"

Every pool would live in ONE new data file, `src/data/quarterDescPools.js`. Each row is `{ text | template, needs, excludes, crisis }`; the item tables live beside it. `spatialGenerator.js` would read it, through `drawDeclared` with `draw: (p) => pickVariant(p, key)` (the precedent: `steps/institutionDescDraw.js`).

## 5. Projected top share by size (the projection, 100 places a size)

| size | today | projected | commonest projected sentence |
|---|---|---|---|
| thorp | 88% (79/90) | **13%** (12/90) | "The thorp keeps no church; its people go to the next parish to worship" |
| hamlet | 100% | **13%** | "Only the burial ground; the hamlet's church is a neighbour's" |
| village | 100% | **12%** | "A parish church, the priest's house, and the lanes around it" |
| town | 100% | **13%** | "The market square, the guild halls, and the traders' stalls between" |
| city | 100% | **11%** | "Narrow alleys, hidden markets, criminal activity" (index 0, where true) |
| metropolis | 100% | **14%** | "Dense timber tenements, narrow streets, crowded" (index 0) |

Per quarter type, projected top share (today 100% everywhere, the Waterfront 52–60%):
- **Religious:** thorp 15%, hamlet 13%, village 12%, town 11%, city 6%, metro 10%
- **Market** (town): 13%
- **Noxious:** village 27% (n=11), town 5%, city 8%, metro 12%
- **Waterfront:** town 12%, city 9%, metro 13%
- **Government:** town 14%, city 8%, metro 8%
- **Mages':** town 50% (n=4), city 5%, metro 6%
- **Shadows:** city 12%, metro 6%
- **Artisan:** town 17% (n=24), city 20% (n=5), metro 100% (n=1)
- **Wealthy:** city 9%, metro 6%
- **Common:** city 9%, metro 14%
- **Fishing** (thorp): 13%
- **Woodcutters:** thorp 25% (n=8), hamlet 29% (n=7), village 21% (n=19)
- **Alehouse** (hamlet): 15%
- **Shrine** (thorp): 33% (n=3)

Every type the bar can read at n ≥ 30 is at or under 15%. The types over it are those of fewer than 25 places, where one place is 4–33%. **Projected false presumptions: none of §2's.** Every slot names only houses that stand, and every index-0 line prints only where its words are true. No birth fell through to a fallback (`NONE` = 0).

**Where the projection approximates the real code path:**
- (a) **Facts at the step.** The facts are read off the FINAL record. The step sees the roster at `economyReconcilePass`, but the quarter set agreed 600/600. The crisis is read off the final record's container; whether `ctx` carries the stress at that step is for the integrator to confirm.
- (b) **Selection order.** The projection FILTERS the pool to the eligible and then hashes. The `institutionDescDraw` precedent hashes over the WHOLE pool and resolves a refused line to the hash argmax of the admitted. Both draw nothing. The shares differ slightly; the bar should hold either way, since pools are 6–17 a branch.
- (c) **House reads.** Houses with no fact home are read in the measure by roster-name regex. The real code must read them by catalogue id or a fact home (§6 R4).
- (d) **Branches.** The Waterfront branch is read off today's text. The Fishing and Alehouse branches are new splits on the water home and the roster.

## 6. What I could not settle: rulings

- **R1 (canonical-at-zero, the integrator's).** I propose that a SEEDLESS caller keeps index 0 unconditionally: `pickVariant`'s own law, so every unit test, including `spatialGenerator.test.js`'s waterfront `toMatchObject`, stays byte-identical. A SEEDED birth chooses among the wordings whose declared facts hold, so index 0 prints only where true. This needs the chair's yes, because it makes index 0 conditional in births.
- **R2 (the chair's). Today's line is false in a whole branch.** Religious-access covers 179 places, Fishing-inland 24 and Alehouse-inn 7. In those branches index 0 is never eligible, so today's line leaves those places entirely. Confirm that "canonical-at-zero" yields to "never a fact the record lacks" there.
- **R3 (the chair's). The gates themselves.** A thorp or hamlet gets a quarter named "Religious Quarter" because `has('church')` matches "Access to parish church". The name is a size and a presence claim this field cannot cure. Changing the gate moves `quarters.length`, which keys the map substrate (`lib/spatialSubstrateDerive.js`: `q${quarters}`) and `townLayoutV2`. Not proposed; flagged. The census ledger's key guarantee for the Religious pool is wrong for these 179 places.
- **R4 (the chair's, per the 16:10 rule).** `factVocabulary.js` is read-only. The wordings need these house facts, which the record already holds as roster rows and which no atom answers. Each line gives the atom key, its proposed home, and the wordings that need it (catalogue id in brackets):
  - ATOM institution: burial : src/domain/facts/institutions.js : R3, R5, R9, R16, A4, A7, A9, A14 (burial_ground, graveyard, parish_burial_grounds, burial_grounds_and_charnel_house, cemetery_network)
  - ATOM institution: tannery : src/domain/facts/institutions.js : N0, N1–N7 {trades} (tanners, tanner_established, tannery)
  - ATOM institution: butcher : src/domain/facts/institutions.js : N0, {trades} "butchers' yards" (butchers_3_8)
  - ATOM institution: dyer : src/domain/facts/institutions.js : N0, {trades} "the dyers' vats"
  - ATOM institution: fuller : src/domain/facts/institutions.js : {trades} "the fullers' troughs"
  - ATOM institution: slaughterhouse : src/domain/facts/institutions.js : {trades} "the slaughterhouse"
  - ATOM institution: warehouse : src/domain/facts/institutions.js : W0 (both), {houses} "warehouses", M {also} "the merchants' warehouses" (merchant_warehouses, warehouse_district)
  - ATOM institution: salt works : src/domain/facts/institutions.js : W0 maritime "salt", {houses} "the salt works"
  - ATOM institution: customs house : src/domain/facts/institutions.js : Waterfront and Government {houses}
  - ATOM institution: harbour master : src/domain/facts/institutions.js : Waterfront {houses}
  - ATOM institution: chandler : src/domain/facts/institutions.js : Waterfront {houses} (the layout's J1 already reads `has('Chandler')`)
  - ATOM institution: ropemaker : src/domain/facts/institutions.js : Waterfront {houses} "the ropewalk"
  - ATOM institution: shipyard : src/domain/facts/institutions.js : Waterfront {houses}
  - ATOM institution: boatyard : src/domain/facts/institutions.js : Waterfront {houses}
  - ATOM institution: ferry : src/domain/facts/institutions.js : Waterfront {houses} "the ferry landing"
  - ATOM institution: fish market : src/domain/facts/institutions.js : Market {also}, Waterfront {houses}, Common {also}
  - ATOM institution: weekly market : src/domain/facts/market.js : M1, M2
  - ATOM institution: fair : src/domain/facts/market.js : Market {also} "the ground where the annual fair is held"
  - ATOM institution: merchant guild : src/domain/facts/guild.js : Market {also}, Wealthy {also}, L2
  - ATOM institution: money changer : src/domain/facts/institutions.js (the `bank` kind already reads money changers; `institution: bank` may answer) : Market {also}
  - ATOM institution: town hall : src/domain/facts/institutions.js : Government {houses} "the town hall / the city hall"
  - ATOM institution: palace : src/domain/facts/institutions.js : Government {houses}
  - ATOM institution: mint : src/domain/facts/institutions.js : Government {houses}
  - ATOM institution: wizard's tower : src/domain/facts/magic.js : X0 "Towers", {houses} "a wizard's tower"
  - ATOM institution: mages' guild : src/domain/facts/magic.js (`ARCANE_GUILD_HOUSES` already names it) : Mages' {houses}
  - ATOM institution: academy of magic : src/domain/facts/magic.js (`ARCANE_GUILD_HOUSES`) : Mages' {houses}
  - ATOM institution: great library : src/domain/facts/institutions.js : Mages' {houses}
  - ATOM institution: alchemist : src/domain/facts/magic.js (`namesAlchemistHouse`) : Mages' {houses}
  - ATOM institution: enchanter : src/domain/facts/magic.js : X0 "arcane shops", {houses} "the enchanter's shop" (the `enchanting` atom reads services, not the house)
  - ATOM institution: sage : src/domain/facts/institutions.js : Mages' {houses} "the sages' houses"
  - ATOM institution: scroll scribe : src/domain/facts/institutions.js : Mages' {houses}
  - ATOM institution: black market : src/domain/facts/criminalStructureKey.js : S0 "hidden markets", Shadows {houses}
  - ATOM institution: gambling : src/domain/facts/criminalStructureKey.js : Shadows {houses}
  - ATOM institution: brothel : src/domain/facts/criminalStructureKey.js : Shadows {houses}
  - ATOM institution: smuggling : src/domain/facts/criminalStructureKey.js : Shadows {houses}
  - ATOM institution: thieves' guild : src/domain/facts/criminalStructureKey.js : Shadows {houses}
  - ATOM institution: underground city : src/domain/facts/institutions.js : Shadows {houses}
  - ATOM institution: front business : src/domain/facts/criminalStructureKey.js : Shadows {houses}
  - ATOM institution: criminal factions : src/domain/facts/rivalRings.js (the `rival rings` atom may answer) : Shadows {houses} "the rival gangs' haunts"
  - ATOM institution: carpenter : src/domain/facts/institutions.js : Artisan {crafts}, D7
  - ATOM institution: cooper : src/domain/facts/institutions.js : Artisan {crafts}
  - ATOM institution: potter : src/domain/facts/institutions.js : Artisan {crafts}
  - ATOM institution: weaver : src/domain/facts/institutions.js : Artisan {crafts}
  - ATOM institution: glassmaker : src/domain/facts/institutions.js : Artisan {crafts}
  - ATOM institution: bowyer : src/domain/facts/institutions.js : Artisan {crafts}
  - ATOM institution: cobbler : src/domain/facts/institutions.js : Artisan {crafts}
  - ATOM institution: tailor : src/domain/facts/institutions.js : Artisan {crafts}
  - ATOM institution: woodcutter : src/domain/facts/timberAtHand.js : D0–D10
  - ATOM institution: sawmill : src/domain/facts/timberAtHand.js : D3, D9
  - ATOM institution: charcoal burner : src/domain/facts/institutions.js : D4
  - ATOM institution: common grazing : src/domain/facts/institutions.js : H2, H4, H7, I4
  - ATOM institution: theatre : src/domain/facts/institutions.js : Wealthy {also}
  - ATOM institution: baker : src/domain/facts/institutions.js : Common {also}
  - ATOM institution: water system : src/domain/facts/water.js : Common {also} "public fountains on the water system"
  - ATOM institution: daily market : src/domain/facts/market.js : Common {also} "a market most days"

  Already answered by existing atoms: `church`, `church access`, `clergy`, `institution: monastery | hospital | temple | tavern | bathhouse | bank | smith`, `market`, `guild`, `court sits`, `magic`, `organised crime`, `coast`, `river`, `tier`.

  Where no atom is granted, the wording that needs it falls out of its pool. The pools stay over the bar at n ≥ 30 only while the burial, warehouse, crafts and arcane/shadow houses stand (Wealthy and Common lean on theatre, baths, bakers and the water system). **Recommendation:** grant `institution: burial` first. Every thorp, hamlet and village Religious line that is not a bare church line rests on it.

- **R5 (the integrator's).** The quarter lines carry their declarations through `textOf`, which no door reads, so the presumption walkers bank them. The new pools must go through `drawDeclared` to count as declared. The census ledger `SPATIAL_TEXT.json` gains a row per wording, and its `source` moves to the new data file with `census2dTables`' inline arm. Cured lines leave stale rows in `presumedThings*.register.json` and `presumptionClasses.register.json`, to be shrunk through their doors. Note also `labelJoins` (`spatialGenerator.js: 8`): no new `instNames` scan.
- **R6 (the integrator's).** `generateSpatialLayout` needs the birth's seed and its facts (the faith reading, water, crime, crisis) at `economyReconcilePass`: a fifth argument, `{ seed, facts }`. Its two callers are the step and the unit tests (seedless, unchanged). The golden master moves. The fork registry's hash-channel count moves.
- **R7 (the chair's).** **"Pilgrims"** (in today's index 0 only) has no fact home. Keep index 0 as is, or strike the word (a text move)? The access-branch lines also say what the faith panel says ("its people walk to a neighbour's parish church"). Is that duplication across surfaces acceptable in a description-position line?
- **Not settled.** With n < 25 (Woodcutters, Artisan in cities and metropolises, Mages' in towns, the Shrine, Noxious in villages), the 15% bar is not readable on 100 places. Those pools were sized by count, not by the bar.

## 7. The minimal atom set, the item tables, the strikes (the coordinator's follow-up, 2026-11-20)

These are the same 600 births. `m2-quarters-births.mjs` now also records, per birth, the vocabulary's own answer (`factVocabulary.js :: atomHolds`) for every existing atom a §7 wording declares, and each live row's catalogue id.

- **Wordings:** `measures/m2-quarters-pools-atoms.mjs`, the §4 pools rewritten toward the existing atoms.
- **Run:** `measures/m2-quarters-atoms.mjs` → `m2-quarters-atoms.out.txt`.
- **Selection:** a wording or a slot item is eligible only where every atom it declares holds, and every new key it needs is granted and holds.
- **Gate guarantees (R-B1):** a quarter's own gate house needs no declaration. The woodcutter, the fishing community, the shrine and the market square are guaranteed this way. The Noxious gate guarantees a tanner, a butcher or a slaughterhouse, so its generic lines say only "the smelliest trades".

**(1) THE MINIMAL SET IS EMPTY.** With **no new key**, step 0 of the run passes all three tests:
- **(a)** today's line prints nowhere that §2 finds it false (0).
- **(b)** every size and every type with n ≥ 30 is at or under 15%.
- **(c)** every wording or item that needs a key leaves its pool. No birth falls back (NONE 0).

Step 0 shares:

| | thorp | hamlet | village | town | city | metro |
|---|---|---|---|---|---|---|
| size top | 10% | 11% | 14% | 13% | 11% | 14% |
| Religious | 11% | 11% | 14% | 11% | 8% | 9% |

The other types at n ≥ 30, at step 0:
- **Fishing:** thorp 13%
- **Alehouse:** hamlet 12%
- **Noxious:** town 11%, city 11%, metro 11%
- **Market:** town 13%
- **Waterfront:** city 14%, metro 15%
- **Government:** town 8%, city 8%, metro 10%
- **Mages':** city 14%, metro 13%
- **Shadows:** city 12%, metro 11%
- **Wealthy:** city 9%, metro 13%
- **Common:** city 9%, metro 14%

The types with n < 30 (Woodcutters, Shrine, Noxious in villages, Waterfront in towns, Artisan, Mages' in towns) cannot be read against the bar.

What step 0 costs: today's index-0 line leaves every place in five types. Noxious needs butcher; Waterfront needs warehouse and salt works; Mages' needs a wizard's tower and an enchanter; Shadows needs a black market; Alehouse needs alehouse. The Religious index 0 still prints where a church and a monastery stand, and Market, Government, Artisan, Wealthy and Common keep theirs.

**The order to grant, if the chair grants any.** Each key below is the one that most lowers the sum of the top shares the bar reads. Every step keeps (a), (b) and (c); the chair can stop anywhere. In the chair's form:

1. ATOM institution: burial : src/domain/facts/institutions.js : R3, R5, R9, R16, A4, A7, A9, A14. The sum falls 13.0 points. Village top 14% → 11%, hamlet 11% → 10%.
2. ATOM institution: customs house : src/domain/facts/institutions.js : the Waterfront and Government slots. The sum falls 7.0.
3. ATOM institution: mages' guild : src/domain/facts/magic.js (`ARCANE_GUILD_HOUSES`) : the Mages' slot. The sum falls 5.2.
4. ATOM institution: black market : src/domain/facts/criminalStructureKey.js : S0 (today's line, back where true), the Shadows slot. The sum falls 4.3.
5. ATOM institution: weekly market : src/domain/facts/market.js : M1, M2. The sum falls 4.0. Town top 13% → 11%.
6. ATOM institution: gambling : src/domain/facts/criminalStructureKey.js : the Shadows slot. The sum falls 3.0.
7. ATOM institution: butcher : src/domain/facts/institutions.js : N0 (today's line, with leather and dyed cloth), the Noxious slot. The sum falls 2.0.
8. ATOM institution: theatre : src/domain/facts/institutions.js : the Wealthy slot. The sum falls 1.0.

After step 8 the sizes stand at thorp 10%, hamlet 10%, village 11%, town 11%, city 11%, metro 14%. The remaining 27 keys move nothing the bar reads at n ≥ 30. They do restore today's line where it is true (warehouse, salt works, wizard's tower with enchanter, alehouse) and enrich the n < 30 pools. In the run's order:
- slaughterhouse, fuller, salt works, fish market, chandler, ropemaker, shipyard
- fair, town hall, palace, mint
- enchanter, great library, sage
- brothel, smuggling, underground city
- cooper, tailor, sawmill
- alehouse, wayside inn, baker, water system
- alchemist, wizard's tower, warehouse

**Existing atoms the rewrite now declares:**
- **Faith and place:** `church`, `church access`, `clergy`, `sacredHouse`, `market`, `guild`, `court sits`, `legal house`, `magic`, `enchanting`, `coast`, `river`, `terrain: forest`.
- **Crime:** `organised crime`, `rival rings`, `criminal income`.
- **Houses:** `institution: monastery | hospital | temple | tavern | bathhouse | bank | school | granary | docks`.
- **Trade at work:** `trade at work: leather` (the tanning pits), `dyed cloth` (the dye vats), `cloth`, `ironwork`, `woodwork`, `clay kilns`, `charcoal kilns`, `dairy`, `spice`, `herbs`.
- **Exports:** `exported: cloth | flour | hides | ale | arms` (the goods on the waterfront).
- **Rulers:** `ruler: council | mayor | lord` (the council chamber, the mayor's offices, the lord's hall).
- **Crisis:** the excludes `crisis: unrest` on the quiet lines, and `crisis: under_siege, plague_onset` on the walk-to-church lines.

I did not use `trade at work: fish | kilns | arcane | stone`. They read true in 95–100% of thorps, too wide to bear a house's name.

`trade at work` is stricter than presence: a house that is short drops out of the slot. It leaves a sentence; it never makes one false.

**(2) Can a `{houses}` slot be declared by its item table? For items with an existing atom, yes; for a bare catalogue id, no.**
- **Yes, by declaration.** Every item row with an existing atom is credited by declaration with no exemption. An item table handed to `filterDeclared` or `drawDeclared` is a drawn range (`presumedThings.shared.mjs :: drawnRanges`, `DOOR_ARGS`), so the walker's arm 1 credits each row's own `needs` exactly as it credits a pool line. The slot's frame names no thing of its own, and arm 2 reads the printed sentence against the record, which every standing item satisfies.
- **No, for a catalogue id.** A declaration must be a vocabulary atom (`factVocabulary.js :: parseAtom` / `assertDeclarable`), and a catalogue id is not one. So an item for a house no atom answers cannot be declared by its id alone. One new keyed dimension (`house: <catalogue id>`, read from the live roster in `institutions.js`) would cover every such item in a single grant, where the list above takes one grant per key.
- **One mechanical catch.** The texts must come out of the door's result through `lineText` or a per-position `drawDeclared` with its `used` set. A `.map((l) => l.text)` over the filtered items is a shape the walker's strip ban names, and it would need a strip row.

**(3) The coordinator's strikes, applied in the §7 pools and projected:**
- **L5:** "on the high ground" is struck. It now reads "Stone townhouses, with {also} close by".
- **D6:** declares `terrain: forest`.
- **A5 and A15:** declare `not: clergy`. A shrine makes `clergy` true, so a hamlet with a shrine never prints "no priest".
- **Church-branch index 0 ("pilgrims"):** declares `sacredHouse`. With its `institution: monastery` and `church`, it prints where a church and a monastery stand: town 1, city 4, metro 4 in §5's run. This is for the chair.

**Further rewrites made in §7:**
- **Alehouse & Common:** the branch is no longer split by roster name. The `institution: tavern` atom answers an alehouse or an inn alike, so tavern-neutral lines T1–T14 ("the drinking house") carry the pool, and the alehouse and wayside-inn wordings wait for their keys.
- **Struck as invention:** "the watch walks in pairs", "worst-lit streets" and "business no one writes down".
