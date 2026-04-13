/**
 * Step 10: generatePower
 *
 * Generates power structure (government, factions, legitimacy).
 *
 * Extracted from generateSettlement.js line 802.
 */

import { registerStep } from '../pipeline.js';
import { generatePowerStructure } from '../powerGenerator.js';

registerStep('generatePower', {
  deps: ['generateEconomy', 'resolveNeighbour'],
  provides: ['powerStructure'],
  phase: 'power',
}, (ctx) => {
  const {
    tier, economicState, effectiveConfig, institutions,
    neighbourGovBias, neighbourFacBias,
  } = ctx;

  const powerStructure = generatePowerStructure(
    tier, economicState, null,
    { ...effectiveConfig, _neighbourGovBias: neighbourGovBias, _neighbourFacBias: neighbourFacBias },
    institutions
  );

  return { powerStructure };
});
