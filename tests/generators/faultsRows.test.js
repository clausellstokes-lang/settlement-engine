// THE GUARD OF FAULTS-ROWS (the sixth chair's BRIEF-FAULTS, rulings FR3 and FR4, 2026-11-18): THE CARDS SAY WHAT THE TOWN'S OWN
// NEED LIST SAYS. The Annual fair's two lines, "Regional merchants. Luxury goods available." and "Merchants from across the
// region, and luxuries to be had.", printed in towns whose Economics tab says "Needed, and not brought in: luxury goods." (the
// control C32296, bar0-town-calm-rand-45). THE CURE (`src/data/institutionDescVariants.js :: DESC_LATE_SIBLINGS`, read by the late
// re-read `steps/assembleSettlement.js :: readHouseDescsLate`, no draw): each line declares `need not brought in: luxury` off
// (`domain/facts/needNotBroughtIn.js`, FAULTS-NEED's atom) and its twin, in its siege twin's form, says the fair is held and
// names no luxury as to be had. A town whose need list names no luxury keeps its line; a town under siege at the draw keeps the
// siege twin (the draw's declaration comes first). The fact asserted beside each anchor is the PAGE'S OWN need list
// (`tradeListDisplay.js :: importsAsPrinted().needed`), not the cure's atom. The counts over the thirty, the 150 and the 720 are
// in docs/chair/2026-11-18/faults/FAULTS-ROWS-HANDBACK.md; every seed loop collects.
import { beforeAll, describe, expect, it } from 'vitest';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { importsAsPrinted } from '../../src/domain/display/tradeListDisplay.js';
import { toPublicSafe } from '../../src/domain/display/publicSafe.js';
import { LUXURY_CLASS } from '../../src/data/tradeListDeclarations.js'; // FR20 (1): the declared pool's own texts
import { DESC_LATE_SIBLINGS } from '../../src/data/institutionDescVariants.js';
import { speakTierNoun } from '../../src/domain/display/stateProse/stateProseKernel.js';
import { tierNounFor } from '../../src/domain/display/stateProse/weaveBlock.js';

const FAIR = 'Annual fair';
const LINE_A = 'Regional merchants. Luxury goods available.';
const LINE_B = 'Merchants from across the region, and luxuries to be had.';
const TWIN_A = 'A yearly fair for regional merchants. The luxuries the town wants do not reach it.';
const TWIN_B = "A yearly gathering of the region's merchants, though the luxuries the town wants do not come with them.";
const SIEGE_A = 'A yearly fair for regional merchants. None can reach it while the roads are held.';
// FR12 (1), 2026-11-18: the fair's third line, its "fine goods on offer", in the same form
const LINE_C = 'A yearly draw for regional traders, with fine goods on offer.';
const TWIN_C = 'A yearly draw for regional traders, though the fine goods the town wants do not reach it.';

/** THE LUXURY UNMET: the fair's line drawn, the need list names a luxury not brought in. [seed, the line drawn, its twin] */
const UNMET = Object.freeze([
  ['bar0-town-calm-rand-45', LINE_A, TWIN_A], ['r2r-town-56', LINE_A, TWIN_A], ['r2r-town-57', LINE_A, TWIN_A],
  ['r2s-recently_betrayed-town-0', LINE_A, TWIN_A], ['r2r-town-10', LINE_B, TWIN_B], ['r2s-monster_pressure-town-3', LINE_B, TWIN_B],
  ['r2s-wartime-town-2', LINE_B, TWIN_B],
  ['bar0-town-calm-rand-46', LINE_C, TWIN_C], ['bar0-town-occupied-rand-46', LINE_C, TWIN_C], ['bar0-town-occupied-rand-47', LINE_C, TWIN_C],
  ['bar0-town-occupied-rand-35', LINE_C, TWIN_C], ['r2r-town-47', LINE_C, TWIN_C], ['r2r-town-50', LINE_C, TWIN_C],
  ['r2s-famine-town-1', LINE_C, TWIN_C], ['r2s-indebted-town-1', LINE_C, TWIN_C],
]);
/** THE NEGATIVES: the fair's line drawn and the need list names no luxury (salt, gold/silver ore, livestock, stone, nothing). */
const MET = Object.freeze([
  ['r2r-town-31', LINE_A], ['r2r-town-49', LINE_A], ['r2r-town-54', LINE_A], ['r2r-town-23', LINE_B], ['bar0-town-calm-rand-28', LINE_B],
  ['bar0-town-occupied-rand-31', LINE_C], ['bar0-town-occupied-rand-34', LINE_C],
]);
/** UNDER SIEGE AT THE DRAW, a luxury unmet: the siege twin stands (the draw's declaration first). */
const SIEGED = Object.freeze([['r2s-under_siege-town-2', SIEGE_A]]);

