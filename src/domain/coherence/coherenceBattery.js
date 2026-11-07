/**
 * domain/coherence/coherenceBattery.js — THE UNSTORED CHECK SET: the seven coherence
 * instruments behind one call (lane SOAK-1000, 2026-11-03).
 *
 * The soak (scripts/audit/soak-review.mjs) and a certification cohort read a settlement and
 * the text the app renders for it, surface by surface (a tab, the Tonight sheet, the PDF's
 * text, the Foundry journal), and ask every instrument the same question: does a sentence
 * here say something the record contradicts? The answers come back in ONE shape,
 * `{ check, surface, quote, detail }`, so a corpus can count them by check and by surface.
 *
 *   defense-words      defenseWordsFindings      per surface
 *   faith-denial       faithDenialFindings       per surface
 *   food-words         foodWordsFindings         per surface
 *   magic-words        magicWordsFindings        per surface
 *   tier-noun          tierNounFindings          per surface
 *   hook-truth-record  hookTruthFindings         once, surface 'record' (what the writers store)
 *   hook-truth-page    renderedHookTruthFindings once, surface 'page' (what the page reads)
 *   seat-holder        seatHolderFindings        once, surface 'record'
 *   grade-vs-food            gradeVsFoodFindings          once, surface 'defense' (Overview × Defense)
 *   magic-absent-prose       magicAbsentProseFindings     once, surface 'magic'
 *   crime-denied-and-listed  crimeDeniedAndListedFindings once, surface 'defense' (Defense × Economics)
 *
 * The last three (lane RUNG1B-F9, readerContradictionFindings.js) read two rendered tabs side by
 * side, so like `hook-truth-page` they are the page battery's alone: the record battery the
 * generation receipt runs never sees them, and no receipt moves.
 *
 * UNSTORED: nothing is written into the record and nothing is read from a clock or a seed,
 * so no golden moves and the same inputs give the same findings. An instrument that throws
 * is reported as a finding of its own check with the error as its detail, never swallowed.
 *
 * Pure.
 */

import { renderedHookTruthFindings } from './hookTruthFindings.js';
import { collect, recordBattery, str } from './recordBattery.js';
import {
  crimeDeniedAndListedFindings, gradeVsFoodFindings, magicAbsentProseFindings,
} from './readerContradictionFindings.js';

/**
 * @typedef {object} BatteryFinding
 * @property {string} check one of BATTERY_CHECKS
 * @property {string} surface the surface the text came from, or 'record' / 'page'
 * @property {string} quote the sentence or phrase the instrument flagged
 * @property {string} detail what the record says instead (or the instrument's code)
 */

/** The checks, in report order. */
export const BATTERY_CHECKS = Object.freeze([
  'defense-words', 'faith-denial', 'food-words', 'hook-truth-record', 'hook-truth-page',
  'magic-words', 'seat-holder', 'tier-noun',
  'grade-vs-food', 'magic-absent-prose', 'crime-denied-and-listed',
]);

/** The page checks that read two rendered tabs together: check → [surface, instrument]. */
const READER_CHECKS = Object.freeze(/** @type {const} */ ([
  ['grade-vs-food', 'defense', gradeVsFoodFindings],
  ['magic-absent-prose', 'magic', magicAbsentProseFindings],
  ['crime-denied-and-listed', 'defense', crimeDeniedAndListedFindings],
]));
const PAGE_ONLY = new Set(['hook-truth-page', ...READER_CHECKS.map(([check]) => check)]);

/**
 * Every coherence finding for one settlement and its rendered surfaces: recordBattery.js's
 * checks plus `hook-truth-page`, placed after `hook-truth-record` as it always was.
 * @param {unknown} settlement the generated record
 * @param {Readonly<Record<string, string>>} surfaces surface id → the text a reader sees there
 * @param {{ only?: ReadonlyArray<string> }} [options] `only`: run just these checks
 * @returns {BatteryFinding[]}
 */
export function coherenceBattery(settlement, surfaces, options = {}) {
  if (settlement == null || typeof settlement !== 'object') return [];
  const wanted = Array.isArray(options?.only) ? options.only : null;
  const out = recordBattery(settlement, surfaces, {
    only: (wanted ?? BATTERY_CHECKS).filter((check) => !PAGE_ONLY.has(check)),
  });
  /** @param {string} check */
  const runs = (check) => wanted == null || wanted.includes(check);
  /** @type {BatteryFinding[]} */
  const page = [];
  if (runs('hook-truth-page')) {
    const hookRecord = /** @type {Parameters<typeof renderedHookTruthFindings>[0]} */ (settlement);
    collect('hook-truth-page', 'page', () => renderedHookTruthFindings(hookRecord),
      (f) => ({ quote: str(f.text), detail: `${str(f.code)}: ${str(f.detail)}` }), page);
  }
  /** @type {BatteryFinding[]} */
  const reader = [];
  for (const [check, surface, instrument] of READER_CHECKS) {
    if (runs(check)) collect(check, surface, () => instrument(surfaces ?? {}), (f) => ({ quote: str(f.quote), detail: str(f.detail) }), reader);
  }
  const at = out.filter((f) => f.check === 'hook-truth-record').length;
  return [...out.slice(0, at), ...page, ...out.slice(at), ...reader];
}

export default coherenceBattery;
