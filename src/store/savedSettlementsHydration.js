/**
 * savedSettlementsHydration.js — owner-scoped saved-settlement hydration.
 *
 * Several lazy surfaces share the same cache and can have savesService.list()
 * in flight when auth changes. An owner id alone is not enough: signing out and
 * back into the same account is still a cache boundary. The generation changes
 * whenever the cache is cleared, making every older response stale.
 */

/**
 * @typedef {{
 *   ownerId: string|null,
 *   generation: number,
 * }} SavedSettlementsHydration
 */

/** Normalize persisted owner identifiers without inventing an anonymous sentinel. */
export function normalizeSavedSettlementsOwnerId(ownerId) {
  return ownerId == null ? null : String(ownerId);
}

/**
 * Capture the owner and cache generation that an asynchronous load may commit.
 *
 * A caller that names an owner other than the cache's current owner receives
 * null and must not start or commit that hydration.
 *
 * @returns {SavedSettlementsHydration|null}
 */
export function captureSavedSettlementsHydration(state, expectedOwnerId) {
  const ownerId = normalizeSavedSettlementsOwnerId(expectedOwnerId);
  if (normalizeSavedSettlementsOwnerId(state?.savedSettlementsOwnerId) !== ownerId) {
    return null;
  }
  return {
    ownerId,
    generation: Number(state?.savedSettlementsHydrationGeneration) || 0,
  };
}

/** True when a hydration token still belongs to the active cache generation. */
export function isCurrentSavedSettlementsHydration(state, hydration) {
  if (!hydration || typeof hydration !== 'object') {
    return false;
  }

  return (
    normalizeSavedSettlementsOwnerId(state?.savedSettlementsOwnerId)
      === normalizeSavedSettlementsOwnerId(hydration.ownerId)
    && (Number(state?.savedSettlementsHydrationGeneration) || 0)
      === (Number(hydration.generation) || 0)
  );
}

/**
 * Commit an asynchronous load only if its optional hydration token is current.
 *
 * The return value tells callers whether the store accepted or rejected the
 * response; a rejected response leaves both the rows and loaded flag untouched.
 */
export function commitSavedSettlementsHydration(set, settlements, hydration = null) {
  let committed = false;

  set(state => {
    if (hydration && !isCurrentSavedSettlementsHydration(state, hydration)) {
      return;
    }

    state.savedSettlements = settlements || [];
    state.savedSettlementsLoaded = true;
    committed = true;
  });

  return committed;
}

/**
 * Clear saved-settlement state and invalidate every outstanding hydration.
 *
 * Passing nextOwnerId crosses an auth boundary; omitting it preserves the
 * current cache owner for an ordinary same-session refresh.
 */
export function clearSavedSettlementsCache(set, nextOwnerId = undefined) {
  set(state => {
    state.savedSettlements = [];
    state.savedSettlementsLoaded = false;

    if (nextOwnerId !== undefined) {
      state.savedSettlementsOwnerId = normalizeSavedSettlementsOwnerId(nextOwnerId);
    }

    state.savedSettlementsHydrationGeneration += 1;
    state.activeSaveId = null;
  });
}
