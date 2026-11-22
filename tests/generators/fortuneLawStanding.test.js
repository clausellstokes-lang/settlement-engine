/**
 * fortuneLawStanding.test.js — FS2, STANDING JUDGED AGAINST THE PLACE'S OWN SIZE (FORTUNE-1, unit U3).
 *
 * ⭐ WHAT THIS FILE PROVES. `computePublicLegitimacy` takes the fortune law's version as a fourth
 * argument, handed by its one caller (`power/rulingStructure.js`, from `resolveFortuneLawVersion`).
 * Under version 2 ONLY, defence is judged against the size's usual RANGE of readiness bands
 * (`FORTUNE_LAW_TUNING.standing`): so many points a band above the range's top or below its
 * bottom, within the bound, weighed by the size's existing scale (`legitimacyDefScale`); the
 * prosperity term reads the law's table; the safety term is FORTUNE-3 U5s's (a calm label judged
 * against the size's usual range, proven in `fortuneLawSafety.test.js`, recomputed here by its
 * definition). Under version 1 every line computes exactly as today.
 *
 * THE ARMS, in the brief's order:
 *   (a) DARK — every (defence label x size x prosperity label) cell, with no fourth argument, with
 *       1 and with garbage, is today's function, byte for byte.
 *   (b) LIT — inside the usual range the term is 0; a band above / below gives +-round(points x
 *       scale); the bound holds; a walled city is 0 and a city at Defensible is negative; the
 *       range names only real readiness bands, low never above high.
 *   (c) BORN, forced — six births, one a size, under 2: the defence breakdown is the rule applied
 *       to the town's own readiness label and size, and the score is 50 plus the breakdown,
 *       clamped. The same six without the marker are byte-identical to `_fortuneLawVersion: 1`.
 *
 * Every expectation is COMPUTED from `FORTUNE_LAW_TUNING`, `DEFENSE_CONTRIB`, `legitimacyDefScale`,
 * `READINESS_BANDS` and the cuts; none is quoted.
 *
 * @enforced-by this test
 */
import { beforeAll, describe, expect, it } from 'vitest';

import {
  DEFENSE_CONTRIB,
  computePublicLegitimacy,
  legitimacyBandFor,
  legitimacyDefScale,
} from '../../src/generators/factionDynamics.js';
import {
  DEFAULT_FORTUNE_LAW_VERSION,
  FORTUNE_LAW_CONFIG_KEY,
  FORTUNE_LAW_TUNING,
  SIZE_RELATIVE_FORTUNE_LAW_VERSION,
} from '../../src/domain/fortune/fortuneLaw.js';
import { READINESS_BANDS } from '../../src/data/bandLadders.js';
import { TIER_ORDER } from '../../src/domain/density/densityBands.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { legacyConfig } from '../helpers/fortuneLegacyConfig.js';

const STANDING = FORTUNE_LAW_TUNING.standing;
const LIT = SIZE_RELATIVE_FORTUNE_LAW_VERSION;
/** The readiness bands, lowest first, read off the one ladder (it is held highest first). */
const BAND_ORDER = READINESS_BANDS.map((band) => band.label).reverse();
const PROSPERITY_LABELS = Object.keys(STANDING.prosperityPoints);
/** Every defence label the function can be handed: the ladder's, the contribution table's, and
 *  two it does not know. */
const DEFENCE_LABELS = [...new Set([...BAND_ORDER, ...Object.keys(DEFENSE_CONTRIB)]), 'Moated', null];
const GARBAGE = ['2', '1', NaN, 3, 0, -1, null, {}, [], true];

/** @param {string} prosperity @param {string} [safetyLabel] @param {string} [foodLabel] */
const economyOf = (prosperity, safetyLabel = 'Moderate', foodLabel = 'Secure') => ({
  prosperity,
  safetyProfile: { safetyLabel },
  foodSecurity: { label: foodLabel },
});

/** @param {number} n @param {number} lo @param {number} hi */
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

/** The rule, read off the law's table: how many bands the label stands outside the size's usual
 *  range (0 inside it, and for a label off the ladder), times the points, within the bound,
 *  weighed by the size's scale. @param {string|null} label @param {string} tier */
