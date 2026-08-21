import { useEffect, useRef } from 'react';

/**
 * useCrossSettlementFocus — land a CROSS-SETTLEMENT inspector-link navigation on
 * the right tab + card once this dossier mounts (INSPECTOR-ADDRESS-WEB, owner
 * 2026-07-22).
 *
 * A Realm Inspector link sets the store-side `focusedEntity` and routes to the
 * target settlement, but `focusEntity` is stamped BEFORE the destination dossier
 * mounts and its `setActiveTab` is component-local — so nothing switches the tab.
 * The in-dossier link path (useDossierEntityNav.navigateToEntity) does the
 * tab-switch itself; the cross-settlement path arrives with only `focusedEntity`.
 * This hook closes that gap: when the focused id resolves in THIS settlement's
 * index and owns a present tab, it switches to it and scrolls the anchor —
 * WITHOUT re-stamping `focusEntity` (which would loop). A handled-`ts` ref (keyed
 * by the open save) fires it exactly once per focus event; an in-dossier click
 * (already on the right tab) makes it a no-op.
 *
 * @param {object} args
 * @param {{ id?: string, ts?: number }|null} args.focusedEntity  uiSlice focus target.
 * @param {{ resolve?: (id: string) => ({ tab?: string, anchor?: string }|null) }|null} args.index  the dossier entity index.
 * @param {{ id: string }[]} args.allTabs  the tabs present for this settlement.
 * @param {string|number|null|undefined} args.saveId  the open save id (guard key).
 * @param {string} args.activeTab  the currently-active tab id.
 * @param {(id: string, via?: string) => void} args.setActiveTab  the tab setter.
 */
export function useCrossSettlementFocus({ focusedEntity, index, allTabs, saveId, activeTab, setActiveTab }) {
  const handledRef = useRef('');
  useEffect(() => {
    const fe = focusedEntity;
    if (!fe?.id) return;
    const guard = `${saveId ?? ''}:${fe.ts}`;
    if (handledRef.current === guard) return;
    const entry = index?.resolve?.(fe.id);
    if (!entry || !allTabs.some(t => t.id === entry.tab)) return; // not here yet / gated -> wait
    handledRef.current = guard;
    if (entry.tab !== activeTab) setActiveTab(entry.tab, 'entity_link');
    if (typeof document !== 'undefined' && entry.anchor) {
      setTimeout(() => {
        if (typeof document === 'undefined') return;
        document.getElementById(entry.anchor)?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
      }, 160);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- activeTab intentionally read, not depended, to avoid re-firing on unrelated tab clicks; setActiveTab is a stable-enough local.
  }, [focusedEntity, index, allTabs, saveId]);
}
