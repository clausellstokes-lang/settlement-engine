# First-Slice Fantasy Construction / MF-T1X — one saved-byte explicit-canon operation

- **Status:** LANDED
- **Landed commit:** f4ad467d889ce5467a96604f28f2c49aaafcef57
- **Packet version:** 1
- **Verified base:** codex/first-map-vertical-slice at 39715d75a64819ee125148192cdc541e9f8992c9
- **Last revalidated:** 2026-08-21 at f4ad467d889ce5467a96604f28f2c49aaafcef57
- **Depends on:** MF-T1S at 136efaa5b636570fc4fd2aa45dbf654bef3f2769; MF-T1V at 66dbed7c41f9bafc48e738badd7c053e3009f649; MF-T1M at bffd1bcb7a8bc2087d467e6dc73de42641f717e2; MF-VS1 at 7c34f50fd99fcf34c478ec56cbae42240bcd7486
- **Collision group:** town-map-first-slice-saved-fantasy-construction
- **Commit authority:** LANDED; do not redispatch
- **Baseline posture:** MF-T1S landed, passed its whole-tree tail, and terminalized on a clean tree with 128 packets / 0 READY; its saved document, exact active-snapshot resolution, fixed-survey projection, privacy hashes and stop boundary are the predecessor contract

> While READY, this packet alone defined coding authority. Design files, queues,
> progress notes, commit subjects and briefs could not expand it. It has now
> landed at the commit above, is terminal and must not be redispatched.

> Family-preamble ruling: town-cartography has no family preamble, and the
> immediate MF-T1M, MF-T1V and MF-T1S predecessors were promoted and landed in
> the same three-governance-file form. That measured local precedent controls
> MF-T1X. The absent family preamble is not a dispatch blocker and this packet
> does not invent a fourth governance file.

## 1. Reconciled authority

1. MF-T1M remains the sole compiler and owner of the exact two-body base massing roster. A fantasy operation cannot widen or relabel that roster.
2. MF-T1S remains the sole persisted first-slice massing document. Mutation begins from its canonical saved bytes and active installed-snapshot view, never from a caller-supplied loaded envelope or read-only flag.
3. The legacy `executeFantasyConstruction({ loaded, operation, mechanismRegistry })` trusts caller-owned `loaded.readOnly`, operates on the legacy masses-only document, does not replay its mechanism/operation/recipe/origin artifacts, and permits ambiguous registry and placement authority. The existing public name is retargeted to the exact saved-byte request; the old envelope is rejected and no compatibility overload survives.
4. The existing fantasy mechanism and operation creators remain the vocabulary seam, but become opaque-input, snapshot-once and replay-closed. Legacy semantic-list mechanism bytes remain reproducible compatibility data, while MF-T1X execution requires a v2 mechanism bound to one exact spatial-recipe ref. Historical evidence and probability authority never enter either contract.
5. One successful call derives one sealed `FIRST_SLICE_MASSING_CONSTRUCTION_STATE` containing the unchanged two base masses plus exactly one explicit third mass. It does not create a new saved-document schema, append to the MF-T1M roster, or start a general event log.
6. The construction receipt is an external acyclic artifact. The state never embeds the base document, operation, mechanism or receipt; the receipt points to the state rather than the state pointing back to the receipt.
7. The saved fantasy projector re-executes the operation internally and reaches the existing source-driven fixed-survey core. It creates no second visibility, light, shadow, primitive, draw-op or SVG path.
8. The added fixture mass is `DM`, uses one replayed `BUILT_IN` recipe and one replayed `AUTHORED` origin, and occupies one previously unused parcel. Therefore the entire PUBLIC projection/draw/SVG remains byte-identical to the resolved MF-T1S before projection while DM gains the real third shell and shadow.

Resolved contradictions:

- Widening `FIRST_SLICE_MASSING_ROSTER` from two bodies to three is forbidden; its exact two-body law and golden compiler remain a predecessor barrier.
- Widening `FIRST_SLICE_MASSING_DOCUMENT` with operation state is forbidden; the after-state is deterministic derived output, not a second persistence revision.
- Keeping the caller-loaded executor signature as an overload or second alias is forbidden. The existing source and barrel symbol remain, with only the saved-byte contract executable.
- Accepting a caller-provided construction state, receipt, loaded document, resolution report, read-only flag, source authority or visible-mass list is forbidden.
- Projecting a supplied after-state is forbidden. The projector accepts the same saved bytes and operation authority and executes them itself.
- A third renderer, fantasy-only geometry compiler, random form chooser, dossier default or historical prevalence claim is forbidden.

The implementer does not read other documents to widen this packet.

## 2. Outcome

**Observable result:** from one canonical MF-T1S saved document and its exact active snapshots, headless code validates one registered `EXPLICIT_FANTASY_CANON` mechanism, replays one explicit construction operation, compiles one DM-private built-in mass on the free first-slice parcel, seals a three-mass derived state and external receipt, and projects that execution through the landed screen/SVG path.

