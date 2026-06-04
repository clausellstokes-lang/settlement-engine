/**
 * Step 9: generateEconomy
 *
 * Generates economic state, spatial layout, and available services.
 * Threads neighbour economic bias into config.
 *
 * Extracted from generateSettlement.js lines 793-801.
 *
 * Tier 4.3: emits structured supply-chain traces after the legacy
 * economic generator finishes. Traces are layered on top via
 * deriveSupplyChainState - same Strangler Fig pattern Phase 7 + 9
 * established. The generator itself is not refactored.
 */

import { registerStep } from '../pipeline.js';
import { generateEconomicState } from '../economicGenerator.js';
import { generateSpatialLayout } from '../spatialGenerator.js';
import { generateAvailableServices } from '../servicesGenerator.js';
import { getTerrainType } from '../terrainHelpers.js';
import { recordTrace } from '../../domain/trace.js';
import { deriveSupplyChainState } from '../../domain/supplyChainState.js';

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

  // ── Trace recording (Tier 4.3) ────────────────────────────────────────
  // Emit one trace per active supply chain. Causes describe what
  // activated the chain (resource availability, processing institution,
  // upstream chain); downstream describes which subsystems the chain
  // status feeds into. Status remap (operational → stable, vulnerable
  // → strained, impaired → scarce) happens in deriveSupplyChainState.
  //
  // Disrupted chains (anything except 'stable') emit different
  // downstream targets - stable chains reinforce trade/food/etc.;
  // disrupted chains erode the same subsystems. This is the seed of
  // Tier 2.4's unified causal state model.

  const chains = economicState?.activeChains || [];
  for (const chain of chains) {
    const state = deriveSupplyChainState(chain);
    if (!state) continue;

    const causes = [];
    // Tier baseline - same shape as other traces.
    causes.push({
      source: `tier.${tier}`,
      effect: 'chain candidate',
      reason: `Settlements of size ${tier} qualify for this chain when the inputs are present.`,
    });
    if (state.dependency?.institution) {
      causes.push({
        source: `dependency.${state.dependency.institution}`,
        effect: state.dependency.severity || 'dependency',
        reason: state.dependency.impact || `Chain depends on ${state.dependency.institution} (${state.dependency.severity || 'unspecified'}).`,
      });
    }
    if (Array.isArray(chain.processingInstitutions) && chain.processingInstitutions.length) {
      causes.push({
        source: `processor.${chain.processingInstitutions[0]}`,
        effect: 'processes the chain',
        reason: `${chain.processingInstitutions[0]} converts raw inputs into chain output.`,
      });
    }
    if (chain.resource) {
      causes.push({
        source: `resource.${chain.resource}`,
        effect: chain.activatedByResource ? 'activates the chain' : 'enables the chain',
        reason: chain.activatedByResource
          ? `${chain.resource} is the proximate cause of this chain running here.`
          : `${chain.resource} is the input the chain depends on.`,
      });
    }
    if (state.substituteActive) {
      causes.push({
        source: 'substitute',
        effect: 'fallback path active',
        reason: 'Chain is running on a magical / alternative substitute rather than the canonical input.',
      });
    }

    // Downstream effects per need category + status interaction.
    // Stable chains reinforce; strained / worse erode.
    const isStable = state.status === 'stable';
    const downstreamEffects = [];
    switch (chain.needKey) {
      case 'food_security':
        downstreamEffects.push({ target: 'foodSecurity', effect: isStable ? 'reinforced' : 'eroded' });
        break;
      case 'manufacturing':
        downstreamEffects.push({ target: 'craftCapacity', effect: isStable ? 'reinforced' : 'eroded' });
        downstreamEffects.push({ target: 'exportRevenue', effect: isStable ? 'reinforced' : 'eroded' });
        break;
      case 'raw_extraction':
        downstreamEffects.push({ target: 'rawInputs', effect: isStable ? 'reinforced' : 'eroded' });
        break;
      case 'trade':
        downstreamEffects.push({ target: 'tradeConnectivity', effect: isStable ? 'reinforced' : 'eroded' });
        break;
      case 'energy':
        downstreamEffects.push({ target: 'fuelSupply', effect: isStable ? 'reinforced' : 'eroded' });
        break;
      case 'arcane':
        downstreamEffects.push({ target: 'magicCapacity', effect: isStable ? 'reinforced' : 'eroded' });
        break;
      default:
        downstreamEffects.push({ target: 'economy', effect: isStable ? 'reinforced' : 'eroded' });
        break;
    }

    recordTrace(ctx, {
      targetType: 'supply_chain',
      targetId:   state.id,
      step:       'generateEconomy',
      result:     state.status,
      causes,
      downstreamEffects,
    });
  }

  return { economicState, spatialLayout, availableServices };
});
