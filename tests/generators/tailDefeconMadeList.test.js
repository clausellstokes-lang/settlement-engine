/**
 * tailDefeconMadeList.test.js — TAIL-DEFECON-C (the chair's rulings D6 and D7, 2026-11-14): the record's made list
 * (`economicState.localProduction`, written by `computeActiveChains.js :: deriveLocalProductionFromChains`) names what
 * the town's own houses make, and only goods.
 *
 * Born as the census born its 720 (RECORD-MEASURE-1, `seedcfg.mjs`, the r2r- arm). Each GONE pair was red at the
 * base (345f13157); each KEEP pair is a true sibling in the same town, green before and after.
 *
 * (C2-A) A CATEGORY KEY IS NOT A GOOD: no `trade access`, `maritime access`, `Toll income`, `Market taxes`,
 * `luxury`, `Strategic control` or `water` (302 towns at the base; 0 after; the made list alone moves).
 * (C1-A) A GOOD IS MADE WHERE A HOUSE THAT DIGS IT OR WORKS IT STANDS: a land's commodity asks the export's extraction
 * gate, widened (D7) by the houses that work the good (a smith's iron, a jeweller's gems); a chain counts only where a
 * house of this town (not the walk to another's: "Access to parish church") processes it, and a gated output only where
 * its maker stands (a cobbler's boots, a jeweller's or metalworker's precious metals are worked goods).
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
  selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** The census's r2r- birth. @param {string} seed */
const birth = (seed) => {
  const s = seed.match(/^r2s-(\w+)-(\w+)-\d+$/);
  const over = s ? { selectedStresses: [s[1]], selectedStressesRandom: false, settType: s[2] }
    : { settType: /** @type {RegExpMatchArray} */ (seed.match(/^r2r-(\w+)-\d+$/))[1] };
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, ...over }), null, { seed, customContent: {} });
};
/** @type {Map<string, string[]>} */
const made = new Map();
/** @param {string} seed */
const madeIn = (seed) => {
  if (!made.has(seed)) made.set(seed, /** @type {string[]} */ (birth(seed).economicState.localProduction || []));
  return /** @type {string[]} */ (made.get(seed));
};

/** (seed, the key that must not be listed as made, what is still listed there instead) */
const C2A = [
  ['r2r-thorp-8', 'luxury', 'Honey and beeswax'],
  ['r2r-thorp-4', 'water', 'dates'],
  ['r2r-town-4', 'maritime access', 'salt'],
  ['r2r-town-14', 'Toll income', 'Baked goods'],
  ['r2r-town-14', 'Market taxes', 'grain'],
  ['r2r-town-14', 'trade access', 'flour'],
  ['r2r-town-30', 'Strategic control', 'Overland cargo transport'],
  ['r2r-city-2', 'trade access', 'fish'],
  ['r2r-city-2', 'maritime access', 'Salted fish'],
];

/** The KEEP of a town whose made list is now empty: no good is listed, and the row is silent by design. */
const EMPTY = '(the list is empty)';
/** (seed, the good no house of the town makes, a good the town still makes) */
const C1A = [
  // RE-KEYED BY IDENTITY (TAIL-DEFECON-C-3, D30 (b)): r2r-thorp-0's one good was its medicinal herbs, which no house works
  // (the record's exploitation names the herbs unexploited): its list is now EMPTY, and the Produced-locally row silent.
  ['r2r-thorp-0', 'stone', EMPTY],                          // a quarry's land, no quarry or mason
  ['r2r-thorp-0', 'game meat', EMPTY],                      // hunting grounds, no hunter, wildfowler, warden or furrier
  ['r2r-thorp-1', 'iron', 'honey'],                         // iron in the ground, no mine, smelter or smith
  ['r2r-thorp-4', 'gems', 'dates'],                         // no mine, no jeweller
  ['r2r-thorp-6', 'Religious services', 'honey'],           // only "Access to parish church"
  ['r2r-thorp-7', 'timber', 'wool'],                        // no sawmill, woodcutter, charcoal burner or carpenter
  ['r2r-thorp-12', 'Baked goods', 'grain'],                 // only "Access to external mill"
  ['r2r-hamlet-2', 'Leather goods', 'iron'],                // no tanner; THE SMITH'S IRON STAYS (D7)
  // RE-KEYED BY IDENTITY (TAIL-DEFECON-C-4, D34): hamlet-18's last good was the hot springs' herbs; the springs give none,
  // so its list is EMPTY and the Produced-locally row silent by design.
  ['r2r-hamlet-18', 'Milled lumber', EMPTY],                // no mill, no sawmill
  ['r2r-hamlet-18', 'Hospitality for travellers', EMPTY],   // the pilgrims' chain, run by the neighbour's church
  // RE-KEYED BY IDENTITY (D34): this was a WORKED row ("gems" stays by its Jeweller). A precious-metal vein gives no gems,
  // and no resource's commodities name gems now (the gem deposit's hold only "luxury": NAMED for the data's holder), so
  // the jeweller's gems leave; its gold and silver stay (the WORKED row below).
  ['r2s-recently_betrayed-town-0', 'gems', 'Precious metals'],
];
/** (seed, a worked good that stays, the house that works it) — green before and after */
const WORKED = [
  ['r2r-hamlet-2', 'metalwork', 'Resident smith (part-time)'],
  ['r2r-town-0', 'Boots and shoes', "Cobbler's guild"],
  ['r2s-recently_betrayed-town-0', 'Precious metals', 'Jeweller'],
];

describe('the made list names what the town\'s own houses make (C1-A)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('C1A (every row) seed: the good no house makes is not listed as made; the kept good still is', () => {
    expectNoSeedFailures(collectSeedFailures(C1A, ([seed, gone, keep]) => {
      const list = madeIn(seed);
      if (keep === EMPTY) {
        expect(list, 'KEEP: the list is empty').toEqual([]);
        // anchored: the line above pins this same list's exact value (empty, the row silent by design)
        expect(list, 'GONE').not.toContain(gone);
      } else {
        expectAbsentWithAnchor(list, gone, keep, 'GONE');
        expect(list, 'KEEP').toContain(keep);
      }
    }), 'C1A: no town lists as made a good no house of it makes, and each keeps its sibling');
  }, 60000);

  test('WORKED (every row) seed: the worked good stays, worked by its house', () => {
    expectNoSeedFailures(collectSeedFailures(WORKED, ([seed, keep, house]) => {
      expect(madeIn(seed)).toContain(keep);
      expect(birth(seed).institutions.map((/** @type {any} */ i) => i.name)).toContain(house);
    }), 'WORKED: each worked good stays where its house stands');
  }, 60000);
});

describe('the made list names goods (C2-A)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('C2A (every row) seed: the category key is not listed as made; the good still is', () => {
    expectNoSeedFailures(collectSeedFailures(C2A, ([seed, gone, keep]) => {
      const list = madeIn(seed);
      expectAbsentWithAnchor(list, gone, keep, 'GONE');
      expect(list, 'KEEP').toContain(keep);
    }), 'C2A: no town lists a category key as made, and each keeps its good');
  }, 60000);

  test('the place the keys left: r2r-town-14 lists its jeweller\'s cut gemstones (no longer folded by the catalog into the "luxury" key)', () => {
    expect(madeIn('r2r-town-14')).toContain('Cut gemstones');
  }, 60000);
});
