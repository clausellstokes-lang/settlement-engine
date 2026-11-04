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

import { defenseWordsFindings } from './defenseWordsFindings.js';
import { faithDenialFindings } from './faithDenialFindings.js';
import { foodWordsFindings } from './foodWordsFindings.js';
import { hookTruthFindings, renderedHookTruthFindings } from './hookTruthFindings.js';
import { magicWordsFindings } from './magicWordsFindings.js';
import { seatHolderFindings } from './seatHolderFindings.js';
import { tierNounFindings } from './tierNounFindings.js';

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

/** @param {unknown} v @returns {string} */
const str = (v) => (typeof v === 'string' ? v : v == null ? '' : String(v));

/**
 * Run one instrument, mapping its findings into the battery's shape.
 * @param {string} check
 * @param {string} surface
 * @param {() => ReadonlyArray<unknown>} run
 * @param {(f: Record<string, unknown>) => { quote: string, detail: string }} map
 * @param {BatteryFinding[]} out
 */
function collect(check, surface, run, map, out) {
  /** @type {ReadonlyArray<unknown>} */
  let found;
  try {
    found = run();
  } catch (error) {
    out.push({ check, surface, quote: '', detail: `instrument threw: ${str(error instanceof Error ? error.message : error)}` });
    return;
  }
  for (const f of found) {
    const { quote, detail } = map(/** @type {Record<string, unknown>} */ (f ?? {}));
    out.push({ check, surface, quote: quote.trim(), detail });
  }
}

/**
 * Every coherence finding for one settlement and its rendered surfaces.
 * @param {unknown} settlement the generated record
 * @param {Readonly<Record<string, string>>} surfaces surface id → the text a reader sees there
 * @param {{ only?: ReadonlyArray<string> }} [options] `only`: run just these checks (the
 *   generation receipt leaves out `hook-truth-page`, which reads the page, not the record)
 * @returns {BatteryFinding[]}
 */
export function coherenceBattery(settlement, surfaces, options = {}) {
  if (settlement == null || typeof settlement !== 'object') return [];
  const wanted = Array.isArray(options?.only) ? new Set(options.only) : null;
  /** @param {string} check */
  const runs = (check) => wanted == null || wanted.has(check);
  // Each instrument types its own narrow read of the record; the battery hands each the
  // record under that instrument's parameter type and reads nothing of it itself.
  const hookRecord = /** @type {Parameters<typeof hookTruthFindings>[0]} */ (settlement);
  const seatRecord = /** @type {Parameters<typeof seatHolderFindings>[0]} */ (settlement);
  const faithRecord = /** @type {Parameters<typeof faithDenialFindings>[0]} */ (settlement);
  const defenseRecord = /** @type {Parameters<typeof defenseWordsFindings>[0]} */ (settlement);
  const tierRecord = /** @type {Parameters<typeof tierNounFindings>[0]} */ (settlement);
  const tier = str(/** @type {{ tier?: unknown }} */ (settlement).tier);
  /** @type {BatteryFinding[]} */
  const out = [];
  if (runs('hook-truth-record')) collect('hook-truth-record', 'record', () => hookTruthFindings(hookRecord),
    (f) => ({ quote: str(f.text), detail: `${str(f.code)}: ${str(f.detail)}` }), out);
  if (runs('hook-truth-page')) collect('hook-truth-page', 'page', () => renderedHookTruthFindings(hookRecord),
    (f) => ({ quote: str(f.text), detail: `${str(f.code)}: ${str(f.detail)}` }), out);
  if (runs('seat-holder')) collect('seat-holder', 'record', () => seatHolderFindings(seatRecord),
    (f) => ({ quote: '', detail: `${str(f.code)}: ${str(f.detail)}` }), out);
  for (const [surface, raw] of Object.entries(surfaces ?? {})) {
    const text = str(raw);
    if (text === '') continue;
    if (runs('defense-words')) collect('defense-words', surface, () => defenseWordsFindings(defenseRecord, text),
      (f) => ({ quote: str(f.sentence), detail: `${str(f.term)} without ${str(f.needs)}` }), out);
    if (runs('faith-denial')) collect('faith-denial', surface, () => faithDenialFindings(faithRecord, text),
      (f) => ({ quote: str(f.denial), detail: `church evidence: ${Array.isArray(f.evidence) ? f.evidence.join(', ') : ''}` }), out);
    if (runs('food-words')) collect('food-words', surface, () => foodWordsFindings(settlement, text),
      (f) => ({ quote: str(f.sentence), detail: `${str(f.code)}: ${str(f.detail)}` }), out);
    if (runs('magic-words')) collect('magic-words', surface, () => magicWordsFindings(settlement, text),
      (f) => ({ quote: str(f.excerpt), detail: `${str(f.code)}: ${str(f.message)}` }), out);
    // tierNounFindings matches only a singular [Tt]own, so a text without "town" has no finding
    // to give; skipping it there is findings-identical and spares the kept-span pass, which
    // costs ~91% of a generation over a record's 48 KB of text (lane SELF-VOUCH, 2026-11-04).
    if (runs('tier-noun') && /town/i.test(text)) {
      collect('tier-noun', surface, () => tierNounFindings(tierRecord, text),
        (f) => ({ quote: str(f.context), detail: `"${str(f.phrase)}" for a ${tier}` }), out);
    }
  }
  return out;
}

export default coherenceBattery;
