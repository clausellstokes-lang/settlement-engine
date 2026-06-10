/**
 * Step 4: resolveNeighbour
 *
 * Extracts structured relationship data from the imported neighbour settlement.
 *
 * Neighbour-resolution step for the settlement generation pipeline.
 */

import { registerStep } from '../pipeline.js';
import {
  extractNeighbourProfile,
  getNeighbourEconomicBias,
  getNeighbourFactionBias,
} from '../neighbourGenerator.js';
import { recordTrace } from '../../domain/trace.js';

registerStep('resolveNeighbour', {
  deps: ['resolveConfig'],
  provides: ['neighbourProfile', 'neighbourEconBias', 'neighbourFacBias', 'rawNeighbour'],
  phase: 'config',
}, (ctx) => {
  const config = ctx.config || {};
  const importedNeighbor = ctx.importedNeighbour || null;

  const rawNeighbour = config._importedNeighbor || importedNeighbor || null;
  const relType = config._neighbourRelType || config.neighbourRelType || 'neutral';
  const neighbourProfile = rawNeighbour
    ? extractNeighbourProfile(rawNeighbour, relType)
    : null;
  const neighbourEconBias = getNeighbourEconomicBias(neighbourProfile);
  // Government-type bias was computed and plumbed here for years but no
  // generator ever read it — the receipt below claimed an influence that
  // never existed. The neighbour's real power-structure influence is the
  // faction mirroring done by the neighbourFactions step (neighbourFacBias).
  const neighbourFacBias  = getNeighbourFactionBias(neighbourProfile);

  // Only emit a trace when an actual neighbour was bound — a missing
  // neighbour is a non-decision and would just be noise in the rail.
  if (rawNeighbour && neighbourProfile) {
    recordTrace(ctx, {
      targetType: 'condition',
      targetId: `neighbour.${rawNeighbour.name || 'unnamed'}.${relType}`,
      step: 'resolveNeighbour',
      result: 'bound',
      causes: [{
        source: 'config._importedNeighbor',
        reason: `Linked to ${rawNeighbour.name || 'a previously generated settlement'} (tier ${rawNeighbour.tier}) as ${relType}.`,
      }],
      downstreamEffects: [
        { target: 'economicState',  effect: 'neighbour econ bias applied' },
        { target: 'factions',       effect: 'neighbour faction bias applied' },
      ],
    });
  }

  return { neighbourProfile, neighbourEconBias, neighbourFacBias, rawNeighbour };
});
