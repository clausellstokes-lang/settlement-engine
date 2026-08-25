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

---

# ⭐⭐⭐ LANE DRESS-1b's ADDITIONS — THE CLASSIFIER LEARNS THE DRESS, AND THE SHIFT IS DECLARED TWICE (ODQ §691)

## ⛔ FIRST, THE SECTION ABOVE THIS ONE WAS OUT OF DATE WITH ITS OWN CODE, AND §691.6 ORDERED IT SAID

The block titled *"A BLIND SPOT THIS LANE MEASURED IN `lib/classify.mjs` — REPORTED, NOT TUNED"*
poses its cure as **pending** (*"The cure is two lines … That is a chair decision."*). **It is not
pending. `lib/classify.mjs` has carried the REG-5 cure since REG-5 landed** — `GROUP_ROLE` holds
all four market ids plus `precincts` and `quayFurniture`, and the `rect|circle → chrome` rule
already sits AFTER the group table. The commit that claimed "all declarations current" was wrong
about this file. **A declaration document that lags its own code is how a lane comes to trust a
floor that moved** — the same class as §688.3(i)'s mislabelled headroom, one document over. The
block above is kept VERBATIM as the historical record of the finding; this paragraph is its
correction, appended rather than substituted, per §9 law 12.

## THE DECISION TAKEN (§691.2, chair-ruled) — `GROUP_ROLE` GAINS THE THIRTY `dress-*` IDS

The alternative was never neutrality but **active corruption**: before this cure the dress was not
merely unnamed, it was CONVICTED. Measured on all 18 dress plates:

- `building`, `landmark`, `street`, `field`, `yard`, `square` **EMPTY on every plate**. Because
  `lib/pixels.mjs` builds the GROUND population as the closed urban envelope of `building ∪
  landmark`, that made **every i1 arm and i5's `street:ground` / `water:ground` rows structurally
  dead** — the vacuous mask PA.5 exists to pre-kill.
- The dress emits exactly ONE `<rect>` (`dress-paper`) and NO `<circle>`. On the four leaves whose
  frame is narrower than 900 units (thorp 286.8, hamlet 422.1, village/mountain 519.4) that rect
  **planted a WHOLE-PAGE chrome exclusion zone** and the point test ate the entire drawing —
  thorp `detail:12 chrome:13`, the others `detail:13 chrome:14`. No ground, no water, no wall.
- ⚠⚠ **AND `town-2`'s PAPER RECT IS 901.2 WIDE AGAINST THE 900 THRESHOLD.** The width test is a
  cliff, not a slope: 1.2 units of tuning and a whole town plate flips to total chrome.

**HOW THE ROWS WERE DERIVED (§691.3): each id maps to the role it ACTUALLY DRAWS**, read off
`partitionDress.js`'s own emission at `ad2b8d399`, with the emitting line quoted in the table
itself. **`chrome` is assigned to NONE of the thirty** — the dress draws no legend, scale bar,
compass or cartouche, so not one of its marks is plate furniture. The circuit's eight ids are
DRESS-1's own executed `WALL_GROUPS` roster (`wallAll.mjs:33`), which is the population the
published `wall:all` figure (6.08–7.00, §688 exit 9) was measured over.

**POST-CURE, EVERY GROUP IS SINGLE-VALUED ACROSS ALL 18 PLATES** and `chrome` no longer appears in
any plate's census. Pre-cure, ten groups split (`ground:14 chrome:4`) — the split WAS the flood.

## ⛔⛔ A SECOND BLOCKER, NOT ON §690's LIST: `assertViewBox` REFUSED ALL EIGHTEEN PLATES

`VIEWBOX: 0 accepted, 18 REFUSED`. The dress frames each page on its own extent
(`viewBox="-32.50 166.28 979.37 979.37"`), and the old `assertViewBox` accepted only
`0 0 1000 1000` because `PxMask` maps unit→pixel as `extent/n` **with no offset**. i1, i5 and i7
all reach it through `rolePopulations`, so **the instruments could not open a dress plate at all** —
upstream of the classifier question entirely.

**THE CURE:** `assertViewBox` now RETURNS a frame descriptor and accepts a fitted SQUARE frame;
`roleMasks`, `i4` and `i6` carry it through a new `frameTransform`. A non-square frame is still
REFUSED — `PxMask` carries ONE scale and must not guess an axis.

- ⚠ **ONE SEMANTIC MOVES AND IT IS DECLARED:** distances stated "in units" — `stampSeg`'s 200-unit
  stray-chord guard, `rolePopulations`' 22-unit urban-envelope closing, i6's `frontage` and its
  derived grid — are now **FRAME-RELATIVE** on a fitted plate rather than world-absolute. On the
  folio (extent exactly 1000) nothing changes.
- ⚠ **THE FIRST SQUARENESS TOLERANCE WAS 1e-6 AND IT REFUSED A LEGITIMATE PLATE.** `polycentric`
  prints `viewBox="… 973.19 973.18"` because `renderPage.mjs` runs width and height through
  `toFixed(2)` independently. The tolerance is now **1e-3 relative**. Printing more decimals in
  the emitter was refused: it would move the bytes of every shipped plate to suit an instrument.

