# THE LEGIBILITY INSTRUMENT SET — REG-I0

**Charter:** `docs/DESIGN_REGISTER_PROGRAM.md` — A2.1 item 3 (REG-I0, chartered first in the arc),
A2.2 (exit-criteria repairs), §6 (the two-legged exit), A1.3 (instrument additions).
**ODQ §602.2** ordered two repairs to i6 after REG-1 §11.1 measured them; both landed with lane
TE-REG-I0b and are written up below under **THE TWO ORDERED REPAIRS TO i6**.
**Subject:** the sealed fabric at **`d1b32e339`** (`refs/preserve/map-sandbox-reg1-fusion`) and the
renders `harness/renderFolio.mjs` emits from it. Fusion is DORMANT at that tip, and REG-1 §6
proved the unarmed render byte-identical to the prior seal `ee0db96d3` on 29 of 29 artifacts — so
the BASELINE is still that same drawing, now read through a repaired instrument. The ARMED render
is recorded beside it as a differential, never as the baseline.
**Sandbox-only.** No repo bytes. Every script is plain `node`, no dependencies, no network, and
contains no `Date` and no `Math.random` — same input, same digits, forever.

> **THE LANE'S ONE RULE.** *A figure without its denominator is not a measurement.* Every row every
> instrument emits carries `{instrument, value, denominator, band, pass}` where **denominator is
> named in words**, because the useful denominators here are populations rather than divisors:
> "the SD of the 8,924 ground px at 200×200" is what makes `1.57` mean something.

> **THE LANE'S SECOND RULE.** *A control that cannot fail proves nothing — and proving a ZERO is
> harder than proving a positive, because identical readings are exactly what a dead instrument
> returns.* Every instrument ships a `--controls` battery with at least one deliberately-failing
> plate or fixture, and the battery asserts that the break moves **its own** arm and **leaves the
> others standing**. Four real defects in this set were caught by that discipline and by nothing
> else; each is recorded at its site.

---

## THE INDEX

