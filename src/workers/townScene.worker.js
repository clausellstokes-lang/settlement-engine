/**
 * Deterministic town-scene manifest and geometry worker.
 *
 * The main thread posts one bounded, already-authorized TownSceneCompileInput.
 * Raw world/campaign state never crosses this transport boundary. The worker
 * first returns the validated manifest, then an intentionally coarse complete
 * settlement, then final geometry. Every typed-array buffer is transferred
 * rather than cloned.
 */
import {
  compileTownSceneGeometry,
  townSceneGeometryTransferList,
} from '../domain/townScene/compileTownSceneGeometry.js';
import { sceneDigest } from '../domain/townScene/stableScene.js';

let newestGeneration = 0;
const cancelled = new Set();
let manifestCompilerPromise = null;

/**
 * Manifest compilation carries the canonical town-map vocabulary. Load that
 * graph only when the worker receives real work, while the smaller geometry
 * runtime is already parsed and ready. The promise is shared by every
 * generation in this worker.
 */
function loadManifestCompiler() {
  manifestCompilerPromise ||= import(
    '../domain/townScene/compileTownSceneManifest.js'
  );
  return manifestCompilerPromise;
}

let namingPoolsPromise = null;

/**
 * CR-TC3A-1. The naming pools are a separate chunk, fetched only when cartography is
 * lit, so the dark path never pays for them and the bounded manifest-compiler chunk
 * never contains them. Memoized exactly as the compiler promise above is.
 */
function loadNamingPools() {
  namingPoolsPromise ||= import('../data/namingData.js');
  return namingPoolsPromise;
}

const current = (generationId) => (
  generationId === newestGeneration && !cancelled.has(generationId)
);

self.onmessage = async (event) => {
  const packet = event.data || {};
  const generationId = Number(packet.generationId) || 0;
  if (packet.type === 'cancel') {
    cancelled.add(generationId);
    return;
  }
  if (packet.type !== 'compile') return;
  newestGeneration = Math.max(newestGeneration, generationId);
  const options = packet.options || {};
  try {
    const {
      compileTownSceneManifestFromAuthorizedInput,
    } = await loadManifestCompiler();
    const namingPools = packet.compileInput?.cartography?.enabled === true
      ? (await loadNamingPools()).NAMING_DATA : null;
    if (!current(generationId)) return;
    const manifest = compileTownSceneManifestFromAuthorizedInput(
      packet.compileInput,
      { namingPools },
    );
    if (!current(generationId)) return;
    const manifestDigest = sceneDigest(manifest);
    self.postMessage({
      type: 'manifest',
      generationId,
      manifest,
      manifestDigest,
    });

    if (!options.massingOnly) {
      const massing = await compileTownSceneGeometry(manifest, {
        ...options,
        lodBias: Math.max(2, options.lodBias || 0),
        massingOnly: true,
      });
      if (!current(generationId)) return;
      self.postMessage(
        { type: 'progress', generationId, stage: 'massing', geometry: massing },
        townSceneGeometryTransferList(massing),
      );
    }
    const geometry = await compileTownSceneGeometry(manifest, options);
    if (!current(generationId)) return;
    self.postMessage(
      { type: 'result', generationId, geometry },
      townSceneGeometryTransferList(geometry),
    );
  } catch (error) {
    if (!current(generationId)) return;
    self.postMessage({
      type: 'error',
      generationId,
      message: String(error?.message || error),
      stack: error?.stack,
    });
  } finally {
    cancelled.delete(generationId);
  }
};
