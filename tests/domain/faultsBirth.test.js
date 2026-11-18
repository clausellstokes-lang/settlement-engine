/**
 * FAULTS-BIRTH · THE SUPPLY RULE'S OWN LEFTOVERS (the sixth chair's BRIEF-FAULTS, ruling FR8, 2026-11-18; the owner's rule,
 * BRIEF-BIRTH-2's table and item 2; vetoable by the owner). Red at the seat's base (4288049ba), green at its tip.
 *   (a) THE SECOND RING IS READ AS THE FIRST: a taker on no ground of its own kind (a fisher's landing, a woodcutter, a hunter's
 *       lodge, a shepherd, a wildfowler) proves its ground by the same seeded pick as a source house: there (the house at work,
 *       the ground on the land list as proven) or used up (the house idle, marked short, the ground under Depleted); a reading,
 *       stored nowhere. It is never the failed venture (`houseKinds.js :: SECOND_RING`).
 *   (b) A VENTURE IS NEVER PICKED BESIDE ITS OWN MATERIAL: the birth's count of the houses of a material counts the houses that
 *       keep or yield it (`houseKinds.js :: KEEPS_OR_YIELDS`: r2r-hamlet-27's dairy beside a shepherd, a common pasture and a
 *       stable yard).
 *   (c) A BUYER ON A ROUTE ISOLATED EVEN IN ORDINARY TIMES whose material the land never held tells the owner's fourth story:
 *       the ground of its material used up (the page's Depleted list, a reading), the house idle and marked short
 *       (`houseInputAtHand.js :: neverHeldGroundsUsed`). A material no ground gives (hides, wool) implies none.
 * THE THREE VIEWS (the owner's page, `toPublicSafe`, the share veil) read the grounds alike. Anchors: towns of the census's
 * 720 and the wide read's 150 whose supply story no seat of this round lifts, and constructed records; every seed loop collects
 * its failures; a negative stands beside each positive.
 */
import { describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import * as HI from '../../src/domain/facts/houseInputAtHand.js';
import { BIRTH_PICKS, idOfHouse, impliedGroundsOf, seedPicks, sourceStoryOf } from '../../src/domain/facts/supplyStory.js';
import * as HK from '../../src/domain/facts/houseKinds.js';
import { birthPicksOn } from '../../src/generators/resourceGenerator.js';
import { resourceShortageImport } from '../../src/domain/resourceSemantics.js';
import { rowMarkText } from '../../src/domain/display/crisisStoppedRow.js';
import { liveInstitutions } from '../../src/domain/institutions/institutionRoster.js';
import { toPublicSafe } from '../../src/domain/display/publicSafe.js';
import { projectShareVeil } from '../../src/domain/display/galleryVeil.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

await loadGenerationLawPayloads();

const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'standard' };
/** CENSUS-3 seedcfg.mjs's r2r-, r2s- and bar0- arms, as the supply rule's guard reads them. @param {string} seed */
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
/** @param {unknown} x */
const j = (x) => JSON.stringify(x);

/** The six of the second ring and the grounds of their own kind (`houseKinds.js :: SOURCE_GROUNDS`), written out here. */
const RING = /** @type {Record<string, string[]>} */ ({
  woodcutter_s_camp: ['managed_forest', 'mountain_timber', 'shipbuilding_timber'], shepherd: ['grazing_land', 'alpine_pasture'],
  fisher_s_landing: ['fishing_grounds', 'river_fish'], fishing_community: ['fishing_grounds', 'river_fish'],
  hunter_s_lodge: ['hunting_grounds'], wildfowler: ['marshlands', 'hunting_grounds'],
});
/** @param {any} s @returns {Set<string>} the grounds the record stores, live or spent */
const storedOf = (s) => new Set([...(s.config?.nearbyResources || []), ...(s.config?.nearbyResourcesNative || []), ...(s.config?.nearbyResourcesDepleted || [])].map(String));

