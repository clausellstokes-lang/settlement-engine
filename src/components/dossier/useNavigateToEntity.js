import { useCallback, useMemo } from 'react';
import { useStore } from '../../store/index.js';
import { buildDossierEntityIndex } from '../../domain/dossier/entityLinks.js';

/**
 * Build the dossier hyperlink context value for a settlement: the id->entity
 * index plus `navigateToEntity(id)`, ready to drop into
 * DossierEntityContext.Provider.
 *
 * `navigateToEntity` drives a link click end to end: resolve the id against the
 * live index, switch to the owning tab, mark the entity focused (so that tab
 * opens its matching card), then scroll the anchor into view. The mechanism
 * mirrors the proven CompendiumPanel.handleGlobalSelect pattern (set tab ->
 * mark target -> scroll after mount). The destination card also scrolls itself
 * from its own focus effect once it mounts, so a heavy lazy tab that has not
 * painted by the timeout still lands.
 *
 * @param {object|null} settlement     The settlement driving the tabs.
 * @param {(id: string, via?: string) => void} setActiveTab  OutputContainer's tab setter.
 * @param {{ id: string }[]} [tabs]     The tabs present for this settlement; a
 *        navigation to a gated-out tab is a no-op.
 * @returns {{ index: object, navigateToEntity: (id: string) => void }}
 */
export function useDossierEntityNav(settlement, setActiveTab, tabs = []) {
  const focusEntity = useStore(s => s.focusEntity);
  const index = useMemo(() => buildDossierEntityIndex(settlement || {}), [settlement]);

  const navigateToEntity = useCallback((id) => {
    const entry = index.resolve(id);
    if (!entry) return; // unknown id -> no-op (rename-safe: ids are stable)
    if (!tabs.some(t => t.id === entry.tab)) return; // tab gated out -> no-op

    setActiveTab(entry.tab, 'entity_link');
    focusEntity(id);

    // Belt-and-braces scroll for an already-mounted tab; the card's own focus
    // effect is the reliable path. Matches CompendiumPanel's ~140ms heuristic.
    if (typeof document !== 'undefined' && entry.anchor) {
      setTimeout(() => {
        document.getElementById(entry.anchor)?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
      }, 140);
    }
  }, [index, tabs, setActiveTab, focusEntity]);

  return useMemo(() => ({ index, navigateToEntity }), [index, navigateToEntity]);
}
