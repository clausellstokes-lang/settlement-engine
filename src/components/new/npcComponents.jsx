import React, { useState } from 'react';
import { Pin } from 'lucide-react';
import {C, catColor} from './design';
import {Ti, serif, PlotHook} from './Primitives';
import {REL_STYLES} from './tabConstants';
import {isMobile} from './tabConstants';

/**
 * Stable identifier used to pin an NPC. Matches the backend filter contract
 * in supabase/functions/generate-narrative/index.ts — `npc.id` when defined,
 * otherwise `npc.name`. Kept at module scope so every consumer agrees.
 */
function npcPinKey(npc) {
  if (npc?.id != null) return String(npc.id);
  if (npc?.name != null) return String(npc.name);
  return null;
}

export function NPCCategoryGroup({category, label, group, impFilter, search, relationships=[], pinnedIds, onTogglePin}) {
  const [open, setOpen] = useState(true);
  const color = catColor(category);
  const displayLabel = label || (category.charAt(0).toUpperCase() + category.slice(1));
  const filtered = group.filter(npc => {
    if (impFilter && impFilter !== 'all' && npc.influence !== impFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (npc.name||'').toLowerCase().includes(q) ||
             (npc.role||'').toLowerCase().includes(q) ||
             (npc.factionAffiliation||'').toLowerCase().includes(q);
    }
    return true;
  });
  if (!filtered.length) return null;
  // Sort: high first, then moderate, then low, then by power
  const sorted = [...filtered].sort((a,b) => {
    const ord = {high:0,moderate:1,low:2};
    const ia = ord[a.influence]??2, ib = ord[b.influence]??2;
    if (ia !== ib) return ia - ib;
    if ((b.power||0) !== (a.power||0)) return (b.power||0) - (a.power||0);
    return (a.name||'').localeCompare(b.name||'');
  });
  return (
    <div style={{marginBottom:14}}>
      <button onClick={()=>setOpen(v=>!v)} style={{width:'100%',display:'flex',alignItems:'center',gap:8,background:'none',border:'none',cursor:'pointer',padding:'4px 0',WebkitTapHighlightColor:'transparent',marginBottom:open?8:0}}>
        <div style={{height:1,flex:1,background:`${color}35`}}/>
        <span style={{fontSize:11,fontWeight:700,color,textTransform:'uppercase',letterSpacing:'0.07em',flexShrink:0}}>{displayLabel} ({filtered.length})</span>
        {sorted.filter(n=>n.influence==='high').length > 0 &&
          <span style={{fontSize:9,fontWeight:700,color,background:`${color}18`,borderRadius:3,padding:'0 4px',flexShrink:0}}>●●● ×{sorted.filter(n=>n.influence==='high').length}</span>
        }
        <span style={{fontSize:10,color:'#9c8068',flexShrink:0}}>{open?'▲':'▼'}</span>
        <div style={{height:1,flex:1,background:`${color}35`}}/>
      </button>
      {open && sorted.map(npc => <NPCInlineCard key={npc.id||npc.name} npc={npc} relationships={relationships} pinnedIds={pinnedIds} onTogglePin={onTogglePin}/>)}
    </div>
  );
}


function NPCRelCard({rel, style={color:'#6b5340',bg:'#faf8f4',border:'#e0d0b0'}}) {
  const [open,setOpen]=useState(false);
  return (
    <div style={{border:`1px solid ${style.border}`,borderLeft:`3px solid ${style.color}`,borderRadius:7,overflow:'hidden',marginBottom:10}}>
      <button onClick={()=>setOpen(v=>!v)} style={{width:'100%',background:open?style.bg:'#faf8f4',border:'none',cursor:'pointer',padding:'10px 14px',textAlign:'left',WebkitTapHighlightColor:'transparent'}}>
        <div style={{display:'flex',alignItems:'flex-start',gap:8}}>
          <div style={{flex:1}}>
            <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap',marginBottom:3}}>
              <span style={{...serif,fontSize:15,fontWeight:700,color:'#1c1409'}}>{rel.npc1Name}</span>
              <span style={{fontSize:9,fontWeight:800,color:style.color,background:style.bg,border:`1px solid ${style.border}`,borderRadius:3,padding:'1px 6px',letterSpacing:'0.05em'}}>{rel.typeName||rel.type}</span>
              <span style={{...serif,fontSize:15,fontWeight:700,color:'#1c1409'}}>{rel.npc2Name}</span>
              {rel.flagDriven&&<span style={{fontSize:9,fontWeight:700,color:'#5a2a8a',background:'#f0ebff',borderRadius:3,padding:'1px 6px'}}>◆ EMERGENT</span>}
            </div>
            <div style={{fontSize:11,color:'#9c8068'}}>{rel.npc1Role} · {rel.strength} · {rel.npc2Role}</div>
          </div>
          <span style={{fontSize:11,color:'#9c8068',flexShrink:0,paddingTop:2}}>{open?'▲':'▼'}</span>
        </div>
      </button>
      {open&&<div style={{padding:'10px 14px',background:'rgba(250,248,244,0.97)',borderTop:`1px solid ${style.border}`}}>
        <p style={{fontSize:13,color:'#3d2b1a',lineHeight:1.6,margin:'0 0 10px'}}>{rel.description}</p>
        {rel.tension&&<div style={{background:'#fdf8e8',border:'1px solid #e0c860',borderLeft:'3px solid #b8860b',borderRadius:5,padding:'7px 10px',fontSize:12,color:'#5a3a10',lineHeight:1.5}}> {rel.tension}</div>}
      </div>}
    </div>
  );
}

