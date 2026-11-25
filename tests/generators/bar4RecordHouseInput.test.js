// tests/generators/bar4RecordHouseInput.test.js — BAR4-RECORD, kind R1 (BRIEF-BAR4 amendments K1 to K4): THE HOUSE SHORT
// OF ITS INPUT THAT THE PAGE STILL COUNTS. The record's gap (`resourceGenerator.js :: evaluateInstitutionChain`) and the
// page's gap reader (`validationOnPage.js :: resourceGapLines`) now read ONE fact (`src/domain/facts/houseInputAtHand.js`).
// THE GUARD: the detector (`tests/helpers/houseInputSplit.js`) reads ZERO in every census town where it fired at
// c4ac1ef84a (67 rows in these 64 towns of the 720; the fresh 300's 17 in 16 are the hand-back's measure, not a test),
// each born in the census's own configuration (CENSUS-3 seedcfg.mjs); A POSITIVE CONTROL: a record whose gap says a
// house is short while the page's reader finds its input (a caravanserai on a connected road), and a short sawmill whose
// town still sells its "Milled lumber" (the economy's gate, computeActiveChains.js), MUST fire; and KEEP pairs:
// the gap line that now prints, and the caravanserai the road feeds, silent by design.
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { houseInputSplits } from '../helpers/houseInputSplit.js';
import { resourceGapLines } from '../../src/domain/display/validationOnPage.js';
import { CHAIN_INPUTS } from '../../src/domain/facts/houseInputAtHand.js';

/** The towns of the census's 720 where the detector fired at c4ac1ef84a, by the house it fired on. */
const FIRED = Object.freeze({
  'Charcoal burner': 'r2r-hamlet-9 r2r-hamlet-26 r2r-hamlet-36 r2r-hamlet-48 r2r-hamlet-52 r2r-hamlet-59 r2r-town-17 r2r-town-40 r2r-city-0 r2r-city-3 r2r-city-40 r2r-city-56 r2r-city-58 r2r-city-59 r2r-metropolis-2 r2r-metropolis-4 r2r-metropolis-13 r2r-metropolis-19 r2r-metropolis-39 r2r-metropolis-40 r2r-metropolis-41 r2r-metropolis-45 r2s-under_siege-metropolis-1 r2s-politically_fractured-hamlet-2 r2s-politically_fractured-metropolis-1 r2s-politically_fractured-metropolis-3 r2s-indebted-hamlet-2 r2s-indebted-village-0 r2s-infiltrated-hamlet-0 r2s-succession_void-city-3 r2s-monster_pressure-town-3 r2s-monster_pressure-metropolis-0 r2s-insurgency-hamlet-1 r2s-insurgency-city-3 r2s-religious_conversion-hamlet-2 r2s-religious_conversion-metropolis-2 r2s-wartime-town-2 r2s-wartime-metropolis-2 r2s-mass_migration-metropolis-1',
  Caravanserai: 'r2r-hamlet-14 r2r-village-58 r2r-city-39 r2r-city-43 r2r-metropolis-12 r2r-metropolis-25 r2s-under_siege-town-1 r2s-famine-city-1 r2s-indebted-metropolis-0 r2s-recently_betrayed-village-3 r2s-infiltrated-town-2 r2s-succession_void-metropolis-1 r2s-religious_conversion-metropolis-0 r2s-slave_revolt-hamlet-1 r2s-wartime-hamlet-1',
  Sawmill: 'r2r-village-4 r2r-village-30 r2r-village-42 r2r-village-52 r2s-indebted-village-2 r2s-recently_betrayed-village-0 r2s-monster_pressure-village-0',
  Fishmonger: 'r2r-village-36 r2s-religious_conversion-village-0',
  Smelter: 'r2r-city-17',
});
/** The census towns where the RUNG arm fired at b193fa89a (the chair's R2: a "Sawmill (commercial)" with no timber by
 * both readings, this fact's and BAR4-HOUSES' `timber at hand`, and no gap line). */
