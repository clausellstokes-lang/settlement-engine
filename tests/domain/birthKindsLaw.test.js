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
 * @enforced-by this file (the guard of `src/domain/facts/houseKinds.js` and `src/generators/resourceGenerator.js :: importsBroughtAtBirth`)
 */
import { subsumeTradeGoods } from '../../src/domain/region/goodsCatalog.js';
import { describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { housesOnSpentGround, housesShortOf } from '../../src/domain/facts/houseInputAtHand.js';
import { housesShortOfInput } from '../../src/domain/display/crisisStoppedRow.js';
import { BUYER_IMPORT_WORDS, BUYS_AND_WORKS, MATERIAL_OF, SOURCE_GROUNDS, isSourceHouse } from '../../src/domain/facts/houseKinds.js';
import { sourceStoryOf, usedGroundOf } from '../../src/domain/facts/supplyStory.js';
import { resourceShortageImport } from '../../src/domain/resourceSemantics.js';
import { ventureHouseOf } from '../../src/domain/facts/houseInputAtHand.js';
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
  // RE-KEYED BY IDENTITY (BIRTH-2, 2026-11-17; the owner's rule, BR5: THE SEED PICKS THE STORY): a house THE SEED LEFT IDLE
  // (its material's ground used up, stored or implied, and the town not buying it in: the owner's fourth story) and THE
  // FAILED VENTURE (the owner's fifth) are true marks now, as a source house on its own spent ground was; the law's claim
  // on every other house stands as written
  const venture = ventureHouseOf(s);
  for (const [house] of housesShortOf(s)) {
    const id = idOf(s, house);
    if (venture?.name === house) continue;
    const inst = (s.institutions || []).find((/** @type {any} */ i) => i?.name === house) || { name: house };
    if (BUYS_AND_WORKS.has(id)) { if (!spent.has(house) && !usedGroundOf(s, MATERIAL_OF[id] || '')) out.push(`${seed} · ${house}`); continue; }
    if (isSourceHouse(id) && sourceStoryOf(s, inst, resourceShortageImport)?.story === 'idle') continue;
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
// STRUCK BY ITS OWN RULE (BIRTH-2, 2026-11-17): every counted exception is cured. The dairy farmer, the salt works and the
// charcoal burner on no ground of their own stand on the ground they prove, or buy their material in, or idle by the seed's
// pick (a true mark this law no longer counts, above); the fish market is read as a buyer (the owner's table) and is fed by
// its fisheries' shortage import where the seed has the town buy it. The ratchet stands at zero.
/** @type {Readonly<Record<string, ReadonlyArray<string>>>} */
const EXCEPTIONS = Object.freeze({});
const LEFT = Object.entries(EXCEPTIONS).flatMap(([house, seeds]) => seeds.map((seed) => `${seed} · ${house}`));

/** The record read BLIND: the words the birth brings in for the buyers struck from its imports. @param {any} s */
const blind = (s) => ({ ...s, economicState: { ...s.economicState, primaryImports: (s.economicState?.primaryImports || []).filter((/** @type {string} */ x) => !BUYER_IMPORT_WORDS.has(x)) } });

/** Towns of the base whose house the law marked there (4c3a3c03b), each a different kind of buyer. */
const CONTROLS = [
  ['r2r-village-4', 'Potter'],
  ['r2r-town-18', 'Vintner'],
  // RE-KEYED BY IDENTITY (BIRTH-2, 2026-11-17): r2r-village-14's fuller now has its wool of the pasture a house there proves
  // (`supplyStory.js`); the same claim, a fuller marked only when the birth's words are struck, stands in r2r-town-28
  ['r2r-town-28', 'Fuller'],
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
      generateResourceAnalysis(terrain, resolveNearbyCommodities(config, terrain), config.specialResources || [], s.institutions || [], config, es, s._seed); // BIRTH-2 (BR7): the birth's seed
      return es.primaryImports || [];
    };
    // (a) the control towns: the site brings their words in on their own road, and none under a siege or on no road
    expectNoSeedFailures(collectSeedFailures(CONTROLS, ([seed]) => {
      const s = town(/** @type {string} */ (seed));
      const before = blind(s).economicState.primaryImports;
      const after = site(s, s.config);
      expect(after.length, `${seed}: the site brings words in on its connected road`).toBeGreaterThan(before.length);
      expect(importsBroughtAtBirth({ ...s, economicState: { ...s.economicState, primaryImports: after } }, s._seed), `${seed}: a second reading brings nothing more`).toEqual([]);
      // RE-KEYED BY IDENTITY (BIRTH-2, 2026-11-17; the owner, BR3 (c): "a siege ... doesn't exclude"): under a siege the site
      // brings the town's ordinary-times words in as on its open road (the bought-in house then carries the siege's mark:
      // `supplyStoryLaw.test.js` L1); on an isolated route still none
      expect(site(s, { ...s.config, stressTypes: [...(s.config.stressTypes || []), 'under_siege'] }).length, `${seed} under a siege`).toBeGreaterThan(before.length);
      expect(site(s, { ...s.config, tradeRouteAccess: 'isolated' }), `${seed} on an isolated route`).toEqual(before);
    }), 'the write site, controls');
    // (b) every town under a siege, and every isolated town of the seeds: the site writes nothing over its own record
    let gated = 0;
    expectNoSeedFailures(collectSeedFailures([...SIEGE_SEEDS, ...CALM_SEEDS], (seed) => {
      const s = town(seed);
      const besieged = (s.config?.stressTypes || []).includes('under_siege');
      if (!besieged && hasTradeRouteConnection(String(s.config?.tradeRouteAccess ?? ''))) return;
      gated++;
      // RE-KEYED BY IDENTITY (BIRTH-2, 2026-11-17; BR3 (c)): under a siege the birth writes its ordinary-times words, so the
      // claim on a besieged town is that the site, over its own record, writes no word its record lacks; on no road, none
      expect(importsBroughtAtBirth(s, s._seed), `${seed}: the birth over its own product brings nothing more`).toEqual([]);
      const stored = new Set((s.economicState?.primaryImports || []).map(wordOf));
      // RE-KEYED BY IDENTITY (BIRTH-3, 2026-11-17; the chair's AMENDMENT 1 (2): the birth writes no second word of one
      // canonical good): "a word the record lacks" is a good no word of the record names, by the trade catalog's own reading
      // (the blind record, its buyer words struck, may bring the hides' word where the record holds the beasts', one good)
      const listed = s.economicState?.primaryImports || [];
      if (besieged) expect(site(s, s.config).filter((/** @type {string} */ w) => !stored.has(wordOf(w)) && subsumeTradeGoods([...listed, w]).length > subsumeTradeGoods(listed).length), `${seed}: the site writes no word the record lacks`).toEqual([]);
      else expect(site(s, s.config), `${seed}: the site writes nothing`).toEqual(blind(s).economicState.primaryImports);
    }), 'the write site, siege and isolated towns');
    expect(gated, 'towns under a siege or on no connected road read').toBeGreaterThan(54);
    // (c) none twice: no town holds one import word twice (its bracketed reason struck)
    expectNoSeedFailures(collectSeedFailures([...SIEGE_SEEDS, ...CALM_SEEDS], (seed) => {
      const words = (town(seed).economicState?.primaryImports || []).map(wordOf);
      expect(words.filter((w, i) => words.indexOf(w) !== i), `${seed}: an import word twice`).toEqual([]);
    }), 'no word twice');
  }, 1_800_000);
});

