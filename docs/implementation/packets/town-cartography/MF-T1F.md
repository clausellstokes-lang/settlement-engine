# Fabric Topology / MF-T1F — first-slice Fabric reference root

- **Status:** READY
- **Packet version:** `1`
- **Verified base:** `codex/first-map-vertical-slice` at `d6b4b3d5285fdba01508366fa6bdced8be1b44fa`
- **Last revalidated:** `2026-08-20` at `d6b4b3d5285fdba01508366fa6bdced8be1b44fa`
- **Depends on:** MF-T1P at `7fd8ad3f077a0dbd6765e8bdd906c281a3716659`; MF-T1N at `40b29038d40ce50096e6b3450748ee6318bff285`
- **Collision group:** `town-map-canonical-fabric-topology`
- **Commit authority:** agent may stage and commit the exact manifest after all packet checks pass; no push, merge, cleanup, or adjacent repair
- **Baseline posture:** MF-T1P wave-end gate passed with 28,610 tests and the inherited 11-known-failure ceiling; lint held 29 warnings and zero errors; build and 314-route prerender passed; strict dist passed 409/409; terminal governance validates 124 packets with zero READY before this promotion

## 1. Reconciled authority

1. The landed street geometry, street graph, boundary arrangement, DCEL, frontage subdivision and parcel registry are separate sole authorities. This root joins their exact identities and copies none of their rows.
2. Foundation bytes remain a transient replay witness. They are already bound through street geometry and frontage and do not become a seventh persisted root ref.
3. The full `CanonicalFabricArtifact` contract also requires genuine `coordinateAbiRef`, `lawManifestRef` and `provenanceRef`. Those artifact families do not yet exist in the first-slice runtime, so this packet may not claim `artifactKind: 'FABRIC'` or canonical conformance.
4. The bounded resolution is a distinct `FIRST_SLICE_FABRIC_ROOT`, following existing first-slice document/projection precedent. Later promotion creates new canonical bytes and a new hash; it never relabels this artifact.
5. MF-T1P and MF-T1N are replayed through their sole compilers. Hash-only trust or a valid-but-mixed graph/topology chain is forbidden.

Resolved contradiction:

- The earlier plan to publish the full canonical Fabric root immediately is superseded by the missing ABI/law/provenance authorities. This packet publishes only the explicitly transitional first-slice join and records the migration barrier.

The implementer does not read other documents to widen this packet.

## 2. Outcome

**Observable result:** one pure compiler replay-validates all seven landed first-slice witnesses and publishes one deeply frozen, hash-addressed `FIRST_SLICE_FABRIC_ROOT` containing exactly six direct artifact references.

**Definition of done:** the root resolves the one street graph, street geometry, cadastral boundary arrangement, DCEL, frontage subdivision and parcel registry from a single replay-equal settlement/time/ABI/tradition chain, while containing no copied members and no false canonical authority.

In scope:

1. Exact eight-field input and non-mutating replay of MF-T1P plus MF-T1N.
2. Six direct source references with exact role, ID and content hash.
3. Closed metadata equality, deterministic sealing and the first-slice migration barrier.
4. Six bounded acceptance cases and no more.

Explicit non-goals:

- `artifactKind: 'FABRIC'`, `CanonicalFabricArtifact`, fabricated ABI/law/provenance refs, canonical-spatial dependencies or migration;
- copied nodes, edges, segments, boundaries, vertices, half-edges, faces, frontages, plots or parcel rows;
- routing, access, ownership, use, buildings, institutions, operations, persistence, projection, export, privacy, UI/workers or arbitrary morphology.

Record excluded discoveries in the receipt; do not investigate or repair them.

## 3. Hard scope budget

| Limit | Packet budget |
|---|---:|
| Behavior families | `1` |
| New persisted record families | `1` (`FIRST_SLICE_FABRIC_ROOT`) |
| Named state writers / feature flags / user surfaces | `0 / 0 / 0` |
| Direct consumers | `0` |
| New logic-bearing production leaves | `1` |
| Existing logic-bearing production files modified | `0` |
| Additional registration-only files | `1` |
| Handwritten files total | `6` |
| New/changed effective production lines | `<=154` |
| Effective lines in the new leaf | `<=150` |
| Shared/hot-file delta | `<=12` (census only) |
| Acceptance cases | `6` |

Overrides approved before dispatch: `NONE`. Exceeding a limit is a STOP and split.

## 4. Sealed dispatch and preflight

Run before implementation edits:

```sh
npm run implementation:dispatch -- MF-T1F
```

Expected: exact base/branch, clean non-CREATE targets, absent CREATE targets, live MF-T1P/MF-T1N closure symbols and a Git-admin seal. Any mismatch makes the packet stale.

## 5. Verified tree contract

