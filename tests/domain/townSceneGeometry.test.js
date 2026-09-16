/**
 * Transfer-ready TownSceneGeometryBundle contract.
 */

import { describe, expect, it } from 'vitest';

import {
  compileTownSceneGeometry,
  compileTownSceneManifest,
  townSceneGeometryTransferList,
} from '../../src/domain/townScene/index.js';
import { makeTownFixture } from '../fixtures/townMapFixtures.js';

function manifestFor(seed = 'scene-geometry') {
  return compileTownSceneManifest({
    settlement: makeTownFixture({
      tier: 'metropolis',
      terrain: 'riverside',
      water: true,
      walls: true,
      seed,
    }),
    mapEdits: { layoutLawVersion: 2 },
    audience: 'dm',
  });
}

function arrayBytes(view) {
  return Array.from(new Uint8Array(view.buffer, view.byteOffset, view.byteLength));
}

describe('TownSceneGeometryBundle — worker seam', () => {
  it('returns typed batches/templates, semantic ranges, instances, and exact transferables', () => {
    const manifest = manifestFor();
    const bundle = compileTownSceneGeometry(manifest);

    expect(bundle.kind).toBe('TownSceneGeometryBundle');
    expect(bundle.bundleVersion).toBe(1);
    expect(bundle.batches.map((batch) => batch.id)).toEqual([
      'batch:bridges',
      'batch:gates',
      'batch:quays',
      'batch:roads',
      'batch:terrain',
      'batch:walls',
      'batch:water',
    ]);
    expect(bundle.templates.length).toBeGreaterThan(0);
    expect(bundle.instances.length).toBe(manifest.buildings.length + manifest.vegetation.length);

    for (const mesh of [...bundle.batches, ...bundle.templates]) {
      expect(mesh.positions).toBeInstanceOf(Float32Array);
      expect(mesh.normals).toBeInstanceOf(Float32Array);
      expect(mesh.indices).toBeInstanceOf(Uint32Array);
      expect(mesh.ao).toBeInstanceOf(Float32Array);
      expect(mesh.creaseEdges).toBeInstanceOf(Uint32Array);
      expect(mesh.positions.length % 3).toBe(0);
      expect(mesh.normals.length).toBe(mesh.positions.length);
      expect(mesh.ao.length).toBe(mesh.positions.length / 3);
      expect(mesh.indices.length % 3).toBe(0);
      for (const range of mesh.semanticRanges) {
        expect(range.start % 3).toBe(0);
        expect(range.count % 3).toBe(0);
        expect(range.start).toBeGreaterThanOrEqual(0);
        expect(range.start + range.count).toBeLessThanOrEqual(mesh.indices.length);
      }
      for (const range of mesh.roleRanges) {
        expect(['structure', 'roof', 'detail']).toContain(range.role);
        expect(range.start % 3).toBe(0);
        expect(range.count % 3).toBe(0);
        expect(range.start + range.count).toBeLessThanOrEqual(mesh.indices.length);
      }
      for (const center of mesh.semanticCenters) {
        expect(center.semanticId).toEqual(expect.any(String));
        expect(center.position).toHaveLength(3);
        expect(center.position.every(Number.isFinite)).toBe(true);
      }
    }

    const transfers = townSceneGeometryTransferList(bundle);
    expect(transfers.length).toBeGreaterThan(0);
    expect(transfers.every((value) => value instanceof ArrayBuffer)).toBe(true);
    expect(new Set(transfers).size).toBe(transfers.length);
  });

  it('building instance semantic ids resolve exactly to manifest semantics', () => {
    const manifest = manifestFor('scene-picking');
    const bundle = compileTownSceneGeometry(manifest);
    const semanticIds = new Set(manifest.semantics.map((semantic) => semantic.sceneId));
    const buildingInstances = bundle.instances.filter((instance) => instance.kind === 'building');
    expect(buildingInstances).toHaveLength(manifest.buildings.length);
    for (const instance of buildingInstances) {
      expect(semanticIds.has(instance.semanticId)).toBe(true);
      expect(instance.templateId).toMatch(/^template:building:/);
      expect(Object.keys(instance.templateIdsByLod).sort()).toEqual(['0', '1', '2']);
      for (const templateId of Object.values(instance.templateIdsByLod)) {
        expect(bundle.templates.some((template) => template.id === templateId)).toBe(true);
      }
      expect(instance.scale.every((value) => value > 0)).toBe(true);
      expect(instance.yawStep).toBeGreaterThanOrEqual(0);
      expect(instance.yawStep).toBeLessThan(16);
    }
  });

  it('uses consolidated index-element semantic ranges for every structural batch', () => {
    const manifest = manifestFor('scene-ranges');
    const bundle = compileTownSceneGeometry(manifest);
    const expected = {
      'batch:roads': new Set(manifest.roads.map((road) => road.id)),
      'batch:walls': new Set(manifest.walls.map((wall) => wall.id)),
      'batch:water': new Set(manifest.terrain.waterBodies.map((water) => water.id)),
      'batch:gates': new Set(manifest.gates.map((gate) => gate.id)),
      'batch:bridges': new Set(manifest.bridges.map((bridge) => bridge.id)),
      'batch:quays': new Set(manifest.quays.map((quay) => quay.id)),
    };
    for (const batch of bundle.batches.filter((candidate) => expected[candidate.id])) {
      expect(new Set(batch.semanticRanges.map((range) => range.semanticId))).toEqual(expected[batch.id]);
    }
  });

  it('cuts wall openings and emits selectable gatehouse geometry in those openings', () => {
    const manifest = manifestFor('scene-gate-geometry');
    const bundle = compileTownSceneGeometry(manifest);
    const gateBatch = bundle.batches.find((batch) => batch.id === 'batch:gates');
    const wallBatch = bundle.batches.find((batch) => batch.id === 'batch:walls');
    expect(gateBatch.indices.length).toBeGreaterThan(0);
    expect(gateBatch.semanticRanges.map((range) => range.semanticId))
      .toEqual(manifest.gates.map((gate) => gate.id));

    const gate = manifest.gates[0];
    const wall = manifest.walls.find((candidate) => candidate.id === gate.wallId);
    const range = wallBatch.semanticRanges.find((candidate) => candidate.semanticId === wall.id);
    const [a, b] = wall.centerline;
    const dx = b[0] - a[0];
    const dz = b[1] - a[1];
    const length = Math.hypot(dx, dz);
    const gateAlong = Math.hypot(gate.position[0] - a[0], gate.position[1] - a[1]);
    const openingHalf = gate.openingWidthCm / manifest.space.planUnitCm / 2;
    for (let offset = range.start; offset < range.start + range.count; offset += 3) {
      const indices = [
        wallBatch.indices[offset],
        wallBatch.indices[offset + 1],
        wallBatch.indices[offset + 2],
      ];
      const centroid = indices.reduce((sum, index) => {
        const base = index * 3;
        return [
          sum[0] + wallBatch.positions[base] / manifest.space.planUnitCm,
          sum[1] + wallBatch.positions[base + 2] / manifest.space.planUnitCm,
        ];
      }, [0, 0]).map((value) => value / 3);
      const along = ((centroid[0] - a[0]) * dx + (centroid[1] - a[1]) * dz) / length;
      expect(Math.abs(along - gateAlong)).toBeGreaterThan(openingHalf * 0.4);
    }
  });

  it('renders river/coast, bridge, and quay vocabulary as real selectable geometry', () => {
    const manifest = compileTownSceneManifest({
      settlement: makeTownFixture({
        tier: 'city',
        terrain: 'coastal',
        water: true,
        walls: true,
        seed: 'scene-coast-vocabulary',
      }),
      mapEdits: { layoutLawVersion: 2 },
      audience: 'dm',
    });
    const bundle = compileTownSceneGeometry(manifest);
    for (const [batchId, rows] of [
      ['batch:water', manifest.terrain.waterBodies],
      ['batch:bridges', manifest.bridges],
      ['batch:quays', manifest.quays],
    ]) {
      const batch = bundle.batches.find((candidate) => candidate.id === batchId);
      expect(batch.indices.length).toBeGreaterThan(0);
      expect(new Set(batch.semanticRanges.map((range) => range.semanticId)))
        .toEqual(new Set(rows.map((row) => row.id)));
    }
    const coast = manifest.terrain.waterBodies[0];
    const waterBatch = bundle.batches.find((batch) => batch.id === 'batch:water');
    // A filled coast needs at least (polygon vertices - 2) triangles, rather
    // than the one ribbon quad the previous placeholder emitted.
    expect(waterBatch.indices.length).toBeGreaterThanOrEqual(
      (coast.surfacePolygon.length - 2) * 3,
    );
  });
});