/** FR12 (2), 2026-11-18: THE LUXURY QUARTER'S TWO LINES (their colour marks struck). [seed, the line drawn, its twin] */
const QUARTER = 'Luxury goods quarter';
const Q1 = 'Silks, spices, and other precious goods.';
const Q2 = 'The trade in silk, spice, and precious things.';
const QT1 = 'Fine goods of every kind, though the spice or silk the town wants never arrives.';
const QT2 = 'Fine things are traded here, though the spice or silk the town wants does not reach it.';
/** The need list names "spices": the twin. */
const Q_UNMET = Object.freeze([
  ['r2r-city-29', Q2, QT2], ['r2s-wartime-city-0', Q2, QT2], ['bar0-city-wartime-rand-28', Q2, QT2],
  ['r2r-city-17', Q1, QT1], ['r2r-metropolis-18', Q1, QT1], ['bar0-city-under_siege+famine-rand-29', Q1, QT1],
]);
/** Another good unmet (gold/silver ore, the mint's want; livestock): the line stands. */
const Q_MET = Object.freeze([['r2r-city-30', Q2], ['r2r-metropolis-0', Q2], ['r2r-city-21', Q1], ['r2r-city-39', Q1]]);

const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** CENSUS-3 seedcfg.mjs's census and bar arms, in shape (as `bar8FishRows.test.js` reads them). @param {string} seed */
function configOf(seed) {
  const c = seed.match(new RegExp(`^r2r-${SIZE}-(\\d+)$`));
  if (c) return { ...DIALS, settType: c[1] };
  const f = seed.match(new RegExp(`^r2s-(\\w+)-${SIZE}-(\\d+)$`));
  if (f) return { ...DIALS, selectedStresses: [f[1]], selectedStressesRandom: false, settType: f[2] };
  const m = seed.match(new RegExp(`^bar0-${SIZE}-([a-z_+]+)-([a-z_]+)-(\\d+)$`));
  if (!m) throw new Error(`a guard seed is a census or a read seed: ${seed}`);
  const st = m[2] === 'calm' ? [] : m[2].split('+'); const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
  return { ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: st, _randomizePriorities: true };
}

/** @type {Map<string, any>} */
const BORN = new Map();
beforeAll(async () => {
  const boundary = await import('../../src/domain/density/densityCreateBoundary.js');
  const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
  const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
  await boundary.loadGenerationLawPayloads();
  for (const [seed] of [...UNMET, ...MET, ...SIEGED, ...Q_UNMET, ...Q_MET]) {
    BORN.set(seed, generateSettlementPipeline(boundary.birthConfig({ ...DEFAULT_CONFIG, ...configOf(seed) }), null, { seed, customContent: {} }));
  }
}, 600_000);

const LUXURY = new Set(LUXURY_CLASS.map((l) => String(l.text).toLowerCase()));
/** The page's own need list names a luxury ("Needed, and not brought in: luxury goods."). @param {any} town */
const luxuryUnmet = (town) => importsAsPrinted(town).needed.some((n) => LUXURY.has(String(n).trim().toLowerCase()) || /\b(luxury|exotic)\b/i.test(String(n)));
/** @param {any} town */
const fairDescs = (town) => (town?.institutions || []).filter((/** @type {any} */ i) => i?.name === FAIR).map((/** @type {any} */ i) => String(i.desc));

