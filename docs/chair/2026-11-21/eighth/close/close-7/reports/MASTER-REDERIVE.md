# MASTER-REDERIVE: what the line already does to a saved place (CLOSE-7 chain two; RULING-R24f (3)). A measure; nothing built.

**THE ANSWER (CONFIRMED by run).** Every one of the 180 places born and saved by master moves when the line re-derives it with an
empty layer.
- **The people are replaced** in all 180: 12 of 1,804 people keep their name.
- **The houses move** in 65 places (up to 34 in one place).
- **The powers move** in 51.
- **The government's name changes** in 7.
- **The events move** in 53 to 63, depending on the key.

The same re-derive on master itself moves **0 of 180**. So it is the line's code since master, not the re-derive, that re-deals a
saved place on its next edit. The corrections law alone does not answer this; it is for the owner to decide.

## Method
- **Trees.** Both detached, made and then removed by me: `/home/user/wt/master` at db832c892 (`git rev-parse origin/master` names
  db832c892), and `/home/user/wt/line` at f9531eb3a. node_modules and `.husky/_` were linked, both have the same dependencies, and
  nothing was written in either.
- **Harness.** `close-7/master-rederive/master-rederive.census.jsx`, the B1(i) rederive harness extended. It is run by vitest with
  its root at the load tree, and loads the two trees' modules side by side.
