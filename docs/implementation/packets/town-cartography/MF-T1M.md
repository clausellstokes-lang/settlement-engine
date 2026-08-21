# First-Slice Massing / MF-T1M — explicit varied massing roster bundle

- **Status:** READY
- **Packet version:** `1`
- **Verified base:** `codex/first-map-vertical-slice` at `8ba553a32d0fbc4408d0243dff514d7eef0b6b6a`
- **Last revalidated:** `2026-08-20` at `8ba553a32d0fbc4408d0243dff514d7eef0b6b6a`
- **Depends on:** MF-T1F at `325e16aaebb63cb3304443c3a92da27860c655af`; MF-SH1 at `3cf12008e1d4ea7411a61f59b8e633a7b993dd1f`; MF-VS1 at `7c34f50fd99fcf34c478ec56cbae42240bcd7486`
- **Collision group:** `town-map-first-slice-massing`
- **Commit authority:** agent may stage and commit the exact manifest; no push
- **Baseline posture:** MF-T1F wave-end gate passed with `28,616` tests and the inherited `11` known failures; both typecheck ratchets, lint, build, `314`-route prerender and strict `409/409` dist passed; terminal governance validates `125` packets with zero READY before this promotion

## 1. Reconciled authority

1. The owner freezes dossier-conditioned deterministic sampling as `constraints -> plausible candidates -> hard rejection -> weighted selection -> deterministic compiler`. Weights never create plausibility and geometry consumes no random draw.
2. This tree does not yet own a canonical dossier snapshot/ref, seed-authority artifact/ref or selection-receipt family. A root hash, settlement ID, free seed string, legacy `_seed` fallback or mutable settlement object cannot substitute for those authorities.
3. MF-T1M therefore implements only the terminal deterministic compiler stage. It accepts exactly two explicit body specifications and performs no candidate construction, weighting or selection.
4. MF-SH1 remains the sole bounded nonrectangular compiler. MF-T1M reuses its explicit rectilinear/gable and rectangular-attachment plus circular/cylindrical/conical paths; it adds no geometry vocabulary.
5. MF-T1F remains the exact transitional Fabric join. MF-T1M replays it from all seven witnesses before binding any body to a parcel.
6. The full `CanonicalArchitecturalMassingPhase` requires authorities and records not present in this slice. This packet publishes `FIRST_SLICE_MASSING_ROSTER`, never `MASSING_PHASE`.

Resolved contradictions:

- A single institution-building binding is superseded: it would leave the ordinary and composite masses without one collection owner and force a second registry family immediately.
- A roster-only return is superseded: its mass refs would not resolve in the returned value. The sole compiler returns a non-artifact bundle containing the roster and its two sibling mass artifacts.
- Inline masses inside the roster are forbidden: they would make the reference roster a second owner of geometry.
- Immediate sampling is deferred until genuine dossier, seed and choice-receipt authorities land. The orthogonal-cross golden and the two explicit specifications remain exact controls, not an alleged distribution.

The implementer does not read other documents to widen this packet.

## 2. Outcome

**Observable result:** one pure compiler replays the landed Fabric root, compiles exactly two explicit parcel-bound masses, and returns one frozen non-artifact bundle containing those sibling mass artifacts plus one reference-only `FIRST_SLICE_MASSING_ROSTER`.

**Definition of done:** the bundle contains exactly one explicit rectilinear/gabled `BUILDING` and one explicit rectangular-attachment plus circular/cylindrical/conical `INSTITUTION`, on distinct landed parcels, with every roster ref resolving exactly once and with no inferred, sampled or copied geometry.

In scope:

1. A closed, versioned `BUILDING | INSTITUTION` spatial-recipe role, with omitted or explicit `BUILDING` preserving existing schema-v1 bytes and explicit `INSTITUTION` using schema v2.
2. Exact MF-T1F replay and two explicit `{spec, recipeSnapshot, origin}` body inputs.
3. Two sibling `CANONICAL_BUILDING_MASS` artifacts plus one reference-only roster, exact parcel joins, deterministic order and recursive freeze.
4. Six bounded acceptance cases and no more.

