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
  cullPlanarWithoutCircle,
  // stripArcaneInstitutions is called from factionCorrelationPass, not
  // here — but the import path remained as a stale `_`-prefixed unused
  // reference that didn't match the actual export name (no underscore).
  // Removing keeps the contract clean.
} from '../isolationGenerator.js';
import { TOWN_PLUS_TIERS } from '../../data/constants.js';
import { recordTrace } from '../../domain/trace.js';
import { STRESS_TYPE_MAP } from '../../data/stressTypes.js';

function instId(name) {
  return `institution.${String(name).replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '').toLowerCase()}`;
}

registerStep('isolationPass', {
  deps: ['cascadePass'],
  reads: ['catalogForTier', 'effectiveConfig', 'tier', 'tradeRoute', 'stress'], // ctx keys this step consumes that another step produces
  provides: ['stress', 'stressTypes'], // re-emits the container when the subsistence famine joins it
  mutates: ['institutions', 'effectiveConfig', 'stressTypes'], // prunes the roster + stamps isolation flags / stress on effectiveConfig+stressTypes in place
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
  const subsistenceFamine = applySubsistenceMode(institutions, tier, tradeRoute, effectiveConfig, chanceWrapper);
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
            reason: `Settlement is in subsistence mode. "${name}" requires external supply chains that don't reach here.` },
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
          reason: `"${name}" trades with other planes through a permanent teleportation circle. No circle exists here, so the institution cannot operate.` },
      ],
    });
  }

  // Note: stripArcaneInstitutions runs later in the original (line 889, after faction correlation).
  // We keep it in a separate logical position but it's still part of institution finalization.

  // Merge the subsistence famine into the stress CONTAINER, not just the
  // effectiveConfig.stressTypes channel applySubsistenceMode already stamped —
  // stressConfirmPass iterates container entries ONLY (a stressTypes-only
  // famine was a ghost: it drove the food math but never appeared on the
  // roster and was erased whenever the confirm pass re-stamped the confirmed
  // set), and assembleSettlement renders the stressor roster from the
  // container. Appended LAST so the confirm pass's re-weighting draws for
  // earlier entries keep their exact order.
  if (!subsistenceFamine) return {};

  const entries = Array.isArray(ctx.stress) ? [...ctx.stress] : ctx.stress ? [ctx.stress] : [];
  entries.push(subsistenceFamine);
  recordTrace(ctx, {
    targetType: 'stressor',
    targetId:   'stressor.famine',
    step:       'isolationPass',
    result:     'emergent',
    causes: [
      { source: 'subsistenceMode', effect: 'derived',
        reason: `Isolated ${tier} in subsistence mode rolled a famine: no external supply lines to buffer a failed harvest.` },
    ],
    downstreamEffects: [
      { target: 'foodSecurity', effect: 'context' },
      { target: 'stressTypes',  effect: 'added' },
    ],
  });

  // Preserve generateStress's output shape convention (null / bare object /
  // array) and the catalog-types-only stressTypes channel filter.
  return {
    stress:      entries.length === 1 ? entries[0] : entries,
    stressTypes: entries.map(e => e?.type).filter(t => t && STRESS_TYPE_MAP[t]),
  };
});
