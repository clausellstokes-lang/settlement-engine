/**
 * supplyStoryLaw.test.js — BIRTH-2 (the chair's rulings BR4, BR5, BR6 and BR7 of 2026-11-17; the owner's rule, vetoable by
 * the owner): THE SEED PICKS ONE SUPPLY STORY FOR EACH HOUSE AND ITS MATERIAL, AND EVERY PART OF THE PAGE TELLS IT.
 *
 *   (L1) every live source house tells one story on every surface (`supplyStory.js :: sourceStoryOf`): LOCAL (a ground of it
 *        there, stored or implied) and no short mark; BOUGHT: its word on the imports, no short mark, the siege's mark under
 *        a siege; IDLE: the short mark, the ground under Depleted (stored or implied), no word of its material on the imports;
 *        the FAILED VENTURE: its mark wherever the short mark would print, its one line on the Resources tab, no word of its
 *        material on the imports, no ground of it on either group of the land list. And no gap line "No <good> reaches …"
 *        stands beside the import of that same good (the charcoal burner beside the "Timber" bought for a cooper: 49 at the
 *        base).
 *   (L2) "never had it and buys nothing" only as a failed venture (the salt works off the coast on no road: 0 of the 720);
 *        no town holds two; no other live house works the venture's material.
 *   (L3) no import feeds a taker on its used-up ground.
 *   (L4) the seed's choice: the same seed twice tells the same story; an implied ground is on no stored field (the birth
 *        writes no land list: it runs over a frozen config).
 *   (L5) the odds hold over the census's 720 (bands below); the towns with a failed venture number 10 to 20.
 *   (BR7) THE BIRTH AND THE PRINT READ ONE STORY: the record's own gap for each source house is the story the print reads,
 *        and the birth, read again over its own product, brings no word in.
 *   (W1) THE ROUND TRIP: ten towns with an implied ground, generated again by the product's regenerate (the saved config
 *        and seed) and from that config read as a manual roster: the same people, ties, roster and story.
 *
 * THE SEEDS, AND WHY THEY ARE ENOUGH: the census's 720 (360 `r2r-` towns of six sizes, 360 `r2s-` towns of fifteen crises)
 * and the wide read's 150 (`bar0-<shape>-rand-27..41`, ten shapes): every population the brief's counts are made over,
 * every tier, every crisis and every route the generator draws. THE POSITIVE CONTROL: at the base (a55162cfa) this file
 * cannot load (`supplyStory.js` is born here), and its pair arm fails there in 49 towns of the 720 (BIRTH-1's hand-back).
 *
 * @enforced-by this file (the guard of `src/domain/facts/supplyStory.js`)
 */
import { describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { CHAIN_RAW_INPUT, houseInputAtHand, housesShortOf, impliedGroundsOnPage, ventureHouseOf } from '../../src/domain/facts/houseInputAtHand.js';
import { GROUND_YIELD, SHORTAGE_WORD, familyWord, idOfHouse, impliedGroundsOf, sourceStoryOf, storySeed } from '../../src/domain/facts/supplyStory.js';
import { SPENT_GROUND_YIELD } from '../../src/data/crisisDependence.js';
import { resourceShortageImport } from '../../src/domain/resourceSemantics.js';
import { MATERIAL_OF, RUNS_ON_BOUGHT, SOURCE_GROUNDS, SUPPLY_ODDS, TAKERS } from '../../src/domain/facts/houseKinds.js';
import { rowMarkText } from '../../src/domain/display/crisisStoppedRow.js';
import { resourceGapLines } from '../../src/domain/display/validationOnPage.js';
import { liveInstitutions } from '../../src/domain/institutions/institutionRoster.js';
import { hasTradeRouteConnection } from '../../src/domain/tradeRouteSemantics.js';
import { generateResourceAnalysis, importsBroughtAtBirth, resolveNearbyCommodities } from '../../src/generators/resourceGenerator.js';
import { getTerrainType } from '../../src/generators/terrainHelpers.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

await loadGenerationLawPayloads();

const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const CRISES = ['famine', 'indebted', 'infiltrated', 'insurgency', 'mass_migration', 'monster_pressure', 'occupied', 'plague_onset',
  'politically_fractured', 'recently_betrayed', 'religious_conversion', 'slave_revolt', 'succession_void', 'under_siege', 'wartime'];
const SHAPES = ['thorp-calm', 'hamlet-calm', 'hamlet-under_siege', 'village-famine', 'village-calm', 'town-occupied', 'town-calm',
  'city-under_siege+famine', 'city-wartime', 'metropolis-calm'];
/** The census's 720. */
const CENSUS = [
  ...SIZES.flatMap((size) => Array.from({ length: 60 }, (_, i) => `r2r-${size}-${i}`)),
  ...CRISES.flatMap((c) => SIZES.flatMap((size) => Array.from({ length: 4 }, (_, i) => `r2s-${c}-${size}-${i}`))),
];
/** The wide read's 150. */
const WIDE = SHAPES.flatMap((shape) => Array.from({ length: 15 }, (_, i) => `bar0-${shape}-rand-${i + 27}`));

const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'standard' };
/** CENSUS-3 seedcfg.mjs's r2r-, r2s- and bar0- arms, as BIRTH-1's guard reads them. @param {string} seed */
const configOf = (seed) => {
  let m = /^r2r-(\w+)-\d+$/.exec(seed);
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: m[1] });
  m = /^r2s-(\w+)-(\w+)-\d+$/.exec(seed);
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...dials, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] });
  m = /^bar0-(\w+)-([a-z_+]+)-([a-z_]+)-\d+$/.exec(seed);
  if (!m) throw new Error(`not a census seed: ${seed}`);
  const st = m[2] === 'calm' ? [] : m[2].split('+'); const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
  return birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: st, _randomizePriorities: true });
};
const towns = new Map();
/** @param {string} seed @returns {any} */
const town = (seed) => { if (!towns.has(seed)) towns.set(seed, generateSettlementPipeline(configOf(seed), null, { seed, customContent: {} })); return towns.get(seed); };

/** @param {unknown} x an import or a word: its bracketed reason struck, lower case */
const struck = (x) => String(x ?? '').replace(/\([^)]*\)/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
/** @param {any} s @param {string} word */
const listHolds = (s, word) => (s.economicState?.primaryImports || []).some((/** @type {unknown} */ x) => struck(x) === struck(word));
/** @param {any} s */
const besiegedIn = (s) => (s.config?.stressTypes || []).includes('under_siege');
/** @param {any} s */
const connectedIn = (s) => hasTradeRouteConnection(String(s.config?.tradeRouteAccess ?? ''));
/** The source houses of a town with their stories. @param {any} s */
const storiesOf = (s) => liveInstitutions(s).filter((i) => !!i && typeof i.name === 'string' && !i.isCustom && Object.prototype.hasOwnProperty.call(SOURCE_GROUNDS, idOfHouse(i)))
  .map((inst) => ({ inst, id: idOfHouse(inst), story: sourceStoryOf(s, inst) }));
/** The noun the gap line names for a word ("Timber" -> timber). @param {string} line */
const gapGood = (line) => /^No (.+?) reach(?:es)? /.exec(line)?.[1] ?? '';

