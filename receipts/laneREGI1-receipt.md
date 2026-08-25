# lane TE-REG-I1 — THE INSTRUMENTS CAR (ODQ §632.4's debts) — RECEIPT

**Seat:** Opus implementer. **Chair:** Fable (reviews, re-seals, runs the blind read).
**Rendered-corpus tree:** `$SP/laneREG4-tree`, HEAD **`7fba086d507de09de5586bd7ee7436a01abda002`** — the
REG-4 seal, used READ-ONLY. **Writable:** `$SP/reg-instruments`, `$SP/reg3work`.
`$SP` = `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad`

⛔ **NO SHIPPED `src/` BYTE WAS EDITED, no ref moved, no push, no memory write, and neither
`laneREG4-tree` nor `laneREG3-tree` was written to.** Everything below is either a new instrument
in `reg-instruments/`, a table row added to `i8`'s committed trace table, or a fixture regenerated
inside `reg3work`.

---

## THE LANE IS COMPLETE — ALL FIVE DELIVERABLES DISCHARGED

| # | deliverable | state |
|---|---|---|
| 1 | the seven i8 trace rows | ⭐ **DONE — 7 → 0, staleRows 0, three-row convicting control, byte-identical restore** |
| 2 | the owed i5 + i6 re-runs | ⭐ **DONE — i5 zero verdict regressions; i6 a DECLARED shift on 18 of 18 leaves, cause named** |
| 3 | the two synthetic liveness controls | ⭐ **DONE — `i11-branch-liveness.mjs`, 13 of 13 rows ok, both boundaries walked from both sides** |
| 4 | the ratchet-unit review | ⭐ **DONE — proposal table in §4.3; four findings, two alternatives rejected with reasons** |
| 5 | the warehouse fixture cure | ⭐ **DONE — 4 of 4 filled, every area verified > 0. ⛔ BUT THE CARVE-OUT'S PREMISE IS REFUTED — see §5** |

**FINAL VERIFICATION SWEEP, run after the last edit** (a check, not an edit, is the last act):
```
── i8                      traced=35  driftJustified=3  UNTRACED MISSES=0  staleRows=0   I8_PASS
── i8 controls             I8_CONTROLS LIVE
── i11                     I11_LIVE
── warehouse C2 controls   C2_CONTROLS LIVE
── REG-3 key untouched     sha256 1074d289…5be0a5   Aug 24 17:01:48 2026   4369 bytes
── laneREG4-tree           0 tracked modifications; HEAD 7fba086d507de09de5586bd7ee7436a01abda002
── laneREG3-tree           0 tracked modifications; HEAD 93fa8a2ca7c347c35aea94776dfeb7dc70bf0190
── shared repo             untouched — review-fixes-2026-07-08 @ 00f858d3e, never written to
```

---

# §1 · THE SEVEN i8 TRACE ROWS — **UNTRACED MISSES 7 → 0**

`i8-nodrift-trace.mjs`'s committed TRACE table now carries all seven. Provenance is stated per row
in the file itself:

| id | source | trace |
|---|---|---|
| `8r` `8x` `8f` `11r` | **VERBATIM** from `receipts/laneREG4-receipt.md` §7 | watabou+ftg+corpus · corpus · corpus · corpus+ftg |
| `12r` `13p` | **VERBATIM** from `receipts/laneREG3-receipt.md` §7 | corpus · corpus |
| `15r` | **AUTHORED THIS LANE** from REG-2's receipt §1/§3/§4 and the citations the shipped §15r block carries at its own use sites | watabou+corpus |

### The armed run

```
$ node i8-nodrift-trace.mjs --wt=$SP/laneREG4-tree
  traced=35  driftJustified=3  UNTRACED MISSES=0  staleRows=0
  by reference: watabou=12  ftg=12  corpus=32  DRIFT=3
  emitted <g id> groups (NOT the roster): precincts, yards, fabric, landmarks, legend
  B.flush ids in source: fields, squares
I8_PASS
```

Before the edit the same command reported `traced=28 driftJustified=3 UNTRACED MISSES=7
staleRows=0 … I8_FAIL`, and the seven were exactly `8r`(l.1120) `8x`(1173) `8f`(1198) `11r`(1535)
`12r`(1644) `13p`(1796) `15r`(2546) of `harness/renderFolio.mjs`.

### ⭐ THE CONVICTING CONTROL — three rows, one at a time, live file, byte-identical restore

A single removal proves one row; three prove the walker is not keyed to any one of them. Each row
was deleted **from the live table**, the instrument re-run, and the file restored from a hash-
verified backup:

```
=== ARMED (all seven rows present) ===
  traced=35  driftJustified=3  UNTRACED MISSES=0  staleRows=0
I8_PASS
=== CONTROL: '15r' REMOVED ===        (the row this lane AUTHORED)
  traced=34  driftJustified=3  UNTRACED MISSES=1  staleRows=0
I8_FAIL
=== CONTROL: '12r' REMOVED ===        (a row copied verbatim from REG-3)
  traced=34  driftJustified=3  UNTRACED MISSES=1  staleRows=0
I8_FAIL
=== CONTROL: '8f' REMOVED ===         (a row copied verbatim from REG-4)
  traced=34  driftJustified=3  UNTRACED MISSES=1  staleRows=0
I8_FAIL
=== RESTORED ===
  traced=35  driftJustified=3  UNTRACED MISSES=0  staleRows=0
I8_PASS
sha before=9620bfc13c2ec8e6933590bbd6aada09205cce1103b626925289c3230ea0aa96
sha after =9620bfc13c2ec8e6933590bbd6aada09205cce1103b626925289c3230ea0aa96
RESTORE: BYTE-IDENTICAL
```

**MISSES read exactly 1 in each control**, never 0 and never 2 — the count is per-row and the
walker sees each of the seven independently.

### The instrument's OWN controls, re-run after the table grew

```
BASE      opClasses=38 traced=35 driftJustified=3 misses=0 stale=0
PLANTED   opClasses=39 misses=1  [{"id":"99z","title":"⭐ A PLANTED OP CLASS THAT NOBODY TRACED","status":"UNTRACED"}]
TRIMMED   opClasses=37 stale=["15c"]
── LIVENESS
   ok     the base roster is fully traced
   ok     no stale table rows on the base
   ok     a planted op class raises the miss count by exactly one
   ok     a removed section is reported as a STALE table row
   ok     every DRIFT row carries a written justification
   ok     the roster is bigger than the emitted group set (groups are NOT the roster)
I8_CONTROLS LIVE
```

⭐ **THE DRIFT COUNT DID NOT MOVE: 3 before, 3 after.** All seven new rows trace to a reference;
none of them is a new drift. `15b` (the §10 state expressions), `4b` (the walk-scale rings) and
`4c` (the countryside event marks) remain the register's only three justified drifts.

### ⚠ THE ONE AUTHORING CALL, STATED SO IT CAN BE VETOED IN ISOLATION (`15r`)

REG-2 left no §7, so `15r` is the only row this lane wrote rather than carried. Two things in it
are judgment and both are on the record inside the row's own `why`:

1. **The wear marks are TRACED, not DRIFT.** `15b` is DRIFT because a fixed picture cannot express
   a settlement's *current condition* at all. Every §614.2 wear MARK, by contrast, is a ruin-
   grammar mark the corpus already draws — hf323's hatched-not-filled roofless ruin, hf379's later
   rungs, hf123's quarried rubble line. The truth layer chooses WHICH wall wears them; the corpus
   supplies the marks. That is a lawful trace, and the distinction is written into the row so a
   later reader does not have to re-derive it.
2. **The owner's approval is recorded but is NOT offered as the trace.** ODQ §598's *"Yes! I like
   that rampart"* (charter A3.3) ratifies the dress; L-REG-4 asks which reference a mark descends
   from, which is a different question. FTG is named as passed over rather than silently claimed.

---

# §2 · THE OWED i5 AND i6 RE-RUNS

## §2.0 · THE BASE COLUMN IS PROVED, NOT ASSUMED

Both arms were rendered fresh at the REG-4 seal from `laneREG4-tree`:

```
node harness/exemplars.mjs $SP/reg-instruments/renders/regI1-base
node harness/exemplars.mjs $SP/reg-instruments/renders/regI1-all --fuse --rampart --shapes --market --footprint
   → 18 SVG + manifest.json each, 29 files each
```

