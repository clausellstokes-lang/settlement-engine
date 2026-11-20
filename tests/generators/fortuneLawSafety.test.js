/**
 * fortuneLawSafety.test.js — U5s, SAFETY JUDGED AGAINST THE SIZE'S USUAL (FORTUNE-3, the chair's
 * ruling of 2026-11-20 15:58 UTC), DARK.
 *
 * ⭐ WHAT THIS FILE PROVES. Under the fortune law (version 2) ONLY, the safety term of
 * `computePublicLegitimacy` judges a label ON the calm ladder (`FORTUNE_LAW_TUNING.standing
 * .safetyCalmLadder`, lowest first) against the size's usual range (`standing.safetyUsualRange`):
 * 0 inside it; outside it, the label's own law-1 points LESS those of the nearest band of the
 * range. A label OFF the ladder (a crisis strain, the two governance labels) keeps its law-1
 * points. Under version 1, absent or garbage, every cell computes exactly as today.
 *
 * THE ARMS, in the brief's order (`docs/chair/2026-11-20/content/fortune/briefs/U5-SAFETY.md`):
 *   (a) DARK — every (safety label x size x prosperity x defence label) cell, with no fourth
 *       argument, with 1 and with garbage, is the law-1 call, byte for byte.
 *   (b) LIT — the rule on every ladder label at every size; off-ladder labels keep their points;
 *       a calm city's Unsafe is 0 and a village's is not.
 *   (c) THE LADDER — every label the leaf lists is one `generateSafetyProfile` returns, and the
 *       law-1 points rise strictly along it.
 *   (d) FS4's ARM, born forced — two births a size untouched and two with every dial random
 *       (`instruments/run.sh`'s DIALS), under law 2: the safety term is never below the label's
 *       law-1 term, the score never falls and the band is never lower.
 *   (e) the same births without the marker are byte-identical to `_fortuneLawVersion: 1`.
 *
 * Every expectation is COMPUTED from `FORTUNE_LAW_TUNING`, the law-1 safety term read through the
 * public function, and the cuts; none is quoted.
 *
 * @enforced-by this test
 */
import { beforeAll, describe, expect, it } from 'vitest';

import {
  DEFENSE_CONTRIB,
  computePublicLegitimacy,
  legitimacyBandFor,
} from '../../src/generators/factionDynamics.js';
import {
  DEFAULT_FORTUNE_LAW_VERSION,
  FORTUNE_LAW_CONFIG_KEY,
  FORTUNE_LAW_TUNING,
  SIZE_RELATIVE_FORTUNE_LAW_VERSION,
} from '../../src/domain/fortune/fortuneLaw.js';
import { LEGITIMACY_BANDS, READINESS_BANDS } from '../../src/data/bandLadders.js';
import { TIER_ORDER } from '../../src/domain/density/densityBands.js';
import { generateSafetyProfile } from '../../src/generators/safetyProfile.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const STANDING = /** @type {any} */ (FORTUNE_LAW_TUNING.standing);
const LIT = SIZE_RELATIVE_FORTUNE_LAW_VERSION;
/** @returns {ReadonlyArray<string>} the calm ladder, lowest first, read off the leaf */
const ladder = () => STANDING.safetyCalmLadder;
/** @param {string} tier @returns {[number, number]} the size's usual range as ladder indexes */
const usualIndexes = (tier) => STANDING.safetyUsualRange[tier].map((/** @type {string} */ band) => ladder().indexOf(band));
const PROSPERITY_LABELS = [...Object.keys(STANDING.prosperityPoints), 'Unheard-of'];
const DEFENCE_LABELS = [...new Set([...READINESS_BANDS.map((band) => band.label), ...Object.keys(DEFENSE_CONTRIB)]), 'Moated', null];
/** Labels the function is handed that are NOT on the calm ladder: crisis strains (as
 *  `safetyProfile.js` composes them), the two governance labels, and labels it does not know. */
const OFF_LADDER = [
  'Tense — Plague', 'Strained — Active Siege', 'Desperate — Active Siege', 'Critical — Famine',
  'Controlled — Occupation Curfew', 'Tense — Plague + Active Siege', 'Controlled — Authoritarian',
  'Dangerous — Criminal Governance', 'very safe', 'Unheard-of',
];
const GARBAGE = ['2', '1', NaN, 3, 0, -1, null, {}, [], true];

/** @param {string} prosperity @param {string|null} [safetyLabel] @param {string} [foodLabel] */
const economyOf = (prosperity, safetyLabel = 'Moderate', foodLabel = 'Secure') => ({
  prosperity,
  safetyProfile: { safetyLabel },
  foodSecurity: { label: foodLabel },
});

/** @param {number} n @param {number} lo @param {number} hi */
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

