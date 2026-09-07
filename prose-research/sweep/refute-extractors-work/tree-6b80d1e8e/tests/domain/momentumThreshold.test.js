/**
 * momentumThreshold.test.js — W-MOMENTUM Stage 2 PIN BATTERY (design §2/§6).
 *
 * The entity-appropriate, alignment-shaped, NPC-rooted cliff: TRAIT_MOMENTUM directionality,
 * neutral anchors, the facet law, the finite LIMIT CLAUSE (no absorbing state), the
 * lawful×chaos deposit/procedural asymmetry, and the good×evil conscience doors.
 */
import { describe, it, expect } from 'vitest';
import {
  TRAIT_MOMENTUM,
  npcMomentumScore,
  temperamentMomentumOf,
  cliffStockFor,
  reconsiderationMultiplier,
  pastCliff,
  depositScaleFor,
  proceduralCrackRelief,
  counterEvidenceEffectiveness,
  entityThreshold,
  entryDepositDampenOf,
  MOMENTUM_TUNING,
  THRESHOLD_TUNING,
} from '../../src/domain/worldPulse/momentum.js';

/** @param {string} dominant @param {Record<string,unknown>} [over] */
const npc = (dominant, over = {}) => ({ importance: 'pillar', personality: { dominant }, ...over });
const settlement = (/** @type {unknown[]} */ npcs) => ({ npcs });

describe('W-MOMENTUM Stage 2 — TRAIT_MOMENTUM directionality + neutral anchors', () => {
  it('proud/stubborn RAISE, humble/pragmatic LOWER, absent ⇒ EXACTLY 0', () => {
    expect(TRAIT_MOMENTUM.proud).toBeGreaterThan(0);
    expect(TRAIT_MOMENTUM.stubborn).toBeGreaterThan(0);
    expect(TRAIT_MOMENTUM.humble).toBeLessThan(0);
    expect(TRAIT_MOMENTUM.pragmatic).toBeLessThan(0);
    // Absent descriptor ⇒ score 0 (a trait-free NPC is the neutral anchor).
    expect(npcMomentumScore({ importance: 'pillar', personality: { dominant: 'freckled' } })).toBe(0);
    expect(npcMomentumScore({ importance: 'pillar' })).toBe(0);
    // Directionality is receipted in the score sign.
    expect(npcMomentumScore(npc('proud'))).toBeGreaterThan(0);
    expect(npcMomentumScore(npc('humble'))).toBeLessThan(0);
  });

  it('temperament aggregates proud > neutral > humble at the settlement grain', () => {
    const proud = temperamentMomentumOf(settlement([npc('proud'), npc('stubborn')]));
    const neutral = temperamentMomentumOf(settlement([npc('freckled'), npc('tall')]));
    const humble = temperamentMomentumOf(settlement([npc('humble'), npc('pragmatic')]));
    expect(proud).toBeGreaterThan(neutral);
    expect(neutral).toBe(0);           // no scoring NPCs ⇒ neutral anchor
    expect(humble).toBeLessThan(neutral);
  });

  it('NEUTRAL ANCHORS: a personality-less structural leader (no npcs) contributes EXACTLY 0', () => {
    expect(temperamentMomentumOf(settlement([]))).toBe(0);
    expect(temperamentMomentumOf({})).toBe(0);
    expect(temperamentMomentumOf(null)).toBe(0);
    // A minor NPC (importanceWeight 0) does not move the mean even with a loud trait.
    expect(temperamentMomentumOf(settlement([{ importance: 'minor', personality: { dominant: 'fanatical' } }]))).toBe(0);
  });

  it('FACET LAW: a declared npcTemperament facet WINS over the authored traits; else it falls back', () => {
    // Authored 'humble' (negative), but a declared 'proud' facet overrides ⇒ positive.
    const overridden = npcMomentumScore({ importance: 'pillar', personality: { dominant: 'humble' }, facets: { npcTemperament: 'proud' } });
    expect(overridden).toBeGreaterThan(0);
    // No declared facet ⇒ falls back to the authored 'humble' ⇒ negative (byte-identical degradation).
    const fallback = npcMomentumScore({ importance: 'pillar', personality: { dominant: 'humble' } });
    expect(fallback).toBeLessThan(0);
  });
});

