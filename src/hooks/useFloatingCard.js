/**
 * hooks/useFloatingCard.js — THE FLOATING CARD'S MOVE AND MEMORY, one copy.
 *
 * Extracted from the post-generate coach's corner card (src/components/PostGenCoach.jsx,
 * the owner, 2026-10-30: "a relatively small floating and movable pop-up") when the
 * Surveyor's chat log took the same chrome (X-22: "movable by its header, folds to a
 * pill, position remembered per device"). Two cards, one behaviour, so the drag, the
 * clamp and the remembered spot live here and nowhere else. The extraction moved code;
 * it changed no behaviour of the coach.
 *
 * What it owns:
 *   • THE MEMORY. Where the reader dropped the card, as its top-left in viewport px, under
 *     the caller's device-local key. Every access is try/caught, so a blocked
 *     localStorage never throws into render; a missing or malformed value means "the
 *     caller's default anchor".
 *   • THE CLAMP. The card stays EDGE px inside the viewport on every side, on every drag
 *     step, and is re-clamped on resize (display only: the stored spot is rewritten by a
 *     drag, never by a resize).
 *   • THE DRAG. Pointer events (mouse and touch alike) from the caller's handle. A press
 *     that travels under 4 px is a tap, not a move: the caller's own click handler (the
 *     coach's fold button) sees it, or `onTap` is called (the chat's header, which is not
 *     a button). After a real move the next click is swallowed, so dropping the card is
 *     never also a fold. A press inside the caller's no-drag selector is ignored. While
 *     the card is not floating (`active` false: the chat's phone sheet) the handle still
 *     reports a tap but never moves the card or writes the memory.
 *
 * What it does not own: the anchor literal (each caller keeps its own `position: 'fixed'`
 * object so the bottom-anchored-chrome walker reads the lift where it lives), the layer,
 * the fold state, or the card's markup.
 */

import { useEffect, useRef, useState } from 'react';

/** The viewport margin a card keeps on every side. */
export const FLOATING_CARD_EDGE = 8;
/** Pointer travel (px, |dx| + |dy|) under which a press is a tap rather than a move. */
const TAP_SLOP = 4;

/** @param {string} key @returns {{left: number, top: number} | null} */
export function readCardPos(key) {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
    if (!raw) return null;
    const v = JSON.parse(raw);
    return Number.isFinite(v?.left) && Number.isFinite(v?.top) ? { left: v.left, top: v.top } : null;
  } catch {
    return null;
  }
}

/** @param {string} key @param {{left: number, top: number}} p */
export function writeCardPos(key, p) {
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem(key, JSON.stringify(p));
  } catch {
    /* storage unavailable: the card stays where it is for this visit */
  }
}

/**
 * Keep a w x h box FLOATING_CARD_EDGE px inside the viewport on every side.
 * @param {{left: number, top: number}} p @param {number} w @param {number} h
 * @returns {{left: number, top: number}}
 */
export function clampToViewport(p, w, h) {
  const edge = FLOATING_CARD_EDGE;
  const maxLeft = Math.max(edge, window.innerWidth - w - edge);
  const maxTop = Math.max(edge, window.innerHeight - h - edge);
  return {
    left: Math.round(Math.min(Math.max(edge, p.left), maxLeft)),
    top: Math.round(Math.min(Math.max(edge, p.top), maxTop)),
  };
}

/**
 * @param {{
 *   storageKey: string,
 *   active: boolean,
 *   cardRef: import('react').RefObject<HTMLElement>,
 *   remeasure?: unknown,
 *   noDragSelector?: string,
 * }} options `active`: the card is floating now (the clamp listens and the drag moves
 *   only then);
 *   `remeasure`: any value whose change resizes the card (the fold), so the spot is
 *   re-clamped to the new size.
 * @returns {{
 *   pos: {left: number, top: number} | null,
 *   startDrag: (e: PointerEvent | import('react').PointerEvent, opts?: { onTap?: () => void }) => void,
 *   consumeClick: () => boolean,
 * }}
 */
export function useFloatingCard({ storageKey, active, cardRef, remeasure, noDragSelector }) {
  // Where the reader dragged the card (null: the caller's default anchor). Read once per mount.
  const [pos, setPos] = useState(() => readCardPos(storageKey));
  // True for the one click that ends a drag, so dropping the card is not also a fold.
  const swallowClickRef = useRef(false);
  // The live drag's teardown, so an unmount mid-drag leaves no window listener behind.
  const endDragRef = useRef(null);
  useEffect(() => () => endDragRef.current?.(), []);

  // A window resize, or the card changing size, re-clamps the remembered spot into the
  // viewport. Display only: the stored preference is rewritten by a drag.
  useEffect(() => {
    if (!active) return undefined;
    const reclamp = () => {
      const node = cardRef.current;
      if (!node) return;
      const r = node.getBoundingClientRect();
      setPos((p) => {
        if (!p) return p;
        const c = clampToViewport(p, r.width, r.height);
        return c.left === p.left && c.top === p.top ? p : c;
      });
    };
    reclamp();
    window.addEventListener('resize', reclamp);
    return () => window.removeEventListener('resize', reclamp);
  }, [active, remeasure, cardRef]);

  /** @param {any} e the pointerdown event @param {{ onTap?: () => void }} [opts] */
  const startDrag = (e, opts = {}) => {
    const onTap = opts.onTap;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (noDragSelector && e.target?.closest?.(noDragSelector)) return;
    const node = cardRef.current;
    if (!node) return;
    const r = node.getBoundingClientRect();
    const d = { x: e.clientX, y: e.clientY, left: r.left, top: r.top, moved: false, last: null };
    const movable = active;
    const move = (ev) => {
      const dx = ev.clientX - d.x;
      const dy = ev.clientY - d.y;
      if (!d.moved && Math.abs(dx) + Math.abs(dy) < TAP_SLOP) return;
      d.moved = true;
      if (!movable) return;
      d.last = clampToViewport({ left: d.left + dx, top: d.top + dy }, r.width, r.height);
      setPos(d.last);
    };
    const end = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      endDragRef.current = null;
    };
    const up = (ev) => {
      end();
      if (!d.moved) {
        if (ev?.type === 'pointerup') onTap?.();
        return;
      }
      if (!d.last) return;
      writeCardPos(storageKey, d.last);
      swallowClickRef.current = true;
      setTimeout(() => { swallowClickRef.current = false; }, 0);
    };
    endDragRef.current?.();
    endDragRef.current = end;
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  };

  /** True (and spent) when this click ends a drag and must not act. */
  const consumeClick = () => {
    if (!swallowClickRef.current) return false;
    swallowClickRef.current = false;
    return true;
  };

  return { pos, startDrag, consumeClick };
}
