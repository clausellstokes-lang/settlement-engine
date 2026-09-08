# M1 — THE 300-YEAR LIT RECEIPT: figures, verdict, and the two instrument findings

Run: `research-lit-4s` profile, case `research-lit-4s-300y-4s-seed1`, 300 y x 4 settlements,
`--lighting demographicsEnabled=true`, at product tip `4243bdc610fe5b380f1d0029973cf9088bae1631`.
Started 2026-09-07 00:09:37 EDT, ended 00:35:20 EDT. **TRUE_EXIT=0** (captured in-shell).
Receipt: `artifacts/research-lit-4s.cases/research-lit-4s-300y-4s-seed1.json` (5,205,682 B, schemaVersion 5).
Aggregate digest `c8205d4e1147c2fb28be42e93a4e18a753850cfa050d5a9709204527f1e3ffe0`.

## WALL CLOCK — the design's estimate is ~4x too pessimistic
- run A: **762.3 s** for 300 y x 4 settlements = **0.635 s/settlement-year**.
- whole job (run A + byte-identical run B + 5-year divergence run C + worker isolate):
  **25 min 43 s**, against the design's **~2.3 h** (§11.4 off-gate row, §14 E12, and the register
  cell's own note, all built on a 3.5 s/settlement-year estimate).
- The estimate was 5.5x high per settlement-year. **CONFIRMED.** Consequence for SOAK-1/E12: the
  12-settlement `research-lit` cell was priced at ~7 h / ~17.6 h on the same estimate; at the
  measured rate the same arithmetic gives roughly **1.3 h per traversal** before superlinearity,
  which puts the 12 s cell back inside a hosted six-hour job. That re-opens SOAK-1 as a question
  for the chair. **The extrapolation is PLAUSIBLE, not confirmed** — superlinearity in settlement
  count is exactly what this datum cannot measure, and the register note already warns that two
  30-year figures disagreed by 17.8x.

## THE ASSERTIONS (all green — quoted from the run)
```
PASS  byte-identical re-run (same seed) — all 300 yearly composite hashes equal
PASS  different seeds produce a divergent event-type mix — TV 0.273 (min 0.10)
PASS  every settlement population finite and > 0 every year (remnants excepted)
PASS  realm population bounded — 21844 → 12289 (×0.56; envelope 0.05–20)
PASS  the world keeps moving — 30 decades; min distinct types 17 (floor 10),
      min hash moves 10 (floor 10), min events/settlement 271.5 (floor 1)
PASS  serialized state under the house envelope — max 2.05MB < 3.60MB
PASS  per-year wall-time trend not age-linear — Q1 2139.2ms → Q4 2890.2ms/year
OK — all assertions green (300y × 3 runs)
```

## THE REGISTER FIGURES (derived, never typed — `soak-register.proposed.json`, 24 figures)
| figure | value | direction |
|---|---|---|
| `realm.runawayCount` | **0** | shrink |
| `realm.flooredCount` | **0** | shrink |
| `realm.unlawfulZeroCount` | **0** | shrink |
| `realm.bifurcated` | **0** | shrink |
| `realm.ratio` | **0.5626** | band 0.25 |
| `liveness.silentDecades` / `frozenDecades` | 0 / 0 | shrink |
| `cost.primaryMs` | 762,290 | report |
| `cost.peakHeapUsedBytes` | 509,407,024 (ceiling 838,860,800) | ceiling |
| `population.soak-a.shape` … `soak-d.shape` | **`other` x 4** | exact |
| finals | soak-a 10,869 · soak-b 1,017 · soak-c 244 · soak-d 159 | band 0.10 |

## THE VERDICT, STATED HONESTLY

**The runaway is CURED. The plateau is NOT DEMONSTRATED.**

- `realm.runawayCount` **0** and `realm.bifurcated` **0**: the standing `population-runaway-300y`
  hazard does not reproduce under the lit engine. That half of the design's prediction HOLDS.
- **Every settlement's shape is `other`, not `plateau`.** The design's C4′ clause (4) predicted
  "`plateau` shapes, `bifurcated` 0". Only the second half came true.

The curve is a crash, a long trough, and a recovery that has **not finished at the horizon**:

```
settlement      y1    y25    y50   y100   y150   y200   y250   y300
soak-a       15196   8065   6823   6840   8319   6576   8620  10869
soak-b        3457     58     58     91    202    562    606   1017
soak-c        1263    647    510    420    324    327    277    244
soak-d         585      0     24    189     38    187    270    159
REALM        20501   8770   7415   7540   8883   7652   9773  12289

last 50 years of the realm total:
  y250=9773  y260=10302  y270=10795  y280=11122  y290=11656  y300=12289
```

The realm gains **+26 % over the final fifty years** and is still climbing at year 300. A
`plateau` verdict requires `|y300 - y200| <= 0.05 x y300`; the measured drift is **7.9x** that
window for soak-a, 8.9x for soak-b, 6.8x for soak-c, 3.5x for soak-d. **300 years is not long
enough for this fixture to reach a steady state.** CONFIRMED.

