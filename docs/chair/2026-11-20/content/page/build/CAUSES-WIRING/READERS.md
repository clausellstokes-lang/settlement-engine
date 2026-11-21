# CAUSES-WIRING, point 1: every reader of a trouble's own sentence (`history.currentTensions[].description`, and `issue`)

PAGE-9's builder, 2026-11-20, EXECUTED by `grep` over `src/` for `currentTensions` and for `.description` / `.issue` on a
tension's receiver, each hit read. The form of `SIDE-READERS.md`. "Lane" = in this lane's files (`src/components/`,
`src/domain/display/`, `src/pdf/`, `src/foundry/`). The chair's condition (b) of 20:44 names six surfaces; each is marked.

## PRINT surfaces

| file :: symbol | surface | audiences (the document it is handed) | lane | status |
|---|---|---|---|---|
| `src/components/new/tabs/OverviewTab.jsx` ("Tensions & Conflicts", `t.description`) | web Overview list (condition (b): "the Overview list") | owner, player view, shared/public: the page's `settlement` | yes | to wire |
| `src/components/new/tabs/HistoryTab.jsx :: TensionRow` (`t.description \|\| t.issue \|\| t.type`) | web History tab; also the dossier search's found tension (`DossierSearchResults.jsx`) | as above; the search's `ctx.settlement` | yes | to wire |
| `src/pdf/lib/viewModel.js :: overviewSlice / powerSlice / historySlice` (`description`) | PDF Overview (`sections/Overview.jsx`, where History is not printed), PDF History (`sections/HistoryFounding.jsx :: TensionRow`, `EditableProse`), and the FOUNDRY journal (`src/foundry/journalPages.js` "## Tensions" reads the power slice's `description`) | the document handed to `buildViewModel` | yes | to wire (one call per slice covers PDF and Foundry) |
| `src/domain/dossier/plotHooks.js :: collectPlotHooks` (a tension hook's `role` = the stored `description`) | printed beside each tension hook: web Summary tab (`SummaryTab.jsx`, `v.role`), web Plot Hooks tab, PDF Plot Hooks | owner (hooks are DM-only) | NO (src/domain/dossier) | NAMED for the chair (condition (b): "the Summary") |
| the session sheet (`src/domain/tension/troubleCast.js`, origin/lane/frame-5-2026-11-20, not on this line) | the session sheet's trouble | — | NO | NAMED (not on the line) |

## Readers that compare or ground, not print (other seats unless marked)

- `src/pdf/sections/HistoryFounding.jsx` (lane): drops an event's description where a live tension CARRIES the same sentence (B4); after the wiring it compares against the sentence shown.
- `src/domain/display/historyOpenThreads.js` (lane): the still-relevant mark searches the tensions' stored text for an event's name: a match, not a print.
- `src/domain/summary/settlementQuickGuide.js :: entry_point` (`description || plotHooks[0]`): `composeSettlementQuickGuide` has no caller in `src/` (tests only).
- `src/domain/historyBeats.js :: deriveUnresolvedWound` -> `aiGrounding.js`, `aiOverlayVerifier.js`, `explanation.js`, `dailyLife.js`, `causalViews.js`: AI grounding and explanation (src/domain).
- `src/domain/dossier/dossierSearch.js` (search text), `src/domain/coherence/readerBattery.js`, `hookTruth*.js`, `src/domain/edit/*`, `factionRename.js`, `institutionRename.js`: checks and edits.
- `src/generators/historyGenerator.js` (the writer).
