---
name: operations-legibility-shipped
description: 2026-07-22 lane — compendium Operations + Living-World tabs made legible (authored labels + descriptions on the operation registry and the tab vocabularies) and the premade-deity roster deleted from the compendium. Commit 22ee1ad4 on claude/operations-legibility off composite-r4 @ 53d72f57.
metadata: 
  node_type: memory
  type: project
  modified: 2026-07-22T07:08:36.779Z
  originSessionId: 230c87b4-b237-4d1b-a63e-af48dfb233a0
---

# Operations + Living-World legibility, deity-roster removal (2026-07-22)

Owner order (2026-07-22): the compendium Operations section leaked raw camelCase op
ids (no spaces) and never said what each op does. Manager added two amendments: the
Living-World tab gets the same treatment, and the premade-deity roster is deleted from
the compendium. Shipped in ONE commit **22ee1ad4** on branch **claude/operations-legibility**
(base composite-r4 @ 53d72f57; composite-r4 later advanced to d6a9cefc via a parallel
session — fold onto the current tip). 14 files, full gate green, first-paint closure
1,039,956 = baseline (delta 0).

## The chokepoint: the registry IS the single source
- `src/store/operationRegistry.js` OperationSpec now carries `label` (authored, spaced)
  + `description` (1-2 sentences). NEW accessor **`operationLabel(opType)`** (falls back
  to opType for unregistered/AI-proposed verbs) is the ONE thing every display surface
  reads. NO runtime camelCase splitter (would mangle NPC/AI acronyms). ⭐ RECORDED LAW
  extended: a new store action needs an operationRegistry entry AND now a label+description
  (the walker + the gen-script build guard both enforce it).
- `operationRegistry.js` has ZERO runtime importers in src/ (only tests + the gen script) —
  so its ~130 label/description strings are eager-budget-safe. The surveyor
  (InterpretApplyPanel, lazy) is the only new importer.

## Render-site census (operation opType → user-visible) — the COMPLETE set
Converted to the label (4 display sites): OperationsHub card headline (opType kept as a
small monospace reference + description below), CompendiumDashboard A-Z term, searchIndex
OPERATION_ENTRIES term (opType stays in keywords), InterpretApplyPanel op rows +
unroutable/failed diagnostics + aria-label. Anchors stay `op-<slug(opType)>` for deep-link
stability. LEFT (internal data keys, not shown): interpretApply.js, applyDispatch.js,
interpretReview.js, operations.js, React keys/DOM ids. ⚠️ EconomicsTrade.jsx `.operations`
is a FALSE POSITIVE (shadow-economy "operations", no registry import). Operations opTypes
surface ONLY in the compendium + the surveyor — chronicle/pulse/decrees render EVENT types,
a different vocabulary.

## Living-World tab: three vocabularies, authored in the GEN SCRIPT (compendium-only, lazy)
- Endgame systems: each ENDGAME_SYSTEMS entry gained a handler-grounded `blurb` (dormant
  systems honestly noted off-by-default). Grounded by a subagent that read every kernel.
- Causal variables: render the engine's authored `VARIABLE_LABEL` (was a private const in
  causalState.js — now EXPORTED, ~0 byte cost, already existed) + a gen-script description,
  killing the render-time `.replace(/_/g,' ')` splitter. `causal.variables` stays the raw
  array (freshness pin); labels/descriptions ride the new `causal.variableEntries`.
- Pressures: PRESSURE_GLOSSARY (gen script) gives label + description; `pressures.kinds`
  stays raw, new `pressures.entries` carries copy.
- ⚠️ **CALAMITY FLAG DEFECT FIXED (J7)**: ENDGAME_SYSTEMS used flag `calamityEnabled`, which
  is NOT a real rules key — the live gate is **`disastersEnabled`** (a tolerant-read helper
  `calamityEnabled()` checks it). The preset-membership scan matched the wrong literal, so
  The Great Calamity was wrongly shown `dormant:true`. Corrected to `disastersEnabled` →
  now lit in dramatic_campaign + full_simulation. One-time compendium-DISPLAY correction
  (NOT a world golden; freshness parity derives from the same flag so stays self-consistent).

## Deity-roster removal (owner ruling [[deity-doctrine-no-premade-pool]] 2026-07-21)
Removed from the compendium ONLY (reversible-now display half; deityPool.js generation stays
T4): the generated `deities` data block + DEITY_POOL import, DeitiesHub (CatalogHubs.jsx),
the Deities tab / ANCHOR_TO_TAB / TAB_META / case / WIDE_TABS (CompendiumPanel.jsx),
the dashboard tile + A-Z rows (CompendiumDashboard.jsx), the search DEITY_ENTRIES +
COMPENDIUM_TABS 'deities' (searchIndex.js), and overview/az SEO meta mentions. ALL custom-
deity surfaces untouched (CustomContent, EventComposerDeityField, PantheonActivationStrip,
?cat=deities). Sitemap regenerated (prebuild `generate-sitemap.mjs` dropped 24 deity routes;
sitemap.test.js parity pins it).

## Prevention (walker + build guard)
`tests/store/operationRegistry.walker.test.js` extended: every operation AND every
Living-World vocabulary entry (systems/variables/pressures, read from the fresh
`buildCompendiumDataObject()`) must have a legible spaced label (isLegibleLabel rejects
`[a-z][A-Z]` camelCase AND `_` snake_case) + a non-empty description; plus a source-scan
pinning the 3 converted display sites to the label. E-A plant proven red→green. The gen
script `buildCompendiumDataObject` THROWS at build time on any op/system/variable/pressure
missing copy.

## Hazards / gotchas for a successor
- ⚠️ voiceMechanics Tier-2 scans `compendiumData.generated.js` (src/domain) string literals:
  the 2 baselined em-dashes are the two system LABELS ("Doctrine — supply-web warfare",
  "Constructive flows — generosity"); the line-1 `//` comment em-dash is EXCLUDED (comments
  skipped). Any new description em-dash/bang would trip it — all authored copy is clean.
- ⚠️ freshness test pins `causal.variables` to `[...SYSTEM_VARIABLES]` — add variable copy as
  an ADDITIVE field, never reshape that array.
- ⚠️ COMPENDIUM_TABS (searchIndex.js) must mirror CompendiumPanel TABS exactly (compendiumSearch.test.js
  source-scans TABS) — remove a tab from BOTH.
- ⚠️ tests/store/advancePauseResume.test.js TIMED OUT twice under heavy parallel load; passes
  9/9 in isolation. Parallel-load reds are fake (per [[lane-end-gate-gotchas]]).
- gen:compendium-data regen is SANCTIONED for compendium changes (build artifact, W6 precedent).