## ⭐⭐ THE DECLARED SHIFT, AND IT IS **TWO** SHIFTS, NOT ONE (§691.4)

The pre-cure file is kept verbatim and never overwritten. ⚠ **The file the estate calls LIVE was
ALREADY STALE:** `out/baselines.json` is byte-identical to
`out/baselines-d1b32e339-PRE-REG5-CLASSIFIER-CURE.json` (**both sha256 `160677aca…`**) while
`lib/classify.mjs` already carried the REG-5 cure. A shift was therefore **latent and unrecorded**
in the live file, and publishing one delta would have billed REG-5's movement to this lane.

```
DELTA 1 · pre-REG5 → post-REG5     113 of 5,242 leaf values MOVED
          (out/baselines.json  →  baselines-POST-REG5.json, sha256 33610e81b2be…)
          entirely i6Corpus rows; e.g. rows.4.base.F1F2.probes 19,993 → 20,418,
          .ratio 0.5898 → 0.5794, .runs 997 → 1,004, .frontingMasses 485 → 488
          ⛔ THIS IS REG-5's MOVEMENT, NOT DRESS-1b's. It had never been recorded.

DELTA 2 · post-REG5 → post-DRESS     0 of 5,242 leaf values moved
          (baselines-POST-REG5.json  →  baselines-POST-DRESS.json)
          ⭐⭐ BOTH FILES sha256 33610e81b2be8ba12445954c8ca13f612a65dadceddaeea7d686c0b5bfd49349
          THE THIRTY DRESS IDS AND THE FRAME TRANSFORM MOVE **NO** EXISTING FIGURE.
```

**WHY DELTA 2 IS ZERO, AND WHY THAT ZERO IS EVIDENCE RATHER THAN SILENCE.** The dress ids can only
fire on a `dress-*` group, which no legacy plate carries; and `frameTransform` reduces to the
identity on `0 0 1000 1000`. Both are arguments, so both were MEASURED, and the zero was given a
two-sided plant because *identical readings are what a dead instrument returns*:

```
i1 · i5 · i7 · i4 · i6   --controls, cured arm vs a pristine `git archive 79c02a0ea` arm
                         ⭐ ALL FIVE BYTE-IDENTICAL on stdout (i6 run SEQUENTIALLY — §690.5(d),
                            /tmp/.rb-i6.json is a fixed path and two runs clobber each other)
PLANT A  an EXACT-IDENTITY affine forced down the NON-identity code path  → IDENTICAL
         (so the zero is not an artefact of the early return never being left)
PLANT B  the same code path with a 0.2 % scale error                      → ⭐ MOVED every row
         squint.street 1.9471→1.9035 · wall 1.6681→1.5797 · water 8.393→8.273 · ground px 8,924→8,997
```

## NEW FILES

| file | what it is |
|---|---|
| `mk-controls-dress.mjs` | **PA.5's per-role planted controls for the partition dress.** `mk-controls.mjs` could not serve: its plans patch STROKES, and the dress draws its street as a FILLED surface, so `flat-street` added a hairline to a surface that stayed exactly as visible. Fill-aware and stroke-aware, with `--assert` re-counting the role census after every rewrite. |
| `dressCorpus.mjs` | **the i1 and i7 corpus drivers §690.4(iii) says do not exist**, plus i6's partition arm. `--controls` runs PA.5's gate BEFORE printing any baseline and prints the COLLAPSE MATRIX. i6's arm string rides every row per §688.3(ii). |

## ⛔⛔ PA.5's GATE, EXECUTED — AND IT CAUGHT THREE DEAD MEASUREMENTS BEFORE ANY BASELINE WAS BELIEVED

**This is the entire reason PA.5 exists, and it earned its place three times in one run.**

1. **A MASK/IMAGE FRAME MISMATCH THAT WOULD HAVE PUBLISHED A CORPUS-WIDE TABLE OF NONSENSE.** The
   dress SVG carries `width="1000"`, so Chrome renders it at 1000 px whatever the window is. Shot
   into a 1400 px window the map sits in the TOP-LEFT and **48.9 % of the sampled frame is blank
   canvas**, while the MASK — built from the viewBox — assumes the map fills the frame. The two
   lived in different coordinate spaces. **The tell was the control refusing to move:** the
   `flat-street` plant repainted the ENTIRE street surface to the fabric tone and i1's street mean
   moved **183.33 → 183.08**, a quarter of one luminance unit out of 255. Cure: strip `width`/
   `height` and shoot at 2200. **Stripping is drawing-neutral — proved by raster diff at 1000 px,
   0 differing channel samples of 3,000,000.**
   ⚠ `squint.mjs`'s own header records the SAME hazard class biting DRESS-1 one lane earlier.
