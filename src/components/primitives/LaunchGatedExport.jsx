/**
 * LaunchGatedExport.jsx - wraps ONE export control and, while exports are closed for this
 * viewer (exportLaunchGate.js :: exportsOpenFor), turns it into the launch teaser the owner
 * asked for on 2026-11-03 (verbatim in AvailableAtLaunchDialog.jsx):
 *
 *   - the control KEEPS ITS OWN LABEL and wears the launch skin (the regal purple ground with
 *     the gold letters): a Button child is given `variant="launch"`, any other child `launch`;
 *   - it is NOT disabled, so it still takes focus and hover;
 *   - on hover and on keyboard focus a small "Available at launch" pill shows beneath it, and
 *     the control is described by that pill (`aria-describedby`), so a screen reader announces
 *     "Export PDF, available at launch";
 *   - a click (any device, touch included) is caught in the capture phase before the control's
 *     own handler, which never fires, and opens AvailableAtLaunchDialog.
 *
 * Whether it is gated is exportLaunchGate.js :: exportsOpenFor's answer for this viewer (a
 * staff account, the gallery's own export, or a launched build: open), read here so every call
 * site asks the same question; `gated` overrides it (tests, a host that already knows).
 * Not gated: the child renders exactly as given.
 *
 * Contract for a non-Button child: forward `aria-describedby`, `aria-haspopup`,
 * `data-launch-gated` and `launch` to the real <button>.
 */
import { Children, cloneElement, isValidElement, useId, useRef, useState } from 'react';
import Button from './Button.jsx';
import AvailableAtLaunchPill from './AvailableAtLaunchPill.jsx';
import AvailableAtLaunchDialog from './AvailableAtLaunchDialog.jsx';
import { exportsOpenFor, selectExportStaff } from './exportLaunchGate.js';
import { useStore } from '../../store/index.js';

/**
 * @param {{ gated?: boolean, gallery?: boolean, block?: boolean, sentence?: string, children: import('react').ReactElement }} props
 *   gated: overrides the gate's answer; gallery: the export is the gallery's own (never gated);
 *   block: the control fills its row; sentence: the dialog's sentence when the control is not an
 *   export (the dialog's own export sentence otherwise)
 */
export default function LaunchGatedExport({ gated: gatedOverride, gallery = false, block = false, sentence, children }) {
  const staff = useStore(selectExportStaff);
  const gated = typeof gatedOverride === 'boolean' ? gatedOverride : !exportsOpenFor({ staff, gallery });
  const pillId = useId();
  const wrapRef = useRef(/** @type {HTMLSpanElement | null} */ (null));
  const [hover, setHover] = useState(false);
  const [focused, setFocused] = useState(false);
  const [open, setOpen] = useState(false);
  if (!gated) return children;

  const child = Children.only(children);
  if (!isValidElement(child)) return children;
  const own = /** @type {{ 'aria-describedby'?: string }} */ (child.props)['aria-describedby'];
  const gatedChild = cloneElement(/** @type {import('react').ReactElement<any>} */ (child), {
    'aria-describedby': own ? `${own} ${pillId}` : pillId,
    'aria-haspopup': 'dialog',
    'data-launch-gated': '',
    ...(child.type === Button ? { variant: 'launch' } : { launch: true }),
  });

  /** @param {import('react').SyntheticEvent} event */
  const intercept = (event) => {
    // Only a press on the control itself; the dialog is portalled, but React still bubbles
    // its events through this tree, and they must reach the dialog untouched.
    const node = wrapRef.current;
    if (!node || !(event.target instanceof Node) || !node.contains(event.target)) return;
    event.preventDefault();
    event.stopPropagation();
    setHover(false);
    setOpen(true);
  };

  return (
    <span
      ref={wrapRef}
      role="presentation"
      data-launch-gate=""
      style={{ position: 'relative', display: block ? 'block' : 'inline-flex', width: block ? '100%' : undefined }}
      onClickCapture={intercept}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      {gatedChild}
      <span
        id={pillId}
        role="tooltip"
        style={{
          display: (hover || focused) && !open ? 'block' : 'none',
          position: 'absolute', top: '100%', left: 0, marginTop: 4, zIndex: 50,
          whiteSpace: 'nowrap', pointerEvents: 'none',
        }}
      >
        <AvailableAtLaunchPill />
      </span>
      <AvailableAtLaunchDialog open={open} onClose={() => setOpen(false)} {...(sentence ? { sentence } : {})} />
    </span>
  );
}
