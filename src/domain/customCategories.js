/**
 * domain/customCategories.js — the single source of truth for custom-content
 * categories (§14). Collapses the old `group` + `category` split into ONE
 * category per type, using the REAL generation taxonomy so a custom item lands
 * in the matching dossier section (institutions/services group by these exact
 * keys; the PDF + tabs colour them).
 *
 * Plus the "+ New…" escape hatch: any category a user types that isn't built-in
 * becomes a shared, selectable option (shown as "– Custom") across EVERY type's
 * dropdown for as long as at least one custom item uses it. The lifecycle is
 * automatic — the list is DERIVED from live customContent, so deleting the last
 * item that uses a custom category drops it from the options on the next render.
 *
 * Pure data + selectors; no React/store.
 */

// Services group by buyable-service TYPE (the engine's availableServices keys) —
// the SAME way generated services are grouped in the dossier. The author picks
// the type at creation and the generator drops the custom service into that
// bucket, so it lands beside the built-in services of the same type. The stored
// category is the human label; serviceTypeKeyFromCategory() maps it to the key.
export const SERVICE_TYPES = Object.freeze([
  { key: 'food',          label: 'Food & Drink' },
  { key: 'lodging',       label: 'Lodging' },
  { key: 'healing',       label: 'Healing' },
  { key: 'equipment',     label: 'Equipment' },
  { key: 'information',   label: 'Information' },
  { key: 'transport',     label: 'Transportation' },
  { key: 'legal',         label: 'Legal & Financial' },
  { key: 'employment',    label: 'Employment' },
  { key: 'entertainment', label: 'Entertainment' },
  { key: 'magic',         label: 'Magical Services' },
  { key: 'criminal',      label: 'Criminal Services' },
]);

const _SVC_KEYS = new Set(SERVICE_TYPES.map((t) => t.key));
const _SVC_BY_LABEL = new Map(SERVICE_TYPES.map((t) => [t.label.toLowerCase(), t.key]));

/** Map a custom service's category (label OR key) to its availableServices key.
 *  Returns null for an unrecognized value (caller picks a fallback bucket). */
export function serviceTypeKeyFromCategory(category) {
  if (!category) return null;
  const c = String(category).trim().toLowerCase();
  if (_SVC_KEYS.has(c)) return c;
  return _SVC_BY_LABEL.get(c) || null;
}

// Built-in categories per type. Institutions use the 11 canonical
// institutionalCatalog second-level keys (Adventuring … Religious); services use
// the buyable-service TYPE labels (so they group like generated services);
// resources + trade goods keep their generation-truth enums.
export const BUILTIN_CATEGORIES = Object.freeze({
  institutions: ['Adventuring', 'Crafts', 'Criminal', 'Defense', 'Economy', 'Entertainment', 'Exotic', 'Government', 'Infrastructure', 'Magic', 'Religious'],
  services:     SERVICE_TYPES.map((t) => t.label),
  resources:    ['water', 'land', 'special', 'subterranean'],
  tradeGoods:   ['Agricultural', 'Raw Materials', 'Manufactured', 'Luxury', 'Food/Processed', 'Services'],
});

const ALL_BUILTIN_LOWER = new Set(Object.values(BUILTIN_CATEGORIES).flat().map((c) => c.toLowerCase()));

/**
 * Every category value in use across ALL custom-content types that is NOT a
 * built-in — the dynamic "– Custom" options. Shared across types so a custom
 * category authored on an institution is also offerable on a resource, etc.
 * Disappears automatically when no item uses it (derived from live content).
 */
export function selectCustomCategories(customContent) {
  const seen = new Map(); // lowercased → original-cased display
  for (const type of ['institutions', 'services', 'resources', 'tradeGoods', 'factions', 'stressors']) {
    for (const item of (customContent?.[type] || [])) {
      const c = String(item?.category || '').trim();
      if (!c || ALL_BUILTIN_LOWER.has(c.toLowerCase())) continue;
      if (!seen.has(c.toLowerCase())) seen.set(c.toLowerCase(), c);
    }
  }
  return [...seen.values()].sort((a, b) => a.localeCompare(b));
}

/**
 * The dropdown options for one type: { builtins, customs }. `customs` excludes
 * anything already a built-in for any type (deduped).
 */
export function categoryOptions(type, customContent) {
  const builtins = BUILTIN_CATEGORIES[type] || [];
  const builtinLower = new Set(builtins.map((c) => c.toLowerCase()));
  const customs = selectCustomCategories(customContent).filter((c) => !builtinLower.has(c.toLowerCase()));
  return { builtins, customs };
}
