# Lane MF-D1 · **THE FOUNDATIONS** (ODQ §287.4/§287.5/§287.8, §293.3c, §293.7, §297.4b/c, §298.6a, §299.3, §301.8; SPEC §10.2/§10.4/§10.14/§10.15/§10.16(3)): receipt

**Lane MF-D1 (Opus 5), 2026-08-21.** Predecessor: `laneMFD0-receipt.md` (the sealed offset kernel).
⛔ **NO git write of any kind, NO repo gate, NO ODQ edit, NO memory write.** The ONLY repo file
edited is `map-corpus/docs/GENERATION-SPEC.md`, surgically, in ONE edit set, all markers ⟦FOLD §301⟧ (§9).
**Working tree:** `<scratchpad>/laneMFD1-tip` (copied from `laneMFD0-tip`; own hardlinked
`node_modules` from `rs4/`, per MF-D0 §11). **Diagnostic tree:** `laneMFD1-diag` (the stream audit;
differs from the tip by exactly ONE file, verified by `diff`). ⛔ `laneMFD0-tip`, `laneMFW2-tip` and
`mf-proto/build-out` were never written to.

---

## §0 · THE VERDICT, STATED FIRST

> ⭐⭐⭐ **ALL FIVE FOUNDATIONS ARE BUILT AND THE WAVE MOVED ZERO BYTES. 0 of 170 plate keys on 17
> leaves.** Suite **248 → 286**, `TRUE_EXIT=0`. Self-crossing **0/17**, ALL-RING **0/17** (D0's pin
> inherited whole). Four drawn censuses **0/0/0/0 AREA-TRUE** over 23,557 bodies. The foundations
> are read-side machinery **as a graph fact, not a promise**: the manifest gives them their own
> `FOUNDATIONS` node and the walker refuses the first outbound edge.

> ⭐⭐⭐ **§293.3c / §253.3b — THE STREAM-DERIVATION AUDIT IS DISCHARGED BY AN EXECUTED
> COUNTERFACTUAL, AND IT IS THE ORDER'S FIRST RECEIPT IN TWO SITTINGS.** Advance EVERY earlier
> stream forked in a DIFFERENT stage by one draw, at every fork — 2,125 streams and **1,337,825
> injected draws**: **0 of 34 plates move.** Advance same-stage streams too — 2,290,870 draws:
> **24 of 34 move.** So the instrument emphatically convicts, and the law holds — **no stage can
> be re-rolled by an upstream draw-count change.**

> ⛔⛔ **§297.4c IS A STOP-AND-RAISE AND I DID NOT EXECUTE IT AS WRITTEN.** Converting substrate's
> salt to `fabricForkKey` produces a different key at every variant — `demo::substrate|valley|bearing`
> against `demo::map-fabric:v3::substrate::y0#valley.bearing#0` — and those four draws place the
> VALLEY AXIS and the COASTAL RAMP EDGE that the whole heightfield is built on. **The ordered cure
> re-rolls the ground on every leaf.** I cured the actual defect — the DUPLICATED RULE — byte-neutrally
> instead, and RAISED the conversion (§9 RAISED-1).

> ⛔⛔ **§297.4b's FIGURES ARE STALE AND THE SWEEP AS ORDERED WOULD FIT THE CURE TO A MEASUREMENT
> NOBODY RE-RAN.** Ordered: water 58 / parcels 46 / streets 19. Re-measured with MF-ARCH's own
> predicate: **65 / 41 / 10**. Re-measured as TRUE fabric reads: **11 / 14 / 3**. I guarded water
> and parcels; I **declined streets with the number** — two of its three true reads are off
> `leafCensus.js`'s synthetic `accessFabric`, which no publication guard can reach.

> ⭐⭐ **§293.7 IS ANSWERED, AND THE ANSWER IS YES — FOUR PARTIAL RE-DERIVATION PATHS, THREE OF
> THEM DEFECTIVE TODAY.** 10 of 17 leaves publish a street connectivity grade about a DIFFERENT
> channel set than the one they publish. 22 of 22 squares carry a radius smaller than their own
> drawn polygon. 12 duplicate gate keys of 38. 68 published channels share a mutable line object
> with the published web. Report-only, per the order — with the law it demands, written (§8.4).

> ⭐⭐ **THE MANIFEST'S FIRST FINDING IS STRUCTURAL: THE MODULE GRAPH IS ACYCLIC AND THE STAGE
> GRAPH IS NOT.** One SCC spanning S2·S3·S4·S6·S13, closed by exactly two named module imports.
> Cut those two and it is a DAG. The public S0–S23 numbering is a narrative order, and that is now
> a measurement rather than a suspicion.

> ⭐⭐ **THE DCEL DUAL-RUN RAN ON ALL 17 LEAVES AND ITS DISAGREEMENTS ARE EXPLAINED, NOT WAVED.**
> Euler's `V − E + F = 1 + C` holds on **exactly** the 11 leaves whose arrangement noded to zero
> residual crossings and fails on exactly the 6 that did not — the identity is an independent
> oracle for the noder. 84.8% of legacy blocks locate into a bounded face, and the 15.2% gap has
> one named cause: S8 ("blocks as planar faces of the street graph") is NOT BUILT, so blocks are
> CUT by the packer rather than DERIVED as faces.

> ⛔ **AND THE CODEX CONTRACT CANNOT HOLD THE SANDBOX'S REAL SHAPES ON 8 OF 17 LEAVES.** Its
> kernel throws `DCEL face must have nonzero signed area` on any open chain; the corpus publishes
> **11 half-rings against 5 closed rings**, and a half-ring bankside circuit IS an open chain.
> Four divergences recorded precisely, because the §299.2 port question turns on them (§6).

---

## §1 · THE BASELINE, RE-MEASURED AT MY OWN TREE BEFORE ANY EDIT

⭐ ODQ Law L3: every figure below traces to a self-named captured log in the scratchpad.

| figure | measured at `laneMFD1-tip` before any edit | log |
|---|---|---|
| suite | **11 files / 248 tests passed**, `TRUE_EXIT=0` | `laneMFD1-baseline-suite.log` |
| self-crossing circuit segments | **0 over 17 leaves / 0 over 11 sites** | `laneMFD1-crossing-base.log` |
| ALL-RING self-crossing segments | **0 over 17 / 0 over 11** | `laneMFD1-rings-base.log` |
| four drawn censuses | **0 / 0 / 0 / 0 AREA-TRUE** over 23,557 bodies | `laneMFD1-drawn-base.log` |
| op ceiling | **ALL 102 RENDERS UNDER**; metropolis headroom 1,480 | `laneMFD1-ops-base.log` |
| containment residual | **0 of 17** | `laneMFD1-contain-base.log` |

**Every D0 figure reproduces exactly.** `src/` and `tests/` were verified `diff -rq` identical to
`laneMFD0-tip` at copy time, so the sealed D0 tip's own SHA file is a valid base and is re-derived
here as `laneMFD1-shas-BASE.json`.

---

## §2 · ⭐⭐⭐ DELIVERABLE 1 — THE EXECUTABLE S0–S23 STAGE MANIFEST (§287.8 / §10.14)

### §2.1 · THE SHAPE, AND WHY IT IS NOT A PROSE TABLE WITH A `.js` EXTENSION

`fabric/stageManifest.js` + `tests/lint/stageManifest.walker.test.js` (12 arms, all green).

⭐⭐⭐ **THE MANIFEST DECLARES EXACTLY ONE THING — WHICH STAGE A MODULE SERVES — AND THE WALKER
RE-DERIVES EVERYTHING ELSE FROM PARSED SOURCE AND REFUSES ANY DISAGREEMENT.** `allowedImports`,
`randomNamespaces`, `statefulForkSites`, the cross-node edge set, the backward-edge roster, the SCC
roster and the topological order are all DERIVED. The assignment is total over the real directory
listing, so it cannot silently rot: **a module added and not assigned REDS.**