describe('FAULTS-ROWS items 1 and 4: the Annual fair offers no luxury the need list says is not brought in (FR3)', () => {
  it('UNMET: the twin prints in the line\'s place, beside the page\'s own "Needed, and not brought in" luxury', () => {
    const failures = collectSeedFailures(UNMET, ([seed, line, twin]) => {
      const town = BORN.get(seed);
      expect(luxuryUnmet(town), `${seed}: the page's need list names a luxury`).toBe(true);
      expectAbsentWithAnchor(fairDescs(town), line, twin, seed);
    });
    expectNoSeedFailures(failures, 'every fair beside an unmet luxury prints its twin');
  });

  it('MET: a fair whose town\'s need list names no luxury keeps its line', () => {
    const failures = collectSeedFailures(MET, ([seed, line]) => {
      const town = BORN.get(seed);
      expect(luxuryUnmet(town), `${seed}: the page's need list names no luxury`).toBe(false);
      expect(fairDescs(town), `${seed}: the line kept`).toEqual([line]);
    });
    expectNoSeedFailures(failures, 'every fair with no unmet luxury keeps its line');
  });

  it('THE ORDER: under a siege at the draw the siege twin stands, a luxury unmet or not', () => {
    const failures = collectSeedFailures(SIEGED, ([seed, siege]) => {
      const town = BORN.get(seed);
      expect(luxuryUnmet(town), `${seed}: the page's need list names a luxury`).toBe(true);
      expect(fairDescs(town), `${seed}: the siege twin`).toEqual([siege]);
    });
    expectNoSeedFailures(failures, 'the siege twin keeps its precedence');
  });

  it('THE SHARED PAGE prints the fair\'s card as the owner\'s page does (N4)', () => {
    const failures = collectSeedFailures([...UNMET, ...MET], ([seed]) => {
      const town = BORN.get(seed);
      expect(fairDescs(toPublicSafe(town)), `${seed}: the shared page`).toEqual(fairDescs(town));
    });
    expectNoSeedFailures(failures, 'the shared page prints the owner\'s card');
  });

  it('THE TABLE: each line is a late key whose twin names no luxury as to be had, and both declare the siege off', () => {
    for (const [line, twin] of [[LINE_A, TWIN_A], [LINE_B, TWIN_B], [LINE_C, TWIN_C]]) {
      const set = /** @type {any} */ (DESC_LATE_SIBLINGS)[line];
      expect(set, line).toBeDefined();
      expect(set.map((/** @type {any} */ l) => l.text)).toEqual([line, twin]);
      expect([...set[0].excludes]).toEqual(['crisis: under_siege', 'need not brought in: luxury']);
      expect([...set[1].needs]).toEqual(['need not brought in: luxury']);
      expect([...set[1].excludes]).toEqual(['crisis: under_siege']);
      for (const offer of ['available', 'to be had', 'on offer']) expectAbsentWithAnchor(twin, offer, 'the town wants', line);
    }
  });
});

/** The page's own need list names a spice or a silk. @param {any} town */
const spiceOrSilkUnmet = (town) => importsAsPrinted(town).needed.some((n) => /\b(spices?|silks?)\b/i.test(String(n)));
/** @param {any} town */
const quarterDescs = (town) => (town?.institutions || []).filter((/** @type {any} */ i) => i?.name === QUARTER).map((/** @type {any} */ i) => String(i.desc));

