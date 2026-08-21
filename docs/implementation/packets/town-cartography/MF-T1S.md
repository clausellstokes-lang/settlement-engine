# First-Slice Persistence / MF-T1S — roster-aware save, reload, and projection

- **Status:** READY
- **Packet version:** 1
- **Verified base:** codex/first-map-vertical-slice at 7913cab3305b79c79c7079bc2129b2c8f4f423b8
- **Last revalidated:** 2026-08-21 at 7913cab3305b79c79c7079bc2129b2c8f4f423b8
- **Depends on:** MF-T1V at 66dbed7c41f9bafc48e738badd7c053e3009f649; MF-T1M at bffd1bcb7a8bc2087d467e6dc73de42641f717e2; MF-VS1 at 7c34f50fd99fcf34c478ec56cbae42240bcd7486
- **Collision group:** town-map-first-slice-massing-persistence
- **Commit authority:** this READY packet alone; exact six-path manifest only
- **Baseline posture:** MF-T1V landed and terminalized on a clean tree; the focused predecessor battery passes 3 files / 15 tests, both Git-admin receipts are complete, and terminal governance validates 127 packets with zero READY before this promotion
- **Package-removal proof:** simulated only by reloading/projecting saved bytes with an explicitly empty active installed-snapshot projection; this packet does not uninstall a package or mutate a real store

> Only this READY implementation packet defines coding authority. Design files, queues, progress notes, commit subjects, and briefs cannot expand that authority.

> Family-preamble ruling: town-cartography has no family preamble, and the immediate MF-T1M and MF-T1V predecessors were promoted and landed in the same three-governance-file form. That measured local precedent controls MF-T1S, so the absent family preamble is not a dispatch blocker and this promotion does not invent a fourth governance file. Any future family-wide preamble correction is a separate governance act and cannot widen this implementation packet.

## 1. Reconciled authority

1. MF-T1M owns the exact two-body first-slice massing bundle and the complete ten-key input that alone can replay it.
2. MF-T1V owns the sole fixed-survey projection, privacy filter, semantic-primitive, draw-op and SVG path. This packet adds one source-descriptor branch to that core, not a second projection.
3. The landed FIRST_SLICE_MAP_DOCUMENT is a masses-only v1 contract. Relabeling or extending it would discard the MF-T1M roster or silently change an existing persistence family. MF-T1S adds a distinct transitional FIRST_SLICE_MASSING_DOCUMENT in existing content.js.
4. Saved projection takes only bytes and active installed snapshots, then performs load and resolution internally. A caller cannot provide a document or coordinated resolution report that hides missing content.
5. Package availability is reload-relative. An empty installedRecipeSnapshots array simulates the post-removal active package view; no package registry, database, store, uninstall or migration is authorized.
6. PUBLIC authority binds only Fabric/foundation/frontage, visible geometry and post-visibility unresolved IDs. DM authority binds the exact document and exact load-produced report. Both saved audiences use digest-bounded projection IDs.

Resolved contradictions:

- Extending FIRST_SLICE_MAP_DOCUMENT is forbidden because its schema and valid bytes are already landed.
- Persisting only masses is forbidden because it loses the roster and complete replay authority.
- Trusting a supplied bundle or report is forbidden; creation replays the complete bundle and saved projection runs load internally.
- Matching installed content by artifactId alone is forbidden; exact artifactId plus contentHash is required.
- A real package uninstall is outside this headless packet. Empty active snapshots are the only authorized removal simulation.
- Fantasy, dossier, seed, sampling, UI, database, store, worker, export-cutover and migration authority remain deferred.

The implementer does not read other documents to widen this packet.

## 2. Outcome

**Observable result:** headless code creates and canonically saves one exact MF-T1M massing document, reloads unchanged bytes against an active snapshot set, marks an unresolved visible custom institution read-only after an explicitly empty active-set simulation, and projects the load through the existing MF-T1V fixed survey with one visible warning.

**Definition of done:** save bytes replay exactly; detached bodyInputs are canonically ordered by spec.buildingId before persistence; installed snapshots individually replay their sole constructor; exact installed content resolves while a valid same-artifactId wrong-hash snapshot does not; the projector accepts exactly { audience, bytes, installedRecipeSnapshots }; PUBLIC leaks no hidden identity; DM binds document and report; direct MF-T1V and legacy document bytes do not move.

In scope:

