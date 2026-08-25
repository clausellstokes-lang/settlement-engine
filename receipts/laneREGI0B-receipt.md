# lane TE-REG-I0b — THE TWO ORDERED INSTRUMENT REPAIRS — RECEIPT

ORDER: **ODQ §602.2**, after REG-1 §11.1 chartered the two questions to the chair.
SUBJECT: the REG-I0 legibility instrument set, `.../scratchpad/reg-instruments/`.
TIP RE-RECORDED AT: **`d1b32e339fdcdc8cf4647d71db980bce3d2f51d1`** (`refs/preserve/map-sandbox-reg1-fusion`),
verified `git rev-parse HEAD` in `laneREG1-tree` — clean but for untracked `node_modules/`.
⛔ NO REFS CREATED, NO REPO BYTES, NO MEMORY WRITES. Everything below is inside `reg-instruments/`
and this receipt. The chair re-preserves the set.

---

## §0 · THE HEADLINE

Both repairs landed and both are proved by differential. **The repaired F3 falls on all 17 leaves
that fuse and is a true null on the one that does not; the superseded figure rises on every one of
them.** All nine control batteries read LIVE, the two censuses read 0, and the pre-repair baseline
is preserved verbatim.

⛔ **AND THE FIRST HALF OF REPAIR 1 AS WORDED IS A NO-OP.** The order was to *"re-define the
numerator to count MASSES"*. Measurement says the numerator was **already** counting masses, and
the inversion lives in the denominator. That is §1.1 and it is the lane's main finding.

---

## §1 · REPAIR 1 — F3

### 1.1 ⛔⛔ THE ORDERED FIX, TAKEN LITERALLY, CHANGES NOTHING — MEASURED, NOT ARGUED

F3 was `SOLITARY / INTRAMURAL BODIES`, where `SOLITARY` counts **bodies alone in their component
of the closed mask**. Re-labelling that numerator "masses" moves no digit, because **a body alone
in its component IS a component holding exactly one body** — the same integer by construction.

Executed, city, at the resolved grid 4600:

| | drawn bodies | `solitaryBodies` | components holding exactly 1 body | F3 |
|---|---|---|---|---|
| dormant base | 2,045 | **133** | **133** | 0.0652 |
| fused tip | 1,717 | **140** | **140** | 0.0818 |

Every candidate that kept a **unit-count denominator** inverted the same way when measured, and I
measured them rather than reasoning about them (`probeCand.mjs`, city, base → tip):

| candidate | base → tip | verdict |
|---|---|---|
| `solitaryBodies / bodies` (the shipped one) | 0.0652 → 0.0818 | ⛔ inverts |
| `masses / bodies` | 0.4880 → 0.5556 | ⛔ inverts |
| area in single-body masses / total area | 0.2872 → 0.2972 | ⛔ inverts, and non-monotone on the ladder |
| area in blocks-of-one / total area | 0.2340 → 0.2397 | ⛔ inverts, non-monotone |
| masses alone in their block / masses | 0.2014 → 0.2138 | ⛔ inverts |

⭐ **THE CLASS, and it is general: a population of DRAWN UNITS is not conserved under generative
fusion, so no fraction taken over it can measure fusion.** Replacing k members with one mass
deletes k−1 subpaths — **city 2,045 → 1,717 drawn bodies, −16.0 %** — so any per-body fraction
rises whether or not the drawing improved.

**What fusion does not move is the ink.** Measured at city: building fill **117,452.4 → 117,884.7
sq units, +0.37 %** (the party-gap slivers it swallows); the whole built mask 142,862.8 →
142,794.2, **−0.05 %**. Village: 8,339.2 → 8,443.3, +1.25 %.
**Area is the conserved denominator; a count of units is not.**

### 1.2 THE SHIPPED FORMULA

```
freestandingDensity = MASSES / INTRAMURAL BUILDING-INK AREA          (per 1,000 sq view units)

  NUMERATOR    MASSES — one connected component of the drawn building+landmark fill: one
               connected FUSED UNIT, whatever number of holdings it holds and however it came to
               be fused. Each mass is placed intramuros by ITS OWN centroid, so it is counted
               once and lands where its bulk is.
  DENOMINATOR  the square view units of that same ink inside the circuit — printed in words on
               every row as `denominator`, e.g. "119172.21 sq view units of building ink in
               intramuros (the model's own walls[].closedPolygon), carrying 988 connected masses".
```

