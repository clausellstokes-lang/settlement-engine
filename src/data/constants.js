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

/** @param {string} tier @param {string} min @returns {boolean} */
export const tierAtLeast = (tier, min) =>
  TIER_ORDER.indexOf(tier) >= TIER_ORDER.indexOf(min);

/** @param {number} pop @returns {string} */
export const popToTier = (pop) =>
  pop <= 80    ? 'thorp'
  : pop <= 400   ? 'hamlet'
  : pop <= 900   ? 'village'
  : pop <= 5000  ? 'town'
  : pop <= 25000 ? 'city'
  : 'metropolis';

/** @param {number} [priority] @returns {string} */
export const getMagicLevel = (priority = 50) =>
  priority === 0  ? 'none'
  : priority <= 25  ? 'low'
  : priority <= 65  ? 'medium'
  : 'high';

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

/** Rank a prosperity label 0..6 (Subsistence..Wealthy); -1 for unknown. Accepts {tier} objects. @param {any} prosperity @returns {number} */
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