| # | Instrument | Formula | Denominator | Band | Controls |
|---|---|---|---|---|---|
| 1 | **SQUINT** `i1-squint.mjs` | Glass's Δ = \|μ(role px) − μ(ground px)\| / SD(ground px), at 200 px, per role on its own channel (street/wall = luminance, water = blue−red) | the GROUND pixel population's own SD, in channel units; role and ground pixel counts on every row | Δ ≥ **1.0** ground SD (Cohen's "large effect", external anchor) | flat-street / flat-wall / grey-water plates each collapse their own arm; a flat page scores exactly 0 |
| 2 | **ROUTE-TRACE** `i2-route-trace.mjs` | widest gate→heart path through the street void; bottleneck = max over paths of min corridor width, by bisection; width(cell) = 2 × distance to nearest non-void | length in view units against the straight-line gate→heart distance (`detourRatio`) | bottleneck ≥ **the leaf's own `web.widths.blockLane`** (derived, never a constant) | ring-sever isolates every gate outside the cut and leaves the one inside routed; an absurd floor fails all while still reporting widths; a gate at the void's farthest point is unreachable |
| 3 | **CHUNKING** `i3-chunking.mjs` | legibleWards = \|{district regions with area ≥ 5,000 sq units}\|; chunks = legibleWards + (wall ? 1 : 0) | `fabric.umbrella.partition` — the region count is printed beside every verdict | **[min(totalRegions, 5) … 9]** — Miller's ceiling fixed, the floor TIER-CONDITIONED so a thorp is not convicted for being small (L-REG-15) | 30 synthetic regions fail high; all-dust fails low and still prints its denominator; a one-region leaf passes on [1,9] |
| 4 | **LANDMARK SALIENCE** `i4-landmark-salience.mjs` | Glass's Δ of the top-4 landmark masses' luminance vs the fabric population | the FABRIC pixel population's SD, in luminance units | each mass ≥ **1.0**, group mean ≥ **1.5** fabric SD *(chair's, vetoable)* | **DECOYS** — the same four shapes translated onto urban fabric, measured by identical code; plus a POSITIVE `loud-landmark` plate the instrument must detect |
| 5 | **ROLE-PAIR CONTRAST** `i5-role-contrast.mjs` | WCAG ratio of the mean measured sRGB of each role — `folioLenses.luminance()`'s own formula applied to pixels instead of to the palette | the darker role's WCAG-adjusted luminance; both pixel counts on the row | street:ground ≥ **2.10** (§9.7's own "three value steps ≈ 1.28³"), wall:all ≥ **3.00**, water:ground ≥ **1.35** *(the last two chair's, vetoable)* | each broken plate drives its own pair below floor; every row also prints what `lensContrast()` would have PREDICTED from the palette, and the gap |
| 6 | **FRONTAGE** `i6-frontage.mjs` | F1 ratio = fronted/probes · F2 runs, meanRun, p50, p90, max · **F3 freestandingDensity = MASSES / INTRAMURAL BUILDING-INK AREA**, per 1,000 sq view units (`meanMassFootprint` is the same figure read the other way up) | F1: street-flank probes inside the urban envelope · F2: the run count · **F3: the SQUARE VIEW UNITS of building ink inside the circuit** (`closedPolygon`, or a named fallback) — the mass count is printed beside it on every row | REG-1 sets the target band; this lane records the baseline | reproduces REG-0's published city AND village figures exactly at the PINNED legacy grid; `--fuse=0` returns identically to the base; `--shatter=0.35` manufactures the §571.4 defect and every figure moves the right way; **F3's own arm** — closing the building ink must cut the mass count and the density and raise the mean footprint; **the grid arm** — 1400 must NOT resolve the leaf's party gap, the resolved N must, and the base's own figures must MOVE between them |
| 7 | **FTG COLOUR** `i7-ftg-colour.mjs` | conformance = saturated role px inside the category band / saturated role px; descriptor = the count-weighted modal 10° hue bin | the SATURATED role population — grey pixels are excluded from BOTH sides and reported as `greyShare` | water **185–265°**, field **35–70°**, town **0–60°**; conformance ≥ **0.60**; grey share ≤ **0.50** *(chair's, vetoable)* | `grey-water` drives water out of band and moves nothing else; the base plate is correctly reported ACHROMATIC rather than mis-hued |
| 8 | **NO-DRIFT TRACE** `i8-nodrift-trace.mjs` | roster re-derived from renderFolio's own numbered section headers, checked against the committed trace table | **40** op classes at the REG-BRIDGE seal `9de729021` (38 at REG-4's, 31 at REG-1's — the table grows with the roster: REG-I1, then CAR-INSTRUMENTS added `12x` V-QUAY and `14c` FORDS against review B9); an untraced class is a countable miss | **0 untraced misses, 0 stale rows**; every DRIFT row must carry a written justification. ⚠ THE FOUR DRIFT ROWS ARE OF TWO KINDS — KIND 1 the truth layer becoming ink (4b/4c/15b, incurable by looking); KIND 2 uncited-in-role (`14c`, curable by looking and dated to REG-6's re-cut by §648.1). A KIND-2 row that outlives its scheduled cure is the alarm | a planted section raises the miss count by exactly one; a removed section is reported as a STALE table row; **and the convicting control for the table itself** — strike a committed row, the miss count rises, restore byte-identically (sha-proven) |
| 9 | **BLIND SILHOUETTE** *(protocol, below)* | pass fraction of class-from-silhouette reads | N fixtures × 1 fresh-context reader | fixed at the REG-0 round (A2.2) | the DECOY sheet and the two refusal outcomes |
| 10 | **THE TWO CENSUSES** `i10-censuses.mjs` | A: the law's own `districtStraddlers` + an independent no-band cross-check · B: the shipped §241.6 predicate | A: district regions on walled leaves · B: drawn bodies that are MEMBERS of a walled epoch | **0** (§571.2's order) | the PRE-CURE `growthUmbrella.partition` is positive; a planted straddler is +1 exactly; withholding later rings strands 787. ⛔ **B1 RE-MINTED (review I15)**: the old `rings×0.95` arm DIED — it stranded 4 at REG-I0 and 0 at this seal, because the circuit now stands 7.52 % outside its outermost enclosed body and 0.95 sits on the FLAT part of a smooth curve. The perturbation is now DERIVED, not chosen: bisect the strand threshold s\* (0.9248 here, reported as a clearance WATCH FIGURE), then assert it EXISTS, FIRES, is SHARP, COUNTS, and leaves the real census reading 0 at scale 1.0. Plus **B3** (review C5) — §240.1's hull zero gets a planted out-of-ring vertex (+1 exactly) and its half-ring RESCUE clause a planted rescued vertex |
| 11 | **BRANCH LIVENESS** `i11-branch-liveness.mjs` | drives a SHIPPED selector with a MINIMAL SYNTHETIC input built to that module's own declared input shape, then walks the threshold until the branch stops firing | the swept variable, in the units the law compares in (trig indices for a bearing; view units for a distance) | the branch must fire on one side of the declared threshold and NOT on the other; the fallthrough must be the named alternative, never a crash or a null | ⭐ IT IS ITSELF THE CONTROL — every arm carries its own negative case, one per CLAUSE of a multi-clause predicate |
| 12 | **TANGENTIAL-OR-CLEAR** `i12-tangential.mjs` | THREE clauses never merged — **C1** a body FOOTPRINT crossing the wall polyline · **C2** every body within REACH is (A) within BAND° of the wall's LOCAL tangent or (B) standing clear on a stretch clear BOTH sides · **C3** the §645.1 continuity read (tangential share inside vs outside), non-scoring. Each body's axis is the min-area-rectangle long axis of its own polygon — never a stamp the fabric wrote | bodies within REACH of a WORKING circuit (old-core rings are not walls, §250.5 — measured on their own non-scoring row) | **0 crossings, 0 violations** (§645.2's order). Thresholds are DERIVED from the wall's own frontage-derived `bandParts` — `CLEAR_IN = half+inner`, `CLEAR_OUT = half+outer`, `REACH = half+max(inner,outer)+medianPlotDepth` — and `--sweep` reports the whole reach × band grid so no verdict is hostage to one constant | six plants: a body laid ACROSS the line (+1 exactly) · a PERPENDICULAR body in the clear zone (convicted, with its own verdict read out of the UNCAPPED row set) · the SAME body turned tangential (ACQUITTED — the instrument must acquit, not only convict) · a body beyond REACH (changes nothing) · `bodyAxis` on synthetic rectangles of known angle and aspect · and the STRETCH COUPLING — an intruder convicts a previously-acquitted neighbour |
| 13 | **WATER-TRUTH AGREEMENT RATCHET** `i13-wseam-ratchet.mjs` | pins TE-WSEAM's three figures, corpus AND per-leaf: agreement inside the drawn river (`both/drawn`) as a FLOOR, `⛔ DRAWN∧¬SUB` and `⚠ SUB∧¬DRAWN` (the MIRROR class) as CEILINGS. Re-measures by invoking CAR-MEASURES' own `wseamCensus.mjs` rather than re-deriving, and voids its own verdict if that census's controls are BROKEN | the drawn `fill="#8d999d"` polygon at a 400² grid (cell 2.50 u) against `sub.wet > REFUSAL.standingWater` (0.64), 9 river leaves | agreement ≥ **2.63 %** · DRAWN∧¬SUB ≤ **208,644 u²** · SUB∧¬DRAWN ≤ **50,444 u²**; ε = one grid cell (6.25 u²) / 0.01 pp. An IMPROVEMENT passes but prints as a DECLARED SHIFT with re-pin values | seven: a halved agreement on ONE leaf reds (per-leaf pins are load-bearing) · a growing mirror class reds · a leaf that silently stops being measured cannot read clean · an improvement surfaces as a shift · a changed grid/limit reds as incomparable · and an ON-DISK perturb→exit-1→restore-byte-identical cycle |

---

## THE FOUR DEFECTS THE CONTROLS CAUGHT

Recorded because each would otherwise have shipped a confident wrong number, and because the same
shapes will recur in every later wave that measures a drawing.

1. **The metric that could not see its own control.** SQUINT was first written with **Cohen's d**
   (pooled SD). It reported *no change* between the sealed base and a plate whose street web had
   been repainted the fabric's own colour. The pooled denominator grows with the role's own
   variance, so a role that spreads hides in its own denominator. Replaced with **1 − OVL**, which
   then reported **0.84 separability for a water body repainted green** — a near-uniform wash is a
   spike, and a spike overlaps a broad ground almost nowhere. Settled on **Glass's Δ**, whose
   denominator comes from the GROUND alone and which neither failure is available to.
   *Class: a summary statistic can be blind to exactly the defect it was chosen for; only a
   deliberately-broken input reveals which.*

2. **A mask that could not express a hole.** Role masks filled each subpath of a `<path>`
   separately and OR-ed them. SVG fills all subpaths under ONE winding rule, so an outer shape
   plus an inner subpath is a shape **with a hole**. The water role came back covering 27% of the
   plate — swallowing the town — and 64% of those "water" pixels were unsaturated because they
   were the fabric showing through a hole the mask had filled in. Downstream that read as *"the
   water hue is 42°, warm"*: a false conviction of a correct drawing.
   *Class: a role with holes reports the things inside them as itself.*

3. **Selectors sized to one grid, sampled against another.** Role-pair contrast built its
   selectors at 1100² and sampled them against the 2200² raster. Every pair came back at ratio
   ≈ 1.01 on **every** plate — which looks exactly like a catastrophic finding about the contrast
   law. The tell was that the deliberately-broken plates moved the numbers by less than the noise.
   *Class: a control that cannot move is the signature of an instrument pointed at nothing.*

4. **A mean that describes nothing the plate contains.** The hue summary was a
   saturation-weighted circular mean. On the specimen's water — 67% pale blue at ~195°, 30% warm
   stains at ~30° — it returned **79°**, a yellow-green sitting neatly between two real modes and
   describing neither, the same failure as averaging 350° and 10° into cyan. Replaced by the
   count-weighted modal bin, with conformance as the verdict. *(Saturation already gates entry;
   weighting the bin by it again lets a vivid minority outvote a pale majority.)*

Three further breaks were **the controls being wrong, not the instruments** — a sever disc that
left snappable corners, a "wilderness" gate sited by eye onto a road, a straddler planted on a
bounding box rather than on the circuit's own claim line. Each is annotated at its site.

---

## THE TWO ORDERED REPAIRS TO i6 (ODQ §602.2, after REG-1 §11.1)

REG-1 measured the sealed fusion tip through this set and reported two i6 defects it was not
granted the standing to fix. The chair ordered both. Both are recorded here in full because each
carries a class that will recur in every later wave that measures a drawing.

### R1 · F3 INVERTED ON GENERATIVE FUSION, AND THE OBVIOUS FIX IS A NO-OP

F3 was `SOLITARY / INTRAMURAL BODIES` — bodies alone in their component of the closed mask, over
drawn building subpaths. On the fusion tip it **rose** (city 0.0652 → 0.0818) on a drawing whose
blocks had just been formed. The order was to *"re-define the numerator to count MASSES"*, and
the first thing measurement showed is that **the numerator was already counting masses**:

> A body alone in its component *is* a component holding exactly one body — the same integer by
> construction. MEASURED at city: `solitaryBodies` = **133** and the count of single-body
> components = **133** (tip: **140** and **140**). Re-labelling the numerator moves nothing.

⭐ **THE INVERSION IS IN THE DENOMINATOR, AND THE CLASS IS GENERAL: a population of DRAWN UNITS is
not conserved under generative fusion, so no fraction over it can measure fusion.** Replacing k
members with one mass deletes k−1 subpaths — city **2,045 → 1,717 bodies, −16.0 %** — so any
per-body fraction rises whether or not the drawing improved. Every candidate that kept a
unit-count denominator inverted the same way when measured (masses/bodies 0.488 → 0.556;
masses/blocks 2.501 → 2.403 only because *both* halves fell).

What fusion does **not** move is the ink. Measured at city: building fill **117,452 → 117,885 sq
units, +0.37 %** (the party-gap slivers it swallows); the whole built mask 142,863 → 142,794,
−0.05 %. **Area is the conserved denominator; a count of units is not.** So:

```
freestandingDensity = MASSES / INTRAMURAL BUILDING-INK AREA        (per 1,000 sq view units)
  MASSES       one connected component of the drawn building+landmark fill — one connected
               FUSED UNIT, whatever number of holdings it holds and however it came to be fused.
               Each mass is placed intramuros by ITS OWN centroid, so it is counted once and
               lands where its bulk is.
  DENOMINATOR  the square view units of that same ink inside the circuit, named on every row.
```

Two further consequences, both improvements the order did not ask for and both stated:

- **F3 no longer reads through the closing radius.** The old SOLITARY test was taken in
  `close(built, FUSE_R)` — a 1.25-unit close at city, which REG-1 §4 measured spanning ≤ 2.5 u
  and therefore bridging SLOTS (1.00 u) and PACKING WEDGES (1.35 u), gaps `decideGap` gave a
  reason and the charter says must remain. F3 now reads the ink **as drawn**.
- **F3 measures BUILDING ink, not `built`.** `built` carries YARDS because REG-0's probes front
  on a yard wall as readily as on a roof, and F1/F2 are lifted verbatim; but a filled toft glues
  neighbouring roofs into one component through ground that is not built at all. `bodyInk` is a
  new, separate mask — **no F1/F2 figure moves.**

⚠ `supersededFraction` carries the old reading on every row, labelled, so the pre-repair
baselines can be reconciled. **It is not a verdict figure.**

### R2 · THE GRID COULD NOT RESOLVE THE GAP THE INSTRUMENT EXISTS TO MEASURE

`PLOT_SHAPE.partyGap = 0.035` frontages is the residual between two party-walled holdings — the
exact gap §571.4 is about. At the recorded grid 1400 the cell is **0.714 u** while the city's
party gap is **0.219 u** and the village's **0.481 u**: *every party gap in the corpus is smaller
than one cell*, so the base plate arrives already fused BY RASTERISATION and the instrument
reports a cure with nothing left to do. REG-1 proved it by moving only this knob (village,
everything else held): 1400 and 2000 both returned base and fused identical at 176/14.66/68, and
the delta appeared at 2800 — the moment the cell fell below the gap.

**THE RULE, recorded by REG-1 §4b before any figure was measured through it, adopted verbatim as
the DEFAULT:**

```
partyGap = plotFrontage × 0.035                    ← the law's own value
N        = the smallest multiple of 200 whose cell 1000/N is ≤ partyGap, capped at 6400
```

City 4600 · village 2200 · town 5800 · metropolis 5200 · polycentric 6200 · thorp 1200. **No
corpus leaf reaches the cap.** `--grid=` still overrides; `--reg0compat` **pins 1400**, because
REG-0's published figures were measured through that cell and a compatibility mode that quietly
re-gridded would report "REPRODUCED" while differing.

⭐ THE CLASS, and it is instrument 1's own class one turn out: **a mask metric cannot see a defect
finer than its cell, and a base that looks fused at grid N is a base measured at grid N.** The
tell is that the BASE's own figures move with the grid.

⚠ A base still partly fused by rasterisation makes any base→tip Δ a **lower bound**, which is why
the resolved grid is the default rather than an option.

---

## INSTRUMENT 9 · THE BLIND-SILHOUETTE PROTOCOL

Not a script. REG-3's exit is *"a blind class-from-silhouette read on N samples ≥ target"* and A2.2
fixes the executor: **a fresh-context reader with labels withheld**, with N and the target set at
the REG-0 round. This is the procedure that makes such a read admissible.

### 9.1 Fixture preparation (the preparer)

1. Render the leaves under judgement at the sealed tip. Choose masses by a **stated rule**, not by
   eye — e.g. *every landmark mass whose drawn area is in the top decile of its leaf* — and record
   the rule in the run sheet before looking at any of them.
2. Crop each mass to a fixed frame with a fixed margin (`reg0/crop.mjs` does true vector crops, so
   the frame is identical between leaves and nothing is upscaled from a raster).
3. **Strip every non-geometric cue**: all `<text>`, all `data-anchor` and `data-cite` attributes,
   the legend, the cartouche, the marginalia. A silhouette read that can see a label is a
   label read.
4. Randomise the sheet order by a **recorded seed**, and hold the answer key in a separate file the
   reader is never given a path to.
5. **Include DECOYS**: ordinary fabric blocks and yards, at the same crop and the same count as one
   real class. A reader who scores well on the real masses and equally well on decoys is pattern-
   matching the crop, not reading the form — this is the same logic as instrument 4's decoy arm,
   and without it a high pass fraction means nothing.

### 9.2 The read (the reader)

- A **fresh context**: a reader who has not seen this lane's work, the charter, the answer key, or
  any earlier round's sheet. Not the preparer, on any account.
- The reader is given: the sheet, the **closed list of classes** (so it is a forced choice, not
  free recall), and the instruction to answer `class` or `CANNOT TELL` for each.
- **`CANNOT TELL` is a first-class outcome and is recorded separately.** It must never be folded
  into "wrong": a form that reads as nothing and a form that reads as the wrong thing are
  different defects with different cures, and averaging them hides both.
- No feedback until the sheet is finished.

### 9.3 Scoring

```
passFraction = correct reads / (real-class fixtures − CANNOT TELL)      ← the primary
cannotTellRate = CANNOT TELL / real-class fixtures                      ← reported beside it
decoyFalsePositiveRate = decoys assigned a class / decoy fixtures        ← the validity gate
```

- Report **all three**. A pass fraction quoted without its `cannotTellRate` is a figure whose
  denominator has been quietly shrunk by every fixture the reader refused.
- **VALIDITY GATE**: if `decoyFalsePositiveRate` is high, the round is **VOID** — the reader is
  guessing a class for anything crop-shaped and the pass fraction is not evidence. Re-run with a
  harder decoy set before reading anything into the numbers.
- Record the per-class confusion pairs. "Hall read as market" is the actionable output; a single
  scalar is not.

### 9.4 What is fixed at the REG-0 round (A2.2)

`N`, the target pass fraction, and the class list. Recorded on the tuning surface, vetoable, and
pinned in the run sheet **before** the reader is engaged — a target chosen after seeing the reads
is not a target.

---

## RUNNING THEM

```
node i1-squint.mjs   --base=<base.svg> --png=<render.png>      # or --controls
node i2-route-trace.mjs --wt=<worktree> --leaf=city            # or --controls
node i3-chunking.mjs    --wt=<worktree> --leaves=ALL           # or --controls
node i4-landmark-salience.mjs --base= --png= [--decoy]         # or --controls
node i5-role-contrast.mjs     --base= --png=                   # or --controls
node i6-frontage.mjs --svg= --frontage= [--circuit=<poly.json>] # or --controls
     # ⭐ the grid DEFAULTS to the leaf's own party-gap-resolving N (R2). --grid=<N> overrides;
     #   --reg0compat PINS 1400 and re-applies REG-0's wall-band strike.
     # ⭐ --circuit takes the MODEL's own walls[].closedPolygon as a JSON [[x,y],…]; without it
     #   F3 falls back to the flood, then to the urban envelope, and NAMES which it used.
node i7-ftg-colour.mjs --base= --png=                          # or --controls
node i8-nodrift-trace.mjs --wt=<worktree>                      # or --controls
node i10-censuses.mjs --wt=<worktree> --leaves=ALL             # or --controls

node mk-controls.mjs <base.svg> <outDir>     # regenerate the deliberately-broken plates
node run-baselines.mjs                       # → out/baselines.json
```

### THE BASELINE FILES, AND WHY THERE ARE TWO

| file | tip | instrument | note |
|---|---|---|---|
| `out/baselines-ee0db96d3.json` | `ee0db96d3` | **pre-repair** i6 | the original record, kept verbatim. **Never overwritten** — a baseline edited in place is not a baseline. |
| `out/baselines.json` | **`d1b32e339`** | **post-repair** i6 (R1 + R2) | the live baseline. `i6Corpus.rows[]` covers **every exemplar leaf**, dormant vs armed. |
| `out/baselines-d1b32e339.log` | `d1b32e339` | post-repair | the console record of the run that wrote the file above. |
| ⛔ `out/baselines.log` | — | — | **STALE AND MISLEADING — DO NOT COMPARE AGAINST IT.** See the warning below. |

> ⛔⛔ **THE STALE LOG THAT CONVICTS AN INNOCENT LANE.** `out/baselines.log` is timestamped
> **12:42:02**, but `i1-squint.mjs` (12:44:51), `i5-role-contrast.mjs` (12:45:05) and
> `i7-ftg-colour.mjs` (12:45:57) were all edited AFTER it, and `baselines.json` was written at
> 12:46. **The log therefore describes code that no longer existed when the baseline was
> recorded.** It reports `squint=FAIL` for BASE-village, BASE-town and SPEC-village; the recorded
> JSON — both the old file and the new one — says **PASS** for all three. A later lane diffing its
> own run against that log would conclude it had broken three instruments it never touched. The
> bytes are left untouched because they are history; the name is the false claim.
> ⭐ **THE CLASS, and it is this programme's own standing law arriving in a new costume: an exit
> status captured before the last edit is a status about different code — and a LOG is an exit
> status that outlives the run.** Compare artifact to artifact, never artifact to log.

⚠ **THE DRAWING DID NOT MOVE BETWEEN THEM; THE INSTRUMENT DID.** At `d1b32e339` fusion is
DORMANT and REG-1 §6 proved the unarmed render byte-identical to `ee0db96d3` on 29 of 29
artifacts. Verified by diffing the two files: the pixel instruments (i1/i4/i5/i7) are
**identical on all 25 blocks**, `i6.reg0Compat` is identical on all 5 plates, i2/i3 are identical
on the three leaves the old file carried, and the censuses are identical. The only untouched
figure that moved is `noDriftTrace`'s LINE NUMBERS (+51, REG-1's own additions to `renderFolio`) —
the op-class roster, `traced=28`, `untracedMisses=0` and `staleTableRows=[]` all stand.