⚠ **IT ALREADY FIRED ON ITS OWN AUTHOR.** The first full-suite run after I wrote `fabricDcel.js`,
`solidLegality.js` and `spatialReceipt.js` went RED on arm 1 with the three unassigned filenames
named in the diff. That is the drift refusal working, and it is reported rather than tidied away.

| what the walker refuses | arm |
|---|---|
| a fabric module assigned to zero nodes, or to two | 1 |
| a node's `allowedImports` ≠ its real cross-node import set | 2 |
| a node's `randomNamespaces` ≠ the key spellings its modules mint | 3 |
| a node's `statefulForkSites` ≠ its real `fabricRng(` count | 4 |
| `NODE_EDGES` ≠ the derived cross-node edge set | 5 |
| a THIRD public-order inversion, or an inversion without a written reason | 6 |
| an SCC the roster does not name; a raw graph that is secretly a DAG | 7 |
| a public stage silently owning no module and not on the UNBUILT roster | 8 |
| a stage draw not derived from the seed at stage entry (§293.3c, source half) | 9 |
| ⭐⭐⭐ **an OUTBOUND edge from `FOUNDATIONS`** | 10 |

Plus two counterfactual arms that plant a new module, a new import, a new namespace and a new
inversion and prove each CONVICTS, and one exact-count hazard row for the namespace collisions.

### §2.2 · ⛔⛔ THE FIRST FINDING: THE MODULE GRAPH IS ACYCLIC AND THE STAGE GRAPH IS NOT

```
laneMFD1-manifest-gen.txt / stageManifest.js
  53 modules · 23 nodes · 88 cross-node edges
  BACKWARD EDGES (a LATER public stage's module imported by an EARLIER one):  2
     S6>S2    relief.js          ← umbrella.js
     S13>S6   districtPartition.js ← wallCircuit.js
  STAGE-GRAPH SCC:  ONE component  { S2, S3, S4, S6, S13 }
  closed by exactly those two edges; cut them and the graph is a DAG
  topologicalNodeIds() over the raw edge set:  null   (it is not a DAG, and it says so)
```

§234.2's walker already proves the FILE-level import graph has zero cycles, and it does. Ask the
same graph the STAGE question and one five-node SCC appears. That is not a contradiction — a
collapse can only add cycles — it is what *"the public numbering is a narrative order"* looks like
when it is measured. Both closing edges have written reasons in the artifact.

### §2.3 · THE HOLES, PUBLISHED AS DATA

`UNBUILT_STAGES = ['S1', 'S8', 'S9', 'S12']` — four public stages own **no module at all**. S9 is
frontage, which §287.8 explicitly forbids D1 from proving, so its absence here is the ordered state
rather than an omission. Arm 8 refuses any OTHER silently empty stage.

### §2.4 · THE RANDOM NAMESPACE REGISTRY, AND EIGHT CROSS-STAGE COLLISIONS

The registry is over the KEY SPELLINGS each stage mints (`*` = an interpolated expression), because
that is the surface a collision appears on. Measured: **1 `keyedRandom` mechanic, 16 fork-key
spellings, 111 hash-key spellings**, and **8 spellings claimed by more than one stage**:

```
*|*  (S2,S6)   *|d (S10,S15)   *|g (S0,S10)   *|h (S10,S22)
*|s  (S10,S15) *|t (S10,S15)   *|tone (S15,S18)   *|w (S10,S15,S22)
```

⚠ **A COLLISION BITES ONLY IF TWO STAGES ALSO ASK ABOUT THE SAME ENTITY ID**, which is why this is
an exact-count hazard row rather than a refusal: freezing it at eight means a NINTH cannot arrive
quietly. **Not attempted, named so it is not re-found as a surprise (§8 RAISED-5).**

### §2.5 · ⭐⭐⭐ `FOUNDATIONS` — "MOVES ZERO BYTES" AS A GRAPH FACT

The five D1 artifacts get their own node. Measured edge set: `PRIMITIVES>FOUNDATIONS` and
`S0>FOUNDATIONS` inbound — and **zero outbound**. Arm 10 pins it and plants a foundation import
into `lettering.js` to prove the edge appears. A lane that wires a foundation into the generation
path reds before it can move a byte.

---

## §3 · ⭐⭐⭐ DELIVERABLE 1b — THE §293.3c STREAM-DERIVATION AUDIT, EXECUTED

**THE ORDER (ODQ §293.3c):** *"the per-stage stream-derivation audit ORDERED at §253.3b HAS NO
RECEIPT — RE-ORDERED, routed … as an acceptance criterion."* **THE PROPERTY:** each stage's draws
are derived from the seed at stage entry, so no stage can be re-rolled by upstream draw-count changes.

⭐⭐ **A SOURCE SCAN CANNOT ANSWER IT.** A scan shows every fork takes a key; it cannot show that no
stage keeps drawing from an earlier stage's handle. So `laneMFD1-diag` wraps `fabricRng` and, at
every NEW fork, ADVANCES EVERY EARLIER STREAM BY ONE DRAW.

```
laneMFD1-stream-cross.log — advance earlier streams in a DIFFERENT stage
  streams forked 2,125 across 10 modules (circuitDemotion, commons, organisms, parcels,
      routes, seating, streets, suitability, wallRuns, walls)
  DRAWS INJECTED  1,337,825
  PLATES 34   MOVED 0   IDENTICAL 34
  ⭐⭐⭐ NO STAGE CAN BE RE-ROLLED BY AN UPSTREAM DRAW-COUNT CHANGE.

laneMFD1-stream-all.log — advance EVERY earlier stream, same stage included
  DRAWS INJECTED  2,290,870
  PLATES 34   MOVED 24   IDENTICAL 10
  ⭐ NON-VACUITY HELD: the instrument demonstrably CONVICTS.
```

⭐⭐ **AND THE INJECTED-DRAW COUNT IS PART OF THE PROOF, NOT DECORATION.** "0 moved" is only
evidence if draws were actually injected; **1,337,825 cross-stage draws landed and not one plate
moved.** The instrument now refuses to report at all if the count is zero.

⚠ **BOTH ARMS WERE RE-RUN AT THE END OF THE LANE FROM A DIAG TREE REBUILT OFF THE FINAL TIP**, so
the isolation claim is true of the tree that shipped: `diff -rq` reports exactly one differing file,
`fabricRng.js`, and `tests/` identical. The figures are unchanged from the first run — see §15's
hazard for why re-deriving the arm was necessary rather than optional.

⚠⚠ **AND THE FIRST RUN OF THIS INSTRUMENT WAS VACUOUS, WHICH IS WHY IT CARRIES ITS OWN FIRING
CHECK.** The caller-detection parsed the stack and matched `fabricRng.js` itself on every frame, so
every fork looked same-stage and NOTHING was advanced — a clean 0-moved result from an instrument
that had not run. ⭐ **THE CLASS, WALKED INTO WHILE PROVING A LAW ABOUT IT: an instrument that
reports zero must first report that it fired.** `laneMFD1-stream.mjs` now exits 2 if zero streams
register.

**WHAT THE AUDIT ALSO ESTABLISHES:** only **17** call sites in the whole fabric fork a stateful
stream. Every other draw is `hashUnit`/`hash32`/`hashInt`/`keyedRandom` — a pure hash of a composed
key, with no stream at all. The manifest pins the 17 per node.

---

## §4 · ⭐⭐⭐ DELIVERABLE 2 — THE VERSIONED INTEGER COORDINATE ABI (§287.5 / §10.4)

`fabric/coordinateAbi.js`. `COORDINATE_ABI_VERSION = 1`, quantum `1/1000000`, full §10.4 record
(axes, azimuth, elevation, `canonicalRingOrientation: 'CCW_OUTER_CW_HOLE'`, `boundaryRule: 'CLOSED'`,
`hashEncoding: 'DOMAIN_SEPARATED_CANONICAL_BYTES'`).