/** The law-1 safety term of a label (today's `safetyContrib`), read through the public function.
 *  @param {string|null} label */
const todaySafety = (label) => computePublicLegitimacy(economyOf('Moderate', label), null, 'town', DEFAULT_FORTUNE_LAW_VERSION).breakdown.safety;

/** The rule, read off the law's table: 0 inside the size's usual range; outside it, the label's
 *  law-1 points less those of the nearest band of the range; a label off the ladder keeps its
 *  law-1 points. @param {string} label @param {string} tier */
function litSafety(label, tier) {
  const index = ladder().indexOf(label);
  if (index < 0) return todaySafety(label);
  const [low, high] = usualIndexes(tier);
  const edge = clamp(index, low, high);
  return todaySafety(label) - todaySafety(ladder()[edge]);
}

// ── the leaf's two rows ───────────────────────────────────────────────────────
describe('the leaf: the calm ladder and each size\'s usual range (DRAFT rows of FORTUNE_LAW_TUNING.standing)', () => {
  it('the calm ladder is five distinct labels, frozen', () => {
    expect(Array.isArray(ladder()), 'FORTUNE_LAW_TUNING.standing.safetyCalmLadder is missing').toBe(true);
    expect(ladder()).toHaveLength(5);
    expect(new Set(ladder()).size).toBe(ladder().length);
    expect(Object.isFrozen(ladder())).toBe(true);
  });

  it('the usual range names only ladder labels, for every size, low never above high, frozen', () => {
    expect(STANDING.safetyUsualRange, 'FORTUNE_LAW_TUNING.standing.safetyUsualRange is missing').toBeTruthy();
    expect(Object.isFrozen(STANDING.safetyUsualRange)).toBe(true);
    expect(Object.keys(STANDING.safetyUsualRange).sort()).toEqual([...TIER_ORDER].sort());
    for (const tier of TIER_ORDER) {
      const range = STANDING.safetyUsualRange[tier];
      expect(range, tier).toHaveLength(2);
      expect(Object.isFrozen(range), tier).toBe(true);
      for (const band of range) expect(ladder(), `${tier}: '${band}' is not on the calm ladder`).toContain(band);
      const [low, high] = usualIndexes(tier);
      expect(low, `${tier}: the range's low is above its high`).toBeLessThanOrEqual(high);
    }
  });
});

// ── (a) DARK ──────────────────────────────────────────────────────────────────
describe('(a) DARK: under law 1 every cell computes exactly as today', () => {
  it('every (safety label x size x prosperity x defence label) cell: no fourth argument, 1 and garbage are the law-1 call', () => {
    let cells = 0;
    const SAFETY_LABELS = [...ladder(), ...OFF_LADDER, null];
    for (const tier of TIER_ORDER) {
      for (const safety of SAFETY_LABELS) {
        for (const prosperity of PROSPERITY_LABELS) {
          for (const defence of DEFENCE_LABELS) {
            const economy = economyOf(prosperity, safety);
            const today = computePublicLegitimacy(economy, /** @type {any} */ (defence), tier, DEFAULT_FORTUNE_LAW_VERSION);
            // the law-1 safety term reads the label alone: the size, the purse and the walls do not move it
            expect(today.breakdown.safety, `${tier} / ${safety}`).toBe(todaySafety(safety));
            const bytes = JSON.stringify(today);
            expect(JSON.stringify(computePublicLegitimacy(economy, /** @type {any} */ (defence), tier)), `${tier} / ${safety} / ${prosperity} / ${defence} / no law`).toBe(bytes);
            for (const law of [undefined, ...GARBAGE]) {
              expect(JSON.stringify(computePublicLegitimacy(economy, /** @type {any} */ (defence), tier, /** @type {any} */ (law))), `${tier} / ${safety} / ${prosperity} / ${defence} / law ${String(law)}`).toBe(bytes);
            }
            cells += 1;
          }
        }
      }
    }
    expect(cells).toBe(TIER_ORDER.length * SAFETY_LABELS.length * PROSPERITY_LABELS.length * DEFENCE_LABELS.length);
  });
});

