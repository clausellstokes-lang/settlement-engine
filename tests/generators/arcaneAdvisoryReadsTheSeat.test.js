/**
 * arcaneAdvisoryReadsTheSeat.test.js — TAIL-POWERS-B-2 batch 6a (the chair's READ-ALL-4 HIGH, 2026-11-15): "Magical
 * practitioners are consulted but not formally empowered" is false where an arcane power GOVERNS (the Arcane Council:
 * 9 of the 147 towns that printed it). There the practitioners outside the seat take a twin true in that state
 * (claimStanding.js :: settleClaimsToLabel); beside any other seat the line stands (KEEP).
 * RED AT THE BASE (4b0ffb515): every refused pair; KEEP pairs green before and after.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { generateSettlementPipeline as bornVoiced } from '../../src/generators/generateSettlementPipeline.js';
import { todayOf } from '../generators/power/powerLinesToday.js'; // PEOPLE-2 B2: re-keyed by identity, each voiced power line read back to the line it voices
/** @param {Parameters<typeof bornVoiced>} a */ const generateSettlementPipeline = (...a) => todayOf(bornVoiced(...a));
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** the census's 720 shape @param {string} seed */
function born(seed) {
  const calm = seed.match(/^r2r-(\w+)-\d+$/);
  const forced = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  const cfg = calm ? { ...DEFAULT_CONFIG, ...DIALS, settType: calm[1] }
    : { ...DEFAULT_CONFIG, ...DIALS, settType: forced?.[2], selectedStresses: [forced?.[1]], selectedStressesRandom: false };
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
}
const ADVISORY = 'Magical practitioners are consulted but not formally empowered.';
const TWIN = 'Magical practitioners outside the seat hold no office of their own; their influence is advisory and transactional.';
const ARCANE_SEAT = ['r2r-town-1', 'r2s-under_siege-city-3', 'r2s-occupied-city-3'];
const OTHER_SEAT = ['r2r-city-1'];
/** @type {Record<string, any>} */
const births = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of [...ARCANE_SEAT, ...OTHER_SEAT]) births[seed] = born(seed);
}, 300000);
const descs = (/** @type {string} */ seed) => (births[seed].powerStructure.factions || []).map((/** @type {any} */ f) => String(f.desc || '')).join(' | ');

describe('TAIL-POWERS-B-2 batch 6a · the arcane advisory line reads the seat', () => {
  for (const seed of ARCANE_SEAT) {
    it(`${seed}: an Arcane Council governs; the practitioners are not called unempowered, and take the twin`, () => {
      const gov = births[seed].powerStructure.factions.find((/** @type {any} */ f) => f.isGoverning);
      expect(gov.category).toBe('magic');
      expectAbsentWithAnchor(descs(seed), ADVISORY, TWIN, `${seed}: the twin prints where the advisory line is refused`);
    });
  }
  for (const seed of OTHER_SEAT) {
    it(`KEEP ${seed}: beside a seat that is not arcane, the advisory line still prints`, () => {
      expectAbsentWithAnchor(descs(seed), TWIN, ADVISORY, `${seed}: the advisory line prints and the twin does not`);
    });
  }
});
