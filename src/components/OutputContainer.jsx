import React, { useState, useRef, lazy, Suspense } from 'react';
import { FS } from './theme.js';
import { runAiLayer } from '../generators/aiLayer';
import { Scroll, MapPin, Coins, Building2, Shield, Swords, Users, History, Package, CircleCheckBig, ChevronLeft, ChevronRight, RefreshCw, Eye, EyeOff, Compass, Cog, StickyNote, Sparkles, Drama } from 'lucide-react';
import { TIER_LABELS } from './new/design';
import { useStore } from '../store/index.js';
import { isConfigured } from '../lib/supabase.js';
import PipelineRail from './PipelineRail.jsx';
import ShareToGallery from './ShareToGallery.jsx';
import BuyThisDossier from './BuyThisDossier.jsx';
import { AiOverlayViolations } from './primitives/AiOverlayViolations.jsx';
import { RegenerationDeltaCard } from './primitives/RegenerationDeltaCard.jsx';
import { flag } from '../lib/flags.js';
import { Funnel, EVENTS } from '../lib/analytics.js';
import { collectPlotHooks } from '../domain/dossier/plotHooks.js';
import { buildChronicleFeed } from '../domain/dossier/chronicleFeed.js';
import { ConfirmDialog } from './primitives/Dialog.jsx';
// P104 / X-4 — Welcome-credit gift card. Self-gates on signed-in +
// first-saved + ledger-unspent state; renders nothing otherwise.
const WelcomeCreditCard = lazy(() => import('./dossier/WelcomeCreditCard.jsx'));
// P106 / E-2 — Pending changes drawer (queue + cascade preview).
// Self-gates inside on flag + pending queue presence.
const PendingChangesBar = lazy(() => import('./dossier/PendingChangesBar.jsx'));
// P130 / O-2 — First-dossier teaching callouts. Self-gates on
// flag + signed-in + savedCount===0; renders nothing otherwise.
const FirstDossierCallouts = lazy(() => import('./dossier/FirstDossierCallouts.jsx'));
// P135 / D-5 — Simulation drawer. Replaces the Simulation tab when
// `simulationDrawer` flag is on. Self-mounted via a trigger button.
const SimulationDrawer = lazy(() => import('./dossier/SimulationDrawer.jsx'));
// P142 / D-6 — Phone-optimized "at the table" view. Mounted only when
// flag('tableView') && userPrefs.tableViewOpen, so the chunk loads the
// moment the user opens it and never before.
const TableView = lazy(() => import('./TableView.jsx'));
// P131 / E-1 — Click-to-edit settlement name in the header.
// The pencil reveals on hover; commit queues a rename-settlement
// edit through the pending-edits drawer (E-2).
import EditableInline from './primitives/EditableInline.jsx';

// ── Lazy-loaded tabs (each loads only when first viewed) ────────────────────
const SummaryTab = lazy(() => import('./new/SummaryTab'));
// P129 / D-2 — Magazine-spread Summary V2. Self-gated by the
// `summaryMagazineV2` flag in renderTab(); legacy SummaryTab still
// loads in parallel so toggling the flag is instant.
const SummaryTabV2 = lazy(() => import('./new/SummaryTabV2.jsx'));
const PlotHooksTab = lazy(() => import('./new/tabs/PlotHooksTab.jsx'));
const OverviewTab = lazy(() => import('./new/tabs/OverviewTab'));
const EconomicsTab = lazy(() => import('./new/tabs/EconomicsTab'));
const ServicesTab = lazy(() => import('./new/tabs/ServicesTab'));
const PowerTab = lazy(() => import('./new/tabs/PowerTab'));
const DefenseTab = lazy(() => import('./new/tabs/DefenseTab'));
const NPCsTab = lazy(() => import('./new/tabs/NPCsTab'));
const HistoryTab = lazy(() => import('./new/tabs/HistoryTab'));
const ResourcesTab = lazy(() => import('./new/tabs/ResourcesTab'));
const ViabilityTab = lazy(() => import('./new/tabs/ViabilityTab'));
const DailyLifeTab = lazy(() => import('./new/tabs/DailyLifeTab'));
const RelationshipsTab = lazy(() => import('./new/tabs/RelationshipsTab'));
const DMCompassTab = lazy(() => import('./new/tabs/DMCompassTab'));
const NotesTab = lazy(() => import('./new/tabs/NotesTab.jsx'));


// P102 / D-1 — Thematic group tabs façade (spec §8: Summary / Systems / World /
// Notes). Each group maps to the existing sub-tabs the dossier already renders;
// this is a navigation layer, not a content change. Flag: `dossierFiveTabs`
// (name retained as the soak killswitch even though the count is now four).
//
//   summary  → Overview, DM Summary, Plot Hooks, Guidance (spec §8). Plot Hooks
//              is its own sub-tab (PlotHooksTab); Guidance (DM Compass) is the
//              AI-narrated layer and only appears when narration produced it.
//   systems  → Services, Economics, Power, Defense, Resources, Viability
//   world    → Relationships, Daily Life, NPCs, History, Neighbours
//   notes    → DM Notes, AI Notes
//
// Simulation lives in the drawer trigger near the dossier actions, not in
// the reading tab strip. Sub-tabs the current settlement doesn't render
// (e.g. dm_compass without narration, plot_hooks with no hooks) are dropped
// from the strip by the resolver below.
export const TAB_GROUPS = Object.freeze({
  summary: { label: 'Summary', tabs: ['overview', 'summary', 'plot_hooks', 'dm_compass'] },
  systems: { label: 'Systems', tabs: ['services', 'economics', 'power', 'defense', 'resources', 'viability'] },
  world:   { label: 'World',   tabs: ['relationships', 'daily_life', 'npcs', 'history', 'neighbours'] },
  notes:   { label: 'Notes',   tabs: ['dm_notes', 'ai_notes'] },
});