**Definition of done:** the executor and projector each accept one exact opaque saved-byte request; every nested artifact replays; the executing mechanism is v2 and binds the operation's exact recipe ref; unresolved base custom content refuses mutation; the base document and roster remain byte-exact; state and receipt are acyclic and digest-bounded; building, plot and construction-operation collisions refuse; repeat execution is byte-identical; PUBLIC before/after projection and SVG are byte-identical; DM binds the before document, load-produced report, after state and receipt and renders the added shell-derived shadow.

In scope:

1. Replay-hardening the existing registered mechanism and operation creators.
2. Retargeting the existing executor name to one exact saved-byte contract; the caller-loaded envelope refuses.
3. One saved-byte execution path returning exactly `{ constructionState, receipt }`.
4. One sealed, derived, three-mass `FIRST_SLICE_MASSING_CONSTRUCTION_STATE` and the existing external fantasy receipt kind.
5. One saved-byte fantasy projection entry and one `MASSING_CONSTRUCTION_STATE` descriptor branch in the existing projection core.
6. Migration of the two existing legacy-executor test callers, with exactly A1-A6 in the existing fantasy suite and no new title in the shape-kernel suite.
7. The exact four-title sovereignty-census movement.

Explicit non-goals:

- a second operation, operation chaining, undo/redo, demolition, replacement, abandonment, reconstruction, event logs or general editing;
- state save/load, document migration, database/store/package-manager work, real install/uninstall or registry mutation;
- changes to MF-T1M body count, MF-T1S bytes/schema, base masses, roster bindings or compile input;
- dossier, terrain, site, growth, age, candidates, weights, PRNGs, seeds, sampling or choice receipts;
- custom or imported fantasy construction, PUBLIC fantasy construction, inferred form, new shape/roof/light/material grammar or historical-prevalence authority;
- UI, workers, canvas/PDF product cutover, screenshots, browser proof, deployment or citywide fill.

Record adjacent discoveries in the receipt; do not investigate or repair them.

## 3. Hard scope budget

| Limit | Packet budget |
|---|---:|
| Behavior families | 1 |
| New persisted record families | 0 |
| New derived canonical-state families / new receipt families | 1 / 0 |
| Named state writers / feature flags / user surfaces | 1 / 0 / 0 |
| Direct production consumers | 1 |
| New logic-bearing production leaves | 0 |
| Existing logic-bearing production files modified | 3 (`operations.js`, `massingProjection.js`, `projection.js`) |
| Additional registration-only files | 1 |
| Handwritten files total | 7 |
| `operations.js` effective delta / final size | <=+190 / <=321 |
| `massingProjection.js` effective delta / final size | <=+65 / <=148 |
| `projection.js` effective delta / final size | <=+55 / <=374 |
| `index.js` effective delta / final size | <=+15 / <=112 |
| Total effective production delta | <=325 |
| `townMapFantasyConstruction.test.js` effective delta / final size | <=+310 / <=390 |
| `townMapShapeKernel.test.js` effective delta / final size | <=+20 / <=268; expected to shrink |
| Sovereignty-walker effective delta | <=+12 |
| Acceptance cases / literal fantasy tests | 6 / 6 |

Measured pre-edit effective sizes are `operations.js 131`, `massingProjection.js 83`, `projection.js 319`, `index.js 97`, `townMapFantasyConstruction.test.js 80`, and `townMapShapeKernel.test.js 248`. Overrides approved before dispatch: NONE. Exceeding any limit is a STOP and split.

The current sovereignty census is `2484 / 364 / 2120 / 20594 / 5767`. The closed forecast is `2484 / 364 / 2120 / 20598 / 5767`: the existing fantasy file moves from two to six literal tests, the suite count does not move, and the shape-kernel title is renamed or rewired without adding a title. The implementer must rederive the whole census rather than inherit this forecast.

## 4. Sealed dispatch and preflight

Run before implementation edits:

~~~sh
npm run implementation:dispatch -- MF-T1X
~~~

Expected: exact branch/base, seven manifest paths, the exact 156-row current-only required-symbol substrate, no retirement rows, and a Git-admin seal. No future MF-T1X symbol may appear in that substrate. Any mismatch makes this packet stale.

Before coding:

1. Require `39715d75a64819ee125148192cdc541e9f8992c9` as an ancestor and a clean tree. HEAD may be only the committed three-file MF-T1X governance-promotion descendant; base-to-HEAD may change no implementation target or required-symbol substrate.
2. Pin MF-T1S exact-installed saved PUBLIC/DM at `scene-v1-b90080500e9e0a99b6ee469444832743` / `scene-v1-47ec385c5ea913fbad576ef8cc2d2219`; direct MF-T1V PUBLIC/DM at `scene-v1-2f65d0d84551c889da48e08ceb1eb27f` / `scene-v1-bc2930de2297900d8715aa32b1a884c3`; legacy document PUBLIC/DM at `scene-v1-9820c3f2273a313f22ff9246c65e1891` / `scene-v1-1945e8a01df6c24788c3393c4e3c452d`; plus effective sizes and the whole sovereignty census.
3. Prove the existing executor source and barrel symbols are both present before coding and named in the required closure; the name is preserved while its accepted request changes.
4. Prove all 156 current-only required-symbol rows byte-present. Do not add any future state or fantasy-projector symbol to the READY closure.

## 5. Verified tree contract

