/**
 * AccountNav.jsx — the left-rail section chooser for the Account page.
 *
 * The account page used to stack seven sections in one long scroll, all sharing
 * the same hairline top-rule chrome with no way to jump between them. This shell
 * gives the page the left-sidebar ("bracket") settings shape the rest of a
 * polished app uses: a rail of section rows on the left, the active panel on the
 * right. It owns ONLY the chooser — the panels themselves stay rendered by
 * AccountPage, which is the state owner, so no props are re-threaded.
 *
 * Desktop (>=640): a vertical <nav> rail of ghost Button rows, each marked
 * aria-current="page" when active. The Developer-Admin row (elevated only) sits
 * below a hairline divider as a subordinate utility affordance.
 *
 * Mobile (<640): the rail reflows to the shipped MobileTabStrip — a horizontal,
 * overflow-aware tab row already floored at 44px with the WAI-ARIA tabs keyboard
 * pattern. No section is hidden; only the chooser changes shape (mobile = read +
 * light-act). The Developer-Admin row is appended as a trailing tab.
 *
 * @param {Object} props
 * @param {string} props.section                 active section id
 * @param {(id:string)=>void} props.setSection   section setter
 * @param {boolean} [props.isElevated=false]     show the Developer-Admin affordance
 * @param {() => void} [props.onNavigateAdmin]   admin-panel navigator
 */
import { Shield, ChevronRight } from 'lucide-react';
import useIsMobile from '../../hooks/useIsMobile.js';
import {
  INK, SECOND, MUTED, BORDER, GOLD_TXT, GOLD_SOFT, FS, R, SP, sans,
} from '../theme.js';
import { space } from '../../design/tokens.js';
import Button from '../primitives/Button.jsx';
import MobileTabStrip from '../primitives/MobileTabStrip.jsx';

/**
 * The canonical section order. Profile leads (the default landing section);
 * Subscription follows directly under identity as the one conversion surface.
 * @type {{id:string,label:string}[]}
 */
export const ACCOUNT_SECTIONS = [
  { id: 'profile', label: 'Profile' },
  { id: 'security', label: 'Security' },
  { id: 'subscription', label: 'Subscription' },
  { id: 'support', label: 'Support' },
  { id: 'data', label: 'Data' },
  { id: 'preferences', label: 'Preferences' },
];

/** Synthetic tab id for the elevated-only admin affordance on mobile. */
const ADMIN_TAB_ID = '__admin__';

export default function AccountNav({
  section,
  setSection,
  isElevated = false,
  onNavigateAdmin,
}) {
  const isMobile = useIsMobile();
  const showAdmin = Boolean(isElevated && onNavigateAdmin);

  // ── Mobile: the shipped tab strip, no section hidden ──────────────────────
  // The admin link rides as a trailing tab so the elevated affordance survives
  // the reflow; selecting it navigates away rather than switching a panel.
  if (isMobile) {
    const tabs = showAdmin
      ? [...ACCOUNT_SECTIONS, { id: ADMIN_TAB_ID, label: 'Admin' }]
      : ACCOUNT_SECTIONS;
    return (
      <MobileTabStrip
        tabs={tabs}
        value={section}
        ariaLabel="Account settings"
        idPrefix="account-nav"
        onChange={(id) => {
          if (id === ADMIN_TAB_ID) onNavigateAdmin();
          else setSection(id);
        }}
      />
    );
  }

  // ── Desktop: a vertical rail of ghost rows ────────────────────────────────
  return (
    <nav aria-label="Account settings" style={{ display: 'flex', flexDirection: 'column', gap: SP.xs }}>
      {ACCOUNT_SECTIONS.map(({ id, label }) => {
        const active = section === id;
        return (
          <Button
            key={id}
            variant="ghost"
            size="md"
            fullWidth
            onClick={() => setSection(id)}
            aria-current={active ? 'page' : undefined}
            style={{
              justifyContent: 'flex-start',
              textAlign: 'left',
              fontFamily: sans,
              fontWeight: active ? 800 : 600,
              color: active ? GOLD_TXT : SECOND,
              background: active ? GOLD_SOFT : 'transparent',
              borderRadius: R.lg,
            }}
          >
            <span style={{ flex: 1, textAlign: 'left' }}>{label}</span>
          </Button>
        );
      })}

      {showAdmin && (
        <>
          <div
            aria-hidden="true"
            style={{ borderTop: `1px solid ${BORDER}`, margin: `${space['space-7'] / 4}px 0` }}
          />
          <Button
            variant="ghost"
            size="md"
            fullWidth
            onClick={onNavigateAdmin}
            icon={<Shield size={16} color={SECOND} />}
            trailingIcon={<ChevronRight size={16} color={MUTED} style={{ marginLeft: 'auto' }} />}
            style={{ justifyContent: 'flex-start', fontFamily: sans, textAlign: 'left' }}
          >
            <span style={{ flex: 1, textAlign: 'left' }}>
              <span style={{ display: 'block', fontSize: FS.sm, fontWeight: 700, color: INK }}>Developer Admin Panel</span>
              <span style={{ display: 'block', fontSize: FS.xs, fontWeight: 400, color: SECOND }}>Manage users, credits, roles, and system configuration</span>
            </span>
          </Button>
        </>
      )}
    </nav>
  );
}
