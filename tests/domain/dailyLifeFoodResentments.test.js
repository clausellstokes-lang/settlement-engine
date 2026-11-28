/**
 * tests/domain/dailyLifeFoodResentments.test.js — DAILY-3 · B3 E2, THE PUBLIC `commoner_resentments` AND `food_culture`
 * (DAILY-1 `lines/L2/LINES-2.md` § 1 and § 2, revised by `LINES-2b.md` § 5 and § 7, as the chair ruled; the dispatch
 * `docs/chair/2026-11-20/content/daily/briefs/B3-E2-DAILY-3-DISPATCH.md`).
 *
 * On 30 born places (five a size, M1's births `hxd-<size>-0..4`; the 900 live in `measures/B3/E2`):
 *   (a) M1's FALSE LINES (`measures/M1/measure.m1.mjs` rows 187-199, the record test each clause presumes): "of any
 *       town" at a small place; "the council's indifference" / "the council's favorite" with no ruling body; "market
 *       day" / "merchants who claim" / "markets close their stalls" with no market; "the gate fee" with no gate;
 *       "favorite tavern" with no tavern; "the wealthier streets" at a thorp or a hamlet; "temple kitchens" with no
 *       sacred house; "caravans that never arrived" with no trade route. Each prints on no place.
 *   (b) THE CALM RULE (ruling 8): a place whose record holds no grievance (public legitimacy above strained, the food band
 *       above strained, no popular uprising) says none: `commoner_resentments` is the EMPTY string (ruling 3).
 *   (c) THE ROUTE (ruling 11): every printed sentence of the two slots is its branch's line of the slot's own pool
 *       (`src/data/dailyLife/foodCulture.js`, `src/data/dailyLife/commonerResentments.js`), admitted by its declared
 *       atoms (`facts/drawDeclared.js :: filterDeclared`) and picked by `pickRendezvous` keyed
 *       `<the town's pick key: its id (point 124)>::dailyLife.<slot>::<branch>`; `{gov}` the government's label with its article.
 *   (d) No "town" at a place smaller than a town, no bracket.
 *   (e) THE CHAIR'S LINES OF B3 F1 (`DAILY-3-HANDBACK.md` § 2 items 4 and 5; the dispatch `B3-F1-DAILY-3-DISPATCH.md`):
 *       food A4, A12, T9, C5 and resentments F0 are in their pools with the ruled texts and needs, and none prints where
 *       its record lacks grain, an import of grain or a market (the 900 live in `measures/B3/F1`).
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { deriveDailyLife, fareBandOfRecord } from '../../src/domain/dailyLife.js';
import { deriveAllThreatProfiles } from '../../src/domain/threatProfile.js';
import { deriveCausalState } from '../../src/domain/causalState.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { deriveAllCapacities } from '../../src/domain/capacityModel.js'; // CLOSE-7 THE MIRROR: the profile the pools' `food production` atom reads
import { defenceOf } from '../../src/domain/facts/defence.js';
import { hasInstitution } from '../../src/domain/facts/institutions.js';
import { marketOf } from '../../src/domain/facts/market.js';
import { rulingBodyOf } from '../../src/domain/facts/rulingBody.js';
import { tradeRouteOf } from '../../src/domain/facts/terrain.js';
import { filterDeclared } from '../../src/domain/facts/drawDeclared.js';
import { pickRendezvous } from '../../src/kernel/proseHash.js';
import { pickKeyOf } from '../../src/domain/display/pickKey.js'; // point 124: the town's pick key
import { fillAgreement, powerNameWithArticle } from '../../src/domain/display/powerSentenceName.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const BAD = ['strained', 'critical', 'collapsed'];

/** @type {Array<{ seed: string, size: string, rec: any, food: string, resent: string }>} */
const births = [];
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const size of SIZES) for (let i = 0; i < 5; i++) {
    const seed = `hxd-${size}-${i}`;
    const rec = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
    const slots = deriveDailyLife(rec).slots;
    births.push({ seed, size, rec, food: slots.food_culture.text, resent: slots.commoner_resentments.text });
  }
}, 300_000);

const seeds = () => births.map((b) => b.seed);
const at = (/** @type {string} */ seed) => /** @type {{ seed: string, size: string, rec: any, food: string, resent: string }} */ (births.find((b) => b.seed === seed));
const safe = (/** @type {() => any} */ f, /** @type {any} */ d = undefined) => { try { return f(); } catch { return d; } };

// M1's record tests (`measures/M1/measure.m1.mjs` :: T), copied
const T = {
  gate: (/** @type {any} */ r) => defenceOf(r).gate,
  market: (/** @type {any} */ r) => marketOf(r),
  council: (/** @type {any} */ r) => rulingBodyOf(r) === true,
  tavern: (/** @type {any} */ r) => hasInstitution(r, 'tavern'),
  sacred: (/** @type {any} */ r) => safe(() => factsOf(r).sacredHouse, false),
  smallPlace: (/** @type {any} */ r) => r.tier === 'thorp' || r.tier === 'hamlet',
  notTown: (/** @type {any} */ r) => safe(() => factsOf(r).populationBand) === 'small',
  routeNone: (/** @type {any} */ r) => ['', 'isolated', 'none'].includes(tradeRouteOf(r)),
};

