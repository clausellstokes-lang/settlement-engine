/**
 * Step 2: buildGenerationContext
 *
 * Captures resolved world facts behind one immutable eligibility boundary.
 * Downstream producers receive the same answer to “does magic function?” and
 * cannot independently reinterpret raw defaults or contradictory inputs.
 */

import { registerStep } from '../pipeline.js';
import { createGenerationContext } from '../generationContext.js';

registerStep('buildGenerationContext', {
  deps: ['resolveConfig'],
  reads: [
    'culture',
    'culturalIdentity',
    'effectiveConfig',
    'generationContentProfile',
    'terrainType',
    'tier',
    'tradeRoute',
  ],
  provides: ['generationContext'],
  phase: 'config',
}, ctx => ({
  generationContext: createGenerationContext({
    config: ctx.effectiveConfig,
    tier: ctx.tier,
    tradeRoute: ctx.tradeRoute,
    terrainType: ctx.terrainType,
    cultureProfileId:
      ctx.culturalIdentity?.key
      || ctx.effectiveConfig?.cultureProfileId
      || ctx.culture
      || null,
    contentProfileId:
      ctx.generationContentProfile?.id
      || ctx.effectiveConfig?.contentProfileId
      || ctx.effectiveConfig?.contentProfile
      || null,
    generationContentProfile: ctx.generationContentProfile,
  }),
}));
