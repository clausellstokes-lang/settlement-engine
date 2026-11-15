/**
 * TAIL-HISTORY-4 batch 5 (2026-11-15; the chair's ruling Y16, the exports' read X9 30563, 07927, 03878, 03872-03877,
 * 00590, 29930, 08729): A TIMELINE EVENT'S LASTING EFFECT NAMES ONLY WHAT THE PLACE CAN HOLD. Measured on the census's
 * 720 (false / printing): watch towers and muster drills with no force of any kind (28 / 157); a levy roster kept in
 * the archive (34 / 142), a standing security office (57 / 184), denunciation records sealed in the archive (65 / 202)
 * and a standing arbitration council (7 / 112) below a town; two rival congregations in a thorp (12 / 136); grain
 * reserves mandated by ordinance below a village or under a famine (17 / 46). The file's form: a declared sibling set in
 * `historyData.js :: HISTORY_DESC_SIBLINGS`, the twin true where the original is refused, draw-free
 * (`generators/history/sizedLastingEffects.js`). The tabs' event card and the exports' history section print the one field.
 *
 * THIS FILE REDS WHEN a cured effect prints again in a town that makes it false (each with what prints instead), or when
 * the original stops printing where the town holds what it names (each KEEP).
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };

/** A census town, as its births script makes it. */
const bornCensus = (/** @type {string} */ seed) => {
  const forced = /^r2s-(.+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/.exec(seed);
  const calm = /^r2r-(thorp|hamlet|village|town|city|metropolis)-\d+$/.exec(seed);
  const tier = forced ? forced[2] : /** @type {RegExpExecArray} */ (calm)[1];
  const cfg = forced ? { ...DEFAULT_CONFIG, ...dials, settType: tier, selectedStressesRandom: false, selectedStresses: [forced[1]] } : { ...DEFAULT_CONFIG, ...dials, settType: tier };
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
};

const effects = (/** @type {string} */ seed) => (bornCensus(seed).history?.historicalEvents || []).flatMap((/** @type {any} */ e) => e.lastingEffects || []).join(' · ');

/** [seed, the false words, what prints instead on the same slot (the declared twin)] */
const MUST_NOT = [
  ['r2r-thorp-32', /Watch towers and muster drills/, /Every household still knows where to run if the alarm is raised again/],
  ['r2s-wartime-hamlet-3', /Watch towers and muster drills/, /Every household still knows where to run if the alarm is raised again/],
  ['r2r-thorp-13', /standing levy roster/, /The heads of the families still keep count of who could be called on to fight/],
  ['r2s-mass_migration-village-2', /standing levy roster/, /The heads of the families still keep count of who could be called on to fight/],
  ['r2r-thorp-4', /standing security office/, /Neighbours still watch one another, and the old informers are not forgotten/],
  ['r2s-mass_migration-village-0', /standing security office/, /Neighbours still watch one another, and the old informers are not forgotten/],
  ['r2r-thorp-1', /Denunciation records/, /The names denounced in the panic are still remembered, and not forgiven/],
  ['r2s-wartime-village-3', /Denunciation records/, /The names denounced in the panic are still remembered, and not forgiven/],
  ['r2r-thorp-5', /Two rival congregations/, /The faithful are still divided over how they ought to worship/],
  ['r2s-plague_onset-thorp-2', /Two rival congregations/, /The faithful are still divided over how they ought to worship/],
  ['r2r-hamlet-51', /standing arbitration council/, /Wage disputes are still settled by the heads of the families/],
  ['r2r-village-0', /standing arbitration council/, /Wage disputes are still settled by the heads of the families/],
  ['r2r-thorp-21', /Emergency grain reserves mandated by ordinance/, /Every household has put grain by against lean years since the shortage/],
  ['r2s-famine-town-0', /Emergency grain reserves mandated by ordinance/, /Grain was put by against lean years after the shortage, and it has not been enough/],
  ['r2s-famine-metropolis-1', /Emergency grain reserves mandated by ordinance/, /Grain was put by against lean years after the shortage, and it has not been enough/],
];
/** [seed, the true original that must still print] */
const KEEP = [
  ['r2r-thorp-16', /Watch towers and muster drills maintained since the alarm/],
  ['r2r-town-17', /A standing levy roster kept ready in the town archive/],
  ['r2r-town-1', /A standing security office and informant network persist/],
  ['r2r-town-16', /Denunciation records from the panic remain sealed in the archive/],
  ['r2r-hamlet-4', /Two rival congregations still divide the settlement's faithful/],
  ['r2r-town-0', /Wage disputes settled by a standing arbitration council since founded/],
  ['r2r-village-3', /Emergency grain reserves mandated by ordinance since the shortage/],
];

describe('TAIL-HISTORY batch 5 (Y16): a lasting effect names only the force, office or archive the place can hold', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); }, 120_000);

  test('MUST NOT: the cured effects leave the towns that make them false; the twin prints instead', () => {
    expectNoSeedFailures(collectSeedFailures(MUST_NOT.map(([seed], i) => `${i}|${seed}`), (key) => {
      const [i, seed] = key.split('|');
      const [, gone, instead] = MUST_NOT[Number(i)];
      const s = effects(String(seed));
      expect(s, key).toMatch(/** @type {RegExp} */ (instead));
      // anchored: the same text is shown directly above to print what stands on the slot instead
      expect(s, key).not.toMatch(/** @type {RegExp} */ (gone));
    }), 'the false lasting effects');
  }, 600_000);

  test('KEEP: the original prints where the town holds what it names', () => {
    expectNoSeedFailures(collectSeedFailures(KEEP.map(([seed], i) => `${i}|${seed}`), (key) => {
      const [i, seed] = key.split('|');
      expect(effects(String(seed)), key).toMatch(/** @type {RegExp} */ (KEEP[Number(i)][1]));
    }), 'the true originals');
  }, 600_000);
});
