/**
 * birthKindsLaw.test.js — BIRTH-1 (the chair's ruling BR2 of 2026-11-17; vetoable by the owner): A HOUSE THAT BUYS ITS
 * MATERIAL HAS IT BROUGHT IN; A HOUSE THAT IS THE SOURCE OF ITS MATERIAL IS ANSWERED ONLY BY ITS GROUND.
 *
 * THE LAW (arm 1): in a town with no crisis and a connected road, no house of kind (i) (`houseKinds.js :: BUYS_AND_WORKS`)
 * is marked short (`houseInputAtHand.js :: housesShortOf`, the one fact, and the page's mark, which must agree with it
 * house for house: `crisisStoppedRow.js :: housesShortOfInput` reads the gap line's head); none of kind (ii)
 * (`SOURCE_GROUNDS`) is, but on a spent ground of its own (a true mark: the record's Depleted list names it) or as a
 * COUNTED EXCEPTION below. AND (arm 2): no import word is written under a siege or on an isolated route, and none twice.
 *
 * THE SEEDS, AND WHY THEY ARE ENOUGH. The law speaks only of calm towns on a connected road. Every such town of the
 * census's 720 is one of its 360 `r2r-` towns (each `r2s-` town carries a crisis by its name), and every such town of the
 * wide read's 150 is one of its five calm shapes (`bar0-<size>-calm-rand-27..41`, 75 towns): the guard births all 435 and
 * reads the law in the calm connected ones (225 of the 720 and 64 of the 150 at 4c3a3c03b). Arm 2 births the census's
 * 24 towns under a siege, the 150's 30 (`hamlet-under_siege`, `city-under_siege+famine`) and reads the isolated towns
 * among the 435.
 *
 * THE POSITIVE CONTROL: at the base (4c3a3c03b) the law fails in 148 of the 720's 225 calm connected towns and 38 of the
 * 150's 64 (the potter short of clay, the vintner of grapes, the weavers of wool, ...); the controls below are towns of
 * that base, read here BLIND (the words the birth brings in for the buyers struck from the record's imports): the house
 * is marked again, so the reader still sees what the base saw and the cure is the birth's word.
 *
 * @enforced-by this file (the guard of `src/domain/facts/houseKinds.js` and `resourceGenerator.js :: importsBroughtAtBirth`)
 */
import { describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { housesOnSpentGround, housesShortOf } from '../../src/domain/facts/houseInputAtHand.js';
import { housesShortOfInput } from '../../src/domain/display/crisisStoppedRow.js';
import { BUYER_IMPORT_WORDS, BUYS_AND_WORKS, SOURCE_GROUNDS, isSourceHouse } from '../../src/domain/facts/houseKinds.js';
import { catalogIdForName } from '../../src/data/institutionalCatalog.js';
import { hasTradeRouteConnection } from '../../src/domain/tradeRouteSemantics.js';
import { generateResourceAnalysis, importsBroughtAtBirth, resolveNearbyCommodities } from '../../src/generators/resourceGenerator.js';
import { getTerrainType } from '../../src/generators/terrainHelpers.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

await loadGenerationLawPayloads();

const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const W150 = Array.from({ length: 15 }, (_, i) => i + 27);
/** The census's 360 `r2r-` towns and the 150's 75 calm towns: every calm town of both. */
const CALM_SEEDS = [
  ...SIZES.flatMap((size) => Array.from({ length: 60 }, (_, i) => `r2r-${size}-${i}`)),
  ...['thorp', 'hamlet', 'village', 'town', 'metropolis'].flatMap((size) => W150.map((i) => `bar0-${size}-calm-rand-${i}`)),
];
/** The towns under a siege: the census's 24, the 150's 30. */
const SIEGE_SEEDS = [
  ...SIZES.flatMap((size) => Array.from({ length: 4 }, (_, i) => `r2s-under_siege-${size}-${i}`)),
  ...['hamlet-under_siege', 'city-under_siege+famine'].flatMap((shape) => W150.map((i) => `bar0-${shape}-rand-${i}`)),
];
const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** CENSUS-3 seedcfg.mjs's r2r-, r2s- and bar0- arms, verbatim in shape. @param {string} seed */
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

/** @param {any} s */
const calmConnected = (s) => (Array.isArray(s?.config?.stressTypes) ? s.config.stressTypes : []).length === 0
  && hasTradeRouteConnection(String(s?.config?.tradeRouteAccess ?? ''));
/** @param {any} s @param {string} name */
const idOf = (s, name) => { const inst = (s.institutions || []).find((/** @type {any} */ i) => i?.name === name) || { name };
  return String(inst.catalogId || catalogIdForName(name) || ''); };

/**
 * The law's instances in a town: `<seed> · <house>`, a house of kind (i) marked, or one of kind (ii) marked off a spent
 * ground of its own.
 * @param {string} seed @param {any} s
 */
function lawInstances(seed, s) {
  const spent = housesOnSpentGround(s); const depleted = new Set(Array.isArray(s.config?.nearbyResourcesDepleted) ? s.config.nearbyResourcesDepleted : []);
  /** @type {string[]} */
  const out = [];
  for (const [house] of housesShortOf(s)) {
    const id = idOf(s, house);
    if (BUYS_AND_WORKS.has(id)) { out.push(`${seed} · ${house}`); continue; }
    if (isSourceHouse(id) && !spent.has(house) && !SOURCE_GROUNDS[id].some((k) => depleted.has(k))) out.push(`${seed} · ${house}`);
  }
  return out;
}

/**
 * THE COUNTED EXCEPTIONS (measured at this cure over the seeds above; a ratchet: the list only shrinks). Each is a
 * house the held draw seat owns (BIRTH-2, the source house at its draw: the audit's R3b, held for the owner's word, it
 * re-draws people) or a row of a table not this seat's:
 *   - the dairy farmer on no pasture, the salt works on no brine (a river), the charcoal burner in no wood: a source
 *     house drawn where the land does not give its material; its mark is TRUE, and BIRTH-2 would not draw it;
 *   - the fish market on its own spent fisheries: the owner's table holds it (i) (it sells the catch brought to it),
 *     `crisisDependence.js :: SPENT_GROUND_WORKERS` holds it a house that works the ground itself, whose mark no
 *     import lifts (not this seat's file).
 */
const EXCEPTIONS = Object.freeze({
  'Dairy farmer': ['r2r-hamlet-12', 'r2r-hamlet-14', 'r2r-hamlet-19', 'r2r-hamlet-26', 'r2r-hamlet-47', 'r2r-hamlet-52', 'r2r-hamlet-56', 'r2r-village-14', 'r2r-village-16', 'r2r-village-32', 'r2r-village-36', 'r2r-village-46', 'r2r-village-51', 'r2r-village-54', 'bar0-hamlet-calm-rand-27', 'bar0-hamlet-calm-rand-28', 'bar0-hamlet-calm-rand-29', 'bar0-hamlet-calm-rand-39', 'bar0-village-calm-rand-29'],
  'Salt works': ['r2r-hamlet-18', 'r2r-town-15', 'r2r-town-29', 'r2r-city-22', 'r2r-city-41', 'r2r-metropolis-16', 'r2r-metropolis-20', 'r2r-metropolis-47', 'bar0-metropolis-calm-rand-27'],
  'Charcoal burner': ['r2r-hamlet-26', 'r2r-hamlet-48', 'r2r-hamlet-52', 'r2r-hamlet-59', 'r2r-town-17', 'r2r-town-40', 'r2r-city-0', 'r2r-city-59', 'r2r-metropolis-19', 'r2r-metropolis-24', 'r2r-metropolis-32', 'r2r-metropolis-41', 'r2r-metropolis-47', 'r2r-metropolis-57', 'bar0-hamlet-calm-rand-27', 'bar0-hamlet-calm-rand-29', 'bar0-village-calm-rand-31', 'bar0-metropolis-calm-rand-34'],
  'Fish market': ['r2r-village-11', 'r2r-village-45', 'r2r-town-6', 'r2r-town-29', 'r2r-town-38', 'r2r-town-50', 'r2r-town-52', 'r2r-city-14', 'r2r-city-34', 'r2r-city-35', 'r2r-metropolis-11', 'r2r-metropolis-21', 'r2r-metropolis-23', 'r2r-metropolis-28', 'r2r-metropolis-42', 'r2r-metropolis-45', 'r2r-metropolis-49', 'r2r-metropolis-55', 'bar0-town-calm-rand-28'],
});
const LEFT = Object.entries(EXCEPTIONS).flatMap(([house, seeds]) => seeds.map((seed) => `${seed} · ${house}`));

/** The record read BLIND: the words the birth brings in for the buyers struck from its imports. @param {any} s */
const blind = (s) => ({ ...s, economicState: { ...s.economicState, primaryImports: (s.economicState?.primaryImports || []).filter((/** @type {string} */ x) => !BUYER_IMPORT_WORDS.has(x)) } });

/** Towns of the base whose house the law marked there (4c3a3c03b), each a different kind of buyer. */
const CONTROLS = [
  ['r2r-village-4', 'Potter'],
  ['r2r-town-18', 'Vintner'],
  ['r2r-village-14', 'Fuller'],
  ['r2r-town-14', 'Weavers/Textile workers'],
  ['r2r-village-6', 'Brickmaker'],
  ['r2r-town-6', "Cobbler's guild"],
  ['r2r-village-15', 'Cooper'],
  ['r2r-hamlet-19', 'Resident smith (part-time)'],
  ['r2r-city-21', 'Luxury goods quarter'],
];

/** @param {string} x an import, its bracketed reason struck, lower case */
const wordOf = (x) => String(x).replace(/\([^)]*\)/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();

describe('BIRTH-1: a house that buys its material has it brought in; a source house is answered by its ground', () => {
  test('arm 1 · THE LAW over every calm town of the 720 and the 150: no buyer marked, no source house off its own spent ground, but the counted exceptions', () => {
    /** @type {string[]} */
    const found = []; let read = 0;
    const failures = collectSeedFailures(CALM_SEEDS, (seed) => {
      const s = town(seed);
      if (!calmConnected(s)) return;
      read++;
      found.push(...lawInstances(seed, s));
      // the page's mark reads the gap line's own words (`crisisStoppedRow.js :: housesShortOfInput`): it marks what the one
      // fact marks, house for house (the worked-out line keeps the head the mark reads)
      expect([...housesShortOfInput(s).keys()].sort(), `${seed}: the page's mark is the fact's`).toEqual([...housesShortOf(s).keys()].sort());
    });
    expectNoSeedFailures(failures, 'every calm town is born and read');
    expect(read, 'the calm towns on a connected road read (225 of the 720 and 64 of the 150 at 4c3a3c03b)').toBe(289);
    expect(found.filter((f) => !LEFT.includes(f)), 'a buyer marked, or a source house marked off its own spent ground').toEqual([]);
    expect(LEFT.filter((f) => !found.includes(f)), 'a counted exception is cured: strike it from EXCEPTIONS').toEqual([]);
  }, 1_800_000);

  test('arm 1 · THE POSITIVE CONTROL: each control town, read blind (the birth\'s words struck), marks its house again', () => {
    expectNoSeedFailures(collectSeedFailures(CONTROLS, ([seed, house]) => {
      const s = town(/** @type {string} */ (seed));
      expect(calmConnected(s), `${seed} is calm on a connected road`).toBe(true);
      expect(housesShortOf(s).has(/** @type {string} */ (house)), `${seed}: ${house} is not marked at this cure`).toBe(false);
      expect(housesShortOf(blind(s)).has(/** @type {string} */ (house)), `${seed}: ${house} is marked read blind`).toBe(true);
    }), 'every positive control fires');
  }, 900_000);

  test('arm 2 · no word under a siege or on an isolated route (at the write site, over the towns themselves), and none twice', () => {
    /** @param {any} s the record @param {any} config @returns {string[]} the imports after the site ran over them, blind */
    const site = (s, config) => {
      const es = structuredClone(blind(s).economicState);
      const terrain = getTerrainType(config.tradeRouteAccess, config.terrainOverride || null);
      generateResourceAnalysis(terrain, resolveNearbyCommodities(config, terrain), config.specialResources || [], s.institutions || [], config, es);
      return es.primaryImports || [];
    };
    // (a) the control towns: the site brings their words in on their own road, and none under a siege or on no road
    expectNoSeedFailures(collectSeedFailures(CONTROLS, ([seed]) => {
      const s = town(/** @type {string} */ (seed));
      const before = blind(s).economicState.primaryImports;
      const after = site(s, s.config);
      expect(after.length, `${seed}: the site brings words in on its connected road`).toBeGreaterThan(before.length);
      expect(importsBroughtAtBirth({ ...s, economicState: { ...s.economicState, primaryImports: after } }), `${seed}: a second reading brings nothing more`).toEqual([]);
      expect(site(s, { ...s.config, stressTypes: [...(s.config.stressTypes || []), 'under_siege'] }), `${seed} under a siege`).toEqual(before);
      expect(site(s, { ...s.config, tradeRouteAccess: 'isolated' }), `${seed} on an isolated route`).toEqual(before);
    }), 'the write site, controls');
    // (b) every town under a siege, and every isolated town of the seeds: the site writes nothing over its own record
    let gated = 0;
    expectNoSeedFailures(collectSeedFailures([...SIEGE_SEEDS, ...CALM_SEEDS], (seed) => {
      const s = town(seed);
      const besieged = (s.config?.stressTypes || []).includes('under_siege');
      if (!besieged && hasTradeRouteConnection(String(s.config?.tradeRouteAccess ?? ''))) return;
      gated++;
      expect(importsBroughtAtBirth(s), `${seed}: no word under a siege or on no road`).toEqual([]);
      expect(site(s, s.config), `${seed}: the site writes nothing`).toEqual(blind(s).economicState.primaryImports);
    }), 'the write site, siege and isolated towns');
    expect(gated, 'towns under a siege or on no connected road read').toBeGreaterThan(54);
    // (c) none twice: no town holds one import word twice (its bracketed reason struck)
    expectNoSeedFailures(collectSeedFailures([...SIEGE_SEEDS, ...CALM_SEEDS], (seed) => {
      const words = (town(seed).economicState?.primaryImports || []).map(wordOf);
      expect(words.filter((w, i) => words.indexOf(w) !== i), `${seed}: an import word twice`).toEqual([]);
    }), 'no word twice');
  }, 1_800_000);
});