⚠ The BASE plates' old `i6.asDrawn` block (read at 1400) has **no successor at that grid** — it
was deliberately removed rather than kept beside the resolved-grid reading, because two different
grids under one instrument's name is the confusion R2 exists to end. The 1400 anchor survives as
`i6.reg0Compat`, and the old file holds the removed block verbatim.

⚠ **The pixel instruments still cover only the plates that have rasters** (city, village, town,
and the two REG-0 specimens). i6, i2, i3 and i10 cover all 18. Rasters for the armed corpus exist
only in the REG-1 lane's scratchpad and were not re-shot here; REG-1 §5 holds those readings.

Rasters go through `reg0/shoot.sh`'s discipline (headless Chrome, width/height stripped,
absolute `file://`, byte floor). **qlmanage is not an instrument — it drops SVG filters** (§7.6).

## WHAT THIS SET DOES NOT MEASURE

Written down so the next wave does not re-derive the gaps.

- **Canopy hue** — deferred with its cure, at `i7`'s `DEFERRED_ARMS`: the ten-role classifier has
  no CANOPY role, so section 4's batched trees fall into `detail`/`ground`. One branch in
  `lib/classify.mjs` keyed on the sealed `trees` colour fixes it; it belongs to REG-5.
- **The register leg** — wash-σ, tone-IQR, lineweight ratio, grain density vs the 313-plate
  corpus. That set already exists (`map-corpus/docs/` HFM1/MFS1/MFI1) and is not re-minted here.