| Role | File | Symbol | Required use |
|---|---|---|---|
| Parcel/topology join | `src/domain/townMap/fabric/parcelRegistry.js` | schema/law/compiler | Replay the exact foundation/frontage/geometry/arrangement/DCEL chain and copy no parcel row |
| Street join | `src/domain/townMap/fabric/streetGraph.js` | schema/law/compiler | Replay the exact graph from the supplied street geometry and copy no graph row |
| Canonical primitives | `src/domain/townMap/fabric/foundation.js` | ABI/tradition/ref/ID/record/sealer helpers | Reuse exact first-slice identity and hash authority |
| Equality | `src/domain/townScene/stableScene.js` | `stableSceneStringify` | Compare replay bytes without freezing caller-owned witnesses |
| Fixture | `tests/fixtures/townMapSettlementFabricFixtures.js` | `makeSettlementParcelRegistry`, `makeSettlementStreetGraph` | Extend the one source chain; duplicate no source bytes |
| Regression precedents | MF-T1P and MF-T1N tests | exact suite titles | Preserve reference closure, purity, determinism and authority absence |

Forbidden alternatives: no `FABRIC` literal or canonical alias/cast, dummy dependency ref, second source compiler, copied source collection, foundation root ref, opaque hash-only acceptance, persistence writer, consumer, or file outside the manifest.

## 6. Exact contracts

```js
compileOrthogonalCrossFirstSliceFabricRoot({
  artifactId: EntityId,
  foundation: ExactSettlementFoundation,
  frontageSubdivision: ExactSettlementFrontageSubdivision,
  streetGeometry: ExactStreetGeometry,
  streetGraph: ExactStreetGraph,
  boundaryArrangement: ExactCadastralBoundaryArrangement,
  planarDcel: ExactPlanarDcel,
  parcelRegistry: ExactParcelRegistry,
}) -> Readonly<{
  artifactKind: 'FIRST_SLICE_FABRIC_ROOT',
  artifactId: EntityId,
  schemaVersion: 1,
  lawVersion: 'mf-t1f-orthogonal-cross-first-slice-fabric-root-v1',
  coordinateAbiVersion: string,
  mapTraditionId: 'EUROPEAN_FANTASY_BASE',
  settlementId: EntityId,
  effectiveAt: string,
  leafIndex: 0,
  streetGraphRef: ArtifactHashRef,
  streetGeometryRef: ArtifactHashRef,
  cadastralBoundaryArrangementRef: ArtifactHashRef,
  dcelRef: ArtifactHashRef,
  frontageRegistryRef: ArtifactHashRef,
  parcelRegistryRef: ArtifactHashRef,
  contentHash: ContentHash,
}>
```

Input keys are exactly `artifactId`, `foundation`, `frontageSubdivision`, `streetGeometry`, `streetGraph`, `boundaryArrangement`, `planarDcel`, `parcelRegistry`.

The canonical acceptance fixture uses exactly `FIRST_SLICE_FABRIC_ROOT_ID = 'first-slice-fabric-root:settlement-cross:001'`. A1 pins the root hash produced for that ID and no alternative fixture ID satisfies A1.

### Replay and join law

1. Recompile the parcel registry using its artifact ID and the five topology witnesses; require stable byte equality. This transitively replays DCEL, arrangement, geometry, frontage and foundation.
2. Recompile the street graph using its artifact ID and the supplied geometry; require stable byte equality.
3. Require the graph's `streetGeometryRef`, arrangement's `streetGeometryRef`, parcel registry's three root refs, DCEL's arrangement ref, and every foundation/frontage link to equal the supplied source ID/hash exactly.
4. Require ABI equality across all seven witnesses; settlement equality across geometry, graph, arrangement, DCEL and parcel; and effective-time, tradition and leaf equality across foundation plus those five. Frontage joins through its exact foundation ref and replay and must not invent fields it does not own.
5. Seal only the six source refs and inherited metadata. Root keys are closed and there are no arrays.

### Migration barrier and lifecycle

- The artifact kind is exactly `FIRST_SLICE_FABRIC_ROOT`; `FABRIC` is forbidden.
- It cannot satisfy `CanonicalSpatialArtifact.fabricRef`, a manifest `FABRIC` dependency or any canonical-spatial consumer.
- No ABI, law-manifest or provenance ref may be fabricated or stored.
- Later canonical promotion replays this source chain alongside genuine authority artifacts and emits new bytes/hash; it does not relabel or mutate this root.
- Missing, extra, null, wrong-kind/version/law/ABI/tradition/leaf, tampered, mixed or replay-mismatched input throws `TypeError`; no artifact is published.
- Create/read is pure in-memory compile and exact resolution only. Persistence, reload, regeneration, undo, import and migration have no writer in this packet.
- Audience/privacy is absent by construction; the root contains no DM, public, owner, package, label, style or semantic payload.

## 7. Exact change manifest

| Action | File | Symbol/region | Maximum delta | Coding instruction |
|---|---|---|---:|---|
| CREATE | `src/domain/townMap/fabric/fabricRoot.js` | schema/law/compiler | `150` | Replay both source branches and seal exactly six references |
| REGISTER | `src/domain/townMap/fabric/index.js` | first-slice root export | `+4` | Export only schema/law/compiler |
| MODIFY | `tests/fixtures/townMapSettlementFabricFixtures.js` | root fixture | `+20` | Extend the parcel and graph fixture chain with one artifact ID |
| CREATE | `tests/domain/townMapFabricRoot.test.js` | A1-A4/A6 | `n/a` | Pin refs, join closure, refusals, barrier and absence |
| CREATE | `tests/property/townMapFabricRootDeterminism.test.js` | A5 | `n/a` | Prove replay/variant/source-purity determinism |
| MODIFY | `tests/lint/sovereigntyLightingContract.walker.test.js` | exact test census | `+12` | Record only exact two-file/six-title/two-suite movement |

