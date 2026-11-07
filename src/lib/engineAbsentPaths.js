/**
 * engineAbsentPaths.js — THE THREE PATHS A BUILD WITHOUT AN ENGINE STILL CANNOT SERVE
 * (ENGINE-5 unit 2), and what each one says instead of crashing.
 *
 * A build made with VITE_ENGINE_REMOTE='true' carries no generator (the protection step,
 * `vite.config.js :: engineAbsentWhenRemote`); generation, re-derivation, the surveyor's
 * settlement preview and section regeneration run on the engine service. Three paths do not:
 *   (a) the campaign content-binding sample (`store/campaignContentBindingSession.js`), which
 *       forges a same-seed before/after pair under two content runtimes the service does not
 *       take;
 *   (b) instant world (`InstantWorldEntry`, `WorldPage`), whose composer is synchronous by
 *       design and runs the whole pipeline once per member;
 *   (c) the custom-content preview (`CustomContentPanel`, `compendium/CustomContent`), whose
 *       worker forges a sample with reviewed homebrew the service does not take.
 * In that build a non-staff viewer meets the launch teaser on the control
 * (`primitives/LaunchGatedExport.jsx` opening `AvailableAtLaunchDialog` with the path's
 * sentence), and a staff account (`authSlice :: isElevated`, read through
 * `exportLaunchGate.js :: selectExportStaff`) is told the path's one plain sentence.
 *
 * Imports nothing: the flag is read as the generation client reads it, so a flag-off build
 * fetches no service chunk to ask.
 */

/**
 * The typed refusal the absent engine's twin throws (`localEngine.absent.js ::
 * ENGINE_LOCAL_ABSENT_CODE`). Restated, not imported: importing the twin would put it in a
 * flag-off build, where it must not be (tests/build/engineAbsentWhenRemote.test.js).
 */
export const ENGINE_LOCAL_ABSENT = 'engine_local_absent';

/** (a) The content-binding review's sentence. */
export const CONTENT_BINDING_SAMPLE_ABSENT = 'Content change reviews are not available in this build.';
/** (b) Instant world's sentence (the realm builder and a shared world's page). */
export const INSTANT_WORLD_ABSENT = 'Instant worlds are not available in this build.';
/** (c) The custom-content sample's sentence. */
export const CONTENT_PREVIEW_ABSENT = 'Custom content samples are not available in this build.';

/**
 * Whether this build generates through the engine service (and so carries no local engine):
 * `engineRemote.js :: engineRemoteOpen`'s rule, closed unless VITE_ENGINE_REMOTE is exactly
 * 'true'.
 * @param {unknown} [env] the build env, import.meta.env by default (a seam for tests)
 * @returns {boolean}
 */
export function engineServiceBuild(env = import.meta.env) {
  const flags = /** @type {{ VITE_ENGINE_REMOTE?: unknown } | null | undefined} */ (env);
  return Boolean(flags) && flags?.VITE_ENGINE_REMOTE === 'true';
}

/**
 * Is this failure the absent engine's refusal?
 * @param {unknown} error
 * @returns {boolean}
 */
export function isEngineLocalAbsent(error) {
  return Boolean(error) && /** @type {{ code?: unknown }} */ (error).code === ENGINE_LOCAL_ABSENT;
}
