/**
 * settlementRederiveAction.js — THE RE-DERIVATION SEAT (EM-B2a4, wave 1, member 4 of the
 * EM-B2a split).
 *
 * ⛔ THE ONE SEAT OF THIS MEMBER THAT NAMES THE GENERATION ENTRY IN CODE, and therefore the one
 * that carries a `PIPELINE_REACHERS` row. `src/domain/edit/dmLayer.js` takes the engine as an
 * INJECTED handle whose run member is named neutrally, because the create-boundary walker
 * computes its reacher set from the comment- and string-stripped bare symbol and a domain leaf
 * that spelled it would join that set unclassified.
 *
 * ⛔ LAZY BY CONSTRUCTION, on the idiom the slice's own `loadEngine` already ships: both generator
 * modules are reached by a memoized dynamic import, so neither this leaf nor the domain leaf nor
 * the pipeline enters the eager first-paint closure. That closure's derivation walks STATIC edges
 * only, which is what makes the plus-zero price true by construction rather than by hope.
 *
 * ⭐ TWO MODULES, AND THAT IS MEASURED RATHER THAN STYLISTIC. The generation entry re-exports
 * nothing: its namespace holds five names and `getStepMeta` is not among them, so the chooser
 * roster must come from its own producer, the runner module.
 *
 * ⛔ IT IMPORTS NO DECLARATION TABLE AND NO POOL CATALOGUE. The declaration set is INJECTED by the store's
 * plain-edit half, which already holds it and is already one of the two sanctioned importers of
 * the declaration table; this leaf forwards that set and holds none of its own, so the table's
 * importer roster is unmoved by this member.
 */
import { rederive } from '../domain/edit/dmLayer.js';

/** @type {?Promise<{ run: Function, getStepMeta: Function }>} */
let _enginePromise = null;

/**
 * The engine handle, memoized exactly as the slice memoizes its own.
 * @returns {Promise<{ run: Function, getStepMeta: Function }>}
 */
function loadEngine() {
  if (_enginePromise) return _enginePromise;
  // Both engine modules through the local engine seam's pipeline door (lib/localPipeline.js),
  // which a VITE_ENGINE_REMOTE build leaves out (ENGINE-3 unit 2): there a re-derivation
  // refuses with the typed `engine_local_absent` instead of carrying the generator.
  _enginePromise = import('../lib/localPipeline.js').then((seam) => Promise.all([
    seam.loadLocalPipeline(),
    seam.loadPipelineRegistry(),
    import('../domain/density/densityCreateBoundary.js'),
  ])).then(async ([pipe, runner, boundary]) => {
    // ⛔ THE GENERATION LAWS' LAZY PAYLOADS ARE ARMED BEFORE ANY RUN, on the same async edge as
    // the engine's own import and exactly as the other reachers arm them. A world whose config
    // carries a law with a lazy payload is not DEGRADED when that payload was never loaded: it
    // is no world at all, because the seam throws out of the pipeline rather than generating
    // something the law does not govern. A re-derivation re-runs an EXISTING world, so it is the
    // last caller that may be allowed to skip this.
    const { loadGenerationLawPayloads } = boundary;
    await loadGenerationLawPayloads();
    return {
      run: (/** @type {object} */ config, /** @type {unknown} */ neighbour, /** @type {object} */ options) =>
        pipe.generateSettlementPipeline(config, neighbour, options),
      getStepMeta: runner.getStepMeta,
    };
  });
  return _enginePromise;
}

/**
 * The engine service's build flag, `engineRemote.js :: engineRemoteOpen`'s rule (closed unless
 * VITE_ENGINE_REMOTE is exactly 'true'), spelled here as `generationClient.js :: remoteFlagOpen`
 * spells it, so a flag-off re-derivation fetches no engine-service chunk at all.
 * @returns {boolean}
 */
