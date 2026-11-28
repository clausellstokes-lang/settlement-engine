/**
 * desertWithholdsHouses.test.js — B1(i), THE LAND AND WHAT STANDS ON IT (CLOSE-7; the tenth chair's RULING-R24 R24-B1(i) and
 * R24b, 2026-11-24). The desert withholds fish, timber and game (`TERRAIN_DATA.desert.withholds`); a house that lives on one
 * (`livesOn`: Fish market, Fishmonger, Sawmill, Sawmill (commercial), Charcoal burner, Woodcutter's camp, Hunter's lodge) is
 * not taken there unless the route or a native nearby resource gives the thing (`LAND_GIVERS`). One function answers it
 * (domain/landWithholding.js :: landWithholdsHouse); the draw, the cascade and the faction boost ask it after their own draw.
 *
 * RED FIRST (the lit tree d447ee31e): the named desert births of the visitor 900 (`close-7/read24/visitor/b1i-hits.tsv`,
 * `close-7/read25/V/b1i-hits.tsv`) each hold a withheld house there, drawn (`generated`) or cascaded (`cascade`); the
 * positive control dp-village-129 keeps its Hunter's lodge beside hunting_grounds before and after.
 *
 * B1(i)c (CLOSE-10; the tenth chair's G52 and G60): THE FURRIER'S DISTRICT STANDS WHERE FURS REACH THE PLACE: its own hunting
 * grounds (spent or not) or an entrepot route (`tradeRouteSemantics.js :: routeMakesEntrepot`, the home `tradeGoods.js ::
 * deriveIsEntrepot` reads). The Hunter's lodge keeps game. RED FIRST (the line 9d22f040e): the named desert road cities and
 * metropolises of the visitor 900 with no hunting grounds held the district (V: 10 of the 15 desert districts); the positive
 * controls keep it before and after (dp-metropolis-19, a crossroads entrepot; dp-metropolis-30, spent hunting grounds); a
 * district the user FORCES stands (dp-city-20).
 *
 * B1(i)c-2 (CLOSE-11; the tenth chair's G67): FURS COME BY SEA: the PORT route gives furs (`LAND_GIVERS.furs.routes`), beside
 * the entrepot route. RED FIRST (19a5855f3): desert port cities and metropolises born with the port forced (the plan
 * `dpp-<size>-<i>`: the visitor's config with `terrainOverride: 'desert'`, `tradeRouteAccess: 'port'`) print
 * `isEntrepot: true` and lost the district they held at the line (measured: 90 of 120, every one an entrepot).
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { liveInstitutions } from '../../src/domain/institutions/institutionRoster.js';
import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';

/** the visitor's birth (close-7/read24/make-visitor-plan.mjs: each size's row of the chair's plan-lit.json) @param {string} seed */
const visitor = (seed) => {
  const size = String(seed.split('-')[1]);
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size, _randomizePriorities: true }), null, { seed, customContent: {} });
};
/** the named desert births and the withheld houses each held at the lit tree (source in brackets) */
const NAMED = {
  'dp-town-39': ['Fish market', "Hunter's lodge"], // generated, generated
  'dp-city-20': ['Fish market', 'Sawmill (commercial)'], // generated, generated
  'dp-village-67': ['Fish market'], // cascade
  'dp-town-118': ['Fish market', "Hunter's lodge"], // generated, cascade
  'dp-hamlet-136': ["Hunter's lodge"], // generated
};
const WITHHELD_IN_DESERT = ['Fish market', 'Fishmonger', 'Sawmill', 'Sawmill (commercial)', 'Charcoal burner', "Woodcutter's camp", "Hunter's lodge", "Furrier's district"];
const FURRIER = "Furrier's district";
/** B1(i)c: the visitor 900's desert road cities and metropolises with no hunting grounds that held a Furrier's district at the line */
const NAMED_FURRIER = ['dp-city-20', 'dp-city-54', 'dp-city-55', 'dp-city-65', 'dp-city-77', 'dp-city-113', 'dp-city-127', 'dp-city-149', 'dp-metropolis-90', 'dp-metropolis-93'];
/** B1(i)c's positive controls: furs reach these places (an entrepot route; spent hunting grounds) */
const FURS_REACH = { 'dp-metropolis-19': 'crossroads', 'dp-metropolis-98': 'crossroads', 'dp-metropolis-143': 'crossroads', 'dp-metropolis-30': 'spent grounds', 'dp-metropolis-117': 'spent grounds' };

