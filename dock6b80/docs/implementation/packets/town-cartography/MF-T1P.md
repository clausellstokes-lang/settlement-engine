# Fabric Topology / MF-T1P — canonical reference-only parcel registry

- **Status:** LANDED
- **Landed commit:** `7fd8ad3f077a0dbd6765e8bdd906c281a3716659`
- **Packet version:** `1`
- **Verified base:** `codex/first-map-vertical-slice` at `0465e6f5e4a6b6d38770cc552069e24257b1e7d4`
- **Last revalidated:** `2026-08-20` at `7fd8ad3f077a0dbd6765e8bdd906c281a3716659`
- **Depends on:** MF-T1D at `b020f74352b0bf9b07eeba80bc41b4b5d53796ca`
- **Collision group:** `town-map-canonical-fabric-topology`
- **Commit authority:** LANDED; do not redispatch
- **Baseline posture:** MF-T1D wave-end gate passed with 28,604 tests and the inherited 11-known-failure ceiling; lint held 29 warnings and zero errors; build and 314-route prerender passed; strict dist passed 409/409; terminal governance validates 123 packets with zero READY before this promotion

> This packet landed at the commit above. It is terminal and must not be redispatched.

## 1. Reconciled authority

1. `FRONTAGE_SUBDIVISION` already owns the eight W3 plot/frontage identities and is the exact `frontageRegistryRef` target for the first Fabric root. A wrapper would duplicate authority.
2. It cannot also serve `parcelRegistryRef`: it has no exact plot-to-DCEL-face binding. Publishing the Fabric root before that binding would be incomplete.
3. MF-T1A remains the sole boundary-geometry owner and MF-T1D remains the sole topology owner. This packet adds only a reference binding between their existing identities.
4. Exactly eight four-edge bounded faces correspond to the eight W3 plots. The sixteen-edge bounded street-union face and the exterior face are not parcels.
5. Parcel identity is the existing stable `plotId`; this packet does not mint a second semantic identity whose value would depend on DCEL implementation IDs.
6. Ownership, rights, use, address, value, buildability, adjacency and mutation are later authorities and are unrepresentable here.
7. MF-T1D forecast the Fabric root as its first direct consumer. The current canonical Fabric contract requires a valid `parcelRegistryRef`, so the latest owner/spec ordering supersedes that forecast: this registry is the necessary first DCEL consumer and the Fabric root follows immediately after it.

The implementer does not read other documents to widen this packet.

## 2. Outcome

**Observable result:** one pure compiler replay-validates the exact MF-T1D witness chain and publishes one deeply frozen, hash-addressed `PARCEL_REGISTRY` containing eight coordinate-free plot/frontage/face bindings.

**Definition of done:** every landed W3 plot and frontage resolves exactly once to one distinct four-edge bounded DCEL face by the complete boundary-ID set derived from arrangement source lineage; the cross face and exterior remain unbound; no geometry or legal parcel semantics are copied or invented.

In scope:

1. Exact six-field input and non-mutating MF-T1D replay.
2. Transient plot-to-boundary-set and face-to-boundary-set derivation.
3. Eight one-to-one plot/frontage/face rows with exact nested refs.
4. Canonical ordering, exact metadata inheritance and one sealed output.
5. Six bounded acceptance cases and no more.

Explicit non-goals:

- copied points, lines, polygons, rings, cycles, half-edge lists, area or centroid caches;
- new subdivision, plot repair, generic point-in-polygon, ownership, rights, land use, valuation, addresses, adjacency, access, routing, building placement or parcel mutation;
- the Fabric root, persistence, commands, projection, export, UI/workers, holes, multiple frontages, multiple leaves or arbitrary morphology.

Record excluded discoveries in the receipt; do not investigate or repair them.

## 3. Hard scope budget

