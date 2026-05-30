# Critique Implementation Status — P100–P146 (complete)

Tracks progress against the architecture from the comprehensive UX/UI
and Editing & Map critiques. Format: one row per phase, status,
notes. Updated as phases ship.

**Status: the full P100–P146 + Pillars A–H architecture has shipped.**
Every critique finding is now landed. The default-on roll-out flags have
since been burned down (Phase 123): each on-path was inlined and the flag
entry + legacy branches deleted, with zero behavior change. What remains in
`lib/flags.js` are the default-off flags awaiting sign-off (incl.
`summaryMagazineV2`, `tableView`) plus the auth OAuth gates. Several early
phases shipped a substrate that a later wave then completed; those rows note
the follow-on. See the wave sections below.

## Cross-cutting infrastructure pillars

| Pillar | File(s) | Status |
|---|---|---|
| A — `useReaderAudience()` | `src/hooks/useReaderAudience.js` + tests | **shipped** |
| B — Copy expansion + `useCopy()` | `src/copy/en.js`, `src/hooks/useCopy.js` | **shipped** |
| C — Analytics taxonomy + `useFunnelEvent()` | `src/lib/analytics.js`, `src/hooks/useFunnelEvent.js` | **shipped** |
| D — `usePricingMoment()` | `src/hooks/usePricingMoment.js`, `src/copy/strings.js` | **shipped** |
| E — `authIntents` registry | `src/lib/authIntents.js`, wired in `src/store/index.js` | **shipped** |
| F — `EditableInline` click-to-edit primitive | `src/components/primitives/EditableInline.jsx` + 13 tests | **shipped** |
| G — `sampleDossier` teaching fixture | `src/data/sampleDossier.{json,js}` (Hightower's Reach, stable IDs) | **shipped** |
| H — `LockedDestination` "sells itself" card | `src/components/primitives/LockedDestination.jsx` (X-7) | **shipped** |

## Wave 1 — Spine (shipped)

| Phase | Critique | Status | Surface |
|---|---|---|---|
| P100 | X-1 — Pipeline reveal | **shipped** | `PipelineReveal.jsx` + slice flag |
| P101 | X-3 — Save-as-signup | **shipped** | `SaveToLibraryButton`, AuthModal dispatches `authIntents.consume()` |
| P102 | D-1 — 5-tab dossier façade | **shipped (flag-off)** | `TAB_GROUPS` in `OutputContainer.jsx`. Flag: `dossierFiveTabs`. |
| P103 | X-2 — pricingMoments wiring | **shipped** | 4 of 5 missing moments wired: first_save, third_save, first_pdf_export, regen_burst, map_clicked. (Pre-existing 3 stay.) `PricingMomentCard.jsx`. |
| P104 | X-4 — Welcome credit on signup | **shipped** | Migration 015 + `WelcomeCreditCard.jsx` |

## Wave 2 — Editor + library + map (shipped)

| Phase | Critique | Status | Notes |
|---|---|---|---|
| P105 | E-2 — Pending edits drawer + cascade preview | **shipped (flag-off)** | `domain/pendingEdits.js` (queue + previewCascade) + 16 contract tests. Store wires `queueEdit / revertPendingEdits / commitPendingEdits`. `PendingChangesBar.jsx` + `CascadePreviewPanel.jsx` mounted in OutputContainer. Flag: `inlineEdit`. |
| P106 | E-1 — Inline edits on dossier | **shipped** | Substrate (pending-queue, commit, revert) shipped here; click-to-edit on individual fields completed by P131 via the `EditableInline` primitive (Pillar F). Flag: `inlineDossierEdits`. |
| P107 | CP-2 — Workshop nav | **shipped (flag-off)** | Top-level nav entry + route added. Component exists. Flag: `workshopNav`. |
| P108 | E-6 — Library search | **shipped (flag-off)** | `LibraryToolbar.jsx` + pure `applyLibraryFilters()` pipeline + 11 contract tests. Search across name/tier/NPCs/factions; sort by recent/name/tier; filter chips for canon-only and has-neighbours. Mounted in SettlementsPanel. Flag: `librarySearch`. |
| P109 | E-5 — Version history | **shipped (flag-off)** | `VersionsTab.jsx` + pure `buildVersionTimeline()` + 6 contract tests. Timeline derived from `campaignState.editedAt/canonizedAt/lastExportAt` + explicit `versionHistory[]`. Cartographer-gated; wanderer/free users see a locked-state preview with upgrade pitch. Revert UI ready (two-click confirm); the snapshot+revert mutation wiring shipped in P133. Flag: `versionHistory`. |
| P110 | M-4 — Routes mode | **shipped (flag-off)** | `MAP_MODES.ROUTES` added. ModeSwitch renders the new pill when `mapRoutesMode` flag is on. Existing RelationshipEdges + RoadsLayer + ChainEdges layers ready for promotion to primary content. |
| P111 | M-3 — Map drop preview | **shipped (flag-off)** | Static drop-preview card surfaces during drag in WorldMap. Hints at terrain + trade-route candidacy. Flag: `mapDropPreview`. Future iteration: hover-follow with live FMG cell data. |
| P112 | M-5/M-7/M-8 — Map polish | **shipped (flag-off)** | M-7: regenerate confirm now shows explicit placement+label loss counts (flag-on path). M-8: P/T/A/R/F keymap + ⌘S save shortcut wired when `mapRoutesMode` flag is on. M-5 auto-save chip shipped in P136 (`mapAutoSaveChip`). |

## Wave 4 — Conversion refinement

| Phase | Critique | Status | Notes |
|---|---|---|---|
| P113 | X-5 — Anon cap as unlock | **shipped** | `HomeHero.jsx` reframed cap-state. Flag: `anonCapUnlock`. |
| P114 | X-7 — Inline upgrade prompts | **shipped** | The PricingMomentCard from P103 handles inline prompts; locked-state pages for Map/Neighbour/Workshop wanderer completed by P143 via the `LockedDestination` primitive (Pillar H). |
| P115 | X-9 — Return-visit personalization | **shipped (flag-off)** | `useReturnVisit()` hook + `WelcomeBackCard.jsx` mounted in HomeHero. Email sequence still uses existing Resend wiring. Flag: `welcomeBack`. |
| P116 | X-8 — Founder Lifetime recognition | **shipped (flag-off)** | `FounderTile.jsx`, audience-gated to worldbuilder via useReaderAudience. Live seat counter from existing RPC. Mounted in AccountPage. Flag: `founderRecognition`. |

## Wave 5 — Surface refinement

| Phase | Critique | Status | Notes |
|---|---|---|---|
| P117 | H-1 — Hero v2 (two-voice) | **shipped (flag-off)** | `HomeHero.jsx` carries both legacy + v2 paths. Anti-AI line as H1, italic deck translation, flat gold CTA. Flag: `heroV2`. |
| P118 | O-1/O-2 — Onboarding diet + first-dossier callouts | **shipped (flag-off)** | O-1: OnboardingCoach overlay suppressed when `onboardingDiet` flag is on. O-2: FirstDossierCallouts completed by P130 (`firstDossierCallouts`). |
| P119 | W-1 — Wizard chrome diet | **shipped (flag-off)** | `GenerateWizard.jsx` collapses ChangeModeBar + 2 banners into one chip row when flag is on. Flag: `wizardChromeDiet`. |
| P120 | V-1/V-2/V-5 — Visual budget pass | **shipped (warn-only)** | Local ESLint plugin `scripts/eslint-plugin-visual-budget.js` with three rules: `no-raw-fontsize` (catches `fontSize: 11` literals), `no-raw-color` (catches `color: '#XXXXXX'` literals), `no-raw-button-copy` (catches inline `Generate/Reroll/Save/...` button text). 2,598 existing violations surface as warnings — the size of the design-system debt the critique flagged. P140 later burned this down to ~1,650. Cleanup is organic; promote to error once count hits zero. |
| P121 | D-4 — Narrative Layer strip | **shipped (flag-off)** | When `narrativeLayerStrip` flag is on, narrative buttons move out of dossier header into a labeled violet-accented strip below: "Narrative Layer · AI prose pass" + explainer + buttons. Flag-off path keeps the legacy header-button cluster. |
| P122 | X-10 — Audience-led pricing copy | **shipped** | `PricingPage.jsx` reads `useCopy().audience('pricingPitch.{tier}.line')`. Flag: `audiencePricingCopy`. |
| P123 | A-2 — Mobile chrome reconciliation | **shipped (flag-off)** | When `mobileSingleChrome` flag is on, mobile top header is suppressed; auth chip joins bottom nav as a 6th slot (icon + label, gold for anon / green for signed-in). Frees ~52px on every mobile screen. |
| P124 | C-1 — Verb unification | **shipped** | `COPY.generate.*` updated: "Generate Draft" → "Forge a Draft", "Regenerate Draft" → "Reforge Draft". Verb registry in `copy.verbs.*` for new components. Component sweep mostly done at the copy layer (components read `COPY.generate.*.cta`). |
| P125 | AC-1/AC-2 — Account upgrade footers | **shipped** | Hardcoded `credits_5/15/40` array swapped for `getActivePacks()` (honors `packsRepriced` flag). Per-card unlock footers on Tier / Credits / Saves cards for free users. Gated by `inlineUpgrade` flag. |

## Wave 6 — Supporting

| Phase | Critique | Status | Notes |
|---|---|---|---|
| P126 | CP-1/HT-1 — Compendium inline help + How-To inversion | **shipped** | CP-1: `HelpPopover.jsx` primitive with 6 topic hints (trade-route, terrain, culture, monster-threat, magic-level, tier), self-gating on `compendiumInlineHelp`. HT-1 How-To inversion shipped as Phase 119 — see the Closeout section. |
| P127 | CP-3/CP-4 — Compendium readability + anchors + search | **shipped** | Anchor URL handling shipped here (Compendium honors `#trade-routes` etc. via `ANCHOR_TO_TAB` + scroll-into-view). The single-column readability layout and global type-ahead search shipped in P139 (`compendiumReadability` + `compendiumGlobalSearch`). |

## Wave 7 — Visible-wow batch (Pillars F/G/H)

| Phase | Critique | Status | Notes |
|---|---|---|---|
| P128 | H-2 — Sample dossier proof card | **shipped** | `HomeSampleDossier` below HomeHero for anonymous visitors — three audience callouts (DM / worldbuilder / writer) over the `sampleDossier` fixture (Pillar G). Flag: `sampleProofCard`. |
| P129 | D-2 — Summary magazine spread | **shipped (flag-off)** | `SummaryTabV2` renders the DM Summary as a two-column magazine spread. Flag: `summaryMagazineV2` (default off pending design sign-off). |
| P130 | O-2 — First-dossier callouts | **shipped** | Three teaching callouts (tension / supply / hook) overlaid on a first-time user's first generated dossier. Closes the P118 partial. Flag: `firstDossierCallouts`. |
| P131 | E-1 — Inline dossier edits | **shipped** | Click-to-edit on settlement name / NPC names / faction labels via `EditableInline` (Pillar F); commits flow through the P105 pendingEdits queue + cascade preview. Closes the P106 partial. Flag: `inlineDossierEdits`. |

## Wave 8 — Editor depth + map routes

| Phase | Critique | Status | Notes |
|---|---|---|---|
| P132 | M-4 — Routes mode promotion | **shipped (flag-off)** | `RoutesToolbar` promotes the M-4 substrate from P110 to primary map content. Reuses the `mapRoutesMode` flag. |
| P133 | E-5 — Version revert mutation | **shipped (flag-off)** | Snapshot + revert mutation wiring — the follow-on to P109's read-only timeline. Reuses the `versionHistory` flag. |
| P135 | D-5 — Simulation drawer | **shipped** | Simulation tab content moves into a right-side slide-out drawer behind a "How this was simulated" link; the tab leaves the strip. Flag: `simulationDrawer`. |

## Wave 9 — Map enrichment

| Phase | Critique | Status | Notes |
|---|---|---|---|
| P136 | M-5 — Map auto-save chip | **shipped** | "Saved 2 min ago" / "Unsaved changes" pill in the WorldMap toolbar. Promotes the P112 M-5 substrate. Flag: `mapAutoSaveChip`. |
| P136 | M-6 — Map quick inspector | **shipped** | Hover-peek card for placed settlements (name + pressure + top hook) keyed on `hoveredSettlementId` — distinct from the click-to-open PlacementDetailCard. Flag: `mapQuickInspector`. |

## Wave 10 — Help + account + compendium

| Phase | Critique | Status | Notes |
|---|---|---|---|
| P137 | HT-4 — Copy as AI prompt | **shipped** | "Copy as AI prompt" button serialises the grounded prompt envelope for paste into ChatGPT/Claude; signed-in only. Flag: `aiPromptCopy`. |
| P138 | AC-4 — Account FAQ | **shipped** | Inline FAQ accordion on the Account page (six common Qs: credit grant, cancel, refunds, founder, gallery privacy, AI-vs-sim). Flag: `accountFaq`. |
| P139 | CP-4 — Compendium global search | **shipped** | Type-ahead above the Compendium tabs — match every section (tiers, archetypes, routes, stresses, relationships) and jump to the owning tab. Closes the P127 search gap. Flag: `compendiumGlobalSearch`. |
| P139 | CP-3 — Compendium readability | **shipped** | Constrains catalog content to a readable max-width column instead of edge-to-edge sprawl on wide pages. Closes the P127 readability gap. Flag: `compendiumReadability`. |

## Wave 11 — Visual-budget cleanup

| Phase | Critique | Status | Notes |
|---|---|---|---|
| P140 | V-1/V-2 — Token cleanup | **shipped (no flag)** | `fontSize` literals → `FS.*` codemod sweep across the component tree, burning down the visual-budget warning baseline the P120 plugin surfaces. |
| P141 | V-4 — Elevation tokens | **shipped** | Adopts the 3-tier `ELEV[1..3]` ink-tinted shadow scale on cards, popovers, and modals for one depth language instead of bespoke per-component shadows. V-3 header gradient was already pre-satisfied. Flag: `elevationTokens`. |

## Wave 12 — Power surfaces

| Phase | Critique | Status | Notes |
|---|---|---|---|
| P142 | D-6 — Table View | **shipped (flag-off)** | 380px phone-optimized session-running view of a settlement. Flag: `tableView` (default off pending design sign-off). |
| P143 | X-7 — Locked destinations rollout | **shipped** | The `LockedDestination` "sells itself" primitive (Pillar H) rolled out across the Map / Neighbour / Workshop wanderer surfaces; host-surface gated (relates to P114's `inlineUpgrade`). Closes the P114 locked-state gap. |

## Wave 13 — Wizard close-out + contracts

| Phase | Critique | Status | Notes |
|---|---|---|---|
| P144 | A-4 — Wizard step focus | **shipped** | Focus moves to the new step heading when the advanced wizard advances/retreats, so keyboard + screen-reader users are oriented instead of stranded on a now-disabled nav button. Flag: `wizardStepFocus`. |
| P145 | W-2 — Wizard close-out summary | **shipped** | Pre-generate recap card at the wizard's final "Ready to Generate" step (tier/culture/route/threat/magic + priority emphasis + manual force/exclude counts) so Generate is a confirmation, not a leap. Flag: `wizardCloseout`. |
| P146 | — Funnel event-name contract | **shipped (no flag)** | Local ESLint plugin `scripts/eslint-plugin-analytics.js`, rule `analytics/funnel-event-contract` (error): flags raw-string / template-literal first args to `track`/`Funnel.*`, enforcing the `EVENTS.*` constant discipline at build time. Import-binding-aware; zero violations on the current corpus. |

## Closeout — final two phases (118–119)

| Phase | Critique | Status | Notes |
|---|---|---|---|
| P134 | W-4 — Post-generate "what's next" guide | **shipped** | `WizardNextSteps` — a state-aware checklist (save / export / refine / map / generate another) under a freshly-generated dossier. Guidance, not a second set of action buttons. The W-4 companion to P145's W-2. Flag: `wizardNextSteps`. |
| P126 | HT-1 — How-To inversion | **shipped** | Quick Start tab inverted to lead with the 60-second action steps; the constraint-driven concept essay is demoted to a "Why it works this way" coda. Completes the one outstanding sub-item of the established plan. Flag: `howToInversion`. |

## Out-of-architecture additions

| Item | File | Status |
|---|---|---|
| 30 critique analytics events (52 total in the `EVENTS` enum) | `src/lib/analytics.js` | shipped |
| 54 feature flags in the registry (17 in the P128–P146 completion block) | `src/lib/flags.js` | shipped |
| 9 new pricing-moment copy entries | `src/copy/strings.js` | shipped |
| 2 local ESLint plugins (`visual-budget` · `analytics`) | `scripts/eslint-plugin-*.js` | shipped |

## Gate status at last shipped commit (`0938099`, Phase 119)

- **Typecheck**: 0 errors (tsconfig.json domain-only scope)
- **Lint**: 0 errors, 1,650 warnings (all `visual-budget` design-debt warnings; cleanup is organic per P120)
- **Tests**: 2,400 passing (133 test files)
- **Build**: clean (pre-existing vendor-pdf chunk-size warning unchanged)

## Day-budget reconciliation

Architecture projected ~80 days for the full set. Shipped to date
(infrastructure + Wave 1 + selected Wave 2/4/5 high-leverage items):

- Pillars A–E: ~7 days of work
- P100 (PipelineReveal): ~1.5 days
- P101 (Save-as-signup): ~1 day
- P102 (5-tab façade, flag-off): ~1 day (saved ~3 days of risk by going
  façade-over-existing instead of full restructure)
- P103 (pricingMoments wiring): ~1.5 days
- P104 (welcome credit + migration): ~1.5 days
- P107 (Workshop nav): ~0.5 days (component existed)
- P113 (anon cap unlock): ~0.5 days
- P122 (audience pricing copy): ~0.5 days

Net for the spine above: ~15 days. The remaining work (Pillars F–H +
Waves 7–13 + the two closeouts) rode on the same primitives — each phase
a day or less over the stable A–H infrastructure — bringing the full
P100–P146 set in well under the ~80-day projection. The first ~8 days
(Pillars A–E) were the highest-leverage portion; everything after
consumed them.

## Status: complete

Every phase of the established architecture — Pillars A–H, P100–P146, plus
the two genuine closeouts (P134/W-4 and P126/HT-1) — has shipped. No
numbered phases remain.

What's left is operational, not architectural:
- **Flag burn-down — done (Phase 123).** All soaked default-on flags were
  promoted to permanent: on-paths inlined, flag entries + legacy branches
  deleted, zero behavior change. The default-off flags remain, two pending
  design sign-off: `summaryMagazineV2`, `tableView`.
- **Visual-budget debt — done (Phase 120–122).** The `visual-budget`
  warnings were burned to zero and the three rules (`no-raw-fontsize`,
  `no-raw-color`, `no-raw-button-copy`) promoted from warn to error.
- **Revert-snapshot soak** — P133's version-revert mutation is wired but
  warrants real-world soak before `versionHistory` defaults on.
