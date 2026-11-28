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
  // LEFT-KEYS K2 (2026-11-18): a town of the 150 (`bar0-`), as CENSUS-3 seedcfg.mjs's bar0- arm births it
  const read = /^bar0-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-([a-z_]+)-\d+$/.exec(seed);
  if (read) {
    const route = read[3] === 'rand' ? {} : { tradeRouteAccess: read[3] };
    return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...route, settType: read[1], selectedStressesRandom: false, selectedStresses: read[2] === 'calm' ? [] : read[2].split('+'), _randomizePriorities: true }), null, { seed, customContent: {} });
  }
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
/** LEFT-KEYS K2 (2026-11-18; L12, R8): THE SUPPLY RULE (BIRTH-3, the chair's BR4/BR5) buys in, or finds on a ground the house
 * proves, the input of 23 of the 31 pairs below: their houses' gap is `imported` or gone (the town has the input now), so the
 * claim left them. Each pair is RE-KEYED BY IDENTITY where a town of the census's 720 (else the 150, `bar0-`) holds the same
 * house with its gap still `missing` AND draws the same text's rewording, word for word: 11 pairs, each with a dated note.
 * The other 12 are borne by no town of the 720 or the 150 and are RETIRED, listed below the table with their note (no
 * Fishmonger and no Smelter lacks its input in either: a fish or ore buyer on a road buys it in). THE COUNT: 19 pairs (8 kept
 * as they were, 11 re-keyed), 12 retired, of the 31. */
/** LASTCLOSE-DOORS (2026-11-18, the last close; C1 (b)): THREE pairs RE-KEYED BY IDENTITY at cc11c9504. Point 68 (FAULTS-BIRTH's
 * follow-ups, FR21/FR23: "the common proves its pasture"; wool and hides read their grounds) closed the gap of the Dairy farmer
 * of r2r-hamlet-56 and r2r-hamlet-27 and the Tannery of r2s-plague_onset-village-2: each town keeps a Common grazing land, and
 * the gap list holds no row for the house now (measured: `resourceAnalysis.gaps` empty for it). No town of the census's 720
 * or the 150 holds either house with its gap `missing` (scanned whole at cc11c9504), so, as TAIL-HOUSES-5 did, each pair
 * names a town beyond them (r2r- by the same configuration) whose house still lacks its input and prints the same two texts. */