⭐ **THE UNARMED RENDER AT `7fba086d5` IS BYTE-IDENTICAL TO THE RECORDED BASELINE RENDERS AT
`d1b32e339`: `compared=18 identical=18 differ=0`.** Every BASE figure below is therefore directly
comparable to `out/baselines.json`, and `regI1-i6corpus.mjs` re-checks that claim numerically at
the end of its own run (below). This is the "absence decays silently" law paid rather than assumed.

## §2.1 · i6 · F3 — **A DECLARED INSTRUMENT-BASELINE SHIFT ON 18 OF 18 LEAVES**

`node regI1-i6corpus.mjs` — run-baselines.mjs's own protocol re-used verbatim (leaf's own party-gap-
resolving grid, `plotFrontage` off the render's own manifest, the model's own circuit, one
subprocess per leaf per arm).

```
── i6 · F3 FREESTANDING MASS DENSITY INTRAMUROS · BASE vs ALL WAVES ARMED, at the REG-4 seal
   (all five flags: --fuse --rampart --shapes --market --footprint)

  thorp         N=1200  density 2.8647 → 2.8628 (-0.1%)  masses 6→6 (0%)  ink 2094.44→2095.83 (0.1%)  meanFootprint 349.07→349.31 (0.1%)
  hamlet        N=2200  density 9.16 → 5.5142 (-39.8%)  masses 44→33 (-25%)  ink 4803.51→5984.5 (24.6%)  meanFootprint 109.17→181.35 (66.1%)
  village       N=2200  density 9.9497 → 5.5837 (-43.9%)  masses 101→62 (-38.6%)  ink 10151.03→11103.72 (9.4%)  meanFootprint 100.51→179.09 (78.2%)
  town          N=5800  density 11.6969 → 10.3168 (-11.8%)  masses 770→684 (-11.2%)  ink 65829.19→66299.58 (0.7%)  meanFootprint 85.49→96.93 (13.4%)
  town-2        N=4200  density 7.1302 → 6.4943 (-8.9%)  masses 701→645 (-8%)  ink 98313.66→99317.18 (1%)  meanFootprint 140.25→153.98 (9.8%)
  city          N=4600  density 8.2905 → 7.4461 (-10.2%)  masses 988→892 (-9.7%)  ink 119172.21→119794.47 (0.5%)  meanFootprint 120.62→134.3 (11.3%)
  metropolis    N=5200  density 10.6177 → 9.5392 (-10.2%)  masses 1598→1433 (-10.3%)  ink 150502.88→150221.71 (-0.2%)  meanFootprint 94.18→104.83 (11.3%)
  polycentric   N=6200  density 15.8441 → 13.8432 (-12.6%)  masses 779→697 (-10.5%)  ink 49166.52→50349.48 (2.4%)  meanFootprint 63.11→72.24 (14.5%)
  highwater     N=5400  density 7.5871 → 7.2993 (-3.8%)  masses 727→704 (-3.2%)  ink 95820.27→96447.43 (0.7%)  meanFootprint 131.8→137 (3.9%)
  mountain      N=2400  density 8.9921 → 6.7115 (-25.4%)  masses 66→52 (-21.2%)  ink 7339.76→7747.92 (5.6%)  meanFootprint 111.21→149 (34%)
  fjord         N=6000  density 11.3667 → 10.3421 (-9%)  masses 834→753 (-9.7%)  ink 73372.44→72809.08 (-0.8%)  meanFootprint 87.98→96.69 (9.9%)
  siege         N=5800  density 11.6969 → 10.3168 (-11.8%)  masses 770→684 (-11.2%)  ink 65829.19→66299.58 (0.7%)  meanFootprint 85.49→96.93 (13.4%)
  plague        N=5800  density 11.6969 → 10.3168 (-11.8%)  masses 770→684 (-11.2%)  ink 65829.19→66299.58 (0.7%)  meanFootprint 85.49→96.93 (13.4%)
  famine        N=5800  density 11.6969 → 10.3168 (-11.8%)  masses 770→684 (-11.2%)  ink 65829.19→66299.58 (0.7%)  meanFootprint 85.49→96.93 (13.4%)
  migration     N=4600  density 8.2905 → 7.4461 (-10.2%)  masses 988→892 (-9.7%)  ink 119172.21→119794.47 (0.5%)  meanFootprint 120.62→134.3 (11.3%)
  year-018      N=5800  density 11.6244 → 10.2988 (-11.4%)  masses 840→749 (-10.8%)  ink 72261.56→72727.2 (0.6%)  meanFootprint 86.03→97.1 (12.9%)
  year-100      N=5800  density 11.6258 → 10.2852 (-11.5%)  masses 840→748 (-11%)  ink 72252.94→72726.1 (0.7%)  meanFootprint 86.02→97.23 (13%)
  crossing      N=5600  density 10.0358 → 9.1546 (-8.8%)  masses 772→710 (-8%)  ink 76924.52→77556.35 (0.8%)  meanFootprint 99.64→109.23 (9.6%)

── BASE-COLUMN RECONCILIATION vs out/baselines.json (recorded at d1b32e339)
   ok     all 18 BASE rows reproduce the recorded baseline exactly

REGI1_I6 rows=18
```

### ⭐⭐ THE DECLARED SHIFT, WITH ITS CAUSE — and it is the CURE'S OWN SIGNATURE, not a defect

**F3 falls on 17 of 18 leaves (thorp is flat at −0.1 %, and thorp has 6 masses to move).** The
shape of the movement is the thing that identifies the cause, and all three components agree:

| component | direction | reading |
|---|---|---|
| **MASSES** (numerator) | **falls**, −3.2 % … −38.6 % | L-REG-30 FUSES sub-minimum bodies into neighbours and DROPS the unrescuable ones — fewer connected units of building ink |
| **INK AREA** (denominator) | **near-conserved**, −0.8 % … **+24.6 %** | a CLAMP adds ink where a DROP removes it; the net is small on the big leaves and positive on the small ones, where a single clamped body is a large share of the total |
| **MEAN MASS FOOTPRINT** | **rises**, +0.1 % … **+78.2 %** | the same ink in fewer, larger units — the §630 directive's *"no small one room blocks"*, measured |

⭐ **RECORD THIS AS A DECLARED INSTRUMENT-BASELINE SHIFT, CAUSE NAMED: L-REG-30 (`--footprint`),
with `--fuse` contributing the party-wall half.** It is not a regression and it must not be
re-recorded as a new baseline: `out/baselines.json`'s `base` column is still the baseline, and the
armed column is the differential, exactly as `i6Corpus.rows[].armed` already is.

⚠ **THE SMALL TIERS MOVE FURTHEST AND THAT IS WHERE THE TASTE RISK IS.** village −43.9 % and
hamlet −39.8 % against town −11.8 %: on a leaf with 44 masses, fusing eleven of them is a visible
re-drawing of the whole place. The mean footprint on village rises **+78.2 %** (100.5 → 179.1 sq
units). **This is a judging question for the chair's taste gate, not an instrument failure** —
F-C (`6 × INK.detail`) is REG-4's provisional floor and `--floor=F-A` is the lighter alternative
that is already measured (REG-4 §2 item 7).

### The denominator control — because a moving denominator would make the delta meaningless

```
$ node regI1-i6corpus.mjs --checkcircuit --wt=$SP/laneREG4-tree
── CIRCUIT CONTROL · does arming move the ring the F3 denominator is measured inside?
   town          verts  120→ 120  IDENTICAL      town-2        verts   96→  96  IDENTICAL
   city          verts   26→  26  IDENTICAL      metropolis    verts   22→  22  IDENTICAL
   polycentric   verts  116→ 116  IDENTICAL      highwater     verts   26→  26  IDENTICAL
   siege/plague/famine  verts 120→120  IDENTICAL  migration    verts   26→  26  IDENTICAL
   year-100      verts  120→ 120  IDENTICAL      crossing      verts  120→ 120  IDENTICAL
   (thorp · hamlet · village · mountain · fjord · year-018 — unwalled, no circuit either arm)
CIRCUIT_CONTROL walled=12 moved=0 — the base circuit is lawful on BOTH arms
```

This matters because REG-2 folded the §575 band regime INTO the existing `wallForm` declared input
rather than adding a key (its own §577 reason). Armed, that fold is a changed hash input and the
circuit COULD have moved. It does not — measured on all 12 walled leaves, zero vertices.

## §2.2 · i5 · ROLE-PAIR CONTRAST — **ZERO VERDICT REGRESSIONS**

`node regI1-i5contrast.mjs`. Each arm reads ITS OWN svg (masks) and ITS OWN png (colour); six
time-bounded Chrome shots at 2200 px, every one written and over the byte floor.