// ── (b) LIT ───────────────────────────────────────────────────────────────────
describe('(b) LIT: under law 2 safety is judged against the size\'s usual range', () => {
  it('inside the usual range the term is 0; below it, less the bottom band\'s points; above it, less the top band\'s', () => {
    let below = 0;
    let above = 0;
    for (const tier of TIER_ORDER) {
      const [low, high] = usualIndexes(tier);
      ladder().forEach((label, index) => {
        const term = computePublicLegitimacy(economyOf('Moderate', label), null, tier, LIT).breakdown.safety;
        if (index >= low && index <= high) {
          expect(term, `${tier} at ${label}: inside the usual range`).toBe(0);
        } else if (index < low) {
          expect(term, `${tier} at ${label}: below the range`).toBe(todaySafety(label) - todaySafety(ladder()[low]));
          below += 1;
        } else {
          expect(term, `${tier} at ${label}: above the range`).toBe(todaySafety(label) - todaySafety(ladder()[high]));
          above += 1;
        }
      });
    }
    expect(below, 'no size has a band below its range: the lower arm is unproven').toBeGreaterThan(0);
    expect(above, 'no size has a band above its range: the upper arm is unproven').toBeGreaterThan(0);
  });

  it('a label off the ladder keeps its law-1 points at every size', () => {
    for (const tier of TIER_ORDER) {
      for (const label of OFF_LADDER) {
        expect(computePublicLegitimacy(economyOf('Moderate', label), null, tier, LIT).breakdown.safety, `${tier} at ${label}`).toBe(todaySafety(label));
      }
    }
    expect(OFF_LADDER.filter((label) => todaySafety(label) !== 0).length, 'every off-ladder label is worth 0 today: the arm is vacuous').toBeGreaterThan(0);
  });

  it('every cell is the rule; only the safety term moves; the score is 50 plus the breakdown and the band is the cuts\'', () => {
    for (const tier of TIER_ORDER) {
      for (const safety of [...ladder(), ...OFF_LADDER]) {
        for (const prosperity of PROSPERITY_LABELS) {
          for (const defence of DEFENCE_LABELS) {
            const lit = computePublicLegitimacy(economyOf(prosperity, safety), /** @type {any} */ (defence), tier, LIT);
            const calm = computePublicLegitimacy(economyOf(prosperity, ladder()[usualIndexes(tier)[0]]), /** @type {any} */ (defence), tier, LIT);
            expect(lit.breakdown.safety, `${tier} / ${safety}`).toBe(litSafety(safety, tier));
            expect({ ...lit.breakdown, safety: 0 }).toEqual({ ...calm.breakdown, safety: 0 });
            const { prosperity: p, safety: s, defense: d, food: f } = lit.breakdown;
            expect(lit.score).toBe(clamp(50 + p + s + d + f, 0, 100));
            expect(lit.label).toBe(legitimacyBandFor(lit.score).label);
            expect(Object.keys(lit)).toEqual(Object.keys(calm));
          }
        }
      }
    }
  });

  it('a calm city\'s Unsafe streets are 0 under the law, and a village\'s are not', () => {
    const term = (/** @type {string} */ tier, /** @type {string} */ label, /** @type {unknown} */ law) => computePublicLegitimacy(economyOf('Moderate', label), null, tier, /** @type {any} */ (law)).breakdown.safety;
    expect(term('city', 'Unsafe', LIT)).toBe(0);
    expect(term('city', 'Unsafe', DEFAULT_FORTUNE_LAW_VERSION)).toBeLessThan(0);
    expect(term('village', 'Unsafe', LIT)).toBeLessThan(0);
    expect(term('village', 'Unsafe', LIT)).toBe(litSafety('Unsafe', 'village'));
  });

  it('a size off the table reads the town\'s range', () => {
    for (const label of [...ladder(), ...OFF_LADDER]) {
      expect(computePublicLegitimacy(economyOf('Moderate', label), null, 'Unheard-of', LIT).breakdown.safety, label).toBe(litSafety(label, 'town'));
    }
  });
});

// ── (c) THE LADDER ────────────────────────────────────────────────────────────
describe('(c) THE LADDER: the leaf\'s labels are the safety profile\'s, and their points rise', () => {
  it('every label the leaf lists is one generateSafetyProfile returns (a grid of sizes and dials)', () => {
    const returned = new Set();
    for (const tier of TIER_ORDER) {
      for (let military = 0; military <= 100; military += 10) {
        for (let criminal = 0; criminal <= 100; criminal += 10) {
          returned.add(generateSafetyProfile({ priorityMilitary: military, priorityCriminal: criminal }, tier, []).safetyLabel);
        }
      }
    }
    for (const label of ladder()) expect([...returned], `'${label}' is never returned by generateSafetyProfile`).toContain(label);
  });

  it('the law-1 points rise strictly along the ladder, lowest first', () => {
    for (let i = 1; i < ladder().length; i += 1) {
      expect(todaySafety(ladder()[i]), `${ladder()[i]} above ${ladder()[i - 1]}`).toBeGreaterThan(todaySafety(ladder()[i - 1]));
    }
  });
});

