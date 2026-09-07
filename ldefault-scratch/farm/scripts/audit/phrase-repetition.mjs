/**
 * SP-6 PHRASE-REPETITION INSTRUMENT.
 *
 * Measures the sentence Wizard News actually renders (`newsBodyText`, then headline)
 * inside the reader's real collision cell: one settlement during one season-sized
 * tick window. Exact text and structural-family repeats are both reported. The
 * family rate is the binding metric because slot changes do not create authored
 * depth; entries without family metadata fall back to their normalized sentence and
 * are counted as untracked rather than silently excluded.
 *
 * Pure audit leaf: no clock, rng, filesystem, simulation write, or mutation.
 */

import { newsBodyText } from '../../src/domain/display/newsBody.js';

export const PHRASE_REPETITION_SCHEMA_VERSION = 1;
export const PHRASE_SEASON_TICKS = 13;

/** @param {unknown} value @returns {number} */
function finite(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

/** @param {unknown} value @returns {string} */
export function normalizeRenderedSentence(value) {
  return String(value || '').trim().replace(/\s+/g, ' ').toLowerCase();
}

/** @param {Record<string, unknown>} entry @returns {string} */
function renderedSentenceOf(entry) {
  const body = String(newsBodyText(entry) || '').trim();
  if (body) return body;
  const headline = String(entry.headline || '').trim();
  if (headline) return headline;
  return '';
}

/** @param {Map<string, number>} counts @returns {number} */
function repeatsIn(counts) {
  let repeats = 0;
  for (const count of counts.values()) repeats += Math.max(0, count - 1);
  return repeats;
}

/** @param {number} numerator @param {number} denominator @returns {number} */
function rate(numerator, denominator) {
  return denominator > 0 ? Math.round((numerator / denominator) * 10000) / 10000 : 0;
}

/**
 * @typedef {Object} PhraseRepetitionWindow
 * @property {string} settlementId
 * @property {number} window
 * @property {number} startTick
 * @property {number} endTick
 * @property {number} observations
 * @property {number} exactRepeats
 * @property {number} familyRepeats
 * @property {number} exactRepeatRate
 * @property {number} familyRepeatRate
 * @property {number} untrackedFamilies
 */

/**
 * Measure rendered prose repetition per settlement per season window.
 * Duplicate copies of the same news id are folded before measurement, while one
 * multi-settlement entry is counted once in each settlement where a reader sees it.
 *
 * @param {Array<Record<string, unknown>>} entries
 * @param {{ windowTicks?: number }} [options]
 * @returns {{schemaVersion:number,kind:string,windowTicks:number,observations:number,
 *   windows:number,exactRepeats:number,familyRepeats:number,exactRepeatRate:number,
 *   familyRepeatRate:number,untrackedFamilies:number,worstWindow:PhraseRepetitionWindow|null,
 *   byWindow:PhraseRepetitionWindow[]}}
 */
export function measurePhraseRepetition(entries = [], options = {}) {
  const windowTicks = Math.max(1, Math.floor(finite(options.windowTicks) || PHRASE_SEASON_TICKS));
  /** @type {Map<string, {settlementId:string,window:number,observations:number,
   *   exact:Map<string,number>,families:Map<string,number>,untrackedFamilies:number}>} */
  const groups = new Map();
  const seenIds = new Set();

  for (const [index, raw] of (Array.isArray(entries) ? entries : []).entries()) {
    if (!raw || typeof raw !== 'object') continue;
    const id = raw.id == null ? `__unidentified_${index}` : String(raw.id);
    if (seenIds.has(id)) continue;
    seenIds.add(id);
    const sentence = renderedSentenceOf(raw);
    const sentenceKey = normalizeRenderedSentence(sentence);
    if (!sentenceKey) continue;
    const ids = [...new Set((Array.isArray(raw.settlementIds) ? raw.settlementIds : [])
      .filter((value) => value != null && value !== '')
      .map(String))].sort();
    if (ids.length === 0) continue;
    const tick = Math.max(0, Math.floor(finite(raw.tick)));
    const window = Math.floor(tick / windowTicks);
    const familyId = String(raw.familyId || '').trim();
    const familyKey = familyId || `untracked:${sentenceKey}`;

    for (const settlementId of ids) {
      const key = `${settlementId}\u0000${window}`;
      const group = groups.get(key) || {
        settlementId,
        window,
        observations: 0,
        exact: new Map(),
        families: new Map(),
        untrackedFamilies: 0,
      };
      group.observations += 1;
      group.exact.set(sentenceKey, (group.exact.get(sentenceKey) || 0) + 1);
      group.families.set(familyKey, (group.families.get(familyKey) || 0) + 1);
      if (!familyId) group.untrackedFamilies += 1;
      groups.set(key, group);
    }
  }

  /** @type {PhraseRepetitionWindow[]} */
  const byWindow = [...groups.values()].map((group) => {
    const exactRepeats = repeatsIn(group.exact);
    const familyRepeats = repeatsIn(group.families);
    return {
      settlementId: group.settlementId,
      window: group.window,
      startTick: group.window * windowTicks,
      endTick: ((group.window + 1) * windowTicks) - 1,
      observations: group.observations,
      exactRepeats,
      familyRepeats,
      exactRepeatRate: rate(exactRepeats, group.observations),
      familyRepeatRate: rate(familyRepeats, group.observations),
      untrackedFamilies: group.untrackedFamilies,
    };
  }).sort((left, right) => (
    left.settlementId < right.settlementId ? -1
      : left.settlementId > right.settlementId ? 1
        : left.window - right.window
  ));

  const observations = byWindow.reduce((total, row) => total + row.observations, 0);
  const exactRepeats = byWindow.reduce((total, row) => total + row.exactRepeats, 0);
  const familyRepeats = byWindow.reduce((total, row) => total + row.familyRepeats, 0);
  const untrackedFamilies = byWindow.reduce((total, row) => total + row.untrackedFamilies, 0);
  const worstWindow = byWindow.slice().sort((left, right) => (
    right.familyRepeatRate - left.familyRepeatRate
    || right.observations - left.observations
    || (left.settlementId < right.settlementId ? -1 : left.settlementId > right.settlementId ? 1 : 0)
    || left.window - right.window
  ))[0] || null;

  return {
    schemaVersion: PHRASE_REPETITION_SCHEMA_VERSION,
    kind: 'phrase_repetition',
    windowTicks,
    observations,
    windows: byWindow.length,
    exactRepeats,
    familyRepeats,
    exactRepeatRate: rate(exactRepeats, observations),
    familyRepeatRate: rate(familyRepeats, observations),
    untrackedFamilies,
    worstWindow,
    byWindow,
  };
}

/**
 * Apply an authored envelope to a measurement. The audit harness owns the metric;
 * a later tuning/sign-off pass may supply a different bound without changing how
 * evidence is counted.
 *
 * @param {Array<Record<string, unknown>>} entries
 * @param {{maxFamilyRepeatRate:number,minObservations?:number,windowTicks?:number}} options
 */
export function evaluatePhraseRepetitionEnvelope(entries = [], options = {}) {
  const measurement = measurePhraseRepetition(entries, options);
  const maxFamilyRepeatRate = Math.max(0, Math.min(1, finite(options.maxFamilyRepeatRate)));
  const minObservations = Math.max(1, Math.floor(finite(options.minObservations) || 1));
  return {
    measurement,
    maxFamilyRepeatRate,
    minObservations,
    powered: measurement.observations >= minObservations,
    passed: measurement.observations >= minObservations
      && measurement.familyRepeatRate <= maxFamilyRepeatRate,
  };
}
