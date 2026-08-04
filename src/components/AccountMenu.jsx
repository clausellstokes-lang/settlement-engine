/**
 * AccountMenu.jsx — Header identity control.
 *
 * Anonymous visitors get a plain "Sign In" button. Signed-in users see
 * their display name on a chip that opens a small dropdown:
 *   - Account                        → the account page
 *   - Messages                       → Account ▸ Messages
 *   - Manage subscription & credits  → the subscription page (former Pricing)
 *
 * The "Pricing" hero link was removed from the top bar; subscription and
 * credit management now lives behind this menu for signed-in users (and,
 * for anonymous visitors, inline on the Create page once they hit the cap).
 *
 * The menu closes on outside-click, Escape, or item selection. Colors come
 * from theme tokens (no raw hex) so the visual-budget lint stays clean.
 */
import { useState, useRef, useEffect } from 'react';
import { User, ChevronDown, Settings, CreditCard, MessageSquare } from 'lucide-react';
import { GOLD, GOLD_BG, INK, BORDER, FS, SP, SHAFT_SAGE, SHAFT_STEEL, swatch } from './theme.js';
import Button from './primitives/Button.jsx';
import UnreadMessageBadge, { unreadMessagesLabel } from './account/UnreadMessageBadge.jsx';
import { useOperatorMessages } from './account/OperatorMessagesProvider.jsx';

function MenuRow({ icon, label, onClick, badge = null, ariaLabel }) {
  const [hover, setHover] = useState(false);
  return (
    <Button
      variant="ghost"
      fullWidth
      role="menuitem"
      aria-label={ariaLabel}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      icon={<span style={{ display: 'flex', color: GOLD, flexShrink: 0 }}>{icon}</span>}
      style={{
        justifyContent: 'flex-start', gap: SP.sm, textAlign: 'left',
        padding: `${SP.sm}px ${SP.md}px`,
        background: hover ? GOLD_BG : 'transparent',
        border: 'none',
        color: INK, fontSize: FS.sm, fontWeight: 600,
      }}
    >
      <span style={{ flex: 1 }}>{label}</span>
      {badge}
    </Button>
  );
}

