// constants.js — extracted from bundle

export const TIER_ORDER = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
export const TOWN_PLUS_TIERS = ['town', 'city', 'metropolis'];
export const SMALL_TIERS = ['thorp', 'hamlet', 'village'];

// X-46 THE HISTORICAL SCALE, car 1 (the owner, 2026-11-03; ODQ §934.104): the ROLL bands are
// the owner's historical table, and adjacent bands OVERLAP BY DESIGN (a large hamlet and a small
// village are the same size). A generated settlement's population is rolled uniformly inside
// the band of the tier the DM chose (resolveConfig), and that tier always wins. The metropolis
// band is open ("15,000+") in the owner's words. The owner, 2026-11-04: "bring it back to 1
// million, but make it so that anything above 200,00 gets increasingly rarer as it goes up in
// random roll", "actually start that thinning out at 50,000", "it thins out even harder starting
// at 100,000+ then again at 200,000+", "actually just make it exponential in a way hitting those
// three benchmarks". The metropolis `max` is the BODY of the random roll, 50,000, where the
// thinning starts; it is not a ceiling: the roll thins past it to 1,000,000
// (METROPOLIS_ROLL_TUNING below), a custom population may be any number, and every reader prints
// the metropolis as "15,000+".
//   thorp       5–30      "A few farmsteads clustered together"
//   hamlet      20–100    "Small rural settlement; little or no dedicated infrastructure"
//   village     75–400    "Established agricultural community, often with a church/mill/inn"
//   town        300–2,500 "Market/trade center; craftsmen and specialized occupations"
//   city        2,000–15,000 "Major administrative, religious, military, or commercial center"
//   metropolis  15,000+   "Major regional/national center"
export const POPULATION_RANGES = {
  thorp:      { min: 5,     max: 30 },
  hamlet:     { min: 20,    max: 100 },
  village:    { min: 75,    max: 400 },
  town:       { min: 300,   max: 2500 },
  city:       { min: 2000,  max: 15000 },
  metropolis: { min: 15000, max: 50000 }, // the body of the roll, not a ceiling; the roll thins past it to 1,000,000
};

// X-46 car 1b, THE THINNING TAIL (the owner, 2026-11-04: thinning starts at 50,000, thins harder
// at 100,000+ and again at 200,000+, "just make it exponential in a way hitting those three
// benchmarks"; the owner chose this curve over a three-knee power law and a rarer variant). A
// rolled metropolis is uniform over the body [bodyMin, bodyMax] like every other tier's band
// with probability 1 - tailShare; with probability tailShare it lands past bodyMax, where the
// density per person is exp(-thinning * D²), D = doublings past 50,000 (D = log2(pop / 50,000)),
// truncated at tailMax. Each doubling thins harder than the last: x0.61 from 50k to 100k, x0.22
// from 100k to 200k, x0.08 from 200k to 400k. tailShare 0.3 is Zipf's share past 50,000 among
// cities past 15,000 (15,000 / 50,000), so most metropolises stay 15,000-50,000 places; the
// density steps down at 50,000 (about 5x) and bends from there. Measured: above 50,000 30%,
// above 100,000 15%, above 200,000 3.8%, above 500,000 0.16%, above 900,000 about 1 in 25,000.
// The owner delegated the choice ("i leave everything to your judgement", 2026-11-04) after
// choosing the continuous variant (70% past 50,000); the seat took this one. `tailMax` is the historical extreme (Rome, Baghdad, Constantinople at
// their height): the edge a draw needs, not a cap on the record (a custom population is never
// clamped). Registered tuning; for the owner's veto.
export const METROPOLIS_ROLL_TUNING = Object.freeze({
  bodyMin: 15000,
  bodyMax: 50000,
  tailMax: 1000000,
  thinning: 0.5,
  tailShare: 0.3,
});

/** Grid resolution of the tail's tabulated CDF (a deterministic numerical inverse). */
const METROPOLIS_TAIL_STEPS = 4096;

/**
 * The tail's cumulative mass, tabulated once on a grid in D (pure, computed from the table at
 * module load): `cum[i]` is the unnormalised mass from 50,000 to 50,000 * 2^(i * dD).
 */
