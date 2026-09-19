/**
 * AccountMenu.jsx: the header's identity control, on the painted arrow's blank brass plate.
 *
 * THE PLATE (owner orders 2026-09-16: the header is the owner's arrow painting). The account
 * lives on the arrow's blank brass plate at every width. Live text straight on the brass
 * fails AA (INK measured 4.03:1 at the plate's median and 2.49:1 at its dark end; white 2.93:1
 * on the highlights), so the text sits on a PARCH_100 label slip inset between the plate's
 * rivets (arrowGeometry.js SLIP): INK text on parchment, with a 1 px rule whose colour
 * carries status. The control itself is the whole plate (a transparent components/nav/
 * ArrowControl), so the target stays as large as the brass.
 *
 *   - Signed out: the slip reads "Sign In" in capitals (the control's accessible name,
 *     unchanged) and opens the sign-in modal. The rule is GOLD_TXT.
 *   - Signed in: the slip shows the display name (or "Developer" / "Account") as written, no
 *     capitals and no letter-spacing, and the control opens this menu. A name wider than the
 *     slip first steps its type down, half a pixel at a time, to SLIP_FLOOR; only a name
 *     still too wide there ends in an ellipsis, and the full name stays in the plate's
 *     accessible name and in a title on the text. The plate's name is "Account menu" plus
 *     the visible name when there is one, plus the unread count, so the visible text is
 *     inside the accessible name (WCAG 2.5.3). The rule is GREEN for members and SLATE for
 *     elevated accounts; the unread badge sits on the slip's corner.
 *
 * THE MENU drops below the plate, right-aligned to it, inside the header, and shifts right
 * only as far as it must to keep MENU_W clear of the page's left edge (a phone's plate sits
 * about three quarters of the way across, and at 320 px a right-aligned menu started off
 * the page). Rows, in order:
 *   - Account                        → the account page
 *   - Messages (with its badge)      → Account ▸ Messages
 *   - Manage subscription & credits  → pricing; the balance as trailing text, and the name
 *                                      ends ", N credits remaining" (the old header badge)
 *   - Upgrade, free tier only        → aria-disabled wearing AvailableAtLaunchPill while
 *                                      purchases are closed (lib/launchGate.js), so arrow keys
 *                                      still reach it and it reads "Available at launch"
 *                                      (WAI-ARIA APG: a disabled menu item stays focusable);
 *                                      a click or Enter on it does nothing. Pricing once
 *                                      open. App passes the booleans; the tier comparison
 *                                      stays in App.jsx.
 *   - Developer Admin Panel, staff only → /admin. THE OWNER'S ORDER (ODQ §934.28):
 *                                      "since the arrow is filled up, move the developer
 *                                      tab that existed in the previous header to part of
 *                                      the dropdown under account for developers and
 *                                      admin". The retired header carried it as a Shield
 *                                      IconButton in the right cluster, titled "Developer
 *                                      Admin Panel" (App.jsx before e22f9e329); the arrow
 *                                      left no room for it, and the row it became here
 *                                      wore neither that name nor that icon, so the owner
 *                                      could not find the tab they had asked to be moved.
 *                                      IT NOW CARRIES THE NAME — AND DELIBERATELY NOT THE
 *                                      SHIELD. The icons-off gate (primitives/
 *                                      IconsContext.js) suppresses lucide everywhere but
 *                                      the Realm map, and Button drops its `icon` prop
 *                                      when the gate is off, so THIS MENU'S FOUR ICONS
 *                                      (Settings, CreditCard, MessageSquare and the
 *                                      Shield a §934.28 draft added here) never reach the
 *                                      DOM at all — the menu renders outside the map's
 *                                      Provider. Adding a fifth dead glyph to make the row
 *                                      "match its siblings" would have matched them in
 *                                      source and in nothing a reader sees. The three
 *                                      standing ones are left alone: removing them is a
 *                                      separate, wider cleanup than this order.
 *                                      Its presence is decided by the account's ROLE
 *                                      rather than its tier — staff identity, never the
 *                                      paid unlock, so revoking §934.28's unlock cannot
 *                                      take the admin panel away (lib/staffEntitlements.js).
 *
 * THE MENU-BUTTON PATTERN, complete: Enter, Space or ArrowDown on the plate opens the menu
 * and focuses the first row (ArrowUp, the last); ArrowUp / ArrowDown / Home / End move among
 * every row, the locked one included, and the rows are out of the Tab order; Escape or choosing a row
 * closes the menu and returns focus to the plate; Tab closes it and moves on; a mousedown
 * outside closes it. aria-controls names the open menu, which is labelled by the plate.
 *
 * Colors come from theme tokens (no raw hex) so the visual-budget lint stays clean.
 *
 * @enforced-by tests/components/accountMenuRows.test.jsx
 */
