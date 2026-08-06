---
name: ""
metadata: 
  node_type: memory
  title: W-DOCTRINE-2 information statecraft — load-bearing pair landed
  date: 2026-07-15
  tags: 
    - w-doctrine-2
    - information-statecraft
    - credibility
    - lie
    - spatial-engine
    - deferrals
  status: partial (credibility+LIE gate-green; SEE/HIDE/SHARE seam-noted)
  originSessionId: 049d4c82-58c0-4be1-956a-d47c628ee704
---

# W-DOCTRINE-2 — INFORMATION STATECRAFT (load-bearing pair landed, gate-green)

Implemented the design DESIGN_INFORMATION_STATECRAFT.md load-bearing pair on branch
review-fixes-2026-07-08 (opened @ 12554bd3). ALL WORK UNSTAGED (never committed/pushed);
foreign stash@{0} untouched. FULL GATE GREEN (`npm run check` exit 0: 9313 tests, tsc,
strict ratchet 0, eslint, build, verify:dist first-paint budget intact — the new module is
lazy-only, landed in the `engine` chunk).

## Why (durable)
The design commissions four verbs (SEE/HIDE/LIE/SHARE) + a new CREDIBILITY stock. It is a
large feature; the wave brief gave an explicit scope-overflow order (credibility+LIE FIRST,
SEE/HIDE second, SHARE-sell third — clean boundaries). This pass delivered the FIRST priority
fully verified and seam-noted the rest.

## What landed (files, all unstaged)
- NEW `src/domain/worldPulse/informationStatecraft.js` — the module: `infoStatecraftActive`
  gate; the CREDIBILITY stock (`spatialLedgers.credibility`, centered-on-1.0 weight, slow-rise/
  sharp-fall asymmetry, generational half-life decay, `fractureCredibilityDeltas` consuming
  peaceTerms' recorded-not-enforced `fracture.credibilityHit`); the LIE lifecycle
  (`processLies`: seed a garrison bluff into believed-hostile neighbours → contradict → expose →
  blowback triple; `spatialLedgers.disinfo` ledger); the `advanceInformationStatecraft` mover.
  Has a "SEAM NOTES — SEE / HIDE / SHARE" block at the foot with the exact deferred seams.
- `beliefMap.js` — byte-safe `credibilityOf` injection threaded through
  aggregateReports→reconcileBelief→reconcileSlot→advanceBeliefMaps (source-credibility weights
  the corroboration math; `sourceId` added to BeliefReport, optional). No-op when absent.
- `peaceReasons.js` — the Blainey seam (lines ~354-357): subject-side believed strength
  credibility-discounted via injected `blaineyCredibility` closure (wars vs proven liars
  converge slower). No-op when absent.
- `pulseKernel.js` — mover wired AFTER advanceBeliefMaps (~L1713); `credibilityOf` into
  advanceBeliefMaps; `blaineyCredibility` into advancePeaceReasons.
- Pins `tests/domain/informationStatecraftPins.test.js` (18) + dormancy golden
  `tests/property/informationStatecraftDormancyGolden.test.js` (+ minted fixture).

## Judgment calls (vetoable — recorded in-code too)
1. GATE: dedicated virtual flag `infoStatecraftEnabled` (NO DEFAULT_SIMULATION_RULES entry —
   the supplyWebWarfare/constructiveFlows idiom) AND-ed with `beliefsActive`, NOT folded onto
   the war gate (SEE/HIDE/LIE work in peacetime). Keeps every belief/rumor/peace tripwire golden
   byte-identical (they never light the flag). CONFIRMED byte-identical (49 golden tests pass).
2. NO new E0 drama class for LIE — the dramaClassRegistry is pinned-at-7 (near-schema public
   surface). LIE initiation is rarity-gated via the loaded-dice idiom instead (design §6 frames
   the drama-classing as initiation TEMPO). Contract-pinned-at-7 test untouched. To add a
   'deception' class later: decisionTier.js DRAMA_CLASS_PRIORITY + the contract test toBe(7)→8.
3. LIE modelled as a GATED belief-injection (twin of the LIVE ally-intel deceit path), NOT a
   pre-rumor synthetic-feed seed — the mover runs AFTER advanceBeliefMaps so a rumor seed would
   need pre-rumor timing. The injection delivers seed/propagate/contradict/expose faithfully +
   keeps all rumor/belief goldens byte-identical.

## Deferred (documented, not a bug to re-find) — seams are mapped in the module's SEAM NOTES
- SEE (paid-eyes posture): `sightPostures` ledger + a `sightOf` decay/accuracy injection into
  reconcileSlot (same threading pattern as credibilityOf).
- HIDE (secrecy, symmetric isolation): `secrecyPostures` + two-directional belief-decay
  injection + a trade tax. The symmetric-isolation pin lives here.
- SHARE-sell (self-policing market): an `intel_sale` instrument extending generosityEV's live
  `warning` act; a bad sale feeds a `deception` CredibilityDelta against the seller (the stock
  built here ALREADY expresses the self-policing pin). DEMAND lane = peaceTerms disclosure
  executor:'seam' branch → credit the loser's credibility.

## Hazard/idiom worth remembering
- New engine code must import `clamp` (3-arg) from `src/kernel/math.js`, NOT redefine it — the
  `tests/lint/clampPrimitiveBaseline.test.js` ratchet fails a NEW local clamp (bit me once).
- A new spatialLedgers sub-ledger needs NO migration/schema-bump/registration (additive; absent
  ⇒ empty default). Persist via set/get/dropSpatialLedger, serialize-compare + drop-when-empty.
