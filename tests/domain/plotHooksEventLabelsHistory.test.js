/**
 * R3-TABS-4, the chair's ruling (e) of 2026-11-14 on the fresh reader's F8 (LOW, a carried twin of the lane's History
 * rename): the Plot Hooks tab and the PDF name an event by the same name History prints. `exile_return` events are
 * an occupation's aftermath ("Occupation Legacy" on History) and `occupation_infiltration` events enemy agents and
 * denunciations ("Infiltration Fear"); plotHooks.js :: EVENT_LABELS still said "Exile & Return" and "Occupation":
 * "Exile & Return Event" in 209 and "Occupation Event" in 307 towns of the reader's 1,536 at c75fa4f9e (both 0 after).
 * RED-FIRST at c75fa4f9e: the four towns below.
 */
import { beforeAll, describe, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { collectPlotHooks } from '../../src/domain/dossier/plotHooks.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const birth = (seed) => {
  const m = seed.match(/^rr3-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-rand-(\d+)$/);
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true }), null, { seed, customContent: {} });
};
const SEEDS = ['rr3-thorp-calm-rand-1', 'rr3-thorp-politically_fractured-rand-2', 'rr3-thorp-calm-rand-4', 'rr3-thorp-under_siege-rand-1'];
const HISTORY_NAME = { exile_return: 'Occupation Legacy', occupation_infiltration: 'Infiltration Fear' };
const TOWNS = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of SEEDS) TOWNS[seed] = birth(seed);
}, 300000);

describe('Plot Hooks name an event as History does (F8)', () => {
  test('each hook of an occupation\'s event carries History\'s name, and no hook the retired one', () => {
    const failures = collectSeedFailures(SEEDS, (seed) => {
      const s = TOWNS[seed];
      const events = (s.history?.historicalEvents || []).filter((e) => HISTORY_NAME[e.type] && (e.plotHooks || []).length);
      if (!events.length) throw new Error('premise: no such event with hooks');
      const sources = collectPlotHooks(s).map((h) => h.source);
      for (const bad of ['Exile & Return Event', 'Occupation Event']) if (sources.includes(bad)) throw new Error(`prints "${bad}"`);
      for (const e of events) if (!sources.includes(`${HISTORY_NAME[e.type]} Event`)) throw new Error(`no "${HISTORY_NAME[e.type]} Event"`);
    });
    expectNoSeedFailures(failures, 'the event named once');
  });
});
