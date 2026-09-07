/**
 * settlementPendingEditActions.js — the store-facing pending-edit facade.
 *
 * The public actions stay stable here while payload schemas, transaction
 * coordination, and the application command runtime remain lazy. This keeps the
 * settlement slice focused on settlement state instead of repeating a second
 * pending-edit coordinator.
 */

import { revertEdit } from '../domain/pendingEdits.js';

/** @typedef {() => any} StoreGet */
/** @typedef {(recipe:(state:any) => void) => void} StoreSet */

/** @type {any} */
let pendingEditModule = null;
/** @type {Promise<any>|null} */
let pendingEditPromise = null;

function loadPendingEditModule() {
  if (pendingEditModule) return Promise.resolve(pendingEditModule);
  if (!pendingEditPromise) {
    pendingEditPromise = import('./settlementPendingEdits.js').then((module) => {
      pendingEditModule = module;
      return module;
    });
  }
  return pendingEditPromise;
}

/** The current save/draft namespace; this is not account ownership. */
function currentOwnerKey(state) {
  if (!state?.settlement) return null;
  if (state.activeSaveId != null) return `save:${String(state.activeSaveId)}`;
  const settlementRef = state.settlement.id
    ?? state.generationId
    ?? 'current-draft';
  return `draft:${String(settlementRef)}`;
}

function ownerChangedResult(fields) {
  return {
    ok: false,
    status: 'owner-changed',
    ...fields,
  };
}

/** @param {StoreSet} set @param {StoreGet} get */
export async function queuePendingEditAction(set, get, kind, payload) {
  const invokedOwner = currentOwnerKey(get());
  const { queuePendingEdit } = await loadPendingEditModule();
  if (currentOwnerKey(get()) !== invokedOwner) return null;
  return queuePendingEdit(get, set, kind, payload);
}

/** @param {StoreSet} set @param {StoreGet} get */
export function revertSinglePendingEditAction(set, get, editId) {
  const state = get();
  const ownerKey = currentOwnerKey(state);
  const ownsIntent = (state.pendingEditsQueue || []).some((intent) => (
    String(intent?.id) === String(editId)
    && intent?.ownerRef?.id === ownerKey
  ));
  if (!ownsIntent) return false;
  set((draft) => {
    draft.pendingEditsQueue = revertEdit(
      draft.pendingEditsQueue || [],
      editId,
    );
  });
  import('../lib/analytics.js').then(({ track, EVENTS }) => {
    track(EVENTS.EDIT_REVERTED, { count: 1, scope: 'single' });
  }).catch(() => {});
  return true;
}

/** @param {StoreSet} set @param {StoreGet} get */
export async function discardPendingEditsAction(set, get, selection) {
  const invokedOwner = currentOwnerKey(get());
  const { discardPendingEditScope } = await loadPendingEditModule();
  if (currentOwnerKey(get()) !== invokedOwner) {
    return ownerChangedResult({ discarded: [] });
  }
  return discardPendingEditScope(get, set, selection);
}

/** @param {StoreSet} set @param {StoreGet} get */
export async function commitPendingEditsAction(set, get, selection) {
  const invokedOwner = currentOwnerKey(get());
  const {
    commitPendingEditScope,
    pendingEditCommandScope,
  } = await loadPendingEditModule();
  if (currentOwnerKey(get()) !== invokedOwner) {
    return ownerChangedResult({ applied: [], failed: [], receipts: [] });
  }
  const scope = pendingEditCommandScope(get(), selection);
  // An empty submit has no command identity and remains a transaction no-op.
  if (!scope?.intentIds?.length) {
    return commitPendingEditScope(get, set, selection);
  }
  const { runPendingEditCommitCommand } = await import(
    '../application/commands/pendingEditCommitRuntime.js'
  );
  return runPendingEditCommitCommand(scope, {
    journalScope: get,
    readContext: () => ({
      ownerKey: currentOwnerKey(get()),
      saveId: get().activeSaveId,
      revision: scope.revision,
      sourceFingerprint: scope.sourceFingerprint,
    }),
    commit: (exactSelection) => (
      commitPendingEditScope(get, set, exactSelection)
    ),
  });
}

/** @param {StoreSet} set @param {StoreGet} get */
export async function refreshPendingEditsAction(set, get, selection) {
  const invokedOwner = currentOwnerKey(get());
  const { refreshPendingEditScope } = await loadPendingEditModule();
  if (currentOwnerKey(get()) !== invokedOwner) {
    return ownerChangedResult({ refreshed: [], failed: [] });
  }
  return refreshPendingEditScope(get, set, selection);
}
