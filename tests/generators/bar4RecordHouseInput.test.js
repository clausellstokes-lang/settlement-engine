// tests/generators/bar4RecordHouseInput.test.js — BAR4-RECORD, kind R1 (BRIEF-BAR4 amendments K1 to K4): THE HOUSE SHORT
// OF ITS INPUT THAT THE PAGE STILL COUNTS. The record's gap (`resourceGenerator.js :: evaluateInstitutionChain`) and the
// page's gap reader (`validationOnPage.js :: resourceGapLines`) now read ONE fact (`src/domain/facts/houseInputAtHand.js`).
// THE GUARD: the detector (`tests/helpers/houseInputSplit.js`) reads ZERO in every census town where it fired at
// c4ac1ef84a (67 rows in these 64 towns of the 720; the fresh 300's 17 in 16 are the hand-back's measure, not a test),
// each born in the census's own configuration (CENSUS-3 seedcfg.mjs); A POSITIVE CONTROL: a record whose gap says a
// house is short while the page's reader finds its input (a caravanserai on a connected road) MUST fire; and KEEP pairs:
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
const SEEDS = Object.values(FIRED).flatMap((list) => list.split(' '));

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

describe('R1: a house the record calls short of its input is short on the page too (one reading, houseInputAtHand)', () => {
  it('the detector reads zero in every census town where it fired at c4ac1ef84a', () => {
    expect(SEEDS).toHaveLength(64);
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

  it('KEEP: the gap line the record now asks for prints, and the mark has its line', () => {
    expect(resourceGapLines(BORN.get('r2r-hamlet-9')).map((l) => l.impact)).toContain(gapLineOf('mountainTimber', 'charcoal burner'));
    expect(resourceGapLines(BORN.get('r2r-village-4')).map((l) => l.impact)).toContain(gapLineOf('timber', 'sawmill'));
    // a siege shuts the road: the besieged caravanserai is short, and says so
    expect(resourceGapLines(BORN.get('r2s-under_siege-town-1')).map((l) => l.impact)).toContain(gapLineOf('camelCaravan', 'caravanserai'));
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
