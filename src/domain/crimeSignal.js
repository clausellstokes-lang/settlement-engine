/**
 * crimeSignal.js — THE ONE HOME of the crime signal: is there organised crime here, and what
 * shape (lane RUNG1B-F4, 2026-11-04; docs/F4_CRIME_SIGNAL_2026-11-04.md; the chair's principle:
 * one home, derived once after both the power roster and the estate exist, every writer reads it).
 *
 * The signal is two facts on the record and nothing else:
 *   - a criminal FACTION: a power seat whose category is 'criminal' (the roster's own mark);
 *   - a criminal HOUSE: an institution the estate's one criminal detector names
 *     (`corruption.js :: isCriminalInstitution`; it agrees with the Institutions tab's
 *     category mark on all 1,000 soak places).
 * Pure, draw-free and total: an absent roster or estate reads as "none".
 *
 * Read by: `display/defenseDisplay.js :: deriveCriminalStructure` (the structure branch),
 * `generators/npcGenerator.js :: mergeNPCLists` (affiliations, secrets, goals),
 * `generators/historyGenerator.js` (the crime-wave tension).
 */

import { isCriminalInstitution } from './corruption.js';

/**
 * @typedef {object} CrimeSignal
 * @property {boolean} present  a criminal faction or a criminal house exists
 * @property {string[]} factions the criminal factions' names, roster order
 * @property {string[]} houses   the criminal houses' names, estate order
 */

/**
 * @param {{
 *   powerStructure?: { factions?: ReadonlyArray<{ category?: unknown, faction?: unknown, name?: unknown } | null | undefined> } | null,
 *   institutions?: ReadonlyArray<unknown> | null,
 * } | null | undefined} record
 * @returns {CrimeSignal}
 */
export function crimeSignalOf(record) {
  const seats = Array.isArray(record?.powerStructure?.factions) ? record.powerStructure.factions : [];
  const estate = Array.isArray(record?.institutions) ? record.institutions : [];
  const factions = seats
    .filter((seat) => seat?.category === 'criminal')
    .map((seat) => String(seat?.faction ?? seat?.name ?? ''));
  const houses = estate
    .filter((inst) => isCriminalInstitution(/** @type {Parameters<typeof isCriminalInstitution>[0]} */ (inst)))
    .map((inst) => String(/** @type {{ name?: unknown }} */ (inst).name ?? ''));
  return { present: factions.length > 0 || houses.length > 0, factions, houses };
}

/** A thieves' or criminal guild, with or without the article and the apostrophe. */
const CRIMINAL_GUILD = "(?:the )?(?:thieves['’]?|criminal) guild";

/**
 * Whether a goal or secret names a thieves' or criminal guild (F4 unit 3).
 * @param {{ short?: unknown, long?: unknown } | null | undefined} goal
 * @returns {boolean}
 */
export function namesCriminalGuild(goal) {
  return new RegExp(CRIMINAL_GUILD, 'i').test(`${String(goal?.short ?? '')} ${String(goal?.long ?? '')}`);
}

/**
 * The secret pool's own words for a guild that does not exist here, "a powerful outside
 * interest" (the substitution `npcGenerator.js :: mergeNPCLists` already made for "thieves
 * guild"); a payroll reads "on the payroll of a powerful outside interest". Not a string: unchanged.
 * @template T
 * @param {T} text
 * @returns {T}
 */
export function withoutCriminalGuild(text) {
  if (typeof text !== 'string') return text;
  return /** @type {T} */ (/** @type {unknown} */ (text
    .replace(/on (?:the )?thieves['’]? guild payroll/gi, 'on the payroll of a powerful outside interest')
    .replace(new RegExp(CRIMINAL_GUILD, 'gi'), 'a powerful outside interest')));
}