export const METROPOLIS_ROLL_SHAPE = (() => {
  const { bodyMax, tailMax, thinning } = METROPOLIS_ROLL_TUNING;
  const span = Math.log2(tailMax / bodyMax);
  const dD = span / METROPOLIS_TAIL_STEPS;
  // mass element in pop: density(D) * dpop, dpop = bodyMax * 2^D * ln2 * dD
  const element = (D) => Math.exp(-thinning * D * D) * bodyMax * (2 ** D) * Math.LN2;
  const cum = [0];
  for (let i = 1; i <= METROPOLIS_TAIL_STEPS; i++) {
    cum.push(cum[i - 1] + 0.5 * (element((i - 1) * dD) + element(i * dD)) * dD);
  }
  return Object.freeze({ cum: Object.freeze(cum), dD, tailMass: cum[METROPOLIS_TAIL_STEPS] });
})();

/**
 * The metropolis population roll: ONE kernel draw, exactly as the uniform roll it replaces, so
 * every later step of a seed sees the same draw count. u >= tailShare lands in the body, uniform
 * as randInt is; u < tailShare is rescaled across the tail and inverted through the tabulated
 * CDF (binary search, then linear interpolation inside the step).
 * @param {{ random: () => number }} rng
 * @returns {number}
 */
export const rollMetropolisPopulation = (rng) => {
  const { bodyMin, bodyMax, tailMax, tailShare } = METROPOLIS_ROLL_TUNING;
  const { cum, dD, tailMass } = METROPOLIS_ROLL_SHAPE;
  const u = rng.random();
  if (u >= tailShare) {
    const v = (u - tailShare) / (1 - tailShare);
    return Math.min(bodyMax, Math.floor(v * (bodyMax - bodyMin + 1)) + bodyMin);
  }
  const target = (u / tailShare) * tailMass;
  let lo = 0;
  let hi = cum.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (cum[mid] <= target) lo = mid; else hi = mid;
  }
  const step = cum[hi] - cum[lo];
  const D = (lo + (step > 0 ? (target - cum[lo]) / step : 0)) * dD;
  return Math.min(tailMax, Math.max(bodyMax, Math.round(bodyMax * 2 ** D)));
};

/**
 * Where a population sits inside the metropolis band, read on a LOG scale over the whole roll
 * [bodyMin, tailMax] = [15,000, 1,000,000], clamped: 15,000 -> 0, 1,000,000 and above -> 1.
 * For car 4's population tilt (a linear read would pin every city past the body at the top).
 * @param {number} pop
 * @returns {number}
 */
export const metropolisBandPosition = (pop) => {
  const { bodyMin, tailMax } = METROPOLIS_ROLL_TUNING;
  const x = (Math.log(Math.max(pop, bodyMin)) - Math.log(bodyMin)) / (Math.log(tailMax) - Math.log(bodyMin));
  return Number.isFinite(x) ? Math.min(1, Math.max(0, x)) : 0;
};

// THE STAMP (X-46 car 1): the one population → tier law, for a 'custom' population and every
// tier-change resolver. Because the roll bands overlap, the stamp cuts each overlap at ONE point,
// inside it: a population at or above a tier's cut stamps that tier (or higher). Each value is
// the LOWEST population that stamps its tier; thorp has no cut.
export const TIER_STAMP_CUTS = Object.freeze({
  hamlet:     25,
  village:    88,
  town:       350,
  city:       2250,
  metropolis: 15000,
});

export const SEVERITY = {
  CRITICAL:     'critical',
  IMPLAUSIBLE:  'implausible',
  INEFFICIENCY: 'inefficiency',
  DEPENDENCY:   'dependency',
};

export const tierAtLeast = (tier, min) =>
  TIER_ORDER.indexOf(tier) >= TIER_ORDER.indexOf(min);

