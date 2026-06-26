import { useState, useEffect, lazy, Suspense } from 'react';
import {ChevronLeft, X, FileText, RotateCcw, Edit3, Lock, Share2} from 'lucide-react';
import ShareToGallery from './ShareToGallery.jsx';
import FeatureErrorBoundary from './FeatureErrorBoundary.jsx';
import Button from './primitives/Button.jsx';
import IconButton from './primitives/IconButton.jsx';
// The settlement-name rename, relocated from the dossier header to the
// always-visible persistent header card (it must stay reachable in edit mode,
// where the read dossier is no longer mounted). Reuses the SAME primitive +
// analytics event the dossier header used, so commit semantics are identical.
import EditableInline from './primitives/EditableInline.jsx';
import { EVENTS } from '../lib/analytics.js';
// Settlement PDF export drags in @react-pdf/renderer (~1MB) plus all PDF
// section components. Import lazily on user click so opening a settlement
// detail view doesn't pay for export machinery up front.
const generateSettlementPDF = (...args) =>
  import('../utils/generateSettlementPDF.js').then(m => m.generateSettlementPDF(...args));
import { validateDossier } from '../domain/validation/consistency.js';
import { useStore } from '../store/index.js';
import useIsMobile from '../hooks/useIsMobile.js';
const OutputContainer = lazy(() => import('./OutputContainer'));
import ChroniclePanel from './ChroniclePanel.jsx';
// Campaign-state engine UI — phase, locks, system state, events,
// timeline, coherence checks. Each is hidden when not relevant
// (Timeline only shows in canon, CoherencePanel only in draft).
import PhaseBadge       from './settlement/PhaseBadge.jsx';
// UX overhaul Phase 6 — the editor Workshop. Replaces the binary editMode
// long-scroll with a right-rail of READ-then-WRITE collapsible cards
// (the engine read surfaces are the free→premium teaser; write is premium).
import Workshop         from './settlement/Workshop.jsx';
// The persistent "what should I do next?" rail (the audit's highest-leverage
// win). Reused as-is — phase-aware ladder, no new state machine, no new
// analytics — mounted as a sticky right column on this owner saved view.
import NextActionRail   from './settlement/NextActionRail.jsx';
import AIInlineCard     from './settlement/AIInlineCard.jsx';
import ExportSheet      from './settlement/ExportSheet.jsx';
// Modal that fires after pillar-tier KILL_NPC commits. Reads
// pendingSuccession off the slice, shows ranked successors, and
// pre-fills the EventComposer with ASSIGN_NPC_TO_ROLE on selection.
import SuccessorPrompt  from './settlement/SuccessorPrompt.jsx';
// Fires after a change-queue commit on a NARRATED save: the prose was written
// against the pre-commit state, so the modal offers regenerate / continue-raw.
// Moved here from EventComposer (apply no longer commits; the commit is the
// queue flush), so the notice fires once per commit, not per staged event.
import StaleNarrativeModal from './StaleNarrativeModal.jsx';
import RegionalImpactInbox from './region/RegionalImpactInbox.jsx';
import { triggerPricingMoment } from '../lib/pricingMoments.js';
// The Narrated/Raw chip below uses the StateBadge primitive rather than
// an inline ad-hoc <span>,
// which centralizes the visual styling and the role="status" a11y
// announcement under one shared component.
import StateBadge        from './primitives/StateBadge.jsx';
import { ConfirmDialog } from './primitives/Dialog.jsx';
import NetworkEffectsPanel from './settlementDetail/SettlementDetailNetworkEffectsPanel.jsx';
import LinkNeighbourCard from './settlementDetail/SettlementDetailLinkNeighbourCard.jsx';
import SettlementDetailEditNames from './settlementDetail/SettlementDetailEditNames.jsx';
// Next-action rail wiring + the shared canonize confirm/commit, extracted to keep
// SettlementDetail under the component-size ratchet (behavior-preserving).
import { useNextActionRailHandlers } from './settlementDetail/useNextActionRailHandlers.js';
// Read-only network-effect echo: the SAME modifier selector + effect taxonomy
// the (edit-only) NetworkEffectsPanel uses, so the View's one-line echo can never
// disagree with the full panel's headline fact.
import { getSettlementModifiers, EFFECT_CATEGORIES, fmtMod, REL_LABELS } from '../lib/relationshipGraph.js';
import { directionalRelationshipLabel } from '../domain/relationships/canonicalRelationship.js';
import { INK, MUTED, BODY, SECOND, BORDER, CARD, sans, serif_, FS, swatch, PAGE_MAX, CHROME } from './theme';
// Shared relationship palette — the SAME source the library card and the campaign
// PDF consume, so a named relationship looks identical across every surface
// (was previously a divergent local REL_COLORS copy — the cardinal-sin coherence
// break the audit flagged).
import { REL_HEX } from './settlements/relationshipColors.js';

// The dossier-render error boundary used to be a bespoke `DetailErrorBoundary`
// here (console.error only, no telemetry, no auto-recovery). It now delegates to
// the shared FeatureErrorBoundary — the same seam used by OutputContainer.tab,
// WorldMap.stage and GalleryPage.detail — which does console.error AND
// reportError telemetry plus guarded resetKeys recovery, so a swallowed dossier
// throw is reported, not silently hidden. The inline danger-text fallback below
// preserves the original UX verbatim.

// NOTE: a block of local duplicate logic (`_migrateConfig`,
// `_buildInterSettlementNPCs` + its `NPC_PAIR_CATS`/`CONTACT_DESC` tables, and
// `_findSaveByName`/`_findSaveById`) was deleted here. It was dead — shadowed by
// the canonical versions that actually run: NPC pairing lives in
// `src/domain/relationships/neighbourBackLink.js` (used by SettlementsPanel),
// config migration + save lookup in `src/components/settlements/helpers.js`.
// The local copies had diverged and only served to mislead.

