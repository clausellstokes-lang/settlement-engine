/**
 * domain/facts/chainRites.js — THE RITES' READER (BAR4-CORPUS-ECO, the chair's FS1 of 2026-11-16, with CORPUS-DEF's measure).
 * A chain held up by the rites and still running: the chain record's own recovery (`activeChains[].magicRecovery` > 0, the
 * share the rites give back to a spent ground: "Temple fishing rites improve depleted catch") and its status. The income row
 * reads it (`generators/economy/incomeLineSiblings.js`: the fished-out line takes the rites line there).
 *
 * ITS OWN MODULE ON PURPOSE: only the income writer imports it, so it rides the writer's lazy chunk; a facts module the eager
 * core also imports (`factsOf.js`) would pull the writer's chunk into first paint (the build's boot smoke and the first-paint
 * closure caught exactly that at 772c85705). Layer 2 (the economy). Pure: no randomness, no clock, no write.
 *
 * @enforced-by tests/domain/bar4CorpusEcoKinds.test.js
 */
/** The chain states in which a chain is not running. */
const STOPPED = Object.freeze(['impaired', 'failed', 'collapsed']);

/**
 * Does the rites hold up a chain of this kind that still runs? Read off the economy's own chain list
 * (`economicState.activeChains[]`: `magicRecovery`, written by `generators/chainMagicSubstitution.js`, and `status`).
 * @param {{ economicState?: { activeChains?: unknown } | null, activeChains?: unknown } | null | undefined} record the record, or
 *   the economy's chain list alone, as `{ activeChains }` (the income writer, before the record is assembled)
 * @param {RegExp} [kind] the chain ids of the kind (the fishing chains when unnamed)
 * @returns {boolean}
 */
export function ritesHoldAChain(record, kind = /fish/) {
  const economicState = record?.economicState ?? record;
  const activeChains = Array.isArray(economicState?.activeChains) ? economicState.activeChains : [];
  return activeChains.some((c) => !!c && kind.test(String(c.chainId ?? '')) && Number(c.magicRecovery) > 0 && !STOPPED.includes(String(c.status)));
}