### §4.1 · ⛔⛔ THE ONE DECISION: THE INTEGER IS READ OUT OF `q6`'s TEXT, NOT RE-ROUNDED

The brief says *"do not change rounding behavior, wrap it."* The obvious spelling —
`Math.round(v * 1e6)` — is wrong in two independent, executed ways:

```
laneMFD1-abi.log / townMapD1Foundations.test.js
  v = −1/128        q6 −0.007813    worldQ −7813        Math.round(v*1e6) −7812   ⛔ DIVERGES
  v = −3/128        q6 −0.023438    worldQ −23438       Math.round(v*1e6) −23437  ⛔ DIVERGES
  v = 1000.1234565  q6 1000.123456  worldQ 1000123456   Math.round(v*1e6) 1000123457 ⛔ DIVERGES
```

`toFixed` strips the sign FIRST and breaks a tie by the larger magnitude — round-half-AWAY-FROM-ZERO
— while `Math.round` breaks it toward `+∞`; and `v * 1e6` is one more rounded IEEE operation before
the rounding that was supposed to be canonical. The first two are exact ties on exactly
representable doubles; the third is not a tie at all and still diverges. **Reading the digits out
of `q6`'s own output makes the reconciliation an IDENTITY by construction.**

### §4.2 · THE RECONCILIATION AND THE BOUND, BOTH MEASURED OVER THE CORPUS

```
laneMFD1-abi.log — 17 leaves, the WHOLE published object walked
  numbers examined            4,423,599      coordinate pairs 693,448
  RECONCILIATION FAILURES             0      ⭐ an identity, not an approximation
  MAX |coordinate|              1,286.63     vs MAX_WORLD_UNITS 9,007,199,254
  SAFE-INTEGER BOUND               UNDER     headroom 7.001e+6×
  NEGATIVE-ZERO TOPOLOGY TEXT          0     LATENT — the corpus never publishes it
  non-finite numbers published         6     (q6 maps them to 'na'; worldQ to null)
```

⚠ **THE CENSUS IS OVER EVERY FINITE NUMBER REACHABLE FROM THE FABRIC**, not over a field list I
chose — a strict superset of the coordinate surface, because a census over a derived set proves
nothing about a surface it does not contain.

### §4.3 · ⛔ THE ONE PLACE THE LEGACY TEXT IS NOT CANONICAL

`q6(-1e-7)` is `"-0.000000"` and `q6(1e-7)` is `"0.000000"` — **two different byte strings for one
quantum.** The six-decimal topology key therefore has two spellings of zero and a receipt hashed
over it can move without any geometry moving. The ABI has one zero, because an integer has one.
**The corpus does not currently produce the case (0 of 4,423,599) — LATENT, not live**, and the
distinction is exported as `isNegativeZeroText` so a future census can tell them apart rather than
argue about it.

⚠ **THE Y-AXIS CAVEAT TRAVELS WITH THE RECORD.** The fabric draws in a y-DOWN view frame; §10.4's
world convention is +Y north. That is one sign flip on Y and **this lane applies none of it** —
applying it would move every published coordinate. `COORDINATE_ABI.viewToWorldYFlipApplied: false`
carries the debt where a reader cannot miss it, and the flip is a named migration owed by the wave
that first publishes a world-framed artifact.

⚠ `heightQ()` THROWS rather than guessing: no height artifact exists in the plan era, and an
unexercised path that returns a number reads as a working one.

---

## §5 · ⭐⭐⭐ DELIVERABLE 3 — EXACT SOLID LEGALITY (§287.5 / §299.3a)

The predicate lives in `fabricGeometry.js` — the ONE geometric-legality home §287.12 made for
`properCross` — and the typed contract in `fabric/solidLegality.js`.

**THE CORE:** `polygonIntersectionArea(A, B)` is exact for any two simple polygons: ear-clip both
into triangles (deterministic, first admissible ear, fixed scan order), clip each triangle pair by
the other's three half-planes through the fabric's own `clipHalfPlane`, sum the shoelaces. Only
`+ − × ÷` appear; no epsilon decides an answer. `triangulationIsSound` is the non-vacuity arm — a
partial triangulation may never be read as an area. ⭐ **MF-D0's kernel is what makes this legal:
`guardSimpleRing` is why every published ring HAS a triangulation. D0's cure is D1's precondition,
and the module says so.**

### §5.1 · THREE ANSWERS WERE ALREADY IN THE PROGRAMME AND NONE OF THEM WAS THE LAW

| | what it is | what it cannot see |
|---|---|---|
| **collision by identity** (the codex slice, §299.3a) | duplicate `buildingId`/`plotId` refused; one plot forced to carry one body | two DIFFERENT buildings on the same ground — the only thing the law is about |
| **XY/Z interval overlap** (§287.5 forbids it by name) | axis-aligned extents overlap | that an L-shaped range and a body in its notch share **zero** area |
| **`groundLaw.overlapping`** (the §17 incumbent) | shrink by `TOUCH_EPS`, vertex-in-other + proper crossing | HOW MUCH — it is a boolean, and §273.6(c) already measured what that costs |

⛔⛔ **THE INTERVAL PREDICATE IS CONVICTED BY EXECUTION, NOT BY ARGUMENT.** `intervalOverlapVerdict`
is implemented faithfully as the negative control; on the L-and-notch pair it says `OVERLAPPING`
and the exact predicate returns `sharedAreaQ: 0`.

⭐ **AND THE INCUMBENT IS NOT CONVICTED, WHICH IS THE HONEST RESULT.** On the same set
`legacyFalsePositive` is 0: §17's boolean is not WRONG, it is UNQUANTIFIED. Nothing about it is
changed and nothing in the generation path calls the new predicate.

### §5.2 · THE TYPED CONTRACT D3a EXTENDS

`solidOverlap` returns a discriminated result, never a boolean, because *"they do not overlap"*,
*"I cannot answer that yet"* and *"they are on different supports"* are three different facts:

- `REFUSED / SAME_SOLID_ID` — identity is not the legality question (§299.3a's defect, refused);
- `REFUSED / DIFFERENT_SUPPORT_SURFACE` — §10.5's *"one `zBase` cannot truthfully stand on a hill"*;
  a bridge over a lane needs a registered connection first;
- `PLANAR_ONLY` with the exact `sharedAreaQ` — the plan era's answer;
- `VOLUME` with `sharedVolumeQ` — the same call, once D3a supplies `[baseQ, topQ)`.

The vertical rule is declared NOW so D3a inherits it: half-open intervals on a NAMED support.
Pinned: two solids stacked `[0,5)` and `[5,9)` share 100 units of area and **zero** volume.

---

## §6 · ⭐⭐⭐ DELIVERABLE 5 — THE DCEL DUAL-RUN, AND THE §299.2 RECONCILIATION

`fabric/fabricDcel.js`: `buildBoundaryArrangement` (street ROW kerb pairs + wall faces + water
edges, quantized through the ABI, noded) → `derivePlanarDcel` (twins, the left-face `next` rule via
an exact-integer angular order, faces by cycle walk, holes, one outer face per component) →
`locateFace`.

⚠ **THE CROSS PRODUCTS ARE BigInt AND THEY HAVE TO BE.** ABI quanta reach ~1.3e9, so a cross
product of coordinate differences reaches ~1e19 and silently leaves the safe-integer range. A float
sign there would make the angular order at a vertex non-deterministic — the one thing the whole
embedding rests on.

### §6.1 · WHAT WAS ADOPTED FROM THE CODEX CONTRACT, CHARACTER FOR CHARACTER

Read read-only at `codex/first-map-vertical-slice@eedd4e9c` via `git show`. The reusable part is
`dcelEmbedding.js` (`embeddingKind: 'XZ_LEFT_FACE_V1'`) — a sound exact-integer planar embedder.
Everything above it (`boundaryArrangement.js`, `dcel.js`, `parcelRegistry.js`) is a single-fixture
jig with hard-coded counts (`V24/E32/H64/F10`, a pinned degree multiset, four edges per parcel
face) and is not reusable against sandbox output.

**ADOPTED:** the half-edge record `{halfEdgeId, boundaryRef, originVertexId, twinHalfEdgeId,
nextHalfEdgeId, previousHalfEdgeId, faceId}` with no `destinationVertexId`; the vertex record
carrying no coordinates; the left-face `next` rule; the orientation convention; adjacency by TWINS,
derived on demand and never stored.

### §6.2 · ⛔⛔ FOUR DIVERGENCES, EACH BECAUSE THE CONTRACT CANNOT HOLD A SHAPE THE FABRIC PUBLISHES

| # | the codex rule | why the sandbox breaks it | the divergence |
|---|---|---|---|
| 1 | `requireCanonicalInt`: `Number.isSafeInteger(v) && 0 ≤ v ≤ 1000` | the sandbox is float over a frame measuring **1,286.63** | quantize through the versioned ABI instead of refusing — the same instinct, versioned |
| 2 | face record is `{faceId, faceKind, boundaryHalfEdgeId}`, and the byte `"holes"` is a landed anti-ratchet | a demoted circuit nested inside a live one IS a hole | `faces[].innerBoundaryHalfEdgeIds`, plus a `HOLE_CYCLE` kind |
| 3 | ONE `outerFaceId`, chosen as the first negative cycle in hash order | correct only under its one-negative-cycle census; with a hole or a second component it can name the HOLE | `outerFaceIds` — one per component, each the most-negative cycle of its own |
| 4 | throws `DCEL face must have nonzero signed area` on any open chain | a half-ring bankside circuit IS an open chain | a zero-area cycle is typed `DEGENERATE` and reported, never thrown |

⭐ **PLUS ONE FACILITY THE CODEX DOES NOT HAVE AT ALL: POINT LOCATION.** Both its packets list it
as an explicit non-goal, so §287.8's third leg is minted here under the ABI's `boundaryRule: 'CLOSED'`.

⭐⭐ **AND DIVERGENCE 4 IS NOT HYPOTHETICAL — IT IS 8 OF 17 LEAVES, MEASURED:**

```
laneMFD1-dcel.log · ARM B2 — the WALL-ONLY arrangement
  5 CLOSED rings and 11 HALF-RINGS across the corpus
  the codex kernel would THROW on 8 of 17 leaves
     (town · city · highwater · siege · plague · famine · migration · year-100)
  metropolis — the only leaf with three CLOSED rings — gives 12 faces / 11 bounded /
     1 outer / 0 degenerate / ONE component: the three circuits intersect each other
```

### §6.3 · THE DUAL-RUN AGAINST THE EXISTING REGION MACHINERY, ALL 17 LEAVES

There is no legacy DCEL to diff against. The tree's existing machinery is `fabric.blocks` (the S8
face analogue) and `fabric.partition` (a 128×128 cell raster with `inside`/`owner` — the tree's
existing point location, and a raster, which is exactly why §10.15 wants a topology).

```
laneMFD1-dcel.log
ARM A · arrangement + faces  ·  town 11,603 noded boundaries → V 10,910 · HE 23,206 · F 1,269
                                metropolis 17,417 → V 15,067 · HE 34,834 · F 3,370 (2,860 bounded)
ARM B · FACE AGREEMENT       ·  3,318 of 3,914 legacy blocks land in a BOUNDED face  = 84.8%
                                metropolis 99.7% · town 91.5% · city 86.3% · fjord 51.6%
ARM C · POINT LOCATION       ·  15,607 of 17,408 sampled raster cells agree = 89.7%
ARM D · EULER V−E+F = 1+C    ·  holds on 11 of 17
ARM E · ORIENTATION          ·  ⭐ 0 violations of 21,021 faces
```

⭐⭐⭐ **ARM D IS THE SHARPEST RESULT AND IT IS AN ORACLE, NOT A FORMALITY.** Euler holds on
**exactly** the eleven leaves whose arrangement noded to `residualProperCrossings = 0`, and fails
on **exactly** the six that carry a residual of 2. A residual is an edge pair that still crosses,
so the graph is not planar and the identity must fail. **The identity is therefore an independent
detector for the noder's own residual** — and the six failures are one geometric configuration
(seed `mf-town-01`, riverside) counted six times, per §255.2d's exemplar-collision caveat.

⚠ **AND THE FACE COUNT IS NOT THE CYCLE COUNT.** Every component contributes one walk to the ONE
unbounded face, so `F = cycles − components + 1`. My first version of this arm counted cycles and
read NO on all seventeen — a correct embedding failing a wrong formula. Corrected, and the
correction is what exposed the residual correlation.

### §6.4 · WHY 15.2% OF BLOCKS DO NOT LAND IN A FACE — the disagreement, explained

SPEC §1.0 grades S8 — *"blocks as planar faces of the street graph"* — **PARTIAL, §239.1 NOT
BUILT.** Blocks are CUT by the packer, not DERIVED as faces, so a block is not required to be
enclosed by kerb lines, and 291 of town's 301 arrangement components are open kerb chains that
close nothing. **The gap is not noise and it is not the DCEL's defect; it is the measured size of
the S8 hole**, and it is exactly the number fresh W3 will move.

⚠ **ONE DEFECT OF MINE, CAUGHT BY THIS ARM AND FIXED:** `locateFace` originally searched only
`BOUNDED` faces and answered OUTER for every point inside a component whose boundary does not close
a positive ring — 0 of 29 village blocks. It now searches every non-degenerate cycle and prefers a
BOUNDED cycle at equal |area| (a closed ring produces two walks of identical magnitude; without the
tie-break, point location would depend on hash order).

---

## §7 · ⭐⭐ DELIVERABLE 4 — THE SPATIAL RECEIPT SEAM (§287.4 / §10.1–§10.2)

`fabric/spatialReceipt.js`. Three rules made UNREPRESENTABLE rather than forbidden:

1. **A RECEIPT IS DATED FOR LATER.** `effectiveAt` must be strictly greater than every source time,
   checked in the constructor. A receipt applicable in the pass that produced it cannot be built.
   *That single line is §287.4's whole content.*
2. **THE DEPENDENCY ROSTER IS CLOSED BY KIND AND TEMPORAL BRANCH, IN ORDER.** Wrong order, an extra
   role, a missing role or a kind with no such branch all throw. §10.2: *"Adding another causal
   constraint requires a new discriminated receipt branch rather than an extra role in a tuple."*
3. **A NO-EFFECT RESULT IS A DIAGNOSTIC, NOT AN EMPTY RECEIPT.** `sourceIds`/`affectedIds` are
   nonempty by construction; `noEffectDiagnostic` is the other door — so a census can tell "nothing
   happened" from "nobody looked".

⭐⭐ **THE DIGEST IS BUILT FROM A NAMED FIELD ROSTER, NOT FROM THE OBJECT**, which is what makes
§10.1's refusal structural rather than aspirational: *"No aggregate digest is accepted as proof of
a narrower invariant."* Pinned both ways — adding `immersion`/`lod`/`meta` leaves `spatialHash`
unmoved; adding one channel moves it.

