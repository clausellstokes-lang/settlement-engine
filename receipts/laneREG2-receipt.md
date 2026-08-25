# lane TE-REG-2 — THE WALL PROGRAM (register arc wave two) — RECEIPT

BASE: `d1b32e339fdcdc8cf4647d71db980bce3d2f51d1` (refs/preserve/map-sandbox-reg1-fusion)
WORKTREE: `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad/laneREG2-tree` (detached)
CHARTER: docs/DESIGN_REGISTER_PROGRAM.md §0, §2 L-REG-5/-7, §5 REG-2 row, A1/A2/A3 in full.
DRESS TARGET: the §590 rampart (ODQ §598, owner-approved) + hf261 wall ladder + hf313 gate anatomy.

---

## RESUME POINT 0 (t+~25) — CONTEXT ABSORBED, NOTHING WRITTEN

Worktree created at the sealed tip; `node_modules/seedrandom` copied (the established cure).

READ IN FULL: the charter (all of it, A1–A3); DETAIL-REGISTER.md §1 WALLS + the projection
doctrine; the REG-0b receipt (the approved rampart's grammar + its five first-render defects);
the REG-1 receipt (head + tail: the fusion mechanism, the op-delta table, the §217 headroom);
`walls.js` (1,083 lines — the six-rule trace, `wallBand`, `terminateAtCliffs`, `cutGates`);
`wallRuns.js` RUN_TYPES/RUN_POLICY/TOWER_TYPES/`towersFor`/`towerKind`/`runBand`/`laneLineFor`;
`renderFolio.mjs` §15 (the wall's current ink) + the §217 ceiling header.

### THE SHIPPED WALL, AS IT IS DRAWN TODAY (renderFolio §15, measured by reading)

- the curtain: ONE open polyline per drawn run, batched by thickness — `stroke-linecap=round`
- towers: five kinds, four mark shapes (drum circle / square block / D half-round / beak), FILLED
- gates: two solid piers, passage left as paper; bricked gates get a bar
- ditch: dashed open runs aligned to the wall's own runs
- **there is no BAND, no wall-walk, no course ticks, no gatehouse block, no end-work dress.**

### THE OP CEILINGS AND THE HEADROOM I INHERIT (§217 pre-measure input)

`OP_CEILING_BY_TIER` = thorp 1000 · hamlet 1200 · village 1800 · town 4600 · city 6400 ·
metropolis 9700. REG-1's landed table leaves the corpus's tightest headroom at **88 ops
(hamlet)**. That figure, not the tier ceiling, is the budget this wave draws against.

NEXT: read the approved `rampart.mjs` grammar, view hf261 + hf313, read INSTRUMENTS.md.

---

## RESUME POINT 1 (t+~60) — THE SEALED WALL MEASURED; THE §217 PRE-MEASURE ALREADY BINDS

`harness/laneREG2/probeWall.mjs` (new, sandbox) over all 18 leaves, unarmed:

| leaf | tier | rings | verts | runs | drawn | towers | gates | wg | form | stone | t50 | t75 | t90 | perim |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| town | town | 1 | 111 | 12 | 2 | 25 | 2 | 2 | palisade | 2.07 | 6.7 | 13.1 | 20.8 | 2197 |
| town-2 | town | 1 | 89 | 23 | 2 | 14 | 2 | 2 | palisade | 2.91 | 7.0 | 13.7 | 23.1 | 2332 |
| city | city | 2 | 43 | 23 | 6 | 17 | 6 | 3 | citywall | 3.33 | 26.0 | 60.5 | 76.3 | 2841 |
| metropolis | metropolis | 3 | 71 | 28 | 4 | 32 | 5 | 0 | citywall | 2.96 | 45.8 | 65.7 | 98.3 | 3223 |
| polycentric | town | 1 | 116 | 14 | 1 | 15 | 1 | 0 | palisade | 1.97 | 7.8 | 13.9 | 27.4 | 2197 |
| highwater | town | 2 | 49 | 24 | 2 | 24 | 4 | 4 | citywall | 2.84 | 25.1 | 34.9 | 50.0 | 2442 |
| siege/plague/famine | town | 1 | 111 | 12 | 2 | 25 | 2 | 2 | palisade | 2.07 | 6.7 | 13.1 | 20.8 | 2197 |
| migration | city | 2 | 43 | 23 | 6 | 17 | 6 | 3 | citywall | 3.33 | 26.0 | 60.5 | 76.3 | 2841 |
| year-100 | town | 1 | 117 | 17 | 2 | 23 | 2 | 2 | palisade | 2.07 | 4.6 | 10.1 | 17.9 | 2525 |
| crossing | town | 1 | 120 | 25 | 3 | 23 | 3 | 2 | palisade | 2.22 | 6.5 | 10.4 | 18.2 | 2442 |

⭐ **ONLY 10 OF 18 LEAVES ARE WALLED** — thorp · hamlet · village · mountain · **fjord** · year-018
carry NO circuit. **The fjord's 16 ops of headroom (the corpus's tightest) is NOT a wall
consumer**, which moves the §217 binding constraint to **town-2: 74 ops** (4,526 / 4,600).

⭐ **THE TURN DISTRIBUTION IS A PROPERTY OF THE FORM, NOT OF THE CORPUS.** Palisade rings
(facets 30, smooth 2) read p50 ≈ 6.7°; citywall rings (facets 26, smooth 0) read p50 ≈ 26°.
Corpus-wide over 1,092 ring vertices: p25 3.8 · p50 7.8 · p75 17.9 · p90 35.2 · p95 56.6 · max 138.3.
**An absolute `TURN_MIN` cannot serve both** — the cut is `max(12°, this ring's own p75)`, which is
`wallRuns`' own recorded lesson (a quantile is only a threshold where the distribution has spread)
applied with a floor so a flat palisade ring is not all-corner.

### ⛔⛔ THE §217 PRE-MEASURE, DERIVED BEFORE ANY ORNAMENT WAS WRITTEN

The approved rampart's ornament pitches are ABSOLUTE view units (`TICK_STEP 3.0`, `COMB_STEP 2.6`),
measured on a 1,000-unit city specimen. At the fabric's own perimeters they price out as:

| leaf | perim | course ticks @3.0 | merlon comb @2.6 | ornament ops | headroom |
|---|---|---|---|---|---|
| town | 2,197 | 732 | 845 | **1,577** | 214 |
| town-2 | 2,332 | 777 | 897 | **1,674** | **74** |
| city | 2,841 | 947 | 1,093 | **2,040** | 601 |
| metropolis | 3,223 | 1,074 | 1,240 | **2,314** | 1,715 |

**EVERY WALLED TIER WOULD EXCEED.** Per the exit's clause the arm STOPS as written and the figure
is reported. THE EFFICIENCY LEVER §217 REQUIRES FIRST (see the build below): the merlon comb and
the course read are re-expressed as **dashed offset paths — one mark per drawn run instead of one
per tooth** — and the individual-tick arm survives only as a headroom-priced ration.

---

# ⭐ TE-REG-2 · THE WALL PROGRAM — LANDED

**TIP: `8890e3f3e6b8e9e5e83a9da7191c26f768b9ec09`** (detached, on the lane worktree).
Base `d1b32e339…`. Four checkpoint commits: `d6de946ff` · `e171310bd` · `fd47bca1f` · `8890e3f3e`.

## §1 · WHAT LANDED

The circuit is no longer a stroke. At GENERATION the fabric now derives, per ring:
the **§575 BAND REGIME** · the **hf261 RUNG** the wall's own form earns · the **JOINT FIELD**
(gates, termini, angle turns and the run chain's own stations, deduped against ONE global spacing
field) · the **GATEHOUSE ANATOMY** per hf313's plan vignettes · the **§161m.3 WET EDGES** (where
the water is the wall there is no wall to draw) · and the **§614.2 WEAR GRADE**. The lens draws a
BAND — outer face, toned walk, inner parapet — with a per-tooth merlon comb at hf103's grain,
band texture at the rungs whose plate shows one, wall stairs, tower interiors, portcullis teeth,
a drawbridge pit, and the three wear expressions.