export const popToTier = (pop) =>
  // The cuts live in TIER_STAMP_CUTS (one home); each lies inside the overlap of the two roll
  // bands it separates, so a stamped tier's own roll band always holds the population. Spelled
  // with `<` so a non-number falls through every comparison exactly as it always has.
  pop < TIER_STAMP_CUTS.hamlet       ? 'thorp'
  : pop < TIER_STAMP_CUTS.village    ? 'hamlet'
  : pop < TIER_STAMP_CUTS.town       ? 'village'
  : pop < TIER_STAMP_CUTS.city       ? 'town'
  : pop < TIER_STAMP_CUTS.metropolis ? 'city'
  : 'metropolis';

export const getMagicLevel = (priority = 50) =>
  priority === 0  ? 'none'
  : priority <= 25  ? 'low'
  : priority <= 65  ? 'medium'
  : 'high';

// ── THE MAGIC LICENCE LADDER (MF-CH2a) ───────────────────────────────────────
// `getMagicLevel` reads a WORLD's magic dial and returns one of four tokens. A
// catalog institution's `magicLicense` is the OTHER half of the same vocabulary:
// the WEAKEST world this entry is licensed for. 'none' means the entry needs no
// functioning magic at all — an alchemist's shop is a chemical trade, and a
// charter hall is a hall. The two halves meet at `magicLicenceAtLeast`, so the
// four tokens are spelled exactly once, here, and every gate imports them.
//
// The ladder is deliberately keyed on the SAME strings getMagicLevel emits and
// is lower-case for that reason; a licence value that is not one of them is not
// a weaker licence, it is an authoring error, and `normaliseMagicLicence`
// returns null so a walker can see it.

/** The four magic-level tokens, weakest first. Index IS the rank. */
export const MAGIC_LICENCE_LEVELS = Object.freeze(['none', 'low', 'medium', 'high']);

/**
 * Normalise an authored licence to one of MAGIC_LICENCE_LEVELS.
 * @param {unknown} value
 * @returns {string|null} the token, or null when the value is absent/unknown
 */
export const normaliseMagicLicence = (value) => {
  if (typeof value !== 'string') return null;
  const token = value.trim().toLowerCase();
  return MAGIC_LICENCE_LEVELS.includes(token) ? token : null;
};

/**
 * Does `licence` sit at or above `floor` on the ladder? An absent or unknown
 * licence answers false — the caller decides what to do with "I do not know",
 * and no gate may read silence as permission.
 * @param {unknown} licence
 * @param {unknown} floor
 * @returns {boolean}
 */
export const magicLicenceAtLeast = (licence, floor) => {
  const a = normaliseMagicLicence(licence);
  const b = normaliseMagicLicence(floor);
  if (a === null || b === null) return false;
  return MAGIC_LICENCE_LEVELS.indexOf(a) >= MAGIC_LICENCE_LEVELS.indexOf(b);
};

// Canonical prosperity tiers — the vocabulary economicGenerator emits. ('Subsistence'
// is an internal base label remapped to Struggling/Poor before emission; it is kept
// here for tolerance toward legacy or hand-written saves.) Consumers
// that grade on prosperity (deriveResilience, corruption climate, faction dynamics)
// must rank via this list, not hand-typed string matches: the resilience dial spent
// a long time crediting only the extremes because it matched a vocabulary
// ('Modest') the generator never produced.
export const PROSPERITY_TIERS = Object.freeze([
  'Subsistence', 'Struggling', 'Poor', 'Moderate', 'Comfortable', 'Prosperous', 'Wealthy',
]);

/** Rank a prosperity label 0..6 (Subsistence..Wealthy); -1 for unknown. Accepts {tier} objects. */
export const prosperityRank = (prosperity) => {
  const label = typeof prosperity === 'string' ? prosperity : prosperity?.tier;
  return PROSPERITY_TIERS.indexOf(label);
};

// Note: `chance`, `pick`, `randInt` used to be re-exported here from
// `../generators/rngContext.js`. That created a circular import between
// the `data` and `engine` build chunks (`data → engine → data`), which
// Rollup warned about and which inflated initial chunk graphs. Removed
// 2026-04. Import these helpers directly from `generators/rngContext.js`
// in any caller that needs them.
