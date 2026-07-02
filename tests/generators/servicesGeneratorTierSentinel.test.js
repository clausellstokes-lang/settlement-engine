/**
 * tests/generators/servicesGeneratorTierSentinel.test.js
 *
 * Regression guard: the criminal-services fallback gates in
 * generateAvailableServices (servicesGenerator.js) must resolve the REAL tier
 * before the sentinel settType. In random/custom mode DEFAULT_CONFIG.settType is
 * the sentinel 'random'/'custom' and resolveConfig writes the resolved tier to
 * config.tier. The two gates previously read `d.settType || d.tier`, so a small
 * settlement generated in random mode (settType='random', tier='village') slipped
 * past the small-tier block and grew large-tier criminal services. The fix reads
 * `d.tier || d.settType` at both sites, matching institutionProbability.js:34-36
 * and economicGenerator.
 *
 * Observable signature: under a high-crime config the large-tier criminal
 * fallback contributes a "Contraband" line. An explicit town keeps it; a
 * random-mode settlement whose RESOLVED tier is small (village/hamlet) must not.
 * Before the fix the small random-mode settlements also emitted "Contraband"
 * because the gate matched the 'random' sentinel instead of the resolved tier.
 */
import { describe, it, expect } from 'vitest';

import { setActiveRng, clearActiveRng } from '../../src/generators/rngContext.js';
import { createPRNG } from '../../src/generators/prng.js';
import { generateAvailableServices } from '../../src/generators/servicesGenerator.js';

/** Criminal service names emitted for a config, under a fixed seed. */
function criminalNames(config) {
  setActiveRng(createPRNG('tier-sentinel'));
  try {
    return generateAvailableServices('tier-sentinel', [], {}, config).criminal.map((c) => c.name);
  } finally {
    clearActiveRng();
  }
}

// High crime pressure, no military/criminal institutions → the large-tier
// criminal fallback is the deciding factor, so the tier gate is what matters.
const crimeConfig = {
  priorityCriminal: 100,
  priorityMilitary: 0,
  priorityEconomy: 50,
  priorityReligion: 50,
};

describe('servicesGenerator — criminal-services tier gate resolves tier before sentinel', () => {
  it('an explicit town (tier=town) still gets the large-tier "Contraband" service', () => {
    expect(criminalNames({ ...crimeConfig, settType: 'town', tier: 'town' })).toContain('Contraband');
  });

  it('a random-mode settlement with resolved tier=village does NOT get large-tier "Contraband"', () => {
    // settType is the 'random' sentinel; the RESOLVED tier (village) must win.
    expect(criminalNames({ ...crimeConfig, settType: 'random', tier: 'village' })).not.toContain(
      'Contraband',
    );
  });

  it('a random-mode settlement with resolved tier=hamlet does NOT get large-tier "Contraband"', () => {
    expect(criminalNames({ ...crimeConfig, settType: 'random', tier: 'hamlet' })).not.toContain(
      'Contraband',
    );
  });
});