/** [slot, clause, the record test under which it is false] (M1 rows 187-199 for these two slots). */
const M1_FALSE = /** @type {const} */ ([
  ['food_culture', 'markets close their stalls', 'no market', (/** @type {any} */ r) => !T.market(r)],
  ['food_culture', 'the wealthier streets', 'a thorp or a hamlet', (/** @type {any} */ r) => T.smallPlace(r)],
  ['food_culture', 'temple kitchens', 'no sacred house', (/** @type {any} */ r) => !T.sacred(r)],
  ['food_culture', 'caravans that never arrived', 'no trade route', (/** @type {any} */ r) => T.routeNone(r)],
  ['commoner_resentments', 'merchants who claim', 'no market', (/** @type {any} */ r) => !T.market(r)],
  ['commoner_resentments', 'the council\'s indifference', 'no ruling body', (/** @type {any} */ r) => !T.council(r)],
  ['commoner_resentments', 'of any town', 'a small place (population band small)', (/** @type {any} */ r) => T.notTown(r)],
  ['commoner_resentments', 'the gate fee', 'no gate', (/** @type {any} */ r) => !T.gate(r)],
  ['commoner_resentments', 'market day', 'no market', (/** @type {any} */ r) => !T.market(r)],
  ['commoner_resentments', 'the council\'s favorite', 'no ruling body', (/** @type {any} */ r) => !T.council(r)],
  ['commoner_resentments', 'favorite tavern', 'no tavern or inn', (/** @type {any} */ r) => !T.tavern(r)],
]);

describe('food_culture and commoner_resentments: M1\'s false lines print on no born place (a)', () => {
  it('the born places number 30, five a size (M1\'s births)', () => {
    expect(births).toHaveLength(30);
  });
  for (const [slot, clause, why, falseWhen] of M1_FALSE) {
    it(`${slot}: "${clause}" prints nowhere its record test fails (${why})`, () => {
      const failures = collectSeedFailures(seeds(), (seed) => {
        const x = at(seed);
        const text = slot === 'food_culture' ? x.food : x.resent;
        expect(text.toLowerCase().includes(clause.toLowerCase()) && falseWhen(x.rec), `${seed} (${why}): "${text}"`).toBe(false);
      });
      expectNoSeedFailures(failures, `${slot}: "${clause}" is false on no born place`);
    });
  }
});

/** @param {any} rec @returns {{ food: string, resent: string[] }} the branches the record puts each slot on */
function branchesOf(rec) {
  // R24-A2 (CLOSE-7; the chair's R24d and R24h): the fare's branch and the food grievance read THE FARE BAND (the
  // production band placed within the bound the page's printed food band sets, `dailyLife.js :: fareBandOfRecord`); a page
  // that prints its place as fed has no food grievance
  const band = fareBandOfRecord(rec);
  const wanting = deriveAllThreatProfiles(rec).some((t) => t.type === 'famine' || t.type === 'siege');
  const food = band === 'surplus' ? (wanting ? 'surplus.wanting' : 'surplus') : ['adequate', 'strained', 'critical'].includes(band) ? band : 'collapsed';
  const resent = [];
  if (BAD.includes(deriveCausalState(rec).bands.public_legitimacy)) resent.push('legitimacy');
  if (BAD.includes(band)) resent.push('food');
  if (factsOf(rec).uprising === true) resent.push('uprising');
  return { food, resent };
}

describe('commoner_resentments: the calm rule (b)', () => {
  it('a place whose record holds no grievance says none (the EMPTY string), and a place that holds one says it', () => {
    const failures = collectSeedFailures(seeds(), (seed) => {
      const x = at(seed);
      const { resent } = branchesOf(x.rec);
      if (resent.length === 0) expect(x.resent, `${seed}: no grievance held`).toBe('');
      else expect(x.resent.length, `${seed}: ${resent.join(', ')} held`).toBeGreaterThan(0);
    });
    expectNoSeedFailures(failures, 'commoner_resentments says a grievance where, and only where, the record holds one');
  });
});