/** Towns of the 720 and the 150 holding a taker of the second ring on no stored ground of its own (measured at the base). */
const RING_TOWNS = ['r2r-thorp-0', 'r2r-hamlet-1', 'r2r-hamlet-4', 'r2r-hamlet-18', 'r2r-village-2', 'r2r-village-20', 'r2r-village-36',
  'r2r-village-52', 'r2r-hamlet-56', 'r2s-religious_conversion-village-0', 'bar0-thorp-calm-rand-47', 'bar0-hamlet-under_siege-rand-47'];
/** Towns where a taker of the second ring stands on a stored ground of its own kind (the negative: the record speaks). */
const STORED_RING_TOWNS = ['r2r-thorp-22', 'r2r-thorp-44', 'r2r-hamlet-5', 'r2r-hamlet-12'];
/** Towns of the 720 on a route isolated in ordinary times whose buyers were short of a material no ground gave (at the base). */
const ISOLATED_TOWNS = ['r2r-village-0', 'r2r-village-34', 'r2r-village-43', 'r2r-town-9', 'r2r-town-54', 'r2r-city-20', 'r2r-city-48'];

/**
 * A constructed record: a town of one house (or a few), its grounds and its route. @param {string[]} names @param {string} route
 * @returns {any}
 */
const built = (names, route = 'road') => ({ config: { tradeRouteAccess: route, nearbyResources: [], nearbyResourcesDepleted: [] },
  economicState: { primaryImports: [] }, institutions: names.map((name) => ({ name })) });
/** The first seed `s<n>` whose own hash picks a house the failed venture (`<seed>::abandoned::<id>`). @param {string} id */
const ventureSeedFor = (id) => { for (let n = 0; n < 5000; n++) if (seedPicks(`s${n}`, `abandoned::${id}`, HK.SUPPLY_ODDS.abandoned) === true) return `s${n}`; throw new Error(`no seed picks ${id}`); };
/** The first seed whose own hash leaves a ground there (`<seed>::ground::<ground>`). @param {string} ground @param {boolean} there */
const groundSeedFor = (ground, there) => { for (let n = 0; n < 5000; n++) if (seedPicks(`g${n}`, `ground::${ground}`, HK.SUPPLY_ODDS.groundThere) === there) return `g${n}`; throw new Error(`no seed for ${ground}`); };