function litDefence(label, tier) {
  const index = BAND_ORDER.indexOf(/** @type {string} */ (label));
  if (index < 0) return 0;
  const [low, high] = STANDING.defenceUsualRange[/** @type {keyof typeof STANDING.defenceUsualRange} */ (tier)]
    .map((band) => BAND_ORDER.indexOf(band));
  const offset = index > high ? index - high : index < low ? index - low : 0;
  return Math.round(clamp(STANDING.defencePointsPerBand * offset, -STANDING.defenceBound, STANDING.defenceBound) * legitimacyDefScale(tier));
}

/** The safety term under the law (FORTUNE-3 U5s), read off the law's table: a label on the calm
 *  ladder (`safetyCalmLadder`, lowest first) is 0 inside the size's usual range
 *  (`safetyUsualRange`) and, outside it, its law-1 points less those of the range's nearest band;
 *  a label off the ladder keeps its law-1 points. @param {string} label @param {string} tier */
function litSafety(label, tier) {
  const ladder = /** @type {ReadonlyArray<string>} */ (STANDING.safetyCalmLadder);
  const today = (/** @type {string} */ l) => computePublicLegitimacy(economyOf('Moderate', l), null, tier).breakdown.safety;
  const index = ladder.indexOf(label);
  if (index < 0) return today(label);
  const [low, high] = /** @type {Record<string, ReadonlyArray<string>>} */ (STANDING.safetyUsualRange)[tier]
    .map((band) => ladder.indexOf(band));
  return today(label) - today(ladder[clamp(index, low, high)]);
}

// ── (a) DARK ──────────────────────────────────────────────────────────────────
describe('(a) DARK: under law 1 every cell computes exactly as today', () => {
  it('every (defence label x size x prosperity label) cell: no fourth argument, 1 and garbage are today\'s', () => {
    let cells = 0;
    for (const tier of TIER_ORDER) {
      for (const label of DEFENCE_LABELS) {
        for (const prosperity of [...PROSPERITY_LABELS, 'Unheard-of']) {
          const economy = economyOf(prosperity);
          const today = computePublicLegitimacy(economy, /** @type {any} */ (label), tier);
          // Today's terms, from today's tables: the prosperity table is the law's own (equal on
          // purpose), the defence term the contribution table weighed by the size's scale.
          const prosperityTerm = STANDING.prosperityPoints[/** @type {keyof typeof STANDING.prosperityPoints} */ (prosperity)] ?? 0;
          const defenceTerm = Math.round((DEFENSE_CONTRIB[/** @type {keyof typeof DEFENSE_CONTRIB} */ (label)] ?? 0) * legitimacyDefScale(tier));
          expect(today.breakdown, `${tier} / ${label} / ${prosperity}`).toEqual({ prosperity: prosperityTerm, safety: 0, defense: defenceTerm, food: 0 });
          expect(today.score).toBe(clamp(50 + prosperityTerm + defenceTerm, 0, 100));
          expect(today.label).toBe(legitimacyBandFor(today.score).label);
          const bytes = JSON.stringify(today);
          for (const law of [DEFAULT_FORTUNE_LAW_VERSION, undefined, ...GARBAGE]) {
            expect(JSON.stringify(computePublicLegitimacy(economy, /** @type {any} */ (label), tier, /** @type {any} */ (law))), `${tier} / ${label} / ${prosperity} / law ${String(law)}`).toBe(bytes);
          }
          cells += 1;
        }
      }
    }
    expect(cells).toBe(TIER_ORDER.length * DEFENCE_LABELS.length * (PROSPERITY_LABELS.length + 1));
  });
});

