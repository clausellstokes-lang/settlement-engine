# Town cartography / MF-T2D — the boundary noder (the arrangement stage the kernel's contract requires, ported onto the kernel's own admission predicate)

- **Status:** LANDED
- **Packet version:** 1
- **Verified base:** `claude/composite-r4` at `3ac279db4232cc65abb57c4fa016578efd0f695d`
  (the WF-1E landing; this member was rebased onto it — see §12). Every preflight row below was re-executed at THIS base by the
  implementing lane; nothing is inherited from the compile, from the capsule, or from a sibling.
- **Depends on:** `MF-T2A` (the single-declaration law — LANDED at `37fb6916`), `MF-T2B`
  (the ABI wall + `exactGeometry.js` — LANDED at `cdfe5a96`), and `MF-T2C` (the exact kernel this
  member feeds — LANDED at `f5332cf7`). ⛔ MF-T2C is a HARD dependency of the acceptance design:
  A2's kernel-refusal control exists only because the kernel's atomic check is now exact.
- **Family preamble:** `docs/implementation/preambles/MF-PREAMBLE.md`, SHA-256
  `0706aad6a84e4f74ec47602e9e3222fc398c4c8864bb38c79ac480c2a11db4ed` — **recomputed at this base
  by the implementing lane** and matching the compile's value. Its §P1 refutations, §P2 hazard
  dispositions, §P3 anchor preflight, §P4 registration template, §P5 census law, §P6 mutant
  hygiene, §P7 STOP set and §P8 capsule law bind this packet and are not restated.
- **Collision group:** `d3a-port` — this member reserves ONE shared D3a change path,
  `tests/lint/sovereigntyLightingContract.walker.test.js`. ⭐ It deliberately reserves NO path on
  `src/domain/townMap/fabric/index.js` and NO path on any existing production file.
- **Commit authority:** the executing lane commits on its own detached ref; the chair moves the
  branch.

> **`censusAuthorization`:** this packet moves the test census by two credited files, eight titles
> and two suite titles. Its authorizing decisions are **ODQ §312** (the D3a port dispatch that
> commissions this member) and **ODQ §334** (the chair's review of the compiled draft, which ruled
> every RAISED item), under the wave charter at **§310.4** and §299.4's binding-forward rule that
> a packet moving any census or ratchet names its authorizing decision in the packet body. The
> family's stamp is **GRANTED** at ODQ §312.2b.

> ⛔ **PORT SOURCE PROVENANCE (preamble §P1 R-MF-4).** The sandbox is not a git repository, so
> there is no commit to cite. This packet names its source by path **and SHA-256**, re-hashed at
> this base before any edit.
>
> | source | SHA-256 |
> |---|---|
> | the sealed W3 tip's `src/domain/townMap/fabric/fabricDcel.js` — `nodeSegments`, the ladder walk inside `buildBoundaryArrangement`, `gridCell`, `key2`, and `ARRANGEMENT_QUANTUM_LADDER` / `ARRANGEMENT_QUANTUM` | `01da024a8655ce9e468a75a53ffc49a4e28508d2d7a9400cbe2dbf1b6d81197b` |
>
> ⭐ The same bytes are preserved IN THE REPOSITORY at `refs/preserve/map-sandbox-w3f-sealed`
> (`ee0db96d`), blob `bc1880a2` at the same relative path. This lane verified
> `git cat-file blob bc1880a2 | shasum -a 256` returns the identical digest at its base.
>
> The float intersection estimate (`segIntersect`) and nothing else is consumed from THIS TREE's
> `exactGeometry.js`, landed by MF-T2B — no second port of `fabricGeometry.js` occurs here.

---

## 1. Reconciled authority

1. **ODQ §303.5, the port boundary law:** *"adopt the codex slice's RECORD SHAPES and its
   embedder's algorithm; do NOT adopt its arrangement compiler, census, or parcel registry… On
   the integer wall: D1's versioned ABI wins… the ported record shapes re-parameterize onto the
   ABI."* ⭐⭐ **This member sits ON that boundary.** The three refusals are all *codex-side*
   machinery. What is refused is the codex's arrangement COMPILER, never the arrangement STAGE:
   the adopted embedder's contract states an atomically-noded precondition and enforces it with a
   throw, so *something* must produce noded input. The noding ALGORITHM therefore comes from the
   sandbox (§310.4), while the noded boundary RECORD wears the codex row shape — canonical unique
   digest identity, canonical endpoint direction, the surface-leaf `support` record — so the
   landed kernel admits it verbatim.
2. **ODQ §334** — the chair's review of the compiled draft. Its five governing rulings:
   §334.2 adopts the exact cut predicate as a DECLARED divergence with its executed witnesses;
   §334.3 ports the quantum ladder and its walk VERBATIM as carried structure, choosing no rung;
   §334.4 keeps `artifactKind`/`schemaVersion` off the in-memory record, adds no barrel
   registration, ports the defensive post-snap wall re-validation with its docblock finding and
   the RE-TARGETED M7 mutant, and holds real-leaf noding out of scope pending §312.2c's dual-run
   gate; §334.5 keeps `boundaryArrangement.js` and leaves `retiredSymbols` empty.
