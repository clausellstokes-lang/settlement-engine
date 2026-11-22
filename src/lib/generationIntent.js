/**
 * lib/generationIntent.js — WHO IS ASKING FOR THIS GENERATION.
 *
 * ⛔ SAMPLE FORKS ARE EXEMPT FROM THE ANONYMOUS DAILY CAP (owner ruling, ODQ
 * §934.24(b)): "a fork of a curated sample is a curated seed, not a free generation".
 * The tier gate still applies to a fork, and the cap keeps binding every real
 * generation. `store/settlementGenerateAction.js` is the ONE reader — the cap gate
 * and the two counter increments both consult it.
 *
 * ⛔ WHY THE CONSTANT LIVES HERE AND NOT BESIDE ITS READER. The generation lane is
 * LAZY: `settlementSlice.js` reaches it through a dynamic import so the engine graph
 * stays off the eager first-paint closure. A component that imported the intent from
 * that module would drag the whole lane into its own chunk to read two strings. A
 * zero-import leaf costs the callers nothing and the lane nothing.
 *
 * ⛔ AND WHY IT IS AN ARGUMENT RATHER THAN A CONFIG KEY, WHICH IS THE PART THAT HAS
 * BITTEN BEFORE. The fork surfaces already stamp `_forkedFromSample` into the STORE
 * CONFIG, and store/persistProjection.js persists config — so an exemption read off
 * the config would be STICKY: one fork, and every later generation in that browser
 * would skip the cap until the reader cleared their storage. That is the exact shape
 * of the 2026-09-16 production bug (`seed` stamped into the persisted config broke
 * every later generation), and the generation lane still carries the
 * `delete birthInputs.seed` line that cures it. An argument dies with the call.
 */

/** @typedef {'generate' | 'sampleFork'} GenerationIntent */

/** An ordinary generation: the wizard, the hero, a reroll. Bound by the cap, spends it. */
export const GENERATION_INTENT_GENERATE = 'generate';

/** A fork of a curated sample settlement. Exempt from the cap; never spends it. */
export const GENERATION_INTENT_SAMPLE_FORK = 'sampleFork';

/** The registered intents, for walkers and exhaustiveness checks. */
export const GENERATION_INTENTS = Object.freeze({
  GENERATE: GENERATION_INTENT_GENERATE,
  SAMPLE_FORK: GENERATION_INTENT_SAMPLE_FORK,
});

/**
 * Normalise an options bag's intent. Anything unrecognised — including undefined, a
 * typo, or a shape from an older build — reads as an ORDINARY generation, so the cap
 * fails CLOSED: an exemption must be asked for by its exact name.
 *
 * @param {{ intent?: string }|null|undefined} options
 * @returns {GenerationIntent}
 */
export function intentOf(options) {
  return options?.intent === GENERATION_INTENT_SAMPLE_FORK
    ? GENERATION_INTENT_SAMPLE_FORK
    : GENERATION_INTENT_GENERATE;
}
