/**
 * domain/realm/realmItemActions.js — operational truth and legal-action
 * descriptors for RealmItems.
 *
 * This module does not dispatch. It reuses the docket's domain lapse predicate and
 * describes the existing command/navigation adapters a surface may invoke after
 * revalidation. Missing context degrades to endangered/unavailable; it never
 * manufactures permission.
 */

import { campaignPeerCountFor, lapseOf } from '../display/docketLapse.js';

/** @typedef {import('./realmItemInventory.js').RealmSourceClass} RealmSourceClass */
/** @typedef {'unresolved'|'resolved'|'dismissed'|'superseded'} ResolutionState */
/** @typedef {'active'|'endangered'|'lapsed'|'completed'|'cancelled'} OperationalState */

/** @param {unknown} value @returns {Record<string, unknown>} */
function recordOf(value) {
  return value != null && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value) : {};
}

/** @param {unknown} value @returns {string} */
function textOf(value) {
  return value == null ? '' : String(value).trim();
}

/**
 * @param {{
 *   sourceClass: RealmSourceClass,
 *   source: Record<string, unknown>,
 *   resolution: ResolutionState,
 *   campaign: Record<string, unknown>,
 *   settlementIndex: { provided: boolean, settlements: Map<string, Record<string, unknown>> },
 *   canUseCustomProvided: boolean,
 *   canUseCustom: boolean,
 * }} input
 * @returns {{ state: OperationalState, assessed: boolean, reason: string|null }}
 */
export function realmOperationalCondition(input) {
  const {
    sourceClass,
    source,
    resolution,
    campaign,
    settlementIndex,
    canUseCustomProvided,
    canUseCustom,
  } = input;
  if (resolution === 'resolved') return { state: 'completed', assessed: true, reason: null };
  if (resolution === 'dismissed' || resolution === 'superseded') {
    return { state: 'cancelled', assessed: true, reason: null };
  }
  if (sourceClass !== 'docket_order') {
    if (sourceClass.startsWith('pulse_') || sourceClass === 'wizard_news') {
      return { state: 'completed', assessed: true, reason: null };
    }
    return { state: 'active', assessed: true, reason: null };
  }

  const saveId = textOf(source.saveId);
  if (!settlementIndex.provided || !canUseCustomProvided) {
    return {
      state: 'endangered',
      assessed: false,
      reason: 'Current settlement state and entitlement context are required before this staged order can be revalidated.',
    };
  }
  const settlement = settlementIndex.settlements.get(saveId);
  if (!settlement) {
    return {
      state: 'lapsed',
      assessed: true,
      reason: 'The target settlement is no longer available; the staged order cannot execute.',
    };
  }
  try {
    const reason = lapseOf(recordOf(source.event), settlement, {
      canUseCustom,
      campaignPeerCount: campaignPeerCountFor(campaign, saveId),
    });
    return reason
      ? { state: 'lapsed', assessed: true, reason }
      : { state: 'active', assessed: true, reason: null };
  } catch {
    return {
      state: 'endangered',
      assessed: false,
      reason: 'The staged order could not be revalidated against its current settlement.',
    };
  }
}

/**
 * UI-neutral descriptors only. The adapter named here must revalidate against
 * current store state when invoked; this read model grants no permission.
 *
 * @param {{
 *   sourceClass: RealmSourceClass,
 *   source: Record<string, unknown>,
 *   sourceId: string,
 *   resolution: ResolutionState,
 *   advancePaused: boolean,
 * }} input
 * @returns {Array<Record<string, unknown>>}
 */
export function realmLegalActions(input) {
  const {
    sourceClass,
    source,
    sourceId,
    resolution,
    advancePaused,
  } = input;
  const target = { sourceId: sourceId || null, settlementId: textOf(source.saveId) || null };
  /**
   * @param {string} actionId
   * @param {string} actionType
   * @param {string} label
   * @param {string} adapterKey
   * @param {boolean} [available]
   * @param {string|null} [refusalReason]
   * @param {string|null} [operationId]
   * @returns {Record<string, unknown>}
   */
  const descriptor = (
    actionId,
    actionType,
    label,
    adapterKey,
    available = true,
    refusalReason = null,
    operationId = null,
  ) => ({
    actionId,
    actionType,
    label,
    adapterKey,
    // `operationId` joins the read model to the existing mutation census. It is
    // null for navigation/session-only gestures that are not store operations.
    operationId,
    target,
    availability: { available, refusalReason },
    revalidateOnInvoke: true,
  });

  if (sourceClass === 'proposal' && resolution === 'unresolved') {
    const sourceMissing = !sourceId;
    const refusal = sourceMissing
      ? 'The proposal has no stable source identity and cannot be invoked safely.'
      : (
          advancePaused
            ? 'The realm is mid-advance; resolve or undo the paused interval first.'
            : null
        );
    return [
      descriptor(
        'apply-proposal',
        'command',
        'Apply proposal',
        'applyWorldPulseProposal',
        !sourceMissing && !advancePaused,
        refusal,
        'applyWorldPulseProposal',
      ),
      descriptor(
        'dismiss-proposal',
        'command',
        'Dismiss proposal',
        'dismissWorldPulseProposal',
        !sourceMissing && !advancePaused,
        refusal,
        'dismissWorldPulseProposal',
      ),
    ];
  }
  if (sourceClass === 'paused_major') {
    const available = !!sourceId;
    const refusal = available
      ? null
      : 'The paused verdict has no stable source identity and cannot be invoked safely.';
    return [
      descriptor(
        'keep-paused-major',
        'session_choice',
        'Keep recommendation',
        'pausedAdvanceVerdict.stageKeep',
        available,
        refusal,
      ),
      descriptor(
        'dismiss-paused-major',
        'session_choice',
        'Dismiss recommendation',
        'pausedAdvanceVerdict.stageDismiss',
        available,
        refusal,
      ),
    ];
  }
  if (sourceClass === 'docket_order') {
    const canEdit = !!textOf(source.saveId);
    const canCancel = !!textOf(source.queueId ?? source.id);
    return [
      descriptor(
        'edit-docket-order',
        'navigation',
        'Edit staged order',
        'realmDocket.openSettlementComposer',
        canEdit,
        canEdit ? null : 'The order has no routeable settlement.',
      ),
      descriptor(
        'cancel-docket-order',
        'command',
        'Cancel staged order',
        'cancelQueuedEvent',
        canCancel,
        canCancel ? null : 'The order has no queue identity.',
        'cancelQueuedEvent',
      ),
    ];
  }
  return [];
}
