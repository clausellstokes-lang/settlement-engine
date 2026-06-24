/**
 * primitives/BottomSheet — a mobile bottom-anchored sheet for filters and
 * light actions.
 *
 * The pattern: a compact trigger ("Filters", with an optional active count)
 * that opens a sheet which slides up from the bottom edge over a scrim. The
 * sheet carries the same modal contract as Dialog — role="dialog",
 * aria-modal, a labelled title, a focus trap with Tab cycling, Escape and
 * scrim-tap to dismiss, and focus restore to the trigger on close (all via
 * the shared useDialogFocusTrap hook).
 *
 * Mobile-shaped on purpose: it anchors to the bottom (thumb reach), caps its
 * height at 85vh so the scrim above stays tappable, scrolls its own body when
 * the content is tall, and pads the bottom with the safe-area inset so the
 * close affordance clears the home indicator. This is a presentation
 * primitive only — 5c wires it onto the filter surfaces; it ships unwired.
 *
 * Children are the sheet body (the filter or action content). The trigger is
 * a real Button primitive, so it inherits the 44px-floor sizing and tokens.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.title           accessible sheet title (header text + aria-label)
 * @param {React.ReactNode} [props.triggerLabel='Filters']  text on the opener
 * @param {number} [props.count]                  optional active-filter count badge on the trigger
 * @param {React.ReactNode} props.children        sheet body content
 * @param {'primary'|'secondary'|'ghost'|'gold'} [props.triggerVariant='secondary']
 * @param {boolean} [props.fullWidthTrigger=false] stretch the trigger to its container
 * @param {() => void} [props.onOpen]             fired when the sheet opens
 * @param {() => void} [props.onClose]            fired when the sheet closes
 */
import { useCallback, useId, useState } from 'react';
import { X } from 'lucide-react';
import {
  BODY, BORDER, CARD, CARD_ALT, ELEV, FS, INK, MUTED, R, SP, sans,
} from '../theme.js';
import Button from './Button.jsx';
import Badge from './Badge.jsx';
import { useDialogFocusTrap } from './useDialogFocusTrap.js';
import { useIconsOn } from './IconsContext.js';

export default function BottomSheet({
  title,
  triggerLabel = 'Filters',
  count,
  children,
  triggerVariant = 'secondary',
  fullWidthTrigger = false,
  onOpen,
  onClose,
}) {
  const [open, setOpen] = useState(false);
  const labelId = useId();
  const iconsOn = useIconsOn();

  const close = useCallback(() => {
    setOpen(false);
    onClose?.();
  }, [onClose]);

  // Focus trap + Escape + focus restore. onCancel is read through a ref inside
  // the hook, so a fresh `close` identity each render won't re-run focus-in.
  const sheetRef = useDialogFocusTrap(open, close);

  const openSheet = () => {
    setOpen(true);
    onOpen?.();
  };

  const hasCount = typeof count === 'number' && count > 0;

  return (
    <>
      <Button
        variant={triggerVariant}
        onClick={openSheet}
        fullWidth={fullWidthTrigger}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        {triggerLabel}
        {hasCount && <Badge tone="muted">{count}</Badge>}
      </Button>

      {open && (
        <div
          role="presentation"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 300,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            background: 'rgba(27,20,8,0.46)',
          }}
          onMouseDown={event => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <section
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelId}
            tabIndex={-1}
            style={{
              width: '100%',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              borderTop: `1px solid ${BORDER}`,
              borderTopLeftRadius: R.lg,
              borderTopRightRadius: R.lg,
              background: CARD,
              boxShadow: ELEV[3],
              animation: 'sf-sheet-up 180ms ease-out',
            }}
          >
            <header style={{
              display: 'flex',
              alignItems: 'center',
              gap: SP.md,
              padding: `${SP.md}px ${SP.lg}px`,
              borderBottom: `1px solid ${BORDER}`,
              background: CARD_ALT,
              borderTopLeftRadius: R.lg,
              borderTopRightRadius: R.lg,
            }}>
              <h2 id={labelId} style={{
                flex: 1,
                minWidth: 0,
                margin: 0,
                color: INK,
                fontFamily: sans,
                fontSize: FS.lg,
                lineHeight: 1.25,
                fontWeight: 900,
              }}>
                {title}
              </h2>
              <button
                type="button"
                aria-label="Close"
                onClick={close}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: MUTED,
                  cursor: 'pointer',
                  // 44px tap floor (mobile surface).
                  minWidth: 44,
                  minHeight: 44,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {iconsOn
                  ? <X size={18} />
                  : <span aria-hidden="true" style={{ fontSize: FS.xl, lineHeight: 1, fontWeight: 700, color: BODY }}>×</span>}
              </button>
            </header>
            <div style={{
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              padding: SP.lg,
              // Clear the home indicator on notched phones.
              paddingBottom: `calc(${SP.lg}px + env(safe-area-inset-bottom, 0px))`,
            }}>
              {children}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