1. One transitional FIRST_SLICE_MASSING_DOCUMENT family in existing content.js.
2. Create, save, load, content-resolution and mutable-guard functions for that family.
3. One saved-bytes projection entry in existing massingProjection.js.
4. One MASSING_DOCUMENT branch inside the existing projectResolvedFirstSliceFixedSurvey core.
5. Registration of the eight new public symbols in fabric/index.js.
6. Exactly A1-A6 below and the one exact sovereignty-census movement.

Explicit non-goals:

- fantasy operations, dossier/seed authority, candidates, weights, PRNGs, sampling or choice receipts;
- UI, live canvas, workers, PDF/product export cutover, screenshots or browser proof;
- database, store, package-manager, registry, actual install/uninstall, deployment or migration;
- citywide fill, third bodies, routing, new shape grammar, new light or material shading;
- edit workflows beyond one read-only assertion guard;
- changes to FIRST_SLICE_MAP_DOCUMENT, existing DOCUMENT/MASSING source-descriptor semantics, or canonical projection promotion.

Record adjacent discoveries in the receipt; do not investigate or repair them.

## 3. Hard scope budget

| Limit | Packet budget |
|---|---:|
| Behavior families | 1 |
| New persisted record families | 1 |
| Named producers / feature flags / user surfaces | 1 / 0 / 0 |
| Direct production consumers | 1 |
| New logic-bearing production leaves | 0 |
| Existing logic-bearing production files modified | 3 (content.js, massingProjection.js, projection.js) |
| Additional registration-only files | 1 |
| Handwritten files total | 6 |
| content.js effective delta / final size | <=+170 / <=336 |
| massingProjection.js effective delta / final size | <=+75 / <=113 |
| projection.js effective delta / final size | <=+40 / <=319 |
| index.js effective delta / final size | <=+12 / <=101 |
| Total effective production delta | <=297 |
| New domain-test effective lines | <=390 |
| Sovereignty-walker effective delta | <=+12 |
| Acceptance cases / literal tests | 6 / 6 |

Measured pre-edit effective sizes are content.js 166, massingProjection.js 38, projection.js 279 and index.js 89. Overrides approved before dispatch: NONE. Exceeding any limit is a STOP and split.

The current sovereignty census is 2483 / 364 / 2119 / 20588 / 5766. The declared forecast is exactly one credited file, six titles and one suite: 2484 / 364 / 2120 / 20594 / 5767. The implementer must rederive the whole walker census and record the measured result; the forecast is not inherited evidence.

## 4. Sealed dispatch and preflight

Run before implementation edits:

~~~sh
npm run implementation:dispatch -- MF-T1S
~~~

Expected: exact branch/base, six manifest paths, the one CREATE test absent, the exact 128-row current substrate, and a Git-admin seal. Any mismatch makes this packet stale.

Before coding:

1. Require 7913cab3305b79c79c7079bc2129b2c8f4f423b8 as an ancestor and a clean tree. The current HEAD may be only the committed three-file MF-T1S governance-promotion descendant: base-to-HEAD must change no implementation target or required-symbol substrate, and the CREATE test must remain absent.
2. Pin the direct MF-T1V PUBLIC/DM hashes and legacy document PUBLIC/DM hashes.
3. Pin effective sizes and the whole sovereignty census.
4. Prove all 128 requiredSymbols rows byte-present. Do not add future MF-T1S symbols to the READY closure.

## 5. Verified tree contract

| Role | File | Symbol | Required use |
|---|---|---|---|
| Existing persistence seam | src/domain/townMap/fabric/content.js | FIRST_SLICE_DOCUMENT_SCHEMA_VERSION plus create/save/resolve/load/assert functions | Add a distinct family beside the landed save/load conventions; do not alter existing valid behavior |
| Massing replay | src/domain/townMap/fabric/massingRoster.js | compileOrthogonalCrossFirstSliceMassingRosterBundle | Replay sorted detached input once and byte-compare the complete bundle |
| Snapshot replay | src/domain/townMap/fabric/building.js | createSpatialRecipeSnapshot | Replay every installed row individually and require exact canonical bytes |
| Canonical bytes | src/domain/townScene/stableScene.js | stableSceneStringify, sceneDigest | Clone, compare, save and derive bounded IDs |
| Canonical artifacts | src/domain/townMap/fabric/foundation.js | canonicalArtifactRef, deepFreezeCanonical, sealCanonicalArtifact | Reuse the sole refs, deep-freeze and sealing laws |
| Saved wrapper | src/domain/townMap/fabric/massingProjection.js | projectOrthogonalCrossFirstSliceMassingFixedSurvey | Add saved-byte preparation; retain one call site to the core |
| Projection core | src/domain/townMap/fabric/projection.js | projectResolvedFirstSliceFixedSurvey | Add exactly one MASSING_DOCUMENT descriptor branch |
| Screen/export | src/domain/townMap/fabric/projection.js | firstSliceScreenDrawOps, firstSliceProjectionToSvg | Preserve the one ordered draw-op list and deterministic SVG |

