/**
 * Step 8: isolationPass
 *
 * Applies teleportation infrastructure for isolated town+ settlements,
 * subsistence mode stripping, and arcane institution safety-net.
 *
 * Isolation pass for the settlement generation pipeline.
 */

import { registerStep } from '../pipeline.js';
import {
  applyTeleportationInfrastructure,
  applySubsistenceMode,
  // stripArcaneInstitutions is called from factionCorrelationPass, not
  // here — but the import path remained as a stale `_`-prefixed unused
  // reference that didn't match the actual export name (no underscore).
  // Removing keeps the contract clean.
} from '../isolationGenerator.js';
import { TOWN_PLUS_TIERS } from '../../data/constants.js';
import { recordTrace } from '../../domain/trace.js';

function instId(name) {
  return `institution.${String(name).replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '').toLowerCase()}`;
}

registerStep('isolationPass', {
  deps: ['cascadePass'],
  provides: [],
  phase: 'institutions',
}, (ctx, rng) => {
  const { institutions, tier, tradeRoute, effectiveConfig, catalogForTier } = ctx;

  // Wrap rng.chance to match the (p) => boolean signature expected by isolationGenerator
  const chanceWrapper = (p) => rng.chance(p);

  // Snapshot before each operation so we can trace what changed.
  const beforeTeleport = new Set(institutions.map(i => i.name));
  applyTeleportationInfrastructure(
    institutions, tier, tradeRoute, effectiveConfig, catalogForTier, TOWN_PLUS_TIERS, chanceWrapper
  );
  // Trace any teleport-infrastructure institutions that were added.
  for (const inst of institutions) {
    if (!beforeTeleport.has(inst.name)) {
      recordTrace(ctx, {
        targetType: 'institution',
        targetId:   instId(inst.name),
        step:       'isolationPass',
        result:     'teleport_added',
        causes: [
          { source: `tradeRoute.${tradeRoute}`, effect: 'enabled',
            reason: `Isolated ${tier}-sized settlement uses arcane infrastructure as a substitute for physical trade access.` },
        ],
        downstreamEffects: [
          { target: 'tradeConnectivity', effect: 'restored',
            reason: 'Magical transit compensates for lack of road/river/port.' },
        ],
      });
    }
  }

  const beforeSubsistence = institutions.map(i => i.name);
  applySubsistenceMode(institutions, tier, tradeRoute, effectiveConfig, chanceWrapper);
  // Trace any subsistence-stripped institutions (the pass removes
  // institutions incompatible with full subsistence mode).
  const afterSubsistenceSet = new Set(institutions.map(i => i.name));
  for (const name of beforeSubsistence) {
    if (!afterSubsistenceSet.has(name)) {
      recordTrace(ctx, {
        targetType: 'institution',
        targetId:   instId(name),
        step:       'isolationPass',
        result:     'subsistence_stripped',
        causes: [
          { source: 'subsistenceMode', effect: 'removed',
            reason: `Settlement is in subsistence mode — "${name}" requires external supply chains that don't reach here.` },
        ],
      });
    }
  }

  // Note: stripArcaneInstitutions runs later in the original (line 889, after faction correlation).
  // We keep it in a separate logical position but it's still part of institution finalization.

  return {};
});
