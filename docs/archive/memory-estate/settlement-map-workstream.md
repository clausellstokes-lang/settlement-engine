---
name: settlement-map-workstream
description: THE SETTLEMENT MAP (display-lane SM-1..4) — design frozen; SM-1 model + SM-2 viewer SHIPPED to worktree branches (not merged); §8 gate verdicts (incl. the resolved SM-2 shared-read-model hoist + reclaim) + SM-3 invariants.
metadata: 
  node_type: memory
  type: project
  originSessionId: 2500ab8e-1efd-4b91-9dfe-e018195aadef
---

The library-scoped **Settlement Map** feature. Design is FROZEN in `docs/DESIGN_SETTLEMENT_MAP.md`
(read it in full — it is the architecture; do not re-architect). Placement: a **display lane**
(SM-1..3) parallel to the E-family engine lane; SM-4 near endgame; the deep campaign-evolving
scarred-history map stays the owner's parked last thing. Truth law: the dossier (settlement blob)
is the only truth; the map is a pure, view-time projection — `buildTownMapModel(settlement, mapEdits)`,
persists nothing (generator golden untouched).

**SM-1 (the deterministic model) SHIPPED 2026-07-14** — committed `bb556045` on branch
`claude/heuristic-wu-f4a0e3` (off review-fixes-2026-07-08 @ 5a78af5a). NOT pushed, NOT merged —
a worktree branch for later integration. New files only:
`src/domain/townMap/{townMapModel,institutionAssignment,anchors,index}.js` +
`tests/property/townMapGolden.test.js` + `tests/fixtures/{townMapFixtures.js,town-map-golden.json}`
(golden hash `fda792a9…`, 18 tier×terrain×walls×water configs, 207 buildings/112 districts) +
`tests/domain/{townMapModel,worldPulseBlobPreservation}.test.js`. Full gate green
(`npm run check` exit 0; vitest 8745/8745; verify:dist 109/109; first-paint closure byte-identical
at **1,216,273 B / 77 B headroom** — the model is imported by nothing eager and tree-shaken from
every dist chunk; any-cast baseline 0).

**SM-2 (the viewer) SHIPPED 2026-07-14** — 2 commits on branch `claude/musing-jepsen-13a6ff`
(off review-fixes-2026-07-08 @ ac7ba4ba): reclaim `b14d6afd` + viewer `e8039b94`. NOT pushed, NOT
merged. The `primitives/Segmented` [Dossier|Map] toggle in SettlementDetail (between toolbar band and
body, SIBLING of OutputContainer — never inside it, library-only); the pane
`src/components/townMap/SettlementMapPane.jsx` + `hoverModel.js` as a lazy() own chunk; camera cloned
from MapOverlay's image-mode branch (pixel-rect viewBox + contain-fit scale, Variant-B getScreenCTM
hit-test, touch-action:none + pinch); building hover→transient card, CLICK→pinned InstitutionCard (the
dossier's InstitutionLink opens the same modal on click, so hover=tooltip/click=modal is MORE
parity-faithful than the design's "map tooltip IS the popover" wording — InstitutionCard is a
focus-trapping modal, wrong to fire on mouseover). Parity by construction: `hoverModel.js` resolves the
REAL institution (anchor-exact `anchorForInstitution`, then `resolveInstitutionByName`) →
`deriveInstitutionProfile(inst, settlement)`, honesty-gated (no card when contributions=0), no
store/config/latentPantheon read. District cards from `deriveAllDistricts` (join on `district.id`;
institution list field is `label` not `name`). Pure vector, ZERO lucide. `DetailErrorBoundary`
extracted verbatim to `settlementDetail/DetailErrorBoundary.jsx` (component-line ratchet). New tests:
`tests/ui/settlementMap{Pane.mount,HoverParity}.test.jsx`, `settlementDetailMapToggle.test.jsx`,
`tests/build/townMapLazy.test.js` (chunk-absence). Full gate green (typecheck full+domain-strict + lint
exit 0; verify:dist 112/112; the 5 full-suite "failures" were pre-existing heavy integration tests
timing out at the 20s testTimeout under catastrophic self-inflicted machine load ~195/8-core — ALL pass
solo with a 90s timeout; NONE in the new code). Verified by 5 adversarial Opus passes (budget/mechanism,
goldens, parity/honesty/deity, scope/purity/refactor, reclaim behavior-neutrality) — all CONFIRMED.