Forbidden alternatives: a new production leaf, extension of FIRST_SLICE_MAP_DOCUMENT, caller report, hash-only bundle trust, unsorted persisted bodyInputs, artifactId-only package resolution, unvalidated installed snapshots, mutable persistence input, copied geometry, unbounded IDs, second resolver/projection/privacy/light/draw/SVG path, or file outside the manifest.

## 6. Exact public contracts

content.js adds exactly:

~~~js
export const FIRST_SLICE_MASSING_DOCUMENT_SCHEMA_VERSION = 1;
export const FIRST_SLICE_MASSING_DOCUMENT_LAW_VERSION =
  'mf-t1s-first-slice-massing-document-v1';
export function createFirstSliceMassingDocument(input) {}
export function saveFirstSliceMassingDocument(document) {}
export function loadFirstSliceMassingDocument(
  bytes, installedRecipeSnapshots = [],
) {}
export function assertFirstSliceMassingMutable(input) {}
~~~

The creator accepts one opaque input value. It snapshots that value exactly once
before reading any field, then requires top-level keys exactly documentId,
massingBundle, massingCompileInput. All three are required; missing or extra keys
refuse.

massingProjection.js adds exactly:

~~~js
export const FIRST_SLICE_MASSING_DOCUMENT_PROJECTION_LAW_VERSION =
  'mf-t1s-first-slice-massing-document-fixed-survey-v1';
export function projectSavedOrthogonalCrossFirstSliceMassingFixedSurvey(input) {}
~~~

The mutable guard and saved projector each accept one opaque input value and
snapshot it exactly once before reading a field. The guard then requires exactly
bytes and installedRecipeSnapshots. The projector requires exactly audience,
bytes, installedRecipeSnapshots. InstalledRecipeSnapshots is an array and may be
explicitly empty. Missing or extra keys refuse. The projector never accepts a
caller document, resolutionReport, readOnly flag, massingBundle, compile input,
source authority, visible list or artifact ID. It calls
loadFirstSliceMassingDocument(bytes, installedRecipeSnapshots) internally and
projects only that load result.

fabric/index.js registers exactly the three constants and five functions above. No internal helper is barrel-exported.

## 7. Canonical document and replay law

The sealed document body is exactly:

~~~js
{
  artifactKind: 'FIRST_SLICE_MASSING_DOCUMENT',
  artifactId: documentId,
  schemaVersion: 1,
  lawVersion: 'mf-t1s-first-slice-massing-document-v1',
  massingCompileInput: canonicalDetachedSortedCompileInput,
  massingBundle: exactReplayedMassingBundle,
  contentHash,
}
~~~

Creation law:

1. Canonically snapshot the complete untrusted create request exactly once before
   any validation or field read, then use only that private detached value.
2. Require the exact three create keys.
3. Canonically clone the complete ten-key MF-T1M input: artifactId, bodyInputs, boundaryArrangement, firstSliceFabricRoot, foundation, frontageSubdivision, parcelRegistry, planarDcel, streetGeometry, streetGraph.
4. Clone every nested body and codepoint-sort detached bodyInputs by spec.buildingId before persistence and replay. Refuse missing, invalid or duplicate building IDs.
5. Call compileOrthogonalCrossFirstSliceMassingRosterBundle exactly once with the sorted detached input.
6. Require stable-byte equality between the complete supplied { massingRoster, buildingMasses } and complete replay. Never use the caller bundle after comparison.
7. Seal with sorted detached input and replayed bundle. Caller inputs remain mutable, unfrozen and unchanged.
8. Equivalent reversed caller bodyInputs produce byte-identical documents and save bytes.

Save snapshots the supplied document exactly once, accepts only
FIRST_SLICE_MASSING_DOCUMENT, recomputes its body digest, rebuilds through
createFirstSliceMassingDocument, requires exact stable-byte equality and returns
stableSceneStringify(document). It does not normalize invalid input or reread
caller-owned objects after validation.

