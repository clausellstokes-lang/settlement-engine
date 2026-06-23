/**
 * primitives/DesktopOnlyGate — the "best on desktop" affordance for surfaces
 * whose authoring is desktop-only on the mobile build.
 *
 * Per the confirmed MIX decision, it ships two variants:
 *
 *   • variant="gate"   — a clean calm panel: a short "best authored on
 *     desktop" message plus an optional explanation and CTA. No teaser. Use
 *     this for raw editors that have nothing readable to show on mobile.
 *
 *   • variant="teaser" — renders the supplied children as a read-only,
 *     non-interactive teaser (pointer-events off, aria-hidden so AT skips the
 *     dead controls) BENEATH the same desktop message + CTA. Use this where
 *     there is readable content worth previewing on mobile.
 *
 * Copy is house voice — calm campaign archivist, no em dashes, no exclamation
 * points. The default messages are deliberately plain; callers can override.
 * This primitive is presentation only and ships unwired; 5c decides which
 * surfaces gate and with which variant.
 *
 * @param {Object} props
 * @param {'gate'|'teaser'} [props.variant='gate']
 * @param {React.ReactNode} [props.title='Best on a larger screen']  panel heading
 * @param {React.ReactNode} [props.message]   the body explanation (calm default supplied)
 * @param {React.ReactNode} [props.cta]       optional CTA node (e.g. a Button or link)
 * @param {React.ReactNode} [props.children]  teaser content (variant="teaser" only)
 */
import { Monitor } from 'lucide-react';
import {
  BODY, BORDER, CARD, CARD_ALT, ELEV, FS, INK, MUTED, R, SP, sans,
} from '../theme.js';
import { useIconsOn } from './IconsContext.js';

const DEFAULT_MESSAGE = 'This is best authored on a desktop, where the full set of controls has room to work. Open this settlement on a larger screen to make changes here.';

export default function DesktopOnlyGate({
  variant = 'gate',
  title = 'Best on a larger screen',
  message = DEFAULT_MESSAGE,
  cta = null,
  children,
}) {
  const iconsOn = useIconsOn();
  const isTeaser = variant === 'teaser';

  const panel = (
    <div
      role="note"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: SP.md,
        padding: SP.lg,
        border: `1px solid ${BORDER}`,
        borderRadius: R.lg,
        background: CARD_ALT,
        boxShadow: ELEV[1],
      }}
    >
      {iconsOn && (
        <div style={{
          width: 32,
          height: 32,
          borderRadius: R.lg,
          border: `1px solid ${BORDER}`,
          background: CARD,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: MUTED,
          flexShrink: 0,
        }}>
          <Monitor size={16} aria-hidden="true" />
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h2 style={{
          margin: 0,
          color: INK,
          fontFamily: sans,
          fontSize: FS.md,
          lineHeight: 1.3,
          fontWeight: 900,
        }}>
          {title}
        </h2>
        {message && (
          <p style={{
            margin: `${SP.xs}px 0 0`,
            color: BODY,
            fontFamily: sans,
            fontSize: FS.sm,
            lineHeight: 1.5,
          }}>
            {message}
          </p>
        )}
        {cta && <div style={{ marginTop: SP.md }}>{cta}</div>}
      </div>
    </div>
  );

  if (!isTeaser) return panel;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SP.md }}>
      {panel}
      {/* Read-only teaser: inert to pointer + hidden from AT so the dead
          controls beneath the gate can't be focused or actioned on mobile. */}
      <div
        aria-hidden="true"
        inert
        style={{
          position: 'relative',
          pointerEvents: 'none',
          userSelect: 'none',
          opacity: 0.62,
          border: `1px solid ${BORDER}`,
          borderRadius: R.lg,
          background: CARD,
          padding: SP.lg,
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  );
}
