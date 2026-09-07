# Street Topology / MF-T1N — canonical orthogonal-cross street graph

- **Status:** LANDED
- **Landed commit:** `40b29038d40ce50096e6b3450748ee6318bff285`
- **Packet version:** `1`
- **Verified base:** `codex/first-map-vertical-slice` at `db646aaff2a8cc8cdc5a20bc0a8ae6e3ee7815ca`
- **Last revalidated:** `2026-08-20` at `40b29038d40ce50096e6b3450748ee6318bff285`
- **Depends on:** MF-T1G at `875a0f39a4b18ff4a153c07092550aab1ab28853`
- **Collision group:** `town-map-canonical-fabric-topology`
- **Commit authority:** LANDED; do not redispatch
- **Baseline posture:** MF-T1G wave-end gate passed with 28,586 tests and the inherited 11-known-failure ceiling; lint held 29 warnings and zero errors; build and 314-route prerender passed; strict dist passed 409/409; terminal governance validates 120 packets with zero READY before this promotion

> This packet landed at the commit above. It is terminal and must not be redispatched.

## 1. Reconciled authority

1. MF-T1G solely owns quantized street points and lines for the bounded orthogonal cross.
2. This packet adds semantic incidence only: one junction, four map-extent endpoints, and four undirected edges.
3. Graph rows reuse the geometry junction and segment identities and resolve them through exact ID/hash references; they do not copy coordinates.
4. A degree-one node at the clipped settlement boundary is an `EXTENT_ENDPOINT`, never an inferred dead end, gate, or route terminus.
5. Route cost, directionality, road hierarchy, access rights, cadastral arrangement, DCEL, and the Fabric root remain later authorities.

The implementer does not read other documents to widen this packet.

## 2. Outcome

**Observable result:** one pure compiler converts exact `STREET_GEOMETRY` into a hash-addressed, deeply frozen undirected-incidence `STREET_GRAPH` containing five nodes and four edges with complete geometry lineage and no coordinate copies.

**Definition of done:** the canonical fixture has one degree-four junction, four degree-one extent endpoints, four undirected edges over exactly two source street IDs, and a bijection from every graph edge/endpoint to one geometry segment/endpoint.

In scope:

1. Inherit settlement, effective time, tradition, leaf, and ABI from one validated geometry artifact.
2. Reuse `junction.junctionId` as the central graph node ID and every `segment.segmentId` as its graph edge ID.
3. Mint one length-safe `${settlementId}:street-node:${direction.toLowerCase()}` node per segment and bind it to endpoint index `1`; never append to a possibly maximum-length source ID.
4. Store exact geometry artifact ID/hash in the root and every nested geometry reference.
5. Refuse tampered, wrong-version, wrong-ABI, incomplete, duplicated, disconnected, malformed, or extra-key inputs before sealing.

Explicit non-goals:

- copied points/lines, adjacency or degree caches, route search, traversal weights, directionality, gate/dead-end claims, street class/rank/name inference, or access policy;
- boundary arrangement, DCEL, parcels, frontage mutation, buildings/institutions, rendering, hit regions, export, persistence/store cutover, UI/workers, or commands;
- arbitrary street graphs, diagonals, curves, roundabouts, cul-de-sacs, multiple junctions/leaves, walls, water, bridges, or non-European morphology packs.

Record excluded discoveries in the receipt; do not investigate or repair them.

## 3. Hard scope budget

| Limit | Packet budget |
|---|---:|
| Behavior families | `1` |
| New persisted record families | `1` (`STREET_GRAPH`) |
| Named state writers / feature flags / user surfaces | `0 / 0 / 0` |
| Direct consumers | `0` (the later Fabric root is the first consumer) |
| New logic-bearing production leaves | `1` |
| Existing logic-bearing production files modified | `0` |
| Additional registration-only files | `1` |
| Handwritten files total | `6` |
| New/changed effective production lines | `<=224` |
| Effective lines in the new leaf | `<=220` |
| Shared/hot-file delta | `<=12` (census only) |
| Acceptance cases | `6` |

Overrides approved before dispatch: `NONE`. Exceeding a limit is a STOP and split.

## 4. Sealed dispatch and preflight

Run before implementation edits:

```sh
npm run implementation:dispatch -- MF-T1N
```

Expected: exact base/branch, clean non-CREATE targets, absent CREATE targets, live required symbols, and a Git-admin seal. Any mismatch makes the packet stale.

## 5. Verified tree contract

