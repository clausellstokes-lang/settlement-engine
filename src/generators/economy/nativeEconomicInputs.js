/**
 * Resolve the legacy economy's native-only semantic inputs in one place.
 *
 * The economy still consumes flat institution and resource names in several
 * compatibility paths. Current custom entities carry explicit provenance, so
 * their display names must be removed before those native keyword heuristics
 * run. Registered custom effects and reviewed supply chains remain the only
 * ways authored content can acquire mechanics.
 */

import {
  nativeSemanticDepletedResourceKeys,
  nativeSemanticNames,
  nativeSemanticResourceKeys,
} from '../../domain/content/customContentSemanticAuthority.js';
import { availableNativeResourceKeys } from '../../domain/resourceSemantics.js';

/**
 * @param {Record<string, any>} config
 * @param {unknown[]} institutions
 */
export function resolveNativeEconomicInputs(config, institutions) {
  const institutionNames = nativeSemanticNames(institutions);
  const nearbyResources = nativeSemanticResourceKeys(config);
  const depletedResources = nativeSemanticDepletedResourceKeys(config);
  const availableResources = availableNativeResourceKeys(config);

  return {
    institutionNames,
    institutionNamesLower: institutionNames.map(name => name.toLowerCase()),
    nearbyResources,
    depletedResources,
    availableResources,
    resourceConfig: {
      ...config,
      nearbyResources,
      nearbyResourcesDepleted: depletedResources,
    },
  };
}
