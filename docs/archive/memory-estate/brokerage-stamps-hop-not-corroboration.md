---
name: ""
metadata: 
  node_type: memory
  created: 2026-08-01
  tags: 
    - information-brokerages
    - rumor-network
    - belief-map
    - measurement
    - design-divergence
    - W-I-I2
  status: "BUILT + gate-green, UNCOMMITTED (worktree minifold, branch claude/composite-r4)"
  originSessionId: c69772bd-e324-4e1d-b1ee-b7482c7741fc
  modified: 2026-08-01T10:57:10.963Z
---

# Brokerage reliability stamps: hop count predicts truth, corroboration does NOT

## The fact

Measured 2026-08-01 over **18,377 rumour arrival records** produced by the REAL advance
(`advanceRumorLedgers`, two witness topologies, 30 seeds, 40 ticks each). Each record's
content was compared against the origin telling captured from an undegraded
(`perfect_delayed`) run of the same feed. Two truth predicates: CORE (what/where/scope/
magnitude) and STRICT (core plus the involved-party list).

```
hop 0   n= 2520   core 1.000   strict 1.000
hop 1   n= 5036   core 0.765   strict 0.678
hop 2   n= 5037   core 0.635   strict 0.502
hop 3   n= 3506   core 0.534   strict 0.379
hop 4   n= 2278   core 0.465   strict 0.288

roots 1  n=16019  core 0.679   strict 0.568
roots 2  n= 2028  core 0.690   strict 0.571
roots 3  n=  330  core 0.676   strict 0.570
```

**Relay hops predict content intactness strongly and monotonically. Independent
corroboration roots predict it not at all** (flat to within noise, and non-monotone inside
a fixed hop depth).

## Why

`rumorNetwork.mergeArrival` resolves a second telling of one event through
`pickBetterTelling`, which orders by completeness, then accuracy, then hops. **It does not
take a vote.** Corroboration therefore records that several roads carried the story; it
never repairs what the roads did to it. Completeness is only weakly tied to whether the
structured content mutated, so selecting on it barely improves intactness.

## How to apply

- Any feature that grades information reliability must derive the grade from HOP DEPTH,
  never from `corroborationRoots.length`. A corroboration-weighted grade is miscalibrated
  by construction and the calibration-honesty envelope
  (`tests/domain/brokerageCalibration.test.js`) will red on it.
- This forced a documented divergence from `docs/DESIGN_INFORMATION_BROKERAGES.md` §5,
  whose example phrasing ("confirmed by three roads") assumes corroboration lifts a grade.
  W-I I2 ships corroboration in the PROSE only ("It came in again on another road"), which
  is true, while the grade comes from the road count behind the telling.
- **RECORDED SEAM (owner-gated, an engine change):** give `mergeArrival` a consensus rule
  over independent roots and corroboration becomes predictive. That changes the rumour
  merge for every consumer, so it was deliberately left out of I2.
- NEVER grade from the arrival record's own `accuracy01` / `completeness01`. Those are the
  derived summary of the very mutations that make a telling false, so grading by them and
  scoring against them proves list == list (the self-referential pin class).

## The shape that came out of it (W-I I2)

- `src/domain/worldPulse/brokerageStamps.js` — the closed ladder
  `confirmed | corroborated | reported | tavern_talk`, hop-derived, with declared truth
  bands 0.90 / 0.60 / 0.40 / 0.15 authored UNDER the measured strict rates.
- **Competence only ever QUIETENS.** Below `CHANNEL_VOUCH_FLOOR` (0.30) a house declines
  the channel and emits no stamp; below `SHARP_VOUCH_FLOOR` (0.70) it may not award the top
  rung. A design where competence LIFTED a rung would break the envelope by construction,
  because capping can only raise a rung's observed truth rate while lifting can only lower
  it. Consequence worth knowing: `confirmed` is reachable only by a GUILD form in a channel
  it masters (legal major trade/politics, illegal major crime/persons).
- Monotonicity is pinned WITHIN a house, not pooled: capping compresses across houses of
  different competence, so a pooled monotonicity claim would be false.

## Related

- `src/domain/worldPulse/brokerageFidelity.js` — the belief-derivation fidelity term.
- The pulse kernel is at its FROZEN size ceiling (1380 effective, `scripts/.size-baseline.json`),
  so the fidelity composition was placed inside `advanceBeliefMaps` instead of at the
  kernel's `sightOf:` call site. That is a net-zero placement, not a preference.
