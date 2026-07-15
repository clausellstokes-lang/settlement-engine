/**
 * mathHelpers.js — tiny leaf of pure numeric utilities.
 *
 * Extracted from helpers.js to BREAK an ESM import cycle: priorityHelpers.js
 * imported `clamp` from helpers.js, while helpers.js re-exports priorityHelpers.js's
 * functions — a 2-module cycle. `clamp` is a pure leaf, so hoisting it here lets
 * priorityHelpers depend DOWNWARD on this leaf instead of back UP into helpers.
 * helpers.js re-exports `clamp` from here, so every existing importer is unaffected.
 */

/** Clamp `val` into [lo, hi]. Verbatim from the former helpers.js definition. */
export const clamp = (val, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, val));
