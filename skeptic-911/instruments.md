# SKEPTIC — §911 / CAP-HORIZON-909 — LENS: THE INSTRUMENTS
Seat: Opus 5 — Fable-unvalidated. READ-ONLY on every tree. Dock porcelain 0 before, 0 after;
dock HEAD 3b1c0eaa51f77561a036ae7ec54682c39856192c unmoved.
Every figure below comes from a command executed in this session under
`skeptic-911/` (`probe.mjs`, `probe2.mjs`, plus inline `node -e`), importing the dock's
`evaluate.mjs` / `register.mjs` / `tripwires.mjs` read-only.

## (b) THE PRODUCT'S OWN EVALUATOR, RE-RUN — ALL CONFIRMED
`evaluateReceipt(horizon-600y-4s-lit.json)`:
  deterministicFirings 4 · fullInstrument true · notExecutable [] · observability n=0
  four findings, all `capacity_plateau`, byte-for-byte the receipt's four strings.
  ROW capacity_plateau      gate=true horizonReq=150 observed=600 → 4
  ROW capacity_floor_thaw   gate=true horizonReq=100 observed=600 → 0 (SILENT)
  ROW capacity_realm_load   gate=true                             → 0 (SILENT); y600 loadRatio01 0.7251
  ROW capacity_envelope_30y gate=true horizonReq=30  observed=600 → 0 (SILENT)
`evaluateReceipt(probe-30y-12s-dark.json)`: deterministicFirings 0, fullInstrument true,
notExecutable [], observability 0; all four capacity rows `gate=false`. NOT APPLICABLE by gate.
⇒ headline 1 and the four-row table CONFIRMED, reproduced independently.

## ⛔ AN OMISSION THE EVALUATOR EXPOSES (new)
`evaluateReceipt(probe-30y-12s-lit.json)`: deterministicFirings **1** —
`capacity_realm_load: realm load 0.4360 outside the plateau window` — plus **2** observability
rows (plateau and floor_thaw inconclusive at 30/150 and 30/100). The receipt reports the DARK
twin's evaluation in full and never reports the LIT probe's. That 0.4360 is a third lit
reading of `loadRatio01`, outside the window, and it sits in the same section that argues the
0.4787-vs-0.6443 spread is a SEED fact.

## (a) THE TWO PLATEAU DEFINITIONS
Source, `tripwires.mjs` capacity_plateau: `last = pops.length-1` (599), `mid = Math.floor(last/2)`
(299) — a 300-year window on this run; operator `Math.abs(yLast - yMid) / yMid > 0.05`, **strict
`>`, denominator `yMid`**.
Source, `register.mjs settlementShapeOf`: CENTURY 100, HALF_CENTURY 50, PLATEAU_FLATNESS 0.05;
`centuryAgo = values[len-1-100]` — **absolute 100 entries**; test
`Math.abs(final - centuryAgo) <= Math.abs(final||1) * 0.05`, **denominator `final`**.

Recomputed from `yearlyPopulations` (pops[299]=[12186,2968,231,65], pops[599]=[14080,3117,305,35]):
| settlement | drift (receipt) | drift (recomputed) | >0.05 | >=0.05 |
|---|---|---|---|---|
| soak-a | 0.1554 | **0.155424** | yes | yes |
| soak-b | 0.0502 | **0.050202** | yes | yes |
| soak-c | 0.3203 | **0.320346** | yes | yes |
| soak-d | 0.4615 | **0.461538** | yes | yes |
Shapes reproduced on BOTH derivations (yearlyPopulations columns and `deriveRegisterFigures`'s
stateVectors path): other / plateau / plateau / other. The lane's "the two derivations agree"
control reproduces.

**The operator question answered:** it is strict `>`, and 0.050202 convicts under `>` *and*
`>=`. soak-b's conviction is robust to the operator. The margin is **0.60 souls**: last=3117
convicts, last=3116 (drift 0.049865) does not.

⛔ **THE SECOND HAIRLINE THE RECEIPT DOES NOT FLAG, AND IT IS THE ONE ON THE `exact` PIN.**
soak-c's SHAPE is a **0.25-soul** hairline: |305-320| = 15 against a bar of 305 x 0.05 = 15.25.
Executed sensitivity: final 305 → `plateau`; final **304 → `other`**. One soul flips a figure the
register pins `exact`, which is a `shape_changed` register finding. R13 flags the 0.60-soul
tripwire hairline and is silent on the 0.25-soul one.

⛔ **THE MECHANISM IN R12/C4 IS INCOMPLETE.** The receipt says the two rows differ in their
WINDOW. They also differ in their DENOMINATOR — `yMid` (the earlier value) versus `final` (the
later value). On the same window and the same data the two can therefore still disagree
whenever the series moves materially. Naming only the window under-states the divergence.
(E3's other half checks out: `capacity_floor_thaw` uses `const from = last - 100` — absolute —
so within one file the plateau row is the horizon-relative outlier.)

## (c) THE REGISTER'S `exact` PIN — CONFIRMED
`register.mjs:170`: `figures[\`population.${id}.shape\`] = { value: shapes[id], direction: 'exact' };`
`register.mjs:35` documents `exact` as failing on inequality. Measured values on this receipt:
soak-a `other`, soak-b `plateau`, soak-c `plateau`, soak-d `other`, each `direction: "exact"`.

