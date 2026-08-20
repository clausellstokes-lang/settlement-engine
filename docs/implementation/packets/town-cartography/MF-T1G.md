# Street Topology / MF-T1G — canonical orthogonal-cross street geometry

- **Status:** LANDED
- **Landed commit:** `875a0f39a4b18ff4a153c07092550aab1ab28853`
- **Packet version:** `1`
- **Verified base:** `codex/first-map-vertical-slice` at `adc6894964c3dc90dfa3aa1edfce898fdbf78871`
- **Last revalidated:** `2026-08-20` at `875a0f39a4b18ff4a153c07092550aab1ab28853`
- **Depends on:** MF-W3S1 at `a227c1d5ed233509101bbcd90bbab77a787de419`
- **Collision group:** `town-map-canonical-fabric-topology`
- **Commit authority:** LANDED; do not redispatch
- **Baseline posture:** MF-W3S1 wave-end gate passed with 28,580 tests and the inherited 11-known-failure ceiling; strict dist passed 409/409; lint held 29 warnings and zero errors; terminal governance validated 119 packets with zero READY before this promotion

> This packet landed at the commit above. It is terminal and must not be redispatched.

## 1. Reconciled authority

1. The owner requires the sealed fabric and frontage/W3 foundation to become a real mapmaking substrate before buildings, projection, editing, or UI expansion.
2. The core-first boundary admits only the landed `ORTHOGONAL_CROSS_V1` European-fantasy surface settlement.
3. MF-W3S1 owns corridor polygons and source street IDs; this packet derives one new centerline-geometry artifact without copying parcel, frontage, or building authority.
4. The packet standard permits one persisted record family, so street graph, cadastral arrangement, DCEL, and the Fabric root follow as separate packets.

Resolved contradictions:

- "Implement the Fabric topology" is sequenced into authority-preserving artifacts; this packet owns only `STREET_GEOMETRY`.
- Corridor polygons remain foundation truth. Centerlines are deterministic derived geometry, never a second corridor boundary.
- The current coordinate ABI remains the exact version string inherited from the source foundation; no dummy ABI, law-manifest, or provenance artifact is fabricated.

The implementer does not read other documents to widen this packet.

## 2. Outcome

**Observable result:** one pure compiler converts a sealed schema-v2 orthogonal-cross foundation into a hash-addressed, deeply frozen `STREET_GEOMETRY` artifact containing one quantized junction and four exact centerline legs.

**Definition of done:** the canonical settlement yields four positive segments over exactly two source corridors; every segment begins at the shared junction and ends on the ground boundary; source identity, settlement, time, tradition, leaf, ABI, law, and content hash are exact and deterministic.

In scope:

1. Identify the one full-height vertical corridor and one full-width horizontal corridor already owned by the foundation.
2. Quantize each corridor midpoint with `floor((minQ + maxQ) / 2)` and publish directions `LOW_X | HIGH_X | LOW_Z | HIGH_Z` in codepoint-stable ID order.
3. Bind every segment to its exact source `streetId` and the artifact to the exact source foundation ID/hash.
4. Refuse tampered, legacy, non-cross, mismatched, ambiguous, collapsed, or non-surface inputs before sealing.

Explicit non-goals:

- semantic graph nodes/edges, routing, road class, names, hierarchy, traversal cost, DCEL, cadastral boundaries, parcel mutation, or a Fabric root;
- diagonals, curves, roundabouts, cul-de-sacs, arbitrary street graphs, walls, water, bridges, terrain, multiple leaves, or topology editing;
- buildings, institutions, projection, hit regions, export, persistence/store migration, UI/worker cutover, commands, or feature flags;
- culture/tier/wealth reads, morphology inference, evidence activation, research packs, or non-European map-tradition packs.

Record an excluded discovery in the receipt; do not investigate or repair it.

## 3. Hard scope budget

| Limit | Packet budget |
|---|---:|
| Behavior families | `1` |
| New persisted record families | `1` (`STREET_GEOMETRY`) |
| Named state writers | `0` |
| Feature flags | `0` |
| User-facing surfaces | `0` |
| Direct consumers | `0` (the next street-graph packet is the first consumer) |
| New logic-bearing production leaves | `1` |
| Existing logic-bearing production files modified | `0` |
| Additional registration-only files | `1` |
| Handwritten files total | `6` |
| New/changed effective production lines | `<=240` |
| Effective lines in the new leaf | `<=236` |
| Delta in a shared/hot file | `<=12` (census only) |
| Acceptance cases | `6` |

