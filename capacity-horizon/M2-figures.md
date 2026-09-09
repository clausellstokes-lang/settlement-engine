# M2 — THE 12-SETTLEMENT TIMING PROBE: the measured cost surface

## THE FOUR RUN-A POINTS THIS LANE STANDS ON
Every figure is `runDurationsMs.primary` read off the receipt itself — the register's own
`cost.primaryMs` figure (`register.mjs:167`), never a wall clock a human read off a terminal.

| run | years | settlements | settlement-years | run A | run B (replay) | run C | s / settlement-year | lit | provenance |
|---|---|---|---|---|---|---|---|---|---|
| 30 y × 4 s DARK | 30 | 4 | 120 | 66,679 ms | 65,025 ms | 13,500 ms | **0.5557** | false | §909 car 1, `$SC/soak909/fresh-30y-4s.json` |
| 30 y × 4 s LIT | 30 | 4 | 120 | 55,243 ms | 59,546 ms | 12,358 ms | **0.4604** | true | §909 car 1, `$SC/soak909/fresh-30y-4s-lit.json` |
| 30 y × 4 s LIT (re-run) | 30 | 4 | 120 | 54,790 ms | 54,130 ms | 11,157 ms | **0.4566** | true | §909 car 3, `…-AFTER-car3.json` |
| 300 y × 4 s LIT | 300 | 4 | 1,200 | 762,290 ms | 757,460 ms | 12,505 ms | **0.6352** | true | §907 HORIZON-B6 |
| **30 y × 12 s LIT** | **30** | **12** | **360** | **244,600 ms** | — | — | **0.6794** | true | **THIS LANE, 08:38:44–** |

## THE COST SURFACE HAS TWO AXES AND THEY ARE SEPARATELY MEASURED
The §907 receipt's "0.635 s/settlement-year" is NOT a constant of the engine — it is one point on a
surface that moves in BOTH the settlement count and the horizon. Reading it as a constant is what
made every extrapolation in the design wrong in the same direction.

**AXIS 1 — the SETTLEMENT count, at a FIXED 30-year horizon (the only honest superlinearity read).**
4 → 12 settlements, both LIT, both 30 years: **55.0 s → 244.6 s**, a **×4.446** cost for a ×3
settlement count.
  ⇒ **exponent k = ln(4.446) / ln(3) = 1.358** — the cost goes as roughly **S^1.36**.
  ⇒ per settlement-year the rate rises **0.4585 → 0.6794 s (×1.482)**.

**AXIS 2 — the HORIZON, at a FIXED 4 settlements (the WORLD-AGE term).**
30 y → 300 y, both LIT: **0.4585 → 0.6352 s/settlement-year, ×1.386** for a ×10 horizon. The soak's
own instrument says the same thing from inside the 300-year run:
`PASS per-year wall-time trend not age-linear — Q1 2139.2ms → Q4 2890.2ms/year` (+35 % across one
run). **An old world costs more per year than a young one**, so a 600-year run is NOT twice a
300-year run.

**AXIS 3 (a control, not an axis) — LIGHTING.** dark 66.7 s vs lit 55.2 s at 30 y × 4 s: the DARK
run is **×1.207 MORE expensive**, not less. The lit demographic term is a *cheaper* world to
simulate at this horizon than the raw proportional growth it replaces — consistent with the dark
world's documented `population-runaway-300y` (more souls, more events, more bytes per year).

## THE PRICE OF THE TERMINAL CELL — 300 y × 12 s LIT, and its DARK twin
The model is the smallest one the measurements support: the two axes are treated as
**separable**, `rate(S, Y) = rate(4,30) × f_S(S) × f_Y(Y)`, with `f_S(12) = 1.4820` measured at
Y = 30 and `f_Y(300) = 1.3856` measured at S = 4.

```
rate(12, 300) = 0.4585 × 1.4820 × 1.3856 = 0.9414 s/settlement-year
300 y × 12 s  = 3,600 settlement-years
  run A                 3,389 s = 0.94 h
  run A + run B         6,778 s = 1.88 h
  + run C + isolate     ≈ +60 s
  ⇒ THE LIT TERMINAL CELL ≈ 6,838 s ≈ 1.9 h      (the design says ≈ 17.6 h — 9.3× high)
  ⇒ THE DARK TWIN ≈ 1.9 h × 1.207 ≈ 2.3 h        (at the measured 30 y × 4 s dark/lit ratio)
  ⇒ SOAK-1's TOTAL ASK ≈ 4.2 h                   (the design asks the owner for ≈ 35 h)
```