**THE SOURCE SCAN (§287.4's second half), over the whole fabric layer, comments stripped:** no
module assigns into `settlement`/`world`/`worldState`/`dossier`/`economicState`/`resourceAnalysis`,
and no module calls `localStorage`/`sessionStorage`/`indexedDB`/`supabase`/`writeFileSync`/`fetch`.
**0 offenders**, with both forbidden shapes proved detectable when planted.

⚠ `ArtifactId`, `ProvenanceRef`, `LawVersion` and the closed id registries are `null` — named
ABSENT, not stubbed. The digest is declared a 128-bit **FINGERPRINT**, never cryptography and never
an authorization decision.

---

## §8 · THE ORDERED SWEEPS (DELIVERABLE 6), EACH RECEIPTED

### §8.1 · §297.4b — THE PUBLICATION GUARD: TWO SURFACES GUARDED, ONE DECLINED WITH THE NUMBER

⛔⛔ **THE ORDERED FIGURES ARE STALE. TWO CENSUSES, PUBLISHED SEPARATELY PER LAW L4:**

```
laneMFD1-rawscan.log
  surface     ORDERED   token ceiling NOW   TRUE fabric reads (excluding this lane's own module)
  water          58            65                    11
  parcels        46            41                    14
  streets        19            10                     3
  (walls, already guarded, for scale)  40             8
```

The ordered numbers are a per-line token count that convicts `P.water` (a palette),
`model.frame.water` and `closing.water` (a census result) alongside `fabric.water`. **Sweeping to
them would be fitting the cure to a measurement nobody re-ran** — the move §301.2 refused when it
declined to fit the offset kernel to §278's five-leaf forecast.

**BUILT:** `fabric/publication.js` — `governSurface(value, text, name)` stamps the canonical text
at publication, re-derives and compares on FIRST read, memoizes, and returns **the caller's own
object by identity**. `waterText`/`parcelsText` use `fabricGeometry`'s one topology quantum, never
a private spelling; the parcel fingerprint includes the back house, because a fingerprint blind to
a drawn family cannot see a change confined to it.

⭐ **THE WIRING SHAPE WAS CHOSEN TO BREAK NOTHING.** The guards are GETTERS IN THE RETURN LITERAL
at the keys' own positions, so (a) the published key ORDER is unmoved (`water` 10, `parcels` 37,
`walls` 44 of 45 — identical to before), and (b) §234's publication arm still reads
`publishCircuitRings({…}, wallCircuit)` literally, with `arguments[0]` still an `ObjectExpression`.
A wrapper call would have red both of D0's assertions.

⚠ **AND IT RETURNS THE IDENTICAL ARRAY DELIBERATELY.** Two landed counterfactuals in
`townMapFabricBuildOut.test.js` PUSH onto `f.parcels` to prove the overlap and in-street censuses
are non-vacuous. A guard returning a copy, a frozen array, or re-verifying on every read would
break both — and breaking a counterfactual is how a whole census goes vacuous with nothing reding.
Pinned.

⛔ **STREETS DECLINED, AND THE REASON IS A NUMBER.** Of `channels`' three true reads, **two are
`accessLaw.js:109,277` — and `accessLaw`'s `fabric` parameter is not the published fabric.** It is
`leafCensus.js:63`'s synthetic `const accessFabric = { channels, web: fabricWeb, walls };`, built
from PRE-PUBLICATION values. **No publication guard can reach them.** Guarding a ~1,000-element
array to cover the one remaining read is a worse trade than saying so.

### §8.2 · ⛔⛔ §297.4c — A STOP-AND-RAISE, AND THE BYTE-NEUTRAL CURE I LANDED INSTEAD

The order routes *"substrate.js's second salt spelling (4 sites)"* into this brief. The four sites
are consumers; **the second spelling is the ROOT**, `substrate.js:468`:
`` `${String(seeding.seed)}::substrate${variant ? `::variant:${variant}` : ''}` `` — invisible to
the `HAND_MINTED_FORK_KEYS` ratchet, which sees only the four `` `${seedKey}|…` `` consumers.

```
laneMFD1-salt.log — the two key strings, executed
  variant 0  LEGACY  demo-seed-7::substrate|valley|bearing                       → 0.17420448
             CANON   demo-seed-7::map-fabric:v3::substrate::y0#valley.bearing#0  → 0.80996296
  variant 3  LEGACY  demo-seed-7::substrate::variant:3|valley|bearing            → 0.87657969
             CANON   demo-seed-7::map-fabric:v3::variant:3::substrate::y0#…      → 0.48702802
  EQUAL? false at both variants, and no argument closes the gap: fabricForkKey interpolates
  the namespace unconditionally and always appends `::y${year}`; the legacy root has neither.
```

Those four draws place the **VALLEY AXIS** (`bearing`, `across`) and the **COASTAL RAMP EDGE**, and
the trough term pulls the whole heightfield to that axis. **The ordered conversion re-rolls the
ground on every leaf at every variant.** My proof floor is zero moved bytes; a corpus-wide same-seed
shift may not be smuggled into a foundations wave under it.

⭐⭐ **WHAT I CURED INSTEAD IS THE ACTUAL DEFECT.** §241.5b's complaint is a DUPLICATED RULE — a
salt spelled in two places, so a fix to one survives in the other. `fabricRng.js` now exports
`legacySubstrateForkKey`, emitting the **character-identical** string, and `substrate.js` asks for
it instead of composing one. The rule has ONE home; the byte is unchanged; the `MINT` ratchet still
reads exactly 4 so no ratchet edit is owed. Pinned three ways: the exact text at both variants, the
inequality against `fabricForkKey` under every argument combination, and a source scan proving the
substrate composes no salt of its own. **⚠ The pin exists precisely so a later lane cannot make the
conversion by accident and call the resulting corpus-wide re-roll a refactor.** (§9 RAISED-1.)

⚠ **AND THE RATCHET IS BLINDER THAN IT READS — CARRIED FORWARD, NOT CURED.** The `MINT` regex
requires a `|` immediately after the interpolation and a bare `seed`-ish identifier, so it misses
`` `${String(seeding.seed)}|fields|v${variant}` `` — the THIRD salt spelling the walker's own
docstring says was cured — which is alive in **`fields.js:196`, `immersion.js:165`,
`relief.js:448`, `stateMarks.js:355`**. The walker's claim is true of `buildFabric.js` only.
Not attempted; §9 RAISED-6.

### §8.3 · §298.6a — THE BLOCKED-ARM SWEEP (report-only)

```
laneMFD1-blocked.log — 17 leaves, executed
A · buildSubstrate publishes 22 fields (the module's own @typedef lists 13 — it is stale)

B1 ⛔ workableShare — published on 0 of 17 leaves, so buildFabric.js:770's fallback 0.6 fires on
      EVERY leaf. The real value exists and is computed (workableSlopeShare) and ranges
      0.292 … 0.769. Consequence: tenurePattern's (1 − workableShare) × 0.30 term is a CONSTANT
      0.12 on every leaf, so the workable-ground input to the nucleated/dispersed decision has
      never varied — and the `why` string prints "workable 0.60" on every leaf.
B2 ⛔ substrateKey — `sub.key` published on 0 of 17; the expression yields ONE distinct value
      across the corpus, "96x10.416666666666666", because both parts are module constants.
      It is a DECLARED INPUT of the wall-circuit content hash. ⭐ wallCircuit.js's own comment
      eleven lines below diagnoses this exact defect for a sibling field — "a declared input
      whose value was a constant … a declaration that never declared anything".
B3    terraform — the corpus reaches 3 of 14 work constraints (ore 11, relief 10, tillage 3) and
      3 of 9 drawn kinds (quarry, switchback, terrace). Eleven constraints and six kinds have
      never executed.
B4 ⛔ sub.route.roads / .grade — read at exactly ONE site, the else-arm of a ternary whose test
      ("routes.corridors.length") is true on 17 of 17 leaves. routeContract is derived,
      published and never consumed; its coherence pin is a pin on a composer, not on a caller.
B5 ⚠  the CRAG refusal fires on 4 of 17 leaves (polycentric 10.96%, mountain 27.66%,
      city 0.09%, migration 0.09%) — DISCLOSED by groundRefusal.js, not a defect, but every
      consumer of that clause has real coverage on two distinct sites only.
C     substrate.slopeAt and substrate.flowAt are exported with zero callers anywhere.
```

