# laneREGG1 receipt — TE-REG-G1, THE CLIFF-EDGE WAVE (§297.2b · ODQ §577)

**Lane:** TE-REG-G1 (solo, no subagents spawned). **Worktree:**
`/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad/laneREGG1-tree`
**Base:** `ee0db96d3` (the sealed fabric tip). **TIP: `067a7e1f3`.** Three checkpoint commits:

```
067a7e1f3 TE-REG-G1: repath the lane instruments after the move to harness/laneREGG1
2320eeb2b TE-REG-G1 checkpoint 2: the exact cell traversal, the 15 pins, and the lane instruments
299a71494 TE-REG-G1 checkpoint 1: the escarpment boundary (cliffs.js) + the §577 segmented circuit
ee0db96d3 PRESERVE: the sealed fresh-W3 sandbox tip
```
⚠ `git status` in the lane worktree shows one untracked path, `node_modules/` (seedrandom + the
lane's vitest shim). **It is NOT gitignored in the sealed tree** — a `git add -A` here would
commit a dependency tree. The three commits stage explicit paths only.

---

## RESUME POINT

**COMPLETE.** Every exit arm the re-charter named is CONFIRMED with executed evidence, quoted
below. Nothing is left in flight. If a successor picks this up, the next acts are the chair's:
seal the tip, and rule on the four items in §8 (OPEN / FOR THE CHAIR).

**⭐⭐ THE RE-CHARTER IS ACKNOWLEDGED, AND IT WAS INDEPENDENTLY CONFIRMED BEFORE IT ARRIVED.** The
original brief's premise — "the current substrate is essentially a scalar RELIEF" — is a b6-era
fact that decayed. Measured at my own tip during orientation, before the chair's message landed:
`substrate.js:830` already exports `reliefField(sub)` (bands/steepShare/cragShare/flat/wet/slope
quantiles/localMax) over a 96×96 `Float64Array` height+slope+flow+wet grid; `walls.js:340` already
samples `sub.height`/`sub.wet` in Rule 2; `relief.js` already derives hachures, crags, hills,
terraces and form lines from `sub.slope`; `buildFabric.js:31` already imports it and publishes it
at line 1068. **I had written nothing when the re-charter arrived**, so there is no duplicate
relief machinery to delete and one-writer-per-fact is intact.

---

## §1 · THE HOLD, READ (re-charter item 1)

`fabricDcel.js` at `BOUNDARY_ROLES` carried, verbatim:

> `CLIFF` is declared and EMPTY in this era — the substrate carries crag CELLS, not an escarpment
> boundary, and inventing one from a raster threshold would be a new derivation wearing a
> foundation's name.

with `cliffEdges: 0` a hardcoded constant in the published arrangement, and §297.2(b) re-stated at
`deriveBlockFaces` — block termination RATIFIED for wall/street, **HELD for water/cliff until the
water-edge definition lands** — the exclusion travelling in the `reason` string rather than in a
comment.

**⭐⭐⭐ THE OBJECTION IS NOT "WE CANNOT COMPUTE IT". IT IS AN OBJECTION TO WHERE THE COMPUTING WOULD
LIVE**, and it names two separate debts:

1. **CELLS ARE NOT A BOUNDARY.** `groundRefusal.buildableMask` publishes which CELLS are crag. A
   boundary is a line with two sides, a length, an orientation and two ENDS. Nothing produced one.
2. **THE DERIVATION MAY NOT LIVE IN THE FOUNDATION** — `FOUNDATIONS` is kept outbound-edge-free by
   the stage walker precisely so no read-side module derives ground truth.

**THE WATER-EDGE PRECEDENT IS THE ANSWER TO EXACTLY THAT SHAPE**, which is why the hold says
*"until the water-edge definition lands"*: `buildBoundaryArrangement` admits `WATER_EDGE` without
deriving one byte of water — `waterMode.js`/`waterWorks.js` decide in the DOMAIN, `buildFabric`
publishes `fabric.water.line` + `width`, and the foundation offsets and nodes it. Both debts are
paid the same way, row for row.

## §2 · WHAT WAS BUILT

| file | change |
|---|---|
| `src/domain/townMap/fabric/cliffs.js` | **NEW.** The escarpment definition: `deriveCliffs(sub)`, `cliffCrossing`, `cliffCrossings`, `segmentCrossings`, `onImpassable`, `segmentTouchesImpassable`, `CLIFF`, `CLIFF_KINDS`. Pure; a function of the substrate alone. |
| `src/domain/townMap/fabric/walls.js` | §577 Rule 3b: `terminateAtCliffs` + the end-work at each terminus; the containment exemption; `closedPolygon`; the published termini/chords. |
| `src/domain/townMap/fabric/wallRuns.js` | `terminus` joins the fact vector; a terminus types `terrain-surrender` (no tenth run type minted). |
| `src/domain/townMap/fabric/wallCircuit.js` | the escarpment folded into the declared `substrateKey`; `cliffs` on the raw handle; `circuitDrawnRuns` breaks the drawn line at the chord (`openChainsExcluding`). |
| `src/domain/townMap/fabric/buildFabric.js` | derives and publishes `fabric.cliffs` when `options.cliffTermination === true`. |
| `src/domain/townMap/fabric/fabricDcel.js` | **the hold discharged**: `CLIFF_EDGE` admitted to the arrangement, `cliffEdges` COUNTED; the block-face hold deliberately kept. |
| `src/domain/townMap/fabric/stageManifest.js` | `cliffs.js` → S2 (never FOUNDATIONS); S13 + ASSEMBLY allowed imports; the `S6>S2` inversion's reason names its second importer. |
| `tests/domain/townMapFabricCliffs.test.js` | **NEW.** 15 pins, every positive arm paired with its counterfactual. |
| `harness/laneREGG1/` | **NEW.** The lane's instruments + a README that reproduces every figure below. |

### THE DESIGN, IN ONE PARAGRAPH

A CLIFF is the **boundary of the crag cell set** — the artifact the hold said was missing — and it
mints no threshold of its own: `groundRefusal.REFUSAL.crag` (0.030 in the absolute grade unit) is
imported, for the same reason `relief.js` imports `REFUSAL.standingWater` for its reed ticks, so
the law and the picture agree about the ground. Crag cells are labelled into 4-connected regions
(matching `traceMask`'s own connectivity), regions below `CLIFF.minRegionCells` are rejected as
boulder fields, and the survivors' boundaries are traced with `umbrella.traceMask` and
**de-staircased by corner-cutting alone — no seeded wobble**, because a wall terminates on this
line and geometry decided against must be the honest contour, not ink. Each boundary vertex is
classified BRINK or FOOT by probing both sides: the STEEPER side is the crag, and whether the
gentler side stands HIGHER or LOWER is the difference between the top of a fall and the bottom of
one. Contiguous vertices of one kind coalesce into arcs; arcs shorter than `CLIFF.minEdgeCells`
are ABSORBED into their longer neighbour, never dropped, because a gap in an impassable boundary is
a gate the ground never cut. The artifact publishes both halves of the same fact — the drawn
`edges` and the `mask` they were traced from — and the whole thing is DERIVED, NEVER STORED
(§161 LAYER ZERO, THE PROMISE): perturb the substrate and every edge moves; hold it and every edge
is byte-identical.

## §3 · THE EXITS — EXECUTED FIGURES

Sweep: **35 leaves** = 7 terrain families × 5 seeds, walled fixtures, `harness/laneREGG1/cliffSweep.mjs`.

### (a) cliffEdges > 0 on cliff-bearing terrain AND exactly 0 on the flat control — **CONFIRMED**

| terrain | n | escarpment edges | crag cells | wall-over-cliff ops OFF → ON |
|---|---|---|---|---|
| plains | 5 | **0 .. 0** | 0 .. 0 | 0 → 0 |
| riverside | 5 | **0 .. 0** | 0 .. 0 | 0 → 0 |
| forest | 5 | **0 .. 0** | 0 .. 0 | 0 → 0 |
| desert | 5 | **0 .. 0** | 0 .. 0 | 0 → 0 |
| coastal (`strand`) | 5 | **0 .. 0** | 0 .. 0 | 0 → 0 |
| hills | 5 | 35 .. 73 | 663 .. 1015 | 78 → **0** |
| mountain | 5 | 83 .. 116 | 2248 .. 3328 | 179 → **0** |

**25 flat leaves carry 0 escarpment edges and 0 ops. 10 cliff leaves carry 35–116 edges.** The
negative control is a property of the SHARED threshold, not of a guard I remembered to write: at
grade 0.030 the flat families refuse zero cells, which `groundRefusal.js`'s own header measured
before this lane existed. On `forest` the raw crag count is **1 cell**, correctly rejected as a
boulder rather than promoted to an escarpment.

### (b) wall-over-cliff ops = 0 on the cliff fixture — **CONFIRMED, 257 → 0**

Over all 35 leaves: **257 → 0**, with the unarmed arm convicting on every cliff leaf (the vacuity
guard is asserted FIRST in pin 8). Drawn wall segments fell 499 → 355 → 337 as the curtain stopped
surrendering ground it never held.

### (c) two different relief fields at the same seed → different wall traces — **CONFIRMED**

Same seed, same settlement, same circuit ring; field B is field A's height+slope mirrored in x:

```
field A: 95 edges -> ring 45 vtx, 36 termini, digest 75456b88769c7312
field B: 90 edges -> ring 43 vtx, 28 termini, digest 4b1a1761077406f8
TRACES DIFFER: PASS   (a value-ignoring read would return one digest twice)
```
Corpus-wide, the termini are placed **49.4% by the drawn escarpment's own geometry (`via: 'edge'`,
an analytic crossing) and 50.6% by its cell mask (`via: 'mask'`)** — 358 termini over 35 leaves.
Both halves are the escarpment artifact; neither is a flag.

### (d) the legacy path byte-frozen with the feature off — **CONFIRMED**

Full published fabric, deterministically serialized (typed arrays, sorted keys, cycle-safe) and
sha256'd, at my tip vs a **pristine `ee0db96d3` worktree**:

| fixture | flag-off fabric digest | wallCircuit inputsHash | bytes |
|---|---|---|---|
| plains | IDENTICAL | IDENTICAL | 4,143,205 |
| riverside | IDENTICAL | IDENTICAL | 4,340,195 |
| hills | IDENTICAL | IDENTICAL | 4,428,390 |
| mountain | IDENTICAL | IDENTICAL | 4,116,571 |
| fjord | IDENTICAL | IDENTICAL | 4,335,870 |
| coastal | IDENTICAL | IDENTICAL | 4,479,503 |

**VERDICT: BYTE-FROZEN.** And the dormancy is TWO-LAYERED: armed on a leaf with no escarpment
(plains/riverside/fjord/coastal), the WALLS are still byte-identical — only `fabric.cliffs`'s
honest-NONE record is added.

### (e) determinism double-run byte-identical — **CONFIRMED**

```
plains    run1=506bf1a2914159af run2=506bf1a2914159af  PASS
hills     run1=4ec6c72c07046e60 run2=4ec6c72c07046e60  PASS
mountain  run1=9cde15e0739ec587 run2=9cde15e0739ec587  PASS
```

### (f) convicting mutations — **ALL PASS**

| # | mutation | before → after |
|---|---|---|
| M1 | flatten the mountain height field | 86 edges → **0** |
| M2 | halve `slopeLocalMax` (the absolute-grade divisor) | 2513 crag cells → 78; 86 edges → 6 |
| M3 | amplify the plains height field ×8 | 0 edges → **115** |
| C | translate the edge set +4000 | crossing HIT → **none** |
| D | zero the impassable mask | 20 segments cut → **no cut (null)** |
| pin 4 | FLIP every brink/foot label | agreement 0.82 → **< 0.30** |

**M2 is the one that convicts a unit error**: a derivation reading the NORMALIZED slope instead of
the absolute grade would not move at all — that is exactly the "a threshold in a per-place-
normalized unit is a quantile wearing a grade's name" defect `groundRefusal.js` exists to prevent.

### (g) the pins — **15 passed, 0 failed**

`tests/domain/townMapFabricCliffs.test.js`, executed under plain node via a lane-local vitest shim
(the sealed tree has no `node_modules` and `npm install` cannot run in it; the shim THROWS on an
unimplemented matcher rather than passing vacuously). Arms 13 and 14 are the discharge itself: the
arrangement counts its cliff edges instead of publishing a constant zero, and `cliffs.js` is
assigned to S2 and to neither `FOUNDATIONS.modules` nor `FOUNDATIONS.allowedImports`.

## §4 · THE FIVE DEFECTS THIS LANE FOUND IN ITS OWN WORK

Each was found by measurement, and each is a class worth banking:

1. **⛔ AN ABSENT FEATURE THAT STILL PUBLISHES ITS ZERO IS NOT DORMANT.** Four unconditional keys
   (`cliffTermini: []`, three `0`s) moved the flag-off fabric digest on **all six** proof fixtures,
   including a plains leaf with no crag cell anywhere. The wall's own `contentHash` stayed
   identical — `ringsText` does not serialize those fields — so the node's staleness detector was
   blind to a change every consumer of the fabric object could see. `[]` and `0` are values, and a
   published value is a byte.
2. **⛔ A PREDICATE SAMPLED AT VERTICES MEASURES THE VERTICES, NOT THE LINE.** The first cut tested
   only `onImpassable(vertex)` and left **209 of 257** over-cliff drawn segments standing — an 18%
   cure that reads like a working one. `groundRefusal.bodyRefusal`'s header already states the
   general form for the other consumer of this same law.
3. **⛔ A GEOMETRIC GUARANTEE HOLDS ONLY IF NOTHING MOVES THE GEOMETRY AFTER IT.** The cut ran
   before `nestAround`, which MOVES vertices — so a wall lifted off a scarp was pushed back onto
   one. 12 segments survived on exactly the multi-epoch leaves. This file already states the class
   forty lines up, about `boundEpoch`: *"the closure runs LAST because every step above it can lose
   ground."*
4. **⛔⛔ TWO SAMPLED APPROXIMATIONS OF ONE PREDICATE CONVERGE ON EACH OTHER BUT NEVER MEET.** Three
   rounds took the corpus 257 → 209 → 12 → 6 → 5 and stopped. Attribution (`probeAttr.mjs`) found
   every survivor to be the same shape — the first piece of a chain, one lone sample deep — from
   two sub-cell mechanisms: a masked patch narrower than the sample pitch (caught by the
   instrument's phase, missed by the law's), and a crossing at t ≈ 1e-12, i.e. an endpoint TOUCH
   convicting a terminus for being exactly where §577 requires it. **A tolerance added to close
   that gap would have been a number fitted to this corpus.** The mask is a set of CELLS and a
   segment either enters one or it does not: `segmentTouchesImpassable` (Amanatides–Woo) answers
   it exactly, is used by the law AND by the instrument that grades the law, and took the figure
   to **0** with no epsilon anywhere.
5. **⛔ A FIELD NAMED FOR ITS RARITY BECOMES MISINFORMATION WHEN THE MECHANISM CHANGES.** Once the
   test became exact, mask-derived termini went from 4 of ~400 to **half of them** — so a reader
   taking the field's original name, `fallback`, at face value would have read the primary
   mechanism as a defect rate. It is now `via: 'edge' | 'mask'`, both legitimate, with the boolean
   kept as an alias.

A sixth, in the pin file rather than the code: **A LABEL PRODUCED BY COALESCING IS A STATEMENT
ABOUT THE RUN, AND A PIN THAT ASSERTS IT OF EVERY MEMBER IS PINNING A PROPERTY THE DERIVATION
NEVER CLAIMED** — arm 4 first demanded 24/24 and measured 17/24, because sliver absorption
deliberately swallows short opposite-kind runs. Re-measured: **84.0% (hills) / 81.7% (mountain)**
vertex agreement, per-edge majority on 47/49 and 96/99. The arm now asserts dominance with a
flip-the-labels control.

## §5 · ⚠⚠ THE FINDING THE CHAIR SHOULD SEE FIRST — **A FJORD HAS NO CLIFF**

Measured on the walled fjord fixture (`mountain` + `port` → the §5.-1c reconciliation family):

| leaf | family | shape.relief | ramp | measured spread | localMax | grade p90 | grade MAX | crag cells |
|---|---|---|---|---|---|---|---|---|
| fjord | `fjord` | 0.92 | 0.70 | **1.000** | 0.02564 | 0.0176 | **0.0256** | **0** |
| mountain | `mountain` | 1.00 | 0.00 | 0.852 | 0.09877 | 0.0470 | 0.0988 | 3099 |
| hills | `hills` | 0.52 | 0.00 | 0.419 | 0.06811 | 0.0281 | 0.0681 | 736 |
| coastal | `strand` | 0.18 | 0.72 | 0.242 | 0.00626 | 0.0035 | 0.0063 | 0 |

**The fjord's height field SATURATES — spread 1.000, the maximum possible — and its steepest cell
is grade 0.0256, BELOW `REFUSAL.crag` = 0.030. It has no impassable ground anywhere.** The
mechanism is exact: `RECONCILED_SHAPES.fjord` carries `ramp: 0.70`, and the ramp term is
`h = h·0.30 + u·0.70` — a monotone linear fall across the frame that (i) damps the `ridged: 0.74`
noise to 30% of its amplitude and (ii) contributes a gradient of only 0.70/1000 per view unit.

⭐ **THIS IS `reliefField`'s OWN DOCSTRING ARRIVING FROM THE OTHER SIDE** — *"two leaves with the
same 0.66 can be a single cliff in a plain and a whole folded upland"* — and here it is *maximum
spread with no local steepness anywhere.* The consequence is concrete and it lands on the register
programme's critical path: **§577's cliff terminations will fire on `hills` and `mountain` and
NOT on the fjord**, which is the family DESIGN_REGISTER_PROGRAM §5's REG-2 row most expects them
on ("a fjord — a terraced town on the shelf above and a deep cove harbour below"). The same
applies to `strand` (localMax 0.006 — the flattest ground in the corpus).

⚠ **I DID NOT FIX IT, AND THE REASON IS THE GATE.** Both candidate cures — moving
`RECONCILED_SHAPES.fjord`'s `ramp`/`relief`, or moving `REFUSAL.crag` — are constants that shape
worlds, i.e. TUNING CLASS, owner-signed at the tuning pass (judgment-ledger §3, and the memory row
"tuning signature"). The escarpment derivation is behaving **correctly**: it declines to
manufacture a cliff on ground that has none, which is precisely the phantom-cliff refusal the exit
demands. Routed to §8.

## §6 · JUDGMENT CALLS (each vetoable)

- **J-REGG1-1 — the relief field is NOT rebuilt.** Re-chartered by the chair; independently
  confirmed at the slot first. No duplicate producer was written and none deleted, because none
  existed. *Say "veto" to flip it.*
- **J-REGG1-2 — the escarpment derives from the FABRIC SUBSTRATE, never from the manifest's 33×33
  height grid.** MEASURED: zero manifest reads exist anywhere under `src/domain/townMap/fabric/`;
  the 33×33 grid is the townCartography track's input (`cartographyField.js:182`). A cliff derived
  from it would fork the drawn escarpment from the ground the fabric's own parcels, streets and
  refusals stand on — the parallel-generator defect `cartographyField.js`'s header names from the
  other side. ⭐ The seam is free: if a later wave plumbs the manifest into `buildSubstrate`, the
  escarpment follows automatically, because it reads the substrate and nothing else.
- **J-REGG1-3 — NO SEEDED WOBBLE on the escarpment; corner-cutting only.** `relief.js`'s
  `shoreContour` displaces its ring through `organicRing` because a wild shore genuinely wrinkles.
  A cliff edge is not ink: `walls.js` terminates a circuit ON it and `fabricDcel` nodes it into a
  planar arrangement. Two consequences, both wanted: the module mints **no random namespace at
  all** (S2's `randomNamespaces` and `statefulForkSites: 0` are untouched and honestly so), and it
  is a pure function of the substrate alone, exactly like `buildableMask` and `reliefField`.
- **J-REGG1-4 — the escarpment joins the DECLARED `substrateKey` rather than taking a row of its
  own in `WALL_CIRCUIT_INPUTS`.** `inputsText` walks the frozen LIST and writes `k=∅` for a null,
  so adding `'cliffs'` would append `cliffs=∅` to **every leaf in the estate** and move every
  circuit's `inputsHash` on a wave whose feature is dormant. The fold is also the honest home:
  `substrate.key`'s own docstring calls it *"over the substrate's own DERIVED SHAPE … what MAKE
  this ground this ground"*. ⚠ And it is NECESSARY, not cosmetic: `assertCircuitFresh` verifies a
  ring set against this hash, so leaving the arming out would let a consumer verify an
  UNTERMINATED ring set against the inputs of a TERMINATED one and be told it was fresh.
  *This is the call most worth a second opinion.*
- **J-REGG1-5 — the ring stays CLOSED; the CHORD is published as not-wall and the drawn line
  breaks there.** Opening the polygon would break `pointInRing`, the §200 band, §232's district
  partition and the nesting law. §577 rules that the CURTAIN stops, and `circuitDrawnRuns` already
  breaks the drawn line at an open gate — this is the same act for the same reason.
- **J-REGG1-6 — no tenth run type.** A terminus types `terrain-surrender`, whose policy already
  says what a terminus is (*"the ground defends itself — a scarp … the wall thins to a parapet and
  carries NO towers (§205.3)"*). `RUN_TYPES`' closed set of nine is a ruling and its walker would
  red. The end-work re-uses `angle` from `TOWER_TYPES` for the same reason.
- **J-REGG1-7 — the §297.2b BLOCK-FACE hold is KEPT.** `deriveBlockFaces` now passes
  `cliffs: false` explicitly. §297.2(b) holds block termination for water AND cliff; the cliff half
  is about a FACE closed by an escarpment ("does the ground below a brink belong to the block above
  it?"), which is a ruling this lane was not chartered to make. The ARRANGEMENT's role is
  discharged — the water edge's exact disposition, one role over.
- **J-REGG1-8 — the ops metric measures `circuitDrawnRuns` interiors, not polygon segments.** An
  "op" is a drawing operation (§217 op ceilings). Counting a terminus TOUCH as a violation makes
  §577 unsatisfiable — the rule requires the curtain to end ON the escarpment. The correction is
  paired with a vacuity guard asserted FIRST (the unarmed arm must convict, and does: 257).

## §7 · DEFERRED — DOCUMENTED, NOT BUGS TO RE-FIND

1. **The §217 op-ceiling exposure is UNMEASURED.** Armed, a `mountain` circuit segments heavily
   (up to 22 segments / 40 termini on one leaf) and each terminus raises an end-work, so tower
   counts rise sharply (measured on one fixture: 20 → 40 on E2). **I did not run `renderFolio` and
   did not count primitives against the pinned ceilings.** A ceiling raise is §217 owner-signed, so
   this must be measured before any cutover. Not a defect — an unmeasured cost.
2. **The lens draws no cliff.** `cliffs.edges` reaches `fabricDcel` and `walls.js`; nothing strokes
   an escarpment on the plate. That is REG-5's drawn-world arm (terrain hachure), gated on this
   wave, and outside this charter.
3. **`waterMode`/`waterWorks` are untouched.** A cliff meeting the water (a sea cliff — the fjord
   case) has no combined rule; the two terminations are independent filters today.
4. **The stage-manifest walker was NOT executed.** `tests/lint/stageManifest.walker.test.js` needs
   vitest's full runner and the sealed tree has none. Pin 14 asserts the manifest rows I changed;
   the walker's own arms (backward-edge set, allowed-import derivation from source, SCC) are
   **argued** in §2 of this receipt and pin 14, **not executed**. The `S6>S2` import rides an
   already-declared backward edge, so `backwardEdges()` should be unchanged — **PLAUSIBLE, not
   CONFIRMED.** The experiment that would settle it: run the lint suite in a tree with a full
   `npm ci` node_modules.

## §8 · OPEN — FOR THE CHAIR

| # | question |
|---|---|
| Q1 | **The fjord has no cliff (§5).** Does `RECONCILED_SHAPES.fjord`'s `ramp: 0.70` want a local-relief term, or does `REFUSAL.crag` want lowering? Both are tuning class and owner-signed. Until one moves, §577 does not fire on the family REG-2 most wants it on. |
| Q2 | **Is a 22-segment circuit the register we want?** On `mountain` (33.6% impassable ground) the physics says a continuous wall is impossible, but the plate may read as a broken circuit rather than a defended one. A taste call for the CT-0 judging round, with the §217 cost (deferral 1) attached. |
| Q3 | **J-REGG1-4** — the `substrateKey` fold. The alternative costs an estate-wide `inputsHash` move on a dormant wave; I judged that a worse trade, but it is a hash-surface decision. |
| Q4 | **The block-face half of §297.2b (J-REGG1-7)** stays held. Should the cliff arm ride the wave that answers it for water (G-34's bankside-vs-transit machinery), or earlier? |

## §9 · FORBIDDEN-LIST COMPLIANCE

No shipped-src edits — every write is inside the lane worktree or this scratchpad · no pushes · no
ref moves · no memory writes · no new persisted bytes (derive-don't-store; nothing enters a
settlement's identity) · no runtime trig, `Date`, `Math.random`, `Math.pow` or `localeCompare` in
any new code · `grep` used only through node scripts · no subagents spawned · all compounds ended
on `echo`.