/** B1(i)c-2: desert port cities and metropolises (port forced) that held the district at the line, each printing isEntrepot */
const NAMED_PORT = ['dpp-city-1', 'dpp-city-4', 'dpp-city-5', 'dpp-metropolis-0'];
/** the desert-port birth (the visitor's config, the land and the route forced) @param {string} seed */
const desertPort = (seed) => {
  const size = String(seed.split('-')[1]);
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size, _randomizePriorities: true, terrainOverride: 'desert', tradeRouteAccess: 'port' }), null, { seed, customContent: {} });
};

/** @type {Record<string, any>} */ const born = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of [...Object.keys(NAMED), 'dp-village-129', ...NAMED_FURRIER, ...Object.keys(FURS_REACH)]) born[seed] = visitor(seed);
  for (const seed of NAMED_PORT) born[seed] = desertPort(seed);
  const forced = { ...DEFAULT_CONFIG, settType: 'city', _randomizePriorities: true, _institutionToggles: { "city::Economy::Furrier's district": { allow: true, require: true } } };
  born['forced:dp-city-20'] = generateSettlementPipeline(birthConfig(forced), null, { seed: 'dp-city-20', customContent: {} });
}, 300000);

const liveNames = (/** @type {any} */ s) => liveInstitutions(s).map((i) => String(i?.name || ''));

describe('B1(i): the desert does not stand a house that lives on what it withholds', () => {
  for (const [seed, houses] of Object.entries(NAMED)) {
    test(`${seed}: desert, and none of ${houses.join(', ')} stands`, () => {
      const s = born[seed];
      expect(s.config.terrainType).toBe('desert');
      expect(liveNames(s).filter((n) => houses.includes(n))).toEqual([]);
    });
  }
  test('POSITIVE CONTROL dp-village-129: desert beside hunting_grounds keeps its Hunter\'s lodge (the resource gives game)', () => {
    const s = born['dp-village-129'];
    expect(s.config.terrainType).toBe('desert');
    expect(s.config.nearbyResources).toContain('hunting_grounds');
    expect(liveNames(s)).toContain("Hunter's lodge");
  });
});

describe('B1(i)c: the Furrier\'s district stands where furs reach the place', () => {
  for (const seed of NAMED_FURRIER) {
    test(`${seed}: a desert road place with no hunting grounds stands no Furrier's district`, () => {
      const s = born[seed];
      expect([s.config.terrainType, s.config.tradeRouteAccess]).toEqual(['desert', 'road']);
      expect(s.config.nearbyResources.length).toBeGreaterThan(0);
      expect(s.config.nearbyResources.includes('hunting_grounds')).toBe(false);
      expect(liveNames(s).length).toBeGreaterThan(40);
      expect(liveNames(s).includes(FURRIER)).toBe(false);
    });
  }
  for (const [seed, why] of Object.entries(FURS_REACH)) {
    test(`POSITIVE CONTROL ${seed}: furs reach it (${why}) and its Furrier's district stands`, () => {
      const s = born[seed];
      expect(s.config.terrainType).toBe('desert');
      expect(why === 'crossroads' ? s.config.tradeRouteAccess === 'crossroads' && s.economicState.isEntrepot === true : s.config.nearbyResourcesDepleted.includes('hunting_grounds')).toBe(true); // the page's own entrepot flag; the spent grounds the draw sees
      expect(liveNames(s)).toContain(FURRIER);
    });
  }
  for (const seed of NAMED_PORT) {
    test(`B1(i)c-2 ${seed}: a desert port prints itself an entrepot, and furs come by sea: its Furrier's district stands`, () => {
      const s = born[seed];
      expect([s.config.terrainType, s.config.tradeRouteAccess, s.config.nearbyResources.includes('hunting_grounds')]).toEqual(['desert', 'port', false]);
      expect(s.economicState.isEntrepot).toBe(true); // the page's own entrepot flag
      expect(liveNames(s)).toContain(FURRIER);
    });
  }
  test('a district the USER forces stands, whatever the land (dp-city-20, the same seed, forced)', () => {
    const s = born['forced:dp-city-20'];
    expect([s.config.terrainType, s.config.nearbyResources.includes('hunting_grounds')]).toEqual(['desert', false]);
    expect(liveInstitutions(s).filter((i) => i?.name === FURRIER).map((i) => i.source)).toEqual(['forced']);
  });
});

