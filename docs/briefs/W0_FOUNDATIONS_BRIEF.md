# 5.5-W0 Implementer Brief — Foundations: settlement alignment + temporal audit + evidence hardening

Opus 4.8 ultracode implementer, Phase 5.5 wave W0, /Users/cstokes/Desktop/settlement-engine
(branch review-fixes-2026-07-08). You implement; the manager (Fable) reviews + commits. BINDING:
docs/PHASE55_SPATIAL_ENGINE_DESIGN.md PART IV §IV.4 + PART VI §VI.1/VI.3 (alignment), §4i +
PART II §II.5-1 (temporal). TWO INDEPENDENT LANES — report each separately.

## LANE A — derived settlement alignment (unblocks FIVE mechanics)
The tree has NO settlement-level alignment (verified: every `alignment` is deity-axis or NPC).
Rounds 11/14/15 + culture + moral drift all need one. The ruling: DERIVE it, never author it.

1. Add `computeLawfulness(item, worldState)` + `computeMalice(item, worldState)` in
   src/domain/worldPulse/disposition.js as SIBLINGS of computeAggressiveness (:221) — same shape:
   pure, centered/normalized, tanh-squashed blend. Inputs (verify each against the live tree):
   TRAIT_ALIGNMENT (imported like TRAIT_AGGRESSION :42), the dominant deity's chaos01/evil01 axes
   (deityAxes.js — the fidelityNoise chaosPullOf precedent shows the read), governance (the
   factionArchetype of the governing entry — lawful-bureaucratic vs personalist vs lawless bands),
   publicLegitimacy, and RECENT ACTS where cheap (war_exhaustion/conquest feeds as malice inputs —
   only if already on the snapshot; do NOT plumb new state).
2. Add a pure read-model `settlementAlignment(item, worldState) → { lawfulness01, malice01,
   aggressiveness }` (a display/domain selector, NOT persisted state — recomputed per eval, the
   round-7 "culture is a LIVE read" law).
3. CONSUMERS: none wired this wave. This is substrate — fidelityNoise stays deity-driven for now
   (its widening is Wave A's). Zero behavior change anywhere ⇒ goldens untouched BY CONSTRUCTION.
4. Tests: property tests (bounded 0..1, deterministic, total on sparse/garbage settlements);
   directional fixtures (a lawful-bureaucratic high-legitimacy temple town reads high-lawfulness/
   low-malice; a warlord-run high-crime occupied town reads the opposite); neutrality (a settlement
   with NO deity/traits/governance signal reads 0.5/0.5 — the fidelityNoise neutrality discipline).

## LANE B — the temporal audit + evidence hardening (the absorbed entry gate)
The spatial engine denominates EVERYTHING in weeks on the 4-4-5 calendar; the keystone freezes
digests against it. Before that: prove the temporal foundation, and close the two evidence gaps
the empirical assessment found.

1. TEMPORAL AUDIT: sweep every time-touching system for calendar-law violations. Enumerate all
   reads of tick/now/createdAt/Date across src/domain (the no-Date grep-gates cover SOME dirs —
   report which dirs are NOT covered and extend the gate to them). Verify: all durations are
   integer weeks; INTERVAL_WEEKS {1,4,13,52} used consistently; MONTH_END_WEEKS respected where
   month boundaries matter; no wall-clock in any sim path (the tick-49 class); createdAt used for
   DISPLAY ONLY everywhere (flag every sim-path read of it). Deliverable: docs/TEMPORAL_AUDIT.md —
   a table of every time-touching module, its time source, and PASS/VIOLATION; FIX violations
   in-fence (small, mechanical) or STOP-AND-REPORT structural ones.
2. MAINTAINED WHOLE-KERNEL SOAK: the audit soaks all drive leaf functions; the multi-decade
   composed-engine evidence rests on an ad-hoc harness. Promote it: scripts/audit/whole-world-soak.mjs
   — build a 3-5 settlement campaign fixture, advance 30 years via simulateCampaignWorldInterval
   (now pinned), assert: no crash/NaN, byte-identical re-run on same seed, divergence on different
   seed, population bounded, stressors oscillating (not frozen at 0 forever — document the
   equilibrium finding rather than fail on it). Wire into the audit-scripts convention so it runs
   on demand as an evidence artifact.
3. TRADE-PRIMITIVE TESTS (the pillar-inventory gap): tradeWar/tradeSalience/supplyCompleteness/
   foodStockpile have ZERO dedicated tests. Add focused fixtures: salience bands stable on a known
   snapshot; supplyCompleteness 0/partial/full cases; a deterministic trade-war contest pin
   (same seed ⇒ same flip); foodStockpile drawdown/refill arithmetic. Pure-function tests, no
   engine changes.

## Fence + gates
LANE A: src/domain/worldPulse/disposition.js + a new selector file + tests. LANE B:
docs/TEMPORAL_AUDIT.md, scripts/audit/whole-world-soak.mjs, tests/domain/** (new files), eslint
gate config ONLY for grep-gate extension, mechanical in-fence fixes with each violation cited.
NO git add/commit/stash. Gates: full battery (eslint/typecheck/domain-strict/build/verify:dist
budget 1,441,000/goldens byte-identical — Lane A adds no consumer, Lane B fixes must be
byte-neutral or STOP-AND-REPORT with the violation documented). Report per-lane: files + line
counts, the audit table summary (violations found/fixed/reported), soak results, every gate.