- **Gallery variety, interaction latency, zoom-level proofs** (A1.3) — chartered, not built here.
- **Determinism double-runs** — REG-0's own control B covers the render path; this set is pure by
  construction and has no seeded state of its own to double-run.
- **HOLDINGS, as a population.** F3 now counts MASSES over INK AREA and never needs a holding
  count — but no instrument in this set can tell a fused range of k holdings from one large
  building **by ink alone**. Three routes were measured and rejected during R1, recorded so the
  next wave does not re-derive them: (a) counting the drawn party lines is EXACT — the tip emits
  exactly 320 of them at city, matching the fabric's own published `partyLines` — but a purely
  geometric "a stroke that cuts a filled body" predicate over-collects, returning **540 such
  strokes on the un-fused base** (roof ridges, plot ticks, back lines), so the count is only
  recoverable by reading `stroke-linecap`/`stroke-opacity`, i.e. by keying on one renderer's
  convention; (b) inferring holdings from mass AREA fails because the base's own building areas
  already run to 9× their median on 18 bodies at city, so no threshold separates a large
  building from a small terrace; (c) taking holdings from the MODEL works and has precedent
  (`circuitPoly`), but makes F3 unable to judge a drawing on its own. **If a later wave needs the
  holdings population, (c) is the honest route and it must be NAMED on the row.**