describe('FAULTS-ROWS item 5: the luxury quarter trades in no spice or silk the need list says is not brought in (FR12 (2))', () => {
  it('UNMET: the twin prints in the line\'s place, beside the page\'s own "Needed, and not brought in: spices"', () => {
    const failures = collectSeedFailures(Q_UNMET, ([seed, line, twin]) => {
      const town = BORN.get(seed);
      expect(spiceOrSilkUnmet(town), `${seed}: the page's need list names a spice or a silk`).toBe(true);
      // the late re-read speaks the tier's noun ("the city wants"), as `readHouseDescsLate` does
      expectAbsentWithAnchor(quarterDescs(town), line, speakTierNoun(twin, tierNounFor(town.tier)), seed);
      expect(quarterDescs(toPublicSafe(town)), `${seed}: the shared page`).toEqual(quarterDescs(town));
    });
    expectNoSeedFailures(failures, 'every quarter beside an unmet spice prints its twin');
  });

  it('MET: a quarter whose unmet good is another (the ore, the livestock) keeps its line', () => {
    const failures = collectSeedFailures(Q_MET, ([seed, line]) => {
      const town = BORN.get(seed);
      expect(spiceOrSilkUnmet(town), `${seed}: the page's need list names no spice or silk`).toBe(false);
      expect(importsAsPrinted(town).needed.length, `${seed}: some need unmet`).toBeGreaterThan(0);
      expect(quarterDescs(town), `${seed}: the line kept`).toEqual([line]);
    });
    expectNoSeedFailures(failures, 'every quarter with another unmet good keeps its line');
  });

  it('THE TABLE: each line is a late key and no colour line; its twin names neither good as to be had', async () => {
    const { DESC_VARIANT_COLOUR_DECLARATIONS } = await import('../../src/data/institutionDescColour.js');
    for (const [line, twin] of [[Q1, QT1], [Q2, QT2]]) {
      const set = /** @type {any} */ (DESC_LATE_SIBLINGS)[line];
      expect(set.map((/** @type {any} */ l) => l.text)).toEqual([line, twin]);
      expect([...set[0].excludes]).toEqual(['need not brought in: spice', 'need not brought in: silk']);
      expect(Object.prototype.hasOwnProperty.call(DESC_VARIANT_COLOUR_DECLARATIONS, line), line).toBe(false);
      for (const good of ['silks,', 'spices,', 'precious']) expectAbsentWithAnchor(twin, good, 'the town wants', line);
    }
  });
});

// FR12 (3), 2026-11-18: THE FISH MARKET'S CARD FOLLOWS ITS ROW, on ONE NEW ATOM, `fish bought in` (`facts/fishBoughtIn.js`): the
// fish ground used up and its shortage word on the imports, the one condition BAR8-FISH-ROWS's swap reads
// (`generateNarratives.js :: boughtFishRowsInPlace`). The card "Where the day's catch is sold, …" takes its twin there.
const CATCH_CARD = "Where the day's catch is sold, from an open stall or a small covered market. Prices sink fast. Fish will not wait.";
const CATCH_TWIN = 'Salted and dried fish is sold here, from an open stall or under a small roof. No fresh catch comes in.';
/** The card drawn and the fish bought in (the market's row "Preserved fish"): the twin. */
const CAT_CARD = "An open-air stall or small covered market where the day's catch is sold. Prices drop fast. Fish doesn't wait.";
const CAT_TWIN = 'An open-air stall or small covered market where salted and dried fish is sold. No fresh catch is landed here.';
const ZERO_CARD = "An open stall or small roofed market for selling the day's catch. The price falls quickly, for fish keeps no better than a day.";
const ZERO_TWIN = 'An open stall or small roofed market for salted and dried fish, brought in from elsewhere. The catch is no longer landed here.';
/** [seed, the card drawn, its twin]: the fish bought in (the market's row "Preserved fish"): the twin (FR20 (2): the catalogue line too). */
const FISH_BOUGHT_PAIRS = Object.freeze([['bar0-village-calm-rand-47', CATCH_CARD, CATCH_TWIN], ['r2r-village-11', CAT_CARD, CAT_TWIN]]);
const FISH_BOUGHT_CARD = Object.freeze(FISH_BOUGHT_PAIRS.map(([seed]) => seed));
/** [seed, the card kept]: a live fishery or an idle town keeps its card (r2r-village-45: idle, #0; bar0-village-calm-rand-46: live, the catalogue line). */
const FISH_KEPT_PAIRS = Object.freeze([['r2r-village-45', ZERO_CARD], ['bar0-village-calm-rand-46', CAT_CARD], ['r2r-village-2', CATCH_CARD]]);
/** The card drawn beside a live fishery ("Fresh fish retail"): the line stands. */
const FISH_LIVE_CARD = Object.freeze(['r2r-village-2']);
/** IDLE (the ground spent, nothing brought in; `bar8FishRows.test.js`'s own): no fish bought in, the row and its mark kept. */
const FISH_IDLE = Object.freeze(['r2r-village-45', 'r2r-metropolis-45', 'r2s-recently_betrayed-metropolis-0']);
/** Every fish-market shape of the thirty (45..47) and the 150 (27..41): the atom held to the row on each. */
const FISH_SHAPES = Object.freeze(['village-famine', 'village-calm', 'town-calm', 'town-occupied', 'city-under_siege+famine', 'city-wartime', 'metropolis-calm']);
const FISH_POP = Object.freeze(FISH_SHAPES.flatMap((sh) => [...Array.from({ length: 15 }, (_, k) => 27 + k), 45, 46, 47].map((n) => `bar0-${sh}-rand-${n}`)));