describe('FAULTS-BIRTH (a) · the second ring proves its ground as the first does', () => {
  test('every taker of the second ring on no stored ground of its own tells a story: at work on its ground there, or idle and marked short on its ground used up', () => {
    let local = 0, idle = 0;
    expectNoSeedFailures(collectSeedFailures(RING_TOWNS, (seed) => {
      const s = town(seed);
      const stored = storedOf(s); const shown = HI.impliedGroundsOnPage(s); const short = HI.housesShortOf(s);
      /** @type {string[]} */
      const bad = [];
      for (const inst of liveInstitutions(s)) {
        const id = idOfHouse(inst);
        if (!RING[id] || RING[id].some((g) => stored.has(g))) continue;
        const story = sourceStoryOf(s, inst, resourceShortageImport);
        const ground = HK.IMPLIED_GROUND[id];
        if (!story) { bad.push(`${inst.name}: no story (it proves no ground)`); continue; }
        if (story.story === 'local') {
          local++;
          if (!shown.there.includes(ground)) bad.push(`${inst.name}: at work, its ground ${ground} not on the land list`);
          if (short.has(inst.name)) bad.push(`${inst.name}: at work, marked short`);
        } else if (story.story === 'idle') {
          idle++;
          if (story.ground !== ground || !shown.used.includes(ground)) bad.push(`${inst.name}: idle, its ground ${ground} not under Depleted`);
          if (!short.has(inst.name) || !/Short of /.test(rowMarkText(s, 'house', inst) || '')) bad.push(`${inst.name}: idle, not marked short`);
        } else bad.push(`${inst.name}: the story ${story.story}`);
        if (HI.ventureHouseOf(s)?.name === inst.name) bad.push(`${inst.name}: the second ring is no failed venture`);
      }
      if (bad.length) throw new Error(bad.join('; '));
    }), 'the takers of the second ring');
    expect(local, 'second-ring takers at work on a ground they prove (the anchor)').toBeGreaterThanOrEqual(6);
    expect(idle, 'second-ring takers idle on a ground they prove used up (the anchor)').toBeGreaterThanOrEqual(3);
  }, 600_000);

  test('the two towns of the brief: r2r-village-36 and r2s-religious_conversion-village-0 prove the water their landing fishes', () => {
    expectNoSeedFailures(collectSeedFailures(['r2r-village-36', 'r2s-religious_conversion-village-0'], (seed) => {
      const s = town(seed);
      const landing = liveInstitutions(s).find((i) => i.name === "Fisher's landing");
      if (!landing) throw new Error('no landing (the anchor)');
      if (!HI.impliedGroundsOnPage(s).there.includes('fishing_grounds')) throw new Error('the fishing grounds not on the land list');
      if (rowMarkText(s, 'house', landing)) throw new Error(`the landing marked: ${rowMarkText(s, 'house', landing)}`);
      if ((s.resourceAnalysis?.imports?.critical || []).includes('fish')) throw new Error('fish on the need list');
    }), 'the two towns of the brief');
  }, 600_000);

  test('a fact of the record is never unsaid: where the food record names the catch, a seed that would spend the water leaves it there', () => {
    const seed = groundSeedFor('fishing_grounds', false);
    const fed = { ...built(["Fisher's landing"]), economicState: { primaryImports: [], foodSecurity: { foodRecord: { foodSources: ['fish'] } } } };
    expect([...birthPicksOn(fed, seed)[BIRTH_PICKS].grounds], 'the food record names fish: there').toEqual([['fishing_grounds', 'there']]);
    expect([...birthPicksOn(built(["Fisher's landing"]), seed)[BIRTH_PICKS].grounds], 'NEGATIVE: no food record of fish: the seed spends it').toEqual([['fishing_grounds', 'used']]);
  });

  test('NEGATIVE: a taker of the second ring on a stored ground of its own kind proves nothing (the record speaks)', () => {
    let seen = 0;
    expectNoSeedFailures(collectSeedFailures(STORED_RING_TOWNS, (seed) => {
      const s = town(seed); const stored = storedOf(s);
      for (const inst of liveInstitutions(s)) {
        const id = idOfHouse(inst);
        if (!RING[id] || !RING[id].some((g) => stored.has(g))) continue;
        seen++;
        for (const [ground, names] of impliedGroundsOf(s).houses) if (names.includes(inst.name)) throw new Error(`${inst.name} proves ${ground} beside its stored ground`);
      }
    }), 'the takers on a stored ground');
    expect(seen, 'takers of the second ring on a stored ground (the anchor)').toBeGreaterThanOrEqual(4);
  }, 600_000);

  test('and where the town\'s own exports name the ground\'s raw yield ("Furs and pelts": r2r-village-2), the ground is there', () => {
    const seed = groundSeedFor('hunting_grounds', false);
    const lodge = (/** @type {string[]} */ exports) => ({ ...built(["Hunter's lodge"]), economicState: { primaryImports: [], primaryExports: exports } });
    expect([...birthPicksOn(lodge(['Furs and pelts']), seed)[BIRTH_PICKS].grounds], 'the exports name furs: there').toEqual([['hunting_grounds', 'there']]);
    expect([...birthPicksOn(lodge(['Iron tools', 'Preserved foods']), seed)[BIRTH_PICKS].grounds], 'NEGATIVE: no export of its yield: the seed spends it').toEqual([['hunting_grounds', 'used']]);
    const s = town('r2r-village-2');
    expect(rowMarkText(s, 'house', liveInstitutions(s).find((i) => i.name === "Hunter's lodge")), 'r2r-village-2: the lodge at work beside its furs').toBeNull();
  }, 600_000);

  test('constructed: a lone woodcutter proves its wood (there or used up by the seed) and is never the failed venture; a lone charcoal burner can be', () => {
    const there = birthPicksOn(built(["Woodcutter's camp"]), groundSeedFor('managed_forest', true));
    expect([...there[BIRTH_PICKS].grounds], 'the woodcutter proves its wood, there').toEqual([['managed_forest', 'there']]);
    const used = birthPicksOn(built(["Woodcutter's camp"]), groundSeedFor('managed_forest', false));
    expect([...used[BIRTH_PICKS].grounds], 'the woodcutter proves its wood, used up').toEqual([['managed_forest', 'used']]);
    const wood = birthPicksOn(built(["Woodcutter's camp"]), ventureSeedFor('woodcutter_s_camp'));
    expect(wood[BIRTH_PICKS].venture, 'a seed that picks the woodcutter: the second ring is no venture').toBeNull();
    const burner = birthPicksOn(built(['Charcoal burner']), ventureSeedFor('charcoal_burner'));
    expect(burner[BIRTH_PICKS].venture?.id, 'POSITIVE CONTROL: the same rule picks a lone burner').toBe('charcoal_burner');
  });
});

