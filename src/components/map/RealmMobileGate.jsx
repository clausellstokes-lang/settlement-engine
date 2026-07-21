/**
 * RealmMobileGate.jsx — the Realm's defer-to-desktop wall for phones.
 *
 * The Realm is a desktop map-editing canvas: a 240px drag-source palette, an FMG
 * pan/zoom iframe, drag-to-place, double-click-to-edit, and wide authoring
 * toolbars, none of which have a touch path. On phones (useIsMobile, the 640
 * breakpoint) WorldMap renders THIS instead of the full workspace — an honest
 * "open on desktop" wall plus the one read-friendly component, the read-only
 * Realm Dashboard (its stat grids already stack at phone width). The dashboard
 * owns its own anon/free locked teaser, so the reachable-on-mobile pricing moment
 * behaves exactly as it does on desktop.
 *
 * Height is tokenized off the mobile chrome (slim top header + fixed bottom nav +
 * safe-area) rather than the desktop mapShellOffset, so the gate and dashboard
 * never render under the bottom nav.
 *
 * Pure presentational shell — every value is passed in by WorldMap, which holds
 * the campaign/auth/handler state. No store reads, no effects of its own.
 *
 * @param {Object} props
 * @param {any} props.campaign                 the active campaign (or null)
 * @param {boolean} props.canManageCampaigns   premium/elevated → live dashboard
 * @param {string} props.tier                  auth tier (drives the locked teaser)
 * @param {() => void} [props.onUpgrade]       route to the premium-value surface
 * @param {Map<string,string>} props.nameById  settlement-id → name for the dashboard
 * @param {() => void} [props.onCreateCampaign] empty-state: mint a campaign
 * @param {() => void} [props.onSelectCampaign] empty-state: select a campaign
 * @param {boolean} [props.hasCampaigns]        whether any campaign is selectable
 */
import { Suspense, lazy, useState } from 'react';
import { SP, CHROME, bottomClearance } from '../theme.js';
import DesktopOnlyGate from '../primitives/DesktopOnlyGate.jsx';
import Button from '../primitives/Button.jsx';

const RealmDashboard = lazy(() => import('./RealmDashboard.jsx'));

/** The gate-ending ACTION (law §7: every gate ends in an action — deep link /
 *  state-waits promise). Copies the realm's own URL for the desk session; the
 *  label confirms in place. Email-me-a-link and QR are recorded deferrals
 *  (backend send + a QR dependency respectively — census rows). */
function CopyRealmLink() {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      size="sm"
      variant="secondary"
      onClick={() => {
        try {
          navigator.clipboard?.writeText?.(new URL('/realm', window.location.origin).href);
          setCopied(true);
        } catch { /* clipboard unavailable — the label simply stays */ }
      }}
    >
      {copied ? 'Link copied. It will be waiting' : 'Copy the desktop link'}
    </Button>
  );
}

export default function RealmMobileGate({
  campaign, canManageCampaigns, tier, onUpgrade, nameById,
  onCreateCampaign, onSelectCampaign, hasCampaigns = false,
}) {
  return (
    <div
      data-testid="realm-mobile-gate"
      style={{
        display: 'flex', flexDirection: 'column', gap: SP.md,
        padding: SP.sm,
        minHeight: `calc(100vh - ${CHROME.headerMobile + CHROME.bottomNav}px)`,
        paddingBottom: bottomClearance(CHROME.bottomNav + SP.lg),
      }}
    >
      {/* Law §7 — gate the tool, never the data: capability-forward copy (the
          companion role named, the state-waits promise), and the gate ends in an
          action. The TITLE keeps its pinned wording (worldMapMobileGate.test.jsx
          asserts it — the tool wins; conflict recorded in the census). */}
      <DesktopOnlyGate
        variant="gate"
        title="The Realm is best explored on desktop"
        message="The Realm table is built for a bigger canvas. Placing settlements, advancing years, and charting routes want a desk and a pointer. Your world is saved and will be waiting, exactly here, when you next sit down at one. Below, the field companion: a read-only look at the living state of your realm."
        cta={<CopyRealmLink />}
      />
      <Suspense fallback={null}>
        <RealmDashboard
          campaign={campaign}
          canManageCampaigns={canManageCampaigns}
          tier={tier}
          onUpgrade={onUpgrade}
          nameById={nameById}
          onCreateCampaign={onCreateCampaign}
          onSelectCampaign={onSelectCampaign}
          hasCampaigns={hasCampaigns}
        />
      </Suspense>
    </div>
  );
}
