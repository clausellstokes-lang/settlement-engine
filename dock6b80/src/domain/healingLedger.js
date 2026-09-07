/**
 * domain/healingLedger.js — the canonical conserved healing-supply quantity for a settlement.
 *
 * P3.3b Stage 4. The healing classifier — the regex over institution names that decides what
 * counts as a healing-capable institution — was COPY-PASTED, byte-identical, in three places:
 * capacityModel.deriveHealing, causalState.deriveHealingCapacity, and magicProfile. Any change to
 * "what counts as healing" had to be edited in all three. This is the single home for that
 * classifier and the healer count derived from it.
 *
 * It also surfaces the already-emitted (but currently unread by any deriver) availableServices.healing
 * service list, so a later stage (4b) can anchor the healing signal to the richer service data after
 * a balance pass — deriveHealingCapacity feeds disease pressure (pressureModel), so changing the
 * signal basis is balance-sensitive and is intentionally NOT done here.
 *
 * Pure; defensive. `healerCount` is always meaningful (0 == no healing institutions, itself a signal),
 * so unlike the other ledgers there is no present-gate on the count.
 */

import { liveInstitutions } from './institutions/institutionRoster.js';
import { nativeSemanticName } from './content/customContentSemanticAuthority.js';

/**
 * Canonical healing-institution classifier. Single source of truth for "what name reads as a
 * healing-capable institution" across every healing lens.
 *
 * Must cover the institutionalCatalog medical vocabulary: 'Small hospital' / 'Major hospital' /
 * 'Hospital network' ('hospital' is not a substring of 'hospice'), 'Almshouse', and the monastic
 * houses ('monaster' is the shared stem of 'Monastery or friary', 'Multiple monasteries', and
 * 'Major monasteries (5-10)').
 */
export const HEALING_INSTITUTION_PATTERN =
  /(temple|chapel|infirmary|healer|hospice|herbalist|apothecary|shrine|hospital|monaster|almshouse)/i;

/**
 * The BURIAL houses, whose whole menu is interment. `serviceCategoryTables.js` files them
 * under `healing` — deliberately, and correctly, because that table answers "what DOMAIN does
 * this house belong to" and the estate has settled that the whole religious block answers
 * healing (ODQ §708.5; the note at that table records that without those rows the fallback
 * scattered burial services into `equipment` and `information`).
 *
 * ⚠ BUT DOMAIN IS NOT CAPACITY, and conflating them broke a scoring branch. The tier ladder
 * gained a burial house at EVERY tier, every burial menu lands in `availableServices.healing`,
 * and both healing derivers rescued the harsh "no healing" penalty on a NON-EMPTY BUCKET — so
 * the rescue became near-universal and the penalty became UNREACHABLE. MEASURED over 1,680
 * real settlements (6 tiers × 8 cultures × 7 terrains × 5 routes): the absent branch fired
 * 0 times, and 24 settlements — all thorps — reached the rescue on burial services ALONE.
 * A graveyard is where care FAILED; it is not informal care (§782.4 E-RES-11, cured in T7).
 *
 * The five names are the catalog's own burial ladder; the stems are chosen so a sixth burial
 * house cannot slip past, and `tests/domain/healingCareServices.test.js` asserts the pattern
 * covers exactly those five and no care house.
 */
export const BURIAL_INSTITUTION_PATTERN = /(graveyard|burial|cemeter|charnel|ossuar)/i;

/**
 * @typedef {Object} HealingLedger
 * @property {Array<string|{name?: string, institution?: string}>} services
 *   availableServices.healing — the RAW bucket, exactly as the generator emitted it. Entries
 *   are `{ name, desc, institution }` objects in current output (the earlier `string[]`
 *   annotation here was wrong and is corrected); older records may carry bare strings.
 * @property {Array<string|{name?: string, institution?: string}>} careServices
 *   `services` minus every entry offered by a BURIAL house. This is what "informal care
 *   exists" means, and it is what the two healing derivers key their rescue on.
 * @property {number} healerCount  count of institutions whose name reads as healing-capable
 * @property {boolean} present      true once the settlement carried an institutions array
 */

/** The institution behind a service entry, for either entry shape.
 *  @param {unknown} entry @returns {string} */
function institutionOf(entry) {
  if (typeof entry === 'string') return entry;
  if (entry && typeof entry === 'object') {
    const record = /** @type {Record<string, unknown>} */ (entry);
    return typeof record.institution === 'string' ? record.institution : '';
  }
  return '';
}

/**
 * @typedef {Object} HealingSettlementView
 * @property {Array<{name?: string}>} [institutions]
 * @property {{availableServices?: {healing?: string[]}}} [economicState]
 * @property {{healing?: string[]}} [availableServices]
 */

/**
 * @param {HealingSettlementView} [settlement]
 * @returns {HealingLedger}
 */
export function healingLedger(settlement) {
  // LIVE roster only — a calamity-ruined temple/hospital/infirmary is not a live healer
  // (ruin-filter class). `present` below still reads the raw roster (existence, not liveness).
  const inst = liveInstitutions(settlement);
  const healerCount = inst
    .map(nativeSemanticName)
    .filter(name => name && HEALING_INSTITUTION_PATTERN.test(name))
    .length;
  const svc = settlement?.economicState?.availableServices?.healing
           ?? settlement?.availableServices?.healing;
  const services = Array.isArray(svc) ? svc : [];
  // An entry whose offering house we cannot read stays IN — an unreadable provenance is
  // missing information, not proof of a graveyard.
  const careServices = services.filter((entry) => {
    const house = institutionOf(entry);
    return !house || !BURIAL_INSTITUTION_PATTERN.test(house);
  });
  return {
    healerCount,
    services,
    careServices,
    present: Array.isArray(settlement?.institutions),
  };
}
