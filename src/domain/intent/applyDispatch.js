/**
 * domain/intent/applyDispatch.js — the ACCEPT→MINT DISPATCHER
 * (Surveyor S3→S4 seam).
 *
 * S3 built both ends of the interpret write-path — the edge COMPILER (interpret-session:
 * session text → validated Interpretation) and the REVIEW side (interpretReview.js:
 * reviewInterpretation → `accepted` ops after per-item approve/edit). This module is the
 * SLICE BETWEEN THEM the S3 fold recorded as "the designed next slice (both ends exist)":
 * it maps each ACCEPTED op onto the EXISTING application capability that lands
 * it — never a new mutation primitive or a bypass of proposal/approval:
 *
 *   • family 'party_impact' → recordPartyImpact(campaignId, action)   — the campaign
 *     world-pulse party-input lane (worldState-scoped; action.kind ∈ PARTY_IMPACT_KINDS).
 *   • family 'canon_event'  → applyEvent(event)                        — the settlement
 *     canon-event lane (save-scoped; event.type ∈ EVENT_TYPES, preview≡apply).
 *
 * The DISPATCH is PURE DATA (no store, no side effects): it produces typed
 * ApplyIntent[] that src/lib/intent/interpretApply.js converts to serializable
 * commands. Keeping it here (headless, no store import, no `any`) lets the
 * mapping be pinned without a store and keeps the engine spine clean
 * (tests/architecture/layerBoundaries.test.js).
 *
 * THE APPLY-SIDE SESSION SUMMARY (§3 determinism): every run carries ENGINE VERSION + SEED
 * + a reference to the compile that proposed it + the op counts
 * (approved/edited/rejected/blocked). Built here as pure DATA
 * (interpretApplyLogRecord) — hashes/counts/ids only, NEVER params, prose, or PII. It is
 * intentionally distinct from the edge-written `ai_operation_log`: application-command
 * receipts own per-proposal apply correlation. A migrated adapter may also retain a durable
 * server receipt (the CUT_TRADE_ROUTE vertical does); this aggregate never pretends every
 * legacy proposal has that stronger audit.
 *
 * PURE, lazy-only (rides the interpret panel chunk), emits only enum strings + counts —
 * zero eager bytes.
 */

import { GENERATOR_VERSION, SIMULATION_VERSION } from '../settlement.schema.js';

/** The op families the S3 compiler emits (mirrors interpretCore INTERPRET_FAMILIES). */
export const APPLY_FAMILIES = Object.freeze(['canon_event', 'party_impact']);

/** Engine-version fingerprint carried by the apply-side reproducibility summary.
 * A stable string, not a live clock. */
export const ENGINE_VERSION = `gen-${GENERATOR_VERSION}/sim-${SIMULATION_VERSION}`;

/**
 * One accepted op as the review hands it over (the reviewInterpretation `accepted[].op`
 * shape, structurally — see interpretReview.js / interpretCore.ProposedOp).
 * @typedef {{ family?: string, opType: string, params?: Record<string, unknown>,
 *            label?: string, edited?: boolean }} AcceptedOp
 */

/**
 * A typed, store-agnostic routing intent. The application layer reads `target`
 * to choose a command adapter and passes `action` (party) or `event` (canon)
 * through that adapter. `saveId` addresses a canon event; `campaignId`
 * addresses a party impact.
 * @typedef {{
 *   family: 'canon_event'|'party_impact',
 *   target: 'applyEvent'|'recordPartyImpact',
 *   opType: string,
 *   label: string,
 *   proposalIndex: number,
 *   campaignId: string|null,
 *   saveId: string|null,
 *   event?: { type: string, [k: string]: unknown },
 *   action?: { kind: string, [k: string]: unknown },
 * }} ApplyIntent
 */

/** True iff `op` names a family this dispatcher can land.
 *  @param {{ opType?: unknown, family?: unknown }|null|undefined} op */
function isDispatchable(op) {
  return !!op && typeof op === 'object' && typeof op.opType === 'string' && !!op.opType
    && (op.family === 'canon_event' || op.family === 'party_impact');
}

/**
 * Build the store-agnostic ApplyIntent for one accepted op. Pure. A canon_event becomes an
 * `event` ({ type, ...params }) for settlementSlice.applyEvent; a party_impact becomes an
 * `action` ({ kind, ...params }) for campaignWorldPulseSlice.recordPartyImpact — the SAME
 * shapes the manual UI already feeds those verbs (the op registry is one vocabulary for
 * manual + AI, DESIGN_TRACK_K_COMPLETION §0).
 * @param {AcceptedOp} op
 * @param {{ campaignId?: string|null, saveId?: string|null,
 *   proposalIndex?: number }} [ctx]
 * @returns {ApplyIntent|null} null when the op names no dispatchable family
 */