⚠ Per LAW L7 the corpus is a SAMPLE: "never reached here" is a claim about the corpus.

### §8.4 · ⭐⭐ §293.7 — THE STREET-WEB LIFECYCLE QUESTION, ANSWERED

**THE ANSWER IS YES: four partial re-derivation paths exist, three of them defective today.**

```
laneMFD1-lifecycle.log — 17 leaves, executed
ARM A ⛔ 10 of 17 leaves publish a street connectivity grade about a DIFFERENT channel set than
        the one they publish. buildFabric.js:486 runs `webConnectivity` over `channels.channels`;
        :584 then concatenates the circuit's wall lanes and the demotion's ring streets, and
        :1331 publishes THAT set. Measured (my predicate — published channels, published
        squares): town 19→18 · city 18→17 · metropolis 15→12 · polycentric 26→24 · year-100
        19→25. ⚠ L4: this is MY census, not the agent recon's — a different squares input
        gives different magnitudes; the CONVICTION is what reproduces.
ARM B ⛔ 22 of 22 published squares carry a radius SMALLER than their own drawn polygon's reach.
        `faceTheVoids` re-derives `polygon` and carries `center`/`radius` forward unchanged.
        Worst 3.337× (thorp square.heart, 19.78 → 66.01). leafCensus.js:508 reads that stale
        radius for the market-void figure.
ARM C ⛔ 12 duplicate gate keys of 38 across the corpus (city 3, metropolis 4, highwater 2,
        migration 3). `cutGates` mints `gate.${road.key}` once per ring with no epoch
        component; circuitDemotion.js already prefixes `E${epoch}` — the author knew.
ARM D ⚠  68 of 8,996 published channels carry a `line` object that IS a published web geometry
        object. Two versions, one mutable array. Safe today only because an in-place stitch is
        rank-guarded.
ARM E ⭐ published channel keys ARE unique: 0 duplicates of 8,996. That arm clears.
```

**THE LAW §293.7 DEMANDS, WRITTEN — for fresh W3/frontage to adopt:**

> **SW-1 · THE STREET-WEB VERSION LAW.** The street web and its channel set are versioned
> artifacts. A stage may publish a new version only by returning a new object; it may never assign
> into a version it did not create, and **no two versions may share a mutable sub-object**. Every
> version carries a manifest row declaring, per field, `RE-DERIVED` / `CARRIED` (with the stated
> reason it is independent of what changed) / `STALE-BY-DECLARATION`. Every registered dependent
> fact names the version it reads, and **any fact published as a GRADE must derive from the FINAL
> version.**

Machine-checkable acceptance criteria, all runnable today and **four of the five failing now**:
`SW-1a` no shared mutable geometry between versions (fails: 68 aliases); `SW-1b` a walker over
`buildFabric`'s call sites requiring each `channels:`/`web:` consumer to declare which VERSION it
is handed (this is the check that catches :486 and :508); `SW-1c` the census-denominator pin —
re-running `webConnectivity` over the published set must equal the published grade (fails: 10 of
17); `SW-1d` derived-key uniqueness across rings (fails: 12 gate keys); `SW-1e` field coherence
after a partial re-derivation — `max|polygon − center| ≤ radius(1+ε)` (fails: 22 of 22).

---

## §9 · ⭐⭐⭐ RAISED TO THE CHAIR — judgment-dense, decided by nobody in this lane

**RAISED-1 · ⛔⛔ §297.4c CANNOT BE EXECUTED AS ORDERED INSIDE A ZERO-SHIFT WAVE, AND THE TWO KEY
STRINGS ARE THE PROOF.** The conversion re-rolls the heightfield on every leaf at every variant
(§8.2). I landed the byte-neutral half — one home for the rule — and left the key alone. *The chair
decides whether the conversion becomes its own declared-shift micro-wave (the D0 pattern) or is
parked. It is a same-seed shift of the GROUND, which is the largest blast radius in the program,
and it should not ride inside a content wave.*

**RAISED-2 · ⛔⛔ §297.4b's ORDERED FIGURES ARE STALE BY 5×, AND I SWEPT TO THE MEASUREMENT RATHER
THAN TO THE ORDER.** 58/46/19 ordered; 65/41/10 by the same predicate today; **11/14/3** as true
fabric reads. I guarded water and parcels and DECLINED streets because two of its three true reads
are structurally unreachable by any publication guard. *If the chair wants the literal order
honoured, the order needs the correction, not the measurement — and streets would need a guard on
`leafCensus.js`'s synthetic `accessFabric`, which is a different mechanism.*

**RAISED-3 · ⛔⛔ §293.7's ANSWER IS "YES, AND THREE OF THEM ARE LIVE DEFECTS."** §8.4's ARMs A, B
and C are not hazards — they are wrong published figures: a connectivity grade about the wrong set
on 10 of 17 leaves, a stale radius on 22 of 22 squares, and 12 colliding gate keys. **The order was
report-only and I have not cured any of them.** *They are fresh-W3's first-item material, and the
connectivity grade in particular is currently a published number a reader would take as true.*

**RAISED-4 · ⭐⭐ THE §299.2 PORT QUESTION, WITH THE MEASUREMENT IT WAS WAITING FOR.** The codex
contract can express the sandbox's shapes only with four named extensions, and one of them —
open chains — is 8 of 17 leaves TODAY (§6.2). My reading, offered as a lane recommendation and not
a ruling: **adopt the codex's RECORD SHAPES and its embedder's algorithm; do not adopt its
arrangement compiler, its census or its parcel registry**, which are a single-fixture jig
(`V24/E32/H64/F10`, four edges per parcel face, one exterior face). *The chair rules whether the
port target keeps the codex's `0..1000` integer wall — which would require quantizing the sandbox's
frame into it — or adopts D1's versioned ABI instead. §299.2 said "where its contracts and the
sandbox's algorithms disagree, D1's manifest/ABI work rules"; this is that disagreement, itemised.*

**RAISED-5 · ⚠ EIGHT RANDOM-NAMESPACE SPELLINGS ARE CLAIMED BY MORE THAN ONE STAGE**, one of them
by three (§2.4). Frozen at eight so a ninth cannot arrive quietly; **not investigated** — a
collision bites only if the entity ids also collide, and measuring that is a wave's work.

**RAISED-6 · ⚠ THE `HAND_MINTED_FORK_KEYS` RATCHET SEES 5 OF THE FABRIC'S SEED-ROOTED KEYS.** The
`|v${variant}` THIRD spelling the walker's docstring calls cured is alive in `fields.js:196`,
`immersion.js:165`, `relief.js:448`, `stateMarks.js:355` — invisible because they spell the seed
`String(seeding.seed)`. *The ratchet's own claim is true of `buildFabric.js` only. Widening the
regex is a one-line change with an unmeasured conviction count and I did not make it.*

**RAISED-7 · ⚠ SIX LEAVES CARRY A NODING RESIDUAL OF 2 THAT MORE PASSES DO NOT CLEAR.** Raising
the cap 6 → 14 changed nothing: quantizing a split point can re-create a crossing, and this is a
fixed point, not a budget. It is one geometric configuration counted six times. *Cures are exact
rational intersection points, or snap-rounding to a coarser arrangement quantum. Neither is a
foundations-wave decision; both change what the arrangement IS.*

**RAISED-8 · ⚠ TWO BLOCKED ARMS ARE LIVE DEFECTS, NOT DEAD CODE (§8.3).** `workableShare` feeds a
constant into a siting decision on every leaf, and `substrateKey` is a hash column that cannot
move. Both are one-line cures and **both are behaviour changes** — the first moves tenure patterns,
the second re-mints every wall-circuit content hash. *Ordered into a wave that owns a shift.*

**RAISED-9 · ⭐ THE Y-AXIS FLIP IS AN UNPAID DEBT WITH A NAMED HOME.** §10.4's world frame is +Y
north; the fabric draws y-down. The ABI records `viewToWorldYFlipApplied: false` rather than
applying it, because applying it moves every published coordinate. *Owed by the wave that first
publishes a world-framed artifact.*