// ── (d) and (e): born, forced ─────────────────────────────────────────────────
/** The DIALS of `docs/chair/2026-11-20/content/fortune/instruments/run.sh`: every dial random. */
const DIALS = {
  tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat',
  nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true,
  magicExists: true, contentProfile: 'grounded',
};
const ARM = TIER_ORDER.flatMap((tier) => [0, 1].flatMap((k) => [
  { tier, seed: `u5s-${tier}-${k}`, dials: {} },
  { tier, seed: `u5s-dials-${tier}-${k}`, dials: DIALS },
]));
/** THE WITNESS: a calm city born on Unsafe streets at untouched settings (the proposal's seed set
 *  hxd), the one cell the rule moves there, so the arm below is not proven only on terms that
 *  stand still. Its label is asserted, not assumed. */
const WITNESS = { tier: 'city', seed: 'hxd-city-2', dials: {} };
const SEEDS = [...ARM, WITNESS];
/** @param {string} tier @param {string} seed @param {Record<string, unknown>} dials @param {Record<string, unknown>} [law] */
const birth = (tier, seed, dials, law = {}) => generateSettlementPipeline(
  { ...birthConfig({ ...DEFAULT_CONFIG, settType: tier, ...dials }), ...law },
  null,
  { seed, customContent: {} },
);
/** The bytes of a born town with the law's own key dropped wherever the config is echoed. */
const bytesWithoutMarker = (/** @type {unknown} */ town) => JSON.stringify(town, (key, value) => (key === FORTUNE_LAW_CONFIG_KEY ? undefined : value));
/** A band's rank, highest first (`LEGITIMACY_BANDS`): a LOWER rank is a HIGHER band. @param {string} label */
const rankOf = (label) => LEGITIMACY_BANDS.findIndex((band) => band.label === label);

/** @type {Record<string, { lit: any, one: any, none: any }>} */
const births = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const { tier, seed, dials } of SEEDS) {
    births[seed] = {
      lit: birth(tier, seed, dials, { [FORTUNE_LAW_CONFIG_KEY]: LIT }),
      one: birth(tier, seed, dials, { [FORTUNE_LAW_CONFIG_KEY]: DEFAULT_FORTUNE_LAW_VERSION }),
      none: birth(tier, seed, dials),
    };
  }
}, 600_000);

describe('(d) FS4\'s ARM, born forced: under law 2 no score falls and no band is lower', () => {
  it('two births a size untouched and two with every dial random', () => {
    for (const tier of TIER_ORDER) expect(ARM.filter((s) => s.tier === tier)).toHaveLength(4);
  });

  it('the witness moves: a calm city on Unsafe streets, whose safety term rises under the law', () => {
    const town = births[WITNESS.seed].lit;
    const label = town.economicState.safetyProfile.safetyLabel;
    expect(ladder(), `${WITNESS.seed}: the witness is no longer on the calm ladder ('${label}')`).toContain(label);
    expect(town.powerStructure.publicLegitimacy.breakdown.safety, `${WITNESS.seed} at ${label}: the term did not move`).toBeGreaterThan(todaySafety(label));
  });

  for (const { tier, seed } of SEEDS) {
    it(`${seed}: the safety term is the rule on the town's own label, never below its law-1 term; the score never falls`, () => {
      const town = births[seed].lit;
      const legitimacy = town.powerStructure.publicLegitimacy;
      const label = town.economicState?.safetyProfile?.safetyLabel;
      expect(typeof label, `${seed}: a born town carries its safety label`).toBe('string');
      expect(legitimacy.breakdown.safety, `${seed} at ${label}`).toBe(litSafety(label, tier));
      expect(legitimacy.breakdown.safety, `${seed} at ${label}: below its law-1 term`).toBeGreaterThanOrEqual(todaySafety(label));
      const { prosperity, safety, defense, food, merits = 0 } = legitimacy.breakdown; // FORTUNE U5a: the merits of rule, added after the sum's clamp
      expect(legitimacy.score - merits).toBe(clamp(50 + prosperity + safety + defense + food, 0, 100));
      // the same town's score before this unit: the stored score less this unit's term plus the law-1 term
      const before = clamp(50 + prosperity + todaySafety(label) + defense + food, 0, 100);
      expect(legitimacy.score, `${seed}: the score fell`).toBeGreaterThanOrEqual(before);
      expect(rankOf(legitimacy.label), `${seed}: the band fell`).toBeLessThanOrEqual(rankOf(legitimacyBandFor(before).label));
    });
  }
});

describe('(e) without the marker every birth is byte-identical to _fortuneLawVersion: 1', () => {
  for (const { seed } of SEEDS) {
    it(`${seed}`, () => {
      const { none, one } = births[seed];
      expect(bytesWithoutMarker(none)).toBe(JSON.stringify(none));
      expect(bytesWithoutMarker(one)).toBe(bytesWithoutMarker(none));
    });
  }
});
