# BAR5-CHAINS · HAND-BACK · LAW 3's chains, their gaps and their houses

**Base** `600b7683a` (the joined line, as named). **Branch** `lane/bar5-chains-2026-11-16`. Audit B merged first (`--no-ff`, d40d6ab28: helpers and documents only). Rulings worked to: the brief's (a) (b) (c), the chair's **CC1** (17:54 UTC: `economicsCrisisMarks.js :: chainCardUnderCrisis` mine for this round), **EX1** (18:46: `law5-inventory.mjs` not touched — it was not), and the standing **M-S**, **R2**, **HW1**.

## FIRST: the shared helpers' lines I changed (EX1)

| helper | lines at my tip | what |
|---|---|---|
| `tests/helpers/pageLaws/pageB.mjs` | 79–83 (new), 85 (changed) | `readChains`: a card printing NO state (`NO_STATE_SHOWN`) is a card: a `STATELESS` head `<name> · <Category>` straight before `From`/`Via`. Before, its Via was read as the card above's (3 false `L3.chainOverStopped`: "Black market … Operational over (Access to a house of worship)"). |
| `tests/helpers/pageLaws/law3.mjs` | 28–32 (new) | `SEVERAL_INPUTS = { smelter: [iron ore, copper ore, gold and silver ore] }` |
| `tests/helpers/pageLaws/law3.mjs` | 132–143 (new) | `L3.needed`: two NAMED EXCLUSIONS: **M-S** (a several-input house where the page's need line leaves one input out: the smelter smelts iron; 7 rows) and **R2** (a ladder rung of the house the need list requires, "Apothecary (established)" for "Required by Apothecary": the rung runs no chain but the sawmill's; 1 row of the 720) |
| `tests/helpers/pageLaws/law3.mjs` | 171–174 (new) | `L3.halfway`: NAMED EXCLUSION, an entrepôt card ("Silk & Luxury Textiles · Trade & entrepôt") works no material here (14 rows of the 720) |

No other line of either helper moved; `law2.mjs` untouched.

## THE RULES

Instances / towns. "Base" is the base read by my final detector (the parser mend finds 13 more true half-way rows in the 720 and drops the 3 misparsed chainOverStopped; the two exclusions remove what they name). The audit's own figures at base reproduced exactly first: halfway 3/3 · 27/16 · 112/56, needed 4/4 · 10/10 · 43/43, outputs 7/5 · 21/17 · 18/15, chainOverStopped 2/2 · 7/7 · 3/3 (sixty · 300 · 720).

