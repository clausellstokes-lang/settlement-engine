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
import { Suspense, lazy } from 'react';
import { SP, CHROME, bottomClearance } from '../theme.js';
import DesktopOnlyGate from '../primitives/DesktopOnlyGate.jsx';

const RealmDashboard = lazy(() => import('./RealmDashboard.jsx'));

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
      <DesktopOnlyGate
        variant="gate"
        title="The Realm is best explored on desktop"
        message="The world map is a hands-on canvas for placing settlements, advancing the realm, and charting routes, and those tools want a larger screen and a pointer. Open the Realm on a desktop to build and run your world. Below is a read-only look at the state of your realm."
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
