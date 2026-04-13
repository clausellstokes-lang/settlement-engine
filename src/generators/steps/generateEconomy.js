/**
 * Step 9: generateEconomy
 *
 * Generates economic state, spatial layout, and available services.
 * Threads neighbour economic bias into config.
 *
 * Extracted from generateSettlement.js lines 793–801.
 */

import { registerStep } from '../pipeline.js';
import { generateEconomicState } from '../economicGenerator.js';
import { generateSpatialLayout } from '../spatialGenerator.js';
import { generateAvailableServices } from '../servicesGenerator.js';
import { getTerrainType } from '../terrainHelpers.js';

registerStep('generateEconomy', {
  deps: ['isolationPass', 'resolveNeighbour'],
  provides: ['economicState', 'spatialLayout', 'availableServices'],
  phase: 'economy',
}, (ctx) => {
  const {
    tier, institutions, tradeRoute, effectiveConfig,
    goodsToggles, servicesToggles,
    neighbourEconBias, neighbourProfile,
  } = ctx;

  const terrainType = getTerrainType(tradeRoute, effectiveConfig.terrainOverride || null);

  // Thread neighbour economic bias
  if (neighbourEconBias && Object.keys(neighbourEconBias).length > 0) {
    effectiveConfig._neighbourEconBias = neighbourEconBias;
    effectiveConfig._neighbourEconMode = neighbourProfile?.dynamics?.economyMode || 'independent';
  }

  const economicState = generateEconomicState(tier, institutions, tradeRoute, goodsToggles, effectiveConfig);
  const spatialLayout = generateSpatialLayout(tier, institutions, tradeRoute, terrainType);
  const availableServices = generateAvailableServices(
    tier, institutions, servicesToggles,
    { ...effectiveConfig, _tradeRoute: tradeRoute }
  );

  return { economicState, spatialLayout, availableServices };
});
