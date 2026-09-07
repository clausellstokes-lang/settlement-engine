/**
 * contentDraftSession.js — the authoring workflow as an explicit state machine.
 *
 * Manual and Surveyor-assisted authoring share one product promise:
 *
 *   describe → inspect → preview effects → forge sample → revise
 *     → approve → receive a durable result
 *
 * Keeping that sequence in a pure reducer prevents either UI from quietly
 * skipping interpretation or reporting success before a writer returns a
 * receipt. The reducer stores only JSON-shaped session data. Provider calls,
 * generation workers, persistence clients, and React concerns remain at their
 * respective boundaries.
 */

export const CONTENT_STUDIO_STAGE = Object.freeze({
  DESCRIBE: 'describe',
  INSPECT: 'inspect',
  EFFECTS: 'effects',
  SAMPLE: 'sample',
  REVISE: 'revise',
  APPROVE: 'approve',
  RECEIPT: 'receipt',
});

export const CONTENT_STUDIO_STATUS = Object.freeze({
  IDLE: 'idle',
  WORKING: 'working',
  READY: 'ready',
  FAILED: 'failed',
});

const STAGES = new Set(Object.values(CONTENT_STUDIO_STAGE));

/**
 * @typedef {'describe'|'inspect'|'effects'|'sample'|'revise'|'approve'|'receipt'} ContentStudioStage
 * @typedef {'idle'|'working'|'ready'|'failed'} ContentStudioStatus
 * @typedef {{
 *   action:'approve'|'edit'|'reject'|'pending',
 *   editedFields?:Record<string, unknown>,
 * }} ContentDraftDecision
 * @typedef {{
 *   stage:ContentStudioStage,
 *   status:ContentStudioStatus,
 *   source:'manual'|'surveyor',
 *   category:string|null,
 *   intent:string,
 *   draft:object|null,
 *   decisions:Record<string, ContentDraftDecision>,
 *   interpretation:object|null,
 *   sample:object|null,
 *   receipt:Record<string, unknown>|null,
 *   error:string|null,
 *   revision:number,
 * }} ContentDraftSession
 */