```
── town (town)
   pair                     floor    BASE       ARMED      Δ          verdict
   contrast.street:ground   >= 2.1   1.7529     1.8548     0.1019     FAIL → FAIL
   contrast.wall:all        >= 3     7.7536     4.2681     -3.4855    PASS → PASS
   contrast.water:ground    >= 1.35  1.5164     1.5291     0.0127     PASS → PASS
   PLATE: FAIL → FAIL

── city (city)
   contrast.street:ground   >= 2.1   1.8818     1.727      -0.1548    FAIL → FAIL
   contrast.wall:all        >= 3     7.2925     4.6529     -2.6396    PASS → PASS
   contrast.water:ground    >= 1.35  1.3168     1.1246     -0.1922    FAIL → FAIL
   PLATE: FAIL → FAIL

── village (village)
   contrast.street:ground   >= 2.1   1.9003     1.964      0.0637     FAIL → FAIL
   contrast.wall:all        >= 3     null       null       null       n/a → n/a   (unwalled)
   contrast.water:ground    >= 1.35  null       null       null       n/a → n/a   (dry)
   PLATE: FAIL → FAIL

── VERDICT REGRESSIONS: 0
REGI1_I5 NO_VERDICT_REGRESSION
```

**No pair that passed on the base fails armed.** The three base FAILs (`street:ground` on all
three leaves, `water:ground` on city) are the recorded pre-existing state at `d1b32e339` and are
not this arc's to move — REG-0's own charter row.

### ⛔⛔ BUT TWO MOVEMENTS INSIDE THE PASSES ARE WORTH THE CHAIR'S EYE, AND NEITHER IS A REGRESSION

1. **`wall:all` LOSES THREE QUARTERS OF ITS HEADROOM.** town 7.75 → 4.27 and city 7.29 → 4.65
   against a floor of 3.00 — headroom **4.75 → 1.27** and **4.29 → 1.65**. The cause is REG-2's
   rampart by construction: the circuit stopped being one dark stroke and became a BAND with a
   TONED WALK and a LIGHTER INNER PARAPET, so the wall role's mean luminance is paler and its
   ratio against the whole page falls. The floor still holds on both leaves. **Named because the
   next wave that softens or thins the circuit is the one that crosses it, and nobody would see
   that coming from a PASS→PASS row.**
2. **city `water:ground` widens its existing failure**, 1.3168 → 1.1246 against 1.35. It failed on
   the base too, so it is not a regression, but the armed arm moves it further out. i5's own
   header already rules that water is read by HUE and that i7's hue band is the real water test;
   **i7 was not re-run** (deferred with reason in §6) and that is the run that would settle it.

### ⭐⭐ AND REG-4's OWN STATED EXPECTATION FOR THIS RUN IS **REFUTED BY MEASUREMENT**

REG-4 owed i5 because *"the market furniture adds detail-weight ink inside the `square` role."*
Measured, the `square` element count does not move at all:

```
   town     ⭐ square 1→1 (+0)   detail 28→41 (+13)
   city     ⭐ square 1→1 (+0)   detail 25→40 (+15)
   village  ⭐ square 1→1 (+0)   detail 22→29 (+7)
```

The cause is J-REG4-7 itself — *"the register void's outline, the furniture, the fossils and the
faubourg districts each take their own `<g id>`"* — and the classifier was never told:

```
BASE  <g id>: fields, squares, yards, fabric, landmarks, legend, lettering, wardlabels, marginalia
ARMED <g id>: fields, squares, marketOutline, marketFossils, marketFurniture, yards, fabric,
              faubourgDistricts, landmarks, lettering, wardlabels, marginalia
```

`lib/classify.mjs`'s `inG()` chain knows `legend · lettering · wardlabels · marginalia ·
eventcaptions · fields · fabric · landmarks · yards · squares` and **none of the four new ones**.
There is a second, sharper edge on the same defect:

```
BASE  circles=3   rects=8  paths=263
ARMED circles=67  rects=3  paths=369        (+64 circles)
```

`classify.mjs` line 71 — `if (r.tag === 'rect' || r.tag === 'circle') { r.role = 'chrome'; }` —
runs **BEFORE every group test**, so all 64 new circles (the ringed step-circle market cross, the
conduit, the pond, the trough) are typed **PLATE CHROME**. The town census shows it directly:
`chrome 28→123 (+95)`.

⛔ **CONSEQUENCE, STATED PLAINLY: every pixel instrument that reads `lib/classify.mjs` — i1
squint, i5, i7 — currently counts REG-4's market register as chrome and background rather than as
drawing.** The figures above are still the honest reading of the instrument as it stands; they are
not the honest reading of the *picture*.

⭐ **NOT TUNED, AND DELIBERATELY SO (J-I1-3).** The cure is two lines — add the four group ids to
the `inG` chain, and move the `rect|circle` rule to AFTER the group tests — but it moves the role
masks on every plate and therefore every recorded i1/i5/i7 baseline, including the ones at
`d1b32e339` that four waves have been priced against. **That is a chair decision, and the measured
case for it is above.**

---

# §3 · THE TWO UNFIRED BRANCHES — **BOTH FIRE, AND BOTH BOUNDARIES ARE WALKED**

`i11-branch-liveness.mjs`. **No `src/` byte edited and nothing monkey-patched**: both shipped
modules are imported from the worktree exactly as the fabric imports them, and only the INPUT is
synthetic — built to each module's own declared input shape.

```
── ARM A · marketRegister.marketShapeFor → 'triangular'   (TRIG_N=1024, TRIANGLE_MIN_SEP=170.667 = 60°, MAJOR_SHARE=0.55)
   A1-lane      sep= 341 (119.883°) rank=lane  mouths=3 major=3  →  TRIANGULAR
   A1-high      sep= 341 (119.883°) rank=high  mouths=3 major=3  →  TRIANGULAR
        hf259 triangular green: three major roads meet (3 mouths in all), smallest separation 120° ≥ 70°
   A2-60deg     sep= 171 ( 60.117°) rank=lane  mouths=3 major=3  →  TRIANGULAR
   A2-59deg     sep= 168 ( 59.063°) rank=lane  mouths=3 major=3  →  CARVED
        hf259 carved square: 3 major of 3 mouths — the three major roads crowd one side

   SWEEP (sepIdx : shape)  160:c 161:c 162:c 163:c 164:c 165:c 166:c 167:c 168:c 169:c 170:c
                           171:t 172:t 173:t 174:t 175:t 176:t 177:t 178:t 179:t 180:t 181:t 182:t
   FIRST FIRING SEPARATION: index 171 = 60.117°   (declared constant 170.667 = 60°)

   ENTRY POINT (deriveMarketRegister, whole path): shape=triangular mouths=3 gaps=3
        registerVerts=48 retention=0.446 fixtures=7 band=[3,7]
```

**The 60° boundary is proved in the direction the chair asked for: at 60° it fires, at 59° it does
not**, and the fallthrough below the boundary is `carved` on every swept index — never a crash,
never a null. Every swept case still finds exactly 3 mouths and 3 major mouths, so the sweep moves
one variable.

⭐ **AND THE BOUNDARY IS NOT AT 60.000°, WHICH ONLY THE SWEEP COULD HAVE TOLD ANYONE.** Bearings
arrive as INTEGER trig indices (`bearingIndex` quantises to 1024 steps) while the threshold is the
non-integer `1024/6 = 170.667`. `minSep >= 170.667` is satisfiable only from index **171**, and
171 is **60.117°**. The effective gate is *strictly more than 60°*. Reading the source alone
yields "60°"; the instrument yields the number that is actually shipped.

### ⚠ A DEFECT THE ARM SURFACED IN PASSING — the reason string contradicts itself

Every firing prints `smallest separation 120° ≥ 70°` and `smallest separation 60° ≥ 70°`. The
`≥ 70°` is a **stale literal** in `marketRegister.js` line 280; the threshold is 60°, as the
constant, the doc comment above it and this sweep all agree. **Cosmetic — message text only, no
behaviour depends on it** — but it is in a string a reader is invited to trust, and the second
form is self-contradicting on its face. Recorded rather than fixed: it is a shipped-`src` byte.

```
── ARM B · faubourgOrigin.deriveFaubourgOrigins → 'bridgehead'   (knot=41 u, gateReach=40 u, frontage=5)
   B1-on-the-deck             → BRIDGEHEAD  dDeck=4 dGate=596
        the bridge 'br-synth' is 4 away — inside its own 41 knot and nearer than the gate (596)
   B2-just-inside-knot        → BRIDGEHEAD  dDeck=40.5
   B2-just-outside-knot       → ROAD        dDeck=41.5
        hf32: 111.7 frontages out along the approach — a ribbon, not a knot
   B3-gate-nearer-than-deck   → GATE        dDeck=3 dGate=1
        hf311: 0.2 frontages from its gate, inside the 8-frontage before-the-gate reach

   SWEEP (dDeck : origin)  0:b 2:b … 38:b 40:b | 42:r 44:r … 60:r
   BOUNDARY: last bridgehead at dDeck=40, first non-bridgehead at dDeck=42 (declared knot 41)
