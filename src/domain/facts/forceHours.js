/**
 * domain/facts/forceHours.js — THE HOURS THE TOWN'S FORCE WALKS (BAR8-K-WATCH, 13e; BRIEF-BAR8 K-WATCH item 2 and the
 * chair's ruling BR14 (c); vetoable by the owner, on the veto list as new vocabulary). ONE atom, `force walks by day`,
 * read off the force's OWN TEXT on the roster: the description each order-keeping house prints on the Institutions tab.
 * The guard line "You will see the town watch on the rounds most hours of the day" (`safetyProfile.js :: STANDARD_PATROL`,
 * #18) presumes it; it stood beside a village watch whose own text is "Each household takes its turn walking the lanes
 * after dark" (the seventh read's C42053) and beside "Part-time guards who walk the night and keep the peace".
 *
 *   forceWalksByDayOf(houses)   THE ONE READER: true where some house of the force is not kept to the night by its own
 *                               text; false where every house is (its text walks "the night" or "after dark" and names no
 *                               day and no gate), or where none stands; `undefined` where no roster was handed in
 *                               (unanswered: fail-closed)
 *
 * THE HOUSES ARE THE ONE PARTITION'S (BAR8-K-WATCH-2, the chair's BR29 (2)): `orderForce.js :: orderForceOf(record).houses`,
 * the force's rows on the live roster (garrison, watch, militia by `defenseInstitutionBuckets.js :: DEFENSE_BUCKET_KEYWORDS`:
 * the Defense tab's "Standing forces"), handed in by `factsOf.js`. This leaf spelled its own name table and liveness once,
 * and drifted from the page: a Warden's Lodge counted (a ranger's lodge, no force the page prints) and a Household levy or
 * Multiple garrisons did not. What the leaf keeps is its reading of a house's own text.
 *
 * A house with no text of its own is not kept to the night: nothing it prints says so. A gate held is a day's duty
 * ("walk the night and hold the gates": the gate is kept by day), so a text that names a gate or the day is not
 * night-only. Imports nothing. Pure: no randomness, no clock, no write.
 *
 * @enforced-by tests/generators/bar8Watch.test.js
 */

/** A text that walks the night. */
const NIGHT = /\bafter dark\b|\bnight\b/i;
/** A text that keeps the day, or a gate (held by day). */
const DAY = /\bday\b|\bdaylight\b|\bgates?\b/i;

/**
 * A force's own text keeps it to the night.
 * @param {unknown} desc @returns {boolean}
 */
export function nightOnlyText(desc) {
  const t = String(desc ?? '');
  return NIGHT.test(t) && !DAY.test(t);
}

/**
 * THE ONE READER of `force walks by day`.
 * @param {ReadonlyArray<{ desc?: unknown }> | null | undefined} houses the force's houses (`orderForceOf(record).houses`)
 * @returns {boolean | undefined}
 */
export function forceWalksByDayOf(houses) {
  if (!Array.isArray(houses)) return undefined;
  return houses.some((f) => !nightOnlyText(f?.desc));
}
