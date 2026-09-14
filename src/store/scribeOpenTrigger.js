/**
 * store/scribeOpenTrigger.js — THE OPEN IS THE TRIGGER.
 *
 * THE OWNER, 2026-09-14 ~06:3x, verbatim: "but generation happens only once a settlement's dossier
 * is opened and frozen until next advance time."
 *
 * Read as four conditions, all of which must hold before one render is enqueued, and each of which
 * is here because leaving it out spends money or breaks a promise:
 *
 *   1. THE DOSSIER IS ON SCREEN. Not a save, not an advance, not a tick. A realm of thirty towns
 *      advanced a year renders the ones the game master actually looks at and no others.
 *   2. IT HAS A DURABLE HOME (`saveId`). The chair's addition, vetoable: no credit is ever spent on
 *      a settlement that cannot keep what it paid for. `requestNarrative` applies the same rule.
 *   3. THE ARTEFACT IS STALE OR ABSENT — `prose.current.advanceSeq !== advanceSeq`, a different
 *      seed, a superseded engine, or nothing rendered yet. A current artefact is FROZEN: opening
 *      the same dossier ten times in one epoch renders once and bills once.
 *   4. THE FLAG IS LIT and a transport is registered. Both are checked by the caller's own gate and
 *      again here, because a trigger that fires with no renderer would burn its one-per-epoch slot
 *      on nothing.
 *
 * ⛔ THE SESSION LEDGER IS WHY THIS IS A MODULE AND NOT AN EFFECT. React effects re-run on every
 * dependency change, a dossier remounts on every tab group change, and two panes can hold the same
 * town. `ATTEMPTED` keys on `saveId::advanceSeq::renderedFor`, so the second and every later ask
 * for the same epoch of the same town is refused with a reason rather than sent. The ledger is
 * SESSION state deliberately: it must not survive a reload, because a render that failed and left
 * no artefact has to be retryable by reopening the dossier, which is the only retry affordance the
 * design gives the reader.
 *
 * This module is reached by DYNAMIC import only (`settlementSlice.js` is size-baselined at
 * tolerance 0 and the first-paint closure is an exact byte budget), and it imports no transport:
 * the renderer arrives through the `lib/scribeRenderer.js` registry.
 */

import { GENERATOR_VERSION, SIMULATION_VERSION } from '../domain/settlement.schema.js';
import { isStale, proseOf, surveyStateOf } from '../lib/scribeArtefact.js';
import { getScribeRenderer } from '../lib/scribeRenderer.js';
import { advanceSeqOf } from './scribeEpochLane.js';

/**
 * The engine fingerprint an artefact must match to be drawn. Spelled from the SAME two schema
 * constants `domain/prose/townCard.js` spells `CARD_ENGINE_VERSION` from, and pinned equal to it
 * in the test, so the trigger and the card can never disagree about what generation a render
 * belongs to. It is re-spelled rather than imported because importing the town card here would
 * drag the six generated prose leaves into the trigger's chunk.
 */
export const SCRIBE_ENGINE_VERSION = `gen-${GENERATOR_VERSION}/sim-${SIMULATION_VERSION}`;

/** The seed a render is keyed to, spelled exactly as the tabs spell it. */
export const scribeSeedOf = (settlement) => String(settlement?._seed ?? settlement?.id ?? '');

/**
 * ⭐ ONE ASK PER (town, epoch) PER SESSION. Keys carry the seed as well as the save id because a
 * regenerate replaces the town under a stable save id, and that new town has never been rendered.
 * @type {Set<string>}
 */
const ATTEMPTED = new Set();

/** The ledger key. Exported so the test can assert the shape rather than infer it. */
export const attemptKeyOf = (saveId, advanceSeq, renderedFor) =>
  `${String(saveId)}::${Number(advanceSeq) || 0}::${String(renderedFor)}`;

/** Forget every attempt. Session-scoped teardown (sign-out, and every test). */
export function resetScribeAttempts() {
  ATTEMPTED.clear();
}

