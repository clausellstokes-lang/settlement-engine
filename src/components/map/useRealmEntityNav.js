import { useCallback, useMemo } from 'react';

import { useStore } from '../../store/index.js';
import { navigate } from '../../hooks/useRoute.js';
import { buildRealmEntityWeb } from '../../domain/dossier/realmEntityWeb.js';

/**
 * Build the realm hyperlink context value: the id→entity web over the campaign's
 * saved settlements, plus `navigateToRealmEntity` — the CROSS-SETTLEMENT move the
 * owner asked for (2026-07-22): clicking an entity in the Realm Inspector opens
 * that entity's card in ITS settlement's dossier, even when a different (or no)
 * settlement is currently open.
 *
 * The move chains the app's existing bridges, adding no new store shape:
 *   1. focusEntity(entityId)                    — the remount-surviving, ts-stamped
 *      dossier focus target (uiSlice) the destination dossier honors when it
 *      mounts (OutputContainer switches to the focused entity's tab + scrolls its
 *      card).
 *   2. setSelectedSettlementId(saveId)          — the mapSlice cross-view "open
 *      settlement X" signal, kept in step so the map's selection stays honest.
 *   3. navigate('settlements', { params:{ id }})— route to the settlement's DEEP
 *      LINK (/settlements/:id). SettlementsPanel's route→detail effect opens the
 *      matching save even when another dossier is already open (it keys on the
 *      route, not a first-mount guard), so this works from the realm view AND
 *      from inside a different settlement's dossier.
 *
 * The web is memoized on the savedSettlements reference and indexes each
 * settlement lazily on first resolve, so a render costs nothing until a link is
 * actually followed.
 *
 * @returns {{ web: object, navigateToRealmEntity: (target: { settlementSaveId: string|number, entityId?: string|null }) => void }}
 */
export function useRealmEntityNav() {
  const saves = useStore(s => s.savedSettlements);
  const setSelectedSettlementId = useStore(s => s.setSelectedSettlementId);
  const focusEntity = useStore(s => s.focusEntity);

  const web = useMemo(() => buildRealmEntityWeb(saves || []), [saves]);

  const navigateToRealmEntity = useCallback((target) => {
    const saveId = target?.settlementSaveId;
    if (saveId == null) return; // no addressable settlement -> no-op (degrade)
    // Focus BEFORE the route change so the store target is in place when the
    // destination dossier mounts and reads it.
    if (target?.entityId) focusEntity(target.entityId);
    setSelectedSettlementId(saveId);
    navigate('settlements', { params: { id: String(saveId) } });
  }, [setSelectedSettlementId, focusEntity]);

  return useMemo(() => ({ web, navigateToRealmEntity }), [web, navigateToRealmEntity]);
}
