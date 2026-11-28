/**
 * domain/facts/factsAnswered.js — A DESK'S OPTIONS WITH THE FACTS ANSWERED (CENSUS-1b wave 1).
 *
 * Every state-prose desk answers the kernel's dimensions at its entry (`wallsAnswered`,
 * `crisisAnswered`); this hands the kernel the record's `factsOf` too, so a pool whose lines (or
 * whose brace group) declare fact atoms is read against the ONE reader of each atom, and a pool
 * that declares nothing reads exactly as before (`stateProseKernel.js :: eligibleVariants`, law 5
 * generalised). The facts are read live (no cache): `factsOf`'s getters run only when an atom asks.
 *
 * THE DESKS' DOOR ANSWERS ONE ATOM `factsOf` CANNOT (SURVEY S-B, the eleventh chair's RULING S-B-1 of 2026-11-28): `place debt`,
 * whose one reader (`display/solvencyShown.js :: owesDebtShown`) reads whether a Debt Crisis's hook PRINTS through the reader that
 * decides it (`dossier/plotHooks.js :: collectPlotHooks`), which imports `factsOf.js`: a getter there would close an import cycle
 * (`tests/architecture/layerBoundaries.test.js`, shrink-only). Every desk enters here, so every pool that declares the atom is
 * read with it answered; off this door it is UNKNOWN and refuses fail-closed.
 *
 * Pure: no randomness, no clock.
 */
import { factsOf } from './factsOf.js';
import { owesDebtShown } from '../display/solvencyShown.js';

/**
 * @param {unknown} settlement
 * @returns {ReturnType<typeof factsOf> & { readonly placeDebt: boolean }} `factsOf(settlement)` with the desks' own atom
 */
export function deskFactsOf(settlement) {
  const facts = /** @type {ReturnType<typeof factsOf> & { readonly placeDebt: boolean }} */ (Object.defineProperties({}, {
    ...Object.getOwnPropertyDescriptors(factsOf(settlement)),
    placeDebt: { enumerable: true, get: () => owesDebtShown(settlement) },
  }));
  return Object.freeze(facts);
}

/**
 * @template {object} T
 * @param {unknown} settlement
 * @param {T} options
 * @returns {T & { facts: ReturnType<typeof deskFactsOf> }}
 */
export function factsAnswered(settlement, options) {
  return Object.assign({}, options, { facts: deskFactsOf(settlement) });
}
