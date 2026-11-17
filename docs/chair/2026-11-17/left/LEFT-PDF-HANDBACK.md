# LEFT-PDF · HAND-BACK (the sixth chair's round of what earlier seats left; BRIEF-LEFT, 2026-11-17)

Seat LEFT-PDF. Base `lane/point33-candidate-2026-11-17` at e0242a12a (tree 4a9735d2f9). Branch
`lane/left-pdf-2026-11-17`; tip at the end of this file. Nothing merged. THE ONE FACT: the PDF's and the journal's rows
read the tab's own function (`economicsCrisisMarks.js :: incomeDescShown / incomeMarkShown / chainOutputsOnCard`,
`npcComponents.jsx`'s mark through the view row, `houseInputAtHand.js :: impliedGroundsOnPage`). No new leaf was needed:
the PDF's existing reader (`pdf/lib/crisisMarksOnPage.js`) reads the tab's two halves of an income share's mark, and the
journal calls that reader.

## THE ROWS (measured first by the seat's probe: the PDF's and the journal's text against the tab's own reading)

The probe (scratch, not committed) reads every town of a corpus, builds the view model, renders the PDF's Economics and
Services chapters to their text leaves (the seam test's form) and builds the journal; "as printed" means it reads those
leaves and those pages. Base e0242a12a / tip. Populations: the census's 720; the 150 (`rand-27..41`) and the thirty
(`rand-42..44`), born at the base by PAGE-COPY's `births.mjs` (the records are the same at the tip: no stored byte moves).

| row | what a reader met at the base | 720 base → tip | 150 base → tip | 30 base → tip |
|---|---|---|---|---|
| L1 · the income share's mark | the PDF and the journal printed the crisis half alone (`rowStoppedBy`); a share the tab marks "Short of iron." printed bare; a share marked by the siege's partial reading (`incomeKindShown`) printed bare | PDF 29 · journal 28 → **0 · 0** | 8 · 8 → **0 · 0** | 3 · 3 → **0 · 0** |
| L1 · the row's text (LEFT BY NAME: see below) | an unmarked share's stored short twin ("Little metal is worked here while the metal trade is short of what it needs.") prints in the PDF where the tab prints the trade's ordinary line ("Metal is smelted or worked here.") | 94 towns → 94 (unchanged) | 19 of the 180 → 19 | (in the 180) |
| L2 · the chain card's outputs | the PDF's cards (Services' flow line, the Economics chapter's flow rows) listed outputs by `chainOutputsShown`; a refused card named a service the page keeps on offer ("Normally yields: Herbal remedies" beside an apothecary's "Herbal remedies" on offer) that the tab's card withholds (CY1) | 125 → **0** | 27 → **0** | 7 → **0** |
| L3 · the house's mark on the journal's person page | the tab's card and the PDF's card print the mark under the house line (CM1); the journal's person page did not | 72 → **0** | 27 → **0** | 8 → **0** |
| L19 · the PDF's land list | the view rows (the PDF's chapter and the journal read them) held the stored lists alone: a ground the houses tell used up was not under "Depleted", a ground a house proves was nowhere | 172 → **0** (view rows; the journal's rows 172 → 0) | 31 → **0** | 10 → **0** |
| L29 · the Outlook's impaired list | cured at the base by BAR7-CARDS (`impairedListShown.js`, read by the tab and `viewModel.js :: viabilitySlice`) | 0 → 0 (11 towns hold the line) | 0 → 0 | 0 → 0 |

L29 IS CURED AT THE BASE (BAR7-CARDS item 3): dropped as a cure; my guard's arm holds it and passes at the base.

### What each cure is (files: all on my list)

- **L1** · `src/pdf/lib/crisisMarksOnPage.js`: `stoppedOnPage` and `shortOnPage` read, for kind `income`, the tab's two
  halves (`incomeKindShown`, `incomeShortOf`), so `markOnPage`, `stoppedWordOnPage` and `ordinaryTimesOnPage` (the head
  line, now with "A row marked short is what its house makes when supplied." where a share is short) say what the tab
  says; `incomeMarkOnPage` added (the tab's `incomeMarkShown`). `src/pdf/sections/EconomicsTrade.jsx`: the income row
  prints `incomeDescShown(settlement, share)`, the tab's own function (the tab's call, EconomicsTab.jsx:413, adds the
  ordinary-line source the PDF may not reach).
  `src/foundry/journalPages.js`: the share's words after its name read the same reader ("curtailed, short"; a failed
  venture's share its mark's first word, "failing"); the page's head line takes the short sentence.
- **L1's TWIN ROW, TRIED AND RETRACTED.** The tab's row is `incomeDescShown(s, src, ordinaryIncomeLineOf)`: under no mark a
  stored short twin prints the trade's ordinary line (BAR7-ECON after its second reader, point 1). I read it in the PDF at
  afb259a34; `tests/architecture/layerBoundaries.test.js` ("src/pdf reaches only the censused trees") went red at the tip:
  `ordinaryIncomeLineOf` lives in `src/generators/economy/incomeLineSiblings.js`, a tree `src/pdf` may not reach, and
  `src/domain` may not re-export it (`tests/build/domainGeneratorsBoundary.test.js`, shrink-only). Retracted at f259c102f:
  the PDF's row is `incomeDescShown(settlement, share)` (the tab's mark, both halves, before the record's text). LEFT BY
  NAME (item 3 below): 94 towns of the 720 and 19 of the 180 print a short twin bare in the PDF. Its cure is the
  ordinary lines moved into a leaf both trees reach (the layering's owner's call). The guard's floor for that row went
  with the retracted cure (it lived only in afb259a34).
- **L2** · `src/pdf/sections/Services.jsx`, `src/pdf/sections/SupplyChainFlow.jsx`: `chainOutputsOnCard` in place of
  `chainOutputsShown` (the town given; without it, as before).
- **L3** · `src/foundry/journalPages.js :: notableNpcPage`: one line nested under the House row, `  - *<mark>*`, from the
  view row's `houseMark` (the PDF card's own field), only where the house prints.
