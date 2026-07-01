/**
 * domain/genreProfile.js — Genre as a structured input.
 *
 * Genre is currently a single config flag
 * (`config.genre`). This module promotes it to a structured profile
 * exposing the modifiers consumers (AI overlay, daily-life prose,
 * threat selection, hook style) should read.
 *
 *   deriveGenreProfile(settlement) -> {
 *     genre,
 *     institutionEmphasis[],   institution categories to amplify
 *     threatTypeBias[],        threat types to favor / dampen
 *     magicBias,               'amplify' | 'neutral' | 'dampen'
 *     violenceLevel,           'minimal' | 'restrained' | 'frank' | 'brutal'
 *     weirdnessTolerance,      'low' | 'moderate' | 'high' | 'pervasive'
 *     hookStyle,               'gentle' | 'classic' | 'noir' | 'gothic' | 'mythic' | 'absurd'
 *     proseDensity,            'sparse' | 'standard' | 'lush'
 *     contributors[]
 *   }
 *
 * Pure read-only. Doesn't reshape generation today — it exposes the
 * structured modifiers so downstream consumers (AI overlay,
 * daily life, threat selection) can read uniform
 * shape instead of branching on config.genre internally.
 */

export const CANONICAL_GENRES = Object.freeze([
  'low_magic',
  'grimdark',
  'heroic',
  'weird',
  'cozy',
  'frontier',
  'gothic',
  'political',
  'sword_and_sorcery',
  'mythic_high',
]);

const GENRE_TEMPLATES = Object.freeze({
  low_magic: {
    institutionEmphasis: ['civic', 'enforcement', 'craft'],
    threatTypeBias:      ['bandit_raids', 'rival_neighbor', 'famine'],
    magicBias:           'dampen',
    violenceLevel:       'frank',
    weirdnessTolerance:  'low',
    hookStyle:           'classic',
    proseDensity:        'standard',
  },
  grimdark: {
    institutionEmphasis: ['enforcement', 'religious', 'criminal'],
    threatTypeBias:      ['siege', 'cult', 'corruption', 'plague'],
    magicBias:           'dampen',
    violenceLevel:       'brutal',
    weirdnessTolerance:  'moderate',
    hookStyle:           'noir',
    proseDensity:        'standard',
  },
  heroic: {
    institutionEmphasis: ['religious', 'civic', 'craft'],
    threatTypeBias:      ['monster_pressure', 'siege', 'cult'],
    magicBias:           'amplify',
    violenceLevel:       'restrained',
    weirdnessTolerance:  'moderate',
    hookStyle:           'classic',
    proseDensity:        'lush',
  },
  weird: {
    institutionEmphasis: ['arcane', 'religious', 'occult'],
    threatTypeBias:      ['arcane_instability', 'cult', 'monster_pressure'],
    magicBias:           'amplify',
    violenceLevel:       'frank',
    weirdnessTolerance:  'pervasive',
    hookStyle:           'absurd',
    proseDensity:        'lush',
  },
  cozy: {
    institutionEmphasis: ['civic', 'craft', 'hospitality'],
    threatTypeBias:      ['bandit_raids'],
    magicBias:           'neutral',
    violenceLevel:       'minimal',
    weirdnessTolerance:  'low',
    hookStyle:           'gentle',
    proseDensity:        'lush',
  },
  frontier: {
    institutionEmphasis: ['enforcement', 'trade', 'craft'],
    threatTypeBias:      ['monster_pressure', 'bandit_raids', 'rival_neighbor'],
    magicBias:           'neutral',
    violenceLevel:       'frank',
    weirdnessTolerance:  'moderate',
    hookStyle:           'classic',
    proseDensity:        'standard',
  },
  gothic: {
    institutionEmphasis: ['religious', 'arcane'],
    threatTypeBias:      ['cult', 'plague', 'arcane_instability', 'corruption'],
    magicBias:           'amplify',
    violenceLevel:       'restrained',
    weirdnessTolerance:  'high',
    hookStyle:           'gothic',
    proseDensity:        'lush',
  },
  political: {
    institutionEmphasis: ['civic', 'trade', 'religious'],
    threatTypeBias:      ['corruption', 'unrest', 'rival_neighbor', 'economic_collapse'],
    magicBias:           'neutral',
    violenceLevel:       'restrained',
    weirdnessTolerance:  'low',
    hookStyle:           'noir',
    proseDensity:        'lush',
  },
  sword_and_sorcery: {
    institutionEmphasis: ['arcane', 'criminal', 'craft'],
    threatTypeBias:      ['monster_pressure', 'cult', 'bandit_raids'],
    magicBias:           'amplify',
    violenceLevel:       'brutal',
    weirdnessTolerance:  'high',
    hookStyle:           'classic',
    proseDensity:        'standard',
  },
  mythic_high: {
    institutionEmphasis: ['religious', 'arcane', 'civic'],
    threatTypeBias:      ['arcane_instability', 'monster_pressure', 'cult'],
    magicBias:           'amplify',
    violenceLevel:       'restrained',
    weirdnessTolerance:  'pervasive',
    hookStyle:           'mythic',
    proseDensity:        'lush',
  },
});

