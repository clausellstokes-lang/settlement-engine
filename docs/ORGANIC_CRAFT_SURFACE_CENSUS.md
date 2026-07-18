# THE ORGANIC CRAFT WAVE — SURFACE CENSUS (scaffold)

> **Status: SCAFFOLD (phase-2 deliverable). Every entry is `PENDING`.**
> This is the enumeration the app-wide sweep (phase 3) opens against. Phases 3–4
> close ONLY when this census carries **zero undispositioned entries** (owner
> confirmation 2026-07-17: "every single page" — enforced by enumeration). No silent
> skips; the preview legibility review walks THIS census, not a sample.

## How phase 3 dispositions each entry

Every row gets one disposition, recorded here in place of `PENDING`:

- **RECOMPOSED** — re-composed under the law (which register; keep-vs-stack ruling
  recorded; a preview-legibility receipt at desktop + field + dim).
- **INSTRUMENT-EXEMPT — <reason>** — an operated surface that stays machined/orthodox
  by design (the artifact/instrument split, law §2). It still adopts the one
  type/ink/rubric system, but spends no rebellion budget on interaction. State why.
- **DEFERRED — <reason>** — out of this wave (e.g. admin-only, owner-gated, or a
  parked lineage). State why and where it is tracked.

The **register** column is a *proposed* starting classification from the phase-2
work (artifact = in-fiction read surface; instrument = operated; reference =
catalog; flow = auth/checkout). It is a hint for phase 3, **not** a ruling — the
manager/owner confirm per surface.

Sources of truth for the enumeration: `src/lib/routes.js` (the `ROUTES` view enum +
`NAV`), `src/AppViews.jsx` (view→component), and the modal/panel inventory below
(swept from `src/components/**`). Regenerate/verify the route list against
`src/lib/routes.js` before trusting any count.

---

## 1. Routes / views (`ROUTES`, `src/lib/routes.js`) — 30 declared views

### 1a. Marketing / public (indexable)

| view | path | component | proposed register | disposition |
|---|---|---|---|---|
| `home` | `/home` | `HomeLanding` | artifact/marketing | PENDING |
| `pricing` | `/pricing` | `PricingPage` | instrument+marketing (phase-2 sample done) | PENDING |
| `howto` | `/how-to` | `HowToUse` (About) | artifact/marketing | PENDING |
| `compendium` | `/compendium` | `CompendiumPanel` | reference (phase-2 hub sample done) | PENDING |
| `gallery` | `/gallery` (+ `/:slug`, `/:facet/:value`, `/at-war`, `/most-alive`) | `GalleryPage` | reference/artifact | PENDING |
| `founders` | `/founders` | `FoundersPage` | artifact/marketing | PENDING |
| `terms` | `/terms` | `TermsPage` | reference (legal) | PENDING |
| `privacy` | `/privacy` | `PrivacyPage` | reference (legal) | PENDING |
| `refunds` | `/refunds` | `TermsPage` (anchored) | reference (legal) | PENDING |
| `compare` | `/compare` | redirect → `howto?tab=compare` | n/a (redirect stub) | PENDING (likely DEFERRED — redirect only) |
| `compare-chatgpt` | `/compare/chatgpt` | redirect stub | n/a | PENDING |
| `compare-worldographer` | `/compare/worldographer` | redirect stub | n/a | PENDING |
| `compare-kanka` | `/compare/kanka` | redirect stub | n/a | PENDING |

### 1b. Core app (anon + auth)

| view | path | component | proposed register | disposition |
|---|---|---|---|---|
| `generate` | `/create` (DEFAULT) | `GenerateWizard` | instrument (the wizard) | PENDING |
| `settlements` | `/settlements` (+ `/:id`) | `SettlementsPanel` (Library) + `SettlementDetail` (dossier) | instrument (library) / artifact (dossier) — phase-2 samples done | PENDING |
| `realm` | `/realm` | `WorldMap` (+ Pulse/Chronicle/Pantheon) | instrument + DESKTOP-ONLY REALM GATE (law §7) | PENDING |
| `map` | `/map` | redirect → `realm` | n/a (redirect) | PENDING |
| `workshop` | `/workshop` | redirect → `generate` | n/a (redirect) | PENDING |

### 1c. Authenticated (guarded)

| view | path | guard | component | proposed register | disposition |
|---|---|---|---|---|---|
| `account` | `/account` | auth | `AccountPage` | instrument (settings/billing) | PENDING |
| `admin` | `/admin` | elevated | `AdminPanel` | instrument | PENDING (likely DEFERRED — owner/dev-only) |

