/**
 * RealmInspector.jsx — the Realm's right-dock inspector rail (UX Phase 4, plan §4.5).
 *
 * The OLD World Map body-swapped its campaign-workspace tabs (Pulse / News /
 * Pantheon) so the map vanished whenever a panel was open. The Realm Inspector
 * fixes that: it is a right-dock rail that OVERLAYS the map — the map stays mounted
 * underneath at all times (the body never swaps). Sections:
 *
 *   - dashboard  · Realm Dashboard (live summary | locked teaser for anon/free)
 *   - war        · War & Diplomacy (LiveWarStatus promoted out of the Pulse panel)
 *   - pantheon   · Pantheon (self-hides while religion is dormant)
 *   - pulse      · Pulse Results (the latest world-pulse digest)
 *   - chronicle  · Chronicle (Wizard News history)
 *
 * Node-focus filtering (clicking a settlement filters the rail to its egonet) is a
 * follow-up; the rail STRUCTURE is this phase's deliverable.
 *
 * Pure presentational shell. State (which section, open/closed) is owned by the
 * Realm container and passed in. Section bodies are lazy-loaded so the closed rail
 * costs nothing.
 */

import { Suspense, lazy, useMemo, useEffect } from 'react';
import { LayoutDashboard, Swords, Sparkles, Zap, Newspaper, X } from 'lucide-react';

import { useStore } from '../../store/index.js';
import { nameMapFromSaves } from './WorldPulseData.js';
import { hasLiveWarState } from '../../domain/display/warStatus.js';
import { hasPantheon } from './PantheonPanel.jsx';
import { BODY, BORDER, CARD, CARD_ALT, FS, R, SECOND, SP, sans } from '../theme.js';
import { IconButton } from './IconButton.jsx';
import CampaignEmptyState from './CampaignEmptyState.jsx';

const RealmDashboard = lazy(() => import('./RealmDashboard.jsx'));
const LiveWarStatus  = lazy(() => import('./LiveWarStatus.jsx'));
const PantheonPanel  = lazy(() => import('./PantheonPanel.jsx'));
const WorldPulsePanel = lazy(() => import('./WorldPulsePanel.jsx'));
const WizardNewsPanel = lazy(() => import('./WizardNewsPanel.jsx'));
const ChronicleScrollback = lazy(() => import('./ChronicleScrollback.jsx'));
const AssignDeityFromMap  = lazy(() => import('./AssignDeityFromMap.jsx'));

