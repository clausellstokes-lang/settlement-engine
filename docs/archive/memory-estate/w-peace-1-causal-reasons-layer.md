---
name: ""
metadata: 
  node_type: memory
  created: 2026-07-14
  kind: milestone + architecture
  commit: "76121d09 (branch claude/w-peace-1, parent ebb2aa9d = review-fixes-2026-07-08 tip)"
  originSessionId: 049d4c82-58c0-4be1-956a-d47c628ee704
---

# W-PEACE-1 — the causal reasons layer (design §14 wave 1) SHIPPED

**What**: typed, receipted REASONS FOR WAR (7: grievance, revanchism, resource_pressure,
treaty_default*, encirclement, legitimacy_hunger, corruption_exposed*; *=registration seams,
dark until treaties ledger / W-DOCTRINE feed) + REASONS FOR PEACE (7: exhaustion,
belief_convergence=BLAINEY, economic_strangulation, coalition_fracture, mediation,
harvest_pressure, realignment), accumulating per directed pair in
spatialLedgers.warReasons / peaceReasons. New movers src/domain/worldPulse/warReasons.js +
peaceReasons.js (deterministic, no rng), append-only pulseKernel slots after generosity.
Consumption: bounded ×[1,1.30]/[1,1.35] factors at settlementStrategy deploy/sue_for_peace
weights + warDeployment conquest-margin; war records carry casusReasons (top-3, survives
attrition via ...spread); receipts name the typed reasons. Irony read-model:
peaceReasons.warCausalBrief → "N of 7 peace reasons now present; this war is dying".

## Why / how to apply
- **GATE**: `peaceCausalActive` = warLayerEnabled===true && peaceEngineEnabled===true
  (peaceEngineEnabled is a VIRTUAL flag, no DEFAULT_SIMULATION_RULES entry — chosen over
  riding warLayerEnabled alone because beliefMapGolden/worldpulseSpatialGolden hash
  lit-war state and would have drifted). Soak/tuning sessions light it with
  `peaceEngineEnabled: true` in simulationRules.
- **Dormancy proof**: tests/property/peaceCausalDormancyGolden.test.js — manifest captured
  against the PRE-WIRE engine via the FENCE DANCE: `git diff > patch` → `git checkout --
  pulseKernel.js` (own uncommitted edit, NOT stash — stash is forbidden) → UPDATE_GOLDEN
  capture → `git apply patch`. Reusable technique for capture-before-wiring goldens when
  the wiring already exists uncommitted.
- **⚠️ Verb park honored**: DECLARE_CASUS/SUE_FOR_PEACE ship as pure gated functions
  (declareCasus in warReasons.js, sueForPeaceOrder in peaceReasons.js) with typed veto
  codes + CASUS_VETO_PROSE/PEACE_VETO_PROSE + preview≡apply — NOT as affordance-manifest
  entries. PROOF the literal registration can't work: runEventPipeline(settlement, event)
  has NO worldState channel, and affordanceCoverage.walker.test.js's scope note parks
  realm verbs for W-COMPOSER-2 ("documented deferral, not a gap"). W-COMPOSER-2 must wrap
  these exact functions per the same-function law; its walker counts (38/29/9) are UNTOUCHED.
- Wave-1 mirror table (REASON_MIRRORS, walker-enforced total+bijective) has 2 PROVISIONAL
  pairs (grievance↔mediation, revanchism↔harvest_pressure) — re-pair when
  satisfaction/war-guilt land in a later peace wave.
- Receipts: gate green 2026-07-14 — full vitest 9,133 passed/821 files, tsc full+strict 0,
  eslint clean, build ok, VERIFY_DIST 110/110, first-paint closure 1,213,818 ≤ 1,214,050
  (zero eager bytes — modules are engine-lazy), zero any-debt in new files.
