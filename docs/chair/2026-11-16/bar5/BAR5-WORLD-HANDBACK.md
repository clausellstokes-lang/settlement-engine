# BAR5-WORLD · hand-back

**STATUS: FINAL** at the tip that carries this line (the work complete at `4f5de11c0`; this push adds the hand-back's lines only). No merge of the line (the chair, 19:43 UTC): the branch stays as cut from 600b7683a; the merge seat lands it. Base `600b7683a` (the joined line), both audits merged (`d40d6ab28`, `c0ea05497`; documents and `tests/helpers/pageLaws/` only). Branch `lane/bar5-world-2026-11-16`. Rulings worked to: BRIEF-BAR5 (Amendment L and the amendments), BRIEF-BAR4's Amendment K, its measure's rules and amendments, BRIEF-BAR3's amendments, BRIEF-BAR2's method; the chair's ruling WS1 (17:54 UTC: the one sibling row in `foodwaysPrintSiblings.js` is this seat's).

## THE RULES

| rule | the two readings found, and where | the one fact made | before (sixty · 720 · fresh 300), instances/towns | after | what one change cured / what was cured line by line | named exclusions | guard and positive control | LAW 5, my files |
|---|---|---|---|---|---|---|---|---|
| LAW 4 · 4n-founding ("Founded roadside") | the Overview's origin row (`settlementOriginProse.js :: ORIGIN_POOLS.road[2]`, drawn from the route BEFORE the History) against the History's founding (`history.founding.reason`, from `narrativeData.js :: TERRAIN_NARRATIVE_HOOKS`) | none new: the founding has ONE home, the History; the road row says where the place stands ("It stands roadside, …") as its siblings do; the same pick, no draw moved | 3/3 · 23/23 · 9/9 (the audit at 9867b4b17: 2 · 23 · 9) | 0 · 0 · 0 | the one reword cured all; the page diff base→tip over each population moves THAT LINE ONLY (7 · 67 · 24 towns: "Founded roadside" → "It stands roadside"; nothing else on any dossier tab moved). No other origin row founds a town: the 720 prints "Founded" in one other row, "Founded on the shore" (a place) | none | `tests/generators/bar5WorldLines.test.js` (a): the read row of bar0-village-famine-rand-23 constructed (the detector `law4n` fires); the three sixty towns it fired in print the reworded row; red at the base | — |
| LAW 5 · my six files | a line speaks of the outside, of plenty or of fired clay and declares no crisis (`law5-inventory.mjs`) | — | 35 undeclared (culture 16, daily life 10, narrative 4, history 5) | 0 | 6 declared on the line (`dailyLifeLogic.js`: the ledger's atoms and the siege; the cells resolve through the one rule); 1 twinned at print (`foodwaysPrintSiblings.js`, WS1); 3 twinned in code (`dailyLife.js`); 25 by reviewed reason | `docs/chair/2026-11-16/bar5/AUDIT/tables/B.law5.exclusions.BAR5-WORLD.json` (29 rows, each with its reason; `law5-inventory.mjs` reads every `B.law5.exclusions.<SEAT>.json` after the walk and reports a stale row) | (b) the route cells; (c) the famine towns of the surplus band; (d) WS1's besieged towns | 35 → 0 (the whole inventory 158 → 123) |
| LAW 5 measured first: what prints in a crisis town | (the inventory is static) | — | the arabic foodways line: Economics, 60 of the 720 (2 besieged), 27 of the fresh 300 (6 besieged); `dailyLife.js`'s "plentiful": 3 famine towns of the 720, 2 crisis towns of the 300 (no dossier tab: the causal, counterfactual and AI-grounding views) | besieged with the caravan line: 0 · 0 (the 87 towns re-rendered at 4f4900da6); "plentiful" in a famine or siege town: 0 · 0 | | | | |

### LAW 5: every line, and how it left the list

- `dailyLifeLogic.js` TERRAIN_CONTEXT.desert, ROUTE_CONTEXT road, crossroads, river, port, mountain_pass: declared (the ledger `docs/census/declarations/DAILY_LIFE_CONTEXT.json`'s atoms, and `crisis: under_siege` where it lacked it: road, desert). These fields print on no page (the ledger's own note); a besieged cell now reads null.
- `cultureProfiles.js:205` (arabic foodways): its print-side twin (WS1).
- `dailyLife.js`: the surplus band (2 lines) and the merchants' dawn take crisis twins in code; the collapsed band's "caravans that never arrived" is the crisis's own truth.
- `narrativeData.js` 95, 98, 119, 120 (the History's founding reasons, past tense) and `historyData.js` 1465, 1511, 1560 (hooks), 1556 (a past event), 1564 (a conditional): print in crisis towns, true there.
- The other 15 culture rows: no dossier tab in the sixty, the 720 or the fresh 300 (the PDF's Identity section and the Journal only); the two architectural details print in no crisis town and name standing built form.

### (c) of my section: the stored magic flag in `dailyLifeLogic.js`

`dailyLifeLogic.js:130` reads `dp.magicDependency` into `ctx.magicDep`. Nothing on the Daily Life tab prints it (the local narrative reads neither it nor the magic band). No word from BAR5-MAGIC through the chair yet: unchanged.

## Batches

1. `76eabffc1`: the founding row; the daily-life cells; the daily-life twins; the exclusion table; the guard.
2. `4f4900da6` (WS1): the caravan-staples sibling row; the guard's arm (d).
3. This hand-back with the after-counts, the net and the reference (the exclusion table gains the siege twin's row).

## THE VETO LIST (new or changed lines, with three towns each)

- "It stands roadside, where the day is measured in traffic: what arrives before noon, what leaves before dusk, and what stops for the night." (refused under a siege as before: `ORIGIN_ROW_ADMITS`) · bar0-thorp-calm-rand-26 (a thorp), bar0-metropolis-calm-rand-25 (a metropolis), bar0-village-famine-rand-23 (a famine).
- "Water access and preservation skill decide how long local produce must last while no caravan can come." (under a siege only) · r2r-thorp-58 (a thorp), r2s-under_siege-metropolis-2 (a metropolis), both besieged; the fresh 300's 6 besieged towns.
- "The stores still hold: bread and broth reach most tables, and the households count what is left." (a famine or a siege, the surplus band; no dossier tab) · r2s-famine-hamlet-2, r2s-famine-town-1, r2s-famine-metropolis-3.
- "The merchants count their stock before light, and the porters wait for loads that do not come; dawn brings the smell of woodsmoke and grain." (a siege with a merchant power ≥ 30; no dossier tab) · none in the 720 or the fresh 300.

## THE BOOKS MY CURES MOVE

- THE REFERENCE: **38 of the 525** configurations move against 600b7683a, ONE family: `settlementReason` (the reworded road row). WS1 moves none of the 525 (no besieged arabic configuration); in the census it moves `culturalIdentity.foodways` (written from the print reader in `assembleSettlement.js`, untouched) in the besieged arabic towns (2 of the 720, 6 of the fresh 300).
- `tests/lint/presumedThings.walker.test.js` ARM 1 (red at the base with 8 rows of other files): a fresh row `settlementOriginProse.js :: openTrade :: "It stands roadside …"` (true where it prints: the row is refused under a siege); stale rows: `settlementOriginProse.js openTrade 48564237c7b6ab26` (the old row) and `dailyLifeLogic.js` market 8c50dca21a85a099, docks a65bb8cf55e30dc6, docks f5a56e72692d7de6, openTrade a65bb8cf55e30dc6 (the cells now declared). NOT re-taken (L6): the close's door.
- The golden-derived files (`generatorGoldenMaster` and its kin): red at the base by the round before's cures; my 38 configurations add to that move.
- THE NET: the table below.

## Registrations owed

- `scripts/mutation-coverage-manifest.json`: `tests/generators/bar5WorldLines.test.js` (kills a reword of ORIGIN_POOLS.road[2] back to a founding claim; the removal of the route cells' siege declaration; the removal of the surplus band's want twin; the removal of the caravan-staples sibling).

## THE NET

Each file run ALONE at 600b7683a and at `4f4900da6` (43 files: BRIEF-BAR2 F2's seventeen, BRIEF-BAR3's three, BRIEF-BAR4 amendment 2's ten, BRIEF-BAR5's four, the three walkers of the corpus's laws, my guard and the files that pin a symbol I changed); then `npm run build` and `npm run verify:dist` at both.

- GREEN AT BOTH: 31 files (among them `crisisStoppedRows`, `tailExportsPdf3Batch3`, `layerBoundaries`, `engineCoreLazyEdge`, `chainPrintSites`, `styleLaw.walker`, `regenDerivedState`, `economicStructure`, `negativeAssertionAnchor`, `seedLoopTotality`, `proseDrawnAnchors`, `tailNarrativeRows`, `bar4HousesPresumptions`, `census2eTables`). My guard `bar5WorldLines`: green at the tip, red at the base (5 of 6: only the positive control holds there).
- RED AT BOTH WITH THE SAME MESSAGE (the base's, named, not chased): `pipelinePinnedMode`, `generationForkCensus`, `observedShapeReaders.walker`, `writerReach.walker`, `proseWiringCensus.walker`, `tuningRegister.walker`, `proseCorpusBytes`, `tieProseDeclared`, `tailHouses1Gaps`, `proseTasteCorruption.walker`.
- RED AT BOTH, MOVED BY MY DECLARED CURE: `presumedThings.walker` (the rows named above; nothing else differs).
- `npm run build`: passes at both. `npm run verify:dist`: refused at both on the same failed rows (the engine bundle replay, the service core and parity, the worker lazy edge, the vendor-pdf sizes and the goods roster). Moved by my cures: the edge bundle's stale rows 390 → 396 of 525 (my 38 settlementReason configurations); the first-paint closure 1,139,072 → 1,139,416 bytes (+344; gzip 362,611 → 362,712, Brotli 304,357 → 304,508; budget 1,132,308, red at the base): the strings of the declared cells and twins in eager modules. A ceiling, not raised: named. No new goods import (the roster's message is the base's).

## What is left, in order

1. THE SEAM (the chair, 19:43 UTC: after the join, not written here): `src/components/new/dailyLifeLogic.js :: extractSettlementContext`, line 130, `const magicDep       = dp.magicDependency ?? false;` reads the record's stored magic flag (`defenseProfile.magicDependency`) into `ctx.magicDep`. It should read THE WORD THE PAGE PRINTS: BAR5-MAGIC's leaf (the shown reliance reading). Today nothing on the Daily Life tab prints `ctx.magicDep` (the local narrative reads neither it nor the magic band), so the page does not move.
2. `docs/chair/2026-11-16/bar5/AUDIT/law5-inventory.mjs` WAS CHANGED BY THREE SEATS: this branch holds the reader of the PER-SEAT exclusion tables (`tables/B.law5.exclusions.<SEAT>.json`, read after the walk, every stale row reported); BAR5-FOOD's table is already in that form. The join unites the three edits into that one reader.
3. The close's registrations and stored figures named above (the presumed-things rows, the mutation manifest entry, the reference's 38 configurations, the edge bundle's stale rows, the first-paint bytes).

## FOR THE OWNER, IN PLAIN WORDS

A town's overview used to say it was "Founded roadside" while its own History said it began at a ford, a grove or a herders' gathering: 23 towns in 720 said both. The overview now says only where the town stands, and the History alone tells how it began. One culture's food line spoke of caravans bringing staples to towns under siege; it now says how long the town's own food must last while no caravan can come. Thirty-five lines in this seat's files spoke of travellers, caravans or plenty without saying what a crisis does to them: each now either knows the crisis or is recorded, with its reason, as true in one (most are past events of the History, which a siege today does not undo).
