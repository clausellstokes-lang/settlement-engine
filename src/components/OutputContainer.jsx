import React, { useState, useRef, useEffect, useCallback, lazy, Suspense } from 'react';
import { FS, SP, swatch } from './theme.js';
import { runAiLayer } from '../generators/aiLayer';
import { useStore } from '../store/index.js';
import { isConfigured } from '../lib/supabase.js';
import FeatureErrorBoundary from './FeatureErrorBoundary.jsx';
import { flag } from '../lib/flags.js';
import { t } from '../copy/index.js';
import { Funnel, EVENTS } from '../lib/analytics.js';
import { useSectionDwell } from '../hooks/useSectionDwell.js';
import { collectPlotHooks } from '../domain/dossier/plotHooks.js';
import { buildChronicleFeed } from '../domain/dossier/chronicleFeed.js';
import { ConfirmDialog } from './primitives/Dialog.jsx';
import LifecycleSpine from './primitives/LifecycleSpine.jsx';
// Welcome-credit gift card. Self-gates on signed-in +
// first-saved + ledger-unspent state; renders nothing otherwise.
const WelcomeCreditCard = lazy(() => import('./dossier/WelcomeCreditCard.jsx'));
// Pending changes drawer (queue + cascade preview).
// Self-gates inside on flag + pending queue presence.
const PendingChangesBar = lazy(() => import('./dossier/PendingChangesBar.jsx'));
// First-dossier teaching callouts. Self-gates on
// flag + signed-in + savedCount===0; renders nothing otherwise.
const FirstDossierCallouts = lazy(() => import('./dossier/FirstDossierCallouts.jsx'));
// Phone-optimized "at the table" view. Mounted only when
// flag('tableView') && userPrefs.tableViewOpen, so the chunk loads the
// moment the user opens it and never before.
const TableView = lazy(() => import('./TableView.jsx'));
// Click-to-edit settlement name in the header.
// The pencil reveals on hover; commit queues a rename-settlement
// edit through the pending-edits drawer. The editable name now
// lives inside DossierHeaderRow, which imports EditableInline directly.
import DossierNarrativeButtons from './dossier/DossierNarrativeButtons.jsx';
import DossierHeaderRow from './dossier/DossierHeaderRow.jsx';
import DossierNarrativeBanner from './dossier/DossierNarrativeBanner.jsx';
import DossierTabStrip from './dossier/DossierTabStrip.jsx';
import DossierGroupTabStrip from './dossier/DossierGroupTabStrip.jsx';
import DossierSessionNotices from './dossier/DossierSessionNotices.jsx';
import DossierActionBand from './dossier/DossierActionBand.jsx';

// ── Lazy-loaded tabs (each loads only when first viewed) ────────────────────
// Magazine-spread Summary. The legacy single-column SummaryTab and its
// `summaryMagazineV2` flag-twin were deleted (the doctrine note in flags.js: a
// forever-on flag is inlined). SummaryTabV2 is the one Summary now.
const SummaryTabV2 = lazy(() => import('./new/SummaryTabV2.jsx'));
const PlotHooksTab = lazy(() => import('./new/tabs/PlotHooksTab.jsx'));
const ChronicleTab = lazy(() => import('./new/tabs/ChronicleTab.jsx'));
const OverviewTab = lazy(() => import('./new/tabs/OverviewTab'));
const EconomicsTab = lazy(() => import('./new/tabs/EconomicsTab'));
const ServicesTab = lazy(() => import('./new/tabs/ServicesTab'));
const PowerTab = lazy(() => import('./new/tabs/PowerTab'));
const DefenseTab = lazy(() => import('./new/tabs/DefenseTab'));
// UX overhaul Phase 2 — new Systems sub-tabs: the 16-var causal Substrate and the
// 10-facet Magic profile. Both mount the P0/P1 building blocks and self-gate /
// altitude-gate inside.
const SubstrateTab = lazy(() => import('./new/tabs/SubstrateTab.jsx'));
const MagicTab = lazy(() => import('./new/tabs/MagicTab.jsx'));
// War & Faith — re-homed into the tabbed dossier (dossier keystone §1) so a
// fresh generation meets it. Resolves the owning campaign's live worldState and
// self-gates to nothing for a peaceful, deity-free town.
const WarFaithTab = lazy(() => import('./new/tabs/WarFaithTab.jsx'));
const NPCsTab = lazy(() => import('./new/tabs/NPCsTab'));
const HistoryTab = lazy(() => import('./new/tabs/HistoryTab'));
const ResourcesTab = lazy(() => import('./new/tabs/ResourcesTab'));
const ViabilityTab = lazy(() => import('./new/tabs/ViabilityTab'));
const DailyLifeTab = lazy(() => import('./new/tabs/DailyLifeTab'));
const RelationshipsTab = lazy(() => import('./new/tabs/RelationshipsTab'));
const DMCompassTab = lazy(() => import('./new/tabs/DMCompassTab'));
const NotesTab = lazy(() => import('./new/tabs/NotesTab.jsx'));


