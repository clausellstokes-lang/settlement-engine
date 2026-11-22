/**
 * tests/domain/governanceLedger.test.js — P3.3b Stage 2b.
 *
 * The conserved legitimacy quantity has ONE read-point. Pin: it reads .score (+ label)
 * off the publicLegitimacy object, honours a legacy bare number, defaults neutral with
 * present:false, and — routed through every legitimacy lens — moves them all in the same
 * direction while each keeps its own transfer weight.
 */

import { describe, it, expect } from 'vitest';
import { governanceLedger } from '../../src/domain/governanceLedger.js';
import { deriveSystemVariable } from '../../src/domain/causalState.js';
import { deriveCapacityProfile } from '../../src/domain/capacityModel.js';

describe('governanceLedger', () => {
  it('reads the score + label off the publicLegitimacy object', () => {
    const g = governanceLedger({ powerStructure: { publicLegitimacy: { score: 72, label: 'Respected' } } });
    expect(g.present).toBe(true);
    expect(g.legitimacyScore).toBe(72);
    expect(g.legitimacyLabel).toBe('Respected');
  });

  it('honours a legacy bare-number legitimacy', () => {
    const g = governanceLedger({ powerStructure: { publicLegitimacy: 40 } });
    expect(g.present).toBe(true);
    expect(g.legitimacyScore).toBe(40);
    expect(g.legitimacyLabel).toBe(null);
  });

  it('returns neutral (present:false) for an un-generated settlement', () => {
    expect(governanceLedger({}).present).toBe(false);
    expect(governanceLedger({}).legitimacyScore).toBe(50);
    expect(governanceLedger(null).present).toBe(false);
  });

  it('coerces a non-numeric score to neutral/absent', () => {
    expect(governanceLedger({ powerStructure: { publicLegitimacy: { score: 'high' } } }).present).toBe(false);
  });
});

// Cohesion: every legitimacy lens now reads the one ledger, so a legacy bare-number
// legitimacy moves them all (previously the capacity + causal lenses skipped a bare number;
// only the volatility branch normalized it). Each lens still keeps its own transfer weight.
describe('governance ledger feeds every legitimacy lens (P3.3b Stage 2b)', () => {
  const town = (publicLegitimacy) => ({
    name: 'T', tier: 'town', population: 2000, config: { monsterThreat: 'safe' },
    institutions: [], powerStructure: { factions: [], publicLegitimacy }, activeConditions: [],
  });

  it('causal public_legitimacy tracks the score (object AND legacy number)', () => {
    expect(deriveSystemVariable('public_legitimacy', town({ score: 80 })).score)
      .toBeGreaterThan(deriveSystemVariable('public_legitimacy', town({ score: 20 })).score);
    expect(deriveSystemVariable('public_legitimacy', town(80)).score)
      .toBeGreaterThan(deriveSystemVariable('public_legitimacy', town(20)).score);
  });

  it('causal ruling_authority and administrative capacity both rise with legitimacy', () => {
    expect(deriveSystemVariable('ruling_authority', town({ score: 80 })).score)
      .toBeGreaterThan(deriveSystemVariable('ruling_authority', town({ score: 20 })).score);
    expect(deriveCapacityProfile('administrative', town({ score: 80 })).supply)
      .toBeGreaterThan(deriveCapacityProfile('administrative', town({ score: 20 })).supply);
  });
});
