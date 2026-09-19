---
name: generosity-engine-wired
description: "E1a-WIRE SHIPPED (unstaged, review-fixes-2026-07-08@2e744fef): the generosity mover advanceGenerosity is live-dormant + its dormancy golden; grain relief flows lit. E1b deferred. Facet Law compliant."
metadata:
  node_type: memory
  type: project
  originSessionId: 049d4c82-58c0-4be1-956a-d47c628ee704
---

**E1a-WIRE** (the generosity engine goes live-dormant) is BUILT + gate-verified, ALL WORK
UNSTAGED on **review-fixes-2026-07-08** (base @ 2e744fef; nothing committed/staged/pushed per
brief). Design authority: docs/DESIGN_GENEROSITY_ENGINE.md. Companion: docs/DESIGN_COHESION_WEAVE.md.

## What shipped
- **The mover/adapter**: `src/domain/worldPulse/generosityKernel.js` (new) — `advanceGenerosity`,
  mirroring pestilenceKernel/calamityKernel. Enumerates qualifying (giver,receiver) pairs from
  regionalGraph edges (allied/trade_partner/vassal/patron/client) + live obligations, gates on
  receiver food-NEED, rarity-gates via shouldInitiateAsk (loaded dice §H), builds ~10 live adapter
  reads, calls the pure `generosityEV`, and APPLIES: conserved grain transfer + obligation mint +
  widow's-mite gratitude/refusal incidents + buffer-discipline + succor/refusal news.
- **Wired** into pulseKernel.js as the FINAL constructive-flow mover (after M11b calamity, threads
  settlementUpdates like calamity). Gate = the virtual `constructiveFlowsActive` (simulationRules.
  constructiveFlowsEnabled === true); ABSENT ⇒ immediate no-op (zero forks/keys) — DORMANT.
- **Three self-owned drop-when-empty sub-ledgers** under spatialLedgers: `obligations`
  (foldObligations — THE "aid changes history" artifact §7), `generosityWillingness` (hysteresis
  latch), `bufferDiscipline` (moral hazard). relationshipMemory relief incidents append to
  worldState.relationshipStates[key].recentIncidents (edge-backed pairs only — obligation-only
  pairs would be dropped by the graph rebuild; their debt still records on the self-owned ledger).
- **Grain stock moves** as a CONSERVATION-EXACT food-months transfer (`computeSackFoodTransfer`
  fed the giver's ABOVE-FLOOR headroom so the hard reserve floor is never crossed → foodStockpile
  deltas onto settlementUpdates), NOT a traveling commodityFlow shipment.

## The dormancy proof (the centerpiece)
- `tests/property/generosityDormancyGolden.test.js` + `tests/fixtures/generosity-dormancy-golden.json`.
  Captured PRE-WIRE (mover file existed but unimported ⇒ pristine hash), then held byte-identical
  AFTER wiring ⇒ wired-but-dormant == pre-wire, proven. PLUS all 20 existing golden/dormancy suites
  (107 tests: deity/spatial/seasons goldens, aspatial dormancy oracles) stayed green under the wiring.
- The SAME file also holds the lit-path ANTI-VACUITY (design §7 "aid changes history", soak seed):
  gate ON in a famine fixture ⇒ obligation minted (Briarwatch owes Ashford), grain drew down
  conserved, succor receipt emitted, relief incident banked, bounded over 12 ticks.

## ⚠️ Key correction the recon surfaced (load-bearing for E1b)
The design line "grain relief rides supplyShipments kind:'relief'" is ASPIRATIONAL — the LIVE
`supplyShipments` spatial ledger is the M6a commodityFlow shape (link-keyed
`settlementId:institutionId:input`, quantity in food-WEEKS, carried/smuggle fields), NOT a free
peer-to-peer relief channel. A traveling-relief-shipment integration is a much larger surface
(producers/EV/appetite). E1a used the conserved instant food transfer instead — the traveling
version is a documented deferral.

## THE FACET LAW compliance (mid-wave owner-ratified addendum @ f5e0dbd8, weave §I)
Added the `facetOf(entity, facetKind)` CHOKEPOINT (declared ?? inferred ?? kind-default) to the
pure leaf `src/domain/spatial/cohesionWeave.js` (+ `hasCharityFacet`). The mover's ONE name-grep
(charity-roster) now routes through it — a custom sanctuary declaring nature:faith is
charity-eligible by facet, not English. Absent declaration ⇒ byte-identical keyword inference
(dormancy unbroken; the golden is gate-off so facetOf is never reached there). Contract pinned in
tests/domain/cohesionWeave.test.js. The coverage WALKER + mint-time UX land with W-COMPOSER-1.

## DEFERRED to E1b (documented, NOT lost — the clean handoff boundary)
The brief's "exceeds one session" clause: E1a-WIRE completed first as an inseparable unit.
E1b remains: (1) flip purchase/credit/trade_overture/refuge from live:false + their term-sets +
reactions (credit maturity/appetite; refuge reuses M4 conservation); (2) the §9 WRITE couplings
the core parked — legitimacy→coup lane, rumor broadcast of notable acts (typed payloads), the
newsVoice 'succor' category, the smuggle-premium pin; (3) the COUNTERPART verbs FORCE_RELIEF/
OFFER_CREDIT through the EXISTING event registry (composer manifest infra is NOT on this branch —
it lives on the w-composer-1 worktree; leave a manifest-entry TODO) — verbs targeting custom
institutions/goods MUST resolve via facetOf. Minor lit-path housekeeping: stale
generosityWillingness latches persist for pairs that stop being evaluated (harmless, bounded).