Load requires non-empty string bytes, canonical stable serialization, exact kind/schema/law/digest, rebuild equality, validated active snapshots, and a deep-frozen { document, resolutionReport, readOnly }. readOnly is exactly resolutionReport.unresolved.length > 0.

assertFirstSliceMassingMutable accepts exactly bytes and installedRecipeSnapshots,
calls loadFirstSliceMassingDocument internally, and refuses when that internally
derived load is read-only. It never accepts a caller-loaded envelope, report or
readOnly boolean, so replacing readOnly with false cannot bypass package resolution.

## 8. Installed snapshots and resolution

Every active installed snapshot individually replays:

~~~js
createSpatialRecipeSnapshot({
  packageClass: snapshot.packageClass,
  packageId: snapshot.packageId,
  packageVersion: snapshot.packageVersion,
  entryId: snapshot.entryId,
  entryVersion: snapshot.entryVersion,
  semanticTypeId: snapshot.semantics.semanticTypeId,
  spatialRole: snapshot.semantics.spatialRole,
  geometryLaw: snapshot.semantics.geometryLaw,
})
~~~

Require stable-byte equality to each replay. Malformed, forged, hash-resealed or non-replaying rows refuse. Sort validated active rows deterministically. Duplicate exact artifactId-plus-contentHash keys and duplicate artifactIds in the active set refuse.

Resolution uses the exact key snapshot.artifactId + NUL + snapshot.contentHash. For each CUSTOM recipe in replayed document masses, emit the landed MF-VS1 row shape with subject { kind: 'ENTITY', entityId }, geometry privacy, exact recipe reference fields, and status RESOLVED or UNRESOLVED_PACKAGE_MISSING. A single different valid installed snapshot at the same artifactId with wrong contentHash remains unresolved; artifactId alone never resolves it. Built-in rows do not enter the report.

The sealed CONTENT_RESOLUTION_REPORT has sourceDocumentRef, resolved, unresolved and contentHash. Its artifact ID is digest-bounded:

~~~js
'content-resolution:' + sceneDigest({
  domain: FIRST_SLICE_MASSING_DOCUMENT_LAW_VERSION,
  sourceDocumentRef: canonicalArtifactRef(document),
})
~~~

Resolution never mutates document, bytes, installed snapshots, a registry, package or store. Removal/reinstall means only changing the active array passed to a later load.

## 9. Saved projection, authority and privacy

The saved wrapper loads internally and derives unresolved entity IDs only from that load-produced report. The direct MF-T1V wrapper and saved wrapper call one non-exported preparation helper in massingProjection.js; those are its exactly two consumers, and that helper is the file's sole call site for projectResolvedFirstSliceFixedSurvey. The file contains no visibility, silhouette, shadow, primitive, palette, draw or SVG math.

projection.js admits this descriptor without changing existing DOCUMENT or MASSING branches:

~~~js
{
  kind: 'MASSING_DOCUMENT',
  lawVersion:
    'mf-t1s-first-slice-massing-document-fixed-survey-v1',
  document: loaded.document,
  resolutionReport: loaded.resolutionReport,
}
~~~

The core validates both digests and exact report sourceDocumentRef before authority. It filters visibility first, codepoint-sorts post-visibility unresolved IDs, and uses the same ordered IDs for warnings, warning primitives, PUBLIC authority and final projection.

DM authority is exactly:

~~~js
{
  kind: 'DM_MASSING_DOCUMENT',
  lawVersion,
  documentRef: canonicalArtifactRef(document),
  contentResolutionReportRef: canonicalArtifactRef(resolutionReport),
}
~~~

PUBLIC authority is exactly:

~~~js
{
  kind: 'PUBLIC_MASSING_DOCUMENT_DERIVATION',
  lawVersion,
  firstSliceFabricRootRef:
    document.massingBundle.massingRoster.firstSliceFabricRootRef,
  foundationRef:
    canonicalArtifactRef(document.massingCompileInput.foundation),
  frontageSubdivisionRef:
    canonicalArtifactRef(document.massingCompileInput.frontageSubdivision),
  visibleGeometryRefs:
    visibleMasses.map((mass) => canonicalArtifactRef(mass.geometry)),
  unresolvedVisibleEntityIds: sortedPostVisibilityUnresolvedIds,
}
~~~

PUBLIC contains no document/report/roster/mass ref or ID; no recipe/package/origin data; and no hidden body ID, hidden geometry ref or unresolved hidden warning. A visible unresolved custom body adds one warning and one UNRESOLVED_CUSTOM_CONTENT circle after the landed 18 primitives, for 19 total. A hidden unresolved custom body keeps load read-only and produces a DM warning, but no PUBLIC warning/primitive/authority identity.

