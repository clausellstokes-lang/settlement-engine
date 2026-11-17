# BAR6-SEAM-PDF · HAND-BACK · the PDF and the journal read what the tabs read

The seat, 2026-11-17. Base: `lane/join-2026-11-14` at `cfc2b680a` (the tip given; no later tip). Branch
`lane/bar6-seam-pdf-2026-11-17`, three commits: `fe9df9016` (items 1 and 3), `8d0c1924b` (the guard), and this hand-back.
Files: `src/pdf/lib/viewModelBodySlices.js`, `src/pdf/lib/viewModel.js`, `src/pdf/sections/DefenseSecurity.jsx`,
`tests/pdf/seamPdfReadsTheTabs.test.jsx` (new). No leaf edited. No file under `src/domain/facts/`. The journal
(`src/foundry/journalPages.js`) needed no edit: it prints the economics slice's field, which the cure reads.

THE MEASURE. My section names no runner, so I measured with a probe of my own. It lives in scratch and is not committed:
it births each seed as the census does (`seedcfg.mjs`), builds the PDF's view model, renders the sections' text and the
journal, and compares them with the tab's reading. It ran over the 150 (`bar0-<shape>-rand-27..41`, the ten shapes) and
the census's 720, at the base and at the tip.

## THE ITEMS

