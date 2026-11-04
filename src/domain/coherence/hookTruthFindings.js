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

/**
 * EVERY HOOK THE RECORD STORES, whoever wrote it, in a stable order.
 *
 * This is the ENGINE's text rather than the DM's page, and that is the point: a writer
 * that stores a false sentence owes a cure even where the display layer has learned to
 * refuse it. Read `renderedHookTruthFindings` for the page.
 * @param {unknown} settlement
 * @returns {string[]}
 */
function storedHookTexts(settlement) {
  const record = /** @type {HookTruthRecord} */ (
    settlement && typeof settlement === 'object' ? settlement : {}
  );
  /** @type {string[]} */
  const out = [];
  const take = (/** @type {unknown} */ hook) => {
    if (typeof hook === 'string') { if (hook.trim() !== '') out.push(hook); return; }
    const entry = /** @type {{ hook?: unknown, text?: unknown }} */ (hook);
    const text = typeof entry?.hook === 'string' ? entry.hook
      : typeof entry?.text === 'string' ? entry.text : '';
    if (text.trim() !== '') out.push(text);
  };
  const takeAll = (/** @type {unknown} */ list) => {
    if (Array.isArray(list)) list.forEach(take);
  };
  /** @type {unknown[]} */
  const npcs = Array.isArray(record.npcs) ? record.npcs : [];
  npcs.forEach((npc) => takeAll(/** @type {{ plotHooks?: unknown }} */ (npc)?.plotHooks));
  /** @type {unknown[]} */
  const conflicts = Array.isArray(record.conflicts) ? record.conflicts : [];
  conflicts.forEach((conflict) => takeAll(/** @type {{ plotHooks?: unknown }} */ (conflict)?.plotHooks));
  /** @type {unknown[]} */
  const tensions = Array.isArray(record.history?.currentTensions) ? record.history.currentTensions : [];
  tensions.forEach((tension) => takeAll(/** @type {{ plotHooks?: unknown }} */ (tension)?.plotHooks));
  /** @type {unknown[]} */
  const events = Array.isArray(record.history?.historicalEvents) ? record.history.historicalEvents : [];
  events.forEach((event) => takeAll(/** @type {{ plotHooks?: unknown }} */ (event)?.plotHooks));
  takeAll(record.economicViability?.plotHooks);
  takeAll(record.economicState?.safetyProfile?.plotHooks);
  // The hooks each active crisis stores (src/domain/crisis/crisisHooks.js, written by the cast
  // step): one entry or a list.
  /** @type {unknown[]} */
  const crises = Array.isArray(record.stress) ? record.stress : record.stress && typeof record.stress === 'object' ? [record.stress] : [];
  crises.forEach((entry) => takeAll(/** @type {{ plotHooks?: unknown }} */ (entry)?.plotHooks));
  return out;
}

/**
 * THE STANDALONE CHECK (the chair's acceptance 5). Every hook the RECORD stores, read
 * against the facts of the place that stores it.
 *
 * Returns [] for a record whose hooks all say something true of it, and one finding per
 * (hook, violated fact) otherwise. The chair wires this into the certification receipt;
 * it is deliberately NOT wired here, and `src/domain/certification/generationReceiptJudgments.js`
 * is untouched by this lane.
 * @param {unknown} settlement
 * @returns {HookTruthFinding[]}
 */
export function hookTruthFindings(settlement) {
  const facts = settlementHookFacts(settlement);
  return storedHookTexts(settlement).flatMap((text) => hookTruthViolations(text, facts));
}

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
