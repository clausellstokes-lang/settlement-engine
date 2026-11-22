/**
 * AvailableAtLaunchDialog.jsx - THE ONE POP-UP A LAUNCH-GATED CONTROL OPENS.
 *
 * THE OWNER (2026-11-03): "Actually change it. Every purple gold button should say what ot is
 * but have a pill once hovered that says available at launch. Or opens a pop up ( everything
 * outside of the pop up goes dark opaque) that in theme that says available at launch. They can
 * click an okay button or the close button to the pop up or outside if the pop up to close it
 * and continue on."
 *
 * One component, so the behaviour cannot drift between controls: the ground dims the page
 * near-opaque (EDITOR_GROUND, the house's darkest warm ground, through `.oc-m-warmdim`'s fade);
 * the plate is the house dialog plate (CARD under a CARD_ALT header, rule-framed); the title
 * is the pill's own words; one plain sentence; OK and the house close mark. It closes on OK,
 * on the close mark, on a press on the ground, and on Escape. useDialogFocusTrap moves focus
 * in on open, traps Tab, and returns focus to the control that opened it.
 *
 * Rendered through a portal to <body>, so no ancestor's transform or stacking context can trap
 * the fixed ground. `data-launch-dialog` lets a host popover (a menu that closes on an outside
 * press) recognise a press inside the dialog as its own.
 *
 * Served today by the export controls (LaunchGatedExport.jsx) and, with their own sentence, the
 * three paths a build without an engine cannot serve (lib/engineAbsentPaths.js, ENGINE-5);
 * ready to serve the purchase controls if the owner moves them onto the same interaction.
 */
import { useId } from 'react';
import { createPortal } from 'react-dom';
import { BODY, BORDER, CARD, CARD_ALT, EDITOR_GROUND, FS, INK, SP, sans } from '../theme.js';
import Button from './Button.jsx';
import DialogClose from './DialogClose.jsx';
import { useDialogFocusTrap } from './useDialogFocusTrap.js';
import { AVAILABLE_AT_LAUNCH } from './AvailableAtLaunchPill.jsx';

/** The one sentence. The owner may rewrite it; it lives here and nowhere else. */
export const AVAILABLE_AT_LAUNCH_SENTENCE = 'Exports open when the site launches; your settlement is saved and will be ready.';

/**
 * @param {{ open: boolean, onClose: () => void, sentence?: string }} props
 *   sentence: the one sentence, when the control is not an export (a path a build without an
 *   engine cannot serve, `lib/engineAbsentPaths.js`); the export sentence otherwise
 */
export default function AvailableAtLaunchDialog({ open, onClose, sentence = AVAILABLE_AT_LAUNCH_SENTENCE }) {
  const titleId = useId();
  const dialogRef = useDialogFocusTrap(open, onClose);
  if (!open || typeof document === 'undefined') return null;
  return createPortal(
    <div
      role="presentation"
      className="oc-m-warmdim"
      data-launch-dialog=""
      style={{
        position: 'fixed', inset: 0, zIndex: 310,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: SP.lg, background: EDITOR_GROUND,
      }}
      // A portal's React events still bubble through the tree that rendered it: a click on OK
      // would otherwise reach the host's own handlers (a menu that closes on a button press, a
      // folder header that toggles), and a press would reach a host's outside-press listener.
      // The dialog's events end here. Keys are left alone: Escape is read on window.
      onClick={(event) => event.stopPropagation()}
      onMouseDown={(event) => { event.stopPropagation(); if (event.target === event.currentTarget) onClose(); }}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        style={{
          width: 'min(100%, 400px)', border: `1px solid ${BORDER}`, borderRadius: 0,
          background: CARD, fontFamily: sans,
        }}
      >
        <header style={{
          display: 'flex', alignItems: 'flex-start', gap: SP.md,
          padding: `${SP.lg}px ${SP.lg}px ${SP.md}px`, borderBottom: `1px solid ${BORDER}`, background: CARD_ALT,
        }}>
          <h2 id={titleId} style={{ flex: 1, minWidth: 0, margin: 0, color: INK, fontSize: FS.lg, lineHeight: 1.25, fontWeight: 900 }}>
            {AVAILABLE_AT_LAUNCH}
          </h2>
          <DialogClose onClose={onClose} />
        </header>
        <p style={{ margin: 0, padding: SP.lg, color: BODY, fontSize: FS.sm, lineHeight: 1.45 }}>
          {sentence}
        </p>
        <footer style={{ display: 'flex', justifyContent: 'flex-end', padding: `0 ${SP.lg}px ${SP.lg}px` }}>
          <Button type="button" variant="launch" size="md" onClick={onClose} style={{ minHeight: 44 }}>OK</Button>
        </footer>
      </section>
    </div>,
    document.body,
  );
}