describe('food_culture and commoner_resentments: the route, from the slots\' own pools (c, d)', () => {
  it('every sentence is the keyed pick of its branch\'s admitted lines; no "town" below a town; no bracket', async () => {
    const { FOOD_CULTURE } = await import('../../src/data/dailyLife/foodCulture.js');
    const { COMMONER_RESENTMENTS } = await import('../../src/data/dailyLife/commonerResentments.js');
    const failures = collectSeedFailures(seeds(), (seed) => {
      const x = at(seed);
      const facts = factsOf(x.rec);
      const capacities = deriveAllCapacities(x.rec);
      const gov = String(x.rec.powerStructure?.government ?? '');
      const say = (/** @type {string} */ t) => fillAgreement(t, { gov }).replace(/\{gov\}/g, powerNameWithArticle(gov));
      /** @param {string} slot @param {Readonly<Record<string, ReadonlyArray<{ text: string }>>>} pools @param {string} branch */
      const expected = (slot, pools, branch) => {
        // CLOSE-7 THE MIRROR: the deriver hands the pools the capacity profile (`food production`, C7 and K2), so the oracle does
        const pick = pickRendezvous(filterDeclared(pools[branch], { facts, ctx: { capacities } }), `${pickKeyOf(x.rec, x.rec.name)}::dailyLife.${slot}::${branch}`, (/** @type {any} */ l) => l.id);
        return pick ? say(pick.text) : '';
      };
      const { food, resent } = branchesOf(x.rec);
      expect(x.food, `${seed}: food_culture (${food})`).toBe(expected('food_culture', FOOD_CULTURE, food));
      expect(x.resent, `${seed}: commoner_resentments (${resent.join(', ') || 'calm'})`)
        .toBe(resent.map((b) => expected('commoner_resentments', COMMONER_RESENTMENTS, b)).filter(Boolean).join(' '));
      for (const text of [x.food, x.resent]) {
        expect(['thorp', 'hamlet', 'village'].includes(x.size) && /\btowns?\b/i.test(text), `${seed}: "town" below a town: "${text}"`).toBe(false);
        expect(/[()]/.test(text), `${seed}: a bracket: "${text}"`).toBe(false);
      }
    });
    expectNoSeedFailures(failures, 'both slots say their own pools\' keyed picks on every born place');
  });
});

/**
 * THE CHAIR'S LINES (B3 F1; `DAILY-3-HANDBACK.md` § 2 items 4 and 5, 06:17 and E56 of 2026-11-22, verbatim): each in its
 * branch with its needs; a line that names bread or grain prints only where the food record grows grain (`grain`), the
 * grain bought in only where an import names grain (`grain imported`), and "merchants who claim" only where there is a
 * market (M1's false line).
 */
const F1_LINES = /** @type {const} */ ([
  ['food_culture', 'adequate', 'A4', 'Food is steady here, if not generous, and every household has enough with little left over.', []],
  ['food_culture', 'adequate', 'A12', 'The grain is bought in, not grown here, so bread is never wasted.', ['grain imported']],
  ['food_culture', 'strained', 'T9', 'Bread is eaten carefully, and not even the heel of the loaf is wasted.', ['grain']],
  ['food_culture', 'critical', 'C5', 'The stew is thin and the bread is thinner.', ['grain']],
  ['commoner_resentments', 'food', 'F0', 'Commoners resent rising bread prices and merchants who claim they cannot help it.', ['grain', 'market']],
]);
/** the record tests, read from the fact homes directly: grain grown, grain imported, a market */
const GRAIN = {
  grain: (/** @type {any} */ r) => (factsOf(r).foodSources ?? []).includes('grain'),
  'grain imported': (/** @type {any} */ r) => (factsOf(r).imports ?? []).some((/** @type {unknown} */ g) => typeof g === 'string' && /\bgrain\b/i.test(g)),
  market: (/** @type {any} */ r) => T.market(r) === true,
};

describe('the chair\'s lines of B3 F1: A4, A12, T9, C5 and F0', () => {
  it('each line is in its branch of its slot\'s pool, with the chair\'s text and needs', async () => {
    const { FOOD_CULTURE } = await import('../../src/data/dailyLife/foodCulture.js');
    const { COMMONER_RESENTMENTS } = await import('../../src/data/dailyLife/commonerResentments.js');
    for (const [slot, branch, id, text, needs] of F1_LINES) {
      const pool = /** @type {Record<string, ReadonlyArray<{ id: string, text: string, needs: ReadonlyArray<string>, excludes?: ReadonlyArray<string> }>>} */ (slot === 'food_culture' ? FOOD_CULTURE : COMMONER_RESENTMENTS)[branch];
      const line = pool.find((l) => l.id === id);
      expect(line, `${slot}.${branch} ${id}`).toBeDefined();
      expect(line?.text, `${slot}.${branch} ${id}`).toBe(text);
      expect(line?.needs, `${slot}.${branch} ${id}`).toEqual(needs);
      // the tenth chair's G45 (8) (CURE-118 (3)): A4's "every household has enough" refuses a printed Pressured, A7's claim; A4
      // ALONE carries that exclusion, exactly; A12, T9, C5 and F0 carry none
      if (slot === 'food_culture' && branch === 'adequate' && id === 'A4') expect(line?.excludes, `${slot}.${branch} ${id}`).toEqual(['food: = pressured']);
      else expect(line?.excludes, `${slot}.${branch} ${id}`).toBeUndefined();
    }
  });
  it('no line prints where its record lacks what it needs (grain, grain imported, a market), on the 30 born places', () => {
    const failures = collectSeedFailures(seeds(), (seed) => {
      const x = at(seed);
      for (const [slot, , id, text, needs] of F1_LINES) {
        const said = slot === 'food_culture' ? x.food : x.resent;
        if (!said.includes(text)) continue;
        for (const need of needs) expect(GRAIN[need](x.rec), `${seed}: ${id} printed with no ${need}: "${said}"`).toBe(true);
      }
    });
    expectNoSeedFailures(failures, 'A12, T9, C5 and F0 print only where the record holds what they say');
  });
});