Both saved audiences use this bounded ID:

~~~js
'projection:' + audience.toLowerCase() + ':' + sceneDigest({
  domain: lawVersion, audience, sourceAuthority,
})
~~~

Maximum legal document IDs cannot overflow report or projection IDs. Existing DOCUMENT artifact IDs and MASSING digest IDs remain byte-exact.

## 10. Exact change manifest

| Action | File | Symbol/region | Maximum delta | Coding instruction |
|---|---|---|---:|---|
| MODIFY | src/domain/townMap/fabric/content.js | distinct massing document create/save/load/resolve/assert family | +170; final 336 | Detached sorted input, complete replay, installed-snapshot replay, bounded report |
| MODIFY | src/domain/townMap/fabric/massingProjection.js | saved-bytes law/wrapper and bounded shared preparation | +75; final 113 | Exact three-key input; load internally; retain one core call site |
| MODIFY | src/domain/townMap/fabric/projection.js | MASSING_DOCUMENT descriptor branch | +40; final 319 | Preserve legacy branches/math; exact audience authorities and bounded ID |
| REGISTER | src/domain/townMap/fabric/index.js | eight public exports | +12; final 101 | Export only three constants and five functions |
| CREATE | tests/domain/townMapMassingPersistence.test.js | A1-A6 | 390 | Exactly six literal tests and bounded refusal rows |
| MODIFY | tests/lint/sovereigntyLightingContract.walker.test.js | exact census | +12 | Record measured one-file/six-title/one-suite movement only |

Generated artifacts: NONE. No other file may be edited.

## 11. Ordered coding sequence

1. Dispatch and seal; stop on mismatch.
2. Pin predecessor hashes, sizes and census.
3. Add exactly six literal A1-A6 titles.
4. Implement the distinct document and installed-snapshot replay in content.js.
5. Add exact saved-byte preparation in massingProjection.js and retain one core call site.
6. Add MASSING_DOCUMENT authority in projection.js without moving existing branches.
7. Register only eight public symbols.
8. Run focused verification, manifest checks, sealed session and whole-tree tail.

## 12. Acceptance matrix

| ID | Case | Required observation | Home |
|---|---|---|---|
| A1 | Canonical detached document | Exact keys; one stateful-accessor probe proves the create request is snapshotted once; custom two-body bundle completely replays; cloned bodyInputs codepoint-sort by spec.buildingId; refs resolve once; save/load/resave bytes equal; caller graphs stay unchanged/unfrozen; reversed input yields same bytes; maximum document/report/projection IDs stay legal | domain |
| A2 | Visible post-removal reload | Save visible custom institution, then load/project the same bytes with explicit installedRecipeSnapshots: []; this simulates only an empty active view, not store uninstall; both masses/geometries survive; exactly one missing row; readOnly true; the bytes-based mutable guard internally reloads and refuses; PUBLIC has one warning, one circle and 19 ordered ops | domain |
| A3 | Installed replay and exact resolution | Every installed row replays createSpatialRecipeSnapshot; malformed/non-replaying rows and duplicate active keys/IDs refuse; exact custom snapshot resolves with readOnly false, the bytes-based mutable guard internally reloads and passes, no warning and 18 ops; one different valid snapshot at same artifactId/wrong hash remains unresolved; active-set changes never mutate bytes; equivalent built-in/custom PUBLIC is equal while DM differs | domain |
| A4 | Closed refusal matrix | One literal table has exactly six classes: extra create key; supplied bundle paired with another valid compile input; noncanonical JSON; wrong document digest; hash-correct resealed document whose bundle/input do not replay together; API-boundary forgery as class six, with bounded projector wrong-audience/extra-key/stateful-accessor subrows and mutable-guard caller-loaded/readOnly/extra-key/stateful-accessor subrows. No caller-report or caller-loaded guard API exists | domain |
| A5 | Privacy and read-only | Missing hidden custom content still makes load read-only and emits DM warning, while PUBLIC has no warning/primitive/authority identity; changing only hidden ID leaves entire PUBLIC projection and SVG byte-equal; visible behavior is pinned by A2 | domain |
| A6 | Determinism and predecessor barrier | Repeat, reversed input, canonical JSON and maximum IDs are byte-safe; direct MF-T1V PUBLIC/DM hashes remain scene-v1-2f65d0d84551c889da48e08ceb1eb27f / scene-v1-bc2930de2297900d8715aa32b1a884c3; legacy PUBLIC/DM remain scene-v1-9820c3f2273a313f22ff9246c65e1891 / scene-v1-1945e8a01df6c24788c3393c4e3c452d; DOCUMENT/MASSING branches and draw/SVG identity remain exact; no excluded authority appears | domain |

