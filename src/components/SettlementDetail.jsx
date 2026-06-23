import { useState, useEffect, lazy, Suspense } from 'react';
import {ChevronLeft, X, FileText, RotateCcw, Edit3, Lock, Share2} from 'lucide-react';
import ShareToGallery from './ShareToGallery.jsx';
import FeatureErrorBoundary from './FeatureErrorBoundary.jsx';
import Button from './primitives/Button.jsx';
import IconButton from './primitives/IconButton.jsx';
// Settlement PDF export drags in @react-pdf/renderer (~1MB) plus all PDF
// section components. Import lazily on user click so opening a settlement
// detail view doesn't pay for export machinery up front.
const generateSettlementPDF = (...args) =>
  import('../utils/generateSettlementPDF.js').then(m => m.generateSettlementPDF(...args));
import { validateDossier } from '../domain/validation/consistency.js';
import { useStore } from '../store/index.js';
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
import { INK, MUTED, BODY, SECOND, BORDER, CARD, AMBER_DEEP, sans, serif_, FS, swatch, PAGE_MAX } from './theme';
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
  handleLink, removeNeighbour, applyRename,
}) {
  const network=detail.settlement.neighbourNetwork||[];
  // Runnable-essentials lead-in: surface the already-computed hot-path facts
  // (tier · population · ruler · current pressure) as a single de-emphasized
  // line under the header so the at-a-glance essentials precede the deep
  // dossier. This is placement/surfacing of existing engine data, not prose.
  const s_=detail.settlement;
  const summaryRuler=s_.powerStructure?.governingName||null;
  const summaryTier=s_.tier||null;
  const summaryPop=Number.isFinite(s_.population)?s_.population.toLocaleString():null;
  const summaryPressure=(s_.pressureSentence||'').trim()||null;
  const summaryFacts=[
    summaryTier&&{label:'Tier',value:summaryTier},
    summaryPop&&{label:'Population',value:summaryPop},
    summaryRuler&&{label:'Ruler',value:summaryRuler},
  ].filter(Boolean);
  const hasSummary=summaryFacts.length>0||!!summaryPressure;

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
  // store value tracks this detail view. Renames are a draft-only affordance.
  const phase = useStore(s => s.phase);
  const isCanonLocked = phase === 'canon';
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

  // Wrapper: call parent applyRename then clear local edit state
  const handleApplyRename = (type, id, oldName, newName) => {
    // Names freeze at canonization — guard even though the affordance is hidden.
    if (isCanonLocked && (type === 'npc' || type === 'faction')) return;
    applyRename(type, id, oldName, newName);
    setEditingName(null);
    setEditDraft('');
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
          <h1 style={{fontFamily:serif_,fontSize:FS.h1,fontWeight:700,color:INK,margin:0,lineHeight:1.15,flex:1,minWidth:0}}>{detail.name}</h1>
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
            {saveId && (
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

      {/* Runnable-essentials lead-in. Two tiers, change-first (P3): the living
          pressure + the dominant network anomaly lead on their own line, given a
          glyph + heavier weight + a single reserved amber accent so movement —
          not the static roster — is the loud part of the front-load. The static
          Tier · Population · Ruler facts sit beneath, quieted to muted labels +
          serif values. Surfacing of existing engine data, not prose. The amber
          accent is deliberately distinct from the gold Export primary so the two
          don't collide (P4 colour scarcity). */}
      {hasSummary && (
        <div style={{display:'flex',flexDirection:'column',gap:6,margin:'0 0 16px',padding:'0 2px'}}>
          {(summaryPressure||networkEcho) && (
            <div style={{display:'flex',flexWrap:'wrap',alignItems:'baseline',gap:'4px 16px'}}>
              {summaryPressure && (
                <span style={{display:'inline-flex',alignItems:'baseline',gap:6,flex:'1 1 240px',minWidth:0}}>
                  <span style={{fontFamily:serif_,fontSize:FS.md,fontWeight:600,color:AMBER_DEEP,lineHeight:1.35}}>{summaryPressure}</span>
                </span>
              )}
              {networkEcho && (
                <span
                  title={`${networkEcho.label} shifts by ${networkEcho.delta} from ${networkEcho.count} linked settlement${networkEcho.count===1?'':'s'}. A positive figure helps, a negative one hurts. See Network Effects in edit mode for the full breakdown.`}
                  style={{display:'inline-flex',alignItems:'baseline',gap:5,flexShrink:0}}
                >
                  <span style={{fontSize:FS.xxs,color:SECOND,textTransform:'uppercase',letterSpacing:'0.06em',fontFamily:sans}}>Network</span>
                  <span style={{fontFamily:sans,fontSize:FS.sm,fontWeight:700,color:INK}}>{networkEcho.label}</span>
                  <span style={{fontFamily:'monospace',fontSize:FS.sm,fontWeight:700,color:networkEcho.isPos?swatch.success:swatch.danger}}>{networkEcho.delta}</span>
                  {networkEcho.via && <span style={{fontSize:FS.xxs,color:BODY,fontFamily:sans}}>via {networkEcho.via}</span>}
                </span>
              )}
            </div>
          )}
          {summaryFacts.length>0 && (
            <div style={{display:'flex',flexWrap:'wrap',alignItems:'baseline',gap:'4px 16px'}}>
              {summaryFacts.map(f => (
                <span key={f.label} style={{display:'inline-flex',alignItems:'baseline',gap:5}}>
                  <span style={{fontSize:FS.xxs,color:SECOND,textTransform:'uppercase',letterSpacing:'0.06em',fontFamily:sans}}>{f.label}</span>
                  <span style={{fontFamily:serif_,fontSize:FS.sm,fontWeight:600,color:INK}}>{f.value}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Share to Gallery — revealed by the header's "Share to Gallery" button
          (in line with Edit Dossier / Export Dossier). The publish flow has an
          expandable details form, so the header button toggles this panel
          rather than living inline in the dense button row. Owners only;
          ShareToGallery self-gates on auth + canonized state. */}
      {saveId && shareOpen && (
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

      {/* ── The dossier hero (P1 content-is-hero) ─────────────────────────────
            The runnable dossier — overview, plot hooks, DM compass, NPCs,
            factions — leads the page directly under the runnable-essentials
            summary, BEFORE the Workshop rail and edit chrome. It is the content
            the GM came for; the engine-mechanics Workshop and the edit clusters
            below are the progressive-disclosure drill-down.

            Two-column at desktop width (dossier keystone §2): the runnable
            dossier on the left, the phase-aware NextActionRail sticky on the
            right. The row reflows to a single column on narrow (flexWrap), where
            the rail drops BELOW the dossier so the read stays single-column
            legible. The rail is an owner-only affordance, gated on saveId (this
            saved view is owner-by-construction; never a public route). */}
      {detail.settlement&&<div style={{display:'flex',gap:16,flexWrap:'wrap',alignItems:'flex-start',marginBottom:24}}>
        <div style={{flex:'1 1 520px',minWidth:0}}>
          <FeatureErrorBoundary
            label="SettlementDetail.output"
            kind="react.render.dossier"
            resetKeys={[saveId]}
            fallback={<div style={{padding:12,color:swatch.danger,fontSize:FS.sm}}>Error loading settlement output.</div>}
          >
            <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: MUTED }}>Loading...</div>}>
              {/* The dossier inherits the one top-level PAGE_MAX frame; no
                  per-section cap. The settlement name is inline-editable on the
                  dossier header in edit mode (the single consolidated rename
                  control); the commit routes through applyRename('settlement', …). */}
              <OutputContainer
                settlement={detail.settlement}
                readOnly
                saveId={saveId}
                allowRename={editMode && canEdit && !isCanonLocked}
                onRenameSettlement={(newName) => handleApplyRename('settlement', saveId, detail.settlement.name, newName)}
              />
            </Suspense>
          </FeatureErrorBoundary>
        </div>
        {saveId && (
          <aside style={{flex:'0 1 248px',minWidth:0,position:'sticky',top:12,alignSelf:'flex-start'}}>
            <NextActionRail
              settlement={detail.settlement}
              save={detail.saveData || detail}
              simulated={simulated}
              handlers={railHandlers}
            />
          </aside>
        )}
      </div>}

      {/* Edit-mode chrome — hidden in the read-only View, revealed by "Edit
          Dossier". State snapshot, AI polish, event composer, next-action rail,
          provenance, settlement editor, name editing, neighbour links, network
          effects, and the chronicle live behind this gate so View opens to a
          clean dossier. */}
      {/* ── Narrative cluster ─────────────────────────────────────────────────
            The edit session's single forward move: the AI-polish card (the lone
            high-emphasis "enrich this dossier" action), with Revert-to-Raw as a
            quiet trailing control of the SAME group — the semi-destructive reset
            reads as an undo of the polish, not a co-equal peer CTA. Spacing-grouped
            (tight gap within the cluster); width is owned by the one top-level
            PAGE_MAX frame, so no per-cluster cap is needed. */}
      {editMode && (
      <div style={{marginBottom:24,display:'flex',flexDirection:'column',gap:8}}>
        {/* AI polish prompt — edit-only (it triggers a narrative write). */}
        <AIInlineCard
          settlement={detail.settlement}
          onPolish={() => {
            // The AI slice's actual handler is `requestNarrative(saveId)` —
            // there's no `runAiLayer` action. Fixed 2026-04 after the audit
            // verification revealed the dangling reference. The save id
            // comes from the currently-open detail save record.
            const live = useStore.getState();
            const saveId = detail?.saveData?.id || detail?.id;
            if (typeof live.requestNarrative === 'function' && saveId) {
              live.requestNarrative(saveId).catch(e => {
                console.warn('[AIInlineCard] requestNarrative failed:', e);
              });
            }
            // Fire pricing moment on first AI use (cooldowned per-user).
            triggerPricingMoment('first_ai_use', () => {
              live.setPurchaseModalOpen?.(true);
            }, { tier: live.auth?.tier });
          }}
        />
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
      )}

      {/* ── The Workshop ──────────────────────────────────────────────────────
            The layered right-rail (UX overhaul Phase 6). Replaces the binary
            editMode long-scroll: each card READS in view mode (the free→premium
            teaser — the Phase 2 dossier read components) and becomes EDITABLE in
            edit mode (write controls premium). The 3 subsystem gate toggles live
            in the Faith/War cards, each byte-identical when off. Mounted at all
            times so a free user sees the engine read surfaces. */}
      <Workshop
        settlement={detail.settlement}
        saveId={detail?.saveData?.id || detail?.id}
        save={detail.saveData || detail}
        editMode={editMode}
        canEdit={canEdit}
      />

      {/* Edit-mode body — width inherited from the one top-level PAGE_MAX frame
          (no per-section cap). Grouped by differential spacing: a loose 24px gap
          BETWEEN logical clusters, tight spacing WITHIN each, so grouping is
          carried by rhythm rather than a flat wall of equally-bordered cards. */}
      {editMode && (<div style={{display:'flex',flexDirection:'column',gap:24}}>

      {/* Successor prompt — modal that appears after a pillar-tier
          KILL_NPC commits. Reads `pendingSuccession` off the slice;
          self-hides when the user dismisses or applies. The pendingState
          is set inside applyEvent() in the slice, so the modal mounts
          here at the dossier level rather than at App-root. */}
      <SuccessorPrompt />

      {/* ── Relationship cluster ── Link Neighbour, the existing Neighbour
          Network list, and the cascading Network Effects, grouped tight (gap:8)
          as one related set of relationship affordances. */}
      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        {/* Neighbour links — the toggle reveals the linking picker; the network
            list below shows existing links. The disclosure routes through the
            Button primitive (fullWidth), so it inherits the ~44px min target +
            focus ring + variant tokens, matching the sibling Edit Names toggle
            (P7/P11) instead of a hand-rolled raw button element. The border survives on
            THIS interactive collapsible — the one item in the cluster that earns
            it as a click target. */}
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

        {/* Neighbour Network list — demoted to spacing + tint (border removed):
            it is one of three pieces of the single relationship set, so the gap:8
            + the tint group it, the colored dots ledger the rows, and the looser
            between-cluster gap:24 separates it from the lifecycle set (P5
            anti-box-soup). */}
        {network.length>0&&!linking&&<div role="group" aria-labelledby="neighbour-network-heading" style={{background:swatch.infoBg,borderRadius:8,padding:'12px 14px'}}>
          <h3 id="neighbour-network-heading" style={{fontSize:FS.xs,fontWeight:700,color:swatch.info,textTransform:'uppercase',letterSpacing:'0.06em',margin:'0 0 8px',display:'flex',alignItems:'center',gap:6}}>
            Neighbour Network ({network.length})
          </h3>
          {/* Rows separated by spacing, not per-row hairlines: the single card
              border + the colored relationship dot already group the list, so
              the rows read as a clean ledger rather than a spreadsheet grid. */}
          <div style={{display:'flex',flexDirection:'column',gap:4}}>
          {network.map((n,i)=>{
            const c=REL_HEX[n.relationshipType]||SECOND;
            // Resolve the relationship label through the SAME canonical REL_LABELS
            // map the Network Effects Sources list uses, so the identical
            // relationship enum can never print two different strings across the
            // surface (P11). A per-link displayRelationshipType override still
            // wins when present (a richer custom label); otherwise REL_LABELS is
            // the one canonical formatter, falling back to a de-underscored enum.
            const rel=n.displayRelationshipType
              || REL_LABELS[n.relationshipType]
              || (n.localRelationshipRole||n.relationshipType||'linked').replace(/_/g,' ');
            // Key by a stable identity (not the array index) so removing a
            // neighbour can't momentarily render the wrong row / mis-place the X
            // button's feedback. removeNeighbour still takes the index `i`, which
            // is the live position into detail.settlement.neighbourNetwork.
            // Dot (5px) + chip ('1px 5px') geometry matches the Sources rows in
            // NetworkEffectsPanel so the same concept renders identically (P11).
            return<div key={n.linkId||n.id||n.name||i} style={{display:'flex',alignItems:'center',gap:8}}>
              <div style={{width:5,height:5,borderRadius:'50%',background:c,flexShrink:0}}/>
              <span style={{fontSize:FS.sm,fontWeight:600,color:INK,flex:1}}>{n.name}</span>
              <span style={{fontSize:FS.xs,color:c,fontWeight:600,background:`${c}18`,padding:'1px 5px',borderRadius:3}}>{rel}</span>
              <IconButton Icon={X} label={`Remove link to ${n.name}`} tone="danger" size="xl" onClick={()=>setConfirmRemoveNeighbour(i)} />
            </div>;
          })}
          </div>
        </div>}

        {/* ── Network Effects (cascading modifiers) ─────────────────────────── */}
        {detail?.saveData?.id && <NetworkEffectsPanel settlementId={detail.saveData.id} saves={saves} relColors={REL_HEX} />}
      </div>

      {/* ── Edit Names — NPC & faction renames (the settlement's OWN name is now
            renamed inline on the dossier header, the single consolidated control). ── */}
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
      </div>)}

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