```

⭐ **THE PREDICATE IS TWO CLAUSES AND BOTH GET THEIR OWN NEGATIVE CONTROL.**
`deck && dDeck <= knot && dDeck < dGate` — B2 refutes the first clause by walking one plot past the
knot, B3 refutes the second by leaving the building inside the knot and moving the GATE nearer than
the deck. A control that only proved clause one would have proved half a branch.

```
── LIVENESS
   ok     A · three major roads 120° apart select TRIANGULAR through the real selector
   ok     A · at 60° the branch FIRES
   ok     A · at 59° the branch does NOT fire (the gate is real, not decorative)
   ok     A · the sweep names a single crossing index and it is 171 (= 60.117°)
   ok     A · below the boundary the fallthrough is CARVED, never a crash or a null
   ok     A · every swept case still finds exactly 3 mouths and 3 major (the sweep moves ONE thing)
   ok     A · the WHOLE entry point (not just the selector) yields a triangular register with an entry gap per mouth
   ok     A · the register is INSCRIBED — its area does not exceed the reserved blob
   ok     B · a building sited on a bridge deck types BRIDGEHEAD through the real path
   ok     B · clause one is real: just inside the knot fires, just outside does not
   ok     B · clause two is real: inside the knot but with the gate NEARER, the type is not bridgehead
   ok     B · the sweep crosses exactly at the declared knot
   ok     B · the bridgehead building also raises a bridgehead DISTRICT (the drawn consequence)
I11_LIVE
```

⭐ **REG-4 §6 ITEM 2 IS DISCHARGED.** "The branch works" is now a claim with executed evidence
behind it, for both branches, on both sides of both thresholds.

⚠ **A HAZARD THE ARM PAID FOR AND THE FILE NOW RECORDS**: a lazy synthetic square (a 2-point or
collinear `sq.polygon`) makes `radiusAt` return 0 for every bearing, which yields **ZERO mouths and
a clean-looking `carved`** — a silent false negative, not an exception. The instrument builds a
real 24-gon for exactly this reason.

---

*(§4 the ratchet-unit proposal and §5 the warehouse fixture cure follow; §6 deferrals, §7 judgment
calls and §8 the exact re-run are written at the end.)*

---

# §4 · THE RATCHET-UNIT REVIEW (§628) — **A PROPOSAL TABLE; NOTHING IS RE-PINNED**

`node regI1-ratchetunit.mjs` — 18 leaves × 2 arms × 3 samples, one discarded warm-up per (leaf,
arm), and the discard is disclosed rather than silent.

## §4.0 · ⛔⛔ FIRST, A CORRECTION THAT CHANGES EVERY DOM FIGURE THIS PROGRAMME HAS PUBLISHED

**`renderFolio().elementCount` IS NOT THE DOM NODE COUNT.** The renderer counts its own DRAW LIST;
the §173 LETTERING SPLICE is *"a SEPARATE STAGE OVER THE FINISHED DRAW LIST"* and its `<text>`
never enters that figure, plus ~10 more elements on the armed arm. Measured directly off the
emitted documents:

| | renderer's `elementCount` | TRUE document census |
|---|---|---|
| base `town` | 286 | **353** |
| armed `town` | 444 | **514** |
| base `metropolis` | 346 | **433** |
| armed `metropolis` | 411 | **502** |

REG-4's *"DOM nodes rise 64→69 at thorp and 346→423 at metropolis"* is the renderer's figure; the
true document goes **73→79** and **433→502**. Every table below carries BOTH (`node*` = the
renderer's, comparable with the published REG-2/3/4 rows; `dom*` = the true census, which is what
a browser-cost ceiling would have to ration).

## §4.1 · THE MEASURED TABLE

```
       leaf |       tier |  ceil | primB | primA | prim% | nodeB | nodeA | node% | domB | domA | dom% | kBB | kBA |  kB% |   msB |   msA |  ms% | msSpr% | headroom
------------+------------+-------+-------+-------+-------+-------+-------+-------+------+------+------+-----+-----+------+-------+-------+------+--------+---------
      thorp |      thorp |  1000 |   904 |   968 |   7.1 |    64 |    69 |   7.8 |   73 |   79 |  8.2 | 116 | 120 |  3.5 |  2.89 |  2.87 | -0.7 |    7.9 |       32
     hamlet |     hamlet |  1400 |  1126 |  1252 |  11.2 |    87 |    91 |   4.6 |  100 |  104 |    4 | 130 | 137 |  5.4 |  3.17 |  3.53 | 11.4 |   12.1 |      148
    village |    village |  2000 |  1226 |  1431 |  16.7 |   135 |   171 |  26.7 |  188 |  226 | 20.2 | 149 | 162 |  9.2 |  3.68 |  3.96 |  7.6 |    5.6 |      569
       town |       town |  9300 |  4386 |  6563 |  49.6 |   286 |   444 |  55.2 |  353 |  514 | 45.6 | 386 | 496 | 28.5 | 12.87 |  15.5 | 20.4 |    2.5 |     2737
     town-2 |       town |  9300 |  4526 |  6753 |  49.2 |   254 |   418 |  64.6 |  331 |  498 | 50.5 | 394 | 509 | 29.1 | 11.96 | 15.91 |   33 |    3.5 |     2547
       city |       city | 10000 |  5799 |  8173 |  40.9 |   369 |   422 |  14.4 |  456 |  513 | 12.5 | 470 | 586 | 24.7 | 14.34 | 20.82 | 45.2 |    7.9 |     1827
 metropolis | metropolis | 14200 |  7985 | 11291 |  41.4 |   346 |   411 |  18.8 |  433 |  502 | 15.9 | 543 | 692 | 27.5 | 17.02 | 22.67 | 33.2 |    1.9 |     2909
polycentric |       town |  9300 |  4378 |  6573 |  50.1 |   265 |   400 |  50.9 |  345 |  483 |   40 | 385 | 490 | 27.2 | 11.59 | 13.55 | 16.9 |    6.2 |     2727
  highwater |       town |  9300 |  4451 |  7291 |  63.8 |   270 |   442 |  63.7 |  317 |  492 | 55.2 | 396 | 526 | 32.6 | 10.37 | 15.48 | 49.3 |   15.4 |     2009
   mountain |    village |  2000 |  1529 |  1764 |  15.4 |   104 |   140 |  34.6 |  136 |  174 | 27.9 | 162 | 176 |  8.5 |  3.55 |  4.23 | 19.2 |    2.1 |      236
      fjord |       town |  9300 |  4584 |  6199 |  35.2 |   220 |   354 |  60.9 |  270 |  406 | 50.4 | 400 | 481 | 20.5 |  9.86 | 14.78 | 49.9 |    2.8 |     3101
      siege |       town |  9300 |  4396 |  6547 |  48.9 |   287 |   444 |  54.7 |  354 |  514 | 45.2 | 385 | 492 | 27.8 |  11.5 | 15.58 | 35.5 |    6.4 |     2753
     plague |       town |  9300 |  4393 |  6570 |  49.6 |   287 |   445 |  55.1 |  354 |  515 | 45.5 | 386 | 496 | 28.5 | 10.45 | 16.74 | 60.2 |    7.1 |     2730
     famine |       town |  9300 |  4392 |  6569 |  49.6 |   287 |   445 |  55.1 |  354 |  515 | 45.5 | 386 | 497 | 28.5 | 12.05 | 14.05 | 16.6 |      3 |     2731
  migration |       city | 10000 |  5803 |  8177 |  40.9 |   370 |   423 |  14.3 |  457 |  514 | 12.5 | 470 | 587 | 24.7 | 14.59 | 18.13 | 24.3 |    3.8 |     1823
   year-018 |       town |  9300 |  4340 |  5930 |  36.6 |   269 |   423 |  57.2 |  329 |  484 | 47.1 | 380 | 465 | 22.3 | 11.24 | 14.51 | 29.1 |    7.2 |     3370
   year-100 |       town |  9300 |  4388 |  6789 |  54.7 |   284 |   440 |  54.9 |  349 |  507 | 45.3 | 388 | 501 | 29.3 | 10.32 | 14.45 |   40 |   10.7 |     2511
   crossing |       town |  9300 |  4421 |  6827 |  54.4 |   274 |   430 |  56.9 |  358 |  517 | 44.4 | 408 | 533 | 30.8 |  9.99 | 13.58 | 35.9 |    2.2 |     2473

