/**
 * localEngine.absent.js — the local engine's twin in a build made with
 * VITE_ENGINE_REMOTE='true' (`vite.config.js :: engineAbsentWhenRemote`).
 *
 * The flagged build resolves `src/lib/localEngine.js` and `src/lib/localPipeline.js` (the
 * seam's two doors) and
 * `src/generators/generateSettlementPipeline.js` (the backstop for the importers that
 * reach the pipeline entry without the seam: the instant world composer and the
 * custom-content preview worker; the slice's regeneration bag went through the seam when
 * `regenSection` was lifted, ENGINE-5 unit 1) to THIS module, so it carries
 * both export surfaces. Nothing here imports anything: that is the whole point.
 *
 * Every entry refuses with the typed code `engine_local_absent`. Generation itself does
 * not come here in a flagged build — the `remote` transport takes precedence
 * (`generationClient.js :: runGeneration`) — so what reaches these refusals is a path
 * the engine service does not serve yet (a section regeneration, a re-derivation, a
 * preview). They fail loudly rather than pretending a local engine exists.
 */

export const ENGINE_LOCAL_ABSENT_CODE = 'engine_local_absent';

/** False in the flagged build: the client carries no local engine. */
export const LOCAL_ENGINE_PRESENT = false;

/**
 * @returns {Error & { code: string }}
 */
function absentError() {
  return /** @type {Error & { code: string }} */ (Object.assign(
    new Error('This build carries no local engine; generation is served by the engine service.'),
    { code: ENGINE_LOCAL_ABSENT_CODE },
  ));
}

/** @returns {never} */
function refuse() {
  throw absentError();
}

/** @returns {Promise<never>} */
export function loadGenerationCore() { return Promise.reject(absentError()); }
/** @returns {Promise<never>} */
export function loadLocalPipeline() { return Promise.reject(absentError()); }
/** @returns {Promise<never>} */
export function loadPipelineRegistry() { return Promise.reject(absentError()); }
/** @returns {never} */
export function createGenerationWorker() { return refuse(); }

// The pipeline entry's export surface, for the backstop resolution. Spelled as STRING
// export names (ES2022) on purpose: this module reaches no pipeline, it stands in for one,
// and `tests/lint/densityCreateBoundary.walker.test.js` counts a module that names the
// pipeline's identifier as a reacher to classify (BIRTH / DERIVED / PREVIEW). None of
// those is true of a refusal, so the twin must not read as a caller.
export {
  refuse as 'generateSettlementPipeline',
  refuse as 'carryLockedRosterThroughGenerate',
  refuse as 'refreshRosterProse',
  refuse as 'regenNPCsPipeline',
  refuse as 'regenHistoryPipeline',
};
