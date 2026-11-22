/**
 * Persistence and deletion orchestration for the settlement Library.
 *
 * SettlementsPanel owns presentation; this module owns optimistic rollback,
 * owner/session fencing, and the lock that serializes deletion against campaign
 * advances and membership writes. A failed request may restore only the exact
 * object versions it optimistically changed—never a newer edit or another
 * operation's successful result.
 */

import { track, EVENTS } from '../../lib/analytics.js';
import { saves as savesService } from '../../lib/saves.js';
import { t } from '../../copy/index.js';
import { useStore } from '../../store/index.js';
import {
  captureSavedSettlementsHydration,
  isCurrentSavedSettlementsHydration,
} from '../../store/savedSettlementsHydration.js';
import {
  canonPhaseOf, dayGapBand, hasAiData, lastEditedMs, computeBulkDelete,
} from './helpers.js';

/**
 * Undo only rows owned by a failed persistence operation. Object identity is
 * the optimistic-write token, so a newer edit or unrelated successful delete
 * is never replaced by the stale pre-request snapshot.
 */
export function rollbackLibraryMutation(currentRows, previousRows, optimisticRows, touchedIds) {
  const touched = new Set((touchedIds || []).filter(id => id != null).map(String));
  if (touched.size === 0) return currentRows;
  const previousById = new Map((previousRows || []).map(row => [String(row.id), row]));
  const optimisticById = new Map((optimisticRows || []).map(row => [String(row.id), row]));
  const next = [...(currentRows || [])];
  for (const id of touched) {
    const currentIndex = next.findIndex(row => String(row.id) === id);
    const current = currentIndex >= 0 ? next[currentIndex] : null;
    const optimistic = optimisticById.get(id) || null;
    const previous = previousById.get(id) || null;
    if (optimistic ? current !== optimistic : current != null) continue;

    if (previous) {
      if (currentIndex >= 0) {
        next[currentIndex] = previous;
      } else {
        const previousIndex = previousRows.findIndex(row => String(row.id) === id);
        let insertionIndex = next.length;
        for (let index = previousIndex + 1; index < previousRows.length; index += 1) {
          const successor = next.findIndex(row => String(row.id) === String(previousRows[index].id));
          if (successor >= 0) {
            insertionIndex = successor;
            break;
          }
        }
        next.splice(insertionIndex, 0, previous);
      }
    } else if (currentIndex >= 0) {
      next.splice(currentIndex, 1);
    }
  }
  return next;
}

/**
 * Build an owner-fenced batch persister for one Library render.
 *
 * On failure, rollback is identity-checked and applies only while the hydration
 * token still belongs to the current auth/cache session.
 */
export function createLibraryBatchPersister({
  ownerId,
  previousSaves,
  detail,
  setDetail,
  setSaves,
  setPersistenceError,
}) {
  return async (updatedSaves, modifiedIds, options = {}) => {
    const hydration = captureSavedSettlementsHydration(useStore.getState(), ownerId);
    if (!hydration) return false;
    try {
      setPersistenceError(null);
      const updates = modifiedIds
        .map(id => updatedSaves.find(entry => String(entry.id) === String(id)))
        .filter(Boolean);
      await savesService.mutateBatch({
        updates,
        deletes: options.deletes || [],
        creates: options.creates || [],
      }, {
        expectedOwnerId: hydration.ownerId,
        isSessionCurrent: () =>
          isCurrentSavedSettlementsHydration(useStore.getState(), hydration),
      });
      return isCurrentSavedSettlementsHydration(useStore.getState(), hydration);
    } catch (error) {
      console.error('Persist failed:', error);
      // The request belonged to an earlier auth/cache session. Its failure is
      // not B's error and its A snapshot must never be rolled into B's library.
      if (!isCurrentSavedSettlementsHydration(useStore.getState(), hydration)) return false;
      const touchedIds = [
        ...modifiedIds,
        ...(options.deletes || []),
        ...(options.creates || []).map(entry => entry?.id),
      ];
      setSaves(rollbackLibraryMutation(
        useStore.getState().savedSettlements || [],
        previousSaves,
        updatedSaves,
        touchedIds,
      ), hydration);
      const openId = detail?.saveData?.id;
      const previousDetail = previousSaves.find(entry => String(entry.id) === String(openId));
      if (openId) {
        setDetail(previousDetail
          ? { ...previousDetail, saveData: previousDetail }
          : null);
      }
      setPersistenceError(t('errors.persistFail'));
      return false;
    }
  };
}

