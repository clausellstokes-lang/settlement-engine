# Dead-code disposition — code-quality-2 + code-quality-3

**Status:** findings + recommendations. **This document deletes nothing.** Deletion is an
owner decision (data-loss-adjacent); this is the vetoable ledger the owner rules against.

**Source:** `[code-quality-2]` (orphaned modules) and `[code-quality-3]` (tested-but-unconsumed
read-models) in `docs/COMPREHENSIVE_REVIEW_2026-07-13.md`, re-verified in wave F7.

## Method

Import census per file: `grep` every `from '…'` / `import('…')` specifier across `src/`, `tests/`,
`scripts/`, `e2e/`, then confirm by exact path (base-name collisions — `helpers`, `Disclosure`,
`migrations` — were resolved by hand; see *Corrections to the review census* below). A module is
**orphaned** if nothing outside itself imports it; **tested-but-unconsumed** if only test files do.
Comment mentions (stale doc anchors) do NOT count as consumers.

Recommendation vocabulary: **DELETE** (no evidence of intent, safe to remove) · **MOUNT** (product
intent exists — wire it, do not delete) · **KEEP-AS-SEAM** (small/primitive/paid-surface — retain
even if idle) · **OWNER-VERIFY** (sensitive; confirm before acting).

---

## Section 1 — fully orphaned modules (0 src, 0 test consumers)

