import { createContext, useContext } from 'react';

/**
 * DossierEntityContext — carries the live entity index and the navigator down
 * to any dossier surface that renders an {@link EntityLink} or a focus-aware
 * card, without prop-drilling through every tab.
 *
 * Provided once by OutputContainer (it owns the active settlement and the tab
 * state the navigator drives). Consumers read it via {@link useDossierEntities}.
 *
 * Shape:
 *   index            — buildDossierEntityIndex(settlement) result, or null.
 *   navigateToEntity — (id) => void; switches tab + focuses + scrolls. No-op
 *                      when the id is unknown or the target tab is gated out.
 *
 * The default is a safe no-op so a stray <EntityLink> rendered outside a
 * dossier (Storybook, an isolated test) degrades to plain text rather than
 * throwing.
 *
 * @type {import('react').Context<{ index: object|null, navigateToEntity: (id: string) => void }>}
 */
export const DossierEntityContext = createContext({
  index: null,
  navigateToEntity: () => {},
});

/** Read the dossier entity index + navigator from context. */
export function useDossierEntities() {
  return useContext(DossierEntityContext);
}
