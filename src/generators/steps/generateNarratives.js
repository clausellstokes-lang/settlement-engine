/**
 * Step 14: generateNarratives
 *
 * Generates settlement reason, resource analysis, economic viability,
 * history, and legacy annotations.
 *
 * Narrative step for the settlement generation pipeline.
 */

import { registerStep } from '../pipeline.js';
import { TERRAIN_DATA } from '../../data/geographyData.js';
import { generateSettlementReason } from '../narrativeGenerator.js';
import { generateResourceAnalysis } from '../resourceGenerator.js';
import { generateEconomicViability } from '../economicGenerator.js';
import { generateHistory } from '../historyGenerator.js';
import { deriveLegacyAnnotations } from '../legacyGenerator.js';
import { getTerrainType } from '../terrainHelpers.js';
import { recordTrace } from '../../domain/trace.js';

registerStep('generateNarratives', {
  // economyReconcilePass (not generateEconomy): narratives must read the
  // FINAL economicState, after the faction-pull reconciliation.
  deps: ['generatePopulation', 'economyReconcilePass'],
  reads: ['economicState', 'effectiveConfig', 'institutions', 'population', 'powerStructure', 'tier', 'tradeRoute'], // ctx keys this step consumes that another step produces (A+ generators.3 data-flow contract)
  provides: ['settlementReason', 'resourceAnalysis', 'economicViability', 'history'],
  phase: 'narrative',
}, (ctx) => {
  const {
    tier, population, tradeRoute, effectiveConfig,
    institutions, economicState, powerStructure,
  } = ctx;

  const terrainT = getTerrainType(tradeRoute, effectiveConfig.terrainOverride || null);
  const allowedResources = TERRAIN_DATA[terrainT]?.allowedResources?.slice(0, 7) || [];

  const resourceAnalysis = generateResourceAnalysis(terrainT, allowedResources, [], institutions, effectiveConfig);
  // Viability first: settlementReason is deficit-aware — an isolated settlement
  // with a food shortfall must not claim self-sufficiency.
  const economicViability = generateEconomicViability(
    { tier, population, institutions, economicState, config: { ...effectiveConfig } },
    terrainT, allowedResources
  );
  const settlementReason = generateSettlementReason(
    tier, tradeRoute, null, effectiveConfig,
    economicViability?.metrics?.foodBalance || null
  );
  const history = generateHistory(tier, effectiveConfig, institutions, economicViability, economicState, powerStructure);

  // Legacy annotations
  const legacyAnnotations = deriveLegacyAnnotations(history, {
    powerStructure, economicState, tier, institutions,
  });
  if (legacyAnnotations.length > 0) {
    history.legacyAnnotations = legacyAnnotations;
  }

  // Causal traces — record the narrative anchors so the AI grounding
  // layer can quote "the engine decided X because Y" without re-deriving.
  if (settlementReason) {
    recordTrace(ctx, {
      targetType: 'history',
      targetId: 'settlementReason',
      step: 'generateNarratives',
      result: 'authored',
      causes: [{
        source: `tier.${tier} + tradeRoute.${tradeRoute}`,
        reason: `Founding rationale derived from settlement size, trade access, and food balance.`,
      }],
      downstreamEffects: [
        { target: 'history', effect: 'founding context' },
      ],
    });
  }

  if (economicViability) {
    recordTrace(ctx, {
      targetType: 'resource',
      targetId: 'economicViability',
      step: 'generateNarratives',
      result: 'scored',
      causes: [{
        source: `terrain.${terrainT}`,
        effect: `${allowedResources.length} resources in pool`,
        reason: `Viability blends tier scaling, terrain pool, institution mix, and economic state.`,
      }],
      downstreamEffects: [
        { target: 'history',      effect: 'economic backstory' },
        { target: 'defenseProfile', effect: 'wealth-to-defend signal' },
      ],
    });
  }

  if (history && Array.isArray(history.events) && history.events.length) {
    recordTrace(ctx, {
      targetType: 'history',
      targetId: 'history.events',
      step: 'generateNarratives',
      result: 'composed',
      causes: [{
        source: `tier.${tier}`,
        effect: `${history.events.length} events`,
        reason: `History length scales with tier; legacy annotations link past to present.`,
      }],
      downstreamEffects: [
        ...(legacyAnnotations.length > 0
          ? [{ target: 'history.legacyAnnotations', effect: `${legacyAnnotations.length} present-day links` }]
          : []),
      ],
    });
  }

  return { settlementReason, resourceAnalysis, economicViability, history };
});
