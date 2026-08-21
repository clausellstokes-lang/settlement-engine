import { describe, expect, it } from 'vitest';

import * as publicFabricApi from '../../src/domain/townMap/fabric/index.js';
import {
  FIRST_SLICE_MASSING_CONSTRUCTION_PROJECTION_LAW_VERSION,
  FIRST_SLICE_MASSING_CONSTRUCTION_STATE_LAW_VERSION,
  FIRST_SLICE_MASSING_CONSTRUCTION_STATE_SCHEMA_VERSION,
  canonicalArtifactRef,
  compileOrthogonalCrossFirstSliceMassingRosterBundle,
  createCanonicalOrigin,
  createFantasyConstructionOperation,
  createFirstSliceMassingDocument,
  createSpatialRecipeSnapshot,
  executeFantasyConstruction,
  firstSliceProjectionToSvg,
  firstSliceScreenDrawOps,
  loadFirstSliceMassingDocument,
  projectFirstSliceFixedSurvey,
  projectOrthogonalCrossFirstSliceMassingFixedSurvey,
  projectSavedFirstSliceMassingFantasyConstructionFixedSurvey,
  projectSavedOrthogonalCrossFirstSliceMassingFixedSurvey,
  registerFantasyConstructionMechanism,
  resolveFirstSliceContent,
  saveFirstSliceMassingDocument,
} from '../../src/domain/townMap/fabric/index.js';
import { sealCanonicalArtifact } from '../../src/domain/townMap/fabric/foundation.js';
import { stableSceneStringify } from '../../src/domain/townScene/stableScene.js';
import { makeFirstSliceDocument } from '../fixtures/townMapFirstSliceFixtures.js';
import { makeSettlementMassingRosterBundleInputs } from '../fixtures/townMapSettlementFabricFixtures.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const DOCUMENT_ID = 'document:first-slice-massing:001';
const FREE_PLOT_ID = 'block:settlement:high-x-low-z:plot:01';
const LEGACY_HASH = 'scene-v1-56e0d430be735fbbab2f7aa4b4b50281';

function clone(value) { return JSON.parse(stableSceneStringify(value)); }
function refOf(artifact) { return canonicalArtifactRef(artifact); }
function reseal(artifact, mutate) {
  const body = clone(artifact); delete body.contentHash; mutate(body);
  return sealCanonicalArtifact(body);
}
function expectDeepFrozen(value) {
  if (!value || typeof value !== 'object') return;
  expect(Object.isFrozen(value)).toBe(true);
  for (const child of Object.values(value)) expectDeepFrozen(child);
}
function probe(base, key, values) {
  let reads = 0; const input = { ...base };
  Object.defineProperty(input, key, { enumerable: true, get() {
    const value = values[Math.min(reads, values.length - 1)]; reads += 1; return value;
  } });
  return { input, reads: () => reads };
}

function recipe(packageClass = 'BUILT_IN', entryId = 'recipe:fantasy-watch-house') {
  const custom = packageClass === 'CUSTOM';
  return createSpatialRecipeSnapshot({
    packageClass, packageId: custom ? 'package:owner-fantasy' : 'package:settlementforge-core',
    packageVersion: custom ? '2.0.0' : '1.0.0', entryId, entryVersion: 1,
    semanticTypeId: 'semantic:fantasy-watch-house', spatialRole: 'BUILDING',
  });
}
function origin(kind = 'AUTHORED') {
  const authored = kind === 'AUTHORED';
  return createCanonicalOrigin({ kind,
    sourceId: authored ? 'canon:fantasy-watch-house' : 'package:settlementforge-core',
    sourceVersion: '1.0.0',
    contentHash: authored ? 'authored-fantasy-canon-v1' : 'builtin-first-slice-massing-v1' });
}
const DEFAULT_RECIPE = recipe();
const DEFAULT_ORIGIN = origin();

