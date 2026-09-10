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
 * True when an issue/warning belongs on the VIABILITY surface (i.e. it is NOT one
 * of the dependency/chain/opportunity/food items routed to Economics/Resources).
 * @param {{ type?: string, severity?: string, category?: string } | null | undefined} item
 * @returns {boolean}
 */
export function isViabilityItem(item) {
  if (!item) return false;
  if (VIABILITY_EXCLUDED_TYPES.includes(item.type ?? '')) return false;
  if (VIABILITY_EXCLUDED_SEV.includes(item.severity ?? '')) return false;
  if (VIABILITY_EXCLUDED_CATEGORIES.includes(item.category ?? '')) return false;
  return true;
}
