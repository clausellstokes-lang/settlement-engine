/**
 * RealmInspector.jsx — THE HERALD (owner doctrine 2026-07-22, THE REALM INSPECTOR =
 * NEWSPAPER). The Realm's right-dock rail, rebuilt as a newspaper.
 *
 * THE PAPER (seven news doors): Dashboard (front page + prose session-prep) · War ·
 * Faith · Trade · Events · Divination (the forecast) · Adjudication (the decisions
 * desk). The old eleven doors consolidate here: Letter -> Dashboard prose mode,
 * Pantheon -> Faith, Treaties -> Trade, War & Resolve -> War, and the Pulse +
 * Chronicle CONTENT distributes into the topical doors via the routing table
 * (heraldFeed). History is a LENS, not a door — the time-lens toggle (this advance /
 * whole campaign) rides the chrome and scopes every report door.
 *
 * THE REGISTERS (W-C, owner directive 5 / J-D5): Gazetteer (the living roster) ·
 * Ruins & Remembrance (the graveyard). They sit AFTER the paper because they are
 * not news: the paper reports what happened, the registers report what is there
 * and what is gone. Both bodies are lazy leaves (HeraldBody) over one read model
 * (heraldRegister), and neither is stocked by the routing table — so the tab
 * badges deliberately skip them (UNCOUNTED_SECTIONS below).
 *
 * THE DESK (tools, kept OUT of the paper): Stage the Road + the Timelapse scrubber
 * move to a compact tools strip in the chrome; their panels are unchanged.
 *
 * Pure presentational shell. State (which section, open/closed, size) is owned by
 * the Realm container (useRealmInspector) and passed in. The section BODIES live in
 * HeraldBody; this file is the chrome. The overlay never body-swaps the map.
 */

import { Suspense, useCallback, useMemo, useEffect, useRef, useState } from 'react';
import { LayoutDashboard, Swords, Sparkles, Coins, CalendarClock, Eye, Gavel, ScrollText, Landmark, Route, History, X, Minus, Maximize2, Minimize2 } from 'lucide-react';

import { useStore } from '../../store/index.js';
import { nameMapFromSaves } from './WorldPulseData.js';
import { BODY, BORDER, BORDER2, CARD, CARD_ALT, FS, GOLD, SECOND, SP, sans } from '../theme.js';
import { IconButton } from './IconButton.jsx';
import { RealmEntityContext } from './RealmEntityContext.jsx';
import { useRealmEntityNav } from './useRealmEntityNav.js';
import HeraldBody from './HeraldBody.jsx';
import HeraldCommandBody from './HeraldCommandBody.jsx';
import HeraldSceneContext from './HeraldSceneContext.jsx';
import HeraldStrip from './HeraldStrip.jsx';
import { buildHeraldFeed } from './heraldFeed.js';
import { filterFeed } from './heraldFilter.js';
import {
  commandViewCounts,
  filterRealmItems,
} from './heraldCommandSelectors.js';
import {
  COMMAND_VIEW_IDS,
  STORY_TOPICS,
  commandLocationOf,
  legacyAddressForCommandView,
  legacyAddressForStoryTopic,
} from './heraldCommandNavigation.js';
import {
  readHeraldCommandSession,
  writeHeraldCommandSession,
} from './heraldCommandSession.js';
import { buildRealmItemReadModel } from '../../domain/realm/realmItemReadModel.js';
import { flag } from '../../lib/flags.js';
import RealmItemShadowDiagnostics from './RealmItemShadowDiagnostics.jsx';
// THE DESK — the two tools, STATIC within this already-lazy chunk (FP-R class): a
// lazy() here would mint a preload-manifest entry and tip the first-paint ratchet.
import RoadScenePanel from './RoadScenePanel.jsx';
import TimelapsePanel from './TimelapsePanel.jsx';

/** THE NAME (manager decision 2026-07-22, owner-vetoable). One exported constant so a
 *  veto is a one-string change; never scatter the literal. */
export const HERALD_TITLE = 'The Herald';

