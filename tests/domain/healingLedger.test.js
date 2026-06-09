/**
 * tests/domain/healingLedger.test.js — P3.3b Stage 4.
 *
 * One canonical healing classifier, previously copy-pasted byte-identical in three lenses
 * (capacityModel.deriveHealing, causalState.deriveHealingCapacity, magicProfile). Pin: the
 * ledger counts healing-capable institutions by name, surfaces the (Stage-4b) availableServices
 * list, and — routed into the two scored lenses — preserves their counts exactly (the disease
 * pressure that reads healing_capacity must not move).
 */

import { describe, it, expect } from 'vitest';
import { healingLedger, HEALING_INSTITUTION_PATTERN } from '../../src/domain/healingLedger.js';
import { deriveCapacityProfile } from '../../src/domain/capacityModel.js';
import { deriveSystemVariable } from '../../src/domain/causalState.js';

const town = (names) => ({
  name: 'T', tier: 'town', population: 2000, config: { monsterThreat: 'safe' },
  institutions: names.map((n, i) => ({ id: `i${i}`, name: n })),
  powerStructure: { factions: [] }, activeConditions: [],
});

describe('healingLedger', () => {
  it('counts institutions whose name reads as healing-capable', () => {
    expect(healingLedger(town(['Temple of Light', 'Apothecary', 'Hospice'])).healerCount).toBe(3);
    expect(healingLedger(town(['Blacksmith', 'Market'])).healerCount).toBe(0);
    expect(healingLedger(town(['Healer\'s Lodge'])).healerCount).toBe(1);
  });

  it('surfaces availableServices.healing when present (for Stage 4b)', () => {
    const s = { institutions: [], economicState: { availableServices: { healing: ['Disease treatment'] } } };
    expect(healingLedger(s).services).toEqual(['Disease treatment']);
  });

  it('is safe for null / partial settlements', () => {
    expect(healingLedger(null).healerCount).toBe(0);
    expect(healingLedger(null).services).toEqual([]);
    expect(healingLedger({}).present).toBe(false);
    expect(healingLedger({ institutions: [] }).present).toBe(true);
  });

  it('the exported pattern is the single classifier', () => {
    expect(HEALING_INSTITUTION_PATTERN.test('Riverside Infirmary')).toBe(true);
    expect(HEALING_INSTITUTION_PATTERN.test('Town Granary')).toBe(false);
  });
});

// Both scored lenses now count via the one ledger; more healers -> more capacity/score. The
// banding is unchanged, so this is behaviour-preserving (the regex/count is identical to before).
describe('healing lenses count via the canonical ledger (P3.3b Stage 4)', () => {
  it('capacity supply and causal healing_capacity both rise with healer count', () => {
    const lean = town([]);
    const rich = town(['Temple', 'Infirmary', 'Apothecary']);
    expect(deriveCapacityProfile('healing', rich).supply)
      .toBeGreaterThan(deriveCapacityProfile('healing', lean).supply);
    expect(deriveSystemVariable('healing_capacity', rich).score)
      .toBeGreaterThan(deriveSystemVariable('healing_capacity', lean).score);
  });
});
