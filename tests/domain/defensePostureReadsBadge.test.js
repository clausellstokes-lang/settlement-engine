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
import { poolMemberTexts, variantByVid } from '../helpers/drawnProse.js';

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
  /**
   * TAIL-CORPUS-DEF-5, RE-KEYED TO THE GUARD'S LAW (the chair's C24, 2026-11-15; vetoable by the owner): the law is the
   * title, NO OPEN ROAD AND NO PEACE PRESUMED UNDER A SIEGE. 7a2774754 (W2-WRITE-3) wrote readiness STRONG v5 ("Danger
   * has come to {settlement}, and the town meets it strongly defended.") and v6 ("People at {settlement} take the danger
   * seriously, and they trust the town's defences to hold.") as the pool's lines for a town under a threat: each read,
   * each true of a besieged town whose readiness is Strong, neither presumes an open road or peace. So under a siege the
   * pool prints one of those two lines or nothing, and any other member of the pool is red.
   * AT WAR (re-keyed by identity): rv2-wartime-city-0 reads Fortress now (72 -> 80, the defence lane's rebuild 33b12cbef,
   * declared), still the strong pool, and draws a wartime line the corpus added (v7 v8, `crisis: wartime`); the arm
   * asserts what its title says: the line drawn is a member of the pool that presumes no peace (no line the
   * disqualifiers strike `at war`).
   */
  test('under a siege the strong posture says nothing; at war it draws only its line that presumes no peace', () => {
    const STRONG = { leaf: 'defense', blockId: 'DS-DEF-1', poolKey: 'readiness STRONG' };
    const SIEGE_VIDS = [5, 6];
    let spoke = 0;
    const failures = collectSeedFailures(SIEGED, (seed) => {
      const s = TOWNS[seed];
      if (posturePoolKey(s.defenseProfile.readiness.score) !== 'readiness STRONG') throw new Error(`premise: ${s.defenseProfile.readiness.label}`);
      if (!(Array.isArray(s.stress) ? s.stress : [s.stress]).some((x) => x?.type === 'under_siege')) throw new Error('premise: not under a siege');
      const rung = defensePostureProse(s, { seed }).posture;
      if (!rung?.beside) return;
      spoke++;
      const siegeLines = SIEGE_VIDS.map((vid) => variantByVid({ ...STRONG, vid, slots: { settlement: s.name } }));
      if (!siegeLines.includes(rung.beside)) throw new Error(`a strong line not written for a siege, under a siege: ${rung.beside}`);
    });
    expectNoSeedFailures(failures, 'no open road or peace presumed under a siege');
    expect(spoke, 'a siege line is read under a siege (rv2-under_siege-city-5)').toBeGreaterThan(0);
    const war = rvBirth('rv2-wartime-city-0');
    expect(posturePoolKey(war.defenseProfile.readiness.score)).toBe('readiness STRONG');
    const atWar = new Set(Object.entries(POSTURE_LINE_DISQUALIFIERS['readiness STRONG'])
      .filter(([, d]) => [d.falseWhere].flat().includes('at war')).map(([vid]) => Number(vid)));
    expect(atWar.size, 'the pool declares lines that presume peace').toBeGreaterThan(0);
    const presumeNoPeace = DOSSIER_STATE_PROSE_DEFENSE['DS-DEF-1'].pools['readiness STRONG'].filter((v) => !atWar.has(v.vid))
      .map((v) => variantByVid({ ...STRONG, vid: v.vid, slots: { settlement: war.name } }));
    expect(poolMemberTexts({ ...STRONG, slots: { settlement: war.name } }).length).toBeGreaterThan(presumeNoPeace.length);
    expect(presumeNoPeace).toContain(defensePostureProse(war, { seed: 'rv2-wartime-city-0' }).posture?.beside);
    const calm = TOWNS['r2r-town-6'];
    expect(calm.defenseProfile.readiness.label).toBe('Well-Defended');
    expect(defensePostureProse(calm, { seed: 'r2r-town-6' }).posture?.rung?.provenance?.poolKey).toBe('readiness STRONG');
  });
});
