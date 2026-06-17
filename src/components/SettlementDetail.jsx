import { useState, useEffect, lazy, Suspense, Component } from 'react';
import {Link2, ChevronLeft, X, FileText, RotateCcw, Edit3, Lock, Share2} from 'lucide-react';
import ShareToGallery from './ShareToGallery.jsx';
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
import SystemStateBar   from './settlement/SystemStateBar.jsx';
import EventComposer    from './settlement/EventComposer.jsx';
import Timeline         from './settlement/Timeline.jsx';
import PendingIntentions from './settlement/PendingIntentions.jsx';
import CoherencePanel   from './settlement/CoherencePanel.jsx';
// Wave 2 audit components: contextual AI, action rail, provenance,
// export sheet picker. Each is small and additive — they replace
// scattered chrome with consistent surfaces in the right rail.
import ProvenanceBlock  from './settlement/ProvenanceBlock.jsx';
import AIInlineCard     from './settlement/AIInlineCard.jsx';
import ExportSheet      from './settlement/ExportSheet.jsx';
// Modal that fires after pillar-tier KILL_NPC commits. Reads
// pendingSuccession off the slice, shows ranked successors, and
// pre-fills the EventComposer with ASSIGN_NPC_TO_ROLE on selection.
import SuccessorPrompt  from './settlement/SuccessorPrompt.jsx';
import RegionalImpactInbox from './region/RegionalImpactInbox.jsx';
import { triggerPricingMoment } from '../lib/pricingMoments.js';
// Tier 7.15 — phased UI redesign rollout: the Narrated/Raw chip below
// migrates from an inline ad-hoc <span> to the StateBadge primitive,
// which centralizes the visual styling and the role="status" a11y
// announcement under one shared component.
import StateBadge        from './primitives/StateBadge.jsx';
import { ConfirmDialog } from './primitives/Dialog.jsx';
import NetworkEffectsPanel from './settlementDetail/SettlementDetailNetworkEffectsPanel.jsx';
import LinkNeighbourCard from './settlementDetail/SettlementDetailLinkNeighbourCard.jsx';
import SettlementDetailEditNames from './settlementDetail/SettlementDetailEditNames.jsx';
import { INK, MUTED, SECOND, BORDER, CARD, sans, serif_, FS, swatch, PAGE_MAX } from './theme';

const REL_COLORS = {
  trade_partner:'#1a5a28', allied:'#1a3a7a', patron:'#4a1a6a',
  client:'#6a3a1a', rival:'#8a5010', cold_war:'#8a3010',
  hostile:'#8b1a1a', neutral:'#6b5340',
};

class DetailErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[SettlementDetail] detail render failed', error, info);
  }

  render() {
    if (this.state.error) {
      return <div style={{padding:12,color:swatch.danger,fontSize:FS.sm}}>Error loading settlement output.</div>;
    }
    return this.props.children;
  }
}

// ── Save migration ─────────────────────────────────────────────────────────
// Upgrades old save format to current schema. Safe to call on any save.
function _migrateConfig(config) {
  if (!config) return {};
  const c = { ...config };
  // Add magicExists if missing (infer from priorityMagic)
  if (c.magicExists === undefined) {
    c.magicExists = (c.priorityMagic ?? 50) > 0;
  }
  // Ensure nearbyResourcesState exists
  if (!c.nearbyResourcesState) c.nearbyResourcesState = {};
  return c;
}

// ── NPC pairing categories by relationship type ───────────────────────────────
const NPC_PAIR_CATS = {
  trade_partner:['economy'],
  allied:       ['economy','military'],
  patron:       ['military','economy'],
  client:       ['economy'],
  rival:        ['economy','military'],
  cold_war:     ['military','criminal'],
  hostile:      ['military'],
  neutral:      ['economy'],
};

const CONTACT_DESC = {
  trade_partner:(a,ar,b,br,bs)=>`${a} (${ar}) maintains trade connections with ${b} (${br}) in ${bs}.`,
  allied:       (a,ar,b,br,bs)=>`${a} (${ar}) coordinates with ${b} (${br}) of ${bs} on matters of mutual defense and policy.`,
  patron:       (a,ar,b,br,bs)=>`${a} (${ar}) reports to ${b} (${br}) of ${bs}, who exercises oversight authority.`,
  client:       (a,ar,b,br,bs)=>`${a} (${ar}) supplies goods and services to ${b} (${br}) in ${bs}.`,
  rival:        (a,ar,b,br,bs)=>`${a} (${ar}) and ${b} (${br}) of ${bs} are known adversaries competing for the same interests.`,
  cold_war:     (a,ar,b,br,bs)=>`${a} (${ar}) runs quiet intelligence operations against ${b} (${br}) of ${bs}, officially unacknowledged.`,
  hostile:      (a,ar,b,br,bs)=>`${a} (${ar}) and ${b} (${br}) of ${bs} are active enemies.`,
  neutral:      (a,ar,b,br,bs)=>`${a} (${ar}) has occasional dealings with ${b} (${br}) in ${bs}.`,
};

