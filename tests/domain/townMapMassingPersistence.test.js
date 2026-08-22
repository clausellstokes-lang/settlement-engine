import { describe, expect, it } from 'vitest';

import {
  FIRST_SLICE_MASSING_DOCUMENT_LAW_VERSION, FIRST_SLICE_MASSING_DOCUMENT_PROJECTION_LAW_VERSION,
  FIRST_SLICE_MASSING_DOCUMENT_SCHEMA_VERSION, assertFirstSliceMassingMutable,
  canonicalArtifactRef, compileOrthogonalCrossFirstSliceMassingRosterBundle,
  createCanonicalOrigin, createFirstSliceMassingDocument, createSpatialRecipeSnapshot,
  firstSliceProjectionToSvg, firstSliceScreenDrawOps, loadFirstSliceMassingDocument,
  projectFirstSliceFixedSurvey, projectOrthogonalCrossFirstSliceMassingFixedSurvey,
  projectSavedOrthogonalCrossFirstSliceMassingFixedSurvey, resolveFirstSliceContent,
  saveFirstSliceMassingDocument,
} from '../../src/domain/townMap/fabric/index.js';
import { sealCanonicalArtifact } from '../../src/domain/townMap/fabric/foundation.js';
import { stableSceneStringify } from '../../src/domain/townScene/stableScene.js';
import { makeFirstSliceDocument } from '../fixtures/townMapFirstSliceFixtures.js';
import { makeSettlementMassingRosterBundleInputs } from '../fixtures/townMapSettlementFabricFixtures.js';
import { expectAbsentWithAnchor, expectPresentThenAbsent } from '../helpers/anchoredNegatives.js';

const DOCUMENT_ID = 'document:first-slice-massing:001';
const CUSTOM_PACKAGE_ID = 'package:owner-astronomy';

/** @param {unknown} value */
function clone(value) {
  return JSON.parse(stableSceneStringify(value));
}

/** @param {unknown} value */
function expectDeepFrozen(value) {
  if (!value || typeof value !== 'object') return;
  expect(Object.isFrozen(value)).toBe(true);
  for (const child of Object.values(value)) expectDeepFrozen(child);
}

/** @param {Record<string,unknown>} artifact @param {(body:Record<string,unknown>)=>void} mutate */
function reseal(artifact, mutate) {
  const body = clone(artifact);
  delete body.contentHash; mutate(body);
  return sealCanonicalArtifact(body);
}

/** @param {{packageClass?:'BUILT_IN'|'CUSTOM',privacy?:'PUBLIC'|'DM',buildingId?:string}} [options] */
function makeMassingFixture(options = {}) {
  const packageClass = options.packageClass ?? 'CUSTOM';
  const base = makeSettlementMassingRosterBundleInputs();
  let institutionInput;
  const bodyInputs = base.bodyInputs.map((row) => {
    if (row.recipeSnapshot.semantics.spatialRole !== 'INSTITUTION') return row;
    const spec = clone(row.spec);
    if (options.buildingId) {
      spec.buildingId = options.buildingId;
      spec.attachment.buildingId = options.buildingId;
    }
    spec.attachment.privacy = options.privacy ?? 'PUBLIC';
    if (packageClass === 'BUILT_IN') {
      institutionInput = { ...row, spec };
      return institutionInput;
    }
    const recipe = row.recipeSnapshot;
    institutionInput = {
      spec,
      recipeSnapshot: createSpatialRecipeSnapshot({
        packageClass: 'CUSTOM', packageId: CUSTOM_PACKAGE_ID, packageVersion: '2.0.0',
        entryId: recipe.entryId, entryVersion: recipe.entryVersion,
        semanticTypeId: recipe.semantics.semanticTypeId,
        spatialRole: recipe.semantics.spatialRole, geometryLaw: recipe.semantics.geometryLaw,
      }),
      origin: createCanonicalOrigin({
        kind: 'CUSTOM', sourceId: CUSTOM_PACKAGE_ID, sourceVersion: '2.0.0',
        contentHash: 'custom-astronomy-source-v2',
      }),
    };
    return institutionInput;
  });
  const input = { ...base.input, bodyInputs };
  const bundle = compileOrthogonalCrossFirstSliceMassingRosterBundle(input);
  return { ...base, input, bundle, institutionInput };
}

