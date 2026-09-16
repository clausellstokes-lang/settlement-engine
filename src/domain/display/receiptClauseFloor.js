/**
 * domain/display/receiptClauseFloor.js — THE PLACEHOLDER CLAUSES: the lines a
 * display surface prints where a receipt carries NO CLAUSE OF ITS OWN, and the
 * one predicate that recognises them (lane HR, the cycle-11 verifier's lighting
 * blocker).
 *
 * ── WHY A MODULE FOR THREE STRINGS ──────────────────────────────────────────
 * The cause walk hands the Herald's composer one thing per hop: the receipt's
 * own byte-verbatim recorded headline, which the composer then puts inside a
 * §1 JOIN MOLD as a FINITE CLAUSE. Three of the strings that arrive in that
 * position are not clauses and not the receipt's:
 *
 *   `UNRECEIPTED_HOP`        the provenance ledger names a parent that no
 *                            pulseHistory record resolves — a root
 *                            `sourceEventId`, or a receipt aged past
 *                            MAX_HISTORY=80. A NOUN PHRASE, and `redacted:false`,
 *                            so nothing structural marked it.
 *   `PULSE_OUTCOME_FALLBACK` / `PULSE_IMPACT_FALLBACK`
 *                            `chronicleGraph.nodesFromRecord` stamps these when a
 *                            durable outcome or impact-digest entry carries no
 *                            headline at all. Also noun phrases.
 *
 * Fed to a connective's slot they compose sentences the record does not support:
 * "— in the wake of the day an earlier cause", "— born of the fact that World
 * pulse outcome". The composer's cure is to treat such a hop as TERMINAL — draw
 * no connective over it, never re-label the edge to make the prose fit, and let
 * the §3.2 terminal say the honest thing.
 *
 * THE VOCABULARY LIVES HERE RATHER THAN AT EITHER PRODUCER because the guard and
 * the producers must move together. A composer that carried its own copy would
 * keep composing over the placeholder the day a wording changed, and the failure
 * is silent: an ungrammatical sentence on the DM's paper, asserting a relation to
 * a receipt nobody found. That is the same drift shape lane HG-3 cured for the
 * popup's integrity flag, one register over.
 *
 * `REDACTED_HOP` is deliberately NOT here. A covert hop is already marked
 * STRUCTURALLY (`hop.redacted === true`) by the walk that hid it, so the composer
 * reads a boolean rather than a string, and the constant stays in `causeWalk.js`
 * where the redaction is performed. Two different truths, two different guards:
 * something was HIDDEN from you, versus the record does not REACH.
 *
 * PURE: no store, no React, no Date, no Math.random, no I/O, no mutation.
 *
 * @enforced-by tests/domain/causeWalk.test.js (the single-writer source scan)
 * @enforced-by tests/domain/heraldCausalVoice.test.js (the composer's guard)
 */

/**
 * What an UNRECEIPTED hop reads as: the ledger names a parent that no
 * pulseHistory record resolves. Honest, and deliberately not prose the walk
 * invented.
 *
 * EXPORTED BECAUSE IT IS A CLASSIFICATION KEY, NOT DECORATION. The causality
 * popup decides a link's integrity `resolved` flag by comparing against it, and
 * `heraldIntegrity` reads `clean` as EVIDENCED — a receipt that exists and
 * carries no manipulation marker — never as assumed from silence. A second copy
 * of this string in a consumer would drift the day the wording changes, and the
 * drift's shape is precisely an unreceipted hop reading CLEAN: the paper would
 * vouch for a link whose receipt it never found.
 */
export const UNRECEIPTED_HOP = 'an earlier cause';

/** What a durable pulse OUTCOME with no recorded headline reads as. */
export const PULSE_OUTCOME_FALLBACK = 'World pulse outcome';

/** What a durable impact-digest ENTRY with no recorded headline reads as. */
export const PULSE_IMPACT_FALLBACK = 'World pulse impact';

/**
 * The closed set. A clause slot may never receive any of these.
 * @type {ReadonlyArray<string>}
 */
export const PLACEHOLDER_CLAUSES = Object.freeze([
  UNRECEIPTED_HOP,
  PULSE_OUTCOME_FALLBACK,
  PULSE_IMPACT_FALLBACK,
]);

/**
 * Whether a hop's headline is a PLACEHOLDER rather than the receipt's own clause.
 * Exact match on the trimmed text: every member is an authored constant, so a
 * looser comparison could only ever swallow a real recorded headline that happened
 * to contain one of these phrases.
 * @param {unknown} text
 * @returns {boolean}
 */
export function isPlaceholderClause(text) {
  const value = String(text ?? '').trim();
  return value !== '' && PLACEHOLDER_CLAUSES.includes(value);
}
