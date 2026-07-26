/**
 * Deterministic portable artifacts from the canonical TownScene contract.
 */

import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import {
  compileTownSceneGeometry,
  compileTownSceneManifest,
  encodeTownSceneGlb,
  encodeTownScenePortraitPng,
  flattenTownSceneGeometry,
  renderTownScenePortrait,
  sceneDigest,
  townSceneGlbJsonString,
} from '../../src/domain/townScene/index.js';
import {
  resolveTownSceneExportMaterial,
} from '../../src/domain/townScene/sceneExportPalette.js';
import { makeTownFixture } from '../fixtures/townMapFixtures.js';

function sceneFor(seed = 'town-scene-export') {
  const manifest = compileTownSceneManifest({
    settlement: makeTownFixture({
      tier: 'hamlet',
      terrain: 'riverside',
      water: true,
      walls: true,
      seed,
    }),
    mapEdits: { layoutLawVersion: 2 },
    audience: 'dm',
  });
  return {
    manifest,
    geometry: compileTownSceneGeometry(manifest),
  };
}

function glbJson(bytes) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const jsonLength = view.getUint32(12, true);
  return JSON.parse(
    new TextDecoder().decode(bytes.subarray(20, 20 + jsonLength)).trimEnd(),
  );
}

function pngDimensions(bytes) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return [view.getUint32(16, false), view.getUint32(20, false)];
}

function glbBinary(bytes) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const jsonLength = view.getUint32(12, true);
  const binaryHeader = 20 + jsonLength;
  const binaryLength = view.getUint32(binaryHeader, true);
  return bytes.subarray(binaryHeader + 8, binaryHeader + 8 + binaryLength);
}

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

describe('TownScene portable export mesh', () => {
  it('deterministically expands batches and selected LOD instances with identity intact', () => {
    const { manifest, geometry } = sceneFor();
    const first = flattenTownSceneGeometry(manifest, geometry, { lod: 2 });
    const second = flattenTownSceneGeometry(manifest, geometry, { lod: 2 });

    expect(first.positions).toEqual(second.positions);
    expect(first.normals).toEqual(second.normals);
    expect(first.indices).toEqual(second.indices);
    expect(first.creaseEdges).toEqual(second.creaseEdges);
    expect(first.triangleMaterialIds).toEqual(second.triangleMaterialIds);
    expect(first.triangleSemanticIds).toEqual(second.triangleSemanticIds);
    expect(first.vertexCount).toBeGreaterThan(0);
    expect(first.indices.length / 3).toBe(first.triangleMaterialIds.length);
    expect(first.tints).toHaveLength(first.vertexCount * 3);
    expect(first.triangleSemanticIds.some((id) => id.startsWith('building:'))).toBe(true);
    expect(new Set(first.triangleMaterialIds)).toContain('material:timber');
    expect(first.min.every(Number.isFinite)).toBe(true);
    expect(first.max.every(Number.isFinite)).toBe(true);
  });

  it('fails closed when geometry belongs to another manifest', () => {
    const first = sceneFor('town-scene-export-a');
    const second = sceneFor('town-scene-export-b');
    expect(() => flattenTownSceneGeometry(first.manifest, second.geometry))
      .toThrow(/does not match its manifest/);
  });
});

