# THE ORGANIC CRAFT WAVE — SURFACE CENSUS (phases 3–4 close)

> **Status: DISPOSITIONED — zero PENDING.** Every entry carries one of the amended
> dispositions (owner pre-reconciliation amendment, 2026-07-18):
> **RECOMPOSED** (actively re-composed under the law) · **MATERIALS-ONLY** (the
> mechanical bridge: grounds/ink/rules/type swapped at the token chokepoint with
> zero structural change) · **DEFERRED — reason** (structural recomposition
> deferred; the surface still rides the bridge materials unless its row says
> otherwise). Residual STRUCTURAL variance on bridge surfaces is the only
> unevenness allowed to survive, and it is recorded here (§4).
>
> **THE BRIDGE MECHANISM (why MATERIALS-ONLY holds by construction):** every
> token-routed surface reads `src/design/tokens.js` (raw hex is a lint ERROR
> outside token sources; the exact-value swatch routes the long tail). The bridge
> commit re-pointed `BORDER`/`semantic.cardBorder` at the feint-rule hairline and
> pinned the ink/ground/type identity (tests/design/organicVars.test.js), so the
> organic materials flow app-wide through the one chokepoint. A surface is
> MATERIALS-ONLY unless it holds a deliberate own-palette (recorded in §4).

## 1. Routes / views (`src/lib/routes.js` — 30 declared)

### 1a. Marketing / public

| view | disposition |
|---|---|
| `home` | MATERIALS-ONLY — born under the law's addendum (doc wave); reconciliation verified, no rework (inherited ruling). |
| `pricing` | MATERIALS-ONLY — born under the law (five-band build); phase-2 sample recorded the target composition; live re-composition deferred to reconciliation (inherited ruling: "expect reconciliation, not rework"). |
| `howto` (About) | RECOMPOSED — the seal moment opens Band 1 (large device + motto caption in type); the six-band build was already law-born. |
| `compendium` | MATERIALS-ONLY — born under the registry-render law; the phase-2 Deities sample records the catalog register as the target for a later content pass. |
| `gallery` (+ hubs/slugs) | MATERIALS-ONLY — bridge via tokens; the gallery empty state already speaks the whisper grammar (`gallery_empty_invitation`). |
| `founders` | MATERIALS-ONLY — bridge via tokens. |
| `terms` / `privacy` / `refunds` | MATERIALS-ONLY — legal prose on the shared type/ink system; a manuscript-grammar re-typeset would be cosmetic on a low-traffic reference surface — the bridge suffices. |
| `compare*` (4 redirect stubs) | MATERIALS-ONLY (n/a-render) — pure redirects to /how-to; no surface renders. |

### 1b. Core app

| view | disposition |
|---|---|
| `generate` (forge) | MATERIALS-ONLY — the live operated wizard rides the bridge (flagship cluster 1); its empty state (WizardEmptyState) speaks the one voice; structural re-composition deferred (a live conversion flow — the tool wins). |
| `settlements` (Library list) | MATERIALS-ONLY — bridge; the ledger register (phase-2 sample) is the recorded target; live conversion DEFERRED with reason: bulk-select/search/sort/quota flows + their behavioral tests demand a dedicated pass under the functionality law. Empty state already SurveyorNote. |
| `settlements/:id` (dossier) | RECOMPOSED — the settlement's seeded medallion marks the header (EditableInline + all chips/controls untouched); THE HOUSE COLOPHON (seal + counterseal + motto) closes the foot; materials bridge throughout; the per-tab deep manuscript re-typeset (registers/marginalia per tab) is the recorded next tranche. |
| `realm` | RECOMPOSED (mobile gate, law §7: capability-forward copy + the CopyRealmLink gate-ending action; the pinned title kept — the tool wins) + MATERIALS-ONLY (desktop workspace — fenced: townMap/map files carry pre-existing reds + live lanes). |
| `map` / `workshop` | MATERIALS-ONLY (n/a-render) — redirects. |

### 1c. Guarded

| view | disposition |
|---|---|
| `account` | MATERIALS-ONLY — settings/billing instruments ride the bridge; structural recomposition deliberately none (operated surface). |
| `admin` | DEFERRED — owner/dev-only surface, invisible to customers; bridge materials flow regardless. |

### 1d. Auth / checkout flow

| view | disposition |
|---|---|
| `signin` / `register` / `reset-password` / `set-new-password` / `verify-email` / `confirm-email` | MATERIALS-ONLY — single-task forms on the shared tokens (FORM_MAX); the fiction stays out of credential entry deliberately (legibility beats immersion). |
| `dossier-success` (checkout) | MATERIALS-ONLY — bridge; the purchased-artifact moment already renders the dossier surfaces (which carry the colophon). |

## 2. Modal / panel / overlay inventory

