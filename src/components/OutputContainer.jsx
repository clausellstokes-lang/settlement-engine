import React, { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { FS, swatch } from './theme.js';
import { runTemplateNarrative } from '../generators/aiLayer';
import { Scroll, MapPin, Coins, Building2, Shield, Swords, Users, History, Package, CircleCheckBig, Compass, Cog, StickyNote, Sparkles, Drama, ScrollText, Clock } from 'lucide-react';
import { useStore } from '../store/index.js';
import { isConfigured } from '../lib/supabase.js';
import PipelineRail from './PipelineRail.jsx';
import ShareToGallery from './ShareToGallery.jsx';
import BuyThisDossier from './BuyThisDossier.jsx';
import { AiOverlayViolations } from './primitives/AiOverlayViolations.jsx';
import { RegenerationDeltaCard } from './primitives/RegenerationDeltaCard.jsx';
import { flag } from '../lib/flags.js';
import { Funnel, EVENTS } from '../lib/analytics.js';
import { useSectionDwell } from '../hooks/useSectionDwell.js';
import { collectPlotHooks } from '../domain/dossier/plotHooks.js';
import { buildChronicleFeed } from '../domain/dossier/chronicleFeed.js';
import { campaignHasRumorLedger } from '../domain/display/settlementRumors.js';
import DossierAiConfirms, { toFriendlyAiError } from './dossier/DossierAiConfirms.jsx';
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

// ── Lazy-loaded tabs (each loads only when first viewed) ────────────────────
// Extracted VERBATIM to the sibling registry (the DossierGroupTabStrip idiom)
// so this file stays under the max-lines ratchet as tabs accrue; chunking is
// unchanged (same per-tab dynamic imports, now declared one hop away).
import {
  ChronicleTab, DMCompassTab, DailyLifeTab, DefenseTab, DeityAssignmentPanel,
  EconomicsTab, HistoryTab, MagicTab, NPCsTab, NotesTab, OverviewTab,
  PlotHooksTab, PowerTab, RelationshipsTab, ResourcesTab, RumorsTab,
  ServicesTab, SubstrateTab, SummaryTab, SummaryTabV2, VersionsTab,
  ViabilityTab, WarFaithTab,
} from './dossier/dossierLazyTabs.js';


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
  systems: { label: 'Systems', tabs: ['services', 'economics', 'power', 'defense', 'resources', 'viability', 'substrate', 'magic', 'war_faith'] },
  world:   { label: 'World',   tabs: ['relationships', 'rumors', 'daily_life', 'npcs', 'history', 'neighbours'] },
  notes:   { label: 'Notes',   tabs: ['dm_notes', 'ai_notes', 'chronicle', 'versions'] },
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
  // Phase 5 W4e — the causal-engine + magic reads. Always available (every
  // settlement derives a substrate / magic posture); each self-handles dormancy
  // inside. Reuse already-bundled icons (Cog / Sparkles) — no new first-paint icon.
  { id: 'substrate',  label: 'Substrate',  Icon: Cog },
  { id: 'magic',      label: 'Magic',      Icon: Sparkles },
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

export default function OutputContainer({ settlement: propSettlement, readOnly = false, saveId = null, playerView = false, hideHeader = false, publicChronicle = null }) {
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
  // Phase 5 W4e — War & Faith tab presence inputs. Viewer tier + campaign
  // membership decide whether the tab (war half + the GATED faith half) has
  // anything to show. These gate PRESENCE, not content — they never read the live
  // pantheon; faith content stays behind FaithSection's premium seam.
  const viewerIsPremium = useStore(s => s.auth?.tier === 'premium' || (typeof s.isElevated === 'function' ? s.isElevated() : false));
  const inCampaign = useStore(s => (saveId && typeof s.isSettlementClockBound === 'function') ? s.isSettlementClockBound(saveId) : false);
  // Phase 5.5 STEP 3.5 — Rumors & News tab presence: the owning campaign's
  // world carries a rumor ledger (the conditionally-materialized rumorLedgers
  // key exists only under a spatial canon + a live infoMode). Dormant /
  // legacy / omniscient campaigns have no key ⇒ no tab ⇒ the dossier UI is
  // byte-identical. Boolean-only selector; the ledger itself is read lazily
  // inside RumorsTab.
  const hasRumorLedger = useStore(s => campaignHasRumorLedger(s.campaigns, saveId));

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
  // Regenerating the narrative discards the current prose (and spends credits
  // when configured). When prose already exists we gate the destructive run
  // behind a discard-confirm; first generation has nothing to lose, so the
  // friction only applies when something is actually at risk.
  const [pendingRegenerate, setPendingRegenerate] = useState(false);
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
  // fall back to the local template narrative engine for local dev
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
  const chronicle = collectChronicle(liveSaveEntry, rawSettlement, publicChronicle);
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
        const result = await runTemplateNarrative(rawSettlement, msg => setAiProgress(msg));
        setAiSettlement?.(result);
      } catch (e) {
        // Never surface a raw transport/engine message on the trust surface;
        // log it and show GM-facing domain language instead.
        console.error('[OutputContainer] local narrative generation failed', e);
        setLocalAiError(toFriendlyAiError(e));
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

  // A full narrative already exists → regenerate is destructive, so gate the
  // discard-and-spend behind a confirm. aiIsFullSettlement guards the
  // compass-only partial (public shareDm dossier never trips it); first
  // generation (no prose yet) proceeds straight through.
  const runNarrativeLayer = () => (aiIsFullSettlement ? setPendingRegenerate(true) : requestAiAction('narrative'));
  const confirmRegenerate = () => { setPendingRegenerate(false); requestAiAction('narrative'); };

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
  // Phase 5 W4e — War & Faith presence. The faith half renders SOMETHING unless
  // the viewer is premium/elevated with no deity embed (FaithSection's HIDDEN
  // mode): an embed → the read-only panel for all; a non-premium owner → the
  // generic teaser (names NO deity). So the tab shows when the faith half would
  // render OR the town is in a live campaign (war state). Premium + deity-free +
  // non-campaign ⇒ no tab; a public deity-free dossier stays clean. Presence is
  // tier-gated the SAME way FaithSection's CONTENT is — it never leaks a name.
  const faithHasEmbed = !!(rawSettlement?.config?.primaryDeitySnapshot && typeof rawSettlement.config.primaryDeitySnapshot === 'object');
  const hasWarFaith = faithHasEmbed || inCampaign || (!viewerIsPremium && !publicDossier);
  const allTabs = [...baseTabs,
    // Plot Hooks — a Summary sub-tab (spec §8); shown only when the settlement
    // actually surfaces structural hooks.
    ...(hasPlotHooks ? [{ id:'plot_hooks', label:'Plot Hooks', Icon: Drama }] : []),
    // War & Faith (Systems) — OUR gated FaithSection + a war half from OUR
    // warResolve read-models. Reuses the already-bundled Swords glyph (no new
    // first-paint icon). Presence gate above.
    ...(hasWarFaith ? [{ id:'war_faith', label:'War & Faith', Icon: Swords }] : []),
    // Guidance (DM Compass) — the AI-narrated layer; only present once narration
    // produced it, and tinted purple in the strip below.
    ...(!playerView && hasDMCompass ? [{ id:'dm_compass', label:'Guidance', Icon: Compass }] : []),
    // Relationships — the full relational web (RelationshipsTab). Declared in
    // TAB_GROUPS.world + renderTab but was never registered here, so the resolver
    // dropped it and only the narrower Neighbours tab rendered. Shown when the
    // settlement surfaces any relational content.
    ...(rawSettlement?.relationships?.length || rawSettlement?.factions?.length
      || rawSettlement?.neighbourNetwork?.length || rawSettlement?.neighborRelationship?.name
      // Reuses the already-bundled Users glyph (relationships = people/factions)
      // so registering the tab adds no new icon to the first-paint vendor-icons
      // chunk — keeps the closure ratchet green.
      ? [{ id:'relationships', label:'Relationships', Icon: Users }] : []),
    ...(rawSettlement?.neighborRelationship || rawSettlement?.neighbourRelationship || rawSettlement?.neighbourNetwork?.length
      ? [{ id:'neighbours', label:'Neighbours', Icon: MapPin }] : []),
    // Rumors & News (World) — present ONLY when the owning campaign's rumor
    // ledger exists (spatial canon + live infoMode). Reuses the already-bundled
    // ScrollText glyph — no new first-paint icon.
    ...(hasRumorLedger ? [{ id:'rumors', label:'Rumors & News', Icon: ScrollText }] : []),
    // Versions — the P109/E-5 snapshot timeline. Owner-only (revert mutates the
    // save): needs an owning saved entry and never renders on the public player
    // view. Self-gates further inside (versionHistory flag, tier lock).
    ...(liveSaveEntry && !playerView
      ? [{ id:'versions', label:'Versions', Icon: Clock }] : [])
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
            : <SummaryTab settlement={s} />}
        </>
      );
      case 'plot_hooks': return <PlotHooksTab settlement={s} />;
      case 'chronicle':  return <ChronicleTab entries={chronicle} />;
      case 'versions':   return <VersionsTab save={liveSaveEntry} />;
      case 'daily_life': return <DailyLifeTab settlement={s} aiSettlement={aiSettlement} saveId={saveId} onRequestDailyLife={() => requestAiAction('dailyLife')} />;
      case 'overview':   return <OverviewTab settlement={s} narrativeNote={null} />;
      case 'economics':  return <EconomicsTab settlement={s} narrativeNote={null} saveId={saveId} />;
      case 'services':   return <ServicesTab services={s.availableServices} settlement={s} narrativeNote={null} />;
      case 'power':      return (
        <>
          <PowerTab powerStructure={s.powerStructure} settlement={s} narrativeNote={null} />
          {/* The patron/cult assignment control — the settlement editor's write
              surface for the SET_PRIMARY_DEITY canon event. Editable dossiers only
              (never a public/shared read-only view); self-gates by tier inside.
              (W4e) The faith READ surface moved to the dedicated War & Faith tab;
              the assignment WRITE control stays under Power — deity assignment
              props/erodes the ruler's legitimacy, so it belongs with governance. */}
          {!readOnly && <Suspense fallback={null}><DeityAssignmentPanel /></Suspense>}
        </>
      );
      case 'substrate':  return <SubstrateTab settlement={s} />;
      case 'magic':      return <MagicTab settlement={s} />;
      // War & Faith — OUR gated FaithSection + a war half from OUR light
      // warStatus read-models. FaithSection self-gates by tier (full panel on an embed,
      // generic teaser for free/anon naming NO deity, nothing for a premium
      // deity-free town). Never THEIRS' ungated pantheon-leaking section.
      case 'war_faith':  return <WarFaithTab settlement={s} saveId={saveId} publicDossier={publicDossier} />;
      // Rumors & News — the trade-carrier rumor ledger, player-scrubbed; the
      // DM-truth reveal self-gates inside (premium owner, never playerView /
      // public dossier — the includeGroundTruth convention).
      case 'rumors':     return <RumorsTab settlement={s} saveId={saveId} playerView={playerView} publicDossier={publicDossier} />;
      case 'defense':    return <DefenseTab settlement={s} narrativeNote={null} />;
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
            <BuyThisDossier settlement={settlement} saveId={saveId} />
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
              <div style={{ padding: 32, textAlign: 'center', color: swatch.mutedBrown,
                fontFamily: 'Nunito,sans-serif', fontSize: FS.md }}>Loading\u2026</div>
            }
          >
            <div ref={dossierContentRef} style={{ opacity: aiRegenerating ? 0.6 : 1, transition: 'opacity 0.2s' }}>
              {renderTab()}
            </div>
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
      <DossierAiConfirms
        pendingAiAction={pendingAiAction} onConfirmContext={confirmGuidedAiAction} onCancelContext={() => setPendingAiAction(null)}
        pendingRegenerate={pendingRegenerate} onConfirmRegenerate={confirmRegenerate} onCancelRegenerate={() => setPendingRegenerate(false)}
        regenerateBody={`This discards the current narrative prose and generates a new one${isConfigured ? `, spending ${getCost('narrative')} credits` : ''}. The raw simulation is unchanged.`}
      />
    </>
  );
}