/**
 * The Herald's doors, in reading order. Unlike the old inspector, none self-hides:
 * a deity-free realm's Faith door shows its empty state (not a broken block), an
 * un-warred realm's War door shows peace. The old conditional tabs (pantheon /
 * treaty / resolve) fold their self-hide into the door body's empty/flag handling.
 *
 * W-C (owner directive 5 / J-D5) adds the two REGISTER doors at the end. They are
 * not report doors: the seven-door paper answers "what happened", the registers
 * answer "what is there" (Gazetteer) and "what is gone" (Ruins & Remembrance).
 * Both are gated exactly like their siblings — always present, the body carries
 * the no-campaign and nothing-yet states — so a door never appears disabled.
 */
export const REALM_INSPECTOR_SECTIONS = Object.freeze([
  { id: 'dashboard',    label: 'Dashboard',    Icon: LayoutDashboard },
  { id: 'war',          label: 'War',          Icon: Swords },
  { id: 'faith',        label: 'Faith',        Icon: Sparkles },
  { id: 'trade',        label: 'Trade',        Icon: Coins },
  { id: 'events',       label: 'Events',       Icon: CalendarClock },
  { id: 'divination',   label: 'Divination',   Icon: Eye },
  { id: 'adjudication', label: 'Adjudication', Icon: Gavel },
  { id: 'gazetteer',    label: 'Gazetteer',    Icon: ScrollText },
  { id: 'remembrance',  label: 'Ruins & Remembrance', Icon: Landmark },
]);

/** Doors the section-filed feed does not stock, so a narrowing filter must NOT
 *  badge them with a count: a "0" beside Gazetteer would be a lie about a
 *  register that is full. Dashboard and Adjudication have always been in this
 *  set; the two W-C registers join it. */
const UNCOUNTED_SECTIONS = new Set(['dashboard', 'adjudication', 'gazetteer', 'remembrance']);

/** G-4a's task-oriented doors. Their IDs are accepted only while the internal
 *  migration flag is active; every established section ID remains an alias. */
