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
// TE-STRIP-1 (owner ruling, ODQ §725): the three scene3d runtime modules this file
// also exercised — threeSceneRuntime.js, townSceneLivingPresentation.js and
// townSceneRuntimeMaterials.js — lived in src/components/townMap/ and left with the
// legacy settlement map, taking the 'projected-size architectural LOD' and
// 'illustrated material actuation' describes with them. What remains below is the
// RETAINED lib layer: src/lib/townScene/{townSceneWorkerClient,sceneCache,viewPolicy}.js.

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
