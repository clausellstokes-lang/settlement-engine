import { createContext, useContext } from 'react';

/**
 * RealmEntityContext — the realm analogue of DossierEntityContext. Carries the
 * realm-wide entity web (buildRealmEntityWeb) and the CROSS-SETTLEMENT navigator
 * down to any inspector surface that renders a {@link RealmEntityLink} or an
 * {@link AddressChain}, without prop-drilling through every panel.
 *
 * Provided per-panel by the panel's useRealmEntityNav() hook (the inspector has
 * no single shared provider host — each lazy section owns its own subtree). A
 * link rendered outside any provider degrades to plain text via the safe no-op
 * default, exactly like the dossier context.
 *
 * Shape:
 *   web                    — buildRealmEntityWeb(savedSettlements) result, or null.
 *   navigateToRealmEntity  — ({ settlementSaveId, entityId }) => void; opens that
 *                            settlement's dossier, then focuses the card. No-op on
 *                            a null target.
 *
 * @type {import('react').Context<{ web: object|null, navigateToRealmEntity: (target: { settlementSaveId: string|number, entityId?: string|null }) => void }>}
 */
export const RealmEntityContext = createContext({
  web: null,
  navigateToRealmEntity: () => {},
});

/** Read the realm entity web + cross-settlement navigator from context. */
export function useRealmEntities() {
  return useContext(RealmEntityContext);
}