| Limit | Packet budget |
|---|---:|
| Behavior families | `1` |
| New persisted record families | `1` (`PARCEL_REGISTRY`) |
| Named state writers / feature flags / user surfaces | `0 / 0 / 0` |
| Direct consumers | `0` (the later Fabric root is the first consumer) |
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
npm run implementation:dispatch -- MF-T1P
```

Expected: exact base/branch, clean non-CREATE targets, absent CREATE targets, live MF-T1D closure symbols and a Git-admin seal. Any mismatch makes the packet stale.

## 5. Verified tree contract

| Role | File | Symbol | Required use |
|---|---|---|---|
| Plot/frontage owner | `src/domain/townMap/fabric/frontage.js` | `SETTLEMENT_FRONTAGE_SUBDIVISION_LAW_VERSION`, `subdivideSettlementFrontages` | Preserve existing plot/frontage IDs; do not mint geometry or a wrapper registry |
| Boundary owner | `src/domain/townMap/fabric/boundaryArrangement.js` | MF-T1A schema/law/compiler | Resolve plot-edge lineage after exact replay; copy no boundary rows |
| Topology owner | `src/domain/townMap/fabric/dcel.js` | MF-T1D schema/law/compiler | Replay exact DCEL and consume only face/half-edge references |
| Canonical primitives | `src/domain/townMap/fabric/foundation.js` | ABI/tradition/ref/ID/record/sealer helpers | Reuse exact identity and output authority |
| Replay producers | foundation, settlementFoundation and streetGeometry modules | landed W3/MF-T1G symbols | Seal the transitive witness chain; do not modify |
| Digest/equality | `src/domain/townScene/stableScene.js` | `stableSceneStringify` | Byte-equal replay without freezing caller bytes |
| Stable ordering | `src/domain/deterministicSort.js` | `compareCodepoint` | Canonically order rows and set keys |
| Fixture | `tests/fixtures/townMapSettlementFabricFixtures.js` | `makeSettlementPlanarDcel` | Extend the one source chain; never duplicate bytes |
| Regression precedents | MF-T1A and MF-T1D tests | exact suite titles | Preserve geometry/topology pins, purity and authority absence |

Forbidden alternatives: no coordinate or area read for parcel matching, point-in-polygon, new parcel IDs, second arrangement/DCEL compiler, copied cycles, parcel semantics beyond exact identity binding, graph input, or file outside the manifest.

## 6. Exact contracts

```js
compileOrthogonalCrossParcelRegistry({
  artifactId: EntityId,
  foundation: ExactSettlementFoundation,
  frontageSubdivision: ExactSettlementFrontageSubdivision,
  streetGeometry: ExactStreetGeometry,
  boundaryArrangement: ExactCadastralBoundaryArrangement,
  planarDcel: ExactPlanarDcel,
}) -> Readonly<{
  artifactKind: 'PARCEL_REGISTRY',
  artifactId: EntityId,
  schemaVersion: 1,
  lawVersion: 'mf-t1p-orthogonal-cross-parcel-registry-v1',
  coordinateAbiVersion: string,
  mapTraditionId: 'EUROPEAN_FANTASY_BASE',
  settlementId: EntityId,
  effectiveAt: string,
  leafIndex: 0,
  registryKind: 'ORTHOGONAL_CROSS_POST_W3_FACE_BINDING',
  frontageRegistryRef: ArtifactHashRef,
  boundaryArrangementRef: ArtifactHashRef,
  dcelRef: ArtifactHashRef,
  parcels: readonly ParcelBindingQ[8],
  contentHash: ContentHash,
}>