| Role | File | Symbol | Required use |
|---|---|---|---|
| Saved source | `src/domain/townMap/fabric/content.js` | `loadFirstSliceMassingDocument` | Load canonical bytes and validate active installed snapshots internally; trust no caller envelope |
| Base mutability | `src/domain/townMap/fabric/content.js` | MF-T1S read-only derivation | Refuse execution when the internal load has any unresolved custom content |
| Base roster | `src/domain/townMap/fabric/massingRoster.js` | `compileOrthogonalCrossFirstSliceMassingRosterBundle` | Preserve exact two-body replay through the MF-T1S load; never call it with three bodies |
| Explicit mass | `src/domain/townMap/fabric/building.js` | `createSpatialRecipeSnapshot`, `createCanonicalOrigin`, `compileExplicitBuildingMass` | Replay nested authority, then compile the third mass once with the landed compiler |
| Legacy fantasy seam | `src/domain/townMap/fabric/operations.js` | mechanism/operation creators and unsafe executor | Harden the creators; add v2 exact-recipe binding; retarget the executor name to the sole saved-byte writer |
| Canonical artifacts | `src/domain/townMap/fabric/foundation.js` | `canonicalArtifactRef`, `deepFreezeCanonical`, `sealCanonicalArtifact` | Exact refs, acyclic sealed state/receipt, and frozen result envelope |
| Canonical bytes | `src/domain/townScene/stableScene.js` | `stableSceneStringify`, `sceneDigest` | Snapshot once, replay-compare, sort and derive bounded IDs |
| Shared wrapper | `src/domain/townMap/fabric/massingProjection.js` | saved MF-T1S wrapper and private prepared-massing helper | Re-execute internally and become the helper's third bounded consumer |
| Projection core | `src/domain/townMap/fabric/projection.js` | `projectResolvedFirstSliceFixedSurvey` | Add one descriptor branch; retain all geometry/light/draw/SVG math |
| Screen/export | `src/domain/townMap/fabric/projection.js` | `firstSliceScreenDrawOps`, `firstSliceProjectionToSvg` | Preserve exact draw-op reference identity and deterministic SVG |

Forbidden alternatives: caller-loaded or caller-readOnly execution, overloading or aliasing the old request, executable semantic-list mechanism, new production leaf, new saved document, three-body roster compile, embedded base document/operation/mechanism/receipt, state/receipt cycle, unvalidated registry row, artifactId-only matching, second mass compiler, copied base geometry, second privacy or projection path, unbounded ID, file outside the manifest, or seventh fantasy test.

## 6. Exact public contracts

`operations.js` preserves and replay-hardens these existing public symbols:

~~~js
export const FANTASY_CONSTRUCTION_OPERATION_KIND = 'CONSTRUCT_EXPLICIT_BUILDING';
export const FANTASY_CANON_GATE = 'EXPLICIT_FANTASY_CANON';
export function registerFantasyConstructionMechanism(input) {}
export function createFantasyConstructionOperation(input) {}
~~~

It retargets this existing public symbol:

~~~js
export function executeFantasyConstruction(input) {}
~~~

It adds exactly these state constants:

~~~js
export const FIRST_SLICE_MASSING_CONSTRUCTION_STATE_SCHEMA_VERSION = 1;
export const FIRST_SLICE_MASSING_CONSTRUCTION_STATE_LAW_VERSION =
  'mf-t1x-first-slice-massing-construction-state-v1';
~~~

The new executor accepts one opaque value, snapshots it exactly once before reading any field, and requires exactly:

~~~js
{
  bytes,
  installedRecipeSnapshots,
  operation,
  mechanismRegistry,
}
~~~

Missing or extra keys refuse. There is no `loaded`, `document`, `resolutionReport`, `readOnly`, `constructionState`, `receipt`, `massingBundle`, `compileInput`, `sourceAuthority`, `visibleMasses` or callback input.

`massingProjection.js` adds exactly:

~~~js
export const FIRST_SLICE_MASSING_CONSTRUCTION_PROJECTION_LAW_VERSION =
  'mf-t1x-first-slice-massing-construction-fixed-survey-v1';
export function projectSavedFirstSliceMassingFantasyConstructionFixedSurvey(input) {}
~~~

The projector accepts one opaque value, snapshots it exactly once, and requires exactly:

~~~js
{
  audience,
  bytes,
  installedRecipeSnapshots,
  operation,
  mechanismRegistry,
}
~~~

It calls the retargeted `executeFantasyConstruction` internally. It never accepts a caller-produced state, receipt, mass, loaded envelope or authority. `fabric/index.js` registers only the three new constants and one new projector above, while preserving the existing executor export. Internal helpers remain direct-import-only or file-private.

## 7. Mechanism and operation replay law

The mechanism creator snapshots its opaque input once and has exactly two closed input shapes:

1. Legacy v1 compatibility input is exactly `allowedSemanticTypeIds`, `mechanismId`, `mechanismVersion`. It preserves the landed artifact bytes, codepoint-sorts unique semantic IDs, and remains non-executable in MF-T1X.
2. Executable v2 input is exactly `mechanismId`, `mechanismVersion`, `spatialRecipeRef`. It requires an exact two-key canonical artifact ref and seals exactly:

~~~js
{
  artifactKind: 'REGISTERED_FANTASY_MECHANISM',
  artifactId: mechanismId,
  schemaVersion: 2,
  lawVersion: 'mf-t1x-registered-fantasy-construction-mechanism-v2',
  mechanismVersion,
  gate: 'EXPLICIT_FANTASY_CANON',
  operationKind: 'CONSTRUCT_EXPLICIT_BUILDING',
  spatialRecipeRef,
  contentHash,
}
~~~

Mechanism version is an explicit non-empty string or safe integer. Equivalent legacy semantic-ID order and equivalent canonical v2 input yield identical respective bytes. The two shapes cannot be mixed.

The operation creator snapshots its opaque input once and requires exactly `beforeDocumentRef`, `mechanismRef`, `operationId`, `origin`, `recipeSnapshot`, `spec`. It requires exact two-key canonical refs, exact `spec.constructionOperationId === operationId`, replays `recipeSnapshot` through `createSpatialRecipeSnapshot`, replays `origin` through `createCanonicalOrigin`, and seals only replayed detached nested authority. A hash-resealed but non-replaying recipe or origin refuses.

The operation creator emits one executable schema using file-private constants only: schema version `1` and law `mf-t1x-explicit-fantasy-construction-operation-v1`. Its sealed body is exactly:

~~~js
{
  artifactKind: 'CANONICAL_SPATIAL_OPERATION',
  artifactId: operationId,
  schemaVersion: 1,
  lawVersion: 'mf-t1x-explicit-fantasy-construction-operation-v1',
  operationKind: 'CONSTRUCT_EXPLICIT_BUILDING',
  gate: 'EXPLICIT_FANTASY_CANON',
  beforeDocumentRef,
  mechanismRef,
  payload: {
    spec: detachedSpec,
    recipeSnapshot: replayedRecipeSnapshot,
    origin: replayedOrigin,
  },
  contentHash,
}
~~~

The executor requires that exact operation schema, law, kind and gate in addition to whole-byte creator replay. Old unversioned operations are non-executable and no compatibility overload exists. The landed legacy-v1 mechanism creator remains byte-preserving for its compatibility fixture at `scene-v1-56e0d430be735fbbab2f7aa4b4b50281`, but that semantic-list mechanism is likewise non-executable.

Execution requires the supplied operation's exact schema/law/kind/gate, replays it through `createFantasyConstructionOperation`, and requires complete stable-byte equality. It snapshots and replays every mechanism registry row through `registerFantasyConstructionMechanism`, codepoint-sorts the validated rows by artifact ID then content hash, and refuses duplicate exact keys or duplicate artifact IDs. The operation mechanism resolves only by exact `artifactId + NUL + contentHash`; artifact ID alone never resolves. The resolved mechanism must carry schema version 2, the exact v2 law, gate and operation kind. Its `spatialRecipeRef` must equal `canonicalArtifactRef(replayedOperation.payload.recipeSnapshot)` exactly. A valid legacy semantic-list mechanism is replayable compatibility data but refuses as execution authority.

No mechanism weight, historical-evidence field, probability protocol, dossier ref, seed, candidate or choice receipt is accepted or synthesized.

## 8. Saved execution and one-mass law

Execution loads `bytes` with `installedRecipeSnapshots` internally through MF-T1S and uses only the detached load. If the internally derived load is read-only, mutation refuses. A caller cannot replace this decision.

The operation's `beforeDocumentRef` must equal the exact canonical ref of that loaded `FIRST_SLICE_MASSING_DOCUMENT`. The loaded document must still replay to exactly two base masses and two roster bindings. Those artifacts remain unchanged and are never re-authored.

Exactly one third mass is legal:

1. The recipe is a replayed `BUILT_IN` snapshot with spatial role `BUILDING` and landed `explicit-building-mass-v1` geometry law; the origin is replayed `AUTHORED`; the explicit spec privacy is exactly `DM`; and the supplied roof is the existing explicit `GABLE` form. No new or inferred shape is admitted.
2. Every geometry-bearing spec field remains explicit and passes `compileExplicitBuildingMass`; fantasy authority supplies no geometry default.
3. The replayed operation recipe ref equals the exact spatial-recipe ref bound by the registered v2 mechanism; semantic-type membership alone is never execution authority.
4. `spec.buildingId` is absent from both base masses.
5. `spec.plotRef.plotId` is absent from both base masses and resolves in the unchanged MF-T1S frontage subdivision. The golden fixture uses free parcel `block:settlement:high-x-low-z:plot:01`, whose fitted footprint is `[[550,254],[846,254],[846,440],[550,440]]`.
6. `operation.artifactId` is absent from every base geometry's `constructionOperationId`, and `spec.constructionOperationId` equals it.
7. The explicit mass compiler runs exactly once. The supplied spec/recipe/origin are never retained without replay and never used after compilation.

An attempt to feed a construction state back into execution is structurally impossible: the API accepts saved MF-T1S bytes, not after-state bytes, and the operation before ref binds that document. No second operation or chaining surface exists.

## 9. Exact state and receipt

The sealed derived state body is exactly:

~~~js
{
  artifactKind: 'FIRST_SLICE_MASSING_CONSTRUCTION_STATE',
  artifactId: boundedDigestId,
  schemaVersion: 1,
  lawVersion: 'mf-t1x-first-slice-massing-construction-state-v1',
  beforeDocumentRef: canonicalArtifactRef(loaded.document),
  baseMassingRosterRef:
    canonicalArtifactRef(loaded.document.massingBundle.massingRoster),
  changeOperationRefs: [canonicalArtifactRef(replayedOperation)],
  buildingMasses: threeMassesSortedByGeometryBuildingId,
  contentHash,
}
~~~

`buildingMasses` contains the exact two replayed base mass artifacts and the one compiled third mass, codepoint-sorted by `mass.geometry.buildingId`. Geometry exists only inside those three exact inline mass artifacts; there is no second copied geometry table or geometry field outside them. The state contains no roster binding, compile input, document, mechanism, operation or receipt. `changeOperationRefs` has exactly one row.

The external sealed receipt body is exactly:

~~~js
{
  artifactKind: 'FANTASY_CONSTRUCTION_RECEIPT',
  artifactId: boundedDigestId,
  schemaVersion: 1,
  lawVersion: 'mf-t1x-first-slice-massing-construction-state-v1',
  beforeDocumentRef: canonicalArtifactRef(loaded.document),
  afterConstructionStateRef: canonicalArtifactRef(constructionState),
  operationRef: canonicalArtifactRef(replayedOperation),
  mechanismRef: canonicalArtifactRef(replayedMechanism),
  effect: {
    kind: 'BUILDING_ADDED',
    buildingId: thirdMass.geometry.buildingId,
    plotRef: thirdMass.geometry.plotRef,
    massRef: canonicalArtifactRef(thirdMass),
  },
  contentHash,
}
~~~

The two bounded IDs are exact:

~~~js
const stateArtifactId = `massing-construction-state:${sceneDigest({
  domain: FIRST_SLICE_MASSING_CONSTRUCTION_STATE_LAW_VERSION,
  beforeDocumentRef,
  baseMassingRosterRef,
  changeOperationRefs,
  buildingMassRefs: buildingMasses.map(canonicalArtifactRef),
})}`;

const receiptArtifactId = `fantasy-construction-receipt:${sceneDigest({
  domain: FIRST_SLICE_MASSING_CONSTRUCTION_STATE_LAW_VERSION,
  beforeDocumentRef,
  afterConstructionStateRef,
  operationRef,
  mechanismRef,
  effect,
})}`;
~~~

No caller ID or `:receipt` suffix is used. Maximum legal input IDs cannot overflow either artifact ID. The function returns a deep-frozen exact envelope `{ constructionState, receipt }`; it does not return the loaded document or a separate mass.

The graph is acyclic: state points to before document, base roster and operation; receipt points to before document, state, operation and mechanism. State never points to receipt.

## 10. Shared projection and privacy

The saved fantasy projector re-executes the exact detached request internally, loads the same saved bytes for the predecessor foundation/frontage witnesses, and calls the existing private prepared-massing helper with the derived state's three masses and no unresolved IDs. That helper remains the sole call site for `projectResolvedFirstSliceFixedSurvey`; its bounded consumers become the direct MF-T1V wrapper, saved MF-T1S wrapper and saved MF-T1X wrapper.

`projection.js` admits exactly one new descriptor:

~~~js
{
  kind: 'MASSING_CONSTRUCTION_STATE',
  lawVersion:
    'mf-t1x-first-slice-massing-construction-fixed-survey-v1',
  beforeDocument: loaded.document,
  resolutionReport: loaded.resolutionReport,
  constructionState,
  receipt,
}
~~~

The executor alone owns operation and mechanism replay. The core validates the four descriptor artifact digests and their exact applicable artifact kinds, schema versions and law versions (the resolution report has no law version); exact report source-document, state-before, base-roster, receipt-before, receipt-state and receipt-effect refs; exact one state change ref; equality between that sole change ref and `receipt.operationRef`; an exact two-key committed `receipt.mechanismRef`; exact three masses; and equality of the passed foundation/frontage/masses to the descriptor authority before constructing visibility or source authority. It does not re-resolve a mechanism and must not accept operation or mechanism descriptor inputs.

For DM, source authority is exactly:

~~~js
{
  kind: 'DM_MASSING_CONSTRUCTION_STATE',
  lawVersion,
  documentRef: canonicalArtifactRef(beforeDocument),
  contentResolutionReportRef: canonicalArtifactRef(resolutionReport),
  constructionStateRef: canonicalArtifactRef(constructionState),
  receiptRef: canonicalArtifactRef(receipt),
}
~~~

The DM projection ID is exactly `projection:dm:${sceneDigest({ domain: lawVersion, audience: 'DM', sourceAuthority })}`. DM sees all three masses, including the third mass's actual shell-derived shadow and plan/roof primitives. The bounded executable-ID witness uses an 87-character building ID: the landed compiler appends `:geometry`, producing the maximum legal 96-character geometry artifact ID without widening `building.js`.