3. **Preamble §P1 R-MF-2** — every module deciding topology, ordering or identity from a product
   of ABI quanta uses BigInt, with the reason in the file. ⭐⭐ **EXECUTED AT THIS BASE, and the
   reason is sharper than the compile recorded.** On the on-grid pair
   `a=[0,0] b=[9007199000,1000]` × `c=[1000,−1000] d=[−9007189000,9007198000]` the crossing
   parameter's exact denominator is `81129642832791000000` while the double carrying it holds
   `81129642832790994944` — an error of `5056`, and a value four orders of magnitude past
   `MAX_SAFE_INTEGER`. ⚠ The compile receipt recorded these two as EQUAL; that was a comparison of
   PRINTED values, and it is refuted by an exact comparison at this base. The correction
   strengthens R-MF-2 rather than weakening it, and the leaf's docblock states the executed
   figure rather than the compile's. The refusal MECHANISM remains the epsilon band: the exact
   parameter is `9000000 / 81129642832791000000` ≈ `1.109e−13`, strictly interior but inside
   `CROSS_EPS = 1e-9`, so the landed predicate answers "not proper" and the sandbox letter leaves
   the pair un-split while the landed kernel refuses exactly that output.
4. **Preamble §P1 R-MF-1** — a port member prices complexity against real leaf sizes (town 11,603
   boundaries, metropolis 17,417). The sandbox's uniform-grid pair bucketing is therefore ported,
   not dropped: the naive pair loop is quadratic in the boundary count.
5. **ODQ §312.2c** — twin-life retirement fires at DUAL-RUN EQUIVALENCE, not at D3a's seal. This
   is why the codex arrangement jig is NOT retired, adapted, or touched here.
6. **ODQ §287.16 / §290.1 / §290.4** — dormant explicit input; live seeds byte-identical; the
   existence of a conceivable edge case is not authority to enlarge the tranche.
7. **ODQ §310.3(9) / preamble §P2.5** — the arrangement-quantum ladder's three rungs are owner
   tuning surface. This member PORTS the ladder and its first-zero-residual walk verbatim and
   chooses nothing.
8. **Live code decides.** Every load-bearing fixture was EXECUTED at this base before any pin was
   written (preamble §P2.9): the landed kernel on noded and un-noded input, the landed float
   predicate at both scales, the snap-past-wall arithmetic, and the implemented noder's own
   printed output. Captures in §4.2 and the lane receipt `laneTET2D-receipt.md`.

**Resolved contradictions:**

- *The plan's member row orders `boundaryArrangement.js` "retired to a thin adapter or deleted"
  with a `retiredSymbols` row* — vs the landed tree, where `compileOrthogonalCrossCadastralArrangement`
  is replayed as an input validator by `dcel.js`, `fabricRoot.js` and `parcelRegistry.js`, and its
  sealed artifact is frozen by `tests/domain/townMapBoundaryArrangement.test.js`.
  **RESOLUTION (§334.5): the codex jig is NOT touched. This member edits ZERO existing production
  files; `retiredSymbols` is EMPTY.**
- *The sandbox noder's letter (float `properCross`, crossings only)* — vs *the landed kernel's
  exact admission check*. **RESOLUTION (§334.2): the cut predicate is the KERNEL'S OWN admission
  predicate, exact, inverted into cuts** — §6. FOUR witness classes were executed at this base
  proving the letter cannot feed the kernel; the implemented design cures all four with Euler
  holding on every one.
- *The sandbox record stamps `artifactKind: 'CADASTRAL_BOUNDARY_ARRANGEMENT'` with
  `schemaVersion: 1`* — vs the landed sealed artifact of the SAME kind and version with a
  DIFFERENT shape. **RESOLUTION (§334.4): the noder's published record carries NO `artifactKind`
  and NO `schemaVersion`** — it is an in-memory derivation result.
- *The sandbox noder consumes a published fabric and quantizes world-unit floats through `worldQ`*
  — vs *§287.16's dormant-explicit-input scope*. **RESOLUTION: the fabric-extraction half does NOT
  port here, and the noder takes explicit integer-quanta segments, refusing non-integers through
  the landed `requireCanonicalInt` wall.**
- *The plan's "the port carries rung 0 unchanged as the ported value"* — vs the sealed source,
  whose own sweep table records that rung 0 alone leaves TWO real leaves un-noded.
  **RESOLUTION (§334.3): the ported value is the LADDER plus its first-zero-residual walk,
  verbatim.**

## 2. Outcome

**Observable result:** the app-side fabric gains the arrangement stage the landed kernel's
contract requires and nothing today supplies: a pure noder that takes explicit boundary segments
in ABI integer quanta and returns an atomically-noded boundary set the landed
`derivePlanarDcelEmbedding` admits — proper crossings split at snapped intersections, endpoint
touches noded, collinear overlaps decomposed and deduplicated, endpoints snapped to the first
arrangement-quantum rung that nodes clean — with the rung used, the pass count, and every residual
published as data. The sealed artifact chain, every digest, and every live byte stay where they
are.

**The IN/OUT boundary, named affirmatively (§303.5 applied):**

