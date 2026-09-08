/**
 * Eager-safe custom-content projection shape.
 *
 * This leaf deliberately has no imports. The application store needs an empty
 * projection during first paint, while admission, revision, pack, archive, and
 * persistence code belongs to the lazy custom-content runtime.
 */

export const CUSTOM_CONTENT_BUCKETS = Object.freeze([
  'institutions',
  'services',
  'resources',
  'stressors',
  'tradeGoods',
  'factions',
  'deities',
  'traditions',
  'supplyChains',
  'tradeRoutes',
  'powerPresets',
  'defensePresets',
]);

export const EMPTY_CUSTOM_CONTENT = Object.freeze(
  Object.fromEntries(CUSTOM_CONTENT_BUCKETS.map(category => [category, []])),
);

export function emptyCustomContentGroups() {
  return Object.fromEntries(
    CUSTOM_CONTENT_BUCKETS.map(category => [category, []]),
  );
}
