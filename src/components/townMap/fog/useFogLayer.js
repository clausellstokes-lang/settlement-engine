/**
 * components/townMap/fog/useFogLayer — DOOR 2 the pane's fog wiring, extracted.
 *
 * Bundles the whole fog integration the SettlementMapPane needs into ONE hook so the pane (a
 * MAX-LINES-capped hot file) grows by a single call, not a block of wiring (the "lazy leaf +
 * re-export" rule). Owns: the store persist action, the OPTIMISTIC fogSessions mirror (the
 * mapEdits idiom — re-derives instantly while applyFogEdit persists the blob truth, re-seeded
 * on a settlement change), the single commitFog writer (normalize ⇒ dormancy), and the
 * reveal-brush/session controller. Returns the controller the pane threads to the overlay,
 * the brush capture, and the DM chrome.
 */
import { useCallback, useState } from 'react';
import { useStore } from '../../../store/index.js';
import { readFogSessions, normalizeFogSessions } from '../../../domain/townMap/fogSessions.js';
import { useMapFog } from './useMapFog.js';

/**
 * @param {{
 *   settlement: any, settlementKey: any, model: any, editing: boolean,
 *   saveId: string|number|null,
 *   wrapperRef: import('react').MutableRefObject<HTMLElement|null>,
 *   transformRef: import('react').MutableRefObject<any>,
 *   fire: (feature: string, props?: Record<string, unknown>) => void,
 * }} deps
 */
export function useFogLayer({ settlement, settlementKey, model, editing, saveId, wrapperRef, transformRef, fire }) {
  const applyFogEdit = useStore((s) => s.applyFogEdit);
  const [fogSessions, setFogSessions] = useState(() => readFogSessions(settlement));
  // Re-seed the optimistic mirror when a DIFFERENT settlement is opened (the pane's
  // adjust-state-on-prop-change pattern, keyed on the stable settlement id).
  const [seededKey, setSeededKey] = useState(settlementKey);
  if (seededKey !== settlementKey) {
    setSeededKey(settlementKey);
    setFogSessions(readFogSessions(settlement));
  }

  const commitFog = useCallback((next) => {
    const norm = normalizeFogSessions(next);
    setFogSessions(norm);
    if (saveId != null && typeof applyFogEdit === 'function') applyFogEdit(saveId, norm);
  }, [saveId, applyFogEdit]);

  return useMapFog({
    fogSessions, model, editing, commitFog, wrapperRef, transformRef,
    onReveal: (kind) => fire('fog_reveal', { kind }),
    onSession: (count) => fire('fog_session', { count }),
  });
}
