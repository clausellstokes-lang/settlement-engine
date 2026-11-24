/**
 * domain/facts/sickCare.js — SICK CARE AT HAND, ONE READING (R24-A1, CLOSE-7; the chair's RULING-R24 and its ruling R24a
 * of 2026-11-24, vetoable by the owner; the atom `sick care`, new vocabulary for a fact the record already holds).
 *
 * Three readings of "is there someone here who tends the sick" disagreed: a house by its NAME (the defence home's
 * `hospital` and `healer`, the atom `sick house`), a service by its CATEGORY (`availableServices.healing`, which files
 * every rite, burial and bath beside the care), and the capacity's count (`healingLedger.healerCount`). A daily-life line
 * said "there is no healer to send for" where Services printed "Healing · Priest (resident)" (READ-24: 13 of the census
 * 900, 26 of the visitor 900, beside any of the five no-healer lines).
 *
 * THE ONE FACT: a sick house by name, OR a RESIDENT service that tends the sick or injured. Resident: the service's house
 * is on the live roster (`liveInstitutions`: a ruin is none) and is not an "Access to" row (`ACCESS_ONLY`: a neighbour's
 * house). Which services tend the sick is DATA: the flag `tendsSick` on the service's own catalogue row
 * (`data/institutionServices.js`, the chair's 25 names), read here as the set of flagged names the rows give
 * (`TENDS_SICK_SERVICE_NAMES`; every row of a flagged name is flagged, the lint arm of `tests/domain/close7SickCare.test.js`).
 *
 * NOT this home (the chair's, for a later unit): the capacity's `healerCount`, which counts an apothecary and not a
 * priest or a midwife.
 *
 * Pure: no randomness, no clock, no write.
 */
import { TENDS_SICK_SERVICE_NAMES } from '../../data/institutionServices.js';
import { defenceOf } from './defence.js';
import { ACCESS_ONLY } from './liveInstitutionNames.js';
import { liveInstitutions } from '../institutions/institutionRoster.js';

/** @typedef {{ institutions?: unknown, availableServices?: unknown } | null | undefined} SickCareRecord */

/**
 * THE RESIDENT SERVICES THAT TEND THE SICK: every drawn service (all buckets, as the record keeps them) whose name a
 * flagged catalogue row carries and whose house stands on the live roster, never an "Access to" row.
 * @param {SickCareRecord} record
 * @returns {Array<{ name: string, institution: string }>}
 */
export function residentSickCareOf(record) {
  const live = new Set(liveInstitutions(/** @type {Parameters<typeof liveInstitutions>[0]} */ (/** @type {unknown} */ (record)))
    .map((i) => String(/** @type {{ name?: unknown } | null} */ (i)?.name ?? '')).filter((n) => n && !ACCESS_ONLY.test(n)));
  const drawn = /** @type {{ availableServices?: unknown }} */ (record ?? {})?.availableServices;
  const rows = drawn && typeof drawn === 'object' ? Object.values(drawn).flat() : [];
  /** @type {Array<{ name: string, institution: string }>} */
  const out = [];
  for (const row of rows) {
    const sv = /** @type {{ name?: unknown, institution?: unknown } | null} */ (row);
    const name = typeof sv?.name === 'string' ? sv.name : '';
    const institution = String(sv?.institution ?? '');
    if (name && TENDS_SICK_SERVICE_NAMES.has(name) && live.has(institution)) out.push({ name, institution });
  }
  return out;
}

/**
 * SICK CARE AT HAND: a sick house by name (the defence home's `hospital` or `healer`), or a resident service that tends
 * the sick. Both arms are read every time (the layer walker traces what the leaf touches).
 * @param {SickCareRecord} record
 * @returns {boolean}
 */
export function sickCareOf(record) {
  const services = residentSickCareOf(record).length > 0;
  const d = defenceOf(/** @type {Parameters<typeof defenceOf>[0]} */ (record));
  return d.hospital === true || d.healer === true || services;
}
