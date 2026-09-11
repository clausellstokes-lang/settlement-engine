# SKEPTIC §911 — THE FIGURES LENS
Seat: Opus 5 — Fable-unvalidated. Read-only on every tree. Dock porcelain 0 before, 0 after.
Every number below came out of a command I ran; the scripts are `probe1.mjs` … `probe7.mjs` in this
directory. Receipt under test: `$SC/receipt-cap-horizon-909.md` (584 lines, read in full).

## 1. THE THREE SOAK RECEIPTS — top-level facts (probe1.mjs)

| field | receipt says | measured | verdict |
|---|---|---|---|
| M1 bytes | 10,496,438 | 10,496,438 | CONFIRMED |
| M1 schemaVersion / passed | 5 / true | 5 / true | CONFIRMED |
| M1 `runDurationsMs` | 2239561 / 2230837 / 13819 | identical | CONFIRMED |
| M1 `peakHeapUsedBytes` | 563,801,984 | 563,801,984 (ceiling 838,860,800 at `register.mjs:166`) | CONFIRMED |
| M1 `finalHash` | e6837b3810a4… | e6837b3810a4f3bf… | CONFIRMED |
| M1 `demographicsEnabled` | true | true | CONFIRMED |
| M2 lit bytes / durations | 1,043,214 · 244623/241917/37195 | identical | CONFIRMED |
| M2 dark durations | 271395/267012/44912 | identical; `demographicsEnabled` false | CONFIRMED |
| §907 300 y run A | 762,290 ms | 762,290 | CONFIRMED |
| §909 30 y × 4 s lit | 55,243 and 54,790 ms | identical (two files) | CONFIRMED |
| §909 30 y × 4 s dark | 66,679 ms | identical | CONFIRMED |

## 2. THE QUOTIENTS

| quotient | receipt | measured | verdict |
|---|---|---|---|
| M1 run A / 2400 | 0.9332 | 0.93315 | CONFIRMED |
| M1 run B / 2400 | 0.9295 | 0.92952 | CONFIRMED |
| M2 lit / 360 | 0.6795 | 0.67951 | CONFIRMED |
| M2 dark / 360 | 0.7539 | 0.75388 | CONFIRMED |
| §907 / 1200 | 0.6352 | 0.63524 | CONFIRMED |
| 30 y × 4 s lit | 0.4585 | 0.45847 — the MEAN of 55,243 and 54,790; individually 0.4604 / 0.4566 | PARTLY (a mean, not stated as one) |
| dark/lit at 12 s | ×1.1094 | 271395/244623 = 1.10944 | CONFIRMED |
| dark/lit at 4 s | ×1.207 (M2 table) AND ×1.2120 (final table) | 1.2070 against run (a); 1.2120 against the mean of (a),(b) | PARTLY — two different ratios for one quantity, neither labelled |
| run A(600)/run A(300) | 2.938; exponent 1.555 | 2.93794; ln/ln2 = 1.5547 | CONFIRMED |
| cross-run 300→600 rate | ×1.469 | 0.93315/0.63524 = 1.46897 | CONFIRMED |
| seed-controlled 300→600 | ×1.179 | 0.9215/0.7818 = 1.17869 | CONFIRMED |
| cross-run over-states by | ×1.25 | 1.46897/1.17869 = 1.2463 | CONFIRMED |

## 3. WALL CLOCKS vs THE LOG TIMESTAMPS (`SOAK START` / `SOAK END` / `TRUE_EXIT`)

| run | receipt | log | verdict |
|---|---|---|---|
| M2 lit | 08:38:44 → 08:47:44 = 9 m 00 s, TRUE_EXIT=0 | identical | CONFIRMED |
| M1 | 08:51:02 → 10:05:54 = 1 h 14 m 52 s, TRUE_EXIT=0 | identical | CONFIRMED |
| M2 dark | 10:08:33 → 10:18:34 = 10 m 01 s, TRUE_EXIT=0 | identical | CONFIRMED |
| M2 lit balance "11.3 s worker isolate" | 540 − 523.7 = 16.3 s | log line 10: `cold 11293.35ms` | CONFIRMED |
| M1 balance | 4492 − 4484.2 = 7.8 s | M1 isolate `cold 3508.736ms` — 7.8 s holds | CONFIRMED |

## 4. THE PER-CENTURY COSTS AND THE PREFIX TABLE (probe2.mjs — every figure reproduced to the digit)

    through y100  270.9 s  0.6772      y1-100    2708.8 ms/y  (baseline)
    through y200  586.3 s  0.7329      y101-200  3154.6  x1.165
    through y300  938.2 s  0.7818      y201-300  3518.2  x1.299
    through y400 1342.7 s  0.8392      y301-400  4045.1  x1.493
    through y500 1776.1 s  0.8880      y401-500  4333.9  x1.600
    through y600 2211.6 s  0.9215      y501-600  4355.0  x1.608