describe('B1(i): one function, declared as data', () => {
  test('the desert withholds fish, timber and game; each of the seven houses lives on one; no other terrain withholds', async () => {
    const { landWithholdsHouse } = await import('../../src/domain/landWithholding.js');
    const desert = { terrainType: 'desert', tradeRoute: 'desert_road', nearbyResources: ['oasis_water', 'date_palms'] };
    for (const name of WITHHELD_IN_DESERT) expect({ name, held: landWithholdsHouse(desert, name) }).toEqual({ name, held: true });
    for (const name of ['Potter', 'Brickmaker', 'Salt works', 'Caravanserai']) expect({ name, held: landWithholdsHouse(desert, name) }).toEqual({ name, held: false });
    // B1(i)c: furs are given by hunting grounds or an entrepot route; game by hunting grounds alone (the lodge keeps its rule)
    const crossroads = { ...desert, tradeRoute: 'crossroads' };
    expect([landWithholdsHouse(crossroads, FURRIER), landWithholdsHouse(crossroads, "Hunter's lodge")]).toEqual([false, true]);
    const grounds = { ...desert, nearbyResources: ['hunting_grounds'] };
    expect([landWithholdsHouse(grounds, FURRIER), landWithholdsHouse(grounds, "Hunter's lodge")]).toEqual([false, false]);
    // B1(i)c-2: a port gives furs (by sea) and not game; a river, a road or an isolated place gives neither
    expect([landWithholdsHouse({ ...desert, tradeRoute: 'port' }, FURRIER), landWithholdsHouse({ ...desert, tradeRoute: 'port' }, "Hunter's lodge")]).toEqual([false, true]);
    for (const tradeRoute of ['river', 'road', 'isolated', 'mountain_pass']) expect({ tradeRoute, held: landWithholdsHouse({ ...desert, tradeRoute }, FURRIER) }).toEqual({ tradeRoute, held: true });
    for (const terrainType of ['plains', 'hills', 'mountain', 'forest', 'coastal', 'riverside']) {
      for (const name of WITHHELD_IN_DESERT) expect(landWithholdsHouse({ terrainType, tradeRoute: 'road', nearbyResources: [] }, name)).toBe(false);
    }
  });
  test('the givers: a port or river route, fishing_grounds or river_fish give fish; managed_forest, shipbuilding_timber or mountain_timber give timber; hunting_grounds gives game; an oasis gives no fish', async () => {
    const { landWithholdsHouse } = await import('../../src/domain/landWithholding.js');
    const at = (/** @type {string} */ tradeRoute, /** @type {string[]} */ nearbyResources) => ({ terrainType: 'desert', tradeRoute, nearbyResources });
    expect(landWithholdsHouse(at('port', []), 'Fish market')).toBe(false);
    expect(landWithholdsHouse(at('river', []), 'Fishmonger')).toBe(false);
    expect(landWithholdsHouse(at('desert_road', ['fishing_grounds']), 'Fish market')).toBe(false);
    expect(landWithholdsHouse(at('desert_road', ['river_fish']), 'Fish market')).toBe(false);
    expect(landWithholdsHouse(at('desert_road', ['oasis_water']), 'Fish market')).toBe(true);
    for (const r of ['managed_forest', 'shipbuilding_timber', 'mountain_timber']) expect(landWithholdsHouse(at('desert_road', [r]), 'Sawmill (commercial)')).toBe(false);
    expect(landWithholdsHouse(at('port', []), 'Charcoal burner')).toBe(true);
    expect(landWithholdsHouse(at('desert_road', ['hunting_grounds']), "Hunter's lodge")).toBe(false);
    expect(landWithholdsHouse(at('desert_road', ['managed_forest']), "Hunter's lodge")).toBe(true);
  });
  test('a custom or DM-authored house of the same name lives on nothing the land withholds', async () => {
    const { landWithholdsHouse } = await import('../../src/domain/landWithholding.js');
    const desert = { terrainType: 'desert', tradeRoute: 'desert_road', nearbyResources: [] };
    expect(landWithholdsHouse(desert, { name: 'Fish market', isCustom: true })).toBe(false);
    expect(landWithholdsHouse(desert, { name: 'Fish market', source: 'custom' })).toBe(false);
    expect(landWithholdsHouse(desert, { name: 'Fish market', source: 'generated' })).toBe(true);
  });
  test('`livesOn` is registry-only: no catalogue row carries it, so no save does', () => {
    for (const block of Object.values(institutionalCatalog)) for (const shelf of Object.values(block)) for (const row of Object.values(shelf)) expect(Object.hasOwn(row, 'livesOn')).toBe(false);
  });
});
