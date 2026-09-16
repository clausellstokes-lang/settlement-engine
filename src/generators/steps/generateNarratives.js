/**
 * Step 14: generateNarratives
 *
 * Generates settlement reason, resource analysis, economic viability,
 * history, and legacy annotations.
 *
 * Narrative step for the settlement generation pipeline.
 */

import { registerStep } from '../pipeline.js';
import { generateSettlementReason } from '../narrativeGenerator.js';
import { generateResourceAnalysis, resolveNearbyCommodities } from '../resourceGenerator.js';
import { generateEconomicViability } from '../economicGenerator.js';
import { generateHistory } from '../historyGenerator.js';
import { deriveLegacyAnnotations } from '../legacyGenerator.js';
import { getTerrainType } from '../terrainHelpers.js';
import { recordTrace } from '../../domain/trace.js';
import { availableNativeResourceKeys } from '../../domain/resourceSemantics.js';

registerStep('generateNarratives', {
  // economyReconcilePass (not generateEconomy): narratives must read the
  // FINAL economicState, after the faction-pull reconciliation.
  deps: ['generatePopulation', 'economyReconcilePass'],
  reads: ['economicState', 'effectiveConfig', 'generationContext', 'institutions', 'population', 'powerStructure', 'tier', 'tradeRoute'], // ctx keys this step consumes that another step produces (A+ generators.3 data-flow contract)
  provides: ['settlementReason', 'resourceAnalysis', 'economicViability', 'history'],
  phase: 'narrative',
}, (ctx) => {
  const {
    tier, population, tradeRoute, effectiveConfig,
    institutions, economicState, powerStructure,
  } = ctx;

  const terrainT = getTerrainType(tradeRoute, effectiveConfig.terrainOverride || null);
  const availableResources = availableNativeResourceKeys(effectiveConfig);

  // Resource analysis reads the settlement's ACTUALLY-rolled resources (not the
  // whole terrain slice), so two settlements on the same terrain with different
  // nearby resources get different analyses. Special resources flow through too.
  const nearbyResources = resolveNearbyCommodities(effectiveConfig, terrainT);
  const specialResources = effectiveConfig.specialResources || [];
  const resourceAnalysis = generateResourceAnalysis(terrainT, nearbyResources, specialResources, institutions, effectiveConfig);
  // Viability first: settlementReason is deficit-aware — an isolated settlement
  // with a food shortfall must not claim self-sufficiency. Feed it the same
  // condition-filtered roster as resource analysis and the economy: terrain
  // potential is useful context, but it cannot stand in for a resource that this
  // settlement never rolled or has already exhausted.
  const economicViability = generateEconomicViability(
    { tier, population, institutions, economicState, config: { ...effectiveConfig } },
    terrainT, availableResources
  );
  // The origin rung's variant selection is draw-free and keyed on the pipeline seed,
  // exactly as generateHistory's is below — effectiveConfig itself carries no _seed,
  // so it is stamped on here. Without it the rung falls back to canonical-at-zero and
  // every settlement on a route shares one sentence, which is the defect lane RR closed.
  const settlementReason = generateSettlementReason(
    tier, tradeRoute, null, { ...effectiveConfig, _seed: ctx._seed },
    economicViability?.metrics?.foodBalance || null
  );
  // Stamp the pipeline seed onto the config so generateHistory's prose-variant selection
  // (draw-free) is stable per settlement — effectiveConfig itself carries no _seed.
  const history = generateHistory(
    tier,
    { ...effectiveConfig, _seed: ctx._seed },
    institutions,
    economicViability,
    economicState,
    powerStructure,
    ctx.generationContext,
  );

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
        effect: `${availableResources.length} available native resources`,
        reason: 'Viability blends tier scaling, the settlement resource condition, institution mix, and economic state.',
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