| # | item | 150: base → tip | 720: base → tip | guard | state |
|---|---|---|---|---|---|
| 1 | the PDF's ACTIVE CRIMINAL OPERATIONS print each operation's house mark through `defenseDisplay.js :: criminalOpMark`, before its note, as the Defense tab does | 7 operations in 7 towns printed bare → 0 | 4 in 4 → 0 | `seamPdfReadsTheTabs` (1): 10 towns; each operation's `mark` equals the leaf's, and a mark prints immediately after the name | DONE |
| 2 | the PDF's Outlook list "N institutions critically impaired by siege" reads the tab's helper | the list disagrees with the tab in 16 of the 18 towns that print one → 16 | 11 of 11 → 11 | none (the arm would be red) | LEFT (below) |
| 3a | the complexity label: every PDF print of it (`economicsSlice.economicComplexity`, which the Economics chapter and the journal read; `identity.anchor.complexity`, the daily-life anchor; `situation.economy.complexity`; the raw block's field) reads `labelBands.js :: complexityLabelShown` | 2 towns printed the stored "Subsistence — survival economy" beside a Comfortable or Wealthy purse → 0 | 8 → 0 | `seamPdfReadsTheTabs` (3): the slice, the anchor, and the Economics chapter's, daily-life page's and journal's text show the twin and never the stored label | DONE |
| 3b | the service card reads `economicsCrisisMarks.js :: serviceCardShown` | no print site | no print site | — | LEFT (below) |

The guard is red at `cfc2b680a` (9 of 16 fail: the three complexity towns, and every operation case, because the view
model carried no mark) and green at the tip (16 of 16).

## WHAT A READER SEES (new or changed lines, three towns each)

- PDF, Defense & Security, ACTIVE CRIMINAL OPERATIONS: under "Smuggling Network", the line "Stopped by the siege."
  (printed red, before the note) in bar0-city-under_siege+famine-rand-34, r2s-under_siege-metropolis-0 and r2r-metropolis-14.
  Seven towns of the 150 print it (bar0-city-under_siege+famine-rand-30 to -36) and four of the 720.
- PDF, Economics chapter tile, Daily Life anchor and the journal's Economics page: "Complexity: Subsistence economy" where
  the stored label "Subsistence — survival economy" printed beside a purse past survival. It prints in
  bar0-hamlet-calm-rand-40 (Comfortable), r2r-hamlet-47 (Wealthy) and r2s-plague_onset-thorp-3 (Comfortable).

## LEFT, BY NAME

- **Item 2: the PDF's Outlook list.** The helper RECORD names (`ViabilityTab.jsx :: impairedListMarked`) is a private,
  unexported function inside a component file. It is not a leaf, and it is on no list of mine, so the PDF cannot import
  it. I wrote no second copy: the brief says the PDF reads the same helper. WHAT IS MISSING: the helper and its regular
  expression `IMPAIRED_LIST` need to move to a display leaf (beside `stressEffectsOf` in
  `src/domain/display/validationOnPage.js`, which both readers already import), be exported, and be imported back by
  `ViabilityTab.jsx`. The PDF's cure is then one line in `src/pdf/lib/viewModel.js :: viabilitySlice`:
  `stressEffectsOf(v).map((i) => impairedListMarked(i, s)).filter(Boolean)`, plus an arm in `seamPdfReadsTheTabs`.
  MEASURED, the same at the base and the tip: 16 towns of the 150 (bar0-city-under_siege+famine-rand-27 to -41 except
  -39, and bar0-hamlet-under_siege-rand-35 and -39) and 11 of the 720 (r2r-metropolis-14, r2s-under_siege-village-3,
  -town-0, -town-1, -town-3, -city-1, -city-2, -city-3, -metropolis-0, -metropolis-1, -metropolis-2). Example:
  bar0-city-under_siege+famine-rand-34's tab names 5 houses; the PDF names the record's 15, Mercenary quarter among them.
- **Item 3b: the service card.** Neither the PDF nor the journal prints the Economics tab's service-economy cards. Nothing
  under `src/pdf/` or `src/foundry/` reads `economicState.institutionalServices`, and the economics slice's
  `serviceChains` is built but printed nowhere. The PDF's only EXPORT tag is the CHAIN card's (`Services.jsx :: ChainCard`,
  from `chain.exportable`). That is a chain record. `serviceCardShown(town, svc, ownState)` takes a service card and the
  state of its own houses (`chainStateShown.js :: serviceStateShown`), so its signature does not fit. No stored state
  prints against it. Printing the service cards in the PDF would be a new section (a new capability, not a repair): the
  owner's.

## THE BOOKS MY CURES MOVE

None stored. Both cures are readings at print: no saved field moves, none of the 525 configurations moves, no new field,
nothing in `assembleSettlement.js`. The PDF's golden view model (`tests/pdf/goldenViewModel.test.js`) and the field
manifest walker are green at the tip. For the close: a mutation-manifest entry for the new guard
(`tests/pdf/seamPdfReadsTheTabs.test.jsx`), if the manifest registers PDF guards. I did not touch the manifest.

## THE NET (S7, each alone, to a file through `sh scripts/gate-tail.sh`, at the tip)

| gate | tip |
|---|---|
| `npm run typecheck:domain:strict` | exit 0 |
| `npm run typecheck:ratchet` | exit 0 |
| `npx eslint` on the four changed files | exit 0 |
| `npx vitest run tests/architecture` | 21 files, 347 tests, green |
| the build and the build tests | not run: no file under `src/domain/facts/` and no import in one was touched |
| my guard `tests/pdf/seamPdfReadsTheTabs.test.jsx` | 16 of 16 (red at base, 9 of 16) |
| the two rounds' guards (`tests/{domain,generators}/bar5*`, `bar6*`) | 18 of 19 files green; `tests/domain/bar6ScenesGoods.test.js` ("each good reads the page's own lists …") red at the base and the tip with the same message: SEAM-SCENES's item 4, named |
| `node scripts/presumption-classes-door.mjs --check` | base and tip alike: `hits 1805 · banked 1938 · fresh 4 · stale 137 · ceiling 1938`; none of the four fresh lines is in `src/pdf` |
| `node scripts/presumed-things-door.mjs --check` | base and tip alike: `fresh 39 · stale 72 · first-register stale 6 · banked 4688 · strips fresh 0 stale 0 banked 107`; none in `src/pdf` |
| outside the net: `npx vitest run tests/pdf` | 75 of 77 files green; `tailExportsPdf3Batch3` ("each UNSHORT row", r2s-religious_conversion-hamlet-0) red at base and tip with the same message, named; `tailExportsPdf2Batch2` is SEAM-ECON's re-key |
| outside the net: `npx vitest run tests/foundry` | 9 files, 81 tests, green |

## WHAT IS LEFT, IN ORDER

1. Item 2, the PDF's Outlook list: the move of `impairedListMarked` to a display leaf (a file outside this seat's list),
   then the one line in `viewModel.js :: viabilitySlice` and its arm. 16 towns of the 150 and 11 of the 720.
2. Item 3b: no print site. Printing the service cards in the PDF is the owner's call.
3. `tests/pdf/tailExportsPdf3Batch3.test.jsx`'s UNSHORT arm (r2s-religious_conversion-hamlet-0 prints a short mark on
   its Institutions and Services pages), red at the base: named, not chased.
