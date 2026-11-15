/**
 * TAIL-HOUSES-2 batch 3 (2026-11-15; READ-ALL WORKLIST-HOUSES, the chair's ruling H7): a house text that names what the
 * record denies in ordinary times. A wall house names a citadel ring where no Citadel is born; a burial ground names a
 * gate where the defence has none; a quarry is described at work, and as the region's stone, where its stone quarry is
 * depleted or stone is imported; a mine is "the reason the settlement grew" where the founding names no mine; a garrison is
 * in "noble or royal pay" under a ruler who is neither; a fishing community takes "what the water gives" where the fish
 * are depleted. Each text is reworded to claim no more than every printing town bears (S5's one hedge form, "whenever
 * <input> can be had", where an input may fail). No draw moved: the same pools, the same hash, the same index.
 *
 * THIS FILE REDS WHEN a census town where the record denies the old claim prints the old text again (each pair: the
 * seed, the house, the old text's words that must not print, the rewording's words that print in its place), or when
 * the house's text is no longer drawn there at all (the rewording is asserted present).
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
/** @param {any} t @param {string} name */
const instOf = (t, name) => (t.institutions || []).find((/** @type {any} */ i) => i.name === name);
/** @param {any} t @param {string} key */
const resource = (t, key) => (t.resourceAnalysis?.resourceConditions || []).find((/** @type {any} */ r) => r.key === key)?.condition;

const WALLS = 'Massive walls and fortifications';
/** What makes the old claim false in that town, read off the record. @type {Record<string, (t: any) => boolean>} */
const DENIED = {
  citadel: (t) => !instOf(t, 'Citadel'),
  gate: (t) => atomHolds('gate', factsOf(t)) !== true,
  quarry: (t) => resource(t, 'stone_quarry') !== 'available',
  stone: (t) => resource(t, 'stone_quarry') !== 'available' || /stone/i.test(JSON.stringify(t.resourceAnalysis?.imports || {})),
  founding: (t) => !/\b(mines?|mining|ores?|deposits?|seams?|lodes?)\b/i.test(JSON.stringify(t.settlementReason)),
  pay: (t) => atomHolds('ruler: lord', factsOf(t)) !== true,
  fish: (t) => resource(t, 'river_fish') !== 'available',
};

/** [seed, house, what denies it, the old text's words (must not print), the rewording's words (print instead)] */
const RED = [
  ['r2r-metropolis-11', WALLS, 'citadel', 'citadel ring', 'Layered wall systems: an outer wall and an inner wall'],
  ['r2r-metropolis-5', WALLS, 'citadel', 'and the citadel ring', 'Walls within walls: an outer line and an inner line'],
  ['r2r-metropolis-8', WALLS, 'citadel', 'the ring about the citadel', 'A defence built in layers, an outer wall and an inner wall'],
  ['r2r-town-2', 'Parish burial grounds', 'gate', 'burial beyond the gate', 'and burial out beyond the houses'],
  ['r2r-town-15', 'Stone quarry', 'quarry', "Half the region's building stone was cut here.", 'worked whenever good stone can be had'],
  ['r2r-city-3', 'Stone quarry', 'quarry', 'has gone to every part of the region', 'at work whenever good stone can be had'],
  ['r2r-town-33', 'Stone quarry', 'stone', "Much of the region's building stone was cut here.", 'A stone quarry and its dressing yards, worked whenever good stone can be had.'],
  ['r2r-town-38', 'Mine', 'founding', 'the settlement grew around the mine', 'at the pithead, worked whenever ore can be had'],
  ['r2r-town-12', 'Mine', 'founding', 'the mine is the reason the settlement grew', 'with its winding gear and ore carts, worked whenever ore can be had'],
  ['r2r-town-45', 'Mine', 'founding', 'the mine is why the place grew at all', 'at the head, worked whenever ore can be had'],
  ['r2r-city-3', 'Garrison', 'pay', 'in noble or royal pay', 'A standing force, paid to bear arms.'],
  ['r2s-plague_onset-thorp-2', 'Fishing community', 'fish', 'what the water gives, the fishing households take', 'worked by the fishing households whenever fish can be had'],
];

/** [seed, house, the trade or the thing its text still names] — true siblings: green before and after. */
const KEEP = [
  ['r2r-metropolis-3', 'Citadel', 'fortress'],
  ['r2r-metropolis-3', WALLS, 'wall'],
  ['r2r-city-11', 'Stone quarry', 'yards beside it for dressing the stone'],
  ['r2r-town-11', 'Mine', 'winding gear and ore carts'],
  ['r2r-city-4', 'Garrison', 'arms'],
  ['r2r-thorp-30', 'Fishing community', 'drying racks'],
];

describe('TAIL-HOUSES-2 batch 3: a house text claims no citadel, gate, deposit, founding or payer the record denies', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); }, 120_000);

  test('where the record denies the old claim, the house prints the rewording, not the old text', () => {
    expectNoSeedFailures(collectSeedFailures(RED.map((r) => r.join('|')), (key) => {
      const [seed, house, denied, old, now] = key.split('|');
      const t = town(seed);
      const inst = instOf(t, house);
      expect(inst, `${seed} holds a ${house}`).toBeDefined();
      expect(DENIED[denied](t), `${seed}: the record denies the ${house}'s old claim (${denied})`).toBe(true);
      expectAbsentWithAnchor(String(inst.desc), old, now, `${seed} ${house}`);
    }), 'a house text claims nothing the record denies');
  }, 600_000);

  test('KEEP: the house still names what it is', () => {
    expectNoSeedFailures(collectSeedFailures(KEEP.map((r) => r.join('|')), (key) => {
      const [seed, house, words] = key.split('|');
      const inst = instOf(town(seed), house);
      expect(inst, `${seed} holds a ${house}`).toBeDefined();
      expect(String(inst.desc), `${seed} ${house}`).toContain(words);
    }), 'the true sibling still prints');
  }, 600_000);
});
