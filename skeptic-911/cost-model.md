# SKEPTIC §911 — LENS: THE COST MODEL AND THE RE-PRICE
Seat: Opus 5 — Fable-unvalidated. Read-only on every tree and dock.
Target: `$SC26/receipt-cap-horizon-909.md` (584 lines, read in full).
Dock `$SC26/laneB6` porcelain BEFORE **0**, AFTER **0**; HEAD `3b1c0eaa51f77561a036ae7ec54682c39856192c` unmoved.
All figures below come from `python3` over the receipts named, run with cwd under this scratchpad; nothing written outside it.

`$SC26` = `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad`

---

## 0. THE SEED ROSTER — the fact the whole lens turns on
Read off each receipt's own `seed` field:

| run | file | `seed` | `startPopulations` sum | settlements |
|---|---|---|---|---|
| 30 y × 4 s LIT (55,243 ms) | `soak909/fresh-30y-4s-lit.json` | `w0-soak` | 17,682 | 4 |
| 30 y × 4 s LIT (54,790 ms) | `soak909/fresh-30y-4s-lit-AFTER-car3.json` | `w0-soak` | 17,682 | 4 |
| 30 y × 4 s DARK (66,679 ms) | `soak909/fresh-30y-4s.json` | `w0-soak` | 17,682 | 4 |
| 30 y × 12 s LIT (244,623 ms) | `capacity-horizon/artifacts/probe-30y-12s-lit.json` | `realm-scale-research-lit-4s-30y-12s-seed1` | 75,790 | 12 |
| 30 y × 12 s DARK (271,395 ms) | `…/probe-30y-12s-dark.json` | same as above | 75,790 | 12 |
| 300 y × 4 s LIT (762,290 ms) | `capacity/artifacts/research-lit-4s.cases/research-lit-4s-300y-4s-seed1.json` | `realm-scale-research-lit-4s-300y-4s-seed1` | 21,844 | 4 |
| 600 y × 4 s LIT (2,239,561 ms) | `capacity-horizon/artifacts/horizon-600y-4s-lit.json` | `realm-scale-research-lit-4s-600y-4s-seed1` | 21,124 | 4 |

**THREE distinct seeds carry the four inputs of the cost model.** The receipt labels `f_S` "one horizon, one seed" and `k = 1.358` "ONE seed" (headline table; caveat 2; R5). Both are false: the 4-settlement baseline is `w0-soak` and the 12-settlement probe is `realm-scale-research-lit-4s-30y-12s-seed1`. The receipt's own R6 and R10 establish that a seed change is a world change worth ×1.25 on this very axis — the correction is applied to the 300↔600 horizon reading and **not** to `f_S` or `f_Y`, which are confounded the same way.

## 1. `f_S(12) = ×1.4821` — the arithmetic holds, the SETTLEMENT-COUNT reading does not
- `r(12,30) = 244,623 / 360 = 0.67951 s/sy`. `r(4,30) = mean(55,243, 54,790) / 120 = 55,016.5/120 = 0.45847 s/sy`. Ratio **1.48212**. The receipt prints 1.4820 in one place and 1.4821 in another; both round the same number. **Arithmetic CONFIRMED.**
- The two runs are different seeds AND different world sizes. Starting realm souls: 75,790 vs 17,682 = **×4.2863**, not ×3.
- Cost ratio ×4.4464 over a starting-souls ratio ×4.2863 leaves **×1.0373 per starting soul** — essentially flat.

| run | s/settlement-year | ms per starting-soul-year |
|---|---|---|
| 30 y × 4 s LIT (w0-soak) | 0.4585 | **0.10371** |
| 30 y × 12 s LIT (research seed) | 0.6795 | **0.10759** |

The ×3 settlement step buys ×1.037 per soul. **The "superlinearity exponent in SETTLEMENT COUNT" is an artefact of the 12-settlement seed generating settlements ~43 % larger, not of the count.** `ln(4.4464)/ln(4.2863) = 1.025` in souls against `ln(4.4464)/ln(3) = 1.358` in settlements. The receipt names four caveats on `f_S`; the starting-realm-size confound is not among them, and it is the largest.