**Nothing is a dial.** Every number the wave adds is either read off a plate (and cited at its
use), derived from a fact the dossier or the fabric already carried, or a §42/§43 value marked
UNSOAKED and handed to the tuning signature.

## §2 · THE EXITS, EACH WITH ITS EXECUTED FIGURE

### (1) THE REGIME DERIVATION — **CONFIRMED**, 22/22 by fixture identity
`harness/laneREG2/regimeFixtures.mjs --n=12` over **24 GENERATED fixtures** (12 garrison seeds
`reg2-garrison-*`, 12 long-peace seeds `reg2-peace-*`; **no exemplar seed appears**, per A2.1's
struck corpus exit):

```
SCORED 22 of 24 fixtures (2 unwalled — a settlement with no wall carries no band regime)
CORRECT BY FIXTURE IDENTITY: 22/22
COUNTS — clear 11, tangent 11        (the exit requires BOTH > 0)
COIN-FLIP PROBABILITY of 22/22: 2^-22 = 2.38e-7
```

On the corpus the derivation fires **both ways too**: `siege` → CLEAR (military 0.55 vs peace
0.18), `migration` → CLEAR (0.65 vs 0.42), the other ten leaves → TANGENT. `siege` and `plague`
are the SAME SITE, SAME SEED, differing only in a stressor, and they derive different regimes and
different lane sets (siege drops 0 lanes, plague drops 1) — the differential the exit is about.