`meanMassFootprintUnits2` is the same measurement read the other way up and is reported beside it.

**Two improvements the order did not ask for, both stated rather than smuggled:**

1. **F3 no longer reads through the closing radius.** The old SOLITARY test was taken in
   `close(built, FUSE_R)` — a 1.25-unit close at city, which REG-1 §4 measured spanning ≤ 2.5 u
   and therefore bridging SLOTS (1.00 u) and PACKING WEDGES (1.35 u), gaps `decideGap` gave a
   reason and the charter says must remain. **No F3 figure now depends on a radius that fuses
   what the law forbids fusing.**
2. **F3 measures BUILDING ink, not `built`.** `built` carries YARDS, because REG-0's probes front
   on a yard wall as readily as on a roof and F1/F2 are lifted verbatim — but a filled toft glues
   neighbouring roofs into one component through ground that is not built at all. `bodyInk` is a
   NEW, SEPARATE mask. **Verified: no F1/F2 figure moved** (§4.2).

`supersededFraction` carries the old reading on every row, labelled, so the two baseline files
reconcile. It is not a verdict figure.

### 1.3 DIFFERENTIAL A — THE SEALED FUSION TIP NOW IMPROVES, ON EVERY LEAF

The full table is §3. The two ends of it:

| leaf | REPAIRED density base → armed | Δ | SUPERSEDED fraction base → armed | Δ |
|---|---|---|---|---|
| **city** | 8.2905 → **7.9264** | **−4.4 %** | 0.0652 → 0.0807 | **+23.8 %** ⛔ |
| **mountain** | 8.9921 → **8.5065** | **−5.4 %** | 0.0918 → 0.1169 | **+27.3 %** ⛔ |
| **hamlet** | 9.1600 → **8.9314** | **−2.5 %** | 0.1346 → 0.2444 | **+81.6 %** ⛔ |
| **town-2** (weakest) | 7.1302 → **7.0600** | **−1.0 %** | 0.0547 → 0.0653 | **+19.4 %** ⛔ |
| **thorp** | 2.8647 → 2.8647 | **0** | 0.25 → 0.25 | 0 |

⭐ **THE THORP IS A TRUE NULL, NOT A DEAD ARM.** REG-1 §3 recorded that no thorp run reached two
party-walled holdings, so the leaf has **0 masses fused**; the instrument reports 0 rather than
inventing motion, and the other 17 rows prove the arm is live.

### 1.4 DIFFERENTIAL B — THE UN-FUSE MUTATION MOVES IT THE RIGHT WAY, MONOTONICALLY

REG-1's own M1 ladder, re-read through the repaired F3 (`ladderF3.mjs`). Rungs un-fuse
progressively more runs; the bottom rung un-fuses ALL.

**CITY** (N=4600, model circuit):

| rung | masses | ink | **DENSITY** | meanFootprint | superseded |
|---|---|---|---|---|---|
| LAW (fused tip) | 946 | 119,347.54 | **7.9264** | 126.16 | 0.0807 |
| un-fuse 1 | 946 | 119,341.30 | **7.9268** | 126.15 | 0.0804 |
| un-fuse 20 | 966 | 119,059.03 | **8.1136** | 123.25 | 0.0769 |
| un-fuse 60 | 969 | 118,982.23 | **8.1441** | 122.79 | 0.0731 |
| un-fuse ALL | 988 | 119,172.21 | **8.2905** | 120.62 | 0.0652 |
| **DORMANT BASE** | **988** | **119,172.21** | **8.2905** | **120.62** | **0.0652** |

**TOWN** (N=5800): LAW 11.4135 → 11.4141 → 11.4705 → 11.5288 → **11.6969 = base 11.6969**.
**VILLAGE** (N=2200): LAW 9.5954 → 9.7082 → 9.9497 → 9.9497 → **9.9497 = base 9.9497**.