// ── (b) LIT ───────────────────────────────────────────────────────────────────
describe('(b) LIT: under law 2 defence is judged against the size\'s usual range', () => {
  it('the usual range names only real readiness bands, for every size, and its low is never above its high', () => {
    expect(Object.keys(STANDING.defenceUsualRange).sort()).toEqual([...TIER_ORDER].sort());
    for (const tier of TIER_ORDER) {
      const range = STANDING.defenceUsualRange[/** @type {keyof typeof STANDING.defenceUsualRange} */ (tier)];
      expect(range, tier).toHaveLength(2);
      for (const band of range) expect(BAND_ORDER, `${tier}: '${band}' is not a readiness band`).toContain(band);
      expect(BAND_ORDER.indexOf(range[0]), `${tier}: the range's low is above its high`).toBeLessThanOrEqual(BAND_ORDER.indexOf(range[1]));
    }
  });

  it('inside the usual range the defence term is 0; a band above the top and below the bottom give +-round(points x scale)', () => {
    let above = 0;
    let below = 0;
    for (const tier of TIER_ORDER) {
      const scale = legitimacyDefScale(tier);
      const [low, high] = STANDING.defenceUsualRange[/** @type {keyof typeof STANDING.defenceUsualRange} */ (tier)]
        .map((band) => BAND_ORDER.indexOf(band));
      const defenceOf = (/** @type {string} */ label) => computePublicLegitimacy(economyOf('Moderate'), label, tier, LIT).breakdown.defense;
      for (let i = low; i <= high; i += 1) expect(defenceOf(BAND_ORDER[i]), `${tier} at ${BAND_ORDER[i]}`).toBe(0);
      if (high + 1 < BAND_ORDER.length) {
        expect(defenceOf(BAND_ORDER[high + 1]), `${tier} one band above`).toBe(Math.round(STANDING.defencePointsPerBand * scale));
        above += 1;
      }
      if (low - 1 >= 0) {
        expect(defenceOf(BAND_ORDER[low - 1]), `${tier} one band below`).toBe(Math.round(-STANDING.defencePointsPerBand * scale));
        below += 1;
      }
    }
    expect(above).toBeGreaterThan(0);
    expect(below).toBeGreaterThan(0);
  });

  it('every band at every size is the rule, and the bound holds (a far band is clamped, never beyond it)', () => {
    let clamped = 0;
    for (const tier of TIER_ORDER) {
      const scale = legitimacyDefScale(tier);
      for (const label of DEFENCE_LABELS) {
        const term = computePublicLegitimacy(economyOf('Moderate'), /** @type {any} */ (label), tier, LIT).breakdown.defense;
        expect(term, `${tier} at ${label}`).toBe(litDefence(label, tier));
        expect(Math.abs(term)).toBeLessThanOrEqual(Math.round(STANDING.defenceBound * scale));
        const [low, high] = STANDING.defenceUsualRange[/** @type {keyof typeof STANDING.defenceUsualRange} */ (tier)]
          .map((band) => BAND_ORDER.indexOf(band));
        const index = BAND_ORDER.indexOf(/** @type {string} */ (label));
        const bands = index < 0 ? 0 : Math.max(index - high, low - index, 0);
        if (STANDING.defencePointsPerBand * bands > STANDING.defenceBound) {
          expect(Math.abs(term), `${tier} at ${label}: clamped to the bound`).toBe(Math.round(STANDING.defenceBound * scale));
          clamped += 1;
        }
      }
    }
    expect(clamped, 'no cell reaches the bound: the clamp is unproven').toBeGreaterThan(0);
  });

  it('a walled city (Well-Defended) is 0, and a city at Defensible is negative', () => {
    const city = (/** @type {string} */ label) => computePublicLegitimacy(economyOf('Moderate'), label, 'city', LIT).breakdown.defense;
    expect(city('Well-Defended')).toBe(0);
    expect(city('Defensible')).toBeLessThan(0);
    expect(city('Defensible')).toBe(litDefence('Defensible', 'city'));
    // and today it is the reverse: the walled city is paid, the Defensible one is not docked
    expect(computePublicLegitimacy(economyOf('Moderate'), 'Well-Defended', 'city').breakdown.defense).toBeGreaterThan(0);
  });

  it('an unknown label contributes 0; the prosperity term reads the law\'s table; safety is the U5s rule; food, the base and the key order are unchanged', () => {
    for (const tier of TIER_ORDER) {
      expect(computePublicLegitimacy(economyOf('Moderate'), /** @type {any} */ ('Moated'), tier, LIT).breakdown.defense).toBe(0);
      expect(computePublicLegitimacy(economyOf('Moderate'), /** @type {any} */ (null), tier, LIT).breakdown.defense).toBe(0);
      for (const prosperity of PROSPERITY_LABELS) {
        for (const [safety, food] of [['Very Safe', 'Surplus'], ['Dangerous', 'Deficit'], ['Tense', 'Import-Dependent'], ['Safe', 'Pressured']]) {
          const economy = economyOf(prosperity, safety, food);
          const label = BAND_ORDER[0];
          const lit = computePublicLegitimacy(economy, label, tier, LIT);
          const dark = computePublicLegitimacy(economy, label, tier);
          expect(Object.keys(lit)).toEqual(Object.keys(dark));
          expect(Object.keys(lit.breakdown)).toEqual(Object.keys(dark.breakdown));
          expect(lit.breakdown.prosperity).toBe(STANDING.prosperityPoints[/** @type {keyof typeof STANDING.prosperityPoints} */ (prosperity)]);
          // U5s: the dark term off the calm ladder, 0 inside the size's usual range, the rule outside it
          expect(lit.breakdown.safety, `${tier} / ${safety}`).toBe(litSafety(safety, tier));
          expect(lit.breakdown.food).toBe(dark.breakdown.food);
          expect(lit.breakdown.defense).toBe(litDefence(label, tier));
          const { prosperity: p, safety: s, defense: d, food: f } = lit.breakdown;
          expect(lit.score).toBe(clamp(50 + p + s + d + f, 0, 100));
          const band = legitimacyBandFor(lit.score);
          for (const key of /** @type {const} */ (['label', 'color', 'bg', 'govMultiplier', 'crimMultiplier', 'isEndorsed', 'isApproved', 'isTolerated', 'isContested', 'isLegitimacyCrisis', 'governanceFractured'])) {
            expect(lit[key], `${tier} / ${prosperity} / ${key}`).toBe(band[key]);
          }
        }
      }
    }
  });
});

