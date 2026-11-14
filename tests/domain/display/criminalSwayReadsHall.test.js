/**
 * criminalSwayReadsHall.test.js — THE "criminal sway" CHIP AND THE HALL'S LINE READ ONE FACT (POWERS-15; REVIEW-POWERS-5
 * step 1 row A5, MEDIUM, 48 of 95 prints; the chair's ruling of 2026-11-14: TWO LINES ON ONE PAGE READ ONE FACT).
 *
 * The Power tab prints the ruling power's modifier in plain words (display/governingModifierWords.js), and the same tab
 * prints the hall's rung and line (domain/people/patronage.js :: hallOf, from the stored `criminalCaptureState`, the
 * rung the "Criminal capture" badge prints). The chip's crime family read the town's crime STRUCTURE, so it said
 * "criminal sway" beside "Nobody at the head of Elder Council answers to a criminal house, and no criminal power here is
 * strong enough to push it." The cure: the chip reads the hall's own rung: the criminals sway the ruler only where the
 * rung says so (corrupted: officials in their pay; capture: governance captured). At none, adversarial and equilibrium
 * the chip is silent (an equilibrium hall with a lesser agent says the criminals have "a voice": silence beside it is
 * not a false sentence, and the chip names no hidden allegiance).
 *
 * The towns are the census's (born as its 720 are), measured at 0ea65f574 (POWERS-15 probes chip.mjs): the chip's 95
 * prints on the 720 and the reader's 996 by rung: corrupted 36 (kept), adversarial 15, equilibrium 28, none 16 (silenced).
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { governingModifierWordsOf } from '../../../src/domain/display/governingModifierWords.js';
import { dmPowerViewOf } from '../../../src/domain/people/patronage.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
  selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** seed -> [the hall's rung, the town's crime structure, the hall line's first words] at 0ea65f574 */
const FALSE_TOWNS = {
  'r2r-thorp-8': ['none', 'Nobody at the head of'], // the reader's own: a diffuse presence, the smallest size the row reaches
  'r2r-city-3': ['none', 'None of the head, the second and the third of'], // an organized syndicate, the none rung's second line
  'r2r-metropolis-52': ['adversarial', "Thieves' Guild works against"], // the largest size
  'r2r-town-31': ['equilibrium', 'Guild Council and'], // the climate alone: "... leave each other alone. Nobody at the head ..."
};
/** an equilibrium hall with a lesser agent ("The third of Elder Council answers to ..."): the chip is silent, never a hidden tie's tell */
const SILENT_TOWNS = { 'r2r-village-10': 'equilibrium' };
const GUARD_TOWNS = { 'r2r-town-0': 'corrupted' };

/** @type {Record<string, any>} */
const births = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of [...Object.keys(FALSE_TOWNS), ...Object.keys(SILENT_TOWNS), ...Object.keys(GUARD_TOWNS)]) {
    births[seed] = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: seed.split('-')[1] }), null, { seed, customContent: {} });
  }
}, 180000);

const hallOf = (/** @type {any} */ s) => dmPowerViewOf(s)?.hall;
const CRIME_KEYS = ['corruption-riddled', 'compromised'];
const rulerOf = (/** @type {any} */ s) => (s.powerStructure.factions || []).find((/** @type {any} */ f) => f.isGoverning);

describe('the "criminal sway" chip reads the hall\'s rung, never the crime structure alone', () => {
  for (const [seed, [rung, lead]] of Object.entries(FALSE_TOWNS)) {
    test(`${seed}: the hall at "${rung}" says nobody at the head answers to the criminals, and no chip says they sway it`, () => {
      const s = births[seed];
      // anchored: the ruler carries a crime modifier key, and the hall reads this rung with no agent
      expect(CRIME_KEYS, 'anchored: a crime modifier is stored').toContain(rulerOf(s)?.modifier);
      expect(s.powerStructure.criminalCaptureState).toBe(rung);
      const hall = hallOf(s);
      expect(hall?.rung).toBe(rung);
      expect(hall.line.startsWith(lead), hall.line).toBe(true);
      expect(hall.line, 'no agent in the three: the line clears the head').toMatch(/Nobody at (?:the head of |its head)|None of the head, the second and the third/);
      expect(governingModifierWordsOf(s)).toBe('');
    });
  }
  for (const [seed, rung] of Object.entries(SILENT_TOWNS)) {
    test(`${seed}: the hall at "${rung}" gives a lesser agent a voice, and the chip says nothing`, () => {
      const s = births[seed];
      expect(CRIME_KEYS).toContain(rulerOf(s)?.modifier);
      expect(hallOf(s)?.rung).toBe(rung);
      expect(hallOf(s).line, 'anchored: an agent stands in the three').toMatch(/ answers to /);
      expect(governingModifierWordsOf(s)).toBe('');
    });
  }
  for (const [seed, rung] of Object.entries(GUARD_TOWNS)) {
    test(`${seed} (guard): the hall at "${rung}" is in criminal hands, and the chip says "criminal sway"`, () => {
      const s = births[seed];
      expect(CRIME_KEYS).toContain(rulerOf(s)?.modifier);
      expect(s.powerStructure.criminalCaptureState).toBe(rung);
      expect(hallOf(s)?.rung).toBe(rung);
      expect(governingModifierWordsOf(s)).toBe('criminal sway');
    });
  }
});
