# THE LEGIBILITY INSTRUMENT SET — REG-I0

**Charter:** `docs/DESIGN_REGISTER_PROGRAM.md` — A2.1 item 3 (REG-I0, chartered first in the arc),
A2.2 (exit-criteria repairs), §6 (the two-legged exit), A1.3 (instrument additions).
**Subject:** the sealed fabric at `ee0db96d3` and the renders `harness/renderFolio.mjs` emits from it.
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
| 6 | **FRONTAGE** `i6-frontage.mjs` | F1 ratio = fronted/probes · F2 runs, meanRun, p50, p90, max · F3 freestanding = solitary/intramural bodies | F1: street-flank probes inside the urban envelope · F2: the run count · F3: bodies inside the circuit (`closedPolygon`, or a named fallback) | REG-1 sets the target band; this lane records the baseline | reproduces REG-0's published city AND village figures exactly; `--fuse=0` returns identically to the base; `--shatter=0.35` manufactures the §571.4 defect and every figure moves the right way |
| 7 | **FTG COLOUR** `i7-ftg-colour.mjs` | conformance = saturated role px inside the category band / saturated role px; descriptor = the count-weighted modal 10° hue bin | the SATURATED role population — grey pixels are excluded from BOTH sides and reported as `greyShare` | water **185–265°**, field **35–70°**, town **0–60°**; conformance ≥ **0.60**; grey share ≤ **0.50** *(chair's, vetoable)* | `grey-water` drives water out of band and moves nothing else; the base plate is correctly reported ACHROMATIC rather than mis-hued |
| 8 | **NO-DRIFT TRACE** `i8-nodrift-trace.mjs` | roster re-derived from renderFolio's own numbered section headers, checked against the committed trace table | 31 op classes; an untraced class is a countable miss | **0 untraced misses, 0 stale rows**; every DRIFT row must carry a written justification | a planted section raises the miss count by exactly one; a removed section is reported as a STALE table row |
| 9 | **BLIND SILHOUETTE** *(protocol, below)* | pass fraction of class-from-silhouette reads | N fixtures × 1 fresh-context reader | fixed at the REG-0 round (A2.2) | the DECOY sheet and the two refusal outcomes |
| 10 | **THE TWO CENSUSES** `i10-censuses.mjs` | A: the law's own `districtStraddlers` + an independent no-band cross-check · B: the shipped §241.6 predicate | A: district regions on walled leaves · B: drawn bodies that are MEMBERS of a walled epoch | **0** (§571.2's order) | the PRE-CURE `growthUmbrella.partition` is positive; a planted straddler is +1 exactly; rings×0.95 strands bodies; withholding later rings strands 791 |

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
node i6-frontage.mjs --svg= --frontage= [--reg0compat]         # or --controls
node i7-ftg-colour.mjs --base= --png=                          # or --controls
node i8-nodrift-trace.mjs --wt=<worktree>                      # or --controls
node i10-censuses.mjs --wt=<worktree> --leaves=ALL             # or --controls

node mk-controls.mjs <base.svg> <outDir>     # regenerate the deliberately-broken plates
node run-baselines.mjs                       # → out/baselines.json
```

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