Three things this proves and one it discloses:

- **Monotone in the right direction**: un-fusing RAISES the density toward the freestanding base.
- **The bottom rung returns the leaf to the dormant base's own figures to the digit** on all
  three leaves — masses, ink, density and mean footprint all identical.
- **The corpus render cross-checks the mutation harness**: `on-out/<leaf>` and `mut/<leaf>-m1-0`
  return byte-equal figures on all three leaves, so the two paths to "armed" agree.
- ⚠ **DISCLOSED: on the village the 20-, 60- and ALL-rungs are identical (9.9497).** That is not a
  dead instrument — the village has only 40 runs and 18 masses, so un-fusing 20 runs already
  un-fuses every mass. The `un-fuse 1` rung moves (9.5954 → 9.7082), which is what keeps the arm
  live. This is REG-1 §8's own recorded class — *a mutation must be scaled to the resolution of
  the instrument that judges it* — arriving from the other side.

---

## §2 · REPAIR 2 — THE GRID

### 2.1 THE RULE, ADOPTED VERBATIM FROM REG-1 §4b (recorded before any figure was measured through it)

```
partyGap = plotFrontage × 0.035                 ← PLOT_SHAPE.partyGap, the law's own value
N        = the smallest multiple of 200 whose cell 1000/N is ≤ partyGap, capped at 6400
```

It is now the **DEFAULT** in `masksFor()` and on the CLI. `--grid=<N>` still overrides.
`--reg0compat` **PINS 1400**, because REG-0's published figures were measured through that cell
and a compatibility mode that quietly re-gridded would report "REPRODUCED" while differing.

Resolved N by leaf, from the run: thorp 1200 · hamlet 2200 · village 2200 · town-2 4200 ·
city/migration 4600 · metropolis 5200 · highwater 5400 · crossing 5600 ·
town/siege/plague/famine/year-018/year-100 5800 · fjord 6000 · polycentric 6200.
**No leaf reaches the cap.**

### 2.2 THE DIFFERENTIAL — ASSERTED FROM THE NUMBERS, NOT THE PROSE

From `i6-frontage.mjs --controls`, verbatim:

```
── NEGATIVE · the grid must resolve the leaf's own party gap, and 1400 must not
   gap=0.2188u   1400 cell=0.7143 resolves=false   4600 cell=0.2174 resolves=true
   base at 1400  runs=1714 meanRun=11.21 masses=611
   base at 4600  runs=1934 meanRun=10.32 masses=799
```

⭐ **The third line is the one that matters: the BASE's own figures move with the grid.** Proving a
zero is harder than proving a positive because identical readings are what a dead instrument
returns, so the control asserts the MOVE as well as the two predicates. All three arms read `ok`.

### 2.3 ⭐ AND THE REPAIRED INSTRUMENT REPRODUCES REG-1's §4b TABLE TO THE DIGIT

An independent oracle: REG-1 measured the same leaves by driving the *unrepaired* instrument's
`--grid` knob by hand. My defaulted grid reproduces every published row exactly.

| leaf | N | meanRun b→a | fronting masses b→a | runs b→a | vs REG-1 §4b |
|---|---|---|---|---|---|
| city | 4600 | 10.32 → 10.71 | 813 → 770 | 1978 → 1899 | **REPRODUCES** |
| village | 2200 | 15.05 → 15.59 | 73 → 70 | 174 → 168 | **REPRODUCES** |
| town | 5800 | 10.65 → 10.73 | 598 → 589 | 1574 → 1562 | **REPRODUCES** |
| metropolis | 5200 | 9.66 → 9.77 | 1190 → 1174 | 2619 → 2589 | **REPRODUCES** |
| fjord | 6000 | 10.66 → 10.85 | 624 → 610 | 1502 → 1477 | **REPRODUCES** |

### 2.4 REPRODUCTION AT THE PINNED LEGACY GRID IS UNHARMED

```
   city     REPRODUCED   probes 38696 · fronted 19186 · ratio 0.4958 · runs 1709 · meanRun 11.22 · masses 609
   village  REPRODUCED   probes 3948  · fronted 2576  · ratio 0.6525 · runs 176  · meanRun 14.66 · masses 68
```

