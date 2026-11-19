/**
 * domain/facts/timberAtHand.js — THE TIMBER HOME: HOW TIMBER REACHES THE TOWN'S SAWYERS (BAR4-HOUSES, kind H1 (ii), and
 * BAR4-SCENES, kind A1, 2026-11-16; BRIEF-BAR4 amendment 5b: atoms added beside their family, `iron at hand`; vetoable by
 * the owner, on the veto list as new vocabulary).
 *
 * ONE ATOM, ONE HOME (BAR4-SCENES-2, the chair's ruling of 2026-11-16 12:16 UTC). Two seats named an atom `timber at hand`
 * and read it two ways (the Timber & Lumber chain working its input; a timber ground or a timber import). It survives
 * once, and the reading has one home: BAR4-RECORD's `houseInputAtHand.js`, the same reader the gap's writer and the page's
 * gap line read ("No timber reaches the saws."), asked of the two timber chains:
 *
 *   timberInputOf(record)           how timber reaches the town: 'local' (a live timber ground, its own production, a
 *                                   house of the roster that makes it), 'imported' (the imports name timber by its own
 *                                   name), else 'missing' (the timber chains take no route: their input comes by none).
 *   timberAtHandOf(record)          `timber at hand`: the town works timber of its own (`local`). A house that supplies
 *                                   "the region's building work" from "timber to hand" presumes it (REVIEW-BAR-4 C40862,
 *                                   bar0-town-occupied-rand-22: a managed woodland the Resources tab calls depleted,
 *                                   timber among the imports).
 *   timberReachesSawmillOf(record)  `timber reaches the saws`: either kind (`local` or `imported`). "The smell of sawn
 *                                   timber is everywhere" presumes it (REVIEW-BAR-4 C45961, bar0-village-famine-rand-21:
 *                                   no timber ground, none brought in, the sawmill's own gap).
 *
 * The chain table is the lazy goods surface, which a fact never imports (WEAVE ST-2): the two timber chains' raw input is
 * handed to the reader as the chain table names it (`resourceChains.js :: RESOURCE_CHAINS.timber.rawResource` and
 * `.mountainTimber.rawResource`), and the guard pins the two names to the table.
 *
 * Layer 2 (over the economy, the resources and the roster). Pure: no randomness, no clock, no write.
 *
 * @enforced-by tests/generators/bar4HousesPresumptions.test.js
 * @enforced-by tests/generators/bar4ScenePresumption.test.js
 */
import { houseInputAtHand } from './houseInputAtHand.js';

/** The two timber chains, as the chain table keys them, with their raw input as it names it. */
export const TIMBER_CHAINS = Object.freeze([
  Object.freeze(['timber', Object.freeze({ rawResource: 'timber' })]),
  Object.freeze(['mountainTimber', Object.freeze({ rawResource: 'mountain_timber' })]),
]);

/**
 * How timber reaches the town, by the one reader.
 * @param {unknown} record the settlement record
 * @returns {'local' | 'imported' | 'route' | 'missing' | undefined} undefined where there is no record or no economy
 */
export function timberInputOf(record) {
  if (!record || typeof record !== 'object') return undefined;
  if (!(/** @type {{ economicState?: unknown }} */ (record).economicState)) return undefined;
  const kinds = TIMBER_CHAINS.map(([key, chain]) => houseInputAtHand(/** @type {Parameters<typeof houseInputAtHand>[0]} */ (record), /** @type {string} */ (key), null, /** @type {Parameters<typeof houseInputAtHand>[3]} */ (chain)));
  for (const kind of /** @type {const} */ (['local', 'imported', 'route'])) if (kinds.includes(kind)) return kind;
  return 'missing';
}

/**
 * THE ONE READER of `timber at hand`: the town works timber of its own.
 * @param {unknown} record the settlement record
 * @returns {boolean | undefined}
 */
export function timberAtHandOf(record) {
  const kind = timberInputOf(record);
  return kind === undefined ? undefined : kind === 'local';
}

/**
 * THE ONE READER of `timber reaches the saws`: timber reaches the town's sawyers, by either kind.
 * @param {unknown} record the settlement record
 * @returns {boolean | undefined}
 */
export function timberReachesSawmillOf(record) {
  const kind = timberInputOf(record);
  return kind === undefined ? undefined : kind !== 'missing';
}
