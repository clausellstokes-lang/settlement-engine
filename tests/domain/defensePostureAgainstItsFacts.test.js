/**
 * R3-TABS-4, the chair's ruling (a) of 2026-11-14 on the fresh reader's F1 (HIGH): THE POSTURE LINE AGAINST THE
 * FACTS BESIDE IT, IN BOTH DIRECTIONS OF L2. No strong posture line beside a Weak or Critical Invasion & War bar
 * (the line speaks of what the town can field and has built: that bar's own subject), none under an occupation
 * (the strong pool is struck whole, as under a siege), and none of the weak or critical pools beside a Strong bar
 * (L2, kept). Beside a Weak or Critical bar the posture draws no higher than the line's tip 976db5b19 drew.
 *
 * RED-FIRST at 5f8602371 on the reader's 1,536 births: a strong line beside a Weak bar in 2 towns (both occupied),
 * a strong line under an occupation in 14; the towns below printed them. Ingili (rr3-metropolis-occupied-rand-2):
 * "What Ingili can field and what Ingili has built are both in good order" over "Invasion & War — Weak".
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { scoreBand } from '../../src/domain/display/defenseScoreBands.js';
import { defensePostureProse } from '../../src/domain/display/stateProse/defenseStateProse.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { standingDefenseForces } from '../../src/domain/institutions/defenseInstitutionBuckets.js';

/** The reader's app shape (rr3-<size>-<calm|s1+s2>-rand-<i>) and L2's own (rv2-<calm|s>-<size>-<i>). */
const birth = (seed) => {
  let m = seed.match(/^rr3-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-rand-(\d+)$/);
  if (m) {
    return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true }), null, { seed, customContent: {} });
  }
  m = seed.match(/^r2r-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/);
  if (m) {
    // The census's own cfgFor (the reader's births.mjs), verbatim.
    const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
    return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: m[1] }), null, { seed, customContent: {} });
  }
  m = seed.match(/^rv2-([a-z_+]+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/);
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: m[2], selectedStresses: m[1] === 'calm' ? [] : m[1].split('+'), selectedStressesRandom: false }), null, { seed, customContent: {} });
};
const types = (s) => (Array.isArray(s.stress) ? s.stress : s.stress ? [s.stress] : []).map((x) => x?.type);
/** Occupied with a Weak bar (Ingili, Muulcoba); occupied with a Strong bar; L2's Strong bar over a weak badge. */
const SEEDS = ['rr3-metropolis-occupied-rand-2', 'rr3-town-occupied-rand-1', 'rr3-city-occupied-rand-0', 'rr3-metropolis-occupied-rand-0', 'rv2-calm-hamlet-27', 'rv2-calm-hamlet-30'];
const KEEPS = 'rr3-city-indebted-rand-1';
/** The reverse guard alone: Ingili's own record with its occupation lifted (Well-Defended, a Weak bar, at peace). */
const LIFTED = 'rr3-metropolis-occupied-rand-2 with its occupation lifted';
const ARM = [...SEEDS, LIFTED];
const TOWNS = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of [...SEEDS, KEEPS]) TOWNS[seed] = birth(seed);
  TOWNS[LIFTED] = { ...TOWNS['rr3-metropolis-occupied-rand-2'], stress: [] };
}, 300000);

const postureOf = (seed) => defensePostureProse(TOWNS[seed], { seed: seed === LIFTED ? 'rr3-metropolis-occupied-rand-2' : seed }).posture;
const barOf = (seed) => scoreBand(TOWNS[seed].defenseProfile.scores.military);

