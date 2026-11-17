/**
 * domain/facts/rivalRings.js — RIVAL RINGS STAND IN THE TOWN (BAR7-DESKS, LAW 9's `9i.crews` of BRIEF-BAR7 item 6; NEW
 * VOCABULARY, on the owner's veto list). The vocabulary's `rival rings` atom: the rings the criminal structure's KEY reads
 * (`criminalStructureKey.js`, its first arm `rivalRingsHere`): two criminal powers that do not govern, or the roster's
 * "Multiple criminal factions" (`corruption.js :: rivalRingsOf`), AND no one organisation rules the trade (a governing or
 * Dominant criminal seat, or a thieves' guild house). A line that says rival crews are fighting over the streets presumes
 * them; the semi-organised key alone does not (a lone gambling den keys it too).
 *
 * ONE READING, THE KEY'S (the chair's point (4) after the second reader, 2026-11-17): the key's own reading is private to
 * its leaf, so this one reads it THROUGH the key: rings stand and the key is `semi-organized`. Where rings stand and one
 * organisation rules, the key is `organized` (that organisation's seat or its guild house keys it), so the two agree; the
 * seat measured them equal over the 900 towns of its three populations and its guard holds them equal over the thirty.
 *
 * THE KEY IS HANDED IN, NEVER IMPORTED (ruling EG1): `criminalStructureKey.js` is pinned lazy and this leaf rides the eager
 * closure (`tests/architecture/engineCoreLazyEdge.test.js`), so the caller that already reads the key (`factsOf.js ::
 * crime`'s own import) passes it. Its two imports are engine-core and already eager (`corruption.js`; the roster's ruin filter
 * `institutions/institutionRoster.js`, which `lawBand.js` reads too).
 *
 * A HOUSE NOT LIVE IS NO RING (the chair's fifth point, 2026-11-17: `tests/lint/ruinFilterRoster.walker.test.js`): the roster's
 * "Multiple criminal factions" is read off the LIVE roster (`liveInstitutions`). The key itself reads the raw roster, so in a
 * town whose only such house is not live (ruined, removed, destroyed or a remnant) the key may still say `semi-organized` while this atom says no rings: the turf-war
 * line is then refused and its no-rival twin prints. Pure.
 * @enforced-by tests/domain/bar7DesksLines.test.js
 */
import { rivalRingsOf } from '../corruption.js';
import { liveInstitutions } from '../institutions/institutionRoster.js'; // the ruin filter: a house not live keys no ring

/**
 * @param {unknown} record the settlement (or a birth's partial: its powers and its roster)
 * @param {unknown} crimeKey the criminal structure's key for the same record (`criminalStructureKey.js :: criminalStructureKeyOf`)
 * @returns {boolean}
 */
export function rivalRingsStand(record, crimeKey) {
  const r = /** @type {{ powerStructure?: { factions?: ReadonlyArray<{ category?: unknown, isGoverning?: unknown }> } } | null | undefined} */ (record);
  return crimeKey === 'semi-organized' && rivalRingsOf(r?.powerStructure?.factions, liveInstitutions(/** @type {never} */ (record)));
}