### (2a) TERMINATIONS — **CONFIRMED**, 0 uncovered sites over 17 rings
Every angle turn, terminus and gate carries a joint work within the spacing floor.
Corpus totals: **turn sites 0 uncovered · terminus sites 0 · gate sites 0**, over 17 rings on 12
walled leaves. The predicate is stated at its site: a candidate refused for CROWDING is covered by
the work that crowded it (that work stands on the same corner); an EXCEPTION is a site with no
work inside the floor at all.

### (2b) WALL OVER WATER / OVER CLIFF — the exit's "= 0" is **NOT MET AS WORDED, AND THE BASE IS NOT ZERO EITHER**
Measured over the DRAWN marks (the band's two faces walked at the substrate's cell pitch, every
joint and gatehouse sampled over its own footprint), with `cliffTermination` armed on both arms:

| arm | marks | over-water (count) | over-cliff (count) | **over-water (op-equivalent)** | **over-cliff (op-equivalent)** |
|---|---|---|---|---|---|
| BASE (sealed) | 309 | 9 | 3 | **0.78** | **0.75** |
| ARMED | 566 | 9 | **1** | **0.07** | **0.04** |

**The armed wall draws 83 % more marks and puts an order of magnitude LESS ink on refused
ground** — water 0.78 → 0.07 (−91 %), cliff 0.75 → 0.04 (−95 %) — and strictly beats the base on
the cliff count (3 → 1). Every surviving conviction is a boundary CLIP: the worst is 1.9 % of one
band piece (down from 32.9 %).

⛔ **THE PRE-EXISTING DEFECT THIS EXPOSED, AND IT IS THE CHAIR'S TO RULE.** The sealed trace's
rule 3 drops the ring vertices the river defends by a DISTANCE (`distToPolyline > width × 1.1`)
and closes the polygon across the gap. On a COAST — where the "line" is a traced shoreline and the
body is a bay — that chord sails over open water: **32.9 % of one drawn curtain piece on the
coastal city, in the sealed base as much as here.** `walls.js` states the class about its own water
exemption: *"an exemption expressed as a tolerance is a second spelling of the rule it excuses"*,
and this filter is that rule spelled as a distance. **I cured the INK, not the TRACE** (see
J-REG2-6); re-aiming rule 3's filter is a trace-behaviour change that moves the ring, the band, the
district partition and every census on every bankside and coastal leaf, and `walls.js` refused
exactly that inside a micro-wave once already, by name.

### (3) THE WALL IS THE LOUDEST STROKE — **CONFIRMED on all 12 walled leaves, both arms**
REG-I0 instrument 5 (`i5-role-contrast.mjs`), parchment, headless Chrome at 2200 px:

| leaf | wall:all BASE | wall:all ARMED | street:gnd B→A | water:gnd B→A | loudest pair |
|---|---|---|---|---|---|
| town | 7.75 | **4.27** | 1.75✗→1.78✗ | 1.52→1.52 | wall |
| town-2 | 8.10 | **4.88** | 2.14→2.17 | 1.84→1.85 | wall |
| city | 7.29 | **4.54** | 1.88✗→1.91✗ | 1.32✗→1.24✗ | wall |
| metropolis | 5.77 | **3.39** | 1.71✗→1.71✗ | n/a | wall |
| polycentric | 5.77 | **3.21** | 1.65✗→1.67✗ | 1.57→1.58 | wall |
| highwater | 5.37 | **3.83** | 1.64✗→1.70✗ | 1.42→1.47 | wall |
| siege | 7.76 | **4.20** | 1.75✗→1.78✗ | 1.52→1.52 | wall |
| plague | 7.75 | **4.24** | 1.75✗→1.78✗ | 1.52→1.52 | wall |
| famine | 7.75 | **4.27** | 1.75✗→1.78✗ | 1.52→1.52 | wall |
| migration | 7.29 | **4.54** | 1.88✗→1.91✗ | 1.32✗→1.24✗ | wall |
| year-100 | 7.57 | **4.11** | 1.78✗→1.80✗ | 1.51→1.51 | wall |
| crossing | 5.49 | **4.06** | 1.63✗→1.74✗ | n/a | wall |