// LEFT-MARKS M2 (the second reader on BIRTH-3, 2026-11-17): `resourceGenerator.js :: importsBroughtAtBirth`'s `bring` brings a
// word only if it adds a canonical good (`goodsCatalog.js :: subsumeTradeGoods`); over the corpus the reader's own table
// answers first, so its removal turned nothing red. A CONSTRUCTED RECORD (a town on a road, r2r-town-0, its land emptied, a
// tanner alone on its roster, no chain): with "Livestock" on the imports the reader feeds the tanner (`ONE_GOOD_BOUGHT`) and
// nothing is brought; with another word of the same good that the hides reader does not read ("Dairy products", "Meat": the
// catalogue's livestock good), the tanner's story is bought in and `bring` alone keeps the second word of the one good out.
// With nothing on the imports the hides word is brought (the arm's positive; the seed 'm2' is one whose pick of the failed
// venture leaves the tanner a buyer: a venture buys nothing). PROVEN BY THE MUTATION: with `bring`'s
// `subsumeTradeGoods` clause removed in scratch, the two words read ["Raw hides and animal products"]; restored, [].
describe('LEFT-MARKS M2: the birth brings no second word of one canonical good', () => {
  test('a tanner on a road: nothing brought beside "Livestock", "Dairy products" or "Meat"; the hides word on an empty list', () => {
    const s = JSON.parse(JSON.stringify(town('r2r-town-0'))); // the stored record (a born record carries the birth's picks)
    expect(hasTradeRouteConnection(String(s.config?.tradeRouteAccess ?? '')), 'r2r-town-0 is on a road').toBe(true);
    const make = (/** @type {string[]} */ imports) => ({ ...s, config: { ...s.config, nearbyResources: [], nearbyResourcesNative: [], nearbyResourcesDepleted: [] },
      institutions: [{ name: 'Tanners', status: 'active' }], economicState: { ...s.economicState, primaryImports: imports, localProduction: [], activeChains: [] },
      resourceAnalysis: { ...s.resourceAnalysis, gaps: [], imports: { critical: [], recommended: [], reasons: {} } } });
    expect(importsBroughtAtBirth(make([]), 'm2'), 'nothing on the imports: the hides word is brought').toEqual(['Raw hides and animal products']);
    for (const word of ['Livestock', 'Dairy products', 'Meat']) {
      expect(subsumeTradeGoods([word, 'Raw hides and animal products']).length, `${word} and the hides word are one good`).toBe(1);
      expect(importsBroughtAtBirth(make([word]), 'm2'), `"${word}" on the imports: no hides word`).toEqual([]);
    }
  }, 300_000);
});