**RAISED-10 · §299.4's PACKET-VALIDATOR REFUSAL — DESIGN ONLY, AS THE BRIEF DIRECTS.** The order:
a packet that moves any census/ratchet must NAME its authorizing decision, and the validator must
refuse a census move without an authorization ref. **Proposed shape:** (a) a packet body gains an
optional `censusAuthorization: { odqSection, movedInstruments[] }` block; (b) the validator
computes the set of ratchet/census instrument files a packet's change paths touch — the same file
list the census walkers read — and if that set is nonempty and `censusAuthorization` is absent, it
refuses with the instrument names; (c) the `odqSection` must match `/^§\d+(\.\d+[a-z]?)*$/` and be
present in the ledger, so the authorization is resolvable rather than asserted; (d) a
`SUPERSEDED`/`LANDED` packet is exempt from re-validation so the 129 landed rows do not all red.
⚠ **The hazard to design around:** the validator reserves a change path at EVERY non-terminal
status, so adding a required field to the packet schema is itself a schema move — it needs its own
authorization row or it convicts the packet that introduces it. *Not built: repo build-branch
machinery, outside this lane.*

---

## §10 · THE PROOF FLOOR AT MY TIP

```
                                    SEALED D0 TIP            MF-D1 TIP
suite (lane config, bare)           11 files / 248 tests     13 files / 286 tests  TRUE_EXIT=0
                                    laneMFD1-baseline-suite.log  laneMFD1-suite-final.log
self-crossing circuit segments      0 / 17 · 0 / 11          0 / 17 · 0 / 11   (D0's pin inherited)
                                    laneMFD1-crossing-base.log   laneMFD1-crossing-tip.log
ALL-RING self-crossing segments     0 / 17 · 0 / 11          0 / 17 · 0 / 11
                                    laneMFD1-rings-base.log      laneMFD1-rings-tip.log
§17 / §17.4 / §205A / §200 drawn    0/0/0/0 AREA-TRUE        0/0/0/0 AREA-TRUE
                                    over 23,557 bodies       over 23,557 bodies
                                    laneMFD1-drawn-base.log      laneMFD1-drawn-tip.log
op ceiling (§217 per-tier ratchet)  ALL 102 UNDER            ALL 102 UNDER — none raised
                                    laneMFD1-ops-base.log        laneMFD1-ops-tip.log
containment residual                0 of 17                  0 of 17
                                    laneMFD1-contain-base.log    laneMFD1-contain-tip.log
⭐ cross-process determinism         10/10 83c25846…            10/10 83c25846… — the SAME digest
   (10 separate node processes)     laneMFD0-det-tip.log         laneMFD1-det-tip.log
⭐⭐⭐ BYTE IDENTITY                  —                        0 of 170 keys moved
                                                             laneMFD1-byteident.log
```

**THE SUITE ARITHMETIC, ATTRIBUTED SO THE DELTA IS NOT A MYSTERY: 248 + 38 = 286.**
+12 `tests/lint/stageManifest.walker.test.js` and +26 `tests/domain/townMapD1Foundations.test.js`,
both new files, both counted by a per-file JSON reporter run rather than by subtraction. **No existing test file was edited and no
ratchet constant was moved** — the `HAND_MINTED_FORK_KEYS` row still reads exactly 4 because the
§297.4c cure is byte- and spelling-neutral (§8.2).

---

## §11 · WHAT CHANGED, FILE BY FILE

| file | what |
|---|---|
| **`fabric/stageManifest.js`** ⭐ NEW | the executable S0–S23 manifest: 23 nodes, 53 modules, 88 edges, the 2 declared inversions, the 1 stage-graph SCC, the `FOUNDATIONS` node, the per-stage random-namespace registry |
| **`fabric/coordinateAbi.js`** ⭐ NEW | `COORDINATE_ABI_VERSION = 1`; `worldQ` wrapping `q6`'s text; the tie rule as data; the negative-zero exception; `canonicalBytes`; `heightQ` refusing |
| **`fabric/solidLegality.js`** ⭐ NEW | the typed solid contract; `solidOverlap`'s four discriminants; `intervalOverlapVerdict` as the negative control; `dualRunLegality` |
| **`fabric/spatialReceipt.js`** ⭐ NEW | `canonicalSpatial` over a named roster; `spatialEffectReceipt`'s three constructor refusals; `noEffectDiagnostic`; the fingerprint, declared as one |
| **`fabric/fabricDcel.js`** ⭐ NEW | the boundary arrangement (quantized, noded, residual reported) and the planar DCEL: twins, left-face `next` by exact BigInt angular order, faces, holes, per-component outer faces, adjacency, point location |
| **`fabric/publication.js`** ⭐ NEW | §297.4b's guard for water and parcels; `waterText`/`parcelsText` |
| `fabric/fabricGeometry.js` | ⭐ the exact planar legality core appended: `isConvexRing`, `triangulateSimple`, `triangulationIsSound`, `polygonIntersectionArea`, `pointLocateRing`. Nothing existing touched |
| `fabric/fabricRng.js` | ⭐ `legacySubstrateForkKey` — §297.4c's salt, lifted to one home, byte-identical |
| `fabric/substrate.js` | one line: composes no salt of its own; asks `fabricRng` for it |
| `fabric/buildFabric.js` | one import, one `const governed = …`, and `water`/`parcels` published as getters AT THEIR OWN KEY POSITIONS |
| **tests** | `lint/stageManifest.walker.test.js` **+12** (new); `domain/townMapD1Foundations.test.js` **+26** (new) |

⚠ **NEW MODULE EDGES:** `FOUNDATIONS` ← `PRIMITIVES`, `S0`. `ASSEMBLY` gains `publication.js`
(which imports `fabricGeometry` and `wallCircuit` — both edges the assembly already had, so the
cross-node edge set is unchanged in kind). **No cycle is created and the backward-edge roster is
still exactly 2.**

---

## §12 · THE SPEC TOUCH — ONE EDIT SET, ⟦FOLD §301⟧

`map-corpus/docs/GENERATION-SPEC.md`, five surgical edits, no deletions:

1. **§278's exit criteria** — `self-intersection census 11 → 0` corrected to **12 → 0** with ODQ
   §301.3's reason (the 11 was MF-W1b's tip over sixteen leaves) and the ALL-RING figure 38 → 0.
2. **§278's prediction block** — a ⟦FOLD §301⟧ note recording the chair's re-statement: right about
   the wall ring, wrong as the wave's bound; the true radius is the 11 circuit-publishing leaves,
   with arm Z's 34/34 as the ordinary-case proof.
3. **The wave table's D0 row** — stamped COLLECTED, figures corrected.
4. **The wave table's D1 row** — RE-SCOPED from "the volume law" to §287.8/§10.16(3)'s foundations,
   stamped **BUILT IN SANDBOX**, with this lane's exit criteria in the table's own format, and the
   note that the attachment vocabulary needs `MassPartQ`/`SolidPartQ` which D3a mints.
5. **§10.2, §10.4, §10.14 STATUS lines** — each stamped **BUILT IN THE SANDBOX (MF-D1)** with its
   own headline finding (the stage-graph SCC; the tie-rule divergence and the reconciliation over
   4,423,599 numbers; the named-roster digest and the source scan).

⚠ **NOTHING ELSE IN THE REPO WAS TOUCHED.** No ODQ edit, no plan doc, no memory file, no git
operation of any kind.

---

## §13 · WHAT I DID NOT DO — stated affirmatively

1. ⛔ **NO GIT WRITE, NO REPO GATE, NO REPO TEST RUN.** The only repo write is the §12 spec edit set.
2. ⛔ **I DID NOT EXECUTE §297.4c's CONVERSION** (RAISED-1). The byte-neutral half is landed; the
   key is untouched and pinned against accidental conversion.
