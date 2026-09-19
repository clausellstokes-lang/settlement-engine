---
name: spatial-consequence-door1-built
description: "DOOR 1 THE SPATIAL CONSEQUENCE LAYER built @ 3fee34ee on claude/spatial-consequence (base 66eda8e8, NOT folded): substrate at canonize (lib body, projection law), 3 consumers behind virtual spatialConsequenceEnabled, committed dormancy golden; ⚠️ +652 B eager (store canonize hook) needs manager sign-off; ⚠️ domain-strict has 112 PRE-EXISTING townMap errors from the #38 fold"
metadata: 
  node_type: memory
  type: project
  originSessionId: 4e5bd424-21ab-4307-ba41-bd048bb9061e
---

# DOOR 1 — THE SPATIAL CONSEQUENCE LAYER built @ 3fee34ee (2026-07-17)

One commit on `claude/spatial-consequence` off `66eda8e8` (the double-folded w7-prep tip).
NOT folded, NOT pushed — the manager folds. Flag `spatialConsequenceEnabled` is VIRTUAL +
DARK (absent from DEFAULT_SIMULATION_RULES); pre-signed to light at THE ONE REGEN.

## Architecture (the projection-law shape — load-bearing for door 2/3 and SM lanes)
- The engine NEVER imports townMap. Substrate derivation lives in
  `src/lib/spatialSubstrateDerive.js` (buildTownMapModel → domain geometry), loaded via a
  FLAG-GATED dynamic import at the canonize seam (campaignWorldPulseSlice.canonizeCampaignWorld).
  Domain geometry: `src/domain/spatial/spatialSubstrate.js` (model in, substrate out).
  Pure reader consumed by kernels: `src/domain/spatial/spatialSubstrateRead.js`.
- Sidecar `spatialLedgers.spatialSubstrate[sid]` = { v, sig, lyr, d[{id,cat,cx,cy,flam,den}],
  adj, w[{i,x1..y2,str,did}], g[{x,y,seg}] }. sig = structural signature (reuse check).
- Consumers: (a) calamity WHERE beat + (c) covert-diffusion beat ride the fabric seam via
  the `advanceNpcGrowthWithFabricAndConsequence` name swap (pulseKernel NET-ZERO lines);
  (b) siege breach stamped into the siege_lifted CAUSE by deploymentReturn (worldState
  threaded), lifted into the fabric siege_repairs scar (+seg/did, additive) + mirror.

## Hazards learned (bit this lane)
- ⚠️ `src/domain/spatial` is TIER-BLIND-SCANNED (spatialDigest.invariants bans \btier\b in
  CODE) — even settlement SIZE-tier reads red it. Identity-field reads belong in the lib body.
- ⚠️ domainAnyCastBaseline: ANY `any` in JSDoc of touched src/domain files reds the exact-set
  baseline. New impactKinds must register in WHAT_PHRASES (settlementRumors.js) +
  EXPECTED_VOICE (tests/domain/impactKindWalkers.test.js).
- ⚠️ The pulse processes tick = input.tick + 1; freshness cursors (stamp.tick === now) must
  account for it in fixtures.
- ⚠️ 112 domain-strict errors in src/domain/townMap are PRE-EXISTING at 66eda8e8 (the #38
  fold never baselined them) — CONFIRMED red at pristine base; NOT this lane's debt.
- ⚠️ Backgrounded full-suite runs under contention flaked 2 timing/statistical tests
  (advancePauseResume re-entrancy, joins/ordering walled-siege 120-seed); both green foreground.

## Open item for the manager (stop-and-report)
- Measured eager delta +652 B (same-method probe: base 1,034,056 → 1,034,708; budget
  1,040,000 still green, 5,292 B margin). Source: the flag-gated canonize hook in the EAGER
  campaignWorldPulseSlice (engine-side additions are 0 eager). Above the ~300 B line ⇒
  needs manager sign-off at fold or a slimmer hook (move the gate itself behind a helper).
