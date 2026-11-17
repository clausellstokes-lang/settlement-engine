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

NO NEW WORDS: every line above is a word or a row the tab already prints. DECLARED MOVES: none (no generator, no saved
field, no stored figure).
