import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import {
  FIRST_SLICE_MASSING_PROJECTION_LAW_VERSION,
  FIXED_SURVEY_LIGHT_V1,
  canonicalArtifactRef,
  compileOrthogonalCrossFirstSliceMassingRosterBundle,
  createCanonicalOrigin,
  createSpatialRecipeSnapshot,
  firstSliceProjectionToSvg,
  firstSliceScreenDrawOps,
  projectFirstSliceFixedSurvey,
  projectOrthogonalCrossFirstSliceMassingFixedSurvey,
  resolveFirstSliceContent,
} from '../../src/domain/townMap/fabric/index.js';
import { sealCanonicalArtifact } from '../../src/domain/townMap/fabric/foundation.js';
import { stableSceneStringify } from '../../src/domain/townScene/stableScene.js';
import {
  makeSettlementMassingRosterBundleInputs,
} from '../fixtures/townMapSettlementFabricFixtures.js';
import { makeFirstSliceDocument } from '../fixtures/townMapFirstSliceFixtures.js';
import {
  expectAbsentWithAnchor,
  expectPresentThenAbsent,
} from '../helpers/anchoredNegatives.js';

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

/** @param {ReturnType<typeof makeSettlementMassingRosterBundleInputs>} fixture */
function compileBundle(fixture) {
  return compileOrthogonalCrossFirstSliceMassingRosterBundle(fixture.input);
}

/** @param {ReturnType<typeof makeSettlementMassingRosterBundleInputs>} fixture @param {ReturnType<typeof compileOrthogonalCrossFirstSliceMassingRosterBundle>} bundle @param {'PUBLIC'|'DM'} audience */
function projectBundle(fixture, bundle, audience) {
  return projectOrthogonalCrossFirstSliceMassingFixedSurvey({
    audience, massingBundle: bundle, massingCompileInput: fixture.input,
  });
}

/** @param {ReturnType<typeof compileOrthogonalCrossFirstSliceMassingRosterBundle>} bundle @param {string} kind */
function massForKind(bundle, kind) {
  const binding = bundle.massingRoster.bodyBindings.find((row) => row.bodyKind === kind);
  return bundle.buildingMasses.find((mass) => mass.artifactId === binding.massRef.artifactId);
}

/** @param {ReturnType<typeof makeSettlementMassingRosterBundleInputs>} fixture @param {(row:Record<string,unknown>)=>Record<string,unknown>} rewrite */
function rewriteInstitution(fixture, rewrite) {
  const bodyInputs = fixture.bodyInputs.map((row) => (
    row.recipeSnapshot.semantics.spatialRole === 'INSTITUTION' ? rewrite(row) : row
  ));
  return { ...fixture, bodyInputs, input: { ...fixture.input, bodyInputs } };
}

/** @param {ReturnType<typeof makeSettlementMassingRosterBundleInputs>} fixture */
function withCustomInstitution(fixture) {
  return rewriteInstitution(fixture, (row) => {
    const recipe = row.recipeSnapshot;
    return {
      ...row,
      recipeSnapshot: createSpatialRecipeSnapshot({
        packageClass: 'CUSTOM', packageId: 'package:owner-astronomy', packageVersion: '2.0.0',
        entryId: recipe.entryId, entryVersion: recipe.entryVersion,
        semanticTypeId: recipe.semantics.semanticTypeId,
        spatialRole: recipe.semantics.spatialRole, geometryLaw: recipe.semantics.geometryLaw,
      }),
      origin: createCanonicalOrigin({
        kind: 'CUSTOM', sourceId: 'package:owner-astronomy', sourceVersion: '2.0.0',
        contentHash: 'custom-astronomy-source-v2',
      }),
    };
  });
}

/** @param {string} buildingId */
function withHiddenInstitution(buildingId) {
  return rewriteInstitution(makeSettlementMassingRosterBundleInputs(), (row) => {
    const spec = clone(row.spec);
    spec.buildingId = buildingId;
    spec.attachment.buildingId = buildingId;
    spec.attachment.privacy = 'DM';
    return { ...row, spec };
  });
}

