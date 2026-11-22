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
 *       atoms (`facts/drawDeclared.js :: filterDeclared`) and picked by `pickVariantMixed` keyed
 *       `<record.name>::dailyLife.<slot>::<branch>`; `{gov}` the government's label with its article.
 *   (d) No "town" at a place smaller than a town, no bracket.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { deriveDailyLife } from '../../src/domain/dailyLife.js';
import { deriveAllThreatProfiles } from '../../src/domain/threatProfile.js';
import { deriveAllCapacities } from '../../src/domain/capacityModel.js';
import { deriveCausalState } from '../../src/domain/causalState.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { defenceOf } from '../../src/domain/facts/defence.js';
import { hasInstitution } from '../../src/domain/facts/institutions.js';
import { marketOf } from '../../src/domain/facts/market.js';
import { rulingBodyOf } from '../../src/domain/facts/rulingBody.js';
import { tradeRouteOf } from '../../src/domain/facts/terrain.js';
import { filterDeclared } from '../../src/domain/facts/drawDeclared.js';
import { pickVariantMixed } from '../../src/kernel/proseHash.js';
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
  const band = deriveAllCapacities(rec).capacities.food_production.band;
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
      const gov = String(x.rec.powerStructure?.government ?? '');
      const say = (/** @type {string} */ t) => fillAgreement(t, { gov }).replace(/\{gov\}/g, powerNameWithArticle(gov));
      /** @param {string} slot @param {Readonly<Record<string, ReadonlyArray<{ text: string }>>>} pools @param {string} branch */
      const expected = (slot, pools, branch) => {
        const pick = pickVariantMixed(filterDeclared(pools[branch], { facts }), `${x.rec.name}::dailyLife.${slot}::${branch}`);
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
