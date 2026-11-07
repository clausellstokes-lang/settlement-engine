/**
 * domain/facts/populationBand.js — THE POPULATION-BAND HOME (CENSUS-1 wave 0, fact 12; the design's
 * §1 row "population band": `OWNER_BANDS` and `TIER_STAMP_CUTS` exist, nothing answers "is this a
 * small place").
 *
 * ONE answer, from the stamp cuts (`data/constants.js :: TIER_STAMP_CUTS`, read through
 * `popToTier`, the cut the tier stamp itself uses):
 *   small     a thorp, hamlet or village
 *   middling  a town
 *   large     a city or a metropolis
 * The population is read first (the band a line speaks of is the people, not the label); a record
 * with no population falls back to its tier. `checks.mjs :: OWNER_BANDS` stays the X-46 check's
 * ROLL bands — a different cut by design (the roll may land a town's population in the overlap).
 *
 * Pure: no randomness, no clock.
 */
import { popToTier } from '../../data/constants.js';

/** @type {Readonly<Record<string, 'small'|'middling'|'large'>>} */
const BAND_OF_TIER = Object.freeze({
  thorp: 'small', hamlet: 'small', village: 'small', town: 'middling', city: 'large', metropolis: 'large',
});

/** The bands, in order. @type {ReadonlyArray<string>} */
export const POPULATION_BANDS = Object.freeze(['small', 'middling', 'large']);

/**
 * THE ONE READER.
 * @param {{ population?: unknown, tier?: unknown } | null | undefined} record a settlement record
 * @returns {'small'|'middling'|'large'|null}
 */
export function populationBandOf(record) {
  const pop = record?.population;
  const tier = typeof pop === 'number' && Number.isFinite(pop) && pop > 0 ? popToTier(pop) : record?.tier;
  return BAND_OF_TIER[/** @type {string} */ (tier)] ?? null;
}
