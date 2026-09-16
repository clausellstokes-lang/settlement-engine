/**
 * tracePresentation.js — reader-facing labels for structured simulation traces.
 *
 * Trace records deliberately store stable machine vocabulary (`targetId`,
 * `source`, `result`, and downstream `target`) because those values are joined
 * across generator stages. The Pipeline Rail is a presentation boundary: it
 * must explain those records without exposing dotted ids, enum separators,
 * snake_case, camelCase, or config assignments to the reader.
 *
 * These helpers are pure projections. They never mutate a trace, resolve a
 * registry entry, or infer a mechanical effect that the trace did not record.
 * Known structural prefixes gain a small authored noun; every unknown token
 * falls back to mechanical word splitting so future trace types remain legible.
 */

import { humanizeToken } from './humanizeEngineTokens.js';

/** @type {Readonly<Record<string, string>>} */
const EXACT_LABELS = Object.freeze({
  baseChance: 'Base likelihood',
  custom: 'Your custom content',
  event: 'A settlement edit',
  governingFaction: 'Governing faction',
  institutionMix: 'Institution mix',
  institutionRoster: 'Local institutions',
  nearbyResources: 'Nearby resources',
  powerStructure: 'Power structure',
  stressGenerator: 'Settlement conditions',
  substitute: 'A substitute input',
  supplyChainCascade: 'Supply-chain requirements',
  terrainCompatibility: 'Terrain and trade access',
  userConfig: 'Your choices',
});

/** @type {Readonly<Record<string, string>>} */
const FIELD_LABELS = Object.freeze({
  'config._importedNeighbor': 'Imported neighbouring settlement',
  'config.culture': 'Your culture choice',
  'config.monsterThreat': 'Your regional threat choice',
  'config.population': 'Your population choice',
  'config.settType': 'Your settlement size choice',
  'config.terrainOverride': 'Your terrain choice',
  'config.tradeRouteAccess': 'Your trade access choice',
  'world.magicExists': 'World magic setting',
});

/** @type {Readonly<Record<string, string>>} */
const PREFIX_LABELS = Object.freeze({
  config: 'Your setting',
  corruption: 'Corruption',
  culture: 'Culture',
  dependency: 'Required institution',
  faction: 'Faction',
  flaw: 'Personal flaw',
  institution: 'Institution',
  monsterThreat: 'Regional threat',
  neighbour: 'Neighbour',
  processor: 'Processing institution',
  resource: 'Resource',
  stressor: 'Pressure',
  terrain: 'Terrain',
  tier: 'Settlement size',
  tradeRoute: 'Trade access',
  world: 'World rule',
});

/** @type {Readonly<Record<string, string>>} */
const SCALAR_LABELS = Object.freeze({
  auto: 'Automatic',
  false: 'Off',
  null: 'Not set',
  random: 'Random',
  random_culture: 'Random',
  random_threat: 'Random',
  random_trade: 'Random',
  true: 'On',
});

/** @type {Readonly<Record<string, string>>} */
const RESULT_LABELS = Object.freeze({
  derived: 'Derived',
  impaired: 'Impaired',
  present: 'Present',
  present_but_depleted: 'Present, but depleted',
  rolled: 'Chosen from eligible options',
  selected: 'Selected',
  subsumed: 'Replaced by a larger institution',
  suppressed: 'Suppressed',
  overridden: 'Adjusted by a governing rule',
});

/**
 * Uppercase only the first character; preserve the remaining authored text.
 * @param {unknown} value
 * @returns {string}
 */
function initialUpper(value) {
  const text = String(value || '').trim();
  return text ? `${text.charAt(0).toUpperCase()}${text.slice(1)}` : '';
}

/**
 * Format the value side of a stored assignment. Known control values gain their
 * actual UI meaning; other values are only de-tokenized.
 * @param {unknown} value
 * @returns {string}
 */
function scalarLabel(value) {
  const text = String(value ?? '').trim();
  if (!text) return 'Not set';
  if (SCALAR_LABELS[text] != null) return SCALAR_LABELS[text];
  // A dotted trace id can retain an authored custom name after the prefix.
  // Preserve such prose instead of lowercasing it as if it were an enum token.
  if (/\s/.test(text) && !text.includes('_')) return initialUpper(text);
  return initialUpper(humanizeToken(text));
}

/**
 * Translate one trace token or assignment into reader-facing words.
 *
 * @param {unknown} token
 * @returns {string}
 */
export function traceTokenLabel(token) {
  const text = String(token ?? '').trim();
  if (!text) return '';
  if (EXACT_LABELS[text] != null) return EXACT_LABELS[text];
  if (FIELD_LABELS[text] != null) return FIELD_LABELS[text];

  // Some causes combine two stored sources (`tier.city + tradeRoute.road`).
  // Keep both facts, but replace the expression syntax with ordinary prose.
  const combined = text.split(/\s+\+\s+/).filter(Boolean);
  if (combined.length > 1) {
    return combined.map(traceTokenLabel).filter(Boolean).join(' and ');
  }

  const assignmentAt = text.indexOf('=');
  if (assignmentAt > 0) {
    const field = text.slice(0, assignmentAt).trim();
    const value = text.slice(assignmentAt + 1).trim();
    const fieldLabel = FIELD_LABELS[field] || traceTokenLabel(field);
    return `${fieldLabel}: ${scalarLabel(value)}`;
  }

  const [prefix, ...tailParts] = text.split('.');
  if (tailParts.length > 0) {
    const prefixLabel = PREFIX_LABELS[prefix] || scalarLabel(prefix);
    const tail = tailParts.join(' ');
    return `${prefixLabel}: ${scalarLabel(tail)}`;
  }

  return scalarLabel(text);
}

/**
 * Reader-facing subject of a trace decision.
 *
 * @param {{ targetId?: unknown, targetType?: unknown } | null | undefined} trace
 * @returns {string}
 */
export function traceTargetLabel(trace) {
  const target = traceTokenLabel(trace?.targetId);
  if (target) return target;
  const kind = traceTokenLabel(trace?.targetType);
  return kind || 'Recorded decision';
}

/**
 * Reader-facing decision verb.
 *
 * @param {unknown} result
 * @returns {string}
 */
export function traceResultLabel(result) {
  const text = String(result ?? '').trim();
  if (!text) return 'Recorded';
  return RESULT_LABELS[text] || initialUpper(humanizeToken(text));
}

/**
 * Humanize a stored target/effect phrase without changing its claimed degree.
 * Percentages, ranges, and signs remain intact as useful precision.
 *
 * @param {unknown} effect
 * @returns {string}
 */
export function traceEffectLabel(effect) {
  const text = String(effect ?? '').trim();
  return text ? initialUpper(humanizeToken(text)) : '';
}