── PER TIER, ALL WAVES ARMED — the worst leaf in each unit
   tier          primCeil  primMax  nodeMax  domMax   msMax   kBMax   worst leaf (prim / dom / ms)
   thorp             1000      968       69      79    2.87     120   thorp / thorp / thorp
   hamlet            1400     1252       91     104    3.53     137   hamlet / hamlet / hamlet
   village           2000     1764      171     226    4.23     176   mountain / village / mountain
   town              9300     7291      445     517   16.74     533   highwater / crossing / plague
   city             10000     8177      423     514   20.82     587   migration / migration / city
   metropolis       14200    11291      411     502   22.67     692   metropolis / metropolis / metropolis

── HOW WELL EACH UNIT PREDICTS THE OTHERS (Pearson r over the 18 leaves, ALL-WAVES arm)
   LEVELS   prim↔nodes 0.9   prim↔ms 0.98   nodes↔ms 0.91   nodes↔bytes 0.94   prim↔bytes 0.99
   DELTAS   Δprim%↔Δnodes% 0.72   Δprim%↔Δms% 0.65   Δnodes%↔Δms% 0.52

── DETERMINISM OF THE COUNTED UNITS: ok  72 re-renders, every primitive/node/byte count identical to sample 1
```

## §4.2 · THE FOUR FINDINGS THE PROPOSAL RESTS ON

**F1 · DOM NODES SATURATE FROM `town` UPWARD, SO A NODE CEILING CANNOT DISCRIMINATE THE BIG TIERS.**
Armed true-DOM maxima: town **517** · city **514** · metropolis **502** — the counts go DOWN as
the tier goes up, while primitives go 7,291 → 8,177 → **11,291** and bytes 533 → 587 → **692 kB**.
Everything batches; a metropolis draws 55 % more marks than a town into 3 % *fewer* elements. A
tier-scaled node ceiling would have to be nearly the same number for all three, and it would wave
through a metropolis drawing 11,291 marks. **A node ceiling is not a size ration.** It is
something else, and something useful — see P2.

**F2 · THE PRESENT HEADROOM IS ANTI-CORRELATED WITH THE ACTUAL COST.** Headroom as a share of the
signed primitive ceiling: thorp **3.2 %** · hamlet 10.6 % · village 11.8 % · town 21.6 % ·
city 18.2 % · metropolis **20.5 %**. The tier with the least room to move costs 120 kB, 79 nodes
and 2.9 ms; the tier with the most costs 692 kB, 502 nodes and 22.7 ms. **The ration bites hardest
exactly where nothing is at stake, and is loosest where the drawing is most expensive.** REG-4
already felt this — *"thorp 32 ⛔ tightest in the corpus"* — and read it as a tight tier. It is a
tight UNIT.

**F3 · PRIMITIVES PREDICT *BYTES* ALMOST PERFECTLY (r = 0.99) AND *TIME DELTAS* POORLY (r = 0.65).**
So the primitive count is not a bad number — it is a **byte proxy wearing a performance label**.
Changing the unit to bytes keeps everything the ration has ever actually been measuring and drops
the claim it cannot support.

**F4 · MILLISECONDS ARE TOO NOISY TO GATE ON AND TOO SMALL TO NEED GATING.** The worst leaf in the
corpus renders in **22.67 ms**. And the noise: this same instrument, same deterministic renderer,
same machine, run twice, produced per-leaf sample spreads of **1.3 %–68.5 %** on the first run and
**1.9 %–15.4 %** on the second, with medians moving up to ~25 % between runs. **A gate whose noise
exceeds its signal fires on machine load, not on drawings.** Report ms; never ration it.

## §4.3 · ⭐⭐ THE PROPOSAL TABLE — **THE CHAIR SIGNS; NOTHING BELOW IS PINNED**

### P1 · PRIMARY UNIT: **RENDERED BYTES**, tier-scaled — replaces the primitive ceiling

| tier | armed max (measured) | **proposed ceiling** | headroom | basis |
|---|---|---|---|---|
| thorp | 120 kB | **165 kB** | 37 % | max × 1.35, rounded up to the next 25 kB |
| hamlet | 137 kB | **190 kB** | 39 % | " |
| village | 176 kB | **240 kB** | 36 % | " |
| town | 533 kB | **725 kB** | 36 % | " |
| city | 587 kB | **800 kB** | 36 % | " |
| metropolis | 692 kB | **950 kB** | 37 % | " |

Why bytes: it is the **actual delivery cost**; it is **deterministic** (proved — 72 of 72
re-renders byte-identical); it is **monotone in tier**, so a tier ladder means something; and
primitives predict it at **r = 0.99**, so every historical op figure translates and the ration's
intent survives the unit change. The uniform ~36 % headroom is the point of F2: one rule, applied
to measurement, instead of six numbers with 3 %–22 % of room.

### P2 · SECOND GATE: **TRUE DOM-NODE CAP**, flat per band — a BATCHING DETECTOR, not a size ration

| band | armed max | **proposed cap** | what it is for |
|---|---|---|---|
| thorp · hamlet · village | 226 | **450** | — |
| town · city · metropolis | 517 | **1,050** | — |

Flat within the band **because nodes saturate (F1)** — that is the finding, not an oversight. This
cap's job is narrow and it should be written down as such: *catch a wave that stops batching.* A
pass that emits one `<path>` per merlon instead of one per comb would double the node count while
barely moving bytes, and nothing in the present ration would see it. Two bands rather than six,
because a saturating quantity does not deserve a six-rung ladder.

### P3 · **NO TIME BUDGET.** `ms` and its 3-sample spread are REPORTED on every §217 table and gate nothing (F4)

### P4 · **PRIMITIVES BECOME A REPORTED FIGURE WITH NO CEILING**

They remain the only unit that counts MARKS, which is what a taste or legibility question is
about — and they should keep being published for exactly that. They should stop being a gate,
because P1 rations the same information with a unit that means something.

### The two alternatives, rejected with reasons rather than passed over

| rejected shape | why not |
|---|---|
| **a DOM-node ceiling as the PRIMARY unit** (the shape the §628 charter's own wording suggests) | F1. Nodes saturate at ~500 from town upward, so the ceiling cannot discriminate the three tiers where the drawing is actually expensive, and it would license 11,291 marks at metropolis. Kept as P2's narrow batching cap instead. |
| **a DOM-node ceiling PLUS a per-tier time budget** (the shape the brief sketches) | F1 for the node half and F4 for the time half. The time half is the worse of the two: 22.67 ms worst case, 1.3–68.5 % sample spread, medians moving 25 % between runs of the same deterministic renderer. It would be a gate on the machine. |

⚠ **ONE THING NO UNIT ON THIS TABLE MEASURES, AND IT IS PROBABLY THE REAL CONSTRAINT.** Bytes,
nodes and milliseconds are all COST. The question the register programme actually keeps asking is
whether the plate is still legible — ink per unit area at page register — and none of these
ration that. i1's squint and i3's chunking are the instruments that do. **A byte ceiling should be
signed as a cost ration and explicitly NOT as a legibility ration**, or the next wave will read a
green ratchet as a taste verdict.

---

# §5 · THE WAREHOUSE FIXTURE CURE — **⛔⛔ THE CARVE-OUT'S PREMISE IS REFUTED**

## §5.1 · WHAT §628.1 SAYS, AND WHAT IS ACTUALLY TRUE

§628.1 reads the three `area: 0` rows (S03 · S21 · S26) as *"the extractor missed that family's
draw class."* **It did not.** Measured at the source on the same 12-seed ladder the sheet used:

```
QUAY BODIES: 4   area==0: 3   area>0: 1
  sil-0  arch=port  solids= 0  area=    0  size=11.80  slots={"compounded":false,"piers":3,"shed":true}
  sil-1  arch=port  solids= 3  area= 90.6  size=11.11  slots={"compounded":false,"piers":4,"shed":true}
  sil-4  arch=port  solids= 0  area=    0  size=11.07  slots={"compounded":false,"piers":3,"shed":true}
  sil-8  arch=port  solids= 0  area=    0  size=15.51  slots={"compounded":false,"piers":2,"shed":false}
