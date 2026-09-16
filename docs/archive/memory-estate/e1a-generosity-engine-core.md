---
name: ""
metadata: 
  node_type: memory
  title: "E1a generosity engine core landed (dormant, unwired)"
  date: 2026-07-14
  branch: review-fixes-2026-07-08
  tags: 
    - e-family
    - generosity
    - cohesion-weave
    - dormant
    - spatial-leaf
  status: built-not-wired
  originSessionId: 049d4c82-58c0-4be1-956a-d47c628ee704
---

# E1a — THE GENEROSITY ENGINE CORE (built dormant, unwired)

Built 2026-07-14 off review-fixes-2026-07-08 @ ac7ba4ba. The first E-family expansion wave
(docs/DESIGN_GENEROSITY_ENGINE.md §2+§3, DESIGN_COHESION_WEAVE.md §B/§C/§G/§H,
DESIGN_INFORMATION_STATECRAFT.md §2.4). ALL WORK UNSTAGED, not committed/pushed.

## What shipped (three new pure spatial leaves + 3 test suites, 63 new tests)
- `src/domain/spatial/generosityEV.js` — THE KERNEL (mirror of dispatchEV.js): the §0.1 gate
  (qualifiesForGenerosity), GIVE terms (bond/history/conscience/strategy/faith), WITHHOLD terms
  (own-margin/commitment/route/domestic/dependency), the 4 tiers (GIVE_FULL/PARTIAL/AS_CREDIT/
  REFUSE) with a dispatchDecision-style hysteresis latch, house-voice receipts, triageAllocation
  (§2.2 scenario 4), the §H loaded-dice primitives (generosityForkKey/loadedDraw/shouldInitiateAsk),
  the §4 instrument catalog (grain_relief + warning LIVE; purchase/credit/refuge registered-deferred),
  warningSacrifice (statecraft §2.4), constructiveFlowsActive (the dormancy gate).
- `src/domain/spatial/generosityReactions.js` — THE REACTION LEDGER (§3): widow's-mite gratitude,
  the OBLIGATIONS sub-ledger (foldObligations — nests under spatialLedgers, drop-when-empty ⇒
  byte-identical-dormant, mirror of foldNarrativeTempo), fog-forgiveness (§3.3), refusal damage,
  typed incidents (relief_given/received/refused/credit_repaid/defaulted/refuge_granted for
  relationshipMemory), the §G named-tie CLAMP, buffer-discipline decay/recovery (scenario 10).
- `src/domain/spatial/cohesionWeave.js` — §B faith×alignment quadrants (brothers/schism_axis/
  respectable_rival/natural_enemy + cross-pressure mediator) + §C structural lens table
  (economic base × ruling power → generosity coalition weights). Zero-import leaf.

## Constitutional posture — DORMANT BY CONSTRUCTION
Pure lazy leaves imported by NOTHING eager and NOTHING in the live tick yet ⇒ goldens cannot move,
first-paint +0, any-cast 0 (new files at zero debt). Full `npm run check` GREEN (9005 vitest +
build + verify:dist; domain-strict 0; the whole tree passed). Dormancy is proven at the ledger
level (obligations fold → null → dropSpatialLedger → byte-identical); the FULL-advance dormancy
golden lands with the wiring wave.

## KEY JUDGMENTS (vetoable)
1. Scope: delivered the pure ENGINE CORE (design §8 step 1 = "the kernel"); the live-tick wiring
   (advanceGenerosity assembling all live reads on the golden-critical pulseKernel hot path) is the
   clean STOP boundary — deferred as E1a-wire.
2. NO drama-class registration: generosity relief is REACTIVE (responds to an existing famine/war
   arc) ⇒ consequence-adjacent under the pacing law ⇒ never throttled ⇒ registers no producer.
   decisionTier.js UNTOUCHED; DRAMA_CLASS_PRIORITY stays pinned at 7 (the contract walker requires it).
3. Gate = a VIRTUAL defensive reader (constructiveFlowsActive: simulationRules.constructiveFlowsEnabled
   === true), NO serialized default added to DEFAULT_SIMULATION_RULES ⇒ goldens don't move (mirrors
   E0's narrativeTempoOf). Owner lights presets in a later signed event.

## HAZARD dodged (reusable)
- Adding an opt-in flag to DEFAULT_SIMULATION_RULES SERIALIZES it (warLayerEnabled etc. are all
  serialized `false`) and WOULD move goldens. E-family dormancy requires the E0 pattern: a virtual,
  defensively-read gate, no serialized default.
- Two structural ratchets bit new spatial leaves: (a) clampPrimitiveBaseline forbids NEW local
  clamp/clamp01 defs — import from src/kernel/math.js instead (byte-neutral when inputs are
  finiteNumber-guarded); (b) relationshipCompatibility B4-consumer guard greps the BARE STRING
  anywhere (incl. JSDoc) — don't name that module in comments.

## Handoff — E1a-wire (next)
Wire advanceGenerosity into the pulse tick (supplyKernel precedent), assembling live reads (bond
edges, relationshipMemory typed incidents, war-graph strategic reads, seasonal margin, deployments,
legitimacy nerve) behind constructiveFlowsActive; add the full-advance dormancy golden + the 30y
anti-vacuity soak. Then E1b (credit maturity + purchase + appetite), E1c (refuge + siege/plague +
fog-forgiveness wiring). Coherence-matrix WRITE couplings are all deferred until wiring (E1a ships
READ-shape terms only) — the §9 matrix-walker note.
