# SAFETY (F3a): the measure, at base ff51769f7

Every surface that prints the Safety label (`economicState.safetyProfile.safetyLabel`), and which audience reaches it.
Generated prose (DS-GEN-3, DS-DEF-3, aiLayer prompts) is not a surface touched here.

| # | Surface (base file:line) | What it prints | Audience that reaches it |
|---|---|---|---|
| 1 | `src/components/new/tabs/OverviewTab.jsx:396` | Systems Health tag "Safety", the band word (`safetyBandOf`) | owner (live editor; own saved view); gallery and shares too: NO audience gate |
| 2 | `src/components/new/tabs/DefenseTab.jsx:312,484` | Public order banner: the full label, where it is not Moderate | same as 1 |
| 3 | `src/domain/display/threatAssessment.js:335` | Defense tab's Threat row: "Internal security: <label>." | same as 1 (same Defense tab as 2) |
| 4 | `src/pdf/sections/Cover.jsx:268-274` (vm `overview.safety`, `src/pdf/lib/viewModel.js:386`) | Cover's Safety cell | the DM's own PDF (`SettlementPDF.jsx:118-123`, `dmView: true`), exported from the owner's library card, saved detail and draft |
| 5 | `src/pdf/sections/Overview.jsx:100` (vm `overview.safety`) | Overview strip's Safety stat | as 4 |
| 6 | `src/pdf/sections/DefenseSecurity.jsx:85` (vm `defense.safetyLabel`, `viewModelBodySlices.js:200`) | Readiness strip's Safety stat | as 4 |
| 7 | `src/foundry/journalPages.js:122` (vm `overview.safety`) | Overview page "Safety" row | the Foundry export (`generateFoundryModule.js:45`, `buildViewModel` with NO `dmView`): journals a table shows its players |
| 8 | `src/foundry/journalPages.js:433` (vm `defense.safetyLabel`) | Defense page "Safety" row | as 7 |
| - | `src/pdf/lib/viewModel.js:312` (vm `identity.anchor.safety`) | gates the anchor box only; not printed (IdentityDailyLife.jsx:80) | as 4 |
| - | `src/domain/display/dossierViewModel.js:621` `deriveSafetyPosture` | the parity contract's canon `safety.label` | none (a reader) |

Not surfaces: `SummaryTab.jsx:34` (a prose clause; the tab is mounted nowhere, dossierLazyTabs.js:14),
`dailyLifeLogic.js:99` (returned, printed by no tab), `src/domain/summary/tonightSheet.js` (does not print it),
`governanceAccount.js` (a prose word), `generators/*` (not mine).

## How the page knows its audience (today)

`OutputContainer.jsx:222` takes `readOnly`, `saveId`, `playerView`; `:456` `publicDossier = readOnly && !saveId`.
- Owner: `GenerateWizard.jsx:590` (live editor) and `SettlementDossierHero.jsx:78` (`readOnly saveId`): both false.
- Gallery / public: `PublicDossierView.jsx:118` (`readOnly`, no saveId: `publicDossier` true; `playerView={!shareDm}`).
- Every tab receives `publicDossier` and `playerView` (`OutputContainer.jsx:711,743`); the DM-only Crisis tab's gate is
  `!publicDossier && !playerView` (`OverviewTab.jsx:186`, `OutputContainer.jsx:534`). `safetyAudienceOf` uses that gate.
- Print: `buildViewModel`'s `dmView` (`viewModel.js:145`), true only in `SettlementPDF.jsx:122`.
- The veil keeps `safetyLabel` and strips `criminalCaptureState` (`galleryVeil.js:323`, `publicSafe.js:409`).

## What the line reads (all stored or derived on the record; nothing recomputed that the generator decided)

- the Law & order band the Foundations row prints: `facts/lawBand.js :: lawBandOf` (the row's one home,
  `foundationBandShown.js:79`);
- the ruling seat's rung: `powerStructure.criminalCaptureState` ('corrupted' | 'capture', `people/hallCapture.js:48`);
- a live crime wave: `facts/lawBand.js :: crimeWaveStands` (`history.currentTensions` type `crime_wave`).