This table is the entire edge-case budget. A4 has exactly six refusal classes inside one literal test; its API-shape class has only the bounded projector and mutable-guard subrows named above. Do not add fuzzing, a cross-product or seventh title.

## 13. Verification commands

~~~sh
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/domain/townMapMassingPersistence.test.js \
  tests/domain/townMapMassingProjection.test.js \
  tests/domain/townMapMassingRoster.test.js \
  tests/domain/townMapExplicitBuilding.test.js \
  tests/domain/townMapCustomParity.test.js \
  tests/property/townMapFirstSliceDeterminism.test.js
npx eslint src/domain/townMap/fabric/content.js \
  src/domain/townMap/fabric/massingProjection.js \
  src/domain/townMap/fabric/projection.js \
  src/domain/townMap/fabric/index.js \
  tests/domain/townMapMassingPersistence.test.js \
  tests/lint/sovereigntyLightingContract.walker.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict
npm run validate:packets
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/lint/sovereigntyLightingContract.walker.test.js \
  tests/lint/negativeAssertionAnchor.walker.test.js
npm run check:packet -- MF-T1S
npm run implementation:resume -- MF-T1S
npm run check:tail
~~~

Manifest checks are exactly:

1. npx vitest run tests/domain/townMapMassingPersistence.test.js tests/domain/townMapMassingProjection.test.js tests/domain/townMapMassingRoster.test.js tests/domain/townMapExplicitBuilding.test.js tests/domain/townMapCustomParity.test.js tests/property/townMapFirstSliceDeterminism.test.js
2. npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js tests/lint/negativeAssertionAnchor.walker.test.js
3. npm run typecheck:domain:strict
4. npm run validate:packets

## 14. Mandatory STOP conditions

Stop unless the verified base is an ancestor of a clean, committed, governance-only promotion descendant whose base delta changes exactly INDEX, PACKET_MANIFEST and this packet; stop on any changed implementation target or required-symbol substrate, a present CREATE target, missing required symbol, seventh implementation path, or file outside manifest. The family-preamble ruling above is closed for this packet and cannot authorize another path.

Stop on persistence without complete MF-T1M replay; caller input frozen or used after replay; detached bodyInputs not sorted by spec.buildingId; supplied bundle retained/relabeled/used as geometry authority; or canonical bytes accepted without rebuild equality.

Stop if an installed snapshot is not individually replayed, a duplicate is accepted, a valid same-artifactId wrong-hash snapshot resolves, or package absence mutates bytes, registry, package or store.

Stop on a saved projector that accepts anything other than exact { audience, bytes, installedRecipeSnapshots }, accepts caller document/report/readOnly, or does not load internally.

Stop on a mutable guard that accepts a caller-loaded envelope, resolutionReport
or readOnly flag instead of exact bytes plus installedRecipeSnapshots and its own load.

Stop on a second resolver, projection, privacy predicate, light, silhouette, shadow, primitive, palette, draw, SVG or visibility path; unbounded report/projection ID; or any change to existing DOCUMENT/MASSING semantics or pinned hashes.

Stop on PUBLIC document/report/roster/mass/recipe/package/origin/hidden identity; missing visible warning; hidden PUBLIC warning/primitive; divergent unresolved lists; or DM authority not binding exact document/report.

Stop on fantasy, dossier, seed, sampling, PRNG, UI, worker, database, store, actual package uninstall, migration, product export, citywide fill, new shape/light/material, seventh test, budget breach, ratchet raise, inherited census without whole rederivation, or unrelated gate failure requiring repair.

## 15. Completion receipt

- Base SHA:
- Promotion commit:
- Dispatch capsule / packet / seal:
- Final implementation commit and exact six paths:
- Effective-line ledger:
- Whole sovereignty census before / after:
- A1-A6 evidence, including canonical byte hashes and maximum ID lengths:
- Direct MF-T1V PUBLIC / DM hashes:
- Legacy document PUBLIC / DM hashes:
- Focused behavior and governance walker counts:
- Static, type, packet-session and whole-tree tail results:
- Adjacent discoveries and explicitly deferred authority:
