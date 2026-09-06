# Fabric Topology / MF-T1A — canonical post-W3 cadastral boundary arrangement

- **Status:** LANDED
- **Landed commit:** `edf5268d1dcad84f1f69f59191ea14aa02a6cb88`
- **Packet version:** `1`
- **Verified base:** `codex/first-map-vertical-slice` at `ad2bc28b243a09f29657c43525332f9c32c79636`
- **Last revalidated:** `2026-08-20` at `edf5268d1dcad84f1f69f59191ea14aa02a6cb88`
- **Depends on:** MF-T1N at `40b29038d40ce50096e6b3450748ee6318bff285`
- **Collision group:** `town-map-canonical-fabric-topology`
- **Commit authority:** LANDED; do not redispatch
- **Baseline posture:** MF-T1N wave-end gate passed with 28,592 tests and the inherited 11-known-failure ceiling; lint held 29 warnings and zero errors; build and 314-route prerender passed; strict dist passed 409/409; terminal governance validates 121 packets with zero READY before this promotion

> This packet landed at the commit above. It is terminal and must not be redispatched.

## 1. Reconciled authority

1. The arrangement is the sole owner of boundary linework consumed by the later DCEL. DCEL may derive vertices, half-edges and faces; it may add no geometry.
2. The complete post-W3 line set is finite: 28 unique undirected W3 plot edges plus four support-extent street openings, for `V=24`, `E=32`, one connected component and cycle rank `9`.
3. Omitting the four openings leaves four disconnected block components. Omitting the four shared plot dividers forces a later second geometry owner. Both are refused.
4. `STREET_GRAPH` remains a sibling semantic artifact and is not an input. Exact `STREET_GEOMETRY` supplies settlement/time/tradition/ABI identity only; none of its centerline geometry becomes a cadastral boundary.
5. The four opening caps are clipped support-extent boundaries, not route termini. They remain `REGISTERED_HARD_BLOCK`, never inferred gates or dead ends.
6. Roles stay inside the specification union: `STREET_RIGHT_OF_WAY` or `REGISTERED_HARD_BLOCK`. `SETTLEMENT_EXTENT` and `PARCEL_DIVIDER` are lineage-source kinds, not new roles or parcel records.

The implementer does not read other documents to widen this packet.

## 2. Outcome

**Observable result:** one pure compiler consumes exact foundation, W3 subdivision and street-geometry artifacts and publishes one deeply frozen, hash-addressed `CADASTRAL_BOUNDARY_ARRANGEMENT` containing 32 canonically identified undirected segments with complete source lineage.

**Definition of done:** the canonical fixture has 24 unique vertices, 32 unique boundaries, one component, 12 ROW lines, 20 registered-hard-block lines, 16 extent sources, four shared-divider sources and nine implied bounded cycles; no face, half-edge, parcel, routing or rendering record exists.

In scope:

1. Revalidate source content hashes and exact kind/schema/law/ABI/tradition/leaf joins without freezing caller-owned replay inputs.
2. Rebuild the landed W3 subdivision and street geometry through their sole compilers and require byte equality before reading them.
3. Normalize every plot edge as an undirected integer line, deduplicate exact shared edges and retain the two source edge members for each divider.
4. Add exactly four ground-edge street openings derived from the two admitted cross corridors.
5. Classify and source every line, prove exact counts/connectivity, then seal once.

Explicit non-goals:

- DCEL vertices/half-edges/twins/faces, adjacency, point location, parcel/frontage ownership, route semantics, street rank/access, walls, water, cliffs or multiple supports;
- arbitrary intersections, diagonals beyond the four landed W3 dividers, new subdivision, geometry repair, topology editing or generic planar arrangement algorithms;
- Fabric root, consumers, persistence, projection, buildings/institutions, commands, UI/workers or non-European morphology packs.

Record excluded discoveries in the receipt; do not investigate or repair them.

## 3. Hard scope budget

| Limit | Packet budget |
|---|---:|
| Behavior families | `1` |
| New persisted record families | `1` (`CADASTRAL_BOUNDARY_ARRANGEMENT`) |
| Named state writers / feature flags / user surfaces | `0 / 0 / 0` |
| Direct consumers | `0` (the later DCEL is the first consumer) |
| New logic-bearing production leaves | `1` |
| Existing logic-bearing production files modified | `0` |
| Additional registration-only files | `1` |
| Handwritten files total | `6` |
| New/changed effective production lines | `<=254` |
| Effective lines in the new leaf | `<=250` |
| Shared/hot-file delta | `<=12` (census only) |
| Acceptance cases | `6` |

