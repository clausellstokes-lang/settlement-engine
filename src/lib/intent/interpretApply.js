/**
 * lib/intent/interpretApply.js — the ACCEPT→MINT executor (Surveyor S3→S4 seam).
 *
 * The store-importing HALF of the accept→mint slice. The PURE half (dispatchAcceptedOps +
 * interpretApplyLogRecord, src/domain/intent/applyDispatch.js) maps the review's accepted
 * ops to typed ApplyIntent[]; THIS runs them through the EXISTING store verbs — the same
 * recordPartyImpact / applyEvent the manual UI drives — and returns the §3 apply-side
 * aiOperationLog record for the caller to ride onto the session/outbox surfaces.
 *
 * DI by design (mirrors the edge functions' handler seam): the store verbs are INJECTED, so
 * the executor is pinned without a live store and a panel wires the real actions. Orchestration
 * glue belongs in src/lib (never src/domain — the engine spine stays headless,
 * tests/architecture/layerBoundaries.test.js). Reached only from the lazy interpret panel ⇒
 * zero eager bytes.
 *
 * NEVER-BYPASS (the constitution, §3): every landed op flows through a registered store verb
 * (applyEvent / recordPartyImpact) — the AI writes NO state directly. An op that fails its
 * verb is recorded in `failed` (honest), never silently swallowed; the whole run is
 * per-item, so one failure never blocks the rest.
 */

import { dispatchAcceptedOps, interpretApplyLogRecord } from '../../domain/intent/applyDispatch.js';

/**
 * Apply the review's accepted ops through the injected store verbs, per item, and return the
 * apply-side aiOperationLog record.
 *
 * @param {{
 *   accepted: Array<{ op?: any }|any>,
 *   campaignId?: string|null,
 *   saveId?: string|null,
 *   seed?: string|number|null,
 *   interpretRef?: string|null,
 *   corrections?: Array<{ class?: string }>,
 *   blocked?: Array<unknown>,
 *   now?: string,
 *   actions: {
 *     applyEvent?: (event: any) => unknown,
 *     recordPartyImpact?: (campaignId: string, action: any) => (Promise<unknown>|unknown),
 *   },
 * }} io
 * @returns {Promise<{
 *   applied: Array<{ opType: string, family: string }>,
 *   failed: Array<{ opType: string, family: string, reason: string }>,
 *   unroutable: Array<{ opType: string }>,
 *   log: ReturnType<typeof interpretApplyLogRecord>,
 * }>}
 */
export async function runInterpretApply(io) {
  const { accepted = [], campaignId = null, saveId = null, seed = null, interpretRef = null,
    corrections = [], blocked = [], now, actions = {} } = io || {};
  const { intents, unroutable } = dispatchAcceptedOps(accepted, { campaignId, saveId });

  /** @type {Array<{ opType: string, family: string }>} */
  const applied = [];
  /** @type {Array<{ opType: string, family: string, reason: string }>} */
  const failed = [];

  for (const intent of intents) {
    try {
      if (intent.target === 'recordPartyImpact') {
        if (typeof actions.recordPartyImpact !== 'function') { failed.push({ opType: intent.opType, family: intent.family, reason: 'no_verb' }); continue; }
        if (!intent.campaignId) { failed.push({ opType: intent.opType, family: intent.family, reason: 'no_campaign' }); continue; }
        const res = /** @type {{ ok?: boolean, reason?: string }|null} */ (await actions.recordPartyImpact(intent.campaignId, intent.action));
        if (res && typeof res === 'object' && res.ok === false) { failed.push({ opType: intent.opType, family: intent.family, reason: String(res.reason || 'refused') }); continue; }
        applied.push({ opType: intent.opType, family: intent.family });
      } else if (intent.target === 'applyEvent') {
        if (typeof actions.applyEvent !== 'function') { failed.push({ opType: intent.opType, family: intent.family, reason: 'no_verb' }); continue; }
        await actions.applyEvent(intent.event);
        applied.push({ opType: intent.opType, family: intent.family });
      } else {
        failed.push({ opType: intent.opType, family: intent.family, reason: 'no_target' });
      }
    } catch (e) {
      failed.push({ opType: intent.opType, family: intent.family, reason: e instanceof Error ? e.message : 'threw' });
    }
  }

  // The §3 apply-side record covers what LANDED (the reproducibility receipt).
  const appliedIntents = intents.filter((it) => applied.some((a) => a.opType === it.opType && a.family === it.family));
  const log = interpretApplyLogRecord({ intents: appliedIntents, corrections, blocked, interpretRef, seed, now });

  return { applied, failed, unroutable, log };
}
