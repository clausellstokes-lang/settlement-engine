# First-Slice Projection / MF-T1V — roster-aware fixed-survey projection

- **Status:** READY
- **Packet version:** `1`
- **Verified base:** `codex/first-map-vertical-slice` at `838710e93665d743a7a3d7c517f072fa91e192cf`
- **Last revalidated:** `2026-08-20` at `838710e93665d743a7a3d7c517f072fa91e192cf`
- **Depends on:** MF-T1M at `bffd1bcb7a8bc2087d467e6dc73de42641f717e2`; MF-VS1 at `7c34f50fd99fcf34c478ec56cbae42240bcd7486`; MF-SH1 at `3cf12008e1d4ea7411a61f59b8e633a7b993dd1f`
- **Collision group:** `town-map-first-slice-massing-projection`
- **Commit authority:** this READY packet alone; exact manifest only
- **Baseline posture:** MF-T1M landed and terminalized on a clean tree; its focused suites passed `18/18`, governance walkers passed `42/42`, and terminal governance validates `126` packets with zero READY before this promotion

> Only this READY implementation packet defines coding authority. Design files, queues, progress notes, commit subjects, and briefs cannot expand that authority.

## 1. Reconciled authority

1. MF-T1M now owns the exact two-body first-slice bundle: one reference-only roster plus its two sibling canonical masses. The projection consumer must replay that bundle from the complete MF-T1M compile input before it trusts a byte.
2. The landed fixed-survey projector already owns the sole light, silhouette, plan-surface, semantic-primitive, draw-op and SVG path. This packet extracts one source-driven core inside `projection.js`; it does not create a second projector.
3. The existing document projector remains a supported legacy entry point. It currently accepts hash-correct-looking but stale or crossed document/report witnesses without recomputing their hashes or proving `sourceDocumentRef`. That is a false-authority P0 and is repaired in the same bounded hot-file edit.
4. A v1 map document cannot carry the MF-T1M roster without silently discarding it. MF-T1V therefore adds one direct public call over `{ audience, massingBundle, massingCompileInput }`; it does not synthesize a document, resolution report or content adapter.
5. PUBLIC authority must be independent of package class, origin, mass identity, roster identity and every hidden body. DM authority may bind the exact roster ref. Both audiences still consume the same filtered geometry and the same projection core.
6. The return remains the landed `FIRST_SLICE_PROJECTION`. This packet adds no canonical projection family, persistence family, UI surface or export cutover.

Resolved contradictions:

- A masses-only document adapter is forbidden: it would draw correctly while discarding the roster/Fabric lineage this packet exists to prove.
- A roster-aware v1 document is forbidden: unknown document fields are not authority, and changing that document schema would pull persistence and migration into this packet.
- A second PUBLIC input artifact is superseded for the new path. Its hash would be a needless extra authority; the projection directly owns the bounded public derivation fields.
- A live-screen claim is deferred. `firstSliceScreenDrawOps` and `firstSliceProjectionToSvg` remain the shared headless adapters; UI consumers are outside this packet.

The implementer does not read other documents to widen this packet.

## 2. Outcome

**Observable result:** one origin-neutral compiler call takes the exact MF-T1M bundle and compile input, replays the bundle, projects both explicit bodies through the fixed survey light, and returns the same `FIRST_SLICE_PROJECTION` shape consumed by the one draw-op/SVG path.

**Definition of done:** the golden projection contains exactly eighteen ordered semantic primitives/draw ops, preserves the rectilinear and composite silhouettes, is byte-equal for equivalent built-in/custom PUBLIC geometry, keeps DM-only identity out of PUBLIC bytes, binds DM to the roster, and makes the legacy document entry point reject false hashes or a crossed report without moving either valid legacy projection hash.

In scope:

1. One direct massing projection leaf with the exact top-level input `{ audience, massingBundle, massingCompileInput }`.
2. Exact MF-T1M replay, stable-byte bundle equality, origin-neutral audience filtering and reference-only source authority.
3. One non-barrel-exported projection core shared by the legacy document entry and the new massing entry.
4. Exact legacy document/report hash validation and exact `report.sourceDocumentRef` validation before the old entry reaches that core.
5. The existing fixed light, semantic primitive list, screen draw-op identity and deterministic SVG serializer.
6. Exactly A1-A6 below; no broader edge matrix.