The 300-year world: 2147.6 / 2504.9 (×1.166) / 2851.8 (×1.328) — CONFIRMED.
Multiplier agreement 0.1 % and 2.2 % — CONFIRMED. Level gap 2708.8/2147.6 = ×1.2613 — CONFIRMED.
Quartiles: §907 Q1 2139.2 → Q4 2890.2 CONFIRMED; M1 Q1 2828.0 → Q4 4342.4 CONFIRMED.
The linear model `c(y)=2012.4+3.338·y` reproduces from those quartiles (mid-years 38, 263), integrates
to 754.4 s (1.04 % under the measured 762.3) and predicts 1,809.3 s for 600 y; the miss is
2239.6/1809.3 = +23.8 %. ALL CONFIRMED.

## 5. THE REALM SERIES (probe4.mjs — reproduced exactly)

50-year population change: y100 −8.8 % (1.8×) · y150 +11.2 % (2.2×) · y200 −25.2 % (5.0×) ·
y250 −6.9 % (1.4×) · y300 +23.6 % (4.7×) · y350 −1.9 % IN · y400 −1.1 % IN · y450 +2.9 % IN ·
y500 +3.2 % IN · y550 +13.3 % (2.7×) · y600 −2.8 % IN. **CONFIRMED, every cell.**
Realm totals 15,450 → 14,986 → 15,925 → 17,537 — CONFIRMED.
`loadRatio01` 0.6443 0.6320 0.6233 0.6361 0.6603 0.7444 0.7251 — CONFIRMED.
Δ50y +0.1229 −0.0123 −0.0087 +0.0128 +0.0242 +0.0841 −0.0193 — CONFIRMED.
`realm.ratio` 21,124 → 17,537 = 0.83019 — CONFIRMED (sums of `startPopulations`/`finalPopulations`).
§907's `loadRatio01` 0.4787 and bound 25,674; M1's y600 bound 24,185 — CONFIRMED.
0.6443 − 0.4787 = 0.1656 = 36.8 % of the 0.45 window width — CONFIRMED.

## 6. ⛔ WHERE THE FIGURES DO NOT REPRODUCE

### 6.1 HIGH — `f_S(12) = ×1.4820` IS NOT SEED-CONTROLLED, AND THE RECEIPT SAYS IT IS
Caveat 2 and R5 both state `f_S` rests on "TWO settlement counts at ONE horizon on **ONE seed**".
Measured (probe6.mjs):

| run | seed | start realm | per settlement |
|---|---|---|---|
| 30 y × 4 s LIT (the denominator) | `w0-soak` | 17,682 | 4,421 |
| 30 y × 12 s LIT (the numerator) | `realm-scale-research-lit-4s-30y-12s-seed1` | 75,790 | 6,316 |

