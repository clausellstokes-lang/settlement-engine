/**
 * domain/facts/officialsInPay.js — AN OFFICIAL IN A CRIMINAL'S PAY (W2-A-LEAVES-2, 2026-11-13; REVIEW-W2A F3).
 *
 * The crime desk's lines say "criminal money is reaching the officials", "officials are spending money their posts
 * never paid them", "the criminals still own a few officials", "it lives on protection money and bought
 * officials" — or the opposite, "the approach was made and did not take", "nothing is bought here". What makes
 * each TRUE or FALSE is not the hall's stored capture state (`powerStructure.criminalCaptureState` reads the
 * ruling three and the criminal powers only: at `none` 41 of the census's 585 towns still hold an official who
 * answers to a criminal house), but THE CAST: a person whose allegiance to a criminal house runs through their
 * OFFICE — the one the DM panel's "Who answers to whom" prints as bringing "protection and decisions"
 * (`people/patronage.js :: VIA_WORDS.office`, written by `allegiance.js`). This leaf is that fact's one home.
 *
 * A record with no cast, or a public projection whose cards carry no allegiance, holds no such official: a line
 * that needs one is then disqualified, and the page says less, never something false.
 *
 * Layer 4 (it reads the cast, stored at layer 3). Pure: no randomness, no clock, no write.
 */
import { allegianceOf } from '../people/allegiance.js';

/**
 * The names of the people who answer to a criminal house through their office, in cast order.
 * @param {{ npcs?: unknown } | null | undefined} record
 * @returns {string[]}
 */
export function officialsInCriminalPayOf(record) {
  const npcs = Array.isArray(record?.npcs) ? /** @type {unknown[]} */ (record.npcs) : [];
  return npcs
    .filter((card) => allegianceOf(card)?.via === 'office')
    .map((card) => String(/** @type {{ name?: unknown }} */ (card)?.name ?? ''));
}
