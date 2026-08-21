/**
 * Mechanical authority boundary for materialized custom content.
 *
 * The native engine predates custom definitions and still contains deliberate
 * keyword fallbacks for legacy, unstamped saves. Those fallbacks interpret a
 * built-in institution's historical display name as a compatibility key.
 * Applying the same rule to a current custom entity would make its
 * presentation-only `name` field an undeclared mechanical API: calling a
 * bespoke hall "State Granary" would silently grant native granary physics.
 *
 * Current custom projections carry explicit provenance. Consumers that use
 * native catalog-name heuristics must stop at that provenance boundary and
 * read only registered custom fields/dependencies for authored mechanics.
 * Truly legacy entities with no provenance remain eligible for the historical
 * name fallback.
 */

/**
 * @param {unknown} value
 * @returns {value is Record<string, unknown>}
 */
export function isMaterializedCustomContent(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const record = /** @type {Record<string, unknown>} */ (value);
  return (
    record.isCustom === true
    || record.custom === true
    || record.source === 'custom'
    || typeof record.customDefinitionId === 'string'
    || typeof record.customDefinitionCategory === 'string'
  );
}

/**
 * Return the historical name key only when native keyword semantics are
 * permitted for this entity.
 *
 * @param {unknown} value
 * @returns {string}
 */
export function nativeSemanticName(value) {
  if (isMaterializedCustomContent(value)) return '';
  if (typeof value === 'string') return value;
  if (!value || typeof value !== 'object' || Array.isArray(value)) return '';
  return String(
    /** @type {Record<string, unknown>} */ (value).name || '',
  );
}

/**
 * @param {unknown} values
 * @returns {string[]}
 */
export function nativeSemanticNames(values) {
  if (!Array.isArray(values)) return [];
  return values
    .map(nativeSemanticName)
    .filter(Boolean);
}

/**
 * Project the native members of the mixed flat resource roster.
 *
 * Resource generation still exposes a legacy string array because a large
 * part of the native economy predates identity-bearing content. Current
 * generation writes both `nearbyResourcesNative` and
 * `nearbyResourcesCustom`. Those source sidecars allow a native resource and a
 * custom definition with the same label to coexist: neither identity steals
 * nor erases the other's declared mechanics.
 *
 * Older saves have only the custom sidecar. Their safest compatible
 * interpretation remains subtraction: a stamped custom label cannot acquire
 * built-in physics merely through spelling or casing.
 *
 * @param {Record<string, unknown> | null | undefined} config
 * @param {unknown} [values]
 * @returns {string[]}
 */
export function nativeSemanticResourceKeys(
  config,
  values = config?.nearbyResources,
) {
  const normalized = (/** @type {unknown} */ value) => (
    String(value).trim().toLowerCase()
  );
  if (Array.isArray(config?.nearbyResourcesNative)) {
    const nativeKeys = new Set(
      config.nearbyResourcesNative.map(normalized).filter(Boolean),
    );
    if (!Array.isArray(values)) return [];
    return values
      .map(value => String(value))
      .filter(value => nativeKeys.has(normalized(value)));
  }

  const customKeys = new Set(
    (Array.isArray(config?.nearbyResourcesCustom)
      ? config.nearbyResourcesCustom
      : [])
      .map(normalized)
      .filter(Boolean),
  );
  if (!Array.isArray(values)) return [];
  return values
    .map(value => String(value))
    .filter(value => !customKeys.has(normalized(value)));
}

/**
 * Project the depleted subset of the native resource roster.
 *
 * A native resource and a custom definition may share one display label while
 * carrying different depletion state. Current settlements therefore stamp an
 * explicit native-depletion sidecar. Legacy saves fall back to the historical
 * flat depleted list, filtered through the same custom-content boundary as
 * membership.
 *
 * @param {Record<string, unknown> | null | undefined} config
 * @returns {string[]}
 */
export function nativeSemanticDepletedResourceKeys(config) {
  const values = Array.isArray(config?.nearbyResourcesNativeDepleted)
    ? config.nearbyResourcesNativeDepleted
    : (Array.isArray(config?.nearbyResourcesDepleted)
        ? config.nearbyResourcesDepleted
        : []);
  return nativeSemanticResourceKeys(config, values);
}
