/**
 * useDialogFocusTrap — shared modal focus management for the primitives layer.
 *
 * aria-modal="true" promises the background is inert; this hook backs that
 * promise with real focus management so every modal behaves the same:
 *   • remember the trigger element on open, move focus into the dialog;
 *   • trap Tab/Shift+Tab inside the dialog;
 *   • dismiss on Escape (via the latest onCancel, read through a ref);
 *   • restore focus to the trigger on close.
 *
 * `onCancel` is read through a ref so a new handler identity on each parent
 * re-render does NOT re-run the effect (which would yank focus to the first
 * focusable mid-typing). The effect is keyed on `open` alone.
 *
 * @param {boolean} open
 * @param {(() => void) | undefined} onCancel
 * @returns {import('react').RefObject<HTMLElement>} ref to attach to the dialog node
 */
import { useEffect, useRef } from 'react';

const FOCUSABLE = 'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

// Shared open-dialog stack (module scope). Every active trap pushes a token on
// open and pops it on close; the last token is the topmost dialog. Each trap's
// window keydown listener acts only when it owns that top token, so stacking
// two dialogs no longer double-handles Escape (which would close both at once).
const trapStack = [];

export function useDialogFocusTrap(open, onCancel) {
  const dialogRef = useRef(null);
  const restoreRef = useRef(null);
  const onCancelRef = useRef(onCancel);

  // Keep the latest onCancel in a ref so the focus/keydown effect can read it
  // without listing it as a dependency.
  useEffect(() => { onCancelRef.current = onCancel; }, [onCancel]);

  useEffect(() => {
    if (!open) return undefined;
    restoreRef.current = typeof document !== 'undefined' ? document.activeElement : null;
    const node = dialogRef.current;
    const focusables = () => node ? Array.from(node.querySelectorAll(FOCUSABLE)) : [];
    (focusables()[0] || node)?.focus?.();

    // Claim the top of the stack: this trap is now the topmost open dialog.
    const token = {};
    trapStack.push(token);

    const onKey = event => {
      // Only the topmost dialog reacts; a stacked-under trap ignores the key so
      // a single Escape closes one dialog, not the whole stack.
      if (trapStack[trapStack.length - 1] !== token) return;
      if (event.key === 'Escape') { onCancelRef.current?.(); return; }
      if (event.key !== 'Tab' || !node) return;
      const items = focusables();
      if (!items.length) { event.preventDefault(); node.focus?.(); return; }
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      const idx = trapStack.lastIndexOf(token);
      if (idx !== -1) trapStack.splice(idx, 1);
      restoreRef.current?.focus?.();
    };
  }, [open]);

  return dialogRef;
}

export default useDialogFocusTrap;