function makeBase(custom = false, documentId = DOCUMENT_ID) {
  const base = makeSettlementMassingRosterBundleInputs(); let installedRecipeSnapshots = [];
  const bodyInputs = base.bodyInputs.map((row) => {
    if (!custom || row.recipeSnapshot.semantics.spatialRole !== 'INSTITUTION') return row;
    const source = row.recipeSnapshot;
    const recipeSnapshot = createSpatialRecipeSnapshot({
      packageClass: 'CUSTOM', packageId: 'package:owner-astronomy', packageVersion: '2.0.0',
      entryId: source.entryId, entryVersion: source.entryVersion,
      semanticTypeId: source.semantics.semanticTypeId, spatialRole: source.semantics.spatialRole,
      geometryLaw: source.semantics.geometryLaw,
    });
    installedRecipeSnapshots = [recipeSnapshot];
    return { ...row, recipeSnapshot, origin: createCanonicalOrigin({
      kind: 'CUSTOM', sourceId: 'package:owner-astronomy', sourceVersion: '2.0.0',
      contentHash: 'custom-astronomy-source-v2' }) };
  });
  const input = { ...base.input, bodyInputs };
  const bundle = compileOrthogonalCrossFirstSliceMassingRosterBundle(input);
  const document = createFirstSliceMassingDocument({
    documentId, massingBundle: bundle, massingCompileInput: input,
  });
  return { ...base, bodyInputs, input, bundle, document,
    bytes: saveFirstSliceMassingDocument(document), installedRecipeSnapshots };
}
function makeSpec(base, options = {}) {
  const selectedRecipe = options.recipe ?? DEFAULT_RECIPE;
  const plotId = options.plotId ?? FREE_PLOT_ID;
  const plot = base.frontageSubdivision.plots.find((row) => row.plotId === plotId);
  return {
    buildingId: options.buildingId ?? 'building:fantasy-watch-house:01',
    semanticTypeId: selectedRecipe.semantics.semanticTypeId,
    foundationRef: base.frontageSubdivision.foundationRef,
    plotRef: { artifactId: base.frontageSubdivision.artifactId,
      contentHash: base.frontageSubdivision.contentHash, plotId },
    privacy: options.privacy ?? 'DM', footprint: plot.fittedFootprint,
    baseElevationQ: 0, wallTopQ: 48,
    roof: { kind: 'GABLE', eaveQ: 48, ridgeQ: 72, ridgeAxis: 'X' },
    materials: { wallMaterialId: 'material:dressed-stone', roofMaterialId: 'material:slate' },
    functionId: 'function:fantasy-watch',
    constructionOperationId: options.operationId ?? 'op:construct-fantasy-watch-house:01',
  };
}
function makeFixture(options = {}) {
  const base = options.base ?? makeBase();
  const selectedRecipe = options.recipe ?? DEFAULT_RECIPE;
  const selectedOrigin = options.origin ?? DEFAULT_ORIGIN;
  const operationId = options.operationId ?? 'op:construct-fantasy-watch-house:01';
  const spec = options.spec ?? makeSpec(base, { ...options, recipe: selectedRecipe, operationId });
  const mechanism = registerFantasyConstructionMechanism({
    mechanismId: options.mechanismId ?? 'mechanism:fantasy-watch-house:v2',
    mechanismVersion: 2, spatialRecipeRef: options.mechanismRecipeRef ?? refOf(selectedRecipe),
  });
  const operation = createFantasyConstructionOperation({ operationId,
    beforeDocumentRef: options.beforeDocumentRef ?? refOf(base.document),
    mechanismRef: options.mechanismRef ?? refOf(mechanism), spec,
    recipeSnapshot: selectedRecipe, origin: selectedOrigin });
  return { base, recipe: selectedRecipe, origin: selectedOrigin, spec, mechanism, operation,
    request: { bytes: base.bytes,
      installedRecipeSnapshots: options.installed ?? base.installedRecipeSnapshots,
      operation, mechanismRegistry: options.registry ?? [mechanism] } };
}
function remakeOperation(fixture, overrides = {}) {
  return createFantasyConstructionOperation({
    operationId: overrides.operationId ?? fixture.operation.artifactId,
    beforeDocumentRef: overrides.beforeDocumentRef ?? fixture.operation.beforeDocumentRef,
    mechanismRef: overrides.mechanismRef ?? fixture.operation.mechanismRef,
    spec: overrides.spec ?? fixture.operation.payload.spec,
    recipeSnapshot: overrides.recipeSnapshot ?? fixture.operation.payload.recipeSnapshot,
    origin: overrides.origin ?? fixture.operation.payload.origin,
  });
}
function execute(fixture, overrides = {}) {
  return executeFantasyConstruction({ ...fixture.request, ...overrides });
}
function project(fixture, audience) {
  return projectSavedFirstSliceMassingFantasyConstructionFixedSurvey({
    audience, ...fixture.request,
  });
}
function baseMasses(state, base) {
  const hashes = new Set(base.bundle.buildingMasses.map((mass) => mass.contentHash));
  return state.buildingMasses.filter((mass) => hashes.has(mass.contentHash));
}