const RUNG_FIRED = 'r2r-town-2 r2r-town-29 r2r-town-34 r2r-town-45 r2r-town-48 r2r-town-49 r2r-city-0 r2r-city-6 r2r-city-7 r2r-city-11 r2r-city-14 r2r-city-21 r2r-city-24 r2r-city-35 r2r-city-36 r2r-city-40 r2r-city-41 r2r-city-44 r2r-city-56 r2r-metropolis-2 r2r-metropolis-4 r2r-metropolis-7 r2r-metropolis-8 r2r-metropolis-14 r2r-metropolis-19 r2r-metropolis-22 r2r-metropolis-24 r2r-metropolis-27 r2r-metropolis-28 r2r-metropolis-29 r2r-metropolis-33 r2r-metropolis-34 r2r-metropolis-35 r2r-metropolis-39 r2r-metropolis-40 r2r-metropolis-41 r2r-metropolis-47 r2r-metropolis-50 r2r-metropolis-57 r2s-under_siege-city-1 r2s-famine-metropolis-1 r2s-occupied-town-3 r2s-occupied-city-0 r2s-occupied-city-2 r2s-occupied-metropolis-2 r2s-occupied-metropolis-3 r2s-politically_fractured-metropolis-0 r2s-politically_fractured-metropolis-1 r2s-politically_fractured-metropolis-2 r2s-indebted-metropolis-0 r2s-recently_betrayed-town-1 r2s-recently_betrayed-city-1 r2s-recently_betrayed-city-2 r2s-recently_betrayed-metropolis-0 r2s-recently_betrayed-metropolis-1 r2s-recently_betrayed-metropolis-2 r2s-recently_betrayed-metropolis-3 r2s-infiltrated-city-0 r2s-plague_onset-city-0 r2s-plague_onset-metropolis-1 r2s-succession_void-town-3 r2s-succession_void-metropolis-2 r2s-monster_pressure-city-3 r2s-monster_pressure-metropolis-0 r2s-insurgency-town-0 r2s-insurgency-city-1 r2s-insurgency-city-3 r2s-insurgency-metropolis-3 r2s-religious_conversion-city-0 r2s-religious_conversion-city-1 r2s-religious_conversion-metropolis-0 r2s-slave_revolt-metropolis-0 r2s-wartime-town-3 r2s-wartime-city-3 r2s-wartime-metropolis-0 r2s-wartime-metropolis-2 r2s-mass_migration-town-1 r2s-mass_migration-metropolis-0 r2s-mass_migration-metropolis-1 r2s-mass_migration-metropolis-2 r2s-mass_migration-metropolis-3';
const FIRST = Object.values(FIRED).flatMap((list) => list.split(' '));
// RE-KEYED BY IDENTITY (BIRTH-1, 2026-11-17): the birth now brings timber in for a sawmill on a connected road no siege
// shuts (`resourceGenerator.js :: importsBroughtAtBirth`), so r2r-village-4's sawmill and r2r-town-2's commercial sawmill
// are fed; the same claims stand on census towns on no road: r2r-village-69 (a Sawmill, both its gaps `missing`, its line
// printed) and r2r-city-115 (a Sawmill (commercial), the same).
// RE-KEYED BY IDENTITY (BIRTH-3, 2026-11-17; the owner's supply rule, BR5 and BR8): r2r-city-115's commercial sawmill now has its timber (bought in, or of a woodland a house there proves); the same
// claim stands on r2r-town-85, a town on no road whose commercial sawmill no timber reaches (its two rows `missing`)
const REKEYED = Object.freeze({ sawmill: 'r2r-village-69', commercialSawmill: 'r2r-town-85' });
/** RE-KEYED BY IDENTITY (BIRTH-3, 2026-11-17; the owner's supply rule, BR5 and BR8): r2r-hamlet-9's charcoal burner stands in the woodland it proves; the same gap line stands in r2s-religious_conversion-hamlet-2, whose burner the story leaves idle. */
const BURNER_SHORT = 'r2s-religious_conversion-hamlet-2';
const SEEDS = [...FIRST, ...RUNG_FIRED.split(' ').filter((seed) => !FIRST.includes(seed)), ...Object.values(REKEYED), BURNER_SHORT];

