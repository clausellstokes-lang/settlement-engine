/**
 * Step 8: isolationPass
 *
 * Applies teleportation infrastructure for isolated town+ settlements,
 * subsistence mode stripping, and arcane institution safety-net.
 *
 * Extracted from generateSettlement.js lines 787–797, 888–889.
 */

import { registerStep } from '../pipeline.js';
import {
  applyTeleportationInfrastructure,
  applySubsistenceMode,
  stripArcaneInstitutions,
} from '../isolationGenerator.js';
import { TOWN_PLUS_TIERS } from '../../data/constants.js';

registerStep('isolationPass', {
  deps: ['cascadePass'],
  provides: [],
  phase: 'institutions',
}, (ctx, rng) => {
  const { institutions, tier, tradeRoute, effectiveConfig, catalogForTier } = ctx;

  // Wrap rng.chance to match the (p) => boolean signature expected by isolationGenerator
  const chanceWrapper = (p) => rng.chance(p);

  applyTeleportationInfrastructure(
    institutions, tier, tradeRoute, effectiveConfig, catalogForTier, TOWN_PLUS_TIERS, chanceWrapper
  );
  applySubsistenceMode(institutions, tier, tradeRoute, effectiveConfig, chanceWrapper);

  // Note: stripArcaneInstitutions runs later in the original (line 889, after faction correlation).
  // We keep it in a separate logical position but it's still part of institution finalization.

  return {};
});
