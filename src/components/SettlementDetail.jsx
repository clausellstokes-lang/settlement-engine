import React, { useState, useMemo, useEffect, lazy, Suspense } from 'react';
import {Link2, ChevronLeft, X, FileText, Sparkles, RotateCcw} from 'lucide-react';
import {generateSettlementPDF} from '../utils/generateSettlementPDF.js';
import {getSettlementModifiers, EFFECT_CATEGORIES, fmtMod, REL_LABELS} from '../lib/relationshipGraph.js';
import { useStore } from '../store/index.js';

const OutputContainer = lazy(() => import('./OutputContainer'));
import SettlementEditor from './SettlementEditor.jsx';
import ChroniclePanel from './ChroniclePanel.jsx';
import {GOLD, INK, MUTED, SECOND, BORDER, CARD, sans, serif_} from './theme';

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
    <div style={{ background: '#f8f4ee', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '12px 14px', marginBottom: 14 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#5a3a1a', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
        Network Effects
      </div>

      {/* Category bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
        {EFFECT_CATEGORIES.map(({ key, label, color }) => {
          const val = mods.totals[key];
          const pct = Math.min(Math.abs(val) / maxAbs, 1) * 100;
          const isPos = val >= 0;
          return (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: SECOND, minWidth: 80, fontFamily: sans }}>{label}</span>
              <div style={{ flex: 1, height: 8, background: '#e8e0d4', borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
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
                fontSize: 10, fontWeight: 700, fontFamily: 'monospace', minWidth: 42, textAlign: 'right',
                color: Math.abs(val) < 0.005 ? MUTED : isPos ? '#1a5a28' : '#8b1a1a',
              }}>
                {fmtMod(val)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Source breakdown */}
      <div style={{ fontSize: 10, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
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
              <span style={{ fontSize: 11, fontWeight: 600, color: INK, flex: 1 }}>
                {src.settlementName}
              </span>
              <span style={{ fontSize: 9, color: relColor, fontWeight: 600, background: `${relColor}18`, padding: '1px 5px', borderRadius: 3 }}>
                {relLabel}
              </span>
              <span style={{ fontSize: 9, color: MUTED }}>{depthLabel}{trLabel}</span>
              <span style={{
                fontSize: 10, fontWeight: 700, fontFamily: 'monospace',
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

function DetailErrorBoundary({ children }) {
  try { return children; } catch { return <div style={{padding:12,color:'#8b1a1a',fontSize:12}}>Error loading settlement output.</div>; }
}

const REL_TYPES=['neutral','trade_partner','allied','rival','cold_war','patron','client','criminal_network'];

function LinkNeighbourCard({currentSave, allSaves, onLink}){
  const[selected,setSelected]=useState(null);
  const[relType,setRelType]=useState('neutral');
  const others=allSaves.filter(s=>{
    if(s.id===currentSave?.saveData?.id) return false;
    if(currentSave?.settlement?.neighbourNetwork?.some(n=>n.id===s.id||n.name===s.name)) return false;
    return true;
  });
  if(!others.length) return<div style={{padding:'12px 14px',fontSize:12,color:MUTED,background:'#f7f0e4',borderRadius:8,border:`1px solid ${BORDER}`}}>No other saved settlements to link.</div>;
  return<div style={{background:'#f0f4ff',border:'1px solid #c0c8e8',borderRadius:8,padding:'12px 14px'}}>
    <div style={{fontSize:11,fontWeight:700,color:'#2a3a7a',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:8,display:'flex',alignItems:'center',gap:6}}>
      <Link2 size={12}/> Link as Neighbour
    </div>
    <div style={{display:'flex',flexDirection:'column',gap:6,marginBottom:8}}>
      {others.map(s=><button key={s.id} onClick={()=>setSelected(selected?.id===s.id?null:s)} style={{display:'flex',alignItems:'center',gap:8,padding:'7px 10px',borderRadius:5,border:`1px solid ${selected?.id===s.id?'#2a3a7a':BORDER}`,background:selected?.id===s.id?'#e8eeff':CARD,cursor:'pointer',textAlign:'left',fontFamily:sans}}>
        <span style={{flex:1,fontSize:12,fontWeight:600,color:INK}}>{s.name}</span>
        <span style={{fontSize:10,color:MUTED}}>{s.tier}</span>
      </button>)}
    </div>
    {selected&&<div style={{padding:'8px 10px',background:'#e8eeff',borderRadius:5,border:'1px solid #c0c8e8',display:'flex',flexDirection:'column',gap:8}}>
      <div style={{display:'flex',alignItems:'center',gap:8}}>
        <span style={{fontSize:12,flex:1,color:'#2a3a7a',fontWeight:600}}>Link: {selected.name}</span>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
        <span style={{fontSize:11,color:SECOND}}>Relationship:</span>
        <select value={relType} onChange={e=>setRelType(e.target.value)} style={{fontSize:11,padding:'2px 6px',borderRadius:4,border:`1px solid ${BORDER}`,background:CARD,color:INK,fontFamily:sans,cursor:'pointer'}}>
          {REL_TYPES.map(r=><option key={r} value={r}>{r.replace(/_/g,' ')}</option>)}
        </select>
      </div>
      <div style={{display:'flex',gap:8}}>
        <button onClick={()=>onLink(selected,relType)} style={{padding:'4px 12px',borderRadius:4,background:'#2a3a7a',color:'#fff',border:'none',cursor:'pointer',fontSize:11,fontWeight:700,fontFamily:sans}}>Confirm</button>
        <button onClick={()=>setSelected(null)} style={{padding:'4px 10px',borderRadius:4,background:CARD,color:SECOND,border:`1px solid ${BORDER}`,cursor:'pointer',fontSize:11,fontFamily:sans}}>Cancel</button>
      </div>
    </div>}
  </div>;
}

// ── Save migration ─────────────────────────────────────────────────────────
// Upgrades old save format to current schema. Safe to call on any save.
function migrateConfig(config) {
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
function buildInterSettlementNPCs(settlementA, settlementB, relType, linkId) {
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
function findSaveByName(saves, name) {
  return saves.find(s => s.name === name || s.settlement?.name === name) || null;
}

// Find a save entry by id
function findSaveById(saves, id) {
  return saves.find(s => s.id === id) || null;
}

export default function SettlementDetail({
  detail, setDetail,
  saves, setSaves,
  linking, setLinking,
  editNamesOpen, setEditNamesOpen,
  handleLink, removeNeighbour, applyRename,
  onLoad, onEditSettlement,
}) {
  const network=detail.settlement.neighbourNetwork||[];
  const [editingName, setEditingName] = useState(null);  // {type,id,oldName}
  const [editDraft,   setEditDraft]   = useState('');
  const [saved,       setSaved]       = useState(false);

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
    }
    // Clear AI state when leaving the detail view so it doesn't leak into
    // the Generate wizard or the next save that gets opened.
    return () => { clearAiSettlement(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveId]);

  const handleRevertToRaw = async () => {
    if (!saveId) return;
    const ok = window.confirm('Revert this settlement to its raw (pre-AI) view? The saved narrative and daily-life prose will be cleared. Chronicle history (if any) is preserved.');
    if (!ok) return;
    await revertCurrentToRaw(saveId);
  };

  // Wrapper: call parent applyRename then clear local edit state
  const handleApplyRename = (type, id, oldName, newName) => {
    applyRename(type, id, oldName, newName);
    setEditingName(null);
    setEditDraft('');
  };
    return<div>
      <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:16,padding:'12px 14px',background:'#f5ede0',border:`1px solid ${BORDER}`,borderRadius:8}}>
        <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
          <button onClick={()=>{setDetail(null);setLinking(false);}} style={{display:'flex',alignItems:'center',gap:5,background:'rgba(255,251,245,0.96)',border:`1px solid ${BORDER}`,borderRadius:5,padding:'5px 10px',cursor:'pointer',fontSize:12,fontWeight:700,color:SECOND,fontFamily:sans}}>
            <ChevronLeft size={13}/> Back to list
          </button>
          <span style={{fontFamily:serif_,fontSize:15,fontWeight:600,color:INK,flex:1}}>{detail.name}</span>
          {/* Narrated/Raw badge — reflects the persisted AI state on this save */}
          <span style={{
            display:'inline-flex',alignItems:'center',gap:4,
            padding:'3px 9px',borderRadius:11,fontSize:10,fontWeight:800,
            fontFamily:sans,letterSpacing:'0.07em',textTransform:'uppercase',
            background:narrated?'rgba(90,42,138,0.14)':'rgba(156,128,104,0.14)',
            color:narrated?'#6a2a9a':'#6b5340',
            border:`1px solid ${narrated?'rgba(160,100,220,0.35)':'rgba(156,128,104,0.35)'}`,
          }} title={narrated ? 'This save has an AI-generated narrative or daily-life layer.' : 'This save has no AI narrative — the raw generator output is shown.'}>
            <Sparkles size={10}/> {narrated ? 'Narrated' : 'Raw'}
          </span>
          {narrated && (
            <button
              onClick={handleRevertToRaw}
              title="Clear the AI narrative and daily-life prose on this save, returning it to the raw generator output. Chronicle history is preserved."
              style={{display:'flex',alignItems:'center',gap:5,background:CARD,color:'#6a2a9a',border:'1px solid rgba(160,100,220,0.45)',borderRadius:5,padding:'5px 10px',cursor:'pointer',fontSize:11,fontWeight:700,fontFamily:sans}}
            >
              <RotateCcw size={12}/> Revert to Raw
            </button>
          )}
          <button onClick={()=>setLinking(v=>!v)} style={{display:'flex',alignItems:'center',gap:5,background:linking?'#2a3a7a':CARD,color:linking?'#fff':'#2a3a7a',border:'1px solid #2a3a7a',borderRadius:5,padding:'5px 12px',cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:sans}}>
            <Link2 size={13}/> {linking?'Cancel':'Link Neighbour'}
          </button>
          <button onClick={()=>generateSettlementPDF(detail.settlement)} style={{display:'flex',alignItems:'center',gap:5,background:'#7a1a1a',color:'#fff',border:'none',borderRadius:5,padding:'5px 12px',cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:sans}}><FileText size={12}/> Export PDF</button>
        </div>
      </div>

      <div style={{display:'flex',gap:8,marginBottom:12,alignItems:'center',flexWrap:'wrap'}}>
        <button onClick={()=>{onLoad({settlement:detail.settlement,config:detail.config,institutionToggles:detail.institutionToggles,categoryToggles:detail.categoryToggles,goodsToggles:detail.goodsToggles||{},servicesToggles:detail.servicesToggles||{},});setDetail(null);}} style={{padding:'7px 14px',background:'#2a3a7a',color:'#fff',border:'none',borderRadius:5,cursor:'pointer',fontFamily:sans,fontSize:11,fontWeight:700}}>
          ↩ Apply Saved Configuration &amp; Regenerate
        </button>
        <span style={{fontSize:10,color:SECOND,lineHeight:1.4,flex:1,background:CARD,padding:'4px 8px',borderRadius:4,border:`1px solid ${BORDER}`}}>
          Restores settings &amp; runs a fresh generation — the new settlement will differ from the saved one.
        </span>
      </div>

      {linking&&<div style={{marginBottom:14}}><LinkNeighbourCard currentSave={detail} allSaves={saves} onLink={handleLink}/></div>}

      {network.length>0&&!linking&&<div style={{background:'#f0f4ff',border:'1px solid #c0c8e8',borderRadius:8,padding:'12px 14px',marginBottom:14}}>
        <div style={{fontSize:11,fontWeight:700,color:'#2a3a7a',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:8,display:'flex',alignItems:'center',gap:6}}>
          <Link2 size={12}/> Neighbour Network ({network.length})
        </div>
        {network.map((n,i)=>{
          const c=REL_COLORS[n.relationshipType]||SECOND;
          const rel=(n.relationshipType||'linked').replace(/_/g,' ');
          return<div key={i} style={{display:'flex',alignItems:'center',gap:8,padding:'4px 0',borderBottom:'1px solid #dde4f8'}}>
            <div style={{width:6,height:6,borderRadius:'50%',background:c,flexShrink:0}}/>
            <span style={{fontSize:12,fontWeight:600,color:INK,flex:1}}>{n.name}</span>
            <span style={{fontSize:10,color:c,fontWeight:600,background:`${c}18`,padding:'1px 6px',borderRadius:3}}>{rel}</span>
            <button onClick={()=>removeNeighbour(i)} title="Remove link" style={{background:'none',border:'none',cursor:'pointer',color:MUTED,padding:2,display:'flex'}}>
              <X size={13}/>
            </button>
          </div>;
        })}
      </div>}

      {/* ── Network Effects (cascading modifiers) ─────────────────────────── */}
      {detail?.saveData?.id && <NetworkEffectsPanel settlementId={detail.saveData.id} saves={saves} />}

      {/* ── Settlement Editor (CRUD for institutions, resources, etc.) ────── */}
      {detail?.settlement && onEditSettlement && (
        <SettlementEditor
          settlement={detail.settlement}
          config={detail.config}
          saveId={detail.saveData?.id}
          onEdit={onEditSettlement}
          narrated={narrated}
          onRegenerateNarrative={handleEditorRegenerate}
          onProgressNarrative={handleEditorProgress}
          onRevertToRaw={handleEditorRevert}
        />
      )}

      {/* ── Full settlement output ──────────────────────────────────────────── */}
      {/* ── Edit Names ─────────────────────────────────────────────────────── */}
      {detail.settlement&&<div style={{marginBottom:14,border:`1px solid ${BORDER}`,borderRadius:8,overflow:'hidden'}}>
        <button onClick={()=>{setEditNamesOpen(v=>!v);setEditingName(null);setEditDraft('');}}
          style={{width:'100%',display:'flex',alignItems:'center',gap:8,padding:'10px 14px',
            background:editNamesOpen?'#f5ede0':CARD,border:'none',cursor:'pointer',textAlign:'left'}}>
          <span style={{fontFamily:serif_,fontSize:13,fontWeight:600,color:INK,flex:1}}>
            Edit Names
          </span>
          <span style={{fontSize:10,color:MUTED}}>NPC &amp; faction names only</span>
          <span style={{fontSize:11,color:MUTED,marginLeft:4}}>{editNamesOpen?'▲':'▼'}</span>
        </button>
        {editNamesOpen&&<div style={{padding:'10px 14px',background:CARD,borderTop:`1px solid ${BORDER}`}}>

          {/* NPCs */}
          {(detail.settlement.npcs||[]).length>0&&<>
            <div style={{fontSize:10,fontWeight:800,color:MUTED,textTransform:'uppercase',
              letterSpacing:'0.06em',marginBottom:6}}>NPCs</div>
            <div style={{display:'flex',flexDirection:'column',gap:4,marginBottom:12}}>
              {(detail.settlement.npcs||[]).map(npc=>{
                const isEditing = editingName?.type==='npc' && editingName?.id===npc.id;
                return <div key={npc.id} style={{display:'flex',alignItems:'center',gap:8}}>
                  <span style={{fontSize:11,color:MUTED,minWidth:130,flexShrink:0}}>
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
                        style={{flex:1,fontSize:12,padding:'3px 7px',border:`1px solid ${GOLD}`,
                          borderRadius:4,fontFamily:sans,color:INK}}
                      />
                      <button onClick={()=>handleApplyRename('npc',npc.id,npc.name,editDraft)}
                        style={{padding:'3px 10px',background:GOLD,color:'#fff',border:'none',
                          borderRadius:4,cursor:'pointer',fontSize:11,fontWeight:700,fontFamily:sans}}>
                        Save
                      </button>
                      <button onClick={()=>{setEditingName(null);setEditDraft('');}}
                        style={{padding:'3px 8px',background:CARD,color:MUTED,
                          border:`1px solid ${BORDER}`,borderRadius:4,cursor:'pointer',fontSize:11,fontFamily:sans}}>
                        Cancel
                      </button></>
                    : <><span style={{fontSize:12,fontWeight:600,color:INK,flex:1}}>{npc.name}</span>
                      <button onClick={()=>{setEditingName({type:'npc',id:npc.id,oldName:npc.name});setEditDraft(npc.name);}}
                        style={{padding:'2px 9px',background:'#f0f4ff',color:'#2a3a7a',
                          border:'1px solid #c0c8e8',borderRadius:4,cursor:'pointer',fontSize:10,fontWeight:700,fontFamily:sans}}>
                        Rename
                      </button></>}
                </div>;
              })}
            </div>
          </>}

          {/* Factions */}
          {(detail.settlement.factions||[]).length>0&&<>
            <div style={{fontSize:10,fontWeight:800,color:MUTED,textTransform:'uppercase',
              letterSpacing:'0.06em',marginBottom:6}}>Factions</div>
            <div style={{display:'flex',flexDirection:'column',gap:4}}>
              {(detail.settlement.factions||[]).map((fac,fi)=>{
                const isEditing = editingName?.type==='faction' && editingName?.id===fac.name;
                return <div key={fi} style={{display:'flex',alignItems:'center',gap:8}}>
                  <span style={{fontSize:11,color:MUTED,minWidth:130,flexShrink:0}}>
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
                        style={{flex:1,fontSize:12,padding:'3px 7px',border:`1px solid ${GOLD}`,
                          borderRadius:4,fontFamily:sans,color:INK}}
                      />
                      <button onClick={()=>handleApplyRename('faction',fac.name,fac.name,editDraft)}
                        style={{padding:'3px 10px',background:GOLD,color:'#fff',border:'none',
                          borderRadius:4,cursor:'pointer',fontSize:11,fontWeight:700,fontFamily:sans}}>
                        Save
                      </button>
                      <button onClick={()=>{setEditingName(null);setEditDraft('');}}
                        style={{padding:'3px 8px',background:CARD,color:MUTED,
                          border:`1px solid ${BORDER}`,borderRadius:4,cursor:'pointer',fontSize:11,fontFamily:sans}}>
                        Cancel
                      </button></>
                    : <><span style={{fontSize:12,fontWeight:600,color:INK,flex:1}}>{fac.name}</span>
                      <button onClick={()=>{setEditingName({type:'faction',id:fac.name,oldName:fac.name});setEditDraft(fac.name);}}
                        style={{padding:'2px 9px',background:'#f0f4ff',color:'#2a3a7a',
                          border:'1px solid #c0c8e8',borderRadius:4,cursor:'pointer',fontSize:10,fontWeight:700,fontFamily:sans}}>
                        Rename
                      </button></>}
                </div>;
              })}
            </div>
          </>}

          <p style={{fontSize:10,color:MUTED,margin:'10px 0 0',fontStyle:'italic',lineHeight:1.5}}>
            Renaming updates this settlement's JSON export and any linked neighbour references.
            Press Enter or click Save to confirm. Escape to cancel.
          </p>
        </div>}
      </div>}

      {/* ── Chronicle: collapsible history log, only surfaced when a save has entries ── */}
      {saveId && Array.isArray(chronicleEntries) && chronicleEntries.length > 0 && (
        <ChroniclePanel entries={chronicleEntries} />
      )}

      {detail.settlement&&<div style={{marginBottom:12}}>
        <DetailErrorBoundary>
          <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: '#9c8068' }}>Loading...</div>}>
            <OutputContainer settlement={detail.settlement} readOnly saveId={saveId} />
          </Suspense>
        </DetailErrorBoundary>
      </div>}

    </div>;
}