⚠ **THE CAVEAT IS THE MODEL, NOT THE ARITHMETIC, AND IT IS NAMED.** `f_S` and `f_Y` were each
measured at ONE point and multiplied. Nothing in this lane measures the CROSS term — whether a
12-settlement world ages more expensively than a 4-settlement one. If the two axes interact
super-multiplicatively, the true figure is higher than 1.9 h; if they interact sub-multiplicatively
(plausible: much of the world-age cost is realm-wide bookkeeping already shared across settlements)
it is lower. **PLAUSIBLE, from three points and one separability assumption.** The one measurement
that would settle it is the terminal cell itself.

⚠ **AND TWO CHEAPER READINGS ARE BOTH WRONG, IN OPPOSITE DIRECTIONS.**
- The design's **3.5 s/settlement-year** gives A+B ≈ 7.0 h — **3.7× too pessimistic.**
- §907's **0.635 s/settlement-year read as a constant** gives A+B ≈ 1.27 h — **too optimistic**,
  because it carries the 300-year world-age term but NOT the settlement-count term. §907 already
  labelled its own extrapolation PLAUSIBLE and named the missing datum ("superlinearity in
  settlement count is exactly what a 4-settlement datum cannot measure"). That datum is now taken,
  and it moves the answer by ×1.48.
- The design's **ledger 17.6 h/case** (`26,875 + 35,356 s` at `b66e9551`) is a DIFFERENT commit's
  measurement of a different case shape and is not comparable term-by-term to these figures. It is
  the origin of the ≈ 35 h SOAK-1 ask.

## M2 RAN TO COMPLETION — **TRUE_EXIT=0**, 08:38:44 → 08:47:44 EDT (**9 min 00 s**)
Log `$SC/capacity-horizon/soak-probe-30y-12s-lit.log`; receipt
`$SC/capacity-horizon/artifacts/probe-30y-12s-lit.json` (1,043,214 B, schemaVersion 5);
extract `$SC/capacity-horizon/M2-lit-extract.txt`.

```
runDurationsMs = {"primary":244623, "replay":241917, "divergent":37195}
peakHeapUsedBytes = 602,385,112   (register ceiling 838,860,800 — under)
A + B + C = 523.7 s; wall clock 540 s (the balance is the 11.3 s worker isolate,
node start-up and the receipt write)
```
Every assertion green, including `PASS byte-identical re-run (same seed) — all 30 yearly
composite hashes equal` and `PASS serialized state under the house envelope — max 3.35MB <
10.80MB (12 settlements)`.

⚠ **THE 12-SETTLEMENT WORLD AGES FLAT OVER 30 YEARS, AND THE 4-SETTLEMENT ONE DOES NOT.**
`PASS per-year wall-time trend not age-linear — Q1 8033.9ms → Q4 8115.0ms/year` (+1.0 %), against
the 300-year 4-settlement run's Q1 2139.2 → Q4 2890.2 (+35 %). Thirty years is too short a window
to see the age term at ALL; the age term in `f_Y` is a 300-year observation and nothing here
contradicts or confirms it. This is why the horizon factor had to be measured on the 4-settlement
axis and could not be read off this run.

## THE PILOT'S SECOND JOB — it is the FIRST receipt to exercise §910's whole channel at once
| what the landing claimed | what this receipt measures | verdict |
|---|---|---|
| the per-year series ships additively on v5 | `yearlyPopulations` **30 rows × 12 wide**, `yearlyDiedFlags` **30 × 12**, `schemaVersion` **5** | **CONFIRMED** |
| the horizon-short rows report through `observability` as `inconclusive: true` | `capacity_plateau` → `{"inconclusive":true,"detail":"horizon: 30 years observed, 150 required"}`; `capacity_floor_thaw` → `100 required` | **CONFIRMED** |
| `capacity_envelope_30y` is armed | EXECUTED at `observed 30 / required 30`, silent (no finding) | **CONFIRMED** |
| a lit run still certifies fully | `fullInstrument: true`, `notExecutable: []`, `deterministicFirings 1` | **CONFIRMED** |
| `capacity_realm_load` grades the realm | FIRED: `realm load 0.4360 outside the plateau window [0.6, 1.05]` | **CONFIRMED** |

⭐ **AND A FIGURE THAT MATTERS TO THE TUNING DESK, TAKEN IN PASSING.** At **12** settlements the
realm load at year 30 is **0.4360** — against **0.5449** on the fresh 30-year 4-settlement lit run
(§909 car 3) and **0.4787** at year 300 on the 4-settlement run. Three settlement counts, three
horizons, and every one of them sits BELOW the [0.6, 1.05] window. The under-fill is not an
artefact of the 4-settlement fixture.
