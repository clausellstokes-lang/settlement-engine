/**
 * localEngine.js — THE ONE SEAM through which the client reaches its LOCAL generation transports.
 *
 * docs/DESIGN_ENGINE_SERVICE.md "The client switch" step (5), THE PROTECTION STEP:
 * when the build carries VITE_ENGINE_REMOTE='true', the client must not contain the
 * generator. The generation lane's two local transports — the in-thread core and the
 * worker — are reached through the two entries below, and `vite.config.js ::
 * engineAbsentWhenRemote` resolves THIS module to its twin `localEngine.absent.js` in a
 * flagged build, so the flagged `dist/` has no import edge to the generation core or to
 * the generation worker (whose only
 * `new Worker(new URL(...))` lives here — Vite emits a worker bundle for that pattern
 * at transform time, so the only way to leave it out is to leave this module out).
 * `tests/build/engineAbsentWhenRemote.test.js` proves the absence on a flagged build.
 *
 * Its sibling `localPipeline.js` (the pipeline entry and its step registry, for the
 * re-derivation, the surveyor's preview and the content-binding sample) is the same seam's
 * other door, redirected by the same rule. They are TWO MODULES ON PURPOSE, and that is
 * measured: this one is imported only by the generation lane, so Rollup inlines it into
 * the lane's chunk; one module shared by the lane and three other chunks is split into its
 * own chunk and grew the entry's preload map by 72 B with the flag off.
 *
 * With the flag off this module is a pure pass-through: the core loader is the same
 * `import()` its caller used to spell, so the module namespace a caller receives is the
 * one it received before (`tests/lib/localEngineCallers.test.js` pins the identity).
 * Every edge is dynamic except the worker's URL, so importing the seam fetches no engine
 * chunk.
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
 * The generation worker: one per request, constructed synchronously by the
 * generation client (`generationClient.js :: runGeneration`).
 * @returns {Worker}
 */
export function createGenerationWorker() {
  return new Worker(new URL('../workers/generation.worker.js', import.meta.url), { type: 'module' });
}
