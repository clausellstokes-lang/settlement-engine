/**
 * domain/facts/factsAnswered.js — A DESK'S OPTIONS WITH THE FACTS ANSWERED (CENSUS-1b wave 1).
 *
 * Every state-prose desk answers the kernel's dimensions at its entry (`wallsAnswered`,
 * `crisisAnswered`); this hands the kernel the record's `factsOf` too, so a pool whose lines (or
 * whose brace group) declare fact atoms is read against the ONE reader of each atom, and a pool
 * that declares nothing reads exactly as before (`stateProseKernel.js :: eligibleVariants`, law 5
 * generalised). The facts are read live (no cache): `factsOf`'s getters run only when an atom asks.
 *
 * Pure: no randomness, no clock.
 */
import { factsOf } from './factsOf.js';

/**
 * @template {object} T
 * @param {unknown} settlement
 * @param {T} options
 * @returns {T & { facts: ReturnType<typeof factsOf> }}
 */
export function factsAnswered(settlement, options) {
  return Object.assign({}, options, { facts: factsOf(settlement) });
}
