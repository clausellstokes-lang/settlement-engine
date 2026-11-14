/**
 * R3-TABS-4, the chair's ruling (d) of 2026-11-14 on the fresh reader's F6 (MEDIUM, a carried class): THE SUPPLY LINE
 * THAT SAYS THE DEFENDERS ARE WELL SUPPLIED IS NOT DRAWN UNDER A SIEGE OR A FAMINE IN FORCE. "The trades that feed
 * and equip Shivabari's defenders are busy and well stocked" stood under a siege and a famine: 27 towns of the
 * reader's 1,536 at the line's tip 976db5b19 and at 2b7f61994 (33 before the watch left the key). The clause is
 * silent there; the Invasion row's own sentence stays. RED-FIRST at e24d244f2: the three towns below.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { defenseThreatProse } from '../../src/domain/display/stateProse/defenseStateProse.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const birth = (seed) => {
  const m = seed.match(/^rr3-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-rand-(\d+)$/);
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true }), null, { seed, customContent: {} });
};
const IN_CRISIS = ['rr3-town-under_siege+famine-rand-0', 'rr3-city-under_siege-rand-1', 'rr3-city-famine-rand-0'];
const AT_PEACE = 'rr3-town-calm-rand-2';
const SUPPLIED = /well stocked|kept supplied|will not go short|supply book for .* balances/;
const TOWNS = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of [...IN_CRISIS, AT_PEACE]) TOWNS[seed] = birth(seed);
}, 300000);

describe('no well-supplied defence under a siege or a famine (F6)', () => {
  test('under a siege or a famine the Invasion row keeps its sentence and says nothing of a full supply', () => {
    const failures = collectSeedFailures(IN_CRISIS, (seed) => {
      const st = TOWNS[seed].stress; const types = (Array.isArray(st) ? st : st ? [st] : []).map((x) => x?.type);
      if (!types.includes('under_siege') && !types.includes('famine')) throw new Error('premise: no crisis');
      const inv = defenseThreatProse(TOWNS[seed], { seed }).invasion?.sentence || '';
      if (!inv) throw new Error('premise: the row is silent');
      if (SUPPLIED.test(inv)) throw new Error(`supplied under ${types.join('+')}: ${inv}`);
    });
    expectNoSeedFailures(failures, 'the supply line against its crisis');
  });
  test('a town at peace keeps the line', () => {
    expect(defenseThreatProse(TOWNS[AT_PEACE], { seed: AT_PEACE }).invasion?.sentence).toMatch(SUPPLIED);
  });
});