import { useState, useRef, useEffect, useId, useLayoutEffect } from 'react';
import { Settings, CreditCard, MessageSquare } from 'lucide-react';
import {
  GOLD, GOLD_BG, GOLD_TXT, GREEN, INK, BORDER, FS, PARCH_100, SLATE, SP, sans, swatch,
} from './theme.js';
import Button from './primitives/Button.jsx';
import AvailableAtLaunchPill from './primitives/AvailableAtLaunchPill.jsx';
import ArrowControl from './nav/ArrowControl.jsx';
import { padTarget, slipFont } from './nav/arrowGeometry.js';
import { PHONE_CHROME_FLOOR } from '../design/proseScale.js';
import UnreadMessageBadge, { unreadMessagesLabel } from './account/UnreadMessageBadge.jsx';
import { useOperatorMessages } from './account/OperatorMessagesProvider.jsx';

/**
 * ⛔ THE DEV-ONLY PREVIEW PERSONA MARKER (ODQ §934.35). The owner asked for "a
 * dummy admin account for our preview purposes only"; store/authSlice.js seats
 * the ROLE from VITE_PREVIEW_ROLE while the SESSION stays whatever it really is,
 * and nothing is ever claimed to the server. A preview that LOOKS like a real
 * admin session and is not one must say so on its face, or someone will read a
 * screenshot as proof that production works — so the menu wears this.
 *
 * Computed at MODULE level, not in the component: `import.meta.env.DEV` is the
 * literal `false` in a production build, so this folds to `null` and the JSX
 * below it folds away with it — no hook runs, no element is created, and the
 * variable's name never reaches the bundle
 * (tests/build/previewPersonaAbsent.test.js).
 *
 * It deliberately re-reads the env rather than reading the store: the authority
 * is authSlice's resolveRole, this is a LABEL, and a label that could disagree
 * with the store by being wired to it is worse than one that cannot.
 */
const PREVIEW_PERSONA_LABEL = import.meta.env.DEV && import.meta.env.MODE !== 'test' && import.meta.env.VITE_PREVIEW_ROLE
  ? `PREVIEW PERSONA \u00b7 ${String(import.meta.env.VITE_PREVIEW_ROLE).trim()}`
  : null;

/** @param {number} n */
const px = (n) => `${n}px`;

// The slip's type size is a fact about the PAINTING, so it lives with the painting's
// other numbers (nav/arrowGeometry.js `slipFont`) — which also lets the phone-floor
// census execute it without mounting a React tree. Its registered sub-floor exception
// (ODQ §934.26) is written out there, beside the geometry that forces it.

/**
 * The smallest size a signed-in name steps down to before it takes an ellipsis: the house
 * scale's 8 px step (measured in Nunito Bold: an 8-letter name fits whole on the phone slip
 * from 375 px up, at 390 at 8.5 px, and at 1024 px at 11 px).
 */
export const SLIP_FLOOR = FS.nano;

/** The widest the menu renders (a four-digit balance measured 284 px), plus slack. */
export const MENU_W = 292;

/**
 * How far right the menu shifts from the plate's right edge: only as far as keeps MENU_W and
 * an 8 px margin inside the page's left edge, and never past the page's right edge.
 * @param {number} plateRight - the plate's right edge, CSS px
 * @param {number} width - the page width
 */
