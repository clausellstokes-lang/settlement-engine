/**
 * domain/facts/ironAtHand.js — THE IRON-AT-HAND HOME (BAR2-PLACES, the chair's grant VW2 of 2026-11-15: "iron reaches the
 * smith"; vetoable by the owner, on the veto list as new vocabulary). ONE atom, the record's fact: the town's smiths have
 * iron to work. A line that hears blades being made presumes it; "The hammering echoes throughout Hochberg, and most of
 * it is the sound of blades being made." printed beside the siege's own "the iron … from outside, which the siege has cut
 * off" (REVIEW-BAR-2 C3297, bar0-city-under_siege+famine-rand-5: iron imported, none worked here, a siege in force).
 *
 *   ironAtHandOf(record)   THE ONE READER, over the homes that already answer each part:
 *                          · true where a chain works iron here: a chain of `economicState.activeChains` takes
 *                            `iron_deposits` as its input, has it (`resourceInputAvailable`) and is working (the states of
 *                            `chainWorking.js :: WORKING_CHAIN_STATUSES`, spelled here: that leaf rides a lazy chunk and
 *                            the facts are eager, so it is not imported): the town's own iron, which no siege cuts off;
 *                          · else, where the record imports iron (`canonicalAccessors.js :: canonImports`), true unless a
 *                            siege is in force (`crisisKind.js :: crisisOf`: the crisis leaf's own reading of what a siege
 *                            stops, the one `chainStateShown.js :: tradeStoppedHere` reads);
 *                          · else false: no iron is worked here and none comes in.
 *
 * Measured on the census's 720 at f8042b61a: the seven towns that print the blades line all have iron at hand (local or
 * imported, none under a siege). Layer 2 (over the economy and the crises). Pure: no randomness, no clock, no write.
 *
 * @enforced-by tests/generators/bar2PlacesRows.test.js
 */
import { crisisOf } from './crisisKind.js';
import { canonImports } from '../canonicalAccessors.js';

/** The chain states in which a chain is working its input (`chainWorking.js :: WORKING_CHAIN_STATUSES`, the same list). */
const WORKING = Object.freeze(['running', 'operational', 'entrepot', 'vulnerable', 'magically_sustained']);

/** An import that is iron, by its printed name ("Iron", "Iron (weapons)", "Iron ore (local iron mines exhausted)"). */
const IRON = /\biron\b/i;

/**
 * THE ONE READER of `iron at hand`.
 * @param {unknown} record the settlement record
 * @returns {boolean | undefined} undefined where there is no record
 */
export function ironAtHandOf(record) {
  if (!record || typeof record !== 'object') return undefined;
  const chains = /** @type {{ economicState?: { activeChains?: unknown } }} */ (record).economicState?.activeChains;
  if (Array.isArray(chains) && chains.some((c) => !!c && c.resourceInputKey === 'iron_deposits' && c.resourceInputAvailable === true && WORKING.includes(String(c.status)))) return true;
  const imports = canonImports(/** @type {Parameters<typeof canonImports>[0]} */ (record));
  const brought = imports.some((x) => IRON.test(typeof x === 'string' ? x : String(/** @type {{ name?: unknown, good?: unknown }} */ (x)?.name ?? /** @type {{ good?: unknown }} */ (x)?.good ?? '')));
  if (!brought) return false;
  return !crisisOf(/** @type {object} */ (record)).has('under_siege');
}