/** THE LAW L1-L3 in one town: its instances, each `<seed> · <rule> · <house>`. @param {string} seed @param {any} s */
function lawInstances(seed, s) {
  /** @type {string[]} */
  const out = [];
  const short = housesShortOf(s);
  const venture = ventureHouseOf(s);
  const shown = impliedGroundsOnPage(s);
  const depleted = new Set([...(s.config?.nearbyResourcesDepleted || []), ...shown.used]);
  const lines = resourceGapLines(s).map((l) => String(l.impact));
  const bad = (/** @type {string} */ rule, /** @type {string} */ house) => out.push(`${seed} · ${rule} · ${house}`);
  for (const { inst, id, story } of storiesOf(s)) {
    if (venture && venture.name === inst.name) continue;
    if (!story) continue;
    const mark = rowMarkText(s, 'house', inst) || '';
    if (story.story === 'local' && short.has(inst.name)) bad('L1 local, marked short', inst.name);
    if (story.story === 'bought') {
      if (!listHolds(s, story.word) && !listHolds(s, RUNS_ON_BOUGHT[id] || '')) bad('L1 bought, no word on the imports', inst.name);
      if (short.has(inst.name)) bad('L1 bought, marked short', inst.name);
      if (besiegedIn(s) && !/siege/i.test(mark)) bad('L1 bought under a siege, no siege mark', inst.name);
    }
    if (story.story === 'idle') {
      if (!short.has(inst.name)) bad('L1 idle, unmarked', inst.name);
      if (!TAKERS.has(id) && RUNS_ON_BOUGHT[id] && listHolds(s, RUNS_ON_BOUGHT[id])) bad('L1 idle, its word on the imports', inst.name);
      if (story.ground && !depleted.has(story.ground)) bad('L1 idle, its ground not under Depleted', inst.name);
      if (!story.ground) bad('L2 never had it and buys nothing', inst.name);
      // L3: no import feeds a taker on its used-up ground
      if (TAKERS.has(id) && ['stone', 'ironOre', 'fish', 'timber', 'livestock'].some((key) => houseInputAtHand(s, key, inst, { rawResource: CHAIN_RAW_INPUT[key] }) === 'imported')) bad('L3 a taker fed by an import', inst.name);
    }
  }
  if (venture) {
    const inst = liveInstitutions(s).find((i) => i?.name === venture.name) || { name: venture.name };
    const mark = rowMarkText(s, 'house', inst);
    if (mark !== null && !/(?:Abandoned|Failing): a failed venture\.$/.test(mark)) bad('L1 venture, not its mark', venture.name);
    if (!lines.some((l) => /stands abandoned, a venture of an earlier time|is failing: no /.test(l))) bad('L1 venture, no line', venture.name);
    if (listHolds(s, familyWord(venture.family))) bad('L1 venture, its word on the imports', venture.name);
    if (venture.ground && (shown.there.includes(venture.ground) || shown.used.includes(venture.ground))) bad('L1 venture, its ground on the land list', venture.name);
    const others = liveInstitutions(s).filter((i) => i?.name !== venture.name && MATERIAL_OF[idOfHouse(i)] === venture.family);
    if (others.length) bad('L2 venture, another house works its material', venture.name);
  }
  // the pair: no gap line names a good beside the import of that same good's word
  // (a taker on its used-up ground is worked out whatever the town buys for its buyers, BR4: its gap line is followed by its
  // worked-out line, and that pair is true)
  for (const line of lines) {
    const good = gapGood(line);
    const house = /^No .+? reach(?:es)? (.+)\.$/.exec(line)?.[1] ?? '';
    const workedOut = !!house && lines.some((l) => l.startsWith(`${house.charAt(0).toUpperCase()}${house.slice(1)} is worked out: `));
    if (good && !workedOut && (s.economicState?.primaryImports || []).some((/** @type {unknown} */ x) => struck(x) === good)) bad(`L1 "${line}" beside its import`, good);
  }
  return out;
}