/** @param {ReturnType<typeof makeMassingFixture>} fixture @param {string} [documentId] @param {Record<string,unknown>} [input] */
function documentFor(fixture, documentId = DOCUMENT_ID, input = fixture.input) {
  return createFirstSliceMassingDocument({ documentId,
    massingBundle: fixture.bundle, massingCompileInput: input });
}

/** @param {string} bytes @param {Array<Record<string,unknown>>} installed @param {'PUBLIC'|'DM'} [audience] */
function projectSaved(bytes, installed, audience = 'PUBLIC') {
  return projectSavedOrthogonalCrossFirstSliceMassingFixedSurvey({
    audience, bytes, installedRecipeSnapshots: installed });
}

/** @param {ReturnType<typeof makeMassingFixture>} fixture @param {'PUBLIC'|'DM'} [audience] */
function projectDirect(fixture, audience = 'PUBLIC') {
  return projectOrthogonalCrossFirstSliceMassingFixedSurvey({ audience,
    massingBundle: fixture.bundle, massingCompileInput: fixture.input });
}

/** @param {ReturnType<typeof makeMassingFixture>['bundle']} bundle @param {string} kind */
function massForKind(bundle, kind) {
  const binding = bundle.massingRoster.bodyBindings.find((row) => row.bodyKind === kind);
  return bundle.buildingMasses.find((mass) => mass.artifactId === binding.massRef.artifactId);
}

/** @param {{artifactId:string,contentHash:string}} ref @param {Array<Record<string,unknown>>} artifacts @param {string} label */
function expectRefOnce(ref, artifacts, label) {
  expect(artifacts.filter((artifact) => artifact.artifactId === ref.artifactId
    && artifact.contentHash === ref.contentHash), label).toHaveLength(1);
}

/** @param {Record<string,unknown>} base @param {string} key @param {unknown[]} values */
function accessorProbe(base, key, values) {
  let reads = 0;
  const input = { ...base };
  Object.defineProperty(input, key, { enumerable: true, get() {
    const value = values[Math.min(reads, values.length - 1)];
    reads += 1;
    return value;
  } });
  return { input, reads: () => reads };
}