- **L19** · `src/pdf/lib/viewModelBodySlices.js :: resourcesSlice`: `nearbyDepleted` holds the stored depleted list and
  the grounds `impliedGroundsOnPage` tells used up; `nearbyAbundant` leaves them; NEW VIEW FIELD `nearbyProven` (display
  only, the view model, not the saved record): the grounds a house proves that the stored list does not hold.
  `journalPages.js :: resourcesPage` prints them in its "Nearby resources" row (the journal's row carries no word of
  plenty). **LEFT BY NAME: the PDF chapter's print of `nearbyProven`.** The chapter that prints the land list is
  `src/pdf/sections/ResourcesProduction.jsx` (NEARBY RESOURCES), which is on no seat's list. Its one hunk: a
  `<ResourceRow kicker={null} tone="muted" items={r.nearbyProven} customNames={r.nearbyCustom} />` row, beside the besieged
  unlabelled row, guarded by `r.nearbyProven?.length > 0` and added to the section's condition. Until it lands the PDF's
  chapter prints the used-up grounds under "Depleted" (cured) and the proven ones not at all (134 towns of the 720, 33
  of the 180 hold one). `src/pdf/sections/Overview.jsx` (named by the row) prints its geography block in none of the
  720 (`resourceAnalysis.nearbyResources` and its terrain lists are empty in every record): no line; not touched.
