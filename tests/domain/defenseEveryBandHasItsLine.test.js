/**
 * R3-TABS, L3 (the chair's ruling, 2026-11-13): EVERY BAND HAS A POOL, and the Economic Survival row never
 * prints a band with no sentence under it (the defence lane's fourth read, C-L5, 6 births: "measure the six
 * births first and say what key is missing").
 *
 * MEASURED at f0adcd83a on the defence reader's 1,440 births: NO KEY IS MISSING. Each of the six towns' band has
 * its pool (`economicRowPoolKey` returns it) and the pool composes; what fails is the `{settlement}` slot. The
 * desk's `properFill` admitted a name only if it opened on an ASCII capital (`/^[A-Z]/`), so a town named Ásey,
 * Ögedeinuur or Ástun has no proper fill, and every DS-DEF line names `{settlement}`: the whole desk is silent in
 * those towns (5 of 884 census-and-fresh births by name). A capital in any script is a capital.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { defensePostureProse, defenseThreatProse, economicRowPoolKey } from '../../src/domain/display/stateProse/defenseStateProse.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const birth = (seed) => {
  const m = seed.match(/^rv[234]-([a-z_+]+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/);
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: m[2], selectedStresses: m[1] === 'calm' ? [] : m[1].split('+'), selectedStressesRandom: false }), null, { seed, customContent: {} });
};
const SIX = ['rv2-famine-thorp-0', 'rv2-famine-thorp-12', 'rv2-famine-village-0', 'rv2-famine-village-6', 'rv2-famine-village-18', 'rv2-succession_void-hamlet-33'];
const TOWNS = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of SIX) TOWNS[seed] = birth(seed);
}, 300000);

describe('the Economic Survival row prints a sentence under every band (L3)', () => {
  test('the premise: each town\'s name opens on a capital outside A-Z, and its band has a pool', () => {
    const failures = collectSeedFailures(SIX, (seed) => {
      const s = TOWNS[seed];
      if (/^[A-Z]/.test(s.name) || !/^\p{Lu}/u.test(s.name)) throw new Error(`name ${s.name}`);
      if (!economicRowPoolKey(s.defenseProfile.scores.economic)) throw new Error('no key');
    });
    expectNoSeedFailures(failures, 'a band with its pool');
  });
  test('each town prints its Economic Survival line and its posture, named', () => {
    const failures = collectSeedFailures(SIX, (seed) => {
      const s = TOWNS[seed];
      const eco = defenseThreatProse(s, { seed }).economic?.sentence || '';
      if (!eco) throw new Error('no economic line');
      const post = defensePostureProse(s, { seed }).posture?.beside || '';
      if (!post) throw new Error('no posture line');
      if (!`${eco} ${post}`.includes(s.name) && !/\b(The|the) (town|village|hamlet|thorp)\b/.test(`${eco} ${post}`)) throw new Error(`unnamed: ${eco}`);
    });
    expectNoSeedFailures(failures, 'every band has its line');
  });
});
