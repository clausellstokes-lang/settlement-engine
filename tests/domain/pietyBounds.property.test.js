/**
 * pietyBounds.property.test.js — the W-F3 BOUND + STATIONARITY pins (§2.4.3) plus the
 * corruption-plane surface corners and the government-synergy / clergy-distortion
 * directions. The composite multiplier can never leave [MULT_MIN, MULT_MAX], the
 * corruption-plane multiplier can never leave [PLANE_MIN, PLANE_MAX], and the
 * temple→piety→effects loop is NON-DIVERGENT (the owner's named runaway is closed by
 * construction — piety multiplies clamped couplings, it cannot mint authority).
 */
import { describe, it, expect } from 'vitest';
import {
  pietyRecord, corruptionPlaneMult, PIETY_TUNING, localMultFromLocal01,
  realmMultFromRealm01, devotionOf, clergyIntegrity,
} from '../../src/domain/worldPulse/piety.js';
import { governmentLawFit } from '../../src/domain/worldPulse/religionLegitimacy.js';

const grid = (n) => Array.from({ length: n + 1 }, (_, i) => i / n);
const fourAxis = (align, law) => ({ alignmentAxis: align, lawAxis: law });

describe('piety composite is bounded [MULT_MIN, MULT_MAX] over the whole input grid', () => {
  it('every (authority × institution × devotion × realm × clergy) reading stays in-bounds', () => {
    const clergies = [null, { e: 1, c: 1, taint: 1, variance: 1, revealedTaint: 1, weight: 1 }, { e: -1, c: -1, taint: 0, variance: 0, revealedTaint: 0, weight: 1 }];
    for (const a of grid(4)) for (const inst of grid(4)) for (const dev of grid(4)) {
      for (const realm01 of grid(4)) for (const clergy of clergies) {
        const rec = pietyRecord({ authority01: a, institutionBacking: inst, devotion01: dev, clergy, realmMult: realmMultFromRealm01(realm01) });
        expect(rec.composite).toBeGreaterThanOrEqual(PIETY_TUNING.MULT_MIN);
        expect(rec.composite).toBeLessThanOrEqual(PIETY_TUNING.MULT_MAX);
        expect(rec.localMult).toBeGreaterThanOrEqual(0.65 - 1e-9);
        expect(rec.localMult).toBeLessThanOrEqual(1.65 + 1e-9);
      }
    }
  });
  it('the multiplier maps hit their spec endpoints exactly', () => {
    expect(localMultFromLocal01(0)).toBeCloseTo(0.65, 10);
    expect(localMultFromLocal01(1)).toBeCloseTo(1.65, 10);
    expect(localMultFromLocal01(PIETY_TUNING.PIVOT_LOCAL)).toBe(1);
    expect(realmMultFromRealm01(0)).toBeCloseTo(0.825, 10);
    expect(realmMultFromRealm01(1)).toBeCloseTo(1.325, 10);
    expect(realmMultFromRealm01(PIETY_TUNING.PIVOT_REALM)).toBe(1);
  });
});

describe('corruption-plane surface — corners, clamp, monotonicity', () => {
  it('is bounded [PLANE_MIN, PLANE_MAX] over the (evil × chaos × bleed) grid', () => {
    for (const e of ['good', 'neutral', 'evil']) for (const c of ['lawful', 'neutral', 'chaotic']) for (const bleed of grid(4)) {
      const m = corruptionPlaneMult(fourAxis(e, c), bleed);
      expect(m).toBeGreaterThanOrEqual(PIETY_TUNING.PLANE_MIN);
      expect(m).toBeLessThanOrEqual(PIETY_TUNING.PLANE_MAX);
    }
  });
  it('lawful-good corner ⇒ ~0 (starves the rot); chaotic-evil corner ⇒ clamped max; centre ⇒ 1.0', () => {
    const lg = corruptionPlaneMult(fourAxis('good', 'lawful'), 1);
    const ce = corruptionPlaneMult(fourAxis('evil', 'chaotic'), 1);
    const centre = corruptionPlaneMult(fourAxis('neutral', 'neutral'), 1);
    expect(lg).toBeCloseTo(PIETY_TUNING.PLANE_FLOOR, 6);
    expect(ce).toBeCloseTo(PIETY_TUNING.PLANE_CEIL, 6);
    expect(centre).toBe(1);
    // superadditive: the CE corner exceeds either single-axis extreme (both restraints absent)
    const le = corruptionPlaneMult(fourAxis('evil', 'lawful'), 1);   // one restraint present
    const cg = corruptionPlaneMult(fourAxis('good', 'chaotic'), 1);  // one restraint present
    expect(ce).toBeGreaterThan(le);
    expect(ce).toBeGreaterThan(cg);
    expect(le).toBeLessThanOrEqual(1);   // a single restraint already holds the rot at/under baseline
    expect(cg).toBeLessThanOrEqual(1);
  });
  it('bleed scales the deviation monotonically (deeper piety ⇒ stronger tilt)', () => {
    let prev = 1;
    for (const bleed of grid(5)) {
      const m = corruptionPlaneMult(fourAxis('evil', 'chaotic'), bleed);
      expect(m).toBeGreaterThanOrEqual(prev - 1e-9);
      prev = m;
    }
  });
});

