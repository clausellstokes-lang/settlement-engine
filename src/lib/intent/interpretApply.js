/**
 * lib/intent/interpretApply.js — the ACCEPT→MINT executor (Surveyor S3→S4 seam).
 *
 * The application HALF of the accept→mint slice. The PURE half
 * (dispatchAcceptedOps + interpretApplyLogRecord,
 * src/domain/intent/applyDispatch.js) maps the review's accepted ops to typed
 * ApplyIntent[]. THIS turns each intent into an addressed application command.
 * The command adapter, not this Surveyor-specific module, reaches the same
 * recordPartyImpact / applyEvent writer the manual UI drives.
 *
 * DI by design (mirrors the edge functions' handler seam): terminal writers are
 * injected into the command context, so the executor is pinned without a live
 * store and the panel wires the real actions. Orchestration glue belongs in
 * src/lib (never src/domain — the engine spine stays headless,
 * tests/architecture/layerBoundaries.test.js). Reached only from the lazy
 * interpret panel, so it adds zero eager bytes.
 *
 * NEVER-BYPASS (the constitution, §3): every landed op flows through a registered
 * CommandSpec and then its established writer — the AI writes NO state directly.
 * Stable per-proposal command ids keep duplicate op types distinct. The
 * session-command journal prevents a double-submit from executing the writer
 * twice. Command adapters may strengthen that guarantee: the first
 * CUT_TRADE_ROUTE vertical also claims a durable server journal.
 *
 * ── THE SURVEYOR BRIDGE (EM-D4, wave 4; design §3's Surveyor row and §12; ARCH §7) ──
 *
 * Design §3: "Its compiled proposals land in the registry as decrees `addedBy:
 * 'surveyor'`; its approve/edit/reject becomes the registry's own controls; the
 * protected-consent barrier becomes a guard kind." The three functions below are that
 * sentence, and nothing more.
 *
 * ⛔ THE WRITER IS INJECTED, AND THAT IS WHAT KEEPS EM-C1's LEAF DARK. `stage` arrives
 * on `stageDecree`, exactly as this module's terminal writers arrive on
 * `context.actions`, so `src/domain/edit/registry.js` keeps ZERO importers under `src/`
 * — the dark landing its own header claims and the standing law (§P11.1) requires — and
 * `tests/lib/interpretApply.test.js` injects the REAL `stage` rather than a stand-in, so
 * the "one writer of `decrees`" law (§P4) is proven against the live leaf and not merely
 * asserted. A bridge that imported the leaf would light it up for every Surveyor user
 * before EM-C4b's slice and EM-D1's tier gate exist.
 *
 * ⛔ NOTHING HERE READS A CLOCK, TAKES A DRAW OR MINTS AN ID FROM ENTROPY. The decree id
 * is derived from THE REVIEW ARTIFACT (`reviewRef`, minted once per successful compile in
 * InterpretApplyPanel) plus the proposal's own review index, so a retry of one Apply
 * re-derives the same ids and `stage` refuses the duplicates by id — the same replay
 * protection the command ids already give the writer half. `orderedAt` is the CALLER's
 * stamp (HZ-STAMP: a clock is read in the command that writes it).
 *
 * ⛔ THE OP CATALOGUE IS NOT CONSULTED AND `makeOp` IS NOT IMPORTED. Measured at this
 * tip: `OP_TYPES` (22 edit ops) is DISJOINT from both `EVENT_TYPES` (41) and
 * `PARTY_IMPACT_KINDS` (12), so `makeOp` returns null for every op the Surveyor compiles
 * and importing it would put this module on the `tests/lint/editMutationPath.walker`
 * OFFENDER list for no gain. The decree carries the compiled op verbatim as
 * `{ type, target, payload }`; `target` is null because a compiled proposal names no
 * EntityRef — its payload addresses its own subject. Binding the two event catalogues
 * into the decree vocabulary is EM-E6's row, not this one.
 *
 * ⛔ CONSENT IS RENDERED IN THE GUARD VOCABULARY, NOT ENFORCED A SECOND TIME. The barrier
 * itself stays exactly where it is — `reviewInterpretation` refuses a flagged op without
 * an explicit tick, and the review artifact's shape is untouched. What EM-D4 adds is the
 * WORDS: each blocked proposal is minted as one `Guard` of EM-C2's own shape, `kind` a
 * member of `GUARD_KINDS` and `offers` members of `GUARD_OFFERS`, so the registry page
 * and this panel speak one vocabulary. `prerequisite` is the kind because consent is a
 * thing that must be true FIRST; `self` is the DM's own hand (the review's Edit) and
 * `proceed` is the explicit tick, which is why proceeding here is not a bypass: it IS the
 * consent, and design §2.7 records it on the entry as an override. The two words are
 * joined to their producer by the suite (a renamed kind reds there), never re-derived
 * here — this module imports no `src/domain/edit` leaf at all.
 */

