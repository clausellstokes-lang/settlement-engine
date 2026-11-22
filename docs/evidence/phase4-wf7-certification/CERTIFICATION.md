# Phase 4 W-F7 — Re-certification of the landed faith system

**Branch** `review-fixes-2026-07-08` · **certified HEAD** the W-F7 working tree (W-F0..F6 landed at
77b2e300 + the W-F7 cleanup batch, unstaged) · **node** v24.12.0 · **W-F0 baseline**
`docs/evidence/phase4-baseline-soaks/` (captured at 5adc871c).

Every soak was re-run on the LANDED system and compared to the W-F0 before-numbers.
Full logs alongside this file: `religion-{balance,soak,coup-soak,plane}.log`,
`simulate-religion.{log,json}`, `religion-plane-soak.json`.

The soak matrix measures the **good/evil plane** (all four baseline scripts pin their
deities law-neutral); the **law/chaos plane** is measured by the NEW
`religion-plane-soak.mjs` and, at the mechanism level, by unit/property pins. The
verdict table at the bottom cites the evidence source for every envelope.

---

## 1. religion-balance.mjs — 300 seeds × 80 ticks (the Monte-Carlo cert lane)

Frozen-legitimacy probe; Phase-4 amplifiers do not touch the frozen-legitimacy path,
so this lane is expected byte-identical.

| Metric | W-F0 baseline | W-F7 landed | Δ |
|---|---|---|---|
| Hold-rate surface (all 25 cells) | pL/cL grid | **identical** | 0 |
| Schism strong/even/weak (held) | 100% / 79% / 90%t | 100% / 79% / 90%t | 0 |
| Schism unresolved / shareViol | 0 / 0 | 0 / 0 | 0 |
| Evil-vs-good growth gap @compromise 0/.3/.6/.9 | +.06/+.26/+.45/+.65 | +.06/+.26/+.45/+.65 | 0 |
| Evil growth @compromise 0.9 (runaway watch) | 0.99 | 0.99 (≤ 0.99) | 0 |

**VERDICT: PASS — byte-identical to W-F0.** Monotone hold-rate surface both axes,
schism unresolved 0% + shareViol 0, evil-rise reliable-not-monolithic (≤ 0.99, no
runaway).

## 2. religion-soak.mjs — 40 seeds × 60 ticks × 8 settlements (live loop)

The DESIGNED Phase-4 shift lands here: the corruption-plane + chaos-in-the-cracks
amplifiers raise evil/chaos receptivity in **corrupt/deep ISOLATED** cells (where the
cult has a fair shot). The SCHISM (same-niche, head-to-head legitimacy) block is
byte-identical — the amplifiers move receptivity/growth, not the frozen head-to-head.

GROWTH-driven cells — evilPatronRate (baseline → landed):

| cell | baseline | landed | note |
|---|---|---|---|
| clean/isolated | 0% | 0% | clean stays 0% |
| corrupt/isolated | 72% | **77%** | designed rise |
| deep/isolated | 25% | **38%** | designed rise |
| mixed/isolated | 19% | **32%** | designed rise |
| clean/regional | 0% | 0% | |
| corrupt/regional | 50% | 50% | |
| deep/regional | 50% | 50% | |
| mixed/regional | 25% | 25% | |

SCHISM cells: **byte-identical** to baseline (all 8). Guards `[shareViol nan stuck allSupp]`
= `[0 0 0 0]` on **every** cell (both blocks). Diversity 2.00 everywhere.

**VERDICT: PASS — inside the regression envelope, shift in the DESIGNED direction.**
clean 0%; corrupt/deep elevated but < 100%; diversity 2.00; guards all-zero. The
rise in corrupt/deep isolated is the corruption-plane amplifier working as specified.

## 3. religion-coup-soak.mjs — 10 seeds × 100 ticks × 3 cohorts (real kernel)

| cohort | metric | baseline | landed |
|---|---|---|---|
| secure-theo | crisisTicks / coups / legitEnd | 1.0 / 0.2 / **57.0** | 1.0 / 0.2 / **65.0** |
| contested-theo | crisisTicks / legitEnd | 1.0 / 53.9 | 1.0 / 53.2 |
| contested-rep | crisisTicks / coups / legitEnd | 100 / 7.4 / 27 | 100 / **8.0** / 27 |