export default function AccountMenu({
  isAnon,
  displayName,
  isElevated,
  onSignIn,
  onAccount,
  onMessages,
  onManageSubscription,
  unreadCount,
  compact = false,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { unreadCount: sharedUnreadCount, refresh: refreshMessages } = useOperatorMessages();
  const messageUnreadCount = unreadCount ?? sharedUnreadCount;

  useEffect(() => {
    if (!open) return undefined;
    const onDocMouseDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDocMouseDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const iconSize = compact ? 12 : 13;
  const chipPad = compact ? `${SP.xs + 1}px ${SP.md}px` : `${SP.sm}px ${SP.lg}px`;
  const chipFont = compact ? FS.xs : FS.sm;
  const toggleMenu = () => {
    if (!open) refreshMessages();
    setOpen(current => !current);
  };

  if (isAnon) {
    return (
      <Button
        variant="gold"
        size={compact ? 'sm' : 'md'}
        icon={<User size={iconSize} />}
        onClick={onSignIn}
        style={{
          marginLeft: compact ? 0 : SP.xs,
          minHeight: compact ? 44 : undefined,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}
      >
        Sign In
      </Button>
    );
  }

  const name = displayName || (isElevated ? 'Developer' : 'Account');
  // Status reads in a colored rule + ink, not a wash (deep-craft): the founder/
  // developer chip is the in-palette slate channel, the active account is green.
  //
  // ⚠️ THE CHIP'S TONES ARE A FUNCTION OF THE HEADER'S GROUND, AND THE GROUND HAS
  // NOW MOVED TWICE. This chip is `background: transparent`, so its label and its
  // rule are read against whatever the header paints — which is the arrow SHAFT.
  //   V1  ink bar    → GREEN / GREEN both fine.
  //   V2  cream wood → GREEN fell to 3.91:1 as text, so the LABEL took GREEN_DEEP
  //                    (5.00:1) while the RULE stayed GREEN, still clear of
  //                    1.4.11's 3:1. A legible two-step that kept the status hue.
  //   V3  honey wood → the barrel is much darker (theme.js SHAFT_BODY). GREEN falls
  //                    to 2.18:1 and GREEN_DEEP to 2.93:1, so the rule no longer
  //                    clears the BOUNDARY floor at either step and the label no
  //                    longer clears AA at all. There is no honest two-step left to
  //                    keep, so it collapses: rule and label both take one DARK
  //                    on-wood status step.
  //   V4  cedar wood → ⚠️⚠️ THE COLLAPSED STEP FLIPS REGISTER. On cedar the V3 dark
  //                    tones measure 1.36:1 and 1.38:1 — a dark chip on dark wood —
  //                    and the whole bar has moved to the parchment register with the
  //                    same arithmetic behind it (theme.js's dead-band note). So the
  //                    chip takes PALE status tints: SHAFT_SAGE and SHAFT_STEEL, the
  //                    most saturated tints that still clear 4.5:1 on the chip's OWN
  //                    lightest ground (4.63:1 each). The status HUE survives
  //                    all three moves; only its brightness follows the ground, every
  //                    time, in the direction the ground went.
  // Every ratio here is recomputed in tests/design/contrast.test.js, with GREEN,
  // GREEN_DEEP, SLATE_DEEP and now the V3 dark steps all pinned as negative controls
  // so putting any of the older tones back reds with the reason attached.
  const chipBg = 'transparent';
  const chipBorder = isElevated ? SHAFT_STEEL : SHAFT_SAGE;
  const chipColor = isElevated ? SHAFT_STEEL : SHAFT_SAGE;

  return (
    <div ref={ref} style={{ position: 'relative', marginLeft: compact ? 0 : SP.xs }}>
      <Button
        variant="secondary"
        onClick={toggleMenu}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={unreadMessagesLabel('Account', messageUnreadCount)}
        icon={<User size={iconSize} style={{ flexShrink: 0 }} />}
        trailingIcon={<ChevronDown size={iconSize} style={{ flexShrink: 0, opacity: 0.8 }} />}
        style={{
          gap: SP.xs,
          padding: chipPad,
          minHeight: compact ? 44 : undefined,
          maxWidth: compact ? 168 : 220,
          background: chipBg,
          border: `1px solid ${chipBorder}`,
          color: chipColor,
          fontSize: chipFont, fontWeight: compact ? 700 : 600,
          letterSpacing: '0.04em', textTransform: 'uppercase',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {name}
        </span>
      </Button>

      {!open && (
        <UnreadMessageBadge
          count={messageUnreadCount}
          style={{ position: 'absolute', right: -5, bottom: -5, pointerEvents: 'none', zIndex: 1 }}
        />
      )}

      {open && (
        <div
          role="menu"
          style={{
            position: 'absolute', top: 'calc(100% + 6px)', right: 0,
            minWidth: 236,
            background: swatch.white,
            border: `1px solid ${BORDER}`,
            padding: 6, zIndex: 1200,
          }}
        >
          <MenuRow
            icon={<Settings size={15} />}
            label="Account"
            onClick={() => { setOpen(false); onAccount?.(); }}
          />
          <MenuRow
            icon={<MessageSquare size={15} />}
            label="Messages"
            ariaLabel={unreadMessagesLabel('Messages', messageUnreadCount)}
            badge={<UnreadMessageBadge count={messageUnreadCount} />}
            onClick={() => { setOpen(false); onMessages?.(); }}
          />
          <MenuRow
            icon={<CreditCard size={15} />}
            label="Manage subscription & credits"
            onClick={() => { setOpen(false); onManageSubscription?.(); }}
          />
        </div>
      )}
    </div>
  );
}