function deletionRefusalText(reason) {
  if (reason === 'advance_paused') {
    return 'Resume or undo the campaign’s paused advance before deleting this settlement.';
  }
  if (reason === 'advance_in_flight') {
    return 'Wait for the campaign advance to finish before deleting this settlement.';
  }
  if (reason === 'settlement_deletion_in_flight') {
    return 'Another settlement deletion is already updating this campaign. Give it a moment.';
  }
  return null;
}

function trackDeletion(save) {
  if (!save) return;
  track(EVENTS.SETTLEMENT_DELETED, {
    canon_phase: canonPhaseOf(save),
    age_days_band: dayGapBand(lastEditedMs(save)),
    had_ai_data: hasAiData(save),
    was_published: !!save.is_public,
  });
}

function removeDeletedSettlementReferences(saves, id) {
  const deletedSave = saves.find(save => String(save.id) === String(id));
  const survivors = saves.filter(save => String(save.id) !== String(id));
  const names = new Set([
    deletedSave?.name,
    deletedSave?.settlement?.name,
  ].filter(Boolean));
  const referencesDeletedSave = neighbour => (
    (neighbour?.id != null && String(neighbour.id) === String(id))
    || names.has(neighbour?.name)
  );

  const updated = survivors.map(save => {
    const network = save.settlement?.neighbourNetwork || [];
    const relationships = save.settlement?.interSettlementRelationships || [];
    if (!network.some(referencesDeletedSave)) return save;

    const cleanNetwork = network.filter(
      neighbour => !referencesDeletedSave(neighbour),
    );
    const cleanRelationships = relationships.filter(
      relationship => !names.has(relationship.partnerSettlement),
    );
    if (
      cleanNetwork.length === network.length
      && cleanRelationships.length === relationships.length
    ) {
      return save;
    }

    return {
      ...save,
      settlement: {
        ...save.settlement,
        neighbourNetwork: cleanNetwork,
        interSettlementRelationships: cleanRelationships,
      },
    };
  });

  return {
    deletedSave,
    updated,
    modifiedIds: updated
      .filter((save, index) => save !== survivors[index])
      .map(save => save.id),
  };
}

/**
 * The rows THE SCRUB moved, by OBJECT IDENTITY against the snapshot this act took
 * before it ran (EM-F3d-b). `scrubDeletedCounterparty` replaces a row it withdraws on
 * and leaves every other one the same object, so identity is an exact reading of what
 * moved; a deep compare would be a second, weaker one. A row the act DELETED is absent
 * from `afterRows` and is therefore never offered back to the batch, and a row the act
 * only removed from a campaign is untouched here because `removeFromCampaign` writes
 * campaigns rather than saves.
 */
function scrubbedRowIds(beforeRows, afterRows) {
  const before = new Map((beforeRows || []).map(row => [String(row?.id), row]));
  return (afterRows || [])
    .filter(row => before.has(String(row?.id)) && before.get(String(row?.id)) !== row)
    .map(row => row.id);
}

/**
 * Build the Library's delete handlers outside SettlementsPanel's max-lines wall.
 * The store lock spans the awaited cloud batch, then the successful ids pass
 * through removeSavedSettlement with that lock token so campaign membership and
 * queued intentions are pruned before another advance can start — and the rows that
 * chokepoint's edge scrub moved go down in one further batch of the SAME act.
 */