- **Birth (master's engine).** The C corpus's own birth: `read24/make-plan.mjs` (config `{ settType }` through master's
  `birthConfig`), seeds `dp-<size>-<i>` for i = 0..29 and six sizes (180 places), options `{ seed, customContent: {} }`, after
  master's `loadGenerationLawPayloads()`.
- **Save (master's shape).** `components/generate/SaveToLibraryButton.jsx :: handleSave` builds the payload
  `{ name, tier, settlement: with mapEdits minted, config: settlement._config }`. `lib/saves.js :: supabaseSave` writes the row:
  `data` = `withNeighbourNetworkFromRelationship(migrateSaveToV2(entry).settlement)`, `config`, `seed`. Both helpers are identity
  here: no census birth carries a `neighborRelationship` (checked, 0 of 180). The row was written as JSON; the 180 rows are in the
  scratchpad, `MR/line/saved/` (26 MB).
- **Load (the line's path).** `lib/saves.js :: saveEntryFromSupabaseRow` → `migrateSaveToV2` → `migrateSettlementShape` =
  `domain/normalizeSettlement.js :: normalizeSettlement`, which ends in `domain/settlementMigrations.js ::
  migrateSettlementToLatest`. The harness applies `normalizeSettlement` to the row's `data`.
- **Re-derive (as an edit does).** `store/editSlice.js` calls `settlementRederiveAction.js :: regenerateWithLayer(live,
  storedConfigFor(…) = the row's config, layer, DECLARATION_CONSULT)` → `domain/edit/dmLayer.js :: rederive`, then
  `carryForward(live, derived)`. The harness does the same:
  - an EMPTY layer `{ roots: {}, worldFacts: {}, minted: {}, phantoms: {} }`;
  - the consult `{ isEditableCard, declarationsFor }` from `fieldDeclarations.js`;
  - the engine is the line's `generateSettlementPipeline` after its laws' payloads load;
  - then the carry-forward.

  The saved record carries `_seed` (180 of 180) and `config` (180 of 180), so the re-derive runs the same seed and the same stored
  config. 0 errors.
- **Control.** The same harness with master as the load tree: master's `normalizeSettlement`, `rederive` and engine.

**Keys.**
- **Houses:** `institutions[].name`, as a multiset. Catalogue names, stable across the two trees; a renamed house counts as one lost
  and one gained.
- **People:** `npcs[].name`, with roles listed beside. **A person's name is NOT stable across the two trees:** the line re-births the
  cast with new names (12 of 1,804 kept). So the people count measures "whom the place holds by name", and every saved person is
  replaced.
- **Powers:** `powerStructure.factions[].faction`.
- **Government:** `powerStructure.governingName`, falling back to `.government`.
- **Events:** `history.historicalEvents`, keyed two ways: by `name` (which a wording cure can move) and by
  `yearsAgo` + `type`, which no rewording moves.

## By size: the line re-derives master's saved places (CONFIRMED by run)
Each cell gives places moved · mean moved per place · max moved in one place.

| size | moved at all | houses | people | powers | government name | events (by name) | events (year and kind) |
|---|---|---|---|---|---|---|---|
| thorp | 30/30 | 6 · 0.2 · 1 | 30 · 2.8 · 5 | 5 · 0.2 · 1 | 0 · 0.0 · 0 | 10 · 1.1 · 6 | 7 · 0.5 · 4 |
| hamlet | 30/30 | 7 · 0.3 · 3 | 30 · 7.3 · 11 | 14 · 0.6 · 2 | 0 · 0.0 · 0 | 13 · 1.5 · 9 | 12 · 0.9 · 5 |
| village | 30/30 | 11 · 1.2 · 8 | 30 · 13.2 · 27 | 9 · 0.5 · 2 | 0 · 0.0 · 0 | 16 · 1.8 · 8 | 10 · 0.9 · 6 |
| town | 30/30 | 13 · 2.7 · 34 | 30 · 34.1 · 53 | 3 · 0.3 · 4 | 1 · 0.0 · 1 | 5 · 0.9 · 8 | 5 · 1.6 · 14 |
| city | 30/30 | 16 · 5.5 · 32 | 30 · 77.0 · 99 | 15 · 1.8 · 6 | 6 · 0.2 · 1 | 11 · 2.0 · 8 | 11 · 3.0 · 15 |
| metropolis | 30/30 | 12 · 0.7 · 4 | 30 · 109.5 · 122 | 5 · 0.4 · 4 | 0 · 0.0 · 0 | 8 · 1.9 · 13 | 8 · 4.1 · 29 |
| **all** | **180/180** | **65** · 1.8 · 34 | **180** · 40.7 · 122 | **51** · 0.6 · 6 | **7** | **63** · 1.6 · 13 | **53** · 1.9 · 29 |

People by count, mean before → after a place (CONFIRMED): thorp 1.5 → 1.4, hamlet 3.3 → 4.2, village 5.3 → 8.0, town 9.2 → 25.0,
city 15.1 → 62.2, metropolis 25.8 → 83.9. Names kept: 1/44, 3/98, 1/158, 0/275, 4/454, 3/775. Houses and powers by count barely
change on average (for example town houses 33.6 → 33.0); a place that moves trades houses one for one.

**THE CONTROL (CONFIRMED by run): master re-deriving its own saved places moves 0 of 180** in every dimension. A re-derive is a
no-op without a code difference. Every move above is the line's change since master.

## Three examples (CONFIRMED by run; `close-7/master-rederive/line-rows.jsonl` holds every place)
1. **dp-town-5. Houses 20 lost, 14 gained;** government name kept (Town Council); people 12 → 28 and all renamed.
   - Lost include: Fish market, Coaching inn, Stable district, Merchant warehouses, Mint, Jeweller, Sawmill (commercial), Smelter,
     Alchemist shop, Town council, Caravaneer's post, Toll bridge, Customs house, Courthouse.
   - Gained include: Listening post, Blacksmiths (3-10), Brewery, Printing house, Mayor and council, Adventurers' charter hall,
     Public bathhouse, Barracks.
   - People: the mayor Diarmuid Flaherty becomes the mayor Treasa Sweetman; a garrison commander, a dean and a watch captain arrive.
2. **dp-city-0. The government's name changes from "Merchant oligarchy" to "City Council".**
   - Powers lost: Merchant oligarchy, Craft Guilds, The Trade Compact. Gained: City Council, Arcane Orders.
   - Houses 15 lost (including Merchant oligarchy, Mages' guild, Multiple criminal factions, Contract killer) and 12 gained (including
     Mayor and council, Enchanter's shop, Wizard's tower, Theaters).
   - People 14 → 53.
3. **dp-metropolis-2. Its history is rewritten.** 7 events lost by name (The Land Dispute, The Schism, The Heresy Trials, The
   Tyranny, The Succession Crisis, The Flood, The Shortage) and 6 gained (The Great Fire, The Guild War, The Debt Crisis, The
   Economic Divide, The Trade Collapse, The Wild Magic). By year and kind, 15 lost and 14 gained.

The government also changes in dp-town-22 (Town Council → Feudal Appointee), dp-city-8 (City Council → Noble Governorship), dp-city-13
(Royal Authority → Merchant oligarchy), dp-city-17 and dp-city-27 (Merchant Guild Council → Merchant oligarchy), and dp-city-20
(Royal Authority → City Council).

## Data
`close-7/master-rederive/`:
- `master-rederive.census.jsx`: the harness.
- `summarize.mjs`: the table.
- `line-rows.jsonl` and `control-rows.jsonl`: per place, what was lost and gained in each dimension, with the counts.
- `line-table.md` and `control-table.md`.

The saved rows are in the scratchpad (`MR/line/saved/`).