### 1d. Auth / checkout flow

| view | path | component | proposed register | disposition |
|---|---|---|---|---|
| `signin` | `/signin` | `SignInPage` | flow | PENDING |
| `register` | `/register` | `RegisterPage` | flow | PENDING |
| `reset-password` | `/reset-password` | `ResetPasswordPage` | flow | PENDING |
| `set-new-password` | `/set-new-password` | `SetNewPasswordPage` | flow | PENDING |
| `verify-email` | `/verify-email` | `VerifyEmailPage` | flow | PENDING |
| `confirm-email` | `/confirm-email` | `ConfirmEmailPage` | flow | PENDING |
| `dossier-success` | `/checkout/success` | `SingleDossierSuccessPage` | flow/artifact | PENDING |

---

## 2. Modal / dialog / panel / overlay / drawer / sheet inventory

Swept from `src/components/**`. Each is a surface the preview review must walk.

### 2a. Shell-level (rendered globally in `App.jsx`)

| component | file | disposition |
|---|---|---|
| `AuthModal` | `src/components/AuthModal.jsx` | PENDING |
| `PurchaseModal` | `src/components/PurchaseModal.jsx` | PENDING |
| `PricingMomentCard` | `src/components/pricing/PricingMomentCard.jsx` | PENDING |
| `FloatingAffordances` | `src/components/FloatingAffordances.jsx` | PENDING |
| `CampaignSyncBanner` | `src/components/CampaignSyncBanner.jsx` | PENDING |
| `AccountMenu` | `src/components/AccountMenu.jsx` | PENDING |
| `DevFlagPanel` / `DevEmailBanner` | `src/components/dev/*` | PENDING (likely DEFERRED — dev-only) |
| inline toasts (checkout / retro-claim / onboarding) | `App.jsx` | PENDING |

### 2b. Realm / world map

| component | file | disposition |
|---|---|---|
| `RealmInspector` | `src/components/map/RealmInspector.jsx` | PENDING |
| `WorldPulsePanel` | `src/components/map/WorldPulsePanel.jsx` | PENDING |
| `WizardNewsPanel` | `src/components/map/WizardNewsPanel.jsx` | PENDING |
| `PantheonPanel` | `src/components/map/PantheonPanel.jsx` | PENDING |
| `TreatyPanel` | `src/components/map/TreatyPanel.jsx` | PENDING |
| `LayersPanel` | `src/components/map/LayersPanel.jsx` | PENDING |
| `MapOverlay` | `src/components/MapOverlay.jsx` | PENDING |
| `MapShareEditorOverlay` | `src/components/map/MapShareEditorOverlay.jsx` | PENDING |
| `WarFaithMapOverlay` | `src/components/map/WarFaithMapOverlay.jsx` | PENDING |
| `WorldMapOverlays` | `src/components/map/WorldMapOverlays.jsx` | PENDING |
| `SimulationRulesDialog` | `src/components/map/SimulationRulesDialog.jsx` | PENDING |
| `WorldMapTour` | `src/components/map/WorldMapTour.jsx` | PENDING |

### 2c. Settlement editor / dossier

| component | file | disposition |
|---|---|---|
| `SettlementDetail` | `src/components/SettlementDetail.jsx` | PENDING (dossier host; phase-2 sample done) |
| `OutputContainer` (dossier body) + `src/components/new/tabs/*` | `src/components/OutputContainer.jsx` | PENDING |
| `ChroniclePanel` | `src/components/ChroniclePanel.jsx` | PENDING |
| `TradeDynamicsPanel` | `src/components/TradeDynamicsPanel.jsx` | PENDING |
| `ConfigurationPanel` | `src/components/ConfigurationPanel.jsx` | PENDING |
| `ServicesTogglePanel` | `src/components/ServicesTogglePanel.jsx` | PENDING |
| `CoherencePanel` | `src/components/settlement/CoherencePanel.jsx` | PENDING |
| `DeityAssignmentPanel` | `src/components/settlement/DeityAssignmentPanel.jsx` | PENDING |
| `WhatChangedPanel` | `src/components/settlement/WhatChangedPanel.jsx` | PENDING |
| `ExportSheet` | `src/components/settlement/ExportSheet.jsx` | PENDING |
| `PreviewPanel` (event composer) | `src/components/settlement/eventComposer/PreviewPanel.jsx` | PENDING |
| `StaleNarrativeModal` | `src/components/StaleNarrativeModal.jsx` | PENDING |
| `SupplyChainsPanel` | `src/components/new/SupplyChainsPanel.jsx` | PENDING |
| `SettlementDetailNetworkEffectsPanel` | `src/components/settlementDetail/SettlementDetailNetworkEffectsPanel.jsx` | PENDING |