describe('TownScene GLB export', () => {
  it('is byte-identical, valid glTF 2.0, material separated, inked, and meter scaled', () => {
    const { manifest, geometry } = sceneFor('town-scene-glb');
    const first = encodeTownSceneGlb(manifest, geometry);
    const second = encodeTownSceneGlb(manifest, geometry);
    const header = new DataView(first.buffer, first.byteOffset, first.byteLength);
    const json = glbJson(first);

    expect(first).toEqual(second);
    expect(header.getUint32(0, true)).toBe(0x46546c67);
    expect(header.getUint32(4, true)).toBe(2);
    expect(header.getUint32(8, true)).toBe(first.length);
    expect(json.asset.version).toBe('2.0');
    expect(json.extensionsUsed).toContain('KHR_materials_unlit');
    expect(json.meshes[0].primitives.some((primitive) => primitive.mode === 1)).toBe(true);
    expect(json.meshes[0].primitives.filter((primitive) => primitive.mode === 4).length)
      .toBeGreaterThan(3);
    expect(json.materials.some((material) => material.name === 'material:water')).toBe(true);
    for (const materialId of [
      'material:ground',
      'material:road',
      'material:water',
      'material:roof',
    ]) {
      const portable = resolveTownSceneExportMaterial(manifest, materialId);
      const glbMaterial = json.materials.find(
        (material) => material.name === materialId,
      );
      expect(glbMaterial.pbrMetallicRoughness.baseColorFactor)
        .toEqual([...portable.color]);
      expect(glbMaterial.extras.presentationClass)
        .toBe(portable.presentationClass);
    }
    expect(json.nodes[0].extras.townScene.manifestDigest).toBe(geometry.manifestDigest);
    expect(json.nodes[0].extras.townScene.exportedUnit).toBe('meter');
    expect(json.nodes[0].extras.townScene.semantics.length).toBe(manifest.semantics.length);
    expect(json.nodes[0].extras.townScene.semantics.some(
      (semantic) => semantic.kind === 'building',
    )).toBe(true);
    const trianglePrimitives = json.meshes[0].primitives.filter(
      (primitive) => primitive.mode === 4,
    );
    expect(trianglePrimitives.every(
      (primitive) => typeof primitive.extras.townSceneSemanticId === 'string',
    )).toBe(true);
    expect(json.nodes[0].extras.townScene.semanticPrimitives).toHaveLength(
      trianglePrimitives.length,
    );
    expect(townSceneGlbJsonString(manifest, geometry)).toBe(
      new TextDecoder().decode(first.subarray(
        20,
        20 + header.getUint32(12, true),
      )).trimEnd(),
    );
    expect(sha256(first)).toBe(
      'da4f5945cb4afe412c73cc29b99bed6c92e66098c128b06b6a583beefeda1582',
    );
  });
});

