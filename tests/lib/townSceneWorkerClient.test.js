import { describe, expect, it, vi } from 'vitest';
import {
  createTownSceneWorkerClient,
} from '../../src/lib/townScene/townSceneWorkerClient.js';
import {
  createTownSceneCache,
  townSceneCacheKey,
} from '../../src/lib/townScene/sceneCache.js';
import {
  TOWN_SCENE_VIEW_ID,
  detectTownSceneCapability,
  resolveTownSceneViewPolicy,
} from '../../src/lib/townScene/viewPolicy.js';
import {
  disposeTownSceneRenderer,
  refreshTownSceneInstanceBounds,
  townSceneAoShade,
  townSceneDefaultCameraPreset,
  townSceneInstanceColorFor,
  townSceneLodForProjectedPixels,
  townSceneMaterialIdForRole,
  townSceneSeasonalMaterialColor,
} from '../../src/components/townMap/scene3d/threeSceneRuntime.js';
import {
  addTownSceneLivingMarkers,
  townSceneConditionTint,
  townSceneTerrainHeightAt,
} from '../../src/components/townMap/scene3d/townSceneLivingPresentation.js';
import {
  createTownSceneMaterial,
} from '../../src/components/townMap/scene3d/townSceneRuntimeMaterials.js';

class FakeWorker {
  constructor() {
    this.messages = [];
    this.terminated = false;
  }

  postMessage(packet) {
    this.messages.push(packet);
  }

  terminate() {
    this.terminated = true;
  }

  emit(packet) {
    this.onmessage?.({ data: packet });
  }
}

