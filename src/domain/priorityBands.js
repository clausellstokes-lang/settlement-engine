/**
 * priorityBands.js — the five canonical bands read by every priority slider.
 *
 * This leaf owns the thresholds and their reader-facing names. The simulation
 * historically defined the thresholds inside the economy generator while the
 * Compendium repeated their names in prose. Keeping the tiny vocabulary here
 * lets the generator, documentation artifact, and Create surface describe the
 * same setting without pulling generator code into the first-paint bundle.
 *
 * The numeric setting remains available to the user as secondary precision.
 * These bands provide its primary meaning; they do not change, clamp, or
 * otherwise reinterpret the stored value.
 */

export const PRIORITY_BANDS = Object.freeze([
  Object.freeze({ key: 'very_low', label: 'Very Low', max: 15 }),
  Object.freeze({ key: 'low', label: 'Low', max: 35 }),
  Object.freeze({ key: 'medium', label: 'Medium', max: 65 }),
  Object.freeze({ key: 'high', label: 'High', max: 85 }),
  Object.freeze({ key: 'very_high', label: 'Very High', max: Infinity }),
]);

/**
 * Return the canonical engine band for a priority setting.
 *
 * The default and null handling intentionally mirror the former
 * `priorityToCategory` implementation byte-for-byte: omitted and null settings
 * both read as the neutral default of 50.
 *
 * @param {number | null | undefined} priority
 * @returns {'very_low'|'low'|'medium'|'high'|'very_high'}
 */
export function priorityBand(priority = 50) {
  const value = priority ?? 50;
  return /** @type {'very_low'|'low'|'medium'|'high'|'very_high'} */ (
    PRIORITY_BANDS.find((band) => value <= band.max)?.key || 'very_high'
  );
}

/**
 * Human label for a priority setting, derived from the same canonical band.
 *
 * @param {number | null | undefined} priority
 * @returns {string}
 */
export function priorityBandLabel(priority = 50) {
  const key = priorityBand(priority);
  return PRIORITY_BANDS.find((band) => band.key === key)?.label || 'Medium';
}
