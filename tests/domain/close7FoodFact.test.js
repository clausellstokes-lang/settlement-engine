/**
 * tests/domain/close7FoodFact.test.js — R24-A2 (CLOSE-7; the chair's RULING-R24 and his rulings R24a and R24c of 2026-11-24):
 * RICH AND HUNGRY, CURED AT THE FACT THE LINES READ.
 *
 * A line that says people go short read the food CAPACITY band (production against need, imports not counted), never the
 * food ledger the page prints as Food Security. THE ONE FOOD FACT IS THE WORD THE PAGE PRINTS (the `food` atom, on
 * `famineOf(r).shownBand`). R24d: THE PRINTED BAND BOUNDS THE FARE; PRODUCTION PLACES IT WITHIN THE BOUND (Secure or
 * Surplus: surplus..adequate; Pressured: adequate..strained; Import-Dependent or Deficit: strained..critical; Famine:
 * critical..collapsed). ONE derivation (`domain/dailyLife.js :: fareBandOf`) is read by the fare, the food grievance, the
 * food visitor lens and Dawn Work's food branch. HELD (R24c (a), R24d: the mirror's own unit): a printed Famine over full
 * fields keeps the production band.
 *
 *   (a) RED FIRST, BY NAME: V dp-city-83 (Wealthy, production strained, printed Secure), three census places whose
 *       production reads critical while the page prints Secure (dp-town-27, dp-city-12, dp-metropolis-3), and one
 *       secure|critical place of V whose Dawn Work said "the search for food" (dp-town-13; C's is dp-town-27).
 *   (b) THE CONTROLS (R24a (a)): V dp-metropolis-57 and the twin of dm24-hamlet-1 print "Pressured", so their shortage
 *       line is coherent and stays.
 *   (c) THE BOUND (R24d): a census place of each cell outside its bound, two inside, and the held mirror.
 *   (t) THE TOTALITY ARM (R24c): every file of `src` that reads the production band (the capacity model, the
 *       `food_production` capacity) or the fare band is classed SAYS SHORTAGE, SAYS SOURCE, NEITHER or HOME, by its exact
 *       count of reading lines; a new reader, or a new read in a classed file, reds.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
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
  it('the classing: 23 fare lines, 11 grievances, 2 visitor lines and Dawn Work\'s 7 food lines say people go short', () => {
    expect(SHORTAGE.length).toBe(43);
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
  /** [seed, printed, production at d447ee31e, the fare branch now]: a census place of each cell outside its bound, two inside, and the held mirror. */
  const CELLS = /** @type {const} */ ([
    ['dp-thorp-12', 'deficit', 'critical', 'critical'], // inside its bound: unchanged
    ['dp-town-36', 'deficit', 'collapsed', 'critical'],
    ['dp-city-81', 'deficit', 'adequate', 'strained'],
    ['dp-village-52', 'famine', 'strained', 'critical'],
    ['dp-village-5', 'pressured', 'surplus', 'adequate'],
    ['dp-metropolis-32', 'pressured', 'critical', 'strained'],
    ['dp-thorp-2', 'secure', 'adequate', 'adequate'], // inside its bound: unchanged
    ['dp-village-51', 'famine', 'adequate', 'adequate'], // HELD: the mirror's own unit (R24c (a), R24d)
  ]);
  for (const [seed, printed, production, branch] of CELLS) {
    it(`C ${seed}: printed ${printed} over production ${production} reads the ${branch} fare`, () => {
      const s = birth(seed, 'C');
      expect(atomHolds(`food: = ${printed}`, factsOf(s)), seed).toBe(true);
      expect(fareBranch(s), seed).toBe(branch);
    }, 120000);
  }
});