```

`lm.solids` is **EMPTY** on those three. There is no other field to sum: `shapeCode.js`'s `quay`
composer pushes every pier into `solids`, `put(members,…)` only role-TAGS those same polygon
objects, `voids` is `[]` for this family, and `marks` carries a ridge line indexed INTO `solids`.
**The extractor read the only geometry field there is, and the geometry was gone before it looked.**

## §5.2 · ⭐⭐ THE ROOT CAUSE — TWO SHIPPED LAWS IN DIRECT CONTRADICTION

| law | what it does |
|---|---|
| `waterWorks.moorWaterBound()` | MOORS a `port` landmark so its piers reach **across** the water's edge — its own comment says *"the piers reach across it"*, and the family's pinned invariant is `'A COMB OF PARALLEL PIERS RUNNING INTO THE WATER'` |
| `groundRefusal.bodyRefusal()` | REJECTS any polygon with a single sample over `REFUSAL.standingWater` (0.64), with **no `shapeFamily` / `archetype` exemption anywhere in the file or its caller** |
| `groundLaw.demoteBody()` | the one rescue path — and it only shrinks toward the polygon's **own centroid**, which sits at the moored anchor, so it **structurally cannot** pull a pier onto dry land |
| `groundLaw` cleanup | wipes the refused solid (`it.ref[it.field] = []`), then filters the emptied entries out, leaving `lm.solids === []` |

⛔ **IT IS NOT A REG-3 REGRESSION.** `institutionShapes.js`'s legacy `case 'port'` composes the
same into-the-water piers and `ordinaryArchetype`'s KEEP set preserves `'port'` explicitly, so the
**UNARMED** path carries the identical latent defect. **A cure is a change to a shipped ground law
— OWNER-GATED. Reported, not made (J-I1-5).**

⚠ **THE VISIBLE CONSEQUENCE IS LARGER THAN THREE FIXTURES**: on those leaves the settlement's
**quay is simply not drawn**. Nothing in the corpus census would have shown that, because a
landmark with no solids is not a missing landmark — it is a landmark of zero size.

## §5.3 · WHAT WAS ACTUALLY CURED — the extractor's own four defects

All four are real, all four are independent of the engine bug, and all four would produce blank
fixtures for **any** thin class:

| # | defect | cure | convicted by |
|---|---|---|---|
| **C1** | **NO INK FLOOR** — the stated rule is "the four largest by drawn area", and area 0 was a lawful candidate for it | `area > 0` is a hard predicate; every refusal recorded with its reason | fires 4× in the ordinary run |
| **C2** | **THE CROP WAS NEVER VERIFIED TO CONTAIN THE BODY** | the emitted document is re-parsed and BOTH halves are required — (a) FRAME: ≥1 vertex of **this body's** solids inside the crop's own viewBox; (b) DRAWN: ≥1 of **this body's** solids present VERBATIM as a `<path d>`, formatted by the renderer's own `polyPath` | `--controls`, 6 of 6 |
| **C3** | **THE RASTER FAILURE WAS SWALLOWED** — `catch { /* the byte floor may reject a near-empty crop */ }` let a fixture with no PNG into the sheet | a failed or suspect shot REFUSES the candidate; the next spare is taken | 0 fired (no shot failed) |
| **C4** | **SILENT UNDER-DELIVERY** — with the floor on, the declared 12-seed ladder yields ONE qualifying body, not four | the ladder widens deterministically 12 → 24 → … until the class fills; a shortfall is reported loudly, never back-filled | `ladder N=24` fired |

⚠ **AND C1 IS NOT A QUAY-SHAPED DEFECT.** Zero-area candidate counts over 24 seeds:
`craft 48 · mark 75 · hall 34 · works 30 · rowHouse 21 · market 16 · farmstead 6 · inn 4 ·
quay 4 · church 3`. **Every class produces them.** Quay is simply the only class thin enough that
they reached the top four; the other five were saved by having fat candidates, not by a guard.

⚠⚠ **`warehouse` IS AN EMPTY FAMILY IN THIS CORPUS.** Over 24 seeds the `warehouse` shapeFamily
composes **ZERO** bodies; the sheet's warehouse CLASS is populated entirely by the `quay` family
through the original's own `family === 'quay' ? 'warehouse' : family` fold — which is why every
key row says `family: quay`. "The warehouse class" and "the warehouse family" are not the same set.

### The C2 controls — a check that has never failed is not known to work

```
── C2 CONTROLS (bodyInkInCrop, against a real emitted crop of sil-1)
   centred  {"ok":true,"drawn":3,"frame":16,"ownArea":90.6}
   faraway  {"ok":false,"drawn":3,"frame":0}
   wiped    {"ok":false,"drawn":0,"frame":0}
   nudged   {"ok":false,"drawn":0,"frame":6}
   tiny007  {"ok":false,"drawn":0,"frame":6}
   ok     the centred crop of a real inked body PASSES both halves
   ok     its reported ownArea is THIS body's area, not a sum over the plate
   ok     a crop 4,000 units away FAILS the FRAME half
   ok     an EMPTIED body (solids []) FAILS the DRAWN half even in a correct frame
   ok     a polygon moved 3.3 units FAILS the DRAWN half — the test is verbatim, not fuzzy
   ok     the DRAWN half admits NO tolerance — even a 0.007 u nudge breaks the verbatim match
C2_CONTROLS LIVE
```

⛔⛔ **TWO OF MY OWN MISTAKES ARE ON THIS RECORD RATHER THAN QUIETLY REPLACED.**
1. **The first C2 was too weak.** It summed every landmark path whose bounding box touched the
   viewBox and returned **318,960 sq units for a body of 90.6** — i.e. it answered *"is there ANY
   landmark ink near this crop"*, which a crop centred on the **wrong** landmark also passes. A
   verification that cannot fail on the case it exists for is not a verification. Replaced with
   the two-half test above, whose `ownArea` now reproduces each body's own area exactly.
2. **The `tiny007` control row was a wrong prediction.** It was written expecting a 0.007-unit
   nudge to sit below `polyPath`'s rounding resolution and still match. It does not: `r2` rounds
   to 2 dp, so a 0.007 shift crosses a rounding boundary for whichever vertices sit near one, and
   the match is over the whole polygon string. **Measured `drawn=0`.** The property is stronger
   than the one predicted and the assertion now states the true one.

## §5.4 · THE REGENERATED ROUND — **FILLED, 4 of 4, every area verified > 0**

```
  ladder N=24: 8 inked candidate(s) on 6 distinct seed(s), 4 refused by the ink floor

  real 4 of 4 · decoys 2 of 2
  refused by the ink floor (C1): 4
     sil-0     area=0 solids=0 — area 0 is not > 0 — 0 solids survive; the body was wiped by the ground law
     sil-4     area=0 solids=0 — …
     sil-8     area=0 solids=0 — …
     sil-20    area=0 solids=0 — …
  refused after emission (C2/C3): 0

  THE FIXTURES (the chair reads the key; the READER never sees this):
     W01  warehouse sil-17  family=quay   area=  87.3  frame= 76  solidsDrawn=3/3  vertsInFrame=13  ownInkArea= 87.3
     W02  DECOY     sil-20  family=DECOY  area= 135.8  frame= 82
     W03  DECOY     sil-0   family=DECOY  area= 124.4  frame= 78
     W04  warehouse sil-13  family=quay   area= 261.9  frame=109  solidsDrawn=4/4  vertsInFrame=18  ownInkArea=261.9
     W05  warehouse sil-12  family=quay   area= 153.5  frame= 83  solidsDrawn=3/3  vertsInFrame=14  ownInkArea=153.5
     W06  warehouse sil-1   family=quay   area=  90.6  frame= 78  solidsDrawn=3/3  vertsInFrame=16  ownInkArea= 90.6
