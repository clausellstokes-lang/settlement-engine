/**
 * domain/facts/defence.js — THE DEFENCE-PRESENCE HOME (CENSUS-1 wave 0, fact 3; the design's §1
 * rows walls / gate / garrison / watch / militia / hospital, Appendix A competing readings 1, 2, 4).
 *
 * The facts are `defense/defenseFacts.js :: defenseFactsOf`'s, which already reads the LIVE
 * roster (ruined rows filtered) through the force buckets. This module names them as the
 * census's atoms, one meaning each, so a prose consumer that used `priorityHelpers ::
 * getInstitutionNames` (the raw roster, substring flags) reads them here instead:
 *
 *   walls    — a perimeter wall or palisade stands (a building's own walls declare nothing:
 *              the chair's ruling 3, F11's enclosure rule)
 *   gate     — a gate on a wall: stone walls, or a roster row that names a gate. A palisade has
 *              no gate unless the roster says so.
 *   watch    — a watch institution. A militia is its own fact; "watch or militia" is two atoms.
 *   militia  — a militia institution
 *   garrison — a standing garrison (soldiers and a commander)
 *   hospital — a hospital. A healer, a monastery or a friary is not one (`healer` is its own).
 *   mercenary — a hired company (for the composite `guardPresence`, `factsOf.js`)
 *   commander — a garrison stands, so someone commands one (`hasCommander`; CENSUS-1c, R-E)
 *   court    — a court sits: a courthouse, or a town or city hall a magistrate hears cases in
 *              (`hasCourt`; COHERENCE-AGREE, 2026-11-12)
 *   prison   — somewhere to hold the guilty: a prison, the stocks, a gaol or a jail (`hasPrison`;
 *              COHERENCE-AGREE-4, 2026-11-12). A court and a prison are two facts.
 *
 * Pure: no randomness, no clock.
 */
import { defenseFactsOf } from '../defense/defenseFacts.js';

/**
 * @typedef {object} DefenceFacts
 * @property {boolean} walls @property {'stone'|'palisade'|null} wallKind @property {boolean} palisade
 * @property {boolean} gate @property {boolean} watch @property {boolean} militia
 * @property {boolean} garrison @property {boolean} hospital @property {boolean} healer @property {boolean} mercenary @property {boolean} commander @property {boolean} court
 * @property {boolean} prison
 */

/**
 * THE ONE READER of the defence-presence atoms.
 * @param {{ institutions?: unknown } | null | undefined} record a settlement, or any record that carries its roster
 * @returns {Readonly<DefenceFacts>}
 */
export function defenceOf(record) {
  const d = defenseFactsOf(/** @type {Parameters<typeof defenseFactsOf>[0]} */ (record));
  return Object.freeze({
    walls: d.hasWalls,
    wallKind: /** @type {'stone'|'palisade'|null} */ (d.wallKind ?? null),
    palisade: d.hasPalisade,
    gate: d.hasGate,
    watch: d.hasWatch,
    militia: d.hasMilitia,
    garrison: d.hasGarrison,
    hospital: d.hasHospital,
    healer: d.hasHealer,
    mercenary: d.hasMercenary,
    commander: d.hasCommander,
    court: d.hasCourt,
    prison: d.hasPrison,
  });
}
