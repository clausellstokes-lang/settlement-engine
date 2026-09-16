/**
 * generationContentProfile.js — first-class boundaries for generated themes.
 *
 * SettlementForge can model coercion, vice, and cruelty, but those subjects
 * must be an explicit product choice rather than an accidental consequence of
 * selecting a large city. Profiles govern what the generator may introduce;
 * they do not rewrite historical saves or player-authored prose after the fact.
 *
 * `grounded` is the default: political violence, crime, poverty, and hard moral
 * choices remain available, while human trafficking and graphic abuse require
 * an explicit opt-in. `heroic` also excludes hard-drug and torture vocabulary.
 * `grim` permits the complete governed vocabulary. `custom` resolves each
 * boundary from config.contentBoundaries.
 *
 * Pure, immutable, and shared by generation steps plus certification.
 */

import {
  isGeneratorOwnedEntity,
} from './generationOwnership.js';

/**
 * @typedef {'human_trafficking' | 'slavery' | 'torture' | 'hard_drugs'} GeneratedContentTopic
 * @typedef {{
 *   human_trafficking: boolean,
 *   slavery: boolean,
 *   torture: boolean,
 *   hard_drugs: boolean,
 * }} GenerationContentBoundaries
 * @typedef {{
 *   id: string,
 *   label: string,
 *   description: string,
 *   boundaries: Readonly<GenerationContentBoundaries>,
 * }} GenerationContentProfile
 */

/** @type {ReadonlyArray<GeneratedContentTopic>} */
export const GENERATED_CONTENT_TOPICS = Object.freeze([
  'human_trafficking',
  'slavery',
  'torture',
  'hard_drugs',
]);

/** @type {Readonly<GenerationContentBoundaries>} */
const BOUNDARY_DEFAULTS = Object.freeze({
  human_trafficking: false,
  slavery: false,
  torture: false,
  hard_drugs: true,
});

/**
 * @param {string} id
 * @param {string} label
 * @param {string} description
 * @param {GenerationContentBoundaries} boundaries
 * @returns {Readonly<GenerationContentProfile>}
 */
const profile = (id, label, description, boundaries) => Object.freeze({
  id,
  label,
  description,
  boundaries: Object.freeze({ ...boundaries }),
});

export const GENERATION_CONTENT_PROFILES = Object.freeze({
  heroic: profile(
    'heroic',
    'Heroic',
    'Adventure, danger, and political conflict without generated trafficking, slavery, torture, or hard-drug themes.',
    {
      human_trafficking: false,
      slavery: false,
      torture: false,
      hard_drugs: false,
    },
  ),
  grounded: profile(
    'grounded',
    'Grounded',
    'Serious conflict and social pressure without generated trafficking, slavery, or torture; vice and narcotics may appear.',
    BOUNDARY_DEFAULTS,
  ),
  grim: profile(
    'grim',
    'Grim',
    'The complete governed dark-theme vocabulary, including systems of coercion and exploitation.',
    {
      human_trafficking: true,
      slavery: true,
      torture: true,
      hard_drugs: true,
    },
  ),
});

/** @type {Readonly<Record<GeneratedContentTopic, RegExp>>} */
const TOPIC_PATTERNS = Object.freeze({
  human_trafficking: /\bhuman trafficking\b|\btrafficking networks?\b|\btraffic(?:ked|king) persons?\b/i,
  slavery: /\bslave(?:ry|s| market| trade)?\b|\benslaved\b|\bforced labo(?:u)?r\b|\bdebt bondage\b|\bcaptive trade\b/i,
  torture: /\btortur(?:e|ed|er|ing)\b|\bbreaking wheel\b|\brack chamber\b/i,
  hard_drugs: /\bopium\b|\bnarcotics?\b|\bhard drugs?\b/i,
});

/**
 * @param {unknown} value
 * @returns {GenerationContentBoundaries}
 */
function normalizeCustomBoundaries(value) {
  const source = value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
  const resolveBoundary = (/** @type {GeneratedContentTopic} */ topic) => (
    typeof source[topic] === 'boolean'
      ? /** @type {boolean} */ (source[topic])
      : BOUNDARY_DEFAULTS[topic]
  );
  return {
    human_trafficking: resolveBoundary('human_trafficking'),
    slavery: resolveBoundary('slavery'),
    torture: resolveBoundary('torture'),
    hard_drugs: resolveBoundary('hard_drugs'),
  };
}

/**
 * Resolve a config into one immutable generation profile.
 *
 * @param {{ contentProfile?: unknown, contentBoundaries?: unknown } | null | undefined} [config]
 * @returns {Readonly<GenerationContentProfile>}
 */
export function resolveGenerationContentProfile(config = {}) {
  const id = String(config?.contentProfile || 'grounded').toLowerCase();
  if (id === 'heroic' || id === 'grounded' || id === 'grim') {
    return GENERATION_CONTENT_PROFILES[id];
  }
  if (id === 'custom') {
    return profile(
      'custom',
      'Custom',
      'Player-defined generated-theme boundaries.',
      normalizeCustomBoundaries(config?.contentBoundaries),
    );
  }
  return GENERATION_CONTENT_PROFILES.grounded;
}

/**
 * Return every governed sensitive topic named by a string or common content
 * object. Multiple topics can match one label (for example "slave trafficking").
 *
 * @param {unknown} value
 * @returns {GeneratedContentTopic[]}
 */
export function generatedContentTopicsOf(value) {
  const record = value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : null;
  const text = typeof value === 'string'
    ? value
    : record
      ? [
          record.name,
          record.label,
          record.title,
          record.type,
          record.desc,
          record.description,
          record.summary,
        ].filter(Boolean).join(' ')
      : '';
  if (!text) return [];
  return GENERATED_CONTENT_TOPICS.filter((topic) => TOPIC_PATTERNS[topic].test(text));
}

/**
 * @param {ReturnType<typeof resolveGenerationContentProfile>} profileValue
 * @param {unknown} content
 * @returns {boolean}
 */
export function allowsGeneratedContent(profileValue, content) {
  if (!isGeneratorOwnedEntity(content)) return true;
  const topics = generatedContentTopicsOf(content);
  return topics.every((topic) => profileValue.boundaries[topic] === true);
}

/**
 * Filter a generated list and retain a receipt of every exclusion.
 *
 * @template T
 * @param {T[] | null | undefined} values
 * @param {ReturnType<typeof resolveGenerationContentProfile>} profileValue
 * @returns {{ kept: T[], excluded: Array<{ value: T, topics: GeneratedContentTopic[] }> }}
 */
export function filterGeneratedContent(values, profileValue) {
  /** @type {T[]} */
  const kept = [];
  /** @type {Array<{ value: T, topics: GeneratedContentTopic[] }>} */
  const excluded = [];
  for (const value of Array.isArray(values) ? values : []) {
    const topics = generatedContentTopicsOf(value);
    if (
      isGeneratorOwnedEntity(value)
      && topics.some((topic) => profileValue.boundaries[topic] !== true)
    ) {
      excluded.push({ value, topics });
    } else {
      kept.push(value);
    }
  }
  return { kept, excluded };
}
