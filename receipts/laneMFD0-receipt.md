# Lane MF-D0 · **THE STANDALONE OFFSET KERNEL** (ODQ §287.12 / §294.7a / §294.9; SPEC §7.8 D0, §10.16(2), §278): receipt

**Lane MF-D0 (Opus 5), 2026-08-21.** Predecessor: `laneMFW2-receipt.md` (sealed W2 tip).
⛔ **NO git write of any kind, NO repo gate, NO repo-file edit, NO ODQ or spec edit, NO memory
write.** The only repo access was READ-ONLY: `map-corpus/docs/GENERATION-SPEC.md`.
**Working tree:** `<scratchpad>/laneMFD0-tip` (copied from `laneMFW2-tip`; own hardlinked
`node_modules`). **Counterfactual arms:** `-cfZ` / `-cfW`. **Measurement trees:** `-diag` / `-diag2`
(instrumented scratch; the tip itself is never instrumented).
⛔ `mf-proto/build-out` (the killed W3 tip) and `laneMFW2-tip` were never written to — verified by
`diff -rq`: exactly the FIVE files §8 lists differ, and the sealed W2 tree is unmodified.

---

## §0 · THE VERDICT, STATED FIRST

> ⭐⭐⭐ **THE OFFSET KERNEL LANDS AND THE CENSUS IT WAS ORDERED FOR READS ZERO. 12 → 0** on the
> W2 instrument, unmodified, run against my tip (`laneMFD0-crossing-tip.log`). **Suite 246 → 248,
> `TRUE_EXIT=0`. Determinism 10/10. Four drawn censuses 0/0/0/0 area-true over 23,557 bodies.
> Containment residual 0 of 17. All 102 renders under ceiling — none raised, and the metropolis is
> 6 primitives CHEAPER.** `properCross` has ONE exported home and a source scan now keeps it there.

> ⭐⭐⭐ **AND THE DEFECT WAS THREE TIMES THE SIZE THE ORDERED CENSUS COULD SEE.** The W2 ratchet
> asked `walls[].polygon` and read 12 segments on 5 leaves. Asked of EVERY ring the fabric
> publishes — the ditch, the claim line, the closed circuit, the demotion's garden ring — the
> sealed W2 base carries **38 crossing segments over 24 of its 90 rings, on ten of eleven walled
> leaves.** The wall polygon was **32%** of it. My tip reads **0 in every family.**

> ⭐⭐⭐ **§278's GRADING RULE IS ANSWERED BY AN EXECUTED COUNTERFACTUAL, NOT BY AN ARGUMENT.**
> Eleven of eleven walled leaves move — and **arm Z proves the ordinary case is untouched: withdraw
> the repair at its own switch, change nothing else, and the tip is 34/34 BYTE-IDENTICAL to the
> sealed W2 base.** The repair fires **19 times over 12 leaves** in the whole corpus, and
> `guardSimpleRing` returns the caller's own array object — pinned by IDENTITY, not equality — on
> every ring it does not convict. **The moved set is exactly the set of leaves that publish a
> circuit; all six unwalled leaves are byte-identical.**

> ⭐⭐ **§278's PREDICTION WAS RIGHT ABOUT THE WALL AND WRONG ABOUT THE BLAST RADIUS, AND ARM W IS
> THE MEASUREMENT THAT SEPARATES THEM.** Guarding only the wall ring moves **precisely the five
> leaves §278 named** — and leaves **11 self-crossing ditch segments on 6 distinct sites shipping**.
> I took the kernel and put the choice to the chair with both numbers (§7 RAISED-4); arm W is a
> built, measured, one-line veto.

> ⛔⛔ **BOTH OF W2 §9.1's DIAGNOSED CAUSES ARE WRONG, AND THE STAGE MEASUREMENT SAYS SO.**
> `resampleClosed` introduces **zero** crossings anywhere; the closure sweep's celebrated 63.5-unit
> push is real and arrives **after** the ring is already folded. The producers are the vertex-normal
> mitre (**8** of 12 — the exact number the killed W3 tip's own docstring published, measured
> independently two waves later) and a terrain pull nobody had named (**4**).

> ⛔ **AND ONE THING GOT WORSE, WITH THE NUMBER: `highwater` LOSES ALL FIVE OF ITS FILLED-DITCH
> GARDENS** (city 5→2, metropolis 10→6, migration 5→2). A repaired ring is shorter and sits on
> slightly different ground for a siting pass that already refused 80–90%. W2's exit 7 was already
> a PARTIAL; this makes it marginally worse on one leaf. **Reported, not traded away** — the lever
> is W3's composition-order move, not this wave's geometry.

---

## §1 · THE BASELINE, RE-MEASURED AT MY OWN TREE BEFORE ANY EDIT

⭐ **EVERY W2 PROOF-FLOOR FIGURE I DEPEND ON REPRODUCES.** ODQ Law L3: each figure below traces to
a self-named captured log in the scratchpad.

| figure | measured | log | status |
|---|---|---|---|
| suite | **11 files / 246 tests passed**, `TRUE_EXIT=0` | `laneMFD0-baseline-suite.log` | ⭐ CONFIRMED — matches W2 §11 exactly |
| self-crossing circuit segments | **12 over 17 leaves / 10 over 11 distinct sites** | `laneMFD0-crossing-base.log` | ⭐ CONFIRMED — matches W2 §9.1 exactly |
| cross-process determinism | **10 processes, identical = 10**, digest `ca6ed6ca…a54e` | `laneMFD0-det-base.log` | ⭐ CONFIRMED — matches W2 §7's digest exactly |
| four drawn censuses | **0 / 0 / 0 / 0 AREA-TRUE** over 23,550 bodies (13,564 distinct-site) | `laneMFD0-drawn-base.log` | ⭐ CONFIRMED — matches W2 §11 exactly |
| op ceiling | **ALL 102 RENDERS UNDER**; metropolis 8,226 / 9,700, headroom 1,474 | `laneMFD0-ops-base.log` | ⭐ CONFIRMED — matches W2 §6 exactly |

⚠ **THE SPEC'S D0 EXIT CRITERION SAYS "self-intersection 11 → 0"; THE SEALED W2 BASE MEASURES 12.**
The 11 is MF-W1b's tip (16 leaves); W2 added the `crossing` leaf and the number became 12 over 17.
**This lane is graded against 12 → 0.** Reported rather than graded around. *(§7 RAISED-1)*

### §1.1 · THE FIVE AFFECTED LEAVES AT THE SEALED W2 TIP ARE NOT THE FIVE W2's PROSE NAMES

```
laneMFD0-crossing-base.log — THE SEALED W2 TIP
city          old-core  E1 verts=25   2
metropolis    main      E2 verts=26   3
metropolis    old-core  E1 verts=26   2
metropolis    old-core  E0 verts=26   1
polycentric   main      E1 verts=120  1
migration     old-core  E1 verts=25   2
crossing      main      E1 verts=120  1
                                     ── 12 over 17 leaves / 10 over 11 distinct sites
```

