# Fabric Topology / MF-T1D — canonical reference-only planar DCEL

- **Status:** LANDED
- **Landed commit:** `b020f74352b0bf9b07eeba80bc41b4b5d53796ca`
- **Packet version:** `1`
- **Verified base:** `codex/first-map-vertical-slice` at `063e470e3bc5358781ab5b89a242b74de0d55493`
- **Last revalidated:** `2026-08-20` at `b020f74352b0bf9b07eeba80bc41b4b5d53796ca`
- **Depends on:** MF-T1A at `edf5268d1dcad84f1f69f59191ea14aa02a6cb88`
- **Collision group:** `town-map-canonical-fabric-topology`
- **Commit authority:** LANDED; do not redispatch
- **Baseline posture:** MF-T1A wave-end gate passed with 28,598 tests and the inherited 11-known-failure ceiling; lint held 29 warnings and zero errors; build and 314-route prerender passed; strict dist passed 409/409; terminal governance validates 122 packets with zero READY before this promotion

> This packet landed at the commit above. It is terminal and must not be redispatched.

## 1. Reconciled authority

1. MF-T1A remains the sole owner of boundary points and lines. This packet adds topology only and may copy no coordinate or line.
2. Arrangement hash/schema checks alone are insufficient. The input carries foundation, frontage-subdivision and street-geometry replay witnesses; the compiler must rebuild MF-T1A and require stable byte equality before reading topology.
3. Only `boundaryArrangementRef` persists. Witness refs do not enter the DCEL artifact and no witness geometry participates after replay succeeds.
4. The bounded connected embedding has `V=24`, `E=32`, `H=64`, `F=10`: nine CCW bounded faces and one CW exterior face.
5. Faces remain only `BOUNDED` or `EXTERIOR`. Eight plot-shaped cycles are not yet parcels, and the large bounded cycle is not yet a routable street.
6. One face has one boundary cycle in this packet. Holes, multiple components or multiple cycles per face are STOP conditions, not generalized here.

The implementer does not read other documents to widen this packet.

## 2. Outcome

**Observable result:** one pure compiler replay-validates exact MF-T1A bytes and publishes one deeply frozen, hash-addressed `PLANAR_DCEL` with 24 coordinate-free vertex references, 64 twin half-edges and 10 generic faces.

**Definition of done:** every arrangement boundary yields one exact twin pair; `next`, `previous`, `twin`, vertex and face refs close; all 64 half-edges partition ten cycles of lengths eight times four and twice sixteen; Euler and signed-orientation laws pass without persisted geometry, area or semantic face labels.

In scope:

1. Exact five-field input and non-mutating MF-T1A replay.
2. Transient support-aware endpoint merge and integer CCW ray ordering.
3. Deterministic twin, next, previous, left-face and exterior derivation.
4. Fixed-length IDs, exact references, canonical ordering and one sealed output.
5. Six bounded acceptance cases and no more.

Explicit non-goals:

- copied points/lines/rings, noding, splitting, repair, sweep-line overlay, holes, disconnected components, multiple supports or point location;
- adjacency or dual-graph caches, parcel/frontage ownership, street semantics, routing/access, walls/water, buildings/institutions or the Fabric root;
- persistence, commands, projection, export, UI/workers or arbitrary/non-European morphology.

Record excluded discoveries in the receipt; do not investigate or repair them.

## 3. Hard scope budget

| Limit | Packet budget |
|---|---:|
| Behavior families | `1` |
| New persisted record families | `1` (`PLANAR_DCEL`) |
| Named state writers / feature flags / user surfaces | `0 / 0 / 0` |
| Direct consumers | `0` (the later Fabric root is the first consumer) |
| New logic-bearing production leaves | `2` |
| Existing logic-bearing production files modified | `0` |
| Additional registration-only files | `1` |
| Handwritten files total | `7` |
| New/changed effective production lines | `<=399` |
| `dcelEmbedding.js` / `dcel.js` | `<=230 / <=165` |
| Shared/hot-file delta | `<=12` (census only) |
| Acceptance cases | `6` |

Overrides approved before dispatch: `NONE`. Exceeding a limit is a STOP and split.

## 4. Sealed dispatch and preflight

Run before implementation edits:

```sh
npm run implementation:dispatch -- MF-T1D
```