| capability | verdict | why |
|---|---|---|
| the noding passes: snap-to-rung, exact-crossing split, bounded passes, residual counting, dedupe | **IN** | the sandbox algorithm §310.4 orders re-expressed; the kernel's stated precondition |
| the quantum-ladder walk (first rung that nodes to zero residual; finest kept otherwise) | **IN** | §334.3; part of the sandbox algorithm, carried verbatim |
| the codex boundary ROW shape: digest `boundaryId`, canonical direction, `support` `{kind:'PLANAR_SURFACE', leafIndex: 0}` | **IN** | §303.5 record-shapes-in; it is what makes the output kernel-admissible verbatim |
| the integer wall (quanta in, quanta out; typed refusals on non-integers and on snap-past-wall) | **IN** | "D1's versioned ABI wins"; executed at §4.2 |
| published noding diagnostics (rung, passes, residual, splits, duplicates) | **IN** | the sandbox's own honesty design: reported rather than assumed away |
| the codex arrangement compiler and its sealed artifact | **OUT — untouched** | §303.5 do-not-adopt; §334.5; retirement is §312.2c's dual-run act |
| the codex census machinery; the parcel registry | **OUT** | §303.5 do-not-adopt |
| the fabric-extraction half of `buildBoundaryArrangement` | **OUT** | consumes sandbox fabric records with no app-side producer |
| `derivePlanarDcel`, `locateFace`, `faceRing`, `faceAdjacency`, `deriveBlockFaces` | **OUT** | the embedder half is MF-T2C's landed subject |
| any arrangement-quantum rung choice, any tuning constant | **OUT** | §310.3(9) owner docket; the ladder ports verbatim and is equality-pinned |
| production wiring, barrel export, any consumer | **OUT** | §334.4; the member lands DORMANT; the acceptance battery is the only caller |

**Definition of done:** `boundaryNoder.js` exports `ARRANGEMENT_QUANTUM_LADDER` (verbatim) and
`nodeBoundarySegments`; the acceptance matrix passes with the landed kernel embedding every noded
fixture and refusing every un-noded control; the census is re-recorded; every digest pin and every
fabric-touching test result is unchanged.

**Explicit non-goals:**

- ⛔ **No existing production file moves.** Not `boundaryArrangement.js`, not `dcel.js`, not
  `dcelEmbedding.js`, not the barrel. The MF-T2A sweep-plant anchor line
  (`export function derivePlanarDcelEmbedding(input) {` at column zero) and the
  `CURRENT_MAP_TRADITION_ID` non-import in that host are preserved BY CONSTRUCTION and were
  verified by grep before and after.
- ⛔ **No `retiredSymbols`.** ⛔ **No consumer is wired; no barrel edit.** ⛔ **No sealed-artifact
  change, no persisted record family, no `artifactKind` stamp.** ⛔ **No rung choice, no tuning
  constant, no pass-cap change.** ⛔ **No collinear-overlap MERGE machinery beyond
  split-and-dedupe**, no rational-exact split points, no multi-leaf support, no y-flip, no
  height, no `FABRIC_COORDINATE_ABI` motion, no dependency bump.
- ⛔ **No claim about real-leaf noding** (§334.4). The sandbox corpus figures are the sealed tip's
  evidence; this member's claims are its executed fixtures only.

## 3. Hard scope budget

| Limit | Packet budget | Measured | Standard |
|---|---:|---:|---:|
| Behavior families | `1` | 1 | 1 |
| New persisted record families | `0` | 0 — in-memory | ≤1 |
| Named state writers | `0` | 0 | ≤1 |
| Feature flags | `0` | 0 | ≤1 |
| User-facing surfaces | `0` | 0 | ≤1 |
| Direct production consumers | `0` | 0 | ≤2 |
| New logic-bearing production leaves | `1` | 1 — `fabric/boundaryNoder.js` | ≤2 |
| Existing logic-bearing production files modified | `0` | **0** | ≤3 |
| Additional registration-only files | `0` | 0 | ≤3 |
| Handwritten files total | `5` | 5 | ≤12 |
| New/changed effective production lines | ≤ `230` | **201** | ≤400 |
| Effective lines per new leaf | ≤ `210` | **201**, measured with eslint's own `Linter` | ≤250 |
| Delta in a shared/hot file | `0` | 0 — no manifest path is on the hot-file list | ≤15 |
| Acceptance cases | `8` | 8 | ≤8 |

Overrides approved before dispatch: `NONE`.

## 4. Sealed dispatch and preflight — EXECUTED AT THIS BASE

| # | Check | Result at `3ac279db` |
|---|---|---|
| 0 | `shasum -a 256 docs/implementation/preambles/MF-PREAMBLE.md` | `0706aad6…1db4ed` — MATCH |
| 1 | port source re-hash via `git cat-file blob bc1880a2` | `01da024a…197b` — MATCH |
| 2 | name-collision scan over `src` and `tests` for the arriving names | **zero hits** (grep exit 1) |
| 3 | `npx vitest run tests/lint/townMapFabricSingleDeclaration.walker.test.js` | green |
| 4 | the fabric-touching battery, list re-derived at base by grep over `tests/` for `townMap` | **176 files — 173 passed, 3 skipped; 2,079 tests — 2,032 passed, 47 skipped**; `TRUE_EXIT=0` |
| 5 | the census tuple, by placeholder-and-convict | `2,490 / 364 / 2,126 / 20,669 / 5,778` at the rebase base (it read `…20,663…` at the pre-WF-1E base — re-derived, never carried) |
| 6 | `npm run typecheck:ratchet` · `npm run typecheck:domain:strict` | `173` errors at ceiling `173` · `1,134` errors at ceiling `1,134`; no `townMap` key in either baseline, so the new leaf carries zero allowed debt |
| 7 | §P2.9 unedited-substrate captures | §4.2 |

⚠ Rows 4 and 6 were re-derived a SECOND time with the new leaf moved out of the tree, because the
first capture overlapped the lane's own file write. The clean re-derivation is what this table
records.

