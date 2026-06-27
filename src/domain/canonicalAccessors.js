/**
 * domain/canonicalAccessors.js — one place that resolves the settlement's field
 * aliases for the substrate readers.
 *
 * Two concepts are dual-written across the codebase's history:
 *   - Stressors: dual-writes the same array under `stressors` (canonical),
 *     `stress`, and `stresses`; `normalizeSettlement` resolves the top-level aliases
 *     (see settlement.schema.js FIELD_ALIASES), but readers still receive
 *     un-normalized objects (fresh pipeline output, legacy saves, test fixtures).
 *   - Trade goods: the economy writes `economicState.primaryExports` /
 *     `primaryImports`; `exports` / `imports` are legacy aliases. These are NESTED,
 *     so they can't live in the top-level FIELD_ALIASES map — this module is their
 *     canonical resolution point. (Reading the dead `exports` field instead of
 *     `primaryExports` was the capacityModel bug this fixed; centralizing here
 *     stops it recurring.)
 *
 * Resolve each ONCE here so no reader re-derives the fallback chain (and risks
 * reading a dead field). Pure; tolerant of partial/legacy shapes; never throws.
 */

/**
 * The settlement's stressors as an array, regardless of which alias carries them.
 * Tolerates a single stressor stored as a bare object (wraps it) and the rare
 * `{count, items}` wrapper (falls through to the next candidate). Note: the
 * string-type `stressTypes` alias is intentionally NOT included — it holds type
 * strings, not stressor objects, and substrate readers expect objects with
 * type/name/severity.
 *
 * @param {any} settlement
 * @returns {any[]}
 */
export function canonStressors(settlement) {
  const s = settlement || {};
  for (const c of [s.stressors, s.stress, s.stresses]) {
    if (Array.isArray(c)) return c;
  }
  // A single stressor stored as a bare object (legacy fixtures) counts as one.
  if (s.stressors && typeof s.stressors === 'object') return [s.stressors];
  if (s.stress && typeof s.stress === 'object') return [s.stress];
  return [];
}

/**
 * The settlement's exports — canonical `economicState.primaryExports`, falling
 * back to the legacy `exports` alias.
 * @param {any} settlement
 * @returns {any[]}
 */
export function canonExports(settlement) {
  const ec = settlement?.economicState || {};
  if (Array.isArray(ec.primaryExports)) return ec.primaryExports;
  if (Array.isArray(ec.exports)) return ec.exports;
  return [];
}

/**
 * The settlement's imports — canonical `economicState.primaryImports`, falling
 * back to the legacy `imports` alias.
 * @param {any} settlement
 * @returns {any[]}
 */
export function canonImports(settlement) {
  const ec = settlement?.economicState || {};
  if (Array.isArray(ec.primaryImports)) return ec.primaryImports;
  if (Array.isArray(ec.imports)) return ec.imports;
  return [];
}