| Role | File | Symbol | Required use |
|---|---|---|---|
| Geometry owner | `src/domain/townMap/fabric/streetGeometry.js` | `STREET_GEOMETRY_SCHEMA_VERSION`, `STREET_GEOMETRY_LAW_VERSION`, `compileOrthogonalCrossStreetGeometry` | Require exact source kind/version/law and preserve its identities |
| Cross-row producer | `src/domain/townMap/fabric/settlementFoundation.js` | `ORTHOGONAL_CROSS_PLAN_KIND`, `prepareOrthogonalCrossPlan`, `deriveOrthogonalCrossRows` | Seal the transitive fixture geometry producer; do not modify |
| Canonical primitives | `src/domain/townMap/fabric/foundation.js` | `canonicalArtifactRef`, `requireCanonicalId`, `requireCanonicalRecord`, `sealCanonicalArtifact`, `FABRIC_COORDINATE_ABI` | Reuse; do not invent a second hash/ID/ABI law |
| Digest authority | `src/domain/townScene/stableScene.js` | `sceneDigest` | Validate source without freezing caller-owned replay bytes |
| Stable ordering | `src/domain/deterministicSort.js` | `compareCodepoint` | Canonically order node and edge rows |
| Fixture | `tests/fixtures/townMapSettlementFabricFixtures.js` | `makeSettlementStreetGeometry` | Extend; do not duplicate cross bytes |
| Regression precedent | `tests/domain/townMapStreetGeometry.test.js` | `MF-T1G canonical orthogonal-cross street geometry` | Preserve exact geometry identity and absence law |
| Replay precedent | `tests/property/townMapStreetGeometryDeterminism.test.js` | `MF-T1G street geometry determinism` | Copy proof shape |

Forbidden alternatives: no second geometry compiler/sealer, copied point/line arrays, generic graph algorithm, adjacency cache, route engine, DCEL, parcel registry, coordinate ABI, random stream, or file outside the manifest.

## 6. Exact contracts

```js
compileOrthogonalCrossStreetGraph({
  artifactId: EntityId,
  streetGeometry: ExactStreetGeometry,
}) -> Readonly<{
  artifactKind: 'STREET_GRAPH',
  artifactId: EntityId,
  schemaVersion: 1,
  lawVersion: 'mf-t1n-orthogonal-cross-street-graph-v1',
  coordinateAbiVersion: string,
  mapTraditionId: 'EUROPEAN_FANTASY_BASE',
  settlementId: EntityId,
  effectiveAt: string,
  leafIndex: 0,
  streetGeometryRef: ArtifactHashRef,
  graphKind: 'UNDIRECTED_INCIDENCE',
  nodes: readonly StreetGraphNode[5],
  edges: readonly StreetGraphEdge[4],
  contentHash: ContentHash,
}>

StreetGraphNode = {
  nodeId: EntityId,
  role: 'JUNCTION' | 'EXTENT_ENDPOINT',
  geometryRef:
    | { artifactId, contentHash, kind: 'JUNCTION', junctionId }
    | { artifactId, contentHash, kind: 'SEGMENT_ENDPOINT', segmentId, endpointIndex: 1 },
}

StreetGraphEdge = {
  edgeId: EntityId, // byte-equal to the source segmentId
  sourceStreetId: EntityId,
  endpointNodeIds: readonly [junctionId, boundaryPortId],
  geometryRef: { artifactId, contentHash, kind: 'SEGMENT', segmentId },
}
```

Input keys are exactly `artifactId` and `streetGeometry`; there is no second settlement/time/ABI authority. Root, nodes, edges, references, and member keys are closed.

### Lifecycle and absence

- Missing, extra, null, wrong-kind/version/law/ABI, tampered, malformed, incomplete, or duplicated input throws `TypeError`; no artifact is published.
- Create/read: pure in-memory compile and exact resolution only.
- Persist/reload/regenerate/undo/import/migrate: no writer in this packet; canonical JSON replay reproduces equal bytes/hash without freezing the source.
- Public veil: graph has no audience, custom package, style, label, or DM field.

### Ordering and incidence

- Nodes and edges sort by codepoint ID.
- Every source segment starts at the exact geometry junction, has endpoint index `1`, and maps to exactly one edge and one extent endpoint.
- Junction and segment IDs equal the landed settlement/direction formulas; each line moves only on its named axis and sign; `HIGH_X/LOW_X` share one source street while `HIGH_Z/LOW_Z` share a second distinct source street.
- The central junction has derived degree four; each extent endpoint has derived degree one. Degree/adjacency is tested, never persisted.
- `endpointNodeIds` preserves geometry endpoint order but asserts no one-way travel.

## 7. Exact change manifest

| Action | File | Symbol/region | Maximum delta | Coding instruction |
|---|---|---|---:|---|
| CREATE | `src/domain/townMap/fabric/streetGraph.js` | law constant and compiler | `220` | Validate exact geometry and seal reference-only five-node/four-edge incidence |
| REGISTER | `src/domain/townMap/fabric/index.js` | street-graph export | `+4` | Export only the new compiler/schema/law |
| MODIFY | `tests/fixtures/townMapSettlementFabricFixtures.js` | graph fixture | `+18` | Reuse `makeSettlementStreetGeometry` and add only the graph artifact ID |
| CREATE | `tests/domain/townMapStreetGraph.test.js` | A1-A4/A6 | `n/a` | Prove graph identity, incidence, references, refusals, and absence |
| CREATE | `tests/property/townMapStreetGraphDeterminism.test.js` | A5 | `n/a` | Prove repeat/upstream-reorder/replay stability and source purity |
| MODIFY | `tests/lint/sovereigntyLightingContract.walker.test.js` | exact test census | `+12` | Record only exact two-file/six-title/two-suite movement |

