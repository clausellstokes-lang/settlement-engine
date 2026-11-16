/**
 * domain/display/stateProse/magicFlagTruth.js — WHETHER THE MILITARISED-MAGIC FLAG LINE IS TRUE ON THE PAGE (BAR6-DEFDESK,
 * LAW 9's `9e.military`; vetoable by the owner). A leaf beside the defence desk (`defenseStateProse.js`, at its line
 * ceiling): DS-DEF-9's `FLAG: magicMilitarized` says "the arcane houses answer to the soldiers", and the flag is drawn at
 * the economy step without the houses' own backing (`priorityHelpers.js :: getStressFlags`). Read at print; the stored
 * flag is not touched.
 *
 * Pure: no randomness, no clock, no write.
 *
 * @enforced-by tests/domain/bar6DefDeskGuards.test.js
 */
import { houseBacksOf } from '../../dossier/powerSupport.js';
import { partitionDefenseInstitutions } from '../../institutions/defenseInstitutionBuckets.js';
import { liveInstitutions } from '../../institutions/institutionRoster.js';

/** @param {unknown} v @returns {string} */
const text = (v) => (typeof v === 'string' ? v.trim() : '');

/**
 * BAR6-DEFDESK (LAW 9's `9e.military`; vetoable by the owner): do the town's arcane houses (the houses of magic among the defences)
 * each back some power, and none of them a military one, as the Institutions tab's "Backs" lines print it? Then the
 * militarised flag's "the arcane houses answer to them" is false on the page (C62573, C164227). False with no arcane house,
 * or with one that backs nothing.
 * @param {unknown} settlement @returns {boolean}
 */
export function arcaneHousesBackNoForce(settlement) {
  const s = /** @type {{ institutions?: unknown, powerStructure?: { factions?: unknown } | null } | null} */ (settlement);
  // the houses of magic among the defences, the live roster's own bucket (`defenseInstitutionBuckets.js`: the home `magicAmongDefences` reads)
  const houses = /** @type {Array<{ name?: unknown }>} */ (partitionDefenseInstitutions(liveInstitutions(/** @type {never} */ (settlement))).magicDef || []);
  if (!houses.length) return false;
  const factions = Array.isArray(s?.powerStructure?.factions) ? s.powerStructure.factions : [];
  const categoryOf = new Map(factions.map((f) => [text(f?.faction || f?.name), text(f?.category)]));
  const backs = houseBacksOf(/** @type {never} */ (settlement));
  return houses.every((h) => {
    const list = backs.get(text(h?.name)) || [];
    return list.length > 0 && list.every((b) => categoryOf.get(b.faction) !== 'military');
  });
}