## 2. `k = ln(4.446)/ln(3) = 1.358` — where ×4.446 comes from
It is a **COST** ratio, not a rate ratio: `244,623 / 55,016.5 = 4.44636`, equivalently `(r12/r4) × 3`. `ln(4.44636)/ln 3 = 1.35815` → 1.358. **CONFIRMED as arithmetic.** (Using the single receipt 55,243 instead of the two-run mean gives 4.42813 → k = 1.354; the receipt is consistent in using the mean here.) The exponent's *meaning* falls to §1.

## 3. `f_Y(300) = ×1.3856` — labelled CONFIRMED, but cross-seed and ~13 % too high
- `0.63524 / 0.45847 = 1.38557`. **Arithmetic CONFIRMED.**
- It compares `w0-soak` (start 17,682) against `…-300y-4s-seed1` (start 21,844) — a ×1.235 size step wearing the horizon's clothes. Per starting soul the same step is only **×1.1216**.
- Both receipts carry `yearlyMs`, so the horizon term can be read **inside one world**, which is exactly the instrument R10 uses on the 300↔600 axis. Computed here:

| world | rate(4,30) from own `yearlyMs` | rate(4,300) from own `yearlyMs` | seed-controlled f_Y |
|---|---|---|---|
| 600-year world | 0.63390 | 0.78180 | **×1.2333** |
| 300-year world | 0.52589 | 0.62536 | **×1.1891** |

**The seed-controlled world-age term for 30 → 300 years is ×1.19–1.23, not ×1.386.** The receipt's corroboration ("`Q1 2139.2 → Q4 2890.2 ms/year`") is a within-300-year quartile ratio of ×1.351 and does not corroborate a 30→300 figure at all. The receipt applies R10's own correction to one axis and not the other.

## 4. ⛔ `rate(4,300)` seed B = **0.8051** IS NOT WHAT THE RECEIPT SAYS IT IS
The final table sources it as "*the 600-year world's OWN first 300 years, from `yearlyMs`*". Computed from that field:

```
sum(yearlyMs[0:300]) = 938,161 ms = 938.2 s  →  938.2 / 1200 = 0.78180 s/sy
```

**0.7818, not 0.8051** — and 0.7818 is the figure the receipt itself prints two sections earlier in its own through-yN table (`through y300  938.2 s  0.7818 s/sy`). The receipt therefore carries both numbers for one quantity and uses the larger one to set the band's upper edge.

The provenance of 0.8051 reproduces exactly, and it is an error of construction:
```
runA 2,239.561 s − sum(all 600 yearlyMs) 2,211.559 s = 28.002 s   (whole-run non-yearly overhead)
(938.161 + 28.002) / 1200 = 0.80514                              ← the receipt's 0.8051
```
**The ENTIRE 600-year run's start-up/receipt-write overhead is charged to the first 300 years.** Pro-rating it gives 0.7935; scaling gives 0.7917. None of these is the `yearlyMs` figure the receipt cites as the source.

Consequences, recomputed:

| figure | receipt | corrected (0.7818) |
|---|---|---|
| `rate(12,300)` upper | 1.1933 | **1.1587** |
| run A upper | 4,296 s | **4,171 s** |
| run A + run B upper | 8,592 s | **8,343 s** |
| LIT cell | 1.9 – 2.4 h | **1.9 – 2.3 h** |
| DARK twin | 2.1 – 2.7 h | **2.1 – 2.6 h** |
| **SOAK-1 total** | **≈ 4.0 – 5.1 h** | **≈ 4.0 – 4.9 h** |
| the seed spread | "+26.7 %" | **+25.0 %** (`938.2 / 750.4`, both from `yearlyMs`) |

The headline's direction survives; the stated band's upper edge and the "+26.7 %" seed spread do not.

## 5. dark/lit — the 4-settlement ratio is quoted as TWO different numbers
- `66,679 / 55,243 = 1.20701` → the receipt's **×1.207** (M2 table).
- `66,679 / 55,016.5 = 1.21198` → the receipt's **×1.2120** (M2(b) section, "against ×1.2120 at 4 settlements").

Both are derivable; the receipt uses each once, for the same quantity, without saying they differ. The A/B is otherwise clean — all three `w0-soak` receipts carry `startPopulations` 17,682. **PARTLY: pick one.** (The tighter reading pairs the dark run with the lit run nearest it in time — `completedAt` 07:08:36 dark, 07:12:20 lit — i.e. ×1.207.)
- At 12 settlements: `271,395 / 244,623 = 1.10944` → **×1.1094. CONFIRMED**, same seed, same `startPopulations` 75,790 both sides.

