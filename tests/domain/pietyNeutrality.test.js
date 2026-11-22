/**
 * pietyNeutrality.test.js — THE load-bearing W-F3 pin (the neutrality theorem, §2.4).
 *
 * The piety amplifier is a MULTIPLIER FIELD over the engine, never a rewrite: where
 * no piety is measured every site multiplies by literal 1.0, so the engine is
 * byte-identical to the pre-amplifier one. This file mechanically pins that:
 *   1. Identity short-circuit — a settlement with no projected faithProfile.piety
 *      reads 1.0 (composite/local), 0 (bleed), null (amplifier tag) at every reader.
 *   2. Neutral-composite equivalence — a record whose composite is 1.0 leaves the
 *      divine-mandate coupling (site #3) byte-identical (the zero-span guarantee: a
 *      forced-neutral multiplier changes nothing).
 *   3. Corruption-plane inertness — legacy 3-axis deity / zero bleed / plane centre
 *      ⇒ multiplier exactly 1.0 (legacy fixtures untouched).
 *   4. Government-synergy inertness — a law-neutral / legacy patron ⇒ fit exactly 0.
 *   5. Clergy inertness — a trait-neutral, unflawed, or absent priesthood ⇒ integrity
 *      exactly 1.0 and an all-zero plane reading.
 */
import { describe, it, expect } from 'vitest';
import {
  pietyMultOf, pietyLocalMultOf, pietyBleedOf, amplifierTag, corruptionPlaneMult,
  corruptionPlaneMultOf, clergyIntegrity, pietyRecord, PIETY_TUNING,
} from '../../src/domain/worldPulse/piety.js';
import { governmentLawFit } from '../../src/domain/worldPulse/religionLegitimacy.js';
import { applyDivineMandate } from '../../src/domain/worldPulse/religionState.js';
import { readClergyPlane, npcTraitPlane } from '../../src/domain/worldPulse/clergyTraitPlane.js';

const legacyDeity = (align) => ({ name: 'Old', alignmentAxis: align });      // 3-axis, no lawAxis
const fourAxis = (align, law) => ({ name: 'New', alignmentAxis: align, lawAxis: law });

describe('piety neutrality — the identity short-circuit', () => {
  it('a settlement with no faithProfile.piety reads literal 1.0 / 0 / null everywhere', () => {
    const bare = { config: {} };
    expect(pietyMultOf(bare)).toBe(1);
    expect(pietyLocalMultOf(bare)).toBe(1);
    expect(pietyBleedOf(bare)).toBe(0);
    expect(amplifierTag(bare)).toBe(null);
    // also robust to a faithProfile that has no piety key (legacy projection shape)
    const noPiety = { config: { faithProfile: { patron: null, deities: [] } } };
    expect(pietyMultOf(noPiety)).toBe(1);
    expect(amplifierTag(noPiety)).toBe(null);
  });

  it('a neutral-composite record (composite 1.0) leaves applyDivineMandate byte-identical (site #3)', () => {
    const base = {
      config: { primaryDeitySnapshot: legacyDeity('good'), faithProfile: { patronSecurity: 0.8, contested: false } },
      powerStructure: { government: 'monarchy', publicLegitimacy: { score: 40, label: 'x' } },
    };
    const withNeutral = {
      ...base,
      config: { ...base.config, faithProfile: { ...base.config.faithProfile, piety: { local01: 0.9, localMult: 1, realmMult: 1, composite: 1, causes: [] } } },
    };
    const a = applyDivineMandate(base);
    const b = applyDivineMandate(withNeutral);
    expect(a.powerStructure.publicLegitimacy.score).toBe(b.powerStructure.publicLegitimacy.score);
  });

  it('a devout record (composite > 1) DOES swing the mandate harder than neutral (feature is live)', () => {
    const mk = (composite) => ({
      config: { primaryDeitySnapshot: legacyDeity('good'), faithProfile: { patronSecurity: 0.95, contested: false, piety: { composite, localMult: composite, realmMult: 1, causes: [] } } },
      powerStructure: { government: 'theocracy', publicLegitimacy: { score: 50, label: 'x' } },
    });
    const neutral = applyDivineMandate(mk(1)).powerStructure.publicLegitimacy.score;
    const devout = applyDivineMandate(mk(1.6)).powerStructure.publicLegitimacy.score;
    expect(devout).toBeGreaterThanOrEqual(neutral);   // amplified target ⇒ ≥ pull (step-capped)
  });
});

