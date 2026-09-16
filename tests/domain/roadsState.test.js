/**
 * roadsState.test.js — THE ROADS state leaf (R-1a): the dormancy gate, the participation
 * chokepoint predicate, the pure roads math, and the write-bounded applicators.
 * DESIGN_THE_ROADS.md §1/§3/§4/§7/§9/§10.
 */
import { describe, it, expect } from 'vitest';
import {
  roadsActive, isOffStage, ROADS_TUNING,
  riskToleranceOf, militaryQuality01, protectionOf, exposureOf, captureProbability,
  termWeeksFor, conversionFlawFactor, conversionProbability,
  applyLegitimacySteps, applyProsperityBandSteps, roadsImportanceWeight,
} from '../../src/domain/roads/state.js';
import { CORRUPTIBLE_FLAWS } from '../../src/domain/corruption.js';

describe('roads state — roadsActive (the virtual dormancy gate, §1 law 2)', () => {
  it('is false when the flag is absent (dark, byte-identical)', () => {
    expect(roadsActive({ simulationRules: {} })).toBe(false);
    expect(roadsActive({ simulationRules: { warLayerEnabled: true } })).toBe(false);
    expect(roadsActive({})).toBe(false);
    expect(roadsActive(null)).toBe(false);
    expect(roadsActive(undefined)).toBe(false);
  });
  it('is true ONLY for an explicit === true', () => {
    expect(roadsActive({ simulationRules: { roadsEnabled: true } })).toBe(true);
    expect(roadsActive({ simulationRules: { roadsEnabled: 1 } })).toBe(false);
    expect(roadsActive({ simulationRules: { roadsEnabled: 'true' } })).toBe(false);
  });
});

describe('roads state — isOffStage (the ONE participation chokepoint, §8)', () => {
  it('a DM-shelved (stasis) NPC is off-stage', () => {
    expect(isOffStage({ name: 'A', stasis: { reason: 'imprisoned' } })).toBe(true);
    expect(isOffStage({ name: 'A', stasis: { reason: 'journey' } })).toBe(true);
  });
  it('a roads HOSTAGE is off-stage', () => {
    expect(isOffStage({ name: 'A', whereabouts: { state: 'hostage', placeId: 'x' } })).toBe(true);
  });
  it('a TRAVELER (outbound/visiting/returning) is NEVER off-stage — travel is narrative (§1 law 5)', () => {
    expect(isOffStage({ name: 'A', whereabouts: { state: 'traveling' } })).toBe(false);
    expect(isOffStage({ name: 'A', whereabouts: { state: 'visiting' } })).toBe(false);
    expect(isOffStage({ name: 'A', whereabouts: { state: 'returning' } })).toBe(false);
  });
  it('a home NPC (no stasis, no whereabouts) is on-stage', () => {
    expect(isOffStage({ name: 'A' })).toBe(false);
    expect(isOffStage(null)).toBe(false);
    expect(isOffStage(undefined)).toBe(false);
  });
});

describe('roads state — riskToleranceOf (§4 risk coherence)', () => {
  it('timid (cowardly/paranoid) → 0.35; bold/prideful/zealous → 0.9; cautious → 0.5; base → 0.65', () => {
    expect(riskToleranceOf({ personality: { flaw: 'cowardly' } })).toBe(0.35);
    expect(riskToleranceOf({ personality: { dominant: 'paranoid' } })).toBe(0.35);
    expect(riskToleranceOf({ personality: { dominant: 'bold' } })).toBe(0.9);
    expect(riskToleranceOf({ personality: { flaw: 'prideful' } })).toBe(0.9);
    expect(riskToleranceOf({ personality: { dominant: 'cautious' } })).toBe(0.5);
    expect(riskToleranceOf({ personality: { dominant: 'wise' } })).toBe(0.65);
    expect(riskToleranceOf({})).toBe(0.65);
  });
  it('timid wins over bold when both present (a coward is cautious first)', () => {
    expect(riskToleranceOf({ personality: { dominant: 'bold', flaw: 'cowardly' } })).toBe(0.35);
  });
});