**§8 Gate-2 RESOLVED at SM-2 — the chunk-mint cost is a shared-read-model HOIST, not the ~37 B FP-R
leak.** Empirically proven: the town-map viewer chunk + the SM-1 model are correctly ABSENT from the
first-paint entry static closure, BUT consuming `buildTownMapModel` from a SECOND lazy surface (the
dossier district tab is the first) makes Rollup hoist the shared read-models `districtProfile` +
`threatProfile` (pulled by the model's own `deriveAllDistricts`→`deriveAllThreatProfiles`) into the
entry `__vite__mapDeps` manifest as filename STRINGS — **+93 B over baseline (39 B over the 1,214,050
budget)**, UNAVOIDABLE on the chunking axis (all 3 `manualChunks` pins measured +17 kB to +659 kB worse
— they drag the chunk eager; the W4h failure). This is the memory's W4c/W4e/W4h shared-read-model hoist
class. ANY future consumer of `buildTownMapModel` from a lazy settlements-route surface hits the SAME
floor (a leaner pane can't help — the bytes are the model's own deps), but does NOT re-pay (reuses the
same two manifest entries). **RESOLUTION: reclaim-over-raise (owner said "use your best judgement", TWICE
— honored their standing [[w5-remerge-base-correction]] reclaim-first posture).** Split
`RESOURCE_TO_CHAINS` out of the eager `data` chunk into a lazy `data-lazy` leaf
`src/data/supplyChainResourceIndex.js` (−3,589 B, byte-identical values, behavior-neutral, golden-safe —
the FP-1/FP-G data-lazy leaf-split precedent) → SM-2 lands GREEN under the UNCHANGED 1,214,050 budget at
closure **1,210,500 B (+3,550 margin)**. NO budget raise. `CLOSURE_BUDGET_BYTES` untouched — headroom is
bankable for a future ratchet-down if the owner wants it.

**§8 pre-build gate verdicts (recorded in the design doc):**
- **Gate 1 — world-pulse blob preservation: PRESERVES.** The canon-member rewrite chain
  (`simulateCampaignWorldPulse` → advanceTime → food/corruption passes → `applyWorldPulseOutcomes`
  → `applyOutcomeToSettlement` → faction/religion projection → `deepClone`) is spread / identity /
  deepClone end-to-end — NO allowlist rebuild. Unknown top-level keys survive byte-for-byte, so
  **`settlement.mapEdits` is a safe SM-3 storage home** (blocksSM3: NO). Pinned:
  `tests/domain/worldPulseBlobPreservation.test.js` (incl. anti-vacuity). `normalizeSettlement`
  spreads `{ ...settlement }` too (save/load safe); the PUBLIC/gallery projection deliberately
  DROPS top-level `mapEdits` via `PUBLIC_TOPLEVEL_KEYS` (correct for library-only).
- **Gate 2 — chunk-mint cost: ZERO eager delta at SM-1.** The ~37 B entry-preload-leak measurement
  (FP-R precedent) is owed at **SM-2** when the lazy viewer chunk is actually minted (own-chunk vs
  settlements-chunk decision resolves there).

**Invariants for SM-2/SM-3 (learned building SM-1):** new `src/domain/**` files must be **any-cast 0**
(`tests/lint/domainAnyCastBaseline.test.js` — no `@type {any}`/`{*}`/ts-ignore) and must **NOT define a
local `clamp`** — import it from `src/kernel/math.js` (the code-quality-4 ratchet
`clampPrimitiveBaseline.test.js`, ceiling 61, bit SM-1). Purity: no Date.now/Math.random/localeCompare;
`createPRNG` for rng, `compareCodepoint` for sorts. The mapEdits container keys must dodge
`PRIVATE_KEY_RE` (denylists `seed|hook|compass|chronicle|secret|private…` as unanchored substrings) —
`layoutVariant`/`pins`/`legendPrefs` are clean. Model derives its rng internally as
`createPRNG(\`${_seed}::town-map:v1\`)` (layoutVariant salts it; absent ⇒ byte-identical dormancy). The
total assigner returns per-institution `placements` PARALLEL to the anchorForInstitution-sorted roster —
consume it POSITIONALLY, never via an anchorKey→districtId map (that collapses fallback-name-slug
anchor collisions). See [[owner-fix-philosophy]] (MODEL SPLIT: Fable manager/checker, Opus
implementer/verifier — used for this build) and [[handoff-plan-post-ladder]].