Overrides approved before dispatch: `NONE`.

Exceeding any limit is a STOP and split.

## 4. Sealed dispatch and preflight

Run before any implementation edit:

```sh
npm run implementation:dispatch -- MF-T1G
```

Expected: exact base/branch, clean non-CREATE targets, absent CREATE targets, live required symbols, and a Git-admin seal. Any mismatch makes the packet stale.

Edit only exact-manifest paths. `check:packet` and `implementation:resume` remain inner-loop evidence; `check:tail` is the landing gate.

## 5. Verified tree contract

| Role | File | Symbol | Verified fact | Required use |
|---|---|---|---|---|
| Geometry authority | `src/domain/townMap/fabric/foundation.js` | `sealFabricFoundation` | Schema-v2 foundation solely owns ground and two corridor rings | Read; never mutate or reseal |
| Canonical hash owner | `src/domain/townMap/fabric/foundation.js` | `sealCanonicalArtifact` | Deep-freezes deterministic artifact bytes | Reuse exactly |
| Exact source ref | `src/domain/townMap/fabric/foundation.js` | `canonicalArtifactRef` | Produces ID/hash refs | Reuse exactly |
| Rectangle validator | `src/domain/townMap/fabric/foundation.js` | `canonicalRectBounds` | Enforces positive canonical quantized rectangles | Reuse exactly |
| Closed source law | `src/domain/townMap/fabric/foundation.js` | `SETTLEMENT_FABRIC_FOUNDATION_LAW_VERSION` | Names the only admitted source foundation | Require exact equality |
| Cross grammar | `src/domain/townMap/fabric/settlementFoundation.js` | `ORTHOGONAL_CROSS_PLAN_KIND`, `prepareOrthogonalCrossPlan`, `deriveOrthogonalCrossRows` | Owns the only admitted plan and corridor-row derivation | Seal as transitive geometry authority; do not modify |
| Digest authority | `src/domain/townScene/stableScene.js` | `sceneDigest` | Owns canonical content fingerprints used by `sealCanonicalArtifact` | Seal as transitive identity authority; do not modify |
| Stable ordering | `src/domain/deterministicSort.js` | `compareCodepoint` | Owns codepoint-stable row ordering | Reuse exactly |
| Fixture | `tests/fixtures/townMapSettlementFabricFixtures.js` | `makeSettlementFoundation` | Builds the landed canonical cross | Extend; do not duplicate plan bytes |
| Regression precedent | `tests/domain/townMapSettlementFabric.test.js` | `MF-W3S1 orthogonal-cross settlement fabric` | Pins conservation, lineage and legacy bytes | Preserve |
| Determinism precedent | `tests/property/townMapSettlementFabricDeterminism.test.js` | `MF-W3S1 settlement fabric determinism` | Pins reorder/replay stability | Copy proof shape |

Forbidden alternatives:

- no second foundation/corridor sealer, street graph, DCEL, route graph, parcel registry, coordinate system, PRNG stream, or renderer geometry;
- no writes to `townCartography/**`, map documents, TownScene, stores, workers, UI, corpus, spec, or evidence files;
- no files outside the manifest.

## 6. Exact contracts

### Input and output

```js
compileOrthogonalCrossStreetGeometry({
  artifactId: EntityId,
  settlementId: EntityId,
  foundation: SealedSchema2OrthogonalCrossFoundation,
}) -> Readonly<{
  artifactKind: 'STREET_GEOMETRY',
  artifactId: EntityId,
  schemaVersion: 1,
  lawVersion: 'mf-t1g-orthogonal-cross-street-geometry-v1',
  coordinateAbiVersion: string,
  mapTraditionId: 'EUROPEAN_FANTASY_BASE',
  settlementId: EntityId,
  effectiveAt: string,
  leafIndex: 0,
  foundationRef: { artifactId: EntityId, contentHash: ContentHash },
  midpointRounding: 'FLOOR_Q',
  junction: { junctionId: EntityId, point: [number, number] },
  segments: readonly [StreetGeometrySegment, StreetGeometrySegment,
                      StreetGeometrySegment, StreetGeometrySegment],
  contentHash: ContentHash,
}>

StreetGeometrySegment = {
  segmentId: EntityId,
  sourceStreetId: EntityId,
  direction: 'LOW_X' | 'HIGH_X' | 'LOW_Z' | 'HIGH_Z',
  line: [[junctionXQ, junctionZQ], [boundaryXQ, boundaryZQ]],
}
```