For PUBLIC, the core deliberately constructs the exact landed, resolved MF-T1S `PUBLIC_MASSING_DOCUMENT_DERIVATION` authority from the before document, Fabric/foundation/frontage refs and post-visibility geometry refs, with `unresolvedVisibleEntityIds: []`, and uses the landed MF-T1S public artifact-ID law. Because the sole added mass is DM-private, the entire PUBLIC projection artifact, source authority, semantic primitives, draw ops, warnings, content hash and SVG are byte-identical to the before projection. PUBLIC contains no state, receipt, operation, mechanism, roster, mass, recipe, origin, package or hidden building identity.

Both audiences consume the existing fixed light and ordered semantic-primitive/draw-op list. No fantasy-specific silhouette, shadow, warning, palette, screen or SVG routine is permitted.

## 11. Exact change manifest

| Action | File | Symbol/region | Maximum delta | Coding instruction |
|---|---|---|---:|---|
| MODIFY | `src/domain/townMap/fabric/operations.js` | replay-hardened creators, v2 exact-recipe mechanism, retargeted saved executor, state/receipt | +190; final 321 | Opaque snapshots; internal MF-T1S load; one explicit mass; acyclic artifacts |
| MODIFY | `src/domain/townMap/fabric/massingProjection.js` | saved fantasy projection wrapper and third prepared-helper consumer | +65; final 148 | Exact five-key request; execute internally; no projection math |
| MODIFY | `src/domain/townMap/fabric/projection.js` | `MASSING_CONSTRUCTION_STATE` descriptor branch | +55; final 374 | Exact DM authority; exact MF-T1S PUBLIC equivalence; preserve existing branches |
| REGISTER | `src/domain/townMap/fabric/index.js` | three new constants, one new projector, preserved retargeted executor | +15; final 112 | No unsafe request overload, compatibility alias or internal helper export |
| MODIFY | `tests/domain/townMapFantasyConstruction.test.js` | replace legacy two-case suite with exact A1-A6 | +310; final 390 | Six literal tests; closed refusal table; no seventh title |
| MODIFY | `tests/domain/townMapShapeKernel.test.js` | remove legacy executor imports/call from existing determinism case | +20; final 268 | Preserve five titles and all shape/shadow coverage; expected net shrink |
| MODIFY | `tests/lint/sovereigntyLightingContract.walker.test.js` | exact census | +12 | Record only the four-title movement after full rederivation |

Generated artifacts: NONE. No fixture, content, roster, shape, draw, palette, config, baseline or other file may be edited.

## 12. Ordered coding sequence

1. Dispatch and seal; stop on mismatch.
2. Pin predecessor hashes, sizes, the existing executor source/barrel symbols and whole census.
3. Replace the existing fantasy suite with exactly six literal A1-A6 titles and remove the second unsafe caller from the existing shape-kernel test without adding a title.
4. Snapshot/replay-harden mechanism and operation creation, then implement the saved-byte executor and exact acyclic artifacts.
5. Add the saved fantasy wrapper as the prepared-massing helper's third bounded consumer.
6. Add the one source-descriptor branch without moving existing geometry or valid predecessor bytes.
7. Register the four new public symbols and preserve the retargeted executor at both source and barrel.
8. Run focused checks, manifest checks, sealed session and the whole-tree tail.

## 13. Acceptance matrix

| ID | Case | Required observation | Home |
|---|---|---|---|
| A1 | Replay-closed saved execution | Exact MF-T1S bytes and active snapshots load internally; stateful-accessor probes prove mechanism creator, operation creator and executor each snapshot opaque input once; every installed snapshot, mechanism, operation, recipe and origin replays; the operation carries exact schema 1 and private law while an unversioned operation refuses; the preserved legacy mechanism fixture remains `scene-v1-56e0d430be735fbbab2f7aa4b4b50281` but cannot execute; result is frozen exact `{ constructionState, receipt }` | fantasy domain |
| A2 | One explicit derived mass | The unchanged two-body document/roster plus the explicit free-parcel operation produces exactly three building-ID-sorted masses; the new rectilinear/gabled mass is DM-private, BUILT_IN, AUTHORED, bound by the v2 mechanism's exact spatial-recipe ref, compiled once from complete geometry, and receipt/state refs form the exact acyclic graph while the effect binds exact building ID, plot ref and mass ref with no historical/probability authority | fantasy domain |
| A3 | Shared projection and privacy | Saved projector re-executes internally; PUBLIC before/after projection, screen ops and SVG are entirely byte-identical and leak no hidden authority; DM binds exact before document/load report/state/receipt, has exactly 21 ordered ops, gains the third mass's real shell-derived shadow/building/ridge primitives through the shared draw/SVG path, and remains deterministic including the 87-character executable building-ID witness | fantasy domain |
| A4 | Closed refusal matrix | One literal table has exactly six top-level classes: executor/projector envelope forgery including the old loaded request; invalid or internally read-only saved source; crossed, unversioned or non-replaying operation; legacy-v1, missing, non-replaying, duplicate or wrong-ref mechanism; non-replaying or non-DM/non-BUILT_IN/non-AUTHORED payload authority including recipe-ref mismatch; and building/plot/construction-operation collision or attempted chaining. Only the named bounded subrows are exercised; no fuzzing or cross-product | fantasy domain |
| A5 | Deterministic identity and bounds | Repeat execution, canonical JSON clones and equivalent mechanism-registry order produce identical state/receipt/DM bytes; caller graphs remain unchanged and unfrozen; exact matching is artifactId-plus-hash; 96-character document/operation/mechanism IDs plus the compiler-bounded 87-character building ID still produce bounded state, receipt and projection IDs | fantasy domain |
| A6 | Predecessor and retarget barrier | MF-T1M still refuses a third body; saved MF-T1S exact-installed PUBLIC/DM remain `scene-v1-b90080500e9e0a99b6ee469444832743` / `scene-v1-47ec385c5ea913fbad576ef8cc2d2219`, direct MF-T1V remain `scene-v1-2f65d0d84551c889da48e08ceb1eb27f` / `scene-v1-bc2930de2297900d8715aa32b1a884c3`, and legacy remain `scene-v1-9820c3f2273a313f22ff9246c65e1891` / `scene-v1-1945e8a01df6c24788c3393c4e3c452d`; MF-T1S save bytes and both base masses/roster are unchanged; the executor remains exported but rejects the old loaded envelope and has no second alias; no excluded authority or second compiler/projector/persistence path appears | fantasy domain |

