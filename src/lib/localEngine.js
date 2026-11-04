/**
 * localEngine.js — THE ONE SEAM through which the client reaches its LOCAL engine.
 *
 * docs/DESIGN_ENGINE_SERVICE.md "The client switch" step (5), THE PROTECTION STEP:
 * when the build carries VITE_ENGINE_REMOTE='true', the client must not contain the
 * generator. Every main-thread path to the local engine therefore runs through the
 * four loaders below, and `vite.config.js :: engineAbsentWhenRemote` resolves THIS
 * module to its twin `localEngine.absent.js` in a flagged build, so the flagged
 * `dist/` has no import edge to `generateSettlementPipeline`, to the generation core,
 * to the pipeline's step registry, or to the generation worker (whose only
 * `new Worker(new URL(...))` lives here — Vite emits a worker bundle for that pattern
 * at transform time, so the only way to leave it out is to leave this module out).
 * `tests/build/engineAbsentWhenRemote.test.js` proves the absence on a flagged build.
 *
 * With the flag off this module is a pure pass-through: each loader is the same
 * `import()` its caller used to spell, so the module namespace a caller receives is the
 * one it received before (`tests/lib/localEngine.test.js` pins the identity and hashes
 * sixty settlements through the seam). Every edge is dynamic except the worker's URL,
 * so importing the seam fetches no engine chunk.
 *
 * The world pulse is NOT behind this seam (the chair's ruling: the pulse stays in the
 * browser for this program); the seam covers generation and its re-derivations only.
 */

/** True in the real seam, false in the flagged build's twin. */
export const LOCAL_ENGINE_PRESENT = true;

/**
 * The generation core (`runGenerationRequest`), the in-thread half of the one code path.
 * @returns {Promise<typeof import('../workers/generationRequest.js')>}
 */
export function loadGenerationCore() {
  return import('../workers/generationRequest.js');
}

/**
 * The pipeline entry module (`generateSettlementPipeline` and the regeneration passes).
 * @returns {Promise<typeof import('../generators/generateSettlementPipeline.js')>}
 */
export function loadLocalPipeline() {
  return import('../generators/generateSettlementPipeline.js');
}

/**
 * The pipeline's step registry and runner (the re-derivation reads it).
 * @returns {Promise<typeof import('../generators/pipeline.js')>}
 */
export function loadPipelineRegistry() {
  return import('../generators/pipeline.js');
}

/**
 * The generation worker: one per request, constructed synchronously by the
 * generation client (`generationClient.js :: runGeneration`).
 * @returns {Worker}
 */
export function createGenerationWorker() {
  return new Worker(new URL('../workers/generation.worker.js', import.meta.url), { type: 'module' });
}
