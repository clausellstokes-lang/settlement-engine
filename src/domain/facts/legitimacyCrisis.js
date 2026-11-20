/**
 * domain/facts/legitimacyCrisis.js — THE PEOPLE DO NOT HOLD THE GOVERNMENT LEGITIMATE (BAR6-SCENES, LAW 9 rule 9f,
 * 2026-11-16; BRIEF-BAR6 seat BAR6-SCENES (f) and B6: a new atom beneath `ruler`, vetoable by the owner, on the veto
 * list as new vocabulary).
 *
 *   legitimacyCrisisOf(record)   `legitimacy crisis`: the record's public legitimacy is in its crisis band
 *                                (`powerStructure.publicLegitimacy.isLegitimacyCrisis`, written by
 *                                `generators/factionDynamics.js :: computePublicLegitimacy`), the band the Power tab
 *                                prints as "Public legitimacy · Legitimacy crisis". The wartime pressure sentence said
 *                                "The settlement is loyal." beside it (REVIEW-WIDE-6 C76517, bar0-city-wartime-rand-40).
 *
 * Layer 3 (over the power structure). Pure: no randomness, no clock, no write.
 * @enforced-by tests/domain/bar6ScenesGoods.test.js
 */

/**
 * THE ONE READER of `legitimacy crisis`.
 * @param {unknown} record the settlement record
 * @returns {boolean | undefined} undefined where the record carries no public legitimacy
 */
export function legitimacyCrisisOf(record) {
  const pl = /** @type {{ powerStructure?: { publicLegitimacy?: { isLegitimacyCrisis?: unknown, label?: unknown } | null } | null } | null} */ (record)?.powerStructure?.publicLegitimacy;
  if (!pl || typeof pl !== 'object') return undefined;
  if (typeof pl.isLegitimacyCrisis === 'boolean') return pl.isLegitimacyCrisis;
  return typeof pl.label === 'string' ? /\bcrisis\b/i.test(pl.label) : undefined;
}