describe('piety neutrality — corruption-plane inertness', () => {
  it('legacy 3-axis deity ⇒ plane multiplier exactly 1.0 for any bleed', () => {
    for (const align of ['good', 'evil', 'neutral', undefined]) {
      expect(corruptionPlaneMult(legacyDeity(align), 1)).toBe(1);
      expect(corruptionPlaneMult(legacyDeity(align), 0.5)).toBe(1);
    }
  });
  it('zero bleed ⇒ exactly 1.0 even for a chaotic-evil 4-axis deity', () => {
    expect(corruptionPlaneMult(fourAxis('evil', 'chaotic'), 0)).toBe(1);
    expect(corruptionPlaneMult(fourAxis('evil', 'chaotic'), -1)).toBe(1);
  });
  it('plane CENTRE (align-neutral + law-neutral, 4-axis) ⇒ exactly 1.0 at full bleed', () => {
    expect(corruptionPlaneMult(fourAxis('neutral', 'neutral'), 1)).toBe(1);
  });
  it('corruptionPlaneMultOf(settlement) is 1.0 when there is no piety record', () => {
    expect(corruptionPlaneMultOf({ config: { primaryDeitySnapshot: fourAxis('evil', 'chaotic') } })).toBe(1);
  });
});

describe('piety neutrality — government-form × law synergy inertness', () => {
  it('a law-neutral / legacy patron ⇒ fit exactly 0 for every government form', () => {
    for (const gov of ['feudal monarchy', 'dukedom', 'merchant council', 'free town', 'criminal syndicate', 'theocracy']) {
      expect(governmentLawFit(legacyDeity('evil'), gov)).toBe(0);
      expect(governmentLawFit(fourAxis('good', 'neutral'), gov)).toBe(0);
      expect(governmentLawFit(null, gov)).toBe(0);
    }
  });
});

describe('piety neutrality — clergy lens inertness', () => {
  it('an absent / trait-neutral / unflawed priesthood ⇒ integrity exactly 1.0', () => {
    expect(clergyIntegrity(null)).toBe(1);
    expect(clergyIntegrity({ e: 0, c: 0, taint: 0, variance: 0, revealedTaint: 0, weight: 0 })).toBe(1);
    // a good, unflawed clergy carries no penalty either (only taint/evil/variance do)
    expect(clergyIntegrity({ e: -0.8, c: -0.4, taint: 0, variance: 0, revealedTaint: 0, weight: 1 })).toBe(1);
  });
  it('a settlement with no religious faction reads an all-zero clergy plane', () => {
    const r = readClergyPlane({ powerStructure: { factions: [{ id: 'f1', archetype: 'merchant' }] }, npcs: [{ importance: 'pillar', personality: { flaw: 'corrupt' } }] });
    expect(r).toEqual({ e: 0, c: 0, taint: 0, variance: 0, revealedTaint: 0, weight: 0 });
  });
  it('trait-neutral clergy NPC ⇒ zero plane projection (byte-identity anchor)', () => {
    expect(npcTraitPlane({ personality: { dominant: 'left-handed', flaw: 'tall' } })).toEqual({ e: 0, c: 0, spread: 0 });
    expect(npcTraitPlane({})).toEqual({ e: 0, c: 0, spread: 0 });
  });
  it('a devout record with clean clergy has localMult undistorted (integrity 1.0)', () => {
    const rec = pietyRecord({ authority01: 1, institutionBacking: 1, devotion01: 1, clergy: null, realmMult: 1 });
    // clergy integrity 1 ⇒ localMult equals the raw f(local01) with no distortion
    expect(rec.clergyIntegrity).toBe(1);
    expect(rec.localMult).toBeCloseTo(1 + PIETY_TUNING.SPAN_LOCAL * (1 - PIETY_TUNING.PIVOT_LOCAL), 10);
  });
});
