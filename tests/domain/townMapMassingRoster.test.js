import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import {
  COMPOSITE_SHAPE_LAW_VERSION,
  EXPLICIT_BUILDING_MASS_LAW_VERSION,
  FIRST_SLICE_MASSING_ROSTER_LAW_VERSION,
  FIRST_SLICE_MASSING_ROSTER_SCHEMA_VERSION,
  INSTITUTION_SPATIAL_RECIPE_SCHEMA_VERSION,
  SPATIAL_RECIPE_ROLES,
  compileOrthogonalCrossFirstSliceMassingRosterBundle,
  compileOriginNeutralBuildingGeometry,
  createCanonicalOrigin,
  createSpatialRecipeSnapshot,
} from '../../src/domain/townMap/fabric/index.js';
import { sealCanonicalArtifact } from '../../src/domain/townMap/fabric/foundation.js';
import { stableSceneStringify } from '../../src/domain/townScene/stableScene.js';
import {
  FIRST_SLICE_MASSING_ROSTER_ID,
  SETTLEMENT_CELLS,
  makeSettlementMassingRosterBundleInputs,
  makeSettlementMasses,
} from '../fixtures/townMapSettlementFabricFixtures.js';

const ROOT_HASH = 'scene-v1-48ad7a068361f2a59aa7cf5a53308faf';
const ROSTER_HASH = 'scene-v1-6b58a0b2b11bbfa7b1407f8e67c3c3f1';

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
  delete body.contentHash;
  mutate(body);
  return sealCanonicalArtifact(body);
}

/** @param {Record<string,unknown>} recipe @param {Record<string,unknown>} [overrides] */
function recreateRecipe(recipe, overrides = {}) {
  return createSpatialRecipeSnapshot({
    packageClass: recipe.packageClass,
    packageId: recipe.packageId,
    packageVersion: recipe.packageVersion,
    entryId: recipe.entryId,
    entryVersion: recipe.entryVersion,
    semanticTypeId: recipe.semantics.semanticTypeId,
    spatialRole: recipe.semantics.spatialRole,
    geometryLaw: recipe.semantics.geometryLaw,
    ...overrides,
  });
}

/** @param {ReturnType<typeof makeSettlementMassingRosterBundleInputs>} fixture @param {Record<string,unknown>} [overrides] */
function compileWith(fixture, overrides = {}) {
  return compileOrthogonalCrossFirstSliceMassingRosterBundle({ ...fixture.input, ...overrides });
}

/** @param {ReturnType<typeof compileOrthogonalCrossFirstSliceMassingRosterBundle>} bundle @param {string} kind */
function massForKind(bundle, kind) {
  const binding = bundle.massingRoster.bodyBindings.find((row) => row.bodyKind === kind);
  return bundle.buildingMasses.find((mass) => (
    mass.artifactId === binding.massRef.artifactId && mass.contentHash === binding.massRef.contentHash
  ));
}

