/**
 * components/townMap/useMapCamera — the town-map pane's self-owned camera controller.
 *
 * Extracted verbatim from SettlementMapPane (the pane holds the max-lines ceiling —
 * the hot-file rule: new logic lands as a leaf, not inline). A plain pan / wheel-zoom
 * / two-pointer-pinch controller cloned from MapOverlay's image-mode camera: it writes
 * the transform through `writeTransform` (a direct-DOM write, no per-frame re-render)
 * and reads the live transform from `transformRef`. Pure interaction wiring; no map
 * state, no store. Lazy (imported only by the lazy pane) ⇒ zero first-paint bytes.
 */
import { useEffect } from 'react';

const clampScale = (s) => Math.max(0.2, Math.min(8, s));

/**
 * Install the pan/zoom/pinch listeners on the wrapper element for the pane's life.
 * @param {{
 *   wrapperRef: import('react').MutableRefObject<HTMLElement|null>,
 *   transformRef: import('react').MutableRefObject<{ tx:number, ty:number, scale:number, width:number, height:number }>,
 *   writeTransform: (t: { tx?:number, ty?:number, scale?:number, width?:number, height?:number }) => void,
 * }} deps
 */
export function useMapCamera({ wrapperRef, transformRef, writeTransform }) {
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return undefined;
    const pointers = new Map();
    let panning = false; let lastX = 0; let lastY = 0;
    /** @type {{ dist:number, cx:number, cy:number, scale:number, tx:number, ty:number }|null} */
    let pinch = null;
    // Pan starts only on the map background (svg / wrapper / the bg rect) —
    // buildings and districts own their own hover/click. MapOverlay precedent.
    const isBackground = (target) => target === el || target.tagName === 'svg'
      || target.getAttribute?.('data-town-bg') != null;

    const beginPinch = () => {
      const pts = [...pointers.values()];
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) || 1;
      const rect = el.getBoundingClientRect();
      pinch = {
        dist,
        cx: (pts[0].x + pts[1].x) / 2 - rect.left,
        cy: (pts[0].y + pts[1].y) / 2 - rect.top,
        scale: transformRef.current.scale,
        tx: transformRef.current.tx,
        ty: transformRef.current.ty,
      };
    };

    const onDown = (e) => {
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 2) { panning = false; beginPinch(); return; }
      if (pointers.size !== 1) return;
      if (e.button != null && e.button > 0) return; // primary / touch only
      if (!isBackground(e.target)) return;
      panning = true; lastX = e.clientX; lastY = e.clientY;
      try { el.setPointerCapture?.(e.pointerId); } catch { /* ignore */ }
    };
    const onMove = (e) => {
      if (pointers.has(e.pointerId)) pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pinch && pointers.size >= 2) {
        const pts = [...pointers.values()];
        const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) || 1;
        const next = clampScale(pinch.scale * (dist / pinch.dist));
        const k = next / pinch.scale;
        writeTransform({ scale: next, tx: pinch.cx - (pinch.cx - pinch.tx) * k, ty: pinch.cy - (pinch.cy - pinch.ty) * k });
        return;
      }
      if (!panning) return;
      writeTransform({ tx: transformRef.current.tx + (e.clientX - lastX), ty: transformRef.current.ty + (e.clientY - lastY) });
      lastX = e.clientX; lastY = e.clientY;
    };
    const onUp = (e) => {
      pointers.delete(e.pointerId);
      if (pointers.size < 2) pinch = null;
      if (pointers.size === 0) panning = false;
      try { el.releasePointerCapture?.(e.pointerId); } catch { /* ignore */ }
    };
    const onWheel = (e) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const cx = e.clientX - rect.left; const cy = e.clientY - rect.top;
      const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
      const next = clampScale(transformRef.current.scale * factor);
      const k = next / transformRef.current.scale;
      writeTransform({ scale: next, tx: cx - (cx - transformRef.current.tx) * k, ty: cy - (cy - transformRef.current.ty) * k });
    };

    el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      el.removeEventListener('wheel', onWheel);
    };
  }, [wrapperRef, transformRef, writeTransform]);
}