2. **TWO OF MY OWN CONTROLS WERE DEAD AND THE GATE SAID SO.** `flat-field` painted the field to
   PAPER (hue **42.6°**) and `flat-building` painted the fabric to the STREET tone (hue **43.4°**)
   — and i7's field band is **[35, 70]°** and its town band **[0, 60]°**. Both breaks repainted a
   role INTO the band under test. Measured: field conformance 0.996 → **0.996**, town 0.999 →
   **0.998**. Both now break to the water role's blue-grey (hue **201.6°**), far outside either
   band and near in value, isolating hue exactly as `grey-water` does in the other direction.
3. **i6 CANNOT BE GATED BY A REPAINT CONTROL AT ALL, AND THAT IS STRUCTURAL.** i6 builds its masks
   from VECTOR GEOMETRY and never opens a PNG, so it is colour-blind by construction: every one of
   the seven plants left `i6.ratio` at **0.880**. PA.5's per-role repaint gate is the right gate
   for the PIXEL instruments (1, 5, 7) and is **incapable** of gating i6. i6's gate is its own
   GEOMETRIC battery (`--shatter=`, `--fuse=0`), which was run and was byte-identical to r4.

### THE COLLAPSE MATRIX (leaf `town`, corrected plates) — read the DIAGONAL

```
plant                 i1.street i1.wall  i1.water  i7.water i7.field i7.town   i6.ratio
(UNPLANTED BASE)        1.990    2.053    5.211     0.859    0.996    0.999     0.880
dress-flat-street       0.972↓   2.060    5.205     0.859    0.995    0.999     0.880   ⭐ −51 %
dress-flat-wall         2.017    0.330↓   5.197     0.861    0.997    0.999     0.880   ⭐ −84 %
dress-grey-water        1.990    2.052    0.595↓    0.000↓   0.997    0.999     0.880   ⭐ −89 %
dress-flat-field        2.587    2.235    0.746     0.964    0.003↓   0.999     0.880   ⭐ 0.996→0.003
dress-flat-building     7.034   10.570    1.222     0.886    0.995    0.091↓    0.880   ⭐ 0.999→0.091
dress-flat-square       1.982    2.049    5.207     0.859    0.996    0.999     0.880   (no arm reads it)
dress-flat-yard         2.059    2.111    5.186     0.859    0.996    0.999     0.880   (no arm reads it)
```

⚠ **PA.5's "each moving exactly one ROLE" is satisfied at the PLANT; the READINGS are coupled, and
that is a property of the instrument, not a defect in the control.** Every plant passed
`--assert` (the role census is unmoved, so no element changed role). But i1's Δ takes its
denominator from the GROUND population, which `lib/pixels.mjs` builds out of the `building` mask —
so repainting `building` or `field` necessarily moves every i1 arm. Glass's Δ against a common
ground cannot be decoupled, and pretending otherwise would be the more comfortable lie.

## THE PARTITION BASELINES, DECLARED (exit 3 of DRESS-1's brief)

Arm: **`partition:UNARMED`** — pinned and printed on every row, per §688.3(ii)'s amendment that an
unpinned partition i6 baseline is not a baseline. Lens `parchment`, frontage 5, plates stripped
and shot at 2200 px. Full table in `dressCorpus2.log` / `dressCorpus.json`.

```
leaf         i1.street i1.wall  i1.water   i7.water i7.field i7.town   i6.ratio i6.runs i6.masses
thorp          8.908     n/a      n/a        n/a     1.000    1.000     1.0000       1        1
hamlet         4.264     n/a      n/a        n/a     1.000    1.000     0.5558      56       13
village        4.436     n/a      n/a        n/a     1.000    1.000     0.5361     132       29
mountain       4.327     n/a      n/a        n/a     1.000    1.000     0.5055     102       26
town           1.990    2.053    5.211      0.859    0.996    0.999     0.8799   2,710      234
town-2         2.835    0.905    6.055      0.814    0.994    1.000     0.8640   2,044      161
city           1.929    1.654    6.154      0.991    0.993    0.999     0.9013   4,538      370
metropolis     1.940    3.183     n/a        n/a     0.994    0.999     0.9261   5,872      459
polycentric    2.242    1.826     n/a        n/a     0.997    0.999     0.8206   3,302      259
highwater      2.479    1.345    5.412      0.846    0.995    1.000     0.9029   3,213      252
fjord          2.931     n/a     6.628      0.979    1.000    0.999     0.8856   3,831      343
crossing       2.132    1.784    5.144      0.867    0.995    0.999     0.8813   3,043      246
year-018       2.167    1.544    4.390      0.866    0.996    0.999     0.9119   2,890      214
year-100       2.125    1.560    4.268      0.867    0.995    0.999     0.8719   3,256      282
migration      1.929    1.654    6.154      0.991    0.993    0.999     0.9013   4,538      370
siege/plague/famine — byte-identical to `town` on every figure (the corpus carries 14 distinct
                      route signatures across its 18 leaves)
```

⛔ **ONE RED, NAMED RATHER THAN ROUNDED: `town-2`'s i1 WALL ARM READS 0.905 AGAINST THE 1.00
FLOOR** — the only sub-floor figure in the table. Every other applicable arm clears it, most by a
wide margin. `n/a` is NOT APPLICABLE, never a failure (i1's own law): an unwalled leaf has no wall
and a dry leaf has no water.
