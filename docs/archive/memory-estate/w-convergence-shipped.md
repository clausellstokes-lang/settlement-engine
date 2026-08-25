---
name: ""
metadata: 
  node_type: memory
  title: W-CONVERGENCE shipped (intervention + multi-sided law + reactive art of war + mercenary clause)
  date: 2026-07-15
  tags: 
    - convergence
    - intervention
    - war-layer
    - coup
    - phase55
    - shipped
  originSessionId: 049d4c82-58c0-4be1-956a-d47c628ee704
---

# W-CONVERGENCE — foreign intervention in internal contests (SHIPPED, unpushed)

Built by an Opus implementer under Fable coordination, 2026-07-15. Four commits on branch
`claude/w-convergence` off `1b3d5ecd` (review-fixes-2026-07-08 lineage), NOT pushed/merged:
9a45c6d0 (Stage 1), a0a92d22 (Stage 2), f241a17f (Stage 3), 8cf97033 (Stage 4 + mercenary clause).
Binding spec: docs/DESIGN_CONVERGENCE.md.

## What it is
A foreign power with a typed MOTIVE + feasibility commits a column (E0 loaded dice,
p = INITIATE_BASE × pull²) to a LIVE coup_detat contest and TILTS the verdict — giving the
coup's already-stamped hostile-neighbor `sponsorSettlementId` physics. NEW lazy leaf
`src/domain/worldPulse/convergence.js` (imported only by pulseKernel + coup.js + warReasons +
peaceReasons — all lazy; ZERO eager first-paint bytes, proven by verify:dist).

## Load-bearing architecture JUDGMENTS (vetoable)
- **Isolated ledger**: intervention state lives in a DEDICATED `interventions` spatial ledger,
  NOT the shared `deployments` one-army slot. Guarantees byte-identity-when-dark by construction
  and sidesteps warDeployment's siege machinery. The one-army law is enforced at DERIVATION (a
  power holding a live deployment is ineligible to intervene). The 6 `role:'siege'` readers are
  provably unaffected. Consequence: the INTERCEPT spatial hostilePair extension (armyTransitKernel
  L90-101, byte-identical optional `contestSideOf` param) is present but INERT — intervention
  columns aren't transit records, so nothing to intercept spatially in wave 1; the
  intervener-vs-intervener case resolves aspatially via resolveFieldBattle in Stage 2.
- **Autonomous mover writes directly under legacy `auto`; DEFERS (visible, no mint) under DM-driven
  autonomy** (authorityFor 'intervention_ordered'). The full proposal-queue re-mint + pendingActorMajorFor
  live wiring is DEFERRED to W-COMPOSER-2 (the supplyWebWarfare forceable-verb precedent).
- **Gate**: virtual `interventionEnabled` AND `warLayerEnabled` (no DEFAULT_SIMULATION_RULES entry).
  War-gated not belief-gated (armies march regardless of the info layer).

## Seams touched (all byte-identical when dark)
- resolveCoupVerdict gains `interventionAdj` (the warSentimentAdj precedent); coup.js reads
  interventionAdjFor; pulseKernel threads worldState.
- Authority: intervention_ordered → ACTOR_INITIATED_MAJOR_TYPES + CAMPAIGN_ALTERING_CANDIDATE_TYPES +
  a NEW `auto-with-approval-routing` CHANGE_AUTHORITY_POLICY entry (contract-tested).
- Reasons: `foreign_clash` ↔ `spheres_understanding` added to WAR/PEACE catalogs + REASON_MIRRORS +
  scorers wired into advanceWarReasons/advancePeaceReasons (score 0 when dark ⇒ foldPairReasons
  filters ⇒ byte-identical; the peaceCausal dormancy golden proves it, count literals 7→8 bumped).
- Terms: `non_intervention` in a NEW `sovereignty` family + its TREATY_COMPLIANCE_VOICE row
  (executor:'seam', no asset producer ⇒ never drafted ⇒ byte-identical).

## THE MERCENARY CLAUSE (owner ruling, §4)
Reinforcement MODIFIER ONLY — never an actor/entity/contract machinery. A mercenary institution in
the DEPLOYING settlement reinforces the column: bounded (MERC_REINFORCE_CAP), prosperity-scaled,
0-when-absent (byte-identical). Detection = declared `mercenary` facet (facetOf chokepoint,
`institutionFunction`) OR MERCENARY_MARKET_PATTERN. Applied at the intervention-commit strength seam.

## Deferrals (documented, not gaps)
- Full proposal-queue re-mint under DM-driven autonomy → W-COMPOSER-2.
- Verbs ORDER_INTERVENTION / REINFORCE / INTERCEPT ship registrable-shape, NOT manifest-registered
  → W-COMPOSER-2.
- Live occupation.js integration of overstayOccupation (pure helper + pin present); live spatial
  INTERCEPT wiring (contestSideOf into advanceArmyTransit) — both consequences of the isolated ledger.
- Rebellion-verdict + occupation-uprising tilts are typed seams (design §2).
- Deep balance/soak TUNING is the NEXT AI's job (the handoff plan).

## Guard hazards for the next builder
- New worldPulse leaves must be ZERO any-debt (domainAnyCastBaseline; every sibling kernel is 0 —
  convergence was burned 15→0 with local Snapshot/SnapItem/WorldStateLike/Rng/Graph typedefs).
- A new outcome-source file carrying `candidateType:` + a `condition:`/`stressor:` string trips
  metronomeCooldownLint — add to NONCOMPLIANT_BASELINE with a rationale if genuinely one-shot
  (convergence is, like coup/occupation/warDeployment).

## Gate at ship
Full `npm run test` = 844 files, 9452 passed, 1 skipped, 0 failed. tsc full + domain-strict (0) +
eslint (0 errors) green. build + verify:dist 113 tests, ZERO eager delta (eager engine chunk hash
unchanged). Intervention dormancy golden (tests/property/interventionDormancyGolden.test.js) captured
PRE-WIRE, reproduces byte-identically post-wire (3 seeds) + lit anti-vacuity commits a column.