Explicit non-goals:

- dossier reads, terrain/site/growth candidates, PRNGs, seeds, weights, rejection rosters, selection receipts or probability claims;
- citywide building fill, institution selection/siting/multiplicity, `institutionRef`, adjacency, ownership, use inference, historical prevalence or cultural-authenticity claims;
- new plan/solid/roof kinds, arbitrary booleans, concavity, domes, apses, spires, local lights or projection changes;
- `MASSING_PHASE`, canonical-spatial promotion, a unified coordinate ABI, provenance, change operations, persistence, reload, editing, UI/workers or export cutover.

Record adjacent discoveries in the receipt; do not investigate or repair them.

## 3. Hard scope budget

| Limit | Packet budget |
|---|---:|
| Behavior families | `1` |
| New persisted record families | `1` (`FIRST_SLICE_MASSING_ROSTER`) |
| Named state writers / feature flags / user surfaces | `0 / 0 / 0` |
| Direct consumers | `0` |
| New logic-bearing production leaves | `1` |
| Existing logic-bearing production files modified | `1` (`building.js`) |
| Additional registration-only files | `1` |
| Handwritten files total | `6` |
| New/changed effective production lines | `<=240` |
| Effective lines in the new leaf | `<=230` |
| `building.js` effective delta | `<=6` |
| Shared/hot-file delta | `<=12` (census only) |
| Fixture delta | `<=120` |
| Acceptance cases | `6` |

Overrides approved before dispatch: `NONE`. Exceeding a limit is a STOP and split.

## 4. Sealed dispatch and preflight

Run before implementation edits:

```sh
npm run implementation:dispatch -- MF-T1M
```

Expected: exact branch/base, six manifest paths, absent CREATE targets, clean existing targets, live MF-T1F/MF-SH1/MF-VS1 substrate and a Git-admin seal. Any mismatch makes this packet stale.

## 5. Verified tree contract

| Role | File | Symbol | Verified fact | Required use |
|---|---|---|---|---|
| Fabric authority | `src/domain/townMap/fabric/fabricRoot.js` | `compileOrthogonalCrossFirstSliceFabricRoot` | Replays the exact seven-witness root | Rebuild and byte-compare the supplied root |
| Parcel authority | `src/domain/townMap/fabric/parcelRegistry.js` | `compileOrthogonalCrossParcelRegistry` | Owns the eight exact parcel/plot/frontage/face bindings | Resolve each body parcel exactly once |
| Geometry authority | `src/domain/townMap/fabric/building.js` | `compileExplicitBuildingMass` | Sole origin-neutral explicit mass compiler/binder | Invoke exactly once per body input |
| Recipe/origin authority | `src/domain/townMap/fabric/building.js` | `createSpatialRecipeSnapshot`, `createCanonicalOrigin` | Own package recipe identity and origin identity | Replay both inputs before mass compilation |
| Shape authority | `src/domain/townMap/fabric/shapes.js` | MF-SH1 constants and compiler | Owns the bounded composite shell path | Inspect only to validate the admitted golden form |
| Equality | `src/domain/townScene/stableScene.js` | `stableSceneStringify` | Stable byte equality without freezing callers | Compare replayed artifacts |
| Fixture chain | `tests/fixtures/townMapSettlementFabricFixtures.js` | `makeSettlementFabricRoot` | Builds one exact seven-witness Fabric chain | Extend once; duplicate no source bytes |
| Regression precedents | MF-T1F, MF-SH1 and MF-VS1 suites | exact suite titles | Pin replay, shape, parity and no-default behavior | Keep their source hashes and behavior green |

