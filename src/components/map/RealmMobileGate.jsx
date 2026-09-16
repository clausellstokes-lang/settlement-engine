/**
 * RealmMobileGate.jsx — the Realm's defer-to-desktop wall for phones.
 *
 * The Realm is a desktop map-editing canvas: a 240px drag-source palette, an FMG
 * pan/zoom iframe, drag-to-place, double-click-to-edit, and wide authoring
 * toolbars, none of which have a touch path. On phones (useIsMobile, the 640
 * breakpoint) WorldMap renders THIS instead of the full workspace — an honest
 * "open on desktop" wall plus a phone-safe companion. The default path remains
 * the read-only Realm Dashboard (its stat grids already stack at phone width).
 * While the internal Herald proof flag is on, that same slot becomes the
 * decision-capable Herald companion; map authoring stays unavailable. Each child
 * owns its anon/free locked state, so the reachable-on-mobile pricing moment
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
 * @param {Array<any>} [props.saves]            active campaign member saves for the flagged Herald
 * @param {() => void} [props.onCreateCampaign] empty-state: mint a campaign
 * @param {() => void} [props.onSelectCampaign] empty-state: select a campaign
 * @param {boolean} [props.hasCampaigns]        whether any campaign is selectable
 */
import { Suspense, lazy, useState } from 'react';
import {
  BODY, CHROME, FS, SP, bottomClearance, sans,
} from '../theme.js';
import { flag } from '../../lib/flags.js';
import DesktopOnlyGate from '../primitives/DesktopOnlyGate.jsx';
import Button from '../primitives/Button.jsx';

const RealmDashboard = lazy(() => import('./RealmDashboard.jsx'));
// The command brief remains behind its own lazy boundary. With the flag dark,
// the phone gate imports and renders the exact established Dashboard path.
const HeraldMobileCompanion = lazy(() => import('./HeraldMobileCompanion.jsx'));

const COPY_STATE_PRESENTATION = {
  idle: {
    button: 'Copy the desktop link',
    status: '',
  },
  copied: {
    button: 'Link copied. It will be waiting',
    status: 'Desktop link copied.',
  },
  error: {
    button: 'Copy failed. Try again',
    status: 'The desktop link could not be copied.',
  },
};

/** The gate-ending ACTION (law §7: every gate ends in an action — deep link /
 *  state-waits promise). Copies the realm's own URL for the desk session; the
 *  label confirms in place. Email-me-a-link and QR are recorded deferrals
 *  (backend send + a QR dependency respectively — census rows). */
function CopyRealmLink() {
  const [copyState, setCopyState] = useState('idle');
  const copyLink = async () => {
    try {
      const writeText = navigator.clipboard?.writeText;
      if (typeof writeText !== 'function') throw new Error('Clipboard unavailable');
      await writeText.call(navigator.clipboard, new URL('/realm', window.location.origin).href);
      setCopyState('copied');
    } catch {
      setCopyState('error');
    }
  };
  const presentation = COPY_STATE_PRESENTATION[copyState];

  return (
    <div>
      <Button size="sm" variant="secondary" onClick={copyLink}>
        {presentation.button}
      </Button>
      <span role="status" className="sr-only">
        {presentation.status}
      </span>
    </div>
  );
}

export default function RealmMobileGate({
  campaign, canManageCampaigns, tier, onUpgrade, nameById,
  saves = [],
  onCreateCampaign, onSelectCampaign, hasCampaigns = false,
}) {
  const commandBriefOn = flag('heraldCommandBrief');
  // A locked viewer keeps the exact established Dashboard path. Besides
  // preserving its teaser and pricing moment, this prevents the desktop gate
  // from promising touch Decisions that the account cannot execute.
  const commandCompanionAvailable = commandBriefOn && canManageCampaigns;
  const desktopLead = 'The Realm table is built for a bigger canvas. Placing settlements, advancing years, and charting routes want a desk and a pointer. Your world is saved and will be waiting, exactly here, when you next sit down at one.';
  const companionMessage = commandCompanionAvailable
    ? `${desktopLead} Below, the field companion lets you read the briefing and answer decisions without exposing map authoring.`
    : commandBriefOn
      ? `${desktopLead} Below, the field companion keeps the Realm's locked preview and its existing unlock path. Live decisions are not available on this account, and map authoring still waits for desktop.`
      : `${desktopLead} Below, the field companion: a read-only look at the living state of your realm.`;
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
        message={companionMessage}
        cta={<CopyRealmLink />}
      />
      {commandCompanionAvailable ? (
        <Suspense fallback={(
          <div role="status" style={{ color: BODY, fontFamily: sans, fontSize: FS.sm }}>
            Opening the Herald field companion…
          </div>
        )}>
          <HeraldMobileCompanion
            campaign={campaign}
            saves={saves}
            canManageCampaigns={canManageCampaigns}
            tier={tier}
            onUpgrade={onUpgrade}
            nameById={nameById}
            onCreateCampaign={onCreateCampaign}
            onSelectCampaign={onSelectCampaign}
            hasCampaigns={hasCampaigns}
          />
        </Suspense>
      ) : (
        // Preserve the pre-G-4 Dashboard boundary byte-for-byte. This is the
        // ratchet's existing imperceptible debt; only the newly added Herald
        // companion boundary above is perceptible and therefore narrated.
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
      )}
    </div>
  );
}