Expected: exact base/branch, clean non-CREATE targets, absent CREATE targets, live MF-T1A closure symbols and a Git-admin seal. Any mismatch makes the packet stale.

## 5. Verified tree contract

| Role | File | Symbol | Required use |
|---|---|---|---|
| Geometry owner | `src/domain/townMap/fabric/boundaryArrangement.js` | MF-T1A schema/law/compiler | Replay exact arrangement; read all geometry only after equality |
| Canonical primitives | `src/domain/townMap/fabric/foundation.js` | ABI/tradition/ref/ID/record/sealer helpers | Reuse exact identity and output authority |
| Replay producers | foundation, settlementFoundation, frontage and streetGeometry modules | landed MF-W3S1/MF-T1G symbols | Seal transitive source semantics; do not modify |
| Digest authority | `src/domain/townScene/stableScene.js` | `sceneDigest`, `stableSceneStringify` | Fixed IDs and byte equality |
| Stable ordering | `src/domain/deterministicSort.js` | `compareCodepoint` | Canonical member and cycle starts |
| Fixture | `tests/fixtures/townMapSettlementFabricFixtures.js` | `makeSettlementBoundaryArrangement` | Extend the one source chain; never duplicate bytes |
| Regression precedents | MF-W3S1, MF-T1G and MF-T1A tests | exact suite titles | Preserve source pins, purity and authority boundaries |

Forbidden alternatives: no arrangement-only trust, `atan2`, screen-Y turns, insertion-order turns, NSEW-only logic, source-ID suffix IDs, point copy, cycles array, second geometry compiler, graph input or file outside the manifest.

## 6. Exact contracts

```js
compileOrthogonalCrossPlanarDcel({
  artifactId: EntityId,
  foundation: ExactSettlementFoundation,
  frontageSubdivision: ExactSettlementFrontageSubdivision,
  streetGeometry: ExactStreetGeometry,
  boundaryArrangement: ExactCadastralBoundaryArrangement,
}) -> Readonly<{
  artifactKind: 'PLANAR_DCEL',
  artifactId: EntityId,
  schemaVersion: 1,
  lawVersion: 'mf-t1d-orthogonal-cross-planar-dcel-v1',
  coordinateAbiVersion: string,
  mapTraditionId: 'EUROPEAN_FANTASY_BASE',
  settlementId: EntityId,
  effectiveAt: string,
  leafIndex: 0,
  boundaryArrangementRef: ArtifactHashRef,
  embeddingKind: 'XZ_LEFT_FACE_V1',
  outerFaceId: EntityId,
  vertices: readonly VertexQ[24],
  halfEdges: readonly HalfEdgeQ[64],
  faces: readonly FaceQ[10],
  contentHash: ContentHash,
}>

VertexQ = {
  vertexId: EntityId,
  geometryRef: {
    artifactId, contentHash, kind:'BOUNDARY_ENDPOINT', boundaryId, endpointIndex:0|1,
  },
  incidentHalfEdgeId: EntityId,
}

HalfEdgeQ = {
  halfEdgeId: EntityId,
  boundaryRef: { artifactId, contentHash, kind:'BOUNDARY', boundaryId },
  originVertexId: EntityId,
  twinHalfEdgeId: EntityId,
  nextHalfEdgeId: EntityId,
  previousHalfEdgeId: EntityId,
  faceId: EntityId,
}

FaceQ = {
  faceId: EntityId,
  faceKind: 'BOUNDED'|'EXTERIOR',
  boundaryHalfEdgeId: EntityId,
}
```

Input keys are exactly `artifactId`, `foundation`, `frontageSubdivision`, `streetGeometry`, `boundaryArrangement`. Rebuild with `boundaryArrangement.artifactId` and the three witnesses, require stable byte equality, then derive exclusively from the replay-equal arrangement. Root and every member ref repeat the exact arrangement ID/hash.

### Geometry, identity and absence