### 4.2 · The witness captures this packet's pins are written FROM

Executed at this base against the landed modules, before any pin existed:

```
P2  two crossing square rings, un-noded  -> kernel THROW 'DCEL boundaries must be atomically
                                            noded without crossings or overlaps'
P3  collinear overlap, on-grid           -> landed properCross = false; kernel THROW (same)
P5  the eps-band pair                    -> exact t = 9000000/81129642832791000000
                                            = 1.109e-13 < CROSS_EPS 1e-9; float den error 5056;
                                            landed properCross = false; kernel THROW (same)
P8  T-junction (stub ending ON an edge)  -> landed properCross = false; kernel THROW (same)
P8b the same T-junction, hand-noded      -> kernel EMBEDS V=6 E=6 F=2 C=1, Euler holds
NEW the SHARED-ENDPOINT collinear overlap-> kernel THROW 'DCEL vertex has an angular tie'
P6  snap-past-wall arithmetic            -> MAX_WORLD_UNITS 9007199254 snaps to 9007199000 at
                                            rung 1000 (INSIDE the wall) and to 9007200000 at
                                            rungs 5000 and 25000 (746 past it, refused by the
                                            landed requireCanonicalInt naming its range)
```

⭐⭐ **THE FOURTH WITNESS CLASS IS THIS LANE'S OWN FINDING and it changed the predicate's
spelling.** The kernel's pairwise atomic check RETURNS EARLY when two boundaries share exactly one
endpoint — that is what an abutment looks like — so a collinear overlap sharing an endpoint passes
it and is refused further on by a DIFFERENT message, the angular tie. The endpoint-on-interior arm
is therefore tested with STRICT interiority rather than the kernel's inclusive `onSegment`, which
is the only spelling that also cuts this class. The compiled draft carried three witness classes;
this is the fourth, and A4 pins it with its own positive control.

## 5. Verified tree contract

| Role | File | Symbol | Verified fact at this base | Required use |
|---|---|---|---|---|
| The kernel this member feeds | `src/domain/townMap/fabric/dcelEmbedding.js` | `derivePlanarDcelEmbedding` | requires unique digest-id boundaries, canonical direction, a single `{kind:'PLANAR_SURFACE', leafIndex: 0}` support, and atomic noding enforced by an exact BigInt pairwise check | ⛔ **NOT EDITED.** The acceptance battery imports it as the reader half |
| ⛔ The sweep-plant anchor | `scripts/mutation-sweep.sh` | entry 28a | plants on the kernel's exported signature line at column zero | not touched by this member |
| The float estimate consumed | `src/domain/townMap/fabric/exactGeometry.js` | `segIntersect` | float intersection point, snapped before publication | the split-point ESTIMATE only. ⛔ `properCross` is NOT the cut predicate |
| The integer wall | `src/domain/townMap/fabric/foundation.js` | `requireCanonicalInt`, `requireCanonicalId`, `requireCanonicalRecord`, `FABRIC_COORDINATE_ABI` | defaults `±MAX_WORLD_UNITS` (MF-T2B) | the noder's input refusals and its post-snap re-validation |
| The id digest | `src/domain/townScene/stableScene.js` | `sceneDigest` | the codex jig's own `boundaryId` shape | adopted verbatim; the produced id measures 60 characters and satisfies `requireCanonicalId` |
| The untouched jig | `src/domain/townMap/fabric/boundaryArrangement.js` | `compileOrthogonalCrossCadastralArrangement` | digest-pinned by `tests/domain/townMapBoundaryArrangement.test.js` | ⛔ **forbidden file** — zero bytes move |
| The standing law | `tests/lint/townMapFabricSingleDeclaration.walker.test.js` | the fabric single-declaration law | green; the arriving export names collide with nothing | binds the two arriving exports |
| Census | `tests/lint/sovereigntyLightingContract.walker.test.js` | `const CENSUS = Object.freeze({` | the five-figure tuple, SEQUENCED | re-recorded all five together with cause + authorization |
| Test precedent | `tests/domain/townMapCoordinateAbi.test.js` + `tests/property/townMapCoordinateAbiDeterminism.test.js` | MF-T2B's two-file proof shape | the domain-matrix + determinism-companion form | copied |
| Anchor helper | `tests/helpers/anchoredNegatives.js` | `expectAbsentWithAnchor`, `expectPresentThenAbsent` | the negative-assertion route | available; this member's absences are structurally anchored and carry inline reasons |

**Forbidden alternatives:** no edit to any existing production file; no second noder, no second
crossing predicate spelling exported, no rational-arithmetic split points; no `artifactKind` or
`schemaVersion` on the published record; no barrel edit; no `export *`; no import of the sealed
sandbox tree from any app file, ever; no `test.each`, no `describe.runIf`, no loop-generated
tests; no files outside the manifest.

## 6. Exact contracts

### The noder — `nodeBoundarySegments(input)`