## 6. The terminal-cell band's arithmetic — CONFIRMED given its inputs
`0.6352 × 1.4821 = 0.9415`; `0.8051 × 1.4821 = 1.1933`; `× 3,600 sy` → 3,389 s and 4,296 s; doubled → 6,779 s and 8,592 s = 1.88 h and 2.39 h → "1.9 – 2.4 h"; `× 1.1094` → 2.09 h and 2.65 h → "2.1 – 2.7 h"; summed → 4.0 h and 5.1 h. **Every step reproduces.** The defects are in the inputs (§1, §3, §4), not the arithmetic.

## 7. The pre-registered prediction — CONFIRMED in full
- Quartile fit: slope `(2890.2 − 2139.2)/(263 − 38) = 3.3378`; intercept `2139.2 − 3.3378 × 38 = 2012.36`. Matches `c(y) = 2012.4 + 3.338·y`.
- `Σ_{y=1..300} = 754.4 s` against 762.29 s measured → **−1.03 %**. The receipt's "1.1 %" is right.
- `Σ_{y=1..600} = 1,809.3 s`. The receipt's 1,809 s is right.
- `2,239.561 / 1,809.281 = 1.2378` → the measured run exceeds the prediction by **23.8 %**. (Stated the other way the prediction is 19.2 % below the measurement; "wrong by +23.8 %" is the ratio-to-prediction reading and is defensible.) **CONFIRMED.**

## 8. "the age term settles near ×1.6" — the conclusion is probably right; the cited evidence does not carry it
Century means from the 600-year world's `yearlyMs` reproduce exactly (2708.8 / 3154.6 / 3518.2 / 4045.1 / 4333.9 / 4355.0 ms/y; ×1.000 / 1.165 / 1.299 / 1.493 / 1.600 / 1.608). **CONFIRMED as figures.**

The inference does not follow from the century pair the receipt cites:
- c5 sd 186.6 ms, c6 sd 198.2 ms; difference 21.1 ms, se of difference 27.2 ms → **t = 0.78**. A +0.5 % century-over-century move is *inside the noise*; it cannot distinguish "settled" from "still climbing".
- What a skeptic needs, and what the data actually offer, is a trend test the receipt does not run. OLS on `yearlyMs` by year:

| window | slope | t | per century |
|---|---|---|---|
| y1–300 | +4.059 ms/y | 47.2 | +13.0 % |
| y301–600 | +1.600 ms/y | 12.3 | +3.8 % |
| y401–600 | +0.281 ms/y | 1.19 | +0.65 % |
| y501–600 | +1.053 ms/y | 1.54 | +2.4 % |

The 200-year window is flat and not significant — **stronger support for "settles" than the century pair**, and it is available in the same field. But the residual is bounded only at about **±2 %/century**, not at zero.
- ⛔ **"A 1,200-year run would therefore cost about twice a 600-year run"** extrapolates 600 years past the last measured year, on the strength of one century pair at t = 0.78. This is the exact act R9 forbids two paragraphs later ("*Any figure … extrapolated past its own measured horizon should be read as this prediction was*"). The conclusion happens to be robust — flat gives ×2.17, a continued +2.4 %/century gives ×2.26 — but the receipt states it without that check.

## 9. ⛔ "the 600-year world is simply dearer because it holds ~17,500 souls" — REFUTED
Two independent measurements kill the causal claim:
1. **Within the 600-year world, living population does not predict yearly cost at all.** OLS of `yearlyMs` on realm population over 600 years: `ms = 4747.9 − 0.067 × pop`, **R² = 0.038**, slope *negative*. Cost per thousand souls moves 160 → 179 → 267 → 276 → 279 → 253 across the six centuries.
2. **At the point where the 26 % gap is measured (century 1) the 300-year world is the LARGER one.** `startPopulations`: 300-year world **21,844**, 600-year world **21,124**. The 300-year world's own century-1 population cannot be checked further because that receipt predates the series — it carries **no `yearlyPopulations` key at all** (measured: `startPopulations` and `finalPopulations` only). The "~12,000–15,500" the receipt attributes to it matches its *final* 12,289, not its century-1 level.