- Vertices merge transiently by `(support, point)`, but persist no support or point cache. Their `geometryRef` is the codepoint-minimum `(boundaryId,endpointIndex)` occurrence at that vertex.
- Vertex ID is exactly ``dcel-vertex:${sceneDigest({ coordinateAbiVersion, settlementId, support, point })}``, using the transient resolved support and point without persisting either.
- Half-edge ID is exactly ``dcel-half-edge:${sceneDigest({ coordinateAbiVersion, settlementId, boundaryId, endpointIndex })}``, where `endpointIndex` identifies its origin in the source boundary.
- Face ID is exactly ``dcel-face:${sceneDigest({ coordinateAbiVersion, settlementId, halfEdgeIds })}``, where `halfEdgeIds` is that left-face cycle rotated, never reversed, to begin at its codepoint-smallest half-edge ID.
- No ID appends caller-controlled IDs; every ID is at most 96 characters.
- No `point`, `xQ`, `zQ`, `geometry`, `line`, `ring`, `area`, `centroid`, `cycle`, `parcel`, `street`, `route`, `draw` or audience field is representable.
- Create/read is pure in-memory compile and exact resolution only. Persist/reload/regenerate/undo/import/migrate have no writer in this packet; JSON replay remains byte-identical and sources remain unfrozen.

### Embedding and topology law

- Sort outgoing integer rays counterclockwise using half-plane then cross product; equal-direction angular ties refuse.
- For `u -> v`, `next` is the outgoing ray immediately clockwise from `twin` at `v`, retaining the face on the half-edge's left. `previous` is the exact inverse permutation.
- Canonical face traversal starts at its smallest half-edge ID; arrays sort by ID. A face stores that one start ID, not a redundant cycle row.
- Counts are `V24/E32/H64/F10`; degree census is eight degree-two and sixteen degree-three vertices; Euler is `2`.
- Cycle lengths are eight `4` and two `16`. Nine positive CCW cycles are `BOUNDED`; the unique negative CW cycle is `EXTERIOR` and equals `outerFaceId`. Positive doubled area sums to the magnitude of the exterior; no area is persisted.
- A1 alone pins the canonical fixture's sorted doubled-area roster as `[-1620000,162120,162120,165480,165480,175980,175980,193620,193620,225600]`; replay-valid geometry variants need only satisfy the relational orientation and conservation law.

## 7. Exact change manifest

| Action | File | Symbol/region | Maximum delta | Coding instruction |
|---|---|---|---:|---|
| CREATE | `src/domain/townMap/fabric/dcelEmbedding.js` | integer embedding derivation | `230` | Derive coordinate-free vertex/half-edge/face rows from exact boundary bytes |
| CREATE | `src/domain/townMap/fabric/dcel.js` | schema/law/replay/sealer | `165` | Replay MF-T1A, validate exact census and seal once |
| REGISTER | `src/domain/townMap/fabric/index.js` | DCEL export | `+4` | Export only schema/law/compiler |
| MODIFY | `tests/fixtures/townMapSettlementFabricFixtures.js` | DCEL fixture | `+18` | Extend the same source chain |
| CREATE | `tests/domain/townMapPlanarDcel.test.js` | A1-A4/A6 | `n/a` | Pin topology, refs, cycles, refusals and absence |
| CREATE | `tests/property/townMapPlanarDcelDeterminism.test.js` | A5 | `n/a` | Prove replay/source purity and ID closure |
| MODIFY | `tests/lint/sovereigntyLightingContract.walker.test.js` | exact test census | `+12` | Record only exact two-file/six-title/two-suite movement |

Generated artifacts: `NONE`. No other file may be edited.

## 8. Ordered coding sequence

0. Dispatch and seal; stop on any mismatch.
1. Capture MF-T1A and sovereignty pins.
2. Add exactly A1-A6.
3. Implement the private integer embedding and exact replay/sealer.
4. Register exports.
5. Run packet/resume and the whole-tree landing tail.

## 9. Acceptance matrix

| ID | Case | Required observation | Home |
|---|---|---|---|
| A1 | Canonical DCEL | exact fixture V24/E32/H64/F10, degree/cycle/area census, unique ordered IDs and Euler closure | domain |
| A2 | Source/reference closure | exact MF-T1A replay, metadata, root/member refs, endpoint anchors and deep freeze | domain |
| A3 | DCEL laws | boundary/twin bijection; twin involution; next/previous inverse; all 64 rows partition ten cycles | domain |
| A4 | Closed refusal | tampered/mismatched witnesses, coordinated forgery, noncanonical/extra keys, wrong identity and invalid embedding all refuse | domain |
| A5 | Determinism/ID closure | repeat, reversed upstream cells, one replay-valid geometry variant, JSON replay and maximum IDs are byte-safe; all witnesses remain unfrozen | property |
| A6 | Authority absence | arrangement hash and exact keys pinned; no coordinates, geometry, graph/routing, parcel, building, persistence, projection, draw or UI authority | domain |

