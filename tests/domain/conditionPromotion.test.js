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

  // Wave 5 #4: world-pulse stressors carry their display text as `label`
  // (stressors.js normalizeStressor), not `name` — the match text skipped
  // it, so a label-only crisis silently never promoted.
  it('matches on stressor.label (the world-pulse field)', () => {
    expect(archetypeForStressor({ label: 'Mass migration from the southlands' }))
      .toBe('regional_migration_pressure');
    expect(archetypeForStressor({ type: 'regional_pressure', label: 'Plague spreading along the river' }))
      .toBe('plague');
    expect(archetypeForStressor({ label: 'Petty squabbles at the market' })).toBeNull();
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

  it('promotes a label-only world-pulse stressor and uses the label for display', () => {
    const s = settlementWith([{ type: 'mass_migration', label: 'Columns of refugees on the king\'s road', severity: 0.6 }]);
    const conds = promoteStressorsToConditions(s).activeConditions || [];
    const cond = conds.find(c => c.archetype === 'regional_migration_pressure');
    expect(cond).toBeTruthy();
    // The generation cause cites the human-readable label, not the bare type token.
    expect(cond.causes.some(c => String(c.detail).includes('Columns of refugees on the king\'s road'))).toBe(true);
  });
});

describe('every generation stress type promotes (gap closure)', () => {
  // Before these rules, six of the fifteen generation stress types (and three
  // regex near-misses: wartime, mass_migration, insurgency) never produced an
  // activeCondition — the crisis was pure flavor text to the substrate.
  const EXPECTED = {
    under_siege: 'war_pressure',
    famine: 'famine',
    plague_onset: 'plague',
    occupied: 'vassal_extraction',
    politically_fractured: 'regional_authority_instability',
    indebted: 'regional_tax_revenue_disruption',
    recently_betrayed: 'faction_challenge',
    infiltrated: 'regional_criminal_pressure',
    succession_void: 'dominant_npc_removed',
    monster_pressure: 'war_pressure',
    insurgency: 'rebellion',
    religious_conversion: 'regional_religious_pressure',
    slave_revolt: 'rebellion',
    wartime: 'war_pressure',
    mass_migration: 'regional_migration_pressure',
  };

  for (const [type, archetype] of Object.entries(EXPECTED)) {
    it(`${type} -> ${archetype}`, () => {
      expect(archetypeForStressor({ type, name: type.replace(/_/g, ' ') })).toBe(archetype);
    });
  }

  it('a recently betrayed settlement now feeds the causal substrate', () => {
    const s = settlementWith([{ type: 'recently_betrayed', name: 'Aftermath of Betrayal', severity: 0.6 }]);
    const conds = promoteStressorsToConditions(s).activeConditions || [];
    expect(conds.some(c => c.archetype === 'faction_challenge')).toBe(true);
  });
});

// Wave 7 #3a: /fractur/ preceded the religious rule, so the religious type
// 'religious_conversion_fracture' promoted as regional_authority_instability —
// a religious crisis registering as pure political instability. The religious
// family now wins for religious types; the political family is unchanged.
describe('religious family outranks the /fractur/ shadow (Wave 7)', () => {
  it('religious_conversion_fracture promotes to regional_religious_pressure', () => {
    expect(archetypeForStressor({ type: 'religious_conversion_fracture', name: 'Religious conversion fracture' }))
      .toBe('regional_religious_pressure');
  });

  it('political_fracture still promotes to regional_authority_instability', () => {
    expect(archetypeForStressor({ type: 'political_fracture', name: 'Political fracture' }))
      .toBe('regional_authority_instability');
  });
});

// Wave 7 #2a: the magical crisis family had NO promotion target — a settlement
// under magical_instability or the wandering magic_deadzone carried the crisis
// as pure narrative; the substrate's magical_stability variable never heard it.
describe('magical crisis family promotes to magical_instability (Wave 7)', () => {
  it('maps both family members (and the world-pulse labels)', () => {
    expect(archetypeForStressor({ type: 'magical_instability' })).toBe('magical_instability');
    expect(archetypeForStressor({ type: 'magic_deadzone' })).toBe('magical_instability');
    expect(archetypeForStressor({ label: 'Magical instability' })).toBe('magical_instability');
    expect(archetypeForStressor({ label: 'Magic deadzone' })).toBe('magical_instability');
  });

  it('the arcane alternatives accept snake_case like the rest of the family', () => {
    // Regression: the rule used a literal space for /arcane (surge|storm|collapse)/
    // while its siblings used [\s_]? — snake_case 'arcane_surge' fell through
    // to the custom_crisis fallback instead of promoting.
    expect(archetypeForStressor({ type: 'arcane_surge' })).toBe('magical_instability');
    expect(archetypeForStressor({ type: 'arcane_storm' })).toBe('magical_instability');
    expect(archetypeForStressor({ label: 'Arcane collapse' })).toBe('magical_instability');
  });

  it('a deadzone stressor lowers magical_stability in the substrate after promotion', () => {
    const s = settlementWith([{ type: 'magic_deadzone', label: 'Magic deadzone', severity: 0.7 }]);
    const before = deriveCausalState(s).scores.magical_stability;
    const after = deriveCausalState(promoteStressorsToConditions(s)).scores.magical_stability;
    expect(after).toBeLessThan(before);
  });
});

// Wave 7 #3b: occupation -> vassal_extraction is honest for BOTH faces of an
// occupation. R3 classified the condition as TRADE pressure at the pulse layer,
// but the condition's affectedSystems carry trade_connectivity AND
// defense_readiness — so the causal substrate (which the pulse layer's
// conflict/defense pressures read via the scores) registers economic
// extraction and military strain end to end from the one promotion.
describe('an occupied settlement registers BOTH extraction and military pressure (Wave 7)', () => {
  it('promotes occupation to vassal_extraction with both systems tagged', () => {
    const s = settlementWith([{ type: 'occupied', name: 'Under Occupation', severity: 0.6 }]);
    const cond = (promoteStressorsToConditions(s).activeConditions || [])
      .find(c => c.archetype === 'vassal_extraction');
    expect(cond).toBeTruthy();
    expect(cond.affectedSystems).toContain('trade_connectivity');
    expect(cond.affectedSystems).toContain('defense_readiness');
  });

  it('trade_connectivity AND defense_readiness both fall, attributed to the condition', () => {
    const s = settlementWith([{ type: 'occupied', name: 'Under Occupation', severity: 0.6 }]);
    const occupied = promoteStressorsToConditions(s);
    const before = deriveCausalState(s).scores;
    const after = deriveCausalState(occupied).scores;
    expect(after.trade_connectivity).toBeLessThan(before.trade_connectivity);
    expect(after.defense_readiness).toBeLessThan(before.defense_readiness);
    // Receipts name the real source on both variables.
    const vars = deriveCausalState(occupied).variables;
    const condId = occupied.activeConditions.find(c => c.archetype === 'vassal_extraction').id;
    expect(vars.trade_connectivity.contributors.some(c => c.source === condId)).toBe(true);
    expect(vars.defense_readiness.contributors.some(c => c.source === condId)).toBe(true);
  });
});