const TABS = [
  { id: 'overview',   label: 'Overview',   Icon: MapPin },
  { id: 'summary',    label: 'DM Summary', Icon: Scroll },
  { id: 'power',      label: 'Power',      Icon: Shield },
  { id: 'economics',  label: 'Economics',  Icon: Coins },
  { id: 'services',   label: 'Services',   Icon: Building2 },
  { id: 'defense',    label: 'Defense',    Icon: Swords },
  { id: 'resources',  label: 'Resources',  Icon: Package },
  { id: 'viability',  label: 'Viability',  Icon: CircleCheckBig },
  { id: 'history',    label: 'History',    Icon: History },
  { id: 'daily_life', label: 'Daily Life', Icon: Users },
  { id: 'npcs',       label: 'NPCs',       Icon: Users },
  { id: 'dm_notes',   label: 'DM Notes',   Icon: StickyNote },
  { id: 'ai_notes',   label: 'AI Notes',   Icon: Sparkles },
  // Simulation tab — meta surface. The pipeline rail used to render as
  // an always-on banner above the dossier, but that pushed the actual
  // DM-facing content below the fold. Now it lives as the last tab so
  // the dossier itself is the default landing surface.
  { id: 'simulation', label: 'Simulation', Icon: Cog },
];
const REROLLABLE = { npcs: 'Reroll NPCs', history: 'Reroll History' };

function collectRecentEvents(saveEntry, settlement) {
  // The unified Chronicle feed (spec §8 M3c): manual events + party-caused +
  // world-pulse, merged + normalized + sorted newest-first by the shared domain
  // helper, so screen + any future surface read one source of truth.
  return buildChronicleFeed({
    manual:     saveEntry?.campaignState?.eventLog,
    worldPulse: saveEntry?.campaignState?.worldPulse?.events,
    worldLog:   saveEntry?.campaignState?.worldState?.eventLog,
    recent:     settlement?.recentEvents,
  }, { limit: 40 });
}

