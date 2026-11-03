// constants.js — extracted from bundle

export const TIER_ORDER = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
export const TOWN_PLUS_TIERS = ['town', 'city', 'metropolis'];
export const SMALL_TIERS = ['thorp', 'hamlet', 'village'];

// X-46 THE HISTORICAL SCALE, car 1 (the owner, 2026-11-03; ODQ §934.104): the ROLL bands are
// the owner's historical table, and adjacent bands OVERLAP BY DESIGN (a large hamlet and a small
// village are the same size). A generated settlement's population is rolled uniformly inside
// the band of the tier the DM chose (resolveConfig), and that tier always wins. The metropolis
// band is open ("15,000+") in the owner's words; the roll stops at 60,000.
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
  metropolis: { min: 15000, max: 60000 },
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
