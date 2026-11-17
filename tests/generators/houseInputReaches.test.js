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
 * (M-V) GRAPES AND GLASS SAND COME BY ANY ROUTE · no record yields grapes and no import list names them, so every census
 *   vintner "exists but lacks access to grapes" (184 of 184; the page: "No grapes reach the vintner.") though the house's
 *   own text presses must brought in; every glassblower lacked glass sand (13 of 13). The input reaches the house wherever
 *   the town can bring goods in (`hasTradeRouteConnection`) and no siege shuts the road: no row is written. An isolated or
 *   besieged town's row stays (UNDER A SIEGE nothing comes in), and the page's line with it.
 *
 * The towns are born as the census bears them (CENSUS-3 seedcfg.mjs; the reader's cfgFor, as
 * tests/domain/r3c10FoodLinesTrue.test.js bears them). Each arm collects first and asserts on the collection.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { generateResourceAnalysis } from '../../src/generators/resourceGenerator.js';

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
/** M-S KEEP: the smelter no input reaches (iron, copper and gold/silver all missing), and the imported rows.
 * HELD ON A CONSTRUCTED RECORD (BIRTH-1, 2026-11-17; the chair's ruling of 06:05 UTC: the claim is not retired and not
 * loosened): the four census smelters this arm stood on (r2r-city-5, r2r-city-17, r2r-city-36, r2r-metropolis-33) are now
 * fed, the birth bringing their ore in on a connected road (`resourceGenerator.js :: importsBroughtAtBirth`), and NO TOWN
 * OF 1,945 BIRTHS (the census's 720, the wide read's 150, the 525 reference configurations, 700 more `r2r-` seeds) bears
 * an unfed smelter after the birth's import. The claim stands on a record built here: a smelter, no ore ground, no ore on
 * the imports, an isolated route, through the same gap writer. The seat after BIRTH-1 may re-key it to a born town (its
 * rule lets a used-up ground go unbought in one town in four). */
const SMELTER_UNFED = ['constructed-isolated-smelter'];
/** The constructed record: a smelter alone, on no ground, on an isolated route, nothing on its imports. @returns {{ seed: string, s: any }} */
const constructedSmelter = () => ({ seed: SMELTER_UNFED[0], s: { resourceAnalysis: generateResourceAnalysis('hills', [], [], [{ name: 'Smelter' }],
  { tradeRouteAccess: 'isolated' }, { primaryImports: [], localProduction: [] }) } });
/** [seed, the imported row that still prints]: a smelter that runs on bought ore says so. */
const SMELTER_IMPORTS = [['r2s-under_siege-town-1', 'Smelter | iron ore | imported'], ['r2r-metropolis-8', 'Smelter | gold/silver ore | imported']];

/** M-V NOT: a vintner on a route (the smallest, a town of 540; a famine; an occupation; the largest, 344,689), a
 * glassblower on a route (511; a famine; 2,465). */
// BAR5-CHAINS (2026-11-16, BRIEF-BAR5 (b), the chair's direction under HW1, vetoable by the owner; re-keyed by identity, the
// assertion unchanged): M-V is NARROWED: the route brings grapes or glass sand only where the record's own need list does not name
// the good (`houseInputAtHand.js :: needListNames`). The seven towns below named it (r2r-town-22, r2r-city-44, r2s-occupied-city-3,
// r2r-metropolis-8; r2r-town-55, r2s-famine-town-1, r2r-town-51), their houses are short now, beside the page's "Needed, and not
// brought in". Measured on the 720 at the tip: 36 of 184 vintner towns on a route hold a vintner short of nothing; 0 of 13 glassblower
// towns hold such a glassblower (no glassblower row is left).
const ROUTE_FED = [['r2r-town-16', 'Vintner'], ['r2r-town-32', 'Vintner'], ['r2r-city-1', 'Vintner'], ['r2r-city-3', 'Vintner']];
/** M-V KEEP: an isolated vintner (6,341; 55,265), an isolated glassblower, a besieged vintner (11,745; 271,164). */
// RE-KEYED BY IDENTITY (BIRTH-3, 2026-11-17; the owner's supply rule, BR3 (c): a cause is of ordinary times, and a siege
// reworks nothing): the two besieged towns' vintners (r2s-under_siege-city-2, r2r-metropolis-14) now have their must bought in
// as in ordinary times, cut off by the siege ("Curtailed by the siege."); the claim, the input does not reach a town whose
// route is shut, stands on two more towns on no road even in ordinary times, whose vintners' rows stay `missing`. SO THIS ARM
// NOW ASSERTS THE ISOLATED FORM ONLY (the chair's AMENDMENT 2 (D)): under a siege a buyer is not `missing`; the besieged form
// (its word on the imports, the house curtailed by the siege, never `missing`) is held by tests/domain/supplyStoryLaw.test.js
const ROUTE_SHUT = [['r2r-city-49', 'Vintner', 'grapes'], ['r2r-metropolis-54', 'Vintner', 'grapes'], ['r2r-town-9', 'Glassblower', 'glass sand'],
  ['r2r-metropolis-9', 'Vintner', 'grapes'], ['r2r-metropolis-44', 'Vintner', 'grapes']];

/** @type {Array<{ seed: string, s: any }>} */ let fed = [];
/** @type {Array<{ seed: string, s: any }>} */ let routeFed = [];
/** @type {Array<{ seed: string, s: any }>} */ let routeShut = [];
/** @type {Array<{ seed: string, s: any }>} */ let unfed = [];

beforeAll(async () => {
  await loadGenerationLawPayloads();
  fed = SMELTER_FED.map(bear);
  unfed = [constructedSmelter()];
  routeFed = ROUTE_FED.map(([seed]) => bear(seed));
  routeShut = ROUTE_SHUT.map(([seed]) => bear(seed));
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

describe('(M-V) grapes and glass sand come by any route', () => {
  it('a vintner or glassblower in a town on a route, under no siege, is short of nothing: no row for its input', () => {
    const seen = routeFed.filter((t, i) => t.s.institutions.some((/** @type {any} */ x) => x.name === ROUTE_FED[i][1])).map((t) => t.seed);
    expect(seen).toEqual(ROUTE_FED.map(([seed]) => seed));
    const rows = routeFed.flatMap(rowsOf).filter((r) => /: (Vintner|Glassblower) \|/.test(r));
    expect(rows).toEqual([]); // silent by design: the input reaches the house; the record names no import of it
  });

  it('KEEP: where the town is isolated or besieged the input does not reach it, and the `missing` row stays', () => {
    const rows = routeShut.flatMap(rowsOf);
    const want = ROUTE_SHUT.map(([seed, house, raw]) => `${seed}: ${house} | ${raw} | missing`);
    expect(want.filter((r) => !rows.includes(r))).toEqual([]);
  });
});