/** CENSUS-3 seedcfg.mjs's r2r-/r2s- arms, verbatim in shape. @param {string} seed */
function configOf(seed) {
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  let m = seed.match(/^r2r-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/);
  if (m) return { ...dials, settType: m[1] };
  m = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/);
  if (m) return { ...dials, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] };
  throw new Error(`a guard seed is a census seed: ${seed}`);
}

/** @type {Map<string, any>} */
const BORN = new Map();
beforeAll(async () => {
  const boundary = await import('../../src/domain/density/densityCreateBoundary.js');
  const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
  const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
  await boundary.loadGenerationLawPayloads();
  for (const seed of SEEDS) BORN.set(seed, generateSettlementPipeline(boundary.birthConfig({ ...DEFAULT_CONFIG, ...configOf(seed) }), null, { seed, customContent: {} }));
}, 600000);

/** The gap line of a house, as the page's reader spells it from the chain table (never a literal sentence). */
const gapLineOf = (/** @type {string} */ chainKey, /** @type {string} */ house) => {
  const spec = CHAIN_INPUTS[chainKey];
  return `No ${spec.noun} ${spec.plural ? 'reach' : 'reaches'} the ${house}.`;
};

// B1(i) withholds this house from a desert at birth; the case stands for a house that arrives after birth (ruling 117-2,
// point 117, 2026-11-25). r2r-village-69 is a desert village: its birth at the line's base ddca5c789 seated a Sawmill and
// called it short of timber; under the close's B1(i) it seats none. The record below is the merged birth of r2r-village-69
// plus the base birth's Sawmill and its two gap rows, COPIED VERBATIM from that base birth; no other key is touched.
const SAWMILL_FROM_BASE = Object.freeze({"category":"Crafts","name":"Sawmill","required":false,"baseChance":0.35,"desc":"Powered by water or ox, the saw reduces logs to planks and beams whenever logs can be had, for building timber and furniture.","tags":["trade","timber"],"priorityCategory":"crafts","source":"generated","catalogId":"sawmill"});
const SAWMILL_GAPS_FROM_BASE = Object.freeze([{"chain":"timber","institution":"Sawmill","kind":"missing","impact":"Sawmill exists but lacks access to timber","severity":"high"},{"chain":"mountain_timber","institution":"Sawmill","kind":"missing","impact":"Sawmill exists but lacks access to mountain_timber","severity":"high"}]);
/** @returns {any} the merged birth of REKEYED.sawmill with the base birth's Sawmill and its gap rows */
const sawmillArrived = () => {
  const town = structuredClone(BORN.get(REKEYED.sawmill));
  town.institutions = [...town.institutions, structuredClone(SAWMILL_FROM_BASE)];
  town.resourceAnalysis.gaps = [...town.resourceAnalysis.gaps, ...structuredClone(SAWMILL_GAPS_FROM_BASE)];
  return town;
};