// Build paired inter-settlement NPC relationships between two settlements
function _buildInterSettlementNPCs(settlementA, settlementB, relType, linkId) {
  const cats = NPC_PAIR_CATS[relType] || ['economy'];
  const descFn = CONTACT_DESC[relType] || CONTACT_DESC.neutral;
  let npcsA = (settlementA.npcs||[]).filter(n => cats.includes((n.category||'').toLowerCase()));
  let npcsB = (settlementB.npcs||[]).filter(n => cats.includes((n.category||'').toLowerCase()));

  // Fallback: if preferred categories yield nothing, use any available NPC
  if (!npcsA.length) npcsA = (settlementA.npcs||[]).slice(0, 3);
  if (!npcsB.length) npcsB = (settlementB.npcs||[]).slice(0, 3);
  if (!npcsA.length || !npcsB.length) return { forA:[], forB:[] };

  const pairs = [];
  const maxPairs = Math.min(npcsA.length, npcsB.length, 2);
  const usedB = new Set();
  for (let i = 0; i < maxPairs; i++) {
    const a = npcsA[i];
    const b = npcsB.find(n => !usedB.has(n.id) && n.category === a.category)
           || npcsB.find(n => !usedB.has(n.id));
    if (!b) break;
    usedB.add(b.id);
    pairs.push({ a, b });
  }

  const forA = pairs.map(({a,b}) => ({
    linkId,
    npcId:        a.id,
    npcName:      a.name,
    npcRole:      a.role,
    partnerName:  b.name,
    partnerRole:  b.role,
    partnerSettlement: settlementB.name,
    relType,
    description: descFn(a.name, a.role, b.name, b.role, settlementB.name),
  }));
  const forB = pairs.map(({a,b}) => ({
    linkId,
    npcId:        b.id,
    npcName:      b.name,
    npcRole:      b.role,
    partnerName:  a.name,
    partnerRole:  a.role,
    partnerSettlement: settlementA.name,
    relType,
    description: descFn(b.name, b.role, a.name, a.role, settlementA.name),
  }));

  return { forA, forB };
}

// Find a save entry by settlement name
function _findSaveByName(saves, name) {
  return saves.find(s => s.name === name || s.settlement?.name === name) || null;
}

// Find a save entry by id
function _findSaveById(saves, id) {
  return saves.find(s => s.id === id) || null;
}

