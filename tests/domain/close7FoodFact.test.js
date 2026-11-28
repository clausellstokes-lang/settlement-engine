/**
 * tests/domain/close7FoodFact.test.js — R24-A2 (CLOSE-7; the chair's RULING-R24 and his rulings R24a and R24c of 2026-11-24):
 * RICH AND HUNGRY, CURED AT THE FACT THE LINES READ.
 *
 * A line that says people go short read the food CAPACITY band (production against need, imports not counted), never the
 * food ledger the page prints as Food Security. THE ONE FOOD FACT IS THE WORD THE PAGE PRINTS (the `food` atom, on
 * `famineOf(r).shownBand`). R24d: THE PRINTED BAND BOUNDS THE FARE; PRODUCTION PLACES IT WITHIN THE BOUND (Secure or
 * Surplus: surplus..adequate; Pressured: adequate..strained; Import-Dependent or Deficit: strained..critical; Famine:
 * critical..collapsed). ONE derivation (`domain/dailyLife.js :: fareBandOf`) is read by the fare, the food grievance, the
 * food visitor lens and Dawn Work's food branch. THE MIRROR (CLOSE-7, after A2; R24d's words): a printed Famine over full
 * fields reads `critical` like every other Famine, its lines that say the source failed (C7, F6) giving way to the chair's
 * (K2, K1): `tests/domain/close7Mirror.test.js`.
 *
 *   (a) RED FIRST, BY NAME: V dp-city-83 (Wealthy, production strained, printed Secure), three census places whose
 *       production reads critical while the page prints Secure (dp-town-27, dp-city-12, dp-metropolis-3), and one
 *       secure|critical place of V whose Dawn Work said "the search for food" (dp-town-13; C's is dp-town-27).
 *   (b) THE CONTROLS (R24a (a)): V dp-metropolis-57 and the twin of dm24-hamlet-1 print "Pressured", so their shortage
 *       line is coherent and stays.
 *   (c) THE BOUND (R24d): a census place of each cell outside its bound, two inside, and the mirror's cell.
 *   (d) WORDS-2, the tenth chair's RULING G6 #8 (the mirror of R24h): under a printed "Pressured" (the Economics tab: the
 *       place falls a little short, "tighter belts") no fare line says nobody goes hungry or without (A7, A16 exclude
 *       `food: = pressured`). Red first by name on 0ec96f13d8: C dp-city-73 (A7); V dp-hamlet-144 (A7), dp-village-31 (A16).
 *   THE TOTALITY ARM (R24c) is a lint arm: `tests/lint/foodBandReaders.walker.test.js`.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { deriveDailyLife } from '../../src/domain/dailyLife.js';
import { FOOD_CULTURE } from '../../src/data/dailyLife/foodCulture.js';
import { COMMONER_RESENTMENTS } from '../../src/data/dailyLife/commonerResentments.js';
import { OUTSIDER_IMPRESSIONS } from '../../src/data/dailyLife/outsiderImpressions.js';
import { DAWN_WORK } from '../../src/data/dailyLife/dawnWork.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { atomHolds } from '../../src/domain/facts/factVocabulary.js';
import { birth as soakBirth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { foodBandShownKey } from '../../src/domain/facts/foodBandShown.js';

/** A pool line's printed form: its `{slot}` read as any name. @param {string} t */
const formOf = (t) => new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\{[a-z]+\\\}/g, '.+?'));
/** THE SHORTAGE LINES, as classed in CHAIN-1-LISTS (c) and ruled in R24a ("your classing stands, T4 as SHORTAGE") and R24c (c). */
const SHORTAGE = Object.freeze([
  ...['strained', 'critical', 'collapsed'].flatMap((b) => FOOD_CULTURE[/** @type {keyof typeof FOOD_CULTURE} */ (b)].map((l) => ({ where: `food_culture.${b}.${l.id}`, re: formOf(l.text) }))),
  ...COMMONER_RESENTMENTS.food.filter((l) => !['F0', 'F6', 'F8'].includes(l.id)).map((l) => ({ where: `commoner_resentments.food.${l.id}`, re: formOf(l.text) })),
  ...OUTSIDER_IMPRESSIONS['services.food_production'].filter((l) => ['F1', 'F2'].includes(l.id)).map((l) => ({ where: `outsider_impressions.services.food_production.${l.id}`, re: formOf(l.text) })),
  ...DAWN_WORK.food.map((l) => ({ where: `dawn_work.food.${l.id}`, re: formOf(l.text) })),
]);

