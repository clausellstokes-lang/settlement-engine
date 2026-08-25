---
name: ""
metadata: 
  node_type: memory
  created: 2026-07-15
  type: milestone
  tags: 
    - settlement-politics
    - w-doctrine-4
    - coalitions
    - engine-wave
    - dormancy
    - any-cast
  originSessionId: 049d4c82-58c0-4be1-956a-d47c628ee704
---

# W-DOCTRINE-4 — SETTLEMENT POLITICS (the final engine wave)

Built 2026-07-15 on review-fixes-2026-07-08 @ 9e63d801 (UNSTAGED — manager stages). THE FINAL
ENGINE WAVE: the peace engine's coalition machinery played SCALE-FREE inside one settlement at
faction grain (DESIGN_SETTLEMENT_POLITICS.md).

## What / where
- NEW lazy engine leaf: `src/domain/worldPulse/settlementPolitics.js`. Imported ONLY by the lazy
  pulseKernel + corruptionWeb + settlementStrategy ⇒ ZERO first-paint bytes.
- Ledger: top-level conditional `worldState.politicsLedgers` (cid → { blocs:[{id,members,glue,
  end,strain,sinceTick,covert?,leaderNpcIds}] }, HARD CAP 3). Appended to `CONDITIONAL_LEDGER_KEYS`
  in worldState.js (the narrativeTempo precedent — mutable, self-pruning, drop-when-empty).
  `leaderNpcIds` is an internal succession-tracking field (needed to detect a leader seat change).
- Gate: `settlementPoliticsActive` = virtual `settlementPoliticsEnabled===true` (NOT in
  DEFAULT_SIMULATION_RULES) AND `factionCompetitionEnabled===true`. Absent ⇒ mover no-op ⇒
  byte-identical (dormancy golden: tests/property/settlementPoliticsDormancyGolden.test.js +
  manifest tests/fixtures/settlement-politics-dormancy-golden.json).
- Mover `advanceSettlementPolitics` wired in pulseKernel AFTER the corruption-web block (reads
  fresh compromise leashes; corruption reads PRIOR-tick politics for its divided-court cross-read).
- §3 decision-loading: `blocDecisionFactor` wired into settlementStrategy `enumerateMoves` (a
  bounded ±0.3 multiplier over move scores, the warReasonFactor idiom). §3 cross-read:
  `coalitionConsolidation01` wired into corruptionWeb `recruitmentWeight` (a 4th degrade term,
  the officialPay01 precedent) — a consolidated court raises the patron's price.
- Substrate reused: cohesionWeave §B `faithAlignmentQuadrant`/`rulingPowerFromArchetype` (who CAN
  + fragmentation-propensity), `settlement.relationships[]` type field for §G leader ties (warm=
  family/mentor/ally/…, hostile=rival/enemy; bitter/mortal = hard block), factionStates seats +
  npcStates rivalryTargets, peace `term.burden01` seam → strain → `factionRevanchism01`.

## Pins (tests/domain/settlementPoliticsPins.test.js — 18 pins, all battery items)
Dormancy; formation; the LEADER-RIVALRY BLOCK + negative control; glue-typology twin
(succession dissolves patronage not concession); compromise covert + exposure shatter;
outbidding flips a concession member; differential-strain→revanchism; conspiracies (autarchy
breeds covert blocs) + covert→revealed discovery; ruling-bloc load clamped+directional; the
divided-court→corruption-cheap cross-pin.

## HAZARDS / gotchas learned
- ⚠️ ANY-CAST RATCHET (tests/lint/domainAnyCastBaseline.test.js): a NEW domain file must have
  ZERO any-holes (baseline 0). It counts `@type {any}`, `Record<string,any>`, `<any>` etc. — NOT
  prose "any". Use `Record<string,unknown>` + `asObject()` + specific union casts. Bit me once
  (10 casts) — the full `npm run check` catches it at the `test` step, so run domain-strict AND
  the any-cast test before declaring done.
- ⚠️ SYMMETRIC-KEY TABLE BUG: a pair-keyed lookup `x<y?`${x}|${y}`:`${y}|${x}`` needs the TABLE
  keys ALPHABETICAL too, or mis-ordered keys silently never match (default fires instead). Caught
  by a formation pin — STRUCTURAL_AFFINITY had several non-alphabetical keys.
- Writing `isGoverning` onto the roster is owner-gated (persistence-shape) — so ruling-bloc
  "governing derives from bloc arithmetic" is a pure DERIVED read (`rulingBlocOf`), consumed at
  the §3 decision seam, NOT a roster write. The ~30 isGoverning display consumers keep the
  no-ledger fallback (rewiring them wholesale is a separate owner-gated concern — deferred).

## Deferred (documented, not bugs)
- §6 legibility (Power-tab coalition map + chronicle narration): DISPLAY wave. Mover emits typed
  receipts (formed/realigned/fractured/exposed/deferred) + reads are the seam; pulseKernel
  currently discards the receipts (no wizardNews wire yet — that's the display follow-up).
- secondaryAffiliation bridge/leak (§4 prose, not a battery pin).
- Glue is classified at formation and not re-classified each tick (hysteresis; a bloc that
  becomes corrupt LATER keeps its formation glue).