export default function SettlementDetail({
  detail, setDetail,
  saves, _setSaves,
  linking, setLinking,
  editNamesOpen, setEditNamesOpen,
  handleLink, removeNeighbour, applyRename,
  onLoad,
}) {
  const network=detail.settlement.neighbourNetwork||[];
  const [editingName, setEditingName] = useState(null);  // {type,id,oldName}
  const [editDraft,   setEditDraft]   = useState('');
  const [_saved,       _setSaved]      = useState(false);
  const [exporting,   setExporting]   = useState(false); // PDF export spinner
  const [exportSheetOpen, setExportSheetOpen] = useState(false); // variant picker modal
  const [shareOpen, setShareOpen] = useState(false); // Share to Gallery panel, toggled from the header button
  const [confirmRevertRaw, setConfirmRevertRaw] = useState(false);
  const [pdfError, setPdfError] = useState(null);

  // AI-1: pull the saved settlement's persisted ai_data into the aiSlice
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
  const isCanonLocked = useStore(s => s.phase) === 'canon';

  // Tier 5.4 — premium-gated manual editing. The edit toggle lives on
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

  // Chronicle (AI-3b) — pulled from the live savedSettlements entry so the
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
      await generateSettlementPDF(detail.settlement, {
        aiSettlement, aiDailyLife, narrativeMode: useAi,
        systemState: liveStore.systemState,
        eventLog: liveStore.eventLog,
        phase: liveStore.phase,
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
      setPdfError(`PDF export failed: ${msg}`);
    } finally {
      setExporting(false);
    }
  };

    return<div>
      {/* Local keyframe so the export-button spinner animates even when
          OutputContainer (which also defines @keyframes spin) isn't mounted. */}
      <style>{'@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}'}</style>
      <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:16,padding:'12px 14px',background:swatch['#F5EDE0'],border:`1px solid ${BORDER}`,borderRadius:8}}>
        <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
          <Button variant="secondary" size="sm" icon={<ChevronLeft size={13}/>} onClick={()=>{setDetail(null);setLinking(false);}}>
            Back to list
          </Button>
          <span style={{fontFamily:serif_,fontSize:FS.lg,fontWeight:600,color:INK}}>{detail.name}</span>
          <PhaseBadge />
          <span style={{flex:1}} />
          {/* Narrated/Raw — Tier 7.15 phased rollout: migrated to StateBadge primitive. */}
          <StateBadge
            kind={narrated ? 'narrated' : 'raw'}
            size="sm"
            tooltip={narrated
              ? 'This save has a narrative refinement or daily-life prose layer atop the simulated facts.'
              : 'This save has no narrative layer. The raw simulator output is shown.'}
          />
          {editMode && narrated && (
            <Button
              variant="ai"
              size="sm"
              icon={<RotateCcw size={12}/>}
              onClick={handleRevertToRaw}
              title="Clear the narrative refinement and daily-life prose on this save, returning it to the raw simulator output. Chronicle history is preserved."
            >
              Revert to Raw
            </Button>
          )}

          {/* Tier 5.4 — Edited badge surfaces when ANY field on this
              settlement has been hand-authored. Tooltip explains the
              guarantees (engine preserves on reroll, AI passes through). */}
          {editedCount > 0 && (
            <span
              title="This dossier contains hand-edited prose. The engine preserves these fields across rerolls; the AI overlay passes them through verbatim."
              style={{
                display:'inline-flex',alignItems:'center',gap:4,
                padding:'3px 9px',borderRadius:11,fontSize:FS.xxs,fontWeight:800,
                fontFamily:sans,letterSpacing:'0.07em',textTransform:'uppercase',
                background:'rgba(90,42,138,0.14)',
                color:swatch.ai,
                border:'1px solid rgba(160,100,220,0.35)',
              }}
            >
              <Edit3 size={10}/> Edited · {editedCount}
            </span>
          )}

          {/* Tier 5.4 — Edit-mode toggle. Premium-gated; non-premium
              users see a greyed-out variant that opens the pricing
              modal so they understand it's a premium feature. */}
          <Button
            variant={!canEdit ? 'secondary' : 'ai'}
            size="sm"
            icon={!canEdit ? <Lock size={12}/> : <Edit3 size={12}/>}
            onClick={() => {
              if (canEdit) { toggleEditMode(); }
              else if (setPurchaseModalOpen) { setPurchaseModalOpen(true); }
            }}
            title={canEdit
              ? (editMode
                  ? 'Stop editing. Fields return to read-only display.'
                  : 'Edit dossier prose in place. Edits are preserved across rerolls and respected by the AI overlay.')
              : 'Manual editing is a Cartographer (premium) feature. Click to upgrade.'}
          >
            {!canEdit
              ? 'Edit (Premium)'
              : (editMode ? 'Stop Editing' : 'Edit Dossier')}
          </Button>
          <Button
            variant="danger"
            size="sm"
            busy={exporting}
            icon={<FileText size={12}/>}
            onClick={() => setExportSheetOpen(true)}
            title="Choose Draft Brief / Canon Dossier / Timeline Packet."
          >
            {exporting ? 'Building PDF…' : 'Export Dossier'}
          </Button>
          {saveId && (
            <Button
              variant="info"
              size="sm"
              icon={<Share2 size={13}/>}
              aria-pressed={shareOpen}
              onClick={() => setShareOpen(v => !v)}
              title="Publish this dossier to the public gallery, or manage its listing."
            >
              {shareOpen ? 'Close Gallery' : (liveSaveEntry?.is_public ? 'Edit Gallery Listing' : 'Share to Gallery')}
            </Button>
          )}
        </div>
      </div>

      {/* Share to Gallery — revealed by the header's "Share to Gallery" button
          (in line with Edit Dossier / Export Dossier). The publish flow has an
          expandable details form, so the header button toggles this panel
          rather than living inline in the dense button row. Owners only;
          ShareToGallery self-gates on auth + canonized state. */}
      {saveId && shareOpen && (
        <div style={{ border:`1px solid ${BORDER}`, borderRadius:8, padding:'10px 14px', marginBottom:14, background:CARD }}>
          <div style={{ fontSize:FS.xxs, fontWeight:800, color:MUTED, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:8, display:'flex', alignItems:'center', gap:6 }}>
            <Share2 size={12}/> {liveSaveEntry?.is_public ? 'Edit Gallery Listing' : 'Share to Gallery'}
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
          />
        </div>
      )}

      {/* Edit-mode chrome — hidden in the read-only View, revealed by "Edit
          Dossier". State snapshot, AI polish, event composer, next-action rail,
          provenance, settlement editor, name editing, neighbour links, network
          effects, and the chronicle live behind this gate so View opens to a
          clean dossier. */}
      {editMode && (<>
      <div style={{display:'flex',gap:8,marginBottom:12,alignItems:'center',flexWrap:'wrap'}}>
        <Button variant="info" size="sm" onClick={()=>{onLoad({settlement:detail.settlement,config:detail.config,institutionToggles:detail.institutionToggles,categoryToggles:detail.categoryToggles,goodsToggles:detail.goodsToggles||{},servicesToggles:detail.servicesToggles||{},});setDetail(null);}}>
          ↩ Apply Saved Configuration &amp; Regenerate
        </Button>
        <span style={{fontSize:FS.xxs,color:SECOND,lineHeight:1.4,flex:1,background:CARD,padding:'4px 8px',borderRadius:4,border:`1px solid ${BORDER}`}}>
          Restores settings &amp; runs a fresh generation. The new settlement will differ from the saved one.
        </span>
      </div>

      {/* ── Campaign-state engine ─────────────────────────────────────────
            SystemStateBar shows the four-dimension health snapshot,
            AIInlineCard prompts for AI polish when not yet narrated,
            CoherencePanel surfaces structural warnings in draft mode,
            the Make Changes panel (EventComposer) applies in-world events
            (writes to the timeline in canon mode; the Roster & Tune
            correction editor it once hosted was removed — every change
            goes through the event catalog now), Timeline displays the
            canon log. */}
      <SystemStateBar />
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
      <CoherencePanel />
      <EventComposer />
      <PendingIntentions />
      <Timeline />
      <RegionalImpactInbox
        saveId={detail?.saveData?.id || detail?.id}
        onApplied={handleRegionalImpactApplied}
      />

      {/* Provenance block. The "Next best action" rail was removed: its
          Canonize / Polish with AI / Export actions are now in the always-
          visible dossier header, so the rail was pure duplication. */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12, marginBottom: 12 }}>
        <ProvenanceBlock save={detail.saveData || detail} />
      </div>

      {/* Successor prompt — modal that appears after a pillar-tier
          KILL_NPC commits. Reads `pendingSuccession` off the slice;
          self-hides when the user dismisses or applies. The pendingState
          is set inside applyEvent() in the slice, so the modal mounts
          here at the dossier level rather than at App-root. */}
      <SuccessorPrompt />

      {/* PDF export variant picker — opened by the Export Dossier button
          in the header. Closed by Cancel or successful export. */}
      <ExportSheet
        open={exportSheetOpen}
        exporting={exporting}
        onClose={() => setExportSheetOpen(false)}
        onExport={handlePdfExport}
      />
      {pdfError && (
        <div style={{background:swatch.dangerBg,border:'1px solid #e8b0b0',borderRadius:8,padding:'10px 12px',marginBottom:12,color:swatch.danger,fontSize:FS.sm,fontFamily:sans}}>
          {pdfError}
        </div>
      )}

      {/* Neighbour links — moved out of the always-visible header into its own
          card here, under Edit Dossier. The toggle reveals the linking picker;
          the network list below shows existing links. */}
      <div style={{ border:`1px solid ${BORDER}`, borderRadius:8, overflow:'hidden', marginBottom:14 }}>
        <button type="button" aria-pressed={linking} onClick={()=>setLinking(v=>!v)} style={{ width:'100%', display:'flex', alignItems:'center', gap:8, padding:'10px 14px', background:linking?'#f5ede0':CARD, border:'none', cursor:'pointer', textAlign:'left' }}>
          <Link2 size={14} color="#2a3a7a"/>
          <span style={{ fontFamily:serif_, fontSize:FS.md, fontWeight:600, color:INK, flex:1 }}>Link a Neighbouring Settlement</span>
          <span style={{ fontSize:FS.xxs, color:MUTED }}>{linking?'Cancel':'Connect to another saved settlement'}</span>
        </button>
        {linking&&<div style={{ padding:'10px 14px', borderTop:`1px solid ${BORDER}` }}><LinkNeighbourCard currentSave={detail} allSaves={saves} onLink={handleLink}/></div>}
      </div>

      {network.length>0&&!linking&&<div style={{background:swatch.infoBg,border:'1px solid #c0c8e8',borderRadius:8,padding:'12px 14px',marginBottom:14}}>
        <div style={{fontSize:FS.xs,fontWeight:700,color:swatch.info,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:8,display:'flex',alignItems:'center',gap:6}}>
          <Link2 size={12}/> Neighbour Network ({network.length})
        </div>
        {network.map((n,i)=>{
          const c=REL_COLORS[n.relationshipType]||SECOND;
          const rel=(n.displayRelationshipType||n.localRelationshipRole||n.relationshipType||'linked').replace(/_/g,' ');
          return<div key={i} style={{display:'flex',alignItems:'center',gap:8,padding:'4px 0',borderBottom:'1px solid #dde4f8'}}>
            <div style={{width:6,height:6,borderRadius:'50%',background:c,flexShrink:0}}/>
            <span style={{fontSize:FS.sm,fontWeight:600,color:INK,flex:1}}>{n.name}</span>
            <span style={{fontSize:FS.xxs,color:c,fontWeight:600,background:`${c}18`,padding:'1px 6px',borderRadius:3}}>{rel}</span>
            <IconButton Icon={X} label="Remove link" tone="ghost" size="md" onClick={()=>removeNeighbour(i)} />
          </div>;
        })}
      </div>}

      {/* ── Network Effects (cascading modifiers) ─────────────────────────── */}
      {detail?.saveData?.id && <NetworkEffectsPanel settlementId={detail.saveData.id} saves={saves} relColors={REL_COLORS} />}

      {/* The Settlement Editor (catalog roster + Tune priorities) now lives
          inside the Make Changes panel above, embedded below the change form.
          It is no longer a separate panel — institution add/remove is owned by
          that panel's ADD_INSTITUTION / REMOVE_INSTITUTION events. */}

      {/* ── Full settlement output ──────────────────────────────────────────── */}
      {/* ── Edit Names ─────────────────────────────────────────────────────── */}
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

      {/* ── Chronicle: collapsible history log, only surfaced when a save has entries ── */}
      {saveId && Array.isArray(chronicleEntries) && chronicleEntries.length > 0 && (
        <ChroniclePanel entries={chronicleEntries} />
      )}
      </>)}

      {!editMode && (
        <>
          <ExportSheet
            open={exportSheetOpen}
            exporting={exporting}
            onClose={() => setExportSheetOpen(false)}
            onExport={handlePdfExport}
          />
          {pdfError && (
            <div style={{background:swatch.dangerBg,border:'1px solid #e8b0b0',borderRadius:8,padding:'10px 12px',marginBottom:12,color:swatch.danger,fontSize:FS.sm,fontFamily:sans}}>
              {pdfError}
            </div>
          )}
          {/* SystemStateBar (the raw "Settlement State" engine snapshot),
              the Provenance card (seed / timestamps / campaign link), the
              Narrative Chronicles log, and the Network Effects panel are
              edit-only — they render inside the editMode block above. View
              mode opens to the polished dossier (OutputContainer) with no
              raw state or bookkeeping. */}
        </>
      )}

      {detail.settlement&&<div style={{marginBottom:12}}>
        <DetailErrorBoundary>
          <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: MUTED }}>Loading...</div>}>
            {/* P139 — cap the dossier body to the shared page width (the
                detail toolbar above stays full-width). */}
            <div style={{ maxWidth: PAGE_MAX, margin: '0 auto', width: '100%' }}>
              <OutputContainer settlement={detail.settlement} readOnly saveId={saveId} />
            </div>
          </Suspense>
        </DetailErrorBoundary>
      </div>}

      <ConfirmDialog
        open={confirmRevertRaw}
        tone="warning"
        title="Revert to raw view?"
        body="The saved narrative and daily-life prose will be cleared. Chronicle history, if any, is preserved."
        confirmLabel="Revert"
        onConfirm={confirmRevertToRaw}
        onCancel={() => setConfirmRevertRaw(false)}
      />

    </div>;
}
