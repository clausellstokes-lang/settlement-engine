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
 * @typedef {Object} HealingLedger
 * @property {number} healerCount  count of institutions whose name reads as healing-capable
 * @property {string[]} services   availableServices.healing (service names), [] when absent — for Stage 4b
 * @property {boolean} present      true once the settlement carried an institutions array
 */

/**
 * @param {Object} settlement
 * @returns {HealingLedger}
 */
export function healingLedger(settlement) {
  const inst = Array.isArray(settlement?.institutions) ? settlement.institutions : [];
  const healerCount = inst.filter(i => HEALING_INSTITUTION_PATTERN.test(String(i?.name || ''))).length;
  const svc = settlement?.economicState?.availableServices?.healing
           ?? settlement?.availableServices?.healing;
  return {
    healerCount,
    services: Array.isArray(svc) ? svc : [],
    present: Array.isArray(settlement?.institutions),
  };
}
