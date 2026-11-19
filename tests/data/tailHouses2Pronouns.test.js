/**
 * TAIL-HOUSES batch 2 (2026-11-14; READ-ALL WORKLIST-HOUSES, the chair's ruling H2): a house description that gives its
 * one person a sex ("Casks for storage and carriage, all his making."; "Women brew and sell ale.") where the house's own
 * person (`npcs[].institution.key`) is drawn of either sex. Each text is reworded to name no sex.
 *
 * THIS FILE REDS WHEN a census town whose house person is of the other sex prints the old text again (each pair: the
 * seed, the house, the text that must not print and the rewording that prints in its place), or when the house's text
 * is no longer drawn there at all (it must still name its trade: the rewording is asserted present).
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

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
/** @param {any} t @param {string} name */
const instOf = (t, name) => (t.institutions || []).find((/** @type {any} */ i) => i.name === name);
/** [seed, house, the old text's words (must not print), the rewording's words (print instead)] */
const RED = [
  ['r2r-thorp-4', "Lord's reeve", 'His writ is legitimate', 'The writ is legitimate; the welcome is not.'],
  ['r2r-thorp-16', "Lord's reeve", 'The paperwork backs him.', 'The paperwork backs the office.'],
  ['r2r-hamlet-15', "Lord's steward", "A lord's man runs", "A lord's agent runs"],
  ['r2r-hamlet-27', 'Shepherd', 'The textile trade leans on him.', 'Wool is the first of what the flocks yield.'],
  ['r2r-hamlet-39', 'Peat cutter', 'what he sells is winter warmth', 'what it sells is winter warmth'],
  ['r2r-village-4', "Cartographer's workshop", 'draws and sells his work', "A mapmaker's workshop, drawing and selling"],
  ['r2r-village-6', 'Mill', 'the richest man in the village', 'Whoever keeps them tends to be the richest in the village'],
  ['r2r-village-8', 'Ale house', "is women's work", 'Ale is brewed and sold under the same roof.'],
  ['r2r-village-24', 'Ale house', 'Women brew and sell ale.', 'Ale brewed in the house and sold from it.'],
  ['r2r-village-51', 'Ale house', 'Women brew the ale and sell it.', 'The ale is brewed at home and sold there.'],
  ['r2r-village-8', 'Carpenter', 'all his work', 'all of it made here'],
  ['r2r-village-10', 'Fence (word of mouth)', 'He works from behind', 'The dealing is done from behind'],
  ['r2r-village-14', 'Village musician', 'Through his songs', 'Through those songs'],
  ['r2r-village-34', 'Blacksmith', 'depend on him', 'depend on this work'],
  ['r2r-town-3', 'Jeweller', 'He works to commission', 'The work is to commission'],
  ['r2r-town-4', 'Blacksmiths (3-10)', 'each to his specialty', 'Several ironworkers, each to a specialty.'],
  ['r2r-town-9', 'Cooper', 'all his making', 'all made here'],
  ['r2r-town-54', 'Woodcarver', 'he shapes sacred images', 'Sacred images and reliquaries are carved here too.'],
];

/** [seed, house, the trade its text still names] — towns whose house person matches the old text: green before and after. */
const KEEP = [
  ['r2r-town-27', 'Cooper', 'Casks for storage and carriage'],
  ['r2r-town-32', 'Woodcarver', 'Carves both plain and decorative pieces from wood'],
  ['r2r-village-16', 'Mill', 'the sole right to grind'],
  ['r2r-village-6', 'Ale house', 'Run from the home.'],
  ['r2r-village-23', 'Blacksmith', 'Works metal full-time.'],
];

describe('TAIL-HOUSES batch 2: a house description gives its one person no sex', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); }, 120_000);

  test('the house whose person is of the other sex prints the rewording, not the old text', () => {
    expectNoSeedFailures(collectSeedFailures(RED.map((r) => r.join('|')), (key) => {
      const [seed, house, old, now] = key.split('|');
      const t = town(seed);
      const inst = instOf(t, house);
      expect(inst, `${seed} holds a ${house}`).toBeDefined();
      const face = (t.npcs || []).find((/** @type {any} */ n) => n.institution?.key === house);
      expect(face, `${seed}: the ${house} has its person`).toBeDefined();
      expect(face.gender, `${seed}: the ${house}'s person is of the other sex`).toBe(/women/i.test(old) ? 'male' : 'female');
      expectAbsentWithAnchor(String(inst.desc), old, now, `${seed} ${house}`);
    }), 'a house description names no sex for its person');
  }, 600_000);

  test('KEEP: the house still names its trade', () => {
    expectNoSeedFailures(collectSeedFailures(KEEP.map((r) => r.join('|')), (key) => {
      const [seed, house, trade] = key.split('|');
      const inst = instOf(town(seed), house);
      expect(inst, `${seed} holds a ${house}`).toBeDefined();
      expect(String(inst.desc), `${seed} ${house}`).toContain(trade);
    }), 'the trade is still named');
  }, 600_000);
});
