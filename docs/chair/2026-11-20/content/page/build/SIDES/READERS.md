# SIDES: every reader of a live tension's side, re-measured on this tree (PAGE-9's builder, 2026-11-20)

EXECUTED at 53bc3d7da (+ the cure 9716feaa7) by `grep -rn "currentTensions\|\.factions"` over `src/`, then every hit read
(the scan `tests/domain/display/tensionShown.test.js` THE GUARD runs over this lane's four directories). It starts from
PAGE-2's census (`git show 837394d8f:docs/chair/2026-11-20/content/page/SIDE-READERS.md`); rows marked NEW are not in it.

## PRINT surfaces in this lane's files: each now calls `tensionShown.js :: tensionSidesShown(document, tension)`

| file :: symbol | surface | audiences (the document it is handed) |
|---|---|---|
| `src/components/new/tabs/HistoryTab.jsx :: TensionRow` (props `t`, `settlement`) | web History tab, "Current Tensions" chips | owner, player view, shared/public page: the page's own `settlement` (`OutputContainer.jsx :: activeSettlement`) |
| `src/components/dossier/DossierSearchResults.jsx :: RENDERERS.tension` (NEW) | web dossier search, a found tension mounted through `TensionRow` | `ctx.settlement` = the search enumeration's document (`dossierSearch.js`: `toPublicSafe` in the player view) |
| `src/components/new/tabs/OverviewTab.jsx` ("Tensions & Conflicts") | web Overview chips | the page's own `settlement` |
| `src/pdf/lib/viewModel.js :: overviewSlice / powerSlice / historySlice` (`parties`) | PDF Overview (`sections/Overview.jsx`, joined " / "), PDF History (`sections/HistoryFounding.jsx :: TensionRow`, "Parties: A  vs  B"), the power slice's copy (printed by no section since X-4) | the document handed to `buildViewModel` |
| `src/foundry/journalPages.js` | Foundry journal: prints a tension's label and description, NOT its sides (no change) | — |

`HistoryFounding.jsx` and `Overview.jsx` read only the view model's `parties`, so they print the reader's words (their
`label`/`humanize` formatting is kept). The `hooks` slice (`viewModel.js`, `tensions: s.history.currentTensions`) is read by
`sections/PlotHooks.jsx` for the tension's LABEL only.

## Readers in this lane's files that print no side (unchanged)

- `src/domain/display/guardLineUnderTheLaw.js :: familiesHeldOf`: stringifies the tensions to test `FAMILIES_NAMED` (not a print).
- `src/domain/display/galleryVeil.js` (the tension kind: sides kept); `src/domain/display/publicSafe.js` (passes `currentTensions`, masks a hidden power's name inside a side).
- `src/domain/display/stateProse/generalStateProse.js` DS-GEN-1: UNMOUNTED.
- `src/components/new/dailyLifeLogic.js`: reads the tensions' `type` only.

## Readers in OTHER seats' files: NAMED, not edited

- The session sheet's three side labels (`src/domain/tension/troubleCast.js :: templateLabelOf`, on origin/lane/frame-5-2026-11-20, not on this line): the chair's ruling, they call the reader at the join.
- `src/domain/dossier/plotHooks.js :: campPartiesOf` (the tension hooks' `parties`, classed against the roster) and `src/domain/coherence/hookTruth.js`.
- `src/domain/dossier/dossierSearch.js` (indexes a tension for search; matches on its description, not its sides).
- `src/domain/coherence/readerBattery.js :: tensionMemoryFindings`; `src/domain/factionRename.js`; `src/domain/institutionRename.js`.
- `src/generators/historyGenerator.js :: buildHistoricalEvent` (the writer) and `src/generators/power/rosterText.js :: settleTensionsToRoster` (drops/merges sides: the reason the reader places a side by its words, not its index).
