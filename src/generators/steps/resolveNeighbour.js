/**
 * Step 4: resolveNeighbour
 *
 * Extracts structured relationship data from the imported neighbour settlement.
 *
 * Extracted from generateSettlement.js lines 431–441.
 */

import { registerStep } from '../pipeline.js';
import {
  extractNeighbourProfile,
  getNeighbourEconomicBias,
  getNeighbourGovernmentBias,
  getNeighbourFactionBias,
} from '../neighbourGenerator.js';

registerStep('resolveNeighbour', {
  deps: ['resolveConfig'],
  provides: ['neighbourProfile', 'neighbourEconBias', 'neighbourGovBias', 'neighbourFacBias', 'rawNeighbour'],
  phase: 'config',
}, (ctx) => {
  const config = ctx.config || {};
  const importedNeighbor = ctx.importedNeighbour || null;

  const rawNeighbour = config._importedNeighbor || importedNeighbor || null;
  const neighbourProfile = rawNeighbour
    ? extractNeighbourProfile(rawNeighbour, config._neighbourRelType || config.neighbourRelType || 'neutral')
    : null;
  const neighbourEconBias = getNeighbourEconomicBias(neighbourProfile);
  const neighbourGovBias  = getNeighbourGovernmentBias(neighbourProfile);
  const neighbourFacBias  = getNeighbourFactionBias(neighbourProfile);

  return { neighbourProfile, neighbourEconBias, neighbourGovBias, neighbourFacBias, rawNeighbour };
});
