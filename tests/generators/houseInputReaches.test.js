/**
 * A HOUSE IS SHORT OF ITS INPUT ONLY WHERE THE RECORD SAYS NONE REACHES IT (TAIL-DEFECON-R; the chair's rulings of
 * 2026-11-15 00:44 UTC, each vetoable by the owner; measured by RECORD-MEASURE-2, row M3).
 *
 * (M-S) A HOUSE IS SHORT ONLY IF NONE OF ITS INPUTS REACHES IT · generators/resourceGenerator.js ::
 *   evaluateInstitutionChain judged a house of several chains chain by chain: the Smelter (iron ore, copper ore,
 *   gold/silver ore) "exists but lacks access to copper ore" in 238 of the 238 census towns that hold one, while it
 *   smelted iron. The `missing` row is written only where no other chain of the house is worked here and no other input
 *   is held locally or bought in. A house that runs on imported ore still says so: the `imported` row stays.
 *
 * The towns are born as the census bears them (CENSUS-3 seedcfg.mjs; the reader's cfgFor, as
 * tests/domain/r3c10FoodLinesTrue.test.js bears them). Each arm collects first and asserts on the collection.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const SIZES = '(thorp|hamlet|village|town|city|metropolis)';
/** The census's cfgFor for its r2r- and r2s- seeds. @param {string} seed */
const cfgFor = (seed) => {
  const m = seed.match(/^r2r-(\w+)-(\d+)$/);
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[1] });
  const n = /** @type {RegExpMatchArray} */ (seed.match(new RegExp(`^r2s-(\\w+)-${SIZES}-(\\d+)$`)));
  return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [n[1]], selectedStressesRandom: false, settType: n[2] });
};
/** @param {string} seed */
const bear = (seed) => ({ seed, s: generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} }) });
/** A gap row as a line: house, input, kind. @param {any} g */
const rowOf = (g) => `${g.institution} | ${g.chain} | ${g.kind}`;
/** @param {{ seed: string, s: any }} t */
const rowsOf = (t) => (t.s.resourceAnalysis?.gaps || []).filter((/** @type {any} */ g) => g.institution).map((/** @type {any} */ g) => `${t.seed}: ${rowOf(g)}`);

/** M-S NOT: a smelter fed by another input (the smallest, a town of 319; a siege; a famine; the largest, 344,689). */
const SMELTER_FED = ['r2s-infiltrated-town-1', 'r2s-under_siege-town-1', 'r2s-famine-city-0', 'r2s-under_siege-city-3', 'r2r-metropolis-8'];
/** M-S KEEP: the four census smelters no input reaches (iron, copper and gold/silver all missing), and the imported rows. */
const SMELTER_UNFED = ['r2r-city-5', 'r2r-city-17', 'r2r-city-36', 'r2r-metropolis-33'];
/** [seed, the imported row that still prints]: a smelter that runs on bought ore says so. */
const SMELTER_IMPORTS = [['r2s-under_siege-town-1', 'Smelter | iron ore | imported'], ['r2r-metropolis-8', 'Smelter | gold/silver ore | imported']];

/** @type {Array<{ seed: string, s: any }>} */ let fed = [];
/** @type {Array<{ seed: string, s: any }>} */ let unfed = [];

beforeAll(async () => {
  await loadGenerationLawPayloads();
  fed = SMELTER_FED.map(bear);
  unfed = SMELTER_UNFED.map(bear);
}, 180000);

describe('(M-S) a house is short only if none of its inputs reaches it', () => {
  it('a smelter that another input reaches is short of none: no `missing` row for any of its chains', () => {
    const seen = fed.filter((t) => t.s.institutions.some((/** @type {any} */ i) => i.name === 'Smelter')).map((t) => t.seed);
    expect(seen).toEqual(SMELTER_FED);
    const short = fed.flatMap(rowsOf).filter((r) => /Smelter \| .* \| missing$/.test(r));
    expect(short).toEqual([]);
  });

  it('a smelter that runs on imported ore still says so (the imported row prints instead)', () => {
    const rows = fed.flatMap(rowsOf);
    expect(SMELTER_IMPORTS.filter(([seed, row]) => !rows.includes(`${seed}: ${row}`))).toEqual([]);
  });

  it('KEEP: a smelter no input reaches is short of each (iron, copper and gold/silver ore)', () => {
    const rows = unfed.flatMap(rowsOf);
    const want = SMELTER_UNFED.flatMap((seed) => ['iron ore', 'copper ore', 'gold/silver ore'].map((raw) => `${seed}: Smelter | ${raw} | missing`));
    expect(want.filter((r) => !rows.includes(r))).toEqual([]);
  });
});
