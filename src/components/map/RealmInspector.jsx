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

import { Suspense, lazy, useMemo } from 'react';
import { LayoutDashboard, Swords, Sparkles, Zap, Newspaper, X } from 'lucide-react';

import { useStore } from '../../store/index.js';
import { nameMapFromSaves } from './WorldPulseData.js';
import { hasLiveWarState } from '../../domain/display/warStatus.js';
import { hasPantheon } from './PantheonPanel.jsx';
import { BORDER, BORDER2, CARD, CARD_ALT, FS, INK, MUTED, R, SP, sans } from '../theme.js';
import { IconButton } from './IconButton.jsx';

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
  { id: 'war',       label: 'War & Diplomacy', Icon: Swords },
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
 */
export default function RealmInspector({
  open, section, onSection, onClose,
  campaign, canManageCampaigns, tier, onUpgrade,
}) {
  const saves = useStore(s => s.savedSettlements);
  const nameById = useMemo(() => nameMapFromSaves(saves), [saves]);
  const showPantheon = hasPantheon(campaign);

  // The Pantheon tab self-hides while religion is dormant. If the user is parked
  // on it when it disappears, fall the visible section back to the dashboard.
  const sections = REALM_INSPECTOR_SECTIONS.filter(s => s.id !== 'pantheon' || showPantheon);
  const activeSection = sections.some(s => s.id === section) ? section : 'dashboard';

  if (!open) return null;

  return (
    <aside
      data-testid="realm-inspector"
      aria-label="Realm Inspector"
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
      <header style={{
        display: 'flex', alignItems: 'center', gap: SP.sm,
        padding: `${SP.sm}px ${SP.md}px`,
        borderBottom: `1px solid ${BORDER}`,
        background: CARD,
      }}>
        <span style={{ flex: 1, color: INK, fontFamily: sans, fontSize: FS.sm, fontWeight: 950 }}>
          Realm Inspector
        </span>
        <IconButton onClick={onClose} title="Close inspector">
          <X size={14} />
        </IconButton>
      </header>

      <div style={{
        display: 'flex', gap: 6, flexWrap: 'wrap',
        padding: `${SP.sm}px ${SP.md}px`,
        borderBottom: `1px solid ${BORDER2}`,
        background: CARD,
      }}>
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

      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: SP.md }}>
        <Suspense fallback={<div style={{ color: MUTED, fontFamily: sans, fontSize: FS.sm }}>Loading…</div>}>
          {activeSection === 'dashboard' && (
            <RealmDashboard
              campaign={campaign}
              canManageCampaigns={canManageCampaigns}
              tier={tier}
              onUpgrade={onUpgrade}
            />
          )}
          {activeSection === 'war' && (
            campaign
              ? <WarSection campaign={campaign} nameById={nameById} />
              : <Empty text="Select a campaign to see its war & diplomacy." />
          )}
          {activeSection === 'pantheon' && showPantheon && (
            <PantheonSection campaign={campaign} />
          )}
          {activeSection === 'pulse' && (
            campaign
              ? <WorldPulsePanel campaign={campaign} />
              : <Empty text="Select a campaign and advance the realm to see pulse results." />
          )}
          {activeSection === 'chronicle' && (
            campaign
              ? <ChronicleSection campaign={campaign} nameById={nameById} />
              : <Empty text="Select a campaign to read its chronicle." />
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

function Empty({ text }) {
  return (
    <div style={{
      padding: SP.md, border: `1px dashed ${BORDER2}`, borderRadius: R.md,
      color: MUTED, fontFamily: sans, fontSize: FS.xs, fontWeight: 750, lineHeight: 1.5,
    }}>
      {text}
    </div>
  );
}