describe('MF-T1S roster-aware first-slice massing persistence', () => {
  it('A1 creates detached canonical replay bytes without freezing or rereading caller input', () => {
    const fixture = makeMassingFixture();
    const callerBytes = stableSceneStringify({ input: fixture.input, bundle: fixture.bundle });
    const freezeState = [fixture.input, fixture.input.bodyInputs, fixture.institutionInput.spec]
      .map(Object.isFrozen);
    const probe = accessorProbe({
      documentId: DOCUMENT_ID, massingBundle: fixture.bundle,
      massingCompileInput: fixture.input,
    }, 'massingCompileInput', [fixture.input, {}]);
    const document = createFirstSliceMassingDocument(probe.input);
    expect(probe.reads()).toBe(1);
    expect(Object.keys(document).sort()).toEqual(['artifactId', 'artifactKind', 'contentHash',
      'lawVersion', 'massingBundle', 'massingCompileInput', 'schemaVersion']);
    expect(document).toMatchObject({
      artifactKind: 'FIRST_SLICE_MASSING_DOCUMENT', artifactId: DOCUMENT_ID,
      schemaVersion: FIRST_SLICE_MASSING_DOCUMENT_SCHEMA_VERSION,
      lawVersion: FIRST_SLICE_MASSING_DOCUMENT_LAW_VERSION });
    const bodyIds = document.massingCompileInput.bodyInputs.map((row) => row.spec.buildingId);
    expect(bodyIds).toEqual([...bodyIds].sort());
    expect(document.massingBundle).toEqual(fixture.bundle);
    expect(stableSceneStringify({ input: fixture.input, bundle: fixture.bundle })).toBe(callerBytes);
    expect([fixture.input, fixture.input.bodyInputs, fixture.institutionInput.spec].map(Object.isFrozen))
      .toEqual(freezeState);
    expect(Object.isFrozen(probe.input)).toBe(false);

    const reversedInput = { ...fixture.input, bodyInputs: [...fixture.input.bodyInputs].reverse() };
    const reversed = documentFor(fixture, DOCUMENT_ID, reversedInput);
    const bytes = saveFirstSliceMassingDocument(document);
    expect(saveFirstSliceMassingDocument(reversed)).toBe(bytes);
    const loaded = loadFirstSliceMassingDocument(bytes, [fixture.institutionInput.recipeSnapshot]);
    expect(saveFirstSliceMassingDocument(loaded.document)).toBe(bytes);
    expectDeepFrozen(loaded);

    expectRefOnce(document.massingBundle.massingRoster.firstSliceFabricRootRef,
      [document.massingCompileInput.firstSliceFabricRoot], 'Fabric root ref');
    expectRefOnce(document.massingBundle.massingRoster.parcelRegistryRef,
      [document.massingCompileInput.parcelRegistry], 'parcel-registry ref');
    for (const binding of document.massingBundle.massingRoster.bodyBindings) {
      expectRefOnce(binding.massRef, document.massingBundle.buildingMasses, 'mass ref');
      expectRefOnce(binding.parcelRef, [document.massingCompileInput.parcelRegistry], 'parcel ref');
    }
    for (const mass of document.massingBundle.buildingMasses) {
      expectRefOnce(mass.geometryRef, [mass.geometry], 'geometry ref');
    }

    const maximum = documentFor(fixture, 'z'.repeat(96)); const maximumBytes = saveFirstSliceMassingDocument(maximum);
    const maximumLoad = loadFirstSliceMassingDocument(maximumBytes, []);
    const maximumProjection = projectSaved(maximumBytes, []);
    for (const artifact of [maximum, maximumLoad.resolutionReport, maximumProjection]) {
      expect(artifact.artifactId.length).toBeLessThanOrEqual(96);
    }
  });

  it('A2 preserves visible geometry and marks an explicitly empty active package view read-only', () => {
    const fixture = makeMassingFixture();
    const bytes = saveFirstSliceMassingDocument(documentFor(fixture));
    const loaded = loadFirstSliceMassingDocument(bytes, []);
    expect(loaded.document.massingBundle.buildingMasses).toEqual(fixture.bundle.buildingMasses);
    expect(loaded.resolutionReport.resolved).toEqual([]);
    expect(loaded.resolutionReport.unresolved).toHaveLength(1);
    expect(loaded.resolutionReport.unresolved[0]).toMatchObject({
      subject: { kind: 'ENTITY', entityId: fixture.institutionInput.spec.buildingId },
      privacy: 'PUBLIC', status: 'UNRESOLVED_PACKAGE_MISSING',
      recipe: canonicalArtifactRef(fixture.institutionInput.recipeSnapshot),
    });
    expect(loaded.readOnly).toBe(true);
    expect(() => assertFirstSliceMassingMutable({
      bytes, installedRecipeSnapshots: [],
    })).toThrow(/read-only/);
    expect(saveFirstSliceMassingDocument(loaded.document)).toBe(bytes);

    const projection = projectSaved(bytes, []);
    const direct = projectDirect(fixture);
    const markerIndex = projection.semanticPrimitives
      .findIndex((row) => row.kind === 'UNRESOLVED_CUSTOM_CONTENT');
    expect(projection.warnings).toEqual([{
      code: 'UNRESOLVED_CUSTOM_CONTENT', entityId: fixture.institutionInput.spec.buildingId,
    }]);
    expect(projection.semanticPrimitives).toHaveLength(19);
    expect(projection.drawOps).toHaveLength(19);
    expect(projection.semanticPrimitives[markerIndex].op.t).toBe('circle');
    expect(projection.semanticPrimitives.filter((_, index) => index !== markerIndex))
      .toEqual(direct.semanticPrimitives);
    expect(projection.drawOps.filter((_, index) => index !== markerIndex)).toEqual(direct.drawOps);
  });

  it('A3 validates active snapshots, resolves exact hashes, and keeps PUBLIC origin-neutral', () => {
    const custom = makeMassingFixture();
    const recipe = custom.institutionInput.recipeSnapshot;
    const bytes = saveFirstSliceMassingDocument(documentFor(custom));
    const installed = [recipe];
    const installedBytes = stableSceneStringify(installed);
    const loaded = loadFirstSliceMassingDocument(bytes, installed);
    expect(loaded.readOnly).toBe(false);
    expect(loaded.resolutionReport.resolved).toHaveLength(1);
    expect(loaded.resolutionReport.unresolved).toEqual([]);
    expect(stableSceneStringify(installed)).toBe(installedBytes);
    expect(() => assertFirstSliceMassingMutable({
      bytes, installedRecipeSnapshots: installed,
    })).not.toThrow();
    const resolvedProjection = projectSaved(bytes, installed);
    expect(resolvedProjection.warnings).toEqual([]);
    expect(resolvedProjection.semanticPrimitives).toHaveLength(18);

    const wrongHash = createSpatialRecipeSnapshot({ packageClass: recipe.packageClass,
      packageId: recipe.packageId, packageVersion: '2.0.1', entryId: recipe.entryId,
      entryVersion: recipe.entryVersion, semanticTypeId: recipe.semantics.semanticTypeId,
      spatialRole: recipe.semantics.spatialRole, geometryLaw: recipe.semantics.geometryLaw });
    expect(wrongHash.artifactId).toBe(recipe.artifactId);
    const wrongLoad = loadFirstSliceMassingDocument(bytes, [wrongHash]);
    expect(wrongLoad.resolutionReport.unresolved).toHaveLength(1);
    const activeRefusals = [
      ['malformed row', [{ ...recipe, packageVersion: {} }]],
      ['hash-correct non-replay', [reseal(recipe, (body) => { body.schemaVersion = 99; })]],
      ['duplicate exact key', [recipe, recipe]],
      ['duplicate artifact ID', [recipe, wrongHash]],
    ];
    expect(activeRefusals).toHaveLength(4);
    for (const [label, snapshots] of activeRefusals) {
      expect(() => loadFirstSliceMassingDocument(bytes, snapshots), label).toThrow(TypeError);
    }
    expect(saveFirstSliceMassingDocument(loaded.document)).toBe(bytes);

    const builtIn = makeMassingFixture({ packageClass: 'BUILT_IN' });
    const builtBytes = saveFirstSliceMassingDocument(documentFor(builtIn));
    const builtPublic = projectSaved(builtBytes, []);
    expect(stableSceneStringify(resolvedProjection)).toBe(stableSceneStringify(builtPublic));
    const builtDm = projectSaved(builtBytes, [], 'DM');
    const customDm = projectSaved(bytes, installed, 'DM');
    expect(stableSceneStringify(customDm)).not.toBe(stableSceneStringify(builtDm));
  });

  it('A4 refuses the closed six-class replay and API-boundary forgery matrix', () => {
    const fixture = makeMassingFixture();
    const recipe = fixture.institutionInput.recipeSnapshot;
    const document = documentFor(fixture);
    const bytes = saveFirstSliceMassingDocument(document);
    const alternate = makeSettlementMassingRosterBundleInputs({ setbackQ: 21 });
    const wrongDigest = clone(document); wrongDigest.contentHash = 'scene-v1-forged-document';
    const replayMismatch = reseal(document, (body) => {
      body.massingCompileInput = clone(alternate.input);
    });
    const classes = [
      ['extra create key', () => createFirstSliceMassingDocument({
        documentId: DOCUMENT_ID, massingBundle: fixture.bundle,
        massingCompileInput: fixture.input, extra: true,
      })],
      ['crossed bundle/input', () => createFirstSliceMassingDocument({
        documentId: DOCUMENT_ID, massingBundle: fixture.bundle,
        massingCompileInput: alternate.input,
      })],
      ['noncanonical JSON', () => loadFirstSliceMassingDocument(`${bytes}\n`, [recipe])],
      ['wrong document digest', () => loadFirstSliceMassingDocument(
        stableSceneStringify(wrongDigest), [recipe],
      )],
      ['hash-correct replay mismatch', () => loadFirstSliceMassingDocument(
        stableSceneStringify(replayMismatch), [recipe],
      )],
      ['API-boundary forgery', () => {
        const expected = projectSaved(bytes, [recipe]);
        const projectorProbe = accessorProbe({
          audience: 'PUBLIC', bytes, installedRecipeSnapshots: [recipe],
        }, 'bytes', [bytes, '{}']);
        const projectorSubrows = [
          ['wrong audience', () => expect(() => (
            projectSavedOrthogonalCrossFirstSliceMassingFixedSurvey({
              audience: 'PLAYER', bytes, installedRecipeSnapshots: [recipe],
            })
          )).toThrow(TypeError)],
          ['caller report extra key', () => expect(() => (
            projectSavedOrthogonalCrossFirstSliceMassingFixedSurvey({
              audience: 'PUBLIC', bytes, installedRecipeSnapshots: [recipe],
              resolutionReport: loadFirstSliceMassingDocument(bytes, [recipe]).resolutionReport,
            })
          )).toThrow(TypeError)],
          ['stateful accessor', () => {
            const actual = projectSavedOrthogonalCrossFirstSliceMassingFixedSurvey(projectorProbe.input);
            expect(projectorProbe.reads()).toBe(1);
            expect(stableSceneStringify(actual)).toBe(stableSceneStringify(expected));
          }],
        ];
        const loaded = loadFirstSliceMassingDocument(bytes, [recipe]);
        const guardProbe = accessorProbe({
          bytes, installedRecipeSnapshots: [recipe],
        }, 'installedRecipeSnapshots', [[recipe], []]);
        const guardSubrows = [
          ['caller-loaded envelope', () => expect(() => assertFirstSliceMassingMutable({
            bytes, installedRecipeSnapshots: [recipe], loaded,
          })).toThrow(TypeError)],
          ['caller readOnly false', () => expect(() => assertFirstSliceMassingMutable({
            bytes, installedRecipeSnapshots: [], readOnly: false,
          })).toThrow(TypeError)],
          ['extra key', () => expect(() => assertFirstSliceMassingMutable({
            bytes, installedRecipeSnapshots: [recipe], extra: true,
          })).toThrow(TypeError)],
          ['stateful accessor', () => {
            expect(() => assertFirstSliceMassingMutable(guardProbe.input)).not.toThrow();
            expect(guardProbe.reads()).toBe(1);
          }],
        ];
        expect(projectorSubrows).toHaveLength(3);
        expect(guardSubrows).toHaveLength(4);
        for (const [label, run] of [...projectorSubrows, ...guardSubrows]) run(label);
      }],
    ];
    expect(classes).toHaveLength(6);
    for (const [label, run] of classes.slice(0, 5)) expect(run, label).toThrow(TypeError);
    classes[5][1]();
  });

  it('A5 keeps hidden unresolved identity DM-only while PUBLIC bytes and SVG remain equal', () => {
    const first = makeMassingFixture({ privacy: 'DM', buildingId: 'building:dm-astronomers-college:01' });
    const second = makeMassingFixture({ privacy: 'DM', buildingId: 'building:dm-astronomers-college:02' });
    const firstBytes = saveFirstSliceMassingDocument(documentFor(first));
    const secondBytes = saveFirstSliceMassingDocument(documentFor(second));
    const firstLoad = loadFirstSliceMassingDocument(firstBytes, []);
    const publicFirst = projectSaved(firstBytes, []);
    const publicSecond = projectSaved(secondBytes, []);
    const dmFirst = projectSaved(firstBytes, [], 'DM');
    const hiddenMass = massForKind(first.bundle, 'INSTITUTION');
    const visibleMass = massForKind(first.bundle, 'BUILDING');
    expect(firstLoad.readOnly).toBe(true);
    expect(firstLoad.resolutionReport.unresolved[0].privacy).toBe('DM');
    expect(dmFirst.warnings).toEqual([{
      code: 'UNRESOLVED_CUSTOM_CONTENT', entityId: hiddenMass.geometry.buildingId,
    }]);
    expect(publicFirst.warnings).toEqual([]);
    expect(publicFirst.semanticPrimitives
      .filter((row) => row.kind === 'UNRESOLVED_CUSTOM_CONTENT')).toEqual([]);
    expect(publicFirst.sourceAuthority).toEqual({
      kind: 'PUBLIC_MASSING_DOCUMENT_DERIVATION',
      lawVersion: FIRST_SLICE_MASSING_DOCUMENT_PROJECTION_LAW_VERSION,
      firstSliceFabricRootRef: first.bundle.massingRoster.firstSliceFabricRootRef,
      foundationRef: canonicalArtifactRef(first.input.foundation),
      frontageSubdivisionRef: canonicalArtifactRef(first.input.frontageSubdivision),
      visibleGeometryRefs: [canonicalArtifactRef(visibleMass.geometry)],
      unresolvedVisibleEntityIds: [],
    });
    expect(dmFirst.sourceAuthority).toEqual({
      kind: 'DM_MASSING_DOCUMENT',
      lawVersion: FIRST_SLICE_MASSING_DOCUMENT_PROJECTION_LAW_VERSION,
      documentRef: canonicalArtifactRef(firstLoad.document),
      contentResolutionReportRef: canonicalArtifactRef(firstLoad.resolutionReport),
    });
    const publicBytes = stableSceneStringify(publicFirst);
    const dmBytes = stableSceneStringify(dmFirst);
    expect(stableSceneStringify(publicSecond)).toBe(publicBytes);
    expect(firstSliceProjectionToSvg(publicSecond)).toBe(firstSliceProjectionToSvg(publicFirst));
    expectPresentThenAbsent(dmBytes, publicBytes, hiddenMass.geometry.buildingId, 'hidden body');
    expectPresentThenAbsent(dmBytes, publicBytes, firstLoad.document.artifactId, 'document ref');
    expectPresentThenAbsent(dmBytes, publicBytes,
      firstLoad.resolutionReport.artifactId, 'resolution-report ref');
    for (const forbidden of [
      hiddenMass.artifactId, first.bundle.massingRoster.artifactId,
      first.institutionInput.recipeSnapshot.artifactId, CUSTOM_PACKAGE_ID,
    ]) expectAbsentWithAnchor(publicBytes, forbidden,
      'PUBLIC_MASSING_DOCUMENT_DERIVATION', 'PUBLIC hidden authority');
  });

  it('A6 pins deterministic saved, direct MASSING, and legacy DOCUMENT predecessor bytes', () => {
    const fixture = makeMassingFixture();
    const document = documentFor(fixture);
    const bytes = saveFirstSliceMassingDocument(document);
    expect(stableSceneStringify(JSON.parse(bytes))).toBe(bytes);
    expect(saveFirstSliceMassingDocument(documentFor(fixture))).toBe(bytes);
    const reversedInput = { ...fixture.input, bodyInputs: [...fixture.input.bodyInputs].reverse() };
    expect(saveFirstSliceMassingDocument(documentFor(fixture, DOCUMENT_ID, reversedInput))).toBe(bytes);
    const saved = projectSaved(bytes, [fixture.institutionInput.recipeSnapshot]);
    expect(stableSceneStringify(projectSaved(bytes, [fixture.institutionInput.recipeSnapshot])))
      .toBe(stableSceneStringify(saved));

    const directFixture = makeSettlementMassingRosterBundleInputs();
    const directBundle = compileOrthogonalCrossFirstSliceMassingRosterBundle(directFixture.input);
    const directPublic = projectOrthogonalCrossFirstSliceMassingFixedSurvey({
      audience: 'PUBLIC', massingBundle: directBundle, massingCompileInput: directFixture.input,
    });
    const directDm = projectOrthogonalCrossFirstSliceMassingFixedSurvey({
      audience: 'DM', massingBundle: directBundle, massingCompileInput: directFixture.input,
    });
    // re-recorded by MF-T2G (§299.3b light-profile strip; authorization: packet body) — the
    // published artifact lost one field, so its contentHash moved once. The save-bytes pins in
    // this same arm are UNCHANGED: documents never embedded the profile.
    expect(directPublic.contentHash).toBe('scene-v1-1321ec6f9b44ec8e1b4e303334e8b964');
    expect(directDm.contentHash).toBe('scene-v1-bbd197b33ba3de7c61b76ac7f4e7f352');

    const { document: legacyDocument } = makeFirstSliceDocument();
    const resolutionReport = resolveFirstSliceContent(legacyDocument, []);
    const legacyPublic = projectFirstSliceFixedSurvey({
      document: legacyDocument, resolutionReport, audience: 'PUBLIC',
    });
    const legacyDm = projectFirstSliceFixedSurvey({
      document: legacyDocument, resolutionReport, audience: 'DM',
    });
    // re-recorded by MF-T2G (§299.3b light-profile strip; authorization: packet body)
    expect(legacyPublic.contentHash).toBe('scene-v1-f9b571a76668a7eee533f1eb0d091db0');
    expect(legacyDm.contentHash).toBe('scene-v1-d143b6efee808314e8dde7ab5ea9f42a');
    expect(firstSliceScreenDrawOps(saved)).toBe(saved.drawOps);
    expect(saved.drawOps).toEqual(directPublic.drawOps);
    expect(firstSliceProjectionToSvg(saved)).toBe(firstSliceProjectionToSvg(directPublic));
    const savedBytes = stableSceneStringify(saved);
    for (const forbidden of [
      'FIRST_SLICE_MAP_DOCUMENT', 'CONTENT_RESOLUTION_REPORT', 'PUBLIC_PROJECTION_INPUT',
      CUSTOM_PACKAGE_ID, 'choiceReceipt', 'fantasyOperation', 'samplingReceipt',
    ]) expectAbsentWithAnchor(savedBytes, forbidden,
      'FIRST_SLICE_PROJECTION', 'saved projection exclusion boundary');
  });
});