describe('town-scene geometry worker client', () => {
  it('delivers progressive massing and resolves only the matching generation', async () => {
    const worker = new FakeWorker();
    const onManifest = vi.fn();
    const onProgress = vi.fn();
    const client = createTownSceneWorkerClient({ workerFactory: () => worker });
    const compileInput = { kind: 'TownSceneCompileInput', inputDigest: 'input:one' };
    const request = client.compile(
      compileInput,
      { lodBias: 0, massingOnly: false },
      { onManifest, onProgress },
    );
    expect(worker.messages[0]).toMatchObject({
      type: 'compile',
      generationId: 1,
      compileInput,
    });

    const manifest = { kind: 'TownSceneManifest' };
    worker.emit({
      type: 'manifest',
      generationId: 1,
      manifest,
      manifestDigest: 'manifest:one',
    });
    expect(onManifest).toHaveBeenCalledWith({
      manifest,
      manifestDigest: 'manifest:one',
    });

    const graybox = {
      kind: 'TownSceneGeometryBundle',
      manifestDigest: 'manifest:one',
      options: { massingOnly: true },
    };
    worker.emit({ type: 'progress', generationId: 1, stage: 'massing', geometry: graybox });
    expect(onProgress).toHaveBeenCalledWith({ stage: 'massing', geometry: graybox });

    const complete = {
      kind: 'TownSceneGeometryBundle',
      manifestDigest: 'manifest:one',
      options: { massingOnly: false },
    };
    worker.emit({ type: 'result', generationId: 1, geometry: complete });
    await expect(request).resolves.toEqual({
      manifest,
      manifestDigest: 'manifest:one',
      geometry: complete,
      transport: 'worker',
    });
    client.dispose();
  });

  it('rejects a superseded generation and ignores its late result', async () => {
    const workers = [];
    const client = createTownSceneWorkerClient({
      workerFactory: () => {
        const worker = new FakeWorker();
        workers.push(worker);
        return worker;
      },
    });
    const first = client.compile({ inputDigest: 'a' });
    const second = client.compile({ inputDigest: 'b' });
    await expect(first).rejects.toMatchObject({ name: 'AbortError' });
    expect(workers[0].terminated).toBe(true);
    expect(workers[1].messages[0]).toMatchObject({ type: 'compile', generationId: 2 });

    workers[0].emit({ type: 'result', generationId: 1, geometry: { stale: true } });
    const freshManifest = { kind: 'TownSceneManifest', source: { structureDigest: 'b' } };
    workers[1].emit({
      type: 'manifest',
      generationId: 2,
      manifest: freshManifest,
      manifestDigest: 'manifest:b',
    });
    const fresh = { stale: false, manifestDigest: 'manifest:b' };
    workers[1].emit({ type: 'result', generationId: 2, geometry: fresh });
    await expect(second).resolves.toEqual({
      manifest: freshManifest,
      manifestDigest: 'manifest:b',
      geometry: fresh,
      transport: 'worker',
    });
    client.dispose();
  });

  it('fails to the product fallback without compiling geometry on the UI thread', async () => {
    const client = createTownSceneWorkerClient({
      workerFactory: () => null,
    });
    await expect(client.compile(
      { inputDigest: 'workerless' },
    )).rejects.toMatchObject({
      code: 'TOWN_SCENE_WORKER_UNAVAILABLE',
      reason: 'worker-unavailable',
    });
    client.dispose();
  });

  it('terminates active computation when an AbortSignal cancels the request', async () => {
    const worker = new FakeWorker();
    const controller = new AbortController();
    const client = createTownSceneWorkerClient({ workerFactory: () => worker });
    const request = client.compile(
      { inputDigest: 'abort-active-work' },
      {},
      { signal: controller.signal },
    );
    controller.abort();
    await expect(request).rejects.toMatchObject({ name: 'AbortError' });
    expect(worker.terminated).toBe(true);
    client.dispose();
  });

  it('fails closed when geometry arrives without its manifest packet', async () => {
    const worker = new FakeWorker();
    const client = createTownSceneWorkerClient({ workerFactory: () => worker });
    const request = client.compile({ inputDigest: 'protocol-wall' });
    worker.emit({
      type: 'result',
      generationId: 1,
      geometry: { manifestDigest: 'unknown' },
    });
    await expect(request).rejects.toMatchObject({
      code: 'TOWN_SCENE_WORKER_PROTOCOL_INVALID',
      reason: 'result-before-manifest',
    });
    expect(worker.terminated).toBe(true);
    client.dispose();
  });

  it('rejects progressive geometry from a different manifest', async () => {
    const worker = new FakeWorker();
    const onProgress = vi.fn();
    const client = createTownSceneWorkerClient({ workerFactory: () => worker });
    const request = client.compile(
      { inputDigest: 'progress-digest-wall' },
      {},
      { onProgress },
    );
    worker.emit({
      type: 'manifest',
      generationId: 1,
      manifest: { kind: 'TownSceneManifest' },
      manifestDigest: 'manifest:current',
    });
    worker.emit({
      type: 'progress',
      generationId: 1,
      stage: 'massing',
      geometry: { manifestDigest: 'manifest:stale' },
    });

    await expect(request).rejects.toMatchObject({
      code: 'TOWN_SCENE_WORKER_PROTOCOL_INVALID',
      reason: 'geometry-manifest-digest-mismatch',
    });
    expect(onProgress).not.toHaveBeenCalled();
    expect(worker.terminated).toBe(true);
    client.dispose();
  });
});

