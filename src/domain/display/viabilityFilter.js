/**
 * display/viabilityFilter.js — the curated Viability-surface exclusion, shared by
 * the web ViabilityTab and the PDF viabilitySlice (viewModel.js) so the two
 * artifacts route each engine issue/warning to ONE home and cannot drift. [pdf-6]
 *
 * Dependency / resource-chain / opportunity / food-security items belong on the
 * Economics & Resources surfaces, not Viability. The operative exclusion is the
 * severity ('dependency'/'opportunity'); type + category are included for
 * completeness so a mis-severitied item is still routed correctly.
 *
 * Pure predicate + constants. No React, no store.
 */

/** @type {readonly string[]} */
export const VIABILITY_EXCLUDED_TYPES = Object.freeze([
  'dependency', 'resource_chain', 'opportunity', 'incomplete_chain', 'trade_dependency', 'food_security',
]);
/** @type {readonly string[]} */
export const VIABILITY_EXCLUDED_SEV = Object.freeze(['dependency', 'opportunity']);
/** @type {readonly string[]} */
export const VIABILITY_EXCLUDED_CATEGORIES = Object.freeze([
  'Resource Access', 'Resource Chain', 'Economic Opportunity', 'Water Dependency',
]);

/**
 * Items routed away by TITLE, because the generator writes them with no type or category.
 * 'Trade Dependencies' (economy/viability.js, severity 'note') restates the chain dependencies
 * and Resources' Gaps & Opportunities, which own what the town must import (UX consolidation
 * 2026-10-30, RULINGS-T2 T2-10/T2-16; RUBRIC R2). Measured co-present with the chain
 * dependencies on 488 of 495 towns.
 * @type {readonly string[]}
 */
export const VIABILITY_EXCLUDED_TITLES = Object.freeze(['Trade Dependencies']);

/**
 * True when an issue/warning belongs on the VIABILITY surface (i.e. it is NOT one
 * of the dependency/chain/opportunity/food items routed to Economics/Resources).
 * @param {{ type?: string, severity?: string, category?: string, title?: string } | null | undefined} item
 * @returns {boolean}
 */
export function isViabilityItem(item) {
  if (!item) return false;
  if (VIABILITY_EXCLUDED_TYPES.includes(item.type ?? '')) return false;
  if (VIABILITY_EXCLUDED_SEV.includes(item.severity ?? '')) return false;
  if (VIABILITY_EXCLUDED_CATEGORIES.includes(item.category ?? '')) return false;
  if (VIABILITY_EXCLUDED_TITLES.includes(item.title ?? '')) return false;
  return true;
}

/**
 * THE SUMMARY SAYS THE VERDICT AND NOTHING ANOTHER BLOCK OWNS (UX consolidation 2026-10-30,
 * RULINGS-T2 T2-12; RUBRIC R2, R6). Display-only: the record's summary is untouched, so the
 * record invariant V-SUMMARY-HOOKS (recordInvariants.js) still reads the count it checks.
 * Cut: the "N plot hooks available." count (the Plot Hooks tab owns hooks) and the
 * dependency clause (Resources' Gaps & Opportunities and the chain cards own what the town
 * must import), in both the record's spelling and the canonical view model's.
 * @param {string} text the summary body, verdict prefix already stripped
 * @returns {string}
 */
export function trimViabilitySummary(text) {
  return String(text || '')
    .replace(/\s*\d+ plot hooks? available\.?/i, '')
    .replace(/\s+but has \d+ operational dependenc(?:y|ies) that require active management\./i, '.')
    .replace(/,\s*but its survival depends on \d+ stable trade dependenc(?:y|ies) and protected routes\./i, '.')
    .trim();
}
