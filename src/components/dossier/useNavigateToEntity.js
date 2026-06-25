import { useCallback, useEffect, useMemo, useRef } from 'react';
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

  // Both `setActiveTab` and `tabs` arrive fresh-every-render from
  // OutputContainer (an unmemoized closure + an array rebuilt each render). If
  // navigateToEntity depended on them raw, its identity — and therefore the
  // {index, navigateToEntity} context value — would change every render, and
  // the EntityLink consumers nested under DossierEntityContext.Provider would
  // re-render unboundedly (React #185, max update depth) the moment narrative
  // prose mounts. We stabilize both inputs so the memo only changes when the
  // settlement or the actual SET of tab ids changes.

  // Keep the latest setActiveTab in a ref and expose a stable wrapper, so a
  // new closure each render doesn't perturb navigateToEntity's identity. The
  // ref is synced in an effect (after commit) rather than during render — a
  // navigation can only fire from a user click, which is always after the
  // latest commit, so the wrapper never calls a stale setter in practice.
  const setActiveTabRef = useRef(setActiveTab);
  useEffect(() => { setActiveTabRef.current = setActiveTab; }, [setActiveTab]);
  const stableSetActiveTab = useCallback((id, via) => setActiveTabRef.current(id, via), []);

  // Collapse the tabs array to a stable signature of its id set; only a real
  // change to which tabs are present re-derives the callback.
  const tabIdSignature = useMemo(() => tabs.map(t => t.id).join('|'), [tabs]);

  const navigateToEntity = useCallback((id) => {
    const entry = index.resolve(id);
    if (!entry) return; // unknown id -> no-op (rename-safe: ids are stable)
    if (!tabIdSignature.split('|').includes(entry.tab)) return; // tab gated out -> no-op

    stableSetActiveTab(entry.tab, 'entity_link');
    focusEntity(id);

    // Belt-and-braces scroll for an already-mounted tab; the card's own focus
    // effect is the reliable path. Matches CompendiumPanel's ~140ms heuristic.
    if (typeof document !== 'undefined' && entry.anchor) {
      setTimeout(() => {
        document.getElementById(entry.anchor)?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
      }, 140);
    }
  }, [index, tabIdSignature, stableSetActiveTab, focusEntity]);

  return useMemo(() => ({ index, navigateToEntity }), [index, navigateToEntity]);
}
