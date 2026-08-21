/**
 * founders/ChairDrawer.jsx — THE BIO DRAWER (§2, owner order 2026-08-02).
 *
 * Clicking a plate opens a RIGHT-SIDE PANEL carrying that founder's bio and the
 * register in miniature: the numeral, the name (or the numeral standing alone),
 * the role, the seating year.
 *
 * KEYBOARD-REACHABLE BY CONSTRUCTION. The trigger is a real button (ChairPlate),
 * the panel is a labelled dialog, Escape closes it, and focus returns to the
 * plate that opened it — all of which the shared useDialogFocusTrap already
 * guarantees for every other modal in the product. A bespoke drawer that
 * reimplemented half of that is how the other half goes missing.
 *
 * THE BIO IS OPTIONAL AND CONSENTED. It rides the SAME single display-identity
 * opt-in as the name and the image — one consent, everywhere — so a chair with
 * no released bio simply says so, in the covenant's register, and is no less of
 * a chair for it. The drawer never invents a biography from an account.
 *
 * THE DEDICATION LINE stays PARKED (§9.3); the layout reserves its place under
 * the seating year rather than pretending the space was never designed.
 */
import { useDialogFocusTrap } from '../primitives/useDialogFocusTrap.js';
import { HALL, RING_TONE, RING_LABEL, numeralStyle, covenantProseStyle, quietLineStyle } from './hallRegister.js';
import { chairNumeral, seatedLabel } from '../../lib/foundersHall.js';
import Button from '../primitives/Button.jsx';
import IconButton from '../primitives/IconButton.jsx';
import { SP, FS, serif_, sans } from '../theme.js';

/**
 * @param {Object} props
 * @param {import('../../lib/foundersHall.js').HallChair|null} props.chair  null ⇒ closed
 * @param {() => void} props.onClose
 */
export default function ChairDrawer({ chair, onClose }) {
  const open = Boolean(chair);
  const dialogRef = useDialogFocusTrap(open, onClose);
  if (!open) return null;

  const numeral = chairNumeral(chair.chair);
  const seated = seatedLabel(chair.seatedAt);
  const ring = chair.ringRole || null;
  const named = Boolean(chair.displayName);
  const titleId = 'sf-hall-drawer-title';

  return (
    <>
      {/* The field dims behind the drawer. Click-to-close is a convenience on top
          of Escape, never the only way out. */}
      <Button
        variant="ghost"
        size="sm"
        aria-label="Close this founder's plate"
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 300, minHeight: 0, padding: 0,  // Z_LAYERS.dialogScrim
          // The scrim is the Hall's OWN dark ground at reduced opacity — a token
          // plus a number, never a translucent-color literal. The deep-craft
          // kill-list counts those washes as SaaS structure, and it is right to:
          // a scrim built from the page's own ink belongs to the page.
          background: HALL.ground, opacity: 0.72,
          border: 'none', borderRadius: 0,
        }}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 1000,  // Z_LAYERS.modal
          width: 'min(420px, 100vw)',
          boxSizing: 'border-box',
          background: HALL.ground,
          borderLeft: `2px solid ${HALL.gold}`,
          padding: SP.xl,
          overflowY: 'auto',
          display: 'flex', flexDirection: 'column', gap: SP.md,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: SP.md }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: SP.xs, minWidth: 0 }}>
            <span style={numeralStyle}>Seat {numeral}</span>
            <h2
              id={titleId}
              style={{
                margin: 0, fontFamily: serif_, fontSize: FS['22'], fontWeight: 700,
                color: HALL.ink, lineHeight: 1.2,
                fontStyle: named ? 'normal' : 'italic',
              }}
            >
              {named ? chair.displayName : 'This chair is held'}
            </h2>
            {ring && (
              <span style={{
                fontFamily: sans, fontSize: FS.xxs, fontWeight: 700,
                letterSpacing: '0.08em', textTransform: 'uppercase', color: RING_TONE[ring],
              }}>
                {RING_LABEL[ring]}
              </span>
            )}
            {seated && <span style={quietLineStyle}>{seated}</span>}
          </div>
          <IconButton glyph="×" label="Close" onClick={onClose} tone="ghost" size="lg" />
        </div>

        <hr style={{ border: 0, borderTop: `1px solid ${HALL.rule}`, margin: 0, width: '100%' }} />

        {chair.bio ? (
          <p style={covenantProseStyle}>{chair.bio}</p>
        ) : (
          <p style={{ ...covenantProseStyle, color: HALL.faint, fontStyle: 'italic' }}>
            This founder has not written a line for their plate. The chair speaks for itself.
          </p>
        )}

        <p style={{ ...quietLineStyle, color: HALL.faint, marginTop: 'auto' }}>
          A chair is held by one founder, permanently. Nothing on this plate is shown
          without its holder&rsquo;s consent.
        </p>
      </div>
    </>
  );
}