describe('town-scene cache and view policy', () => {
  it('rejects DOM-only environments before touching an unimplemented canvas', () => {
    const createElement = vi.fn();
    expect(detectTownSceneCapability({
      documentRef: { createElement },
      webgl2Constructor: null,
    })).toEqual({ available: false, reason: 'webgl2-unavailable' });
    expect(createElement).not.toHaveBeenCalled();
  });

  it('probes and releases a real WebGL2-capable canvas', () => {
    const loseContext = vi.fn();
    const getContext = vi.fn(() => ({
      getExtension: () => ({ loseContext }),
    }));
    expect(detectTownSceneCapability({
      documentRef: { createElement: () => ({ getContext }) },
      webgl2Constructor: function WebGL2RenderingContext() {},
    })).toEqual({ available: true, reason: null });
    expect(getContext).toHaveBeenCalledWith('webgl2', {
      antialias: false,
      failIfMajorPerformanceCaveat: true,
    });
    expect(loseContext).toHaveBeenCalledOnce();
  });

  it('never shares a geometry key between DM and player audiences', () => {
    const base = {
      schemaVersion: 1,
      compiler: { compilerVersion: 2 },
      source: { structureDigest: 'same', dressDigest: 'same' },
    };
    const dmKey = townSceneCacheKey({ ...base, source: { ...base.source, audience: 'dm' } });
    const playerKey = townSceneCacheKey({ ...base, source: { ...base.source, audience: 'player' } });
    expect(dmKey).not.toBe(playerKey);
  });

  it('never shares a geometry key between distinct exact manifests', () => {
    const manifest = {
      schemaVersion: 1,
      compiler: { compilerVersion: 2 },
      source: { audience: 'dm', structureDigest: 'shared' },
    };
    expect(townSceneCacheKey(manifest, { manifestDigest: 'digest:settlement-a' }))
      .not.toBe(townSceneCacheKey(manifest, { manifestDigest: 'digest:settlement-b' }));
  });

  it('evicts least-recently-used geometry within its byte budget', () => {
    const cache = createTownSceneCache({ maxEntries: 2, maxBytes: 1024 * 1024 });
    cache.set('a', { positions: new Float32Array(8) });
    cache.set('b', { positions: new Float32Array(8) });
    cache.get('a');
    cache.set('c', { positions: new Float32Array(8) });
    expect(cache.has('a')).toBe(true);
    expect(cache.has('b')).toBe(false);
    expect(cache.has('c')).toBe(true);
  });

  it('promotes Portrait only when capability and promotion are both green', () => {
    expect(resolveTownSceneViewPolicy({
      enabled: true,
      promoted: true,
      capability: { available: true },
    }).view).toBe(TOWN_SCENE_VIEW_ID);
    expect(resolveTownSceneViewPolicy({
      enabled: true,
      promoted: true,
      capability: { available: false, reason: 'webgl2-unavailable' },
    })).toMatchObject({ view: 'plan', eligible: false, reason: 'webgl2-unavailable' });
  });

});

describe('projected-size architectural LOD', () => {
  it('selects overview explicitly from canonical id-sorted camera presets', () => {
    expect(townSceneDefaultCameraPreset([
      { id: 'district' },
      { id: 'landmark' },
      { id: 'overview' },
      { id: 'plan' },
    ])).toEqual({ id: 'overview' });
    expect(townSceneDefaultCameraPreset([{ id: 'custom' }]))
      .toEqual({ id: 'custom' });
  });

  it('selects massing, silhouette, and detail as screen coverage grows', () => {
    expect(townSceneLodForProjectedPixels(12)).toBe(0);
    expect(townSceneLodForProjectedPixels(40)).toBe(1);
    expect(townSceneLodForProjectedPixels(120)).toBe(2);
  });

  it('applies adaptive bias toward coarser geometry and honors massing-only', () => {
    expect(townSceneLodForProjectedPixels(120, { lodBias: 1 })).toBe(1);
    expect(townSceneLodForProjectedPixels(120, { lodBias: 2 })).toBe(0);
    expect(townSceneLodForProjectedPixels(120, { massingOnly: true })).toBe(0);
  });

  it('chooses the nearest safe tier actually present in the bundle', () => {
    expect(townSceneLodForProjectedPixels(120, { availableLods: [0, 1] })).toBe(1);
    expect(townSceneLodForProjectedPixels(40, { availableLods: [0, 2] })).toBe(0);
  });
});