export const HERALD_COMMAND_SECTIONS = Object.freeze([
  { id: 'briefing',  label: 'Briefing',  Icon: LayoutDashboard },
  { id: 'stories',   label: 'Stories',    Icon: CalendarClock },
  { id: 'plans',     label: 'Plans',      Icon: Eye },
  { id: 'decisions', label: 'Decisions',  Icon: Gavel },
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
    <IconButton
      onClick={onClick}
      aria-pressed={active}
      aria-label={count == null ? label : `${label}, ${count}`}
      active={active}
      size="lg"
    >
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
  const canUseCustom = useStore(s => (typeof s.canUseCustomContent === 'function' ? s.canUseCustomContent() : false));
  const nameById = useMemo(() => nameMapFromSaves(saves), [saves]);
  // THE NEWS ADDRESS LAW: the realm-wide entity web + cross-settlement navigator,
  // provided to every section body so a named entity renders as a live link.
  const realmNav = useRealmEntityNav();
  const campaignSessionId = campaign?.id == null ? null : String(campaign.id);
  const [initialSession] = useState(
    () => readHeraldCommandSession(campaignSessionId),
  );

  // View state: the time LENS scopes every report door; the desk TOOL takes over
  // the body. Reading/filter state is session-persisted so a dossier round trip
  // can return to the same edition. Desk tools remain deliberately transient.
  const [timeLens, setTimeLens] = useState(initialSession?.timeLens || 'advance');
  const [deskTool, setDeskTool] = useState(/** @type {string|null} */ (null));
  // The filter/focus strip state. FOCUS is the store-global selectedSettlementId (the
  // local edition — round-trips with the map click); the rest is local strip state.
  const focusId = useStore(s => s.selectedSettlementId);
  const clearFocus = useStore(s => s.clearSelectedSettlementId);
  const [query, setQuery] = useState(initialSession?.query || '');
  const [attentionOn, setAttentionOn] = useState(initialSession?.attentionOn === true);
  const [filterBand, setFilterBand] = useState(
    /** @type {string|null} */ (initialSession?.filterBand || null),
  );
  const [showFilters, setShowFilters] = useState(initialSession?.showFilters === true);
  // A task-view jump may temporarily replace the originating story/brief item
  // with Decisions. Keep only the return address in shell state: the canonical
  // RealmItem and the authoritative decision remain owned elsewhere.
  const [commandReturn, setCommandReturn] = useState(initialSession?.commandReturn || null);
  // A portrait handoff is exact presentation context, not a selected RealmItem.
  // Keep it until the GM dismisses it so changing Herald doors cannot drop the
  // selected scene/canonical/provenance references mid-investigation.
  const [sceneContext, setSceneContext] = useState(initialSession?.sceneContext || null);
  const commandBodyRef = useRef(null);
  const pendingFocusRestoreRef = useRef(null);
  const routeRestoreRef = useRef(initialSession ? {
    scrollTop: initialSession.scrollTop,
    focusKey: initialSession.focusKey,
  } : null);
  const sessionCampaignRef = useRef(campaignSessionId);
  const skipSessionPersistRef = useRef(false);
  const commandBriefOn = flag('heraldCommandBrief');
  const realmItemShadowDiagnosticsOn = flag('realmItemShadowDiagnostics');

  // The section-filed feed under the current lens, then narrowed by focus ∩ search ∩
  // attention ∩ severity. Counts feed the per-door badges.
  const feed = useMemo(() => buildHeraldFeed(campaign, { lens: timeLens }), [campaign, timeLens]);
  const filtered = useMemo(
    () => filterFeed(feed, { focusId, query, attention: attentionOn, band: filterBand, nameById }),
    [feed, focusId, query, attentionOn, filterBand, nameById],
  );
  const focusName = focusId != null ? (nameById.get(String(focusId)) || String(focusId)) : '';
  const narrowing = focusId != null || !!query || attentionOn || !!filterBand;

  // G-3's read model remains derived and flag-inert. The legacy Herald does not
  // pay derivation work while both the command proof shell and its independent
  // shadow-accounting seam are dark. Shadow mode never changes the active doors.
  const shouldDeriveRealmModel = commandBriefOn || realmItemShadowDiagnosticsOn;
  const realmModel = useMemo(
    () => shouldDeriveRealmModel
      ? buildRealmItemReadModel(campaign, { saves, canUseCustom })
      : null,
    [shouldDeriveRealmModel, campaign, saves, canUseCustom],
  );
  const visibleRealmItems = useMemo(
    () => commandBriefOn
      ? filterRealmItems(realmModel?.items || [], {
        focusId, query, attention: attentionOn, band: filterBand, timeLens, nameById,
      })
      : [],
    [commandBriefOn, realmModel, focusId, query, attentionOn, filterBand, timeLens, nameById],
  );
  const commandCounts = useMemo(() => commandViewCounts(visibleRealmItems), [visibleRealmItems]);

  const commandLocation = commandLocationOf(section);
  const sections = commandBriefOn ? HERALD_COMMAND_SECTIONS : REALM_INSPECTOR_SECTIONS;
  const legacySectionKnown = REALM_INSPECTOR_SECTIONS.some(candidate => candidate.id === section);
  const commandSectionKnown = COMMAND_VIEW_IDS.includes(section);
  const sectionKnown = commandBriefOn ? legacySectionKnown || commandSectionKnown : legacySectionKnown;
  const activeSection = commandBriefOn
    ? commandLocation.view
    : legacySectionKnown ? section : 'dashboard';

  // A campaign switch is a namespace switch, not a continuation of the prior
  // paper. Restore only that campaign's session record; absent state gets the
  // calm defaults. The identity guard makes this a one-shot synchronization.
  useEffect(() => {
    if (!campaignSessionId || sessionCampaignRef.current === campaignSessionId) return;
    sessionCampaignRef.current = campaignSessionId;
    // This render still carries the prior campaign's local state. Do not let its
    // persistence effect overwrite the new namespace before restoration commits.
    skipSessionPersistRef.current = true;
    const restored = readHeraldCommandSession(campaignSessionId);
    routeRestoreRef.current = restored ? {
      scrollTop: restored.scrollTop,
      focusKey: restored.focusKey,
    } : null;
    setTimeLens(restored?.timeLens || 'advance');
    setQuery(restored?.query || '');
    setAttentionOn(restored?.attentionOn === true);
    setFilterBand(restored?.filterBand || null);
    setShowFilters(restored?.showFilters === true);
    setCommandReturn(restored?.commandReturn || null);
    setSceneContext(restored?.sceneContext || null);
  }, [campaignSessionId]);

  const persistCommandSession = useCallback((patch = {}) => {
    if (!campaignSessionId) return null;
    return writeHeraldCommandSession(campaignSessionId, {
      open,
      section,
      timeLens,
      query,
      attentionOn,
      filterBand,
      showFilters,
      scrollTop: commandBodyRef.current?.scrollTop || 0,
      commandReturn,
      sceneContext,
      ...patch,
    });
  }, [
    campaignSessionId,
    open,
    section,
    timeLens,
    query,
    attentionOn,
    filterBand,
    showFilters,
    commandReturn,
    sceneContext,
  ]);

  // Persist only presentation state. A decision writer remains authoritative in
  // the campaign store; this record merely lets a dossier round trip reopen the
  // same edition instead of dropping the reader at the front door.
  useEffect(() => {
    if (skipSessionPersistRef.current) {
      skipSessionPersistRef.current = false;
      return;
    }
    persistCommandSession();
  }, [persistCommandSession]);

  const sessionRealmNav = useMemo(() => ({
    ...realmNav,
    navigateToRealmEntity: (target) => {
      const active = globalThis.document?.activeElement;
      const focusKey = globalThis.HTMLElement && active instanceof globalThis.HTMLElement
        ? active.dataset.realmEntityKey || null
        : null;
      persistCommandSession({ focusKey });
      realmNav.navigateToRealmEntity(target);
    },
  }), [realmNav, persistCommandSession]);

  const openCommandDestination = useCallback((nextSection, item, _trigger) => {
    const itemId = String(item?.presentationKey || item?.id || '').trim();
    setCommandReturn({
      section,
      label: commandLocationOf(section).view === 'briefing' ? 'Briefing' : 'Stories',
      itemId: itemId || null,
      scrollTop: commandBodyRef.current?.scrollTop || 0,
    });
    onSection?.(nextSection);
  }, [section, onSection]);

  const returnToCommandOrigin = useCallback(() => {
    if (!commandReturn) return;
    pendingFocusRestoreRef.current = commandReturn;
    const originSection = commandReturn.section;
    setCommandReturn(null);
    onSection?.(originSection);
  }, [commandReturn, onSection]);

  // Restore both reading position and keyboard focus after the originating view
  // has rendered again. Dataset equality avoids selector escaping for imported IDs.
  useEffect(() => {
    const restore = pendingFocusRestoreRef.current;
    if (!restore || commandLocationOf(section).view !== commandLocationOf(restore.section).view) return;
    const body = commandBodyRef.current;
    if (!body) return;
    body.scrollTop = Number(restore.scrollTop) || 0;
    const candidates = body.querySelectorAll('[data-herald-command-origin]');
    const trigger = [...candidates].find(node => (
      node.getAttribute('data-herald-command-origin') === restore.itemId
    ));
    if (trigger) trigger.focus();
    else body.focus();
    pendingFocusRestoreRef.current = null;
  }, [section]);

  // A dossier route unmounts the entire Inspector. Restore the session-scoped
  // scroll position after remount, then return keyboard focus to the entity link
  // that initiated the route. If its source item vanished after a real decision
  // or remote refresh, focus the body rather than targeting a different record.
  useEffect(() => {
    const restore = routeRestoreRef.current;
    const body = commandBodyRef.current;
    if (!restore || !body || !open) return;
    body.scrollTop = Number(restore.scrollTop) || 0;
    if (restore.focusKey) {
      const candidates = body.querySelectorAll('[data-realm-entity-key]');
      const trigger = [...candidates].find(node => (
        node.getAttribute('data-realm-entity-key') === restore.focusKey
      ));
      if (trigger) trigger.focus();
      else body.focus();
    }
    routeRestoreRef.current = null;
    persistCommandSession({ focusKey: null, scrollTop: body.scrollTop });
  }, [open, section, realmModel, persistCommandSession]);

  // Reconcile a fallen-back section with the container's stored selection (P10/P2).
  useEffect(() => {
    if (!sectionKnown) onSection?.('dashboard');
  }, [sectionKnown, onSection]);

  const expanded = inspectorSize === 'expanded';
  const minimized = inspectorSize === 'min';
  useEffect(() => {
    if (!expanded && !(commandBriefOn && commandReturn)) return undefined;
    const onKeyDown = (e) => {
      if (e.key !== 'Escape') return;
      if (commandBriefOn && commandReturn) {
        e.preventDefault();
        returnToCommandOrigin();
      } else if (expanded) {
        onSetSize?.('default');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [expanded, commandBriefOn, commandReturn, onSetSize, returnToCommandOrigin]);

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
              <IconButton
                key={s.id}
                onClick={() => {
                  setCommandReturn(null);
                  onSection(commandBriefOn ? legacyAddressForCommandView(s.id) : s.id);
                }}
                aria-pressed={activeSection === s.id}
                active={activeSection === s.id}
                title={s.label}
                size="md"
              >
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
                onClick={() => {
                  setCommandReturn(null);
                  setDeskTool(deskTool === tool.id ? null : tool.id);
                }}
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
              count={commandBriefOn
                ? (commandCounts[s.id] ?? 0)
                : narrowing && !UNCOUNTED_SECTIONS.has(s.id)
                  ? (filtered.counts[s.id] ?? 0)
                  : null}
              onClick={() => {
                setDeskTool(null);
                setCommandReturn(null);
                onSection(commandBriefOn ? legacyAddressForCommandView(s.id) : s.id);
              }}
            />
          ))}
        </div>

        {commandBriefOn && activeSection === 'stories' && !deskTool && (
          <div role="group" aria-label="Story topics" style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <LensButton
              active={commandLocation.topic == null}
              onClick={() => {
                setCommandReturn(null);
                onSection(legacyAddressForCommandView('stories'));
              }}
              label="All stories"
            />
            {STORY_TOPICS.map(topic => (
              <LensButton
                key={topic.id}
                active={commandLocation.topic === topic.id}
                onClick={() => {
                  setCommandReturn(null);
                  onSection(legacyAddressForStoryTopic(topic.id));
                }}
                label={topic.label}
              />
            ))}
          </div>
        )}

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

      {realmItemShadowDiagnosticsOn && realmModel && (
        <RealmItemShadowDiagnostics model={realmModel} />
      )}

      <div
        ref={commandBodyRef}
        data-testid="realm-inspector-body"
        tabIndex={-1}
        onScroll={() => persistCommandSession()}
        style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: SP.md }}
      >
       {canManageCampaigns && sceneContext && (
         <HeraldSceneContext
           context={sceneContext}
           onDismiss={() => setSceneContext(null)}
         />
       )}
       <RealmEntityContext.Provider value={sessionRealmNav}>
        <Suspense fallback={<div style={{ color: BODY, fontFamily: sans, fontSize: FS.sm }}>Loading…</div>}>
          {activeDeskTool ? (
            <DeskPanel tool={activeDeskTool} campaign={campaign} nameById={nameById} onClose={() => setDeskTool(null)} emptyHandlers={emptyHandlers} />
          ) : commandBriefOn ? (
            <HeraldCommandBody
              view={activeSection}
              topic={commandLocation.topic}
              realmModel={realmModel}
              onSection={openCommandDestination}
              campaign={campaign}
              feed={filtered}
              focusId={focusId}
              focusName={focusName}
              narrowing={narrowing}
              query={query}
              attentionOn={attentionOn}
              filterBand={filterBand}
              timeLens={timeLens}
              nameById={nameById}
              saves={saves}
              emptyHandlers={emptyHandlers}
              canManageCampaigns={canManageCampaigns}
              tier={tier}
              onUpgrade={onUpgrade}
              returnToOrigin={commandReturn}
              onReturnToOrigin={returnToCommandOrigin}
            />
          ) : (
            <HeraldBody
              section={activeSection}
              campaign={campaign}
              feed={filtered}
              focusId={focusId}
              focusName={focusName}
              narrowing={narrowing}
              nameById={nameById}
              saves={saves}
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
