# LANE CAR-INSTRUMENTS — the instrument-repair car (ODQ §657.2)

Workspace: `$SP/reg-instruments` (writable to this car only)
Subject tree (READ-ONLY): `$SP/laneBRIDGE-tree`, HEAD `9de729021` (the §648.1 seal)
Repo: READ-ONLY. No `git add`, no refs, no repo edits.

---

## §0 · THE FOUR DELIVERABLES AND THEIR STATE

| # | deliverable | review row | state |
|---|---|---|---|
| 1 | i8's two dropped TRACE rows (12x V-QUAY, 14c FORDS) | B9 | ✅ **MISSES 2 → 0**, control convicts, restore byte-identical (§1) |
| 2 | i10's dead B1 ring-operand control, re-minted LIVE | I15 | ✅ **12/12 liveness**, threshold DERIVED at s\*=0.9248, census zeros intact (§2) |
| 3 | THE TANGENTIAL-OR-CLEAR CENSUS, built (§645.2) | I18 | ✅ **BUILT + 6 plants LIVE on 12 leaves** — and it ⛔ **REDS**: 237 crossings, 688/1621 violations (§3) |
| 4 | exit-code hygiene on i8/i5/i10 FAIL paths | C4 | ✅ **7 FAIL paths**, deliberate reds exit 1, `&&`-chain proven to stop (§4) |
| 5 | THE WSEAM AGREEMENT RATCHET (chair addendum §660) | I19 | ✅ pins **2.63 % / 208,644 / 50,444**, fresh re-measure PASS, 8 controls LIVE (§5) |

## §0.1 · REPRODUCED REDS AT THE SEAL (before any edit)

```
$ node i8-nodrift-trace.mjs --wt=$SP/laneBRIDGE-tree
  ...
  12x   —                          ⭐⭐⭐ V-QUAY · THE WATERFRONT DETAIL REGISTER (chair-minted, ODQ §636.2).
  14c   —                          ⭐⭐⭐ REG-BRIDGE · THE FORDS (§637.2's mirror law, ODQ §641.5).
  traced=35  driftJustified=3  UNTRACED MISSES=2  staleRows=0
  by reference: watabou=12  ftg=12  corpus=32  DRIFT=3
I8_FAIL
EXIT=0            ← C4's hazard, reproduced in the same run
```

## §0.2 · THE LEDGER GROUND READ FOR THE TWO ROWS (node/awk over docs/OWNER_DECISION_QUEUE.md, never whole-read)