import { dispatchAcceptedOps, interpretApplyLogRecord } from '../../domain/intent/applyDispatch.js';
import {
  CANON_EVENT_APPLY,
  canonEventCommand,
} from '../../application/commands/adapters/canonEventApply.js';
import { partyImpactCommand } from '../../application/commands/adapters/partyImpactRecord.js';
import { executeSessionCommand } from '../../application/commands/sessionCommandRuntime.js';
import { isAuthoritativeCanonEventType } from '../../domain/events/authoritativeCanonEventTypes.js';

const SUCCESS_STATUS = new Set(['applied', 'queued']);

/**
 * @typedef {{
 *   ownerId?: string|null,
 *   saveId?: string|null,
 *   campaignId?: string|null,
 *   saveRevision?: string|null,
 *   campaignRevision?: string|null,
 * }} InterpretApplyTargetContext
 */

/**
 * @typedef {{
 *   accepted?: Array<{op?: any, index?: number}|any>,
 *   campaignId?: string|null,
 *   saveId?: string|null,
 *   ownerId?: string|null,
 *   targetContext?: InterpretApplyTargetContext,
 *   currentContext?: InterpretApplyTargetContext,
 *   readCurrentContext?: () => InterpretApplyTargetContext,
 *   seed?: string|number|null,
 *   interpretRef?: string|null,
 *   reviewRef?: string|null,
 *   corrections?: Array<{class?: string}>,
 *   blocked?: Array<unknown>,
 *   now?: string,
 *   actions?: {
 *     applyEvent?: (event: any) => unknown,
 *     recordPartyImpact?: (
 *       campaignId: string,
 *       action: any,
 *     ) => Promise<unknown>|unknown,
 *   },
 *   executeCommand?: typeof executeSessionCommand,
 * }} InterpretApplyIO
 */

function hasOwn(record, field) {
  return !!record && Object.prototype.hasOwnProperty.call(record, field);
}

function observed(record, field, fallback = null) {
  return hasOwn(record, field) ? record[field] : fallback;
}

function targetAndCurrent(io) {
  const targetInput = io.targetContext || {};
  const target = {
    ownerId: observed(targetInput, 'ownerId', io.ownerId ?? null),
    saveId: observed(targetInput, 'saveId', io.saveId ?? null),
    campaignId: observed(targetInput, 'campaignId', io.campaignId ?? null),
    saveRevision: observed(targetInput, 'saveRevision', null),
    campaignRevision: observed(targetInput, 'campaignRevision', null),
  };
  const currentInput = io.currentContext;
  if (!currentInput) return { target, current: { ...target } };
  return {
    target,
    current: {
      ownerId: observed(currentInput, 'ownerId', target.ownerId),
      saveId: observed(currentInput, 'saveId', target.saveId),
      campaignId: observed(currentInput, 'campaignId', target.campaignId),
      saveRevision: observed(currentInput, 'saveRevision', target.saveRevision),
      campaignRevision: observed(
        currentInput,
        'campaignRevision',
        target.campaignRevision,
      ),
    },
  };
}