| File | Lines | Purpose | Recommendation |
|---|---|---|---|
| `src/components/gallery/GalleryMapsSidebar.jsx` | 245 | Filter sidebar for the gallery MAPS tab (mirrors GallerySidebar over map facets). | **MOUNT or DELETE.** Half of the Realm-suite gallery pair "landed-but-unrendered by design" (commit 9b092d55 — the WorldMap body-swap → inspector-overlay mounting pass was deferred and tracked in no ledger). Either add the mounting pass to the round-21 backlog or delete the pair. |
| `src/components/gallery/MapGalleryDetail.jsx` | 236 | Detail view for a shared map / map+campaign (the GalleryDetail parallel for maps). | **MOUNT or DELETE** — same Realm-suite pair as above. Note: `gallery/CampaignStatePanel.jsx:109` carries a stale comment ("rendered ONCE, by MapGalleryDetail's Realm Chronicle callout") that reads as if this were live. |
| `src/lib/mapSaves.js` | 123 | Campaign / saved-map persistence layer. | **OWNER-VERIFY → DELETE.** A persistence layer with zero callers is either dead or an un-wired seam. Confirm no intended save path depends on it, then delete. |
| `src/components/settlement/NextActionRail.jsx` | 123 | Phase-aware "what should I do next?" panel. | **DELETE or MOUNT.** Referenced only by stale doc anchors (`ProvenanceBlock.jsx:4` "Lives in the right rail beneath NextActionRail", `Card.jsx:7`) — fix or drop those comments when disposed. |
| `src/components/map/SimulationRulesGateToggle.jsx` | 69 | A gate-toggle leaf extracted from SimulationRulesDialog. | **DELETE.** The live Dialog renders `SimulationRulesDisclosure` (`DisclosureHeader`), not this sibling leaf; it was extracted and never wired. |
| `src/hooks/usePricingMoment.js` | 57 | Fire a pricing moment on a rising-edge condition. | **OWNER-VERIFY (paid surface).** `PricingMomentCard.jsx` and `settlementSlice.js:371` reference it only in comments. A pricing hook is monetization-adjacent — do not delete without confirming the pricing-moment surface is intentionally unshipped. |
| `src/components/settlement/LockToggle.jsx` | 57 | Padlock chip protecting parts of a settlement from regeneration (wired to `mapState.locks`). | **DELETE or MOUNT.** The lock feature exists in the store; this specific chip has no renderer (`StateBadge.jsx:5` mentions it in a comment only). |
| `src/utils/helpers.js` | 12 | Client-side React utility functions. | **OWNER-VERIFY → DELETE.** Zero importers (the review's evidence conflated it with the heavily-used `src/generators/helpers.js` — a different file). Confirm its exports are unused, then delete. |
| `src/domain/region/migrations.js` | 45 | Regional-graph migration helpers (`migrateRegionalGraphToLatest`, `withMigratedCampaignRegionalGraph`, `migrateCampaignsRegionalGraphs`). | **OWNER-VERIFY → MOUNT or DELETE.** *Newly surfaced by F7:* its only re-export was the `region/index.js` `export *`, now curated out (its three functions have zero real consumers). If regional graphs are meant to migrate on load, this is an un-wired seam to MOUNT; otherwise DELETE. |

---

## Section 2 — tested-but-unconsumed leaf utilities (0 src, ≥1 test consumer)

These are exercised by a unit test but rendered/called by no production code — "tested" reads as
"alive" but nothing consumes them.

| File | Lines | Test | Purpose | Recommendation |
|---|---|---|---|---|
| `src/components/primitives/Disclosure.jsx` | 69 | `tests/components/designPrimitives.test.jsx` | A generic collapsible disclosure primitive. | **KEEP-AS-SEAM.** A design-system primitive; cheap to keep as a building block. (The review listed it as dead; F7 confirms the Dialog imports the *different* `SimulationRulesDisclosure.jsx`, so this one really is unconsumed — but it is a primitive, not a feature.) |
| `src/lib/debounce.js` | 33 | `tests/lib/debounce.test.js` | Debounce a function call. | **KEEP-AS-SEAM or DELETE+test.** Trivial generic util. |
| `src/pdf/primitives/StatTile.jsx` | 32 | `tests/pdf/missingValuePlaceholders.test.js` | A single boxed stat (label/value/sub-label) for PDF. | **KEEP-AS-SEAM or DELETE+test.** A PDF primitive; keep if the PDF layer may reuse it. |
| `src/data/categoryVocabulary.js` | 80 | `tests/data/categoryGovernance.test.js` | The two institution-classification axes. | **OWNER-VERIFY.** A governance-tested data vocabulary; may be a canonical reference even if not imported at runtime. Confirm before disposing. |

---

## Section 3 — tested-but-unconsumed domain read-models (`code-quality-3`)

Whole roadmap-era read-models that generation never calls and no component renders. ~1,660 lines.

| File | Lines | Tests | Purpose | Recommendation |
|---|---|---|---|---|
| `src/domain/counterfactual.js` | 355 | 2 | "What if removed?" causal projection — pure `counterfactual(settlement, ref)` / `counterfactualCandidates` / `summarizeCounterfactual`. | **MOUNT — but owner-gated (see note below).** Named in `docs/DESIGN_AI_CONTROL_SURFACE.md:24,111` where the mount is "branch = clone + bounded advance + diff read-model" and is listed as an *open* "mount decision". That is a new user-facing capability, not a code-health wire. **Kept, not deleted; mount deferred to the owner.** |
| `src/domain/provenance.js` | 112 | 1 | Generated-vs-authored transparency summary (`deriveProvenanceSummary`). | **MOUNT or DELETE.** Obvious dossier/DM transparency surface. F7 fixed its false header (it claimed "the transparency UI consumes" it — nothing does). Separately, its `user_canon` trust label ("User canon preserved across rerolls") is copy the review flags as an unkept promise — revisit if mounted. |
| `src/domain/pipelineRail.js` | 111 | 1 | Structured payload for a rail step-expansion view (`expandPipelineStep`). | **MOUNT or DELETE.** F7 fixed its false header (it claimed `components/PipelineRail.jsx` "already exists; this module produces the payload it consumes" — the component exists but imports nothing from it). |
| `src/domain/mapProfile.js` | 355 | 3 | Map ↔ simulator interface read-model. | **DELETE or MOUNT.** No renderer; decide against the spatial-engine direction (may be superseded by the Phase 5.5 spatial digest). |
| `src/domain/genreProfile.js` | 274 | 1 | Genre as a structured input. | **DELETE.** No generation-side or UI consumer; the genre signal is applied elsewhere. |
| `src/domain/distributionDashboard.js` | 203 | 1 | Aggregate stats over many settlements. | **MOUNT behind the dev-panel pattern, or DELETE.** A dashboard with no dashboard. |
| `src/domain/devAnomalies.js` | 204 | 1 | DEV-only anomaly detector. | **MOUNT behind the existing dev-panel pattern, or DELETE.** |
| `src/domain/devDebug.js` | 163 | 1 | Dev simulation-debugger payload. | **MOUNT behind the existing dev-panel pattern, or DELETE.** |

---

## Exceptions handled in wave F7 (no owner decision needed)

- **False-header fixes (comments only, byte-neutral):** `pipelineRail.js` and `provenance.js` headers
  no longer assert consumers that do not exist — they now state "BUILT but UNCONSUMED" and point here.
- **counterfactual.js — kept, mount deferred.** The task flagged it to "wire (mount, not delete)".
  Mounting it as designed (`DESIGN_AI_CONTROL_SURFACE.md`) means building the branching feature
  (clone + bounded advance + diff), a genuinely new capability whose mount decision the design doc
  itself lists as still open. Building an owner-gated new capability inside a code-health wave would
  cross an owner gate, so F7 kept the file (did not delete) and records the mount as an owner decision
  here rather than shipping a half-built feature. **Recommend: owner rules on the mount.**

## Corrections to the review census (`code-quality-2`)

The review's "~12 dead files" list needed three corrections, all verified in F7:

1. **`src/utils/helpers.js` is genuinely orphaned (0 importers)** — but the earlier "29 importers"
   figure was base-name collision with the heavily-used `src/generators/helpers.js`. The file is
   dead, for a different reason than stated.
2. **`src/components/primitives/Disclosure.jsx` is tested-but-unconsumed** (Section 2), not consumed:
   the SimulationRulesDialog imports the *different* `SimulationRulesDisclosure.jsx`.
3. **`src/domain/region/migrations.js` joined the orphan set in F7** when its only `export *`
   re-export was curated out of `region/index.js` (code-quality-6). It was already effectively dead
   (zero real consumers); the curation just made it visible.

## Suggested follow-up: the only-shrinks inventory ratchet

Both review findings propose an only-shrinks unused-module inventory test that walks the import graph
FROM entry points across ALL of `src/` (with a small allowlist for JSDoc-typedef-only and worker-URL
modules), baselining today's orphans and blocking new ones. That test is **not built in F7** (it is a
new architecture guard whose baseline includes owner-decision files above; it should land with the
owner's per-file rulings so the baseline reflects intended keeps vs deletes). Recommended as the
structural close-out once the owner has ruled on the table above.