/** @param {{artifactId:string,contentHash:string}} ref @param {Array<Record<string,unknown>>} artifacts @param {string} label */
function expectRefResolvesOnce(ref, artifacts, label) {
  expect(artifacts.filter((artifact) => (
    artifact.artifactId === ref.artifactId && artifact.contentHash === ref.contentHash
  )), label).toHaveLength(1);
}

/** @param {Record<string,unknown>} artifact @param {(body:Record<string,unknown>)=>void} mutate */
function reseal(artifact, mutate) {
  const body = clone(artifact);
  delete body.contentHash;
  mutate(body);
  return sealCanonicalArtifact(body);
}

describe('MF-T1V roster-aware fixed-survey massing projection', () => {
  it('A1 projects the exact frozen two-body census and shape-correct shadows', () => {
    const fixture = makeSettlementMassingRosterBundleInputs();
    const bundle = compileBundle(fixture);
    const projection = projectBundle(fixture, bundle, 'PUBLIC');
    expect(projection.artifactKind).toBe('FIRST_SLICE_PROJECTION');
    expect(projection.lightProfile).toBe(FIXED_SURVEY_LIGHT_V1);
    expect(projection.semanticPrimitives).toHaveLength(18);
    expect(projection.drawOps).toHaveLength(18);
    expect(Object.fromEntries(['GROUND', 'FRONTAGE', 'SHADOW', 'BUILDING', 'ROOF_RIDGE']
      .map((kind) => [kind, projection.semanticPrimitives.filter((row) => row.kind === kind).length])))
      .toEqual({ GROUND: 4, FRONTAGE: 8, SHADOW: 2, BUILDING: 3, ROOF_RIDGE: 1 });
    const shadows = new Map(projection.semanticPrimitives
      .filter((row) => row.kind === 'SHADOW').map((row) => [row.semanticId, row.op.pts]));
    expect(shadows.get(massForKind(bundle, 'BUILDING').geometry.buildingId)).toHaveLength(4);
    const compositeShadow = shadows.get(massForKind(bundle, 'INSTITUTION').geometry.buildingId);
    expect(compositeShadow).toHaveLength(10);
    expect(compositeShadow).toContainEqual([850, 670]);
    expect(projection.warnings).toEqual([]);
    expectDeepFrozen(projection);
  });

  it('A2 closes exact replay and source refs and refuses only the bounded four-row matrix', () => {
    const fixture = makeSettlementMassingRosterBundleInputs();
    const bundle = compileBundle(fixture);
    expect(stableSceneStringify(compileBundle(fixture))).toBe(stableSceneStringify(bundle));
    const publicProjection = projectBundle(fixture, bundle, 'PUBLIC');
    const dmProjection = projectBundle(fixture, bundle, 'DM');
    expect(dmProjection.sourceAuthority).toEqual({
      kind: 'DM_MASSING_ROSTER', lawVersion: FIRST_SLICE_MASSING_PROJECTION_LAW_VERSION,
      massingRosterRef: canonicalArtifactRef(bundle.massingRoster),
    });
    expect(publicProjection.sourceAuthority).toEqual({
      kind: 'PUBLIC_MASSING_DERIVATION', lawVersion: FIRST_SLICE_MASSING_PROJECTION_LAW_VERSION,
      firstSliceFabricRootRef: bundle.massingRoster.firstSliceFabricRootRef,
      foundationRef: canonicalArtifactRef(fixture.foundation),
      frontageSubdivisionRef: canonicalArtifactRef(fixture.frontageSubdivision),
      visibleGeometryRefs: bundle.buildingMasses.map((mass) => canonicalArtifactRef(mass.geometry)),
    });
    expectRefResolvesOnce(dmProjection.sourceAuthority.massingRosterRef, [bundle.massingRoster], 'DM roster ref');
    expectRefResolvesOnce(publicProjection.sourceAuthority.firstSliceFabricRootRef, [fixture.fabricRoot], 'PUBLIC Fabric ref');
    expectRefResolvesOnce(publicProjection.sourceAuthority.foundationRef, [fixture.foundation], 'PUBLIC foundation ref');
    expectRefResolvesOnce(publicProjection.sourceAuthority.frontageSubdivisionRef, [fixture.frontageSubdivision], 'PUBLIC frontage ref');
    for (const ref of publicProjection.sourceAuthority.visibleGeometryRefs) {
      expectRefResolvesOnce(ref, bundle.buildingMasses.map((mass) => mass.geometry), 'PUBLIC geometry ref');
    }
    const forgedFoundation = clone(fixture.foundation);
    forgedFoundation.blockFaces[0].ring = forgedFoundation.blockFaces[0].ring
      .map(([x, z]) => [x + 1, z]);
    let foundationReads = 0;
    let nextFoundation = fixture.foundation;
    const accessorInput = { ...fixture.input };
    Object.defineProperty(accessorInput, 'foundation', { enumerable: true, get() {
      const value = nextFoundation;
      nextFoundation = forgedFoundation;
      foundationReads += 1;
      return value;
    } });
    const accessorProjection = projectOrthogonalCrossFirstSliceMassingFixedSurvey({
      audience: 'PUBLIC', massingBundle: bundle, massingCompileInput: accessorInput,
    });
    expect(foundationReads).toBe(1);
    expect(stableSceneStringify(accessorProjection)).toBe(stableSceneStringify(publicProjection));
    const alternate = makeSettlementMassingRosterBundleInputs({ setbackQ: 21 });
    expect(compileBundle(alternate).massingRoster.contentHash === bundle.massingRoster.contentHash).toBe(false);
    const request = { audience: 'PUBLIC', massingBundle: bundle, massingCompileInput: fixture.input };
    const cases = [
      ['tampered bundle', { ...request, massingBundle: {
        ...bundle, massingRoster: { ...bundle.massingRoster, contentHash: 'scene-v1-forged' },
      } }],
      ['mixed valid compile input', { ...request, massingCompileInput: alternate.input }],
      ['wrong audience', { ...request, audience: 'PLAYER' }],
      ['extra input key', { ...request, extra: true }],
    ];
    expect(cases).toHaveLength(4);
    for (const [label, input] of cases) {
      expect(() => projectOrthogonalCrossFirstSliceMassingFixedSurvey(input), label).toThrow(TypeError);
    }
  });

  it('A3 keeps visibility, projection, draw, and SVG work in the sole non-barrel core', () => {
    const fixture = makeSettlementMassingRosterBundleInputs();
    const projection = projectBundle(fixture, compileBundle(fixture), 'PUBLIC');
    expect(firstSliceScreenDrawOps(projection)).toBe(projection.drawOps);
    const svg = firstSliceProjectionToSvg(projection, { width: 640, height: 480 });
    expect(svg).toContain('width="640"');
    expect(svg).toBe(firstSliceProjectionToSvg(projection, { width: 640, height: 480 }));
    const projectionSource = readFileSync(new URL(
      '../../src/domain/townMap/fabric/projection.js', import.meta.url,
    ), 'utf8');
    const leafSource = readFileSync(new URL(
      '../../src/domain/townMap/fabric/massingProjection.js', import.meta.url,
    ), 'utf8');
    const barrelSource = readFileSync(new URL(
      '../../src/domain/townMap/fabric/index.js', import.meta.url,
    ), 'utf8');
    expect(projectionSource.match(/projectResolvedFirstSliceFixedSurvey/g)).toHaveLength(2);
    expect(leafSource.match(/projectResolvedFirstSliceFixedSurvey/g)).toHaveLength(2);
    for (const forbidden of [
      'visibleMasses', 'sourceAuthority', 'shadowPolygon', 'planSurfaces',
      'semanticPrimitives', 'drawListToSvg', 'EXPORT_PALETTE',
    ]) expectAbsentWithAnchor(leafSource, forbidden, 'compileOrthogonalCrossFirstSliceMassingRosterBundle', 'direct leaf scope');
    expectAbsentWithAnchor(barrelSource, 'projectResolvedFirstSliceFixedSurvey',
      'projectOrthogonalCrossFirstSliceMassingFixedSurvey', 'non-barrel core');
  });

  it('A4 keeps equivalent built-in and custom geometry equal through the entire PUBLIC path', () => {
    const builtIn = makeSettlementMassingRosterBundleInputs();
    const custom = withCustomInstitution(makeSettlementMassingRosterBundleInputs());
    const builtBundle = compileBundle(builtIn);
    const customBundle = compileBundle(custom);
    const builtMass = massForKind(builtBundle, 'INSTITUTION');
    const customMass = massForKind(customBundle, 'INSTITUTION');
    expect(customMass.geometry).toEqual(builtMass.geometry);
    expect(customMass.contentHash === builtMass.contentHash).toBe(false);
    expect(customBundle.massingRoster.contentHash === builtBundle.massingRoster.contentHash).toBe(false);
    const builtPublic = projectBundle(builtIn, builtBundle, 'PUBLIC');
    const customPublic = projectBundle(custom, customBundle, 'PUBLIC');
    expect(customPublic.semanticPrimitives).toEqual(builtPublic.semanticPrimitives);
    expect(customPublic.drawOps).toEqual(builtPublic.drawOps);
    expect(firstSliceProjectionToSvg(customPublic)).toBe(firstSliceProjectionToSvg(builtPublic));
    expect(stableSceneStringify(customPublic)).toBe(stableSceneStringify(builtPublic));
    expect(stableSceneStringify(projectBundle(custom, customBundle, 'DM').sourceAuthority)
      === stableSceneStringify(projectBundle(builtIn, builtBundle, 'DM').sourceAuthority)).toBe(false);
  });

  it('A5 removes every hidden identity before PUBLIC draw construction while DM retains it', () => {
    const first = withHiddenInstitution('building:dm-astronomers-college:01');
    const second = withHiddenInstitution('building:dm-astronomers-college:02');
    const firstBundle = compileBundle(first);
    const secondBundle = compileBundle(second);
    const publicFirst = projectBundle(first, firstBundle, 'PUBLIC');
    const publicSecond = projectBundle(second, secondBundle, 'PUBLIC');
    const dmFirst = projectBundle(first, firstBundle, 'DM');
    const hiddenMass = massForKind(firstBundle, 'INSTITUTION');
    const visibleMass = massForKind(firstBundle, 'BUILDING');
    const publicBytes = stableSceneStringify(publicFirst);
    const dmBytes = stableSceneStringify(dmFirst);
    expect(publicFirst.sourceAuthority.visibleGeometryRefs)
      .toEqual([canonicalArtifactRef(visibleMass.geometry)]);
    expectPresentThenAbsent(dmBytes, publicBytes, hiddenMass.geometry.buildingId, 'PUBLIC hidden body');
    expectPresentThenAbsent(dmBytes, publicBytes, firstBundle.massingRoster.artifactId, 'PUBLIC roster identity');
    expectAbsentWithAnchor(publicBytes, hiddenMass.artifactId,
      'PUBLIC_MASSING_DERIVATION', 'PUBLIC hidden mass identity');
    expectAbsentWithAnchor(publicBytes, 'package:settlementforge-core',
      'PUBLIC_MASSING_DERIVATION', 'PUBLIC package identity');
    expect(stableSceneStringify(publicSecond)).toBe(publicBytes);
    expect(firstSliceProjectionToSvg(publicSecond)).toBe(firstSliceProjectionToSvg(publicFirst));
    expect(dmFirst.sourceAuthority).toEqual({
      kind: 'DM_MASSING_ROSTER', lawVersion: FIRST_SLICE_MASSING_PROJECTION_LAW_VERSION,
      massingRosterRef: canonicalArtifactRef(firstBundle.massingRoster),
    });
  });

  it('A6 is replay-stable and bounded while legacy hashes stay exact and false authority refuses', () => {
    const fixture = makeSettlementMassingRosterBundleInputs();
    const bundle = compileBundle(fixture);
    const first = projectBundle(fixture, bundle, 'PUBLIC');
    expect(stableSceneStringify(projectBundle(fixture, bundle, 'PUBLIC')))
      .toBe(stableSceneStringify(first));
    const reversed = { ...fixture, bodyInputs: [...fixture.bodyInputs].reverse() };
    reversed.input = { ...fixture.input, bodyInputs: reversed.bodyInputs };
    expect(stableSceneStringify(projectBundle(reversed, compileBundle(reversed), 'PUBLIC')))
      .toBe(stableSceneStringify(first));
    const replayFixture = { ...fixture, input: clone(fixture.input) };
    const replayBundle = clone(bundle);
    expect(stableSceneStringify(projectBundle(replayFixture, replayBundle, 'PUBLIC')))
      .toBe(stableSceneStringify(first));
    const maximum = { ...fixture, input: { ...fixture.input, artifactId: 'r'.repeat(96) } };
    const maximumProjection = projectBundle(maximum, compileBundle(maximum), 'PUBLIC');
    expect(maximumProjection.artifactId.length).toBeLessThanOrEqual(96);
    expect(stableSceneStringify(projectBundle(maximum, compileBundle(maximum), 'PUBLIC')))
      .toBe(stableSceneStringify(maximumProjection));

    const { document } = makeFirstSliceDocument();
    const resolutionReport = resolveFirstSliceContent(document, []);
    const legacyPublic = projectFirstSliceFixedSurvey({ document, resolutionReport, audience: 'PUBLIC' });
    expect(legacyPublic.contentHash)
      .toBe('scene-v1-9820c3f2273a313f22ff9246c65e1891');
    expect(projectFirstSliceFixedSurvey({ document, resolutionReport, audience: 'DM' }).contentHash)
      .toBe('scene-v1-1945e8a01df6c24788c3393c4e3c452d');
    const mutableDocument = clone(document);
    const forgedFootprint = mutableDocument.masses[0].geometry.footprint
      .map(([x, z]) => [x + 1, z]);
    const accessorReport = clone(resolutionReport);
    let reportReads = 0;
    Object.defineProperty(accessorReport, 'unresolved', { enumerable: true, get() {
      reportReads += 1;
      mutableDocument.masses[0].geometry.footprint = forgedFootprint;
      return resolutionReport.unresolved;
    } });
    const accessorLegacy = projectFirstSliceFixedSurvey({
      document: mutableDocument, resolutionReport: accessorReport, audience: 'PUBLIC',
    });
    expect(reportReads).toBe(1);
    expect(mutableDocument.masses[0].geometry.footprint).toEqual(forgedFootprint);
    expect(stableSceneStringify(accessorLegacy)).toBe(stableSceneStringify(legacyPublic));
    const forged = [
      ['document hash', { document: { ...document, contentHash: 'scene-v1-forged-document' }, resolutionReport }],
      ['report hash', { document, resolutionReport: {
        ...resolutionReport, contentHash: 'scene-v1-forged-report',
      } }],
      ['report source ref', { document, resolutionReport: reseal(resolutionReport, (body) => {
        body.sourceDocumentRef = { artifactId: 'map:other', contentHash: document.contentHash };
      }) }],
    ];
    expect(forged).toHaveLength(3);
    for (const [label, witnesses] of forged) {
      expect(() => projectFirstSliceFixedSurvey({ ...witnesses, audience: 'PUBLIC' }), label)
        .toThrow(TypeError);
    }
    const bytes = stableSceneStringify(first);
    for (const forbidden of [
      'FIRST_SLICE_MAP_DOCUMENT', 'CONTENT_RESOLUTION_REPORT', 'MASSING_PHASE',
      'PUBLIC_PROJECTION_INPUT', 'choiceReceipt', 'persistence',
    ]) expectAbsentWithAnchor(bytes, forbidden, 'FIRST_SLICE_PROJECTION', 'massing projection boundary');
  });
});
