/**
 * TAIL-HOUSES-3 batch 5 (2026-11-15; READ-ALL-3 WORKLIST3-HOUSES, the exports' rows first by the chair's ruling H13): a
 * terrain's strategic line or a house text claims what the record denies. The coastal line "controls sea routes and
 * naval access" where no town holds a naval force (a hamlet of 23); the desert's "controls caravan routes" where the
 * town is isolated; a river ferry held "for generations" in a settlement founded within living memory
 * (`history.age`); travelling performers who "come for the fairs" where no fair stands; a hamlet's external mill named
 * the lord's, by banalité, where the ruler is no lord; a fish market's catch or carted barrels where the fisheries are
 * spent or no fish comes in. Each is reworded to claim no more than every printing town bears (the fish market's in
 * the one hedge form, "whenever fish can be had"). No draw moved.
 *
 * THIS FILE REDS WHEN a census town where the record denies the old claim prints the old text again (each pair: the
 * seed, the house or the strategic line, the old words that must not print, the rewording's words that print instead).
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { atomHolds } from '../../src/domain/facts/factVocabulary.js';

const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };

/** A census town, as its births script makes it. */
const bornCensus = (/** @type {string} */ seed) => {
  const forced = /^r2s-(.+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/.exec(seed);
  const calm = /^r2r-(thorp|hamlet|village|town|city|metropolis)-\d+$/.exec(seed);
  const tier = forced ? forced[2] : /** @type {RegExpExecArray} */ (calm)[1];
  const cfg = forced ? { ...DEFAULT_CONFIG, ...dials, settType: tier, selectedStressesRandom: false, selectedStresses: [forced[1]] } : { ...DEFAULT_CONFIG, ...dials, settType: tier };
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
};
/** @type {Map<string, any>} */ const born = new Map();
const town = (/** @type {string} */ seed) => { if (!born.has(seed)) born.set(seed, bornCensus(seed)); return born.get(seed); };
const STRATEGIC = 'strategic line';
/** The printed text of a house, or of the terrain's strategic line. @param {any} t @param {string} house */
const textOf = (t, house) => (house === STRATEGIC ? t.resourceAnalysis?.strategicValue : (t.institutions || []).find((/** @type {any} */ i) => i.name === house)?.desc);
/** @param {any} t @param {RegExp} re */
const holds = (t, re) => (t.institutions || []).some((/** @type {any} */ i) => re.test(String(i.name)));
/** @param {any} t */
const fishSpent = (t) => {
  const depleted = t.config?.nearbyResourcesDepleted || [];
  const live = (t.config?.nearbyResources || []).filter((/** @type {string} */ k) => !depleted.includes(k));
  return atomHolds('fish', factsOf(t)) !== true || (depleted.some((/** @type {string} */ k) => /fish/.test(k)) && !live.some((/** @type {string} */ k) => /fish/.test(k)));
};

/** What makes the old claim false in that town, read off the record. @type {Record<string, (t: any) => boolean>} */
const DENIED = {
  'no navy': (t) => !holds(t, /nav|fleet|admiral/i) && t.population < 100,
  isolated: (t) => t.config?.tradeRouteAccess === 'isolated',
  young: (t) => Number(t.history?.age) < 60,
  'no fair': (t) => !holds(t, /fair/i),
  'no lord': (t) => atomHolds('ruler: lord', factsOf(t)) !== true,
  'fish spent': fishSpent,
  'no fish in': (t) => atomHolds('fish', factsOf(t)) !== true && !(t.economicState?.primaryImports || []).some((/** @type {string} */ x) => /fish/i.test(String(x))),
};

/** [seed, house, what denies it, the old words (must not print), the rewording's words (print instead)] */
const RED = [
  ['r2r-hamlet-28', STRATEGIC, 'no navy', 'controls sea routes', 'within reach of the sea routes'],
  ['r2r-thorp-46', STRATEGIC, 'isolated', 'controls caravan routes', 'command any caravan route that comes this way'],
  ['r2r-village-56', 'River ferry', 'young', 'for generations', 'worked by the family that holds the right to it'],
  ['r2r-village-14', 'River ferry', 'young', 'for generations', "The ferryman's family holds the crossing rights"],
  ['r2s-occupied-village-2', 'River ferry', 'young', 'for generations', 'the crossing rights held in one family.'],
  ['r2r-village-36', 'River ferry', 'young', 'for generations', 'the crossing rights held in one family.'],
  ['r2s-succession_void-village-1', 'River ferry', 'young', 'for generations', "The ferryman's family holds the crossing rights"],
  ['r2r-town-15', 'Traveling performers', 'no fair', 'fairs', 'come for the festivals'],
  ['r2r-town-21', 'Traveling performers', 'no fair', 'fairs', 'The festivals bring'],
  ['r2r-town-58', 'Traveling performers', 'no fair', 'fairs', 'visit at festival time'],
  ['r2r-hamlet-3', 'Access to external mill', 'no lord', 'banalité', 'the grain goes out of the hamlet for grinding'],
  ['r2r-hamlet-1', 'Access to external mill', 'no lord', 'banalité', "The hamlet's grain is carried elsewhere to be ground."],
  ['r2r-hamlet-2', 'Access to external mill', 'no lord', 'banalité', 'Grain is taken out of the hamlet to be ground.'],
  ['r2r-town-3', 'Fish market', 'fish spent', 'where fresh catch', 'where, whenever fish can be had, fresh catch'],
  ['r2r-town-6', 'Fish market', 'fish spent', 'salted barrels by weight, each', 'by weight whenever fish can be had'],
  ['r2r-town-29', 'Fish market', 'fish spent', "The morning's catch or", "Whenever fish can be had, the morning's catch"],
  ['r2r-town-0', 'Fish market', 'no fish in', 'where carted barrels', 'where, whenever fish can be had, carted barrels'],
  ['r2r-town-5', 'Fish market', 'no fish in', 'come in by cart, sold', 'come in by cart whenever fish can be had'],
  ['r2r-town-11', 'Fish market', 'no fish in', 'by the barrel, each', 'by the barrel whenever fish can be had'],
];

/** [seed, house, the words its text still names] — true siblings: green before and after. */
const KEEP = [
  ['r2r-metropolis-13', STRATEGIC, 'sea routes and naval access'],
  ['r2r-town-7', STRATEGIC, 'caravan route'],
  ['r2r-town-17', 'River ferry', 'the crossing rights held in one family'],
  ['r2r-town-28', 'Traveling performers', 'Bards, jugglers, acrobats'],
  ['r2r-town-15', 'Fish market', 'sold by weight'],
];

describe('TAIL-HOUSES-3 batch 5: a strategic line or a house text claims no navy, caravans, generations, fair, lord or fish the record denies', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); }, 120_000);

  test('where the record denies the old claim, the town prints the rewording, not the old text', () => {
    expectNoSeedFailures(collectSeedFailures(RED.map((r) => r.join('|')), (key) => {
      const [seed, house, denied, old, now] = key.split('|');
      const t = town(seed);
      const text = textOf(t, house);
      expect(text, `${seed} prints a ${house}`).toBeDefined();
      expect(DENIED[denied](t), `${seed}: the record denies the ${house}'s old claim (${denied})`).toBe(true);
      expectAbsentWithAnchor(String(text), old, now, `${seed} ${house}`);
    }), 'a strategic line or a house text claims nothing the record denies');
  }, 600_000);

  test('KEEP: the true sibling still prints', () => {
    expectNoSeedFailures(collectSeedFailures(KEEP.map((r) => r.join('|')), (key) => {
      const [seed, house, words] = key.split('|');
      const text = textOf(town(seed), house);
      expect(text, `${seed} prints a ${house}`).toBeDefined();
      expect(String(text), `${seed} ${house}`).toContain(words);
    }), 'the true sibling still prints');
  }, 600_000);
});
