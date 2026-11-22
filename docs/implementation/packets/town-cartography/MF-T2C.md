# Town cartography / MF-T2C — the embedder extended onto the ABI (BigInt, components, degeneracy, point location)

- **Status:** LANDED
- **Packet version:** 1
- **Verified base:** `claude/composite-r4` at `fb80e32f03564e6edcbad4bf37de27694c2fe986`
- **Base posture:** the whole §4 preflight was re-executed at that base; every figure below is a
  measurement there and none is inherited from the compile tip `b25907f9`. ⭐ The five fabric files
  this member reads or writes are byte-identical across that window (`git diff --stat b25907f9
  fb80e32f -- …` is empty, executed), so the base did not move under the member.
- **Depends on:** `MF-T2A` (the single-declaration law — LANDED, terminal at `37fb6916`) and
  `MF-T2B` (the ABI + exact-geometry core — LANDED at `cdfe5a96`). Both bind this member; neither
  is re-dispatched.
- **Family preamble:** `docs/implementation/preambles/MF-PREAMBLE.md`, SHA-256
  `0706aad6a84e4f74ec47602e9e3222fc398c4c8864bb38c79ac480c2a11db4ed` — **recomputed from the file
  at THIS base** (`git show fb80e32f:… | shasum -a 256`), not copied from any packet. It matches
  the post-§324.5 stamp, so the family law did not move between compile and dispatch. Its §P1
  refutations, §P2 hazard dispositions, §P3 anchor preflight, §P4 registration template, §P5
  census law, §P6 mutant hygiene, §P7 STOP set and §P8 capsule law bind this packet and are not
  restated here.
- **Collision group:** `d3a-port` — this member reserves ONE shared D3a change path,
  `tests/lint/sovereigntyLightingContract.walker.test.js`. ⭐ It deliberately reserves NO path on
  `src/domain/townMap/fabric/index.js` (no barrel edit — §7). Staged promotion, never simultaneous
  with another non-terminal D3a member on the census path (`CR-HB2B-SPLITP`; preamble §P7.11).
- **Commit authority:** the executing lane commits on its own detached ref; the chair moves the branch.
- **Baseline posture:** measured at `fb80e32f`, inherited from nothing —
  `src/domain/townMap/fabric/dcelEmbedding.js` **169** effective lines and
  `src/domain/townMap/fabric/dcel.js` **89**, under `max-lines {skipBlankLines, skipComments}`
  measured with eslint's own `Linter`, against the plain `src/domain/**` ceiling of **800**; no
  `townMap` path carries a `scripts/.size-baseline.json` entry and none is on the hot-file list;
  neither `scripts/.domain-strict-baseline.json` nor `scripts/.full-typecheck-baseline.json`
  carries any `townMap` key, so both touched files sit at **zero** allowed type debt and the
  member's cure is typing rather than widening; typecheck floors `typecheck:ratchet` **173/173**
  and `typecheck:domain:strict` **1134/1134**; test census
  **2488 / 364 / 2124 / 20655 / 5776**; `BASE_STATE.json` is stamped `b8946403` and is **NOT
  citable at this base** by its own `consumptionLaw` (preamble §P8).

