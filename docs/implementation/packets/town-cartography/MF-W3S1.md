# Settlement Fabric / MF-W3S1 — orthogonal cross and aggregate frontage W3

- **Status:** READY
- **Packet version:** `1`
- **Verified base:** `codex/first-map-vertical-slice` at `7a631a739bc69dc98efa1877474ef9d358a05646`
- **Last revalidated:** `2026-08-20` at `7a631a739bc69dc98efa1877474ef9d358a05646`
- **Depends on:** MF-VS1 at `7c34f50fd99fcf34c478ec56cbae42240bcd7486`; MF-SH1 at `3cf12008e1d4ea7411a61f59b8e633a7b993dd1f`
- **Collision group:** `town-map-canonical-fabric`
- **Commit authority:** agent may stage and commit the exact manifest after all packet checks pass; no push, merge, cleanup, or adjacent repair
- **Baseline posture:** full `npm run check` passed at the verified base with 28,574 tests and the inherited 11-known-failure ceiling; strict dist passed 409/409; lint held 29 warnings and zero errors

## 1. Reconciled authority

1. The owner requires the sealed fabric foundation and frontage/W3 to work before broader mapmaking.
2. The core-first stop law admits one ordinary European-fantasy settlement profile and defers arbitrary morphology.
3. MF-VS1 owns the canonical foundation/frontage seams; MF-SH1 does not alter their authority.
4. This packet extends those seams without importing the retired `townCartography/**` generator.

Resolved contradictions:

- "Finish all W3 cases" becomes one finite deterministic orthogonal-cross settlement fixture; the general topology/DCEL packet follows separately.
- The one-block MF-VS1 shape remains a byte-stable legacy branch, not a second settlement authority.
- Street, block, and parcel geometry is explicit integer input or exact derivation from that input; culture, tier, institution, wealth, and historical evidence remain unreadable here.

The implementer does not read other documents to widen this packet.

## 2. Outcome

**Observable result:** the sole fabric sealer accepts one explicit `ORTHOGONAL_CROSS_V1` plan and deterministically publishes two street corridors, four positive blocks, four street-facing edges, and an aggregate frontage subdivision over all four blocks.

**Definition of done:** the canonical fixture conserves ground area into the street union plus four blocks, produces eight frontage plots and four backland cores through the existing four-axis W3 law, remains deterministic under input reordering, and leaves the legacy one-block hashes unchanged.

In scope:

1. One axis-aligned ground rectangle containing one strict-interior vertical street band and one strict-interior horizontal street band.
2. Exactly four explicit cell rows, distinct block/edge IDs, and one declared frontage axis.
3. One aggregate W3 entry that invokes the same private one-block routine four times, flattens and canonically sorts the results, and preserves complete block/edge/plot lineage.
4. Canonical fitted rectangles for all four edge orientations.

Explicit non-goals:

- arbitrary street graphs, DCEL/half-edge publication, diagonals, curves, cul-de-sacs, grade separation, multiple frontage sides, walls, water, terrain, or topology editing;
- building population, institutions, street paint, hit regions, projection/root changes, persistence migration, UI/store/worker cutover, or new commands;
- morphology inference, evidence activation, non-European tradition packs, W2 offsets, parcel soak/tuning, or adjacent shape work.

Record an excluded discovery in the receipt; do not investigate or repair it.

## 3. Hard scope budget

| Limit | Packet budget |
|---|---:|
| Behavior families | `1` |
| New persisted record families | `0` (schema-v2 branch of the existing foundation plus existing subdivision family) |
| Named state writers | `0` |
| Feature flags | `0` |
| User-facing surfaces | `0` |
| Direct consumers | `1` (existing building compiler through `frontagePlotById`) |
| New logic-bearing production leaves | `1` |
| Existing logic-bearing production files modified | `2` |
| Additional registration-only files | `1` |
| Handwritten files total | `8` |
| New/changed effective production lines | `<=320` |
| Effective lines in the new leaf | `<=150` |
| Delta in a shared/hot file | `<=15` (census only) |
| Acceptance cases | `6` |

Overrides approved before dispatch: `NONE`.

Exceeding any limit is a STOP and split.

## 4. Sealed dispatch and preflight

Run before any implementation edit:

```sh
npm run implementation:dispatch -- MF-W3S1
```

Expected: exact base and branch, clean non-CREATE targets, absent CREATE targets, live required symbols, and a seal outside project files. Any mismatch makes the packet stale.

## 5. Verified tree contract