/** @param {string} seed @param {'C'|'V'} corpus */
function birth(seed, corpus) {
  const settType = seed.split('-')[1];
  const config = corpus === 'C' ? { settType } : { ...DEFAULT_CONFIG, settType, _randomizePriorities: true };
  return generateSettlementPipeline(birthConfig(config), null, { seed, customContent: {} });
}
/** @param {unknown} s */
const slotsOf = (s) => deriveDailyLife(/** @type {any} */ (s), { audience: 'owner' }).slots;
/** The shortage lines the owner's Daily Life tab says. @param {unknown} s */
const shortageSaid = (s) => {
  const slots = slotsOf(s);
  const text = ['food_culture', 'commoner_resentments', 'outsider_impressions', 'dawn_work'].map((k) => String(slots[k]?.text || '')).join('\n');
  return SHORTAGE.filter((l) => l.re.test(text)).map((l) => l.where);
};
/** The fare branch the food line came from (its pool), or null. @param {unknown} s */
const fareBranch = (s) => {
  const t = String(slotsOf(s).food_culture?.text || '');
  return Object.entries(FOOD_CULTURE).find(([, lines]) => lines.some((l) => formOf(l.text).test(t)))?.[0] ?? null;
};

beforeAll(async () => { await loadGenerationLawPayloads(); }, 120000);

describe('(a) red first, by name: no shortage line where the page prints Secure', () => {
  it('the classing: 24 fare lines, 11 grievances, 2 visitor lines and Dawn Work\'s 8 food lines say people go short', () => {
    // 23 and 7 at A2; THE MIRROR (R24d) adds the chair's K2 to the critical fare and K1 to Dawn Work's food branch
    expect(SHORTAGE.length).toBe(45);
  });
  for (const [corpus, seed] of /** @type {const} */ ([['V', 'dp-city-83'], ['C', 'dp-town-27'], ['C', 'dp-city-12'], ['C', 'dp-metropolis-3'], ['V', 'dp-town-13']])) {
    it(`${corpus} ${seed}`, () => {
      const s = birth(seed, corpus);
      expect(atomHolds('food: ≥ secure', factsOf(s)), `${seed}: the page prints Secure or Surplus`).toBe(true);
      expect({ seed, said: shortageSaid(s) }).toEqual({ seed, said: [] });
    }, 120000);
  }
});

describe('(b) the controls: a printed "Pressured" keeps its shortage line (R24a (a))', () => {
  it('V dp-metropolis-57 prints Pressured, and its fare still says people go short', () => {
    const s = birth('dp-metropolis-57', 'V');
    expect(atomHolds('food: = pressured', factsOf(s))).toBe(true);
    expect(shortageSaid(s).some((w) => w.startsWith('food_culture.'))).toBe(true);
  }, 120000);
  it('the twin of dm24-hamlet-1 (read24/dm24-twins.jsonl: the visitor\'s hamlet config, seed dm24-hamlet-1) prints Pressured, and keeps it', () => {
    const s = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: 'hamlet', _randomizePriorities: true }), null, { seed: 'dm24-hamlet-1', customContent: {} });
    expect(s.name).toBe('Khirbetpur');
    expect(atomHolds('food: = pressured', factsOf(s))).toBe(true);
    expect(shortageSaid(s).some((w) => w.startsWith('food_culture.'))).toBe(true);
  }, 120000);
});

