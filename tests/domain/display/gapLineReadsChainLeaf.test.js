/**
 * gapLineReadsChainLeaf.test.js — W2-C-LEAVES item 2 (2026-11-13; the charter's amendment of record 303, item 2; the
 * cold list REVIEW-W2A-3).
 *
 * "No one here works the timber near …" printed beside a chain that works it (735 of 4,141 births by the agreement
 * lane's count; stone 245): the gap reader took the resource analysis's own model ("unexploited": no house of the
 * processing list) for the fact. The chair ruled the home of "a resource is worked here": the chain model's leaf,
 * `src/domain/facts/chainWorking.js :: chainWorksResource`. The sentence now prints only where the leaf says no; a
 * half-way grade (the work done in part) never prints where the model holds a chain on the resource and none of them
 * works it (`chainModelsResource`: where it holds none, the model is silent and the grade stands).
 *
 * RE-KEYED BY IDENTITY (R3, 2026-11-13, the chair's ruling on REVIEW-R2-STAGES finding 4): a chain works a resource
 * only through a house of that trade (`chainWorking.js :: NOT_WORKED_THROUGH`). Five stone pins of item 2 were
 * anchored on walls, a palisade or a Brickmaker "working" the quarry — rw3-town-calm-1, rw3-town-under_siege-1,
 * rw3-village-insurgency-1, r2r-town-16, r2r-city-14: none holds a house that quarries or dresses stone, so the leaf
 * now says no and the true line "No one here works the stone" prints there; the pins say so.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { configOf } from '../../components/pageCensusWalk.shared.mjs';
import { resourceGapLines } from '../../../src/domain/display/validationOnPage.js';
import { chainModelsResource, chainWorksResource } from '../../../src/domain/facts/chainWorking.js';
import { collectSeedFailures, expectNoSeedFailures } from '../../helpers/seedFailures.js';

/** The app's own shape, as the reader REVIEW-W2A-3 born its towns. @param {string} seed */
const birthApp = (seed) => {
  const m = /** @type {RegExpMatchArray} */ (seed.match(/^rw3-(\w+)-([a-z_+]+)-\d+$/));
  const stresses = m[2] === 'calm' ? [] : m[2].split('+');
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false, selectedStresses: stresses,
    _randomizePriorities: true }), null, { seed, customContent: {} });
};
/** The census's shape. @param {string} seed */
const birthCensus = (seed) => {
  const parts = seed.split('-');
  const size = parts.at(-2); const crisis = seed.startsWith('r2s-') ? parts.slice(1, -2).join('-') : null;
  return generateSettlementPipeline(configOf({ size, crisis }, DEFAULT_CONFIG, birthConfig), null, { seed, customContent: {} });
};
/** @param {any} town */
const gapText = (town) => resourceGapLines(town).map((g) => g.impact);

/** A record with one gap row and the chain model's chains. @param {'unexploited'|'partial'} kind @param {object[]} chains */
const unit = (kind, chains) => ({
  name: 'Testford', config: { nearbyResources: ['stone_quarry'] }, economicState: { primaryExports: [], activeChains: chains },
  institutions: [{ name: 'Stone quarry' }],
  resourceAnalysis: { gaps: [kind === 'unexploited'
    ? { chain: 'stone', missing: ['Stone quarry', "Stonemasons' guild"], impact: 'Raw resource available but not being processed', severity: 'low' }
    : { chain: 'stone', missing: ["Stonemasons' guild"], impact: 'Cannot produce final goods, limited to intermediate products', severity: 'medium' }] },
});
const stoneChain = (/** @type {string} */ status) => ({ chainId: 'stone', resourceInputKey: 'stone_quarry', resourceInputAvailable: true, status });

describe('a gap line\'s "worked here" is the chain leaf\'s (item 2)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('the unit: "No one here works" only where the leaf says no; a half-way grade never beside a modelled idle chain', () => {
    expect(gapText(unit('unexploited', [stoneChain('running')]))).toEqual([]);
    expect(gapText(unit('unexploited', [stoneChain('impaired')]))).toEqual(['No one here works the stone near Testford.']);
    expect(gapText(unit('unexploited', []))).toEqual(['No one here works the stone near Testford.']);
    expect(gapText(unit('partial', [stoneChain('vulnerable')]))).toEqual(["Work on the stone here stops half-way: no stonemasons' guild finishes it."]);
    expect(gapText(unit('partial', [stoneChain('impaired')]))).toEqual([]);
    // the model holds no chain on the stone: silent, and the grade stands
    expect(chainModelsResource(unit('partial', []), 'stone_quarry')).toBe(false);
    expect(gapText(unit('partial', []))).toEqual(["Work on the stone here stops half-way: no stonemasons' guild finishes it."]);
  });

  test('RE-KEYED (R3): the cold list\'s towns whose quarry only walls or a brickmaker "work" print the true line (rw3-town-calm-1, rw3-town-under_siege-1, rw3-village-insurgency-1)', () => {
    expectNoSeedFailures(collectSeedFailures(['rw3-town-calm-1', 'rw3-town-under_siege-1', 'rw3-village-insurgency-1'], (seed) => {
      const town = birthApp(seed);
      expect(town.institutions.filter((/** @type {{ name: string }} */ i) => /quarr|mason/i.test(i.name)), `anchored: ${seed} holds no quarry or mason`).toEqual([]);
      expect(chainWorksResource(town, 'stone_quarry'), `${seed}: walls and a brickmaker do not quarry`).toBe(false);
      expect(gapText(town).filter((t) => t.startsWith('No one here works the stone')).length).toBe(1);
    }), 'a quarry no house works is said to be worked');
  }, 120000);

  test('a true line still prints: rw3-village-calm-1, a quarry no chain works', () => {
    const town = birthApp('rw3-village-calm-1');
    expect(chainWorksResource(town, 'stone_quarry')).toBe(false);
    expect(gapText(town)).toContain('No one here works the stone near Langenbrunn.');
  }, 60000);

  test('the census\'s towns the base printed it in: the leaf says yes, and the line is gone', () => {
    const cases = /** @type {Array<[string, string, string[]]>} */ ([
      ['r2r-village-2', 'timber', ['managed_forest', 'mountain_timber', 'shipbuilding_timber']],
      // RE-KEYED (R3): r2r-town-16 and r2r-city-14 left this list — their stone was "worked" by walls and a Brickmaker
      // only, and the true line prints there now (chainWorksThroughItsTrade.test.js holds the class)
      ['r2r-city-26', 'animal hides', ['grazing_land', 'hunting_grounds']],
      ['r2r-metropolis-43', 'timber', ['managed_forest', 'mountain_timber', 'shipbuilding_timber']],
      ['r2s-religious_conversion-city-2', 'timber', ['managed_forest', 'mountain_timber', 'shipbuilding_timber']],
    ]);
    expectNoSeedFailures(collectSeedFailures(cases.map(([seed]) => seed), (seed) => {
      const [, good, keys] = /** @type {[string, string, string[]]} */ (cases.find(([s]) => s === seed));
      const town = birthCensus(seed);
      expect(chainWorksResource(town, keys), `anchored: a chain works ${seed}'s ${good}`).toBe(true);
      expect(gapText(town).filter((t) => t.startsWith(`No one here works the ${good} `))).toEqual([]);
    }), 'a resource a chain works is said to be worked by no one');
  }, 240000);
});
