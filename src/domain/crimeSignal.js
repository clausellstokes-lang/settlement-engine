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
 * @property {string[]} powerNames the criminal powers' names, roster order (TAIL-CLOSE-SRC-4: the field says what it holds; it was `factions`, the legacy NPC grouping's name)
 * @property {string[]} houses   the criminal houses' names, estate order @property {boolean} seated a criminal power holds a seat on the roster (TAIL-CLOSE-SRC-2: the safety profile's roster lines ask it; one line, so no cited line moves)
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
  const powerNames = seats
    .filter((seat) => seat?.category === 'criminal')
    .map((seat) => String(seat?.faction ?? seat?.name ?? ''));
  const houses = estate
    .filter((inst) => isCriminalInstitution(/** @type {Parameters<typeof isCriminalInstitution>[0]} */ (inst)))
    .map((inst) => String(/** @type {{ name?: unknown }} */ (inst).name ?? ''));
  return { present: powerNames.length > 0 || houses.length > 0, powerNames, houses, seated: powerNames.length > 0 };
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
 * Whether the town's crime includes a thieves' or criminal guild: the roster's crime faction, its criminal powers or its
 * criminal houses, by name (TAIL-CLOSE-SRC-4: the one reading `withTownsOwnUnderworld` and `npcGenerator.js ::
 * mergeNPCLists`'s `noThievesGuild` each spelled; `/thie/ || namesCriminalGuild` is the latter's `/thie|criminal guild/i`).
 * @param {CrimeSignal | null | undefined} signal the town's crime signal (`crimeSignalOf`)
 * @param {unknown} [crimeFaction] the roster's crime faction by name
 * @returns {boolean}
 */
export function crimeHasThievesGuild(signal, crimeFaction = null) {
  const named = [crimeFaction, ...(signal?.powerNames || []), ...(signal?.houses || [])];
  return named.some((n) => /thie/i.test(String(n || '')) || namesCriminalGuild({ short: n }));
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
  if (crimeHasThievesGuild(signal, crimeFaction)) return text; // the criminal guild by its own reader (TAIL-CLOSE-SRC-3, -4)
  if (!crimeFaction && !signal?.present) return withoutCriminalGuild(text);
  return /** @type {T} */ (/** @type {unknown} */ (text
    .replace(/on (?:the )?thieves['’]? guild payroll/gi, 'on the payroll of the local underworld')
    .replace(new RegExp(CRIMINAL_GUILD, 'gi'), 'the local underworld')));
}

/**
 * How many gang houses the roster holds, the catalogue's several-gangs row counting two (TAIL-CLOSE-SRC-3: moved verbatim
 * from `generators/safetyLineTruth.js :: GANG_HOUSES_OF`, UPKEEP-8, into the crime home; the safety lines and the
 * priority flags read it here). A roster row or a bare name.
 * @param {ReadonlyArray<unknown> | null | undefined} institutions @returns {number}
 */
export function gangHousesOf(institutions) {
  let n = 0;
  for (const i of institutions || []) {
    const name = String(typeof i === 'string' ? i : /** @type {{ name?: unknown }} */ (i)?.name || '').toLowerCase();
    n += name.includes('multiple criminal') ? 2 : name.includes('street gang') ? 1 : 0;
  }
  return n;
}

/**
 * Whether a criminal power governs: a seat whose category is 'criminal' (the signal's own mark) holds the governing seat
 * (TAIL-CLOSE-SRC-3: the safety profile's criminal-governance line, `safetyLineTruth.js :: settleRosterCrimeLines`).
 * @param {unknown} seats the roster's seats @returns {boolean}
 */
export function criminalSeatGoverns(seats) {
  return (Array.isArray(seats) ? seats : []).some((seat) => seat?.category === 'criminal' && seat?.isGoverning === true);
}

/**
 * Whether a criminal house's name is a smuggling house (TAIL-DEFECON-2, B05884: a front business is not one).
 * TAIL-CLOSE-SRC-3: moved verbatim from `economy/economicState.js`'s criminal-revenue label into the crime home.
 * @param {string} name @returns {boolean}
 */
export function namesSmugglingHouse(name) {
  return name.toLowerCase().includes('smuggl');
}

/**
 * Whether a power is a criminal one by its seat's mark, or a thieves' power by its name (TAIL-CLOSE-SRC-4: moved verbatim
 * from `power/stressFactions.js`'s wartime trade line, TAIL-POWERS-B-4 P31 (6), into the crime home).
 * @param {{ category?: unknown, faction: string }} seat a roster seat @returns {boolean}
 */
export function isCriminalOrThievesPower(seat) {
  return seat.category === 'criminal' || seat.faction.toLowerCase().includes('thieves');
}

/**
 * The roster's crime faction by name: the first seat whose category is 'criminal', or whose name is a thieves', criminal,
 * smuggling or underworld power (TAIL-CLOSE-SRC-4: moved verbatim from `generators/people/castPowers.js`'s cast of the
 * powers into the crime home). Null where none.
 * @param {ReadonlyArray<{ category?: unknown, faction?: string } | null | undefined>} seats the roster's seats
 * @returns {string | null}
 */
export function crimeFactionNameOf(seats) {
  return seats.find((f) => f?.category === 'criminal' || /thieve|criminal|smuggl|underworld/i.test(String(f?.faction || '')))?.faction || null;
}

/**
 * The safety profile's crime-type LABEL for a criminal power that has filled the vacuum of civil authority: written by
 * `generators/safetyProfile.js` (its `crimeTypes` row) and compared by `generators/safetyLineTruth.js ::
 * settleRosterCrimeLines` (TAIL-CLOSE-SRC-4, the chair's SR3 (c): the label has one home). It lives in the crime home,
 * which both already import, and not in the writer: the writer imports the reader's module, so a writer-held constant
 * would close a new dependency cycle (`tests/architecture/layerBoundaries.test.js`, shrink-only).
 */
export const CRIMINAL_GOVERNANCE_TYPE = 'Criminal governance';

/**
 * The criminal powers that do not govern: each seat whose category is 'criminal' (the signal's own mark) and that does
 * not hold the governing seat (TAIL-CLOSE-SRC-4: moved verbatim from `display/defenseDisplay.js ::
 * headedPowerAmongRivals`, V8, into the crime home).
 * @template {{ category?: unknown, isGoverning?: unknown } | null | undefined} T
 * @param {ReadonlyArray<T>} seats the roster's seats @returns {T[]}
 */
export function criminalSeatsNotGoverning(seats) {
  return seats.filter((f) => f?.category === 'criminal' && f?.isGoverning !== true);
}