- **§636.2** (V-QUAY's mint): the blind re-round's diagnosis — the one correct call was
  carried by SITE FURNITURE ("bollard/barrel circles ranged along the shed's road face," a
  hoist blob, a loading way); the two misses read as FARMSTEADS because "a riverside L-range
  with outbuildings and a track is a farm unless the water's edge says QUAY." RULED: V-QUAY
  MINTS — a closed vocabulary (bollard row · hoist/crane · pier-deck edge · stacked goods) at
  **2–5 fixtures per drawn quay**, "built on REG-4's furnishing machinery", binding to the
  detail register's waterfront anchors **where they exist** and reporting THIN where they do not.
- **§637.2** (the fords' law): "**Fords are the mirror law: a ford takes the WIDE, shallow
  reach**" — the two crossing kinds pull toward opposite river geometry, "which is itself a
  legibility gift (a reader who sees a crossing at a pinch reads BRIDGE; at a broad reach, FORD)."
- **§648.2/§648.1** (the fords' seal): "**FORD GLYPH HELD** — the lane's own THIN flag confirmed
  by eye (**an unanchored blob-chain**); the ARM seals dormant-provable, the **GLYPH re-cuts once
  in REG-6's dress pass bound to period convention**." And the identity: "all 17 ford records sit
  at distance 0.00 on the bridges' own channels — a ford and a bridge are two readings of ONE
  crossing; 15 are lawfully exempt as already decked, 2 draw."
- **§575.1** (the tangential law, for deliverable 3): buildings nearest the wall either
  **(A) align TANGENTIALLY to the wall's local curve**, or **(B) leave CLEAR SPACE on both
  sides**; regime-dependent, derived from the settlement's own facts.
- **§645.2** (the census's mint): "every building within reach of the wall is tangential to its
  curve OR has clear ground both sides (§575's law verbatim), and NO body's footprint crosses
  the line; **zeros valid only with a planted-violation control**."

## §0.3 · THE INDEPENDENT CHECK ON 14c's ANCHOR CLAIM

`14c`'s own header asserts "There is NO ford plate in the detail register." Verified
independently rather than taken on the section's word: `grep -rl hf322` over the tree returns
three files (renderFolio, shapeCode.js, waterWorks.js) and no register catalogue; a scan of
`docs/DESIGN_REGISTER_PROGRAM.md` (577 lines) for `ford|shore|quay|weir|mill` returns only LAW
rows (L-REG-31 "fords exempt", L-REG-32 "Fords mirror: wide shallow reaches", REG-ROUTE/REG-WATER
scope lines) and **no hf-anchor for a ford**. CONFIRMED: the register carries no ford plate.

---

_(sections below are appended as the work lands)_

---

# §1 · DELIVERABLE 1 — i8's TWO DROPPED TRACE ROWS — ✅ CONFIRMED

## §1.1 What landed

`reg-instruments/i8-nodrift-trace.mjs`, TABLE-ONLY per the fixPlan's REG-I1 precedent
(no change to `roster()`, `audit()`, or the pass predicate):

- **`'12x'` V-QUAY — `trace: ['corpus']`.** Grounded in §636.2's mint (the blind round's own
  diagnosis: site furniture carried the one correct call, bare silhouette carried none) with
  every member of the closed vocabulary cited at its own use site — hf322's shore ladder (the
  jetty deck-edge on pile dots, the ranged bollards), hf133's mooring circles, hf122's
  treadwheel crane **as a plan** and its countable cargo — and the hf342-class projection
  discipline inherited from row 8f. The row states the difference from 8f explicitly: at the
  market square the leads' bare squares BOUND THE RESTRAINT, but neither lead draws quay
  working gear at all, so the 2–5-fixtures band is recorded as the **chair's own §636.2 mint,
  not claimed as a lead's grammar**. It also refuses to launder the review's "ZERO of hf322's
  eleven shore steps" into a verdict on this class: that measurement read the shared **8-arm**
  exhibit which per review I1 carried neither `--quay` nor `--vquay`.
- **`'14c'` FORDS — `trace: ['DRIFT']`, justified.** ⭐ THIS IS A JUDGMENT AND IT IS VETOABLE
  (J-CARINST-1 below). The marks all trace (the dashed margin is 15c's/8x's plate idiom for a
  bound crossed rather than built; the bed bars are 12x's `pierDeckEdge` pile row turned across
  the way) but **no viewed plate draws a ford** — verified independently, §0.3 — so not one mark
  is cited IN ITS ROLE. Calling the class 'corpus' because its strokes are corpus strokes is
  precisely how a novel visual language launders itself past this instrument.
- The table's DRIFT header comment is amended from "THE THREE DRIFT ROWS" to **four rows of TWO
  KINDS** — KIND 1 the truth layer becoming ink (4b/4c/15b, incurable by looking), KIND 2
  uncited-in-role (14c, curable by looking and already dated to REG-6). A KIND-2 row that
  outlives its scheduled cure is the instrument's alarm.

## §1.2 Executed proof

```
$ node i8-nodrift-trace.mjs --wt=$SP/laneBRIDGE-tree
  traced=36  driftJustified=4  UNTRACED MISSES=0  staleRows=0
  by reference: watabou=12  ftg=12  corpus=33  DRIFT=4
I8_PASS                                    EXIT=0
```
MISSES **2 → 0**, staleRows **0**. (was: traced=35 driftJustified=3 MISSES=2, I8_FAIL)

## §1.3 THE CONVICTING CONTROL — strike a row, prove the miss, restore byte-identical

```
BEFORE sha=90811964574250ac50bacbc408bb1e229efcfae198097f33f47ef353d9cb6754 bytes=29435
  [12x row struck programmatically → 26530 bytes]
  traced=35  driftJustified=4  UNTRACED MISSES=1  staleRows=0
  I8_FAIL                                  EXIT=1     ← C4 proven in the same act
AFTER  sha=90811964574250ac50bacbc408bb1e229efcfae198097f33f47ef353d9cb6754 bytes=29435
RESTORE: BYTE-IDENTICAL ✓
```

## §1.4 The ratchet's own controls, re-run

```
$ node i8-nodrift-trace.mjs --wt=... --controls
BASE      opClasses=40 traced=36 driftJustified=4 misses=0 stale=0
PLANTED   opClasses=41 misses=1  [{"id":"99z",...,"status":"UNTRACED"}]
TRIMMED   opClasses=39 stale=["15c"]
   ok  ×6  (was: BROKEN "the base roster is fully traced")
I8_CONTROLS LIVE                           EXIT=0
```

---

# §2 · DELIVERABLE 2 — i10's DEAD B1 CONTROL — ✅ CONFIRMED

## §2.1 THE DIAGNOSIS: the operand is alive; the CONSTANT died

Bisected at the seal on the city leaf, the strand curve is smooth and monotone:

| ring scale | 1.00 | 0.95 | 0.93 | **0.9248** | 0.92 | 0.90 | 0.85 | 0.70 | 0.60 |
|---|---|---|---|---|---|---|---|---|---|
| bodies stranded | 0 | **0** | 0 | **1** | 1 | 9 | 85 | 525 | 844 |

- **s\* = 0.92478** (bisection, 16 halvings, ε = 7.6e-6): the gentlest circuit shrink that
  strands anyone is **7.52 %**. `rings×0.95` sits on the **flat part** of that curve.
- So the answer to "the ring operand, or the armed geometry?" is **NEITHER, EXACTLY**: the ring
  operand is fully live (a 7.53 % shrink strands 1, a 12.5 % shrink strands 35, a 40 % shrink
  strands 844). What died is the **hand-chosen constant**, because the circuit at this seal
  stands 7.5 % outside its outermost enclosed building where at REG-I0 it stood under 5 %.
- Cause attribution — **PLAUSIBLE, not CONFIRMED**: no REG-I0-era worktree survives
  (`$SP/reg0/w3f-tree` is gone), so the old curve cannot be re-run. The corroboration is the
  same leaf's own counts moving in the recorded controls JSON: **drawn bodies 2163 → 2604,
  members 1549 → 1832, suburb 614 → 772**, and B2's 791 → 787. The mechanism (a flat curve at
  0.95) is CONFIRMED; which wave widened the clearance is not established here.
- ⭐ The structural finding underneath: **MEMBER ⇒ inside a walled epoch body ⇒ (at this seal)
  inside its own ring ⇒ HELD.** A finer plant-site sweep — step **0.25**, 8× REG-I0's step-2 and
  **6,708,274** in-body points — still finds **NO** plantable point. Census B therefore *cannot*
  return positive while §240.1 holds, so **Census B's zero is not independent of the hull zero**.
  That is why the re-mint also plants on the hull (§2.2's B3, review C5).

## §2.2 THE RE-MINT — derive the perturbation, never choose it (the §648.2 J-BR-7 precedent)

| arm | what it does |
|---|---|
| B1 plant-site sweep | step 0.25, reports the scanned count and the NONE as a measurement |
| B1 measured threshold | bisects s\*, reports it and `1−s\*` as a **watch figure** (the circuit's clearance over its own fabric) |
| B1 liveness ×5 | the threshold EXISTS above a 0.50 floor · it FIRES (≥1 at s\*) · it is SHARP (0 just above s\*) · it COUNTS (deeper shrink strands strictly more) · the REAL census still reads 0 at scale 1.0 |
| B3a (C5 ride-along) | §240.1's unverified zero gets a planted out-of-ring hull vertex — must count exactly one more |
| B3b (C5 ride-along) | the half-ring `closedPolygon` RESCUE clause is planted too — habitat found at 538,456, and the vertex is **rescued not counted** |

The dead `rings×0.95` reading is **kept and printed** as the death certificate, so the next
reader sees why the constant was retired rather than re-inventing it.

## §2.3 Executed proof — 12/12 liveness rows, and the shared rows unchanged

```
B1 plant-site sweep   step=0.25, 6708274 in-body points — NONE, ...
B1 MEASURED THRESHOLD s* = 0.9248  → the gentlest circuit shrink that strands anyone is 7.52%
   rings×s*  outside=1/1832 | rings×(s*+7.6e-6) outside=0 | rings×(s*-0.05) outside=35
   rings×0.95 (the DEAD constant, kept as the death certificate) outside=0
B3 §240.1 baseline    epoch2:26v out=0 rescued=0  |  epoch1:26v out=0 rescued=0
B3a planted far vertex  outside=1 (baseline 0) at 1678,1739
B3b half-ring rescue    site 538,456 → outside=0 (baseline 0) rescued=1 (baseline 0)
   ok ×12
I10_CONTROLS LIVE                          EXIT=0
```
**Parity with the review's own run**: every arm this car did not touch reproduces to the digit —
A0 `0/12 sampled=196626`, X0 `0/12 worstMinSide=0.008`, A1 `4/12`, A2 `+1` both arms, A3 `5/6
worst=0.265`, B0 `0/1832 suburb=772 drawn=2604`, B2 `787/1832`, XC `0 disagreements`.

## §2.4 THE REAL CENSUS STILL READS ITS ZEROS WITH THE NEW CONTROL LIVE

`REG_FABRIC_OPTS` all-armed, `--leaves=ALL`, 18 leaves — reproduces the §654 review's
`ti-logs/i10-armed.log` **exactly**:

```
CENSUS A · STRADDLE (law's predicate)  = 0 of 87 district regions, on 12 walled leaves of 18
CENSUS A · cross-check (no band)       = 5 of 87
CENSUS B · OUTSIDE-CIRCUIT BODIES      = 0 of 17669 members (7976 suburb, 30000 drawn bodies)
§240.1 hull vertices outside own ring   = 0
I10_DONE                                   EXIT=0
```

---

# §3 · DELIVERABLE 3 — THE TANGENTIAL-OR-CLEAR CENSUS, BUILT — ✅ BUILT, ⛔ THE CENSUS REDS

`reg-instruments/i12-tangential.mjs` (instrument 12, registered in INSTRUMENTS.md's index).

## §3.1 THE PREDICATE — three clauses, counted separately and never merged

§575.1's two limbs plus §645.2's third clause, made falsifiable:

- **C1 · CROSSING** — a body whose FOOTPRINT intersects the wall polyline. A violation outright,
  whichever limb it might otherwise have claimed.
- **C2 · TANGENT-OR-CLEAR** — a body within REACH is lawful iff **(A)** its own axis lies within
  BAND° of the wall's LOCAL tangent, or **(B)** it stands clear (d ≥ CLEAR on its side) AND the
  stretch of wall it faces is clear on BOTH sides. ⭐ **Limb B is a property of the STRETCH, not of
  the body, and that is what stops the law being tautological**: a body sitting in the intervallum
  destroys limb B for its whole stretch, so every non-tangential neighbour there is convicted with
  it — which is §575.1's regime B ("kept clear for troop movement") stated as a measurement.
- **C3 · CONTINUITY** — §645.1's own read, in numbers rather than eyes: the tangential SHARE
  reported separately for the inside and outside cohorts. Scores nothing (it is not in §575), but
  a wall whose two cohorts agree at a LOW share IS the owner's catch.

**Each body's axis is derived from its own polygon** (the min-area-rectangle long axis), never read
off `grainAngle` or any other stamp the fabric wrote — the same anti-vacuity discipline i10's
cross-check uses. A body too square to have an axis (aspect < 1.25) is reported **EXEMPT**, not
quietly counted lawful.

## §3.2 EVERY THRESHOLD DERIVED FROM THE FABRIC, NOT CHOSEN

The wall publishes its own band decomposition and it is *already* frontage-derived — measured, not
assumed: on `town`, `bandParts.outer` = 4.8241 = **frontage exactly**, `bandParts.inner` = 2.4120 =
**frontage/2**; on `city`, `inner` = 2.6797 = frontage/2 likewise.

```
CLEAR_IN  = bandParts.half + bandParts.inner      the intervallum / wall-lane
CLEAR_OUT = bandParts.half + bandParts.outer      the glacis (≈frontage where glacisClear, ≈0 where not)
REACH     = half + max(inner,outer) + medianPlotDepth
                                       ↑ measured per leaf, perpendicular to each parcel's own plotLine
town:  reach 14.23 u = 2.94 frontages   ·  city: reach 9.46 u = 1.76 frontages
```

## §3.3 THE CONTROLS — §645.2's own rule, and the instrument must ACQUIT as well as CONVICT

Six plants. **LIVE on all 12 walled leaves** (`out/i12-controls-<leaf>.log`); 11 of 12 exercise P6
(`year-100` holds 2 bodies within reach of its whole 2,404 u circuit, so limb B has no habitat
there — reported as **UNEXERCISED, not proven**, and the row is not pushed).

```
P1 body laid ACROSS the line        C1 crossing 16 → 17            (+1 exactly)
P2 PERPENDICULAR in the clear zone  verdict=VIOLATION_IN_CLEAR_ZONE_NOT_TANGENTIAL  d=3.52 Δ=90°
P3 the SAME body turned TANGENTIAL  verdict=LAWFUL_A_TANGENTIAL    Δ=0°, lawfulA 25 → 26
P4 perpendicular FAR outside reach  nothing moves (C1, C2, withinReach all identical)
P5 bodyAxis on known rectangles     20×4 at 0.3 rad → ang 0.3, aspect 5; turned 90° → Δ 90.0°; a square has no axis
P6 STRETCH COUPLING                 victim org.district.government_quarter/p.7.0.1 (d=7.87, seg 32)
                                    was LAWFUL_B_CLEAR → VIOLATION_STRETCH_NOT_CLEAR;  lawfulB 21→19
I12_CONTROLS LIVE                   EXIT=0
```

⚠⚠ **TWO CONTROL DEFECTS THE PLANTS CAUGHT IN MY OWN INSTRUMENT, recorded because both are the
classic shapes.** (a) P2's first plant read its verdict out of the **capped** 30-row offender list,
which was already full at 98 violations — the plant was convicted and the control still said
BROKEN. The uncapped row set exists now for exactly that reason. (b) P2's plant was first sized
like P1's, and on `city` (clearIn 5.47) a 6-unit body centred at clearIn/2 **reached back across
the line** and was correctly filed as CROSSING — so C2 never moved and the control read BROKEN
**when the instrument was right**. A plant must be sized to the zone it is meant to stand in.

## §3.4 ⛔ THE HONEST FIGURES AT THE SEAL — all 18 leaves, armed

```
C1 · FOOTPRINTS CROSSING THE WALL LINE   = 237   (12 scoring circuits on 18 leaves)
C2 · TANGENT-OR-CLEAR VIOLATIONS         = 688 of 1621 bodies within reach  (42.4 %)
     lawful A tangential 212 (13.1 %) · lawful B clear 246 (15.2 %) · exempt no-axis 238 (14.7 %)
     relict (old-core, NON-SCORING per §250.5): crossing = 0, violations = 0
I12_FAIL                                  EXIT=1
```

⚠ The 12 scoring circuits are **8 DISTINCT** ones: town/siege/plague/famine are the same circuit
(23 crossings, 87/86 violations each) and city/migration are the same (37/37). Read as 8
observations, not 12.

**Per circuit** (`nearW` = bodies within reach; `tangShare in|out` is C3):

| leaf | reach | nearW | CROSS | VIOL | lawA | lawB | exempt | tangShare in\|out |
|---|---|---|---|---|---|---|---|---|
| town (+siege/plague/famine) | 14.23 | 188 | 23 | 87 | 20 | 27 | 31 | 0.184 \| 0.088 |
| town-2 | 18.66 | 234 | 35 | 138 | 32 | 15 | 14 | 0.171 \| 0.146 |
| city (+migration) | 9.46 | 129 | 37 | 37 | 22 | 14 | 19 | 0.228 \| 0.306 |
| metropolis | 8.65 | 25 | 6 | 6 | 5 | 4 | 4 | 0.000 \| 0.385 |
| polycentric | 9.25 | 157 | 10 | 23 | 32 | 64 | 28 | 0.220 \| 0.286 |
| highwater | 15.59 | 3 | 0 | 1 | 0 | 1 | 1 | 0.000 \| — |
| year-100 | 14.26 | 2 | 0 | 1 | 0 | 0 | 1 | — \| 0.000 |
| crossing | 16.47 | 191 | 20 | 98 | 19 | 26 | 28 | 0.131 \| 0.107 |

## §3.5 NO VERDICT IS HOSTAGE TO A THRESHOLD — the sensitivity grid

```
── SENSITIVITY GRID · C1 crossing / C2 violations, over reach × tangency band
  reach×  band 10°      band 15°      band 20°      band 30°
  0.5     237/231       237/218       237/195       237/139
  1       237/743       237/688       237/623       237/486
  1.5     237/1372      237/1279      237/1162      237/896
  2       237/1979      237/1853      237/1701      237/1338
```

⭐⭐ **C1 = 237 at EVERY cell.** The crossing count involves no threshold at all, so it is not a
choice — 237 footprints cross the wall line, and no setting of reach or band can move that number.
C2 never reaches zero anywhere on the grid: the *most* generous corner available (half reach, a 30°
band) still convicts **139**.

## §3.6 THREE DEFINITIONS OF "THE LINE", REPORTED SIDE BY SIDE (§648.3's banked defect class)

The ring is published OPEN and used CLOSED — `pointIn(w.polygon, …)` closes implicitly, but the
vertex list never repeats its first point, and measured end-gaps run **0.3 u (town) to 43.7 u
(metropolis)** on perimeters of 1,800–3,100 u. `halfRing` does **not** predict it: metropolis,
polycentric and crossing all report `halfRing=false` with gaps of 43.7/11.5/27.6 u. A half-ring's
gap is the RIVER and no stone is drawn across it, so closing would INVENT crossings. Default is
therefore OPEN, and the alternatives ride beside it:

```
  definition              C1 crossing  C2 violations  within reach
  drawn-OPEN  (primary)           237            688          1621
  drawn-CLOSED                    238            692          1626
  claimLine-OPEN                  225            718          1608
```
The choice is **immaterial**: closing the rings adds exactly **one** crossing corpus-wide, and the
claim centreline (≈1.2 u off the drawn ring) moves C1 by 12 and C2 by 30. All three readings sit in
the same regime, so the headline is robust rather than an artefact of a definition.

## §3.7 ⭐⭐ HAND-VERIFIED, NOT TRUSTED — one crossing traced to its coordinates

```
crosser org.district.government_quarter/p.8.1.1 (parcel, d=7.19 from the line, seg 30, inside)
  body edge 1 [762.78,473.79]→[773.06,466.64]  crosses wall seg 30 [797.16,517.98]→[770.01,460.80]
  body edge 3 [772.31,465.56]→[768.37,468.29]  crosses wall seg 30 [797.16,517.98]→[770.01,460.80]
  total edge-crossings for this body: 2   (6-vertex polygon — it enters and leaves)
```

## §3.8 ⭐⭐ RECONCILIATION AGAINST THE REVIEW'S EYES (B2 / B3 / §645.1) — armed

The brief's warning was right to insist on this, and the census does **not** contradict the eyes.

**First, the scope caveat, stated plainly: B2 is about STREETS crossing ungated walls; this census
counts BODIES.** They are different objects and the street-crossing count belongs to CAR-WALLS /
REG-ROUTE. What the census can do is say whether the *fabric* also crosses, and where.

| the review's claim | what the census measures |
|---|---|
| **B2** "town S circuit: ≥4 aligned street crossings, 0 gates on the stretch" | town's main circuit carries **23 body crossings, 18 of them SOUTH** (SW 13 + SE 5), and the whole 2,023 u circuit has **2 gates + 2 water gates — one opening per 506 u**. The fabric crosses where the eye said the streets do. |
| **B2** "replicates siege/plague/famine" | identical circuits, identical figures (23 crossings, 87/86 violations) — the replication is exact. |
| **B2** "polycentric NW" | polycentric's circuit has **ONE gate on 2,304 u** and 10 crossings (NW 3, SE 5, NE 2) — B2's "ungated" complaint at its extreme. |
| **B2** "engine physicalViolations=0 is blind to the class" | CONFIRMED from the other side: i10's straddle census reads **0 of 87** district regions at this same seal while i12 reads **688 of 1621 bodies**. Two censuses, one fabric, opposite answers — because i10 counts DISTRICT REGIONS and this counts BUILDINGS, which is exactly the gap §645.2 was minted to close. |
| **B3** "circuits truncate in open ground"; **I8** "wall-around-wasteland" | corroborated numerically: **highwater holds 3 bodies within reach of a 2,454 u circuit; year-100 holds 2 within reach of 2,404 u.** Those two leaves' near-zero C1/C2 are NOT the law being satisfied — they are walls with almost nothing near them, and the census says so on its own face (`nearW` is printed beside every verdict). |
| **§645.1** "the upper-left corner and top-left run carry fabric CONTINUOUS across the wall line (same grain both sides)"; "the bottom-right coastal strip runs straight through the curtain to the shore" | city's 37 crossings sit **NW 10 · NE 7 · SW 15 · SE 5** — present in the upper-left AND the southern/coastal quadrants, as the owner read them. |
| **§645.1** "same grain both sides" | **This is the finding C3 was built for, and it holds.** Inside-vs-outside tangential shares: town 0.184/0.088 · town-2 0.171/0.146 · city 0.228/0.306 · crossing 0.131/0.107 · polycentric 0.220/0.286. The two cohorts agree closely on every populous circuit **and both are LOW** — median Δ to the wall's local tangent is **32–46°** everywhere. The fabric has one grain, it continues across the wall, **and it is not the wall's grain.** |

⛔ **THE ANSWER TO "A ZERO HERE WOULD MEAN YOUR PREDICATE IS WRONG": THERE IS NO ZERO.** The census
reds on 8 of 8 distinct circuits that carry any fabric at all, at every threshold on the grid, under
all three line definitions. Nothing needed to be explained away.

⚠ **The two zeros that DO appear are honest and are not acquittals**: (a) highwater/year-100's
near-zero counts are the empty-ground case above; (b) the **relict old-core rings read 0 crossings
and 0 violations** — and their tangential shares are the *highest* in the corpus (city old-core
0.588 inside, metropolis old-core 0.548, highwater old-core 0.571). The SUPERSEDED circuits obey
§575 and the STANDING ones do not, which is what row 15a would predict: an old wall line survives
as street curves the fabric grew along. They are non-scoring per §250.5 and reported on their own row.

---

# §4 · DELIVERABLE 4 — EXIT-CODE HYGIENE (review C4) — ✅ CONFIRMED

`process.exitCode = 1` on every FAIL/BROKEN path of **i8** (2 paths), **i5** (2), **i10** (1), and
on the two new instruments **i12** (2) and **i13** (2) by construction.

## §4.1 Deliberate reds, with `echo $?`

| instrument | deliberate red | EXIT | restored |
|---|---|---|---|
| i8 | the `12x` row struck from the committed table | **1** (`I8_FAIL`) | sha `90811964…` byte-identical ✓ |
| i5 | the review's own armed-city invocation (a REAL pre-existing red) | **1** (`I5_FAIL`) | n/a — no edit to the subject |
| i10 | `SCALE_FLOOR 0.50 → 0.9999`, so no strand threshold exists | **1** (`I10_CONTROLS BROKEN`, 4 rows) | sha `c4c2946c…` byte-identical ✓ |
| i12 | none needed — the census is genuinely red at the seal | **1** (`I12_FAIL`) | n/a |
| i13 | the recorded measurement perturbed ON DISK | **1** (`I13_FAIL`) | sha `543616f6…` byte-identical ✓ |

## §4.2 THE ACTUAL C4 SCENARIO, executed

```
$ node i5-role-contrast.mjs --base=… --png=… && echo "CHAIN CONTINUED"
CHAIN STOPPED at the red  ✓  ($?=1)
$ node i12-tangential.mjs --wt=… --leaves=town && echo "CHAIN CONTINUED"
CHAIN STOPPED at the red  ✓
$ node i8-nodrift-trace.mjs --wt=… && echo "CHAIN CONTINUED on green"
CHAIN CONTINUED on green  ✓        ← a green instrument must NOT stop the chain
```

## §4.3 ⚠⚠ DECLARED BEHAVIOUR SHIFT — i5 on the city now exits 1 where it exited 0

The city plate's `street:ground` (1.9118 vs 2.10) and `water:ground` (1.2762 vs 1.35) floors are the
**recorded pre-existing REG-0 charter-row state**, both improving (1.727 → 1.9118, 1.1246 → 1.2762).
`i5` therefore now exits **1** on the city where it exited 0 yesterday. **That is the fix working,
not a regression** — C4's whole complaint is that a caller could `&&` past a recorded red forever.
Any chair-side script that chained i5 and relied on its silence must now branch on it deliberately.

**Proof that nothing but the exit code moved**: i5's stdout on the review's own armed-city
invocation is **byte-identical** to `review654/ti-logs/i5-armed-city.log` (verified by string
comparison after stripping the trailing `EXIT=` line the review's harness appended).

## §4.4 One FAIL path deliberately NOT grabbed (deferred — documented, not a bug to re-find)

`i10`'s **census** path prints `I10_DONE` and no verdict at all: it emits four numbers whose exit
criterion is zero, and renders no PASS/FAIL. C4 named "instruments that print FAIL/BROKEN yet exit
0", and this is a different defect — *an instrument with no verdict to print*. Adding one would
change i10's contract rather than repair it, so it is **recorded here for CAR-WALLS/REG-9 rather
than grabbed**: i10's census run cannot currently red at all, whatever it measures.

---

# §5 · DELIVERABLE 5 (chair addendum, ODQ §660) — THE WSEAM AGREEMENT RATCHET — ✅ CONFIRMED

`reg-instruments/i13-wseam-ratchet.mjs` (instrument 13, registered in the index).

## §5.1 ⚠⚠ THE ADDENDUM'S TWO FIGURES WERE CROSSED — verified against the receipt, as instructed

The addendum gave the mirror class as 208,644 u² and asked me to check whether it was 50,444 u².
**It is 50,444 u², and the ratchet pins what the receipt measured.** `laneMEASURES-receipt.md` §6.2
defines the class in its own words:

> "MIRROR CLASS: **50,444 u² corpus-wide** the law refuses as standing water with NO water drawn on
> it — an invisible refusal."

while 208,644 u² is the row above it, `⛔ DRAWN∧¬SUB` — drawn river the ground law scores buildable.
The receipt's corpus line carries both:

> "CORPUS  drawn 214269 u²  ·  AGREE 5625 u²  ·  ⛔ DRAWN∧¬SUB 208644 u²  ·  ⚠ SUB∧¬DRAWN 50444 u²"
> "CORPUS AGREEMENT INSIDE THE DRAWN RIVER: 2.63 %"

Re-added independently from the receipt's own nine per-leaf rows: drawn **214,268.8** · AGREE
**5,625.1** · DRAWN∧¬SUB **208,643.8** · SUB∧¬DRAWN **50,444.1**, and the identity
`drawn = AGREE + DRAWN∧¬SUB` closes exactly (214,268.8 = 5,625.1 + 208,643.8), which settles the
naming beyond doubt. Agreement recomputes to 2.6253 %, matching the printed 2.63.
**Both figures are pinned, each under its own name**, since §6.7 row 4 asks for agreement *and*
DRAWN∧¬SUB and the addendum asks for the mirror class.

## §5.2 WHAT IT PINS AND WHICH WAY THE RATCHET TURNS

| figure | pin | direction |
|---|---|---|
| agreement inside the drawn river | **2.63 %** | FLOOR — may rise, never fall |
| ⛔ `DRAWN ∧ ¬SUB` | **208,644 u²** | CEILING — may fall, never rise |
| ⚠ `SUB ∧ ¬DRAWN` (the MIRROR class) | **50,444 u²** | CEILING — may fall, never rise |

⚠ **PER-LEAF pins as well as corpus ones**, because a corpus total can hold while one leaf collapses
— town-2 alone carries 22.58 % agreement and 28,762 u² of the mirror class, and a corpus-only pin
would let the other eight rot behind it. The leaf ROSTER is pinned too: a leaf that silently stops
being measured must not read as clean. ε is one grid cell (6.25 u²) / 0.01 pp — anything tighter
would red on transcription rounding.

⭐ An **IMPROVEMENT** passes but prints as a **DECLARED SHIFT** with the exact re-pin values,
because a ratchet guarding a floor the code has already cleared is guarding nothing.

Per the chair's "reuse the lane's method": the ratchet **invokes CAR-MEASURES' own
`wseamCensus.mjs`** rather than re-deriving the measurement, and **voids its own verdict** if that
census's `WSEAM_CONTROLS` come back BROKEN.

## §5.3 Executed proof — a FRESH re-measure, not a re-read

```
FRESH RE-MEASURE of review654/out-armed in 21.0s — the WSEAM census's own controls: LIVE
   config: grid=400 limit=0.64  matches the pin
   figure                                             measured       pinned  direction
   agreement inside the drawn river (%)                   2.63         2.63  FLOOR
   ⛔ DRAWN∧¬SUB (u²)                                  208643.8       208644  CEILING
   ⚠ SUB∧¬DRAWN — the MIRROR class (u²)                50444.1        50444  CEILING
   drawn river area (u², scale check)                 214268.8       214269  reported
   leaves measured 9/9
I13_PASS                                   EXIT=0
```

## §5.4 Liveness — perturb one number, it reds; restore, byte-identical

```
C0 baseline (recorded measurement, sha 543616f65777…)  I13_PASS  fails=0 shifts=0
C1 town-2 agreement 22.58 → 11.00   I13_FAIL  fails=4 (corpus agreement | corpus DRAWN∧¬SUB | town-2 agreement | town-2 DRAWN∧¬SUB)
C2 mirror class ×1.5 corpus-wide    I13_FAIL  subNotDrawn=75666.6 (ceiling 50444)
C3 highwater dropped from the run   I13_FAIL  missing=["highwater"]
C4 agreement improved corpus-wide   I13_PASS  shifts=20 fails=0     ← improvement surfaces, never silent
C5 grid 400 → 200                   I13_FAIL  configOk=false
C6 on-disk perturb → exit=1, verdict=I13_FAIL; restored sha 543616f65777… BYTE-IDENTICAL ✓
   ok ×8
I13_CONTROLS LIVE                   EXIT=0
```

---

# §6 · JUDGMENT ROWS — ALL VETOABLE

- **J-CARINST-1 · `14c` FORDS is a DRIFT row, not a corpus row.** Chose DRIFT-with-justification over
  `trace:['corpus']` because although every stroke is a borrowed corpus stroke (15c's/8x's dashed
  bound idiom, 12x's hf322 pile row), **no viewed plate draws a ford** — independently verified, §0.3
  — so no mark is cited IN ITS ROLE, and §648.1's own words are "an unanchored blob-chain". Blessing
  it 'corpus' because its strokes are corpus strokes is how drift launders itself past this exact
  instrument. The row costs nothing in pass/fail (DRIFT_JUSTIFIED is not a miss) and prints its ⚠
  line on every run until REG-6's re-cut retires it. *Say "veto" to make it `['corpus']`.*
- **J-CARINST-2 · the DRIFT roster is now documented as TWO KINDS.** The table's header said "THE
  THREE DRIFT ROWS … all three are the engine's TRUTH layer surfacing as ink", which J-CARINST-1
  would have made false. Amended to KIND 1 (truth-layer, incurable by looking) and KIND 2
  (uncited-in-role, curable and dated). *Veto flips it back to a single undifferentiated roster.*
- **J-CARINST-3 · i10's B1 perturbation is DERIVED, not re-chosen.** Chose a bisected threshold over
  simply raising 0.95 to a larger constant, because a constant on a smooth curve dies again — quietly
  — at the next seal. §648.2's J-BR-7 is the precedent. The dead 0.95 reading is kept and printed as
  its own death certificate. *Veto substitutes a fixed larger factor.*
- **J-CARINST-4 · C5's §240.1 half was taken as a ride-along.** Not in my four deliverables, but it is
  in the fixPlan's own CAR-INSTRUMENTS row, it is ~15 lines, and B1's finding made it necessary
  rather than optional: Census B's zero is not independent of the hull zero, so leaving §240.1
  unverified would have left the re-minted B1 leaning on an unproven number. *Veto strikes B3a/B3b.*
- **J-CARINST-5 · i12 scores WORKING circuits only; relict old-core rings are measured but
  non-scoring.** Follows §250.5 and i10's own exclusion. Their figures are printed on a starred row
  (and are the most law-abiding in the corpus, §3.8). *Veto folds them into the scored totals.*
- **J-CARINST-6 · i12's default line is the OPEN polygon.** A half-ring's end gap is the river and no
  stone is drawn across it, so closing would invent crossings; `--xcheck` reports closed and
  claim-line beside it and the difference is 1 crossing corpus-wide. *Veto makes CLOSED primary.*
- **J-CARINST-7 · i12's `--controls` treats "no limb-B habitat" as UNEXERCISED, not BROKEN.** A leaf
  with 2 bodies within reach of its whole circuit cannot exercise the stretch coupling; the row is
  not pushed (an unexercised clause must not count as proven) and the gap is printed. *Veto reds it.*
- **J-CARINST-8 · i13 pins BOTH wrong-class areas, each under its own name.** The addendum named one
  figure and crossed the two; rather than pick, both are pinned with the receipt quoted. *Veto drops
  the DRAWN∧¬SUB ceiling.*
- **DEFERRED, RECORDED (not a bug to re-find):** i10's census path prints `I10_DONE` with no verdict
  and therefore cannot red at all — a different defect from C4's, handed to CAR-WALLS/REG-9 rather
  than grabbed (§4.4). And i12 measures BODIES, not STREETS: review B2's street×wall crossings and
  its gate-count law remain CAR-WALLS' / REG-ROUTE's, and this census is not a substitute for them.
- **NOT TOUCHED:** C5's *first* half — the `bridgeAngles` header label "(armed is byte-identical on
  bridge records)", stale since `--deck` re-sites 17 decks. It lives in a different instrument
  (`bridgeAngles`), it is a message-text edit, and it was not in my four deliverables. Still open.

---

# §7 · THE FINAL GATE — every instrument, every mode, at the final snapshot

```
=== SHAs BEFORE ===
5cab0882…  i5-role-contrast.mjs      90811964…  i8-nodrift-trace.mjs
c4c2946c…  i10-censuses.mjs          1b88705d…  i12-tangential.mjs
9b49ff7e…  i13-wseam-ratchet.mjs

i8  base (expect PASS, 0)                     EXIT=0   I8_PASS
i8  --controls (expect LIVE, 0)               EXIT=0   I8_CONTROLS LIVE
i10 --controls (expect LIVE, 0)               EXIT=0   I10_CONTROLS LIVE
i5  --controls (expect LIVE, 0)               EXIT=0   I5_CONTROLS LIVE
i5  city plate (expect FAIL, 1)               EXIT=1   I5_FAIL
i12 --controls town (expect LIVE, 0)          EXIT=0   I12_CONTROLS LIVE
i12 census ALL (expect FAIL, 1)               EXIT=1   I12_FAIL
i13 --controls (expect LIVE, 0)               EXIT=0   I13_CONTROLS LIVE
i13 --from recorded (expect PASS, 0)          EXIT=0   I13_PASS

=== SHAs AFTER === ALL FIVE BYTE-STABLE ACROSS THE GATE ✓
```

Nine invocations, nine expectations, nine matches. No instrument mutated itself while running.

## §7.1 ARTIFACT INDEX

| what | path (under `$SP/reg-instruments/`) |
|---|---|
| i8 base run + controls | `out/i8-CARINST.log` · `out/i8-CARINST-controls.log` |
| i10 re-minted controls (+JSON) | `out/i10-CARINST-controls.log` · `out/i10-CARINST-controls.json` |
| i10 deliberate red | `out/i10-DELIBERATE-RED.log` |
| i10 full armed census, ALL leaves | `out/i10-CARINST-armed.log` · `out/i10-CARINST-armed.json` |
| **i12 the new census** | `i12-tangential.mjs` |
| i12 armed census, ALL leaves | `out/i12-armed-ALL.log` · `out/i12-armed-ALL.json` |
| i12 controls, 12 walled leaves | `out/i12-controls-<leaf>.log` ×12 |
| i12 sensitivity grid | `out/i12-sweep.log` · `out/i12-sweep.json` |
| i12 line-definition cross-check | `out/i12-xcheck.log` · `out/i12-xcheck.json` |
| i12 reconciliation vs the review's eyes | `out/i12-reconcile-ARMED.log` |
| **i13 the new ratchet** | `i13-wseam-ratchet.mjs` |
| i13 fresh re-measure / recorded / controls | `out/i13-fresh.log` · `out/i13-from.log` · `out/i13-controls.log` |
| i5 exit-hygiene proofs | `out/i5-CARINST-city.log` · `out/i5-CARINST-controls.log` |
| index rows for instruments 12 and 13 | `INSTRUMENTS.md` (rows 8 and 10 also amended) |
| working probes (diagnosis + hand-verification) | `probe/*.mjs` |

## §7.2 WHAT THIS CAR DID NOT DO

- No repo bytes, no refs, no `git add`, no commits. The rendered tree `laneBRIDGE-tree` was read
  only. Everything written lives under `$SP/reg-instruments` and `$SP/receipts`.
- C5's `bridgeAngles` header label is **still stale** — different instrument, not in the four
  deliverables (§6).
- i10's verdict-less census path is **still verdict-less** — recorded, not grabbed (§4.4).
- The cause of i10's B1 death is **PLAUSIBLE, not CONFIRMED**: no REG-I0-era worktree survives to
  re-run the old curve (§2.1).
- i12 measures **bodies**; review B2's street×wall crossings and gate law are untouched (§3.8).
