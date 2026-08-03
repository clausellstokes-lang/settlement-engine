/**
 * PortablePopup — THE PORTABLE POPUP (SP-6's THE PORTABLE POPUP + THE
 * MANIPULATION DISCLOSURE amendment, owner order 2026-08-03).
 *
 * ONE component, summoned from ANY surface: the realm Herald, the dossier's
 * rumor mill, an entity panel's headline list. It renders OVER the DM's current
 * context — the page beneath stays exactly where it was — and performs ZERO
 * navigation. The truth visits the DM, never the reverse.
 *
 * THE POPUP CONVENTION (product-wide UI law, all surfaces): a popup WITHOUT an
 * explicit acknowledge control closes on OUTSIDE-CLICK; a popup WITH one ("got
 * it" / "continue" / "don't show again") requires the deliberate dismissal. This
 * component is the FIRST kind and takes no acknowledge control at all — there is
 * no prop for one, which is what makes the convention structural rather than a
 * habit each caller has to remember. Escape closes it too (the focus trap's job);
 * a close affordance in the corner is a convenience, not an acknowledgement, and
 * is labelled as such.
 *
 * Presentational and generic: it knows nothing about causality, receipts, or the
 * Herald. `title` names it for the accessibility tree; `children` is the body.
 *
 * @enforced-by tests/ui/causalityPopup.test.jsx
 */

import { X } from 'lucide-react';

import { BORDER, BORDER2, CARD, CARD_ALT, FS, INK, SECOND, SP, sans } from '../theme.js';
import IconButton from './IconButton.jsx';
import { useDialogFocusTrap } from './useDialogFocusTrap.js';

/**
 * @param {object} props
 * @param {boolean} props.open
 * @param {string} props.title          names the popup for the accessibility tree
 * @param {() => void} props.onClose    outside-click, Escape, and the corner affordance
 * @param {import('react').ReactNode} props.children
 * @param {string} [props.testId]
 * @param {number} [props.width]
 */
export default function PortablePopup({ open, title, onClose, children, testId = 'portable-popup', width = 560 }) {
  // Shared trap: focus-in on open, Tab cycling, Escape-to-close, focus restore.
  const popupRef = useDialogFocusTrap(open, onClose);
  if (!open) return null;

  return (
    <div
      role="presentation"
      className="oc-m-warmdim"
      data-testid={`${testId}-scrim`}
      // THE CONVENTION, declared on the node so a surface scan can read it and a
      // reviewer can see which arm this popup takes without tracing props.
      data-popup-convention="outside-click"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: SP.lg,
        background: 'rgba(27,20,8,0.58)',
      }}
      onMouseDown={(event) => {
        // OUTSIDE-CLICK CLOSES. The guard keeps a drag that began inside the body
        // and ended on the scrim from dismissing the DM's own reading.
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <section
        ref={popupRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        data-testid={testId}
        style={{
          width: `min(100%, ${width}px)`,
          maxHeight: 'min(88vh, 720px)',
          overflow: 'auto',
          border: `1px solid ${BORDER}`,
          borderRadius: 0,
          background: CARD,
          boxShadow: 'none',
        }}
      >
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: SP.sm,
            padding: `${SP.sm}px ${SP.md}px`,
            borderBottom: `1px solid ${BORDER2}`,
            background: CARD_ALT,
          }}
        >
          <span style={{ flex: 1, color: SECOND, fontFamily: sans, fontSize: FS.micro, fontWeight: 850, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {title}
          </span>
          {/* A CLOSE affordance, never an ACKNOWLEDGE one: it dismisses the popup
              and records nothing. The label says close, and the convention above
              already lets an outside click do the same. */}
          <IconButton Icon={X} label={`Close ${title}`} onClick={onClose} size="sm" />
        </header>
        <div style={{ padding: SP.md, color: INK, fontFamily: sans, fontSize: FS.xxs }}>
          {children}
        </div>
      </section>
    </div>
  );
}