Input keys are exactly `artifactId`, `settlementId`, and `foundation`. The compiler recomputes the source foundation hash from all fields except `contentHash` and rejects a mismatch before reading geometry.

### Absence and lifecycle

- Missing, extra, `null`, empty, legacy, non-cross, or tampered input: throw `TypeError`; publish nothing.
- Create/read: pure in-memory artifact compiler and exact ref resolution only.
- Persist/reload/regenerate/undo/import/migrate: no writer or storage cutover in this packet; canonical JSON replay must reproduce equal bytes/hash.
- Public veil: geometry contains no DM-only or custom-package field; audience projection is not yet a consumer.

### Ordering and determinism

- Identify corridor orientation from exact contact with the ground rectangle, never array position or street ID spelling.
- Midpoint law is integer floor of the two quantized band bounds.
- Every line is ordered junction first, ground-boundary endpoint second.
- Segment IDs are `${settlementId}:street-segment:${direction.toLowerCase()}` and rows sort by codepoint ID.
- Junction ID is `${settlementId}:street-junction:cross`.
- No randomness, floating point, culture, tier, institution, evidence, or renderer read is legal.

### Alignment and edit story

- Alignment: `ENGAGED` through exact foundation corridor lineage and source artifact hash.
- Edit story: `ENGINE-ONLY`; later topology/edit packets replace the source foundation through canonical operations, then regenerate this derived artifact.

## 7. Exact change manifest

| Action | File | Symbol/region | Maximum delta | Coding instruction |
|---|---|---|---:|---|
| CREATE | `src/domain/townMap/fabric/streetGeometry.js` | law constant and compiler | `236` | Validate one exact cross and seal four centerline legs with source lineage |
| REGISTER | `src/domain/townMap/fabric/index.js` | street-geometry export | `+4` | Export only the new public compiler/law |
| MODIFY | `tests/fixtures/townMapSettlementFabricFixtures.js` | street-geometry fixture | `+24` | Reuse the landed foundation fixture and add explicit artifact/settlement IDs |
| CREATE | `tests/domain/townMapStreetGeometry.test.js` | A1-A4/A6 | `n/a` | Prove geometry, lineage, floor rounding, refusals, and forbidden reads |
| CREATE | `tests/property/townMapStreetGeometryDeterminism.test.js` | A5 | `n/a` | Prove repeat/reorder/JSON replay stability |
| MODIFY | `tests/lint/sovereigntyLightingContract.walker.test.js` | exact test census | `+12` | Record only the exact file/title/assertion movement |

Generated artifacts: `NONE`.

No other file may be edited.

## 8. Ordered coding sequence

0. Dispatch and seal; stop on any preflight mismatch.
1. Capture MF-W3S1 foundation/subdivision byte pins and the exact sovereignty census.
2. Add the six bounded acceptance cases.
3. Implement the pure street-geometry compiler and source-hash validation.
4. Register its exports.
5. Run focused verification, packet receipt/resume, and the wave-end gate.

Bounded algorithm:

```text
1. Validate the exact schema-v2 cross foundation and its content hash.
2. Classify exactly one full-height and one full-width corridor against ground.
3. Floor each band midpoint; form one junction inside their intersection.
4. Emit four positive junction-to-boundary segments with exact street lineage.
5. Sort by segment ID and seal once as STREET_GEOMETRY.
```

## 9. Acceptance matrix

