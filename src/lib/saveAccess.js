/**
 * saveAccess.js — the save row's ACCESS state, and THE ONE PLACE A QUOTA COUNT OVER
 * THE LIBRARY'S SAVES IS COMPUTED.
 *
 * ⭐ EM-F1b — A HIDDEN PHANTOM DOES NOT SPEND A SAVE SLOT (the owner's decision,
 * 2026-09-23). EM-F1 mints a phantom counterparty as a MINIMAL SAVE: a real row whose
 * blob carries `kind: 'phantom'`, which the library shelf hides at the head of its
 * filter pipeline (`applyLibraryFilters`). A row the viewer can never see must not
 * consume a slot the viewer is sold, so `activeSaveCount` — the one counter every
 * quota surface reads — excludes it. The exclusion lives HERE, at the count, and at no
 * caller: a per-caller filter is the hand-copied gate this estate keeps curing.
 *
 * ⛔ THE CAP ITSELF DOES NOT MOVE. `TIER_GATE.maxSaves` (store/authSlice.js) is
 * untouched, and so is every sentence derived from it — `TIER_FACTS.free.saveLimit`,
 * the meter's "N of 3 saves left", the account card's "{activeSaves} / {maxSaves}".
 * Those sentences promise a number of settlements the user SAVES AND CAN OPEN; a
 * phantom is neither, so none of them becomes less true. The free tier gets no extra
 * visible slot out of this — it stops losing one to a row it cannot reach.
 */

export const ACTIVE_SAVE_STATE = 'active';
export const INACTIVE_PLAN_SAVE_STATE = 'inactive_plan';
export const PENDING_DELETE_SAVE_STATE = 'pending_delete';

/**
 * EM-F1's record discriminant, SPELLED HERE RATHER THAN IMPORTED — a measurement, not a
 * preference, and both halves of it were executed before this line was written:
 *
 *   1. `src/domain/edit/phantoms.js` carries an EXACT importer roster, asserted
 *      set-equal in both directions by `tests/domain/phantoms.test.js` arm A12 at ONE
 *      row (the library shelf). A runtime import from this module would red an arm this
 *      member does not own.
 *   2. This module is EAGER: `src/lib/saves.js` is in the first-paint static closure and
 *      imports it, so an edge from here drags the leaf into the first-paint bundle and
 *      turns a hidden-save policy into a byte question nobody priced.
 *
 * The duplicate spelling is therefore forced, and it is JOINED rather than trusted:
 * `tests/store/phantomQuota.test.js` imports EM-F1's own `PHANTOM_KIND` and asserts the
 * two words are the same string, and runs both predicates over one row corpus asserting
 * they agree row for row. A rename on either side convicts there.
 */
export const PHANTOM_SAVE_KIND = 'phantom';

export function saveAccessState(save) {
  return save?.accessState || save?.access_state || ACTIVE_SAVE_STATE;
}

export function isSaveActive(save) {
  return saveAccessState(save) === ACTIVE_SAVE_STATE;
}

export function isPlanInactiveSave(save) {
  return saveAccessState(save) === INACTIVE_PLAN_SAVE_STATE;
}

/**
 * A library row is a PHANTOM iff its BLOB carries the discriminant as an OWN property —
 * the same reading as EM-F1's `isPhantomSave`, which resolves the row through
 * `isPhantomRecord`. The envelope says nothing about the world inside it, so the blob is
 * the only place the question can be asked.
 *
 * ⚠ A BLOB-LESS ROW READS FALSE, AND THAT IS THE F42 BOUNDARY. The metadata projection
 * (`saves.listMeta`) nulls `settlement` deliberately, so a meta row cannot be classified
 * and would count. No live counter reads meta rows today — the projection has zero grid
 * consumers by design — and the arm `tests/store/phantomQuota.test.js` pins that
 * boundary so the grid adoption must hydrate the blob or carry the discriminant.
 *
 * @param {unknown} save a library save row
 * @returns {boolean}
 */
export function isPhantomSave(save) {
  const blob = /** @type {{ settlement?: unknown }} */ (save)?.settlement;
  if (!blob || typeof blob !== 'object' || Array.isArray(blob)) return false;
  return Object.hasOwn(blob, 'kind')
    && /** @type {{ kind?: unknown }} */ (blob).kind === PHANTOM_SAVE_KIND;
}

/**
 * THE QUOTA COUNT. Every surface that measures the library against `maxSaves` reads this
 * one function: the meter's `used` (SettlementsPanel `activeSlotsUsed`), the account
 * card's `activeSaves`, the import pre-flight's `used` (store/accountImportBody.js), the
 * reactivation slot check, and the save service's own `count()` on the local backend.
 *
 * A row counts iff the viewer can both HOLD it (active) and REACH it (not hidden). The
 * two filters compose: an inactive phantom is excluded once for each reason.
 *
 * @param {ReadonlyArray<unknown>|null|undefined} saves
 * @returns {number}
 */
export function activeSaveCount(saves) {
  return (saves || []).filter(save => isSaveActive(save) && !isPhantomSave(save)).length;
}

/**
 * The RETENTION count, deliberately unchanged by EM-F1b: it answers "how many rows is
 * this account holding past their active life", which is a storage fact rather than a
 * quota, and it is displayed beside the quota card ("N inactive retained") rather than
 * inside it. A minted phantom is active, so it does not reach this counter today.
 */
export function inactiveRetentionCount(saves) {
  return (saves || []).filter(save => !isSaveActive(save)).length;
}
