/**
 * Owner-scoped bridge between the shared saved-settlement cache and React.
 *
 * The Zustand cache is process-wide, but a Library render belongs to one auth
 * session. This hook gives every read and write an owner/generation token so a
 * late response from account A cannot paint into account B—or into a later
 * login for account A. It owns hydration and render-state fencing; save
 * persistence remains in lib/saves.js.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { saves as savesService } from '../lib/saves.js';
import { useStore } from '../store/index.js';
import {
  captureSavedSettlementsHydration,
  isCurrentSavedSettlementsHydration,
  normalizeSavedSettlementsOwnerId,
} from '../store/savedSettlementsHydration.js';

const EMPTY_SAVES = Object.freeze([]);

/**
 * Populate the shared cache for a surface that only needs store-backed saves.
 *
 * Unlike useOwnerScopedSaves, this does not maintain a private render copy or
 * clear the cache on mount. The hydration token is sufficient: a late response
 * can update the shared store only while the same owner/generation is current.
 *
 * @param {string|number|null|undefined} ownerId
 */
export function useEnsureSavedSettlementsLoaded(ownerId) {
  const owner = normalizeSavedSettlementsOwnerId(ownerId);
  const savesLoaded = useStore(state => state.savedSettlementsLoaded);
  const setSavedSettlements = useStore(state => state.setSavedSettlements);

  useEffect(() => {
    if (savesLoaded) return;

    const hydration = captureSavedSettlementsHydration(useStore.getState(), owner);
    if (!hydration) return;

    savesService.list()
      .then(rows => {
        setSavedSettlements(rows, hydration);
      })
      .catch(error => {
        if (isCurrentSavedSettlementsHydration(useStore.getState(), hydration)) {
          console.error('[saved settlements] Hydration failed:', error);
        }
      });
  }, [owner, savesLoaded, setSavedSettlements]);
}

/**
 * Keep the shared save cache and the Library's render rows scoped to one owner.
 * Late list responses carry the store's owner/generation token, while the local
 * owner key prevents even a transient paint of the previous account.
 * @param {string|number|null|undefined} ownerId
 * @param {{onOwnerBoundary?:()=>void, onLoadError?:(error:unknown)=>void}} [options]
 */
export function useOwnerScopedSaves(ownerId, { onOwnerBoundary, onLoadError } = {}) {
  const owner = normalizeSavedSettlementsOwnerId(ownerId);
  const setSavedSettlements = useStore(state => state.setSavedSettlements);
  const clearSavedSettlements = useStore(state => state.clearSavedSettlements);
  const cacheOwnerId = useStore(state => state.savedSettlementsOwnerId);
  const cacheGeneration = useStore(state => state.savedSettlementsHydrationGeneration);
  const [library, setLibrary] = useState(() => ({ owner, rows: EMPTY_SAVES }));
  const saves = library.owner === owner ? library.rows : EMPTY_SAVES;
  const [savesLoading, setSavesLoading] = useState(true);
  const ownerRef = useRef(owner);

  useEffect(() => {
    ownerRef.current = owner;
  }, [owner]);

  const commitSaves = useCallback((rows, hydration) => {
    if (!hydration) return false;
    if (setSavedSettlements(rows, hydration) === false) return false;
    if (ownerRef.current === normalizeSavedSettlementsOwnerId(hydration.ownerId)) {
      setLibrary({ owner: hydration.ownerId, rows });
    }
    return true;
  }, [setSavedSettlements]);

  // Every callback handed to a consumer carries the cache session from the
  // render that created it. A callback retained by an A operation therefore
  // cannot become an implicit/tokenless write into B (or a later A session).
  const renderHydration = useMemo(() => {
    const cacheOwner = normalizeSavedSettlementsOwnerId(cacheOwnerId);
    if (cacheOwner !== owner) return null;
    return {
      ownerId: normalizeSavedSettlementsOwnerId(owner),
      generation: Number(cacheGeneration) || 0,
    };
  }, [cacheGeneration, cacheOwnerId, owner]);

  const setSaves = useCallback(
    (rows, hydration = renderHydration) => commitSaves(rows, hydration),
    [commitSaves, renderHydration],
  );

  useEffect(() => useStore.subscribe(
    state => ({
      ownerId: state.savedSettlementsOwnerId,
      rows: state.savedSettlements,
    }),
    snapshot => {
      if (
        normalizeSavedSettlementsOwnerId(snapshot.ownerId)
        === normalizeSavedSettlementsOwnerId(ownerRef.current)
      ) {
        setLibrary({
          owner: normalizeSavedSettlementsOwnerId(snapshot.ownerId),
          rows: snapshot.rows || EMPTY_SAVES,
        });
      }
    },
  ), [owner]);

  /**
   * Refresh the shared cache for the owner captured when the request starts.
   *
   * The resolved rows are returned for callers that need to await the fetch,
   * even when a later auth boundary prevents those rows from being committed.
   * The shared cache—not the return value—remains the source of rendered truth.
   */
  const reloadSaves = useCallback(async () => {
    const requestOwner = ownerRef.current;
    const hydration = captureSavedSettlementsHydration(useStore.getState(), requestOwner);
    if (!hydration) return EMPTY_SAVES;
    const rows = await savesService.list();
    if (ownerRef.current === requestOwner) commitSaves(rows, hydration);
    return rows;
  }, [commitSaves]);

  useEffect(() => {
    let cancelled = false;
    /* eslint-disable react-hooks/set-state-in-effect -- owner boundary starts a new cache load */
    clearSavedSettlements(owner);
    setLibrary({ owner, rows: EMPTY_SAVES });
    setSavesLoading(true);
    onOwnerBoundary?.();
    /* eslint-enable react-hooks/set-state-in-effect */

    const hydration = captureSavedSettlementsHydration(useStore.getState(), owner);
    if (!hydration) {
      return () => {
        cancelled = true;
      };
    }

    savesService.list()
      .then(rows => {
        if (!cancelled && ownerRef.current === owner && commitSaves(rows, hydration) !== false) {
          setSavesLoading(false);
        }
      })
      .catch(error => {
        if (
          cancelled
          || ownerRef.current !== owner
          || !isCurrentSavedSettlementsHydration(useStore.getState(), hydration)
        ) return;
        onLoadError?.(error);
        setSavesLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [clearSavedSettlements, commitSaves, onLoadError, onOwnerBoundary, owner]);

  return { reloadSaves, saves, savesLoading, setSaves };
}
