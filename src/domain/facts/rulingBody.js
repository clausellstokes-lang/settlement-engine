/**
 * domain/facts/rulingBody.js — THE RULING-BODY HOME (TAIL-TIES, the chair's ruling (T5) of 2026-11-14: "THE WORD
 * IS GRANTED", vetoable by the owner): ONE fact, the town is ruled by a BODY OF MORE THAN ONE, not one ruler.
 *
 * The rule MOVED here verbatim from `domain/coherence/hookTruth.js :: settlementHookFacts` (R3-CODE-C-3,
 * ROUND-3-CUT-INCREMENT #ww-868), which re-exports it, so the hook gate and the vocabulary's atom
 * `ruling body` are one reading. WHY NOT `ruler: council`: the ruler-kind home (`facts/rulerKind.js`) sorts
 * a government by WHO holds it, so an Elder Council, a Household Council and a Free Elder Council read
 * `elder` beside the one-person Headman's Authority, and an Ecclesiastical, Church or High Theocratic
 * Council reads `priest` beside the one-person Priestly Guidance: `ruler: council` holds only for the
 * councils of no other kind. This rule reads the form of government itself: the kind `council`, or an elder
 * or priestly government whose own label names a council. A headman, a priest-king, a lord, a mayor or an
 * occupier is one ruler. An absent government answers nothing (undefined): an unknown seat licenses nothing.
 *
 * Pure: no randomness, no clock.
 */
import { rulerKindOf, rulerKindOfLabel } from './rulerKind.js';

/** An elder or priestly government whose label names a council is a body. @type {RegExp} */
export const RULED_BY_A_BODY = /\bcouncil\b/i;

/**
 * The rule over a government label (hookTruth.js's `ruledByCouncil`, moved).
 * @param {unknown} government the record's `powerStructure.government`
 * @returns {boolean}
 */
export function ruledByBodyOfLabel(government) {
  const rulerKind = rulerKindOfLabel(government);
  return rulerKind === 'council'
    || ((rulerKind === 'elder' || rulerKind === 'priest') && typeof government === 'string' && RULED_BY_A_BODY.test(government));
}

/**
 * THE ONE READER: is the town ruled by a body of more than one?
 * @param {{ powerStructure?: { government?: unknown } | null } | null | undefined} record a settlement record
 * @returns {boolean|undefined} undefined when the record names no government
 */
export function rulingBodyOf(record) {
  if (rulerKindOf(record) === null) return undefined;
  return ruledByBodyOfLabel(record?.powerStructure?.government);
}