describe('FAULTS-BIRTH (b) · a venture is never picked beside a house that keeps or yields its material', () => {
  test('r2r-hamlet-27 and r2s-politically_fractured-hamlet-0: no dairy fails beside a shepherd, a common pasture or a stable yard', () => {
    expectNoSeedFailures(collectSeedFailures(['r2r-hamlet-27', 'r2s-politically_fractured-hamlet-0'], (seed) => {
      const s = town(seed);
      const v = HI.ventureHouseOf(s);
      if (v) throw new Error(`a failed venture: ${v.name}`);
      const dairy = liveInstitutions(s).find((i) => idOfHouse(i) === 'dairy_farmer');
      if (!dairy) throw new Error('no dairy (the anchor)');
      const st = sourceStoryOf(s, dairy, resourceShortageImport)?.story;
      if (st !== 'local' && st !== 'idle') throw new Error(`the dairy's story ${st}`);
    }), 'the two dairies');
    expect(sourceStoryOf(town('r2r-hamlet-27'), { name: 'Dairy farmer' }, resourceShortageImport)?.story, 'r2r-hamlet-27: the land has it').toBe('local');
  }, 600_000);

  test('NEGATIVE: a failed venture still stands where no house keeps or yields its material (r2r-hamlet-26, r2r-town-13)', () => {
    expect(HI.ventureHouseOf(town('r2r-hamlet-26'))?.name, 'r2r-hamlet-26').toBe('Charcoal burner');
    expect(HI.ventureHouseOf(town('r2r-town-13'))?.name, 'r2r-town-13').toBe('Tanners');
  }, 600_000);

  test('constructed: a lone dairy the seed picks fails; beside a common pasture, a shepherd or a stable yard it does not', () => {
    const seed = ventureSeedFor('dairy_farmer');
    expect(birthPicksOn(built(['Dairy farmer']), seed)[BIRTH_PICKS].venture?.id, 'POSITIVE CONTROL: a lone dairy').toBe('dairy_farmer');
    for (const keeper of ['Common grazing land', 'Stable yard']) {
      expect(birthPicksOn(built(['Dairy farmer', keeper]), seed)[BIRTH_PICKS].venture, `a dairy beside ${keeper}`).toBeNull();
    }
    expect(birthPicksOn(built(['Dairy farmer', 'Shepherd']), seed)[BIRTH_PICKS].venture, 'a dairy beside a shepherd').toBeNull();
    const tannerSeed = ventureSeedFor('tanner_established');
    expect(birthPicksOn(built(['Tanner (established)']), tannerSeed)[BIRTH_PICKS].venture?.id, 'POSITIVE CONTROL: a lone tanner').toBe('tanner_established');
    expect(birthPicksOn(built(['Tanner (established)', "Hunter's lodge"]), tannerSeed)[BIRTH_PICKS].venture, 'a tanner beside a lodge that sells pelts').toBeNull();
  });
});