---

## §3 · THE NEW BASELINE — `out/baselines.json` AT `d1b32e339`, ALL 18 EXEMPLAR LEAVES

Every figure carries its denominator; the `denominator` string is on every row in the file.
`base` = DORMANT (**the baseline**). `armed` = the differential, never the baseline.

| leaf | tier | N | cell / gap | masses b→a | ink b→a (sq units) | **DENSITY b→a** | **Δ%** | meanFoot b→a | scope |
|---|---|---|---|---|---|---|---|---|---|
| thorp | thorp | 1200 | 0.8333 / 0.910 | 6 → 6 | 2,094.44 → 2,094.44 | **2.8647 → 2.8647** | **0** | 349.07 → 349.07 | drawing-derived |
| hamlet | hamlet | 2200 | 0.4545 / 0.477 | 44 → 43 | 4,803.51 → 4,814.46 | **9.1600 → 8.9314** | **−2.5** | 109.17 → 111.96 | drawing-derived |
| village | village | 2200 | 0.4545 / 0.481 | 101 → 98 | 10,151.03 → 10,213.22 | **9.9497 → 9.5954** | **−3.6** | 100.51 → 104.22 | drawing-derived |
| town | town | 5800 | 0.1724 / 0.173 | 770 → 754 | 65,829.19 → 66,062.22 | **11.6969 → 11.4135** | **−2.4** | 85.49 → 87.62 | model circuit |
| town-2 | town | 4200 | 0.2381 / 0.242 | 701 → 696 | 98,313.66 → 98,584.24 | **7.1302 → 7.0600** | **−1.0** | 140.25 → 141.64 | model circuit |
| **city** | city | 4600 | 0.2174 / 0.219 | 988 → 946 | 119,172.21 → 119,347.54 | **8.2905 → 7.9264** | **−4.4** | 120.62 → 126.16 | model circuit |
| metropolis | metropolis | 5200 | 0.1923 / 0.194 | 1598 → 1574 | 150,502.88 → 150,881.10 | **10.6177 → 10.4321** | **−1.7** | 94.18 → 95.86 | model circuit |
| polycentric | town | 6200 | 0.1613 / 0.165 | 779 → 757 | 49,166.52 → 49,334.83 | **15.8441 → 15.3441** | **−3.2** | 63.11 → 65.17 | model circuit |
| highwater | town | 5400 | 0.1852 / 0.186 | 727 → 721 | 95,820.27 → 96,146.91 | **7.5871 → 7.4989** | **−1.2** | 131.80 → 133.35 | model circuit |
| mountain | village | 2400 | 0.4167 / 0.420 | 66 → 63 | 7,339.76 → 7,406.08 | **8.9921 → 8.5065** | **−5.4** | 111.21 → 117.56 | drawing-derived |
| fjord | town | 6000 | 0.1667 / 0.169 | 834 → 818 | 73,372.44 → 73,559.06 | **11.3667 → 11.1203** | **−2.2** | 87.98 → 89.93 | drawing-derived |
| siege | town | 5800 | 0.1724 / 0.173 | 770 → 754 | 65,829.19 → 66,062.22 | **11.6969 → 11.4135** | **−2.4** | 85.49 → 87.62 | model circuit |
| plague | town | 5800 | 0.1724 / 0.173 | 770 → 754 | 65,829.19 → 66,062.22 | **11.6969 → 11.4135** | **−2.4** | 85.49 → 87.62 | model circuit |
| famine | town | 5800 | 0.1724 / 0.173 | 770 → 754 | 65,829.19 → 66,062.22 | **11.6969 → 11.4135** | **−2.4** | 85.49 → 87.62 | model circuit |
| migration | city | 4600 | 0.2174 / 0.219 | 988 → 946 | 119,172.21 → 119,347.54 | **8.2905 → 7.9264** | **−4.4** | 120.62 → 126.16 | model circuit |
| year-018 | town | 5800 | 0.1724 / 0.173 | 840 → 825 | 72,261.56 → 72,511.56 | **11.6244 → 11.3775** | **−2.1** | 86.03 → 87.89 | drawing-derived |
| year-100 | town | 5800 | 0.1724 / 0.173 | 840 → 825 | 72,252.94 → 72,502.94 | **11.6258 → 11.3788** | **−2.1** | 86.02 → 87.88 | model circuit |
| crossing | town | 5600 | 0.1786 / 0.185 | 772 → 750 | 76,924.52 → 77,181.54 | **10.0358 → 9.7173** | **−3.2** | 99.64 → 102.91 | model circuit |

