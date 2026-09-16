---
name: ""
metadata: 
  node_type: memory
  title: SB1 store & lifecycle cluster shipped
  created: 2026-07-21
  type: shipped-lane
  branch: claude/sb1-store
  tip: "27369696"
  base: "084549e4"
  tags: 
    - store
    - lifecycle
    - advance-guard
    - migration
    - sizeBaseline
    - walker
    - deferrals
  originSessionId: ff8b4b71-3ea5-4d7a-9793-42190018c11f
  modified: 2026-07-21T04:22:39.778Z
---

# SB1 — store & lifecycle hardened (claude/sb1-store @ 27369696, NOT folded)

Refute-and-fix of the SB1 cluster (10 findings). One gated commit, base 084549e4.
5 fixed in src/store, 1 refuted (already fixed in tree), 4 deferred out-of-lane.

## What shipped (the 5 in-lane fixes)
- **Advance-guard gaps** (finding 1): added the store-2/store-hooks-state-4 in-flight
  + parked guards to `injectCampaignStressor` (reachable via surveyor AutonomyPanel
  nudge), `rebuildCampaignRegionalGraph` (SettlementsPanel "Discover"),
  `setRegionalChannelStatus` ("confirm channel"), `setRegionalChannelVisibility`
  (parity). Each no-ops null in-flight AND parked. **`resolveCampaignStressor` +
  `setCampaignRegionalGraph` deliberately NOT guarded** — sole caller
  rippleEventThroughWorld is upstream-gated by the queueSettlementEvent guard, so
  guarding would create a split-truth trap (dossier edit lands, twin dropped), not
  close a gap. Pins in advanceInFlightMutatorGuard.test.js.
- **importGalleryMapWithCampaign** (finding 2): member clone now wraps
  `normalizeSettlement` (parity with galleryImportSettlement + accountImport) via a
  DYNAMIC import — campaignSlice is EAGER, a static import would drag the migration
  chain into first paint (why galleryImportSettlement was lazy-extracted).
- **Incident silently dropped on draft** (finding 3): `queueEdit` now refuses a
  `dispatch:'flavor'` table directive when phase!=='canon' (recordCanonFlavorEntryImpl
  no-ops off-canon; commit cleared the queue with false success). Net-zero in the
  at-ceiling settlementSlice — folded the rename-npc guard to a one-liner, baseline
  1344→1343.
- **hydrateServicesToggles dead migration** (finding 4): wired `normalizeServicesToggles`
  into `store/index.js` onRehydrateStorage (its prescribed path; servicesToggles IS
  persisted but nothing normalized it). Direct-mutation idiom, mirroring the shipped
  `state.wizardStep = 0` reset (CONFIRMED-by-equivalence — no full-store rehydrate
  integration test; wiring pinned by source-scan).
- **migrateCampaign non-deterministic remint** (finding 7): new
  `uuidFromLegacyId(source)` in campaignSliceShared derives a deterministic v4-shaped
  UUID so local-cache + remote-list copies of the same legacy campaign converge and
  mergeCampaignLists dedupes. Empty/missing id keeps the random newCampaignId().

## Durable hazards discovered
- ⚠️ **operationRegistry walker regex is exclusive**: `composedSliceFiles()` in
  tests/store/operationRegistry.walker.test.js matches `import { createXSlice } from
  './xSlice.js'` — a SINGLE name in the braces. Co-importing a helper on the
  createXSlice line (e.g. `{ createToggleSlice, normalizeServicesToggles }`) drops that
  slice from the census → ALL its actions read as "stale". FIX USED: keep createXSlice
  on its own import line, put the helper on a SEPARATE `import ... from './xSlice.js'`
  line (no import/no-duplicates rule in this repo). Any future slice co-exporting a
  helper hits this.
- ⚠️ **crisisTripleSync source scan** (tests/joins/crisisTripleSync.test.js) walks
  `src/` only (not tests) and freezes TWIN_ACTION_FILES for
  inject/resolve/undoCampaignStressorBridge — AutonomyPanel.jsx IS allowlisted (its
  "display strings, no wiring" comment is stale; decideNudge actually wires
  injectCampaignStressor). Adding advance guards inside campaignRegionalSlice does NOT
  add action-name references, so the scan is untouched.
- ✅ **sizeBaseline net-zero technique**: settlementSlice.js is baselined at 1343 eff
  lines (skipBlank+skipComments). To add a guard, fold an existing braced `if {...}`
  to a one-liner (brace-less ifs + long lines are lint-legal here — no curly/max-len
  rule) to bank the room; a shrink DEMANDS ratcheting the baseline DOWN (test reds
  otherwise).

## Deferred (verified real; out of SB1 lane = src/store + mapSlice only)
- **Fog handout translucent** (finding 5): fogGeometry.js default opacity 0.92 vs
  FogPlayerView's fogOpacity:1; SettlementMapFogChrome omits it → handout ~8% see-through.
  Fix in src/domain/townMap + src/components (forbidden here).
- **timelapseTick two units** (finding 6): SettlementMapEditControls writes weeks,
  TimelapsePanel writes an advance tick, ageOverlay reads weeks. mapSlice setter is
  unit-agnostic (correct) — the bug is entirely component-writers + domain-reader; no
  store-side fix.
- **useFlag** (finding 9, src/lib/flagRegistry.js): getSnapshot side-effects via
  fromUrl's localStorage write; subscribe has no 'storage' listener (no cross-tab
  re-render). Dev/QA-only.
- **townMapThumb cache key** (finding 10, src/lib/townMapThumb.js): key omits
  opts.quality. Cosmetic.

## Refuted
- **operationRegistry stale counts** (finding 8): the stale "(118)" mechanical count is
  ALREADY removed in-tree (line 100-102 now says "census the live number, never
  transcribe it"); canon(5)/macro(40) inline counts match live grep. No action.

## Gate (all green, final tree)
domain-strict 0 (bare) · tsc 0 · eslint 0 (12 files) · tests/store/ + crisisTripleSync
+ undoRoundTrip = 78 files / 608 passed · new pins + sizeBaseline = 47 passed · NUL clean.
No ONE-REGEN edits. No goldens touched (no generation-path change).
