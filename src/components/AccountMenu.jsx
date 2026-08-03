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
import { GOLD, GOLD_BG, INK, BORDER, FS, SP, SLATE, SLATE_DEEP, GREEN, GREEN_DEEP, swatch } from './theme.js';
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
  // ⚠️ THE LABEL TONE IS GREEN_DEEP, NOT GREEN, AND THE GROUND IS WHY. This chip is
  // `background: transparent`, so its label is read against whatever the header is
  // painting — and under ribbon v2 that is the light-wood SHAFT, not the old ink
  // bar. GREEN (green-600) measures 3.91:1 on the grain's darkest streak and fails
  // AA as text there; GREEN_DEEP (green-700) is the palette's own step for exactly
  // this case and measures 5.00:1. The BORDER stays GREEN: it is a UI boundary
  // under 1.4.11's 3:1, which 3.91:1 clears, and keeping the rule at the brighter
  // step is what preserves the status colour's read. Both ratios are recomputed in
  // tests/design/contrast.test.js, GREEN pinned as the negative control.
  const chipBg = 'transparent';
  const chipBorder = isElevated ? SLATE : GREEN;
  const chipColor = isElevated ? SLATE_DEEP : GREEN_DEEP;

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