## LANE REG-I1's ADDITIONS (the §632.4 debts) — and what they CHANGE in this set

Four files were added and one existing instrument's TABLE grew. **No instrument's MEASURE, floor
or band was altered**, and `out/baselines.json` was NOT rewritten — the two-baseline law above
("a baseline that is edited in place is not a baseline") holds.

| file | what it is |
|---|---|
| `i11-branch-liveness.mjs` | instrument 11 above — the synthetic controls for `marketRegister`'s `triangular` and `faubourgOrigin`'s `bridgehead`, the two branches REG-4 left unfired |
| `regI1-i6corpus.mjs` | the OWED i6 re-run: F3 BASE vs ALL FIVE WAVES ARMED, run-baselines.mjs's own protocol re-used verbatim, plus `--checkcircuit` (does arming move the F3 denominator? measured: no, 12 of 12 walled leaves) |
| `regI1-i5contrast.mjs` | the OWED i5 re-run, plus the `square`-role element census beside the three pairs |
| `regI1-ratchetunit.mjs` | the §628 ratchet-unit review — primitives vs renderer-`elementCount` vs TRUE dom census vs bytes vs ms, 3 samples each |
| `shoot-bounded.sh` | `reg0/shoot.sh` with J-REG4-11 made mechanical: a wall-clock bound, TERM/KILL at the deadline, and the verdict read from the FILE afterwards. `reg0/shoot.sh` has no bound of its own, so anything that shells it inherits REG-4's 5 min 40 s hang. |
| `i8-nodrift-trace.mjs` | **TABLE ONLY** — seven rows added (`8r 8x 8f 11r` from REG-4 §7, `12r 13p` from REG-3 §7, `15r` authored from REG-2's receipt). Misses 7 → 0. The MEASURE, the roster derivation and the controls are untouched, and the DRIFT count is unchanged at 3. |

### ⭐ THE DECLARED SHIFT, RECORDED HERE SO NOBODY RE-RECORDS IT AS A BASELINE

**i6 · F3 moves on the ARMED arm on 17 of 18 leaves** (−0.1 % at thorp to −43.9 % at village),
because L-REG-30 suppresses drawn bodies by construction: masses fall, ink area is near-conserved,
mean mass footprint rises. **This is the cure's own signature, not a regression.**
`out/baselines.json`'s `base` column still reproduces exactly (18 of 18, re-checked at the end of
every `regI1-i6corpus.mjs` run) and is still THE baseline. The all-waves differential lives in
`out/regI1-i6corpus.json` — a SEPARATE file, beside the baseline, never in place of it, exactly as
`i6Corpus.rows[].armed` and `SPEC-` already are.

