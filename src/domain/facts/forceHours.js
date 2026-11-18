/**
 * domain/facts/forceHours.js — THE HOURS THE TOWN'S FORCE WALKS (BAR8-K-WATCH, 13e; BRIEF-BAR8 K-WATCH item 2 and the
 * chair's ruling BR14 (c); vetoable by the owner, on the veto list as new vocabulary). ONE atom, `force walks by day`,
 * read off the force's OWN TEXT on the roster: the description each order-keeping house prints on the Institutions tab.
 * The guard line "You will see the town watch on the rounds most hours of the day" (`safetyProfile.js :: STANDARD_PATROL`,
 * #18) presumes it; it stood beside a village watch whose own text is "Each household takes its turn walking the lanes
 * after dark" (the seventh read's C42053) and beside "Part-time guards who walk the night and keep the peace".
 *
 *   forceWalksByDayOf(record)   THE ONE READER: true where some live order-keeping house (a watch, a garrison, a
 *                               militia, a guard, a barracks, a patrol, a constabulary, a warden) is not kept to the
 *                               night by its own text; false where every such house is (its text walks "the night" or
 *                               "after dark" and names no day and no gate), or where none stands; `undefined` where the
 *                               record holds no roster (unanswered: fail-closed)
 *
 * A house with no text of its own is not kept to the night: nothing it prints says so. A gate held is a day's duty
 * ("walk the night and hold the gates": the gate is kept by day), so a text that names a gate or the day is not
 * night-only. The roster's liveness is `institutionRoster.js :: isLiveInstitution`'s, spelled here so the leaf imports
 * nothing (ruling EG1).
 * Pure: no randomness, no clock, no write.
 *
 * @enforced-by tests/generators/bar8Watch.test.js
 */

/** An order-keeping house by its roster name (a house "within reach" is no force of the town). */
export const ORDER_FORCE_NAME = /\b(watch|militia|garrison|guard|barracks|patrol|constab\w*|warden)\b/i;
/** A text that walks the night. */
const NIGHT = /\bafter dark\b|\bnight\b/i;
/** A text that keeps the day, or a gate (held by day). */
const DAY = /\bday\b|\bdaylight\b|\bgates?\b/i;
/** `institutionRoster.js :: INACTIVE_STATUS`, spelled here (EG1). */
const INACTIVE = new Set(['ruined', 'removed', 'destroyed', 'remnant']);

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
 * @param {{ institutions?: unknown } | null | undefined} record
 * @returns {boolean | undefined}
 */
export function forceWalksByDayOf(record) {
  const roster = record?.institutions;
  if (!Array.isArray(roster)) return undefined;
  const forces = roster.filter((/** @type {unknown} */ i) => {
    const h = /** @type {{ name?: unknown, status?: unknown, _worldPulseInactive?: unknown } | null} */ (i);
    if (!h || typeof h !== 'object' || h._worldPulseInactive === true) return false;
    if (INACTIVE.has(String(h.status || 'active').toLowerCase())) return false;
    const name = String(h.name ?? '');
    return ORDER_FORCE_NAME.test(name) && !/^access to/i.test(name);
  });
  return forces.some((/** @type {{ desc?: unknown }} */ f) => !nightOnlyText(f.desc));
}