describe('TownSceneGeometryBundle — determinism, LOD, and bounds', () => {
  it('is byte-identical for identical manifest/options and does not mutate the manifest', () => {
    const manifest = manifestFor('scene-geometry-determinism');
    const before = JSON.stringify(manifest);
    const first = compileTownSceneGeometry(manifest, { lodBias: 0, massingOnly: false });
    const second = compileTownSceneGeometry(manifest, { lodBias: 0, massingOnly: false });

    expect(first.instances).toEqual(second.instances);
    expect(first.bounds).toEqual(second.bounds);
    expect(first.templates.map((template) => template.id)).toEqual(second.templates.map((template) => template.id));
    for (let i = 0; i < first.batches.length; i++) {
      expect(arrayBytes(first.batches[i].positions)).toEqual(arrayBytes(second.batches[i].positions));
      expect(arrayBytes(first.batches[i].indices)).toEqual(arrayBytes(second.batches[i].indices));
    }
    for (let i = 0; i < first.templates.length; i++) {
      expect(arrayBytes(first.templates[i].positions)).toEqual(arrayBytes(second.templates[i].positions));
      expect(arrayBytes(first.templates[i].indices)).toEqual(arrayBytes(second.templates[i].indices));
    }
    expect(JSON.stringify(manifest)).toBe(before);
  });

  it('positive lodBias coarsens and massingOnly forces LOD0 without changing semantics', () => {
    const manifest = manifestFor('scene-lod');
    const full = compileTownSceneGeometry(manifest, { lodBias: 0 });
    const coarse = compileTownSceneGeometry(manifest, { lodBias: 1 });
    const massing = compileTownSceneGeometry(manifest, { lodBias: -1, massingOnly: true });
    const fullBuildings = full.instances.filter((instance) => instance.kind === 'building');
    const coarseBuildings = coarse.instances.filter((instance) => instance.kind === 'building');
    const massingBuildings = massing.instances.filter((instance) => instance.kind === 'building');

    expect(coarseBuildings.map((instance) => instance.lod))
      .toEqual(fullBuildings.map((instance) => Math.max(0, instance.lod - 1)));
    expect(massingBuildings.every((instance) => instance.lod === 0)).toBe(true);
    expect(massingBuildings.every((instance) => (
      Object.keys(instance.templateIdsByLod).join(',') === '0'
    ))).toBe(true);
    expect(massingBuildings.map((instance) => instance.semanticId))
      .toEqual(fullBuildings.map((instance) => instance.semanticId));
  });

  it('keeps readable roof massing at every LOD and excludes planar quad diagonals from ink', () => {
    const manifest = manifestFor('scene-crease-topology');
    const bundle = compileTownSceneGeometry(manifest, { massingOnly: false });
    const lodZeroLandmark = bundle.templates.find((template) => (
      template.id.startsWith('template:building:spire:')
      && template.lod === 0
    ));
    expect(lodZeroLandmark).toBeTruthy();
    expect(lodZeroLandmark.roleRanges.some((range) => range.role === 'roof')).toBe(true);

    const creasePairs = new Set();
    for (let offset = 0; offset < lodZeroLandmark.creaseEdges.length; offset += 2) {
      const a = lodZeroLandmark.creaseEdges[offset];
      const b = lodZeroLandmark.creaseEdges[offset + 1];
      creasePairs.add(a < b ? `${a}:${b}` : `${b}:${a}`);
    }
    let quadCount = 0;
    for (let offset = 0; offset <= lodZeroLandmark.indices.length - 6; offset += 3) {
      const a = lodZeroLandmark.indices[offset];
      const b = lodZeroLandmark.indices[offset + 1];
      const c = lodZeroLandmark.indices[offset + 2];
      const d = lodZeroLandmark.indices[offset + 3];
      const e = lodZeroLandmark.indices[offset + 4];
      if (a !== d || c !== e || b === c) continue;
      quadCount += 1;
      const diagonal = a < c ? `${a}:${c}` : `${c}:${a}`;
      expect(creasePairs.has(diagonal)).toBe(false);
      offset += 3;
    }
    expect(quadCount).toBeGreaterThan(0);

    const lodTwo = bundle.templates.find((template) => (
      template.kind === 'building'
      && template.lod === 2
      && template.roleRanges.some((range) => range.role === 'roof')
    ));
    expect(lodTwo).toBeTruthy();
    expect(lodTwo.roleRanges.some((range) => range.role === 'structure')).toBe(true);
    expect(lodTwo.roleRanges.some((range) => range.role === 'roof')).toBe(true);
  });

  it('adds deterministic high-LOD recognition geometry for canonical landmark families', () => {
    const settlement = makeTownFixture({
      tier: 'city',
      terrain: 'riverside',
      water: true,
      walls: true,
      seed: 'scene-landmark-recognition',
      institutions: [
        { name: 'Great Cathedral', priorityCategory: 'religion', catalogId: 'cat.church' },
        { name: 'Northwater Mill', priorityCategory: 'crafts', catalogId: 'cat.mill' },
        { name: 'The Lantern Alehouse', priorityCategory: 'criminal', catalogId: 'cat.inn' },
        { name: 'River Quay', priorityCategory: 'trade', catalogId: 'cat.quay' },
      ],
    });
    const manifest = compileTownSceneManifest({
      settlement,
      mapEdits: { layoutLawVersion: 2 },
      audience: 'dm',
    });
    const bundle = compileTownSceneGeometry(manifest);

    for (const shapeKind of [
      'spire',
      'wheelhouse',
      'signpost-house',
      'quay-shed',
    ]) {
      const building = manifest.buildings.find(
        (candidate) => candidate.shapeKind === shapeKind,
      );
      expect(building, `${shapeKind} is represented in the manifest`).toBeTruthy();
      const medium = bundle.templates.find(
        (template) => template.id === (
          `template:building:${shapeKind}:base:lod1`
        ),
      );
      const detailed = bundle.templates.find(
        (template) => template.id === (
          `template:building:${shapeKind}:${building.variantId}:lod2`
        ),
      );
      expect(medium).toBeTruthy();
      expect(detailed).toBeTruthy();
      expect(medium.roleRanges.some((range) => range.role === 'roof')).toBe(true);
      expect(detailed.indices.length).toBeGreaterThan(medium.indices.length);
      expect(detailed.roleRanges.some((range) => range.role === 'detail')).toBe(true);
    }
  });

  it('shares templates and returns finite bounds enclosing every instance', () => {
    const manifest = manifestFor('scene-instancing');
    const bundle = compileTownSceneGeometry(manifest);
    expect(bundle.templates.length).toBeLessThan(bundle.instances.length);
    expect(bundle.templates.length).toBeLessThanOrEqual(
      manifest.budgets.maximumUniqueMeshes,
    );
    const templateIds = new Set(bundle.templates.map((template) => template.id));
    for (const instance of bundle.instances) {
      expect(templateIds.has(instance.templateId)).toBe(true);
      const [x, y, z] = instance.position;
      const [sx, sy, sz] = instance.scale;
      expect(x).toBeGreaterThanOrEqual(bundle.bounds.min[0]);
      expect(y).toBeGreaterThanOrEqual(bundle.bounds.min[1]);
      expect(z).toBeGreaterThanOrEqual(bundle.bounds.min[2]);
      expect(x + sx).toBeLessThanOrEqual(bundle.bounds.max[0] + sx);
      expect(y + sy).toBeLessThanOrEqual(bundle.bounds.max[1]);
      expect(z + sz).toBeLessThanOrEqual(bundle.bounds.max[2] + sz);
    }
  });

  it('implements the bounded mirror variant as geometry, not a no-op template label', () => {
    const manifest = JSON.parse(JSON.stringify(manifestFor('scene-mirror-geometry')));
    const building = manifest.buildings.find((candidate) => (
      candidate.generatedFabric === true
      && ['house-a', 'house-b', 'house-c'].includes(candidate.shapeKind)
    ));
    expect(building).toBeTruthy();
    building.variantId = 'mirror';
    building.geometryKey = `building:${building.shapeKind}:mirror`;

    const bundle = compileTownSceneGeometry(manifest);
    const mirrored = bundle.templates.find((template) => (
      template.id === `template:building:${building.shapeKind}:mirror:lod2`
    ));
    expect(mirrored).toBeTruthy();

    const defaultManifest = JSON.parse(JSON.stringify(manifest));
    defaultManifest.buildings.find((candidate) => candidate.id === building.id).variantId = 'default';
    defaultManifest.buildings.find((candidate) => candidate.id === building.id).geometryKey =
      `building:${building.shapeKind}:default`;
    const defaultBundle = compileTownSceneGeometry(defaultManifest);
    const baseline = defaultBundle.templates.find((template) => (
      template.id === `template:building:${building.shapeKind}:default:lod2`
    ));
    expect(baseline).toBeTruthy();
    expect(arrayBytes(mirrored.positions)).not.toEqual(arrayBytes(baseline.positions));

    const xCoordinates = (template) => {
      const values = [];
      for (let offset = 0; offset < template.positions.length; offset += 3) {
        values.push(template.positions[offset]);
      }
      return values.sort((a, b) => a - b);
    };
    expect(xCoordinates(mirrored)).toEqual(
      xCoordinates(baseline).map((value) => -value).sort((a, b) => a - b),
    );
    const mirroredInstance = bundle.instances.find(
      (instance) => instance.semanticId === building.semanticId,
    );
    const defaultInstance = defaultBundle.instances.find(
      (instance) => instance.semanticId === building.semanticId,
    );
    expect(mirroredInstance.templateIdsByLod[0]).toBe(
      defaultInstance.templateIdsByLod[0],
    );
    expect(mirroredInstance.templateIdsByLod[0]).toMatch(/:base:lod0$/);
    expect(mirroredInstance.templateIdsByLod[1]).toBe(
      defaultInstance.templateIdsByLod[1],
    );
    expect(mirroredInstance.templateIdsByLod[1]).toMatch(/:base:lod1$/);
  });

  it('validates its input before allocating geometry', () => {
    const manifest = manifestFor('scene-invalid-input');
    expect(() => compileTownSceneGeometry({ ...manifest, buildings: [{ id: 'broken' }] }))
      .toThrow(/TownSceneManifest invalid/);
  });
});
