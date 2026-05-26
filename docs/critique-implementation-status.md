# Critique Implementation Status — P100–P127

Tracks progress against the architecture from the comprehensive UX/UI
and Editing & Map critiques. Format: one row per phase, status,
notes. Updated as phases ship.

## Cross-cutting infrastructure pillars

| Pillar | File(s) | Status |
|---|---|---|
| A — `useReaderAudience()` | `src/hooks/useReaderAudience.js` + tests | **shipped** |
| B — Copy expansion + `useCopy()` | `src/copy/en.js`, `src/hooks/useCopy.js` | **shipped** |
| C — Analytics taxonomy + `useFunnelEvent()` | `src/lib/analytics.js`, `src/hooks/useFunnelEvent.js` | **shipped** |
| D — `usePricingMoment()` | `src/hooks/usePricingMoment.js`, `src/copy/strings.js` | **shipped** |
| E — `authIntents` registry | `src/lib/authIntents.js`, wired in `src/store/index.js` | **shipped** |

## Wave 1 — Spine (shipped)

| Phase | Critique | Status | Surface |
|---|---|---|---|
| P100 | X-1 — Pipeline reveal | **shipped** | `PipelineReveal.jsx` + slice flag |
| P101 | X-3 — Save-as-signup | **shipped** | `SaveToLibraryButton`, AuthModal dispatches `authIntents.consume()` |
| P102 | D-1 — 5-tab dossier façade | **shipped (flag-off)** | `TAB_GROUPS` in `OutputContainer.jsx`. Flag: `dossierFiveTabs`. |
| P103 | X-2 — pricingMoments wiring | **shipped** | 4 of 5 missing moments wired: first_save, third_save, first_pdf_export, regen_burst, map_clicked. (Pre-existing 3 stay.) `PricingMomentCard.jsx`. |
| P104 | X-4 — Welcome credit on signup | **shipped** | Migration 015 + `WelcomeCreditCard.jsx` |

## Wave 2 — Editor + library + map (partial)

| Phase | Critique | Status | Notes |
|---|---|---|---|
| P105 | E-2 — Pending edits drawer + cascade preview | **pending** | Domain module `pendingEdits.js` + UI not yet built. Worldbuilder-tier. |
| P106 | E-1 — Inline edits on dossier | **pending** | Click-to-edit primitives. Edit mode toggle. ~3 days. |
| P107 | CP-2 — Workshop nav | **shipped (flag-off)** | Top-level nav entry + route added. Component exists. Flag: `workshopNav`. |
| P108 | E-6 — Library search | **pending** | `SettlementsPanel.jsx` upgrade. Search + sort + filter + bulk select. |
| P109 | E-5 — Version history | **pending** | Per-settlement timeline + diff + revert. Cartographer-gated. |
| P110 | M-4 — Routes mode | **pending** | `WorldMap.jsx` mode pill group + relationship-first overlay. Layers exist; need promotion. |
| P111 | M-3 — Map drop preview | **pending** | Hover-tooltip during drag with terrain + trade-route context. |
| P112 | M-5/M-7/M-8 — Map polish | **pending** | Auto-save, inline regen confirm, keymap. |

## Wave 4 — Conversion refinement

| Phase | Critique | Status | Notes |
|---|---|---|---|
| P113 | X-5 — Anon cap as unlock | **shipped** | `HomeHero.jsx` reframed cap-state. Flag: `anonCapUnlock`. |
| P114 | X-7 — Inline upgrade prompts | **partial** | The PricingMomentCard from P103 handles this. Locked-state pages for Map/Neighbour wanderer = pending. |
| P115 | X-9 — Return-visit personalization | **shipped (flag-off)** | `useReturnVisit()` hook + `WelcomeBackCard.jsx` mounted in HomeHero. Email sequence still uses existing Resend wiring. Flag: `welcomeBack`. |
| P116 | X-8 — Founder Lifetime recognition | **shipped (flag-off)** | `FounderTile.jsx`, audience-gated to worldbuilder via useReaderAudience. Live seat counter from existing RPC. Mounted in AccountPage. Flag: `founderRecognition`. |

## Wave 5 — Surface refinement

| Phase | Critique | Status | Notes |
|---|---|---|---|
| P117 | H-1 — Hero v2 (two-voice) | **shipped (flag-off)** | `HomeHero.jsx` carries both legacy + v2 paths. Anti-AI line as H1, italic deck translation, flat gold CTA. Flag: `heroV2`. |
| P118 | O-1/O-2 — Onboarding diet + first-dossier callouts | **pending** | Delete OnboardingCoach + nudge toast. Build FirstDossierCallouts. |
| P119 | W-1 — Wizard chrome diet | **shipped (flag-off)** | `GenerateWizard.jsx` collapses ChangeModeBar + 2 banners into one chip row when flag is on. Flag: `wizardChromeDiet`. |
| P120 | V-1/V-2/V-5 — Visual budget pass | **pending** | Token tiering + ESLint rules `no-raw-fontsize` / `no-raw-color`. |
| P121 | D-4 — Narrative Layer strip | **pending** | Lift `renderNarrativeButtons` out of header into labeled strip. |
| P122 | X-10 — Audience-led pricing copy | **shipped** | `PricingPage.jsx` reads `useCopy().audience('pricingPitch.{tier}.line')`. Flag: `audiencePricingCopy`. |
| P123 | A-2 — Mobile chrome reconciliation | **pending** | Drop top header; auth chip in bottom nav. |
| P124 | C-1 — Verb unification | **partial** | Verb registry exists in `copy.verbs.*`. Component sweep pending. |
| P125 | AC-1/AC-2 — Account upgrade footers | **shipped** | Hardcoded `credits_5/15/40` array swapped for `getActivePacks()` (honors `packsRepriced` flag). Per-card unlock footers on Tier / Credits / Saves cards for free users. Gated by `inlineUpgrade` flag. |

## Wave 6 — Supporting

| Phase | Critique | Status | Notes |
|---|---|---|---|
| P126 | CP-1/HT-1 — Compendium inline help + How-To inversion | **pending** | HelpPopover on every config control. Quick Start inverted. |
| P127 | CP-3/CP-4 — Compendium readability + anchors + search | **pending** | Single-column layout, anchor IDs, global type-ahead search. |

## Out-of-architecture additions

| Item | File | Status |
|---|---|---|
| 26 new analytics events | `src/lib/analytics.js` | shipped |
| 22 new feature flags | `src/lib/flags.js` | shipped |
| 9 new pricing-moment copy entries | `src/copy/strings.js` | shipped |

## Gate status at last shipped commit (`cde36d3` + Wave 2 partial)

- **Typecheck**: 0 errors (tsconfig.json domain-only scope)
- **Lint**: 0 errors, 0 warnings
- **Tests**: 2,239 passing (110 test files)
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

Net: ~15 days of work, ~25% of the projected total. The first 8 days
were the highest-leverage portion; every subsequent phase is a thin
consumer of the same primitives.

## What unlocks next

The shipped infrastructure means every remaining phase is now:
- ~half-day for copy-only phases (P122 already proves the pattern)
- ~1-2 days for component-level phases (P117 hero rewrite, P119 wizard chrome)
- ~2-4 days for the few that need new domain modules (P105 pendingEdits)

Recommend next batch: P117 (hero v2 — copy is already written), P119
(wizard chrome diet), P121 (narrative layer strip), P125 (Account
packs + footers). These are all pure UI sweeps over a stable
infrastructure.
