/**
 * localPipeline.js — the local engine seam's other door: the pipeline entry and its step
 * registry, for the main-thread callers that run the pipeline outside the generation lane
 * (the re-derivation, the surveyor's construction preview, the content-binding sample).
 *
 * `vite.config.js :: engineAbsentWhenRemote` resolves this module, like `localEngine.js`, to
 * `localEngine.absent.js` in a VITE_ENGINE_REMOTE build, so there those callers refuse with
 * the typed `engine_local_absent` and the flagged `dist/` carries neither module
 * (tests/build/engineAbsentWhenRemote.test.js). Callers reach THIS module by dynamic
 * `import()` only, which keeps it out of every chunk's static graph (localEngine.js says why
 * the two doors are two modules). Flag off, each loader is the `import()` its caller used to
 * spell, so a caller receives the very namespace it received before
 * (tests/lib/localEngineCallers.test.js).
 */

/**
 * The pipeline entry module (`generateSettlementPipeline` and the regeneration passes).
 * @returns {Promise<typeof import('../generators/generateSettlementPipeline.js')>}
 */
export function loadLocalPipeline() {
  return import('../generators/generateSettlementPipeline.js');
}

/**
 * The pipeline's step registry and runner (the re-derivation reads `getStepMeta`).
 * @returns {Promise<typeof import('../generators/pipeline.js')>}
 */
export function loadPipelineRegistry() {
  return import('../generators/pipeline.js');
}
