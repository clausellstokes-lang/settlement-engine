---
name: criminal-capture-shift-owner-ruling
description: RESOLVED 2026-07-26 — owner ruled "recalibrate"; capture test moves to N=400 with proportional bounds; ~6.75% capture accepted as tuning truth
metadata: 
  node_type: memory
  type: project
  originSessionId: c0eb8c59-b585-45a4-afa4-24af69125d15
  modified: 2026-07-26T19:49:29.985Z
---

**RESOLVED 2026-07-26: the owner ruled "recalibrate"** (explicit in-session
choice between the two costed options). The test moves to N=400 with the
ordinary-corrupted bound converted to its documented 2.5% proportion; the
~6.75% capture rate at the criminal extreme is accepted as the new tuning truth
under final-economy legitimacy. The engine was NOT touched. Ruling recorded in
`docs/GOLDEN_SHIFT_LEDGER.md` ("RULING TAKEN"). Analysis kept below for the
record.

**What moved.** The final-economy → power reconciliation means power is now
scored against the FINAL economy and the real defense label instead of a
provisional one, so `computePublicLegitimacy` sees the settlement's true
prosperity/safety/food. Measured base `8033ddbe` → now, matched seeds:

| metric | N=40 | N=400 |
| --- | --- | --- |
| criminal-town capture, base | 4 (10.0%) | 17 (4.25%) |
| criminal-town capture, now | 5 (12.5%) ❌ | 27 (6.75%) |
| criminal-city capture, base → now | 1 → 4 | 6 (1.5%) → 16 (4.0%) |
| criminal-city equilibrium+, base → now | 33 → 40 | 310 → **397** |

The `equilibrium+` row is far outside noise: a 90-criminal-priority city now
essentially never reads merely `adversarial` (3 cases left, down from 90).

**Ruled out by measurement, so don't re-investigate:** faction power inputs are
unchanged (govP 38.59→39.01, crimP 23.96→23.91); `safetyRatio` inputs are
identical for the criminal sweeps; legitimacy multipliers are NOT applied twice
(`projectPowerGenerationIntent` deep-clones a frozen intent and replays a named
RNG stream).

**Why it was not repaired:** the bound must not move (that is the forbidden
"weaken the corpus" move); raising N is not a clean fix either, because at N≥200
a *different* assertion fails — "ordinary settlements essentially never read
influenced" uses an ABSOLUTE `<= 1` while its own comment documents it as a
2.5% proportion, and it fails at N=400 in the BASE tree too (6). Also worth
knowing: at N=40 the base scored **exactly 4 against a bound of exactly 4** —
this ratchet had zero margin before the lane touched anything.

**The two options (full write-up in `docs/GOLDEN_SHIFT_LEDGER.md`):**
"recalibrate" = N→400 + convert the ordinary-corrupted bound to its documented
proportion (~38s suite cost, every assertion then passes in both trees with
margin); "hold the line" = damp the legitimacy→criminal-power coupling so the
rate returns to the documented 1.7–3.3% band (an engine tuning change that moves
the goldens again).

**How to apply:** balance/tuning is owner-signed under [[the-promise-ratified]] —
do not decide it in-session. Related: [[generation-remediation-gate-state]].
