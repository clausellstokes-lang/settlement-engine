/**
 * domain/coherence/hookTruthFindings.js — THE STANDALONE CHECK: which stored plot hooks say
 * something this place contradicts?
 *
 * The reader and the classifier are the leaf beside this file
 * (`src/domain/coherence/hookTruth.js`); this module is the two POPULATIONS they are asked
 * about, and the distinction between them is the lane's whole finding:
 *
 *   `hookTruthFindings(settlement)`          — every hook the RECORD stores, whoever wrote it.
 *   `renderedHookTruthFindings(settlement)`  — the hooks the DM actually reads, after the
 *                                              collector's truth gate has refused or
 *                                              reworded what the record got wrong.
 *
 * The difference between the two answers is exactly what the display layer is covering for,
 * so a chair comparing them reads off which WRITERS still owe a cure at the record. Measured
 * on this lane's 120-settlement corpus at the lane's own tip, that difference is the food
 * writer: `src/generators/economy/foodBalance.js :: deriveSupplyRiskAnalysis` still stores
 * "The settlement is starving…" on 36 fed places (the FOOD lane's bill, reported in this
 * lane's REQUESTS), while the page reads none of them.
 *
 * ⛔ NOT WIRED INTO THE RECEIPT HERE. `src/domain/certification/generationReceiptJudgments.js`
 * is the chair's and this lane does not touch it.
 *
 * PURE: no rng, no clock, no store, no React.
 */

import { collectPlotHooks } from '../dossier/plotHooks.js';

import { hookTruthViolations, settlementHookFacts } from './hookTruth.js';

/** @typedef {import('./hookTruth.js').HookTruthRecord} HookTruthRecord */

/** @typedef {import('./hookTruth.js').HookTruthFinding} HookTruthFinding */

// The record check (`hookTruthFindings`, over the hooks the record STORES) lives in
// ./hookTruthRecord.js, which does not import the page's collector, so the generation
// receipt can read it without loading `collectPlotHooks` (lane SELF-VOUCH, 2026-11-04).
export { hookTruthFindings } from './hookTruthRecord.js';

/**
 * THE SAME CHECK, ON THE PAGE THE DM READS — the hooks `collectPlotHooks` projects, after
 * the collector's own truth gate has refused or reworded what the record got wrong.
 *
 * The two answers differ exactly by what the display layer is covering for, so a chair
 * comparing them can read off which writers still owe a cure at the record.
 * @param {unknown} settlement
 * @returns {HookTruthFinding[]}
 */
export function renderedHookTruthFindings(settlement) {
  const facts = settlementHookFacts(settlement);
  const hooks = collectPlotHooks(/** @type {Parameters<typeof collectPlotHooks>[0]} */ (settlement));
  return hooks.flatMap((hook) => hookTruthViolations(hook.text, facts));
}
