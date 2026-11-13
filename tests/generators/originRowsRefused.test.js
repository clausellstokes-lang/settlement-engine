/**
 * tests/generators/originRowsRefused.test.js — R2-CODE-A-4, round three's #154 and the increment's HIGH #ww-1227
 * (`settlementOriginProse.js :: ORIGIN_POOLS`, stored as `settlementReason` by `narrativeGenerator.js ::
 * generateSettlementReason` and printed by the Overview's "Settlement Origin"):
 * - #ww-1227, rww-village-under_siege-1: "Established along a road route. Trade flows in, goods flow out, people pass
 *   through." under a siege, where the same page says nothing comes in by road.
 * - #154, rr2s-hamlet-under_siege-rand-1: "A road settlement: it makes its living from other people's journeys, in
 *   stabling and meals and small repairs." under a siege, in a hamlet that lives on its rents.
 * RULED (the chair, 20:33 and 21:14): the present-traffic rows are refused under a siege; the journeys row also below an
 * inn or a tavern and at a city's size; a refused row resolves draw-free to the next admitted one. The crossroads rows
 * of present traffic ("trade comes in on every road", "two busy roads", "every road brings it trade") carry the siege
 * condition too (record 386 (2): a twin carries every condition its siblings carry).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { ORIGIN_POOLS, selectOriginBody } from '../../src/generators/narrative/settlementOriginProse.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const SEEDS = Array.from({ length: 200 }, (_, i) => `origin-rows-${i}`);
/** @param {object} state */
const bodiesOver = (state) => new Set(SEEDS.map((seed) => selectOriginBody({ ...state, seed })));

describe('the founding rows a siege, the size or the roster refuses', () => {
  it('under a siege no road or crossroads row of present traffic is said', () => {
    const road = bodiesOver({ route: 'road', siege: true, tier: 'village', hasTravellerHouse: true });
    for (const i of [0, 2, 3]) expect(road.has(ORIGIN_POOLS.road[i]), `road[${i}]`).toBe(false);
    expect([...road].sort()).toEqual([ORIGIN_POOLS.road[1], ORIGIN_POOLS.road[4]].sort());
    const cross = bodiesOver({ route: 'crossroads', siege: true, tier: 'town' });
    for (const i of [0, 1, 2]) expect(cross.has(ORIGIN_POOLS.crossroads[i]), `crossroads[${i}]`).toBe(false);
  });
  it('a living from journeys only beside an inn or a tavern, and never of a city', () => {
    expect(bodiesOver({ route: 'road', tier: 'thorp', hasTravellerHouse: false }).has(ORIGIN_POOLS.road[3])).toBe(false);
    expect(bodiesOver({ route: 'road', tier: 'city', hasTravellerHouse: true }).has(ORIGIN_POOLS.road[3])).toBe(false);
    expect(bodiesOver({ route: 'road', tier: 'metropolis', hasTravellerHouse: true }).has(ORIGIN_POOLS.road[3])).toBe(false);
    expect(bodiesOver({ route: 'road', tier: 'village', hasTravellerHouse: true }).has(ORIGIN_POOLS.road[3])).toBe(true);
  });
  it('a state that does not say keeps every row (canonical-at-zero)', () => {
    expect(selectOriginBody({ route: 'road' })).toBe(ORIGIN_POOLS.road[0]);
    expect(bodiesOver({ route: 'road' }).size).toBe(5);
  });
});

describe("the readers' towns, born as the app births them", () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  /** @param {string} seed */
  const born = (seed) => {
    const m = /** @type {RegExpMatchArray} */ (seed.match(/^(?:rww|rr2s)-(\w+)-([a-z_+]+)-(?:rand-)?\d+$/));
    return /** @type {any} */ (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true }), null, { seed, customContent: {} }));
  };
  it.each([
    ['rww-village-under_siege-1', ORIGIN_POOLS.road[0]],
    ['rr2s-hamlet-under_siege-rand-1', ORIGIN_POOLS.road[3]],
  ])('%s: the refused row does not print', (seed, refused) => {
    const s = born(seed);
    expect(s.config.stressTypes).toContain('under_siege');
    expect(ORIGIN_POOLS.road).toContain(s.settlementReason[0]);
    // anchored: the line above proves the founding line is a live row of the same road pool
    expect(s.settlementReason).not.toContain(refused);
  });
});
