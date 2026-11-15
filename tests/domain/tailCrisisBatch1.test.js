/**
 * TAIL-CRISIS batch 1 (READ-ALL, 2026-11-14; the chair's rulings K2 and K3): THE CRISIS TEXTS SAY ONLY WHAT THE TOWN BEARS.
 * One collected test on births of the census's own seeds (CENSUS-3 seedcfg.mjs, the r2r-/r2s- arms, copied): each FALSE
 * pair is a (seed, sentence) the town printed at the joined line bcad1a358 and must not print now, with what prints in its
 * place; each KEEP pair is a true sibling that must still print.
 *   faith       domain/dossier/faithReading.js :: observanceOf, faithLinesOf (K2: a quarantine, a siege that cuts off a
 *               neighbour's church)
 *   summary     generators/stressNarrative.js :: RENDERERS (K3: a strong power, caravans, defences; work gangs; contracts)
 *   vantages    domain/crisis/crisisSummaryVantage.js :: CRISIS_SUMMARY_POOLS (officials, offices, lookouts, carts, a power)
 *   starving    generators/economy/outlookHookSiblings.js :: OUTLOOK_HOOK_SIBLINGS (banditry under a siege)
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { faithLinesOf, faithReadingOf } from '../../src/domain/dossier/faithReading.js';
import { crisisSummaryForSurface } from '../../src/domain/crisis/crisisSummaryVantage.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };

/** @type {Map<string, any>} */
const born = new Map();
/** @type {(seed: string) => any} */
let birth;

beforeAll(async () => {
  const { birthConfig, loadGenerationLawPayloads } = await import('../../src/domain/density/densityCreateBoundary.js');
  const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
  const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
  await loadGenerationLawPayloads();
  birth = (seed) => {
    if (born.has(seed)) return born.get(seed);
    let m = seed.match(new RegExp(`^r2r-${SIZE}-(\\d+)$`));
    let cfg;
    if (m) cfg = birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[1] });
    else {
      m = seed.match(new RegExp(`^r2s-(\\w+)-${SIZE}-(\\d+)$`));
      if (!m) throw new Error(`no configuration for ${seed}`);
      cfg = birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] });
    }
    const s = generateSettlementPipeline(cfg, null, { seed, customContent: {} });
    born.set(seed, s);
    return s;
  };
}, 120000);

/** @param {any} s */
const faith = (s) => faithLinesOf(faithReadingOf(s), { tierNoun: s.tier }).join(' ');
/** @param {any} s */
const summary = (s) => [].concat(s.stress || []).map((e) => e?.summary || '').join(' ');
/** @param {any} s */
const vantages = (s) => [].concat(s.stress || []).flatMap((e) => ['cover', 'overview', 'defence', 'tonight'].map((k) => crisisSummaryForSurface(e, s.name, /** @type {any} */ (k)) || '')).join(' ');
/** @param {any} s */
const hooks = (s) => (s.economicViability?.plotHooks || []).map((/** @type {any} */ h) => (typeof h === 'string' ? h : h.hook)).join(' ');

/** [seed, surface, sentence that must NOT print, what prints in its place] */
const FALSE = [
  ['r2s-plague_onset-hamlet-1', faith, 'Devotion runs deep, and the rites set the rhythm of the week.', 'Devotion runs deep, but while the quarantine holds the rites are kept at home, not together.'],
  ['r2s-plague_onset-hamlet-0', faith, 'its people walk to the next village’s parish church for the rites', 'In better times the hamlet’s people walk to the next village for the rites; while the quarantine holds, they do not.'],
  ['r2r-thorp-58', faith, 'Most folk attend the rites through the year.', 'In better times most folk attend the rites through the year; while the road is barred they keep them at home.'],
  ['r2r-thorp-41', faith, 'Devotion runs through every part of life here, and few miss a rite.', 'while the quarantine holds the rites are kept at home, and few miss one.'],
  ['r2s-insurgency-hamlet-0', summary, 'has stopped obeying the government. Its people stall, its taxes go unpaid, and it waits.', 'have stopped obeying the government. They stall, their taxes go unpaid, and they wait.'],
  ['r2s-monster_pressure-thorp-1', summary, 'caravans go missing', 'beasts go missing from the fields'],
  ['r2s-monster_pressure-thorp-1', summary, 'Its defences were built for quieter times.', 'It has nothing built or kept to hold such things off.'],
  ['r2s-slave_revolt-thorp-2', summary, 'Whole work gangs have downed tools', 'Those set to work have downed tools and will not take them up again.'],
  ['r2s-wartime-thorp-2', summary, 'certain families are quietly thriving on contracts', 'The governing authority is demanding sacrifice, and not every household gives it in equal measure.'],
  ['r2r-thorp-58', hooks, 'The settlement is starving, and its hungriest are turning to banditry.', 'The settlement is starving, and its hungriest steal what food they can find.'],
  ['r2r-thorp-52', vantages, 'officials who will not act', 'orders go unheeded and dues unpaid'], // TAIL-CRISIS-4 (K18): re-keyed by identity (the line now says the quarrel has turned to violence)
  ['r2r-thorp-52', vantages, 'one of its strongest powers is defying them', 'some of its people are defying them'],
  ['r2s-monster_pressure-thorp-0', vantages, 'the lookouts count the days between attacks', 'and people count the days between attacks'],
  ['r2s-monster_pressure-thorp-3', vantages, 'Every cart that fails to reach', 'goes without more of what it needs, and the shortfall grows'],
  ['r2r-thorp-22', vantages, 'offices no longer send their revenue on', 'no longer reaches it, and the government runs on less each season'],
  ['r2s-indebted-thorp-2', vantages, 'before you meet its own officials', 'before you meet anyone who speaks for the place'],
];

/** [seed, surface, true sibling that must still print] */
const KEEP = [
  ['r2r-thorp-0', faith, 'The thorp has no church of its own; its people walk to the next village’s parish church for the rites.'],
  ['r2r-thorp-58', faith, 'the siege keeps its people from the next village’s parish church'],
  ['r2s-monster_pressure-city-0', summary, 'caravans go missing, and a farmstead was lost to fire last week. Its defences were built for quieter times.'],
  ['r2s-slave_revolt-town-0', summary, 'Whole work gangs have downed tools and will not take them up again.'],
  ['r2r-thorp-16', summary, 'The governing authority is demanding sacrifice while certain families are quietly thriving on contracts.'],
  ['r2r-thorp-17', hooks, 'The settlement is starving, and its hungriest are turning to banditry.'],
];

describe('TAIL-CRISIS batch 1: no false crisis line where the town makes it false', () => {
  // plain loops over the rows (the sovereignty walker's park debt: no new `each` call)
  it('each FALSE pair does not print the false line, and prints its twin', () => {
    const failures = collectSeedFailures(FALSE, ([seed, surface, wrong, instead]) => {
      const text = /** @type {(s: any) => string} */ (surface)(birth(/** @type {string} */ (seed)));
      expectAbsentWithAnchor(text, wrong, instead, String(seed));
    });
    expectNoSeedFailures(failures, 'a FALSE line printed, or its twin did not');
  }, 120000);
  it('each KEEP pair keeps its true line', () => {
    const failures = collectSeedFailures(KEEP, ([seed, surface, line]) => {
      expect(/** @type {(s: any) => string} */ (surface)(birth(/** @type {string} */ (seed))), `${seed}: ${line}`).toContain(line);
    });
    expectNoSeedFailures(failures, 'a KEEP line no longer prints');
  }, 120000);
});