function remoteFlagOpen() {
  const env = /** @type {{ VITE_ENGINE_REMOTE?: unknown } | undefined} */ (import.meta.env);
  return Boolean(env) && env?.VITE_ENGINE_REMOTE === 'true';
}

/**
 * ONE RE-DERIVATION, reached only through the store's lazy application-command seam.
 *
 * @param {unknown} seed the record whose world is re-derived; its own stored seed is what makes
 *   the run reproducible, and the domain leaf reads it rather than a caller-supplied one
 * @param {object} config the generation config
 * @param {unknown} layer the DM layer, read through the leaf's absence rules
 * @param {unknown} declarations the INJECTED declaration set, forwarded verbatim
 * @param {{ remote?: boolean }} [opts] `remote` defaults to the build flag (a seam for tests);
 *   open, the re-derivation runs through the engine service (`regenerateWithLayerRemote`)
 * @returns {Promise<{ record: unknown, unapplied: Array<object> }>} the leaf's envelope, verbatim
 */
export async function regenerateWithLayer(seed, config, layer, declarations, { remote = remoteFlagOpen() } = {}) {
  if (remote) return regenerateWithLayerRemote(seed, config, layer, declarations);
  const engine = await loadEngine();
  return rederive(seed, config, layer, engine, declarations);
}

/** @type {?Promise<Array<Record<string, any>>>} */
let _remoteStepMeta = null;

/**
 * THE RE-DERIVATION THROUGH THE ENGINE SERVICE (ENGINE-4 unit 1), taken when the build
 * carries no local engine (VITE_ENGINE_REMOTE). The domain leaf `rederive` is synchronous
 * and pure over its arguments, so it runs TWICE around one network call and is not touched:
 *   1. the PROBE: an engine handle whose `run` only records its arguments, which are exactly
 *      what the local handle would have handed the pipeline (config′, null, { seed, pins? });
 *   2. those arguments go to engine-generate's `derive` op, which runs the pipeline with them
 *      verbatim (`engineRemote.js :: runRemoteDerive`);
 *   3. the REPLAY: the same `rederive` with a handle whose `run` returns that settlement, so
 *      the trace partition and the envelope are the leaf's own.
 * `getStepMeta` is the service's registry rows (`fetchRemoteStepMeta`), fetched once per
 * session. A remote failure rejects typed; nothing local is run instead. A world fact the
 * option-set consult refuses throws out of the probe, before any fetch, exactly as it does
 * locally.
 *
 * @param {unknown} seed @param {object} config @param {unknown} layer @param {unknown} declarations
 * @param {import('../lib/engineRemote.js').RemoteOptions} [opts] the transport's seams (tests)
 * @returns {Promise<{ record: unknown, unapplied: Array<object> }>}
 */
export async function regenerateWithLayerRemote(seed, config, layer, declarations, opts = {}) {
  const remote = await import('../lib/engineRemote.js');
  const stepMetaPromise = opts.fetchImpl
    ? remote.fetchRemoteStepMeta(opts)
    : (_remoteStepMeta ||= remote.fetchRemoteStepMeta(opts).catch((error) => {
      _remoteStepMeta = null;
      throw error;
    }));
  const stepMeta = await stepMetaPromise;
  const getStepMeta = () => structuredClone(stepMeta);
  /** @type {Array<[object, unknown, { seed?: unknown, pins?: unknown }]>} */
  const calls = [];
  const probe = rederive(seed, config, layer, {
    getStepMeta,
    run: (/** @type {object} */ c, /** @type {unknown} */ n, /** @type {{ seed?: unknown, pins?: unknown }} */ o) => {
      calls.push([c, n, o]);
      return undefined;
    },
  }, declarations);
  if (calls.length === 0) return probe;
  const [runConfig, , runOptions] = calls[0];
  const settlement = await remote.runRemoteDerive(
    { seed: runOptions.seed, config: runConfig, pins: runOptions.pins }, opts,
  );
  return rederive(seed, config, layer, { getStepMeta, run: () => settlement }, declarations);
}