**SUPERSEDED (inverting) figure on the same rows**, so the two files reconcile:
thorp 0.25→0.25 (0 %) · hamlet 0.1346→0.2444 (**+81.6 %**) · village 0.1655→0.2243 (+35.5 %) ·
town/siege/plague/famine 0.1282→0.1740 (+35.7 %) · town-2 0.0547→0.0653 (+19.4 %) ·
city/migration 0.0652→0.0807 (+23.8 %) · metropolis 0.0661→0.0828 (+25.3 %) ·
polycentric 0.1812→0.2436 (+34.4 %) · highwater 0.0938→0.1255 (+33.8 %) ·
mountain 0.0918→0.1169 (+27.3 %) · fjord 0.1475→0.1990 (+34.9 %) ·
year-018/year-100 0.1226→0.1667 (+36.0 %) · crossing 0.1309→0.1884 (**+43.9 %**).

⚠ **`scope` differs between year-018 (drawing-derived) and year-100 (model circuit), and that is
the epoch, not a defect** — i10 reports year-018 with **0 rings** and year-100 with **1**. The six
drawing-derived rows are exactly the six leaves i10 counts as unwalled (thorp, hamlet, village,
mountain, fjord, year-018). Named on every row rather than left to be inferred.

**Also re-recorded at the new tip:** i2 route-trace and i3 chunking for **all 18 leaves**
(was 3), the two censuses, and the no-drift trace.

---

## §4 · WHAT MOVED, AND WHAT PROVABLY DID NOT

### 4.1 THE TWO BASELINE FILES

`out/baselines-ee0db96d3.json` is the pre-repair record, **created by `cp -n`, byte-identical to
the file this lane received (99,223 B), and never opened for writing.** `out/baselines.json`
(148.2 KB) is the new record.

### 4.2 CONTAINMENT — DIFFED JSON TO JSON, NOT JSON TO LOG

| block | result |
|---|---|
| i1 squint, i4 salience + decoy control, i5 role contrast, i7 hue — **25 blocks over 5 plates** | **IDENTICAL** |
| i6 `reg0Compat` (pinned 1400, unchanged code path) — 5 plates | **IDENTICAL** |
| i2 + i3 for city / village / town | **IDENTICAL** |
| the two censuses | **IDENTICAL** |
| i8 no-drift trace | **line numbers only** — see below |

### 4.3 ⚠ THE THINGS THAT MOVED, VERBATIM

1. **`noDriftTrace` line numbers, +51 on 16 rows** (e.g. `rows.15.line: 1147 → 1174`), and
   `rendererLines: 1950 → 2001`. **Cause: the worktree, not the instrument** — the baseline now
   reads `laneREG1-tree/harness/renderFolio.mjs` at `d1b32e339` instead of
   `reg0/w3f-tree/...` at `ee0db96d3`, and REG-1 added 51 lines. **The roster is unchanged**:
   `opClasses 31`, `tableRows 31`, `traced 28`, `driftJustified 3`, `untracedMisses 0`,
   `staleTableRows []`, `pass true`, `byReference {watabou 10, ftg 10, corpus 25, DRIFT 3}` —
   every one identical to the prior record.
2. **i6's own `--controls` POSITIVE/NEGATIVE/SHATTER arms now report different numbers**, because
   those arms now run at the resolved 4600 instead of 1400. **DECLARED ONE-TIME SHIFT, caused by
   R2 and by nothing else.** The base arm reads `ratio=0.5187 runs=1934 meanRun=10.32 masses=799`
   where it read the 1400 figures before. Every arm still passes, and the REPRODUCTION arm is
   pinned and unmoved.