/** The inspector sections, in display order. `pantheon` self-hides when dormant. */
export const REALM_INSPECTOR_SECTIONS = Object.freeze([
  { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { id: 'war',       label: 'War and Diplomacy', Icon: Swords },
  { id: 'pantheon',  label: 'Pantheon', Icon: Sparkles },
  { id: 'pulse',     label: 'Pulse Results', Icon: Zap },
  { id: 'chronicle', label: 'Chronicle', Icon: Newspaper },
]);

function SectionTab({ active, label, Icon, onClick }) {
  return (
    <IconButton
      onClick={onClick}
      aria-pressed={active}
      active={active}
      title={label}
      // The rail's primary navigation earns the real 44px target from the size
      // scale (lg) rather than an inline minHeight patch, so the height survives
      // wrapping to a second flex row and matches the size-token discipline (P7).
      size="lg"
    >
      <Icon size={13} />{label}
    </IconButton>
  );
}

/**
 * @param {Object} props
 * @param {boolean} props.open
 * @param {string} props.section            active section id
 * @param {(id: string) => void} props.onSection
 * @param {() => void} props.onClose
 * @param {any} props.campaign
 * @param {boolean} props.canManageCampaigns
 * @param {string} props.tier
 * @param {() => void} [props.onUpgrade]
 * @param {() => void} [props.onCreateCampaign]  create a campaign (no campaigns exist)
 * @param {() => void} [props.onSelectCampaign]  select a campaign (some exist, none active)
 * @param {boolean} [props.hasCampaigns]  whether any selectable campaign exists
 */
export default function RealmInspector({
  open, section, onSection, onClose,
  campaign, canManageCampaigns, tier, onUpgrade,
  onCreateCampaign, onSelectCampaign, hasCampaigns = false,
  advancing = false,
}) {
  const saves = useStore(s => s.savedSettlements);
  const nameById = useMemo(() => nameMapFromSaves(saves), [saves]);
  const showPantheon = hasPantheon(campaign);

  // The Pantheon tab self-hides while religion is dormant. If the user is parked
  // on it when it disappears, fall the visible section back to the dashboard.
  const sections = REALM_INSPECTOR_SECTIONS.filter(s => s.id !== 'pantheon' || showPantheon);
  const activeSection = sections.some(s => s.id === section) ? section : 'dashboard';

  // When the displayed section falls back (e.g. the Pantheon tab self-hid while
  // the user was parked on it), reconcile the CONTAINER's stored selection so it
  // can't silently disagree with what the rail actually renders (P10/P2).
  useEffect(() => {
    if (section !== activeSection) onSection?.(activeSection);
  }, [section, activeSection, onSection]);

  if (!open) return null;

  // One shared empty-state handler bundle — every section's no-campaign state
  // gets the SAME actionable CTA recipe (P4 cohesion) instead of four divergent
  // dead-end strings.
  const emptyHandlers = { onCreateCampaign, onSelectCampaign, hasCampaigns };

  return (
    <aside
      data-testid="realm-inspector"
      aria-labelledby="realm-inspector-title"
      style={{
        position: 'absolute', top: SP.sm, right: SP.sm, bottom: SP.sm,
        zIndex: 40,
        width: 'min(420px, calc(100% - 24px))',
        display: 'flex', flexDirection: 'column',
        border: `1px solid ${BORDER}`,
        borderRadius: R.lg,
        background: CARD_ALT,
        boxShadow: '0 8px 32px rgba(0,0,0,0.28)',
        overflow: 'hidden',
      }}
    >
      {/* One tinted chrome block: title row and tab row share a single CARD
          tint, separated internally by gap, and exactly one rule divides the
          whole chrome from the scrolling body below (no false-floor stack). */}
      <div style={{
        display: 'grid', gap: SP.sm,
        padding: `${SP.sm}px ${SP.md}px`,
        borderBottom: `1px solid ${BORDER}`,
        background: CARD,
      }}>
        <header style={{ display: 'flex', alignItems: 'center', gap: SP.sm }}>
          {/* Quiet eyebrow, not a heading: the wrapper title competed with the
              section's own heading ("State of the Realm") for the single focal
              point (P4). Demoting it to a frame label lets the section heading
              be the one dominant entry point; the tab row already names the
              section, so this is scent, not a competing title. */}
          <h2 id="realm-inspector-title" style={{ flex: 1, margin: 0, color: SECOND, fontFamily: sans, fontSize: FS.xs, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Realm Inspector
          </h2>
          <IconButton onClick={onClose} title="Close inspector">
            <X size={14} />
          </IconButton>
        </header>

        {/* Kept as IconButton (size lg) tabs, NOT the Segmented primitive:
            Segmented tops out at size 'md' (~31px) and cannot meet the 44px
            touch target this dock guarantees, so we keep the lg tabs and only
            add the shared ARIA group wrapper. */}
        <div role="group" aria-label="Realm Inspector sections" style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {sections.map(s => (
            <SectionTab
              key={s.id}
              active={activeSection === s.id}
              label={s.label}
              Icon={s.Icon}
              onClick={() => onSection(s.id)}
            />
          ))}
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: SP.md }}>
        <Suspense fallback={<div style={{ color: BODY, fontFamily: sans, fontSize: FS.sm }}>Loading…</div>}>
          {activeSection === 'dashboard' && (
            <RealmDashboard
              campaign={campaign}
              canManageCampaigns={canManageCampaigns}
              tier={tier}
              onUpgrade={onUpgrade}
              nameById={nameById}
              {...emptyHandlers}
            />
          )}
          {activeSection === 'war' && (
            campaign
              ? <WarSection campaign={campaign} nameById={nameById} />
              : <CampaignEmptyState lead="War and diplomacy appears once a campaign is live." {...emptyHandlers} />
          )}
          {activeSection === 'pantheon' && (
            campaign
              ? <PantheonSection campaign={campaign} />
              : <CampaignEmptyState lead="The pantheon appears once a campaign is live." {...emptyHandlers} />
          )}
          {activeSection === 'pulse' && (
            campaign
              ? <WorldPulsePanel campaign={campaign} advancing={advancing} />
              : <CampaignEmptyState lead="Pulse results appear after you advance a live campaign's realm." {...emptyHandlers} />
          )}
          {activeSection === 'chronicle' && (
            campaign
              ? <ChronicleSection campaign={campaign} nameById={nameById} />
              : <CampaignEmptyState lead="The chronicle fills as a live campaign's realm advances." {...emptyHandlers} />
          )}
        </Suspense>
      </div>
    </aside>
  );
}

// Pantheon section — the deepened Pantheon panel + the assign-deity steering
// control (the ONE intervention in scope; the others are a documented follow-up).
function PantheonSection({ campaign }) {
  return (
    <div style={{ display: 'grid', gap: SP.md }}>
      <PantheonPanel campaign={campaign} />
      <AssignDeityFromMap campaign={campaign} />
    </div>
  );
}

// Chronicle section — the full scrollback (chronicles[] + pulseHistory[], scrubbable
// + per-tick diff + click-to-highlight) above the existing Wizard News feed.
function ChronicleSection({ campaign, nameById }) {
  const nameFor = (id) => nameById?.get(String(id)) || String(id);
  return (
    <div style={{ display: 'grid', gap: SP.md }}>
      <ChronicleScrollback campaign={campaign} nameFor={nameFor} />
      <WizardNewsPanel campaign={campaign} />
    </div>
  );
}

// War & Diplomacy section — LiveWarStatus is the live block; when nothing is live
// it returns null, so we show a calm peacetime note rather than a blank panel.
function WarSection({ campaign, nameById }) {
  return (
    <div style={{ display: 'grid', gap: SP.sm }}>
      <LiveWarStatus campaign={campaign} nameById={nameById} />
      <PeacetimeNote campaign={campaign} />
    </div>
  );
}

// Renders only when LiveWarStatus would render nothing (no live war state). A tiny
// peacetime acknowledgement so the section never reads as broken/empty. Uses the
// same pure gate (hasLiveWarState) LiveWarStatus uses internally.
function PeacetimeNote({ campaign }) {
  const worldState = campaign?.worldState || {};
  const regionalGraph = campaign?.regionalGraph || worldState.regionalGraph || null;
  if (hasLiveWarState({ worldState, regionalGraph })) return null;
  return <Empty text="The realm is at peace. No sieges, deployments, or trade wars are live." />;
}

// A calm empty/peacetime note. No dashed box — the section body padding already
// separates it, and a frame around one calm sentence is unearned chrome (P5).
// BODY (not MUTED) because this is the section's only sentence — load-bearing
// info, not chrome — so it must clear 4.5:1 (P7).
function Empty({ text }) {
  return (
    <div style={{
      padding: SP.sm,
      color: BODY, fontFamily: sans, fontSize: FS.xs, fontWeight: 750, lineHeight: 1.5,
    }}>
      {text}
    </div>
  );
}