| group | disposition |
|---|---|
| Shell (AuthModal, PurchaseModal, PricingMomentCard, FloatingAffordances, CampaignSyncBanner, AccountMenu, shell toasts) | MATERIALS-ONLY — operated instruments on the bridge. |
| Shell error boundary (FeatureErrorBoundary) | RECOMPOSED — the clerk's-slip stamp (house device) holds the fiction on failure; copy/role/retry untouched. |
| Shell loading (AppViews Loading) | RECOMPOSED — the diegetic loading emblem (still device, no theatrics, reduced-motion safe by construction). |
| main.jsx render-error box | DEFERRED — a raw diagnostic surface on the eager path (eager-byte constrained); not a customer surface in normal operation. |
| Realm/map panels (RealmInspector, WorldPulsePanel, WizardNewsPanel, PantheonPanel, TreatyPanel, LayersPanel, MapOverlay, MapShareEditorOverlay, WarFaithMapOverlay, WorldMapOverlays, SimulationRulesDialog, WorldMapTour) | MATERIALS-ONLY — bridge via tokens; structurally fenced (pre-existing reds + live lanes in map/townMap; the WorldMapToolbar teaching-title tranche is a RE-FLAGGED recorded deferral — not absorbed, per guidance-coherence #3). |
| Dossier/editor panels (OutputContainer tabs, ChroniclePanel, TradeDynamicsPanel, ConfigurationPanel, ServicesTogglePanel, CoherencePanel, DeityAssignmentPanel, WhatChangedPanel, PreviewPanel, StaleNarrativeModal, SupplyChainsPanel, NetworkEffectsPanel) | MATERIALS-ONLY — bridge; the dossier chrome is recomposed (header/foot); per-panel registers = the recorded next tranche. |
| ExportSheet | MATERIALS-ONLY — an operated dialog on the bridge; the ceremonial marks live on the artifacts it produces (PDF cover seal; web dossier colophon). |
| Dossier purchase (DossierLadderModal, CascadePreviewPanel, SimulationDrawer, DossierNarrativeBanner) | MATERIALS-ONLY — paid-surface behavior untouched (owner-gated class); bridge materials only. |
| TableView (at-table overlay) | RECOMPOSED (wake lock — the cook-mode mechanic; zero visual change) + DEFERRED — the dim FIELD conversion: its four kind-accent tones need field-legible steps + contrast pins (a palette design task, not a mechanical swap). |
| Surveyor AI panels (AiAnalystPanel, StyleOverhaul, InterpretApply, CustomContent, Construction, Autonomy) | MATERIALS-ONLY — operated write-stage instruments; the violet AI channel is a semantic token contract that stays. |
| Gallery panels (CampaignStatePanel, GalleryReportDialog) | MATERIALS-ONLY. GalleryModerationPanel: DEFERRED — moderation/owner tooling. |
| Admin sub-panels | DEFERRED — owner/dev-only. |
| Create flow (LayeredConfigurationPanel) | MATERIALS-ONLY — the operated config bench. |
| Primitive chassis (Dialog, BottomSheet, Toast, Segmented, Card, Button, IconButton, …) | MATERIALS-ONLY — the instrument chassis reads the bridge tokens; the organic instrument vocabulary (.oc-btn family) is the recorded target for a chassis pass. |

## 3. THE ONE-FICTION PASS (empty / error / loading)

| state | disposition |
|---|---|
| Shell loading | RECOMPOSED (the loading emblem). |
| Shell + per-tab error (FeatureErrorBoundary) | RECOMPOSED (the clerk's-slip stamp; copy untouched). |
| Library empty | Already in-fiction (SurveyorNote — the whisper grammar; untouched, registry intact). |
| Map notes empty | Already in-fiction (SurveyorNote on SettlementMapNotes). |
| Gallery empty | Already in-fiction (`gallery_empty_invitation` whisper). |
| Wizard empty (WizardEmptyState), CampaignEmptyState, generation-failure alert, Button busy spinner, per-view inline loaders | MATERIALS-ONLY — one-voice audit found no fiction breaks; deeper in-fiction rewrites are DEFERRED to the guidance layer's own recorded lanes (the Keeper's Handbook narrative rewrite stays a DELIBERATE owner-voice deferral — RE-FLAGGED, not absorbed). |
| 404 | n/a — the SPA resolves unknown paths to /create (no 404 surface exists to stamp; recorded). |

## 4. RESIDUAL VARIANCE + RECORDED SEAMS (phase-5 seam check, honest)

Material seams that SURVIVE (deliberate own-palettes, reported not hidden):
1. **The PDF reading palette** (`src/pdf/theme.js`) — a deliberate print-legibility palette; its divider `#e0d0b0` is the OLD border material. The PDF is a print artifact under its own law; re-materialising it is a print-design pass. RECORDED SEAM.
2. **TableView's sheet palette** — local swatch tones incl. the old `#E8D9B0` border; rides with the deferred FIELD conversion. RECORDED SEAM.
3. **Town-map lenses** (`src/design/townMapStyles.js`) — the map plate's own lens law (atlas goldens); exempt by design.
4. **Exact-value swatch entries** — the swatch promises byte-identical values; surfaces on swatch['#E8D9B0'] (e.g., PipelineRail) keep it until their own recomposition rows. RECORDED.
5. **Structural variance on bridge surfaces** — shadows (ELEV) and pill radii persist wherever MATERIALS-ONLY applies; the ink-density/machined-radius grammar arrives only with each RECOMPOSED tranche. This is the amendment's allowed unevenness.

Deferred phase-4/5 items (re-flagged): QR + email-me-a-link gate actions (dependency / backend send) · SPREAD per-surface compositions + REALM-on-tablet + FMG iframe touch verification (requires the manager's live preview — the lane is barred from the preview tool) · throttled mid-range TTI/INP browser ratchet (needs the e2e device-throttle harness; the static closure + font ratchets gate the dominant inputs today) · ornamented-control hover/active/focus contrast matrix beyond the shipped label/boundary pins (the organic instruments define no hover variants yet).

## 5. Offline / manifest boundary (unchanged)

OFFLINE IS OUT OF THIS WAVE. No service worker, no caching promise in any copy, no
new webmanifest; the vendored `/map/` webmanifest trap not extended. Standing fence.
