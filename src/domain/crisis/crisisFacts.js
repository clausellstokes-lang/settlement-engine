/**
 * domain/crisis/crisisFacts.js — WHICH CRISES ARE ACTIVE, and which calm claims they deny
 * (F12 CRISIS-BLIND PROSE, rung 2, 2026-11-04).
 *
 * The one reader of the crisis record for the two consumers that must agree on it: the
 * page check `coh:crisis-blind-prose` (`coherence/crisisBlindFindings.js`), which flags a
 * rendered sentence that asserts calm under a crisis that denies it, and the state-prose
 * desks, which answer the kernel's crisis dimensions at their entries (`crisisAnswered`) so a
 * calm variant is never drawn under the crisis it denies.
 *
 * THE RECORD. An active crisis is an entry of the settlement's stress container
 * (`settlement.stress`, one entry or a list; `stressGenerator.js :: buildStressEntry`), keyed
 * by its `type` (`data/stressTypes.js :: STRESS_TYPE_MAP`). Resolution removes the entry
 * (`crisisLifecycle.js :: crisisResolve`), so presence is activity.
 *
 * THE FAMILIES. A calm sentence denies a KIND of trouble, not one crisis type: "Nothing
 * presses the town" is false under a siege, an occupation and a beast-and-raider threat
 * alike. Each family is one state-prose dimension (`stateProseKernel.js ::
 * STATE_MARK_DIMENSIONS`) with two words: the crisis word and its `no …` twin. A variant
 * that asserts the calm carries the `no …` word and speaks only where no crisis of the family
 * is active; a crisis-safe variant carries the crisis word and speaks only where one is. The
 * words are spelled here and in the kernel (a display leaf imports nothing);
 * `tests/domain/crisisBlindDossierProse.test.js` holds the two equal.
 *
 * THE READER MOVED (CENSUS-1, 2026-11-04): the families and the type reader are the crisis-kind
 * home's, `domain/facts/crisisKind.js`, which reads the stress container through the alias order
 * (`stressors` → `stress` → `stresses`, one object at birth and under every writer).
 *
 * Pure: no randomness, no clock.
 */

// The families and the readers live in the crisis-kind home (CENSUS-1 wave 0, fact 1); this
// module keeps its importers' names as re-exports and its one desk adapter below.
import { crisisDimensionsOf } from '../facts/crisisKind.js';

export { CRISIS_FAMILIES, activeCrisisTypes, familyTypesActive, familyActiveIn, crisisDimensionsOf } from '../facts/crisisKind.js';

/**
 * A desk's options with every crisis dimension answered for this place. Every other dimension
 * the caller already answered (the `walls` answer included) is kept.
 * @template {object} T
 * @param {object | null | undefined} settlement
 * @param {T} options
 * @returns {T & { dimensions: Record<string, string> }}
 */
export function crisisAnswered(settlement, options) {
  const given = /** @type {{ dimensions?: Record<string, string> } | null | undefined} */ (options)?.dimensions;
  return Object.assign({}, options, { dimensions: { ...(given || {}), ...crisisDimensionsOf(settlement) } });
}