| rule | the two readings, and where | the one fact made | sixty base→tip | fresh 300 base→tip | 720 base→tip | one change cured · line by line | named exclusions | guard · positive control |
|---|---|---|---|---|---|---|---|---|
| **L3.halfway** | the record's gap (`resourceGenerator.js :: evaluateInstitutionChain`, by house head) vs the page's gap reader (`validationOnPage.js :: tradeFinisherOn`, by finishing trade, `FINISHING_TRADES`); and the chain card's outputs (`chainStateShown.js :: chainAsShown`) vs the gap | (a) `facts/houseInputAtHand.js :: FINISHING_TRADES` + `tradeFinisherIn` (moved from `validationOnPage.js`; read BY CATALOGUE IDENTITY through `institutionMatchesKeyword`); the gap writer reads it with the page's own R1 rule (one finisher stands → no gap). Then the remainder: `facts/halfWayGoods.js :: halfWayGoodsDenied` (NEW), read by `chainAsShown` | 3/3 → **0** | 27/16 → **0** | 111/56 → **0** | (a) alone: 155 → 51 on the 165 instance towns of the three populations (104 rows); the remainder (51) by `halfWayGoodsDenied` | entrepôt card (14 of the 720) | `tests/domain/bar5ChainsLaw3.test.js` `gapInstances`, `cardGoodsInstances` · r2r-town-49 (Fulling mill beside a Fuller), r2r-town-39 (Leatherworkers' guild beside a Cobbler's guild), r2r-city-32 (C37887's form) |
| **L3.needed** | the critical imports (`resourceGenerator.js :: buildViabilityReport`, printed "Needed, and not brought in: grapes") vs the house-input reader (`houseInputAtHand`: grapes came 'route', so no gap, no mark) | (b) `houseInputAtHand`: a good the record's own need list names (`resourceAnalysis.imports.critical`) is not brought by the route alone (`needListNames`); a house whose trade IS the route keeps it. The generator hands the need list in (`{ resourceAnalysis: { imports } }`), the page reads the saved one: ONE reading (HW1) | 3/3 → **0** | 8/8 → **0** | 38/38 → **0** | all by the one change (57 → 8 on the instance towns, the 8 the M-S smelters and the R2 rung) | M-S smelter (7), R2 rung (1) | `idleCraftInstances` · r2r-city-21 (C31652's form, the vintner) |
| **L3.outputs** | the card's working word (`chainStateShown.js`, `economicsCrisisMarks.js`) vs the service rows' marks (`crisisStoppedRow.js :: rowStoppedBy`, BAR5-MARKS's) | (c) CC1 (i): `chainCardUnderCrisis` prints "impaired" where an output it names is a service the leaf marks for a crisis in force (the leaf read by import, unedited) | 7/5 → **0** | 21/17 → **0** | 18/15 → **0** | all by the one change | none | `stoppedCardInstances` · r2s-plague_onset-city-1 (C3874's form) |
| **L3.chainOverStopped** | the same two deciders | (c) CC1 (ii): a house whose every service row one crisis marks counts as marked (SW1b's house reading widened) | 1/1 → **0** | 5/5 → **0** | 3/3 → **0** | all by the one change | none (3 detector misparses mended, above) | `stoppedCardInstances` · r2s-under_siege-hamlet-0 (C17893) |

**Every other rule of the runner moved by 0** (the sixty 44, the 300 147, the 720 118 at base and at tip). **Controls** (the sixty, `SECOND-CHECK.final72.json`): with my final detector at base, 22 FOUND, every STANDS control FOUND, no EXPLAINED one; at my tip the six cured L3 STANDS controls (C3874, C3911, C17893, C31652, C39608, C37887) read "miss" because they are cured.

**LAW 5's count for my files: 0 before, 0 after** (`B.law5.inventory.json` holds no row of `resourceChains.js`, `resourceGenerator.js`, `computeActiveChains.js`, `chainStateShown.js`, `validationOnPage.js`, `houseInputAtHand.js`; `economicsCrisisMarks.js` and `halfWayGoods.js` none either).

## THE DECLARED MOVE (the record) and the page

- **The record, the 720 (field diff, base vs tip):** 185 towns move, in `resourceAnalysis.gaps` (185) and `resourceAnalysis.priorityNotes` (1, r2r-hamlet-36: its military note no longer names an iron gap a smith finishes). Nothing else: no export, no draw, no name, no other family. The gap list GAINS the vintner's and the glassblower's `missing` rows (b) and LOSES the half-way rows a finisher by trade answers (a).
- **The page, the 720:** 188 towns print a line more or less. GAINED: "No grapes reach the vintner." and the vintner's rows marked "Short of grapes." (137 towns new; 148 short at tip; every one of the new marks stands beside the page's own "Needed, and not brought in: … grapes"); the same of the glassblower and glass sand (12); the head line "A row marked short is what its house makes when supplied." (20); "· Impaired" on 36 cards under an outbreak or a siege (Adventuring & Escort 11, Performance & Theater 7, Faith & Worship 6, Taverns 4, Gambling 4, Mercenary Forces 3, News 3, Livestock & Dairy 2), their header "Normally yields" (21). LOST: the cloth, arms and leather goods of 16+ half-way cards (12 textile cards, 8 clothing cards, 5 metalwork, 4 leather); 16 cards whose every output was denied print no Outputs block (their From, Via and state stand).
- **NO NEW WORDING:** every gained line is an existing line, mark or word of its leaf. The veto list is the moves themselves:

