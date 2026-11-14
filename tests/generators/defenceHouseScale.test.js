/**
 * A HOUSE'S INFLUENCE ON DEFENCE FOLLOWS ITS SCALE (UPKEEP-CAPACITY C1; the chair's ruling B on
 * docs/chair/2026-11-13/UPKEEP-CAPACITY-MEASURE.md). The owner: "A single alchemist should not have the same
 * influence as an alchemist district". Each scaled part's weights are multiplied by its greatest house's factor:
 * `least + (greatest − least) · (rung − 1) / (of − 1)` on that house's ladder (`houseScale.js :: houseRungsOf`,
 * the catalogue's UPGRADE_CHAINS restricted to the houses that open the part); a one-rung ladder 1. Walls keep
 * their kind, arcane its own rows; the community rows, the reliefs, the stores, the purse and the will take none.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { defencePartsOf } from '../../src/generators/defenseGenerator.js';
import { keepOfRecord } from '../../src/domain/facts/keep.js';
import { houseRungsOf, jobRungAtTier } from '../../src/domain/institutions/houseScale.js';
import { DEFENCE_TUNING } from '../../src/data/defenceWeights.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** @type {Record<string, any>} */
const births = {};
const KEYS = ['cold-city-227', 'cold-town-116', 'fresh6-metropolis-30', 'cold-under_siege-town-52', 'cold-thorp-0'];

beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const key of KEYS) {
    const m = /^[a-z0-9]+-(?:([a-z_]+)-)?(thorp|hamlet|village|town|city|metropolis)-\d+$/.exec(key);
    const cfg = m[1]
      ? birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[2], selectedStresses: [m[1]], selectedStressesRandom: false })
      : birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[2] });
    births[key] = generateSettlementPipeline(cfg, null, { seed: key, customContent: {} });
  }
}, 120000);

/** The part's full measure (its points before pay, the rules and the crises). */
const fullOf = (s, id) => defencePartsOf(s, keepOfRecord(s.economicState)).find((p) => p.id === id)?.full ?? null;
/** The same record with one house renamed (the rest of the record untouched). */
const swap = (s, from, to) => ({ ...s, institutions: s.institutions.map((i) => (i.name === from ? { ...i, name: to } : i)) });

describe('a house counts by its rung on its own ladder', () => {
  test('RED-FIRST: an alchemist quarter counts for more than an alchemist shop in the same city (1.2 against 0.8)', () => {
    const city = births['cold-city-227'];
    expect(city.institutions.some((i) => i.name === 'Alchemist quarter')).toBe(true);
    const quarter = fullOf(city, 'alchemists');
    const shop = fullOf(swap(swap(city, 'Alchemist quarter', 'Alchemist shop'), 'Apothecary district', 'Apothecary'), 'alchemists');
    expect(quarter).not.toBeNull();
    expect(shop).not.toBeNull();
    expect(quarter / shop).toBeCloseTo(DEFENCE_TUNING.houseScale.greatest / DEFENCE_TUNING.houseScale.least, 1);
  });

  test('RED-FIRST: a barracks, a garrison and multiple garrisons count 0.8, 1 and 1.2 of the garrison\'s weights', () => {
    const metro = births['fresh6-metropolis-30'];
    const top = fullOf(metro, 'garrison');
    const at = (name) => fullOf(swap(swap(metro, 'Multiple garrisons', name), 'Professional city watch', 'Town watch'), 'garrison');
    const { least, greatest } = DEFENCE_TUNING.houseScale;
    expect(at('Garrison') / top).toBeCloseTo(((least + greatest) / 2) / greatest, 2);
    expect(at('Barracks') / top).toBeCloseTo(least / greatest, 2);
  });

  test('the factor is a row of the tuning table: least 0.8, greatest 1.2, the middle at today\'s points', () => {
    expect(DEFENCE_TUNING.houseScale).toEqual({ least: 0.8, greatest: 1.2 });
  });

  test('the ladder is the catalogue\'s, restricted to the houses that do the job; a house on no pair is one rung', () => {
    const jobs = (h) => (/^(barracks|garrison|multiple garrisons)$/i.test(String(h?.name)) ? ['garrison'] : /fish market/i.test(String(h?.name)) ? ['market'] : []);
    const got = houseRungsOf([{ name: 'Barracks' }, { name: 'Garrison' }, { name: 'Multiple garrisons' }, { name: 'Fish market' }, { name: 'Mill' }], jobs);
    expect(got.garrison).toEqual([{ rung: 1, of: 3 }, { rung: 2, of: 3 }, { rung: 3, of: 3 }]);
    expect(got.market).toEqual([{ rung: 1, of: 1 }]);
    expect(got.mill).toBeUndefined();
  });

  test('a counterfactual house is the rung its ladder writes at the place\'s tier (R2\'s watch in a hired force\'s stead)', () => {
    const jobs = (h) => (/^(village watch|town watch|professional city watch)$/i.test(String(h?.name)) ? ['watch'] : []);
    expect(jobRungAtTier('watch', 'village', jobs)).toEqual({ rung: 1, of: 3 });
    expect(jobRungAtTier('watch', 'town', jobs)).toEqual({ rung: 2, of: 3 });
    expect(jobRungAtTier('watch', 'city', jobs)).toEqual({ rung: 3, of: 3 });
    expect(jobRungAtTier('watch', 'metropolis', jobs)).toEqual({ rung: 3, of: 3 });
    expect(jobRungAtTier('watch', 'thorp', jobs)).toEqual({ rung: 1, of: 3 });
  });

  test('walls keep their kind and arcane its own rows: neither part moves when the roster\'s scale does', () => {
    const town = births['cold-under_siege-town-52'];
    const walls = fullOf(town, 'walls');
    expect(fullOf(swap(town, 'Barracks', 'Multiple garrisons'), 'walls')).toBe(walls);
    const city = births['cold-city-227'];
    expect(fullOf(swap(city, 'Alchemist quarter', 'Alchemist shop'), 'arcane')).toBe(fullOf(city, 'arcane'));
  });
});
