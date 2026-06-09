/**
 * tests/domain/conditionPromotion.test.js — P0.3 invariant.
 *
 * A settlement carrying a live-crisis stressor must promote that crisis into a
 * canonical activeCondition, and the causal substrate (which reads conditions by
 * affectedSystems) must then react. Ambient stressors must NOT promote. Promotion
 * must be deterministic + idempotent.
 */

import { describe, it, expect } from 'vitest';
import { promoteStressorsToConditions, archetypeForStressor } from '../../src/domain/conditionPromotion.js';
import { deriveCausalState } from '../../src/domain/causalState.js';

function settlementWith(stressors) {
  return {
    name: 'Hollowmere', tier: 'town', population: 1800,
    config: { tradeRouteAccess: 'road', monsterThreat: 'safe' },
    economicState: { prosperity: 'Modest' },
    institutions: [{ id: 'institution.granary', name: 'Granary', status: 'active' }],
    powerStructure: { factions: [], publicLegitimacy: { score: 60 } },
    stressors,
    activeConditions: [],
  };
}

describe('archetypeForStressor', () => {
  it('maps live crises to the right archetype', () => {
    expect(archetypeForStressor({ type: 'plague_onset', name: 'Disease Outbreak' })).toBe('plague');
    expect(archetypeForStressor({ type: 'famine', name: 'Crop Failure' })).toBe('famine');
    expect(archetypeForStressor({ name: 'Under Siege' })).toBe('war_pressure');
    expect(archetypeForStressor({ type: 'refugee_influx' })).toBe('regional_migration_pressure');
  });

  it('returns null for ambient / non-crisis stressors', () => {
    expect(archetypeForStressor({ type: 'petty_banditry', name: 'Petty Banditry' })).toBeNull();
    expect(archetypeForStressor({ type: 'economic_slump' })).toBeNull();
    expect(archetypeForStressor({})).toBeNull();
  });
});

describe('promoteStressorsToConditions (P0.3)', () => {
  it('promotes a plague stressor into a plague activeCondition', () => {
    const s = settlementWith([{ type: 'plague_onset', name: 'Disease Outbreak', severity: 0.7 }]);
    const out = promoteStressorsToConditions(s);
    const conds = out.activeConditions || [];
    expect(conds.some(c => c.archetype === 'plague')).toBe(true);
    // Severity carried from the stressor.
    expect(conds.find(c => c.archetype === 'plague').severity).toBeCloseTo(0.7, 5);
  });

  it('lowers a relevant causal variable after promotion (substrate reacts)', () => {
    const s = settlementWith([{ type: 'famine', name: 'Crop Failure' }]);
    const before = deriveCausalState(s).scores.food_security;
    const after = deriveCausalState(promoteStressorsToConditions(s)).scores.food_security;
    expect(after).toBeLessThan(before);
  });

  it('does NOT promote ambient stressors', () => {
    const s = settlementWith([{ type: 'petty_banditry', name: 'Petty Banditry' }]);
    expect(promoteStressorsToConditions(s).activeConditions).toEqual([]);
  });

  it('collapses two distinct same-archetype stressors into ONE condition (max severity)', () => {
    const s = settlementWith([
      { type: 'plague_onset', name: 'Disease Outbreak', severity: 0.5 },
      { type: 'pestilence',   name: 'Creeping Fever',   severity: 0.8 },
    ]);
    const plagueConds = (promoteStressorsToConditions(s).activeConditions || [])
      .filter(c => c.archetype === 'plague');
    expect(plagueConds).toHaveLength(1);
    expect(plagueConds[0].severity).toBeCloseTo(0.8, 5);
  });

  it('is idempotent — running twice yields the same conditions', () => {
    const s = settlementWith([{ type: 'plague_onset', name: 'Disease Outbreak' }]);
    const once = promoteStressorsToConditions(s);
    const twice = promoteStressorsToConditions(once);
    expect(twice.activeConditions).toEqual(once.activeConditions);
  });

  it('is a no-op for a settlement with no promotable stressors', () => {
    const s = settlementWith([]);
    expect(promoteStressorsToConditions(s)).toBe(s);
  });
});
