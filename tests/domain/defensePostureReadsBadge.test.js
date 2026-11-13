/**
 * R3-TABS, L1 (the chair's ruling, 2026-11-13): ONE LADDER FOR ONE NUMBER. The Defense header prints the
 * readiness BADGE (`readiness.label`, the readiness ladder `bandLadders.js :: readinessBandOf`: 76/55/38/24/12)
 * and the posture line under it banded the same score on the aspects' ladder (`scoreBand`: 65/40/20), so
 * "Defensible" stood over "could not hold off a raid" (the defence lane's fourth read, class K) and
 * "Vulnerable" over "is all but undefended" (class E). The line now reads the badge: Fortress and
 * Well-Defended → the strong pool, Defensible → adequate, Lightly Defended and Vulnerable → weak,
 * Undefended → critical.
 *
 * RED-FIRST at 2ac3fa8c8: scores 55-64 (Well-Defended) read ADEQUATE, 38-39 (Defensible) WEAK and 12-19
 * (Vulnerable) CRITICAL. On 884 births at 9e57f5023 the label equals readinessBandOf(score) in all 884,
 * and the pool moves in 252 (Well-Defended 64, Defensible 22, Vulnerable 166).
 * WITH IT, the lines a town's facts make false are struck at the draw (POSTURE_LINE_DISQUALIFIERS): three
 * of the strong pool's four lines presume peace (class D: L1 alone would have put them under a siege or a
 * war in 21 more of the reader's 1,440 births) and one of the weak pool's presumes nobody to man the works
 * (9 more beside a force).
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { readinessBandOf } from '../../src/data/bandLadders.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { defensePostureProse, posturePoolKey } from '../../src/domain/display/stateProse/defenseStateProse.js';
import { POSTURE_LINE_DISQUALIFIERS } from '../../src/domain/display/stateProse/postureLineDisqualifiers.js';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../src/data/dossierStateProse/defense.generated.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const POOL_OF_BADGE = {
  Fortress: 'readiness STRONG', 'Well-Defended': 'readiness STRONG', Defensible: 'readiness ADEQUATE',
  'Lightly Defended': 'readiness WEAK', Vulnerable: 'readiness WEAK', Undefended: 'readiness CRITICAL',
};
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const SEEDS = ['r2r-thorp-47', 'r2r-town-29', 'r2r-thorp-4', 'r2r-thorp-10', 'r2r-town-6', 'r2r-city-14', 'r2r-city-0', 'r2r-metropolis-3'];
const SIEGED = ['rv2-under_siege-city-4', 'rv2-under_siege-city-5'];
const rvBirth = (seed) => { const m = seed.match(/^rv2-([a-z_]+)-([a-z]+)-(\d+)$/); return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: m[2], selectedStresses: [m[1]], selectedStressesRandom: false }), null, { seed, customContent: {} }); };
const TOWNS = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of SEEDS) {
    TOWNS[seed] = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: seed.split('-')[1] }), null, { seed, customContent: {} });
  }
  for (const seed of SIEGED) TOWNS[seed] = rvBirth(seed);
}, 300000);

describe('the posture line reads the readiness badge (L1)', () => {
  test('every score from 0 to 100 reads the pool of the badge it prints', () => {
    const scores = Array.from({ length: 101 }, (_, i) => i);
    const failures = collectSeedFailures(scores, (n) => {
      const want = POOL_OF_BADGE[readinessBandOf(n).label];
      if (posturePoolKey(n) !== want) throw new Error(`${n} (${readinessBandOf(n).label}): ${posturePoolKey(n)} ≠ ${want}`);
    });
    expectNoSeedFailures(failures, 'one ladder for one number');
  });
  test('the cells the two ladders split: Well-Defended at 60, Defensible at 38, Vulnerable at 15', () => {
    expect([readinessBandOf(60).label, posturePoolKey(60)]).toEqual(['Well-Defended', 'readiness STRONG']);
    expect([readinessBandOf(38).label, posturePoolKey(38)]).toEqual(['Defensible', 'readiness ADEQUATE']);
    expect([readinessBandOf(15).label, posturePoolKey(15)]).toEqual(['Vulnerable', 'readiness WEAK']);
  });
  test('on births, the badge the header prints and the posture pool agree', () => {
    const failures = collectSeedFailures(SEEDS, (seed) => {
      const r = TOWNS[seed].defenseProfile.readiness;
      if (posturePoolKey(r.score) !== POOL_OF_BADGE[r.label]) throw new Error(`${r.label} ${r.score}: ${posturePoolKey(r.score)}`);
    });
    expectNoSeedFailures(failures, 'the header speaks one ladder');
  });
  test('each declaration names its line: the pool, the vid and the words it opens with', () => {
    const pools = DOSSIER_STATE_PROSE_DEFENSE['DS-DEF-1'].pools;
    for (const [pool, declared] of Object.entries(POSTURE_LINE_DISQUALIFIERS)) {
      for (const [vid, d] of Object.entries(declared)) {
        expect(pools[pool].find((v) => v.vid === Number(vid))?.text.startsWith(d.opens), `${pool}#${vid}`).toBe(true);
      }
    }
  });
  test('under a siege the strong posture draws only its line that presumes no peace; in peace it keeps the pool', () => {
    const failures = collectSeedFailures(SIEGED, (seed) => {
      const s = TOWNS[seed];
      const rung = defensePostureProse(s, { seed }).posture?.rung;
      if (rung?.provenance?.poolKey !== 'readiness STRONG') throw new Error(`pool ${rung?.provenance?.poolKey}`);
      const struck = Object.values(POSTURE_LINE_DISQUALIFIERS['readiness STRONG']).map((d) => d.opens.replace(/\{settlement\}/g, s.name));
      if (struck.some((o) => rung.sentence.startsWith(o))) throw new Error(`a peace line: ${rung.sentence}`);
      if (!/reads as a defended place from the road in/.test(rung.sentence)) throw new Error(`not the strong pool's first line: ${rung.sentence}`);
    });
    expectNoSeedFailures(failures, 'no peace presumed under a siege');
    const calm = TOWNS['r2r-town-6'];
    expect(calm.defenseProfile.readiness.label).toBe('Well-Defended');
    expect(defensePostureProse(calm, { seed: 'r2r-town-6' }).posture?.rung?.provenance?.poolKey).toBe('readiness STRONG');
  });
});