// ── (c) BORN, forced ──────────────────────────────────────────────────────────
const SEEDS = TIER_ORDER.map((tier) => ({ tier, seed: `fs2-${tier}-0` }));
/** @param {string} tier @param {string} seed @param {Record<string, unknown>} [law] the marker forced AFTER
 *  birthConfig; absent, the town is born from a LEGACY config (the law's key deleted, whatever the dial) */
const birth = (tier, seed, law) => generateSettlementPipeline(
  law ? { ...birthConfig({ ...DEFAULT_CONFIG, settType: tier }), ...law } : legacyConfig({ ...DEFAULT_CONFIG, settType: tier }),
  null,
  { seed, customContent: {} },
);
/** The bytes of a born town with the law's own key dropped wherever the config is echoed. */
const bytesWithoutMarker = (/** @type {unknown} */ town) => JSON.stringify(town, (key, value) => (key === FORTUNE_LAW_CONFIG_KEY ? undefined : value));

/** @type {Record<string, { lit: any, one: any, none: any }>} */
const births = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const { tier, seed } of SEEDS) {
    births[seed] = {
      lit: birth(tier, seed, { [FORTUNE_LAW_CONFIG_KEY]: LIT }),
      one: birth(tier, seed, { [FORTUNE_LAW_CONFIG_KEY]: DEFAULT_FORTUNE_LAW_VERSION }),
      none: birth(tier, seed),
    };
  }
}, 120_000);

describe('(c) BORN, forced: six births, one a size', () => {
  it('six births cover every size', () => {
    expect(SEEDS.map(({ tier }) => tier)).toEqual([...TIER_ORDER]);
  });

  for (const { tier, seed } of SEEDS) {
    it(`${seed}: under law 2 the defence breakdown is the rule on the town's own readiness and size, and the score is 50 plus the breakdown`, () => {
      const town = births[seed].lit;
      const legitimacy = town.powerStructure.publicLegitimacy;
      const readiness = town.defenseProfile?.readiness?.label;
      expect(typeof readiness, `${seed}: a born town carries its readiness label`).toBe('string');
      expect(legitimacy.breakdown.defense, `${seed} at ${readiness}`).toBe(litDefence(readiness, tier));
      const { prosperity, safety, defense, food } = legitimacy.breakdown;
      expect(legitimacy.score).toBe(clamp(50 + prosperity + safety + defense + food, 0, 100));
      expect(legitimacy.label).toBe(legitimacyBandFor(legitimacy.score).label);
    });

    // "without the marker" means a LEGACY config (the law's key deleted), not a bare birthConfig that mints the dial
    it(`${seed}: without the marker the town is byte-identical to _fortuneLawVersion: 1`, () => {
      const { none, one } = births[seed];
      expect(bytesWithoutMarker(none)).toBe(JSON.stringify(none));
      expect(bytesWithoutMarker(one)).toBe(bytesWithoutMarker(none));
    });
  }
});
