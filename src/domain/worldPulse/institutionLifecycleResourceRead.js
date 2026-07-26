/**
 * Native-resource read model for institution lifecycle gap detection.
 *
 * The settlement still exposes a mixed flat roster for legacy consumers, while
 * current generation also writes exact native/custom ownership sidecars. This
 * leaf projects only the native membership and native depletion state that may
 * justify building a catalog institution. Keeping that compatibility work here
 * leaves institutionLifecycle focused on lifecycle policy and under its file
 * budget.
 */

import {
  nativeSemanticDepletedResourceKeys,
  nativeSemanticResourceKeys,
} from '../content/customContentSemanticAuthority.js';

/**
 * Native resources that may justify a built-in institution gap.
 *
 * Top-level nearbyResources is a legacy save shape. Once config owns either
 * roster sidecar, unioning the top-level field back in could re-admit a custom
 * namesake as native.
 *
 * @param {import('../settlement.schema.js').SimSettlement} settlement
 * @returns {string[]}
 */
export function nativeLifecycleResourceList(settlement) {
  const config = settlement?.config || {};
  const configOwnsRoster = (
    Array.isArray(config.nearbyResources)
    || Array.isArray(config.nearbyResourcesNative)
  );
  const source = /** @type {unknown[]} */ (
    configOwnsRoster
      ? nativeSemanticResourceKeys(config)
      : (settlement?.nearbyResources || [])
  );
  return [...new Set(source.filter(Boolean).map(value => String(value)))];
}

/**
 * Depleted members of the native lifecycle resource roster.
 *
 * An explicit native-depletion sidecar is exact authority. Legacy state maps
 * retain their historical override behavior, but only for resources that the
 * native roster above actually owns.
 *
 * @param {import('../settlement.schema.js').SimSettlement} settlement
 * @returns {string[]}
 */
export function nativeLifecycleDepletedResources(settlement) {
  const config = settlement?.config || {};
  const configOwnsResourceState = (
    Array.isArray(config.nearbyResourcesDepleted)
    || Array.isArray(config.nearbyResourcesNativeDepleted)
    || Array.isArray(config.nearbyResourcesNative)
  );
  if (!configOwnsResourceState) {
    return Array.isArray(settlement?.nearbyResourcesDepleted)
      ? settlement.nearbyResourcesDepleted.map(String)
      : [];
  }

  const nativeResources = nativeLifecycleResourceList(settlement);
  const depleted = new Set(
    nativeSemanticDepletedResourceKeys(config)
      .map(key => String(key).toLowerCase()),
  );
  if (!Array.isArray(config.nearbyResourcesNativeDepleted)) {
    for (const [key, state] of Object.entries(
      config.nearbyResourcesState || {},
    )) {
      const normalized = String(key).toLowerCase();
      if (state === 'depleted') depleted.add(normalized);
      else depleted.delete(normalized);
    }
  }
  return nativeResources.filter(
    key => depleted.has(String(key).toLowerCase()),
  );
}