This table is the entire edge-case budget.

## 10. Verification commands

```sh
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/domain/townMapPlanarDcel.test.js \
  tests/property/townMapPlanarDcelDeterminism.test.js \
  tests/domain/townMapBoundaryArrangement.test.js \
  tests/property/townMapBoundaryArrangementDeterminism.test.js
npx eslint src/domain/townMap/fabric/dcelEmbedding.js src/domain/townMap/fabric/dcel.js \
  src/domain/townMap/fabric/index.js tests/fixtures/townMapSettlementFabricFixtures.js \
  tests/domain/townMapPlanarDcel.test.js tests/property/townMapPlanarDcelDeterminism.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict
npm run validate:packets
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/lint/sovereigntyLightingContract.walker.test.js \
  tests/lint/negativeAssertionAnchor.walker.test.js
npm run check:packet -- MF-T1D
npm run implementation:resume -- MF-T1D
npm run check:tail
```

## 11. Mandatory STOP conditions

Stop on source replay mismatch; any need to copy/add/split/repair geometry; topology other than V24/E32/H64/F10 with one CW exterior and nine CCW bounded cycles; holes, multiple components/cycles/supports, crossings, overlaps, T-junction interiors or angular ties; any graph/Fabric-root/parcel/routing/building/persistence/UI dependency; an eighth path, seventh case, third leaf, leaf or total budget breach, census over `+12`, ratchet raise, unexpected golden movement or non-manifest repair.

## 12. Completion receipt

- Base SHA: `063e470e3bc5358781ab5b89a242b74de0d55493`
- Dispatch bundle and seal identity: MF-T1D sealed session digest `0c068bda3ea2e1d7a40cb8f19e9c44f09f223b5d0fbf91b6d4315651a06047b4`; capsule digest `5ba6a89228148e7169f86f7c9ba3273e712d8b51df3a228cab3a79947c83a785`
- Final commit or working-tree state: `b020f74352b0bf9b07eeba80bc41b4b5d53796ca`; implementation tree clean before terminal governance
- Exact changed files and effective-line deltas: exact seven-path manifest; positive effective production delta `261/399` (`dcelEmbedding.js` `169/230`, `dcel.js` `89/165`, `index.js` `+3/4`); fixture `+15/18`; census effective delta `0/12`
- A1-A6 results: six new acceptance cases pass; focused MF-T1D plus MF-T1A suite `12/12`; independent production and packet audits ended `0 P0 / 0 P1`
- Focused commands, exits, and counts: sealed packet suite `12/12`; sovereignty/negative walkers `42/42`; scoped ESLint and `git diff --check` clean; all exit `0`
- Sealed packet/resume status: `check:packet` and `implementation:resume` passed on the final pre-commit bytes; the exact session fingerprint completed all eight steps
- Both typecheck configurations: full ratchet `173/173`, no regression; domain-strict `1134/1134`, no regression
- Wave-end gate stages: final `npm run check:tail` exit `0`; test ratchet `28,604` tests with the inherited `11` known failures and no new failure; lint `29` warnings/`0` errors; build passed in `30.14s`; prerender wrote `314` routes; strict dist `409/409`. The first tail attempt hit one load-sensitive IA-2 timeout; that test passed alone `1/1`, its full file passed `10/10`, and the untouched whole-tail retry passed.
- Base-versus-wave failure identity diff: `NONE`
- MF-T1A and DCEL byte pins: boundary arrangement `scene-v1-a1cfadea8ca1bba796bfed3e0a1cb671`; canonical DCEL `scene-v1-9e5a1400770196ff6da8be9417138d0d`
- Generated artifacts: `NONE`
- Deviations: `NONE`
- Out-of-scope observations: the reference-only Fabric root, parcel semantics, buildings, persistence, projection and UI remain later bounded packets
- Judgment calls: numeric doubled-area values remain a canonical-fixture pin only; production admits replay-valid W3 geometry variants through the relational one-exterior/nine-bounded conservation law. The unrelated IA-2 timeout was not changed or baselined.