/**
 * ⭐ THE DECISION, PURE. Returns why, always, so the caller can log a refusal and a test can
 * assert on the reason rather than on a bare false.
 *
 * @param {{settlement?: object|null, activeSaveId?: string|null, campaignId?: string|null,
 *   advanceSeqByCampaign?: Record<string, number>}} state
 * @param {{saveId?: string|null, campaignId?: string|null, flagOn?: boolean,
 *   hasRenderer?: boolean}} [ctx]
 * @returns {{render: boolean, reason: string, saveId: string, advanceSeq: number,
 *   renderedFor: string, engineVersion: string, survey: 'none'|'prior'|'current'}}
 */
export function scribeOpenDecision(state, ctx = {}) {
  const settlement = state?.settlement || null;
  const saveId = String(ctx.saveId ?? state?.activeSaveId ?? '');
  const renderedFor = scribeSeedOf(settlement);
  const advanceSeq = advanceSeqOf(state, ctx.campaignId ?? state?.campaignId ?? '');
  const prose = proseOf(settlement);
  const survey = surveyStateOf(prose, {
    advanceSeq, renderedFor, engineVersion: SCRIBE_ENGINE_VERSION,
  });
  const base = {
    render: false, reason: '', saveId, advanceSeq, renderedFor,
    engineVersion: SCRIBE_ENGINE_VERSION, survey,
  };

  if (ctx.flagOn === false) return { ...base, reason: 'flag-off' };
  if (!settlement) return { ...base, reason: 'no-settlement' };
  // Rule 14's durable-home condition. A freshly generated, unsaved town shows the corpus until it
  // is saved with its dossier open, which is the same moment; a discarded generation costs nothing.
  if (!saveId) return { ...base, reason: 'no-durable-home' };
  if (!renderedFor) return { ...base, reason: 'no-seed' };
  if (ctx.hasRenderer === false) return { ...base, reason: 'no-transport' };
  if (!isStale(prose, { advanceSeq, renderedFor, engineVersion: SCRIBE_ENGINE_VERSION })) {
    return { ...base, reason: 'frozen' };
  }
  if (ATTEMPTED.has(attemptKeyOf(saveId, advanceSeq, renderedFor))) {
    return { ...base, reason: 'already-asked' };
  }
  return { ...base, render: true, reason: prose ? 'stale' : 'absent' };
}

/**
 * ⭐ THE TRIGGER. Decides, records the attempt, and hands the request to whatever transport is
 * registered. Returns the decision either way, with `sent` saying whether the transport was
 * actually reached, so a caller never has to guess whether money moved.
 *
 * The attempt is recorded BEFORE the await, not after: two effects firing in the same tick must
 * not both pass the ledger check and send two renders for one epoch. On a transport failure the
 * key is released, because a render that left no artefact has to be retryable by reopening.
 *
 * @param {{state: object, saveId?: string|null, campaignId?: string|null, flagOn?: boolean,
 *   guidance?: string}} args
 * @returns {Promise<{render: boolean, reason: string, sent: boolean, result?: object}>}
 */
export async function runScribeOpenTrigger(args) {
  const renderer = getScribeRenderer();
  const decision = scribeOpenDecision(args?.state, {
    saveId: args?.saveId,
    campaignId: args?.campaignId,
    flagOn: args?.flagOn,
    hasRenderer: renderer !== null,
  });
  if (!decision.render || !renderer) return { ...decision, sent: false };

  const key = attemptKeyOf(decision.saveId, decision.advanceSeq, decision.renderedFor);
  ATTEMPTED.add(key);
  try {
    const result = await renderer({
      saveId: decision.saveId,
      advanceSeq: decision.advanceSeq,
      renderedFor: decision.renderedFor,
      engineVersion: decision.engineVersion,
      settlement: args?.state?.settlement || null,
      guidance: typeof args?.guidance === 'string' ? args.guidance : '',
    });
    if (!result || result.ok !== true) ATTEMPTED.delete(key);
    return { ...decision, sent: true, result: result || { ok: false, reason: 'no-result' } };
  } catch (error) {
    // A render is a convenience over a FLOOR that always exists (the hand corpus), so a transport
    // failure never surfaces as an error on the dossier and never blocks the page. It releases
    // the slot and says so.
    ATTEMPTED.delete(key);
    return { ...decision, sent: true, result: { ok: false, reason: String(error?.message || error) } };
  }
}
