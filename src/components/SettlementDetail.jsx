import React, { useState } from 'react';
import {Link2, Download, ChevronLeft, X, FileText} from 'lucide-react';
import {downloadNarrativePrompt, downloadMapPrompt} from '../utils/promptExporters';
import {generateSettlementPDF} from '../utils/generateSettlementPDF.js';

import OutputContainer from './OutputContainer';
import {GOLD, INK, MUTED, SECOND, BORDER, CARD, sans, serif_} from './theme';

function downloadJSON(saveEntry) {
  const data = JSON.stringify(saveEntry.settlement, null, 2);
  const url = URL.createObjectURL(new Blob([data], { type: 'application/json' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: `${saveEntry.name || 'settlement'}.json` });
  document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1000);
}

const REL_COLORS = {
  trade_partner:'#1a5a28', allied:'#1a3a7a', patron:'#4a1a6a',
  client:'#6a3a1a', rival:'#8a5010', cold_war:'#8a3010',
  hostile:'#8b1a1a', neutral:'#6b5340',
};

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
  onLoad,
}) {
  const network=detail.settlement.neighbourNetwork||[];
  const [editingName, setEditingName] = useState(null);  // {type,id,oldName}
  const [editDraft,   setEditDraft]   = useState('');
  const [saved,       setSaved]       = useState(false);

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
          <button onClick={()=>setLinking(v=>!v)} style={{display:'flex',alignItems:'center',gap:5,background:linking?'#2a3a7a':CARD,color:linking?'#fff':'#2a3a7a',border:'1px solid #2a3a7a',borderRadius:5,padding:'5px 12px',cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:sans}}>
            <Link2 size={13}/> {linking?'Cancel':'Link Neighbour'}
          </button>
          <button onClick={()=>downloadJSON(detail)} style={{display:'flex',alignItems:'center',gap:5,background:'#1a4a2a',color:'#fff',border:'none',borderRadius:5,padding:'5px 12px',cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:sans}}>
            <Download size={12}/> JSON
          </button>
          <button onClick={()=>downloadNarrativePrompt(detail.settlement)} style={{display:'flex',alignItems:'center',gap:5,background:'#5a3a8a',color:'#fff',border:'none',borderRadius:5,padding:'5px 12px',cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:sans}}>Narrative AI Prompt</button>
          <button onClick={()=>downloadMapPrompt(detail.settlement)} style={{display:'flex',alignItems:'center',gap:5,background:'#8a3a1a',color:'#fff',border:'none',borderRadius:5,padding:'5px 12px',cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:sans}}>Map AI Prompt</button>
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

      {detail.settlement&&<div style={{marginBottom:12}}>
        <DetailErrorBoundary>
          <OutputContainer settlement={detail.settlement} readOnly />
        </DetailErrorBoundary>
      </div>}

    </div>;
}