Overrides approved before dispatch: `NONE`. Exceeding a limit is a STOP and split.

## 4. Sealed dispatch and preflight

Run before implementation edits:

```sh
npm run implementation:dispatch -- MF-T1A
```

Expected: exact base/branch, clean non-CREATE targets, absent CREATE targets, live required symbols, and a Git-admin seal. Any mismatch makes the packet stale.

## 5. Verified tree contract

| Role | File | Symbol | Required use |
|---|---|---|---|
| Foundation owner | `src/domain/townMap/fabric/foundation.js` | schema/law/ABI/tradition constants and canonical validators/sealer | Validate the exact support and seal through one authority |
| Cross producer | `src/domain/townMap/fabric/settlementFoundation.js` | `ORTHOGONAL_CROSS_PLAN_KIND`, `prepareOrthogonalCrossPlan`, `deriveOrthogonalCrossRows` | Seal the transitive fixture producer; do not modify |
| W3 owner | `src/domain/townMap/fabric/frontage.js` | `SETTLEMENT_FRONTAGE_SUBDIVISION_LAW_VERSION`, `subdivideSettlementFrontages` | Rebuild and byte-check exact plot/frontage rows |
| Identity owner | `src/domain/townMap/fabric/streetGeometry.js` | schema/law/compiler | Rebuild and byte-check exact settlement/time/ABI/tradition lineage; do not consume centerlines |
| Digest authority | `src/domain/townScene/stableScene.js` | `sceneDigest`, `stableSceneStringify` | Validate and identify without mutating sources |
| Stable ordering | `src/domain/deterministicSort.js` | `compareCodepoint` | Canonicalize sources and output rows |
| Fixture | `tests/fixtures/townMapSettlementFabricFixtures.js` | `SETTLEMENT_AXES`, `makeSettlementFoundation`, `makeSettlementStreetGeometry` | Extend the one cross fixture; never duplicate source bytes |
| Regression precedents | W3 settlement-fabric and MF-T1G tests | exact suite titles | Preserve source pins and replay laws |

Forbidden alternatives: no graph input, full corridor-ring insertion, second plot/boundary compiler, ordinal IDs, face/parcel publication, generic sweep-line library, new coordinate ABI or file outside the manifest.

## 6. Exact contracts

```js
compileOrthogonalCrossCadastralArrangement({
  artifactId: EntityId,
  foundation: ExactSettlementFoundation,
  frontageSubdivision: ExactSettlementFrontageSubdivision,
  streetGeometry: ExactStreetGeometry,
}) -> Readonly<{
  artifactKind: 'CADASTRAL_BOUNDARY_ARRANGEMENT',
  artifactId: EntityId,
  schemaVersion: 1,
  lawVersion: 'mf-t1a-orthogonal-cross-cadastral-arrangement-v1',
  coordinateAbiVersion: string,
  mapTraditionId: 'EUROPEAN_FANTASY_BASE',
  settlementId: EntityId,
  effectiveAt: string,
  leafIndex: 0,
  foundationRef: ArtifactHashRef,
  frontageSubdivisionRef: ArtifactHashRef,
  streetGeometryRef: ArtifactHashRef,
  arrangementKind: 'ORTHOGONAL_CROSS_POST_W3',
  boundaries: readonly CadastralBoundaryQ[32],
  contentHash: ContentHash,
}>

CadastralBoundaryQ = {
  boundaryId: `cadastral-boundary:${ContentHash}`,
  role: 'STREET_RIGHT_OF_WAY' | 'REGISTERED_HARD_BLOCK',
  support: { kind: 'PLANAR_SURFACE', leafIndex: 0 },
  geometry: readonly [PointQ, PointQ], // canonical undirected endpoint order
  sourceRef: ArtifactHashRef,
  source:
    | { kind: 'STREET_RIGHT_OF_WAY', blockId, streetId, plotEdge:{plotId,edgeIndex} }
    | { kind: 'SETTLEMENT_EXTENT', origin:'PLOT_EDGE', groundSurfaceId, blockId,
        plotEdge:{plotId,edgeIndex} }
    | { kind: 'SETTLEMENT_EXTENT', origin:'GROUND_STREET_OPENING', groundSurfaceId,
        groundEdgeIndex, streetId }
    | { kind: 'PARCEL_DIVIDER', blockId,
        plotEdges:readonly [{plotId,edgeIndex},{plotId,edgeIndex}] },
}
```