Forbidden alternatives: no alternate geometry compiler, mass-from-name selector, institution classifier, random stream, mutable dossier/world read, free seed/dossier scalar, hash-only Fabric acceptance, inline roster geometry, roster-only dangling refs, `MASSING_PHASE`, generic resolver/store, file outside the manifest or seventh acceptance case.

## 6. Exact contracts

### Spatial recipe role

`createSpatialRecipeSnapshot` accepts optional `spatialRole`. The closed values are exactly `BUILDING` and `INSTITUTION`. Omitted or explicit `BUILDING` emits the existing `SPATIAL_RECIPE_SCHEMA_VERSION = 1` bytes exactly. Explicit `INSTITUTION` alone emits `INSTITUTION_SPATIAL_RECIPE_SCHEMA_VERSION = 2`. Hash-correct schema-v1 `INSTITUTION` and schema-v2 `BUILDING` snapshots are invalid. The role is identity/semantic metadata only; geometry selection continues to depend solely on the explicit registered geometry law and explicit specification.

### Compiler input and return

```js
compileOrthogonalCrossFirstSliceMassingRosterBundle({
  artifactId: EntityId,
  foundation: ExactSettlementFoundation,
  frontageSubdivision: ExactSettlementFrontageSubdivision,
  streetGeometry: ExactStreetGeometry,
  streetGraph: ExactStreetGraph,
  boundaryArrangement: ExactCadastralBoundaryArrangement,
  planarDcel: ExactPlanarDcel,
  parcelRegistry: ExactParcelRegistry,
  firstSliceFabricRoot: ExactFirstSliceFabricRoot,
  bodyInputs: readonly [ExplicitBodyInput, ExplicitBodyInput],
}) -> Readonly<{
  massingRoster: FirstSliceMassingRoster,
  buildingMasses: readonly [CanonicalBuildingMass, CanonicalBuildingMass],
}>

type ExplicitBodyInput = Readonly<{
  spec: ExplicitRectilinearSpec | ExplicitCompositeSpec,
  recipeSnapshot: SpatialRecipeSnapshot,
  origin: CanonicalOrigin,
}>

type FirstSliceMassingRoster = Readonly<{
  artifactKind: 'FIRST_SLICE_MASSING_ROSTER',
  artifactId: EntityId,
  schemaVersion: 1,
  lawVersion: 'mf-t1m-orthogonal-cross-first-slice-massing-roster-v1',
  settlementId: EntityId,
  effectiveAt: string,
  mapTraditionId: 'EUROPEAN_FANTASY_BASE',
  leafIndex: 0,
  firstSliceFabricRootRef: ArtifactHashRef,
  parcelRegistryRef: ArtifactHashRef,
  bodyBindings: readonly [BodyBinding, BodyBinding],
  contentHash: ContentHash,
}>

type BodyBinding = Readonly<{
  bodyId: EntityId,
  bodyKind: 'BUILDING' | 'INSTITUTION',
  semanticTypeId: EntityId,
  parcelRef: ArtifactHashRef & { parcelId: EntityId },
  massRef: ArtifactHashRef,
}>
```

Input keys are exactly `artifactId`, `foundation`, `frontageSubdivision`, `streetGeometry`, `streetGraph`, `boundaryArrangement`, `planarDcel`, `parcelRegistry`, `firstSliceFabricRoot`, `bodyInputs`. Each body input has exactly `spec`, `recipeSnapshot`, `origin`. The outer bundle is deliberately not an artifact and has no hash or ID.

### Replay, classification and ownership law