export function intentForOp(
  op,
  { campaignId = null, saveId = null, proposalIndex = 0 } = {},
) {
  if (!isDispatchable(op)) return null;
  const params = (op.params && typeof op.params === 'object' && !Array.isArray(op.params)) ? op.params : {};
  const label = typeof op.label === 'string' ? op.label : 'uncertain';
  const exactProposalIndex = Number.isInteger(proposalIndex) && proposalIndex >= 0
    ? proposalIndex
    : 0;
  if (op.family === 'party_impact') {
    return {
      family: 'party_impact',
      target: 'recordPartyImpact',
      opType: op.opType,
      label,
      proposalIndex: exactProposalIndex,
      campaignId: campaignId != null ? String(campaignId) : null,
      saveId: null,
      action: { kind: op.opType, ...params },
    };
  }
  return {
    family: 'canon_event',
    target: 'applyEvent',
    opType: op.opType,
    label,
    proposalIndex: exactProposalIndex,
    campaignId: campaignId != null ? String(campaignId) : null,
    saveId: saveId != null ? String(saveId) : null,
    event: { type: op.opType, ...params },
  };
}

/**
 * Map the review's accepted ops to ApplyIntent[]. Pure + total. An op naming no
 * dispatchable family is collected in `unroutable` (honest — never silently dropped),
 * mirroring the schema wall's unsupported list. The `accepted` array is the
 * reviewInterpretation output shape ({ index, op }[]) OR a bare op[]; both are accepted.
 * @param {Array<{ op?: AcceptedOp }|AcceptedOp>} accepted
 * @param {{ campaignId?: string|null, saveId?: string|null }} [ctx]
 * @returns {{ intents: ApplyIntent[], unroutable: Array<{ opType: string }> }}
 */
export function dispatchAcceptedOps(accepted, ctx = {}) {
  /** @type {ApplyIntent[]} */
  const intents = [];
  /** @type {Array<{ opType: string }>} */
  const unroutable = [];
  const entries = Array.isArray(accepted) ? accepted : [];
  for (let position = 0; position < entries.length; position++) {
    const entry = entries[position];
    const op = /** @type {AcceptedOp} */ (entry && typeof entry === 'object' && 'op' in entry ? entry.op : entry);
    const reviewIndex = (
      entry
      && typeof entry === 'object'
      && 'index' in entry
      && typeof entry.index === 'number'
      && Number.isInteger(entry.index)
      && entry.index >= 0
    ) ? entry.index : position;
    const intent = intentForOp(op, { ...ctx, proposalIndex: reviewIndex });
    if (intent) intents.push(intent);
    else if (op && typeof op === 'object' && typeof op.opType === 'string' && op.opType) {
      unroutable.push({ opType: op.opType });
    }
  }
  return { intents, unroutable };
}

/**
 * The apply-side session summary (§3 determinism/audit). Pure DATA — ENGINE VERSION + SEED
 * + a reference to the compile that proposed the ops + the per-decision counts. Carries NO
 * params, NO prose, NO PII: only counts, enum labels, seed, and the compile prompt-hash
 * reference. Command receipts carry exact per-proposal outcomes; this aggregate is display
 * and evaluation data, not a claim that the edge-written audit table recorded the apply.
 * @param {{
 *   intents?: ApplyIntent[],
 *   corrections?: Array<{ class?: string }>,
 *   blocked?: Array<unknown>,
 *   interpretRef?: string|null,
 *   seed?: string|number|null,
 *   engineVersion?: string,
 *   now?: string,
 * }} args
 * @returns {{
 *   kind: 'interpret_apply', engineVersion: string, seed: string|null, interpretRef: string|null,
 *   appliedCount: number, canonEventCount: number, partyImpactCount: number,
 *   correctionCount: number, blockedCount: number,
 *   byLabel: Record<string, number>, at: string|null,
 * }}
 */
export function interpretApplyLogRecord(args = {}) {
  const intents = Array.isArray(args.intents) ? args.intents : [];
  const byLabel = /** @type {Record<string, number>} */ ({});
  let canonEventCount = 0;
  let partyImpactCount = 0;
  for (const it of intents) {
    if (it.family === 'canon_event') canonEventCount += 1;
    else if (it.family === 'party_impact') partyImpactCount += 1;
    const l = typeof it.label === 'string' ? it.label : 'uncertain';
    byLabel[l] = (byLabel[l] || 0) + 1;
  }
  const corrections = Array.isArray(args.corrections) ? args.corrections : [];
  return {
    kind: 'interpret_apply',
    engineVersion: typeof args.engineVersion === 'string' && args.engineVersion ? args.engineVersion : ENGINE_VERSION,
    seed: args.seed == null ? null : String(args.seed),
    interpretRef: typeof args.interpretRef === 'string' && args.interpretRef ? args.interpretRef : null,
    appliedCount: intents.length,
    canonEventCount,
    partyImpactCount,
    correctionCount: corrections.length,
    blockedCount: Array.isArray(args.blocked) ? args.blocked.length : 0,
    byLabel,
    at: typeof args.now === 'string' && args.now ? args.now : null,
  };
}
