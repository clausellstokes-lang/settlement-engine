/**
 * bar6MarksLaw8.test.js — BAR6-MARKS (BRIEF-BAR6 B2/L4; vetoable by the owner): LAW 8'S MARK RULES, KEPT AS A GUARD. The
 * mark leaf reads every worst state: a house whose trade's good the page says is not had, a mine on a spent ground, the
 * famine's harvest grain, and the card's state word beside the leaf's mark.
 *
 * The page form of the rules (8a.input, 8a.mild, 8b.extract, 8c) is auditor D's `tests/helpers/pageLaws/law8.mjs`, read over a
 * census dump. A test corpus carries births, not dumps, so the guard reads the same rules off the born record and the one
 * mark leaf every tab prints through (`tests/helpers/pageLaws/law8Marks.mjs :: law8MarksInstances`). THIS FILE REDS WHEN
 *   (a) THE ZERO: an instance in a town of the census's 720 (born in the census's own configuration shape) that is not one of
 *       the houses left by name (LEFT below; a ratchet: the list only shrinks; LEFT-MARKS item 3 struck two of three);
 *   (b) THE POSITIVE CONTROL: the detector, the marks read blind, stops finding its rule in a census town whose record
 *       holds the worst state (one town a rule, measured at afa46d644 with this cure);
 *   (c) 8b.extract's PLANTED PAIR (RULING BR10 (2)): a mine on its only ground, spent, printed bare by a planted record, is
 *       an instance; the same mine beside a live seam of its own kind is none.
 *
 * RE-KEYED BY RULING BR10 (the sixth chair, 2026-11-17; LEFT-MARKS item 1). THIS IS A RULING'S RE-KEY OF A LAW, NOT A
 * NARROWING. 8b.extract read a mine or a quarry as worked out where every CHAIN listing it works a spent ground; the supply
 * rule (BIRTH-3's AMENDMENT 2 (A), `supplyStory.js :: sourceStoryOf`) reads a source house worked out only where EVERY
 * GROUND OF ITS OWN KIND THE RECORD HOLDS IS SPENT, and the ruling gives LAW 8 that reading in both its forms
 * (`tests/helpers/pageLaws/law8Marks.mjs`, `law8.mjs :: ownGroundsOnRecord`, read from `houseKinds.js :: SOURCE_GROUNDS`,
 * the record's land lists and its proven grounds, not through the leaf under test). At the base (e0242a12a) (a) read 17
 * mines of the 720 (r2r-town-45; r2r-metropolis-9, -15, -17, -24, -29, -37, -40, -57; r2s-indebted-metropolis-2;
 * r2s-infiltrated-metropolis-1, -2; r2s-insurgency-metropolis-0, -3; r2s-monster_pressure-metropolis-2;
 * r2s-politically_fractured-metropolis-1; r2s-succession_void-city-0), each on one chain of spent iron beside a live seam of
 * its own kind (coal, gemstones, precious metals): at work by ruling A, so no instance. Read blind, the rule finds 95 houses
 * of the 720 where it found 85 (the 17 out; 27 in: houses on no chain whose every own ground is spent, each marked).
 */
import { describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { law8MarksInstances } from '../helpers/pageLaws/law8Marks.mjs';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

await loadGenerationLawPayloads();

const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const CRISES = ['famine', 'indebted', 'infiltrated', 'insurgency', 'mass_migration', 'monster_pressure', 'occupied', 'plague_onset',
  'politically_fractured', 'recently_betrayed', 'religious_conversion', 'slave_revolt', 'succession_void', 'under_siege', 'wartime'];
/** The census's 720, in its own order of shapes. */
const CENSUS = [
  ...SIZES.flatMap((size) => Array.from({ length: 60 }, (_, i) => `r2r-${size}-${i}`)),
  ...CRISES.flatMap((c) => SIZES.flatMap((size) => Array.from({ length: 4 }, (_, i) => `r2s-${c}-${size}-${i}`))),
];
const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** CENSUS-3 seedcfg.mjs's r2r-/r2s- arms, verbatim in shape. @param {string} seed */
const born = (seed) => {
  let m = /^r2r-(\w+)-\d+$/.exec(seed);
  if (m) return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: m[1] }), null, { seed, customContent: {} });
  m = /^r2s-(\w+)-(\w+)-\d+$/.exec(seed);
  if (!m) throw new Error(`not a census seed: ${seed}`);
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] }), null, { seed, customContent: {} });
};
const towns = new Map();
const town = (/** @type {string} */ seed) => { if (!towns.has(seed)) towns.set(seed, born(seed)); return towns.get(seed); };

