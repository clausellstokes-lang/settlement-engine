/**
 * Deterministic display transfer shared by CPU rasterizers.
 *
 * The hand-authored 17-sample curve replaces a platform `pow`/gamma operation.
 * Linear interpolation keeps output host-independent and preserves the original
 * architecture-plate byte contract.
 */

/** @type {ReadonlyArray<number>} */
export const TONE_LUT = Object.freeze([
  0, 10, 26, 46, 68, 90, 112, 132, 151,
  168, 184, 198, 211, 222, 232, 244, 255,
]);

/**
 * @param {number} value
 * @returns {number}
 */
export function tone(value) {
  const clamped = value < 0 ? 0 : value > 1 ? 1 : value;
  const position = clamped * (TONE_LUT.length - 1);
  const lowerIndex = Math.floor(position);
  if (lowerIndex >= TONE_LUT.length - 1) {
    return TONE_LUT[TONE_LUT.length - 1];
  }
  const fraction = position - lowerIndex;
  const lower = TONE_LUT[lowerIndex];
  const upper = TONE_LUT[lowerIndex + 1];
  return Math.round(lower + (upper - lower) * fraction);
}
