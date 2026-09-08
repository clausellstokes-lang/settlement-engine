// constants.js — extracted from bundle

export const TIER_ORDER = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
export const TOWN_PLUS_TIERS = ['town', 'city', 'metropolis'];
export const SMALL_TIERS = ['thorp', 'hamlet', 'village'];

export const POPULATION_RANGES = {
  thorp:      { min: 8,     max: 60 },
  hamlet:     { min: 61,    max: 400 },
  village:    { min: 401,   max: 900 },
  town:       { min: 901,   max: 5000 },
  city:       { min: 5001,  max: 25000 },
  metropolis: { min: 25001, max: 100000 },
};

export const SEVERITY = {
  CRITICAL:     'critical',
  IMPLAUSIBLE:  'implausible',
  INEFFICIENCY: 'inefficiency',
  DEPENDENCY:   'dependency',
};

export const tierAtLeast = (tier, min) =>
  TIER_ORDER.indexOf(tier) >= TIER_ORDER.indexOf(min);

export const popToTier = (pop) =>
  // Boundaries must agree with POPULATION_RANGES exactly, else a settlement is
  // stamped with a tier whose own max it exceeds. thorp maxes at 60 (hamlet
  // starts at 61); this was previously 80, leaking pop 61-80 into `thorp`.
  pop <= 60    ? 'thorp'
  : pop <= 400   ? 'hamlet'
  : pop <= 900   ? 'village'
  : pop <= 5000  ? 'town'
  : pop <= 25000 ? 'city'
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