/** The houses left by name (BAR6-MARKS's hand-back, "what is left"): `<seed> · <rule> · <house>`. */
// STRUCK BY ITS OWN RULE (BIRTH-1, 2026-11-17): 'r2r-town-51 · 8a.input · Apothecary (established)' is cured: the birth
// brings its medicinal herbs in (`resourceGenerator.js :: importsBroughtAtBirth`, "Medicinal herbs").
// STRUCK BY ITS OWN RULE (LEFT-MARKS item 3, L25, 2026-11-17): 'r2r-town-54 · 8a.input · Butchers (3-8)' and
// 'r2s-religious_conversion-town-2 · 8a.input · Apothecary (established)' are cured: a house whose trade takes a good no
// chain names it for is short where the record's own need list names the good and no import brings it
// (`crisisDependence.js :: HOUSE_NEED_INPUT`; tests/domain/leftMarks.test.js). LEFT, BY NAME: the butchers of
// r2r-metropolis-19 stand beside "Game and hides (local hunting grounds exhausted)" on the imports, the butchers' stock
// (the reader's mend, `houseInputAtHand.js :: TRADE_STOCK_WORDS`): they are at work, and the rule reads the need line
// "Livestock for meat and draft" alone.
// STRUCK BY ITS OWN RULE (BAR8 J-INCOME item 4, 2026-11-18): 'r2r-metropolis-19 · 8a.input · Butchers (3-8)' is cured: the need
// list no longer names "Livestock for meat and draft" where a live house's printed service row deals in livestock (the town's
// fair, "Livestock auctions": `tradeListDisplay.js :: importsAsPrinted().needed`, `NEED_DEALT_ROWS`), so no need line marks it.
const LEFT = [];

describe('LAW 8\'s mark rules (BAR6-MARKS): the mark leaf reads every worst state', () => {
  test('(a) THE ZERO over the census\'s 720: every instance is cured, or one of the houses left by name', () => {
    /** @type {string[]} */
    const found = [];
    const failures = collectSeedFailures(CENSUS, (seed) => {
      for (const i of law8MarksInstances(town(seed))) found.push(`${seed} · ${i.rule} · ${i.house}`);
    });
    expectNoSeedFailures(failures, 'every census town is born and read');
    expect(found.filter((f) => !LEFT.includes(f)), 'an instance not left by name').toEqual([]);
    expect(LEFT.filter((f) => !found.includes(f)), 'a house left by name is cured: strike it from LEFT').toEqual([]);
  }, 1_800_000);

  // (b) one census town a rule whose record holds the worst state, read blind (measured at afa46d644 with this cure)
  const CONTROLS = [
    // RE-KEYED BY IDENTITY (BIRTH-1, 2026-11-17): r2r-city-0's commercial sawmill (8a.input) and carpenters (8a.mild) are fed
    // now, the birth bringing their timber in on a connected road (`importsBroughtAtBirth`). 8a.input: the same house, a
    // Sawmill (commercial) short of timber, in r2r-city-115, a calm census-shaped city on no road. 8a.mild: no timber house
    // is marked short on a road any more; the rule's own case, a marked house whose card head prints a milder state, in
    // r2r-city-19, a city of the 720 (its daily markets under the outbreak).
    ['r2r-city-115', '8a.input'],
    ['r2r-city-19', '8a.mild'],
    ['r2r-city-18', '8b.extract'],
    ['r2r-village-24', '8c.harvest'],
    ['r2r-city-44', '8c.failed'],
  ];
  test('(b) THE POSITIVE CONTROL: in each town the detector finds its rule with the marks read blind (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(CONTROLS, ([seed, rule]) => {
      const blind = law8MarksInstances(town(/** @type {string} */ (seed)), { blind: true }).filter((i) => i.rule === rule);
      expect(blind.length, `${seed}: the detector finds ${rule} blind`).toBeGreaterThan(0);
    }), '(b) every positive control fires');
  }, 900_000);
});