## (d) "THE REALM ENTERS THE WINDOW AT YEAR 10" — ⛔ REFUTED
Read per YEAR from `behavioral.yearly[k].realmDemography.loadRatio01` (600 finite readings of 600):
  year 1 **0.898** — already INSIDE [0.6, 1.05]. Years 1..10 are ALL inside.
  first year OUTSIDE the window: **year 66 (0.5760)**
  last  year OUTSIDE the window: **year 477 (0.5998)**
The realm does not enter at year 10; it **starts inside** and first leaves at year 66. "Year 10"
is an artifact of decade sampling (the first decade mark, trivially inside). The same artifact
runs through the excursion account:
  receipt: "three dips — y200-y280, y360-y390, y470 — min 0.4843 at y230"
  measured per-year OUT runs (nine): 66 · 200 · 208-284 · 325 · 335-338 · 355-388 · 390-394 ·
    433 · 463-477;  **true minimum 0.4612 at year 219** (0.4843 at y230 is only the decade min).
CONFIRMED halves: "ENTERS AND STAYS: NO"; y600 = 0.7251 inside and the row silent; "from y480 to
y600 continuously in-window" (true from y478).

## THE SETTLING TABLE — CONFIRMED EXACTLY
Realm totals from `yearlyPopulations` row sums, 50-year marks:
17696(50) 16143(100) 17948(150) 13429(200) 12501(250) 15450(300) 15154(350) 14986(400)
15424(450) 15925(500) 18050(550) 17537(600) — percent changes -8.8, +11.2, -25.2, -6.9, +23.6,
-1.9, -1.1, +2.9, +3.2, +13.3, -2.8: **five of six from y350 inside 5 %, none of the five
before**. Load at the marks: 0.6443 0.6320 0.6233 0.6361 0.6603 0.7444 0.7251 — all match.

⚠ **HEADLINE 2's DRIFT RANGES ARE NOT THE MEASURED RANGES.** Headline: drift "collapses from
±0.12-0.19 to ±0.01-0.02". Measured pre-y300 |Δ50y|: 0.0659, 0.1008, 0.1853, 0.0411, 0.1229 —
range **0.041-0.185**. Measured post-y300: 0.0123, 0.0087, 0.0128, 0.0242, 0.0841 — range
**0.009-0.084**. The body is honest ("three consecutive half-centuries", "one late excursion");
the headline drops both qualifiers and quotes ranges that neither period has.

## ⛔ A FIGURE THAT DOES NOT REPRODUCE: `rate(4,300)` seed B = 0.8051
The terminal-cell table sources it as "the 600-year world's OWN first 300 years, from yearlyMs".
Measured: `sum(yearlyMs[0..299]) = 938,161 ms` ⇒ **0.7818 s/settlement-year** — which is exactly
what the lane's own extract prints (`M1-600y-extract.txt:201`, "y300 938.2 s 0.7818") and what
the receipt's own prefix table prints. **0.8051 appears in no artifact on disk.** No prefix at
n=300 yields it (n≈341 would). Propagation: `rate(12,300)` top 0.8051x1.4820 = 1.1933 becomes
0.7818x1.4820 = **1.1586**; run A+B top 8,592 s becomes **8,342 s ≈ 2.32 h**; the dark top
≈ 2.57 h; **SOAK-1's ask ≈ 4.0-4.9 h, not 4.0-5.1 h**.
And the "+26.7 % seed spread" mixes instruments: 0.6352 is `runDurationsMs.primary/1200` (includes
per-run overhead), 0.7818 is a `yearlyMs` sum (excludes it). Like for like on `yearlyMs`,
§907's own sum is 750,436 ms ⇒ 0.6254, so the spread is **+25.0 %**; on the corrected pair
0.7818/0.6352 it is +23.1 %. Neither reading is +26.7 %.

## A WRONG WORD ON A LOAD-BEARING SENTENCE
"soak-c … has trebled since year 300 (231 → 305)". Measured **305/231 = ×1.3203** — up a third,
not trebled. The C4/E3 argument survives (×1.32 still exceeds the 5 % band) but the figure as
written is wrong.

## CONFIRMED WITHOUT QUALIFICATION
- §907's `loadRatio01` = **0.4787** at its year 300; the 600-year world's year 300 = **0.6443**;
  difference **0.1656** = **36.8 %** of the [0.6, 1.05] width. C3 stands.
- bounds "24,185 vs 25,674": measured 24,185 (600y, y600) and 25,674 (§907, y300).
- both profiles carry `seedIndices: Object.freeze([1])` (`realm-scale-certification.mjs`,
  'research-lit' and 'research-lit-4s').
- `runDurationsMs` {primary 2239561, replay 2230837, divergent 13819}; realm.ratio 0.8301931;
  runaway/floored/unlawfulZero/bifurcated all 0.
- the century cost table (2708.8 · 3154.6 x1.165 · 3518.2 x1.299 · 4045.1 x1.493 · 4333.9 x1.600 ·
  4355.0 x1.608) and the six prefix rates (0.6772 … 0.9215) reproduce exactly; §907's
  2147.6 / 2504.9 x1.166 / 2851.8 x1.328 reproduces exactly.
- `rate(4,300)` seed A 762,290/1,200,000 = 0.63524.