describe('FAULTS-ROWS item 6: the fish market\'s card says the fish is bought in where its row does (FR4, FR12 (3))', () => {
  /** @type {Map<string, any>} */
  const FISH = new Map();
  /** @type {(t: any) => boolean} */ let boughtOf = () => false;
  /** @type {(t: any) => any} */ let factsOfFn = () => ({});
  beforeAll(async () => {
    const boundary = await import('../../src/domain/density/densityCreateBoundary.js');
    const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
    const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
    boughtOf = (await import('../../src/domain/facts/fishBoughtIn.js')).fishBoughtIn;
    factsOfFn = (await import('../../src/domain/facts/factsOf.js')).factsOf;
    await boundary.loadGenerationLawPayloads();
    for (const seed of [...FISH_BOUGHT_CARD, ...FISH_LIVE_CARD, ...FISH_IDLE, ...FISH_KEPT_PAIRS.map(([s]) => s), ...FISH_POP]) {
      if (!FISH.has(seed)) FISH.set(seed, generateSettlementPipeline(boundary.birthConfig({ ...DEFAULT_CONFIG, ...configOf(seed) }), null, { seed, customContent: {} }));
    }
  }, 600_000);

  /** @param {any} town */
  const marketRows = (town) => Object.values(town?.availableServices || {}).flat()
    .filter((/** @type {any} */ r) => r && r.institution === 'Fish market' && r.custom !== true && r.source !== 'custom').map((/** @type {any} */ r) => String(r.name));
  /** @param {any} town */
  const marketDescs = (town) => (town?.institutions || []).filter((/** @type {any} */ i) => i?.name === 'Fish market').map((/** @type {any} */ i) => String(i.desc));

  it('ONE FACT: on every fish-market town of the thirty and the 150 the atom reads the leaf, and the bought town\'s row is "Preserved fish"', () => {
    const towns = FISH_POP.filter((seed) => marketDescs(FISH.get(seed)).length > 0);
    expect(towns.length, 'the fish-market towns of the shapes (73 at the base)').toBeGreaterThan(60);
    const failures = collectSeedFailures(towns, (seed) => {
      const town = FISH.get(seed);
      const bought = boughtOf(town);
      expect(factsOfFn(town).fishBoughtIn, `${seed}: the atom is the leaf`).toBe(bought);
      if (bought) expectAbsentWithAnchor(marketRows(town), 'Fresh fish retail', 'Preserved fish', seed);
      if (bought) expect(marketDescs(town).includes(CATCH_CARD), `${seed}: no day's catch beside a bought fish`).toBe(false);
    });
    expectNoSeedFailures(failures, 'the atom is the swap\'s own fact on every fish-market town');
    expect(towns.filter((seed) => boughtOf(FISH.get(seed))).length, 'some town of the shapes buys its fish').toBeGreaterThan(0);
  });

  it('BOUGHT: the card takes its twin beside the market\'s "Preserved fish"', () => {
    const failures = collectSeedFailures(FISH_BOUGHT_PAIRS, ([seed, card, twin]) => {
      const town = FISH.get(seed);
      expect(boughtOf(town), `${seed}: the fish bought in`).toBe(true);
      expect(marketRows(town), `${seed}: the row`).toContain('Preserved fish');
      expectAbsentWithAnchor(marketDescs(town), card, twin, seed);
      expect(marketDescs(toPublicSafe(town)), `${seed}: the shared page`).toEqual(marketDescs(town));
    });
    expectNoSeedFailures(failures, 'every bought town\'s card says no catch comes in');
  });

  it('LIVE and IDLE: a live fishery keeps the card; an idle town buys no fish and prints no twin', () => {
    const failures = collectSeedFailures([...FISH_LIVE_CARD, ...FISH_IDLE], (seed) => {
      const town = FISH.get(seed);
      expect(boughtOf(town), `${seed}: no fish bought in`).toBe(false);
      if (FISH_LIVE_CARD.includes(seed)) {
        expect(marketRows(town), `${seed}: the live row`).toContain('Fresh fish retail');
        expect(marketDescs(town), `${seed}: the card kept`).toEqual([CATCH_CARD]);
      } else {
        expectAbsentWithAnchor(marketDescs(town), CATCH_TWIN, marketDescs(town)[0], seed);
      }
    });
    expectNoSeedFailures(failures, 'the live and the idle keep their cards');
  });

  it('KEPT (FR20 (2)): an idle town and a live fishery keep the card they drew, of all three lines of the pool', () => {
    const failures = collectSeedFailures(FISH_KEPT_PAIRS, ([seed, card]) => {
      const town = FISH.get(seed);
      expect(boughtOf(town), `${seed}: no fish bought in`).toBe(false);
      expect(marketDescs(town), `${seed}: the card kept`).toEqual([card]);
    });
    expectNoSeedFailures(failures, 'the idle and the live keep their cards');
  });

  it('THE TABLE: each of the three cards is a late key on `fish bought in`; its twin names no catch of the day', () => {
    for (const [card, twin] of [[CATCH_CARD, CATCH_TWIN], [CAT_CARD, CAT_TWIN], [ZERO_CARD, ZERO_TWIN]]) {
      const set = /** @type {any} */ (DESC_LATE_SIBLINGS)[card];
      expect(set.map((/** @type {any} */ l) => l.text)).toEqual([card, twin]);
      expect([...set[0].excludes]).toEqual(['fish bought in']);
      expect([...set[1].needs]).toEqual(['fish bought in']);
      expectAbsentWithAnchor(twin, "day's catch", 'dried fish', card);
    }
  });
});

