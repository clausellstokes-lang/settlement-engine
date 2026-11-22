/**
 * tests/generators/bar2PlacesRows.test.js — BAR2-PLACES (REVIEW-BAR-2, 2026-11-15; the chair's rulings PL1, PL2, PL4, PL6):
 * the rows of the seat's four groups, cured at their writers and read on census births (the census's own seeds, born as
 * the census bears them, CENSUS-3 seedcfg.mjs). Each CURED row names the line that must no longer print in that town AND
 * what prints in its place (anchored: the replacement is asserted present first); each KEEP row is a true sibling that must
 * still print. Every CURED row was red at the base (f8042b61a): the census record of that seed held the old line.
 *
 * - origin (settlementOriginProse.js :: ORIGIN_POOLS): no row claims generations or gives the road an age in years; the
 *   road row claims the road and the meal, not the living; the river row claims no mill.
 * - foodways (cultureProfiles.js) and the arrival (arrivalProse.js): no oven house, no crowd, no busy street, no ore, no
 *   carpenter the town does not hold.
 * - houses (institutionalCatalog.js, institutionDescVariants.js): no "ruling" or "dominant" syndicate, no merchant "power",
 *   no "hamlet" in a village, no gate the town may lack.
 * - the war (stressNarrative.js :: wartimeGoesWell; narrativeText.js): the Overview's war line and the crisis summary
 *   tell ONE side of the war; the loss line claims no hollowed-out workforce.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { ARRIVAL_TENSIONS } from '../../src/data/arrivalProse.js';
import { textOf } from '../../src/domain/facts/textOf.js';
import { ORIGIN_POOLS } from '../../src/generators/narrative/settlementOriginProse.js';
import { ORIGIN_VARIANTS } from '../../src/data/settlementReasonVariants.js';

/**
 * RE-KEYED BY IDENTITY 2026-11-20 (L2, the chair's word of 15:35; the arrival pools APPENDED, so the draw moved): "what prints instead" on an
 * arrival slot, COMPUTED from the slot's own pool export, never quoted: any of its lines but the flagged words (`{name}` any name).
 * The reader's town stays the guard town; the slot is shown live whichever of its lines the draw lands on.
 * @param {ReadonlyArray<any>} pool @param {RegExp} gone @returns {RegExp}
 */
const slotOf = (pool, gone) => new RegExp(pool.map((l) => { const t = textOf(l); return String(typeof t === 'function' ? t('@@NAME@@') : t); })
  .filter((t) => !gone.test(t)).map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').split('@@NAME@@').join('[^"]+?')).join('|'));

/**
 * WIDENED TO THE POOL at PEOPLE-3 B3 (2026-11-22; the brief P3-B3-resume-BUILD.md, item 1: "re-keyed by identity or widened to the
 * pool (never a blind re-record)"): "what prints instead" on the origin line, COMPUTED from the arm's own pools, never quoted: the
 * record's `settlementReason[0]` is any line of the arm's pool (`settlementOriginProse.js :: ORIGIN_POOLS`) or of the wordings that
 * follow it (`settlementReasonVariants.js :: ORIGIN_VARIANTS`), but the flagged words; each slot any phrase.
 * @param {'road' | 'river' | 'crossroads'} arm @param {RegExp} gone @returns {RegExp}
 */
const originOf = (arm, gone) => {
  const lines = [...ORIGIN_POOLS[arm], ...ORIGIN_VARIANTS[arm].map((row) => row.text)].filter((t) => !gone.test(t));
  const wild = (/** @type {string} */ t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\{(?:ground|holds|channels|export|routeWay)\\\}/g, '[^"]+?');
  return new RegExp(`"settlementReason":\\["(?:${lines.map(wild).join('|')})"`);
};

const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** The census's own configuration for its two seed families (CENSUS-3 seedcfg.mjs, r2r- and r2s-). @param {string} seed */
const cfgFor = (seed) => {
  let m = seed.match(/^r2r-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: m[1] });
  // the bar's own read (REVIEW-BAR-0 render.bar0.jsx's cfgFor, its bar0- arm, as CENSUS-3 seedcfg.mjs copies it)
  m = seed.match(/^bar0-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-([a-z_]+)-\d+$/);
  if (m) {
    const st = m[2] === 'calm' ? [] : m[2].split('+'); const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
    return birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: st, _randomizePriorities: true });
  }
  m = /** @type {RegExpMatchArray} */ (seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/));
  return birthConfig({ ...DEFAULT_CONFIG, ...dials, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] });
};
/** @type {Map<string, any>} */
const births = new Map();
/** @param {string} seed @returns {any} */
const born = (seed) => {
  if (!births.has(seed)) births.set(seed, generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} }));
  return births.get(seed);
};
/** Every string the record holds, joined (the rows below live in several fields: origin, arrival, foodways, houses). @param {string} seed */
const textOfRecord = (seed) => JSON.stringify(born(seed));

