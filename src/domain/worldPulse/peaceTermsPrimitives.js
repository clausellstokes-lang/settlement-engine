/**
 * domain/worldPulse/peaceTermsPrimitives.js — the peace engine's SHARED
 * PRIMITIVES: rounding, record/text coercion, the strict canonical-number
 * validators the WR-7b carried sheet fails closed on, the compliance ranks, and
 * the directed treaty key.
 *
 * Deliberately the family's second floor: it reaches only clamp01 and the
 * reason-key minter, so no leaf can fork a validator. `treatyPairKey` lives here
 * because it IS the ledger's key primitive — the mint, the reads and the document
 * lookup must all spell a treaty key exactly one way.
 *
 * Extracted verbatim from peaceTerms.js by THE DECOMPOSITION WAVE (war tranche,
 * file 2 of 4).
 */
import { clamp01 } from '../../kernel/math.js';
import { reasonPairKey } from './warReasons.js';

/** @typedef {import('./peaceTermsCatalog.js').TreatyLedger} TreatyLedger */

/** @param {number} n @returns {number} */
export function round4(n) { return Math.round(n * 10000) / 10000; }

/** @param {unknown} value @returns {Record<string, unknown>} */
export function recordOf(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {string} */
export function explicitText(value) { return typeof value === 'string' ? value.trim() : ''; }

/** @param {unknown} value @returns {number | null} */
export function finite01OrNull(value) {
  return typeof value === 'number' && Number.isFinite(value) ? clamp01(value) : null;
}

/** @param {unknown} value @returns {string} */
export function strictText(value) {
  return typeof value === 'string' && value.length > 0 && value.trim() === value ? value : '';
}

/** @param {unknown} value @returns {number | null} */
export function nonNegativeInteger(value) {
  return Number.isInteger(value) && Number(value) >= 0 ? Number(value) : null;
}

/** @param {unknown} value @returns {number | null} */
export function positiveInteger(value) {
  return Number.isInteger(value) && Number(value) > 0 ? Number(value) : null;
}

/** @param {unknown} value @returns {number | null} */
export function canonicalNonNegativeNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && round4(value) === value
    ? value : null;
}

/** @param {unknown} value @returns {number | null} */
export function canonicalPositiveNumber(value) {
  const number = canonicalNonNegativeNumber(value);
  return number != null && number > 0 ? number : null;
}

/** @param {unknown} value @returns {number | null} */
export function canonicalBoundedNumber(value) {
  const number = canonicalNonNegativeNumber(value);
  return number != null && number <= 1 ? number : null;
}

/** @param {unknown} value @returns {string[] | null} */
export function strictSortedPair(value) {
  if (!Array.isArray(value) || value.length !== 2) return null;
  const pair = value.map(strictText);
  return pair.every(Boolean) && pair[0] < pair[1] ? pair : null;
}

/** @param {string[]} values */
export function isSortedUnique(values) {
  return values.every((value, index) => index === 0 || values[index - 1] < value);
}

/** @param {Record<string, unknown>} row @param {string[]} expected */
export function hasExactKeys(row, expected) {
  const actual = Object.keys(row).sort();
  const wanted = [...expected].sort();
  return actual.length === wanted.length && actual.every((key, index) => key === wanted[index]);
}

/** @param {string} s @returns {number} */
export function rankState(s) { return s === 'defaulted' ? 2 : s === 'strained' ? 1 : 0; }

/** Compliance rank for the fraying-seam pick (defaulted worst). @param {string} s @returns {number} */
export function complianceRank(s) { return s === 'defaulted' ? 2 : s === 'strained' ? 1 : 0; }

/** @param {TreatyLedger} ledger @returns {TreatyLedger} */
export function sortedLedger(ledger) {
  /** @type {TreatyLedger} */
  const out = {};
  for (const k of Object.keys(ledger).sort()) out[k] = ledger[k];
  return out;
}

/** The directed treaty key: the victor's treaty OVER the loser. `${victor}>${loser}`.
 *  @param {unknown} victorId @param {unknown} loserId @returns {string} */
export function treatyPairKey(victorId, loserId) {
  return reasonPairKey(victorId, loserId);
}
