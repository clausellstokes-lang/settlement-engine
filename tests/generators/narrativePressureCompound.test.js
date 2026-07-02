/**
 * tests/generators/narrativePressureCompound.test.js
 *
 * Regression: the wartime/mass_migration/insurgency PRESSURE_SENTENCES closures
 * branch on r.compound?.{economyOutput,militaryEffective,criminalEffective}, but
 * genPressureDetail never plumbed economicState.compound onto its returned detail
 * object. The `compound` fields were therefore always undefined at render time, so
 * every closure hit its `|| default` fallback and the compound-conditioned prose
 * was dead. genPressureDetail now forwards economicState.compound.
 */
import { describe, it, expect } from 'vitest';

import { generatePressureSentence } from '../../src/generators/narrativeGenerator.js';

const baseSettlement = compound => ({
  name: 'Highmarch',
  tier: 'town',
  stress: [{ type: 'wartime' }],
  config: {},
  institutions: [],
  npcs: [],
  history: {},
  powerStructure: { factions: [], stability: 'Stable' },
  economicState: { prosperity: 'Moderate', compound },
});

describe('generatePressureSentence plumbs economicState.compound (wartime)', () => {
  it('renders the winning-side sentence when the compound favors the settlement', () => {
    // militaryEffective >= 55 && economyOutput >= 45 → "on the right side of it"
    const sentence = generatePressureSentence(
      baseSettlement({ militaryEffective: 62, economyOutput: 55, criminalEffective: 20 }),
    );
    expect(sentence).toMatch(/on the right side of it/);
    // Must NOT be the losing-side fallback.
    expect(sentence).not.toMatch(/losing people and resources/);
  });

  it('renders the losing-side fallback when the compound does not favor the settlement', () => {
    const sentence = generatePressureSentence(
      baseSettlement({ militaryEffective: 30, economyOutput: 40, criminalEffective: 50 }),
    );
    expect(sentence).toMatch(/losing people and resources/);
    expect(sentence).not.toMatch(/on the right side of it/);
  });

  it('the winning-side branch is unreachable without compound being plumbed', () => {
    // With no compound at all the closure's defaults (militaryEffective||50 >= 55 is
    // false) yield the fallback — proving the winning branch depends on real data
    // reaching the detail object.
    const sentence = generatePressureSentence(baseSettlement(undefined));
    expect(sentence).toMatch(/losing people and resources/);
  });
});