describe('TownScene living-state export fidelity', () => {
  it('turns authorized building condition state into PNG pixels and GLB vertex colors', () => {
    const quiet = sceneFor('town-scene-living-tint');
    const dressedManifest = structuredClone(quiet.manifest);
    for (const building of dressedManifest.buildings) {
      building.conditionProfile = {
        ...building.conditionProfile,
        prosperity: 0,
        warScar: 1,
        abandonment: 1,
        neglect: 1,
      };
    }
    dressedManifest.source.dressDigest = sceneDigest({
      living: dressedManifest.living,
      conditionProfiles: dressedManifest.buildings.map(
        (building) => building.conditionProfile,
      ),
    });
    const dressedGeometry = compileTownSceneGeometry(dressedManifest);
    const quietMesh = flattenTownSceneGeometry(quiet.manifest, quiet.geometry);
    const dressedMesh = flattenTownSceneGeometry(
      dressedManifest,
      dressedGeometry,
    );

    // The structural mesh is unchanged; presentation colors are not.
    expect(dressedMesh.positions).toEqual(quietMesh.positions);
    expect(dressedMesh.indices).toEqual(quietMesh.indices);
    expect(dressedMesh.tints).not.toEqual(quietMesh.tints);

    const portraitOptions = { width: 320, height: 240 };
    expect(encodeTownScenePortraitPng(
      dressedManifest,
      dressedGeometry,
      portraitOptions,
    )).not.toEqual(encodeTownScenePortraitPng(
      quiet.manifest,
      quiet.geometry,
      portraitOptions,
    ));

    const quietGlb = encodeTownSceneGlb(quiet.manifest, quiet.geometry);
    const dressedGlb = encodeTownSceneGlb(dressedManifest, dressedGeometry);
    expect(glbBinary(dressedGlb)).not.toEqual(glbBinary(quietGlb));
  });

  it('exports distinct non-color markers with portable semantic provenance', () => {
    const base = makeTownFixture({
      tier: 'town',
      terrain: 'plains',
      walls: true,
      seed: 'town-scene-living-markers',
    });
    const manifest = compileTownSceneManifest({
      settlement: {
        ...base,
        activeConditions: [
          {
            id: 'occupation',
            archetype: 'occupation_resistance',
            label: 'The occupation holds the gates',
            severity: 0.8,
            severityBand: 'high',
          },
          {
            id: 'fire',
            archetype: 'fire',
            label: 'Fire burns through the storehouses',
            severity: 0.8,
          },
          {
            id: 'flood',
            archetype: 'flood',
            label: 'Flood waters cover the lower ward',
            severity: 0.7,
          },
          {
            id: 'plague',
            archetype: 'plague',
            label: 'Plague closes the city gates',
            severity: 0.6,
          },
          {
            id: 'siege',
            archetype: 'siege',
            label: 'The walls are under siege',
            severity: 0.9,
          },
        ],
        urbanFabric: {
          scars: [{ kind: 'occupation_marks', severity: 0.7, week: 8 }],
          rebirths: [{ classes: ['merchant'], type: 'rebuilding', week: 9 }],
        },
      },
      mapEdits: { layoutLawVersion: 2 },
      audience: 'dm',
    });
    const geometry = compileTownSceneGeometry(manifest);
    const quietManifest = compileTownSceneManifest({
      settlement: base,
      mapEdits: { layoutLawVersion: 2 },
      audience: 'dm',
    });
    const quietGeometry = compileTownSceneGeometry(quietManifest);
    const mesh = flattenTownSceneGeometry(manifest, geometry);
    const quietMesh = flattenTownSceneGeometry(quietManifest, quietGeometry);
    expect(mesh.vertexCount).toBeGreaterThan(quietMesh.vertexCount);
    expect(mesh.triangleLivingKinds).toEqual(expect.arrayContaining([
      'occupation',
      'fire',
      'flood',
      'plague',
      'siege',
      'scar',
      'construction',
    ]));
    expect(mesh.triangleMaterialIds).toEqual(expect.arrayContaining([
      'living:occupation',
      'living:fire',
      'living:flood',
      'living:plague',
      'living:siege',
      'living:scar',
      'living:construction',
    ]));

    const json = glbJson(encodeTownSceneGlb(manifest, geometry));
    const markerPrimitives = json.meshes[0].primitives.filter(
      (primitive) => primitive.extras?.townSceneLivingKind,
    );
    expect(markerPrimitives.map(
      (primitive) => primitive.extras.townSceneLivingKind,
    )).toEqual(expect.arrayContaining([
      'occupation',
      'fire',
      'flood',
      'plague',
      'siege',
      'scar',
      'construction',
    ]));
    for (const primitive of markerPrimitives) {
      const semantic = manifest.semantics.find(
        (row) => row.sceneId === primitive.extras.townSceneSemanticId,
      );
      expect(semantic).toBeTruthy();
      expect(primitive.extras.provenanceRefs).toEqual(semantic.provenanceRefs);
    }
    expect(encodeTownScenePortraitPng(
      manifest,
      geometry,
      { width: 320, height: 240 },
    )).not.toEqual(encodeTownScenePortraitPng(
      quietManifest,
      quietGeometry,
      { width: 320, height: 240 },
    ));
  });

  it('applies authorized season dress to deterministic portable materials', () => {
    const summer = sceneFor('town-scene-season-export');
    const winterManifest = structuredClone(summer.manifest);
    winterManifest.living.atmosphere.season = 'winter';
    winterManifest.source.dressDigest = sceneDigest(winterManifest.living);
    const winterGeometry = compileTownSceneGeometry(winterManifest);
    const options = { width: 128, height: 96 };

    expect(encodeTownScenePortraitPng(
      winterManifest,
      winterGeometry,
      options,
    )).not.toEqual(encodeTownScenePortraitPng(
      summer.manifest,
      summer.geometry,
      options,
    ));
    const summerJson = glbJson(encodeTownSceneGlb(
      summer.manifest,
      summer.geometry,
    ));
    const winterJson = glbJson(encodeTownSceneGlb(
      winterManifest,
      winterGeometry,
    ));
    expect(winterJson.materials.find(
      (material) => material.extras.colorRole === 'terrain',
    ).pbrMetallicRoughness.baseColorFactor).not.toEqual(
      summerJson.materials.find(
        (material) => material.extras.colorRole === 'terrain',
      ).pbrMetallicRoughness.baseColorFactor,
    );
  });
});