describe('BAR2-PLACES: the rows read the town', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  /** [row, seed, must not print, what prints instead] */
  const CURED = /** @type {Array<[string, string, RegExp, RegExp]>} */ ([
    ['C24150 no generations', 'r2r-thorp-10', /for generations its news came/, originOf('road', /for generations its news came/)], // widened to the pool at PEOPLE-3 B3 (2026-11-22, `originOf`): the town prints a line of its own arm on its own facts (src/data/settlementReasonVariants.js)
    ['C29731 no road age', 'r2r-thorp-5', /a road a century old/, originOf('road', /a road a century old/)], // widened to the pool at PEOPLE-3 B3 (2026-11-22, `originOf`): the town prints a line of its own arm on its own facts (src/data/settlementReasonVariants.js)
    ['C25604 the road, not the living', 'r2r-hamlet-32', /makes its living from other people's journeys/, originOf('road', /makes its living from other people's journeys/)], // widened to the pool at PEOPLE-3 B3 (2026-11-22, `originOf`): the town prints a line of its own arm on its own facts (src/data/settlementReasonVariants.js)
    ['C14951 no mill claimed', 'r2r-thorp-1', /All three still hold/, /Built on the river: it gives the place its water, and carries what the fields produce, as it always has\./],
    ['C25910 no public ovens', 'r2r-village-25', /Public ovens/, /Market vendors and shared dining customs make food distribution visibly civic\./],
    ['C26954 no shared ovens', 'r2r-thorp-23', /and shared ovens stretch/, /Fermentation, pickling, and drying stretch the harvest through winter\./],
    // RE-KEYED BY IDENTITY 2026-11-20 (L2, the chair's word of 15:35; the arrival pools APPENDED, so the draw moved): r2r-thorp-10 -> r2r-thorp-23, a slavic thorp (the row above's
    // own town) whose people line is the oven's reword
    ['C26954 class: the arrival oven', 'r2r-thorp-23', /Smoke rises from a shared oven/, /Smoke rises from a household oven, and a neighbour stops in to share its warmth\./],
    ['C14917 no crowd', 'r2r-hamlet-5', /for a crowd to gather/, /loudly enough for the neighbours to stop and listen\./],
    // RE-KEYED BY IDENTITY 2026-11-20 (L2, the chair's word of 15:35; the arrival pools APPENDED, so the draw moved): the anchor was 'Well-fed children run errands from door to door.';
    // the thorp keeps the guard, its tension slot computed from the prosperous pool
    ['C23710 no busy street', 'r2r-thorp-49', /through a busy street/, slotOf(ARRIVAL_TENSIONS.prosperous, /through a busy street/)],
    // RE-KEYED BY IDENTITY 2026-11-18 (BAR8-SCENES-3, BR25 (4)): the anchor was the endless line in r2r-hamlet-6; BAR8-SCENES (K's 15a)
    // refused it below a village, and the small working quarry's twin prints there now, by design. The same claim (no ore claimed; the
    // slot says what the record bears) on the line that prints, and beside it a town of a village or more where the endless line prints
    ['C10029 no ore', 'r2r-hamlet-6', /Ore carts and stone carts/, /A laden cart or two comes down from the workings in a day, and no more\./],
    ['C10029 no ore (a village or more)', 'r2r-city-30', /Ore carts and stone carts/, /Laden carts from the workings grind along the road/],
    ["C34242 no carpenter's bench", 'r2r-thorp-41', /a carpenter's bench/, /Curls of shavings and chips of bark blow across the lane\./],
    ['C15795 no ruling syndicate', 'r2r-metropolis-30', /The ruling criminal syndicate/, /The criminal syndicate the city has never rooted out/],
    ['C15795 class: no dominant power', 'r2r-metropolis-5', /A dominant underworld power/, /An underworld power the city has never rooted out/],
    ['C15795 class: the canonical', 'r2r-metropolis-4', /Dominant criminal syndicate/, /A criminal syndicate the city has never rooted out, for fear of the gang war that would follow\./],
    ['C0434 no merchant power', 'r2r-city-1', /In trade, a power in their own right/, /Between them they handle much of the city's trade\./],
    ['C0434 class: no force to be reckoned with', 'r2r-city-2', /A force to be reckoned with/, /Much of the city's trade is in their hands\./],
    ['C0434 class: the canonical', 'r2r-city-0', /A power in the city's trade/, /They handle much of the city's trade\./],
    ['C34394 the village is a village', 'r2r-village-4', /The hamlet benefits from fees/, /The village benefits from fees paid in kind\./],
    ['C27929 no gate presumed', 'r2r-town-9', /buries beyond the gate/, /Each congregation keeps its own burial ground, and one that has filled its ground buries beyond the town's edge instead\./],
    ['C5767 no hollowed-out workforce', 'r2s-wartime-thorp-0', /Conscription has hollowed out/, /The war reaches .+ as a series of demands rather than battles/], // BAR6-SCENES (2026-11-16, LAW 9 rule 9f; re-keyed by identity): a town under a legitimacy crisis: the row that calls it loyal is refused and resolves to the next
    // batch 2 (the chair's grant VW2: the atoms `patrol` and `iron at hand`), on the towns the bar's readers met
    ['C3297 no blades without iron', 'bar0-city-under_siege+famine-rand-5', /sound of blades being made/, /The forges of \S+ stand cold: there is no iron left to make blades from\./],
    ['C34238 no enforced order without a patrol', 'bar0-village-famine-rand-5', /orderly in the way that a settlement is orderly/, /is quiet in the way a hungry settlement is quiet\. The rationing markers are painted on the doors, and people keep to their own thresholds\./],
    ['C34241 no guard patrol with a militia alone', 'bar0-village-famine-rand-5', /A guard patrol passes/, /people keep to their own thresholds\. Curls of shavings and chips of bark blow across the lane\./],
  ]);
  it('the flagged line no longer prints, and its slot says what the record bears (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(CURED, ([id, seed, gone, instead]) => {
      const text = textOfRecord(seed);
      expect(text, `${id} ${seed}: what prints instead`).toMatch(instead);
      expect(text, `${id} ${seed}: the flagged line`).not.toMatch(gone); // anchored: the line above asserts the slot printed
    }), 'the flagged line no longer prints');
  });

  /** [row, seed, the true sibling that must still print] */
  const KEEP = /** @type {Array<[string, string, RegExp]>} */ ([
    ['the river: the water was the only road', 'r2r-thorp-0', /Sited at the water's edge, where the river was the only road worth having/],
    ['VW2: blades where the iron is at hand (local)', 'r2r-town-59', /The hammering echoes throughout \S+, and most of it is the sound of blades being made\./],
    ['VW2: blades where the iron is at hand (imported, no siege)', 'r2r-metropolis-41', /most of it is the sound of blades being made\./],
    ['VW2: the patrol where a garrison stands', 'r2r-city-44', /A guard patrol passes and everyone steps aside\./],
  ]);
  it('the true siblings still print (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(KEEP, ([id, seed, kept]) => {
      expect(textOfRecord(seed), `${id} ${seed}`).toMatch(kept);
    }), 'the true siblings still print');
  });

  /** PL6: the towns whose Overview and crisis summary told two sides of one war at the base. */
  const WAR = ['r2s-wartime-village-0', 'r2s-wartime-town-2', 'r2s-wartime-metropolis-1', 'r2s-wartime-metropolis-3', 'r2s-wartime-city-1'];
  it('the Overview and the crisis summary tell one side of the war (PL6)', () => {
    expectNoSeedFailures(collectSeedFailures(WAR.map((seed) => [seed]), ([seed]) => {
      const s = born(seed);
      const entries = Array.isArray(s.stress) ? s.stress : [s.stress];
      const war = entries.find((/** @type {any} */ e) => e?.type === 'wartime');
      expect(typeof war?.summary, `${seed}: a wartime summary stands`).toBe('string');
      const profit = /doing well out of it/.test(war.summary);
      const right = /on the right side of it|prospering on the right side/i.test(String(s.pressureSentence));
      expect(right, `${seed}: the Overview's side (${String(s.pressureSentence).slice(0, 60)}) agrees with the summary's (${profit ? 'profit' : 'loss'})`).toBe(profit);
    }), 'one side of the war');
  });
});