Input keys are exactly `artifactId`, `foundation`, `frontageSubdivision`, `streetGeometry`; roots, refs, members and source variants are closed. Boundary identity is:

```js
`cadastral-boundary:${sceneDigest({
  coordinateAbiVersion,
  settlementId,
  geometry: canonicalUndirectedLine,
})}`
```

This fixed-length formula is closed over a maximum-valid settlement ID and makes line identity independent of input row order.

### Lifecycle, absence and privacy

- Missing, extra, null, wrong-kind/version/law/ABI/tradition/leaf, tampered, source-ref-mismatched, malformed, overlapping, gapped, duplicated or disconnected input throws `TypeError`; no artifact is published.
- Create/read: pure in-memory compile and exact resolution only.
- Persist/reload/regenerate/undo/import/migrate: no writer in this packet; canonical JSON replay reproduces equal bytes/hash without freezing any source.
- Public veil: arrangement has no audience, custom-package, label, style or DM field.

### Geometry, ownership and ordering

- Each plot contributes four directed edge occurrences. Exact undirected dedupe yields 28 plot-derived lines; four shared pairs are `PARCEL_DIVIDER` sources.
- Exactly four support-extent openings are added: bottom/top of the vertical corridor and left/right of the horizontal corridor. Full corridor rings are forbidden.
- Plot-derived ROW lines total `12`; plot-derived extent lines `12`; opening extent lines `4`; shared dividers `4`. Roles total ROW `12` and registered-hard-block `20`.
- The 32 lines have 24 unique endpoints, one connected component and cycle rank `E - V + 1 = 9`; these are validation facts, never persisted faces or adjacency.
- Boundary rows sort by `boundaryId`; divider source edges sort by plot ID then edge index. Geometry endpoints sort by `(xQ,zQ)` and every source member resolves exactly once.

## 7. Exact change manifest

| Action | File | Symbol/region | Maximum delta | Coding instruction |
|---|---|---|---:|---|
| CREATE | `src/domain/townMap/fabric/boundaryArrangement.js` | schema/law/compiler | `250` | Validate exact sources and seal the sole 32-line arrangement |
| REGISTER | `src/domain/townMap/fabric/index.js` | arrangement export | `+4` | Export only schema/law/compiler |
| MODIFY | `tests/fixtures/townMapSettlementFabricFixtures.js` | arrangement fixture | `+22` | Reuse the same foundation/subdivision/geometry bytes |
| CREATE | `tests/domain/townMapBoundaryArrangement.test.js` | A1-A4/A6 | `n/a` | Pin identity, linework, lineage, refusals and authority absence |
| CREATE | `tests/property/townMapBoundaryArrangementDeterminism.test.js` | A5 | `n/a` | Prove reorder/replay/source purity and ID closure |
| MODIFY | `tests/lint/sovereigntyLightingContract.walker.test.js` | exact test census | `+12` | Record only exact two-file/six-title/two-suite movement |

Generated artifacts: `NONE`. No other file may be edited.

## 8. Ordered coding sequence

0. Dispatch and seal; stop on any mismatch.
1. Capture foundation, subdivision and geometry hashes plus sovereignty census.
2. Add exactly A1-A6.
3. Implement non-mutating exact-source replay validation and canonical line derivation.
4. Register exports.
5. Run packet/resume and the whole-tree landing tail.

## 9. Acceptance matrix

