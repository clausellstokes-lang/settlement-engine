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
    // Sequentially focusable only (SB5): the selector can match elements that
    // carry tabindex="-1" (e.g. a roving-focus listbox option that is a real
    // <button>, as in CommandPalette), but the browser's Tab order SKIPS those —
    // so the wrap logic must skip them too, or Tab from the last real tab-stop
    // would fall through the dialog instead of wrapping. el.tabIndex is -1
    // exactly for those elements.
    const focusables = () => node
      ? Array.from(node.querySelectorAll(FOCUSABLE)).filter((el) => el.tabIndex !== -1)
      : [];
    // Honour an explicit autofocus first: a dialog input that opted into
    // autoFocus (e.g. a rename field) should keep focus rather than have it
    // yanked to the header close button. React's autoFocus prop does not emit
    // an [autofocus] attribute, so check the live document.activeElement too —
    // when it already sits inside the dialog, leave it be. Only when nothing
    // claimed focus do we fall back to the first focusable, then the node.
    const list = focusables();
    const declared = node?.querySelector?.('[autofocus]');
    const live = typeof document !== 'undefined' ? document.activeElement : null;
    const alreadyInside = node && live && live !== node && node.contains?.(live) && list.includes(live);
    (declared || (alreadyInside ? live : null) || list[0] || node)?.focus?.();

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

/**
 * useDialogDismiss — the NON-MODAL half of the dialog lifecycle (owner order, ODQ
 * §934.31).
 *
 * ⭐ WHY A SECOND HOOK RATHER THAN ONE MORE CALLER OF THE TRAP. The order requires every
 * pop-up to close on Escape and hand focus back to whatever opened it. It does NOT
 * require every pop-up to be MODAL, and a few are deliberately not: the Feedback &
 * support panel is an anchored corner panel with no scrim, and the post-generate coach
 * sits in the page's own content flow. Trapping Tab inside either of those would be a
 * real regression — the reader could no longer reach the page they are still looking at,
 * and `aria-modal` would be a promise the surface does not keep.
 *
 * So the lifecycle splits by what the surface IS, not by who remembered to wire it:
 *   • `useDialogFocusTrap` — a MODAL dialog: focus-in, Tab trapped, Escape, restore.
 *   • `useDialogDismiss`   — a NON-MODAL popover: Escape and restore, no trap, and no
 *                            focus-in either (a hint that steals focus is a hint that
 *                            interrupts).
 * ⛔ THIS IS A TYPED RULE, NOT AN EXEMPTION LIST. Both arms give Escape and focus
 * restoration; neither lets a surface opt out of having an exit.
 *
 * Escape is read through the SAME trap stack the modal hook uses, so a non-modal popover
 * open underneath a modal does not swallow the modal's Escape.
 *
 * @param {boolean} open
 * @param {(() => void) | undefined} onDismiss
 * @returns {import('react').RefObject<HTMLElement>} ref to attach to the popover node
 */
export function useDialogDismiss(open, onDismiss) {
  const nodeRef = useRef(null);
  const restoreRef = useRef(null);
  const onDismissRef = useRef(onDismiss);

  useEffect(() => { onDismissRef.current = onDismiss; }, [onDismiss]);

  useEffect(() => {
    if (!open) return undefined;
    restoreRef.current = typeof document !== 'undefined' ? document.activeElement : null;
    // Captured at effect time, deliberately: by cleanup the ref has usually been nulled
    // (the popover unmounting is WHY the cleanup is running), and the cleanup's question
    // is about the node that WAS open, not about whatever the ref points at afterwards.
    const node = nodeRef.current;

    // Claim the top of the SHARED stack: while this popover is the topmost open
    // surface, Escape is its to answer — and while a modal opens above it, it is not.
    const token = {};
    trapStack.push(token);

    const onKey = (event) => {
      if (trapStack[trapStack.length - 1] !== token) return;
      if (event.key !== 'Escape') return;
      onDismissRef.current?.();
      // ⭐ AND FOCUS GOES HOME ON THE KEY ITSELF, not only when the popover finally comes
      // down. The order is "close on Escape and hand focus back to whatever opened it", and
      // the teardown below can only answer the second half once the CALLER's state has
      // settled — which is a different moment, and on a caller whose dismiss is deferred,
      // re-rendered or externally owned it may be much later or never. The Entity Inspector
      // is exactly that shape (`SettlementWorkbench` clears a store field and waits to be
      // re-rendered without an entry), and its reader was left holding a focus ring inside a
      // panel that had already answered them.
      // ⛔ ONLY IF FOCUS IS STILL INSIDE, which is the same question the teardown asks and
      // for the same reason: a non-modal never took focus, so a reader who had moved on must
      // not be yanked back. And the two cannot fight — after this hands focus to the opener,
      // focus is neither inside the popover nor on <body>, so the teardown declines.
      const live = typeof document !== 'undefined' ? document.activeElement : null;
      if (node && live && node.contains?.(live)) restoreRef.current?.focus?.();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      const idx = trapStack.lastIndexOf(token);
      if (idx !== -1) trapStack.splice(idx, 1);
      // Restore only if focus is still INSIDE the popover. A non-modal never took
      // focus, so yanking it back would move the reader's cursor out of whatever they
      // had gone on to do.
      const live = typeof document !== 'undefined' ? document.activeElement : null;
      // Either focus is still in the popover, or the popover has already been removed
      // and the browser has parked focus on <body> — both mean the reader's place went
      // with it, and both are answered by handing focus back to the opener.
      const inside = node && live && node.contains?.(live);
      if (inside || live === document?.body) restoreRef.current?.focus?.();
    };
  }, [open]);

  return nodeRef;
}

export default useDialogFocusTrap;