/** [seed, house, the old text's opening (must not print), the rewording's opening (prints instead)] */
const RED = [
  ['r2r-town-54', 'Potter', 'Wheel-thrown pottery for domestic use.', 'A wheel and a small kiln for domestic pottery'], // RE-KEYED 2026-11-18 (LEFT-KEYS K2): from r2r-village-4 (its clay bought in now)
  ['r2r-city-48', 'Potter', 'Throws pottery at the wheel for the household', 'Pottery for the household'], // RE-KEYED 2026-11-18 (LEFT-KEYS K2): from r2r-town-17 (its clay bought in now)
  ['r2r-village-34', 'Potter', 'Domestic ware thrown on the wheel', 'A wheel and a modest kiln for domestic ware'], // RE-KEYED 2026-11-18 (LEFT-KEYS K2): from r2r-village-27 (its clay bought in now)
  ['r2r-city-48', 'Brickmaker', 'Moulds and fires clay bricks for construction.', 'Moulds and fires clay bricks for construction whenever clay can be had.'], // RE-KEYED 2026-11-18 (LEFT-KEYS K2): from r2r-town-10 (its clay bought in now)
  ['r2r-city-49', 'Brickmaker', 'Shapes and fires clay into bricks for building.', 'Shapes and fires clay into bricks for building, whenever clay can be had.'], // RE-KEYED 2026-11-18 (LEFT-KEYS K2): from r2r-town-45 (its clay bought in now)
  ['r2r-town-54', 'Brickmaker', 'Clay is moulded and fired into building brick here', 'Moulds and a kiln for building brick'], // RE-KEYED 2026-11-18 (LEFT-KEYS K2): from r2r-town-28 (its clay bought in now)
  ['r2r-city-48', 'Vintner', 'Produces and ages wine', 'Presses and ages wine'],
  ['r2r-metropolis-9', 'Vintner', 'Makes and ages wine', 'A cellar of presses and casks for wine'],
  ['r2r-metropolis-54', 'Vintner', 'Wine pressed and matured, from local fruit or imported must, sold in bulk to the taverns', 'Wine pressed and matured from local fruit or imported must, when either comes to the cellar'],
  ['r2r-hamlet-1944', 'Dairy farmer', 'Keeps cattle or goats for milk, butter, and cheese.', 'A dairy for milk, butter, and cheese from cattle or goats'], // RE-KEYED 2026-11-18 (LEFT-KEYS K2): from r2r-hamlet-12 (its gap gone); RE-KEYED 2026-11-18 (LASTCLOSE-DOORS): from r2r-hamlet-56 (its Common grazing land proves the pasture now: point 68, FR23)
  ['r2r-hamlet-714', 'Dairy farmer', 'Keeps a herd of cattle or goats for milk', 'A dairy for milk, butter, and cheese, from a herd'], // RE-KEYED 2026-11-18 (LASTCLOSE-DOORS): from r2r-hamlet-27 (its Common grazing land proves the pasture now: point 68, FR23)
  ['r2r-metropolis-58', 'Salt works', 'Evaporation pans or brine processing along the coast or riverbank.', 'Evaporation pans and brine-works, at work whenever brine can be had.'], // RE-KEYED 2026-11-18 (LEFT-KEYS K2): from r2r-city-22 (its salt bought in now)
  ['r2r-hamlet-26', 'Charcoal burner', 'Turf-covered kilns burn wood slowly down to charcoal', 'Turf-covered kilns for burning wood slowly down to charcoal whenever wood can be had'],
  ['r2s-occupied-metropolis-3', 'Charcoal burner', 'What they make feeds the hottest fires in the settlement.', 'whenever wood can be had'], // RE-KEYED 2026-11-18 (LEFT-KEYS K2): from r2r-town-17 (its gap gone); the same text, word for word
  ['bar0-village-calm-rand-40', 'Sawmill', 'It lifts what building and furniture-making the village can do.', 'whenever logs can be had, for building and furniture-making'], // RE-KEYED 2026-11-18 (LEFT-KEYS K2): from r2r-village-14 (its logs bought in now); no town of the 720 bears it, this one of the 150 does
  ['r2r-village-1472', 'Tannery', 'Converts hides into leather using oak bark. Foul', 'Converts hides into leather using oak bark, whenever hides can be had.'], // RE-KEYED 2026-11-18 (LEFT-KEYS K2): from r2r-village-9 (its hides bought in now); RE-KEYED 2026-11-18 (LASTCLOSE-DOORS): from r2s-plague_onset-village-2 (its Common grazing land proves the pasture its hides come from now: point 68, FR21/FR23)
  // BAR4-CLOSE-SWEEP (2026-11-16, the chair's word of 16:44): re-keyed by identity from r2r-village-36, whose Fishmonger the record
  // now answers (BAR4-RECORD b7d3da983, R1, declared: the gap's writer reads the page's one reading; the town's food record names fish,
  // "Its own food is the day's catch", so the gap is `imported`, and the page agrees: no fish gap line, the house unmarked). Measured on
  // the 720 at 1a5678df0: 4 fishmongers still lack fish (r2r-village-49, a case above; r2r-village-57; r2s-succession_void-village-0;
  // r2s-monster_pressure-village-2), none drawing this row's "Buys the catch" variant; this one draws the third variant, so its own
  // pair (the old text of a2550c0ef, its rewording) is the anchor. The "Buys the catch" twin stays in the data (a reachable state).
  // (That pair is RETIRED 2026-11-18, LEFT-KEYS K2: below the table.)
  ['r2r-town-293', 'Glassblower', 'Small-scale glasswork: bottles', 'Small-scale glasswork, when sand can be had'],
  ['r2r-town-406', 'Glassblower', 'Glass worked on a small scale: bottles', 'Glass worked on a small scale, whenever sand reaches the furnace'],
  ['r2r-town-9', 'Glassblower', 'A modest glassworks making bottles', 'A modest glassworks for bottles'],
];
/** RETIRED 2026-11-18 (LEFT-KEYS K2; L12, R8): 12 pairs whose house now has its input in its own town (the supply rule buys it
 * in, or the gap is gone) and that NO TOWN of the census's 720 or the 150 bears (the same house, its gap `missing`, the same
 * text's rewording). Each as it stood:
 *   ['r2r-village-14', 'Dairy farmer', 'Runs cattle or goats for their milk', 'Milk, butter, and soft cheese from cattle or goats, whenever livestock can be had.']
 *   ['r2r-village-36', 'Salt works', 'Evaporation pans and brine-works turn the local saline source into salt', 'Evaporation pans and brine-works for making salt whenever brine can be had']
 *   ['r2r-town-29', 'Salt works', 'Salt is won from local brine', 'Broad evaporation pans, where salt is won from brine whenever brine can be had.']
 *   ['r2r-hamlet-18', 'Salt works', 'The works can operate only where a strong local brine source supports it.', 'Evaporates brine, whenever brine can be had']
 *   ['r2r-hamlet-9', 'Charcoal burner', "A collier's kilns, smoking under their turf", "A collier's kilns under their turf, turning wood into charcoal whenever wood can be had"]
 *   ['r2r-village-6', 'Sawmill', 'Expands construction and furniture output.', 'whenever logs can be had, for building and furniture']
 *   ['r2r-village-4', 'Sawmill', "widening the settlement's output", 'whenever logs can be had, for building timber and furniture']
 *   ['r2r-village-14', 'Tannery', 'Turns hides to leather with oak bark. The stink', 'Turns hides to leather with oak bark, whenever hides can be had.']
 *   ['r2r-village-49', 'Fishmonger', 'Buys, salts, and sells fish. The link', 'Buys, salts, and sells fish, whenever fish can be had.']
 *   ['r2s-succession_void-village-0', 'Fishmonger', 'Deals in fish: bought, salted', 'Deals in fish, whenever fish can be had']
 *   ['r2r-city-5', 'Smelter', 'Charcoal furnaces reduce raw ore to refined metal, cast in bars', 'Charcoal furnaces for reducing raw ore to refined metal whenever ore can be had']
 *   ['r2r-city-36', 'Smelter', 'Refines crude ore into workable metal over charcoal fire, and sells', 'Refines crude ore into workable metal over charcoal fire whenever ore can be had']
 * The Salt works, the Charcoal burner, the Sawmill and the Tannery keep a pair of their own above; the Dairy farmer two. */

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