| ID | Case | Required observation | Home |
|---|---|---|---|
| A1 | Canonical arrangement | exact ordered 32-line roster; V24/E32/C1; role/source counts and cycle rank 9 | domain |
| A2 | Identity closure | exact three source refs and metadata; every member source resolves foundation or subdivision; deep frozen | domain |
| A3 | Coverage and lineage | all 32 plot-edge occurrences resolve; every plot has four, block seven; four shared dividers pair oppositely; 16 extents and 12 ROW lines close once | domain |
| A4 | Closed refusal | tampered hashes/ref mismatch, partial overlap, coverage gap, wrong shapes and extra keys all refuse before sealing | domain |
| A5 | Determinism/ID closure | repeat, upstream reorder, canonical replay and maximum settlement ID are byte/ID safe; all replay sources remain unfrozen | property |
| A6 | Regression/absence | source hashes and exact keys pinned; no graph, adjacency, face, half-edge, parcel, routing, building or draw authority | domain |

This table is the entire edge-case budget.

## 10. Verification commands

```sh
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/domain/townMapBoundaryArrangement.test.js \
  tests/property/townMapBoundaryArrangementDeterminism.test.js \
  tests/domain/townMapSettlementFabric.test.js \
  tests/property/townMapSettlementFabricDeterminism.test.js \
  tests/domain/townMapStreetGeometry.test.js
npx eslint src/domain/townMap/fabric/boundaryArrangement.js src/domain/townMap/fabric/index.js \
  tests/fixtures/townMapSettlementFabricFixtures.js \
  tests/domain/townMapBoundaryArrangement.test.js \
  tests/property/townMapBoundaryArrangementDeterminism.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict
npm run validate:packets
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/lint/sovereigntyLightingContract.walker.test.js \
  tests/lint/negativeAssertionAnchor.walker.test.js
npm run check:packet -- MF-T1A
npm run implementation:resume -- MF-T1A
npm run check:tail
```

## 11. Mandatory STOP conditions

Stop if base/seal/cleanliness differs; 32 unique lines, V24/C1 or cycle rank 9 cannot be proved; a source compiler cannot reproduce exact bytes; a graph/face/parcel record, full corridor ring, second geometry owner, seventh case, second production leaf or file outside the manifest is required; or a ratchet needs raising. Do not repair adjacent failures.

## 12. Completion receipt

- Base SHA: `ad2bc28b243a09f29657c43525332f9c32c79636`
- Dispatch bundle and seal identity: MF-T1A sealed session digest `08c2f2620a95ba002e56adff799add2f6cce71fd9a6e3e50bc5df6afda3b04d4`; capsule digest `80d46d20292c3141446267c67ddee069f436405ffd7c1269a27385226999ce6a`
- Final commit or working-tree state: `edf5268d1dcad84f1f69f59191ea14aa02a6cb88`; implementation tree clean before terminal governance
- Exact changed files and effective-line deltas: exact six-path manifest; positive effective production delta `251/254` (`boundaryArrangement.js` `247/250`, `index.js` `+4/4`); fixture `+15/22`; census `+5/-1` within `+12`
- A1-A6 results: six new acceptance cases pass; focused source/topology suite `24/24`; two independent bounded audits ended `0 P0 / 0 P1`
- Focused commands, exits, and counts: sealed packet suite `17/17`; sovereignty/negative walkers `42/42`; scoped ESLint and `git diff --check` clean; all exit `0`
- Sealed packet/resume status: `check:packet` and `implementation:resume` passed on the final pre-commit bytes; the exact session fingerprint completed all eight steps
- Both typecheck configurations: full ratchet `173/173`, no regression; domain-strict `1134/1134`, no regression
- Wave-end gate stages: `npm run check:tail` exit `0`; test ratchet `28,598` tests with the inherited `11` known failures and no new failure; lint `29` warnings/`0` errors; build passed in `29.16s`; prerender wrote `314` routes; strict dist `409/409`
- Base-versus-wave failure identity diff: `NONE`
- Source and arrangement byte pins: foundation `scene-v1-c72afb9994bd6e8c4a6168e56fdc221e`; frontage subdivision `scene-v1-38ea62d8983609e19e4fe03cb64092af`; street geometry `scene-v1-3c720d7ef19b040779a7fb82feb85011`; arrangement `scene-v1-a1cfadea8ca1bba796bfed3e0a1cb671`
- Generated artifacts: `NONE`
- Deviations: `NONE`
- Out-of-scope observations: DCEL, faces, parcel semantics, the reference-only Fabric root, buildings, persistence, projection and UI remain later bounded packets
- Judgment calls: exact foundation replay through the sole sealer and a seven-boundaries-per-block census close coordinated hash-correct forgeries without widening beyond the six-case packet
