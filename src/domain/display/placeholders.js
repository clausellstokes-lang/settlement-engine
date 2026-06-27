/**
 * domain/display/placeholders.js
 *
 * Display-boundary value hygiene (feature doc §1g). Raw simulation state is
 * left untouched; these helpers run only where the canonical display model
 * shapes a field, so renderers never receive `undefined` / `null` / `NaN`,
 * empty strings, or dangling-separator artifacts ("FOUNDED ,").
 *
 * Pure and dependency-free.
 */

const BAD_TOKENS = new Set(['undefined', 'null', 'nan']);

/**
 * Clean a display string. Returns `fallback` for null/empty/garbage values.
 * Strips dangling commas/separators and collapses runs of whitespace.
 * @param {any} value
 * @param {any} [fallback]
 */
export function cleanText(value, fallback = null) {
  if (value == null) return fallback;
  let s = String(value);
  if (BAD_TOKENS.has(s.trim().toLowerCase())) return fallback;
  s = s
    .replace(/\s+/g, ' ')
    .replace(/\s*,\s*,\s*/g, ', ')   // collapse ", ," → ", "
    .replace(/^[\s,;:·]+/, '')        // strip leading separators (not "-": keep names/negatives)
    .replace(/[\s,;:·]+$/, '')        // strip trailing separators ("FOUNDED ," → "FOUNDED")
    .trim();
  return s === '' ? fallback : s;
}

/**
 * Coerce to a finite number, else `fallback`. Note: 0 is a valid result.
 * @param {any} value
 * @param {any} [fallback]
 */
export function cleanNum(value, fallback = null) {
  if (value == null || value === '') return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

/**
 * Join parts with a separator, dropping empties; never a dangling separator.
 * @param {any} parts
 * @param {string} [sep]
 */
export function joinClean(parts, sep = ' · ') {
  return (Array.isArray(parts) ? parts : [parts])
    .map((p) => cleanText(p))
    .filter(Boolean)
    .join(sep);
}