describe('MF-T1M explicit varied first-slice massing roster bundle', () => {
  it('A1 returns the exact frozen BUILDING range and INSTITUTION composite on distinct parcels', () => {
    const bundle = compileWith(makeSettlementMassingRosterBundleInputs());
    const { massingRoster: roster } = bundle;
    expect(roster).toMatchObject({
      artifactKind: 'FIRST_SLICE_MASSING_ROSTER',
      artifactId: FIRST_SLICE_MASSING_ROSTER_ID,
      schemaVersion: FIRST_SLICE_MASSING_ROSTER_SCHEMA_VERSION,
      lawVersion: FIRST_SLICE_MASSING_ROSTER_LAW_VERSION,
      settlementId: 'settlement:cross:001',
      effectiveAt: 'year:1450',
      mapTraditionId: 'EUROPEAN_FANTASY_BASE',
      leafIndex: 0,
      contentHash: ROSTER_HASH,
    });
    expect(bundle.buildingMasses).toHaveLength(2);
    expect(roster.bodyBindings).toHaveLength(2);
    expect(roster.bodyBindings.map((row) => row.bodyId))
      .toEqual([...roster.bodyBindings.map((row) => row.bodyId)].sort());
    expect(new Set(roster.bodyBindings.map((row) => row.parcelRef.parcelId)).size).toBe(2);

    const building = massForKind(bundle, 'BUILDING');
    expect(building.geometry).toMatchObject({
      lawVersion: EXPLICIT_BUILDING_MASS_LAW_VERSION,
      roof: { kind: 'GABLE' },
    });
    const institution = massForKind(bundle, 'INSTITUTION');
    expect(institution.geometry.lawVersion).toBe(COMPOSITE_SHAPE_LAW_VERSION);
    expect(institution.geometry.shapeParts).toHaveLength(2);
    expect(institution.geometry.shapeParts[0]).toMatchObject({
      planShape: { kind: 'RECTILINEAR' }, roofForm: { kind: 'GABLE' },
    });
    expect(institution.geometry.shapeParts[1]).toMatchObject({
      planShape: { kind: 'CIRCULAR' },
      verticalSolid: { kind: 'CYLINDER' },
      roofForm: { kind: 'CONICAL' },
    });
    expect(institution.geometry.attachments).toHaveLength(1);
    expectDeepFrozen(bundle);
  });

  it('A2 closes Fabric, recipe, origin, parcel, and sibling-mass replay without roster copies', () => {
    const fixture = makeSettlementMassingRosterBundleInputs();
    const bundle = compileWith(fixture);
    const roster = bundle.massingRoster;
    expect(roster.firstSliceFabricRootRef).toEqual({
      artifactId: fixture.fabricRoot.artifactId, contentHash: fixture.fabricRoot.contentHash,
    });
    expect(roster.parcelRegistryRef).toEqual({
      artifactId: fixture.parcelRegistry.artifactId, contentHash: fixture.parcelRegistry.contentHash,
    });
    for (const binding of roster.bodyBindings) {
      const masses = bundle.buildingMasses.filter((mass) => (
        mass.artifactId === binding.massRef.artifactId
        && mass.contentHash === binding.massRef.contentHash
      ));
      const parcels = fixture.parcelRegistry.parcels.filter((parcel) => (
        parcel.parcelId === binding.parcelRef.parcelId
      ));
      expect(masses).toHaveLength(1);
      expect(parcels).toHaveLength(1);
      expect(binding.parcelRef).toEqual({
        artifactId: fixture.parcelRegistry.artifactId,
        contentHash: fixture.parcelRegistry.contentHash,
        parcelId: parcels[0].parcelId,
      });
      expect(masses[0].geometry.plotRef).toEqual(parcels[0].plotRef);
      expect(masses[0].geometry.buildingId).toBe(binding.bodyId);
      expect(masses[0].geometry.semanticTypeId).toBe(binding.semanticTypeId);
      expect(masses[0].recipeSnapshot.semantics.spatialRole).toBe(binding.bodyKind);
    }
    expect(Object.keys(roster).sort()).toEqual([
      'artifactId', 'artifactKind', 'bodyBindings', 'contentHash', 'effectiveAt',
      'firstSliceFabricRootRef', 'lawVersion', 'leafIndex', 'mapTraditionId',
      'parcelRegistryRef', 'schemaVersion', 'settlementId',
    ]);
    expect(Object.keys(roster.bodyBindings[0]).sort()).toEqual([
      'bodyId', 'bodyKind', 'massRef', 'parcelRef', 'semanticTypeId',
    ]);
  });

  it('A3 preserves v1 BUILDING bytes and keeps role, package, and origin out of form compilation', () => {
    const fixture = makeSettlementMassingRosterBundleInputs();
    const buildingInput = fixture.bodyInputs.find((row) => (
      row.recipeSnapshot.semantics.spatialRole === 'BUILDING'
    ));
    const institutionInput = fixture.bodyInputs.find((row) => (
      row.recipeSnapshot.semantics.spatialRole === 'INSTITUTION'
    ));
    const buildingFields = {
      packageClass: buildingInput.recipeSnapshot.packageClass,
      packageId: buildingInput.recipeSnapshot.packageId,
      packageVersion: buildingInput.recipeSnapshot.packageVersion,
      entryId: buildingInput.recipeSnapshot.entryId,
      entryVersion: buildingInput.recipeSnapshot.entryVersion,
      semanticTypeId: buildingInput.recipeSnapshot.semantics.semanticTypeId,
      geometryLaw: buildingInput.recipeSnapshot.semantics.geometryLaw,
    };
    const omitted = createSpatialRecipeSnapshot(buildingFields);
    const explicit = createSpatialRecipeSnapshot({ ...buildingFields, spatialRole: 'BUILDING' });
    expect(stableSceneStringify(explicit)).toBe(stableSceneStringify(omitted));
    expect(explicit.schemaVersion).toBe(1);
    expect(SPATIAL_RECIPE_ROLES).toEqual(['BUILDING', 'INSTITUTION']);
    expect(institutionInput.recipeSnapshot.schemaVersion)
      .toBe(INSTITUTION_SPATIAL_RECIPE_SCHEMA_VERSION);

    const customRecipe = recreateRecipe(institutionInput.recipeSnapshot, {
      packageClass: 'CUSTOM', packageId: 'package:owner-astronomy', packageVersion: '2.0.0',
    });
    const customOrigin = createCanonicalOrigin({
      kind: 'CUSTOM', sourceId: 'package:owner-astronomy', sourceVersion: '2.0.0',
      contentHash: 'custom-astronomy-source-v2',
    });
    const customInputs = fixture.bodyInputs.map((row) => (
      row === institutionInput ? { ...row, recipeSnapshot: customRecipe, origin: customOrigin } : row
    ));
    const builtIn = compileWith(fixture);
    const custom = compileWith(fixture, { bodyInputs: customInputs });
    expect(massForKind(custom, 'INSTITUTION').geometry)
      .toEqual(massForKind(builtIn, 'INSTITUTION').geometry);
    expect(massForKind(custom, 'INSTITUTION').contentHash)
      .not.toBe(massForKind(builtIn, 'INSTITUTION').contentHash);

    const buildingRoleRecipe = recreateRecipe(institutionInput.recipeSnapshot, {
      packageClass: 'BUILT_IN', spatialRole: 'BUILDING',
    });
    const geometryFor = (recipeSnapshot) => compileOriginNeutralBuildingGeometry({
      foundation: fixture.foundation,
      subdivision: fixture.frontageSubdivision,
      spec: clone(institutionInput.spec),
      recipeSnapshot,
    });
    expect(geometryFor(buildingRoleRecipe)).toEqual(geometryFor(institutionInput.recipeSnapshot));
  });

  it('A4 refuses the exact finite nine-row authority, count, identity, pairing, and key matrix', () => {
    const fixture = makeSettlementMassingRosterBundleInputs();
    const horizontal = makeSettlementMassingRosterBundleInputs({ frontageAxis: 'HORIZONTAL' });
    const [buildingInput, institutionInput] = fixture.bodyInputs;
    const v1Institution = reseal(institutionInput.recipeSnapshot, (body) => {
      body.schemaVersion = 1;
    });
    const v2Building = reseal(buildingInput.recipeSnapshot, (body) => {
      body.schemaVersion = INSTITUTION_SPATIAL_RECIPE_SCHEMA_VERSION;
    });
    const duplicateBody = clone(institutionInput);
    duplicateBody.spec.buildingId = buildingInput.spec.buildingId;
    duplicateBody.spec.attachment.buildingId = buildingInput.spec.buildingId;
    const duplicateParcelBuilding = clone(buildingInput);
    const institutionParcel = fixture.parcelRegistry.parcels.find((row) => (
      row.parcelId === institutionInput.spec.attachment.plotRef.plotId
    ));
    const institutionPlot = fixture.frontageSubdivision.plots.find((row) => (
      row.plotId === institutionParcel.parcelId
    ));
    duplicateParcelBuilding.spec.plotRef = institutionParcel.plotRef;
    duplicateParcelBuilding.spec.footprint = institutionPlot.fittedFootprint;
    const rectInstitution = {
      ...buildingInput,
      recipeSnapshot: recreateRecipe(buildingInput.recipeSnapshot, { spatialRole: 'INSTITUTION' }),
    };
    const compositeBuilding = {
      ...institutionInput,
      recipeSnapshot: recreateRecipe(institutionInput.recipeSnapshot, { spatialRole: 'BUILDING' }),
    };
    const cases = [
      ['wrong root hash', { ...fixture.input, firstSliceFabricRoot: {
        ...fixture.fabricRoot, contentHash: 'scene-v1-wrong-root-hash',
      } }],
      ['mixed Fabric chain', { ...fixture.input, firstSliceFabricRoot: horizontal.fabricRoot }],
      ['hash-correct v1 INSTITUTION', { ...fixture.input, bodyInputs: [
        buildingInput, { ...institutionInput, recipeSnapshot: v1Institution },
      ] }],
      ['hash-correct v2 BUILDING', { ...fixture.input, bodyInputs: [
        { ...buildingInput, recipeSnapshot: v2Building }, institutionInput,
      ] }],
      ['wrong body count', { ...fixture.input, bodyInputs: [buildingInput] }],
      ['duplicate body ID', { ...fixture.input, bodyInputs: [buildingInput, duplicateBody] }],
      ['duplicate parcel', { ...fixture.input, bodyInputs: [duplicateParcelBuilding, institutionInput] }],
      ['role/form swap', { ...fixture.input, bodyInputs: [rectInstitution, compositeBuilding] }],
      ['extra input key', { ...fixture.input, extra: true }],
    ];
    expect(cases).toHaveLength(9);
    for (const [label, input] of cases) {
      expect(() => compileOrthogonalCrossFirstSliceMassingRosterBundle(input), label)
        .toThrow(TypeError);
    }
  });

  it('A5 is deterministic under replay and ordering while leaving caller-owned inputs untouched', () => {
    const fixture = makeSettlementMassingRosterBundleInputs();
    const before = stableSceneStringify(fixture.input);
    expect(Object.isFrozen(fixture.input)).toBe(false);
    expect(Object.isFrozen(fixture.bodyInputs)).toBe(false);
    expect(fixture.bodyInputs.every((row) => !Object.isFrozen(row.spec))).toBe(true);
    const first = compileWith(fixture);
    const firstBytes = stableSceneStringify(first);
    expect(stableSceneStringify(compileWith(fixture))).toBe(firstBytes);
    expect(stableSceneStringify(compileWith(fixture, {
      bodyInputs: [...fixture.bodyInputs].reverse(),
    }))).toBe(firstBytes);
    const reversedCells = makeSettlementMassingRosterBundleInputs({
      cells: [...SETTLEMENT_CELLS].reverse(),
    });
    expect(stableSceneStringify(compileWith(reversedCells))).toBe(firstBytes);
    const replayInput = clone(fixture.input);
    expect(stableSceneStringify(
      compileOrthogonalCrossFirstSliceMassingRosterBundle(replayInput),
    )).toBe(firstBytes);
    expect(Object.isFrozen(replayInput)).toBe(false);
    const maximumId = 'r'.repeat(96);
    const maximum = compileWith(fixture, { artifactId: maximumId });
    expect(maximum.massingRoster.artifactId).toBe(maximumId);
    expect(stableSceneStringify(compileWith(fixture, { artifactId: maximumId })))
      .toBe(stableSceneStringify(maximum));
    expect(stableSceneStringify(fixture.input)).toBe(before);
    expect(Object.isFrozen(fixture.input)).toBe(false);
    expect(fixture.bodyInputs.every((row) => !Object.isFrozen(row.spec))).toBe(true);
  });

  it('A6 preserves predecessor pins and exposes no canonical-massing or sampling authority', () => {
    const fixture = makeSettlementMassingRosterBundleInputs();
    const bundle = compileWith(fixture);
    const legacy = makeSettlementMasses();
    expect(fixture.fabricRoot.contentHash).toBe(ROOT_HASH);
    expect(legacy.masses[0].recipeSnapshot.contentHash)
      .toBe('scene-v1-d8ab58086166f6f15cfbfa145a0adc87');
    expect(legacy.masses[0].contentHash).toBe('scene-v1-9744160987769480b5d18ca57b3297d2');
    expect(Object.keys(bundle).sort()).toEqual(['buildingMasses', 'massingRoster']);
    expect(Object.hasOwn(bundle, 'artifactId')).toBe(false);
    expect(Object.hasOwn(bundle, 'contentHash')).toBe(false);
    const bytes = stableSceneStringify(bundle.massingRoster);
    for (const forbidden of [
      'MASSING_PHASE', 'fabricRef', 'coordinateAbiVersion', 'coordinateAbiRef',
      'provenanceRef', 'institutionRef', 'geometry', 'spec', 'recipeSnapshot', 'origin',
      'dossier', 'seed', 'weights', 'candidates', 'choiceReceipt', 'projection', 'persistence',
    ]) expect(bytes).not.toContain(`"${forbidden}"`); // anchored: exact roster and binding keys are pinned in A2
    const source = readFileSync(new URL(
      '../../src/domain/townMap/fabric/massingRoster.js', import.meta.url,
    ), 'utf8');
    expect(source).toContain('compileOrthogonalCrossFirstSliceMassingRosterBundle');
    expect(source).not.toMatch(/keyedRandom|Math\.random|rngContext|BASE_DOSSIER|ROOT_SEED|CANONICAL_FACT_PROJECTION/); // anchored: compiler export proves source liveness
  });
});