describe('W-MOMENTUM r2 politics-psychology-4 — cautious/wary lower ENTRY, not the EXIT cliff', () => {
  it('the EXIT cliff excludes cautious/wary: a cautious court reads temperament 0 (no cliff bend)', () => {
    // The weight still EXISTS ('all' mode sums it — the historic default kept for direct callers)…
    expect(npcMomentumScore(npc('cautious'), 'all')).toBeLessThan(0);
    expect(npcMomentumScore(npc('wary'), 'all')).toBeLessThan(0);
    // …but the CLIFF path ('exit' mode, the temperamentMomentumOf default) drops them entirely,
    // so a purely cautious/wary court exerts ZERO pull on the exit cliff (the bug: they lowered it).
    expect(npcMomentumScore(npc('cautious'), 'exit')).toBe(0);
    expect(temperamentMomentumOf(settlement([npc('cautious'), npc('wary')]))).toBe(0);
    expect(cliffStockFor({ temperament: temperamentMomentumOf(settlement([npc('cautious')])) }))
      .toBe(MOMENTUM_TUNING.BASE_CLIFF_STOCK); // exactly BASE — no wrongful lowering
    // A proud court still bends the cliff up (non-vacuity — the exclusion is descriptor-scoped).
    expect(temperamentMomentumOf(settlement([npc('proud')]))).toBeGreaterThan(0);
  });

  it('the ENTRY side is now LIVE: cautious/wary DAMPEN deposits (commit slowly); neutral ⇒ ×1', () => {
    const neutralCourt = entryDepositDampenOf(settlement([npc('freckled'), npc('tall')]));
    expect(neutralCourt, 'a court with no entry-only descriptors deposits at ×1 (byte-neutral)').toBe(1);
    const cautiousCourt = entryDepositDampenOf(settlement([npc('cautious'), npc('wary')]));
    expect(cautiousCourt, 'a cautious/wary court deposits LESS than a neutral one').toBeLessThan(1);
    expect(cautiousCourt, 'the dampen is floored — deposits shrink but never vanish').toBeGreaterThanOrEqual(THRESHOLD_TUNING.ENTRY_DEPOSIT_FLOOR);
    // The 'entry' mode reads ONLY the entry-only descriptors (a proud court has no entry signal ⇒ ×1).
    expect(entryDepositDampenOf(settlement([npc('proud'), npc('stubborn')]))).toBe(1);
  });

  it('entityThreshold exposes both: an unmodulated court is byte-neutral on entry and exit', () => {
    const plainCourt = { settlement: { npcs: [npc('freckled')] } };
    const t = entityThreshold(plainCourt, {});
    expect(t.entryDepositDampen).toBe(1);   // neutral entry ⇒ ×1
    expect(t.cliff).toBe(MOMENTUM_TUNING.BASE_CLIFF_STOCK); // neutral exit ⇒ BASE
  });
});

describe('W-MOMENTUM Stage 2 — the cliff derivation', () => {
  it('an unmodulated entity has cliff EXACTLY BASE_CLIFF_STOCK', () => {
    expect(cliffStockFor({})).toBe(MOMENTUM_TUNING.BASE_CLIFF_STOCK);
  });
  it('proud RAISES the cliff, humble LOWERS it', () => {
    expect(cliffStockFor({ temperament: 1 })).toBeGreaterThan(MOMENTUM_TUNING.BASE_CLIFF_STOCK);
    expect(cliffStockFor({ temperament: -1 })).toBeLessThan(MOMENTUM_TUNING.BASE_CLIFF_STOCK);
  });
  it('a fragile seat and a consolidated court RAISE the cliff; opposition blocs LOWER it', () => {
    expect(cliffStockFor({ legitimacyFragility01: 1 })).toBeGreaterThan(MOMENTUM_TUNING.BASE_CLIFF_STOCK);
    expect(cliffStockFor({ consolidation01: 1 })).toBeGreaterThan(MOMENTUM_TUNING.BASE_CLIFF_STOCK);
    expect(cliffStockFor({ oppositionBlocs: 3 })).toBeLessThan(MOMENTUM_TUNING.BASE_CLIFF_STOCK);
  });
  it('the cliff never falls below the finite floor (always crackable — no absorbing height)', () => {
    const floor = MOMENTUM_TUNING.BASE_CLIFF_STOCK * THRESHOLD_TUNING.CLIFF_FLOOR_FRAC;
    expect(cliffStockFor({ temperament: -1, oppositionBlocs: 99 })).toBeGreaterThanOrEqual(floor);
    expect(cliffStockFor({ temperament: -1, oppositionBlocs: 99 })).toBeGreaterThan(0);
  });
});