describe('roads state — militaryQuality01 (§7 amendment C, clamped [0.6,1.6])', () => {
  it('a zero-readiness settlement floors at 0.6', () => {
    expect(militaryQuality01({ readiness01: 0, experience01: 0, capacityBand01: 0 })).toBe(0.6);
  });
  it('a maxed settlement caps at 1.6', () => {
    expect(militaryQuality01({ readiness01: 1, experience01: 1, capacityBand01: 1 })).toBe(1.6);
  });
  it('blends the three facets (0.6 + 0.5r + 0.3e + 0.2c)', () => {
    expect(militaryQuality01({ readiness01: 0.4, experience01: 1, capacityBand01: 0.5 })).toBeCloseTo(0.6 + 0.2 + 0.3 + 0.1, 6);
  });
});

describe('roads state — protectionOf (§7 escort factors)', () => {
  it('notable 1.4 · key 1.7 · pillar 2.0 at neutral military quality', () => {
    expect(protectionOf({ importanceWeight: 0.4, militaryQuality01: 1 })).toBeCloseTo(1.4, 6);
    expect(protectionOf({ importanceWeight: 0.7, militaryQuality01: 1 })).toBeCloseTo(1.7, 6);
    expect(protectionOf({ importanceWeight: 1.0, militaryQuality01: 1 })).toBeCloseTo(2.0, 6);
  });
  it('military quality multiplies the escort factor', () => {
    expect(protectionOf({ importanceWeight: 1.0, militaryQuality01: 1.6 })).toBeCloseTo(3.2, 6);
  });
});

describe('roads state — exposureOf (§7)', () => {
  it('0.45 + 0.08×legWeeks + 0.15 while visiting, clamped [0,1]', () => {
    expect(exposureOf({ legWeeks: 0, phase: 'outbound' })).toBeCloseTo(0.45, 6);
    expect(exposureOf({ legWeeks: 2, phase: 'outbound' })).toBeCloseTo(0.61, 6);
    expect(exposureOf({ legWeeks: 2, phase: 'visiting' })).toBeCloseTo(0.76, 6);
    expect(exposureOf({ legWeeks: 100, phase: 'visiting' })).toBe(1);
  });
});

describe('roads state — captureProbability (§7, partial-bypass α, capped 0.6)', () => {
  it('T1 (α=0.25) barely respects a pillar escort; T3 (α=1.0) rewards it', () => {
    const t1 = captureProbability({ base: ROADS_TUNING.T1_BASE, exposure: 0.6, protection: 2.0, alpha: ROADS_TUNING.T1_ALPHA });
    const t3 = captureProbability({ base: ROADS_TUNING.T3_BASE, exposure: 0.6, protection: 2.0, alpha: ROADS_TUNING.T3_ALPHA });
    // T1 divisor 2^0.25≈1.19; T3 divisor 2^1=2 — the escort bites T3 far harder.
    expect(t1).toBeCloseTo(0.35 * 0.6 / Math.pow(2, 0.25), 6);
    expect(t3).toBeCloseTo(0.12 * 0.6 / 2, 6);
    expect(t1).toBeGreaterThan(t3);
  });
  it('never exceeds the 0.6 cap', () => {
    expect(captureProbability({ base: 5, exposure: 1, protection: 1, alpha: 1 })).toBe(0.6);
  });
  it('never goes negative', () => {
    expect(captureProbability({ base: 0, exposure: 1, protection: 1, alpha: 1 })).toBe(0);
  });
});

describe('roads state — termWeeksFor (§9)', () => {
  it('notable ~23 · key ~31 · pillar 39', () => {
    expect(termWeeksFor(0.4)).toBe(23);
    expect(termWeeksFor(0.7)).toBe(31);
    expect(termWeeksFor(1.0)).toBe(39);
  });
});

