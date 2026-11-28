/**
 * tailDefeconServiceLines.test.js — TAIL-DEFECON-C, batch 3 (`computeActiveChains.js`): two lines of this writer said
 * more than the towns that print them bear.
 *
 * - Row 03905 (the chair's ruling D1): "Armed escort & mercenary hire" / "Military contract services" where no company
 *   hires out its swords: the service matched a professional city watch or a garrison alone. It now needs a mercenary
 *   quarter, a free company hall, a hireling hall or hired blades (55 cities and metropolises at the base, none with one).
 * - WORKLIST3 rows 15738, 11365, 31448: the external-mill note named "the lord's mill" where no lord governs (36 of 40),
 *   said "Local food security is maintained" under a siege or a famine, and "there would be no flour at all" beside the
 *   land's own flour on the made list (39 of 40). Every town that printed it prints the plain line instead.
 *
 * Born as the census born its 720 (the r2r- arm). GONE pairs red at 345f13157; KEEP pairs green before and after.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
  selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** @type {Map<string, any>} */
const born = new Map();
/** The census's r2r- birth. @param {string} seed */
const birth = (seed) => {
  if (!born.has(seed)) {
    const m = /** @type {RegExpMatchArray} */ (seed.match(/^r2r-(\w+)-\d+$/));
    born.set(seed, generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[1] }), null, { seed, customContent: {} }));
  }
  return born.get(seed);
};
/** @param {any} town */
const exportsOf = (town) => /** @type {string[]} */ (town.economicState.primaryExports || []);
/** @param {any} town */
const serviceOutputs = (town) => (town.economicState.institutionalServices || []).map((/** @type {any} */ s) => s.output);
/** @param {any} town */
const millNotes = (town) => (town.economicState.activeChains || []).map((/** @type {any} */ c) => c.externalMillNote).filter(Boolean);

const MILL_NOTE = 'Grain is carried out of the settlement to be ground, and the toll taken there leaves no surplus flour to sell on.';

describe('the hire service needs a company for hire (row 03905)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('every seed (a city watch, no company for hire): no mercenary hire; its kept service is still exported', () => {
    expectNoSeedFailures(collectSeedFailures([
      ['r2r-city-2', 'Legal services (contracts, notarial)'],
      ['r2r-city-3', 'Financial services (letters of credit)'],
      ['r2r-city-7', 'Legal services (contracts, notarial)'],
    ], ([seed, keep]) => {
      const town = birth(seed);
      expectAbsentWithAnchor(serviceOutputs(town), 'Armed escort & mercenary hire', 'Legal services', 'GONE');
      expectAbsentWithAnchor(exportsOf(town), 'Military contract services', keep, 'GONE');
      expect(exportsOf(town), 'KEEP').toContain(keep);
    }), 'a city watch alone sells no mercenary hire, and each city keeps its service');
  }, 60000);

  test('every seed (a mercenary quarter and hired blades): the service stays', () => {
    expectNoSeedFailures(collectSeedFailures([['r2r-city-0'], ['r2r-city-1']], ([seed]) => {
      const town = birth(seed);
      expect(serviceOutputs(town)).toContain('Armed escort & mercenary hire');
      expect(exportsOf(town)).toContain('Military contract services');
    }), 'a company for hire keeps the hire service');
  }, 60000);
});

describe('the external-mill note says only what every town that prints it bears (rows 15738, 11365, 31448)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('every seed: no lord, no "food security", no "no flour at all"; the plain line prints', () => {
    expectNoSeedFailures(collectSeedFailures([['r2r-thorp-12'], ['r2r-thorp-13'], ['r2r-thorp-19']], ([seed]) => {
      const notes = millNotes(birth(seed));
      expectAbsentWithAnchor(notes.join(' '), "lord's mill", MILL_NOTE, 'GONE');
      expectAbsentWithAnchor(notes.join(' '), 'food security is maintained', MILL_NOTE, 'GONE');
      expectAbsentWithAnchor(notes.join(' '), 'no flour at all', MILL_NOTE, 'GONE');
      expect(notes, 'what prints instead').toContain(MILL_NOTE);
    }), 'every town that printed the external-mill note prints the plain line');
  }, 60000);
});
