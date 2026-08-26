/**
 * harness/laneSPINE3/pubOpts.mjs — ⭐⭐ **ONE SPELLING OF THE PUBLICATION'S CALL.** SPINE-3.
 *
 * Four harness drivers call `publishWallWorks`, and before this file each assembled its own opts
 * object. Two consequences, both measured at the DRESS-1b tip:
 *
 * ⛔ **EVERY ONE OF THEM PASSED `year: fabric.meta.presentYear`, AND THAT KEY DOES NOT EXIST.**
 * `buildFabric` publishes `settlementAge` and `snapshotYear`; `presentYear` is `undefined` on all
 * 18 leaves. So `opts.year` was always `null`, `wearOfCircuit`'s `age` was always `null`, and
 * **PA.4's whole wear mechanism has been reporting its NULL CASE — `'kept'`, with no age — for
 * the entire corpus, on a path whose own tests assert the grade moves with age.** The tests are
 * right and were passing on a direct call; the corpus was dark. A silent `undefined` reaching a
 * `!= null` guard is `rampartWorks.js:415`'s own recorded class: *a guard that silently evaluates
 * to false is indistinguishable from a guard that passed.*
 *
 * ⛔ **AND NONE OF THEM PASSED A SITE**, because until SPINE-3 there was nothing to pass it to.
 *
 * One helper, one spelling, and the two facts that were being dropped are now dropped nowhere.
 */
import { wallForm, WALL_MARGIN, WALL_MARGIN_DEFAULT } from '../../src/domain/townMap/fabric/walls.js';

/**
 * @param {any} settlement @param {any} fabric @param {any} input the `partitionInputs` object
 * @param {{site?:boolean}} [o] `site:false` builds the SITE-BLIND call — the control arm.
 */
export function pubOpts(settlement, fabric, input, o = {}) {
  const m = fabric.meta;
  return {
    form: wallForm(settlement, m.tier).form,
    frontage: input.roadWidth,
    seed: input.seed,
    // ⭐ THE PRESENT YEAR, FROM THE KEY THE FABRIC ACTUALLY PUBLISHES.
    year: m.snapshotYear != null ? m.snapshotYear : (m.settlementAge != null ? m.settlementAge : null),
    // ⭐ THE SITE — §2's heightfield, reaching a consumer for the first time.
    site: o.site === false ? null : fabric.substrate,
    // ⭐ THE CHANNEL'S OWN WIDTH — `runCuts`' water reach.
    water: input.water ? { width: input.water.width, line: input.water.line } : null,
    // ⭐ THE WORKING MARGIN AT THE TIER, since the caller knows the tier and the wrap does not.
    margin: (WALL_MARGIN[m.tier] || WALL_MARGIN_DEFAULT) * m.builtRadius,
  };
}