- **L19's other readers** (not mine; one grep each, `nearbyResources|nearbyResourcesDepleted|impliedGrounds`):
  `facts/registeredWords.js` (5 lines: a register atom's predicate, "its atom waits": prints no line);
  `facts/leadingSourceSpent.js` (5: a fact leaf read by `factsOf.js`: prints no line itself; its callers' lines read the
  stored depleted list); `facts/chainCarrier.js` (4: a fact leaf: no line); `display/tracePresentation.js` (1: the trace
  label "Nearby resources" for a trace key: prints a label, not the list); `display/tradeListDisplay.js` (1, line 452:
  `landFailed`, a famine's failed grounds among the stored list: prints no ground; it decides whether a good is "produced
  locally"); `components/new/dailyLifeLogic.js` (1: magic presence: no line); the world pulse
  (`worldPulse/institutionLifecycleResourceRead.js`: the lifecycle's reading of the stored lists: no printed line).

## THE GUARD · `tests/pdf/leftPdfReadsTheTabs.test.jsx` (new)

Fourteen towns of the 720 and seven of the 150, born in the test; every arm collects every failure
(`collectSeedFailures`); each arm has a floor that it bites (shares marked ≥ 5, short ≥ 3, rows the tab prints otherwise
≥ 6; towns withholding ≥ 4; person pages ≥ 40 and marked ≥ 5; proven grounds ≥ 3, used up ≥ 2; impaired lists ≥ 3);
negatives r2r-village-0 and bar0-village-calm-rand-28 print none of these and agree. The arms read the tab's own functions
at run time (`incomeMarkShown`, `incomeDescShown`, `chainOutputsOnCard`, `houseMarkShown`, `impliedGroundsOnPage` with the
Resources tab's three lists line for line, `stressEffectsShown`), so a later seat's change to those leaves is followed,
not frozen. AT THE BASE: L1 7 of 21 towns red, L2 5, L3 11, L19 7; L29 and the negatives GREEN (L29 is held, not cured).
AT THE TIP: 7 of 7 green.

## N4 · THE OWNER'S PAGE AND THE SHARED PAGE

Over the 720 and the 180, per town: the reading on the record, on `toPublicSafe(record)` and on
`projectShareVeil(toPublicSafe(record), null)`: the PDF's income marks, the cards' outputs, the land list's view rows, the
journal's income lines and head line, its land rows and its person pages' mark lines: ALIKE in every town (0 differ). The
person rows (`houseMark`, BAR7-CARDS's field, which the journal's new line reads) differ in 318 towns of the 720 and 76 of
the 180 (2,288 and 534 rows over the two shared forms): in EVERY one the shared page veils the house itself (a criminal
house: "Smuggling network", "Black market", "Street gang"), and its mark goes with it. No row prints a house with another
mark, or a mark without its house.

## MEASURE (R4) · the runners

PAGE-COPY's `census3.sh --count-only` at the base (lpbase, e0242a12a) and at the tip (f259c102f; a6d35b74f changes a
comment and a test only), the eight runners each run from the base's copy (the detectors are untouched by me), over the
same dumps' populations. EVERY RUNNER'S OUTPUT IS BYTE-IDENTICAL AT THE BASE AND THE TIP over the thirty and the 150
(`diff` of each runner's printed counts: run-a, runB, runC, runD, runE, runF, runH, runI): no rule's count rises, none
falls (the runners read the dossier tabs; my cures move the PDF and the journal only). The lines read at the base:

| runner | thirty | 150 |
|---|---|---|
| run-a (LAW 1, 4) | towns 30 · instances 589 | towns 150 · instances 2560 |
| runB (LAW 2, 3) | instances 2 | instances 0 |
| runC (LAW 6, 7) | instances 5 in 5 towns | instances 24 in 21 towns |
| runD (LAW 8) | 3 towns · 7 instances | 8 towns · 18 instances |
| runE (LAW 9) | 0 counted | 0 counted (11 apart) |
| runF (LAW 10) | 18 instances | 37 instances |
| runH (LAW 8 widened) | 2 towns · 2 instances | 8 towns · 9 instances |
| runI (BAR7-AUDIT-I) | 0 counted (49 apart) | 0 counted (198 apart) |

The 720 (rendered at the base and at f259c102f): every runner's output byte-identical as well (run-a 13,793 instances;
runB 0; runC 119 in 108 towns; runD 23 towns · 49; runE 0 counted, 29 apart; runF 193; runH 17 towns · 19; runI 1 counted,
1,084 apart). Sections that move in the 720: `Journal/Resources & Production` 172 towns, `PDF/EconomicsTrade` 150,
`PDF/Services` 125, `PDF/ResourcesProduction` 43, `Journal/Economics & Trade` 29, `Journal/NPC 1/2/3` 37/18/27; no tab
section moves.

WHAT MOVES ON THE PAGE (each dump's sections compared, base to tip): only `PDF/EconomicsTrade`, `PDF/Services`,
`PDF/ResourcesProduction`, `Journal/Economics & Trade`, `Journal/Resources & Production` and `Journal/NPC <n>` (the 150:
31, 27, 6, 8, 31 and 16+14+8 towns; the thirty: 9, 7, 4, 3, 10 and 7+4+2). One tab section differs in one town of each
(`Systems/Power`, bar0-hamlet-calm-rand-42 and bar0-thorp-calm-rand-27): the premium "Patron deity" panel present in one
render and absent in the other, in a tab I did not touch (the render's timing, not a line of mine).


## CONTROLS (three towns an arm, printed before and after: PAGE-COPY dumps of the 720, base e0242a12a → tip f259c102f)

| arm | town | before | after |
|---|---|---|---|
| L1 | r2r-hamlet-10 | PDF: "Fish & Maritime Produce · 10%" (no line); journal "Fish & Maritime Produce: 10%" | PDF: "Short of fish."; journal "Fish & Maritime Produce (short): 10%" · CHANGED |
| L1 | r2r-metropolis-14 | PDF "Curtailed by the siege. Little metal is worked here …"; journal "(curtailed)" | PDF "Curtailed by the siege. Short of iron ore. Little metal …"; journal "(curtailed, short)" · CHANGED |
| L1 | r2r-town-8 | PDF "Little metal is worked here while the metal trade is short of what it needs." | the same · STANDS (the twin row, LEFT BY NAME item 3) |
| L2 | r2r-town-1 | Services "… » Normally yields: Herbal remedies, Potions and elixirs"; flow "Normally yields: Herbal remedies / Potions and elixirs" | "… » Normally yields: Potions and elixirs"; flow the same · GONE |
| L2 | r2r-town-16 | "Tailor's guild + Dyer » Normally yields: Finished clothing, Dyed cloth, Tailored garments" | "… Finished clothing, Tailored garments" · GONE |
| L2 | r2s-infiltrated-village-0 | "Fuller + Dyer » Normally yields: Finished clothing, Dyed cloth" | "… Normally yields: Finished clothing" · GONE |
| L3 | r2r-thorp-45 | journal NPC 1 "House: Woodcutter's camp", NPC 2 "House: Fishing community", no mark | "Curtailed by the siege." / "Stopped by the siege." under each house line · CHANGED |
| L3 | r2r-hamlet-23 | NPC 2 "House: Stone quarry" | "Short of stone." under it · CHANGED |
| L3 | r2r-village-13 | NPC 1 "House: Mine" | "Short of its materials." under it · CHANGED |
| L19 | r2r-hamlet-8 | journal "Nearby resources: Deep Natural Harbour, Coastal Timber, Magical Ley Line Node, Fishing Grounds" | "…, Fishing Grounds, Iron Ore Deposits" · CHANGED (the PDF chapter: STANDS, LEFT BY NAME item 1) |
| L19 | r2r-hamlet-23 | PDF NEARBY RESOURCES "Abundant: Open Grazing Land, Ancient Grove, Precious Metal Veins"; journal no Depleted row | PDF "Depleted: Stone quarry", then Abundant; journal "Depleted: Stone quarry" · CHANGED |
| L19 | r2r-village-14 | PDF and journal "Depleted: Hunting Grounds, Coal or Peat Deposits"; journal near "River Fisheries, Hot Springs" | "Depleted: Hunting Grounds, Coal or Peat Deposits, Marshlands"; journal near "…, Open Grazing Land" · CHANGED |

## THE STORED FIGURES

`tests/pdf/goldenViewModel.test.js` and its fixtures: 4 passed at the tip; my cure moves **0** of its rows (the view
model's new `nearbyProven` is not among its shared fields). No stored record byte moves (no generator touched: N3 does not
apply). No reference file, register, census or ceiling re-taken.

## NET (each alone, through `sh scripts/gate-tail.sh`, to a file; base FIRST, then the tip a6d35b74f)

| gate | base e0242a12a | tip |
|---|---|---|
| `npm run typecheck:domain:strict` | exit 0 | exit 0 |
| `npm run typecheck:ratchet` | exit 0 | exit 0 |
| `npx eslint` on my changed sources and tests (8 files) | — | exit 0 |
| `npx vitest run tests/architecture` | exit 0 · 347 | exit 0 · 347 (red at f259c102f's parent afb259a34: `layerBoundaries` "src/pdf reaches only the censused trees" — the retracted import; green since) |
| my guard `tests/pdf/leftPdfReadsTheTabs.test.jsx` | 4 of 7 red (L1 7, L2 5, L3 11, L19 7 of 21 towns); L29 and the negatives green | exit 0 · 7 |
| the bar5 and bar6 guards (21 files, 171 tests) | 1 red: `bar6MarksLaw8` (a) "an instance not left by name: [17]" | the same 1, the same message: NAMED, not chased |
| the readers of my files (every test under `tests/pdf`, `tests/foundry`, and the 23 other test files that import one of my files or hold the round's cards guards: 110 files, 983 tests), by name | 2 red: `bar3ServicesRows` "each row prints with its mark before it"; `foundryExportsFishTrade` F11 soak1k-1652 (on the line's list at ed1d43529) | the same 2; NONE NEW. `chainStateThreeSurfaces` (outputs arm) went red at f259c102f and is RE-KEYED BY IDENTITY at a6d35b74f (below) |
| `npx vitest run tests/lint` WHOLE, by name (`failnames.mjs`, `comm`) | 30 files · 68 tests red · 71 names | 30 files · 68 tests · 71 names: NONE NEW (`ledgerCitationIntegrity`'s [FILE] line differs only by the worktree's path). `economyReadModelCoverage` went red at f259c102f (my JSDoc named `economicState.incomeSources[]`, which the census reads as a reader) and is green at a6d35b74f (the comment reworded; the file reads only the row handed to it) |
| the classes door `--check` | hits 1787 · banked 1938 · fresh 0 · stale 151 | **the same line** |
| the things door `--check` | fresh 39 · stale 72 · first-register stale 7 · banked 4688 · strips fresh 0 | **the same line** |
| ONE `npm run build` (a PDF chapter now imports `economicsCrisisMarks.js`), then `vendorPdfLazy`, `bootSmoke` | `vendorPdfLazy` "every consumer in the tree is declared" red: `crisisStoppedRow.js` absent from the goods roster | built · 48 passed, 17 skipped · the same 1 red, the same message: NAMED |

RE-KEYED BY IDENTITY (R8): `tests/pdf/chainStateThreeSurfaces.test.jsx :: outputDisagreements` keyed "the tab's card" on
`chainOutputsShown`; the card reads `chainOutputsOnCard` (BAR7-ECON item 4). The claim ("every output a PDF row or card
prints is the tab card's") and its form are kept; a dated note beside it.

N6: `lane/checks-2026-11-17` publishes the line's tip ed1d43529 only (no list at my base yet); of my named reds,
`foundryExportsFishTrade` F11 is on it.

## N5 · THE SCRATCH MERGE

`lane/join-2026-11-14` at ed1d43529 is an ancestor of my base (e0242a12a = ed1d43529 + BIRTH-3): `git merge --no-commit`
at my tip says "Already up to date". CLEAN with ed1d43529; my guard there is my tip's (green); no test of mine modified.

## LEFT BY NAME

1. `src/pdf/sections/ResourcesProduction.jsx` (no seat's file): the one row printing `nearbyProven` (above). 134 towns of
   the 720 hold a proven ground the PDF's chapter does not print.
2. The person row's house veiled on the shared page with its mark (N4, above): true by the veil's design; named only.
3. L1's twin row (above): 94 towns of the 720, 19 of the 180; needs the ordinary lines in a tree `src/pdf` reaches.

## NEW OR CHANGED LINES A READER SEES (three towns each; all in the PDF and the journal, none on a tab)

1. The PDF's income share's mark, both halves ("Short of fish.", "Curtailed by the siege. Short of iron ore. …"):
   r2r-hamlet-10, r2r-metropolis-14, bar0-city-wartime-rand-42 ("Short of wool. Cloth is woven or finished here.").
2. The PDF's and the journal's head line takes "A row marked short is what its house makes when supplied." where a share
   is short: bar0-city-wartime-rand-42, bar0-town-occupied-rand-44, r2r-hamlet-10.
3. The journal's share words "(short)", "(curtailed, short)", "(curtailed)" (the siege's partial reading):
   r2r-hamlet-10, r2r-metropolis-14, bar0-city-under_siege+famine-rand-43 ("Timber Trade (curtailed): 2%").
4. The PDF's chain cards drop an output the tab's card withholds: r2r-town-1, r2r-town-16, bar0-city-under_siege+famine-rand-42
   ("Garrison + Professional city watch » Normally yields: Weapons training").
5. The journal's person page: the house's mark under the house line ("Curtailed by the siege.", "Short of stone.",
   "Failing: a failed venture."): r2r-thorp-45, r2r-hamlet-23, bar0-village-calm-rand-43.
6. The land list: a used-up ground under "Depleted" in the PDF and the journal, and the resources head sentence names it
   ("The nearby stone quarry is used up."; "Three nearby resources are used up: grain fields, iron deposits and stone
   quarry."): bar0-hamlet-calm-rand-42, bar0-city-under_siege+famine-rand-42, r2r-hamlet-23.
7. The journal's "Nearby resources" row names the grounds a house proves: r2r-hamlet-8 ("Iron Ore Deposits"),
   bar0-hamlet-calm-rand-43 ("Open Grazing Land, Managed Woodland"), r2r-village-14.

DECLARED MOVES: none on the stored record (no generator, no saved field; the view model's `nearbyProven` is display
only). Books moved: `tests/pdf/chainStateThreeSurfaces.test.jsx` (one re-key, above). Reference files: none.

New vocabulary: none. No new atom, no new saved field, nothing in `assembleSettlement.js`, `vite.config.js`,
`package.json`.

TIP: the commit that carries this file on `lane/left-pdf-2026-11-17` (its code is a6d35b74f; this commit adds the hand-back only).