Two different seeds, and the 12-settlement world starts with **43 % more souls per settlement**.
The lane's own R10 establishes that cost tracks population LEVEL, not count — so `f_S` conflates
the two. Its own receipts carry an alternative 4-settlement point at the same 30-year horizon from
the SAME seed family: M1's first thirty years, 0.6339 s/sy against the 12-settlement 0.6795.

    f_S(12) receipt pairing (w0-soak)      = 1.4821     k = ln(4.4464)/ln 3 = 1.358
    f_S(12) alt pairing (M1's own y1-30)   = 1.0719     k = ln(3.2158)/ln 3 = 1.063

**The superlinearity headline does not survive the second pairing** — at k = 1.06 the cost is
essentially LINEAR in settlement count. Neither pairing is seed-free; the point is that the
receipt presents one of them as if it were.

### 6.2 HIGH — `f_Y(300) = ×1.386` IS THE SAME CROSS-SEED READING THE LANE REFUTES IN R10
R10 refuses the cross-run 300→600 horizon reading (×1.469) because it carries a seed effect, and
substitutes the seed-controlled ×1.179 from `yearlyMs`. But `f_Y(30→300) = ×1.386`, which feeds the
terminal-cell price, is exactly a cross-run cross-seed reading (`w0-soak` 30 y vs
`…-300y-4s-seed1` 300 y). Inside M1's own world the same span reads:

    f_Y(30 -> 300) cross-seed (receipt)  = 1.3856
    f_Y(30 -> 300) inside M1, yearlyMs   = 1.2333

Directly measured seed effect at a FIXED 30-year horizon, 4 settlements, both lit:
`w0-soak` 0.4585 vs M1's own first 30 years 0.6339 — **×1.383**, i.e. as large as the entire claimed
horizon term. The two terms in `rate(S,Y)` are mutually confounded, not merely un-crossed.

### 6.3 MEDIUM — `rate(4,300)` seed B = **0.8051** IS NOT "the 600-year world's own first 300 years, from `yearlyMs`"
`sum(yearlyMs[1..300]) = 938,161 ms → /1200 = 0.7818 s/sy`, which is the figure the receipt itself
prints in its own prefix table. 0.8051 reproduces only as
`(938,161 + 28,002)/1200 = 0.8051` — the first three centuries' `yearlyMs` **plus the whole
600-year run's entire non-yearly overhead**. The stated provenance is therefore incomplete, and the
receipt carries two different numbers for one quantity. Consequence for the "seed spread":

    +26.7 %  (0.8051 / 0.6352) — the receipt's basis, overhead-loaded on one side only
    +25.0 %  (0.6254 / ... yearlyMs on both sides)
    +23.1 %  (0.7818 / 0.6352) — the receipt's own prefix figure against §907's run A

### 6.4 MEDIUM — THE THREE SUB-FLOOR EXCURSIONS ARE A DECADE ARTEFACT; ANNUALLY THERE ARE NINE
The receipt names "y200–y280 (min 0.4843 at y230), y360–y390 (min 0.5405) and y470 (0.5922) — three
dips". Read at ANNUAL resolution (probe5.mjs) the runs below 0.6 are:

    y66 (0.576) · y200 (0.5625) · y208-y284 min 0.4612 at y219 · y325 (0.5566) ·
    y335-y338 min 0.5962 · y355-y388 min 0.5197 at y355 · y390-y394 min 0.5786 ·
    y433 (0.5845) · y463-y477 min 0.561 at y463

Nine runs, not three; the deepest dip reaches **0.4612**, not 0.4843; the second **0.5197**, not
0.5405; the third **0.561**, not 0.5922. "From y480 to y600 continuously in-window" DOES hold — the
last sub-floor year is 477. The decade table it was read off is honest about being decadal; the
receipt's prose is not.

### 6.5 LOW–MEDIUM — soak-c "has trebled since year 300 (231 → 305)"
305/231 = **×1.32**. Not trebled. The parenthetical refutes the word it explains. (The drift figure
0.3203 is right; it looks like the drift was read as a multiple.)

### 6.6 LOW–MEDIUM — "it holds ~17,500 souls where the other holds ~12,000–15,500"
Measured realm population, mean over the first century: M1 **16,892** vs §907's world **8,713**
(×1.94); over 300 years 15,894 vs 8,897 (×1.79); §907's full range is **6,635–20,501**, not
12,000–15,500. The level gap in COST is ×1.26 while the level gap in POPULATION is ×1.79–1.94, so
population level is not a proportional explanation of the cost gap. The RULING (levels differ,
multipliers agree) stands; the MECHANISM offered for it is unmeasured.

### 6.7 LOW — "the drift collapses from ±0.12–0.19 to ±0.01–0.02"
The four pre-y300 Δ50y values are +0.1008, −0.1853, −0.0411, +0.1229 — two of the four lie outside
the quoted ±0.12–0.19. The post-y300 three are 0.0123, 0.0087, 0.0128 (one below 0.01). The
collapse is real; the ranges are selective.

### 6.8 LOW — "ENTERS AT YEAR 10"
At decade granularity, yes. At ANNUAL granularity the load is inside the window from **year 1**
(0.898). Same for "last decade outside 470": annually the last outside year is **477** (0.5998).

## 7. WHAT THE ALTERNATIVE PAIRING DOES TO THE HEADLINE PRICE
Using only `realm-scale-research-lit-4s-*` seeds and `yearlyMs` throughout:
`rate(12,30) = 0.6742` × `f_Y(30→300) inside M1 = 1.2333` ⇒ `rate(12,300) ≈ 0.8315 s/sy`
⇒ run A ≈ 2,993 s; A+B ≈ 5,986 s ≈ **1.66 h** lit; × 1.1094 ⇒ **1.85 h** dark; **≈ 3.5 h total**.
Against the receipt's 4.0–5.1 h. **C2's DIRECTION survives — the ≈ 35 h design ask is still an order
out — but the band 4.0–5.1 h is not the band the evidence fixes.**

## 8. WHAT REPRODUCED WITHOUT A SCRATCH
Every capacity-row verdict (`deterministicFirings 4`, `fullInstrument true`, `notExecutable []`,
`observability` empty, the four plateau findings verbatim, floor_thaw/realm_load/envelope silent);
the dark twin's `deterministicFirings 0` and four NOT-APPLICABLE-by-gate rows; the four plateau
drifts 0.1554 / **0.0502** / 0.3203 / 0.4615 against `pops[mid=index 299]` — soak-b's hairline
0.0002 margin is real; `settlementShapeOf` agreeing on both derivations; the log assertions
(21,124 → 17,537 ×0.83; max 2.93 MB < 3.60 MB; 75,790 → 93,543 dark vs 75,790 → 30,641 lit);
`seedIndices: [1]` on both profiles; the tripwire and register line citations; the design's ≈ 35 h
(17.6 + 17.6) in the ledger; 9.3× / 7×–9× / 0.4360 / 0.5449 / 0.4787.
