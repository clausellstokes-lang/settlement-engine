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
import { BIRTH_PICKS, groundOfFamily, idOfHouse, impliedGroundsOf, seedPicks, sourceStoryOf } from '../../src/domain/facts/supplyStory.js';
import * as HK from '../../src/domain/facts/houseKinds.js';
import { birthPicksOn } from '../../src/generators/resourceGenerator.js';
import { resourceShortageImport } from '../../src/domain/resourceSemantics.js';
import { rowMarkText } from '../../src/domain/display/crisisStoppedRow.js';
import { liveInstitutions } from '../../src/domain/institutions/institutionRoster.js';
import { toPublicSafe } from '../../src/domain/display/publicSafe.js';
import { projectShareVeil } from '../../src/domain/display/galleryVeil.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { chainCarrierOf } from '../../src/domain/facts/chainCarrier.js';
import { resourceGapLines } from '../../src/domain/display/validationOnPage.js';

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

const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const CRISES = ['famine', 'indebted', 'infiltrated', 'insurgency', 'mass_migration', 'monster_pressure', 'occupied', 'plague_onset',
  'politically_fractured', 'recently_betrayed', 'religious_conversion', 'slave_revolt', 'succession_void', 'under_siege', 'wartime'];
/** The census's 720. */
const CENSUS = [
  ...SIZES.flatMap((size) => Array.from({ length: 60 }, (_, i) => `r2r-${size}-${i}`)),
  ...CRISES.flatMap((c) => SIZES.flatMap((size) => Array.from({ length: 4 }, (_, i) => `r2s-${c}-${size}-${i}`))),
];

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

  test('FR21 (4): an export proves no implied ground: the page reads the chain that carries it as transit', () => {
    const seed = groundSeedFor('hunting_grounds', false);
    const lodge = (/** @type {string[]} */ exports) => ({ ...built(["Hunter's lodge"]), economicState: { primaryImports: [], primaryExports: exports } });
    expect([...birthPicksOn(lodge(['Furs and pelts']), seed)[BIRTH_PICKS].grounds], 'an exported "Furs and pelts": the seed still spends the ground').toEqual([['hunting_grounds', 'used']]);
    expect([...birthPicksOn(lodge([]), groundSeedFor('hunting_grounds', true))[BIRTH_PICKS].grounds], 'POSITIVE CONTROL: a seed that leaves it there').toEqual([['hunting_grounds', 'there']]);
    const s = town('r2r-village-2');
    const furs = (s.economicState?.activeChains || []).find((/** @type {any} */ c) => (c.outputs || []).includes('Furs and pelts'));
    expect(chainCarrierOf(furs, s).kind, 'r2r-village-2: the furs chain runs on passing trade').toBe('transit');
    expect(HI.impliedGroundsOnPage(s).used, 'r2r-village-2: the lodge\'s hunting grounds read used up').toContain('hunting_grounds');
  }, 600_000);

  test('FR21 (4b): over the census\'s 720, no chain\'s own ground is a ground a house implies (the page\'s reader of a carrier)', () => {
    let implied = 0;
    expectNoSeedFailures(collectSeedFailures(CENSUS, (seed) => {
      const s = town(seed);
      for (const ground of impliedGroundsOf(s).states.keys()) {
        implied++;
        for (const c of (s.economicState?.activeChains || [])) if (c?.resourceKey === ground && chainCarrierOf(c, s).kind === 'own') throw new Error(`${c.label} carries ${ground} as its own`);
      }
    }), 'the census');
    expect(implied, 'implied grounds read (the anchor)').toBeGreaterThan(200);
  }, 1_800_000);

  test('FR21 (3): on a river the fishing grounds a landing proves give fish and no salt; on the sea they give salt', () => {
    expectNoSeedFailures(collectSeedFailures(['r2r-village-38', 'r2r-village-39', 'r2s-under_siege-village-3', 'r2s-indebted-village-0', 'r2r-hamlet-18', 'r2s-religious_conversion-village-0'], (seed) => {
      const s = town(seed);
      if (!HI.impliedGroundsOnPage(s).there.includes('fishing_grounds')) throw new Error('no proven fishing grounds (the anchor)');
      const works = liveInstitutions(s).find((i) => i.name === 'Salt works');
      if (!works) throw new Error('no salt works (the anchor)');
      const reach = HI.houseInputAtHand(s, 'desertSalt', works, { rawResource: 'desert_salt' });
      if (reach === 'local') throw new Error('the salt works reads its salt local off a river');
      if (!(s.resourceAnalysis?.imports?.critical || []).includes('desert_salt')) throw new Error('desert salt off the need list');
    }), 'the six river towns');
    const river = { config: { terrainType: 'plains', tradeRouteAccess: 'river' } };
    const sea = { config: { terrainType: 'coastal', tradeRouteAccess: 'port' } };
    expect(HI.impliedGroundGoods(river, 'fishing_grounds'), 'a river: fish, no salt').toEqual(['fishing_grounds', 'fish']);
    expect(HI.impliedGroundGoods(sea, 'fishing_grounds'), 'NEGATIVE: the sea gives salt').toEqual(['fishing_grounds', 'fish', 'salt']);
  }, 600_000);

  test('FR21 (2): where a Common grazing land stands, the pick does not spend the pasture (the twelve towns of the 720)', () => {
    const TWELVE = ['r2r-hamlet-52', 'r2r-hamlet-56', 'r2r-village-32', 'r2r-village-46', 'r2r-village-47', 'r2s-under_siege-hamlet-3',
      'r2s-occupied-village-1', 'r2s-politically_fractured-hamlet-0', 'r2s-indebted-hamlet-2', 'r2s-succession_void-hamlet-0',
      'r2s-monster_pressure-hamlet-3', 'r2s-mass_migration-hamlet-1'];
    expectNoSeedFailures(collectSeedFailures(TWELVE, (seed) => {
      const s = town(seed);
      if (!liveInstitutions(s).some((i) => i.name === 'Common grazing land')) throw new Error('no common (the anchor)');
      const shown = HI.impliedGroundsOnPage(s);
      if (!shown.there.includes('grazing_land') || shown.used.includes('grazing_land')) throw new Error(`the pasture: ${JSON.stringify(shown)}`);
      for (const i of liveInstitutions(s)) if (/^(Dairy farmer|Shepherd)$/.test(i.name) && /Short of /.test(rowMarkText(s, 'house', i) || '')) throw new Error(`${i.name} marked short beside the common`);
    }), 'the twelve towns');
    const seed = groundSeedFor('grazing_land', false);
    // a dairy beside a shepherd is never a venture (FR8 (b)): the pair reads the pick alone
    expect([...birthPicksOn(built(['Dairy farmer', 'Shepherd', 'Common grazing land']), seed)[BIRTH_PICKS].grounds], 'beside the common: the pasture there').toEqual([['grazing_land', 'there']]);
    expect([...birthPicksOn(built(['Dairy farmer', 'Shepherd']), seed)[BIRTH_PICKS].grounds], 'NEGATIVE: no common: the seed spends it').toEqual([['grazing_land', 'used']]);
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

  // FR21 (1) (2026-11-18): the negative this test held (hides and wool imply no ground) is untrue by the chair's ruling; it is
  // turned into the positive, and the negative is the luxury trade, whose goods no ground gives
  test('FR21 (1): an isolated tanner reads its hunting grounds used up, a fuller its pasture; the luxury trade and a connected road imply none', () => {
    const tanner = { ...built(['Tanner (established)', 'Blacksmith', 'Fuller'], 'isolated'), resourceAnalysis: { gaps: [
      { institution: 'Tanner (established)', chain: 'animal hides', kind: 'missing', impact: 'x' },
      { institution: 'Fuller', chain: 'wool', kind: 'missing', impact: 'x' },
      { institution: 'Blacksmith', chain: 'iron ore', kind: 'missing', impact: 'x' }] } };
    expect(HI.housesShortOf(tanner).has('Tanner (established)'), 'the constructed tanner is short (the anchor)').toBe(true);
    expect(HI.impliedGroundsOnPage(tanner).used, 'the smith\'s iron, the tanner\'s hunting grounds, the fuller\'s pasture').toEqual(['grazing_land', 'hunting_grounds', 'iron_deposits']);
    expect(groundOfFamily('luxury'), 'NEGATIVE: the luxury trade has no ground').toBe('');
    const road = { ...tanner, config: { ...tanner.config, tradeRouteAccess: 'road' } };
    expect(HI.impliedGroundsOnPage(road).used, 'NEGATIVE: on a connected road: no ground implied for a buyer').toEqual([]);
  });

  test('FR21 (1): every house the page marks short of hides or wool stands beside a used-up ground of its material (towns of the 720 and the 150)', () => {
    const TOWNS = ['r2r-village-23', 'r2r-town-54', 'r2r-city-45', 'r2r-city-48', 'r2r-city-49', 'r2r-city-51', 'r2r-metropolis-9', 'r2r-metropolis-12',
      'r2r-metropolis-38', 'r2r-metropolis-44', 'r2s-politically_fractured-town-2', 'r2s-indebted-town-3', 'r2s-mass_migration-town-2', 'bar0-town-calm-rand-29', 'bar0-city-wartime-rand-37'];
    const GIVES = /** @type {Record<string, string[]>} */ ({ hides: ['hunting_grounds'], wool: ['grazing_land', 'alpine_pasture'] });
    let seen = 0;
    expectNoSeedFailures(collectSeedFailures(TOWNS, (seed) => {
      const s = town(seed);
      const depleted = new Set([...(s.config?.nearbyResourcesDepleted || []), ...HI.impliedGroundsOnPage(s).used]);
      for (const i of liveInstitutions(s)) {
        const m = /Short of (?:livestock or )?(hides|wool)\./.exec(rowMarkText(s, 'house', i) || '');
        if (!m) continue;
        seen++;
        if (!GIVES[m[1]].some((g) => depleted.has(g))) throw new Error(`${i.name}: short of ${m[1]}, no ground of it under Depleted`);
      }
    }), 'the hides and wool towns');
    expect(seen, 'houses short of hides or wool (the anchor)').toBeGreaterThanOrEqual(25);
  }, 600_000);

  test('FR21 (1): on a connected road beside a spent pasture whose word names no wool, the seed buys or refuses "Wool" itself', () => {
    expectNoSeedFailures(collectSeedFailures(['r2r-metropolis-4', 'r2r-metropolis-20'], (seed) => {
      const s = town(seed);
      if (!(s.config?.nearbyResourcesDepleted || []).includes('grazing_land')) throw new Error('no spent pasture (the anchor)');
      if (!(s.economicState?.primaryImports || []).includes('Wool')) throw new Error('"Wool" not bought');
      for (const i of liveInstitutions(s)) if (/^(Fuller|Weavers\/Textile workers)$/.test(i.name) && HI.housesShortOf(s).has(i.name)) throw new Error(`${i.name} short of wool`);
    }), 'the wool bought');
    const s = town('r2r-city-45');
    expect((s.economicState?.primaryImports || []).includes('Wool'), 'NEGATIVE: r2r-city-45, the seed refuses: no "Wool"').toBe(false);
    expect(HI.housesShortOf(s).get('Fuller'), 'r2r-city-45: the fuller idle, short of wool').toBe('wool');
  }, 600_000);

  test('FR23 (2): a Common grazing land whose pasture the record stores spent reads as every house on a spent ground of its own', () => {
    const EIGHT = ['r2r-hamlet-53', 'r2r-village-15', 'r2r-village-20', 'r2r-village-49', 'r2s-infiltrated-village-0', 'r2s-plague_onset-village-1',
      'r2s-succession_void-hamlet-3', 'r2s-monster_pressure-village-2'];
    expectNoSeedFailures(collectSeedFailures([...EIGHT, 'r2r-hamlet-42', 'r2s-recently_betrayed-hamlet-2'], (seed) => {
      const s = town(seed);
      const common = liveInstitutions(s).find((i) => i.name === 'Common grazing land');
      if (!common) throw new Error('no common (the anchor)');
      if (!(s.config?.nearbyResourcesDepleted || []).some((/** @type {string} */ g) => g === 'grazing_land' || g === 'alpine_pasture')) throw new Error('no stored spent pasture (the anchor)');
      if (rowMarkText(s, 'house', common) !== 'Short of livestock.') throw new Error(`the common's mark: ${rowMarkText(s, 'house', common)}`);
      if (!resourceGapLines(s).some((/** @type {{ impact: string }} */ l) => /^The common grazing land is worked out: its own ground is depleted \(/.test(l.impact))) throw new Error('no worked-out line');
    }), 'the commons on a stored spent pasture');
    expectNoSeedFailures(collectSeedFailures(['r2r-hamlet-15', 'r2r-hamlet-22', 'r2r-village-4'], (seed) => {
      const s = town(seed);
      const common = liveInstitutions(s).find((i) => i.name === 'Common grazing land');
      if (!common || !(s.config?.nearbyResources || []).includes('grazing_land')) throw new Error('no common on a live pasture (the anchor)');
      if (rowMarkText(s, 'house', common)) throw new Error(`NEGATIVE: a common on its live pasture is marked: ${rowMarkText(s, 'house', common)}`);
    }), 'the commons on a live pasture');
  }, 600_000);

  test('FR24 (2): the common proves its pasture for every reader: r2r-village-23 one story; an isolated fuller beside a common is fed', () => {
    const s = town('r2r-village-23');
    expect(HI.impliedGroundsOnPage(s).there, 'r2r-village-23: the pasture proven').toContain('grazing_land');
    expectAbsentWithAnchor(HI.impliedGroundsOnPage(s).used, 'grazing_land', 'iron_deposits', 'r2r-village-23: no pasture under Depleted, its smith\'s iron still there');
    expect(HI.housesShortOf(s).has('Fuller'), 'r2r-village-23: the Fuller at work').toBe(false);
    const fuller = { ...built(['Fuller', 'Common grazing land'], 'isolated'), resourceAnalysis: { gaps: [{ institution: 'Fuller', chain: 'wool', kind: 'missing', impact: 'x' }] } };
    const picked = birthPicksOn(fuller, groundSeedFor('grazing_land', false));
    expect([...picked[BIRTH_PICKS].grounds], 'the common proves its pasture, there whatever the seed').toEqual([['grazing_land', 'there']]);
    const lone = { ...built(['Fuller'], 'isolated'), resourceAnalysis: { gaps: [{ institution: 'Fuller', chain: 'wool', kind: 'missing', impact: 'x' }] } };
    expect(HI.impliedGroundsOnPage(lone).used, 'NEGATIVE: no common: the isolated fuller reads its pasture used up').toEqual(['grazing_land']);
  }, 600_000);

  test('FR24 (2) over the census\'s 720: a proven pasture stands with a proving house (a common among them where no herder proves it), never under Depleted; no house short of livestock, wool or hides stands beside no used-up ground of it', () => {
    /** @type {string[]} */
    const bad = []; let proven = 0, short = 0;
    expectNoSeedFailures(collectSeedFailures(CENSUS, (seed) => {
      const s = town(seed);
      const page = HI.impliedGroundsOnPage(s);
      const depleted = new Set([...(s.config?.nearbyResourcesDepleted || []), ...page.used]);
      for (const g of page.there) if (depleted.has(g)) bad.push(`${seed}: ${g} proven and Depleted`);
      if (page.there.includes('grazing_land')) { proven++; if (!(impliedGroundsOf(s).houses.get('grazing_land') || []).length) bad.push(`${seed}: a proven pasture with no proving house`); }
      const v = HI.ventureHouseOf(s);
      for (const [name, noun] of HI.housesShortOf(s)) {
        const fams = ['livestock', 'wool', 'hides'].filter((k) => new RegExp(`\\b${k}\\b`).test(noun));
        if (!fams.length || v?.name === name) continue;
        short++;
        const gives = { livestock: ['grazing_land', 'alpine_pasture'], wool: ['grazing_land', 'alpine_pasture'], hides: ['hunting_grounds', 'grazing_land', 'alpine_pasture'] };
        if (!fams.some((k) => gives[/** @type {'livestock'|'wool'|'hides'} */ (k)].some((g) => depleted.has(g)))) bad.push(`${seed}: ${name} short of ${noun}, no ground of it used up`);
      }
    }), 'the census');
    expect(bad).toEqual([]);
    expect(proven, 'towns with a proven pasture (the anchor)').toBeGreaterThan(150);
    expect(short, 'houses short of livestock, wool or hides (the anchor)').toBeGreaterThan(40);
  }, 1_800_000);

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
