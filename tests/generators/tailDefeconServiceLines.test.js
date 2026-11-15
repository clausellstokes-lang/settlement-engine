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

  test.each([
    ['r2r-city-2', 'Legal services (contracts, notarial)'],
    ['r2r-city-3', 'Financial services (letters of credit)'],
    ['r2r-city-7', 'Legal services (contracts, notarial)'],
  ])('%s (a city watch, no company for hire): no mercenary hire; "%s" is still exported', (seed, keep) => {
    const town = birth(seed);
    expect(serviceOutputs(town), 'GONE').not.toContain('Armed escort & mercenary hire');
    expect(exportsOf(town), 'GONE').not.toContain('Military contract services');
    expect(exportsOf(town), 'KEEP').toContain(keep);
  }, 60000);

  test.each([['r2r-city-0'], ['r2r-city-1']])('%s (a mercenary quarter and hired blades): the service stays', (seed) => {
    const town = birth(seed);
    expect(serviceOutputs(town)).toContain('Armed escort & mercenary hire');
    expect(exportsOf(town)).toContain('Military contract services');
  }, 60000);
});

describe('the external-mill note says only what every town that prints it bears (rows 15738, 11365, 31448)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test.each([['r2r-thorp-12'], ['r2r-thorp-13'], ['r2r-thorp-19']])('%s: no lord, no "food security", no "no flour at all"; the plain line prints', (seed) => {
    const notes = millNotes(birth(seed));
    expect(notes.join(' '), 'GONE').not.toMatch(/lord's mill|food security is maintained|no flour at all/);
    expect(notes, 'what prints instead').toContain(MILL_NOTE);
  }, 60000);
});