describe('illustrated material actuation', () => {
  it('clamps compiler AO into a visible neutral modulation range', () => {
    expect(townSceneAoShade(1)).toBe(1);
    expect(townSceneAoShade(0.72)).toBe(0.72);
    expect(townSceneAoShade(0)).toBe(0.28);
    expect(townSceneAoShade(Number.NaN)).toBe(1);
  });

  it('relinquishes the owned WebGL context on permanent runtime disposal', () => {
    const renderer = {
      renderLists: { dispose: vi.fn() },
      dispose: vi.fn(),
      forceContextLoss: vi.fn(),
    };
    disposeTownSceneRenderer(renderer);
    expect(renderer.renderLists.dispose).toHaveBeenCalledOnce();
    expect(renderer.dispose).toHaveBeenCalledOnce();
    expect(renderer.forceContextLoss).toHaveBeenCalledOnce();
  });

  it('can preserve a canvas context across a React effect replay', () => {
    const renderer = {
      renderLists: { dispose: vi.fn() },
      dispose: vi.fn(),
      forceContextLoss: vi.fn(),
    };
    disposeTownSceneRenderer(renderer, { releaseContext: false });
    expect(renderer.renderLists.dispose).toHaveBeenCalledOnce();
    expect(renderer.dispose).toHaveBeenCalledOnce();
    expect(renderer.forceContextLoss).not.toHaveBeenCalled();
  });

  it('refreshes aggregate instance bounds after camera and LOD repacking', () => {
    const mesh = {
      instanceMatrix: { needsUpdate: false },
      computeBoundingBox: vi.fn(),
      computeBoundingSphere: vi.fn(),
    };
    refreshTownSceneInstanceBounds(mesh);
    expect(mesh.instanceMatrix.needsUpdate).toBe(true);
    expect(mesh.computeBoundingBox).toHaveBeenCalledOnce();
    expect(mesh.computeBoundingSphere).toHaveBeenCalledOnce();
  });

  it('resolves structure/roof/detail through the selected skin hierarchy', () => {
    const skin = {
      roleAssignments: [
        { role: 'structure', materialId: 'brick' },
        { role: 'roof', materialId: 'roofLead' },
      ],
    };
    expect(townSceneMaterialIdForRole(skin, 'structure', null, 'skin:brickGuild')).toBe('brick');
    expect(townSceneMaterialIdForRole(skin, 'roof', 'copperRoof', 'skin:brickGuild')).toBe('copperRoof');
    expect(townSceneMaterialIdForRole(skin, 'detail', null, 'skin:brickGuild')).toBe('skin:brickGuild');
    expect(townSceneMaterialIdForRole(
      { roleAssignments: [] },
      'roof',
      null,
      'material:vegetation:tree',
    )).toBe('material:vegetation:tree');
  });

  it('applies seasonal dress only to semantic ground and vegetation roles', () => {
    expect(townSceneSeasonalMaterialColor('vegetation', 'autumn'))
      .not.toBe(townSceneSeasonalMaterialColor('vegetation', 'spring'));
    expect(townSceneSeasonalMaterialColor('terrain', 'winter'))
      .not.toBe(townSceneSeasonalMaterialColor('terrain', 'summer'));
    expect(townSceneSeasonalMaterialColor('road', 'winter'))
      .toBe(townSceneSeasonalMaterialColor('road', 'summer'));
  });

  it('keeps exact roof and two-sided transport materials legible at runtime', () => {
    class MeshStandardMaterial {
      constructor(options) {
        Object.assign(this, options);
      }
    }
    const THREE = {
      MeshStandardMaterial,
      FrontSide: 'front',
      DoubleSide: 'double',
    };
    const roof = createTownSceneMaterial(
      THREE,
      'material:roof',
      'roof',
      { colorRole: 'wall', roughnessPermille: 860, metalnessPermille: 80 },
      { season: 'autumn' },
    );
    const road = createTownSceneMaterial(
      THREE,
      'material:road',
      'road',
      { colorRole: 'road' },
      { season: 'autumn' },
    );
    const water = createTownSceneMaterial(
      THREE,
      'material:water',
      'water',
      { colorRole: 'water' },
      { season: 'autumn' },
    );

    expect(roof.color).toBe(
      townSceneSeasonalMaterialColor('material:roof', 'autumn'),
    );
    expect(roof.color).not.toBe(
      townSceneSeasonalMaterialColor('wall', 'autumn'),
    );
    expect(road.side).toBe(THREE.DoubleSide);
    expect(road.polygonOffset).toBe(true);
    expect(water.side).toBe(THREE.DoubleSide);
    expect(water.opacity).toBe(0.88);
    expect(water.depthWrite).toBe(false);
  });

  it('keeps neutral instances white when a shared draw call uses condition tinting', () => {
    const tint = { id: 'condition-tint' };
    const neutral = { id: 'neutral-white' };
    expect(townSceneInstanceColorFor(tint, true, neutral)).toBe(tint);
    expect(townSceneInstanceColorFor(null, true, neutral)).toBe(neutral);
    expect(townSceneInstanceColorFor(null, false, neutral)).toBeNull();
  });

  it('samples authorized terrain and never reads covert condition state', () => {
    const terrainManifest = {
      space: { planExtent: 1000 },
      terrain: {
        gridSize: 2,
        heightUnitCm: 10,
        heights: [0, 1, 2, 3],
      },
    };
    expect(townSceneTerrainHeightAt(terrainManifest, 500, 500)).toBe(15);
    expect(townSceneConditionTint({
      prosperity: 0.5,
      warScar: 0.4,
      corruptionRevealed: 0.2,
      corruptionCovert: 0,
    })).toEqual(townSceneConditionTint({
      prosperity: 0.5,
      warScar: 0.4,
      corruptionRevealed: 0.2,
      corruptionCovert: 1,
    }));
  });

  it('batches living conditions into non-color semantic marker shapes', async () => {
    const THREE = await import('three');
    const scene = new THREE.Scene();
    const semanticPositions = new Map([
      ['district:market', new THREE.Vector3(100, 20, 200)],
      ['wall:0', new THREE.Vector3(300, 50, 400)],
    ]);
    const pickables = [];
    const materials = new Map();
    const ownedGeometries = new Set();
    const markerMeshes = addTownSceneLivingMarkers({
      THREE,
      scene,
      manifest: {
        space: { planExtent: 1000, planUnitCm: 30 },
        terrain: { gridSize: 2, heightUnitCm: 10, heights: [0, 0, 0, 0] },
        living: {
          conditions: [
            { id: 'condition:shortage', districtIds: ['market'], severityPermille: 600 },
            { id: 'hazard:flood', position: [4, 5], severityPermille: 800 },
            { id: 'condition:fire', archetype: 'fire', label: 'Fire', severityPermille: 800 },
            { id: 'condition:flood', archetype: 'flood', label: 'Flood', severityPermille: 700 },
            { id: 'condition:plague', archetype: 'plague', label: 'Plague', severityPermille: 600 },
            { id: 'condition:siege', archetype: 'siege', label: 'Siege', severityPermille: 900 },
          ],
          scars: [{ id: 'scar:siege', wallId: 'wall:0', severityPermille: 900 }],
          reconstruction: [{ id: 'reconstruction:market', districtIds: ['market'] }],
        },
      },
      bounds: { center: [0, 0, 0], diagonal: 1000 },
      semanticPositions,
      pickables,
      materials,
      ownedGeometries,
    });

    expect(markerMeshes.map((mesh) => mesh.name).sort()).toEqual([
      'living:condition',
      'living:fire',
      'living:flood',
      'living:hazard',
      'living:plague',
      'living:reconstruction',
      'living:scar',
      'living:siege',
    ]);
    expect(pickables).toHaveLength(8);
    expect(semanticPositions.has('hazard:flood')).toBe(true);
    expect(markerMeshes.every((mesh) => (
      mesh.userData.visibleInstances[0].record.semanticId
    ))).toBe(true);

    for (const geometry of ownedGeometries) geometry.dispose();
    for (const material of materials.values()) material.dispose();
  });
});
