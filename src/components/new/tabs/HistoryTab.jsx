import React, { useState } from 'react';
import {C} from '../design';
import {Ti, serif, Collapsible, Section, Empty} from '../Primitives';
import {EVENT_COLORS, SEV_COLORS} from '../tabConstants';
import {isMobile} from '../tabConstants';

import {NarrativeNote} from '../NarrativeNote';

export function HistoryTab({settlement:r, narrativeNote}) {
  const [expandedEvent, setExpandedEvent] = useState(null);
  if (!r?.history) return <Empty message="No historical data available."/>;
  const h = r.history;
  const {founding, historicalEvents=[], currentTensions=[], historicalCharacter, age, eventsTimeline=[]} = h;
  const mobile = isMobile();

  // Extended event type colors (EVENT_COLORS only covers 5 types)
  const ALL_EC = {
    ...EVENT_COLORS,
    demographic: {color:'#1a5a28',bg:'#f0faf2',border:'#a8d8b0',label:'Demographic'},
    exile_return: {color:'#7a4010',bg:'#faf4ec',border:'#d8c090',label:'Exile & Return'},
    occupation_infiltration: {color:'#3a1a6a',bg:'#f4f0fd',border:'#c0b0e0',label:'Occupation'},
  };

  // Tension type icons + colors
  const TENSION_META = {
    crime_wave:          {icon:'',color:'#8b1a1a',label:'Crime Wave'},
    economic_disparity:  {icon:'',color:'#7a5010',label:'Economic Disparity'},
    guild_conflict:      {icon:'',color:'#8a4010',label:'Guild Conflict'},
    infiltration_fear:   {icon:'',color:'#3a1a6a',label:'Infiltration Fear'},
    leadership_vacuum:   {icon:'',color:'#5a5a1a',label:'Leadership Vacuum'},
    magical_controversy: {icon:'',color:'#5a2a8a',label:'Magical Controversy'},
    occupation_legacy:   {icon:'',color:'#1a2a5a',label:'Occupation Legacy'},
    outside_debt:        {icon:'',color:'#6b4010',label:'External Debt'},
    resource_scarcity:   {icon:'',color:'#7a4010',label:'Resource Scarcity'},
    succession_crisis:   {icon:'',color:'#8b1a1a',label:'Succession Crisis'},
  };

  // Sort events most recent first
  const sortedEvents = [...historicalEvents].sort((a,b) => (a.yearsAgo||0)-(b.yearsAgo||0));

  // Recency label
  const recencyLabel = yrs => yrs<=10?'Recent':yrs<=30?'Living memory':yrs<=80?'Last century':yrs<=200?'Ancient':'Deep history';
  const recencyColor = yrs => yrs<=10?'#8b1a1a':yrs<=30?'#a0762a':yrs<=80?'#5a6a1a':yrs<=200?'#2a4a7a':'#5a2a8a';

  // Build event title from type + description snippet
  const eventTitle = (evt) => {
    const ec = ALL_EC[evt.type] || ALL_EC.political;
    const descShort = typeof evt.description === 'string'
      ? evt.description.slice(0,55) + (evt.description.length>55?'…':'')
      : '';
    return {label: ec.label, desc: descShort};
  };

  return (
    <div>
      <NarrativeNote note={narrativeNote} />

      {/* ── IDENTITY HEADER ───────────────────────────────────────────────── */}
      <div style={{background:'linear-gradient(to right,#f5ede0,#ede3cc)',border:'1px solid #c8b89a',borderRadius:8,padding:'14px 18px',marginBottom:14}}>
        <div style={{display:'flex',alignItems:'baseline',gap:12,marginBottom:historicalCharacter?8:0,flexWrap:'wrap'}}>
          <span style={{...serif,fontSize:20,fontWeight:600,color:'#1c1409'}}>{r.name}</span>
          <span style={{fontSize:13,color:'#6b5340'}}>{age} years old</span>
          {sortedEvents.length>0&&<span style={{fontSize:12,color:'#9c8068'}}>{sortedEvents.length} recorded events · {currentTensions.length} current tensions</span>}
        </div>
        {historicalCharacter&&<p style={{...serif,fontSize:13.5,color:'#4a3020',lineHeight:1.65,margin:0,fontStyle:'italic'}}>"{historicalCharacter}"</p>}
      </div>

      {/* ── VISUAL TIMELINE ──────────────────────────────────────────────── */}
      {age>0&&eventsTimeline.length>0&&<div style={{marginBottom:16}}>
        <div style={{fontSize:10,fontWeight:700,color:'#6b5340',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:8}}>Timeline</div>
        <div style={{position:'relative',height:36,background:'#f0ead8',borderRadius:4,overflow:'visible',marginTop:14,marginBottom:20}}>
          {/* Axis line */}
          <div style={{position:'absolute',top:'50%',left:0,right:0,height:2,background:'#d0b880',transform:'translateY(-50%)'}}/>
          {/* "Founded" */}
          <div style={{position:'absolute',left:0,bottom:-16,fontSize:9,color:'#9c8068',fontWeight:600}}>FOUNDED</div>
          {/* "Now" */}
          <div style={{position:'absolute',right:0,bottom:-16,fontSize:9,color:'#9c8068',fontWeight:600}}>NOW</div>
          {/* Event dots + year labels with collision avoidance */}
          {(() => {
            // Sort by position to detect collisions
            const positioned = eventsTimeline.map((te,i) => ({
              ...te, i,
              pct: Math.min(97, Math.max(3, Math.round(((age - te.yearsAgo) / age) * 100))),
              ec: ALL_EC[te.type] || ALL_EC.political,
            })).sort((a,b) => a.pct - b.pct);
            // Assign label position: alternate above/below when events are within 12% of each other
            let lastPct = -100, flip = false;
            positioned.forEach(te => {
              if (te.pct - lastPct < 12) { flip = !flip; } else { flip = false; }
              te.labelAbove = flip;
              lastPct = te.pct;
            });
            return positioned.map(te => (
              <div key={te.i}>
                {/* Dot */}
                <div title={`${te.ec.label} — ${te.yearsAgo}y ago`}
                  style={{position:'absolute',left:`${te.pct}%`,top:'50%',
                    transform:'translate(-50%,-50%)',
                    width:te.anchored?14:10,height:te.anchored?14:10,
                    borderRadius:'50%',background:te.ec.color,
                    border:`2px solid ${te.anchored?'#fff':'rgba(255,255,255,0.5)'}`,
                    boxShadow:te.anchored?`0 0 0 2px ${te.ec.color}`:'none',
                    cursor:'pointer',zIndex:2}}>
                </div>
                {/* Year label — alternates above/below to avoid overlap */}
                <div style={{
                  position:'absolute',left:`${te.pct}%`,
                  top: te.labelAbove ? 1 : 27,
                  transform:'translateX(-50%)',
                  fontSize:9,fontWeight:600,
                  color:te.ec.color,
                  whiteSpace:'nowrap',
                  lineHeight:1,
                  pointerEvents:'none',
                  zIndex:3,
                }}>
                  {te.yearsAgo}y
                </div>
              </div>
            ));
          })()}
        </div>
        {/* Legend */}
        <div style={{display:'flex',gap:8,marginTop:22,flexWrap:'wrap'}}>
          {[...new Set(eventsTimeline.map(te=>te.type))].map(type=>{
            const ec = ALL_EC[type]||ALL_EC.political;
            return <span key={type} style={{display:'flex',alignItems:'center',gap:4,fontSize:10,color:'#6b5340'}}>
              <div style={{width:8,height:8,borderRadius:'50%',background:ec.color,flexShrink:0}}/>
              {ec.label}
            </span>;
          })}
          <span style={{display:'flex',alignItems:'center',gap:4,fontSize:10,color:'#6b5340'}}>
            <div style={{width:10,height:10,borderRadius:'50%',background:'#9c8068',border:'2px solid #fff',boxShadow:'0 0 0 2px #9c8068',flexShrink:0}}/>
            Still relevant today ()
          </span>
        </div>
      </div>}

      {/* ── CURRENT TENSIONS (most DM-relevant — first) ──────────────────── */}
      {currentTensions.length>0&&<Section title={`Current Tensions (${currentTensions.length})`} collapsible defaultOpen accent="#b8860b">
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {currentTensions.map((t,i)=>{
            const tm = TENSION_META[t.type] || {icon:'',color:'#b8860b',label:t.type||'Tension'};
            const sevArr = Array.isArray(t.severity)?t.severity:[t.severity].filter(Boolean);
            const maxSev = sevArr.includes('catastrophic')?'catastrophic':sevArr.includes('major')?'major':'minor';
            const border = maxSev==='catastrophic'?'#8b1a1a':maxSev==='major'?'#b8860b':'#a0762a';
            return (
              <div key={i} style={{border:`1px solid ${border}40`,borderLeft:`3px solid ${border}`,borderRadius:7,background:'#fdf8e8',padding:'12px 14px'}}>
                {/* Header */}
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6,flexWrap:'wrap'}}>
                  <span style={{fontSize:14,flexShrink:0}}>{tm.icon}</span>
                  <span style={{fontSize:11,fontWeight:700,color:tm.color,textTransform:'uppercase',letterSpacing:'0.05em'}}>{tm.label}</span>
                  {sevArr.filter(s=>s&&SEV_COLORS[s]).map((s,j)=>(
                    <span key={j} style={{fontSize:9,fontWeight:700,color:SEV_COLORS[s]||'#6b5340',background:`${SEV_COLORS[s]||'#6b5340'}18`,borderRadius:3,padding:'0 5px',letterSpacing:'0.04em'}}>{s}</span>
                  ))}
                </div>
                {/* Description */}
                <p style={{fontSize:13,color:'#3d2b1a',lineHeight:1.55,margin:'0 0 6px'}}>{typeof t==='object'?t.description||t.issue||t.type:String(t)}</p>
                {/* Factions */}
                {t.factions?.length>0&&<div style={{display:'flex',gap:4,flexWrap:'wrap',marginBottom:t.plotHooks?.length>0?8:0}}>
                  {t.factions.map((f,j)=><span key={j} style={{fontSize:10,fontWeight:600,color:'#7a5010',background:'#f5e8c0',borderRadius:3,padding:'1px 6px'}}>{f}</span>)}
                </div>}
                {/* Plot hooks — inline, prominent */}
                {t.plotHooks?.length>0&&<div style={{borderTop:`1px solid ${border}30`,paddingTop:8,marginTop:4}}>
                  <div style={{fontSize:9,fontWeight:700,color:'#5a2a8a',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:5}}>Plot Hooks</div>
                  <div style={{display:'flex',flexDirection:'column',gap:4}}>
                    {t.plotHooks.map((hook,j)=>(
                      <div key={j} style={{display:'flex',gap:7,alignItems:'flex-start'}}>
                        <span style={{color:'#5a2a8a',flexShrink:0,fontSize:12,marginTop:1}}>✦</span>
                        <p style={{fontSize:12.5,color:'#1c1409',lineHeight:1.45,margin:0}}>{hook}</p>
                      </div>
                    ))}
                  </div>
                </div>}
              </div>
            );
          })}
        </div>
      </Section>}

      {/* ── FOUNDING ─────────────────────────────────────────────────────── */}
      {founding&&<Collapsible title="Founding" defaultOpen={false}>
        <div style={{background:'#faf8f4',border:'1px solid #e0d0b0',borderLeft:'3px solid #a0762a',borderRadius:7,padding:'12px 14px'}}>
          <div style={{display:'grid',gridTemplateColumns:mobile?'1fr':'1fr 1fr',gap:'6px 14px',marginBottom:founding.stressNote?10:0}}>
            {[
              {label:'Origin',     value:founding.reason},
              {label:'Founded by', value:founding.foundedBy},
              {label:'Early trial',value:founding.initialChallenge},
              {label:'How survived',value:founding.overcoming},
            ].filter(f=>f.value).map(({label,value})=>(
              <div key={label}>
                <span style={{fontSize:9,fontWeight:700,color:'#9c8068',textTransform:'uppercase',letterSpacing:'0.05em',marginRight:5}}>{label}:</span>
                <span style={{fontSize:12.5,color:'#3d2b1a',lineHeight:1.5}}>{value}</span>
              </div>
            ))}
          </div>
          {founding.stressNote&&<div style={{background:'#fdf4ec',border:'1px solid #e0c090',borderLeft:'3px solid #b8860b',borderRadius:5,padding:'8px 10px'}}>
            <p style={{fontSize:12,color:'#5a3010',lineHeight:1.5,margin:0,fontStyle:'italic'}}>{founding.stressNote}</p>
          </div>}
        </div>
      </Collapsible>}

      {/* ── MAJOR HISTORICAL EVENTS (sorted recent first) ────────────────── */}
      {sortedEvents.length>0&&<Collapsible title={`Major Historical Events (${sortedEvents.length})`} defaultOpen={false}>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {sortedEvents.map((evt,i)=>{
            const ec = ALL_EC[evt.type] || ALL_EC.political;
            const sev = typeof evt.severity==='string'&&evt.severity.length>2 ? evt.severity : null;
            const {label:typeLabel, desc} = eventTitle(evt);
            const isAnchored = !!evt.anchored;
            const isExp = expandedEvent===i;
            const yrsColor = recencyColor(evt.yearsAgo||0);
            const yrsLabel = recencyLabel(evt.yearsAgo||0);
            return (
              <div key={i} style={{
                border:`1px solid ${isAnchored?ec.color+'60':ec.border}`,
                borderLeft:`3px solid ${ec.color}`,
                borderRadius:7, overflow:'hidden',
                background: isAnchored?ec.bg:'#faf8f4',
                cursor:'pointer',
              }} onClick={()=>setExpandedEvent(isExp?null:i)}>
                {/* Anchored banner */}
                {isAnchored&&<div style={{background:ec.color,padding:'3px 12px',display:'flex',alignItems:'center',gap:6}}>
                  <span style={{fontSize:10,fontWeight:800,color:'#fff',letterSpacing:'0.06em'}}> STILL RELEVANT TODAY</span>
                </div>}
                {/* Event header */}
                <div style={{padding:'10px 14px'}}>
                  <div style={{display:'flex',alignItems:'flex-start',gap:8,marginBottom:4,flexWrap:'wrap'}}>
                    <div style={{flex:1,minWidth:120}}>
                      <div style={{display:'flex',alignItems:'center',gap:6,flexWrap:'wrap',marginBottom:2}}>
                        <span style={{fontSize:11,fontWeight:700,color:ec.color,textTransform:'uppercase',letterSpacing:'0.04em'}}>{typeLabel}</span>
                        {sev&&<span style={{fontSize:9,fontWeight:700,color:SEV_COLORS[sev]||'#6b5340',background:`${SEV_COLORS[sev]||'#6b5340'}15`,borderRadius:3,padding:'0 5px'}}>{sev}</span>}
                      </div>
                      <p style={{fontSize:13,color:'#1c1409',lineHeight:1.45,margin:0}}>{desc}</p>
                    </div>
                    <div style={{flexShrink:0,textAlign:'right'}}>
                      <div style={{fontSize:12,fontWeight:700,color:yrsColor}}>{evt.yearsAgo}y ago</div>
                      <div style={{fontSize:9,color:yrsColor,textTransform:'uppercase',letterSpacing:'0.04em',marginTop:1}}>{yrsLabel}</div>
                    </div>
                    <span style={{fontSize:10,color:'#9c8068',flexShrink:0,paddingTop:2}}>{isExp?'▲':'▼'}</span>
                  </div>
                </div>
                {/* Expanded detail */}
                {isExp&&<div style={{padding:'0 14px 12px 14px',borderTop:`1px solid ${ec.border}`}}>
                  {evt.lastingEffects?.length>0&&<div style={{marginBottom:8}}>
                    <span style={{fontSize:10,fontWeight:700,color:'#6b5340',textTransform:'uppercase',letterSpacing:'0.05em'}}>Lasting Effects: </span>
                    <span style={{fontSize:11.5,color:'#6b5340'}}>{evt.lastingEffects.join(' · ')}</span>
                  </div>}
                  {evt.plotHooks?.length>0&&<div style={{borderTop:`1px solid ${ec.border}`,paddingTop:8,marginTop:4}}>
                    <div style={{fontSize:9,fontWeight:700,color:'#5a2a8a',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:5}}>Plot Hooks</div>
                    {evt.plotHooks.map((hook,j)=>{
                      const hookText = typeof hook==='object'?hook.hook||Ti(hook):hook;
                      return <div key={j} style={{display:'flex',gap:7,marginBottom:4}}>
                        <span style={{color:'#5a2a8a',flexShrink:0,fontSize:12}}>✦</span>
                        <p style={{fontSize:12.5,color:'#1c1409',lineHeight:1.45,margin:0}}>{hookText}</p>
                      </div>;
                    })}
                  </div>}
                </div>}
              </div>
            );
          })}
        </div>
      </Collapsible>}

    </div>
  );
}

export default React.memo(HistoryTab);