function commandForIntent(intent, io, target) {
  const shared = {
    interpretRef: io.interpretRef,
    reviewRef: io.reviewRef,
    seed: io.seed,
    ownerId: target.ownerId,
    now: io.now,
  };
  if (intent.target === 'recordPartyImpact') {
    return partyImpactCommand(intent, {
      ...shared,
      revision: target.campaignRevision,
    });
  }
  return canonEventCommand(intent, {
    ...shared,
    revision: target.saveRevision,
  });
}

function executionContext(intent, io, current) {
  return {
    ownerId: current.ownerId,
    saveId: current.saveId,
    campaignId: current.campaignId,
    revision: intent.target === 'recordPartyImpact'
      ? current.campaignRevision
      : current.saveRevision,
    now: io.now,
    actions: io.actions,
  };
}

function nextSaveRevision(receipt) {
  return receipt?.result?.commandPersistence?.updatedAt
    || receipt?.result?.after?.appliedAt
    || null;
}

function commandEventType(command) {
  const event = command?.params?.event;
  return (
    event
    && typeof event === 'object'
    && !Array.isArray(event)
    && 'type' in event
  ) ? event.type : null;
}

function readLiveContext(input, fallback) {
  if (typeof input.readCurrentContext !== 'function') return fallback;
  try {
    const observedContext = input.readCurrentContext();
    return targetAndCurrent({
      targetContext: fallback,
      currentContext: observedContext,
    }).current;
  } catch {
    // An observational callback must not turn command execution into a throw.
    // The executor still validates the last complete snapshot it received.
    return fallback;
  }
}

/**
 * Fold one explicit durable-recovery observation into the visible apply result.
 *
 * The original command envelope remains session-only and lets the recovery
 * action replay the exact reviewed behavior. Neither it nor this UI summary is
 * a persistence authority; the durable journal row and command RPC remain that
 * authority.
 */
export function mergeCanonEventRecoveryResult(
  applyResult,
  commandId,
  recovery,
) {
  const prior = applyResult || {};
  const commandResults = Array.isArray(prior.commandResults)
    ? prior.commandResults
    : [];
  const matchedIndex = commandResults.findIndex(
    item => item.commandId === commandId,
  );
  if (matchedIndex < 0) return prior;
  const matched = commandResults[matchedIndex];

  const receipt = recovery?.receipt || null;
  const status = receipt?.status || recovery?.status || matched.status;
  const successful = item => (
    item.status === 'applied' || item.status === 'queued'
  );
  const sameSummary = (summary, item) => (
    summary.opType === item.opType && summary.family === item.family
  );
  const removeCommandOwnedSummaries = (summaries, results, predicate) => {
    const remaining = [...summaries];
    for (const result of results.filter(predicate)) {
      const index = remaining.findIndex(summary => (
        sameSummary(summary, result)
      ));
      if (index >= 0) remaining.splice(index, 1);
    }
    return remaining;
  };
  const nextCommandResults = commandResults.map(item => (
    item.commandId === commandId
      ? {
          ...item,
          status,
          replayed: receipt?.replayed === true,
          receipt: receipt || item.receipt,
          recovery,
        }
      : item
  ));

  // Command ids are the exact identity. Strip the old command-owned summaries,
  // then rebuild them from updated command results. Any exceptional summary
  // without a command result (for example an injected executor throwing) is
  // preserved separately rather than guessed by family/type.
  const extraApplied = removeCommandOwnedSummaries(
    prior.applied || [],
    commandResults,
    successful,
  );
  const extraFailed = removeCommandOwnedSummaries(
    prior.failed || [],
    commandResults,
    item => !successful(item),
  );
  const applied = [
    ...nextCommandResults.filter(successful).map(item => ({
      opType: item.opType,
      family: item.family,
    })),
    ...extraApplied,
  ];
  const failed = [
    ...nextCommandResults.filter(item => !successful(item)).map(item => ({
      opType: item.opType,
      family: item.family,
      reason: item.recovery?.reason
        || item.receipt?.reason
        || item.status
        || 'refused',
    })),
    ...extraFailed,
  ];

  return {
    ...prior,
    applied,
    failed,
    commandResults: nextCommandResults,
    log: prior.log
      ? { ...prior.log, appliedCount: applied.length }
      : prior.log,
  };
}