// (c) RULING BR10 (2), 2026-11-17: 8b.extract's own reading, on a planted record (N7: a town on no road, r2r-town-9, its land
// lists replaced and a mine planted; the marks read blind, so the planted mine prints bare)
describe('8b.extract reads every ground of the house\'s own kind (ruling BR10)', () => {
  const planted = (/** @type {string[]} */ land, /** @type {string[]} */ spent) => {
    const s = town('r2r-town-9');
    return { ...s, config: { ...s.config, nearbyResources: land, nearbyResourcesNative: land, nearbyResourcesDepleted: spent, nearbyResourcesCustom: [] },
      institutions: [...s.institutions, { name: 'Mine', catalogId: 'mine', category: 'Economy', status: 'active' }] };
  };
  const extract = (/** @type {any} */ rec) => law8MarksInstances(rec, { blind: true }).filter((i) => i.rule === '8b.extract' && i.house === 'Mine');
  test('a mine on its only ground, spent, printed bare, IS an instance; beside a live seam of its own kind it is none', () => {
    expect(extract(planted(['iron_deposits'], ['iron_deposits'])).length, 'the mine on its one spent ground').toBe(1);
    expect(extract(planted(['iron_deposits', 'coal_deposits'], ['iron_deposits'])).length, 'the mine beside a live coal seam').toBe(0);
  }, 300_000);
});

// EG1 (the chair, 2026-11-16): the eager fact reads the war off the stress container (`houseInputAtHand.js :: atWar`, through
// `canonStressors`), not through the lazily pinned `crisisKind.js`; over the census's 720 it answers as `crisisOf` does
describe('EG1: the war read import-free answers as the crisis reader does', () => {
  test('atWar equals crisisOf(...).has("wartime") in every town of the 720 (every row)', async () => {
    const { atWar } = await import('../../src/domain/facts/houseInputAtHand.js');
    const { crisisOf } = await import('../../src/domain/facts/crisisKind.js');
    expectNoSeedFailures(collectSeedFailures(CENSUS, (seed) => {
      expect(atWar(town(seed)), `${seed}: the two readings of the war`).toBe(crisisOf(town(seed)).has('wartime'));
    }), 'every census town reads one war');
  }, 1_800_000);
});

// RULING CN1 (the chair, 2026-11-16; RECORD's 9d.isolated): an isolated village or larger still has a poor road
// (`facts/tradeReach.js :: minorRoutesReach`): its need line says the goods come dear and late by the minor roads; the
// clause "no trade road reaches" is kept where no poor road reaches (the same record read as a hamlet)
describe('CN1: the isolated need line reads the poor road', () => {
  test('r2r-town-9 (isolated, a town): the twin prints; read as a hamlet, the old clause prints (each way)', async () => {
    const { chainNeedLine } = await import('../../src/domain/display/chainNeedShown.js');
    const s = town('r2r-town-9');
    const lines = (/** @type {any} */ rec) => (rec.economicState?.activeChains || []).map((/** @type {any} */ c) => chainNeedLine(c, rec, true)).filter(Boolean);
    const asTown = lines(s), asHamlet = lines({ ...s, tier: 'hamlet' });
    expect(asTown.length, 'r2r-town-9 prints a need line').toBeGreaterThan(0);
    expect(asTown.every((/** @type {string} */ l) => /by the minor roads\.$/.test(l)), `the twin: ${asTown.join(' | ')}`).toBe(true);
    expect(asHamlet.every((/** @type {string} */ l) => /: no trade road reaches /.test(l)), `the old clause: ${asHamlet.join(' | ')}`).toBe(true);
  }, 300_000);
});