1. Recompile `firstSliceFabricRoot` with its artifact ID and all seven supplied witnesses; require stable byte equality.
2. Rebuild each recipe snapshot from its own closed source fields, including explicit or defaulted spatial role; require stable byte equality.
3. Rebuild each origin through `createCanonicalOrigin`; require stable byte equality.
4. Invoke `compileExplicitBuildingMass` exactly once per body input using the replayed recipe/origin and supplied explicit spec.
5. Canonical-sort the two returned masses by `geometry.buildingId`. Building IDs and plot/parcel IDs are each distinct.
6. Resolve every `geometry.plotRef` to exactly one parcel-registry row whose `plotRef` is byte-equal; require the geometry foundation ref to equal the supplied frontage foundation ref.
7. `bodyId === geometry.buildingId`; `bodyKind === recipeSnapshot.semantics.spatialRole`; semantic IDs agree across recipe, geometry and binding.
8. The `BUILDING` input is exactly the explicit rectilinear `GABLE` mass. The `INSTITUTION` input is exactly the MF-SH1 composite with one rectilinear/gabled attachment plus one `CIRCULAR` / `CYLINDER` / `CONICAL` tower. This is validation of the two explicit golden specifications, never role-to-form generation.
9. Seal only the reference roster. `buildingMasses` are sibling artifacts in the frozen outer bundle; each `massRef` resolves exactly once there. Neither sibling owns the other.

The compiler never reads package class or origin kind to choose geometry. The explicit spec and registered geometry law are already selected before it runs.

### Sampling boundary

MF-T1M imports no PRNG or RNG context and serializes no dossier, seed, candidates, weights, rejection reasons, draw or choice receipt. The later sampler sequence is frozen as:

1. a genuine canonical dossier/selection-context projection plus seed/provenance authority;
2. one separate selection artifact with codepoint-sorted candidates, named hard rejections, positive registered weights, a domain-separated draw and a complete receipt;
3. the chosen explicit body inputs;
4. this unchanged deterministic compiler.

### Lifecycle, privacy and migration

- Create/read is pure in-memory compile and exact resolution only. Callers retain or persist the roster and both sibling masses together.
- Persistence, reload, editing, undo, import, projection and export have no writer/consumer in this packet.
- Privacy remains an explicit property inside each mass geometry. The roster does not filter, copy or infer it.
- `FIRST_SLICE_MASSING_ROSTER` cannot satisfy `MASSING_PHASE`; it has no unified coordinate ABI, provenance, change-operation roster or world-institution ref.
- Later canonical promotion emits new bytes/hash and does not relabel this roster.

## 7. Exact change manifest

| Action | File | Symbol/region | Maximum delta | Coding instruction |
|---|---|---|---:|---|
| CREATE | `src/domain/townMap/fabric/massingRoster.js` | schema/law/bundle compiler | `230` | Replay sources, compile two sibling masses and seal the ref-only roster |
| MODIFY | `src/domain/townMap/fabric/building.js` | spatial recipe role | `+6` | Add the closed optional role while preserving omitted BUILDING bytes |
| REGISTER | `src/domain/townMap/fabric/index.js` | massing-roster exports | `+4` | Export schema/law/role/compiler only |
| MODIFY | `tests/fixtures/townMapSettlementFabricFixtures.js` | explicit two-body fixture | `+120` | Extend the one Fabric chain with exact rectilinear and composite inputs |
| CREATE | `tests/domain/townMapMassingRoster.test.js` | A1-A6 | `360` | Exactly six literal tests; no separate property suite |
| MODIFY | `tests/lint/sovereigntyLightingContract.walker.test.js` | exact census | `+12` | Record only the one-file/six-title/one-suite movement |

Generated artifacts: `NONE`. No other file may be edited.

## 8. Ordered coding sequence

0. Dispatch and seal; stop on any mismatch.
1. Capture all predecessor hashes, omitted-role recipe hash and current sovereignty census.
2. Add exactly A1-A6.
3. Add the byte-stable optional recipe role.
4. Implement root/recipe/origin replay, exact mass compilation, parcel joins and the ref-only roster bundle.
5. Register exports and fixture.
6. Run focused verification, sealed packet checks and the whole-tree landing tail.

## 9. Acceptance matrix