Explicit non-goals:

- v1 document/content creation, adapters, resolution, save/load, missing-package recovery, persistence, migration or editing;
- fantasy operations, dossier/seed authority, sampling, candidates, weights, PRNGs or choice receipts;
- citywide fill, third bodies, routing, arbitrary Fabric, new shape grammar, new lighting, material shading or cultural morphology;
- UI, workers, canvas/PDF wiring, product export cutover, screenshot goldens or a canonical projection ABI/provenance promotion.

Record adjacent discoveries in the receipt; do not investigate or repair them.

## 3. Hard scope budget

| Limit | Packet budget |
|---|---:|
| Behavior families | `1` |
| New persisted record families | `0` |
| Named state writers / feature flags / user surfaces | `0 / 0 / 0` |
| Direct consumers | `1` |
| New logic-bearing production leaves | `1` |
| Existing logic-bearing production files modified | `1` (`projection.js`) |
| Additional registration-only files | `1` |
| Handwritten files total | `5` |
| Effective lines in `massingProjection.js` | `<=100` |
| `projection.js` effective delta / final size | `<=+55 / <=312` |
| `index.js` effective delta | `<=+4` |
| Total effective production delta | `<=159` |
| New domain-test effective lines | `<=330` |
| Sovereignty-walker effective delta | `<=+12` |
| Acceptance cases / literal tests | `6 / 6` |

Overrides approved before dispatch: `NONE`. Exceeding any limit is a STOP and split.

## 4. Sealed dispatch and preflight

Run before implementation edits:

```sh
npm run implementation:dispatch -- MF-T1V
```

Expected: exact branch/base, five manifest paths, both CREATE targets absent, the MF-T1M 105-row transitive substrate plus the six live projection/draw/palette seams, and a Git-admin seal. Any mismatch makes this packet stale.

## 5. Verified tree contract

| Role | File | Symbol | Verified fact | Required use |
|---|---|---|---|---|
| Massing authority | `src/domain/townMap/fabric/massingRoster.js` | `compileOrthogonalCrossFirstSliceMassingRosterBundle` | Sole exact compiler for the two-body bundle | Invoke once with the supplied compile input and byte-compare the whole returned bundle |
| Fabric/geometry refs | MF-T1M's 105-row closure | exact inherited symbols | Owns the root, foundation, frontage, parcels, masses and origin-neutral geometries | Reuse only through MF-T1M replay; create no copied geometry |
| Fixed projection | `src/domain/townMap/fabric/projection.js` | `projectFirstSliceFixedSurvey` | Owns the landed projection behavior and exact legacy bytes | Validate legacy witnesses, then delegate to the shared core |
| Survey light | `src/domain/townMap/fabric/projection.js` | `FIXED_SURVEY_LIGHT_V1` | Fixed direction `[2,1]`, denominator `4` | Reuse unchanged for both entries |
| Screen/export seam | `src/domain/townMap/fabric/projection.js` | `firstSliceScreenDrawOps`, `firstSliceProjectionToSvg` | One ordered draw-op list feeds both consumers | Keep exact reference identity and deterministic SVG |
| SVG serializer | `src/domain/townMap/townMapDraw.js` | `drawListToSvg` | Sole self-contained SVG serializer | Call only through the existing projection adapter |
| Palette | `src/design/townMapExportPalette.js` | `EXPORT_PALETTE` | Sole fixed first-slice projection palette | Reuse unchanged; add no colors |
| Equality/digest | `src/domain/townScene/stableScene.js` | `stableSceneStringify`, `sceneDigest` | Canonical byte comparison and domain hash | Replay-compare and verify existing artifact hashes exactly |

