---
name: ""
metadata: 
  node_type: memory
  title: INSTANT WORLD wave shipped
  date: 2026-07-17
  tags: 
    - instant-world
    - composer
    - premium
    - wave
    - w-r2
    - shipped
  branch: claude/instant-world
  commits: 
    - a0a688bc
    - f472a350
  base: a17d71b0
  status: "RATIFIED + FOLDED into w7-prep (ancestor verified by merge-base at the 2026-07-17 resume); pins 19/19 on the merged tree per the program doc"
  originSessionId: 7115c211-9732-4751-8d73-170ba6bbcf31
---

# INSTANT WORLD wave shipped

The owner-commissioned one-click premium world generator. Built on
`claude/instant-world` off base `a17d71b0` (the surveyor-S1 merge, a w7-prep
lineage — NOT review-fixes). Two commits: a0a688bc (composer engine + store +
pins), f472a350 (UI entry + map materialization + doc). NOT pushed/merged.

## Why (the commission)
The binding spec lives in the INSTANT WORLD ledger rows of
docs/COMPREHENSIVE_REVIEW_PROGRAM.md (added on review-fixes @ commit 6e613811 +
the "SHAPE AMENDED" row). Owner: one click + basic config → a coherent staged
realm (map + tier-mixed settlements + connections), PREMIUM-GATED, that "PLACES
EVERYTHING, CANONIZES NOTHING." The amendment supersedes the original
"auto-canonize": the instant world ≡ a completed manual realm session's state at
t=0 PRE-(spatial-)canonize.

## How (the architecture — a conductor over EXISTING generators)
- `src/domain/instantWorld/worldPlan.js` — PURE plan: seed → realm size (tier-mix
  count) · tone (sim preset) · map kind (FMG template) · seeded placement scatter ·
  forked per-settlement seeds. Domain kernel (no Date/Math.random).
- `src/lib/instantWorld/composeInstantWorld.js` — THE COMPOSER. Mints tier-mixed
  settlements via generateSettlementPipeline as CANON saves, places them, discovers
  the regionalGraph (deriveGraphWithDiscoveredCandidates), applies the tone preset
  to a spatially-UN-canonized worldState, returns {campaign, settlements, plan,
  fingerprint}. TIER-BLIND. This is the SOAK-HARNESS + Surveyor-S5 programmatic API
  (client #2/#3). Pure by design; determinism enforced by the byte-identity pin.
- `src/store/instantWorldBody.js` (lazy body) + `instantWorldSlice.js` (thin action,
  registered macro in operationRegistry) — the BUTTON client (#1): composes,
  persists each member via savesService.save (real ids, remapped), commits the
  campaign, lands the user active. Zero eager (composer/body/generator all behind
  the dynamic boundary — confirmed absent from the entry closure).
- `src/components/instant/InstantWorldEntry.jsx` (lazy, in WizardEmptyState's
  signed-in mode picker) — the ONLY gate: non-premium → pricing moment + purchase
  modal; premium → 3-knob config (realm size · tone · map kind + surprise-me seed).
- `src/hooks/useInstantWorldMaterialize.js` (1 composed line in WorldMap) — FMG is
  iframe-bound + can't compose headlessly, so the composer stages the map PLAN
  (mapState.seed + mapKind + pendingMapGen marker) and this hook drives
  bridge.setTemplate+resetMap(seed) to render geography deterministically on first
  open. Marker-guarded (inert for all existing campaigns). Browser-only → PLAUSIBLE.

## Pins (CONFIRMED)
tests/lib/instantWorld/composeInstantWorld.test.js (17) + tests/store/
instantWorldBinding.test.js (2): same-seed fingerprint + full byte-identity
(injected id/clock); appropriate-N (small=5/medium=9/large=14); composition-
equivalence (active campaign, canon members, v2 map + plan, discovered graph,
worldState spatially un-canonized, tone applied); coherence (validateDossier clean
+ sound membership); tier-blind (source scan + no-auth compose). First-paint
closure 1,064,997 B < budget 1,066,400 B.

## JUDGMENTs (vetoable)
- "veto realm-N-mapping": small=5/medium=9/large=14 tier-mixed pyramids, authored
  from TIER_ORDER (no forward realm-count generator existed).
- "veto tone-mapping": tone class = Quiet/Realistic/Dramatic sim presets
  (realistic_regional default).

## Seams / deferrals
- Analytics: NO dedicated INSTANT_WORLD_GENERATED event (a new eager EVENTS name vs
  a ~tens-of-bytes first-paint margin) — deferred until the budget is measured with
  headroom, or enrich an existing campaign event.
- The SOAK-RUNNER consumption seam: the soak harness (client #2) calls
  composeInstantWorld directly (pure) + then canonizes — no store, no auth. Documented
  as the clean programmatic API; soak configs NOT modified.
- Map materialization is browser-only (PLAUSIBLE, not headless-verifiable); the
  staged tableau is fully usable + amendable without it.