| ID | Case | Required observation | Home |
|---|---|---|---|
| A1 | Exact varied bundle | two sibling masses and two sorted bindings; the BUILDING is the rectilinear/gabled form and the INSTITUTION is the circular/cylindrical/conical composite; distinct parcels; recursive freeze | domain |
| A2 | Replay/ref closure | full MF-T1F, recipe and origin replay; every root/parcel/mass ref resolves exactly once; roster contains no geometry/spec/recipe/origin copy | domain |
| A3 | Neutrality and byte stability | omitted and explicit BUILDING reproduce the landed v1 recipe/hash; built-in/custom v2 versions of the same INSTITUTION compile equal geometry; role and origin never select form | domain |
| A4 | Closed refusal | one finite nine-row matrix rejects wrong root hash, one valid mixed Fabric chain, hash-correct v1-INSTITUTION, hash-correct v2-BUILDING, wrong body count, duplicate body ID, duplicate parcel, a BUILDING/INSTITUTION form swap and one extra input key | domain |
| A5 | Determinism/purity | repeat, reversed body-input order, reversed upstream cell order, canonical JSON replay and maximum roster ID are byte-safe and leave every caller witness/input unfrozen and unchanged | domain |
| A6 | Transitional and sampling barrier | predecessor hashes and exact key rosters remain pinned; no `MASSING_PHASE`, `fabricRef`, unified ABI, provenance, institution ref, copied geometry, dossier, seed, weights, candidates, PRNG, choice receipt, projection or persistence authority | domain |

This table is the entire edge-case budget. A4 stays exactly nine rows inside one literal test. Do not add fuzzing or a cross-product.

The sovereignty forecast for one credited file, six titles and one suite is `2482 / 364 / 2118 / 20582 / 5765`; remeasure once and do not cite a base-state constant in the walker.

## 10. Verification commands

```sh
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/domain/townMapMassingRoster.test.js \
  tests/domain/townMapFabricRoot.test.js \
  tests/property/townMapFabricRootDeterminism.test.js \
  tests/domain/townMapShapeKernel.test.js \
  tests/domain/townMapExplicitBuilding.test.js \
  tests/domain/townMapCustomParity.test.js
npx eslint src/domain/townMap/fabric/massingRoster.js \
  src/domain/townMap/fabric/building.js src/domain/townMap/fabric/index.js \
  tests/fixtures/townMapSettlementFabricFixtures.js \
  tests/domain/townMapMassingRoster.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict
npm run validate:packets
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/lint/sovereigntyLightingContract.walker.test.js \
  tests/lint/negativeAssertionAnchor.walker.test.js
npm run check:packet -- MF-T1M
npm run implementation:resume -- MF-T1M
npm run check:tail
```

## 11. Mandatory STOP conditions

Stop on source/recipe/origin replay mismatch; any need for a dossier/seed placeholder, PRNG, candidate generator, choice receipt, second geometry compiler, third body, inline roster geometry, roster-only dangling mass ref, `MASSING_PHASE`, unified coordinate ABI, provenance/world-institution fabrication, file outside the manifest, seventh case, budget breach, ratchet raise or unrelated gate failure requiring repair.

## 12. Completion receipt

- Base SHA: `8ba553a32d0fbc4408d0243dff514d7eef0b6b6a`
- Dispatch bundle and seal identity: PENDING
- Final commit or working-tree state: PENDING
- Exact changed files and effective-line deltas: PENDING
- A1-A6 results: PENDING
- Focused commands, exits and counts: PENDING
- Sealed packet/resume status: PENDING
- Typecheck ratchets: PENDING
- Wave-end gate stages: PENDING
- Base-versus-wave failure identity diff: PENDING
- Source and output byte pins: PENDING
- Generated artifacts: `NONE`
- Deviations: `NONE` expected
- Out-of-scope observations: canonical dossier/selection-context, seed authority, provenance and complete choice-receipt families block the separate upstream sampler; canonical `MASSING_PHASE` promotion remains later
- Judgment calls: the outer bundle is not an artifact; it makes sibling mass refs resolvable without giving the roster a second copy of geometry