| ID | Case | Fixture/input | Required observation | Test home |
|---|---|---|---|---|
| A1 | Canonical cross | landed settlement foundation | one junction, four positive legs, two source streets, exact directions/endpoints | domain |
| A2 | Identity closure | canonical artifact | exact source ID/hash, settlement/time/tradition/leaf/ABI/law; deep frozen | domain |
| A3 | Quantization | admitted odd-width/odd-sum bands | junction uses declared `FLOOR_Q`, all coordinates remain integers | domain |
| A4 | Closed refusal | legacy/tampered/non-cross/wrong-shape/extra-key cases | every case throws before sealing | domain |
| A5 | Determinism | repeat, reversed cells, canonical JSON replay | byte-identical artifact and content hash | property |
| A6 | Regression/absence | landed MF-W3S1 pins and output keys | source pins unchanged; no graph, parcel, building, culture, tier, evidence, privacy, style, or draw data | domain |

This table is the entire edge-case budget.

## 10. Verification commands

```sh
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/domain/townMapStreetGeometry.test.js \
  tests/property/townMapStreetGeometryDeterminism.test.js \
  tests/domain/townMapSettlementFabric.test.js \
  tests/property/townMapSettlementFabricDeterminism.test.js
npx eslint \
  src/domain/townMap/fabric/streetGeometry.js \
  src/domain/townMap/fabric/index.js \
  tests/fixtures/townMapSettlementFabricFixtures.js \
  tests/domain/townMapStreetGeometry.test.js \
  tests/property/townMapStreetGeometryDeterminism.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict
npm run validate:packets
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/lint/sovereigntyLightingContract.walker.test.js \
  tests/lint/negativeAssertionAnchor.walker.test.js
npm run check:packet -- MF-T1G
npm run implementation:resume -- MF-T1G
npm run check:tail
```

## 11. Mandatory STOP conditions

Stop if the base, seal, or target cleanliness differs; more than one persisted family is needed; any corridor requires clipping or graph search; an odd midpoint cannot use the frozen floor law; a fifth segment or third corridor is required; a consumer, storage writer, migration, or file outside the manifest is needed; a ratchet needs raising; or an acceptance case requires widening the matrix.

Do not broaden or repair adjacent failures.

## 12. Completion receipt

- Base SHA: `adc6894964c3dc90dfa3aa1edfce898fdbf78871`
- Dispatch bundle and seal identity: MF-T1G sealed session digest `e8909ac0a9653c9805655e3f33e1327ed15a808dbc3f924c8462666696f11d44`; capsule digest `87b232c8e87985b13c7c0f693ba4890bdc59b88eb289a80f1be1dacd0d0c6a37`
- Final commit or working-tree state: `875a0f39a4b18ff4a153c07092550aab1ab28853`; implementation tree clean
- Exact changed files and effective-line deltas: exact six-path manifest; positive effective production delta `132/240` (`streetGeometry.js` `128/236`, `index.js` `+4/4`); census effective delta `0/12`
- A1-A6 results: six new acceptance cases pass; focused packet plus MF-W3S1 regressions `12/12`; independent bounded audit `0 P0 / 0 P1`
- Focused commands, exits, and counts: packet/regression suite `12/12`; sovereignty/negative walkers `42/42`; ESLint on the packet paths clean; all exit `0`
- Sealed per-step receipt and exact-state resume status: `check:packet` and `implementation:resume` passed on the final pre-commit bytes; the exact session fingerprint was reused without rerun drift
- Both typecheck configurations: full ratchet `173/173`, no regression; domain-strict `1134/1134`, no regression
- Wave-end gate stages actually executed: `npm run check:tail` exit `0`; test ratchet `28,586` tests with the inherited `11` known failures and no new failure; lint `29` warnings/`0` errors; build passed; prerender wrote `314` routes; strict dist `409/409`
- Base-versus-wave failure identity diff: `NONE`
- MF-W3S1 byte pins: settlement foundation `scene-v1-c72afb9994bd6e8c4a6168e56fdc221e`; aggregate subdivision `scene-v1-38ea62d8983609e19e4fe03cb64092af`
- Generated artifacts: `NONE`
- Deviations: `NONE`
- Out-of-scope observations, without investigation: semantic street graph, routing, cadastral arrangement, DCEL, and the reference-only Fabric root remain sequenced as later bounded packets
- Judgment calls: source hash validation uses non-mutating `sceneDigest`; the landed `FABRIC_COORDINATE_ABI` is required exactly after an adversarial hash-correct ABI probe exposed and closed the weaker nonempty-string check
