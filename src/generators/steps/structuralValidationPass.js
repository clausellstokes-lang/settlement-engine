/**
 * Step 12c: structuralValidationPass
 *
 * Runs checkStructuralValidity against the FINAL institution roster.
 *
 * This used to run inside assembleInstitutions (step 5), but subsumption,
 * cascade, isolation, and factionCorrelation all mutate the roster AFTER
 * step 5 — so the coherence receipt (structuralViolations / suggestions on
 * the dossier) described a roster that no longer existed: violations could
 * reference institutions subsumption had removed, and gaps filled by the
 * cascade/isolation passes were still reported as missing. Wave 4b moves
 * the validation after the last roster mutation (factionCorrelationPass) so
 * the receipt describes what the dossier actually lists.
 *
 * Writes the same ctx.structural the assembly consumes (assembleSettlement
 * reads ctx.structural — contract unchanged).
 */

import { registerStep } from '../pipeline.js';
import { checkStructuralValidity } from '../structuralValidator.js';

registerStep('structuralValidationPass', {
  deps: ['factionCorrelationPass'],
  provides: ['structural'],
  phase: 'institutions',
}, (ctx) => {
  const { tier, tradeRoute, effectiveConfig, institutions } = ctx;

  // By this point isolationPass has already set _magicTradeOnly on the
  // effectiveConfig when teleport infrastructure was forced; the derived
  // fallback is kept for headless/partial contexts.
  const _preDerivedMagicTrade = ctx.townPlus && tradeRoute === 'isolated'
    && effectiveConfig.magicExists !== false;
  const structural = checkStructuralValidity(institutions, {
    tier, tradeRouteAccess: tradeRoute, magicLevel: ctx.magicLevel,
    monsterThreat: ctx.threat,
    priorityMilitary: effectiveConfig.priorityMilitary,
    priorityMagic: effectiveConfig.priorityMagic,
    nearbyResources: effectiveConfig.nearbyResources,
    _magicTradeOnly: effectiveConfig._magicTradeOnly || _preDerivedMagicTrade,
  });

  return { structural };
});