describe('BIRTH-2: the seed picks the supply story; every part of the page tells it', () => {
  test('EG1 · the leaf\'s copies equal their sources, key for key (the dependence table\'s yields; the shortage words)', () => {
    expect(Object.entries(GROUND_YIELD), 'the yields of a spent ground').toEqual(Object.entries(SPENT_GROUND_YIELD));
    expect(Object.keys(SHORTAGE_WORD).length, 'the shortage words copied').toBeGreaterThan(8);
    for (const [ground, word] of Object.entries(SHORTAGE_WORD)) expect(word, `${ground}: its shortage word`).toBe(resourceShortageImport(ground));
  });

  test('L1-L3 · every story told on every surface, over the census\'s 720 and the 150', () => {
    /** @type {string[]} */
    const found = []; /** @type {Record<string, number>} */ const told = {};
    const failures = collectSeedFailures([...CENSUS, ...WIDE], (seed) => {
      const s = town(seed);
      found.push(...lawInstances(seed, s));
      for (const { story } of storiesOf(s)) if (story) told[story.story] = (told[story.story] || 0) + 1;
      if (ventureHouseOf(s)) told.venture = (told.venture || 0) + 1;
    });
    expectNoSeedFailures(failures, 'every town is born and read');
    // the anchors: each story is told in the populations (the law is not read over an empty set)
    expect(Object.keys(told).sort(), 'every story is told').toEqual(['bought', 'idle', 'local', 'venture']);
    expect(Math.min(told.bought, told.idle, told.local), 'each story by more than ten houses').toBeGreaterThan(10);
    expect(found, 'a house whose surfaces tell two stories').toEqual([]);
  }, 1_800_000);

  test('L5 · the odds hold over the census\'s 720, and a failed venture stands in 10 to 20 of its towns', () => {
    let there = 0, implied = 0, ventures = 0, usedConnected = 0, boughtConnected = 0;
    expectNoSeedFailures(collectSeedFailures(CENSUS, (seed) => {
      const s = town(seed);
      for (const st of impliedGroundsOf(s).states.values()) { implied++; if (st === 'there') there++; }
      if (ventureHouseOf(s)) ventures++;
      if (!connectedIn(s)) return;
      for (const { id, story } of storiesOf(s)) {
        if (!story || !RUNS_ON_BOUGHT[id] || !story.ground) continue; // a house that can buy in, on a used-up ground
        usedConnected++; if (story.story === 'bought') boughtConnected++;
      }
    }), 'the census is born and read');
    // THE BANDS: a share of N draws of a 3-in-4 pick lies within four standard errors of 0.75 (N about 200 implied grounds:
    // ±0.12); the bought share counts as bought the towns whose economy already brings the material (a fact of the record),
    // so its band is open upward
    expect(implied, 'implied grounds read').toBeGreaterThan(150);
    expect(there / implied, `the there-share of the implied grounds (${there} of ${implied}; the odds ${SUPPLY_ODDS.groundThere} of ${SUPPLY_ODDS.outOf})`).toBeGreaterThan(0.63);
    expect(there / implied, `the there-share of the implied grounds (${there} of ${implied})`).toBeLessThan(0.87);
    expect(usedConnected, 'houses that can buy in, on a used-up ground, on a connected route').toBeGreaterThan(20);
    expect(boughtConnected / usedConnected, `the bought share (${boughtConnected} of ${usedConnected}; the odds ${SUPPLY_ODDS.boughtIn} of ${SUPPLY_ODDS.outOf})`).toBeGreaterThan(0.6);
    expect(ventures, 'the towns of the 720 with a failed venture').toBeGreaterThanOrEqual(10);
    expect(ventures, 'the towns of the 720 with a failed venture').toBeLessThanOrEqual(20);
  }, 1_800_000);

  test('BR7 · the birth and the print read one story: the gap the birth wrote is the story printed, and the birth brings nothing more', () => {
    /** @type {string[]} */
    const found = []; let read = 0;
    expectNoSeedFailures(collectSeedFailures([...CENSUS, ...WIDE], (seed) => {
      const s = town(seed);
      expect(storySeed(s._seed), `${seed}: the record keeps the seed the birth read`).toBe(seed);
      const again = importsBroughtAtBirth(s, s._seed);
      if (again.length) found.push(`${seed} · the birth over its own product brings ${again.join(', ')}`);
      const venture = ventureHouseOf(s);
      for (const { inst, story } of storiesOf(s)) {
        const gaps = (s.resourceAnalysis?.gaps || []).filter((/** @type {any} */ g) => g?.institution === inst.name);
        if (!story || !gaps.length) continue;
        read++;
        const kind = venture?.name === inst.name ? 'missing' : story.story === 'bought' ? 'imported' : story.story === 'idle' ? 'missing' : 'none';
        if (!gaps.some((/** @type {any} */ g) => g.kind === kind)) found.push(`${seed} · ${inst.name} · printed ${story.story}, born ${gaps.map((/** @type {any} */ g) => g.kind).join('/')}`);
      }
    }), 'every town is born and read');
    expect(read, 'source houses with a gap the birth wrote').toBeGreaterThan(50);
    expect(found, 'a story the birth and the print tell two ways').toEqual([]);
  }, 1_800_000);

  test('L4 · the same seed twice tells the same story, and the birth writes no land list', () => {
    const SAMPLE = CENSUS.filter((seed) => impliedGroundsOf(town(seed)).states.size > 0).slice(0, 12);
    expect(SAMPLE.length, 'towns with an implied ground').toBe(12);
    expectNoSeedFailures(collectSeedFailures(SAMPLE, (seed) => {
      const a = town(seed);
      const b = generateSettlementPipeline(configOf(seed), null, { seed, customContent: {} });
      const tell = (/** @type {any} */ s) => JSON.stringify({ g: [...impliedGroundsOf(s).states], v: ventureHouseOf(s), st: storiesOf(s).map((x) => [x.inst.name, x.story]) });
      expect(tell(b), `${seed}: the same story twice`).toBe(tell(a));
      // the birth's site over a frozen config: it writes no field of the record's land (no implied ground is stored)
      const config = Object.freeze(structuredClone(a.config));
      for (const k of ['nearbyResources', 'nearbyResourcesNative', 'nearbyResourcesDepleted', 'nearbyResourcesNativeDepleted']) if (Array.isArray(config[k])) Object.freeze(config[k]);
      const terrain = getTerrainType(config.tradeRouteAccess, config.terrainOverride || null);
      expect(() => generateResourceAnalysis(terrain, resolveNearbyCommodities(config, terrain), config.specialResources || [], a.institutions || [], config, structuredClone(a.economicState), a._seed), `${seed}: the site runs over a frozen config`).not.toThrow();
      const stored = new Set([...(a.config.nearbyResources || []), ...(a.config.nearbyResourcesNative || [])]);
      const kept = [...impliedGroundsOf(a).states.keys()].filter((g) => stored.has(g));
      expect(kept, `${seed}: an implied ground on a stored field`).toEqual([]);
    }), 'the seed\'s choice');
  }, 900_000);

  test('W1 · the round trip: ten towns with an implied ground, regenerated from the saved config and seed and as a manual roster, are the towns they were', () => {
    const SAMPLE = CENSUS.filter((seed) => impliedGroundsOf(town(seed)).states.size > 0).slice(0, 10);
    expect(SAMPLE.length, 'towns with an implied ground').toBe(10);
    const j = (/** @type {unknown} */ x) => JSON.stringify(x);
    expectNoSeedFailures(collectSeedFailures(SAMPLE, (seed) => {
      const s = town(seed);
      const tell = (/** @type {any} */ r) => j({ g: [...impliedGroundsOf(r).states], v: ventureHouseOf(r), st: storiesOf(r).map((x) => [x.inst.name, x.story]) });
      for (const [form, cfg] of /** @type {Array<[string, any]>} */ ([['the regenerate', s.config], ['a manual roster', { ...s.config, nearbyResourcesRandom: false }]])) {
        const r = generateSettlementPipeline(structuredClone(cfg), null, { seed: s._seed, customContent: {} });
        expect(j(r.npcs), `${seed} (${form}): the people`).toBe(j(s.npcs));
        expect(j(r.relationships), `${seed} (${form}): the ties`).toBe(j(s.relationships));
        expect(j(r.institutions), `${seed} (${form}): the roster`).toBe(j(s.institutions));
        expect(tell(r), `${seed} (${form}): the story`).toBe(tell(s));
      }
    }), 'the round trip');
  }, 900_000);
});
