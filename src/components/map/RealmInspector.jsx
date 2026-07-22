/**
 * RealmInspector.jsx — THE HERALD (owner doctrine 2026-07-22, THE REALM INSPECTOR =
 * NEWSPAPER). The Realm's right-dock rail, rebuilt as a seven-section newspaper.
 *
 * THE PAPER (seven news doors): Dashboard (front page + prose session-prep) · War ·
 * Faith · Trade · Events · Divination (the forecast) · Adjudication (the decisions
 * desk). The old eleven doors consolidate here: Letter -> Dashboard prose mode,
 * Pantheon -> Faith, Treaties -> Trade, War & Resolve -> War, and the Pulse +
 * Chronicle CONTENT distributes into the topical doors via the routing table
 * (heraldFeed). History is a LENS, not a door — the time-lens toggle (this advance /
 * whole campaign) rides the chrome and scopes every report door.
 *
 * THE DESK (tools, kept OUT of the paper): Stage the Road + the Timelapse scrubber
 * move to a compact tools strip in the chrome; their panels are unchanged.
 *
 * Pure presentational shell. State (which section, open/closed, size) is owned by
 * the Realm container (useRealmInspector) and passed in. The section BODIES live in
 * HeraldBody; this file is the chrome. The overlay never body-swaps the map.
 */

import { Suspense, useMemo, useEffect, useState } from 'react';
import { LayoutDashboard, Swords, Sparkles, Coins, CalendarClock, Eye, Gavel, Route, History, X, Minus, Maximize2, Minimize2 } from 'lucide-react';

import { useStore } from '../../store/index.js';
import { nameMapFromSaves } from './WorldPulseData.js';
import { BODY, BORDER, BORDER2, CARD, CARD_ALT, FS, GOLD, SECOND, SP, sans } from '../theme.js';
import { IconButton } from './IconButton.jsx';
import { RealmEntityContext } from './RealmEntityContext.jsx';
import { useRealmEntityNav } from './useRealmEntityNav.js';
import HeraldBody from './HeraldBody.jsx';
import HeraldStrip from './HeraldStrip.jsx';
import { buildHeraldFeed } from './heraldFeed.js';
import { filterFeed } from './heraldFilter.js';
// THE DESK — the two tools, STATIC within this already-lazy chunk (FP-R class): a
// lazy() here would mint a preload-manifest entry and tip the first-paint ratchet.
import RoadScenePanel from './RoadScenePanel.jsx';
import TimelapsePanel from './TimelapsePanel.jsx';

/** THE NAME (manager decision 2026-07-22, owner-vetoable). One exported constant so a
 *  veto is a one-string change; never scatter the literal. */
export const HERALD_TITLE = 'The Herald';

/**
 * The seven news doors, in reading order. Unlike the old inspector, none self-hides:
 * a deity-free realm's Faith door shows its empty state (not a broken block), an
 * un-warred realm's War door shows peace. The old conditional tabs (pantheon /
 * treaty / resolve) fold their self-hide into the door body's empty/flag handling.
 */
export const REALM_INSPECTOR_SECTIONS = Object.freeze([
  { id: 'dashboard',    label: 'Dashboard',    Icon: LayoutDashboard },
  { id: 'war',          label: 'War',          Icon: Swords },
  { id: 'faith',        label: 'Faith',        Icon: Sparkles },
  { id: 'trade',        label: 'Trade',        Icon: Coins },
  { id: 'events',       label: 'Events',       Icon: CalendarClock },
  { id: 'divination',   label: 'Divination',   Icon: Eye },
  { id: 'adjudication', label: 'Adjudication', Icon: Gavel },
]);

/** The desk tools (kept out of the paper). */
const DESK_TOOLS = Object.freeze([
  { id: 'road', label: 'Stage the Road', Icon: Route },
  { id: 'timelapse', label: 'Timelapse', Icon: History },
]);

/** Whether the campaign carries any live treaty (kept for external callers). */
export function hasTreaties(campaign) {
  const ledger = campaign?.worldState?.spatialLedgers?.treaties;
  return !!ledger && typeof ledger === 'object' && Object.keys(ledger).length > 0;
}