Generated artifacts: `NONE`. No other file may be edited.

## 8. Ordered coding sequence

0. Dispatch and seal; stop on any mismatch.
1. Capture all seven source hashes and the sovereignty census.
2. Add exactly A1-A6.
3. Implement non-mutating dual replay, exact joins and the sole transitional-root sealer.
4. Register exports.
5. Run packet/resume and the whole-tree landing tail.

## 9. Acceptance matrix

| ID | Case | Required observation | Home |
|---|---|---|---|
| A1 | Transitional root | exact metadata, six role-specific ID/hash refs, deterministic root hash and recursive freeze | domain |
| A2 | Resolution closure | every root ref resolves exactly once to the supplied source and nested source refs agree | domain |
| A3 | Replay join | both sole compilers reproduce byte-equal graph and parcel branches; equality is checked only across the exact metadata fields each source owns | domain |
| A4 | Closed refusal | one finite 13-row matrix refuses seven independently tampered hashes, both canonical/horizontal mixed-chain directions, wrong graph-geometry and parcel-DCEL nested refs, one wrong graph law and one extra input key | domain |
| A5 | Determinism | repeat, upstream reorder, one valid horizontal-frontage variant, JSON replay and maximum root ID are byte-safe and leave witnesses unfrozen | property |
| A6 | Barrier/absence | predecessor hashes and exact keys remain pinned; `artifactKind !== 'FABRIC'`; no dummy refs, copied rows or downstream authority exists | domain |

This table is the entire edge-case budget.

The fixture calls `makeSettlementParcelRegistry` once, compiles the graph directly over that returned geometry, then compiles the root. It must not call `makeSettlementStreetGraph` as a second source chain. A4 stays one literal test with exactly the listed rows; do not add a null/missing/kind/version permutation battery.

## 10. Verification commands

```sh
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/domain/townMapFabricRoot.test.js \
  tests/property/townMapFabricRootDeterminism.test.js \
  tests/domain/townMapParcelRegistry.test.js \
  tests/property/townMapParcelRegistryDeterminism.test.js \
  tests/domain/townMapStreetGraph.test.js \
  tests/property/townMapStreetGraphDeterminism.test.js
npx eslint src/domain/townMap/fabric/fabricRoot.js src/domain/townMap/fabric/index.js \
  tests/fixtures/townMapSettlementFabricFixtures.js \
  tests/domain/townMapFabricRoot.test.js \
  tests/property/townMapFabricRootDeterminism.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict
npm run validate:packets
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/lint/sovereigntyLightingContract.walker.test.js \
  tests/lint/negativeAssertionAnchor.walker.test.js
npm run check:packet -- MF-T1F
npm run implementation:resume -- MF-T1F
npm run check:tail
```

## 11. Mandatory STOP conditions

Stop on source replay mismatch; any need for `artifactKind: 'FABRIC'`, canonical-spatial use, dummy ABI/law/provenance refs, copied source rows, a second record family or production leaf, any file outside the manifest, a seventh case, budget breach, ratchet raise, or unrelated gate failure requiring repair.

## 12. Completion receipt

- Base SHA: `d6b4b3d5285fdba01508366fa6bdced8be1b44fa`
- Dispatch bundle and seal identity: `PENDING`
- Final commit or working-tree state: `PENDING`
- Exact changed files and effective-line deltas: `PENDING`
- A1-A6 results: `PENDING`
- Focused commands, exits and counts: `PENDING`
- Sealed packet/resume status: `PENDING`
- Both typecheck configurations: `PENDING`
- Wave-end gate stages: `PENDING`
- Base-versus-wave failure identity diff: `PENDING`
- Source and root byte pins: foundation `scene-v1-c72afb9994bd6e8c4a6168e56fdc221e`; frontage `scene-v1-38ea62d8983609e19e4fe03cb64092af`; geometry `scene-v1-3c720d7ef19b040779a7fb82feb85011`; graph `scene-v1-18be7a3de95499aca1ca2a094c6d0e1e`; arrangement `scene-v1-a1cfadea8ca1bba796bfed3e0a1cb671`; DCEL `scene-v1-9e5a1400770196ff6da8be9417138d0d`; parcel `scene-v1-71946b930acf2a0080c4bd57658b31b6`; root `PENDING`
- Generated artifacts: `NONE`
- Deviations: `PENDING`
- Out-of-scope observations: genuine ABI/law/provenance authorities and canonical Fabric promotion remain a later persistence/provenance packet; buildings and projection follow this bounded first-slice root
- Judgment calls: the transitional artifact has a distinct kind and hash domain. It cannot be relabeled into the canonical contract.
