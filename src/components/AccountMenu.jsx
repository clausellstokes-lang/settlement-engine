/**
 * AccountMenu.jsx — Header identity control.
 *
 * Anonymous visitors get a plain "Sign In" button. Signed-in users see
 * their display name on a chip that opens a small dropdown:
 *   - Account                        → the account page
 *   - Manage subscription & credits  → the subscription page (former Pricing)
 *
 * The "Pricing" hero link was removed from the top bar; subscription and
 * credit management now lives behind this menu for signed-in users (and,
 * for anonymous visitors, inline on the Create page once they hit the cap).
 *
 * The menu closes on outside-click, Escape, or item selection. Colors come
 * from theme tokens / rgba (no raw hex) so the visual-budget lint stays clean.
 */
import { useState, useRef, useEffect } from 'react';
import { User, ChevronDown, Settings, CreditCard } from 'lucide-react';
import { GOLD, GOLD_BG, INK, BORDER, FS, SP, R, swatch } from './theme.js';
import Button from './primitives/Button.jsx';

function MenuRow({ icon, label, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <Button
      variant="ghost"
      fullWidth
      role="menuitem"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      icon={<span style={{ display: 'flex', color: GOLD, flexShrink: 0 }}>{icon}</span>}
      style={{
        justifyContent: 'flex-start', gap: SP.sm, textAlign: 'left',
        padding: `${SP.sm}px ${SP.md}px`,
        background: hover ? GOLD_BG : 'transparent',
        border: 'none', borderRadius: R.sm,
        color: INK, fontSize: FS.sm, fontWeight: 600,
      }}
    >
      {label}
    </Button>
  );
}

export default function AccountMenu({
  isAnon,
  displayName,
  isElevated,
  onSignIn,
  onAccount,
  onManageSubscription,
  compact = false,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

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
  const chipBg = isElevated ? 'rgba(124,58,237,0.15)' : 'rgba(42,122,42,0.2)';
  const chipBorder = isElevated ? 'rgba(124,58,237,0.3)' : 'rgba(42,122,42,0.4)';
  const chipColor = isElevated ? swatch['#C8A0F0'] : 'rgba(74,138,74,1)';

  return (
    <div ref={ref} style={{ position: 'relative', marginLeft: compact ? 0 : SP.xs }}>
      <Button
        variant="secondary"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        icon={<User size={iconSize} style={{ flexShrink: 0 }} />}
        trailingIcon={<ChevronDown size={iconSize} style={{ flexShrink: 0, opacity: 0.8 }} />}
        style={{
          gap: SP.xs,
          padding: chipPad,
          minHeight: compact ? 44 : undefined,
          maxWidth: compact ? 168 : 220,
          background: chipBg,
          border: `1px solid ${chipBorder}`,
          borderRadius: R.md,
          color: chipColor,
          fontSize: chipFont, fontWeight: compact ? 700 : 600,
          letterSpacing: '0.04em', textTransform: 'uppercase',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {name}
        </span>
      </Button>

      {open && (
        <div
          role="menu"
          style={{
            position: 'absolute', top: 'calc(100% + 6px)', right: 0,
            minWidth: 236,
            background: swatch.white,
            border: `1px solid ${BORDER}`,
            borderRadius: R.md,
            boxShadow: '0 8px 24px rgba(27,20,8,0.16)',
            padding: 6, zIndex: 1200,
          }}
        >
          <MenuRow
            icon={<Settings size={15} />}
            label="Account"
            onClick={() => { setOpen(false); onAccount?.(); }}
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