This table is the entire edge-case budget. A4 has exactly six top-level refusal classes and only their named immediate subrows. Do not add fuzzing, combinatorial matrices, a seventh title or an adjacent repair.

## 14. Verification commands

~~~sh
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/domain/townMapFantasyConstruction.test.js \
  tests/domain/townMapMassingPersistence.test.js \
  tests/domain/townMapMassingProjection.test.js \
  tests/domain/townMapMassingRoster.test.js \
  tests/domain/townMapShapeKernel.test.js \
  tests/domain/townMapExplicitBuilding.test.js \
  tests/domain/townMapCustomParity.test.js \
  tests/property/townMapFirstSliceDeterminism.test.js
npx eslint \
  src/domain/townMap/fabric/operations.js \
  src/domain/townMap/fabric/massingProjection.js \
  src/domain/townMap/fabric/projection.js \
  src/domain/townMap/fabric/index.js \
  tests/domain/townMapFantasyConstruction.test.js \
  tests/domain/townMapShapeKernel.test.js \
  tests/lint/sovereigntyLightingContract.walker.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict
npm run validate:packets
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/lint/sovereigntyLightingContract.walker.test.js \
  tests/lint/negativeAssertionAnchor.walker.test.js
npm run check:packet -- MF-T1X
npm run implementation:resume -- MF-T1X
npm run check:tail
~~~

Manifest checks are exactly:

1. `npx vitest run tests/domain/townMapFantasyConstruction.test.js tests/domain/townMapMassingPersistence.test.js tests/domain/townMapMassingProjection.test.js tests/domain/townMapMassingRoster.test.js tests/domain/townMapShapeKernel.test.js tests/domain/townMapExplicitBuilding.test.js tests/domain/townMapCustomParity.test.js tests/property/townMapFirstSliceDeterminism.test.js`
2. `npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js tests/lint/negativeAssertionAnchor.walker.test.js`
3. `npm run typecheck:domain:strict`
4. `npm run validate:packets`

## 15. Mandatory STOP conditions

Stop unless the verified base is an ancestor of a clean, committed, governance-only promotion descendant whose base delta changes exactly INDEX, PACKET_MANIFEST and this packet. Stop on a changed implementation/required-symbol target, missing existing executor symbol, future symbol in the required closure, eighth path, file outside manifest or family-preamble expansion.

Stop if the executor or any alias accepts the caller-loaded request; if executor/projector accepts a loaded envelope, caller readOnly/report/state/receipt/authority/visible list; if either API rereads an untrusted request; or if saved bytes and active snapshots are not loaded internally.

Stop if a mechanism, operation, recipe or origin does not replay exactly; if an operation without exact schema 1, law `mf-t1x-explicit-fantasy-construction-operation-v1`, kind and gate executes; if a legacy semantic-list mechanism executes; if the v2 mechanism does not bind exactly one canonical spatial-recipe ref or that ref differs from the replayed operation recipe; if registry matching uses artifact ID without content hash; if duplicate mechanism authority is accepted; or if historical evidence, probability, dossier, seed, candidate, weight, PRNG or choice-receipt authority appears.

Stop if unresolved base custom content mutates; before ref is not exact; the added recipe is not BUILT_IN, origin not AUTHORED or privacy not DM; building, plot or construction-operation collision is accepted; explicit geometry is defaulted; or the mass compiler runs more than once.

Stop if MF-T1M or MF-T1S is widened; the base roster/document/masses/bytes move; a three-body roster compile is accepted; a state is persisted; a second operation/chaining/edit/event-log surface appears; or state embeds document, operation, mechanism or receipt.

Stop on a state/receipt cycle, geometry copied outside the three exact inline mass artifacts, unsorted masses, more or fewer than three masses, more or fewer than one change ref, unbounded artifact ID, receipt schema other than 1, receipt not binding exact before/state/op/mechanism or exact effect building ID/plot ref/mass ref, or a result envelope with any third key.

