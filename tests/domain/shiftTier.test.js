/**
 * shiftTier.test.js — SHIFT_TIER, the DM-forced one-step settlement promotion/demotion.
 * Rebands population into the target tier's STAMP band and reuses the world-pulse apply path
 * (applyTierOutcomeToSettlement) so institution roster surgery + history match an organic
 * tier change. One tier per call; a no-op at the cap (metropolis) / floor (thorp).
 */
import { describe, it, expect } from 'vitest';
import { mutateSettlement } from '../../src/domain/events/mutate.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { withCustomContent } from '../../src/lib/dependencyEngine.js';
import { POPULATION_RANGES, TIER_ORDER, TIER_STAMP_CUTS, popToTier } from '../../src/data/constants.js';

// THE STAMP BAND (LANDING-7 ruling R-E6, re-reading the first seat's two re-keys). X-46 car 1
// (433289899) made the roll bands overlap (town [300, 2,500], city [2,000, 15,000]) and put the
// one population -> tier law in TIER_STAMP_CUTS. A forced shift is a DM's statement of what the
// place IS, so it must leave a population the stamp agrees with: the destination band is
// [cut(tier), cut(next tier) - 1] (thorp, which has no cut, floors at its roll minimum; the top
// tier is open). The first seat had re-keyed to the ROLL band, under which a city demoted to town
// clamped to 2,500 and stamped city again (car 2's law: a next tier begins at its stamp cut).
const stampFloor = (tier) => TIER_STAMP_CUTS[tier] ?? POPULATION_RANGES[tier].min;
const stampCeiling = (tier) => {
  const next = TIER_ORDER[TIER_ORDER.indexOf(tier) + 1];
  return next ? TIER_STAMP_CUTS[next] - 1 : Infinity;
};

const NOW = '2026-01-01T00:00:00.000Z';
const ev = (direction) => ({ id: `t_${direction}`, type: 'SHIFT_TIER', targetId: null, payload: { direction }, cause: 'player_action' });
const mk = (tier, population, institutions = []) => ({ id: 's1', tier, population, config: { tier, settType: tier }, institutions, powerStructure: { factions: [] } });

describe('SHIFT_TIER handler', () => {
  // Landed events wave — needs the SHIFT_TIER handler (tier reband + tierHistory) in src/domain/events/mutate.js
  it('promotion moves up one tier and rebands population into the new band', () => {
    const out = mutateSettlement({ settlement: mk('town', 1500), event: ev('promotion'), now: NOW });
    expect(out.tier).toBe('city');
    expect(out.config.tier).toBe('city');
    expect(out.config.settType).toBe('city');
    expect(out.population).toBe(TIER_STAMP_CUTS.city);           // clamped up to the city stamp cut (2,250)
    expect(popToTier(out.population)).toBe('city');
    expect(out.tierHistory.at(-1)).toMatchObject({ fromTier: 'town', toTier: 'city', direction: 'promotion' });
  });

  // Landed events wave — needs the SHIFT_TIER handler (tier reband + tierHistory) in src/domain/events/mutate.js
  it('demotion moves down one tier and clamps population to the new band ceiling', () => {
    const out = mutateSettlement({ settlement: mk('city', 18000), event: ev('demotion'), now: NOW });
    expect(out.tier).toBe('town');
    expect(out.population).toBe(TIER_STAMP_CUTS.city - 1);       // clamped down to 2,249, the last town the stamp reads
    expect(popToTier(out.population)).toBe('town');
    expect(out.tierHistory.at(-1)).toMatchObject({ fromTier: 'city', toTier: 'town', direction: 'demotion' });
  });

  // Landed events wave — needs the SHIFT_TIER handler (tier reband + tierHistory) in src/domain/events/mutate.js
  it('leaves an already in-band population unchanged', () => {
    // tier and population can be inconsistent (after edits); a city at town-range 1500
    // demoted to town keeps 1500 (already within the town band).
    const out = mutateSettlement({ settlement: mk('city', 1500), event: ev('demotion'), now: NOW });
    expect(out.tier).toBe('town');
    expect(out.population).toBe(1500);
  });

  it('every forced shift, from either edge of its source band, leaves a population the stamp agrees with', () => {
    // RED at the roll-band reband: city -> town from 18,000 landed 2,500 (stamps city), and
    // town -> city from 300 landed 2,000 (stamps town); likewise every overlapping pair.
    for (let i = 0; i < TIER_ORDER.length; i += 1) {
      const from = TIER_ORDER[i];
      const lo = stampFloor(from);
      const hi = Number.isFinite(stampCeiling(from)) ? stampCeiling(from) : 60000;
      for (const pop of [POPULATION_RANGES[from].min, lo, hi, POPULATION_RANGES[from].max]) {
        for (const direction of ['promotion', 'demotion']) {
          const to = TIER_ORDER[direction === 'promotion' ? i + 1 : i - 1];
          if (!to) continue;
          const out = mutateSettlement({ settlement: mk(from, pop), event: ev(direction), now: NOW });
          expect(out.tier, `${from} ${pop} ${direction}`).toBe(to);
          expect(popToTier(out.population), `${from} ${pop} ${direction} -> ${out.population}`).toBe(to);
          expect(out.population).toBeGreaterThanOrEqual(stampFloor(to));
          expect(out.population).toBeLessThanOrEqual(stampCeiling(to));
        }
      }
    }
  });

  it('is a no-op at the cap (metropolis promotion) and the floor (thorp demotion)', () => {
    expect(mutateSettlement({ settlement: mk('metropolis', 50000), event: ev('promotion'), now: NOW }).tier).toBe('metropolis');
    expect(mutateSettlement({ settlement: mk('thorp', 40), event: ev('demotion'), now: NOW }).tier).toBe('thorp');
  });

  // Landed events wave — needs the SHIFT_TIER handler (applyTierOutcomeToSettlement institution surgery) in src/domain/events/mutate.js
  it('demotion leaves over-tier institutions as inactive ruined remnants (real generated city)', () => {
    const city = withCustomContent({}, () => generateSettlementPipeline(
      { settType: 'city', culture: 'germanic', terrain: 'river', tradeRouteAccess: 'road', monsterThreat: 'frontier' },
      null, { seed: 'shift-tier', customContent: {} }));
    const out = mutateSettlement({ settlement: city, event: ev('demotion'), now: NOW });
    expect(out.tier).toBe('town');
    const remnants = (out.institutions || []).filter((i) => i._worldPulseInactive);
    expect(remnants.length).toBeGreaterThan(0);                  // some city-only institutions ruined
    expect(remnants.every((i) => i.worldPulseFate)).toBe(true);  // each carries a narrative fate
    expect(out.tierHistory.at(-1).institutionFates.length).toBeGreaterThan(0);
  });
});
