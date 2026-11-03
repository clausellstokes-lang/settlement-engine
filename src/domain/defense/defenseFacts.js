/**
 * domain/defense/defenseFacts.js — ONE SET OF DEFENCE FACTS (lane DEFENSE, 2026-11-03).
 *
 * What defends this place, whether it has a hospital or only a healer, and how many months
 * of food it holds, answered ONCE. Every sentence or row that mentions a garrison, soldiers,
 * walls, a watch, a hospital, a Guard Captain or a Garrison Commander asks this first; a
 * sentence whose thing is absent names what IS there (militia, watch, palisade, an
 * adventurers' hall) or says nothing.
 *
 * ⭐ IT READS THE ENGINE'S OWN ROSTER, NEVER A WORD IN A SENTENCE. The force half is
 * `standingDefenseForces` (the live, ruin-filtered partition `generateDefenseProfile` files
 * from); the generation-time snapshot `defenseProfile.institutions` is not read, because a
 * ruined citadel stays in it forever. The months of food are the engine's own figure,
 * `economicState.foodSecurity.storageMonths` (`foodGenerator.js :: generateFoodSecurity`),
 * never a building-name test for a granary.
 *
 * ⚠ ONE ADDITION TO THE BUCKETS, stated. The healer half is new: the old `hasHospital` flag
 * (`priorityHelpers.js :: getInstitutionNames`) is true for a 1st-level healer or a
 * monastery, so the word "hospital" was printed over both. Here `hasHospital` is a real
 * hospital and `hasHealer` is a healer, an infirmary or a monastic house.
 *
 * ⚠ AND ONE GAP LEFT AS THE ENGINE HAS IT, on purpose. The thorp militia row is named
 * `Household levy`, which the bucket vocabulary (`militia`) does not match, so the engine's
 * scores and the defence desk both read a levy thorp as having no force. Reading the levy
 * here alone would make this answer disagree with the desk beside it; the cure is the
 * vocabulary itself (a generation-time change, requested of the chair), not a second answer.
 *
 * Pure: no randomness, no clock, no generator import.
 */

import { nativeSemanticName } from '../content/customContentSemanticAuthority.js';
import { standingDefenseForces } from '../institutions/defenseInstitutionBuckets.js';
import { liveInstitutions } from '../institutions/institutionRoster.js';

/**
 * @typedef {object} DefenseFacts
 * @property {boolean} hasWalls any standing enclosure: stone walls, a citadel, a palisade or earthworks
 * @property {'stone'|'palisade'|null} wallKind `stone` when any enclosure is masonry, `palisade` when the only one is timber or earth
 * @property {boolean} hasPalisade the place's enclosure is a palisade or earthwork and nothing stronger
 * @property {boolean} hasGarrison a garrison, barracks or professional guard stands
 * @property {boolean} hasWatch a town or city watch stands
 * @property {boolean} hasMilitia a citizen militia stands
 * @property {boolean} hasMercenary a mercenary company or free company stands
 * @property {boolean} hasCharter an adventurers' charter hall or guild stands
 * @property {string|null} forceName the roster name of the force that holds the place (garrison, then watch, militia, hired company, charter hall), or null
 * @property {ReadonlyArray<string>} defenceNames the roster names of every standing defence the defence purse pays for (enclosures and forces)
 * @property {boolean} hasHospital a real hospital stands
 * @property {boolean} hasHealer a healer, an infirmary or a monastic house tends the sick
 * @property {string|null} healerName the roster name of the healer, infirmary or monastic house, or null
 * @property {number|null} storedFoodMonths the engine's months of stored food, or null when the record carries none
 */

/** @param {unknown} inst @returns {string} */
const nameOf = (inst) => String(nativeSemanticName(inst) || '');

/** @param {ReadonlyArray<string>} names @param {RegExp} re @returns {string|null} */
const firstMatching = (names, re) => names.find((n) => re.test(n)) ?? null;

const HOSPITAL_RE = /\bhospital/i;
const HEALER_RE = /\bhealer\b|\binfirmar|\bmonaster|\bfriary\b/i;
const TIMBER_ENCLOSURE_RE = /palisade|earthwork/i;

/**
 * THE ONE ANSWER to "what defends this place, who tends its sick, how long can it eat".
 *
 * @param {{ institutions?: unknown, economicState?: unknown } | null | undefined} settlement
 * @returns {Readonly<DefenseFacts>}
 */
export function defenseFactsOf(settlement) {
  const forces = standingDefenseForces(settlement);
  const roster = liveInstitutions(settlement).map(nameOf).filter(Boolean);

  const wallNames = forces.walls.names;
  const stone = wallNames.some((n) => !TIMBER_ENCLOSURE_RE.test(n));
  const hasWalls = wallNames.length > 0;
  const wallKind = hasWalls ? (stone ? 'stone' : 'palisade') : null;

  const forceName = forces.garrison.names[0]
    ?? forces.watch.names[0]
    ?? forces.militia.names[0]
    ?? forces.mercenary.names[0]
    ?? forces.charter.names[0]
    ?? null;
  const defenceNames = [...new Set([
    ...wallNames,
    ...forces.garrison.names,
    ...forces.watch.names,
    ...forces.militia.names,
    ...forces.mercenary.names,
    ...forces.charter.names,
  ])];

  const healerName = firstMatching(roster, HEALER_RE);
  const economicState = /** @type {{ foodSecurity?: { storageMonths?: unknown } } | null | undefined} */ (
    settlement?.economicState
  );
  const months = economicState?.foodSecurity?.storageMonths;

  return Object.freeze({
    hasWalls,
    wallKind,
    hasPalisade: wallKind === 'palisade',
    hasGarrison: forces.garrison.present,
    hasWatch: forces.watch.present,
    hasMilitia: forces.militia.present,
    hasMercenary: forces.mercenary.present,
    hasCharter: forces.charter.present,
    forceName,
    defenceNames: Object.freeze(defenceNames),
    hasHospital: roster.some((n) => HOSPITAL_RE.test(n)),
    hasHealer: healerName !== null,
    healerName,
    storedFoodMonths: typeof months === 'number' && Number.isFinite(months) ? months : null,
  });
}