3. **The BASE plates' `i6.asDrawn` block (at 1400) was REMOVED**, deliberately: two different
   grids under one instrument's name is the confusion R2 exists to end. Its successor is
   `i6Corpus.rows[].base` at the resolved grid; the 1400 anchor survives as `i6.reg0Compat`; and
   the removed block stands verbatim in the preserved prior file. The SPEC plates keep their
   `asDrawn` (at the resolved grid) because the specimen svg is not in the corpus sweep.

### 4.4 ⛔⛔ THE SURPRISE, AND IT IS A FINDING RATHER THAN A FIX — A STALE LOG THAT CONVICTS AN INNOCENT LANE

`out/baselines.log` is timestamped **12:42:02**. `i1-squint.mjs` (**12:44:51**),
`i5-role-contrast.mjs` (**12:45:05**) and `i7-ftg-colour.mjs` (**12:45:57**) were edited AFTER it,
and `baselines.json` was written at **12:46**. **The log describes code that no longer existed
when the baseline it appears to document was recorded.**

| plate | the old `.log` claims | the old **JSON** records | my new **JSON** records |
|---|---|---|---|
| BASE-village | `squint=FAIL hue=FAIL` | **PASS / PASS** | **PASS / PASS** |
| BASE-town | `squint=FAIL` | **PASS** | **PASS** |
| SPEC-village | `squint=FAIL contrast=FAIL hue=FAIL` | **PASS / PASS / PASS** | **PASS / PASS / PASS** |

I nearly filed this as "three pixel instruments moved under my repair". They did not: **old JSON
and new JSON agree on all five plates.** ⭐ **THE CLASS — this programme's own standing law in a
new costume: an exit status captured before the last edit is a status about different code, and a
LOG IS AN EXIT STATUS THAT OUTLIVES THE RUN.** Compare artifact to artifact, never artifact to log.

**I did not touch the file** — the bytes are history and the misleading thing is its *name*, which
reads as "the log of `baselines.json`". Renaming another lane's artifact is not in this lane's
grant, so it is **flagged for the chair** and written up in `INSTRUMENTS.md` beside the baseline
table. **Recommendation: rename to `baselines-ee0db96d3-STALE-PRE-INSTRUMENT-EDIT.log`.**

---

## §5 · THE FULL INSTRUMENT SET, RUN ONCE — ALL CONTROLS LIVE, BOTH CENSUSES ZERO

```
I1_CONTROLS LIVE    I2_CONTROLS LIVE    I3_CONTROLS LIVE    I4_CONTROLS LIVE
I5_CONTROLS LIVE    I6_CONTROLS LIVE    I7_CONTROLS LIVE    I8_CONTROLS LIVE
I10_CONTROLS LIVE
```
(`out/controls-d1b32e339.log`; i2/i3/i8/i10 run against `--wt=laneREG1-tree`.)

**i6's battery is now 15 arms, all `ok`** — the 9 it had, plus three F3 arms and three grid arms:

```
   ok     F3: fusing the ink cuts the mass count
   ok     F3: fusing the ink cuts the density
   ok     F3: fusing the ink raises the mean mass footprint
   ok     GRID: the recorded 1400 does NOT resolve the city party gap
   ok     GRID: the resolved N DOES resolve it
   ok     GRID: the base's own figures MOVE between the two grids (the knob is live)
```

⭐ **F3 NEEDED ITS OWN POSITIVE ARM AND NOW HAS ONE.** Because F3 no longer reads through the
closed mask, the existing fusion arm could not exercise it — it would have had **no positive
control at all**, which is the lane's SECOND RULE failing silently. The new arm closes the
building ink at `FUSE_R` and asserts the three movements:
`as drawn masses=1043 density=8.4009 meanFootprint=119.04` → `ink fused masses=440 density=3.3114
meanFootprint=301.98`.

**THE TWO CENSUSES AT `d1b32e339`, all 18 leaves** (`out/i10-corpus-d1b32e339.log`):