export function NPCRelCard2({rel, style={color:'#6b5340',bg:'#faf8f4',border:'#e0d0b0'}}) {
  const [open,setOpen]=useState(false);
  return (
    <div style={{border:`1px solid ${style.border}`,borderLeft:`3px solid ${style.color}`,borderRadius:7,overflow:'hidden',marginBottom:10}}>
      <button onClick={()=>setOpen(v=>!v)} style={{width:'100%',background:open?style.bg:'#faf8f4',border:'none',cursor:'pointer',padding:'10px 14px',textAlign:'left',WebkitTapHighlightColor:'transparent'}}>
        <div style={{display:'flex',alignItems:'flex-start',gap:8}}>
          <div style={{flex:1}}>
            <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap',marginBottom:3}}>
              <span style={{...serif,fontSize:15,fontWeight:700,color:'#1c1409'}}>{rel.npc1Name}</span>
              <span style={{fontSize:9,fontWeight:800,color:style.color,background:style.bg,border:`1px solid ${style.border}`,borderRadius:3,padding:'1px 6px',letterSpacing:'0.05em'}}>{rel.typeName||rel.type}</span>
              <span style={{...serif,fontSize:15,fontWeight:700,color:'#1c1409'}}>{rel.npc2Name}</span>
              {rel.flagDriven&&<span style={{fontSize:9,fontWeight:700,color:'#5a2a8a',background:'#f0ebff',borderRadius:3,padding:'1px 6px'}}>◆ EMERGENT</span>}
            </div>
            <div style={{fontSize:11,color:'#9c8068'}}>{rel.npc1Role} · {rel.strength} · {rel.npc2Role}</div>
          </div>
          <span style={{fontSize:11,color:'#9c8068',flexShrink:0,paddingTop:2}}>{open?'▲':'▼'}</span>
        </div>
      </button>
      {open&&<div style={{padding:'10px 14px',background:'rgba(250,248,244,0.97)',borderTop:`1px solid ${style.border}`}}>
        <p style={{fontSize:13,color:'#3d2b1a',lineHeight:1.6,margin:'0 0 10px'}}>{rel.description}</p>
        {rel.tension&&<div style={{background:'#fdf8e8',border:'1px solid #e0c860',borderLeft:'3px solid #b8860b',borderRadius:5,padding:'7px 10px',fontSize:12,color:'#5a3a10',lineHeight:1.5}}> {rel.tension}</div>}
      </div>}
    </div>
  );
}

export function ConflictCard({conflict:c}) {
  const [open,setOpen]=useState(false);
  const intStyle={high:{color:'#8b1a1a',label:'HIGH TENSION'},moderate:{color:'#a0762a',label:'MODERATE TENSION'},low:{color:'#1a5a28',label:'LOW TENSION'}};
  const d=intStyle[c.intensity]||intStyle.moderate;
  return (
    <div style={{background:'#fdf4f4',border:'1px solid #e8c0c0',borderLeft:'3px solid #8b1a1a',borderRadius:7,padding:'12px 14px',marginBottom:10}}>
      <div style={{display:'flex',alignItems:'baseline',gap:8,marginBottom:6}}>
        <span style={{fontSize:9,fontWeight:800,color:d.color,background:`${d.color}18`,borderRadius:3,padding:'1px 6px',letterSpacing:'0.05em'}}>{d.label}</span>
        <span style={{...serif,fontSize:14,fontWeight:600,color:'#1c1409'}}>{c.parties?.[0]} vs {c.parties?.[1]}</span>
      </div>
      <p style={{fontSize:13,color:'#3d2b1a',lineHeight:1.5,margin:'0 0 6px'}}>{c.desc||c.description}</p>
      {c.stakes&&<div style={{fontSize:11,color:'#9c8068',marginBottom:8}}><strong>At stake:</strong> {c.stakes}</div>}
      {c.plotHooks?.length>0&&<div style={{borderTop:'1px solid #e8c0c0',paddingTop:8,marginTop:4}}>
        {c.plotHooks.map((h,i)=><PlotHook key={i} text={typeof h==='string'?h:h.hook||Ti(h)}/>)}
      </div>}
    </div>
  );
}


