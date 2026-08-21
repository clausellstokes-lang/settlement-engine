/**
 * Step 12c: powerEconomyReconcilePass
 *
 * Finalizes the economy -> power edge after economyReconcilePass has produced
 * the final economic state. It replays the original power intent on its original
 * named RNG stream, refreshes economy-dependent legitimacy/power/relationship
 * projections, and preserves any neighbour factions already rolled.
 *
 * This is deliberately a one-way, bounded closeout. It does not mutate the
 * institution roster and factionCorrelationPass does not run again, so the
 * institutions -> economy -> power -> institutions loop cannot become an
 * unbounded fixpoint.
 */

import { registerStep } from '../pipeline.js';
import {
  assertPowerEconomyFreshness,
  reconcilePowerStructure,
  refreshPowerGenerationTraces,
} from '../power/economyReconciliation.js';

registerStep('powerEconomyReconcilePass', {
  deps: ['economyReconcilePass'],
  reads: ['economicState', 'powerIntent', 'powerStructure', 'tier'],
  provides: [],
  mutates: ['powerStructure'],
  phase: 'power',
}, (ctx) => {
  const { beforeFactions } = reconcilePowerStructure(
    ctx.powerStructure,
    ctx.economicState,
    ctx.powerIntent,
  );
  refreshPowerGenerationTraces(
    ctx,
    beforeFactions,
    ctx.powerStructure,
    ctx.powerIntent,
  );
  assertPowerEconomyFreshness(
    ctx.powerStructure,
    ctx.economicState,
    ctx.tier,
  );
  return {};
});
