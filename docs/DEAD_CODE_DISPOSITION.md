# Dead-code disposition — code-quality-2 + code-quality-3

**Status:** **APPLIED 2026-07-14** (owner ruling: "Apply my dead-code recommendations"). Each
DELETE recommendation below was re-verified against the current tree and applied; per-entry
disposition is marked inline (**DELETED** / **KEPT**) and the full ledger + cascade notes are in
*Application log (2026-07-14)* at the foot of this file. This was the vetoable ledger the owner
ruled against; every deletion is left UNSTAGED and is git-reversible.

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
| `src/components/gallery/GalleryMapsSidebar.jsx` | 245 | Filter sidebar for the gallery MAPS tab (mirrors GallerySidebar over map facets). | **DELETED 2026-07-14 (clean leaf).** MOUNT or DELETE. Half of the Realm-suite gallery pair "landed-but-unrendered by design" (commit 9b092d55 — the WorldMap body-swap → inspector-overlay mounting pass was deferred and tracked in no ledger). Either add the mounting pass to the round-21 backlog or delete the pair. |
| `src/components/gallery/MapGalleryDetail.jsx` | 236 | Detail view for a shared map / map+campaign (the GalleryDetail parallel for maps). | **DELETED 2026-07-14.** MOUNT or DELETE — same Realm-suite pair as above. **Cascade:** it exclusively parented `CampaignStatePanel.jsx` + `MemberSettlementsList.jsx`, now orphaned (NOT in this doc → out of scope, left in place and flagged for follow-up). The stale `CampaignStatePanel.jsx:109` comment was fixed. |
| `src/lib/mapSaves.js` | 123 | Campaign / saved-map persistence layer. | **DELETED 2026-07-14.** OWNER-VERIFY → DELETE. A persistence layer with zero callers is either dead or an un-wired seam. Confirmed: zero importers repo-wide (only self); the `saved_maps` table has no other reader on this lineage. |
| `src/components/settlement/NextActionRail.jsx` | 123 | Phase-aware "what should I do next?" panel. | **DELETED 2026-07-14.** DELETE or MOUNT. Referenced only by stale doc anchors (`ProvenanceBlock.jsx:4`, `Card.jsx:7`) — both comments fixed. **Cascade:** its exclusive child `primitives/ActionRail.jsx` is now idle (NOT in this doc → out of scope, left in place and flagged for follow-up). |
| `src/components/map/SimulationRulesGateToggle.jsx` | 69 | A gate-toggle leaf extracted from SimulationRulesDialog. | **DELETED 2026-07-14.** The live Dialog renders `SimulationRulesDisclosure` (`DisclosureHeader`), not this sibling leaf; it was extracted and never wired. Confirmed: only reference repo-wide was a comment in `SimulationRulesAxes.jsx:13` (fixed). |
| `src/hooks/usePricingMoment.js` | 57 | Fire a pricing moment on a rising-edge condition. | **KEPT 2026-07-14 (paid surface).** OWNER-VERIFY. `PricingMomentCard.jsx` and `settlementSlice.js:371` reference it only in comments. Monetization-adjacent → the blanket "apply my recommendations" ruling does NOT supply the specific confirmation this OWNER-VERIFY asks for (that the pricing-moment surface is intentionally unshipped). Held for an explicit paid-surface ruling. |
| `src/components/settlement/LockToggle.jsx` | 57 | Padlock chip protecting parts of a settlement from regeneration (wired to `mapState.locks`). | **DELETED 2026-07-14.** DELETE or MOUNT. The lock feature exists in the store; this specific chip has no renderer (`StateBadge.jsx:5` mentioned it in a comment only — fixed). The store's `locks`/`setLock` are untouched. |
| `src/utils/helpers.js` | 12 | Client-side React utility functions. | **DELETED 2026-07-14.** OWNER-VERIFY → DELETE. Zero importers (the review's evidence conflated it with the heavily-used `src/generators/helpers.js` — a different file; `vite.config.js` references only the generators file, verified). Re-verify found it was in fact an empty stub — a dangling JSDoc block with NO exports. |
| `src/domain/region/migrations.js` | 45 | Regional-graph migration helpers (`migrateRegionalGraphToLatest`, `withMigratedCampaignRegionalGraph`, `migrateCampaignsRegionalGraphs`). | **DELETED 2026-07-14.** OWNER-VERIFY → MOUNT or DELETE. *Newly surfaced by F7:* its only re-export was the `region/index.js` `export *`, already curated out; its three functions had zero real consumers. The `region/index.js` note that documented the intentional non-re-export was updated to record the removal. |

---

## Section 2 — tested-but-unconsumed leaf utilities (0 src, ≥1 test consumer)

These are exercised by a unit test but rendered/called by no production code — "tested" reads as
"alive" but nothing consumes them.

| File | Lines | Test | Purpose | Recommendation |
|---|---|---|---|---|
| `src/components/primitives/Disclosure.jsx` | 69 | `tests/components/designPrimitives.test.jsx` | A generic collapsible disclosure primitive. | **KEPT 2026-07-14.** KEEP-AS-SEAM. A design-system primitive; cheap to keep as a building block. (The review listed it as dead; F7 confirms the Dialog imports the *different* `SimulationRulesDisclosure.jsx`, so this one really is unconsumed — but it is a primitive, not a feature.) |
| `src/lib/debounce.js` | 33 | `tests/lib/debounce.test.js` | Debounce a function call. | **KEPT 2026-07-14 (KEEP-AS-SEAM).** Trivial generic util. |
| `src/pdf/primitives/StatTile.jsx` | 32 | `tests/pdf/missingValuePlaceholders.test.js` | A single boxed stat (label/value/sub-label) for PDF. | **KEPT 2026-07-14 (KEEP-AS-SEAM).** A PDF primitive; keep if the PDF layer may reuse it. |
| `src/data/categoryVocabulary.js` | 80 | `tests/data/categoryGovernance.test.js` | The two institution-classification axes. | **KEPT 2026-07-14 (OWNER-VERIFY, governance canonical).** A governance-tested data vocabulary; may be a canonical reference even if not imported at runtime. Not a DELETE recommendation → held. |

---

## Section 3 — tested-but-unconsumed domain read-models (`code-quality-3`)

Whole roadmap-era read-models that generation never calls and no component renders. ~1,660 lines.

| File | Lines | Tests | Purpose | Recommendation |
|---|---|---|---|---|
| `src/domain/counterfactual.js` | 355 | 2 | "What if removed?" causal projection — pure `counterfactual(settlement, ref)` / `counterfactualCandidates` / `summarizeCounterfactual`. | **KEPT 2026-07-14 (owner-gated mount).** MOUNT — but owner-gated (see note below). Also now consumed by `tests/domain/factionProfile.test.js` (`counterfactualCandidates`) beyond its own test. Named in `docs/DESIGN_AI_CONTROL_SURFACE.md:24,111` where the mount is "branch = clone + bounded advance + diff read-model" and is listed as an *open* "mount decision". That is a new user-facing capability, not a code-health wire. **Kept, not deleted; mount deferred to the owner.** |
| `src/domain/provenance.js` | 112 | 1 | Generated-vs-authored transparency summary (`deriveProvenanceSummary`). | **DELETED 2026-07-14 (+ its dedicated test; any-cast baseline −1).** MOUNT or DELETE. Obvious dossier/DM transparency surface — but consumed by nothing (only `provenance.test.js`). Deleting it also removes the `user_canon` "User canon preserved across rerolls" copy the review flagged as an unkept promise. |
| `src/domain/pipelineRail.js` | 111 | 1 | Structured payload for a rail step-expansion view (`expandPipelineStep`). | **DELETED 2026-07-14 (+ its dedicated test).** MOUNT or DELETE. Re-verified: `components/PipelineRail.jsx` imports nothing from it (its only match was a feature-flag string literal `pipelineRail`, unrelated to this module). Consumed only by `pipelineRail.test.js`. |
| `src/domain/mapProfile.js` | 355 | 3 | Map ↔ simulator interface read-model. | **KEPT 2026-07-14 — CONSUMED (re-verify override).** DELETE or MOUNT. Beyond its own `mapProfile.test.js`, `deriveMapProfile`/`defensiveTerrainBands` are imported as a LIVE-behavior oracle by `tests/domain/resolveTerrain.test.js` (persisted-terrain reads) and `tests/domain/causalStateWallsAndLiftPolarity.test.js` (phantom-wall banding). Deleting it would gut coverage of live terrain/wall code, not just its own test — out of a dead-code wave's scope. Held. |
| `src/domain/genreProfile.js` | 274 | 1 | Genre as a structured input. | **DELETED 2026-07-14 (+ its dedicated test).** No generation-side or UI consumer; the genre signal is applied elsewhere. Its two JSDoc-anchor comments in `settlement.schema.js` (1428, 1436) were fixed to stop pointing at the deleted file. |
| `src/domain/distributionDashboard.js` | 203 | 1 | Aggregate stats over many settlements. | **DELETED 2026-07-14 (+ its dedicated test).** MOUNT behind the dev-panel pattern, or DELETE. A dashboard with no dashboard. |
| `src/domain/devAnomalies.js` | 204 | 1 | DEV-only anomaly detector. | **DELETED 2026-07-14 (+ its dedicated test; any-cast baseline −17).** MOUNT behind the existing dev-panel pattern, or DELETE. |
| `src/domain/devDebug.js` | 163 | 1 | Dev simulation-debugger payload. | **DELETED 2026-07-14 (+ its dedicated test).** MOUNT behind the existing dev-panel pattern, or DELETE. |

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

---

## Application log (2026-07-14)

Owner ruling "Apply my dead-code recommendations" applied by the Opus dead-code deletion wave on
branch `review-fixes-2026-07-08` (base `7ece475e`). All work left UNSTAGED; every deletion is
git-reversible. Each doc-listed DELETE was re-verified against the current tree (basename +
exported-symbol + dynamic-import + barrel + test greps) before removal — the doc is a point-in-time
observation and waves have landed since.

**DELETED — 14 modules + 6 dedicated tests:**

| Module removed | Dedicated test removed |
|---|---|
| `src/components/gallery/GalleryMapsSidebar.jsx` | — |
| `src/components/gallery/MapGalleryDetail.jsx` | — |
| `src/lib/mapSaves.js` | — |
| `src/components/settlement/NextActionRail.jsx` | — |
| `src/components/map/SimulationRulesGateToggle.jsx` | — |
| `src/components/settlement/LockToggle.jsx` | — |
| `src/utils/helpers.js` | — |
| `src/domain/region/migrations.js` | — |
| `src/domain/provenance.js` | `tests/domain/provenance.test.js` |
| `src/domain/pipelineRail.js` | `tests/domain/pipelineRail.test.js` |
| `src/domain/genreProfile.js` | `tests/domain/genreProfile.test.js` |
| `src/domain/distributionDashboard.js` | `tests/domain/distributionDashboard.test.js` |
| `src/domain/devAnomalies.js` | `tests/domain/devAnomalies.test.js` |
| `src/domain/devDebug.js` | `tests/domain/devDebug.test.js` |

**KEPT — re-verify overrides + owner-gate carve-outs (7):**

- `src/domain/mapProfile.js` — **re-verify override:** consumed as a live-behavior oracle by
  `tests/domain/resolveTerrain.test.js` (persisted-terrain reads) and
  `tests/domain/causalStateWallsAndLiftPolarity.test.js` (phantom-wall banding). Deleting it would
  gut coverage of live terrain/wall code, not just its own test — outside a dead-code wave's scope.
- `src/hooks/usePricingMoment.js` — paid surface; the blanket ruling does not supply the specific
  OWNER-VERIFY confirmation the entry asks for. Held for an explicit paid-surface ruling.
- `src/domain/counterfactual.js` — owner-gated mount (new capability); also test-consumed by
  `factionProfile.test.js`. (Doc already marked this KEEP.)
- `src/components/primitives/Disclosure.jsx`, `src/lib/debounce.js`, `src/pdf/primitives/StatTile.jsx`
  — KEEP-AS-SEAM primitives.
- `src/data/categoryVocabulary.js` — OWNER-VERIFY governance canonical (not a DELETE recommendation).

**Cascade orphans — FOLLOW-UP RULED 2026-07-14 (owner-delegated "use your best judgement"):** deleting
`MapGalleryDetail.jsx` orphaned its exclusive children `gallery/CampaignStatePanel.jsx` +
`gallery/MemberSettlementsList.jsx`; deleting `NextActionRail.jsx` left its exclusive child
`primitives/ActionRail.jsx` idle. Re-verified all three are now directly (no longer only transitively)
dead — zero code importers repo-wide (name census + no barrel `index.js`, no dynamic/lazy import, no
`import.meta.glob` auto-registration; the two views carry no dedicated tests and appear in neither
baseline JSON; deleting `MemberSettlementsList.jsx` does NOT orphan its lazy `PublicDossierView`, which
`GalleryDetail.jsx` still imports). Ruling follows this doc's own split — unrendered Realm-suite
**views** deleted, idle **primitives** kept as seams:
- **DELETED 2026-07-14:** `gallery/CampaignStatePanel.jsx`, `gallery/MemberSettlementsList.jsx` — the
  same unrendered Realm-suite surface as the already-deleted `MapGalleryDetail.jsx`.
- **KEPT-AS-SEAM 2026-07-14:** `primitives/ActionRail.jsx` — a general-purpose "next best action" stack
  primitive, retained on the same basis as `Disclosure.jsx` / `StatTile.jsx` / `debounce.js`.

No baseline/walker change: the two views are absent from `tests/lint/.domain-any-baseline.json` and
`scripts/.slugify-idiom-baseline.json`, and no walker enumerates them.

**Collateral edits (comment-only → stripped by minification, so byte-neutral in the dist and
goldens byte-identical):** stale anchors fixed in `CampaignStatePanel.jsx`, `Card.jsx`,
`ProvenanceBlock.jsx`, `SimulationRulesAxes.jsx`, `StateBadge.jsx`, `region/index.js`, and
`settlement.schema.js` (×2).

**Structural walkers / baselines:** only the domain any-cast ratchet needed a (legal, shrink-only)
update — `tests/lint/.domain-any-baseline.json` total **2248 → 2230** (removed `devAnomalies.js` −17,
`provenance.js` −1); ≤ constitution cap 2248 and ≤ CEILING 2252. The domain-strict baseline (0
files), the `labelJoins` frozen inventory, and the `layerBoundaries`/`architectureFreshness` walkers
list/enumerate none of the deleted files. No walker required a RAISE.