| Role | File | Symbol | Verified fact | Required use |
|---|---|---|---|---|
| Sole sealer | `src/domain/townMap/fabric/foundation.js` | `sealFabricFoundation` | Seals/hash-freezes the only canonical foundation | Add a tagged branch; no second public sealer |
| Coordinate law | same | `canonicalRectBounds` | Accepts the closed integer CCW rectangle | Reuse for ground, corridors, and blocks |
| W3 authority | `src/domain/townMap/fabric/frontage.js` | `subdivideFrontageBlock` | Owns the exact four axes and parcel calculation | Extract privately and call unchanged for the legacy wrapper |
| Plot lookup | same | `frontagePlotById` | Resolves from `subdivision.plots` | Preserve aggregate compatibility |
| Building consumer | `src/domain/townMap/fabric/building.js` | `compileExplicitBuildingMass` | Accepts any plot whose ref resolves | No edit; prove real compatibility |
| Regression precedent | `tests/property/townMapFirstSliceDeterminism.test.js` | `MF-VS1 privacy and whole-slice deterministic replay` | Pins the landed single-block path | Keep bytes unchanged |

Forbidden alternatives:

- no import from `src/domain/townCartography/**` or `TownMapModel`;
- no second canonical geometry sealer, parcel alias, random stream, cultural selector, or inferred building fill;
- no edit outside the exact manifest.

## 6. Exact contracts

### Foundation input and output

`sealFabricFoundation` retains its current input and additionally accepts:

```js
{
  artifactId,
  effectiveAt,
  plan: {
    kind: 'ORTHOGONAL_CROSS_V1',
    groundRing,
    verticalStreet: { streetId, minXQ, maxXQ },
    horizontalStreet: { streetId, minZQ, maxZQ },
    cells: [
      { cell: 'LOW_X_LOW_Z', blockId, edgeId },
      { cell: 'HIGH_X_LOW_Z', blockId, edgeId },
      { cell: 'LOW_X_HIGH_Z', blockId, edgeId },
      { cell: 'HIGH_X_HIGH_Z', blockId, edgeId },
    ],
    frontageAxis: 'VERTICAL' | 'HORIZONTAL',
    setbackQ,
  },
}
```

The schema-v2 result adds canonically ID-sorted `streetCorridors[2]`, `blockFaces[4]`, and `streetEdges[4]`. The new pure leaf may derive rows, but only `sealFabricFoundation` may assign artifact identity/hash/freeze.

The two street bands must lie strictly inside the ground rectangle. Four cell names, block IDs, and edge IDs are exact and unique; the two street IDs differ. Each block is positive, rectangles do not overlap, and `groundAreaQ === streetUnionAreaQ + sum(blockAreaQ)`.

Frontage edge indices are fixed by cell and declared axis:

| Cell | `VERTICAL` | `HORIZONTAL` |
|---|---:|---:|
| `LOW_X_LOW_Z` | `1` | `2` |
| `HIGH_X_LOW_Z` | `3` | `2` |
| `LOW_X_HIGH_Z` | `1` | `0` |
| `HIGH_X_HIGH_Z` | `3` | `0` |

### Aggregate W3

```js
subdivideSettlementFrontages(foundation, {
  sizeFloorQ, gridChaosQ, sizeVariationQ, emptinessQ,
}) -> FRONTAGE_SUBDIVISION
```

It accepts only the schema-v2 orthogonal-cross law, invokes the existing private block routine once per sorted block ID, flattens/sorts `frontages`, `plots`, and non-null backlands by canonical ID, and records `blockIds` plus aggregate metrics. It never fills an empty plot or mints a building.

Every fitted footprint is normalized through `canonicalRectBounds(...).ring` so edge 1/3 blocks remain valid inputs to the unchanged explicit building compiler.

### Determinism and lifecycle

- Stable enumeration: canonical ID order for cells, corridors, blocks, edges, frontages, plots, and backlands.
- Rounding: existing integer W3 floors only; no floating point trig or random draw.
- Hash authority: `sceneDigest` through `sealCanonicalArtifact` only.
- Legacy absence: no `plan` means the current exact one-block input contract and byte output.
- Empty/missing cells, collapsed/outside bands, duplicate IDs, or consuming setback: immediate `TypeError`; no repair/default.
- Public/privacy: this tranche mints no audience-specific fields; later projection filters remain unchanged.
- Alignment: `DECLARED EMPTY`; no authoring command enters this pure fabric tranche.

## 7. Exact change manifest

