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
  ['r2r-hamlet-18', 'Milled lumber', 'medicinal herbs'],    // no mill, no sawmill (re-keyed, D30 (b): its clay is unexploited)
  ['r2r-hamlet-18', 'Hospitality for travellers', 'medicinal herbs'], // the pilgrims' chain, run by the neighbour's church (re-keyed, D30 (b))
];
/** (seed, a worked good that stays, the house that works it) — green before and after */
const WORKED = [
  ['r2r-hamlet-2', 'metalwork', 'Resident smith (part-time)'],
  ['r2r-town-0', 'Boots and shoes', "Cobbler's guild"],
  ['r2s-recently_betrayed-town-0', 'Precious metals', 'Jeweller'],
  ['r2s-recently_betrayed-town-0', 'gems', 'Jeweller'],
];

describe('the made list names what the town\'s own houses make (C1-A)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test.each(C1A)('%s: "%s" is not listed as made; "%s" still is', (seed, gone, keep) => {
    const list = madeIn(seed);
    expect(list, 'GONE').not.toContain(gone);
    if (keep === EMPTY) expect(list, 'KEEP: the list is empty').toEqual([]);
    else expect(list, 'KEEP').toContain(keep);
  }, 60000);

  test.each(WORKED)('%s: "%s" stays, worked by its %s', (seed, keep, house) => {
    expect(madeIn(seed)).toContain(keep);
    expect(birth(seed).institutions.map((/** @type {any} */ i) => i.name)).toContain(house);
  }, 60000);
});

describe('the made list names goods (C2-A)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test.each(C2A)('%s: "%s" is not listed as made; "%s" still is', (seed, gone, keep) => {
    const list = madeIn(seed);
    expect(list, 'GONE').not.toContain(gone);
    expect(list, 'KEEP').toContain(keep);
  }, 60000);

  test('the place the keys left: r2r-town-14 lists its jeweller\'s cut gemstones (no longer folded by the catalog into the "luxury" key)', () => {
    expect(madeIn('r2r-town-14')).toContain('Cut gemstones');
  }, 60000);
});
