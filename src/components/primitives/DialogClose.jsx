/**
 * primitives/DialogClose — THE ONE EXIT FROM A POP-UP (owner order, ODQ §934.31:
 * "when clicking feedback and support, there should be an exit button to the pop up").
 *
 * ── THE CLASS ──────────────────────────────────────────────────────────────────
 * The owner opened Feedback & support and could not find the way out. There WAS a
 * control — a ghost icon-only Button in the header — but the panel had no Escape, no
 * focus restore, and the × read as decoration rather than as a door. That is the shape
 * of the whole class: every dialog in this tree invented its own exit, so each one
 * differed in label ("Close", "Close import", "Close session mode", "Dismiss what's
 * next"), in size, in tone, and in whether it existed at all. A reader cannot learn a
 * door that is drawn differently in every room.
 *
 * ── THE CURE IS ONE CONTROL, NOT TWENTY PATCHES ────────────────────────────────
 * Every dialog, sheet and pop-up renders THIS, and it fixes the things a call site
 * should not be free to decide:
 *   • the accessible name is "Close" — plain, learnable, and the same word every time.
 *     A caller may name WHAT is being closed (`subject="the import"` → "Close the
 *     import"), but it may not rename the verb, because the walker and the reader both
 *     look for it.
 *   • the glyph is the unicode × TEXT twin, so the control survives the icons-off
 *     channel as a quieter mark rather than an empty labelled box (IconButton's LU-2
 *     rule) — a door that disappears when the artwork does is not a door.
 *   • the tap target is ≥ 44 × 44 on a phone. IconButton already enforces that floor
 *     for every size; `lg` is used so the DESKTOP box (36) is a real target too rather
 *     than the 24px `sm` several dialogs had been using for their exit.
 *
 * ⛔ WHAT THIS DOES NOT DO, AND WHY. It does not close anything by itself. Escape,
 * focus restoration and the focus trap belong to the dialog's own lifecycle and are
 * supplied by `useDialogFocusTrap` (modal) or `useDialogDismiss` (a non-modal popover
 * that must not trap). A close BUTTON that worked while Escape did not would be the
 * half-cure the order is about.
 *
 * @enforced-by tests/lint/dialogExit.walker.test.js (every rendered role="dialog" has a
 *   labelled close control and an Escape/focus lifecycle — no exemption list)
 */

import IconButton from './IconButton.jsx';

/**
 * @param {Object} props
 * @param {() => void} props.onClose  the dialog's own dismiss handler
 * @param {string} [props.subject]    what is being closed, for a longer accessible name
 *   ("Close the import"). Omit it for the plain "Close".
 * @param {'default'|'ghost'|'inverse'|'danger'|'primary'|'active'} [props.tone='ghost']
 * @param {'sm'|'md'|'lg'|'xl'} [props.size='lg']
 */
export default function DialogClose({ onClose, subject, tone = 'ghost', size = 'lg', ...rest }) {
  return (
    <IconButton
      glyph="×"
      label={subject ? `Close ${subject}` : 'Close'}
      onClick={onClose}
      tone={tone}
      size={size}
      {...rest}
    />
  );
}