Stop on a second geometry, visibility, privacy, light, silhouette, shadow, primitive, palette, draw, screen or SVG path; PUBLIC state/receipt/operation/mechanism/roster/mass/recipe/origin/package/hidden identity; PUBLIC before/after byte movement; DM missing exact document/report/state/receipt authority or the added geometry; moved predecessor hashes; or fantasy-specific warning behavior.

Stop on UI, worker, store, database, package-manager, actual uninstall, migration, product export, citywide fill, new shape/light/material, new test file, seventh fantasy title, census movement other than `+0/+0/+0/+4/+0`, budget breach, ratchet raise or unrelated gate failure requiring repair.

## 16. Completion receipt

- Base SHA: `39715d75a64819ee125148192cdc541e9f8992c9`.
- Promotion commit: `d9953a294a3d1bd30ac5d8fef19b0d0e796aeb3d`.
- Dispatch capsule / packet / seal:
  `b0be2b651a53762f638f232a4cfea5e4a452b486025bcc802097d63620749971` /
  `6b72351e885f3c87abc1dbc2981ddc7e3c2ff2b44cab5e4625595054e71a707b` /
  `184f2b9f161131f5ee04823b0eb56a344a02cb8d363bedad4b15ab77341c7d47`.
- Final implementation commit: `f4ad467d889ce5467a96604f28f2c49aaafcef57`;
  exactly the seven declared paths.
- Effective-line ledger: `operations.js +147/190`, final `278/321`;
  `massingProjection.js +38/65`, final `121/148`;
  `projection.js +55/55`, final `374/374`;
  `index.js +4/15`, final `101/112`;
  total production `244/325`; fantasy test `+292/310`, final `372/390`;
  shape-kernel test `-36`, final `212/268`; sovereignty walker `+0/12`
  effective (`+5/-1` raw).
- Whole sovereignty census:
  `2484/364/2120/20594/5767` →
  `2484/364/2120/20598/5767`.
- A1-A6 focused evidence: the packet battery passed `8` files / `38` tests;
  governance walkers passed `2` files / `42` tests. The one explicit operation
  adds one DM-private built-in/authored GABLE mass, seals one three-mass state
  plus external acyclic receipt, and projects `21` ordered DM operations through
  the shared path while the entire PUBLIC projection/draw/SVG stays byte-equal.
  Mechanism, operation, recipe, origin and opaque-request accessor probes close;
  the old caller-loaded envelope and legacy v1 mechanism remain non-executable.
- Canonical execution evidence: mechanism
  `scene-v1-23299cf0f8fed9ed3dceddac127d44bf`; operation
  `scene-v1-8a0cd522b9e5c59f4c01705ecf879635`; third mass
  `scene-v1-004c9499a4c4abf29878cc3d7f17838c`; state
  `scene-v1-ea6790887933ebb16efe167cc477bc0b`; receipt
  `scene-v1-6b4c293768da933608fa93ebbadf608c`; DM projection
  `scene-v1-b823486fbb95fcf6910f42db19f96788`.
- PUBLIC before/after remains exactly
  `scene-v1-b90080500e9e0a99b6ee469444832743`. Maximum-input witnesses produce
  state / receipt / DM projection hashes
  `scene-v1-a96d455653ee4def69f8e8325dcb6099` /
  `scene-v1-52d2cdc434cf8d9b43ea34d82f77d44d` /
  `scene-v1-e5c43d1fa69c2546ed5a68e30e88d954`; maximum geometry/state/receipt/
  projection artifact-ID lengths are `96/68/70/55`.
- Predecessor hashes revalidated: saved MF-T1S PUBLIC / DM
  `scene-v1-b90080500e9e0a99b6ee469444832743` /
  `scene-v1-47ec385c5ea913fbad576ef8cc2d2219`; direct MF-T1V PUBLIC / DM
  `scene-v1-2f65d0d84551c889da48e08ceb1eb27f` /
  `scene-v1-bc2930de2297900d8715aa32b1a884c3`; legacy document PUBLIC / DM
  `scene-v1-9820c3f2273a313f22ff9246c65e1891` /
  `scene-v1-1945e8a01df6c24788c3393c4e3c452d`. The legacy v1 mechanism remains
  `scene-v1-56e0d430be735fbbab2f7aa4b4b50281` and non-executable.
- Static and packet gates: targeted ESLint clean; `tsconfig.full.json`
  `173/173`; `tsconfig.domain-strict.json` `1134/1134`; packet session `PASSED`
  all eight steps with no failed, blocked or remaining step; independent bounded
  audit `GO — 0 P0 / 0 P1`.
- Whole-tree landing gate completed the full `npm run check` chain: test ratchet
  `28638` tests with `11` inherited failures at ceiling and no new failure;
  ESLint `0` errors / `29` warnings; build `28.40s`; prerender `314` routes;
  strict dist `51` files / `409` tests with zero missing, duplicate, failed,
  non-run or uncollected rows.
- Adjacent discoveries: none widened this packet. The requested bounded first-map
  sequence is complete. Dossier-conditioned sampling still requires genuine
  dossier, seed, candidate and choice-receipt authority; UI/store integration,
  additional operations and general event-log authority remain deferred.