```
CENSUS A · STRADDLE (law's predicate)  = 0 of 79 district regions, on 12 walled leaf/leaves of 18 measured
CENSUS A · cross-check (no band)       = 10 of 79
CENSUS B · OUTSIDE-CIRCUIT BODIES      = 0 of 15326 members (6083 suburb, 25001 drawn bodies across all leaves)
§240.1 hull vertices outside own ring  = 0
```

Identical to REG-1 §5's recorded figures, including the 10-of-79 cross-check baseline.

---

## §6 · FILES TOUCHED — ALL INSIDE `reg-instruments/`

| file | what |
|---|---|
| `i6-frontage.mjs` | R1 (F3 re-founded on masses over ink area; new `bodyInk` mask; `supersededFraction` kept labelled) · R2 (`resolvedGrid`/`partyGapUnits`/`gridReport`/`LEGACY_GRID`, default grid, `--reg0compat` pinned) · `--circuit=<json>` added · 6 new control arms. **Syntax-checked: `node --check` OK.** |
| `INSTRUMENTS.md` | index row 6 rewritten with numerator and denominator named · new section **THE TWO ORDERED REPAIRS TO i6** · subject re-pointed to `d1b32e339` · run-sheet updated · the two-baseline-files table · the stale-log warning · the three rejected holdings routes recorded under WHAT THIS SET DOES NOT MEASURE |
| `run-baselines.mjs` | re-pointed to `laneREG1-tree` / `d1b32e339` · i6 now runs **per leaf in its own subprocess** (36 masks at up to 6,200² in one heap is how a recorder dies half-written) · new `i6Corpus` block over all 18 leaves, dormant vs armed · model instruments expanded 3 → 18 leaves · `circuitFor()` helper · a `repairs[]` block stating both repairs in the artifact itself. **Syntax-checked: `node --check` OK.** |
| `out/baselines-ee0db96d3.json` | **NEW** — the pre-repair file, `cp -n`, untouched thereafter |
| `out/baselines.json` | re-recorded, 58.2 KB → 148.2 KB |
| `out/controls-d1b32e339.log`, `out/i10-corpus-d1b32e339.log`, `out/baselines-d1b32e339.log` | **NEW** — the run records |
| `out/i6-controls.json`, `out/i{1,2,3,4,5,7,8,10}-controls.json`, `out/i10-corpus.json` | rewritten by their own `--controls` runs |
| `renders/base/` + `renders/armed/` (18 SVGs + manifest each), `renders/circuits/` | **NEW, 13 MB** — see the judgment call J-I0B-4 |

⛔ **Nothing outside `reg-instruments/` was written except this receipt.** No refs, no repo bytes,
no memory writes. The probe scripts used to settle the design (`probeSubdiv.mjs`, `probeF3.mjs`,
`probeAreas.mjs`, `probeCand.mjs`, `sweepI6.mjs`, `ladderF3.mjs`, `dumpCircuits.mjs`) were written
into **this lane's own session scratchpad**, not into the preserved tree.

---

## §7 · JUDGMENT CALLS — ALL VETOABLE

| # | call | trace |
|---|---|---|
| **J-I0B-1** | The ordered numerator change is reported as a **NO-OP** and the denominator is changed instead. | The order's intent — *F3 must not invert on generative fusion* — is met; its literal wording is not, because measurement shows the wording cannot move a digit (§1.1). §441 J7: a charter's CONFIRMED row is a hypothesis. Nothing here changes the exit; the chair rules. |
| **J-I0B-2** | F3 becomes a **DENSITY, not a fraction**, and the field is renamed `freestandingDensity`. | No true 0..1 fraction exists over a conserved denominator without a HOLDINGS population, and all three routes to holdings were measured and rejected (§8.1). The lane's ONE RULE blesses a rate: *"the useful denominators here are populations rather than divisors"*. Keeping the name `freestandingFraction` on a figure that is no longer a fraction would be the worse lie. |
| **J-I0B-3** | F3 measures a new **building-only** mask rather than `built`. | A filled toft glues neighbouring roofs into one component through ground that is not built. Additive: `built` is untouched and F1/F2 are verified identical (§4.2). |
| **J-I0B-4** | The 18+18 parchment renders and the 12 circuit polygons are **staged inside `reg-instruments/`** (13 MB). | The baseline previously referenced the REG-1 lane's scratchpad, which is **not preserved**; the chair preserves `reg-instruments`. A baseline whose inputs vanish is not reproducible. `renders/base/city-city-parchment.svg` is sha256 `3449ace03d809add` — byte-identical to REG-0's own base plate, verified. |
| **J-I0B-5** | `--circuit=<json>` added to the CLI. | `freestanding()`'s own header calls the model circuit **PREFERRED** and the flood a fallback, yet no command-line reading could supply it — every CLI reading silently took the fallback. Closing that is a repair of the same kind as the two ordered. |
| **J-I0B-6** | The stale `out/baselines.log` is **left byte-untouched** and flagged rather than renamed. | Renaming another lane's artifact is outside this lane's grant; the trap is neutralised by documentation instead, and the rename is recommended to the chair (§4.4). |

