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
 *
 * UNSTORED: nothing is written into the record and nothing is read from a clock or a seed,
 * so no golden moves and the same inputs give the same findings. An instrument that throws
 * is reported as a finding of its own check with the error as its detail, never swallowed.
 *
 * Pure.
 */

import { renderedHookTruthFindings } from './hookTruthFindings.js';
import { collect, recordBattery, str } from './recordBattery.js';

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
]);

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
    only: (wanted ?? BATTERY_CHECKS).filter((check) => check !== 'hook-truth-page'),
  });
  if (wanted != null && !wanted.includes('hook-truth-page')) return out;
  /** @type {BatteryFinding[]} */
  const page = [];
  const hookRecord = /** @type {Parameters<typeof renderedHookTruthFindings>[0]} */ (settlement);
  collect('hook-truth-page', 'page', () => renderedHookTruthFindings(hookRecord),
    (f) => ({ quote: str(f.text), detail: `${str(f.code)}: ${str(f.detail)}` }), page);
  const at = out.filter((f) => f.check === 'hook-truth-record').length;
  return [...out.slice(0, at), ...page, ...out.slice(at)];
}

export default coherenceBattery;