Forbidden alternatives: no dummy `FIRST_SLICE_MAP_DOCUMENT`, no content-resolution report, hash-only bundle acceptance, caller-bundle use after replay, second silhouette/projection/draw/SVG implementation, new `PUBLIC_PROJECTION_INPUT`, PUBLIC roster/mass/package/hidden identity, barrel export of the internal core, file outside the manifest or seventh test.

## 6. Exact contracts

### Public API

```js
projectOrthogonalCrossFirstSliceMassingFixedSurvey({
  audience: 'PUBLIC' | 'DM',
  massingBundle: ExactMF_T1M_Bundle,
  massingCompileInput: ExactMF_T1M_CompileInput,
}) -> FirstSliceProjection
```

Top-level keys are exactly `audience`, `massingBundle`, `massingCompileInput`. `massingCompileInput` is the exact ten-key MF-T1M input and `massingBundle` is exactly `{ massingRoster, buildingMasses }`. Extra or missing keys refuse. The leaf exports exactly one law constant and this compiler:

```js
export const FIRST_SLICE_MASSING_PROJECTION_LAW_VERSION =
  'mf-t1v-first-slice-massing-fixed-survey-v1';
export function projectOrthogonalCrossFirstSliceMassingFixedSurvey(input) { /* ... */ }
```

The law constant and compiler are registered from `fabric/index.js`. No other new symbol is public.

### Exact replay law

1. Call `compileOrthogonalCrossFirstSliceMassingRosterBundle(massingCompileInput)` exactly once.
2. Require stable-byte equality between the complete replayed `{ massingRoster, buildingMasses }` bundle and `massingBundle`, not merely equal content hashes or refs.
3. Use only the replayed roster/masses plus the compile-input foundation/frontage witnesses proven by that replay. The caller bundle is never the projection source.
4. Preserve MF-T1M's two-body count and ordering; projection adds no form, role, parcel or origin inference.
5. Reject a wrong audience, any extra top-level key, a tampered bundle and a valid bundle paired with another valid compile input.

### Shared source-driven core

`projection.js` exposes one direct-import-only seam to the new leaf but does not register it in `fabric/index.js`:

```js
export function projectResolvedFirstSliceFixedSurvey({
  audience,
  foundation,
  frontageSubdivision,
  masses,
  unresolvedEntityIds,
  sourceDescriptor,
}) -> FirstSliceProjection

type SourceDescriptor =
  | {
      kind: 'DOCUMENT',
      document: ValidatedFirstSliceDocument,
      resolutionReport: ValidatedContentResolutionReport,
    }
  | {
      kind: 'MASSING',
      lawVersion: 'mf-t1v-first-slice-massing-fixed-survey-v1',
      massingRoster: ReplayedFirstSliceMassingRoster,
    };
```

This exact helper owns all audience filtering, final source-authority construction, artifact-ID construction, semantic primitives, shell-derived shadows, plan surfaces, draw-op construction and artifact sealing. Its two consumers are exactly the landed `projectFirstSliceFixedSurvey` wrapper and the new `massingProjection.js` leaf. `unresolvedEntityIds` is the legacy wrapper's validated report entity-ID list and is `[]` for the massing path. The helper filters that list only after it computes visible masses. A caller-supplied final `sourceAuthority`, artifact ID, visible-mass list or privacy predicate is forbidden. No callback, third consumer or barrel export is authorized.

For a `MASSING` descriptor the core constructs the audience-safe authority below first, then constructs this bounded deterministic artifact ID:

```js
`projection:${audience.toLowerCase()}:${sceneDigest({
  domain: sourceDescriptor.lawVersion,
  audience,
  sourceAuthority,
})}`
```

For a `DOCUMENT` descriptor the core constructs the existing `DM_CANONICAL | PUBLIC_DERIVATION` authority and retains the existing document-derived artifact-ID law and exact valid output bytes. The descriptor contains only the already hash/ref-validated document and report; validation stays in the legacy public wrapper.

### Source-authority and privacy law

The new DM source authority is exactly:

```js
{
  kind: 'DM_MASSING_ROSTER',
  lawVersion: sourceDescriptor.lawVersion,
  massingRosterRef: canonicalArtifactRef(massingRoster),
}
```

