# THE BASE RECONCILIATION MAP

**`origin/master` (d024286e) organization vs `claude/the-composite` (78a04afc)**
Surveyed 2026-07-18 under THE BASE RULING (owner): master's page organization is the
BASE OF RECORD; the composite's new functionality plugs INTO it; craft treatment lands
on top. This map is the per-surface diff, classified, with the reconciled-base spec
each restoration slice builds to. Forensics addendum (culprit commits per regression)
appends below when the follow-up survey lands.

Method: files read via `git show <ref>:<path>` on both refs. Ancestry fact: master is a
STRICT ANCESTOR of the composite (merge-base = master tip; 0 master-only commits;
composite +887). Yet master frequently carries the *newer, cleaner* arrangement — its
"UX overhaul Phase" / P7–P12 doctrine refinements were developed in parallel on the
master line and **discarded at the single reconciliation merge `0168e287`** ("MASTER
MERGE W1", 2026-07-15), which resolved the contested UI files to the program
("ours"/first-parent) side; the 886 commits after it built on the already-regressed
skeleton and never restored them. This is exactly the owner's alternative-tree
diagnosis, confirmed forensically — see the FORENSICS ADDENDUM at the foot.

Shared shell fact: both refs render the reading dossier through
`src/components/OutputContainer.jsx`; the post-gen draft view is
`GenerateWizard → WizardOutputToolbar + OutputContainer(hideHeader)`. The dark
"Back · name · pop · How this was simulated · Regenerate draft · New Draft" bar is
`src/components/generate/WizardOutputToolbar.jsx`, not OutputContainer's own header.

---

## SURFACE 1 — CREATE PAGE, post-generation draft view

### MASTER organization
**`src/components/GenerateWizard.jsx`** post-generate branch
(`settlement && showOutput && !pipelineRevealActive`), child order:
1. re-roll `generateError` alert
2. `PipelineReveal` overlay (lazy, when active)
3. **`WizardOutputToolbar`** (sticky) — child order: `Back` (secondary + ArrowLeft) ·
   name/tier·pop identity · utility cluster **[`SimulationDrawer variant="toolbar"` =
   "How this was simulated" · `↻ Regenerate draft` · `New Draft`]**. All three
   utilities are quiet secondaries, right-clustered.
4. **`OutputContainer hideHeader`** (the dossier) — see shell below
5. Save row (centered): **`SaveToLibraryButton`** ("Save this town. Free account →") +
   **`BuyThisDossier`** ("Buy this dossier for $2.99") + **`ExportDraftButton`**
6. leave-confirm `ConfirmDialog`
7. post-gen "what's next" checklist floats separately as
   **`src/components/PostGenCoach.jsx`**, mounted at App level (App.jsx:948) —
   *not* an in-page block.

`OutputContainer.jsx` shell (child order inside the parchment card):
- `DossierHeaderRow` (suppressed here via `hideHeader`)
- Lifecycle secondary bar: `‹ Library` ghost link + `LifecycleSpine`
  (draft→saved→canon→simulated→shared)
- `DossierActionBand` (single collapsed chrome band; violet Narrative-Layer pitch left,
  owner cluster `BuyThisDossier`/`ShareToGallery`/`SimulationDrawer` right; in embedded
  flow Buy + How are suppressed because the toolbar owns them)
- `WelcomeCreditCard` · `PendingChangesBar` (self-gating, lazy)
- **`DossierGroupTabStrip`** — Summary / Systems / World / Notes
- **`DossierTabStrip`** (desktop, ‹ › scroll-arrow pagers) or `MobileTabStrip`
- content: `DossierNarrativeBanner` → `DossierSessionNotices` → regen overlay → `renderTab()`

`TAB_GROUPS` (master, `OutputContainer.jsx:99`):
- summary: overview, summary, plot_hooks, dm_compass
- systems: services, economics, power, defense, resources, viability, substrate, magic, war_faith
- **world: npcs, relationships, daily_life, history, neighbours (NPC-first — explicit
  "P8 first-click-lands")**
- notes: dm_notes, ai_notes, chronicle

`OverviewTab.jsx` (master, 527 lines) child order: **Systems Health** (4 status cards +
`ScoreRow` labeled meter rows) → **Tensions and conflicts** → **Settlement Origin** →
**Notable Connection** with an *actionable* `Button "Full relationship web →"`
(`onNavigateTab('relationships')`) → **Geography and resources** → **Spatial Layout**
as its OWN top-level collapsible `Section` → violations/coherence/**Suggestions**
cluster → **INSTITUTIONS** chip-row.

`DossierHeaderRow.jsx` (master): identity bar with **no reroll button** ("Reroll lives
in the NPCs/History tab bodies … NOT in this header — a header control on only 2 of
~20 tabs read as a layout glitch"). Header facts use high-contrast
`HEADER_FACT #D8C8A8` (P7). Supports `allowRename`/`onRenameSettlement` for the
saved-dossier editor.

### COMPOSITE current state (differences)
- `OutputContainer.jsx` (903 lines) — **same shell and child order**, but:
  - Adds **`HouseColophon`** (organic seal/counterseal) at the dossier foot (`:881`).
  - `DossierSessionNotices` + the two confirm dialogs are re-homed into
    **`src/components/dossier/DossierAiConfirms.jsx`**.
  - `TABS` array carries a per-tab **`Icon`** (master's are label-only).
  - Retains live feature flags (`flag('narrativeLayerStrip')`, `flag('tableView')`,
    `flag('dossierFiveTabs')`) that master inlined as forever-on.
- `TAB_GROUPS` (composite): **world = relationships, rumors, daily_life, npcs, history,
  neighbours** (Relationships-first, not NPC-first; adds `rumors`); **notes adds `versions`**.
- **`DossierHeaderRow.jsx` (composite)** passes `selectedTab/onRegenerate/REROLLABLE`
  and renders a **`RefreshCw` "Reroll NPCs/History" button in the header** on those
  tabs. Header facts use lower-contrast `swatch.mutedBrown`. Adds an `emblem(...)`
  medallion (organic) at the left. No `allowRename` path (rename only via live-editor
  `queueEdit`).
- `WizardOutputToolbar.jsx` (composite): structurally identical (Back · name ·
  How-this-was-simulated · Regenerate draft · New Draft); only `SimulationDrawer` made
  lazy + `formatCount` + reworded "New Draft" title.
- `OverviewTab.jsx` (composite, 351 lines): same section sequence, but **"Full
  relationship web →" is downgraded from an actionable jump `Button` to static text**
  ("→ Full relationship web in the Relationships tab.") — signature
  `{settlement, narrativeNote}` has no `onNavigateTab`; and **Spatial Layout is folded
  inside the Geography & Resources section** rather than its own top-level collapsible.
  Labels: "Tensions & Conflicts"/"Geography & Resources" (composite) vs "…and…" (master).
- Post-gen add: **`src/components/generate/WizardNextSteps.jsx`** renders the "what's
  next" checklist as an **in-page block** below the Save row; **`PostGenCoach.jsx` is
  absent** from the composite.
- Anon footer pair (`SaveToLibraryButton` + `BuyThisDossier`) — same, in the same Save row.

### CLASSIFICATION
- Header reroll button (composite) vs no header reroll (master): **ORGANIZATION-REGRESSION**
  (composite reintroduces the header control master deliberately moved into tab bodies).
- World group order relationships-first (composite) vs NPC-first (master):
  **ORGANIZATION-REGRESSION** (contradicts master's stated first-click-lands ordering).
- "Full relationship web →" static text (composite) vs actionable jump button (master):
  **ORGANIZATION-REGRESSION** (lost cross-tab affordance).
- Spatial Layout nested under Geography (composite) vs own top-level Section (master):
  **ORGANIZATION-REGRESSION** (minor; loses a top-level read).
- `rumors` tab, `versions` tab, tab `Icon`s: **FUNCTIONALITY-ADDITION**.
- `HouseColophon` foot + header `emblem`, header-fact color, "&"/"and" labels,
  `DossierAiConfirms` extraction, lazy SimulationDrawer: **NEUTRAL-RESTYLE**
  (flag: composite's muted-brown header facts are a P7 contrast downgrade).
- In-page `WizardNextSteps` block (composite) vs floating `PostGenCoach` (master):
  **ORGANIZATION-REGRESSION** (master's floats as one dismissible helper; composite
  adds a second in-page block).

### RECONCILED BASE spec
Keep master's `OutputContainer` shell, `DossierHeaderRow` (no header reroll;
high-contrast facts; `allowRename`), master `TAB_GROUPS` world=NPC-first, master
`OverviewTab` (actionable relationship-web button + top-level Spatial Layout), and
floating `PostGenCoach`. Plug in from composite: the `rumors` + `versions` sub-tab
registrations (as data in `TAB_GROUPS`/`TABS`), the organic `HouseColophon` foot +
header `emblem` (decorative), and `DossierAiConfirms` extraction. Reroll stays in the
NPCs/History tab bodies.

---

## SURFACE 2 — LIBRARY settlement view (`src/components/SettlementDetail.jsx`)

### MASTER organization (973 lines)
- **Header card** (~:690): `Back to list` link · settlement name (`EditableInline` in
  edit mode) · `PhaseBadge` (DRAFT / Canonize / RAW chips) · `StateBadge`
  (Narrated/Raw) · action cluster **[Export Dossier (primary) · Edit Dossier · Share to
  Gallery · `BuyThisDossier` "Keep the PDF $2.99" for non-owners]**.
- **`dossierHero`** = two-column flex (`:485`): left `dossierReadPanel`
  (`OutputContainer readOnly saveId`, flex 1 1 520px, `suppressNarrativeCta` in read
  mode) + **right sticky `<aside>` (flex 0 1 248px) rendering `NextActionRail`**.
- **`src/components/settlement/NextActionRail.jsx`** (the right rail): an
  `ActionRail title="Next best action"` computing phase-aware items —
  Save/Canonize/Send-to-Realm primary; **Narrate (`Polish`, with credit price) ·
  Regenerate · Export · Place-on-Map · Edit ("Tweak settings without rerolling
  identity.")** secondaries + regenerate discard-confirm.
- LifecycleSpine "Library→Draft→Saved→Canon→In the Realm→Shared" stepper renders inside
  OutputContainer's lifecycle bar (`primitives/LifecycleSpine.jsx`; STAGES identical on
  both refs).
- Upgrade nudge "Save it. Come back tomorrow." = the `first_save` **pricing-moment**
  (`copy/strings.js:121`, `copy/en.js:717`), surfaced in the library/save funnel.
- Below: Share-to-Gallery panel (toggled), `ExportSheet` variant picker, canonize confirm.

### COMPOSITE current state (783 lines)
- Header card: `Back to list` · `PhaseBadge` · Edit Dossier · Export Dossier ·
  `BuyThisDossier` · Share to Gallery — **same header actions**.
- **`NextActionRail` is GONE — the file does not exist in the composite tree, and there
  is no right-side `<aside>`.** The two-column dossier+rail layout is replaced by a
  **single full-width column**.
- New above the body: a **`Segmented` [Dossier | Map] lens toggle** (`:747`); body
  renders `detailView === 'map' ? SettlementMapPane : OutputContainer` (town map is
  library-only).
- New: **`SessionMode`** run-of-play takeover
  (`src/components/session/SessionMode.jsx`, flag `sessionMode`, lazy modal).
- Error boundary swapped to `DetailErrorBoundary`.

### CLASSIFICATION
- Removal of `NextActionRail` sticky right rail (Narrate-with-price / Export / Edit
  "Tweak settings…" cards + guided "Next best action"): **ORGANIZATION-REGRESSION**
  (the guided action rail and its two-column structure are lost).
- `[Dossier | Map]` Segmented + `SettlementMapPane` town map: **FUNCTIONALITY-ADDITION**.
- `SessionMode` takeover: **FUNCTIONALITY-ADDITION**.
- `DetailErrorBoundary`: **NEUTRAL-RESTYLE**.

### RECONCILED BASE spec
Restore master's two-column `dossierHero` with the sticky `NextActionRail` right rail
(phase-aware "Next best action" cards). Plug the composite functionality in *around*
it: add the `[Dossier | Map]` `Segmented` toggle above the left dossier column feeding
`SettlementMapPane`, and keep `SessionMode` as a flag-gated lazy takeover launched from
a rail/header action. Keep the "Save it. Come back tomorrow." nudge as the `first_save`
pricing moment.

---

## SURFACE 3 — CREATE PAGE, pre-generation

### MASTER organization
- Landing = **`src/components/generate/WizardEmptyState.jsx`**: `HomeHero` →
  `.sf-proof-pair` [`home/HomeSampleDossier.jsx` (Hightower's Reach 3-callout) +
  `home/RegionWakeReplay.jsx` ("Watch a region wake up" · Advance a month · See what
  the Realm unlocks)] → signed-in `PageHeader "Want full control?"` + **`ModeSelector`
  in the QUIET non-large variant**, wrapped in one parchment card, framed at `LANDING_MAX`.
- `HomeHero.jsx` (390 lines): heroV2 **inlined/GA** (anti-AI H1 + italic deck), compact
  card at `LANDING_MAX`, three `SizeButton`s (Hamlet/Village/Town) built on the
  `Button` primitive, one "Forge a town →" CTA, anon-cap line.
- Config stage (`GenerateWizard.jsx` `!settlement`): **collapsed into ONE
  `LayeredConfigurationPanel`** (Character preset → Foundations → Fine-tune → Deep
  constraints → Place-in-Region); Advanced adds `WizardCloseout`; single full-width
  **"Generate Draft"** button. No StepIndicator, no per-step
  Institutions/Services/Trade panels.

### COMPOSITE current state
- `WizardEmptyState.jsx`: same `HomeHero` + proof pair, but adds
  **`instant/InstantWorldEntry.jsx`** (premium one-click realm) above the mode picker,
  uses **`ModeSelector large`**, plainer "Want full control?" strip, hardcoded
  `maxWidth:860`.
- `HomeHero.jsx` (387 lines): heroV2 still **flag-gated** (legacy branch present);
  `maxWidth:720`; `SizeButton` is a **raw `<button>`** (not the primitive); keeps
  `setEntryPath('instant')`/`beginError` exit model master dropped.
- Config stage: **reintroduces a multi-step Advanced wizard** — `PageHeader` +
  **`generate/StepIndicator.jsx`** + "Step N of M" hint band + step body
  **[0 `ConfigurationPanel` · 1 `InstitutionalGrid` · 2 `ServicesTogglePanel` ·
  3 `TradeDynamicsPanel`]** + Back/Next nav + "Ready to Generate" →
  **`generate/WizardCommitBand.jsx`**; plus `flag('wizardChromeDiet')` →
  `generate/WizardChipRow.jsx`. `WizardCloseout` only at the final step.
- Marketing landing (`HomeLanding.jsx`) additionally gains `home/LandingArtifacts.jsx`
  + `home/LandingBelowFold.jsx` (composite-only).

### CLASSIFICATION
- Stepped Advanced wizard (StepIndicator + separate Institutions/Services/Trade steps +
  Next/Back + WizardCommitBand) vs master's single `LayeredConfigurationPanel`:
  **ORGANIZATION-REGRESSION** (composite is the older multi-panel arrangement master
  consolidated; also the direct subject of the owner's "too many pieces … looks
  unorganized" veto).
- `ModeSelector large` (composite) vs quiet demoted picker (master):
  **ORGANIZATION-REGRESSION** (large cards compete with the hero CTA that master made
  the single focal point).
- `InstantWorldEntry`, `LandingArtifacts`/`LandingBelowFold`: **FUNCTIONALITY-ADDITION**.
- heroV2 flag-gated, `maxWidth` numbers, raw `<button>` SizeButton, `WizardChipRow`
  chrome-diet: **NEUTRAL-RESTYLE** (with a flag-vs-inlined divergence).

### RECONCILED BASE spec
Keep master's single `LayeredConfigurationPanel` config stage (+ Advanced
`WizardCloseout` + one "Generate Draft"), the GA-inlined `HomeHero` at `LANDING_MAX`
with the primitive `SizeButton`, and the quiet demoted `ModeSelector`. Plug in from
composite: `InstantWorldEntry` (as a subordinate premium card beside the quiet mode
picker) and the `LandingArtifacts`/`LandingBelowFold` marketing exhibits. Drop the
StepIndicator/WizardCommitBand/per-step panels. OWNER VETO applies here: the anonymous
gauge shows HAMLET→TOWN ONLY — master's three-button hero (Hamlet/Village/Town)
already satisfies it.

---

## SURFACE 4 — Nav bar (`src/App.jsx`)

### MASTER vs COMPOSITE
Both render the desktop `<header>` (sticky, z:50) with the identical left `<nav>` item
cluster and the **identical right cluster: credits chip (violet count + "credits") ·
`Upgrade` chip (free tier only) · `AccountMenu` (account-name button +
Account/Manage-subscription menu)**. Mobile header + `MOBILE_NAV_PRIORITY` identical.
Only difference: the composite **footer** logo uses the organic
**`brand/HouseDevice.jsx`** mark.

### CLASSIFICATION
- Right cluster order/structure: **NEUTRAL** (unchanged — no reconciliation needed).
- `HouseDevice` footer brand mark: **NEUTRAL-RESTYLE** (organic layer).

### RECONCILED BASE spec
No change required; nav is already aligned. Keep the `HouseDevice` footer mark as part
of the organic layer.

---

## SURFACE 5 — Other spots where master's organization is cleaner
- **`DossierActionBand`**: master fully inlines the single-band collapse (forever-on);
  composite still routes it through `flag('narrativeLayerStrip')`. Prefer master's
  inlined single-band. **NEUTRAL/ORG.**
- **Header-fact contrast** (`DossierHeaderRow`): master's `HEADER_FACT #D8C8A8` clears
  P7 contrast on the dark bar; composite's `mutedBrown` is a persistent-state contrast
  downgrade. Prefer master. **ORGANIZATION-REGRESSION (a11y).**
- **Flag debt generally**: master has retired several flags to forever-on inlined paths
  (`summaryMagazineV2`, `dossierFiveTabs`, `heroV2`, `narrativeLayerStrip`); the
  composite still branches on them, carrying dead legacy alternatives. Prefer master's
  inlined organization as the base.

---

## NEW COMPOSITE FUNCTIONALITY THE BASE MUST ABSORB (names only, from the composite tree)

**Guidance / whisper system** → `lib/guidance.js`; `domain/display/guidanceNotes.js`,
`guidanceRegistry.js`, `glossary.js`; `components/guidance/SurveyorNote.jsx`,
`SurveyorGlossary.jsx` (in-flow dossier-top "whispers"). *Plugs into: Surface 1 dossier
top + inline reads.*

**Surveyor AI panels (S1–S7)** → mounted via `components/FloatingAffordances.jsx`
(App.jsx:895): `AiAnalystPanel.jsx` (**S1** analyst chat, read-only),
`surveyor/SurveyorWorkshop.jsx` (shell) hosting `InterpretApplyPanel.jsx` (**S3**
accept→mint), `CustomContentPanel.jsx` (**S4**), `ConstructionPanel.jsx` (**S5/S6**),
`StyleOverhaulPanel.jsx`, `AutonomyPanel.jsx` (**S7** "Run"), `surveyorPanelKit.jsx`,
`useSurveyorContext.js`; plus `FeedbackWidget.jsx`; support: `lib/aiAnalyst.js`,
`surveyorAutonomy.js`, `surveyorByok.js`, `surveyorWrite.js`, `domain/ai/*`,
`domain/autonomy/*`, `domain/intent/*`, `domain/construct/*`, `domain/content/*`,
`config/aiTaskConfig.js`. *Plugs into: App-level floating layer, gated to owner surfaces.*

**Map stack (lenses / panorama / interiors / fog / pins / change-view)** →
`components/townMap/*` (`SettlementMapPane.jsx`, `SettlementMapPanorama.jsx`,
`SettlementMapCards/EdgeLabels/Annotations/Landform/Notes/EditControls`, `fog/*`,
`useMapCamera/useMapAnnotations/useMapLayerAnalytics`),
`components/interior/InteriorView.jsx`; domain: `domain/townMap/*` (`changeView.js`,
`fogGeometry.js`, `townMapDraw.js`, `townLayoutV2.js`, `siteGenesis.js`…),
`domain/interior/*`, `domain/spatial/*`. *Plugs into: Surface 2 via the
`[Dossier | Map]` `Segmented` toggle (library-only).*

**Exports** → `foundry/generateFoundryModule.js`, `moduleBuilder.js`,
`journalPages.js`, `zip.js`; `lib/townMapExport.js`, `realmMapExport.js`,
`useRealmMapExport.js`; `pdf/TownMapDocument.jsx`, `pdf/sections/TownMapPlate.jsx`,
`utils/townMapPdfExport.js`; `components/townMap/SettlementMapExportMenu.jsx`;
`components/settlementDetail/resolveExportSeam.js`. *Plugs into: Surface 2 Export
cluster + map export menu.*

**Entitlement gates** → `config/entitlementLadder.js`, `config/tierFacts.js`,
`config/pricingDisplay.js`; `components/settlements/LivingWorldGates.jsx`;
`lib/spatialUsage.js`, `spatialCanonizeUsage.js`, `constructionUsage.js`. *Plugs into:
Surfaces 1–3 CTAs + Surveyor/map/session gating.*

**Organic design layer** → `components/organic/*` (`HouseColophon`, `Manuscript`,
`Ornament`, `Register`, `Rule`, `samples/*`), `components/brand/HouseDevice.jsx`,
`design/organic/*` (`ink.js`, `rubrication.js`, `ornament/compose.js`…),
`styles/organic.css`, `organicVars.css`, `pdf/primitives/HouseDeviceSeal.jsx`. *Plugs
into: dossier foot (Surface 1), header emblem, nav/footer brand (Surface 4), all card
chrome.*

**Also net-new tabs/panels** for the restored dossier: `new/tabs/RumorsTab.jsx`,
`settlement/VersionsTab.jsx`, `settlement/DeityAssignmentPanel.jsx`/`FaithSection.jsx`,
`session/SessionMode.jsx`, `instant/InstantWorldEntry.jsx` — register these into
master's `TAB_GROUPS`/action surfaces rather than reorganizing the surfaces to fit them.

---

## One-line reconciliation thesis
Restore master's arrangement on the three regressed surfaces — **Surface 2's two-column
`NextActionRail` right rail**, **Surface 3's single `LayeredConfigurationPanel`**, and
**Surface 1's header (no reroll) + NPC-first World group + actionable relationship-web
button + floating `PostGenCoach`** — then re-register the composite's new capabilities
(rumors/versions/deity/session tabs, town-map `Segmented`, Surveyor/guidance floating
layer, foundry/map exports, entitlement gates, organic chrome) *into* that restored
skeleton rather than letting them dictate layout. Surface 4 already matches.

---

## FORENSICS ADDENDUM — MERGE FORENSICS (landed 2026-07-18)

### Topology finding (this reframes everything)
`git merge-base origin/master claude/the-composite` = **`d024286e` = master's own
tip**, and master IS an ancestor of the composite (0 master-only commits). But master
did not "lead into" the composite gradually — master tip's **only child in the
composite DAG is a single merge commit**:

> **`0168e287` — "MASTER MERGE W1 — the merge commit: 568 conflicts resolved per
> MASTER_MERGE_PLAN §4/§5 dispositions"** — Clausell Stokes III, 2026-07-15.
> `parents:` **`8c430c5b` (program line, FIRST parent / "ours")** ·
> **`d024286e` (master, SECOND parent / "theirs")**.

The two lineages the owner described are real and distinct: the owner's master UI line
(`d024286e`) and the program's feature line (`8c430c5b`, tip of the `claude/w7-prep`
integration branch). They meet exactly once, at `0168e287`.

### Verdict on the owner's hypothesis: **CONFIRMED**, with one sharpening
Per-surface probe of the distinctive master structure at four points —
`master(d024286e)` · `program(8c430c5b, pre-merge 1st parent)` · `merge(0168e287)` ·
`tip` (occurrence counts of the distinctive marker):

| Regression (file) | master | program | merge | tip |
|---|---|---|---|---|
| R7 stepped wizard — `LayeredConfigurationPanel` (GenerateWizard) | 5 | 0 | 0 | 0 |
| R7 program `StepIndicator` (GenerateWizard) | 0 | 2 | 2 | 2 |
| R3 `onNavigateTab` relationship-web button (OverviewTab) | 3 | 0 | 0 | 0 |
| R4 `Spatial Layout (` own section (OverviewTab) | 1 | 0 | 0 | 0 |
| R1 `REROLLABLE` header reroll (DossierHeaderRow) | 0 | 3 | 3 | 3 |
| R1 master "Reroll lives in the NPCs…" comment | 1 | 0 | 0 | 0 |
| R2 world `tabs: ['npcs'` NPC-first (OutputContainer) | 1 | 0 | 0 | 0 |
| R6 `NextActionRail` right rail (SettlementDetail) | 10 | 0 | 0 | 0 |
| R8 `LANDING_MAX` landing frame (WizardEmptyState) | 4 | 0 | 0 | 0 |
| R5 `PostGenCoach` mount (App.jsx) | present | absent | absent | absent (→`FloatingAffordances`) |

Every row shows the same signature: **master alone carried the good structure; the
program's first parent never had it; the merge resolved to the program side
(`merge == program ≠ master`); the tip is unchanged from the merge.** Master was the
*second* parent, and for the contested UI the `MASTER_MERGE_PLAN` dispositions kept
"ours" (the program).

**Sharpening (recorded):** the regressions were **not** a wave rewriting the surface
and **not** the composite reverting its own good code. Master's refinements existed
*only* on the master line, developed in parallel; `0168e287` is the **sole point of
contact**, and it discarded them. No later restoration — for all surfaces
`tip == merge` (master markers stayed 0 from merge→tip); the 886 subsequent commits
only layered new functionality on top of the already-regressed skeleton.
(This supersedes the map preamble's guess that master's refinements were "received at
the reconciliation merge and then overwritten inside the 887" — they were never
received at all: discarded AT the merge itself.)

### FORENSICS column — per regression
Every regression was decided at the same event; they share one culprit hash and one
commit type:

| # | Surface / regression | Culprit | Commit type | Collateral (same commit) |
|---|---|---|---|---|
| R1 | Header reroll reintroduced (`DossierHeaderRow.jsx`) | `0168e287` | **MERGE** — resolved to program ("ours") side | part of the 147-file master-overwrite; siblings incl. `DossierTabStrip`, `DossierNarrativeButtons`, `SimulationDrawer` |
| R2 | World group relationships-first, not NPC-first (`OutputContainer.jsx`) | `0168e287` | **MERGE** — program side | `SummaryTabV2.jsx`, `tabConstants.js`, all `new/tabs/*` overwritten in same merge |
| R3 | "Full relationship web →" downgraded to static text (`OverviewTab.jsx`) | `0168e287` | **MERGE** — program side | co-located with R4 in the same file; whole `new/tabs/` cohort |
| R4 | Spatial Layout demoted under Geography (`OverviewTab.jsx`) | `0168e287` | **MERGE** — program side | same file/commit as R3 |
| R5 | Floating `PostGenCoach` → in-page `WizardNextSteps` (`GenerateWizard.jsx` + `App.jsx`) | `0168e287` | **MERGE** — program side | `App.jsx` PostGenCoach mount dropped here; `PostGenCoach.jsx` overwritten then later reaped; `SaveToLibraryButton`, `ExportDraftButton`, `ChangeModeBar` also overwritten |
| R6 | `NextActionRail` right rail removed (`SettlementDetail.jsx`) | `0168e287` | **MERGE** — program side | `settlement/NextActionRail.jsx`, `primitives/ActionRail.jsx`, `PhaseBadge`, `StateBadge`, `ExportSheet`, `LifecycleSpine` all overwritten same merge |
| R7 | Stepped wizard, not single `LayeredConfigurationPanel` (`GenerateWizard.jsx`) | `0168e287` | **MERGE** — program side | `ConfigurationPanel.jsx` overwritten; `LayeredConfigurationPanel.jsx` survives only as an orphan |
| R8 | `ModeSelector large` + plainer frame (`WizardEmptyState.jsx`) | `0168e287` | **MERGE** — program side | `HomeHero.jsx`, `HomeLanding.jsx`, `theme.js` overwritten same merge |
| S5 | Header-fact contrast, flag-debt (`DossierHeaderRow`, `DossierActionBand`) | `0168e287` | **MERGE** — program side | `theme.js`, `new/design.js`, `copy/en.js`, `copy/strings.js` |

### Collateral blast radius of `0168e287` (beyond the nine surfaces)
The one merge resolved to the program side for **198 UI files** under
`src/components` + `src/copy` + `src/design` — of which **147 existed in master and
had their master version overwritten**, and **51 are program-new files** that landed
here (`SessionMode.jsx`, `RumorsTab.jsx`, `guidance/*`,
`LandingArtifacts/LandingBelowFold`, `DossierAiConfirms`, `WizardChipRow`,
`WizardCommitBand`, `FaithSection`, `DeityAssignmentPanel`, `MarketPricesSection`,
`SteadingsSection`, …). High-signal master surfaces overwritten in the same stroke,
beyond the nine above:
- **Design substrate:** `src/components/theme.js`, `src/components/new/design.js`,
  `src/components/new/tabConstants.js`
- **Copy:** `src/copy/en.js`, `src/copy/strings.js`
- **Whole dossier tab cohort:** every `src/components/new/tabs/*` (Economics, Power,
  Services, Defense, Resources, Viability, NPCs, History, DailyLife, Magic, Substrate,
  WarFaith, Relationships)
- **Pricing / library / settlements:** `PricingPage.jsx`, `pricing/FounderTile.jsx`,
  `pricing/PricingMomentCard.jsx`, `SettlementsPanel.jsx`, `library/LibraryToolbar.jsx`,
  `settlements/SaveQuotaMeter.jsx`, `settlements/SettlementCard.jsx`
- **Primitives:** `ActionRail`, `LifecycleSpine`, `MobileTabStrip`, `StateBadge`,
  `IconButton`, `Disclosure`, `Page`, `BottomSheet`
- **How-to / landing:** `HowToUse.jsx`, `HomeLanding.jsx`

### Bottom line
There is **one culprit for the entire organization-regression class: merge commit
`0168e287` ("MASTER MERGE W1")** — a conflict-resolution merge that kept the program's
("ours"/first-parent) side and discarded master's ("theirs"/second-parent) page
organization across ~147 UI files. The owner's diagnosis is correct in mechanism
(out-competed in conflict resolution, then built over) and correct that it was a
single remerge event — not a slow rewrite. The reconciled base is therefore
recoverable by three-way: master's version of each surface still lives intact at
`d024286e:<path>`, and the program's additive functionality (the 51 new files + the
886 post-merge commits) can be re-seated onto it, exactly as the per-surface
RECONCILED BASE specs above prescribe. No regression traces to a divergent-pre-merge
or never-existed case — for every one, master's structure is present at
`d024286e:<path>` and absent from `8c430c5b:<path>`.

**Restoration implication:** because the entire 147-file master cohort was decided at
one commit, every §2 slice's SET-THE-BASE step should consult
`git diff 0168e287^2 0168e287 -- <path>` (what the merge discarded) alongside the
per-surface specs — and the ~138 collateral files not yet surveyed surface-by-surface
(pricing, library toolbar, settlements cards, how-to, primitives, copy, theme) must be
walked by their owning slices with the same master-first rule before craft treatment.
