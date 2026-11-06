/**
 * shiftTier.test.js — SHIFT_TIER, the DM-forced one-step settlement promotion/demotion.
 * Rebands population into the target tier's band and reuses the world-pulse apply path
 * (applyTierOutcomeToSettlement) so institution roster surgery + history match an organic
 * tier change. One tier per call; a no-op at the cap (metropolis) / floor (thorp).
 */
import { describe, it, expect } from 'vitest';
import { mutateSettlement } from '../../src/domain/events/mutate.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { withCustomContent } from '../../src/lib/dependencyEngine.js';
import { POPULATION_RANGES } from '../../src/data/constants.js';

// The bands are read by identity from POPULATION_RANGES (X-46 car 1, 433289899, moved them:
// city [5001,25000] -> [2000,15000], town [901,5000] -> [300,2500]). The handler rebands into the
// destination tier's own ROLL band (a mint; tests/lint/barePopulationComparison.walker's register).

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
    expect(out.population).toBe(POPULATION_RANGES.city.min);     // clamped up to the city band's floor
    expect(out.population).toBeLessThanOrEqual(POPULATION_RANGES.city.max);
    expect(out.tierHistory.at(-1)).toMatchObject({ fromTier: 'town', toTier: 'city', direction: 'promotion' });
  });

  // Landed events wave — needs the SHIFT_TIER handler (tier reband + tierHistory) in src/domain/events/mutate.js
  it('demotion moves down one tier and clamps population to the new band ceiling', () => {
    const out = mutateSettlement({ settlement: mk('city', 18000), event: ev('demotion'), now: NOW });
    expect(out.tier).toBe('town');
    expect(out.population).toBe(POPULATION_RANGES.town.max);      // clamped down into the town band
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
