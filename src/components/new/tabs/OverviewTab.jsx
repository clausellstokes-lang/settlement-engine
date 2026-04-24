import React, { useState } from 'react';
import {C} from '../design';
import {Ti, serif, Section} from '../Primitives';
import {PROSPERITY_COLORS} from '../tabConstants';
import {isMobile} from '../tabConstants';

import {NarrativeNote} from '../NarrativeNote';

export function OverviewTab({ settlement:r, narrativeNote}) {
  const [instOpen, setInstOpen] = useState(false);
  const [spatialOpen, setSpatialOpen] = useState(false);
  if (!r) return null;
  const mobile = isMobile();

  const eco = r.economicState || {};
  const dp = r.defenseProfile || {};
  const scores = dp.scores || {};
  const via = r.economicViability || {};
  const sp = eco.safetyProfile || {};
  const ps = r.powerStructure || {};
  const hist = r.history || {};
  const ra = r.resourceAnalysis || {};
  const stresses = (Array.isArray(r.stress) ? r.stress : r.stress ? [r.stress] : []).filter(Boolean);
  const foodBal = via.metrics?.foodBalance;

  // Institution layout
  const byCategory = r.institutions.reduce((acc,m)=>((acc[m.category]=acc[m.category]||[]).push(m),acc),{});
  const catOrder = ['government','military','economy','religious','magic','criminal','other'];
  const catColors2 = {government:'#2a3a7a',military:'#8b1a1a',economy:'#a0762a',religious:'#1a5a28',magic:'#5a2a8a',criminal:'#4a1a4a',other:'#5a4a2a',Essential:'#6b5340',Crafts:'#7a4a1a',Infrastructure:'#1a4a5a',Defense:'#8b1a1a',Entertainment:'#7a1a5a',Adventuring:'#1a5a3a'};
  const getCatColor = c => catColors2[c] || '#6b5340';

  // Score bar inline helper
  const ScoreRow = ({label,score,icon}) => {
    const n = Math.min(100,Math.max(0,score||0));
    const c = n>=70?'#1a5a28':n>=45?'#a0762a':n>=25?'#8a4010':'#8b1a1a';
    return (
      <div style={{marginBottom:8}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:3}}>
          <span style={{fontSize:11,color:'#3d2b1a',fontWeight:600}}>{icon} {label}</span>
          <span style={{fontSize:11,fontWeight:700,color:c}}>{Math.round(n)}</span>
        </div>
        <div style={{height:6,background:'#e8dcc8',borderRadius:3,overflow:'hidden'}}>
          <div style={{height:'100%',width:`${n}%`,background:c,borderRadius:3,transition:'width 0.4s'}}/>
        </div>
      </div>
    );
  };

  // System status tag
  const StatusTag = ({label,value,color,accent}) => (
    <div style={{flex:'1 1 130px',background:accent?`${accent}0d`:'#faf8f4',border:`1px solid ${accent?`${accent}35`:'#e0d0b0'}`,borderLeft:`3px solid ${accent||'#c8b89a'}`,borderRadius:6,padding:'7px 10px',minWidth:0}}>
      <div style={{fontSize:9,fontWeight:700,color:accent||'#6b5340',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:3}}>{label}</div>
      <div style={{fontSize:12,fontWeight:700,color:'#1c1409',lineHeight:1.3}}>{value||'—'}</div>
    </div>
  );

  return (
    <div>
      <NarrativeNote note={narrativeNote} />

      {/* ── IDENTITY + KEY FACTS STRIP ───────────────────────────────────── */}
      <div style={{background:'linear-gradient(to right,#f5ede0,#ede3cc)',border:'1px solid #c8b89a',borderRadius:8,padding:'12px 16px',marginBottom:14}}>
        <div style={{display:'flex',alignItems:'baseline',gap:10,flexWrap:'wrap',marginBottom:6}}>
          <span style={{...serif,fontSize:20,fontWeight:600,color:'#1c1409'}}>{r.name}</span>
          <span style={{fontSize:13,color:'#6b5340',textTransform:'capitalize'}}>{r.tier}</span>
          <span style={{fontSize:12,color:'#9c8068'}}>·</span>
          <span style={{fontSize:12,color:'#6b5340'}}>{r.population?.toLocaleString()} pop.</span>
          {r.config?.tradeRouteAccess&&<><span style={{fontSize:12,color:'#9c8068'}}>·</span><span style={{fontSize:12,color:'#6b5340',textTransform:'capitalize'}}>{r.config.tradeRouteAccess.replace(/_/g,' ')}</span></>}
          {hist.age&&<><span style={{fontSize:12,color:'#9c8068'}}>·</span><span style={{fontSize:12,color:'#6b5340'}}>{hist.age} years old</span></>}
        </div>
        {/* Row 2: character + spatial */}
        <div style={{display:'flex',gap:16,flexWrap:'wrap'}}>
          {hist.historicalCharacter&&<p style={{fontSize:12,color:'#5a3a1a',fontStyle:'italic',margin:0,flex:'2 1 200px',lineHeight:1.5}}>"{hist.historicalCharacter}"</p>}
          <div style={{display:'flex',gap:8,flex:'1 1 160px',alignItems:'flex-start',flexWrap:'wrap'}}>
            {ra.terrain&&<span style={{fontSize:11,color:'#1a4a2a',background:'#e8f0e8',border:'1px solid #a8d0a8',borderRadius:4,padding:'2px 8px',fontWeight:600}}>{ra.terrain}</span>}
            {r.spatialLayout?.layout&&<span style={{fontSize:11,color:'#3d2b1a',background:'#f0ead8',border:'1px solid #d0c090',borderRadius:4,padding:'2px 8px'}}>{r.spatialLayout.layout}</span>}
          </div>
        </div>
      </div>

      {/* ── ACTIVE CRISIS (compact if present) ───────────────────────────── */}
      {stresses.length>0&&<div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:14}}>
        {stresses.map((v,i)=>(
          <div key={i} style={{display:'flex',gap:12,alignItems:'flex-start',background:`${v.colour}0e`,border:`2px solid ${v.colour}`,borderRadius:8,padding:'10px 14px'}}>
            <span style={{fontSize:18,flexShrink:0}}>{v.icon}</span>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                <span style={{...serif,fontSize:15,fontWeight:700,color:v.colour}}>{v.label}</span>
                <span style={{fontSize:9,fontWeight:800,color:'#fff',background:v.colour,borderRadius:4,padding:'1px 6px',letterSpacing:'0.06em'}}>ACTIVE CRISIS</span>
              </div>
              <p style={{fontSize:12.5,color:'#1c1409',lineHeight:1.5,margin:'0 0 4px'}}>{v.summary}</p>
              <p style={{fontSize:11,color:'#3a2a10',fontStyle:'italic',margin:0}}><span style={{fontWeight:700,fontStyle:'normal',color:v.colour}}>Hook: </span>{v.crisisHook}</p>
            </div>
          </div>
        ))}
      </div>}

      {/* ── SYSTEMS HEALTH DASHBOARD ─────────────────────────────────────── */}
      <Section title="Systems Health" collapsible defaultOpen accent="#3d2b1a">

        {/* Status tags row */}
        <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:14}}>
          <StatusTag label="Prosperity" value={eco.prosperity} accent={PROSPERITY_COLORS[eco.prosperity]}/>
          <StatusTag label="Safety" value={sp.safetyLabel?.split('—')[0].trim()} accent={sp.safetyLabel?.includes('Dangerous')||sp.safetyLabel?.includes('Desperate')?'#8b1a1a':sp.safetyLabel?.includes('Unsafe')?'#a0580a':sp.safetyLabel?.includes('Safe')?'#1a5a28':'#a0762a'}/>
          <StatusTag label="Viability" value={via.viable===false?'Not Viable':via.viable===true?'Viable':'—'} accent={via.viable===false?'#8b1a1a':via.viable===true?'#1a5a28':undefined}/>
          <StatusTag label="Defense" value={dp.readiness?.label} accent={dp.readiness?.color}/>
        </div>

        {/* Magic dependency badge */}
        {dp.magicDependency&&<div style={{display:'flex',alignItems:'center',gap:6,
          background:'#f8f0ff',border:'1px solid #c0a0e0',borderRadius:5,
          padding:'5px 10px',marginTop:6}}>
          <span style={{fontSize:12,color:'#5a2a8a'}}>✦</span>
          <span style={{fontSize:11,fontWeight:600,color:'#5a2a8a'}}>Magic Dependency</span>
          <span style={{fontSize:10,color:'#7a4aaa',flex:1}}>— resilience relies on magical infrastructure. See Viability tab.</span>
        </div>}

        {/* Score bars — 2-col grid */}
        <div style={{display:'grid',gridTemplateColumns:mobile?'1fr':'1fr 1fr',gap:'0 24px'}}>
          <ScoreRow label="Military Might" score={scores.military} icon=""/>
          <ScoreRow label="Monster Defense" score={scores.monster} icon=""/>
          <ScoreRow label="Internal Security" score={scores.internal} icon=""/>
          <ScoreRow label="Economic Resilience" score={scores.economic} icon=""/>
          <ScoreRow label="Magical Capability" score={scores.magical} icon=""/>
          {sp.safetyRatio!==undefined&&<div style={{marginBottom:8}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:3}}>
              <span style={{fontSize:11,color:'#3d2b1a',fontWeight:600}}> Enforcement Ratio</span>
              <span style={{fontSize:11,fontWeight:700,color:sp.safetyRatio>=2?'#1a5a28':sp.safetyRatio>=1?'#a0762a':'#8b1a1a'}}>{typeof sp.safetyRatio==='number'?sp.safetyRatio.toFixed(1):'—'}×</span>
            </div>
            <div style={{height:6,background:'#e8dcc8',borderRadius:3,overflow:'hidden'}}>
              <div style={{height:'100%',width:`${Math.min(100,(sp.safetyRatio||0)*25)}%`,background:sp.safetyRatio>=2?'#1a5a28':sp.safetyRatio>=1?'#a0762a':'#8b1a1a',borderRadius:3}}/>
            </div>
          </div>}
        </div>

        {/* Food balance if significant */}
        {foodBal?.deficit>0&&<div style={{marginTop:10,paddingTop:10,borderTop:'1px solid #f0e8d8',display:'flex',alignItems:'center',gap:8}}>
          <span style={{fontSize:12,color:'#8b1a1a',fontWeight:700}}> Food Deficit</span>
          <div style={{flex:1,background:'#e8dcc8',borderRadius:3,height:6,overflow:'hidden'}}>
            <div style={{height:'100%',width:`${Math.min(100,foodBal.deficitPercent)}%`,background:'#8b1a1a',borderRadius:3}}/>
          </div>
          <span style={{fontSize:11,fontWeight:700,color:'#8b1a1a',flexShrink:0}}>{foodBal.deficitPercent}%</span>
        </div>}
      </Section>

      {/* ── CURRENT TENSIONS & CONFLICTS ─────────────────────────────────── */}
      {(hist.currentTensions?.length>0||(r.conflicts||[]).length>0)&&<Section title="Tensions & Conflicts" collapsible defaultOpen accent="#b8860b">
        {hist.currentTensions?.map((t,i)=>(
          <div key={i} style={{display:'flex',gap:8,marginBottom:6,paddingBottom:6,borderBottom:i<hist.currentTensions.length-1||(r.conflicts||[]).length>0?'1px solid #e8d080':'none'}}>
            <span style={{fontSize:12,flexShrink:0,marginTop:1,color:'#b8860b'}}>▸</span>
            <div>
              <p style={{fontSize:13,color:'#3d2b1a',lineHeight:1.45,margin:0}}>{typeof t==='object'?t.description:t}</p>
              {t.factions?.length>0&&<div style={{display:'flex',gap:4,marginTop:3,flexWrap:'wrap'}}>
                {t.factions.map((f,j)=><span key={j} style={{fontSize:10,fontWeight:600,color:'#7a5010',background:'#f5e8c0',borderRadius:3,padding:'0 5px'}}>{f}</span>)}
              </div>}
            </div>
          </div>
        ))}
        {(r.conflicts||[]).map((c,i)=>{
          const iHigh=c.intensity==='high';
          return <div key={i} style={{display:'flex',gap:8,marginBottom:6}}>
            <span style={{fontSize:12,flexShrink:0,marginTop:1,color:iHigh?'#8b1a1a':'#a0762a'}}></span>
            <div>
              <div style={{display:'flex',gap:6,alignItems:'baseline',flexWrap:'wrap'}}>
                <span style={{fontSize:12,fontWeight:700,color:'#1c1409'}}>{c.parties?.[0]} vs {c.parties?.[1]}</span>
                <span style={{fontSize:9,fontWeight:800,color:iHigh?'#8b1a1a':'#a0762a',background:iHigh?'#fdf0f0':'#faf0dc',border:`1px solid ${iHigh?'#e8c0c0':'#d8c080'}`,borderRadius:3,padding:'0 4px'}}>{iHigh?'HIGH':'MODERATE'}</span>
              </div>
              {c.issue&&<p style={{fontSize:11,color:'#6b5340',margin:'2px 0 0',lineHeight:1.3}}>{c.issue}</p>}
            </div>
          </div>;
        })}
      </Section>}

      {/* ── SITUATION (arrival + pressure — more compact here) ───────────── */}
      {(r.arrivalScene||r.pressureSentence)&&<div style={{background:'#1c1409',borderRadius:8,padding:'12px 16px',marginBottom:14,border:'1px solid #3a2a10'}}>
        {r.arrivalScene&&<p style={{...serif,fontSize:13,color:'#f0e8d8',lineHeight:1.7,margin:0,fontStyle:'italic'}}>{r.arrivalScene}</p>}
        {r.arrivalScene&&r.pressureSentence&&<hr style={{border:'none',borderTop:'1px solid #3a2a10',margin:'8px 0'}}/>}
        {r.pressureSentence&&<p style={{fontSize:12,color:'#d4c4a0',lineHeight:1.55,margin:0,fontStyle:'italic'}}>{r.pressureSentence}</p>}
      </div>}

      {/* ── SETTLEMENT ORIGIN ─────────────────────────────────────────────── */}
      {r.settlementReason&&<Section title="Settlement Origin" collapsible defaultOpen={false} accent="#6b5340">
        <div style={{borderLeft:'3px solid #c8b89a',paddingLeft:12}}>
          {Array.isArray(r.settlementReason)
            ?r.settlementReason.map((line,i)=><p key={i} style={{fontSize:13,color:'#3d2b1a',lineHeight:1.6,margin:'0 0 4px',fontStyle:'italic'}}>{line}</p>)
            :<p style={{fontSize:13,color:'#3d2b1a',lineHeight:1.6,margin:0,fontStyle:'italic'}}>{Ti(r.settlementReason?.primary||r.settlementReason)}</p>
          }
        </div>
      </Section>}

      {/* ── NOTABLE CONNECTION ────────────────────────────────────────────── */}
      {r.prominentRelationship?.phrasing&&<div style={{background:'#f7f0e4',border:'1px solid #d8c090',borderLeft:'3px solid #6b5340',borderRadius:7,padding:'9px 13px',marginBottom:14}}>
        <div style={{fontSize:10,fontWeight:700,color:'#6b5340',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:4}}>Notable Connection</div>
        <p style={{fontSize:12.5,...serif,color:'#3a2a10',lineHeight:1.6,margin:0,fontStyle:'italic'}}>{r.prominentRelationship.phrasing}</p>
        <p style={{fontSize:10,color:'#9c8068',margin:'5px 0 0'}}>→ Full relationship web in the Relationships tab.</p>
      </div>}

      {/* ── RESOURCE CONTEXT (terrain strengths) ─────────────────────────── */}
      {(ra.terrain||ra.economicStrengths?.length>0||ra.strategicValue)&&<Section title="Geography & Resources" collapsible defaultOpen={false} accent="#1a5a28">
        <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
          {ra.terrain&&<div style={{flex:'1 1 100px'}}>
            <div style={{fontSize:9,fontWeight:700,color:'#1a5a28',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:3}}>Terrain</div>
            <div style={{fontSize:12,fontWeight:600,color:'#1c1409'}}>{ra.terrain}</div>
          </div>}
          {ra.economicStrengths?.length>0&&<div style={{flex:'2 1 160px'}}>
            <div style={{fontSize:9,fontWeight:700,color:'#1a5a28',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:3}}>Strengths</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
              {ra.economicStrengths.slice(0,4).map((s,i)=><span key={i} style={{fontSize:11,color:'#1a5a28',background:'#e0f0e0',borderRadius:4,padding:'1px 6px'}}>{s}</span>)}
            </div>
          </div>}
          {ra.strategicValue&&<div style={{flex:'2 1 160px'}}>
            <div style={{fontSize:9,fontWeight:700,color:'#1a5a28',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:3}}>Strategic Value</div>
            <div style={{fontSize:11,color:'#3d2b1a',lineHeight:1.4}}>{ra.strategicValue}</div>
          </div>}
        </div>
      </Section>}

      {/* ── SPATIAL LAYOUT ────────────────────────────────────────────────── */}
      {r.spatialLayout?.quarters?.length>0&&<div style={{border:'1px solid #c8d8b0',borderRadius:8,overflow:'hidden',marginBottom:14}}>
        <button onClick={()=>setSpatialOpen(v=>!v)} style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'9px 13px',background:spatialOpen?'#edf5e8':'#f4faf0',border:'none',cursor:'pointer',WebkitTapHighlightColor:'transparent'}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <span style={{fontSize:11,fontWeight:700,color:'#1a4a2a',textTransform:'uppercase',letterSpacing:'0.06em'}}>Spatial Layout</span>
            <span style={{fontSize:11,color:'#9c8068'}}>{r.spatialLayout.quarters.length} quarters</span>
          </div>
          <span style={{fontSize:11,color:'#9c8068'}}>{spatialOpen?'▲':'▼'}</span>
        </button>
        {spatialOpen&&<div style={{padding:'10px 14px',borderTop:'1px solid #c8d8b0'}}>
          {r.spatialLayout.layout&&<p style={{fontSize:12,fontWeight:600,color:'#3d2b1a',margin:'0 0 10px'}}>{r.spatialLayout.layout}</p>}
          <div style={{display:'grid',gridTemplateColumns:mobile?'1fr':'repeat(auto-fill,minmax(180px,1fr))',gap:8}}>
            {r.spatialLayout.quarters.map((q,i)=>(
              <div key={i} style={{background:'#faf8f4',border:'1px solid #d8c8a0',borderRadius:6,padding:'8px 10px'}}>
                <div style={{fontSize:12,fontWeight:700,color:'#1c1409',marginBottom:3}}>{q.name}</div>
                <p style={{fontSize:11,color:'#6b5340',lineHeight:1.4,margin:0}}>{q.desc}</p>
                {q.landmarks?.slice(0,1).map((lm,j)=><p key={j} style={{fontSize:10,color:'#9c8068',margin:'3px 0 0'}}>• {lm}</p>)}
              </div>
            ))}
          </div>
        </div>}
      </div>}

      {/* ── WARNINGS & COHERENCE NOTES ────────────────────────────────────── */}
      {((r.structuralViolations?.length||0)+(r.coherenceNotes?.length||0)+(r.structuralSuggestions?.length||0)>0)&&<div style={{marginBottom:14}}>
        {r.structuralViolations?.length>0&&<div style={{background:'#fdf4f4',border:'1px solid #e8c0c0',borderLeft:'3px solid #8b1a1a',borderRadius:7,padding:'10px 14px',marginBottom:8}}>
          <div style={{fontSize:11,fontWeight:700,color:'#8b1a1a',marginBottom:4}}> Structural Issues</div>
          {r.structuralViolations.map((v,i)=><div key={i} style={{fontSize:12,color:'#5a1a1a',marginBottom:3}}><span style={{fontWeight:700}}>{v.institution||v.group}: </span>{v.reason}</div>)}
        </div>}
        {r.coherenceNotes?.filter(n=>n.severity==='contradiction').map((note,i)=>(
          <div key={i} style={{background:'#fdf4f0',border:'1px solid #d4a090',borderLeft:'3px solid #8b3a1a',borderRadius:7,padding:'8px 13px',marginBottom:6,display:'flex',gap:8}}>
            <span style={{color:'#8b3a1a',flexShrink:0}}></span>
            <span style={{fontSize:12.5,color:'#3d2b1a',lineHeight:1.5}}>{note.note||Ti(note)}</span>
          </div>
        ))}
        {r.coherenceNotes?.filter(n=>n.severity!=='contradiction').map((note,i)=>(
          <div key={i} style={{background:'#f0f4fd',border:'1px solid #a0b4d4',borderLeft:'3px solid #1a3a8b',borderRadius:7,padding:'8px 13px',marginBottom:6,display:'flex',gap:8}}>
            <span style={{color:'#1a3a8b',flexShrink:0}}>ℹ</span>
            <span style={{fontSize:12.5,color:'#3d2b1a',lineHeight:1.5}}>{note.note||Ti(note)}</span>
          </div>
        ))}
        {r.structuralSuggestions?.length>0&&<div style={{background:'#f4f6fd',border:'1px solid #c0cce8',borderLeft:'3px solid #2a3a7a',borderRadius:7,padding:'10px 14px'}}>
          <div style={{fontSize:11,fontWeight:700,color:'#2a3a7a',marginBottom:4}}> Suggestions</div>
          {r.structuralSuggestions.map((v,i)=><div key={i} style={{fontSize:12,color:'#1a2a5a',marginBottom:3}}>{v.reason}{v.suggested&&<span style={{color:'#6b5340',fontStyle:'italic'}}> — consider: {v.suggested.join(', ')}</span>}</div>)}
        </div>}
      </div>}

      {/* ── INSTITUTIONS ──────────────────────────────────────────────────── */}
      <div style={{border:'1px solid #e0d0b0',borderRadius:8,overflow:'hidden'}}>
        <button onClick={()=>setInstOpen(v=>!v)} style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 14px',background:instOpen?'#f0e8d8':'#f7f0e4',border:'none',cursor:'pointer',WebkitTapHighlightColor:'transparent'}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <span style={{fontSize:11,fontWeight:700,color:'#6b5340',textTransform:'uppercase',letterSpacing:'0.06em'}}>Institutions</span>
            <span style={{fontSize:11,color:'#9c8068'}}>{r.institutions.length} total</span>
          </div>
          <div style={{display:'flex',gap:6,alignItems:'center',flexWrap:'wrap',justifyContent:'flex-end'}}>
            {Object.entries(byCategory).sort((a,b)=>b[1].length-a[1].length).slice(0,5).map(([cat,insts])=>(
              <span key={cat} style={{fontSize:10,fontWeight:600,color:getCatColor(cat),background:`${getCatColor(cat)}15`,borderRadius:3,padding:'1px 5px'}}>{cat} {insts.length}</span>
            ))}
            <span style={{fontSize:11,color:'#9c8068',marginLeft:4}}>{instOpen?'▲':'▼'}</span>
          </div>
        </button>
        {instOpen&&<div style={{padding:'10px 14px',borderTop:'1px solid #e0d0b0'}}>
          {/* Visual category distribution bar */}
          <div style={{display:'flex',height:8,borderRadius:4,overflow:'hidden',gap:1,marginBottom:12}}>
            {Object.entries(byCategory).sort((a,b)=>b[1].length-a[1].length).map(([cat,insts])=>(
              <div key={cat} title={`${cat}: ${insts.length}`} style={{flex:insts.length,background:getCatColor(cat),minWidth:insts.length>0?4:0}}/>
            ))}
          </div>
          {/* Categories with pills */}
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {Object.entries(byCategory).sort((a,b)=>a[0].localeCompare(b[0])).map(([cat,insts])=>{
              const cc=getCatColor(cat);
              return <div key={cat}>
                <div style={{fontSize:10,fontWeight:700,color:cc,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:4}}>{cat} ({insts.length})</div>
                <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
                  {insts.sort((a,b)=>a.name.localeCompare(b.name)).map((inst,i)=>{
                    const srcColor={required:'#a0762a',forced:'#2d7a44','auto-resolved':'#2a3a7a'}[inst.source]||'#6b5340';
                    const srcLabel={required:'REQ',forced:'','auto-resolved':'→'}[inst.source];
                    return <span key={i} style={{fontSize:11,padding:'2px 8px',borderRadius:4,background:`${srcColor}10`,border:`1px solid ${srcColor}30`,color:'#1c1409',fontWeight:500,display:'inline-flex',alignItems:'center',gap:4}}>
                      {inst.name}
                      {srcLabel&&<span style={{fontSize:8,fontWeight:800,color:srcColor,letterSpacing:'0.04em'}}>{srcLabel}</span>}
                    </span>;
                  })}
                </div>
              </div>;
            })}
          </div>
          {/* Legend */}
          <div style={{display:'flex',gap:14,marginTop:10,paddingTop:8,borderTop:'1px solid #f0e8d8',fontSize:10,color:'#9c8068',flexWrap:'wrap'}}>
            {[['REQ','#a0762a','Historically required'],['','#2d7a44','Force-added by you'],['→','#2a3a7a','Auto-resolved dependency']].map(([lbl,c,desc])=>(
              <span key={lbl}><span style={{color:c,fontWeight:800}}>{lbl}</span> = {desc}</span>
            ))}
          </div>
        </div>}
      </div>

    </div>
  );
}

export default React.memo(OverviewTab);