### ⛔⛔ A BLIND SPOT THIS LANE MEASURED IN `lib/classify.mjs` — REPORTED, NOT TUNED

Every pixel instrument in this set (1, 5, 7) reads the ten-role classifier, and at the REG-4 seal
the classifier cannot see REG-4's market register:

1. **FOUR NEW GROUP IDS ARE UNKNOWN TO THE `inG` CHAIN.** The armed plate emits `marketOutline`,
   `marketFossils`, `marketFurniture` and `faubourgDistricts`; the chain knows only `legend ·
   lettering · wardlabels · marginalia · eventcaptions · fields · fabric · landmarks · yards ·
   squares`. Measured consequence: the `square` element count does **not move at all** (1→1 on
   town, city and village) when the market furniture lands.
2. **`if (r.tag === 'rect' || r.tag === 'circle') → chrome` RUNS BEFORE EVERY GROUP TEST.** The
   armed town plate goes from **3 circles to 67**; all 64 new ones — the ringed step-circle market
   cross, the conduit, the pond, the trough — are typed **PLATE CHROME**. Town's census: `chrome
   28→123`.

The cure is two lines (add the four ids; move the `rect|circle` rule after the group tests) and it
**moves the role masks on every plate, and therefore every recorded i1/i5/i7 baseline** — including
the `d1b32e339` ones four waves have been priced against. **That is a chair decision.** It sits
beside the CANOPY gap above, which is the same defect one role over.