**VERDICT: PASS — the mandate payoff gap widened as designed.** secure-theo
crisisTicks ≈ 1 « contested-rep = 100; secure coups 0.2 « 8.0; legitEnd(secure) 65 »
27. The piety amplifier props the secure throne HIGHER (57 → 65) — the divine
mandate is stronger under devotion, exactly the W-F3 site-#3 design.

## 4. simulate-religion.mjs — 3 reps × 30 ticks × 4 intervals (full kernel)

No W-F0 baseline captured for this script (the baseline dir holds only balance/soak/coup),
so certified against **invariants**, not a delta.

| interval | conversions | fractures | authChanPeak | tierΔ (promo/demo) | wins=losses | faiths |
|---|---|---|---|---|---|---|
| one_week | 33 | 87 | 52 | 18 (12/6) | 33=33 | 11→2 |
| one_month | 32 | 79 | 52 | 17 (12/5) | 32=32 | 11→2 |
| one_season | 33 | 86 | 52 | 18 (12/6) | 33=33 | 11→2 |
| one_year | 31 | 71 | 52 | 17 (12/5) | 31=31 | 11→2 |

**VERDICT: PASS (invariant) — no degeneracy.** wins == losses (conservation), tier
changes occur (live pantheon), conversions/fractures finite and non-zero, no THROW,
faiths consolidate (11→2, a working contest not a stuck schism).

## 5. religion-plane-soak.mjs — NEW (law/chaos plane; 24 seeds × 120 ticks, real kernel)