/** The author ARCH §2 gives the Surveyor's own entries (`Decree.addedBy`'s third member). */
const SURVEYOR_AUTHOR = 'surveyor';

/** The rule id half of every consent guard's id; stable across versions, because an
 *  entry's `overrode` records guard IDS and renaming one orphans a recorded override. */
const CONSENT_RULE_ID = 'surveyor-consent';

/** The kind and the offers of design §2.7 the consent barrier wears, both members of
 *  EM-C2's frozen vocabularies and joined to them by the suite. */
const CONSENT_GUARD_KIND = 'prerequisite';
const CONSENT_GUARD_OFFERS = Object.freeze(['self', 'proceed']);

/** The herald's voice, one sentence, content-free beyond the verb it names. */
const CONSENT_MESSAGE = 'the table\'s own consent comes first: tick it, or edit the op by hand.';

/** EM-C2's own id grammar — `<ruleId>:<entryId>:<related or ->:<facet or ->` — so a
 *  registry page cannot tell a consent guard from one the engine minted. */
const GUARD_ID_ABSENT = '-';

/**
 * @typedef {{ opType?: string, params?: Record<string, unknown> }} CompiledProposal
 * @typedef {{ id: string, entryId: string, ruleId: string, kind: string, message: string,
 *   offers: readonly string[], fulfil: null, relatedEntryId: null,
 *   overridden: boolean }} ConsentGuard
 * @typedef {{ id: string, proposalIndex: number, opType: string }} StagedDecree
 */