```js
export const ARRANGEMENT_QUANTUM_LADDER = Object.freeze([1000, 5000, 25000]);
// ^ ported VERBATIM; owner tuning surface (ODQ §310.3(9)); pinned by equality in A8; no rung is
//   chosen here and no override door exists.

export function nodeBoundarySegments(input)
// input : { settlementId, segments: [{ a: [xQ, zQ], b: [xQ, zQ], role, sourceId }] }
//         coordinates are ABI integer quanta validated through requireCanonicalInt; role and
//         sourceId are canonical non-empty strings; a zero-length segment AFTER snapping is
//         dropped, never an error.
// returns (frozen, in-memory — nothing persisted, nothing sealed):
{
  coordinateAbiVersion,            // FABRIC_COORDINATE_ABI, read never moved
  settlementId,
  boundaries: [{                   // the codex ROW shape, kernel-admissible verbatim:
    boundaryId,                    //   `cadastral-boundary:${sceneDigest({coordinateAbiVersion,
                                   //     settlementId, geometry})}`
    role, sourceId,                //   pass-through lineage (first occurrence wins at dedupe)
    support: { kind: 'PLANAR_SURFACE', leafIndex: 0 },
    geometry: [a, b],              //   canonical direction: comparePoint(a, b) < 0
  }],                              // sorted by boundaryId (codepoint)
  rawSegmentCount, arrangementQuantum, arrangementQuantumLadder,
  nodingPasses, residualProperCrossings, splitCount, duplicatesDropped,
}
```

### The algorithm (bounded; the port with its named divergence)

```text
1. LADDER WALK (ported verbatim): run the noding pass at the FINEST rung; if its residual is not
   zero, walk the remaining rungs and take the FIRST reaching zero; if none does, the FINEST
   attempt is kept and its residual is published honestly.
2. NODING PASS at rung q (ported shape; pass cap 14, internal, verbatim):
   a. snap BOTH endpoints of every segment to the rung grid; drop zero-length; re-validate every
      snapped coordinate through requireCanonicalInt (DEFENSIVE — see §13 RAISED-5).
   b. bucket segments on the uniform grid (gridCell = mean manhattan extent, ported).
   c. for each bucket pair, decide with THE KERNEL'S OWN ADMISSION PREDICATE, EXACT:
      · orientation signs in BigInt (§1.3);
      · a PROPER crossing is strict interior by four sign tests, no epsilon band → split both
        segments at the snapped float-estimate intersection; a null estimate leaves the pair
        counted in the residual;
      · an ENDPOINT-ON-INTERIOR touch (exact collinearity + STRICT betweenness) cuts the
        run-through segment at that endpoint — the arm that nodes T-junctions, decomposes
        collinear overlaps into runs the dedupe then collapses, AND cures the shared-endpoint
        overlap the kernel's atomic check waves through (§4.2 NEW).
   d. apply cuts ordered along each segment's dominant axis (ported); loop until no cuts or cap.
