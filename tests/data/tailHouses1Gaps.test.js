/**
 * TAIL-HOUSES batch 1 (2026-11-14; READ-ALL WORKLIST-HOUSES, the chair's ruling H2): a house described at work on the
 * input the record says never reaches it ("Potter exists but lacks access to clay": `resourceAnalysis.gaps[]` kind
 * `missing`). The description is drawn at birth, before the economy names the gap, and the vocabulary has no resource
 * word, so each text is reworded to claim the trade and not the present work ("whenever clay can be had").
 *
 * THIS FILE REDS WHEN a census town whose house lacks its input prints the old text again (each pair: the seed, the
 * house, the text that must not print and the rewording that prints in its place), or when a town whose house HAS
 * its input stops describing that trade (the KEEP pairs, green before and after).
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
/** @param {any} t @param {string} name */
const missing = (t, name) => (t.resourceAnalysis?.gaps || []).some((/** @type {any} */ g) => g.institution === name && g.kind === 'missing');

/** TAIL-HOUSES-5 (the chair's U2): six pairs RE-KEYED BY IDENTITY at the merged tree 01714675f: the defence lane's declared move
 * fcf4cae69 ("grapes and glass sand reach their house by any route the town can bring goods in on") closed the Vintner's and
 * the Glassblower's gap in r2r-city-5, r2r-town-16, r2r-town-32, r2r-town-8 and r2r-town-41, and the Sawmill of r2r-village-3
 * draws another text; each pair now names a town that still lacks the input and prints the same two texts (the two
 * Glassblower towns lie beyond the census's 720: none of the 720 prints those texts with the gap). */
/** [seed, house, the old text's opening (must not print), the rewording's opening (prints instead)] */
const RED = [
  ['r2r-village-4', 'Potter', 'Wheel-thrown pottery for domestic use.', 'A wheel and a small kiln for domestic pottery'],
  ['r2r-town-17', 'Potter', 'Throws pottery at the wheel for the household', 'Pottery for the household'],
  ['r2r-village-27', 'Potter', 'Domestic ware thrown on the wheel', 'A wheel and a modest kiln for domestic ware'],
  ['r2r-town-10', 'Brickmaker', 'Moulds and fires clay bricks for construction.', 'Moulds and fires clay bricks for construction whenever clay can be had.'],
  ['r2r-town-45', 'Brickmaker', 'Shapes and fires clay into bricks for building.', 'Shapes and fires clay into bricks for building, whenever clay can be had.'],
  ['r2r-town-28', 'Brickmaker', 'Clay is moulded and fired into building brick here', 'Moulds and a kiln for building brick'],
  ['r2r-city-48', 'Vintner', 'Produces and ages wine', 'Presses and ages wine'],
  ['r2r-metropolis-9', 'Vintner', 'Makes and ages wine', 'A cellar of presses and casks for wine'],
  ['r2r-metropolis-54', 'Vintner', 'Wine pressed and matured, from local fruit or imported must, sold in bulk to the taverns', 'Wine pressed and matured from local fruit or imported must, when either comes to the cellar'],
  ['r2r-hamlet-12', 'Dairy farmer', 'Keeps cattle or goats for milk, butter, and cheese.', 'A dairy for milk, butter, and cheese from cattle or goats'],
  ['r2r-hamlet-27', 'Dairy farmer', 'Keeps a herd of cattle or goats for milk', 'A dairy for milk, butter, and cheese, from a herd'],
  ['r2r-village-14', 'Dairy farmer', 'Runs cattle or goats for their milk', 'Milk, butter, and soft cheese from cattle or goats, whenever livestock can be had.'],
  ['r2r-city-22', 'Salt works', 'Evaporation pans or brine processing along the coast or riverbank.', 'Evaporation pans and brine-works, at work whenever brine can be had.'],
  ['r2r-village-36', 'Salt works', 'Evaporation pans and brine-works turn the local saline source into salt', 'Evaporation pans and brine-works for making salt whenever brine can be had'],
  ['r2r-town-29', 'Salt works', 'Salt is won from local brine', 'Broad evaporation pans, where salt is won from brine whenever brine can be had.'],
  ['r2r-hamlet-18', 'Salt works', 'The works can operate only where a strong local brine source supports it.', 'Evaporates brine, whenever brine can be had'],
  ['r2r-hamlet-26', 'Charcoal burner', 'Turf-covered kilns burn wood slowly down to charcoal', 'Turf-covered kilns for burning wood slowly down to charcoal whenever wood can be had'],
  ['r2r-town-17', 'Charcoal burner', 'What they make feeds the hottest fires in the settlement.', 'whenever wood can be had'],
  ['r2r-hamlet-9', 'Charcoal burner', "A collier's kilns, smoking under their turf", "A collier's kilns under their turf, turning wood into charcoal whenever wood can be had"],
  ['r2r-village-6', 'Sawmill', 'Expands construction and furniture output.', 'whenever logs can be had, for building and furniture'],
  ['r2r-village-14', 'Sawmill', 'It lifts what building and furniture-making the village can do.', 'whenever logs can be had, for building and furniture-making'],
  ['r2r-village-4', 'Sawmill', "widening the settlement's output", 'whenever logs can be had, for building timber and furniture'],
  ['r2r-village-9', 'Tannery', 'Converts hides into leather using oak bark. Foul', 'Converts hides into leather using oak bark, whenever hides can be had.'],
  ['r2r-village-14', 'Tannery', 'Turns hides to leather with oak bark. The stink', 'Turns hides to leather with oak bark, whenever hides can be had.'],
  ['r2r-village-49', 'Fishmonger', 'Buys, salts, and sells fish. The link', 'Buys, salts, and sells fish, whenever fish can be had.'],
  ['r2r-village-36', 'Fishmonger', 'Buys the catch, salts it', 'Buys fish whenever fish can be had'],
  ['r2r-town-293', 'Glassblower', 'Small-scale glasswork: bottles', 'Small-scale glasswork, when sand can be had'],
  ['r2r-town-406', 'Glassblower', 'Glass worked on a small scale: bottles', 'Glass worked on a small scale, whenever sand reaches the furnace'],
  ['r2r-town-9', 'Glassblower', 'A modest glassworks making bottles', 'A modest glassworks for bottles'],
  ['r2r-city-5', 'Smelter', 'Charcoal furnaces reduce raw ore to refined metal, cast in bars', 'Charcoal furnaces for reducing raw ore to refined metal whenever ore can be had'],
  ['r2r-city-36', 'Smelter', 'Refines crude ore into workable metal over charcoal fire, and sells', 'Refines crude ore into workable metal over charcoal fire whenever ore can be had'],
];

