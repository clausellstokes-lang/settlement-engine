# BAR8 · PDF-2 · hand-back (seat PDF-2, branch lane/bar8-pdf-2-2026-11-17, base 3b06c724b)

Seat PDF-2 of BRIEF-BAR8 (the sixth chair, 2026-11-17). Base `lane/join-2026-11-14` at 3b06c724bfe1 (POINT 39). Branch
`lane/bar8-pdf-2-2026-11-17`; nothing merged. THE ONE FACT: the PDF's chain cards and the journal's chain row read the
chain THE TAB'S CARD RENDERS (`chainCardUnderSiege(town, c, chainAsShown(c, town))`, EconomicsTab.jsx:119), its houses
as the tab's card reads them (`chainHousesOf` handed the card and the town), and the PDF's land list prints the view
model's proven grounds.

## THE ROWS (measured first and last by the seat's probe: the PDF's text and the journal's pages against the tab's reading)

THE PROBE (scratch, not committed; LEFT-PDF's method): every town of a corpus born at the base by PAGE-COPY's `births.mjs`
(the records do not move: no stored byte is touched), normalized, rendered as `SettlementPDF` (PAGE-COPY's
`render.census3.jsx` walk: one line a Text, function components executed), each chain card's own lines kept apart
(`ChainCard`, the Services chapter; `ChainRow`, the Economics chapter's flow), and the journal built by
`buildJournalPages`; "the tab" is the tab's own functions called as the tab calls them. Populations: the census's 720,
the 150 (`seeds.w150.txt`), the thirty of the seventh read (`seeds.bar7.txt`).

| item | what a reader met at the base | 720 base → tip | 150 base → tip | 30 base → tip |
|---|---|---|---|---|
| 1 · BR10 (3) on the PDF's chain cards | a spent iron card listed the "Mine" the tab's card leaves off (it works another ground of its own) | 18 towns (36 cards: 18 Services, 18 flow) → **0** | 2 → **0** | 0 → 0 |
| 2 · the proven grounds | a ground a house proves (`nearbyProven`) printed nowhere in the PDF's NEARBY RESOURCES | 134 towns (148 grounds) → **0** | 27 → **0** | 5 → **0** |
| 5 · the card's outputs | a PDF card or flow row printed an output the tab's card withholds | 42 towns (77 cards) → **0** | 22 → **0** | 2 → **0** |
| 5′ · "Normally yields" | the PDF's card said "Outputs" where the tab's card refuses its yield (the same cause: the stored chain) | 59 towns (192 cards) → **0** | 30 → **0** | 7 → **0** |
| 6 · the state word | the PDF's card / flow row said "Operational", "Running", "Entrepôt" where the tab's card says "Impaired" | PDF 37 towns (122 cards) → **0**; journal 37 (61 rows) → **0** | 18 · 18 → **0 · 0** | 3 · 3 → **0 · 0** |
| 7 · the journal's head line (a hunk no test caught) | (held: the journal's line is the tab's at the base) | 0 → 0 | 0 → 0 | 0 → 0 |
| 3 · the head line over no short row | WAITS (below) | | | |
| 4 · the income share's ordinary line | WAITS (below): 95 towns of the 720 (108 shares), 16 of the 150, 3 of the thirty print the stored short twin where the tab prints the trade's ordinary line | 95 → (waits) | 16 → | 3 → |

My item 5 count (42 and 22) is wider than the brief's 34 and 18: the probe reads every output any reading of the chain
holds (the stored chain's, `chainAsShown`'s, the record's own list) against the tab's card, and reads both cards; item
5′ is the same fault's second face and was not in the brief's count. Item 1's count is the brief's (18 of the 720).

### What each cure is (files: all on my list)

- **`src/pdf/lib/crisisMarksOnPage.js :: chainCardOnPage(chain, town)`** (NEW EXPORT, display only): the tab's card
  (`chainCardUnderSiege` over `chainAsShown`) and its chip's word (`chainStateOnPage.js :: CHAIN_STATE_WORDS`, through
  `chainStateOnPage(shown, null)`). Without a town, the chain as given.
- **Items 5, 6** · `src/pdf/sections/Services.jsx :: ChainCard`: its word, its outputs and its "Normally yields" read
  `chainCardOnPage(chain, town)`'s chain. `src/pdf/sections/SupplyChainFlow.jsx :: SupplyChainFlow`: the rows are
  `chainCardOnPage(c, town).chain` (so the row's colour, its group's count and order, its outputs). `src/foundry/
  journalPages.js`: the chain row's word is `chainCardOnPage(rec, settlement).word`.
- **Item 1** · `Services.jsx` and `SupplyChainFlow.jsx :: ChainRow` hand `chainHousesOf` `{ chain: <the tab's card>,
  town }` (where a town is given), as `SupplyChainsPanel.jsx :: chainFlowFacts` does for the tab.
- **Item 2** · `src/pdf/sections/ResourcesProduction.jsx`: one row of `r.nearbyProven`, unlabelled (no word of
  plenty), after the besieged grounds and before "Depleted", where the Resources tab prints its proven chips; the
  section's condition holds `nearbyProven` too. The words are the catalogue's (`RESOURCE_DISPLAY_LABELS`), as the
  journal's "Nearby resources" row and the tab print them.
- **Item 8** · `incomeMarkOnPage` removed from `crisisMarksOnPage.js` (exported, no caller; the PDF's row reads
  `incomeDescShown`, the journal `stoppedOnPage` and `shortOnPage`, the same two halves); its import of
  `incomeMarkShown` went with it.
- **Item 7** · no source change: the guard's arm (below) fails when `incomeShort` is dropped from the journal's head line.

`src/pdf/lib/chainStateOnPage.js` (NOT MY FILE) keeps its reading (`chainAsShown` alone) and its word table; its three
callers on my list now read `chainCardOnPage`, and it has no other caller (grep: `src/pdf`, `src/foundry`). Folding
`chainCardUnderSiege` into it would make it the one reading: NAMED, not done.

## THE GUARD · `tests/pdf/pdf2ReadsTheTabs.test.jsx` (new)

Fifteen towns (eleven of the 720, four of the 150), born in the test; every arm collects every failure
(`collectSeedFailures`) and has a floor it bites (cards whose tab card leaves a house off ≥ 6; proven grounds ≥ 5; towns
where a tab card withholds an output ≥ 5 and refused cards ≥ 10; impaired cards ≥ 10 and journal chain rows ≥ 60; towns
whose tab head line carries the short sentence ≥ 2). A journal chain row of no chain of the record is a failure. Negatives
r2r-village-0 and bar0-village-calm-rand-28 (no faults of items 1, 2, 5, 6 at the base) stand beside the anchors. The arms
call the tab's own functions at run time.
AT THE BASE: item 1 red in 3 of 15 towns, item 2 in 7, item 5 in 6, item 6 in 6; item 7 and the negatives GREEN (item 7
HOLDS). UNDER THE MUTATION (the journal's `ordinaryTimesLine(..., incomeShort)` without `incomeShort`, in a scratch copy of
the tip): item 7 red in 3 towns (r2r-metropolis-9, r2r-hamlet-10, r2r-village-13). AT THE TIP: 7 of 7 green.

## RE-KEYED BY IDENTITY (R8; each with a dated note beside it)

- `tests/pdf/chainStateThreeSurfaces.test.jsx`: `outputDisagreements` keys the tab's card on the chain it renders (the
  brief's item 5); `disagreements` keys the tab's state word on it too (my cure made the old key untrue: the card now says
  "Impaired" where the tab's card does, and `chainAsShown` alone said "Running").
- `tests/pdf/leftPdfReadsTheTabs.test.jsx` (its L2 arm): the withheld outputs are read against the tab's card's chain.
- `tests/pdf/tailExportsPdf2Batch2.test.jsx` (rows 11357, 11346, r2s-famine-town-1): what prints instead is the tab card's
  line, "Scarce in the famine. Grain fields » Mills » Normally yields: Baked goods" (the famine leaves the card impaired
  and its yield refused); the false bare line is still not printed.

## NET (each alone, through `sh scripts/gate-tail.sh` or a JSON report read by `failnames.mjs`; base 3b06c724b FIRST, in a scratch worktree; then the tip)

| gate | base | tip |
|---|---|---|
| `npm run typecheck:domain:strict` | 0 (1113, ceiling 1113) | 0 (the same) |
| `npm run typecheck:ratchet` | 0 (167, ceiling 167) | 0 (the same) |
| `npx eslint` on my changed sources and tests | — | 0 |
| `npx vitest run tests/architecture` (the layer law) | 21 files green | 21 files green |
| the rounds' guards (`bar5*`, `bar6*`) | 1 red: `bar6MarksLaw8.test.js` (a) THE ZERO over the 720 | the same one, same name: NAMED, not chased |
| `npx vitest run tests/joins` | 1 red: `labelJoins.test.js` (LEFT-CHAIN's, by name) | the same; I add no label join |
| `vendorPdfLazy.test.js -t "WEAVE ST-2"` | red (the roster lacks `chainHouses.js`: LEFT-CHAIN's) | the same; I add no goods consumer (`chainHousesOf` was already imported by both PDF sections) |
| `tests/lint` by name (N2) | 69 names | the same 69 (`comm`: none tip-only, none base-only; `ledgerCitationIntegrity` red in both for the ledger ref this clone lacks). On the way: `economyReadModelCoverage` went red at my tip because a JSDoc line of mine named `economicState.activeChains` (the walker is a text scan); the comment was reworded at 0564cebbd and the walker is green |
| the doors (R9), last lines | classes `hits 1787 · banked 1938 · fresh 0 · stale 151`; things `fresh 38 · stale 72 · … banked 4688` | the same, line for line: no fresh line of mine |
| `tests/pdf tests/foundry tests/components` by name | 7 names | the same 7 (none mine) |
| my guard | red (items 1, 2, 5, 6) | 7 of 7 green |

No file under `src/domain/facts/` and no import in one is touched: no build was required (R11). N6: the chair's names at
3b06c724b (`lane/checks-2026-11-17`, `landing-36-39-3b06c724b`) hold the three reds above.

## N5 · THE SCRATCH MERGE

`lane/join-2026-11-14` at f86295196 (POINT 40) merged with `--no-commit` into a scratch worktree at my tip 0564cebbd:
CLEAN (no conflict). My guard and the four tests I modified or added there (`pdf2ReadsTheTabs`, `chainStateThreeSurfaces`,
`leftPdfReadsTheTabs`, `tailExportsPdf2Batch2`) and `economyReadModelCoverage`: 38 of 38 green. Aborted; the worktree
removed.

## N4 · THE SHARED PAGE

No shared page renders `src/pdf/sections` or the journal: the player's world book (`utils/generateWorldBook.js`, mode
'player', `toPublicSafe`) has its own writer and imports none of my files (grep). My cures read the record's chains,
institutions and the view model's grounds; no mark or line moves on any tab or on the shared page.

## NEW OR CHANGED LINES A READER SEES (the PDF and the journal only; base → tip, read off the rendered PDF)

1. The PDF card's state word and the journal's chain word take the tab card's "Impaired": r2r-thorp-38 (Foraging &
   Smallholding: "Running" → "Impaired"; journal "*(running)*" → "*(impaired)*"), r2r-thorp-41 (Faith & Worship:
   "Operational" → "Impaired"), r2r-village-50 (Livestock & Dairy: "Running" → "Impaired").
2. A card the tab's card refuses prints its outputs under "Normally yields": r2r-thorp-38 ("Foraging areas » Subsistence
   farming » Normally yields: Honey and beeswax, Foraged goods"), r2r-hamlet-16 ("Scarce in the famine. River fisheries »
   Fisher's landing » Normally yields: River fish, …"), r2s-famine-town-1 ("… » Mills » Normally yields: Baked goods").
3. A card drops an output the tab's card withholds: r2r-village-8 ("Managed woodland » Carpenter » Barrels and
   containers", "Milled lumber" gone), r2r-village-17 ("Charcoal" gone), r2r-village-25 ("Quality tools and weapons").
4. A spent iron card drops the mine the tab's card leaves off: r2r-town-45, r2r-metropolis-9, r2r-metropolis-15
   ("Iron ore deposits (depleted) » Blacksmiths » Normally yields: …"; the flow row the same).
5. The PDF's NEARBY RESOURCES prints the proven grounds, unlabelled: r2r-hamlet-8 ("Iron Ore Deposits"), r2r-hamlet-9
   ("Managed Woodland"), r2r-hamlet-12 ("Open Grazing Land").

## LEFT BY NAME

1. **Item 3 · the head line over no short row (LEFT-MARKS's M3).** The chair's message (21:56 UTC): LEFT-MARKS is on the
   line at f86295196 (POINT 40); build the hunk against the function AS IT IS AT MY BASE, else leave it by name. AT MY
   BASE 3b06c724b `crisisStoppedRow.js :: ordinaryTimesLine(crises, shortMarked)` reads `shortMarked ? SUPPLIED_LINE :
   null`: a boolean only. Handed the rows' readings (an array, always truthy) it would print the short sentence over EVERY
   marked or unmarked chapter, so the hunk cannot go in on my base: LEFT, with the exact hunk. At f86295196 the leaf takes
   `boolean | ReadonlyArray<unknown>` (line 618: an array counts a row short only where a reading is a short mark, never a
   venture's), and the Institutions and Services tabs hand their readings (InstitutionsTab.jsx:386, ServicesTab.jsx:160);
   the Economics tab's `econOrdinaryTimesLine` still hands a BOOLEAN (economicsCrisisMarks.js:303, 306). THE HUNK, for the
   merge point (`src/pdf/lib/crisisMarksOnPage.js :: ordinaryTimesOnPage`, my file), so each PDF chapter hands what its
   tab hands:

   ```js
   export function ordinaryTimesOnPage(settlement, rows, { readings = true } = {}) {
     const marked = [];
     /** @type {Array<string | null>} */ const shorts = [];
     for (const [kind, row] of rows) {
       const crisis = stoppedOnPage(settlement, kind, row);
       if (crisis && crisisMarkText(settlement, crisis)) marked.push(crisis);
       shorts.push(shortOnPage(settlement, kind, row));
     }
     // LEFT-MARKS M3: the rows' short readings, as the Services and Institutions tabs hand them (a failed venture's mark is
     // no short mark); the Economics chapter hands the boolean its tab hands (econOrdinaryTimesLine)
     return ordinaryTimesLine(marked, readings ? shorts : shorts.some((m) => m !== null));
   }
   ```
   with `src/pdf/sections/EconomicsTrade.jsx`'s call taking `{ readings: false }` (Services.jsx:62 and Institutions.jsx:60
   unchanged). MEASURED AT THE MERGE (a scratch worktree at my tip 0564cebbd with f86295196 merged, not committed; the
   records born at my base): the PDF prints the short sentence in 154 towns of the 720 (329 chapters) without the hunk and
   145 (311) with it; the nine towns it leaves are the brief's nine, each in Services and Institutions: r2r-hamlet-26,
   r2r-hamlet-48, r2r-hamlet-57, r2r-town-13, r2r-town-18, r2s-under_siege-city-1, r2s-politically_fractured-hamlet-0,
   r2s-infiltrated-town-1, r2s-wartime-city-3. Items 1, 2, 5, 6, 7 read 0 there too.
2. **Item 4 · the income share's ordinary line, and L7's twin.** The chair's message: J-INCOME is held; no leaf to copy.
   95 towns of the 720 (108 shares), 16 of the 150, 3 of the thirty print the stored short twin ("Little metal is worked
   here while the metal trade is short of what it needs.") where the tab prints the trade's ordinary line ("Metal is
   smelted or worked here."): r2r-town-8, r2r-town-16, bar0-metropolis-calm-rand-45. The hunk, once the leaf
   `src/domain/display/incomeOrdinaryLines.js` is copied byte for byte: `EconomicsTrade.jsx`'s row
   `incomeDescShown(settlement, s, ordinaryIncomeLineOf)` with `import { ordinaryIncomeLineOf } from
   '../../domain/display/incomeOrdinaryLines.js'` (LEFT-PDF's afb259a34 form). The journal's share prints no description:
   nothing there.
3. `src/pdf/lib/chainStateOnPage.js` (not my file): could fold `chainCardUnderSiege` into `chainStateOnPage` and be the
   one reading; its callers on my list read `chainCardOnPage` instead.

NO NEW WORDS: every line above is a word or a row the tab already prints. DECLARED MOVES: none (no generator, no saved
field, no stored figure).

## SECOND BRANCH · lane/bar8-pdf-2b-2026-11-17 (the chair's message of 00:25 UTC on 2026-11-18; base 917c915bc, point 44)

Branch `lane/bar8-pdf-2b-2026-11-17`, cut from the line `lane/join-2026-11-14` at 917c915bc (my first tip 2dac64372 is
in it, with LEFT-MARKS). Nothing merged. The same file list; no new words, no generator, no stored field. Measured over the
census's 720 BORN AT 917c915bc (PAGE-COPY's `births.mjs`), by the same probe, base 917c915bc → tip.

| # | the chair's item | before → after | proof |
|---|---|---|---|
| 1 | item 3 of my section: the head line over no short row (LEFT-MARKS M3) | the PDF prints the short sentence in 154 towns (329 chapters) → 145 (311); the nine towns leave it, each in Services and Institutions: r2r-hamlet-26, r2r-hamlet-48, r2r-hamlet-57, r2r-town-13, r2r-town-18, r2s-under_siege-city-1, r2s-politically_fractured-hamlet-0, r2s-infiltrated-town-1, r2s-wartime-city-3; no other town moves | the guard's new arm renders the Services and Institutions TABS (as `tests/domain/leftMarks.test.js` does) and the PDF's two chapters for the nine and r2r-city-20, r2r-hamlet-27: red in 9 of 11 before the hunk, green after |
| 2 | the reader's MED 1 (a): the L2 arm of `leftPdfReadsTheTabs` read only text after "Normally yields: " | the arm now reads every printed output (the Services flow line's last part; each flow row's `o-` node) | with `Services.jsx`'s card handed `chain` for `onCard` (in `chainYieldRefused` and `chainOutputsOnCard`): red in 4 of 21 (r2s-under_siege-hamlet-3, r2s-under_siege-village-0, r2s-under_siege-town-0 "Goods storage", bar0-hamlet-under_siege-rand-34); restored, green |
| 3 | the reader's MED 1 (b): `chainStateThreeSurfaces :: outputDisagreements`' five seeds held no item-5 card | four seeds added: r2r-village-8, r2r-village-17, r2r-village-25, r2r-thorp-38 | red under the mutation of 2; red with `SupplyChainFlow.jsx`'s rows mapped back to the stored chain (`.map((c) => c)`); restored, green |
| 4 | the reader's LOW 1: the journal paired `e.chains[i]` with `activeChains[i]` by bare index | ONE HUNK (`journalPages.js`): `records` are the record's chains the view model prints (the same `chainPrintName` filter, in its order), used by the chain rows' mark and word | no town of the 720, the 150 or the thirty holds a chain with no print label (0 of 900: the fault is latent, no printed line moves); a CONSTRUCTED-RECORD arm in my guard (a chain of no label put first in three towns) is red in 3 of 3 under the bare index, green at the tip |
| 5 | my guard grew the each-family park count (`sovereigntyLightingContract.walker.test.js`) | the negatives' `test.each` is one plain test looping through `collectSeedFailures` | the walker's message: "expected 113 to be less than or equal to 108" at 917c915bc → "expected 112 …" at my tip; my file is no longer listed |

At the tip the other items of my section read as they did: items 1, 2, 5, 5′, 6, 7 at 0 over the 720; ITEM 4 (the income
share's ordinary line) STILL WAITS for J-INCOME's leaf: 95 towns of the 720.

THE CODE: `src/pdf/lib/crisisMarksOnPage.js :: ordinaryTimesOnPage(settlement, rows, { readings = true } = {})` hands the
leaf the rows' short readings; `src/pdf/sections/EconomicsTrade.jsx` hands `{ readings: false }` (the boolean the Economics
tab's `econOrdinaryTimesLine` hands, so the PDF's Economics head line and the journal's stay the tab's: item 7's arm green).
`src/foundry/journalPages.js`: the `records` filter (above) and its `chainPrintName` import.

THE LINE A READER SEES: "A row marked short is what its house makes when supplied." leaves the PDF's Services and
Institutions chapters where their tabs print it no more (a failed venture's mark alone): r2r-hamlet-26, r2r-town-13,
r2s-wartime-city-3 (and the six others above). No line is added.

### ITEM 4 OF MY SECTION · the income share's ordinary line (the chair's messages of 01:21 and 01:25 UTC: the leaf is pushed)

- `src/domain/display/incomeOrdinaryLines.js` COPIED BYTE FOR BYTE from J-INCOME's 9d344fc9c, in its own commit 2960c5912
  ("the leaf, copied from J-INCOME's 9d344fc9c"; the committed blob is the same object). `src/pdf/sections/EconomicsTrade.jsx`'s
  income row reads `incomeDescShown(settlement, s, ordinaryIncomeLineOf)` with the leaf's `ordinaryIncomeLineOf` (LEFT-PDF's
  afb259a34 form). The journal's share prints no description: nothing there. `incomeLineSiblings.js` untouched.
- Measured (births at 917c915bc): the 720 95 towns (108 shares) → **0**; the 150 16 → **0**; the thirty 3 → **0**. No other
  count moves. The guard's arm reads the TAB'S OWN IMPORT (`generators/economy/incomeLineSiblings.js`) against the PDF's
  row, floor 3 shares: red in 2 of 15 towns without the cure (r2s-plague_onset-city-0, r2r-town-45), green with it. The
  layer law (`tests/architecture`) green.
- RE-KEYED BY IDENTITY (R8): `leftPdfReadsTheTabs` L1's "the tab's row" is the tab's call `incomeDescShown(s, src,
  ordinaryIncomeLineOf)` (the cure made the key without it untrue: r2s-infiltrated-village-0, r2r-town-16).
- THE LINE A READER SEES: an unmarked share prints the trade's ordinary line where the PDF printed the stored short twin
  ("Little metal is worked here while the metal trade is short of what it needs." → "Metal is smelted or worked here.";
  "Little cloth is made here …" → "Cloth is woven or finished here."): r2r-town-8, r2r-town-16, r2r-town-20.
- NAMED, NOT TOUCHED (the chair's word; the owner's answer "Move the entries" is J-INCOME's to carry out): on this branch
  alone the leaf's lines read FRESH in the doors: `presumption-classes-door --check` 3 (`fresh 0` → `fresh 3`: the two cloth
  lines and the sawn timber line), `presumed-things-door --check` 2 (`fresh 38` → `fresh 40`: the local coal and local ore
  lines); `tests/lint/presumptionClasses.walker.test.js` ("no NEW undeclared line") is red at my tip for the same three.
  ALSO NAMED: `tests/lint/ruinFilterRoster.walker.test.js` ("every `.institutions` reader is COMPLIANT or EXEMPT") is red at
  my tip: the leaf reads `town.institutions` raw (line 55, `ordinaryIncomeLineOf`'s roster) and is on no list of that walker;
  J-INCOME's branch carries the same leaf and no row for it. The walker is not my file: the row is the leaf's owner's.

### THE NET OF THE SECOND BRANCH (base 917c915bc in a scratch worktree, then the tip; by name)

`typecheck:domain:strict` 0 / 0; `typecheck:ratchet` 0 / 0; `tests/architecture` green / green; the rounds' guards green /
green; `tests/joins` and WEAVE ST-2 green / green (LEFT-CHAIN's two reds are cured on the line); eslint on my changed files
0. `tests/lint` BY NAME: 69 at the base; at the tip the same 69 plus the two named above (`presumptionClasses` "no NEW
undeclared line", `ruinFilterRoster` "COMPLIANT or EXEMPT"), both the copied leaf's; `seedLoopTotality` is red at the base
and the tip alike (`tests/pdf/seamPdfReadsTheTabs.test.jsx`, not mine); `sovereigntyLightingContract`'s each-family count
113 → 112. `tests/pdf tests/foundry tests/components` by name: the same 7 at the base and the tip. The doors' last lines:
the same but for the leaf's fresh rows (above).

N5 · A SCRATCH MERGE: my tip 4f584c14d with the line's tip 99ca9ad51 and then J-INCOME's tip 771a1a945: CLEAN (the leaf's
identical bytes merge without conflict). My guard, the four PDF tests I changed and `tests/architecture` there: 371 of 372
green; the one red (`leftPdfReadsTheTabs` L1) was the key item 4 made untrue, re-keyed at ac2f98365 and then green there
too. Aborted; worktrees removed.
