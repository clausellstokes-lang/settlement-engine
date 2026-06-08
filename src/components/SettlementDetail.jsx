import { useState, useMemo, useEffect, lazy, Suspense, Component } from 'react';
import {Link2, ChevronLeft, X, FileText, RotateCcw, Loader2, Edit3, Lock, Share2} from 'lucide-react';
import ShareToGallery from './ShareToGallery.jsx';
// Settlement PDF export drags in @react-pdf/renderer (~1MB) plus all PDF
// section components. Import lazily on user click so opening a settlement
// detail view doesn't pay for export machinery up front.
const generateSettlementPDF = (...args) =>
  import('../utils/generateSettlementPDF.js').then(m => m.generateSettlementPDF(...args));
import {getSettlementModifiers, EFFECT_CATEGORIES, fmtMod, REL_LABELS} from '../lib/relationshipGraph.js';
import { RELATIONSHIP_SELECTIONS } from '../domain/relationships/canonicalRelationship.js';
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
import { GOLD, INK, MUTED, SECOND, BORDER, CARD, sans, serif_, FS, swatch, PAGE_MAX } from './theme';

const REL_COLORS = {
  trade_partner:'#1a5a28', allied:'#1a3a7a', patron:'#4a1a6a',
  client:'#6a3a1a', rival:'#8a5010', cold_war:'#8a3010',
  hostile:'#8b1a1a', neutral:'#6b5340',
};

// ── Network Effects panel — shows cascading modifiers from the relationship graph ──