REGI1_WAREHOUSE FILLED
```

**Every real fixture: area > 0, every one of its solids found verbatim in its own crop, its PNG
rendered and over the floor.** All six shots `SHOOT_OK`, 3–4 s each, none killed.

| artifact | path |
|---|---|
| fixtures + sheet | `$SP/reg3work/silhouettes-warehouse/` — `W01…W06.{svg,png}` + `SHEET-WAREHOUSE.md` |
| answer key | `$SP/reg3work/silhouette-key/ANSWER-KEY-WAREHOUSE.json` |
| the cured extractor | `$SP/reg3work/silhouetteWarehouse.mjs` (a NEW file; `laneREG3-tree` is untouched) |

⭐ **A DELIBERATE DEPARTURE FROM THE FIRST ROUND'S RULE, RECORDED (J-I1-6): the decoys take seeds
no real fixture uses.** The REG-3 sheet's one-per-seed rule is PER CLASS, so its 28 fixtures freely
reuse a plate across classes (`sil-1` appears six times). Harmless at 28; at **six** it is a leak
channel — two crops off the same plate share a coastline and a terrain wash, so a reader who spots
the match can reason about them jointly, and per-fixture independence is the whole point of a blind
read. Result: **6 fixtures on 6 distinct seeds.** The fallback is coded and would be NAMED in the
key if disjointness were ever unreachable.

⛔ **THE SHEET DOES NOT NAME THE CLASS UNDER TEST.** It presents the same six-class closed list and
`CANNOT TELL`; a sheet headed "warehouse re-round" is a sheet with its answer on its face. Two
decoys of six keep the `decoyFalsePositiveRate` validity gate live against a reader who guesses
"warehouse" throughout. ⚠ The decoy ratio is 2 : 4 where the first round's was 4 : 24 — **the
gate is coarser here** (one false positive is 50 % of the decoy pool), so the chair should read the
validity gate as a coarse signal on this round, not a rate.

## §5.5 · THE OTHER CLASSES' FIXTURES AND KEY ROWS WERE NOT TOUCHED — PROVED

```
$ ls -la $SP/reg3work/silhouette-key/
-rw-r--r--  7869  Aug 24 19:11  ANSWER-KEY-WAREHOUSE.json     ← new, this lane
-rw-r--r--  4369  Aug 24 17:01  ANSWER-KEY.json               ← REG-3's, mtime UNCHANGED

REG-3 key rows: 28   area==0 rows still present: ["S03/warehouse/quay","S21/warehouse/quay","S26/warehouse/quay"]
orderSeed: reg3-silhouette-order-1 | decoys: 4 | perClass: 4
```

The REG-3 key is byte-unchanged and its three zero-area rows **stand as the record of what the
first round emitted**. The new round supersedes nothing; its result is reported beside the first,
never merged into it. `$SP/reg3work/silhouettes/` was not written to.

---

# §6 · DEFERRED, WITH REASONS (documented, not bugs to re-find)

1. ⛔⛔ **THE QUAY / `port` GROUND-LAW CONTRADICTION IS AN ENGINE DEFECT AND IS OWNER-GATED.**
   `moorWaterBound` moors piers across the water on purpose; `bodyRefusal` wipes them for being
   over standing water; `demoteBody`'s centroid-shrink rescue structurally cannot save them. Three
   of four quays in the 12-seed ladder, and four of twelve over 24 seeds, are **not drawn at all**.
   The legacy `case 'port'` path carries the same defect, so it is not a REG-3 regression. **A cure
   is a change to a shipped ground law — chair's/owner's.** The shape of it is named in §5.2: a
   `shapeFamily`/`archetype` exemption on the `standingWater` clause, or a rescue that shrinks
   toward the LANDWARD end rather than the centroid. Diagnosis complete; nothing changed.
2. ⛔⛔ **`lib/classify.mjs` CANNOT SEE REG-4's MARKET REGISTER** (four unknown group ids; every
   `<circle>` typed `chrome` before any group test). Measured, quantified in §2.2, cure named —
   **not applied, because it moves every recorded i1/i5/i7 baseline.** Chair's.
3. ⚠ **`marketRegister.js` LINE 280 PRINTS `≥ 70°` FOR A 60° THRESHOLD.** Cosmetic, message text
   only, no behaviour depends on it — but the emitted string reads `smallest separation 60° ≥ 70°`,
   which contradicts itself on its face. A shipped-`src` byte; reported, not touched.
4. ⚠ **i1, i2, i3, i4, i7 AND i10 WERE NOT RE-RUN**, and the reason is stated rather than implied.
   REG-4's argument for deferring i5/i6 covers these unchanged: this arc adds no new ROLE and no
   new colour token and moves no street centreline. ⛔ **The one that now genuinely deserves a run
   is `i7` (FTG colour)**: §2.2 measures city's `water:ground` widening its existing failure
   (1.3168 → 1.1246) and i5's own header rules that water is read by HUE, with i7's band as the
   real test. It is owed and it is cheap — the PNGs are already shot in `png/regI1/`.
5. ⚠ **THE §4 PROPOSAL IS A PROPOSAL.** `OP_CEILING_BY_TIER` is untouched; the §628-signed table is
   still unlanded in it (REG-4 §6 item 4 stands unchanged); no byte, node or time ceiling exists
   anywhere yet. Nothing in §4.3 may be cited as a pin.
6. ⚠ **THE WAREHOUSE RE-ROUND IS PREPARED, NOT READ.** This lane never scored it and never looked
   at a fixture PNG — ink is verified geometrically (C2), never by eye. **The chair runs the blind
   read with a fresh reader.** ⚠ And read the validity gate as a coarse signal: 2 decoys of 6 means
   one false positive is 50 % of the decoy pool.
7. ⚠ **THE V-B13 / FAUBOURG / FLOOR VOCABULARY WALKER IS STILL UNWRITTEN.** REG-4 §8's bill —
   `MARKET_SHAPES`, `V_B13`, `B13_BAND`, `FAUBOURG_ORIGINS`, `FLOOR_CANDIDATES` plus REG-3's and
   REG-2's — is untouched by this lane. ⚠ **`i11` is NOT that walker and must not be mistaken for
   it**: `i11` proves two BRANCHES fire; a totality walker proves every MEMBER of a closed
   vocabulary is reachable. The bill is still one bill for three waves.
8. ⚠ **i6's ARMED COLUMN IS A FIVE-FLAG AGGREGATE.** F3's movement is attributed to L-REG-30 by
   its signature (masses down, ink conserved, footprint up) and by REG-4's own construction — but
   it is **not decomposed per flag**, because that is 5 more arms × 18 leaves × 2 subprocesses. If
   the chair wants the split before signing a floor, `regI1-i6corpus.mjs` takes `--armed=<dir>` and
   the render is one `exemplars.mjs` line per flag.

---

# §7 · JUDGMENT CALLS — all vetoable

| # | call | basis |
|---|---|---|
| **J-I1-1** | `15r`'s **wear marks are TRACED (`watabou`+`corpus`), not DRIFT** — unlike `15b`. | The distinction is which layer the MARK comes from, not which layer chooses to apply it. `15b` is DRIFT because a fixed picture cannot express a settlement's current condition **at all**. Every wear mark, by contrast, already exists in the corpus's ruin grammar — hf323's hatched-not-filled roofless ruin, hf379's later rungs, hf123's quarried rubble line. The truth layer chooses WHICH wall wears them; the corpus supplies the marks. Flipping this makes DRIFT 4 and asks the chair to justify a besieger's camp and a crumbling parapet with the same sentence. |
| **J-I1-2** | The owner's §598 approval is **recorded inside `15r` but NOT offered as its trace**. | L-REG-4 asks which reference a mark descends from; an approval answers a different question. Naming it as the trace would make the table say "traceable to the owner", which is exactly the drift the law exists to catch. |
| **J-I1-3** | The `lib/classify.mjs` blind spot is **measured and reported, NOT fixed**. | The brief's own instruction for i5 ("measure, report, never tune") and the harder reason: the two-line cure moves the role masks on every plate, hence every recorded i1/i5/i7 baseline including the `d1b32e339` set four waves are priced against. That is a baseline re-record, which is chair-gated by the two-baseline law in INSTRUMENTS.md. |
| **J-I1-4** | The §4 proposal's **primary unit is BYTES, not DOM nodes**, against the shape the brief sketched. | Measured: DOM nodes SATURATE from town upward (517 · 514 · 502) while primitives go 7,291 → 8,177 → 11,291. A node ceiling cannot discriminate the three tiers where the drawing is actually expensive, and would license 11,291 marks at metropolis. Bytes are monotone in tier, are the real delivery cost, are deterministic (72 of 72), and primitives predict them at **r = 0.99** so every historical figure translates. Nodes are kept as P2 — a narrow batching detector, which is the job they are genuinely good at. |
| **J-I1-5** | The quay ground-law contradiction is **diagnosed and reported, not cured**, and the deliverable is met by curing the EXTRACTOR's own four defects instead. | The engine cure is a change to a shipped ground law affecting the LEGACY `port` path too — new capability vs repair, and owner-gated by the standing list. The extractor defects (C1–C4) are real, independent of it, and would blank-fixture any thin class; curing them is in scope and yields the four verified fixtures the deliverable asks for. Both halves are on the record so the chair can act on either. |
| **J-I1-6** | The warehouse round's **decoys take seeds no real fixture uses** — a deliberate departure from the first round's rule. | The REG-3 one-per-seed rule is PER CLASS, so its 28 fixtures reuse plates across classes (`sil-1` six times). Harmless at 28; at SIX it is a leak channel — two crops off one plate share a coastline, and a reader who spots it can reason about them jointly, which defeats per-fixture independence. The decoy pool is one per seed over 24 seeds, so disjointness costs nothing. Result: 6 fixtures on 6 distinct seeds. |
| **J-I1-7** | The i6 comparison uses the **BASE circuit on both arms**, and proves the choice rather than assuming it. | run-baselines.mjs's own protocol, and a denominator that changed with the arm would make every delta a comparison of two different questions. REG-2 folded the band regime into the existing `wallForm` declared input, so the armed circuit COULD have moved — `--checkcircuit` measures it: 12 of 12 walled leaves identical, zero vertices. |
| **J-I1-8** | `i11` drives the shipped selectors through **synthetic INPUTS**, never a monkey-patch, and builds a real 24-gon rather than a lazy square. | A control that patches the module under test proves the patch. And the lazy square is a measured hazard, not a style point: a 2-point or collinear `sq.polygon` makes `radiusAt` return 0 for every bearing, yielding **zero mouths and a clean-looking `carved`** — a silent false negative that would have read as "the branch cannot fire". |
| **J-I1-9** | The ratchet review reports **BOTH** `elementCount` and a TRUE dom census, rather than silently switching. | Every published REG-2/3/4 DOM figure is `elementCount`; dropping it would orphan those tables, and dropping the true census would set a ceiling on the wrong number (town 444 vs 514). Both, with the gap explained at its cause (the §173 lettering splice). |

---

# §8 · EXACT RE-RUN

```
SP=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad
T=$SP/laneREG4-tree            # detached at 7fba086d5 — the REG-4 seal, READ-ONLY
I=$SP/reg-instruments

