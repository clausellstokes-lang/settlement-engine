/**
 * R3-TABS, L2 (the chair's ruling, 2026-11-13): THE ROW'S SENTENCE IS DRAWN WITHIN THE BAND ITS BAR PRINTS. Where
 * the Invasion & War bar reads Strong (`scoreBand(scores.military)`), no line says an attacker walks in: the
 * Invasion row's no-force pools and the posture's weak and critical pools are silent there (the defence lane's
 * fourth read, classes A1 and F: "Invasion & War — Strong" above "Lundmo has walls and nobody to put on them" or
 * "could not hold off a raid").
 *
 * RED-FIRST at aac97a657: on the defence reader's 1,440 births, 2 Invasion lines and 72 posture lines stood
 * against a Strong bar; the four towns below printed them.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { scoreBand } from '../../src/domain/display/defenseScoreBands.js';
import { defensePostureProse, defenseThreatProse } from '../../src/domain/display/stateProse/defenseStateProse.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const birth = (seed) => {
  const m = seed.match(/^rv[234]-([a-z_+]+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/);
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: m[2], selectedStresses: m[1] === 'calm' ? [] : m[1].split('+'), selectedStressesRandom: false }), null, { seed, customContent: {} });
};
const AGAINST = /walls and nobody|no line and no force|could not hold off a raid|would struggle to hold|all but undefended|could not survive a serious attack|nobody on it/;
const SEEDS = ['rv2-wartime-hamlet-5', 'rv3-under_siege-village-1', 'rv2-calm-hamlet-27', 'rv2-calm-hamlet-30', 'rv2-calm-hamlet-12'];
const TOWNS = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of SEEDS) TOWNS[seed] = birth(seed);
}, 300000);

describe('no sentence stands against a Strong Invasion & War bar (L2)', () => {
  test('the premise: each town\'s Invasion bar reads Strong', () => {
    const failures = collectSeedFailures(SEEDS, (seed) => {
      const band = scoreBand(TOWNS[seed].defenseProfile.scores.military);
      if (band !== 'STRONG') throw new Error(band);
    });
    expectNoSeedFailures(failures, 'a Strong bar');
  });
  test('neither the Invasion row nor the posture says an attacker walks in', () => {
    const failures = collectSeedFailures(SEEDS, (seed) => {
      const s = TOWNS[seed];
      const inv = defenseThreatProse(s, { seed }).invasion?.sentence || '';
      const post = defensePostureProse(s, { seed }).posture?.beside || '';
      if (AGAINST.test(inv)) throw new Error(`invasion: ${inv}`);
      if (AGAINST.test(post)) throw new Error(`posture: ${post}`);
    });
    expectNoSeedFailures(failures, 'the sentence within its bar');
  });
  test('a weak bar keeps its weak line', () => {
    // rv2-calm-thorp-0: Vulnerable, Invasion Critical: the posture still says so.
    const s = birth('rv2-calm-thorp-0');
    expect(scoreBand(s.defenseProfile.scores.military)).not.toBe('STRONG');
    expect(defensePostureProse(s, { seed: 'rv2-calm-thorp-0' }).posture?.rung?.provenance?.poolKey).toBe('readiness WEAK');
  });
});
