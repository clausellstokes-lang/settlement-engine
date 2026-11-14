/**
 * hallDecidesUnderOccupation.test.js — NO HALL LINE SAYS THE HALL DECIDES FOR ITSELF (POWERS-15; REVIEW-POWERS-5 step 1
 * row D1, MEDIUM, 38 prints; the chair's ruling of 2026-11-14: UNDER AN OCCUPATION NO LINE SAYS THE HALL DECIDES FOR
 * ITSELF, and the two lines read one fact of who shapes the decisions).
 *
 * The hall's none rung (data/people/dmPowerLines.js :: CAPTURE_LINES.none, read by domain/people/patronage.js :: hallOf)
 * clears the ruling three of the criminals. Its second line said "The head, the second and the third of <ruler> make
 * their own decisions; none of them takes orders from the criminals." and its third "<ruler> rules in its own name": under
 * an occupation the same page prints "In the occupation, the occupier's orders come through ...", and under an
 * infiltration the Overview's head reads "Vulnerable (decisions shaped from outside)". The hall line's fact is the
 * criminals' standing against the hall, so the two lines now claim that and only that, in every town.
 *
 * Measured at 0ea65f574 (POWERS-15 probes hallv.mjs; the 720 and the reader's 996): the second line 307 towns (28
 * occupied, 10 shaped from outside, 269 others); the third line 0.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { dmPowerViewOf } from '../../../src/domain/people/patronage.js';
import { CAPTURE_LINES } from '../../../src/data/people/dmPowerLines.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
  selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const cfgFor = (/** @type {string} */ seed) => {
  const m = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  return m
    ? birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] })
    : birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: seed.split('-')[1] });
};
/** the hall decides for itself, in any of the words the rung's lines have used */
const SELF_RULE = /make their own decisions|rules in its own name|decides? for (?:it|them)sel/;
/** the hall's fact: the ruling three take no orders from the criminals */
const CLEARED = /takes orders from the criminals|gives [^.]* its orders/;
/** seed -> what the page says beside the hall line at 0ea65f574 */
const OUTSIDE = {
  'r2s-occupied-town-1': 'occupied', // the reader's own; the smallest size the second line reaches under an occupation
  'r2s-occupied-city-1': 'occupied',
  'r2s-occupied-metropolis-0': 'occupied', // the largest
  'r2s-infiltrated-metropolis-3': 'Vulnerable (decisions shaped from outside)',
};
const GUARD = ['r2r-city-0', 'r2r-town-44']; // calm syndicate towns: the line still clears the three

/** @type {Record<string, any>} */
const births = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of [...Object.keys(OUTSIDE), ...GUARD]) births[seed] = generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} });
}, 240000);

describe('the hall\'s none rung claims the criminals\' standing only, never that the hall decides for itself', () => {
  for (const [seed, why] of Object.entries(OUTSIDE)) {
    test(`${seed} (${why}): the hall line clears the three of the criminals and does not say they decide for themselves`, () => {
      const s = births[seed];
      if (why === 'occupied') expect(s.config.stressTypes ?? [s.config.stressType], 'anchored: occupied').toContain('occupied');
      else expect(String(s.powerStructure.stability), 'anchored: the head reads it').toContain(why);
      const hall = dmPowerViewOf(s)?.hall;
      expect(hall?.rung, 'anchored: the none rung').toBe('none');
      expect(hall.line, 'anchored: the syndicate line that names the three').toMatch(/^None of the head, the second and the third of /);
      expect(hall.line).toMatch(CLEARED);
      expect(hall.line).not.toMatch(SELF_RULE);
    });
  }
  for (const seed of GUARD) {
    test(`${seed} (guard, calm): the hall line still clears the head, the second and the third`, () => {
      const hall = dmPowerViewOf(births[seed])?.hall;
      expect(hall?.rung).toBe('none');
      expect(hall.line).toMatch(CLEARED);
      expect(hall.line).toMatch(/the head, the second and the third of /i);
    });
  }
  test('no line of the none rung says the hall decides for itself (the third prints in no birth measured: read here)', () => {
    const f = { ruler: 'Guild Council', agents: [], rulerCriminal: false, underworld: "Thieves' Guild" };
    const lines = CAPTURE_LINES.none.map((line) => line(/** @type {any} */ (f)));
    expect(lines.length).toBe(3);
    expect(lines.filter((l) => SELF_RULE.test(l))).toEqual([]);
    expect(lines.slice(1).every((l) => CLEARED.test(l)), 'the two syndicate lines claim the criminals\' standing').toBe(true);
  });
});
