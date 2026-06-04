/**
 * lib/entities.js - Tag- and ID-based primitives for mechanical entities.
 *
 * These are the helpers mechanics SHOULD use instead of name-pattern
 * matching. Long-term, every "does this institution count as security?"
 * check in the codebase replaces:
 *
 *     name.toLowerCase().includes('watch')
 *
 * with:
 *
 *     hasTag(institution, TAG.SECURITY)
 *
 * The helpers are tolerant of legacy data:
 *   - Entities without a `tags` field return `false` from hasTag.
 *   - Entities without an `id` field fall back to a deterministic id
 *     derived from their name + category (so two consumers of the
 *     same unnamed entity see the same id).
 *
 * The helpers are also tolerant of mixed-shape inputs - strings (just
 * the name), full objects, or partial objects from intermediate
 * generator steps. The runtime overhead per call is two property reads
 * plus an array `.includes`. Cheap enough to use in hot paths.
 */

import { TAG, TAG_GROUPS } from '../data/entityTags.js';

// Re-exports so consumers can `import { hasTag, TAG } from '@/lib/entities'`
// without two imports.
export { TAG, TAG_GROUPS };

// ── tagsOf ─────────────────────────────────────────────────────────────────
// Returns the array of tags on an entity. Empty array for unknown shapes.

/**
 * @param {unknown} entity - Institution, service, resource, etc.
 * @returns {string[]} The entity's declared tags (may be empty).
 */
export function tagsOf(entity) {
  if (!entity || typeof entity !== 'object') return [];
  const e = /** @type {any} */ (entity);
  if (Array.isArray(e.tags)) return e.tags;
  return [];
}

// ── hasTag ─────────────────────────────────────────────────────────────────

/**
 * Whether `entity` carries `tag` in its tag list.
 *
 * @param {unknown} entity
 * @param {string} tag      Use a TAG.* constant where possible.
 * @returns {boolean}
 */
export function hasTag(entity, tag) {
  if (typeof tag !== 'string' || !tag) return false;
  const tags = tagsOf(entity);
  return tags.includes(tag);
}

/**
 * Whether `entity` carries any tag from `group`. Useful with the
 * pre-built TAG_GROUPS bundles (ENFORCEMENT, WELFARE_PROVIDER, etc.).
 *
 * @param {unknown} entity
 * @param {string[]} group
 * @returns {boolean}
 */
export function hasAnyTag(entity, group) {
  if (!Array.isArray(group) || group.length === 0) return false;
  const tags = tagsOf(entity);
  for (const t of group) {
    if (tags.includes(t)) return true;
  }
  return false;
}

/**
 * Whether `entity` carries every tag in `group`. Less common than
 * hasAnyTag, but useful for narrow filters like "must be both
 * religious AND welfare-providing."
 */
export function hasAllTags(entity, group) {
  if (!Array.isArray(group) || group.length === 0) return true;
  const tags = tagsOf(entity);
  for (const t of group) {
    if (!tags.includes(t)) return false;
  }
  return true;
}

// ── idOf ───────────────────────────────────────────────────────────────────
// Stable id for an entity. If the entity carries one, return it. Otherwise
// derive a deterministic id from the name + optional category.
//
// The fallback id is `prefix.snake_case_name` - e.g. "institution.town_watch".
// Two callers handed the same unnamed entity get the same id. This is the
// migration path: once consumers start querying by id, the data files can
// be updated to carry explicit ids without breaking anything.

function snakeCase(s) {
  return String(s)
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();
}

/**
 * Stable id for an entity. Prefers `entity.id`, falls back to deriving
 * from `entity.name` + the optional `prefix` (default 'entity').
 *
 * @param {unknown} entity
 * @param {string} [prefix]   'institution' | 'faction' | 'service' | etc.
 * @returns {string|null}
 */
export function idOf(entity, prefix = 'entity') {
  if (!entity || typeof entity !== 'object') return null;
  const e = /** @type {any} */ (entity);
  if (typeof e.id === 'string' && e.id) return e.id;
  if (typeof e.name === 'string' && e.name) {
    return `${prefix}.${snakeCase(e.name)}`;
  }
  return null;
}

// ── Convenience queries ────────────────────────────────────────────────────
// Small wrappers that read as the mechanical question they answer. Cheap
// to add - every additional question becomes one named function instead
// of an ad-hoc `hasTag(x, TAG.Y)` peppered across consumers.

/** Any kind of order-enforcement institution (watch, garrison, militia). */
export function isEnforcement(entity) {
  return hasAnyTag(entity, TAG_GROUPS.ENFORCEMENT);
}

/** Any welfare-providing institution (temple, almshouse, hospital). */
export function isWelfareProvider(entity) {
  return hasAnyTag(entity, TAG_GROUPS.WELFARE_PROVIDER);
}

/** Any trade-participating institution (market, guild, caravanserai). */
export function isTradeParticipant(entity) {
  return hasAnyTag(entity, TAG_GROUPS.TRADE_PARTICIPANT);
}

/** Any food-system institution (mill, market, granary). */
export function isFoodSystem(entity) {
  return hasAnyTag(entity, TAG_GROUPS.FOOD_SYSTEM);
}

/** Any magic-system institution (mage college, shrine, library). */
export function isMagicSystem(entity) {
  return hasAnyTag(entity, TAG_GROUPS.MAGIC_SYSTEM);
}

/** Any underground / criminal actor (thieves' guild, smuggling ring). */
export function isUnderground(entity) {
  return hasAnyTag(entity, TAG_GROUPS.UNDERGROUND);
}
