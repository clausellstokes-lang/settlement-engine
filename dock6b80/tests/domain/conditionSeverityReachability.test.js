/**
 * conditionSeverityReachability.test.js — generated conditions' severity bands
 * are actually reachable.
 *
 * Before the fix, promoteStressorsToConditions left severity undefined for
 * stressors without a numeric severity, so deriveActiveCondition filled in the
 * bare archetype default — EVERY generated condition of an archetype landed at
 * the same severity, and the low (<0.25) / critical (>=0.75) bands were
 * unreachable at generation. The fix derives severity from the archetype
 * default nudged by settlement state (threat, defense, food, prosperity),
 * clamped to [-0.25, +0.18] so a typical settlement stays in its default band.
 */
import { describe, it, expect } from 'vitest';
import { promoteStressorsToConditions } from '../../src/domain/conditionPromotion.js';
import { CONDITION_ARCHETYPE_TEMPLATES } from '../../src/domain/activeConditions.js';

const DIRE = {
  config: { monsterThreat: 'plagued' },
  defenseProfile: { scores: { military: 15, internal: 20, economic: 10 } },
  economicState: {
    prosperity: 'Struggling',
    foodSecurity: { deficitPct: 45 },
  },
};
const IDYLLIC = {
  config: { monsterThreat: 'heartland' },
  defenseProfile: { scores: { military: 80, internal: 82, economic: 78 } },
  economicState: {
    prosperity: 'Prosperous',
    foodSecurity: { isSurplus: true },
  },
};

const promoted = (base, stressor) => {
  const s = promoteStressorsToConditions({ ...base, stressors: [stressor], activeConditions: [] });
  return s.activeConditions || [];
};

describe('generation-derived condition severity responds to settlement state', () => {
  it('a dire settlement pushes famine into the critical band (>= 0.75)', () => {
    // famine default 0.65 + clamped max modifier 0.18 = 0.83.
    const conds = promoted(DIRE, { type: 'famine' });
    const famine = conds.find((c) => c.archetype === 'famine');
    expect(famine).toBeTruthy();
    expect(famine.severity).toBeGreaterThanOrEqual(0.75);
  });

  it('an idyllic settlement pulls a religious-pressure crisis into the low band (< 0.25)', () => {
    // regional_religious_pressure default 0.45 + clamped min modifier -0.25 = 0.20.
    const conds = promoted(IDYLLIC, { type: 'religious_conversion_fracture' });
    const cond = conds.find((c) => c.archetype === 'regional_religious_pressure');
    expect(cond).toBeTruthy();
    expect(cond.severity).toBeLessThan(0.25);
  });

  it('the same archetype lands at different severities under opposite settlement states', () => {
    const direPlague = promoted(DIRE, { type: 'plague' }).find((c) => c.archetype === 'plague');
    const calmPlague = promoted(IDYLLIC, { type: 'plague' }).find((c) => c.archetype === 'plague');
    expect(direPlague.severity).toBeGreaterThan(calmPlague.severity);
    // Both anchored to the archetype default (0.6), shifted at most ±0.25.
    const base = CONDITION_ARCHETYPE_TEMPLATES.plague.defaultSeverity;
    expect(Math.abs(direPlague.severity - base)).toBeLessThanOrEqual(0.25);
    expect(Math.abs(calmPlague.severity - base)).toBeLessThanOrEqual(0.25);
  });

  it('an explicit numeric stressor severity always wins over derivation', () => {
    const conds = promoted(DIRE, { type: 'plague', severity: 0.42 });
    expect(conds.find((c) => c.archetype === 'plague').severity).toBe(0.42);
  });

  it('derived severities are deterministic and clamped to [0, 1]', () => {
    const a = promoted(DIRE, { type: 'famine' });
    const b = promoted(DIRE, { type: 'famine' });
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    for (const c of a) {
      expect(c.severity).toBeGreaterThanOrEqual(0);
      expect(c.severity).toBeLessThanOrEqual(1);
    }
  });
});
