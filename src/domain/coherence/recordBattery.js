/**
 * domain/coherence/recordBattery.js — THE BATTERY'S NARROW ENTRY: every check of
 * coherenceBattery.js but `hook-truth-page` (lane SELF-VOUCH, 2026-11-04).
 *
 * The generation receipt runs the battery over the record at generation time, inside the
 * generation worker. `hook-truth-page` reads the hooks the way the page's collector projects
 * them, and the collector is a large graph the worker otherwise never loads, so it is the one
 * check this entry leaves out. coherenceBattery.js composes this entry and adds it back, so
 * the labels, the finding shape and the order are one implementation, not two.
 *
 * Pure.
 */

import { defenseWordsFindings } from './defenseWordsFindings.js';
import { faithDenialFindings } from './faithDenialFindings.js';
import { foodWordsFindings } from './foodWordsFindings.js';
import { hookTruthFindings } from './hookTruthRecord.js';
import { magicWordsFindings } from './magicWordsFindings.js';
import { seatHolderFindings } from './seatHolderFindings.js';
import { tierNounFindings } from './tierNounFindings.js';

/** @typedef {import('./coherenceBattery.js').BatteryFinding} BatteryFinding */

/** The checks this entry runs, in the full battery's report order. */
export const RECORD_BATTERY_CHECKS = Object.freeze([
  'defense-words', 'faith-denial', 'food-words', 'hook-truth-record',
  'magic-words', 'seat-holder', 'tier-noun',
]);

/** @param {unknown} v @returns {string} */
export const str = (v) => (typeof v === 'string' ? v : v == null ? '' : String(v));

/**
 * Run one instrument, mapping its findings into the battery's shape.
 * @param {string} check
 * @param {string} surface
 * @param {() => ReadonlyArray<unknown>} run
 * @param {(f: Record<string, unknown>) => { quote: string, detail: string }} map
 * @param {BatteryFinding[]} out
 */
export function collect(check, surface, run, map, out) {
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
 * Every finding of the battery's record checks (all but `hook-truth-page`) for one
 * settlement and the surfaces handed in, in the full battery's order.
 * @param {unknown} settlement the generated record
 * @param {Readonly<Record<string, string>>} surfaces surface id → text
 * @param {{ only?: ReadonlyArray<string> }} [options] `only`: run just these checks
 * @returns {BatteryFinding[]}
 */
export function recordBattery(settlement, surfaces, options = {}) {
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