export default function OutputContainer({ settlement: propSettlement, readOnly = false, saveId = null, playerView = false, hideHeader = false }) {
  const storeSettlement = useStore(s => s.settlement);
  const storeAi = useStore(s => s.aiSettlement);
  const storeSetAi = useStore(s => s.setAiSettlement);
  const _clearAiSettlement = useStore(s => s.clearAiSettlement);
  const storeRegenerate = useStore(s => s.regenSection);
  const requestNarrative = useStore(s => s.requestNarrative);
  const requestDailyLife = useStore(s => s.requestDailyLife);
  const getCost = useStore(s => s.getCost);
  const _creditBalance = useStore(s => s.creditBalance);
  const storeAiLoading = useStore(s => s.aiLoading);
  const storeAiRegenerating = useStore(s => s.aiRegenerating);
  const storeAiError = useStore(s => s.aiError);
  const storeAiProgress = useStore(s => s.aiProgress);
  const storeAiPartialFailure = useStore(s => s.aiPartialFailure);
  // Tier 6.7 — runtime canon-preservation report from the AI overlay
  // verifier. Surfaces drift (invented entity, renamed proper noun,
  // overridden user edit) to the DM via the AiOverlayViolations card.
  const storeAiViolations = useStore(s => s.aiViolations);
  const clearAiViolations = useStore(s => s.clearAiViolations);
  // Tier 5.1 — most-recent regeneration delta, populated by
  // settlementSlice.regenSection. Persists until dismissed or until
  // the next regen overwrites it.
  const storeLastRegenerationDelta = useStore(s => s.lastRegenerationDelta);
  const clearLastRegenerationDelta = useStore(s => s.clearLastRegenerationDelta);
  const storeShowNarrative = useStore(s => s.showNarrative);
  const setShowNarrative = useStore(s => s.setShowNarrative);
  // Pinned NPCs — AI-4a. The live save entry is the source of truth so the
  // pin icons stay in sync across tabs without an extra hydration hop.
  const liveSaveEntry = useStore(s => saveId ? s.savedSettlements.find(x => x.id === saveId) : null);
  const pinNpc = useStore(s => s.pinNpc);
  const unpinNpc = useStore(s => s.unpinNpc);
  // P131 / E-1 — inline-edit pipe. queueEdit goes into the
  // PendingChangesBar's drawer where the cascade preview lives.
  const queueEdit = useStore(s => s.queueEdit);

  const rawSettlement = propSettlement || storeSettlement;
  // AI narrative is now gated behind a saveId (AI-1): the ai_data has a
  // durable home on the saved settlement row. readOnly still controls
  // editing affordances (regen, setAi from local-dev mock) independently.
  const narrativeEnabled = isConfigured ? !!saveId : true; // local-dev mock is ungated
  const aiSettlement = playerView ? null : storeAi;
  const setAiSettlement = readOnly ? null : storeSetAi;
  const onRegenerate = readOnly ? null : storeRegenerate;
  const trackTabExplored = useStore(s => s.trackTabExplored);
  const onboardingActive = useStore(s => s.onboardingActive);
  const onboardingStep = useStore(s => s.onboardingStep);
  // P142 / D-6 — Table View overlay state. The trigger lives in
  // SummaryTabV2 (routed through renderTab's onOpenTableView); this reads
  // the pref reactively so the overlay mounts/unmounts on toggle.
  const tableViewOpen = useStore(s => s.userPrefs?.tableViewOpen);
  const setUserPref = useStore(s => s.setUserPref);
  const [activeTab, _setActiveTab] = useState('overview');
  const setActiveTab = (id) => {
    _setActiveTab(id);
    if (!readOnly && trackTabExplored) trackTabExplored();
  };
  const [pendingAiAction, setPendingAiAction] = useState(null);
  const [localAiLoading, setLocalAiLoading] = useState(false);
  const [localAiError, setLocalAiError]     = useState(null);
  const [aiProgress, setAiProgress] = useState('');
  const scrollRef = useRef(null);
  // NOTE: do not early-return here. React Hooks must always be called
  // in the same order on every render; an early return before subsequent
  // useMemo/useCallback hooks (line 124 etc.) would create a hooks-order
  // violation flagged by react-hooks/rules-of-hooks. We instead defer
  // the null check until after all hooks have been called (see below).
  const earlyExitOnNoSettlement = !rawSettlement;

  // Use store-based AI (credit-gated via edge function) when Supabase is configured,
  // fall back to direct aiLayer call for local dev
  const aiLoading = isConfigured ? storeAiLoading : localAiLoading;
  const aiRegenerating = isConfigured ? storeAiRegenerating : false;
  const aiError = isConfigured ? storeAiError : localAiError;
  const displayProgress = isConfigured ? storeAiProgress : aiProgress;

  // ── Which settlement object drives the tabs? ───────────────────────────────
  // When narrative view is on AND aiSettlement exists, read from the refined
  // clone. Otherwise read raw. Refined sections the AI completed show polished
  // prose; sections the AI didn't touch (or passes that failed) show raw data
  // because aiSettlement started as a deep clone of the source.
  const showNarrative = storeShowNarrative && !!aiSettlement;
  const activeSettlement = showNarrative ? aiSettlement : rawSettlement;
  const dossierNotes = liveSaveEntry?.aiData?.dossierNotes || null;
  const aiGuidance = typeof dossierNotes?.aiGuidance === 'string' ? dossierNotes.aiGuidance.trim() : '';
  const recentEvents = collectRecentEvents(liveSaveEntry, rawSettlement);

  const executeAiAction = async (kind) => {
    if (kind === 'dailyLife') {
      if (isConfigured) await requestDailyLife(saveId);
      return;
    }
    if (isConfigured) {
      await requestNarrative(saveId);
    } else {
      setLocalAiLoading(true);
      setLocalAiError(null);
      setAiProgress('');
      try {
        const result = await runAiLayer(rawSettlement, msg => setAiProgress(msg));
        setAiSettlement?.(result);
      } catch (e) {
        setLocalAiError(e.message);
      } finally {
        setLocalAiLoading(false);
        setAiProgress('');
      }
    }
  };

  const requestAiAction = (kind) => {
    if (aiGuidance && isConfigured) {
      setPendingAiAction(kind);
      return;
    }
    executeAiAction(kind);
  };

  const confirmGuidedAiAction = () => {
    const kind = pendingAiAction;
    setPendingAiAction(null);
    executeAiAction(kind);
  };

  const runNarrativeLayer = () => requestAiAction('narrative');

  // Pin props for the NPCs tab — only surface when we have a real save to
  // persist onto AND we're not in read-only mode. `pinnedIds` is a Set of
  // normalized pin keys so NPCInlineCard can do O(1) lookups and the backend
  // filter's key format matches.
  const pinnedIds = React.useMemo(() => {
    const arr = liveSaveEntry?.aiData?.pinnedNpcs;
    return Array.isArray(arr) ? new Set(arr.map(String)) : new Set();
  }, [liveSaveEntry?.aiData?.pinnedNpcs]);
  const onTogglePin = (!readOnly && saveId) ? ((npcId) => {
    const key = String(npcId);
    if (pinnedIds.has(key)) unpinNpc(saveId, key);
    else pinNpc(saveId, key);
  }) : null;

  // DM Compass tab is visible only when the narrative layer has produced at
  // least one of its four fields (AI-3a). Unnarrated saves don't need the tab.
  const hasDMCompass = !!(aiSettlement && (
    (Array.isArray(aiSettlement.identityMarkers) && aiSettlement.identityMarkers.length) ||
    (Array.isArray(aiSettlement.frictionPoints)  && aiSettlement.frictionPoints.length)  ||
    (Array.isArray(aiSettlement.connectionsMap)  && aiSettlement.connectionsMap.length)  ||
    (aiSettlement.dmCompass && (
      (Array.isArray(aiSettlement.dmCompass.hooks)    && aiSettlement.dmCompass.hooks.length) ||
      (Array.isArray(aiSettlement.dmCompass.redFlags) && aiSettlement.dmCompass.redFlags.length) ||
      (typeof aiSettlement.dmCompass.twist === 'string' && aiSettlement.dmCompass.twist.length)
    ))
  ));

  // Plot Hooks sub-tab (spec §8) appears only when the settlement surfaces
  // structural hooks. Derived from the raw simulation (NPCs/factions/tensions/
  // economy/safety/history/relationships), so it's independent of narration.
  const hasPlotHooks = React.useMemo(
    () => collectPlotHooks(rawSettlement || {}).length > 0,
    [rawSettlement]
  );

  // P135 / D-5 — The simulation drawer trigger (below the header) is the
  // entry point, so drop the Simulation entry from the tab strip.
  const baseTabs = TABS.filter(t => {
    if (t.id === 'simulation') return false;
    // Notes (DM/AI) are owner-private prep: hidden from the public player
    // view, but shown on saved settlements even though the dossier prose is
    // readOnly (editability is keyed on saveId inside NotesTab, not readOnly).
    if (playerView && ['summary', 'dm_notes', 'ai_notes'].includes(t.id)) return false;
    return true;
  });
  const allTabs = [...baseTabs,
    // Plot Hooks — a Summary sub-tab (spec §8); shown only when the settlement
    // actually surfaces structural hooks.
    ...(hasPlotHooks ? [{ id:'plot_hooks', label:'Plot Hooks', Icon: Drama }] : []),
    // Guidance (DM Compass) — the AI-narrated layer; only present once narration
    // produced it, and tinted purple in the strip below.
    ...(!playerView && hasDMCompass ? [{ id:'dm_compass', label:'Guidance', Icon: Compass }] : []),
    ...(rawSettlement?.neighborRelationship || rawSettlement?.neighbourRelationship || rawSettlement?.neighbourNetwork?.length
      ? [{ id:'neighbours', label:'Neighbours', Icon: MapPin }] : [])
  ];
  const selectedTab = allTabs.some(t => t.id === activeTab)
    ? activeTab
    : (allTabs[0]?.id || activeTab);
  const visibleGroupEntries = Object.entries(TAB_GROUPS)
    .filter(([, group]) => group.tabs.some(tid => allTabs.some(t => t.id === tid)));

  // P102 / D-1 — Five thematic group tabs. When the flag is on, render
  // a group selector ABOVE the existing tab strip; clicking a group
  // filters the strip to its sub-tabs and selects the group's primary.
  // When the flag is off, the strip behaves as before (legacy 14 tabs).
  const fiveTabsEnabled = flag('dossierFiveTabs');
  const tabToGroup = (() => {
    const m = {};
    Object.entries(TAB_GROUPS).forEach(([gid, g]) => {
      g.tabs.forEach(tid => { m[tid] = gid; });
    });
    return m;
  })();
  // Initial group derives from the active tab so deep links land correctly.
  const initialGroup = tabToGroup[selectedTab] || 'summary';
  const [activeGroup, setActiveGroup] = useState(initialGroup);
  const selectedGroup = visibleGroupEntries.some(([gid]) => gid === activeGroup)
    ? activeGroup
    : (visibleGroupEntries[0]?.[0] || 'summary');
  const handleGroupClick = (gid) => {
    setActiveGroup(gid);
    const group = TAB_GROUPS[gid];
    if (group && group.tabs[0] && selectedTab !== group.tabs[0]) {
      const firstAvailable = group.tabs.find(tid => allTabs.some(t => t.id === tid));
      if (firstAvailable) setActiveTab(firstAvailable);
    }
    Funnel.track(EVENTS.DOSSIER_GROUP_TAB_CLICKED, { group: gid });
  };

  const tabs = fiveTabsEnabled
    // Sub-tab order follows the group's DECLARED order in TAB_GROUPS (e.g.
    // World shows NPCs before History; Systems leads with Services), not the
    // flat TABS array. Resolve each declared id to its live tab object and
    // drop any the current settlement doesn't render (plus the meta sim tab).
    ? (TAB_GROUPS[selectedGroup]?.tabs || [])
        .filter(tid => tid !== 'simulation')
        .map(tid => allTabs.find(t => t.id === tid))
        .filter(Boolean)
    : allTabs;

  const scroll = (dir) => scrollRef.current?.scrollBy({ left: dir * 120, behavior: 'smooth' });

  const renderTab = () => {
    const s = activeSettlement;
    switch (selectedTab) {
      case 'summary':    return flag('summaryMagazineV2')
        ? React.createElement(SummaryTabV2, {
            settlement: s,
            onOpenTableView: flag('tableView')
              ? () => useStore.getState().setUserPref?.('tableViewOpen', true)
              : undefined,
          })
        : React.createElement(SummaryTab, { settlement: s });
      case 'plot_hooks': return React.createElement(PlotHooksTab, { settlement: s });
      case 'daily_life': return React.createElement(DailyLifeTab, { settlement: s, aiSettlement, saveId, onRequestDailyLife: () => requestAiAction('dailyLife') });
      case 'overview':   return React.createElement(OverviewTab, { settlement: s, narrativeNote: null });
      case 'economics':  return React.createElement(EconomicsTab, { settlement: s, narrativeNote: null });
      case 'services':   return React.createElement(ServicesTab, { services: s.availableServices, settlement: s, narrativeNote: null });
      case 'power':      return React.createElement(PowerTab, { powerStructure: s.powerStructure, settlement: s, narrativeNote: null });
      case 'defense':    return React.createElement(DefenseTab, { settlement: s, narrativeNote: null });
      case 'npcs':       return React.createElement(NPCsTab, { npcs: s.npcs, settlement: s, onRerollNPCs: onRegenerate ? () => onRegenerate('npcs') : null, narrativeNote: null, pinnedIds, onTogglePin });
      case 'history':    return React.createElement(HistoryTab, { settlement: s, narrativeNote: null, recentEvents });
      case 'resources':  return React.createElement(ResourcesTab, { settlement: s, narrativeNote: null });
      case 'viability':  return React.createElement(ViabilityTab, { settlement: s, narrativeNote: null });
      case 'dm_compass': return React.createElement(DMCompassTab, { settlement: s });
      case 'dm_notes':   return React.createElement(NotesTab, { saveId, notes: dossierNotes, section: 'dm' });
      case 'ai_notes':   return React.createElement(NotesTab, { saveId, notes: dossierNotes, section: 'ai' });
      case 'neighbours':    return React.createElement(RelationshipsTab, { settlement: s, narrativeNote: null, neighboursOnly: true });
      case 'relationships': return React.createElement(RelationshipsTab, { settlement: s, narrativeNote: null });
      // Simulation = full PipelineRail (non-compact). Since the rail now
      // lives inside the dossier card, we surface the full pipeline view
      // here — step labels + traces + the eventual causal expand-on-tap.
      case 'simulation': return React.createElement('div', { style: { padding: '16px 18px' } },
        React.createElement(PipelineRail, { compact: false })
      );
      default:           return React.createElement('div', null);
    }
  };

  // Header chips read from the raw settlement — mechanical facts shouldn't
  // change between views.
  const settlement = rawSettlement;
  const stressObj = settlement.stress
    ? (Array.isArray(settlement.stress) ? settlement.stress[0] : settlement.stress) : null;

  // ── Button group state ─────────────────────────────────────────────────────
  // Three distinct buttons replace the old single action so view-toggling
  // can't accidentally spend credits.
  const renderNarrativeButtons = () => {
    // Unsaved settlements: render nothing here. The AI-enrichment affordance
    // moved to a slim hint line below the tab strip so the header stays
    // focused on what the user just generated. This avoids a teaser button
    // that can't actually fire.
    if (!narrativeEnabled) return null;

    const costLabel = isConfigured ? ` (${getCost('narrative')} credits)` : '';
    const btnBase = {
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '6px 14px', borderRadius: 20,
      fontSize: FS.xs, fontWeight: 800,
      fontFamily: 'Nunito, sans-serif', letterSpacing: '0.04em',
      transition: 'all 0.2s', whiteSpace: 'nowrap',
      cursor: 'pointer',
    };

    // State 1: no narrative yet → single generate button
    if (!aiSettlement && !aiLoading) {
      return React.createElement('div', { style: { position: 'relative', display: 'flex', alignItems: 'center', gap: 6 } },
        React.createElement('button', {
          onClick: runNarrativeLayer,
          title: 'Narrative Refinement Layer. Turns the simulator output into prose that feels specific to this settlement. Uses credits.',
          style: {
            ...btnBase,
            background: 'rgba(90,42,138,0.2)',
            border: '1px solid rgba(160,100,220,0.35)',
            color: '#c8a0f0',
          }
        },
          React.createElement('span', { style: { fontSize: FS.xs } }, '\u2726'),
          `Generate Narrative${costLabel}`
        ),
        aiError && React.createElement('div', {
          style: { position: 'absolute', top: '110%', right: 0, background: '#2d0a0a', border: '1px solid #8b1a1a', borderRadius: 6, padding: '8px 12px', fontSize: FS.xs, color: '#f0a0a0', whiteSpace: 'nowrap', zIndex: 50, maxWidth: 300, wordBreak: 'break-word' }
        }, ' ', aiError)
      );
    }

    // State 2: loading (first-time) → progress chip
    if (aiLoading && !aiRegenerating) {
      return React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 6 } },
        React.createElement('div', {
          style: {
            ...btnBase,
            background: 'rgba(90,42,138,0.3)',
            border: '1px solid rgba(160,100,220,0.35)',
            color: 'rgba(200,160,240,0.8)',
            cursor: 'default',
          }
        },
          React.createElement('span', { style: { display: 'inline-block', animation: 'spin 1.2s linear infinite' } }, '\u2726'),
          displayProgress || 'Weaving\u2026'
        )
      );
    }

    // State 3 or 4: narrative exists → toggle + regenerate pair
    // (Includes the aiLoading && aiRegenerating case — buttons appear but the
    // Regenerate one is disabled while the new narrative is brewing.)
    const inNarrativeView = storeShowNarrative;
    const regenerating = aiLoading && aiRegenerating;

    return React.createElement('div', { style: { position: 'relative', display: 'flex', alignItems: 'center', gap: 6 } },
      // Toggle view button — free action
      React.createElement('button', {
        onClick: () => setShowNarrative(!inNarrativeView),
        disabled: regenerating,
        title: inNarrativeView
          ? 'Switch to the raw generated data (no AI polish). No credits used.'
          : 'Switch to the AI-refined view. No credits used.',
        style: {
          ...btnBase,
          background: inNarrativeView
            ? 'rgba(156,128,104,0.2)'
            : 'linear-gradient(135deg, #4a1a7a, #6a2a9a)',
          border: inNarrativeView
            ? '1px solid rgba(156,128,104,0.35)'
            : '1px solid rgba(160,100,220,0.6)',
          color: inNarrativeView ? '#c8b89a' : '#f0d8ff',
          opacity: regenerating ? 0.5 : 1,
          cursor: regenerating ? 'default' : 'pointer',
        }
      },
        inNarrativeView
          ? React.createElement(EyeOff, { size: 12 })
          : React.createElement(Eye, { size: 12 }),
        inNarrativeView ? 'View Raw Simulation' : 'View Narrative'
      ),
      // Regenerate button — spends credits
      React.createElement('button', {
        onClick: runNarrativeLayer,
        disabled: regenerating,
        title: `Regenerate the Narrative Layer from the simulator output. Spends ${getCost('narrative')} credits.`,
        style: {
          ...btnBase,
          background: regenerating ? 'rgba(90,42,138,0.3)' : 'rgba(90,42,138,0.2)',
          border: '1px solid rgba(160,100,220,0.35)',
          color: regenerating ? 'rgba(200,160,240,0.6)' : '#c8a0f0',
          cursor: regenerating ? 'default' : 'pointer',
        }
      },
        regenerating
          ? React.createElement('span', { style: { display: 'inline-block', animation: 'spin 1.2s linear infinite' } }, '\u21ba')
          : React.createElement(RefreshCw, { size: 12 }),
        regenerating ? (displayProgress || 'Regenerating\u2026') : `Regenerate${costLabel}`
      ),
      aiError && React.createElement('div', {
        style: { position: 'absolute', top: '110%', right: 0, background: '#2d0a0a', border: '1px solid #8b1a1a', borderRadius: 6, padding: '8px 12px', fontSize: FS.xs, color: '#f0a0a0', whiteSpace: 'nowrap', zIndex: 50, maxWidth: 300, wordBreak: 'break-word' }
      }, ' ', aiError)
    );
  };

  // Deferred null check (see comment near the top of this component).
  // All hooks are now committed; safe to early-exit.
  if (earlyExitOnNoSettlement) return null;

  return React.createElement(React.Fragment, null,
    // Note: the "How this was simulated" rail used to render here as an
    // always-on banner above the dossier card. User feedback was that
    // it pushed the actual DM-facing dossier below the fold. Now it
    // lives as the last tab inside the dossier ("Simulation"), so the
    // dossier itself is the default landing surface and the simulation
    // metadata is one tap away rather than top-of-page chrome.
    React.createElement('div', { style: { background: 'rgba(255,251,245,0.96)', border: '1px solid #c8b89a', borderRadius: 10, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.35)' } },
      // Header — suppressed via hideHeader in the embedded generate-flow view,
      // where the wizard's own sticky toolbar already shows name/tier/pop, so
      // the two dark identity bars collapse into one.
      hideHeader ? null : React.createElement('div', { style: { padding: '14px 20px', background: 'linear-gradient(135deg, #1c1409 0%, #2d1f0e 60%, #1c1409 100%)', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', borderBottom: '1px solid rgba(196,154,60,0.2)' } },
        React.createElement('div', { style: { flex: 1, minWidth: 0 } },
          React.createElement('div', { style: { fontFamily: 'Crimson Text, Georgia, serif', fontSize: FS.h1, fontWeight: 600, color: '#c49a3c', lineHeight: 1.1 } },
            (!readOnly && queueEdit) ? React.createElement(EditableInline, {
              value: settlement.name || '',
              ariaLabel: 'Edit settlement name',
              textStyle: { fontFamily: 'Crimson Text, Georgia, serif', fontSize: FS.h1, fontWeight: 600, color: '#c49a3c', lineHeight: 1.1 },
              trackEvent: EVENTS.EDIT_PENDING_QUEUED,
              provenance: { kind: 'rename-settlement', entityId: saveId || 'unsaved' },
              onCommit: (newName) => {
                queueEdit('rename-settlement', { newName });
              },
            }) : settlement.name
          ),
          React.createElement('div', { style: { display: 'flex', gap: 8, marginTop: 5, flexWrap: 'wrap', alignItems: 'center' } },
            React.createElement('span', { style: { fontSize: FS.sm, color: '#9c8068', textTransform: 'capitalize', fontWeight: 600 } }, TIER_LABELS[settlement.tier] || settlement.tier),
            React.createElement('span', { style: { fontSize: FS.sm, color: '#6b5340' } }, '\u00b7'),
            React.createElement('span', { style: { fontSize: FS.sm, color: '#9c8068' } }, settlement.population?.toLocaleString() + ' pop.'),
            settlement.config?.tradeRouteAccess && React.createElement('span', { style: { fontSize: FS.sm, color: '#9c8068' } }, settlement.config.tradeRouteAccess.replace(/_/g,' ')),
            settlement.config?.monsterThreat && settlement.config.monsterThreat !== 'frontier' && React.createElement('span', { style: { fontSize: FS.xs, fontWeight: 700, color: settlement.config.monsterThreat === 'plagued' ? '#c87060' : '#c49a3c', background: 'rgba(196,154,60,0.12)', borderRadius: 3, padding: '2px 7px', textTransform: 'uppercase', letterSpacing: '0.06em' } }, settlement.config.monsterThreat === 'plagued' ? ' Embattled' : ' Frontier'),
            stressObj && React.createElement('span', { style: { fontSize: FS.xxs, fontWeight: 800, color: '#ffd080', background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4, padding: '2px 8px', textTransform: 'uppercase', letterSpacing: '0.06em' } }, stressObj.label)
          )
        ),
        REROLLABLE[selectedTab] && onRegenerate && React.createElement('button', {
          onClick: () => onRegenerate(selectedTab),
          style: { display: 'flex', alignItems: 'center', gap: 5, padding: '6px 14px', borderRadius: 5, background: 'rgba(196,154,60,0.15)', border: '1px solid rgba(196,154,60,0.3)', color: '#c49a3c', fontSize: FS.sm, fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }
        }, React.createElement(RefreshCw, { size: 12 }), ' ', REROLLABLE[selectedTab]),
        // ── AI Narrative Layer button group ──────────────────────────────────
        // P121 / D-4 — When `narrativeLayerStrip` flag is on, the
        // narrative buttons move out of the header into a labeled strip
        // below (rendered further down). The header remains lean. When
        // the flag is off, the legacy header-button cluster renders.
        // readOnly exception: the strip below is suppressed in readOnly
        // (SettlementDetail's saved-dossier view), so keep the header
        // buttons there or the free View Narrative/Raw toggle vanishes.
        (!flag('narrativeLayerStrip') || readOnly) && renderNarrativeButtons()
      ),
      // P121 — Labeled narrative-layer strip. Below the header, above
      // the tab strip. Lives in its own card with title + cost pill +
      // single primary action. The renderNarrativeButtons() output
      // sits inside the strip; the buttons themselves are unchanged.
      flag('narrativeLayerStrip') && !readOnly && React.createElement('div', {
        style: {
          margin: '8px 18px',
          padding: '10px 12px',
          background: 'linear-gradient(135deg, rgba(123,79,207,0.05), rgba(123,79,207,0.02))',
          border: '1px solid rgba(123,79,207,0.30)',
          borderLeft: '3px solid rgba(123,79,207,0.70)',
          borderRadius: 5,
          display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
        }
      },
        React.createElement('div', { style: { flex: 1, minWidth: 0 } },
          React.createElement('div', {
            style: { fontSize: FS.micro, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7B4FCF' }
          }, 'Narrative Layer · AI prose pass'),
          React.createElement('div', {
            style: { fontSize: FS.xs, color: '#4A3B22', marginTop: 2, lineHeight: 1.4 }
          }, narrativeEnabled
               ? 'Refines the simulated dossier into prose your players can hear.'
               : 'Save this settlement to your library to refine it into prose your players can hear.')
        ),
        renderNarrativeButtons()
      ),
      // Owner / visitor actions strip — share-to-gallery (owners) and
      // buy-this-dossier (anonymous visitors). Each child decides
      // whether to render based on auth/save state. Skipped entirely
      // in readOnly mode (public dossier viewer).
      !readOnly && React.createElement('div', {
        style: {
          padding: '8px 18px',
          background: 'rgba(255,251,245,0.6)',
          borderBottom: '1px solid #e0d0b0',
          display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
        }
      },
        React.createElement(BuyThisDossier, { settlement }),
        React.createElement(ShareToGallery, {
          saveId,
          isPublic: liveSaveEntry?.is_public,
          publicSlug: liveSaveEntry?.public_slug,
          settlement,
          galleryDescription: liveSaveEntry?.gallery_description,
          galleryImageUrl: liveSaveEntry?.gallery_image_url,
          galleryImageAlt: liveSaveEntry?.gallery_image_alt,
          galleryTags: liveSaveEntry?.gallery_tags,
          campaignState: liveSaveEntry?.campaignState,
          galleryShareNarrated: liveSaveEntry?.gallery_share_narrated,
          galleryShareDm: liveSaveEntry?.gallery_share_dm,
        }),
        // P135 / D-5 — "How this was simulated" trigger. Lives next to
        // BuyThisDossier so the user finds it as a "more info" affordance,
        // not a chrome surface.
        React.createElement(Suspense, { fallback: null },
          React.createElement(SimulationDrawer)
        )
      ),
      // P104 — Welcome credit gift card. Self-gates inside; shown to
      // signed-in users on their first saved dossier when their ledger
      // still has an available welcome grant.
      !readOnly && React.createElement(Suspense, { fallback: null },
        React.createElement(WelcomeCreditCard, { saveId })
      ),
      // P106 / E-2 — Pending changes bar + cascade preview. Self-gates
      // inside; renders nothing when no edits are queued.
      !readOnly && React.createElement(Suspense, { fallback: null },
        React.createElement(PendingChangesBar)
      ),
      // P130 / O-2 — First-dossier teaching callouts. Self-gates inside;
      // shown to first-time signed-in users on their first generation.
      !readOnly && React.createElement(Suspense, { fallback: null },
        React.createElement(FirstDossierCallouts)
      ),
      // P102 / D-1 — Thematic group tab strip (Summary / Systems / World /
      // Notes). Renders only when the dossierFiveTabs flag is on. Clicking a
      // group selects its first sub-tab and filters the strip below.
      fiveTabsEnabled && React.createElement('div', {
        role: 'tablist',
        'aria-label': 'Dossier sections',
        style: {
          display: 'flex', gap: 2, padding: 4,
          background: '#f7f0e4', borderBottom: '1px solid #e0d0b0',
        }
      },
        visibleGroupEntries.map(([gid, group]) => {
          const active = selectedGroup === gid;
          return React.createElement('button', {
            key: gid,
            role: 'tab',
            'aria-selected': active,
            onClick: () => handleGroupClick(gid),
            style: {
              flex: 1, padding: '8px 6px',
              background: active ? 'rgba(201,162,76,0.10)' : 'transparent',
              border: active ? '1px solid rgba(201,162,76,0.40)' : '1px solid transparent',
              borderRadius: 3,
              fontSize: FS.sm,
              fontWeight: active ? 700 : 500,
              color: active ? '#8C6F32' : '#6B5340',
              fontFamily: 'Nunito, sans-serif',
              textAlign: 'center',
              cursor: 'pointer',
            }
          }, group.label);
        })
      ),
      // Tab strip
      React.createElement('div', { 'data-onboard-highlight': onboardingActive && onboardingStep === 2 ? 'true' : undefined, style: { position: 'relative', borderBottom: '1px solid #e0d0b0', background: '#f7f0e4' } },
        React.createElement('button', { onClick: () => scroll(-1), style: { position: 'absolute', left: 0, top: 0, bottom: 0, zIndex: 2, background: 'linear-gradient(to right, #f7f0e4 60%, transparent)', border: 'none', cursor: 'pointer', color: '#9c8068', padding: '0 8px' } }, React.createElement(ChevronLeft, { size: 14 })),
        React.createElement('div', { ref: scrollRef, style: { display: 'flex', overflowX: 'auto', scrollbarWidth: 'none', paddingLeft: 28, paddingRight: 28, WebkitOverflowScrolling: 'touch' } },
          tabs.map(({ id, label, Icon }) => {
            const active = selectedTab === id;
            // Guidance (DM Compass) is the AI-narrated layer — give it a subtle
            // purple tint so the AI surface reads as distinct from the
            // simulation tabs.
            const purple = id === 'dm_compass';
            const accent = purple ? '#7a3aa8' : '#a0762a';
            const idle   = purple ? '#7a5a92' : '#6b5340';
            const bg = active
              ? (purple ? '#f7f0fa' : '#fffbf5')
              : (purple ? 'rgba(122,58,168,0.05)' : 'transparent');
            return React.createElement('button', {
              key: id, onClick: () => setActiveTab(id),
              style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '10px 12px 8px', flexShrink: 0, background: bg, borderBottom: '2px solid ' + (active ? accent : 'transparent'), borderTop: active ? '1px solid #e0d0b0' : '1px solid transparent', borderLeft: active ? '1px solid #e0d0b0' : '1px solid transparent', borderRight: active ? '1px solid #e0d0b0' : '1px solid transparent', cursor: 'pointer', color: active ? accent : idle, fontSize: 9.5, fontWeight: active ? 700 : 500, fontFamily: 'Nunito, sans-serif', marginBottom: -1, whiteSpace: 'nowrap', WebkitTapHighlightColor: 'transparent' }
            }, React.createElement(Icon, { size: 14 }), label);
          })
        ),
        React.createElement('button', { onClick: () => scroll(1), style: { position: 'absolute', right: 0, top: 0, bottom: 0, zIndex: 2, background: 'linear-gradient(to left, #f7f0e4 60%, transparent)', border: 'none', cursor: 'pointer', color: '#9c8068', padding: '0 8px' } }, React.createElement(ChevronRight, { size: 14 }))
      ),
      // Unlock hint — shown only when this is an unsaved settlement (Create
      // page). Replaces the disabled "save to enable" chip that used to live
      // in the header next to the regen button. Single calm hint, single
      // place; clicked nowhere.
      !narrativeEnabled && React.createElement('div', {
        style: {
          padding: '8px 18px',
          borderBottom: '1px solid #e0d0b0',
          background: 'linear-gradient(135deg, rgba(74,26,122,0.05), rgba(106,42,154,0.02))',
          fontSize: 11.5, color: '#6b5340',
          fontFamily: 'Nunito, sans-serif',
          display: 'flex', alignItems: 'center', gap: 8,
        }
      },
        React.createElement('span', { style: { fontSize: FS.sm, color: '#8a50b0' } }, '\u2726'),
        React.createElement('span', null,
          React.createElement('strong', { style: { color: '#5a2a8a' } }, 'Save this settlement'),
          ' to unlock AI Narrative & Daily Life prose.'
        )
      ),
      // Content — dimmed overlay during regenerate so the user sees "something is changing"
      React.createElement('div', { style: { position: 'relative', minHeight: 300, background: 'rgba(250,248,244,0.97)' } },
        // ── Banners above tab content ────────────────────────────────────────
        // Banner targeting:
        //   • Thesis (identity-level prose) lives only on Summary & Overview —
        //     the high-altitude reads.
        //   • Per-tab notes (`narrativeNotes[selectedTab]`) replace the thesis
        //     on every functional tab so each tab gets a contextual lens
        //     instead of re-reading the same identity statement.
        //   • Daily Life, DM Compass, and Neighbours/Relationships carry
        //     their own AI prose inside the tab — no banner.
        // The partial-failure notice was lifted out of the thesis block so it
        // surfaces on every tab (it's a session-level concern, not an
        // identity-banner concern).
        (() => {
          if (!showNarrative || !aiSettlement) return null;
          const THESIS_TABS = ['summary', 'overview'];
          const NOTE_TABS = ['economics', 'services', 'power', 'defense', 'npcs', 'history', 'resources', 'viability'];
          const showThesis = THESIS_TABS.includes(selectedTab) && typeof aiSettlement.thesis === 'string' && aiSettlement.thesis.length > 0;
          const note = NOTE_TABS.includes(selectedTab) ? aiSettlement.narrativeNotes?.[selectedTab] : null;
          const showNote = typeof note === 'string' && note.length > 0;
          if (!showThesis && !showNote) return null;

          return React.createElement('div', {
            style: {
              padding: '12px 18px',
              borderBottom: '1px solid rgba(160,100,220,0.2)',
              background: 'linear-gradient(135deg, rgba(74,26,122,0.06), rgba(106,42,154,0.04))',
              opacity: aiRegenerating ? 0.55 : 1,
            }
          },
            React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 10 } },
              React.createElement('span', { style: { fontSize: FS.md, flexShrink: 0, marginTop: 2, color: '#8a50b0' } }, '\u2726'),
              React.createElement('div', { style: { flex: 1, minWidth: 0 } },
                React.createElement('div', { style: { fontSize: FS.micro, fontWeight: 800, color: '#8a50b0', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 } },
                  showThesis ? 'Narrative Layer \u2014 Identity' : 'Narrative Layer \u2014 Lens'
                ),
                showThesis
                  ? aiSettlement.thesis.split(/\n\n+/).map((para, i, arr) =>
                      React.createElement('p', { key: i, style: { margin: 0, marginBottom: i < arr.length - 1 ? 10 : 0, fontSize: 12.5, color: '#2d1f0e', lineHeight: 1.65, fontFamily: 'Georgia, serif' } }, para.trim())
                    )
                  : React.createElement('p', { style: { margin: 0, fontSize: 12.5, color: '#2d1f0e', lineHeight: 1.65, fontFamily: 'Georgia, serif' } }, note)
              )
            )
          );
        })(),
        // Partial-refinement notice — independent of which tab is active.
        showNarrative && storeAiPartialFailure && storeAiPartialFailure.failedFields?.length > 0 && React.createElement('div', {
          style: {
            margin: '8px 18px 0', padding: '6px 10px',
            background: 'rgba(196,128,60,0.08)',
            border: '1px solid rgba(196,128,60,0.2)',
            borderRadius: 4, fontSize: 10.5, color: '#8a5a20',
            fontFamily: 'Nunito, sans-serif',
          }
        }, `Partial refinement: ${storeAiPartialFailure.failedFields.join(', ')} kept raw data.`),
        // Tier 6.7 — runtime verifier findings. Surfaces hard
        // violations (invented entity, renamed proper noun,
        // overwritten user edit) so the DM sees the AI output isn't
        // safe to ship without inspection.
        showNarrative && React.createElement(AiOverlayViolations, {
          violations: storeAiViolations,
          onDismiss: clearAiViolations,
        }),
        // Tier 5.1 — what changed in the most recent regenerate.
        // Visible regardless of narrative mode so the DM can audit
        // engine-side decisions independently of AI prose.
        React.createElement(RegenerationDeltaCard, {
          delta: storeLastRegenerationDelta,
          onDismiss: clearLastRegenerationDelta,
        }),
        // Regenerate overlay — floats progress above the dimmed existing content
        aiRegenerating && React.createElement('div', {
          style: {
            position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
            zIndex: 20, background: 'rgba(74,26,122,0.95)', color: '#f0d8ff',
            padding: '8px 16px', borderRadius: 20, border: '1px solid rgba(160,100,220,0.6)',
            fontSize: 11.5, fontWeight: 700, fontFamily: 'Nunito, sans-serif',
            display: 'flex', alignItems: 'center', gap: 8,
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          }
        },
          React.createElement('span', { style: { display: 'inline-block', animation: 'spin 1.2s linear infinite' } }, '\u2726'),
          displayProgress || 'Regenerating\u2026'
        ),
        React.createElement(
          Suspense,
          { fallback: React.createElement('div', {
              style: { padding: 32, textAlign: 'center', color: '#9c8068',
                       fontFamily: 'Nunito,sans-serif', fontSize: FS.md }
            }, 'Loading\u2026') },
          React.createElement('div', { style: { opacity: aiRegenerating ? 0.6 : 1, transition: 'opacity 0.2s' } },
            renderTab()
          )
        ),
        React.createElement('style', null, '@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }')
      )
    ),
    // P142 / D-6 — Table View overlay. Rendered as a sibling of the dossier
    // card so it takes over the full viewport. Gated on flag + the
    // tableViewOpen pref so the lazy chunk only loads when actually opened.
    flag('tableView') && tableViewOpen && React.createElement(Suspense, { fallback: null },
      React.createElement(TableView, {
        settlement: activeSettlement,
        onClose: () => setUserPref && setUserPref('tableViewOpen', false),
      })
    ),
    React.createElement(ConfirmDialog, {
      open: !!pendingAiAction,
      tone: 'warning',
      title: 'Send AI guidance?',
      body: 'The AI Guidance note from Notes will be sent with this generation. DM Notes stay private and are not included.',
      confirmLabel: 'Send guidance',
      cancelLabel: 'Cancel',
      onConfirm: confirmGuidedAiAction,
      onCancel: () => setPendingAiAction(null),
    })
  ); // close Fragment
}