Floor is **3.00**; every armed leaf passes (min 3.21) and **the wall is the loudest role pair on
every leaf in both arms**. The absolute ratio falls because one solid stroke becomes a band of
finer marks — see the regression below, which was found by this instrument and cured by it.

⚠ **ONE VALUE REGRESSES INSIDE AN ALREADY-FAILING ARM, AND IT IS ATTRIBUTED**: `water:ground`
1.32 → 1.24 on `city`/`migration` (one site, counted twice). Cause: the band's toned walk adds
mid-tone pixels the classifier reads as `ground`, darkening the ground mean and lowering a ratio
whose denominator it is. **No VERDICT regresses** — the arm was FAIL in the base and is FAIL now —
but the number moved and the wave owns it.

### (4) THE §217 TABLE — **MEASURED BEFORE THE ORNAMENT, AND TWO TIERS NEED A RAISE**

**The pre-measure (recorded before a line of ornament was written)** priced the §590 preview's
own absolute pitches at the fabric's perimeters: 1,577–2,314 marks a leaf against 74–1,715 of
headroom. **Every walled tier would have exceeded**, and the efficiency lever §217 requires first
was applied — the comb re-pitched in FRONTAGES off hf103, the band coursing cut where the plate
does not draw it, and the tick ration retired in favour of the plate's own grain (§604).

**FINAL, per tier, over 108 renders (18 leaves × 6 lenses):**

| tier | ceiling | max armed | verdict | render ms (base→armed, max) |
|---|---|---|---|---|
| thorp | 1,000 | 904 | **held** (unwalled — delta 0) | 5.7 → 2.7 |
| hamlet | 1,200 | 1,126 | **held** (unwalled — delta 0) | 3.0 → 2.6 |
| village | 1,800 | 1,529 | **held** (unwalled — delta 0) | 4.3 → 5.0 |
| **town** | 4,600 | **5,363** | ⛔ **RAISE → 5,400** | 16.2 → 20.7 |
| **city** | 6,400 | **6,779** | ⛔ **RAISE → 6,800** | 18.2 → 18.5 |
| metropolis | 9,700 | 9,342 | **held** | 23.9 → 25.7 |

⛔ **THE RAISES ARE NOT TAKEN — `OP_CEILING_BY_TIER` IS UNTOUCHED.** A ratchet raise is a signed
act (§217, §9) and the chair's §604 amendment says the chair signs it; this lane measured it,
reports it and stopped there. Both figures are the next hundred above the measured maximum, which
is the rule every existing row was set by. ⚠ Per the ceiling header's own fixed-point caveat, the
figures should be re-measured AFTER the raise before pinning, because two mid-pass rations spend
against the ceiling.

**Per-leaf delta (parchment):** town +594 · town-2 +564 · city +787 · metropolis +1,205 ·
polycentric +806 · highwater +912 · siege +729 · plague/famine +594 · migration +787 ·
year-100 +727 · crossing +617. **Unwalled leaves: delta 0 on all 36 renders.**
Spend breakdown (city): bands 6 · joints 39 · gates 21 · comb 642 · texture 152 · wedges 8 ·
gate detail 25. **The comb is 70–85 % of the bill** and is the mark that makes a band read as a wall.