describe('(c) the bound (R24d): the printed band bounds the fare, production places it within', () => {
  /** [seed, printed, production at d447ee31e, the fare branch now]: a census place of each cell outside its bound, two inside, and the mirror's cell. */
  const CELLS = /** @type {const} */ ([
    ['dp-thorp-12', 'deficit', 'critical', 'critical'], // inside its bound: unchanged
    ['dp-town-36', 'deficit', 'collapsed', 'critical'],
    ['dp-city-81', 'deficit', 'adequate', 'strained'],
    ['dp-village-52', 'famine', 'strained', 'critical'],
    ['dp-village-5', 'pressured', 'surplus', 'adequate'],
    ['dp-metropolis-32', 'pressured', 'critical', 'strained'],
    ['dp-thorp-2', 'secure', 'adequate', 'adequate'], // inside its bound: unchanged
    ['dp-village-51', 'famine', 'adequate', 'critical'], // THE MIRROR (R24d): held at A2 ('adequate'), now inside its bound
  ]);
  for (const [seed, printed, production, branch] of CELLS) {
    it(`C ${seed}: printed ${printed} over production ${production} reads the ${branch} fare`, () => {
      const s = birth(seed, 'C');
      expect(atomHolds(`food: = ${printed}`, factsOf(s)), seed).toBe(true);
      expect(fareBranch(s), seed).toBe(branch);
    }, 120000);
  }
});

describe('(d) G6 #8: under a printed "Pressured" no fare line says nobody goes hungry or without', () => {
  const NONE_SHORT = FOOD_CULTURE.adequate.filter((l) => ['A7', 'A16'].includes(l.id)).map((l) => formOf(l.text));
  for (const [corpus, seed] of [['C', 'dp-city-73'], ['V', 'dp-hamlet-144'], ['V', 'dp-village-31']]) {
    it(`${corpus} ${seed}`, () => {
      const s = birth(seed, /** @type {any} */ (corpus));
      expect(atomHolds('food: = pressured', factsOf(s))).toBe(true);
      const text = Object.values(deriveDailyLife(s).slots).map((x) => x.text).join(' ');
      expect(text.length).toBeGreaterThan(0);
      expect(NONE_SHORT.filter((re) => re.test(text)).map(String)).toEqual([]);
    });
  }
});

// CURE-118 (3), the tenth chair's G45 (8): G6 #8 refused "nobody goes hungry / without" (A7, A16) under a printed
// Pressured, and the claim moved to its siblings. Read whole, A4 ("every household has enough") and A14 ("the rest eat
// plainly but enough") say every household has enough: THE SAME CLAIM, so the same mark. A3 ("Most households … eat
// enough") leaves some short and is kept. Red first by name on 55bbd338a3: soak1k-26 printed A4, soak1k-51 A14.
describe('(e) CURE-118 (3): every line of the "nobody goes short" claim refuses a printed "Pressured"', () => {
  const CLAIM = ['A4', 'A7', 'A14', 'A16'];
  it('every line of the claim excludes `food: = pressured`', () => {
    for (const id of CLAIM) expect(FOOD_CULTURE.adequate.find((l) => l.id === id)?.excludes, id).toContain('food: = pressured');
  });
  for (const i of [26, 51]) {
    it(`soak1k-${i}`, async () => {
      await ensureLaws();
      const s = soakBirth(i).settlement;
      expect(foodBandShownKey(s?.economicState?.foodSecurity?.foodRecord), 'the page prints Pressured').toBe('pressured');
      const text = String(deriveDailyLife(s, { audience: 'owner' }).slots.food_culture?.text || '');
      expect(text.length, 'the fare slot prints a line').toBeGreaterThan(0);
      const said = FOOD_CULTURE.adequate.filter((l) => CLAIM.includes(l.id) && formOf(l.text).test(text)).map((l) => l.id);
      expect(said, text).toEqual([]);
    }, 120_000);
  }
});
