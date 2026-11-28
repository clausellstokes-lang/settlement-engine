/** @vitest-environment jsdom */
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
 *   (L5) the odds hold over the census's 720 (bands below); the towns with a failed venture number 9 to 20 (the floor re-recorded at
 *        the last close, FR17: 10 -> 9, the measured count; see the arm).
 *   (BR7) THE BIRTH AND THE PRINT READ ONE STORY: the record's own gap for each source house is the story the print reads,
 *        and the birth, read again over its own product, brings no word in.
 *   (W1) THE ROUND TRIP: ten towns with an implied ground, generated again by the product's regenerate (the saved config
 *        and seed) and from that config read as a manual roster: the same people, ties, roster and story.
 *   BIRTH-3 (the chair's ruling BR8 of 2026-11-17: THE SEED WRITES ONCE, AT THE BIRTH; EVERY VIEW READS THE RECORD). The arm
 *   BR7 is re-keyed by identity (2026-11-17, BIRTH-3: the same claim, that the birth and the print tell one story, now held
 *   house for house over every house and every view):
 *   (BR8) THE THREE EQUAL: every house's mark on the tab and in the PDF, the short reading, its input answers, the gap
 *        lines and the Resources tab's grounds read from the record, from the record with its seed deleted, from its public
 *        projection (`toPublicSafe`) and from the share veil over it are one (a difference the war's iron reading makes of
 *        the DM's plot hooks, which the projection withholds, is no supply story: it is shown to vanish with those hooks
 *        laid back, and named); and the birth's pick for every house (`birthPicksOn`) is the story read back from the
 *        record it wrote. THE SEED AT ONE PLACE: no file of `src/` but the birth's writer asks a pick of the seed.
 *   (P2) THE FAILED VENTURE'S MARK ON A RENDERED TAB AND IN THE PDF'S READING, wherever the short mark would print: never
 *        empty, never "Short of …".
 * POSITIVE CONTROL (BIRTH-3): at its base (b513feae2) the three differ in 65 towns of the 720 and 19 of the 150, and the
 * venture's mark prints on no tab (its gate answered null).
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
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { CHAIN_INPUTS, CHAIN_RAW_INPUT, chainsOfHouse, houseInputAtHand, housesShortOf, impliedGroundsOnPage, ventureHouseOf } from '../../src/domain/facts/houseInputAtHand.js';
import { FAMILY_NOUN, GROUND_YIELD, familyWord, groundsKeptOf, idOfHouse, impliedGroundsOf, isVentureLine, sourceStoryOf, ventureLineText, ventureMarkText, ventureOfLine } from '../../src/domain/facts/supplyStory.js';
import { ALSO_USES } from '../../src/domain/facts/houseKinds.js';
import { HOUSE_TRADE_INPUT, houseDependenceOf, INPUT } from '../../src/data/crisisDependence.js';
import { RESOURCE_CHAINS } from '../../src/data/goods/chains.js';
import { subsumeTradeGoods } from '../../src/domain/region/goodsCatalog.js';
import { rowShortOf } from '../../src/domain/display/crisisStoppedRow.js';
import { markOnPage } from '../../src/pdf/lib/crisisMarksOnPage.js';
import { toPublicSafe } from '../../src/domain/display/publicSafe.js';
import { projectShareVeil } from '../../src/domain/display/galleryVeil.js';
import InstitutionsTab from '../../src/components/new/tabs/InstitutionsTab.jsx';
import { ServicesTab } from '../../src/components/new/tabs/ServicesTab.jsx';
import { SPENT_GROUND_YIELD } from '../../src/data/crisisDependence.js';
import { resourceShortageImport } from '../../src/domain/resourceSemantics.js';
import { BUYS_AND_WORKS, MATERIAL_OF, RUNS_ON_BOUGHT, SOURCE_GROUNDS, SUPPLY_ODDS, TAKERS } from '../../src/domain/facts/houseKinds.js';
import { rowMarkText } from '../../src/domain/display/crisisStoppedRow.js';
import { resourceGapLines } from '../../src/domain/display/validationOnPage.js';
import { liveInstitutions } from '../../src/domain/institutions/institutionRoster.js';
import { hasTradeRouteConnection } from '../../src/domain/tradeRouteSemantics.js';
import { birthPicksOn, generateResourceAnalysis, importsBroughtAtBirth, resolveNearbyCommodities } from '../../src/generators/resourceGenerator.js';
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
  .map((inst) => ({ inst, id: idOfHouse(inst), story: sourceStoryOf(s, inst, resourceShortageImport) }));
/** The noun the gap line names for a word ("Timber" -> timber). @param {string} line */
const gapGood = (line) => /^No (.+?) reach(?:es)? /.exec(line)?.[1] ?? '';

/** The besieged buyers the law read (its anchor). */
const besiegedBuyers = { n: 0 };
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
      if (!/Short of /.test(mark)) bad('L1 idle, no short mark on its card (AMENDMENT 2 (B))', inst.name);
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
    // BIRTH-3 (2026-11-17, the second reader's M5 (iii), H2): the mark is never empty where the house's row takes an input
    // mark (a null mark was accepted before), and never "Short of …"
    // BIRTH-3 (AMENDMENT 2 (B), 2026-11-17): whatever the crisis table's class of its row (a peat cutter is NONE there)
    if (!/^(?:Abandoned|Failing): a failed venture\.$/.test(mark ?? '')) bad('L1 venture, not its mark', venture.name);
    if (/Short of/.test(mark ?? '')) bad('L1 venture, marked short', venture.name);
    if (!lines.some((l) => isVentureLine(l))) bad('L1 venture, no line', venture.name);
    if (lines.some((l) => /is worked out: /.test(l) && l.toLowerCase().includes(venture.name.toLowerCase().replace(/\s*\([^)]*\)/g, '')))) bad('L1 venture, a worked-out line beside its line (M1)', venture.name);
    if (listHolds(s, familyWord(venture.family))) bad('L1 venture, its word on the imports', venture.name);
    if (venture.ground && (shown.there.includes(venture.ground) || shown.used.includes(venture.ground))) bad('L1 venture, its ground on the land list', venture.name);
    // BIRTH-3 (BR6, the second reader's M2): every live house that uses the material counts, in whatever table it sits
    const uses = (/** @type {any} */ i) => { const id = idOfHouse(i); return MATERIAL_OF[id] === venture.family || ALSO_USES[id] === venture.family
      || (HOUSE_TRADE_INPUT[id] || '') === venture.family || chainsOfHouse(i.name, RESOURCE_CHAINS).some(([k]) => k === venture.family); };
    const others = liveInstitutions(s).filter((i) => i?.name !== venture.name && uses(i));
    if (others.length) bad('L2 venture, another house works its material', venture.name);
    // BIRTH-3 (BR6, H3): no stored ground of the land list yields its material
    const stored = [...(s.config?.nearbyResources || []), ...(s.config?.nearbyResourcesDepleted || [])].map(String);
    if (stored.some((g) => GROUND_YIELD[g] && GROUND_YIELD[g] === ({ timber: 'timber', ironOre: 'iron ore', livestock: 'livestock', stone: 'stone', clay: 'clay', hides: 'hides', wool: 'wool', herbs: 'herbs', peat: 'reeds' })[venture.family])) bad('L2 venture, a stored ground of its material', venture.name);
  }
  // BIRTH-3 (the chair's AMENDMENT 2 (D)): THE BESIEGED FORM OF A BUYER (BR3 (c)): where the town buys its material in, under a
  // siege the word stands on the imports, the house is curtailed by the siege, and it never reads `missing`
  if (besiegedIn(s)) for (const inst of liveInstitutions(s)) {
    const id = idOfHouse(inst); const family = MATERIAL_OF[id];
    if (!BUYS_AND_WORKS.has(id) || !family || !CHAIN_INPUTS[family] || !listHolds(s, familyWord(family))) continue;
    const answer = houseInputAtHand(s, family, inst, { rawResource: CHAIN_RAW_INPUT[family] });
    if (answer === 'local') continue; // the land gives it: its own goods, no siege mark
    // a row the crisis table holds the food's ("food: grain": the mills, the bakers, the brewery) is read by the food's own
    // reading under a siege, not the supply rule's: NAMED (8 houses of the 720 and the 150 carry no siege mark there)
    if (houseDependenceOf(inst).some((d) => String(d).startsWith('food:'))) continue;
    besiegedBuyers.n++;
    if (answer === 'missing') bad('L1 besieged buyer, its word bought and its input missing', inst.name);
    else if (houseDependenceOf(inst).includes(INPUT) && !/siege/.test(rowMarkText(s, 'house', inst) || '')) bad(`L1 besieged buyer, its word bought (${answer}) and no siege mark`, inst.name);
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

/** @param {unknown} x */
const j = (x) => JSON.stringify(x);
/** The record with its seed deleted (BR8 (7)(b)). @param {any} s */
const unseeded = (s) => { const c = structuredClone(s); delete c._seed; delete c._regenSeed; if (c.config) delete c.config._seed; return c; };
/**
 * THE PAGE'S SUPPLY READING (BR8 (7)): every live house's input answers, its mark on the tab and in the PDF, the short
 * reading, its source story; the gap lines; the Resources tab's grounds; the failed venture. @param {any} r
 */
function supplyReading(r) {
  const short = housesShortOf(r);
  const houses = liveInstitutions(r).filter((i) => !!i && typeof i.name === 'string').map((i) => {
    const id = idOfHouse(i);
    const keys = [...new Set([HOUSE_TRADE_INPUT[id], ...chainsOfHouse(i.name, RESOURCE_CHAINS).map(([k]) => k)].filter((k) => k && CHAIN_INPUTS[k]))];
    return [i.name, keys.map((k) => [k, houseInputAtHand(r, k, i, /** @type {any} */ (RESOURCE_CHAINS)[k] || { rawResource: CHAIN_RAW_INPUT[k] })]),
      rowMarkText(r, 'house', i), markOnPage(r, 'house', i), short.get(i.name) ?? null, sourceStoryOf(r, i, resourceShortageImport)?.story ?? null];
  }).sort((a, b) => (String(a[0]) < String(b[0]) ? -1 : 1));
  return { houses, lines: resourceGapLines(r).map((l) => l.impact), grounds: impliedGroundsOnPage(r), venture: ventureHouseOf(r) };
}

describe('BIRTH-2: the seed picks the supply story; every part of the page tells it', () => {
  test('EG1 · the leaf\'s copy equals its source, key for key (the dependence table\'s yields)', () => {
    expect(Object.keys(GROUND_YIELD).length, 'the yields copied').toBeGreaterThan(15);
    expect(Object.entries(GROUND_YIELD), 'the yields of a spent ground').toEqual(Object.entries(SPENT_GROUND_YIELD));
  });

  test('E · THE VENTURE\'S WORDS, ONE TABLE: every line its writer can build is read back as its version (both versions, a house singular and plural, every material); its marks are four words', () => {
    /** @type {string[]} */
    const found = [];
    for (const venture of /** @type {Array<'abandoned' | 'failing'>} */ (['abandoned', 'failing'])) {
      for (const house of ['the potter', 'the cobbler\'s guild', 'the tanners', 'the weavers/textile workers']) {
        for (const family of [...Object.keys(FAMILY_NOUN), 'peat']) {
          const line = ventureLineText({ name: '', id: '', family, ground: '', venture, line: '' }, house);
          if (ventureOfLine(line) !== venture) found.push(`${venture} · ${house} · ${family}: ${line}`);
        }
      }
      const mark = String(ventureMarkText({ name: '', id: '', family: 'clay', ground: '', venture, line: '' }));
      if (mark.split(/\s+/).length !== 4) found.push(`${venture}: its mark is not four words: ${mark}`);
    }
    // the words of a town saved before (BIRTH-2's tip wrote "lies" of a plural material and "is" of a plural house): still read
    for (const old of ['The tanners is failing: no hides lies near and none is brought in.', 'The cobbler\'s guild stands abandoned, a venture of an earlier time: no hides lies near and none is brought in.']) if (!isVentureLine(old)) found.push(`the old words unread: ${old}`);
    expect(found, 'a venture line its own reader does not read').toEqual([]);
    expect(isVentureLine('No clay reaches the potter.'), 'a gap line is no venture line (the anchor)').toBe(false);
  });

  test('L1-L3 · every story told on every surface, over the census\'s 720 and the 150', () => {
    /** @type {string[]} */
    const found = []; /** @type {Record<string, number>} */ const told = {};
    const failures = collectSeedFailures([...CENSUS, ...WIDE], (seed) => {
      const s = town(seed);
      found.push(...lawInstances(seed, s));
      for (const { story } of storiesOf(s)) if (story && story.story !== 'abandoned') told[story.story] = (told[story.story] || 0) + 1;
      if (ventureHouseOf(s)) told.venture = (told.venture || 0) + 1;
    });
    expectNoSeedFailures(failures, 'every town is born and read');
    // the anchors: each story is told in the populations (the law is not read over an empty set)
    expect(Object.keys(told).sort(), 'every story is told').toEqual(['bought', 'idle', 'local', 'venture']);
    expect(Math.min(told.bought, told.idle, told.local), 'each story by more than ten houses').toBeGreaterThan(10);
    expect(besiegedBuyers.n, 'besieged buyers whose word the town buys, read (the anchor)').toBeGreaterThan(20);
    expect(found, 'a house whose surfaces tell two stories').toEqual([]);
  }, 1_800_000);

  test('L5 · the odds hold over the census\'s 720, and a failed venture stands in 9 to 20 of its towns', () => {
    let there = 0, implied = 0, ventures = 0, usedConnected = 0, boughtConnected = 0;
    expectNoSeedFailures(collectSeedFailures(CENSUS, (seed) => {
      const s = town(seed);
      // FAULTS-BIRTH FR24 (2) (2026-11-18, R8: re-keyed by identity): a pasture a live Common grazing land keeps is the record
      // speaking (`supplyStory.js :: groundsKeptOf`), never the seed's pick: the odds are read over the grounds the seed picks
      const kept = groundsKeptOf(s);
      for (const [g, st] of impliedGroundsOf(s).states) { if (kept.includes(g)) continue; implied++; if (st === 'there') there++; }
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
    // THE FLOOR RE-RECORDED AT THE MEASURED COUNT (the last close, LASTCLOSE-DOORS, 2026-11-19; the chair's ruling FR17, vetoable):
    // 10 -> 9. FAULTS-BIRTH (point 63, 5eb9f6add) read the failed venture's pick ONCE and proved a taker's implied ground by the
    // houses that keep or yield it (the second ring): towns that had told a venture now tell a local or bought story, and the
    // ventures over the 720 went 11 -> 9 (measured at its landing and again here at cc11c9504, with point 68's commons on top).
    // THE ODDS STAY (FR17): the venture's own odds are unchanged; the count fell because fewer houses reach the venture's pick.
    expect(ventures, 'the towns of the 720 with a failed venture').toBeGreaterThanOrEqual(9);
    expect(ventures, 'the towns of the 720 with a failed venture').toBeLessThanOrEqual(20);
  }, 1_800_000);

  test('BR8 · no view reads the seed: the record, the record without its seed, its public projection and the share veil tell one story, and it is the birth\'s pick', () => {
    /** @type {string[]} */
    const found = []; let read = 0, used = 0, imported = 0;
    expectNoSeedFailures(collectSeedFailures([...CENSUS, ...WIDE], (seed) => {
      const s = town(seed);
      const again = importsBroughtAtBirth(s, s._seed);
      if (again.length) found.push(`${seed} · the birth over its own product brings ${again.join(', ')}`);
      // BIRTH-3 (the chair's AMENDMENT 1 (2)): no second word of one canonical good on the imports (57 towns of the 720 at the base)
      const imports = s.economicState?.primaryImports || [];
      if (subsumeTradeGoods(imports).length !== imports.length) found.push(`${seed} · two words of one good on the imports`);
      const a = j(supplyReading(s));
      // the birth's pick for every house is the story read back from the record it wrote
      if (j(supplyReading(birthPicksOn(s, s._seed))) !== a) found.push(`${seed} · the birth's pick and the record's story`);
      for (const [form, r] of /** @type {Array<[string, any]>} */ ([['without its seed', unseeded(s)], ['public', toPublicSafe(structuredClone(s))], ['the share veil', projectShareVeil(toPublicSafe(structuredClone(s)), null)]])) {
        // BIRTH-3 (the chair's ruling BR9): no carve-out: the war's iron mark reads what every view keeps (`warIronHook.js`)
        if (j(supplyReading(r)) !== a) found.push(`${seed} · ${form}`);
      }
      read++;
      if (impliedGroundsOf(s).states.size) used += [...impliedGroundsOf(s).states.values()].filter((st) => st === 'used').length;
      imported += (s.resourceAnalysis?.gaps || []).filter((/** @type {any} */ g) => g?.kind === 'imported').length;
    }), 'every town is born and read');
    expect(read, 'towns read').toBe(CENSUS.length + WIDE.length);
    expect(used, 'proven grounds the record tells used up (the anchor)').toBeGreaterThan(20);
    expect(found, 'a town two views or the birth and the record tell two ways').toEqual([]);
  }, 1_800_000);

  test('BR8 · the seed enters the supply rule at one place: no file of src but the birth\'s writer asks a pick of the seed', () => {
    const root = path.resolve(__dirname, '../../src');
    /** @param {string} d @returns {string[]} */
    const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : /\.(js|jsx)$/.test(e.name) ? [path.join(d, e.name)] : []));
    const PICKS = /\b(?:groundPicksAtBirth|boughtAtBirth|ventureAtBirth|seedPicks|BIRTH_PICKS|birthPicksOn)\b/;
    const askers = walk(root).filter((f) => PICKS.test(fs.readFileSync(f, 'utf8'))).map((f) => path.relative(root, f)).sort();
    expect(askers, 'the files that name the birth\'s picks').toEqual(['domain/facts/supplyStory.js', 'generators/resourceGenerator.js']);
    // the readers at print name no seed
    const READERS = ['domain/facts/supplyStory.js', 'domain/facts/houseInputAtHand.js', 'domain/display/validationOnPage.js', 'domain/display/crisisStoppedRow.js', 'components/new/tabs/ResourcesTab.jsx'];
    const seeded = READERS.filter((f) => /\b_seed\b|seedOfRecord/.test(fs.readFileSync(path.join(root, f), 'utf8')));
    expect(seeded, 'a reader at print that names the record\'s seed').toEqual([]);
  });

  test('P2 · the failed venture\'s mark prints on a rendered tab and in the PDF\'s reading wherever the short mark would', () => {
    /** @type {string[]} */
    const found = []; let rendered = 0;
    // FAULTS-BIRTH (2026-11-18, R8: re-keyed by identity): the venture is never picked beside a house that keeps or yields its
    // material (FR8 (b)), and the 720 hold 9 ventures (11 before): the same claim over the 720 and the wide read's 150 (12)
    expectNoSeedFailures(collectSeedFailures([...CENSUS, ...WIDE], (seed) => {
      const s = town(seed);
      const venture = ventureHouseOf(s);
      if (!venture) return;
      const inst = liveInstitutions(s).find((i) => i?.name === venture.name);
      const services = Object.values(s.availableServices || {}).flat().filter((/** @type {any} */ x) => x && typeof x === 'object' && x.institution === venture.name);
      const gated = [rowShortOf(s, 'house', inst), ...services.map((/** @type {any} */ x) => rowShortOf(s, 'service', x))].filter(Boolean);
      const MARK = /(?:Abandoned|Failing): a failed venture\./;
      if (!gated.every((m) => MARK.test(String(m)))) found.push(`${seed} · the gate: ${gated.join(' | ')}`);
      if (!MARK.test(String(markOnPage(s, 'house', inst)))) found.push(`${seed} · the PDF's reading: ${markOnPage(s, 'house', inst)}`);
      const page = render(React.createElement(InstitutionsTab, { settlement: s })).container.textContent || '';
      cleanup();
      const svcPage = render(React.createElement(ServicesTab, { services: s.availableServices, settlement: s, narrativeNote: null })).container.textContent || '';
      cleanup();
      rendered++;
      if (!MARK.test(page) && !MARK.test(svcPage)) found.push(`${seed} · ${venture.name}: no tab prints its mark`);
    }), 'the ventures of the census');
    expect(rendered, 'every venture of the census, rendered (the anchor)').toBeGreaterThan(9);
    expect(found, 'a failed venture whose mark is empty on a tab or in the PDF').toEqual([]);
  }, 900_000);

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

// LEFT-MARKS M1 (the second reader on BIRTH-3, 2026-11-17: "ruling A has no guard"; the sixth chair's ruling BR10 (1): A
// STANDS). A source house whose only chains work a spent ground of its own kind, beside a LIVE ground of its own kind on
// the record, is at work: it reads `local` and prints no mark. The houses are chosen from the tables and the record (the
// house's kinds, `SOURCE_GROUNDS`; its chains on the record's grounds; the land lists), not by the leaf under test. At the
// base (e0242a12a) they are 18 houses of the 720: the 17 mines of ruling BR10 (r2r-town-45; r2r-metropolis-9, -15, -17, -24,
// -29, -37, -40, -57; r2s-indebted-metropolis-2; r2s-infiltrated-metropolis-1, -2; r2s-insurgency-metropolis-0, -3;
// r2s-monster_pressure-metropolis-2; r2s-politically_fractured-metropolis-1; r2s-succession_void-city-0), each on one chain of
// spent iron beside a live seam of coal, gemstones or precious metals, and a charcoal burner (r2r-metropolis-43). ITS
// NEGATIVE: a taker (a mine, a quarry, a landing ...) whose every own ground on the record is spent reads worked out and is
// marked. PROVEN BY THE MUTATION: with `sourceStoryOf`'s `|| own.some((g) => live.has(g))` reverted the first arm is red.
describe('LEFT-MARKS M1: ruling A, a source house beside a live ground of its own kind, is at work', () => {
  /** @param {any} s */
  const grounds = (s) => {
    const cfg = s.config || {};
    const custom = new Set((cfg.nearbyResourcesCustom || []).map(String));
    const spent = new Set((cfg.nearbyResourcesDepleted || []).map(String));
    const land = new Set([...(cfg.nearbyResources || []), ...(cfg.nearbyResourcesNative || [])].map(String).filter((k) => !custom.has(k)));
    for (const k of spent) land.add(k);
    return { land, spent };
  };
  test('over the census\'s 720: beside a live ground of its kind, local and unmarked; every own ground spent, a taker worked out and marked', () => {
    /** @type {string[]} */ const beside = []; /** @type {string[]} */ const spentAll = []; /** @type {string[]} */ const bad = [];
    expectNoSeedFailures(collectSeedFailures(CENSUS, (seed) => {
      const s = town(seed);
      const { land, spent } = grounds(s);
      for (const inst of liveInstitutions(s)) {
        if (!inst || typeof inst.name !== 'string' || inst.isCustom) continue;
        const id = idOfHouse(inst);
        if (!Object.prototype.hasOwnProperty.call(SOURCE_GROUNDS, id)) continue;
        const own = /** @type {readonly string[]} */ (SOURCE_GROUNDS[/** @type {keyof typeof SOURCE_GROUNDS} */ (id)]);
        const held = own.filter((g) => land.has(g));
        const chains = (s.economicState?.activeChains || []).filter((/** @type {any} */ c) => own.includes(c.resourceKey) && land.has(c.resourceKey) && (c.processingInstitutions || []).includes(inst.name));
        const story = sourceStoryOf(s, inst, resourceShortageImport)?.story;
        const mark = rowMarkText(s, 'house', inst);
        if (chains.length && chains.every((/** @type {any} */ c) => spent.has(c.resourceKey)) && held.some((g) => !spent.has(g))) {
          beside.push(`${seed} · ${inst.name}`);
          if (story !== 'local' || mark !== null) bad.push(`${seed} · ${inst.name}: beside a live ground of its kind it reads ${story}, marked "${mark}"`);
        }
        if (TAKERS.has(id) && held.length && held.every((g) => spent.has(g))) {
          spentAll.push(`${seed} · ${inst.name}`);
          if (story !== 'idle' || mark === null) bad.push(`${seed} · ${inst.name}: every own ground spent, it reads ${story}, marked "${mark}"`);
        }
      }
    }), 'every census town is born and read');
    expect(beside.length, 'houses beside a live ground of their own kind (the anchor)').toBeGreaterThan(10);
    expect(spentAll.filter((x) => / · Mine/.test(x)).length, 'mines whose every own ground is spent (the negative\'s anchor)').toBeGreaterThan(10);
    expect(bad, 'a source house whose story is not ruling A\'s').toEqual([]);
  }, 1_800_000);
});

// LEFT-MARKS M4 (the second reader on BIRTH-3, 2026-11-17): `houseInputAtHand.js :: warIronHookOutsideWar` reads the war's
// state off the stress container (EG1), a copy of `facts/warState.js :: warStateOf`; the copy did not read the world pulse's
// words (`occupation`, `siege`: peace there, "at war" and "front" in `warStateOf`). THE TEST ITS COMMENT PROMISES: the copy
// (`warStateOnRecord`) equals `warStateOf` over the census's 720, the 150 and constructed records carrying each word of
// `stressorPicker.js :: GEN_TO_PULSE_TYPE` (the generator's and the pulse's), alone and beside another.
describe('LEFT-MARKS M4: the war\'s state read import-free answers as warStateOf does', () => {
  test('warStateOnRecord equals warStateOf over the 720, the 150 and records carrying each crisis word, the pulse\'s too', async () => {
    const { warStateOnRecord } = await import('../../src/domain/facts/houseInputAtHand.js');
    const { warStateOf } = await import('../../src/domain/facts/warState.js');
    const { GEN_TO_PULSE_TYPE } = await import('../../src/domain/stressorPicker.js');
    const words = [...Object.keys(GEN_TO_PULSE_TYPE), ...Object.values(GEN_TO_PULSE_TYPE)];
    expect(words, 'the pulse\'s two words are among them').toEqual(expect.arrayContaining(['siege', 'occupation']));
    const built = [...words.map((w) => ({ stress: [{ type: w }] })), ...words.map((w) => ({ stress: [{ type: 'famine' }, { type: w }] })), { stress: [] }];
    expectNoSeedFailures(collectSeedFailures(built, (r) => {
      expect(warStateOnRecord(r), `${JSON.stringify(r.stress)}: the two readings of the war`).toBe(warStateOf(r));
    }), 'every constructed record reads one war');
    const states = new Set();
    expectNoSeedFailures(collectSeedFailures([...CENSUS, ...WIDE], (seed) => {
      const s = town(seed);
      states.add(warStateOf(s));
      expect(warStateOnRecord(s), `${seed}: the two readings of the war`).toBe(warStateOf(s));
    }), 'every town reads one war');
    expect([...states].sort(), 'the three states are read (the anchor)').toEqual(['at war', 'front', 'peace']);
  }, 1_800_000);
});