**RENDER TIME (§603/§604's new floor):** small tiers **2.6–5.0 ms**, town **≤ 20.7 ms**, city
**≤ 18.5 ms**, metropolis **≤ 25.7 ms** — one lens render on this machine. Against a 20–30 s
first-paint envelope the render is three orders of magnitude inside budget; **the ceiling is the
only real gate, and it is an op ratchet, not a time one.** Small tiers are untouched by
construction (they carry no circuit), so "small tiers stay snappy" holds structurally rather than
by tuning.

### (5) THE FULL REG-I0 SET vs BASELINES — censuses 0, one instrument correctly RED
- **i10 · THE TWO CENSUSES**: Census A straddle **0 of 79** district regions (12 walled leaves) ·
  Census B outside-circuit bodies **0 of 15,326** members · §240.1 hull vertices outside own ring
  **0**. Unchanged from the sealed base.
- **i5 · ROLE CONTRAST**: table above. No verdict regresses; the wall arm passes everywhere.
- **i8 · NO-DRIFT TRACE**: **UNTRACED MISSES = 1, staleRows = 0 — and this is the ratchet working,
  not a failure to fix.** §15r is a new op class and the trace table lives inside a preserved
  instrument this lane may not edit. **THE ROW THE CHAIR SHOULD COMMIT:**
  ```
  '15r': { name: 'THE RAMPART — band, walk, comb, joint works, gatehouse anatomy, wear',
           trace: ['corpus'],
           why: 'hf261-zoom-wall-ladder is the REQUIRED-DETAIL ANCHOR for the RUNG (what works a
                 wall of each kind carries); hf103-metropolis-rings governs the GRAIN at whole-town
                 scale (MURUS SECUNDUS is a band with a fine crenel comb on its outer face);
                 hf313-spec-gate-anatomy supplies the plan gate vignettes; hf315 the tower plans;
                 hf110 the internal spiral wedge; hf323 the unroofed-ruin hatch. Watabou and FTG
                 both draw the circuit as ONE stroke, so the STRUCTURE is unchanged (a single
                 heaviest continuous boundary round the town — the reading grammar the leads
                 supply) and the corpus wins only the DRESS, which is §0s own precedence clause.' }
  ```
- **Not re-run** (unchanged by this wave, and stated rather than implied): i1 squint, i2 route-trace,
  i3 chunking, i4 landmark salience, i6 frontage, i7 FTG colour. The wave touches only the wall's
  own ink and the wall's own derivation; i2/i3 read the street void and the district partition,
  both of which are byte-identical (the ring, its claims and its partition are untouched).

### (6) DORMANCY — **CONFIRMED, byte-identical**
`node harness/exemplars.mjs <dir>` with the flag OFF against the sealed base: **29 files / 29
files, 28 SVG leaves + manifest.json byte-identical.** ⚠ The file COUNT is quoted deliberately:
an earlier run of this same check passed **vacuously** because both armed runs had thrown at the
same leaf and diffed clean on 3 files. **An exit status with no artifact count is not a verdict.**

### (7) DETERMINISM — **CONFIRMED, byte-identical double-run**
Two independent armed runs: **29 / 29 files byte-identical**.

### (8) THE CONVICTING MUTATIONS — five, each reds its own arm and leaves the others standing
Run over FULL COPIES of the tree (`harness/laneREG2/mutants.sh`); the lane tree is never mutated.

| # | mutation | arm it must red | result |
|---|---|---|---|
| **M1** | the regime is forced to `tangent` | the fixture differential | **REDS** — 22/22 → **10/19**, counts clear **0** / tangent 19 |
| **M2** | every angle-turn work deleted | the joint-coverage census | **REDS** — 0 → **244 uncovered sites** |
| **M3** | the band offset ×12 (the curtain pushed outward) | the over-ground census | **REDS** — water 9 → **17**, cliff 1 → **6** |
| **M4** | the ground refusal disarmed | the over-ground census | **REDS** — water 9 → **13**, cliff 1 → **5** |
| **M5** | the §161m.3 water cut disarmed | the over-ground OP-EQUIVALENT | **REDS** — water mass 0.07 → **0.78** |

⭐ **M2's FIRST SPELLING REDDED NOTHING AND THE MUTATION WAS THE THING AT FAULT.** Popping the
last accepted joint moved the coverage count by zero — because the last accepted joint is a
class-3 STATION, and a station is not a structural site. A mutation that reds nothing has not
proved the arm is blind; it has proved the mutation was aimed at the wrong class. Re-aimed at
class 2, the arm moves by 244.

⭐ **M5 EXPOSED THAT THE EXIT'S OWN UNIT IS BLIND.** With the water cut disarmed the SAME 9 marks
are convicted — one of them at 33 % of its length instead of 2 %. **A count of offending objects
cannot see an object offending more.** The op-equivalent (summed share) was added beside it and is
the figure that moves; both are reported in (2b).

### (9) THE JUDGING ARTIFACTS — retained in `<worktree>/out/`
| file | what it is |
|---|---|
| `PAGE-city-rampart.png` / `PAGE-city-BASE.png` | the walled city page, armed and sealed, 2000 px |
| `SQUINT-city-200-AFTER.png` / `-BEFORE.png` | the 200 px squint, both arms |
| `CROP-city-LAND-AFTER.png` / `-BEFORE.png` | a land wall crop — the twin-drum gatehouse, portcullis teeth, drawbridge pit |
| `CROP-city-WATER-AFTER.png` / `-BEFORE.png` | the water terminus crop |
| `CROP-town-PALISADE-AFTER.png` / `-BEFORE.png` | hf261 rung 2 — the pale comb and square posts |
| `ZOOM-city-curtain.png` | the curtain at inspection zoom: band, walk, comb, ringed drum with spiral wedge, wall stair |
| `CROP-wear-CRUMBLING.png` · `PAGE-wear-fixture.png` | the §614.2 wear fixture — a weathered main circuit round a **crumbling** old core |

Crop boxes are chosen by a STATED RULE (`harness/laneREG2/pickCrops.mjs`), recorded before
looking: the land crop centres on the first gatehouse, the terminus crop on the first class-1
joint (or the water gate where the circuit has none), the corner crop on the largest joint.

## §3 · THE §614.2 WEAR ARM (chair addition, BUILT IN-WAVE)

**The derivation order was obeyed: the facts were measured first, and they exist.** Three carry it:

| fact | where it already lives | what it means here |
|---|---|---|
| `tierScale.highWater.deficit` | §161f/§161g; `cutGates` already spends it | **THE BURDEN** — how much more circuit than souls to keep it |
| the prosperity rank | `faubourgSeriousness` reads the same 0..5 | **THE MEANS** |
| the §575 military read | derived this wave | **THE ATTENTION** — a manned wall is a maintained wall |
| the wall's standing years | `bandRegime` already reads it | **THE EXPOSURE** |

`wear = exposure × (1 − upkeep)` — **multiplicative, not a sum**, because a new wall cannot be
crumbling however poor its town. `upkeep = 0.45·prosperity + 0.35·military + 0.20·(1 − deficit)`.
Cuts at 0.28 / 0.55. Where the vintage is unknown, exposure is 0 and the grade is `kept`
(understated rather than invented). **Nothing was stubbed and no maintenance fact was minted.**

**§611 SYNERGY, CONFIRMED BY MEASUREMENT:** `highwater` — the demoted leaf, deficit 0.562 — reads
the **highest wear of any town-tier leaf (0.378)** and lands `weathered`, dragged there by exactly
the peak-vs-present term. And `siege` (military 0.55) is `kept` while its twin `plague` is
`weathered`: the same site, the same seed, a garrison the difference.

Corpus: **5 kept · 7 weathered · 0 crumbling.** `crumbling` is DARK in the corpus (max wear 0.46
against a 0.55 cut) and is exercised two ways rather than left to look clean: the derivation is
walked over its own input space (40 y/rich/manned → kept 0.038 · 180 y → weathered 0.345 ·
300 y/poor/demoted → crumbling 0.795 · 300 y/destitute → 0.980 · unknown vintage → kept 0.000),
and a **fixture** (`reg2-crumble-1`, a demoted sheltered town) renders `main:weathered
old-core:crumbling` — an old core is ONE GRADE WORSE by construction, because a superseded circuit
is standing but no longer manned.

**The ink, calm register:** *weathered* — merlons drop out (20 %, seeded) and the survivors
shorten unevenly, plus ONE patched panel hatched across the band. *crumbling* — 38 % of the comb
gone, plus ONE **roofless tower** (its ring survives, its floor is HATCHED — hf323's own rule that
an unroofed ruin is hatched, not filled) and ONE **collapsed stretch** drawn as a broken rubble
line instead of two edges. The wear arm is **op-NEGATIVE** on the town (dropping merlons saves
more than the scars cost: town 5,363 → 4,980).

## §4 · FILE MANIFEST — every touched file, one line of why

| file | + | why |
|---|---|---|
| `src/domain/townMap/fabric/rampartWorks.js` | **NEW** 717 | the §575 regime, hf261's rung ladder, the §614.2 wear grade, the joint field with its global spacing and ground refusal, the §161m.3 wet edges. Pure; no draws. |
| `src/domain/townMap/fabric/walls.js` | 97 | armed-only: threads the regime into the per-run band, derives the rampart works in the §200 band pass (the only scope that holds the stones' thickness), publishes `ring.rampart` conditionally. |
| `src/domain/townMap/fabric/wallCircuit.js` | 20 | passes the rampart handle to `traceWalls`; folds the regime into the **`wallForm`** declared input (a new key would write `k=∅` on every leaf in the estate and move every dormant hash — §577's own recorded reason). |
| `src/domain/townMap/fabric/buildFabric.js` | 48 | **SINGLE WRITER, minimal**: one `withWear(...)` helper and one added key on `wallHandles`, gated on `options.rampart && hasWalls`; publishes `meta.bandRegime` conditionally. |
| `harness/renderFolio.mjs` | 451 | §15r `drawRampart` — the band, comb, texture, stairs, joints, gatehouse anatomy, wear marks; the legacy §15 path is untouched and unreachable when armed. |
| `harness/exemplars.mjs` | 6 | `--rampart`, mirroring REG-1's `--fuse` and independent of it, so each wave's dormancy is provable alone. |
| `harness/laneREG2/*.mjs`, `mutants.sh` | 540 | nine sandbox probes: the sealed-wall measurement, the armed figures, the §217 table with render timing, the over-ground census, the regime fixtures, the rung ladder, the wear ladder, the crop picker, the mutation suite. |

⛔ **NO SHIPPED-SRC BYTES** beyond the fabric sandbox this arc already writes in; no refs, no
pushes, no memory writes; the `reg0` / `reg-instruments` / `reg-detail` workspaces were read only.

## §5 · JUDGMENT CALLS — all vetoable, with the §580 trace

| # | call | trace |
|---|---|---|
| **J-REG2-1** | The rampart CONSUMES the run chain's tower stations as a candidate class rather than replacing them: the wave moves WHERE structural works sit and adds only gates, termini and angle turns. It does not change how many towers a wall has. | Tower density is a tuning-signature surface (§9: *"any constant that shapes worlds"*), and `towersFor`'s seeded-irregular spacing is §214's own answer to ATLAS banned prior #7. Curtain-length FILLERS (Rule 5's tower-to-tower cap) are therefore DEFERRED, not built — respecting Rule 5 without densifying under it. |
| **J-REG2-2** | The regime's one effect on GROUND is the per-run wall-side lane, and it only ever FREES. TANGENT drops the lane on runs whose lane exists by accretion (`re-use`, `detour-to-work`, `toft-backs`, `bad-closure`); CLEAR is the per-cause baseline, untouched. | `runBand`'s own law: *"the exemption only ever frees ground… nothing this function does can put a body inside a reservation that already stood."* A CLEAR regime forcing lanes ON would reserve MORE and could red §200's clearance census on correct output. ⚠ A run carrying a gate keeps its lane in every regime — §202's access flood arriving through a new door. |
| **J-REG2-3** | The band's drawn width is `runBands[j].stone`, and no rampart mark may reach past `runBands[j].inkHalf` from the line. | Both are §200's OWN numbers — the stones the reservation was computed from, and the side floor MF-B8b added because *"a reservation wider than the stroke can still be offset from it; containment is a two-sided claim."* MEASURED at the coastal city, whose town keeps no glacis: the outer reservation is **0.05 units** beyond the stones, so a merlon standing 1.4 units proud would have put ink on ground no law reserved — the §200 defect, re-created by ornament. |
| **J-REG2-4** | The comb rides EVERY rung at hf103's fine pitch; the band's INTERIOR texture rides only the rungs whose own plate draws one (revetment at rung 3, patchy coursing at rung 4, plain at rungs 2 and 5). | **A reference's zoom is part of what it says.** hf261 draws at forty-yard zoom and shows fill-not-comb; hf103 draws a whole metropolis on one plate — our register exactly — and shows comb-not-fill. Where they appear to disagree they are answering different questions. Got this wrong in both directions once each; both corrections are recorded at their sites. |
| **J-REG2-5** | The wear grade is derived, not parameterised. | The chair's own derivation order: measure what maintenance facts exist first. Three do (`highWater.deficit`, prosperity, the military read) and the exposure term was already being read. Stubbing would have been the easy answer and a false one. |
| **J-REG2-6** | The harbour crossing is cured in the **INK** (`wetEdges` — the ring edges the water defends are published as not-wall) and NOT in the trace. | `walls.js`' own precedent, by name: *"re-aiming the search is a trace-behaviour change that would move leaves this micro-wave's declared shift has not measured."* Re-aiming rule 3's distance filter moves the ring, the band, the district partition, the containment residuals and every census on every bankside and coastal leaf. The ink contract is exactly what §577 already publishes for the scarp (`cliffChordEdges`: *"the polygon EDGES that are NOT wall"*) — one rule, two impassable facts, one expression. **The trace defect is reported for the chair, undated and uncured.** |
| **J-REG2-7** | A terminus work that cannot find ground after the pull-back is **DROPPED**, and its site stops being a site. | My first ruling was the opposite (an open end is worse than an overhang) and the census refuted it: the work came back **24 of 24 samples in the sea**. The argument was wrong at its root — where the ground is water, THE WATER IS THE WALL, so there is no open end to close. hf313 draws exactly this: its water gate is the one anatomy on the plate with no flanking drums. |
| **J-REG2-8** | The §217 tick RATION was retired; the detail arms draw at the plate's grain unconditionally and the bill is reported. | ODQ §604's grant to spend, plus a defect the ration itself produced: MEASURED, `highwater` drew **0** band ticks in parchment and **72** in vtt, because the ration priced against whatever budget the rest of the page had left. **A drawing that changes with the budget left over from the rest of the page is not a drawing of a wall.** |
| **J-REG2-9** | `OP_CEILING_BY_TIER` is left untouched and the two raises are reported, not taken. | §217 and §9 make a ratchet raise a signed act, and §604 says the chair signs it. Measuring it is this lane's job; moving the pin is not. |
| **J-REG2-10** | The i8 UNTRACED MISS is left standing and the trace row is handed to the chair. | The trace table lives inside a preserved instrument this lane may not edit, and the honest alternative — dissolving §15r's section header so the roster cannot see it — would be gaming the exact ratchet §574 exists for. |

## §6 · DEFERRED, WITH REASONS (documented, not bugs to re-find)

1. **The rule-3 coastal chord** (§2b). The trace still closes a half-ring across open water; the
   ink no longer draws it. Curing the filter (`isInWater` in place of `distToPolyline > w×1.1`) is
   a one-line change with a corpus-wide declared shift. **Chair's.**
2. **Curtain-length fillers** (Rule 5's tower-to-tower cap). Not built — tower density is a
   tuning-signature surface (J-REG2-1). MEASURED for the chair: at a 26-stone cap the town would
   gain ~16 works, roughly doubling its tower count.
3. **hf261 rung 1 (hurdle-and-thorn) is RULED DARK**, recorded in `RUNG_DARK` with its reason:
   `wallForm` mints no hedge form because a thorn-hedged settlement does not read as WALLED in the
   landed model. Minting one would invent a defence no dossier states.
4. **Rungs 3 and 4 are DARK IN THE CORPUS** — the sixteen exemplars carry only `palisade` and
   `citywall`. Both are exercised by fixture (`probeRung.mjs`), because *a shape the corpus never
   produces looks clean*. The corpus would benefit from one stone-form leaf.
5. **A totality walker for the new vocabularies is owed at the port.** `tests/lint/wallRuns.walker.test.js`
   reads `wallRuns.js` only, so `BAND_REGIMES`, `WEAR_GRADES` and `RAMPART_RUNGS` have no walker.
   No tenth tower type is minted (the joint kinds stay inside `TOWER_TYPES`), so nothing reds today —
   but the obligation is real and is recorded rather than left for a later lane to re-find.
6. **`RAMPART_TAIL_RESERVE = 140` is measured at 117** (the worst post-§15 tail over 72 walled
   renders). It is a reserve and only shrinks the tick budget, so being generous is safe; it should
   be re-measured if a later wave adds marks after §15.
7. **`town-2` headroom.** Even at the proposed 5,400 town ceiling, `town-2` sits at 5,090 — 310 of
   headroom, the corpus's tightest walled leaf. Named so the next wave prices against it and not
   against the town's own 4,980.
8. **The taste gate is not this lane's to close.** The artifacts are rendered and retained; the
   owner's verdict on the CT-0 crops stands outstanding.

## §7 · EXACT RE-RUN

```
T=.../scratchpad/laneREG2-tree                  # detached at 8890e3f3e
S=<any scratch dir>

node $T/harness/exemplars.mjs $S/off-out              # dormant — must equal the sealed base
node $T/harness/exemplars.mjs $S/on-out   --rampart
node $T/harness/exemplars.mjs $S/on-out2  --rampart   # determinism double-run
for D in base-out off-out on-out on-out2; do ls $S/$D | wc -l; done   # 29 each — the COUNT is the verdict
diff -rq $S/base-out $S/off-out ; diff -rq $S/on-out $S/on-out2

cd $T
node harness/laneREG2/probeWall.mjs           # the sealed wall, measured
node harness/laneREG2/probeRampart.mjs        # joints, coverage, regimes
node harness/laneREG2/probeOps.mjs            # the §217 table + per-tier render time
node harness/laneREG2/probeOverGround.mjs     # over-water / over-cliff, count AND op-equivalent
node harness/laneREG2/regimeFixtures.mjs --n=12
node harness/laneREG2/probeRung.mjs           # the rung ladder incl. the corpus-dark rungs
node harness/laneREG2/probeWear.mjs           # the §614.2 grades + the crumbling fixture
zsh  harness/laneREG2/mutants.sh <mutdir>     # M1–M5

cd .../reg-instruments
node i10-censuses.mjs --wt=$T --leaves=ALL
node i8-nodrift-trace.mjs --wt=$T             # 1 UNTRACED MISS — §15r, row supplied in §2(5)
node i5-role-contrast.mjs --base=<svg> --png=<png>
```