> **`censusAuthorization`:** this packet moves the test census by two credited files, eight titles
> and two suite titles. Its authorizing decisions are **ODQ §312** (the D3a port dispatch that
> commissions this member) and **ODQ §328** (this seat's own dispatch, which ruled the compiled
> draft's RAISED items), under the wave charter at **§310.4** and §299.4's binding-forward rule
> that *"a packet that moves any census/ratchet NAMES ITS AUTHORIZING DECISION in the packet
> body."* The family's stamp is **GRANTED** at ODQ §312.2b, so `town-cartography` sits in the
> eight-member engine-train column.

> ⛔ **PORT SOURCE PROVENANCE (preamble §P1 R-MF-4).** The sandbox is not a git repository, so
> there is no commit to cite. This packet names its source by path **and SHA-256**, re-hashed by
> the implementing lane before any edit; **a mismatch is a STOP, not a merge.** Re-hashed at this
> base and MATCHED.
>
> | source (sealed W3 tip, `…/laneMFW3F-tip/src/domain/townMap/fabric/`) | SHA-256 |
> |---|---|
> | `fabricDcel.js` — the extended-contract reference: BigInt orientation, per-component outer faces, `DEGENERATE` typing, the face-kind vocabulary, the locate rules | `01da024a8655ce9e468a75a53ffc49a4e28508d2d7a9400cbe2dbf1b6d81197b` |
>
> The exact-geometry closure (`pointLocateRing`, `bounds`) is consumed from THIS TREE's
> `exactGeometry.js`, landed by MF-T2B — no second port of `fabricGeometry.js` occurs here. The
> traversal repair's source is the D3a compile receipt (`laneTCD3A-receipt.md` §1.2), an
> algorithmic patch proven output-identical at four sizes — not a sandbox module.

---

## 1. Reconciled authority

1. **ODQ §303.5** — the port boundary law: *adopt the codex slice's record shapes and its
   embedder's algorithm; do not adopt its arrangement compiler, census, or parcel registry; on
   the integer wall D1's versioned ABI wins.* This member extends the ADOPTED algorithm in place;
   the four sandbox divergences it carries are exactly the places §303.5 records that the codex
   contract cannot express the fabric's real shapes.
2. **Preamble §P1 R-MF-2** — every module deciding topology, ordering or identity from a product
   of ABI quanta uses BigInt, with the reason in the file. ⭐⭐ **RE-EXECUTED AT THIS BASE,
   END-TO-END:** on the triangle `a=[0,0] b=[m−1,m] c=[m,m+1]`, `m=1286630001`, the landed kernel
   throws `'DCEL vertex has an angular tie'` on valid ground — `Number` cross `0`, `BigInt` cross
   `−1n`, while the same shape at fixture-era scale gives `−1` in both spellings. MF-T2B's widened
   wall admits these coordinates today; this member is what makes the arithmetic survive what the
   wall now admits. The false throw wears the message of a condition that did not occur.
3. **Preamble §P1 R-MF-1** — a port member prices complexity against real leaf sizes. The dominant
   term was `[...unvisited].sort(…)[0]` inside the face-traversal loop; the pre-sorted cursor
   repair rides here, measured at this base as 646.07 ms → 174.91 ms on a 1,860-boundary grid.
4. **ODQ §287.8 / SPEC §10.15** — D1 proves face/adjacency/point-location; both codex packets name
   point location an explicit non-goal, so §287.8's third leg is MINTED at this member, under the
   landed `COORDINATE_ABI.boundaryRule: 'CLOSED'`.
5. **ODQ §287.16 / §290.1/§290.4** — dormant explicit input; live seeds byte-identical; the
   existence of a conceivable edge case is not authority to enlarge the tranche.
6. **ODQ §328** — the chair's dispatch, which ruled every RAISED item of the compiled draft:
   `HOLE_CYCLE`/`ENCLOSED_BY_EXTERIOR` port faithfully as defensive vocabulary with the executed
   zero-occurrence finding in the docblock and NO reachability pin; `innerBoundaryHalfEdgeIds`
   ships declared-and-empty; the census delta is derived rather than planned;
   `BOUNDARY_EPS_Q = 0.5` is ABI-STRUCTURAL and stays INTERNAL; the scale assertion is a
   correctness pin and wall clock is receipt evidence only.
7. **Live code decides.** Every fixture below was run against the UNEDITED kernel and printed
   before any pin was written (preamble §P2.9), then re-run against the edited one.

**Resolved contradictions:**

- *The sealed PLANAR_DCEL face record is pinned by exact keys* (`['boundaryHalfEdgeId','faceId',
  'faceKind']`) and the sealed dcel's key list pins singular `outerFaceId` — vs *the port brings
  the extended face shape in.* **RESOLUTION: the extended contract lives on the IN-MEMORY
  embedding; `dcel.js` seals a legacy projection, and the sealed artifact does not move by one
  byte.** The v1 artifact-schema shift is a later declared-shift wave, named as a carry, not
  taken. Executed basis: `sealCanonicalArtifact` digests the whole record, so ONE added key would
  move every PLANAR_DCEL digest; and no test imports the kernel directly — `dcel.js` is its only
  consumer in the entire tree. **Proved by mutant M7**, which removes the projection and reds the
  exact-key pin.
- *The sandbox spells the outer kind `OUTER_CYCLE`* — vs *the live artifact and its pins spell it
  `EXTERIOR`.* **RESOLUTION: the app keeps `EXTERIOR`** and adopts `HOLE_CYCLE`/`DEGENERATE`
  unchanged; the locate verdict `ENCLOSED_BY_OUTER_CYCLE` is spelled `ENCLOSED_BY_EXTERIOR`.
  Renaming the live kind moves sealed bytes; renaming the port's new tokens costs nothing now and
  never again. **JUDGMENT, vetoable.**
- *The sandbox locate takes map units and converts via `worldQ`* — vs *the kernel's published
  coordinate space is ABI integer quanta.* **RESOLUTION: `locateFace(embedding, [xQ, zQ])` takes
  quanta — the ABI wins; unit conversion stays the caller's.** **JUDGMENT, vetoable.**
- *The codex `compareRay` THROWS on an angular tie; the sandbox breaks collinear ties
  canonically.* **RESOLUTION: the throw is PRESERVED, converted to exact arithmetic.** It is the
  detector for the one overlap shape the pairwise atomic check structurally passes (two collinear
  segments sharing one endpoint); BigInt confines it to TRUE ties. Executed at this base: the
  collinear pair still throws after the edit. **JUDGMENT, vetoable.**
- *Plan §3.2(a) reads MF-T2C's A5 as the run that settles the extrapolated wall clock* — vs the
  estate's flake law. **RESOLUTION: no credited test asserts wall clock.** A8 pins
  correctness-at-scale (the Euler identity on a synthetic ~1.8k-boundary grid); the completion
  receipt records the measured time as evidence. Named divergence from the plan's letter, ratified
  at ODQ §328.

The implementer does not read other documents to reinterpret this packet.

## 2. Outcome

**Observable result:** the app-side planar embedder survives the coordinate range the landed ABI
already admits and expresses the shapes the fabric actually publishes — exact BigInt orientation
(no false angular tie at ABI scale), one outer face per connected component (`outerFaceIds`),
zero-area cycles typed `DEGENERATE` instead of thrown, the hole-capable face-record shape
(`innerBoundaryHalfEdgeIds`, declared), and point location under `boundaryRule: 'CLOSED'` — while
the sealed PLANAR_DCEL artifact, its digests, and every live byte stay exactly where they are.

**Definition of done:** `derivePlanarDcelEmbedding` computes `orient`/`compareRay`/`area2` in
BigInt; the face traversal uses the pre-sorted cursor; the embedding returns the extended contract
of §6; `locateFace` and `PLANAR_EMBEDDING_FACE_KINDS` are exported;
`compileOrthogonalCrossPlanarDcel` seals the legacy projection with its census made BigInt-safe;
and the digest-pin suites pass with not one literal edited.

**In scope:**

1. **One primary behavior** — the extended exact planar embedding (BigInt + divergences 2/3/4 are
   ONE behavior: without exact arithmetic the extended kernel throws falsely on real ground, so
   they ship together or not at all).
2. **One necessary integration path** — the `dcel.js` seal path: the BigInt-safe census and the
   legacy projection, which is what keeps the only existing consumer byte-identical.
3. **One prevention guard** — the untouched-pin control (§10): every digest-pin suite green,
   unmodified, after the edit; plus A1's inertness pin proving the new fields are inert on the
   admitted input.

**Explicit non-goals, named affirmatively:**

- ⛔ **No sealed-artifact change.** `PLANAR_DCEL_SCHEMA_VERSION`, `PLANAR_DCEL_LAW_VERSION`,
  `embeddingKind: 'XZ_LEFT_FACE_V1'`, the sealed key lists and every digest stay frozen. The
  extended-shape seal is a named carry for a later declared-shift wave.
- ⛔ **No consumer is wired.** No module outside `dcel.js` gains an import of the kernel; the
  barrel is untouched; nothing reaches the entry closure.
- ⛔ **No containment filling.** `innerBoundaryHalfEdgeIds` ports as the sandbox publishes it —
  declared and empty everywhere. Containment is answered by `locateFace`'s smallest-containing-
  cycle rule; face-containment machinery exists in neither source and §290.4 forbids the
  enlargement here (ruled at §328).
- ⛔ **No noder, no arrangement change** — that is MF-T2D. This member's kernel still requires the
  atomically-noded input the codex contract states.
- ⛔ **No arrangement-quantum rung, no tuning constant.** `BOUNDARY_EPS_Q = 0.5` is the ABI's
  half-quantum rounding radius, a structural constant of `boundaryRule: 'CLOSED'` ported verbatim
  from the reference's locate call — ruled ABI-STRUCTURAL and INTERNAL at ODQ §328, and it is
  declared unexported so no caller can make the boundary rule a per-caller opinion.
- ⛔ **No reachability claim for `HOLE_CYCLE` or `ENCLOSED_BY_EXTERIOR`**: both port as defensive
  vocabulary with the executed zero-occurrence finding in the module docblock; no pin asserts they
  fire (ruled at §328).
- ⛔ **No y-flip, no height, no `FABRIC_COORDINATE_ABI` motion, no dependency bump.**
- Record adjacent discoveries in the receipt; do not investigate or repair them.

## 3. Hard scope budget

| Limit | Packet budget | Measured at implementation | Standard |
|---|---:|---:|---:|
| Behavior families | `1` | 1 | 1 |
| New persisted record families | `0` — the extended embedding is in-memory | 0 | ≤1 |
| Named state writers | `0` | 0 | ≤1 |
| Feature flags | `0` | 0 | ≤1 |
| User-facing surfaces | `0` | 0 | ≤1 |
| Direct consumers | `0` new (the existing `dcel.js` edge is preserved, not added) | 0 | ≤2 |
| New logic-bearing production leaves | `0` | 0 | ≤2 |
| Existing logic-bearing production files modified | `2` | 2 | ≤3 |
| Additional registration-only files | `0` — deliberately no barrel edit | 0 | ≤3 |
| Handwritten files total | `6` (2 src · 2 acceptance · 1 census re-record · this packet) | 6 | ≤12 |
| New/changed effective production lines | **≤ `220`** | **141** (118 added, 23 removed; eslint `Linter`) | ≤400 |
| Effective lines per new leaf | `n/a` — no new leaf; `dcelEmbedding.js` 169 → **267**, far under 800 | — | ≤250 |
| Delta in a shared/hot file | `0` — re-derived at base: no manifest path has joined the hot-file list | 0 | ≤15 |
| Acceptance cases | `8` | 8 | ≤8 |

Overrides approved before dispatch: `NONE`.

## 4. Sealed dispatch and preflight — EXECUTED at `fb80e32f`

```sh
npm run implementation:dispatch -- MF-T2C
```

Every row below was re-executed at this base; none is inherited.

| # | Check | Result |
|---|---|---|
| 0 | `shasum -a 256 docs/implementation/preambles/MF-PREAMBLE.md` | `0706aad6…1db4ed` — MATCH |
| 1 | `shasum -a 256 <sealed-tip>/…/fabricDcel.js` | `01da024a…1197b` — MATCH |
| 2a | effective lines, eslint `Linter` | `dcelEmbedding.js` **169** · `dcel.js` **89** |
| 2b | `grep -n '^export function derivePlanarDcelEmbedding(input) {'` | present, line 65, column 0 |
| 2c | `grep -c 'CURRENT_MAP_TRADITION_ID'` in the host | **0** |
| 3a | `npx vitest run tests/lint/townMapFabricSingleDeclaration.walker.test.js` | TRUE_EXIT=0 |
| 3b | `git grep 'locateFace\|PLANAR_EMBEDDING_FACE_KINDS\|outerFaceIds\|holeCycles\|degenerateFaces\|innerBoundaryHalfEdgeIds\|BOUNDARY_EPS_Q' -- src tests` | **no hits** — no arriving name collides |
| 4 | the twelve digest-pin suites, captured BEFORE the first edit | **12 files / 74 tests passed**, TRUE_EXIT=0, per-file counts recorded in the lane receipt |
| 5 | the census tuple at this base | **2488 / 364 / 2124 / 20655 / 5776** |
| 6a | `npm run typecheck:ratchet` | `no type regressions (173 error(s), ceiling 173)`, TRUE_EXIT=0 |
| 6b | `npm run typecheck:domain:strict` | `no strict-type regressions (1134 errors, ceiling 1134)`, TRUE_EXIT=0 |
| 7 | §P2.9 — every acceptance fixture against the UNEDITED kernel | see §9's capture column; the ABI triangle and the open chain both THREW with the exact messages A2/A3 name, and the two-component and nested fixtures each embedded with TWO faces typed `EXTERIOR` under ONE singular field |

⚠ **One compile figure was corrected here, and the correction is recorded rather than absorbed.**
The compile receipt noted that on the nested fixture the discovery order happened to pick the true
outer. Executed at this base it does NOT: the singular `outerFaceId` names the INNER ring's
negative walk. The base is byte-identical to the compile tip, so no behavior moved — the compile's
probe zipped `faces` (faceId-sorted) against `metrics.area2s` (discovery-ordered) and read another
cycle's area. The structural capture this packet actually pins is identical in both runs, and A1
now asserts the `faceIndex`/`faces` alignment so the same mistake cannot be made inside the kernel.

## 5. Verified tree contract

| Role | File | Symbol | Verified fact | Required use |
|---|---|---|---|---|
| The kernel being extended | `src/domain/townMap/fabric/dcelEmbedding.js` | `export function derivePlanarDcelEmbedding` | 169 effective; sole consumer `dcel.js`; `orient`/`compareRay`/shoelace in `Number`; face traversal sorts inside the loop | extend IN PLACE; the exported signature line survives byte-identical (sweep anchor) |
| ⛔ The sweep-plant anchor | `scripts/mutation-sweep.sh` | entry **28a** and its `check_caught "town-map/fabric duplicate export declaration"` | the plant applies to the CURRENT file text | ⛔ the edit preserves the anchor line at column zero AND keeps `CURRENT_MAP_TRADITION_ID` un-imported and un-declared in the host |
| The seal path | `src/domain/townMap/fabric/dcel.js` | `compileOrthogonalCrossPlanarDcel`, `validateCensus` | 89 effective; seals `faces: embedding.faces` and `outerFaceId` directly; census compares `metrics.area2s` in `Number` | project the legacy face triple at the seal; make the census BigInt-safe; extend its invariants |
| The frozen artifact shape | `tests/domain/townMapPlanarDcel.test.js` | the exact-key pins and the digest/vertex/area2 rosters | the largest holder of the family's literal digest pins | ⛔ must stay green UNTOUCHED — a moved pin is a STOP, never a re-record |
| The ABI authority | `src/domain/townMap/fabric/coordinateAbi.js` | `COORDINATE_ABI.boundaryRule === 'CLOSED'`, `MAX_WORLD_UNITS` | landed by MF-T2B | A6 asserts the locate contract against the ABI record, not against a comment |
| The geometry core | `src/domain/townMap/fabric/exactGeometry.js` | `pointLocateRing`, `bounds` | landed by MF-T2B | the locate substrate; called with `eps = BOUNDARY_EPS_Q` |
| The widened wall | `src/domain/townMap/fabric/foundation.js` | `requireCanonicalInt` defaults `±MAX_WORLD_UNITS` | landed by MF-T2B | untouched here; it is WHY the ABI-scale fixtures reach the kernel |
| The standing law | `tests/lint/townMapFabricSingleDeclaration.walker.test.js` | the fabric single-declaration law | green at zero duplicates | the arriving export names collide with nothing (verified: zero hits tree-wide) |
| Census | `tests/lint/sovereigntyLightingContract.walker.test.js` | `const CENSUS = Object.freeze({` | the five-figure tuple, SEQUENCED | re-record all five together with cause + authorization |
| Test precedent | `tests/domain/townMapCoordinateAbi.test.js` + `tests/property/townMapCoordinateAbiDeterminism.test.js` | MF-T2B's domain matrix + determinism companion | the family's two-file shape | **copy this proof shape** |
| Anchor helper | `tests/helpers/anchoredNegatives.js` | `expectAbsentWithAnchor` | the negative-assertion route | by name on the same line, per §P3 |

**Forbidden alternatives:** no second face list, no parallel "extendedFaces" export, no second
embedding function; no change to any schema/law/version string, `embeddingKind`, or sealed key
list; no import of the sealed sandbox tree from any app file, ever; no barrel edit; no `test.each`,
no `describe.runIf`, no loop-generated tests; no files outside the manifest.

## 6. Exact contracts

### The extended embedding contract (in-memory; the sealed artifact is NOT this)

```js
// derivePlanarDcelEmbedding(input) — input contract UNCHANGED. Returns:
{
  vertices,                       // unchanged shape
  halfEdges,                      // unchanged shape
  faces: [{ faceId, faceKind, boundaryHalfEdgeId,
            innerBoundaryHalfEdgeIds,   // NEW — declared, [] in this era (port-faithful)
            component }],               // NEW — the connected component index
  outerFaceId,                    // preserved: outerFaceIds[0], or undefined when none exists
  outerFaceIds,                   // NEW — one per component that has a negative cycle,
                                  //       each that component's most-negative cycle,
                                  //       ordered by component index
  componentCount,                 // NEW
  faceIndex: [{ ring, bounds, area2 }], // NEW — aligned index-for-index with faces[];
                                  //       ring in ABI quanta; bounds [minX,minY,maxX,maxY]|null;
                                  //       area2 a BigInt
  metrics: { area2s,              // NOW BigInt values, DISCOVERY order (order unchanged)
             cycleLengths, degrees,      // unchanged
             degenerateFaces, holeCycles } // NEW counts
}
export const PLANAR_EMBEDDING_FACE_KINDS =
  Object.freeze(['BOUNDED', 'EXTERIOR', 'HOLE_CYCLE', 'DEGENERATE']);
export function locateFace(embedding, pointQ)   // [xQ,zQ] in ABI quanta — see below
```

⚠⚠ **`faceIndex` ALIGNS WITH `faces` (faceId-sorted); `metrics.area2s` KEEPS DISCOVERY ORDER.**
They are different orderings and zipping them reads another cycle's area — the mistake that
produced a wrong compile-time note (§4). One permutation drives both published arrays in the
implementation, and A1 asserts the alignment.

- **Face kinds.** A positive cycle is `BOUNDED`; a component's most-negative cycle is `EXTERIOR`;
  any OTHER negative cycle of that component is `HOLE_CYCLE`; a zero-area cycle is `DEGENERATE`
  and is REPORTED, never thrown. ⚠ The module docblock records the executed finding: under the
  kernel's own noded-input precondition each component carries exactly one negative walk, so
  `HOLE_CYCLE` is defensive vocabulary — reachable only if a later wave relaxes the precondition —
  and no test may claim it fires (§328).
- **Determinism of components.** Component indices are assigned by a DFS over vertex keys in
  codepoint order, edges followed through each half-edge's own destination; `outerFaceIds` is
  ordered by component index. No hash order anywhere.
- **BigInt law (R-MF-2).** `orient`, `compareRay`'s cross, the atomic-noding predicate's four
  orientations and the shoelace accumulate in BigInt; comparisons against `0n`; published `area2s`
  are BigInt. The `compareRay` tie (`cross === 0n`) still THROWS `'DCEL vertex has an angular
  tie'` — now only on TRUE collinear ties.
- **The traversal cursor (R-MF-1).** All half-edge ids are sorted ONCE by codepoint before the
  face walk; a cursor advances past visited ids to yield each start. The selected start is the
  codepoint-minimum unvisited id — the same value the per-iteration sort produced — and the output
  is invariant because the cycle SET does not depend on discovery order, each cycle is rotated to
  its minimum, and faces are sorted by `faceId`.
- **The zero-area path (divergence 4).** The throw `'DCEL face must have nonzero signed area'` is
  REMOVED; a zero-area cycle produces a face typed `DEGENERATE` (counted in
  `metrics.degenerateFaces`), excluded from `outerFaceIds` and from locate candidacy. A
  degenerate-only component contributes NO `outerFaceIds` entry (executed: open chain →
  `outerFaceIds: []`, `outerFaceId: undefined`).

### Point location — `locateFace(embedding, pointQ)`

```text
input : pointQ = [xQ, zQ], ABI integer quanta (the embedding's own space)
refusal: not a two-element array, or either coordinate not a safe integer within
         ±MAX_WORLD_UNITS  ->  { kind: 'OUTSIDE_ABI', faceId: null }
scan  : every non-DEGENERATE face with a ring of >= 3 (via faceIndex), bounding box first,
        then pointLocateRing(ring, xQ, zQ, BOUNDARY_EPS_Q)   // BOUNDARY_EPS_Q = 0.5, internal
pick  : the smallest containing cycle by |area2|; at equal |area2| a BOUNDED face wins
        (a closed ring's two walks have identical magnitude — picking by iteration order would
        make the verdict depend on discovery order; the region is the answer)
verdicts:
  INSIDE                { kind, faceId, faceKind: 'BOUNDED', faces: <every containing faceId> }
  ENCLOSED_BY_EXTERIOR  { …same shape… }   // best containing cycle not BOUNDED — defensive,
                                           // no reachability pin (§328)
  BOUNDARY              { kind, faceId, faceKind, faces }   // boundaryRule 'CLOSED': a point ON
                                           // a boundary is its own verdict, folded into neither side
  OUTER                 { kind: 'OUTER', faceId: outerFaceIds[0] ?? null, faces: [] }
```

### The seal path — `dcel.js`

- `validateCensus` compares `metrics.area2s` BigInt-safely (`0n` literals; the
  positives-sum-equals-negation identity accumulated from `0n`) and gains the added invariants on
  the admitted input: `componentCount === 1`, `outerFaceIds.length === 1`,
  `outerFaceIds[0] === outerFaceId`, `metrics.degenerateFaces === 0`, `metrics.holeCycles === 0`.
- The seal writes `faces: embedding.faces.map(({ faceId, faceKind, boundaryHalfEdgeId }) =>
  ({ faceId, faceKind, boundaryHalfEdgeId }))` — the legacy triple, key-for-key. The stable
  serializer sorts keys, so the projected records serialize byte-identically to today's and every
  contentHash stays put. Nothing else in the sealed record moves.

### Absence rules

- `outerFaceId` when no component has a negative cycle: `undefined`, and `outerFaceIds` is `[]` —
  never `null`, never a throw.
- `locateFace` on non-ABI input: the `OUTSIDE_ABI` refusal record, never a non-number, never a throw.
- `innerBoundaryHalfEdgeIds`: always present, always an array, `[]` in this era.

### Determinism

- No hash order anywhere: cycle starts by codepoint-minimum id; components by codepoint-first
  vertex key; `outerFaceIds` by component index; faces sorted by `faceId` (unchanged).
- Pure functions; no clock read, no randomness, no locale ordering — the determinism companion
  scans the edited files' raw text with a positive control, exactly as MF-T2B's does.
- BigInt-vs-Number: every published Number stays a Number (`cycleLengths`, `degrees`); every
  BigInt is exact (`area2s`, `faceIndex[].area2`). No BigInt crosses the seal.

### Flag and dormancy

- Flag: `NONE`. Golden posture: **unchanged and PROVEN unchanged** — the untouched-pin control
  plus the before/after equality over every fabric-touching test file (§4 step 4 vs §10).

### Lifecycle

| Create | Read | Persist | Reload | Regenerate | Undo | Import/migrate | Public veil |
|---|---|---|---|---|---|---|---|
| pure derivation, in-memory | `dcel.js` (sole consumer) | ⛔ nothing persisted; the sealed artifact is unchanged | n/a | n/a | n/a | the sealed v1 artifact is untouched, so no migration exists to declare | n/a — no runtime surface |

### Receipts and privacy

- Closed kinds: `NONE`. DM-only fields: `NONE`. Player/public projection: unaffected; nothing runs
  at runtime and no live surface imports the fabric barrel's dcel path any differently.

### Alignment and edit story

- Alignment: `DECLARED EMPTY: an exact-geometry kernel has no alignment surface.`
- Edit story: `ENGINE-ONLY: pure derivation; nothing is DM-editable and nothing is proposed.`

## 7. Exact change manifest

| Action | File | Symbol/region | Max delta | Coding instruction |
|---|---|---|---:|---|
| `MODIFY` | `src/domain/townMap/fabric/dcelEmbedding.js` | `orient`, `compareRay`, the atomic-noding predicate, the traversal loop, the cycle/face assembly, + new `locateFace`, `PLANAR_EMBEDDING_FACE_KINDS`, internal `BOUNDARY_EPS_Q` | `+150 / −15` eff | The §6 contract, ported against `fabricDcel.js` at the header SHA. ⛔ The exported signature line survives byte-identical at column zero; `CURRENT_MAP_TRADITION_ID` is neither imported nor declared here; the input contract does not change |
| `MODIFY` | `src/domain/townMap/fabric/dcel.js` | `validateCensus` + the seal's `faces:` line | `+15` eff | BigInt-safe census, the added invariants, the legacy-triple projection. ⛔ No other sealed field moves |
| `CREATE` | `tests/domain/townMapDcelEmbeddingExtension.test.js` | `describe('MF-T2C planar-embedding extension')`, A1–A6, A8 | `n/a` | The domain matrix: ONE literal `describe`, seven straight-line `test()` calls, string-literal titles, fixtures built inside named tests (SP-D idiom) |
| `CREATE` | `tests/property/townMapDcelEmbeddingDeterminism.test.js` | `describe('MF-T2C planar-embedding determinism')`, A7 | `n/a` | The replay companion, matching MF-T2B's property-file shape |
| `TEST` | `tests/lint/sovereigntyLightingContract.walker.test.js` | the `CENSUS` object | `+27/−1` | ONE re-record block naming its cause and the `censusAuthorization` refs; all five figures re-derived together at the base by placeholder-and-convict |
| `DOC` | `docs/implementation/packets/town-cartography/MF-T2C.md` | this packet | `n/a` | The packet, its status transitions, and its §12 landing record |

Generated artifacts: `NONE`. No other file may be edited. ⚠ The two acceptance files are `CREATE`
rows, not `TEST` rows — a `TEST` path must exist at every status (the MF-T2B measured precedent).
⚠ No `tests/lint/**` file is minted, so §P3b's mutation-coverage row is **NOT INCURRED**; no
registration file is touched, and §P4's four-name template is satisfied by its "reason none exists"
arm: the kernel is directory-internal, the barrel deliberately does not export it, and the registry
test paths that bind this member are the single-declaration walker and the entry-closure fence.

**Symbols the deliverable CREATES** (`locateFace`, `PLANAR_EMBEDDING_FACE_KINDS`, the two describe
titles) join `requiredSymbols` **at the flip to LANDED, never at READY** — the validator resolves
rows against the live tree at every status.

## 8. Ordered coding sequence

0. Dispatch and seal; run every §4 preflight. STOP on any mismatch.
1. **Capture the golden/dormancy evidence BEFORE the first edit:** the §4 step-4 battery counts;
   the census tuple; and the §P2.9 unedited-kernel fixture captures — the pins of A1–A8 are
   written FROM these captures and from the edited kernel's own printed output.
2. Implement `dcelEmbedding.js` per §6 — arithmetic first (BigInt orient/compareRay/noding/
   shoelace), then the cursor, then components/kinds/`outerFaceIds`/`DEGENERATE`, then `faceIndex`
   and `locateFace`.
3. `dcel.js`: the BigInt-safe census, its added invariants, the seal projection.
4. Add the acceptance tests A1–A8 from the executed captures; run the anchor preflight.
5. Re-derive and re-record the census by placeholder-and-convict, all five figures together.
6. Focused verification (§10), including the untouched-pin control and the anchor preflight.
7. The removing-power sweep, then the post-build dormancy discharge.
8. Wave-end gate and the completion receipt (§12).

**Bounded algorithm — the cursor repair (the one hot-loop change):**

```text
1. sortedIds := [...edgeById.keys()].sort(compareCodepoint)        // ONCE
2. cursor := 0
3. while unvisited.size:
4.   while cursor < sortedIds.length and !unvisited.has(sortedIds[cursor]): cursor += 1
5.   start := sortedIds[cursor]        // == codepoint-minimum unvisited, as today
6.   walk the cycle exactly as the landed loop does
```

**Bounded algorithm — components and outer faces:**

```text
1. for each vertex key in codepoint order: if unassigned, DFS through each outgoing half-edge's
   destinationKey, stamping componentIndex; componentCount := number of DFS roots
2. each cycle's component := component of its first half-edge's origin
3. per component: outer := the cycle with the minimum (most negative) BigInt area2 among its
   negative cycles, if any
4. faceKind := area2 > 0n ? BOUNDED : area2 === 0n ? DEGENERATE
                : (outer of its component ? EXTERIOR : HOLE_CYCLE)
5. outerFaceIds := outers ordered by componentIndex; outerFaceId := outerFaceIds[0] (undefined
   when the list is empty)
```

## 9. Acceptance matrix

Every negative carries a positive control in the same test. The **capture** column is the UNEDITED
kernel's behavior at this base, printed before the pin was written (§P2.9).

| ID | Case | Fixture/input | Capture (unedited kernel) | Required observation | Home |
|---|---|---|---|---|---|
| **A1** | Main behavior — the extension is INERT on the admitted input | the admitted orthogonal-cross fixture through `compileOrthogonalCrossPlanarDcel`, plus the raw embedding | the sealed artifact compiles; face keys are the legacy triple | positive control FIRST: 10 faces, `faceIndex` aligned 1:1, every ring ≥3, every bbox present, and the alignment itself asserted (`faceIndex[7].area2 === -1620000n` while `metrics.area2s[0]` is the same value from the OTHER ordering). Then inertness: `componentCount` 1, `outerFaceIds` deep-equals `[outerFaceId]`, every `innerBoundaryHalfEdgeIds` `[]`, `degenerateFaces` and `holeCycles` 0. Then the seal: face keys exactly `['boundaryHalfEdgeId','faceId','faceKind']`, the key list still carrying SINGULAR `outerFaceId`, and the two extended keys absent from the seal via `expectAbsentWithAnchor` | domain |
| **A2** | ⭐⭐ The named historical regression (R-MF-2) with its convicting counterexample | the triangle `a=[0,0] b=[m−1,m] c=[m,m+1]`, `m = 1286630001` | **THROW `'DCEL vertex has an angular tie'`** | the extended kernel EMBEDS it: 2 faces, one `BOUNDED` one `EXTERIOR`, Euler `V−E+F = 2`. The counterforce with its control: `Number` cross `0` vs `BigInt` `−1n` at ABI scale, both `−1` on the same shape at fixture-era scale — the divergence is the SCALE. And the throw's own positive control: two collinear boundaries from one origin STILL throw the angular-tie message | domain |
| **A3** | Divergence 4 — a zero-area cycle is typed, never thrown | the two-segment open chain `[0,0]→[10,0]→[10,10]` | **THROW `'DCEL face must have nonzero signed area'`** | one face, `faceKind: 'DEGENERATE'`, `degenerateFaces === 1`, `area2s` `[0n]`, `outerFaceIds` `[]`, `outerFaceId` `undefined`; positive control in the same test: CLOSING the chain yields zero `DEGENERATE`, one `BOUNDED`, one `EXTERIOR`, one outer | domain |
| **A4** | Divergence 3 — one outer face PER COMPONENT | two disjoint axis-aligned squares (8 boundaries) | 4 faces, **2 typed `EXTERIOR`**, ONE singular `outerFaceId` | `componentCount === 2`; `outerFaceIds` length 2, each `-200n` read through the ALIGNED index, both typed `EXTERIOR`, components `[0, 1]`, `outerFaceId === outerFaceIds[0]`; positive control: the single-square half alone yields exactly one | domain |
| **A5** | Divergence 2's real shape — a nested ring is a second COMPONENT, and containment is the locate rule's | a 100×100 square with a disjoint 20×20 square nested inside | 4 faces, 2 `EXTERIOR`, and the singular field names the INNER ring's walk | `componentCount === 2`, both outers `EXTERIOR` with areas `[-20000n, -800n]` in component order, `holeCycles === 0` (anchored, naming the defensive-vocabulary ruling); `locateFace` at an inner point names the INNER `BOUNDED` face (area `800n`) while listing all four containing cycles, and at an annulus point names the OUTER `BOUNDED` face (area `20000n`) listing two | domain |
| **A6** | ⭐ Point location under the ABI's own boundary rule | the nested fixture of A5 plus the ABI record | n/a — the facility does not exist on the unedited kernel | `COORDINATE_ABI.boundaryRule === 'CLOSED'` asserted as the authority; positive control FIRST (the INSIDE verdict fires); a point ON the inner ring's edge returns `kind: 'BOUNDARY'`; a far point returns `kind: 'OUTER'` with `faceId === outerFaceIds[0]` and an empty hit list; a non-integer quantum, an over-envelope coordinate and a mis-shaped point each return the `OUTSIDE_ABI` refusal with `faceId: null`; the published vocabulary is the closed ordered four | domain |
| **A7** | Idempotency / replay + purity | every fixture above run twice; the edited files' raw text | n/a | byte-identical results both times under a BigInt-safe serializer, the sealed artifact compared by `contentHash` across two compiles, and pinned answers so a consistently-wrong kernel cannot pass; plus the source scan of both edited leaves finding no forbidden identifier, with a positive control proving the scan sees a planted occurrence | property |
| **A8** | Correctness at scale — the repaired traversal on a real-leaf-sized input | a deterministic synthetic grid (30×30 cells ⇒ 1,860 boundaries), built inside the test | `V=961 E=1860 F=901`, `V−E+F=2` in 646 ms | `[V, E, F] === [961, 1860, 901]`; Euler `V − E + F === 1 + C` with `C === componentCount`; `outerFaceIds` length equals `componentCount`; the cycle lengths sum to `2E` and every half-edge carries a face id; zero `DEGENERATE`. ⛔ NO wall-clock assertion — the elapsed time is receipt evidence (§328) | domain |

**Anchor law (§P3):** A1, A3, A5, A6 and A8 assert absences. Each routes through
`tests/helpers/anchoredNegatives.js` by name on the same line, or carries `// anchored: <why this
cannot go vacuous>` on the assertion line or the line immediately above.

**Census motion — DERIVED, not planned:**

```
BEFORE: 2488 / 364 / 2124 / 20655 / 5776   (re-derived at this base)
AFTER : 2490 / 364 / 2126 / 20663 / 5778
DELTA : +2 files · +0 parked · +2 credited · +8 titles · +2 suites
```

⛔ **`parked` DID NOT MOVE.** One literal `describe` per file, straight-line `test()` calls,
string-literal titles; loops live INSIDE named tests. ⚠ **NAMED INTERIOR RED:** the census arm is
an exact equality against a recorded constant, so this member reds at its own implementation
commit until the tuple is re-recorded — and because the census is SEQUENCED, the `files` red is
itself proof the later figures had not yet been read. Observed and cleared; the five convictions
are quoted in the lane receipt.

## 10. Verification commands — executed

| Step | Command | TRUE_EXIT | Result |
|---|---|---:|---|
| Anchor preflight (first run) | `npx vitest run tests/lint/negativeAssertionAnchor.walker.test.js` | **1** | CONVICTED one un-anchored negative at line 124 of the new domain matrix — ceiling zero, exactly as §P3 says |
| Anchor preflight (after the anchor) | same | **0** | green |
| Focused static | `npx eslint <the four files>` | 0 | no output |
| Typecheck ratchet | `npm run typecheck:ratchet` | 0 | 173 errors, ceiling 173 — floor held exactly |
| Typecheck domain-strict | `npm run typecheck:domain:strict` | 0 | 1134 errors, ceiling 1134 — floor held exactly |
| Effective lines | eslint `Linter` over the working tree | — | `dcelEmbedding.js` 267 · `dcel.js` 93 |
| Focused tests | the two acceptance files + the two walkers | 0 | 4 files / 22 tests |
| ⭐ The untouched-pin control | the §4 step-4 battery, re-run AFTER the edit | 0 | **12 files / 74 tests**, per-file counts IDENTICAL to the before-capture, zero pin files in the change set |
| Census | `npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js` | 0 | 1 file / 33 tests, after the five-conviction re-record |
| ⛔ Dormancy, POST-BUILD | `npm run build` then `VERIFY_DIST=1 npx vitest run tests/build/townMapLazy.test.js` | see §12 | a pre-build run self-skips and is not a discharge (§P2.2) |
| ⭐ The removing-power sweep | eight mutants + a pristine control and a clean re-run | — | see §12 |
| Sealed receipt | `npm run check:packet -- MF-T2C` | see §12 | not landing authority |
| Wave-end | `npm run check:tail` — BARE, fresh shell, never wrapped in `gate-mutex` | see §12 | — |

⛔⛔ **NEVER wrap `npm run check*` in `gate-mutex.sh --run`** — `test:ratchet` re-acquires and
self-deadlocks; **exit 3 is the mutex giving up, not a red.** ⚠ Trust no exit status you did not
capture.

## 11. Mandatory STOP conditions

In addition to `PACKET_STANDARD.md` and preamble §P7:

- any digest pin, exact-key pin, or pinned roster in the twelve suites moves — the seal projection
  exists precisely so they cannot; re-record nothing, STOP and report the moved pin;
- any fabric-touching test file changes its result between the §4 and §10 captures;
- `PLANAR_DCEL_SCHEMA_VERSION`, `PLANAR_DCEL_LAW_VERSION`, `embeddingKind`,
  `FABRIC_COORDINATE_ABI` or any stamped version string would need to move;
- the port source's SHA-256 does not match the header table, or the family preamble's hash does
  not match a fresh computation at the base;
- the `export function derivePlanarDcelEmbedding(input) {` line would change in ANY byte, or
  `CURRENT_MAP_TRADITION_ID` would become imported or declared in the host;
- the ABI-scale triangle does NOT throw at the §4 step-7 capture (the base moved under the member);
- the bare name `clipHalfPlane` would be declared; the single-declaration walker reds; an arriving
  export name collides with a live one;
- a wall-clock assertion would be needed to make any credited test meaningful;
- a reachability pin would be needed for `HOLE_CYCLE` or `ENCLOSED_BY_EXTERIOR`;
- the census moves by other than `+2 / +0 / +2 / +8 / +2` against the tuple captured at §4 step 5,
  or `parked` moves at all;
- `tests/build/townMapLazy.test.js` reds POST-BUILD, or the forensic zoom finds a member-unique
  literal in an entry chunk;
- another D3a member is simultaneously non-terminal on
  `tests/lint/sovereigntyLightingContract.walker.test.js`;
- any ratchet, baseline, budget or ceiling would need raising; any tuning constant would be touched
  beyond what §6 declares.

Do not edit the packet, broaden the manifest, repair unrelated gate failures, or continue into the
next wave.

## 12. Completion receipt

**Base and lifecycle.** Built on a detached ref at `fb80e32f03564e6edcbad4bf37de27694c2fe986` in
the lane's own worktree with its own `node_modules` (`npm ci`, TRUE_EXIT=0). Commits:
`a615cfdd` (DRAFT) → `3482a063` (READY) → `0918f8d3` (implementation) → this one (LANDED). No ref
was moved by the lane; the chair CASes. Working tree at the LANDED tip: clean apart from this
commit's own three doc files.

**Hashes, recomputed at the base rather than quoted.** The family preamble is
`0706aad6a84e4f74ec47602e9e3222fc398c4c8864bb38c79ac480c2a11db4ed` (`git show fb80e32f:… |
shasum -a 256`) — no third re-stamp occurred. The port source `fabricDcel.js` re-hashed to
`01da024a8655ce9e468a75a53ffc49a4e28508d2d7a9400cbe2dbf1b6d81197b`, matching the header table.
Neither is a STOP.

**Changed files and effective lines** (eslint's own `Linter`, never `wc -l`): `dcelEmbedding.js`
169 → **267**, `dcel.js` 89 → **93**; **118 effective lines added and 23 removed**, i.e. 141
touched of the 220 budget, inside the compile's 120–160 estimate. `dcelEmbedding.js` remains far
under the plain `src/domain/**` 800 ceiling.

**The §4 step-7 captures against the UNEDITED kernel, verbatim** — no pin was written before them:

```
A2 abi-triangle            THROW "DCEL vertex has an angular tie"     (Number cross 0, BigInt -1n)
A2 true-collinear-tie      THROW "DCEL vertex has an angular tie"
A3 open-chain              THROW "DCEL face must have nonzero signed area"
A4 two-components          faces=4 exteriors=2 under ONE singular outerFaceId
A5 nested                  faces=4 exteriors=2; the singular field names the INNER ring's walk
A8 grid-30 (1860 bounds)   V=961 E=1860 F=901  V-E+F=2   [646.07 ms]
```

**A1–A8 executed:** 2 files / 8 tests, TRUE_EXIT=0. Every figure in §9's observation column is a
printed result from the edited kernel, not a prediction.

**The untouched-pin control:** the twelve digest-pin suites gave **12 files / 74 tests** both
before the first edit and after the last, with per-file counts identical row for row; no pin file
appears in the change set at all. Mutant M7 proves that green can red.

**Mutants: eight planted, eight convicted, eight restored digest-exact** (`cmp` verified, never
`git checkout --`), with a pristine-green control before and a clean re-run after. M1→A2, M2→A3,
M3→A4+A5, M4→A6, M5→A1, M6→A1, M7→the exact-key pin, M8→A5+A6.

**Census before → after, all five re-derived together by placeholder-and-convict:**

```
2488 / 364 / 2124 / 20655 / 5776   →   2490 / 364 / 2126 / 20663 / 5778
delta  +2 / +0 / +2 / +8 / +2
```

`parked` did not move, and conviction 2 is the executed proof of that rather than an assumption.
The named interior red was observed at conviction 1 and cleared; the census walker then ran
1 file / 33 tests, TRUE_EXIT=0. The `suiteTitles` and `titles` deltas were additionally proved
away from the walker by counting `describe(` and `test(` across the whole `tests/` change set
including the untracked files: 1+1 and 7+1, with zero added to any tracked test file.

**Both typecheck configurations, by name and window:** `typecheck:ratchet` (`tsconfig.full.json`)
173 errors against ceiling 173, and `typecheck:domain:strict` (`tsconfig.domain-strict.json`) 1134
against ceiling 1134 — identical before and after, so the member added no type debt and needed no
widening. Neither baseline carries a `townMap` key, so the allowance was zero in both.

**Anchor preflight:** it CONVICTED on the first run — one un-anchored negative at line 124 of the
new domain matrix, ceiling zero — and was cured with a stated reason rather than a deleted
assertion. Re-run TRUE_EXIT=0.

**Dormancy, POST-BUILD only:** `npm run build` TRUE_EXIT=0; without `VERIFY_DIST` the fence
reports `2 passed | 1 skipped` and is NOT a discharge; under `VERIFY_DIST=1` it reports
**3 passed**, TRUE_EXIT=0. Forensic zoom over the fence's own BFS: the entry static closure is
**8 js chunks of 524**; `HOLE_CYCLE`, the angular-tie message and `innerBoundaryHalfEdgeIds` each
appear in exactly ONE lazy chunk and in ZERO entry chunks, with `createElement` and `useState`
asserted present in the closure as scanner controls. ⚠ `OUTSIDE_ABI`, `ENCLOSED_BY_EXTERIOR` and
`PLANAR_EMBEDDING_FACE_KINDS` are absent from the WHOLE bundle because `locateFace` has no
consumer yet, so those three rows prove nothing and are set aside; the three that ship are the
evidence.

**The MF-T2A sweep plant still applies.** The exact `perl` substitution of entry 28a was run
against the edited file in a scratch copy: one occurrence planted, and `node --check` PARSES — so
the plant remains a live second declaration rather than the J-TET2A-1 parse-error class. The
anchor line survives byte-identical at column zero in the committed blob and
`CURRENT_MAP_TRADITION_ID` count in the host is 0.

**Measured wall clock, as receipt evidence only — no credited test asserts it:** the A8 grid at
1,860 boundaries took 646.07 ms on the unedited kernel and 174.91 ms on the repaired traversal
(3.7× at this size); the ABI-triangle embed is 1.44 ms. ⚠ The compile's 12.7× was measured at
2,112–8,320 boundaries where the quadratic term dominates far harder; these are consistent
measurements at different sizes, not the same measurement.

**Generated artifacts:** `NONE`. **Deviations:** none that reached a STOP. One compile figure was
corrected at the base and recorded (§4). **Out-of-scope observations, recorded and not
investigated:** `docs/implementation/INDEX.md` is edited by every packet landing but reserved in
only four historical, terminal `changeManifest`s; this member follows the MF-T2A/MF-T2B precedent
of adding its row without reserving the path. `npm run check:packet` and
`npm run implementation:resume` both exit 2 from a detached executor worktree because they require
`git symbolic-ref HEAD`; neither is landing authority, and the tool says so itself.

**Judgment calls, each vetoable:** the four §1 resolutions (extend-in-place with a legacy
projection at the seal; `EXTERIOR` kept while `HOLE_CYCLE`/`DEGENERATE` arrive unchanged;
`locateFace` takes ABI quanta; the angular-tie throw preserved and made exact), plus the two this
lane added — treating the corrected nested-fixture note as a re-derivation rather than a §11 STOP,
because the base is byte-identical to the compile tip and the difference was a probe's
mis-zipping; and following the landed family precedent on the INDEX row rather than minting a new
path reservation.
