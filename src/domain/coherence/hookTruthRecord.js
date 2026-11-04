/**
 * domain/coherence/hookTruthRecord.js — the hook-truth check over the hooks the RECORD
 * stores, moved verbatim out of hookTruthFindings.js (which re-exports it beside the page
 * check) so a reader that needs only the record's answer — the generation receipt's
 * coherence battery — does not import the page's hook collector (lane SELF-VOUCH,
 * 2026-11-04).
 *
 * PURE: no rng, no clock, no store, no React.
 */

import { crisisHooksOf } from '../crisis/crisisHooks.js';

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
  // The hooks each active crisis's stored CAST derives (src/domain/crisis/crisisHooks.js): they
  // are a function of the record, never a stored copy, so the record's own answer is to derive
  // them from the engine's cast (the DM's edit is the page's business, read there).
  /** @type {unknown[]} */
  const crises = Array.isArray(record.stress) ? record.stress : record.stress && typeof record.stress === 'object' ? [record.stress] : [];
  crises.forEach((entry) => takeAll(crisisHooksOf(settlement, /** @type {Parameters<typeof crisisHooksOf>[1]} */ (entry))));
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