describe('roads state — conversion (§10, LOW ~2-12%)', () => {
  it('flaw factor: corruptible 1.6 · zealous/principled 0.4 · base 1.0', () => {
    const someFlaw = [...CORRUPTIBLE_FLAWS][0];
    expect(conversionFlawFactor({ personality: { flaw: someFlaw } }, CORRUPTIBLE_FLAWS)).toBe(1.6);
    expect(conversionFlawFactor({ personality: { dominant: 'zealous' } }, CORRUPTIBLE_FLAWS)).toBe(0.4);
    expect(conversionFlawFactor({ personality: { dominant: 'principled' } }, CORRUPTIBLE_FLAWS)).toBe(0.4);
    expect(conversionFlawFactor({ personality: { dominant: 'wise' } }, CORRUPTIBLE_FLAWS)).toBe(1.0);
  });
  it('probability stays LOW across the range', () => {
    // pillar (term 39), corruptible flaw → the HIGH end
    const hi = conversionProbability({ flawFactor: 1.6, termWeeks: 39 });
    expect(hi).toBeGreaterThan(0.05);
    expect(hi).toBeLessThan(0.13);
    // notable (term 23), resistant → the LOW end
    const lo = conversionProbability({ flawFactor: 0.4, termWeeks: 23 });
    expect(lo).toBeGreaterThan(0);
    expect(lo).toBeLessThan(0.03);
  });
});

describe('roads state — applyLegitimacySteps (self-contained, §6/§9)', () => {
  const mk = (score) => ({ saveId: 's', settlement: { powerStructure: { publicLegitimacy: { score, label: 'x' } } } });
  it('applies an integer clamped [0,100] delta in place', () => {
    const updates = [mk(50)];
    const idx = new Map([['s', 0]]);
    const out = applyLegitimacySteps(updates, idx, new Map([['s', -3]]));
    expect(out[0].settlement.powerStructure.publicLegitimacy.score).toBe(47);
    expect(out).not.toBe(updates); // clone-on-write
  });
  it('clamps at the floor', () => {
    const out = applyLegitimacySteps([mk(1)], new Map([['s', 0]]), new Map([['s', -5]]));
    expect(out[0].settlement.powerStructure.publicLegitimacy.score).toBe(0);
  });
  it('skips a legacy bare-number legitimacy (the Number.isFinite guard)', () => {
    const updates = [{ saveId: 's', settlement: { powerStructure: { publicLegitimacy: 55 } } }];
    const out = applyLegitimacySteps(updates, new Map([['s', 0]]), new Map([['s', -3]]));
    expect(out).toBe(updates); // untouched, same reference
  });
  it('empty hits ⇒ same reference (no allocation)', () => {
    const updates = [mk(50)];
    expect(applyLegitimacySteps(updates, new Map([['s', 0]]), new Map())).toBe(updates);
  });
});

describe('roads state — applyProsperityBandSteps (self-contained, via prosperityRank)', () => {
  it('steps a string-label band up/down in kind', () => {
    const updates = [{ saveId: 's', settlement: { economicState: { prosperity: 'Moderate' } } }];
    const out = applyProsperityBandSteps(updates, new Map([['s', 0]]), new Map([['s', 1]]));
    expect(out[0].settlement.economicState.prosperity).toBe('Comfortable');
  });
  it('steps an object-shaped band in kind (preserves the object)', () => {
    const updates = [{ saveId: 's', settlement: { economicState: { prosperity: { tier: 'Moderate', note: 'keep' } } } }];
    const out = applyProsperityBandSteps(updates, new Map([['s', 0]]), new Map([['s', -1]]));
    expect(out[0].settlement.economicState.prosperity).toEqual({ tier: 'Poor', note: 'keep' });
  });
  it('clamps at the ladder edges and no-ops a net-zero step (same reference)', () => {
    const updates = [{ saveId: 's', settlement: { economicState: { prosperity: 'Wealthy' } } }];
    expect(applyProsperityBandSteps(updates, new Map([['s', 0]]), new Map([['s', 3]]))).toBe(updates);
  });
});

describe('roads state — invariants', () => {
  it('ROADS_TUNING is frozen', () => {
    expect(Object.isFrozen(ROADS_TUNING)).toBe(true);
  });
  it('roadsImportanceWeight maps importance labels to [0,1]', () => {
    expect(roadsImportanceWeight({ importance: 'notable' })).toBe(0.4);
    expect(roadsImportanceWeight({ importance: 'key' })).toBe(0.7);
    expect(roadsImportanceWeight({ importance: 'pillar' })).toBe(1.0);
    expect(roadsImportanceWeight({ importance: 'minor' })).toBe(0.0);
  });
});