export default function SettlementDetail({
  detail, setDetail,
  saves,
  linking, setLinking,
  editNamesOpen, setEditNamesOpen,
  // applyRename is the IMMEDIATE rename cascade. For a STANDALONE settlement the
  // rename STAGES on the change-queue (replayed at commit by the executor
  // SettlementsPanel registers); for a CLOCK-BOUND campaign member the queue is
  // inactive (Phase 4a scope), so the rename applies immediately through this
  // prop, preserving the pre-queue behaviour.
  handleLink, removeNeighbour, applyRename,
}) {
  const network=detail.settlement.neighbourNetwork||[];
  // Mobile is a read-and-light-act surface. The header keeps Export (the
  // at-the-table read action) primary; Share to Gallery (a publish/authoring
  // action) is deferred to desktop so the three peer buttons don't stack tall on
  // narrow. The Edit toggle stays — it is the gate that opens inline rename, the
  // one heavier write the matrix keeps on mobile. Desktop is unchanged.
  const isMobile = useIsMobile();

  // Read-only echo of the strongest network-effect signal — the genuinely
  // change-focused, anomaly-first fact the cascade produces. The full editable
  // NetworkEffectsPanel stays gated to edit mode (pinned by chronicleEditGate),
  // but the View must not hide the loudest causal signal, so we surface the
  // single dominant category here as one quiet de-emphasized line, mirroring the
  // panel's own hasDominant gate (only when a link actually moves a meter).
  const networkEcho=(()=>{
    const id=detail?.saveData?.id;
    if(!id||!Array.isArray(saves)||!saves.length) return null;
    let mods;
    try{ mods=getSettlementModifiers(id,saves); }catch{ return null; }
    if(!mods?.sources?.length) return null;
    const dom=EFFECT_CATEGORIES.reduce((best,c)=>
      Math.abs(mods.totals[c.key])>Math.abs(mods.totals[best.key])?c:best
    ,EFFECT_CATEGORIES[0]);
    const val=mods.totals[dom.key];
    if(Math.abs(val)<0.005) return null;
    const top=mods.sources[0];
    return {label:dom.label,val,delta:fmtMod(val),isPos:val>=0,via:top?.settlementName||null,count:mods.sources.length};
  })();
  const [editingName, setEditingName] = useState(null);  // {type,id,oldName}
  const [editDraft,   setEditDraft]   = useState('');
  const [exporting,   setExporting]   = useState(false); // PDF export spinner
  const [exportSheetOpen, setExportSheetOpen] = useState(false); // variant picker modal
  const [shareOpen, setShareOpen] = useState(false); // Share to Gallery panel, toggled from the header button
  const [confirmRevertRaw, setConfirmRevertRaw] = useState(false);
  // Shared canonize-confirm gate — BOTH PhaseBadge and the rail route through this
  // one dialog + commit, so neither fires the persisted transition unconfirmed or
  // skips the pricing moment (BLOCKER #3). The commit is confirmCanonize() below.
  const [confirmCanonizeOpen, setConfirmCanonizeOpen] = useState(false);
  // Holds the index of the neighbour link pending removal-confirmation, or null.
  // Removing a link is a consequential cross-settlement write (it also clears the
  // paired NPC contacts + network effects on BOTH settlements and persists
  // immediately), so it is gated behind the same ConfirmDialog as Revert-to-Raw
  // rather than firing on a single unguarded click (P10).
  const [confirmRemoveNeighbour, setConfirmRemoveNeighbour] = useState(null);
  const [pdfError, setPdfError] = useState(null);
  // Change-queue soft-refresh: bumped on every successful commit and appended to
  // the dossier's resetKeys + the OutputContainer key, so the re-derived
  // committed state re-renders cleanly WITHOUT a reload (which would lose the
  // open settlement — the detail view is React state, not persisted store).
  const [dossierRefreshKey, setDossierRefreshKey] = useState(0);
  // Post-commit staleness notice (narrated saves only): null | { label }.
  const [staleNotice, setStaleNotice] = useState(null);

  // Pull the saved settlement's persisted ai_data into the aiSlice
  // when this detail view opens (or when switching between saves). Without
  // this, the OutputContainer's narrative chrome would show "Generate"
  // for a save that already has a narrative on disk.
  const saveId = detail?.saveData?.id || null;
  const hydrateAiFromSave = useStore(s => s.hydrateAiFromSave);
  const revertCurrentToRaw = useStore(s => s.revertCurrentToRaw);
  const clearAiSettlement = useStore(s => s.clearAiSettlement);
  const aiSettlement = useStore(s => s.aiSettlement);
  const aiDailyLife  = useStore(s => s.aiDailyLife);
  const narrated = !!(aiSettlement || aiDailyLife);

  // Campaign-clock identity lock: NPC + faction names freeze once the settlement
  // is canonized. The store hydrates `phase` from the opened save, so the live
  // store value tracks this detail view. NPC/faction renames are a draft-only
  // affordance; the settlement's OWN name stays renameable in every phase.
  const phase = useStore(s => s.phase);
  const isCanonLocked = phase === 'canon';
  // The settlement's OWN name is never canon-locked (only NPC/faction names
  // freeze). Post-canon a rename still applies, but it is recorded as a flavor
  // timeline entry since canon state is recorded — this store action owns that
  // record; the parent applyRename owns the name + neighbour/ai_data cascade.
  // Change-queue staging for renames (apply now stages; commit replays the
  // settlement-name canon record + cross-save cascade through the flush).
  const queueChange = useStore(s => s.queueChange);
  // Next-action-rail inputs (reuse existing selectors; no new store fields).
  const canonize = useStore(s => s.canonize);
  const isSettlementClockBound = useStore(s => s.isSettlementClockBound);
  // Whether this settlement's realm is clock-bound (already in the Realm). Drives
  // the rail's gold "Send it to the Realm" vs "Open the Realm" rung.
  const simulated = !!(saveId && typeof isSettlementClockBound === 'function' && isSettlementClockBound(saveId));

  // Premium-gated manual editing. The edit toggle lives on
  // the store so per-tab EditableText components can read it without
  // prop threading. Non-premium users see a greyed-out button that
  // opens the pricing modal on click.
  const editMode             = useStore(s => s.editMode);
  const toggleEditMode       = useStore(s => s.toggleEditMode);
  const isSettlementEdited   = useStore(s => s.isSettlementEdited);
  const countSettlementEdits = useStore(s => s.countSettlementEdits);
  const authTier             = useStore(s => s.auth?.tier);
  const isElevated           = useStore(s => typeof s.isElevated === 'function' ? s.isElevated() : false);
  const setPurchaseModalOpen = useStore(s => s.setPurchaseModalOpen);
  const canEdit              = authTier === 'premium' || authTier === 'founder' || isElevated;
  const editedCount          = isSettlementEdited && isSettlementEdited() ? countSettlementEdits() : 0;

  // Chronicle, pulled from the live savedSettlements entry so the
  // list updates after each generate / revert without remounting the view.
  const liveSaveEntry = useStore(s => saveId ? s.savedSettlements.find(x => x.id === saveId) : null);
  const chronicleEntries = liveSaveEntry?.aiData?.chronicle;

  useEffect(() => {
    if (detail?.saveData) {
      hydrateAiFromSave(detail.saveData);
      // Audit fix: hydrate the lifecycle slots (phase, eventLog,
      // systemState, locks, provenance timestamps) from this save's
      // campaignState. Without this, opening Stoneford after working
      // on Mossbridge silently shows Mossbridge's canon state on
      // Stoneford's detail view.
      const live = useStore.getState();
      if (typeof live.hydrateFromSave === 'function') {
        live.hydrateFromSave(detail.saveData);
      }
    }
    // Reset any in-progress inline rename when the open save changes, so a
    // draft begun on save A can't bleed into save B's freshly-opened rename
    // input (the same cross-save leak the lifecycle hydration above guards).
    // This is a deliberate reset-on-key-change keyed on [saveId], not a
    // render-cascade, hence the targeted disable (matches the existing
    // exhaustive-deps disable on this effect).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEditingName(null);
    setEditDraft('');
    // View opens read-only: the dossier shows, and the header "Edit Dossier"
    // button toggles edit mode. Reset here so a prior edit session's global
    // editMode flag doesn't carry into a freshly opened settlement.
    useStore.getState().setEditMode?.(false);
    // Clear AI state when leaving the detail view so it doesn't leak into
    // the Generate wizard or the next save that gets opened.
    return () => { clearAiSettlement(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveId]);

  const handleRevertToRaw = async () => {
    if (!saveId) return;
    setConfirmRevertRaw(true);
  };

  const confirmRevertToRaw = async () => {
    if (!saveId) return;
    setConfirmRevertRaw(false);
    await revertCurrentToRaw(saveId);
  };

  // Wrapper: STAGE the rename on the change-queue (it commits at "Save N
  // changes", not on this click), then clear local edit state. The rename's
  // existing cascade is replayed at flush time through the executor registered
  // in SettlementsPanel — WHAT it does is unchanged, only WHEN.
  const handleApplyRename = (type, id, oldName, newName) => {
    // NPC + faction names freeze at canonization — guard at enqueue time even
    // though the affordance is hidden (the flush re-checks too, defense in
    // depth). The settlement's OWN name is exempt: always renameable, and
    // post-canon the change records a flavor entry when the queue commits.
    if (isCanonLocked && (type === 'npc' || type === 'faction')) return;
    const trimmed = String(newName || '').trim();
    if (!trimmed || trimmed === oldName) { setEditingName(null); setEditDraft(''); return; }
    if (saveId) {
      // Clock-bound campaign member (Phase 4a scope): the change-queue is
      // inactive, so the rename applies immediately through the parent cascade.
      if (simulated) {
        applyRename?.(type, id, oldName, trimmed);
      } else {
        const label = type === 'settlement'
          ? `Rename settlement to ${trimmed}`
          : `Rename ${oldName || 'this'} to ${trimmed}`;
        queueChange(saveId, {
          type: 'rename',
          humanLabel: label,
          payload: { renameType: type, targetId: id, oldName, newName: trimmed },
        });
      }
    }
    setEditingName(null);
    setEditDraft('');
  };

  // Soft-refresh after a change-queue commit. The flush already mutated the
  // store (settlement / eventLog / systemState) and persisted atomically; here
  // we re-derive the React `detail` from that committed settlement and bump the
  // dossier key so every derived selector re-runs against fresh state. NO reload
  // — the open settlement is preserved (R5: detail.settlement is kept in lockstep
  // with the store settlement the Workshop read surfaces consume).
  const handleQueueCommitted = (committedSettlement) => {
    const live = useStore.getState();
    const nextSettlement = committedSettlement || live.settlement;
    if (nextSettlement) {
      setDetail(d => {
        if (!d) return d;
        const nextSaveData = {
          ...(d.saveData || {}),
          settlement: nextSettlement,
          campaignState: {
            ...(d.saveData?.campaignState || {}),
            phase: live.phase,
            eventLog: Array.isArray(live.eventLog) ? [...live.eventLog] : [],
            systemState: live.systemState || d.saveData?.campaignState?.systemState,
            editedAt: live.editedAt || d.saveData?.campaignState?.editedAt,
          },
          timestamp: live.editedAt || d.saveData?.timestamp,
        };
        return { ...d, settlement: nextSettlement, saveData: nextSaveData };
      });
    }
    // Key-bump forces a clean dossier remount against the committed state.
    setDossierRefreshKey(k => k + 1);
    // Narrated saves: the prose is now stale relative to the committed change.
    if (narrated) setStaleNotice({ label: 'your committed changes' });
  };

  const handleRegionalImpactApplied = (result) => {
    if (!result?.settlement) return;
    setDetail(d => {
      if (!d) return d;
      const nextSaveData = {
        ...(d.saveData || {}),
        settlement: result.settlement,
        campaignState: result.campaignState || d.saveData?.campaignState,
        timestamp: result.timestamp || d.saveData?.timestamp,
      };
      return {
        ...d,
        settlement: result.settlement,
        campaignState: result.campaignState || d.campaignState,
        timestamp: result.timestamp || d.timestamp,
        saveData: nextSaveData,
      };
    });
  };

  const handlePdfExport = async (variant, useAi = narrated) => {
    if (exporting) return;
    setPdfError(null);
    setExporting(true);
    // Trust gate (feature doc §1b): log cross-surface contradictions for
    // debugging. Export is the user's own private doc, so we surface — never
    // block — on issues (publishing to the public gallery is the hard gate).
    try {
      const { blocking } = validateDossier(detail.settlement);
      if (blocking.length > 0) {
        console.warn(`[dossier consistency] exporting with ${blocking.length} unresolved issue(s):`,
          blocking.map(b => b.description));
      }
    } catch { /* a validator fault must never break export */ }
    try {
      const liveStore = useStore.getState();
      // UX Phase 7 — resolve the owning campaign worldState the SAME way the
      // screen's Faith & War block does (useSettlementLiveWorld), and pass it as
      // `campaign` so the PDF can render the live war/faith chapter.
      //
      // PREMIUM DATA GATE: only premium/founder/elevated exporters get the live
      // world threaded. A free/anon export passes `campaign: null` ⇒ no
      // worldState reaches buildViewModel ⇒ the liveWorld slice is null ⇒ the
      // base (byte-identical) PDF renders. The gate lives here at the data layer.
      const owningCampaign = (canEdit && saveId)
        ? (liveStore.campaigns || []).find(
            c => (c.settlementIds || []).map(String).includes(String(saveId)),
          ) || null
        : null;
      const campaignArg = owningCampaign
        ? {
            settlementId: saveId,
            worldState: owningCampaign.worldState || null,
            regionalGraph: owningCampaign.regionalGraph || owningCampaign.worldState?.regionalGraph || null,
            settlements: (liveStore.savedSettlements || []).filter(
              sv => (owningCampaign.settlementIds || []).map(String).includes(String(sv?.id)),
            ),
            nameFor: (/** @type {any} */ id) => {
              const hit = (liveStore.savedSettlements || []).find(sv => String(sv?.id) === String(id));
              return hit?.name || hit?.settlement?.name || String(id);
            },
          }
        : null;
      await generateSettlementPDF(detail.settlement, {
        aiSettlement, aiDailyLife, narrativeMode: useAi,
        systemState: liveStore.systemState,
        eventLog: liveStore.eventLog,
        phase: liveStore.phase,
        campaign: campaignArg,
        variant,
        isFounder: liveStore.isFounder?.() ?? false,
      });
      liveStore.markExported?.();
      if (liveStore.phase === 'canon' && variant !== 'draft_brief') {
        triggerPricingMoment('first_canon_export', () => {
          liveStore.setPurchaseModalOpen?.(true);
        }, { tier: liveStore.auth?.tier });
      }
      setExportSheetOpen(false);
    } catch (err) {
      console.error('[PDF export] failed:', err);
      const msg = err?.message || String(err) || 'unknown error';
      // Keep the sheet OPEN on failure and surface the error + retry INSIDE it
      // (threaded as `error` below), so status and recovery sit co-located with
      // the action the GM just pressed instead of stranding a page-body banner
      // behind a closed overlay (P10 status/recovery).
      setPdfError(`PDF export failed: ${msg}`);
    } finally {
      setExporting(false);
    }
  };

  // Next-action rail wiring + the shared canonize confirm/commit live in the
  // co-located hook (extracted to keep this surface under the size ratchet). The
  // rail is an aggregation surface; the hook routes canonize through the shared
  // gate (BLOCKER #3) and the event/AI rungs through enter-edit + scroll-focus
  // (MAJOR #8).
  const { railHandlers, requestCanonize, confirmCanonize } = useNextActionRailHandlers({
    saveId, phase, canEdit, editMode, narrated,
    toggleEditMode, canonize, setConfirmCanonizeOpen,
    openExportSheet: () => { setPdfError(null); setExportSheetOpen(true); },
  });

  // ── Read / edit surface blocks ─────────────────────────────────────────────
  //   The four blocks below are bound as plain element references (their JSX is
  //   unchanged) so the render branch can place ONE surface per mode WITHOUT a
  //   flex wrapper or CSS `order`: each block keeps its own DOM/flex/sticky/
  //   margin context intact, so the dossier hero's sticky NextActionRail, its
  //   mobile reflow, and the FeatureErrorBoundary/Suspense move as one untouched
  //   unit.
  //
  //   READ (edit OFF): dossier hero ONLY (plus the free-user Workshop teaser —
  //     a free user can't enter edit, so it stays reachable for them).
  //   EDIT (edit ON):  edit chrome → Workshop → edit body, on a cream backdrop;
  //     the read dossier is NOT mounted here.
  //
  //   The two unrelated bands above (networkEcho, Share-to-Gallery) and the
  //   modal/sheet overlays below (ExportSheet, ConfirmDialogs) are NOT part of
  //   this region and stay put. The Workshop is referenced exactly once per
  //   branch, so it is never double-mounted.

  /**
   * Dossier hero (P1 content-is-hero) — the runnable dossier on the left and the
   * phase-aware NextActionRail sticky aside on the right; reflows to a single
   * column on narrow (flexWrap). Guarded on `detail.settlement` so a null
   * settlement renders nothing.
   * @type {import('react').ReactNode}
   */
  // The read-only dossier panel, extracted from dossierHero so it mounts in read
  // mode (beside the NextActionRail aside) AND beneath the editor in edit mode.
  // Same readOnly + key in both; one branch renders at a time (no double-mount).
  const dossierReadPanel = detail.settlement && (
    <div style={{flex:'1 1 520px',minWidth:0}}>
      <FeatureErrorBoundary
        label="SettlementDetail.output"
        kind="react.render.dossier"
        resetKeys={[saveId, dossierRefreshKey]}
        fallback={<div style={{padding:12,color:swatch.danger,fontSize:FS.sm}}>Error loading settlement output.</div>}
      >
        <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: MUTED }}>Loading...</div>}>
          {/* The dossier inherits the one top-level PAGE_MAX frame; no per-section
              cap. The settlement-name rename lives in the persistent header card's
              <h1> (the single consolidated control), so the read dossier mounted
              here — in read mode AND beneath the editor — stays plain text
              (allowRename omitted ⇒ DossierHeaderRow's nameEditable falls to false),
              never a second rename input. */}
          <OutputContainer
            // Key-bump on commit forces a clean remount so all derived
            // selectors re-run against the soft-refreshed committed state.
            key={`dossier-${saveId}-${dossierRefreshKey}`}
            settlement={detail.settlement}
            readOnly
            saveId={saveId}
          />
        </Suspense>
      </FeatureErrorBoundary>
    </div>
  );

  const dossierHero = detail.settlement&&<div style={{display:'flex',gap:16,flexWrap:'wrap',alignItems:'flex-start',marginBottom:24}}>
    {dossierReadPanel}
    {saveId && (
      <aside style={{flex:'0 1 248px',minWidth:0,position:'sticky',top:isMobile?CHROME.headerMobile+CHROME.stickyTop:CHROME.stickyTop,alignSelf:'flex-start'}}>
        <NextActionRail
          settlement={detail.settlement}
          save={detail.saveData || detail}
          simulated={simulated}
          handlers={railHandlers}
        />
      </aside>
    )}
  </div>;

  /**
   * Edit-mode chrome — the AI-polish card plus the subordinate Revert-to-Raw
   * control. Only renders in edit mode.
   * @type {import('react').ReactNode}
   */
  const editChrome = editMode && (
    <div style={{marginBottom:24,display:'flex',flexDirection:'column',gap:8}}>
      {/* AI explainer — edit-only. A plain pointer to the single paid
          "Generate Narrative" action in the dossier header
          (DossierNarrativeButtons); it no longer renders its own paid button,
          so the run-narrative path is unambiguous (one CTA, not two). The
          paid invocation + first_ai_use pricing moment live on that header
          action. */}
      <AIInlineCard settlement={detail.settlement} />
      {/* Revert to Raw — a semi-destructive narrative reset, grouped with and
          subordinate to the polish action it undoes (kept at the quiet ai
          emphasis, never a peer of the polish primary). */}
      {narrated && (
        <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
          <Button
            variant="ai"
            size="sm"
            icon={<RotateCcw size={12}/>}
            onClick={handleRevertToRaw}
            title="Clear the narrative refinement and daily-life prose on this save, returning it to the raw simulator output. Chronicle history is preserved."
          >
            Revert to Raw
          </Button>
          <span style={{fontSize:FS.xxs,color:SECOND,lineHeight:1.4,flex:1}}>
            Clears the narrative layer and returns this save to raw simulator output. Chronicle history is preserved.
          </span>
        </div>
      )}
    </div>
  );

  /**
   * The Workshop — the two-card edit surface, mounted at all times so a free
   * user sees the engine read surfaces (Card 1 reads; Card 2 is the free→premium
   * teaser; both become editable in edit mode). `changeExtras` (the
   * Link-neighbour / Edit-names affordances, which own this component's state)
   * are passed only in edit mode. Referenced once per render branch so it is
   * never double-mounted.
   * @type {import('react').ReactNode}
   */
  const workshop = (
    <Workshop
      settlement={detail.settlement}
      saveId={detail?.saveData?.id || detail?.id}
      save={detail.saveData || detail}
      editMode={editMode}
      canEdit={canEdit}
      onQueueCommitted={handleQueueCommitted}
      queueActive={!simulated}
      changeExtras={editMode && (
        // ── Relationship cluster ── Link Neighbour, the existing Neighbour
        // Network list, and the cascading Network Effects, grouped tight
        // (gap:8) as one related set of relationship affordances; followed by
        // Edit Names. Both KEEP their immediate-apply behaviour and their
        // SettlementDetail state wiring — only their grouping moves into
        // Card 2.
        <div style={{display:'flex',flexDirection:'column',gap:24,marginTop:8}}>
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {/* Neighbour links — the toggle reveals the linking picker; the
              network list below shows existing links. The disclosure routes
              through the Button primitive (fullWidth), inheriting the ~44px
              min target + focus ring + variant tokens. */}
          <div style={{ border:`1px solid ${BORDER}`, borderRadius:8, overflow:'hidden' }}>
            <Button variant="secondary" fullWidth
              aria-expanded={linking} aria-pressed={linking}
              onClick={()=>setLinking(v=>!v)}
              style={{ justifyContent:'flex-start', gap:8, padding:'10px 14px', borderRadius:linking?'8px 8px 0 0':8, background:linking?'#f5ede0':CARD, border:'none', boxShadow:'none', textAlign:'left' }}>
              <span style={{ fontFamily:serif_, fontSize:FS.md, fontWeight:600, color:INK, flex:1 }}>Link a Neighbouring Settlement</span>
              <span style={{ fontSize:FS.xxs, color:MUTED }}>{linking?'Cancel':'Connect to another saved settlement'}</span>
            </Button>
            {linking&&<div style={{ padding:'10px 14px', borderTop:`1px solid ${BORDER}` }}><LinkNeighbourCard currentSave={detail} allSaves={saves} onLink={handleLink}/></div>}
          </div>

          {/* Neighbour Network list — demoted to spacing + tint (border
              removed): one of three pieces of the single relationship set. */}
          {network.length>0&&!linking&&<div role="group" aria-labelledby="neighbour-network-heading" style={{background:swatch.infoBg,borderRadius:8,padding:'12px 14px'}}>
            <h3 id="neighbour-network-heading" style={{fontSize:FS.xs,fontWeight:700,color:swatch.info,textTransform:'uppercase',letterSpacing:'0.06em',margin:'0 0 8px',display:'flex',alignItems:'center',gap:6}}>
              Neighbour Network ({network.length})
            </h3>
            <div style={{display:'flex',flexDirection:'column',gap:4}}>
            {network.map((n,i)=>{
              const c=REL_HEX[n.relationshipType]||SECOND;
              // Asymmetric links (overlord/vassal, patron/client) state WHICH SIDE
              // this settlement is, naming the neighbour ("Overlord of X"); symmetric
              // links and legacy rows fall through to the existing label.
              const rel=directionalRelationshipLabel(n, n.name)
                || n.displayRelationshipType
                || REL_LABELS[n.relationshipType]
                || (n.localRelationshipRole||n.relationshipType||'linked').replace(/_/g,' ');
              return<div key={n.linkId||n.id||n.name||i} style={{display:'flex',alignItems:'center',gap:8}}>
                <div style={{width:5,height:5,borderRadius:'50%',background:c,flexShrink:0}}/>
                <span style={{fontSize:FS.sm,fontWeight:600,color:INK,flex:1}}>{n.name}</span>
                <span style={{fontSize:FS.xs,color:c,fontWeight:600,background:`${c}18`,padding:'1px 5px',borderRadius:3}}>{rel}</span>
                <IconButton Icon={X} label={`Remove link to ${n.name}`} tone="danger" size="xl" onClick={()=>setConfirmRemoveNeighbour(i)} />
              </div>;
            })}
            </div>
          </div>}

          {/* ── Network Effects (cascading modifiers) ─────────────────────── */}
          {detail?.saveData?.id && <NetworkEffectsPanel settlementId={detail.saveData.id} saves={saves} relColors={REL_HEX} />}
        </div>

        {/* ── Edit Names — NPC & faction renames (the settlement's OWN name is
            renamed inline on the dossier header, the single consolidated
            control). */}
        <SettlementDetailEditNames
          settlement={detail.settlement}
          editNamesOpen={editNamesOpen}
          setEditNamesOpen={setEditNamesOpen}
          editingName={editingName}
          setEditingName={setEditingName}
          editDraft={editDraft}
          setEditDraft={setEditDraft}
          isCanonLocked={isCanonLocked}
          handleApplyRename={handleApplyRename}
        />
        </div>
      )}
    />
  );

  /**
   * Edit-mode body — the successor modal and the lifecycle/regional cluster
   * (regional impact, chronicle) that sit below the Workshop. Only renders in
   * edit mode.
   * @type {import('react').ReactNode}
   */
  const editBody = editMode && (<div style={{display:'flex',flexDirection:'column',gap:24}}>

    {/* Successor prompt — modal that appears after a pillar-tier
        KILL_NPC commits. Reads `pendingSuccession` off the slice;
        self-hides when the user dismisses or applies. The pendingState
        is set inside applyEvent() in the slice, so the modal mounts
        here at the dossier level rather than at App-root. */}
    <SuccessorPrompt />

    {/* Post-commit staleness notice. Fires once per change-queue commit on a
        narrated save (the prose predates the committed change), offering
        regenerate / continue-with-raw. */}
    <StaleNarrativeModal
      open={!!staleNotice}
      changeLabel={staleNotice?.label}
      onClose={() => setStaleNotice(null)}
    />

    {/* ── Lifecycle / regional cluster ── regional impact, chronicle history,
        and the rarely-wanted dossier-discarding regenerate reset, kept LAST
        and demoted (secondary outline) so a destructive reset is never the
        first or loudest control a GM meets on entering edit mode. */}
    <div style={{display:'flex',flexDirection:'column',gap:8}}>
      <RegionalImpactInbox
        saveId={detail?.saveData?.id || detail?.id}
        onApplied={handleRegionalImpactApplied}
      />

      {/* ── Chronicle: collapsible history log, only surfaced when a save has entries ── */}
      {saveId && Array.isArray(chronicleEntries) && chronicleEntries.length > 0 && (
        <ChroniclePanel entries={chronicleEntries} />
      )}

    </div>
    </div>);

    return<div style={{maxWidth:PAGE_MAX,margin:'0 auto',width:'100%'}}>
      {/* Single top-level frame: the whole detail surface — header, summary,
          dossier hero, Workshop rail, and the edit-mode clusters — shares ONE
          centered PAGE_MAX column so every band lines up on the same left/right
          edge (P12 frame-not-fullbleed). The per-section caps that used to live
          on the narrative cluster, edit body, and dossier wrapper are removed in
          favour of this one cap. */}
      {/* Local keyframe so the export-button spinner animates even when
          OutputContainer (which also defines @keyframes spin) isn't mounted. */}
      <style>{'@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}'}</style>
      {/* Header is two stacked rows so the settlement name owns its own line and
          wins the squint test (P4 one focal point): ROW 1 = the level-1 identity
          (Back · name) raised to FS.h1/700; ROW 2 = quieter level-2 status
          badges on the left with the action cluster (ONE primary: Export)
          right-aligned, so the loud control sits on the subordinate row, never a
          peer of the name. */}
      <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:16,padding:'12px 14px',background:swatch['#F5EDE0'],border:`1px solid ${BORDER}`,borderRadius:8}}>
        {/* Row 1 — navigation + level-1 identity. */}
        <div style={{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap',minWidth:0}}>
          <Button variant="secondary" size="sm" icon={<ChevronLeft size={13}/>} onClick={()=>{setDetail(null);setLinking(false);}}>
            Back to list
          </Button>
          {/* Level-1 focal point: the settlement identity, on its own line at
              FS.h1/700 so size+weight together clearly out-rank the 12px chrome
              below and the name survives the blur test. */}
          {/* Settlement-name rename — the ONE consolidated control, relocated
              here from the dossier header because the read dossier is no longer
              mounted in edit mode. Inline-editable in edit mode for owners
              (editMode && canEdit, mirroring the prior allowRename gate); plain
              text otherwise. The commit routes through the same
              handleApplyRename('settlement', …) cascade (canon-exempt, queue-vs-
              immediate). Edit Names stays NPC & faction only. */}
          <h1 style={{fontFamily:serif_,fontSize:FS.h1,fontWeight:700,color:INK,margin:0,lineHeight:1.15,flex:1,minWidth:0}}>
            {editMode && canEdit ? (
              <EditableInline
                value={detail.settlement?.name || detail.name || ''}
                ariaLabel="Edit settlement name"
                textStyle={{fontFamily:serif_,fontSize:FS.h1,fontWeight:700,color:INK,lineHeight:1.15}}
                trackEvent={EVENTS.EDIT_PENDING_QUEUED}
                provenance={{ kind: 'rename-settlement', entityId: saveId || 'unsaved' }}
                onCommit={(newName) => handleApplyRename('settlement', saveId, detail.settlement?.name ?? detail.name, newName)}
              />
            ) : detail.name}
          </h1>
        </div>

        {/* Row 2 — level-2 status (left) + the action cluster with ONE primary
            (right). Export is the dossier's main at-the-table action, so it is
            the solid primary (not danger-red: exporting is non-destructive). Edit
            and Share are subordinate secondary buttons. */}
        <div style={{display:'flex',alignItems:'center',gap:16,flexWrap:'wrap'}}>
          <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap',flex:1,minWidth:0}}>
            <PhaseBadge onCanonizeRequest={requestCanonize} />
            {/* Narrated/Raw state, rendered via the StateBadge primitive. */}
            <StateBadge
              kind={narrated ? 'narrated' : 'raw'}
              size="sm"
              tooltip={narrated
                ? 'This save has a narrative refinement or daily-life prose layer atop the simulated facts.'
                : 'This save has no narrative layer. The raw simulator output is shown.'}
            />
            {/* Edited badge surfaces when ANY field on this
                settlement has been hand-authored. Tooltip explains the
                guarantees (engine preserves on reroll, AI passes through). */}
            {editedCount > 0 && (
              <span
                title="This dossier contains hand-edited prose. The engine preserves these fields across rerolls. A narrative pass leaves them verbatim."
                // Level-3 tertiary metadata: weight + fill/border quieted
                // (was 800 + a saturated violet fill) so it no longer competes
                // with the level-1 name or the level-2 status badges.
                style={{
                  display:'inline-flex',alignItems:'center',gap:4,
                  padding:'3px 9px',borderRadius:11,fontSize:FS.xxs,fontWeight:600,
                  fontFamily:sans,letterSpacing:'0.07em',textTransform:'uppercase',
                  background:'rgba(90,42,138,0.08)',
                  color:swatch.ai,
                  border:'1px solid rgba(160,100,220,0.22)',
                }}
              >
                Edited · {editedCount}
              </span>
            )}
          </div>

          {/* Action cluster — ONE primary (Export); Edit + Share subordinate. */}
          <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
            {/* Edit-mode toggle. Premium-gated; non-premium users see a greyed-out
                variant that opens the pricing modal. Demoted to secondary so it
                no longer competes with the primary Export action. */}
            <Button
              variant="secondary"
              size="md"
              icon={!canEdit ? <Lock size={12}/> : <Edit3 size={12}/>}
              onClick={() => {
                if (canEdit) { toggleEditMode(); }
                else if (setPurchaseModalOpen) { setPurchaseModalOpen(true); }
              }}
              title={canEdit
                ? (editMode
                    ? 'Stop editing. Fields return to read-only display.'
                    : 'Edit dossier prose in place. Edits are preserved across rerolls, and a narrative pass leaves them in place.')
                : 'Manual editing is a Cartographer (premium) feature. Click to upgrade.'}
            >
              {!canEdit
                ? 'Edit (Premium)'
                : (editMode ? 'Stop Editing' : 'Edit Dossier')}
            </Button>
            {saveId && !isMobile && (
              <Button
                variant="secondary"
                size="md"
                icon={<Share2 size={13}/>}
                aria-pressed={shareOpen}
                onClick={() => setShareOpen(v => !v)}
                title="Publish this dossier to the public gallery, or manage its listing."
              >
                {shareOpen ? 'Close Gallery' : (liveSaveEntry?.is_public ? 'Edit Gallery Listing' : 'Share to Gallery')}
              </Button>
            )}
            <Button
              variant="primary"
              size="md"
              busy={exporting}
              icon={<FileText size={12}/>}
              onClick={() => { setPdfError(null); setExportSheetOpen(true); }}
              title="Choose Draft Brief / Canon Dossier / Timeline Packet."
            >
              {exporting ? 'Building PDF…' : 'Export Dossier'}
            </Button>
          </div>
        </div>
      </div>

      {/* Network-effect echo. The dossier below already carries tier, population,
          ruler, and the causal hook, so those redundant copies are gone; the one
          fact the read-only dossier does NOT surface is the cross-settlement
          cascade, so the dominant network anomaly stays as a single quiet line.
          Only rendered when a link actually moves a meter (networkEcho's gate). */}
      {networkEcho && (
        <div style={{display:'flex',flexWrap:'wrap',alignItems:'baseline',gap:'4px 16px',margin:'0 0 16px',padding:'0 2px'}}>
          <span
            title={`${networkEcho.label} shifts by ${networkEcho.delta} from ${networkEcho.count} linked settlement${networkEcho.count===1?'':'s'}. A positive figure helps, a negative one hurts. See Network Effects in edit mode for the full breakdown.`}
            style={{display:'inline-flex',alignItems:'baseline',gap:5,flexShrink:0}}
          >
            <span style={{fontSize:FS.xxs,color:SECOND,textTransform:'uppercase',letterSpacing:'0.06em',fontFamily:sans}}>Network</span>
            <span style={{fontFamily:sans,fontSize:FS.sm,fontWeight:700,color:INK}}>{networkEcho.label}</span>
            <span style={{fontFamily:'monospace',fontSize:FS.sm,fontWeight:700,color:networkEcho.isPos?swatch.success:swatch.danger}}>{networkEcho.delta}</span>
            {networkEcho.via && <span style={{fontSize:FS.xxs,color:BODY,fontFamily:sans}}>via {networkEcho.via}</span>}
          </span>
        </div>
      )}

      {/* Share to Gallery — revealed by the header's "Share to Gallery" button
          (in line with Edit Dossier / Export Dossier). The publish flow has an
          expandable details form, so the header button toggles this panel
          rather than living inline in the dense button row. Owners only;
          ShareToGallery self-gates on auth + canonized state. */}
      {saveId && shareOpen && !isMobile && (
        // 16px (on-scale) standalone separation — this block sits in a gap-less
        // region between siblings, so it owns its own bottom margin rather than
        // an off-scale 14 (P5 spacing-scale discipline).
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:FS.xxs, fontWeight:800, color:MUTED, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:8, display:'flex', alignItems:'center', gap:6 }}>
            {liveSaveEntry?.is_public ? 'Edit Gallery Listing' : 'Share to Gallery'}
          </div>
          <ShareToGallery
            saveId={saveId}
            isPublic={liveSaveEntry?.is_public}
            publicSlug={liveSaveEntry?.public_slug}
            settlement={detail.settlement}
            galleryDescription={liveSaveEntry?.gallery_description}
            galleryImageUrl={liveSaveEntry?.gallery_image_url}
            galleryImageAlt={liveSaveEntry?.gallery_image_alt}
            galleryTags={liveSaveEntry?.gallery_tags}
            campaignState={liveSaveEntry?.campaignState || detail.saveData?.campaignState}
            galleryShareNarrated={liveSaveEntry?.gallery_share_narrated}
            galleryShareDm={liveSaveEntry?.gallery_share_dm}
            galleryImportable={liveSaveEntry?.gallery_importable}
          />
        </div>
      )}

      {/* ── Read / edit surface split (one surface per mode) ────────────────────
            The dossier hero, edit chrome, Workshop, and edit body are bound as
            element references above and placed by `editMode` so each mode shows
            exactly ONE surface — never the other trailing behind it. Each block
            keeps its own DOM/flex/sticky/margin context (the hero's sticky
            NextActionRail, its mobile reflow, and its FeatureErrorBoundary/
            Suspense move untouched). The Workshop is referenced once per branch,
            so it is never double-mounted.

            READ (edit OFF): the runnable dossier hero ONLY — the content the GM
            came for. The Workshop edit-cards no longer trail at the bottom. The
            edit chrome + body evaluate falsy and do not render.
              · Exception (free/anon, !canEdit): a free user CANNOT enter edit
                mode (the Edit toggle opens the purchase modal instead of
                flipping editMode), so the free→premium Workshop teaser would be
                orphaned if dropped entirely. We keep it reachable for them only,
                on its own cream backdrop so its section labels never fall onto
                the page painting. Premium read mode is dossier-only.

            EDIT (edit ON): the authoring workbench ONLY (edit chrome → Workshop →
            edit body), at the top, on a cream backdrop that grows with its
            content — so the painting resumes only at the panel's bottom edge and
            the bare workbench labels never sit on the tapestry. The read dossier
            is no longer mounted here, so the rename relocated to the persistent
            header card above; the NextActionRail (read-mode guidance) is
            read-mode-only by design. */}
      {editMode ? (
        <>
          {/* Editor band, then the read-only dossier mounted BENEATH it (not a
              body-swap that hides it); the read-mode NextActionRail aside is
              omitted here — edit mode has its own chrome. */}
          <div className="sf-readable-surface" style={{padding:16}}>{editChrome}{workshop}{editBody}</div>
          {dossierReadPanel && <div style={{marginTop:24}}>{dossierReadPanel}</div>}
        </>
      ) : (
        <>
          {dossierHero}
          {/* Free-user teaser only: see the READ note above. */}
          {!canEdit && (
            <div className="sf-readable-surface" style={{padding:16}}>{workshop}</div>
          )}
        </>
      )}

      {/* PDF export variant picker — opened by the Export Dossier button in the
          header, available in both view and edit mode. Conditionally mounted so
          it REMOUNTS each open and re-derives its phase-aware variant + AI-source
          defaults from the live store (P9): a permanently-mounted sheet froze
          those defaults at first mount, surfacing a stale pre-selection after the
          GM advanced time or generated a narrative. The export error + retry now
          live INSIDE the sheet, so a failure no longer strands a banner behind
          the (closed) overlay. */}
      {exportSheetOpen && (
        <ExportSheet
          exporting={exporting}
          error={pdfError}
          onClose={() => { setExportSheetOpen(false); setPdfError(null); }}
          onExport={handlePdfExport}
        />
      )}

      {/* Shared canonize confirm — opened by both the PhaseBadge button and the
          rail's Canonize rung; confirmCanonize() runs canonize() + first_canonize. */}
      <ConfirmDialog
        open={confirmCanonizeOpen}
        tone="warning"
        title="Mark settlement as canon?"
        body="Future changes will be logged as in-world events with timeline entries."
        confirmLabel="Canonize"
        onConfirm={confirmCanonize}
        onCancel={() => setConfirmCanonizeOpen(false)}
      />

      <ConfirmDialog
        open={confirmRevertRaw}
        tone="warning"
        title="Revert to raw view?"
        body="The saved narrative and daily-life prose will be cleared. Chronicle history, if any, is preserved."
        confirmLabel="Revert"
        onConfirm={confirmRevertToRaw}
        onCancel={() => setConfirmRevertRaw(false)}
      />

      {/* Remove-neighbour confirmation — a destructive cross-settlement write, so
          it gets the same ConfirmDialog discipline as the (less destructive)
          revert above. Names the consequence so the GM commits with eyes open. */}
      <ConfirmDialog
        open={confirmRemoveNeighbour !== null}
        tone="warning"
        title="Remove this neighbour link?"
        body="Removing this link also clears the paired NPC contacts and network effects on both settlements. This cannot be undone."
        confirmLabel="Remove link"
        onConfirm={() => {
          const idx = confirmRemoveNeighbour;
          setConfirmRemoveNeighbour(null);
          if (idx !== null) removeNeighbour(idx);
        }}
        onCancel={() => setConfirmRemoveNeighbour(null)}
      />

    </div>;
}