describe('R1: a house the record calls short of its input is short on the page too (one reading, houseInputAtHand)', () => {
  it('the detector reads zero in every census town where it fired at c4ac1ef84a', () => {
    expect(FIRST).toHaveLength(64);
    expect(RUNG_FIRED.split(' ')).toHaveLength(81);
    const failures = collectSeedFailures(SEEDS, (seed) => {
      expect(houseInputSplits(BORN.get(seed)).map((x) => `${x.house} (${x.chain})`)).toEqual([]);
    });
    expectNoSeedFailures(failures, 'no house short in the record and answered on the page');
  });

  it('POSITIVE CONTROL: a gap that calls a road-fed caravanserai short of camels, where the page finds the road, fires', () => {
    const town = structuredClone(BORN.get('r2r-hamlet-14'));
    expect(town.institutions.some((/** @type {{ name?: string }} */ i) => i?.name === 'Caravanserai')).toBe(true);
    town.resourceAnalysis.gaps = [...town.resourceAnalysis.gaps, { chain: 'camel_herds', institution: 'Caravanserai', kind: 'missing', impact: 'planted', severity: 'high' }];
    expect(houseInputSplits(town).map((x) => x.house)).toEqual(['Caravanserai']);
  });

  it('POSITIVE CONTROL: a short sawmill whose town is still said to sell its "Milled lumber" fires', () => {
    const town = sawmillArrived();
    expect(houseInputSplits(town)).toEqual([]);
    town.economicState.primaryExports = [...town.economicState.primaryExports, 'Milled lumber'];
    expect(houseInputSplits(town).map((x) => `${x.house} ${x.chain}`)).toEqual(['Sawmill output: Milled lumber']);
  });

  it('KEEP: the gap line the record now asks for prints, and the mark has its line', () => {
    // RE-KEYED BY IDENTITY (BAR8-J-ROWS G1, 2026-11-17): a worked-out house's gap line is its story's own line, the general line
    // beside it struck (one house, one material, one line). No town of the 720 or the 150 prints the burner's general line alone
    // (every short burner is worked out), so the claim stays on this town, by the line the page now prints for the house.
    expect(resourceGapLines(BORN.get(BURNER_SHORT)).map((l) => l.impact)).toContain('The charcoal burner is worked out: its own ground is depleted (Managed woodland).');
    expect(resourceGapLines(sawmillArrived()).map((l) => l.impact)).toContain(gapLineOf('timber', 'sawmill'));
    // a siege shuts the road: the besieged caravanserai is short, and says so
    expect(resourceGapLines(BORN.get('r2s-under_siege-town-1')).map((l) => l.impact)).toContain(gapLineOf('camelCaravan', 'caravanserai'));
  });

  it('KEEP: a commercial sawmill with no timber is short by its kind, its line names it as the sawmill', () => {
    const town = BORN.get(REKEYED.commercialSawmill);
    expect(town.institutions.some((/** @type {{ name?: string }} */ i) => i?.name === 'Sawmill (commercial)')).toBe(true);
    expect(town.resourceAnalysis.gaps.filter((/** @type {{ institution?: string, kind?: string }} */ g) => g.institution === 'Sawmill (commercial)').map((/** @type {{ kind?: string }} */ g) => g.kind)).toEqual(['missing', 'missing']);
    expect(resourceGapLines(town).map((l) => l.impact)).toContain(gapLineOf('timber', 'sawmill'));
  });

  it('POSITIVE CONTROL (the rung arm): a commercial sawmill with no timber whose gap rows are struck fires', () => {
    const town = structuredClone(BORN.get(REKEYED.commercialSawmill));
    town.resourceAnalysis.gaps = town.resourceAnalysis.gaps.filter((/** @type {{ institution?: string }} */ g) => g.institution !== 'Sawmill (commercial)');
    expect(houseInputSplits(town).map((x) => x.house)).toEqual(['Sawmill (commercial)']);
  });

  it('KEEP: a caravanserai the connected road feeds has no gap row and no gap line (silent by design: the route is its trade)', () => {
    const town = BORN.get('r2r-hamlet-14');
    expect(town.resourceAnalysis.gaps.filter((/** @type {{ institution?: string }} */ g) => g.institution === 'Caravanserai')).toEqual([]);
    // the anchor: the house stands on the roster and its road is connected (what holds instead of the gap)
    expect(resourceGapLines(town).map((l) => l.impact)).not.toContain(gapLineOf('camelCaravan', 'caravanserai')); // anchored: the roster and the road are matched on the lines below
    expect(town.institutions.some((/** @type {{ name?: string }} */ i) => i?.name === 'Caravanserai')).toBe(true);
    expect(town.config.tradeRouteAccess).toBe('road');
  });
});