describe('FAULTS-BIRTH (c) · an isolated buyer of a material the land never held tells the fourth story', () => {
  test('on a route isolated in ordinary times, every short buyer of a material a ground gives has that ground under Depleted; the house stays marked short', () => {
    let told = 0;
    expectNoSeedFailures(collectSeedFailures(ISOLATED_TOWNS, (seed) => {
      const s = town(seed);
      if (HI.ventureHouseOf(s)) throw new Error('a venture in an anchor town');
      const shown = HI.impliedGroundsOnPage(s); const short = HI.housesShortOf(s); const spent = HI.housesOnSpentGround(s);
      const depleted = new Set([...(s.config?.nearbyResourcesDepleted || []), ...shown.used]);
      /** @type {string[]} */
      const bad = [];
      for (const inst of liveInstitutions(s)) {
        const id = idOfHouse(inst); const fam = HK.MATERIAL_OF[id];
        if (!HK.BUYS_AND_WORKS.has(id) || !fam || !short.has(inst.name) || spent.has(inst.name)) continue;
        const ground = { ironOre: 'iron_deposits', clay: 'river_clay', timber: 'managed_forest', sand: 'glass_sand', grapes: 'vineyards', herbs: 'foraging_areas', grain: 'grain_fields', fish: 'fishing_grounds', livestock: 'grazing_land', stone: 'stone_quarry' }[fam];
        if (!ground) continue; // hides, wool: no ground gives them
        told++;
        const groundsOf = [...depleted].filter((g) => ({ iron_deposits: 'ironOre', river_clay: 'clay', managed_forest: 'timber', mountain_timber: 'timber', glass_sand: 'sand', vineyards: 'grapes', foraging_areas: 'herbs', grain_fields: 'grain', fertile_floodplain: 'grain', fishing_grounds: 'fish', river_fish: 'fish', grazing_land: 'livestock', stone_quarry: 'stone' })[g] === fam);
        if (!groundsOf.length) bad.push(`${inst.name}: short of ${short.get(inst.name)}, no ground of it under Depleted`);
        if (!/Short of /.test(rowMarkText(s, 'house', inst) || '')) bad.push(`${inst.name}: not marked short`);
      }
      if (bad.length) throw new Error(bad.join('; '));
    }), 'the isolated buyers');
    expect(told, 'isolated buyers of a material a ground gives (the anchor)').toBeGreaterThanOrEqual(10);
  }, 600_000);

  test('NEGATIVE: hides and wool imply no ground; a town on a connected road implies none for its buyers', () => {
    const tanner = { ...built(['Tanner (established)', 'Blacksmith'], 'isolated'), resourceAnalysis: { gaps: [
      { institution: 'Tanner (established)', chain: 'animal hides', kind: 'missing', impact: 'x' },
      { institution: 'Blacksmith', chain: 'iron ore', kind: 'missing', impact: 'x' }] } };
    expect(HI.housesShortOf(tanner).has('Blacksmith'), 'the constructed smith is short (the anchor)').toBe(true);
    expect(HI.impliedGroundsOnPage(tanner).used, 'POSITIVE: the isolated smith reads its iron used up; the tanner nothing').toEqual(['iron_deposits']);
    const road = { ...tanner, config: { ...tanner.config, tradeRouteAccess: 'road' } };
    expect(HI.impliedGroundsOnPage(road).used, 'on a connected road: no ground implied for a buyer').toEqual([]);
  });

  test('the three views read the grounds alike in every anchor town', () => {
    expectNoSeedFailures(collectSeedFailures([...RING_TOWNS, ...ISOLATED_TOWNS], (seed) => {
      const s = town(seed);
      const a = j(HI.impliedGroundsOnPage(s));
      const pub = toPublicSafe(structuredClone(s));
      if (j(HI.impliedGroundsOnPage(pub)) !== a) throw new Error(`the public view: ${j(HI.impliedGroundsOnPage(pub))} against ${a}`);
      const veil = projectShareVeil(toPublicSafe(structuredClone(s)), null);
      if (j(HI.impliedGroundsOnPage(veil)) !== a) throw new Error(`the share veil: ${j(HI.impliedGroundsOnPage(veil))} against ${a}`);
    }), 'the three views');
  }, 600_000);
});
