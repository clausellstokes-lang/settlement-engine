/**
 * customContentMigrations — normalize legacy custom-content items onto the
 * current taxonomy on load (§14). Pure, store-free, idempotent.
 *
 * History the migration heals:
 *   - The old `group` + `category` split (pre-batch-A). Batch A collapsed the
 *     two into ONE category per type; legacy rows may still carry `group`.
 *   - Older rows that predate the `isCustom` flag.
 *
 * What it intentionally does NOT do:
 *   - Force-remap a services item whose `category` is a stale institution-style
 *     value (e.g. 'Crafts') onto a service type. That mapping is lossy, and the
 *     generator already degrades such a category gracefully (it falls back to
 *     the Equipment bucket). Exact matches like 'Entertainment' resolve on their
 *     own via serviceTypeKeyFromCategory, so no rewrite is needed.
 *
 * Idempotence: a migrated item is stamped `_schemaVersion: CURRENT` and skipped
 * on subsequent loads, so re-hydration is a cheap no-op.
 */

export const CUSTOM_ITEM_SCHEMA_VERSION = 1;

/**
 * Normalize one legacy custom item onto the current shape. Returns the item
 * unchanged (same reference) when it is already current, so callers can rely on
 * referential stability for the common case.
 * @param {string} _type - bucket key (institutions/services/resources/…)
 * @param {object} item - the stored custom item
 * @returns {object} the normalized item
 */
export function migrateCustomItem(_type, item) {
  if (!item || typeof item !== 'object') return item;
  if (item._schemaVersion === CUSTOM_ITEM_SCHEMA_VERSION) return item;

  const next = { ...item };

  // Legacy `group` + `category` split → single category. Prefer an existing
  // `category`; otherwise promote `group`. Then drop the dead field.
  if (next.group != null) {
    if (next.category == null || next.category === '') next.category = next.group;
    delete next.group;
  }

  // Older rows predate the explicit custom flag.
  if (next.isCustom !== true) next.isCustom = true;

  next._schemaVersion = CUSTOM_ITEM_SCHEMA_VERSION;
  return next;
}

/**
 * Map every bucket of a grouped customContent blob through migrateCustomItem.
 * Returns a new blob (buckets are fresh arrays of normalized items); non-array
 * buckets pass through untouched.
 * @param {object} grouped - { institutions: [...], services: [...], … }
 * @returns {object}
 */
export function migrateCustomContent(grouped) {
  if (!grouped || typeof grouped !== 'object') return grouped;
  const out = {};
  for (const [type, arr] of Object.entries(grouped)) {
    out[type] = Array.isArray(arr) ? arr.map((it) => migrateCustomItem(type, it)) : arr;
  }
  return out;
}

export default migrateCustomContent;