describe('the posture line against the facts beside it (F1, both directions of L2)', () => {
  test('the premise: each town is what the arm needs it to be', () => {
    const failures = collectSeedFailures(SEEDS, (seed) => {
      const s = TOWNS[seed]; const bar = barOf(seed); const occupied = types(s).includes('occupied');
      const want = {
        'rr3-metropolis-occupied-rand-2': occupied && bar === 'WEAK' && s.defenseProfile.readiness.label === 'Well-Defended',
        'rr3-town-occupied-rand-1': occupied && bar === 'WEAK' && s.defenseProfile.readiness.label === 'Well-Defended',
        'rr3-city-occupied-rand-0': occupied && bar === 'STRONG' && s.defenseProfile.readiness.label === 'Well-Defended',
        'rr3-metropolis-occupied-rand-0': occupied && bar === 'STRONG' && s.defenseProfile.readiness.label === 'Fortress',
        'rv2-calm-hamlet-27': bar === 'STRONG',
        'rv2-calm-hamlet-30': bar === 'STRONG',
      }[seed];
      if (!want) throw new Error(`bar ${bar}, ${types(s).join('+') || 'calm'}, ${s.defenseProfile.readiness.label}`);
    });
    expectNoSeedFailures(failures, 'the premise');
  });
  test('no strong line beside a Weak or Critical bar or under an occupation; no weak line beside a Strong bar', () => {
    const failures = collectSeedFailures(ARM, (seed) => {
      const pool = postureOf(seed)?.rung?.provenance?.poolKey ?? null; const bar = barOf(seed);
      if (pool === 'readiness STRONG' && (bar === 'WEAK' || bar === 'CRITICAL')) throw new Error(`strong beside a ${bar} bar: ${postureOf(seed).beside}`);
      if (pool === 'readiness STRONG' && types(TOWNS[seed]).includes('occupied')) throw new Error(`strong under an occupation: ${postureOf(seed).beside}`);
      if ((pool === 'readiness WEAK' || pool === 'readiness CRITICAL') && bar === 'STRONG') throw new Error(`${pool} beside a Strong bar: ${postureOf(seed).beside}`);
    });
    expectNoSeedFailures(failures, 'the posture within its facts');
  });
  test('beside a Weak bar the posture draws the line tip\'s pool; a Well-Defended town at peace keeps the strong pool', () => {
    expect(postureOf('rr3-metropolis-occupied-rand-2')?.rung?.provenance?.poolKey).toBe('readiness ADEQUATE');
    expect(postureOf(LIFTED)?.rung?.provenance?.poolKey).toBe('readiness ADEQUATE');
    expect(postureOf(KEEPS)?.rung?.provenance?.poolKey).toBe('readiness STRONG');
  });
});

/**
 * The chair's ruling (b) of 2026-11-14 on the reader's F3: A LINE THAT NAMES A THING READS THE ROSTER. The strong
 * pool's first line names works ("the works are kept up") and a watch on the approaches: it is not drawn where
 * the roster holds no walls, or neither a watch nor a garrison. RED-FIRST at 44dc0d5f9: Yunxian and the
 * religious-conversion town below printed it unwalled. Muulcoba (the reader's town, unwalled, occupied) is held
 * too; a walled town keeps the line.
 */
const UNWALLED = ['r2r-town-52', 'rr3-town-religious_conversion-rand-1', 'rr3-town-occupied-rand-1'];
const WALLED_KEEPS = 'rr3-town-slave_revolt-rand-5';
const NAMES_WORKS = /the works are kept up|the approaches are watched/;
/** The watch half alone: the walled town's own record with its watch and garrison taken off the roster. */
const UNWATCHED = 'rr3-town-slave_revolt-rand-5 with no watch or garrison';
const offTheRoster = (s) => ({ ...s, institutions: (s.institutions || []).filter((inst) => {
  const f = standingDefenseForces({ ...s, institutions: [inst] }); return !f.watch.present && !f.garrison.present;
}) });
describe('a posture line that names works or a watch reads the roster (F3)', () => {
  beforeAll(() => {
    for (const seed of [...UNWALLED, WALLED_KEEPS]) TOWNS[seed] = TOWNS[seed] || birth(seed);
    TOWNS[UNWATCHED] = offTheRoster(TOWNS[WALLED_KEEPS]);
  }, 300000);
  test('no unwalled town, and none without a watch or a garrison, is told its works are kept up', () => {
    const failures = collectSeedFailures([...UNWALLED, UNWATCHED], (seed) => {
      const s = TOWNS[seed]; const f = standingDefenseForces(s);
      if (seed === UNWATCHED ? (!f.walls.present || f.watch.present || f.garrison.present) : f.walls.present) throw new Error('premise');
      const line = defensePostureProse(s, { seed: seed === UNWATCHED ? WALLED_KEEPS : seed }).posture?.beside || '';
      if (NAMES_WORKS.test(line)) throw new Error(`${seed === UNWATCHED ? 'no watch or garrison' : 'no walls'}: ${line}`);
    });
    expectNoSeedFailures(failures, 'the works read from the roster');
  });
  test('a walled town with its watch keeps the line', () => {
    const f = standingDefenseForces(TOWNS[WALLED_KEEPS]);
    expect(f.walls.present && (f.watch.present || f.garrison.present)).toBe(true);
    expect(postureOf(WALLED_KEEPS)?.beside).toMatch(NAMES_WORKS);
  });
});
