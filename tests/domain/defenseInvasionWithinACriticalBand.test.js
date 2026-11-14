/**
 * R3-TABS-5, the chair's ruling (h) of 2026-11-14 (found by the reader of the defence rating's rebuild on 972 births):
 * A LINE CLAIMS NO VERDICT THAT A BAND ON ITS OWN PAGE CAN DENY. Once the rebuild lands, a thorp's "Invasion & War" chip
 * reads Critical while the row's sentence still says "credible against raiders" or "would see off a raid" (12 births
 * there). The Invasion row draws no pool with a line that claims the place holds, deters or sees off a raid where its
 * own band (`scoreBand(scores.military)`, the chip beside it) reads Critical: walls with a garrison ("raiders stay
 * away", "any attacker would think again", "the town could be held"), walls with townspeople ("credible against
 * raiders", "would see off a raid") and a force with no walls ("It answers raiders well"). There the row is silent,
 * or draws a pool every line of which is true beside Critical.
 *
 * RED-FIRST at 268c40013 on the second reader's 1,536 births: a claim beside a Critical band in 6 towns (5 thorps; all
 * occupied): Makropyrgos and Dar-al-mandi below. The rebuild is absent on this tree, so the arm also holds MADE
 * records: real towns of each claiming pool with their Invasion & War score set into the Critical band.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { scoreBand } from '../../src/domain/display/defenseScoreBands.js';
import { defenseThreatProse } from '../../src/domain/display/stateProse/defenseStateProse.js';
import { standingDefenseForces } from '../../src/domain/institutions/defenseInstitutionBuckets.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

/** The reader's app shape: rr3-<size>-<calm|s1+s2>-<rand|route>-<i>. */
const birth = (seed) => {
  const m = seed.match(/^rr3-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-([a-z_]+)-(\d+)$/);
  const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true }), null, { seed, customContent: {} });
};
/** A record of the town with its Invasion & War score set to `military` (the band the rebuild may print). */
const withMilitary = (s, military) => ({ ...s, defenseProfile: { ...s.defenseProfile, scores: { ...s.defenseProfile.scores, military } } });

const CLAIMS = /raiders stay away|would think again|could be held|credible against raiders|would see off a raid|answers raiders well/;
const REAL = ['rr3-thorp-occupied-rand-1', 'rr3-town-occupied-rand-4'];
/** Walls with townspeople; a force with no walls; walls with a garrison (each at peace, Adequate at birth). */
const MADE_FROM = { 'rr3-thorp-calm-port-1': 'walls with citizen militia', 'rr3-town-calm-rand-1': 'force with NO walls', 'rr3-town-occupied-rand-4': 'walls AND professional garrison' };
const CRITICAL = 10;
const TOWNS = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of new Set([...REAL, ...Object.keys(MADE_FROM)])) TOWNS[seed] = birth(seed);
}, 300000);
const invasionOf = (s, seed) => defenseThreatProse(s, { seed }).invasion?.sentence ?? null;

describe('the Invasion row claims no hold beside its own Critical band (ruling (h))', () => {
  test('the premise: the real towns read Critical, and each made record\'s town holds its pool\'s forces', () => {
    expect(REAL.map((seed) => scoreBand(TOWNS[seed].defenseProfile.scores.military))).toEqual(['CRITICAL', 'CRITICAL']);
    const f = (seed) => standingDefenseForces(TOWNS[seed]);
    expect(f('rr3-thorp-calm-port-1').walls.present && f('rr3-thorp-calm-port-1').militia.present && !f('rr3-thorp-calm-port-1').garrison.present).toBe(true);
    expect(!f('rr3-town-calm-rand-1').walls.present && (f('rr3-town-calm-rand-1').garrison.present || f('rr3-town-calm-rand-1').mercenary.present)).toBe(true);
    expect(scoreBand(CRITICAL)).toBe('CRITICAL');
  });
  test('beside a Critical band no line says the place holds, deters or sees off a raid', () => {
    const cases = [...REAL, ...Object.keys(MADE_FROM).map((seed) => `${seed} made Critical`)];
    const failures = collectSeedFailures(cases, (c) => {
      const seed = c.replace(/ made Critical$/, '');
      const s = c === seed ? TOWNS[seed] : withMilitary(TOWNS[seed], CRITICAL);
      const line = invasionOf(s, seed) || '';
      if (CLAIMS.test(line)) throw new Error(`${MADE_FROM[seed] || 'real'}: ${line}`);
    });
    expectNoSeedFailures(failures, 'the Invasion row beside a Critical band');
  });
  test('above the Critical band the same records keep their pools', () => {
    const kept = Object.keys(MADE_FROM).filter((seed) => invasionOf(withMilitary(TOWNS[seed], 50), seed));
    expect(kept).toEqual(Object.keys(MADE_FROM));
  });
});
