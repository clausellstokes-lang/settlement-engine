/**
 * domain/facts/seatOutranked.js — THE OUTRANKED-SEAT HOME (BAR5-POWERS, THE CHAIR'S RULING SO1 of 2026-11-16: "THE ATOM, not
 * the desk-local admission"; vetoable by the owner). The fourth atom of the family `shared power`, `ruling body`, `rival
 * power`. ONE atom, the record's fact: some power that is not the governing one stands ABOVE the governing power by its
 * OWN standing (`powerLabel`, the band `factionDynamics.js` writes and the Power tab prints). A line that says the seat
 * "holds because no rival yet outweighs" it presumes no such power: DS-POW-4 › Holding v3 printed beside an Occupation
 * Authority or a Military/Guard rated Strong over a Significant seat (REVIEW-BAR-5 C38889; the census's
 * r2s-under_siege-city-1).
 *
 *   seatOutrankedOf(record)   THE ONE READER: true where a power with `isGoverning !== true` holds a standing above the
 *                             governing power's; false where the record holds a governing power and none above it;
 *                             `undefined` where it holds no power list, or no governing power with a standing
 *                             (unanswered: fail-closed)
 *
 * The standing is each power's own label, never its share recomputed here: one leaf, the page's own word.
 *
 * ⛔ TRUE OF THE SETTLED RECORD ONLY (the chair's ruling K10, as `rivalPower.js`): the powers settle late in assembly
 * (`reconcilePowerStructure`, then `resizePoliticalRoster`). Only a line rendered from the settled record (the page's
 * desks) may be keyed by it.
 * Pure: no randomness, no clock, no write.
 *
 * @enforced-by tests/domain/facts/seatOutranked.test.js
 */

/** The standing ladder `factionDynamics.js` labels by, lowest first. */
export const STANDING_LADDER = Object.freeze(['Suppressed', 'Minor', 'Significant', 'Strong', 'Dominant']);

/**
 * THE ONE READER of `seat outranked`.
 * @param {{ powerStructure?: { factions?: unknown } | null } | null | undefined} record
 * @returns {boolean | undefined}
 */
export function seatOutrankedOf(record) {
  const factions = record?.powerStructure?.factions;
  if (!Array.isArray(factions)) return undefined;
  /** @param {unknown} f */
  const rank = (f) => STANDING_LADDER.indexOf(String(/** @type {{ powerLabel?: unknown } | null} */ (f)?.powerLabel ?? ''));
  const seat = factions.find((/** @type {{ isGoverning?: unknown } | null | undefined} */ f) => !!f && f.isGoverning === true);
  if (!seat || rank(seat) < 0) return undefined;
  return factions.some((/** @type {{ isGoverning?: unknown } | null | undefined} */ f) => !!f && f !== seat && f.isGoverning !== true && rank(f) > rank(seat));
}
