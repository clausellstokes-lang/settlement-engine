# 5.5-M Implementer Brief — distance + latency modulation (the map starts governing)

Opus 4.8 ultracode implementer, Phase 5.5 wave M, /Users/cstokes/Desktop/settlement-engine
(branch review-fixes-2026-07-08). You implement; the manager (Fable) reviews + commits. BINDING:
docs/PHASE55_SPATIAL_ENGINE_DESIGN.md §3 (the propagation layer) + PART II §II.5-1 (the cost→weeks
calibration, SETTLED) + PART III §III.2 (frozen-vs-live law). DEPENDS ON: the keystone committed
(you READ the frozen digest; verify its committed shape first — distanceMatrix, tiers, gates).

## THE SCOPE LAW
This wave makes EXISTING propagation distance-aware. It adds NO new movers, NO rumor payloads,
NO carriers, NO caravans (all later waves). Three seams only: trade channel weights, faith-spread
reach, and news/impact propagation latency. If a change wants a new ledger beyond the arrival-tick
delay described below, STOP-AND-REPORT — it belongs to step 3.5.

## THE CONSTITUTIONAL LAW
Gated on worldState.spatialCanonVersion + the digest's presence. ABSENT ⇒ the aspatial paths run
BYTE-IDENTICALLY (the existing regionalGraph code untouched on that branch — prefer a parallel
read wrapped in the gate over editing the aspatial expressions). Goldens byte-identical; a NEW
spatial-on golden fixture pins the modulated path.

## Items

1. **The distance read** — a small pure module (src/domain/spatial/distanceRead.js) exposing
   `hopWeeks(digest, fromId, toId)` (the II.5-1 calibration: median primary hop ≈ 1-2 weeks,
   secondary 2-3, tertiary 4+, map diameter ≈ one season — derive the weeks-per-cost-unit
   constant from the digest's distance distribution at first read, deterministically, and RECORD
   it in the digest receipts) and `distanceWeight(digest, fromId, toId)` (a 0..1 attenuation for
   channel-strength modulation, monotone in path cost, documented curve).

2. **Trade modulation** — where regional trade channel strength/salience is read (tradeSalience /
   supplyCompleteness channel inputs — verify the exact read seams), multiply by distanceWeight
   under the gate. Distant suppliers weaken; adjacent ones strengthen relatively. BOUNDED: the
   weight floor must not zero out an established channel (document the floor).

3. **Faith-spread modulation** — religiousContest's carrier-reach / regional-prevalence terms
   (verify seams in advanceReligionStates) gain the same distanceWeight under the gate. Distant
   co-adherents count less; conversion pressure localizes.

4. **Propagation latency (the §3 front, minimal form)** — regional impact propagation
   (region/propagation.js deriveRegionalImpacts / the wave-depth machinery) gains ARRIVAL DELAY:
   an impact reaching a settlement N hops / C cost away applies at tick + hopWeeks(...), not
   instantly. Implementation: a conditionally-materialized worldState arrival queue (the
   conditional-ledger discipline — object-keyed, CL-0's CONDITIONAL_LEDGER_KEYS pass makes the
   add one line) holding {impactRef, targetId, arrivalTick}; the kernel applies due arrivals at
   tick start. Seeded/deterministic (no rolls needed — latency is arithmetic); codepoint-sorted
   application order. wizardNews entries for delayed impacts carry their ACTUAL arrival tick (the
   news is dated when it ARRIVES — the round-8 groundwork, payload-free).

5. **Legibility** — the dossier/realm read-models surface distance where it now matters: a trade
   tie's read gains "distant supplier (≈N weeks)" phrasing where the weight materially attenuates
   (reuse the existing band idioms; lazy surfaces only).

## Gates
Full battery; goldens byte-identical (dormant path constitutional); the spatial-on golden fixture
deterministic across two runs; latency arithmetic property tests (hopWeeks monotone in cost,
anchor calibration holds, arrival application order stable); verify:dist — the spatial modules
stay OUT of first paint (loaded with the pulse path; confirm the import graph; headroom is
CRITICAL — check the current budget headroom before starting and STOP-AND-REPORT if your change
moves the entry closure at all). Report: seams modified, the calibration constant derived + how,
the weight curve + floor, arrival-queue shape, every gate with the closure byte number.
