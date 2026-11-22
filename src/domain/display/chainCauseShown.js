/**
 * domain/display/chainCauseShown.js — WHY A CHAIN IS IMPAIRED, IN THE RECORD'S OWN WORD (FRAME-8 · F3; the chair's ruling 45
 * of 2026-11-20, 17:12 UTC, vetoable by the owner: "the sheet gets its OWN display reader under `src/domain/display/`,
 * returning the chain's cause word from the record").
 *
 * The chain model writes the condition of the ground a chain draws on (`resourceCondition`: available, depleted or absent;
 * generators/computeActiveChains.js) and impairs a chain whose ground is spent. The word a reader is told is that value,
 * as the record holds it, where it is a cause; no other value is one. ONE VOCABULARY: the Economics tab's card, the supply
 * chains panel and the two PDF sections write the same word inline beside a chain's source ("Hunting grounds (depleted)");
 * tests/lint/chainCauseVocabulary.walker.test.js holds every such inline word to `CHAIN_CAUSE_WORDS` until the join folds
 * those four files onto this reader. Pure: no draw, no write; the record does not move.
 */

/** The record's own values of `resourceCondition` that are a cause, each printed as the record holds it. */
export const CHAIN_CAUSE_WORDS = Object.freeze(['depleted']);

/**
 * The cause word of a chain, from its own record: its `resourceCondition` where that value is a cause, else null.
 * @param {unknown} chain one of `economicState.activeChains`, as the record holds it
 * @returns {string | null}
 */
export function chainCauseOf(chain) {
  const condition = chain && typeof chain === 'object' ? /** @type {{ resourceCondition?: unknown }} */ (chain).resourceCondition : undefined;
  return typeof condition === 'string' && CHAIN_CAUSE_WORDS.includes(condition) ? condition : null;
}
