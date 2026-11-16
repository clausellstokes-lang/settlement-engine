/**
 * domain/facts/timberAtHand.js — THE TIMBER-AT-HAND HOME (BAR4-HOUSES, kind H1 (ii), 2026-11-16; BRIEF-BAR4 amendment 5b:
 * an atom added beside its family, `iron at hand`; vetoable by the owner, on the veto list as new vocabulary). ONE atom,
 * the record's fact: the town works timber of its own. A house's description that has "timber to hand" and supplies "the
 * region's building work" presumes it; "A town with timber to hand supplies the region's building work" printed beside a
 * managed woodland the Resources tab calls depleted, timber among the imports and no lumber among the exports (REVIEW-BAR-4
 * C40862, bar0-town-occupied-rand-22).
 *
 *   timberAtHandOf(record)   THE ONE READER: true where the Timber & Lumber chain of `economicState.activeChains`
 *                            (`chainId: 'timber'`) has its input (`resourceInputAvailable`) and is working (the states of
 *                            `chainWorking.js :: WORKING_CHAIN_STATUSES`, spelled here as `ironAtHand.js` spells them:
 *                            that leaf rides a lazy chunk and the facts are eager, so it is not imported); else false (no
 *                            timber chain, or one whose woodland is spent: bought timber is not timber to hand for the
 *                            region's building work).
 *
 * Measured on the census's 720 at 8aef8e7d46: of the 19 towns that print the commercial sawmill's two timber lines, 8 have
 * timber at hand (each of them exports lumber); 11 have none (no timber chain, or one whose woodland is spent). Layer 2 (over the economy). Pure: no
 * randomness, no clock, no write.
 *
 * @enforced-by tests/generators/bar4HousesPresumptions.test.js
 */

/** The chain states in which a chain is working its input (`chainWorking.js :: WORKING_CHAIN_STATUSES`, the same list). */
const WORKING = Object.freeze(['running', 'operational', 'entrepot', 'vulnerable', 'magically_sustained']);

/**
 * THE ONE READER of `timber at hand`.
 * @param {unknown} record the settlement record
 * @returns {boolean | undefined} undefined where there is no record or no economy
 */
export function timberAtHandOf(record) {
  if (!record || typeof record !== 'object') return undefined;
  const chains = /** @type {{ economicState?: { activeChains?: unknown } }} */ (record).economicState?.activeChains;
  if (!Array.isArray(chains)) return undefined;
  return chains.some((c) => !!c && c.chainId === 'timber' && c.resourceInputAvailable === true && WORKING.includes(String(c.status)));
}