describe('W-MOMENTUM Stage 2 — THE LIMIT CLAUSE (finite, no absorbing state)', () => {
  it('below the cliff the multiplier is EXACTLY 1.0 (free physics — unchanged bytes)', () => {
    expect(reconsiderationMultiplier(0, 6)).toBe(1);
    expect(reconsiderationMultiplier(5.99, 6)).toBe(1);
    expect(pastCliff(5.99, 6)).toBe(false);
  });
  it('past the cliff the multiplier RAMPS toward CLIFF_MULT but is CAPPED there (finite, never a wall)', () => {
    expect(reconsiderationMultiplier(6, 6)).toBe(1);            // at the cliff — still 1 (continuous)
    expect(reconsiderationMultiplier(9, 6)).toBeGreaterThan(1);  // 1.5× cliff — ramping
    const farPast = reconsiderationMultiplier(1000, 6);
    expect(farPast).toBeCloseTo(MOMENTUM_TUNING.CLIFF_MULT, 6); // CAPPED — never infinite
    expect(farPast).toBeLessThanOrEqual(MOMENTUM_TUNING.CLIFF_MULT);
    expect(pastCliff(6, 6)).toBe(true);
  });
  it('the multiplier is monotone non-decreasing in stock and always finite (no absorbing state)', () => {
    let prev = 0;
    for (let s = 0; s <= 40; s += 0.5) {
      const m = reconsiderationMultiplier(s, 6);
      expect(m).toBeGreaterThanOrEqual(prev - 1e-9);
      expect(Number.isFinite(m)).toBe(true);
      expect(m).toBeLessThanOrEqual(MOMENTUM_TUNING.CLIFF_MULT + 1e-9);
      prev = m;
    }
  });
});

describe('W-MOMENTUM Stage 2 — LAWFUL × CHAOS (deposits bind, procedural crack)', () => {
  it('a lawful court is bound HARDER by deposits than a chaotic one; neutral ⇒ EXACTLY 1.0', () => {
    expect(depositScaleFor(1)).toBeGreaterThan(1);
    expect(depositScaleFor(0.5)).toBe(1);   // neutral ⇒ byte-neutral
    expect(depositScaleFor(0)).toBeLessThan(1);
    expect(depositScaleFor(1)).toBeGreaterThan(depositScaleFor(0));
  });
  it('the PROCEDURAL CRACK gives a lawful court climb-down relief; a chaotic/neutral court none', () => {
    expect(proceduralCrackRelief(1)).toBeGreaterThan(0);
    expect(proceduralCrackRelief(0.5)).toBe(0);
    expect(proceduralCrackRelief(0)).toBe(0);
  });
});

describe('W-MOMENTUM Stage 2 — GOOD × EVIL (the conscience doors, paired)', () => {
  it('HUMANITARIAN evidence cracks a GOOD court but an EVIL twin discounts it toward the floor', () => {
    const good = counterEvidenceEffectiveness({ malice01: 0, evidenceClass: 'humanitarian' });
    const evil = counterEvidenceEffectiveness({ malice01: 1, evidenceClass: 'humanitarian' });
    expect(good).toBeGreaterThan(evil);
    expect(good).toBeCloseTo(1, 6);                                          // the conscience hears the dead
    expect(evil).toBeCloseTo(THRESHOLD_TUNING.HUMANITARIAN_EVIL_FLOOR, 6);   // hears only power
  });
  it('POWER evidence penetrates EVERY court at full weight (even the evil one hears a lost battle)', () => {
    const good = counterEvidenceEffectiveness({ malice01: 0, evidenceClass: 'power' });
    const evil = counterEvidenceEffectiveness({ malice01: 1, evidenceClass: 'power' });
    expect(good).toBe(THRESHOLD_TUNING.POWER_PENETRATION);
    expect(evil).toBe(THRESHOLD_TUNING.POWER_PENETRATION);
    expect(evil).toBe(good);
  });
});

describe('W-MOMENTUM Stage 2 — entityThreshold (the all-existing-reads wiring)', () => {
  it('a proud court derives a higher cliff than a humble court from the same neutral world', () => {
    const world = { spatialCanonVersion: 1, simulationRules: { infoMode: 'unreliable' } };
    const proudCourt = { settlement: { npcs: [npc('proud'), npc('stubborn')] } };
    const humbleCourt = { settlement: { npcs: [npc('humble'), npc('pragmatic')] } };
    const proud = entityThreshold(proudCourt, world);
    const humble = entityThreshold(humbleCourt, world);
    expect(proud.temperament).toBeGreaterThan(humble.temperament);
    expect(proud.cliff).toBeGreaterThan(humble.cliff);
    // The read exposes the alignment coordinates the deposit-scale + conscience door consume.
    expect(proud.depositScale).toBeGreaterThan(0);
    expect(proud.lawfulness01).toBeGreaterThanOrEqual(0);
    expect(proud.malice01).toBeGreaterThanOrEqual(0);
  });
});
