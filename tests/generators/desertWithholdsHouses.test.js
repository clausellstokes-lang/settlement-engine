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
const WITHHELD_IN_DESERT = ['Fish market', 'Fishmonger', 'Sawmill', 'Sawmill (commercial)', 'Charcoal burner', "Woodcutter's camp", "Hunter's lodge"];

/** @type {Record<string, any>} */ const born = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of [...Object.keys(NAMED), 'dp-village-129']) born[seed] = visitor(seed);
}, 120000);

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

describe('B1(i): one function, declared as data', () => {
  test('the desert withholds fish, timber and game; each of the seven houses lives on one; no other terrain withholds', async () => {
    const { landWithholdsHouse } = await import('../../src/domain/landWithholding.js');
    const desert = { terrainType: 'desert', tradeRoute: 'desert_road', nearbyResources: ['oasis_water', 'date_palms'] };
    for (const name of WITHHELD_IN_DESERT) expect({ name, held: landWithholdsHouse(desert, name) }).toEqual({ name, held: true });
    for (const name of ["Furrier's district", 'Potter', 'Brickmaker', 'Salt works', 'Caravanserai']) expect({ name, held: landWithholdsHouse(desert, name) }).toEqual({ name, held: false });
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