3. ⛔ **I DID NOT GUARD `channels`** (RAISED-2), and the reason is measured, not assumed.
4. ⛔ **I DID NOT CURE ANY §293.7 FINDING** (RAISED-3). The order was report-only; three of them are
   live defects and they are named rather than fixed.
5. ⛔ **I DID NOT CURE THE BLOCKED ARMS** (RAISED-8). Both cures are behaviour changes.
6. ⛔ **I DID NOT BUILD §299.4's PACKET-VALIDATOR REFUSAL** — repo build-branch machinery, outside
   the brief; the design is RAISED-10.
7. ⛔ **I DID NOT PROVE FRONTAGE OR PARCEL EQUIVALENCE.** §287.8 forbids it to D1 and S9 owns no
   module; the manifest publishes that as `UNBUILT_STAGES`.
8. ⛔ **I DID NOT WIRE ANY FOUNDATION INTO THE GENERATION PATH.** The `FOUNDATIONS` node has zero
   outbound edges and arm 10 keeps it that way.
9. ⛔ **I DID NOT WIDEN THE `MINT` RATCHET** (RAISED-6) or investigate the namespace collisions
   (RAISED-5).
10. ⚠ **`laneMFD1-diag` IS INSTRUMENTED SCRATCH AND IS NOT THE TIP.** It differs by exactly one
    file, verified by `diff`.

---

## §14 · ARTIFACTS (scratchpad, `laneMFD1-*`)

| file | what it is |
|---|---|
| `laneMFD1-tip/` | ⭐ **THE TIP.** From `laneMFD0-tip`; own hardlinked `node_modules` from `rs4/` |
| `laneMFD1-diag/` | the §293.3c instrumented tree (one file differs) |
| `laneMFD1-abi.mjs` · `-abi.log` | ⭐⭐ §4's coordinate-ABI census over 4,423,599 published numbers |
| `laneMFD1-extract.mjs` · `-extract.log` | the raw source facts the manifest is derived from |
| `laneMFD1-gen-manifest.mjs` · `-manifest-gen.txt` | the manifest's derived node table + edge set |
| `laneMFD1-stream.mjs` · `-stream-{cross,all}.log` | ⭐⭐⭐ §3's stream-derivation audit, both arms |
| `laneMFD1-dcel.mjs` · `-dcel.log` | ⭐⭐ §6's five-arm DCEL dual-run over all 17 leaves |
| `laneMFD1-lifecycle.mjs` · `-lifecycle.log` | ⭐⭐ §8.4's street-web lifecycle census |
| `laneMFD1-blocked.mjs` · `-blocked.log` | §8.3's blocked-arm sweep |
| `laneMFD1-rawscan.mjs` · `-rawscan.log` | §8.1's raw-handle denominator, both predicates |
| `laneMFD1-salt.log` | §8.2's two key strings |
| `laneMFD1-shas-{BASE,TIP}.json` · `-byteident.log` | ⭐⭐⭐ the zero-byte attribution |
| `laneMFD1-{baseline-suite,suite-tip,suite-final}.log` | the suite, before and after |
| `laneMFD1-{crossing,rings,drawn,ops,contain,det}-{base,tip}.log` | the proof floor |

⚠ **EVERY INSTRUMENT TAKES AN EXPLICIT TREE.** `MFD1_TREE=` for mine, `MFW2_TIP=`/`MFD0_TREE=` for
the inherited ones. All default to a tree that is NOT this lane's — set them.

---

## §15 · HAZARDS FOR THE NEXT LANE

- ⛔⛔ **A DIAGNOSTIC TREE COPIED EARLY IS NOT THE TIP, AND THE RECEIPT WILL SAY IT IS.** I copied
  `laneMFD1-diag` from the tip before four modules and three edits existed, then wrote *"differs
  from the tip by exactly ONE file"* in this receipt. `diff -rq` at the final containment check
  said **eight**. The measurement was still sound — every intervening edit is byte-neutral and
  proved so — but the CLAIM was false, and a reader would have taken the counterfactual as
  isolating one variable when it isolated eight. **Rebuilt from the final tip and BOTH arms
  re-run**; the tree now differs by exactly `fabricRng.js`. ⭐ THE CLASS: **a counterfactual arm's
  isolation claim decays every time the tip moves, and nothing re-checks it — re-derive the arm
  from the FINAL tip, or state the drift.**
- ⛔⛔ **AN INSTRUMENT THAT REPORTS ZERO MUST FIRST REPORT THAT IT FIRED.** The stream audit's
  first run returned a clean 0-of-34 from an instrument whose caller-detection had collapsed every
  fork to one module, so NOTHING was advanced. It now exits 2 on zero registrations. This is the
  standing trust-no-uncaptured-exit law one level in: **a zero from an instrument that did not run
  is not a clean result.**
- ⛔⛔ **THE EULER FACE COUNT IS NOT THE CYCLE COUNT.** `F = cycles − components + 1`, because every
  component contributes one walk to the ONE unbounded face. Counting cycles made a correct
  embedding read NO on all seventeen leaves. Getting it right is what exposed the residual
  correlation, so the wrong formula would have hidden the finding as well as inventing a failure.
- ⚠⚠ **A POINT-LOCATION SEARCH RESTRICTED TO POSITIVE CYCLES ANSWERS "OUTSIDE" FOR EVERY POINT IN
  A COMPONENT WHOSE BOUNDARY DOES NOT CLOSE A POSITIVE RING.** It read 0 of 29 village blocks.
  Search every non-degenerate cycle, and **prefer BOUNDED at equal |area|** — a closed ring produces
  two walks of identical magnitude, and without the tie-break point location depends on hash order.
- ⚠⚠ **`Math.round(v * 1e6)` IS NOT THE SIX-DECIMAL QUANTUM.** It diverges on negative ties
  (`toFixed` rounds half AWAY FROM ZERO; `Math.round` toward `+∞`) and on values where the multiply
  itself rounds. Read the integer out of `q6`'s text.
- ⚠⚠ **A DCEL OVER ABI QUANTA NEEDS BigInt.** Quanta reach 1.3e9, cross products 1e19 — past
  `Number.MAX_SAFE_INTEGER`. A float sign makes the angular order non-deterministic.
- ⚠⚠ **§297.4c's CONVERSION MOVES EVERY LEAF.** `legacySubstrateForkKey` is pinned against being
  "tidied" into `fabricForkKey`. Read its docstring before touching it.
- ⚠ **THE PUBLICATION GUARD MUST RETURN THE CALLER'S OWN OBJECT AND MEMOIZE.** Two landed
  counterfactuals PUSH onto `f.parcels`; a copy, a freeze, or a re-verify-every-read breaks both,
  and a broken counterfactual is a silently vacuous census.
- ⚠ **THE GUARD IS WIRED AS GETTERS IN THE RETURN LITERAL, NOT AS A WRAPPER CALL.** A wrapper reds
  §234's publication arm twice (`callee.name` and `arguments[0].type`). The getters also keep the
  published key ORDER unmoved.
- ⚠ **THE MANIFEST WALKER WILL RED ON YOUR NEW MODULE, AND THAT IS THE POINT.** Assign it — and if
  it is read-side machinery nothing imports, assign it to `FOUNDATIONS`, which arm 10 keeps
  outbound-edge-free.
- ⚠ **THE `HAND_MINTED_FORK_KEYS` RATCHET SEES 5 OF THE FABRIC'S SEED-ROOTED KEYS**, not all of
  them; four modules carry the `|v${variant}` spelling it cannot see (RAISED-6).
- ⚠ **SIX LEAVES ARE ONE SITE.** town / siege / plague / famine / year-018 / year-100 all build
  from seed `mf-town-01` riverside, so any figure that counts them separately counts one geometric
  configuration six times (§255.2d's caveat, live in ARMs A and D).