describe('stationarity — the temple→piety loop is non-divergent (owner runaway pin)', () => {
  it('composite converges + stays bounded as institutions grow to saturation', () => {
    // Model the loop: institution backing climbs toward 1 (temples accrue), piety
    // reads it, and the composite must NOT diverge — it saturates inside MULT_MAX.
    let inst = 0; const seen = [];
    for (let t = 0; t < 200; t++) {
      inst = Math.min(1, inst + 0.02 * (1 - inst));   // slow institutional growth, self-damping
      const rec = pietyRecord({ authority01: 0.8, institutionBacking: inst, devotion01: 0.9, realmMult: 1.325 });
      expect(rec.composite).toBeLessThanOrEqual(PIETY_TUNING.MULT_MAX);
      expect(Number.isFinite(rec.composite)).toBe(true);
      seen.push(rec.composite);
    }
    // the last-K moving average settles (|Δ| across the tail is tiny ⇒ convergent)
    const tail = seen.slice(-20);
    const spread = Math.max(...tail) - Math.min(...tail);
    expect(spread).toBeLessThan(0.02);
  });
});

describe('government-form × law synergy — directions', () => {
  it('law-matched patron props, mismatched patron frets; theocracy = synergy by construction', () => {
    // lawful patron over a lawful form (dukedom) ⇒ +1 alignment; chaotic patron ⇒ −1
    expect(governmentLawFit(fourAxis('neutral', 'lawful'), 'dukedom')).toBe(1);
    expect(governmentLawFit(fourAxis('neutral', 'chaotic'), 'dukedom')).toBe(-1);
    // chaotic patron over a chaotic-lean form (free town) ⇒ +alignment (matched)
    expect(governmentLawFit(fourAxis('neutral', 'chaotic'), 'free town')).toBeGreaterThan(0);
    // merchant council = centre ⇒ 0 (form has no law lean to match/miss)
    expect(governmentLawFit(fourAxis('neutral', 'lawful'), 'merchant council')).toBe(0);
    // theocracy: affinity IS the patron's own law position ⇒ lawSign² = +1 for either pole
    expect(governmentLawFit(fourAxis('neutral', 'lawful'), 'theocracy')).toBe(1);
    expect(governmentLawFit(fourAxis('neutral', 'chaotic'), 'theocracy')).toBe(1);
  });
});

describe('clergy distortion — direction + floor', () => {
  it('flawed / evil / divided clergy weaken integrity; never below the floor', () => {
    const clean = clergyIntegrity({ e: 0, c: 0, taint: 0, variance: 0, revealedTaint: 0, weight: 1 });
    const tainted = clergyIntegrity({ e: 0.5, c: 0, taint: 1, variance: 0, revealedTaint: 0, weight: 1 });
    const worst = clergyIntegrity({ e: 1, c: 1, taint: 1, variance: 1, revealedTaint: 1, weight: 1 });
    expect(clean).toBe(1);
    expect(tainted).toBeLessThan(clean);
    expect(worst).toBeGreaterThanOrEqual(PIETY_TUNING.CLERGY_INTEGRITY_MIN - 1e-9);
    // a devout town with corrupt clergy amplifies LESS than one with clean clergy
    const dirty = pietyRecord({ authority01: 1, institutionBacking: 1, devotion01: 1, clergy: { e: 1, c: 0.5, taint: 1, variance: 0.5, revealedTaint: 0, weight: 1 }, realmMult: 1 });
    const pure = pietyRecord({ authority01: 1, institutionBacking: 1, devotion01: 1, clergy: null, realmMult: 1 });
    expect(dirty.localMult).toBeLessThan(pure.localMult);
  });
});

describe('devotionOf — bounded reading off a religion state', () => {
  it('0 when no patron; higher for an ascendant patron than a cult', () => {
    expect(devotionOf(null)).toBe(0);
    expect(devotionOf({ deities: {} })).toBe(0);
    const asc = devotionOf({ patronRef: 'p', capacity: 3, deities: { p: { share: 100, standing: 'ascendant' } } });
    const cult = devotionOf({ patronRef: 'p', capacity: 3, deities: { p: { share: 20, standing: 'cult' } } });
    expect(asc).toBeGreaterThan(cult);
    expect(asc).toBeLessThanOrEqual(1);
  });
});