describe('MF-VS1 registered fantasy construction', () => {
  it('A1 snapshots once and replay-closes mechanism, operation, and saved execution', () => {
    const fixture = makeFixture();
    const mechanismInput = { mechanismId: 'mechanism:probe:v2', mechanismVersion: 2,
      spatialRecipeRef: refOf(fixture.recipe) };
    const mechanismProbe = probe(mechanismInput, 'spatialRecipeRef', [
      mechanismInput.spatialRecipeRef, { artifactId: 'wrong', contentHash: 'wrong' }]);
    registerFantasyConstructionMechanism(mechanismProbe.input);
    const operationInput = { operationId: 'op:probe:01', beforeDocumentRef: refOf(fixture.base.document),
      mechanismRef: refOf(fixture.mechanism),
      spec: makeSpec(fixture.base, { operationId: 'op:probe:01' }),
      recipeSnapshot: fixture.recipe, origin: fixture.origin };
    const operationProbe = probe(operationInput, 'spec', [operationInput.spec, {}]);
    createFantasyConstructionOperation(operationProbe.input);
    const executionProbe = probe(fixture.request, 'bytes', [fixture.base.bytes, '{}']);
    const result = executeFantasyConstruction(executionProbe.input);
    expect([mechanismProbe.reads(), operationProbe.reads(), executionProbe.reads()]).toEqual([1, 1, 1]);
    expect(Object.keys(result).sort()).toEqual(['constructionState', 'receipt']);
    expect(result.constructionState).toMatchObject({
      artifactKind: 'FIRST_SLICE_MASSING_CONSTRUCTION_STATE',
      schemaVersion: FIRST_SLICE_MASSING_CONSTRUCTION_STATE_SCHEMA_VERSION,
      lawVersion: FIRST_SLICE_MASSING_CONSTRUCTION_STATE_LAW_VERSION,
    });
    expectDeepFrozen(result);
    const legacy = registerFantasyConstructionMechanism({
      mechanismId: 'mechanism:necromantic-construction:v1', mechanismVersion: 1,
      allowedSemanticTypeIds: ['semantic:necromantic-observatory'] });
    expect(legacy.contentHash).toBe(LEGACY_HASH);
    expect(() => execute(fixture, { operation: remakeOperation(fixture, { mechanismRef: refOf(legacy) }),
      mechanismRegistry: [legacy] })).toThrow(TypeError);
    const oldOperation = reseal(fixture.operation, (body) => {
      delete body.schemaVersion; delete body.lawVersion;
    });
    expect(() => execute(fixture, { operation: oldOperation })).toThrow(TypeError);
  });

  it('A2 derives one explicit DM mass and an acyclic sealed state and receipt', () => {
    const fixture = makeFixture();
    const loaded = loadFirstSliceMassingDocument(fixture.base.bytes, []);
    const { constructionState: state, receipt } = execute(fixture);
    expect(state.beforeDocumentRef).toEqual(refOf(loaded.document));
    expect(state.baseMassingRosterRef).toEqual(refOf(loaded.document.massingBundle.massingRoster));
    expect(state.changeOperationRefs).toEqual([refOf(fixture.operation)]);
    expect(state.buildingMasses).toHaveLength(3);
    const ids = state.buildingMasses.map((mass) => mass.geometry.buildingId);
    expect(ids).toEqual([...ids].sort());
    expect(baseMasses(state, fixture.base)).toEqual(fixture.base.bundle.buildingMasses);
    const added = state.buildingMasses.find((mass) => mass.geometry.buildingId === fixture.spec.buildingId);
    expect(added.geometry).toMatchObject({ privacy: 'DM',
      footprint: [[550, 254], [846, 254], [846, 440], [550, 440]],
      roof: { kind: 'GABLE' }, constructionOperationId: fixture.operation.artifactId });
    expect([added.recipeSnapshot.packageClass, added.origin.kind]).toEqual(['BUILT_IN', 'AUTHORED']);
    expect(fixture.mechanism.spatialRecipeRef).toEqual(refOf(fixture.recipe));
    expect(receipt).toMatchObject({ artifactKind: 'FANTASY_CONSTRUCTION_RECEIPT', schemaVersion: 1,
      lawVersion: FIRST_SLICE_MASSING_CONSTRUCTION_STATE_LAW_VERSION,
      beforeDocumentRef: refOf(loaded.document), afterConstructionStateRef: refOf(state),
      operationRef: refOf(fixture.operation), mechanismRef: refOf(fixture.mechanism),
      effect: { kind: 'BUILDING_ADDED', buildingId: fixture.spec.buildingId,
        plotRef: added.geometry.plotRef, massRef: refOf(added) } });
    expect(Object.keys(state).sort()).toEqual(['artifactId', 'artifactKind', 'baseMassingRosterRef',
      'beforeDocumentRef', 'buildingMasses', 'changeOperationRefs', 'contentHash', 'lawVersion',
      'schemaVersion']);
    const bytes = stableSceneStringify({ state, receipt });
    for (const forbidden of ['historicalEvidence', 'probabilityProtocol', 'choiceReceipt', 'seed', 'weights']) {
      expectAbsentWithAnchor(bytes, forbidden, 'FIRST_SLICE_MASSING_CONSTRUCTION_STATE', 'explicit authority');
    }
  });

  it('A3 keeps PUBLIC bytes exact and sends the hidden third shell through the shared DM path', () => {
    const fixture = makeFixture({ buildingId: 'b'.repeat(87) });
    const before = projectSavedOrthogonalCrossFirstSliceMassingFixedSurvey({
      audience: 'PUBLIC', bytes: fixture.base.bytes, installedRecipeSnapshots: [] });
    const result = execute(fixture); const publicAfter = project(fixture, 'PUBLIC');
    const dmAfter = project(fixture, 'DM');
    expect(stableSceneStringify(publicAfter)).toBe(stableSceneStringify(before));
    expect(firstSliceScreenDrawOps(publicAfter)).toBe(publicAfter.drawOps);
    expect(firstSliceProjectionToSvg(publicAfter)).toBe(firstSliceProjectionToSvg(before));
    expect(dmAfter.drawOps).toHaveLength(21);
    expect(dmAfter.semanticPrimitives.filter((row) => row.semanticId === fixture.spec.buildingId)
      .map((row) => row.kind)).toEqual(['SHADOW', 'BUILDING', 'ROOF_RIDGE']);
    const loaded = loadFirstSliceMassingDocument(fixture.base.bytes, []);
    expect(dmAfter.sourceAuthority).toEqual({ kind: 'DM_MASSING_CONSTRUCTION_STATE',
      lawVersion: FIRST_SLICE_MASSING_CONSTRUCTION_PROJECTION_LAW_VERSION,
      documentRef: refOf(loaded.document), contentResolutionReportRef: refOf(loaded.resolutionReport),
      constructionStateRef: refOf(result.constructionState), receiptRef: refOf(result.receipt) });
    const publicBytes = stableSceneStringify(publicAfter); const dmBytes = stableSceneStringify(dmAfter);
    expect(dmBytes).toContain(fixture.spec.buildingId);
    for (const hidden of [fixture.spec.buildingId, result.constructionState.artifactId,
      result.receipt.artifactId, fixture.operation.artifactId, fixture.mechanism.artifactId]) {
      expectAbsentWithAnchor(publicBytes, hidden, 'FIRST_SLICE_PROJECTION', 'PUBLIC privacy');
    }
    const projectionProbe = probe({ audience: 'DM', ...fixture.request }, 'bytes', [
      fixture.base.bytes, '{}']);
    expect(stableSceneStringify(
      projectSavedFirstSliceMassingFantasyConstructionFixedSurvey(projectionProbe.input),
    )).toBe(dmBytes);
    expect(projectionProbe.reads()).toBe(1);
  });

  it('A4 refuses exactly six bounded envelope, source, operation, mechanism, payload, and collision classes', () => {
    const fixture = makeFixture(); const loaded = loadFirstSliceMassingDocument(fixture.base.bytes, []);
    const crossed = remakeOperation(fixture, { beforeDocumentRef: refOf(makeBase(false, 'document:other').document) });
    const unversioned = reseal(fixture.operation, (body) => {
      delete body.schemaVersion; delete body.lawVersion;
    });
    const badOperation = reseal(fixture.operation, (body) => { body.extra = true; });
    const legacy = registerFantasyConstructionMechanism({ mechanismId: 'mechanism:legacy:v1',
      mechanismVersion: 1, allowedSemanticTypeIds: [fixture.spec.semanticTypeId] });
    const badMechanism = reseal(fixture.mechanism, (body) => { body.extra = true; });
    const wrongRef = remakeOperation(fixture, { mechanismRef: {
      artifactId: fixture.mechanism.artifactId, contentHash: 'scene-v1-wrong-mechanism-hash' } });
    const badPayload = reseal(fixture.operation, (body) => {
      body.payload.recipeSnapshot = reseal(body.payload.recipeSnapshot, (row) => { row.schemaVersion = 99; });
    });
    const mismatch = makeFixture({ mechanismRecipeRef: refOf(recipe('BUILT_IN', 'recipe:other')) });
    const buildingRecipe = fixture.base.bodyInputs[0].recipeSnapshot;
    const buildingCollision = makeFixture({ recipe: buildingRecipe,
      buildingId: fixture.base.bodyInputs[0].spec.buildingId });
    const plotCollision = makeFixture({ plotId: fixture.base.bodyInputs[0].spec.plotRef.plotId });
    const operationCollision = makeFixture({
      operationId: fixture.base.bodyInputs[0].spec.constructionOperationId });
    const afterBytes = stableSceneStringify(execute(fixture).constructionState);
    const classes = [
      ['envelope', [
        ['old loaded', () => executeFantasyConstruction({ loaded, operation: fixture.operation,
          mechanismRegistry: [fixture.mechanism] })],
        ['executor extra', () => execute(fixture, { constructionState: {} })],
        ['projector extra', () => projectSavedFirstSliceMassingFantasyConstructionFixedSurvey({
          audience: 'PUBLIC', ...fixture.request, receipt: {} })]]],
      ['source', [
        ['invalid bytes', () => execute(fixture, { bytes: '{}' })],
        ['read-only', () => {
          const custom = makeFixture({ base: makeBase(true) });
          return execute(custom, { installedRecipeSnapshots: [] });
        }]]],
      ['operation', [
        ['crossed', () => execute(fixture, { operation: crossed })],
        ['unversioned', () => execute(fixture, { operation: unversioned })],
        ['non-replaying', () => execute(fixture, { operation: badOperation })]]],
      ['mechanism', [
        ['legacy', () => execute(fixture, { operation: remakeOperation(fixture,
          { mechanismRef: refOf(legacy) }), mechanismRegistry: [legacy] })],
        ['missing', () => execute(fixture, { mechanismRegistry: [] })],
        ['non-replaying', () => execute(fixture, { mechanismRegistry: [badMechanism] })],
        ['duplicate', () => execute(fixture, { mechanismRegistry: [fixture.mechanism,
          clone(fixture.mechanism)] })],
        ['wrong-ref', () => execute(fixture, { operation: wrongRef })]]],
      ['payload', [
        ['non-replaying', () => execute(fixture, { operation: badPayload })],
        ['non-DM', () => execute(makeFixture({ privacy: 'PUBLIC' }))],
        ['non-BUILT_IN', () => execute(makeFixture({ recipe: recipe('CUSTOM') }))],
        ['non-AUTHORED', () => execute(makeFixture({ origin: origin('BUILT_IN') }))],
        ['recipe-ref mismatch', () => execute(mismatch)]]],
      ['collision', [
        ['building', () => execute(buildingCollision)], ['plot', () => execute(plotCollision)],
        ['operation', () => execute(operationCollision)],
        ['chaining', () => execute(fixture, { bytes: afterBytes })]]],
    ];
    expect(classes).toHaveLength(6);
    for (const [classLabel, subrows] of classes) {
      expect(subrows.length, classLabel).toBeGreaterThan(0);
      for (const [label, run] of subrows) expect(run, `${classLabel}: ${label}`).toThrow(TypeError);
    }
  });

  it('A5 keeps identity deterministic under clones, registry order, and maximum legal IDs', () => {
    const fixture = makeFixture();
    const legacy = registerFantasyConstructionMechanism({ mechanismId: 'mechanism:replay-only:v1',
      mechanismVersion: 1, allowedSemanticTypeIds: ['semantic:replay-only'] });
    const request = { ...fixture.request, mechanismRegistry: [legacy, fixture.mechanism] };
    const before = stableSceneStringify(request); const first = executeFantasyConstruction(request);
    for (const equivalent of [request, clone(request),
      { ...request, mechanismRegistry: [...request.mechanismRegistry].reverse() }]) {
      expect(stableSceneStringify(executeFantasyConstruction(equivalent)))
        .toBe(stableSceneStringify(first));
    }
    expect(stableSceneStringify(request)).toBe(before);
    expect([Object.isFrozen(request), Object.isFrozen(request.mechanismRegistry)]).toEqual([false, false]);
    const maximum = makeFixture({ base: makeBase(false, 'd'.repeat(96)), buildingId: 'b'.repeat(87),
      operationId: 'o'.repeat(96), mechanismId: 'm'.repeat(96) });
    const result = execute(maximum); const dm = project(maximum, 'DM');
    expect(result.constructionState.buildingMasses.find((mass) => (
      mass.geometry.buildingId === maximum.spec.buildingId)).geometry.artifactId).toHaveLength(96);
    for (const artifact of [result.constructionState, result.receipt, dm]) {
      expect(artifact.artifactId.length).toBeLessThanOrEqual(96);
    }
  });

  it('A6 preserves predecessor pins and leaves no caller-loaded executor alias', () => {
    const fixture = makeFixture(); const result = execute(fixture);
    expect(() => compileOrthogonalCrossFirstSliceMassingRosterBundle({ ...fixture.base.input,
      bodyInputs: [...fixture.base.bodyInputs,
        { spec: fixture.spec, recipeSnapshot: fixture.recipe, origin: fixture.origin }] }))
      .toThrow(TypeError);
    const custom = makeBase(true);
    const saved = ['PUBLIC', 'DM'].map((audience) => (
      projectSavedOrthogonalCrossFirstSliceMassingFixedSurvey({ audience, bytes: custom.bytes,
        installedRecipeSnapshots: custom.installedRecipeSnapshots }).contentHash));
    expect(saved).toEqual(['scene-v1-b90080500e9e0a99b6ee469444832743',
      'scene-v1-47ec385c5ea913fbad576ef8cc2d2219']);
    const direct = makeSettlementMassingRosterBundleInputs();
    const bundle = compileOrthogonalCrossFirstSliceMassingRosterBundle(direct.input);
    expect(['PUBLIC', 'DM'].map((audience) => projectOrthogonalCrossFirstSliceMassingFixedSurvey({
      audience, massingBundle: bundle, massingCompileInput: direct.input }).contentHash))
      .toEqual(['scene-v1-2f65d0d84551c889da48e08ceb1eb27f',
        'scene-v1-bc2930de2297900d8715aa32b1a884c3']);
    const { document } = makeFirstSliceDocument(); const report = resolveFirstSliceContent(document, []);
    expect(['PUBLIC', 'DM'].map((audience) => projectFirstSliceFixedSurvey({
      document, resolutionReport: report, audience }).contentHash))
      .toEqual(['scene-v1-9820c3f2273a313f22ff9246c65e1891',
        'scene-v1-1945e8a01df6c24788c3393c4e3c452d']);
    expect(saveFirstSliceMassingDocument(fixture.base.document)).toBe(fixture.base.bytes);
    expect(baseMasses(result.constructionState, fixture.base)).toEqual(fixture.base.bundle.buildingMasses);
    expect(result.constructionState.baseMassingRosterRef).toEqual(refOf(fixture.base.bundle.massingRoster));
    expect(() => executeFantasyConstruction({ loaded: loadFirstSliceMassingDocument(fixture.base.bytes, []),
      operation: fixture.operation, mechanismRegistry: [fixture.mechanism] })).toThrow(TypeError);
    expect(Object.keys(publicFabricApi).filter((name) => name.startsWith('execute')
      && name.includes('FantasyConstruction'))).toEqual(['executeFantasyConstruction']);
    expect(Object.keys(publicFabricApi).filter((name) => name.startsWith('project')
      && name.includes('FantasyConstruction')))
      .toEqual(['projectSavedFirstSliceMassingFantasyConstructionFixedSurvey']);
    const bytes = stableSceneStringify(result);
    for (const forbidden of ['choiceReceipt', 'samplingReceipt', 'historicalEvidence']) {
      expectAbsentWithAnchor(bytes, forbidden, 'FANTASY_CONSTRUCTION_RECEIPT', 'retarget barrier');
    }
  });
});
