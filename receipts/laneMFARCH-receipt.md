# Lane MF-ARCH — THE ARCHITECTURE WAVE (ODQ §234 / §238.5 / §239 / §240): receipt

**Lane MF-ARCH (Opus 5), 2026-08-17, under the FEATURE-LAW FREEZE, on MF-B8b's tree.**
**Touched:** the sandbox only. **NO git tree write, NO repo gate, NO branch move, NO memory
write, NO git command of any kind.** Every write went to `mf-proto/build-out/**`, the
disposable `laneMFARCH-tip` overlay, and `MFARCH-*` scratch files.

---

## §0 · THE HEADLINE, STATED FIRST

> ⭐⭐⭐ **THE PIPELINE HAS NO INHERENT CYCLES AT ALL. All eight are the same defect: TWO
> VERSIONS OF ONE ARTIFACT SHARING ONE BINDING NAME.** The read-only derivation graph is
> already a DAG — proved, not assumed — and every cycle is created by a WRITE-BACK. The
> owner's §239/§240 epoch model supplies the missing axis: these are not cycles, they are
> version transitions written as mutations. **No bounded solver is needed anywhere, including
> `wallCycle.js`.**

> ⭐⭐⭐ **AND THE PREDICATE CLASS HAD THREE MORE MEMBERS THE PILOT DID NOT REACH.** MF-B8b cured
> the predicate that decides whether a body stands in reserved ground. Three other laws that
> test geometry against geometry were blind in the same way — and one of them says "MAJORITY
> **AREA**" in its own comment while counting **corners**.

| law | as written | area-true | verdict |
|---|---|---|---|
| §17.4 street carriageway (ground law) | 0 | 0 | ✔ b8b's win re-quoted, 23,116 bodies |
| §200 wall band (ground law) | 0 | 0 | ✔ b8b's win re-quoted |
| §205A water claim (ground law) | 0 | 0 | ✔ b8b's win re-quoted |
| §17 mutual exclusion | 0 | 0 | ✔ COMPLETE — its edge-cross arm proven non-vacuous |
| **§205A census · channel crossings** | 113 | ⛔ **115** | BLIND — a street spanning a river in ONE segment |
| **§205A census · body wetness** | 12 | ⛔ **26** | BLIND — and `rooted` counted dry CORNERS |
| **§203 containment · "majority AREA"** | 444 | ⛔ **251** | it counted CORNERS; 229 bodies judged differently |

**AFTER (every figure executed this session, at my tip, after the final edit):**

```
vitest (lane config, bare)               Test Files 7 passed (7)  Tests 152 passed (152)
                                         = MF-B8b's 134 + 18 NEW; ZERO pins re-recorded
cross-process determinism                10 processes, identical=10 mismatched=0
                                         c7d922f6631e718a8ba4f0e09471002cc2396bbaced99dba3e0652552560e480
                                         ⭐ BYTE-IDENTICAL TO MF-B8b's DIGEST
run-1 parchment SHAs, all 16 leaves      ⭐ BYTE-IDENTICAL TO MF-B8b's — not one pixel moved
§17 / §17.4 / §205A / §200 drawn census  0 / 0 / 0 / 0 over 23,116 bodies, AREA-TRUE
§202 landlocked · §201B orphan streets   0 · 0 — b8b's wins PRESERVED
op ceiling (§217 per-tier ratchet)       ALL 96 RENDERS UNDER THEIR TIER CEILING
purity scan (comments stripped)          Math.random/Date/localeCompare/Math.pow/trig — NONE
sizeBaseline (lane instrument)           MAX 793 (buildFabric.js) against 800 — UNDER (b8b: 794)
```

**Deliverables**

- **items 1, 2, 3 DELIVERED WHOLE; item 4 FOUNDATION + ENFORCEMENT; items 5, 6, 7 HANDED OFF
  with cause (§8).**
- `mf-proto/build-out/src/**` — `reservedGround.js` (+2 area-true answers), `leafCensus.js`
  (3 predicates cured), `wallCircuit.js` (+ the publishing accessor), `buildFabric.js`
  (publishes through it), `fabricRng.js` (+ `keyedRandom` / `descendantId`)
- `tests/lint/derivationGraph.walker.test.js` — **NEW, 11 pins**, 3 labelled counterfactuals
- `tests/domain/townMapWallCircuit.test.js` — **+6 pins**, 2 labelled counterfactuals and 2
  further arms that plant a shape the old predicate acquitted
- `tests/domain/townMapFabricInertia.test.js` — **+1 pin** with its own planted control
- instruments: `MFARCH-graph.mjs` (the extractor), `MFARCH-scc.mjs`, `MFARCH-predaudit.mjs`,
  `MFARCH-rawscan.mjs`, `MFARCH-alias.mjs`, `MFARCH-paths.mjs`, `MFARCH-temporal.mjs`,
  `MFARCH-epoch.mjs`, `MFARCH-meta.mjs`, `MFARCH-det/-battery/-drawn/-sync.sh`
- reports: `MFARCH-scc-report.txt`, `MFARCH-graphB.dot`, `MFARCH-graphC.dot`,
  `MFARCH-predaudit.txt`, `MFARCH-temporal.log`, `MFARCH-epoch.log`, `MFARCH-final-battery.log`

---

## §1 · ITEM 1 · THE SCC DIAGNOSTIC — BUILT FIRST, BEFORE ANY SOLVER

### §1.1 · THE INSTRUMENT, AND WHY IT ASKS THE QUESTION IT DOES

⭐⭐⭐ **`buildFabric` IS STRAIGHT-LINE CODE, SO AN SSA-STYLE SCC PASS WOULD REPORT "0 CYCLES"
ON ANY INPUT AND PROVE NOTHING.** No loops, no recursion ⇒ every such program is trivially a
DAG in SSA. That instrument would be vacuous by construction — the pilot's blind predicate in
a new hat. The question with content is: **is a name REBOUND after something read it?** If yes,
the derivation of that name depends on something that depended on it, and the fixed statement
order **is already a cut of a real cycle**. The diagnostic's job is to make every silent cut
declare itself.

**COUNTERFACTUAL 0 — the instrument itself, before it was pointed at the tree:**

```
clean        SCCs 0 (want 0) ✔
planted      SCCs 1 (want 1) ✔ {a,b,c}      (cycle by ASSIGNMENT)
via-method   SCCs 1 (want 1) ✔ {a,b,m}      (cycle by METHOD MUTATION)
```

⛔ **AND MY FIRST EXTRACTOR FAILED THAT SECOND ARM.** It read only assignment expressions, so
`for (const h of ground2.huts) byKey.set(…)` — a mutation of `byKey` from `ground2` with no
assignment anywhere — was invisible, and the cycle `faubourgs → lateHuts → ground2 → byKey →
faubourgs` went unreported. ⭐ **THE CLASS: A GRAPH EXTRACTOR THAT ONLY READS ASSIGNMENTS IS
BLIND TO EVERY MUTATION SPELLED AS A METHOD CALL** — the pilot's own defect shape, one layer up.

### §1.2 · THE CONDENSATION, AS A DELIVERABLE

**GRAPH A · THE MODULE IMPORT GRAPH** (`src/domain/townMap/fabric/**`)

```
nodes 42   edges 145   components 42   NON-TRIVIAL SCCs 0
✔ ACYCLIC — no circular import anywhere in the fabric layer.
```

(144 edges before this wave; the 145th is `leafCensus.js → reservedGround.js`, added by §3's
predicate cure. Re-measured after the final edit — the layer is still acyclic, and the walker
pins it so.)

**GRAPH B · THE STAGE GRAPH inside `buildFabric()`**

```
nodes 118   edges 428   components 93   NON-TRIVIAL SCCs 2
  blob SCC size 25: { builtPartition, builtUmbrella, byKey, channels, fabricWeb, facedGreens,
                      facedSquares, faubourgs, fields, ground, ground2, habitation, inverted,
                      keepers, lateHuts, lod, measure, packed, seatedAll, seating, shanty,
                      standing, wallCircuit, wallCycle, walls }
  blob SCC size 2:  { ground3, stateMarks }
```

A 25-member SCC is TRUE and USELESS — six independent write-backs congeal into one blob through
shared reads. So the report does two more things, and they are what make it actionable.

**STEP 1 — REMOVE EVERY WRITE-BACK EDGE AND RE-RUN TARJAN**

```
write-back mutations removed: 18
✔ THE READ-ONLY GRAPH IS A DAG. Every cycle in the pipeline is created by a WRITE-BACK, so the
  write-back set is a COMPLETE FEEDBACK EDGE SET — proved, not assumed.
```

**STEP 2 — EACH WRITE-BACK RE-ADDED ALONE: ITS OWN TRUE CYCLE**

| line | write-back | from | SCC | members |
|---|---|---|---|---|
| 604 | `builtUmbrella.partition` | wallCycle | **2** | builtUmbrella → wallCycle |
| 630 | `packed.parcels` | ground | **13** | builtPartition, builtUmbrella, channels, fabricWeb, ground, inverted, lod, packed, seatedAll, seating, shanty, wallCircuit, wallCycle |
| 631 | `lod.masses` | ground | 2 | ground → lod |
| 632 | `shanty.huts` | ground | 2 | ground → shanty |
| 642 | `fabricWeb.squares` | facedSquares | 2 | fabricWeb → facedSquares |
| 648 | `builtUmbrella.greens` | facedGreens | 2 | builtUmbrella → facedGreens |
| 839 | `shanty.huts` | ground2 | **6** | fields, ground2, habitation, lateHuts, measure, shanty |
| 921 | `stateMarks.bodies` | ground3 | 2 | ground3 → stateMarks |
| 922 | `stateMarks.groundLawReason` | ground3 | 2 | ground3 → stateMarks |
| 182, 236, 237, 279, 740, 838, 840, 843, 908 | *(nine others)* | — | — | forward edges that only look like feedback |

```
⇒ 9 of 18 write-backs induce a REAL CYCLE; 9 are forward edges.
⇒ DISTINCT CYCLES BY MEMBERSHIP: 8
```

⭐ **THE REVIEW'S PREDICTION IS REFUTED IN DEGREE AND CONFIRMED IN KIND.** It predicted "one or
two tiny cycles (wall↔fabric, maybe water↔wall)". The measured answer is **eight**, the largest
spanning **thirteen** stages — and the wall↔fabric cycle IS among them, rediscovered
independently by the instrument at `builtUmbrella.partition ← wallCycle`, exactly where the
pilot found it by reading. **There is no water↔wall cycle.** Of the eight, **exactly one — the
wall's — had a written cut edge** before this wave; the other seven were cut silently by
statement order.

### §1.3 · GRAPH C — I REFINED IN THE WRONG DIMENSION, AND SAYING SO IS THE FINDING

I hypothesised the 13-stage cycle was an artifact of coarse artifacts (`packed` carries eight
independent products) and built a FIELD-GRANULAR graph to prove it.

```
GRAPH C  nodes 341  edges 822  NON-TRIVIAL SCCs 2
  widest cycle, BINDING granularity: 25 stages
  widest cycle, FIELD   granularity: 24 bindings
```

⛔ **MY HYPOTHESIS WAS WRONG AND THE MEASUREMENT SAID SO.** Splitting the artifacts finer in
SPACE removed one binding from a 25-member cycle. §239/§240 supply the axis I was missing, and
§2 below is that reconciliation.

### §1.4 · THE DIVERGENCE SCAN — the question an SCC cannot ask

An SCC says "a cycle was cut here." It does not say whether the cut HURT. It hurts in exactly
one circumstance: **a slot is read, then written, then read again** — the early and late readers
then hold two different values of one fact, which is the whole §230 family.

```
⇒ 8 DIVERGENCE SITES, 1 terminal repair, 1 deferred init, of 13 field write-backs.
```

Worst: `packed.parcels` — early read at 467, **late reads at 639, 645, 822, 873, 899, 911, 1265**.
Seven consumers see the post-law parcels and one sees the pre-law set. That is correct here (the
law's whole purpose), but **nothing else in this codebase enumerates the list**, and every future
"why do these two disagree" starts from it.

---

## §2 · ODQ §239 + §240 · THE TEMPORAL / EPOCH DECOMPOSITION — EVALUATED, WITH EVIDENCE

**THE ANSWER: the wall↔fabric SCC does NOT survive the decomposition. It dissolves. The residual
is an IMPLEMENTATION coupling and I can name the argument that causes it.**

### §2.1 · THE §239 YEAR TEST — RUN, AND IT CANNOT CONCLUDE (stated rather than smoothed)

The same town (`mf-town-01`) built at six years:

```
  year wall   inputsHash                         contentHash                        rings  umbrella pts  roads  frontage
    18 false  44afca9a7878d2ce3bf2f2b709b95efd   5c397434b46aa19cb4edea2022199ab2       0          2440      3     4.529
    49 true   60eac555dbbd3de42ea329e4f2ed1be8   514e4311a5f28056e83380fb80b1eb9f       1          2440      3     4.529
    60 …    100 …    128 …    180 true  — ALL IDENTICAL
DISTINCT circuit inputsHash across the walled years : 1
DISTINCT circuit contentHash across the walled years: 1
```

⚠⚠ **AND THIS ARM DISCRIMINATES NOTHING, WHICH MUST BE SAID.** The fabric is ITSELF year-invariant
at this seed — roads 3, frontage 4.529, umbrella 2,440 points at **every** year including 18,
before the wall exists. "The circuit did not move" is equally consistent with *it is anchored at
Y_wall* and with *nothing it reads moved*. ⭐ **THE CLASS: AN INVARIANCE TEST OVER AN INVARIANT
SUBJECT DISCRIMINATES NOTHING** — the two hypotheses make the same prediction, so the run is
**PLAUSIBLE, not CONFIRMED**, and I did not let it stand as the answer.

### §2.2 · THE §240 EPOCH TEST — THIS ONE IS DECISIVE (CONFIRMED)

**Q1 · IS THE EPOCH STRUCTURE ALREADY IN THE OUTPUT? YES.**

```
leaf          rings  kinds              nodes   inputsHash
town              1  main                   1   7b7377bd66264f88adcea0c323ed745a
city              2  main,old-core          1   69877bcf66a0ba830d7e4507c1be7af5
metropolis        2  main,old-core          1   1788c50360c7293e13ef5e16fee69ab2
highwater         2  main,old-core          1   04956daf09a57a265c582509e59ece02
migration         2  main,old-core          1   69877bcf66a0ba830d7e4507c1be7af5
⇒ 4 of 10 walled leaves carry MORE THAN ONE concentric circuit (main / old-core).
```

**Q2 · IS IT IN THE DERIVATION? NO.** Every ring on every leaf comes from **ONE node id, ONE
`inputsHash`, ONE derivation pass**. ⭐ **The epochs exist in the OUTPUT and are absent from the
DERIVATION** — the town already draws the owner's core→wall→ring structure and derives it in a
single simultaneous solve.

**Q3 · DID THE TRACE CONSUME GROUND THE WALL DOES NOT BOUND? YES.**

| leaf | bodies | intramural | in band | ⛔ EXTRAMURAL | traced outline outside the main ring |
|---|---|---|---|---|---|
| town | 1497 | 1328 | 0 | **169** | 35.1 % of 1400 pts |
| city | 2473 | 2402 | 1 | **70** | 18.3 % of 2032 pts |
| metropolis | 4061 | 4026 | 0 | **35** | 5.2 % of 1800 pts |
| polycentric | 1566 | 1256 | 0 | **310** | 58.4 % of 1496 pts |
| highwater | 1560 | 1509 | 0 | **51** | 6.7 % of 1448 pts |
| **CORPUS (walled)** | **19,563** | | | ⛔ **1,331 (6.8 %)** | |

### §2.3 · THE COUPLING, LOCATED AT ONE ARGUMENT

⭐⭐⭐ **`buildFabric.js` passes `circuitBody: inverted.circuitRing` into `solveWallCycle`, and
`inverted.circuitRing` is `deriveBuiltUmbrella`'s reading of the packer's FINISHED block runs —
the whole town, including the 6.8 % of bodies that end up outside the wall.** Under §240 the
circuit for epoch E must consume the umbrella of epoch E, which is complete before it. **The wall
is derived from ground it does not bound.** That is the forward half of the SCC, and it is an
implementation coupling, not an inherent one.

**The back half dissolves too, and more cleanly.** `builtUmbrella.partition = wallCycle.partition`
is not a write-back under the epoch model at all: `partition(E1)` is a **new artifact** derived
from `wall(E0)`, not a mutation of `partition(E0)`. **The cycle exists only because two epoch
versions of the partition share one binding name.**

### §2.4 · ⭐⭐⭐ THE GENERALIZATION — AND IT DISSOLVES ALL EIGHT, NOT ONE

Once the axis is named, every one of the eight cycles is the same shape:

| cycle | the two versions sharing one name |
|---|---|
| `builtUmbrella.partition ← wallCycle` | partition **before** and **after** the wall bounds it |
| `packed.parcels ← ground` | parcels **as cut** and **as clipped by the law** |
| `lod.masses ← ground` | masses as merged / as clipped |
| `shanty.huts ← ground` | huts as pitched / as clipped |
| `fabricWeb.squares ← facedSquares` | the void before / after its facades edge it |
| `builtUmbrella.greens ← facedGreens` | as above |
| `shanty.huts ← ground2` | the law's **pass 2** — literally an epoch of the law |
| `stateMarks.bodies ← ground3` | the law's **pass 3** — likewise |

⭐⭐⭐ **THE LAW, AND IT IS THE ONE TO BANK: A DERIVATION CYCLE IS USUALLY A MISSING VERSION AXIS.
Splitting the artifact finer in SPACE cannot dissolve it — I measured that and it did not (§1.3).
Giving it a VERSION INDEX does.** The epoch model is this domain's own name for SSA. With the
version axis made explicit the **entire pipeline is acyclic** — the read-only graph already is,
proved in §1.2 — and **no bounded solver is required anywhere, `wallCycle.js` included.**

⚠ **NOT BUILT THIS WAVE, ON INSTRUCTION AND ON JUDGMENT.** Both messages say report-only. It is
also the right call independently: a version-indexed pipeline is a same-seed shift on every
walled leaf and a rewrite of the assembly's spine, which is wave nine's deliberate act, not an
architecture wave's side effect under a feature-law freeze.

---

## §3 · ITEM 2 · PREDICATE UNIFICATION ACROSS ALL RESERVED GROUND

### §3.1 · THE AUDIT CARRIED ITS OWN COUNTERFACTUAL FIRST

```
bar 12×3, claim half 1.0 running THROUGH it lengthwise
VERTEX predicate penetration -0.803  → ACQUITS (the blindness, reproduced)
AREA   predicate penetration  1.000  → CONVICTS ✔
```

⛔ **AND TWO OF MY OWN ARMS WERE MIS-CALIBRATED ON THE FIRST RUN.** (a) The §17 comparison took
the vertex reading on RAW polygons and the full reading on SHRUNK ones, and reported "91 blind"
— which was 91 legal **party walls** that `shrinkToward` exists to forgive, pointing the wrong
way. (b) The §205A body arm compared a 0.50-width area test against a 0.62-width vertex test.
⭐ **THE CLASS: COMPARING TWO PREDICATES MEANS VARYING ONE THING — a tolerance difference reads
exactly like a blindness difference and can point the opposite way.** Both fixed before any
figure below was reported.

### §3.2 · CORPUS TOTALS, AS WRITTEN → AREA-TRUE (16 leaves, one build each)

| law | as written | area-true | subject | verdict |
|---|---|---|---|---|
| §17.4 street carriageway (ground law) | 0 | 0 | 23,116 | agree ✔ |
| §200 wall band (ground law) | 0 | 0 | 23,116 | agree ✔ |
| §205A water claim (ground law) | 0 | 0 | 23,116 | agree ✔ |
| §17 mutual exclusion | 0 | 0 | 23,116 | agree ✔ |
| **§205A census · channel crossings** | 113 | **115** | 6,529 channels | ⛔ BLIND by 2 |
| **§205A census · body wetness** | 12 | **26** | 16,974 | ⛔ BLIND by 14 |
| **§203 containment · "majority AREA"** | 444 | **251** | 20,857 | ⛔ 229 judged differently |

**PER LAW, AND WHAT ITS HISTORICAL CLAIMS ARE NOW WORTH:**

- ⭐ **§17 IS COMPLETE AND ITS CENSUS IS HONEST.** `overlapping()` carries an edge-cross arm
  beside the vertex arms. **Counterfactual: two bars crossing like a plus — the vertex arm alone
  ACQUITS, `overlapping` CONVICTS.** The arm is not vacuous, and b8b's "0 intersecting DRAWN
  pairs" stands. **No historical claim is refuted here.**
- ⭐ **§17.4 / §200 / §205A GROUND LAW: b8b's 0/0/0 RE-QUOTED AT MY TIP, AREA-TRUE, over 23,116
  bodies.** The pilot's cure holds.
- ⛔ **§205A's CHANNEL CENSUS WAS BLIND, AND ITS "100 UNACCOUNTED CROSSINGS" WAS AN UNDERCOUNT.**
  It asked the channel's **vertices** against the water centreline. A street whose two ends sit
  on opposite banks crosses **between** them and has no vertex inside — the identical shape as
  the wall running through a back-house whose four corners stand clear. The city and the
  migration leaf each hide one.
- ⛔ **§205A's BODY CENSUS WAS BLIND TWICE.** `wet` counted the body's **vertices**, so a body
  the channel passes through scored `wet = 0` and was skipped entirely; and `rooted` was
  `wet < poly.length` — **a count of dry corners** — so a pier covered except at one corner read
  "rooted" and a quay whose bulk is ashore but whose corners are all wet read "not rooted".
- ⛔ **§203's CONTAINMENT ARM SAID "MAJORITY AREA" IN ITS OWN COMMENT AND COUNTED CORNERS.** A
  burgage plot is ~4 × 10 units against a partition cell of 1000/128 ≈ 7.8, so a plot spans one
  to four cells and its corners routinely land in a distribution its bulk does not share.
  **229 bodies are judged differently — 211 acquitted by area, 18 convicted by it — and the
  published `zoneMajorityOutside` was over-reporting by 72 %.** ⭐ **THE CLASS: A PREDICATE WHOSE
  NAME SAYS "AREA" AND WHOSE BODY COUNTS VERTICES IS THE §230 DEFECT WITH A DOCSTRING** — it
  survived two waves because the comment read as the proof.

### §3.3 · THE CURE, AND THE PUBLISHED FIGURES IT MOVES

Two new area-true answers joined `reservedGround.js` — **the one home**, never a second spelling:
`segSegClosest` (the closest approach of two segments, and `segSegDist` now delegates to it, so
"is this a crossing" and "where is it" are ONE computation) and `latticeAreaShare` (a body's
area share by lattice owner, **exact** — the body is clipped to each cell, nothing is sampled).

| meta field | MF-B8b | MF-ARCH | movement |
|---|---|---|---|
| `waterCrossings` | 125 | **141** | +16 — 16 real crossings the census could not see |
| `waterExempt` | 25 | **27** | +2 |
| `waterViolations` | 100 | **114** | +14 |
| `zoneMajorityOutside` | 444 | **258** | −186 — the corner count was over-reporting |
| `zoneOutside` (arm 1, centroid) | 281 | 281 | unchanged — correct as a centroid test |
| `zoneOffBand` · `landlocked` · `orphanStreets` | 54 · 0 · 0 | 54 · 0 · 0 | ✔ preserved |

⭐⭐ **TWO INDEPENDENT INSTRUMENTS AGREE TO THE UNIT.** The external audit predicted the city's
§205A count would rise by exactly 7 (+1 channel, +6 bodies); the cured census rose by exactly 7.
Corpus: audit predicted **+16**, census delivered **125 → 141 = +16**. Town +0 predicted, +0
delivered; highwater +0/+0; fjord +2/+2. That agreement is the receipt, not the individual runs.

⭐⭐⭐ **AND NOT ONE PIXEL MOVED.** All 16 run-1 parchment SHAs are byte-identical to MF-B8b's and
the determinism digest is unchanged. **The censuses report; they do not draw.** This wave has
**no declared same-seed shift** — b8b's causes 93–96 stand alone.

⚠ **THE §205A SUBJECT SET IS *NOT* WIDENED, AND THE GAP IS REPORTED INSTEAD.** The census walks
institution **solids** only; **92 drawn bodies of 23,116 stand in its own 0.62-width reach**.
Widening a census's subject is a LAW change, the freeze is in force, and MF-B7's §202 flood is
the standing warning that a census blocking on more than its law names manufactures false
positives the next lane will "cure". **Measured, recorded, left for wave nine to rule on.**

### §3.4 · SURFACES AUDITED AND FOUND SOUND (reported so the audit is not mistaken for a sweep)

- **§202 access (`accessLaw.js`)** — rasterises bodies and wall bands onto a 1200² grid with
  `fillPoly`/`fillBand`. **Area-true by construction**, not vertex-sampled. Its approximation is
  RESOLUTION (cell 0.833 units), a different and declared class.
- **§232 district straddle** — b8b's lattice reading; area-true; 0 on every walled leaf.
- **`forbiddenGround` (streets.js), `inCommons`, `habitation`'s channel refusal** — POINT
  predicates used to choose CANDIDATE POSITIONS, each backed by the area-true ground law as the
  binding constraint. Correct as written; named here so no later lane "cures" them.
- **`fields.js:573` road-kink** — a furlong CENTRE against a road, choosing a strip ORIENTATION.
  Aesthetic, not a legality claim. Left alone deliberately.

---

## §4 · ITEM 3 · THE RAW-HANDLE ENFORCEMENT — AND WHY THE SCAN IS NOT THE PRIMARY GUARD

MF-B8b's ask: *"MF-ARCH's enforcement should be a source scan for raw-handle reads, not an
honour system around accessors."* **I built that scan first, and it is the reason the cure is
different.**

**MEASURED EXPOSURE, before anything changed:**

```
SURFACE                       reads  files   top consumers
water relation                   58     13   renderFolio×16 buildFabric×9 townMapDraw×8 townPanorama×7
parcels                          46     10   buildFabric×12 parcels×8 renderFolio×7
wall rings                       36      7   renderFolio×14 walls×6 groundDress×6 exemplars×4
street channels                  19      5   buildFabric×13 accessLaw×2 streets×2
wall circuit node (ACCESSOR)      2      2   leafCensus×1 renderFolio×1
```

⭐ **THE PILOT'S NOTE, MEASURED: the node publishes accessors and 36 of 38 wall reads still go to
the raw handle.**

⛔ **BUT THE TOKEN SCAN OVER-CONVICTS, AND AN ALIAS-AWARE ONE UNDER-DETECTS.** Resolving true
object paths with `acorn`: of 36 `.walls` hits only **8 are `fabric.walls`** — the rest are
`P.walls` (a palette), `fort.walls`, `c.fortifications.walls`, `dp.walls`. The fabric travels
under `fabric`, `f`, `dp`, `P`, `a`, `ctx`, `closing`; an alias detector requiring two fabric
signature keys on one identifier found only **6 of the files that hold one**.

⭐⭐⭐ **THE CLASS, AND IT CHANGED THE DESIGN: A SCAN OVER READ SITES MUST SOLVE ALIASING; A GUARD
AT THE PUBLICATION POINT DOES NOT HAVE TO.** There is exactly ONE place the handle is published
and unboundedly many places it is read.

**THE CURE: `fabric.walls` IS NOW A VERIFYING ACCESSOR** (`wallCircuit.publishCircuitRings`).
Every read, under every alias, in every file, passes through `verifyCircuit` — by construction
rather than by convention. `configurable: false`, so no consumer can replace it with a raw array.
**Counterfactual, executed: the raw handle itself now throws `STALE OR MUTATED NODE` on a
tampered node.**

⚠ **THE LIMIT, STATED EXACTLY:** the verification is memoized per node (a render reads
`fabric.walls` in loops and re-hashing a 117-vertex circuit per read would move the §217
ceilings). It catches a node that is stale or mutated **when the fabric first hands it out** —
the §230 class it exists for — not a mutation performed after that first read inside one render.
⚠ The memo is a module-scope `WeakSet`: my first spelling put a flag on the node and **threw,
because `deriveWallCircuit` FREEZES it.** That refusal is the node's own guarantee working, so
the memo moved off it rather than the freeze being loosened.

**THE SCAN KEEPS THE ONE JOB IT CAN DO PRECISELY** — the walker refuses a second, PLAIN-NAME
publication of a governed artifact from the single place artifacts are published, asserting the
return is `publishCircuitRings({…}, wallCircuit)` and that `walls` is absent from the literal.

**JUDGMENT ON THE OTHER SURFACES (recorded, §9 J-ARCH-4):** streets and water are **not** given
node treatment this wave. Both are read ~20–58 times including deep inside the lens; giving them
declared inputs and content hashes is a real change to what those consumers receive, under a
freeze, with no measured defect to cure. The exposure is measured above and handed off.

---

## §5 · ITEM 4 · keyedRandom + LINEAGE IDENTITIES — FOUNDATION AND ENFORCEMENT

**THE ARCHITECTURE WAS ALREADY MUCH CLOSER THAN §234 ASSUMED, and saying so matters:**
`fabricRng(seed, entityKey, {variant, changeYear})` **is** `keyedRandom(worldSeed,
stableFeatureId, …)` at entity grain, `hashUnit` is already stream-free, and
`lineage.subdividedParcelKey(parent, ordinal)` already gives splits derivable descendants.

**WHAT WAS MISSING, MEASURED:**

```
142  hashUnit / hash32 / hashInt call sites   — stream-free, but keys minted ad hoc
 15  fabricRng( entity-stream forks           — sequential WITHIN an entity
 12  hand-minted `${seed}|…` fork keys        — bypassing fabricForkKey entirely
```

⛔ **FIVE OF THE TWELVE DROP THE REROLL SALT.** `fabricForkKey` exists to put
`mapEdits.layoutVariant` into the ROOT of every key — `fabricRng.js`'s own header says *"salting
only some entities gives a reroll that changes half the town, which reads as a bug"* — and
`${seed}|meander`, `${seed}|coast|${i}`, `${seed}|umb`, `${seed}|built-umb`, `${seed}|built|wall`
compose from the bare seed, while `colonize` re-adds the salt **by hand** (the duplicated-rule
class again).

⚠ **THE DAMAGE IS LATENT, NOT ACTIVE, AND THE DISTINCTION IS THE HONEST ONE.** Every affected
mechanic's INPUTS also carry the variant, so its output moves anyway. The one path where it is
**active** is the coast fallback, whose input is the LANDED model's two-point path —
variant-invariant — so that jitter is identical at every reroll. **The corpus does not exercise
it.** ⭐ **AND THE EXISTING PIN IS TRUE OF THE COMPOSER AND FALSE OF THE FABRIC:** *"layoutVariant
salts the ROOT, so every entity fork inherits it"* asserts against `fabricForkKey` — which obeys
it — while five mechanics never call `fabricForkKey` at all. ⭐ **THE CLASS: A PIN ON A COMPOSER
IS NOT A PIN ON ITS CALLERS**, and the gap is invisible precisely because the composer is correct.

**DELIVERED:**

- `keyedRandom(worldSeed, featureId, mechanicId, sampleIndex, opts)` — integer hashing only,
  namespaced per mechanic, indexed per sample, carrying the variant salt. **Deliberately
  byte-compatible with `fabricForkKey`'s grammar so it lands with NO same-seed shift.**
- `keyedJitter`, `keyedRandomKey`, `descendantId(parentId, k)` (child = parent/ordinal, a
  **legible** ancestry rather than a digest — a parcel's descent stays readable in a receipt).
- **A RATCHET FREEZING THE TWELVE HAND-MINTED KEYS EXACTLY** (`buildFabric.js` 7,
  `substrate.js` 4, `snapshot.js` 1). ⚠ **EXACT, never a ceiling** — a `<=` ratchet lets a cured
  site pay for a new one and the count never moves (the banked-failure shape).
- **THE INERTIA PIN §234 ASKED FOR, WITH ITS PLANTED CONTROL.** Insert an unrelated institution;
  every organism whose facts did not move must have byte-identical **geometry AND draws** — a
  32-sample ladder per feature across four mechanics. ⛔ **My first planted control did not fire:**
  it streamed over `f.organisms`, and adding an institution changes the institution set, not the
  organism set, so the loop ran the same length in the same order. ⭐ **THE CLASS: A PLANTED
  CONTROL MUST PLANT THE DEFECT'S OWN MECHANISM, NOT SOMETHING ADJACENT TO IT.** Corrected to
  stream over landmarks-then-organisms; it now moves **all** of them.

⚠ **THE CONVERSION OF THE TWELVE SITES IS NOT DONE AND THAT IS DELIBERATE (§9 J-ARCH-5).**
It moves bytes on every leaf. Under a feature-law freeze, for a defect measured as latent, a
declared same-seed shift with no visible benefit is the wrong trade — and it would land on top
of b8b's causes 93–96. **Wave nine's single deliberate act; the ratchet guarantees a thirteenth
cannot appear meanwhile.**

---

## §6 · MF-B8b's AND MF-B8's WINS, RE-QUOTED AT MY TIP

| claim | b8b | **MF-ARCH, re-measured this session** |
|---|---|---|
| determinism, 10 processes | 10/10 `c7d922f6…e480` | **10/10, `c7d922f6…e480` — BYTE-IDENTICAL** |
| run-1 parchment SHAs, 16 leaves | 16 shas | **all 16 BYTE-IDENTICAL** |
| §17 DRAWN disjointness | 0 pairs | **0 pairs, all 16 leaves** |
| §17.4 DRAWN street right-of-way | 0 of 23,116 | **0 of 23,116, AREA-TRUE** |
| §205A DRAWN water right-of-way | 0 | **0** |
| §200 DRAWN wall band | 0 | **0** |
| §202 landlocked | 0 | **0** |
| §201B orphan street segments | 0 | **0** |
| §232 district straddlers | 0 of 62 | **0** |
| per-tier op ceilings | 96/96 under | **96/96 UNDER** (thorp 919/1000 · hamlet 1024/1100 · village 1663/1800 · town 4439/4600 · city 6338/6400 · metropolis 9622/9700) |
| purity scan | none | **NONE** (44 files) |
| sizeBaseline | max 794/800 | **max 793/800 — UNDER** |
| suite | 134/134 | **152/152, ZERO re-recorded** |

⭐ **THE UNCHANGED DETERMINISM DIGEST IS THIS WAVE'S STRONGEST RECEIPT** — b8b's own §12.9 law.
It proves three predicate cures, a publishing accessor and a new randomness primitive were all
behaviour-neutral on the drawing, which no green suite asserts.

---

## §7 · WHAT I DID NOT DO — stated plainly

1. ⛔ **ITEMS 5, 6 AND 7 ARE NOT BUILT.** Fixed-precision topology coordinates + the three hash
   tiers; spatial indexing with equivalence pins and per-census runtime budgets; the cross-engine
   determinism harness. **Cause: items 1–4 consumed the wave, and §239/§240 arrived mid-wave and
   were answered with executed evidence rather than deferred.** Designs and first steps are in §8.
2. ⛔ **THE VERSION-INDEXED PIPELINE (§2.4) IS REPORTED, NOT BUILT** — report-only on instruction,
   and independently the right call under a freeze.
3. ⛔ **THE TWELVE HAND-MINTED FORK KEYS ARE FROZEN, NOT CONVERTED** (§5).
4. ⛔ **STREETS AND WATER DID NOT BECOME GRAPH NODES** (§4). Exposure measured; handed off.
5. ⛔ **THE §205A SUBJECT SET WAS NOT WIDENED** (§3.3). 92 bodies measured; wave nine rules.
6. ⛔ **THE CONTENT HASH IS STILL 4×32 BITS FROM `fabricRng.hash32`,** not a cryptographic digest
   — b8b's item 3, untouched. §234's three hash tiers will want better.
7. ⛔ **b8b's AND b8's OPEN ITEMS ARE UNTOUCHED:** T-23/T-24 the countryside and road ladder, the
   four zoom defects, GAP-B's flat gradient, T-05's fill bands, the metropolis grain, the click
   region coverage, §205A's two residual exemption classes, the faubourg district-id owner gate.
8. ⛔ **NO FORENSIC ZOOM WAS TAKEN.** Justified this wave and stated so it is not assumed: all 16
   SHAs are byte-identical to b8b's, so the plates are the ones the chair already reviewed.

---

## §8 · WHAT WAVE NINE INHERITS

**THE FOUNDATION THAT IS LANDED AND ENFORCED**

1. **A derivation-graph diagnostic that runs on every suite** — 8 declared cycles each with a
   written cut edge; a new unnamed cycle reds; the module graph proven acyclic; the read-only
   stage graph proven a DAG.
2. **One home for area-true body predicates** (`reservedGround.js`), now four answers deep, with
   every geometry-vs-geometry law in the fabric audited against it and the three blind ones cured.
3. **A governed artifact that cannot be read raw** — the accessor is unavoidable by construction.
4. **`keyedRandom` + `descendantId`**, and a ratchet so no thirteenth hand-minted key appears.
5. **18 new pins**, of which **6 are explicitly labelled counterfactual or planted-control
   arms that must red**, plus 2 more that plant a shape the old predicate acquitted.

**THE FOUR THINGS TO DO FIRST, IN THIS ORDER**

1. ⭐⭐⭐ **RULE ON THE VERSION-INDEXED PIPELINE (§2.4).** It dissolves all eight cycles, deletes
   the need for `wallCycle.js`'s solver, and makes §240's epoch model the spine. It is a
   same-seed shift on every walled leaf and the largest single architectural improvement
   available. **Everything else in this list is cheaper after it, and some of it becomes free.**
2. **ITEM 5 — FIXED-PRECISION TOPOLOGY + THREE HASH TIERS.** The seam already exists:
   `wallCircuit.inputsText` uses `n6 = v.toFixed(6)` for its serialization, which is the
   quantization rule wanting to be named once and shared. WORLD = the canonical semantic state
   (quantized geometry + identities); PROJECTION = the command stream `renderFolio` emits;
   RASTER = the rendered pixels. Today one sha over the SVG conflates all three, so a style
   change and a geometry change are indistinguishable in a receipt.
3. **ITEM 6 — SPATIAL INDEXING WITH EQUIVALENCE PINS.** `reservedGround.claimIndex` is already
   canonical-ordering-correct and is the template. What is missing is the **indexed-vs-exhaustive
   equivalence pin on fixtures** and **per-census runtime budgets with a completeness status where
   "skipped due to scale" can never read green**. Cheap and high value: the §203 lattice arm I
   added is O(cells × poly) per body over 20,857 bodies and is the first thing that will want a
   budget.
4. **ITEM 7 — THE CROSS-ENGINE HARNESS.** `MFARCH-det.mjs` is already the single-engine runner
   (16 leaves × 2 lenses → one digest, 10/10 across processes). Making it multi-engine is adding
   a driver table. ⚠ **State exactly what it proves:** today it proves Node-to-Node
   reproducibility across processes on one machine. It does **not** prove cross-browser or
   cross-machine agreement, and the purity scan's ban on trig/pow/random/locale/Date is an
   enforcement-by-scan, not a proof-by-execution.

**AND THE OPEN QUESTIONS I AM HANDING OVER WITH NUMBERS ATTACHED**

- §205A's subject set: **92** drawn bodies in the census's reach vs the institution solids it walks.
- Raw-handle exposure if streets/water become nodes: **19** and **58** reads (**3** and **10** truly
  on the fabric).
- The hand-minted fork keys: **12**, of which **5** drop the reroll salt.
- The divergence sites: **8**, with their early/late reader lines listed in `MFARCH-scc-report.txt`.

---

## §9 · JUDGMENTS (all vetoable; these AMEND B1…B8b's lists)

- **J-ARCH-1 · THE SCC IS REPORTED AT BINDING GRANULARITY AND THE SSA READING IS REJECTED AS
  VACUOUS.** Straight-line code is always a DAG in SSA, so that instrument would report 0 on any
  input. The binding graph asks the question with content. *Recorded because it is the whole
  shape of item 1.*
- **J-ARCH-2 · THE DIAGNOSTIC REPORTS AND DEMANDS A CUT EDGE; IT NEVER CHOOSES ONE.** MF-B8b's
  pilot note §11.4 is explicit that the choice is a domain judgment. The walker requires each
  declared cycle to carry a written cut and a bounded pass count.
- **J-ARCH-3 · THE THREE BLIND PREDICATES WERE CURED, NOT ONLY REPORTED.** The mandate said audit
  and re-measure. Leaving three known-blind predicates in place under the banner "predicate
  unification" would have been the thin pass the brief forbids. The cure moves **no pixel** and
  is fully pinned. *Say "veto" and I will revert the cures and keep the audit.*
- **J-ARCH-4 · STREETS AND WATER DID NOT BECOME NODES THIS WAVE.** ~20 and ~58 reads, deep in the
  lens, under a freeze, with no measured defect to cure. The exposure is measured and handed off.
- **J-ARCH-5 · THE TWELVE HAND-MINTED FORK KEYS ARE FROZEN, NOT CONVERTED.** Converting is a
  declared same-seed shift for a latent defect. **The ratchet is EXACT so the debt cannot grow.**
- **J-ARCH-6 · THE RAW HANDLE IS GUARDED AT THE PUBLICATION POINT RATHER THAN BY THE SCAN MF-B8b
  ASKED FOR.** I built the scan, measured that aliasing defeats it, and moved the guard to the
  one place that has no aliasing problem. *This is a deliberate departure from the pilot's
  prescription and is flagged as such.*
- **J-ARCH-7 · THE §205A SUBJECT SET WAS NOT WIDENED.** Widening a census's subject is a law
  change and the freeze is in force; MF-B7's §202 flood is the precedent.
- **J-ARCH-8 · THE §239 YEAR ARM IS REPORTED AS NON-DISCRIMINATING RATHER THAN AS A PASS.** It
  returned the answer I wanted and could not support it. The §240 epoch arm carries the finding.
- **J-ARCH-9 · ITEMS 5–7 ARE HANDED OFF WHOLE RATHER THAN STARTED THIN**, per the brief's own
  instruction, with designs and entry points in §8.

---

## §10 · HAZARDS FOR THE LANDING EXECUTOR (additions to B1 §11 … B8b §10)

- ⚠⚠ **ONE NEW SOURCE FILE IN TESTS, AND IT NEEDS A DEPENDENCY.**
  `tests/lint/derivationGraph.walker.test.js` parses source with **`acorn`**, present today only
  as a transitive dependency of vite. **THE EXECUTOR OWES AN EXPLICIT devDependency, and a
  dependency bump is a MINT TRIGGER (package.json / package-lock governed).** If acorn is absent
  the tests must FAIL, never skip.
- ⚠⚠ **THE TEST CENSUS: this wave adds ONE new test FILE and 18 TITLES.** The file census and the
  title census both red unless landed together. b8b's identical warning stands and compounds —
  b8b added a file too.
- ⚠⚠ **`fabric.walls` IS A GETTER WITH `configurable: false`.** Anything that does
  `Object.assign({}, fabric)` still works (it reads through), but anything that tried to
  **redefine or delete** `walls` will now throw. No consumer in the tree does; a UI or store layer
  outside `src/domain/townMap` was not audited. **Check before landing.**
- ⚠⚠ **`wallCircuit.js` NOW HOLDS MODULE-SCOPE MUTABLE STATE** — a `WeakSet` memoizing
  verification. It cannot reach a hash, a golden or a serialization, but it is the first such
  state in the fabric layer and a purity walker that bans module-level `let`/`new WeakSet` would
  red on it. Declared rather than hidden.
- ⚠⚠ **THREE PUBLISHED META FIELDS MOVE:** `waterCrossings` 125→141, `waterViolations` 100→114,
  `zoneMajorityOutside` 444→258. **These are CORRECTIONS, not regressions** — the old figures came
  from blind predicates. Any pin or golden keyed to them moves. ⭐ **NO GEOMETRY MOVES: all 16 SHAs
  and the determinism digest are byte-identical to MF-B8b's, so there is NO declared same-seed
  shift from this wave.**
- ⚠ **`leafCensus.js` NOW IMPORTS FROM `reservedGround.js`** (`segSegClosest`, `claimSegments`,
  `claimIndex`, `deepestPenetration`, `latticeAreaShare`, `bbox as polyBox`). The module import
  graph is still acyclic — pinned.
- ⚠ **EFFECTIVE-LINE COUNTS OF EVERY FILE THIS WAVE TOUCHED** (lane instrument, code not
  comments): `reservedGround.js` **192** (b8b: 137) · `leafCensus.js` **270** ·
  `wallCircuit.js` **253** (b8b: 244) · `fabricRng.js` **77** · `buildFabric.js` **793**
  (b8b: 794). All far under the 800 domain ceiling; the executor owes a sizeBaseline row for
  each alongside b8b's four new files.
- ⚠ **THE §203 LATTICE ARM IS THE MOST EXPENSIVE THING THIS WAVE ADDS** — an exact polygon clip
  per body per covered cell, over 20,857 bodies. It did not move any op ceiling or the suite
  duration measurably, but it is the first census that will want item 6's runtime budget.
- ⚠ **`DECLARED_CYCLES` IS KEYED BY TARGET SLOT AND SOURCE, NEVER BY LINE NUMBER** — deliberately,
  because a hand-keyed line address rots on the next edit. A lane that re-keys it by line
  re-creates that class.

---

## §11 · MEMORY-WORTHY FACTS FOR THE CHAIR

1. ⭐⭐⭐ **A DERIVATION CYCLE IS USUALLY A MISSING VERSION AXIS.** All eight of this pipeline's
   cycles are two versions of one artifact sharing one binding name. Splitting the artifact finer
   in SPACE does not dissolve them — **measured: 25 stages at binding granularity, 24 bindings at
   field granularity.** Giving them a version index does. The owner's epoch model is this domain's
   name for SSA.
2. ⭐⭐⭐ **THE READ-ONLY DERIVATION GRAPH IS ALREADY A DAG, AND EVERY CYCLE IS CREATED BY A
   WRITE-BACK** — so the write-back set is a complete feedback edge set. Proved by removing all 18
   and re-running Tarjan.
3. ⭐⭐⭐ **AN SSA-STYLE CYCLE CHECK OVER STRAIGHT-LINE CODE REPORTS 0 ON ANY INPUT.** A diagnostic
   that cannot fail is the blind-predicate class in a new hat.
4. ⭐⭐⭐ **A PREDICATE WHOSE NAME SAYS "AREA" AND WHOSE BODY COUNTS VERTICES IS THE §230 DEFECT
   WITH A DOCSTRING.** §203's containment arm survived two waves because its comment read as its
   proof. 444 → 251, with 229 bodies judged differently.
5. ⭐⭐⭐ **A SCAN OVER READ SITES MUST SOLVE ALIASING; A GUARD AT THE PUBLICATION POINT DOES NOT
   HAVE TO.** One publication, unboundedly many reads — put the guard on the one. Measured: only
   8 of 36 `.walls` hits were actually the fabric's.
6. ⭐⭐ **COMPARING TWO PREDICATES MEANS VARYING ONE THING.** A tolerance difference reads exactly
   like a blindness difference and can point the opposite way — my §17 arm reported "91 blind"
   that were 91 legal party walls.
7. ⭐⭐ **AN INVARIANCE TEST OVER AN INVARIANT SUBJECT DISCRIMINATES NOTHING.** The circuit was
   identical at every year — and so was the fabric, so the run supported both hypotheses equally.
8. ⭐⭐ **A PLANTED CONTROL MUST PLANT THE DEFECT'S OWN MECHANISM, NOT SOMETHING ADJACENT.** A
   stream only betrays you when the sequence it walks actually changes.
9. ⭐⭐ **A PIN ON A COMPOSER IS NOT A PIN ON ITS CALLERS.** `fabricForkKey` obeys the reroll-salt
   law and five mechanics never call it; the pin is green and the property does not hold.
10. ⭐⭐ **A GRAPH EXTRACTOR THAT ONLY READS ASSIGNMENTS IS BLIND TO EVERY MUTATION SPELLED AS A
    METHOD CALL** (`map.set`, `arr.push`) — and one such mutation hid a whole cycle.
11. ⭐ **AN EXACT RATCHET, NEVER A CEILING.** A `<=` inventory lets a cured site pay for a new one
    and the number never moves.
12. ⭐ **A COUNTERFACTUAL THAT DOES NOT EXHIBIT THE DEFECT IS NOT A COUNTERFACTUAL** — my §203
    plus-sign shape had 8 of 12 corners at home and the corner count acquitted it. Only running
    it said so.