/** @param {unknown} value @returns {Record<string, unknown>} */
function plainRecord(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {string} */
function normalizeIntent(value) {
  return typeof value === 'string' ? value : '';
}

/** @param {unknown} value @returns {Record<string, ContentDraftDecision>} */
function normalizeDecisions(value) {
  const decisions = plainRecord(value);
  /** @type {Record<string, ContentDraftDecision>} */
  const out = {};
  for (const [key, rawDecision] of Object.entries(decisions)) {
    const decision = plainRecord(rawDecision);
    if (Object.keys(decision).length === 0) continue;
    const action = (
      decision.action === 'approve'
      || decision.action === 'edit'
      || decision.action === 'reject'
      || decision.action === 'pending'
    )
      ? decision.action
      : 'pending';
    out[key] = {
      action,
      ...(decision.editedFields && typeof decision.editedFields === 'object'
        && !Array.isArray(decision.editedFields)
        ? { editedFields: { ...decision.editedFields } }
        : {}),
    };
  }
  return out;
}

/** @param {unknown} value @returns {value is ContentStudioStatus} */
function isContentStudioStatus(value) {
  return (
    value === CONTENT_STUDIO_STATUS.IDLE
    || value === CONTENT_STUDIO_STATUS.WORKING
    || value === CONTENT_STUDIO_STATUS.READY
    || value === CONTENT_STUDIO_STATUS.FAILED
  );
}

/**
 * The workflow may call a local ledger or a remote transaction, but neither is
 * successful merely because it returned a truthy object. Approval completes
 * only when the command boundary carries an explicit durable confirmation.
 *
 * @param {unknown} value
 */
function isConfirmedApprovalReceipt(value) {
  const receipt = plainRecord(value);
  return receipt.ok === true
    && receipt.status === 'applied'
    && plainRecord(receipt.persistence).state === 'confirmed';
}

/** @param {unknown} value */
function normalizeApprovalReceipt(value) {
  const receipt = plainRecord(value);
  if (isConfirmedApprovalReceipt(receipt)) return receipt;

  const reportedStatus = typeof receipt.status === 'string'
    ? receipt.status
    : null;
  const ambiguous = reportedStatus === 'applied'
    || receipt.ok === true
    || reportedStatus == null;
  return {
    ...receipt,
    ok: false,
    status: ambiguous ? 'reconcile-required' : reportedStatus,
    persistence: {
      ...plainRecord(receipt.persistence),
      state: ambiguous
        ? 'unconfirmed'
        : plainRecord(receipt.persistence).state || 'not-required',
    },
    reason: receipt.reason || (
      ambiguous
        ? 'custom_content_persistence_unconfirmed'
        : 'The content command was refused.'
    ),
  };
}

/**
 * @param {{ intent?:string, source?:'manual'|'surveyor', category?:string|null }} [fields]
 * @returns {ContentDraftSession}
 */
export function createContentDraftSession(fields = {}) {
  return /** @type {ContentDraftSession} */ ({
    stage: CONTENT_STUDIO_STAGE.DESCRIBE,
    status: CONTENT_STUDIO_STATUS.IDLE,
    source: fields.source === 'manual' ? 'manual' : 'surveyor',
    category: typeof fields.category === 'string' ? fields.category : null,
    intent: normalizeIntent(fields.intent),
    draft: null,
    decisions: {},
    interpretation: null,
    sample: null,
    receipt: null,
    error: null,
    revision: 0,
  });
}

/** @param {ContentDraftSession} state */
function nextRevision(state) {
  return Number.isSafeInteger(state.revision) ? state.revision + 1 : 1;
}

/**
 * @param {ContentDraftSession} state
 * @param {ContentStudioStage} stage
 * @param {Partial<ContentDraftSession>} [fields]
 * @returns {ContentDraftSession}
 */
function move(state, stage, fields = {}) {
  if (!STAGES.has(stage)) return state;
  const status = isContentStudioStatus(fields.status)
    ? fields.status
    : CONTENT_STUDIO_STATUS.READY;
  return {
    ...state,
    ...fields,
    stage,
    status,
    error: fields.error ?? null,
    revision: nextRevision(state),
  };
}

/**
 * Pure workflow reducer. Unknown events and invalid forward transitions are
 * total no-ops so imported or stale UI events cannot corrupt the session.
 *
 * @param {ContentDraftSession} state
 * @param {{ type?:string, [key:string]:unknown }} event
 */
export function reduceContentDraftSession(state, event = {}) {
  const current = state && typeof state === 'object'
    ? state
    : createContentDraftSession();

  switch (event.type) {
    case 'intent.changed':
      return {
        ...current,
        intent: normalizeIntent(event.intent),
        error: null,
        revision: nextRevision(current),
      };

    case 'compile.started':
      return move(current, CONTENT_STUDIO_STAGE.DESCRIBE, {
        status: CONTENT_STUDIO_STATUS.WORKING,
        draft: null,
        decisions: {},
        interpretation: null,
        sample: null,
        receipt: null,
      });

    case 'compile.succeeded':
      if (!event.draft || typeof event.draft !== 'object') return current;
      return move(current, CONTENT_STUDIO_STAGE.INSPECT, {
        status: CONTENT_STUDIO_STATUS.READY,
        draft: event.draft,
        decisions: {},
        interpretation: event.interpretation ?? null,
        sample: null,
        receipt: null,
      });

    case 'compile.failed':
      return move(current, CONTENT_STUDIO_STAGE.DESCRIBE, {
        status: CONTENT_STUDIO_STATUS.FAILED,
        error: typeof event.error === 'string'
          ? event.error
          : 'The content request could not be compiled.',
      });

    case 'decision.changed': {
      if (!current.draft) return current;
      const index = Number(event.index);
      if (!Number.isInteger(index) || index < 0) return current;
      return move(current, CONTENT_STUDIO_STAGE.INSPECT, {
        decisions: normalizeDecisions({
          ...current.decisions,
          [index]: event.decision,
        }),
        // Both projections describe the exact accepted draft. A field or
        // acceptance change therefore invalidates them together; retaining
        // either would let a later approval rely on stale review evidence.
        interpretation: null,
        sample: null,
        receipt: null,
      });
    }

    case 'baseline.changed':
      if (
        !current.draft
        || (
          current.stage !== CONTENT_STUDIO_STAGE.SAMPLE
          && current.stage !== CONTENT_STUDIO_STAGE.REVISE
          && current.stage !== CONTENT_STUDIO_STAGE.APPROVE
        )
        || (
          current.stage === CONTENT_STUDIO_STAGE.APPROVE
          && current.status === CONTENT_STUDIO_STATUS.WORKING
        )
      ) {
        return current;
      }
      // A taste sample compares against the active content environment. If
      // that baseline changes before the write begins, retain the reviewed
      // draft/effect map but require a new same-seed sample.
      return move(current, CONTENT_STUDIO_STAGE.EFFECTS, {
        status: CONTENT_STUDIO_STATUS.READY,
        sample: null,
        receipt: null,
      });

    case 'effects.viewed':
      if (
        current.stage !== CONTENT_STUDIO_STAGE.INSPECT
        || !current.draft
        || !event.interpretation
      ) {
        return current;
      }
      return move(current, CONTENT_STUDIO_STAGE.EFFECTS, {
        interpretation: event.interpretation,
      });

    case 'sample.started':
      if (
        !current.draft
        || !current.interpretation
        || (
          current.stage !== CONTENT_STUDIO_STAGE.EFFECTS
          && !(
            current.stage === CONTENT_STUDIO_STAGE.SAMPLE
            && current.status === CONTENT_STUDIO_STATUS.FAILED
          )
        )
      ) {
        return current;
      }
      return move(current, CONTENT_STUDIO_STAGE.SAMPLE, {
        status: CONTENT_STUDIO_STATUS.WORKING,
        sample: null,
      });

    case 'sample.succeeded':
      if (
        current.stage !== CONTENT_STUDIO_STAGE.SAMPLE
        || current.status !== CONTENT_STUDIO_STATUS.WORKING
        || !event.sample
      ) {
        return current;
      }
      // A successful sample opens the revise/review step. Any actual decision
      // change above returns to INSPECT and clears this evidence.
      return move(current, CONTENT_STUDIO_STAGE.REVISE, {
        status: CONTENT_STUDIO_STATUS.READY,
        sample: event.sample,
      });

    case 'sample.failed':
      if (
        current.stage !== CONTENT_STUDIO_STAGE.SAMPLE
        || current.status !== CONTENT_STUDIO_STATUS.WORKING
      ) {
        return current;
      }
      return move(current, CONTENT_STUDIO_STAGE.SAMPLE, {
        status: CONTENT_STUDIO_STATUS.FAILED,
        error: typeof event.error === 'string'
          ? event.error
          : 'The sample settlement could not be forged.',
      });

    case 'revision.started':
      if (!current.draft || !current.sample) return current;
      return move(current, CONTENT_STUDIO_STAGE.REVISE);

    case 'revision.applied':
      if (!event.draft || typeof event.draft !== 'object') return current;
      return move(current, CONTENT_STUDIO_STAGE.INSPECT, {
        draft: event.draft,
        interpretation: event.interpretation ?? null,
        sample: null,
        receipt: null,
      });

    case 'approval.reviewed':
      if (
        current.stage !== CONTENT_STUDIO_STAGE.REVISE
        || !current.draft
        || !current.interpretation
        || !current.sample
      ) {
        return current;
      }
      return move(current, CONTENT_STUDIO_STAGE.APPROVE);

    case 'approval.started':
      if (current.stage !== CONTENT_STUDIO_STAGE.APPROVE) return current;
      return move(current, CONTENT_STUDIO_STAGE.APPROVE, {
        status: CONTENT_STUDIO_STATUS.WORKING,
        receipt: null,
      });

    case 'approval.received': {
      if (
        current.stage !== CONTENT_STUDIO_STAGE.APPROVE
        || current.status !== CONTENT_STUDIO_STATUS.WORKING
        || !event.receipt
        || typeof event.receipt !== 'object'
      ) {
        return current;
      }
      const receipt = normalizeApprovalReceipt(event.receipt);
      const confirmed = isConfirmedApprovalReceipt(receipt);
      return move(current, CONTENT_STUDIO_STAGE.RECEIPT, {
        status: confirmed
          ? CONTENT_STUDIO_STATUS.READY
          : CONTENT_STUDIO_STATUS.FAILED,
        receipt,
        error: confirmed ? null : String(receipt.reason),
      });
    }

    case 'reset':
      return createContentDraftSession({
        source: current.source,
        category: current.category,
        intent: event.keepIntent === true ? current.intent : '',
      });

    default:
      return current;
  }
}

/**
 * Human-readable progress for steppers and screen-reader announcements.
 * @param {ContentDraftSession} session
 */
export function contentDraftProgress(session) {
  const stages = Object.values(CONTENT_STUDIO_STAGE);
  const index = Math.max(0, stages.indexOf(session?.stage));
  return {
    current: index + 1,
    total: stages.length,
    stage: stages[index],
    complete: session?.stage === CONTENT_STUDIO_STAGE.RECEIPT
      && isConfirmedApprovalReceipt(session?.receipt),
  };
}