// ── (t) THE TOTALITY ARM (R24c: "a fifth must not be found by a reader's luck") ──
const ROOT = resolve(__dirname, '../..');
/** A line that reads the production band or the fare band: the capacity model imported, the capacity named, the fare band asked. */
const READS = /food_production|fareBandOf\(|from\s+['"][^'"]*capacityModel\.js['"]/;
/**
 * THE WHOLE LIST: every file of `src` with such a line, its exact count of such lines (comments out), and its class.
 * SAYS SHORTAGE: it chooses a line that says people go short; SAYS SOURCE: a line of where food comes from; NEITHER: it
 * chooses no such line (it states the band as the band, cites it, compares it, or is an instrument); HOME: it writes it.
 */
const FOOD_BAND_READERS = Object.freeze({
  'src/domain/dailyLife.js': [15, 'SAYS SHORTAGE', 'the four line-choosers, each by the FARE BAND (`fareBandOf`, the one reader of the production band here): the fare (`deriveFoodCulture`: SAYS SHORTAGE in strained/critical/collapsed, SAYS SOURCE in A12, S5, S9, A10, A11, else NEITHER), Dawn Work\'s food branch (SAYS SHORTAGE), the food grievance (SAYS SHORTAGE; its price-only F0, F6, F8 NEITHER, kept on the production band where a market stands) and the food visitor lens (SAYS SHORTAGE: F1, F2); the slots\' citations of `capacity.food_production` (NEITHER: references, no line); `fareBandOfRecord`, the same derivation for a reader outside the slots'],
  'src/data/dailyLife/outsiderImpressions.js': [2, 'SAYS SHORTAGE', 'the food visitor pool `services.food_production` and its declaration (`food:want`): chosen by dailyLife.js by the fare band'],
  'src/domain/coherence/pageCensusFindings.js': [1, 'NEITHER', 'the battery\'s row FOODSEC reads the visitor pool by its key: an instrument, it prints nothing'],
  'src/domain/capacityModel.js': [4, 'HOME', 'the capacity model writes the production band'],
  'src/domain/aiGrounding.js': [2, 'NEITHER', 'the bands handed to the AI layer as grounding facts, the band as the band'],
  'src/domain/causalViews.js': [1, 'NEITHER', 'the simulation view counts the capacities; no line'],
  'src/domain/contradictions.js': [3, 'NEITHER', 'a diagnostic that sets food security against food production'],
  'src/domain/counterfactual.js': [1, 'NEITHER', 'before and after capacity states compared; the band as the band'],
  'src/domain/customContent.js': [2, 'NEITHER', 'a custom content kind that adds food production supply'],
  'src/domain/display/glossary.js': [1, 'NEITHER', 'the band words\' glossary'],
  'src/domain/explanation.js': [2, 'NEITHER', 'the explanation states the capacity\'s band, supply and demand'],
  'src/domain/magicProfile.js': [1, 'NEITHER', 'reads the magic capacity only'],
  'src/domain/qualitativeBands.js': [1, 'NEITHER', 'a band looked up by id'],
  'src/domain/regenerationDelta.js': [1, 'NEITHER', 'the capacity shifts between two births; the band as the band'],
});
const CLASSES = new Set(['SAYS SHORTAGE', 'SAYS SOURCE', 'NEITHER', 'HOME']);

describe('(t) the totality arm: every reader of the production band or the fare band is classed', () => {
  const walk = (/** @type {string} */ d, /** @type {string[]} */ o = []) => {
    for (const e of readdirSync(d)) { const p = join(d, e); if (statSync(p).isDirectory()) walk(p, o); else if (/\.(js|jsx|mjs)$/.test(e)) o.push(p); }
    return o;
  };
  /** @type {Record<string, number>} */ const found = {};
  for (const f of walk(join(ROOT, 'src'))) {
    const code = readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' ')).split('\n').map((l) => l.replace(/\/\/.*$/, ''));
    const n = code.filter((l) => READS.test(l)).length;
    if (n) found[relative(ROOT, f)] = n;
  }
  it('anti-vacuity: the walk finds the home and the fare', () => {
    expect(found['src/domain/capacityModel.js']).toBeGreaterThan(0);
    expect(found['src/domain/dailyLife.js']).toBeGreaterThan(0);
  });
  it('every reading file is classed, with its exact count of reading lines (a new reader or a new read reds)', () => {
    expect(found).toEqual(Object.fromEntries(Object.entries(FOOD_BAND_READERS).map(([f, [n]]) => [f, n])));
    for (const [f, [, cls, why]] of Object.entries(FOOD_BAND_READERS)) {
      expect(CLASSES.has(cls), f).toBe(true);
      expect(why.length, f).toBeGreaterThan(20);
    }
  });
  it('in dailyLife.js the production band is read twice: by the fare band, and by the price-only grievance', () => {
    const src = readFileSync(join(ROOT, 'src/domain/dailyLife.js'), 'utf8');
    expect(src.match(/capacities\.food_production\.band/g)?.length).toBe(2);
  });
});