const NEUTRAL_TEMPLATE = Object.freeze({
  institutionEmphasis: [],
  threatTypeBias:      [],
  magicBias:           'neutral',
  violenceLevel:       'restrained',
  weirdnessTolerance:  'moderate',
  hookStyle:           'classic',
  proseDensity:        'standard',
});

// ── Composer ─────────────────────────────────────────────────────────────

/**
 * Derive the structured GenreProfile.
 *
 * @param {import('./settlement.schema.js').SimSettlement} settlement
 * @returns {Object} GenreProfile
 */
export function deriveGenreProfile(settlement) {
  if (!settlement) {
    return finalizeProfile(null, NEUTRAL_TEMPLATE, [{
      source: 'config.genre', effect: 'absent',
      reason: 'No settlement provided; using neutral genre template.',
    }]);
  }
  const raw = settlement.config?.genre || settlement.genre || null;
  const contributors = [];

  if (!raw) {
    contributors.push({ source: 'config.genre', effect: 'absent', reason: 'No genre set; using neutral template.' });
    return finalizeProfile(null, NEUTRAL_TEMPLATE, contributors);
  }

  const normalized = String(raw).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
  const template = /** @type {Record<string, any>} */ (GENRE_TEMPLATES)[normalized];
  if (!template) {
    contributors.push({
      source: 'config.genre',
      effect: 'unknown',
      reason: `Unknown genre "${raw}"; using neutral template.`,
    });
    return finalizeProfile(normalized, NEUTRAL_TEMPLATE, contributors);
  }
  contributors.push({
    source: 'config.genre',
    effect: 'matched',
    reason: `Genre "${normalized}" matched canonical template.`,
  });
  return finalizeProfile(normalized, template, contributors);
}

/**
 * @param {string|null} genre
 * @param {any} template
 * @param {any[]} contributors
 */
function finalizeProfile(genre, template, contributors) {
  return {
    genre,
    institutionEmphasis: [...template.institutionEmphasis],
    threatTypeBias:      [...template.threatTypeBias],
    magicBias:           template.magicBias,
    violenceLevel:       template.violenceLevel,
    weirdnessTolerance:  template.weirdnessTolerance,
    hookStyle:           template.hookStyle,
    proseDensity:        template.proseDensity,
    contributors,
  };
}

// ── Diagnostic helpers ───────────────────────────────────────────────────

/** Catalog. */
export function supportedGenres() {
  return [...CANONICAL_GENRES];
}

/**
 * Catalog accessor for a single genre's template (read-only copy).
 * @param {string} genre
 */
export function genreTemplate(genre) {
  const t = /** @type {Record<string, any>} */ (GENRE_TEMPLATES)[genre];
  if (!t) return null;
  return {
    institutionEmphasis: [...t.institutionEmphasis],
    threatTypeBias:      [...t.threatTypeBias],
    magicBias:           t.magicBias,
    violenceLevel:       t.violenceLevel,
    weirdnessTolerance:  t.weirdnessTolerance,
    hookStyle:           t.hookStyle,
    proseDensity:        t.proseDensity,
  };
}

/**
 * Human-readable summary.
 * @param {import('./settlement.schema.js').SimSettlement} settlement
 */
export function summarizeGenre(settlement) {
  const g = /** @type {any} */ (deriveGenreProfile(settlement));
  return [
    `Genre: ${g.genre || 'unset'}.`,
    `Institution emphasis: ${g.institutionEmphasis.join(', ') || 'neutral'}.`,
    `Threat type bias: ${g.threatTypeBias.join(', ') || 'neutral'}.`,
    `Magic: ${g.magicBias}. Violence: ${g.violenceLevel}. Weirdness tolerance: ${g.weirdnessTolerance}.`,
    `Hook style: ${g.hookStyle}. Prose density: ${g.proseDensity}.`,
  ];
}
