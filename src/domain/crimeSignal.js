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
 * `generators/historyGenerator.js` (the crime-wave tension), and the safety profile's crime
 * lines at assembly (`generators/safetyProfile.js :: settleCrimeLinesToSignal`).
 */

import { isCriminalInstitution } from './corruption.js';

/**
 * @typedef {object} CrimeSignal
 * @property {boolean} present  a criminal faction or a criminal house exists
 * @property {string[]} factions the criminal factions' names, roster order
 * @property {string[]} houses   the criminal houses' names, estate order
 */

/**
 * The caller hands over the two lists it already holds (the roster's seats, the estate), so this
 * module reads no settlement shape of its own.
 * @param {{
 *   seats?: ReadonlyArray<{ category?: unknown, faction?: unknown, name?: unknown } | null | undefined> | null,
 *   estate?: ReadonlyArray<unknown> | null,
 * } | null | undefined} lists
 * @returns {CrimeSignal}
 */
export function crimeSignalOf(lists) {
  const seats = Array.isArray(lists?.seats) ? lists.seats : [];
  const estate = Array.isArray(lists?.estate) ? lists.estate : [];
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

/**
 * A minted face's secret (COHERENCE-POWERS-7, the brief's leftover 1; R2-CODE-A item 7's rule, given its home
 * here beside F4's): a thieves' or criminal guild the town does not have is never named. With no crime at all,
 * F4's "a powerful outside interest" (`withoutCriminalGuild`); where crime stands without such a guild, "the
 * local underworld". A criminal power's NAME is never written in: a power can be hidden by hand, and a name a
 * user can hide is never written into a stored, composed sentence (the law of record 331). A town whose crime
 * faction, criminal powers or criminal houses include a thieves' or criminal guild keeps the line. Draw-free.
 * @template T
 * @param {T} text
 * @param {CrimeSignal | null | undefined} signal the town's crime signal (`crimeSignalOf`)
 * @param {string | null} [crimeFaction] the roster's crime faction by name, as `mergeNPCLists` reads it
 * @returns {T}
 */
export function withTownsOwnUnderworld(text, signal, crimeFaction = null) {
  if (typeof text !== 'string' || !new RegExp(CRIMINAL_GUILD, 'i').test(text)) return text;
  const named = [crimeFaction, ...(signal?.factions || []), ...(signal?.houses || [])];
  if (named.some((n) => /thie|criminal guild/i.test(String(n || '')))) return text;
  if (!crimeFaction && !signal?.present) return withoutCriminalGuild(text);
  return /** @type {T} */ (/** @type {unknown} */ (text
    .replace(/on (?:the )?thieves['’]? guild payroll/gi, 'on the payroll of the local underworld')
    .replace(new RegExp(CRIMINAL_GUILD, 'gi'), 'the local underworld')));
}
