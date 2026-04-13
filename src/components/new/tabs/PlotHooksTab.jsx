import React, { useState } from 'react';
import {C} from '../design';
import {Ti, serif, sans} from '../Primitives';
import {EVENT_COLORS, REL_STYLES} from '../tabConstants';
import {isMobile} from '../tabConstants';

import {NarrativeNote} from '../NarrativeNote';

export function PlotHooksTab({settlement:s, narrativeNote}) {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('priority');
  if (!s) return null;
  const mobile = isMobile();

  // Human-readable tension type labels
  const TENSION_LABELS = {
    crime_wave:'Crime Wave', economic_disparity:'Economic Disparity',
    guild_conflict:'Guild Conflict', infiltration_fear:'Infiltration Fear',
    leadership_vacuum:'Leadership Vacuum', magical_controversy:'Magical Controversy',
    occupation_legacy:'Occupation Legacy', outside_debt:'External Debt',
    resource_scarcity:'Resource Scarcity', succession_crisis:'Succession Crisis',
  };

  // Category colors
  const CAT = {
    npc:      {icon:'', color:'#2a3a7a', label:'NPCs'},
    faction:  {icon:'️',  color:'#8b1a1a', label:'Factions'},
    tension:  {icon:'',  color:'#b8860b', label:'Tensions'},
    economics:{icon:'', color:'#a0762a', label:'Economy'},
    safety:   {icon:'️',  color:'#5a2a8a', label:'Safety'},
    history:      {icon:'', color:'#1a4a2a', label:'History'},
    relationship: {icon:'', color:'#5a3a1a', label:'Relationships'},
  };

  // Collect ALL hooks

  // Inline helper for the EVENT_COLORS extended map
  const ALL_EVENT_COLORS = {
    disaster:{color:'#8b1a1a',label:'Disaster'},
    political:{color:'#1a3a7a',label:'Political'},
    economic:{color:'#a0762a',label:'Economic'},
    religious:{color:'#5a2a8a',label:'Religious'},
    magical:{color:'#2a5a8a',label:'Magical'},
    demographic:{color:'#1a5a28',label:'Demographic'},
    exile_return:{color:'#7a4010',label:'Exile & Return'},
    occupation_infiltration:{color:'#3a1a6a',label:'Occupation'},
  };

  const rawHooks = [];

  // NPCs
  (s.npcs||[]).forEach(n => {
    (n.plotHooks||[]).forEach(h => {
      rawHooks.push({
        text: typeof h==='string'?h:(h?.hook||Ti(h)),
        source: n.name, role: n.role,
        sub: [n.factionAffiliation, n.influence==='high'?'●●● High influence':n.influence==='moderate'?'●● Moderate':null].filter(Boolean).join(' · '),
        category:'npc', priority: n.power||3,
        accent: n.influence==='high',
      });
    });
  });

  // Faction conflicts
  (s.conflicts||[]).forEach(c => {
    const intensity = c.intensity;
    const intColor = intensity==='high'?'#8b1a1a':intensity==='low'?'#1a5a28':'#a0762a';
    (c.plotHooks||[]).forEach(h => {
      rawHooks.push({
        text: typeof h==='string'?h:(h?.hook||Ti(h)),
        source: (c.parties||[]).join(' vs '), role: c.issue,
        sub: `${intensity||'moderate'} tension`,
        category:'faction', priority: intensity==='high'?9:intensity==='low'?5:7,
        accent: intensity==='high',
      });
    });
  });

  // History tensions (PREVIOUSLY MISSING)
  (s.history?.currentTensions||[]).forEach(t => {
    const label = TENSION_LABELS[t.type] || t.type || 'Tension';
    (t.plotHooks||[]).forEach(h => {
      rawHooks.push({
        text: typeof h==='string'?h:Ti(h),
        source: label, role: typeof t.description==='string'?t.description.slice(0,60)+'…':'',
        sub: null,
        category:'tension', priority:7,
        accent: false,
      });
    });
  });

  // NPC Relationship tensions (each rel.tension is essentially a plot hook)
  (s.relationships||[]).forEach(rel => {
    if (!rel.tension) return;
    const rs = REL_STYLES[rel.type] || REL_STYLES.respect || {color:'#6b5340'};
    rawHooks.push({
      text: rel.tension,
      source: `${rel.npc1Name} & ${rel.npc2Name}`,
      role: rel.typeName || rel.type,
      sub: `${rel.npc1Role} · ${rel.strength} · ${rel.npc2Role}`,
      category: 'relationship',
      priority: rel.flagDriven ? 8 : 6,
      accent: rel.flagDriven,
    });
  });

  // Economic viability
  (s.economicViability?.plotHooks||[]).forEach(h => {
    const hobj = typeof h==='object'?h:{hook:h,category:'Economy'};
    const hookText = (hobj.hook||String(h)).replace(/^\s*PLOT HOOK:\s*/i,'').trim();
    rawHooks.push({
      text: hookText,
      source: hobj.category||'Economy', role: '',
      sub: hobj.severity==='high'||hobj.severity==='critical' ? `${hobj.severity} severity` : null,
      category:'economics', priority: hobj.severity==='critical'?9:hobj.severity==='high'?8:7,
      accent: hobj.severity==='critical'||hobj.severity==='high',
    });
  });

  // Safety
  (s.economicState?.safetyProfile?.plotHooks||[]).forEach(h => {
    rawHooks.push({
      text: typeof h==='string'?h:(h?.hook||Ti(h)),
      source:'Safety & Crime', role:'',
      sub: null,
      category:'safety', priority:8,
      accent: false,
    });
  });

  // History events
  (s.history?.historicalEvents||[]).forEach(e => {
    const ec = ALL_EVENT_COLORS[e.type] || ALL_EVENT_COLORS.political;
    (e.plotHooks||[]).forEach(h => {
      const hookText = typeof h==='string'?h:(typeof h==='object'?(h.hook||Ti(h)):String(h));
      rawHooks.push({
        text: hookText,
        source: ec.label+' Event', role: `${e.yearsAgo}y ago`,
        sub: e.anchored ? ' Still affecting this settlement' : null,
        category:'history', priority: e.anchored?7:5,
        accent: !!e.anchored,
      });
    });
  });

  // Count per category
  const catCounts = {};
  rawHooks.forEach(h => catCounts[h.category] = (catCounts[h.category]||0)+1);

  // Sort
  const sorted = [...rawHooks].sort((a,b) => {
    if (sortBy==='priority') return b.priority - a.priority;
    return a.category.localeCompare(b.category) || b.priority - a.priority;
  });

  const filtered = filter==='all' ? sorted : sorted.filter(h=>h.category===filter);

  const categories = Object.keys(CAT).filter(c => catCounts[c]>0).sort();

  return (
    <div style={{...sans}}>
      <NarrativeNote note={narrativeNote} />

      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12,flexWrap:'wrap',gap:8}}>
        <div>
          <span style={{...serif,fontSize:17,fontWeight:600,color:'#1c1409'}}>{rawHooks.length} Plot Hooks</span>
          <span style={{fontSize:12,color:'#9c8068',marginLeft:8}}>{categories.length} sources</span>
        </div>
        {/* Sort toggle */}
        <div style={{display:'flex',gap:4}}>
          {[{key:'priority',label:'By priority'},{key:'category',label:'By source'}].map(opt=>(
            <button key={opt.key} onClick={()=>setSortBy(opt.key)}
              style={{padding:'4px 10px',borderRadius:4,border:'1px solid',fontSize:11,fontWeight:sortBy===opt.key?700:400,cursor:'pointer',
                background:sortBy===opt.key?'#1c1409':'#f7f0e4',
                color:sortBy===opt.key?'#c49a3c':'#6b5340',
                borderColor:sortBy===opt.key?'#1c1409':'#c8b89a'}}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── FILTER TABS ─────────────────────────────────────────────────── */}
      <div style={{display:'flex',gap:5,flexWrap:'wrap',marginBottom:14}}>
        <button onClick={()=>setFilter('all')} style={{
          padding:'5px 11px',borderRadius:5,border:'1px solid',fontSize:11,cursor:'pointer',
          background:filter==='all'?'#1c1409':'#f7f0e4',
          color:filter==='all'?'#c49a3c':'#6b5340',
          borderColor:filter==='all'?'#1c1409':'#c8b89a',
          fontWeight:filter==='all'?700:500,
        }}>All ({rawHooks.length})</button>
        {categories.map(cat=>{
          const meta = CAT[cat];
          const active = filter===cat;
          return <button key={cat} onClick={()=>setFilter(cat)} style={{
            padding:'5px 11px',borderRadius:5,border:`1px solid ${active?meta.color:'#c8b89a'}`,
            fontSize:11,cursor:'pointer',
            background:active?`${meta.color}18`:'#f7f0e4',
            color:active?meta.color:'#6b5340',
            fontWeight:active?700:500,
            display:'flex',alignItems:'center',gap:4,
          }}>
            <span>{meta.icon}</span>
            <span>{meta.label} ({catCounts[cat]})</span>
          </button>;
        })}
      </div>

      {/* ── HOOKS LIST ──────────────────────────────────────────────────── */}
      {filtered.length===0
        ? <div style={{padding:'24px',textAlign:'center',color:'#9c8068',fontSize:13,fontStyle:'italic'}}>No plot hooks in this category.</div>
        : <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {filtered.map((h,i)=>{
              const meta = CAT[h.category] || CAT.npc;
              const isAccent = h.accent;
              return (
                <div key={i} style={{
                  display:'flex',gap:0,borderRadius:7,overflow:'hidden',
                  border:`1px solid ${isAccent?`${meta.color}60`:'#e0d0b0'}`,
                  background:isAccent?`${meta.color}06`:'#faf8f4',
                }}>
                  {/* Category stripe */}
                  <div style={{
                    width:4,flexShrink:0,
                    background:meta.color,
                    opacity:isAccent?1:0.5,
                  }}/>
                  {/* Content */}
                  <div style={{flex:1,padding:'10px 14px',minWidth:0}}>
                    {/* Source line */}
                    <div style={{display:'flex',alignItems:'baseline',gap:6,marginBottom:5,flexWrap:'wrap'}}>
                      <span style={{fontSize:12}}>{meta.icon}</span>
                      <span style={{fontSize:11,fontWeight:700,color:meta.color}}>{h.source}</span>
                      {h.role&&<span style={{fontSize:10,color:'#9c8068'}}>{h.role}</span>}
                      {h.sub&&<span style={{fontSize:10,color:isAccent?meta.color:'#9c8068',fontStyle:!isAccent?'italic':'normal',fontWeight:isAccent?700:400,marginLeft:'auto'}}>{h.sub}</span>}
                    </div>
                    {/* Hook text */}
                    <p style={{fontSize:13,color:'#1c1409',lineHeight:1.6,margin:0}}>{h.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
      }

      <p style={{fontSize:11,color:'#9c8068',marginTop:12,fontStyle:'italic',textAlign:'right'}}>
        {rawHooks.length} hooks from {categories.length} sources
      </p>
    </div>
  );
}

export default PlotHooksTab;