export const menuShift = (plateRight, width) => Math.max(0, Math.min(8 + MENU_W - plateRight, width - 8 - plateRight));

function MenuRow({ icon = null, label, onClick, badge = null, trailing = null, ariaLabel, locked = false, children = null }) {
  const [hover, setHover] = useState(false);
  return (
    <Button
      variant="ghost"
      fullWidth
      role="menuitem"
      tabIndex={-1}
      aria-label={ariaLabel}
      aria-disabled={locked || undefined}
      onClick={locked ? undefined : onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      icon={icon && <span style={{ display: 'flex', color: GOLD, flexShrink: 0 }}>{icon}</span>}
      style={{
        justifyContent: 'flex-start', gap: SP.sm, textAlign: 'left',
        padding: `${SP.sm}px ${SP.md}px`,
        background: hover && !locked ? GOLD_BG : 'transparent',
        border: 'none',
        color: INK, fontSize: FS.sm, fontWeight: 600,
        ...(locked ? { opacity: 0.62, cursor: 'not-allowed' } : null),
      }}
    >
      <span style={{ flex: 1 }}>{label}</span>
      {children}
      {trailing}
      {badge}
    </Button>
  );
}

/**
 * @param {{
 *   layout: import('./nav/arrowGeometry.js').ArrowLayout,
 *   roomy?: boolean,
 *   isAnon: boolean,
 *   displayName?: string | null,
 *   isElevated?: boolean,
 *   unreadCount?: number,
 *   creditBalance?: number,
 *   showUpgrade?: boolean,
 *   upgradeLocked?: boolean,
 *   onSignIn?: () => void,
 *   onAccount?: () => void,
 *   onMessages?: () => void,
 *   onManageSubscription?: () => void,
 *   onUpgrade?: () => void,
 *   onAdmin?: () => void,
 * }} props
 */
export default function AccountMenu({
  layout,
  roomy = false,
  isAnon,
  displayName,
  isElevated = false,
  unreadCount,
  creditBalance = 0,
  showUpgrade = false,
  upgradeLocked = true,
  onSignIn,
  onAccount,
  onMessages,
  onManageSubscription,
  onUpgrade,
  onAdmin,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const plateRef = useRef(null);
  const menuRef = useRef(null);
  /** Which row to focus once the menu has rendered: 'first', 'last' or null. */
  const pendingFocus = useRef(null);
  const menuId = useId();
  const plateId = useId();
  const { unreadCount: sharedUnreadCount, refresh: refreshMessages } = useOperatorMessages();
  const messageUnreadCount = unreadCount ?? sharedUnreadCount;

  const menuRows = () => [...(menuRef.current?.querySelectorAll('[role="menuitem"]') ?? [])];

  useEffect(() => {
    if (!open) return undefined;
    const onDocMouseDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      const inside = ref.current && ref.current.contains(document.activeElement);
      setOpen(false);
      if (inside) plateRef.current?.focus();
    };
    document.addEventListener('mousedown', onDocMouseDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!open || !pendingFocus.current) return;
    const rows = menuRows();
    const row = pendingFocus.current === 'last' ? rows[rows.length - 1] : rows[0];
    pendingFocus.current = null;
    row?.focus();
  }, [open]);

  // THE SAME FLOOR THE PAINTED WORDS TAKE (components/nav/ArrowHeader.jsx). Below about
  // 1255 px of page the painted band is under 40 px tall — 32.65 at 1024 — so the plate was
  // a smaller target on a laptop than the guideline floor while phones were already padded
  // to 44. Height only on a fine pointer: padTarget also re-centres x and grows width, and
  // the plate's box is the brass, which must not move.
  const plate = roomy
    ? padTarget(layout.hits.plate, 44, layout.width)
    : { ...layout.hits.plate, h: Math.max(layout.hits.plate.h, 40) };
  const slip = layout.hits.slip;
  const name = displayName || (isElevated ? 'Developer' : 'Account');
  const nameMax = slipFont(layout.s);
  const nameRef = useRef(null);
  const [nameSize, setNameSize] = useState(nameMax);

  // Fit a signed-in name to the slip: step the type down before any ellipsis, and again once
  // the web font has loaded (its widths differ from the fallback's).
  useLayoutEffect(() => {
    const el = nameRef.current;
    if (!el) return undefined;
    let live = true;
    const fit = () => {
      if (!live) return;
      let size = nameMax;
      el.style.fontSize = px(size);
      while (el.scrollWidth > el.clientWidth && size > SLIP_FLOOR) {
        size = Math.max(SLIP_FLOOR, size - 0.5);
        el.style.fontSize = px(size);
      }
      setNameSize(size);
    };
    fit();
    document.fonts?.ready.then(fit);
    return () => { live = false; };
  }, [name, nameMax, slip.w, isAnon]);
  // Status reads in the slip's RULE, never in a wash: slate for elevated accounts, green
  // for members, the house gold text step when signed out (tests/design/contrast.test.js).
  const rule = isAnon ? GOLD_TXT : isElevated ? SLATE : GREEN;

  const slipStyle = {
    position: 'absolute', pointerEvents: 'none', boxSizing: 'border-box',
    left: px(slip.x - plate.x), top: px(slip.y - plate.y), width: px(slip.w), height: px(slip.h),
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px',
    background: PARCH_100, border: `1px solid ${rule}`,
    color: INK, fontFamily: sans, fontWeight: 700, fontSize: slipFont(layout.s), lineHeight: 1,
    letterSpacing: layout.s >= 0.4 ? '0.04em' : '0.02em', textTransform: 'uppercase', whiteSpace: 'nowrap',
  };
  const plateBox = {
    position: 'absolute', left: px(plate.x), top: px(plate.y), width: px(plate.w), height: px(plate.h),
  };
  const control = { x: 0, y: 0, w: plate.w, h: plate.h };
  const glow = { ...layout.hits.glow.plate, x: layout.hits.glow.plate.x - plate.x, y: layout.hits.glow.plate.y - plate.y };

  if (isAnon) {
    return (
      <div ref={ref} data-sf-arrow-plate="" style={plateBox}>
        {/* ⭐ THE NAME IS ON THE CONTROL, NOT ONLY IN THE SLIP (ODQ §934.26). The plate
            was the one ArrowControl in the header deriving its accessible name from a
            text node — every other one (home, each painted word, the signed-in plate)
            carries an explicit label — so a slip that was ever hidden, replaced by a
            mark, or shrunk out of the accessibility tree would leave an anonymous
            button. The label is the painting's own capitals, so it is IDENTICAL to the
            visible text and WCAG 2.5.3 (Label in Name) holds exactly as before. */}
        <ArrowControl rect={control} glow={glow} paintedH={layout.bandPx} aria-label="Sign In" onClick={onSignIn}>
          <span style={slipStyle}>Sign In</span>
        </ArrowControl>
      </div>
    );
  }

  const close = () => setOpen(false);
  /** Close, hand focus back to the plate, then act. @param {(() => void) | undefined} fn */
  const choose = (fn) => () => {
    close();
    plateRef.current?.focus();
    fn?.();
  };
  const openWith = (which) => {
    if (!open) refreshMessages();
    pendingFocus.current = which;
    if (open) {
      const rows = menuRows();
      pendingFocus.current = null;
      (which === 'last' ? rows[rows.length - 1] : rows[0])?.focus();
    } else {
      setOpen(true);
    }
  };
  const toggleMenu = () => {
    if (!open) refreshMessages();
    setOpen((current) => !current);
  };
  const onPlateKey = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openWith('first');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      openWith('last');
    }
  };
  const onMenuKey = (e) => {
    const rows = menuRows();
    const at = rows.indexOf(document.activeElement);
    const move = { ArrowDown: at + 1, ArrowUp: at - 1, Home: 0, End: rows.length - 1 }[e.key];
    if (move !== undefined && rows.length) {
      e.preventDefault();
      rows[(move + rows.length) % rows.length].focus();
    } else if (e.key === 'Tab') {
      // Hand focus to the plate BEFORE the menu unmounts, so the browser's own Tab move
      // continues from the plate instead of restarting from the top of the document.
      plateRef.current?.focus();
      close();
    }
  };

  const plateLabel = unreadMessagesLabel(name === 'Account' ? 'Account menu' : `Account menu, ${name}`, messageUnreadCount);

  return (
    <div ref={ref} data-sf-arrow-plate="" style={plateBox}>
      <ArrowControl
        ref={plateRef}
        id={plateId}
        rect={control}
        glow={glow}
        paintedH={layout.bandPx}
        onClick={toggleMenu}
        onKeyDown={onPlateKey}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={plateLabel}
      >
        <span style={slipStyle}>
          <span
            ref={nameRef}
            title={name}
            style={{
              minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis',
              fontSize: nameSize, textTransform: 'none', letterSpacing: 'normal',
            }}
          >
            {name}
          </span>
          {!open && (
            <UnreadMessageBadge
              count={messageUnreadCount}
              style={{ position: 'absolute', right: -5, bottom: -5, pointerEvents: 'none', zIndex: 1 }}
            />
          )}
        </span>
      </ArrowControl>

      {open && (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-labelledby={plateId}
          tabIndex={-1}
          onKeyDown={onMenuKey}
          style={{
            position: 'absolute', top: 'calc(100% + 6px)', right: px(-menuShift(plate.x + plate.w, layout.width)),
            minWidth: Math.min(236, layout.width - 16), maxWidth: px(layout.width - 16),
            background: swatch.white,
            border: `1px solid ${BORDER}`,
            padding: 6, zIndex: 1200,
          }}
        >
          {PREVIEW_PERSONA_LABEL && (
            <div
              data-sf-preview-persona=""
              // A RULED NOTE IN THE PAGE'S OWN INK, NOT A TINTED WASH (the owner's tome
              // law). The slip started as a gold-tinted band, which is a dashboard's way of
              // saying "notice this" and reads as SaaS chrome inside a menu that is otherwise
              // parchment and rules. The scribe's way is the rule and the ink: the label sits
              // on the menu's own ground, in gold text over a gold rule, and carries the same
              // signal with one less surface. `GOLD_TXT` is the AA-measured gold ink.
              style={{
                padding: `4px ${SP.md}px`,
                marginBottom: 2,
                borderBottom: `1px solid ${GOLD_TXT}`,
                color: GOLD_TXT,
                fontFamily: sans,
                fontSize: PHONE_CHROME_FLOOR,
                fontWeight: 700,
                letterSpacing: '0.08em',
                whiteSpace: 'nowrap',
              }}
            >
              {PREVIEW_PERSONA_LABEL}
            </div>
          )}
          <MenuRow
            icon={<Settings size={15} />}
            label="Account"
            onClick={choose(onAccount)}
          />
          <MenuRow
            icon={<MessageSquare size={15} />}
            label="Messages"
            ariaLabel={unreadMessagesLabel('Messages', messageUnreadCount)}
            badge={<UnreadMessageBadge count={messageUnreadCount} />}
            onClick={choose(onMessages)}
          />
          <MenuRow
            icon={<CreditCard size={15} />}
            label="Manage subscription & credits"
            ariaLabel={`Manage subscription & credits, ${creditBalance} credits remaining`}
            trailing={<span data-sf-credit-balance="" style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{creditBalance} credits</span>}
            onClick={choose(onManageSubscription)}
          />
          {showUpgrade && (
            <MenuRow label="Upgrade" locked={upgradeLocked} onClick={choose(onUpgrade)}>
              {upgradeLocked && <AvailableAtLaunchPill style={{ marginLeft: 6 }} />}
            </MenuRow>
          )}
          {isElevated && (
            <MenuRow label="Developer Admin Panel" onClick={choose(onAdmin)} />
          )}
        </div>
      )}
    </div>
  );
}