ParcelBindingQ = {
  parcelId: EntityId, // byte-equal to plotId
  plotRef: { artifactId, contentHash, plotId },
  frontageRef: { artifactId, contentHash, frontageId },
  faceRef: { artifactId, contentHash, faceId },
}
```

Input keys are exactly `artifactId`, `foundation`, `frontageSubdivision`, `streetGeometry`, `boundaryArrangement`, `planarDcel`. Rebuild the DCEL using its own `artifactId` and the four transitive witnesses, require stable byte equality, and derive only from replay-equal sources.

### Binding law

1. For each plot, collect exactly four arrangement `boundaryId`s whose `source.plotEdge` or `source.plotEdges` names that `plotId`; every edge index `0..3` occurs once.
2. Traverse each DCEL face through `nextHalfEdgeId` and collect its referenced boundary IDs. Traversal must close at its declared start and remain on one face.
3. Match the plot to the unique `BOUNDED` face whose complete sorted boundary-ID set equals the plot's complete sorted set. Do not select by one shared divider, area, cycle length, centroid, coordinates or proximity.
4. Require eight plots, eight frontages, eight distinct four-edge bounded faces and a bijection. Exactly one sixteen-edge bounded face plus the exterior remain unused.
5. `parcelId === plotId`; rows sort by `parcelId`. All nested refs repeat the exact source artifact ID/hash and resolve once.

### Lifecycle and absence

- Missing, extra, null, wrong-kind/version/law/ABI/tradition/leaf, tampered, replay-mismatched, incomplete, duplicated, ambiguous or non-bijective input throws `TypeError`; no artifact is published.
- Create/read is pure in-memory compile and exact resolution only.
- Persist/reload/regenerate/undo/import/migrate has no writer in this packet; canonical JSON replay is byte-identical and leaves all witnesses unfrozen.
- Public veil has no role here because the registry contains no audience, owner, custom-package, label, style or DM field.

## 7. Exact change manifest

| Action | File | Symbol/region | Maximum delta | Coding instruction |
|---|---|---|---:|---|
| CREATE | `src/domain/townMap/fabric/parcelRegistry.js` | schema/law/compiler | `250` | Replay MF-T1D and seal eight reference-only parcel bindings |
| REGISTER | `src/domain/townMap/fabric/index.js` | parcel-registry export | `+4` | Export only schema/law/compiler |
| MODIFY | `tests/fixtures/townMapSettlementFabricFixtures.js` | parcel fixture | `+18` | Extend `makeSettlementPlanarDcel` with one artifact ID |
| CREATE | `tests/domain/townMapParcelRegistry.test.js` | A1-A4/A6 | `n/a` | Pin identity, refs, lineage, refusals and absence |
| CREATE | `tests/property/townMapParcelRegistryDeterminism.test.js` | A5 | `n/a` | Prove replay, variant and source-purity determinism |
| MODIFY | `tests/lint/sovereigntyLightingContract.walker.test.js` | exact test census | `+12` | Record only exact two-file/six-title/two-suite movement |

Generated artifacts: `NONE`. No other file may be edited.

## 8. Ordered coding sequence

0. Dispatch and seal; stop on any mismatch.
1. Capture subdivision, arrangement and DCEL hashes plus the sovereignty census.
2. Add exactly A1-A6.
3. Implement non-mutating replay, set-based face binding and the sole registry sealer.
4. Register exports.
5. Run packet/resume and the whole-tree landing tail.

## 9. Acceptance matrix

| ID | Case | Required observation | Home |
|---|---|---|---|
| A1 | Canonical registry | eight ordered rows with unique plot/frontage/face IDs; exactly the cross and exterior faces remain unused | domain |
| A2 | Identity closure | exact replay metadata, three root refs, nested refs, resolution and recursive freeze | domain |
| A3 | Lineage bijection | each plot's four exact lineage boundaries equal its mapped four-edge bounded face set; every plot/frontage/parcel face is consumed once | domain |
| A4 | Closed refusal | tampered or mixed witnesses, coordinated lineage/topology forgery, missing/duplicate/ambiguous mappings, wrong identity and extra keys refuse | domain |
| A5 | Determinism | repeat, upstream reorder, horizontal-frontage valid variant, JSON replay and maximum artifact ID are byte-safe and leave witnesses unfrozen | property |
| A6 | Regression/absence | predecessor hashes and exact key rosters remain pinned; no geometry, area, adjacency, ownership/use, routing, building, persistence, draw or UI authority | domain |

This table is the entire edge-case budget.

## 10. Verification commands

```sh
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/domain/townMapParcelRegistry.test.js \
  tests/property/townMapParcelRegistryDeterminism.test.js \
  tests/domain/townMapPlanarDcel.test.js \
  tests/property/townMapPlanarDcelDeterminism.test.js