// FR20 (3), 2026-11-18: A CRISIS THE DICE ROLLED IS READ BY THE DRAW-TIME TWINS. The draw reads only the FORCED crises
// (`assembleInstitutions.js :: settledStressTypes`), so a siege that emerged and survived the confirm pass left the toll bridge's
// steady fees, the burial grounds' carts at dusk and the fair's merchants printed under it. THE CURE
// (`assembleSettlement.js :: readHouseDescsLate`): the draw-time sibling sets (`DESC_VARIANT_SIBLINGS`) are resolved again
// FIRST, on the final facts. No new text; no draw moves.
describe('FAULTS-ROWS FR20 (3): an emergent siege is read by the draw-time siege twins', () => {
  /** @type {Map<string, any>} */
  const BORN20 = new Map();
  /** [seed, the houses that read their siege twin]: a siege rolled by the dice (random stress), not forced. */
  const EMERGENT = Object.freeze([['r2r-town-2069', ['Toll bridge', 'Annual fair']], ['r2r-city-2045', ['Toll bridge', 'Burial grounds and charnel house']], ['r2r-city-2122', ['Toll bridge', 'Burial grounds and charnel house']]]);
  /** A forced siege: the draw read it, the siege twin as before. */
  const FORCED = Object.freeze([['r2s-under_siege-town-2', ['Annual fair']]]);
  /** THE SWEEP: fresh random-stress towns and cities; the law holds on each. */
  const SWEEP = Object.freeze([...Array.from({ length: 30 }, (_, k) => `r2r-town-${2050 + k}`), ...Array.from({ length: 30 }, (_, k) => `r2r-city-${2040 + k}`)]);
  /** @type {(t: any) => any} */ let factsOfFn = () => ({});
  /** @type {any} */ let SIB = {};
  /** @type {(s: string, n: string) => string} */ let speak = (s) => s;
  /** @type {(t: string) => string} */ let nounOf = (t) => t;
  beforeAll(async () => {
    const boundary = await import('../../src/domain/density/densityCreateBoundary.js');
    const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
    const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
    factsOfFn = (await import('../../src/domain/facts/factsOf.js')).factsOf;
    SIB = (await import('../../src/data/institutionDescVariants.js')).DESC_VARIANT_SIBLINGS;
    speak = speakTierNoun; nounOf = tierNounFor;
    await boundary.loadGenerationLawPayloads();
    for (const [seed] of [...EMERGENT, ...FORCED]) BORN20.set(seed, generateSettlementPipeline(boundary.birthConfig({ ...DEFAULT_CONFIG, ...configOf(seed) }), null, { seed, customContent: {} }));
    for (const seed of SWEEP) if (!BORN20.has(seed)) BORN20.set(seed, generateSettlementPipeline(boundary.birthConfig({ ...DEFAULT_CONFIG, ...configOf(seed) }), null, { seed, customContent: {} }));
  }, 600_000);

  /** The draw-time sets that hold a siege twin: [original, siege twin]. */
  const siegeSets = () => Object.entries(SIB).map(([k, set]) => [k, /** @type {any[]} */ (set).find((l) => l.twinOf === k && (l.crisis || []).includes('under_siege'))?.text]).filter(([, t]) => t);
  /** @param {any} town */
  const besieged = (town) => [...(factsOfFn(town).crisis?.kinds || [])].includes('under_siege');
  /** @param {any} town @param {string} house */
  const descOf = (town, house) => (town.institutions || []).find((/** @type {any} */ i) => i.name === house)?.desc;

  it('EMERGENT and FORCED: each named house prints its set\'s siege twin under the siege', () => {
    const failures = collectSeedFailures([...EMERGENT, ...FORCED], ([seed, houses]) => {
      const town = BORN20.get(seed);
      expect(besieged(town), `${seed}: under siege`).toBe(true);
      const noun = nounOf(town.tier);
      for (const house of houses) {
        const pair = siegeSets().find(([orig, twin]) => [speak(orig, noun), speak(twin, noun)].includes(descOf(town, house)));
        expect(pair, `${seed} ${house}: a siege set's line`).toBeDefined();
        expectAbsentWithAnchor([descOf(town, house)], speak(pair[0], noun), speak(pair[1], noun), `${seed} ${house}`);
      }
    });
    expectNoSeedFailures(failures, 'every besieged house of a siege set reads its siege twin');
  });

  it('THE SWEEP: no besieged town keeps a non-siege original of a set that holds a siege twin; no siege twin stands without a siege', () => {
    const failures = collectSeedFailures(SWEEP, (seed) => {
      const town = BORN20.get(seed);
      const noun = nounOf(town.tier);
      const descs = (town.institutions || []).map((/** @type {any} */ i) => String(i.desc));
      for (const [orig, twin] of siegeSets()) {
        const wrong = besieged(town) ? speak(orig, noun) : speak(twin, noun);
        expect(descs.includes(wrong), `${seed}: ${besieged(town) ? 'the original under a siege' : 'the siege twin with no siege'}: ${wrong.slice(0, 60)}`).toBe(false);
      }
    });
    expectNoSeedFailures(failures, 'the siege is read by every siege set, and only under a siege');
    expect(SWEEP.filter((seed) => besieged(BORN20.get(seed))).length, 'the sweep holds a besieged town').toBeGreaterThan(0);
  });
});
