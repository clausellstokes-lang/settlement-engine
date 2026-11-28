/**
 * domain/facts/appointedPost.js — THE TOWN KEEPS A POST SOMEONE IS NAMED TO (BAR5-THINGS, LAW 4 "the patron", 2026-11-16;
 * BRIEF-BAR5 seat BAR5-THINGS (c); BRIEF-BAR4 amendment 5b: an atom beside its family, vetoable by the owner, on the veto
 * list as new vocabulary).
 *
 *   appointedPostOf(record)   `appointed post`: false where the town's civic voice is a household head nobody named (a
 *                             `Household elder` on the live roster, by catalogue identity: every description of that house
 *                             denies an appointment: "No office, no title, no vote", "with no appointment behind it.
 *                             Nobody named them to it"; the catalogue caps it at a thorp, where no other civic house
 *                             stands); true elsewhere. A hook that gives its holder "their post", owed to a patron,
 *                             presumes it (REVIEW-BAR-5 C30295: "They owe their post to a patron …" on the household
 *                             elder whose card says "Nobody named them to it").
 *
 * The hook draws read the roster at the draw (`npcGenerator.js :: generatePlotHook`, `people/representatives.js ::
 * spareHookLine`), so the atom is answered on both paths.
 *
 * Layer 1 (over the roster). Pure: no randomness, no clock, no write.
 * @enforced-by tests/domain/bar5ThingsLaw4.test.js
 */
import { liveInstitutions } from '../institutions/institutionRoster.js';
import { nativeSemanticName } from '../content/customContentSemanticAuthority.js';

/** The houses whose holder no one named, by native name (lower case). */
export const UNAPPOINTED_HOUSES = Object.freeze(new Set(['household elder']));

/**
 * THE ONE READER of `appointed post`.
 * @param {unknown} record the settlement record
 * @returns {boolean | undefined} undefined where there is no record
 */
export function appointedPostOf(record) {
  if (!record || typeof record !== 'object') return undefined;
  return !liveInstitutions(/** @type {Parameters<typeof liveInstitutions>[0]} */ (record)).some((inst) => {
    const name = String(nativeSemanticName(/** @type {object} */ (inst)) || /** @type {{ name?: unknown }} */ (inst)?.name || '').toLowerCase().trim();
    return UNAPPOINTED_HOUSES.has(name);
  });
}