The new PUBLIC source authority is exactly:

```js
{
  kind: 'PUBLIC_MASSING_DERIVATION',
  lawVersion: sourceDescriptor.lawVersion,
  firstSliceFabricRootRef: massingRoster.firstSliceFabricRootRef,
  foundationRef: canonicalArtifactRef(foundation),
  frontageSubdivisionRef: canonicalArtifactRef(frontageSubdivision),
  visibleGeometryRefs: visibleMasses.map((mass) => canonicalArtifactRef(mass.geometry)),
}
```

`visibleMasses` is selected only inside the core: DM sees all replayed masses; PUBLIC sees only geometry whose privacy is `PUBLIC`. `visibleGeometryRefs` follow the core's deterministic visible-mass order. PUBLIC source authority and all PUBLIC output bytes contain no roster ref or ID, mass ref or ID, recipe/package/origin data, hidden body ID, hidden geometry ref or unresolved hidden warning. The massing path emits `warnings: []` for both audiences. Equivalent built-in/custom geometry therefore produces the exact same entire PUBLIC projection, draw ops and SVG. DM differs through `massingRosterRef` and retains authorized body identity in its semantic primitives.

### Legacy document repair

Before `projectFirstSliceFixedSurvey` reads geometry or constructs authority, it must:

1. split `document.contentHash` from the exact document body and require equality to `sceneDigest(body)`;
2. split `resolutionReport.contentHash` from the exact report body and require equality to `sceneDigest(body)`;
3. require stable-byte equality between `resolutionReport.sourceDocumentRef` and `canonicalArtifactRef(document)`;
4. only then derive the legacy unresolved-visible set and call the shared core.

No canonical rebuild, document schema change or content resolution is authorized. Valid legacy bytes must remain byte-identical, including these exact projection hashes:

- PUBLIC: `scene-v1-9820c3f2273a313f22ff9246c65e1891`
- DM: `scene-v1-1945e8a01df6c24788c3393c4e3c452d`

### Lifecycle and migration

- Both entry points are pure in-memory projections. No writer, store, load path or mutable state exists here.
- `FIRST_SLICE_PROJECTION` remains the only returned artifact kind. MF-T1V adds zero persisted families and no canonical projection ABI or provenance claim.
- The new source-authority kinds are bounded derivation records inside that existing projection, not standalone artifacts or persistence contracts.
- Later document/schema integration or canonical projection promotion must be separately sealed and may emit new bytes; it cannot relabel this bounded path.

## 7. Exact change manifest

| Action | File | Symbol/region | Maximum delta | Coding instruction |
|---|---|---|---:|---|
| CREATE | `src/domain/townMap/fabric/massingProjection.js` | law and direct compiler | `100` | Exact MF-T1M replay, closed MASSING descriptor and shared-core call only |
| MODIFY | `src/domain/townMap/fabric/projection.js` | validation plus shared core | `+55`; final `312` | Validate legacy hashes/ref, extract the existing math once and preserve old bytes |
| REGISTER | `src/domain/townMap/fabric/index.js` | massing-projection exports | `+4` | Export only the new law and direct compiler; do not export the core |
| CREATE | `tests/domain/townMapMassingProjection.test.js` | A1-A6 | `330` | Exactly six literal tests and the bounded A2 refusal rows |
| MODIFY | `tests/lint/sovereigntyLightingContract.walker.test.js` | exact census | `+12` | Record only the one-file/six-title/one-suite movement |

Generated artifacts: `NONE`. No other file may be edited.

## 8. Ordered coding sequence

0. Dispatch and seal; stop on any mismatch.
1. Pin both valid legacy projection hashes, the MF-T1M bundle hash and current sovereignty census.
2. Add exactly A1-A6.
3. Extract the existing projection body into the one shared source-driven core without changing calculations or ordering.
4. Add legacy document/report digest and exact source-ref validation before the old wrapper calls the core.
5. Implement the direct leaf's exact MF-T1M replay, closed MASSING descriptor and core call.
6. Register only the two new public symbols; run focused verification, sealed packet checks and the whole-tree landing tail.