| move | three towns it is read in (smallest · largest · a crisis) |
|---|---|
| the vintner "Short of grapes." + "No grapes reach the vintner." (cities and metropolises only: no vintner stands below) | r2r-city-6 · r2r-metropolis-12 · r2s-famine-city-3 |
| the glassblower "Short of glass sand." (towns only) | r2r-town-35 · r2r-town-41 · r2s-famine-town-0 |
| a card "· Impaired" (CC1 (i) a marked output, (ii) every service of its houses marked) | r2r-thorp-41 · r2s-plague_onset-metropolis-0 · r2s-under_siege-hamlet-0 |
| a half-way card's finished goods unprinted | r2r-village-25 · r2r-metropolis-59 · r2s-mass_migration-town-0 |

## THE BOOKS MY CURES MOVE

**The net** (BRIEF-BAR4 amendment 2 with BRIEF-BAR3 amendment 2, the four the last close found, the test files that pin a symbol I changed, my guard; 66 files, run at the tip, every red run alone at 600b7683a):

- **Red at the base and at my tip with the same message (the base's, named, not chased):** `data/tailHouses1Gaps` (1), `generators/generationForkCensus` (3), `generators/pipelinePinnedMode` (3), `generators/tieProseDeclared` (2), `lint/observedShapeReaders.walker` (4), `lint/presumedThings.walker` (1), `lint/proseCorpusBytes` (2), `lint/proseTasteCorruption.walker` (1), `lint/proseWiringCensus.walker` (12), `lint/tuningRegister.walker` (1), `lint/writerReach.walker` (6): 36 arms.
- **Red at my tip only: four, each re-keyed by identity or scoped, the assertion unchanged, each with its dated note in the file; green after:**

| test · arm | cause | the re-key | towns |
|---|---|---|---|
| `components/crisisStoppedRows.test.jsx` · S5 keep pairs | (b): S7's "the vintner's and the glassblower's gaps … the record's fault, unmarked" is the fault (b) cures; r2r-city-44's vintner and r2s-famine-town-1's glassblower are short, truly | the vintner row to r2r-city-1 (its grapes reach it); the glassblower row goes (no town holds one its sand reaches) | 36 of 184 vintner towns of the 720 hold the premise; 0 of 13 glassblower towns |
| `generators/houseInputReaches.test.js` · (M-V) route-fed | (b) NARROWS M-V: the route brings grapes or glass sand only where the need list does not name the good | ROUTE_FED to r2r-town-16, r2r-town-32, r2r-city-1, r2r-city-3 (vintners short of nothing); the three glassblower rows go | the same 36 / 0 |
| `domain/r3c10FoodLinesTrue.test.js` · (d) | (a): none of its six towns' gaps names a house now (each held a finisher by trade) | three census towns added that hold a commercial sawmill and a half-way gap that still names a house: r2r-town-11, r2r-town-42, r2r-city-20 | 31 such towns of the 720 |
| `domain/bar5ChainsLaw3.test.js` · (a) the zero | my guard read a non-craft (a fishmonger, a market's stall) the page detector does not read | scoped to Crafts, as the detector (the audit's precision draw 2); the fishmonger named below | 1 town |

- **Green at my tip:** the cycle baseline (`architecture/layerBoundaries`: no new cycle), `architecture/engineCoreLazyEdge`, `lint/factLayers.walker`, `lint/chainPrintSites.walker` (no `dist/` in the tree), `lint/styleLaw.walker`, `design/deepCraftKillList`, `generators/economicStructure`, `generators/regenDerivedState`, `domain/customContentPresentationClaims`, `domain/defensePostureAgainstItsFacts`, `domain/corpusEcoTailGuards`, `pdf/tailExportsPdf3Batch3`, the three test-corpus walkers (`negativeAssertionAnchor`, `seedLoopTotality`, `proseDrawnAnchors`) and every other file of the net. Both type ratchets green (`tsconfig.full.json` 167 = ceiling 167; `tsconfig.domain-strict.json` 1113 = ceiling 1113; two errors I introduced were cured at their cause); eslint clean on every touched file.
- **Stored figures my cures move (named, none re-taken; each red at 600b7683a already, the round's close re-takes them):**

| test · arm | at 600b7683a | at my tip | door |
|---|---|---|---|
| `build/engineBundleReplay` · bundle vs in-process rows | 390 of 525 differ | 391 of 525 | `npm run build:edge-shared` (the close) |
| `build/engineServiceCore` (or its sibling) · fence settlements | 248 of 360 differ | 252 of 360 | the same |
| `build/generationWorkerLazy` · worker bundle bytes (ceiling 2322103) | 2356121 | 2357545 (+1424) | the chair's B3 ceiling |
| `build/vendorPdfLazy` · entry static closure raw (budget 878554) | 881330 | 881388 (+58) | the first-paint ceiling (owner-gated) |
| `build/vendorPdfLazy` · first-paint gzip (budget 360756) | 362611 | 362612 (+1) | the same |
| `build/vendorPdfLazy` · first-paint Brotli (budget 302830) | 304357 | 304332 (−25) | the same |
| `build/vendorPdfLazy` · the goods roster | red, same message | red, same message | the close |

  `npm run build` passes at both; `npm run verify:dist` refuses at both on the same five files; THE BOOT SMOKE PASSES at both. `dist/` removed after.
- **THE REFERENCE (BRIEF-BAR5 amendment 3): 63 of the 525 configurations move against 600b7683a** (city 24, metropolis 37, town 2), every one in ONE field family, `resourceAnalysis.gaps` (hashed by top-level field, and `economicState`/`resourceAnalysis`/`economicViability` by their second level, at base and at tip). `generatorGoldenMaster` and the golden-derived files are red at the base already and are not re-taken.

## REGISTRATIONS OWED

- `tests/domain/bar5ChainsLaw3.test.js` is under `tests/domain`, not `tests/generators`: no mutation-manifest entry owed.
- Goods roster: no new import of a goods module in `src/` (`halfWayGoods.js` imports nothing; the guard test imports `data/goods/chains.js`, a test).
- `src/domain/facts/halfWayGoods.js` is a NEW fact module (layer 2, no imports; `factLayers.walker` and `engineCoreLazyEdge` green).
- The annex: my section holds no block of `RECEIPT_POOLS_DOSSIER_STATE.md`; no desk file regenerated.

## WHAT IS LEFT, IN ORDER

1. **THE PARTIAL ROW THE GAP NO LONGER BACKS (the next fact, mine to name, not counted by the detector).** (a) removes a half-way gap where a finisher by trade stands, but the Resources tab's "Partial · <material> · … | Partial processing - worked only to semi-finished goods" row is written from `exploitation.partiallyExploited` by supporter count (`resourceGenerator.js :: evaluateInstitutionDeps`, its partial loop) and still prints there: 43 such rows in 43 towns of the 720 at base, 102 in 93 at my tip (+59); the fresh 300: 19 → 31. The cure is the same fact read once more: the partial row (and `evaluateInstitutions`' classification) reads `tradeFinisherIn`. It moves `resourceAnalysis.exports` (a declared move to measure, with its draws) and the Resources cards' grade; not made here (budget).
2. **The fishmonger beside "Needed, and not brought in: fish"** (r2s-religious_conversion-village-0, 1 town of the 720): a market's stall whose own trade is the route (`ROUTE_HOUSE_TAGS`), so (b) leaves it the route; the page detector reads Crafts only and does not count it; LAW 3's next reader should say whether a market's stall is "brought in" by its own route where the need list names its good.
3. **R2's rung** (the apothecary rung, 1 row of the 720, excluded by name): the chair's ruling R2 keeps the rungs other than the sawmill's out of their chains; a measured kind for its own round.
4. The PDF and the journal print the chain's STATE through `chainAsShown`; whether the PDF's chain flow prints its OUTPUTS from the shown chain is the PDF seat's to read (`src/pdf/sections/SupplyChainFlow.jsx`).

## FOR THE OWNER, IN PLAIN WORDS

The page told two stories about the same workshops. A town with a fuller was told its wool "stops half-way: no fulling mill finishes it"; a vintner was printed selling wine while the same page said grapes were needed and not brought in; a mercenary company's card said "Operational" while its escort service was marked stopped by the siege. Each pair now reads one fact: the gap looks for the house by its trade, the vintner without grapes is marked short of them, and a card whose services are stopped says it is impaired. Over the census's 720 towns and 300 fresh ones the four kinds read zero; the saved record changed only in its list of gaps.