// Inline NPC card — replaces the removed NPCCard export
function NPCInlineCard({ npc, relationships=[], pinnedIds, onTogglePin }) {
  const [open, setOpen] = useState(false);
  const color = catColor(npc.category);
  const infDots = npc.influence==='high' ? '●●●' : npc.influence==='moderate' ? '●●' : '●';
  const infColor = npc.influence==='high' ? '#a0762a' : npc.influence==='moderate' ? '#6b5340' : '#9c8068';
  const personality = Array.isArray(npc.personality)
    ? [npc.personality[0], npc.personality[1]]
    : [npc.personality?.dominant, npc.personality?.flaw];
  const traits = personality.filter(Boolean);

  // Pin UI is optional. When `onTogglePin` isn't provided (read-only views,
  // unsaved settlements) the icon doesn't render at all. `pinnedIds` is a Set
  // of pin keys; we compute isPinned against the same key the backend filters
  // on so the UI state can't drift from the edge function's behaviour.
  const pinKey = npcPinKey(npc);
  const pinAvailable = typeof onTogglePin === 'function' && pinKey != null;
  const isPinned = pinAvailable && pinnedIds instanceof Set && pinnedIds.has(pinKey);
  const pinColor = '#6a2a9a'; // purple — ties visually to the narrative accent.

  return (
    <div style={{
      background:'#faf8f4',
      border:`1px solid ${isPinned ? '#c8a8e8' : `${color}20`}`,
      borderLeft:`3px solid ${isPinned ? pinColor : color}`,
      borderRadius:6,marginBottom:6,overflow:'hidden',
      // Subtle tint when pinned — mirrors the narrative panel's purple wash.
      boxShadow: isPinned ? `inset 2px 0 0 rgba(106,42,154,0.08)` : 'none',
    }}>
      <button onClick={()=>setOpen(v=>!v)} style={{width:'100%',display:'flex',alignItems:'center',gap:8,padding:'8px 12px',background:'none',border:'none',cursor:'pointer',textAlign:'left',WebkitTapHighlightColor:'transparent'}}>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:'flex',alignItems:'baseline',gap:6,flexWrap:'wrap'}}>
            <span style={{...serif,fontSize:14,fontWeight:700,color:'#1c1409'}}>{npc.name}</span>
            <span style={{fontSize:10,color:'#9c8068'}}>{npc.title}</span>
            <span style={{fontSize:11,fontWeight:700,color:infColor,marginLeft:'auto',flexShrink:0}}>{infDots}</span>
          </div>
          <div style={{fontSize:11,color:'#6b5340'}}>{npc.role}{npc.factionAffiliation ? ` · ${npc.factionAffiliation}` : ''}</div>
        </div>
        {pinAvailable && (
          <span
            role="button"
            tabIndex={0}
            onClick={(e)=>{ e.stopPropagation(); onTogglePin(pinKey); }}
            onKeyDown={(e)=>{ if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); onTogglePin(pinKey); } }}
            title={isPinned
              ? 'Pinned — this NPC will not be rewritten by regenerate/progress.'
              : 'Pin this NPC so regenerate/progress leaves it unchanged.'}
            style={{
              display:'inline-flex',alignItems:'center',justifyContent:'center',
              width:22,height:22,flexShrink:0,
              borderRadius:4,
              background: isPinned ? 'rgba(106,42,154,0.12)' : 'transparent',
              border: `1px solid ${isPinned ? 'rgba(160,100,220,0.45)' : 'transparent'}`,
              color: isPinned ? pinColor : '#b8a898',
              cursor:'pointer',
              transition:'all 0.15s',
            }}
          >
            <Pin size={12} fill={isPinned ? pinColor : 'none'} strokeWidth={isPinned ? 2 : 1.7}/>
          </span>
        )}
        <span style={{fontSize:10,color:'#9c8068',flexShrink:0}}>{open?'▲':'▼'}</span>
      </button>
      {open && (
        <div style={{padding:'0 12px 10px',borderTop:`1px solid ${color}15`}}>
          {traits.length > 0 && (
            <div style={{display:'flex',gap:4,flexWrap:'wrap',marginBottom:6,marginTop:6}}>
              {traits.map((t,i) => <span key={i} style={{fontSize:10,color:'#6b5340',background:'#ede3cc',borderRadius:3,padding:'0 5px'}}>{t}</span>)}
            </div>
          )}
          {npc.goal?.short && (
            <p style={{fontSize:12,color:'#3d2b1a',margin:'4px 0',lineHeight:1.4}}>
              <span style={{color:'#a0762a',fontWeight:700}}>→ </span>{npc.goal.short}
            </p>
          )}
          {npc.structuralPosition && (
            <p style={{fontSize:11,color:'#6b5340',margin:'4px 0',lineHeight:1.4,fontStyle:'italic'}}>{npc.structuralPosition}</p>
          )}
          {npc.activeConstraint && (
            <p style={{fontSize:11,color:'#8b1a1a',margin:'4px 0',lineHeight:1.4}}>
              <span style={{fontWeight:700}}>Constraint: </span>{npc.activeConstraint}
            </p>
          )}
          {npc.secret && (
            <div style={{marginTop:6,background:'#f5f0e8',borderRadius:4,padding:'5px 8px'}}>
              <span style={{fontSize:10,fontWeight:700,color:'#6b5340'}}>Secret: </span>
              <span style={{fontSize:11,color:'#3d2b1a'}}>{typeof npc.secret==='string' ? npc.secret : npc.secret.what}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