function SectionTab({ active, label, Icon, count = null, onClick }) {
  return (
    <IconButton onClick={onClick} aria-pressed={active} active={active} title={label} size="lg">
      <Icon size={13} />{label}
      {count != null && (
        <span
          data-testid="herald-tab-count"
          style={{
            marginLeft: 2, minWidth: 15, textAlign: 'center', padding: '0 4px',
            border: `1px solid ${BORDER2}`, background: CARD,
            color: count === 0 ? BODY : GOLD, opacity: count === 0 ? 0.55 : 1,
            fontFamily: sans, fontSize: FS.micro, fontWeight: 900,
          }}
        >
          {count}
        </span>
      )}
    </IconButton>
  );
}

/**
 * @param {Object} props
 * @param {boolean} props.open
 * @param {string} props.section
 * @param {(id: string) => void} props.onSection
 * @param {() => void} props.onClose
 * @param {any} props.campaign
 * @param {boolean} props.canManageCampaigns
 * @param {string} props.tier
 * @param {() => void} [props.onUpgrade]
 * @param {() => void} [props.onCreateCampaign]
 * @param {() => void} [props.onSelectCampaign]
 * @param {boolean} [props.hasCampaigns]
 * @param {boolean} [props.advancing]
 * @param {'min'|'default'|'expanded'} [props.inspectorSize]
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
  // THE NEWS ADDRESS LAW: the realm-wide entity web + cross-settlement navigator,
  // provided to every section body so a named entity renders as a live link.
  const realmNav = useRealmEntityNav();

  // View state (not persisted; survives section switches while the rail is mounted):
  // the time LENS scopes every report door; the desk TOOL takes over the body.
  const [timeLens, setTimeLens] = useState('advance');
  const [deskTool, setDeskTool] = useState(/** @type {string|null} */ (null));
  // The filter/focus strip state. FOCUS is the store-global selectedSettlementId (the
  // local edition — round-trips with the map click); the rest is local strip state.
  const focusId = useStore(s => s.selectedSettlementId);
  const clearFocus = useStore(s => s.clearSelectedSettlementId);
  const [query, setQuery] = useState('');
  const [attentionOn, setAttentionOn] = useState(false);
  const [filterBand, setFilterBand] = useState(/** @type {string|null} */ (null));
  const [showFilters, setShowFilters] = useState(false);

  // The section-filed feed under the current lens, then narrowed by focus ∩ search ∩
  // attention ∩ severity. Counts feed the per-door badges.
  const feed = useMemo(() => buildHeraldFeed(campaign, { lens: timeLens }), [campaign, timeLens]);
  const filtered = useMemo(
    () => filterFeed(feed, { focusId, query, attention: attentionOn, band: filterBand, nameById }),
    [feed, focusId, query, attentionOn, filterBand, nameById],
  );
  const focusName = focusId != null ? (nameById.get(String(focusId)) || String(focusId)) : '';
  const narrowing = focusId != null || !!query || attentionOn || !!filterBand;

  const sections = REALM_INSPECTOR_SECTIONS;
  const activeSection = sections.some(s => s.id === section) ? section : 'dashboard';

  // Reconcile a fallen-back section with the container's stored selection (P10/P2).
  useEffect(() => {
    if (section !== activeSection) onSection?.(activeSection);
  }, [section, activeSection, onSection]);

  const expanded = inspectorSize === 'expanded';
  const minimized = inspectorSize === 'min';
  useEffect(() => {
    if (!expanded) return undefined;
    const onKeyDown = (e) => { if (e.key === 'Escape') onSetSize?.('default'); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [expanded, onSetSize]);

  if (!open) return null;

  const emptyHandlers = { onCreateCampaign, onSelectCampaign, hasCampaigns };

  const sizeStyle = expanded
    ? { top: SP.sm, left: SP.sm, right: SP.sm, bottom: SP.sm, width: 'auto' }
    : minimized
      ? { top: SP.sm, right: SP.sm, width: 'min(280px, calc(100% - 24px))' }
      : { top: SP.sm, right: SP.sm, bottom: SP.sm, width: 'min(420px, calc(100% - 24px))' };

  const activeDeskTool = deskTool ? DESK_TOOLS.find(d => d.id === deskTool) : null;

  return (
    <aside
      data-testid="realm-inspector"
      aria-labelledby="realm-inspector-title"
      data-expanded={expanded}
      style={{
        position: 'absolute',
        zIndex: 40,
        ...sizeStyle,
        display: 'flex', flexDirection: 'column',
        border: `1px solid ${BORDER}`,
        background: CARD_ALT,
        overflow: 'hidden',
      }}
    >
      {minimized ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, padding: `${SP.xs}px ${SP.sm}px`, background: CARD }}>
          <h2 id="realm-inspector-title" style={{ margin: 0, color: SECOND, fontFamily: sans, fontSize: FS.xs, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
            {HERALD_TITLE}
          </h2>
          <div role="group" aria-label="Herald sections" style={{ display: 'flex', gap: 4, flex: 1, minWidth: 0, overflow: 'hidden' }}>
            {sections.map(s => (
              <IconButton key={s.id} onClick={() => onSection(s.id)} aria-pressed={activeSection === s.id} active={activeSection === s.id} title={s.label} size="md">
                <s.Icon size={14} />
              </IconButton>
            ))}
          </div>
          <ChromeControls expanded={expanded} onRestore={() => onSetSize?.('default')} onExpandToggle={() => onSetSize?.(expanded ? 'default' : 'expanded')} onClose={onClose} minimized />
        </div>
      ) : (
      <>
      <div style={{ display: 'grid', gap: SP.sm, padding: `${SP.sm}px ${SP.md}px`, borderBottom: `1px solid ${BORDER}`, background: CARD }}>
        <header style={{ display: 'flex', alignItems: 'center', gap: SP.sm }}>
          <h2 id="realm-inspector-title" style={{ flex: 1, margin: 0, color: SECOND, fontFamily: sans, fontSize: FS.xs, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {HERALD_TITLE}
          </h2>
          {/* THE DESK — the two tools, kept out of the paper. */}
          <div role="group" aria-label="Herald desk tools" style={{ display: 'flex', gap: SP.xs }}>
            {DESK_TOOLS.map(tool => (
              <IconButton
                key={tool.id}
                onClick={() => setDeskTool(deskTool === tool.id ? null : tool.id)}
                aria-pressed={deskTool === tool.id}
                active={deskTool === tool.id}
                title={tool.label}
              >
                <tool.Icon size={14} />
              </IconButton>
            ))}
          </div>
          <ChromeControls expanded={expanded} onRestore={() => onSetSize?.('default')} onExpandToggle={() => onSetSize?.(expanded ? 'default' : 'expanded')} onMinimize={() => onSetSize?.('min')} onClose={onClose} />
        </header>

        <div role="group" aria-label="Herald sections" style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {sections.map(s => (
            <SectionTab
              key={s.id}
              active={activeSection === s.id && !deskTool}
              label={s.label}
              Icon={s.Icon}
              count={narrowing && s.id !== 'dashboard' && s.id !== 'adjudication' ? (filtered.counts[s.id] ?? 0) : null}
              onClick={() => { setDeskTool(null); onSection(s.id); }}
            />
          ))}
        </div>

        {/* THE FILTER / FOCUS STRIP + THE TIME LENS — persist across door switches;
            scope every report door (hidden while the desk is open). */}
        {!deskTool && (
          <>
            <HeraldStrip
              query={query}
              onQuery={setQuery}
              focusId={focusId}
              focusName={focusName}
              onClearFocus={clearFocus}
              attentionOn={attentionOn}
              onToggleAttention={() => setAttentionOn(a => !a)}
              band={filterBand}
              onBand={setFilterBand}
              showFilters={showFilters}
              onToggleFilters={() => setShowFilters(f => !f)}
            />
            <div role="group" aria-label="Time lens" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span style={{ color: SECOND, fontFamily: sans, fontSize: FS.micro, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Lens</span>
              <LensButton active={timeLens === 'advance'} onClick={() => setTimeLens('advance')} label="This advance" />
              <LensButton active={timeLens === 'campaign'} onClick={() => setTimeLens('campaign')} label="Whole campaign" />
            </div>
          </>
        )}
      </div>

      {advancing && (
        <div role="status" style={{ padding: `${SP.xs}px ${SP.md}px`, borderBottom: `1px solid ${BORDER}`, background: CARD_ALT, color: GOLD, fontFamily: sans, fontSize: FS.xs, fontWeight: 800 }}>
          Advancing the realm… the paper updates when it settles.
        </div>
      )}

      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: SP.md }}>
       <RealmEntityContext.Provider value={realmNav}>
        <Suspense fallback={<div style={{ color: BODY, fontFamily: sans, fontSize: FS.sm }}>Loading…</div>}>
          {activeDeskTool ? (
            <DeskPanel tool={activeDeskTool} campaign={campaign} nameById={nameById} onClose={() => setDeskTool(null)} emptyHandlers={emptyHandlers} />
          ) : (
            <HeraldBody
              section={activeSection}
              campaign={campaign}
              feed={filtered}
              focusId={focusId}
              focusName={focusName}
              narrowing={narrowing}
              nameById={nameById}
              emptyHandlers={emptyHandlers}
              canManageCampaigns={canManageCampaigns}
              tier={tier}
              onUpgrade={onUpgrade}
            />
          )}
        </Suspense>
       </RealmEntityContext.Provider>
      </div>
      </>
      )}
    </aside>
  );
}

// The desk tool body (Stage the Road / Timelapse) — the panels are unchanged; only
// their MOUNT moved out of the paper into this chrome-launched view.
function DeskPanel({ tool, campaign, nameById, onClose, emptyHandlers }) {
  return (
    <div style={{ display: 'grid', gap: SP.sm }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm }}>
        <div style={{ flex: 1, color: SECOND, fontFamily: sans, fontSize: FS.micro, fontWeight: 850, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Desk · {tool.label}
        </div>
        <IconButton onClick={onClose} aria-label="Close the desk" size="sm"><X size={13} /></IconButton>
      </div>
      {!campaign ? (
        <DeskEmpty emptyHandlers={emptyHandlers} tool={tool} />
      ) : tool.id === 'road' ? (
        <RoadScenePanel campaign={campaign} />
      ) : (
        <TimelapsePanel campaign={campaign} nameFor={(id) => nameById?.get(String(id)) || String(id)} />
      )}
    </div>
  );
}

// The desk's calm no-campaign state.
function DeskEmpty({ emptyHandlers, tool }) {
  const lead = tool.id === 'road' ? 'Stage a road once a campaign is live.' : 'The timelapse replays a live campaign once it has advanced.';
  return (
    <div style={{ border: `1px dashed ${BORDER2}`, background: CARD_ALT, padding: SP.md, color: BODY, fontFamily: sans, fontSize: FS.sm, fontWeight: 700 }}>
      {lead}
      {emptyHandlers?.hasCampaigns && typeof emptyHandlers.onSelectCampaign === 'function' && (
        <div style={{ marginTop: SP.sm }}>
          <IconButton onClick={emptyHandlers.onSelectCampaign} title="Select a campaign"><LayoutDashboard size={13} /> Select a campaign</IconButton>
        </div>
      )}
    </div>
  );
}

function LensButton({ active, onClick, label }) {
  return (
    <IconButton onClick={onClick} aria-pressed={active} active={active} title={label} size="sm">
      {label}
    </IconButton>
  );
}

// The window-chrome control trio (minimize / expand-restore / close).
function ChromeControls({ expanded, minimized = false, onMinimize, onRestore, onExpandToggle, onClose }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: SP.xs }}>
      {minimized ? (
        <IconButton onClick={onRestore} aria-label="Restore inspector"><Maximize2 size={14} /></IconButton>
      ) : (
        <>
          {onMinimize && (
            <IconButton onClick={onMinimize} title="Minimize inspector" aria-label="Minimize inspector"><Minus size={14} /></IconButton>
          )}
          <IconButton onClick={onExpandToggle} title={expanded ? 'Restore inspector' : 'Expand inspector'} aria-label={expanded ? 'Restore inspector' : 'Expand inspector'} aria-expanded={expanded}>
            {expanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </IconButton>
        </>
      )}
      <IconButton onClick={onClose} title="Close inspector" aria-label="Close inspector"><X size={14} /></IconButton>
    </div>
  );
}