3. DEDUPE by unordered endpoint pair (ported): first occurrence wins; duplicatesDropped counts.
4. CANONICALIZE: endpoint order per row, digest boundaryId, support stamp, codepoint sort. Freeze.
```

### Absence and refusal rules

- non-record input, missing `settlementId`, mis-shaped segment, non-integer or out-of-wall
  coordinate, empty `role`/`sourceId`: **typed TypeError through the landed validators**, naming
  the offending label — never `NaN`, never a silent skip. All eight executed at §9 A6.
- `segments: []`: returns the record with `boundaries: []`, `residualProperCrossings: 0`, no throw.
- a segment zero-length after snapping: dropped; visible as `rawSegmentCount` minus rows.
- a pair the passes cannot node at any rung: kept, counted, published — the kernel remains the
  fail-closed judge of such output.

### Determinism

- Pure over its arguments; integer and BigInt arithmetic plus the float split ESTIMATE that is
  snapped before publication; no clock, no randomness, no locale ordering (the determinism
  companion scans the leaf's raw text with a positive control).
- Output identity is input-order-free EXCEPT the deduped survivor's `role`/`sourceId` (first
  occurrence wins — the ported rule, asserted at A4). Ids are geometry digests, so re-noding the
  same geometry reproduces the same ids (A5's fixed point) and the reversed input publishes the
  same id list (A7).
- No BigInt reaches the published record; the whole record serialises (A7).

### Flag, dormancy, lifecycle, receipts

- Flag: `NONE`. Golden posture: **unchanged and PROVEN unchanged** — the untouched-pin control
  plus the post-build fence and forensic zoom.
- Lifecycle: pure derivation, in-memory; ⛔ nothing persisted, so no reload/regen/undo/migration
  seam exists to declare.
- Receipts/privacy: closed kinds `NONE`; DM-only fields `NONE`.
- Alignment: `DECLARED EMPTY: a geometry noder has no alignment surface.`
- Edit story: `ENGINE-ONLY: pure derivation; nothing is DM-editable and nothing is proposed.`

## 7. Exact change manifest

| Action | File | Symbol/region | Measured delta | Coding instruction |
|---|---|---|---:|---|
| `CREATE` | `src/domain/townMap/fabric/boundaryNoder.js` | `ARRANGEMENT_QUANTUM_LADDER`, `nodeBoundarySegments`, internal helpers | **201 eff** | The §6 contract, ported against `fabricDcel.js` at the header SHA. Imports ONLY: `sceneDigest`, `segIntersect`, `compareCodepoint`, and the foundation validators + `FABRIC_COORDINATE_ABI` |
| `CREATE` | `tests/domain/townMapBoundaryNoder.test.js` | `describe('MF-T2D boundary noder')`, A1–A6, A8 | `n/a` | ONE literal `describe`, seven straight-line `test()` calls, string-literal titles |
| `CREATE` | `tests/property/townMapBoundaryNoderDeterminism.test.js` | `describe('MF-T2D boundary noder determinism')`, A7 | `n/a` | The replay companion, matching MF-T2B's property-file shape |
| `TEST` | `tests/lint/sovereigntyLightingContract.walker.test.js` | the `CENSUS` object | `+30/−1` | ONE re-record block naming its cause and the `censusAuthorization` refs; all five figures re-derived by placeholder-and-convict |
| `DOC` | `docs/implementation/packets/town-cartography/MF-T2D.md` | this packet | `n/a` | The packet, its status transitions, and its §12 landing record |

Generated artifacts: `NONE`. ⚠ The two acceptance files are `CREATE` rows, not `TEST` rows.
⚠ No `tests/lint/**` file is minted, so §P3b's mutation-coverage row does not attach.
§P4's four-name template is satisfied by its "reason none exists" arm (the MF-T2C precedent): the
noder is directory-internal, the barrel deliberately does not export it, and the registry tests
binding this member are the single-declaration walker and the entry-closure fence.
`retiredSymbols`: **EMPTY** (§334.5).

## 8. Ordered coding sequence — as executed

0. Dispatch and seal; every §4 preflight executed at this base. No mismatch.
1. Golden/dormancy evidence captured BEFORE the first edit: the fabric battery counts, the census
   tuple, both typecheck floors, and the §4.2 witness controls.
2. The leaf implemented per §6 — validation first, then the exact predicate, then the pass and
   ladder machinery, then the row adaptation.
3. The noder DRIVEN and its output PRINTED; every pin in §9 written from that printed output.
4. — (no writer, no lifecycle seam) · 5. — (no production consumer) · 6. — (no registration)
7. Focused verification: the anchor preflight, the independent-oracle arms, the untouched-pin
   control.
8. The removing-power sweep, the census re-record, the post-build dormancy discharge with forensic
   zoom, the wave-end gate, and the completion receipt.

## 9. Acceptance matrix — every figure EXECUTED

| ID | Case | Executed observation | Home |
|---|---|---|---|
| **A1** | A proper crossing is noded and every published row wears the kernel-admissible shape | the two crossing square rings: the tests' own exact oracle finds **2 crossings in the RAW input and 0 in the output**; 12 boundaries, `rawSegmentCount` 8, quantum 1000, passes 2, residual 0, splits 8, duplicates 0; every row's key list is exactly `[boundaryId, role, sourceId, support, geometry]`, ids are `cadastral-boundary:scene-v1-…` and unique 12/12 and codepoint-sorted, direction canonical, coordinates safe integers on the rung grid; the landed kernel EMBEDS `V=10 E=12 F=4 C=1`, `V−E+F = 2 = 1+C`, kinds `{BOUNDED:3, EXTERIOR:1}` | domain |
| **A2** | ⭐⭐ The eps-band crossing the landed float predicate calls not-proper | `properCross` answers `false` at wall scale and `true` on an ordinary fixture-scale crossing — the divergence is the SCALE, asserted as two positives; the tests' exact oracle sees the crossing; the RAW pair fed to the kernel THROWS the atomic message (the positive control); the noder splits it into **3 rows** (its snapped cut merges into a shared endpoint, so only one segment is actually cut), splits 2, residual 0, and the kernel EMBEDS with `V−E+F === 1 + componentCount` | domain |
| **A3** | ⭐ T-junction — an endpoint touching another segment's interior | the oracle finds `{crossings: 0, touches: 1}` in the raw shape and `properCross` answers `false`, so a crossings-only predicate cannot cure it; the RAW shape THROWS the atomic message; the noder cuts the edge (6 rows, splits 2, residual 0), the touch point appears in exactly **3** rows, and the kernel EMBEDS `V=6 E=6 F=2` with Euler holding | domain |
| **A4** | Collinear overlaps, exact duplicates, and the shared-endpoint overlap | the raw overlap THROWS the atomic message; the noder yields exactly the three runs `[[0,0],[1000,0]]`, `[[1000,0],[2000,0]]`, `[[2000,0],[3000,0]]` with `duplicatesDropped === 1` and the kernel embeds. The doubled segment yields ONE row, `duplicatesDropped === 1`, survivor `sourceId === 'first'` and `role === 'wall_face'` — first-occurrence-wins asserted as the ported rule. ⭐ The fourth witness class: the shared-endpoint overlap THROWS `'DCEL vertex has an angular tie'` raw (a DIFFERENT arm from the atomic check), and the noder cures it to two rows the kernel embeds | domain |
| **A5** | Idempotence — re-noding noded output is a fixed point | `splitCount === 0`, `nodingPasses === 1`, `residualProperCrossings === 0`, `duplicatesDropped === 0`, `rawSegmentCount === 12`; the id list and the geometry are identical to A1's | domain |
| **A6** | Refusals — typed, never floats, never silent | a positive control FIRST (the same shape with valid values is accepted); then eight refusals each asserted by its exact message — non-integer and out-of-wall coordinates through the landed wall naming `-9007199254..9007199254`, missing `settlementId`, empty `role`, empty `sourceId`, non-record input, non-array `segments`, mis-shaped segment; plus `TypeError` for three bad coordinate values. The empty list returns the empty record with zero residual and quantum 1000 without throwing, and a sub-rung segment collapses under the snap and is DROPPED (`rawSegmentCount` 2, one surviving row). ⚠ The post-snap wall re-validation is DEFENSIVE — §4.2's P6 shows it unreachable at the finest rung — so NO test claims to reach it and NO mutant targets it (§334.4, §328.1) | domain |
| **A7** | Determinism / replay + purity | six published behaviours replay byte-identically and every published record serialises (proving no BigInt reached the surface, which would have made the replay arm vacuous); pinned answers sit beside the replay; the REVERSED input publishes the same id list; the source scan finds no clock/randomness/locale identifier, with a planted occurrence asserted SEEN first | property |
| **A8** | Correctness at scale + the ported-value pins | a synthetic 20×20 grid (**400** raw crossings by the oracle) plus one long diagonal whose crossings fall OFF the rung grid (**440** raw crossings) nodes to `residualProperCrossings === 0` at the finest rung with **921** boundaries; the independent recount over the output is `{crossings: 0, touches: 0}`; the diagonal's UN-SNAPPED crossing with a grid line is asserted off-grid FIRST, so "every published coordinate is a rung multiple" has something to refute it; the kernel EMBEDS `V=522 F=401` with `V−E+F === 1 + componentCount`; `ARRANGEMENT_QUANTUM_LADDER` deep-equals `[1000, 5000, 25000]` and is frozen. ⛔ NO wall-clock assertion | domain |

**Anchor law (§P3):** A1, A6, A7 and A8 assert absences. The anchor walker's scanned matchers are
`not.toContain`, `not.toMatch` and `not.toHaveProperty`; this member's absences are counters
compared to zero beside an asserted non-zero denominator, or carry `// anchored:` with the reason.
`npx vitest run tests/lint/negativeAssertionAnchor.walker.test.js` is green at this base with the
new files present.

**Census motion — re-derived at this base by placeholder-and-convict:**

```
BEFORE: 2,490 / 364 / 2,126 / 20,669 / 5,778
AFTER:  2,492 / 364 / 2,128 / 20,677 / 5,780
DELTA:  +2 files · +0 parked · +2 credited · +8 titles (7 domain + 1 property) · +2 suites
```

⛔ `parked` stays at its recorded value. ⚠ **NAMED INTERIOR RED:** the census arm is an exact
equality against a recorded constant, so this member reds at its own implementation commit until
the tuple is re-recorded; the census is SEQUENCED, so the `files` red is itself proof the later
figures had not yet been read.

## 10. Verification commands — as run

```sh
npx vitest run tests/lint/negativeAssertionAnchor.walker.test.js
npx eslint src/domain/townMap/fabric/boundaryNoder.js \
           tests/domain/townMapBoundaryNoder.test.js \
           tests/property/townMapBoundaryNoderDeterminism.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict
npx vitest run tests/domain/townMapBoundaryNoder.test.js \
               tests/property/townMapBoundaryNoderDeterminism.test.js \
               tests/lint/townMapFabricSingleDeclaration.walker.test.js \
               tests/lint/sovereigntyLightingContract.walker.test.js
# the untouched-pin control: the whole fabric-touching battery, before and after
npm run build && VERIFY_DIST=1 npx vitest run tests/build/townMapLazy.test.js
npm run check:packet -- MF-T2D
npm run check:tail
```

⛔⛔ **NEVER wrap `npm run check*` in `gate-mutex.sh --run`** — `test:ratchet` re-acquires and
self-deadlocks; **exit 3 is the mutex giving up, not a red.** ⚠ Trust no exit status not captured
in-shell.

**The removing-power sweep — eight mutants, each planted in the leaf, convicted, and restored by
byte copy verified with `cmp`:**

| mutant | convicted by | first failure |
|---|---|---|
| M1 cut predicate := the landed float `properCross` | A2 | the eps pair rides through: 2 rows where 3 are required |
| M2 endpoint-on-interior arm deleted | A3, A4, A7 | the T-junction yields 5 rows where 6 are required |
| M3 dedupe deleted | A1, A2, A3, A4, A5, A7, A8 | 1 row where 12 are required |
| M4 canonical-direction ordering dropped | A1, A2, A3 | a direction key of 2000 where a negative is required |
| M5 support stamp wrong | A1, A2, A3, A4, A8 | the support record no longer deep-equals the kernel's rule |
| M6 ladder walk keeps the COARSEST attempt | A1, A2, A3, A4, A5, A6, A7, A8 | the published boundary list empties |
| M7 input validation removed (the RE-TARGETED spelling, §334.4) | A6 | an expected throw does not fire |
| M8 split points published UN-SNAPPED | A2, A7, A8 | an off-grid coordinate reaches the published surface |

Pristine-green control before (8/8) and a clean re-run after (8/8), with the leaf `cmp`-verified
byte-identical to its pristine copy at every restore. ⚠ M8's first plant was a NO-OP and was
detected by the sweep's own `cmp` guard rather than being read as a surviving mutant; it was
re-planted and convicted.

## 11. Mandatory STOP conditions

In addition to `PACKET_STANDARD.md` and preamble §P7: any digest pin or pinned roster in the
twelve suites moves, or any fabric-touching test file changes its result between the before and
after captures; any existing production file would need editing; the
`export function derivePlanarDcelEmbedding(input) {` line changes in ANY byte, or
`CURRENT_MAP_TRADITION_ID` becomes imported or declared in any file this member creates; the port
source's or the preamble's hash does not match; any value of `ARRANGEMENT_QUANTUM_LADDER` differs
from the sandbox's published triple, a rung would be added or removed, an override parameter would
be exposed, or the pass cap would move; the eps-band pair does NOT throw through the landed kernel
at the base capture; a published coordinate would leave the ABI wall, or a non-integer would cross
the published surface; the single-declaration walker reds, or an arriving export name collides;
a wall-clock assertion would be needed; the census moves by other than the §9 delta, or `parked`
moves at all; `tests/build/townMapLazy.test.js` reds POST-BUILD, or the forensic zoom finds a
member-unique literal in an entry chunk; another D3a member is simultaneously non-terminal on the
census walker; any ratchet, baseline, budget or ceiling would need raising.

## 12. Completion receipt

- **Status transitions:** DRAFT → READY → LANDED, validator green at each.
- **Leaf:** `src/domain/townMap/fabric/boundaryNoder.js`, **201 effective lines** (eslint's own
  `Linter`, never `wc -l`), under the packet's 210 cap and the layer's 800 ceiling.
- **Existing production files modified: ZERO**, as budgeted.
- **Acceptance:** 8/8 across the two new files.
- **Census:** `2,490/364/2,126/20,669/5,778` → `2,492/364/2,128/20,677/5,780`, every figure
  convicted rather than added — **twice**. The first derivation ran against the pre-WF-1E base
  and produced `…/20,671/…`; WF-1E landed first with `+6` titles of its own, so this lane
  byte-restored the census file from the new base and re-convicted ALL FIVE figures rather than
  adjusting the earlier ones (ODQ §325.2). Four of the five were genuinely unchanged, which is
  precisely what would have made carrying the tuple feel safe.
- **Rebase:** this member was compiled and first verified at `f5332cf7`, then rebased onto
  `3ac279db` after WF-1E landed. The rebase re-applied the three shared meta appends onto the new
  base's byte-restored copies rather than merging conflict hunks, and the census re-record blocks
  stand in landing order: MF-T2C, WF-1E, MF-T2D. WF-1E touched none of this member's substrate —
  `dcelEmbedding.js`, `exactGeometry.js`, `foundation.js`, `stableScene.js`, `deterministicSort.js`
  and `mutation-sweep.sh` are all byte-identical across `f5332cf7..3ac279db`, and the MF-T2A
  sweep-plant anchor line still sits at column zero, verified at the new tip.
- **Typecheck floors:** unchanged at `173/173` and `1,134/1,134` with the leaf present — the new
  leaf adds no type debt to either ratchet.
- **The untouched-pin control:** the fabric-touching battery is byte-for-byte the same result
  before and after, recorded in §4 row 4 and re-run at the terminal.
- **Deferred and recorded, not dropped:** the codex jig's eventual retirement (§312.2c's dual-run
  act); real-leaf noding claims; the role vocabulary left open; `ARRANGEMENT_QUANTUM` (the
  sandbox's second export) deliberately not exported.

## 13. Judgment calls and RAISED

All were reviewed by the chair at ODQ §334; the executed outcome of each is recorded here.

| # | the call | disposition |
|---|---|---|
| **1** | The cut predicate is the kernel's own admission predicate, exact (strict interior, no eps band, plus the endpoint-on-interior arm) rather than the sandbox letter's float `properCross`. | **ADOPTED (§334.2), and the divergence ships DECLARED.** Four executed witness classes; the implemented design cures all four with Euler holding. The sandbox-letter fallback is recorded here, not taken. |
| **2** | The ladder + walk ported verbatim is carried structure, not a rung choice. | **CONFIRMED (§334.3).** A8 pins the triple by equality and its frozenness; no rung is chosen or exposed. |
| **3** | The published record carries no `artifactKind`/`schemaVersion`. | **ADOPTED (§334.4).** A1 pins the exact key list, so a later stamp cannot arrive silently. |
| **4** | No barrel registration; the noder stays directory-internal. | **CONFIRMED (§334.4).** |
| **5** | The post-snap wall re-validation is DEFENSIVE and unpinnable — unreachable at the finest rung. | **KEPT UNPINNED AND UNMUTATED (§334.4, §328.1).** The executed P6 arithmetic lives in the leaf's docblock as its reason. |
| **6** | Real-leaf noding claims are out of scope; the dual-run equivalence gate is where the ported noder meets real leaves. | **CARRIED (§312.2c).** |
| **7** | ⭐ **NEW AT IMPLEMENTATION — the fourth witness class.** The kernel's atomic check returns early on a single shared endpoint, so a shared-endpoint collinear overlap is refused by the angular tie instead. The endpoint-on-interior arm is therefore spelled with STRICT interiority, which is strictly stronger than inverting the atomic check alone. | **DECIDED IN SCOPE and pinned at A4 with its own positive control.** It is the same predicate §334.2 adopted, spelled so it also covers the kernel's second refusal arm; vetoable. |
| **8** | ⭐ **NEW AT IMPLEMENTATION — a correction to the compile receipt.** The compile recorded the eps-band pair's float and exact denominators as EQUAL; compared exactly at this base they differ by `5056` and the float value is past `MAX_SAFE_INTEGER`. | **RECORDED, and the leaf's docblock states the executed figure** rather than the compile's. The refusal mechanism is still the epsilon band; the correction strengthens R-MF-2. Vetoable. |
| **9** | `residualProperCrossings` keeps its ported name under the widened predicate. | **KEPT.** Analysed and documented in the leaf: every endpoint-on-interior violation always plans a cut, so the pairs surviving to a terminating no-cut pass ARE proper crossings; only a pass-cap exhaustion could carry a touch in the figure, and that case is documented. Renaming would diverge from the chair-reviewed §6 contract and from the ported record shape. Vetoable. |