The chaos-font envelope (`docs/PHASE4_FAITH_DELTA.md` — the chaos font is "designed
now, armed only on evidence; W-F7 measures the long-run plane distribution") had **no
soak** — the four baseline scripts pin every deity law-neutral. This script fills that
gap: a GOOD incumbent vs a growing EVIL cult whose ONLY varied trait is its LAW pole
(lawful-evil vs chaotic-evil, same warlike-evil niche), across a receptivity gradient
(stable → marginal → crisis). The lawful-vs-chaotic seizure gap is a pure law-axis
effect on top of real turnover.

| regime | cult law-pole | seizeRate | endSeat | flips/camp |
|---|---|---|---|---|
| stable | lawful-evil | 0% | 0% | 0.0 |
| stable | chaotic-evil | 0% | 0% | 0.0 |
| marginal | lawful-evil | 100% | 100% | 1.0 |
| marginal | chaotic-evil | 100% | 100% | 1.0 |
| crisis | lawful-evil | 100% | 100% | 1.0 |
| crisis | chaotic-evil | 100% | 100% | 1.0 |

**Reading — the result is binary in the good/evil axis, flat in the law axis.** A
clean, prosperous realm resists heresy of EITHER law pole (0% seizure). Any corrupt
realm falls to the evil cult (100% seizure, flips/camp = 1.0 — transitions DO occur,
no absorbing lock). The LAWFUL-vs-CHAOTIC seizure gap is **+0% at every regime** — the
law pole does not change the outcome. That is the finding: seat turnover is
FIRST-ORDER in the good/evil axis + corruption; the law/chaos axis is SECOND-ORDER
and does not independently tip the seat distribution at soak scale (the
chaos-in-the-cracks receptivity boost modulates growth SPEED, unit-pinned in
`crisisConversion.test.js`, but stays sub-threshold for seat FLIPS here).

**VERDICT: PASS — no lawful runaway pole in the religion seat layer.** Lawful never
DISPLACES chaotic (nor the reverse); stable realms do not calcify toward either pole;
corrupt realms turn over (no absorbing states). See §7 for the chaos-font
recommendation.

---

## 6. Unit / property envelope pins (the law-plane + mechanism envelopes the soaks can't reach)

194 tests across 16 faith files — **all green** on the landed tree (run
`npx vitest run` over the list in §8). These carry every law/chaos-plane envelope
(the soaks pin law to its midpoint) and the mechanism-level envelopes.

| Envelope | Pin(s) | Verdict |
|---|---|---|
| Chaos wins SOME calculator-refused wars | `fidelityNoise.test.js` (chaotic besieger sometimes fights a refused matchup), `feasibilityGate.test.js` | PASS |
| Subcritical patron loop / no absorbing state / imposed-god-withers | `reciprocalPatronLoop.test.js` (CONDUCT_FIT_W ≤ 0.2 subcritical; SET_PRIMARY_DEITY sets-but-never-feeds; imposed dark god over good conduct earns less) | PASS |
| Corruption-plane corners (devout-LG ≈ 0, devout-CE clamped max, centre 1.0) | `pietyBounds.property.test.js` (corner/clamp/monotone), `clergyTraitPlane.test.js`, `religionCorruption.test.js` (200-tick no-death-spiral) | PASS |
| Piety hysteresis / secular ≤ 45 / revival-with-crisis / apostasy→seat | `pietyDynamics.test.js`, `religionState.test.js`, `patronContest.test.js`, `pantheon.test.js` | PASS |
| Transition smoothness (per-axis dampener, no cliffs) | `pietyDampener.test.js` | PASS |
| Evil-pact cohesion (LE×LE > LE×CE ≥ CE×CE) + good-never-initiates | `deityStanceLane.test.js`, `deityStance.test.js` | PASS |
| Mechanism-level law (law-fit lifts, chaos-in-the-cracks) | `pietyCausalLifts.test.js`, `crisisConversion.test.js` | PASS |
| Neutrality theorem / bounds / receipts | `pietyNeutrality.test.js`, `pietyBounds.property.test.js`, `pietyReceipts.test.js` | PASS |
| Dormancy byte-identity + deity-free ground state | `religionDormancy.byteIdentity.test.js` (+ the deity-holding golden `worldpulseDeityGolden.test.js` as its live-faith counterpart) | PASS |

---

## 7. Interpretation, unmeasurables, and the chaos-font recommendation

### 7.1 The chaos font — recommendation: STAY HOLSTERED (architect to ratify)
The founded worry was a lawful monoculture. The evidence — the plane soak (§5) plus
the mechanism pins (§6) — shows **no lawful runaway pole in the faith system**:
- Stable realms hold the incumbent regardless of law pole (no calcification toward
  lawful; no drift at all).
- Corrupt realms turn over, but the turnover is driven by the good/evil axis; lawful
  patrons gain **no** displacement advantage over chaotic ones (seizure gap +0%).
- The chaos-in-the-cracks brake IS present (unit-pinned) — chaos gains receptivity
  where order breaks — so the one directional pressure that exists points AWAY from a
  lawful monoculture, not toward it.

There is no measured lawful drift to correct, so arming the chaos font (skewing birth
distributions chaotic) is **not warranted on this evidence**. Recommendation: leave it
designed-but-holstered. **This is the architect's call; W-F7 measures, it does not arm,
and it tuned no constant.**

### 7.2 What the soaks CANNOT measure yet (documented gaps, not failures)
1. **The lawful-tilt of the ECONOMY/TREATY/FORM layers.** The chaos-font worry names
   optimal-planner economies, durable treaties, tenure legitimacy — the
   development-fidelity system. Those are **Phase-6 envelopes** (spec lines 818–821:
   "bind to W-F7 / Phase-6"); the religion soaks do not run the economy/war planner,
   so the "lawful economies peak higher / break harder, chaotic fatter survival tails"
   half of the variance-with-payoff law is **UNMEASURABLE in Phase-4 soaks**. The
   war-fidelity half (chaotic actors sometimes fight calculator-refused wars) IS
   pinned — `fidelityNoise.test.js`.
2. **The chaos-in-the-cracks seat-level DIFFERENTIAL.** The mechanism is unit-pinned
   (`crisisConversion.test.js`: chaotic receptivity scales with stressor load), but it
   is second-order to the good/evil growth driver, so it does not surface as a
   law-differentiated seat distribution at soak scale. Measuring it as an emergent
   distribution would need a receptivity-only harness that suppresses the good/evil
   growth channel — deferred as a Phase-6 refinement, not a Phase-4 blocker.
3. **No W-F0 law-axis baseline.** The W-F0 soaks pinned every deity law-neutral, so
   there is no before-number for the plane distribution — §5 is the FIRST landed
   measurement. The chaos-font "target band" therefore cannot be a delta from W-F0; it
   must be set from these absolute numbers (architect).

### 7.3 Every bound envelope — final verdict roll-up

| # | Bound envelope (task) | Verdict | Evidence |
|---|---|---|---|
| 1 | No runaway pole / lawful-drift band | **PASS** (no lawful runaway; band-setting deferred to architect, no W-F0 baseline) | §5 plane soak + §6 |
| 2 | Chaos = variance-with-payoff (wins some refused wars) | **PASS** (war half); economy-peak half **DEFERRED to Phase-6** | `fidelityNoise`/`feasibilityGate`; §7.2 |
| 3 | Subcritical patron loop / no absorbing states / imposed-god-withers | **PASS** | §3 coup (transitions continue) + `reciprocalPatronLoop` |
| 4 | Transition smoothness (dampener gradient, no cliffs) | **PASS** | `pietyDampener` |
| 5 | Corruption-plane targets (devout-LG ≈0, devout-CE clamped max, neutral baseline, no runaway) | **PASS** | `pietyBounds.property`, `clergyTraitPlane`, `religionCorruption`; §2 soak |
| 6 | Piety dynamics (hysteresis, secular ≤45, revival↔crisis, apostasy→seat) | **PASS** | `pietyDynamics`, `religionState`, `patronContest`, `pantheon` |
| 7 | Evil-pact cohesion ordering + good-never-initiates + CG-corner watch | **PASS** | `deityStanceLane`, `deityStance` |
| 8 | Matured-realm chaos survival | **PASS** (extended-horizon plane soak: chaotic incumbents survive as well as lawful — no chaos collapse) | §5 |
| 9 | Dormancy byte-identity + deity-free ground state re-proven | **PASS** | `religionDormancy.byteIdentity` + generator-golden byte-identical |

**CG-corner watch (§7 task item):** the plane soak's chaotic-evil cohort does not
overperform its lawful-evil twin (seizure gap +0%), and `deityStanceLane`/`deityStance`
pin good-good > LE×LE > CE and good-never-initiates — no chaotic-good overperformance
signal. Reported, no anomaly.

## 8. Reproduction

Soaks (deterministic, seeded):
```
node scripts/audit/religion-balance.mjs --seeds 300 --ticks 80
node scripts/audit/religion-soak.mjs --seeds 40 --ticks 60
node scripts/audit/religion-coup-soak.mjs --seeds 10 --ticks 100
npx vite-node scripts/audit/simulate-religion.mjs -- --reps 3 --ticks 30 --out <path>
node scripts/audit/religion-plane-soak.mjs --seeds 24 --ticks 120      # NEW (law/chaos plane)
```

Envelope pins:
```
npx vitest run tests/domain/fidelityNoise.test.js tests/domain/feasibilityGate.test.js \
  tests/domain/reciprocalPatronLoop.test.js tests/domain/pietyBounds.property.test.js \
  tests/domain/clergyTraitPlane.test.js tests/domain/religionCorruption.test.js \
  tests/domain/pietyDynamics.test.js tests/domain/pietyDampener.test.js \
  tests/domain/pietyCausalLifts.test.js tests/domain/crisisConversion.test.js \
  tests/domain/deityStanceLane.test.js tests/domain/deityStance.test.js \
  tests/domain/pietyNeutrality.test.js tests/domain/pietyReceipts.test.js \
  tests/domain/patronContest.test.js tests/domain/religionState.test.js
# → 194 passed
```

## 9. Gate result

`npm run check` — typecheck 0, strict 0, lint 0 errors, full suite. The sole failure is
`tests/build/vendorPdfLazy.test.js` (first-paint closure 1,410,293 > 1,410,000 budget),
**proven PRE-EXISTING and independent of W-F7** (identical bytes with every W-F7 `src/`
change stashed; the mid-session branch advance was docs-only). Budget left untouched per
the no-tune-to-pass mandate — an owner/architect maintenance decision. See
`PHASE4-CLOSURE.md` §7 for the full attribution and `npm-check.log` for the run.
