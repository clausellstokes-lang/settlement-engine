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
  _enginePromise = Promise.all([
    import('../generators/generateSettlementPipeline.js'),
    import('../generators/pipeline.js'),
    import('../domain/density/densityCreateBoundary.js'),
  ]).then(async ([pipe, runner, boundary]) => {
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
 * ONE RE-DERIVATION, reached only through the store's lazy application-command seam.
 *
 * @param {unknown} seed the record whose world is re-derived; its own stored seed is what makes
 *   the run reproducible, and the domain leaf reads it rather than a caller-supplied one
 * @param {object} config the generation config
 * @param {unknown} layer the DM layer, read through the leaf's absence rules
 * @param {unknown} declarations the INJECTED declaration set, forwarded verbatim
 * @returns {Promise<{ record: unknown, unapplied: Array<object> }>} the leaf's envelope, verbatim
 */
export async function regenerateWithLayer(seed, config, layer, declarations) {
  const engine = await loadEngine();
  return rederive(seed, config, layer, engine, declarations);
}