# ── deliverable 1 · the i8 rows
cd $I
node i8-nodrift-trace.mjs --wt=$T                 # UNTRACED MISSES=0  staleRows=0  I8_PASS
node i8-nodrift-trace.mjs --wt=$T --controls      # I8_CONTROLS LIVE

# ── deliverable 2 · the renders, then i6 and i5
cd $T
node harness/exemplars.mjs $I/renders/regI1-base
node harness/exemplars.mjs $I/renders/regI1-all --fuse --rampart --shapes --market --footprint
for f in $I/renders/base/*.svg; do cmp -s $f $I/renders/regI1-base/$(basename $f) || echo "BASE MOVED: $f"; done
cd $I
node regI1-i6corpus.mjs --checkcircuit --wt=$T    # CIRCUIT_CONTROL walled=12 moved=0
node regI1-i6corpus.mjs                           # 18 rows + the BASE-column reconciliation
for L in town-town city-city village-village; do
  for A in base all; do
    zsh shoot-bounded.sh $I/renders/regI1-$A/$L-parchment.svg $I/png/regI1/$A-$L.png 2200 400000 90
  done
done
node --max-old-space-size=12000 regI1-i5contrast.mjs   # REGI1_I5 NO_VERDICT_REGRESSION

# ── deliverable 3 · the two unfired branches
node i11-branch-liveness.mjs --wt=$T               # I11_LIVE, 13 of 13

# ── deliverable 4 · the ratchet-unit review
node regI1-ratchetunit.mjs --wt=$T --samples=3     # REGI1_RATCHETUNIT rows=18

# ── deliverable 5 · the warehouse re-round
cd $SP/reg3work
node silhouetteWarehouse.mjs --controls            # C2_CONTROLS LIVE
node silhouetteWarehouse.mjs                       # REGI1_WAREHOUSE FILLED
```

⚠⚠ **THE GLOB THAT HAS NOW BITTEN THIS PROGRAMME FOUR TIMES**: `ls town-*-parchment.svg | head -1`
matches `town-2-town-parchment.svg` FIRST. Every leaf above is named by EXACT
`<key>-<tier>-parchment.svg`; `regI1-i5contrast.mjs` hard-codes them for this reason.

⚠ **`reg0/shoot.sh` HAS NO TIME BOUND.** Use `reg-instruments/shoot-bounded.sh` instead —
J-REG4-11 made mechanical, with the verdict read from the FILE after the kill.

⚠ **`classify()` TAKES A PATH, NOT SOURCE TEXT.** Handing it the text reads as `ENAMETOOLONG`
with the whole SVG in the error message. Cost one run here.

---

# §9 · FILE MANIFEST — every file this lane wrote, one line of why

| file | +/M | why |
|---|---|---|
| `reg-instruments/i8-nodrift-trace.mjs` | **M** table only | the seven trace rows; measure/roster/controls untouched, DRIFT count unchanged at 3 |
| `reg-instruments/i11-branch-liveness.mjs` | **NEW** | instrument 11 — the synthetic controls for `triangular` and `bridgehead`, both boundaries walked, one negative control per predicate clause |
| `reg-instruments/regI1-i6corpus.mjs` | **NEW** | the owed i6 re-run + `--checkcircuit`, the denominator control |
| `reg-instruments/regI1-i5contrast.mjs` | **NEW** | the owed i5 re-run + the `square`-role census that refuted REG-4's stated expectation |
| `reg-instruments/regI1-ratchetunit.mjs` | **NEW** | the §628 review — five units, three samples, the correlation table, the determinism assertion |
| `reg-instruments/shoot-bounded.sh` | **NEW** | J-REG4-11 made mechanical: wall-clock bound, TERM/KILL, verdict read from the file |
| `reg-instruments/INSTRUMENTS.md` | **M** | instrument 11's index row; i8's op-class count corrected 31 → 38; the lane's additions; the DECLARED i6 shift; the `classify.mjs` blind spot |
| `reg-instruments/renders/regI1-{base,all}/` | **NEW** | 29 artifacts each at the REG-4 seal; the base arm proved byte-identical to the recorded baseline renders |
| `reg-instruments/png/regI1/*.png` | **NEW** | six 2200 px plates for i5, all `SHOOT_OK`, none killed |
| `reg-instruments/out/regI1-*.json`, `out/i11-*.json` | **NEW** | the machine-readable records; **`out/baselines.json` was NOT rewritten** |
| `reg3work/silhouetteWarehouse.mjs` | **NEW** | the cured extractor (C1–C4) + the C2 controls + the refuted-premise diagnosis in its header |
| `reg3work/silhouettes-warehouse/` | **NEW** | `W01…W06.{svg,png}` + `SHEET-WAREHOUSE.md` |
| `reg3work/silhouette-key/ANSWER-KEY-WAREHOUSE.json` | **NEW** | the new key, beside the REG-3 key, which is byte-unchanged |
| `receipts/laneREGI1-receipt.md` | **NEW** | this file |

⛔ **NOT TOUCHED:** any shipped `src/` byte · `laneREG4-tree` and `laneREG3-tree` (0 tracked
modifications each, HEADs unmoved) · the shared repo (`review-fixes-2026-07-08` @ `00f858d3e`) ·
any ref · `MEMORY.md` · the ODQ · `out/baselines.json` · `reg3work/silhouettes/` and
`ANSWER-KEY.json` · `reg0/` and `reg-detail/` (read only).

---

## RESUME POINT — FINAL

**THE ONE ITEM THAT MOST NEEDS THE CHAIR:** the **quay / `port` ground-law contradiction** (§5.2,
J-I1-5). It is not a fixture problem and it is not REG-3's — `moorWaterBound` moors piers across
the water by design and `bodyRefusal` wipes them for being there, on the LEGACY path too. Four of
twelve quays over 24 seeds are not drawn at all, and nothing in any census would have shown it,
because a landmark with no solids is not a missing landmark. **A cure is a change to a shipped
ground law: owner-gated.**

**THE OTHER THREE DECISIONS WAITING:** the `lib/classify.mjs` blind spot (§2.2, J-I1-3 — a
two-line cure that re-records every pixel baseline) · the §4.3 ratchet-unit proposal (J-I1-4 —
bytes over nodes, and no time gate) · the L-REG-30 floor signature, which §2.1 now prices: F-C
costs **−43.9 %** of village's freestanding density and **+78.2 %** on its mean mass footprint, and
`--floor=F-A` is the lighter measured alternative.