### 2d. Dossier purchase / preview

| component | file | disposition |
|---|---|---|
| `DossierLadderModal` | `src/components/dossier/DossierLadderModal.jsx` | PENDING |
| `CascadePreviewPanel` | `src/components/dossier/CascadePreviewPanel.jsx` | PENDING |
| `SimulationDrawer` | `src/components/dossier/SimulationDrawer.jsx` | PENDING |
| `DossierNarrativeBanner` | `src/components/dossier/DossierNarrativeBanner.jsx` | PENDING |

### 2e. Surveyor (AI control surfaces)

| component | file | disposition |
|---|---|---|
| `AiAnalystPanel` | `src/components/AiAnalystPanel.jsx` | PENDING |
| `StyleOverhaulPanel` | `src/components/surveyor/StyleOverhaulPanel.jsx` | PENDING |
| `InterpretApplyPanel` | `src/components/surveyor/InterpretApplyPanel.jsx` | PENDING |
| `CustomContentPanel` | `src/components/surveyor/CustomContentPanel.jsx` | PENDING |
| `ConstructionPanel` | `src/components/surveyor/ConstructionPanel.jsx` | PENDING |
| `AutonomyPanel` | `src/components/surveyor/AutonomyPanel.jsx` | PENDING |

### 2f. Gallery

| component | file | disposition |
|---|---|---|
| `CampaignStatePanel` | `src/components/gallery/CampaignStatePanel.jsx` | PENDING |
| `GalleryModerationPanel` | `src/components/gallery/GalleryModerationPanel.jsx` | PENDING (likely DEFERRED — moderation/owner) |
| `GalleryReportDialog` | `src/components/gallery/GalleryReportDialog.jsx` | PENDING |

### 2g. Admin sub-panels (inside `/admin`)

| component | file | disposition |
|---|---|---|
| `AdminAnalyticsPanel` / `AdminTrendsPanel` / `AdminUsersPanel` / `AdminSimTuningPanel` / `AiPricingResyncPanel` / `SupportQueuePanel` | `src/components/admin/*` | PENDING (likely DEFERRED — owner/dev-only) |

### 2h. Create flow

| component | file | disposition |
|---|---|---|
| `LayeredConfigurationPanel` | `src/components/generate/LayeredConfigurationPanel.jsx` | PENDING |

### 2i. Reusable primitives (modal/sheet machinery — not surfaces)

`Dialog`, `BottomSheet`, `Toast`, `AiOverlayViolations`, `Segmented`, `Page`,
`PageHeader`, `Card`, `Button`, `IconButton` (`src/components/primitives/*`). These
are the instrument chassis phase 3 either adopts organic tokens into or leaves as-is;
disposition PENDING as a group (the organic instrument primitives from phase 1/2 —
`.oc-btn`, `.oc-control`, `.oc-segmented`, `Register`, `Rule`, `Rubric`, `Ink`,
`Display`, `Prose`, `Marginalia`, `SeededCartouche`, `Emblem`, `CompassRose` — are
the target vocabulary).

---

## 3. THE ONE-FICTION PASS (rides the same census, phase 3)

Every **empty state, error, and loader** across the surfaces above is enumerated and
dispositioned in the same sweep (the surveyor's voice, one register; signed/dated
where the fiction earns it). Categories to enumerate per surface when it is swept:

- Empty states (empty library, fresh map, no gallery results, no NPCs, …) — PENDING
- Error states (generation failure, network, checkout error, auth error, …) — PENDING
- Loaders / skeletons (dossier tabs, map load, gallery, …) — PENDING
- Microcopy (headlines, labels, CTAs, helper text) reviewed for the one voice — PENDING

**Content-is-design note (depth standard §content):** where a swept surface has weak
headlines/labels/CTAs/error copy, phase 3 flags or fixes it *within the voice ruling*,
not by styling around it.

---

## 4. Offline / manifest boundary (recorded, do not extend)

Per the inherited ruling: **OFFLINE IS OUT OF THIS WAVE.** No service worker, no "ready
for the table" caching, no new webmanifest. The field mode ships ONLINE-REQUIRED; no
offline promise appears in any copy. The vendored `/map/` webmanifest partial-scope
install trap is not to be extended. (Not a census row — a standing fence for phase 3–4.)