---

## §8 · DEFERRED, WITH REASONS — DOCUMENTED, NOT BUGS TO RE-FIND

1. **HOLDINGS as a population is still unavailable from ink alone, and F3 no longer needs it.**
   Three routes measured and rejected, recorded in `INSTRUMENTS.md` so the next wave does not
   re-derive them: (a) **counting the drawn party lines is EXACT** — the tip emits exactly **320**
   at city, matching the fabric's own published `partyLines` count, and **0** on the base — but a
   purely geometric *"a stroke that cuts a filled body"* predicate over-collects, returning **540
   such strokes on the un-fused base** (206 roof ridges, 108 plot ticks, 86 back lines, 85
   block-fronts), so the count is recoverable only by keying on `stroke-linecap`/`stroke-opacity`,
   i.e. on one renderer's convention; (b) **inferring holdings from mass AREA fails** — the base's
   own building areas already run to ≥9× their median on 18 bodies at city, so no threshold
   separates a large building from a small terrace; (c) **taking holdings from the MODEL works**
   and has precedent (`circuitPoly`), but makes F3 unable to judge a drawing on its own. **If a
   later wave needs holdings, (c) is the honest route and must be NAMED on the row.**
2. **The pixel instruments still cover only the 5 plates that have rasters.** i6, i2, i3 and i10
   cover all 18. Rasters for the armed corpus exist only in the REG-1 lane's scratchpad and were
   not re-shot; REG-1 §5 holds those readings. Re-shooting 36 plates through headless Chrome is a
   render job, not an instrument repair, and was out of this lane's order.
3. **F3 has no BAND.** The index row still says *"REG-1 sets the target band; this lane records
   the baseline"*, and that is now doubly true: the figure changed units, so any band written
   against the old fraction is void. **The chair or REG-1 must set a band against the density.**
4. **`--fuse=0` no longer exercises F3.** F3 reads the ink as drawn, so the radius-zero negative
   control is now an F1/F2-only arm. That is why the new F3 positive arm was added (§5); the loss
   is stated rather than left for someone to discover as silent green.

---

## §9 · EXACT RE-RUN

```
I=.../scratchpad/reg-instruments
T=.../scratchpad/laneREG1-tree                # detached at d1b32e339

cd $I
node --max-old-space-size=14000 i6-frontage.mjs --controls          # 15 arms → I6_CONTROLS LIVE
for x in i1-squint i2-route-trace i3-chunking i4-landmark-salience \
         i5-role-contrast i7-ftg-colour i8-nodrift-trace i10-censuses; do
  node --max-old-space-size=8192 $x.mjs --controls --wt=$T
done
node --max-old-space-size=8192 i10-censuses.mjs --wt=$T --leaves=ALL   # both censuses → 0
node --max-old-space-size=14000 run-baselines.mjs                      # → out/baselines.json

# one leaf, by hand, at its own resolved grid with the model circuit:
node --max-old-space-size=12000 i6-frontage.mjs \
     --svg=$I/renders/armed/city-city-parchment.svg --frontage=6.25 \
     --circuit=$I/renders/circuits/city.json
```
