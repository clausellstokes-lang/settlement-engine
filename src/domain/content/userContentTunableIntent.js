/**
 * Eager-safe field intent for the public content-tunable vocabulary.
 *
 * The store must distinguish a rendered DEFAULT_CONFIG value from a value the
 * player actually chose before the generation engine loads. Keep that small
 * persistence concern here: the validation bounds, labels, and application
 * logic remain in userContentTunables.js and travel with the lazy generator.
 *
 * This leaf deliberately has no imports. Anything imported here becomes part
 * of anonymous first paint through configSlice and persistMerge.
 */

/**
 * The default is part of intent migration, not validation. A legacy value that
 * differs from this value is unambiguous evidence of an earlier player choice.
 */
export const USER_CONTENT_TUNABLE_INTENT_DEFAULTS = Object.freeze({
  priorityEconomy: 50,
  priorityMilitary: 50,
  priorityMagic: 50,
  priorityReligion: 50,
  priorityCriminal: 50,
  magicExists: true,
});

/** @param {unknown} value @returns {Record<string, unknown>} */
function plainRecord(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/**
 * Admit a persisted field-intent record through the closed eager registry.
 *
 * @param {unknown} value
 * @returns {Record<string, true>}
 */
export function normalizeUserContentTunableIntent(value) {
  return /** @type {Record<string, true>} */ (Object.fromEntries(
    Object.entries(plainRecord(value))
      .filter(([key, explicit]) => (
        Object.hasOwn(USER_CONTENT_TUNABLE_INTENT_DEFAULTS, key)
        && explicit === true
      )),
  ));
}

/**
 * Return the registered tunable fields touched by one configuration patch.
 * DEFAULT_CONFIG contains concrete values for immediate rendering; those
 * materialized defaults are not evidence that the player chose every field.
 *
 * @param {unknown} patch
 * @param {unknown} [priorIntent]
 * @returns {Record<string, true>}
 */
export function userContentTunableIntentForPatch(patch, priorIntent = {}) {
  const next = normalizeUserContentTunableIntent(priorIntent);
  for (const key of Object.keys(plainRecord(patch))) {
    if (Object.hasOwn(USER_CONTENT_TUNABLE_INTENT_DEFAULTS, key)) {
      next[key] = true;
    }
  }
  return next;
}

/**
 * Best-effort migration for config persisted before field intent existed.
 * Only a non-default value proves authorship; a default-valued field is
 * ambiguous and therefore remains eligible for an environment default.
 *
 * @param {unknown} config
 * @returns {Record<string, true>}
 */
export function inferLegacyUserContentTunableIntent(config) {
  const source = plainRecord(config);
  /** @type {Record<string, true>} */
  const inferred = {};
  for (const [key, defaultValue] of Object.entries(
    USER_CONTENT_TUNABLE_INTENT_DEFAULTS,
  )) {
    if (Object.hasOwn(source, key) && !Object.is(source[key], defaultValue)) {
      inferred[key] = true;
    }
  }
  return inferred;
}