describe('TownScene deterministic portrait PNG', () => {
  it('keeps canonical roads, water, roofs, and vegetation visually separable', () => {
    const manifest = compileTownSceneManifest({
      settlement: makeTownFixture({
        tier: 'city',
        terrain: 'riverside',
        water: true,
        walls: true,
        seed: 'town-scene-portrait-legibility',
      }),
      mapEdits: { layoutLawVersion: 2 },
      audience: 'dm',
    });
    const geometry = compileTownSceneGeometry(manifest);
    const options = { width: 320, height: 240, supersample: 1 };
    const first = renderTownScenePortrait(manifest, geometry, options);
    const second = renderTownScenePortrait(manifest, geometry, options);

    expect(first.rgb).toEqual(second.rgb);
    expect(first.featureCoverage).toEqual(second.featureCoverage);
    expect(first.featureCoverage.water).toBeGreaterThan(100);
    expect(first.featureCoverage.road).toBeGreaterThan(100);
    expect(first.featureCoverage.building).toBeGreaterThan(100);
    expect(first.featureCoverage.vegetation).toBeGreaterThan(25);

    const ground = resolveTownSceneExportMaterial(
      manifest,
      'material:ground',
    ).color;
    for (const materialId of [
      'material:road',
      'material:water',
      'material:roof',
      'material:vegetation:tree',
    ]) {
      const color = resolveTownSceneExportMaterial(manifest, materialId).color;
      const distanceSquared = (
        (color[0] - ground[0]) * (color[0] - ground[0])
        + (color[1] - ground[1]) * (color[1] - ground[1])
        + (color[2] - ground[2]) * (color[2] - ground[2])
      );
      expect(distanceSquared, `${materialId} must separate from ground`)
        .toBeGreaterThan(0.025);
    }
  });

  it('renders repeatable whole-settlement pixels and a valid requested image size', () => {
    const { manifest, geometry } = sceneFor('town-scene-png');
    const options = { width: 160, height: 120, supersample: 1 };
    const first = encodeTownScenePortraitPng(manifest, geometry, options);
    const second = encodeTownScenePortraitPng(manifest, geometry, options);

    expect(first).toEqual(second);
    expect(Array.from(first.subarray(0, 8))).toEqual([
      137, 80, 78, 71, 13, 10, 26, 10,
    ]);
    expect(pngDimensions(first)).toEqual([160, 120]);
    expect(new Set(first).size).toBeGreaterThan(32);
    expect(sha256(first)).toBe(
      'e0707cfe388a2a99c973082d7a004d771bc2996a622d866a928263abc6de02aa',
    );
  });

  it('changes pixels when canonical settlement geometry changes', () => {
    const first = sceneFor('town-scene-png-a');
    const secondManifest = compileTownSceneManifest({
      settlement: makeTownFixture({
        tier: 'hamlet',
        terrain: 'desert',
        water: false,
        walls: false,
        seed: 'town-scene-png-b',
      }),
      mapEdits: { layoutLawVersion: 2 },
      audience: 'dm',
    });
    const second = {
      manifest: secondManifest,
      geometry: compileTownSceneGeometry(secondManifest),
    };
    const options = { width: 128, height: 96 };
    expect(encodeTownScenePortraitPng(first.manifest, first.geometry, options))
      .not.toEqual(encodeTownScenePortraitPng(second.manifest, second.geometry, options));
  });
});
