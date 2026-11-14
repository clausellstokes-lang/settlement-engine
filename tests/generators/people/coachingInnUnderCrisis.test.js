/**
 * coachingInnUnderCrisis.test.js — POWERS-14 (the bar's MEDIUM #101, P7.4's table, read on its page in its towns): THE
 * COACHING INN'S NORMAL-TIMES LINES ARE NOT DEALT UNDER THE CRISIS THAT MAKES THEM FALSE. The coaching-inn keeper's
 * welcoming line ("Brisk and cheerful ... where coaches rattle in and out." / "Offers food, a bed and a fresh team; full
 * of news of the road.") printed under a siege, where the page says "nothing comes in by road" and "The siege has cut
 * every road in" (r2s-under_siege-town-1), and under a famine, where the page says "Rationing has begun" and "every coin
 * goes on food" (r2s-famine-city-1, r2s-famine-metropolis-3); its transactional line ("Calls out departures ..." / "Sells
 * places on the coach and beds by the night") printed under a siege (r2s-under_siege-metropolis-0,
 * r2s-under_siege-metropolis-3, r2r-metropolis-14). Read TRUE where they print and kept: under an occupation, a plague, a
 * monster on the roads, a war (the roads stay open; the page says so), and the transactional line under a famine.
 * Each line declares the crisis that refuses it beside the title table (data/people/titleSecretsPresentations.js ::
 * TITLE_LINE_DECLARATIONS, `excludes`, read by people/poolMap.js :: settleTitleLines); a refused line takes the title's
 * next admitted line, draw-free; the cautious line declares nothing and is admitted everywhere.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../../helpers/seedFailures.js';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { birthFactsOf } from '../../../src/domain/facts/factsOf.js';
import { TITLE_LINE_DECLARATIONS, TITLE_PRESENTATIONS } from '../../../src/data/people/titleSecretsPresentations.js';
import { settleTitleLines } from '../../../src/generators/people/poolMap.js';

const TITLE = 'the coaching-inn keeper';
const WELCOMING = 'Brisk and cheerful, always half on the way to the yard, where coaches rattle in and out.';
const TRANSACTIONAL = 'Efficient and loud. Calls out departures and prices in the same breath.';
const CAUTIOUS = 'Notes every traveller\'s name, face and baggage, and remembers all three.';
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };

/** the census's 720 shape: r2r-<size>-<i> (random crises), r2s-<crisis>-<size>-<i> (one crisis forced) @param {string} seed */
function born(seed) {
  const calm = seed.match(/^r2r-(\w+)-\d+$/);
  const forced = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  const cfg = calm ? { ...DEFAULT_CONFIG, ...DIALS, settType: calm[1] }
    : { ...DEFAULT_CONFIG, ...DIALS, settType: forced[2], selectedStresses: [forced[1]], selectedStressesRandom: false };
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
}
const crisesOf = (/** @type {any} */ s) => (Array.isArray(s.stress) ? s.stress : [s.stress]).filter(Boolean).map((x) => x.type);
const keepers = (/** @type {any} */ s) => s.npcs.filter((c) => c.title === TITLE);
const townOf = (/** @type {string[]} */ stressTypes) => ({ facts: birthFactsOf({ institutions: [], config: { stressTypes }, tier: 'city' }, null), boundaries: {}, held: null });

describe('POWERS-14 · the coaching inn under a crisis: the declarations', () => {
  it('the welcoming line excludes a siege and a famine, the transactional a siege; the cautious line declares nothing', () => {
    const impressions = TITLE_PRESENTATIONS[TITLE].map((r) => r.impression);
    expect(impressions).toEqual([WELCOMING, TRANSACTIONAL, CAUTIOUS]);
    expect(TITLE_LINE_DECLARATIONS.presentation[WELCOMING]?.excludes).toEqual(['crisis: under_siege', 'crisis: famine']);
    expect(TITLE_LINE_DECLARATIONS.presentation[TRANSACTIONAL]?.excludes).toEqual(['crisis: under_siege']);
    expect(TITLE_LINE_DECLARATIONS.presentation[CAUTIOUS]).toBeUndefined();
  });

  it('settleTitleLines: refused under its crisis, kept (the guard) in calm and under an occupation or a plague', () => {
    const card = (/** @type {string} */ impression) => ({ presentation: { ...TITLE_PRESENTATIONS[TITLE].find((r) => r.impression === impression) } });
    const cases = /** @type {Array<[string, string[], string]>} */ ([
      [WELCOMING, ['under_siege'], CAUTIOUS], [WELCOMING, ['famine'], TRANSACTIONAL], [WELCOMING, ['famine', 'under_siege'], CAUTIOUS],
      [TRANSACTIONAL, ['under_siege'], CAUTIOUS], [TRANSACTIONAL, ['famine'], TRANSACTIONAL],
      [WELCOMING, [], WELCOMING], [WELCOMING, ['occupied'], WELCOMING], [WELCOMING, ['plague_onset'], WELCOMING], [TRANSACTIONAL, ['occupied'], TRANSACTIONAL],
    ]);
    for (const [from, stresses, to] of cases) {
      expect(settleTitleLines(card(from), TITLE, townOf(stresses)).presentation.impression, `${from} under ${stresses.join('+') || 'calm'}`).toBe(to);
    }
  });
});

describe('POWERS-14 · the towns read on the page: no coaching inn under a siege or a famine offers what the crisis took', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  it('every town of the read prints the line its crisis admits (the false towns cured, the true towns kept)', () => {
    /** seed → the keeper's impression the town must print */
    const expected = /** @type {Record<string, string>} */ ({
      // false before (read on the page), the line its crisis admits after
      'r2s-under_siege-town-1': CAUTIOUS, 'r2s-famine-city-1': TRANSACTIONAL, 'r2s-famine-metropolis-3': TRANSACTIONAL,
      'r2s-under_siege-metropolis-0': CAUTIOUS, 'r2s-under_siege-metropolis-3': CAUTIOUS, 'r2r-metropolis-14': CAUTIOUS,
      // the guard towns: read true, kept
      'r2r-city-0': WELCOMING, 'r2s-occupied-city-1': WELCOMING, 'r2s-plague_onset-city-2': WELCOMING, 'r2s-famine-metropolis-0': TRANSACTIONAL,
    });
    expectNoSeedFailures(collectSeedFailures(Object.keys(expected), (seed) => {
      const s = born(seed);
      const ks = keepers(s);
      expect(ks.length, `${seed}: a coaching-inn keeper stands (${crisesOf(s).join('+') || 'calm'})`).toBe(1);
      expect(ks[0].presentation?.impression, `${seed} (${crisesOf(s).join('+') || 'calm'})`).toBe(expected[seed]);
    }), 'every town of the read prints the line its crisis admits');
  }, 300_000);
});