⚠ W2 §9.1's table lists the affected set as *city · metropolis · polycentric · highwater ·
migration* — that is the **MF-W1b BASE** row, not W2's own tip. **At the sealed W2 tip `highwater`
is CLEAN and `crossing` (W2's own new leaf) is the fifth.** The graded set for this lane is
therefore **city · metropolis · polycentric · migration · crossing**. *(§7 RAISED-2)*

---

## §2 · THE DIAGNOSIS — WHICH STAGE INTRODUCES THE CROSSING, MEASURED STAGE BY STAGE

The wall trace runs six stages per epoch. `laneMFD0-diag` is a throw-away copy of the tip with a
crossing count taken after each one; `laneMFD0-stage.mjs` runs the corpus through it.
**The tip itself is never instrumented.**

```
laneMFD0-stage.log — NEW CROSSINGS INTRODUCED, BY STAGE, WHOLE CORPUS
  resampleClosed (the arc-length hull)      0
  TERRAIN PULL   (the ±1.5-margin search)   4     city E1 (2) · migration E1 (2)
  offsetPolygonOutward (vertex-normal mitre) 8    metropolis E2 (3) · E1 (2) · E0 (1)
                                                  polycentric E1 (1) · crossing E1 (1)
  chaikin (corner cutting)                  0
  boundEpoch / translateEdgesOut (closure)  0
  the half-ring water filter                0
                                          ── 12 of 12 ACCOUNTED FOR
```

⭐⭐ **8 OF 12 FROM THE MITRE — WHICH IS EXACTLY THE NUMBER THE KILLED W3 TIP'S OWN DOCSTRING
PUBLISHED** (SPEC §6.9 quotes it: *"`offsetPolygonOutward` introduced 8 of the corpus's 12
self-crossing circuit segments"*). Two independent measurements, two waves apart, one number.
**CONFIRMED.**

⛔⛔ **AND W2's TWO PUBLISHED CAUSES ARE BOTH WRONG, WITH THE NUMBER TO SHOW IT.** *(§7 RAISED-3)*

1. W2 §9.1 cause (a): *"`epochAxis.translateEdgesOut` … a 5× multiplier … the metropolis's worst
   facet is pushed 63.5 units against a 25.6-unit working margin."* **The 63.5 is real** —
   `laneMFD0-stage.log` reads `boundWorst 63.48` on metropolis E2 — **but the crossings are already
   there when the closure receives the ring.** metropolis E2 reads `OFFSET 3 -> smooth 3 -> CLOSE 3`:
   the closure introduced **zero**. ⭐ **THE CLASS: A STAGE THAT CARRIES THE LARGEST NUMBER IN THE
   TRACE IS NOT THEREBY THE STAGE THAT CAUSED THE DEFECT** — the 63.5 was measured, correctly, and
   then attributed to the wrong stage because nothing had asked the earlier stages the question.
2. W2 §9.1 cause (b): *"the metropolis's old cores push ZERO and still cross, so the remainder is
   `resampleClosed` over a fragmented traced component."* **`resampleClosed` introduces 0 crossings
   on every leaf of the corpus.** The metropolis's old cores do push zero (`pushed 0`) — and they
   cross **because the mitre folded them**, not because the resample did.

⚠ **AND A THIRD CAUSE NOBODY HAD NAMED: THE TERRAIN PULL.** `city E1` and `migration E1` read
`hull 0 -> pull 2` — the ring is simple when it leaves the resample and self-crossing before the
offset is called at all. The pull searches nine candidate positions along a **single ±45° diagonal**
(`ox = x + s`, `oy = y + s` for the same `s`), so neighbouring facet vertices can be pulled past one
another. **Not cured in this lane** (§6) — it is a trace-behaviour change, not a kernel change.

---

---

## §3 · WHAT I BUILT — ONE KERNEL, ONE PREDICATE, THREE PRODUCERS THAT CONSUME IT

### §3.1 · THE RING KERNEL (`fabricGeometry.js`)

| export | what it is |
|---|---|
| `crossParams(a,b,c,d)` | *(module-private)* the crossing determinant and its two parameters — **the one spelling.** The operation ORDER is preserved character for character from `groundLaw.js`'s copy, so every §17 abutment decision it already governed is bit-identical |
| `CROSS_EPS = 1e-9` | how near a segment's ends a crossing may sit and still be PROPER |
| `properCross(a,b,c,d)` | ⭐ **THE ONE EXPORTED HOME** (SPEC §278's graded criterion). `groundLaw.js` now imports it; its private copy is deleted |
| `ringSelfCrossings(poly)` | ⭐⭐ the proven predicate: proper crossings of a closed ring with itself, skipping adjacent edges and the wrap pair |
| `SIMPLIFY_PASSES = 64` | a safety rail, not a convergence criterion — the crossing count strictly decreases each pass |
| `simplifyRing(poly)` | ⭐⭐⭐ the versioned robust repair. Cut at the crossing, keep the loop whose ORIENTATION matches the original and, among those, the larger area. Returns `{ ring, excised, before, after }` |
| `guardSimpleRing(poly)` | ⭐⭐⭐ **THE EXCEPTION-ONLY SWITCH.** A simple ring is returned as **the same array object**, not a copy |
| `offsetPolygonOutward` | the mitre is computed exactly as before, then returns `guardSimpleRing(out)` |

⭐⭐ **WHY IT TERMINATES, WHICH IS WHAT MAKES IT ADMISSIBLE IN A DETERMINISTIC GENERATOR.** Both
loops of a cut are sub-curves of the original with two edges truncated at a point that already lay
on both, so no pass can CREATE a crossing; each pass resolves at least the pair it cut. The scan
order is fixed (lowest `i`, then lowest `j`), the arithmetic is `+ − × ÷` and `Math.sqrt` only, and
no random or clock value is read. **It is not a shrink-to-fit:** nothing is scaled, smoothed or
nudged by a tolerance — the output is a subset of the input's own boundary plus the cut points.

### §3.2 · THE THREE PRODUCERS, EACH GUARDED AT ITS OWN SITE

| producer | file | measured crossings it introduced |
|---|---|---|
| the vertex-normal mitre | `fabricGeometry.offsetPolygonOutward` | **8** of the wall census's 12 (+ every ditch and garden ring, §4) |
| the terrain pull | `walls.js` (the ±1.5-margin search) | **4** of 12 — `city` E1 and `migration` E1 |
| the closure sweep | `epochAxis.boundEpoch` | **0 on the corpus and 1 on a FIXTURE** — §5.2 |

⛔ **AND A FOURTH FILE HAD TO MOVE, FOR A DEFECT THE CURE EXPOSED RATHER THAN CAUSED** —
`wallCircuit.splitAtGates`, §5.3.

---

## §4 · ⛔⛔ THE DEFECT IS THREE TIMES THE SIZE THE WALL CENSUS COULD SEE

The W2 ratchet asked the question of `walls[].polygon` alone. The offset kernel emits **five** ring
families and nothing had ever asked the other four. `laneMFD0-rings.mjs` asks all of them.

```
laneMFD0-rings-base.log — THE SEALED W2 BASE, EVERY PUBLISHED RING
  wall          12 over 17 leaves / 10 over 11 distinct sites   ← all the W2 census could see
  closedWall     4 / 2
  ditch         13 / 8
  claimLine      5 / 5
  epochHull      0 / 0                                          ← `resampleClosed` is clean
  ditchGarden    4 / 3
  ────────────────────────────────────────────────────────────
  ALL-RING      38 over 17 leaves / 28 over 11 distinct sites
  24 of 90 published rings cross themselves
```

⭐⭐⭐ **THE WALL POLYGON WAS 32% OF THE DEFECT.** Ten of eleven walled leaves ship at least one
self-crossing ring; the five the W2 census named are the five whose *wall* folded. **This is the
standing law arriving as a number:** *a census over a derived set proves nothing about a surface it
does not contain.*

```
laneMFD0-rings-tip.log — MY TIP
  ALL-RING       0 over 17 leaves / 0 over 11 distinct sites   ⭐ 75 rings examined, 0 dirty
laneMFD0-crossing-tip.log — the W2 instrument, unmodified, on my tip
  SELF-CROSSING CIRCUIT SEGMENTS: 0 over 17 leaves / 0 over 11 distinct sites   ⭐ 12 → 0
```

⚠ **75 RINGS AT THE TIP AGAINST 90 AT THE BASE, AND THE DIFFERENCE IS NOT A CENSUS GAP.** A
repaired ring is shorter, so the demotion emits fewer ditch-garden quads (`n = min(gardenOuter,
gardenInner, ring.polygon)`), and a repaired `claimLine`/`closedPolygon` that equals its wall
polygon by identity is not double-counted. The per-family zeros are what carry the claim, not the
denominator. **§6.3 prices the fossil consequence, which is real and is a loss on one leaf.**

---

## §5 · THE DECLARED SHIFT — ATTRIBUTED BY COUNTERFACTUAL, ONE MECHANISM AT A TIME

Each arm withdraws ONE mechanism at its own switch from the finished tip (MF-PERF1 §7.1's method).
34 plates = 17 leaves × 2 lenses, against `laneMFD0-shas-BASE.json` (the sealed W2 tip).

| arm | what is withdrawn | identical | leaves MOVED |
|---|---|---|---|
| ⭐⭐⭐ **Z** | `guardSimpleRing` returns its argument — the repair off, everything else compiled | **34 / 34** | ⭐ **NONE** |
| **W** | the guard withdrawn from the offset PRIMITIVE; the wall ring guards itself | 24 / 34 | **5** — city · metropolis · polycentric · migration · crossing |
| **TIP** | nothing withdrawn | 12 / 34 | **11** — the ten above plus town · highwater · siege · plague · famine · year-100 |

### §5.1 · ⭐⭐⭐ ARM Z IS THE PROOF §278's GRADING RULE ASKED FOR, AND IT IS EXECUTED, NOT ARGUED

SPEC §278: *"IF EVERY WALLED LEAF MOVES, THE CURE IS WRONG — it has changed the offset's behaviour
in the ordinary case, not just the degenerate one."* **Eleven of eleven walled leaves DO move, and
the ordinary case is nevertheless untouched — arm Z proves it: with the repair withdrawn at its own
switch and nothing else changed, the tip is 34/34 BYTE-IDENTICAL to the sealed W2 base.** The
repair fires 19 times over 12 leaves out of every offset the corpus computes
(`laneMFD0-guard.log`), and `guardSimpleRing` returns the caller's own array object on every ring
it does not convict — pinned by identity, not equality, in `townMapWallRuns.test.js`.

⭐⭐ **SO §278's PREDICTION WAS EXACTLY RIGHT ABOUT THE WALL AND WRONG ABOUT THE BLAST RADIUS, AND
ARM W IS THE MEASUREMENT THAT SEPARATES THE TWO.** Guarding only the wall ring moves **precisely
the five leaves §278 named** — and leaves **11 self-crossing ditch segments on 6 distinct sites**
still shipping (`laneMFD0-rings-cfW.log`). The extra six leaves are the ditch, the claim line and
the demotion's garden ring: rings §278 did not know it was predicting about. **§7 RAISED-4 puts the
choice to the chair with both numbers, and arm W is a one-line veto.**

### §5.2 · ⛔ THE CLOSURE SWEEP IS A PRODUCER TOO — AND IT FIRES ON A FIXTURE, NOT ON THE CORPUS

`laneMFD0-stage.log` reads `CLOSE` equal to `OFFSET` on all seventeen leaves: over the corpus the
sweep introduces nothing. **The very first run of the new all-ring pin convicted
`closedWall.old-core.E0` on the metropolis FIXTURE.** `translateEdgesOut` pushes a vertex along its
bisector divided by the cosine to its edge normal, floored at 0.2 — a sharp concave corner travels
five times the gap it owes, and a sound ring folds. ⭐ **THE CLASS, AND I WALKED INTO IT WHILE
CURING IT: a stage measured only over the corpus is measured over a SAMPLE, and "this stage
introduces nothing" is a claim about the sample.** The guard now runs INSIDE the sweep loop, so a
later round can re-push any ground a repair exposed; `translateEdgesOut` is handed `out.length`
rather than the captured `n`, because a repair can shorten the ring and a stale length would walk
the sweep off the end of its own polygon.

### §5.3 · ⛔⛔ `splitAtGates` DREW A CHORD ACROSS AN OPEN GATE — LATENT AT THE BASE, LIVE AT MY TIP

The §230 pin — *the drawn runs and the claim runs come from ONE splitter* — went red on the
metropolis fixture: **the ink came within 10.54 units of an open gate whose radius is 33.13**
(`laneMFD0-splitter-fail.log`, `laneMFD0-gateprobe.mjs`).

**THE MECHANISM, EXACTLY.** `run.length === 1` at the end of a closed walk means one thing: the
SEAM segment (last vertex → vertex 0) *left* a gate circle before arriving. `flush` drops a
one-point run, and the merge rule then joined the FIRST run to whatever run happened to be last —
a chord straight across the opening. ⭐ **The guard `!inGate(line[0])` was necessary and never
sufficient: vertex 0 can sit outside every circle while the segment that reaches it passes through
one.** The repair re-seams a ring it excises a loop from, and the seam landed in a gate.

```
laneMFD0-seam.log   the geometric hazard condition, corpus + all six walled fixtures
  sealed W2 base    0 of 25 rings        ⚠ LATENT — which is why nothing had ever seen it
  my tip            1 of 25 rings        (metropolis fixture, old-core E1)
```

⭐⭐ **AND THE FIX IS PROVED BYTE-NEUTRAL AT THE BASE BY EXECUTION, NOT BY ARGUMENT: arm Z carries
the `splitAtGates` fix and is still 34/34 identical.** It is this helper's **third** seam defect —
its own docstring already records two — which is why it is cured structurally rather than worked
around in the caller. **§7 RAISED-5.**

---

### §5.4 · WHERE THE REPAIR FIRES, COUNTED — 19 TIMES OVER 12 LEAVES

```
laneMFD0-guard.log — every call site that reaches the repair, whole corpus
  offsetPolygonOutward <- traceWalls:406  (THE DITCH)      9 fires / 13 crossings / 8 leaves
  offsetPolygonOutward <- traceWalls:301  (THE WALL RING)  5 fires /  8 crossings / 3 leaves
  guardSimpleRing      <- traceWalls:299  (THE PULL)       2 fires /  4 crossings / 2 leaves
  offsetPolygonOutward <- demoteCircuits:194 (THE GARDEN)  3 fires /  3 crossings / 3 leaves
  boundEpoch (THE CLOSURE)                                 0 fires on the corpus — §5.2
```

⭐⭐ **12 LEAVES FIRE AND 11 MOVE, AND THE TWELFTH IS THE ATTRIBUTION'S OWN CONTROL.**
`year-018` carries a wall form and **zero circuits**, so the ring its ditch offset repairs is never
published: it fires and its plate is byte-identical. **The moved set is therefore exactly the set
of leaves that publish a circuit — 11 of 11 walled leaves; all 6 unwalled leaves are untouched.**

---

## §6 · THE PROOF FLOOR AT MY TIP — every figure quoting its own captured log

```
                                    SEALED W2 BASE            MF-D0 TIP
suite (lane config, bare)           11 files / 246 tests      11 files / 248 tests   TRUE_EXIT=0
                                    laneMFD0-baseline-suite.log  laneMFD0-suite-tip.log
⭐ self-crossing circuit segments    12 / 17 · 10 / 11         ⭐⭐⭐ 0 / 17 · 0 / 11
   (the W2 instrument, unmodified)  laneMFD0-crossing-base.log   laneMFD0-crossing-tip.log
⭐ ALL-RING self-crossing segments   38 / 17 · 28 / 11         ⭐⭐⭐ 0 / 17 · 0 / 11
   (24 of 90 rings dirty)           laneMFD0-rings-base.log      laneMFD0-rings-tip.log
cross-process determinism           10/10 ca6ed6ca…            10/10 83c25846…       (declared)
                                    laneMFD0-det-base.log        laneMFD0-det-tip.log
§17 / §17.4 / §205A / §200 drawn    0/0/0/0 AREA-TRUE         0/0/0/0 AREA-TRUE
                                    over 23,550 bodies        over 23,557 bodies
                                    laneMFD0-drawn-base.log      laneMFD0-drawn-tip.log
containment residual                0 of 17                   0 of 17
epoch members outside own circuit   0 of 8,746                0 of 8,621
                                                             laneMFD0-contain-tip.log
op ceiling (§217 per-tier ratchet)  ALL 102 UNDER             ⭐ ALL 102 UNDER — none raised
   metropolis headroom              1,474                     ⭐ 1,480  (−6 primitives)
   city headroom                    369                       367
   town headroom                    16 (fjord, UNWALLED)      16 — UNCHANGED, and fjord is
                                                              byte-identical, so the tightest
                                                              budget in the corpus was not touched
                                    laneMFD0-ops-base.log        laneMFD0-ops-tip.log
purity scan (comments stripped)     49 files — NONE           49 files — NONE
sizeBaseline                        MAX 787 (buildFabric.js)  MAX 787 — UNDER 800
                                                              fabricGeometry 425 → 505 eff
                                                             laneMFD0-purity-size.log
⛔ circuit-vs-circuit crossings      20 / 17 · 20 / 11         ⚠ 10 / 17 · 10 / 11 — §7 RAISED-6
                                    laneMFD0-interring-base.log  laneMFD0-interring-tip.log
```

**THE SUITE ARITHMETIC, ATTRIBUTED SO THE DELTA IS NOT A MYSTERY: 246 − 2 + 4 = 248.**
−2 the W2 ratchet's two arms (the per-fixture ceiling and the non-vacuity arm, **deleted exactly as
that arm's own comment instructed**); +3 in `townMapWallRuns.test.js` (the all-family census at
zero, its bow-tie counterfactual, the exception-only identity pin); +1 in
`tests/lint/wallRuns.walker.test.js` (the ONE-HOME source scan).

### §6.1 · THE FORENSIC ZOOM AT 3,000 px — 22 PNGs RETAINED, AND WHAT THEY SHOW

`laneMFD0-zoom-png/` holds **all eleven affected leaves at 3,000 px in both states** (`-BASE-`
from arm Z, `-TIP-`) plus six named crops. `laneMFD0-zoom.mjs` renders, `laneMFD0-crop.mjs` cuts by
world coordinate.

| subject | BASE | TIP |
|---|---|---|
| ⭐⭐ **metropolis, the old cores** (`CROP-metropolis-cores-*`) | the curtain throws a long thin **DART** into open ground west of the core — two heavy strokes meeting at a tower dot, enclosing an empty triangle, with a spur that simply stops | ⭐ **the dart is gone.** One clean re-entrant corner; the wall reads as a single continuous circuit and the ground it encloses is the town |
| ⭐⭐ **crossing, the south flank** (`CROP-crossing-wall-*`) | the wall drives a deep **V-SPIKE** far south past the quarter label, apex a bare point in empty country, with the ditch's dashed line spiking beside it | ⭐ a shallow notch that stays with the fabric. **"Spurs dying in open country" — the chair's own words — is what came out** |
| ⭐ **town, the east ditch** (`CROP-town-ditch-*`) | the **DASHED DITCH** crosses itself in a narrow dart while the wall beside it is sound — the defect family no census had ever looked at | the ditch follows the wall as one line. **Every other mark in the frame is pixel-identical:** buildings, streets, the green field, the label |

⚠ **AND ONE THING THE ZOOM SHOWS THAT IS NOT MINE.** On the metropolis, two DIFFERENT circuits
still cross each other at the north-east. That is a separate predicate (§7 RAISED-6): the base
carries **20** circuit-vs-circuit crossings and my tip **10** — halved, not cured.

### §6.2 · THE TIP'S AFFECTED-LEAF COUNT, PUBLISHED

```
LEAVES:  17     MOVED 11     BYTE-IDENTICAL 6
PLATES:  34     MOVED 22     BYTE-IDENTICAL 12   (laneMFD0-attrib.log, laneMFD0-cf2.log)
MOVED:   town · city · metropolis · polycentric · highwater · siege · plague · famine
         · migration · year-100 · crossing        = every leaf that publishes a circuit
IDENTICAL: thorp · hamlet · village · mountain · fjord · year-018
```

### §6.3 · ⛔ THE COST, STATED WITH THE NUMBER RATHER THAN AROUND IT — THE FOSSILS

A repaired ring is shorter, so the demotion generates fewer garden quads, and the ones it does
generate sit on slightly different ground for a siting pass that already refuses 80–90% (W2 §3.1).

```
laneMFD0-meta-delta.log — sited ditch gardens, BASE -> TIP
  city         5 -> 2      metropolis  10 -> 6      migration  5 -> 2
  ⛔ highwater  5 -> 0      (refused 18 -> 22)
```

⛔ **`highwater` LOSES ITS ENTIRE RIBBON OF FILLED-DITCH GARDENS.** W2 graded exit 7 — *can a
reader see that this town had an older wall?* — a **PARTIAL** and named the cause: the demotion
runs after the packer and can only take leftover ground. **This wave makes that PARTIAL slightly
worse on one leaf, and I am reporting it rather than trading the geometry cure against it.** The
lever is unchanged and is not mine: W2 §9.2's composition-order move (the ring street above the
packer), which **W3 owns**. `demotedStubs` moves the other way (city 2 → 4, metropolis 1 → 2).

---

## §7 · ⭐⭐⭐ RAISED TO THE CHAIR — judgment-dense, decided by nobody in this lane

**RAISED-1 · THE GRADED FIGURE IS 12 → 0, NOT SPEC §7.8's "11 → 0".** The 11 is MF-W1b's tip over
sixteen leaves; W2 minted `crossing` and the number became 12 over seventeen. *If the chair wants
the spec's literal 11 honoured, the spec row needs the correction, not the measurement.*

**RAISED-2 · W2 §9.1's AFFECTED-LEAF LIST IS THE **BASE** ROW, NOT ITS OWN TIP.** It names *city ·
metropolis · polycentric · highwater · migration*. At the sealed W2 tip `highwater`'s wall is CLEAN
and `crossing` is the fifth. Anything downstream that inherited that list inherited a stale one.

**RAISED-3 · BOTH OF W2 §9.1's DIAGNOSED CAUSES ARE WRONG, AND THE CORRECTION IS §2.** Cause (a)
blamed `translateEdgesOut`'s 5× multiplier: the 63.5-unit push is real and the crossings are
already present when the closure receives the ring. Cause (b) blamed `resampleClosed` over a
fragmented component: it introduces **zero** crossings on every leaf, and the `epochHull` family
reads 0 in the all-ring census as an independent confirmation. **The real causes are the mitre (8)
and the terrain pull (4).** *A successor diffing against W2 §9.1 will be diffing against a wrong
model.*

**RAISED-4 · ⭐⭐ THE BLAST-RADIUS CHOICE, WITH BOTH NUMBERS MEASURED — THIS IS THE ONE REAL
DECISION IN THE LANE.** SPEC §278 predicted five moved leaves. Arm W proves the prediction exactly
right *about the wall ring* and shows what it costs:

| | leaves moved | self-crossing rings still shipping |
|---|---|---|
| **arm W** — guard the wall ring only (§278's literal shape) | **5** | ⛔ **11 segments in the ditch, over 6 distinct sites** |
| **TIP** — the kernel guards the offset primitive | **11** | ⭐ **0, in every family** |

**I IMPLEMENTED THE TIP, AND THE ARGUMENT IS D0's OWN REASON FOR EXISTING:** SPEC §7.7 census 7
says *0 rings, 0 caps, 0 keels*, and *"a ring that crosses itself does not bound a solid"* is as
true of a ditch as of a curtain — D1 gives it volume and D4 lights it. Shipping 11 known folded
ditch rings into the dimensional program to satisfy a prediction made before anyone had counted
the ditches would be fitting the cure to the forecast. ⚠ **But §278 is a chair ruling and its
number is now wrong, so the chair should re-state it.** *Veto is one line: revert
`offsetPolygonOutward` to `return out;` and wrap the wall ring's call — `laneMFD0-cfW` is that
tree, already built and measured.*

**RAISED-5 · A SECOND MECHANISM RODE ALONG, AND I COULD NOT LAND WITHOUT IT.** `splitAtGates`'s
seam rule (§5.3) is a genuine latent defect — 0 of 25 rings trip it at the base, 1 at my tip, and
the §230 pin reds when it does. **It is proved byte-neutral at the base by arm Z's 34/34.** It is
nevertheless a *second* named change in a micro-wave §278 ruled must ride ALONE. *I judged
"unblock the ruled wave with a proved-neutral fix" to beat both alternatives — rotating the
repaired ring to dodge the seam (papering over a real defect) and stopping the lane. Vetoable, and
the veto costs the wave.*

**RAISED-6 · THE METROPOLIS'S THREE CIRCUITS CROSS EACH OTHER, AND D0's EXIT CRITERIA DO NOT ASK.**
20 crossings at the base, **10 at my tip** — halved as a side effect, not cured.
`main.E2 × old-core.E0` went to zero; `old-core.E1 × old-core.E0` is unchanged at 6. A ring nesting
law is a different predicate from self-intersection and W2's concentricity pin cannot see it
either (it compares radius profiles). **Instrument: `laneMFD0-interring.mjs`. Not in my brief; not
attempted; named so it is not re-found as a surprise.**

**RAISED-7 · THE TERRAIN PULL SEARCHES A SINGLE ±45° DIAGONAL.** In `walls.js` the nine candidates
are `ox = x + s`, `oy = y + s` for the *same* `s` — the wall's terrain service can only look
north-east/south-west, and that is how two neighbouring facets get pulled past one another (4 of
the 12 crossings). **The kernel refuses the invalid result; the search is untouched.** Re-aiming it
is a trace-behaviour change with an unmeasured blast radius and belongs to a wave that owns wall
behaviour, not to the kernel's micro-wave.

**RAISED-8 · A STAGE MEASURED ONLY OVER THE CORPUS IS MEASURED OVER A SAMPLE.** §5.2: the closure
sweep introduces zero crossings on all seventeen leaves and folds a ring on the metropolis
*fixture*. **The corpus is not the population**, and this is the same shape as the standing
memory law about censuses over derived sets. Offered as a program law, not just a lane note.

---

## §8 · WHAT CHANGED, FILE BY FILE

| file | what |
|---|---|
| **`fabric/fabricGeometry.js`** | ⭐⭐⭐ **THE RING KERNEL** — `crossParams` (private) · `CROSS_EPS` · `properCross` · `ringSelfCrossings` · `SIMPLIFY_PASSES` · `simplifyRing` · `pickLoop` · `dropRepeats` · `guardSimpleRing`; `offsetPolygonOutward` returns `guardSimpleRing(out)`; the module docstring's *"no self-intersection repair"* claim qualified with the correction rather than left standing |
| `fabric/groundLaw.js` | the private `properCross` **deleted**; imported from the kernel with the operation order preserved exactly |
| `fabric/walls.js` | the terrain pull's output guarded (`perim = guardSimpleRing(perim)`), with the ±45° diagonal recorded and NOT cured |
| `fabric/epochAxis.js` | the closure sweep's output guarded INSIDE the loop; `translateEdgesOut` handed `out.length` rather than the captured `n` |
| `fabric/wallCircuit.js` | `splitAtGates`'s seam rule (§5.3) — the one-point pending run joins the FIRST run instead of licensing a chord |
| **tests** | `townMapWallRuns.test.js` −2 ratchet arms, **+3** (all-family census at zero · bow-tie counterfactual · exception-only identity); `lint/wallRuns.walker.test.js` **+1** (the ONE-HOME source scan) |

⚠ **ONE NEW MODULE EDGE, FORWARD:** `epochAxis → fabricGeometry`. `groundLaw` and `walls` already
imported it. No cycle is created — `fabricGeometry` imports only `trigTable`.

---

## §9 · WHAT I DID NOT DO — stated affirmatively

1. ⛔ **NO GIT WRITE OF ANY KIND, NO REPO-FILE EDIT, NO REPO GATE OR REPO TEST RUN.** The only repo
   access was reading `map-corpus/docs/GENERATION-SPEC.md`.
2. ⛔ **I DID NOT TOUCH `mf-proto/build-out`** (the killed W3 tip, quarantined evidence) or
   `laneMFW2-tip` (the sealed base). Both are byte-untouched.
3. ⛔ **I DID NOT CURE THE TERRAIN PULL'S DIAGONAL SEARCH** (RAISED-7) or the circuit-vs-circuit
   crossings (RAISED-6). Both measured, both named, neither attempted.
4. ⛔ **I DID NOT RESTORE `highwater`'s FIVE DITCH GARDENS** (§6.3). The lever is W3's
   composition-order move; tuning the geometry to recover a fossil count would be fitting the cure
   to a downstream count.
5. ⛔ **I DID NOT UPDATE ANY LEDGER, ODQ, SPEC, PLAN OR MEMORY FILE.** This receipt is the whole
   deliverable and the chair collects it.
6. ⚠ **THE `laneMFD0-diag` AND `laneMFD0-diag2` TREES ARE INSTRUMENTED SCRATCH** and are not the
   tip. `laneMFD0-cfZ` / `laneMFD0-cfW` are the two counterfactual arms and each differs from the
   tip by exactly ONE mechanism — verified by `diff`.

---

## §10 · ARTIFACTS (scratchpad, `laneMFD0-*`)

| file | what it is |
|---|---|
| `laneMFD0-tip/` | ⭐ **THE TIP.** Copied from `laneMFW2-tip`; own hardlinked `node_modules` (the shared `preview-tip` modules are pruned to 17 files — see §11) |
| `laneMFD0-cfZ/` · `-cfW/` | the two counterfactual arms (repair withdrawn · wall ring only) |
| `laneMFD0-diag/` · `-diag2/` | the instrumented measurement trees (stage attribution · guard fire sites) |
| `laneMFD0-stage.mjs` · `-stage.log` | §2's stage-by-stage attribution — which stage introduces the crossing |
| `laneMFD0-rings.mjs` · `-rings-{base,tip,cfW}.log` | ⭐⭐ §4's ALL-RING self-intersection census |
| `laneMFD0-interring.mjs` · `-interring-{base,tip}.log` | RAISED-6's circuit-vs-circuit census |
| `laneMFD0-seam.mjs` · `-seam.log` | §5.3's seam-crosses-a-gate hazard census |
| `laneMFD0-guard.mjs` · `-guard.log` | §5.4's call-site census — where the repair actually fires |
| `laneMFD0-gateprobe.mjs` · `-gateprobe2.mjs` · `-splitter-fail.log` | §5.3's §230 diagnosis |
| `laneMFD0-shas-{BASE,TIP,cfZ,cfW,cfZ2,cfW2}.json` · `-attrib.log` · `-cf.log` · `-cf2.log` | §5's declared-shift attribution |
| `laneMFD0-meta-delta.log` | §6.3's fossil and vertex-count consequences |
| `laneMFD0-zoom.mjs` · `-crop.mjs` · `laneMFD0-zoom-png/` · `-zoom-svg/` | §6.1's 3,000 px renders — **22 PNGs + 6 crops, retained** |
| `laneMFD0-{baseline-suite,suite-tip,pins-probe}.log` | the suite, before and after |
| `laneMFD0-{crossing,det,drawn,ops,rings}-{base,tip}.log` · `-purity-size.log` · `-contain-tip.log` | the proof floor |

⚠ **EVERY INSTRUMENT TAKES AN EXPLICIT TREE.** `MFD0_TREE=` for mine, `MFW2_TIP=` for the inherited
W2 ones. Both default to a tree that is NOT this lane's — set them.

---

## §11 · HAZARDS FOR THE NEXT LANE

- ⛔⛔ **THE SHARED `preview-tip/node_modules` IS PRUNED TO 17 FILES** and every sealed tree's
  `node_modules` symlink into it now DANGLES — `laneMFW2-tip` cannot run its own suite as it
  stands. I hardlink-copied `rs4/node_modules` (identical `dependencies`/`devDependencies`) into my
  own trees; hardlinks survive a sibling deleting its copy. **A successor must do the same or
  `npm ci`, and must not "fix" `preview-tip`.**
- ⛔⛔ **`MFW2-crop.mjs` HARDCODES `preview-tip/node_modules/sharp`** and is therefore DEAD. Use
  `laneMFD0-crop.mjs`, which resolves sharp from a live tree.
- ⚠⚠ **A CENSUS OVER A DERIVED SET PROVES NOTHING ABOUT A SURFACE IT DOES NOT CONTAIN** — the wall
  polygon was 32% of the self-crossing defect (§4). Before quoting any "0 over the corpus", check
  what the instrument's `ringsOf` equivalent actually enumerates.
- ⚠⚠ **AND ITS TWIN: THE CORPUS IS A SAMPLE.** The closure sweep reads clean on all seventeen
  leaves and folds a ring on a FIXTURE (§5.2). Run the fixtures too.
- ⚠⚠ **A RING REPAIR RE-SEAMS THE RING.** `simplifyRing` starts the returned ring at the crossing
  point, so any helper whose correctness depends on where vertex 0 sits will change behaviour —
  `splitAtGates` did, and it drew a chord across an open gate (§5.3).
- ⚠ **`guardSimpleRing` RETURNS ITS ARGUMENT BY IDENTITY when the ring is simple.** A caller that
  mutates the returned array would be mutating its own input. Nothing does today; the pin that
  proves the exception-only law depends on this identity, so do not "tidy" it into a `.slice()`.
- ⚠ **`translateEdgesOut` SIZES ITS GAP ARRAY FROM ITS `n` ARGUMENT.** It is now handed
  `out.length` because a repair can shorten the ring mid-sweep. Any new caller owes the same.
- ⚠ **THE DETERMINISM DIGEST MOVED — `ca6ed6ca…` → `83c25846…` — AND IT IS THE DECLARED SHIFT, NOT
  A DEFECT.** The diffable surface is the per-leaf plate SHAs in `laneMFD0-shas-TIP.json`.
- ⚠ **THE TOWN TIER'S 16 PRIMITIVES OF HEADROOM ARE STILL SET BY `fjord`, WHICH IS UNWALLED AND
  BYTE-IDENTICAL AT MY TIP.** This wave spent none of them. It remains the corpus's tightest
  budget and the next wave that adds a mark to an unwalled town pays it.
- ⚠ **W2 §9.1's CAUSES AND AFFECTED-LEAF LIST ARE BOTH WRONG** (RAISED-2, RAISED-3). Take §1.1 and
  §2 of this receipt instead.