The R10 arithmetic (×1.469 cross-run vs ×1.179 seed-controlled) stands. Its stated *cause* does not.

## 10. The design's ≈ 35 h and ≈ 17.6 h — quoted correctly, but PROVENANCE MIS-STATED
`docs/DESIGN_HORIZON.md` **does not exist in the dock `laneB6`** (`git ls-files | grep -i horizon` returns only `tests/domain/memoryHorizon.test.js`). It lives on the main tree's branch `review-fixes-2026-07-08` (729,637 B); `$SC26/capacity/DESIGN_HORIZON.snapshot.md` is §907's copy.

Quoting — **CONFIRMED**. §12 SOAK-1 reads: accept ≈ 35 h of terminal-soak wall clock (the 300 y × 12 s LIT cell ≈ 17.6 h + CAPACITY's DARK twin ≈ 17.6 h at ledger figures), or take the interim 4 s cell (≈ 2.3 h) as the signing evidence. That is exactly what the receipt's C2 says the owner row is. `17.6 / 1.9 = 9.26` and `35 / 5.1 = 6.9 … 35 / 4.0 = 8.75` — the receipt's "9.3× high" and "7× to 9×" reproduce.

⛔ **BUT HEADLINE 4'S FRAMING IS INVERTED.** It reads: "*≈ 4.0–5.1 h — 7× to 9× less — from five measured runs rather than one extrapolated constant.*" The ≈ 17.6 h is **not** an extrapolated constant. Traced to source:

```
docs/architected-volumes-pending-fold/DIAGNOSTIC_SOAK_DESIGN.md:76
  research-300y-12s-seed1 | 4 | ❌ | realm population bounded | 26,875 s / 35,356 s
docs/architected-volumes-pending-fold/DIAGNOSTIC_SOAK_DESIGN.md:318
  26,875 s primary + 35,356 s replay = 17.6 h per case at the OLD flag state
```

**The design's ≈ 17.6 h is a directly MEASURED 300 y × 12 s run** — the very cell being priced — at 62,231 s = 17.29 h, i.e. ≈ 8.6 s/settlement-year. This lane took **no** 300 y × 12 s run; its 1.9–2.4 h is the extrapolation. The rhetoric is exactly backwards.

Three further facts the receipt never engages:
- The design carries its own **12-settlement datum, 9.1 s/settlement-year**, against this lane's 0.6795 — a **13× disagreement** at the same settlement count, unreconciled. (`DESIGN_HORIZON.md:338`.) The design also carries ~3.5 s/settlement-year at 4 settlements against this lane's 0.4585 — 7.6×.
- The measured run **FAILED `realm population bounded`** — it was a runaway. A runaway world is precisely what the receipt's own caveat 3 says costs more, and the DARK twin the owner is being asked to fund is a deliberate runaway re-creation. So the one historical measurement of a runaway 300 y × 12 s world reads 17.3 h against this lane's 2.1–2.7 h **floor** — a 6–8× gap in the place the receipt admits its model is weakest.
- The chair's standing position at HEAD `29a4ff20d` is **already** a re-price: the §909 ODQ row says the 12 s cell "prices near 1.3 h per traversal … so the 35 h estimate is about 4× high". Against that standing figure (≈ 8.75 h) the new band is ~1.8× lower, not 7–9×. Headline 4 measures the improvement against a number the chair had already superseded.

## 11. Bookkeeping
"THE FIVE RUNS THIS LANE TOOK" heads a table with **three** rows, then says runs 4 and 5 "were read from disk" while naming four read receipts (the 300 y one plus three §909 ones). Seven receipts feed the price. LOW, but the header and the table disagree.

## 12. WHAT I COULD NOT TEST
- Whether the terminal `research-lit` 300 y × 12 s cell's own seed generates settlements the size of the probe's (6,316 souls each) or the 4-settlement cell's (4,421). The whole §1 correction turns on it, and no receipt on disk answers it. This is the cheapest thing that would tighten the price — cheaper than E1's 150 y × 12 s probe, since it needs no soak at all, only a plan/generation read.
- Whether the 13× gap between the design's 9.1 s/sy and this lane's 0.68 s/sy at 12 settlements is a real engine speed-up since `b66e9551`, a hardware difference, or a runaway. Untested; it is the single largest unexplained number in the re-price.