/** @param {unknown} value @returns {value is Record<string, unknown>} plain, never an array */
function isPlainObject(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

/** @param {unknown} value @returns {value is string} a non-empty string */
function isText(value) {
  return typeof value === 'string' && value.length > 0;
}

/** @param {unknown} value @returns {number|null} a review index, or nothing */
function reviewIndexOf(value) {
  return Number.isInteger(value) && /** @type {number} */ (value) >= 0
    ? /** @type {number} */ (value)
    : null;
}

/**
 * The decree id one reviewed proposal takes. DERIVED from the review artifact and the
 * proposal's own review index and NOTHING else: stable for every Apply of one review,
 * distinct from a later compile of identical text, and the same id whether the proposal
 * is staged now or was blocked for consent a moment ago — which is what lets a consent
 * guard address the entry it is about before that entry exists.
 *
 * @param {unknown} reviewRef @param {unknown} proposalIndex @returns {string}
 */
export function surveyorDecreeId(reviewRef, proposalIndex) {
  const ref = isText(reviewRef) ? reviewRef : 'review:unref';
  return `decree:${ref}:${reviewIndexOf(proposalIndex) ?? 0}`;
}

/**
 * Mint one `Guard` per blocked proposal — design §3's "the protected-consent barrier
 * becomes a guard kind". PURE and TOTAL: a malformed row is skipped at the narrowest
 * scope that can skip it (design §9's tie-break), and the barrier itself is untouched —
 * `reviewInterpretation` already refused these ops and this only says so in the
 * registry's own words.
 *
 * @param {unknown} blocked the review's `blocked` rows (`{ index, reason }`)
 * @param {{ reviewRef?: unknown, ops?: unknown }} [context]
 * @returns {readonly ConsentGuard[]} frozen, in the review's own order
 */
export function consentGuardsFor(blocked, { reviewRef = null, ops = [] } = {}) {
  const proposals = Array.isArray(ops) ? ops : [];
  /** @type {ConsentGuard[]} */
  const guards = [];
  for (const row of Array.isArray(blocked) ? blocked : []) {
    if (!isPlainObject(row)) continue;
    const index = reviewIndexOf(row.index);
    if (index === null) continue;
    const entryId = surveyorDecreeId(reviewRef, index);
    const proposal = /** @type {CompiledProposal|undefined} */ (proposals[index]);
    const opType = proposal && isText(proposal.opType) ? proposal.opType : '';
    guards.push(Object.freeze({
      id: [CONSENT_RULE_ID, entryId, GUARD_ID_ABSENT, GUARD_ID_ABSENT].join(':'),
      entryId,
      ruleId: CONSENT_RULE_ID,
      kind: CONSENT_GUARD_KIND,
      message: opType ? `${opType} is protected — ${CONSENT_MESSAGE}` : CONSENT_MESSAGE,
      offers: CONSENT_GUARD_OFFERS,
      fulfil: null,
      relatedEntryId: null,
      overridden: false,
    }));
  }
  return Object.freeze(guards);
}

/**
 * The compiled proposal as a decree's `Op`. The payload is COPIED, so nothing the caller
 * still holds is shared into a frozen entry.
 * @param {CompiledProposal} op @returns {{ type: string, target: null, payload: Record<string, unknown> }}
 */
function decreeOpFor(op) {
  return Object.freeze({
    type: /** @type {string} */ (op.opType),
    target: null,
    payload: Object.freeze({ ...(isPlainObject(op.params) ? op.params : {}) }),
  });
}

/**
 * THE BRIDGE. Fold the review's accepted proposals into a decree registry through the
 * INJECTED `stage`, and mint the consent guards for the blocked ones.
 *
 * Every accepted proposal stages, including one the command dispatcher would call
 * `unroutable`: the registry is the DM's own list of what the table decided, not the
 * dispatcher's list of what it can land today, and design §3 says the compiled proposals
 * land there. The fold carries each `stage` result forward, so the registry the caller
 * gets back is EM-C1's own frozen value and this module writes `decrees` nowhere.
 *
 * Refused, with the registry returned exactly as handed in: no injected `stage`, no
 * review artifact, or no `orderedAt` stamp. Each is the caller's to supply and a decree
 * minted without one would carry a made-up identity or a made-up time.
 *
 * @param {{ accepted?: unknown, blocked?: unknown, ops?: unknown, registry?: unknown,
 *   reviewRef?: unknown, surveyorCredit?: unknown, orderedAt?: unknown,
 *   stageDecree?: unknown }} [io]
 * @returns {{ registry: unknown, staged: readonly StagedDecree[],
 *   guards: readonly ConsentGuard[] }}
 */
export function stageSurveyorDecrees(io = {}) {
  const input = isPlainObject(io) ? io : {};
  const reviewRef = isText(input.reviewRef) ? input.reviewRef : null;
  const orderedAt = isText(input.orderedAt) ? input.orderedAt : null;
  const credit = typeof input.surveyorCredit === 'number' && Number.isFinite(input.surveyorCredit)
    ? input.surveyorCredit
    : null;
  const guards = consentGuardsFor(input.blocked, { reviewRef, ops: input.ops });
  /** @type {StagedDecree[]} */
  const staged = [];
  /** @type {readonly unknown[]} the caller's registry, and after the fold EM-C1's own frozen value */
  let registry = Array.isArray(input.registry) ? input.registry : [];
  const stageDecree = typeof input.stageDecree === 'function'
    ? /** @type {(r: unknown, op: unknown, meta: unknown) => readonly unknown[]} */ (input.stageDecree)
    : null;
  if (stageDecree === null || reviewRef === null || orderedAt === null) {
    return { registry, staged: Object.freeze(staged), guards };
  }
  const entries = Array.isArray(input.accepted) ? input.accepted : [];
  for (let position = 0; position < entries.length; position += 1) {
    const entry = entries[position];
    const op = /** @type {CompiledProposal} */ (
      isPlainObject(entry) && 'op' in entry ? entry.op : entry
    );
    if (!isPlainObject(op) || !isText(op.opType)) continue;
    const index = isPlainObject(entry) ? (reviewIndexOf(entry.index) ?? position) : position;
    const id = surveyorDecreeId(reviewRef, index);
    const before = registry;
    registry = stageDecree(registry, decreeOpFor(op), {
      id,
      orderedAt,
      addedBy: SURVEYOR_AUTHOR,
      ...(credit === null ? {} : { surveyorCredit: credit }),
    });
    if (registry.length > before.length) {
      staged.push(Object.freeze({ id, proposalIndex: index, opType: op.opType }));
    }
  }
  return { registry, staged: Object.freeze(staged), guards };
}

/**
 * Execute accepted proposals as independently receipted application commands
 * and return their no-content reproducibility summary.
 *
 * @param {InterpretApplyIO} io
 * @returns {Promise<{
 *   applied: Array<{ opType: string, family: string }>,
 *   failed: Array<{ opType: string, family: string, reason: string }>,
 *   unroutable: Array<{ opType: string }>,
 *   commandResults: Array<{commandId:string, proposalIndex:number,
 *     opType:string, family:string, status:string, replayed:boolean,
 *     receipt:object}>,
 *   log: ReturnType<typeof interpretApplyLogRecord>,
 * }>}
 */
export async function runInterpretApply(io) {
  const input = /** @type {InterpretApplyIO} */ (io || {});
  const {
    accepted = [],
    seed = null,
    interpretRef = null,
    corrections = [],
    blocked = [],
    now,
    actions = {},
    executeCommand = executeSessionCommand,
  } = input;
  const contexts = targetAndCurrent(input);
  const expected = { ...contexts.target };
  let current = contexts.current;
  const { intents, unroutable } = dispatchAcceptedOps(accepted, {
    campaignId: expected.campaignId,
    saveId: expected.saveId,
  });

  /** @type {Array<{ opType: string, family: string }>} */
  const applied = [];
  /** @type {Array<{ opType: string, family: string, reason: string }>} */
  const failed = [];
  /** @type {typeof intents} */
  const landedIntents = [];
  /** @type {Array<any>} */
  const commandResults = [];

  for (const intent of intents) {
    current = readLiveContext(input, current);
    const command = commandForIntent(intent, {
      ...input,
      seed,
      interpretRef,
      now,
      actions,
    }, expected);
    try {
      const receipt = await executeCommand(
        command,
        executionContext(intent, { ...input, now, actions }, current),
      );
      commandResults.push({
        commandId: command.commandId,
        proposalIndex: intent.proposalIndex,
        opType: intent.opType,
        family: intent.family,
        status: receipt.status,
        replayed: receipt.replayed === true,
        receipt,
        // Only an ambiguous authoritative canon command needs its exact
        // envelope retained for the product-visible same-session recovery
        // action. It never enters analytics, logs, or browser persistence.
        ...(receipt.status === 'reconcile-required'
          && command.kind === CANON_EVENT_APPLY
          && isAuthoritativeCanonEventType(commandEventType(command))
          ? { recoveryCommand: command }
          : {}),
      });
      if (SUCCESS_STATUS.has(receipt.status)) {
        applied.push({ opType: intent.opType, family: intent.family });
        landedIntents.push(intent);
        // Canon proposals in one accepted review form an ordered mini-saga. A
        // successful first proposal advances the save revision that the next
        // proposal must address. Derive it from the stored receipt (not merely
        // the latest live store) so replaying the whole review reconstructs the
        // exact same command chain and cannot mint a new second command.
        if (intent.target === 'applyEvent') {
          const revision = nextSaveRevision(receipt);
          if (revision) {
            expected.saveRevision = revision;
            current = { ...current, saveRevision: revision };
          }
        }
      } else {
        failed.push({
          opType: intent.opType,
          family: intent.family,
          reason: receipt.reason || receipt.status || 'refused',
        });
      }
    } catch (error) {
      // The standard executor is total; this catch protects an injected test or
      // future runtime implementation without dropping the proposal silently.
      failed.push({
        opType: intent.opType,
        family: intent.family,
        reason: error instanceof Error ? error.message : 'command_executor_threw',
      });
    }
  }

  // Use the exact per-command successes. Matching by family+opType over-counted
  // a failed duplicate whenever a same-type sibling landed.
  const log = interpretApplyLogRecord({
    intents: landedIntents,
    corrections,
    blocked,
    interpretRef,
    seed,
    now,
  });

  return { applied, failed, unroutable, commandResults, log };
}