npx eslint src/domain/townMap/fabric/parcelRegistry.js src/domain/townMap/fabric/index.js \
  tests/fixtures/townMapSettlementFabricFixtures.js \
  tests/domain/townMapParcelRegistry.test.js \
  tests/property/townMapParcelRegistryDeterminism.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict
npm run validate:packets
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/lint/sovereigntyLightingContract.walker.test.js \
  tests/lint/negativeAssertionAnchor.walker.test.js
npm run check:packet -- MF-T1P
npm run implementation:resume -- MF-T1P
npm run check:tail
```

## 11. Mandatory STOP conditions

Stop on source replay mismatch; any need to copy or repair geometry/topology; anything other than eight plot/frontage/four-edge-face bindings plus one unused bounded cross and one exterior; ownership/use/access/buildability semantics; generic parcel algorithms; a second record family or production leaf; any file outside the manifest; a seventh case; budget breach; ratchet raise; or unrelated gate failure requiring repair.

## 12. Completion receipt

- Base SHA: `0465e6f5e4a6b6d38770cc552069e24257b1e7d4`
- Dispatch bundle and seal identity: MF-T1P sealed session digest `ecb55fba95d900dcd06e04d780ed1d0d25366add45b6b3af6f855bb85f5d2283`; capsule digest `0dce675a150a2c67c4bc37b0bf3c3573436001302149e7b4bef2e1088690424f`
- Final commit or working-tree state: `7fd8ad3f077a0dbd6765e8bdd906c281a3716659`; implementation tree clean before terminal governance
- Exact changed files and effective-line deltas: exact six-path manifest; effective production delta `220/254` (`parcelRegistry.js` `216/250`, `index.js` `+4/4`); fixture `+16/18`; census stayed within `+12`
- A1-A6 results: six new acceptance cases pass; focused MF-T1P plus MF-T1D suite `12/12`; final independent packet audit ended `0 P0 / 0 P1`
- Focused commands, exits and counts: parcel/DCEL suites `12/12`; sovereignty/negative walkers `42/42`; scoped ESLint and `git diff --check` clean; all exit `0`
- Sealed packet/resume status: `check:packet` and `implementation:resume` passed on the final pre-commit bytes; the exact sealed session completed all required steps
- Both typecheck configurations: full ratchet `173/173`, no regression; domain-strict `1134/1134`, no regression
- Wave-end gate stages: final `npm run check:tail` exit `0`; test ratchet `28,610` tests with the inherited `11` known failures and no new failure; lint `29` warnings/`0` errors; build passed in `29.22s`; prerender wrote `314` routes; strict dist `409/409`
- Base-versus-wave failure identity diff: `NONE`
- Source and registry byte pins: subdivision `scene-v1-38ea62d8983609e19e4fe03cb64092af`; arrangement `scene-v1-a1cfadea8ca1bba796bfed3e0a1cb671`; DCEL `scene-v1-9e5a1400770196ff6da8be9417138d0d`; registry `scene-v1-71946b930acf2a0080c4bd57658b31b6`
- Generated artifacts: `NONE`
- Deviations: `NONE`
- Out-of-scope observations: the reference-only Fabric root, parcel lifecycle/ownership, buildings, persistence, projection and UI remain later bounded packets
- Judgment calls: plot IDs remain the first-tranche parcel identities so a topology implementation-ID change cannot churn semantic parcel identity. Replay-proven frontage selectors are preserved exactly rather than reminted or subjected to a downstream 96-character cap; valid upstream selectors may be 100 characters.