/** [seed, house, the trade its description still names] — towns whose house HAS its input (no gap). */
const KEEP = [
  ['r2r-town-15', 'Potter', /plates, jugs/],
  ['r2r-town-15', 'Brickmaker', /bricks? for (?:building|construction)|building brick/],
  ['r2r-hamlet-2', 'Dairy farmer', /milk, butter, and (?:soft )?cheese/],
  ['r2r-hamlet-3', 'Salt works', /salt/],
  ['r2r-village-36', 'Charcoal burner', /charcoal/i],
  ['r2r-village-11', 'Sawmill', /planks and beams/],
  ['r2r-village-52', 'Tannery', /leather/],
  ['r2r-village-13', 'Fishmonger', /salt/],
];

describe('TAIL-HOUSES batch 1: a house is not described at work on an input that never reaches it', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); }, 120_000);

  test('the house whose input is missing prints the rewording, not the old text', () => {
    expectNoSeedFailures(collectSeedFailures(RED.map((r) => r.join('|')), (key) => {
      const [seed, house, old, now] = key.split('|');
      const t = town(seed);
      const inst = instOf(t, house);
      expect(inst, `${seed} holds a ${house}`).toBeDefined();
      expect(missing(t, house), `${seed}: the ${house} lacks its input`).toBe(true);
      expectAbsentWithAnchor(String(inst.desc), old, now, `${seed} ${house}`);
    }), 'a house without its input is not described at work on it');
  }, 600_000);

  test('KEEP: a house that has its input still names its trade', () => {
    expectNoSeedFailures(collectSeedFailures(KEEP.map((r, i) => `${i}`), (i) => {
      const [seed, house, re] = KEEP[Number(i)];
      const t = town(/** @type {string} */ (seed));
      const inst = instOf(t, /** @type {string} */ (house));
      expect(inst, `${seed} holds a ${house}`).toBeDefined();
      expect(String(inst.desc), `${seed} ${house}`).toMatch(/** @type {RegExp} */ (re));
    }), 'the trade is still named');
  }, 600_000);
});
