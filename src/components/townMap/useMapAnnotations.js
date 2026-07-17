/**
 * components/townMap/useMapAnnotations — SM-5 (5) the DM pin/annotation controller.
 *
 * Extracted from SettlementMapPane (the hot-file rule). Owns the annotate-mode state,
 * the click-to-place composer state, the screen→map coordinate conversion, and the
 * commit calls (withAnnotation / withoutAnnotationAt through the pane's single
 * commitEdits writer). Pure interaction wiring; the persisted markers ride
 * mapEdits.annotations, so they survive every lifecycle path like any cosmetic edit.
 *
 * ENTITLEMENT SEAM (owner-pending ladder ruling): annotation EDITING is gated by the
 * pane's existing `editing` predicate (canEdit + saveId + desktop — the same gate all
 * cosmetic map edits use). Viewing markers is free (they ride the blob). The final
 * free/premium split for DM markers is ONE predicate away — it lives in whatever feeds
 * `editing`/`canEdit`; this module adds no new gate class.
 */
import { useCallback, useMemo, useState } from 'react';
import { readAnnotations, withAnnotation, withoutAnnotationAt } from '../../domain/townMap/mapEdits.js';

const clamp01k = (v) => (v < 0 ? 0 : v > 1000 ? 1000 : v);

/**
 * @param {{
 *   mapEdits: import('../../domain/townMap/mapEdits.js').MapEdits | null,
 *   editing: boolean,
 *   commitEdits: (next: import('../../domain/townMap/mapEdits.js').MapEdits | null) => void,
 *   wrapperRef: import('react').MutableRefObject<HTMLElement|null>,
 *   transformRef: import('react').MutableRefObject<{ tx:number, ty:number, scale:number, width:number, height:number }>,
 * }} deps
 */
export function useMapAnnotations({ mapEdits, editing, commitEdits, wrapperRef, transformRef }) {
  const [annotateMode, setAnnotateMode] = useState(false);
  const [composing, setComposing] = useState(null);
  const annotations = useMemo(() => readAnnotations(mapEdits), [mapEdits]);

  // Annotate mode only lives while editing; a non-editor never composes.
  const active = editing && annotateMode;

  /** Screen point → map units (invert the pane's pan/zoom transform). */
  const toMapCoords = useCallback((clientX, clientY) => {
    const el = wrapperRef.current;
    const rect = el ? el.getBoundingClientRect() : { left: 0, top: 0 };
    const { tx, ty, scale } = transformRef.current;
    const s = scale || 1;
    return { x: Math.round(clamp01k((clientX - rect.left - tx) / s)), y: Math.round(clamp01k((clientY - rect.top - ty) / s)) };
  }, [wrapperRef, transformRef]);

  /** A background click while composing-enabled opens the composer; returns true if
   *  it consumed the click (so the pane does not also clear its pin). */
  const beginCompose = useCallback((e) => {
    if (!active) return false;
    const { x, y } = toMapCoords(e.clientX, e.clientY);
    setComposing({ x, y, screenX: e.clientX, screenY: e.clientY });
    return true;
  }, [active, toMapCoords]);

  const addAnnotation = useCallback((label, audience) => {
    if (!composing) return;
    commitEdits(withAnnotation(mapEdits, { x: composing.x, y: composing.y, label, audience }));
    setComposing(null);
  }, [composing, commitEdits, mapEdits]);

  const removeAnnotation = useCallback((index) => {
    commitEdits(withoutAnnotationAt(mapEdits, index));
  }, [commitEdits, mapEdits]);

  const cancelCompose = useCallback(() => setComposing(null), []);
  const toggleAnnotate = useCallback(() => setAnnotateMode((v) => !v), []);

  return {
    annotations, annotateMode: active, composing,
    beginCompose, addAnnotation, removeAnnotation, cancelCompose, toggleAnnotate,
  };
}