// Thematic group tabs façade (spec §8: Summary / Systems / World /
// Notes). Each group maps to the existing sub-tabs the dossier already renders;
// this is a navigation layer, not a content change. (The `dossierFiveTabs`
// flag-twin and the flat-14-tab fallback it gated were deleted — the facade is
// now the only path.)
//
//   summary  → Overview, DM Summary, Plot Hooks, Guidance (spec §8). Plot Hooks
//              is its own sub-tab (PlotHooksTab); Guidance (DM Compass) is the
//              AI-narrated layer and only appears when narration produced it.
//   systems  → Services, Economics, Power, Defense, Resources, Viability,
//              Substrate, Magic, War & Faith (the last conditional — present
//              only when a deity snapshot or live campaign world is possible).
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
  // Systems leads with a RUNNABLE read (Services) so the first click into the
  // group lands on something immediately usable; Substrate (the 16-var causal
  // engine grid — the deepest diagnostic view) sits later as the explicit deep
  // view rather than being the group's primary landing. (P8 first-click-lands.)
  systems: { label: 'Systems', tabs: ['services', 'economics', 'power', 'defense', 'resources', 'viability', 'substrate', 'magic', 'war_faith'] },
  world:   { label: 'World',   tabs: ['relationships', 'daily_life', 'npcs', 'history', 'neighbours'] },
  notes:   { label: 'Notes',   tabs: ['dm_notes', 'ai_notes', 'chronicle'] },
});

// Sub-tab registry. The simulation pipeline lives in the SimulationDrawer
// trigger next to the dossier actions, not in this reading strip. (The
// "Substrate" → GM-facing relabel is deferred: the tab label is pinned by
// tests/ui/dossierAltitude.test.jsx, which is outside this surface's editable
// file set.)
const TABS = [
  { id: 'overview',   label: 'Overview' },
  { id: 'summary',    label: 'DM Summary' },
  { id: 'substrate',  label: 'Substrate' },
  { id: 'magic',      label: 'Magic' },
  { id: 'power',      label: 'Power' },
  { id: 'economics',  label: 'Economics' },
  { id: 'services',   label: 'Services' },
  { id: 'defense',    label: 'Defense' },
  { id: 'resources',  label: 'Resources' },
  { id: 'viability',  label: 'Viability' },
  { id: 'history',    label: 'History' },
  { id: 'daily_life', label: 'Daily Life' },
  { id: 'npcs',       label: 'NPCs' },
  { id: 'dm_notes',   label: 'DM Notes' },
  { id: 'ai_notes',   label: 'AI Notes' },
  { id: 'chronicle',  label: 'Chronicle' },
];

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

