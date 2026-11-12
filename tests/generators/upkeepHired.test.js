/**
 * upkeepHired.test.js — COHERENCE-UPKEEP (the chair's ruling of 2026-11-12 on item 4, ruling 2):
 * a hired force stands in for a standing one "to an appropriate but lesser degree" (the owner).
 *
 * THE INVARIANT, pinned by counterfactual on the pure score: FOR EVERY PLACE WITH HIRED FORCE AND
 * NO STANDING FORCE, ITS MILITARY SCORE IS NOT ABOVE WHAT THE SAME PLACE SCORES WITH A WATCH IN
 * THE HIRED FORCE'S STEAD. The counterfactual is the same born record handed back to the one
 * defence writer (`generateDefenseProfile`, pure in the record) with its hired institutions
 * (the company, the charter hall) replaced by a watch of its tier.
 *
 * The seeds are the lane corpus's five hired-only places (`agree-village-28, -30, -40, -43,
 * -45`). The red seed is agree-village-45: a Poor village whose only force is a charter hall,
 * scoring military 97 at the base.
 */
import { describe, expect, test, beforeAll } from 'vitest';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { generateDefenseProfile } from '../../src/generators/defenseGenerator.js';
import { getInstFlags } from '../../src/generators/priorityHelpers.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const SEEDS = ['agree-village-28', 'agree-village-30', 'agree-village-40', 'agree-village-43', 'agree-village-45'];
const HIRED = /mercenar|free company|adventurers'|hireling hall/i;
/** The flags the one defence writer reads. @param {any} s */
const forcesOf = (s) => getInstFlags(s.config, s.institutions).inst;
const WATCH_OF = { village: 'Village watch', town: 'Town watch', city: 'City watch', metropolis: 'City watch' };

/** @param {string} seed */
const born = (seed) => generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: seed.split('-')[1] }), null, { seed });

/** The same record with a watch in the hired force's stead. @param {any} s */
function withWatchInstead(s) {
  const institutions = s.institutions.filter((i) => !HIRED.test(i.name));
  institutions.push({ name: WATCH_OF[s.tier] || 'Town watch', category: 'Defense' });
  return { ...s, institutions };
}

describe('a hired force stands in for a standing one, to a lesser degree', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('the counterfactual is a watch and no hired force (anchored)', () => {
    const s = born('agree-village-45');
    const home = forcesOf(s);
    expect(home.hasCharterHall || home.hasMercenary).toBe(true);
    expect(home.hasGarrison || home.hasWatch || home.hasMilitia).toBe(false);
    const cf = forcesOf(withWatchInstead(s));
    expect(cf.hasWatch).toBe(true);
    expect(cf.hasCharterHall || cf.hasMercenary).toBe(false);
  });

  test.each(SEEDS)('RED-FIRST %s: military with hired force only is not above the same place with a watch instead', (seed) => {
    const s = born(seed);
    const home = forcesOf(s);
    expect(home.hasCharterHall || home.hasMercenary, 'the seed holds a hired force').toBe(true);
    expect(home.hasGarrison || home.hasWatch || home.hasMilitia, 'and no standing force').toBe(false);
    const hired = generateDefenseProfile(s).scores.military;
    const watch = generateDefenseProfile(withWatchInstead(s)).scores.military;
    expect(hired, `${seed}: hired-only ${hired} against a watch's ${watch}`).toBeLessThanOrEqual(watch);
  });
});