export function createLibraryDeleteHandlers({
  ownerId,
  saves,
  detail,
  setDetail,
  setDeleteId,
  setSaves,
  setPersistenceError,
  persistBatch,
}) {
  const runLocked = async (ids, operation) => {
    const hydration = captureSavedSettlementsHydration(useStore.getState(), ownerId);
    if (!hydration) return { ok: false, reason: 'auth_session_changed' };
    const lock = useStore.getState().withSettlementDeletionLock;
    if (typeof lock !== 'function') throw new Error('Settlement deletion lock is unavailable.');
    const result = await lock(ids, lockContext => operation(lockContext, hydration));
    if (!isCurrentSavedSettlementsHydration(useStore.getState(), hydration)) {
      return { ok: false, reason: 'auth_session_changed' };
    }
    const message = result?.ok === false && deletionRefusalText(result.reason);
    if (message) setPersistenceError(message);
    return result;
  };

  /**
   * ⭐ THE CHOKEPOINT, AND THE SCRUB'S DURABLE HALF (EM-F3d-b; U110 — the second half of
   * the verifier's STOP-2, whose first half EM-F3d landed).
   *
   * THE DEFECT, MEASURED. EM-F3d made `removeSavedSettlement` withdraw every PENDING
   * decree that named the row the DM just deleted. This act ran its batch BEFORE that
   * chokepoint, so the batch carried the UN-SCRUBBED registries: the scrub reached the
   * live view and never the store, and a RELOAD re-read a pending decree naming an id
   * that no longer exists — which EM-F3b's claim walk then hands to the next
   * counterparty. Its acceptance line, at the base: the persisted member registry read
   * `['d_far:pending']` where the record read withdrawn.
   *
   * ⛔ WHY THE SCRUB DOES NOT PRECEDE THE BATCH, WHICH IS THE WHOLE CHOICE HERE. A
   * refused batch must leave the record exactly as it found it. A `target_deleted`
   * withdrawal written for a delete that never happened is design §20.3's reason saying
   * something FALSE about a save that is still there — and the OPEN record's registry is
   * `state.settlement.decrees` rather than a library row, so `rollbackLibraryMutation`
   * could not take it back. So the order is: persist the delete, scrub at the chokepoint,
   * then persist what the scrub moved. `deleteScrub.test.js` D8 pins the refused branch.
   *
   * ⛔ THE SCRUB IS AWAITED RATHER THAN RACED. It rides the chokepoint's receipt as a
   * promise because it reaches the edit lane by a dynamic import (that lane is kept out
   * of first paint); awaiting it is what makes the rows read below the finished ones.
   *
   * ⛔ THE SECOND BATCH IS THE SCRUB'S AND NOTHING ELSE'S: only rows whose object identity
   * changed across the chokepoint go into it, so a delete that named nobody sends exactly
   * the one batch it always sent (D7, a golden by copy). Its own refusal is reported by
   * the persister — the same error text and the same operation-scoped rollback — and does
   * not turn a delete that DID happen into a refusal, because `ok` describes the delete.
   */
  const removeSuccessfulIds = async (ids, mutationToken) => {
    const remove = useStore.getState().removeSavedSettlement;
    if (typeof remove !== 'function') throw new Error('Settlement deletion action is unavailable.');
    const beforeScrub = useStore.getState().savedSettlements || [];
    const scrubs = [];
    for (const id of ids) {
      const result = remove(id, { mutationToken });
      if (result?.ok === false) return result;
      scrubs.push(result?.scrubbed);
    }
    await Promise.all(scrubs);
    const afterScrub = useStore.getState().savedSettlements || [];
    const scrubbedIds = scrubbedRowIds(beforeScrub, afterScrub);
    if (scrubbedIds.length > 0) await persistBatch(afterScrub, scrubbedIds);
    return { ok: true };
  };

  const deleteConfirmed = (id) => runLocked([id], async ({ mutationToken }, hydration) => {
    const {
      deletedSave,
      updated,
      modifiedIds,
    } = removeDeletedSettlementReferences(saves, id);
    trackDeletion(deletedSave);
    if (setSaves(updated, hydration) === false) {
      return { ok: false, reason: 'auth_session_changed' };
    }
    setDeleteId(null);
    if (
      detail?.saveData?.id != null
      && String(detail.saveData.id) === String(id)
    ) {
      setDetail(null);
    }
    const persisted = await persistBatch(updated, modifiedIds, { deletes: [id] });
    if (!isCurrentSavedSettlementsHydration(useStore.getState(), hydration)) {
      return { ok: false, reason: 'auth_session_changed' };
    }
    if (!persisted) {
      return { ok: false, reason: 'persist_failed' };
    }
    return removeSuccessfulIds([id], mutationToken);
  });

  const bulkDeleteConfirmed = (ids) => runLocked(ids, async ({ mutationToken }, hydration) => {
    const selected = new Set(ids.map(String));
    saves.filter(save => selected.has(String(save.id))).forEach(trackDeletion);
    const { remaining, modifiedIds } = computeBulkDelete(saves, ids);
    if (setSaves(remaining, hydration) === false) {
      return { ok: false, reason: 'auth_session_changed' };
    }
    if (
      detail?.saveData?.id
      && selected.has(String(detail.saveData.id))
    ) {
      setDetail(null);
    }
    const persisted = await persistBatch(remaining, modifiedIds, { deletes: ids });
    if (!isCurrentSavedSettlementsHydration(useStore.getState(), hydration)) {
      return { ok: false, reason: 'auth_session_changed' };
    }
    if (!persisted) {
      return { ok: false, reason: 'persist_failed' };
    }
    return removeSuccessfulIds(ids, mutationToken);
  });

  return { deleteConfirmed, bulkDeleteConfirmed };
}