// Map a caught narrative/local-AI error to GM-facing domain language so
// transport/engine internals (fetch/RPC/parse messages) never leak to the trust
// surface; the raw message belongs in logs. (P10 plain-language / P11 no jargon.)
function toFriendlyAiError(e) {
  const raw = (e && typeof e.message === 'string' ? e.message : String(e || '')).toLowerCase();
  if (/network|fetch|timeout|connection|offline|failed to fetch/.test(raw)) {
    return "The simulator could not be reached. Check your connection and try again.";
  }
  return "The narrative layer could not be generated. Try again.";
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
  const storeRegenerate = useStore(s => s.regenSection);
  const requestNarrative = useStore(s => s.requestNarrative);
  const requestDailyLife = useStore(s => s.requestDailyLife);
  const getCost = useStore(s => s.getCost);
  const storeAiLoading = useStore(s => s.aiLoading);
  const storeAiRegenerating = useStore(s => s.aiRegenerating);
  const storeAiError = useStore(s => s.aiError);
  const storeAiProgress = useStore(s => s.aiProgress);
  const storeAiPartialFailure = useStore(s => s.aiPartialFailure);
  // Runtime canon-preservation report from the AI overlay
  // verifier. Surfaces drift (invented entity, renamed proper noun,
  // overridden user edit) to the DM via the AiOverlayViolations card.
  const storeAiViolations = useStore(s => s.aiViolations);
  const clearAiViolations = useStore(s => s.clearAiViolations);
  // Most-recent regeneration delta, populated by
  // settlementSlice.regenSection. Persists until dismissed or until
  // the next regen overwrites it.
  const storeLastRegenerationDelta = useStore(s => s.lastRegenerationDelta);
  const clearLastRegenerationDelta = useStore(s => s.clearLastRegenerationDelta);
  const storeShowNarrative = useStore(s => s.showNarrative);
  const setShowNarrative = useStore(s => s.setShowNarrative);
  // aiError is a single shared store field reused across distinct AI actions, so
  // a stale error from one action could otherwise contaminate another surface.
  // We clear it when the reading context changes (tab switch) so each surface
  // only ever shows an error it could have produced. (P10 status accuracy.)
  const setAiError = useStore(s => s.setAiError);
  // Pinned NPCs. The live save entry is the source of truth so the
  // pin icons stay in sync across tabs without an extra hydration hop.
  const liveSaveEntry = useStore(s => saveId ? s.savedSettlements.find(x => x.id === saveId) : null);
  const pinNpc = useStore(s => s.pinNpc);
  const unpinNpc = useStore(s => s.unpinNpc);
  // Inline-edit pipe. queueEdit goes into the
  // PendingChangesBar's drawer where the cascade preview lives.
  const queueEdit = useStore(s => s.queueEdit);
  // Pricing-moment modal opener — used as the recovery CTA on the
  // insufficient-credits AI error so the error states what to do next AND
  // carries the action. (P10 / checklist 15.)
  const setActivePricingMoment = useStore(s => s.setActivePricingMoment);
  // Lifecycle-stage inputs. `phase` is the top-level draft|canon enum;
  // `isSettlementClockBound` reports whether a settlement's realm is
  // clock-bound (simulation has been run). Both already exist in the store.
  const isSettlementClockBound = useStore(s => s.isSettlementClockBound);
  const phase = useStore(s => s.phase);

  const rawSettlement = propSettlement || storeSettlement;
  // AI narrative is now gated behind a saveId: the ai_data has a
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
  // Table View overlay state. The trigger lives in
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
    // Clear a stale per-action AI error so it doesn't bleed onto the next tab
    // (the field is shared across actions). Local-dev path clears its own state.
    if (id !== selectedTab) {
      if (isConfigured) setAiError?.(null);
      else setLocalAiError(null);
    }
    _setActiveTab(id);
    if (!readOnly && trackTabExplored) trackTabExplored();
  };
  const [pendingAiAction, setPendingAiAction] = useState(null);
  // Whether the first-save WelcomeCreditCard is currently showing. When it is, it
  // owns the single violet Narrate pitch in this region, so the DossierActionBand
  // collapses its redundant narrative-layer eyebrow/copy/buttons to the plain
  // owner-actions utility row — only one Narrate pitch competes for the focal
  // point at a time. (Reported up from the card via onVisibilityChange.)
  const [welcomeCardVisible, setWelcomeCardVisible] = useState(false);
  const handleWelcomeCardVisibility = useCallback((v) => setWelcomeCardVisible(!!v), []);
  // Regenerate discards the current narrative prose AND spends credits. When
  // prose actually exists we surface that consequence in a confirm before it
  // fires (the visible label only says 'Regenerate'); first generation has
  // nothing to lose, so the friction only applies when something is at risk.
  // (P9 / P10 preview-the-loss.)
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

  // After the costly narrative action resolves, move the reader to the
  // narrative-bearing surface (Guidance if present, else Summary thesis) so the
  // peak action has a visible payoff (P9). No-op if neither is in the strip.
  const landOnNarrativeSurface = () => {
    const target = ['dm_compass', 'summary'].find(id => allTabs.some(t => t.id === id));
    if (target && selectedTab !== target) setActiveTab(target, 'auto_select');
  };

  // Local-dev (Supabase unconfigured) direct aiLayer fallback, shared by the
  // narrative AND Daily Life paths so neither is ever a silent no-op control: it
  // loads, resolves into the AI overlay, and surfaces errors. `onDone` runs only
  // on success (e.g. landing the reader on the narrative surface).
  const runLocalAiLayer = async (onDone) => {
    setLocalAiLoading(true);
    setLocalAiError(null);
    setAiProgress('');
    try {
      const result = await runAiLayer(rawSettlement, msg => setAiProgress(msg));
      setAiSettlement?.(result);
      onDone?.();
    } catch (e) {
      // Map transport/engine internals to domain language; the raw message is a
      // power-user/log concern, not a GM trust surface. (P10 / P11.)
      setLocalAiError(toFriendlyAiError(e));
    } finally {
      setLocalAiLoading(false);
      setAiProgress('');
    }
  };

  const executeAiAction = async (kind) => {
    if (kind === 'dailyLife') {
      if (isConfigured) await requestDailyLife(saveId);
      else await runLocalAiLayer();
      return;
    }
    if (isConfigured) {
      await requestNarrative(saveId);
      landOnNarrativeSurface();
    } else {
      await runLocalAiLayer(landOnNarrativeSurface);
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

  const runNarrativeLayer = () => {
    // A narrative already exists → this is a destructive regenerate; confirm the
    // discard-and-spend first. Otherwise proceed straight to (possibly the
    // context-confirm gated) action. aiIsFullSettlement guards the compass-only
    // partial so a public shareDm dossier never trips the confirm.
    if (aiIsFullSettlement) {
      setPendingRegenerate(true);
      return;
    }
    requestAiAction('narrative');
  };

  const confirmRegenerate = () => {
    setPendingRegenerate(false);
    requestAiAction('narrative');
  };

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
  // least one of its four fields. Unnarrated saves don't need the tab.
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

  const baseTabs = TABS.filter(t => {
    // Substrate is a normal, always-present tab now (it owns a LOCAL Overview /
    // Detail / Engine control); it is no longer hidden behind a global toggle.
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
  // War & Faith (dossier keystone §1) is a Systems sub-tab that re-homes
  // WarFaithSection into the tabbed dossier. The SECTION self-gates to null for a
  // peaceful, deity-free, non-campaign town, so to avoid a blank tab body we gate
  // the tab PRESENCE on a cheap predicate (an embedded deity snapshot OR a saveId,
  // which means live war/faith state is at least possible), mirroring the
  // hasPlotHooks/hasDMCompass conditional-tab pattern. A peaceful, deity-free,
  // non-campaign town is byte-identical: no War & Faith tab.
  const hasWarFaith = !!(rawSettlement?.config?.primaryDeitySnapshot || saveId);
  const allTabs = [...baseTabs,
    // Plot Hooks — a Summary sub-tab (spec §8); shown only when the settlement
    // actually surfaces structural hooks.
    ...(hasPlotHooks ? [{ id:'plot_hooks', label:'Plot Hooks' }] : []),
    ...(hasWarFaith ? [{ id:'war_faith', label:'War and Faith' }] : []),
    // Guidance (DM Compass) — the AI-narrated layer; only present once narration
    // produced it, and tinted purple in the strip below.
    ...(!playerView && hasDMCompass ? [{ id:'dm_compass', label:'Guidance' }] : []),
    ...(rawSettlement?.neighborRelationship || rawSettlement?.neighbourRelationship || rawSettlement?.neighbourNetwork?.length
      ? [{ id:'neighbours', label:'Neighbours' }] : [])
  ];
  const selectedTab = allTabs.some(t => t.id === activeTab)
    ? activeTab
    : (allTabs[0]?.id || activeTab);
  const visibleGroupEntries = Object.entries(TAB_GROUPS)
    .filter(([, group]) => group.tabs.some(tid => allTabs.some(t => t.id === tid)));

  // Four thematic group tabs (Summary / Systems / World / Notes). A group
  // selector renders ABOVE the sub-tab strip; clicking a group filters the strip
  // to its sub-tabs and selects the group's primary. The `dossierFiveTabs`
  // flag-twin that used to gate the flat-14-tab fallback was deleted (the flags
  // doctrine: a forever-on flag is inlined) — the group facade is now the only path.
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
  // The displayed group is DERIVED from the active sub-tab, not just the last
  // group click. The active tab is the source of truth for which surface is
  // shown, so the master strip must reflect the group that OWNS it — otherwise a
  // programmatic tab change into another group (e.g. the post-narrative auto-land
  // jumping to Summary/Guidance via setActiveTab, which never touches the group
  // state) would leave the group strip highlighting the old group while the
  // sub-tab strip shows that group's tabs with NONE active and the content
  // column renders a tab from elsewhere — a nav that contradicts itself (P8:
  // location must always be clear; P9: the peak action lands on a coherent
  // surface). Deriving here (rather than syncing via an effect) keeps the strip
  // honest in one render with no cascading set-state. `activeGroup` is consulted
  // only as the fallback when the active tab maps to no group.
  const groupFromTab = tabToGroup[selectedTab];
  const desiredGroup = (groupFromTab && visibleGroupEntries.some(([gid]) => gid === groupFromTab))
    ? groupFromTab
    : activeGroup;
  const selectedGroup = visibleGroupEntries.some(([gid]) => gid === desiredGroup)
    ? desiredGroup
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

  // Sub-tab order follows the group's DECLARED order in TAB_GROUPS (e.g. World
  // shows NPCs before History; Systems leads with Services), not the flat TABS
  // array. Resolve each declared id to its live tab object and drop any the
  // current settlement doesn't render.
  const tabs = (TAB_GROUPS[selectedGroup]?.tabs || [])
    .map(tid => allTabs.find(t => t.id === tid))
    .filter(Boolean);

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
          <SummaryTabV2
            settlement={s}
            hideIdentity={!hideHeader}
            onOpenTableView={flag('tableView')
              ? () => useStore.getState().setUserPref?.('tableViewOpen', true)
              : undefined}
          />
        </>
      );
      case 'plot_hooks': return <PlotHooksTab settlement={s} />;
      case 'chronicle':  return <ChronicleTab entries={chronicle} />;
      case 'daily_life': return <DailyLifeTab settlement={s} aiSettlement={aiSettlement} saveId={saveId} onRequestDailyLife={() => requestAiAction('dailyLife')} />;
      case 'overview':   return <OverviewTab settlement={s} hideIdentity={!hideHeader} onNavigateTab={(id) => setActiveTab(id)} />;
      case 'economics':  return <EconomicsTab settlement={s} narrativeNote={null} />;
      case 'services':   return <ServicesTab services={s.availableServices} settlement={s} narrativeNote={null} />;
      case 'power':      return <PowerTab powerStructure={s.powerStructure} settlement={s} narrativeNote={null} />;
      case 'defense':    return <DefenseTab settlement={s} narrativeNote={null} saveId={saveId} />;
      case 'substrate':  return <SubstrateTab settlement={s} saveId={saveId} />;
      case 'magic':      return <MagicTab settlement={s} />;
      case 'war_faith':  return <WarFaithTab settlement={s} saveId={saveId || s?.id} />;
      case 'npcs':       return <NPCsTab npcs={s.npcs} settlement={s} onRerollNPCs={onRegenerate ? () => onRegenerate('npcs') : null} narrativeNote={null} pinnedIds={pinnedIds} onTogglePin={onTogglePin} />;
      case 'history':    return <HistoryTab settlement={s} narrativeNote={null} recentEvents={recentEvents} onReroll={onRegenerate ? () => onRegenerate('history') : null} />;
      case 'resources':  return <ResourcesTab settlement={s} narrativeNote={null} />;
      case 'viability':  return <ViabilityTab settlement={s} narrativeNote={null} />;
      case 'dm_compass': return <DMCompassTab settlement={compassSource || s} />;
      case 'dm_notes':   return <NotesTab saveId={saveId} notes={dossierNotes} section="dm" />;
      case 'ai_notes':   return <NotesTab saveId={saveId} notes={dossierNotes} section="ai" />;
      case 'neighbours':    return <RelationshipsTab settlement={s} narrativeNote={null} neighboursOnly={true} />;
      case 'relationships': return <RelationshipsTab settlement={s} narrativeNote={null} />;
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
      displayProgress={displayProgress}
      storeShowNarrative={storeShowNarrative}
      setShowNarrative={setShowNarrative}
      runNarrativeLayer={runNarrativeLayer}
    />
  );

  // The insufficient-credits AI error gets a recovery CTA (open the pricing
  // moment); the save-first message already names its own action in copy. (P10.)
  // The moment reuses the existing welcome_credit moment copy (owned by the copy
  // layer) rather than authoring new prose here. (DossierSessionNotices owns the
  // empty-band gating so the cluster never paints when no notice is present.)
  const aiErrorIsCredits = !!aiError && /credit/i.test(String(aiError));
  const openCreditsMoment = () => {
    setActivePricingMoment?.({
      headline: t('pricing.moments.welcome_credit.headline'),
      body: t('pricing.moments.welcome_credit.body'),
      reason: 'welcome_credit',
    });
  };

  // Lifecycle spine stage — pure derivation from selectors already in scope, no
  // new store fields or state machine. saveId present means the dossier is saved;
  // phase 'canon' means it was canonized; a clock-bound realm means simulation
  // ran; is_public means it was published to the gallery. We surface the
  // FURTHEST-reached stage. All four predicates null-guard so none can throw.
  const saved = !!saveId;
  const canon = phase === 'canon';
  const simulated = !!(saveId && typeof isSettlementClockBound === 'function' && isSettlementClockBound(saveId));
  const shared = !!liveSaveEntry?.is_public;
  const lifecycleStage = shared ? 'shared' : simulated ? 'simulated' : canon ? 'canon' : saved ? 'saved' : 'draft';

  // Deferred null check (see comment near the top of this component).
  // All hooks are now committed; safe to early-exit.
  if (earlyExitOnNoSettlement) return null;

  return (
    <>
      {/* The "How this was simulated" metadata lives behind the SimulationDrawer
          trigger in the action band below, not as a top-of-page rail — so the
          dossier card itself is the default landing surface and the simulation
          detail is one tap away rather than always-on chrome above the fold. */}
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
            allowRename={allowRename}
            onRenameSettlement={onRenameSettlement}
            narrativeButtons={(!flag('narrativeLayerStrip') || readOnly) && renderNarrativeButtons()}
          />
        )}
        {/* Lifecycle spine — a thin parchment band under the identity header that
            shows how far this dossier has travelled (draft to shared). Rendered
            read-only (no onStep): no in-card handler maps cleanly across the
            Library/Realm/Gallery routes. It sits on parchment, not the dark
            header, because LifecycleSpine uses light tokens. It carries NO bottom
            divider: it shares one continuous parchment field with the action band
            below, so the two group via spacing instead of laddering two bordered
            bands before the reader reaches the hero. Gated to owner surfaces where
            the header renders and the stage is derivable. */}
        {!playerView && !hideHeader && (
          <div style={{ padding: `${SP.sm}px ${SP.lg}px 0`, background: 'rgba(250,248,244,0.97)', overflowX: 'auto' }}>
            <LifecycleSpine stage={lifecycleStage} />
          </div>
        )}
        {/* Single chrome band below the header — see DossierActionBand. Skipped
            in readOnly (public viewer), where the narrative toggle lives in the
            header instead. */}
        {!readOnly && (
          <DossierActionBand
            narrativeEnabled={narrativeEnabled}
            suppressNarrativePitch={welcomeCardVisible}
            narrativeButtons={renderNarrativeButtons()}
            settlement={settlement}
            saveId={saveId}
            liveSaveEntry={liveSaveEntry}
          />
        )}
        {/* Welcome credit gift card. Self-gates inside; shown to
            signed-in users on their first saved dossier when their ledger
            still has an available welcome grant. */}
        {!readOnly && (
          <Suspense fallback={null}>
            <WelcomeCreditCard saveId={saveId} onVisibilityChange={handleWelcomeCardVisibility} />
          </Suspense>
        )}
        {/* Pending changes bar + cascade preview. Self-gates
            inside; renders nothing when no edits are queued. */}
        {!readOnly && (
          <Suspense fallback={null}>
            <PendingChangesBar />
          </Suspense>
        )}
        {/* First-dossier teaching callouts now render INSIDE the
            Summary tab (the DM summary), not as a banner above every tab — see
            renderTab's 'summary' case. */}
        {/* Thematic group tab strip (Summary / Systems / World /
            Notes). Clicking a group selects its first sub-tab and filters the
            strip below. Always rendered (the dossierFiveTabs flag-twin and its
            flat-14-tab fallback were deleted; the facade is the only path). */}
        <DossierGroupTabStrip
          visibleGroupEntries={visibleGroupEntries}
          selectedGroup={selectedGroup}
          handleGroupClick={handleGroupClick}
        />
        {/* The global "Detail" altitude row was removed: it spent a full-width
            bordered band on a control whose only structural job was to show/hide
            ONE tab (Substrate). Substrate now renders unconditionally and owns a
            LOCAL depth control; the engine sections render at a sensible default
            depth (see DEFAULT_DETAIL_LEVEL). */}
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
          {/* Session-level notices cluster — see DossierSessionNotices; it
              self-gates to nothing when no notice is present so it never paints an
              empty band above the hero content. */}
          <DossierSessionNotices
            showNarrative={showNarrative}
            aiError={aiError}
            aiErrorIsCredits={aiErrorIsCredits}
            openCreditsMoment={openCreditsMoment}
            partialFailure={storeAiPartialFailure}
            violations={storeAiViolations}
            onDismissViolations={clearAiViolations}
            regenDelta={storeLastRegenerationDelta}
            onDismissRegenDelta={clearLastRegenerationDelta}
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
              // Lightweight skeleton matching a tab's rough shape (a heading bar
              // + a few content bars) so a slow first-paint of a heavy lazy tab
              // reads as structured content arriving, not a stall. (P10 / cl.12.)
              <div aria-busy="true" aria-label="Loading section" style={{ padding: SP.lg, display: 'flex', flexDirection: 'column', gap: SP.sm }}>
                <div style={{ height: 18, width: '40%', borderRadius: 4, background: swatch['#E8DCC8'] }} />
                <div style={{ height: 10, width: '90%', borderRadius: 4, background: swatch['#EDE3CC'] }} />
                <div style={{ height: 10, width: '75%', borderRadius: 4, background: swatch['#EDE3CC'] }} />
                <div style={{ height: 10, width: '82%', borderRadius: 4, background: swatch['#EDE3CC'] }} />
              </div>
            }
          >
            {/* Resilience: the active tab renders live, malformed-by-construction
                simulation data (forks, imports, regen drift). A throw in any one
                tab must degrade to a recoverable fallback INSIDE the dossier card
                \u2014 not propagate to the root boundary and blank the whole app. The
                resetKey is the selected tab so switching tabs auto-recovers. */}
            <FeatureErrorBoundary label="OutputContainer.tab" kind="react.render.dossier" fallbackTitle="This section of the dossier could not be displayed." resetKeys={[selectedTab, readSessionSubject]}>
              {/* Completes the WAI-ARIA tabs relationship the strip begins: each
                  tab carries aria-controls={'sf-panel-' + id}; this panel answers
                  with the matching id + aria-labelledby, and tabIndex={0} lets a
                  keyboard user enter and scroll the panel content. */}
              <div
                ref={dossierContentRef}
                role="tabpanel"
                id={'sf-panel-' + selectedTab}
                aria-labelledby={'sf-tab-' + selectedTab}
                // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- WAI-ARIA tabs pattern: a tabpanel is an intentional focus stop so keyboard users can reach and scroll the panel after the tablist; tabIndex=0 is the spec-mandated affordance here
                tabIndex={0}
                // The content column owns ONE horizontal frame inset (SP.lg,
                // matching the banner cluster's margin) so every tab body shares
                // the same edge and content never crowds the textured card edge.
                // Previously two of three bodies rendered flush; each child was
                // insetting (or not) on its own. (P12 width discipline.)
                style={{ padding: `0 ${SP.lg}px ${SP.lg}px`, opacity: aiRegenerating ? 0.6 : 1, transition: 'opacity 0.2s' }}
              >{renderTab()}</div>
            </FeatureErrorBoundary>
          </Suspense>
          <style>{'@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }'}</style>
        </div>
      </div>
      {/* Table View overlay. Rendered as a sibling of the dossier
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
      {/* Regenerate discard-and-spend confirm — only shown when prose exists,
          so the consequence is previewed before it fires rather than buried in
          the button's title. (P9 / P10.) */}
      <ConfirmDialog
        open={pendingRegenerate}
        tone="warning"
        title="Regenerate the Narrative Layer?"
        body={`This discards the current narrative prose and generates a new one${isConfigured ? `, spending ${getCost('narrative')} credits` : ''}. The raw simulation is unchanged.`}
        confirmLabel="Regenerate"
        cancelLabel="Keep current"
        onConfirm={confirmRegenerate}
        onCancel={() => setPendingRegenerate(false)}
      />
    </>
  );
}
