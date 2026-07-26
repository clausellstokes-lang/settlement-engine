/**
 * Step 8: isolationPass
 *
 * Derives the isolation-support receipt, adds magical substitution only when
 * mundane supports leave a real gap, applies small-tier subsistence mode, and
 * enforces planar prerequisites.
 *
 * Isolation pass for the settlement generation pipeline.
 */

import { registerStep } from '../pipeline.js';
import {
  applyTeleportationInfrastructure,
  applySubsistenceMode,
  cullPlanarWithoutCircle,
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
  reads: ['catalogForTier', 'effectiveConfig', 'stress', 'tier', 'tradeRoute'], // ctx keys this step consumes that another step produces (A+ generators.3 data-flow contract)
  provides: ['stress', 'isolationSupport'], // applySubsistenceMode may append an isolation famine to the stress container
  mutates: ['institutions', 'effectiveConfig'], // prunes the roster + stamps isolation flags on effectiveConfig in place (A+ P1.7)
  phase: 'institutions',
}, (ctx, rng) => {
  const { institutions, tier, tradeRoute, effectiveConfig, catalogForTier } = ctx;

  // Wrap rng.chance to match the (p) => boolean signature expected by isolationGenerator
  const chanceWrapper = (p) => rng.chance(p);

  // Snapshot before each operation so we can trace what changed.
  const beforeTeleport = new Set(institutions.map(i => i.name));
  const isolationSupport = applyTeleportationInfrastructure(
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
  if (isolationSupport?.applicable) {
    recordTrace(ctx, {
      targetType: 'condition',
      targetId: 'isolationSupport',
      step: 'isolationPass',
      result: isolationSupport.status,
      causes: isolationSupport.paths.map(path => ({
        source: `isolationSupport.${path.type}`,
        effect: `capacity +${path.capacity}`,
        reason: path.evidence.join(', '),
      })),
      downstreamEffects: [{
        target: 'structuralValidationPass',
        effect: isolationSupport.deficit > 0
          ? `support deficit ${isolationSupport.deficit}`
          : 'support requirement met',
        reason: `Capacity ${isolationSupport.capacity}/${isolationSupport.requiredCapacity}.`,
      }],
    });
  }

  const beforeSubsistence = institutions.map(i => i.name);
  // applySubsistenceMode strips trade institutions IN PLACE and returns the
  // (possibly new) stress container — a real famine entry appended when the
  // isolation famine roll fires. The container is the single channel:
  // stressConfirmPass re-weighs the entry against granaries and syncs
  // effectiveConfig.stressTypes from the confirmed set, so the economy sees
  // famine only when a famine entry actually survives (no more ghost famine).
  const nextStress = applySubsistenceMode(institutions, tier, tradeRoute, effectiveConfig, chanceWrapper, ctx.stress);
  const famineAdded = nextStress !== ctx.stress;
  if (famineAdded) {
    recordTrace(ctx, {
      targetType: 'stressor',
      targetId:   'stressor.famine',
      step:       'isolationPass',
      result:     'emergent',
      causes: [
        { source: `tradeRoute.${tradeRoute}`, effect: 'derived',
          reason: `Isolated subsistence ${tier} has no external supply line — a failed harvest cannot be covered by imports, so famine is a live risk.` },
      ],
      downstreamEffects: [
        { target: 'stressConfirmPass', effect: 'context',
          reason: 'Re-weighed against granaries/food institutions like every other emergent stressor before the economy reads it.' },
      ],
    });
  }
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

  // Planar traders / Planar embassy require a teleportation circle — runs
  // AFTER applyTeleportationInfrastructure so a forced isolation circle
  // counts. factionCorrelationPass re-applies the same cull after faction
  // pulls (the only later roster-addition path).
  for (const name of cullPlanarWithoutCircle(institutions)) {
    recordTrace(ctx, {
      targetType: 'institution',
      targetId:   instId(name),
      step:       'isolationPass',
      result:     'requires_teleportation_circle',
      causes: [
        { source: instId('Teleportation circle'), effect: 'missing prerequisite',
          reason: `"${name}" trades with other planes through a permanent teleportation circle — no circle exists here, so the institution cannot operate.` },
      ],
    });
  }

  // Note: stripArcaneInstitutions runs later in the original (line 889, after faction correlation).
  // We keep it in a separate logical position but it's still part of institution finalization.

  // Write the stress container back (unchanged unless an isolation famine was
  // appended above). stressConfirmPass (the next step) reads ctx.stress.
  return { stress: nextStress, isolationSupport };
});
