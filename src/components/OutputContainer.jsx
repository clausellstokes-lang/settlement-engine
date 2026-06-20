import React, { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { FS, swatch } from './theme.js';
import { runAiLayer } from '../generators/aiLayer';
import { Scroll, MapPin, Coins, Building2, Shield, Swords, Users, History, Package, CircleCheckBig, Compass, Cog, StickyNote, Sparkles, Drama, ScrollText, Network, Wand2 } from 'lucide-react';
import { useStore } from '../store/index.js';
import { isConfigured } from '../lib/supabase.js';
import PipelineRail from './PipelineRail.jsx';
import FeatureErrorBoundary from './FeatureErrorBoundary.jsx';
import ShareToGallery from './ShareToGallery.jsx';
import BuyThisDossier from './BuyThisDossier.jsx';
import { AiOverlayViolations } from './primitives/AiOverlayViolations.jsx';
import { RegenerationDeltaCard } from './primitives/RegenerationDeltaCard.jsx';
import { flag } from '../lib/flags.js';
import { Funnel, EVENTS } from '../lib/analytics.js';
import { useSectionDwell } from '../hooks/useSectionDwell.js';
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
// edit through the pending-edits drawer (E-2). The editable name now
// lives inside DossierHeaderRow, which imports EditableInline directly.
import DossierNarrativeButtons from './dossier/DossierNarrativeButtons.jsx';
import DossierHeaderRow from './dossier/DossierHeaderRow.jsx';
import DossierNarrativeBanner from './dossier/DossierNarrativeBanner.jsx';
import DossierTabStrip from './dossier/DossierTabStrip.jsx';
import DossierGroupTabStrip from './dossier/DossierGroupTabStrip.jsx';
// UX overhaul Phase 2 — the single altitude axis. The control lives in the
// dossier header strip; `useAltitude` drops the Substrate sub-tab from the strip
// at Overview (the clean face) so a new DM never lands on the empty 15-var grid.
import AltitudeControl from './common/AltitudeControl.jsx';
import { useAltitude } from '../hooks/useAltitude.js';

// ── Lazy-loaded tabs (each loads only when first viewed) ────────────────────
const SummaryTab = lazy(() => import('./new/SummaryTab'));
// P129 / D-2 — Magazine-spread Summary V2. Self-gated by the
// `summaryMagazineV2` flag in renderTab(); legacy SummaryTab still
// loads in parallel so toggling the flag is instant.
const SummaryTabV2 = lazy(() => import('./new/SummaryTabV2.jsx'));
const PlotHooksTab = lazy(() => import('./new/tabs/PlotHooksTab.jsx'));
const ChronicleTab = lazy(() => import('./new/tabs/ChronicleTab.jsx'));
const OverviewTab = lazy(() => import('./new/tabs/OverviewTab'));
const EconomicsTab = lazy(() => import('./new/tabs/EconomicsTab'));
const ServicesTab = lazy(() => import('./new/tabs/ServicesTab'));
const PowerTab = lazy(() => import('./new/tabs/PowerTab'));
const DefenseTab = lazy(() => import('./new/tabs/DefenseTab'));
// UX overhaul Phase 2 — new Systems sub-tabs: the 15-var causal Substrate and the
// 10-facet Magic profile. Both mount the P0/P1 building blocks and self-gate /
// altitude-gate inside.
const SubstrateTab = lazy(() => import('./new/tabs/SubstrateTab.jsx'));
const MagicTab = lazy(() => import('./new/tabs/MagicTab.jsx'));
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
//   notes    → DM Notes, AI Notes, Chronicle (the living-history feed, §8 M3c).
//              DM/AI notes are owner-private; the Chronicle is the one Notes
//              sub-tab that also renders on public gallery dossiers, fed by
//              the RPC's allowlisted `chronicle` column (migration 032)
//              through the publicChronicle prop.
//
// Simulation lives in the drawer trigger near the dossier actions, not in
// the reading tab strip. Sub-tabs the current settlement doesn't render
// (e.g. dm_compass without narration, plot_hooks with no hooks) are dropped
// from the strip by the resolver below.
export const TAB_GROUPS = Object.freeze({
  summary: { label: 'Summary', tabs: ['overview', 'summary', 'plot_hooks', 'dm_compass'] },
  systems: { label: 'Systems', tabs: ['substrate', 'magic', 'services', 'economics', 'power', 'defense', 'resources', 'viability'] },
  world:   { label: 'World',   tabs: ['relationships', 'daily_life', 'npcs', 'history', 'neighbours'] },
  notes:   { label: 'Notes',   tabs: ['dm_notes', 'ai_notes', 'chronicle'] },
});

const TABS = [
  { id: 'overview',   label: 'Overview',   Icon: MapPin },
  { id: 'summary',    label: 'DM Summary', Icon: Scroll },
  { id: 'substrate',  label: 'Substrate',  Icon: Network },
  { id: 'magic',      label: 'Magic',      Icon: Wand2 },
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
  { id: 'chronicle',  label: 'Chronicle',  Icon: ScrollText },
  // Simulation tab — meta surface. The pipeline rail used to render as
  // an always-on banner above the dossier, but that pushed the actual
  // DM-facing content below the fold. Now it lives as the last tab so
  // the dossier itself is the default landing surface.
  { id: 'simulation', label: 'Simulation', Icon: Cog },
];
const REROLLABLE = { npcs: 'Reroll NPCs', history: 'Reroll History' };

// Coarse dwell-time banding (taxonomy §"Banding vocabularies": dwell_ms_band).
// Derived inline so no raw durations ever leave the client.
function dwellMsBand(ms) {
  const n = Number(ms) || 0;
  if (n < 5000) return 'lt_5s';
  if (n < 15000) return '5_15s';
  if (n < 60000) return '15_60s';
  if (n < 300000) return '1_5m';
  if (n < 1800000) return '5_30m';
  return 'gt_30m';
}

function chronicleReferenceFor(saveEntry) {
  const cs = saveEntry?.campaignState;
  return cs?.worldState?.canonizedAt || cs?.canonizedAt || cs?.startedAt || null;
}

export function collectChronicle(saveEntry, settlement, publicChronicle = null) {
  // The unified Chronicle feed (spec §8 M3c): manual events + party-caused +
  // world-pulse, merged + normalized + sorted newest-first and timed relative to
  // canonization by the shared domain helper, so screen + any future surface
  // read one source of truth.
  //
  // A PUBLIC gallery dossier has no saved campaignState — the gallery RPC
  // projects an allowlisted copy of the eventLog into its own `chronicle`
  // column (migration 032; re-filtered client-side in gallery.js), threaded
  // here as publicChronicle and fed through the same manual-source
  // normalization. It is consulted ONLY when there is no save entry at all;
  // owner surfaces (live editor, saved view) never pass it, so the owner feed
  // is byte-for-byte what it was before.
  return buildChronicleFeed({
    manual:     saveEntry ? saveEntry.campaignState?.eventLog : publicChronicle,
    worldPulse: saveEntry?.campaignState?.worldPulse?.events,
    worldLog:   saveEntry?.campaignState?.worldState?.eventLog,
    recent:     settlement?.recentEvents,
  }, { limit: 60, reference: chronicleReferenceFor(saveEntry) });
}

export default function OutputContainer({ settlement: propSettlement, readOnly = false, saveId = null, playerView = false, hideHeader = false, publicChronicle = null, allowRename = false, onRenameSettlement = null }) {
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
  // Only a PUBLIC gallery dossier (read-only AND no saveId) reads the narrated
  // layer off the passed settlement — it embeds its own (compass-only when shareDm)
  // and has no store context, so this prevents the viewer's own AI from bleeding
  // in. Every owner surface (the live editor, and SettlementDetail's read-only
  // saved view which DOES pass a saveId) keeps reading the store, unchanged.
  const aiSettlement = playerView
    ? null
    : (readOnly && !saveId ? (propSettlement?.aiSettlement ?? null) : storeAi);
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
  // UX overhaul Phase 2 — the single progressive-disclosure altitude axis.
  const { level: altitude } = useAltitude();
  const [activeTab, _setActiveTab] = useState('overview');
  // Analytics: how the next resolved tab came to be selected. A direct tab-strip
  // click reports 'tab_click', a group click 'group_click'; the resolver falling
  // back to a different tab (or the initial mount) reports 'auto_select'. Read +
  // cleared by the DOSSIER_TAB_VIEWED effect below. Additive — never affects flow.
  const pendingTabViaRef = useRef('auto_select');
  const setActiveTab = (id, via = 'tab_click') => {
    pendingTabViaRef.current = via;
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
  // A public shareDm dossier carries ONLY the DM-Compass fields of aiSettlement (a
  // partial object) — used for the Guidance tab alone; rendering the dossier from
  // it would blank the page. So only drive the main render from aiSettlement when
  // it's a FULL settlement (has core fields), not the compass-only partial. The
  // owner's saved-settlement + editor narrative views (full aiSettlement) are
  // unaffected.
  const aiIsFullSettlement = !!(aiSettlement && (aiSettlement.name || aiSettlement.npcs || aiSettlement.institutions));
  const showNarrative = storeShowNarrative && aiIsFullSettlement;
  const activeSettlement = showNarrative ? aiSettlement : rawSettlement;
  const dossierNotes = liveSaveEntry?.aiData?.dossierNotes || null;
  const aiGuidance = typeof dossierNotes?.aiGuidance === 'string' ? dossierNotes.aiGuidance.trim() : '';
  // Memoized on the same inputs collectChronicle reads, so tab switches / AI
  // state changes / unrelated store churn don't re-merge + re-sort the up-to-60
  // entry feed every render (matches the treatment of hasPlotHooks/pinnedIds).
  const chronicle = React.useMemo(
    () => collectChronicle(liveSaveEntry, rawSettlement, publicChronicle),
    [liveSaveEntry, rawSettlement, publicChronicle],
  );
  // History tab keeps a short "Recent Events" glance; the full Chronicle lives
  // under Notes (spec §8 M3c relocation).
  const recentEvents = chronicle.slice(0, 8);

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
  const hasCompass = (o) => !!(o && (
    (Array.isArray(o.identityMarkers) && o.identityMarkers.length) ||
    (Array.isArray(o.frictionPoints)  && o.frictionPoints.length)  ||
    (Array.isArray(o.connectionsMap)  && o.connectionsMap.length)  ||
    (o.dmCompass && (
      (Array.isArray(o.dmCompass.hooks)    && o.dmCompass.hooks.length) ||
      (Array.isArray(o.dmCompass.redFlags) && o.dmCompass.redFlags.length) ||
      (typeof o.dmCompass.twist === 'string' && o.dmCompass.twist.length)
    ))
  ));
  // A PUBLIC gallery dossier (read-only, no owning saveId) embeds the AI layer
  // INTO the published settlement — the server ships the refined clone with the
  // DM Compass + narrative thesis at the top level, and there's no aiSettlement
  // overlay to read. So source the Guidance tab (and the narrative lens below)
  // from the rendered settlement in that case. SAFE BY CONSTRUCTION: this only
  // ever surfaces what the gallery projection already made public — the Compass
  // is stripped from the payload unless the owner opted into shareDm, so this can
  // never reveal more than is already shared.
  const publicDossier = readOnly && !saveId;
  const compassSource = hasCompass(aiSettlement)
    ? aiSettlement
    : (publicDossier && hasCompass(rawSettlement) ? rawSettlement : null);
  const hasDMCompass = !!compassSource;

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
    // UX overhaul Phase 2 — the Substrate sub-tab renders nothing at Overview
    // (the 15-var grid is engine depth). Drop it from the strip at 'guided' so a
    // new DM never lands on an empty tab; it returns at Detail / Engine.
    if (t.id === 'substrate' && altitude === 'guided') return false;
    // Notes (DM/AI) are owner-private prep: hidden from the public player
    // view, but shown on saved settlements even though the dossier prose is
    // readOnly (editability is keyed on saveId inside NotesTab, not readOnly).
    // The Chronicle is NOT private — event titles + summaries ship publicly
    // through the gallery RPC's allowlisted `chronicle` column (migration 032,
    // disclosed in the share flow) — so it stays visible in the player view.
    if (playerView && ['summary', 'dm_notes', 'ai_notes'].includes(t.id)) return false;
    // DM Notes are a private DM scratch space — never surface them on a public /
    // shared gallery dossier (readOnly with no owning saveId), even in the full
    // "Reveal DM-private content" view. They're truly confidential to the DM and
    // are kept only on the owner's own saved-settlement view (readOnly + saveId)
    // and the live editor (not readOnly).
    if (t.id === 'dm_notes' && readOnly && !saveId) return false;
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
  // TAB_GROUPS is frozen/constant, so this map has a stable value for the life
  // of the component. Memoizing it (rather than rebuilding a fresh object every
  // render) keeps the tabGroupRef-sync effect below from firing on every render.
  const tabToGroup = React.useMemo(() => {
    const m = {};
    Object.entries(TAB_GROUPS).forEach(([gid, g]) => {
      g.tabs.forEach(tid => { m[tid] = gid; });
    });
    return m;
  }, []);
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
      if (firstAvailable) setActiveTab(firstAvailable, 'group_click');
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

  // ── Dossier-reading analytics (taxonomy §2; additive, fire-and-forget) ──────
  // Coarse props only: tab/group enums, narrative-mode enum, dwell bands, counts.
  // No names, no prose, no whole settlement — derived inline below.
  const dossierContentRef = useRef(null);
  // Narrative lens the reader is currently in. showNarrative is the resolved
  // "AI clone is the source" flag computed above.
  const narrativeMode = showNarrative ? 'ai' : 'raw';
  // Stable getters for inside the dwell/unmount effects so they don't churn the
  // effect deps. Refs mirror the latest render values, written in an effect so
  // the assignment is a committed side effect, never a during-render mutation.
  const tabGroupRef = useRef(tabToGroup);
  const narrativeModeRef = useRef(narrativeMode);
  useEffect(() => { tabGroupRef.current = tabToGroup; }, [tabToGroup]);
  useEffect(() => { narrativeModeRef.current = narrativeMode; }, [narrativeMode]);

  // Per-mount reading aggregator — drives DOSSIER_READ_SESSION_SUMMARY. Holds
  // only coarse aggregate state (a Set of viewed tab ids + the deepest-dwelt
  // tab), never any content.
  const readSessionRef = useRef({ tabsViewed: new Set(), deepestDwellTabId: null, deepestDwellMs: -1 });

  // DOSSIER_TAB_VIEWED — fire once per resolved-tab change. `selectedTab` is the
  // resolver's output (handles auto-fallback), so this also covers auto_select.
  useEffect(() => {
    if (!selectedTab) return;
    const via = pendingTabViaRef.current || 'auto_select';
    pendingTabViaRef.current = 'auto_select';
    readSessionRef.current.tabsViewed.add(selectedTab);
    Funnel.track(EVENTS.DOSSIER_TAB_VIEWED, {
      tab_id: selectedTab,
      group: tabGroupRef.current[selectedTab] || 'summary',
      via,
      narrative_mode: narrativeModeRef.current,
    });
  }, [selectedTab]);

  // DOSSIER_SECTION_DWELL — fired once per tab activation by the hook when the
  // content has been ≥50% visible + foreground for ≥2s. Coarse band only.
  useSectionDwell(dossierContentRef, selectedTab, (dwellMs) => {
    const agg = readSessionRef.current;
    if (dwellMs > agg.deepestDwellMs) {
      agg.deepestDwellMs = dwellMs;
      agg.deepestDwellTabId = selectedTab;
    }
    Funnel.track(EVENTS.DOSSIER_SECTION_DWELL, {
      tab_id: selectedTab,
      group: tabGroupRef.current[selectedTab] || 'summary',
      dwell_ms_band: dwellMsBand(dwellMs),
      narrative_mode: narrativeModeRef.current,
    });
  });

  // DOSSIER_READ_SESSION_SUMMARY — on unmount (page leave) and when the dossier
  // switches to a different settlement (the reading session ends either way).
  // saveId / settlement identity in the dep array re-runs the cleanup at the
  // boundary, emitting the summary for the session that just closed.
  const readSessionSubject = saveId || rawSettlement?.id || null;
  useEffect(() => {
    const agg = { tabsViewed: new Set(), deepestDwellTabId: null, deepestDwellMs: -1 };
    readSessionRef.current = agg;
    return () => {
      const tabsViewedCount = agg.tabsViewed.size;
      if (tabsViewedCount === 0) return; // nothing read — skip an empty summary
      Funnel.track(EVENTS.DOSSIER_READ_SESSION_SUMMARY, {
        tabs_viewed_count: tabsViewedCount,
        deepest_dwell_tab_id: agg.deepestDwellTabId || undefined,
      });
    };
  }, [readSessionSubject]);

  const renderTab = () => {
    const s = activeSettlement;
    switch (selectedTab) {
      case 'summary':    return (
        <>
          {/* First-dossier teaching callouts now live inside the DM summary (was a
              top-of-dossier banner above every tab). Self-gates inside. */}
          {!readOnly && <Suspense fallback={null}><FirstDossierCallouts /></Suspense>}
          {flag('summaryMagazineV2')
            ? <SummaryTabV2
                settlement={s}
                onOpenTableView={flag('tableView')
                  ? () => useStore.getState().setUserPref?.('tableViewOpen', true)
                  : undefined}
              />
            : <SummaryTab settlement={s} saveId={saveId} />}
        </>
      );
      case 'plot_hooks': return <PlotHooksTab settlement={s} />;
      case 'chronicle':  return <ChronicleTab entries={chronicle} />;
      case 'daily_life': return <DailyLifeTab settlement={s} aiSettlement={aiSettlement} saveId={saveId} onRequestDailyLife={() => requestAiAction('dailyLife')} />;
      case 'overview':   return <OverviewTab settlement={s} narrativeNote={null} />;
      case 'economics':  return <EconomicsTab settlement={s} narrativeNote={null} />;
      case 'services':   return <ServicesTab services={s.availableServices} settlement={s} narrativeNote={null} />;
      case 'power':      return <PowerTab powerStructure={s.powerStructure} settlement={s} narrativeNote={null} />;
      case 'defense':    return <DefenseTab settlement={s} narrativeNote={null} saveId={saveId} />;
      case 'substrate':  return <SubstrateTab settlement={s} saveId={saveId} />;
      case 'magic':      return <MagicTab settlement={s} />;
      case 'npcs':       return <NPCsTab npcs={s.npcs} settlement={s} onRerollNPCs={onRegenerate ? () => onRegenerate('npcs') : null} narrativeNote={null} pinnedIds={pinnedIds} onTogglePin={onTogglePin} />;
      case 'history':    return <HistoryTab settlement={s} narrativeNote={null} recentEvents={recentEvents} onReroll={onRegenerate ? () => onRegenerate('history') : null} />;
      case 'resources':  return <ResourcesTab settlement={s} narrativeNote={null} />;
      case 'viability':  return <ViabilityTab settlement={s} narrativeNote={null} />;
      case 'dm_compass': return <DMCompassTab settlement={compassSource || s} />;
      case 'dm_notes':   return <NotesTab saveId={saveId} notes={dossierNotes} section="dm" />;
      case 'ai_notes':   return <NotesTab saveId={saveId} notes={dossierNotes} section="ai" />;
      case 'neighbours':    return <RelationshipsTab settlement={s} narrativeNote={null} neighboursOnly={true} />;
      case 'relationships': return <RelationshipsTab settlement={s} narrativeNote={null} />;
      // Simulation = full PipelineRail (non-compact). Since the rail now
      // lives inside the dossier card, we surface the full pipeline view
      // here — step labels + traces + the eventual causal expand-on-tap.
      case 'simulation': return (
        <div style={{ padding: '16px 18px' }}>
          <PipelineRail compact={false} />
        </div>
      );
      default:           return <div />;
    }
  };

  // Header chips read from the raw settlement — mechanical facts shouldn't
  // change between views.
  const settlement = rawSettlement;
  // Optional chaining: the null-settlement early-exit is deliberately deferred to
  // after all hooks (line ~567), so this runs even when settlement is null.
  const stressObj = settlement?.stress
    ? (Array.isArray(settlement.stress) ? settlement.stress[0] : settlement.stress) : null;

  // ── Button group state ─────────────────────────────────────────────────────
  // Three distinct buttons replace the old single action so view-toggling
  // can't accidentally spend credits.
  const renderNarrativeButtons = () => (
    <DossierNarrativeButtons
      narrativeEnabled={narrativeEnabled}
      isConfigured={isConfigured}
      getCost={getCost}
      aiSettlement={aiSettlement}
      aiLoading={aiLoading}
      aiRegenerating={aiRegenerating}
      aiError={aiError}
      displayProgress={displayProgress}
      storeShowNarrative={storeShowNarrative}
      setShowNarrative={setShowNarrative}
      runNarrativeLayer={runNarrativeLayer}
    />
  );

  // Deferred null check (see comment near the top of this component).
  // All hooks are now committed; safe to early-exit.
  if (earlyExitOnNoSettlement) return null;

  return (
    <>
      {/* Note: the "How this was simulated" rail used to render here as an
          always-on banner above the dossier card. User feedback was that
          it pushed the actual DM-facing dossier below the fold. Now it
          lives as the last tab inside the dossier ("Simulation"), so the
          dossier itself is the default landing surface and the simulation
          metadata is one tap away rather than top-of-page chrome. */}
      <div style={{ background: 'rgba(255,251,245,0.96)', border: '1px solid #c8b89a', borderRadius: 10, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.35)' }}>
        {/* Header — suppressed via hideHeader in the embedded generate-flow view,
            where the wizard's own sticky toolbar already shows name/tier/pop, so
            the two dark identity bars collapse into one. */}
        {hideHeader ? null : (
          <DossierHeaderRow
            readOnly={readOnly}
            queueEdit={queueEdit}
            settlement={settlement}
            saveId={saveId}
            stressObj={stressObj}
            selectedTab={selectedTab}
            onRegenerate={onRegenerate}
            REROLLABLE={REROLLABLE}
            allowRename={allowRename}
            onRenameSettlement={onRenameSettlement}
            narrativeButtons={(!flag('narrativeLayerStrip') || readOnly) && renderNarrativeButtons()}
          />
        )}
        {/* P121 — Labeled narrative-layer strip. Below the header, above
            the tab strip. Lives in its own card with title + cost pill +
            single primary action. The renderNarrativeButtons() output
            sits inside the strip; the buttons themselves are unchanged. */}
        {flag('narrativeLayerStrip') && !readOnly && (
          <div
            style={{
              margin: '8px 18px',
              padding: '10px 12px',
              background: 'linear-gradient(135deg, rgba(123,79,207,0.05), rgba(123,79,207,0.02))',
              border: '1px solid rgba(123,79,207,0.30)',
              borderLeft: '3px solid rgba(123,79,207,0.70)',
              borderRadius: 5,
              display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{ fontSize: FS.micro, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: swatch['#7B4FCF'] }}
              >Narrative Layer · AI prose pass</div>
              <div
                style={{ fontSize: FS.xs, color: swatch['#4A3B22'], marginTop: 2, lineHeight: 1.4 }}
              >{narrativeEnabled
                ? 'Refines the simulated dossier into prose your players can hear.'
                : 'Save this settlement to your library to refine it into prose your players can hear.'}</div>
            </div>
            {renderNarrativeButtons()}
          </div>
        )}
        {/* Owner / visitor actions strip — share-to-gallery (owners) and
            buy-this-dossier (anonymous visitors). Each child decides
            whether to render based on auth/save state. Skipped entirely
            in readOnly mode (public dossier viewer). */}
        {!readOnly && (
          <div
            style={{
              padding: '8px 18px',
              background: 'rgba(255,251,245,0.6)',
              borderBottom: '1px solid #e0d0b0',
              display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
            }}
          >
            <BuyThisDossier settlement={settlement} />
            <ShareToGallery
              saveId={saveId}
              isPublic={liveSaveEntry?.is_public}
              publicSlug={liveSaveEntry?.public_slug}
              settlement={settlement}
              galleryDescription={liveSaveEntry?.gallery_description}
              galleryImageUrl={liveSaveEntry?.gallery_image_url}
              galleryImageAlt={liveSaveEntry?.gallery_image_alt}
              galleryTags={liveSaveEntry?.gallery_tags}
              campaignState={liveSaveEntry?.campaignState}
              galleryShareNarrated={liveSaveEntry?.gallery_share_narrated}
              galleryShareDm={liveSaveEntry?.gallery_share_dm}
              galleryImportable={liveSaveEntry?.gallery_importable}
            />
            {/* P135 / D-5 — "How this was simulated" trigger. Lives next to
                BuyThisDossier so the user finds it as a "more info" affordance,
                not a chrome surface. */}
            <Suspense fallback={null}>
              <SimulationDrawer />
            </Suspense>
          </div>
        )}
        {/* P104 — Welcome credit gift card. Self-gates inside; shown to
            signed-in users on their first saved dossier when their ledger
            still has an available welcome grant. */}
        {!readOnly && (
          <Suspense fallback={null}>
            <WelcomeCreditCard saveId={saveId} />
          </Suspense>
        )}
        {/* P106 / E-2 — Pending changes bar + cascade preview. Self-gates
            inside; renders nothing when no edits are queued. */}
        {!readOnly && (
          <Suspense fallback={null}>
            <PendingChangesBar />
          </Suspense>
        )}
        {/* P130 / O-2 — First-dossier teaching callouts now render INSIDE the
            Summary tab (the DM summary), not as a banner above every tab — see
            renderTab's 'summary' case. */}
        {/* P102 / D-1 — Thematic group tab strip (Summary / Systems / World /
            Notes). Renders only when the dossierFiveTabs flag is on. Clicking a
            group selects its first sub-tab and filters the strip below. */}
        {fiveTabsEnabled && (
          <DossierGroupTabStrip
            visibleGroupEntries={visibleGroupEntries}
            selectedGroup={selectedGroup}
            handleGroupClick={handleGroupClick}
          />
        )}
        {/* UX overhaul Phase 2 — the single altitude axis (Overview / Detail /
            Engine). Sits in the dossier header so every read surface (the promoted
            4-dim strip, the Substrate grid, War & Faith depth) reads ONE pref.
            Replaces the scattered detail flags with one control a new DM can keep
            at Overview and a power user can pin to Engine. */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8,
          padding: '6px 18px', borderBottom: '1px solid #e0d0b0',
          background: 'rgba(255,251,245,0.6)',
        }}>
          <span style={{ fontSize: FS.xxs, color: swatch.mutedBrown, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Detail
          </span>
          <AltitudeControl size="sm" ariaLabel="Dossier detail level" />
        </div>
        {/* Tab strip */}
        <DossierTabStrip
          onboardingActive={onboardingActive}
          onboardingStep={onboardingStep}
          scroll={scroll}
          scrollRef={scrollRef}
          tabs={tabs}
          selectedTab={selectedTab}
          setActiveTab={setActiveTab}
        />
        {/* Content — dimmed overlay during regenerate so the user sees "something is changing" */}
        <div style={{ position: 'relative', minHeight: 300, background: 'rgba(250,248,244,0.97)' }}>
          {/* ── Banners above tab content ────────────────────────────────────────
              Banner targeting:
                • Thesis (identity-level prose) lives only on Summary & Overview —
                  the high-altitude reads.
                • Per-tab notes (`narrativeNotes[selectedTab]`) replace the thesis
                  on every functional tab so each tab gets a contextual lens
                  instead of re-reading the same identity statement.
                • Daily Life, DM Compass, and Neighbours/Relationships carry
                  their own AI prose inside the tab — no banner.
              The partial-failure notice was lifted out of the thesis block so it
              surfaces on every tab (it's a session-level concern, not an
              identity-banner concern). */}
          <DossierNarrativeBanner
            showNarrative={showNarrative}
            aiSettlement={aiSettlement}
            publicDossier={publicDossier}
            rawSettlement={rawSettlement}
            selectedTab={selectedTab}
            aiRegenerating={aiRegenerating}
          />
          {/* Partial-refinement notice — independent of which tab is active. */}
          {showNarrative && storeAiPartialFailure && storeAiPartialFailure.failedFields?.length > 0 && (
            <div
              style={{
                margin: '8px 18px 0', padding: '6px 10px',
                background: 'rgba(196,128,60,0.08)',
                border: '1px solid rgba(196,128,60,0.2)',
                borderRadius: 4, fontSize: FS.xs, color: swatch['#8A5A20'],
                fontFamily: 'Nunito, sans-serif',
              }}
            >{`Partial refinement: ${storeAiPartialFailure.failedFields.join(', ')} kept raw data.`}</div>
          )}
          {/* Tier 6.7 — runtime verifier findings. Surfaces hard
              violations (invented entity, renamed proper noun,
              overwritten user edit) so the DM sees the AI output isn't
              safe to ship without inspection. */}
          {showNarrative && (
            <AiOverlayViolations
              violations={storeAiViolations}
              onDismiss={clearAiViolations}
            />
          )}
          {/* Tier 5.1 — what changed in the most recent regenerate.
              Visible regardless of narrative mode so the DM can audit
              engine-side decisions independently of AI prose. */}
          <RegenerationDeltaCard
            delta={storeLastRegenerationDelta}
            onDismiss={clearLastRegenerationDelta}
          />
          {/* Regenerate overlay — floats progress above the dimmed existing content */}
          {aiRegenerating && (
            <div
              style={{
                position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
                zIndex: 20, background: 'rgba(74,26,122,0.95)', color: swatch['#F0D8FF'],
                padding: '8px 16px', borderRadius: 20, border: '1px solid rgba(160,100,220,0.6)',
                fontSize: FS.sm, fontWeight: 700, fontFamily: 'Nunito, sans-serif',
                display: 'flex', alignItems: 'center', gap: 8,
                boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
              }}
            >
              <span style={{ display: 'inline-block', animation: 'spin 1.2s linear infinite' }}>{'\u2726'}</span>
              {displayProgress || 'Regenerating\u2026'}
            </div>
          )}
          <Suspense
            fallback={
              <div style={{ padding: 32, textAlign: 'center', color: swatch.mutedBrown, fontFamily: 'Nunito,sans-serif', fontSize: FS.md }}>Loading\u2026</div>
            }
          >
            {/* Resilience: the active tab renders live, malformed-by-construction
                simulation data (forks, imports, regen drift). A throw in any one
                tab must degrade to a recoverable fallback INSIDE the dossier card
                \u2014 not propagate to the root boundary and blank the whole app. The
                resetKey is the selected tab so switching tabs auto-recovers. */}
            <FeatureErrorBoundary label="OutputContainer.tab" kind="react.render.dossier" fallbackTitle="This section of the dossier couldn't be displayed." resetKeys={[selectedTab, readSessionSubject]}>
              <div ref={dossierContentRef} style={{ opacity: aiRegenerating ? 0.6 : 1, transition: 'opacity 0.2s' }}>{renderTab()}</div>
            </FeatureErrorBoundary>
          </Suspense>
          <style>{'@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }'}</style>
        </div>
      </div>
      {/* P142 / D-6 — Table View overlay. Rendered as a sibling of the dossier
          card so it takes over the full viewport. Gated on flag + the
          tableViewOpen pref so the lazy chunk only loads when actually opened. */}
      {flag('tableView') && tableViewOpen && (
        <Suspense fallback={null}>
          <TableView
            settlement={activeSettlement}
            onClose={() => setUserPref && setUserPref('tableViewOpen', false)}
          />
        </Suspense>
      )}
      <ConfirmDialog
        open={!!pendingAiAction}
        tone="warning"
        title="Send campaign context?"
        body="Your Campaign Context from Notes will be woven into the narration as established lore. Settlement facts still take precedence. DM Notes stay private and are not included."
        confirmLabel="Send context"
        cancelLabel="Cancel"
        onConfirm={confirmGuidedAiAction}
        onCancel={() => setPendingAiAction(null)}
      />
    </>
  );
}