## TRIPWIRE FIRED — 1 deterministic finding
```
node scripts/soak/evaluate-receipt.mjs --aggregate artifacts/research.json
TRUE_EXIT=1                       <- the run is NOT clean
  FINDING  research-lit-4s-300y-4s-seed1 · capacity_realm_load
           — realm load 0.4787 outside the plateau window [0.6, 1.05]
FIRED: 1 deterministic finding(s) over 1 cell(s); 0 host-observability note(s)
```
Tick/figure: at the horizon year (300), `realmDemography.loadRatio01 = 0.4787`
(population 12,289 against bound 25,674, capacity 26,292, `realmPressure01` 0.4674).
The row's second clause is SATISFIED — `binding.granary 2 + walls 2 === settlements 4` — so the
row fired on the load window alone. The ladder is healthy: `viable 4, failing 0, evacuating 0,
remnant_occupied 0, remnant_empty 0`. This is an UNDER-FILLED realm, not a dying one.

Whether that is a MODEL fact (the lit term settles near half its bound at realm scale, against the
§2.0 "fixed point at 76-83 % of the bound" claim) or an INSTRUMENT fact (the [0.6, 1.05] window
grades a steady state, and this reading was taken mid-recovery) is **not this lane's to rule**. The
measured tilt is toward the second: a realm still gaining 26 %/50 y has not reached the state the
window describes. Recorded for the tuning desk; **no dial was touched.**

## ⛔ INSTRUMENT FINDING M1-F1 — `capacity_plateau` AND `capacity_floor_thaw` CANNOT FIRE ON ANY REAL RECEIPT

Both rows key on `receipt.yearlyPopulations` / `receipt.yearlyDiedFlags`
(`scripts/soak/tripwires.mjs:239, :243, :276, :278`). **No written receipt carries either field.**

`whole-world-soak.mjs` builds both on the per-RUN object (`:389-390`, `:489-490`, `:548-560`) and
then writes a receipt (`:1068-1074`) carrying only `startPopulations`, `finalPopulations` and
`finalDiedFlags`. The per-year series survives only inside `behavioral.yearly[].stateVectors[id]
.population`, under a different name and shape. Measured on the real receipt:

```
top-level keys: … startPopulations, finalPopulations, finalDiedFlags, yearlyBytes,
                yearlyRealmBytes, yearlyMs, … behavioral, … notExecutable, …
yearlyPopulations present? false
yearlyDiedFlags  present? false
notExecutable: []          <- the receipt claims FULL instrumentation
```

Both detectors therefore hit their `Array.isArray(...) ? ... : []` guard, read a zero-length
series, take the `pops.length < 150` (resp. `< 100`) early return, and answer `[]` — **silently,
and not as NOT-EXECUTABLE**. Their zero is a WEAK ZERO of exactly the class
`scripts/soak/evaluate.mjs`'s own header names: "A detector with no caller is not a guard — it is a
guard-shaped file, and its zero findings are a WEAK zero."

**Proof that the silence is false, not a pass.** Rebuild the two fields from `behavioral.yearly`
and feed the same receipt back to the same detectors:

```
capacity_plateau         -> [] (silent)                       # as shipped
PATCHED capacity_plateau -> FIRED:
  settlement 0 never plateaued: 8319 at year 149 against 10869 at year 299
  settlement 1 never plateaued:  202 at year 149 against  1017 at year 299
  settlement 2 never plateaued:  324 at year 149 against   244 at year 299
  settlement 3 never plateaued:   38 at year 149 against   159 at year 299
PATCHED capacity_floor_thaw -> [] (silent)   # correctly silent: nothing is frozen
```

**The plateau row would convict all four settlements if it could see the data.** So the design's
"`plateau` shapes" prediction is refuted twice independently — by `settlementShapeOf` (4x `other`)
and by `capacity_plateau`'s own arithmetic.

**Why it was never caught:** `tests/soak-harness/tripwireRegistry.test.js:161` proves the row
against a HAND-PLANTED `yearlyPopulations` on a synthetic receipt
(`lit({ yearlyPopulations: years(201, …) })`). The fixture is the only writer of that shape, so the
row is green in the unit pin and blind in production — the estate's own "a fixture can be the only
writer of the SHAPE" hazard, live.

**This is the same defect class C3 already caught once.** `capacity_envelope_30y` was REFUSED at
landing for keying on an absent field (commit `d02c5acde`, subject: "…and the row that would have
keyed on an absent field is refused"). Two sibling rows shipped with the identical defect and were
not checked the same way.

**Consequence for the program, and it is the load-bearing one.** §2.5 C5's signing proof reads "the
tier-2 LIT 300 y receipt PASSES `realm population bounded` and **fires none of the four rows**."
Two of the three built rows cannot fire on any receipt, so "fires none" would be a weak zero, and
the tuning signature would cite it as evidence. **The 12 s terminal cell will carry the same hole
unless the receipt writer ships the series or the rows are re-keyed onto `behavioral.yearly`.**

## ⛔ THE REGISTER CELL IS REFUSED BY ITS OWN DOOR (no judgment call left to make)
```
node scripts/soak/soak-register.mjs --compare --aggregate … --propose …
TRUE_EXIT=0
NOT-EXECUTABLE  research-lit-4s/research-lit-4s-300y-4s-seed1 — the cell is UNFROZEN genesis
  measured 24 figure(s); the FIRST clean run is the freeze act
```
and in the proposal itself:
```json
"mintRefusals": ["a deterministic-class tripwire fired — the run is not clean"]
```
`mintRefusals` (`scripts/soak/register.mjs:340-353`) refuses any receipt with
`deterministicFirings !== 0`. `capacity_realm_load` fired, so **the door refuses the mint.** No
`--write` is possible, and none was attempted. The proposal is preserved at
`artifacts/soak-register.proposed.json` for the chair.