Generated artifacts: `NONE`. No other file may be edited.

## 8. Ordered coding sequence

0. Dispatch and seal; stop on any mismatch.
1. Capture the MF-T1G geometry hash and sovereignty census.
2. Add exactly A1-A6.
3. Implement non-mutating source validation and the reference-only graph compiler.
4. Register exports.
5. Run packet/resume and the whole-tree landing tail.

## 9. Acceptance matrix

| ID | Case | Required observation | Home |
|---|---|---|---|
| A1 | Canonical graph | five unique nodes, four unique edges, two source streets, canonical row order | domain |
| A2 | Identity closure | exact source ref and metadata; every member ref repeats exact geometry ID/hash; deep frozen | domain |
| A3 | Incidence closure | junction degree four; extent endpoints degree one; segment-to-edge-to-endpoint bijection; no stored cache | domain |
| A4 | Closed refusal | tamper/wrong identity, missing/duplicate direction, wrong axis/sign or street pairing, bad junction incidence, wrong shape, and extra key all refuse | domain |
| A5 | Determinism/ID closure | repeat, reversed upstream cells, JSON replay, and one maximum-valid settlement ID remain byte/ID safe; replay source stays unfrozen | property |
| A6 | Regression/absence | MF-T1G hash pinned; exact output/member keys; no coordinates, routing, DCEL, parcel, access, or draw authority | domain |

This table is the entire edge-case budget.

## 10. Verification commands

```sh
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/domain/townMapStreetGraph.test.js \
  tests/property/townMapStreetGraphDeterminism.test.js \
  tests/domain/townMapStreetGeometry.test.js \
  tests/property/townMapStreetGeometryDeterminism.test.js
npx eslint src/domain/townMap/fabric/streetGraph.js src/domain/townMap/fabric/index.js \
  tests/fixtures/townMapSettlementFabricFixtures.js tests/domain/townMapStreetGraph.test.js \
  tests/property/townMapStreetGraphDeterminism.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict
npm run validate:packets
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/lint/sovereigntyLightingContract.walker.test.js \
  tests/lint/negativeAssertionAnchor.walker.test.js
npm run check:packet -- MF-T1N
npm run implementation:resume -- MF-T1N
npm run check:tail
```

## 11. Mandatory STOP conditions

Stop if the base/seal/cleanliness differs; copied coordinates, a second settlement identity, routing/access semantics, a generic graph algorithm, a second record family, any file outside the manifest, a ratchet raise, or a seventh acceptance case is required. Do not repair adjacent failures.

## 12. Completion receipt

- Base SHA: `db646aaff2a8cc8cdc5a20bc0a8ae6e3ee7815ca`
- Dispatch bundle and seal identity: MF-T1N sealed session digest `d3c6420aeff1a5adda9e63069869a0adfa45a213728ee074c27a56948f1defcf`; capsule digest `ca063aca648a44417895733a968d897d87b7a683dacfd31fbbdd21ed0014b20e`
- Final commit or working-tree state: `40b29038d40ce50096e6b3450748ee6318bff285`; implementation tree clean before terminal governance
- Exact changed files and effective-line deltas: exact six-path manifest; positive effective production delta `177/224` (`streetGraph.js` `173/220`, `index.js` `+4/4`); census effective delta `0/12`
- A1-A6 results: six new acceptance cases pass; focused packet plus MF-T1G regressions `12/12`; independent bounded audit `0 P0 / 0 P1`
- Focused commands, exits, and counts: packet/regression suite `12/12`; sovereignty/negative walkers `42/42`; scoped ESLint and `git diff --check` clean; all exit `0`
- Sealed packet/resume status: `check:packet` and `implementation:resume` passed on the final pre-commit bytes; the exact session fingerprint was reused without rerun drift
- Both typecheck configurations: full ratchet `173/173`, no regression; domain-strict `1134/1134`, no regression
- Wave-end gate stages: `npm run check:tail` exit `0`; test ratchet `28,592` tests with the inherited `11` known failures and no new failure; lint `29` warnings/`0` errors; build passed; prerender wrote `314` routes; strict dist `409/409`
- Base-versus-wave failure identity diff: `NONE`
- MF-T1G byte pin: street geometry `scene-v1-3c720d7ef19b040779a7fb82feb85011`; canonical street graph `scene-v1-18be7a3de95499aca1ca2a094c6d0e1e`
- Generated artifacts: `NONE`
- Deviations: `NONE`
- Out-of-scope observations: cadastral boundary arrangement, DCEL, reference-only Fabric root, routing, parcels, buildings, persistence, and UI remain later bounded packets
- Judgment calls: `EXTENT_ENDPOINT` semantics remain inherited from the exact MF-T1G law/hash reference; this incidence-only packet validates exact foundation-ref shape but does not re-import foundation geometry; replay validation preserves caller-owned source mutability
