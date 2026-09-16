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
  // The validation itself reads institutions, but this dependency makes the
  // finalization boundary explicit: no dossier-producing step can pass the
  // final-roster gate while power still reflects the provisional economy.
  deps: ['powerEconomyReconcilePass'],
  reads: ['effectiveConfig', 'institutions', 'isolationSupport', 'magicLevel', 'threat', 'tier', 'townPlus', 'tradeRoute'], // ctx keys this step consumes that another step produces (A+ generators.3 data-flow contract)
  provides: ['structural'],
  phase: 'institutions',
}, (ctx) => {
  const { tier, tradeRoute, effectiveConfig, institutions } = ctx;

  const structural = checkStructuralValidity(institutions, {
    ...effectiveConfig,
    tier, tradeRouteAccess: tradeRoute, magicLevel: ctx.magicLevel,
    monsterThreat: ctx.threat,
    priorityMilitary: effectiveConfig.priorityMilitary,
    priorityMagic: effectiveConfig.priorityMagic,
    _magicTradeOnly: effectiveConfig._magicTradeOnly === true,
    _isolationSupport: ctx.isolationSupport || effectiveConfig._isolationSupport,
  });

  return { structural };
});