function NetworkEffectsPanel({ settlementId, saves }) {
  const mods = useMemo(
    () => getSettlementModifiers(settlementId, saves),
    [settlementId, saves]
  );

  const hasEffects = mods.sources.length > 0;
  if (!hasEffects) return null;

  const maxAbs = Math.max(0.01, ...EFFECT_CATEGORIES.map(c => Math.abs(mods.totals[c.key])));

  return (
    <div style={{ background: swatch['#F8F4EE'], border: `1px solid ${BORDER}`, borderRadius: 8, padding: '12px 14px', marginBottom: 14 }}>
      <div style={{ fontSize: FS.xs, fontWeight: 700, color: swatch['#5A3A1A'], textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
        Network Effects
      </div>

      {/* Category bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
        {EFFECT_CATEGORIES.map(({ key, label, _color }) => {
          const val = mods.totals[key];
          const pct = Math.min(Math.abs(val) / maxAbs, 1) * 100;
          const isPos = val >= 0;
          return (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: FS.xxs, fontWeight: 600, color: SECOND, minWidth: 80, fontFamily: sans }}>{label}</span>
              <div style={{ flex: 1, height: 8, background: swatch['#E8E0D4'], borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  [isPos ? 'left' : 'right']: 0,
                  top: 0, height: '100%',
                  width: `${pct}%`,
                  background: isPos ? '#2a7a3a' : '#8b1a1a',
                  borderRadius: 4,
                  transition: 'width 0.3s',
                }} />
              </div>
              <span style={{
                fontSize: FS.xxs, fontWeight: 700, fontFamily: 'monospace', minWidth: 42, textAlign: 'right',
                color: Math.abs(val) < 0.005 ? MUTED : isPos ? '#1a5a28' : '#8b1a1a',
              }}>
                {fmtMod(val)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Source breakdown */}
      <div style={{ fontSize: FS.xxs, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
        Sources
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {mods.sources.map((src, i) => {
          const relLabel = REL_LABELS[src.relType] || src.relType;
          const relColor = REL_COLORS[src.relType] || MUTED;
          const dominant = EFFECT_CATEGORIES.reduce((best, c) =>
            Math.abs(src.modifiers[c.key]) > Math.abs(src.modifiers[best] || 0) ? c.key : best
          , EFFECT_CATEGORIES[0].key);
          const domVal = src.modifiers[dominant];
          const depthLabel = src.depth > 1 ? ` (${src.depth}-hop, ${Math.round(src.decay * 100)}% strength)` : '';
          const trLabel = src.tierRatio && Math.abs(src.tierRatio - 1) > 0.05
            ? ` TR:${src.tierRatio.toFixed(1)}x` : '';

          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 0', borderBottom: i < mods.sources.length - 1 ? '1px solid #e8e0d4' : 'none' }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: relColor, flexShrink: 0 }} />
              <span style={{ fontSize: FS.xs, fontWeight: 600, color: INK, flex: 1 }}>
                {src.settlementName}
              </span>
              <span style={{ fontSize: FS.micro, color: relColor, fontWeight: 600, background: `${relColor}18`, padding: '1px 5px', borderRadius: 3 }}>
                {relLabel}
              </span>
              <span style={{ fontSize: FS.micro, color: MUTED }}>{depthLabel}{trLabel}</span>
              <span style={{
                fontSize: FS.xxs, fontWeight: 700, fontFamily: 'monospace',
                color: domVal >= 0 ? '#1a5a28' : '#8b1a1a',
              }}>
                {fmtMod(domVal)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

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

function LinkNeighbourCard({currentSave, allSaves, onLink}){
  const[selected,setSelected]=useState(null);
  const[relType,setRelType]=useState('neutral');
  const others=allSaves.filter(s=>{
    if(s.id===currentSave?.saveData?.id) return false;
    if(currentSave?.settlement?.neighbourNetwork?.some(n=>n.id===s.id||n.name===s.name)) return false;
    return true;
  });
  if(!others.length) return<div style={{padding:'12px 14px',fontSize:FS.sm,color:MUTED,background:swatch['#F7F0E4'],borderRadius:8,border:`1px solid ${BORDER}`}}>No other saved settlements to link.</div>;
  return<div style={{background:swatch.infoBg,border:'1px solid #c0c8e8',borderRadius:8,padding:'12px 14px'}}>
    <div style={{fontSize:FS.xs,fontWeight:700,color:swatch.info,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:8,display:'flex',alignItems:'center',gap:6}}>
      <Link2 size={12}/> Link as Neighbour
    </div>
    <div style={{display:'flex',flexDirection:'column',gap:6,marginBottom:8}}>
      {others.map(s=><button key={s.id} onClick={()=>setSelected(selected?.id===s.id?null:s)} style={{display:'flex',alignItems:'center',gap:8,padding:'7px 10px',borderRadius:5,border:`1px solid ${selected?.id===s.id?'#2a3a7a':BORDER}`,background:selected?.id===s.id?'#e8eeff':CARD,cursor:'pointer',textAlign:'left',fontFamily:sans}}>
        <span style={{flex:1,fontSize:FS.sm,fontWeight:600,color:INK}}>{s.name}</span>
        <span style={{fontSize:FS.xxs,color:MUTED}}>{s.tier}</span>
      </button>)}
    </div>
    {selected&&<div style={{padding:'8px 10px',background:swatch['#E8EEFF'],borderRadius:5,border:'1px solid #c0c8e8',display:'flex',flexDirection:'column',gap:8}}>
      <div style={{display:'flex',alignItems:'center',gap:8}}>
        <span style={{fontSize:FS.sm,flex:1,color:swatch.info,fontWeight:600}}>Link: {selected.name}</span>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
        <span style={{fontSize:FS.xs,color:SECOND}}>Relationship:</span>
        <select value={relType} onChange={e=>setRelType(e.target.value)} style={{fontSize:FS.xs,padding:'2px 6px',borderRadius:4,border:`1px solid ${BORDER}`,background:CARD,color:INK,fontFamily:sans,cursor:'pointer'}}>
          {RELATIONSHIP_SELECTIONS.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
      <div style={{display:'flex',gap:8}}>
        <button onClick={()=>onLink(selected,relType)} style={{padding:'4px 12px',borderRadius:4,background:swatch.info,color:swatch.white,border:'none',cursor:'pointer',fontSize:FS.xs,fontWeight:700,fontFamily:sans}}>Confirm</button>
        <button onClick={()=>setSelected(null)} style={{padding:'4px 10px',borderRadius:4,background:CARD,color:SECOND,border:`1px solid ${BORDER}`,cursor:'pointer',fontSize:FS.xs,fontFamily:sans}}>Cancel</button>
      </div>
    </div>}
  </div>;
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
  onLoad, onEditSettlement,
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
  const requestNarrative = useStore(s => s.requestNarrative);
  const requestProgression = useStore(s => s.requestProgression);
  const aiSettlement = useStore(s => s.aiSettlement);
  const aiDailyLife  = useStore(s => s.aiDailyLife);
  const narrated = !!(aiSettlement || aiDailyLife);

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

  // Drift resolutions for the SettlementEditor — invoked from the drift modal
  // after a structural/seismic edit is applied. `requestNarrative` re-runs the
  // full narrative pipeline against the (now-mutated) save; `requestProgression`
  // evolves the existing narrative using the change diff (AI-4);
  // `revertCurrentToRaw` clears the narrative entirely.
  const handleEditorRegenerate = async () => {
    if (saveId) await requestNarrative(saveId);
  };
  const handleEditorProgress = async (changeType, changeLabel) => {
    if (saveId) await requestProgression(saveId, { changeType, changeLabel });
  };
  const handleEditorRevert = async () => {
    if (saveId) await revertCurrentToRaw(saveId);
  };

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
          <button onClick={()=>{setDetail(null);setLinking(false);}} style={{display:'flex',alignItems:'center',gap:5,background:'rgba(255,251,245,0.96)',border:`1px solid ${BORDER}`,borderRadius:5,padding:'5px 10px',cursor:'pointer',fontSize:FS.sm,fontWeight:700,color:SECOND,fontFamily:sans}}>
            <ChevronLeft size={13}/> Back to list
          </button>
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
            <button
              onClick={handleRevertToRaw}
              title="Clear the narrative refinement and daily-life prose on this save, returning it to the raw simulator output. Chronicle history is preserved."
              style={{display:'flex',alignItems:'center',gap:5,background:CARD,color:swatch.ai,border:'1px solid rgba(160,100,220,0.45)',borderRadius:5,padding:'5px 10px',cursor:'pointer',fontSize:FS.xs,fontWeight:700,fontFamily:sans}}
            >
              <RotateCcw size={12}/> Revert to Raw
            </button>
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
          <button
            onClick={() => {
              if (canEdit) { toggleEditMode(); }
              else if (setPurchaseModalOpen) { setPurchaseModalOpen(true); }
            }}
            title={canEdit
              ? (editMode
                  ? 'Stop editing. Fields return to read-only display.'
                  : 'Edit dossier prose in place. Edits are preserved across rerolls and respected by the AI overlay.')
              : 'Manual editing is a Cartographer (premium) feature. Click to upgrade.'}
            style={{
              display:'flex',alignItems:'center',gap:5,
              background: !canEdit ? '#e8e0d2' : (editMode ? '#6a2a9a' : CARD),
              color: !canEdit ? MUTED : (editMode ? '#fff' : '#6a2a9a'),
              border: `1px solid ${!canEdit ? BORDER : 'rgba(160,100,220,0.45)'}`,
              borderRadius:5, padding:'5px 10px',
              cursor:'pointer',
              fontSize:FS.xs, fontWeight:700, fontFamily:sans,
              opacity: !canEdit ? 0.85 : 1,
            }}
          >
            {!canEdit
              ? <><Lock size={12}/> Edit (Premium)</>
              : (editMode ? <><Edit3 size={12}/> Stop Editing</> : <><Edit3 size={12}/> Edit Dossier</>)}
          </button>
          <button
            disabled={exporting}
            onClick={() => setExportSheetOpen(true)}
            title="Choose Draft Brief / Canon Dossier / Timeline Packet."
            style={{
              display:'flex',alignItems:'center',gap:5,
              background: exporting ? '#5a1414' : '#7a1a1a',
              color:swatch.white,border:'none',borderRadius:5,padding:'5px 12px',
              cursor: exporting ? 'wait' : 'pointer',
              fontSize:FS.sm,fontWeight:700,fontFamily:sans,
              opacity: exporting ? 0.85 : 1,
            }}
          >
            {exporting
              ? <><Loader2 size={12} style={{animation:'spin 1s linear infinite'}}/> Building PDF…</>
              : <><FileText size={12}/> Export Dossier</>}
          </button>
          {saveId && (
            <button
              onClick={() => setShareOpen(v => !v)}
              title="Publish this dossier to the public gallery, or manage its listing."
              style={{
                display:'flex',alignItems:'center',gap:5,
                background: shareOpen ? '#1f4a6a' : swatch.info,
                color:swatch.white,border:'none',borderRadius:5,padding:'5px 12px',
                cursor:'pointer',fontSize:FS.sm,fontWeight:700,fontFamily:sans,
              }}
            >
              <Share2 size={13}/> {shareOpen ? 'Close Gallery' : (liveSaveEntry?.is_public ? 'Edit Gallery Listing' : 'Share to Gallery')}
            </button>
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
        <button onClick={()=>{onLoad({settlement:detail.settlement,config:detail.config,institutionToggles:detail.institutionToggles,categoryToggles:detail.categoryToggles,goodsToggles:detail.goodsToggles||{},servicesToggles:detail.servicesToggles||{},});setDetail(null);}} style={{padding:'7px 14px',background:swatch.info,color:swatch.white,border:'none',borderRadius:5,cursor:'pointer',fontFamily:sans,fontSize:FS.xs,fontWeight:700}}>
          ↩ Apply Saved Configuration &amp; Regenerate
        </button>
        <span style={{fontSize:FS.xxs,color:SECOND,lineHeight:1.4,flex:1,background:CARD,padding:'4px 8px',borderRadius:4,border:`1px solid ${BORDER}`}}>
          Restores settings &amp; runs a fresh generation. The new settlement will differ from the saved one.
        </span>
      </div>

      {/* ── Campaign-state engine ─────────────────────────────────────────
            SystemStateBar shows the four-dimension health snapshot,
            AIInlineCard prompts for AI polish when not yet narrated,
            CoherencePanel surfaces structural warnings in draft mode,
            the Make Changes panel (EventComposer) applies in-world events
            (writes to the timeline in canon mode) and hosts the catalog
            roster + Tune editor below the change form, Timeline displays
            the canon log. */}
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
      <EventComposer
        config={detail.config}
        saveId={detail.saveData?.id}
        onEdit={onEditSettlement}
        narrated={narrated}
        onRegenerateNarrative={handleEditorRegenerate}
        onProgressNarrative={handleEditorProgress}
        onRevertToRaw={handleEditorRevert}
      />
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
        <button onClick={()=>setLinking(v=>!v)} style={{ width:'100%', display:'flex', alignItems:'center', gap:8, padding:'10px 14px', background:linking?'#f5ede0':CARD, border:'none', cursor:'pointer', textAlign:'left' }}>
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
            <button onClick={()=>removeNeighbour(i)} title="Remove link" style={{background:'none',border:'none',cursor:'pointer',color:MUTED,padding:2,display:'flex'}}>
              <X size={13}/>
            </button>
          </div>;
        })}
      </div>}

      {/* ── Network Effects (cascading modifiers) ─────────────────────────── */}
      {detail?.saveData?.id && <NetworkEffectsPanel settlementId={detail.saveData.id} saves={saves} />}

      {/* The Settlement Editor (catalog roster + Tune priorities) now lives
          inside the Make Changes panel above, embedded below the change form.
          It is no longer a separate panel — institution add/remove is owned by
          that panel's ADD_INSTITUTION / REMOVE_INSTITUTION events. */}

      {/* ── Full settlement output ──────────────────────────────────────────── */}
      {/* ── Edit Names ─────────────────────────────────────────────────────── */}
      {detail.settlement&&<div style={{marginBottom:14,border:`1px solid ${BORDER}`,borderRadius:8,overflow:'hidden'}}>
        <button onClick={()=>{setEditNamesOpen(v=>!v);setEditingName(null);setEditDraft('');}}
          style={{width:'100%',display:'flex',alignItems:'center',gap:8,padding:'10px 14px',
            background:editNamesOpen?'#f5ede0':CARD,border:'none',cursor:'pointer',textAlign:'left'}}>
          <span style={{fontFamily:serif_,fontSize:FS.md,fontWeight:600,color:INK,flex:1}}>
            Edit Names
          </span>
          <span style={{fontSize:FS.xxs,color:MUTED}}>NPC &amp; faction names only</span>
          <span style={{fontSize:FS.xs,color:MUTED,marginLeft:4}}>{editNamesOpen?'▲':'▼'}</span>
        </button>
        {editNamesOpen&&<div style={{padding:'10px 14px',background:CARD,borderTop:`1px solid ${BORDER}`}}>

          {/* NPCs */}
          {(detail.settlement.npcs||[]).length>0&&<>
            <div style={{fontSize:FS.xxs,fontWeight:800,color:MUTED,textTransform:'uppercase',
              letterSpacing:'0.06em',marginBottom:6}}>NPCs</div>
            <div style={{display:'flex',flexDirection:'column',gap:4,marginBottom:12}}>
              {(detail.settlement.npcs||[]).map(npc=>{
                const isEditing = editingName?.type==='npc' && editingName?.id===npc.id;
                return <div key={npc.id} style={{display:'flex',alignItems:'center',gap:8}}>
                  <span style={{fontSize:FS.xs,color:MUTED,minWidth:130,flexShrink:0}}>
                    {npc.role}
                  </span>
                  {isEditing
                    ? <><input
                        autoFocus
                        value={editDraft}
                        onChange={e=>setEditDraft(e.target.value)}
                        onKeyDown={e=>{
                          if(e.key==='Enter') handleApplyRename('npc',npc.id,npc.name,editDraft);
                          if(e.key==='Escape'){setEditingName(null);setEditDraft('');}
                        }}
                        style={{flex:1,fontSize:FS.sm,padding:'3px 7px',border:`1px solid ${GOLD}`,
                          borderRadius:4,fontFamily:sans,color:INK}}
                      />
                      <button onClick={()=>handleApplyRename('npc',npc.id,npc.name,editDraft)}
                        style={{padding:'3px 10px',background:GOLD,color:swatch.white,border:'none',
                          borderRadius:4,cursor:'pointer',fontSize:FS.xs,fontWeight:700,fontFamily:sans}}>
                        Save
                      </button>
                      <button onClick={()=>{setEditingName(null);setEditDraft('');}}
                        style={{padding:'3px 8px',background:CARD,color:MUTED,
                          border:`1px solid ${BORDER}`,borderRadius:4,cursor:'pointer',fontSize:FS.xs,fontFamily:sans}}>
                        Cancel
                      </button></>
                    : <><span style={{fontSize:FS.sm,fontWeight:600,color:INK,flex:1}}>{npc.name}</span>
                      <button onClick={()=>{setEditingName({type:'npc',id:npc.id,oldName:npc.name});setEditDraft(npc.name);}}
                        style={{padding:'2px 9px',background:swatch.infoBg,color:swatch.info,
                          border:'1px solid #c0c8e8',borderRadius:4,cursor:'pointer',fontSize:FS.xxs,fontWeight:700,fontFamily:sans}}>
                        Rename
                      </button></>}
                </div>;
              })}
            </div>
          </>}

          {/* Factions */}
          {(detail.settlement.factions||[]).length>0&&<>
            <div style={{fontSize:FS.xxs,fontWeight:800,color:MUTED,textTransform:'uppercase',
              letterSpacing:'0.06em',marginBottom:6}}>Factions</div>
            <div style={{display:'flex',flexDirection:'column',gap:4}}>
              {(detail.settlement.factions||[]).map((fac,fi)=>{
                const isEditing = editingName?.type==='faction' && editingName?.id===fac.name;
                return <div key={fi} style={{display:'flex',alignItems:'center',gap:8}}>
                  <span style={{fontSize:FS.xs,color:MUTED,minWidth:130,flexShrink:0}}>
                    {fac.dominantCategory&&fac.dominantCategory!=='other'
                      ? fac.dominantCategory
                      : fac.powerFactionName||fac.powerFactionCat||'mixed'}
                  </span>
                  {isEditing
                    ? <><input
                        autoFocus
                        value={editDraft}
                        onChange={e=>setEditDraft(e.target.value)}
                        onKeyDown={e=>{
                          if(e.key==='Enter') handleApplyRename('faction',fac.name,fac.name,editDraft);
                          if(e.key==='Escape'){setEditingName(null);setEditDraft('');}
                        }}
                        style={{flex:1,fontSize:FS.sm,padding:'3px 7px',border:`1px solid ${GOLD}`,
                          borderRadius:4,fontFamily:sans,color:INK}}
                      />
                      <button onClick={()=>handleApplyRename('faction',fac.name,fac.name,editDraft)}
                        style={{padding:'3px 10px',background:GOLD,color:swatch.white,border:'none',
                          borderRadius:4,cursor:'pointer',fontSize:FS.xs,fontWeight:700,fontFamily:sans}}>
                        Save
                      </button>
                      <button onClick={()=>{setEditingName(null);setEditDraft('');}}
                        style={{padding:'3px 8px',background:CARD,color:MUTED,
                          border:`1px solid ${BORDER}`,borderRadius:4,cursor:'pointer',fontSize:FS.xs,fontFamily:sans}}>
                        Cancel
                      </button></>
                    : <><span style={{fontSize:FS.sm,fontWeight:600,color:INK,flex:1}}>{fac.name}</span>
                      <button onClick={()=>{setEditingName({type:'faction',id:fac.name,oldName:fac.name});setEditDraft(fac.name);}}
                        style={{padding:'2px 9px',background:swatch.infoBg,color:swatch.info,
                          border:'1px solid #c0c8e8',borderRadius:4,cursor:'pointer',fontSize:FS.xxs,fontWeight:700,fontFamily:sans}}>
                        Rename
                      </button></>}
                </div>;
              })}
            </div>
          </>}

          <p style={{fontSize:FS.xxs,color:MUTED,margin:'10px 0 0',fontStyle:'italic',lineHeight:1.5}}>
            Renaming updates this settlement's JSON export and any linked neighbour references.
            Press Enter or click Save to confirm. Escape to cancel.
          </p>
        </div>}
      </div>}

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
          {/* SystemStateBar (the raw "Settlement State" engine snapshot) is
              edit-only — it renders inside the editMode block above. View mode
              opens to the polished dossier (OutputContainer) with no raw state. */}
          <div style={{ marginBottom:12 }}>
            <ProvenanceBlock save={detail.saveData || detail} />
          </div>
          {detail?.saveData?.id && (
            <NetworkEffectsPanel settlementId={detail.saveData.id} saves={saves} />
          )}
          {saveId && Array.isArray(chronicleEntries) && chronicleEntries.length > 0 && (
            <ChroniclePanel entries={chronicleEntries} />
          )}
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