## 9. Acceptance matrix

| ID | Case | Required observation | Home |
|---|---|---|---|
| A1 | Exact two-body projection | one frozen `FIRST_SLICE_PROJECTION`; fixed light unchanged; exactly `18` primitives/draw ops with `GROUND 4`, `FRONTAGE 8`, `SHADOW 2`, `BUILDING 3`, `ROOF_RIDGE 1`; rectilinear shadow has `4` vertices and composite shadow has `10` including `[850,670]` | domain |
| A2 | Replay/ref closure and refusal | full MF-T1M replay is byte-equal; every DM roster ref and PUBLIC Fabric/foundation/frontage/visible-geometry ref resolves exactly once; one bounded table refuses tampered bundle, mixed valid compile input, wrong audience and extra input key | domain |
| A3 | One projection/draw/export path | both public entries call the sole shared core; only that core filters privacy and constructs final authority/ID; screen returns the exact `drawOps` reference; SVG consumes that list and is deterministic; new leaf contains no visibility, silhouette, shadow, primitive, authority, palette or SVG math | domain |
| A4 | Built-in/custom parity | equivalent INSTITUTION geometry is equal through geometry, semantic primitives, draw ops, SVG and the entire PUBLIC projection; origin-bound mass/roster hashes and DM source authority remain different | domain |
| A5 | PUBLIC/DM privacy | hidden body ID, geometry, mass, roster and package identity are absent from PUBLIC before draw-op creation; moving only the hidden body ID leaves PUBLIC projection/SVG byte-equal; DM retains it and binds the roster | domain |
| A6 | Determinism and legacy barrier | repeat, reversed MF-T1M body inputs, canonical JSON replay and maximum roster ID are byte-safe; legacy PUBLIC/DM hashes stay `scene-v1-9820c3f2273a313f22ff9246c65e1891` / `scene-v1-1945e8a01df6c24788c3393c4e3c452d`; hash-correct-looking forged document/report and wrong `sourceDocumentRef` refuse; no excluded authority appears | domain |

This table is the entire edge-case budget. A2's four refusal classes and A6's three legacy forgeries stay inside their literal tests. Do not add fuzzing, a cross-product or a seventh title.

## 10. Verification commands

```sh
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/domain/townMapMassingProjection.test.js \
  tests/domain/townMapMassingRoster.test.js \
  tests/domain/townMapExplicitBuilding.test.js \
  tests/domain/townMapCustomParity.test.js \
  tests/property/townMapFirstSliceDeterminism.test.js
npx eslint src/domain/townMap/fabric/massingProjection.js \
  src/domain/townMap/fabric/projection.js src/domain/townMap/fabric/index.js \
  tests/domain/townMapMassingProjection.test.js \
  tests/lint/sovereigntyLightingContract.walker.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict
npm run validate:packets
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/lint/sovereigntyLightingContract.walker.test.js \
  tests/lint/negativeAssertionAnchor.walker.test.js
npm run check:packet -- MF-T1V
npm run implementation:resume -- MF-T1V
npm run check:tail
```

## 11. Mandatory STOP conditions

Stop on any bundle accepted without complete MF-T1M replay; caller-bundle use after replay; caller-supplied final authority/artifact ID/visible list, callback or duplicate privacy predicate outside the core; PUBLIC roster/mass/package/origin/hidden identity or fingerprint; dummy document/report/content adapter; second projection/shadow/draw/SVG math; barrel-exported core; moved valid legacy projection hash; missing legacy hash or source-ref validation; new artifact kind; persistence/migration/fantasy/sampling/UI/citywide-fill/new-shape work; file outside the manifest; seventh test; budget breach; ratchet raise; or unrelated gate failure requiring repair.

## 12. Completion receipt

- Base SHA: `838710e93665d743a7a3d7c517f072fa91e192cf`
- Dispatch bundle and seal identity: `PENDING`
- Final commit or working-tree state: `PENDING`
- Effective-line ledger: `PENDING`
- A1-A6 evidence: `PENDING`
- Adjacent discoveries: `PENDING`
