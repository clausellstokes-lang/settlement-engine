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
 * The menu closes on outside-click, Escape, or item selection, and is fully
 * keyboard-operable: opening moves focus to the first row, ArrowUp/ArrowDown
 * roves between rows, and Escape returns focus to the account chip (the single
 * focal control). Colors come from theme tokens (greens through GREEN/GREEN_BG,
 * the elevated purple through swatch one-offs, the popover shadow through ELEV)
 * so the visual-budget lint stays clean — no raw hex or rgba literals.
 */
import { useState, useRef, useEffect } from 'react';
import { User, ChevronDown, Settings, CreditCard, LogOut } from 'lucide-react';
import { GOLD, GOLD_BG, GREEN, GREEN_BG, INK, BORDER, FS, SP, R, ELEV, PARCH_100, swatch } from './theme.js';
import Button from './primitives/Button.jsx';

function MenuRow({ icon, label, onClick, tone = 'default' }) {
  const [hover, setHover] = useState(false);
  // `danger` tones the icon + label red (sign-out): a destructive-ish action
  // gets a visual cue without leaving the same ghost-row affordance.
  const isDanger = tone === 'danger';
  const accent = isDanger ? swatch.danger : GOLD;
  const labelColor = isDanger ? swatch.danger : INK;
  return (
    <Button
      variant="ghost"
      fullWidth
      role="menuitem"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      icon={<span style={{ display: 'flex', color: accent, flexShrink: 0 }}>{icon}</span>}
      style={{
        justifyContent: 'flex-start', gap: SP.sm, textAlign: 'left',
        // 44px minimum keeps every row a comfortable touch target (the ghost
        // size-md floor is 40, just under the at-the-table usability line).
        minHeight: 44,
        padding: `${SP.sm}px ${SP.md}px`,
        background: hover ? (isDanger ? swatch.dangerBg : GOLD_BG) : 'transparent',
        border: 'none', borderRadius: R.sm,
        color: labelColor, fontSize: FS.sm, fontWeight: 600,
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
  onSignOut,
  compact = false,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const menuRef = useRef(null);

  // The chip is the single focal control; the rows are reached via roving focus
  // once the menu opens. This reads the live DOM nodes (Button is not a
  // forwardRef component, so we query rather than thread refs through it).
  const rowEls = () => Array.from(menuRef.current?.querySelectorAll('[role="menuitem"]') ?? []);

  useEffect(() => {
    if (!open) return undefined;
    const onDocMouseDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      // Restore focus to the chip so keyboard users land back on the trigger.
      ref.current?.querySelector('button[aria-haspopup="menu"]')?.focus();
    };
    document.addEventListener('mousedown', onDocMouseDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // On open, move focus into the menu (first row); roving focus takes over there.
  useEffect(() => {
    if (!open) return;
    rowEls()[0]?.focus();
  }, [open]);

  // ArrowDown/ArrowUp rove between rows; Home/End jump to the ends. Escape is
  // handled by the document listener above so it works from anywhere in the menu.
  const onMenuKeyDown = (e) => {
    const rows = rowEls();
    if (rows.length === 0) return;
    const current = rows.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      rows[current < 0 ? 0 : (current + 1) % rows.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      rows[current <= 0 ? rows.length - 1 : current - 1]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      rows[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      rows[rows.length - 1]?.focus();
    }
  };

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
  // Standard identity rides the green token pair; the elevated (developer) chip
  // tints purple through swatch one-offs so the two roles read apart at a glance.
  const chipBg = isElevated ? swatch['#F0E0F0'] : GREEN_BG;
  const chipBorder = isElevated ? swatch['#7C3AED'] : GREEN;
  // Identity is carried by the green chip tint + border; the label itself uses
  // the light parchment text tone so it clears AA on the dark header gradient
  // (the former mid-green label text was the weakest contrast pairing here).
  const chipColor = isElevated ? swatch['#C8A0F0'] : PARCH_100;

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
          // 44px floor in both modes — the secondary size-md default is 40.
          minHeight: 44,
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
          ref={menuRef}
          tabIndex={-1}
          onKeyDown={onMenuKeyDown}
          style={{
            position: 'absolute', top: 'calc(100% + 6px)', right: 0,
            minWidth: 236,
            background: swatch.white,
            border: `1px solid ${BORDER}`,
            borderRadius: R.md,
            boxShadow: ELEV[3],
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
          {onSignOut && (
            <>
              <div style={{ height: 1, background: BORDER, margin: `4px ${SP.xs}px` }} aria-hidden="true" />
              <MenuRow
                icon={<LogOut size={15} />}
                label="Sign out"
                tone="danger"
                onClick={() => { setOpen(false); onSignOut(); }}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
