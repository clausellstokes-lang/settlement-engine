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
import { LayoutDashboard, Swords, Sparkles, Zap, Newspaper, HeartHandshake, X, Minus, Maximize2, Minimize2 } from 'lucide-react';

import { useStore } from '../../store/index.js';
import { flag } from '../../lib/flags.js';
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
const WarResolveSection = lazy(() => import('./WarResolveSection.jsx'));

/**
 * The inspector sections, in display order. `pantheon` self-hides when dormant;
 * `resolve` (the War & Resolve surfacing tab) appears only under the
 * warEconomySurfacing flag (default off ⇒ the rail is byte-identical).
 */
export const REALM_INSPECTOR_SECTIONS = Object.freeze([
  { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { id: 'war',       label: 'War and Diplomacy', Icon: Swords },
  { id: 'resolve',   label: 'War & Resolve', Icon: HeartHandshake },
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
 * @param {'min'|'default'|'expanded'} [props.inspectorSize]  the dock's size state
 * @param {(size: 'min'|'default'|'expanded') => void} [props.onSetSize]
 */
export default function RealmInspector({
  open, section, onSection, onClose,
  campaign, canManageCampaigns, tier, onUpgrade,
  onCreateCampaign, onSelectCampaign, hasCampaigns = false,
  advancing = false,
  inspectorSize = 'default', onSetSize,
}) {
  const saves = useStore(s => s.savedSettlements);
  const nameById = useMemo(() => nameMapFromSaves(saves), [saves]);
  const showPantheon = hasPantheon(campaign);
  const showResolve = flag('warEconomySurfacing');

  // The Pantheon tab self-hides while religion is dormant; the War & Resolve tab
  // appears only under its flag. If the user is parked on a tab that disappears,
  // the activeSection fallback below re-homes them to the dashboard.
  const sections = REALM_INSPECTOR_SECTIONS.filter(s =>
    (s.id !== 'pantheon' || showPantheon) && (s.id !== 'resolve' || showResolve));
  const activeSection = sections.some(s => s.id === section) ? section : 'dashboard';

  // When the displayed section falls back (e.g. the Pantheon tab self-hid while
  // the user was parked on it), reconcile the CONTAINER's stored selection so it
  // can't silently disagree with what the rail actually renders (P10/P2).
  useEffect(() => {
    if (section !== activeSection) onSection?.(activeSection);
  }, [section, activeSection, onSection]);

  // Esc restores the expanded dock to 'default' (plan §5). It fires ONLY while
  // expanded so it never competes with other Esc-dismissable overlays, and it
  // does NOT trap focus — the inspector overlays the map but isn't modal.
  const expanded = inspectorSize === 'expanded';
  const minimized = inspectorSize === 'min';
  useEffect(() => {
    if (!expanded) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onSetSize?.('default');
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [expanded, onSetSize]);

  if (!open) return null;

  // One shared empty-state handler bundle — every section's no-campaign state
  // gets the SAME actionable CTA recipe (P4 cohesion) instead of four divergent
  // dead-end strings.
  const emptyHandlers = { onCreateCampaign, onSelectCampaign, hasCampaigns };

  // Per-state container geometry (plan §3). The overlay is absolutely positioned
  // INSIDE the map-body container, which sits BELOW the toolbar card — so even
  // the expanded edge-to-edge width cannot reach the toolbar's Advance / Save /
  // More cluster. 'expanded' is symmetric (left+right SP.sm → calc(100% - 16px))
  // so it reads as "covers the map" without an off-centre lean. 'min' is a slim
  // top-right peek-bar: auto height, docked at the top, body hidden.
  const sizeStyle = expanded
    ? { top: SP.sm, left: SP.sm, right: SP.sm, bottom: SP.sm, width: 'auto' }
    : minimized
      ? { top: SP.sm, right: SP.sm, width: 'min(280px, calc(100% - 24px))' }
      : { top: SP.sm, right: SP.sm, bottom: SP.sm, width: 'min(420px, calc(100% - 24px))' };

  return (
    <aside
      data-testid="realm-inspector"
      aria-labelledby="realm-inspector-title"
      // The expanded state is exposed on the expand/restore disclosure control
      // below (the WAI-ARIA pattern: aria-expanded belongs on the trigger, not
      // the implicit `complementary` landmark, which doesn't support it).
      // data-expanded keeps the state queryable for styling/tests.
      data-expanded={expanded}
      style={{
        position: 'absolute',
        zIndex: 40,
        ...sizeStyle,
        display: 'flex', flexDirection: 'column',
        border: `1px solid ${BORDER}`,
        borderRadius: R.lg,
        background: CARD_ALT,
        boxShadow: '0 8px 32px rgba(0,0,0,0.28)',
        overflow: 'hidden',
      }}
    >
      {/* The header's window-chrome trio (minimize / expand-restore / close) is
          factored into ChromeControls below so the full header and the peek-bar
          render the same controls (P11 cross-surface consistency). */}
      {minimized ? (
        // 'min' peek-bar: a slim top-right strip. Title + icon-only section pills
        // + the chrome trio in a single row; the scrolling body is NOT rendered,
        // so the minimized dock costs nothing and uncovers the map.
        <div style={{
          display: 'flex', alignItems: 'center', gap: SP.sm,
          padding: `${SP.xs}px ${SP.sm}px`,
          background: CARD,
        }}>
          <h2 id="realm-inspector-title" style={{ margin: 0, color: SECOND, fontFamily: sans, fontSize: FS.xs, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
            Realm
          </h2>
          <div role="group" aria-label="Realm Inspector sections" style={{ display: 'flex', gap: 4, flex: 1, minWidth: 0, overflow: 'hidden' }}>
            {sections.map(s => (
              <IconButton
                key={s.id}
                onClick={() => onSection(s.id)}
                aria-pressed={activeSection === s.id}
                active={activeSection === s.id}
                title={s.label}
                size="md"
              >
                <s.Icon size={14} />
              </IconButton>
            ))}
          </div>
          <ChromeControls
            expanded={expanded}
            onRestore={() => onSetSize?.('default')}
            onExpandToggle={() => onSetSize?.(expanded ? 'default' : 'expanded')}
            onClose={onClose}
            minimized
          />
        </div>
      ) : (
      <>
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
          <ChromeControls
            expanded={expanded}
            onRestore={() => onSetSize?.('default')}
            onExpandToggle={() => onSetSize?.(expanded ? 'default' : 'expanded')}
            onMinimize={() => onSetSize?.('min')}
            onClose={onClose}
          />
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
          {activeSection === 'resolve' && (
            campaign
              ? <WarResolveSection campaign={campaign} saves={saves} nameById={nameById} />
              : <CampaignEmptyState lead="War & Resolve appears once a campaign is live." {...emptyHandlers} />
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
      </>
      )}
    </aside>
  );
}

// The window-chrome control trio (plan §4): minimize, expand/restore, close.
// Reuses the existing IconButton + lucide icons so it inherits the toolbar's
// pressed/hover treatment. `onMinimize` is omitted in the peek-bar (already
// minimized); each control carries an aria-label for the non-text icon.
function ChromeControls({ expanded, minimized = false, onMinimize, onRestore, onExpandToggle, onClose }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: SP.xs }}>
      {minimized ? (
        <IconButton onClick={onRestore} title="Restore inspector" aria-label="Restore inspector">
          <Maximize2 size={14} />
        </IconButton>
      ) : (
        <>
          {onMinimize && (
            <IconButton onClick={onMinimize} title="Minimize inspector" aria-label="Minimize inspector">
              <Minus size={14} />
            </IconButton>
          )}
          <IconButton
            onClick={onExpandToggle}
            title={expanded ? 'Restore inspector' : 'Expand inspector'}
            aria-label={expanded ? 'Restore inspector' : 'Expand inspector'}
            aria-expanded={expanded}
          >
            {expanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </IconButton>
        </>
      )}
      <IconButton onClick={onClose} title="Close inspector" aria-label="Close inspector">
        <X size={14} />
      </IconButton>
    </div>
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