| Action | File | Symbol/region | Maximum delta | Coding instruction |
|---|---|---|---:|---|
| CREATE | `src/domain/townMap/fabric/settlementFoundation.js` | private orthogonal-cross row derivation | `150` | Validate the closed tagged plan and return unsealed deterministic rows/metrics only |
| MODIFY | `src/domain/townMap/fabric/foundation.js` | constants, input union, `sealFabricFoundation` | `+70` | Preserve legacy branch bytes; seal the new derived rows as schema v2 |
| MODIFY | `src/domain/townMap/fabric/frontage.js` | private block routine, aggregate export | `+90` | Reuse one calculation for legacy and four-block branches; normalize fitted rectangles |
| REGISTER | `src/domain/townMap/fabric/index.js` | fabric exports | `+6` | Export only the new constants and aggregate entry |
| CREATE | `tests/fixtures/townMapSettlementFabricFixtures.js` | canonical cross fixture and axes | `120` | Supply only explicit integer inputs and stable expected IDs/counts |
| CREATE | `tests/domain/townMapSettlementFabric.test.js` | A1-A4 and A6 | `240` | Prove conservation, refusals, W3 lineage, compatibility, and legacy pins |
| CREATE | `tests/property/townMapSettlementFabricDeterminism.test.js` | A5 | `140` | Prove reorder/save-style replay determinism without widening the fixture matrix |
| MODIFY | `tests/lint/sovereigntyLightingContract.walker.test.js` | literal test census | `+12` | Re-measure and record only the exact new credited files/titles |

Generated artifacts: `NONE`.

No other file may be edited.

## 8. Ordered coding sequence

0. Dispatch and seal; stop on preflight mismatch.
1. Capture committed legacy foundation/subdivision hashes.
2. Add failing conservation, refusal, aggregate-lineage, and determinism tests.
3. Implement the unsealed orthogonal-cross row derivation.
4. Extend the sole foundation sealer with the tagged branch.
5. Extract the one-block W3 routine and add the aggregate entry.
6. Register exports and re-measure the literal-test census.
7. Run focused checks and sealed receipt/resume.
8. Run `npm run check:tail`; only then stage/commit the exact manifest.

## 9. Acceptance matrix

| ID | Case | Fixture/input | Required observation | Test home |
|---|---|---|---|---|
| A1 | Conserved settlement fabric | canonical 900x900 cross | exactly 2 corridors, 4 blocks, 4 edges; street union + blocks equals ground | domain |
| A2 | Closed refusal surface | missing cell, duplicate IDs, collapsed/outside band, invalid axis, consuming setback | every case throws before sealing | domain |
| A3 | Aggregate W3 | four-axis canonical fixture | 4 block IDs, 8 plots/frontages, 4 backlands, complete lineage | domain |
| A4 | Existing consumer | one plot from each block | unchanged building compiler accepts every fitted rectangle; no building is inferred | domain |
| A5 | Determinism | reversed cells and replayed calls | foundation and aggregate stable bytes/hashes identical | property |
| A6 | Legacy boundary | landed MF-VS1 fixture | exact foundation/subdivision byte pins remain unchanged | domain |

This table is the entire edge-case budget.

## 10. Verification commands

```sh
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/domain/townMapSettlementFabric.test.js \
  tests/property/townMapSettlementFabricDeterminism.test.js \
  tests/domain/townMapFabricFoundation.test.js \
  tests/domain/townMapFrontageW3.test.js \
  tests/domain/townMapExplicitBuilding.test.js \
  tests/property/townMapFirstSliceDeterminism.test.js
npx eslint \
  src/domain/townMap/fabric/settlementFoundation.js \
  src/domain/townMap/fabric/foundation.js \
  src/domain/townMap/fabric/frontage.js \
  src/domain/townMap/fabric/index.js \
  tests/fixtures/townMapSettlementFabricFixtures.js \
  tests/domain/townMapSettlementFabric.test.js \
  tests/property/townMapSettlementFabricDeterminism.test.js
npm run typecheck:domain:strict
npm run validate:packets
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/lint/sovereigntyLightingContract.walker.test.js \
  tests/lint/negativeAssertionAnchor.walker.test.js
npm run check:packet -- MF-W3S1
npm run implementation:resume -- MF-W3S1
npm run check:tail
```

## 11. Mandatory STOP conditions

Stop if the seal/base/foreign-work check fails; the legacy bytes move; a fourth existing logic file is needed; the algorithm needs polygon clipping, graph search, a new random stream, or a morphology/evidence read; a parcel cannot be represented by the existing plot contract; or any acceptance case requires widening the six-case matrix.

Do not broaden this packet or repair unrelated failures.

## 12. Completion receipt

- Base SHA:
- Dispatch bundle and seal identity:
- Final commit or working-tree state:
- Exact changed files and effective-line deltas:
- A1-A6 results:
- Focused commands, exits, and counts:
- Sealed per-step receipt and exact-state resume status:
- Both typecheck configurations:
- Wave-end gate stages actually executed:
- Base-versus-wave failure identity diff:
- Legacy byte pins:
- Generated artifacts: `NONE`
- Deviations: `NONE | STOP`
- Out-of-scope observations, without investigation:
- Judgment calls: `NONE`
